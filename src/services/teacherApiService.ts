/**
 * UNIT REVIEW ARCADE — TEACHER API SERVICE (PHASE 3B)
 * 
 * Provides authenticated, type-safe communication with the Google Apps Script
 * Phase 3A backend for teacher authentication, reporting, and curriculum management.
 * 
 * SECURITY MANDATES:
 * 1. Plaintext passwords are never logged, printed, or persisted.
 * 2. Strict endpoint resolution: fail-closed if dev environment routes to PROD.
 * 3. Every reporting and publishing request includes a verified teacherToken.
 * 4. Deduplicates simultaneous in-flight requests to prevent redundant network calls.
 */

import { ApiService } from './apiService';
import type {
  TeacherLoginResponse,
  TeacherCheckSessionResponse,
  TeacherLogoutResponse,
  TeacherOverviewResponse,
  TeacherRosterResponse,
  TeacherStudentDetailResponse,
  TeacherQuestionAnalyticsResponse,
  TeacherPublishCurriculumResponse,
  CurriculumPublishItem,
  DashboardFilterOptions,
} from '../types/teacher';

export class TeacherApiService {
  // In-flight request deduplication map
  private static inFlightRequests = new Map<string, Promise<unknown>>();

  /**
   * Helper to deduplicate concurrent identical GET/read requests.
   */
  private static async executeDeduplicated<T>(
    cacheKey: string,
    actionFn: () => Promise<T>
  ): Promise<T> {
    const existing = this.inFlightRequests.get(cacheKey);
    if (existing) {
      return existing as Promise<T>;
    }

    const promise = actionFn().finally(() => {
      this.inFlightRequests.delete(cacheKey);
    });

    this.inFlightRequests.set(cacheKey, promise);
    return promise;
  }

  /**
   * Authenticates the teacher using the private master passphrase.
   * Never prints or logs the passphrase.
   */
  public static async login(password: string): Promise<TeacherLoginResponse> {
    const cleanPassword = (password || '').trim();
    if (!cleanPassword) {
      return {
        success: false,
        error: 'Teacher password cannot be empty.',
        code: 'UNAUTHORIZED',
      };
    }

    try {
      const endpoint = ApiService.getTeacherApiUrl();
      const response = await ApiService.postRequest<TeacherLoginResponse>(
        endpoint,
        {
          action: 'teacher_login',
          password: cleanPassword,
          userAgent: navigator.userAgent || 'Web Browser',
        },
        30000 // Extended to 30.0s to allow full 5,000-round GAS execution & cold starts
      );

      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Connection failed';
      return {
        success: false,
        error: `Teacher authentication failed: ${message}`,
        code: message.includes('SECURITY VIOLATION') ? 'ENDPOINT_MISMATCH' : 'NETWORK_ERROR',
      };
    }
  }

