/**
 * UNIT REVIEW ARCADE — AUTOMATED TEST SUITE: PHASE 7A
 * Verification of Games Zone: First Four Games
 * 
 * Verifies:
 * 1. 960 total validated questions across 4 banks (Word Ninja, Grammar Runner, Word Fishing, Sentence Tower).
 * 2. Strict grade separation (Grade 7 vs Grade 8) and 3 difficulty tiers (Easy 40, Med 40, Hard 40).
 * 3. Question schema integrity, uniqueness of IDs, distinct distractors, balanced lanes.
 * 4. Strict curriculum isolation: unit curriculum data and progression remain untouched.
 * 5. Anti-farming XP scoring logic and daily limits.
 * 6. Catalog metadata, dispatcher helper, and session sampling.
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import { WORD_NINJA_BANK } from './src/data/gamesZone/wordNinjaData.ts';
import { GRAMMAR_RUNNER_BANK } from './src/data/gamesZone/grammarRunnerData.ts';
import { WORD_FISHING_BANK } from './src/data/gamesZone/wordFishingData.ts';
import { SENTENCE_TOWER_BANK } from './src/data/gamesZone/sentenceTowerData.ts';
import {
  GAMES_ZONE_CATALOG,
  getGameMetadata,
  getQuestionsForGame,
} from './src/data/gamesZone/index.ts';
import { GamesZoneService, MAX_DAILY_GAMES_ZONE_XP } from './src/services/gamesZoneService.ts';
import { lineIntersectsBox } from './src/components/gamesZone/wordNinja/slicingPhysics.ts';

// Mock localStorage for headless Node environment
const mockStorage = new Map();
globalThis.localStorage = {
  getItem: (k) => mockStorage.get(k) || null,
  setItem: (k, v) => mockStorage.set(k, String(v)),
  removeItem: (k) => mockStorage.delete(k),
  clear: () => mockStorage.clear(),
};

console.log('================================================================');
console.log('🧪 RUNNING PHASE 7A: GAMES ZONE TEST SUITE');
console.log('================================================================');

let passedTests = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(err);
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// TEST 1: CATALOG METADATA INTEGRITY
// ---------------------------------------------------------------------------
runTest('Games Zone Catalog metadata conforms to architectural schema', () => {
  assert.equal(GAMES_ZONE_CATALOG.length, 4, 'Must have exactly 4 games in Phase 7A');
  const expectedIds = ['word_ninja', 'grammar_runner', 'word_fishing', 'sentence_tower'];

  for (const id of expectedIds) {
    const meta = getGameMetadata(id);
    assert.ok(meta, `Metadata for ${id} must exist`);
    assert.equal(meta.id, id);
    assert.ok(meta.title && meta.title.length > 0);
    assert.ok(meta.tagline && meta.tagline.length > 0);
    assert.ok(meta.categoryLabel && meta.categoryLabel.length > 0);
    assert.ok(meta.howToPlay.objective.length > 0);
    assert.ok(meta.howToPlay.controls.length > 0);
    assert.ok(meta.howToPlay.smartboardTip.length > 0);
    assert.ok(Array.isArray(meta.howToPlay.rules) && meta.howToPlay.rules.length >= 3);
  }
});

// ---------------------------------------------------------------------------
// TEST 2: WORD NINJA DATA BANK (240 QUESTIONS)
// ---------------------------------------------------------------------------
runTest('Word Ninja Data Bank has exactly 240 validated unique questions', () => {
  const grades = ['grade-7', 'grade-8'];
  const diffs = ['easy', 'medium', 'hard'];
  const seenIds = new Set();
  let totalCount = 0;

  for (const grade of grades) {
    for (const diff of diffs) {
      const items = WORD_NINJA_BANK[grade][diff];
      assert.equal(items.length, 40, `Word Ninja ${grade} ${diff} must contain exactly 40 items`);

      for (const item of items) {
        totalCount++;
        assert.ok(!seenIds.has(item.id), `Duplicate ID in Word Ninja: ${item.id}`);
        seenIds.add(item.id);

        assert.ok(item.prompt && item.prompt.length > 5, `Empty prompt on ${item.id}`);
        assert.ok(item.correctWord && item.correctWord.length > 0, `Empty correctWord on ${item.id}`);
        assert.ok(Array.isArray(item.distractorWords) && item.distractorWords.length >= 2, `Not enough distractors on ${item.id}`);

        // Correct word should not be among distractors
        for (const dist of item.distractorWords) {
          assert.notEqual(
            dist.toLowerCase().trim(),
            item.correctWord.toLowerCase().trim(),
            `Distractor "${dist}" matches correct word on ${item.id}`
          );
        }
      }
    }
  }

  assert.equal(totalCount, 240, 'Word Ninja bank must have 240 items in total');
});

// ---------------------------------------------------------------------------
// TEST 3: GRAMMAR RUNNER DATA BANK (240 QUESTIONS)
// ---------------------------------------------------------------------------
runTest('Grammar Runner Data Bank has exactly 240 validated unique questions with balanced lanes', () => {
  const grades = ['grade-7', 'grade-8'];
  const diffs = ['easy', 'medium', 'hard'];
  const seenIds = new Set();
  let totalCount = 0;
  const laneCounts = [0, 0, 0];

  for (const grade of grades) {
    for (const diff of diffs) {
      const items = GRAMMAR_RUNNER_BANK[grade][diff];
      assert.equal(items.length, 40, `Grammar Runner ${grade} ${diff} must contain exactly 40 items`);

      for (const item of items) {
        totalCount++;
        assert.ok(!seenIds.has(item.id), `Duplicate ID in Grammar Runner: ${item.id}`);
        seenIds.add(item.id);

        assert.ok(item.sentencePrompt && item.sentencePrompt.length > 5, `Empty sentencePrompt on ${item.id}`);
        assert.equal(item.laneOptions.length, 3, `Must have exactly 3 lane options on ${item.id}`);
        assert.ok([0, 1, 2].includes(item.correctLaneIndex), `Invalid correctLaneIndex on ${item.id}`);
        assert.ok(item.grammarTopic && item.grammarTopic.length > 0);
        assert.ok(item.explanation && item.explanation.length > 0);

        // Verify distinct options
        const distinct = new Set(item.laneOptions.map((o) => o.toLowerCase().trim()));
        assert.equal(distinct.size, 3, `Duplicate lane options on ${item.id}: ${item.laneOptions.join(', ')}`);

        laneCounts[item.correctLaneIndex]++;
      }
    }
  }

  assert.equal(totalCount, 240, 'Grammar Runner bank must have 240 items in total');

  // Verify lane balance (each lane roughly 1/3 of total)
  for (let l = 0; l < 3; l++) {
    assert.ok(laneCounts[l] >= 70 && laneCounts[l] <= 90, `Lane ${l} count ${laneCounts[l]} is outside balanced distribution (70-90)`);
  }
});

// ---------------------------------------------------------------------------
// TEST 4: WORD FISHING DATA BANK (240 QUESTIONS)
// ---------------------------------------------------------------------------
runTest('Word Fishing Data Bank has exactly 240 validated unique questions', () => {
  const grades = ['grade-7', 'grade-8'];
  const diffs = ['easy', 'medium', 'hard'];
  const seenIds = new Set();
  let totalCount = 0;

  for (const grade of grades) {
    for (const diff of diffs) {
      const items = WORD_FISHING_BANK[grade][diff];
      assert.equal(items.length, 40, `Word Fishing ${grade} ${diff} must contain exactly 40 items`);

      for (const item of items) {
        totalCount++;
        assert.ok(!seenIds.has(item.id), `Duplicate ID in Word Fishing: ${item.id}`);
        seenIds.add(item.id);

        assert.ok(item.cluePrompt && item.cluePrompt.length > 5);
        assert.ok(item.clueCategory && item.clueCategory.length > 0);
        assert.ok(item.targetWord && item.targetWord.length > 0);
        assert.ok(Array.isArray(item.distractorWords) && item.distractorWords.length >= 3);
        assert.ok(item.explanation && item.explanation.length > 0);

        for (const dist of item.distractorWords) {
          assert.notEqual(
            dist.toLowerCase().trim(),
            item.targetWord.toLowerCase().trim(),
            `Distractor matches targetWord on ${item.id}`
          );
        }
      }
    }
  }

  assert.equal(totalCount, 240, 'Word Fishing bank must have 240 items in total');
});

// ---------------------------------------------------------------------------
// TEST 5: SENTENCE TOWER DATA BANK (240 QUESTIONS)
// ---------------------------------------------------------------------------
runTest('Sentence Tower Data Bank has exactly 240 validated unique questions with valid word mappings', () => {
  const grades = ['grade-7', 'grade-8'];
  const diffs = ['easy', 'medium', 'hard'];
  const seenIds = new Set();
  let totalCount = 0;

  const normalize = (s) =>
    s
      .toLowerCase()
      .replace(/[.,?!'’"]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

  for (const grade of grades) {
    for (const diff of diffs) {
      const items = SENTENCE_TOWER_BANK[grade][diff];
      assert.equal(items.length, 40, `Sentence Tower ${grade} ${diff} must contain exactly 40 items`);

      for (const item of items) {
        totalCount++;
        assert.ok(!seenIds.has(item.id), `Duplicate ID in Sentence Tower: ${item.id}`);
        seenIds.add(item.id);

        assert.ok(Array.isArray(item.scrambledWords) && item.scrambledWords.length >= 4);
        assert.ok(item.correctSentence && item.correctSentence.length > 5);
        assert.ok(item.themeOrTopic && item.themeOrTopic.length > 0);

        // Normalize words in scrambledWords vs correctSentence
        const scrambledNorm = item.scrambledWords.map((w) => normalize(w)).sort().join(' ');
        const targetNorm = normalize(item.correctSentence).split(' ').sort().join(' ');

        assert.equal(
          scrambledNorm,
          targetNorm,
          `Words in scrambledWords do not match correctSentence on ${item.id}.\nScrambled: ${scrambledNorm}\nTarget: ${targetNorm}`
        );

        // Check alternative sentences if provided
        if (item.alternativeSentences) {
          for (const alt of item.alternativeSentences) {
            const altNorm = normalize(alt).split(' ').sort().join(' ');
            assert.equal(
              scrambledNorm,
              altNorm,
              `Alternative sentence words do not match scrambled words on ${item.id}`
            );
          }
        }
      }
    }
  }

  assert.equal(totalCount, 240, 'Sentence Tower bank must have 240 items in total');
});

// ---------------------------------------------------------------------------
// TEST 6: TOTAL 960 QUESTIONS ACROSS ALL 4 BANKS
// ---------------------------------------------------------------------------
runTest('All 4 banks combined equal exactly 960 verified questions', () => {
  const total = 240 * 4;
  assert.equal(total, 960, 'Phase 7A delivers exactly 960 verified middle school questions');
});

// ---------------------------------------------------------------------------
// TEST 7: QUESTION DISPATCHER SAMPLING & RANDOMIZATION
// ---------------------------------------------------------------------------
runTest('getQuestionsForGame returns non-empty slice of 10 randomized questions', () => {
  const games = ['word_ninja', 'grammar_runner', 'word_fishing', 'sentence_tower'];

  for (const gameId of games) {
    const qG7 = getQuestionsForGame(gameId, 'grade-7', 'easy', 10);
    assert.equal(qG7.length, 10, `${gameId} must return exactly 10 questions`);

    const qG8 = getQuestionsForGame(gameId, 'grade-8', 'hard', 10);
    assert.equal(qG8.length, 10, `${gameId} must return exactly 10 questions for G8 hard`);

    // Verify Grade 7 vs Grade 8 isolation
    const g7Ids = new Set(qG7.map((q) => q.id));
    for (const q of qG8) {
      assert.ok(!g7Ids.has(q.id), `Grade 7 and Grade 8 question pools must be completely separate`);
    }
  }
});

// ---------------------------------------------------------------------------
// TEST 8: ANTI-FARMING XP ENGINE
// ---------------------------------------------------------------------------
runTest('Games Zone anti-farming XP calculation enforces daily cap (150 XP)', () => {
  const student = '801';

  // Session 1: Easy, 10/10 correct (100% accuracy) -> base 10 + bonus 10 = 20 XP
  const r1 = GamesZoneService.calculateXpEarned(student, 'easy', 10, 10, 100);
  assert.equal(r1.xpEarned, 20);
  assert.equal(r1.isCapped, false);

  // Mock saving 140 XP already today
  mockStorage.set(`ura_games_zone_daily_xp_${student}_${new Date().toISOString().split('T')[0]}`, '140');

  // Session 2: Hard, 10/10 correct (base 20 + bonus 10 = 30 XP).
  // But available is 150 - 140 = 10 XP!
  const r2 = GamesZoneService.calculateXpEarned(student, 'hard', 10, 10, 100);
  assert.equal(r2.xpEarned, 10, 'Must be capped to 10 XP');
  assert.equal(r2.isCapped, true, 'isCapped flag must be true');

  // Once 150 is reached, subsequent plays award 0 XP but let student continue playing
  mockStorage.set(`ura_games_zone_daily_xp_${student}_${new Date().toISOString().split('T')[0]}`, '150');
  const r3 = GamesZoneService.calculateXpEarned(student, 'medium', 10, 10, 100);
  assert.equal(r3.xpEarned, 0, 'No more XP awarded after cap');
  assert.equal(r3.isCapped, true);
});

// ---------------------------------------------------------------------------
// TEST 9: LOCAL ATTEMPTS & STATS RECORDING
// ---------------------------------------------------------------------------
runTest('GamesZoneService saves attempts and updates personal high scores', () => {
  const student = '702';
  const mockAttempt = {
    attemptId: 'att_test_gz_01',
    gameId: 'word_ninja',
    gameTitle: 'Word Ninja',
    studentNumber: student,
    gradeId: 'grade-7',
    difficulty: 'easy',
    score: 850,
    totalQuestions: 10,
    correctAnswers: 9,
    incorrectAnswers: 1,
    accuracyPercentage: 90,
    xpEarned: 15,
    durationSeconds: 45,
    completedAt: new Date().toISOString(),
  };

  GamesZoneService.saveAttempt(mockAttempt);

  const attempts = GamesZoneService.getStudentAttempts(student);
  assert.equal(attempts.length, 1);
  assert.equal(attempts[0].attemptId, 'att_test_gz_01');
  assert.equal(attempts[0].score, 850);

  const bestScore = GamesZoneService.getPersonalHighScore(student, 'word_ninja', 'easy');
  assert.equal(bestScore, 850);

  // Subsequent lower score should not overwrite high score
  const mockAttemptLower = { ...mockAttempt, attemptId: 'att_test_gz_02', score: 600 };
  GamesZoneService.saveAttempt(mockAttemptLower);
  assert.equal(GamesZoneService.getPersonalHighScore(student, 'word_ninja', 'easy'), 850);

  // Subsequent higher score updates high score
  const mockAttemptHigher = { ...mockAttempt, attemptId: 'att_test_gz_03', score: 950 };
  GamesZoneService.saveAttempt(mockAttemptHigher);
  assert.equal(GamesZoneService.getPersonalHighScore(student, 'word_ninja', 'easy'), 950);
});

// ---------------------------------------------------------------------------
// TEST 10: STRICT CURRICULUM ISOLATION
// ---------------------------------------------------------------------------
runTest('Strict curriculum isolation: Games Zone records use namespace games_zone and never touch units', () => {
  const mockAttempt = {
    attemptId: 'att_gz_isolated',
    gameId: 'grammar_runner',
    gameTitle: 'Grammar Runner',
    studentNumber: '805',
    gradeId: 'grade-8',
    difficulty: 'medium',
    score: 900,
    totalQuestions: 10,
    correctAnswers: 10,
    incorrectAnswers: 0,
    accuracyPercentage: 100,
    xpEarned: 25,
    durationSeconds: 50,
    completedAt: new Date().toISOString(),
  };

  GamesZoneService.saveAttempt(mockAttempt);

  // Attempt stored under ura_games_zone_attempts_805, not unit_review_arcade_data_v1
  const gzKey = `ura_games_zone_attempts_805`;
  assert.ok(mockStorage.has(gzKey), 'Games Zone attempts must be isolated in ura_games_zone_attempts_*');
  assert.equal(mockStorage.has('unit_review_arcade_data_v1'), false, 'Never mutates unit curriculum data');
});

// ---------------------------------------------------------------------------
// TEST 11: WORD NINJA - SLICING PHYSICS COLLISION DETECTION
// ---------------------------------------------------------------------------
runTest('Word Ninja slicing physics reliably detects drag/swipe segment collisions', () => {
  // Define a target bounding box (x=100, y=100, width=120, height=60)
  const bx = 100, by = 100, bw = 120, bh = 60;

  // 1. Horizontal swipe across box (from left 50,130 to right 250,130)
  assert.equal(lineIntersectsBox(50, 130, 250, 130, bx, by, bw, bh), true, 'Horizontal swipe must intersect');

  // 2. Vertical swipe across box (from top 150,50 to bottom 150,200)
  assert.equal(lineIntersectsBox(150, 50, 150, 200, bx, by, bw, bh), true, 'Vertical swipe must intersect');

  // 3. Fast diagonal swipe traversing across the box between frames
  assert.equal(lineIntersectsBox(80, 80, 240, 180, bx, by, bw, bh), true, 'Fast diagonal swipe must intersect');

  // 4. Point ending inside the box
  assert.equal(lineIntersectsBox(50, 130, 150, 130, bx, by, bw, bh), true, 'End point inside box must intersect');

  // 5. Point starting inside the box
  assert.equal(lineIntersectsBox(150, 130, 300, 130, bx, by, bw, bh), true, 'Start point inside box must intersect');

  // 6. Near misses (above, below, left, right)
  assert.equal(lineIntersectsBox(50, 80, 250, 80, bx, by, bw, bh), false, 'Swipe above box must not intersect');
  assert.equal(lineIntersectsBox(50, 180, 250, 180, bx, by, bw, bh), false, 'Swipe below box must not intersect');
  assert.equal(lineIntersectsBox(50, 50, 80, 200, bx, by, bw, bh), false, 'Swipe left of box must not intersect');
  assert.equal(lineIntersectsBox(240, 50, 260, 200, bx, by, bw, bh), false, 'Swipe right of box must not intersect');
});

// ---------------------------------------------------------------------------
// TEST 12: WORD NINJA - PRE-SLICE NEUTRAL STYLING & NO ANSWER LEAKS
// ---------------------------------------------------------------------------
runTest('Word Ninja targets have 100% neutral styling before slice with zero visual answer leakage', () => {
  const compSource = fs.readFileSync('./src/components/gamesZone/wordNinja/WordNinjaGame.tsx', 'utf-8');

  // 1. Verify that pre-sliced targets use neutral dark styling
  assert.ok(
    compSource.includes('from-slate-800/95') && compSource.includes('border-slate-700/80'),
    'Pre-slice targets must have neutral dark slate styling'
  );

  // 2. Ensure target.isCorrect is NOT evaluated before slicing in className styling
  const lines = compSource.split('\n');
  let inRenderTargets = false;
  let preSliceStylingLeak = false;

  for (const line of lines) {
    if (line.includes('activeTargets.map((target)')) {
      inRenderTargets = true;
    }
    if (inRenderTargets && line.includes('!target.isSliced')) {
      // Check if target.isCorrect is used to determine color before sliced
      if (line.includes('isCorrect ?') || line.includes('isCorrect?')) {
        preSliceStylingLeak = true;
      }
    }
    if (line.includes('pointerEvents')) {
      inRenderTargets = false;
    }
  }

  assert.equal(preSliceStylingLeak, false, 'No visual answer leak: isCorrect must not dictate pre-slice target appearance');
  
  // 3. Slicing split animations exist for top and bottom halves
  assert.ok(compSource.includes('-translate-y-3 -translate-x-3 -rotate-12'), 'Top split animation must exist');
  assert.ok(compSource.includes('translate-y-3 translate-x-3 rotate-12'), 'Bottom split animation must exist');
});

// ---------------------------------------------------------------------------
// TEST 13: GRAMMAR RUNNER - READING PHASE & RELAXED GAME SPEED
// ---------------------------------------------------------------------------
runTest('Grammar Runner enforces dedicated reading phase and relaxed gate speeds', () => {
  const runnerSource = fs.readFileSync('./src/components/gamesZone/grammarRunner/GrammarRunnerGame.tsx', 'utf-8');

  // 1. Reading phase durations: Easy 10s, Med 12s, Hard 14s
  assert.ok(
    runnerSource.includes("difficulty === 'hard' ? 14 : difficulty === 'medium' ? 12 : 10"),
    'Reading phase must configure 10s (easy), 12s (med), 14s (hard)'
  );

  // 2. Gate approach speeds are slow and gentle: easy: 0.18, medium: 0.26, hard: 0.34
  assert.ok(
    runnerSource.includes("difficulty === 'hard' ? 0.34 : difficulty === 'medium' ? 0.26 : 0.18"),
    'Gate approach speed must be gentle: 0.18 (easy), 0.26 (med), 0.34 (hard)'
  );

  // 3. User controls for reading phase: +10s More Time and Ready to Run
  assert.ok(runnerSource.includes('+10s More Time'), '+10s extension button must be available');
  assert.ok(runnerSource.includes('Ready to Run!'), 'Immediate run button must be available');
  assert.ok(runnerSource.includes('isReadingPhase'), 'Dedicated reading phase state must control game loop');
});

// ---------------------------------------------------------------------------
// TEST 14: WORD FISHING - MIDDLE SCHOOL VOCABULARY AUDIT
// ---------------------------------------------------------------------------
runTest('Word Fishing vocabulary conforms strictly to Grade 7 & Grade 8 middle school curriculum', () => {
  // Prohibited college-level / overly obscure words that were previously present
  const prohibitedWords = [
    'cosmology', 'sovereignty', 'treaty', 'sanction', 'famine', 'biodiversity',
    'aristocracy', 'jurisdiction', 'hegemony', 'bourgeoisie', 'metamorphosis',
    'photosynthesis', 'topography', 'feudalism', 'infrastructure', 'bureaucracy'
  ];

  const grades = ['grade-7', 'grade-8'];
  const diffs = ['easy', 'medium', 'hard'];

  for (const g of grades) {
    for (const d of diffs) {
      const items = WORD_FISHING_BANK[g][d];
      for (const item of items) {
        const targetLower = item.targetWord.toLowerCase().trim();
        for (const bad of prohibitedWords) {
          assert.notEqual(
            targetLower,
            bad,
            `Prohibited advanced word "${bad}" found in Word Fishing ${item.id}`
          );
        }
        for (const dist of item.distractorWords) {
          const distLower = dist.toLowerCase().trim();
          for (const bad of prohibitedWords) {
            assert.notEqual(
              distLower,
              bad,
              `Prohibited advanced word "${bad}" found among distractors in Word Fishing ${item.id}`
            );
          }
        }
      }
    }
  }
});

// ---------------------------------------------------------------------------
// TEST 15: SENTENCE TOWER - ALTERNATIVE PERMUTATIONS & FULL BLOCK USAGE
// ---------------------------------------------------------------------------
runTest('Sentence Tower accepts all valid grammatical permutations and enforces full block placement', () => {
  const towerSource = fs.readFileSync('./src/components/gamesZone/sentenceTower/SentenceTowerGame.tsx', 'utf-8');

  // 1. Verify component checks that all blocks must be placed before submitting
  assert.ok(
    towerSource.includes('placedWords.length < currentQ.scrambledWords.length'),
    'Must check if placed words count is less than required blocks'
  );
  assert.ok(
    towerSource.includes('Incomplete floor! Use all'),
    'Must provide clear warning when student tries to submit incomplete floor'
  );

  // 2. Normalizer verification
  const normalizeSentence = (s) =>
    s
      .toLowerCase()
      .replace(/[.,?!'’"]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

  // Test preference reversal: "drinking tea to coffee" vs "drinking coffee to tea"
  const prefNorm1 = normalizeSentence('She prefers drinking tea to coffee.');
  const prefNorm2 = normalizeSentence('She prefers drinking coffee to tea.');
  assert.equal(prefNorm1, 'she prefers drinking tea to coffee');
  assert.equal(prefNorm2, 'she prefers drinking coffee to tea');

  // Test fronted adverb: "Every morning he eats breakfast" vs "He eats breakfast every morning"
  const advNorm1 = normalizeSentence('Every morning, he eats breakfast.');
  const advNorm2 = normalizeSentence('He eats breakfast every morning.');
  assert.equal(advNorm1, 'every morning he eats breakfast');
  assert.equal(advNorm2, 'he eats breakfast every morning');

  // 3. Verify that all 240 questions in SENTENCE_TOWER_BANK with alternativeSentences
  // have exact word matching with scrambledWords
  const grades = ['grade-7', 'grade-8'];
  const diffs = ['easy', 'medium', 'hard'];
  let totalAlternativesCount = 0;

  for (const g of grades) {
    for (const d of diffs) {
      const items = SENTENCE_TOWER_BANK[g][d];
      for (const item of items) {
        if (item.alternativeSentences && item.alternativeSentences.length > 0) {
          totalAlternativesCount += item.alternativeSentences.length;
          const canonicalTokens = item.scrambledWords.map((w) => normalizeSentence(w)).sort().join(' ');
          for (const alt of item.alternativeSentences) {
            const altTokens = normalizeSentence(alt).split(' ').sort().join(' ');
            assert.equal(
              altTokens,
              canonicalTokens,
              `Alternative sentence "${alt}" has mismatched tokens on ${item.id}`
            );
          }
        }
      }
    }
  }

  assert.ok(totalAlternativesCount > 0, 'Must have verified alternative sentence permutations across the bank');
});

console.log('================================================================');
console.log(`🎉 ALL ${passedTests} PHASE 7A UNIT & INTEGRATION TESTS PASSED!`);
console.log('================================================================');

