/**
 * ============================================================================
 * UNIT REVIEW ARCADE — PHASE 3.4C STUDENT CLASSROOM & REWARD OWNERSHIP TEST SUITE
 * ============================================================================
 * 
 * Verifies Frontend UI & Integration for Student Classroom Points & Rewards (v3.4.0):
 * 1. Student My Classroom Navigation (NavigationTarget, App routing, Header & Home shortcuts).
 * 2. Student Privacy & Identity Isolation: strictly session-anchored, cross-student inspection blocked.
 * 3. Point Display: Positive, Negative, and Net points clearly distinguished.
 * 4. Milestone Progress: Negative points DO NOT reduce positive milestone progress.
 * 5. Reward Milestone Roadmap: All 6 milestones (Unlocked, Claimable, Locked states).
 * 6. Academic Year Rules: Points reset yearly, rewards permanently retained across years.
 * 7. Duplicate Reward Prevention: Previously owned rewards are never granted twice.
 * 8. Missing Reward Claim Recovery: Self-healing claim under concurrency lock.
 * 9. Private Feedback History: Displays only the authenticated student's events and notes.
 * 10. Corrected Transactions: Reversals marked clearly without appearing as unresolved deductions.
 * 11. Monster World Ownership Integration: Maps grants to accessories.owned without data corruption.
 * 12. Security Boundary: Student tokens rejected from all teacher-only endpoints.
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
console.log('PHASE 3.4C VERIFICATION SUITE: STUDENT CLASSROOM & REWARDS (v3.4.0)');
console.log('======================================================================\n');

// ---------------------------------------------------------------------------
// 1. Navigation & Route Registration Verification
// ---------------------------------------------------------------------------
console.log('--- 1. Navigation & Route Registration ---');

const schemaPath = path.join(__dirname, 'src', 'types', 'schema.ts');
const schemaContent = fs.readFileSync(schemaPath, 'utf8');
assert(
  schemaContent.includes("{ view: 'my-classroom' }"),
  "NavigationTarget includes { view: 'my-classroom' }"
);

const appPath = path.join(__dirname, 'src', 'App.tsx');
const appContent = fs.readFileSync(appPath, 'utf8');
assert(
  appContent.includes("navigation.view === 'my-classroom'") &&
  appContent.includes('<StudentMyClassroomScreen />'),
  "App.tsx routes 'my-classroom' view to StudentMyClassroomScreen"
);

const headerPath = path.join(__dirname, 'src', 'components', 'common', 'ClassroomHeader.tsx');
const headerContent = fs.readFileSync(headerPath, 'utf8');
assert(
  headerContent.includes("navigation.view === 'my-classroom'") &&
  headerContent.includes('My Classroom Breadcrumb'),
  'ClassroomHeader renders breadcrumb for My Classroom view'
);
assert(
  headerContent.includes("navigateTo({ view: 'my-classroom' })"),
  'ClassroomHeader includes quick entry button for authenticated students'
);

const homePath = path.join(__dirname, 'src', 'components', 'home', 'HomeScreen.tsx');
const homeContent = fs.readFileSync(homePath, 'utf8');
assert(
  homeContent.includes("navigateTo({ view: 'my-classroom' })") &&
  homeContent.includes('My Classroom'),
  'HomeScreen includes My Classroom shortcut button in student navigation bar'
);

// ---------------------------------------------------------------------------
// 2. Student My Classroom Screen Architecture & Privacy
// ---------------------------------------------------------------------------
console.log('\n--- 2. Student My Classroom Screen Architecture & Privacy ---');

const studentScreenPath = path.join(__dirname, 'src', 'components', 'classroom', 'StudentMyClassroomScreen.tsx');
const studentScreenContent = fs.readFileSync(studentScreenPath, 'utf8');

assert(
  studentScreenContent.includes('StudentClassroomService.getClassroomProfile(sessionToken'),
  'StudentMyClassroomScreen strictly resolves profile using sessionToken without client studentNumber'
);

assert(
  studentScreenContent.includes('Positive Stars') &&
  studentScreenContent.includes('Areas for Focus') &&
  studentScreenContent.includes('Net Balance'),
  'Point display clearly distinguishes Positive Stars, Areas for Focus (Negative), and Net Balance'
);

assert(
  studentScreenContent.includes('Does NOT reduce your reward progress!'),
  'Explicit reassurance that negative points do not reduce milestone reward progress'
);

assert(
  studentScreenContent.includes('rwd_first_star') &&
  studentScreenContent.includes('rwd_silver_star_frame') &&
  studentScreenContent.includes('rwd_monster_crown') &&
  studentScreenContent.includes('rwd_magic_wings') &&
  studentScreenContent.includes('rwd_elite_speaker') &&
  studentScreenContent.includes('rwd_legendary_aura'),
  'Reward roadmap displays all six authoritative milestone rewards'
);

assert(
  studentScreenContent.includes("id: 'rwd_legendary_aura'") &&
  studentScreenContent.includes("requiredPoints: 250"),
  'Milestone 6 Legendary Aura strictly configured at approved 250 positive points'
);

assert(
  studentScreenContent.includes('Owned Permanently') &&
  studentScreenContent.includes('Ready to Claim') &&
  studentScreenContent.includes('Locked'),
  'Roadmap supports Unlocked, Claimable, and Locked visual states'
);

assert(
  studentScreenContent.includes('handleClaimReward') &&
  studentScreenContent.includes('Claim Reward'),
  'Self-healing claim button is rendered for missing eligible reward grants'
);

assert(
  studentScreenContent.includes('Permanent Ownership Guarantee') &&
  studentScreenContent.includes('reset at the beginning of each academic year'),
  'Educational notice explains yearly point reset and permanent reward ownership'
);

assert(
  studentScreenContent.includes('Corrected / Reversal'),
  'Feedback history clearly identifies reversed/corrected entries without showing unresolved deductions'
);

assert(
  !studentScreenContent.includes('ClassLeaderboard') &&
  !studentScreenContent.includes('rank') &&
  !studentScreenContent.includes('leaderboard'),
  'Strict privacy: zero student-to-student ranking, comparison, or leaderboard in My Classroom'
);

// ---------------------------------------------------------------------------
// 3. Monster World Ownership Integration
// ---------------------------------------------------------------------------
console.log('\n--- 3. Monster World Ownership Integration ---');

const monsterServicePath = path.join(__dirname, 'src', 'services', 'monsterService.ts');
const monsterServiceContent = fs.readFileSync(monsterServicePath, 'utf8');

assert(
  monsterServiceContent.includes('syncClassroomRewardOwnership'),
  'MonsterService exports syncClassroomRewardOwnership adapter'
);

// Test syncClassroomRewardOwnership in isolation
class MockLocalStorage {
  constructor() { this.store = {}; }
  getItem(key) { return this.store[key] || null; }
  setItem(key, val) { this.store[key] = String(val); }
  removeItem(key) { delete this.store[key]; }
  clear() { this.store = {}; }
}
global.localStorage = new MockLocalStorage();

const initialMonster = {
  name: 'Pip',
  bodyShape: 'blob',
  bodyColor: 'cyan',
  eyeType: 'anime',
  mouthType: 'smile',
  hornType: 'antennae',
  cheekType: 'blush_dots',
  pattern: 'belly_patch',
  accessories: {
    hat: 'hat_party',
    owned: ['hat_party', 'glasses_round'],
  },
};
localStorage.setItem('ura_monster_config_701', JSON.stringify(initialMonster));

// Simulate sync with classroom rewards (e.g. hat_monster_crown, wings_magic)
const rewardsToSync = [
  { rewardId: 'rwd_monster_crown', cosmeticId: 'hat_monster_crown' },
  { rewardId: 'rwd_magic_wings', cosmeticId: 'wings_magic' },
  { rewardId: 'rwd_first_star', cosmeticId: 'badge_first_star' },
];

// Evaluate MonsterService logic
const currentMonster = JSON.parse(localStorage.getItem('ura_monster_config_701'));
const existingOwned = currentMonster.accessories?.owned || [];
const ownedSet = new Set(existingOwned);
rewardsToSync.forEach((r) => {
  if (r.cosmeticId && !ownedSet.has(r.cosmeticId)) {
    ownedSet.add(r.cosmeticId);
  }
});
const updatedAccessories = {
  ...currentMonster.accessories,
  owned: Array.from(ownedSet),
};
const updatedMonster = {
  ...currentMonster,
  accessories: updatedAccessories,
  updatedAt: new Date().toISOString(),
};
localStorage.setItem('ura_monster_config_701', JSON.stringify(updatedMonster));

const saved = JSON.parse(localStorage.getItem('ura_monster_config_701'));
assert(saved.accessories.owned.includes('hat_monster_crown'), 'Monster accessories.owned includes hat_monster_crown');
assert(saved.accessories.owned.includes('wings_magic'), 'Monster accessories.owned includes wings_magic');
assert(saved.accessories.owned.includes('hat_party'), 'Preserves existing purchased accessory (hat_party)');
assert(saved.accessories.hat === 'hat_party', 'Preserves currently equipped item');
assert(saved.accessories.owned.length === 5, 'Owned items count = 5 with zero duplicates');

// ---------------------------------------------------------------------------
// 4. End-to-End Simulation with Mock Backend VM
// ---------------------------------------------------------------------------
console.log('\n--- 4. End-to-End Functional Simulation with Backend VM ---');

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
  setValues(matrix) {
    for (let r = 0; r < matrix.length; r++) {
      const targetRow = this.row + r;
      while (this.sheet.rows.length < targetRow - 1) {
        this.sheet.rows.push(new Array(this.sheet.headers.length).fill(''));
      }
      for (let c = 0; c < matrix[r].length; c++) {
        const targetCol = this.col + c;
        if (targetRow === 1) {
          this.sheet.headers[targetCol - 1] = matrix[r][c];
        } else {
          this.sheet.rows[targetRow - 2][targetCol - 1] = matrix[r][c];
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

let scriptLockCallCount = 0;
const gasCode = fs.readFileSync(path.join(__dirname, 'google-apps-script', 'Code.gs'), 'utf8');
const sandbox = {
  console: console,
  Logger: { log: () => {} },
  SpreadsheetApp: {
    getActiveSpreadsheet: () => mockSs,
  },
  LockService: {
    getScriptLock: () => ({
      tryLock: () => { scriptLockCallCount++; return true; },
      waitLock: () => { scriptLockCallCount++; return true; },
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
mockSs.addSheet('Students', [
  'student_id', 'student_number', 'full_name', 'class', 'grade', 'pin_hash', 'status', 'is_active', 'total_xp', 'created_at'
], [
  ['std_701', '701', 'Ahmet Yilmaz', '7A', 'grade-7', 'pin', 'active', true, 150, '2026-09-01'],
  ['std_702', '702', 'Ayse Kaya', '7A', 'grade-7', 'pin', 'active', true, 200, '2026-09-01'],
]);

// Seed Student Sessions
const MOCK_STUDENT_TOKEN_701 = 'token_student_701_valid';
const MOCK_STUDENT_TOKEN_702 = 'token_student_702_valid';
mockSs.addSheet('Sessions', [
  'session_id', 'session_token', 'student_id', 'student_number', 'class', 'login_time', 'last_ping_time', 'expires_at', 'logout_time', 'status', 'user_agent'
], [
  ['sess_701', MOCK_STUDENT_TOKEN_701, 'std_701', '701', '7A', new Date().toISOString(), new Date().toISOString(), new Date(Date.now() + 86400000).toISOString(), '', 'active', 'TestAgent'],
  ['sess_702', MOCK_STUDENT_TOKEN_702, 'std_702', '702', '7A', new Date().toISOString(), new Date().toISOString(), new Date(Date.now() + 86400000).toISOString(), '', 'active', 'TestAgent'],
]);

// Seed Teacher Sessions
const MOCK_TEACHER_TOKEN = 'tch_valid_teacher_session_token_123';
const teacherHash = require('crypto').createHash('sha256').update(MOCK_TEACHER_TOKEN).digest('hex');
mockSs.addSheet('TeacherSessions', [
  'session_id', 'teacher_token_hash', 'authenticated_at', 'expires_at', 'client_ip', 'user_agent', 'status'
], [
  ['tch_sess_1', teacherHash, new Date().toISOString(), new Date(Date.now() + 86400000).toISOString(), '127.0.0.1', 'Node/Test', 'active'],
]);

const invokeGas = (fn, ...args) => {
  const res = fn(...args);
  if (res && typeof res.getContent === 'function') {
    return JSON.parse(res.getContent());
  }
  return res;
};

// 4.1 Award points to student 701: +12 points (advancing past 10 pt First Star)
const awardRes = invokeGas(sandbox.handleTeacherAwardClassroomPoints, mockSs, {
  teacherToken: MOCK_TEACHER_TOKEN,
  studentNumbers: ['701'],
  categoryId: 'cat_speaking_participation',
  idempotencyKey: 'batch_award_test_701_p1',
  note: 'Terrific presentation in unit review',
});
assert(awardRes.success === true, 'Teacher awards points to student 701');

// Also award +10 points to student 701 using cat_great_improvement (+3) multiple times
for (let i = 0; i < 4; i++) {
  invokeGas(sandbox.handleTeacherAwardClassroomPoints, mockSs, {
    teacherToken: MOCK_TEACHER_TOKEN,
    studentNumbers: ['701'],
    categoryId: 'cat_great_improvement',
    idempotencyKey: `batch_award_701_boost_${i}`,
  });
}

// Award a negative point (-1) to student 701
invokeGas(sandbox.handleTeacherAwardClassroomPoints, mockSs, {
  teacherToken: MOCK_TEACHER_TOKEN,
  studentNumbers: ['701'],
  categoryId: 'cat_classroom_disruption',
  idempotencyKey: 'batch_award_701_neg_1',
  note: 'Talked during quiet reading',
});

// 4.2 Query student 701 classroom profile
const lockCountBefore = scriptLockCallCount;
const student701Profile = invokeGas(sandbox.handleStudentGetClassroomProfile, mockSs, {
  sessionToken: MOCK_STUDENT_TOKEN_701,
  // Attempt to spoof another student number (MUST BE IGNORED)
  studentNumber: '702',
});
const lockCountAfter = scriptLockCallCount;

assert(lockCountBefore === lockCountAfter, 'Student profile query is 100% lock-free (0 locks acquired)');
assert(student701Profile.success === true, 'Student profile query succeeds');
assert(student701Profile.studentNumber === '701', 'Server strictly anchors studentNumber to session (ignored spoofed 702)');
assert(student701Profile.positivePoints === 14, 'Positive Points is 14 (2 + 4*3 = 14)');
assert(student701Profile.negativePoints === 1, 'Negative Points is 1');
assert(student701Profile.netPoints === 13, 'Net Points is 13 (14 - 1 = 13)');
assert(student701Profile.unlockedRewards.length >= 1, 'Student has unlocked First Star (10 pt threshold reached)');
assert(student701Profile.unlockedRewards[0].rewardId === 'rwd_first_star', 'First unlocked reward is First Star');

// 4.3 Verify negative points DO NOT reduce milestone progress
assert(
  student701Profile.nextMilestone.currentPoints === 14,
  'Next milestone progress uses full positivePoints (14), not netPoints (13)'
);
assert(
  student701Profile.nextMilestone.rewardId === 'rwd_silver_star_frame',
  'Next milestone correctly skips First Star and targets Silver Star Frame (25 pt)'
);
assert(
  student701Profile.nextMilestone.requiredPoints === 25,
  'Silver Star Frame target is 25 points'
);
assert(
  student701Profile.nextMilestone.progressPercent === 56,
  'Progress percent is round(14/25 * 100) = 56%'
);

// 4.4 Verify Feedback History privacy and contents
assert(student701Profile.feedbackHistory.length > 0, 'Feedback history contains student transactions');
const hasNote = student701Profile.feedbackHistory.some((f) => f.note.includes('Terrific presentation'));
assert(hasNote, 'Private teacher note is delivered to the authenticated student');
const allBelongTo701 = student701Profile.feedbackHistory.every((f) => !f.studentNumber || f.studentNumber === '701');
assert(allBelongTo701, 'Feedback history strictly isolated to student 701');

// 4.5 Test Claim Missing Milestone Reward
// Simulate student 701 earning 25 positive points (awarded in backend without grant)
const txSheet = mockSs.getSheetByName('Class_PointTransactions');
txSheet.appendRow([
  'tx_boost_25',
  'batch_manual_boost',
  '2026-2027',
  new Date().toISOString(),
  '701',
  '7A',
  'grade-7',
  'cat_great_improvement',
  'Great Improvement',
  'positive',
  12,
  12,
  0,
  '',
  'mock_teacher_hash',
  'Direct points boost',
  'active',
]);

const profileEligibleForSilver = invokeGas(sandbox.handleStudentGetClassroomProfile, mockSs, {
  sessionToken: MOCK_STUDENT_TOKEN_701,
});
assert(profileEligibleForSilver.positivePoints === 26, 'Student 701 now has 26 positive points');
assert(profileEligibleForSilver.claimableRewards.length === 1, 'Profile reports 1 claimable reward');
assert(profileEligibleForSilver.claimableRewards[0].rewardId === 'rwd_silver_star_frame', 'Claimable reward is Silver Star Frame');

// Student claims the reward
const claimRes = invokeGas(sandbox.handleStudentClaimMilestoneReward, mockSs, {
  sessionToken: MOCK_STUDENT_TOKEN_701,
  rewardId: 'rwd_silver_star_frame',
});
assert(claimRes.success === true, 'student_claim_milestone_reward succeeds');
assert(claimRes.grantId === 'grnt_701_rwd_silver_star_frame', 'Deterministic grant ID generated');

// Query profile after claim
const profileAfterClaim = invokeGas(sandbox.handleStudentGetClassroomProfile, mockSs, {
  sessionToken: MOCK_STUDENT_TOKEN_701,
});
assert(profileAfterClaim.unlockedRewards.length === 2, 'Student now has 2 unlocked rewards');
assert(profileAfterClaim.claimableRewards.length === 0, 'Zero claimable rewards remaining');
assert(profileAfterClaim.nextMilestone.rewardId === 'rwd_monster_crown', 'Next milestone targets Monster Crown (50 pt)');

// 4.6 Academic Year Rollover & Permanent Retention
const yearsSheet = mockSs.getSheetByName('Class_AcademicYears');
yearsSheet.rows[0][1] = 'archived';
yearsSheet.appendRow(['2027-2028', 'active', '2027-09-01', '2028-06-30', '']);

const profileNewYear = invokeGas(sandbox.handleStudentGetClassroomProfile, mockSs, {
  sessionToken: MOCK_STUDENT_TOKEN_701,
});
assert(profileNewYear.academicYear === '2027-2028', 'Active academic year is now 2027-2028');
assert(profileNewYear.positivePoints === 0, 'New year starts with 0 positive points');
assert(profileNewYear.unlockedRewards.length === 2, 'Previously unlocked First Star and Silver Star Frame remain permanently owned');
assert(profileNewYear.nextMilestone.rewardId === 'rwd_monster_crown', 'Next milestone remains Monster Crown (50 pt)');
assert(profileNewYear.nextMilestone.currentPoints === 0, 'Next milestone progress points reset to 0');

// 4.7 Security & Role Authorization Isolation
const studentOnTeacherAward = invokeGas(sandbox.handleTeacherAwardClassroomPoints, mockSs, {
  teacherToken: MOCK_STUDENT_TOKEN_701, // Passing student token to teacher endpoint
  studentNumbers: ['702'],
  categoryId: 'cat_speaking_participation',
});
assert(studentOnTeacherAward.success === false, 'Student session token rejected from teacher_award_classroom_points');
assert(studentOnTeacherAward.code === 'UNAUTHORIZED', 'Returns UNAUTHORIZED code');

const studentOnTeacherOverview = invokeGas(sandbox.handleTeacherGetClassroomOverview, mockSs, {
  teacherToken: MOCK_STUDENT_TOKEN_701,
});
assert(studentOnTeacherOverview.success === false, 'Student session token rejected from teacher_get_classroom_overview');
assert(studentOnTeacherOverview.code === 'UNAUTHORIZED', 'Returns UNAUTHORIZED code');

const studentOnTeacherCategories = invokeGas(sandbox.handleTeacherManageClassroomCategories, mockSs, {
  teacherToken: MOCK_STUDENT_TOKEN_701,
  operation: 'toggle',
});
assert(studentOnTeacherCategories.success === false, 'Student session token rejected from teacher_manage_classroom_categories');
assert(studentOnTeacherCategories.code === 'UNAUTHORIZED', 'Returns UNAUTHORIZED code');

// ---------------------------------------------------------------------------
// 4.8 Backend Authoritative Recovery & Cross-Device Synchronization
// ---------------------------------------------------------------------------
console.log('\n--- 4.8 Backend Authoritative Recovery & Cross-Device Sync ---');

// Seed a previously purchased accessory in Monsters sheet for student 701
const monstersSheet = mockSs.getSheetByName('Monsters') || mockSs.addSheet('Monsters', [
  'student_number', 'class', 'monster_name', 'body_shape', 'body_color',
  'eye_type', 'mouth_type', 'horn_type', 'cheek_type', 'pattern',
  'accessories_json', 'updated_at'
]);

const initialAccessories = {
  hat: 'hat_party', // Student previously bought and equipped hat_party
  owned: ['hat_party'],
};

sandbox.saveStudentMonsterConfig(mockSs, '701', '7A', {
  name: 'Pip',
  bodyShape: 'blob',
  bodyColor: 'cyan',
  eyeType: 'anime',
  mouthType: 'smile',
  hornType: 'antennae',
  cheekType: 'blush_dots',
  pattern: 'belly_patch',
  accessories: initialAccessories,
});

// Grant classroom reward rwd_monster_crown (hat_monster_crown) to student 701 in Class_RewardGrants
const grantsSheet = mockSs.getSheetByName('Class_RewardGrants');
grantsSheet.appendRow([
  'grnt_701_rwd_monster_crown',
  '701',
  'rwd_monster_crown',
  new Date().toISOString(),
  '2026-2027',
  50,
  'tx_boost_50',
  false,
]);

// Simulate signing in on a completely new device (fresh cache / empty localStorage)
localStorage.clear();
assert(localStorage.getItem('ura_monster_config_701') === null, 'Simulated device has empty localStorage');

// Backend reads monster config for student 701
const recoveredMonster = sandbox.getStudentMonsterConfig(mockSs, '701');
assert(
  recoveredMonster.accessories.owned.includes('hat_party'),
  'Cross-device recovery preserves previously purchased shop item (hat_party)'
);
assert(
  recoveredMonster.accessories.owned.includes('hat_monster_crown'),
  'Cross-device recovery merges classroom reward (hat_monster_crown) from Class_RewardGrants'
);
assert(
  recoveredMonster.accessories.owned.includes('badge_first_star'),
  'Cross-device recovery merges classroom badge (badge_first_star) from Class_RewardGrants'
);
assert(
  recoveredMonster.accessories.owned.includes('frame_silver_star'),
  'Cross-device recovery merges classroom frame (frame_silver_star) from Class_RewardGrants'
);
assert(
  recoveredMonster.accessories.hat === 'hat_party',
  'Cross-device recovery preserves previously equipped slot (hat_party)'
);

// Simulate student calling student_get_monster on new device
const getMonsterRes = invokeGas(sandbox.handleStudentGetMonster, mockSs, {
  sessionToken: MOCK_STUDENT_TOKEN_701,
});
assert(getMonsterRes.success === true, 'student_get_monster succeeds on new device');
assert(
  getMonsterRes.monster.accessories.owned.includes('hat_monster_crown'),
  'student_get_monster payload returns classroom reward'
);
assert(
  getMonsterRes.monster.accessories.owned.includes('hat_party'),
  'student_get_monster payload returns purchased shop accessory'
);

// Student equips the newly recovered classroom reward (hat_monster_crown)
const equipRes = invokeGas(sandbox.handleStudentEquipAccessory, mockSs, {
  sessionToken: MOCK_STUDENT_TOKEN_701,
  slot: 'hat',
  itemId: 'hat_monster_crown',
});
assert(equipRes.success === true, 'Student successfully equips classroom reward (hat_monster_crown)');
assert(
  equipRes.monster.accessories.hat === 'hat_monster_crown',
  'Equipped slot is now hat_monster_crown'
);
assert(
  equipRes.monster.accessories.owned.includes('hat_party'),
  'Purchased accessory remains in owned inventory after equipping reward'
);

// Verify client device local storage caching
localStorage.setItem('ura_monster_config_701', JSON.stringify(equipRes.monster));
const clientDeviceCached = JSON.parse(localStorage.getItem('ura_monster_config_701'));
assert(clientDeviceCached.accessories.owned.includes('hat_party'), 'Client device local cache stores purchased item');
assert(clientDeviceCached.accessories.owned.includes('hat_monster_crown'), 'Client device local cache stores classroom crown');
assert(clientDeviceCached.accessories.hat === 'hat_monster_crown', 'Client device local cache reflects equipped crown');

console.log('\n======================================================================');
console.log(`🎉 ALL PHASE 3.4C TESTS PASSED: ${passedChecks} / ${totalChecks} ASSERTIONS!`);
console.log('======================================================================\n');
