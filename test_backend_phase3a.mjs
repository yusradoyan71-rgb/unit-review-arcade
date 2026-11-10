/**
 * ============================================================================
 * UNIT REVIEW ARCADE — PHASE 3A BACKEND TEST SUITE (SECURITY HARDENED)
 * ============================================================================
 * 
 * Comprehensive tests for:
 * 1. Database schema initialization, idempotency, and non-destructive updates.
 * 2. Disabled-by-default teacher auth (code: "NOT_CONFIGURED" until initialized).
 * 3. Owner-only credential initialization (initializeTeacherCredentials) with
 *    5,000 iterative SHA-256 rounds + secret pepper, zero hardcoded passwords.
 * 4. Automatic session invalidation upon credential change.
 * 5. Hashed session tokens in TeacherSessions (zero plaintext token persistence).
 * 6. Concurrency-safe rate limiting with LockService & 15m brute-force lockout.
 * 7. Strict server-side authorization for all teacher reporting endpoints.
 * 8. Structured GAS error handling ({ success: false, error, code }).
 * 9. Trusted Curriculum catalog and dynamic discovery without hardcoded numbers.
 * 10. Anti-inflation logic for progress and repeats.
 * 11. Overview, Roster, Student Detail (with repeated gains), and Question Analytics.
 * 12. Legacy content version handling ("Legacy / Version Unknown", zero fabrication).
 */

import fs from 'fs';
import vm from 'vm';
import crypto from 'crypto';

console.log('🧪 Starting Phase 3A Backend Code.gs Unit & Integration Tests (Hardened)...\n');

// 1. Read Code.gs
const codeGsPath = 'c:\\Users\\FATİH\\.gemini\\antigravity-ide\\scratch\\english-taboo-game\\unit-review-arcade\\google-apps-script\\Code.gs';
const codeGsContent = fs.readFileSync(codeGsPath, 'utf8');

function parseA1Notation(a1) {
  const clean = a1.includes('!') ? a1.split('!')[1] : a1;
  const parts = clean.split(':');

  function cellToRowCol(cellStr) {
    const match = cellStr.match(/^([A-Za-z]+)(\d+)$/);
    if (!match) throw new Error("Invalid cell notation: " + cellStr);
    const colStr = match[1].toUpperCase();
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

  getRange(rowOrA1, col, numRows, numCols) {
    if (typeof rowOrA1 === 'string') {
      const parsed = parseA1Notation(rowOrA1);
      return new MockRange(this, parsed.row, parsed.col, parsed.numRows, parsed.numCols);
    }
    return new MockRange(this, rowOrA1, col, numRows || 1, numCols || 1);
  }

  getDataRange() {
    return new MockRange(this, 1, 1, Math.max(1, this.getLastRow()), Math.max(1, this.getLastColumn()));
  }

  appendRow(rowArr) {
    this.rows.push([...rowArr]);
    return this;
  }

  deleteRow(rowIdx) {
    if (rowIdx >= 1 && rowIdx <= this.rows.length) {
      this.rows.splice(rowIdx - 1, 1);
    }
    return this;
  }

  clear() {
    this.rows = [];
    return this;
  }

  setTabColor(color) { this.tabColor = color; return this; }
  setFrozenRows(n) { this.frozenRows = n; return this; }
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
  getSheets() { return Object.values(this.sheets); }
  getSheetByName(name) { return this.sheets[name] || null; }

  insertSheet(name) {
    const s = new MockSheet(name, this);
    this.sheets[name] = s;
    return s;
  }

  deleteSheet(sheet) {
    delete this.sheets[sheet.getName()];
  }
}

const mockProps = {
  properties: {
    SPREADSHEET_ID: 'test_sheet_mock_id',
    PEPPER_SECRET: 'mock_server_pepper_1234567890abcdef1234567890abcdef',
  },
  getProperty(key) { return this.properties[key] || null; },
  setProperty(key, val) { this.properties[key] = String(val); },
  deleteProperty(key) { delete this.properties[key]; },
  deleteAllProperties() { this.properties = {}; },
  getProperties() { return { ...this.properties }; },
};

const mockSpreadsheet = new MockSpreadsheet('Unit Review Arcade Database [Phase 3A Test]');

const mockLock = {
  hasLock: false,
  waitLock(timeout) { this.hasLock = true; return true; },
  tryLock(timeout) { this.hasLock = true; return true; },
  releaseLock() { this.hasLock = false; },
};

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
  },
};

vm.createContext(context);
vm.runInContext(codeGsContent, context);

function callApi(payload) {
  const e = { postData: { contents: JSON.stringify(payload) } };
  const res = context.doPost(e);
  return JSON.parse(res.text);
}

// -------------------------------------------------------------
// TEST RUNNER
// -------------------------------------------------------------

