/**
 * UNIT REVIEW ARCADE — QUESTION BANK & TWO-SECTION ARCHITECTURE TYPES (PHASE 1)
 * Version: 1.0.0
 * 
 * Type definitions for the Central Question Bank Manager supporting:
 * - Unit Review (Curriculum-aligned practice)
 * - General English (Independent skill & topic practice)
 * - Three Question Pool Modes (Unit Review, General English, Configurable Mixed Practice)
 */

import type { GameType, GradeId } from './schema';
import type { TeacherAuthErrorCode } from './teacher';

export type LearningSection = 'unit_review' | 'general_english' | 'both';

export type EnglishSkill = 'grammar' | 'vocabulary' | 'reading' | 'listening';

export type QuestionDifficulty = 'easy' | 'medium' | 'challenging';

export type QuestionType =
  | 'multiple_choice'
  | 'match_it'
  | 'sentence_builder'
  | 'true_false'
  | 'reading_passage'
  | 'vocabulary_item'
  | 'train_station';

export type QuestionStatus = 'active' | 'draft' | 'archived';

export type QuestionPoolMode = 'unit_review' | 'general_english' | 'mixed_practice';

/**
 * Configurable Mixed Practice ratio between Unit Review and General English questions.
 * Defaults to 50% / 50%, but allows teacher or student customization (e.g. 70/30, 30/70).
 */
export interface MixedPracticeRatio {
  unitPercentage: number;     // e.g. 50 (default), 70, 30, etc. (0 to 100)
  generalPercentage: number;  // e.g. 50 (default), 30, 70, etc. (0 to 100)
}

export const DEFAULT_MIXED_PRACTICE_RATIO: MixedPracticeRatio = {
  unitPercentage: 50,
  generalPercentage: 50,
};

export const PRESET_MIXED_PRACTICE_RATIOS: Array<{
  label: string;
  description: string;
  ratio: MixedPracticeRatio;
}> = [
  {
    label: 'Balanced (50/50)',
    description: 'Equal mix of current unit review and general English questions.',
    ratio: { unitPercentage: 50, generalPercentage: 50 },
  },
  {
    label: 'Unit Focused (70/30)',
    description: '70% textbook unit questions with 30% general skill reinforcement.',
    ratio: { unitPercentage: 70, generalPercentage: 30 },
  },
  {
    label: 'General Skill Focused (30/70)',
    description: '30% unit review with 70% expansive general English practice.',
    ratio: { unitPercentage: 30, generalPercentage: 70 },
  },
  {
    label: 'Heavy Unit Mastery (80/20)',
    description: '80% textbook unit questions for imminent exam review.',
    ratio: { unitPercentage: 80, generalPercentage: 20 },
  },
];

/**
 * Structured content payload by question type.
 */
export interface QuestionPayload {
  // Multiple Choice / Reading / Train Station
  options?: string[];
  correctOptionIndex?: number;

  // Match It
  pairs?: Array<{ id: string; left: string; right: string }>;

  // Sentence Builder
  correctSentence?: string;
  scrambledWords?: string[];
  acceptedAnswers?: string[];
  alternativeValidSentences?: string[];

  // True / False
  isTrue?: boolean;

  // Reading Passage
  passageId?: string;
  passageTitle?: string;
  passageText?: string;

  // Vocabulary Items (Word Ninja, Word Fishing, Invaders)
  targetWord?: string;
  distractorWords?: string[];
  promptType?: 'meaning' | 'synonym' | 'antonym' | 'past_tense' | 'spelling' | 'category';

  // Listening / Dictation
  audioUrl?: string;
  speechText?: string;
  correctTranscript?: string;

  // Train Station
  round?: number;
  roundTitle?: string;
  highlightTrainId?: string;
  dialogue?: Array<{ speaker: string; text: string }>;
}

