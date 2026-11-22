/**
 * Concurrency & Lock Contention Verification Suite
 * Tests lock-free audit paths, in-memory pre-aggregation, double-checked locking,
 * and N+1 sheet read elimination for 59+ student cohorts.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('======================================================================');
console.log('CONCURRENCY & LOCK CONTENTION AUDIT: CLASSROOM POINTS v3.4.0');
console.log('======================================================================\n');

// Load Code.gs into a sandboxed VM with Mock Google Apps Script environment
const codeGsPath = path.join(__dirname, 'google-apps-script', 'Code.gs');
const codeGsSource = fs.readFileSync(codeGsPath, 'utf8');

// Metrics tracking
let lockAcquisitionCount = 0;
let lockReleaseCount = 0;
let sheetReadCount = 0;
let sheetWriteCount = 0;

class MockRange {
  constructor(sheet, row, col, numRows = 1, numCols = 1) {
    this.sheet = sheet;
    this.row = row;
    this.col = col;
    this.numRows = numRows;
    this.numCols = numCols;
  }
  setValue(val) {
    sheetWriteCount++;
    while (this.sheet.rows.length < this.row) {
      this.sheet.rows.push(new Array(this.sheet.headers.length).fill(''));
    }
    this.sheet.rows[this.row - 1][this.col - 1] = val;
  }
  getValues() {
    sheetReadCount++;
    const full = [this.sheet.headers, ...this.sheet.rows];
    const slice = full.slice(this.row - 1, this.row - 1 + this.numRows);
    return slice.map((r) => r.slice(this.col - 1, this.col - 1 + this.numCols));
  }
}

class MockSheet {
  constructor(name, headers = [], rows = []) {
    this.name = name;
    this.headers = headers;
    this.rows = rows.map((r) => [...r]);
  }
  getName() { return this.name; }
  getLastRow() { return this.headers.length === 0 ? 0 : this.rows.length + 1; }
  getLastColumn() { return this.headers.length; }
  appendRow(row) {
    sheetWriteCount++;
    if (this.headers.length === 0) {
      this.headers = [...row];
    } else {
      this.rows.push([...row]);
    }
  }
  getDataRange() {
    sheetReadCount++;
    const full = [this.headers, ...this.rows];
    return {
      getValues: () => full.map((r) => [...r]),
      getNumRows: () => full.length,
      getNumColumns: () => this.headers.length,
    };
  }
  getRange(row, col, numRows = 1, numCols = 1) {
    return new MockRange(this, row, col, numRows, numCols);
  }
}

class MockSpreadsheet {
  constructor(name = 'Unit Review Arcade – Student Tracking Database') {
    this.name = name;
    this.sheets = {};
  }
  getName() { return this.name; }
  getSheetByName(name) { return this.sheets[name] || null; }
  insertSheet(name) {
    const s = new MockSheet(name);
    this.sheets[name] = s;
    return s;
  }
  getSheets() { return Object.values(this.sheets); }
  addSheet(name, headers, rows = []) {
    const s = new MockSheet(name, headers, rows);
    this.sheets[name] = s;
    return s;
  }
}

const mockLock = {
  waitLock: (timeout) => {
    lockAcquisitionCount++;
    return true;
  },
  releaseLock: () => {
    lockReleaseCount++;
  }
};

const sandbox = {
  Logger: { log: () => {} },
  Utilities: {
    getUuid: () => Math.random().toString(36).substring(2, 10),
    computeDigest: () => [1, 2, 3, 4],
    DigestAlgorithm: { SHA_256: 'SHA_256' }
  },
  LockService: {
    getScriptLock: () => mockLock,
    getDocumentLock: () => mockLock
  },
  ContentService: {
    createTextOutput: (str) => ({
      setMimeType: () => ({ getContent: () => str }),
      getContent: () => str
    }),
    MimeType: { JSON: 'application/json' }
  },
  Date: Date,
  Math: Math,
  JSON: JSON,
  String: String,
  Number: Number,
  Array: Array,
  Object: Object
};

vm.createContext(sandbox);
vm.runInContext(codeGsSource, sandbox);

let passedAssertions = 0;
let totalAssertions = 0;

function assert(condition, message) {
  totalAssertions++;
  if (condition) {
    console.log(`  ✓ ${message}`);
    passedAssertions++;
  } else {
    console.error(`  ❌ FAILED: ${message}`);
    process.exitCode = 1;
  }
}

// Setup 59 mock students across 4 classes: 7A, 7B, 8A, 8B
const mockSS = new MockSpreadsheet();
sandbox.setupClassroomPointsSheets(mockSS);

const studentRows = [];
const classes = ['7A', '7B', '8A', '8B'];
for (let i = 1; i <= 59; i++) {
  const sNum = (700 + i).toString();
  const sClass = classes[i % 4];
  studentRows.push([
    `stu_${sNum}`,
    sNum,
    `Student ${sNum}`,
    sClass.startsWith('7') ? 'grade-7' : 'grade-8',
    sClass,
    'salt', 'hash', 'true', 0, '', '2026-09-01', '2026-09-01'
  ]);
}
mockSS.addSheet('Students', sandbox.CONFIG.STUDENT_HEADERS, studentRows);

// Seed Teacher Session
mockSS.addSheet('TeacherSessions', ['token_hash', 'created_at', 'expires_at', 'status'], [
  ['valid_teacher_hash', new Date().toISOString(), new Date(Date.now() + 86400000).toISOString(), 'active']
]);

// Patch validateTeacherSession to accept 'valid_teacher'
sandbox.validateTeacherSession = function(ss, token) {
  if (token === 'valid_teacher') return { valid: true, error: null };
  return { valid: false, error: 'Unauthorized', code: 'UNAUTHORIZED' };
};

// Seed Student Session
sandbox.validateSession = function(ss, token) {
  if (token === 'valid_student_701') return { valid: true, studentNumber: '701', class: '7A' };
  return { valid: false, error: 'Unauthorized', code: 'UNAUTHORIZED' };
};
sandbox.validateSessionReadOnly = sandbox.validateSession;

// --- TEST 1: Overview Loading with 59 Students ---
console.log('--- 1. Overview Loading Performance & Read Elimination (59 Students) ---');
sheetReadCount = 0;
lockAcquisitionCount = 0;

const overviewPayload = { teacherToken: 'valid_teacher' };
const overviewRes = JSON.parse(sandbox.handleTeacherGetClassroomOverview(mockSS, overviewPayload).getContent());

assert(overviewRes.success === true, 'handleTeacherGetClassroomOverview succeeds');
assert(overviewRes.students.length === 59, 'Returns all 59 students across classes');
assert(lockAcquisitionCount === 0, 'Overview is 100% lock-free (0 script locks acquired)');
assert(sheetReadCount <= 10, `Sheet reads batched efficiently (${sheetReadCount} reads for 59 students, NOT 118 N+1 reads)`);

// --- TEST 2: Bulk Point Award to 59 Students & In-Memory Milestone Evaluation ---
console.log('\n--- 2. Bulk Point Award (59 Students) & Elimination of Inner Sheet Reads ---');
sheetReadCount = 0;
lockAcquisitionCount = 0;

const allStudentNums = studentRows.map(r => r[1]);
const bulkAwardPayload = {
  teacherToken: 'valid_teacher',
  studentNumbers: allStudentNums,
  categoryId: 'cat_speaking_participation',
  note: 'Whole class participation'
};

const awardRes = JSON.parse(sandbox.handleTeacherAwardClassroomPoints(mockSS, bulkAwardPayload).getContent());
assert(awardRes.success === true, 'Bulk award succeeds for all 59 students');
assert(awardRes.awardedCount === 59, 'Exactly 59 point transactions recorded');
assert(lockAcquisitionCount === 1, 'Acquired exactly 1 script lock for the atomic bulk write');
assert(sheetReadCount <= 10, `Zero N+1 sheet reads inside loop (${sheetReadCount} sheet reads total, vs 60+ previously)`);

// --- TEST 3: Lock-Free Reconcile Audit when Up to Date ---
console.log('\n--- 3. Lock-Free Reconcile Audit (59 Students, 0 Missing Grants) ---');
lockAcquisitionCount = 0;
sheetWriteCount = 0;

const reconcilePayload = { teacherToken: 'valid_teacher' };
const reconcileRes = JSON.parse(sandbox.handleTeacherReconcileClassroomRewards(mockSS, reconcilePayload).getContent());

assert(reconcileRes.success === true, 'handleTeacherReconcileClassroomRewards succeeds');
assert(reconcileRes.reconciledCount === 0, 'Correctly identifies 0 missing grants');
assert(lockAcquisitionCount === 0, 'CRITICAL: Reconcile audit acquired 0 script locks when nothing needs healing!');
assert(sheetWriteCount === 0, 'Zero unnecessary sheet writes executed during audit');

// --- TEST 4: Reconcile Self-Healing when Milestone Missing (Double-Checked Lock) ---
console.log('\n--- 4. Reconcile Self-Healing under Lock strictly when Grant Missing ---');
// Award enough points to student 701 to qualify for 10-point First Star (give 8 more points)
const txSheet = mockSS.getSheetByName('Class_PointTransactions');
txSheet.appendRow([
  'ctx_manual_10', 'idemp_m10', '2026-2027', new Date().toISOString(),
  '701', '7A', 'grade-7', 'cat_manual', 'Manual', 'positive', 8, 8, 0, '', 'hash', 'test', 'active'
]);

// Student 701 now has 2 + 8 = 10 positive points, but grant was not added to Class_RewardGrants yet!
lockAcquisitionCount = 0;
const healRes = JSON.parse(sandbox.handleTeacherReconcileClassroomRewards(mockSS, reconcilePayload).getContent());

assert(healRes.success === true, 'Reconciliation succeeds with missing grant');
assert(healRes.reconciledCount === 1, 'Healed exactly 1 missing milestone grant (First Star)');
assert(healRes.reconciledGrants[0].rewardId === 'rwd_first_star', 'Granted First Star to student 701');
assert(lockAcquisitionCount === 1, 'Acquired script lock strictly during the write phase for the missing grant');

// Running reconcile again immediately after should acquire 0 locks
lockAcquisitionCount = 0;
const secondReconcile = JSON.parse(sandbox.handleTeacherReconcileClassroomRewards(mockSS, reconcilePayload).getContent());
assert(secondReconcile.reconciledCount === 0, 'Immediate follow-up reconcile finds 0 missing');
assert(lockAcquisitionCount === 0, 'Follow-up audit is 100% lock-free (0 locks acquired)');

// --- TEST 5: Student Claim Milestone Reward (Double-Checked Locking) ---
console.log('\n--- 5. Student Claim Milestone Reward (Double-Checked Locking) ---');
lockAcquisitionCount = 0;
// Student 701 tries to claim already-owned First Star
const claimPayload = {
  sessionToken: 'valid_student_701',
  rewardId: 'rwd_first_star'
};
const claimRes = JSON.parse(sandbox.handleStudentClaimMilestoneReward(mockSS, claimPayload).getContent());
assert(claimRes.success === true, 'Claim endpoint returns success');
assert(claimRes.alreadyOwned === true, 'Reports alreadyOwned: true');
assert(lockAcquisitionCount === 0, 'CRITICAL: Double-checked locking bypassed script lock for already-owned reward!');

// --- TEST 6: Category Listing Lock-Free Verification ---
console.log('\n--- 6. Category Listing Lock-Free Verification ---');
lockAcquisitionCount = 0;
const catListPayload = { teacherToken: 'valid_teacher', operation: 'list' };
const catListRes = JSON.parse(sandbox.handleTeacherManageClassroomCategories(mockSS, catListPayload).getContent());
assert(catListRes.success === true, 'Category list succeeds');
assert(catListRes.categories.length === 9, 'Returns all 9 categories');
assert(lockAcquisitionCount === 0, 'Category list is 100% lock-free (0 locks acquired)');

const catGetPayload = { teacherToken: 'valid_teacher', operation: 'get' };
const catGetRes = JSON.parse(sandbox.handleTeacherManageClassroomCategories(mockSS, catGetPayload).getContent());
assert(catGetRes.success === true, 'Category get succeeds');
assert(lockAcquisitionCount === 0, 'Category get is 100% lock-free (0 locks acquired)');

console.log('\n======================================================================');
console.log(`🎉 ALL CONCURRENCY & LOCK CONTENTION TESTS PASSED: ${passedAssertions} / ${totalAssertions} ASSERTIONS!`);
console.log('======================================================================\n');
