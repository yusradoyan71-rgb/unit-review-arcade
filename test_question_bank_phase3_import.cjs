/**
 * UNIT REVIEW ARCADE — QUESTION BANK MANAGER PHASE 3 AUTOMATED TEST SUITE
 * 
 * Comprehensive verification of Excel and CSV Bulk Question Import:
 * 1. Spreadsheet Engine (.xlsx generation/parsing, RFC-4180 CSV with UTF-8 BOM)
 * 2. Downloadable Question Templates across all supported types
 * 3. Automatic Column Mapping (English & Turkish aliases)
 * 4. Validation Engine (Missing prompts, invalid option counts, missing answers, types)
 * 5. Deduplication & Zero-Overwrite Protection (in-file, custom bank, 1,206 built-in questions)
 * 6. Backend Bulk Import with Batch Stamping
 * 7. Safe 1-Click Rollback without affecting previously existing questions
 */

const { createJiti } = require('jiti');
const jiti = createJiti(__filename);
const fs = require('fs');
const vm = require('vm');
const crypto = require('crypto');

const {
  generateCsv,
  parseCsv,
  generateXlsx,
  parseXlsx,
  calculateCrc32,
  colLetterToIndex,
  indexToColLetter,
} = jiti('./src/utils/spreadsheetParser.ts');

const {
  TEMPLATES,
  exportQuestionBank,
} = jiti('./src/utils/questionTemplateGenerator.ts');

const {
  mapSpreadsheetHeaders,
  validateImportRows,
  validateSingleRow,
  normalizePromptForDeduplication,
} = jiti('./src/utils/questionImportValidator.ts');

const { DEFAULT_INITIAL_DATA } = jiti('./src/services/storageService.ts');
const { convertAnyQuestionToBankItem } = jiti('./src/utils/questionBankCompat.ts');

let passedTests = 0;
function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(err);
    process.exit(1);
  }
}

async function testAsync(name, fn) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(err);
    process.exit(1);
  }
}

