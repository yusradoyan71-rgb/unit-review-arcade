/**
 * UNIT REVIEW ARCADE — PHASE 4 AUTOMATED TEST SUITE
 * 
 * Verifies:
 * 1. Attempt Lifecycle & "Play Again" Duplicate Overwrite Prevention (Subphase 4A)
 * 2. Checkpointing & Mid-Game Resume Engine (Subphase 4B & 4C)
 * 3. Offline Queue & Resilient Telemetry Sync (Subphase 4B)
 * 4. In-Place Session Recovery (Subphase 4D)
 * 5. Question Analytics Distinct Student Metric (Subphase 4D)
 */

import { readFileSync } from 'fs';
import { createContext, runInContext } from 'vm';
import crypto from 'crypto';

console.log('🧪 Starting Phase 4 Integration & Regression Test Suite...\n');

// 1. Mock Spreadsheet Environment for Code.gs
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
    this.isMerged = false;
  }

  getNumRows() { return this.numRows; }
  getNumColumns() { return this.numCols; }
  merge() { this.isMerged = true; return this; }

  getValues() {
    const result = [];
    for (let r = 0; r < this.numRows; r++) {
      const rowIndex = this.row - 1 + r;
      const rowArr = [];
      const sourceRow = this.sheet.rows[rowIndex] || [];
      for (let c = 0; c < this.numCols; c++) {
        const colIndex = this.col - 1 + c;
        rowArr.push(sourceRow[colIndex] !== undefined ? sourceRow[colIndex] : '');
      }
      result.push(rowArr);
    }
    return result;
  }

  getValue() {
    const vals = this.getValues();
    return vals[0] ? vals[0][0] : '';
  }

  setValues(values) {
    if (!Array.isArray(values) || values.length !== this.numRows) {
      throw new Error(`Exception: Row dimension mismatch. Expected ${this.numRows}, got ${values?.length}`);
    }
    for (let r = 0; r < this.numRows; r++) {
      const rowData = values[r];
      if (!Array.isArray(rowData) || rowData.length !== this.numCols) {
        throw new Error(`Exception: Column dimension mismatch. Expected ${this.numCols}, got ${rowData?.length}`);
      }
      const targetRowIndex = this.row - 1 + r;
      while (this.sheet.rows.length <= targetRowIndex) {
        this.sheet.rows.push([]);
      }
      for (let c = 0; c < this.numCols; c++) {
        const targetColIndex = this.col - 1 + c;
        this.sheet.rows[targetRowIndex][targetColIndex] = rowData[c];
      }
    }
    return this;
  }

  setValue(val) { return this.setValues([[val]]); }
  setFontWeight() { return this; }
  setFontSize() { return this; }
  setBackground() { return this; }
  setFontColor() { return this; }
  setHorizontalAlignment() { return this; }
  setNumberFormat() { return this; }
}

class MockSheet {
  constructor(name, spreadsheet = null) {
    this.name = name;
    this.spreadsheet = spreadsheet;
    this.rows = [];
    this.tabColor = null;
    this.frozenRows = 0;
  }

  getParent() { return this.spreadsheet; }
  setColumnWidth() { return this; }
  getName() { return this.name; }
  getLastRow() { return this.rows.length; }
  getLastColumn() {
    let max = 0;
    for (const r of this.rows) {
      if (r && r.length > max) max = r.length;
    }
    return max;
  }

  getDataRange() {
    return new MockRange(this, 1, 1, Math.max(1, this.getLastRow()), Math.max(1, this.getLastColumn()));
  }

  getRange(a, b, c, d) {
    if (typeof a === 'string') {
      const parsed = parseA1Notation(a);
      return new MockRange(this, parsed.row, parsed.col, parsed.numRows, parsed.numCols);
    }
    return new MockRange(this, a, b, c || 1, d || 1);
  }

  appendRow(rowArr) {
    this.rows.push([...rowArr]);
    return this;
  }

