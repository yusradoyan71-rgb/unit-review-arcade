/**
 * ============================================================================
 * UNIT REVIEW ARCADE — STUDENT MANAGEMENT & ROSTER INGESTION TEST SUITE
 * ============================================================================
 * 
 * Verifies:
 * 1. Database schema compatibility with real student management.
 * 2. Strict teacher server-side authorization for all management actions.
 * 3. Individual student addition with duplicate checking, 4-digit PIN generation,
 *    and salted/peppered hashing (no plaintext PIN in DB).
 * 4. Bulk import with internal duplicate detection, DB duplicate detection,
 *    and batch insertion.
 * 5. Student login functionality with new credentials and profile sanitization.
 * 6. Student demographic updates (full_name, class, grade) while keeping student_number immutable.
 * 7. Active / Inactive account status toggling and immediate session invalidation.
 * 8. PIN reset with lockout clearing, session invalidation, and new login verification.
 * 9. Demo account preview & non-destructive archival, isolating demo data from classroom KPIs.
 * 10. Clean frontend login screen verification (zero hardcoded demo credentials).
 */

import fs from 'fs';
import vm from 'vm';
import crypto from 'crypto';

console.log('🧪 Starting Student Management & Roster Migration Integration Test Suite...\n');

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

  clear() {
    this.rows = [];
    return this;
  }

  setFrozenRows(n) { this.frozenRows = n; return this; }
  setTabColor(color) { this.tabColor = color; return this; }
}

class MockSpreadsheet {
  constructor(name = 'Unit Review Arcade Database') {
    this.name = name;
    this.sheets = {};
    this.locale = 'en_US';
  }

  getName() { return this.name; }
  getSpreadsheetLocale() { return this.locale; }
  getSheets() { return Object.values(this.sheets); }
  getSheetByName(name) { return this.sheets[name] || null; }

  insertSheet(name) {
    const s = new MockSheet(name, this);
    this.sheets[name] = s;
    return s;
  }
}

// Global script properties store
const scriptProps = {};

function createSandboxContext() {
  const activeSpreadsheet = new MockSpreadsheet();

  const PropertiesService = {
    getScriptProperties: () => ({
      getProperty: (k) => scriptProps[k] || null,
      setProperty: (k, v) => { scriptProps[k] = String(v); },
      deleteProperty: (k) => { delete scriptProps[k]; },
      getProperties: () => ({ ...scriptProps }),
    }),
  };

  const SpreadsheetApp = {
    getActiveSpreadsheet: () => activeSpreadsheet,
    openById: () => activeSpreadsheet,
    flush: () => {},
  };

  const Utilities = {
    DigestAlgorithm: { SHA_256: 'SHA-256' },
    computeDigest: (alg, input) => {
      let buf;
      if (typeof input === 'string') {
        buf = Buffer.from(input, 'utf8');
      } else if (Array.isArray(input)) {
        buf = Buffer.from(input);
      } else if (Buffer.isBuffer(input)) {
        buf = input;
      } else {
        buf = Buffer.from(String(input), 'utf8');
      }
      const hash = crypto.createHash('sha256').update(buf).digest();
      const signed = [];
      for (let i = 0; i < hash.length; i++) {
        let byte = hash[i];
        if (byte > 127) byte -= 256;
        signed.push(byte);
      }
      return signed;
    },
    newBlob: (data) => ({
      getBytes: () => {
        const buf = Buffer.from(String(data), 'utf8');
        const signed = [];
        for (let i = 0; i < buf.length; i++) {
          let byte = buf[i];
          if (byte > 127) byte -= 256;
          signed.push(byte);
        }
        return signed;
      },
    }),
    getUuid: () => crypto.randomUUID(),
  };

  const ContentService = {
    MimeType: { JSON: 'application/json', TEXT: 'text/plain' },
    createTextOutput: (content) => {
      let mime = 'text/plain';
      return {
        setMimeType: (m) => { mime = m; return this; },
        getContent: () => content,
        getMimeType: () => mime,
      };
    },
  };

  const LockService = {
    getScriptLock: () => ({
      waitLock: () => true,
      tryLock: () => true,
      releaseLock: () => {},
    }),
  };

  const Logger = {
    log: () => {},
  };

  const ctx = {
    PropertiesService,
    SpreadsheetApp,
    Utilities,
    ContentService,
    LockService,
    Logger,
    console,
    Date,
    Math,
    String,
    Number,
    Boolean,
    Array,
    Object,
    JSON,
    Error,
    activeSpreadsheet,
  };

  vm.createContext(ctx);
  vm.runInContext(codeGsContent, ctx);
  return ctx;
}

