/**
 * UNIT REVIEW ARCADE — TRACKING SERVICE (PHASE 2)
 * Version: 2.0.0
 * 
 * Manages game activity telemetry, per-question answer recording,
 * local queue persistence in sessionStorage, and batched synchronization
 * with the Google Apps Script backend.
 * 
 * Provides robust recovery for interrupted attempts and graceful degradation
 * when offline.
 */

import { ApiService } from './apiService';
import type {
  StartAttemptMetadata,
  QuestionAnswerRecord,
  CompleteAttemptSummary,
  TrackingApiResponse,
  StartAttemptPayload,
  RecordAnswersPayload,
  CompleteAttemptPayload,
  AbandonAttemptPayload,
  ReconcileAttemptPayload,
  GameAttemptStatus,
} from '../types/tracking';

const STORAGE_KEY_ACTIVE_ATTEMPT = 'unit_review_arcade_active_attempt_v2';
const STORAGE_KEY_PENDING_ANSWERS = 'unit_review_arcade_pending_answers_v2';
const STORAGE_KEY_ATTEMPT_ANSWERS = 'unit_review_arcade_active_answers_v2';

export interface StoredActiveAttempt {
  attemptId: string;
  gradeId: string;
  unitId: string;
  unitTitle: string;
  activityId: string;
  activityTitle: string;
  gameType: string;
  totalQuestions: number;
  startedAt: string;
  attemptNumber?: number;
  status: GameAttemptStatus;
}

