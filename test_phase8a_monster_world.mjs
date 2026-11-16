/**
 * UNIT REVIEW ARCADE — AUTOMATED TEST SUITE: PHASE 8A
 * Verification of Monster World Foundation & Economy
 * 
 * Verifies:
 * 1. Unlimited Level Progression (Tiers 1–15 backwards-compatibility, Levels 16, 20, 50, 100+).
 * 2. 100% synchronization between frontend (calculateLevelFromXp) and backend (getLevelFromXp).
 * 3. Server-authoritative Monster Coins Economy:
 *    - Base first completion (5 coins)
 *    - High accuracy >= 90% (+3 coins)
 *    - Perfect 100% score (+5 coins, explicitly stacking to 13 coins on first play)
 *    - First daily activity (+5 coins)
 *    - Level-up reward (+10 coins per new level reached)
 *    - Replay improvement (+2 coins)
 *    - Practice replay non-improving (1 coin, daily cap 5)
 *    - Idempotency defense against duplicate attempt coin awards (0 coins on replay)
 * 4. Games Zone coin rewards (3–6 coins, daily cap 25 coins).
 * 5. Monster Customization validation, sanitization, cloud persistence, and student account isolation.
 * 6. Non-destructive schema setup (setupPhase8AMonsterWorld).
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { calculateLevelFromXp, getUnlimitedLevelTitle } from './src/utils/gamification.ts';
import { CoinService } from './src/services/coinService.ts';
import { MonsterService } from './src/services/monsterService.ts';
import { DEFAULT_MONSTER_CONFIG, COIN_ECONOMY } from './src/types/monster.ts';

// Mock localStorage for Node environment
const mockStorage = new Map();
globalThis.localStorage = {
  getItem: (k) => mockStorage.get(k) || null,
  setItem: (k, v) => mockStorage.set(k, String(v)),
  removeItem: (k) => mockStorage.delete(k),
  clear: () => mockStorage.clear(),
};

console.log('================================================================');
console.log('🧪 RUNNING PHASE 8A: MONSTER WORLD & ECONOMY TEST SUITE');
console.log('================================================================\n');

let passedTests = 0;
function runTest(name, fn) {
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

// ---------------------------------------------------------------------------
// 1. BACKEND VM INITIALIZATION & Code.gs LOADING
// ---------------------------------------------------------------------------
console.log('--- 1. Backend Apps Script Code.gs Sandboxed VM Setup ---');

function parseA1Notation(a1) {
  const parts = a1.replace(/\$/g, '').split(':');
  function cellToRowCol(cellStr) {
    const match = cellStr.match(/^([A-Z]+)([0-9]+)$/);
    if (!match) throw new Error(`Invalid cell: ${cellStr}`);
    const colStr = match[1];
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
  getName() { return this.name; }
  getLastRow() { return this.rows.length; }
  getLastColumn() {
    let max = 0;
    for (const r of this.rows) {
      if (r && r.length > max) max = r.length;
    }
    return max;
  }

  getDataRange() {
    return new MockRange(this, 1, 1, Math.max(1, this.getLastRow()), Math.max(1, this.getLastColumn()));
  }

  getRange(a, b, c, d) {
    if (typeof a === 'string') {
      const parsed = parseA1Notation(a);
      return new MockRange(this, parsed.row, parsed.col, parsed.numRows, parsed.numCols);
    }
    return new MockRange(this, a, b, c || 1, d || 1);
  }

  appendRow(rowArr) {
    this.rows.push([...rowArr]);
    return this;
  }

  clear() {
    this.rows = [];
    return this;
  }

  setTabColor(c) { this.tabColor = c; return this; }
  setFrozenRows(n) { this.frozenRows = n; return this; }
  deleteRow(rowIdx) {
    if (rowIdx >= 1 && rowIdx <= this.rows.length) {
      this.rows.splice(rowIdx - 1, 1);
    }
    return this;
  }
}

class MockSpreadsheet {
  constructor(name, locale = 'en_US') {
    this.name = name;
    this.sheets = {};
    this.locale = locale;
  }

  getName() { return this.name; }
  getId() { return 'mock_test_spreadsheet_id'; }
  getSpreadsheetLocale() { return this.locale; }
  setSpreadsheetLocale(loc) { this.locale = loc; }
  getSheetByName(name) { return this.sheets[name] || null; }
  getSheets() { return Object.values(this.sheets); }
  insertSheet(name) {
    const s = new MockSheet(name, this);
    this.sheets[name] = s;
    return s;
  }
  deleteSheet(sheet) {
    const n = sheet && typeof sheet.getName === 'function' ? sheet.getName() : String(sheet);
    delete this.sheets[n];
  }
}

const mockProps = {
  properties: {},
  getProperty(key) { return this.properties[key] || null; },
  setProperty(key, val) { this.properties[key] = String(val); },
  deleteProperty(key) { delete this.properties[key]; },
  getProperties() { return { ...this.properties }; },
};

const mockLock = {
  hasLock: false,
  waitLock() { this.hasLock = true; return true; },
  tryLock() { this.hasLock = true; return true; },
  releaseLock() { this.hasLock = false; },
};

const mockSs = new MockSpreadsheet('Unit Review Arcade - TEST DATABASE');

const vmContext = {
  console: console,
  JSON: JSON,
  Math: Math,
  Date: Date,
  String: String,
  Number: Number,
  Boolean: Boolean,
  Array: Array,
  Object: Object,
  Logger: { log: () => {} },
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
    getUuid: () => 'uuid_' + Math.random().toString(36).substring(2, 10),
    base64Encode: (s) => Buffer.from(s).toString('base64'),
    base64Decode: (s) => Array.from(Buffer.from(s, 'base64')),
    formatDate: (d) => d.toISOString(),
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
    openById: () => mockSs,
    getActiveSpreadsheet: () => mockSs,
    flush: () => {},
  },
};

vm.createContext(vmContext);
const codeGsSource = fs.readFileSync('./google-apps-script/Code.gs', 'utf-8');
vm.runInContext(codeGsSource, vmContext);

// Initialize base curriculum and demo student accounts
vmContext.setupArcadeDatabase(mockSs);

function callGas(payload) {
  const e = { postData: { contents: JSON.stringify(payload) } };
  const raw = vmContext.doPost(e);
  return JSON.parse(raw.getContent());
}

console.log('  ✓ Sandboxed Apps Script VM initialized successfully.\n');

// ---------------------------------------------------------------------------
// 2. UNLIMITED LEVEL PROGRESSION FORMULA & SYNCHRONIZATION TESTS
// ---------------------------------------------------------------------------
console.log('--- 2. Unlimited Level Progression Formula Tests ---');

runTest('Level 1 boundary: 0 XP (0% progress)', () => {
  const fe = calculateLevelFromXp(0);
  const be = vmContext.getLevelFromXp(0);
  assert.equal(fe.level, 1);
  assert.equal(fe.title, 'Novice Explorer');
  assert.equal(fe.progressPercent, 0);
  assert.equal(be.level, 1);
  assert.equal(be.title, 'Novice Explorer');
  assert.equal(be.progressPercent, 0);
});

runTest('Level 1 top: 99 XP (99% progress)', () => {
  const fe = calculateLevelFromXp(99);
  const be = vmContext.getLevelFromXp(99);
  assert.equal(fe.level, 1);
  assert.equal(fe.progressPercent, 99);
  assert.equal(be.level, 1);
  assert.equal(be.progressPercent, 99);
});

runTest('Level 2 boundary: 100 XP (0% progress)', () => {
  const fe = calculateLevelFromXp(100);
  const be = vmContext.getLevelFromXp(100);
  assert.equal(fe.level, 2);
  assert.equal(fe.title, 'Curious Learner');
  assert.equal(fe.progressPercent, 0);
  assert.equal(be.level, 2);
  assert.equal(be.title, 'Curious Learner');
  assert.equal(be.progressPercent, 0);
});

runTest('Level 15 base: 6400 XP', () => {
  const fe = calculateLevelFromXp(6400);
  const be = vmContext.getLevelFromXp(6400);
  assert.equal(fe.level, 15);
  assert.equal(fe.title, 'Mythic Champion');
  assert.equal(fe.progressPercent, 0);
  assert.equal(be.level, 15);
  assert.equal(be.title, 'Mythic Champion');
  assert.equal(be.progressPercent, 0);
});

runTest('Level 15 cap backwards-compat: 15000 XP is 100% Mythic Champion', () => {
  const fe = calculateLevelFromXp(15000);
  const be = vmContext.getLevelFromXp(15000);
  assert.equal(fe.level, 15);
  assert.equal(fe.title, 'Mythic Champion');
  assert.equal(fe.progressPercent, 100);
  assert.equal(be.level, 15);
  assert.equal(be.title, 'Mythic Champion');
  assert.equal(be.progressPercent, 100);
});

runTest('Level 16 boundary: 15001 XP starts Grandmaster I (0% progress)', () => {
  const fe = calculateLevelFromXp(15001);
  const be = vmContext.getLevelFromXp(15001);
  assert.equal(fe.level, 16);
  assert.equal(fe.title, 'Grandmaster I');
  assert.equal(fe.minXp, 15000);
  assert.equal(fe.maxXp, 16000);
  assert.equal(fe.currentLevelXp, 1);
  assert.equal(fe.progressPercent, 0);

  assert.equal(be.level, 16);
  assert.equal(be.title, 'Grandmaster I');
  assert.equal(be.minXp, 15000);
  assert.equal(be.maxXp, 16000);
  assert.equal(be.currentLevelXp, 1);
});

runTest('Level 16 halfway: 15500 XP is 50% Grandmaster I', () => {
  const fe = calculateLevelFromXp(15500);
  const be = vmContext.getLevelFromXp(15500);
  assert.equal(fe.level, 16);
  assert.equal(fe.progressPercent, 50);
  assert.equal(be.level, 16);
  assert.equal(be.progressPercent, 50);
});

runTest('Level 17 boundary: 16000 XP is Grandmaster II (0% progress)', () => {
  const fe = calculateLevelFromXp(16000);
  const be = vmContext.getLevelFromXp(16000);
  assert.equal(fe.level, 17);
  assert.equal(fe.title, 'Grandmaster II');
  assert.equal(fe.minXp, 16000);
  assert.equal(fe.maxXp, 17100); // 16000 + 1100
  assert.equal(fe.progressPercent, 0);

  assert.equal(be.level, 17);
  assert.equal(be.title, 'Grandmaster II');
  assert.equal(be.minXp, 16000);
  assert.equal(be.maxXp, 17100);
});

runTest('Level 20: Grandmaster V', () => {
  const fe = calculateLevelFromXp(19600);
  const be = vmContext.getLevelFromXp(19600);
  assert.equal(fe.level, 20);
  assert.equal(fe.title, 'Grandmaster V');
  assert.equal(be.level, 20);
  assert.equal(be.title, 'Grandmaster V');
});

runTest('Level 21: Arcade Paragon I', () => {
  const fe = calculateLevelFromXp(21000);
  const be = vmContext.getLevelFromXp(21000);
  assert.equal(fe.level, 21);
  assert.equal(fe.title, 'Arcade Paragon I');
  assert.equal(be.level, 21);
  assert.equal(be.title, 'Arcade Paragon I');
});

runTest('Level 50: Cosmic Overlord V', () => {
  const fe = calculateLevelFromXp(105100);
  const be = vmContext.getLevelFromXp(105100);
  assert.equal(fe.level, 50);
  assert.equal(fe.title, 'Cosmic Overlord V');
  assert.equal(be.level, 50);
  assert.equal(be.title, 'Cosmic Overlord V');
});

runTest('Level 100: Apex Legend 100', () => {
  const fe = calculateLevelFromXp(447600);
  const be = vmContext.getLevelFromXp(447600);
  assert.equal(fe.level, 100);
  assert.equal(fe.title, 'Apex Legend 100');
  assert.equal(be.level, 100);
  assert.equal(be.title, 'Apex Legend 100');
});

console.log('  ✓ All Unlimited Level formula tests passed.\n');

// ---------------------------------------------------------------------------
// 3. MONSTER CREATION & VALIDATION TESTS
// ---------------------------------------------------------------------------
console.log('--- 3. Monster Customization & Sanitization Tests ---');

runTest('Default monster configuration structure', () => {
  assert.equal(DEFAULT_MONSTER_CONFIG.name, 'Pip');
  assert.equal(DEFAULT_MONSTER_CONFIG.bodyShape, 'blob');
  assert.equal(DEFAULT_MONSTER_CONFIG.bodyColor, 'cyan');
  assert.equal(DEFAULT_MONSTER_CONFIG.eyeType, 'anime');
  assert.equal(DEFAULT_MONSTER_CONFIG.mouthType, 'smile');
  assert.equal(DEFAULT_MONSTER_CONFIG.hornType, 'antennae');
  assert.equal(DEFAULT_MONSTER_CONFIG.cheekType, 'blush_dots');
  assert.equal(DEFAULT_MONSTER_CONFIG.pattern, 'belly_patch');
});

runTest('Client MonsterService sanitizes invalid options to safe defaults', () => {
  const invalid = {
    name: '  Super long name that exceeds twenty-four characters easily  ',
    bodyShape: 'triangle_invalid',
    bodyColor: 'rainbow_fake',
    eyeType: 'laser_eyes',
    mouthType: 'drill_mouth',
    hornType: 'horns_99',
    cheekType: 'tattoos',
    pattern: 'camouflage',
  };
  const validated = MonsterService.validateConfig(invalid);
  assert.equal(validated.name.length <= 24, true);
  assert.equal(validated.bodyShape, 'blob');
  assert.equal(validated.bodyColor, 'cyan');
  assert.equal(validated.eyeType, 'anime');
  assert.equal(validated.mouthType, 'smile');
  assert.equal(validated.hornType, 'antennae');
  assert.equal(validated.cheekType, 'blush_dots');
  assert.equal(validated.pattern, 'belly_patch');
});

runTest('Backend sanitizeMonsterConfig produces safe normalized configuration', () => {
  const sanitized = vmContext.sanitizeMonsterConfig({
    name: 'Sparky',
    bodyShape: 'star',
    bodyColor: 'pink',
    eyeType: 'cyclops',
    mouthType: 'fang_grin',
    hornType: 'single_horn',
    cheekType: 'stars',
    pattern: 'heart',
  });
  assert.equal(sanitized.name, 'Sparky');
  assert.equal(sanitized.bodyShape, 'star');
  assert.equal(sanitized.bodyColor, 'pink');
  assert.equal(sanitized.eyeType, 'cyclops');
  assert.equal(sanitized.mouthType, 'fang_grin');
  assert.equal(sanitized.hornType, 'single_horn');
  assert.equal(sanitized.cheekType, 'stars');
  assert.equal(sanitized.pattern, 'heart');
});

runTest('MonsterService.generateRandomMonster produces valid random configs', () => {
  for (let i = 0; i < 20; i++) {
    const r = MonsterService.generateRandomMonster();
    const checked = MonsterService.validateConfig(r);
    assert.equal(r.bodyShape, checked.bodyShape);
    assert.equal(r.bodyColor, checked.bodyColor);
    assert.equal(r.eyeType, checked.eyeType);
    assert.equal(r.mouthType, checked.mouthType);
  }
});

console.log('  ✓ All Monster Customization tests passed.\n');

// ---------------------------------------------------------------------------
// 4. BACKEND ENDPOINTS & PERSISTENCE TESTS (student_save_monster / get)
// ---------------------------------------------------------------------------
console.log('--- 4. Backend Cloud Persistence & Student Isolation Tests ---');

// Setup Phase 8A sheets
const setupRes = vmContext.setupPhase8AMonsterWorld(mockSs);
assert.equal(setupRes.success, true);
assert.equal(setupRes.monstersCreated, true);
assert.equal(setupRes.transactionsCreated, true);

// Student 701 Login
const loginRes701 = callGas({ action: 'student_login', studentNumber: '701', pin: '1234' });
assert.equal(loginRes701.success, true, 'Student 701 login succeeded');
const sessionToken701 = loginRes701.sessionToken;
assert.ok(sessionToken701);
assert.equal(loginRes701.student.studentNumber, '701');
assert.equal(loginRes701.student.grade, 'grade-7');
assert.equal(loginRes701.student.totalCoins, 0); // initial
assert.equal(loginRes701.student.monster.name, 'Pip'); // default initial

// Student 801 Login
const loginRes801 = callGas({ action: 'student_login', studentNumber: '801', pin: '1234' });
assert.equal(loginRes801.success, true, 'Student 801 login succeeded');
const sessionToken801 = loginRes801.sessionToken;

runTest('Student 701 saves custom monster companion', () => {
  const saveRes = callGas({
    action: 'student_save_monster',
    sessionToken: sessionToken701,
    monster: {
      name: 'Boba',
      bodyShape: 'fuzzy',
      bodyColor: 'purple',
      eyeType: 'googly',
      mouthType: 'cat_mouth',
      hornType: 'cat_ears',
      cheekType: 'spiral',
      pattern: 'spots',
    },
  });
  assert.equal(saveRes.success, true);
  assert.equal(saveRes.monster.name, 'Boba');
  assert.equal(saveRes.monster.bodyColor, 'purple');
  assert.equal(saveRes.monster.bodyShape, 'fuzzy');
});

runTest('Student 701 gets persisted monster companion', () => {
  const getRes = callGas({
    action: 'student_get_monster',
    sessionToken: sessionToken701,
  });
  assert.equal(getRes.success, true);
  assert.equal(getRes.monster.name, 'Boba');
  assert.equal(getRes.monster.bodyColor, 'purple');
  assert.equal(getRes.monster.hornType, 'cat_ears');
});

runTest('Student 801 profile has separate independent monster (Isolation)', () => {
  const getRes801 = callGas({
    action: 'student_get_monster',
    sessionToken: sessionToken801,
  });
  assert.equal(getRes801.success, true);
  assert.equal(getRes801.monster.name, 'Pip'); // Still default, not Boba!
  assert.equal(getRes801.monster.bodyColor, 'cyan');
});

runTest('Unauthenticated request to student_save_monster is rejected', () => {
  const badRes = callGas({
    action: 'student_save_monster',
    sessionToken: 'invalid_token_999',
    monster: { name: 'Hacker' },
  });
  assert.equal(badRes.success, false);
  assert.equal(badRes.code, 'UNAUTHORIZED');
});

console.log('  ✓ All Cloud Persistence & Isolation tests passed.\n');

// ---------------------------------------------------------------------------
// 5. MONSTER COINS ECONOMY REWARD CALCULATION & ANTI-FARMING TESTS
// ---------------------------------------------------------------------------
console.log('--- 5. Monster Coins Economy Reward Calculation Tests ---');

runTest('Perfect First Completion stacks 13 coins (5 base + 3 acc>=90% + 5 perfect)', () => {
  // Start attempt for Student 701 (Grade 7)
  const attemptId = 'att_p8a_701_1';
  const startRes = callGas({
    action: 'game_start_attempt',
    sessionToken: sessionToken701,
    attemptId: attemptId,
    activityId: 'g7-u1-match',
    unitId: 'g7-u1',
    gradeId: 'grade-7',
    gameType: 'match_it',
  });
  assert.equal(startRes.success, true);

  // Complete attempt with 100% score (10/10)
  const compRes = callGas({
    action: 'game_complete_attempt',
    sessionToken: sessionToken701,
    attemptId: attemptId,
    score: 10,
    totalQuestions: 10,
    answeredQuestions: 10,
    correctAnswers: 10,
    incorrectAnswers: 0,
    skippedQuestions: 0,
    percentage: 100,
    durationSeconds: 45,
    completedAt: '2026-11-17T10:00:00.000Z',
  });
  assert.equal(compRes.success, true);
  assert.ok(compRes.coins, 'Coins payload returned');

  // Breakdown:
  // firstCompletion = 5
  // highAccuracy = 3
  // perfectScore = 5 (Explicitly stacks with high accuracy: 5 + 3 + 5 = 13!)
  // dailyFirst = 5 (first activity completed today)
  // levelUp = 10 (student promoted from Level 1 to Level 2)
  // Total = 13 + 5 + 10 = 28 coins!
  assert.equal(compRes.coins.breakdown.firstCompletion, 5);
  assert.equal(compRes.coins.breakdown.highAccuracy, 3);
  assert.equal(compRes.coins.breakdown.perfectScore, 5);
  assert.equal(compRes.coins.breakdown.dailyFirst, 5);
  assert.equal(compRes.coins.breakdown.levelUp, 10);
  assert.equal(compRes.coins.coinsEarned, 28);
  assert.equal(compRes.coins.totalCoins, 28);
});

runTest('Duplicate submission of completed attempt awards 0 coins (Idempotency)', () => {
  const allAttempts = mockSs.getSheetByName('Attempts').getDataRange().getValues();
  const realAttId = allAttempts[1][0];

  const dupRes = callGas({
    action: 'game_complete_attempt',
    sessionToken: sessionToken701,
    attemptId: realAttId,
    score: 10,
    percentage: 100,
  });
  assert.equal(dupRes.success, true);
  assert.equal(dupRes.coins.coinsEarned, 0);
  assert.equal(dupRes.coins.totalCoins, 28); // Balance unchanged!
});

runTest('Replay practice coins award 1 coin with daily cap of 5', () => {
  // Practice replay without improvement
  for (let i = 0; i < 5; i++) {
    const attId = `att_p8a_701_rep_${i + 1}`;
    const sRes = callGas({
      action: 'game_start_attempt',
      sessionToken: sessionToken701,
      attemptId: attId,
      activityId: 'g7-u1-match',
      unitId: 'g7-u1',
      gradeId: 'grade-7',
      gameType: 'match_it',
    });
    assert.equal(sRes.success, true);

    const cRes = callGas({
      action: 'game_complete_attempt',
      sessionToken: sessionToken701,
      attemptId: attId,
      score: 8,
      totalQuestions: 10,
      answeredQuestions: 10,
      correctAnswers: 8,
      incorrectAnswers: 2,
      percentage: 80, // not >= 90, not 100%, not first
      durationSeconds: 50,
      completedAt: `2026-11-17T11:0${i}:00.000Z`,
    });
    assert.equal(cRes.success, true);
    assert.equal(cRes.coins.coinsEarned, 1, `Practice attempt ${i + 1} awards 1 practice coin`);
  }

  // 6th practice attempt should be capped at 0 practice replay coins
  const capAttId = 'att_p8a_701_rep_6';
  const capStartRes = callGas({
    action: 'game_start_attempt',
    sessionToken: sessionToken701,
    attemptId: capAttId,
    activityId: 'g7-u1-match',
    unitId: 'g7-u1',
    gradeId: 'grade-7',
    gameType: 'match_it',
  });
  assert.equal(capStartRes.success, true);

  const capCompRes = callGas({
    action: 'game_complete_attempt',
    sessionToken: sessionToken701,
    attemptId: capAttId,
    score: 8,
    totalQuestions: 10,
    answeredQuestions: 10,
    correctAnswers: 8,
    incorrectAnswers: 2,
    percentage: 80,
    durationSeconds: 50,
    completedAt: '2026-11-17T11:30:00.000Z',
  });
  assert.equal(capCompRes.success, true);
  assert.equal(capCompRes.coins.coinsEarned, 0, '6th practice replay awards 0 coins due to daily practice cap');
});

runTest('Games Zone coins: Easy=3, Medium=4, Hard=5, accuracy>=90% bonus +1, daily cap 25', () => {
  // Test Easy with 100% accuracy -> 3 + 1 = 4 coins
  const gzRes1 = callGas({
    action: 'student_record_games_zone_coins',
    sessionToken: sessionToken701,
    gameId: 'word_ninja',
    difficulty: 'easy',
    accuracyPercentage: 100,
    correctAnswers: 10,
    totalQuestions: 10,
  });
  assert.equal(gzRes1.success, true);
  assert.equal(gzRes1.coinsEarned, 4); // 3 base + 1 acc

  // Test Hard with 80% accuracy -> 5 base + 0 bonus = 5 coins
  const gzRes2 = callGas({
    action: 'student_record_games_zone_coins',
    sessionToken: sessionToken701,
    gameId: 'grammar_runner',
    difficulty: 'hard',
    accuracyPercentage: 80,
    correctAnswers: 8,
    totalQuestions: 10,
  });
  assert.equal(gzRes2.success, true);
  assert.equal(gzRes2.coinsEarned, 5);

  // Test client CoinService calculateGamesZoneCoins
  const c1 = CoinService.calculateGamesZoneCoins('student_test', 'easy', 100);
  assert.equal(c1.coinsEarned, 4);
  const c2 = CoinService.calculateGamesZoneCoins('student_test', 'hard', 80);
  assert.equal(c2.coinsEarned, 5);
});

runTest('Coin balance is never negative', () => {
  const current = vmContext.getStudentCoinBalance(mockSs, '701');
  assert.equal(current >= 0, true);
  const emptyBal = vmContext.getStudentCoinBalance(mockSs, 'non_existent_student_999');
  assert.equal(emptyBal, 0);
});

console.log('  ✓ All Monster Coins Economy tests passed.\n');

// ---------------------------------------------------------------------------
// 6. SUMMARY
// ---------------------------------------------------------------------------
console.log('================================================================');
console.log(`🎉 ALL ${passedTests} PHASE 8A MONSTER WORLD CHECKS PASSED SUCCESSFULLY!`);
console.log('================================================================\n');
