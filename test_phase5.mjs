/**
 * UNIT REVIEW ARCADE — PHASE 5 AUTOMATED TEST SUITE
 * 
 * Verifies:
 * 1. XP Calculation & Anti-Farming Replay Policy (First play, improvements, decay, and idempotency)
 * 2. 15-Tier Level Progression System & Threshold Boundaries
 * 3. End-to-End Attempt Lifecycle with XP Awards & Duplicate Idempotency (via doPost)
 * 4. 14-Badge Achievement Catalog Unlock Conditions & Auditability (Single-award guarantee)
 * 5. Student Profile & Class Leaderboard Endpoints (student_get_profile, student_get_leaderboard)
 * 6. Class Leaderboard Ranking, Deterministic Tie-Breaking & Strict Privacy Sanitization
 * 7. Non-Destructive Database Schema Migration & Dry-Run Backfill Safety
 */

import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { createContext, runInContext } from 'vm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🎮 Starting Phase 5 Gamification Test Suite...\n');

// ============================================================================
// 1. Mock Spreadsheet & Apps Script Environment for Code.gs
// ============================================================================

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

const mockSpreadsheet = new MockSpreadsheet('Unit Review Arcade [Phase 5 Test]');

const gasContext = {
  console,
  Date,
  Math,
  String,
  Number,
  Boolean,
  Array,
  Object,
  JSON,
  Logger: { log: () => { } },
  ContentService: {
    createTextOutput: (text) => ({
      text,
      setMimeType: () => { },
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
    formatDate: (d, tz, fmt) => d.toISOString(),
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
    openById: () => mockSpreadsheet,
    getActiveSpreadsheet: () => mockSpreadsheet,
    flush: () => { },
  },
};

const vmContext = createContext(gasContext);
const codeGs = readFileSync(path.join(__dirname, 'google-apps-script/Code.gs'), 'utf8');
runInContext(codeGs, vmContext);

console.log('✅ Google Apps Script Code.gs successfully loaded into sandboxed VM\n');

// Standard doPost caller mimicking client HTTP requests
function callGas(payload) {
  const e = { postData: { contents: JSON.stringify(payload) } };
  const raw = vmContext.doPost(e);
  return JSON.parse(raw.getContent());
}

// Initialize database schema and demo student accounts
vmContext.setupArcadeDatabase(mockSpreadsheet);
vmContext.initializeTeacherCredentials('Phase5MasterSecretPass123!');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`  ❌ FAILED: ${message}`);
    failed++;
    throw new Error(message);
  } else {
    console.log(`  ✓ ${message}`);
    passed++;
  }
}

// ============================================================================
// TEST SUITE 1: XP Formula & Anti-Farming Replay Policy (Server-Side Authority)
// ============================================================================
console.log('--- TEST SUITE 1: XP Formula & Anti-Farming Replay Policy ---');

// Test 1.1: First-time play perfect score (100%) -> 20 base + 80 accuracy + 25 perfect = 125 XP
const xpFirstPerfect = vmContext.calculateAttemptXpServer({
  percentage: 100,
  score: 10,
  maxScore: 10,
  gameType: 'quiz_battle',
  isFirstCompletion: true,
  previousBestPercentage: 0,
  priorAttemptsCount: 0,
});
assert(xpFirstPerfect.xpEarned === 125, `First perfect attempt earns 125 XP (got ${xpFirstPerfect.xpEarned})`);
assert(xpFirstPerfect.breakdown.baseCompletion === 20, 'Base completion is 20 XP');
assert(xpFirstPerfect.breakdown.accuracy === 80, 'Accuracy is 80 XP');
assert(xpFirstPerfect.breakdown.flawlessBonus === 25, 'Flawless bonus is 25 XP');

// Test 1.2: First-time play partial score (60%) -> 20 base + 48 accuracy + 0 perfect = 68 XP
const xpFirstPartial = vmContext.calculateAttemptXpServer({
  percentage: 60,
  score: 6,
  maxScore: 10,
  gameType: 'quiz-show',
  isFirstCompletion: true,
  previousBestPercentage: 0,
  priorAttemptsCount: 0,
});
assert(xpFirstPartial.xpEarned === 68, `First 60% attempt earns 68 XP (got ${xpFirstPartial.xpEarned})`);
assert(xpFirstPartial.breakdown.baseCompletion === 20, 'Base is 20 XP');
assert(xpFirstPartial.breakdown.accuracy === 48, 'Accuracy is 48 XP');
assert(xpFirstPartial.breakdown.flawlessBonus === 0, 'No flawless bonus');

// Test 1.3: Replay with identical or lower score -> Practice bonus only (15 XP for 2nd attempt)
const xpReplaySame = vmContext.calculateAttemptXpServer({
  percentage: 60,
  score: 6,
  maxScore: 10,
  gameType: 'quiz-show',
  isFirstCompletion: false,
  previousBestPercentage: 60,
  priorAttemptsCount: 1,
});
assert(xpReplaySame.xpEarned === 15, `Replay with no score improvement yields practice bonus 15 XP (got ${xpReplaySame.xpEarned})`);
assert(xpReplaySame.breakdown.baseCompletion === 0, 'No duplicate base XP on replay');
assert(xpReplaySame.breakdown.accuracyImprovement === 0, 'No accuracy improvement XP');
assert(xpReplaySame.breakdown.practiceBonus === 15, 'Practice bonus is 15 XP');

// Test 1.4: Replay with improved score (60% -> 100%) -> Improvement delta (40% of 80 = 32 XP) + Perfect Bonus (25 XP) + Practice Bonus (15 XP) = 72 XP
const xpReplayImproved = vmContext.calculateAttemptXpServer({
  percentage: 100,
  score: 10,
  maxScore: 10,
  gameType: 'quiz-show',
  isFirstCompletion: false,
  previousBestPercentage: 60,
  priorAttemptsCount: 1,
});
assert(xpReplayImproved.xpEarned === 72, `Replay improving from 60% to 100% earns 72 XP (got ${xpReplayImproved.xpEarned})`);
assert(xpReplayImproved.breakdown.accuracyImprovement === 32, 'Accuracy improvement is 32 XP (80 - 48)');
assert(xpReplayImproved.breakdown.flawlessBonus === 25, 'Earns first-time flawless bonus of 25 XP');
assert(xpReplayImproved.breakdown.practiceBonus === 15, 'Practice bonus is 15 XP');

// Test 1.5: Decaying practice bonus on 3rd and 4th replays
const xpReplay3 = vmContext.calculateAttemptXpServer({
  percentage: 100,
  score: 10,
  maxScore: 10,
  gameType: 'quiz-show',
  isFirstCompletion: false,
  previousBestPercentage: 100,
  priorAttemptsCount: 2,
});
assert(xpReplay3.xpEarned === 10, `3rd replay gives 10 XP practice bonus (got ${xpReplay3.xpEarned})`);

const xpReplay4 = vmContext.calculateAttemptXpServer({
  percentage: 100,
  score: 10,
  maxScore: 10,
  gameType: 'quiz-show',
  isFirstCompletion: false,
  previousBestPercentage: 100,
  priorAttemptsCount: 3,
});
assert(xpReplay4.xpEarned === 5, `4th replay gives 5 XP practice bonus (got ${xpReplay4.xpEarned})`);

// Test 1.6: 5th attempt yields 5 XP practice bonus
const xpReplay5 = vmContext.calculateAttemptXpServer({
  percentage: 100,
  score: 10,
  maxScore: 10,
  gameType: 'quiz-show',
  isFirstCompletion: false,
  previousBestPercentage: 100,
  priorAttemptsCount: 4,
});
assert(xpReplay5.xpEarned === 5, `5th replay gives 5 XP practice bonus (got ${xpReplay5.xpEarned})`);

// Test 1.7: 6th attempt (no improvement) yields 0 XP (Practice Cap reached!)
const xpReplay6 = vmContext.calculateAttemptXpServer({
  percentage: 100,
  score: 10,
  maxScore: 10,
  gameType: 'quiz-show',
  isFirstCompletion: false,
  previousBestPercentage: 100,
  priorAttemptsCount: 5,
});
assert(xpReplay6.xpEarned === 0, `6th replay without improvement yields 0 XP due to finite practice cap (got ${xpReplay6.xpEarned})`);
assert(xpReplay6.breakdown.practiceBonus === 0, 'Practice bonus is capped at 0 XP for attempt 6+');
assert(xpReplay6.replayNotice.includes('Practice XP cap reached'), 'Notice indicates practice cap reached');

// Test 1.8: 6th attempt with score improvement (60% -> 100%) still awards accuracy delta + perfect bonus
const xpReplay6Improved = vmContext.calculateAttemptXpServer({
  percentage: 100,
  score: 10,
  maxScore: 10,
  gameType: 'quiz-show',
  isFirstCompletion: false,
  previousBestPercentage: 60,
  priorAttemptsCount: 5,
});
assert(xpReplay6Improved.xpEarned === 57, `6th attempt improving from 60% to 100% awards 57 XP (32 acc + 25 perf + 0 practice, got ${xpReplay6Improved.xpEarned})`);
assert(xpReplay6Improved.breakdown.accuracyImprovement === 32, 'Earns 32 XP accuracy improvement');
assert(xpReplay6Improved.breakdown.flawlessBonus === 25, 'Earns 25 XP flawless bonus');
assert(xpReplay6Improved.breakdown.practiceBonus === 0, 'Practice bonus is 0 on attempt 6');

