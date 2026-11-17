import fs from 'fs';
import path from 'path';

// Import all Games Zone Banks
import { WORD_NINJA_BANK } from './src/data/gamesZone/wordNinjaData.ts';
import { GRAMMAR_RUNNER_BANK } from './src/data/gamesZone/grammarRunnerData.ts';
import { WORD_FISHING_BANK } from './src/data/gamesZone/wordFishingData.ts';
import { SENTENCE_TOWER_BANK } from './src/data/gamesZone/sentenceTowerData.ts';
import { GRAMMAR_BASKETBALL_BANK } from './src/data/gamesZone/grammarBasketballData.ts';
import { VOCABULARY_INVADERS_BANK } from './src/data/gamesZone/vocabularyInvadersData.ts';
import { WORDLE_ENGLISH_BANK } from './src/data/gamesZone/wordleEnglishData.ts';
import { WORD_CONNECT_BANK } from './src/data/gamesZone/wordConnectData.ts';
import { MEMORY_MATCH_BANK } from './src/data/gamesZone/memoryMatchData.ts';

// Import Grade 7 Curriculum Data
import { GAME_1_QUESTIONS as G7_U1_G1 } from './src/data/grade7/unit1/game1Vocab.ts';
import { GAME_2_ROUNDS as G7_U1_G2 } from './src/data/grade7/unit1/game2Match.ts';
import { GAME_3_QUESTIONS as G7_U1_G3 } from './src/data/grade7/unit1/game3Grammar.ts';
import { GAME_4_SENTENCES as G7_U1_G4 } from './src/data/grade7/unit1/game4Sentence.ts';
import { GAME_5_DIALOGUES as G7_U1_G5 } from './src/data/grade7/unit1/game5SayItOnline.ts';
import { GAME_6_STATEMENTS as G7_U1_G6 } from './src/data/grade7/unit1/game6TrueFalse.ts';
import { GAME_7_READING_QUESTIONS as G7_U1_G7 } from './src/data/grade7/unit1/game7Reading.ts';
import { GAME_8_QUESTIONS as G7_U1_G8 } from './src/data/grade7/unit1/game8Ultimate.ts';

import { GAME_1_QUESTIONS as G7_U2_G1 } from './src/data/grade7/unit2/game1Vocab.ts';
import { GAME_2_ROUNDS as G7_U2_G2 } from './src/data/grade7/unit2/game2Match.ts';
import { GAME_3_QUESTIONS as G7_U2_G3 } from './src/data/grade7/unit2/game3PastTense.ts';
import { GAME_4_SENTENCES as G7_U2_G4 } from './src/data/grade7/unit2/game4Sentence.ts';
import { GAME_5_QUESTIONS as G7_U2_G5 } from './src/data/grade7/unit2/game5Wildlife.ts';
import { GAME_6_DIALOGUES as G7_U2_G6 } from './src/data/grade7/unit2/game6Emergency.ts';
import { GAME_7_STATEMENTS as G7_U2_G7 } from './src/data/grade7/unit2/game7TrueFalse.ts';
import { GAME_8_READING_QUESTIONS as G7_U2_G8 } from './src/data/grade7/unit2/game8Reading.ts';
import { GAME_9_QUESTIONS as G7_U2_G9 } from './src/data/grade7/unit2/game9UsedTo.ts';
import { GAME_10_QUESTIONS as G7_U2_G10 } from './src/data/grade7/unit2/game10Ultimate.ts';

// Import Grade 8 Curriculum Data
import { GAME_1_QUESTIONS as G8_U1_G1 } from './src/data/grade8/unit1/game1Vocab.ts';
import { GAME_2_ROUNDS as G8_U1_G2 } from './src/data/grade8/unit1/game2Match.ts';
import { GAME_3_SENTENCES as G8_U1_G3 } from './src/data/grade8/unit1/game3Sentence.ts';
import { GAME_4_STATEMENTS as G8_U1_G4 } from './src/data/grade8/unit1/game4TrueFalse.ts';
import { GAME_5_DIALOGUES as G8_U1_G5 } from './src/data/grade8/unit1/game5SayItRight.ts';
import { GAME_6_READING_QUESTIONS as G8_U1_G6 } from './src/data/grade8/unit1/game6Reading.ts';
import { GAME_7_ULTIMATE_QUESTIONS as G8_U1_G7 } from './src/data/grade8/unit1/game7Ultimate.ts';

