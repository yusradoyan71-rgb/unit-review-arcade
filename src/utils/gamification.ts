/**
 * UNIT REVIEW ARCADE — STUDENT GAMIFICATION UTILITIES (PHASE 5)
 * Version: 5.0.0
 * 
 * Provides formulas and definitions for levels, XP progression,
 * anti-farming replay policies, and achievement evaluation.
 */

import type { StudentLevel, Achievement } from '../types/gamification';
import type { GameType } from '../types/schema';

// ---------------------------------------------------------------------------
// 1. LEVEL THRESHOLDS & TITLES (15 PROGRESSIVE TIERS)
// ---------------------------------------------------------------------------

export const LEVEL_DEFINITIONS: StudentLevel[] = [
  { level: 1,  title: 'Novice Explorer',      minXp: 0,    maxXp: 100 },
  { level: 2,  title: 'Curious Learner',      minXp: 100,  maxXp: 250 },
  { level: 3,  title: 'Word Scout',           minXp: 250,  maxXp: 450 },
  { level: 4,  title: 'Grammar Cadet',        minXp: 450,  maxXp: 700 },
  { level: 5,  title: 'Sentence Crafter',     minXp: 700,  maxXp: 1000 },
  { level: 6,  title: 'Arcade Challenger',    minXp: 1000, maxXp: 1400 },
  { level: 7,  title: 'Reading Detective',    minXp: 1400, maxXp: 1850 },
  { level: 8,  title: 'Vocabulary Champion',  minXp: 1850, maxXp: 2350 },
  { level: 9,  title: 'Grammar Master',       minXp: 2350, maxXp: 2900 },
  { level: 10, title: 'Unit Conqueror',       minXp: 2900, maxXp: 3500 },
  { level: 11, title: 'Linguistic Ace',       minXp: 3500, maxXp: 4150 },
  { level: 12, title: 'Language Virtuoso',    minXp: 4150, maxXp: 4850 },
  { level: 13, title: 'Grand Scholar',        minXp: 4850, maxXp: 5600 },
  { level: 14, title: 'Arcade Legend',        minXp: 5600, maxXp: 6400 },
  { level: 15, title: 'Mythic Champion',      minXp: 6400, maxXp: 10000 },
];

export function calculateLevelFromXp(totalXp: number): {
  level: number;
  title: string;
  minXp: number;
  maxXp: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
} {
  const safeXp = Math.max(0, Math.floor(totalXp || 0));

  let currentTier = LEVEL_DEFINITIONS[0];
  for (let i = 0; i < LEVEL_DEFINITIONS.length; i++) {
    const tier = LEVEL_DEFINITIONS[i];
    if (safeXp >= tier.minXp) {
      currentTier = tier;
    } else {
      break;
    }
  }

  const isMaxLevel = currentTier.level >= LEVEL_DEFINITIONS.length;
  const currentLevelXp = safeXp - currentTier.minXp;
  const levelSpan = currentTier.maxXp - currentTier.minXp;
  const nextLevelXp = isMaxLevel ? 0 : Math.max(0, currentTier.maxXp - safeXp);
  const progressPercent = isMaxLevel
    ? 100
    : Math.min(100, Math.max(0, Math.round((currentLevelXp / levelSpan) * 100)));

  return {
    level: currentTier.level,
    title: currentTier.title,
    minXp: currentTier.minXp,
    maxXp: currentTier.maxXp,
    currentLevelXp,
    nextLevelXp,
    progressPercent,
  };
}

// ---------------------------------------------------------------------------
// 2. ACHIEVEMENTS CATALOG (14 BADGES ACROSS 4 CATEGORIES)
// ---------------------------------------------------------------------------

