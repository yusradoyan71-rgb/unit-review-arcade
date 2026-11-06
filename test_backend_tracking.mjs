/**
 * UNIT REVIEW ARCADE — PHASE 2 BACKEND UNIT TEST SUITE
 * Tests Code.gs tracking functions, session validation, attempt lifecycle,
 * batch answer recording, idempotency, and repeated attempts.
 */

import fs from 'fs';
import path from 'path';
import vm from 'vm';

console.log('🧪 Starting Phase 2 Backend Code.gs Unit & Integration Tests...\n');

// 1. Read Code.gs
const codeGsPath = 'c:\\Users\\FATİH\\.gemini\\antigravity-ide\\scratch\\english-taboo-game\\unit-review-arcade\\google-apps-script\\Code.gs';
const codeGsContent = fs.readFileSync(codeGsPath, 'utf8');

// 2. Setup mock Google Apps Script environment
class MockSheet {
  constructor(name) {
    this.name = name;
    this.rows = [];
    this.tabColor = '';
    this.frozenRows = 0;
  }

  getName() {
    return this.name;
  }

  getDataRange() {
    return {
      getValues: () => JSON.parse(JSON.stringify(this.rows)),
    };
  }

  getLastColumn() {
    if (this.rows.length === 0) return 0;
    return Math.max(...this.rows.map((r) => r.length));
  }

  getLastRow() {
    return this.rows.length;
  }

  appendRow(row) {
    this.rows.push([...row]);
  }

  deleteRow(rowIdx) {
    this.rows.splice(rowIdx - 1, 1);
  }

  getRange(row, col, numRows = 1, numCols = 1) {
    const sheet = this;
    return {
      getValues: () => {
        const result = [];
        for (let r = 0; r < numRows; r++) {
          const rowData = sheet.rows[row - 1 + r] || [];
          const colData = [];
          for (let c = 0; c < numCols; c++) {
            colData.push(rowData[col - 1 + c] !== undefined ? rowData[col - 1 + c] : '');
          }
          result.push(colData);
        }
        return result;
      },
      setValues: (values) => {
        for (let r = 0; r < values.length; r++) {
          const targetRowIdx = row - 1 + r;
          while (sheet.rows.length <= targetRowIdx) {
            sheet.rows.push([]);
          }
          for (let c = 0; c < values[r].length; c++) {
            const targetColIdx = col - 1 + c;
            while (sheet.rows[targetRowIdx].length <= targetColIdx) {
              sheet.rows[targetRowIdx].push('');
            }
            sheet.rows[targetRowIdx][targetColIdx] = values[r][c];
          }
        }
        return this;
      },
      setValue: (val) => {
        const targetRowIdx = row - 1;
        while (sheet.rows.length <= targetRowIdx) {
          sheet.rows.push([]);
        }
        const targetColIdx = col - 1;
        while (sheet.rows[targetRowIdx].length <= targetColIdx) {
          sheet.rows[targetRowIdx].push('');
        }
        sheet.rows[targetRowIdx][targetColIdx] = val;
        return this;
      },
      setFontWeight: () => ({ setBackground: () => ({ setFontColor: () => ({ setHorizontalAlignment: () => ({}) }) }) }),
      setBackground: () => ({ setFontColor: () => ({ setHorizontalAlignment: () => ({}) }) }),
      setFontColor: () => ({ setHorizontalAlignment: () => ({}) }),
      setHorizontalAlignment: () => ({}),
      setFontSize: () => ({ setBackground: () => ({ setFontColor: () => ({ setHorizontalAlignment: () => ({}) }) }) }),
      merge: () => ({ setValues: () => ({ setFontWeight: () => ({ setFontSize: () => ({ setBackground: () => ({ setFontColor: () => ({ setHorizontalAlignment: () => ({}) }) }) }) }) }) }),
    };
  }

  setFrozenRows(n) {
    this.frozenRows = n;
  }

