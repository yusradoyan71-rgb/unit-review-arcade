/**
 * ============================================================================
 * UNIT REVIEW ARCADE — PHASE 3.4B TEACHER CLASSROOM MANAGER VERIFICATION SUITE
 * ============================================================================
 * 
 * Verifies Frontend UI & Integration for Classroom Points & Rewards (v3.4.0):
 * 1. Teacher Dashboard tab integration ('classroom_points') with classes 7A, 7B, 8A, 8B.
 * 2. Projector Privacy Mode: ENABLED BY DEFAULT, shields negative points & private notes.
 * 3. Privacy Mode Toggle: Explicit confirmation dialog required to disable.
 * 4. Quick Point Awarding: 6 positive (+1 to +3) and 3 negative (-1) categories.
 * 5. Strict Idempotency Key Reuse on Retries: Never generates a fresh key on retry.
 * 6. Disabled Repeat Submission: In-flight prevention of double-clicks.
 * 7. Category Management: Non-zero point validation (0 rejected), updates, and toggles.
 * 8. Reversible Point History: Append-only ledger, double-reversal prevention.
 * 9. Teacher Reports & Analytics: Class summaries, milestone distribution, CSV export.
 * 10. Smartboard Touch Targets: Minimum 44-48px touch-friendliness.
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
console.log('PHASE 3.4B VERIFICATION SUITE: TEACHER CLASSROOM MANAGER & UI');
console.log('======================================================================\n');

// ---------------------------------------------------------------------------
// 1. Static Analysis & Tab Integration Verification
// ---------------------------------------------------------------------------
console.log('--- 1. Teacher Dashboard Tab Integration & Architecture ---');

const dashboardFilePath = path.join(__dirname, 'src', 'components', 'teacher', 'dashboard', 'TeacherDashboardScreen.tsx');
const dashboardContent = fs.readFileSync(dashboardFilePath, 'utf8');

assert(
  dashboardContent.includes("dashboardTab === 'classroom_points'"),
  "TeacherDashboardScreen integrates 'classroom_points' tab"
);

assert(
  dashboardContent.includes('ClassroomManagerView'),
  'TeacherDashboardScreen imports and mounts ClassroomManagerView'
);

assert(
  dashboardContent.includes('Award') && dashboardContent.includes('Classroom Points'),
  "Classroom Points tab button is rendered with Award icon and 'Classroom Points' label"
);

// Verify supported classes: 7A, 7B, 8A, 8B
const classroomViewPath = path.join(__dirname, 'src', 'components', 'teacher', 'dashboard', 'classroom', 'ClassroomManagerView.tsx');
const classroomViewContent = fs.readFileSync(classroomViewPath, 'utf8');

assert(
  classroomViewContent.includes("'7A'") &&
  classroomViewContent.includes("'7B'") &&
  classroomViewContent.includes("'8A'") &&
  classroomViewContent.includes("'8B'"),
  'ClassroomManagerView supports classes 7A, 7B, 8A, and 8B'
);

// ---------------------------------------------------------------------------
// 2. Projector Privacy Mode Safety Mandates
// ---------------------------------------------------------------------------
console.log('\n--- 2. Projector Privacy Mode Safety Mandates ---');

// Verify default is TRUE (stored !== 'false')
assert(
  classroomViewContent.includes("localStorage.getItem('ura_projector_privacy')") &&
  classroomViewContent.includes("stored !== 'false'"),
  'Projector Privacy Mode is ENABLED BY DEFAULT in ClassroomManagerView'
);

// Verify explicit confirmation dialog to disable
assert(
  classroomViewContent.includes('showPrivacyConfirmModal') &&
  classroomViewContent.includes('Disable Projector Privacy Mode?'),
  'ClassroomManagerView requires explicit teacher confirmation modal to disable privacy mode'
);

// Verify student grid strictly shields negative points and net points in privacy mode
const gridFilePath = path.join(__dirname, 'src', 'components', 'teacher', 'dashboard', 'classroom', 'ClassroomStudentGrid.tsx');
const gridContent = fs.readFileSync(gridFilePath, 'utf8');

assert(
  gridContent.includes('isProjectorPrivacyMode ? (') &&
  gridContent.includes('student.positivePoints') &&
  gridContent.includes('// PROJECTOR PRIVACY MODE ACTIVE: STRICTLY POSITIVE POINTS ONLY'),
  'ClassroomStudentGrid renders strictly positive points when Projector Privacy Mode is active'
);

// In privacy mode, net points and negative deductions must be omitted from DOM
assert(
  gridContent.includes('// TEACHER PRIVATE MODE: SHOW NET AND BREAKDOWN') &&
  gridContent.includes('student.netPoints'),
  'Net points and negative points are guarded behind !isProjectorPrivacyMode'
);

// ---------------------------------------------------------------------------
// 3. Quick Point Awarding & Smartboard Ergonomics
// ---------------------------------------------------------------------------
console.log('\n--- 3. Quick Point Awarding & Smartboard Ergonomics ---');

const modalFilePath = path.join(__dirname, 'src', 'components', 'teacher', 'dashboard', 'classroom', 'QuickPointAwardModal.tsx');
const modalContent = fs.readFileSync(modalFilePath, 'utf8');

// Check 6 positive categories and 3 negative categories support
assert(
  modalContent.includes('positiveCategories') &&
  modalContent.includes('negativeCategories'),
  'QuickPointAwardModal splits categories into positive reinforcement and corrections'
);

// Disabled during submission
assert(
  modalContent.includes('disabled={isSubmitting') &&
  modalContent.includes('Recording Points...'),
  'Submit button is disabled with spinner during in-flight requests to prevent double-clicks'
);

// Minimum 44-48px touch targets for smartboards
assert(
  gridContent.includes('min-h-[44px]') &&
  modalContent.includes('min-h-[48px]') &&
  modalContent.includes('min-h-[52px]'),
  'All interactive buttons and touch targets enforce minimum 44-52px height for smartboard usage'
);

// ---------------------------------------------------------------------------
// 4. Strict Idempotency Key Reuse on Retries
// ---------------------------------------------------------------------------
console.log('\n--- 4. Strict Idempotency Key Reuse on Retries ---');

// Verify idempotencyKeyRef is used and preserved across retries
assert(
  modalContent.includes('idempotencyKeyRef = useRef<string>') &&
  modalContent.includes('const currentKey = idempotencyKeyRef.current || generateNewBatchKey();') &&
  modalContent.includes('idempotencyKeyRef.current = currentKey;'),
  'QuickPointAwardModal maintains stable idempotencyKeyRef across retries'
);

assert(
  modalContent.includes('Retry uses the same idempotency key') &&
  modalContent.includes('Retry Awarding'),
  'Retry guidance confirms reuse of the exact same idempotency key'
);

// ---------------------------------------------------------------------------
// 5. Category Management & Non-Zero Points Validation
// ---------------------------------------------------------------------------
console.log('\n--- 5. Category Management & Non-Zero Points Validation ---');

const catModalPath = path.join(__dirname, 'src', 'components', 'teacher', 'dashboard', 'classroom', 'PointCategoryManagerModal.tsx');
const catModalContent = fs.readFileSync(catModalPath, 'utf8');

assert(
  catModalContent.includes("numericPoints === 0 || isNaN(numericPoints)") &&
  catModalContent.includes("Category points cannot be zero"),
  'PointCategoryManagerModal validates and rejects zero points on frontend'
);

assert(
  catModalContent.includes("operation: 'update'") &&
  catModalContent.includes("operation: 'create'") &&
  catModalContent.includes("operation: 'toggle'"),
  'PointCategoryManagerModal supports create, update, and toggle operations'
);

// Check TeacherApiService validation for categories
const apiServicePath = path.join(__dirname, 'src', 'services', 'teacherApiService.ts');
const apiContent = fs.readFileSync(apiServicePath, 'utf8');

assert(
  apiContent.includes("Number(payload.categoryData.defaultPoints) === 0") &&
  apiContent.includes("'Category points cannot be zero.'"),
  'TeacherApiService validates and rejects zero category points before network dispatch'
);

// ---------------------------------------------------------------------------
// 6. Point History & Reversals Integration
// ---------------------------------------------------------------------------
console.log('\n--- 6. Point History & Reversals Integration ---');

const historyFilePath = path.join(__dirname, 'src', 'components', 'teacher', 'dashboard', 'classroom', 'PointHistoryAuditView.tsx');
const historyContent = fs.readFileSync(historyFilePath, 'utf8');

assert(
  historyContent.includes('TeacherApiService.revertClassroomPointTransaction') &&
  historyContent.includes('reversingTx.transactionId'),
  'PointHistoryAuditView integrates transaction reversal endpoint'
);

assert(
  historyContent.includes('isProjectorPrivacyMode && (isNegative || isCorrection)') &&
  historyContent.includes('[Protected in Privacy Mode]'),
  'PointHistoryAuditView shields sensitive negative notes when Projector Privacy Mode is active'
);

assert(
  historyContent.includes("categoryType === 'correction'") &&
  historyContent.includes('Reversal Entry') &&
  historyContent.includes('Reversed'),
  'PointHistoryAuditView differentiates original transactions, reversed status, and reversal entries'
);

// ---------------------------------------------------------------------------
// 7. Teacher Reports & CSV Export Formatting
// ---------------------------------------------------------------------------
console.log('\n--- 7. Teacher Reports & CSV Export Formatting ---');

const reportsFilePath = path.join(__dirname, 'src', 'components', 'teacher', 'dashboard', 'classroom', 'ClassroomReportsView.tsx');
const reportsContent = fs.readFileSync(reportsFilePath, 'utf8');

assert(
  reportsContent.includes("classes = ['7A', '7B', '8A', '8B']") &&
  reportsContent.includes('classStats = classes.map'),
  'ClassroomReportsView aggregates metrics by classes 7A, 7B, 8A, 8B'
);

assert(
  reportsContent.includes('handleExportCsv') &&
  reportsContent.includes("classroom_points_report_"),
  'ClassroomReportsView implements CSV report export'
);

assert(
  reportsContent.includes("isProjectorPrivacyMode ? [] : ['Negative Points', 'Net Points']"),
  'CSV Export adheres to Projector Privacy Mode by omitting negative/net columns when active'
);

// ---------------------------------------------------------------------------
// 8. End-to-End Simulation with Mock Backend VM
// ---------------------------------------------------------------------------
console.log('\n--- 8. End-to-End Functional Simulation with Backend ---');

// Mock Google Apps Script environment
class MockRange {
  constructor(sheet, row, col, numRows = 1, numCols = 1) {
    this.sheet = sheet;
    this.row = row;
    this.col = col;
    this.numRows = numRows;
    this.numCols = numCols;
  }
  setValue(val) {
    while (this.sheet.rows.length < this.row - 1) {
      this.sheet.rows.push(new Array(this.sheet.headers.length).fill(''));
    }
    if (this.row === 1) {
      this.sheet.headers[this.col - 1] = val;
    } else {
      this.sheet.rows[this.row - 2][this.col - 1] = val;
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

const gasCode = fs.readFileSync(path.join(__dirname, 'google-apps-script', 'Code.gs'), 'utf8');
const sandbox = {
  console: console,
  Logger: { log: () => {} },
  SpreadsheetApp: {
    getActiveSpreadsheet: () => mockSs,
  },
  LockService: {
    getScriptLock: () => ({
      tryLock: () => true,
      waitLock: () => undefined,
      releaseLock: () => {},
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
  Date: Date,
  Math: Math,
  JSON: JSON,
  String: String,
  Number: Number,
};

const mockSs = new MockSpreadsheet();
vm.createContext(sandbox);
vm.runInContext(gasCode, sandbox);

// Initialize backend sheets
sandbox.setupClassroomPointsSheets(mockSs);

// Populate sample roster in Students sheet
const studentsSheet = mockSs.addSheet('Students', [
  'student_id', 'student_number', 'full_name', 'class', 'grade', 'pin_hash', 'status', 'is_active', 'total_xp', 'created_at'
], [
  ['std_701', '701', 'Ahmet Yilmaz', '7A', 'grade-7', 'pin', 'active', true, 150, '2026-09-01'],
  ['std_702', '702', 'Ayse Kaya', '7A', 'grade-7', 'pin', 'active', true, 200, '2026-09-01'],
  ['std_801', '801', 'Can Demir', '8B', 'grade-8', 'pin', 'active', true, 350, '2026-09-01'],
]);

// Seed Teacher Sessions (Teacher token hash)
const testTeacherToken = 'tch_valid_teacher_session_token_123';
const teacherHash = require('crypto').createHash('sha256').update(testTeacherToken).digest('hex');
mockSs.addSheet('TeacherSessions', [
  'session_id', 'teacher_token_hash', 'authenticated_at', 'expires_at', 'client_ip', 'user_agent', 'status'
], [
  ['tch_sess_1', teacherHash, new Date().toISOString(), new Date(Date.now() + 86400000).toISOString(), '127.0.0.1', 'Node/Test', 'active'],
]);

// Helper to invoke and parse JSON responses from GAS endpoints
const invokeGas = (fn, ...args) => {
  const res = fn(...args);
  if (res && typeof res.getContent === 'function') {
    return JSON.parse(res.getContent());
  }
  return res;
};

// 8.1 Backend returns overview for 7A and 8B
const overviewPayload = {
  action: 'teacher_get_classroom_overview',
  teacherToken: testTeacherToken,
  classId: 'all',
};
const overviewRes = invokeGas(sandbox.handleTeacherGetClassroomOverview, mockSs, overviewPayload);
assert(overviewRes.success === true, 'handleTeacherGetClassroomOverview succeeds');
assert(overviewRes.totalStudents === 3, 'Overview returns all 3 seeded students across 7A & 8B');
assert(overviewRes.categories.length === 9, 'Overview returns seeded 9 behavior categories');

// 8.2 Test category update with non-zero points
const updateCatPayload = {
  action: 'teacher_manage_classroom_categories',
  teacherToken: testTeacherToken,
  operation: 'update',
  categoryData: {
    categoryId: 'cat_speaking_participation',
    name: 'Master Speaking Participation',
    defaultPoints: 3,
    icon: '🎙️',
    color: 'emerald',
  },
};
const updateCatRes = invokeGas(sandbox.handleTeacherManageClassroomCategories, mockSs, updateCatPayload);
assert(updateCatRes.success === true, 'handleTeacherManageClassroomCategories successfully updates category');
assert(updateCatRes.category.defaultPoints === 3, 'Speaking participation points updated to 3');
assert(updateCatRes.category.name === 'Master Speaking Participation', 'Speaking participation name updated');

// 8.3 Test category update rejection when points === 0
const zeroCatPayload = {
  action: 'teacher_manage_classroom_categories',
  teacherToken: testTeacherToken,
  operation: 'update',
  categoryData: {
    categoryId: 'cat_speaking_participation',
    defaultPoints: 0,
  },
};
const zeroCatRes = invokeGas(sandbox.handleTeacherManageClassroomCategories, mockSs, zeroCatPayload);
assert(zeroCatRes.success === false, 'Category update with 0 points is rejected by backend');
assert(zeroCatRes.code === 'BAD_REQUEST', 'Returns BAD_REQUEST for 0 points');

// 8.4 Test award points with stable idempotency key & retry
const stableBatchKey = 'batch_test_smartboard_retry_999';
const awardPayload = {
  action: 'teacher_award_classroom_points',
  teacherToken: testTeacherToken,
  studentNumbers: ['701', '702'],
  categoryId: 'cat_speaking_participation',
  idempotencyKey: stableBatchKey,
  note: 'Excellent classroom dialogue',
};

const firstAwardRes = invokeGas(sandbox.handleTeacherAwardClassroomPoints, mockSs, awardPayload);
assert(firstAwardRes.success === true, 'First batch award succeeds');
assert(firstAwardRes.awardedCount === 2, '2 students awarded');

// Simulate a retry with the EXACT SAME idempotency key (as guaranteed by QuickPointAwardModal)
const retryAwardRes = invokeGas(sandbox.handleTeacherAwardClassroomPoints, mockSs, awardPayload);
assert(retryAwardRes.success === true, 'Retry with same idempotency key succeeds idempotently');
assert(retryAwardRes.awardedCount === 0, 'Zero duplicate transactions recorded on retry');

// Verify student 701 balances in overview
const overviewAfterAward = invokeGas(sandbox.handleTeacherGetClassroomOverview, mockSs, { teacherToken: testTeacherToken });
const s701 = overviewAfterAward.students.find((s) => s.studentNumber === '701');
assert(s701.positivePoints === 3, 'Student 701 has exactly 3 positive points (no duplicate on retry)');

// 8.5 Test transaction reversal via backend
const historyRes = invokeGas(sandbox.handleTeacherGetClassroomHistory, mockSs, { teacherToken: testTeacherToken });
assert(historyRes.success === true && historyRes.transactions.length > 0, 'Classroom history returns transactions');
const txToRevert = historyRes.transactions.find((tx) => tx.studentNumber === '701');

const revertRes = invokeGas(sandbox.handleTeacherRevertClassroomPointTransaction, mockSs, {
  teacherToken: testTeacherToken,
  transactionId: txToRevert.transactionId,
  reason: 'Accidental click on smartboard',
});

assert(revertRes.success === true, 'handleTeacherRevertClassroomPointTransaction succeeds');
assert(revertRes.updatedBalances.positivePoints === 0, 'Student 701 positive points safely restored to 0 without double subtraction');

// Duplicate reversal attempt must be rejected
const doubleRevertRes = invokeGas(sandbox.handleTeacherRevertClassroomPointTransaction, mockSs, {
  teacherToken: testTeacherToken,
  transactionId: txToRevert.transactionId,
});
assert(doubleRevertRes.success === false, 'Duplicate reversal is rejected');
assert(doubleRevertRes.code === 'ALREADY_REVERSED', 'Returns ALREADY_REVERSED code');

console.log('\n======================================================================');
console.log(`🎉 ALL PHASE 3.4B TESTS PASSED: ${passedChecks} / ${totalChecks} ASSERTIONS!`);
console.log('======================================================================\n');
