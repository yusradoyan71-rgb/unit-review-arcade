/**
 * ============================================================================
 * UNIT REVIEW ARCADE — XP BATTLE ARENA FRONTEND SCHEMAS & TYPES (PHASE 4)
 * ============================================================================
 */

export type ArenaStake = 0 | 5 | 10 | 20;

export type ArenaPresenceStatus = 'idle' | 'in_battle' | 'offline';

/**
 * Normalizes grade string into standard 'grade-7' | 'grade-8'
 */
export function normalizeGrade(grade?: string): 'grade-7' | 'grade-8' {
  const s = String(grade || '').trim().toLowerCase();
  if (s === '8' || s === 'grade-8' || s.startsWith('8')) return 'grade-8';
  return 'grade-7';
}

/**
 * Returns single digit grade '7' | '8' for display
 */
export function getGradeNumber(grade?: string): '7' | '8' {
  return normalizeGrade(grade) === 'grade-8' ? '8' : '7';
}

export interface ArenaStudentMetrics {
  studentNumber: string;
  displayName: string;
  class: string;
  grade: string;
  academicLifetimeXp: number;
  spendableXp: number;
  arenaXpDelta: number;
  level: number;
  levelTitle: string;
  todayMatchCount: number;
  remainingMatches: number;
  todayGrossLossXp: number;
  remainingLossAllowance: number;
  availableStakes: ArenaStake[];
}

export interface ArenaOpponent {
  studentNumber: string;
  displayName: string;
  class: string;
  grade: string;
  level: number;
  levelTitle: string;
  status: ArenaPresenceStatus;
  avatarSeed: string;
}

export interface ArenaChallenge {
  challengeId: string;
  challenger_id: string;
  challenger_name: string;
  opponent_id: string;
  opponent_name: string;
  stake_xp: ArenaStake;
  grade: string;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  createdAt: number;
}

export interface ArenaQuestion {
  id: string;
  prompt: string;
  options: string[];
}

export interface ArenaMatchRoom {
  battleId: string;
  player1: ArenaOpponent;
  player2: ArenaOpponent;
  stakeXp: ArenaStake;
  currentQuestionIndex: number;
  totalQuestions: number;
  startedAt: number;
  questionDeadlines: Record<string, number>;
  questions: ArenaQuestion[];
  status: 'starting' | 'in_progress' | 'completed' | 'abandoned';
}

export interface ArenaMatchOutcome {
  matchId: string;
  winnerId: string;
  isTie: boolean;
  isForfeit?: boolean;
  p1Score: number;
  p2Score: number;
  p1TotalTimeMs: number;
  p2TotalTimeMs: number;
  p1XpChange: number;
  p2XpChange: number;
  academicLifetimeXp: number;
  newSpendableXp: number;
  levelFloorProtected: boolean;
  settledAt: string;
}