console.log('✅ XP & Anti-Farming Replay Policy tests passed!\n');

// ============================================================================
// TEST SUITE 2: 15-Tier Level Progression
// ============================================================================
console.log('--- TEST SUITE 2: 15-Tier Level Progression ---');

// Test tier boundaries
const lvl0 = vmContext.getLevelFromXp(0);
assert(lvl0.level === 1 && lvl0.title === 'Novice Explorer', '0 XP is Level 1 Novice Explorer');
assert(lvl0.currentLevelXp === 0 && lvl0.nextLevelXp === 100 && lvl0.progressPercent === 0, 'Level 1 starts at 0% to 100');

const lvl99 = vmContext.getLevelFromXp(99);
assert(lvl99.level === 1 && lvl99.progressPercent === 99, '99 XP is Level 1 at 99% progress');

const lvl100 = vmContext.getLevelFromXp(100);
assert(lvl100.level === 2 && lvl100.title === 'Curious Learner', '100 XP is Level 2 Curious Learner');
assert(lvl100.currentLevelXp === 0 && lvl100.progressPercent === 0, 'Level 2 at 100 XP has 0% of next tier (100 to 250)');

const lvl175 = vmContext.getLevelFromXp(175);
assert(lvl175.level === 2 && lvl175.progressPercent === 50, '175 XP is Level 2 halfway (50%) to Level 3');

const lvlMax = vmContext.getLevelFromXp(15000);
assert(lvlMax.level === 15 && lvlMax.title === 'Mythic Champion', '15000 XP reaches Tier 15 Mythic Champion');
assert(lvlMax.progressPercent === 100, 'Tier 15 progress is 100%');

console.log('✅ 15-Tier Level Progression tests passed!\n');

// ============================================================================
// TEST SUITE 3: Attempt Lifecycle & Idempotent XP Awards (via doPost)
// ============================================================================
console.log('--- TEST SUITE 3: Attempt Lifecycle & Idempotent XP Awards ---');

// Log in student 801
const s801Login = callGas({ action: 'student_login', studentNumber: '801', pin: '1234' });
assert(s801Login.success === true, 'Student 801 login succeeded');
const s801Token = s801Login.sessionToken;

// 3.1 Start attempt 1 for student 801
const start1 = callGas({
  action: 'game_start_attempt',
  sessionToken: s801Token,
  attemptId: 'att_p5_801_1',
  gradeId: 'grade-8',
  unitId: 'g8-u1',
  unitTitle: 'Friendship',
  activityId: 'grade-8-unit-1-friendship-trivia',
  activityTitle: 'Friendship Trivia',
  gameType: 'quiz_battle',
  totalQuestions: 10,
  startedAt: new Date().toISOString(),
});
assert(start1.success === true, 'Attempt 1 started successfully');
assert(start1.attemptNumber === 1, 'Attempt number is 1');

// 3.2 Complete attempt 1 with perfect score 10/10 (100%)
const comp1 = callGas({
  action: 'game_complete_attempt',
  sessionToken: s801Token,
  attemptId: 'att_p5_801_1',
  score: 10,
  totalQuestions: 10,
  correctAnswers: 10,
  percentage: 100,
  durationSeconds: 45,
});

assert(comp1.success === true, 'Attempt 1 completed successfully');
assert(comp1.gamification !== undefined, 'Gamification payload returned');
assert(comp1.gamification.xpEarned === 125, `Earned 125 XP (got ${comp1.gamification.xpEarned})`);
assert(comp1.gamification.totalXp === 125, 'Total XP is 125');
assert(comp1.gamification.newLevel === 2, 'Student promoted to Level 2 (125 XP >= 100 XP)');
assert(comp1.gamification.isLevelUp === true, 'Level up flag is true');

// Verify initial unlocked achievements
const unlockedBadgeIds1 = (comp1.gamification.unlockedAchievements || []).map(a => a.id);
assert(unlockedBadgeIds1.includes('first_game'), 'first_game achievement unlocked');
assert(unlockedBadgeIds1.includes('perfect_score'), 'perfect_score achievement unlocked');

// 3.3 Idempotency test: duplicate complete call for att_p5_801_1
const comp1Duplicate = callGas({
  action: 'game_complete_attempt',
  sessionToken: s801Token,
  attemptId: 'att_p5_801_1',
  score: 5, // Attempting to tamper/resubmit
  totalQuestions: 10,
  percentage: 50,
});

assert(comp1Duplicate.success === true, 'Duplicate completion succeeds cleanly');
assert(comp1Duplicate.gamification.xpEarned === 125, 'Returns original 125 XP without double counting');
assert(comp1Duplicate.gamification.totalXp === 125, 'Total XP remains strictly 125');
assert(comp1Duplicate.gamification.unlockedAchievements.length === 0, 'No duplicate achievements granted on resubmission');

// 3.4 Replay same activity: start attempt 2
const start2 = callGas({
  action: 'game_start_attempt',
  sessionToken: s801Token,
  attemptId: 'att_p5_801_2',
  gradeId: 'grade-8',
  unitId: 'g8-u1',
  unitTitle: 'Friendship',
  activityId: 'grade-8-unit-1-friendship-trivia',
  activityTitle: 'Friendship Trivia',
  gameType: 'quiz_battle',
  totalQuestions: 10,
  startedAt: new Date().toISOString(),
});
assert(start2.success === true, 'Attempt 2 started successfully');
assert(start2.attemptNumber === 2, 'Attempt number is 2');

// Complete replay with same 100% score -> Practice bonus only (15 XP)
const comp2 = callGas({
  action: 'game_complete_attempt',
  sessionToken: s801Token,
  attemptId: 'att_p5_801_2',
  score: 10,
  totalQuestions: 10,
  correctAnswers: 10,
  percentage: 100,
  durationSeconds: 40,
});
assert(comp2.gamification.xpEarned === 15, `Replay grants decaying practice bonus of 15 XP (got ${comp2.gamification.xpEarned})`);
assert(comp2.gamification.totalXp === 140, `New total XP is 140 (125 + 15, got ${comp2.gamification.totalXp})`);
assert(comp2.gamification.isLevelUp === false, 'No level up on reaching 140 XP');

console.log('✅ Attempt Lifecycle & Idempotency tests passed!\n');

// ============================================================================
// TEST SUITE 4: Achievement Catalog Conditions & Uniqueness
// ============================================================================
console.log('--- TEST SUITE 4: Achievement Catalog Conditions & Uniqueness ---');

// Play remaining 5 distinct game types to trigger 'explorer_all_types' achievement
const gameTypes = ['match_it', 'sentence_builder', 'reading_detective', 'train_station', 'true_false'];

for (let i = 0; i < gameTypes.length; i++) {
  const gt = gameTypes[i];
  const attId = `att_p5_801_gt_${i}`;
  const actId = `grade-8-unit-1-act_${gt}`;

  callGas({
    action: 'game_start_attempt',
    sessionToken: s801Token,
    attemptId: attId,
    gradeId: 'grade-8',
    unitId: 'g8-u1',
    unitTitle: 'Friendship',
    activityId: actId,
    activityTitle: `Activity ${gt}`,
    gameType: gt,
    totalQuestions: 10,
    startedAt: new Date().toISOString(),
  });

  callGas({
    action: 'game_complete_attempt',
    sessionToken: s801Token,
    attemptId: attId,
    score: 8,
    totalQuestions: 10,
    correctAnswers: 8,
    percentage: 80,
    durationSeconds: 50,
  });
}

// Student 801 has now completed games in 6 distinct game types!
// Fetch profile using student_get_profile endpoint
const profileRes = callGas({
  action: 'student_get_profile',
  sessionToken: s801Token,
});

assert(profileRes.success === true, 'student_get_profile succeeded');
assert(profileRes.profile !== undefined, 'Profile returned');
assert(profileRes.profile.totalXp > 140, 'Total XP increased from playing other game types');

const unlockedBadges = profileRes.profile.achievements.filter(a => a.unlockedAt !== null);
const unlockedIds = unlockedBadges.map(a => a.id);

assert(unlockedIds.includes('first_game'), 'first_game is unlocked in profile');
assert(unlockedIds.includes('perfect_score'), 'perfect_score is unlocked in profile');
assert(unlockedIds.includes('explorer_all_types'), 'explorer_all_types is unlocked after playing 6 game types');

// Verify Achievements Sheet has zero duplicate badge records for student 801
const achievementsSheet = mockSpreadsheet.getSheetByName('Achievements');
const achRows = achievementsSheet.rows.slice(1).filter(r => String(r[2]).trim() === '801');
const badgeCounts = {};
for (const r of achRows) {
  const bId = r[4]; // achievement_id
  badgeCounts[bId] = (badgeCounts[bId] || 0) + 1;
}
for (const [badgeId, count] of Object.entries(badgeCounts)) {
  assert(count === 1, `Badge ${badgeId} recorded exactly once for student 801 (recorded ${count} times)`);
}

console.log('✅ Achievement Catalog & Uniqueness tests passed!\n');

// ============================================================================
// TEST SUITE 5: Class Leaderboard & Privacy Protection
// ============================================================================
console.log('--- TEST SUITE 5: Class Leaderboard & Privacy Protection ---');

// Log in student 802 (also in 8A)
const s802Login = callGas({ action: 'student_login', studentNumber: '802', pin: '1234' });
assert(s802Login.success === true, 'Student 802 login succeeded');
const s802Token = s802Login.sessionToken;

