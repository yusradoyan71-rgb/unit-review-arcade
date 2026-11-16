/**
 * UNIT REVIEW ARCADE — GAMES ZONE DATA & CATALOG (PHASE 7A)
 * Version: 7.0.0
 * 
 * Aggregated entry point for Games Zone data banks, catalog metadata,
 * and game dispatchers.
 */

import type { GradeId } from '../../types/schema';
import type {
  GamesZoneGameId,
  GamesZoneDifficulty,
  GamesZoneGameMetadata,
  WordNinjaItem,
  GrammarRunnerItem,
  WordFishingItem,
  SentenceTowerItem,
} from '../../types/gamesZone';

import { WORD_NINJA_BANK } from './wordNinjaData.ts';
import { GRAMMAR_RUNNER_BANK } from './grammarRunnerData.ts';
import { WORD_FISHING_BANK } from './wordFishingData.ts';
import { SENTENCE_TOWER_BANK } from './sentenceTowerData.ts';

export { WORD_NINJA_BANK } from './wordNinjaData.ts';
export { GRAMMAR_RUNNER_BANK } from './grammarRunnerData.ts';
export { WORD_FISHING_BANK } from './wordFishingData.ts';
export { SENTENCE_TOWER_BANK } from './sentenceTowerData.ts';

export const GAMES_ZONE_CATALOG: GamesZoneGameMetadata[] = [
  {
    id: 'word_ninja',
    title: 'Word Ninja',
    tagline: 'Slice the correct English words before they fly off screen!',
    category: 'vocabulary',
    categoryLabel: 'Speed Vocabulary',
    iconName: 'Zap',
    accentColor: '#EF4444',
    accentGradient: 'from-red-500 to-rose-600',
    badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30',
    isUnlocked: true,
    howToPlay: {
      objective: 'Slice or click only the words that answer the top prompt. Avoid flying distractors!',
      controls: 'Swipe across the target word or tap/click it directly with mouse or smartboard touch.',
      smartboardTip: 'Use swift single finger swipes across targets on interactive smartboards.',
      rules: [
        'You start with 3 lives. Missing the target or slicing an incorrect word loses 1 life.',
        'Build up a combo multiplier by slicing multiple correct targets in succession.',
        'Game ends when lives reach 0 or after completing all 10 rounds in the run.',
      ],
    },
  },
  {
    id: 'grammar_runner',
    title: 'Grammar Runner',
    tagline: 'Sprint down the 3-lane track and steer through the correct grammar gate!',
    category: 'grammar',
    categoryLabel: 'Grammar Arcade',
    iconName: 'Flame',
    accentColor: '#3B82F6',
    accentGradient: 'from-blue-500 to-indigo-600',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    isUnlocked: true,
    howToPlay: {
      objective: 'Steer your runner into the lane holding the correct grammatical word or clause.',
      controls: 'Use Left/Right Arrow keys, A/D, or tap the Left/Center/Right track lanes.',
      smartboardTip: 'Tap the lane on screen where the correct answer gate is approaching.',
      rules: [
        'Each question has 3 gates (Left, Center, Right). Steer into the correct option.',
        'Crashing into an incorrect gate damages your shield and slows your sprint.',
        'Survive through all 10 checkpoints to achieve a gold crown finish!',
      ],
    },
  },
  {
    id: 'word_fishing',
    title: 'Word Fishing',
    tagline: 'Cast your line into the pond and catch swimming fish matching the clue!',
    category: 'collocations',
    categoryLabel: 'Pond Discovery',
    iconName: 'Compass',
    accentColor: '#06B6D4',
    accentGradient: 'from-cyan-500 to-teal-600',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    isUnlocked: true,
    howToPlay: {
      objective: 'Read the clue at the top and reel in the fish carrying the matching English word.',
      controls: 'Click or tap any swimming fish to cast your fishing hook directly toward it.',
      smartboardTip: 'Touch the swimming fish on the board when it swims near the center of the lake.',
      rules: [
        'Catching the correct fish adds points and displays the definition explanation.',
        'Catching an incorrect fish scares the pond and deducts a life or time penalty.',
        'Catch 10 fish to complete your fishing adventure session!',
      ],
    },
  },
  {
    id: 'sentence_tower',
    title: 'Sentence Tower',
    tagline: 'Assemble scrambled words to build an architectural skyscraper floor by floor!',
    category: 'syntax',
    categoryLabel: 'Syntax Builder',
    iconName: 'Layers',
    accentColor: '#10B981',
    accentGradient: 'from-emerald-500 to-green-600',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    isUnlocked: true,
    howToPlay: {
      objective: 'Unscramble word blocks into a grammatically accurate English sentence to build a tower.',
      controls: 'Click word blocks to place them into the sentence slots or drag them into order.',
      smartboardTip: 'Tap blocks in order on the smartboard. Tap any placed block to send it back.',
      rules: [
        'Every correct sentence stacks a sturdy new floor onto your growing skyscraper.',
        'Alternative valid English sentence structures are recognized and accepted.',
        'Build a 10-story architectural masterpiece to earn maximum XP!',
      ],
    },
  },
];

export function getGameMetadata(gameId: GamesZoneGameId): GamesZoneGameMetadata | undefined {
  return GAMES_ZONE_CATALOG.find((g) => g.id === gameId);
}

export function getAllGamesZoneCatalog(): GamesZoneGameMetadata[] {
  return GAMES_ZONE_CATALOG;
}

/**
 * Returns a randomized slice of questions for a chosen game, grade, and difficulty.
 * Defaults to 10 questions per gameplay session.
 */
export function getQuestionsForGame(
  gameId: GamesZoneGameId,
  gradeId: GradeId,
  difficulty: GamesZoneDifficulty,
  count: number = 10
): (WordNinjaItem | GrammarRunnerItem | WordFishingItem | SentenceTowerItem)[] {
  let sourceBank: any[] = [];

  switch (gameId) {
    case 'word_ninja':
      sourceBank = WORD_NINJA_BANK[gradeId]?.[difficulty] || [];
      break;
    case 'grammar_runner':
      sourceBank = GRAMMAR_RUNNER_BANK[gradeId]?.[difficulty] || [];
      break;
    case 'word_fishing':
      sourceBank = WORD_FISHING_BANK[gradeId]?.[difficulty] || [];
      break;
    case 'sentence_tower':
      sourceBank = SENTENCE_TOWER_BANK[gradeId]?.[difficulty] || [];
      break;
    default:
      sourceBank = [];
  }

  if (sourceBank.length === 0) {
    return [];
  }

  // Fisher-Yates shuffle copy
  const shuffled = [...sourceBank];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, Math.min(count, shuffled.length));
}