import { GAME_1_QUESTIONS as G8_U2_G1 } from './src/data/grade8/unit2/game1Vocab.ts';
import { GAME_2_ROUNDS as G8_U2_G2 } from './src/data/grade8/unit2/game2Match.ts';
import { GAME_3_QUESTIONS as G8_U2_G3 } from './src/data/grade8/unit2/game3Grammar.ts';
import { GAME_4_SENTENCES as G8_U2_G4 } from './src/data/grade8/unit2/game4Sentence.ts';
import { GAME_5_QUESTIONS as G8_U2_G5 } from './src/data/grade8/unit2/game5Troubles.ts';
import { GAME_6_STATEMENTS as G8_U2_G6 } from './src/data/grade8/unit2/game6TrueFalse.ts';
import { GAME_7_READING_QUESTIONS as G8_U2_G7 } from './src/data/grade8/unit2/game7Reading.ts';
import { GAME_8_QUESTIONS as G8_U2_G8 } from './src/data/grade8/unit2/game8Ultimate.ts';

import { GAME_1_QUESTIONS as G8_U3_G1 } from './src/data/grade8/unit3/game1Vocab.ts';
import { GAME_2_ROUNDS as G8_U3_G2 } from './src/data/grade8/unit3/game2Match.ts';
import { GAME_3_QUESTIONS as G8_U3_G3 } from './src/data/grade8/unit3/game3Suggestions.ts';
import { GAME_4_QUESTIONS as G8_U3_G4 } from './src/data/grade8/unit3/game4Station.ts';
import { GAME_5_SENTENCES as G8_U3_G5 } from './src/data/grade8/unit3/game5Sentence.ts';
import { GAME_6_STATEMENTS as G8_U3_G6 } from './src/data/grade8/unit3/game6TrueFalse.ts';
import { GAME_7_READING_QUESTIONS as G8_U3_G7 } from './src/data/grade8/unit3/game7Reading.ts';
import { GAME_8_QUESTIONS as G8_U3_G8 } from './src/data/grade8/unit3/game8Ultimate.ts';

import { GAME_1_QUESTIONS as G8_U4_G1 } from './src/data/grade8/unit4/game1Vocab.ts';
import { GAME_2_ROUNDS as G8_U4_G2 } from './src/data/grade8/unit4/game2Match.ts';
import { GAME_3_QUESTIONS as G8_U4_G3 } from './src/data/grade8/unit4/game3Grammar.ts';
import { GAME_4_SENTENCES as G8_U4_G4 } from './src/data/grade8/unit4/game4Sentence.ts';
import { GAME_5_QUESTIONS as G8_U4_G5 } from './src/data/grade8/unit4/game5Troubles.ts';
import { GAME_6_STATEMENTS as G8_U4_G6 } from './src/data/grade8/unit4/game6TrueFalse.ts';
import { GAME_7_READING_QUESTIONS as G8_U4_G7 } from './src/data/grade8/unit4/game7Reading.ts';
import { GAME_8_QUESTIONS as G8_U4_G8 } from './src/data/grade8/unit4/game8Ultimate.ts';

console.log('=== RUNNING GLOBAL CONTENT AUDIT & INVENTORY ===\n');

// Aggregation structures
const inventory = [];
const safetyFlags = [];
const pedagogicalFlags = [];