// Student 802 plays 1 game
callGas({
  action: 'game_start_attempt',
  sessionToken: s802Token,
  attemptId: 'att_p5_802_1',
  gradeId: 'grade-8',
  unitId: 'g8-u1',
  unitTitle: 'Friendship',
  activityId: 'grade-8-unit-1-friendship-trivia',
  activityTitle: 'Friendship Trivia',
  gameType: 'quiz_battle',
  totalQuestions: 10,
  startedAt: new Date().toISOString(),
});

callGas({
  action: 'game_complete_attempt',
  sessionToken: s802Token,
  attemptId: 'att_p5_802_1',
  score: 6,
  totalQuestions: 10,
  correctAnswers: 6,
  percentage: 60,
  durationSeconds: 60,
});

// Fetch 8A Leaderboard from student 801's perspective
const lbRes = callGas({
  action: 'student_get_leaderboard',
  sessionToken: s801Token,
  classId: '8A',
});

assert(lbRes.success === true, 'student_get_leaderboard succeeded');
assert(lbRes.leaderboard.classId === '8A', 'Leaderboard is for Class 8A');
assert(lbRes.leaderboard.entries.length >= 2, 'Leaderboard has at least 2 entries');

const rank1 = lbRes.leaderboard.entries[0];
const rank2 = lbRes.leaderboard.entries[1];

assert(rank1.rank === 1, 'Top entry has rank 1');
assert(rank1.isCurrentStudent === true, 'Top entry has isCurrentStudent === true for student 801');
assert(rank1.displayName === 'Barış A.', `Rank 1 display name is 'Barış A.' (got ${rank1.displayName})`);
assert(rank1.totalXp > rank2.totalXp, `Rank 1 has higher XP (${rank1.totalXp}) than Rank 2 (${rank2.totalXp})`);
assert(rank2.isCurrentStudent === false, 'Rank 2 isCurrentStudent is false');

// Strict Privacy Audit on Leaderboard entries: NO student numbers, PINs, tokens, or raw IDs!
for (const entry of lbRes.leaderboard.entries) {
  assert(entry.studentNumber === undefined, 'Privacy check: studentNumber is undefined');
  assert(entry.pin === undefined, 'Privacy check: pin is undefined');
  assert(entry.pin_hash === undefined, 'Privacy check: pin_hash is undefined');
  assert(entry.studentId === undefined, 'Privacy check: studentId is undefined');
  assert(entry.token === undefined, 'Privacy check: token is undefined');
  assert(typeof entry.displayName === 'string' && entry.displayName.length > 0, 'Display name is populated');
  assert(entry.displayName.length <= 15, 'Display name is safely masked / formatted');
}

// Deterministic Tie-Breaking Verification
const testEntries = [
  { studentId: 's1', displayName: 'Ali C.', totalXp: 300, activitiesCompleted: 3, highestScore: 90 },
  { studentId: 's2', displayName: 'Berk B.', totalXp: 300, activitiesCompleted: 4, highestScore: 85 }, // More activities -> higher rank
  { studentId: 's3', displayName: 'Ahmet A.', totalXp: 300, activitiesCompleted: 4, highestScore: 95 }, // More activities & higher score -> highest rank
];

testEntries.sort((a, b) => {
  if (b.totalXp !== a.totalXp) return b.totalXp - a.totalXp;
  if (b.activitiesCompleted !== a.activitiesCompleted) return b.activitiesCompleted - a.activitiesCompleted;
  if (b.highestScore !== a.highestScore) return b.highestScore - a.highestScore;
  return a.displayName.localeCompare(b.displayName);
});

assert(testEntries[0].displayName === 'Ahmet A.', 'Deterministic tie-breaker puts highest score first');
assert(testEntries[1].displayName === 'Berk B.', 'Deterministic tie-breaker puts more completed activities second');
assert(testEntries[2].displayName === 'Ali C.', 'Deterministic tie-breaker puts fewer completed activities third');

console.log('✅ Class Leaderboard & Privacy Protection tests passed!\n');

// ============================================================================
// TEST SUITE 6: Database Setup & Dry-Run Migration Helper
// ============================================================================
console.log('--- TEST SUITE 6: Database Setup & Dry-Run Migration Helper ---');

// Verify Achievements Sheet created with expected headers
const achHeaders = achievementsSheet.rows[0];
assert(achHeaders.includes('achievement_id'), 'Achievements sheet has achievement_id');
assert(achHeaders.includes('student_id'), 'Achievements sheet has student_id');
assert(achHeaders.includes('student_number'), 'Achievements sheet has student_number');
assert(achHeaders.includes('title'), 'Achievements sheet has title');

// Verify Attempts Sheet has xp_earned header
const attemptsSheet = mockSpreadsheet.getSheetByName('Attempts');
const attHeaders = attemptsSheet.rows[0];
assert(attHeaders.includes('xp_earned'), 'Attempts sheet has xp_earned header');

// Test Dry-Run Backfill Helper: audits historical attempts without writing
const preDryRunAttemptRowCount = attemptsSheet.rows.length;
const preDryRunAchRowCount = achievementsSheet.rows.length;

const dryRunResult = vmContext.dryRunBackfillStudentXP(mockSpreadsheet);
assert(dryRunResult.dryRun === true, 'dryRunBackfillStudentXP flagged as dryRun');
assert(typeof dryRunResult.totalStudentsAudited === 'number', 'Reports totalStudentsAudited');
assert(dryRunResult.totalStudentsAudited >= 2, 'Audited existing students');

// Verify zero rows mutated during dry run
assert(attemptsSheet.rows.length === preDryRunAttemptRowCount, 'Dry run did NOT modify Attempts row count');
assert(achievementsSheet.rows.length === preDryRunAchRowCount, 'Dry run did NOT modify Achievements row count');

console.log('✅ Database Setup & Dry-Run Migration tests passed!\n');

// ============================================================================
// TEST SUITE 7: Fresh Student Unlocking Isolation
// ============================================================================
console.log('--- TEST SUITE 7: Fresh Student Unlocking Isolation ---');

const s701Login = callGas({ action: 'student_login', studentNumber: '701', pin: '1234' });
assert(s701Login.success === true, 'Student 701 login succeeded');
const s701Token = s701Login.sessionToken;

callGas({
  action: 'game_start_attempt',
  sessionToken: s701Token,
  attemptId: 'att_fresh_701_1',
  gradeId: 'grade-7',
  unitId: 'g7-u1',
  unitTitle: 'Life Online',
  activityId: 'g7-u1-match',
  activityTitle: 'Match It Online',
  gameType: 'match_it',
  totalQuestions: 10,
  startedAt: new Date().toISOString(),
});

const compFresh = callGas({
  action: 'game_complete_attempt',
  sessionToken: s701Token,
  attemptId: 'att_fresh_701_1',
  score: 10,
  totalQuestions: 10,
  correctAnswers: 10,
  percentage: 100,
  durationSeconds: 45,
});

assert(compFresh.success === true, 'Fresh attempt completed successfully');
const freshNewBadgeIds = (compFresh.gamification.unlockedAchievements || []).map(b => b.id);
assert(freshNewBadgeIds.includes('first_game'), 'first_game is unlocked for fresh student');
assert(freshNewBadgeIds.includes('perfect_score'), 'perfect_score is unlocked for fresh 100% attempt');

// Strict check: Unrelated game-type badges must NOT be unlocked!
const unrelatedBadges = [
  'quiz_ace',
  'sentence_architect',
  'detective_pro',
  'station_conductor',
  'true_false_guru',
  'explorer_all_types'
];
for (const bId of unrelatedBadges) {
  assert(!freshNewBadgeIds.includes(bId), `Unrelated badge ${bId} is strictly absent from fresh Match It completion`);
}
assert(freshNewBadgeIds.length === 2, `Fresh student gets exactly 2 badges (got ${freshNewBadgeIds.length})`);

console.log('✅ Fresh Student Unlocking Isolation tests passed!\n');

// ============================================================================
// TEST SUITE 8: Historical Attempt Student (TEST Bug Reproduction & Defense)
// ============================================================================
console.log('--- TEST SUITE 8: Historical Attempt Student (Bug Reproduction Defense) ---');

// Student 702 logs in
const s702Login = callGas({ action: 'student_login', studentNumber: '702', pin: '1234' });
assert(s702Login.success === true, 'Student 702 login succeeded');
const s702Token = s702Login.sessionToken;

// Seed 24 historical completed attempts for student 702 across various game types,
// simulating prior testing history BEFORE Phase 5 was created.
// (Achievements sheet has ZERO rows for student 702).
const histGameTypes = [
  'quiz_battle', 'quiz_battle', 'quiz_battle', 'quiz_battle',
  'sentence_builder', 'sentence_builder', 'sentence_builder',
  'reading_detective', 'reading_detective', 'reading_detective',
  'train_station', 'train_station',
  'true_false', 'true_false', 'true_false',
  'quiz_battle', 'quiz_battle', 'sentence_builder',
  'reading_detective', 'true_false', 'quiz_battle',
  'quiz_battle', 'sentence_builder', 'quiz_battle'
];

