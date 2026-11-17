const { createJiti } = require('jiti');
const jiti = createJiti(__filename);
const { DEFAULT_INITIAL_DATA } = jiti('../src/services/storageService.ts');

console.log('=== DETAILED UNIT REVIEW MCQ AUDIT ===\n');

let totalMCQs = 0;
let totalMappingErrors = 0;
let totalDuplicateOptions = 0;
const overallDistribution = { 0: 0, 1: 0, 2: 0, 3: 0 };

for (const gradeId of ['grade-7', 'grade-8']) {
  const units = DEFAULT_INITIAL_DATA.units[gradeId] || [];
  for (const unit of units) {
    for (const act of unit.activities) {
      const questions = (act.questions || act.dialogues || act.rounds || []).filter(
        q => q.options && Array.isArray(q.options) && q.options.length === 4
      );

      if (questions.length === 0) continue;

      const counts = { 0: 0, 1: 0, 2: 0, 3: 0 };
      let maxRun = 1;
      let currentRun = 1;
      for (let i = 1; i < questions.length; i++) {
        if (questions[i].correctOptionIndex === questions[i - 1].correctOptionIndex) {
          currentRun++;
          if (currentRun > maxRun) maxRun = currentRun;
        } else {
          currentRun = 1;
        }
      }

      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        totalMCQs++;
        const idx = q.correctOptionIndex;

        // Verify valid index
        if (typeof idx !== 'number' || idx < 0 || idx >= 4) {
          console.error(`ERROR: Invalid correctOptionIndex ${idx} in ${act.id} Q${i} (${q.id})`);
          totalMappingErrors++;
          actMappingErrors++;
        }

        // Verify no duplicate options
        const uniqueOpts = new Set(q.options.map(o => o.trim().toLowerCase()));
        if (uniqueOpts.size !== q.options.length) {
          console.error(`ERROR: Duplicate options in ${act.id} Q${i} (${q.id}): ${JSON.stringify(q.options)}`);
          totalDuplicateOptions++;
          actDuplicates++;
        }

        // Verify correct answer is non-empty
        const correctText = q.options[idx];
        if (!correctText || !correctText.trim()) {
          console.error(`ERROR: Empty correct option in ${act.id} Q${i} (${q.id})`);
          totalMappingErrors++;
          actMappingErrors++;
        }

        counts[idx] = (counts[idx] || 0) + 1;
        overallDistribution[idx]++;
      }

      const percentages = Object.entries(counts).map(
        ([k, v]) => `${['A','B','C','D'][k]}: ${v} (${Math.round(v/questions.length*100)}%)`
      ).join(' | ');

      const isBiased = Object.values(counts).some(v => v / questions.length > 0.35 || v / questions.length < 0.15);
      const flag = isBiased || maxRun >= 5 ? '⚠️ WARNING' : '✓ OK';

      console.log(`[${gradeId}] ${unit.id} | ${act.id.padEnd(14)} (${act.title.slice(0, 24).padEnd(24)}) | N=${String(questions.length).padEnd(2)} | ${percentages} | MaxRun: ${maxRun} | ${flag}`);
    }
  }
}

console.log('\n========================================');
console.log(`Total MCQ Questions Audited: ${totalMCQs}`);
console.log(`Total Option Mapping Errors: ${totalMappingErrors}`);
console.log(`Total Duplicate Option Questions: ${totalDuplicateOptions}`);
console.log(`Overall Distribution across all units:`);
console.log(`  A (0): ${overallDistribution[0]} (${Math.round(overallDistribution[0]/totalMCQs*100)}%)`);
console.log(`  B (1): ${overallDistribution[1]} (${Math.round(overallDistribution[1]/totalMCQs*100)}%)`);
console.log(`  C (2): ${overallDistribution[2]} (${Math.round(overallDistribution[2]/totalMCQs*100)}%)`);
console.log(`  D (3): ${overallDistribution[3]} (${Math.round(overallDistribution[3]/totalMCQs*100)}%)`);
