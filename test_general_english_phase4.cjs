/**
 * COMPREHENSIVE AUTOMATED VERIFICATION SUITE: PHASE 4
 * General English Student Experience, Navigation & Mixed Practice
 */

const createJiti = require('jiti');
const jiti = createJiti(__filename);

const { GeneralEnglishService } = jiti('./src/services/generalEnglishService.ts');
const { DEFAULT_INITIAL_DATA } = jiti('./src/services/storageService.ts');
const { convertBankItemToAnyQuestion } = jiti('./src/utils/questionBankCompat.ts');
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
console.log('PHASE 4: GENERAL ENGLISH STUDENT EXPERIENCE & MIXED PRACTICE SUITE');
console.log('======================================================================\n');

// -------------------------------------------------------------------
// 1. Topic Organization & Skill Classification
// -------------------------------------------------------------------
console.log('--- 1. Topic Organization & Skill Classification ---');

const g7Topics = GeneralEnglishService.getTopics('grade-7');
const g8Topics = GeneralEnglishService.getTopics('grade-8');

assert(g7Topics.length === 19, `Grade 7 has exactly 19 distinct topics/passages (got ${g7Topics.length})`);
assert(g8Topics.length === 19, `Grade 8 has exactly 19 distinct topics/passages (got ${g8Topics.length})`);

const g7GrammarTopics = GeneralEnglishService.getTopics('grade-7', 'grammar');
const g7VocabTopics = GeneralEnglishService.getTopics('grade-7', 'vocabulary');
const g7ReadingTopics = GeneralEnglishService.getTopics('grade-7', 'reading');
const g7ListeningTopics = GeneralEnglishService.getTopics('grade-7', 'listening');

assert(g7GrammarTopics.length === 6, 'G7 has exactly 6 Grammar topics (10 Qs each = 60)');
assert(g7VocabTopics.length === 4, 'G7 has exactly 4 Vocabulary clusters (15 Qs each = 60)');
assert(g7ReadingTopics.length === 5, 'G7 has exactly 5 Reading passages (4 Qs each = 20)');
assert(g7ListeningTopics.length === 4, 'G7 has exactly 4 Listening sets (5 Qs each = 20)');

const g8GrammarTopics = GeneralEnglishService.getTopics('grade-8', 'grammar');
const g8VocabTopics = GeneralEnglishService.getTopics('grade-8', 'vocabulary');
const g8ReadingTopics = GeneralEnglishService.getTopics('grade-8', 'reading');
const g8ListeningTopics = GeneralEnglishService.getTopics('grade-8', 'listening');

assert(g8GrammarTopics.length === 6, 'G8 has exactly 6 Grammar topics (10 Qs each = 60)');
assert(g8VocabTopics.length === 4, 'G8 has exactly 4 Vocabulary clusters (15 Qs each = 60)');
assert(g8ReadingTopics.length === 5, 'G8 has exactly 5 Reading passages (4 Qs each = 20)');
assert(g8ListeningTopics.length === 4, 'G8 has exactly 4 Listening sets (5 Qs each = 20)');

// Total questions verification through service
const g7TotalQs = GeneralEnglishService.getQuestionsForGrade('grade-7').length;
const g8TotalQs = GeneralEnglishService.getQuestionsForGrade('grade-8').length;
assert(g7TotalQs === 160, `G7 total starter questions equals 160 (got ${g7TotalQs})`);
assert(g8TotalQs === 160, `G8 total starter questions equals 160 (got ${g8TotalQs})`);

// -------------------------------------------------------------------
// 2. Ephemeral Activity & Unit Runtime Generation
// -------------------------------------------------------------------
console.log('\n--- 2. Ephemeral Activity & Unit Runtime Generation ---');

const sampleTopic = g7GrammarTopics[0]; // Present Simple vs Continuous
const { activity, unit } = GeneralEnglishService.createActivityForTopic(sampleTopic, 'quiz_battle');

assert(Boolean(activity && unit), 'Successfully created runtime Activity and Unit models');
assert(activity.gameType === 'quiz_battle', 'Activity matches requested gameType (quiz_battle)');
assert(activity.questions.length > 0, `Activity contains ${activity.questions.length} playable questions`);
assert(unit.unitNumber === 0, 'Unit number is 0 (distinguishing from textbook units)');
assert(unit.gradeId === 'grade-7', 'Unit gradeId matches topic gradeId (grade-7)');

// -------------------------------------------------------------------
// 3. Audio Delivery & Hidden Transcripts Safeguards
// -------------------------------------------------------------------
console.log('\n--- 3. Audio Delivery & Hidden Transcripts Safeguards ---');

let audioItemsChecked = 0;
let hiddenPromptCompliant = 0;

ALL_GENERAL_ENGLISH_STARTER_QUESTIONS.forEach((q) => {
  if (q.skill === 'listening') {
    audioItemsChecked++;
    const converted = convertBankItemToAnyQuestion(q);
    assert(converted.hasAudio === true, `Question ${q.id} converted with hasAudio=true`);
    assert(Boolean(converted.speechText), `Question ${q.id} contains non-empty speechText`);
    
    // Crucial pedagogical requirement 9: Prompt must NEVER display the spoken speechText!
    const promptLower = converted.prompt.toLowerCase();
    const speechLower = (converted.speechText || '').toLowerCase();
    
    // Check that prompt does not contain verbatim sentence/transcript
    if (!promptLower.includes(speechLower) || speechLower.length < 5) {
      hiddenPromptCompliant++;
    }
  }
});