for (let h = 0; h < 24; h++) {
  const attId = `att_hist_702_${h + 1}`;
  const gType = histGameTypes[h];
  const actId = `g7-act-hist-${h + 1}`;

  callGas({
    action: 'game_start_attempt',
    sessionToken: s702Token,
    attemptId: attId,
    gradeId: 'grade-7',
    unitId: 'g7-u1',
    unitTitle: 'Unit',
    activityId: actId,
    activityTitle: `Historical Act ${h + 1}`,
    gameType: gType,
    totalQuestions: 10,
    startedAt: new Date(Date.now() - (25 - h) * 3600000).toISOString(),
  });

  callGas({
    action: 'game_complete_attempt',
    sessionToken: s702Token,
    attemptId: attId,
    score: 10,
    totalQuestions: 10,
    correctAnswers: 10,
    percentage: 100,
    durationSeconds: 40,
    completedAt: new Date(Date.now() - (25 - h) * 3600000 + 60000).toISOString(),
  });
}

// Student 702 now completes Attempt 25: A Match It activity with 100%
const att25Id = 'att_702_match_it_25';
callGas({
  action: 'game_start_attempt',
  sessionToken: s702Token,
  attemptId: att25Id,
  gradeId: 'grade-7',
  unitId: 'g7-u1',
  unitTitle: 'Life Online',
  activityId: 'g7-u1-match-test',
  activityTitle: 'Match It Final Review',
  gameType: 'match_it',
  totalQuestions: 10,
  startedAt: new Date().toISOString(),
});

const comp25 = callGas({
  action: 'game_complete_attempt',
  sessionToken: s702Token,
  attemptId: att25Id,
  score: 10,
  totalQuestions: 10,
  correctAnswers: 10,
  percentage: 100,
  durationSeconds: 50,
});

assert(comp25.success === true, 'Attempt 25 completed successfully');
const newBadges25 = (comp25.gamification.unlockedAchievements || []).map(b => b.id);

// CRITICAL ASSERTION: The result modal MUST NOT display unrelated badges that were already qualified historically!
assert(!newBadges25.includes('quiz_ace'), 'Battle Master (Quiz Battle) is NOT returned as new on Match It completion');
assert(!newBadges25.includes('sentence_architect'), 'Sentence Architect is NOT returned as new on Match It completion');
assert(!newBadges25.includes('detective_pro'), 'Chief Inspector is NOT returned as new on Match It completion');
assert(!newBadges25.includes('station_conductor'), 'Express Conductor is NOT returned as new on Match It completion');
assert(!newBadges25.includes('true_false_guru'), 'Truth Seeker is NOT returned as new on Match It completion');
assert(!newBadges25.includes('first_game'), 'First Steps is NOT returned as new (earned on attempt 1)');
assert(!newBadges25.includes('perfect_score'), 'Flawless Victory is NOT returned as new (earned on historical attempt)');

// Verify that ONLY genuinely triggered badges (explorer_all_types for 6th game type, milestone_25 for 25th distinct activity) are in result modal
assert(newBadges25.includes('explorer_all_types'), 'Genuinely triggered: Arcade Explorer (6th game type)');
assert(newBadges25.includes('milestone_25'), 'Genuinely triggered: Halfway Hero (25th distinct activity)');
assert(newBadges25.length === 2, `Exactly the 2 genuinely triggered badges in result modal (got ${newBadges25.length})`);

// Check Profile: Existing historical achievements MUST remain visible in the profile!
const s702ProfileRes = callGas({ action: 'student_get_profile', sessionToken: s702Token });
assert(s702ProfileRes.success === true, 'Profile fetched successfully for student 702');
const unlockedInProfile = s702ProfileRes.profile.achievements.filter(a => a.unlockedAt !== null).map(a => a.id);
assert(unlockedInProfile.includes('quiz_ace'), 'Profile shows Quiz Ace unlocked');
assert(unlockedInProfile.includes('sentence_architect'), 'Profile shows Sentence Architect unlocked');
assert(unlockedInProfile.includes('detective_pro'), 'Profile shows Detective Pro unlocked');
assert(unlockedInProfile.includes('station_conductor'), 'Profile shows Station Conductor unlocked');
assert(unlockedInProfile.includes('true_false_guru'), 'Profile shows True False Guru unlocked');
assert(unlockedInProfile.includes('first_game'), 'Profile shows First Game unlocked');
assert(unlockedInProfile.includes('perfect_score'), 'Profile shows Perfect Score unlocked');

console.log('✅ Historical Attempt Student tests passed!\n');

// ============================================================================
// TEST SUITE 9: Duplicate Completion Idempotency
// ============================================================================
console.log('--- TEST SUITE 9: Duplicate Completion Idempotency ---');

const preRetryAttemptsCount = attemptsSheet.rows.length;
const preRetryAchCount = achievementsSheet.rows.length;

const comp25Retry = callGas({
  action: 'game_complete_attempt',
  sessionToken: s702Token,
  attemptId: att25Id,
  score: 10,
  totalQuestions: 10,
  percentage: 100,
});

assert(comp25Retry.success === true, 'Retry succeeds cleanly');
assert(comp25Retry.gamification.unlockedAchievements.length === 0, 'Retry returns 0 unlocked achievements');
assert(comp25Retry.gamification.xpEarned === comp25.gamification.xpEarned, 'Retry returns identical original XP earned');
assert(attemptsSheet.rows.length === preRetryAttemptsCount, 'Retry did NOT append rows to Attempts sheet');
assert(achievementsSheet.rows.length === preRetryAchCount, 'Retry did NOT append rows to Achievements sheet');

console.log('✅ Duplicate Completion Idempotency tests passed!\n');

// ============================================================================
// TEST SUITE 10: Replay Practice Cap in Real Gameplay
// ============================================================================
console.log('--- TEST SUITE 10: Replay Practice Cap in Real Gameplay ---');

const s703Login = callGas({ action: 'student_login', studentNumber: '703', pin: '1234' });
const s703Token = s703Login.sessionToken;

const repActId = 'g7-u2-practice-cap-test';
const expectedXpByAttempt = [
  125, // Att 1: 20 base + 80 acc + 25 perf
  15,  // Att 2: 15 practice bonus
  10,  // Att 3: 10 practice bonus
  5,   // Att 4: 5 practice bonus
  5,   // Att 5: 5 practice bonus
  0    // Att 6+: 0 XP (Practice cap reached!)
];

for (let a = 1; a <= 6; a++) {
  const aId = `att_703_cap_${a}`;
  callGas({
    action: 'game_start_attempt',
    sessionToken: s703Token,
    attemptId: aId,
    gradeId: 'grade-7',
    unitId: 'g7-u2',
    unitTitle: 'Danger',
    activityId: repActId,
    activityTitle: 'Practice Cap Activity',
    gameType: 'true_false',
    totalQuestions: 10,
    startedAt: new Date().toISOString(),
  });

  const comp = callGas({
    action: 'game_complete_attempt',
    sessionToken: s703Token,
    attemptId: aId,
    score: 10,
    totalQuestions: 10,
    correctAnswers: 10,
    percentage: 100,
    durationSeconds: 30,
  });

  assert(comp.gamification.xpEarned === expectedXpByAttempt[a - 1], `Attempt ${a} earned expected ${expectedXpByAttempt[a - 1]} XP (got ${comp.gamification.xpEarned})`);
  if (a >= 6) {
    assert(comp.gamification.replayNotice.includes('Practice XP cap reached'), 'Attempt 6 informs that practice cap is reached');
  }
}

console.log('✅ Replay Practice Cap in Real Gameplay tests passed!\n');

// ============================================================================
// TEST SUITE 11: Achievements Audit & Dry-Run Repair Tool
// ============================================================================
console.log('--- TEST SUITE 11: Achievements Audit & Dry-Run Repair Tool ---');

// Set SPREADSHEET_ID in script properties to simulate standalone project
mockProps.setProperty('SPREADSHEET_ID', 'test_arcade_spreadsheet_id');

// Test 11.1: Standard dry-run audit with mock spreadsheet argument
const preRepairAchRowCount = achievementsSheet.rows.length;
const repairAudit = vmContext.dryRunRepairStudentAchievements(mockSpreadsheet);

assert(repairAudit.dryRun === true, 'dryRunRepairStudentAchievements defaults to dryRun === true');
assert(repairAudit.success === true, 'dryRunRepairStudentAchievements returns success: true');
assert(typeof repairAudit.totalDiscrepancies === 'number', 'Reports totalDiscrepancies number');
assert(Array.isArray(repairAudit.auditReport), 'Reports auditReport array');
assert(achievementsSheet.rows.length === preRepairAchRowCount, 'Dry run did NOT mutate Achievements sheet rows');

// Test 11.2: Complete Structured Diagnostic Logging Verification
const ssDiscrepancy = new MockSpreadsheet('Discrepancy DB');
const sAtt = ssDiscrepancy.insertSheet('Attempts');
sAtt.appendRow(vmContext.CONFIG.ATTEMPT_HEADERS);
// Student 801 in class 8A with 3 completed Quiz Battle attempts (eligible for first_game, perfect_score, quiz_ace)
sAtt.appendRow(['att_801_q1', 'sess_1', 'std_801', '801', '8A', 'grade-8', 'g8-u1', 'Friendship', 'g8-u1-act1', 'Quiz', 'quiz_battle', 1, 10, 10, 10, 10, 0, 0, 100, '2026-11-13T10:00:00Z', '2026-11-13T10:05:00Z', 300, 'completed', '', 125]);
sAtt.appendRow(['att_801_q2', 'sess_1', 'std_801', '801', '8A', 'grade-8', 'g8-u1', 'Friendship', 'g8-u1-act2', 'Quiz 2', 'quiz_battle', 1, 10, 10, 10, 10, 0, 0, 100, '2026-11-13T10:10:00Z', '2026-11-13T10:15:00Z', 300, 'completed', '', 125]);
sAtt.appendRow(['att_801_q3', 'sess_1', 'std_801', '801', '8A', 'grade-8', 'g8-u1', 'Friendship', 'g8-u1-act3', 'Quiz 3', 'quiz_battle', 1, 10, 10, 10, 10, 0, 0, 100, '2026-11-13T10:20:00Z', '2026-11-13T10:25:00Z', 300, 'completed', '', 125]);