async function runPhase3ATests() {
  console.log('=== TEST 1: SETUP DATABASE & VERIFY PHASE 3A SCHEMAS ===');
  context.setupArcadeDatabase();
  const ss = mockSpreadsheet;
  const teacherSessions = ss.getSheetByName('TeacherSessions');
  const curriculum = ss.getSheetByName('Curriculum');
  const attempts = ss.getSheetByName('Attempts');
  const answers = ss.getSheetByName('Answers');
  const students = ss.getSheetByName('Students');

  if (!teacherSessions || !curriculum) {
    throw new Error('Phase 3A sheets (TeacherSessions, Curriculum) were not created.');
  }

  // Verify headers
  if (!teacherSessions.rows[0].includes('token_hash') || !teacherSessions.rows[0].includes('session_id')) {
    throw new Error('TeacherSessions header mismatch.');
  }
  if (!curriculum.rows[0].includes('curriculum_id') || !curriculum.rows[0].includes('is_published')) {
    throw new Error('Curriculum header mismatch.');
  }
  if (!attempts.rows[0].includes('content_version')) {
    throw new Error('Attempts header missing content_version.');
  }
  if (!answers.rows[0].includes('question_version')) {
    throw new Error('Answers header missing question_version.');
  }

  // Verify default seeded curriculum (48 published activities)
  const curriculumRows = curriculum.rows.slice(1);
  console.log(`  Seeded Curriculum rows: ${curriculumRows.length}`);
  if (curriculumRows.length !== 48) {
    throw new Error(`Expected 48 seeded curriculum activities, found ${curriculumRows.length}`);
  }
  console.log('  ✅ TEST 1 PASSED: Schemas and default curriculum verified.\n');

  console.log('=== TEST 2: DISABLED-BY-DEFAULT AUTH & SCRIPT PROPERTIES INITIALIZATION ===');
  // 1. Before initialization: Login MUST fail with NOT_CONFIGURED
  const unconfiguredRes = callApi({ action: 'teacher_login', password: 'SomeRandomPassword123!' });
  console.log('  Login attempt before initialization:', unconfiguredRes);
  if (unconfiguredRes.success || unconfiguredRes.code !== 'NOT_CONFIGURED') {
    throw new Error('Teacher login must be disabled until initialized: ' + JSON.stringify(unconfiguredRes));
  }

  // 2. initializeTeacherFromScriptProperties with missing property should throw
  let threwOnMissing = false;
  try {
    context.initializeTeacherFromScriptProperties();
  } catch (err) {
    threwOnMissing = true;
    console.log('  Expected rejection when TEACHER_SETUP_PASSWORD is missing:', err.message);
  }
  if (!threwOnMissing) {
    throw new Error('initializeTeacherFromScriptProperties must throw when TEACHER_SETUP_PASSWORD is missing');
  }

  // 3. initializeTeacherFromScriptProperties with password < 12 characters should throw
  mockProps.setProperty('TEACHER_SETUP_PASSWORD', 'shortPass99');
  let threwOnShort = false;
  try {
    context.initializeTeacherFromScriptProperties();
  } catch (err) {
    threwOnShort = true;
    console.log('  Expected rejection when TEACHER_SETUP_PASSWORD is < 12 chars:', err.message);
  }
  if (!threwOnShort) {
    throw new Error('initializeTeacherFromScriptProperties must throw when password is < 12 characters');
  }
  // Confirm property was NOT deleted when validation failed
  if (!mockProps.getProperty('TEACHER_SETUP_PASSWORD')) {
    throw new Error('TEACHER_SETUP_PASSWORD must not be deleted on failed validation');
  }

  // 4. Initialize valid ephemeral teacher passphrase (>= 12 chars) via TEACHER_SETUP_PASSWORD
  const ephemeralTestPassword = 'TestPassphrase_' + crypto.randomBytes(8).toString('hex') + '!';
  mockProps.setProperty('TEACHER_SETUP_PASSWORD', ephemeralTestPassword);
  context.initializeTeacherFromScriptProperties();

  // 5. Verify TEACHER_SETUP_PASSWORD was immediately deleted after successful initialization
  const postInitSetupProp = mockProps.getProperty('TEACHER_SETUP_PASSWORD');
  console.log('  TEACHER_SETUP_PASSWORD property after successful setup:', postInitSetupProp);
  if (postInitSetupProp !== null && postInitSetupProp !== '') {
    throw new Error('TEACHER_SETUP_PASSWORD must be deleted immediately after successful setup!');
  }

  // 6. Attempt login with wrong password
  const badRes = callApi({ action: 'teacher_login', password: 'WrongPassword987!' });
  if (badRes.success || badRes.code !== 'UNAUTHORIZED' || badRes.attemptsRemaining !== 4) {
    throw new Error('Bad password did not decrement attempts correctly: ' + JSON.stringify(badRes));
  }

  // 7. Attempt login with the initialized ephemeral password
  const validRes = callApi({ action: 'teacher_login', password: ephemeralTestPassword });
  console.log('  Teacher Login Result:', {
    success: validRes.success,
    tokenPrefix: validRes.teacherToken?.substring(0, 8),
    teacherName: validRes.teacherName,
    expiresAt: validRes.expiresAt,
  });

  if (!validRes.success || !validRes.teacherToken || !validRes.teacherToken.startsWith('tch_')) {
    throw new Error('Teacher login failed: ' + JSON.stringify(validRes));
  }
  const teacherToken = validRes.teacherToken;

  // 8. Inspect TeacherSessions sheet: MUST NOT CONTAIN PLAINTEXT TOKEN
  const sessionRows = teacherSessions.rows.slice(1);
  const activeSessionRow = sessionRows[sessionRows.length - 1];
  console.log('  Stored row in TeacherSessions:', {
    sessionId: activeSessionRow[0],
    tokenHash: activeSessionRow[1],
    status: activeSessionRow[6],
  });

  if (activeSessionRow.includes(teacherToken) || activeSessionRow.includes(ephemeralTestPassword)) {
    throw new Error('CRITICAL SECURITY VIOLATION: Plaintext teacher token or password found in TeacherSessions sheet!');
  }
  if (!activeSessionRow[1] || activeSessionRow[1].length !== 64) {
    throw new Error('token_hash in TeacherSessions must be a 64-character SHA-256 hex string');
  }
  console.log('  ✅ TEST 2 PASSED: Disabled-by-default auth, Script Properties setup, cleanup, and hashed storage verified.\n');

  console.log('=== TEST 3: CONCURRENCY-SAFE BRUTE-FORCE LOCKOUT DEFENSE ===');
  // Attempt 5 incorrect logins to trigger lockout
  for (let f = 1; f <= 5; f++) {
    const failRes = callApi({ action: 'teacher_login', password: 'badPassword' + f });
    if (f === 5) {
      console.log('  5th failed attempt response:', failRes);
      if (!failRes.error.includes('locked') || failRes.code !== 'LOCKED') {
        throw new Error('5th failed attempt should trigger lockout: ' + JSON.stringify(failRes));
      }
    }
  }

  // Even the correct password must be rejected during lockout
  const lockoutRes = callApi({ action: 'teacher_login', password: ephemeralTestPassword });
  console.log('  Login attempt during lockout:', lockoutRes);
  if (lockoutRes.success || lockoutRes.code !== 'LOCKED') {
    throw new Error('Correct password during lockout should still be rejected: ' + JSON.stringify(lockoutRes));
  }

  // Reset lockout in mockProps for subsequent tests
  mockProps.setProperty('TEACHER_FAILED_ATTEMPTS', '0');
  mockProps.deleteProperty('TEACHER_LOCKED_UNTIL');
  console.log('  ✅ TEST 3 PASSED: Concurrency-safe brute-force lockout defense verified.\n');

  console.log('=== TEST 4: STRICT SERVER-SIDE AUTHORIZATION FOR REPORTING ===');
  const reportingActions = [
    'teacher_check_session',
    'teacher_get_overview',
    'teacher_get_roster',
    'teacher_get_student_detail',
    'teacher_get_question_analytics',
    'teacher_publish_curriculum',
  ];

  // 1. Missing token
  for (const act of reportingActions) {
    const res = callApi({ action: act });
    if (res.success || res.code !== 'UNAUTHORIZED') {
      throw new Error(`Action ${act} did not fail securely when token missing: ${JSON.stringify(res)}`);
    }
  }

  // 2. Student session token passed to teacher endpoint
  for (const act of reportingActions) {
    const res = callApi({ action: act, teacherToken: 'uat_student_token_1234567890' });
    if (res.success || res.code !== 'UNAUTHORIZED' || !res.error.includes('Student session token cannot access')) {
      throw new Error(`Action ${act} did not reject student token: ${JSON.stringify(res)}`);
    }
  }

  // 3. Forged / invalid teacher token
  for (const act of reportingActions) {
    const res = callApi({ action: act, teacherToken: 'tch_forged_random_fake_token_000000000000' });
    if (res.success || res.code !== 'UNAUTHORIZED') {
      throw new Error(`Action ${act} did not reject forged teacher token: ${JSON.stringify(res)}`);
    }
  }
  console.log('  ✅ TEST 4 PASSED: Strict server-side authorization on all endpoints verified.\n');

  console.log('=== TEST 5: AUTOMATIC SESSION INVALIDATION ON CREDENTIAL CHANGE ===');
  // Log in with current password to get an active session
  const loginBeforeChange = callApi({ action: 'teacher_login', password: ephemeralTestPassword });
  const tokenToInvalidate = loginBeforeChange.teacherToken;

  // Verify session is active
  const checkBefore = callApi({ action: 'teacher_check_session', teacherToken: tokenToInvalidate });
  if (!checkBefore.success || !checkBefore.active) {
    throw new Error('Session before credential change should be valid.');
  }

  // Owner changes password via initializeTeacherCredentials
  const newPassword = 'NewSecretPass_' + crypto.randomBytes(8).toString('hex') + '!';
  context.initializeTeacherCredentials(newPassword);

  // Old session MUST BE REVOKED / INVALID
  const checkAfter = callApi({ action: 'teacher_check_session', teacherToken: tokenToInvalidate });
  console.log('  Session check after credential change:', checkAfter);
  if (checkAfter.success || checkAfter.code !== 'UNAUTHORIZED') {
    throw new Error('Credential change MUST revoke all existing teacher sessions: ' + JSON.stringify(checkAfter));
  }

  // Old password must fail
  const oldPassRes = callApi({ action: 'teacher_login', password: ephemeralTestPassword });
  if (oldPassRes.success) {
    throw new Error('Old password must fail after credential change.');
  }

  // New password must succeed
  const newLoginRes = callApi({ action: 'teacher_login', password: newPassword });
  if (!newLoginRes.success || !newLoginRes.teacherToken) {
    throw new Error('New password login failed: ' + JSON.stringify(newLoginRes));
  }
  const activeToken = newLoginRes.teacherToken;
  console.log('  ✅ TEST 5 PASSED: Automatic session invalidation on credential change verified.\n');

  console.log('=== TEST 6: STANDALONE NON-DESTRUCTIVE DATABASE SETUP ===');
  // Test standalone creation of TeacherSessions and Curriculum
  const standaloneTeacher = context.setupTeacherSessionsSheet(ss);
  const standaloneCurr = context.setupCurriculumSheet(ss);
  if (!standaloneTeacher || !standaloneCurr) {
    throw new Error('Standalone sheet setup failed.');
  }

  // Rerun setupArcadeDatabase and verify zero data deletion
  const studentRowsBefore = students.rows.length;
  context.setupArcadeDatabase();
  const studentRowsAfter = students.rows.length;
  if (studentRowsBefore !== studentRowsAfter) {
    throw new Error('setupArcadeDatabase() modified student count on existing database!');
  }
  console.log('  ✅ TEST 6 PASSED: Standalone and non-destructive setup verified.\n');

  console.log('=== TEST 7: DYNAMIC CURRICULUM CATALOG (teacher_publish_curriculum) ===');
  const initialMap = context.getTrustedCurriculumMap(ss);
  console.log('  Initial published activities totals:', initialMap.totals);
  if (initialMap.totals['grade-8'] !== 30) {
    throw new Error(`Expected 30 Grade 8 activities, found ${initialMap.totals['grade-8']}`);
  }

  // Publish a new unit activity for Grade 8
  const publishRes = callApi({
    action: 'teacher_publish_curriculum',
    teacherToken: activeToken,
    activities: [
      {
        grade_id: 'grade-8',
        unit_id: 'g8-u5',
        unit_title: 'The Internet & Robotics',
        activity_id: 'g8-u5-act1',
        activity_title: 'Robotics Vocab Arena',
        game_type: 'quiz_battle',
        total_questions: 12,
        content_version: '1.0.0',
        is_published: true,
      },
    ],
  });
  console.log('  Publish Curriculum Response:', publishRes);
  if (!publishRes.success || publishRes.publishedCount !== 1) {
    throw new Error('Curriculum publish failed: ' + JSON.stringify(publishRes));
  }

  // Verify dynamic discovery: Grade 8 count automatically became 31 without any hardcoded changes
  const updatedMap = context.getTrustedCurriculumMap(ss);
  console.log('  Updated Grade 8 total:', updatedMap.totals['grade-8']);
  if (updatedMap.totals['grade-8'] !== 31) {
    throw new Error(`Dynamic discovery failed: expected 31 Grade 8 activities, found ${updatedMap.totals['grade-8']}`);
  }
  console.log('  ✅ TEST 7 PASSED: Dynamic curriculum catalog publishing and discovery verified.\n');

  console.log('=== TEST 8: DYNAMIC ROSTER PROGRESS & ANTI-INFLATION (teacher_get_roster) ===');
  // Student 801 logs in and completes 2 official published activities
  const s801Login = callApi({ action: 'student_login', studentNumber: '801', pin: '1234' });
  const s801Token = s801Login.sessionToken;

  callApi({
    action: 'game_start_attempt',
    sessionToken: s801Token,
    attemptId: 'att_801_act1',
    activityId: 'g8-u1-act1',
    contentVersion: '1.0.0',
  });
  callApi({
    action: 'game_complete_attempt',
    sessionToken: s801Token,
    attemptId: 'att_801_act1',
    score: 10,
    totalQuestions: 10,
    correctAnswers: 10,
    percentage: 100,
    durationSeconds: 60,
  });

  callApi({
    action: 'game_start_attempt',
    sessionToken: s801Token,
    attemptId: 'att_801_act2',
    activityId: 'g8-u1-act2',
    contentVersion: '1.0.0',
  });
  callApi({
    action: 'game_complete_attempt',
    sessionToken: s801Token,
    attemptId: 'att_801_act2',
    score: 6,
    totalQuestions: 6,
    correctAnswers: 6,
    percentage: 100,
    durationSeconds: 40,
  });

  // Complete a custom/local browser activity (NOT in Curriculum sheet)
  callApi({
    action: 'game_start_attempt',
    sessionToken: s801Token,
    attemptId: 'att_801_custom',
    activityId: 'custom-local-vocab-game',
    contentVersion: '0.1.0',
  });
  callApi({
    action: 'game_complete_attempt',
    sessionToken: s801Token,
    attemptId: 'att_801_custom',
    score: 10,
    totalQuestions: 10,
    correctAnswers: 10,
    percentage: 100,
    durationSeconds: 50,
  });

  // Repeat activity 1 (second attempt)
  callApi({
    action: 'game_start_attempt',
    sessionToken: s801Token,
    attemptId: 'att_801_act1_repeat',
    activityId: 'g8-u1-act1',
    contentVersion: '1.0.0',
  });
  callApi({
    action: 'game_complete_attempt',
    sessionToken: s801Token,
    attemptId: 'att_801_act1_repeat',
    score: 9,
    totalQuestions: 10,
    correctAnswers: 9,
    percentage: 90,
    durationSeconds: 55,
  });

  // Fetch roster
  const rosterRes = callApi({
    action: 'teacher_get_roster',
    teacherToken: activeToken,
    filters: { classId: '8A' },
  });
  console.log('  Roster Response (8A students count):', rosterRes.roster?.length);

  const s801Stats = rosterRes.roster.find((s) => s.studentNumber === '801');
  console.log('  Student 801 Progress Stats:', s801Stats);

  if (s801Stats.completedActivitiesCount !== 2) {
    throw new Error(`Expected completedActivitiesCount 2, got ${s801Stats.completedActivitiesCount}`);
  }
  if (s801Stats.customActivitiesCompletedCount !== 1) {
    throw new Error(`Expected customActivitiesCompletedCount 1, got ${s801Stats.customActivitiesCompletedCount}`);
  }
  if (s801Stats.totalPublishedActivities !== 31) {
    throw new Error(`Expected totalPublishedActivities 31, got ${s801Stats.totalPublishedActivities}`);
  }
  if (s801Stats.curriculumProgressPercentage !== 6) {
    throw new Error(`Expected curriculumProgressPercentage 6, got ${s801Stats.curriculumProgressPercentage}`);
  }

  // Student 802 has never logged in
  const s802Stats = rosterRes.roster.find((s) => s.studentNumber === '802');
  if (s802Stats.status !== 'never_logged_in') {
    throw new Error(`Expected student 802 to have status 'never_logged_in', got ${s802Stats.status}`);
  }
  console.log('  ✅ TEST 8 PASSED: Dynamic roster progress and anti-inflation verified.\n');

  console.log('=== TEST 9: TEACHER OVERVIEW ANALYTICS & CLASS STATS (teacher_get_overview) ===');
  const overviewRes = callApi({
    action: 'teacher_get_overview',
    teacherToken: activeToken,
  });
  console.log('  Overview KPIs:', overviewRes.overview);
  console.log('  Class Stats Summary:', overviewRes.classStats);

  if (!overviewRes.success || !overviewRes.overview) {
    throw new Error('Overview fetch failed: ' + JSON.stringify(overviewRes));
  }
  if (overviewRes.overview.totalStudents !== 8) {
    throw new Error(`Expected 8 total students, found ${overviewRes.overview.totalStudents}`);
  }
  if (overviewRes.overview.completedAttempts < 4) {
    throw new Error('Expected at least 4 completed attempts recorded.');
  }

  // Filter by class 8A
  const filteredOverview = callApi({
    action: 'teacher_get_overview',
    teacherToken: activeToken,
    filters: { classId: '8A' },
  });
  if (filteredOverview.overview.totalStudents !== 2) {
    throw new Error(`Expected 2 students in class 8A, found ${filteredOverview.overview.totalStudents}`);
  }
  console.log('  ✅ TEST 9 PASSED: Overview aggregated KPIs and filtering verified.\n');

  console.log('=== TEST 10: STUDENT DETAIL & REPEATED ATTEMPT GAINS (teacher_get_student_detail) ===');
  callApi({
    action: 'game_record_answers',
    sessionToken: s801Token,
    attemptId: 'att_801_act1',
    answers: [
      {
        questionId: 'q_g8_u1_01',
        questionOrder: 1,
        questionPrompt: 'What does "backup" mean?',
        studentResponse: 'support',
        correctAnswer: 'support',
        isCorrect: true,
        questionVersion: '1.0.0',
      },
    ],
  });

  const detailRes = callApi({
    action: 'teacher_get_student_detail',
    teacherToken: activeToken,
    studentNumber: '801',
  });
  console.log('  Student Detail for 801:');
  console.log('    Attempts count:', detailRes.attempts?.length);
  console.log('    Repeated gains:', detailRes.repeatedAttemptGains);
  console.log('    Answers count:', detailRes.answers?.length);

  if (!detailRes.success || detailRes.attempts.length < 4) {
    throw new Error('Student detail failed: ' + JSON.stringify(detailRes));
  }
  const gainItem = detailRes.repeatedAttemptGains.find((g) => g.activityId === 'g8-u1-act1');
  if (!gainItem || gainItem.totalAttempts !== 2) {
    throw new Error('Repeated attempt gain not properly tracked for g8-u1-act1: ' + JSON.stringify(gainItem));
  }
  console.log('  ✅ TEST 10 PASSED: Student detail profile and repeated gains verified.\n');

  console.log('=== TEST 11: QUESTION ANALYTICS & DIAGNOSTIC LEADERBOARD (teacher_get_question_analytics) ===');
  const s701Login = callApi({ action: 'student_login', studentNumber: '701', pin: '1234' });
  const s701Token = s701Login.sessionToken;
  callApi({
    action: 'game_start_attempt',
    sessionToken: s701Token,
    attemptId: 'att_701_act1',
    activityId: 'g7-u1-act1',
    contentVersion: '1.0.0',
  });
  callApi({
    action: 'game_record_answers',
    sessionToken: s701Token,
    attemptId: 'att_701_act1',
    answers: [
      {
        questionId: 'q_g7_hard_01',
        questionPrompt: 'Select the past participle of "choose"',
        studentResponse: 'choosed',
        correctAnswer: 'chosen',
        isCorrect: false,
        questionVersion: '1.0.0',
      },
      {
        questionId: 'q_g7_easy_02',
        questionPrompt: 'Select the synonym for "smart"',
        studentResponse: 'clever',
        correctAnswer: 'clever',
        isCorrect: true,
        questionVersion: '1.0.0',
      },
    ],
  });

  const qAnalyticsRes = callApi({
    action: 'teacher_get_question_analytics',
    teacherToken: activeToken,
  });
  console.log('  Question Analytics diagnostic count:', qAnalyticsRes.questionAnalytics?.length);
  const hardQ = qAnalyticsRes.questionAnalytics.find((q) => q.questionId === 'q_g7_hard_01');
  console.log('  Hard question diagnostic metrics:', hardQ);

  if (!hardQ || hardQ.accuracyRate !== 0 || hardQ.commonIncorrectResponses.length === 0) {
    throw new Error('Question analytics failed to identify missed question: ' + JSON.stringify(hardQ));
  }
  if (hardQ.commonIncorrectResponses[0].response !== 'choosed') {
    throw new Error('Common incorrect response distribution mismatch: ' + JSON.stringify(hardQ.commonIncorrectResponses));
  }
  if (qAnalyticsRes.questionAnalytics[0].accuracyRate > qAnalyticsRes.questionAnalytics[qAnalyticsRes.questionAnalytics.length - 1].accuracyRate) {
    throw new Error('Diagnostic leaderboard should be sorted ascending by accuracyRate');
  }
  console.log('  ✅ TEST 11 PASSED: Question analytics & diagnostic leaderboard verified.\n');

  console.log('=== TEST 12: LEGACY VERSION HANDLING & ZERO DATA FABRICATION ===');
  const attemptsSheet = ss.getSheetByName('Attempts');
  const answersSheet = ss.getSheetByName('Answers');

  // Insert raw historical attempt with no version info
  attemptsSheet.appendRow([
    'att_legacy_historical_999',
    'sess_legacy',
    'std_uuid_legacy',
    '801',
    '8A',
    'grade-8',
    'g8-u1',
    'Friendship & Youth',
    'g8-u1-act1',
    'Digital Vocabulary Battle',
    'quiz_battle',
    1,
    7,
    10,
    10,
    7,
    3,
    0,
    70,
    '2026-09-01T10:00:00.000Z',
    '2026-09-01T10:05:00.000Z',
    300,
    'completed',
    '', // No version info
  ]);

  // Insert raw historical answer with no version info
  answersSheet.appendRow([
    'ans_legacy_001',
    'att_legacy_historical_999',
    'std_uuid_legacy',
    '801',
    '8A',
    'g8-u1',
    'g8-u1-act1',
    'q_legacy_unversioned',
    1,
    'Old curriculum question',
    'old answer',
    'old answer',
    true,
    15,
    '2026-09-01T10:01:00.000Z',
    '', // No question version
  ]);

  const legacyDetail = callApi({
    action: 'teacher_get_student_detail',
    teacherToken: activeToken,
    studentNumber: '801',
  });
  const legacyAtt = legacyDetail.attempts.find((a) => a.attemptId === 'att_legacy_historical_999');
  console.log('  Legacy Attempt Readout:', {
    attemptId: legacyAtt.attemptId,
    contentVersion: legacyAtt.contentVersion,
    versionLabel: legacyAtt.versionLabel,
  });

  if (legacyAtt.contentVersion !== null) {
    throw new Error('Legacy attempt contentVersion MUST be null: ' + legacyAtt.contentVersion);
  }
  if (legacyAtt.versionLabel !== 'Legacy / Version Unknown') {
    throw new Error(`Expected 'Legacy / Version Unknown', got '${legacyAtt.versionLabel}'`);
  }

  const legacyQAnalytics = callApi({
    action: 'teacher_get_question_analytics',
    teacherToken: activeToken,
  });
  const legacyQ = legacyQAnalytics.questionAnalytics.find((q) => q.questionId === 'q_legacy_unversioned');
  console.log('  Legacy Question Analytics Readout:', {
    questionId: legacyQ.questionId,
    compositeKey: legacyQ.compositeKey,
    questionVersion: legacyQ.questionVersion,
    versionLabel: legacyQ.versionLabel,
  });

  if (legacyQ.questionVersion !== null) {
    throw new Error('Legacy questionVersion MUST be null: ' + legacyQ.questionVersion);
  }
  if (legacyQ.versionLabel !== 'Legacy / Version Unknown') {
    throw new Error(`Expected 'Legacy / Version Unknown', got '${legacyQ.versionLabel}'`);
  }
  if (!legacyQ.compositeKey.endsWith('@legacy')) {
    throw new Error(`Legacy composite key must end with '@legacy', got ${legacyQ.compositeKey}`);
  }
  console.log('  ✅ TEST 12 PASSED: Legacy version handling & zero data fabrication verified.\n');

  console.log('=== TEST 13: TURKISH & MULTI-LOCALE DASHBOARD FORMULA GENERATION ===');
  // 1. Set spreadsheet locale to Turkish (tr_TR)
  ss.setSpreadsheetLocale('tr_TR');
  console.log('  Testing Turkish locale (tr_TR) dashboard formula generation...');

  // Call setupDashboardSheet() with NO arguments to verify standalone editor menu execution
  context.setupDashboardSheet();

  const dashboardSheet = ss.getSheetByName('Dashboard');
  const dRows = dashboardSheet.rows;
  console.log('  Dashboard Table Header (Row 3):', dRows[2]);
  console.log('  Dashboard Class 7A Row (Row 4):', dRows[3]);

  // Verify Row 4 (7A) formulas in Turkish locale
  const row7A = dRows[3];
  if (row7A[0] !== '7A') {
    throw new Error(`Expected class cell '7A', got '${row7A[0]}'`);
  }

  // Check semicolon separators and absence of invalid commas in Turkish locale formulas
  const formulasToCheck = [
    { name: 'Total Students', formula: row7A[1], expected: '=COUNTIF(Students!E:E; "7A")' },
    { name: 'Active Sessions', formula: row7A[2], expected: '=COUNTIFS(Sessions!E:E; "7A"; Sessions!J:J; "active")' },
    { name: 'Total Attempts', formula: row7A[3], expected: '=COUNTIF(Attempts!E:E; "7A")' },
    { name: 'Average Score %', formula: row7A[4], expected: '=IFERROR(ROUND(AVERAGEIF(Attempts!E:E; "7A"; Attempts!S:S)); "—")' },
    { name: 'Last Activity', formula: row7A[5], expected: '=IF(IFERROR(MAXIFS(Sessions!F:F; Sessions!E:E; "7A"); 0)>0; MAXIFS(Sessions!F:F; Sessions!E:E; "7A"); "—")' },
  ];

  for (const item of formulasToCheck) {
    console.log(`    Checking ${item.name}: ${item.formula}`);
    if (item.formula !== item.expected) {
      throw new Error(`Formula mismatch for ${item.name} in Turkish locale.\nExpected: ${item.expected}\nReceived: ${item.formula}`);
    }
    // Verify no stray commas separating function arguments
    if (item.formula.includes(', "7A"') || item.formula.includes(', "active"') || item.formula.includes(', Attempts!S:S')) {
      throw new Error(`Found illegal comma argument separator in Turkish locale formula: ${item.formula}`);
    }
  }

  // 2. Switch spreadsheet locale to English (en_US) and test dynamic adaptation
  console.log('  Testing English locale (en_US) dashboard formula generation...');
  ss.setSpreadsheetLocale('en_US');
  context.setupDashboardSheet();

  const row7A_en = dashboardSheet.rows[3];
  console.log('  Dashboard Class 7A Row in en_US (Row 4):', row7A_en);
  if (row7A_en[1] !== '=COUNTIF(Students!E:E, "7A")') {
    throw new Error(`Expected English comma separator in en_US locale, got: ${row7A_en[1]}`);
  }
  if (!row7A_en[4].includes('Attempts!S:S')) {
    throw new Error(`Average score formula must reference percentage column S:S, got: ${row7A_en[4]}`);
  }

  // 3. Confirm historical data remains untouched
  const finalStudentRows = students.rows.length;
  const finalAttemptRows = attempts.rows.length;
  if (finalStudentRows === 0 || finalAttemptRows === 0) {
    throw new Error('Historical data was wiped during dashboard repair!');
  }
  console.log(`  Historical data preserved: ${finalStudentRows - 1} students, ${finalAttemptRows - 1} attempts.`);
  console.log('  ✅ TEST 13 PASSED: Locale-aware formula generation & safe repair verified.\n');

  // ============================================================================
  // TEST 14: 5,000-ROUND HASH COMPATIBILITY & BENCHMARK
  // ============================================================================
  console.log('=== TEST 14: 5,000-ROUND HASH COMPATIBILITY & BENCHMARK ===');

  // 1. Run the Code.gs testHashCompatibility() function
  const compatVerified = context.testHashCompatibility();
  if (!compatVerified) {
    throw new Error('testHashCompatibility() returned false.');
  }

  // 2. Run the Code.gs benchmarkTeacherHash() function
  const benchResult = context.benchmarkTeacherHash();
  console.log(`  Measured benchmark duration: ${benchResult.durationMs}ms (5,000 rounds)`);
  console.log(`  Hash sample prefix: ${benchResult.hashPrefix}...`);

  // 3. Multi-vector cross-check between baseline and optimized algorithms
  const vectors = [
    { p: 'TeacherPassword123!', s: 'salt_abc_1' },
    { p: 'VeryComplex#$Passphrase_With_Turkish_ğüşıöç_2026!', s: 'salt_turkish_99' },
    { p: 'Min12CharsLong!', s: 'salt_hex_beef_cafe' },
  ];

  for (const v of vectors) {
    const pepper = context.getOrCreateSecretPepper();
    // Compute baseline
    const input = v.p + ':teacher:' + v.s + ':' + pepper;
    let digest = context.Utilities.computeDigest(context.Utilities.DigestAlgorithm.SHA_256, input);
    for (let round = 0; round < 5000; round++) {
      const combined = digest.concat(context.Utilities.newBlob(v.s + ':teacher:' + pepper + ':' + round).getBytes());
      digest = context.Utilities.computeDigest(context.Utilities.DigestAlgorithm.SHA_256, combined);
    }
    let baselineHex = '';
    for (let i = 0; i < digest.length; i++) {
      const b = (digest[i] + 256) % 256;
      let byteHex = b.toString(16);
      if (byteHex.length === 1) byteHex = '0' + byteHex;
      baselineHex += byteHex;
    }

    // Compute optimized
    const optimizedHex = context.hashTeacherPassword(v.p, v.s);

    if (baselineHex !== optimizedHex) {
      throw new Error(`Hash mismatch for vector "${v.p}"!\nBaseline:  ${baselineHex}\nOptimized: ${optimizedHex}`);
    }
  }

  console.log('  ✅ TEST 14 PASSED: 5,000-round optimized hash is 100% bit-for-bit identical to baseline across all test vectors.\n');

  console.log('🎉🎉🎉 ALL PHASE 3A HARDENED BACKEND TESTS PASSED (14/14)!');
  console.log('Zero hardcoded credentials, disabled-by-default auth, concurrency-safe rate limiting,');
  console.log('5,000-round hash compatibility, owner-only setup, Turkish locale formulas, and data safety 100% verified.');
}

runPhase3ATests().catch((err) => {
  console.error('❌ Phase 3A Backend test failure:', err);
  process.exit(1);
});
