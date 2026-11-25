/**
 * UNIT REVIEW ARCADE — CLASSROOM POINTS & REWARDS TYPES (v3.4.0)
 * 
 * Domain models and API interfaces for the ClassDojo-style classroom points system:
 * 1. Behavior categories (positive and negative)
 * 2. Point events and append-only audit ledger
 * 3. Milestone rewards and permanent ownership
 * 4. Teacher management and smartboard projector privacy controls
 */

import type { MonsterConfig, MonsterLifecycleStage } from './monster';

export type ClassroomCategoryType = 'positive' | 'negative' | 'correction';

export interface ClassroomCategory {
  id: string;
  name: string;
  type: 'positive' | 'negative';
  defaultPoints: number;
  icon: string;
  color: string;
  isActive: boolean;
  sortOrder: number;
}

export interface ClassroomNextMilestone {
  rewardId: string;
  name: string;
  requiredPoints: number;
  currentPoints: number;
  progressPercent: number;
  type?: string;
  cosmeticId?: string;
  icon?: string;
}

export interface ClassroomRewardDefinition {
  id: string;
  name: string;
  desc?: string;
  requiredPoints: number;
  type: 'badge' | 'profile_frame' | 'monster_accessory' | 'monster_aura';
  cosmeticId: string;
  icon: string;
  sortOrder: number;
}

export interface ClassroomStudentSummary {
  studentNumber: string;
  fullName: string;
  class: string;
  grade: string;
  positivePoints: number;
  negativePoints: number;
  netPoints: number;
  unlockedRewardCount: number;
  unlockedRewards: string[];
  nextMilestone: ClassroomNextMilestone | null;
  monster?: MonsterConfig | null;
  monsterStage?: MonsterLifecycleStage;
  evolutionTier?: number;
  isHatched?: boolean;
}

export interface ClassroomPointTransaction {
  transactionId: string;
  timestamp: string;
  studentNumber: string;
  studentClass: string;
  categoryName: string;
  categoryType: ClassroomCategoryType;
  grossPoints: number;
  originalTxId?: string;
  note?: string;
}

export interface TeacherClassroomOverviewResponse {
  success: boolean;
  academicYear?: string;
  totalStudents?: number;
  students?: ClassroomStudentSummary[];
  categories?: ClassroomCategory[];
  rewardDefinitions?: ClassroomRewardDefinition[];
  error?: string;
  code?: string;
}

export interface TeacherAwardPointsPayload {
  teacherToken: string;
  studentNumbers: string[];
  categoryId: string;
  idempotencyKey?: string;
  note?: string;
}

export interface TeacherAwardPointsResponse {
  success: boolean;
  awardedCount?: number;
  totalRequested?: number;
  categoryName?: string;
  academicYear?: string;
  batchKey?: string;
  transactions?: Array<{
    transactionId: string;
    studentNumber: string;
  }>;
  newGrants?: Array<{
    grantId: string;
    studentNumber: string;
    rewardId: string;
    rewardName: string;
    requiredPoints: number;
  }>;
  error?: string;
  code?: string;
}

export interface TeacherRevertTransactionPayload {
  teacherToken: string;
  transactionId?: string;
  transactionIds?: string[];
  reason?: string;
}

export interface TeacherRevertTransactionResponse {
  success: boolean;
  reversedCount?: number;
  reversedTransactionIds?: string[];
  reversedTransactionId?: string;
  reversalTransactionId?: string;
  studentNumber?: string;
  updatedBalances?: {
    positivePoints: number;
    negativePoints: number;
    netPoints: number;
    totalTransactions?: number;
  };
  error?: string;
  code?: string;
}

export interface TeacherClassroomHistoryFilter {
  studentNumber?: string;
  classId?: string;
  academicYear?: string;
  limit?: number;
  offset?: number;
}

export interface TeacherClassroomHistoryResponse {
  success: boolean;
  totalCount?: number;
  limit?: number;
  offset?: number;
  transactions?: ClassroomPointTransaction[];
  error?: string;
  code?: string;
}

export interface TeacherManageCategoriesPayload {
  teacherToken: string;
  operation: 'list' | 'create' | 'update' | 'toggle';
  categoryData?: {
    categoryId?: string;
    name?: string;
    type?: 'positive' | 'negative';
    defaultPoints?: number;
    icon?: string;
    color?: string;
  };
}

export interface TeacherManageCategoriesResponse {
  success: boolean;
  categories?: ClassroomCategory[];
  createdId?: string;
  categoryId?: string;
  isActive?: boolean;
  category?: ClassroomCategory;
  error?: string;
  code?: string;
}

export interface TeacherReconcileRewardsResponse {
  success: boolean;
  reconciledCount?: number;
  reconciledGrants?: Array<{
    grantId: string;
    studentNumber: string;
    rewardId: string;
    rewardName: string;
  }>;
  academicYear?: string;
  error?: string;
  code?: string;
}

export interface ClassroomWeeklyReport {
  weekLabel: string;
  positiveTotal: number;
  negativeTotal: number;
  netTotal: number;
  transactionCount: number;
}

// ============================================================================
// STUDENT CLASSROOM & REWARD OWNERSHIP TYPES (PHASE 3.4C)
// ============================================================================

export interface StudentClassroomFeedback {
  categoryName: string;
  categoryType: ClassroomCategoryType;
  grossPoints: number;
  timestamp: string;
  note?: string;
  isCorrection?: boolean;
}

export interface StudentUnlockedRewardGrant {
  grantId: string;
  rewardId: string;
  rewardName: string;
  cosmeticId: string;
  type: string;
  grantedAt: string;
}

export interface StudentClaimableReward {
  rewardId: string;
  name: string;
  requiredPoints: number;
  type: string;
  cosmeticId: string;
}

export interface StudentClassroomProfileResponse {
  success: boolean;
  studentNumber?: string;
  studentClass?: string;
  academicYear?: string;
  positivePoints?: number;
  negativePoints?: number;
  netPoints?: number;
  unlockedRewards?: StudentUnlockedRewardGrant[];
  nextMilestone?: ClassroomNextMilestone | null;
  claimableRewards?: StudentClaimableReward[];
  feedbackHistory?: StudentClassroomFeedback[];
  isMaxMilestoneTier?: boolean;
  error?: string;
  code?: string;
}

export interface StudentClaimRewardPayload {
  sessionToken: string;
  rewardId: string;
}

export interface StudentClaimRewardResponse {
  success: boolean;
  grantId?: string;
  rewardId?: string;
  rewardName?: string;
  cosmeticId?: string;
  type?: string;
  grantedAt?: string;
  error?: string;
  code?: string;
}

