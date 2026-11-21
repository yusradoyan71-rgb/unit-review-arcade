/**
 * SCRIPT: rebalance_and_correct_starter_content.cjs
 * 
 * Performs automated correction & rebalancing for the 320 General English Starter Questions:
 * 1. Evenly rebalances Option A/B/C/D distribution across all 224 Multiple Choice/Reading/Train items (25% each).
 * 2. Balances True/False statements so 6 are TRUE and 7 are FALSE (46% / 54%).
 * 3. Scrambles scrambledWords deterministically and strips trailing punctuation for all 62 Sentence Builder items.
 * 4. Regenerates the 8 TypeScript source files.
 */

const fs = require('fs');
const path = require('path');
const createJiti = require('jiti');
const jiti = createJiti(__filename);

// Deterministic LCG seeded shuffle
function seededShuffle(arr, seedStr) {
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) {
    seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0;
  }
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  // Ensure it is not identical to original
  if (JSON.stringify(result) === JSON.stringify(arr) && result.length > 1) {
    [result[0], result[1]] = [result[1], result[0]];
  }
  return result;
}

const filesConfig = [
  {
    filePath: path.resolve(__dirname, '../src/data/generalEnglish/grade7/grammar.ts'),
    exportName: 'GRADE_7_GRAMMAR_QUESTIONS',
    title: 'GENERAL ENGLISH STARTER CONTENT — GRADE 7 GRAMMAR',
    meta: 'Total Questions: 60 (6 topics × 10 questions)\n * CEFR Levels: A1+ to A2\n * Status: draft (Pending Teacher Review)',
  },
  {
    filePath: path.resolve(__dirname, '../src/data/generalEnglish/grade7/vocabulary.ts'),
    exportName: 'GRADE_7_VOCABULARY_QUESTIONS',
    title: 'GENERAL ENGLISH STARTER CONTENT — GRADE 7 VOCABULARY',
    meta: 'Total Questions: 60 (4 thematic clusters × 15 questions)\n * CEFR Levels: A1+ to A2\n * Status: draft (Pending Teacher Review)',
  },
  {
    filePath: path.resolve(__dirname, '../src/data/generalEnglish/grade7/reading.ts'),
    exportName: 'GRADE_7_READING_QUESTIONS',
    title: 'GENERAL ENGLISH STARTER CONTENT — GRADE 7 READING',
    meta: 'Total Questions: 20 (5 short passages × 4 questions)\n * CEFR Levels: A1+ to A2 (60–90 words per passage)\n * Status: draft (Pending Teacher Review)',
  },
  {
    filePath: path.resolve(__dirname, '../src/data/generalEnglish/grade7/listening.ts'),
    exportName: 'GRADE_7_LISTENING_QUESTIONS',
    title: 'GENERAL ENGLISH STARTER CONTENT — GRADE 7 LISTENING & DICTATION',
    meta: 'Total Questions: 20 (4 audio sets × 5 questions)\n * CEFR Levels: A1+ to A2\n * Status: draft (Pending Teacher Review)',
  },
  {
    filePath: path.resolve(__dirname, '../src/data/generalEnglish/grade8/grammar.ts'),
    exportName: 'GRADE_8_GRAMMAR_QUESTIONS',
    title: 'GENERAL ENGLISH STARTER CONTENT — GRADE 8 GRAMMAR',
    meta: 'Total Questions: 60 (6 topics × 10 questions)\n * CEFR Levels: A2+ to B1-\n * Status: draft (Pending Teacher Review)',
  },
  {
    filePath: path.resolve(__dirname, '../src/data/generalEnglish/grade8/vocabulary.ts'),
    exportName: 'GRADE_8_VOCABULARY_QUESTIONS',
    title: 'GENERAL ENGLISH STARTER CONTENT — GRADE 8 VOCABULARY',
    meta: 'Total Questions: 60 (4 thematic clusters × 15 questions)\n * CEFR Levels: A2+ to B1-\n * Status: draft (Pending Teacher Review)',
  },
  {
    filePath: path.resolve(__dirname, '../src/data/generalEnglish/grade8/reading.ts'),
    exportName: 'GRADE_8_READING_QUESTIONS',
    title: 'GENERAL ENGLISH STARTER CONTENT — GRADE 8 READING',
    meta: 'Total Questions: 20 (5 short passages × 4 questions)\n * CEFR Levels: A2+ to B1- (100–140 words per passage)\n * Status: draft (Pending Teacher Review)',
  },
  {
    filePath: path.resolve(__dirname, '../src/data/generalEnglish/grade8/listening.ts'),
    exportName: 'GRADE_8_LISTENING_QUESTIONS',
    title: 'GENERAL ENGLISH STARTER CONTENT — GRADE 8 LISTENING & DICTATION',
    meta: 'Total Questions: 20 (4 audio sets × 5 questions)\n * CEFR Levels: A2+ to B1-\n * Status: draft (Pending Teacher Review)',
  },
];

