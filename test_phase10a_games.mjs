import assert from 'assert';
import { GRAMMAR_BASKETBALL_BANK } from './src/data/gamesZone/grammarBasketballData.ts';
import { VOCABULARY_INVADERS_BANK } from './src/data/gamesZone/vocabularyInvadersData.ts';
import { GAMES_ZONE_CATALOG, getQuestionsForGame } from './src/data/gamesZone/index.ts';

console.log('=== PHASE 10A AUTOMATED QA AUDIT ===\n');

let totalChecks = 0;
const allIds = new Set();

// 1. Audit GRAMMAR_BASKETBALL_BANK
console.log('--- Auditing Grammar Basketball Bank ---');
const grades = ['grade-7', 'grade-8'];
const difficulties = ['easy', 'medium', 'hard'];

for (const grade of grades) {
  for (const diff of difficulties) {
    const list = GRAMMAR_BASKETBALL_BANK[grade]?.[diff];
    assert(Array.isArray(list), `Missing list for ${grade} ${diff}`);
    assert.strictEqual(list.length, 40, `Expected 40 questions for ${grade} ${diff}, got ${list.length}`);
    totalChecks++;

    for (let i = 0; i < list.length; i++) {
      const q = list[i];
      assert(q.id, `Missing ID in ${grade} ${diff} at index ${i}`);
      assert(!allIds.has(q.id), `Duplicate question ID: ${q.id}`);
      allIds.add(q.id);

      assert(q.prompt && q.prompt.trim().length > 5, `Prompt too short or missing in ${q.id}`);
      assert(Array.isArray(q.options), `Options not an array in ${q.id}`);
      assert(q.options.length >= 3, `Expected at least 3 options in ${q.id}, got ${q.options.length}`);
      assert(q.correctOptionIndex >= 0 && q.correctOptionIndex < q.options.length, `Invalid correctOptionIndex in ${q.id}`);
      assert(q.grammarTopic && q.grammarTopic.length > 0, `Missing grammarTopic in ${q.id}`);
      assert(q.explanation && q.explanation.length > 0, `Missing explanation in ${q.id}`);

      // Verify no duplicate options within the same question
      const uniqueOptions = new Set(q.options.map((o) => o.trim().toLowerCase()));
      assert.strictEqual(uniqueOptions.size, q.options.length, `Duplicate options detected in ${q.id}: ${JSON.stringify(q.options)}`);

      // Verify ID prefix matches grade and diff
      const expectedPrefix = `bb_${grade === 'grade-7' ? 'g7' : 'g8'}_${diff[0]}_`;
      assert(q.id.startsWith(expectedPrefix), `Question ID ${q.id} does not match expected prefix ${expectedPrefix}`);

      totalChecks += 8;
    }
  }
}
console.log(`Grammar Basketball Bank: 240 questions verified across all grades & difficulties.`);

// 2. Audit VOCABULARY_INVADERS_BANK
console.log('\n--- Auditing Vocabulary Invaders Bank ---');
for (const grade of grades) {
  for (const diff of difficulties) {
    const list = VOCABULARY_INVADERS_BANK[grade]?.[diff];
    assert(Array.isArray(list), `Missing list for ${grade} ${diff}`);
    assert.strictEqual(list.length, 40, `Expected 40 questions for ${grade} ${diff}, got ${list.length}`);
    totalChecks++;

    for (let i = 0; i < list.length; i++) {
      const q = list[i];
      assert(q.id, `Missing ID in ${grade} ${diff} at index ${i}`);
      assert(!allIds.has(q.id), `Duplicate question ID: ${q.id}`);
      allIds.add(q.id);

      assert(q.prompt && q.prompt.trim().length > 5, `Prompt too short or missing in ${q.id}`);
      assert(q.targetWord && q.targetWord.trim().length > 0, `Target word missing in ${q.id}`);
      assert(Array.isArray(q.distractorWords), `Distractor words not an array in ${q.id}`);
      assert(q.distractorWords.length >= 2, `Expected at least 2 distractors in ${q.id}`);
      assert(!q.distractorWords.includes(q.targetWord), `Target word found in distractors in ${q.id}`);
      assert(q.wordCategory && q.wordCategory.length > 0, `Missing wordCategory in ${q.id}`);
      assert(q.explanation && q.explanation.length > 0, `Missing explanation in ${q.id}`);

      // Verify no duplicate distractors
      const uniqueDistractors = new Set(q.distractorWords.map((d) => d.trim().toLowerCase()));
      assert.strictEqual(uniqueDistractors.size, q.distractorWords.length, `Duplicate distractors in ${q.id}`);

      // Verify ID prefix matches grade and diff
      const expectedPrefix = `vi_${grade === 'grade-7' ? 'g7' : 'g8'}_${diff[0]}_`;
      assert(q.id.startsWith(expectedPrefix), `Question ID ${q.id} does not match expected prefix ${expectedPrefix}`);

      totalChecks += 8;
    }
  }
}
console.log(`Vocabulary Invaders Bank: 240 questions verified across all grades & difficulties.`);

// 3. Catalog Metadata Audit
console.log('\n--- Auditing Games Zone Catalog ---');
const gbMeta = GAMES_ZONE_CATALOG.find((g) => g.id === 'grammar_basketball');
assert(gbMeta, 'grammar_basketball metadata missing from GAMES_ZONE_CATALOG');
assert.strictEqual(gbMeta.title, 'Grammar Basketball');
assert(gbMeta.howToPlay && gbMeta.howToPlay.rules.length > 0);
totalChecks += 3;

const viMeta = GAMES_ZONE_CATALOG.find((g) => g.id === 'vocabulary_invaders');
assert(viMeta, 'vocabulary_invaders metadata missing from GAMES_ZONE_CATALOG');
assert.strictEqual(viMeta.title, 'Vocabulary Invaders');
assert(viMeta.howToPlay && viMeta.howToPlay.rules.length > 0);
totalChecks += 3;

// 4. Dispatcher / Session Slicing Test
console.log('\n--- Testing Question Dispatcher (getQuestionsForGame) ---');
for (const grade of grades) {
  for (const diff of difficulties) {
    const bbSlice = getQuestionsForGame('grammar_basketball', grade, diff, 10);
    assert.strictEqual(bbSlice.length, 10, `Expected 10 items from getQuestionsForGame for grammar_basketball ${grade} ${diff}`);

    const viSlice = getQuestionsForGame('vocabulary_invaders', grade, diff, 10);
    assert.strictEqual(viSlice.length, 10, `Expected 10 items from getQuestionsForGame for vocabulary_invaders ${grade} ${diff}`);
    totalChecks += 2;
  }
}

console.log(`\nALL AUDIT CHECKS PASSED: ${totalChecks} assertions validated.`);
console.log(`Total New Questions: 480 (240 Grammar Basketball + 240 Vocabulary Invaders).`);
console.log(`Total Unique Question IDs: ${allIds.size}.`);