export const ACHIEVEMENTS_CATALOG: Achievement[] = [
  // Starter
  {
    id: 'first_game',
    title: 'First Steps',
    description: 'Complete your first review activity in the arcade.',
    icon: 'Sparkles',
    category: 'starter',
    target: 1,
  },
  {
    id: 'perfect_score',
    title: 'Flawless Victory',
    description: 'Score 100% on any activity.',
    icon: 'Trophy',
    category: 'starter',
    target: 1,
  },

  // Mastery
  {
    id: 'perfect_streak_3',
    title: 'Hat Trick',
    description: 'Achieve 3 perfect 100% scores across any activities.',
    icon: 'Zap',
    category: 'mastery',
    target: 3,
  },
  {
    id: 'mastery_improver',
    title: 'Growth Mindset',
    description: 'Improve your score by replaying an activity.',
    icon: 'Flame',
    category: 'mastery',
    target: 1,
  },

  // Game Type Specializations
  {
    id: 'quiz_ace',
    title: 'Battle Master',
    description: 'Complete 3 Quiz Battle activities.',
    icon: 'Swords',
    category: 'mastery',
    target: 3,
  },
  {
    id: 'match_master',
    title: 'Pair Perfection',
    description: 'Complete 3 Match It! activities.',
    icon: 'Layers',
    category: 'mastery',
    target: 3,
  },
  {
    id: 'sentence_architect',
    title: 'Sentence Architect',
    description: 'Complete 3 Sentence Builder activities.',
    icon: 'AlignLeft',
    category: 'mastery',
    target: 3,
  },
  {
    id: 'detective_pro',
    title: 'Chief Inspector',
    description: 'Complete 3 Reading Detective activities.',
    icon: 'BookOpen',
    category: 'mastery',
    target: 3,
  },
  {
    id: 'station_conductor',
    title: 'Express Conductor',
    description: 'Complete 2 Train Station activities.',
    icon: 'Train',
    category: 'mastery',
    target: 2,
  },
  {
    id: 'true_false_guru',
    title: 'Truth Seeker',
    description: 'Complete 3 True/False activities.',
    icon: 'CheckCircle2',
    category: 'mastery',
    target: 3,
  },

  // Explorer
  {
    id: 'explorer_all_types',
    title: 'Arcade Explorer',
    description: 'Complete at least one activity in each of the 6 game types.',
    icon: 'Compass',
    category: 'explorer',
    target: 6,
  },

  // Milestones
  {
    id: 'milestone_5',
    title: 'On a Roll',
    description: 'Complete 5 distinct curriculum activities.',
    icon: 'Medal',
    category: 'milestone',
    target: 5,
  },
  {
    id: 'milestone_10',
    title: 'Knowledge Seeker',
    description: 'Complete 10 distinct curriculum activities.',
    icon: 'Award',
    category: 'milestone',
    target: 10,
  },
  {
    id: 'milestone_25',
    title: 'Halfway Hero',
    description: 'Complete 25 distinct curriculum activities.',
    icon: 'Crown',
    category: 'milestone',
    target: 25,
  },
];

// ---------------------------------------------------------------------------
// 3. XP REWARD FORMULA & ANTI-FARMING REPLAY POLICY
// ---------------------------------------------------------------------------

export interface CalculateAttemptXpParams {
  percentage: number;
  isFirstCompletion: boolean;
  previousBestPercentage?: number;
  attemptNumber: number;
}

export function calculateAttemptXp(params: CalculateAttemptXpParams): {
  xpEarned: number;
  baseCompletionXp: number;
  accuracyXp: number;
  perfectBonusXp: number;
  practiceBonusXp: number;
  replayNotice: string | null;
} {
  const percentage = Math.max(0, Math.min(100, Math.round(params.percentage || 0)));
  const attemptNumber = Math.max(1, params.attemptNumber || 1);

  // 1. FIRST COMPLETION of an activity
  if (params.isFirstCompletion) {
    const baseCompletionXp = 20; // 20 XP baseline for completing
    const accuracyXp = Math.round((percentage / 100) * 80); // up to 80 XP
    const perfectBonusXp = percentage === 100 ? 25 : 0; // +25 XP flawless bonus
    const xpEarned = baseCompletionXp + accuracyXp + perfectBonusXp;

    return {
      xpEarned,
      baseCompletionXp,
      accuracyXp,
      perfectBonusXp,
      practiceBonusXp: 0,
      replayNotice: null,
    };
  }

  // 2. REPLAY of an existing completed activity
  const previousBest = Math.max(0, Math.min(100, Math.round(params.previousBestPercentage || 0)));

  // Practice bonus decays based on replay attempt number to prevent bot spam
  const practiceBonusXp = attemptNumber === 2 ? 15 : attemptNumber === 3 ? 10 : 5;

  if (percentage > previousBest) {
    // Mastery Improvement! Award the difference in accuracy XP + first-time perfect bonus if achieved
    const improvementAccuracyXp = Math.round(((percentage - previousBest) / 100) * 80);
    const perfectBonusXp = (percentage === 100 && previousBest < 100) ? 25 : 0;
    const xpEarned = improvementAccuracyXp + perfectBonusXp + practiceBonusXp;

    return {
      xpEarned,
      baseCompletionXp: 0,
      accuracyXp: improvementAccuracyXp,
      perfectBonusXp,
      practiceBonusXp,
      replayNotice: `Score improvement (+${percentage - previousBest}%)! Mastery bonus awarded.`,
    };
  }

  // No score improvement: award standard practice bonus
  return {
    xpEarned: practiceBonusXp,
    baseCompletionXp: 0,
    accuracyXp: 0,
    perfectBonusXp: 0,
    practiceBonusXp,
    replayNotice: 'Great practice! Replay practice bonus awarded.',
  };
}

