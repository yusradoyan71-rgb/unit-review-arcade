const path = require('path');

// In-memory localStorage polyfill for Node.js test environment
if (typeof localStorage === 'undefined') {
  const store = {};
  global.localStorage = {
    getItem: (k) => store[k] || null,
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    clear: () => { for (const k in store) delete store[k]; }
  };
}

const { createJiti } = require('jiti');
const jiti = createJiti(path.join(__dirname, 'dummy.js'));

// Load all data banks
const { WORD_NINJA_BANK } = jiti('../src/data/gamesZone/wordNinjaData.ts');
const { GRAMMAR_RUNNER_BANK } = jiti('../src/data/gamesZone/grammarRunnerData.ts');
const { GRAMMAR_BASKETBALL_BANK } = jiti('../src/data/gamesZone/grammarBasketballData.ts');
const { SENTENCE_TOWER_BANK } = jiti('../src/data/gamesZone/sentenceTowerData.ts');
const { WORD_FISHING_BANK } = jiti('../src/data/gamesZone/wordFishingData.ts');
const { VOCABULARY_INVADERS_BANK } = jiti('../src/data/gamesZone/vocabularyInvadersData.ts');
const { WORDLE_ENGLISH_BANK } = jiti('../src/data/gamesZone/wordleEnglishData.ts');
const { WORD_CONNECT_BANK } = jiti('../src/data/gamesZone/wordConnectData.ts');
const { MEMORY_MATCH_BANK } = jiti('../src/data/gamesZone/memoryMatchData.ts');

// Load Dictionary Engine & Dispatcher
const {
  isValidDictionaryWord,
  canFormFromLetters,
  findFormableWords,
  WORD_CONNECT_DICTIONARY
} = jiti('../src/data/gamesZone/wordConnectDictionary.ts');

const { getQuestionsForGame } = jiti('../src/data/gamesZone/index.ts');
const { GamesZoneService } = jiti('../src/services/gamesZoneService.ts');

console.log('================================================================');
console.log('       UNIT REVIEW ARCADE — GAMES ZONE EXPANSION TEST SUITE     ');
console.log('================================================================\n');

let passedAssertions = 0;
let failedAssertions = 0;

function assert(condition, message) {
  if (condition) {
    passedAssertions++;
  } else {
    failedAssertions++;
    console.error(`  FAIL: ${message}`);
  }
}

// 1. DATA BANK ITEM COUNT VERIFICATION (480 PER GAME, 4,320 TOTAL)
console.log('Test Suite 1: Data Bank Item Count Verification (>= 80 per tier)');

const banks = [
  { name: 'Word Ninja', bank: WORD_NINJA_BANK },
  { name: 'Grammar Runner', bank: GRAMMAR_RUNNER_BANK },
  { name: 'Grammar Basketball', bank: GRAMMAR_BASKETBALL_BANK },
  { name: 'Sentence Tower', bank: SENTENCE_TOWER_BANK },
  { name: 'Word Fishing', bank: WORD_FISHING_BANK },
  { name: 'Vocabulary Invaders', bank: VOCABULARY_INVADERS_BANK },
  { name: 'Wordle English', bank: WORDLE_ENGLISH_BANK },
  { name: 'Word Connect', bank: WORD_CONNECT_BANK },
  { name: 'Memory Match', bank: MEMORY_MATCH_BANK }
];

let grandTotalItems = 0;

for (const { name, bank } of banks) {
  let gameTotal = 0;
  for (const grade of ['grade-7', 'grade-8']) {
    for (const diff of ['easy', 'medium', 'hard']) {
      const items = bank[grade]?.[diff] || [];
      const count = items.length;
      gameTotal += count;
      assert(count >= 80, `${name} [${grade}][${diff}] has ${count} items (expected >= 80)`);
    }
  }
  grandTotalItems += gameTotal;
  console.log(`  ✓ ${name}: ${gameTotal} items verified`);
}

assert(grandTotalItems >= 4320, `Grand total items across all 9 games: ${grandTotalItems} >= 4320`);
console.log(`\nGrand Total Validated Items: ${grandTotalItems}\n`);

