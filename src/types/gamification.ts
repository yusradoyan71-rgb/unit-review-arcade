/**
 * UNIT REVIEW ARCADE — STUDENT GAMIFICATION SYSTEM TYPES (PHASE 5)
 * Version: 5.0.0
 * 
 * Defines schemas for XP, levels, achievements, student profiles,
 * and class leaderboards.
 */

import type { StudentClass, StudentGrade } from './auth';
import type { GameType } from './schema';
import type { MonsterConfig } from './monster';

export type AchievementCategory = 'starter' | 'mastery' | 'milestone' | 'explorer';

export interface StudentLevel {
  level: number;
  title: string;
  minXp: number;
  maxXp: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  target: number;
  progress?: number;
  unlockedAt?: string | null;
}

export interface StudentGamificationStats {
  activitiesCompleted: number;
  totalAttempts: number;
  averageScore: number;
  perfectScores: number;
}

export interface StudentRecentActivity {
  attemptId: string;
  activityId: string;
  activityTitle: string;
  gameType: GameType;
  score: number;
  percentage: number;
  xpEarned: number;
  completedAt: string;
}

export interface StudentGamificationProfile {
  studentNumber: string;
  displayName: string;
  firstName: string;
  class: StudentClass;
  grade: StudentGrade;
  level: number;
  levelTitle: string;
  minXp: number;
  maxXp: number;
  totalXp: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
  stats: StudentGamificationStats;
  achievements: Achievement[];
  recentActivity: StudentRecentActivity[];
  totalCoins?: number;
  monster?: MonsterConfig;
}

export interface LeaderboardEntry {
  rank: number;
  displayName: string;
  class: StudentClass;
  level: number;
  levelTitle: string;
  minXp: number;
  maxXp: number;
  totalXp: number;
  activitiesCompleted: number;
  isCurrentStudent: boolean;
}

export interface ClassLeaderboard {
  classId: StudentClass;
  entries: LeaderboardEntry[];
  currentStudentRank: number | null;
}

export interface AttemptGamificationResult {
  xpEarned: number;
  baseCompletionXp: number;
  accuracyXp: number;
  perfectBonusXp: number;
  practiceBonusXp: number;
  totalXp: number;
  oldLevel: number;
  newLevel: number;
  isLevelUp: boolean;
  levelTitle: string;
  unlockedAchievements: Achievement[];
  replayNotice: string | null;
}

export interface GamificationApiResponse<T = unknown> {
  success: boolean;
  error?: string;
  code?: string;
  profile?: StudentGamificationProfile;
  leaderboard?: ClassLeaderboard;
  gamification?: AttemptGamificationResult;
  data?: T;
}
