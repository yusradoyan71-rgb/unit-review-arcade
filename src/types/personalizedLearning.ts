/**
 * UNIT REVIEW ARCADE — PERSONALIZED LEARNING TYPES (PHASE 6)
 * Version: 6.0.0
 * 
 * Defines schemas for:
 * 1. My Mistakes (tracking, review, and retry of missed questions)
 * 2. Smart Review (adaptive session generation from verified questions)
 * 3. Topic Mastery (progress, accuracy, and skill analytics by unit & grade)
 * 4. Pedagogical Explanations across all game types
 */

import type { GradeId, GameType, AnyQuestion } from './schema';
import type { StudentClass } from './auth';

export type MasteryStatus = 'needs_practice' | 'developing' | 'mastered';

/**
 * Telemetry record for a question answered incorrectly by the student,
 * enriched with curriculum context and correction status.
 */
export interface StudentMistakeRecord {
  mistakeId: string;
  answerId: string;
  attemptId: string;
  studentNumber: string;
  class: StudentClass | string;
  gradeId: GradeId;
  unitId: string;
  unitTitle: string;
  activityId: string;
  activityTitle: string;
  gameType: GameType;
  questionId: string;
  questionOrder: number;
  questionPrompt: string;
  studentResponse: string;
  correctAnswer: string;
  explanation: string;
  timestamp: string;
  isCorrected: boolean;
  correctedAt: string | null;
  retryAttemptsCount: number;
  contentVersion?: number;
  isSuperseded?: boolean;
}

/**
 * Skill or learning objective mastery metric within a unit.
 */
export interface SkillMasteryItem {
  skillId: string;
  skillName: string;
  totalAnswered: number;
  correctCount: number;
  accuracyPercentage: number;
  status: MasteryStatus;
}

/**
 * Specific activity or topic area within a unit identified as needing practice.
 */
export interface AreaNeedingPractice {
  activityId: string;
  activityTitle: string;
  gameType: GameType;
  totalAttempts: number;
  accuracyPercentage: number;
  mistakeCount: number;
  lastAttemptedAt: string | null;
}

/**
 * Mastery progress for a single curriculum unit.
 */
export interface UnitTopicMastery {
  unitId: string;
  unitNumber: number;
  unitTitle: string;
  gradeId: GradeId;
  totalActivities: number;
  completedActivities: number;
  totalQuestionsAnswered: number;
  correctAnswersCount: number;
  accuracyPercentage: number;
  masteryLevel: MasteryStatus;
  skills: SkillMasteryItem[];
  areasNeedingPractice: AreaNeedingPractice[];
  firstAttemptAccuracy?: number;
  latestAttemptAccuracy?: number;
  historicalImprovementPercentage: number;
}

/**
 * Comprehensive student mastery progress separated by Grade 7 and Grade 8.
 */
export interface StudentTopicMasteryOverview {
  studentNumber: string;
  displayName: string;
  class: StudentClass | string;
  overallAccuracy: number;
  totalMistakesCount: number;
  correctedMistakesCount: number;
  grade7: {
    units: UnitTopicMastery[];
    totalActivitiesCompleted: number;
    overallAccuracy: number;
    masteredUnitsCount: number;
  };
  grade8: {
    units: UnitTopicMastery[];
    totalActivitiesCompleted: number;
    overallAccuracy: number;
    masteredUnitsCount: number;
  };
  lastCalculatedAt: string;
}

/**
 * Metadata for a question included in a Smart Review session.
 */
export interface SmartReviewQuestionMeta {
  questionId: string;
  unitId: string;
  unitTitle: string;
  activityId: string;
  activityTitle: string;
  gameType: GameType;
  originalMistakeId?: string;
  isFromMistake: boolean;
  contentVersion?: number;
  isSuperseded?: boolean;
}

/**
 * A personalized review session assembled strictly from verified curriculum questions.
 * NO AI-generated questions are ever used.
 */
export interface SmartReviewSession {
  sessionId: string;
  title: string;
  gradeId: GradeId;
  unitId?: string;
  targetTopics: string[];
  questions: AnyQuestion[];
  questionMetadata: SmartReviewQuestionMeta[];
  createdAt: string;
  completedAt?: string | null;
  score?: number;
  accuracyPercentage?: number;
  correctedMistakeIds?: string[];
}

/**
 * API response format for student mistakes and mastery endpoints.
 */
export interface PersonalizedLearningApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  error?: string;
  code?: string;
  data?: T;
  mistakes?: StudentMistakeRecord[];
  mastery?: StudentTopicMasteryOverview;
  reviewSession?: SmartReviewSession;
}