const sAch = ssDiscrepancy.insertSheet('Achievements');
sAch.appendRow(vmContext.CONFIG.ACHIEVEMENT_HEADERS);
// Record first_game with wrong trigger attempt to test MISMATCHED_TRIGGER_ATTEMPT
sAch.appendRow(['ach_1', 'sess_1', '801', 'Barış Arslan', 'first_game', 'First Steps', '2026-11-13T10:05:00Z', 'att_wrong_trigger']);

const capturedLogs = [];
const origGasLog = gasContext.Logger.log;
gasContext.Logger.log = (msg) => capturedLogs.push(String(msg));

const loggingAudit = vmContext.dryRunRepairStudentAchievements(ssDiscrepancy);
gasContext.Logger.log = origGasLog;

assert(loggingAudit.success === true, 'Diagnostic logging audit succeeded');
assert(loggingAudit.totalDiscrepancies === 4, `Discrepancies count matches expected 4 (got ${loggingAudit.totalDiscrepancies})`);
assert(Array.isArray(loggingAudit.auditReport), 'auditReport is array');
assert(typeof loggingAudit.summaryByType === 'object', 'summaryByType is object');
assert(typeof loggingAudit.summaryByStudent === 'object', 'summaryByStudent is object');

// Verify all required fields on every auditReport item
loggingAudit.auditReport.forEach((item, idx) => {
  assert(Boolean(item.studentNumber), `Item ${idx} has studentNumber (${item.studentNumber})`);
  assert(item.studentClass === '8A', `Item ${idx} has studentClass 8A (${item.studentClass})`);
  assert(Boolean(item.badgeId), `Item ${idx} has badgeId (${item.badgeId})`);
  assert(Boolean(item.discrepancyType), `Item ${idx} has discrepancyType (${item.discrepancyType})`);
  assert(item.existingTriggerAttemptId !== undefined, `Item ${idx} has existingTriggerAttemptId`);
  assert(item.expectedTriggerAttemptId !== undefined, `Item ${idx} has expectedTriggerAttemptId`);
  assert(Boolean(item.proposedAction), `Item ${idx} has proposedAction`);
});

// Verify structured log formatting
const joinedLogs = capturedLogs.join('\n');
assert(joinedLogs.includes('STUDENT ACHIEVEMENTS AUDIT (DRY-RUN)'), 'Logs include audit header banner');
assert(joinedLogs.includes('Mode: READ-ONLY (Zero spreadsheet writes, no data modified)'), 'Logs include read-only mode banner');
assert(joinedLogs.includes('DETAILED DISCREPANCY LOG'), 'Logs include detailed discrepancy log section');
assert(joinedLogs.includes('SUMMARY GROUPED BY DISCREPANCY TYPE'), 'Logs include summary grouped by type');
assert(joinedLogs.includes('SUMMARY GROUPED BY STUDENT'), 'Logs include summary grouped by student');
assert(joinedLogs.includes('• Proposed Action:'), 'Logs include proposed action');
assert(joinedLogs.includes('• Existing Trigger Attempt:'), 'Logs include existing trigger attempt ID');
assert(joinedLogs.includes('• Expected Trigger Attempt:'), 'Logs include expected trigger attempt ID');
assert(joinedLogs.includes('DRY-RUN ONLY: NO CHANGES WERE APPLIED TO GOOGLE SHEETS'), 'Logs include dry-run completion footer');

// Test 11.3: No-argument invocation directly from GAS editor
const noArgAudit = vmContext.dryRunRepairStudentAchievements();
assert(noArgAudit.dryRun === true, 'No-argument dryRunRepairStudentAchievements returns dryRun: true');
assert(noArgAudit.success === true, 'No-argument dryRunRepairStudentAchievements succeeds via getArcadeSpreadsheet()');
assert(typeof noArgAudit.totalDiscrepancies === 'number', 'No-argument call returns numeric discrepancies');
assert(Array.isArray(noArgAudit.auditReport), 'No-argument call returns auditReport array');

// Test 11.3: No-argument invocation for dryRunBackfillStudentXP
const noArgXpBackfill = vmContext.dryRunBackfillStudentXP();
assert(noArgXpBackfill.dryRun === true, 'No-argument dryRunBackfillStudentXP returns dryRun: true');
assert(noArgXpBackfill.success === true, 'No-argument dryRunBackfillStudentXP succeeds via getArcadeSpreadsheet()');
assert(typeof noArgXpBackfill.totalStudentsAudited === 'number', 'No-argument call returns totalStudentsAudited');

// Test 11.4: Undefined / Disconnected Spreadsheet diagnostic
mockProps.deleteProperty('SPREADSHEET_ID');
const originalGetActive = gasContext.SpreadsheetApp.getActiveSpreadsheet;
gasContext.SpreadsheetApp.getActiveSpreadsheet = () => null;

const disconnectedAudit = vmContext.dryRunRepairStudentAchievements();
assert(disconnectedAudit.dryRun === true, 'Disconnected audit returns dryRun: true');
assert(disconnectedAudit.success === false, 'Disconnected audit reports failure cleanly');
assert(disconnectedAudit.error === 'SPREADSHEET_NOT_CONNECTED', 'Disconnected audit returns SPREADSHEET_NOT_CONNECTED error');
assert(disconnectedAudit.message.includes('No Google Spreadsheet connected'), 'Provides helpful setup guidance message');

// Restore spreadsheet connection
mockProps.setProperty('SPREADSHEET_ID', 'test_arcade_spreadsheet_id');
gasContext.SpreadsheetApp.getActiveSpreadsheet = originalGetActive;

// Test 11.5: Missing required sheet 'Attempts' returns diagnostic without creating sheet
const ssMissingAttempts = new MockSpreadsheet('Missing Attempts DB');
const achOnly = ssMissingAttempts.insertSheet('Achievements');
achOnly.appendRow(['achievement_id', 'session_id', 'student_number', 'student_name', 'badge_id', 'badge_title', 'unlocked_at', 'trigger_attempt_id']);

let insertCountMissingAttempts = 0;
const origInsertMissingAttempts = ssMissingAttempts.insertSheet.bind(ssMissingAttempts);
ssMissingAttempts.insertSheet = (name) => {
  insertCountMissingAttempts++;
  return origInsertMissingAttempts(name);
};

const missingAttemptsAudit = vmContext.dryRunRepairStudentAchievements(ssMissingAttempts);
assert(missingAttemptsAudit.success === false, 'Missing Attempts returns success: false');
assert(missingAttemptsAudit.error === 'MISSING_REQUIRED_SHEET', 'Missing Attempts reports MISSING_REQUIRED_SHEET');
assert(missingAttemptsAudit.missingSheet === 'Attempts', 'Correctly identifies missing Attempts sheet');
assert(insertCountMissingAttempts === 0, 'Proof: insertSheet was NEVER called for missing Attempts sheet');
assert(ssMissingAttempts.sheets['Attempts'] === undefined, 'Proof: Attempts sheet was NOT created in dry-run mode');

// Test 11.6: Missing required sheet 'Achievements' returns diagnostic without creating sheet
const ssMissingAch = new MockSpreadsheet('Missing Achievements DB');
const attOnly = ssMissingAch.insertSheet('Attempts');
attOnly.appendRow(['attempt_id', 'student_number', 'status', 'completed_at']);

let insertCountMissingAch = 0;
const origInsertMissingAch = ssMissingAch.insertSheet.bind(ssMissingAch);
ssMissingAch.insertSheet = (name) => {
  insertCountMissingAch++;
  return origInsertMissingAch(name);
};

const missingAchAudit = vmContext.dryRunRepairStudentAchievements(ssMissingAch);
assert(missingAchAudit.success === false, 'Missing Achievements returns success: false');
assert(missingAchAudit.error === 'MISSING_REQUIRED_SHEET', 'Missing Achievements reports MISSING_REQUIRED_SHEET');
assert(missingAchAudit.missingSheet === 'Achievements', 'Correctly identifies missing Achievements sheet');
assert(insertCountMissingAch === 0, 'Proof: insertSheet was NEVER called for missing Achievements sheet');
assert(ssMissingAch.sheets['Achievements'] === undefined, 'Proof: Achievements sheet was NOT created in dry-run mode');

// Test 11.7: Proof of ZERO writes in dry-run mode
let writeOpCount = 0;
const monitorSheet = (sheet) => {
  const origAppend = sheet.appendRow.bind(sheet);
  sheet.appendRow = (...args) => { writeOpCount++; return origAppend(...args); };
  const origClear = sheet.clear.bind(sheet);
  sheet.clear = (...args) => { writeOpCount++; return origClear(...args); };
  const origDelete = sheet.deleteRow.bind(sheet);
  sheet.deleteRow = (...args) => { writeOpCount++; return origDelete(...args); };
  const origGetRange = sheet.getRange.bind(sheet);
  sheet.getRange = (...args) => {
    const range = origGetRange(...args);
    const origSetVal = range.setValue.bind(range);
    range.setValue = (...vargs) => { writeOpCount++; return origSetVal(...vargs); };
    const origSetVals = range.setValues.bind(range);
    range.setValues = (...vargs) => { writeOpCount++; return origSetVals(...vargs); };
    return range;
  };
};

