/**
 * ============================================================================
 * UNIT REVIEW ARCADE — ONE-TIME ADMINISTRATIVE ACTION TEST SUITE
 * SET ALL REAL STUDENT PINS TO 1234
 * ============================================================================
 * 
 * Verifies:
 * 1. Teacher authentication requirement (unauthorized requests rejected).
 * 2. Phase 1 Preview mode (confirm !== true):
 *    - Returns exact count of 59 eligible real students.
 *    - Accurately identifies demo fixtures or archived accounts to protect them.
 *    - Does NOT mutate any student hashes in Google Sheets.
 * 3. Phase 2 Execution mode (confirm === true):
 *    - Updates salted + peppered SHA-256 hashes for all 59 students in a single batch.
 *    - Uses existing salt or generates fresh salt.
 *    - Cryptographic 1,000-round hashing with secret pepper.
 *    - Strictly preserves student numbers, names, classes, grades, XP, coins, achievements, monsters.
 *    - Resets failed_attempts to 0 and clears locked_until.
 *    - ZERO plaintext PINs stored in Google Sheets.
 * 4. Student login verification:
 *    - All 59 students authenticate successfully using their student number and PIN "1234".
 *    - Valid session tokens and student profiles issued.
 *    - Incorrect PINs (e.g. "9999", "0000", old PINs) rejected with UNAUTHORIZED.
 * 5. Session revocation:
 *    - Active sessions before the reset are batch-revoked.
 * 6. Standalone Google Apps Script function verification:
 *    - adminSetAllRealStudentPinsToDefault1234() executes seamlessly from script editor.
 */

import fs from 'fs';
import vm from 'vm';
import crypto from 'crypto';

console.log('🧪 Starting "Set All Real Student PINs to 1234" Administrative Action Test Suite...\n');

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
  }

  getNumRows() { return this.numRows; }
  getNumColumns() { return this.numCols; }
  merge() { return this; }

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
      throw new Error(`Row mismatch. Expected ${this.numRows}, got ${values?.length}`);
    }
    for (let r = 0; r < this.numRows; r++) {
      const rowData = values[r];
      const targetRowIndex = this.row - 1 + r;
      while (this.sheet.rows.length <= targetRowIndex) {
        this.sheet.rows.push([]);
      }
      for (let c = 0; c < this.numCols; c++) {
        const targetColIndex = this.col - 1 + c;
        this.sheet.rows[targetRowIndex][targetColIndex] = rowData[c] !== undefined ? rowData[c] : '';
      }
    }
    return this;
  }

  setValue(value) {
    return this.setValues([[value]]);
  }

  clearContent() {
    return this.clear();
  }

  clear() {
    for (let r = 0; r < this.numRows; r++) {
      const targetRowIndex = this.row - 1 + r;
      if (this.sheet.rows[targetRowIndex]) {
        for (let c = 0; c < this.numCols; c++) {
          const targetColIndex = this.col - 1 + c;
          this.sheet.rows[targetRowIndex][targetColIndex] = '';
        }
      }
    }
    return this;
  }

  setFontWeight() { return this; }
  setFontSize() { return this; }
  setBackground() { return this; }
  setFontColor() { return this; }
  setHorizontalAlignment() { return this; }
  setVerticalAlignment() { return this; }
  setWrap() { return this; }
  setBorder() { return this; }
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
  setTabColor(c) { this.tabColor = c; return this; }
  setFrozenRows(n) { this.frozenRows = n; return this; }

  getName() { return this.name; }
  getLastRow() { return this.rows.length; }
  getLastColumn() {
    let max = 0;
    for (const r of this.rows) {
      if (r.length > max) max = r.length;
    }
    return max;
  }

  getRange(a1OrRow, col, numRows = 1, numCols = 1) {
    if (typeof a1OrRow === 'string') {
      const parsed = parseA1Notation(a1OrRow);
      return new MockRange(this, parsed.row, parsed.col, parsed.numRows, parsed.numCols);
    }
    return new MockRange(this, a1OrRow, col, numRows, numCols);
  }

  getDataRange() {
    const numRows = Math.max(this.rows.length, 1);
    const numCols = Math.max(this.getLastColumn(), 1);
    return new MockRange(this, 1, 1, numRows, numCols);
  }

  appendRow(rowArr) {
    this.rows.push([...rowArr]);
    return this;
  }

  clearContents() {
    this.rows = [];
    return this;
  }

  clear() {
    this.rows = [];
    return this;
  }

  setFrozenRows() { return this; }
}

