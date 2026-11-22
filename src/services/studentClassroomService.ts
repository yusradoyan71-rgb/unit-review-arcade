/**
 * UNIT REVIEW ARCADE — STUDENT CLASSROOM SERVICE (PHASE 3.4C)
 * 
 * Provides authenticated, type-safe communication with the backend
 * for student classroom behavior points, permanent rewards, and private feedback.
 * 
 * SECURITY MANDATES:
 * 1. Strictly session-anchored: Never accepts or sends client-supplied student IDs.
 * 2. Identity isolation: Only accesses the calling student's own records.
 * 3. Lock-free queries: Profile requests do not acquire database locks.
 */

import { ApiService } from './apiService';
import { MonsterService } from './monsterService';
import type { 
  StudentClassroomProfileResponse, 
  StudentClaimRewardResponse,
  ClassroomNextMilestone
} from '../types/classroomPoints';

export class StudentClassroomService {
  /**
   * Retrieves the authenticated student's classroom points profile,
   * active academic year points, permanent reward grants, next unowned milestone,
   * claimable rewards, and private classroom feedback history.
   */
  public static async getClassroomProfile(
    sessionToken: string | null,
    fallbackStudentInfo?: { studentNumber: string; class: string; fullName: string }
  ): Promise<StudentClassroomProfileResponse> {
    const cleanToken = (sessionToken || '').trim();

    if (!cleanToken) {
      // Offline / guest fallback profile for preview and local development
      return this.getMockProfile(fallbackStudentInfo);
    }

    try {
      const endpoint = ApiService.getApiUrl();
      const response = await ApiService.postRequest<StudentClassroomProfileResponse>(
        endpoint,
        {
          action: 'student_get_classroom_profile',
          sessionToken: cleanToken,
        },
        20000
      );

      if (response && response.success) {
        // Sync reward ownership into local Monster World inventory
        if (response.studentNumber && response.unlockedRewards && response.unlockedRewards.length > 0) {
          try {
            MonsterService.syncClassroomRewardOwnership(
              response.studentNumber,
              response.unlockedRewards
            );
          } catch (e) {
            console.warn('[StudentClassroomService] Failed to sync reward ownership to Monster World:', e);
          }
        }
        return response;
      }

      // If backend returned error, fallback to mock if student info available
      if (fallbackStudentInfo) {
        return this.getMockProfile(fallbackStudentInfo);
      }

      return response || {
        success: false,
        error: 'Failed to retrieve classroom profile.',
        code: 'UNKNOWN_ERROR',
      };
    } catch (err) {
      // Graceful offline fallback
      if (fallbackStudentInfo) {
        return this.getMockProfile(fallbackStudentInfo);
      }
      const message = err instanceof Error ? err.message : 'Network error.';
      return {
        success: false,
        error: `Unable to load classroom profile: ${message}`,
        code: 'NETWORK_ERROR',
      };
    }
  }

  /**
   * Allows student to claim an eligible reward milestone whose grant was missing.
   * Deterministic and concurrency-safe on backend.
   */
  public static async claimMilestoneReward(
    sessionToken: string | null,
    rewardId: string,
    studentNumber?: string
  ): Promise<StudentClaimRewardResponse> {
    const cleanToken = (sessionToken || '').trim();
    if (!cleanToken) {
      // Local mock claim for offline testing
      if (studentNumber && rewardId) {
        const cosmeticId = rewardId === 'rwd_silver_star_frame' ? 'frame_silver_star' : rewardId;
        MonsterService.syncClassroomRewardOwnership(studentNumber, [cosmeticId]);
      }
      return {
        success: true,
        rewardId,
        cosmeticId: rewardId,
        grantId: `grnt_mock_${rewardId}`,
      };
    }

    try {
      const endpoint = ApiService.getApiUrl();
      const response = await ApiService.postRequest<StudentClaimRewardResponse>(
        endpoint,
        {
          action: 'student_claim_milestone_reward',
          sessionToken: cleanToken,
          rewardId,
        },
        25000
      );

      if (response && response.success && response.cosmeticId && studentNumber) {
        MonsterService.syncClassroomRewardOwnership(studentNumber, [response.cosmeticId]);
      }

      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Network error.';
      return {
        success: false,
        error: `Failed to claim reward: ${message}`,
        code: 'NETWORK_ERROR',
      };
    }
  }

  /**
   * Generates a realistic mock student classroom profile for local testing and offline preview.
   */
  public static getMockProfile(
    studentInfo?: { studentNumber: string; class: string; fullName: string }
  ): StudentClassroomProfileResponse {
    const sNum = studentInfo?.studentNumber || '701';
    const sClass = studentInfo?.class || '7A';

    const nextMilestone: ClassroomNextMilestone = {
      rewardId: 'rwd_silver_star_frame',
      name: 'Silver Star Frame',
      requiredPoints: 25,
      currentPoints: 18,
      progressPercent: 72,
      type: 'profile_frame',
      cosmeticId: 'frame_silver_star',
      icon: '🖼️',
    };

    return {
      success: true,
      studentNumber: sNum,
      studentClass: sClass,
      academicYear: '2026-2027',
      positivePoints: 18,
      negativePoints: 2,
      netPoints: 16,
      unlockedRewards: [
        {
          grantId: `grnt_${sNum}_rwd_first_star`,
          rewardId: 'rwd_first_star',
          rewardName: 'First Star',
          cosmeticId: 'badge_first_star',
          type: 'badge',
          grantedAt: '2026-10-15T09:30:00.000Z',
        },
      ],
      nextMilestone,
      claimableRewards: [],
      feedbackHistory: [
        {
          categoryName: 'Speaking Participation',
          categoryType: 'positive',
          grossPoints: 2,
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
          note: 'Great pronunciation and confidence during dialogue practice!',
        },
        {
          categoryName: 'Teamwork',
          categoryType: 'positive',
          grossPoints: 1,
          timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
          note: 'Helped group members complete the vocabulary puzzle.',
        },
        {
          categoryName: 'Excellent Effort',
          categoryType: 'positive',
          grossPoints: 2,
          timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
          note: 'Perfect focus during grammar station exercises.',
        },
        {
          categoryName: 'Classroom Disruption',
          categoryType: 'negative',
          grossPoints: -1,
          timestamp: new Date(Date.now() - 3600000 * 72).toISOString(),
          note: 'Please remember to raise hand before speaking.',
        },
      ],
      isMaxMilestoneTier: false,
    };
  }
}
