/**
 * UNIT REVIEW ARCADE — GAME ACTIVITY TRACKING TYPES (PHASE 2)
 * Version: 2.0.0
 * 
 * Defines schemas for game attempts, per-question telemetry,
 * and Google Apps Script tracking API interactions.
 */

import type { GameType } from './schema';
import type { StudentClass } from './auth';

export type GameAttemptStatus = 'in_progress' | 'completed' | 'abandoned' | 'interrupted';

/**
 * High-level attempt summary record stored in the 'Attempts' sheet.
 */
export interface GameAttemptRecord {
  attemptId: string;
  sessionId: string;
  studentId: string;
  studentNumber: string;
  class: StudentClass;
  gradeId: string;
  unitId: string;
  unitTitle: string;
  activityId: string;
  activityTitle: string;
  gameType: GameType;
  attemptNumber: number;
  score: number;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedQuestions: number;
  percentage: number;
  startedAt: string;
  completedAt: string | null;
  durationSeconds: number;
  status: GameAttemptStatus;
}

/**
 * Detailed telemetry record for a single question or interaction,
 * stored in the 'Answers' sheet.
 */
export interface QuestionAnswerRecord {
  answerId: string;
  attemptId: string;
  questionId: string;
  questionOrder: number;
  questionPrompt: string;
  studentResponse: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpentSeconds: number;
  timestamp: string;
}

/**
 * Metadata passed to start a new attempt.
 */
export interface StartAttemptMetadata {
  attemptId?: string;
  gradeId: string;
  unitId: string;
  unitTitle: string;
  activityId: string;
  activityTitle: string;
  gameType: GameType;
  totalQuestions: number;
  startedAt?: string;
}

/**
 * Metadata passed upon completion or early exit of a game.
 */
export interface CompleteAttemptSummary {
  score: number;
  totalQuestions: number;
  answeredQuestions?: number;
  correctAnswers?: number;
  incorrectAnswers?: number;
  skippedQuestions?: number;
  percentage?: number;
  durationSeconds?: number;
  completedAt?: string;
}

/**
 * API Request & Response interfaces for Google Apps Script
 */
export interface TrackingApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  error?: string;
  code?: string;
  attemptId?: string;
  attemptNumber?: number;
  data?: T;
}

export interface StartAttemptPayload {
  action: 'game_start_attempt';
  sessionToken: string;
  attemptId: string;
  gradeId: string;
  unitId: string;
  unitTitle: string;
  activityId: string;
  activityTitle: string;
  gameType: GameType;
  totalQuestions: number;
  startedAt: string;
}

export interface RecordAnswersPayload {
  action: 'game_record_answers';
  sessionToken: string;
  attemptId: string;
  answers: QuestionAnswerRecord[];
}

export interface CompleteAttemptPayload {
  action: 'game_complete_attempt';
  sessionToken: string;
  attemptId: string;
  score: number;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedQuestions: number;
  percentage: number;
  durationSeconds: number;
  completedAt: string;
  finalAnswers?: QuestionAnswerRecord[];
}

export interface AbandonAttemptPayload {
  action: 'game_abandon_attempt';
  sessionToken: string;
  attemptId: string;
  durationSeconds: number;
  answeredQuestions?: number;
  correctAnswers?: number;
  finalAnswers?: QuestionAnswerRecord[];
}

export interface ReconcileAttemptPayload {
  action: 'game_reconcile_attempt';
  sessionToken: string;
  attemptId: string;
  status: 'interrupted' | 'abandoned';
}

// ---------------------------------------------------------------------------
// PHASE 4: RESUME, CHECKPOINTING & OFFLINE QUEUE SCHEMAS
// ---------------------------------------------------------------------------

/**
 * Checkpoint saved during gameplay so students can seamlessly resume
 * an interrupted activity across page refreshes, tab closes, or drops.
 */
export interface GameResumeCheckpoint {
  attemptId: string;
  activityId: string;
  gradeId: string;
  unitId: string;
  gameType: GameType;
  currentIndex: number;
  score: number;
  totalQuestions: number;
  answeredQuestionIds: string[];
  shuffledQuestionIds?: string[];
  currentRoundIndex?: number;
  matchedPairIds?: string[];
  completedSentenceIndices?: number[];
  timestamp: number;
  durationSeconds: number;
}

/**
 * Queue record for completed attempts awaiting server confirmation
 * when network is temporarily disconnected.
 */
export interface PendingAttemptCompletion {
  attemptId: string;
  studentNumber: string;
  payload: CompleteAttemptPayload;
  timestamp: number;
  retryCount: number;
}
