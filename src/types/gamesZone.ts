/**
 * UNIT REVIEW ARCADE — GAMES ZONE TYPES (PHASE 7A)
 * Version: 7.0.0
 * 
 * Modular architectural definitions for the standalone Games Zone:
 * - Word Ninja
 * - Grammar Runner
 * - Word Fishing
 * - Sentence Tower
 * + Extensible foundation for the upcoming 10 games.
 */

import type { GradeId } from './schema';

export type GamesZoneGameId =
  | 'word_ninja'
  | 'grammar_runner'
  | 'word_fishing'
  | 'sentence_tower';

export type GamesZoneDifficulty = 'easy' | 'medium' | 'hard';

export type GamesZoneCategory = 'vocabulary' | 'grammar' | 'collocations' | 'syntax';

export interface GamesZoneHowToPlay {
  objective: string;
  controls: string;
  smartboardTip: string;
  rules: string[];
}

export interface GamesZoneGameMetadata {
  id: GamesZoneGameId;
  title: string;
  tagline: string;
  category: GamesZoneCategory;
  categoryLabel: string;
  iconName: string;
  accentColor: string;
  accentGradient: string;
  badgeColor: string;
  isUnlocked: boolean;
  howToPlay: GamesZoneHowToPlay;
}

// ---------------------------------------------------------------------------
// QUESTION MODELS FOR THE FIRST 4 GAMES
// ---------------------------------------------------------------------------

/**
 * Word Ninja Target:
 * Slicing / clicking moving words that match prompt
 */
export interface WordNinjaItem {
  id: string;
  prompt: string;                  // e.g. "Find the synonym of 'Huge'" or "Slice the Past Tense of 'Catch'"
  promptType: 'meaning' | 'synonym' | 'antonym' | 'past_tense' | 'spelling' | 'category';
  correctWord: string;             // The target to slice
  distractorWords: string[];       // 2 to 4 distractors moving on screen
  explanation?: string;
}

/**
 * Grammar Runner Question:
 * 3-lane road obstacle challenge with grammar gates
 */
export interface GrammarRunnerItem {
  id: string;
  sentencePrompt: string;          // e.g. "She _____ to the library every Friday afternoon."
  laneOptions: [string, string, string]; // Exactly 3 lane choices (Left, Center, Right)
  correctLaneIndex: 0 | 1 | 2;     // 0 = Left, 1 = Center, 2 = Right
  grammarTopic: string;            // e.g. "Present Simple / 3rd Person"
  explanation?: string;
}

/**
 * Word Fishing Question:
 * Fish swimming across the pond carrying words; hook the right one
 */
export interface WordFishingItem {
  id: string;
  cluePrompt: string;              // e.g. "Hook the word that means 'A doctor for animals'"
  clueCategory: string;            // e.g. "Occupations", "Adjectives", "British English"
  targetWord: string;              // The correct fish
  distractorWords: string[];       // 3 to 5 swimming distractors
  explanation?: string;
}

/**
 * Sentence Tower Question:
 * Unscramble blocks to build another floor of the tower
 */
export interface SentenceTowerItem {
  id: string;
  scrambledWords: string[];
  correctSentence: string;
  alternativeSentences?: string[];
  themeOrTopic: string;
  explanation?: string;
}

// ---------------------------------------------------------------------------
// DATA BANK SCHEMAS
// ---------------------------------------------------------------------------

export type WordNinjaBank = Record<GradeId, Record<GamesZoneDifficulty, WordNinjaItem[]>>;
export type GrammarRunnerBank = Record<GradeId, Record<GamesZoneDifficulty, GrammarRunnerItem[]>>;
export type WordFishingBank = Record<GradeId, Record<GamesZoneDifficulty, WordFishingItem[]>>;
export type SentenceTowerBank = Record<GradeId, Record<GamesZoneDifficulty, SentenceTowerItem[]>>;

// ---------------------------------------------------------------------------
// SESSION & TELEMETRY SCHEMAS
// ---------------------------------------------------------------------------

export interface GamesZoneAttemptRecord {
  attemptId: string;
  gameId: GamesZoneGameId;
  gameTitle: string;
  studentNumber: string;
  class?: string;
  gradeId: GradeId;
  difficulty: GamesZoneDifficulty;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracyPercentage: number;
  xpEarned: number;
  durationSeconds: number;
  completedAt: string;
}

export interface GamesZoneLeaderboardEntry {
  rank: number;
  displayName: string;
  studentNumber: string;
  gameId: GamesZoneGameId;
  difficulty: GamesZoneDifficulty;
  highScore: number;
  totalPlays: number;
}
