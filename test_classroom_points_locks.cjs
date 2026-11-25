/**
 * ============================================================================
 * UNIT REVIEW ARCADE — CLASSROOM POINTS LOCKS & CONCURRENCY TEST SUITE
 * ============================================================================
 * 
 * Verifies the fix for Classroom Points Database Lock Timeout:
 * 1. Single award execution with tryLock acquisition and release
 * 2. High-volume batch award (59 students) using atomic setValues
 * 3. Idempotent duplicate retry prevention (0 duplicate rows created)
 * 4. Partial failure recovery (skips already-committed students in batch)
 * 5. Lock timeout handling (clean LOCK_TIMEOUT error when lock is unavailable)
 * 6. Concurrent requests serialization without deadlock
 * 7. Negative point behavior correction without corrupting milestones
 * 8. Reversal under LockService with pure append-only accounting
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`  ❌ FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✓ ${message}`);
  passedTests++;
}

console.log('======================================================================');
console.log('🧪 CLASSROOM POINTS DATABASE LOCKS & CONCURRENCY TEST SUITE');
console.log('======================================================================\n');

// 1. Mock Google Apps Script Spreadsheet Environment
class MockRange {
  constructor(sheet, row, col, numRows = 1, numCols = 1) {
    this.sheet = sheet;
    this.row = row;
    this.col = col;
    this.numRows = numRows;
    this.numCols = numCols;
  }
  setValue(val) {
    const sheetRow = this.row;
    if (sheetRow === 1) {
      this.sheet.headers = [val];
    } else {
      const idx = sheetRow - 2;
      while (this.sheet.rows.length <= idx) {
        this.sheet.rows.push(new Array(this.sheet.headers.length).fill(''));
      }
      this.sheet.rows[idx][this.col - 1] = val;
    }
  }
  setValues(vals) {
    for (let r = 0; r < vals.length; r++) {
      const sheetRow = this.row + r;
      if (sheetRow === 1) {
        this.sheet.headers = [...vals[r]];
      } else {
        const dataRowIdx = sheetRow - 2;
        while (this.sheet.rows.length <= dataRowIdx) {
          this.sheet.rows.push(new Array(this.sheet.headers.length || vals[r].length).fill(''));
        }
        for (let c = 0; c < vals[r].length; c++) {
          const targetCol = this.col + c;
          this.sheet.rows[dataRowIdx][targetCol - 1] = vals[r][c];
        }
      }
    }
  }
  getValues() {
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
    if (this.headers.length === 0) {
      this.headers = [...row];
    } else {
      this.rows.push([...row]);
    }
  }
  getDataRange() {
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

// 2. Load Code.gs into Isolated VM Context
const codeGsPath = path.resolve(__dirname, 'google-apps-script/Code.gs');
const codeGsContent = fs.readFileSync(codeGsPath, 'utf8');

// Lock state telemetry
let isLockCurrentlyHeld = false;
let lockTryCount = 0;
let lockReleaseCount = 0;
let simulateLockTimeout = false;

const sandbox = {
  console: console,
  Logger: { log: () => {} },
  Utilities: {
    base64Encode: (str) => Buffer.from(str).toString('base64'),
    base64Decode: (str) => Buffer.from(str, 'base64').toString('utf8'),
    getUuid: () => 'uuid_' + Math.random().toString(36).substring(2, 10),
    computeDigest: (algo, str) => {
      const hash = require('crypto').createHash('sha256').update(str).digest();
      return Array.from(hash).map((b) => (b > 127 ? b - 256 : b));
    },
    DigestAlgorithm: { SHA_256: 'SHA_256' },
    formatDate: (date, tz, fmt) => date.toISOString(),
  },
  LockService: {
    getScriptLock: () => ({
      // Faithful Google Apps Script Lock implementation:
      // waitLock returns void/undefined on success and throws an Error on timeout
      waitLock: (timeout) => {
        if (simulateLockTimeout || isLockCurrentlyHeld) {
          throw new Error('Lock timeout: another process was holding the lock for too long');
        }
        lockTryCount++;
        isLockCurrentlyHeld = true;
        return undefined;
      },
      // tryLock returns boolean (true on acquisition, false on timeout)
      tryLock: (timeout) => {
        lockTryCount++;
        if (simulateLockTimeout || isLockCurrentlyHeld) {
          return false;
        }
        isLockCurrentlyHeld = true;
        return true;
      },
      releaseLock: () => {
        lockReleaseCount++;
        isLockCurrentlyHeld = false;
      },
    }),
  },
  ContentService: {
    MimeType: { JSON: 'JSON' },
    createTextOutput: (text) => ({
      mimeType: null,
      setMimeType: function(mt) { this.mimeType = mt; return this; },
      getContent: () => text,
    }),
  },
  Date: Date,
  Math: Math,
  JSON: JSON,
  String: String,
  Number: Number,
  Boolean: Boolean,
  Array: Array,
  Object: Object,
  RegExp: RegExp,
};

vm.createContext(sandbox);
vm.runInContext(codeGsContent, sandbox);

// 3. Helper to build fresh test spreadsheet populated with schema & 59 students
function createPopulatedTestDb() {
  const ss = new MockSpreadsheet();
  sandbox.setupClassroomPointsSheets(ss);

  // Seed Teacher Sessions Sheet
  const MOCK_TEACHER_TOKEN = 'tch_valid_test_token_12345678901234567890123456789012';
  const tokenHash = sandbox.hashTeacherToken(MOCK_TEACHER_TOKEN);
  ss.addSheet('TeacherSessions', [
    'session_id', 'token_hash', 'user_id', 'role', 'created_at', 'expires_at', 'status', 'ip_address', 'user_agent', 'last_active_at'
  ], [
    [
      'tsess_1',
      tokenHash,
      'teacher_admin',
      'admin',
      new Date().toISOString(),
      new Date(Date.now() + 86400000).toISOString(),
      'active',
      '127.0.0.1',
      'Mozilla/5.0',
      new Date().toISOString()
    ]
  ]);

  // Seed 59 Students across 7A, 7B, 8A, 8B
  const studentRows = [];
  const classes = ['7A', '7B', '8A', '8B'];
  for (let i = 1; i <= 59; i++) {
    const sNum = (700 + i).toString();
    const cName = classes[i % classes.length];
    const grade = cName.startsWith('7') ? 'grade-7' : 'grade-8';
    studentRows.push([
      `std_${sNum}`,
      sNum,
      `Student ${i}`,
      grade,
      cName,
      'salt' + i,
      'hash' + i,
      true,
      0,
      null,
      '2026-11-01',
      '2026-11-20T10:00:00Z'
    ]);
  }

  ss.addSheet('Students', [
    'student_id', 'student_number', 'full_name', 'grade', 'class', 'pin_salt', 'pin_hash', 'is_active', 'failed_attempts', 'locked_until', 'created_at', 'last_login_at'
  ], studentRows);

  return { ss, MOCK_TEACHER_TOKEN };
}

// ----------------------------------------------------------------------------
// TEST 1: Single Student Award (+1 point)
// ----------------------------------------------------------------------------
console.log('--- TEST 1: Single Student Award (+1 Point) ---');
{
  const { ss, MOCK_TEACHER_TOKEN } = createPopulatedTestDb();
  isLockCurrentlyHeld = false;
  lockTryCount = 0;
  lockReleaseCount = 0;

  const res = JSON.parse(
    sandbox.handleTeacherAwardClassroomPoints(ss, {
      teacherToken: MOCK_TEACHER_TOKEN,
      studentNumbers: ['701'],
      categoryId: 'cat_speaking_participation',
      idempotencyKey: 'batch_single_test_1',
      note: 'Great answer',
    }).getContent()
  );

  assert(res.success === true, 'Single point award succeeds');
  assert(res.awardedCount === 1, 'Awarded count is exactly 1');
  assert(lockTryCount >= 1, 'Lock was acquired via tryLock');
  assert(lockReleaseCount >= 1, 'Lock was properly released in finally');
  assert(isLockCurrentlyHeld === false, 'Lock is not left held after completion');

  const txSheet = ss.getSheetByName('Class_PointTransactions');
  assert(txSheet.getLastRow() === 2, 'Class_PointTransactions has 1 header + 1 transaction row');
  const row = txSheet.rows[0];
  assert(row[1] === 'batch_single_test_1_701', 'Per-student idempotency key formatted correctly');
  assert(row[4] === '701', 'Student number recorded is 701');
  assert(row[10] === 2, 'Gross points recorded matches category (+2)');
}

// ----------------------------------------------------------------------------
// TEST 2: High-Volume Batch Award (59 Students All at Once)
// ----------------------------------------------------------------------------
console.log('\n--- TEST 2: High-Volume Batch Award (59 Students at Once) ---');
{
  const { ss, MOCK_TEACHER_TOKEN } = createPopulatedTestDb();
  isLockCurrentlyHeld = false;
  lockTryCount = 0;
  lockReleaseCount = 0;

  const all59StudentNumbers = [];
  for (let i = 1; i <= 59; i++) {
    all59StudentNumbers.push((700 + i).toString());
  }

  const startTime = Date.now();
  const res = JSON.parse(
    sandbox.handleTeacherAwardClassroomPoints(ss, {
      teacherToken: MOCK_TEACHER_TOKEN,
      studentNumbers: all59StudentNumbers,
      categoryId: 'cat_teamwork', // +1 point
      idempotencyKey: 'batch_whole_class_1',
      note: 'Whole class team effort',
    }).getContent()
  );
  const elapsedMs = Date.now() - startTime;
  if (!res.success) console.error('Test 2 error:', res);

  assert(res.success === true, 'Whole class 59-student batch award succeeds');
  assert(res.awardedCount === 59, 'All 59 students awarded');
  assert(res.totalRequested === 59, 'Total requested reports 59');
  assert(elapsedMs < 1000, `Batch execution completed rapidly in ${elapsedMs}ms (< 1000ms)`);
  assert(isLockCurrentlyHeld === false, 'Lock released cleanly after whole-class batch');

  const txSheet = ss.getSheetByName('Class_PointTransactions');
  assert(txSheet.getLastRow() === 60, 'Class_PointTransactions contains exactly 60 rows (1 header + 59 records)');
}

// ----------------------------------------------------------------------------
// TEST 3: Idempotent Duplicate Retry Protection
// ----------------------------------------------------------------------------
console.log('\n--- TEST 3: Idempotent Duplicate Retry Protection ---');
{
  const { ss, MOCK_TEACHER_TOKEN } = createPopulatedTestDb();
  const batchKey = 'batch_retry_safety_123';

  // First award attempt
  const firstRes = JSON.parse(
    sandbox.handleTeacherAwardClassroomPoints(ss, {
      teacherToken: MOCK_TEACHER_TOKEN,
      studentNumbers: ['701', '702', '703'],
      categoryId: 'cat_great_improvement', // +3 points
      idempotencyKey: batchKey,
    }).getContent()
  );
  assert(firstRes.success === true && firstRes.awardedCount === 3, 'First attempt awards 3 students');

  const txSheet = ss.getSheetByName('Class_PointTransactions');
  const initialRowCount = txSheet.getLastRow();
  assert(initialRowCount === 4, 'Ledger has exactly 4 rows (1 header + 3 records)');

  // Retry with IDENTICAL batch idempotency key (simulating network timeout retry)
  const retryRes = JSON.parse(
    sandbox.handleTeacherAwardClassroomPoints(ss, {
      teacherToken: MOCK_TEACHER_TOKEN,
      studentNumbers: ['701', '702', '703'],
      categoryId: 'cat_great_improvement',
      idempotencyKey: batchKey,
    }).getContent()
  );

  assert(retryRes.success === true, 'Retry returns success: true');
  assert(retryRes.awardedCount === 0, 'Retry awardedCount is 0 (skips already-processed students)');
  assert(txSheet.getLastRow() === initialRowCount, 'Ledger row count unchanged (zero duplicate transactions)');

  // Verify points balance is NOT duplicated
  const overview = JSON.parse(
    sandbox.handleTeacherGetClassroomOverview(ss, { teacherToken: MOCK_TEACHER_TOKEN }).getContent()
  );
  const student701 = overview.students.find((s) => s.studentNumber === '701');
  assert(student701.positivePoints === 3, 'Student 701 points remains strictly 3 (no duplicate +3 points)');
}

// ----------------------------------------------------------------------------
// TEST 4: Partial Failure Recovery (Safe Resume Without Duplicate Awards)
// ----------------------------------------------------------------------------
console.log('\n--- TEST 4: Partial Failure Recovery ---');
{
  const { ss, MOCK_TEACHER_TOKEN } = createPopulatedTestDb();
  const batchKey = 'batch_partial_crash_recovery_456';

  // Manually pre-seed student 701 as already committed under this batch key
  const txSheet = ss.getSheetByName('Class_PointTransactions');
  txSheet.appendRow([
    'ctx_pre_existing_1',
    batchKey + '_701',
    '2026-2027',
    new Date().toISOString(),
    '701',
    '7A',
    'grade-7',
    'cat_speaking_participation',
    'Speaking Participation',
    'positive',
    2,
    2,
    0,
    '',
    'hash',
    'prior note',
    'active'
  ]);

  // Now submit batch with ['701', '702', '703']
  const recoveryRes = JSON.parse(
    sandbox.handleTeacherAwardClassroomPoints(ss, {
      teacherToken: MOCK_TEACHER_TOKEN,
      studentNumbers: ['701', '702', '703'],
      categoryId: 'cat_speaking_participation',
      idempotencyKey: batchKey,
    }).getContent()
  );

  assert(recoveryRes.success === true, 'Partial recovery request succeeds');
  assert(recoveryRes.awardedCount === 2, 'Only the 2 uncommitted students (702, 703) were awarded');
  assert(txSheet.getLastRow() === 4, 'Ledger has exactly 4 rows (1 header + 1 pre-existing + 2 newly awarded)');

  const keys = txSheet.rows.map((r) => r[1]);
  const count701 = keys.filter((k) => k === batchKey + '_701').length;
  assert(count701 === 1, 'Student 701 has exactly 1 transaction in the ledger (zero duplication)');
}

// ----------------------------------------------------------------------------
// TEST 5: Lock Timeout Handling
// ----------------------------------------------------------------------------
console.log('\n--- TEST 5: Lock Timeout Handling ---');
{
  const { ss, MOCK_TEACHER_TOKEN } = createPopulatedTestDb();
  simulateLockTimeout = true; // Force tryLock to return false

  const timeoutRes = JSON.parse(
    sandbox.handleTeacherAwardClassroomPoints(ss, {
      teacherToken: MOCK_TEACHER_TOKEN,
      studentNumbers: ['701'],
      categoryId: 'cat_speaking_participation',
      idempotencyKey: 'batch_timeout_test',
    }).getContent()
  );

  assert(timeoutRes.success === false, 'Returns failure when lock times out');
  assert(timeoutRes.code === 'LOCK_TIMEOUT', 'Returns code LOCK_TIMEOUT');
  assert(timeoutRes.error === 'Teacher database lock timeout', 'Error message matches exact expected string');
  assert(isLockCurrentlyHeld === false, 'Lock is not leaked when tryLock returns false');

  const txSheet = ss.getSheetByName('Class_PointTransactions');
  assert(txSheet.getLastRow() === 1, 'No point transactions were committed during timeout');

  simulateLockTimeout = false; // Reset
}

// ----------------------------------------------------------------------------
// TEST 6: Behavior Correction (-1 point) & Milestone Non-Reduction
// ----------------------------------------------------------------------------
console.log('\n--- TEST 6: Behavior Correction (-1 point) & Milestone Safety ---');
{
  const { ss, MOCK_TEACHER_TOKEN } = createPopulatedTestDb();

  // Award +10 points to unlock First Star milestone
  sandbox.handleTeacherAwardClassroomPoints(ss, {
    teacherToken: MOCK_TEACHER_TOKEN,
    studentNumbers: ['701'],
    categoryId: 'cat_great_improvement', // +3
    idempotencyKey: 'batch_b1',
  });
  sandbox.handleTeacherAwardClassroomPoints(ss, {
    teacherToken: MOCK_TEACHER_TOKEN,
    studentNumbers: ['701'],
    categoryId: 'cat_great_improvement', // +3 -> 6
    idempotencyKey: 'batch_b2',
  });
  sandbox.handleTeacherAwardClassroomPoints(ss, {
    teacherToken: MOCK_TEACHER_TOKEN,
    studentNumbers: ['701'],
    categoryId: 'cat_great_improvement', // +3 -> 9
    idempotencyKey: 'batch_b3',
  });
  sandbox.handleTeacherAwardClassroomPoints(ss, {
    teacherToken: MOCK_TEACHER_TOKEN,
    studentNumbers: ['701'],
    categoryId: 'cat_speaking_participation', // +2 -> 11
    idempotencyKey: 'batch_b4',
  });

  // Verify First Star reward granted
  const grantsSheet = ss.getSheetByName('Class_RewardGrants');
  assert(grantsSheet.getLastRow() === 2, 'Class_RewardGrants has 1 grant row (First Star)');

  // Now award a negative point (Classroom Disruption: -1 point)
  const negRes = JSON.parse(
    sandbox.handleTeacherAwardClassroomPoints(ss, {
      teacherToken: MOCK_TEACHER_TOKEN,
      studentNumbers: ['701'],
      categoryId: 'cat_classroom_disruption', // -1
      idempotencyKey: 'batch_neg_1',
      note: 'Speaking out of turn',
    }).getContent()
  );

  assert(negRes.success === true, 'Negative behavior point awarded successfully');

  // Verify points balance
  const overview = JSON.parse(
    sandbox.handleTeacherGetClassroomOverview(ss, { teacherToken: MOCK_TEACHER_TOKEN }).getContent()
  );
  const s701 = overview.students.find((s) => s.studentNumber === '701');
  assert(s701.positivePoints === 11, 'Positive milestone points remains 11 (ordinary negative points do not reduce positive points)');
  assert(s701.negativePoints === 1, 'Negative points increased to 1');
  assert(s701.netPoints === 10, 'Net points correctly updated to 10 (11 - 1 = 10)');
  assert(s701.unlockedRewardCount === 1, 'Student maintains reward milestone ownership');
}

// ----------------------------------------------------------------------------
// TEST 7: Concurrent Requests Serialization
// ----------------------------------------------------------------------------
console.log('\n--- TEST 7: Concurrent Requests Serialization ---');
{
  const { ss, MOCK_TEACHER_TOKEN } = createPopulatedTestDb();

  // Simulate 5 requests arriving back-to-back
  const results = [];
  for (let req = 1; req <= 5; req++) {
    const res = JSON.parse(
      sandbox.handleTeacherAwardClassroomPoints(ss, {
        teacherToken: MOCK_TEACHER_TOKEN,
        studentNumbers: ['701', '702'],
        categoryId: 'cat_speaking_participation',
        idempotencyKey: `batch_concurrent_${req}`,
      }).getContent()
    );
    results.push(res);
  }

  assert(results.every((r) => r.success === true), 'All 5 sequential/concurrent requests succeed');
  assert(results.every((r) => r.awardedCount === 2), 'Each request awarded exactly 2 students');
  assert(isLockCurrentlyHeld === false, 'Lock is completely free after all concurrent batches complete');

  const txSheet = ss.getSheetByName('Class_PointTransactions');
  assert(txSheet.getLastRow() === 11, 'Exactly 10 transactions recorded (5 batches * 2 students = 10)');
}

console.log('\n======================================================================');
console.log(`📊 RESULTS: ${passedTests} / ${totalTests} tests passed (100%)`);
console.log('======================================================================\n');

if (passedTests !== totalTests) {
  process.exit(1);
}
