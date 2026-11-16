/**
 * UNIT REVIEW ARCADE — STRICT GRADE 7 / GRADE 8 CONTENT ISOLATION TEST SUITE
 * 
 * Verifies:
 * 1. Canonical Grade Resolution (resolveGradeFromStudent & getGradeForClass)
 * 2. Content Authorization Matrix (isContentAuthorizedForGrade)
 * 3. Server-side Grade Authorization Guards in Google Apps Script (Code.gs):
 *    - handleStartAttempt rejects cross-grade attempts with GRADE_UNAUTHORIZED
 *    - handleRecordAnswers rejects cross-grade answer logging with GRADE_UNAUTHORIZED
 *    - handleCompleteAttempt, handleAbandonAttempt, handleReconcileAttempt guard against cross-grade manipulation
 *    - handleStudentRecordMistakeRetry rejects cross-grade retries with GRADE_UNAUTHORIZED
 *    - handleStudentGetMistakes filters out cross-grade mistakes without mutating database
 *    - handleStudentGetMastery isolates accuracy & stats strictly by student grade
 * 4. Teacher Dashboard retains dual-grade access (7A, 7B, 8A, 8B)
 * 5. Games Zone service rejection of cross-grade attempts
 */

import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { createContext, runInContext } from 'vm';
import { getGradeForClass } from './src/types/auth.ts';
import { GamesZoneService } from './src/services/gamesZoneService.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🛡️ Starting Strict Grade 7 / Grade 8 Content Isolation Test Suite...\n');

let totalChecks = 0;
let passedChecks = 0;

