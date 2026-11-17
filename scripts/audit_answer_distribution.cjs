const { createJiti } = require('jiti');
const jiti = createJiti(__filename);

// Import Unit Review data
const { DEFAULT_INITIAL_DATA } = jiti('../src/services/storageService.ts');

// Import Games Zone data
const { GRAMMAR_BASKETBALL_BANK } = jiti('../src/data/gamesZone/grammarBasketballData.ts');
const { GRAMMAR_RUNNER_BANK } = jiti('../src/data/gamesZone/grammarRunnerData.ts');
const { VOCABULARY_INVADERS_BANK } = jiti('../src/data/gamesZone/vocabularyInvadersData.ts');
const { WORD_NINJA_BANK } = jiti('../src/data/gamesZone/wordNinjaData.ts');
const { WORD_FISHING_BANK } = jiti('../src/data/gamesZone/wordFishingData.ts');

console.log('=== GLOBAL ANSWER DISTRIBUTION AUDIT ===\n');

// 1. Audit Unit Review Activities
console.log('--- 1. AUDITING UNIT REVIEW ACTIVITIES ---');
const grades = ['grade-7', 'grade-8'];

for (const gradeId of grades) {
  const units = DEFAULT_INITIAL_DATA.units[gradeId] || [];
  for (const unit of units) {
    console.log(`\nUnit: [${gradeId}] ${unit.id} - ${unit.title} (${unit.activities.length} activities)`);
    for (const act of unit.activities) {
      const qList = act.questions || act.dialogues || act.statements || act.sentences || act.rounds || [];
      const counts = {};
      let total = 0;
      let optionLen = null;

      for (const q of qList) {
        if (q.options && Array.isArray(q.options)) {
          total++;
          optionLen = q.options.length;
          const idx = q.correctOptionIndex;
          counts[idx] = (counts[idx] || 0) + 1;
        } else if (typeof q.isCorrect === 'boolean') {
          total++;
          optionLen = 2; // True/False
          const idx = q.isCorrect ? 'True' : 'False';
          counts[idx] = (counts[idx] || 0) + 1;
        } else if (typeof q.correctAnswer === 'string' && q.options) {
          total++;
          optionLen = q.options.length;
          const idx = q.options.indexOf(q.correctAnswer);
          counts[idx] = (counts[idx] || 0) + 1;
        }
      }

      if (total > 0) {
        console.log(`  Act: ${act.id.padEnd(16)} | type: ${act.gameType.padEnd(18)} | items: ${total} (${optionLen} opts) | dist: ${JSON.stringify(counts)}`);
      } else {
        console.log(`  Act: ${act.id.padEnd(16)} | type: ${act.gameType.padEnd(18)} | Non-MCQ items: ${qList.length}`);
      }
    }
  }
}

// 2. Audit Games Zone Multiple Choice Games
console.log('\n--- 2. AUDITING GAMES ZONE MULTIPLE CHOICE GAMES ---');

// A. Grammar Basketball
console.log('\n[Games Zone] Grammar Basketball:');
for (const grade of ['grade-7', 'grade-8']) {
  for (const diff of ['easy', 'medium', 'hard']) {
    const questions = GRAMMAR_BASKETBALL_BANK[grade][diff];
    const counts = { 0: 0, 1: 0, 2: 0, 3: 0 };
    for (const q of questions) {
      counts[q.correctOptionIndex] = (counts[q.correctOptionIndex] || 0) + 1;
    }
    console.log(`  ${grade} ${diff.padEnd(6)} | Total: ${questions.length} | Dist: A=${counts[0]} B=${counts[1]} C=${counts[2]} D=${counts[3]}`);
  }
}

// B. Grammar Runner
console.log('\n[Games Zone] Grammar Runner:');
for (const grade of ['grade-7', 'grade-8']) {
  for (const diff of ['easy', 'medium', 'hard']) {
    const questions = GRAMMAR_RUNNER_BANK[grade][diff];
    const counts = { 0: 0, 1: 0, 2: 0 };
    for (const q of questions) {
      counts[q.correctLaneIndex] = (counts[q.correctLaneIndex] || 0) + 1;
    }
    console.log(`  ${grade} ${diff.padEnd(6)} | Total: ${questions.length} | Dist: Lane 0=${counts[0]} Lane 1=${counts[1]} Lane 2=${counts[2]}`);
  }
}

// C. Word Ninja
console.log('\n[Games Zone] Word Ninja (spawning order):');
for (const grade of ['grade-7', 'grade-8']) {
  for (const diff of ['easy', 'medium', 'hard']) {
    const questions = WORD_NINJA_BANK[grade][diff];
    console.log(`  ${grade} ${diff.padEnd(6)} | Total: ${questions.length} | Structure: correctWord + distractorWords (${questions[0].distractorWords.length})`);
  }
}

// D. Vocabulary Invaders
console.log('\n[Games Zone] Vocabulary Invaders (targetWord vs distractorWords):');
for (const grade of ['grade-7', 'grade-8']) {
  for (const diff of ['easy', 'medium', 'hard']) {
    const questions = VOCABULARY_INVADERS_BANK[grade][diff];
    console.log(`  ${grade} ${diff.padEnd(6)} | Total: ${questions.length} | Structure: targetWord + distractorWords (${questions[0].distractorWords.length})`);
  }
}

// E. Word Fishing
console.log('\n[Games Zone] Word Fishing (targetWord vs distractorWords):');
for (const grade of ['grade-7', 'grade-8']) {
  for (const diff of ['easy', 'medium', 'hard']) {
    const questions = WORD_FISHING_BANK[grade][diff];
    console.log(`  ${grade} ${diff.padEnd(6)} | Total: ${questions.length} | Structure: targetWord + distractorWords (${questions[0].distractorWords.length})`);
  }
}
