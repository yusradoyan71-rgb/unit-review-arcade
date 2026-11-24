/**
 * UNIT REVIEW ARCADE — GAMES ZONE SERVICE (PHASE 7A)
 * Version: 7.0.0
 * 
 * Standalone service layer managing gameplay telemetry, high scores,
 * and anti-farming XP rewards for Games Zone.
 * 
 * STRICT CURRICULUM ISOLATION:
 * Games Zone attempts are isolated under 'games_zone' namespace and never
 * alter unit progress, 49-activity curriculum metrics, or topic mastery.
 */

import type { GradeId } from '../types/schema';
import type {
  GamesZoneGameId,
  GamesZoneDifficulty,
  GamesZoneAttemptRecord,
} from '../types/gamesZone';
import { ApiService } from './apiService.ts';

const GAMES_ZONE_ATTEMPTS_PREFIX = 'ura_games_zone_attempts_';
const GAMES_ZONE_DAILY_XP_PREFIX = 'ura_games_zone_daily_xp_';
const GAMES_ZONE_STATS_PREFIX = 'ura_games_zone_stats_';
const GAMES_ZONE_RECENT_QUESTIONS_PREFIX = 'ura_games_zone_recent_';
const RECENT_WINDOW_SIZE = 30; // Max recent questions tracked per student/game/grade/diff

export const MAX_DAILY_GAMES_ZONE_XP = 150; // Daily anti-farming XP cap

export interface GamesZoneStats {
  totalPlays: number;
  totalCorrect: number;
  totalQuestions: number;
  highScores: Record<string, number>; // key: `${gameId}_${difficulty}`
  lastPlayedAt: string;
}

export class GamesZoneService {
  /**
   * Calculate XP earned for a Games Zone session with anti-farming protection.
   */
  public static calculateXpEarned(
    studentNumber: string,
    difficulty: GamesZoneDifficulty,
    correctAnswers: number,
    totalQuestions: number,
    accuracyPercentage: number
  ): { xpEarned: number; isCapped: boolean; dailyXpTotal: number } {
    if (totalQuestions <= 0 || correctAnswers <= 0) {
      return { xpEarned: 0, isCapped: false, dailyXpTotal: this.getTodayXp(studentNumber) };
    }

    // Base XP by difficulty
    let base = 10;
    if (difficulty === 'medium') base = 15;
    if (difficulty === 'hard') base = 20;

    // Accuracy bonus
    let bonus = 0;
    if (accuracyPercentage >= 100) {
      bonus = 10;
    } else if (accuracyPercentage >= 80) {
      bonus = 5;
    }

    // Ratio scale
    const performanceXp = Math.round((base + bonus) * (correctAnswers / totalQuestions));
    const calculatedXp = Math.max(5, Math.min(35, performanceXp));

    // Daily Anti-Farming Cap
    const currentDaily = this.getTodayXp(studentNumber);
    const available = Math.max(0, MAX_DAILY_GAMES_ZONE_XP - currentDaily);
    const awarded = Math.min(calculatedXp, available);
    const isCapped = awarded < calculatedXp;

    return {
      xpEarned: awarded,
      isCapped,
      dailyXpTotal: currentDaily + awarded,
    };
  }

  /**
   * Get total XP earned by a student from Games Zone today.
   */
  public static getTodayXp(studentNumber: string): number {
    if (!studentNumber) return 0;
    try {
      const today = new Date().toISOString().split('T')[0];
      const key = `${GAMES_ZONE_DAILY_XP_PREFIX}${studentNumber}_${today}`;
      const val = localStorage.getItem(key);
      return val ? parseInt(val, 10) || 0 : 0;
    } catch {
      return 0;
    }
  }

  /**
   * Add XP to today's Games Zone ledger for anti-farming check.
   */
  private static recordDailyXp(studentNumber: string, xp: number): void {
    if (!studentNumber || xp <= 0) return;
    try {
      const today = new Date().toISOString().split('T')[0];
      const key = `${GAMES_ZONE_DAILY_XP_PREFIX}${studentNumber}_${today}`;
      const current = this.getTodayXp(studentNumber);
      localStorage.setItem(key, String(current + xp));
    } catch {
      // Storage unavailable
    }
  }

  /**
   * Save a completed Games Zone gameplay attempt.
   */
  public static saveAttempt(attempt: GamesZoneAttemptRecord): void {
    try {
      const studentKey = attempt.studentNumber || 'guest';

      // Strict Grade Guard: authenticated students cannot record attempts or XP for the other grade
      if (studentKey !== 'guest') {
        const cls = String(attempt.class || '').trim().toUpperCase();
        if (cls.startsWith('7') && attempt.gradeId !== 'grade-7') {
          console.warn('[GamesZoneService] Rejected cross-grade attempt for Grade 7 student');
          return;
        }
        if (cls.startsWith('8') && attempt.gradeId !== 'grade-8') {
          console.warn('[GamesZoneService] Rejected cross-grade attempt for Grade 8 student');
          return;
        }
      }

      const storageKey = `${GAMES_ZONE_ATTEMPTS_PREFIX}${studentKey}`;
      
      const existingRaw = localStorage.getItem(storageKey);
      const attempts: GamesZoneAttemptRecord[] = existingRaw ? JSON.parse(existingRaw) : [];
      
      attempts.unshift(attempt);
      // Keep up to 50 recent records per student
      if (attempts.length > 50) {
        attempts.length = 50;
      }
      localStorage.setItem(storageKey, JSON.stringify(attempts));

      // Record daily XP
      if (attempt.xpEarned > 0) {
        this.recordDailyXp(studentKey, attempt.xpEarned);
      }

      // Update personal stats & high score
      this.updateStats(studentKey, attempt);

      // Async backend telemetry dispatch (Strictly non-blocking & isolated)
      this.syncAttemptToBackend(attempt).catch(() => {
        // Silently preserve local record if offline or unauthenticated
      });
    } catch (e) {
      console.warn('[GamesZoneService] Failed to save attempt locally:', e);
    }
  }