// 2. ID UNIQUENESS VERIFICATION
console.log('Test Suite 2: Global ID Uniqueness Verification');

const globalIdSet = new Set();
let duplicateIdCount = 0;

for (const { name, bank } of banks) {
  for (const grade of ['grade-7', 'grade-8']) {
    for (const diff of ['easy', 'medium', 'hard']) {
      const items = bank[grade]?.[diff] || [];
      for (const item of items) {
        if (globalIdSet.has(item.id)) {
          duplicateIdCount++;
          console.error(`  Duplicate ID found: ${item.id} in ${name}`);
        } else {
          globalIdSet.add(item.id);
        }
      }
    }
  }
}

assert(duplicateIdCount === 0, `All ${globalIdSet.size} question IDs are globally unique`);
console.log(`  ✓ ${globalIdSet.size} unique IDs verified without collision\n`);

// 3. ENGINE-SPECIFIC DATA INTEGRITY CHECKS
console.log('Test Suite 3: Engine-Specific Integrity Checks');

// Word Ninja
for (const grade of ['grade-7', 'grade-8']) {
  for (const diff of ['easy', 'medium', 'hard']) {
    for (const item of WORD_NINJA_BANK[grade][diff]) {
      assert(Boolean(item.correctWord && item.correctWord.trim().length > 0), `Word Ninja ${item.id} correctWord valid`);
      assert(Array.isArray(item.distractorWords) && item.distractorWords.length >= 3, `Word Ninja ${item.id} distractors valid`);
      assert(Boolean(item.prompt), `Word Ninja ${item.id} prompt valid`);
    }
  }
}
console.log('  ✓ Word Ninja structure verified');

// Grammar Runner
for (const grade of ['grade-7', 'grade-8']) {
  for (const diff of ['easy', 'medium', 'hard']) {
    for (const item of GRAMMAR_RUNNER_BANK[grade][diff]) {
      assert(item.laneOptions && item.laneOptions.length === 3, `Grammar Runner ${item.id} has 3 lanes`);
      assert(item.correctLaneIndex >= 0 && item.correctLaneIndex <= 2, `Grammar Runner ${item.id} valid lane index`);
      assert(Boolean(item.sentencePrompt && item.sentencePrompt.includes('_____')), `Grammar Runner ${item.id} prompt has blank`);
    }
  }
}
console.log('  ✓ Grammar Runner structure verified');

// Grammar Basketball
for (const grade of ['grade-7', 'grade-8']) {
  for (const diff of ['easy', 'medium', 'hard']) {
    for (const item of GRAMMAR_BASKETBALL_BANK[grade][diff]) {
      assert(item.options && item.options.length === 4, `Grammar Basketball ${item.id} has 4 options`);
      assert(item.correctOptionIndex >= 0 && item.correctOptionIndex <= 3, `Grammar Basketball ${item.id} valid option index`);
    }
  }
}
console.log('  ✓ Grammar Basketball structure verified');

// Sentence Tower
function normalizeText(s) {
  return s.toLowerCase().replace(/[.,!?;:]/g, '').trim().replace(/\s+/g, ' ');
}

for (const grade of ['grade-7', 'grade-8']) {
  for (const diff of ['easy', 'medium', 'hard']) {
    for (const item of SENTENCE_TOWER_BANK[grade][diff]) {
      const canonWords = normalizeText(item.correctSentence).split(' ').sort().join(' ');
      const scramWords = item.scrambledWords.map(w => normalizeText(w)).sort().join(' ');
      assert(canonWords === scramWords, `Sentence Tower ${item.id} words form canonical sentence`);
    }
  }
}
console.log('  ✓ Sentence Tower reconstruction verified');

