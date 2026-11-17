/**
 * UNIT REVIEW ARCADE — AUTOMATED TEST SUITE: PHASE 8B
 * Verification of Monster World Egg, Hatching & Evolution System
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import {
  MONSTER_MILESTONES,
  getMonsterMilestoneInfo,
  FUTURE_SHOP_CATALOG,
  DEFAULT_MONSTER_CONFIG,
} from './src/types/monster.ts';
import { CoinService } from './src/services/coinService.ts';
import { MonsterService } from './src/services/monsterService.ts';

// Mock localStorage for Node environment
const mockStorage = new Map();
globalThis.localStorage = {
  getItem: (k) => mockStorage.get(k) || null,
  setItem: (k, v) => mockStorage.set(k, String(v)),
  removeItem: (k) => mockStorage.delete(k),
  clear: () => mockStorage.clear(),
};

console.log('================================================================');
console.log('🧪 RUNNING PHASE 8B: EGG, HATCHING & EVOLUTION TEST SUITE');
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
// 1. LIFECYCLE STAGE & MILESTONE FORMULA TESTS
// ---------------------------------------------------------------------------
console.log('--- 1. Lifecycle Stage & Milestone Formula Tests ---');

runTest('0 XP: Incubating Egg (progress 0%)', () => {
  const info = getMonsterMilestoneInfo(0);
  assert.equal(info.stage, 'egg');
  assert.equal(info.stageName, 'Mysterious Egg');
  assert.equal(info.isEgg, true);
  assert.equal(info.isCracked, false);
  assert.equal(info.isHatched, false);
  assert.equal(info.isShopUnlocked, false);
  assert.equal(info.evolutionTier, 0);
  assert.equal(info.nextMilestoneXp, 500);
  assert.equal(info.progressPercent, 0);
});

runTest('249 XP: Late Incubating Egg (progress 50%)', () => {
  const info = getMonsterMilestoneInfo(249);
  assert.equal(info.stage, 'egg');
  assert.equal(info.isEgg, true);
  assert.equal(info.isCracked, false);
  assert.equal(info.isHatched, false);
  assert.equal(info.evolutionTier, 0);
  assert.equal(info.nextMilestoneXp, 500);
  assert.equal(info.progressPercent, 50);
});

runTest('250 XP boundary: Cracking Egg with Fissures (progress 50%)', () => {
  const info = getMonsterMilestoneInfo(250);
  assert.equal(info.stage, 'cracking');
  assert.equal(info.stageName, 'Cracking Egg');
  assert.equal(info.isEgg, true);
  assert.equal(info.isCracked, true);
  assert.equal(info.isHatched, false);
  assert.equal(info.evolutionTier, 0);
  assert.equal(info.nextMilestoneXp, 500);
  assert.equal(info.progressPercent, 50);
});

runTest('499 XP: Final Cracking Stage before Hatching (progress 100%)', () => {
  const info = getMonsterMilestoneInfo(499);
  assert.equal(info.stage, 'cracking');
  assert.equal(info.isEgg, true);
  assert.equal(info.isCracked, true);
  assert.equal(info.isHatched, false);
  assert.equal(info.evolutionTier, 0);
  assert.equal(info.progressPercent, 100);
});

runTest('500 XP milestone: Hatching Day & Stage 1 Hatchling Pal unlock', () => {
  const info = getMonsterMilestoneInfo(500);
  assert.equal(info.stage, 'hatchling');
  assert.equal(info.stageName, 'Hatchling Pal');
  assert.equal(info.isEgg, false);
  assert.equal(info.isCracked, false);
  assert.equal(info.isHatched, true);
  assert.equal(info.isShopUnlocked, false);
  assert.equal(info.evolutionTier, 1);
  assert.equal(info.nextMilestoneXp, 750); // Next target is Shop Unlock at 750 XP!
  assert.equal(info.progressPercent, 0);
});

runTest('749 XP: Hatchling Pal with Shop still locked', () => {
  const info = getMonsterMilestoneInfo(749);
  assert.equal(info.stage, 'hatchling');
  assert.equal(info.isShopUnlocked, false);
  assert.equal(info.evolutionTier, 1);
  assert.equal(info.nextMilestoneXp, 750);
});

runTest('750 XP milestone: Monster Wardrobe Shop Unlocks (Next Evolution is 1,500 XP)', () => {
  const info = getMonsterMilestoneInfo(750);
  assert.equal(info.stage, 'hatchling');
  assert.equal(info.isShopUnlocked, true);
  assert.equal(info.evolutionTier, 1);
  assert.equal(info.nextMilestoneXp, 1500); // Now targets Evolution 1 at 1,500 XP!
  assert.equal(info.progressPercent, 25);
});

runTest('1,499 XP: Peak Hatchling Pal (progress 100%)', () => {
  const info = getMonsterMilestoneInfo(1499);
  assert.equal(info.stage, 'hatchling');
  assert.equal(info.evolutionTier, 1);
  assert.equal(info.progressPercent, 100);
});

runTest('1,500 XP milestone: Stage 2 Adventurer Form Evolution', () => {
  const info = getMonsterMilestoneInfo(1500);
  assert.equal(info.stage, 'adventurer');
  assert.equal(info.stageName, 'Adventurer Form');
  assert.equal(info.evolutionTier, 2);
  assert.equal(info.nextMilestoneXp, 3000);
  assert.equal(info.progressPercent, 0);
});

runTest('2,999 XP: Peak Adventurer Form', () => {
  const info = getMonsterMilestoneInfo(2999);
  assert.equal(info.stage, 'adventurer');
  assert.equal(info.evolutionTier, 2);
  assert.equal(info.nextMilestoneXp, 3000);
  assert.equal(info.progressPercent, 100);
});

runTest('3,000 XP milestone: Stage 3 Champion Titan Evolution', () => {
  const info = getMonsterMilestoneInfo(3000);
  assert.equal(info.stage, 'titan');
  assert.equal(info.stageName, 'Champion Titan');
  assert.equal(info.evolutionTier, 3);
  assert.equal(info.nextMilestoneXp, 6000);
  assert.equal(info.progressPercent, 0);
});

runTest('6,000 XP milestone: Stage 4 Cosmic Apex Legend Evolution', () => {
  const info = getMonsterMilestoneInfo(6000);
  assert.equal(info.stage, 'apex_legend');
  assert.equal(info.stageName, 'Cosmic Apex Legend');
  assert.equal(info.evolutionTier, 4);
  assert.equal(info.nextMilestoneXp, null);
  assert.equal(info.progressPercent, 100);
});

runTest('15,000+ XP: Apex Legend remains max evolution without errors', () => {
  const info = getMonsterMilestoneInfo(15000);
  assert.equal(info.stage, 'apex_legend');
  assert.equal(info.evolutionTier, 4);
  assert.equal(info.nextMilestoneXp, null);
  assert.equal(info.progressPercent, 100);
});

console.log('  ✓ All Milestone calculation tests passed.\n');

// ---------------------------------------------------------------------------
// 2. EXISTING STUDENT MIGRATION & PRESERVATION TESTS
// ---------------------------------------------------------------------------
console.log('--- 2. Existing Student Migration & Preservation Tests ---');

runTest('Student 701 (98 XP) displays Egg stage without losing saved configuration', () => {
  const student701Xp = 98;
  const milestone701 = getMonsterMilestoneInfo(student701Xp);

  // Student 701 is in Egg stage
  assert.equal(milestone701.stage, 'egg');
  assert.equal(milestone701.isEgg, true);
  assert.equal(milestone701.isHatched, false);

  // Saved configuration is safely stored in local cache
  const savedConfig = {
    name: 'Sparky',
    bodyShape: 'fuzzy',
    bodyColor: 'purple',
    eyeType: 'googly',
    mouthType: 'cat_mouth',
    hornType: 'cat_ears',
    cheekType: 'spiral',
    pattern: 'spots',
    accessories: {},
    updatedAt: '2026-11-17T09:00:00.000Z',
  };
  MonsterService.updateCachedMonster('701', savedConfig);

  // Resolving monster retains custom design, does NOT revert to default Pip
  const resolved = MonsterService.resolveMonster(null, '701');
  assert.equal(resolved.name, 'Sparky');
  assert.equal(resolved.bodyColor, 'purple');
  assert.equal(resolved.bodyShape, 'fuzzy');
});

runTest('Hatching seen flag prevents endless popups on page refresh', () => {
  assert.equal(MonsterService.hasSeenHatching('701'), false);
  MonsterService.markHatchingSeen('701');
  assert.equal(MonsterService.hasSeenHatching('701'), true);

  // Separate student account has not seen hatching
  assert.equal(MonsterService.hasSeenHatching('801'), false);
});

console.log('  ✓ All Migration & Preservation tests passed.\n');

// ---------------------------------------------------------------------------
// 3. BACKEND SANDBOXED VM & Code.gs MONSTER SHOP TESTS
// ---------------------------------------------------------------------------
console.log('--- 3. Backend Sandboxed Code.gs Monster Shop & Equipping Tests ---');

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
  getValue() { return this.getValues()[0][0]; }
  getValues() {
    const vals = [];
    for (let r = 0; r < this.numRows; r++) {
      const rowArr = [];
      const targetRow = this.row - 1 + r;
      for (let c = 0; c < this.numCols; c++) {
        const targetCol = this.col - 1 + c;
        if (this.sheet.rows[targetRow] && this.sheet.rows[targetRow][targetCol] !== undefined) {
          rowArr.push(this.sheet.rows[targetRow][targetCol]);
        } else {
          rowArr.push('');
        }
      }
      vals.push(rowArr);
    }
    return vals;
  }
  setValues(matrix) {
    for (let r = 0; r < this.numRows; r++) {
      const targetRowIndex = this.row - 1 + r;
      while (this.sheet.rows.length <= targetRowIndex) {
        this.sheet.rows.push([]);
      }
      const rowData = matrix[r] || [];
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
  }
  getParent() { return this.spreadsheet; }
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
  setTabColor() { return this; }
  setFrozenRows() { return this; }
}

class MockSpreadsheet {
  constructor(name) {
    this.name = name;
    this.sheets = {};
  }
  getName() { return this.name; }
  getId() { return 'mock_test_spreadsheet_p8b'; }
  getSheetByName(name) { return this.sheets[name] || null; }
  getSheets() { return Object.values(this.sheets); }
  insertSheet(name) {
    const s = new MockSheet(name, this);
    this.sheets[name] = s;
    return s;
  }
}

const mockSs = new MockSpreadsheet('Unit Review Arcade - TEST DATABASE');
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
const codeGsPath = fs.existsSync('./google-apps-script/Code.gs')
  ? './google-apps-script/Code.gs'
  : './unit-review-arcade/google-apps-script/Code.gs';
const codeGsSource = fs.readFileSync(codeGsPath, 'utf-8');
vm.runInContext(codeGsSource, vmContext);

// Setup database tables
vmContext.setupArcadeDatabase(mockSs);
vmContext.setupPhase8AMonsterWorld(mockSs);

function callGas(payload) {
  const e = { postData: { contents: JSON.stringify(payload) } };
  const raw = vmContext.doPost(e);
  return JSON.parse(raw.getContent());
}

// Student 701 Login
const loginRes701 = callGas({ action: 'student_login', studentNumber: '701', pin: '1234' });
assert.equal(loginRes701.success, true);
const sessionToken701 = loginRes701.sessionToken;

// Student 801 Login
const loginRes801 = callGas({ action: 'student_login', studentNumber: '801', pin: '1234' });
assert.equal(loginRes801.success, true);
const sessionToken801 = loginRes801.sessionToken;

// Add completed attempt awarding 800 XP to Student 701 (Wardrobe unlocked)
const attemptsSheet = mockSs.getSheetByName('Attempts');
const attColMap = vmContext.getSheetColumnMap(attemptsSheet, vmContext.CONFIG.ATTEMPT_HEADERS);
const attemptRow = new Array(vmContext.CONFIG.ATTEMPT_HEADERS.length).fill('');
attemptRow[attColMap['attempt_id'] - 1] = 'att_init_701';
attemptRow[attColMap['student_number'] - 1] = '701';
attemptRow[attColMap['status'] - 1] = 'completed';
attemptRow[attColMap['xp_earned'] - 1] = 800;
attemptRow[attColMap['percentage'] - 1] = 100;
attemptRow[attColMap['activity_id'] - 1] = 'g7-u1-match';
attemptsSheet.appendRow(attemptRow);

// Give Student 701 300 Monster Coins
vmContext.recordCoinTransaction(mockSs, '701', '7A', 300, 'activity_completion', 'init', '2026-11-17T09:00:00Z');

runTest('Student with < 750 XP is rejected from Monster Shop (Milestone Guard)', () => {
  // Student 801 only has 0 XP
  const purchaseRes = callGas({
    action: 'student_purchase_accessory',
    sessionToken: sessionToken801,
    itemId: 'hat_party',
  });
  assert.equal(purchaseRes.success, false);
  assert.equal(purchaseRes.code, 'LOCKED_MILESTONE');
});

runTest('Student purchasing non-existent accessory is rejected with NOT_FOUND', () => {
  const purchaseRes = callGas({
    action: 'student_purchase_accessory',
    sessionToken: sessionToken701,
    itemId: 'non_existent_laser_gun',
  });
  assert.equal(purchaseRes.success, false);
  assert.equal(purchaseRes.code, 'NOT_FOUND');
});

runTest('Student purchasing accessory without sufficient coins is rejected with INSUFFICIENT_FUNDS', () => {
  // Cosmic Phoenix Wings costs 900 coins; Student 701 has 300 coins
  const purchaseRes = callGas({
    action: 'student_purchase_accessory',
    sessionToken: sessionToken701,
    itemId: 'wings_cosmic_phoenix',
  });
  assert.equal(purchaseRes.success, false);
  assert.equal(purchaseRes.code, 'INSUFFICIENT_FUNDS');
});

runTest('Student 701 successfully purchases Party Hat (60 Coins)', () => {
  const balanceBefore = vmContext.getStudentCoinBalance(mockSs, '701');
  assert.equal(balanceBefore, 300);

  const purchaseRes = callGas({
    action: 'student_purchase_accessory',
    sessionToken: sessionToken701,
    itemId: 'hat_party',
  });

  assert.equal(purchaseRes.success, true);
  assert.equal(purchaseRes.totalCoins, 240); // 300 - 60 = 240
  assert.ok(purchaseRes.monster.accessories.owned.includes('hat_party'));

  // Verified in CoinTransactions sheet
  const txSheet = mockSs.getSheetByName('CoinTransactions');
  const lastRow = txSheet.rows[txSheet.rows.length - 1];
  assert.equal(lastRow[1], '701'); // student_number
  assert.equal(lastRow[3], -60); // amount deducted
  assert.equal(lastRow[4], 240); // balanceAfter
  assert.equal(lastRow[5], 'shop_purchase'); // reason
  assert.equal(lastRow[6], 'hat_party'); // sourceId
});

runTest('Student cannot re-purchase an accessory they already own (Duplicate Prevention)', () => {
  const dupRes = callGas({
    action: 'student_purchase_accessory',
    sessionToken: sessionToken701,
    itemId: 'hat_party',
  });
  assert.equal(dupRes.success, false);
  assert.equal(dupRes.code, 'ALREADY_OWNED');

  // Balance remains unchanged at 240 coins
  assert.equal(vmContext.getStudentCoinBalance(mockSs, '701'), 240);
});

runTest('Student 701 purchases Scholar Round Frames (50 Coins)', () => {
  const purchaseRes = callGas({
    action: 'student_purchase_accessory',
    sessionToken: sessionToken701,
    itemId: 'glasses_round',
  });

  assert.equal(purchaseRes.success, true);
  assert.equal(purchaseRes.totalCoins, 190); // 240 - 50 = 190
  assert.ok(purchaseRes.monster.accessories.owned.includes('hat_party'));
  assert.ok(purchaseRes.monster.accessories.owned.includes('glasses_round'));
});

runTest('Student cannot equip an accessory they do not own (NOT_OWNED)', () => {
  const equipRes = callGas({
    action: 'student_equip_accessory',
    sessionToken: sessionToken701,
    slot: 'hat',
    itemId: 'hat_celestial_crown', // Not owned!
  });
  assert.equal(equipRes.success, false);
  assert.equal(equipRes.code, 'NOT_OWNED');
});

runTest('Student 701 equips owned Party Hat and Scholar Frames', () => {
  // Equip Hat
  const equipHatRes = callGas({
    action: 'student_equip_accessory',
    sessionToken: sessionToken701,
    slot: 'hat',
    itemId: 'hat_party',
  });
  assert.equal(equipHatRes.success, true);
  assert.equal(equipHatRes.monster.accessories.hat, 'hat_party');

  // Equip Glasses
  const equipGlassesRes = callGas({
    action: 'student_equip_accessory',
    sessionToken: sessionToken701,
    slot: 'glasses',
    itemId: 'glasses_round',
  });
  assert.equal(equipGlassesRes.success, true);
  assert.equal(equipGlassesRes.monster.accessories.hat, 'hat_party');
  assert.equal(equipGlassesRes.monster.accessories.glasses, 'glasses_round');
});

runTest('Student 701 unequips Hat while keeping it in owned list', () => {
  const unequipRes = callGas({
    action: 'student_equip_accessory',
    sessionToken: sessionToken701,
    slot: 'hat',
    itemId: null, // unequip
  });
  assert.equal(unequipRes.success, true);
  assert.equal(unequipRes.monster.accessories.hat, undefined);
  assert.equal(unequipRes.monster.accessories.glasses, 'glasses_round');
  assert.ok(unequipRes.monster.accessories.owned.includes('hat_party'));
});

runTest('Session refresh and get_monster returns equipped accessories & owned inventory', () => {
  const getRes = callGas({
    action: 'student_get_monster',
    sessionToken: sessionToken701,
  });
  assert.equal(getRes.success, true);
  assert.equal(getRes.monster.accessories.glasses, 'glasses_round');
  assert.deepEqual(getRes.monster.accessories.owned.sort(), ['glasses_round', 'hat_party'].sort());
  assert.equal(getRes.totalCoins, 190);
});

console.log('  ✓ All Monster Shop & Equipping backend tests passed.\n');

// ---------------------------------------------------------------------------
// 4. CLIENT SERVICE TESTS
// ---------------------------------------------------------------------------
console.log('--- 4. Client CoinService & MonsterService Tests ---');

runTest('CoinService.deductCoins manages local balance and transactions', () => {
  CoinService.setBalance('test_student', 150);
  assert.equal(CoinService.getBalance('test_student'), 150);

  const deductRes = CoinService.deductCoins('test_student', '7A', 60, 'hat_party');
  assert.equal(deductRes.success, true);
  assert.equal(deductRes.balanceAfter, 90);
  assert.equal(CoinService.getBalance('test_student'), 90);

  // Insufficient balance
  const failDeduct = CoinService.deductCoins('test_student', '7A', 100, 'hat_wizard');
  assert.equal(failDeduct.success, false);
  assert.equal(CoinService.getBalance('test_student'), 90);
});

runTest('MonsterService accessories validation preserves owned array', () => {
  const validated = MonsterService.validateConfig({
    name: 'Mochi',
    bodyShape: 'blob',
    bodyColor: 'pink',
    accessories: {
      hat: 'hat_party',
      owned: ['hat_party', 'cloth_bowtie'],
    },
  });
  assert.equal(validated.accessories.hat, 'hat_party');
  assert.deepEqual(validated.accessories.owned, ['hat_party', 'cloth_bowtie']);
});

console.log('  ✓ All Client Service tests passed.\n');

// ---------------------------------------------------------------------------
// 5. SUMMARY
// ---------------------------------------------------------------------------
console.log('================================================================');
console.log(`🎉 ALL ${passedTests} PHASE 8B EVOLUTION & SHOP CHECKS PASSED SUCCESSFULLY!`);
console.log('================================================================\n');