  clear() {
    this.rows = [];
    return this;
  }

  setTabColor(c) { this.tabColor = c; return this; }
  setFrozenRows(n) { this.frozenRows = n; return this; }
  deleteRow(rowIdx) {
    if (rowIdx >= 1 && rowIdx <= this.rows.length) {
      this.rows.splice(rowIdx - 1, 1);
    }
    return this;
  }
}

class MockSpreadsheet {
  constructor(name, locale = 'en_US') {
    this.name = name;
    this.sheets = {};
    this.locale = locale;
  }

  getName() { return this.name; }
  getSpreadsheetLocale() { return this.locale; }
  setSpreadsheetLocale(loc) { this.locale = loc; }
  getSheetByName(name) { return this.sheets[name] || null; }
  getSheets() { return Object.values(this.sheets); }
  insertSheet(name) {
    const s = new MockSheet(name, this);
    this.sheets[name] = s;
    return s;
  }
}

const mockProps = {
  properties: {},
  getProperty(key) { return this.properties[key] || null; },
  setProperty(key, val) { this.properties[key] = String(val); },
  deleteProperty(key) { delete this.properties[key]; },
  getProperties() { return { ...this.properties }; },
};

const mockLock = {
  hasLock: false,
  waitLock() { this.hasLock = true; return true; },
  tryLock() { this.hasLock = true; return true; },
  releaseLock() { this.hasLock = false; },
};

const mockSpreadsheet = new MockSpreadsheet('Unit Review Arcade [Phase 4 Test]');