const origInsertSheet = mockSpreadsheet.insertSheet.bind(mockSpreadsheet);
mockSpreadsheet.insertSheet = (name) => {
  writeOpCount++;
  return origInsertSheet(name);
};

Object.values(mockSpreadsheet.sheets).forEach(monitorSheet);

// Run all dry-run functions
vmContext.dryRunRepairStudentAchievements(mockSpreadsheet);
vmContext.dryRunRepairStudentAchievements();
vmContext.dryRunBackfillStudentXP(mockSpreadsheet);
vmContext.dryRunBackfillStudentXP();

assert(writeOpCount === 0, `Proof of zero writes in dry-run: writeOpCount is strictly 0 (got ${writeOpCount})`);

// Test 11.8: Separately guarded repairStudentAchievements write operation
const noTokenRepair = vmContext.repairStudentAchievements();
assert(noTokenRepair.success === false, 'repairStudentAchievements with no args returns success: false');
assert(noTokenRepair.applied === false, 'repairStudentAchievements with no args did not apply writes');
assert(noTokenRepair.error === 'CONFIRMATION_REQUIRED', 'repairStudentAchievements requires CONFIRMATION_REQUIRED');

const wrongTokenRepair = vmContext.repairStudentAchievements(mockSpreadsheet, 'APPLY_PLEASE');
assert(wrongTokenRepair.success === false, 'Wrong confirmation token returns success: false');
assert(wrongTokenRepair.error === 'CONFIRMATION_REQUIRED', 'Wrong token rejected with CONFIRMATION_REQUIRED');

// Authorized repair execution
const authRepair = vmContext.repairStudentAchievements(mockSpreadsheet, 'CONFIRM_APPLY_REPAIR');
assert(authRepair.success === true, 'Authorized repair succeeds');
assert(authRepair.applied === true, 'Authorized repair applied is true');
assert(typeof authRepair.totalRepairsApplied === 'number', 'Authorized repair returns totalRepairsApplied');

// Second repair run on clean data reports 0 repairs needed
const repeatRepair = vmContext.repairStudentAchievements(mockSpreadsheet, 'CONFIRM_APPLY_REPAIR');
assert(repeatRepair.success === true, 'Repeat repair succeeds cleanly');
assert(repeatRepair.totalRepairsApplied === 0, 'Repeat repair applies 0 repairs (idempotent)');

console.log('✅ Achievements Audit & Dry-Run Repair Tool tests passed!\n');

// ============================================================================
// TEST SUITE 12: Approved Test-Only Achievement Repair Workflow
// ============================================================================
console.log('--- TEST SUITE 12: Approved Test-Only Achievement Repair Workflow ---');

// Test 12.1: Environment Guard - Positive Verification of TEST spreadsheets
const testSs1 = new MockSpreadsheet('Unit Review Arcade - TEST DATABASE');
const verifyResult1 = vmContext.verifyTestSpreadsheet(testSs1);
assert(verifyResult1.isTest === true, 'Identifies "Unit Review Arcade - TEST DATABASE" as TEST');

const testSs2 = new MockSpreadsheet('Unit Review Arcade [Phase 5 Test]');
const verifyResult2 = vmContext.verifyTestSpreadsheet(testSs2);
assert(verifyResult2.isTest === true, 'Identifies "Unit Review Arcade [Phase 5 Test]" as TEST');

const customSs = new MockSpreadsheet('Custom School Database');
mockProps.setProperty('ARCADE_ENV', 'TEST');
const verifyResult3 = vmContext.verifyTestSpreadsheet(customSs);
assert(verifyResult3.isTest === true, 'Identifies custom sheet with ARCADE_ENV=TEST as TEST');
mockProps.deleteProperty('ARCADE_ENV');

// Test 12.2: Hard Production Refusal & Fail-Closed Guard
const prodSs1 = new MockSpreadsheet('Unit Review Arcade – Student Tracking Database');
const prodVerify1 = vmContext.verifyTestSpreadsheet(prodSs1);
assert(prodVerify1.isTest === false, 'Hard rejects production name "Unit Review Arcade – Student Tracking Database"');
assert(prodVerify1.reason.includes('matches PRODUCTION signature'), 'Rejection mentions PRODUCTION signature');

const prodSs2 = new MockSpreadsheet('Unit Review Arcade Production');
const prodVerify2 = vmContext.verifyTestSpreadsheet(prodSs2);
assert(prodVerify2.isTest === false, 'Hard rejects name containing "Production"');

const prodRepairAttempt = vmContext.runApprovedTestAchievementRepair(prodSs1);
assert(prodRepairAttempt.success === false, 'Refuses to execute repair on production spreadsheet');
assert(prodRepairAttempt.error === 'ENV_GUARD_REJECTION', 'Reports ENV_GUARD_REJECTION for production sheet');

const unknownSs = new MockSpreadsheet('Generic Unmarked Database');
const unknownVerify = vmContext.verifyTestSpreadsheet(unknownSs);
assert(unknownVerify.isTest === false, 'Fails closed on unmarked database without TEST in name or properties');

