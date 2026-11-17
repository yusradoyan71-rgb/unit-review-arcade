const { createJiti } = require('jiti');
const jiti = createJiti(__filename);
const { GRAMMAR_BASKETBALL_BANK } = jiti('../src/data/gamesZone/grammarBasketballData.ts');

// Balanced non-repeating sequences of length 40 with exactly 10 of each (0, 1, 2, 3)
const patterns = [
  // Pattern 1 (G7 Easy)
  [1, 3, 0, 2, 1, 0, 3, 2, 0, 1, 3, 2, 3, 0, 2, 1, 2, 3, 0, 1, 0, 2, 1, 3, 1, 0, 2, 3, 2, 1, 3, 0, 3, 2, 0, 1, 0, 3, 1, 2],
  // Pattern 2 (G7 Med)
  [2, 0, 3, 1, 0, 2, 1, 3, 2, 3, 0, 1, 3, 1, 2, 0, 1, 0, 3, 2, 3, 2, 0, 1, 0, 1, 2, 3, 1, 3, 0, 2, 2, 0, 1, 3, 0, 2, 3, 1],
  // Pattern 3 (G7 Hard)
  [3, 1, 2, 0, 2, 3, 1, 0, 1, 2, 0, 3, 0, 3, 1, 2, 2, 0, 3, 1, 3, 1, 0, 2, 1, 0, 2, 3, 0, 2, 3, 1, 3, 2, 1, 0, 2, 1, 0, 3],
  // Pattern 4 (G8 Easy)
  [0, 2, 1, 3, 2, 0, 3, 1, 3, 1, 0, 2, 1, 3, 2, 0, 0, 1, 3, 2, 1, 2, 0, 3, 2, 3, 1, 0, 3, 0, 2, 1, 0, 3, 1, 2, 2, 1, 0, 3],
  // Pattern 5 (G8 Med)
  [1, 0, 2, 3, 3, 1, 0, 2, 0, 2, 3, 1, 2, 3, 1, 0, 1, 3, 2, 0, 3, 0, 1, 2, 0, 1, 2, 3, 2, 0, 3, 1, 1, 2, 0, 3, 3, 2, 1, 0],
  // Pattern 6 (G8 Hard)
  [2, 3, 0, 1, 1, 2, 3, 0, 3, 0, 1, 2, 0, 1, 2, 3, 2, 1, 0, 3, 0, 3, 2, 1, 3, 2, 1, 0, 1, 0, 3, 2, 2, 0, 1, 3, 0, 1, 3, 2],
];

console.log('Testing patterns for Grammar Basketball:');
patterns.forEach((pat, idx) => {
  const counts = { 0: 0, 1: 0, 2: 0, 3: 0 };
  let maxRun = 1;
  let curRun = 1;
  for (let i = 0; i < pat.length; i++) {
    counts[pat[i]]++;
    if (i > 0) {
      if (pat[i] === pat[i - 1]) {
        curRun++;
        if (curRun > maxRun) maxRun = curRun;
      } else {
        curRun = 1;
      }
    }
  }
  console.log(`Pattern ${idx + 1}: len=${pat.length}, counts=${JSON.stringify(counts)}, maxRun=${maxRun}`);
});