// Keywords for safety and appropriateness scan
const INAPPROPRIATE_PATTERNS = [
  // Alcohol
  { category: 'Alcohol', regex: /\b(beer|wine|vodka|whiskey|whisky|alcohol|alcoholic|cocktail|champagne|liquor|tequila|rum|pub|drunk|booze)\b/i },
  // Tobacco & Smoking
  { category: 'Tobacco', regex: /\b(cigarette|cigarettes|cigar|cigars|tobacco|vape|vaping|nicotine|hookah)\b/i },
  // Drugs
  { category: 'Drugs', regex: /\b(drugs|marijuana|weed|cocaine|heroin|narcotic|narcotics)\b/i },
  // Gambling
  { category: 'Gambling', regex: /\b(casino|lottery|gamble|gambling|roulette|jackpot|betting|slot machine|poker)\b/i },
  // Adult / Sexual
  { category: 'Adult/Explicit', regex: /\b(sexy|naked|erotic|porn|strip|prostitute)\b/i },
  // Violence / Weapons (excluding legitimate curriculum like "earthquake/flood" or "knife" in kitchen)
  { category: 'Violence/Weapons', regex: /\b(gun|guns|pistol|rifle|shotgun|shoot|shooting|murder|murderer|kill|killer|blood|bloody|weapon|weapons|bomb|suicide|corpse|slaughter)\b/i },
  // Degrading / Profane / Insults
  { category: 'Profanity/Insult', regex: /\b(damn|hell|bastard|idiot|stupid|loser|ugly|fat|fool)\b/i },
];

// Complex words that might make definitions or clues harder than the target
const OVERLY_COMPLEX_TERMS = [
  'touchscreen', 'predominantly', 'simultaneously', 'consecutive', 'superficial',
  'indispensable', 'ubiquitous', 'meticulous', 'monotonous', 'catastrophic',
  'counterproductive', 'insurmountable', 'prerequisite', 'deteriorate'
];

function scanItem(item, context) {
  inventory.push({ ...context, id: item.id || context.id });

  // Extract all textual fields
  const texts = [];
  if (item.prompt) texts.push({ field: 'prompt', text: item.prompt });
  if (item.sentencePrompt) texts.push({ field: 'sentencePrompt', text: item.sentencePrompt });
  if (item.cluePrompt) texts.push({ field: 'cluePrompt', text: item.cluePrompt });
  if (item.correctSentence) texts.push({ field: 'correctSentence', text: item.correctSentence });
  if (item.clue) texts.push({ field: 'clue', text: item.clue });
  if (item.turkishMeaning) texts.push({ field: 'turkishMeaning', text: item.turkishMeaning });
  if (item.exampleSentence) texts.push({ field: 'exampleSentence', text: item.exampleSentence });
  if (item.explanation) texts.push({ field: 'explanation', text: item.explanation });
  if (item.word) texts.push({ field: 'word', text: item.word });
  if (item.targetWord) texts.push({ field: 'targetWord', text: item.targetWord });
  if (item.correctWord) texts.push({ field: 'correctWord', text: item.correctWord });
  if (item.statement) texts.push({ field: 'statement', text: item.statement });
  if (item.sentence) texts.push({ field: 'sentence', text: item.sentence });
  if (item.passage) texts.push({ field: 'passage', text: item.passage });
  if (item.leftText) texts.push({ field: 'leftText', text: item.leftText });
  if (item.rightText) texts.push({ field: 'rightText', text: item.rightText });
  if (item.text) texts.push({ field: 'text', text: item.text });
  if (item.question) texts.push({ field: 'question', text: item.question });

  if (Array.isArray(item.options)) {
    item.options.forEach((opt, idx) => texts.push({ field: `option_${idx}`, text: String(opt) }));
  }
  if (Array.isArray(item.laneOptions)) {
    item.laneOptions.forEach((opt, idx) => texts.push({ field: `lane_${idx}`, text: String(opt) }));
  }
  if (Array.isArray(item.distractorWords)) {
    item.distractorWords.forEach((dw, idx) => texts.push({ field: `distractor_${idx}`, text: String(dw) }));
  }
  if (Array.isArray(item.scrambledWords)) {
    texts.push({ field: 'scrambledWords', text: item.scrambledWords.join(' ') });
  }
  if (Array.isArray(item.targetWords)) {
    item.targetWords.forEach((tw, idx) => {
      texts.push({ field: `targetWord_${idx}`, text: tw.word });
      if (tw.turkishMeaning) texts.push({ field: `targetMeaning_${idx}`, text: tw.turkishMeaning });
    });
  }

  // 1. Safety Scan
  for (const t of texts) {
    for (const pat of INAPPROPRIATE_PATTERNS) {
      const match = t.text.match(pat.regex);
      if (match) {
        safetyFlags.push({
          id: item.id || context.id,
          source: context.source,
          grade: context.grade,
          unitOrGame: context.unitOrGame,
          field: t.field,
          matchedWord: match[0],
          category: pat.category,
          fullSnippet: t.text.length > 120 ? t.text.substring(0, 120) + '...' : t.text,
        });
      }
    }
  }

  // 2. Pedagogical / Linguistic Complexity Scan
  for (const t of texts) {
    // Check definition/clue length vs teacher pedagogical thresholds:
    // Prompts/clues: max 12-14 words for vocabulary/matching
    // Explanations: max 30 words for complex items, max 20 words for simple items
    if (['clue', 'cluePrompt', 'rightText'].includes(t.field)) {
      const wordCount = t.text.split(/\s+/).filter(Boolean).length;
      if (wordCount > 14 && context.type !== 'reading') {
        pedagogicalFlags.push({
          id: item.id || context.id,
          source: context.source,
          grade: context.grade,
          unitOrGame: context.unitOrGame,
          issue: 'Excessively Long Clue/Prompt',
          detail: `${wordCount} words: "${t.text.substring(0, 80)}..."`,
        });
      }
    } else if (t.field === 'explanation') {
      const wordCount = t.text.split(/\s+/).filter(Boolean).length;
      if (wordCount > 30 && context.type !== 'reading') {
        pedagogicalFlags.push({
          id: item.id || context.id,
          source: context.source,
          grade: context.grade,
          unitOrGame: context.unitOrGame,
          issue: 'Excessively Long Explanation (>30 words)',
          detail: `${wordCount} words: "${t.text.substring(0, 80)}..."`,
        });
      }
    }

      // Check overly complex terms in definitions
      for (const complexWord of OVERLY_COMPLEX_TERMS) {
        if (new RegExp(`\\b${complexWord}\\b`, 'i').test(t.text)) {
          pedagogicalFlags.push({
            id: item.id || context.id,
            source: context.source,
            grade: context.grade,
            unitOrGame: context.unitOrGame,
            issue: 'Definition Harder Than Target Concept',
            detail: `Contains "${complexWord}" in ${t.field}: "${t.text.substring(0, 80)}..."`,
          });
        }
      }
    }
  }

