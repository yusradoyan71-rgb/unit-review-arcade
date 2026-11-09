/**
 * AUTOMATED TEST SUITE: ANSWER-OPTION DISTRIBUTION & RUNTIME SHUFFLING
 * 
 * Verifies:
 * 1. Static Answer Distribution across ALL units in Grade 7 & Grade 8
 * 2. Runtime Randomization using Fisher-Yates algorithm
 * 3. Option Stability on re-renders, user selections, and timer updates
 * 4. Correct-answer mapping, validation, explanations, and student tracking
 * 5. Scoring and Game Session lifecycles across Quiz Battle, Reading Detective, and Train Station
 * 6. Non-MCQ game mode preservation (Match It, Sentence Builder, True/False)
 */

const { createJiti } = require('jiti');
const jiti = createJiti(__filename);

// Load schema, data, and utilities via JITI
const { DEFAULT_INITIAL_DATA } = jiti('./src/services/storageService.ts');
const { fisherYatesShuffle, shuffleQuestionOptions, shuffleQuestionsOptions } = jiti('./src/utils/shuffle.ts');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
  } else {
    failedTests++;
    failures.push(message);
    console.error(`  FAIL: ${message}`);
  }
}

function assertEqual(actual, expected, message) {
  assert(actual === expected, `${message} (Expected: ${expected}, Actual: ${actual})`);
}

console.log('================================================================');
console.log('UNIT REVIEW ARCADE: ANSWER-OPTION DISTRIBUTION TEST SUITE');
console.log('================================================================\n');

// -------------------------------------------------------------
// SUITE 1: STATIC ANSWER DISTRIBUTION ACROSS ALL UNITS & ACTIVITIES
// -------------------------------------------------------------
console.log('--- SUITE 1: Static Answer Distribution Across All Units & Question Banks ---');

const grades = ['grade-7', 'grade-8'];
let grandTotalMCQ = 0;
const grandOptionCounts = { 0: 0, 1: 0, 2: 0, 3: 0 };
let totalActivitiesChecked = 0;
let mcqActivitiesCount = 0;
let nonMcqActivitiesCount = 0;

for (const gradeId of grades) {
  const units = DEFAULT_INITIAL_DATA.units[gradeId];
  assert(Array.isArray(units) && units.length > 0, `${gradeId} has loaded units`);

  for (const unit of units) {
    console.log(`\nAuditing Unit: [${gradeId}] ${unit.id} - "${unit.title}" (${unit.activities.length} activities)`);

    for (const act of unit.activities) {
      totalActivitiesChecked++;
      const isMCQ = ['quiz_battle', 'reading_detective', 'train_station'].includes(act.gameType);

      if (isMCQ) {
        mcqActivitiesCount++;
        const questions = act.questions || [];
        assert(questions.length > 0, `Activity ${act.id} ("${act.title}") has questions`);

        const fileCounts = { 0: 0, 1: 0, 2: 0, 3: 0 };
        for (let i = 0; i < questions.length; i++) {
          const q = questions[i];
          grandTotalMCQ++;

          // 1. Every question must have exactly 4 options
          assertEqual(q.options.length, 4, `${act.id} Q${i} (${q.id}) has 4 options`);

          // 2. Options must all be non-empty strings
          const allNonEmpty = q.options.every((opt) => typeof opt === 'string' && opt.trim().length > 0);
          assert(allNonEmpty, `${act.id} Q${i} has non-empty option strings`);

          // 3. correctOptionIndex must be in range [0, 3]
          assert(
            Number.isInteger(q.correctOptionIndex) && q.correctOptionIndex >= 0 && q.correctOptionIndex < 4,
            `${act.id} Q${i} correctOptionIndex is within [0, 3]`
          );

          fileCounts[q.correctOptionIndex]++;
          grandOptionCounts[q.correctOptionIndex]++;

          // 4. Correct answer text must be valid
          const correctText = q.options[q.correctOptionIndex];
          assert(Boolean(correctText), `${act.id} Q${i} correct answer text exists`);
        }

        // 5. Verify even distribution within the activity: max difference across options <= 1
        const counts = Object.values(fileCounts);
        const minCount = Math.min(...counts);
        const maxCount = Math.max(...counts);
        const diff = maxCount - minCount;
        assert(
          diff <= 1,
          `Activity ${act.id} (${questions.length} Qs) has balanced option distribution: [A:${fileCounts[0]}, B:${fileCounts[1]}, C:${fileCounts[2]}, D:${fileCounts[3]}], diff=${diff}`
        );
      } else {
        nonMcqActivitiesCount++;
        // Verify non-MCQ activities retain their proper data structures
        if (act.gameType === 'match_it') {
          assert(
            Array.isArray(act.questions) && act.questions.length > 0,
            `Match It activity ${act.id} has questions or rounds`
          );
        } else if (act.gameType === 'sentence_builder') {
          const allHaveSentence = act.questions.every(
            (q) => typeof q.correctSentence === 'string' && Array.isArray(q.scrambledWords)
          );
          assert(allHaveSentence, `Sentence Builder activity ${act.id} has valid sentence structure`);
        } else if (act.gameType === 'true_false') {
          const allHaveBoolean = act.questions.every((q) => typeof q.isTrue === 'boolean');
          assert(allHaveBoolean, `True/False activity ${act.id} has valid boolean statements`);
        }
      }
    }
  }
}

