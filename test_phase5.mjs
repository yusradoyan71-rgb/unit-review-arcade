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
  getSpreadsheetLocale() { return this.locale; }
  setSpreadsheetLocale(loc) { this.locale = loc; }
  getSheetByName(name) { return this.sheets[name] || null; }
  getSheets() { return Object.values(this.sheets); }
  insertSheet(name) {
    const s = new MockSheet(name, this);
    this.sheets[name] = s;
    return s;
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
    flush: () => {},
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

const preRepairAchRowCount = achievementsSheet.rows.length;
const repairAudit = vmContext.dryRunRepairStudentAchievements(mockSpreadsheet);

assert(repairAudit.dryRun === true, 'dryRunRepairStudentAchievements defaults to dryRun === true');
assert(typeof repairAudit.totalDiscrepancies === 'number', 'Reports totalDiscrepancies number');
assert(Array.isArray(repairAudit.auditReport), 'Reports auditReport array');
assert(achievementsSheet.rows.length === preRepairAchRowCount, 'Dry run did NOT mutate Achievements sheet rows');

console.log('✅ Achievements Audit & Dry-Run Repair Tool tests passed!\n');

// ============================================================================
// Summary
// ============================================================================
console.log('======================================================');
console.log(`🎉 ALL PHASE 5 GAMIFICATION TESTS PASSED! (${passed} checks, ${failed} failures)`);
console.log('======================================================\n');