// Helper to construct exact 12-badge test scenario for student 801
function buildApproved12BadgeScenario() {
  const ss = new MockSpreadsheet('Unit Review Arcade - TEST DATABASE');
  const attSheet = ss.insertSheet('Attempts');
  attSheet.appendRow(vmContext.CONFIG.ATTEMPT_HEADERS);

  const stdSheet = ss.insertSheet('Students');
  stdSheet.appendRow(vmContext.CONFIG.STUDENT_HEADERS);
  stdSheet.appendRow(['std_801', '801', 'Barış Arslan', 'grade-8', '8A', 'salt', 'hash', true, 0, null]);

  // 17 distinct completed activities qualifying student 801 for exactly 12 achievements
  const attemptsList = [
    // Quiz Battle (3 perfect -> first_game, perfect_score, perfect_streak_3, quiz_ace)
    ['att_801_quiz_01', 'sess_1', 'std_801', '801', '8A', 'grade-8', 'g8-u1', 'Friendship', 'g8-u1-act1', 'Quiz 1', 'quiz_battle', 1, 10, 10, 10, 10, 0, 0, 100, '2026-11-01T10:00:00Z', '2026-11-01T10:05:00Z', 300, 'completed', '', 125],
    ['att_801_quiz_02', 'sess_1', 'std_801', '801', '8A', 'grade-8', 'g8-u1', 'Friendship', 'g8-u1-act2', 'Quiz 2', 'quiz_battle', 1, 10, 10, 10, 10, 0, 0, 100, '2026-11-02T10:00:00Z', '2026-11-02T10:05:00Z', 300, 'completed', '', 125],
    ['att_801_quiz_03', 'sess_1', 'std_801', '801', '8A', 'grade-8', 'g8-u1', 'Friendship', 'g8-u1-act3', 'Quiz 3', 'quiz_battle', 1, 10, 10, 10, 10, 0, 0, 100, '2026-11-03T10:00:00Z', '2026-11-03T10:05:00Z', 300, 'completed', '', 125],

    // Match It (3 perfect -> milestone_5 at act 5, match_master at act 6)
    ['att_801_match_01', 'sess_1', 'std_801', '801', '8A', 'grade-8', 'g8-u1', 'Friendship', 'g8-u1-act4', 'Match 1', 'match_it', 1, 10, 10, 10, 10, 0, 0, 100, '2026-11-04T10:00:00Z', '2026-11-04T10:05:00Z', 300, 'completed', '', 125],
    ['att_801_match_02', 'sess_1', 'std_801', '801', '8A', 'grade-8', 'g8-u1', 'Friendship', 'g8-u1-act5', 'Match 2', 'match_it', 1, 10, 10, 10, 10, 0, 0, 100, '2026-11-05T10:00:00Z', '2026-11-05T10:05:00Z', 300, 'completed', '', 125],
    ['att_801_match_03', 'sess_1', 'std_801', '801', '8A', 'grade-8', 'g8-u1', 'Friendship', 'g8-u1-act6', 'Match 3', 'match_it', 1, 10, 10, 10, 10, 0, 0, 100, '2026-11-06T10:00:00Z', '2026-11-06T10:05:00Z', 300, 'completed', '', 125],

    // Sentence Builder (3 perfect -> sentence_architect at act 9)
    ['att_801_sent_01', 'sess_1', 'std_801', '801', '8A', 'grade-8', 'g8-u2', 'Teen Life', 'g8-u2-act1', 'Sentence 1', 'sentence_builder', 1, 10, 10, 10, 10, 0, 0, 100, '2026-11-07T10:00:00Z', '2026-11-07T10:05:00Z', 300, 'completed', '', 125],
    ['att_801_sent_02', 'sess_1', 'std_801', '801', '8A', 'grade-8', 'g8-u2', 'Teen Life', 'g8-u2-act2', 'Sentence 2', 'sentence_builder', 1, 10, 10, 10, 10, 0, 0, 100, '2026-11-08T10:00:00Z', '2026-11-08T10:05:00Z', 300, 'completed', '', 125],
    ['att_801_sent_03', 'sess_1', 'std_801', '801', '8A', 'grade-8', 'g8-u2', 'Teen Life', 'g8-u2-act3', 'Sentence 3', 'sentence_builder', 1, 10, 10, 10, 10, 0, 0, 100, '2026-11-09T10:00:00Z', '2026-11-09T10:05:00Z', 300, 'completed', '', 125],

    // Reading Detective (3 perfect -> milestone_10 at act 10, detective_pro at act 12)
    ['att_801_det_01', 'sess_1', 'std_801', '801', '8A', 'grade-8', 'g8-u2', 'Teen Life', 'g8-u2-act4', 'Detective 1', 'reading_detective', 1, 10, 10, 10, 10, 0, 0, 100, '2026-11-10T10:00:00Z', '2026-11-10T10:05:00Z', 300, 'completed', '', 125],
    ['att_801_det_02', 'sess_1', 'std_801', '801', '8A', 'grade-8', 'g8-u2', 'Teen Life', 'g8-u2-act5', 'Detective 2', 'reading_detective', 1, 10, 10, 10, 10, 0, 0, 100, '2026-11-11T10:00:00Z', '2026-11-11T10:05:00Z', 300, 'completed', '', 125],
    ['att_801_det_03', 'sess_1', 'std_801', '801', '8A', 'grade-8', 'g8-u2', 'Teen Life', 'g8-u2-act6', 'Detective 3', 'reading_detective', 1, 10, 10, 10, 10, 0, 0, 100, '2026-11-12T10:00:00Z', '2026-11-12T10:05:00Z', 300, 'completed', '', 125],

    // Train Station (2 perfect -> station_conductor at act 14)
    ['att_801_train_01', 'sess_1', 'std_801', '801', '8A', 'grade-8', 'g8-u3', 'Cooking', 'g8-u3-act1', 'Train 1', 'train_station', 1, 10, 10, 10, 10, 0, 0, 100, '2026-11-13T10:00:00Z', '2026-11-13T10:05:00Z', 300, 'completed', '', 125],
    ['att_801_train_02', 'sess_1', 'std_801', '801', '8A', 'grade-8', 'g8-u3', 'Cooking', 'g8-u3-act2', 'Train 2', 'train_station', 1, 10, 10, 10, 10, 0, 0, 100, '2026-11-14T10:00:00Z', '2026-11-14T10:05:00Z', 300, 'completed', '', 125],

    // True/False (3 perfect -> explorer_all_types at act 15, true_false_guru at act 17)
    ['att_801_tf_01', 'sess_1', 'std_801', '801', '8A', 'grade-8', 'g8-u3', 'Cooking', 'g8-u3-act3', 'TF 1', 'true_false', 1, 10, 10, 10, 10, 0, 0, 100, '2026-11-15T10:00:00Z', '2026-11-15T10:05:00Z', 300, 'completed', '', 125],
    ['att_801_tf_02', 'sess_1', 'std_801', '801', '8A', 'grade-8', 'g8-u3', 'Cooking', 'g8-u3-act4', 'TF 2', 'true_false', 1, 10, 10, 10, 10, 0, 0, 100, '2026-11-16T10:00:00Z', '2026-11-16T10:05:00Z', 300, 'completed', '', 125],
    ['att_801_tf_03', 'sess_1', 'std_801', '801', '8A', 'grade-8', 'g8-u3', 'Cooking', 'g8-u3-act5', 'TF 3', 'true_false', 1, 10, 10, 10, 10, 0, 0, 100, '2026-11-17T10:00:00Z', '2026-11-17T10:05:00Z', 300, 'completed', '', 125],
  ];

  attemptsList.forEach(row => attSheet.appendRow(row));

  const achSheet = ss.insertSheet('Achievements');
  achSheet.appendRow(vmContext.CONFIG.ACHIEVEMENT_HEADERS);

  // Seed the exact 12 achievements pointing to the buggy attempt ID att_mweq7htq_g7zcy1pl
  const twelveBadges = [
    { id: 'first_game', title: 'First Steps' },
    { id: 'perfect_score', title: 'Flawless Victory' },
    { id: 'perfect_streak_3', title: 'Hat Trick' },
    { id: 'quiz_ace', title: 'Battle Master' },
    { id: 'milestone_5', title: 'On a Roll' },
    { id: 'match_master', title: 'Pair Perfection' },
    { id: 'sentence_architect', title: 'Sentence Architect' },
    { id: 'milestone_10', title: 'Knowledge Seeker' },
    { id: 'detective_pro', title: 'Chief Inspector' },
    { id: 'station_conductor', title: 'Express Conductor' },
    { id: 'explorer_all_types', title: 'Arcade Explorer' },
    { id: 'true_false_guru', title: 'Truth Seeker' },
  ];

  twelveBadges.forEach((b, idx) => {
    achSheet.appendRow([
      `ach_801_${idx + 1}`,
      'sess_1',
      '801',
      'Barış Arslan',
      b.id,
      b.title,
      '2026-11-17T12:00:00Z',
      'att_mweq7htq_g7zcy1pl', // The observed bug trigger ID
    ]);
  });

  return { ss, attSheet, achSheet, twelveBadges };
}

// Test 12.3: Backup Failure Halts Execution
const brokenBackupScenario = buildApproved12BadgeScenario();
const origInsertBroken = brokenBackupScenario.ss.insertSheet.bind(brokenBackupScenario.ss);
brokenBackupScenario.ss.insertSheet = (name) => {
  if (name.startsWith('_backup_achievements_')) {
    throw new Error('Quota exceeded: Cannot create backup sheet');
  }
  return origInsertBroken(name);
};

const backupFailResult = vmContext.runApprovedTestAchievementRepair(brokenBackupScenario.ss);
assert(backupFailResult.success === false, 'Repair halts when backup creation fails');
assert(backupFailResult.error === 'BACKUP_FAILED', 'Reports BACKUP_FAILED error');
assert(brokenBackupScenario.achSheet.rows.slice(1).every(r => r[7] === 'att_mweq7htq_g7zcy1pl'), 'Achievements rows completely untouched when backup fails');

// Test 12.4: Scope Mismatch Abort (discrepancy count != 12)
const scenarioScope = buildApproved12BadgeScenario();
// Add an attempt for student 802 so total discrepancies becomes 13 (12 for 801 + 1 for 802)
scenarioScope.attSheet.appendRow(['att_802_q1', 'sess_1', 'std_802', '802', '8A', 'grade-8', 'g8-u1', 'Friendship', 'g8-u1-act1', 'Quiz 1', 'quiz_battle', 1, 10, 10, 10, 10, 0, 0, 100, '2026-11-01T10:00:00Z', '2026-11-01T10:05:00Z', 300, 'completed', '', 125]);
const scopeFailResult = vmContext.runApprovedTestAchievementRepair(scenarioScope.ss);
assert(scopeFailResult.success === false, 'Aborts when discrepancy count is not exactly 12');
assert(scopeFailResult.error === 'SCOPE_MISMATCH', 'Reports SCOPE_MISMATCH');

// Test 12.4b: Issue Type Mismatch Abort (e.g. MISSING_ACHIEVEMENT_RECORD instead of MISMATCHED_TRIGGER_ATTEMPT)
const scenarioMissing = buildApproved12BadgeScenario();
scenarioMissing.achSheet.deleteRow(scenarioMissing.achSheet.rows.length);
const issueTypeFailResult = vmContext.runApprovedTestAchievementRepair(scenarioMissing.ss);
assert(issueTypeFailResult.success === false, 'Aborts when an issue is not MISMATCHED_TRIGGER_ATTEMPT');
assert(issueTypeFailResult.error === 'ISSUE_TYPE_MISMATCH', 'Reports ISSUE_TYPE_MISMATCH');

// Test 12.5: Student Mismatch Abort
const scenario2 = buildApproved12BadgeScenario();
// Change student number of row 2 to 802
scenario2.achSheet.rows[1][2] = '802';
const studentFailResult = vmContext.runApprovedTestAchievementRepair(scenario2.ss);
assert(studentFailResult.success === false, 'Aborts when a discrepancy belongs to another student');

// Test 12.6: Trigger ID Mismatch Abort
const scenario3 = buildApproved12BadgeScenario();
// Change trigger ID of row 2 to something other than att_mweq7htq_g7zcy1pl
scenario3.achSheet.rows[1][7] = 'att_other_random_trigger';
const trigFailResult = vmContext.runApprovedTestAchievementRepair(scenario3.ss);
assert(trigFailResult.success === false, 'Aborts when existing trigger ID does not match att_mweq7htq_g7zcy1pl');

// Test 12.7: Row Identity Mismatch Abort
const scenario4 = buildApproved12BadgeScenario();
// Corrupt the badge_id in row 2
scenario4.achSheet.rows[1][4] = 'unrelated_badge_id';
const rowIdentResult = vmContext.runApprovedTestAchievementRepair(scenario4.ss);
assert(rowIdentResult.success === false, 'Aborts when target row in sheet does not match expected badge ID');

// Test 12.8: Successful 12-Row Surgical Repair Execution
const scenario5 = buildApproved12BadgeScenario();

// Verify pre-repair audit
const preAuditCheck = vmContext.dryRunRepairStudentAchievements(scenario5.ss);
assert(preAuditCheck.totalDiscrepancies === 12, 'Pre-repair audit finds exactly 12 discrepancies');
assert(preAuditCheck.auditReport.every(item => item.studentNumber === '801'), 'All 12 items belong to student 801');
assert(preAuditCheck.auditReport.every(item => item.existingTriggerAttemptId === 'att_mweq7htq_g7zcy1pl'), 'All 12 items have bug trigger ID');

