/**
 * ============================================================================
 * UNIT REVIEW ARCADE — PHASE 3.4A BACKEND TEST SUITE
 * ============================================================================
 * 
 * Verifies backend implementation of Classroom Points & Rewards (v3.4.0):
 * 1. Sheet schema initialization & seed data.
 * 2. Point calculation math: gross_points, positive_points, negative_points.
 * 3. Ordinary negative points non-reduction of reward milestones.
 * 4. Pure append-only administrative reversals & zero double subtraction.
 * 5. Double-reversal prevention (ALREADY_REVERSED).
 * 6. Deduplication & per-student idempotency in batch awards.
 * 7. Safe retry handling after partial batch failures.
 * 8. Current academic-year isolation.
 * 9. Permanent reward ownership across academic years without duplicate grants.
 * 10. Next unowned milestone calculation (skips previously unlocked rewards).
 * 11. Self-healing reward reconciliation under LockService.
 * 12. Student milestone claim mutation with deterministic grant IDs.
 * 13. Lock-free, pure read-only student profile queries.
 * 14. Server-side authorization isolation & student session anchoring.
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
console.log('PHASE 3.4A VERIFICATION SUITE: CLASSROOM POINTS & REWARDS BACKEND');
console.log('======================================================================\n');

// 1. Mock Google Apps Script Environment
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
  setValues(vals) {
    for (let r = 0; r < vals.length; r++) {
      const sheetRow = this.row + r;
      if (sheetRow === 1) {
        this.sheet.headers = [...vals[r]];
      } else {
        const dataRowIdx = sheetRow - 2;
        while (this.sheet.rows.length <= dataRowIdx) {
          this.sheet.rows.push(new Array(this.sheet.headers.length || vals[r].length).fill(''));
        }
        for (let c = 0; c < vals[r].length; c++) {
          const targetCol = this.col + c;
          this.sheet.rows[dataRowIdx][targetCol - 1] = vals[r][c];
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

// 2. Load Code.gs into Node VM
const codeGsPath = path.resolve(__dirname, 'google-apps-script/Code.gs');
const codeGsContent = fs.readFileSync(codeGsPath, 'utf8');

let scriptLockCallCount = 0;
let scriptLockReleaseCount = 0;

const sandbox = {
  console: console,
  Logger: { log: () => {} },
  Utilities: {
    base64Encode: (str) => Buffer.from(str).toString('base64'),
    base64Decode: (str) => Buffer.from(str, 'base64').toString('utf8'),
    getUuid: () => 'uuid_' + Math.random().toString(36).substring(2, 10),
    computeDigest: (algo, str) => {
      // Mock SHA-256 byte array
      const hash = require('crypto').createHash('sha256').update(str).digest();
      return Array.from(hash).map((b) => (b > 127 ? b - 256 : b));
    },
    DigestAlgorithm: { SHA_256: 'SHA_256' },
    formatDate: (date, tz, fmt) => date.toISOString(),
  },
  LockService: {
    getScriptLock: () => ({
      waitLock: () => { scriptLockCallCount++; return undefined; }, // Faithful to GAS: waitLock returns void/undefined
      tryLock: (timeout) => { scriptLockCallCount++; return true; }, // GAS tryLock returns boolean
      releaseLock: () => { scriptLockReleaseCount++; },
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
  Date: Date,
  Math: Math,
  JSON: JSON,
  String: String,
  Number: Number,
  Boolean: Boolean,
  Array: Array,
  Object: Object,
  RegExp: RegExp,
};

vm.createContext(sandbox);
vm.runInContext(codeGsContent, sandbox);

// 3. Build baseline test spreadsheet
const ss = new MockSpreadsheet();

// Seed baseline Students
ss.addSheet('Students', [
  'student_id', 'student_number', 'full_name', 'grade', 'class', 'pin_salt', 'pin_hash', 'is_active', 'failed_attempts', 'locked_until', 'created_at', 'last_login_at'
], [
  ['std_701', '701', 'Kerem Yılmaz', 'grade-7', '7A', 'salt1', 'hash1', true, 0, null, '2026-11-01', '2026-11-20T10:00:00Z'],
  ['std_702', '702', 'Zeynep Kaya', 'grade-7', '7A', 'salt2', 'hash2', true, 0, null, '2026-11-01', '2026-11-20T10:00:00Z'],
  ['std_703', '703', 'Mehmet Demir', 'grade-7', '7A', 'salt3', 'hash3', true, 0, null, '2026-11-01', '2026-11-20T10:00:00Z'],
  ['std_801', '801', 'Barış Arslan', 'grade-8', '8A', 'salt4', 'hash4', true, 0, null, '2026-11-01', '2026-11-20T10:00:00Z'],
]);

// Seed Student Sessions
const MOCK_STUDENT_TOKEN_701 = 'uat_student_701_valid_token_xyz';
const MOCK_STUDENT_TOKEN_702 = 'uat_student_702_valid_token_abc';
ss.addSheet('Sessions', [
  'session_id', 'session_token', 'student_id', 'student_number', 'class', 'created_at', 'expires_at', 'is_active'
], [
  ['sess_701', MOCK_STUDENT_TOKEN_701, 'std_701', '701', '7A', new Date().toISOString(), new Date(Date.now() + 86400000).toISOString(), true],
  ['sess_702', MOCK_STUDENT_TOKEN_702, 'std_702', '702', '7A', new Date().toISOString(), new Date(Date.now() + 86400000).toISOString(), true],
]);

// Seed Teacher Sessions (Teacher token hash)
const MOCK_TEACHER_TOKEN = 'tch_valid_teacher_session_token_123';
const teacherHash = require('crypto').createHash('sha256').update(MOCK_TEACHER_TOKEN).digest('hex');
ss.addSheet('TeacherSessions', [
  'session_id', 'teacher_token_hash', 'authenticated_at', 'expires_at', 'client_ip', 'user_agent', 'status'
], [
  ['tch_sess_1', teacherHash, new Date().toISOString(), new Date(Date.now() + 86400000).toISOString(), '127.0.0.1', 'Node/Test', 'active'],
]);

async function runTestSuite() {
  // -------------------------------------------------------------------------
  // 1. Sheet Initialization & Schema Verification
  // -------------------------------------------------------------------------
  console.log('--- 1. Sheet Schemas & Safe Initialization ---');
  const initResult = sandbox.setupClassroomPointsSheets(ss);
  assert(initResult.success === true, 'setupClassroomPointsSheets executes safely');
  assert(ss.getSheetByName('Class_PointTransactions') !== null, 'Class_PointTransactions exists');
  assert(ss.getSheetByName('Class_Categories') !== null, 'Class_Categories exists');
  assert(ss.getSheetByName('Class_RewardDefinitions') !== null, 'Class_RewardDefinitions exists');
  assert(ss.getSheetByName('Class_RewardGrants') !== null, 'Class_RewardGrants exists');
  assert(ss.getSheetByName('Class_AcademicYears') !== null, 'Class_AcademicYears exists');

  const catMap = sandbox.getClassroomCategoriesMap(ss);
  assert(Object.keys(catMap).length === 9, 'Exactly 9 default behavior categories seeded');
  assert(catMap['cat_speaking_participation'].defaultPoints === 2, 'Speaking Participation has +2 points');
  assert(catMap['cat_classroom_disruption'].defaultPoints === -1, 'Classroom Disruption has -1 points');

  const rewardDefs = sandbox.getClassroomRewardDefinitions(ss);
  assert(rewardDefs.length === 6, 'Exactly 6 reward milestone definitions seeded');
  assert(rewardDefs[0].requiredPoints === 10 && rewardDefs[0].id === 'rwd_first_star', 'Milestone 1 is First Star (10 pt)');
  assert(rewardDefs[1].requiredPoints === 25 && rewardDefs[1].id === 'rwd_silver_star_frame', 'Milestone 2 is Silver Star Frame (25 pt)');
  assert(rewardDefs[2].requiredPoints === 50 && rewardDefs[2].id === 'rwd_monster_crown', 'Milestone 3 is Monster Crown (50 pt)');
  assert(rewardDefs[3].requiredPoints === 100 && rewardDefs[3].id === 'rwd_magic_wings', 'Milestone 4 is Magic Wings (100 pt)');
  assert(rewardDefs[4].requiredPoints === 150 && rewardDefs[4].id === 'rwd_elite_speaker', 'Milestone 5 is Elite Speaker (150 pt)');
  assert(rewardDefs[5].requiredPoints === 250 && rewardDefs[5].id === 'rwd_legendary_aura', 'Milestone 6 is Legendary Aura (250 pt)');

  assert(sandbox.getActiveAcademicYear(ss) === '2026-2027', 'Active academic year initializes to 2026-2027');

  // -------------------------------------------------------------------------
  // 2. Point Awarding & Pure Math Calculation Rules
  // -------------------------------------------------------------------------
  console.log('\n--- 2. Point Awarding & Mathematical Calculation Rules ---');
  // Student 701 earns +2 Speaking
  const award1Res = JSON.parse(
    sandbox.handleTeacherAwardClassroomPoints(ss, {
      teacherToken: MOCK_TEACHER_TOKEN,
      studentNumbers: ['701'],
      categoryId: 'cat_speaking_participation',
      idempotencyKey: 'test_batch_1',
      note: 'Great English answer in class',
    }).getContent()
  );
  assert(award1Res.success === true, 'Teacher awards +2 Speaking to Student 701');
  assert(award1Res.awardedCount === 1, 'Awarded count equals 1');

  // Student 701 receives -1 Classroom Disruption
  const award2Res = JSON.parse(
    sandbox.handleTeacherAwardClassroomPoints(ss, {
      teacherToken: MOCK_TEACHER_TOKEN,
      studentNumbers: ['701'],
      categoryId: 'cat_classroom_disruption',
      idempotencyKey: 'test_batch_2',
      note: 'Talking during listening exercise',
    }).getContent()
  );
  assert(award2Res.success === true, 'Teacher awards -1 Disruption to Student 701');

  // Verify balances
  const balances1 = sandbox.getStudentClassroomPointsForYear(ss, '701', '2026-2027');
  assert(balances1.positivePoints === 2, 'Positive Points = 2');
  assert(balances1.negativePoints === 1, 'Negative Points = 1');
  assert(balances1.netPoints === 1, 'Net Points = 1 (2 - 1 = 1)');

  // Critical pedagogical rule: ordinary negative points do NOT reduce milestone progress
  assert(balances1.positivePoints === 2, 'Ordinary negative points DO NOT reduce positive milestone progress (remains 2)');

  // -------------------------------------------------------------------------
  // 3. Pure Append-Only Reversals & Zero Double Subtraction
  // -------------------------------------------------------------------------
  console.log('\n--- 3. Pure Append-Only Reversals & Zero Double Subtraction ---');
  // Find the transaction ID of the +2 award
  const txSheet = ss.getSheetByName('Class_PointTransactions');
  const allTxData = txSheet.getDataRange().getValues();
  const tx1Id = allTxData[1][0]; // first transaction row
  const tx2Id = allTxData[2][0]; // second transaction row

  // Revert the +2 award
  const rev1Res = JSON.parse(
    sandbox.handleTeacherRevertClassroomPointTransaction(ss, {
      teacherToken: MOCK_TEACHER_TOKEN,
      transactionId: tx1Id,
      reason: 'Wrong student selected by mistake',
    }).getContent()
  );
  assert(rev1Res.success === true, 'Revert +2 Speaking transaction succeeds');
  assert(rev1Res.updatedBalances.positivePoints === 0, 'Positive points updated to 0 (2 - 2 = 0)');
  assert(rev1Res.updatedBalances.negativePoints === 1, 'Negative points remains 1');
  assert(rev1Res.updatedBalances.netPoints === -1, 'Net points updated to -1 (0 - 1 = -1)');

  // Check double subtraction guard: exactly 3 rows in ledger (2 original + 1 compensating)
  assert(txSheet.getLastRow() === 4, 'Ledger has exactly 4 rows (1 header + 3 immutable events)');
  const revRow = txSheet.rows[2];
  assert(revRow[9] === 'correction', 'Reversal event category_type is "correction"');
  assert(revRow[10] === -2, 'Reversal gross_points is -2');
  assert(revRow[11] === -2, 'Reversal positive_points is -2');
  assert(revRow[12] === 0, 'Reversal negative_points is 0');
  assert(revRow[13] === tx1Id, 'Reversal original_tx_id correctly links to original transaction');

  // Revert the -1 disruption
  const rev2Res = JSON.parse(
    sandbox.handleTeacherRevertClassroomPointTransaction(ss, {
      teacherToken: MOCK_TEACHER_TOKEN,
      transactionId: tx2Id,
      reason: 'Misunderstanding resolved',
    }).getContent()
  );
  assert(rev2Res.success === true, 'Revert -1 Disruption transaction succeeds');
  assert(rev2Res.updatedBalances.positivePoints === 0, 'Positive points is 0');
  assert(rev2Res.updatedBalances.negativePoints === 0, 'Negative points is 0 (1 - 1 = 0)');
  assert(rev2Res.updatedBalances.netPoints === 0, 'Net points is 0 (baseline fully restored)');

  // -------------------------------------------------------------------------
  // 4. Double-Reversal Prevention & Correction Immutability
  // -------------------------------------------------------------------------
  console.log('\n--- 4. Double-Reversal Prevention & Correction Immutability ---');
  // Attempt to revert tx1Id again
  const duplicateRevRes = JSON.parse(
    sandbox.handleTeacherRevertClassroomPointTransaction(ss, {
      teacherToken: MOCK_TEACHER_TOKEN,
      transactionId: tx1Id,
      reason: 'Attempt duplicate revert',
    }).getContent()
  );
  assert(duplicateRevRes.success === false, 'Duplicate reversal is rejected');
  assert(duplicateRevRes.code === 'ALREADY_REVERSED', 'Returns expected error code: ALREADY_REVERSED');

  // Attempt to revert a correction transaction
  const revTxId = txSheet.rows[2][0]; // reversal transaction row
  const revertCorrectionRes = JSON.parse(
    sandbox.handleTeacherRevertClassroomPointTransaction(ss, {
      teacherToken: MOCK_TEACHER_TOKEN,
      transactionId: revTxId,
      reason: 'Attempt to reverse a reversal',
    }).getContent()
  );
  assert(revertCorrectionRes.success === false, 'Reversing a correction row directly is rejected');
  assert(revertCorrectionRes.code === 'INVALID_OPERATION', 'Returns expected error code: INVALID_OPERATION');

  // -------------------------------------------------------------------------
  // 5. Per-Student Idempotency & Partial Batch Retry Recovery
  // -------------------------------------------------------------------------
  console.log('\n--- 5. Per-Student Idempotency & Batch Retry Recovery ---');
  const batchKey = 'batch_weekly_effort_001';

  // Award to 701 and 702
  const batchRes1 = JSON.parse(
    sandbox.handleTeacherAwardClassroomPoints(ss, {
      teacherToken: MOCK_TEACHER_TOKEN,
      studentNumbers: ['701', '702'],
      categoryId: 'cat_excellent_effort', // +2
      idempotencyKey: batchKey,
    }).getContent()
  );
  assert(batchRes1.success === true, 'First batch award succeeds');
  assert(batchRes1.awardedCount === 2, 'Awarded count = 2');

  // Simulate network retry with the SAME batchKey: should award 0
  const batchRetryRes = JSON.parse(
    sandbox.handleTeacherAwardClassroomPoints(ss, {
      teacherToken: MOCK_TEACHER_TOKEN,
      studentNumbers: ['701', '702'],
      categoryId: 'cat_excellent_effort',
      idempotencyKey: batchKey,
    }).getContent()
  );
  assert(batchRetryRes.success === true, 'Batch retry succeeds idempotently');
  assert(batchRetryRes.awardedCount === 0, 'Zero duplicate transactions recorded on retry');

  // Simulate partial batch failure recovery: resubmit with [701, 702, 703]
  // 701 and 702 should be skipped; 703 should be newly awarded!
  const batchPartialRecoveryRes = JSON.parse(
    sandbox.handleTeacherAwardClassroomPoints(ss, {
      teacherToken: MOCK_TEACHER_TOKEN,
      studentNumbers: ['701', '702', '703'],
      categoryId: 'cat_excellent_effort',
      idempotencyKey: batchKey,
    }).getContent()
  );
  assert(batchPartialRecoveryRes.success === true, 'Batch partial recovery succeeds');
  assert(batchPartialRecoveryRes.awardedCount === 1, 'Exactly 1 new student (703) awarded without duplicating 701 or 702');

  // -------------------------------------------------------------------------
  // 6. Milestone Eligibility & Deterministic Grants (Current Year Only)
  // -------------------------------------------------------------------------
  console.log('\n--- 6. Milestone Eligibility & Deterministic Grants ---');
  // Award 8 more points to 701 to reach 10 points (Milestone 1: First Star)
  // 701 currently has 2 points from the previous batch
  const milestoneAwardRes = JSON.parse(
    sandbox.handleTeacherAwardClassroomPoints(ss, {
      teacherToken: MOCK_TEACHER_TOKEN,
      studentNumbers: ['701'],
      categoryId: 'cat_great_improvement', // +3 points
      idempotencyKey: 'batch_milestone_1',
    }).getContent()
  );
  // Award another +3 twice and +2 to reach 11 points
  sandbox.handleTeacherAwardClassroomPoints(ss, {
    teacherToken: MOCK_TEACHER_TOKEN,
    studentNumbers: ['701'],
    categoryId: 'cat_great_improvement', // +3 -> 8
    idempotencyKey: 'batch_milestone_2',
  });
  const reach11Res = JSON.parse(
    sandbox.handleTeacherAwardClassroomPoints(ss, {
      teacherToken: MOCK_TEACHER_TOKEN,
      studentNumbers: ['701'],
      categoryId: 'cat_great_improvement', // +3 -> 11
      idempotencyKey: 'batch_milestone_3',
    }).getContent()
  );
  assert(reach11Res.success === true, 'Student 701 advances past 10 positive points');
  assert(reach11Res.newGrants.length === 1, 'Exactly 1 new reward milestone granted: First Star');
  assert(reach11Res.newGrants[0].rewardId === 'rwd_first_star', 'Granted reward is rwd_first_star');

  const grantsSheet = ss.getSheetByName('Class_RewardGrants');
  assert(grantsSheet.getLastRow() === 2, 'Class_RewardGrants has 1 grant row');
  const grantRow = grantsSheet.rows[0];
  assert(grantRow[0] === 'grnt_701_rwd_first_star', 'Grant ID is deterministic: grnt_701_rwd_first_star');

  // -------------------------------------------------------------------------
  // 7. Student Profile Read-Only Lock-Free Query & Next Milestone Calculation
  // -------------------------------------------------------------------------
  console.log('\n--- 7. Student Profile Read-Only Query & Next Milestone ---');
  const locksBefore = scriptLockCallCount;
  const profileRes = JSON.parse(
    sandbox.handleStudentGetClassroomProfile(ss, {
      sessionToken: MOCK_STUDENT_TOKEN_701,
    }).getContent()
  );
  const locksAfter = scriptLockCallCount;
  assert(locksBefore === locksAfter, 'student_get_classroom_profile is 100% lock-free (0 LockService calls)');
  assert(profileRes.success === true, 'Student profile query succeeds');
  assert(profileRes.studentNumber === '701', 'Student number strictly resolved from session');
  assert(profileRes.positivePoints === 11, 'Positive Points is 11');
  assert(profileRes.unlockedRewards.length === 1, 'Has 1 unlocked reward');
  assert(profileRes.unlockedRewards[0].rewardId === 'rwd_first_star', 'Unlocked reward is First Star');

  // Next Milestone calculation must skip already owned First Star (10 pt)
  // and point to Silver Star Frame (25 pt)!
  assert(profileRes.nextMilestone !== null, 'Next milestone exists');
  assert(profileRes.nextMilestone.rewardId === 'rwd_silver_star_frame', 'Next milestone correctly skips First Star and targets Silver Star Frame (25 pt)');
  assert(profileRes.nextMilestone.requiredPoints === 25, 'Silver Star Frame requires 25 points');
  assert(profileRes.nextMilestone.currentPoints === 11, 'Current progress points = 11');
  assert(profileRes.nextMilestone.progressPercent === 44, 'Progress percent = round(11/25 * 100) = 44%');

  // -------------------------------------------------------------------------
  // 8. Academic Year Rollover & Permanent Reward Retention
  // -------------------------------------------------------------------------
  console.log('\n--- 8. Academic Year Rollover & Permanent Reward Retention ---');
  // Switch active academic year to 2027-2028 in Class_AcademicYears
  const yearsSheet = ss.getSheetByName('Class_AcademicYears');
  yearsSheet.rows[0][1] = 'archived'; // 2026-2027 -> archived
  yearsSheet.appendRow(['2027-2028', 'active', '2027-09-01', '2028-06-30', '']);

  assert(sandbox.getActiveAcademicYear(ss) === '2027-2028', 'Active academic year is now 2027-2028');

  // Student 701 profile in 2027-2028
  const profile27Res = JSON.parse(
    sandbox.handleStudentGetClassroomProfile(ss, {
      sessionToken: MOCK_STUDENT_TOKEN_701,
    }).getContent()
  );
  assert(profile27Res.positivePoints === 0, 'New academic year points start fresh at 0');
  assert(profile27Res.netPoints === 0, 'New academic year net points start fresh at 0');
  assert(profile27Res.unlockedRewards.length === 1, 'Previously unlocked First Star remains PERMANENTLY owned');
  assert(profile27Res.nextMilestone.rewardId === 'rwd_silver_star_frame', 'Next milestone remains Silver Star Frame');
  assert(profile27Res.nextMilestone.currentPoints === 0, 'Next milestone progress points resets to 0 for new year');

  // In 2027-2028, student earns 12 positive points
  sandbox.handleTeacherAwardClassroomPoints(ss, {
    teacherToken: MOCK_TEACHER_TOKEN,
    studentNumbers: ['701'],
    categoryId: 'cat_speaking_participation', // +2
    idempotencyKey: 'y28_batch_1',
  });
  sandbox.handleTeacherAwardClassroomPoints(ss, {
    teacherToken: MOCK_TEACHER_TOKEN,
    studentNumbers: ['701'],
    categoryId: 'cat_great_improvement', // +3 -> 5
    idempotencyKey: 'y28_batch_2',
  });
  sandbox.handleTeacherAwardClassroomPoints(ss, {
    teacherToken: MOCK_TEACHER_TOKEN,
    studentNumbers: ['701'],
    categoryId: 'cat_great_improvement', // +3 -> 8
    idempotencyKey: 'y28_batch_3',
  });
  sandbox.handleTeacherAwardClassroomPoints(ss, {
    teacherToken: MOCK_TEACHER_TOKEN,
    studentNumbers: ['701'],
    categoryId: 'cat_great_improvement', // +3 -> 11
    idempotencyKey: 'y28_batch_4',
  });

  // Check that First Star was NOT duplicated in Class_RewardGrants
  const grantsData = grantsSheet.getDataRange().getValues();
  let firstStarCount = 0;
  for (let g = 1; g < grantsData.length; g++) {
    if (grantsData[g][0] === 'grnt_701_rwd_first_star') firstStarCount++;
  }
  assert(firstStarCount === 1, 'First Star reward grant was NOT duplicated when reaching 10 points in new academic year');

  // -------------------------------------------------------------------------
  // 9. Self-Healing Reward Reconciliation & Student Claim
  // -------------------------------------------------------------------------
  console.log('\n--- 9. Self-Healing Reward Reconciliation & Student Claim ---');
  // Student 701 earns 15 more points to reach 26 points (eligible for Silver Star Frame, 25 pt)
  for (let step = 1; step <= 5; step++) {
    sandbox.handleTeacherAwardClassroomPoints(ss, {
      teacherToken: MOCK_TEACHER_TOKEN,
      studentNumbers: ['701'],
      categoryId: 'cat_great_improvement', // +3 each step
      idempotencyKey: `y28_step_${step}`,
    });
  }

  // Simulate missing grant by temporarily removing grnt_701_rwd_silver_star_frame
  grantsSheet.rows = grantsSheet.rows.filter((r) => r[0] !== 'grnt_701_rwd_silver_star_frame');

  // Student profile detects claimable reward without modifying sheets
  const profileWithClaimable = JSON.parse(
    sandbox.handleStudentGetClassroomProfile(ss, {
      sessionToken: MOCK_STUDENT_TOKEN_701,
    }).getContent()
  );
  assert(profileWithClaimable.claimableRewards.length === 1, 'Profile detects 1 claimable ungranted milestone');
  assert(profileWithClaimable.claimableRewards[0].rewardId === 'rwd_silver_star_frame', 'Claimable reward is Silver Star Frame');

  // Student calls student_claim_milestone_reward
  const claimRes = JSON.parse(
    sandbox.handleStudentClaimMilestoneReward(ss, {
      sessionToken: MOCK_STUDENT_TOKEN_701,
      rewardId: 'rwd_silver_star_frame',
    }).getContent()
  );
  assert(claimRes.success === true, 'Student successfully claims milestone reward');
  assert(claimRes.grantId === 'grnt_701_rwd_silver_star_frame', 'Claimed grant ID matches deterministic format');

  // Admin reconciliation test
  const reconRes = JSON.parse(
    sandbox.handleTeacherReconcileClassroomRewards(ss, {
      teacherToken: MOCK_TEACHER_TOKEN,
    }).getContent()
  );
  assert(reconRes.success === true, 'Admin reward reconciliation executes successfully');

  // -------------------------------------------------------------------------
  // 10. Teacher Classroom Overview & History Endpoints
  // -------------------------------------------------------------------------
  console.log('\n--- 10. Teacher Classroom Overview & History Endpoints ---');
  const overviewRes = JSON.parse(
    sandbox.handleTeacherGetClassroomOverview(ss, {
      teacherToken: MOCK_TEACHER_TOKEN,
      classId: '7A',
    }).getContent()
  );
  assert(overviewRes.success === true, 'teacher_get_classroom_overview returns successfully');
  assert(overviewRes.students.length === 3, 'Overview returns all 3 Class 7A students');
  const student701Overview = overviewRes.students.find((s) => s.studentNumber === '701');
  assert(student701Overview.positivePoints === 26, 'Overview reports accurate positive points (26)');
  assert(student701Overview.unlockedRewardCount === 2, 'Overview reports 2 unlocked rewards (Star + Frame)');

  const historyRes = JSON.parse(
    sandbox.handleTeacherGetClassroomHistory(ss, {
      teacherToken: MOCK_TEACHER_TOKEN,
      studentNumber: '701',
      limit: 10,
    }).getContent()
  );
  assert(historyRes.success === true, 'teacher_get_classroom_history returns successfully');
  assert(historyRes.transactions.length > 0, 'History returns transaction list');

  // -------------------------------------------------------------------------
  // 11. Security, Authorization & Session Anchoring
  // -------------------------------------------------------------------------
  console.log('\n--- 11. Security & Authorization Isolation ---');
  // Unauthenticated teacher call
  const unauthTeacherRes = JSON.parse(
    sandbox.handleTeacherAwardClassroomPoints(ss, {
      teacherToken: 'fake_token_123',
      studentNumbers: ['701'],
      categoryId: 'cat_speaking_participation',
    }).getContent()
  );
  assert(unauthTeacherRes.success === false, 'Rejects unauthenticated teacher request');
  assert(unauthTeacherRes.code === 'UNAUTHORIZED', 'Returns UNAUTHORIZED code');

  // Unauthenticated student call
  const unauthStudentRes = JSON.parse(
    sandbox.handleStudentGetClassroomProfile(ss, {
      sessionToken: 'fake_token_456',
    }).getContent()
  );
  assert(unauthStudentRes.success === false, 'Rejects unauthenticated student request');
  assert(unauthStudentRes.code === 'UNAUTHORIZED', 'Returns UNAUTHORIZED code');

  // Student token attempted on teacher endpoint
  const crossRoleRes = JSON.parse(
    sandbox.handleTeacherAwardClassroomPoints(ss, {
      teacherToken: MOCK_STUDENT_TOKEN_701, // student token passed as teacher token
      studentNumbers: ['701'],
      categoryId: 'cat_speaking_participation',
    }).getContent()
  );
  assert(crossRoleRes.success === false, 'Student token fails on teacher endpoint');
  assert(crossRoleRes.code === 'UNAUTHORIZED', 'Cross-role rejected with UNAUTHORIZED');

  // Client attempts to spoof student number in profile call
  const spoofRes = JSON.parse(
    sandbox.handleStudentGetClassroomProfile(ss, {
      sessionToken: MOCK_STUDENT_TOKEN_701, // Token belongs to 701
      studentNumber: '702', // Client attempts to query 702
    }).getContent()
  );
  assert(spoofRes.success === true && spoofRes.studentNumber === '701', 'Server ignores client studentNumber and anchors strictly to authenticated session (701)');

  console.log('\n======================================================================');
  console.log(`🎉 ALL PHASE 3.4A TESTS PASSED: ${passedChecks} / ${totalChecks} ASSERTIONS!`);
  console.log('======================================================================');
}

runTestSuite().catch((err) => {
  console.error('\n❌ TEST RUNNER FATAL ERROR:\n', err);
  process.exit(1);
});

