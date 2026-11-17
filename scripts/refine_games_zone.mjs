import fs from 'fs';
import path from 'path';

// 1. Refine Vocabulary Invaders
import { VOCABULARY_INVADERS_BANK } from '../src/data/gamesZone/vocabularyInvadersData.ts';

let viModified = 0;
for (const grade of ['grade-7', 'grade-8']) {
  for (const diff of ['easy', 'medium', 'hard']) {
    for (const item of VOCABULARY_INVADERS_BANK[grade][diff]) {
      let changed = false;

      // Simplify "Blast the word for: \"...\"" or "Target the word for: \"...\""
      const m = item.prompt.match(/^(Blast|Target)\s+the word for:\s*["“](.*)["”]$/i);
      if (m) {
        item.prompt = `${m[1]} "${m[2]}"`;
        changed = true;
      }

      // Flagged complex items
      if (item.id === 'vi_g7_e_19') {
        item.prompt = "Blast the curved path a planet takes around the Sun";
        item.explanation = "An orbit is the curved path of a planet moving around the Sun.";
        changed = true;
      } else if (item.id === 'vi_g7_e_37') {
        item.prompt = "Blast illegal hunters who catch protected wild animals";
        item.explanation = "Poachers are illegal hunters who harm and catch endangered wildlife.";
        changed = true;
      } else if (item.id === 'vi_g7_m_16') {
        item.prompt = "Target a small space rock that glows entering Earth's atmosphere";
        item.explanation = "A meteor is a space rock burning brightly in the atmosphere.";
        changed = true;
      } else if (item.id === 'vi_g7_m_26') {
        item.prompt = "Target an icy space object with a glowing gas tail";
        item.explanation = "A comet is an icy object that releases gas and dust as it nears the Sun.";
        changed = true;
      } else if (item.id === 'vi_g7_h_04') {
        item.prompt = "Target the scientific study of stars, planets, and space";
        item.explanation = "Astronomy is the science that studies stars, planets, and space.";
        changed = true;
      } else if (item.id === 'vi_g7_h_13') {
        item.prompt = "Target the layer of gases surrounding a planet";
        item.explanation = "An atmosphere is the layer of air and gases around a planet.";
        changed = true;
      } else if (item.id === 'vi_g7_h_22') {
        item.prompt = "Target the huge, bright explosion of a dying giant star";
        item.explanation = "A supernova is a bright explosion when a massive star dies.";
        changed = true;
      } else if (item.id === 'vi_g7_h_26') {
        item.prompt = "Target a group of stars forming a recognized pattern";
        item.explanation = "A constellation is a pattern of stars in the night sky.";
        changed = true;
      } else if (item.id === 'vi_g8_m_02') {
        item.prompt = "Blast something so unpleasant that you cannot stand it";
        item.explanation = "Unbearable means something is too bad or unpleasant to stand.";
        changed = true;
      } else if (item.id === 'vi_g8_h_12') {
        item.prompt = "Target someone who thinks only about themselves and ignores others";
        item.distractorWords = ["Generous", "Helpful", "Thoughtful"];
        item.explanation = "Self-centered people think only about themselves and rarely care about others.";
        changed = true;
      } else if (item.id === 'vi_g8_h_16') {
        item.prompt = "Target something difficult that tests your abilities and effort";
        item.explanation = "Challenging means demanding great effort and determination.";
        changed = true;
      } else if (item.id === 'vi_g8_h_22') {
        item.prompt = "Target the expression that means you strongly dislike something";
        item.distractorWords = ["Fond of", "Keen on", "Crazy about"];
        item.explanation = "'Can't stand' means to strongly dislike something (e.g. 'I can't stand loud noise').";
        changed = true;
      } else if (item.id === 'vi_g8_h_26') {
        item.prompt = "Target the strong rush of excitement during thrilling sports";
        item.explanation = "An adrenaline rush is a quick surge of excitement and energy.";
        changed = true;
      } else if (item.id === 'vi_g8_h_36') {
        item.prompt = "Target the feeling of floating freely without any gravity";
        item.explanation = "Weightlessness is the sensation of floating freely without gravity.";
        changed = true;
      }

      if (changed) {
        item.contentVersion = (item.contentVersion || 1) + 1;
        viModified++;
      }
    }
  }
}