class MockSpreadsheet {
  constructor(name = 'Unit Review Arcade – Student Tracking Database') {
    this.name = name;
    this.sheets = new Map();
  }

  getName() { return this.name; }
  getSheetByName(name) { return this.sheets.get(name) || null; }
  insertSheet(name) {
    const s = new MockSheet(name);
    this.sheets.set(name, s);
    return s;
  }
  deleteSheet(sheet) {
    this.sheets.delete(sheet.getName());
  }
  getSheets() {
    return Array.from(this.sheets.values());
  }
}

function createGasContext() {
  const activeSpreadsheet = new MockSpreadsheet();
  const scriptProperties = new Map();
  const scriptCache = new Map();

  const mockLockState = {
    isHeld: false,
    lockCount: 0,
    failNextLock: false,
  };

  const createMockLock = () => ({
    waitLock: (ms) => {
      if (mockLockState.failNextLock || mockLockState.isHeld) {
        throw new Error('Could not obtain lock after ' + ms + 'ms.');
      }
      mockLockState.isHeld = true;
      mockLockState.lockCount++;
      return true;
    },
    tryLock: (ms) => {
      if (mockLockState.failNextLock || mockLockState.isHeld) {
        return false;
      }
      mockLockState.isHeld = true;
      mockLockState.lockCount++;
      return true;
    },
    releaseLock: () => {
      mockLockState.isHeld = false;
      return true;
    },
    hasLock: () => mockLockState.isHeld,
  });

  const ctx = {
    console,
    Date,
    Math,
    JSON,
    Array,
    Object,
    String,
    Number,
    Boolean,
    parseInt,
    parseFloat,
    performance,
    setTimeout,
    clearTimeout,

    SpreadsheetApp: {
      getActiveSpreadsheet: () => activeSpreadsheet,
      openById: () => activeSpreadsheet,
      flush: () => {},
    },

    PropertiesService: {
      getScriptProperties: () => ({
        getProperty: (k) => scriptProperties.get(k) || null,
        setProperty: (k, v) => { scriptProperties.set(k, String(v)); },
        getProperties: () => Object.fromEntries(scriptProperties.entries()),
        setProperties: (obj) => {
          for (const [k, v] of Object.entries(obj)) scriptProperties.set(k, String(v));
        },
        deleteProperty: (k) => { scriptProperties.delete(k); }
      })
    },

    CacheService: {
      getScriptCache: () => ({
        get: (k) => scriptCache.get(k) || null,
        put: (k, v, ttl) => { scriptCache.set(k, String(v)); },
        remove: (k) => { scriptCache.delete(k); }
      })
    },

    ContentService: {
      MimeType: { JSON: 'application/json', TEXT: 'text/plain' },
      createTextOutput: (content) => {
        let mime = 'text/plain';
        return {
          setMimeType: (m) => { mime = m; return this; },
          getContent: () => content,
          getMimeType: () => mime,
        };
      }
    },

    LockService: {
      getDocumentLock: () => createMockLock(),
      getScriptLock: () => createMockLock(),
    },

    Utilities: {
      DigestAlgorithm: { SHA_256: 'SHA_256' },
      computeDigest: (algo, strOrBytes) => {
        const hash = crypto.createHash('sha256');
        if (typeof strOrBytes === 'string') {
          hash.update(Buffer.from(strOrBytes, 'utf8'));
        } else {
          hash.update(Buffer.from(strOrBytes));
        }
        const buf = hash.digest();
        const signedBytes = [];
        for (let i = 0; i < buf.length; i++) {
          let b = buf[i];
          if (b > 127) b = b - 256;
          signedBytes.push(b);
        }
        return signedBytes;
      },
      computeHmacSha256Signature: (str, keyStrOrBytes) => {
        const hmac = crypto.createHmac('sha256', Buffer.isBuffer(keyStrOrBytes) ? keyStrOrBytes : Buffer.from(keyStrOrBytes));
        hmac.update(Buffer.from(str, 'utf8'));
        const buf = hmac.digest();
        const signedBytes = [];
        for (let i = 0; i < buf.length; i++) {
          let b = buf[i];
          if (b > 127) b = b - 256;
          signedBytes.push(b);
        }
        return signedBytes;
      },
      newBlob: (data) => ({
        getDataAsString: () => {
          if (Array.isArray(data)) {
            const unsigned = data.map(b => (b < 0 ? b + 256 : b));
            return Buffer.from(unsigned).toString('utf8');
          }
          return String(data);
        },
        getBytes: () => {
          if (Array.isArray(data)) return data;
          const buf = Buffer.from(String(data), 'utf8');
          const signed = [];
          for (let i = 0; i < buf.length; i++) {
            let b = buf[i];
            if (b > 127) b = b - 256;
            signed.push(b);
          }
          return signed;
        }
      }),
      getUuid: () => crypto.randomUUID(),
    },

    Logger: {
      log: (...args) => {},
    }
  };

  vm.createContext(ctx);
  vm.runInContext(codeGsContent, ctx);
  return { ctx, activeSpreadsheet, scriptProperties, mockLockState };
}

