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
  TeacherAddStudentPayload,
  TeacherAddStudentResponse,
  TeacherBulkImportItem,
  TeacherBulkImportResponse,
  TeacherUpdateStudentPayload,
  TeacherUpdateStudentResponse,
  TeacherResetPinResponse,
  TeacherBulkResetPinsPayload,
  TeacherBulkResetPinsResponse,
  TeacherSetStudentActiveResponse,
  TeacherDemoAccountsResponse,
  TeacherArchiveDemoResponse,
  TeacherSetAllPinsDefaultResponse,
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
        25000 // Extended to 25.0s to tolerate cold-start GAS latency
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

  // ===========================================================================
  // STUDENT ROSTER MANAGEMENT & CREDENTIALS
  // ===========================================================================

  /**
   * Adds an individual student to the school roster.
   */
  public static async addStudent(
    teacherToken: string,
    student: TeacherAddStudentPayload
  ): Promise<TeacherAddStudentResponse> {
    const cleanToken = (teacherToken || '').trim();
    if (!cleanToken) {
      return {
        success: false,
        error: 'Authentication required. Please log in as a teacher.',
        code: 'UNAUTHORIZED',
      };
    }

    try {
      const endpoint = ApiService.getTeacherApiUrl();
      return await ApiService.postRequest<TeacherAddStudentResponse>(
        endpoint,
        {
          action: 'teacher_add_student',
          teacherToken: cleanToken,
          studentNumber: student.studentNumber,
          fullName: student.fullName,
          class: student.class,
          pin: student.pin,
        },
        18000
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Server error';
      return {
        success: false,
        error: `Failed to add student: ${message}`,
        code: 'NETWORK_ERROR',
      };
    }
  }

  /**
   * Imports multiple students in a single batch.
   */
  public static async bulkImportStudents(
    teacherToken: string,
    students: TeacherBulkImportItem[]
  ): Promise<TeacherBulkImportResponse> {
    const cleanToken = (teacherToken || '').trim();
    if (!cleanToken) {
      return {
        success: false,
        error: 'Authentication required. Please log in as a teacher.',
        code: 'UNAUTHORIZED',
      };
    }

    if (!Array.isArray(students) || students.length === 0) {
      return {
        success: false,
        error: 'No student records to import.',
        code: 'BAD_REQUEST',
      };
    }

    try {
      const endpoint = ApiService.getTeacherApiUrl();
      return await ApiService.postRequest<TeacherBulkImportResponse>(
        endpoint,
        {
          action: 'teacher_bulk_import_students',
          teacherToken: cleanToken,
          students: students,
        },
        30000
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Server error';
      return {
        success: false,
        error: `Bulk import failed: ${message}`,
        code: 'NETWORK_ERROR',
      };
    }
  }

  /**
   * Updates an existing student's name, class assignment, or active status.
   */
  public static async updateStudent(
    teacherToken: string,
    student: TeacherUpdateStudentPayload
  ): Promise<TeacherUpdateStudentResponse> {
    const cleanToken = (teacherToken || '').trim();
    if (!cleanToken) {
      return {
        success: false,
        error: 'Authentication required. Please log in as a teacher.',
        code: 'UNAUTHORIZED',
      };
    }

    try {
      const endpoint = ApiService.getTeacherApiUrl();
      return await ApiService.postRequest<TeacherUpdateStudentResponse>(
        endpoint,
        {
          action: 'teacher_update_student',
          teacherToken: cleanToken,
          studentNumber: student.studentNumber,
          fullName: student.fullName,
          class: student.class,
          isActive: student.isActive,
        },
        18000
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Server error';
      return {
        success: false,
        error: `Failed to update student: ${message}`,
        code: 'NETWORK_ERROR',
      };
    }
  }

  /**
   * Resets a student's PIN and returns the new PIN for distribution.
   */
  public static async resetStudentPin(
    teacherToken: string,
    studentNumber: string,
    newPin?: string
  ): Promise<TeacherResetPinResponse> {
    const cleanToken = (teacherToken || '').trim();
    if (!cleanToken) {
      return {
        success: false,
        error: 'Authentication required. Please log in as a teacher.',
        code: 'UNAUTHORIZED',
      };
    }

    try {
      const endpoint = ApiService.getTeacherApiUrl();
      return await ApiService.postRequest<TeacherResetPinResponse>(
        endpoint,
        {
          action: 'teacher_reset_student_pin',
          teacherToken: cleanToken,
          studentNumber: studentNumber.trim(),
          newPin: newPin ? newPin.trim() : undefined,
        },
        18000
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Server error';
      return {
        success: false,
        error: `PIN reset failed: ${message}`,
        code: 'NETWORK_ERROR',
      };
    }
  }

  /**
   * Generates new unique 4-digit PINs for multiple students in bulk.
   * Invalidates existing student sessions and returns plaintext PINs once to the teacher.
   */
  public static async bulkResetStudentPins(
    teacherToken: string,
    payload: TeacherBulkResetPinsPayload
  ): Promise<TeacherBulkResetPinsResponse> {
    const cleanToken = (teacherToken || '').trim();
    if (!cleanToken) {
      return {
        success: false,
        error: 'Authentication required. Please log in as a teacher.',
        code: 'UNAUTHORIZED',
      };
    }

    try {
      const endpoint = ApiService.getTeacherApiUrl();
      const operationId = payload.operationId || `reset_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      return await ApiService.postRequest<TeacherBulkResetPinsResponse>(
        endpoint,
        {
          action: 'teacher_bulk_reset_student_pins',
          teacherToken: cleanToken,
          studentNumbers: payload.studentNumbers,
          class: payload.class,
          operationId: operationId,
        },
        60000 // 60s timeout allowance with recoverable background guarantee
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Server error';
      return {
        success: false,
        error: `Bulk PIN reset failed: ${message}`,
        code: 'NETWORK_ERROR',
      };
    }
  }

  /**
   * Recovers staged credentials for a recent bulk PIN reset operation.
   * Retrieves encrypted credentials within 15-minute TTL without re-resetting.
   */
  public static async recoverBulkResetCredentials(
    teacherToken: string,
    operationId?: string
  ): Promise<TeacherBulkResetPinsResponse> {
    const cleanToken = (teacherToken || '').trim();
    if (!cleanToken) {
      return {
        success: false,
        error: 'Authentication required. Please log in as a teacher.',
        code: 'UNAUTHORIZED',
      };
    }

    try {
      const endpoint = ApiService.getTeacherApiUrl();
      return await ApiService.postRequest<TeacherBulkResetPinsResponse>(
        endpoint,
        {
          action: 'teacher_recover_bulk_reset_credentials',
          teacherToken: cleanToken,
          operationId: operationId || 'latest',
        },
        20000 // 20s recovery timeout
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Server error';
      return {
        success: false,
        error: `Credential recovery failed: ${message}`,
        code: 'NETWORK_ERROR',
      };
    }
  }

  /**
   * Toggles active / inactive status for a student account.
   */
  public static async setStudentActive(
    teacherToken: string,
    studentNumber: string,
    isActive: boolean
  ): Promise<TeacherSetStudentActiveResponse> {
    const cleanToken = (teacherToken || '').trim();
    if (!cleanToken) {
      return {
        success: false,
        error: 'Authentication required. Please log in as a teacher.',
        code: 'UNAUTHORIZED',
      };
    }

    try {
      const endpoint = ApiService.getTeacherApiUrl();
      return await ApiService.postRequest<TeacherSetStudentActiveResponse>(
        endpoint,
        {
          action: 'teacher_set_student_active',
          teacherToken: cleanToken,
          studentNumber: studentNumber.trim(),
          isActive: isActive,
        },
        18000
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Server error';
      return {
        success: false,
        error: `Failed to change account status: ${message}`,
        code: 'NETWORK_ERROR',
      };
    }
  }

  /**
   * Fetches preview of demonstration test accounts and their activity records.
   */
  public static async getDemoAccountsPreview(
    teacherToken: string
  ): Promise<TeacherDemoAccountsResponse> {
    const cleanToken = (teacherToken || '').trim();
    if (!cleanToken) {
      return {
        success: false,
        error: 'Authentication required. Please log in as a teacher.',
        code: 'UNAUTHORIZED',
      };
    }

    try {
      const endpoint = ApiService.getTeacherApiUrl();
      return await ApiService.postRequest<TeacherDemoAccountsResponse>(
        endpoint,
        {
          action: 'teacher_get_demo_accounts_preview',
          teacherToken: cleanToken,
        },
        18000
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Server error';
      return {
        success: false,
        error: `Failed to load demo accounts preview: ${message}`,
        code: 'NETWORK_ERROR',
      };
    }
  }

  /**
   * Safely archives demo accounts without losing historical database records.
   */
  public static async archiveDemoAccounts(
    teacherToken: string
  ): Promise<TeacherArchiveDemoResponse> {
    const cleanToken = (teacherToken || '').trim();
    if (!cleanToken) {
      return {
        success: false,
        error: 'Authentication required. Please log in as a teacher.',
        code: 'UNAUTHORIZED',
      };
    }

    try {
      const endpoint = ApiService.getTeacherApiUrl();
      return await ApiService.postRequest<TeacherArchiveDemoResponse>(
        endpoint,
        {
          action: 'teacher_archive_demo_accounts',
          teacherToken: cleanToken,
          confirmed: true,
        },
        20000
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Server error';
      return {
        success: false,
        error: `Failed to archive demo accounts: ${message}`,
        code: 'NETWORK_ERROR',
      };
    }
  }

  /**
   * One-time Administrative Action: Sets the PIN of all real students to default "1234".
   * Passing confirm=false returns account preview/count; confirm=true executes the update.
   */
  public static async setAllStudentPinsDefault(
    teacherToken: string,
    confirm: boolean = false,
    pin: string = '1234'
  ): Promise<TeacherSetAllPinsDefaultResponse> {
    const cleanToken = (teacherToken || '').trim();
    if (!cleanToken) {
      return {
        success: false,
        error: 'Authentication required. Please log in as a teacher.',
        code: 'UNAUTHORIZED',
      };
    }

    try {
      const endpoint = ApiService.getTeacherApiUrl();
      return await ApiService.postRequest<TeacherSetAllPinsDefaultResponse>(
        endpoint,
        {
          action: 'teacher_set_all_student_pins_default',
          teacherToken: cleanToken,
          confirm: confirm,
          pin: pin,
        },
        60000 // 60s timeout allowance for cold starts & spreadsheet flush
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Server error';
      return {
        success: false,
        error: `Administrative PIN reset failed: ${message}`,
        code: 'NETWORK_ERROR',
      };
    }
  }
}