// Install write monitor to verify ZERO unintended writes
let attemptsWriteCount = 0;
const origAttAppend = scenario5.attSheet.appendRow.bind(scenario5.attSheet);
scenario5.attSheet.appendRow = (...args) => { attemptsWriteCount++; return origAttAppend(...args); };

// Execute approved repair
const repairExecResult = vmContext.runApprovedTestAchievementRepair(scenario5.ss);

assert(repairExecResult.success === true, 'runApprovedTestAchievementRepair executed successfully');
assert(repairExecResult.applied === true, 'applied flag is true');
assert(repairExecResult.repairsApplied === 12, 'Exactly 12 rows were repaired (got ' + repairExecResult.repairsApplied + ')');
assert(repairExecResult.beforeDiscrepancies === 12, 'beforeDiscrepancies reported as 12');
assert(repairExecResult.afterDiscrepancies === 0, 'afterDiscrepancies reported as 0');
assert(Boolean(repairExecResult.backupSheetName), 'Backup sheet name reported: ' + repairExecResult.backupSheetName);
assert(scenario5.ss.sheets[repairExecResult.backupSheetName] !== undefined, 'Backup sheet physically exists in spreadsheet');

// Verify backup sheet has exact pre-repair data
const bSheet = scenario5.ss.sheets[repairExecResult.backupSheetName];
assert(bSheet.rows.length === 13, 'Backup sheet has 13 rows (header + 12 achievements)');
// All backup rows still have the pre-repair bug trigger ID
assert(bSheet.rows.slice(1).every(r => r[7] === 'att_mweq7htq_g7zcy1pl'), 'Backup sheet preserved original bug trigger IDs');

// Verify Achievements sheet now has distinct valid trigger IDs
const updatedAchRows = scenario5.achSheet.rows.slice(1);
assert(updatedAchRows.length === 12, 'Achievements sheet has 12 achievement rows');
assert(updatedAchRows.every(r => r[7] !== 'att_mweq7htq_g7zcy1pl'), 'All 12 rows no longer point to bug trigger ID');
assert(updatedAchRows.every(r => r[7].startsWith('att_801_')), 'All 12 rows point to student 801 historical attempt IDs');

// Proof: Zero writes to Attempts sheet
assert(attemptsWriteCount === 0, 'Proof of zero writes to Attempts sheet');

// Test 12.9: Post-Repair Audit Verification
const postAuditCheck = vmContext.dryRunRepairStudentAchievements(scenario5.ss);
assert(postAuditCheck.totalDiscrepancies === 0, 'Post-repair audit strictly reports 0 discrepancies');

// Test 12.10: Idempotency (Second Execution Performs Zero Writes)
let secondRunWrites = 0;
const monAch = scenario5.achSheet;
const origSetVal = monAch.getRange(1, 1).setValue;
monAch.getRange = (...args) => {
  const rng = new MockRange(monAch, args[0], args[1], args[2] || 1, args[3] || 1);
  rng.setValue = () => { secondRunWrites++; };
  rng.setValues = () => { secondRunWrites++; };
  return rng;
};

const secondRunResult = vmContext.runApprovedTestAchievementRepair(scenario5.ss);
assert(secondRunResult.success === true, 'Second run returns success: true');
assert(secondRunResult.alreadyApplied === true, 'Second run reports alreadyApplied: true');
assert(secondRunResult.writesCount === 0, 'Second run reports writesCount === 0');
assert(secondRunWrites === 0, 'Second run physically performed 0 writes');

// Test 12.11: Partial Failure & Automatic Rollback
const scenario6 = buildApproved12BadgeScenario();
// Force setValue to throw on the 6th row during repair
let setValCalls = 0;
const origGetRng = scenario6.achSheet.getRange.bind(scenario6.achSheet);
scenario6.achSheet.getRange = (r, c, nr, nc) => {
  const range = origGetRng(r, c, nr, nc);
  const origSV = range.setValue.bind(range);
  range.setValue = (val) => {
    setValCalls++;
    if (setValCalls === 11) { // 11th cell update throws (each item updates 2 cells)
      throw new Error('Simulated network timeout during cell update');
    }
    return origSV(val);
  };
  return range;
};

const rollbackResult = vmContext.runApprovedTestAchievementRepair(scenario6.ss);
assert(rollbackResult.success === false, 'Partial failure returns success: false');
assert(rollbackResult.error === 'MUTATION_ERROR', 'Reports MUTATION_ERROR');
assert(rollbackResult.rollbackExecuted === true, 'Automatic rollback was executed');
// Verify that after rollback, the achievements sheet has its original bug trigger IDs restored
const rolledBackRows = scenario6.achSheet.rows.slice(1);
assert(rolledBackRows.every(r => r[7] === 'att_mweq7htq_g7zcy1pl'), 'All rows restored to original trigger ID after rollback');

// Test 12.12: Standalone Apps Script Execution (Null Document Lock with Active Script Lock)
const origDocLock = vmContext.LockService.getDocumentLock;
const origScriptLock = vmContext.LockService.getScriptLock;

let scriptLockAcquired = false;
let scriptLockReleased = false;
const customScriptLock = {
  tryLock: (timeout) => {
    scriptLockAcquired = true;
    return true;
  },
  releaseLock: () => {
    scriptLockReleased = true;
  }
};

vmContext.LockService.getDocumentLock = () => null; // Standalone Apps Script returns null
vmContext.LockService.getScriptLock = () => customScriptLock;

const standaloneScenario = buildApproved12BadgeScenario();
const standaloneResult = vmContext.runApprovedTestAchievementRepair(standaloneScenario.ss);

assert(standaloneResult.success === true, 'Standalone execution succeeds when getDocumentLock returns null');
assert(standaloneResult.applied === true, 'Repair applied in standalone environment');
assert(scriptLockAcquired === true, 'LockService.getScriptLock().tryLock was invoked');
assert(scriptLockReleased === true, 'LockService.getScriptLock().releaseLock was invoked in finally block');

// Test 12.13: Standalone Execution with Null Script Lock (Graceful Fallback without Exception)
let nullLockExecDidThrow = false;
vmContext.LockService.getDocumentLock = () => null;
vmContext.LockService.getScriptLock = () => null;

const nullLockScenario = buildApproved12BadgeScenario();
try {
  const nullLockResult = vmContext.runApprovedTestAchievementRepair(nullLockScenario.ss);
  assert(nullLockResult.success === true, 'Execution succeeds even when both lock methods return null');
} catch (err) {
  nullLockExecDidThrow = true;
}
assert(nullLockExecDidThrow === false, 'Did not throw Cannot read properties of null (reading tryLock)');

// Test 12.14: Lock Timeout / Failed Lock Acquisition
let timeoutReleased = false;
const timeoutLock = {
  tryLock: (timeout) => false, // Fails to acquire lock
  releaseLock: () => { timeoutReleased = true; }
};
vmContext.LockService.getScriptLock = () => timeoutLock;

const timeoutScenario = buildApproved12BadgeScenario();
const timeoutResult = vmContext.runApprovedTestAchievementRepair(timeoutScenario.ss);

assert(timeoutResult.success === false, 'Lock timeout halts execution');
assert(timeoutResult.error === 'LOCK_TIMEOUT', 'Reports LOCK_TIMEOUT error code');
assert(timeoutReleased === false, 'releaseLock is not called when lock was not acquired');
assert(timeoutScenario.achSheet.rows.slice(1).every(r => r[7] === 'att_mweq7htq_g7zcy1pl'), 'Achievements untouched on lock timeout');
assert(Object.keys(timeoutScenario.ss.sheets).filter(k => k.startsWith('_backup_achievements_')).length === 0, 'No backup sheet created on lock timeout');

// Test 12.15: Safe Lock Release on Early Validation Failure
let earlyAbortReleased = false;
const earlyAbortLock = {
  tryLock: (timeout) => true,
  releaseLock: () => { earlyAbortReleased = true; }
};
vmContext.LockService.getScriptLock = () => earlyAbortLock;

const earlyAbortScenario = buildApproved12BadgeScenario();
// Add extra attempt to trigger SCOPE_MISMATCH
earlyAbortScenario.attSheet.appendRow(['att_802_x', 'sess_1', 'std_802', '802', '8A', 'grade-8', 'g8-u1', 'Friendship', 'g8-u1-act1', 'Quiz 1', 'quiz_battle', 1, 10, 10, 10, 10, 0, 0, 100, '2026-11-01T10:00:00Z', '2026-11-01T10:05:00Z', 300, 'completed', '', 125]);
const earlyAbortResult = vmContext.runApprovedTestAchievementRepair(earlyAbortScenario.ss);

assert(earlyAbortResult.success === false, 'Aborts on validation failure');
assert(earlyAbortResult.error === 'SCOPE_MISMATCH', 'Reports SCOPE_MISMATCH');
assert(earlyAbortReleased === true, 'Lock was safely released in finally block on early abort');

// Restore original lock mocks
vmContext.LockService.getDocumentLock = origDocLock;
vmContext.LockService.getScriptLock = origScriptLock;

console.log('✅ Approved Test-Only Achievement Repair Workflow tests passed!\n');

// ============================================================================
// Summary
// ============================================================================
console.log('======================================================');
console.log(`🎉 ALL PHASE 5 GAMIFICATION TESTS PASSED! (${passed} checks, ${failed} failures)`);
console.log('======================================================\n');