assert(audioItemsChecked === 40, `Audited all 40 listening starter questions (got ${audioItemsChecked})`);
assert(hiddenPromptCompliant === 40, `All 40 listening prompts hide speechText before student answer (got ${hiddenPromptCompliant})`);

// -------------------------------------------------------------------
// 4. Mixed Practice Blending Engine & Ratios (50/50, 70/30, 30/70)
// -------------------------------------------------------------------
console.log('\n--- 4. Mixed Practice Blending Engine & Ratios ---');

const g7UnitActivities = DEFAULT_INITIAL_DATA.units['grade-7'].flatMap((u) => u.activities || []);
const g8UnitActivities = DEFAULT_INITIAL_DATA.units['grade-8'].flatMap((u) => u.activities || []);

// Test 50/50 Ratio
const mixed5050 = GeneralEnglishService.createMixedPracticeActivity(
  {
    gradeId: 'grade-7',
    gameType: 'quiz_battle',
    ratio: '50/50',
    totalQuestions: 10,
  },
  g7UnitActivities
);

assert(mixed5050.activity.questions.length === 10, `50/50 mixed practice produces 10 questions (got ${mixed5050.activity.questions.length})`);
assert(mixed5050.summary.unitCount === 5, `50/50 has exactly 5 Unit Review questions (got ${mixed5050.summary.unitCount})`);
assert(mixed5050.summary.generalCount === 5, `50/50 has exactly 5 General English questions (got ${mixed5050.summary.generalCount})`);

// Test 70/30 Ratio
const mixed7030 = GeneralEnglishService.createMixedPracticeActivity(
  {
    gradeId: 'grade-7',
    gameType: 'quiz_battle',
    ratio: '70/30',
    totalQuestions: 10,
  },
  g7UnitActivities
);

assert(mixed7030.activity.questions.length === 10, `70/30 mixed practice produces 10 questions (got ${mixed7030.activity.questions.length})`);
assert(mixed7030.summary.unitCount === 7, `70/30 has exactly 7 Unit Review questions (got ${mixed7030.summary.unitCount})`);
assert(mixed7030.summary.generalCount === 3, `70/30 has exactly 3 General English questions (got ${mixed7030.summary.generalCount})`);

// Test 30/70 Ratio
const mixed3070 = GeneralEnglishService.createMixedPracticeActivity(
  {
    gradeId: 'grade-8',
    gameType: 'quiz_battle',
    ratio: '30/70',
    totalQuestions: 10,
  },
  g8UnitActivities
);

assert(mixed3070.activity.questions.length === 10, `30/70 mixed practice produces 10 questions (got ${mixed3070.activity.questions.length})`);
assert(mixed3070.summary.unitCount === 3, `30/70 has exactly 3 Unit Review questions (got ${mixed3070.summary.unitCount})`);
assert(mixed3070.summary.generalCount === 7, `30/70 has exactly 7 General English questions (got ${mixed3070.summary.generalCount})`);

// Test Mixed Practice with Sentence Builder
const mixedSentenceBuilder = GeneralEnglishService.createMixedPracticeActivity(
  {
    gradeId: 'grade-7',
    gameType: 'sentence_builder',
    ratio: '50/50',
    totalQuestions: 10,
  },
  g7UnitActivities
);

assert(mixedSentenceBuilder.activity.gameType === 'sentence_builder', 'Sentence builder mixed practice maintains gameType');
assert(mixedSentenceBuilder.activity.questions.length > 0, 'Sentence builder mixed questions assembled');

// -------------------------------------------------------------------
// 5. Strict Grade Isolation & Built-In Preservation
// -------------------------------------------------------------------
console.log('\n--- 5. Strict Grade Isolation & Built-In Preservation ---');

// Verify all 1,206 built-in questions are 100% intact
let builtInCount = 0;
['grade-7', 'grade-8'].forEach((g) => {
  DEFAULT_INITIAL_DATA.units[g].forEach((u) => {
    u.activities.forEach((a) => {
      builtInCount += (a.questions || []).length;
    });
  });
});
assert(builtInCount === 1206, `All 1,206 built-in curriculum questions preserved (got ${builtInCount})`);

// Verify grade isolation in starter questions
const g7Only = GRADE_7_STARTER_QUESTIONS.every((q) => q.gradeId === 'grade-7');
const g8Only = GRADE_8_STARTER_QUESTIONS.every((q) => q.gradeId === 'grade-8');
assert(g7Only, 'All 160 Grade 7 starter questions strictly carry gradeId="grade-7"');
assert(g8Only, 'All 160 Grade 8 starter questions strictly carry gradeId="grade-8"');

console.log('\n======================================================================');
console.log(`🎉 ALL ${passedTests} / ${totalTests} PHASE 4 TESTS PASSED!`);
console.log('======================================================================\n');