// ---------------------------------------------------------------------------
// 4. ACHIEVEMENT EVALUATION
// ---------------------------------------------------------------------------

export interface AttemptSummaryForAchievements {
  attemptId: string;
  activityId: string;
  gameType: GameType;
  percentage: number;
  completedAt: string;
}

export function evaluateAchievements(
  completedAttempts: AttemptSummaryForAchievements[],
  alreadyUnlockedIds: Set<string>
): {
  allAchievements: Achievement[];
  newlyUnlocked: Achievement[];
} {
  const distinctActivities = new Set<string>();
  const distinctGameTypes = new Set<GameType>();
  let perfectCount = 0;
  const gameTypeCounts: Record<string, number> = {};
  const attemptsByActivity: Record<string, number[]> = {};

  for (const att of completedAttempts) {
    distinctActivities.add(att.activityId);
    if (att.gameType) {
      distinctGameTypes.add(att.gameType);
      gameTypeCounts[att.gameType] = (gameTypeCounts[att.gameType] || 0) + 1;
    }
    if (att.percentage === 100) {
      perfectCount++;
    }
    if (!attemptsByActivity[att.activityId]) {
      attemptsByActivity[att.activityId] = [];
    }
    attemptsByActivity[att.activityId].push(att.percentage);
  }

  // Check if student improved on any activity
  let hasImprovement = false;
  for (const activityId in attemptsByActivity) {
    const scores = attemptsByActivity[activityId];
    if (scores.length >= 2) {
      for (let i = 1; i < scores.length; i++) {
        if (scores[i] > scores[0]) {
          hasImprovement = true;
          break;
        }
      }
    }
  }

  const allAchievements: Achievement[] = [];
  const newlyUnlocked: Achievement[] = [];

  for (const def of ACHIEVEMENTS_CATALOG) {
    let currentProgress = 0;
    let isUnlocked = alreadyUnlockedIds.has(def.id);

    switch (def.id) {
      case 'first_game':
        currentProgress = completedAttempts.length >= 1 ? 1 : 0;
        break;
      case 'perfect_score':
        currentProgress = perfectCount >= 1 ? 1 : 0;
        break;
      case 'perfect_streak_3':
        currentProgress = Math.min(def.target, perfectCount);
        break;
      case 'mastery_improver':
        currentProgress = hasImprovement ? 1 : 0;
        break;
      case 'quiz_ace':
        currentProgress = Math.min(def.target, gameTypeCounts['quiz_battle'] || 0);
        break;
      case 'match_master':
        currentProgress = Math.min(def.target, gameTypeCounts['match_it'] || 0);
        break;
      case 'sentence_architect':
        currentProgress = Math.min(def.target, gameTypeCounts['sentence_builder'] || 0);
        break;
      case 'detective_pro':
        currentProgress = Math.min(def.target, gameTypeCounts['reading_detective'] || 0);
        break;
      case 'station_conductor':
        currentProgress = Math.min(def.target, gameTypeCounts['train_station'] || 0);
        break;
      case 'true_false_guru':
        currentProgress = Math.min(def.target, gameTypeCounts['true_false'] || 0);
        break;
      case 'explorer_all_types':
        currentProgress = Math.min(def.target, distinctGameTypes.size);
        break;
      case 'milestone_5':
      case 'milestone_10':
      case 'milestone_25':
        currentProgress = Math.min(def.target, distinctActivities.size);
        break;
      default:
        currentProgress = 0;
    }

    if (!isUnlocked && currentProgress >= def.target) {
      isUnlocked = true;
      const unlockedItem: Achievement = {
        ...def,
        progress: currentProgress,
        unlockedAt: new Date().toISOString(),
      };
      allAchievements.push(unlockedItem);
      newlyUnlocked.push(unlockedItem);
    } else {
      allAchievements.push({
        ...def,
        progress: currentProgress,
        unlockedAt: isUnlocked ? new Date().toISOString() : null,
      });
    }
  }

  return { allAchievements, newlyUnlocked };
}
