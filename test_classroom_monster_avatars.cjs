/**
 * CLASSROOM POINTS MONSTER AVATARS VERIFICATION SUITE
 * 
 * Verifies that Teacher Dashboard Classroom Points student cards:
 * 1. Display customized Monster World avatars (hatched monsters & unhatched eggs).
 * 2. Reuse MonsterAvatar vector renderer and existing data structures.
 * 3. Pre-aggregate in-memory in single batch read (O(1) lookups, 0 script locks).
 * 4. Apply earned Classroom Points reward cosmetics (frames, crowns, wings, auras).
 * 5. Handle missing profiles & incomplete customization gracefully.
 * 6. Strictly preserve Projector Privacy Mode, selection, filtering, and zero credential leaks.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('======================================================================');
console.log('VERIFICATION SUITE: CLASSROOM POINTS MONSTER AVATARS');
console.log('======================================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passCount++;
  } else {
    console.error(`  ✗ FAILED: ${message}`);
    failCount++;
  }
}

// -----------------------------------------------------------------------------
// 1. BACKEND: Apps Script Code.gs Verification in VM
// -----------------------------------------------------------------------------
console.log('--- 1. Backend Batch Pre-aggregation & Data Enrichment (Code.gs) ---');

const codeGsPath = path.join(__dirname, 'google-apps-script', 'Code.gs');
const codeGsSource = fs.readFileSync(codeGsPath, 'utf8');

let lockAcquisitionCount = 0;
let sheetReadCount = 0;

class MockRange {
  constructor(sheet, row, col, numRows = 1, numCols = 1) {
    this.sheet = sheet;
    this.row = row;
    this.col = col;
    this.numRows = numRows;
    this.numCols = numCols;
  }
  setValue(val) {
    while (this.sheet.rows.length < this.row) {
      this.sheet.rows.push(new Array(this.sheet.headers.length).fill(''));
    }
    this.sheet.rows[this.row - 1][this.col - 1] = val;
  }
  getValues() {
    sheetReadCount++;
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
    sheetReadCount++;
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

// Build 59 student roster (7A: 15, 7B: 15, 8A: 15, 8B: 14)
const studentRows = [];
const monsterRows = [];
const attemptRows = [];
const grantRows = [];
const txRows = [];

let totalStudents = 0;
const classes = [
  { id: '7A', count: 15, base: 701, grade: 'grade-7' },
  { id: '7B', count: 15, base: 721, grade: 'grade-7' },
  { id: '8A', count: 15, base: 801, grade: 'grade-8' },
  { id: '8B', count: 14, base: 821, grade: 'grade-8' }
];

classes.forEach(c => {
  for (let i = 0; i < c.count; i++) {
    const sNum = String(c.base + i);
    totalStudents++;
    studentRows.push([
      `std_${sNum}`,
      sNum,
      `Student ${sNum}`,
      c.grade,
      c.id,
      'salt_secret',
      'hash_secret',
      true,
      0,
      '',
      '2026-09-01T08:00:00Z',
      '2026-11-20T10:00:00Z'
    ]);

    // Student customization variants:
    // Every 4th student has NO monster profile (test missing profile handling)
    if (i % 4 !== 3) {
      const isCustomizedHatched = i % 2 === 0;
      monsterRows.push([
        `mst_${sNum}`,
        sNum,
        isCustomizedHatched ? `Glowy_${sNum}` : 'EggBuddy',
        i % 2 === 0 ? 'fuzzy' : 'blob',
        i % 3 === 0 ? 'purple' : (i % 3 === 1 ? 'cyan' : 'lime'),
        'anime',
        'smile',
        'twin_horns',
        'blush_dots',
        'belly_patch',
        JSON.stringify({
          owned: ['hat_party', 'glasses_round'],
          hat: 'hat_party',
          glasses: 'glasses_round',
          clothing: null,
          wings: null,
          aura: null,
          frame: null
        }),
        '2026-11-20T12:00:00Z'
      ]);
    }

    // Assign XP:
    // Even indices: Hatched (XP = 1200 - 3200)
    // Odd indices: Unhatched (XP = 100 - 350)
    const xp = (i % 2 === 0) ? (1200 + i * 150) : (100 + i * 20);
    attemptRows.push([
      `att_${sNum}_1`,
      sNum,
      'act_test_1',
      'completed',
      10,
      10,
      100,
      xp,
      30,
      '2026-11-20T10:00:00Z',
      '2026-11-20T10:05:00Z'
    ]);

    // Points & Grants:
    // High performers have reward milestones unlocked
    if (i % 2 === 0) {
      txRows.push([
        `tx_${sNum}_1`,
        '2026-2027',
        sNum,
        c.id,
        'cat_speaking',
        'Speaking in English',
        30,
        30,
        0,
        30,
        'Great debate',
        'tch_001',
        '2026-11-20T10:00:00Z',
        ''
      ]);
      grantRows.push([
        `grt_${sNum}_1`,
        sNum,
        'rwd_first_star',
        'First Star',
        10,
        '2026-11-20T10:00:00Z',
        '2026-2027'
      ]);
      grantRows.push([
        `grt_${sNum}_2`,
        sNum,
        'rwd_silver_star_frame',
        'Silver Star Frame',
        25,
        '2026-11-20T10:00:00Z',
        '2026-2027'
      ]);
    }
  }
});

const mockSheets = {
  'Students': new MockSheet('Students', [
    'student_id', 'student_number', 'full_name', 'grade', 'class',
    'pin_salt', 'pin_hash', 'is_active', 'failed_attempts',
    'locked_until', 'created_at', 'last_login_at'
  ], studentRows),
  'Monsters': new MockSheet('Monsters', [
    'monster_id', 'student_number', 'monster_name', 'body_shape',
    'body_color', 'eye_type', 'mouth_type', 'horn_type', 'cheek_type',
    'pattern', 'accessories_json', 'updated_at'
  ], monsterRows),
  'Attempts': new MockSheet('Attempts', [
    'attempt_id', 'student_number', 'activity_id', 'status',
    'score', 'max_score', 'percentage', 'xp_earned', 'coins_earned',
    'started_at', 'completed_at'
  ], attemptRows),
  'Class_RewardGrants': new MockSheet('Class_RewardGrants', [
    'grant_id', 'student_number', 'reward_id', 'reward_name',
    'required_points', 'granted_at', 'academic_year'
  ], grantRows),
  'Class_PointTransactions': new MockSheet('Class_PointTransactions', [
    'transaction_id', 'academic_year', 'student_number', 'class',
    'category_id', 'category_name', 'gross_points', 'positive_points',
    'negative_points', 'running_positive_points', 'note', 'created_by_teacher_id',
    'created_at', 'reversed_at'
  ], txRows),
  'Class_RewardDefinitions': new MockSheet('Class_RewardDefinitions', [
    'reward_id', 'name', 'description', 'required_points', 'reward_type',
    'cosmetic_id', 'icon', 'display_order', 'is_active', 'created_at'
  ], [
    ['rwd_first_star', 'First Star', 'Star', 10, 'badge', 'badge_first_star', 'Star', 1, true, '2026-09-01'],
    ['rwd_silver_star_frame', 'Silver Star Frame', 'Frame', 25, 'frame', 'frame_silver_star', 'Sparkles', 2, true, '2026-09-01'],
    ['rwd_monster_crown', 'Monster Crown', 'Crown', 50, 'hat', 'hat_monster_crown', 'Crown', 3, true, '2026-09-01'],
    ['rwd_magic_wings', 'Magic Wings', 'Wings', 100, 'wings', 'wings_magic', 'Feather', 4, true, '2026-09-01'],
    ['rwd_elite_speaker', 'Elite Speaker', 'Badge', 150, 'badge', 'badge_elite_speaker', 'Award', 5, true, '2026-09-01'],
    ['rwd_legendary_aura', 'Legendary Aura', 'Aura', 250, 'aura', 'aura_legendary', 'Zap', 6, true, '2026-09-01']
  ]),
  'Class_AcademicYears': new MockSheet('Class_AcademicYears', [
    'year_id', 'name', 'start_date', 'end_date', 'is_active', 'created_at'
  ], [
    ['2026-2027', '2026-2027', '2026-09-01', '2027-06-30', true, '2026-09-01']
  ]),
  'TeacherSessions': new MockSheet('TeacherSessions', [
    'session_id', 'teacher_id', 'token', 'expires_at', 'created_at', 'last_seen_at'
  ], [
    ['sess_1', 'tch_001', 'valid_teacher_token', '2029-01-01T00:00:00Z', '2026-09-01', '2026-11-20']
  ])
};

const mockSpreadsheet = {
  getSheetByName: (n) => mockSheets[n] || null,
  getSheets: () => Object.values(mockSheets)
};

const sandbox = {
  console: console,
  JSON: JSON,
  Math: Math,
  Date: Date,
  String: String,
  Number: Number,
  Array: Array,
  RegExp: RegExp,
  Utilities: {
    getUuid: () => 'uuid_' + Math.random().toString(36).substring(2, 9),
    computeDigest: () => [1, 2, 3],
    DigestAlgorithm: { SHA_256: 'SHA_256' },
    base64Encode: () => 'b64'
  },
  ContentService: {
    MimeType: { JSON: 'application/json' },
    createTextOutput: (text) => ({
      setMimeType: () => {},
      getContent: () => text
    })
  },
  SpreadsheetApp: {
    openById: () => mockSpreadsheet,
    getActiveSpreadsheet: () => mockSpreadsheet
  },
  LockService: {
    getScriptLock: () => ({
      waitLock: (timeout) => { lockAcquisitionCount++; return true; },
      tryLock: (timeout) => { lockAcquisitionCount++; return true; },
      releaseLock: () => {}
    })
  },
  PropertiesService: {
    getScriptProperties: () => ({
      getProperty: (key) => null,
      setProperty: (k, v) => {}
    })
  }
};

vm.createContext(sandbox);
vm.runInContext(codeGsSource, sandbox);

// Patch validateTeacherSession for mock testing
sandbox.validateTeacherSession = function(ss, token) {
  if (token === 'valid_teacher_token') return { valid: true, error: null };
  return { valid: false, error: 'Unauthorized', code: 'UNAUTHORIZED' };
};

// Test handleTeacherGetClassroomOverview
lockAcquisitionCount = 0;
sheetReadCount = 0;

const overviewResponseRaw = sandbox.handleTeacherGetClassroomOverview(mockSpreadsheet, {
  teacherToken: 'valid_teacher_token',
  classId: 'all'
});

const overviewData = JSON.parse(overviewResponseRaw.getContent());

assert(overviewData.success === true, 'handleTeacherGetClassroomOverview returns success: true');
assert(overviewData.students && overviewData.students.length === 59, `Returns all 59 students across classes (got ${overviewData.students?.length})`);
assert(lockAcquisitionCount === 0, `Overview operation is strictly 100% lock-free (got ${lockAcquisitionCount} script locks)`);
assert(sheetReadCount <= 20, `Batch reads executed in single pass (got ${sheetReadCount} sheet reads for 59 students, avoiding N+1 reads)`);

// Verify students data structure
const sampleHatched = overviewData.students.find(s => s.isHatched === true);
const sampleEgg = overviewData.students.find(s => s.isHatched === false);
const sampleMissingProfile = overviewData.students.find(s => s.studentNumber === '704'); // i=3 in 7A had no monster row

assert(sampleHatched !== undefined, 'Hatched monster student found in cohort');
assert(sampleHatched.monsterStage === 'adventurer' || sampleHatched.monsterStage === 'hatchling', `Hatched monster has active stage: ${sampleHatched?.monsterStage}`);
assert(sampleHatched.evolutionTier >= 1, `Hatched monster has evolutionTier >= 1 (got ${sampleHatched?.evolutionTier})`);
assert(sampleHatched.monster && sampleHatched.monster.bodyColor !== undefined, `Hatched monster preserves custom colors and attributes (${sampleHatched?.monster?.bodyColor})`);

// Check reward cosmetic ownership without auto-equipping
assert(sampleHatched.monster.accessories && !sampleHatched.monster.accessories.frame, 'Earned rewards are NOT automatically equipped unless chosen by student');
assert(sampleHatched.monster.accessories.owned && sampleHatched.monster.accessories.owned.includes('frame_silver_star'), 'Earned reward frame_silver_star added to owned accessories list');

assert(sampleEgg !== undefined, 'Unhatched egg student found in cohort');
assert(sampleEgg.isHatched === false, 'Unhatched student has isHatched: false');
assert(sampleEgg.monsterStage === 'egg' || sampleEgg.monsterStage === 'cracking', `Unhatched student has egg/cracking stage: ${sampleEgg?.monsterStage}`);
assert(sampleEgg.evolutionTier === 0, `Unhatched egg has evolutionTier: 0 (got ${sampleEgg?.evolutionTier})`);

assert(sampleMissingProfile !== undefined, 'Student with missing monster row handled gracefully');
assert(sampleMissingProfile.monster && typeof sampleMissingProfile.monster === 'object', 'Default monster config assigned for missing profile without crash');
assert(sampleMissingProfile.monster.name !== undefined, `Default monster has name: ${sampleMissingProfile?.monster?.name}`);

// Security check: Verify no private credentials or secrets in student payloads
let leaksDetected = 0;
overviewData.students.forEach(s => {
  if (s.pin || s.salt || s.hash || s.pin_hash || s.pin_salt || s.password) {
    leaksDetected++;
  }
});
assert(leaksDetected === 0, 'Zero credentials, salts, hashes, or passwords leaked in student payload');

// -----------------------------------------------------------------------------
// 2. FRONTEND: Component Architecture & Source Checks
// -----------------------------------------------------------------------------
console.log('\n--- 2. Frontend UI Architecture & Privacy Verification ---');

const gridTsxPath = path.join(__dirname, 'src', 'components', 'teacher', 'dashboard', 'classroom', 'ClassroomStudentGrid.tsx');
const gridTsxSource = fs.readFileSync(gridTsxPath, 'utf8');

assert(gridTsxSource.includes('MonsterAvatar'), 'ClassroomStudentGrid imports MonsterAvatar');
assert(gridTsxSource.includes('size={52}'), 'MonsterAvatar rendered with appropriate 52px dimension for student cards');
assert(gridTsxSource.includes('student.monsterStage'), 'MonsterAvatar consumes student.monsterStage');
assert(gridTsxSource.includes('student.evolutionTier'), 'MonsterAvatar consumes student.evolutionTier');
assert(gridTsxSource.includes('student.isHatched'), 'Student card checks student.isHatched for label display');

// Privacy mode check
assert(gridTsxSource.includes('isProjectorPrivacyMode'), 'ClassroomStudentGrid supports isProjectorPrivacyMode');
const privacySection = gridTsxSource.split('isProjectorPrivacyMode ? (')[1]?.split(') : (')[0] || '';
assert(privacySection.includes('positivePoints'), 'Projector Privacy Mode displays positive points');
assert(!privacySection.includes('negativePoints'), 'Projector Privacy Mode STRICTLY excludes negative points');
assert(!privacySection.includes('netPoints'), 'Projector Privacy Mode STRICTLY excludes net points');

// MonsterAvatar component check
const avatarTsxPath = path.join(__dirname, 'src', 'components', 'monster', 'MonsterAvatar.tsx');
const avatarTsxSource = fs.readFileSync(avatarTsxPath, 'utf8');
assert(avatarTsxSource.includes('isEgg = isEggStage || isCrackingStage'), 'MonsterAvatar correctly handles egg & cracking stages');
assert(avatarTsxSource.includes('equippedAccessories'), 'MonsterAvatar renders equipped accessories (hat, wings, aura, frame)');

// -----------------------------------------------------------------------------
// 3. TYPESCRIPT & INTERFACE DEFINITIONS
// -----------------------------------------------------------------------------
console.log('\n--- 3. Type Definitions & Contract Integrity ---');

const typesPath = path.join(__dirname, 'src', 'types', 'classroomPoints.ts');
const typesSource = fs.readFileSync(typesPath, 'utf8');

assert(typesSource.includes('monster?: MonsterConfig | null;'), 'ClassroomStudentSummary defines monster?: MonsterConfig');
assert(typesSource.includes('monsterStage?: MonsterLifecycleStage;'), 'ClassroomStudentSummary defines monsterStage?: MonsterLifecycleStage');
assert(typesSource.includes('evolutionTier?: number;'), 'ClassroomStudentSummary defines evolutionTier?: number');
assert(typesSource.includes('isHatched?: boolean;'), 'ClassroomStudentSummary defines isHatched?: boolean');

console.log('\n======================================================================');
console.log(`TEST SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
console.log('======================================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL CLASSROOM POINTS MONSTER AVATAR TESTS PASSED!');
  process.exit(0);
}