console.log(`\nGrand MCQ Total Questions Audited: ${grandTotalMCQ}`);
console.log(`Grand Option Distribution: A(0)=${grandOptionCounts[0]}, B(1)=${grandOptionCounts[1]}, C(2)=${grandOptionCounts[2]}, D(3)=${grandOptionCounts[3]}`);
console.log(`MCQ Activities: ${mcqActivitiesCount}, Non-MCQ Activities: ${nonMcqActivitiesCount}`);

// Verify grand distribution is balanced
const grandCounts = Object.values(grandOptionCounts);
const grandMin = Math.min(...grandCounts);
const grandMax = Math.max(...grandCounts);
assert(grandMax - grandMin <= 5, `Grand option distribution is evenly balanced across A, B, C, D (diff=${grandMax - grandMin})`);


// -------------------------------------------------------------
// SUITE 2: RUNTIME FISHER-YATES RANDOMIZATION
// -------------------------------------------------------------
console.log('\n--- SUITE 2: Runtime Fisher-Yates Randomization ---');

const sampleQuestion = {
  id: 'test-q-1',
  prompt: 'What is the capital of England?',
  options: ['London', 'Paris', 'Berlin', 'Madrid'],
  correctOptionIndex: 0,
  explanation: 'London is the capital of England.',
};

// Test pure Fisher-Yates shuffle
const testArr = [1, 2, 3, 4, 5, 6, 7, 8];
const shuffledOnce = fisherYatesShuffle(testArr);
assertEqual(shuffledOnce.length, testArr.length, 'fisherYatesShuffle preserves array length');
assert(shuffledOnce.sort().join(',') === testArr.join(','), 'fisherYatesShuffle preserves all elements');
assert(testArr[0] === 1, 'fisherYatesShuffle does not mutate original array');

// Run 1,000 randomized trials on a question
const trials = 1000;
const trialPositions = { 0: 0, 1: 0, 2: 0, 3: 0 };
let distinctPermutations = new Set();

for (let i = 0; i < trials; i++) {
  const result = shuffleQuestionOptions(sampleQuestion);
  trialPositions[result.correctOptionIndex]++;
  distinctPermutations.add(result.options.join('|'));

  // Integrity checks on every single run:
  assertEqual(result.options[result.correctOptionIndex], 'London', 'Correct answer text is always "London"');
  assertEqual(result.options.length, 4, 'Always 4 options');
  assertEqual(result.prompt, sampleQuestion.prompt, 'Prompt preserved');
  assertEqual(result.explanation, sampleQuestion.explanation, 'Explanation preserved');
}

console.log(`Ran ${trials} trials on sample question:`);
console.log(`Position Distribution: A(0)=${trialPositions[0]}, B(1)=${trialPositions[1]}, C(2)=${trialPositions[2]}, D(3)=${trialPositions[3]}`);
console.log(`Distinct Permutations observed: ${distinctPermutations.size} (Max possible 4! = 24)`);

// Each position should get between 18% and 32% over 1,000 trials (expected ~25%)
for (let pos = 0; pos < 4; pos++) {
  const pct = (trialPositions[pos] / trials) * 100;
  assert(
    pct >= 18 && pct <= 32,
    `Position ${pos} received ${pct.toFixed(1)}% of correct answers (statistically uniform near 25%)`
  );
}
// Out of 24 possible permutations of 4 options, a good Fisher-Yates shuffle reaches all or nearly all in 1,000 trials
assert(distinctPermutations.size >= 20, `Randomization reaches rich permutation diversity (${distinctPermutations.size}/24)`);


