/**
 * ============================================================================
 * UNIT REVIEW ARCADE — CLASSROOM POINTS REVERSALS & UI IMPROVEMENTS E2E TESTS
 * ============================================================================
 * 
 * Verifies:
 * 1. Action Name Mismatch Resolution & Routing via doPost (both primary and alias).
 * 2. Single Award & Single Reversal ledger math & double-entry compensating row.
 * 3. Batch Award & Scoped Batch Undo (verifies ONLY batch transactions are reversed).
 * 4. Isolation: Unrelated student transactions are never affected by batch Undo.
 * 5. Double-reversal prevention (ALREADY_REVERSED) on retries.
 * 6. Correction row immutability (INVALID_OPERATION) on attempting to reverse a reversal.
 * 7. Append-only ledger integrity: Historical rows are never deleted or modified.
 * 8. UI contract tests: 8-second Undo notification, student points badge click-to-history,
 *    and frontend API service compatibility.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

let totalChecks = 0;
let passedChecks = 0;

function assert(condition, message) {
  totalChecks++;
  if (!condition) {
    console.error(`  ❌ FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✓ ${message}`);
  passedChecks++;
}

console.log('======================================================================');
console.log('E2E TEST SUITE: CLASSROOM POINTS REVERSALS & UI IMPROVEMENTS');
console.log('======================================================================\n');

// 1. Mock Google Apps Script Environment
class MockRange {
  constructor(sheet, row, col, numRows = 1, numCols = 1) {
    this.sheet = sheet;
    this.row = row;
    this.col = col;
    this.numRows = numRows;
    this.numCols = numCols;
  }
  setValue(val) {
    while (this.sheet.rows.length < this.row) {
      this.sheet.rows.push(new Array(this.sheet.headers.length).fill(''));
    }
    this.sheet.rows[this.row - 1][this.col - 1] = val;
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
}

class MockLock {
  constructor() { this.hasLock = false; }
  tryLock(ms) { this.hasLock = true; return true; }
  waitLock(ms) { this.hasLock = true; return true; }
  releaseLock() { this.hasLock = false; }
}

const mockLockService = {
  getScriptLock: () => new MockLock(),
};

const mockUtilities = {
  getUuid: () => 'uuid_' + Math.random().toString(36).substring(2, 8),
  computeDigest: (algo, str) => {
    const hash = require('crypto').createHash('sha256').update(str).digest();
    return Array.from(hash).map((b) => (b > 127 ? b - 256 : b));
  },
  DigestAlgorithm: { SHA_256: 'SHA_256' },
};

function createJsonResponse(obj) {
  return {
    getContent: () => JSON.stringify(obj),
    getMimeType: () => 'application/json',
  };
}

const mockContentService = {
  createTextOutput: (text) => ({
    setMimeType: () => ({
      getContent: () => text,
    }),
    getContent: () => text,
  }),
  MimeType: { JSON: 'application/json' },
};

// 2. Load and evaluate Code.gs in VM context
const codePath = path.join(__dirname, 'google-apps-script', 'Code.gs');
const codeContent = fs.readFileSync(codePath, 'utf8');

const sandbox = {
  SpreadsheetApp: { openById: () => new MockSpreadsheet() },
  LockService: mockLockService,
  Utilities: mockUtilities,
  ContentService: mockContentService,
  Logger: { log: () => {} },
  createJsonResponse: createJsonResponse,
  console: console,
};

vm.createContext(sandbox);
vm.runInContext(codeContent, sandbox);

// 3. Set up realistic database environment
const ss = new MockSpreadsheet();
sandbox.getArcadeSpreadsheet = () => ss;

// Seed Teacher Accounts & Sessions
const TEST_TEACHER_TOKEN = 'tch_valid_teacher_session_token_123';
const crypto = require('crypto');
const teacherHash = crypto.createHash('sha256').update(TEST_TEACHER_TOKEN).digest('hex');

const sessSheet = ss.insertSheet('TeacherSessions');
sessSheet.headers = ['session_id', 'teacher_token_hash', 'authenticated_at', 'expires_at', 'client_ip', 'user_agent', 'status'];
sessSheet.rows.push([
  'tch_sess_1',
  teacherHash,
  new Date().toISOString(),
  new Date(Date.now() + 86400000).toISOString(),
  '127.0.0.1',
  'Node/Test',
  'active'
]);

const teacherSheet = ss.insertSheet('Teacher_Accounts');
teacherSheet.headers = ['teacher_id', 'username', 'display_name', 'session_token', 'token_expires_at', 'role'];
teacherSheet.rows.push([
  'tch_001',
  'teacher@school.edu',
  'Class Teacher',
  TEST_TEACHER_TOKEN,
  new Date(Date.now() + 86400000).toISOString(),
  'teacher'
]);

// Seed Student Accounts
const studentSheet = ss.insertSheet('Student_Accounts');
studentSheet.headers = ['student_id', 'student_number', 'full_name', 'class', 'grade', 'pin', 'avatar', 'created_at', 'last_login', 'total_xp', 'total_coins'];
['701', '702', '703', '704', '705'].forEach((num, idx) => {
  studentSheet.rows.push([
    `std_${num}`,
    num,
    `Student ${num}`,
    '7A',
    'grade-7',
    '1234',
    'default',
    '2026-11-20T10:00:00Z',
    '2026-11-24T10:00:00Z',
    150,
    50
  ]);
});

// Initialize Classroom Sheets
sandbox.setupClassroomPointsSheets(ss);

// ----------------------------------------------------------------------------
// Test 1: Action Name Routing via doPost (Primary & Alias)
// ----------------------------------------------------------------------------
console.log('\n--- Test 1: Action Name Routing via doPost ---');

function invokeDoPost(action, postData) {
  const e = {
    postData: {
      contents: JSON.stringify({
        action: action,
        teacherToken: TEST_TEACHER_TOKEN,
        ...postData,
      }),
    },
  };
  // In our sandbox, doPost opens the spreadsheet. Wire ss to openById:
  sandbox.SpreadsheetApp.openById = () => ss;
  sandbox.SpreadsheetApp.getActiveSpreadsheet = () => ss;
  const res = sandbox.doPost(e);
  return JSON.parse(res.getContent());
}

// 1.1 Award +2 Speaking to Student 701
const awardRes1 = invokeDoPost('teacher_award_classroom_points', {
  studentNumbers: ['701'],
  categoryId: 'cat_speaking_participation',
  idempotencyKey: 'batch_test_001',
  note: 'Great English answer in class',
});

assert(awardRes1.success === true, 'teacher_award_classroom_points awards points successfully');
assert(awardRes1.awardedCount === 1, 'Award count is 1');
assert(Array.isArray(awardRes1.transactions) && awardRes1.transactions.length === 1, 'Award response contains transactions array');
const tx701 = awardRes1.transactions[0];
assert(tx701.studentNumber === '701' && tx701.transactionId.startsWith('ctx_'), 'Transaction record has valid ID and studentNumber');

// Check 701 balances
const bal701 = sandbox.getStudentClassroomPointsForYear(ss, '701', '2026-2027');
assert(bal701.positivePoints === 2 && bal701.netPoints === 2, 'Student 701 has +2 positive points and +2 net points');

// 1.2 Revert using primary action name: teacher_revert_classroom_point_transaction
const revertResPrimary = invokeDoPost('teacher_revert_classroom_point_transaction', {
  transactionId: tx701.transactionId,
  reason: 'Accidental click on Smartboard',
});

assert(revertResPrimary.success === true, 'doPost correctly routes teacher_revert_classroom_point_transaction');
assert(revertResPrimary.reversedTransactionId === tx701.transactionId, 'Reversal confirms reversed transaction ID');
assert(revertResPrimary.updatedBalances.positivePoints === 0, 'Student 701 balance restored to 0 positive points');
assert(revertResPrimary.updatedBalances.netPoints === 0, 'Student 701 balance restored to 0 net points');

// 1.3 Award another point to test alias routing
const awardRes2 = invokeDoPost('teacher_award_classroom_points', {
  studentNumbers: ['701'],
  categoryId: 'cat_using_english',
  idempotencyKey: 'batch_test_002',
});
assert(awardRes2.success === true, 'Second award succeeds');
const tx701Second = awardRes2.transactions[0];

// 1.4 Revert using alias action name: teacher_revert_classroom_transaction
const revertResAlias = invokeDoPost('teacher_revert_classroom_transaction', {
  transactionId: tx701Second.transactionId,
  reason: 'Tested via alias action name',
});
assert(revertResAlias.success === true, 'doPost correctly routes alias teacher_revert_classroom_transaction');
assert(revertResAlias.reversedTransactionId === tx701Second.transactionId, 'Alias reversal successfully processed');

// ----------------------------------------------------------------------------
// Test 2: Batch Award & Scoped Batch Undo
// ----------------------------------------------------------------------------
console.log('\n--- Test 2: Batch Award & Scoped Batch Undo ---');

// Award +1 Using English to Students 702, 703, 704
const batchAwardRes = invokeDoPost('teacher_award_classroom_points', {
  studentNumbers: ['702', '703', '704'],
  categoryId: 'cat_using_english',
  idempotencyKey: 'batch_team_english_003',
  note: 'Group discussion in English',
});

assert(batchAwardRes.success === true, 'Batch award to 3 students succeeds');
assert(batchAwardRes.awardedCount === 3, 'Batch award count is exactly 3');
assert(batchAwardRes.transactions.length === 3, 'Response contains 3 distinct transaction records');

const batchTxIds = batchAwardRes.transactions.map((t) => t.transactionId);
assert(new Set(batchTxIds).size === 3, 'All 3 batch transaction IDs are unique');

// Separate unrelated award to Student 705 (+3 Great Improvement)
const unrelatedAwardRes = invokeDoPost('teacher_award_classroom_points', {
  studentNumbers: ['705'],
  categoryId: 'cat_great_improvement',
  idempotencyKey: 'batch_student705_004',
  note: 'Unrelated excellent performance',
});
assert(unrelatedAwardRes.success === true, 'Unrelated award to Student 705 succeeds');
const tx705 = unrelatedAwardRes.transactions[0];

// Verify balances before undo
assert(sandbox.getStudentClassroomPointsForYear(ss, '702', '2026-2027').positivePoints === 1, 'Student 702 has 1 point');
assert(sandbox.getStudentClassroomPointsForYear(ss, '703', '2026-2027').positivePoints === 1, 'Student 703 has 1 point');
assert(sandbox.getStudentClassroomPointsForYear(ss, '704', '2026-2027').positivePoints === 1, 'Student 704 has 1 point');
assert(sandbox.getStudentClassroomPointsForYear(ss, '705', '2026-2027').positivePoints === 3, 'Student 705 has 3 points');

// Execute Batch Undo on only the 3 batch transactions
const batchUndoRes = invokeDoPost('teacher_revert_classroom_point_transaction', {
  transactionIds: batchTxIds,
  reason: 'Smartboard Quick Undo',
});

assert(batchUndoRes.success === true, 'Batch Undo succeeds');
assert(batchUndoRes.reversedCount === 3, 'Batch Undo reversed exactly 3 transactions');
assert(batchUndoRes.reversedTransactionIds.length === 3, 'Reversed IDs list contains 3 items');

// Verify student balances after batch undo
assert(sandbox.getStudentClassroomPointsForYear(ss, '702', '2026-2027').positivePoints === 0, 'Student 702 balance safely restored to 0');
assert(sandbox.getStudentClassroomPointsForYear(ss, '703', '2026-2027').positivePoints === 0, 'Student 703 balance safely restored to 0');
assert(sandbox.getStudentClassroomPointsForYear(ss, '704', '2026-2027').positivePoints === 0, 'Student 704 balance safely restored to 0');

// CRITICAL ISOLATION CHECK: Student 705 must be completely untouched!
const bal705 = sandbox.getStudentClassroomPointsForYear(ss, '705', '2026-2027');
assert(bal705.positivePoints === 3, 'CRITICAL: Student 705 balance remains exactly 3 positive points (never touched by batch Undo)');
assert(bal705.netPoints === 3, 'Student 705 net points remains 3');

// ----------------------------------------------------------------------------
// Test 3: Duplicate Reversal & Correction Immutability
// ----------------------------------------------------------------------------
console.log('\n--- Test 3: Duplicate Reversal & Correction Immutability ---');

// Attempt duplicate reversal of Student 702 transaction
const dupRevertRes = invokeDoPost('teacher_revert_classroom_point_transaction', {
  transactionId: batchTxIds[0],
  reason: 'Duplicate reversal attempt',
});

assert(dupRevertRes.success === false, 'Duplicate reversal is rejected');
assert(dupRevertRes.code === 'ALREADY_REVERSED', 'Returns code ALREADY_REVERSED');

// Attempt duplicate batch reversal on already reversed batch
const dupBatchRevertRes = invokeDoPost('teacher_revert_classroom_point_transaction', {
  transactionIds: batchTxIds,
  reason: 'Duplicate batch reversal attempt',
});

assert(dupBatchRevertRes.success === false, 'Duplicate batch reversal is rejected');
assert(dupBatchRevertRes.code === 'ALREADY_REVERSED', 'Batch returns code ALREADY_REVERSED when all are already reversed');

// Locate a reversal correction row in sheet and attempt to reverse it
const txSheet = ss.getSheetByName('Class_PointTransactions');
const correctionRow = txSheet.rows.find((r) => r[9] === 'correction');
assert(correctionRow !== undefined, 'Correction row exists in transaction sheet');
const correctionTxId = correctionRow[0];

const revertCorrectionRes = invokeDoPost('teacher_revert_classroom_point_transaction', {
  transactionId: correctionTxId,
  reason: 'Attempting to reverse a correction',
});

assert(revertCorrectionRes.success === false, 'Reversing an administrative correction row is rejected');
assert(revertCorrectionRes.code === 'INVALID_OPERATION', 'Returns code INVALID_OPERATION');

// ----------------------------------------------------------------------------
// Test 4: Pure Append-Only Ledger Integrity
// ----------------------------------------------------------------------------
console.log('\n--- Test 4: Pure Append-Only Ledger Integrity ---');

// Verify that original rows were NEVER deleted or overwritten
const orig701Row = txSheet.rows.find((r) => r[0] === tx701.transactionId);
assert(orig701Row !== undefined, 'Original transaction row still exists in sheet');
assert(orig701Row[9] === 'positive', 'Original transaction category_type remains "positive"');
assert(Number(orig701Row[10]) === 2, 'Original gross points remains 2 (unmutated)');

const origCompRow = txSheet.rows.find((r) => r[13] === tx701.transactionId);
assert(origCompRow !== undefined, 'Compensating correction row found linked via original_tx_id');
assert(origCompRow[9] === 'correction', 'Compensating row category_type is "correction"');
assert(Number(origCompRow[10]) === -2, 'Compensating gross points is -2');
assert(Number(origCompRow[11]) === -2, 'Compensating positive points is -2');

// Student Accounts must never be modified
const s701Account = studentSheet.rows.find((r) => r[1] === '701');
assert(s701Account[9] === 150, 'Student 701 total_xp remains intact at 150');
assert(s701Account[10] === 50, 'Student 701 total_coins remains intact at 50');

// ----------------------------------------------------------------------------
// Test 5: Frontend UI & API Service Integration Contracts
// ----------------------------------------------------------------------------
console.log('\n--- Test 5: Frontend UI & API Service Integration Contracts ---');

const gridFilePath = path.join(__dirname, 'src', 'components', 'teacher', 'dashboard', 'classroom', 'ClassroomStudentGrid.tsx');
const gridCode = fs.readFileSync(gridFilePath, 'utf8');

assert(gridCode.includes('onViewStudentHistory'), 'ClassroomStudentGrid defines onViewStudentHistory prop');
assert(gridCode.includes('onViewStudentHistory(student.studentNumber)'), 'Points badge triggers onViewStudentHistory with studentNumber');
assert(gridCode.includes('e.stopPropagation()'), 'Points badge stops click propagation to prevent card selection toggle');

const historyFilePath = path.join(__dirname, 'src', 'components', 'teacher', 'dashboard', 'classroom', 'PointHistoryAuditView.tsx');
const historyCode = fs.readFileSync(historyFilePath, 'utf8');

assert(historyCode.includes('initialSearchTerm'), 'PointHistoryAuditView defines initialSearchTerm prop');
assert(historyCode.includes('setSearchTerm(initialSearchTerm)'), 'PointHistoryAuditView synchronizes search term from initialSearchTerm');
assert(historyCode.includes('Clear student filter') || historyCode.includes('Clear search'), 'PointHistoryAuditView provides student filter clear button');

const managerFilePath = path.join(__dirname, 'src', 'components', 'teacher', 'dashboard', 'classroom', 'ClassroomManagerView.tsx');
const managerCode = fs.readFileSync(managerFilePath, 'utf8');

assert(managerCode.includes('pendingUndo'), 'ClassroomManagerView manages pendingUndo state');
assert(managerCode.includes('secondsRemaining'), 'ClassroomManagerView manages 8-second countdown timer');
assert(managerCode.includes('handleUndoAward'), 'ClassroomManagerView implements handleUndoAward');
assert(managerCode.includes('handleViewStudentHistory'), 'ClassroomManagerView implements handleViewStudentHistory');
assert(managerCode.includes('initialSearchTerm={historySearchTerm}'), 'ClassroomManagerView passes historySearchTerm to PointHistoryAuditView');
assert(managerCode.includes('onViewStudentHistory={handleViewStudentHistory}'), 'ClassroomManagerView passes onViewStudentHistory to ClassroomStudentGrid');

const apiFilePath = path.join(__dirname, 'src', 'services', 'teacherApiService.ts');
const apiCode = fs.readFileSync(apiFilePath, 'utf8');

assert(apiCode.includes("action: 'teacher_revert_classroom_point_transaction'"), 'TeacherApiService dispatches consistent teacher_revert_classroom_point_transaction action');
assert(apiCode.includes('transactionIds: payload.transactionIds'), 'TeacherApiService supports batch transactionIds for Undo');

console.log('\n======================================================================');
console.log(`ALL CHECKS PASSED: ${passedChecks}/${totalChecks} verified successfully!`);
console.log('======================================================================\n');
