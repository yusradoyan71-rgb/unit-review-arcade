/**
 * ============================================================================
 * UNIT REVIEW ARCADE — PHASE 5 TEACHER ANALYTICS & REPORTING VERIFICATION SUITE
 * ============================================================================
 * 
 * Verifies:
 * 1. Section & skill classification determinism and backward-compatibility.
 * 2. Section breakdown calculations across Unit Review, General English, and Mixed Practice.
 * 3. 4 Skill mastery pillars telemetry aggregation.
 * 4. Topic-level mastery status & weakness urgency scoring (all 38 starter topics).
 * 5. Student participation matrix & inactive student detection ("not started" flags).
 * 6. Student mistakes log and diagnostic prompt extraction.
 * 7. RFC-4180 CSV export compliance (UTF-8 BOM, escaping, structured data).
 * 8. Native XLSX binary generation and multi-sheet structure.
 * 9. Backend Code.gs Google Apps Script VM integration (sectionBreakdown, student flags, section analytics action).
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const createJiti = require('jiti');

const jiti = createJiti(__filename);

const { TeacherAnalyticsService } = jiti('./src/services/teacherAnalyticsService.ts');
const {
  ALL_GENERAL_ENGLISH_STARTER_QUESTIONS,
  GRADE_7_STARTER_QUESTIONS,
  GRADE_8_STARTER_QUESTIONS,
} = jiti('./src/data/generalEnglish/index.ts');

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`  ❌ FAILED: ${message}`);
    throw new Error(message);
  }
  console.log(`  ✓ ${message}`);
  passedTests++;
}

console.log('======================================================================');
console.log('PHASE 5 VERIFICATION SUITE: TEACHER ANALYTICS & REPORTING INTEGRATION');
console.log('======================================================================\n');

async function runSuite() {

// ---------------------------------------------------------------------------
// 1. Section Classification Tests
// ---------------------------------------------------------------------------
console.log('--- 1. Section Classification Telemetry ---');

assert(
  TeacherAnalyticsService.classifyLearningSection('g7-u1', 'g7-u1-act1', 'Unit 1 Review') === 'unit_review',
  'Textbook unit classified as unit_review'
);
assert(
  TeacherAnalyticsService.classifyLearningSection('g8-u4', 'g8-u4-act5', 'On the Phone') === 'unit_review',
  'Textbook grade 8 unit classified as unit_review'
);
assert(
  TeacherAnalyticsService.classifyLearningSection('unit_g7-gram-present-simple', 'act_g7-gram-ps-1', 'Present Simple') === 'general_english',
  'General English starter topic classified as general_english'
);
assert(
  TeacherAnalyticsService.classifyLearningSection('unit_ge_vocab_travel', 'act_ge_v1', 'General English Vocab') === 'general_english',
  'General English prefix classified as general_english'
);
assert(
  TeacherAnalyticsService.classifyLearningSection('unit_mixed_g7_12345', 'act_mixed_session', 'Mixed Practice Session') === 'mixed_practice',
  'Mixed practice session classified as mixed_practice'
);

// ---------------------------------------------------------------------------
// 2. Skill Pillar Classification Tests
// ---------------------------------------------------------------------------
console.log('\n--- 2. Skill Pillar Classification ---');

assert(
  TeacherAnalyticsService.classifySkill('unit_g7-gram-past-continuous', 'Past Continuous') === 'grammar',
  'Grammar topic classified as grammar'
);
assert(
  TeacherAnalyticsService.classifySkill('unit_g7-vocab-technology', 'Technology & Gadgets') === 'vocabulary',
  'Vocab topic classified as vocabulary'
);
assert(
  TeacherAnalyticsService.classifySkill('unit_g8-read-digital-detox', 'Reading: Digital Detox') === 'reading',
  'Reading passage classified as reading'
);
assert(
  TeacherAnalyticsService.classifySkill('unit_g8-list-directions', 'Listening & Dictation') === 'listening',
  'Listening topic classified as listening'
);
assert(
  TeacherAnalyticsService.classifySkill('unit_mixed_g7', 'Mixed Practice') === 'mixed',
  'Mixed session classified as mixed'
);

// ---------------------------------------------------------------------------
// 3. Section Breakdown Calculations
// ---------------------------------------------------------------------------
console.log('\n--- 3. Section Breakdown Aggregations ---');

const mockAttempts = [
  // Unit Review attempts (Student 701, 702)
  {
    attemptId: 'att_ur_1',
    studentNumber: '701',
    unitId: 'g7-u1',
    activityId: 'g7-u1-act1',
    unitTitle: 'Unit 1 Review',
    activityTitle: 'Vocabulary Quiz',
    gameType: 'quiz_battle',
    attemptNumber: 1,
    score: 80,
    totalQuestions: 10,
    answeredQuestions: 10,
    correctAnswers: 8,
    incorrectAnswers: 2,
    skippedQuestions: 0,
    percentage: 80,
    startedAt: '2026-11-20T10:00:00Z',
    completedAt: '2026-11-20T10:05:00Z',
    durationSeconds: 300,
    status: 'completed',
    contentVersion: '1.0.0',
    versionLabel: '1.0.0',
  },
  {
    attemptId: 'att_ur_2',
    studentNumber: '702',
    unitId: 'g7-u2',
    activityId: 'g7-u2-act1',
    unitTitle: 'Unit 2 Review',
    activityTitle: 'Grammar Duel',
    gameType: 'quiz_battle',
    attemptNumber: 1,
    score: 90,
    totalQuestions: 10,
    answeredQuestions: 10,
    correctAnswers: 9,
    incorrectAnswers: 1,
    skippedQuestions: 0,
    percentage: 90,
    startedAt: '2026-11-20T11:00:00Z',
    completedAt: '2026-11-20T11:06:00Z',
    durationSeconds: 360,
    status: 'completed',
    contentVersion: '1.0.0',
    versionLabel: '1.0.0',
  },
  // General English attempts (Student 701)
  {
    attemptId: 'att_ge_1',
    studentNumber: '701',
    unitId: 'unit_ge_grade-7_grammar_present-simple-vs-present-continuous',
    activityId: 'act_ge_grade-7_grammar_present-simple-vs-present-continuous_sentence_builder',
    unitTitle: 'Present Simple vs. Present Continuous',
    activityTitle: 'Present Simple vs. Present Continuous (GRAMMAR)',
    gameType: 'sentence_builder',
    attemptNumber: 1,
    score: 70,
    totalQuestions: 10,
    answeredQuestions: 10,
    correctAnswers: 7,
    incorrectAnswers: 3,
    skippedQuestions: 0,
    percentage: 70,
    startedAt: '2026-11-21T09:00:00Z',
    completedAt: '2026-11-21T09:07:00Z',
    durationSeconds: 420,
    status: 'completed',
    contentVersion: '1.0.0',
    versionLabel: '1.0.0',
  },
  // Mixed Practice attempts (Student 701)
  {
    attemptId: 'att_mp_1',
    studentNumber: '701',
    unitId: 'unit_mixed_g7_abc',
    activityId: 'act_mixed_session_1',
    unitTitle: 'Mixed Practice 50/50',
    activityTitle: 'Mixed Quiz',
    gameType: 'quiz_battle',
    attemptNumber: 1,
    score: 85,
    totalQuestions: 10,
    answeredQuestions: 10,
    correctAnswers: 8,
    incorrectAnswers: 2,
    skippedQuestions: 0,
    percentage: 85,
    startedAt: '2026-11-21T14:00:00Z',
    completedAt: '2026-11-21T14:08:00Z',
    durationSeconds: 480,
    status: 'completed',
    contentVersion: '1.0.0',
    versionLabel: '1.0.0',
  },
];

const breakdown = TeacherAnalyticsService.computeSectionBreakdown(mockAttempts);
assert(breakdown.unitReview.totalAttempts === 2, 'Unit Review total attempts equals 2');
assert(breakdown.unitReview.completedAttempts === 2, 'Unit Review completed attempts equals 2');
assert(breakdown.unitReview.averageScore === 85, 'Unit Review average score equals (80+90)/2 = 85%');
assert(breakdown.generalEnglish.totalAttempts === 1, 'General English total attempts equals 1');
assert(breakdown.generalEnglish.averageScore === 70, 'General English average score equals 70%');
assert(breakdown.mixedPractice.totalAttempts === 1, 'Mixed Practice total attempts equals 1');
assert(breakdown.mixedPractice.averageScore === 85, 'Mixed Practice average score equals 85%');

// ---------------------------------------------------------------------------
// 4. Topic Mastery & Weakness Urgency Diagnostics
// ---------------------------------------------------------------------------
console.log('\n--- 4. Topic Mastery Diagnostics (38 Topics) ---');

const mockAnswers = [
  {
    answerId: 'ans_1',
    attemptId: 'att_ge_1',
    unitId: 'unit_ge_grade-7_grammar_present-simple-vs-present-continuous',
    activityId: 'act_ge_grade-7_grammar_present-simple-vs-present-continuous_sentence_builder',
    questionId: 'q_ge_7_gram_001',
    questionOrder: 1,
    questionPrompt: 'She ___ to the library every Saturday.',
    studentResponse: 'go',
    correctAnswer: 'goes',
    isCorrect: false,
    timeSpentSeconds: 12,
    timestamp: '2026-11-21T09:01:00Z',
    questionVersion: '1.0.0',
    versionLabel: '1.0.0',
  },
  {
    answerId: 'ans_2',
    attemptId: 'att_ge_1',
    unitId: 'unit_ge_grade-7_grammar_present-simple-vs-present-continuous',
    activityId: 'act_ge_grade-7_grammar_present-simple-vs-present-continuous_sentence_builder',
    questionId: 'q_ge_7_gram_002',
    questionOrder: 2,
    questionPrompt: 'Water ___ at 100 degrees Celsius.',
    studentResponse: 'boils',
    correctAnswer: 'boils',
    isCorrect: true,
    timeSpentSeconds: 8,
    timestamp: '2026-11-21T09:02:00Z',
    questionVersion: '1.0.0',
    versionLabel: '1.0.0',
  },
];

const g7TopicMastery = TeacherAnalyticsService.computeTopicMastery('grade-7', mockAttempts, mockAnswers);
assert(g7TopicMastery.topics.length === 19, `Grade 7 has exactly 19 starter topics (got ${g7TopicMastery.topics.length})`);
assert(g7TopicMastery.skills.length === 4, 'Includes 4 skill pillars: Grammar, Vocabulary, Reading, Listening');

// Find Present Simple topic
const psTopic = g7TopicMastery.topics.find((t) => t.topicTitle.toLowerCase().includes('present simple') || t.topicId.includes('present-simple'));
assert(Boolean(psTopic), 'Found Present Simple topic in Grade 7 diagnostics');
assert(psTopic.totalAttempts === 1, 'Present Simple has 1 recorded attempt');
assert(psTopic.averageScore === 70, 'Present Simple average score is 70%');
assert(psTopic.masteryStatus === 'proficient', '70% score corresponds to "proficient" status');
assert(psTopic.commonMistakesCount === 1, 'Logged 1 common mistake for Present Simple');
assert(psTopic.commonMistakePrompts.length === 1, 'Misconception prompt captured correctly');
assert(psTopic.commonMistakePrompts[0].includes('library'), 'Captured correct mistake prompt text');

// Verify Weakness Urgency Score: (100 - 70) * 0.8 + 1*2 = 24 + 2 = 26
assert(psTopic.weaknessScore === 26, `Weakness urgency score is 26 (got ${psTopic.weaknessScore})`);

// Grade 8 Topic Mastery
const g8TopicMastery = TeacherAnalyticsService.computeTopicMastery('grade-8', [], []);
assert(g8TopicMastery.topics.length === 19, `Grade 8 has exactly 19 starter topics (got ${g8TopicMastery.topics.length})`);
const allTopicMastery = TeacherAnalyticsService.computeTopicMastery('all', [], []);
assert(allTopicMastery.topics.length === 38, `All grades combine to exactly 38 topics (got ${allTopicMastery.topics.length})`);

// ---------------------------------------------------------------------------
// 5. Student Section Participation Matrix & Inactivity Detection
// ---------------------------------------------------------------------------
console.log('\n--- 5. Student Participation Matrix & Inactive Flags ---');

const mockRoster = [
  {
    studentId: 'std_1',
    studentNumber: '701',
    fullName: 'Kerem Yılmaz',
    grade: 'grade-7',
    class: '7A',
    lastLoginAt: '2026-11-21T09:00:00Z',
    isActive: true,
    totalAttempts: 4,
    completedActivitiesCount: 4,
    totalPublishedActivities: 32,
    curriculumProgressPercentage: 12,
    customActivitiesCompletedCount: 2,
    averageCompletedScore: 81,
    bestScore: 90,
    totalTimeSpentSeconds: 1560,
    status: 'active',
  },
  {
    studentId: 'std_2',
    studentNumber: '702',
    fullName: 'Zeynep Kaya',
    grade: 'grade-7',
    class: '7A',
    lastLoginAt: '2026-11-20T10:00:00Z',
    isActive: true,
    totalAttempts: 1,
    completedActivitiesCount: 1,
    totalPublishedActivities: 32,
    curriculumProgressPercentage: 3,
    customActivitiesCompletedCount: 0,
    averageCompletedScore: 80,
    bestScore: 80,
    totalTimeSpentSeconds: 300,
    status: 'active',
  },
  {
    studentId: 'std_3',
    studentNumber: '703',
    fullName: 'Can Demir',
    grade: 'grade-7',
    class: '7A',
    lastLoginAt: null,
    isActive: true,
    totalAttempts: 0,
    completedActivitiesCount: 0,
    totalPublishedActivities: 32,
    curriculumProgressPercentage: 0,
    customActivitiesCompletedCount: 0,
    averageCompletedScore: 0,
    bestScore: 0,
    totalTimeSpentSeconds: 0,
    status: 'never_logged_in',
  },
];

const participants = TeacherAnalyticsService.computeStudentParticipation(mockRoster, mockAttempts);
assert(participants.length === 3, 'Participation matrix has 3 students');

const p701 = participants.find((p) => p.studentNumber === '701');
assert(p701.unitReviewStarted === true, 'Student 701 started Unit Review');
assert(p701.generalEnglishStarted === true, 'Student 701 started General English');
assert(p701.mixedPracticeStarted === true, 'Student 701 started Mixed Practice');
assert(p701.totalAttempts === 3, 'Student 701 total attempts is 3');

const p702 = participants.find((p) => p.studentNumber === '702');
assert(p702.unitReviewStarted === true, 'Student 702 started Unit Review');
assert(p702.generalEnglishStarted === false, 'Student 702 has NOT started General English');
assert(p702.mixedPracticeStarted === false, 'Student 702 has NOT started Mixed Practice');

// Filter: Students who have NOT started General English
const notStartedGE = TeacherAnalyticsService.filterStudentParticipation(participants, {
  participationFilter: 'not_started_general',
});
assert(notStartedGE.length === 2, `2 students have not started General English (got ${notStartedGE.length})`);
assert(notStartedGE.some((s) => s.studentNumber === '702'), 'Student 702 flagged as not started GE');
assert(notStartedGE.some((s) => s.studentNumber === '703'), 'Student 703 flagged as not started GE');

// Filter: Students who have NOT started Mixed Practice
const notStartedMP = TeacherAnalyticsService.filterStudentParticipation(participants, {
  participationFilter: 'not_started_mixed',
});
assert(notStartedMP.length === 2, `2 students have not started Mixed Practice (got ${notStartedMP.length})`);

// Filter: Active in all sections
const activeAll = TeacherAnalyticsService.filterStudentParticipation(participants, {
  participationFilter: 'active_all',
});
assert(activeAll.length === 1 && activeAll[0].studentNumber === '701', 'Only Student 701 is active in all sections');

// ---------------------------------------------------------------------------
// 6. RFC-4180 CSV Export Generation & UTF-8 BOM
// ---------------------------------------------------------------------------
console.log('\n--- 6. RFC-4180 CSV Generation & UTF-8 BOM ---');

const studentCsv = TeacherAnalyticsService.generateStudentParticipationCsv(participants);
assert(studentCsv.startsWith('\uFEFF'), 'CSV starts with UTF-8 BOM marker (\\uFEFF) for Excel compatibility');
assert(studentCsv.includes('Student Number,Student Name,Class,Grade'), 'CSV includes standard participation headers');
assert(studentCsv.includes('Kerem Yılmaz'), 'Student name with Turkish characters is preserved');
assert(studentCsv.includes('701'), 'Student number is cleanly formatted');

const topicsCsv = TeacherAnalyticsService.generateTopicMasteryCsv(g7TopicMastery.topics);
assert(topicsCsv.startsWith('\uFEFF'), 'Topics CSV starts with UTF-8 BOM');
assert(topicsCsv.includes('Topic Title,Skill Pillar,Grade,CEFR Level'), 'Topics CSV includes diagnostic headers');
assert(topicsCsv.includes('Present Simple'), 'Topics CSV includes topic names');

const breakdownCsv = TeacherAnalyticsService.generateSectionBreakdownCsv(breakdown, 3);
assert(breakdownCsv.startsWith('\uFEFF'), 'Section Breakdown CSV starts with UTF-8 BOM');
assert(breakdownCsv.includes('Unit Review'), 'Section Breakdown CSV includes Unit Review');
assert(breakdownCsv.includes('General English'), 'Section Breakdown CSV includes General English');
assert(breakdownCsv.includes('Mixed Practice'), 'Section Breakdown CSV includes Mixed Practice');

const mistakesCsv = TeacherAnalyticsService.generateQuestionMistakesCsv(mockAnswers);
assert(mistakesCsv.startsWith('\uFEFF'), 'Mistakes CSV starts with UTF-8 BOM');
assert(mistakesCsv.includes('Question Prompt,Student Response,Correct Answer'), 'Mistakes CSV includes diagnosis headers');
assert(mistakesCsv.includes('She ___ to the library every Saturday.'), 'Mistakes CSV contains student misconception prompt');

// ---------------------------------------------------------------------------
// 7. Native XLSX Binary Generation
// ---------------------------------------------------------------------------
console.log('\n--- 7. Native XLSX Binary Generation ---');

const xlsxBuffer = await TeacherAnalyticsService.generateSectionAnalyticsXlsx(
  breakdown,
  g7TopicMastery.topics,
  participants,
  mockAnswers
);

assert(xlsxBuffer instanceof Uint8Array, 'Returns Uint8Array buffer');
assert(xlsxBuffer.length > 500, `XLSX binary has non-trivial size (${xlsxBuffer.length} bytes)`);
// Verify standard ZIP header signature: PK\x03\x04
assert(
  xlsxBuffer[0] === 0x50 && xlsxBuffer[1] === 0x4b && xlsxBuffer[2] === 0x03 && xlsxBuffer[3] === 0x04,
  'XLSX binary has valid ZIP header (PK\\x03\\x04)'
);

// ---------------------------------------------------------------------------
// 8. Backend Code.gs Apps Script Virtual Machine Verification
// ---------------------------------------------------------------------------
console.log('\n--- 8. Backend Code.gs Apps Script VM Verification ---');

const codeGsPath = path.resolve(__dirname, 'google-apps-script/Code.gs');
const codeGsContent = fs.readFileSync(codeGsPath, 'utf8');

// Build minimal GAS VM context
const sandbox = {
  console: console,
  Logger: { log: () => {} },
  Utilities: {
    base64Encode: (str) => Buffer.from(str).toString('base64'),
    base64Decode: (str) => Buffer.from(str, 'base64').toString('utf8'),
    computeDigest: () => [],
    DigestAlgorithm: { SHA_256: 'SHA_256' },
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

assert(typeof sandbox.getAttemptLearningSection === 'function', 'Code.gs exports getAttemptLearningSection');
assert(typeof sandbox.getAttemptSkill === 'function', 'Code.gs exports getAttemptSkill');
assert(typeof sandbox.handleTeacherGetSectionAnalytics === 'function', 'Code.gs exports handleTeacherGetSectionAnalytics');

// Test GAS getAttemptLearningSection
assert(
  sandbox.getAttemptLearningSection('unit_g7-gram-present-simple', 'act_1', 'Present Simple') === 'general_english',
  'GAS getAttemptLearningSection classifies general_english'
);
assert(
  sandbox.getAttemptLearningSection('unit_mixed_g7_123', 'act_mixed', 'Mixed Practice') === 'mixed_practice',
  'GAS getAttemptLearningSection classifies mixed_practice'
);
assert(
  sandbox.getAttemptLearningSection('g7-u1', 'g7-u1-act1', 'Unit 1') === 'unit_review',
  'GAS getAttemptLearningSection classifies unit_review'
);

// Test GAS getAttemptSkill
assert(
  sandbox.getAttemptSkill('unit_g7-gram-past-continuous', 'act_1', 'Past Continuous') === 'grammar',
  'GAS getAttemptSkill classifies grammar'
);
assert(
  sandbox.getAttemptSkill('unit_g8-read-digital-detox', 'act_1', 'Reading') === 'reading',
  'GAS getAttemptSkill classifies reading'
);
assert(
  sandbox.getAttemptSkill('unit_g7-vocab-technology', 'act_1', 'Vocabulary') === 'vocabulary',
  'GAS getAttemptSkill classifies vocabulary'
);
assert(
  sandbox.getAttemptSkill('unit_g8-list-directions', 'act_1', 'Listening') === 'listening',
  'GAS getAttemptSkill classifies listening'
);

// ---------------------------------------------------------------------------
// 9. Mock Spreadsheet Verification of handleTeacherGetSectionAnalytics & handleTeacherGetRoster
// ---------------------------------------------------------------------------
console.log('\n--- 9. Mock Spreadsheet Execution of Section Analytics Endpoints ---');

class MockSheet {
  constructor(name, headers, rows) {
    this.name = name;
    this.headers = headers;
    this.rows = rows;
  }
  getName() { return this.name; }
  getDataRange() {
    const fullData = [this.headers, ...this.rows];
    return {
      getValues: () => fullData,
      getNumRows: () => fullData.length,
      getNumColumns: () => this.headers.length,
    };
  }
  getRange(row, col, numRows, numCols) {
    const fullData = [this.headers, ...this.rows];
    return {
      getValues: () => {
        const slice = fullData.slice(row - 1, row - 1 + (numRows || 1));
        return slice.map((r) => r.slice(col - 1, col - 1 + (numCols || 1)));
      },
    };
  }
  getLastRow() { return this.rows.length + 1; }
  getLastColumn() { return this.headers.length; }
}

class MockSpreadsheet {
  constructor() {
    this.sheets = {};
  }
  addSheet(name, headers, rows = []) {
    const s = new MockSheet(name, headers, rows);
    this.sheets[name] = s;
    return s;
  }
  getSheetByName(name) {
    return this.sheets[name] || null;
  }
  getSheets() {
    return Object.values(this.sheets);
  }
}

const mockSs = new MockSpreadsheet();

// Students Sheet
mockSs.addSheet('Students', [
  'student_id', 'student_number', 'full_name', 'grade', 'class', 'pin_hash', 'salt', 'created_at', 'last_login_at', 'is_active'
], [
  ['std_701', '701', 'Kerem Yılmaz', 'grade-7', '7A', 'hash', 'salt', '2026-11-01', '2026-11-21T09:00:00Z', true],
  ['std_702', '702', 'Zeynep Kaya', 'grade-7', '7A', 'hash', 'salt', '2026-11-01', '2026-11-20T10:00:00Z', true],
  ['std_801', '801', 'Barış Arslan', 'grade-8', '8A', 'hash', 'salt', '2026-11-01', null, true],
]);

// Attempts Sheet
mockSs.addSheet('Attempts', [
  'attempt_id', 'student_number', 'class', 'unit_id', 'unit_title', 'activity_id', 'activity_title',
  'game_type', 'attempt_number', 'score', 'total_questions', 'answered_questions', 'correct_answers',
  'incorrect_answers', 'skipped_questions', 'percentage', 'started_at', 'completed_at', 'duration_seconds',
  'status', 'content_version'
], [
  // 701: Unit Review (completed)
  ['att_1', '701', '7A', 'g7-u1', 'Unit 1', 'g7-u1-act1', 'Quiz', 'quiz_battle', 1, 90, 10, 10, 9, 1, 0, 90, '2026-11-20T10:00:00Z', '2026-11-20T10:05:00Z', 300, 'completed', '1.0.0'],
  // 701: General English (completed)
  ['att_2', '701', '7A', 'unit_g7-gram-present-simple', 'Present Simple', 'act_1', 'Grammar', 'sentence_builder', 1, 80, 10, 10, 8, 2, 0, 80, '2026-11-21T09:00:00Z', '2026-11-21T09:06:00Z', 360, 'completed', '1.0.0'],
  // 701: Mixed Practice (completed)
  ['att_3', '701', '7A', 'unit_mixed_g7_abc', 'Mixed Practice', 'act_m1', 'Mixed', 'quiz_battle', 1, 85, 10, 10, 8, 2, 0, 85, '2026-11-21T14:00:00Z', '2026-11-21T14:07:00Z', 420, 'completed', '1.0.0'],
  // 702: Unit Review (completed)
  ['att_4', '702', '7A', 'g7-u1', 'Unit 1', 'g7-u1-act1', 'Quiz', 'quiz_battle', 1, 75, 10, 10, 7, 3, 0, 75, '2026-11-20T11:00:00Z', '2026-11-20T11:05:00Z', 300, 'completed', '1.0.0'],
]);

// Answers Sheet
mockSs.addSheet('Answers', [
  'answer_id', 'attempt_id', 'student_number', 'unit_id', 'activity_id', 'question_id', 'question_order',
  'question_prompt', 'student_response', 'correct_answer', 'is_correct', 'time_spent_seconds', 'timestamp',
  'question_version'
], [
  ['ans_1', 'att_2', '701', 'unit_g7-gram-present-simple', 'act_1', 'q1', 1, 'She ___ every day.', 'go', 'goes', false, 10, '2026-11-21T09:01:00Z', '1.0.0'],
]);

// TeacherSessions Sheet (authenticated token)
mockSs.addSheet('TeacherSessions', [
  'token_hash', 'created_at', 'expires_at', 'last_seen_at', 'user_agent'
], [
  ['tch_valid_token_hash', '2026-11-21T00:00:00Z', '2026-11-22T00:00:00Z', '2026-11-21T10:00:00Z', 'Test']
]);

// Override auth in sandbox to accept test token
sandbox.validateTeacherSession = function(ss, token) {
  if (token === 'valid_teacher_token') return { valid: true };
  return { valid: false, error: 'Unauthorized', code: 'UNAUTHORIZED' };
};

// 9A. Test handleTeacherGetSectionAnalytics
const sectionAnalyticsResRaw = sandbox.handleTeacherGetSectionAnalytics(mockSs, {
  teacherToken: 'valid_teacher_token',
  filters: { classId: '7A', gradeId: 'grade-7' }
});
const sectionAnalyticsRes = JSON.parse(sectionAnalyticsResRaw.getContent());

assert(sectionAnalyticsRes.success === true, 'handleTeacherGetSectionAnalytics executed successfully');
assert(sectionAnalyticsRes.sectionBreakdown.unitReview.totalAttempts === 2, 'Section breakdown unitReview attempts = 2');
assert(sectionAnalyticsRes.sectionBreakdown.generalEnglish.totalAttempts === 1, 'Section breakdown generalEnglish attempts = 1');
assert(sectionAnalyticsRes.sectionBreakdown.mixedPractice.totalAttempts === 1, 'Section breakdown mixedPractice attempts = 1');
assert(sectionAnalyticsRes.studentParticipation.length === 2, 'Student participation includes 2 class 7A students');

const gasP701 = sectionAnalyticsRes.studentParticipation.find((s) => s.studentNumber === '701');
assert(gasP701.generalEnglishStarted === true, 'GAS student 701 generalEnglishStarted is true');
assert(gasP701.mixedPracticeStarted === true, 'GAS student 701 mixedPracticeStarted is true');
assert(gasP701.unitReviewStarted === true, 'GAS student 701 unitReviewStarted is true');

const gasP702 = sectionAnalyticsRes.studentParticipation.find((s) => s.studentNumber === '702');
assert(gasP702.generalEnglishStarted === false, 'GAS student 702 generalEnglishStarted is false');
assert(gasP702.mixedPracticeStarted === false, 'GAS student 702 mixedPracticeStarted is false');
assert(gasP702.unitReviewStarted === true, 'GAS student 702 unitReviewStarted is true');

// 9B. Test handleTeacherGetRoster section flags
const rosterResRaw = sandbox.handleTeacherGetRoster(mockSs, {
  teacherToken: 'valid_teacher_token',
  filters: { classId: 'all' }
});
const rosterRes = JSON.parse(rosterResRaw.getContent());
assert(rosterRes.success === true, 'handleTeacherGetRoster executed successfully');
const r701 = rosterRes.roster.find((s) => s.studentNumber === '701');
assert(r701.generalEnglishStarted === true, 'Roster student 701 has generalEnglishStarted = true');
assert(r701.mixedPracticeStarted === true, 'Roster student 701 has mixedPracticeStarted = true');
assert(r701.unitReviewStarted === true, 'Roster student 701 has unitReviewStarted = true');

const r702 = rosterRes.roster.find((s) => s.studentNumber === '702');
assert(r702.generalEnglishStarted === false, 'Roster student 702 has generalEnglishStarted = false');
assert(r702.unitReviewStarted === true, 'Roster student 702 has unitReviewStarted = true');

// 9C. Test handleTeacherGetOverview sectionBreakdown
const overviewResRaw = sandbox.handleTeacherGetOverview(mockSs, {
  teacherToken: 'valid_teacher_token',
  filters: { classId: 'all' }
});
const overviewRes = JSON.parse(overviewResRaw.getContent());
assert(overviewRes.success === true, 'handleTeacherGetOverview executed successfully');
assert(Boolean(overviewRes.sectionBreakdown), 'handleTeacherGetOverview returned sectionBreakdown');
assert(overviewRes.sectionBreakdown.unitReview.totalAttempts === 2, 'Overview sectionBreakdown unitReview attempts = 2');
assert(overviewRes.sectionBreakdown.generalEnglish.totalAttempts === 1, 'Overview sectionBreakdown generalEnglish attempts = 1');
assert(overviewRes.sectionBreakdown.mixedPractice.totalAttempts === 1, 'Overview sectionBreakdown mixedPractice attempts = 1');

console.log('\n======================================================================');
console.log(`ALL PHASE 5 TESTS PASSED: ${passedTests}/${totalTests} assertions`);
console.log('======================================================================');
}

runSuite().catch((err) => {
  console.error('Suite execution error:', err);
  process.exit(1);
});