// 2. Refine Grammar Basketball
import { GRAMMAR_BASKETBALL_BANK } from '../src/data/gamesZone/grammarBasketballData.ts';

let bbModified = 0;
for (const grade of ['grade-7', 'grade-8']) {
  for (const diff of ['easy', 'medium', 'hard']) {
    for (const item of GRAMMAR_BASKETBALL_BANK[grade][diff]) {
      let changed = false;

      if (item.id === 'bb_g7_m_40') {
        item.explanation = "In 'if' conditional sentences, use 'will + verb' (will become) in the main clause.";
        changed = true;
      } else if (item.id === 'bb_g7_h_01') {
        item.explanation = "After modal verbs like 'couldn\\'t', use the base form of the verb without 'to'.";
        changed = true;
      } else if (item.id === 'bb_g7_h_04') {
        item.explanation = "Use 'neither' together with 'nor' (neither ... nor).";
        changed = true;
      } else if (item.id === 'bb_g7_h_06') {
        item.prompt = "Unless we protect wildlife reserves, poachers _____ harm the remaining rhinos.";
        item.explanation = "First conditional: 'unless + present simple' is followed by 'will + verb'.";
        changed = true;
      } else if (item.id === 'bb_g7_h_11') {
        item.explanation = "Use 'would rather [verb] than [verb]' when choosing one thing over another.";
        changed = true;
      } else if (item.id === 'bb_g7_h_19') {
        item.explanation = "Use the base form of the verb after 'used to' (used to walk).";
        changed = true;
      } else if (item.id === 'bb_g8_e_12') {
        item.explanation = "Use the base form of the verb directly after 'would rather' (would rather stay).";
        changed = true;
      } else if (item.id === 'bb_g8_m_06') {
        item.explanation = "Use the base form of the verb after 'would rather' (would rather visit).";
        changed = true;
      } else if (item.id === 'bb_g8_h_06') {
        item.explanation = "Use 'would rather [verb] than [verb]' to state preferences.";
        changed = true;
      } else if (item.id === 'bb_g8_h_22') {
        item.explanation = "When speaking about another person's action, use 'would rather you did / didn\\'t'.";
        changed = true;
      } else if (item.id === 'bb_g8_h_26') {
        item.explanation = "Use 'Having + past participle' (Having explored) for an action completed before another.";
        changed = true;
      } else if (item.id === 'bb_g8_h_30') {
        item.explanation = "'Not only' pairs with 'but also' (Not only did he win, but he also broke the record).";
        changed = true;
      } else if (item.id === 'bb_g8_h_32') {
        item.explanation = "'No sooner had ... than' means immediately after the first event happened.";
        changed = true;
      } else if (item.id === 'bb_g8_h_37') {
        item.explanation = "After 'It is high time', use a past verb (started) to say it is time to act now.";
        changed = true;
      }

      if (changed) {
        item.contentVersion = (item.contentVersion || 1) + 1;
        bbModified++;
      }
    }
  }
}

// 3. Refine Grammar Runner
import { GRAMMAR_RUNNER_BANK } from '../src/data/gamesZone/grammarRunnerData.ts';

let grModified = 0;
for (const grade of ['grade-7', 'grade-8']) {
  for (const diff of Object.keys(GRAMMAR_RUNNER_BANK[grade])) {
    for (const item of GRAMMAR_RUNNER_BANK[grade][diff]) {
      let changed = false;

      if (item.id === 'gr_g7_m_08') {
        item.explanation = "Verbs of liking like 'prefer' are not used with -ing. Use the present simple.";
        changed = true;
      } else if (item.id === 'gr_g8_e_17') {
        item.explanation = "Use the base verb directly after 'would rather' (would rather study).";
        changed = true;
      } else if (item.id === 'gr_g8_h_03') {
        item.explanation = "Use the base verb after 'would rather' (would rather travel).";
        changed = true;
      }

      if (changed) {
        item.contentVersion = (item.contentVersion || 1) + 1;
        grModified++;
      }
    }
  }
}

// 4. Refine Sentence Tower
import { SENTENCE_TOWER_BANK } from '../src/data/gamesZone/sentenceTowerData.ts';