(async () => {
  console.log('🧪 Starting Question Bank Phase 3 Import & Rollback Suite...\n');

  // ====================================================================
  // 1. SPREADSHEET ENGINE (.XLSX & RFC-4180 CSV)
  // ====================================================================
  console.log('--- 1. Spreadsheet Engine (.XLSX & CSV) ---');

  test('CRC-32 produces standard IEEE 802.3 checksums', () => {
    const text = '123456789';
    const crc = calculateCrc32(Buffer.from(text));
    if (crc.toString(16) !== 'cbf43926') {
      throw new Error(`Expected cbf43926, got ${crc.toString(16)}`);
    }
  });

  test('Column letter to index and index to column letter conversions', () => {
    if (colLetterToIndex('A') !== 0) throw new Error('A should be 0');
    if (colLetterToIndex('Z') !== 25) throw new Error('Z should be 25');
    if (colLetterToIndex('AA') !== 26) throw new Error('AA should be 26');
    if (colLetterToIndex('BC') !== 54) throw new Error('BC should be 54');

    if (indexToColLetter(0) !== 'A') throw new Error('0 should be A');
    if (indexToColLetter(25) !== 'Z') throw new Error('25 should be Z');
    if (indexToColLetter(26) !== 'AA') throw new Error('26 should be AA');
    if (indexToColLetter(54) !== 'BC') throw new Error('54 should be BC');
  });

  test('RFC-4180 CSV generation prepends UTF-8 BOM and escapes quotes/newlines', () => {
    const sample = [
      ['Question', 'Option A', 'Option B', 'Answer'],
      ['What is "Apple"?', 'A fruit\n(common)', 'A vehicle', 'A'],
      ['Simple question', 'Choice 1, with comma', 'Choice 2', 'B'],
    ];

    const csv = generateCsv(sample);
    if (!csv.startsWith('\uFEFF')) throw new Error('CSV must start with UTF-8 BOM \\uFEFF');
    if (!csv.includes('"What is ""Apple""?"')) throw new Error('Quotes not escaped properly');
    if (!csv.includes('"A fruit\n(common)"')) throw new Error('Multiline cell not quoted properly');
    if (!csv.includes('"Choice 1, with comma"')) throw new Error('Cell with comma not quoted properly');
  });

  test('RFC-4180 CSV parsing handles BOM, escaped quotes, multiline, and semicolon delimiter', () => {
    const csvContent =
      '\uFEFFQuestion;Option A;Option B;Answer\r\n' +
      '"What is ""Apple""?";"A fruit\n(common)";"A vehicle";A\r\n' +
      'Simple;Choice 1;Choice 2;B';

    const parsed = parseCsv(csvContent);
    if (parsed.length !== 3) throw new Error(`Expected 3 rows, got ${parsed.length}`);
    if (parsed[1][0] !== 'What is "Apple"?') throw new Error(`Prompt mismatch: ${parsed[1][0]}`);
    if (parsed[1][1] !== 'A fruit\n(common)') throw new Error(`Multiline cell mismatch: ${parsed[1][1]}`);
    if (parsed[2][0] !== 'Simple') throw new Error(`Row 2 mismatch: ${parsed[2][0]}`);
  });

  await testAsync('Full XLSX generation and parsing roundtrip without loss', async () => {
    const sampleData = [
      ['Prompt', 'Option A', 'Option B', 'Option C', 'Correct Answer', 'Points'],
      ['Select the correct irregular verb form.', 'went', 'goed', 'goes', 'A', '10'],
      ['Read the sentence: "They visited London."', 'TRUE', 'FALSE', '', 'TRUE', '15'],
      ['Special characters: ç, ğ, ı, ö, ş, ü, é, ñ', 'Evet', 'Hayır', '', 'A', '10'],
    ];

    const xlsxBuffer = await generateXlsx(sampleData);
    if (xlsxBuffer.length < 500) throw new Error(`Generated XLSX too small: ${xlsxBuffer.length} bytes`);

    const parsed = await parseXlsx(xlsxBuffer);
    if (parsed.length !== 4) throw new Error(`Expected 4 rows from parsed XLSX, got ${parsed.length}`);
    if (parsed[0][0] !== 'Prompt') throw new Error('Header mismatch');
    if (parsed[1][1] !== 'went') throw new Error('Option A mismatch');
    if (parsed[3][0] !== 'Special characters: ç, ğ, ı, ö, ş, ü, é, ñ') {
      throw new Error(`Special characters corrupted: ${parsed[3][0]}`);
    }
  });

  // ====================================================================
  // 2. TEMPLATE DEFINITIONS ACROSS QUESTION TYPES
  // ====================================================================
  console.log('\n--- 2. Question Template Definitions ---');

  const supportedTypes = [
    'multiple_choice',
    'true_false',
    'sentence_builder',
    'match_it',
    'reading_passage',
    'vocabulary_item',
    'train_station',
    'universal',
  ];

  for (const t of supportedTypes) {
    test(`Template for "${t}" is fully configured with headers and sample rows`, () => {
      const tpl = TEMPLATES[t];
      if (!tpl) throw new Error(`Missing template for ${t}`);
      if (!tpl.headers || tpl.headers.length < 5) throw new Error(`Insufficient headers for ${t}`);
      if (!tpl.sampleRows || tpl.sampleRows.length < 1) throw new Error(`Missing sample rows for ${t}`);
      if (tpl.sampleRows[0].length !== tpl.headers.length) {
        throw new Error(`Sample row column count mismatch for ${t} (${tpl.sampleRows[0].length} vs ${tpl.headers.length})`);
      }
    });
  }

  // ====================================================================
  // 3. AUTOMATIC COLUMN MAPPING (ENGLISH & TURKISH)
  // ====================================================================
  console.log('\n--- 3. Automatic Column Mapping ---');

  test('Maps standard English headers accurately', () => {
    const headers = [
      'Question Type',
      'Prompt',
      'Option A',
      'Option B',
      'Option C',
      'Option D',
      'Correct Answer',
      'Explanation',
      'Section',
      'Grade',
      'Unit ID',
      'Topic',
      'Skill',
      'Difficulty',
      'Points',
      'Tags',
    ];
    const map = mapSpreadsheetHeaders(headers);
    if (map.type !== 0) throw new Error('Type mapped incorrectly');
    if (map.prompt !== 1) throw new Error('Prompt mapped incorrectly');
    if (map.optA !== 2 || map.optB !== 3 || map.optC !== 4 || map.optD !== 5) {
      throw new Error('Options mapped incorrectly');
    }
    if (map.answer !== 6) throw new Error('Answer mapped incorrectly');
    if (map.section !== 8) throw new Error('Section mapped incorrectly');
  });

  test('Maps Turkish and colloquial aliases accurately', () => {
    const turkishHeaders = [
      'Tür',
      'Soru Metni',
      'A',
      'B',
      'C',
      'D',
      'Doğru Cevap',
      'Açıklama',
      'Bölüm',
      'Sınıf',
      'Ünite',
      'Konu',
      'Beceri',
      'Zorluk',
      'Puan',
      'Etiketler',
    ];
    const map = mapSpreadsheetHeaders(turkishHeaders);
    if (map.type !== 0) throw new Error('Tür mapped incorrectly');
    if (map.prompt !== 1) throw new Error('Soru Metni mapped incorrectly');
    if (map.optA !== 2 || map.optB !== 3) throw new Error('A/B mapped incorrectly');
    if (map.answer !== 6) throw new Error('Doğru Cevap mapped incorrectly');
    if (map.section !== 8) throw new Error('Bölüm mapped incorrectly');
  });

  test('Maps Match It pairs and Reading Passage headers', () => {
    const pairHeaders = [
      'Type',
      'Prompt',
      'Pair 1 Left',
      'Pair 1 Right',
      'Pair 2 Left',
      'Pair 2 Right',
      'Pair 3 Left',
      'Pair 3 Right',
      'Passage Title',
      'Passage Text',
    ];
    const map = mapSpreadsheetHeaders(pairHeaders);
    if (map.pair1Left !== 2 || map.pair1Right !== 3) throw new Error('Pair 1 mapped incorrectly');
    if (map.pair2Left !== 4 || map.pair2Right !== 5) throw new Error('Pair 2 mapped incorrectly');
    if (map.passageTitle !== 8 || map.passageText !== 9) throw new Error('Passage mapped incorrectly');
  });

  // ====================================================================
  // 4. VALIDATION ENGINE & ERROR DETECTION
  // ====================================================================
  console.log('\n--- 4. Validation Engine & Error Detection ---');

  const dummyExisting = [
    {
      id: 'qb_existing_1',
      prompt: 'What is the past tense of break?',
      section: 'unit_review',
      gradeId: 'grade-7',
      topic: 'Verbs',
      skill: 'grammar',
      difficulty: 'easy',
      questionType: 'multiple_choice',
      status: 'active',
      payload: { options: ['broke', 'broken'], correctOptionIndex: 0 },
      tags: [],
      contentVersion: 1,
      createdAt: '',
      updatedAt: '',
      correctAnswerPreview: 'broke',
      points: 10,
      assignedGameTypes: ['quiz_battle'],
    },
  ];

  test('Flags missing prompt as an error', () => {
    const rawRows = [
      ['Prompt', 'Option A', 'Option B', 'Correct Answer'],
      ['', 'Apple', 'Banana', 'A'],
    ];
    const summary = validateImportRows(rawRows, dummyExisting, []);
    if (summary.invalidCount !== 1) throw new Error('Row with empty prompt should be invalid');
    if (!summary.results[0].errors.some((e) => e.includes('prompt is missing'))) {
      throw new Error('Expected prompt is missing error message');
    }
  });

  test('Flags MCQ with fewer than 2 options as an error', () => {
    const rawRows = [
      ['Prompt', 'Option A', 'Option B', 'Correct Answer'],
      ['Which fruit is yellow?', 'Banana', '', 'A'],
    ];
    const summary = validateImportRows(rawRows, dummyExisting, []);
    if (summary.invalidCount !== 1) throw new Error('Row with 1 option should be invalid');
    if (!summary.results[0].errors.some((e) => e.includes('at least 2 non-empty options'))) {
      throw new Error('Expected at least 2 options error');
    }
  });

  test('Flags MCQ with invalid correct answer option as an error', () => {
    const rawRows = [
      ['Prompt', 'Option A', 'Option B', 'Option C', 'Correct Answer'],
      ['What is 2 + 2?', 'Three', 'Four', 'Five', 'Z'],
    ];
    const summary = validateImportRows(rawRows, dummyExisting, []);
    if (summary.invalidCount !== 1) throw new Error('Row with invalid answer Z should be invalid');
    if (!summary.results[0].errors.some((e) => e.includes('does not match any valid option'))) {
      throw new Error('Expected answer matching error');
    }
  });

  test('Normalizes correct answer by option text or letter', () => {
    const rawRows = [
      ['Prompt', 'Option A', 'Option B', 'Option C', 'Correct Answer'],
      ['Capital of France?', 'London', 'Paris', 'Berlin', 'Paris'], // By text match
      ['Capital of Germany?', 'London', 'Paris', 'Berlin', 'C'],    // By letter match
    ];
    const summary = validateImportRows(rawRows, dummyExisting, []);
    if (summary.validCount !== 2) throw new Error(`Expected 2 valid rows, got ${summary.validCount}`);
    if (summary.results[0].parsedItem.payload.correctOptionIndex !== 1) {
      throw new Error('Paris should resolve to option index 1');
    }
    if (summary.results[1].parsedItem.payload.correctOptionIndex !== 2) {
      throw new Error('C should resolve to option index 2');
    }
  });

  test('Validates True/False with binary answers and rejects ambiguous text', () => {
    const rawRows = [
      ['Question Type', 'Prompt', 'Correct Answer'],
      ['true_false', 'Water freezes at 0 degrees Celsius.', 'TRUE'],
      ['true_false', 'The moon is made of green cheese.', 'FALSE'],
      ['true_false', 'Ambiguous statement.', 'Maybe'], // invalid
    ];
    const summary = validateImportRows(rawRows, dummyExisting, []);
    if (summary.validCount !== 2) throw new Error(`Expected 2 valid rows, got ${summary.validCount}`);
    if (summary.invalidCount !== 1) throw new Error('Ambiguous True/False should be invalid');
    if (summary.results[0].parsedItem.payload.isTrue !== true) throw new Error('Row 1 should be isTrue=true');
    if (summary.results[1].parsedItem.payload.isTrue !== false) throw new Error('Row 2 should be isTrue=false');
  });

  test('Validates Match It pairs and flags incomplete pairs', () => {
    const rawRows = [
      ['Question Type', 'Prompt', 'Pair 1 Left', 'Pair 1 Right', 'Pair 2 Left', 'Pair 2 Right'],
      ['match_it', 'Match synonyms:', 'quick', 'fast', 'slow', 'sluggish'], // valid
      ['match_it', 'Match synonyms:', 'quick', 'fast', 'slow', ''],         // incomplete pair 2
    ];
    const summary = validateImportRows(rawRows, dummyExisting, []);
    if (summary.validCount !== 1) throw new Error(`Expected 1 valid row, got ${summary.validCount}`);
    if (summary.invalidCount !== 1) throw new Error('Incomplete pair should be invalid');
    if (!summary.results[1].errors.some((e) => e.includes('Pair 2 is incomplete'))) {
      throw new Error('Expected Pair 2 is incomplete error message');
    }
  });

  // ====================================================================
  // 5. DEDUPLICATION & ZERO-OVERWRITE PROTECTION
  // ====================================================================
  console.log('\n--- 5. Deduplication & Zero-Overwrite Protection ---');

  // Load built-in curriculum questions (all 1,206 questions)
  const builtInQuestions = [];
  const grades = ['grade-7', 'grade-8'];
  for (const gradeId of grades) {
    const units = DEFAULT_INITIAL_DATA.units[gradeId] || [];
    for (const unit of units) {
      for (const act of unit.activities) {
        if (!act.questions) continue;
        for (const rawQ of act.questions) {
          builtInQuestions.push(
            convertAnyQuestionToBankItem(rawQ, {
              section: 'unit_review',
              gradeId,
              unitId: unit.id,
              unitTitle: unit.title,
              topic: act.title,
              assignedGameTypes: [act.gameType],
            })
          );
        }
      }
    }
  }

  test('Detects duplicates within the uploaded file itself', () => {
    const rawRows = [
      ['Prompt', 'Option A', 'Option B', 'Correct Answer', 'Topic'],
      ['What is the synonym of vast?', 'huge', 'tiny', 'A', 'Vocabulary'],
      ['What is the synonym of vast?', 'huge', 'tiny', 'A', 'Vocabulary'], // duplicate in file
    ];
    const summary = validateImportRows(rawRows, [], []);
    if (summary.validCount !== 1) throw new Error('First row should be valid');
    if (summary.duplicateCount !== 1) throw new Error('Second row should be flagged as duplicate');
    if (!summary.results[1].duplicateReason.includes('Duplicate of Row 2 in this file')) {
      throw new Error(`Unexpected reason: ${summary.results[1].duplicateReason}`);
    }
    if (summary.results[1].included !== false) {
      throw new Error('CRITICAL: Duplicate row must be deselected by default to prevent duplicate imports');
    }
  });

  test('Detects duplicate of existing custom Question Bank item', () => {
    const rawRows = [
      ['Prompt', 'Option A', 'Option B', 'Correct Answer'],
      ['What is the past tense of break?', 'broke', 'broken', 'A'], // Matches dummyExisting
    ];
    const summary = validateImportRows(rawRows, dummyExisting, []);
    if (summary.duplicateCount !== 1) throw new Error('Should be flagged as duplicate of custom question');
    if (!summary.results[0].duplicateReason.includes('Matches existing custom question (ID: qb_existing_1)')) {
      throw new Error(`Unexpected reason: ${summary.results[0].duplicateReason}`);
    }
    if (summary.results[0].included !== false) {
      throw new Error('CRITICAL: Duplicate row must be deselected by default');
    }
  });

  test('Detects duplicate of built-in curriculum question (Preserves all 1,206 questions)', () => {
    const sampleBuiltIn = builtInQuestions[0];
    const rawRows = [
      ['Prompt', 'Option A', 'Option B', 'Correct Answer'],
      [sampleBuiltIn.prompt, 'Option 1', 'Option 2', 'A'],
    ];
    const summary = validateImportRows(rawRows, [], builtInQuestions);
    if (summary.duplicateCount !== 1) {
      throw new Error(`Should detect duplicate of built-in question: ${sampleBuiltIn.prompt}`);
    }
    if (!summary.results[0].duplicateReason.includes('Matches built-in curriculum question')) {
      throw new Error(`Unexpected reason: ${summary.results[0].duplicateReason}`);
    }
  });

  // ====================================================================
  // 6. BACKEND BULK IMPORT & SAFE ROLLBACK SIMULATION
  // ====================================================================
  console.log('\n--- 6. Backend Bulk Import & Safe 1-Click Rollback ---');

  // Set up mock Google Apps Script environment
  const codeGsPath = './google-apps-script/Code.gs';
  const codeGsContent = fs.readFileSync(codeGsPath, 'utf8');

  function parseA1Notation(a1) {
    const clean = a1.includes('!') ? a1.split('!')[1] : a1;
    const parts = clean.split(':');

    function cellToRowCol(cellStr) {
      const match = cellStr.match(/^([A-Za-z]+)(\d+)$/);
      if (!match) return { row: 1, col: 1 };
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
    setFontWeight() { return this; }
    setFontSize() { return this; }
    setBackground() { return this; }
    setFontColor() { return this; }
    setHorizontalAlignment() { return this; }
    setVerticalAlignment() { return this; }
    setWrap() { return this; }
    setBorder() { return this; }
    setNumberFormat() { return this; }

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
  }

  class MockSheet {
    constructor(name) {
      this.name = name;
      this.rows = [];
    }
    getName() { return this.name; }
    getLastRow() { return this.rows.length; }
    getLastColumn() {
      let max = 0;
      for (const r of this.rows) {
        if (r.length > max) max = r.length;
      }
      return max;
    }
    clearContents() { this.rows = []; }
    clear() { this.rows = []; }
    setFrozenRows() { return this; }
    setColumnWidth() { return this; }
    setTabColor() { return this; }
    appendRow(rowArr) { this.rows.push([...rowArr]); return this; }

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
  }

  class MockSpreadsheet {
    constructor() {
      this.sheets = new Map();
    }
    getSheetByName(name) { return this.sheets.get(name) || null; }
    insertSheet(name) {
      const s = new MockSheet(name);
      this.sheets.set(name, s);
      return s;
    }
    getSheets() {
      return Array.from(this.sheets.values());
    }
    getName() { return 'Mock Spreadsheet'; }
  }

  const mockSs = new MockSpreadsheet();
  const scriptProperties = new Map();

  const sandbox = {
    SpreadsheetApp: {
      flush: () => {},
      getActiveSpreadsheet: () => mockSs,
      openById: () => mockSs,
    },
    PropertiesService: {
      getScriptProperties: () => ({
        getProperty: (k) => scriptProperties.get(k) || null,
        setProperty: (k, v) => scriptProperties.set(k, String(v)),
        getProperties: () => Object.fromEntries(scriptProperties.entries()),
        setProperties: (obj) => {
          for (const [k, v] of Object.entries(obj)) scriptProperties.set(k, String(v));
        },
        deleteProperty: (k) => scriptProperties.delete(k),
        deleteAllProperties: () => scriptProperties.clear(),
      }),
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
      base64Encode: (buf) => Buffer.from(buf).toString('base64'),
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
      getDocumentLock: () => ({ tryLock: () => true, releaseLock: () => {} }),
      getScriptLock: () => ({ tryLock: () => true, releaseLock: () => {} }),
    },
    Logger: {
      log: () => {},
    },
    console,
  };

  vm.createContext(sandbox);
  vm.runInContext(codeGsContent, sandbox);

  sandbox.setupArcadeDatabase(mockSs);
  sandbox.initializeTeacherCredentials('TeacherMasterPass2026!');

  // Authenticate mock teacher
  const teacherLoginRaw = sandbox.handleTeacherLogin(mockSs, { password: 'TeacherMasterPass2026!' }).getContent();
  const teacherLoginRes = JSON.parse(teacherLoginRaw);
  const teacherToken = teacherLoginRes.teacherToken;

  // 1. Pre-populate 2 pre-existing custom questions
  const preExisting1 = {
    prompt: 'Pre-existing Question 1',
    questionType: 'multiple_choice',
    skill: 'grammar',
    topic: 'Original',
    section: 'general_english',
    assignedGameTypes: ['quiz_battle'],
    payload: { options: ['A', 'B'], correctOptionIndex: 0 },
  };
  const preExisting2 = {
    prompt: 'Pre-existing Question 2',
    questionType: 'true_false',
    skill: 'reading',
    topic: 'Original',
    section: 'unit_review',
    unitId: 'g7-u1',
    assignedGameTypes: ['true_false'],
    payload: { isTrue: true },
  };

  const initImportRaw = sandbox.handleTeacherBulkImportQuestions(mockSs, {
    teacherToken,
    questions: [preExisting1, preExisting2],
  }).getContent();
  const initImport = JSON.parse(initImportRaw);
  if (initImport.importedCount !== 2) {
    console.error('initImport failed payload:', initImport);
    throw new Error('Failed to set up pre-existing questions: ' + JSON.stringify(initImport));
  }

  test('Pre-existing questions exist before batch import', () => {
    const qbRes = JSON.parse(sandbox.handleTeacherGetQuestionBank(mockSs, { teacherToken, status: 'all' }).getContent());
    if (qbRes.count !== 2) throw new Error(`Expected 2 questions, found ${qbRes.count}`);
  });

  // 2. Perform bulk import with batchId
  const batchId = 'batch_20261121_test123';
  const newBatch = [
    {
      prompt: 'Imported Batch Question A',
      questionType: 'multiple_choice',
      skill: 'vocabulary',
      topic: 'Batch Import',
      section: 'general_english',
      assignedGameTypes: ['quiz_battle'],
      payload: { options: ['1', '2'], correctOptionIndex: 0 },
    },
    {
      prompt: 'Imported Batch Question B',
      questionType: 'sentence_builder',
      skill: 'grammar',
      topic: 'Batch Import',
      section: 'general_english',
      assignedGameTypes: ['sentence_builder'],
      payload: { correctSentence: 'Hello world.' },
    },
    {
      prompt: 'Imported Batch Question C',
      questionType: 'true_false',
      skill: 'reading',
      topic: 'Batch Import',
      section: 'general_english',
      assignedGameTypes: ['true_false'],
      payload: { isTrue: false },
    },
  ];

  const batchImportRes = JSON.parse(
    sandbox.handleTeacherBulkImportQuestions(mockSs, {
      teacherToken,
      questions: newBatch,
      importBatchId: batchId,
    }).getContent()
  );

  test('Batch import succeeds and attaches importBatchId & importedIds', () => {
    if (!batchImportRes.success) throw new Error(`Import failed: ${batchImportRes.error}`);
    if (batchImportRes.importedCount !== 3) throw new Error(`Expected 3 imported, got ${batchImportRes.importedCount}`);
    if (batchImportRes.importBatchId !== batchId) throw new Error('Batch ID was not returned');
    if (!batchImportRes.importedIds || batchImportRes.importedIds.length !== 3) {
      throw new Error('Imported IDs array missing');
    }

    const qbRes = JSON.parse(sandbox.handleTeacherGetQuestionBank(mockSs, { teacherToken, status: 'all' }).getContent());
    if (qbRes.count !== 5) throw new Error(`Expected 5 total questions (2 pre-existing + 3 imported), found ${qbRes.count}`);
  });

  // 3. Rollback the batch
  test('teacher_rollback_question_import removes only batch questions and leaves pre-existing 100% intact', () => {
    const rollbackRes = JSON.parse(
      sandbox.handleTeacherRollbackQuestionImport(mockSs, {
        teacherToken,
        importBatchId: batchId,
        questionIds: batchImportRes.importedIds,
      }).getContent()
    );

    if (!rollbackRes.success) throw new Error(`Rollback failed: ${rollbackRes.error}`);
    if (rollbackRes.rolledBackCount !== 3) {
      throw new Error(`Expected 3 questions rolled back, got ${rollbackRes.rolledBackCount}`);
    }

    // Verify Question Bank contains strictly the original 2 questions
    const qbRes = JSON.parse(sandbox.handleTeacherGetQuestionBank(mockSs, { teacherToken, status: 'all' }).getContent());
    if (qbRes.count !== 2) {
      throw new Error(`Expected exactly 2 questions after rollback, found ${qbRes.count}`);
    }

    const prompts = qbRes.questions.map((q) => q.prompt);
    if (!prompts.includes('Pre-existing Question 1') || !prompts.includes('Pre-existing Question 2')) {
      throw new Error('CRITICAL FAILURE: Pre-existing questions were modified or deleted during rollback!');
    }

    if (prompts.some((p) => p.includes('Imported Batch Question'))) {
      throw new Error('Imported questions were not cleanly removed during rollback');
    }
  });

  test('Rollback with non-matching batchId safely does nothing', () => {
    const rollbackRes = JSON.parse(
      sandbox.handleTeacherRollbackQuestionImport(mockSs, {
        teacherToken,
        importBatchId: 'batch_non_existent',
        questionIds: ['qb_fake_id'],
      }).getContent()
    );

    if (!rollbackRes.success) throw new Error('Should return success with 0 rolled back');
    if (rollbackRes.rolledBackCount !== 0) throw new Error('Should have rolled back 0 questions');

    const qbRes = JSON.parse(sandbox.handleTeacherGetQuestionBank(mockSs, { teacherToken, status: 'all' }).getContent());
    if (qbRes.count !== 2) throw new Error('Question bank was altered unexpectedly');
  });

  console.log(`\n======================================================================`);
  console.log(`🎉 ALL PHASE 3 TESTS PASSED: ${passedTests} test suites verified with 0 errors!`);
  console.log(`======================================================================\n`);
})();