  /**
   * Checks whether the current teacher session token is valid and active.
   */
  public static async checkSession(teacherToken: string): Promise<TeacherCheckSessionResponse> {
    const cleanToken = (teacherToken || '').trim();
    if (!cleanToken) {
      return {
        success: false,
        error: 'No teacher session provided.',
        code: 'UNAUTHORIZED',
      };
    }

    try {
      const endpoint = ApiService.getTeacherApiUrl();
      return await ApiService.postRequest<TeacherCheckSessionResponse>(
        endpoint,
        {
          action: 'teacher_check_session',
          teacherToken: cleanToken,
        },
        12000
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Server unreachable';
      return {
        success: false,
        error: `Teacher session check failed: ${message}`,
        code: 'NETWORK_ERROR',
      };
    }
  }

  /**
   * Invalidates the teacher session on the server.
   */
  public static async logout(teacherToken: string): Promise<TeacherLogoutResponse> {
    const cleanToken = (teacherToken || '').trim();
    if (!cleanToken) {
      return { success: true, message: 'Logged out locally.' };
    }

    try {
      const endpoint = ApiService.getTeacherApiUrl();
      return await ApiService.postRequest<TeacherLogoutResponse>(
        endpoint,
        {
          action: 'teacher_logout',
          teacherToken: cleanToken,
        },
        8000
      );
    } catch {
      // Client-side logout should proceed regardless
      return { success: true, message: 'Logged out locally (server notification timed out).' };
    }
  }

  /**
   * Retrieves aggregated KPI metrics and class/unit/game breakdowns.
   */
  public static async getOverview(
    teacherToken: string,
    filters?: DashboardFilterOptions
  ): Promise<TeacherOverviewResponse> {
    const cleanToken = (teacherToken || '').trim();
    if (!cleanToken) {
      return {
        success: false,
        error: 'Authentication required. Please log in as a teacher.',
        code: 'UNAUTHORIZED',
      };
    }

    const cacheKey = `overview_${JSON.stringify(filters || {})}`;

    return this.executeDeduplicated(cacheKey, async () => {
      try {
        const endpoint = ApiService.getTeacherApiUrl();
        return await ApiService.postRequest<TeacherOverviewResponse>(
          endpoint,
          {
            action: 'teacher_get_overview',
            teacherToken: cleanToken,
            filters: filters || {},
          },
          18000
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Server error';
        return {
          success: false,
          error: `Failed to load dashboard overview: ${message}`,
          code: 'NETWORK_ERROR',
        };
      }
    });
  }

  /**
   * Retrieves the student roster with curriculum progress and diagnostic status.
   */
  public static async getRoster(
    teacherToken: string,
    filters?: DashboardFilterOptions
  ): Promise<TeacherRosterResponse> {
    const cleanToken = (teacherToken || '').trim();
    if (!cleanToken) {
      return {
        success: false,
        error: 'Authentication required. Please log in as a teacher.',
        code: 'UNAUTHORIZED',
      };
    }

    const cacheKey = `roster_${JSON.stringify(filters || {})}`;

    return this.executeDeduplicated(cacheKey, async () => {
      try {
        const endpoint = ApiService.getTeacherApiUrl();
        return await ApiService.postRequest<TeacherRosterResponse>(
          endpoint,
          {
            action: 'teacher_get_roster',
            teacherToken: cleanToken,
            filters: filters || {},
          },
          18000
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Server error';
        return {
          success: false,
          error: `Failed to load student roster: ${message}`,
          code: 'NETWORK_ERROR',
        };
      }
    });
  }

  /**
   * Retrieves deep-dive student profile, attempt history, repeated attempt gains, and question logs.
   */
  public static async getStudentDetail(
    teacherToken: string,
    studentNumber: string
  ): Promise<TeacherStudentDetailResponse> {
    const cleanToken = (teacherToken || '').trim();
    const cleanStudentNumber = (studentNumber || '').trim();

    if (!cleanToken) {
      return {
        success: false,
        error: 'Authentication required. Please log in as a teacher.',
        code: 'UNAUTHORIZED',
      };
    }

    if (!cleanStudentNumber) {
      return {
        success: false,
        error: 'Student number is required.',
        code: 'BAD_REQUEST',
      };
    }

    const cacheKey = `student_detail_${cleanStudentNumber}`;

    return this.executeDeduplicated(cacheKey, async () => {
      try {
        const endpoint = ApiService.getTeacherApiUrl();
        return await ApiService.postRequest<TeacherStudentDetailResponse>(
          endpoint,
          {
            action: 'teacher_get_student_detail',
            teacherToken: cleanToken,
            studentNumber: cleanStudentNumber,
          },
          18000
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Server error';
        return {
          success: false,
          error: `Failed to load student details for #${cleanStudentNumber}: ${message}`,
          code: 'NETWORK_ERROR',
        };
      }
    });
  }

  /**
   * Retrieves diagnostic leaderboard of questions, error rates, and common incorrect answers.
   */
  public static async getQuestionAnalytics(
    teacherToken: string,
    filters?: DashboardFilterOptions
  ): Promise<TeacherQuestionAnalyticsResponse> {
    const cleanToken = (teacherToken || '').trim();
    if (!cleanToken) {
      return {
        success: false,
        error: 'Authentication required. Please log in as a teacher.',
        code: 'UNAUTHORIZED',
      };
    }

    const cacheKey = `question_analytics_${JSON.stringify(filters || {})}`;

    return this.executeDeduplicated(cacheKey, async () => {
      try {
        const endpoint = ApiService.getTeacherApiUrl();
        return await ApiService.postRequest<TeacherQuestionAnalyticsResponse>(
          endpoint,
          {
            action: 'teacher_get_question_analytics',
            teacherToken: cleanToken,
            filters: filters || {},
          },
          20000
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Server error';
        return {
          success: false,
          error: `Failed to load question analytics: ${message}`,
          code: 'NETWORK_ERROR',
        };
      }
    });
  }

  /**
   * Publishes authoritative curriculum units and activities to the backend Curriculum catalog.
   */
  public static async publishCurriculum(
    teacherToken: string,
    activities: CurriculumPublishItem[]
  ): Promise<TeacherPublishCurriculumResponse> {
    const cleanToken = (teacherToken || '').trim();
    if (!cleanToken) {
      return {
        success: false,
        error: 'Authentication required. Please log in as a teacher.',
        code: 'UNAUTHORIZED',
      };
    }

    if (!Array.isArray(activities) || activities.length === 0) {
      return {
        success: false,
        error: 'No curriculum activities to publish.',
        code: 'BAD_REQUEST',
      };
    }

    try {
      const endpoint = ApiService.getTeacherApiUrl();
      return await ApiService.postRequest<TeacherPublishCurriculumResponse>(
        endpoint,
        {
          action: 'teacher_publish_curriculum',
          teacherToken: cleanToken,
          activities: activities,
        },
        25000
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Server error';
      return {
        success: false,
        error: `Curriculum publishing failed: ${message}`,
        code: 'NETWORK_ERROR',
      };
    }
  }
}

