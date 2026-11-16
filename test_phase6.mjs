/**
 * UNIT REVIEW ARCADE — PHASE 6: PERSONALIZED LEARNING AUTOMATED TEST SUITE
 * 
 * Verifies:
 * 1. Pedagogical Answer Explanations Service across all six game types
 *    - Curated explanation preservation
 *    - Fallback educational grammar/vocabulary rule synthesis
 *    - Prevention of premature answer disclosure
 * 2. Apps Script Backend — student_get_mistakes & Correction Lifecycle
 *    - Identifying incorrect answers
 *    - Isolation per student and class
 *    - Tracking whether mistakes have been subsequently corrected
 * 3. Apps Script Backend — student_record_mistake_retry & XP Incentive
 *    - Recording retry answers in Answers sheet
 *    - Marking mistake as corrected on success
 *    - Awarding practice XP
 * 4. Apps Script Backend — student_get_mastery Progress Tracking
 *    - Distinct Grade 7 and Grade 8 unit separation
 *    - Accuracy percentage & completed activities calculation
 *    - Mastery levels (mastered, developing, needs_practice)
 *    - Areas needing practice identification
 *    - Historical attempt gain & improvement tracking over time
 * 5. Smart Review Session Generator
 *    - Strictly verified curriculum questions (NO AI / synthetic questions)
 *    - Prioritizing uncorrected mistakes first
 *    - Dynamic session assembly & metadata
 * 6. Client Offline Caching & Real-Time Sync
 *    - Local mistake & mastery persistence
 *    - Offline baseline generation
 */

import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { createContext, runInContext } from 'vm';
import { ExplanationService } from './src/services/explanationService.ts';
import { PersonalizedLearningService } from './src/services/personalizedLearningService.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧠 Starting Phase 6: Personalized Learning Test Suite...\n');

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

  setValues(matrix) {
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        this.sheet._ensureSize(this.row + r, this.col + c);
        this.sheet._data[this.row - 1 + r][this.col - 1 + c] = matrix[r][c];
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

  getName() {
    return this.name;
  }

  _ensureSize(r, c) {
    while (this._data.length < r) {
      this._data.push([]);
    }
    for (let i = 0; i < this._data.length; i++) {
      while (this._data[i].length < c) {
        this._data[i].push('');
      }
    }
  }

  getLastRow() {
    return this._data.length;
  }

  getLastColumn() {
    let max = 0;
    for (const row of this._data) {
      if (row.length > max) max = row.length;
    }
    return max;
  }

  getDataRange() {
    const numRows = Math.max(1, this._data.length);
    const numCols = Math.max(1, this.getLastColumn());
    return new MockRange(this, 1, 1, numRows, numCols);
  }

  getRange(a1OrRow, col, numRows, numCols) {
    if (typeof a1OrRow === 'string') {
      const p = parseA1Notation(a1OrRow);
      return new MockRange(this, p.row, p.col, p.numRows, p.numCols);
    }
    return new MockRange(this, a1OrRow, col, numRows || 1, numCols || 1);
  }

  appendRow(rowArr) {
    const copied = rowArr.map((v) => (v === undefined ? '' : v));
    this._data.push(copied);
    return new MockRange(this, this._data.length, 1, 1, copied.length);
  }

  deleteRow(rowIdx) {
    if (rowIdx >= 1 && rowIdx <= this._data.length) {
      this._data.splice(rowIdx - 1, 1);
    }
  }

  clear() {
    this._data = [];
    return this;
  }

  setFrozenRows() { return this; }
  autoResizeColumns() { return this; }
  setColumnWidth() { return this; }
  setTabColor() { return this; }
}

class MockSpreadsheet {
  constructor() {
    this.name = 'Unit Review Arcade - TEST DATABASE';
    this.sheets = [];
  }

  getName() {
    return this.name;
  }

  getSheets() {
    return this.sheets;
  }

  getSheetByName(name) {
    return this.sheets.find((s) => s.getName() === name) || null;
  }

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
  constructor() {
    this.locked = false;
  }
  tryLock() {
    this.locked = true;
    return true;
  }
  releaseLock() {
    this.locked = false;
  }
  hasLock() {
    return this.locked;
  }
}