// ----------------------------------------------------------------------------
// INGEST ALL CONTENT SOURCES
// ----------------------------------------------------------------------------

// A. Games Zone
const gzGames = [
  { name: 'Word Ninja', bank: WORD_NINJA_BANK, file: 'wordNinjaData.ts' },
  { name: 'Grammar Runner', bank: GRAMMAR_RUNNER_BANK, file: 'grammarRunnerData.ts' },
  { name: 'Word Fishing', bank: WORD_FISHING_BANK, file: 'wordFishingData.ts' },
  { name: 'Sentence Tower', bank: SENTENCE_TOWER_BANK, file: 'sentenceTowerData.ts' },
  { name: 'Grammar Basketball', bank: GRAMMAR_BASKETBALL_BANK, file: 'grammarBasketballData.ts' },
  { name: 'Vocabulary Invaders', bank: VOCABULARY_INVADERS_BANK, file: 'vocabularyInvadersData.ts' },
  { name: 'Wordle English', bank: WORDLE_ENGLISH_BANK, file: 'wordleEnglishData.ts' },
  { name: 'Word Connect', bank: WORD_CONNECT_BANK, file: 'wordConnectData.ts' },
  { name: 'Memory Match', bank: MEMORY_MATCH_BANK, file: 'memoryMatchData.ts' },
];