// Specific True/False corrections to balance TRUE vs FALSE
const TF_CORRECTIONS = {
  ge_g7_gram_017: {
    prompt: 'True or False: The past simple form of "teach" is "taught".',
    isTrue: true,
    correctAnswerPreview: 'TRUE',
    explanation: 'True. "Teach" is an irregular verb, and its past simple form is "taught" (not "teached").',
  },
  ge_g7_gram_037: {
    prompt: 'True or False: The irregular comparative form of "good" is "better".',
    isTrue: true,
    correctAnswerPreview: 'TRUE',
    explanation: 'True. "Good" changes to "better" in the comparative form; we never say "gooder" or "more good".',
  },
  ge_g7_gram_057: {
    prompt: 'True or False: "You mustn\'t smoke here" means smoking is strictly forbidden by the rules.',
    isTrue: true,
    correctAnswerPreview: 'TRUE',
    explanation: 'True. "Mustn\'t" expresses strong prohibition, indicating that an action is not allowed or against the rules.',
  },
  ge_g8_gram_014: {
    prompt: 'True or False: "I have already seen that movie twice" is a correct present perfect sentence.',
    isTrue: true,
    correctAnswerPreview: 'TRUE',
    explanation: 'True. Present perfect is used with "already" and "twice" to describe an experience at an unspecified time in the past.',
  },
  ge_g8_gram_036: {
    prompt: 'True or False: In a First Conditional sentence, the if-clause uses the simple present tense.',
    isTrue: true,
    correctAnswerPreview: 'TRUE',
    explanation: 'True. In first conditional sentences, the if-clause uses the present simple (e.g., "If it rains..."), while the main clause uses "will" + verb.',
  },
  ge_g8_gram_048: {
    prompt: 'True or False: In passive voice sentences, the agent who performed the action is introduced by "by" (e.g. "written by Shakespeare").',
    isTrue: true,
    correctAnswerPreview: 'TRUE',
    explanation: 'True. The preposition "by" introduces the agent performing the action, whereas "with" is used for tools or instruments.',
  },
};

const LETTERS = ['A', 'B', 'C', 'D'];

// Process each file
let globalMcIndex = 0; // for round-robin 0, 1, 2, 3

filesConfig.forEach((cfg) => {
  console.log(`Processing ${cfg.exportName} from ${path.basename(cfg.filePath)}...`);
  const mod = jiti(cfg.filePath);
  const questions = mod[cfg.exportName];

  questions.forEach((q) => {
    // 1. Rebalance Multiple Choice / Train / Reading
    if (q.payload && q.payload.options && typeof q.payload.correctOptionIndex === 'number') {
      const origIndex = q.payload.correctOptionIndex;
      const correctText = q.payload.options[origIndex];
      const distractors = q.payload.options.filter((_, idx) => idx !== origIndex);

      const targetIndex = globalMcIndex % 4;
      globalMcIndex++;

      const newOptions = [];
      let dIdx = 0;
      for (let i = 0; i < 4; i++) {
        if (i === targetIndex) {
          newOptions.push(correctText);
        } else {
          newOptions.push(distractors[dIdx++]);
        }
      }

      q.payload.options = newOptions;
      q.payload.correctOptionIndex = targetIndex;
      q.correctAnswerPreview = `${LETTERS[targetIndex]}) ${correctText}`;
    }

    // 2. Rebalance True/False
    if (q.questionType === 'true_false' && TF_CORRECTIONS[q.id]) {
      const corr = TF_CORRECTIONS[q.id];
      q.prompt = corr.prompt;
      q.payload.isTrue = corr.isTrue;
      q.correctAnswerPreview = corr.correctAnswerPreview;
      q.explanation = corr.explanation;
    }

    // 3. Sentence Builder Scrambling & Punctuation Strip
    if (q.questionType === 'sentence_builder') {
      const sentence = q.payload.correctSentence || '';
      // Clean tokens
      const cleanTokens = sentence.split(/\s+/).map((t) => t.replace(/[.,!?;:]+$/, '')).filter(Boolean);
      // Deterministic shuffle
      const scrambled = seededShuffle(cleanTokens, q.id);
      q.payload.scrambledWords = scrambled;
      q.correctAnswerPreview = sentence;
    }
  });

  // Serialize back to TypeScript format
  const tsContent = `/**
 * ${cfg.title}
 * ${cfg.meta}
 */

import type { QuestionBankItem } from '../../../types/questionBank';

export const ${cfg.exportName}: QuestionBankItem[] = ${JSON.stringify(questions, null, 2)};
`;

  fs.writeFileSync(cfg.filePath, tsContent, 'utf8');
  console.log(`  ✓ Successfully updated and saved ${cfg.filePath}`);
});

console.log(`\nRebalancing complete. Total MC processed: ${globalMcIndex}`);