export interface QuestionAccuracyStats {
  timesAnswered: number;
  correctCount: number;
  incorrectCount: number;
  accuracyRate: number;
  distinctStudentsCount?: number;
  calibratedDifficulty?: QuestionDifficulty;
}

/**
 * Authoritative Question Bank Item model.
 */
export interface QuestionBankItem {
  id: string;
  section: LearningSection;
  gradeId: GradeId | 'all';
  unitId?: string;
  unitTitle?: string;
  topic: string;
  skill: EnglishSkill;
  difficulty: QuestionDifficulty;
  questionType: QuestionType;
  assignedGameTypes: GameType[];
  prompt: string;
  payload: QuestionPayload;
  correctAnswerPreview: string;
  explanation?: string;
  points: number;
  tags: string[];
  status: QuestionStatus;
  contentVersion: number;
  createdAt: string;
  updatedAt: string;
  author?: string;
  importBatchId?: string;
  stats?: QuestionAccuracyStats;
}

/**
 * Filter and query options for Question Bank browsing.
 */
export interface QuestionBankFilterOptions {
  section?: LearningSection | 'all';
  gradeId?: GradeId | 'all';
  unitId?: string;
  skill?: EnglishSkill | 'all';
  topic?: string;
  difficulty?: QuestionDifficulty | 'all';
  questionType?: QuestionType | 'all';
  gameType?: GameType | 'all';
  status?: QuestionStatus | 'all';
  searchQuery?: string;
  limit?: number;
  offset?: number;
}

// ---------------------------------------------------------------------------
// TEACHER API PAYLOADS & RESPONSES
// ---------------------------------------------------------------------------

export interface TeacherGetQuestionBankResponse {
  success: boolean;
  count?: number;
  total?: number;
  questions?: QuestionBankItem[];
  error?: string;
  code?: TeacherAuthErrorCode;
}

export interface TeacherSaveQuestionPayload {
  teacherToken: string;
  question: Partial<QuestionBankItem> & {
    prompt: string;
    questionType: QuestionType;
    skill: EnglishSkill;
    topic: string;
    section: LearningSection;
    assignedGameTypes: GameType[];
    payload: QuestionPayload;
  };
}

export interface TeacherSaveQuestionResponse {
  success: boolean;
  question?: QuestionBankItem;
  created?: boolean;
  updated?: boolean;
  error?: string;
  code?: TeacherAuthErrorCode;
}

export interface TeacherBulkImportQuestionsPayload {
  teacherToken: string;
  importBatchId?: string;
  questions: Array<Partial<QuestionBankItem> & {
    prompt: string;
    questionType: QuestionType;
    skill: EnglishSkill;
    topic: string;
    section: LearningSection;
    assignedGameTypes: GameType[];
    payload: QuestionPayload;
  }>;
  overwriteDuplicates?: boolean;
}

export interface TeacherBulkImportQuestionsResponse {
  success: boolean;
  count?: number;
  importedCount?: number;
  updatedCount?: number;
  skippedCount?: number;
  importBatchId?: string;
  importedIds?: string[];
  error?: string;
  code?: TeacherAuthErrorCode;
}

export interface TeacherRollbackQuestionImportPayload {
  teacherToken: string;
  importBatchId?: string;
  questionIds?: string[];
}

export interface TeacherRollbackQuestionImportResponse {
  success: boolean;
  rolledBackCount?: number;
  rolledBackIds?: string[];
  message?: string;
  error?: string;
  code?: TeacherAuthErrorCode;
}

export interface TeacherArchiveQuestionResponse {
  success: boolean;
  archivedId?: string;
  status?: QuestionStatus;
  error?: string;
  code?: TeacherAuthErrorCode;
}

/**
 * Question Pool Selection Configuration for runtime game sessions.
 */
export interface QuestionPoolConfig {
  mode: QuestionPoolMode;
  unitId?: string;
  gradeId?: GradeId;
  skill?: EnglishSkill;
  topic?: string;
  mixedRatio?: MixedPracticeRatio;
  limit?: number;
}

