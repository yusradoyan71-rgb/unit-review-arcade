const { createJiti } = require('jiti');
const jiti = createJiti(__filename);
const { DEFAULT_INITIAL_DATA } = jiti('../src/services/storageService.ts');

console.log('=== TRUE/FALSE DISTRIBUTION AUDIT ===\n');

for (const gradeId of ['grade-7', 'grade-8']) {
  const units = DEFAULT_INITIAL_DATA.units[gradeId] || [];
  for (const unit of units) {
    for (const act of unit.activities) {
      if (act.gameType === 'true_false') {
        const statements = act.statements || act.questions || [];
        let trueCount = 0;
        let falseCount = 0;
        let maxRun = 0;
        let currentRun = 0;
        let lastVal = null;

        for (const s of statements) {
          const val = s.isTrue;
          if (val === true) trueCount++;
          else if (val === false) falseCount++;

          if (val === lastVal) {
            currentRun++;
            if (currentRun > maxRun) maxRun = currentRun;
          } else {
            currentRun = 1;
            lastVal = val;
          }
        }

        console.log(`Unit: [${gradeId}] ${unit.id} | Act: ${act.id} (${act.title})`);
        console.log(`  Total: ${statements.length} | True: ${trueCount} (${Math.round(trueCount/statements.length*100)}%) | False: ${falseCount} (${Math.round(falseCount/statements.length*100)}%) | Max Consecutive Run: ${maxRun}`);
      }
    }
  }
}