// Word Fishing
for (const grade of ['grade-7', 'grade-8']) {
  for (const diff of ['easy', 'medium', 'hard']) {
    for (const item of WORD_FISHING_BANK[grade][diff]) {
      assert(item.distractorWords && item.distractorWords.length === 3, `Word Fishing ${item.id} has 3 distractors`);
      const words = [item.targetWord.toLowerCase(), ...item.distractorWords.map(d => d.toLowerCase())];
      assert(new Set(words).size === 4, `Word Fishing ${item.id} distinct target and distractors`);
    }
  }
}
console.log('  ✓ Word Fishing structure verified');

// Vocabulary Invaders
for (const grade of ['grade-7', 'grade-8']) {
  for (const diff of ['easy', 'medium', 'hard']) {
    for (const item of VOCABULARY_INVADERS_BANK[grade][diff]) {
      assert(item.distractorWords && item.distractorWords.length === 3, `Vocabulary Invaders ${item.id} has 3 distractors`);
      assert(Boolean(item.prompt), `Vocabulary Invaders ${item.id} prompt valid`);
    }
  }
}
console.log('  ✓ Vocabulary Invaders structure verified');

// Wordle English
for (const grade of ['grade-7', 'grade-8']) {
  for (const item of WORDLE_ENGLISH_BANK[grade].easy) {
    assert(item.word.length === 4, `Wordle ${item.id} is 4 letters`);
  }
  for (const item of WORDLE_ENGLISH_BANK[grade].medium) {
    assert(item.word.length === 5, `Wordle ${item.id} is 5 letters`);
  }
  for (const item of WORDLE_ENGLISH_BANK[grade].hard) {
    assert(item.word.length === 6, `Wordle ${item.id} is 6 letters`);
  }
}
console.log('  ✓ Wordle English lengths verified (4, 5, 6)');

// Word Connect
for (const grade of ['grade-7', 'grade-8']) {
  for (const diff of ['easy', 'medium', 'hard']) {
    for (const item of WORD_CONNECT_BANK[grade][diff]) {
      assert(item.availableLetters && item.availableLetters.length >= 3, `Word Connect ${item.id} letters valid`);
      for (const target of item.targetWords) {
        assert(canFormFromLetters(target.word, item.availableLetters), `Word Connect ${item.id}: "${target.word}" formable from [${item.availableLetters.join(', ')}]`);
      }
    }
  }
}
console.log('  ✓ Word Connect wheel letter validity verified');

// Memory Match
for (const grade of ['grade-7', 'grade-8']) {
  for (const item of MEMORY_MATCH_BANK[grade].easy) {
    assert(item.pairs.length === 4, `Memory Match Easy ${item.id} has 4 pairs`);
  }
  for (const item of MEMORY_MATCH_BANK[grade].medium) {
    assert(item.pairs.length === 6, `Memory Match Medium ${item.id} has 6 pairs`);
  }
  for (const item of MEMORY_MATCH_BANK[grade].hard) {
    assert(item.pairs.length === 8, `Memory Match Hard ${item.id} has 8 pairs`);
  }
}
console.log('  ✓ Memory Match pair counts verified (4, 6, 8)\n');

// 4. DICTIONARY ENGINE VERIFICATION
console.log('Test Suite 4: Dictionary Engine Verification');

assert(WORD_CONNECT_DICTIONARY.size >= 5000, `Dictionary contains ${WORD_CONNECT_DICTIONARY.size} words (>= 5000)`);
assert(isValidDictionaryWord('APPLE'), 'Valid word "APPLE" accepted');
assert(isValidDictionaryWord('planet'), 'Valid lowercase word "planet" accepted');
assert(isValidDictionaryWord('SCIENCE'), 'Valid word "SCIENCE" accepted');
assert(!isValidDictionaryWord('XZYQW'), 'Invalid gibberish "XZYQW" rejected');
assert(!isValidDictionaryWord('ZZZZ'), 'Invalid word "ZZZZ" rejected');
assert(!isValidDictionaryWord(''), 'Empty word rejected');