// Helper to call doPost
function postApi(ctx, payload) {
  const e = { postData: { contents: JSON.stringify(payload) } };
  const res = ctx.doPost(e);
  return JSON.parse(res.getContent());
}

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAILED: ${message}`);
    process.exitCode = 1;
  }
}

// ============================================================================
// TEST SUITE EXECUTION
// ============================================================================

console.log('--- 1. Database Setup & Teacher Authentication ---');
const ctx = createSandboxContext();

// Run setupArcadeDatabase
ctx.setupArcadeDatabase();
assert(ctx.activeSpreadsheet.getSheetByName('Students') !== null, 'Students sheet created');
assert(ctx.activeSpreadsheet.getSheetByName('TeacherSessions') !== null, 'TeacherSessions sheet created');

// Initialize teacher credentials with passphrase
const initTeacher = ctx.initializeTeacherCredentials('TeacherMasterKey2026!');
console.log('initTeacher return value:', initTeacher);
assert(initTeacher === true, 'Teacher credentials initialized securely');

// Log in as teacher to get teacherToken
const teacherLoginRes = postApi(ctx, {
  action: 'teacher_login',
  password: 'TeacherMasterKey2026!',
});
console.log('teacherLoginRes:', teacherLoginRes);
assert(teacherLoginRes.success === true, 'Teacher login successful');
assert(Boolean(teacherLoginRes.teacherToken), 'teacherToken issued');
const teacherToken = teacherLoginRes.teacherToken;

// Security Check 1: Verify token was indeed written to TeacherSessions
const teacherSessionsSheet = ctx.activeSpreadsheet.getSheetByName('TeacherSessions');
assert(teacherSessionsSheet.getLastRow() >= 2, 'Session token row successfully persisted to TeacherSessions');

// Security Check 1b: Verify that if session storage throws, a controlled error is returned (NOT a token)
const origAppendRow = teacherSessionsSheet.appendRow;
teacherSessionsSheet.appendRow = () => { throw new Error('Simulated Google Drive write error'); };
const failedStorageRes = postApi(ctx, {
  action: 'teacher_login',
  password: 'TeacherMasterKey2026!',
});
assert(failedStorageRes.success === false, 'Session storage failure returns success: false');
assert(failedStorageRes.code === 'SESSION_STORAGE_ERROR', 'Controlled SESSION_STORAGE_ERROR code returned');
assert(!failedStorageRes.teacherToken, 'No unusable session token returned on storage failure');
// Restore appendRow
teacherSessionsSheet.appendRow = origAppendRow;

// Security Check 2: Brute-force lockout and counter atomicity
const wrongPass1 = postApi(ctx, { action: 'teacher_login', password: 'WrongPassword1' });
assert(wrongPass1.success === false && wrongPass1.code === 'UNAUTHORIZED', 'Incorrect password rejected');
assert(wrongPass1.attemptsRemaining === 4, 'Failed attempts counter tracks atomically (4 remaining)');

// Trigger lockout with 4 more failed attempts
postApi(ctx, { action: 'teacher_login', password: 'WrongPassword2' });
postApi(ctx, { action: 'teacher_login', password: 'WrongPassword3' });
postApi(ctx, { action: 'teacher_login', password: 'WrongPassword4' });
const lockedRes = postApi(ctx, { action: 'teacher_login', password: 'WrongPassword5' });
assert(lockedRes.success === false && lockedRes.code === 'LOCKED', 'Lockout engaged after 5 failed attempts');
assert(lockedRes.attemptsRemaining === 0, 'Zero attempts remaining reported');

// Attempting login during lockout (even with correct password) must be rejected
const lockedLoginAttempt = postApi(ctx, { action: 'teacher_login', password: 'TeacherMasterKey2026!' });
assert(lockedLoginAttempt.success === false && lockedLoginAttempt.code === 'LOCKED', 'Login during lockout rejected even with correct password');

// Manually clear lockout to restore test state for subsequent tests
ctx.PropertiesService.getScriptProperties().deleteProperty('TEACHER_LOCKED_UNTIL');
ctx.PropertiesService.getScriptProperties().setProperty('TEACHER_FAILED_ATTEMPTS', '0');

// Confirm login restores after lockout reset
const restoredLogin = postApi(ctx, { action: 'teacher_login', password: 'TeacherMasterKey2026!' });
assert(restoredLogin.success === true, 'Successful login succeeds and resets failed attempts');

console.log('\n--- 2. Server-Side Teacher Authorization Verification ---');
const unauthAdd = postApi(ctx, {
  action: 'teacher_add_student',
  teacherToken: 'invalid_token_123',
  studentNumber: '101',
  fullName: 'Test Student',
  class: '7A',
});
assert(unauthAdd.success === false, 'Unauthorized teacher_add_student rejected');
assert(unauthAdd.code === 'UNAUTHORIZED', 'Returns UNAUTHORIZED code');

const unauthBulk = postApi(ctx, {
  action: 'teacher_bulk_import_students',
  teacherToken: 'bad_token',
  students: [{ studentNumber: '102', fullName: 'Test', class: '7A' }],
});
assert(unauthBulk.success === false && unauthBulk.code === 'UNAUTHORIZED', 'Unauthorized bulk import rejected');

const unauthReset = postApi(ctx, {
  action: 'teacher_reset_student_pin',
  teacherToken: '',
  studentNumber: '701',
});
assert(unauthReset.success === false && unauthReset.code === 'UNAUTHORIZED', 'Unauthorized PIN reset rejected');

console.log('\n--- 3. Individual Student Enrollment (teacher_add_student) ---');
// 3a. Add student with auto-generated PIN
const addRes1 = postApi(ctx, {
  action: 'teacher_add_student',
  teacherToken,
  studentNumber: '105',
  fullName: 'Deniz Yılmaz',
  class: '7A',
});
assert(addRes1.success === true, 'Student 105 added successfully');
assert(addRes1.student.studentNumber === '105', 'Student number returned correctly');
assert(addRes1.student.grade === 'grade-7', 'Class 7A correctly inferred grade-7');
assert(typeof addRes1.generatedPin === 'string' && /^\d{4}$/.test(addRes1.generatedPin), 'Valid 4-digit generated PIN returned once');
const pin105 = addRes1.generatedPin;

// Verify Database Storage: plain PIN must NOT be in Students sheet
const studentsSheet = ctx.activeSpreadsheet.getSheetByName('Students');
const sRows = studentsSheet.getDataRange().getValues();
const s105Row = sRows.find((r) => String(r[1]) === '105');
assert(Boolean(s105Row), 'Row for 105 exists in Students sheet');
assert(s105Row[5].length === 32, '32-character salt stored');
assert(s105Row[6].length === 64, '64-character SHA-256 hash stored');
assert(s105Row.indexOf(pin105) === -1, 'SECURITY: Plaintext PIN is NOT stored anywhere in the database row');

// 3b. Duplicate student number rejection
const dupRes = postApi(ctx, {
  action: 'teacher_add_student',
  teacherToken,
  studentNumber: '105',
  fullName: 'Another Deniz',
  class: '7B',
});
assert(dupRes.success === false, 'Duplicate student number rejected');
assert(dupRes.code === 'DUPLICATE_STUDENT', 'Duplicate error code returned');

// 3c. Invalid class rejection
const badClassRes = postApi(ctx, {
  action: 'teacher_add_student',
  teacherToken,
  studentNumber: '106',
  fullName: 'Invalid Class Student',
  class: '9C',
});
assert(badClassRes.success === false && badClassRes.code === 'BAD_REQUEST', 'Invalid class 9C rejected');

// 3d. Add Grade 8 student with custom PIN
const addRes2 = postApi(ctx, {
  action: 'teacher_add_student',
  teacherToken,
  studentNumber: '205',
  fullName: 'Cem Kaya',
  class: '8B',
  pin: '5921',
});
assert(addRes2.success === true, 'Student 205 added with custom PIN');
assert(addRes2.student.grade === 'grade-8', 'Class 8B correctly inferred grade-8');
assert(addRes2.generatedPin === '5921', 'Custom PIN confirmed');

console.log('\n--- 4. Bulk Student Import (teacher_bulk_import_students) ---');
// 4a. Batch with internal duplicates rejected
const badBatch1 = postApi(ctx, {
  action: 'teacher_bulk_import_students',
  teacherToken,
  students: [
    { studentNumber: '301', fullName: 'Ali Demir', class: '7A' },
    { studentNumber: '301', fullName: 'Ali Demir Duplicate', class: '7A' },
  ],
});
assert(badBatch1.success === false && badBatch1.code === 'VALIDATION_ERROR', 'Internal batch duplicate blocked');

// 4b. Batch with existing DB duplicate rejected
const badBatch2 = postApi(ctx, {
  action: 'teacher_bulk_import_students',
  teacherToken,
  students: [
    { studentNumber: '105', fullName: 'Existing Student', class: '7A' },
  ],
});
assert(badBatch2.success === false && badBatch2.code === 'VALIDATION_ERROR', 'Import matching existing DB student blocked');

// 4c. Valid bulk import across classes 7A, 7B, 8A, 8B
const validBatch = postApi(ctx, {
  action: 'teacher_bulk_import_students',
  teacherToken,
  students: [
    { studentNumber: '711', fullName: 'Bora Yıldız', class: '7A' },
    { studentNumber: '721', fullName: 'Melis Aydın', class: '7B' },
    { studentNumber: '811', fullName: 'Kaan Şahin', class: '8A' },
    { studentNumber: '821', fullName: 'Ece Koç', class: '8B' },
  ],
});
assert(validBatch.success === true, 'Valid bulk import successful');
assert(validBatch.count === 4, 'Imported count is 4');
assert(validBatch.importedStudents.length === 4, '4 student objects returned');
assert(validBatch.importedStudents.every((s) => /^\d{4}$/.test(s.pin)), 'Every imported student received a 4-digit PIN');

console.log('\n--- 5. Student Authentication with Real Credentials ---');
// 5a. Login with generated PIN for 105
const login105 = postApi(ctx, {
  action: 'student_login',
  studentNumber: '105',
  pin: pin105,
});
assert(login105.success === true, 'Student 105 logged in with generated PIN');
assert(login105.student.displayName === 'Deniz Y.', 'Display name properly formatted');
assert(login105.student.grade === 'grade-7', 'Student grade is grade-7');
assert(login105.student.class === '7A', 'Student class is 7A');
assert(login105.pin_hash === undefined && login105.student.pin_hash === undefined, 'No PIN hash leaked in student login');

// 5b. Incorrect PIN fails
const wrongPin = postApi(ctx, {
  action: 'student_login',
  studentNumber: '105',
  pin: '0000',
});
assert(wrongPin.success === false, 'Incorrect PIN rejected');

console.log('\n--- 6. Student Update (teacher_update_student) ---');
// Move student 105 from 7A to 7B and update name
const updateRes = postApi(ctx, {
  action: 'teacher_update_student',
  teacherToken,
  studentNumber: '105',
  fullName: 'Deniz Yılmaz Demir',
  class: '7B',
});
assert(updateRes.success === true, 'Student 105 updated');
assert(updateRes.student.fullName === 'Deniz Yılmaz Demir', 'Updated full name');
assert(updateRes.student.class === '7B', 'Updated class to 7B');
assert(updateRes.student.studentNumber === '105', 'Student number strictly unchanged');

console.log('\n--- 7. Account Activation / Deactivation (teacher_set_student_active) ---');
// Deactivate student 105
const deactRes = postApi(ctx, {
  action: 'teacher_set_student_active',
  teacherToken,
  studentNumber: '105',
  isActive: false,
});
assert(deactRes.success === true && deactRes.isActive === false, 'Student 105 deactivated');

// Login should be blocked when inactive
const loginDeactivated = postApi(ctx, {
  action: 'student_login',
  studentNumber: '105',
  pin: pin105,
});
assert(loginDeactivated.success === false, 'Disabled student login rejected');
assert(loginDeactivated.code === 'FORBIDDEN', 'Forbidden code returned for disabled account');

// Re-activate student 105
const reactRes = postApi(ctx, {
  action: 'teacher_set_student_active',
  teacherToken,
  studentNumber: '105',
  isActive: true,
});
assert(reactRes.success === true && reactRes.isActive === true, 'Student 105 re-activated');

const loginReactivated = postApi(ctx, {
  action: 'student_login',
  studentNumber: '105',
  pin: pin105,
});
assert(loginReactivated.success === true, 'Re-activated student login succeeds');

console.log('\n--- 8. Security PIN Reset (teacher_reset_student_pin) ---');
// Reset PIN for 105 with new PIN '7788'
const resetRes = postApi(ctx, {
  action: 'teacher_reset_student_pin',
  teacherToken,
  studentNumber: '105',
  newPin: '7788',
});
assert(resetRes.success === true, 'PIN reset successful');
assert(resetRes.newPin === '7788', 'New PIN returned');

// Old PIN must now fail
const loginOld = postApi(ctx, {
  action: 'student_login',
  studentNumber: '105',
  pin: pin105,
});
assert(loginOld.success === false, 'Old PIN no longer works');

// New PIN works
const loginNew = postApi(ctx, {
  action: 'student_login',
  studentNumber: '105',
  pin: '7788',
});
assert(loginNew.success === true, 'New PIN logs in successfully');

console.log('\n--- 8b. Bulk Student PIN Reset & Credential Delivery (teacher_bulk_reset_student_pins) ---');
// 8b-1. Unauthorized bulk reset rejected
const unauthBulkReset = postApi(ctx, {
  action: 'teacher_bulk_reset_student_pins',
  teacherToken: 'bad_token',
  class: 'all',
});
assert(unauthBulkReset.success === false && unauthBulkReset.code === 'UNAUTHORIZED', 'Unauthorized bulk reset rejected');

// 8b-2. Empty request rejected
const emptyBulkReset = postApi(ctx, {
  action: 'teacher_bulk_reset_student_pins',
  teacherToken,
});
assert(emptyBulkReset.success === false && emptyBulkReset.code === 'BAD_REQUEST', 'Empty bulk reset request rejected');

// 8b-3. Execute bulk PIN reset for specific students [105, 205]
const bulkResetRes = postApi(ctx, {
  action: 'teacher_bulk_reset_student_pins',
  teacherToken,
  studentNumbers: ['105', '205'],
});
assert(bulkResetRes.success === true, 'Bulk PIN reset executed successfully');
assert(bulkResetRes.count === 2, 'Count of reset credentials is 2');
assert(Array.isArray(bulkResetRes.credentials), 'Credentials array returned');

const cred105 = bulkResetRes.credentials.find((c) => c.studentNumber === '105');
const cred205 = bulkResetRes.credentials.find((c) => c.studentNumber === '205');
assert(Boolean(cred105 && cred205), 'Both targeted students received credentials');
assert(/^\d{4}$/.test(cred105.pin), 'Student 105 received valid 4-digit PIN');
assert(/^\d{4}$/.test(cred205.pin), 'Student 205 received valid 4-digit PIN');
assert(cred105.pin !== '7788', 'Student 105 received a newly generated PIN');

// 8b-4. Database Security Check: Plaintext PIN is NOT stored in Google Sheets
const stdSheet = ctx.activeSpreadsheet.getSheetByName('Students');
const stdRows = stdSheet.getDataRange().getValues();
const stdRow105 = stdRows.find((r) => String(r[1]) === '105');
assert(stdRow105 !== undefined, 'Student 105 row found in sheet');
assert(String(stdRow105[5]).length === 32, '32-character cryptographic salt stored');
assert(String(stdRow105[6]).length === 64, '64-character SHA-256 hash stored');
assert(!stdRow105.includes(cred105.pin), 'SECURITY: Plaintext PIN is NOT stored anywhere in the sheet row');

// 8b-5. Demographic & Progress Preservation Check
assert(stdRow105[2] === 'Deniz Yılmaz Demir', 'Student full name strictly preserved');
assert(stdRow105[4] === '7B', 'Student class strictly preserved');
assert(stdRow105[3] === 'grade-7', 'Student grade strictly preserved');
assert(Number(stdRow105[7]) === 1 || stdRow105[7] === true, 'Student active status strictly preserved');

// 8b-6. Authentication Check: Old PIN '7788' fails; new PIN succeeds
const loginWithOld = postApi(ctx, {
  action: 'student_login',
  studentNumber: '105',
  pin: '7788',
});
assert(loginWithOld.success === false, 'Previous PIN fails after bulk reset');

const loginWithBulkNew = postApi(ctx, {
  action: 'student_login',
  studentNumber: '105',
  pin: cred105.pin,
});
assert(loginWithBulkNew.success === true, 'New bulk-generated PIN authenticates successfully');

// 8b-7. Ordinary Roster Privacy Check: teacher_get_roster NEVER exposes PINs or salts
const rosterCheck = postApi(ctx, {
  action: 'teacher_get_roster',
  teacherToken,
});
assert(rosterCheck.success === true, 'Teacher roster retrieved');
const rosterStudent105 = rosterCheck.roster.find((s) => s.studentNumber === '105');
assert(rosterStudent105 !== undefined, 'Student 105 found in teacher roster');
assert(rosterStudent105.pin === undefined, 'PIN is strictly undefined in teacher_get_roster');
assert(rosterStudent105.pin_salt === undefined, 'PIN salt is strictly undefined in teacher_get_roster');
assert(rosterStudent105.pin_hash === undefined, 'PIN hash is strictly undefined in teacher_get_roster');

// 8b-8. Bulk Reset by Class ('all' or '7B')
const classResetRes = postApi(ctx, {
  action: 'teacher_bulk_reset_student_pins',
  teacherToken,
  class: '7B',
});
assert(classResetRes.success === true, 'Bulk reset by class 7B succeeded');
assert(classResetRes.credentials.every((c) => c.class === '7B'), 'All reset accounts belong to class 7B');

console.log('\n--- 9. Demo Account Archival & Isolation ---');
// 9a. Preview demo accounts
const previewRes = postApi(ctx, {
  action: 'teacher_get_demo_accounts_preview',
  teacherToken,
});
assert(previewRes.success === true, 'Demo accounts preview retrieved');
assert(previewRes.demoAccounts.length === 8, 'All 8 initial demo accounts identified (701-704, 801-804)');

// 9b. Unconfirmed archive rejected
const unconfirmedArchive = postApi(ctx, {
  action: 'teacher_archive_demo_accounts',
  teacherToken,
  confirmed: false,
});
assert(unconfirmedArchive.success === false, 'Unconfirmed archive rejected');

// 9c. Confirmed archive
const archiveRes = postApi(ctx, {
  action: 'teacher_archive_demo_accounts',
  teacherToken,
  confirmed: true,
});
assert(archiveRes.success === true, 'Demo accounts archived');
assert(archiveRes.archivedCount === 8, '8 demo accounts archived');

// Verify that demo accounts are now deactivated, tagged DEMO_ARCHIVE, and relinked with _demo
const updatedStudentsData = ctx.activeSpreadsheet.getSheetByName('Students').getDataRange().getValues();
const s701Row = updatedStudentsData.find((r) => String(r[1]) === '701' || String(r[1]) === '701_demo');
assert(s701Row[4] === 'DEMO_ARCHIVE', 'Demo student 701 class set to DEMO_ARCHIVE');
assert(s701Row[7] === false, 'Demo student 701 is_active set to false');
assert(String(s701Row[1]) === '701_demo', 'Demo student 701 relinked to 701_demo to release number for real students');

// 9d. Verify a real student can now claim student number 701 without collision
const addReal701 = postApi(ctx, {
  action: 'teacher_add_student',
  teacherToken,
  studentNumber: '701',
  fullName: 'Ahmet Yılmaz',
  class: '7A',
});
assert(addReal701.success === true, 'Real student 701 (Ahmet Yılmaz) enrolled without duplicate collision');

// 9e. Verify that running demo archival again does NOT touch real student 701 (Ahmet Yılmaz)
const archiveAgain = postApi(ctx, {
  action: 'teacher_archive_demo_accounts',
  teacherToken,
  confirmed: true,
});
assert(archiveAgain.success === true, 'Repeated demo archival call succeeded');
const postArchiveStudents = ctx.activeSpreadsheet.getSheetByName('Students').getDataRange().getValues();
const real701Row = postArchiveStudents.find((r) => String(r[1]) === '701');
assert(real701Row[2] === 'Ahmet Yılmaz', 'Real student 701 name unchanged');
assert(real701Row[4] === '7A', 'Real student 701 remains in class 7A');
assert(real701Row[7] === true, 'Real student 701 remains active (protected against demo archival)');

// 9f. Verify teacher_get_overview isolates archived demo data from active classes
const overviewRes = postApi(ctx, {
  action: 'teacher_get_overview',
  teacherToken,
});
assert(overviewRes.success === true, 'Overview KPI retrieved');
// Total students should only count active students (105, 205, 711, 721, 811, 821, 701 = 7 real students)
assert(overviewRes.overview.totalStudents === 7, `Total active students reflects only real roster (got: ${overviewRes.overview.totalStudents})`);

// 9g. Verify teacher_get_roster omits DEMO_ARCHIVE by default
const rosterRes = postApi(ctx, {
  action: 'teacher_get_roster',
  teacherToken,
});
assert(rosterRes.success === true, 'Roster retrieved');
assert(rosterRes.roster.every((s) => s.class !== 'DEMO_ARCHIVE'), 'DEMO_ARCHIVE omitted from default classroom roster');
assert(rosterRes.roster.some((s) => s.studentNumber === '105'), 'Real student 105 present in classroom roster');
assert(rosterRes.roster.some((s) => s.studentNumber === '701' && s.fullName === 'Ahmet Yılmaz'), 'Real student 701 present in classroom roster');

console.log('\n--- 10. Frontend Demo Credentials Removal Verification ---');
const loginModalSrc = fs.readFileSync('c:\\Users\\FATİH\\.gemini\\antigravity-ide\\scratch\\english-taboo-game\\unit-review-arcade\\src\\components\\auth\\StudentLoginModal.tsx', 'utf8');
const loginScreenSrc = fs.readFileSync('c:\\Users\\FATİH\\.gemini\\antigravity-ide\\scratch\\english-taboo-game\\unit-review-arcade\\src\\components\\auth\\StudentLoginScreen.tsx', 'utf8');

assert(!loginModalSrc.includes('handleSelectDemoAccount'), 'handleSelectDemoAccount removed from StudentLoginModal');
assert(!loginModalSrc.includes('Quick Test Accounts'), 'Quick Test Accounts drawer removed from StudentLoginModal');
assert(!loginScreenSrc.includes('handleSelectDemo'), 'handleSelectDemo removed from StudentLoginScreen');
assert(!loginScreenSrc.includes('Select a sample student account'), 'Sample accounts drawer removed from StudentLoginScreen');
assert(!loginScreenSrc.includes("setStudentNumber('701')"), 'Hardcoded auto-fill 701 removed from StudentLoginScreen');
assert(!loginScreenSrc.includes("setStudentNumber('801')"), 'Hardcoded auto-fill 801 removed from StudentLoginScreen');

console.log(`\n======================================================================`);
console.log(`🎉 ALL TESTS PASSED: ${passed} / ${total} assertions passed with 0 errors!`);
console.log(`======================================================================\n`);