  /**
   * Update student cumulative stats and high scores.
   */
  private static updateStats(studentKey: string, attempt: GamesZoneAttemptRecord): void {
    try {
      const statsKey = `${GAMES_ZONE_STATS_PREFIX}${studentKey}`;
      const raw = localStorage.getItem(statsKey);
      const stats: GamesZoneStats = raw ? JSON.parse(raw) : {
        totalPlays: 0,
        totalCorrect: 0,
        totalQuestions: 0,
        highScores: {},
        lastPlayedAt: '',
      };

      stats.totalPlays += 1;
      stats.totalCorrect += attempt.correctAnswers;
      stats.totalQuestions += attempt.totalQuestions;
      stats.lastPlayedAt = attempt.completedAt;

      const scoreKey = `${attempt.gameId}_${attempt.difficulty}`;
      const currentHigh = stats.highScores[scoreKey] || 0;
      if (attempt.score > currentHigh) {
        stats.highScores[scoreKey] = attempt.score;
      }

      localStorage.setItem(statsKey, JSON.stringify(stats));
    } catch {
      // Ignore storage errors
    }
  }

  /**
   * Retrieve high score for a specific game and difficulty.
   */
  public static getPersonalHighScore(
    studentNumber: string,
    gameId: GamesZoneGameId,
    difficulty: GamesZoneDifficulty
  ): number {
    try {
      const studentKey = studentNumber || 'guest';
      const statsKey = `${GAMES_ZONE_STATS_PREFIX}${studentKey}`;
      const raw = localStorage.getItem(statsKey);
      if (!raw) return 0;
      const stats: GamesZoneStats = JSON.parse(raw);
      return stats.highScores[`${gameId}_${difficulty}`] || 0;
    } catch {
      return 0;
    }
  }

  /**
   * Retrieve all recent attempts for a student.
   */
  public static getStudentAttempts(studentNumber: string): GamesZoneAttemptRecord[] {
    try {
      const studentKey = studentNumber || 'guest';
      const storageKey = `${GAMES_ZONE_ATTEMPTS_PREFIX}${studentKey}`;
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  /**
   * Sync attempt to Google Apps Script backend under 'games_zone' unit namespace.
   * NEVER interferes with unit curriculum tracking.
   */
  private static async syncAttemptToBackend(attempt: GamesZoneAttemptRecord): Promise<void> {
    if (!attempt.studentNumber || attempt.studentNumber === 'guest') {
      return;
    }

    try {
      const apiUrl = ApiService.getApiUrl();
      const payload = {
        action: 'game_complete_attempt',
        student_number: attempt.studentNumber,
        class: attempt.class || '',
        unit_id: 'games_zone',
        activity_id: `gz_${attempt.gameId}`,
        difficulty: attempt.difficulty,
        score: attempt.score,
        total_questions: attempt.totalQuestions,
        correct_answers: attempt.correctAnswers,
        incorrect_answers: attempt.incorrectAnswers,
        accuracy_percentage: attempt.accuracyPercentage,
        xp_earned: attempt.xpEarned,
        duration_seconds: attempt.durationSeconds,
      };

      await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
        redirect: 'follow',
      });
    } catch (e) {
      // Offline or network error - attempt is safely preserved locally
    }
  }

  /**
   * Retrieves recent question IDs for student/game/grade/difficulty.
   */
  public static getRecentQuestionIds(
    studentNumber: string = 'guest',
    gameId: GamesZoneGameId,
    gradeId: GradeId,
    difficulty: GamesZoneDifficulty
  ): string[] {
    try {
      const studentKey = studentNumber || 'guest';
      const storageKey = `${GAMES_ZONE_RECENT_QUESTIONS_PREFIX}${studentKey}_${gameId}_${gradeId}_${difficulty}`;
      const raw = localStorage.getItem(storageKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  /**
   * Records newly encountered question IDs into the sliding FIFO window.
   */
  public static recordRecentQuestionIds(
    studentNumber: string = 'guest',
    gameId: GamesZoneGameId,
    gradeId: GradeId,
    difficulty: GamesZoneDifficulty,
    questionIds: string[]
  ): void {
    if (!questionIds || questionIds.length === 0) return;
    try {
      const studentKey = studentNumber || 'guest';
      const storageKey = `${GAMES_ZONE_RECENT_QUESTIONS_PREFIX}${studentKey}_${gameId}_${gradeId}_${difficulty}`;
      const current = this.getRecentQuestionIds(studentKey, gameId, gradeId, difficulty);
      // Prepend newest IDs and deduplicate preserving order
      const combined = [...questionIds, ...current.filter((id) => !questionIds.includes(id))];
      if (combined.length > RECENT_WINDOW_SIZE) {
        combined.length = RECENT_WINDOW_SIZE;
      }
      localStorage.setItem(storageKey, JSON.stringify(combined));
    } catch {
      // Storage unavailable
    }
  }

  /**
   * Resets recent question history for testing or manual refresh.
   */
  public static clearRecentQuestionIds(
    studentNumber: string = 'guest',
    gameId: GamesZoneGameId,
    gradeId: GradeId,
    difficulty: GamesZoneDifficulty
  ): void {
    try {
      const studentKey = studentNumber || 'guest';
      const storageKey = `${GAMES_ZONE_RECENT_QUESTIONS_PREFIX}${studentKey}_${gameId}_${gradeId}_${difficulty}`;
      localStorage.removeItem(storageKey);
    } catch {
      // Storage unavailable
    }
  }
}