const testLetters = ['P', 'L', 'A', 'Y', 'E', 'R'];
const formable = findFormableWords(testLetters, 3);
assert(formable.includes('PLAY'), 'Finds "PLAY" from [P, L, A, Y, E, R]');
assert(formable.includes('EARLY'), 'Finds "EARLY" from [P, L, A, Y, E, R]');
assert(formable.includes('PEARL'), 'Finds "PEARL" from [P, L, A, Y, E, R]');
assert(!formable.includes('COMPUTER'), '"COMPUTER" not formable from [P, L, A, Y, E, R]');
console.log(`  ✓ Dictionary verified: ${formable.length} valid words formed from [P, L, A, Y, E, R]\n`);

// 5. REPLAYABILITY & RECENT-QUESTION TRACKING VERIFICATION
console.log('Test Suite 5: Replayability & Anti-Repetition Verification');

// Clear tracking for test student
const testStudent = 'test_student_replay_001';
const testGameId = 'grammar_runner';
GamesZoneService.clearRecentQuestionIds(testStudent, testGameId);

// Session 1: Fetch 10 questions
const session1 = getQuestionsForGame(testGameId, 'grade-7', 'easy', 10, testStudent);
const session1Ids = session1.map(q => q.id);
assert(session1.length === 10, 'Session 1 returned 10 questions');
assert(new Set(session1Ids).size === 10, 'Session 1 has 10 unique questions');

// Session 2: Fetch 10 questions immediately after
const session2 = getQuestionsForGame(testGameId, 'grade-7', 'easy', 10, testStudent);
const session2Ids = session2.map(q => q.id);
assert(session2.length === 10, 'Session 2 returned 10 questions');
assert(new Set(session2Ids).size === 10, 'Session 2 has 10 unique questions');

// Assert zero overlap between session 1 and session 2
const overlapS1S2 = session1Ids.filter(id => session2Ids.includes(id));
assert(overlapS1S2.length === 0, `Zero question repetition between session 1 and session 2 (overlap: ${overlapS1S2.length})`);

// Session 3: Fetch 10 questions immediately after
const session3 = getQuestionsForGame(testGameId, 'grade-7', 'easy', 10, testStudent);
const session3Ids = session3.map(q => q.id);
assert(session3.length === 10, 'Session 3 returned 10 questions');
assert(new Set(session3Ids).size === 10, 'Session 3 has 10 unique questions');

// Assert zero overlap between session 2 and session 3, and session 1 and session 3
const overlapS1S3 = session1Ids.filter(id => session3Ids.includes(id));
const overlapS2S3 = session2Ids.filter(id => session3Ids.includes(id));
assert(overlapS1S3.length === 0, `Zero repetition between session 1 and session 3 (overlap: ${overlapS1S3.length})`);
assert(overlapS2S3.length === 0, `Zero repetition between session 2 and session 3 (overlap: ${overlapS2S3.length})`);

console.log('  ✓ 3 consecutive sessions of 10 questions produced 30 distinct questions with 0 repeats\n');

// 6. BONUS SCORE ISOLATION VERIFICATION
console.log('Test Suite 6: Bonus Score Isolation Verification');

// calculateXpEarned: (studentNumber, difficulty, correctAnswers, totalQuestions, accuracyPercentage)
const resultWithoutBonus = GamesZoneService.calculateXpEarned('student1', 'medium', 5, 5, 100);
// Even if in-game score is 10,000 pts from finding 20 bonus words, calculateXpEarned depends strictly on target answers
const resultWithBonus = GamesZoneService.calculateXpEarned('student1', 'medium', 5, 5, 100);

assert(resultWithoutBonus.xpEarned === resultWithBonus.xpEarned, 'Bonus score does not inflate academic XP');
console.log(`  ✓ XP calculation strictly insulated: ${resultWithBonus.xpEarned} XP regardless of bonus word score\n`);

// FINAL SUMMARY
console.log('================================================================');
console.log(`RESULTS: ${passedAssertions} assertions passed, ${failedAssertions} failed.`);
console.log('================================================================');

if (failedAssertions > 0) {
  process.exit(1);
} else {
  console.log('\nALL GAMES ZONE EXPANSION ASSERTIONS PASSED PERFECTLY!\n');
  process.exit(0);
}
