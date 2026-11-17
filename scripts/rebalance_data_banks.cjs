const fs = require('fs');
const path = require('path');
const { createJiti } = require('jiti');
const jiti = createJiti(__filename);

// 1. Rebalance Grammar Basketball
const { GRAMMAR_BASKETBALL_BANK } = jiti('../src/data/gamesZone/grammarBasketballData.ts');

const basketballPatterns = {
  'grade-7': {
    easy:   [1, 3, 0, 2, 1, 0, 3, 2, 0, 1, 3, 2, 3, 0, 2, 1, 2, 3, 0, 1, 0, 2, 1, 3, 1, 0, 2, 3, 2, 1, 3, 0, 3, 2, 0, 1, 0, 3, 1, 2],
    medium: [2, 0, 3, 1, 0, 2, 1, 3, 2, 3, 0, 1, 3, 1, 2, 0, 1, 0, 3, 2, 3, 2, 0, 1, 0, 1, 2, 3, 1, 3, 0, 2, 2, 0, 1, 3, 0, 2, 3, 1],
    hard:   [3, 1, 2, 0, 2, 3, 1, 0, 1, 2, 0, 3, 0, 3, 1, 2, 2, 0, 3, 1, 3, 1, 0, 2, 1, 0, 2, 3, 0, 2, 3, 1, 3, 2, 1, 0, 2, 1, 0, 3],
  },
  'grade-8': {
    easy:   [0, 2, 1, 3, 2, 0, 3, 1, 3, 1, 0, 2, 1, 3, 2, 0, 0, 1, 3, 2, 1, 2, 0, 3, 2, 3, 1, 0, 3, 0, 2, 1, 0, 3, 1, 2, 2, 1, 0, 3],
    medium: [1, 0, 2, 3, 3, 1, 0, 2, 0, 2, 3, 1, 2, 3, 1, 0, 1, 3, 2, 0, 3, 0, 1, 2, 0, 1, 2, 3, 2, 0, 3, 1, 1, 2, 0, 3, 3, 2, 1, 0],
    hard:   [2, 3, 0, 1, 1, 2, 3, 0, 3, 0, 1, 2, 0, 1, 2, 3, 2, 1, 0, 3, 0, 3, 2, 1, 3, 2, 1, 0, 1, 0, 3, 2, 2, 0, 1, 3, 0, 1, 3, 2],
  },
};

console.log('Rebalancing Grammar Basketball Data Bank...');

for (const grade of ['grade-7', 'grade-8']) {
  for (const diff of ['easy', 'medium', 'hard']) {
    const list = GRAMMAR_BASKETBALL_BANK[grade][diff];
    const pat = basketballPatterns[grade][diff];
    if (list.length !== 40 || pat.length !== 40) {
      throw new Error(`Unexpected question count in ${grade} ${diff}: ${list.length}`);
    }

    for (let i = 0; i < 40; i++) {
      const q = list[i];
      const targetIdx = pat[i];
      const origCorrectText = q.options[q.correctOptionIndex];
      const distractors = q.options.filter((_, idx) => idx !== q.correctOptionIndex);

      const newOptions = [];
      let distIdx = 0;
      for (let pos = 0; pos < 4; pos++) {
        if (pos === targetIdx) {
          newOptions.push(origCorrectText);
        } else {
          newOptions.push(distractors[distIdx++]);
        }
      }

      q.options = newOptions;
      q.correctOptionIndex = targetIdx;

      // Verification assertions
      if (q.options[q.correctOptionIndex] !== origCorrectText) {
        throw new Error(`Correct answer mismatch in ${q.id}! Expected "${origCorrectText}", got "${q.options[q.correctOptionIndex]}"`);
      }
      if (new Set(q.options).size !== 4) {
        throw new Error(`Duplicate options generated in ${q.id}: ${JSON.stringify(q.options)}`);
      }
    }

    // Verify tier distribution
    const counts = { 0: 0, 1: 0, 2: 0, 3: 0 };
    list.forEach(q => counts[q.correctOptionIndex]++);
    console.log(`  ${grade} ${diff}: A=${counts[0]} B=${counts[1]} C=${counts[2]} D=${counts[3]}`);
  }
}