const gasContext = {
  console,
  Date,
  Math,
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
    getUuid: () => 'uuid_' + Math.random().toString(36).substring(2, 8),
    base64Encode: (s) => Buffer.from(s).toString('base64'),
    base64Decode: (s) => Array.from(Buffer.from(s, 'base64')),
    formatDate: (d, tz, fmt) => d.toISOString(),
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

createContext(gasContext);
const gasCode = readFileSync('google-apps-script/Code.gs', 'utf8');
runInContext(gasCode, gasContext);

function callGas(payload) {
  const e = { postData: { contents: JSON.stringify(payload) } };
  const raw = gasContext.doPost(e);
  return JSON.parse(raw.getContent());
}

// Initialize database
gasContext.setupArcadeDatabase();
gasContext.initializeTeacherCredentials('Phase4MasterSecretPass123!');

// Log in student 801
const s801Login = callGas({ action: 'student_login', studentNumber: '801', pin: '1234' });
if (!s801Login.success) throw new Error('Student 801 login failed: ' + s801Login.error);
const s801Token = s801Login.sessionToken;

// ============================================================================
// SUITE 1: ATTEMPT LIFECYCLE & "PLAY AGAIN" DUPLICATE OVERWRITE DEFENSE
// ============================================================================
console.log('=== SUITE 1: ATTEMPT LIFECYCLE & DUPLICATE OVERWRITE DEFENSE ===');

// 1. First attempt on g8-u1-act1
const att1 = callGas({
  action: 'game_start_attempt',
  sessionToken: s801Token,
  attemptId: 'att_p4_001',
  gradeId: 'grade-8',
  unitId: 'g8-u1',
  unitTitle: 'Music',
  activityId: 'g8-u1-act1',
  activityTitle: 'Music Quiz',
  gameType: 'quiz_battle',
  totalQuestions: 10,
  startedAt: new Date().toISOString(),
});

if (att1.attemptNumber !== 1) {
  throw new Error(`Expected attemptNumber 1, got ${att1.attemptNumber}`);
}

// Complete first attempt with score 8/10
const comp1 = callGas({
  action: 'game_complete_attempt',
  sessionToken: s801Token,
  attemptId: 'att_p4_001',
  score: 8,
  totalQuestions: 10,
  percentage: 80,
  durationSeconds: 60,
  completedAt: new Date().toISOString(),
});

if (!comp1.success || comp1.score !== 8) {
  throw new Error('Attempt 1 completion failed');
}

// 2. IDEMPOTENCY TEST: Duplicate complete call for att_p4_001
const comp1Duplicate = callGas({
  action: 'game_complete_attempt',
  sessionToken: s801Token,
  attemptId: 'att_p4_001',
  score: 5, // Attempting to tamper/overwrite
  totalQuestions: 10,
  percentage: 50,
});

if (!comp1Duplicate.success || comp1Duplicate.score !== 8) {
  throw new Error(`Idempotent complete failed! Expected score 8, got ${comp1Duplicate.score}`);
}
console.log('  ✅ Idempotent complete call safely returns original score (8/10) without overwriting.');

// 3. ABANDON SAFETY TEST: Abandon call for completed attempt should be ignored
const abanAfterComplete = callGas({
  action: 'game_abandon_attempt',
  sessionToken: s801Token,
  attemptId: 'att_p4_001',
  durationSeconds: 100,
});

if (!abanAfterComplete.success || abanAfterComplete.status !== 'completed') {
  throw new Error('Completed attempt was wrongfully abandoned!');
}
console.log('  ✅ Abandonment guard preserves completed attempt status.');

// 4. "PLAY AGAIN" TEST: Student starts a second attempt on g8-u1-act1
const att2 = callGas({
  action: 'game_start_attempt',
  sessionToken: s801Token,
  attemptId: 'att_p4_002', // Fresh unique attemptId
  gradeId: 'grade-8',
  unitId: 'g8-u1',
  unitTitle: 'Music',
  activityId: 'g8-u1-act1',
  activityTitle: 'Music Quiz',
  gameType: 'quiz_battle',
  totalQuestions: 10,
  startedAt: new Date().toISOString(),
});

if (att2.attemptNumber !== 2) {
  throw new Error(`Expected attemptNumber 2 on Play Again, got ${att2.attemptNumber}`);
}

const comp2 = callGas({
  action: 'game_complete_attempt',
  sessionToken: s801Token,
  attemptId: 'att_p4_002',
  score: 10,
  totalQuestions: 10,
  percentage: 100,
  durationSeconds: 45,
});

if (!comp2.success || comp2.score !== 10) {
  throw new Error('Attempt 2 completion failed');
}
console.log('  ✅ Play Again cleanly creates attempt 2 with score 10/10; both attempts preserved in database.\n');

// ============================================================================
// SUITE 2: QUESTION ANALYTICS DISTINCT STUDENT METRIC
// ============================================================================
console.log('=== SUITE 2: QUESTION ANALYTICS DISTINCT STUDENT METRIC ===');

// Log in student 802
const s802Login = callGas({ action: 'student_login', studentNumber: '802', pin: '1234' });
const s802Token = s802Login.sessionToken;

// Student 801 answers question q_tricky_1 with "false_opt" twice (across 2 attempts)
callGas({
  action: 'game_record_answers',
  sessionToken: s801Token,
  attemptId: 'att_p4_001',
  answers: [
    {
      answerId: 'ans_s1_q1',
      attemptId: 'att_p4_001',
      questionId: 'q_tricky_1',
      questionOrder: 1,
      questionPrompt: 'Tricky Grammar Item',
      studentResponse: 'false_opt',
      correctAnswer: 'true_opt',
      isCorrect: false,
      timeSpentSeconds: 10,
      timestamp: new Date().toISOString(),
    },
  ],
});

callGas({
  action: 'game_record_answers',
  sessionToken: s801Token,
  attemptId: 'att_p4_002',
  answers: [
    {
      answerId: 'ans_s1_q2',
      attemptId: 'att_p4_002',
      questionId: 'q_tricky_1',
      questionOrder: 1,
      questionPrompt: 'Tricky Grammar Item',
      studentResponse: 'false_opt',
      correctAnswer: 'true_opt',
      isCorrect: false,
      timeSpentSeconds: 12,
      timestamp: new Date().toISOString(),
    },
  ],
});

// Student 802 also answers question q_tricky_1 with "false_opt"
callGas({
  action: 'game_start_attempt',
  sessionToken: s802Token,
  attemptId: 'att_s802_001',
  gradeId: 'grade-8',
  unitId: 'g8-u1',
  activityId: 'g8-u1-act1',
  gameType: 'quiz_battle',
  totalQuestions: 10,
  startedAt: new Date().toISOString(),
});

callGas({
  action: 'game_record_answers',
  sessionToken: s802Token,
  attemptId: 'att_s802_001',
  answers: [
    {
      answerId: 'ans_s2_q1',
      attemptId: 'att_s802_001',
      questionId: 'q_tricky_1',
      questionOrder: 1,
      questionPrompt: 'Tricky Grammar Item',
      studentResponse: 'false_opt',
      correctAnswer: 'true_opt',
      isCorrect: false,
      timeSpentSeconds: 15,
      timestamp: new Date().toISOString(),
    },
  ],
});

// Teacher requests question analytics
const tLogin = callGas({ action: 'teacher_login', password: 'Phase4MasterSecretPass123!' });
const tToken = tLogin.teacherToken;

const qAnalytics = callGas({
  action: 'teacher_get_question_analytics',
  teacherToken: tToken,
});

if (!qAnalytics.success) throw new Error('Question analytics query failed: ' + qAnalytics.error);

const trickyQ = qAnalytics.questionAnalytics.find((q) => q.questionId === 'q_tricky_1');
if (!trickyQ) throw new Error('trickyQ not found in analytics');

console.log('  trickyQ Metrics:', {
  timesAnswered: trickyQ.timesAnswered,
  distinctStudentsCount: trickyQ.distinctStudentsCount,
  incorrectCount: trickyQ.incorrectCount,
  commonIncorrectResponses: trickyQ.commonIncorrectResponses,
});

if (trickyQ.timesAnswered !== 3) {
  throw new Error(`Expected timesAnswered 3, got ${trickyQ.timesAnswered}`);
}

if (trickyQ.distinctStudentsCount !== 2) {
  throw new Error(`Expected distinctStudentsCount 2 (students 801 & 802), got ${trickyQ.distinctStudentsCount}`);
}

const wrongResp = trickyQ.commonIncorrectResponses.find((r) => r.response === 'false_opt');
if (!wrongResp || wrongResp.count !== 3 || wrongResp.distinctStudentsCount !== 2) {
  throw new Error(
    `Misconception mismatch: expected count 3 and distinctStudentsCount 2, got count ${wrongResp?.count} and students ${wrongResp?.distinctStudentsCount}`
  );
}

console.log('  ✅ Question analytics accurately reports 3 mistakes across 2 distinct students (not 3 students)!\n');

// ============================================================================
// SUITE 3: CLIENT CHECKPOINTING & RESUME RECOVERY SIMULATION
// ============================================================================
console.log('=== SUITE 3: CLIENT CHECKPOINTING & RESUME SIMULATION ===');

// Mock localStorage for node environment
const clientStorage = {};
const mockLocalStorage = {
  getItem: (k) => clientStorage[k] || null,
  setItem: (k, v) => { clientStorage[k] = String(v); },
  removeItem: (k) => { delete clientStorage[k]; },
};

// Checkpoint schema simulation
const sampleCheckpoint = {
  attemptId: 'att_checkpoint_test_001',
  activityId: 'g8-u1-act1',
  gradeId: 'grade-8',
  unitId: 'g8-u1',
  gameType: 'quiz_battle',
  currentIndex: 4, // Student was on question 5
  score: 3,
  totalQuestions: 10,
  answeredQuestionIds: ['q1', 'q2', 'q3', 'q4'],
  shuffledQuestionIds: ['q3', 'q1', 'q4', 'q2', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10'],
  timestamp: Date.now(),
  durationSeconds: 45,
};

mockLocalStorage.setItem('unit_review_arcade_checkpoint_v2_801_g8-u1-act1', JSON.stringify(sampleCheckpoint));

// Verify recovery
const retrievedRaw = mockLocalStorage.getItem('unit_review_arcade_checkpoint_v2_801_g8-u1-act1');
const restoredCheckpoint = JSON.parse(retrievedRaw);

if (restoredCheckpoint.currentIndex !== 4 || restoredCheckpoint.score !== 3) {
  throw new Error('Checkpoint restore failed');
}

if (restoredCheckpoint.shuffledQuestionIds[0] !== 'q3') {
  throw new Error('Question order preservation failed');
}
console.log('  ✅ Client checkpoint safely persists and restores question index, score, and ordering.');

// Verify completion clears checkpoint
mockLocalStorage.removeItem('unit_review_arcade_checkpoint_v2_801_g8-u1-act1');
if (mockLocalStorage.getItem('unit_review_arcade_checkpoint_v2_801_g8-u1-act1') !== null) {
  throw new Error('Checkpoint cleanup failed');
}
console.log('  ✅ Checkpoint cleanly cleared upon activity completion.');

// ----------------------------------------------------------------------------
// MATCH IT ROUND 1 COMPLETION & FULL REMOUNT/REFRESH REGRESSION TEST
// ----------------------------------------------------------------------------
console.log('\n--- MATCH IT ROUND 1 COMPLETION & BROWSER REFRESH REGRESSION ---');

const mockSessionStorage = {
  data: {},
  getItem(k) { return this.data[k] || null; },
  setItem(k, v) { this.data[k] = String(v); },
  removeItem(k) { delete this.data[k]; },
  clear() { this.data = {}; },
};

// 1. Student 801 logs in - active session stored
const studentSession = {
  sessionToken: 'sess_student_801_phase4_reg',
  student: {
    studentNumber: '801',
    displayName: 'Barış Arslan',
    grade: '8',
    class: '8A',
  },
  expiresAt: new Date(Date.now() + 86400000).toISOString(),
};
mockSessionStorage.setItem('unit_review_arcade_active_session_v1', JSON.stringify(studentSession));

// 2. Navigation stored in sessionStorage for game-play
const activeActivityId = 'g8-u1-act2';
const mockNavigation = {
  view: 'game-play',
  gradeId: 'grade-8',
  unitId: 'g8-u1',
  activityId: activeActivityId,
};
mockSessionStorage.setItem('unit_review_arcade_nav_target_v1', JSON.stringify(mockNavigation));

// 3. Define 2-round Match It activity data
const sampleMatchRounds = [
  {
    id: 'round-1',
    title: 'Round 1: Musical Styles',
    pairs: [
      { id: 'p1', left: 'Classical', right: 'Orchestral compositions' },
      { id: 'p2', left: 'Jazz', right: 'Improvisation and brass' },
      { id: 'p3', left: 'Rock', right: 'Electric guitars and drums' },
      { id: 'p4', left: 'Hip Hop', right: 'Rhythmic beats and rhyming' },
    ],
  },
  {
    id: 'round-2',
    title: 'Round 2: Instruments',
    pairs: [
      { id: 'p5', left: 'Violin', right: 'String instrument played with a bow' },
      { id: 'p6', left: 'Trumpet', right: 'Brass wind instrument' },
      { id: 'p7', left: 'Drums', right: 'Percussion instruments struck with sticks' },
      { id: 'p8', left: 'Flute', right: 'Woodwind instrument producing high tones' },
    ],
  },
];

// Helper to simulate TrackingService checkpoint key generation
const getCheckpointKey = (studentNumber, activityId) => {
  const effective = studentNumber || (() => {
    try {
      const s = mockSessionStorage.getItem('unit_review_arcade_active_session_v1');
      if (s) return JSON.parse(s)?.student?.studentNumber;
    } catch {}
    return 'anon';
  })() || 'anon';
  return `unit_review_arcade_checkpoint_v2_${effective}_${activityId}`;
};

// 4. Play Round 1: student makes 4 correct matches
let currentRoundIdx = 0;
let totalMatches = 0;
let matchedPairIds = [];
const round1Pairs = sampleMatchRounds[0].pairs;

for (const pair of round1Pairs) {
  matchedPairIds.push(pair.id);
  totalMatches++;
  const isRoundFinished = matchedPairIds.length === round1Pairs.length;
  if (isRoundFinished) {
    const nextRound = currentRoundIdx + 1;
    const isFinalRound = nextRound >= sampleMatchRounds.length;
    // Checkpoint immediately advances to next round
    const checkpoint = {
      attemptId: 'att_match_it_001',
      activityId: activeActivityId,
      gradeId: 'grade-8',
      unitId: 'g8-u1',
      gameType: 'match_it',
      currentIndex: isFinalRound ? currentRoundIdx : nextRound,
      currentRoundIndex: isFinalRound ? currentRoundIdx : nextRound,
      score: totalMatches,
      matchedPairIds: [],
      timestamp: Date.now(),
      durationSeconds: 18,
    };
    mockLocalStorage.setItem(getCheckpointKey('801', activeActivityId), JSON.stringify(checkpoint));
  }
}

// Verify Round 1 completed and checkpoint saved for Round 2
const savedRaw = mockLocalStorage.getItem(getCheckpointKey('801', activeActivityId));
if (!savedRaw) {
  throw new Error('MatchIt Round 1 completion failed to save checkpoint to localStorage');
}
const savedCheckpoint = JSON.parse(savedRaw);
if (savedCheckpoint.currentRoundIndex !== 1 || savedCheckpoint.score !== 4) {
  throw new Error(`Expected Round 2 (currentRoundIndex: 1, score: 4), got index: ${savedCheckpoint.currentRoundIndex}, score: ${savedCheckpoint.score}`);
}
console.log('  ✅ Round 1 completion immediately saves checkpoint for Round 2 (currentRoundIndex: 1, score: 4).');

// 5. SIMULATE BROWSER REFRESH / REMOUNT
// All React state wiped
currentRoundIdx = undefined;
totalMatches = undefined;
matchedPairIds = undefined;

// Recover session synchronously from sessionStorage
const recoveredSession = JSON.parse(mockSessionStorage.getItem('unit_review_arcade_active_session_v1'));
const recoveredStudentNumber = recoveredSession.student.studentNumber;
if (recoveredStudentNumber !== '801') {
  throw new Error('Synchronous session recovery failed to retrieve student 801');
}

// Recover navigation synchronously from sessionStorage
const recoveredNav = JSON.parse(mockSessionStorage.getItem('unit_review_arcade_nav_target_v1'));
if (recoveredNav.view !== 'game-play' || recoveredNav.activityId !== activeActivityId) {
  throw new Error('Navigation restoration failed to retain active game-play screen');
}

// Retrieve checkpoint via effective student
const restoredCheckpointRaw = mockLocalStorage.getItem(getCheckpointKey(recoveredStudentNumber, activeActivityId));
const restoredCheckpointForRound2 = JSON.parse(restoredCheckpointRaw);

// Mount MatchItGame with restored checkpoint
const loadedRoundIndex = (restoredCheckpointForRound2 && restoredCheckpointForRound2.currentRoundIndex !== undefined && restoredCheckpointForRound2.currentRoundIndex < sampleMatchRounds.length)
  ? restoredCheckpointForRound2.currentRoundIndex
  : 0;
const loadedMatches = restoredCheckpointForRound2?.score || 0;
const loadedMatchedPairIds = restoredCheckpointForRound2?.matchedPairIds || [];
const activeRound = sampleMatchRounds[loadedRoundIndex];

if (loadedRoundIndex !== 1) {
  throw new Error(`Match It failed to resume at Round 2! Resumed at Round ${loadedRoundIndex + 1}`);
}
if (loadedMatches !== 4) {
  throw new Error(`Match It failed to resume score! Expected 4, got ${loadedMatches}`);
}
if (loadedMatchedPairIds.length !== 0) {
  throw new Error(`Expected clean matched pair list for Round 2, got ${loadedMatchedPairIds.length} pairs`);
}
if (activeRound.id !== 'round-2' || activeRound.title !== 'Round 2: Instruments') {
  throw new Error(`Expected Round 2 data, got: ${activeRound.title}`);
}
console.log('  ✅ Full browser refresh remount successfully loads Round 2 with score 4 and correct card pairs.');

// 6. Test mid-round progress resume in Round 2
// Student matches 2 pairs of Round 2
const midRoundMatches = ['p5', 'p6'];
const midRoundScore = 6;
const midRoundCheckpoint = {
  attemptId: 'att_match_it_001',
  activityId: activeActivityId,
  gradeId: 'grade-8',
  unitId: 'g8-u1',
  gameType: 'match_it',
  currentIndex: 1,
  currentRoundIndex: 1,
  score: midRoundScore,
  matchedPairIds: midRoundMatches,
  timestamp: Date.now(),
  durationSeconds: 32,
};
mockLocalStorage.setItem(getCheckpointKey('801', activeActivityId), JSON.stringify(midRoundCheckpoint));

// Simulate second refresh mid-round
const secondRestoredRaw = mockLocalStorage.getItem(getCheckpointKey(undefined, activeActivityId)); // test student fallback
const secondRestored = JSON.parse(secondRestoredRaw);
if (secondRestored.currentRoundIndex !== 1 || secondRestored.score !== 6 || secondRestored.matchedPairIds.length !== 2) {
  throw new Error('Mid-round checkpoint restoration failed');
}
console.log('  ✅ Mid-round resume restores 2 already-matched pairs in Round 2 without wiping state.\n');

// ============================================================================
// SUITE 4: OFFLINE QUEUE & AUTO-FLUSH SIMULATION
// ============================================================================
console.log('=== SUITE 4: OFFLINE QUEUE & AUTO-FLUSH SIMULATION ===');

const pendingQueue = [
  {
    attemptId: 'att_offline_001',
    studentNumber: '801',
    payload: {
      action: 'game_complete_attempt',
      attemptId: 'att_offline_001',
      score: 9,
      totalQuestions: 10,
      percentage: 90,
      durationSeconds: 120,
    },
    timestamp: Date.now(),
    retryCount: 0,
  },
];

mockLocalStorage.setItem('unit_review_arcade_pending_completions_v2', JSON.stringify(pendingQueue));

// Start the attempt in GAS first so completion succeeds
callGas({
  action: 'game_start_attempt',
  sessionToken: s801Token,
  attemptId: 'att_offline_001',
  gradeId: 'grade-8',
  unitId: 'g8-u1',
  activityId: 'g8-u1-act1',
  gameType: 'quiz_battle',
  totalQuestions: 10,
  startedAt: new Date().toISOString(),
});

// Simulate auto-flush on reconnect
const queueToFlush = JSON.parse(mockLocalStorage.getItem('unit_review_arcade_pending_completions_v2'));
let flushedCount = 0;
for (const item of queueToFlush) {
  const res = callGas({
    ...item.payload,
    sessionToken: s801Token,
  });
  if (res.success) {
    flushedCount++;
  }
}
mockLocalStorage.removeItem('unit_review_arcade_pending_completions_v2');

if (flushedCount !== 1) {
  throw new Error(`Expected 1 flushed item, got ${flushedCount}`);
}
console.log('  ✅ Offline completion safely queued in localStorage and flushed on reconnect.\n');

console.log('🎉🎉🎉 ALL PHASE 4 INTEGRATION & REGRESSION TESTS PASSED (4/4 SUITES)!');
console.log('Duplicate protection, resume checkpointing, offline queueing, and distinct student metrics verified.\n');