  setTabColor(c) {
    this.tabColor = c;
  }

  clear() {
    this.rows = [];
  }
}

class MockSpreadsheet {
  constructor(name) {
    this.name = name;
    this.sheets = {};
  }

  getName() {
    return this.name;
  }

  getSheetByName(name) {
    return this.sheets[name] || null;
  }

  getSheets() {
    return Object.values(this.sheets);
  }

  deleteSheet(sheet) {
    if (sheet && sheet.name) {
      delete this.sheets[sheet.name];
    }
  }

  insertSheet(name) {
    const s = new MockSheet(name);
    this.sheets[name] = s;
    return s;
  }
}

const mockProps = {
  properties: {
    SPREADSHEET_ID: 'test_sheet_mock_id',
    PEPPER_SECRET: 'mock_server_pepper_1234567890abcdef1234567890abcdef',
  },
  getProperty(key) {
    return this.properties[key] || null;
  },
  setProperty(key, val) {
    this.properties[key] = String(val);
  },
};

const mockSpreadsheet = new MockSpreadsheet('Unit Review Arcade Database [Test]');

const context = {
  console,
  Date,
  Math,
  String,
  Number,
  Boolean,
  Array,
  JSON,
  Logger: {
    log: (...args) => console.log('    [GAS Log]', ...args),
  },
  PropertiesService: {
    getScriptProperties: () => mockProps,
  },
  SpreadsheetApp: {
    openById: (id) => mockSpreadsheet,
    getActiveSpreadsheet: () => mockSpreadsheet,
    flush: () => {},
  },
  ContentService: {
    createTextOutput: (text) => ({
      text,
      setMimeType: () => {},
      getContent: () => text,
    }),
    MimeType: { JSON: 'application/json' },
  },
  Utilities: {
    getUuid: () => 'uuid_' + Math.random().toString(36).substring(2, 10),
    DigestAlgorithm: { SHA_256: 'SHA_256' },
    computeDigest: (algo, str) => {
      // Simple mock digest returning an array of numbers
      const arr = [];
      const s = String(str);
      for (let i = 0; i < 32; i++) {
        arr.push((s.charCodeAt(i % s.length) + i * 17) % 256);
      }
      return arr;
    },
    newBlob: (str) => ({
      getBytes: () => Array.from(Buffer.from(String(str))),
    }),
  },
};

vm.createContext(context);
vm.runInContext(codeGsContent, context);

// Helper to run JSON RPC
function callApi(payload) {
  const e = { postData: { contents: JSON.stringify(payload) } };
  const res = context.doPost(e);
  return JSON.parse(res.text);
}

// -------------------------------------------------------------
// TEST SUITE EXECUTION
// -------------------------------------------------------------

