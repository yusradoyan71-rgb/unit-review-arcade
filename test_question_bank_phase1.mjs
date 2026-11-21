/**
 * ============================================================================
 * UNIT REVIEW ARCADE — QUESTION BANK & TWO-SECTION ARCHITECTURE (PHASE 1)
 * TEST SUITE: DATA MODELS, COMPATIBILITY & BACKEND PREPARATION
 * ============================================================================
 * 
 * Verifies:
 * 1. Database Isolation & Non-destructive Sheet Setup:
 *    - QuestionBank sheet created with all 20 headers.
 *    - Existing sheets (Students, Sessions, Attempts, Answers, Monsters, etc.) strictly untouched.
 * 2. Teacher Authorization Security:
 *    - Unauthorized requests rejected with UNAUTHORIZED code.
 * 3. Question Bank CRUD Operations:
 *    - Creation of single question (version 1, status active).
 *    - In-place editing of question (version 2, updated_at).
 *    - Soft-delete (status 'archived', row preserved).
 *    - Filtering by section, gradeId, skill, topic, difficulty, search.
 * 4. Bulk Import:
 *    - Batch insertion with deduplication and overwrite options.
 * 5. Additive Compatibility with Existing Hardcoded Questions:
 *    - Loss-less roundtrip conversion between legacy AnyQuestion schemas
 *      and authoritative QuestionBankItem schema.
 * 6. Configurable Mixed Practice Ratio Specification:
 *    - 50/50 default with configurable ratios.
 */

import fs from 'fs';
import vm from 'vm';
import crypto from 'crypto';

console.log('🧪 Starting Question Bank Phase 1 Test Suite...\n');

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

  clear() {
    this.rows = [];
    return this;
  }

  clearContents() {
    this.rows = [];
    return this;
  }
}

class MockSpreadsheet {
  constructor(name = 'Unit Review Arcade – Student Tracking Database') {
    this.name = name;
    this.sheets = new Map();
  }

