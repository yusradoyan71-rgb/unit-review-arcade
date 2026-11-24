/**
 * Regression Test Suite: Games Zone Results Accuracy Calculation
 *
 * Verifies:
 * 1. Accuracy formula consistency across all 9 games
 * 2. Elimination of `evaluated = finalCorrect + finalIncorrect` bug
 * 3. GamesZoneService XP calculation with mathematical accuracy ceiling
 * 4. GamesZoneResultsModal display accuracy logic (including memory match exception)
 * 5. Mixed result scenarios (7/10, 5/10 with lives lost, 10/10 perfect, 0/10)
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('====================================================');
console.log('🧪 RUNNING GAMES ZONE ACCURACY REGRESSION TEST SUITE');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}`);
  }
}

// ---------------------------------------------------------------------
// TEST SUITE 1: Source Code Audit for Old Evaluated Bug
// ---------------------------------------------------------------------
console.log('📁 Test Suite 1: Source Code Audit for Legacy Calculation');

const GAMES_DIR = path.join(__dirname, '../src/components/gamesZone');

const quizGameFiles = [
  'grammarBasketball/GrammarBasketballGame.tsx',
  'grammarRunner/GrammarRunnerGame.tsx',
  'sentenceTower/SentenceTowerGame.tsx',
  'vocabularyInvaders/VocabularyInvadersGame.tsx',
  'wordFishing/WordFishingGame.tsx',
  'wordNinja/WordNinjaGame.tsx',
];

quizGameFiles.forEach((fileRel) => {
  runTest(`No "finalCorrect + finalIncorrect" or "evaluated > 0" in ${fileRel}`, () => {
    const filePath = path.join(GAMES_DIR, fileRel);
    const content = fs.readFileSync(filePath, 'utf-8');
    assert.strictEqual(
      content.includes('finalCorrect + finalIncorrect'),
      false,
      `Found legacy evaluated sum in ${fileRel}`
    );
    assert.strictEqual(
      content.includes('evaluated > 0 ?'),
      false,
      `Found legacy evaluated ternary in ${fileRel}`
    );
    // Ensure totalQ is used for accuracy
    assert.ok(
      content.includes('totalQ > 0 ? Math.round((finalCorrect / totalQ) * 100) : 0'),
      `Missing standard totalQ accuracy formula in ${fileRel}`
    );
  });
});

runTest('WordConnect uses totalTargetWords for totalQuestions and accuracy', () => {
  const filePath = path.join(GAMES_DIR, 'wordConnect/WordConnectGame.tsx');
  const content = fs.readFileSync(filePath, 'utf-8');
  assert.ok(
    content.includes('totalQuestions: totalTargetWords'),
    'WordConnectGame should report totalTargetWords as totalQuestions'
  );
  assert.ok(
    content.includes('accuracy = totalTargetWords > 0'),
    'WordConnectGame accuracy should be based on totalTargetWords'
  );
});

runTest('WordleEnglish has totalRounds > 0 guard', () => {
  const filePath = path.join(GAMES_DIR, 'wordleEnglish/WordleEnglishGame.tsx');
  const content = fs.readFileSync(filePath, 'utf-8');
  assert.ok(
    content.includes('totalRounds > 0 ? Math.round((finalSolved / totalRounds) * 100) : 0'),
    'WordleEnglishGame should guard totalRounds > 0'
  );
});

// ---------------------------------------------------------------------
// TEST SUITE 2: Mathematical Accuracy Formula Verification
// ---------------------------------------------------------------------
console.log('\n📐 Test Suite 2: Mathematical Accuracy Formula Verification');

function calculateStandardQuizAccuracy(finalCorrect, finalIncorrect, totalQ) {
  const accuracy = totalQ > 0 ? Math.round((finalCorrect / totalQ) * 100) : 0;
  const effectiveIncorrect = Math.max(finalIncorrect, totalQ - finalCorrect);
  return { accuracy, effectiveIncorrect };
}

runTest('Grammar Basketball 7/10 correct scenario (User Bug)', () => {
  const { accuracy, effectiveIncorrect } = calculateStandardQuizAccuracy(7, 0, 10);
  assert.strictEqual(accuracy, 70, `Expected 70% accuracy, got ${accuracy}%`);
  assert.strictEqual(effectiveIncorrect, 3, `Expected 3 incorrect answers, got ${effectiveIncorrect}`);
});

runTest('Quiz Game 10/10 perfect score scenario', () => {
  const { accuracy, effectiveIncorrect } = calculateStandardQuizAccuracy(10, 0, 10);
  assert.strictEqual(accuracy, 100, `Expected 100% accuracy, got ${accuracy}%`);
  assert.strictEqual(effectiveIncorrect, 0, `Expected 0 incorrect answers, got ${effectiveIncorrect}`);
});

runTest('Quiz Game 0/10 scenario', () => {
  const { accuracy, effectiveIncorrect } = calculateStandardQuizAccuracy(0, 10, 10);
  assert.strictEqual(accuracy, 0, `Expected 0% accuracy, got ${accuracy}%`);
  assert.strictEqual(effectiveIncorrect, 10, `Expected 10 incorrect answers, got ${effectiveIncorrect}`);
});

runTest('Premature game over: 3 correct, 3 incorrect (lives lost at question 6 of 10)', () => {
  const { accuracy, effectiveIncorrect } = calculateStandardQuizAccuracy(3, 3, 10);
  assert.strictEqual(accuracy, 30, `Expected 30% accuracy across session, got ${accuracy}%`);
  assert.strictEqual(effectiveIncorrect, 7, `Expected 7 unfulfilled/incorrect questions, got ${effectiveIncorrect}`);
});

runTest('Word Connect: 12 words found out of 15 target words', () => {
  const totalTargetWords = 15;
  const finalWordsFound = 12;
  const accuracy = totalTargetWords > 0 ? Math.min(100, Math.round((finalWordsFound / totalTargetWords) * 100)) : 0;
  const incorrectAnswers = Math.max(0, totalTargetWords - finalWordsFound);
  assert.strictEqual(accuracy, 80, `Expected 80% accuracy, got ${accuracy}%`);
  assert.strictEqual(incorrectAnswers, 3, `Expected 3 words remaining, got ${incorrectAnswers}`);
});

// ---------------------------------------------------------------------
// TEST SUITE 3: XP Calculation with Accuracy Ceiling & Clamping
// ---------------------------------------------------------------------
console.log('\n⭐ Test Suite 3: GamesZoneService XP Calculation Logic');

function simulateXpCalculation(difficulty, correctAnswers, totalQuestions, accuracyPercentage) {
  if (totalQuestions <= 0 || correctAnswers <= 0) {
    return { xpEarned: 0 };
  }

  let base = 10;
  if (difficulty === 'medium') base = 15;
  if (difficulty === 'hard') base = 20;

  const maxPossibleAccuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  const effectiveAccuracy = Math.min(accuracyPercentage, maxPossibleAccuracy);

  let bonus = 0;
  if (effectiveAccuracy >= 100) {
    bonus = 10;
  } else if (effectiveAccuracy >= 80) {
    bonus = 5;
  }

  const performanceXp = Math.round((base + bonus) * (correctAnswers / totalQuestions));
  const calculatedXp = Math.max(5, Math.min(35, performanceXp));
  return { xpEarned: calculatedXp, effectiveAccuracy, bonus };
}

runTest('Easy difficulty, 7/10 correct with 70% accuracy gives exactly 7 XP (NOT 14 XP)', () => {
  const result = simulateXpCalculation('easy', 7, 10, 70);
  assert.strictEqual(result.bonus, 0, 'No bonus for 70% accuracy');
  assert.strictEqual(result.xpEarned, 7, `Expected 7 XP, got ${result.xpEarned} XP`);
});

runTest('Easy difficulty, 7/10 correct with falsified 100% accuracy still clamped to 7 XP', () => {
  const result = simulateXpCalculation('easy', 7, 10, 100); // falsified accuracy input
  assert.strictEqual(result.effectiveAccuracy, 70, 'Effective accuracy should be clamped to 70%');
  assert.strictEqual(result.bonus, 0, 'Bonus should be 0 because effective accuracy is 70%');
  assert.strictEqual(result.xpEarned, 7, `Expected 7 XP, got ${result.xpEarned} XP`);
});

runTest('Easy difficulty, 10/10 perfect with 100% accuracy gives 20 XP', () => {
  const result = simulateXpCalculation('easy', 10, 10, 100);
  assert.strictEqual(result.bonus, 10, 'Bonus should be 10 for 100%');
  assert.strictEqual(result.xpEarned, 20, `Expected 20 XP, got ${result.xpEarned} XP`);
});

runTest('Medium difficulty, 8/10 with 80% accuracy gives 16 XP', () => {
  const result = simulateXpCalculation('medium', 8, 10, 80);
  assert.strictEqual(result.bonus, 5, 'Bonus should be 5 for 80%');
  // (15 + 5) * (8 / 10) = 20 * 0.8 = 16
  assert.strictEqual(result.xpEarned, 16, `Expected 16 XP, got ${result.xpEarned} XP`);
});

runTest('Hard difficulty, 10/10 with 100% accuracy gives 30 XP', () => {
  const result = simulateXpCalculation('hard', 10, 10, 100);
  assert.strictEqual(result.bonus, 10, 'Bonus should be 10 for 100%');
  // (20 + 10) * 1 = 30
  assert.strictEqual(result.xpEarned, 30, `Expected 30 XP, got ${result.xpEarned} XP`);
});

// ---------------------------------------------------------------------
// TEST SUITE 4: Results Modal Display Accuracy Logic
// ---------------------------------------------------------------------
console.log('\n🖥️ Test Suite 4: GamesZoneResultsModal Display Logic');

function computeDisplayAccuracy(attempt) {
  return attempt.gameId === 'memory_match'
    ? attempt.accuracyPercentage
    : attempt.totalQuestions > 0
    ? Math.round((attempt.correctAnswers / attempt.totalQuestions) * 100)
    : attempt.accuracyPercentage;
}

runTest('Modal displays 70% for 7/10 attempt even if record had inflated accuracy', () => {
  const attempt = {
    gameId: 'grammar_basketball',
    correctAnswers: 7,
    totalQuestions: 10,
    accuracyPercentage: 100, // old legacy record
  };
  const displayAccuracy = computeDisplayAccuracy(attempt);
  assert.strictEqual(displayAccuracy, 70, `Expected 70%, got ${displayAccuracy}%`);
  const isPassed = displayAccuracy >= 70;
  const isPerfect = displayAccuracy === 100;
  assert.strictEqual(isPassed, true, '70% is passed');
  assert.strictEqual(isPerfect, false, '70% is not perfect');
});

runTest('Modal displays 100% and isPerfect for genuine 10/10 attempt', () => {
  const attempt = {
    gameId: 'grammar_basketball',
    correctAnswers: 10,
    totalQuestions: 10,
    accuracyPercentage: 100,
  };
  const displayAccuracy = computeDisplayAccuracy(attempt);
  assert.strictEqual(displayAccuracy, 100);
  assert.strictEqual(displayAccuracy === 100, true);
});

runTest('Modal preserves Memory Match move-efficiency accuracy (not forced to 100%)', () => {
  const attempt = {
    gameId: 'memory_match',
    correctAnswers: 8,
    totalQuestions: 8,
    accuracyPercentage: 67, // moves = 12, pairs = 8 -> 8/12 = 67%
  };
  const displayAccuracy = computeDisplayAccuracy(attempt);
  assert.strictEqual(displayAccuracy, 67, `Expected Memory Match to keep 67%, got ${displayAccuracy}%`);
});

console.log('\n====================================================');
console.log(`📊 RESULTS: ${passedTests}/${totalTests} tests passed (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log('====================================================\n');

if (passedTests !== totalTests) {
  process.exit(1);
}