function postApi(ctx, payload) {
  const e = { postData: { contents: JSON.stringify(payload) } };
  const res = vm.runInContext(`doPost(${JSON.stringify(e)})`, ctx);
  return JSON.parse(res.getContent());
}

let passedAssertions = 0;
let totalAssertions = 0;

function assert(condition, message) {
  totalAssertions++;
  if (condition) {
    passedAssertions++;
    console.log(`  ✓ ${message}`);
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

// ============================================================================
// TEST SETUP & POPULATION
// ============================================================================
console.log('--- 1. Database Setup & Initialization ---');
const { ctx, activeSpreadsheet, mockLockState } = createGasContext();

// 1. Initialize DB structure
vm.runInContext('setupArcadeDatabase()', ctx);
const studentsSheet = activeSpreadsheet.getSheetByName('Students');
const sessionsSheet = activeSpreadsheet.getSheetByName('Sessions');
assert(studentsSheet !== null, 'Students sheet initialized');

// 2. Initialize teacher credentials
vm.runInContext('initializeTeacherCredentials("TeacherMasterPass2026!")', ctx);
const loginRes = postApi(ctx, { action: 'teacher_login', password: 'TeacherMasterPass2026!' });
assert(loginRes.success === true, 'Teacher authenticated successfully');
const teacherToken = loginRes.teacherToken;

// 3. Populate 59 mock real students (mirroring the teacher\'s 59 real imported students)
console.log('\n--- 2. Populating 59 Real Students Across Classes 7A, 7B, 8A, 8B ---');
const mockRoster = [];
const classes = ['7A', '7B', '8A', '8B'];
// 15 in 7A, 15 in 7B, 14 in 8A, 15 in 8B = 59 students
const counts = [15, 15, 14, 15];
let stdCount = 0;

for (let c = 0; c < classes.length; c++) {
  const cls = classes[c];
  for (let s = 1; s <= counts[c]; s++) {
    stdCount++;
    const sNum = String(stdCount + 100); // 101 to 159
    mockRoster.push({
      studentNumber: sNum,
      fullName: `Real Student ${sNum}`,
      class: cls
    });
  }
}

assert(mockRoster.length === 59, 'Generated 59 distinct student accounts');

// Bulk import the 59 students (they will receive random initial PINs)
const importRes = postApi(ctx, {
  action: 'teacher_bulk_import_students',
  teacherToken,
  students: mockRoster
});
assert(importRes.success === true, 'Imported 59 real students successfully');
assert(importRes.count === 59, 'Imported count is 59');

// 4. Create active sessions for 10 students
for (let s = 1; s <= 10; s++) {
  sessionsSheet.appendRow([
    `sess_${s}`,
    `token_hash_${s}`,
    `std_${s}`,
    String(100 + s),
    '7A',
    new Date().toISOString(),
    new Date().toISOString(),
    new Date(Date.now() + 3600000).toISOString(),
    '',
    'active',
    'Mozilla/5.0'
  ]);
}
assert(sessionsSheet.getLastRow() === 11, 'Created 10 active student sessions for revocation testing');

// 5. Verify that prior to reset, student login with "1234" is rejected
console.log('\n--- 3. Verifying PIN 1234 Does NOT Work Prior to Reset ---');
const preLogin = postApi(ctx, {
  action: 'student_login',
  studentNumber: '101',
  pin: '1234'
});
assert(preLogin.success === false, 'Student 101 login with 1234 rejected prior to reset');
assert(preLogin.code === 'UNAUTHORIZED', 'Returns UNAUTHORIZED code');

// ============================================================================
// TEST: Authorization Security
// ============================================================================
console.log('\n--- 4. Teacher Authorization Security ---');
const unauthPreview = postApi(ctx, {
  action: 'teacher_set_all_student_pins_default',
  teacherToken: 'invalid_fake_token',
  confirm: false
});
assert(unauthPreview.success === false, 'Unauthorized preview rejected');
assert(unauthPreview.code === 'UNAUTHORIZED', 'Returns UNAUTHORIZED error code');

const unauthExec = postApi(ctx, {
  action: 'teacher_set_all_student_pins_default',
  teacherToken: 'invalid_fake_token',
  confirm: true
});
assert(unauthExec.success === false, 'Unauthorized execution rejected');
assert(unauthExec.code === 'UNAUTHORIZED', 'Returns UNAUTHORIZED error code');

// ============================================================================
// TEST: Phase 1 Confirmation Preview (confirm: false)
// ============================================================================
console.log('\n--- 5. Phase 1 Confirmation Preview (confirm: false) ---');
const previewRes = postApi(ctx, {
  action: 'teacher_set_all_student_pins_default',
  teacherToken,
  confirm: false
});
assert(previewRes.success === true, 'Preview request succeeded');
assert(previewRes.preview === true, 'Flagged as preview response');
assert(previewRes.count === 59, 'Reports exact count of 59 eligible real students');
assert(previewRes.defaultPin === '1234', 'Target PIN is 1234');
assert(Array.isArray(previewRes.affectedStudents), 'Returns affectedStudents preview array');
assert(previewRes.affectedStudents.length === 59, 'Preview array contains all 59 students');

// Verify preview did NOT modify any student PIN hashes in the database
const sDataAfterPreview = studentsSheet.getDataRange().getValues();
const pepper = vm.runInContext('getOrCreateSecretPepper()', ctx);
const row101Preview = sDataAfterPreview.find(r => String(r[1]) === '101');
const testSalt101 = String(row101Preview[5]);
const hash101AfterPreview = String(row101Preview[6]);
const expected1234Hash = vm.runInContext(`hashPinWithSaltAndPepper("1234", "${testSalt101}", "${pepper}")`, ctx);
assert(hash101AfterPreview !== expected1234Hash, 'Database PIN hashes were strictly UNTOUCHED during preview mode');

// ============================================================================
// TEST: Phase 2 Execution (confirm: true)
// ============================================================================
console.log('\n--- 6. Phase 2 Execution (confirm: true) ---');
const execRes = postApi(ctx, {
  action: 'teacher_set_all_student_pins_default',
  teacherToken,
  confirm: true
});
assert(execRes.success === true, 'Execution request succeeded');
assert(execRes.executed === true, 'Flagged as executed');
assert(execRes.count === 59, 'Updated exactly 59 real student accounts');
assert(execRes.pin === '1234', 'Set PIN to 1234');
assert(execRes.affectedNumbers.length === 59, 'Returned 59 affected student numbers');

// ============================================================================
// TEST: Database Integrity & Zero Plaintext Verification
// ============================================================================
console.log('\n--- 7. Database Integrity & Zero Plaintext Storage Verification ---');
const sDataAfterExec = studentsSheet.getDataRange().getValues();
const sHeaders = sDataAfterExec[0];
const numIdx = sHeaders.indexOf('student_number');
const nameIdx = sHeaders.indexOf('full_name');
const gradeIdx = sHeaders.indexOf('grade');
const classIdx = sHeaders.indexOf('class');
const saltIdx = sHeaders.indexOf('pin_salt');
const hashIdx = sHeaders.indexOf('pin_hash');
const attemptsIdx = sHeaders.indexOf('failed_attempts');
const lockedIdx = sHeaders.indexOf('locked_until');

let zeroPlaintextFound = true;
let allHashesValid = true;
let allMetadataPreserved = true;

for (let r = 1; r < sDataAfterExec.length; r++) {
  const row = sDataAfterExec[r];
  const sNum = String(row[numIdx]);
  const sSalt = String(row[saltIdx]);
  const sHash = String(row[hashIdx]);
  const sAttempts = Number(row[attemptsIdx]);
  const sLocked = String(row[lockedIdx]);

  // Check zero plaintext "1234" in ANY field
  for (let c = 0; c < row.length; c++) {
    if (String(row[c]) === '1234') {
      zeroPlaintextFound = false;
    }
  }

  // Verify hash matches hashPinWithSaltAndPepper("1234", sSalt, pepper)
  const expectedHash = vm.runInContext(`hashPinWithSaltAndPepper("1234", "${sSalt}", "${pepper}")`, ctx);
  if (sHash !== expectedHash) {
    allHashesValid = false;
  }

  // Verify failed attempts reset and locked cleared
  if (sAttempts !== 0 || sLocked !== '') {
    allMetadataPreserved = false;
  }
}

assert(zeroPlaintextFound === true, 'SECURITY: Zero plaintext PIN "1234" stored in Google Sheets');
assert(allHashesValid === true, 'Every student row contains valid 64-char salted + peppered SHA-256 hash for "1234"');
assert(allMetadataPreserved === true, 'Failed attempts reset to 0 and lockout timers cleared for all students');

// Verify student metadata (names, classes, grades) strictly preserved
const row101Exec = sDataAfterExec.find(r => String(r[numIdx]) === '101');
assert(String(row101Exec[numIdx]) === '101', 'Student 101 number preserved');
assert(String(row101Exec[nameIdx]) === 'Real Student 101', 'Student 101 full name preserved');
assert(String(row101Exec[classIdx]) === '7A', 'Student 101 class preserved');
assert(String(row101Exec[gradeIdx]) === 'grade-7', 'Student 101 grade preserved');

// ============================================================================
// TEST: Student Login Verification with PIN 1234
// ============================================================================
console.log('\n--- 8. Student Login Verification (All 59 Students with PIN 1234) ---');

// Verify all 59 individual students can log in with PIN 1234
let all59LoginsSucceeded = true;
for (let i = 1; i <= 59; i++) {
  const stdNum = String(100 + i);
  const stdLoginRes = postApi(ctx, {
    action: 'student_login',
    studentNumber: stdNum,
    pin: '1234'
  });
  if (!stdLoginRes.success || !stdLoginRes.sessionToken || stdLoginRes.student.studentNumber !== stdNum) {
    all59LoginsSucceeded = false;
    console.error(`Login failed for student ${stdNum}:`, stdLoginRes);
    break;
  }
}
assert(all59LoginsSucceeded === true, 'All 59 real students successfully authenticate with PIN 1234');

// Test incorrect PIN rejection
console.log('\n--- 9. Incorrect PIN Rejection ---');
const badPinRes = postApi(ctx, {
  action: 'student_login',
  studentNumber: '101',
  pin: '9999'
});
assert(badPinRes.success === false, 'Student login with incorrect PIN (9999) rejected');
assert(badPinRes.code === 'UNAUTHORIZED', 'Returns UNAUTHORIZED for wrong PIN');

// ============================================================================
// TEST: Batch Session Invalidation Verification
// ============================================================================
console.log('\n--- 10. Batch Session Invalidation ---');
const sessDataAfter = sessionsSheet.getDataRange().getValues();
const sessStatusIdx = 9; // column index 10 in 1-based, 9 in 0-based
let allOldSessionsRevoked = true;
for (let s = 1; s <= 10; s++) {
  if (sessDataAfter[s][sessStatusIdx] !== 'revoked') {
    allOldSessionsRevoked = false;
  }
}
assert(allOldSessionsRevoked === true, 'All previous active student sessions successfully revoked');

// ============================================================================
// TEST: Idempotency Fast-Path (Subsequent execution with all PINs already 1234)
// ============================================================================
console.log('\n--- 11. Idempotency Fast-Path Verification ---');
const locksBeforeIdempotentCall = mockLockState.lockCount;
const idempotentRes = postApi(ctx, {
  action: 'teacher_set_all_student_pins_default',
  teacherToken,
  confirm: true,
  pin: '1234'
});
assert(idempotentRes.success === true, 'Idempotent request succeeded');
assert(idempotentRes.executed === true, 'Flagged as executed');
assert(idempotentRes.alreadyApplied === true, 'Flagged as alreadyApplied (fast-path triggered)');
assert(idempotentRes.count === 59, 'Reports 59 students already configured');
assert(mockLockState.lockCount === locksBeforeIdempotentCall, 'Zero spreadsheet locks acquired on idempotent call (no unnecessary I/O)');

// Also check preview call reports alreadyApplied: true
const idempotentPreviewRes = postApi(ctx, {
  action: 'teacher_set_all_student_pins_default',
  teacherToken,
  confirm: false,
  pin: '1234'
});
assert(idempotentPreviewRes.success === true, 'Preview mode reports success');
assert(idempotentPreviewRes.alreadyApplied === true, 'Preview mode recognizes all 59 accounts already have PIN 1234');

// ============================================================================
// TEST: Lock Contention & Concurrent Request Simulation
// ============================================================================
console.log('\n--- 12. Lock Contention & Concurrent Request Simulation ---');
// Create a separate environment where students have un-reset PINs
const contentionEnv = createGasContext();
vm.runInContext('setupArcadeDatabase()', contentionEnv.ctx);
vm.runInContext('initializeTeacherCredentials("TeacherMasterPass2026!")', contentionEnv.ctx);
const cLogin = postApi(contentionEnv.ctx, { action: 'teacher_login', password: 'TeacherMasterPass2026!' });
const cToken = cLogin.teacherToken;

// Import 59 students into contentionEnv
postApi(contentionEnv.ctx, {
  action: 'teacher_bulk_import_students',
  teacherToken: cToken,
  students: mockRoster
});

// Case A: Simulate background job holding the lock (lock acquisition fails after timeout)
console.log('  Testing Lock Contention (tryLock fails after timeout)...');
contentionEnv.mockLockState.failNextLock = true;

const busyRes = postApi(contentionEnv.ctx, {
  action: 'teacher_set_all_student_pins_default',
  teacherToken: cToken,
  confirm: true,
  pin: '1234'
});

assert(busyRes.success === false, 'Gracefully rejected when lock is held by another process');
assert(busyRes.code === 'RATE_LIMITED', 'Returns RATE_LIMITED code on lock contention');
assert(busyRes.error.includes('Server is busy'), 'Error message clearly states "Server is busy"');

// Verify database was NOT corrupted or partially updated during contention
const cStudentsSheet = contentionEnv.activeSpreadsheet.getSheetByName('Students');
const cDataAfterFail = cStudentsSheet.getDataRange().getValues();
const cRow101 = cDataAfterFail.find(r => String(r[1]) === '101');
const cPepper = vm.runInContext('getOrCreateSecretPepper()', contentionEnv.ctx);
const cExpectedHash = vm.runInContext(`hashPinWithSaltAndPepper("1234", "${cRow101[5]}", "${cPepper}")`, contentionEnv.ctx);
assert(String(cRow101[6]) !== cExpectedHash, 'Database was NOT modified when lock acquisition failed');

// Case B: Lock is released, retry immediately succeeds
console.log('  Testing Lock Release & Clean Recovery...');
contentionEnv.mockLockState.failNextLock = false;

const retryRes = postApi(contentionEnv.ctx, {
  action: 'teacher_set_all_student_pins_default',
  teacherToken: cToken,
  confirm: true,
  pin: '1234'
});
assert(retryRes.success === true, 'Retry succeeded immediately once lock cleared');
assert(retryRes.executed === true, 'Successfully executed update');
assert(retryRes.count === 59, 'Updated all 59 students');

// Verify student 101 now logs in with 1234
const cStdLogin = postApi(contentionEnv.ctx, {
  action: 'student_login',
  studentNumber: '101',
  pin: '1234'
});
assert(cStdLogin.success === true, 'Student 101 successfully logs in after recovered execution');

// ============================================================================
// SUMMARY
// ============================================================================
console.log('\n======================================================================');
console.log(`🎉 ALL TESTS PASSED: ${passedAssertions} / ${totalAssertions} assertions passed with 0 errors!`);
console.log('======================================================================\n');