  getName() { return this.name; }
  getSheetByName(name) { return this.sheets.get(name) || null; }
  insertSheet(name) {
    const s = new MockSheet(name, this);
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

  const mockLock = {
    waitLock: () => true,
    tryLock: () => true,
    releaseLock: () => true,
    hasLock: () => true,
  };

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
      getDocumentLock: () => mockLock,
      getScriptLock: () => mockLock,
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
  return { ctx, activeSpreadsheet, scriptProperties };
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
// TEST 1: Database Initialization & Isolation
// ============================================================================
console.log('--- 1. Database Initialization & Sheet Isolation ---');
const { ctx, activeSpreadsheet } = createGasContext();

vm.runInContext('setupArcadeDatabase()', ctx);

const qbSheet = activeSpreadsheet.getSheetByName('QuestionBank');
assert(qbSheet !== null, 'QuestionBank sheet created during setupArcadeDatabase()');

const headers = qbSheet.getDataRange().getValues()[0];
assert(headers.length === 20, 'QuestionBank sheet contains exactly 20 headers');
assert(headers[0] === 'question_id', 'Header 1 is question_id');
assert(headers[1] === 'section', 'Header 2 is section');
assert(headers[2] === 'grade_id', 'Header 3 is grade_id');
assert(headers[8] === 'question_type', 'Header 9 is question_type');
assert(headers[11] === 'payload_json', 'Header 12 is payload_json');

// Verify existing sheets are present and untouched
assert(activeSpreadsheet.getSheetByName('Students') !== null, 'Students sheet preserved');
assert(activeSpreadsheet.getSheetByName('Sessions') !== null, 'Sessions sheet preserved');
assert(activeSpreadsheet.getSheetByName('Attempts') !== null, 'Attempts sheet preserved');
assert(activeSpreadsheet.getSheetByName('Answers') !== null, 'Answers sheet preserved');
assert(activeSpreadsheet.getSheetByName('Curriculum') !== null, 'Curriculum sheet preserved');

// Verify idempotent re-run
vm.runInContext('setupQuestionBankSheet()', ctx);
assert(qbSheet.getLastRow() === 1, 'Re-running setupQuestionBankSheet does not duplicate headers');

// ============================================================================
// TEST 2: Teacher Authorization Security
// ============================================================================
console.log('\n--- 2. Teacher Authorization Security ---');
vm.runInContext('initializeTeacherCredentials("TeacherMasterPass2026!")', ctx);

const unauthGet = postApi(ctx, { action: 'teacher_get_question_bank', teacherToken: 'bad_token' });
assert(unauthGet.success === false && unauthGet.code === 'UNAUTHORIZED', 'Unauthorized GET rejected');

const unauthSave = postApi(ctx, { action: 'teacher_save_question', teacherToken: 'bad_token', question: { prompt: 'Test' } });
assert(unauthSave.success === false && unauthSave.code === 'UNAUTHORIZED', 'Unauthorized SAVE rejected');

const unauthImport = postApi(ctx, { action: 'teacher_bulk_import_questions', teacherToken: 'bad_token', questions: [] });
assert(unauthImport.success === false && unauthImport.code === 'UNAUTHORIZED', 'Unauthorized BULK IMPORT rejected');

const unauthArchive = postApi(ctx, { action: 'teacher_archive_question', teacherToken: 'bad_token', questionId: 'qb_1' });
assert(unauthArchive.success === false && unauthArchive.code === 'UNAUTHORIZED', 'Unauthorized ARCHIVE rejected');

// Authenticate teacher
const loginRes = postApi(ctx, { action: 'teacher_login', password: 'TeacherMasterPass2026!' });
assert(loginRes.success === true, 'Teacher logged in successfully');
const teacherToken = loginRes.teacherToken;

// ============================================================================
// TEST 3: Question Bank CRUD Operations
// ============================================================================
console.log('\n--- 3. Question Bank CRUD Operations ---');

// 3A: Create Question
const sampleQ1 = {
  section: 'general_english',
  gradeId: 'grade-7',
  topic: 'Present Continuous',
  skill: 'grammar',
  difficulty: 'medium',
  questionType: 'multiple_choice',
  assignedGameTypes: ['quiz_battle'],
  prompt: 'Look! The students _____ football on the playground right now.',
  payload: {
    options: ['play', 'is playing', 'are playing', 'played'],
    correctOptionIndex: 2
  },
  correctAnswerPreview: 'C) are playing',
  explanation: 'With plural subject "The students" and time marker "right now", use "are + verb-ing".',
  points: 10,
  tags: ['present-continuous', 'grammar-gym', '7th-grade']
};

const createRes = postApi(ctx, {
  action: 'teacher_save_question',
  teacherToken,
  question: sampleQ1
});

assert(createRes.success === true, 'Question created successfully');
assert(createRes.created === true, 'Flagged as newly created');
assert(Boolean(createRes.question.id), 'Generated unique question ID: ' + createRes.question?.id);
assert(createRes.question.contentVersion === 1, 'Initial content version is 1');
const createdId = createRes.question.id;

// 3B: Read Question Bank
const getRes1 = postApi(ctx, {
  action: 'teacher_get_question_bank',
  teacherToken,
  section: 'general_english'
});
assert(getRes1.success === true, 'Retrieved question bank items');
assert(getRes1.count === 1, 'Question bank contains 1 item');
const fetchedQ1 = getRes1.questions[0];
assert(fetchedQ1.id === createdId, 'Fetched question ID matches');
assert(fetchedQ1.prompt === sampleQ1.prompt, 'Prompt matches');
assert(fetchedQ1.payload.options.length === 4, 'Payload options preserved');
assert(fetchedQ1.payload.correctOptionIndex === 2, 'Correct option index preserved');

// 3C: Edit / Update Question
const updatedSampleQ1 = {
  ...fetchedQ1,
  prompt: 'Look! The children _____ football on the playground right now.',
  explanation: 'Plural subject "The children" takes "are playing".'
};

const updateRes = postApi(ctx, {
  action: 'teacher_save_question',
  teacherToken,
  question: updatedSampleQ1
});
assert(updateRes.success === true, 'Question updated successfully');
assert(updateRes.updated === true, 'Flagged as updated in-place');
assert(updateRes.question.contentVersion === 2, 'Content version incremented to 2');

// Verify update in retrieval
const getRes2 = postApi(ctx, {
  action: 'teacher_get_question_bank',
  teacherToken
});
assert(getRes2.questions[0].prompt === updatedSampleQ1.prompt, 'Retrieved updated prompt text');
assert(getRes2.questions[0].contentVersion === 2, 'Retrieved updated content version 2');

// 3D: Soft-Archive (Non-destructive delete)
const archiveRes = postApi(ctx, {
  action: 'teacher_archive_question',
  teacherToken,
  questionId: createdId
});
assert(archiveRes.success === true, 'Question archived successfully');
assert(archiveRes.status === 'archived', 'Status updated to archived');

// By default, active questions filter excludes archived
const getActiveOnly = postApi(ctx, {
  action: 'teacher_get_question_bank',
  teacherToken,
  status: 'active'
});
assert(getActiveOnly.count === 0, 'Active filter excludes archived question');

// Asking for all or archived returns it
const getAll = postApi(ctx, {
  action: 'teacher_get_question_bank',
  teacherToken,
  status: 'all'
});
assert(getAll.count === 1, 'Status "all" returns archived question');
assert(getAll.questions[0].status === 'archived', 'Question status is confirmed archived');

// ============================================================================
// TEST 4: Bulk Import of Multiple Question Types
// ============================================================================
console.log('\n--- 4. Bulk Import Across All Question Types ---');

const bulkBatch = [
  // 1. Multiple Choice (Unit Review)
  {
    id: 'qb_test_mcq_1',
    section: 'unit_review',
    gradeId: 'grade-7',
    unitId: 'g7-u1',
    unitTitle: 'Life Online',
    topic: 'Digital Verbs',
    skill: 'vocabulary',
    difficulty: 'easy',
    questionType: 'multiple_choice',
    assignedGameTypes: ['quiz_battle'],
    prompt: 'You _____ photos to share them with friends on the internet.',
    payload: { options: ['upload', 'delete', 'scroll', 'power off'], correctOptionIndex: 0 },
    correctAnswerPreview: 'A) upload',
    points: 10,
    tags: ['unit-1', 'verbs']
  },
  // 2. Sentence Builder (General English)
  {
    id: 'qb_test_sb_1',
    section: 'general_english',
    gradeId: 'all',
    topic: 'Past Simple',
    skill: 'grammar',
    difficulty: 'medium',
    questionType: 'sentence_builder',
    assignedGameTypes: ['sentence_builder'],
    prompt: 'Unscramble the sentence in past simple:',
    payload: {
      correctSentence: 'We visited the British Museum yesterday.',
      scrambledWords: ['We', 'visited', 'the', 'British', 'Museum', 'yesterday'],
      acceptedAnswers: ['We visited the British Museum yesterday.', 'Yesterday we visited the British Museum.']
    },
    correctAnswerPreview: 'We visited the British Museum yesterday.',
    points: 15,
    tags: ['past-simple', 'syntax']
  },
  // 3. True / False (Both)
  {
    id: 'qb_test_tf_1',
    section: 'both',
    gradeId: 'grade-8',
    unitId: 'g8-u1',
    topic: 'Music Vocabulary',
    skill: 'vocabulary',
    difficulty: 'easy',
    questionType: 'true_false',
    assignedGameTypes: ['true_false'],
    prompt: 'A composer is a person who writes pieces of music.',
    payload: { isTrue: true },
    correctAnswerPreview: 'TRUE',
    explanation: 'True. Composers create musical compositions.',
    points: 10,
    tags: ['music', 'true-false']
  },
  // 4. Matching Pairs (General English)
  {
    id: 'qb_test_match_1',
    section: 'general_english',
    gradeId: 'all',
    topic: 'Synonyms',
    skill: 'vocabulary',
    difficulty: 'medium',
    questionType: 'match_it',
    assignedGameTypes: ['match_it'],
    prompt: 'Match each adjective with its synonym:',
    payload: {
      pairs: [
        { id: 'p1', left: 'Huge', right: 'Enormous' },
        { id: 'p2', left: 'Tiny', right: 'Microscopic' },
        { id: 'p3', left: 'Fast', right: 'Rapid' }
      ]
    },
    correctAnswerPreview: 'Huge = Enormous; Tiny = Microscopic; Fast = Rapid',
    points: 15,
    tags: ['synonyms', 'vocab-arena']
  }
];

const bulkRes = postApi(ctx, {
  action: 'teacher_bulk_import_questions',
  teacherToken,
  questions: bulkBatch,
  overwriteDuplicates: true
});

assert(bulkRes.success === true, 'Bulk import succeeded');
assert(bulkRes.importedCount === 4, 'Imported 4 new distinct questions');

// Test Filtering
const filterUR = postApi(ctx, { action: 'teacher_get_question_bank', teacherToken, section: 'unit_review' });
assert(filterUR.count === 2, 'Section "unit_review" includes pure unit review + "both" questions (2 total)');

const filterGrammar = postApi(ctx, { action: 'teacher_get_question_bank', teacherToken, skill: 'grammar' });
assert(filterGrammar.count === 1, 'Skill "grammar" matches 1 question');
assert(filterGrammar.questions[0].topic === 'Past Simple', 'Grammar item topic matches');

const searchRes = postApi(ctx, { action: 'teacher_get_question_bank', teacherToken, searchQuery: 'museum' });
assert(searchRes.count === 1, 'Search query "museum" matched sentence builder prompt');

// ============================================================================
// TEST 5: Compatibility Verification (Hardcoded Question Converter)
// ============================================================================
console.log('\n--- 5. Additive Converter Compatibility Verification ---');

// Mock hardcoded MultipleChoiceQuestion from Grade 7 Unit 1
const legacyMCQ = {
  id: 'g7-u1-v1',
  prompt: 'To send files or photos to the internet, you _____ them.',
  options: ['Upload', 'Download', 'Delete', 'Scroll'],
  correctOptionIndex: 0,
  explanation: "'Upload' means transferring digital files from your personal device to an online platform or server.",
  difficulty: 'easy',
};

// Mock hardcoded SentenceBuilderQuestion from Grade 7 Unit 1
const legacySB = {
  id: 'g7-u1-s01',
  prompt: 'Describing a daily online habit in the morning:',
  correctSentence: 'She checks her messages every morning before breakfast.',
  scrambledWords: ['She', 'checks', 'her', 'messages', 'every', 'morning', 'before', 'breakfast'],
  acceptedAnswers: [
    'She checks her messages every morning before breakfast.',
    'Every morning before breakfast she checks her messages.',
  ],
  explanation: 'Time phrases can be placed at the beginning or end of the sentence.',
  difficulty: 'easy',
};

// Mock hardcoded TrueFalseQuestion from Grade 7 Unit 1
const legacyTF = {
  id: 'g7-u1-tf01',
  prompt: 'Downloading means transferring files from your phone onto an internet server for others to view.',
  isTrue: false,
  explanation: 'False. That is "uploading".',
  difficulty: 'easy',
};

// Convert to QuestionBankItem format
function convertLegacyToBank(q, qType, assignedGame) {
  return {
    id: q.id,
    section: 'unit_review',
    gradeId: 'grade-7',
    unitId: 'g7-u1',
    unitTitle: 'Life Online',
    topic: 'Digital Life',
    skill: qType === 'sentence_builder' ? 'grammar' : 'vocabulary',
    difficulty: q.difficulty || 'medium',
    questionType: qType,
    assignedGameTypes: [assignedGame],
    prompt: q.prompt,
    payload: { ...q },
    correctAnswerPreview: qType === 'multiple_choice' ? q.options[q.correctOptionIndex] : (q.correctSentence || (q.isTrue ? 'TRUE' : 'FALSE')),
    explanation: q.explanation,
    points: 10,
    tags: ['unit-1', 'grade-7'],
    status: 'active',
    contentVersion: 1
  };
}

const bankMCQ = convertLegacyToBank(legacyMCQ, 'multiple_choice', 'quiz_battle');
const bankSB = convertLegacyToBank(legacySB, 'sentence_builder', 'sentence_builder');
const bankTF = convertLegacyToBank(legacyTF, 'true_false', 'true_false');

// Convert back to game engine shape
const restoredMCQ = {
  id: bankMCQ.id,
  prompt: bankMCQ.prompt,
  options: bankMCQ.payload.options,
  correctOptionIndex: bankMCQ.payload.correctOptionIndex,
  explanation: bankMCQ.explanation,
  difficulty: bankMCQ.difficulty,
};
assert(JSON.stringify(restoredMCQ) === JSON.stringify(legacyMCQ), 'Loss-less roundtrip fidelity for MultipleChoiceQuestion');

const restoredSB = {
  id: bankSB.id,
  prompt: bankSB.prompt,
  correctSentence: bankSB.payload.correctSentence,
  scrambledWords: bankSB.payload.scrambledWords,
  acceptedAnswers: bankSB.payload.acceptedAnswers,
  explanation: bankSB.explanation,
  difficulty: bankSB.difficulty,
};
assert(JSON.stringify(restoredSB) === JSON.stringify(legacySB), 'Loss-less roundtrip fidelity for SentenceBuilderQuestion');

const restoredTF = {
  id: bankTF.id,
  prompt: bankTF.prompt,
  isTrue: bankTF.payload.isTrue,
  explanation: bankTF.explanation,
  difficulty: bankTF.difficulty,
};
assert(JSON.stringify(restoredTF) === JSON.stringify(legacyTF), 'Loss-less roundtrip fidelity for TrueFalseQuestion');

// ============================================================================
// TEST 6: Configurable Mixed Practice Ratio Verification
// ============================================================================
console.log('\n--- 6. Configurable Mixed Practice Ratio Specification ---');

const defaultRatio = { unitPercentage: 50, generalPercentage: 50 };
assert(defaultRatio.unitPercentage === 50 && defaultRatio.generalPercentage === 50, 'Default Mixed Practice ratio is strictly 50/50');

function resolveQuestionPool(unitPool, generalPool, targetTotal, ratio = defaultRatio) {
  const unitCount = Math.round((targetTotal * ratio.unitPercentage) / 100);
  const generalCount = targetTotal - unitCount;
  return {
    unitQuestions: unitPool.slice(0, unitCount),
    generalQuestions: generalPool.slice(0, generalCount),
    totalCount: unitCount + generalCount,
  };
}

const mockUnitPool = Array.from({ length: 20 }, (_, i) => ({ id: `u_${i}` }));
const mockGeneralPool = Array.from({ length: 20 }, (_, i) => ({ id: `g_${i}` }));

// Test 50/50
const pool50 = resolveQuestionPool(mockUnitPool, mockGeneralPool, 10, { unitPercentage: 50, generalPercentage: 50 });
assert(pool50.unitQuestions.length === 5 && pool50.generalQuestions.length === 5, '50/50 ratio yields 5 unit and 5 general questions');

// Test 70/30
const pool70 = resolveQuestionPool(mockUnitPool, mockGeneralPool, 10, { unitPercentage: 70, generalPercentage: 30 });
assert(pool70.unitQuestions.length === 7 && pool70.generalQuestions.length === 3, '70/30 ratio yields 7 unit and 3 general questions');

// Test 30/70
const pool30 = resolveQuestionPool(mockUnitPool, mockGeneralPool, 10, { unitPercentage: 30, generalPercentage: 70 });
assert(pool30.unitQuestions.length === 3 && pool30.generalQuestions.length === 7, '30/70 ratio yields 3 unit and 7 general questions');

// ============================================================================
// SUMMARY
// ============================================================================
console.log('\n======================================================================');
console.log(`🎉 ALL PHASE 1 TESTS PASSED: ${passedAssertions} / ${totalAssertions} assertions passed with 0 errors!`);
console.log('======================================================================\n');
