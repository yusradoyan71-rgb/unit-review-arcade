/**
 * UNIT REVIEW ARCADE — MONSTER COINS REWARDS & ECONOMY REGRESSION TEST SUITE
 * 
 * Verifies end-to-end Monster Coin awarding pipeline:
 * 1. Regular Activity Completion rewards (First completion, accuracy bonuses, daily first, level up)
 * 2. Replay & Anti-Farming rewards (Score improvement vs practice decay, daily practice cap)
 * 3. Games Zone rewards (Easy=3, Medium=4, Hard=5, accuracy bonus +1, daily cap 25)
 * 4. Idempotency & duplicate submission protection
 * 5. Server-authoritative bottom-up CoinTransactions ledger
 * 6. Student account isolation (Student 701 vs Student 801)
 * 7. Client CoinService & Context synchronization
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { CoinService } from './src/services/coinService.ts';
import { COIN_ECONOMY } from './src/types/monster.ts';

// Mock localStorage for Node environment
const mockStorage = new Map();
globalThis.localStorage = {
  getItem: (k) => mockStorage.get(k) || null,
  setItem: (k, v) => mockStorage.set(k, String(v)),
  removeItem: (k) => mockStorage.delete(k),
  clear: () => mockStorage.clear(),
};

console.log('================================================================');
console.log('🧪 RUNNING MONSTER COINS REWARDS & ECONOMY REGRESSION SUITE');
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
// 1. BACKEND SANDBOXED APPS SCRIPT VM SETUP
// ---------------------------------------------------------------------------
console.log('--- 1. Backend Sandboxed Apps Script Setup ---');

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
  setWrap() { return this; }
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

const mockSs = new MockSpreadsheet('Unit Review Arcade - TEST DB');

const vmContext = {
  console,
  JSON,
  Math,
  Date,
  String,
  Number,
  Boolean,
  Array,
  Object,
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

// Setup database & demo students
vmContext.setupArcadeDatabase(mockSs);

function callGas(payload) {
  const e = { postData: { contents: JSON.stringify(payload) } };
  const raw = vmContext.doPost(e);
  return JSON.parse(raw.getContent());
}

// Login student 801 (Grade 8) and student 701 (Grade 7)
const loginRes801 = callGas({
  action: 'student_login',
  studentNumber: '801',
  pin: '1234',
});
assert.equal(loginRes801.success, true, 'Student 801 login must succeed');
const token801 = loginRes801.sessionToken;

const loginRes701 = callGas({
  action: 'student_login',
  studentNumber: '701',
  pin: '1234',
});
assert.equal(loginRes701.success, true, 'Student 701 login must succeed');
const token701 = loginRes701.sessionToken;

runTest('Backend Sandboxed VM & Student 801/701 Sessions Initialized', () => {
  assert.ok(token801);
  assert.ok(token701);
  assert.equal(loginRes801.student.totalCoins, 0);
  assert.equal(loginRes701.student.totalCoins, 0);
});

let attSeq = 1;
function startAttempt(token, actId, gradeId = 'grade-8', unitId = 'g8-u2') {
  const attId = `att_seq_${Date.now()}_${attSeq++}`;
  const res = callGas({
    action: 'game_start_attempt',
    sessionToken: token,
    attemptId: attId,
    activityId: actId,
    gameType: 'word_match',
    gradeId: gradeId,
    unitId: unitId,
  });
  assert.equal(res.success, true, `Start attempt must succeed: ${res.error || ''}`);
  return attId;
}

// ---------------------------------------------------------------------------
// 2. CURRICULUM ACTIVITY COIN REWARDS (FIRST COMPLETION & BONUSES)
// ---------------------------------------------------------------------------
console.log('\n--- 2. Curriculum Activity Rewards (First Completion, Accuracy, Perfect, Daily) ---');

let attempt1Id = null;

runTest('Student 801 completes first activity with 100% accuracy', () => {
  // Start attempt for Grade 8 Unit 2 Activity 1
  attempt1Id = startAttempt(token801, 'g8-u2-act1', 'grade-8', 'g8-u2');

  // Complete attempt with 100% score (10 questions, 10 correct)
  const completeRes = callGas({
    action: 'game_complete_attempt',
    sessionToken: token801,
    attemptId: attempt1Id,
    activityId: 'g8-u2-act1',
    score: 10,
    totalQuestions: 10,
    answeredQuestions: 10,
    correctAnswers: 10,
    incorrectAnswers: 0,
    skippedQuestions: 0,
    percentage: 100,
    durationSeconds: 45,
  });

  assert.equal(completeRes.success, true);
  assert.ok(completeRes.coins, 'Response must include coins object');
  
  // Breakdown check:
  // First completion = +5
  // High accuracy (>= 90%) = +3
  // Perfect score (100%) = +5
  // Daily first activity = +5
  // Level up (XP 0 -> 100 triggers Level 1 to Level 2) = +10
  // Replay = 0
  // Total = 28 coins!
  assert.equal(completeRes.coins.breakdown.firstCompletion, 5, 'First completion must be 5');
  assert.equal(completeRes.coins.breakdown.highAccuracy, 3, 'High accuracy bonus must be 3');
  assert.equal(completeRes.coins.breakdown.perfectScore, 5, 'Perfect score bonus must be 5');
  assert.equal(completeRes.coins.breakdown.dailyFirst, 5, 'Daily first activity bonus must be 5');
  assert.equal(completeRes.coins.breakdown.levelUp, 10, 'Level up coins should be 10 (Level 1 -> 2)');
  assert.equal(completeRes.coins.coinsEarned, 28, 'Total coins earned must be 28');
  assert.equal(completeRes.coins.totalCoins, 28, 'Total coin balance must be 28');

  // Verify server-side CoinTransactions sheet
  const txSheet = mockSs.getSheetByName('CoinTransactions');
  assert.ok(txSheet);
  const rows = txSheet.rows;
  assert.equal(rows.length, 2, 'Headers + 1 transaction row'); // [headers, row1]
  const txRow = rows[1];
  assert.equal(txRow[1], '801', 'Student number in transaction must be 801');
  assert.equal(txRow[3], 28, 'Amount must be 28');
  assert.equal(txRow[4], 28, 'Balance after must be 28');
  assert.equal(txRow[6], attempt1Id, 'sourceId must match attemptId');
});

// ---------------------------------------------------------------------------
// 3. IDEMPOTENCY & DUPLICATE SUBMISSION PROTECTION
// ---------------------------------------------------------------------------
console.log('\n--- 3. Idempotency & Duplicate Submission Protection ---');

runTest('Duplicate submission of completed attempt awards 0 coins', () => {
  const duplicateRes = callGas({
    action: 'game_complete_attempt',
    sessionToken: token801,
    attemptId: attempt1Id,
    activityId: 'g8-u2-act1',
    score: 10,
    totalQuestions: 10,
    percentage: 100,
  });

  assert.equal(duplicateRes.success, true);
  assert.equal(duplicateRes.coins.coinsEarned, 0, 'Duplicate submission must award 0 coins');
  assert.equal(duplicateRes.coins.totalCoins, 28, 'Total balance must remain 28');
  
  // Verify CoinTransactions sheet has not grown
  const txSheet = mockSs.getSheetByName('CoinTransactions');
  assert.equal(txSheet.rows.length, 2, 'CoinTransactions row count must not increase on duplicate');
});

runTest('recordCoinTransaction idempotency check on same sourceId', () => {
  const result = vmContext.recordCoinTransaction(
    mockSs,
    '801',
    '8A',
    5,
    'activity_completion',
    attempt1Id // already recorded!
  );

  assert.equal(result.alreadyProcessed, true, 'Must flag alreadyProcessed');
  assert.equal(result.amount, 0, 'Duplicate amount must be 0');
  assert.equal(result.balanceAfter, 28, 'Balance must remain unchanged');
});

// ---------------------------------------------------------------------------
// 4. SUBSEQUENT ACTIVITY (DAILY FIRST BONUS NOT RE-AWARDED) & LEVEL UP
// ---------------------------------------------------------------------------
console.log('\n--- 4. Subsequent Activity on Same Day & Level Up Reward ---');

runTest('Second activity on same day does not grant daily first bonus', () => {
  const att2Id = startAttempt(token801, 'g8-u2-act2', 'grade-8', 'g8-u2');

  // Complete with 90% score (10 Qs, 9 correct)
  // XP: Existing 100 + (40 base + 15 acc = 55) = 155 XP -> Stays Level 2 (100 to 249 XP)
  const compRes2 = callGas({
    action: 'game_complete_attempt',
    sessionToken: token801,
    attemptId: att2Id,
    activityId: 'g8-u2-act2',
    score: 9,
    totalQuestions: 10,
    answeredQuestions: 10,
    correctAnswers: 9,
    incorrectAnswers: 1,
    skippedQuestions: 0,
    percentage: 90,
  });

  assert.equal(compRes2.success, true);
  // Coins breakdown:
  // First completion = +5
  // High accuracy (90%) = +3
  // Perfect score = 0
  // Daily first = 0 (already used today!)
  // Level up (stays Level 2) = 0
  // Replay = 0
  // Total = 5 + 3 = 8 coins!
  assert.equal(compRes2.coins.breakdown.firstCompletion, 5);
  assert.equal(compRes2.coins.breakdown.highAccuracy, 3);
  assert.equal(compRes2.coins.breakdown.perfectScore, 0);
  assert.equal(compRes2.coins.breakdown.dailyFirst, 0, 'Daily first must be 0 for second activity');
  assert.equal(compRes2.coins.breakdown.levelUp, 0, 'Level up should be 0 when staying in same level');
  assert.equal(compRes2.coins.coinsEarned, 8);
  assert.equal(compRes2.coins.totalCoins, 36, 'Balance must increase from 28 to 36');
});

// ---------------------------------------------------------------------------
// 5. REPLAY REWARDS & ANTI-FARMING RULES
// ---------------------------------------------------------------------------
console.log('\n--- 5. Replay Rules & Anti-Farming Caps ---');

runTest('Replay with improved score awards +2 replay coins', () => {
  // Student 801 re-attempts g8-u2-act2 (previous percentage was 90%)
  const att3Id = startAttempt(token801, 'g8-u2-act2', 'grade-8', 'g8-u2');

  // Now scores 100% (improved from 90%)
  const compRes3 = callGas({
    action: 'game_complete_attempt',
    sessionToken: token801,
    attemptId: att3Id,
    activityId: 'g8-u2-act2',
    score: 10,
    totalQuestions: 10,
    answeredQuestions: 10,
    correctAnswers: 10,
    incorrectAnswers: 0,
    skippedQuestions: 0,
    percentage: 100,
  });

  assert.equal(compRes3.success, true);
  // Breakdown for replay with improvement:
  // firstCompletion = 0
  // replay = 2 (improved)
  // levelUp = 10 (Total XP 217 + 48 = 265 XP crosses 250 XP threshold into Level 3)
  // Total = 12 coins!
  assert.equal(compRes3.coins.breakdown.firstCompletion, 0);
  assert.equal(compRes3.coins.breakdown.replay, 2, 'Replay improvement must award 2 coins');
  assert.equal(compRes3.coins.breakdown.levelUp, 10, 'Level up must award 10 coins (Level 2 -> 3)');
  assert.equal(compRes3.coins.coinsEarned, 12);
  assert.equal(compRes3.coins.totalCoins, 48, 'Balance must increase from 36 to 48');
});

runTest('Non-improving practice replay awards +1 coin (capped at 5 daily)', () => {
  // Perform 5 non-improving replays on g8-u2-act1 (best is already 100%)
  for (let p = 1; p <= 5; p++) {
    const attPId = startAttempt(token801, 'g8-u2-act1', 'grade-8', 'g8-u2');
    const compRes = callGas({
      action: 'game_complete_attempt',
      sessionToken: token801,
      attemptId: attPId,
      activityId: 'g8-u2-act1',
      score: 8,
      totalQuestions: 10,
      answeredQuestions: 10,
      correctAnswers: 8,
      incorrectAnswers: 2,
      percentage: 80,
    });
    assert.equal(compRes.coins.coinsEarned, 1, `Practice replay #${p} must award 1 coin`);
  }

  // 6th practice replay should be capped (0 coins)
  const att6Id = startAttempt(token801, 'g8-u2-act1', 'grade-8', 'g8-u2');
  const compRes6 = callGas({
    action: 'game_complete_attempt',
    sessionToken: token801,
    attemptId: att6Id,
    activityId: 'g8-u2-act1',
    score: 8,
    totalQuestions: 10,
    percentage: 80,
  });
  assert.equal(compRes6.coins.coinsEarned, 0, '6th practice replay must award 0 coins (daily cap of 5)');
  assert.equal(compRes6.coins.totalCoins, 53, 'Total balance must be 48 + 5 = 53');
});

// ---------------------------------------------------------------------------
// 6. GAMES ZONE COIN REWARDS & DAILY 25 COIN CAP
// ---------------------------------------------------------------------------
console.log('\n--- 6. Games Zone Coin Rewards & Daily Cap ---');

runTest('Games Zone completions: Easy=3, Medium=4, Hard=5 + accuracy bonus', () => {
  // Easy with 80% accuracy (< 90%): 3 coins
  const gz1 = callGas({
    action: 'student_record_games_zone_coins',
    sessionToken: token801,
    gameId: 'gz_ninja',
    difficulty: 'easy',
    correctAnswers: 5,
    accuracyPercentage: 80,
    attemptId: 'gz_att_1',
  });
  assert.equal(gz1.success, true);
  assert.equal(gz1.coinsEarned, 3, 'Easy without bonus = 3 coins');
  assert.equal(gz1.totalCoins, 56);

  // Medium with 95% accuracy (>= 90%): 4 base + 1 bonus = 5 coins
  const gz2 = callGas({
    action: 'student_record_games_zone_coins',
    sessionToken: token801,
    gameId: 'gz_runner',
    difficulty: 'medium',
    correctAnswers: 8,
    accuracyPercentage: 95,
    attemptId: 'gz_att_2',
  });
  assert.equal(gz2.success, true);
  assert.equal(gz2.coinsEarned, 5, 'Medium with bonus = 5 coins');
  assert.equal(gz2.totalCoins, 61);

  // Hard with 100% accuracy (>= 90%): 5 base + 1 bonus = 6 coins
  const gz3 = callGas({
    action: 'student_record_games_zone_coins',
    sessionToken: token801,
    gameId: 'gz_fishing',
    difficulty: 'hard',
    correctAnswers: 10,
    accuracyPercentage: 100,
    attemptId: 'gz_att_3',
  });
  assert.equal(gz3.success, true);
  assert.equal(gz3.coinsEarned, 6, 'Hard with bonus = 6 coins');
  assert.equal(gz3.totalCoins, 67);

  // Re-submission of gz_att_3 awards 0 coins (Idempotency)
  const gz3Dup = callGas({
    action: 'student_record_games_zone_coins',
    sessionToken: token801,
    gameId: 'gz_fishing',
    difficulty: 'hard',
    correctAnswers: 10,
    accuracyPercentage: 100,
    attemptId: 'gz_att_3',
  });
  assert.equal(gz3Dup.coinsEarned, 0, 'Duplicate Games Zone attemptId must award 0 coins');
  assert.equal(gz3Dup.totalCoins, 67);
});

runTest('Games Zone daily cap of 25 coins enforced', () => {
  // Current Games Zone earned today: 3 + 5 + 6 = 14 coins. Remaining cap: 25 - 14 = 11 coins.
  // Add 10 coins (2 x 5)
  const gz4 = callGas({
    action: 'student_record_games_zone_coins',
    sessionToken: token801,
    gameId: 'gz_tower',
    difficulty: 'medium',
    correctAnswers: 8,
    accuracyPercentage: 90, // 5 coins
    attemptId: 'gz_att_4',
  });
  assert.equal(gz4.coinsEarned, 5); // Total GZ today: 19

  const gz5 = callGas({
    action: 'student_record_games_zone_coins',
    sessionToken: token801,
    gameId: 'gz_tower',
    difficulty: 'medium',
    correctAnswers: 8,
    accuracyPercentage: 90, // 5 coins
    attemptId: 'gz_att_5',
  });
  assert.equal(gz5.coinsEarned, 5); // Total GZ today: 24

  // Next game earns 6 coins on Hard, but only 1 coin remaining under 25 cap!
  const gz6 = callGas({
    action: 'student_record_games_zone_coins',
    sessionToken: token801,
    gameId: 'gz_tower',
    difficulty: 'hard',
    correctAnswers: 10,
    accuracyPercentage: 100, // 6 coins potential
    attemptId: 'gz_att_6',
  });
  assert.equal(gz6.coinsEarned, 1, 'Award must be capped at remaining limit (1 coin)');
  assert.equal(gz6.isCapped, true, 'isCapped flag must be true');

  // Next game should earn 0 coins
  const gz7 = callGas({
    action: 'student_record_games_zone_coins',
    sessionToken: token801,
    gameId: 'gz_tower',
    difficulty: 'hard',
    correctAnswers: 10,
    accuracyPercentage: 100,
    attemptId: 'gz_att_7',
  });
  assert.equal(gz7.coinsEarned, 0, 'Subsequent attempts after cap award 0 coins');
  assert.equal(gz7.isCapped, true);
});

// ---------------------------------------------------------------------------
// 7. STUDENT ACCOUNT ISOLATION (STUDENT 701 vs STUDENT 801)
// ---------------------------------------------------------------------------
console.log('\n--- 7. Account Isolation (Student 701 vs Student 801) ---');

runTest('Student 701 coin balance remains 0 while 801 earned coins', () => {
  const bal701 = vmContext.getStudentCoinBalance(mockSs, '701');
  const bal801 = vmContext.getStudentCoinBalance(mockSs, '801');
  assert.equal(bal701, 0, 'Student 701 balance must be 0');
  assert.equal(bal801, 78, 'Student 801 balance must be exactly 78');

  // Profile endpoint returns correct isolated balances
  const prof701 = callGas({
    action: 'student_get_profile',
    sessionToken: token701,
  });
  const prof801 = callGas({
    action: 'student_get_profile',
    sessionToken: token801,
  });
  assert.equal(prof701.profile.totalCoins, 0);
  assert.equal(prof801.profile.totalCoins, 78);
});

runTest('Student 701 completes Grade 7 activity and earns separate coins', () => {
  const att701 = startAttempt(token701, 'g7-u1-act1', 'grade-7', 'g7-u1');
  const comp701 = callGas({
    action: 'game_complete_attempt',
    sessionToken: token701,
    attemptId: att701,
    activityId: 'g7-u1-act1',
    score: 10,
    totalQuestions: 10,
    answeredQuestions: 10,
    correctAnswers: 10,
    incorrectAnswers: 0,
    skippedQuestions: 0,
    percentage: 100,
  });

  assert.equal(comp701.success, true);
  assert.equal(comp701.coins.coinsEarned, 28, 'Student 701 earns 28 coins on perfect first completion (including Level 1->2)');
  assert.equal(comp701.coins.totalCoins, 28, 'Student 701 balance is now 28');

  // Student 801 balance is completely untouched
  const bal801After = vmContext.getStudentCoinBalance(mockSs, '801');
  assert.equal(bal801After, 78, 'Student 801 balance must remain unchanged at 78');
});

// ---------------------------------------------------------------------------
// 8. CLIENT COINSERVICE LOGIC VERIFICATION
// ---------------------------------------------------------------------------
console.log('\n--- 8. Client CoinService Calculation & Storage Verification ---');

runTest('Client CoinService.calculateAttemptCoins matches economy rules', () => {
  const coins = CoinService.calculateAttemptCoins({
    studentNumber: 'test_client_student',
    percentage: 100,
    isFirstCompletion: true,
    previousBestPercentage: 0,
    isLevelUp: false,
  });

  assert.equal(coins.breakdown.firstCompletion, COIN_ECONOMY.FIRST_COMPLETION);
  assert.equal(coins.breakdown.highAccuracy, COIN_ECONOMY.HIGH_ACCURACY_BONUS);
  assert.equal(coins.breakdown.perfectScore, COIN_ECONOMY.PERFECT_SCORE_BONUS);
  assert.equal(coins.breakdown.dailyFirst, COIN_ECONOMY.DAILY_FIRST_ACTIVITY);
  assert.equal(coins.totalCoins, 18);
});

runTest('Client CoinService.calculateGamesZoneCoins matches difficulty & bonus', () => {
  // Reset test student storage
  const resEasy = CoinService.calculateGamesZoneCoins('gz_test_student', 'easy', 80);
  assert.equal(resEasy.coinsEarned, 3);

  const resHard = CoinService.calculateGamesZoneCoins('gz_test_student', 'hard', 95);
  assert.equal(resHard.coinsEarned, 6); // 5 + 1
});

runTest('Client CoinService balance getters/setters are isolated per student', () => {
  CoinService.setBalance('student_A', 100);
  CoinService.setBalance('student_B', 250);

  assert.equal(CoinService.getBalance('student_A'), 100);
  assert.equal(CoinService.getBalance('student_B'), 250);
});

console.log('\n================================================================');
console.log(`🎉 ALL ${passedTests} MONSTER COIN REWARD & ECONOMY REGRESSION TESTS PASSED!`);
console.log('================================================================\n');