let stModified = 0;
for (const grade of ['grade-7', 'grade-8']) {
  for (const diff of Object.keys(SENTENCE_TOWER_BANK[grade])) {
    for (const item of SENTENCE_TOWER_BANK[grade][diff]) {
      let changed = false;

      if (item.id === 'st_g8_e_04') {
        item.explanation = "Use the base verb after 'would rather' (I would rather play chess).";
        changed = true;
      } else if (item.id === 'st_g8_h_02') {
        item.explanation = "Use the base verb after 'had better' (You had better wear a helmet).";
        changed = true;
      }

      if (changed) {
        item.contentVersion = (item.contentVersion || 1) + 1;
        stModified++;
      }
    }
  }
}

// 5. Refine Wordle English
import { WORDLE_ENGLISH_BANK } from '../src/data/gamesZone/wordleEnglishData.ts';

let weModified = 0;
for (const grade of ['grade-7', 'grade-8']) {
  for (const diff of ['easy', 'medium', 'hard']) {
    for (const item of WORDLE_ENGLISH_BANK[grade][diff]) {
      let changed = false;

      if (item.id === 'we_g8_m_22') {
        item.clue = "To go and see someone or spend time at a place";
        changed = true;
      } else if (item.id === 'we_g8_h_29') {
        item.explanation = "DAMAGE (Hasar, zarar): Physical harm caused to buildings or objects. E.g.: 'The heavy storm caused serious damage to the roof.'";
        changed = true;
      } else if (item.id === 'we_g7_h_22') {
        item.clue = "A narrow strip of decorative fabric";
        item.explanation = "RIBBON (Kurdele): A narrow strip of decorative fabric used for gifts. E.g.: 'She tied a shiny red ribbon around the gift box.'";
        changed = true;
      }

      if (changed) {
        item.contentVersion = (item.contentVersion || 1) + 1;
        weModified++;
      }
    }
  }
}

// 6. Refine Word Fishing
import { WORD_FISHING_BANK } from '../src/data/gamesZone/wordFishingData.ts';

let wfModified = 0;
for (const grade of ['grade-7', 'grade-8']) {
  for (const diff of ['easy', 'medium', 'hard']) {
    for (const item of WORD_FISHING_BANK[grade][diff]) {
      let changed = false;

      if (item.id === 'wf_g7_m_28') {
        item.cluePrompt = "Hook the cloth wrap used for an injured wrist or ankle";
        changed = true;
      }

      if (changed) {
        item.contentVersion = (item.contentVersion || 1) + 1;
        wfModified++;
      }
    }
  }
}

console.log(`Refined counts:
  Vocabulary Invaders: ${viModified}
  Grammar Basketball: ${bbModified}
  Grammar Runner: ${grModified}
  Sentence Tower: ${stModified}
  Wordle English: ${weModified}
  Word Fishing: ${wfModified}
`);

// Write files back
function writeBank(filePath, varName, typeName, bankObj) {
  const content = `/**
 * UNIT REVIEW ARCADE — ${path.basename(filePath, '.ts').toUpperCase()} DATA BANK
 * Refined for Turkish EFL Middle-School Pedagogy & School Safety Standards.
 */

import type { ${typeName} } from '../../types/gamesZone';

export const ${varName}: ${typeName} = ${JSON.stringify(bankObj, null, 2)};
`;
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated ${filePath}`);
}

writeBank('./src/data/gamesZone/vocabularyInvadersData.ts', 'VOCABULARY_INVADERS_BANK', 'VocabularyInvadersBank', VOCABULARY_INVADERS_BANK);
writeBank('./src/data/gamesZone/grammarBasketballData.ts', 'GRAMMAR_BASKETBALL_BANK', 'GrammarBasketballBank', GRAMMAR_BASKETBALL_BANK);
writeBank('./src/data/gamesZone/grammarRunnerData.ts', 'GRAMMAR_RUNNER_BANK', 'GrammarRunnerBank', GRAMMAR_RUNNER_BANK);
writeBank('./src/data/gamesZone/sentenceTowerData.ts', 'SENTENCE_TOWER_BANK', 'SentenceTowerBank', SENTENCE_TOWER_BANK);
writeBank('./src/data/gamesZone/wordleEnglishData.ts', 'WORDLE_ENGLISH_BANK', 'WordleEnglishBank', WORDLE_ENGLISH_BANK);
writeBank('./src/data/gamesZone/wordFishingData.ts', 'WORD_FISHING_BANK', 'WordFishingBank', WORD_FISHING_BANK);