async function runTests() {
  console.log('=== TEST 1: SETUP DATABASE & VERIFY SCHEMA ===');
  context.setupArcadeDatabase();
  const ss = mockSpreadsheet;
  const attemptsSheet = ss.getSheetByName('Attempts');
  const answersSheet = ss.getSheetByName('Answers');

  console.log('  Attempts sheet created:', Boolean(attemptsSheet));
  console.log('  Answers sheet created:', Boolean(answersSheet));
  console.log('  Attempts headers:', attemptsSheet.rows[0]);
  console.log('  Answers headers:', answersSheet.rows[0]);

  if (!attemptsSheet.rows[0].includes('attempt_id') || !answersSheet.rows[0].includes('answer_id')) {
    throw new Error('Database schema initialization failed');
  }
  console.log('  ✅ TEST 1 PASSED: Schemas initialized.\n');

  console.log('=== TEST 2: CREATE DEMO STUDENT & LOGIN ===');
  context.createStudentAccount('801', 'Barış Arslan', '8', '8A', '1234');
  
  const loginRes = callApi({
    action: 'student_login',
    studentNumber: '801',
    pin: '1234',
  });
  console.log('  Login result:', loginRes);
  if (!loginRes.success || !loginRes.sessionToken) {
    throw new Error('Student login failed: ' + JSON.stringify(loginRes));
  }
  const sessionToken = loginRes.sessionToken;
  console.log('  ✅ TEST 2 PASSED: Logged in student 801, session token acquired.\n');

  console.log('=== TEST 3: START ATTEMPT (game_start_attempt) ===');
  const attemptId1 = 'att_test_quiz_battle_001';
  const startRes1 = callApi({
    action: 'game_start_attempt',
    sessionToken,
    attemptId: attemptId1,
    gradeId: 'grade-8',
    unitId: 'g8-u1',
    unitTitle: 'Friendship & Youth',
    activityId: 'g8-u1-act1',
    activityTitle: 'Digital Vocabulary Battle',
    gameType: 'quiz_battle',
    totalQuestions: 10,
    startedAt: new Date().toISOString(),
  });
  console.log('  Start Attempt result:', startRes1);
  if (!startRes1.success || startRes1.attemptNumber !== 1) {
    throw new Error('Failed to start attempt: ' + JSON.stringify(startRes1));
  }
  console.log('  Attempt 1 registered with attemptNumber 1.');

  // Test idempotency: re-sending the same start payload
  const duplicateStartRes = callApi({
    action: 'game_start_attempt',
    sessionToken,
    attemptId: attemptId1,
    gradeId: 'grade-8',
    unitId: 'g8-u1',
    activityId: 'g8-u1-act1',
    gameType: 'quiz_battle',
    totalQuestions: 10,
  });
  console.log('  Duplicate start attempt result (idempotency):', duplicateStartRes);
  if (!duplicateStartRes.success || duplicateStartRes.attemptId !== attemptId1) {
    throw new Error('Idempotent start attempt failed');
  }
  console.log('  ✅ TEST 3 PASSED: Attempt initialized and idempotent.\n');

  console.log('=== TEST 4: BATCH ANSWER RECORDING (game_record_answers) ===');
  const answersBatch = [
    {
      answerId: 'ans_001',
      questionId: 'q1',
      questionOrder: 1,
      questionPrompt: 'What is the definition of supportive?',
      studentResponse: 'Helpful and encouraging',
      correctAnswer: 'Helpful and encouraging',
      isCorrect: true,
      timeSpentSeconds: 4,
      timestamp: new Date().toISOString(),
    },
    {
      answerId: 'ans_002',
      questionId: 'q2',
      questionOrder: 2,
      questionPrompt: 'Which one is NOT a positive personal quality?',
      studentResponse: 'Generous',
      correctAnswer: 'Self-centred',
      isCorrect: false,
      timeSpentSeconds: 6,
      timestamp: new Date().toISOString(),
    },
  ];

  const recordRes = callApi({
    action: 'game_record_answers',
    sessionToken,
    attemptId: attemptId1,
    answers: answersBatch,
  });
  console.log('  Record answers result:', recordRes);
  if (!recordRes.success || recordRes.recordedCount !== 2) {
    throw new Error('Failed to record answers: ' + JSON.stringify(recordRes));
  }

  // Verify duplicate answer rejection (idempotency)
  const dupRecordRes = callApi({
    action: 'game_record_answers',
    sessionToken,
    attemptId: attemptId1,
    answers: answersBatch,
  });
  console.log('  Duplicate answers submission result:', dupRecordRes);
  if (!dupRecordRes.success || dupRecordRes.recordedCount !== 0) {
    throw new Error('Duplicate answers were not prevented');
  }
  console.log('  Duplicate answers correctly rejected (0 duplicates written).');
  console.log('  ✅ TEST 4 PASSED: Batch answers recorded with idempotency.\n');

  console.log('=== TEST 5: COMPLETE ATTEMPT (game_complete_attempt) ===');
  const completeRes = callApi({
    action: 'game_complete_attempt',
    sessionToken,
    attemptId: attemptId1,
    score: 8,
    totalQuestions: 10,
    answeredQuestions: 10,
    correctAnswers: 8,
    incorrectAnswers: 2,
    skippedQuestions: 0,
    percentage: 80,
    durationSeconds: 45,
    completedAt: new Date().toISOString(),
  });
  console.log('  Complete attempt result:', completeRes);
  if (!completeRes.success || completeRes.status !== 'completed' || completeRes.score !== 8) {
    throw new Error('Failed to complete attempt: ' + JSON.stringify(completeRes));
  }

  // Verify status in Attempts sheet
  const attemptsRows = attemptsSheet.rows;
  const completedRow = attemptsRows.find((r) => r.includes(attemptId1));
  console.log('  Completed Attempt row in sheet:', completedRow);
  if (!completedRow || !completedRow.includes('completed') || !completedRow.includes(80)) {
    throw new Error('Attempts sheet does not reflect completed state');
  }
  console.log('  ✅ TEST 5 PASSED: Attempt marked completed with final telemetry.\n');

  console.log('=== TEST 6: REPEATED ATTEMPTS (Attempt Number Increment) ===');
  const attemptId2 = 'att_test_quiz_battle_002';
  const startRes2 = callApi({
    action: 'game_start_attempt',
    sessionToken,
    attemptId: attemptId2,
    gradeId: 'grade-8',
    unitId: 'g8-u1',
    unitTitle: 'Friendship & Youth',
    activityId: 'g8-u1-act1', // Same activity as attempt 1!
    activityTitle: 'Digital Vocabulary Battle',
    gameType: 'quiz_battle',
    totalQuestions: 10,
    startedAt: new Date().toISOString(),
  });
  console.log('  Start second attempt on same activity:', startRes2);
  if (!startRes2.success || startRes2.attemptNumber !== 2) {
    throw new Error('Attempt number failed to increment for repeated play: ' + JSON.stringify(startRes2));
  }
  console.log('  ✅ TEST 6 PASSED: Repeated plays increment attemptNumber to 2.\n');

  console.log('=== TEST 7: EARLY EXIT / ABANDON ATTEMPT (game_abandon_attempt) ===');
  const abandonRes = callApi({
    action: 'game_abandon_attempt',
    sessionToken,
    attemptId: attemptId2,
    durationSeconds: 15,
    answeredQuestions: 2,
    correctAnswers: 1,
  });
  console.log('  Abandon attempt result:', abandonRes);
  if (!abandonRes.success || abandonRes.status !== 'abandoned') {
    throw new Error('Failed to abandon attempt: ' + JSON.stringify(abandonRes));
  }

  const abandonedRow = attemptsSheet.rows.find((r) => r.includes(attemptId2));
  console.log('  Abandoned row in sheet:', abandonedRow);
  if (!abandonedRow || !abandonedRow.includes('abandoned')) {
    throw new Error('Sheet does not reflect abandoned state');
  }
  console.log('  ✅ TEST 7 PASSED: Early exit properly marked as abandoned.\n');

  console.log('=== TEST 8: UNFINISHED ATTEMPT RECONCILIATION ===');
  // Start attempt 3 and leave it in progress
  const attemptId3 = 'att_test_interrupted_003';
  callApi({
    action: 'game_start_attempt',
    sessionToken,
    attemptId: attemptId3,
    gradeId: 'grade-8',
    unitId: 'g8-u1',
    activityId: 'g8-u1-act2',
    gameType: 'match_it',
    totalQuestions: 6,
  });

  // Reconcile as interrupted
  const reconcileRes = callApi({
    action: 'game_reconcile_attempt',
    sessionToken,
    attemptId: attemptId3,
    status: 'interrupted',
  });
  console.log('  Reconcile result:', reconcileRes);
  if (!reconcileRes.success) {
    throw new Error('Failed to reconcile attempt');
  }

  const reconciledRow = attemptsSheet.rows.find((r) => r.includes(attemptId3));
  console.log('  Reconciled row in sheet:', reconciledRow);
  if (!reconciledRow || !reconciledRow.includes('interrupted')) {
    throw new Error('Sheet does not reflect interrupted state');
  }
  console.log('  ✅ TEST 8 PASSED: Interrupted attempt reconciled.\n');

  console.log('=== TEST 9: UNAUTHORIZED ATTEMPT ACCESS PREVENTION ===');
  // Attempt to access attemptId1 with an invalid session token
  const fakeSessionRes = callApi({
    action: 'game_complete_attempt',
    sessionToken: 'invalid_fake_token_9999',
    attemptId: attemptId1,
    score: 10,
    totalQuestions: 10,
  });
  console.log('  Invalid session response:', fakeSessionRes);
  if (fakeSessionRes.success) {
    throw new Error('Invalid session was erroneously accepted!');
  }
  console.log('=== TEST 10: MULTI-TRY INTERACTIONS (Match It! / Sentence Builder) ===');
  const attemptIdMulti = 'att_test_matchit_multitry';
  callApi({
    action: 'game_start_attempt',
    sessionToken,
    attemptId: attemptIdMulti,
    gradeId: 'grade-8',
    unitId: 'g8-u1',
    activityId: 'g8-u1-matchit',
    gameType: 'match_it',
    totalQuestions: 4,
  });

  const multiTryBatch = [
    {
      answerId: 'ans_multi_001',
      questionId: 'pair_fever',
      questionOrder: 1,
      questionPrompt: 'Round 1: Health',
      studentResponse: 'fever ➔ plaster',
      correctAnswer: 'fever ➔ high temperature',
      isCorrect: false,
      timestamp: new Date().toISOString(),
    },
    {
      answerId: 'ans_multi_002',
      questionId: 'pair_fever',
      questionOrder: 2,
      questionPrompt: 'Round 1: Health',
      studentResponse: 'fever ➔ bandage',
      correctAnswer: 'fever ➔ high temperature',
      isCorrect: false,
      timestamp: new Date().toISOString(),
    },
    {
      answerId: 'ans_multi_003',
      questionId: 'pair_fever',
      questionOrder: 3,
      questionPrompt: 'Round 1: Health',
      studentResponse: 'fever ➔ high temperature',
      correctAnswer: 'fever ➔ high temperature',
      isCorrect: true,
      timestamp: new Date().toISOString(),
    },
  ];

  const multiRecordRes = callApi({
    action: 'game_record_answers',
    sessionToken,
    attemptId: attemptIdMulti,
    answers: multiTryBatch,
  });
  console.log('  Multi-try record result:', multiRecordRes);
  if (!multiRecordRes.success || multiRecordRes.recordedCount !== 3) {
    throw new Error('Multi-try answers were improperly discarded! Result: ' + JSON.stringify(multiRecordRes));
  }

  // Verify all 3 attempts exist in Answers sheet
  const answersData = answersSheet.rows;
  const multiRows = answersData.filter((r) => r.includes(attemptIdMulti));
  console.log(`  Found ${multiRows.length} recorded rows for multi-try attempt (expected 3).`);
  if (multiRows.length !== 3) {
    throw new Error(`Expected 3 rows in Answers sheet for multi-try interaction, found ${multiRows.length}`);
  }

  // Verify duplicate submission of exact same multi-try batch is safely ignored
  const multiDupRes = callApi({
    action: 'game_record_answers',
    sessionToken,
    attemptId: attemptIdMulti,
    answers: multiTryBatch,
  });
  console.log('  Resubmission of multi-try batch result:', multiDupRes);
  if (!multiDupRes.success || multiDupRes.recordedCount !== 0) {
    throw new Error('Deduplication failed to ignore retried multi-try batch');
  }
  console.log('  ✅ TEST 10 PASSED: All repeated interaction attempts recorded without being discarded.\n');

  console.log('=== TEST 11: CROSS-STUDENT ATTEMPT ACCESS DEFENSE ===');
  // Register and login student 702
  context.createStudentAccount('702', 'Ayşe Yılmaz', '7', '7A', '1234');

  const login702Res = callApi({
    action: 'student_login',
    studentNumber: '702',
    pin: '1234',
  });
  const token702 = login702Res.sessionToken;

  // Student 702 tries to record answers to Student 801's attempt
  const hijackAnswerRes = callApi({
    action: 'game_record_answers',
    sessionToken: token702,
    attemptId: attemptIdMulti, // owned by student 801
    answers: [{ questionId: 'hacked_q', studentResponse: 'Hacked' }],
  });
  console.log('  Cross-student answer attempt:', hijackAnswerRes);
  if (hijackAnswerRes.success) {
    throw new Error('Student 702 was able to record answers for student 801 attempt!');
  }

  // Student 702 tries to complete Student 801's attempt
  const hijackCompleteRes = callApi({
    action: 'game_complete_attempt',
    sessionToken: token702,
    attemptId: attemptIdMulti,
    score: 100,
  });
  console.log('  Cross-student complete attempt:', hijackCompleteRes);
  if (hijackCompleteRes.success) {
    throw new Error('Student 702 was able to complete student 801 attempt!');
  }

  // Student 702 tries to reconcile Student 801's attempt
  const hijackReconcileRes = callApi({
    action: 'game_reconcile_attempt',
    sessionToken: token702,
    attemptId: attemptIdMulti,
    status: 'interrupted',
  });
  console.log('  Cross-student reconcile attempt:', hijackReconcileRes);
  if (hijackReconcileRes.success) {
    throw new Error('Student 702 was able to reconcile student 801 attempt!');
  }
  console.log('  ✅ TEST 11 PASSED: Strict student ownership enforced across all tracking operations.\n');

  console.log('=== TEST 12: PHASE 1 AUTHENTICATION BACKWARD COMPATIBILITY ===');
  // Check session with token702
  const checkSessionRes = callApi({
    action: 'check_session',
    sessionToken: token702,
  });
  console.log('  Check session result:', checkSessionRes);
  if (!checkSessionRes.success || checkSessionRes.student.studentNumber !== '702') {
    throw new Error('check_session failed to return valid student profile');
  }

  // Logout student 702
  const logoutRes = callApi({
    action: 'logout',
    sessionToken: token702,
  });
  console.log('  Logout result:', logoutRes);
  if (!logoutRes.success) {
    throw new Error('Logout endpoint failed');
  }

  // Check session after logout should fail
  const checkAfterLogout = callApi({
    action: 'check_session',
    sessionToken: token702,
  });
  console.log('  Check session after logout:', checkAfterLogout);
  if (checkAfterLogout.success) {
    throw new Error('Logged out session was erroneously accepted!');
  }

  // Attempting to start game with logged-out session should fail
  const startAfterLogout = callApi({
    action: 'game_start_attempt',
    sessionToken: token702,
    attemptId: 'att_should_fail',
    gradeId: 'grade-7',
    unitId: 'g7-u1',
    activityId: 'g7-u1-act1',
    gameType: 'quiz_battle',
  });
  console.log('  Start attempt after logout:', startAfterLogout);
  if (startAfterLogout.success) {
    throw new Error('Game start with logged-out session was accepted!');
  }
  console.log('  ✅ TEST 12 PASSED: Phase 1 login, check_session, and logout endpoints fully preserved.\n');

  console.log('🎉 ALL BACKEND TESTS PASSED (12/12)! Google Apps Script tracking handlers and security boundaries verified.');
}

runTests().catch((err) => {
  console.error('❌ Backend test failure:', err);
  process.exit(1);
});