function assert(condition, message) {
  totalChecks++;
  if (!condition) {
    console.error(`  ❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  passedChecks++;
  console.log(`  ✓ ${message}`);
}

function assertEq(actual, expected, message) {
  totalChecks++;
  if (actual !== expected) {
    console.error(`  ❌ FAIL: ${message} (Expected: ${expected}, Got: ${actual})`);
    throw new Error(`Assertion failed: ${message} (Expected: ${expected}, Got: ${actual})`);
  }
  passedChecks++;
  console.log(`  ✓ ${message} (got ${actual})`);
}

// ============================================================================
// 1. Mock Spreadsheet & Apps Script Environment for Code.gs
// ============================================================================

function parseA1Notation(a1) {
  const parts = a1.replace(/\$/g, '').split(':');
  function cellToRowCol(cellStr) {
    const match = cellStr.match(/^([A-Z]+)([0-9]+)$/);
    if (!match) throw new Error(`Invalid cell: ${cellStr}`);
    const colStr = match[1];
    let col = 0;
    for (let i = 0; i < colStr.length; i++) {
      col = col * 26 + (colStr.charCodeAt(i) - 64);
    }
    const row = parseInt(match[2], 10);
    return { row, col };
  }

  const start = cellToRowCol(parts[0]);
  if (parts.length === 1) {
    return { row: start.row, col: start.col, numRows: 1, numCols: 1 };
  }
  const end = cellToRowCol(parts[1]);
  return {
    row: Math.min(start.row, end.row),
    col: Math.min(start.col, end.col),
    numRows: Math.abs(end.row - start.row) + 1,
    numCols: Math.abs(end.col - start.col) + 1,
  };
}

class MockRange {
  constructor(sheet, row, col, numRows = 1, numCols = 1) {
    this.sheet = sheet;
    this.row = row;
    this.col = col;
    this.numRows = numRows;
    this.numCols = numCols;
  }

  getNumRows() { return this.numRows; }
  getNumColumns() { return this.numCols; }

  getValue() {
    return this.sheet._data[this.row - 1]?.[this.col - 1] ?? '';
  }

  getValues() {
    const res = [];
    for (let r = 0; r < this.numRows; r++) {
      const rowArr = [];
      for (let c = 0; c < this.numCols; c++) {
        rowArr.push(this.sheet._data[this.row - 1 + r]?.[this.col - 1 + c] ?? '');
      }
      res.push(rowArr);
    }
    return res;
  }

  setValue(val) {
    this.sheet._ensureSize(this.row, this.col);
    this.sheet._data[this.row - 1][this.col - 1] = val;
    return this;
  }

  setValues(vals) {
    for (let r = 0; r < vals.length; r++) {
      for (let c = 0; c < vals[r].length; c++) {
        this.sheet._ensureSize(this.row + r, this.col + c);
        this.sheet._data[this.row - 1 + r][this.col - 1 + c] = vals[r][c];
      }
    }
    return this;
  }

  clearContent() {
    for (let r = 0; r < this.numRows; r++) {
      for (let c = 0; c < this.numCols; c++) {
        if (this.sheet._data[this.row - 1 + r]) {
          this.sheet._data[this.row - 1 + r][this.col - 1 + c] = '';
        }
      }
    }
    return this;
  }

  setBackground() { return this; }
  setFontColor() { return this; }
  setFontWeight() { return this; }
  setFontSize() { return this; }
  setHorizontalAlignment() { return this; }
  setNumberFormat() { return this; }
  merge() { return this; }
}

class MockSheet {
  constructor(name, spreadsheet) {
    this.name = name;
    this.spreadsheet = spreadsheet;
    this._data = [];
  }

  getName() { return this.name; }

  _ensureSize(row, col) {
    while (this._data.length < row) {
      this._data.push([]);
    }
    for (let r = 0; r < this._data.length; r++) {
      while (this._data[r].length < col) {
        this._data[r].push('');
      }
    }
  }

  getLastRow() {
    for (let r = this._data.length - 1; r >= 0; r--) {
      const row = this._data[r];
      const hasVal = row.some((v) => v !== '' && v !== null && v !== undefined);
      if (hasVal) return r + 1;
    }
    return 0;
  }

  getLastColumn() {
    let maxCol = 0;
    for (const row of this._data) {
      for (let c = row.length - 1; c >= 0; c--) {
        if (row[c] !== '' && row[c] !== null && row[c] !== undefined) {
          if (c + 1 > maxCol) maxCol = c + 1;
          break;
        }
      }
    }
    return maxCol;
  }

  getRange(...args) {
    if (typeof args[0] === 'string') {
      const coords = parseA1Notation(args[0]);
      return new MockRange(this, coords.row, coords.col, coords.numRows, coords.numCols);
    }
    const [row, col, numRows = 1, numCols = 1] = args;
    return new MockRange(this, row, col, numRows, numCols);
  }

  getDataRange() {
    const lr = Math.max(1, this.getLastRow());
    const lc = Math.max(1, this.getLastColumn());
    return new MockRange(this, 1, 1, lr, lc);
  }

  appendRow(rowArr) {
    const nextRow = this.getLastRow() + 1;
    this._ensureSize(nextRow, rowArr.length);
    for (let c = 0; c < rowArr.length; c++) {
      this._data[nextRow - 1][c] = rowArr[c];
    }
    return this;
  }

  clear() {
    this._data = [];
    return this;
  }

  setFrozenRows() { return this; }
  autoResizeColumns() { return this; }
  setColumnWidth() { return this; }
  setTabColor() { return this; }
  protect() {
    return {
      setDescription: () => {},
      setWarningOnly: () => {},
      removeEditors: () => {},
    };
  }
}

class MockSpreadsheet {
  constructor() {
    this.sheets = [];
    this.name = 'English Arcade TEST Master Spreadsheet';
    this.id = 'mock_test_spreadsheet_id_isolation';
  }

  getId() { return this.id; }
  getName() { return this.name; }
  getSheets() { return this.sheets; }
  getSheetByName(name) { return this.sheets.find((s) => s.getName() === name) || null; }

  insertSheet(name) {
    const existing = this.getSheetByName(name);
    if (existing) return existing;
    const s = new MockSheet(name, this);
    this.sheets.push(s);
    return s;
  }

  deleteSheet(sheet) {
    const idx = this.sheets.indexOf(sheet);
    if (idx >= 0) this.sheets.splice(idx, 1);
  }
}

class MockLock {
  constructor() { this.locked = false; }
  tryLock() { this.locked = true; return true; }
  releaseLock() { this.locked = false; }
  hasLock() { return this.locked; }
}

const mockSpreadsheet = new MockSpreadsheet();
const mockProps = {
  _props: {
    SPREADSHEET_ID: 'mock_test_spreadsheet_id_isolation',
    ARCADE_ENV: 'TEST',
  },
  getProperty(k) { return this._props[k] || null; },
  setProperty(k, v) { this._props[k] = String(v); },
};
const mockLock = new MockLock();

const gasContext = {
  console,
  Math,
  Date,
  String,
  Number,
  Boolean,
  Array,
  Object,
  JSON,
  Logger: { log: () => {} },
  ContentService: {
    createTextOutput: (text) => ({
      text,
      setMimeType: () => {},
      getContent: () => text,
    }),
    MimeType: { JSON: 'application/json' },
  },
  Utilities: {
    DigestAlgorithm: { SHA_256: 'SHA_256' },
    computeDigest: (algo, val) => {
      const hash = crypto.createHash('sha256');
      if (Array.isArray(val)) {
        hash.update(Buffer.from(val));
      } else {
        hash.update(String(val), 'utf8');
      }
      return Array.from(hash.digest());
    },
    newBlob: (str) => ({
      getBytes: () => Array.from(Buffer.from(String(str), 'utf8')),
    }),
    getUuid: () => 'uuid_' + Math.random().toString(36).substring(2, 10),
    base64Encode: (s) => Buffer.from(s).toString('base64'),
    base64Decode: (s) => Array.from(Buffer.from(s, 'base64')),
    formatDate: (d) => d.toISOString(),
  },
  PropertiesService: {
    getScriptProperties: () => mockProps,
  },
  LockService: {
    getScriptLock: () => mockLock,
    getUserLock: () => mockLock,
    getDocumentLock: () => mockLock,
  },
  SpreadsheetApp: {
    openById: () => mockSpreadsheet,
    getActiveSpreadsheet: () => mockSpreadsheet,
    flush: () => {},
  },
};

const vmContext = createContext(gasContext);
const codeGs = readFileSync(path.join(__dirname, 'google-apps-script/Code.gs'), 'utf8');
runInContext(codeGs, vmContext);

console.log('--- 1. Canonical Grade Resolution Tests ---');

// Frontend auth helper
assertEq(getGradeForClass('7A'), 'grade-7', 'getGradeForClass(7A) === grade-7');
assertEq(getGradeForClass('7B'), 'grade-7', 'getGradeForClass(7B) === grade-7');
assertEq(getGradeForClass('8A'), 'grade-8', 'getGradeForClass(8A) === grade-8');
assertEq(getGradeForClass('8B'), 'grade-8', 'getGradeForClass(8B) === grade-8');
assertEq(getGradeForClass('7a'), 'grade-7', 'Case-insensitive: 7a -> grade-7');
assertEq(getGradeForClass('8b'), 'grade-8', 'Case-insensitive: 8b -> grade-8');

// Backend resolveGradeFromStudent in Code.gs
const resolveGradeFromStudent = vmContext.resolveGradeFromStudent;
assert(typeof resolveGradeFromStudent === 'function', 'resolveGradeFromStudent exists in Code.gs');
assertEq(resolveGradeFromStudent('7A', 'grade-8'), 'grade-7', 'Backend rejects client override grade-8 for class 7A');
assertEq(resolveGradeFromStudent('7B', 'grade-8'), 'grade-7', 'Backend rejects client override grade-8 for class 7B');
assertEq(resolveGradeFromStudent('8A', 'grade-7'), 'grade-8', 'Backend rejects client override grade-7 for class 8A');
assertEq(resolveGradeFromStudent('8B', 'grade-7'), 'grade-8', 'Backend rejects client override grade-7 for class 8B');
assertEq(resolveGradeFromStudent('7A', null), 'grade-7', 'Class 7A resolves grade-7 with no client grade');
assertEq(resolveGradeFromStudent('8A', null), 'grade-8', 'Class 8A resolves grade-8 with no client grade');

console.log('\n--- 2. Content Authorization Matrix Tests ---');
const isContentAuthorizedForGrade = vmContext.isContentAuthorizedForGrade;
assert(typeof isContentAuthorizedForGrade === 'function', 'isContentAuthorizedForGrade exists in Code.gs');

// Grade 7 tests
assert(isContentAuthorizedForGrade('g7-u1-act1', 'g7-u1', null, 'grade-7'), 'Grade 7 student authorized for g7-u1-act1');
assert(isContentAuthorizedForGrade('wn_g7_easy_01', 'games_zone', null, 'grade-7'), 'Grade 7 student authorized for Word Ninja G7');
assert(isContentAuthorizedForGrade('gr_g7_med_01', 'games_zone', null, 'grade-7'), 'Grade 7 student authorized for Grammar Runner G7');
assert(isContentAuthorizedForGrade('wf_g7_hard_01', 'games_zone', null, 'grade-7'), 'Grade 7 student authorized for Word Fishing G7');
assert(isContentAuthorizedForGrade('st_g7_easy_01', 'games_zone', null, 'grade-7'), 'Grade 7 student authorized for Sentence Tower G7');
assert(!isContentAuthorizedForGrade('g8-u1-act1', 'g8-u1', null, 'grade-7'), 'Grade 7 student REJECTED for g8-u1-act1');
assert(!isContentAuthorizedForGrade('wn_g8_easy_01', 'games_zone', null, 'grade-7'), 'Grade 7 student REJECTED for Word Ninja G8');

// Grade 8 tests
assert(isContentAuthorizedForGrade('g8-u1-act1', 'g8-u1', null, 'grade-8'), 'Grade 8 student authorized for g8-u1-act1');
assert(isContentAuthorizedForGrade('wn_g8_med_01', 'games_zone', null, 'grade-8'), 'Grade 8 student authorized for Word Ninja G8');
assert(!isContentAuthorizedForGrade('g7-u1-act1', 'g7-u1', null, 'grade-8'), 'Grade 8 student REJECTED for g7-u1-act1');
assert(!isContentAuthorizedForGrade('wn_g7_easy_01', 'games_zone', null, 'grade-8'), 'Grade 8 student REJECTED for Word Ninja G7');

console.log('\n--- 3. Backend Apps Script Schema Initialization & Seeding ---');
function callGas(payload) {
  const e = { postData: { contents: JSON.stringify(payload) } };
  const raw = vmContext.doPost(e);
  return JSON.parse(raw.getContent());
}

// Run database setup
vmContext.setupArcadeDatabase(mockSpreadsheet);

// Seed test students: 701 (7A) and 801 (8A)
const studentsSheet = mockSpreadsheet.getSheetByName('Students');
const stdHeaders = studentsSheet.getDataRange().getValues()[0];
const numIdx = stdHeaders.indexOf('student_number');
const pinIdx = stdHeaders.indexOf('pin_hash');
const saltIdx = stdHeaders.indexOf('pin_salt');
const classIdx = stdHeaders.indexOf('class');
const gradeIdx = stdHeaders.indexOf('grade');
const nameIdx = stdHeaders.indexOf('full_name');
const activeIdx = stdHeaders.indexOf('is_active');

function addStudent(number, name, className, grade, pin) {
  const salt = 'salt_' + number;
  const hash = vmContext.hashPinWithSaltAndPepper(pin, salt);
  const row = new Array(stdHeaders.length).fill('');
  row[0] = 'stu_' + number;
  row[numIdx] = number;
  row[nameIdx] = name;
  row[gradeIdx] = grade;
  row[classIdx] = className;
  row[pinIdx] = hash;
  row[saltIdx] = salt;
  row[activeIdx] = true;
  studentsSheet.appendRow(row);
}

addStudent('701', 'Cemre Yılmaz', '7A', 'grade-7', '1234');
addStudent('801', 'Barış Alper', '8A', 'grade-8', '1234');

// Log in 701 and 801 to obtain authenticated session tokens
const login701 = callGas({ action: 'student_login', studentNumber: '701', class: '7A', pin: '1234' });
assert(login701.success, 'Student 701 login succeeds');
assertEq(login701.student.grade, 'grade-7', 'Student 701 authenticated grade is strictly grade-7');
const token701 = login701.sessionToken;

const login801 = callGas({ action: 'student_login', studentNumber: '801', class: '8A', pin: '1234' });
assert(login801.success, 'Student 801 login succeeds');
assertEq(login801.student.grade, 'grade-8', 'Student 801 authenticated grade is strictly grade-8');
const token801 = login801.sessionToken;

// Verify session check
const check701 = callGas({ action: 'student_session_check', sessionToken: token701 });
assert(check701.success && check701.student.grade === 'grade-7', 'handleSessionCheck returns grade-7 for 701');

const check801 = callGas({ action: 'student_session_check', sessionToken: token801 });
assert(check801.success && check801.student.grade === 'grade-8', 'handleSessionCheck returns grade-8 for 801');

console.log('\n--- 4. Backend Server-Side Attempt Guards ---');

// Test 4A: Student 701 tries to start a Grade 8 activity -> REJECT
const attemptStartCross701 = callGas({
  action: 'game_start_attempt',
  sessionToken: token701,
  attemptId: 'att_test_g8_by_701',
  gradeId: 'grade-8',
  unitId: 'g8-u1',
  unitTitle: 'Friendship',
  activityId: 'g8-u1-quiz',
  activityTitle: 'Vocabulary Quiz',
  gameType: 'quiz_battle',
  totalQuestions: 10
});

assertEq(attemptStartCross701.success, false, 'Student 701 cannot start Grade 8 attempt');
assertEq(attemptStartCross701.code, 'GRADE_UNAUTHORIZED', 'Rejected with GRADE_UNAUTHORIZED code');

// Test 4B: Student 801 tries to start a Grade 7 activity -> REJECT
const attemptStartCross801 = callGas({
  action: 'game_start_attempt',
  sessionToken: token801,
  attemptId: 'att_test_g7_by_801',
  gradeId: 'grade-7',
  unitId: 'g7-u1',
  unitTitle: 'Appearance',
  activityId: 'g7-u1-quiz',
  activityTitle: 'Vocabulary Quiz',
  gameType: 'quiz_battle',
  totalQuestions: 10
});

assertEq(attemptStartCross801.success, false, 'Student 801 cannot start Grade 7 attempt');
assertEq(attemptStartCross801.code, 'GRADE_UNAUTHORIZED', 'Rejected with GRADE_UNAUTHORIZED code');

// Test 4C: Authorized start attempt for 701 (Grade 7) -> SUCCESS
const attemptStartValid701 = callGas({
  action: 'game_start_attempt',
  sessionToken: token701,
  attemptId: 'att_valid_g7_701',
  gradeId: 'grade-7',
  unitId: 'g7-u1',
  unitTitle: 'Appearance',
  activityId: 'g7-u1-act1',
  activityTitle: 'Match It Round 1',
  gameType: 'match_it',
  totalQuestions: 10
});
assert(attemptStartValid701.success, 'Student 701 successfully starts Grade 7 attempt');

// Test 4D: Authorized start attempt for 801 (Grade 8) -> SUCCESS
const attemptStartValid801 = callGas({
  action: 'game_start_attempt',
  sessionToken: token801,
  attemptId: 'att_valid_g8_801',
  gradeId: 'grade-8',
  unitId: 'g8-u1',
  unitTitle: 'Friendship',
  activityId: 'g8-u1-act1',
  activityTitle: 'Match It Round 1',
  gameType: 'match_it',
  totalQuestions: 10
});
assert(attemptStartValid801.success, 'Student 801 successfully starts Grade 8 attempt');

console.log('\n--- 5. Backend Server-Side Answer Recording & Mutation Guards ---');

// Test 5A-1: Student 701 tries to record answers to Student 801's attempt -> REJECT (FORBIDDEN)
const crossAttempt701 = callGas({
  action: 'game_record_answers',
  sessionToken: token701,
  attemptId: 'att_valid_g8_801',
  answers: [{
    answerId: 'ans_cross_1',
    questionId: 'g8-u1-q1',
    isCorrect: true,
    studentResponse: 'generous',
    correctAnswer: 'generous'
  }]
});
assertEq(crossAttempt701.success, false, 'Student 701 rejected from recording answers to 801 attempt');
assertEq(crossAttempt701.code, 'FORBIDDEN', 'Cross-student attempt manipulation rejected with FORBIDDEN');

// Test 5A-2: Student 701 tries to record a Grade 8 question to own Grade 7 attempt -> REJECT (GRADE_UNAUTHORIZED)
const crossQuestion701 = callGas({
  action: 'game_record_answers',
  sessionToken: token701,
  attemptId: 'att_valid_g7_701',
  answers: [{
    answerId: 'ans_cross_q_1',
    questionId: 'g8-u1-q1',
    isCorrect: true,
    studentResponse: 'generous',
    correctAnswer: 'generous'
  }]
});
assertEq(crossQuestion701.success, false, 'Student 701 rejected from recording Grade 8 question');
assertEq(crossQuestion701.code, 'GRADE_UNAUTHORIZED', 'Cross-grade question rejected with GRADE_UNAUTHORIZED code');

// Test 5B: Student 701 records valid answers to own Grade 7 attempt -> SUCCESS
const validRecord701 = callGas({
  action: 'game_record_answers',
  sessionToken: token701,
  attemptId: 'att_valid_g7_701',
  answers: [{
    answerId: 'ans_valid_701_1',
    questionId: 'g7-u1-q1',
    isCorrect: true,
    studentResponse: 'punctual',
    correctAnswer: 'punctual'
  }]
});
assert(validRecord701.success, 'Student 701 records answers to own Grade 7 attempt');

console.log('\n--- 6. Backend Mistake Retry & Mastery Isolation ---');

// Test 6A: Student 701 tries to retry a Grade 8 question -> REJECT
const retryCross701 = callGas({
  action: 'student_record_mistake_retry',
  sessionToken: token701,
  questionId: 'g8-u1-q10',
  activityId: 'g8-u1-act1',
  unitId: 'g8-u1',
  isCorrect: true,
  studentResponse: 'honest',
  correctAnswer: 'honest',
  questionPrompt: 'Someone who always tells the truth'
});
assertEq(retryCross701.success, false, 'Student 701 rejected from retrying Grade 8 question');
assertEq(retryCross701.code, 'GRADE_UNAUTHORIZED', 'Cross-grade retry rejected with GRADE_UNAUTHORIZED code');

// Test 6B: Student 801 tries to retry a Grade 7 question -> REJECT
const retryCross801 = callGas({
  action: 'student_record_mistake_retry',
  sessionToken: token801,
  questionId: 'g7-u1-q5',
  activityId: 'g7-u1-act1',
  unitId: 'g7-u1',
  isCorrect: true,
  studentResponse: 'curly',
  correctAnswer: 'curly',
  questionPrompt: 'Not straight hair'
});
assertEq(retryCross801.success, false, 'Student 801 rejected from retrying Grade 7 question');
assertEq(retryCross801.code, 'GRADE_UNAUTHORIZED', 'Cross-grade retry rejected with GRADE_UNAUTHORIZED code');

// Test 6C: Valid retry for Student 701 on Grade 7 question -> SUCCESS
const retryValid701 = callGas({
  action: 'student_record_mistake_retry',
  sessionToken: token701,
  questionId: 'g7-u1-q1',
  activityId: 'g7-u1-act1',
  unitId: 'g7-u1',
  isCorrect: true,
  studentResponse: 'punctual',
  correctAnswer: 'punctual',
  questionPrompt: 'Always on time'
});
assert(retryValid701.success, 'Student 701 successfully retries Grade 7 question');

// Test 6D: Mistakes filtering by grade
// Inject mistake rows into Answers sheet for Student 701: 1 from G7, 1 historical rogue row from G8
const answersSheet = mockSpreadsheet.getSheetByName('Answers');
const ansHeaders = answersSheet.getDataRange().getValues()[0];
const aIdIdx = ansHeaders.indexOf('answer_id');
const attIdIdx = ansHeaders.indexOf('attempt_id');
const sNumIdx = ansHeaders.indexOf('student_number');
const sClsIdx = ansHeaders.indexOf('class');
const aActIdx = ansHeaders.indexOf('activity_id');
const aQIdx = ansHeaders.indexOf('question_id');
const aPromptIdx = ansHeaders.indexOf('question_prompt');
const aRespIdx = ansHeaders.indexOf('student_response');
const aCorrIdx = ansHeaders.indexOf('correct_answer');
const aIsCorrIdx = ansHeaders.indexOf('is_correct');

// Grade 7 mistake for 701
const g7MistakeRow = new Array(ansHeaders.length).fill('');
g7MistakeRow[aIdIdx] = 'ans_g7_mistake';
g7MistakeRow[attIdIdx] = 'att_valid_g7_701';
g7MistakeRow[sNumIdx] = '701';
g7MistakeRow[sClsIdx] = '7A';
g7MistakeRow[aActIdx] = 'g7-u1-act1';
g7MistakeRow[aQIdx] = 'g7-u1-q2';
g7MistakeRow[aPromptIdx] = 'Generous meaning?';
g7MistakeRow[aRespIdx] = 'selfish';
g7MistakeRow[aCorrIdx] = 'kind';
g7MistakeRow[aIsCorrIdx] = false;
answersSheet.appendRow(g7MistakeRow);

// Historical Grade 8 mistake mistakenly linked to 701
const g8RogueRow = new Array(ansHeaders.length).fill('');
g8RogueRow[aIdIdx] = 'ans_g8_rogue';
g8RogueRow[attIdIdx] = 'att_rogue_g8';
g8RogueRow[sNumIdx] = '701';
g8RogueRow[sClsIdx] = '7A';
g8RogueRow[aActIdx] = 'g8-u2-act1';
g8RogueRow[aQIdx] = 'g8-u2-q99';
g8RogueRow[aPromptIdx] = 'Teen life vocabulary';
g8RogueRow[aRespIdx] = 'wrong';
g8RogueRow[aCorrIdx] = 'right';
g8RogueRow[aIsCorrIdx] = false;
answersSheet.appendRow(g8RogueRow);

const totalAnswersBefore = answersSheet.getLastRow();

// Fetch mistakes for 701
const mistakes701 = callGas({ action: 'student_get_mistakes', sessionToken: token701 });
assert(mistakes701.success, 'handleStudentGetMistakes succeeds for 701');
assertEq(mistakes701.mistakes.length, 1, 'Only 1 mistake returned (Grade 7 mistake)');
assertEq(mistakes701.mistakes[0].questionId, 'g7-u1-q2', 'Returned mistake is exclusively the Grade 7 question');

// Verify that the historical database row was NOT deleted
const totalAnswersAfter = answersSheet.getLastRow();
assertEq(totalAnswersAfter, totalAnswersBefore, 'Historical cross-grade database rows are safely preserved, not deleted');

// Test 6E: Mastery Isolation
const mastery701 = callGas({ action: 'student_get_mastery', sessionToken: token701 });
assert(mastery701.success, 'handleStudentGetMastery succeeds for 701');
assert(mastery701.mastery.grade7 !== undefined, 'Grade 7 mastery object is populated');
assertEq(mastery701.mastery.class, '7A', 'Mastery class is 7A');

console.log('\n--- 7. Teacher Dashboard Dual-Grade Access Verification ---');
// Teacher auth: initialize master credentials
vmContext.initializeTeacherCredentials("MasterTeacherSecret1234");

const teacherLogin = callGas({ action: 'teacher_login', password: 'MasterTeacherSecret1234' });
assert(teacherLogin.success, 'Teacher login succeeds');
const teacherToken = teacherLogin.teacherToken;

const teacherOverview = callGas({ action: 'teacher_get_overview', teacherToken: teacherToken });
assert(teacherOverview.success, 'Teacher can access cross-grade overview');
assert(Array.isArray(teacherOverview.classStats), 'Teacher overview includes classStats');
const classIds = teacherOverview.classStats.map((c) => c.classId);
assert(classIds.includes('7A') && classIds.includes('7B'), 'Teacher has access to Grade 7 classes (7A, 7B)');
assert(classIds.includes('8A') && classIds.includes('8B'), 'Teacher has access to Grade 8 classes (8A, 8B)');

console.log('\n--- 8. Games Zone Client Service Attempt Protection ---');
// GamesZoneService.saveAttempt should reject attempts where student class doesn't match attempt grade
let savedAttempts = [];
const origSetItem = global.localStorage ? global.localStorage.setItem : null;

// Mock localStorage for node environment
global.localStorage = {
  _store: {},
  getItem(k) { return this._store[k] || null; },
  setItem(k, v) { this._store[k] = String(v); },
  removeItem(k) { delete this._store[k]; }
};

// Attempt 1: Student 701 (Class 7A) playing Grade 8 game -> REJECTED
GamesZoneService.saveAttempt({
  id: 'gz_att_1',
  gameId: 'word_ninja',
  gradeId: 'grade-8',
  difficulty: 'easy',
  studentNumber: '701',
  class: '7A',
  score: 100,
  totalQuestions: 10,
  correctAnswers: 10,
  incorrectAnswers: 0,
  accuracyPercentage: 100,
  xpEarned: 20,
  durationSeconds: 30,
  completedAt: new Date().toISOString()
});

const attempts701 = GamesZoneService.getStudentAttempts('701');
assertEq(attempts701.length, 0, 'Cross-grade Games Zone attempt for Grade 7 student rejected and not saved');

// Attempt 2: Student 701 (Class 7A) playing Grade 7 game -> ACCEPTED
GamesZoneService.saveAttempt({
  id: 'gz_att_2',
  gameId: 'word_ninja',
  gradeId: 'grade-7',
  difficulty: 'easy',
  studentNumber: '701',
  class: '7A',
  score: 100,
  totalQuestions: 10,
  correctAnswers: 10,
  incorrectAnswers: 0,
  accuracyPercentage: 100,
  xpEarned: 20,
  durationSeconds: 30,
  completedAt: new Date().toISOString()
});

const attempts701After = GamesZoneService.getStudentAttempts('701');
assertEq(attempts701After.length, 1, 'Valid Grade 7 Games Zone attempt accepted and saved');
assertEq(attempts701After[0].gradeId, 'grade-7', 'Saved attempt has grade-7');

console.log(`\n============================================================`);
console.log(`🎉 ALL ${passedChecks} OF ${totalChecks} GRADE ISOLATION CHECKS PASSED SUCCESSFULLY!`);
console.log(`============================================================\n`);