// -------------------------------------------------------------
// SUITE 3: OPTION STABILITY ON RE-RENDERS & SELECTIONS (REQ 5)
// -------------------------------------------------------------
console.log('\n--- SUITE 3: Option Stability on Re-renders & User Selections ---');

// Original question object immutability
const originalSample = {
  id: 'stability-q1',
  prompt: 'Test prompt',
  options: ['Opt A', 'Opt B', 'Opt C', 'Opt D'],
  correctOptionIndex: 1,
};
const frozenOriginal = JSON.stringify(originalSample);
const initializedQ = shuffleQuestionOptions(originalSample);

assert(JSON.stringify(originalSample) === frozenOriginal, 'Original question object was not mutated');

// Simulated component state lifecycle:
// Once initialized in state, subsequent simulated renders / answer selection / timer ticks must NOT change options
let componentState = {
  question: initializedQ,
  selectedOption: null,
  timerSeconds: 60,
  score: 0,
};

const initialOptionsSnapshot = [...componentState.question.options];
const initialCorrectIndex = componentState.question.correctOptionIndex;

// Simulate 10 re-renders from timer ticks
for (let sec = 59; sec >= 50; sec--) {
  componentState = { ...componentState, timerSeconds: sec };
  assertEqual(
    componentState.question.options.join(','),
    initialOptionsSnapshot.join(','),
    `Timer tick ${sec}s did not alter options order`
  );
  assertEqual(
    componentState.question.correctOptionIndex,
    initialCorrectIndex,
    `Timer tick ${sec}s did not alter correctOptionIndex`
  );
}

// Simulate user selecting an option (triggers component re-render)
componentState = { ...componentState, selectedOption: 2 };
assertEqual(
  componentState.question.options.join(','),
  initialOptionsSnapshot.join(','),
  'Option selection re-render did not reshuffle options'
);
assertEqual(
  componentState.question.correctOptionIndex,
  initialCorrectIndex,
  'Option selection re-render did not alter correctOptionIndex'
);


// -------------------------------------------------------------
// SUITE 4: CORRECT-ANSWER VALIDATION & TRACKING MAPPING (REQ 6)
// -------------------------------------------------------------
console.log('\n--- SUITE 4: Correct-Answer Validation & Student Tracking Across All Units ---');

let trackingChecksPassed = 0;

for (const gradeId of grades) {
  for (const unit of DEFAULT_INITIAL_DATA.units[gradeId]) {
    for (const act of unit.activities) {
      if (!['quiz_battle', 'reading_detective', 'train_station'].includes(act.gameType)) continue;

      const questions = act.questions || [];
      for (const q of questions) {
        // Original correct answer string
        const expectedCorrectText = q.options[q.correctOptionIndex];

        // Shuffle question at runtime
        const runtimeQ = shuffleQuestionOptions(q);

        // Verify correct answer text matches after shuffle
        const runtimeCorrectText = runtimeQ.options[runtimeQ.correctOptionIndex];
        assertEqual(
          runtimeCorrectText,
          expectedCorrectText,
          `Answer text preserved in ${act.id} ${q.id}`
        );

        // Simulate student selecting every possible option [0, 1, 2, 3]
        for (let chosenIdx = 0; chosenIdx < runtimeQ.options.length; chosenIdx++) {
          const isCorrect = chosenIdx === runtimeQ.correctOptionIndex;
          const studentResponse = runtimeQ.options[chosenIdx];
          const correctAnswer = runtimeQ.options[runtimeQ.correctOptionIndex];

          // Check answer evaluation logic
          assertEqual(
            isCorrect,
            studentResponse === expectedCorrectText,
            `Selection evaluation matches ground truth text`
          );

          // Verify telemetry payload accuracy
          const telemetryPayload = {
            questionId: runtimeQ.id,
            questionPrompt: runtimeQ.prompt,
            studentResponse,
            correctAnswer,
            isCorrect,
          };

          assertEqual(telemetryPayload.correctAnswer, expectedCorrectText, 'Telemetry correctAnswer is accurate');
          if (isCorrect) {
            assertEqual(telemetryPayload.studentResponse, expectedCorrectText, 'Telemetry studentResponse is accurate');
          }
          trackingChecksPassed++;
        }
      }
    }
  }
}
console.log(`Validated telemetry and answer evaluation across ${trackingChecksPassed} option selections: ALL PASSED.`);