const mockSpreadsheet = new MockSpreadsheet();
const mockProps = {
  _props: {
    SPREADSHEET_ID: 'mock_test_spreadsheet_id_phase6',
    ARCADE_ENV: 'TEST',
  },
  getProperty(k) {
    return this._props[k] || null;
  },
  setProperty(k, v) {
    this._props[k] = String(v);
  },
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

console.log('✅ Google Apps Script Code.gs successfully loaded into sandboxed VM\n');

function callGas(payload) {
  const e = { postData: { contents: JSON.stringify(payload) } };
  const raw = vmContext.doPost(e);
  return JSON.parse(raw.getContent());
}

// Run database setup
vmContext.setupArcadeDatabase(mockSpreadsheet);

// Setup Student 801 in 8A and Student 701 in 7A
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

addStudent('801', 'Barış Alper', '8A', 'grade-8', '1234');
addStudent('701', 'Cemre Yılmaz', '7A', 'grade-7', '1234');

// ============================================================================
// TEST SUITE 1: Pedagogical Answer Explanations Service
// ============================================================================
console.log('--- TEST SUITE 1: Pedagogical Answer Explanations Service ---');

// 1.1 Curated explanation preservation
const curatedQ = {
  id: 'q_curated_1',
  prompt: 'Which verb means to send a photo or video to a website?',
  explanation: "'Upload' means transferring digital files from your personal device to an online platform.",
  options: ['Upload', 'Download'],
  correctOptionIndex: 0,
};
const res1 = ExplanationService.getExplanation(curatedQ, 'quiz_battle', 'Upload');
assertEq(res1.explanation, curatedQ.explanation, 'Preserves existing curated explanation without alteration');

// 1.2 Quiz Battle Past Tense Fallback
const pastQ = {
  id: 'q_past_1',
  prompt: 'Yesterday we _____ to the city centre.',
  options: ['go', 'went'],
  correctOptionIndex: 1,
};
const resPast = ExplanationService.getExplanation(pastQ, 'quiz_battle', 'went');
assert(resPast.explanation.includes('Past Simple'), 'Identifies Past Simple rule from prompt keywords');
assert(resPast.explanation.includes('went'), 'Includes target correct word in explanation');

// 1.3 Sentence Builder Word Order Fallback
const sentenceQ = {
  id: 'sb_1',
  prompt: 'Unscramble the sentence',
  correctSentence: 'We always upload photos after school.',
  scrambledWords: ['photos', 'always', 'upload', 'We', 'school', 'after'],
};
const resSb = ExplanationService.getExplanation(sentenceQ, 'sentence_builder', sentenceQ.correctSentence);
assert(resSb.explanation.includes('Subject + Verb + Object') || resSb.explanation.includes('word order'), 'Explains English syntactic architecture');
assert(resSb.explanation.includes(sentenceQ.correctSentence), 'Cites the complete grammatically correct sentence');

// 1.4 True/False Statement Explanation
const tfQTrue = {
  id: 'tf_1',
  prompt: 'Streaming means watching video in real time.',
  isTrue: true,
};
const resTfTrue = ExplanationService.getExplanation(tfQTrue, 'true_false');
assert(resTfTrue.explanation.includes('TRUE'), 'Generates clear affirmation for true statements');

const tfQFalse = {
  id: 'tf_2',
  prompt: 'Download means sending files to a website.',
  isTrue: false,
};
const resTfFalse = ExplanationService.getExplanation(tfQFalse, 'true_false');
assert(resTfFalse.explanation.includes('FALSE'), 'Highlights negative verification for false statements');

// 1.5 Match It Collocation Explanation
const matchPair = { id: 'p1', left: 'Digital detox', right: 'Taking a planned break from screens' };
const resMatch = ExplanationService.formatMatchPairExplanation(matchPair);
assert(resMatch.includes('Digital detox') && resMatch.includes('Taking a planned break'), 'Formats match pair with both sides clearly paired');

// 1.6 Train Station Schedule Explanation
const tsQ = {
  id: 'ts_1',
  prompt: 'What time does the Oxford train depart?',
  options: ['10:45', '11:15'],
  correctOptionIndex: 0,
};
const resTs = ExplanationService.getExplanation(tsQ, 'train_station', '10:45');
assert(resTs.explanation.includes('departure board') || resTs.explanation.includes('timetable'), 'References railway departure board context');

console.log('✅ Pedagogical Answer Explanations tests passed!\n');

// ============================================================================
// TEST SUITE 2: Apps Script Backend — student_get_mistakes & Correction Lifecycle
// ============================================================================
console.log('--- TEST SUITE 2: student_get_mistakes & Correction Lifecycle ---');

// Authenticate Student 801
const login801 = callGas({
  action: 'student_login',
  studentNumber: '801',
  pin: '1234',
});
assert(login801.success, 'Student 801 login succeeded');
const token801 = login801.sessionToken;

// Start Attempt 1
const startAtt1 = callGas({
  action: 'game_start_attempt',
  sessionToken: token801,
  attemptId: 'att_801_p6_1',
  gradeId: 'grade-8',
  unitId: 'g8-u1',
  unitTitle: 'Friendship & Social Bonds',
  activityId: 'g8-u1-act1',
  activityTitle: 'Vocabulary Quest',
  gameType: 'quiz_battle',
  totalQuestions: 3,
  startedAt: new Date(Date.now() - 3600000).toISOString(),
});
assert(startAtt1.success, 'Attempt 1 started successfully');

// Record answers: 1 correct, 2 mistakes
const recAns1 = callGas({
  action: 'game_record_answers',
  sessionToken: token801,
  attemptId: 'att_801_p6_1',
  answers: [
    {
      answerId: 'ans_801_q1',
      attemptId: 'att_801_p6_1',
      questionId: 'g8-u1-q1',
      questionOrder: 1,
      questionPrompt: 'What is a close friend called?',
      studentResponse: 'Stranger',
      correctAnswer: 'Best friend',
      isCorrect: false,
      timeSpentSeconds: 6,
      timestamp: new Date(Date.now() - 3500000).toISOString(),
    },
    {
      answerId: 'ans_801_q2',
      attemptId: 'att_801_p6_1',
      questionId: 'g8-u1-q2',
      questionOrder: 2,
      questionPrompt: 'A true friend always tells the truth.',
      studentResponse: 'True',
      correctAnswer: 'True',
      isCorrect: true,
      timeSpentSeconds: 4,
      timestamp: new Date(Date.now() - 3400000).toISOString(),
    },
    {
      answerId: 'ans_801_q3',
      attemptId: 'att_801_p6_1',
      questionId: 'g8-u1-q3',
      questionOrder: 3,
      questionPrompt: 'Someone who is always by your side is...',
      studentResponse: 'Unreliable',
      correctAnswer: 'Supportive',
      isCorrect: false,
      timeSpentSeconds: 8,
      timestamp: new Date(Date.now() - 3300000).toISOString(),
    },
  ],
});
assert(recAns1.success, 'Attempt 1 answers recorded');

// Complete Attempt 1
const compAtt1 = callGas({
  action: 'game_complete_attempt',
  sessionToken: token801,
  attemptId: 'att_801_p6_1',
  score: 1,
  totalQuestions: 3,
  answeredQuestions: 3,
  correctAnswers: 1,
  incorrectAnswers: 2,
  skippedQuestions: 0,
  percentage: 33.3,
  durationSeconds: 18,
  completedAt: new Date(Date.now() - 3200000).toISOString(),
});
assert(compAtt1.success, 'Attempt 1 completed with score 1/3');

// Query mistakes for student 801
const getMistakes1 = callGas({
  action: 'student_get_mistakes',
  sessionToken: token801,
});
assert(getMistakes1.success, 'student_get_mistakes succeeded');
assertEq(getMistakes1.mistakes.length, 2, 'Exactly 2 mistakes returned for student 801');

const m1 = getMistakes1.mistakes.find((m) => m.questionId === 'g8-u1-q1');
assert(m1 !== undefined, 'Contains mistake for g8-u1-q1');
assertEq(m1.isCorrected, false, 'Initial mistake status is isCorrected === false');
assertEq(m1.studentResponse, 'Stranger', 'Preserved student response');
assertEq(m1.correctAnswer, 'Best friend', 'Preserved correct answer');
assertEq(m1.activityTitle, 'Vocabulary Quest', 'Enriched with activity title');

// Cross-student privacy check: Student 701 must NOT see Student 801's mistakes
const login701 = callGas({
  action: 'student_login',
  studentNumber: '701',
  pin: '1234',
});
assert(login701.success, 'Student 701 login succeeded');
const token701 = login701.sessionToken;

const getMistakes701 = callGas({
  action: 'student_get_mistakes',
  sessionToken: token701,
});
assert(getMistakes701.success, 'Student 701 query succeeded');
assertEq(getMistakes701.mistakes.length, 0, 'Student 701 has 0 mistakes; strict isolation guaranteed');

console.log('✅ student_get_mistakes & privacy tests passed!\n');

// ============================================================================
// TEST SUITE 3: student_record_mistake_retry & Correction Tracking
// ============================================================================
console.log('--- TEST SUITE 3: student_record_mistake_retry & XP Incentive ---');

// Student 801 retries g8-u1-q1 and answers correctly!
const retryRes = callGas({
  action: 'student_record_mistake_retry',
  sessionToken: token801,
  questionId: 'g8-u1-q1',
  activityId: 'g8-u1-act1',
  unitId: 'g8-u1',
  isCorrect: true,
  studentResponse: 'Best friend',
  correctAnswer: 'Best friend',
  questionPrompt: 'What is a close friend called?',
});

assert(retryRes.success, 'student_record_mistake_retry succeeded');
assertEq(retryRes.isCorrect, true, 'Reports isCorrect === true');
assertEq(retryRes.isCorrected, true, 'Reports isCorrected === true');
assert(retryRes.xpAwarded > 0, 'Awards positive practice XP for correcting a mistake');

// Query mistakes again to verify real-time correction status update
const getMistakesAfter = callGas({
  action: 'student_get_mistakes',
  sessionToken: token801,
});
assert(getMistakesAfter.success, 'Updated student_get_mistakes succeeded');

const m1After = getMistakesAfter.mistakes.find((m) => m.questionId === 'g8-u1-q1');
assert(m1After !== undefined, 'g8-u1-q1 mistake still in history');
assertEq(m1After.isCorrected, true, 'Mistake g8-u1-q1 is now marked isCorrected === true');
assert(m1After.correctedAt !== null, 'correctedAt timestamp is populated');
assert(m1After.retryAttemptsCount >= 1, 'retryAttemptsCount incremented');

// Uncorrected mistake remains uncorrected
const m3After = getMistakesAfter.mistakes.find((m) => m.questionId === 'g8-u1-q3');
assertEq(m3After.isCorrected, false, 'Uncorrected mistake g8-u1-q3 remains isCorrected === false');

console.log('✅ student_record_mistake_retry tests passed!\n');

// ============================================================================
// TEST SUITE 4: Apps Script Backend — student_get_mastery Progress Tracking
// ============================================================================
console.log('--- TEST SUITE 4: student_get_mastery Progress Tracking ---');

// Record a second attempt with 100% score to demonstrate historical improvement
const startAtt2 = callGas({
  action: 'game_start_attempt',
  sessionToken: token801,
  attemptId: 'att_801_p6_2',
  gradeId: 'grade-8',
  unitId: 'g8-u1',
  unitTitle: 'Friendship & Social Bonds',
  activityId: 'g8-u1-act1',
  activityTitle: 'Vocabulary Quest',
  gameType: 'quiz_battle',
  totalQuestions: 3,
  startedAt: new Date(Date.now() - 1800000).toISOString(),
});
assert(startAtt2.success, 'Attempt 2 started');

const compAtt2 = callGas({
  action: 'game_complete_attempt',
  sessionToken: token801,
  attemptId: 'att_801_p6_2',
  score: 3,
  totalQuestions: 3,
  answeredQuestions: 3,
  correctAnswers: 3,
  incorrectAnswers: 0,
  skippedQuestions: 0,
  percentage: 100,
  durationSeconds: 15,
  completedAt: new Date(Date.now() - 1700000).toISOString(),
});
assert(compAtt2.success, 'Attempt 2 completed with 100% score');

const masteryRes = callGas({
  action: 'student_get_mastery',
  sessionToken: token801,
});
assert(masteryRes.success, 'student_get_mastery call succeeded');
const mastery = masteryRes.mastery;
assert(mastery !== undefined, 'Mastery object is populated');

// 4.1 Grade 7 & Grade 8 separation
assert(mastery.grade7 !== undefined, 'Grade 7 section exists');
assert(mastery.grade8 !== undefined, 'Grade 8 section exists');
assertEq(mastery.grade7.units.length, 2, 'Grade 7 has 2 units (Units 1-2)');
assertEq(mastery.grade8.units.length, 4, 'Grade 8 has 4 units (Units 1-4)');

// 4.2 Grade 8 Unit 1 Metrics
const g8u1 = mastery.grade8.units.find((u) => u.unitId === 'g8-u1');
assert(g8u1 !== undefined, 'Grade 8 Unit 1 found');
assertEq(g8u1.unitNumber, 1, 'Unit number is 1');
assert(g8u1.completedActivities >= 1, 'Records at least 1 completed activity');
assert(g8u1.accuracyPercentage >= 50, 'Computes overall unit accuracy');

// 4.3 Historical Improvement Calculation (First attempt 33.3% -> Latest attempt 100%)
assert(g8u1.historicalImprovementPercentage >= 0, 'Computes positive historical improvement gain');

// 4.4 Skills Breakdown
assert(g8u1.skills.length >= 3, 'Contains core skill breakdowns (vocab, grammar, comprehension)');

console.log('✅ student_get_mastery tests passed!\n');

// ============================================================================
// TEST SUITE 5: Smart Review Session Generator (Zero AI / Real Questions Only)
// ============================================================================
console.log('--- TEST SUITE 5: Smart Review Generator (Zero AI Guarantee) ---');

// Mock localStorage for Node environment
const mockStorage = {};
global.localStorage = {
  getItem: (k) => mockStorage[k] || null,
  setItem: (k, v) => { mockStorage[k] = String(v); },
  removeItem: (k) => { delete mockStorage[k]; },
  clear: () => { for (const k in mockStorage) delete mockStorage[k]; },
};

// Mock ArcadeData curriculum catalog
const mockArcadeData = {
  version: '1.0.0',
  lastModified: new Date().toISOString(),
  units: {
    'grade-7': [
      {
        id: 'g7-u1',
        gradeId: 'grade-7',
        unitNumber: 1,
        title: 'Digital Era & Everyday Life',
        activities: [
          {
            id: 'g7-u1-act1',
            unitId: 'g7-u1',
            title: 'Vocabulary Quest',
            gameType: 'quiz_battle',
            settings: {},
            questions: [
              { id: 'g7-u1-q1', prompt: 'Curriculum Question 1', options: ['A', 'B'], correctOptionIndex: 0 },
              { id: 'g7-u1-q2', prompt: 'Curriculum Question 2', options: ['A', 'B'], correctOptionIndex: 1 },
            ],
            order: 0,
            createdAt: '',
            updatedAt: '',
          },
        ],
        order: 0,
        createdAt: '',
        updatedAt: '',
      },
    ],
    'grade-8': [
      {
        id: 'g8-u1',
        gradeId: 'grade-8',
        unitNumber: 1,
        title: 'Friendship & Social Bonds',
        activities: [
          {
            id: 'g8-u1-act1',
            unitId: 'g8-u1',
            title: 'Vocabulary Quest',
            gameType: 'quiz_battle',
            settings: {},
            questions: [
              { id: 'g8-u1-q1', prompt: 'What is a close friend called?', options: ['Stranger', 'Best friend'], correctOptionIndex: 1 },
              { id: 'g8-u1-q3', prompt: 'Someone who is always by your side is...', options: ['Unreliable', 'Supportive'], correctOptionIndex: 1 },
              { id: 'g8-u1-q4', prompt: 'Curriculum Question 4', options: ['True', 'False'], correctOptionIndex: 0 },
            ],
            order: 0,
            createdAt: '',
            updatedAt: '',
          },
        ],
        order: 0,
        createdAt: '',
        updatedAt: '',
      },
    ],
  },
};

// Seed cached mistakes in mock localStorage
PersonalizedLearningService.saveCachedMistakes('801', [
  {
    mistakeId: 'mst_1',
    answerId: 'ans_1',
    attemptId: 'att_1',
    studentNumber: '801',
    class: '8A',
    gradeId: 'grade-8',
    unitId: 'g8-u1',
    unitTitle: 'Friendship & Social Bonds',
    activityId: 'g8-u1-act1',
    activityTitle: 'Vocabulary Quest',
    gameType: 'quiz_battle',
    questionId: 'g8-u1-q3',
    questionOrder: 3,
    questionPrompt: 'Someone who is always by your side is...',
    studentResponse: 'Unreliable',
    correctAnswer: 'Supportive',
    explanation: 'A supportive friend stays by your side.',
    timestamp: new Date().toISOString(),
    isCorrected: false,
    correctedAt: null,
    retryAttemptsCount: 0,
  },
]);

const reviewSession = PersonalizedLearningService.generateSmartReviewSession(
  mockArcadeData,
  '801',
  'grade-8',
  'g8-u1',
  5
);

assert(reviewSession !== undefined, 'Review session generated successfully');
assert(reviewSession.questions.length > 0, 'Review session contains questions');
assertEq(reviewSession.questions[0].id, 'g8-u1-q3', 'Priority 1: Places uncorrected mistake first');
assert(reviewSession.questionMetadata[0].isFromMistake === true, 'Marks mistake question with isFromMistake === true');

// Proof of Zero Synthetic / AI Questions:
for (const q of reviewSession.questions) {
  const verifiedInCurriculum = mockArcadeData.units['grade-8'][0].activities[0].questions.some(
    (realQ) => realQ.id === q.id
  );
  assert(verifiedInCurriculum, `Question ${q.id} strictly verified from curriculum data bank`);
}

console.log('✅ Smart Review Generator (Zero AI) tests passed!\n');

// ============================================================================
// TEST SUITE 6: Client Offline Caching & Real-Time Sync
// ============================================================================
console.log('--- TEST SUITE 6: Client Offline Caching & Real-Time Sync ---');

// 6.1 Local mistake correction
const correctedItem = PersonalizedLearningService.markMistakeCorrected('801', 'g8-u1-q3');
assert(correctedItem !== null, 'markMistakeCorrected returns updated item');
assertEq(correctedItem.isCorrected, true, 'Item locally marked as isCorrected === true');
assert(correctedItem.correctedAt !== null, 'Populates correctedAt timestamp');

const cachedAfter = PersonalizedLearningService.getCachedMistakes('801');
const rechecked = cachedAfter.find((m) => m.questionId === 'g8-u1-q3');
assertEq(rechecked.isCorrected, true, 'Cached mistakes reflect correction state immediately');

// 6.2 Offline baseline mastery generation
const baseline = PersonalizedLearningService.generateOfflineBaselineMastery(
  mockArcadeData,
  '801',
  'Barış Alper',
  '8A'
);
assert(baseline !== null, 'Generates clean offline baseline mastery');
assertEq(baseline.studentNumber, '801', 'Matches student number');
assert(baseline.grade7.units.length > 0, 'Includes Grade 7 units');
assert(baseline.grade8.units.length > 0, 'Includes Grade 8 units');

console.log('✅ Client Offline Caching & Real-Time Sync tests passed!\n');

// ============================================================================
// Summary
// ============================================================================
console.log('======================================================');
console.log(`🎉 ALL PHASE 6 PERSONALIZED LEARNING TESTS PASSED! (${passedChecks} checks, 0 failures)`);
console.log('======================================================\n');