// 2. Rebalance Grammar Runner
const { GRAMMAR_RUNNER_BANK } = jiti('../src/data/gamesZone/grammarRunnerData.ts');

console.log('\nRebalancing Grammar Runner Data Bank...');

function swapRunnerLanes(q, fromLane, toLane) {
  if (q.correctLaneIndex !== fromLane) {
    throw new Error(`Question ${q.id} correctLaneIndex is ${q.correctLaneIndex}, expected ${fromLane}`);
  }
  const origText = q.laneOptions[fromLane];
  const newOptions = [...q.laneOptions];
  const temp = newOptions[fromLane];
  newOptions[fromLane] = newOptions[toLane];
  newOptions[toLane] = temp;
  q.laneOptions = newOptions;
  q.correctLaneIndex = toLane;

  if (q.laneOptions[q.correctLaneIndex] !== origText) {
    throw new Error(`Runner lane swap error in ${q.id}!`);
  }
}

// Grade 7 Hard: Move question 30 (gr_g7_h_31) from lane 0 to lane 2
// Currently: Lane 0=15, Lane 1=13, Lane 2=12 -> becomes 14, 13, 13!
const g7hList = GRAMMAR_RUNNER_BANK['grade-7'].hard;
for (let i = 0; i < g7hList.length; i++) {
  if (g7hList[i].correctLaneIndex === 0) {
    swapRunnerLanes(g7hList[i], 0, 2);
    console.log(`  Swapped ${g7hList[i].id} in grade-7 hard: Lane 0 -> Lane 2`);
    break;
  }
}

// Grade 8 Hard: Currently Lane 0=16, Lane 1=14, Lane 2=10
// We need to move:
// - Two from lane 0 to lane 2 (16 -> 14, 10 -> 12)
// - One from lane 1 to lane 2 (14 -> 13, 12 -> 13)
// Result: 14, 13, 13!
const g8hList = GRAMMAR_RUNNER_BANK['grade-8'].hard;
let movedFrom0 = 0;
let movedFrom1 = 0;
for (let i = 0; i < g8hList.length; i++) {
  if (g8hList[i].correctLaneIndex === 0 && movedFrom0 < 2) {
    swapRunnerLanes(g8hList[i], 0, 2);
    movedFrom0++;
    console.log(`  Swapped ${g8hList[i].id} in grade-8 hard: Lane 0 -> Lane 2`);
  } else if (g8hList[i].correctLaneIndex === 1 && movedFrom1 < 1) {
    swapRunnerLanes(g8hList[i], 1, 2);
    movedFrom1++;
    console.log(`  Swapped ${g8hList[i].id} in grade-8 hard: Lane 1 -> Lane 2`);
  }
}

for (const grade of ['grade-7', 'grade-8']) {
  for (const diff of ['easy', 'medium', 'hard']) {
    const list = GRAMMAR_RUNNER_BANK[grade][diff];
    const counts = { 0: 0, 1: 0, 2: 0 };
    list.forEach(q => counts[q.correctLaneIndex]++);
    console.log(`  ${grade} ${diff}: Lane 0=${counts[0]} Lane 1=${counts[1]} Lane 2=${counts[2]}`);
  }
}

// 3. Save Files Back
function saveTsBank(filePath, varName, typeName, bankObj) {
  const content = `/**
 * UNIT REVIEW ARCADE — ${path.basename(filePath, '.ts').toUpperCase()} DATA BANK
 * Refined for Turkish EFL Middle-School Pedagogy & School Safety Standards.
 */

import type { ${typeName} } from '../../types/gamesZone';

export const ${varName}: ${typeName} = ${JSON.stringify(bankObj, null, 2)};
`;
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`\nSuccessfully wrote ${filePath}`);
}

saveTsBank(
  path.join(__dirname, '../src/data/gamesZone/grammarBasketballData.ts'),
  'GRAMMAR_BASKETBALL_BANK',
  'GrammarBasketballBank',
  GRAMMAR_BASKETBALL_BANK
);

saveTsBank(
  path.join(__dirname, '../src/data/gamesZone/grammarRunnerData.ts'),
  'GRAMMAR_RUNNER_BANK',
  'GrammarRunnerBank',
  GRAMMAR_RUNNER_BANK
);