for (const game of gzGames) {
  for (const grade of ['grade-7', 'grade-8']) {
    for (const diff of ['easy', 'medium', 'hard']) {
      const items = game.bank[grade]?.[diff] || [];
      items.forEach((item, idx) => {
        scanItem(item, {
          source: `GamesZone / ${game.file}`,
          grade,
          unitOrGame: game.name,
          difficulty: diff,
          type: 'game',
          index: idx,
        });

        // If Memory Match, also scan individual pairs
        if (game.name === 'Memory Match' && Array.isArray(item.pairs)) {
          item.pairs.forEach((pair, pIdx) => {
            scanItem(pair, {
              source: `GamesZone / ${game.file} (Pair)`,
              grade,
              unitOrGame: `${game.name} (Set ${item.id})`,
              difficulty: diff,
              type: 'matching_pair',
              index: pIdx,
            });
          });
        }
      });
    }
  }
}

// B. Grade 7 Unit Reviews
const g7Activities = [
  // Unit 1
  { list: G7_U1_G1, unit: 'Unit 1', act: 'Activity 1: Vocabulary Quiz', file: 'grade7/unit1/game1Vocab.ts' },
  { list: G7_U1_G2, unit: 'Unit 1', act: 'Activity 2: Word Match', file: 'grade7/unit1/game2Match.ts' },
  { list: G7_U1_G3, unit: 'Unit 1', act: 'Activity 3: Grammar Sprint', file: 'grade7/unit1/game3Grammar.ts' },
  { list: G7_U1_G4, unit: 'Unit 1', act: 'Activity 4: Sentence Scramble', file: 'grade7/unit1/game4Sentence.ts' },
  { list: G7_U1_G5, unit: 'Unit 1', act: 'Activity 5: Say It Online', file: 'grade7/unit1/game5SayItOnline.ts' },
  { list: G7_U1_G6, unit: 'Unit 1', act: 'Activity 6: True / False', file: 'grade7/unit1/game6TrueFalse.ts' },
  { list: G7_U1_G7, unit: 'Unit 1', act: 'Activity 7: Reading Detective', file: 'grade7/unit1/game7Reading.ts', type: 'reading' },
  { list: G7_U1_G8, unit: 'Unit 1', act: 'Activity 8: Ultimate Challenge', file: 'grade7/unit1/game8Ultimate.ts' },

  // Unit 2
  { list: G7_U2_G1, unit: 'Unit 2', act: 'Activity 1: Vocabulary Quiz', file: 'grade7/unit2/game1Vocab.ts' },
  { list: G7_U2_G2, unit: 'Unit 2', act: 'Activity 2: Word Match', file: 'grade7/unit2/game2Match.ts' },
  { list: G7_U2_G3, unit: 'Unit 2', act: 'Activity 3: Past Tense Sprint', file: 'grade7/unit2/game3PastTense.ts' },
  { list: G7_U2_G4, unit: 'Unit 2', act: 'Activity 4: Sentence Scramble', file: 'grade7/unit2/game4Sentence.ts' },
  { list: G7_U2_G5, unit: 'Unit 2', act: 'Activity 5: Wildlife Mission', file: 'grade7/unit2/game5Wildlife.ts' },
  { list: G7_U2_G6, unit: 'Unit 2', act: 'Activity 6: Emergency Dialogue', file: 'grade7/unit2/game6Emergency.ts' },
  { list: G7_U2_G7, unit: 'Unit 2', act: 'Activity 7: True / False', file: 'grade7/unit2/game7TrueFalse.ts' },
  { list: G7_U2_G8, unit: 'Unit 2', act: 'Activity 8: Reading Detective', file: 'grade7/unit2/game8Reading.ts', type: 'reading' },
  { list: G7_U2_G9, unit: 'Unit 2', act: 'Activity 9: Used To Challenge', file: 'grade7/unit2/game9UsedTo.ts' },
  { list: G7_U2_G10, unit: 'Unit 2', act: 'Activity 10: Ultimate Challenge', file: 'grade7/unit2/game10Ultimate.ts' },
];