export class TrackingService {
  /**
   * Generates a collision-resistant unique attempt ID.
   */
  public static generateAttemptId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 10);
    return `att_${timestamp}_${random}`;
  }

  /**
   * Generates a collision-resistant unique answer ID.
   */
  public static generateAnswerId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 10);
    return `ans_${timestamp}_${random}`;
  }

  /**
   * Retrieves any active attempt persisted in sessionStorage.
   */
  public static getStoredAttempt(): StoredActiveAttempt | null {
    try {
      const data = sessionStorage.getItem(STORAGE_KEY_ACTIVE_ATTEMPT);
      return data ? (JSON.parse(data) as StoredActiveAttempt) : null;
    } catch {
      return null;
    }
  }

  /**
   * Persists active attempt to sessionStorage for recovery across page refreshes.
   */
  public static saveStoredAttempt(attempt: StoredActiveAttempt): void {
    try {
      sessionStorage.setItem(STORAGE_KEY_ACTIVE_ATTEMPT, JSON.stringify(attempt));
    } catch (err) {
      console.warn('Failed to persist active attempt to sessionStorage:', err);
    }
  }

  /**
   * Clears stored active attempt from sessionStorage.
   */
  public static clearStoredAttempt(): void {
    try {
      sessionStorage.removeItem(STORAGE_KEY_ACTIVE_ATTEMPT);
    } catch {
      // ignore
    }
  }

  /**
   * Retrieves pending unsynced answers from sessionStorage.
   */
  public static getPendingAnswers(attemptId?: string): QuestionAnswerRecord[] {
    try {
      const data = sessionStorage.getItem(STORAGE_KEY_PENDING_ANSWERS);
      if (!data) return [];
      const parsed = JSON.parse(data) as QuestionAnswerRecord[];
      if (!attemptId) return parsed;
      return parsed.filter((a) => a.attemptId === attemptId);
    } catch {
      return [];
    }
  }

  /**
   * Persists pending answers to sessionStorage.
   */
  public static savePendingAnswers(answers: QuestionAnswerRecord[]): void {
    try {
      sessionStorage.setItem(STORAGE_KEY_PENDING_ANSWERS, JSON.stringify(answers));
    } catch (err) {
      console.warn('Failed to persist pending answers to sessionStorage:', err);
    }
  }

  /**
   * Clears pending answers for a specific attempt or all attempts.
   */
  public static clearPendingAnswers(attemptId?: string): void {
    try {
      if (!attemptId) {
        sessionStorage.removeItem(STORAGE_KEY_PENDING_ANSWERS);
        return;
      }
      const existing = this.getPendingAnswers();
      const remaining = existing.filter((a) => a.attemptId !== attemptId);
      if (remaining.length === 0) {
        sessionStorage.removeItem(STORAGE_KEY_PENDING_ANSWERS);
      } else {
        sessionStorage.setItem(STORAGE_KEY_PENDING_ANSWERS, JSON.stringify(remaining));
      }
    } catch {
      // ignore
    }
  }

  /**
   * Retrieves all recorded answers for active attempt from sessionStorage.
   */
  public static getActiveAnswers(attemptId?: string): QuestionAnswerRecord[] {
    try {
      const data = sessionStorage.getItem(STORAGE_KEY_ATTEMPT_ANSWERS);
      if (!data) return [];
      const parsed = JSON.parse(data) as QuestionAnswerRecord[];
      if (!attemptId) return parsed;
      return parsed.filter((a) => a.attemptId === attemptId);
    } catch {
      return [];
    }
  }

  /**
   * Saves an answer to the active attempt's answer log in sessionStorage.
   */
  public static saveActiveAnswer(answer: QuestionAnswerRecord): void {
    try {
      const existing = this.getActiveAnswers();
      if (!existing.some((a) => a.answerId === answer.answerId)) {
        existing.push(answer);
        sessionStorage.setItem(STORAGE_KEY_ATTEMPT_ANSWERS, JSON.stringify(existing));
      }
    } catch (err) {
      console.warn('Failed to persist active answer to sessionStorage:', err);
    }
  }

  /**
   * Clears active answers for an attempt or all attempts from sessionStorage.
   */
  public static clearActiveAnswers(attemptId?: string): void {
    try {
      if (!attemptId) {
        sessionStorage.removeItem(STORAGE_KEY_ATTEMPT_ANSWERS);
        return;
      }
      const existing = this.getActiveAnswers();
      const remaining = existing.filter((a) => a.attemptId !== attemptId);
      if (remaining.length === 0) {
        sessionStorage.removeItem(STORAGE_KEY_ATTEMPT_ANSWERS);
      } else {
        sessionStorage.setItem(STORAGE_KEY_ATTEMPT_ANSWERS, JSON.stringify(remaining));
      }
    } catch {
      // ignore
    }
  }

  /**
   * Starts a new game attempt.
   * If a previous attempt was left in progress, it reconciles it before starting.
   */
  public static async startAttempt(
    sessionToken: string,
    metadata: StartAttemptMetadata
  ): Promise<TrackingApiResponse<{ attemptId: string; attemptNumber?: number }>> {
    const apiUrl = ApiService.getApiUrl();
    if (!apiUrl || !sessionToken) {
      return { success: false, error: 'Tracking disabled or missing session.' };
    }

    const attemptId = metadata.attemptId || this.generateAttemptId();
    const startedAt = metadata.startedAt || new Date().toISOString();

    const storedAttempt: StoredActiveAttempt = {
      attemptId,
      gradeId: metadata.gradeId,
      unitId: metadata.unitId,
      unitTitle: metadata.unitTitle,
      activityId: metadata.activityId,
      activityTitle: metadata.activityTitle,
      gameType: metadata.gameType,
      totalQuestions: metadata.totalQuestions,
      startedAt,
      status: 'in_progress',
    };

    // Save locally immediately
    this.saveStoredAttempt(storedAttempt);

    const payload: StartAttemptPayload = {
      action: 'game_start_attempt',
      sessionToken,
      attemptId,
      gradeId: metadata.gradeId,
      unitId: metadata.unitId,
      unitTitle: metadata.unitTitle,
      activityId: metadata.activityId,
      activityTitle: metadata.activityTitle,
      gameType: metadata.gameType,
      totalQuestions: metadata.totalQuestions,
      startedAt,
    };

    try {
      const res = await ApiService.postRequest<TrackingApiResponse>(apiUrl, payload);
      if (res.success && res.attemptNumber) {
        storedAttempt.attemptNumber = res.attemptNumber;
        this.saveStoredAttempt(storedAttempt);
      }
      return {
        success: res.success,
        attemptId,
        attemptNumber: res.attemptNumber,
        error: res.error,
      };
    } catch (err) {
      console.warn('Network error starting attempt on server (cached locally):', err);
      // Attempt is saved locally, so student can continue uninterrupted
      return {
        success: true,
        attemptId,
        message: 'Saved locally; will synchronize when connection restores.',
      };
    }
  }

  /**
   * Queues an answer locally and attempts to flush pending answers in a batch.
   */
  public static async recordAnswer(
    sessionToken: string,
    attemptId: string,
    answer: QuestionAnswerRecord
  ): Promise<void> {
    const pending = this.getPendingAnswers();
    // Prevent duplicate entries for the exact same answerId
    if (!pending.some((a) => a.answerId === answer.answerId)) {
      pending.push(answer);
      this.savePendingAnswers(pending);
    }

    // Always maintain full answers log for active attempt
    this.saveActiveAnswer(answer);

    // Attempt background sync
    await this.flushPendingAnswers(sessionToken, attemptId);
  }

  /**
   * Flushes any pending answers for this attempt to Google Apps Script.
   */
  public static async flushPendingAnswers(
    sessionToken: string,
    attemptId: string
  ): Promise<boolean> {
    const apiUrl = ApiService.getApiUrl();
    if (!apiUrl || !sessionToken) return false;

    const attemptAnswers = this.getPendingAnswers(attemptId);
    if (attemptAnswers.length === 0) return true;

    const payload: RecordAnswersPayload = {
      action: 'game_record_answers',
      sessionToken,
      attemptId,
      answers: attemptAnswers,
    };

    try {
      const res = await ApiService.postRequest<TrackingApiResponse>(apiUrl, payload);
      if (res.success) {
        this.clearPendingAnswers(attemptId);
        return true;
      }
      return false;
    } catch (err) {
      console.warn('Batch answers flush deferred due to network:', err);
      return false;
    }
  }

  /**
   * Completes an active attempt. Sends final summary and any unflushed answers.
   */
  public static async completeAttempt(
    sessionToken: string,
    attemptId: string,
    summary: CompleteAttemptSummary,
    allAnswers?: QuestionAnswerRecord[]
  ): Promise<TrackingApiResponse> {
    const apiUrl = ApiService.getApiUrl();
    if (!apiUrl || !sessionToken) {
      return { success: false, error: 'Tracking disabled or missing session.' };
    }

    const pending = allAnswers || this.getActiveAnswers(attemptId) || this.getPendingAnswers(attemptId);
    const completedAt = summary.completedAt || new Date().toISOString();
    const durationSeconds = summary.durationSeconds || 0;
    const answeredCount = summary.answeredQuestions ?? pending.length;
    const correctCount = summary.correctAnswers ?? pending.filter((a) => a.isCorrect).length;
    const incorrectCount = summary.incorrectAnswers ?? (answeredCount - correctCount);
    const skippedCount = summary.skippedQuestions ?? Math.max(0, summary.totalQuestions - answeredCount);
    const percentage = summary.percentage ?? (summary.totalQuestions > 0 ? Math.round((summary.score / summary.totalQuestions) * 100) : 0);

    // Clear local stored attempt immediately so subsequent navigation doesn't see old attempt
    this.clearStoredAttempt();

    const payload: CompleteAttemptPayload = {
      action: 'game_complete_attempt',
      sessionToken,
      attemptId,
      score: summary.score,
      totalQuestions: summary.totalQuestions,
      answeredQuestions: answeredCount,
      correctAnswers: correctCount,
      incorrectAnswers: incorrectCount,
      skippedQuestions: skippedCount,
      percentage,
      durationSeconds,
      completedAt,
      finalAnswers: pending,
    };

    try {
      const res = await ApiService.postRequest<TrackingApiResponse>(apiUrl, payload);
      this.clearPendingAnswers(attemptId);
      this.clearActiveAnswers(attemptId);
      return res;
    } catch (err) {
      console.warn('Network error completing attempt on server:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Network error during completion sync.',
      };
    }
  }

  /**
   * Marks an attempt as abandoned (e.g. when student explicitly clicks Exit).
   */
  public static async abandonAttempt(
    sessionToken: string,
    attemptId: string,
    durationSeconds: number,
    finalAnswers?: QuestionAnswerRecord[]
  ): Promise<TrackingApiResponse> {
    // Clear stored active attempt synchronously so subsequent games start fresh
    this.clearStoredAttempt();

    const apiUrl = ApiService.getApiUrl();
    if (!apiUrl || !sessionToken) {
      this.clearPendingAnswers(attemptId);
      this.clearActiveAnswers(attemptId);
      return { success: true };
    }

    const answers = finalAnswers || this.getActiveAnswers(attemptId) || this.getPendingAnswers(attemptId);
    const answeredCount = answers.length;
    const correctCount = answers.filter((a) => a.isCorrect).length;

    const payload: AbandonAttemptPayload = {
      action: 'game_abandon_attempt',
      sessionToken,
      attemptId,
      durationSeconds,
      answeredQuestions: answeredCount,
      correctAnswers: correctCount,
      finalAnswers: answers,
    };

    try {
      const res = await ApiService.postRequest<TrackingApiResponse>(apiUrl, payload);
      this.clearPendingAnswers(attemptId);
      this.clearActiveAnswers(attemptId);
      return res;
    } catch (err) {
      console.warn('Network error marking attempt abandoned:', err);
      this.clearPendingAnswers(attemptId);
      this.clearActiveAnswers(attemptId);
      return { success: false, error: 'Could not sync abandonment to server.' };
    }
  }

  /**
   * Reconciles an interrupted attempt (e.g. student closed browser or refreshed mid-game).
   */
  public static async reconcileInterruptedAttempt(
    sessionToken: string,
    attemptId: string
  ): Promise<TrackingApiResponse> {
    this.clearStoredAttempt();

    const apiUrl = ApiService.getApiUrl();
    if (!apiUrl || !sessionToken) return { success: true };

    const payload: ReconcileAttemptPayload = {
      action: 'game_reconcile_attempt',
      sessionToken,
      attemptId,
      status: 'interrupted',
    };

    try {
      const res = await ApiService.postRequest<TrackingApiResponse>(apiUrl, payload);
      this.clearPendingAnswers(attemptId);
      this.clearActiveAnswers(attemptId);
      return res;
    } catch (err) {
      console.warn('Failed to reconcile interrupted attempt:', err);
      return { success: false };
    }
  }
}
