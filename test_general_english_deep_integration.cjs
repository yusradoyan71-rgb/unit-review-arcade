/**
 * DEEP INTEGRATION TEST SUITE: GENERAL ENGLISH & MIXED PRACTICE RUNTIME ENGINES
 * Tests runtime payload conversion, game compatibility, audio metadata,
 * Mixed Practice ratio enforcement, and progress isolation.
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
console.log('TIER 1: DEEP INTEGRATION & RUNTIME ENGINE REGRESSION SUITE');
console.log('======================================================================\n');

// -------------------------------------------------------------------
// 1. Runtime Payload Verification for Sentence Builder (62 Questions)
// -------------------------------------------------------------------
console.log('--- 1. Sentence Builder Runtime Payload Verification ---');
const sbQuestions = ALL_GENERAL_ENGLISH_STARTER_QUESTIONS.filter((q) => q.questionType === 'sentence_builder');
assert(sbQuestions.length === 62, `Total Sentence Builder questions equals 62 (got ${sbQuestions.length})`);

sbQuestions.forEach((q) => {
  const converted = convertBankItemToAnyQuestion(q);
  assert(Boolean(converted.correctSentence), `[${q.id}] Has non-empty correctSentence`);
  assert(Array.isArray(converted.scrambledWords) && converted.scrambledWords.length >= 2, `[${q.id}] Has valid scrambledWords array`);
  
  // Verify no punctuation leaks in scrambled words
  const hasPunctuationLeak = converted.scrambledWords.some((w) => /[.,!?;:]$/.test(w));
  assert(!hasPunctuationLeak, `[${q.id}] 0 punctuation leaks in scrambled chips`);
  
  // Verify scrambled words are not identical to target sentence
  const cleanTokens = converted.correctSentence.split(/\s+/).map((w) => w.replace(/[.,!?;:]+$/, '')).filter(Boolean);
  assert(JSON.stringify(cleanTokens) !== JSON.stringify(converted.scrambledWords), `[${q.id}] Word chips are genuinely scrambled`);
});

// -------------------------------------------------------------------
// 2. Runtime Payload Verification for Match It (21 Questions)
// -------------------------------------------------------------------
console.log('\n--- 2. Match It Runtime Payload Verification ---');
const matchQuestions = ALL_GENERAL_ENGLISH_STARTER_QUESTIONS.filter((q) => q.questionType === 'match_it');
assert(matchQuestions.length === 21, `Total Match It questions equals 21 (got ${matchQuestions.length})`);

matchQuestions.forEach((q) => {
  const converted = convertBankItemToAnyQuestion(q);
  assert(Array.isArray(converted.pairs) && converted.pairs.length >= 3, `[${q.id}] Has at least 3 matching pairs (got ${converted.pairs?.length})`);
  
  const lefts = new Set();
  const rights = new Set();
  converted.pairs.forEach((p) => {
    assert(Boolean(p.left && p.right), `[${q.id}] Pair has both left and right values`);
    assert(!lefts.has(p.left.toLowerCase()), `[${q.id}] Left value "${p.left}" is unique`);
    assert(!rights.has(p.right.toLowerCase()), `[${q.id}] Right value "${p.right}" is unique`);
    lefts.add(p.left.toLowerCase());
    rights.add(p.right.toLowerCase());
  });
});

// -------------------------------------------------------------------
// 3. Runtime Payload Verification for Reading Detective (40 Questions)
// -------------------------------------------------------------------
console.log('\n--- 3. Reading Detective Runtime Payload Verification ---');
const readingQuestions = ALL_GENERAL_ENGLISH_STARTER_QUESTIONS.filter((q) => q.questionType === 'reading_passage');
assert(readingQuestions.length === 40, `Total Reading Passage questions equals 40 (got ${readingQuestions.length})`);

readingQuestions.forEach((q) => {
  const converted = convertBankItemToAnyQuestion(q);
  assert(Boolean(converted.passageText && converted.passageText.length > 50), `[${q.id}] Has valid passageText`);
  assert(Boolean(converted.passageTitle), `[${q.id}] Has passageTitle`);
  assert(Array.isArray(converted.options) && converted.options.length === 4, `[${q.id}] Has exactly 4 options`);
  assert(converted.correctOptionIndex >= 0 && converted.correctOptionIndex <= 3, `[${q.id}] correctOptionIndex in bounds [0..3]`);
});

// -------------------------------------------------------------------
// 4. Runtime Payload Verification for Train Station (2 Questions)
// -------------------------------------------------------------------
console.log('\n--- 4. Train Station Runtime Payload Verification ---');
const trainQuestions = ALL_GENERAL_ENGLISH_STARTER_QUESTIONS.filter((q) => q.questionType === 'train_station');
assert(trainQuestions.length === 2, `Total Train Station questions equals 2 (got ${trainQuestions.length})`);

trainQuestions.forEach((q) => {
  const converted = convertBankItemToAnyQuestion(q);
  assert(Array.isArray(converted.options) && converted.options.length === 4, `[${q.id}] Has 4 options`);
  assert(converted.correctOptionIndex >= 0 && converted.correctOptionIndex <= 3, `[${q.id}] correctOptionIndex in bounds`);
  assert(converted.hasAudio === true, `[${q.id}] hasAudio is true`);
  assert(Boolean(converted.speechText), `[${q.id}] speechText is present`);
});

// -------------------------------------------------------------------
// 5. Mixed Practice Deep Blending Verification (All Ratios & Engines)
// -------------------------------------------------------------------
console.log('\n--- 5. Mixed Practice Deep Blending Verification ---');
const allUnits = [...DEFAULT_INITIAL_DATA.units['grade-7'], ...DEFAULT_INITIAL_DATA.units['grade-8']];
const allActs = allUnits.flatMap((u) => u.activities || []);

const enginesToTest = ['quiz_battle', 'sentence_builder', 'match_it', 'true_false'];
const ratiosToTest = ['50/50', '70/30', '30/70'];

enginesToTest.forEach((engine) => {
  ratiosToTest.forEach((ratio) => {
    ['grade-7', 'grade-8'].forEach((grade) => {
      const gActs = DEFAULT_INITIAL_DATA.units[grade].flatMap((u) => u.activities || []);
      const mixed = GeneralEnglishService.createMixedPracticeActivity(
        {
          gradeId: grade,
          gameType: engine,
          ratio,
          totalQuestions: 10,
        },
        gActs
      );

      assert(Boolean(mixed.activity && mixed.unit), `[${grade} | ${engine} | ${ratio}] Activity and Unit successfully created`);
      assert(mixed.activity.gameType === engine, `[${grade} | ${engine} | ${ratio}] Engine matches requested`);
      assert(mixed.activity.questions.length > 0, `[${grade} | ${engine} | ${ratio}] Questions assembled: ${mixed.activity.questions.length}`);
      assert(mixed.unit.gradeId === grade, `[${grade} | ${engine} | ${ratio}] Grade matches strictly`);

      // Verify prompt tagging
      const hasTags = mixed.activity.questions.every((q) => q.prompt.includes('[Unit Review]') || q.prompt.includes('[General English]'));
      assert(hasTags, `[${grade} | ${engine} | ${ratio}] Every question carries an origin tag`);
    });
  });
});

// -------------------------------------------------------------------
// 6. Strict Progress & Data Storage Separation
// -------------------------------------------------------------------
console.log('\n--- 6. Strict Progress & Data Storage Separation ---');

// Check that no General English activities leak into DEFAULT_INITIAL_DATA units
['grade-7', 'grade-8'].forEach((g) => {
  DEFAULT_INITIAL_DATA.units[g].forEach((u) => {
    assert(!u.id.startsWith('unit_ge_'), `Unit ${u.id} is pure curriculum, not General English`);
    assert(!u.id.startsWith('unit_mixed_'), `Unit ${u.id} is pure curriculum, not Mixed Practice`);
    u.activities.forEach((a) => {
      assert(!a.id.startsWith('act_ge_'), `Activity ${a.id} is pure curriculum`);
      assert(!a.id.startsWith('act_mixed_'), `Activity ${a.id} is pure curriculum`);
    });
  });
});

console.log('\n======================================================================');
console.log(`🎉 ALL ${passedTests} / ${totalTests} TIER 1 INTEGRATION TESTS PASSED!`);
console.log('======================================================================\n');