for (const act of g7Activities) {
  const items = Array.isArray(act.list) ? act.list : [];
  items.forEach((item, idx) => {
    scanItem(item, {
      source: `UnitReview / ${act.file}`,
      grade: 'grade-7',
      unitOrGame: `${act.unit} - ${act.act}`,
      difficulty: item.difficulty || 'medium',
      type: act.type || 'activity',
      index: idx,
    });

    // If matching pairs round
    if (Array.isArray(item.pairs)) {
      item.pairs.forEach((pair, pIdx) => {
        scanItem(pair, {
          source: `UnitReview / ${act.file} (Pair)`,
          grade: 'grade-7',
          unitOrGame: `${act.unit} - ${act.act}`,
          difficulty: item.difficulty || 'medium',
          type: 'matching_pair',
          index: pIdx,
        });
      });
    }
  });
}

// C. Grade 8 Unit Reviews
const g8Activities = [
  // Unit 1
  { list: G8_U1_G1, unit: 'Unit 1', act: 'Activity 1: Vocabulary Quiz', file: 'grade8/unit1/game1Vocab.ts' },
  { list: G8_U1_G2, unit: 'Unit 1', act: 'Activity 2: Word Match', file: 'grade8/unit1/game2Match.ts' },
  { list: G8_U1_G3, unit: 'Unit 1', act: 'Activity 3: Sentence Builder', file: 'grade8/unit1/game3Sentence.ts' },
  { list: G8_U1_G4, unit: 'Unit 1', act: 'Activity 4: True / False', file: 'grade8/unit1/game4TrueFalse.ts' },
  { list: G8_U1_G5, unit: 'Unit 1', act: 'Activity 5: Say It Right', file: 'grade8/unit1/game5SayItRight.ts' },
  { list: G8_U1_G6, unit: 'Unit 1', act: 'Activity 6: Reading Detective', file: 'grade8/unit1/game6Reading.ts', type: 'reading' },
  { list: G8_U1_G7, unit: 'Unit 1', act: 'Activity 7: Ultimate Challenge', file: 'grade8/unit1/game7Ultimate.ts' },

  // Unit 2
  { list: G8_U2_G1, unit: 'Unit 2', act: 'Activity 1: Vocabulary Quiz', file: 'grade8/unit2/game1Vocab.ts' },
  { list: G8_U2_G2, unit: 'Unit 2', act: 'Activity 2: Word Match', file: 'grade8/unit2/game2Match.ts' },
  { list: G8_U2_G3, unit: 'Unit 2', act: 'Activity 3: Grammar Quest', file: 'grade8/unit2/game3Grammar.ts' },
  { list: G8_U2_G4, unit: 'Unit 2', act: 'Activity 4: Sentence Builder', file: 'grade8/unit2/game4Sentence.ts' },
  { list: G8_U2_G5, unit: 'Unit 2', act: 'Activity 5: Troubles & Solutions', file: 'grade8/unit2/game5Troubles.ts' },
  { list: G8_U2_G6, unit: 'Unit 2', act: 'Activity 6: True / False', file: 'grade8/unit2/game6TrueFalse.ts' },
  { list: G8_U2_G7, unit: 'Unit 2', act: 'Activity 7: Reading Detective', file: 'grade8/unit2/game7Reading.ts', type: 'reading' },
  { list: G8_U2_G8, unit: 'Unit 2', act: 'Activity 8: Ultimate Challenge', file: 'grade8/unit2/game8Ultimate.ts' },

  // Unit 3
  { list: G8_U3_G1, unit: 'Unit 3', act: 'Activity 1: Vocabulary Quiz', file: 'grade8/unit3/game1Vocab.ts' },
  { list: G8_U3_G2, unit: 'Unit 3', act: 'Activity 2: Word Match', file: 'grade8/unit3/game2Match.ts' },
  { list: G8_U3_G3, unit: 'Unit 3', act: 'Activity 3: Cooking Suggestions', file: 'grade8/unit3/game3Suggestions.ts' },
  { list: G8_U3_G4, unit: 'Unit 3', act: 'Activity 4: Kitchen Station', file: 'grade8/unit3/game4Station.ts' },
  { list: G8_U3_G5, unit: 'Unit 3', act: 'Activity 5: Sentence Builder', file: 'grade8/unit3/game5Sentence.ts' },
  { list: G8_U3_G6, unit: 'Unit 3', act: 'Activity 6: True / False', file: 'grade8/unit3/game6TrueFalse.ts' },
  { list: G8_U3_G7, unit: 'Unit 3', act: 'Activity 7: Reading Detective', file: 'grade8/unit3/game7Reading.ts', type: 'reading' },
  { list: G8_U3_G8, unit: 'Unit 3', act: 'Activity 8: Ultimate Challenge', file: 'grade8/unit3/game8Ultimate.ts' },

  // Unit 4
  { list: G8_U4_G1, unit: 'Unit 4', act: 'Activity 1: Vocabulary Quiz', file: 'grade8/unit4/game1Vocab.ts' },
  { list: G8_U4_G2, unit: 'Unit 4', act: 'Activity 2: Word Match', file: 'grade8/unit4/game2Match.ts' },
  { list: G8_U4_G3, unit: 'Unit 4', act: 'Activity 3: Phone Grammar', file: 'grade8/unit4/game3Grammar.ts' },
  { list: G8_U4_G4, unit: 'Unit 4', act: 'Activity 4: Sentence Builder', file: 'grade8/unit4/game4Sentence.ts' },
  { list: G8_U4_G5, unit: 'Unit 4', act: 'Activity 5: Phone Troubles', file: 'grade8/unit4/game5Troubles.ts' },
  { list: G8_U4_G6, unit: 'Unit 4', act: 'Activity 6: True / False', file: 'grade8/unit4/game6TrueFalse.ts' },
  { list: G8_U4_G7, unit: 'Unit 4', act: 'Activity 7: Reading Detective', file: 'grade8/unit4/game7Reading.ts', type: 'reading' },
  { list: G8_U4_G8, unit: 'Unit 4', act: 'Activity 8: Ultimate Challenge', file: 'grade8/unit4/game8Ultimate.ts' },
];