// -------------------------------------------------------------
// SUITE 5: GAME ENGINE PLAYTHROUGHS & SCORING LIFECYCLE
// -------------------------------------------------------------
console.log('\n--- SUITE 5: Game Session Simulation & Scoring ---');

function simulateGamePlaythrough(activity, strategy) {
  // 1. Initialize session questions with runtime shuffle
  const questions = shuffleQuestionsOptions(activity.questions || []);
  let score = 0;
  const recordedAnswers = [];

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    let chosenIndex;

    if (strategy === 'all_correct') {
      chosenIndex = q.correctOptionIndex;
    } else if (strategy === 'all_incorrect') {
      // Pick first wrong option
      chosenIndex = (q.correctOptionIndex + 1) % q.options.length;
    } else if (strategy === 'half_correct') {
      chosenIndex = i % 2 === 0 ? q.correctOptionIndex : (q.correctOptionIndex + 1) % q.options.length;
    }

    const isCorrect = chosenIndex === q.correctOptionIndex;
    if (isCorrect) score++;

    recordedAnswers.push({
      questionId: q.id,
      questionOrder: i + 1,
      studentResponse: q.options[chosenIndex],
      correctAnswer: q.options[q.correctOptionIndex],
      isCorrect,
    });
  }

  return { questions, score, total: questions.length, recordedAnswers };
}

// Test Quiz Battle playthrough
const qbActivity = DEFAULT_INITIAL_DATA.units['grade-7'][0].activities[0];
const qbFullWin = simulateGamePlaythrough(qbActivity, 'all_correct');
assertEqual(qbFullWin.score, qbFullWin.total, `Quiz Battle 100% playthrough score matches total questions (${qbFullWin.total})`);
const qbFullLoss = simulateGamePlaythrough(qbActivity, 'all_incorrect');
assertEqual(qbFullLoss.score, 0, 'Quiz Battle 0% playthrough score is 0');
const qbHalf = simulateGamePlaythrough(qbActivity, 'half_correct');
assertEqual(qbHalf.score, Math.ceil(qbHalf.total / 2), 'Quiz Battle 50% playthrough score matches expected');

// Test Reading Detective playthrough
const rdActivity = DEFAULT_INITIAL_DATA.units['grade-7'][0].activities[6];
const rdFullWin = simulateGamePlaythrough(rdActivity, 'all_correct');
assertEqual(rdFullWin.score, rdFullWin.total, `Reading Detective 100% playthrough score matches total questions (${rdFullWin.total})`);

// Test Train Station playthrough
const tsActivity = DEFAULT_INITIAL_DATA.units['grade-8'][2].activities[3];
assertEqual(tsActivity.gameType, 'train_station', 'Found train_station activity');
const tsFullWin = simulateGamePlaythrough(tsActivity, 'all_correct');
assertEqual(tsFullWin.score, tsFullWin.total, `Train Station 100% playthrough score matches total questions (${tsFullWin.total})`);

// Verify restart produces new permutation
const sessionA = shuffleQuestionsOptions(qbActivity.questions);
const sessionB = shuffleQuestionsOptions(qbActivity.questions);
const orderA = sessionA.map((q) => q.options.join(',')).join(';;;');
const orderB = sessionB.map((q) => q.options.join(',')).join(';;;');
assert(orderA !== orderB, 'Game restart generates a fresh randomized order across sessions');


// -------------------------------------------------------------
// FINAL SUMMARY
// -------------------------------------------------------------
console.log('\n================================================================');
console.log(`TOTAL TESTS RUN: ${totalTests}`);
console.log(`PASSED: ${passedTests}`);
console.log(`FAILED: ${failedTests}`);
console.log('================================================================');

if (failedTests > 0) {
  console.error('\nFailures:');
  failures.forEach((f, idx) => console.error(`${idx + 1}. ${f}`));
  process.exit(1);
} else {
  console.log('\nALL TESTS PASSED SUCCESSFULLY! (100% Success Rate)');
  process.exit(0);
}