for (const act of g8Activities) {
  const items = Array.isArray(act.list) ? act.list : [];
  items.forEach((item, idx) => {
    scanItem(item, {
      source: `UnitReview / ${act.file}`,
      grade: 'grade-8',
      unitOrGame: `${act.unit} - ${act.act}`,
      difficulty: item.difficulty || 'medium',
      type: act.type || 'activity',
      index: idx,
    });

    if (Array.isArray(item.pairs)) {
      item.pairs.forEach((pair, pIdx) => {
        scanItem(pair, {
          source: `UnitReview / ${act.file} (Pair)`,
          grade: 'grade-8',
          unitOrGame: `${act.unit} - ${act.act}`,
          difficulty: item.difficulty || 'medium',
          type: 'matching_pair',
          index: pIdx,
        });
      });
    }
  });
}

// ----------------------------------------------------------------------------
// METRICS & ANALYSIS
// ----------------------------------------------------------------------------
console.log('--- AUDIT COMPLETE ---');
console.log(`Total educational items scanned: ${inventory.length}`);

// Breakdown by Grade
const byGrade = {};
inventory.forEach((i) => {
  byGrade[i.grade] = (byGrade[i.grade] || 0) + 1;
});
console.log('\nBreakdown by Grade:', byGrade);

// Breakdown by Source / Game
const bySource = {};
inventory.forEach((i) => {
  bySource[i.unitOrGame] = (bySource[i.unitOrGame] || 0) + 1;
});

// Breakdown by Difficulty
const byDiff = {};
inventory.forEach((i) => {
  byDiff[i.difficulty] = (byDiff[i.difficulty] || 0) + 1;
});
console.log('\nBreakdown by Difficulty:', byDiff);

console.log(`\nSafety / Appropriateness Flags Identified: ${safetyFlags.length}`);
console.log(`Pedagogical / Complexity Flags Identified: ${pedagogicalFlags.length}`);

// Output results to JSON for comprehensive analysis
const auditOutput = {
  totalItems: inventory.length,
  breakdownByGrade: byGrade,
  breakdownByDifficulty: byDiff,
  breakdownBySource: bySource,
  safetyFlags,
  pedagogicalFlags,
};

fs.writeFileSync('audit_results.json', JSON.stringify(auditOutput, null, 2), 'utf-8');
console.log('Audit results saved to audit_results.json.');
