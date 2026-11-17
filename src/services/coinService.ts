/**
 * UNIT REVIEW ARCADE — MONSTER COIN SERVICE (PHASE 8A)
 * Version: 8.0.0
 * 
 * Client-side management of Monster Coins:
 * - Anti-farming calculation models
 * - Instant UI cache & synchronization with Google Apps Script backend
 * - Daily reward limits & tracking
 */

import {
  COIN_ECONOMY,
  type CoinTransaction,
  type MonsterCoinsSummary,
} from '../types/monster.ts';

const COIN_BALANCE_PREFIX = 'ura_coin_balance_';
const COIN_TX_PREFIX = 'ura_coin_txs_';
const DAILY_GZ_COINS_PREFIX = 'ura_gz_daily_coins_';
const DAILY_PRACTICE_COINS_PREFIX = 'ura_practice_daily_coins_';
const LAST_ACTIVE_DAY_PREFIX = 'ura_last_active_day_';

export class CoinService {
  /**
   * Get cached coin balance for a student.
   */
  public static getBalance(studentNumber: string): number {
    if (!studentNumber) return 0;
    try {
      const val = localStorage.getItem(`${COIN_BALANCE_PREFIX}${studentNumber}`);
      return val ? Math.max(0, parseInt(val, 10) || 0) : 0;
    } catch {
      return 0;
    }
  }

  /**
   * Update and cache coin balance.
   */
  public static setBalance(studentNumber: string, balance: number): void {
    if (!studentNumber) return;
    try {
      localStorage.setItem(`${COIN_BALANCE_PREFIX}${studentNumber}`, String(Math.max(0, balance)));
    } catch {
      // Storage unavailable
    }
  }

  /**
   * Award coins locally and record transaction.
   */
  public static addCoins(
    studentNumber: string,
    studentClass: string,
    amount: number,
    reason: CoinTransaction['reason'],
    sourceId: string
  ): { balanceAfter: number; transaction: CoinTransaction } {
    const current = this.getBalance(studentNumber);
    const balanceAfter = Math.max(0, current + amount);
    this.setBalance(studentNumber, balanceAfter);

    const transaction: CoinTransaction = {
      id: `ctx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      studentNumber,
      class: studentClass,
      amount,
      balanceAfter,
      reason,
      sourceId,
      createdAt: new Date().toISOString(),
    };

    try {
      const txKey = `${COIN_TX_PREFIX}${studentNumber}`;
      const raw = localStorage.getItem(txKey);
      const list: CoinTransaction[] = raw ? JSON.parse(raw) : [];
      list.unshift(transaction);
      if (list.length > 50) list.length = 50;
      localStorage.setItem(txKey, JSON.stringify(list));
    } catch {
      // Storage unavailable
    }

    return { balanceAfter, transaction };
  }

  /**
   * Deduct coins for an approved shop purchase (Phase 8B).
   */
  public static deductCoins(
    studentNumber: string,
    studentClass: string,
    amount: number,
    itemId: string
  ): { success: boolean; balanceAfter: number; transaction?: CoinTransaction } {
    const current = this.getBalance(studentNumber);
    if (current < amount) {
      return { success: false, balanceAfter: current };
    }
    const balanceAfter = current - amount;
    this.setBalance(studentNumber, balanceAfter);

    const transaction: CoinTransaction = {
      id: `ctx_shop_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      studentNumber,
      class: studentClass || '',
      amount: -amount,
      balanceAfter,
      reason: 'shop_purchase',
      sourceId: itemId,
      createdAt: new Date().toISOString(),
    };

    try {
      const txKey = `${COIN_TX_PREFIX}${studentNumber}`;
      const raw = localStorage.getItem(txKey);
      const list: CoinTransaction[] = raw ? JSON.parse(raw) : [];
      list.unshift(transaction);
      if (list.length > 50) list.length = 50;
      localStorage.setItem(txKey, JSON.stringify(list));
    } catch {
      // Storage unavailable
    }

    return { success: true, balanceAfter, transaction };
  }

  /**
   * Calculate client-side projected coin rewards for an activity attempt.
   */
  public static calculateAttemptCoins(options: {
    studentNumber: string;
    percentage: number;
    isFirstCompletion: boolean;
    previousBestPercentage: number;
    isLevelUp: boolean;
    levelDiff?: number;
  }): {
    totalCoins: number;
    breakdown: {
      firstCompletion: number;
      highAccuracy: number;
      perfectScore: number;
      dailyFirst: number;
      levelUp: number;
      replay: number;
    };
  } {
    const {
      studentNumber,
      percentage,
      isFirstCompletion,
      previousBestPercentage,
      isLevelUp,
      levelDiff = 1,
    } = options;

    let firstCompletion = 0;
    let highAccuracy = 0;
    let perfectScore = 0;
    let dailyFirst = 0;
    let levelUp = 0;
    let replay = 0;

    const today = new Date().toISOString().split('T')[0];
    const lastActiveDay = localStorage.getItem(`${LAST_ACTIVE_DAY_PREFIX}${studentNumber}`);
    const isDailyFirstActivity = lastActiveDay !== today;

    if (isFirstCompletion) {
      firstCompletion = COIN_ECONOMY.FIRST_COMPLETION; // 5 coins

      if (percentage >= 90) {
        highAccuracy = COIN_ECONOMY.HIGH_ACCURACY_BONUS; // +3 coins
      }
      if (percentage >= 100) {
        perfectScore = COIN_ECONOMY.PERFECT_SCORE_BONUS; // +5 coins (Stacks to 13 total!)
      }
    } else {
      // Replay rules
      if (percentage > previousBestPercentage) {
        replay = COIN_ECONOMY.REPLAY_IMPROVED; // 2 coins
      } else {
        // Practice replay non-improving
        const practiceKey = `${DAILY_PRACTICE_COINS_PREFIX}${studentNumber}_${today}`;
        const practiceEarned = parseInt(localStorage.getItem(practiceKey) || '0', 10);
        if (practiceEarned < COIN_ECONOMY.MAX_DAILY_REPLAY_COINS) {
          replay = COIN_ECONOMY.REPLAY_PRACTICE; // 1 coin
          try {
            localStorage.setItem(practiceKey, String(practiceEarned + 1));
          } catch {}
        }
      }
    }

    if (isDailyFirstActivity) {
      dailyFirst = COIN_ECONOMY.DAILY_FIRST_ACTIVITY; // +5 coins
      try {
        localStorage.setItem(`${LAST_ACTIVE_DAY_PREFIX}${studentNumber}`, today);
      } catch {}
    }

    if (isLevelUp) {
      levelUp = Math.max(1, levelDiff) * COIN_ECONOMY.LEVEL_UP_REWARD; // 10 coins per level
    }

    const totalCoins = firstCompletion + highAccuracy + perfectScore + dailyFirst + levelUp + replay;

    return {
      totalCoins,
      breakdown: {
        firstCompletion,
        highAccuracy,
        perfectScore,
        dailyFirst,
        levelUp,
        replay,
      },
    };
  }

  /**
   * Calculate client-side coin rewards for Games Zone completions.
   */
  public static calculateGamesZoneCoins(
    studentNumber: string,
    difficulty: 'easy' | 'medium' | 'hard',
    accuracy: number
  ): { coinsEarned: number; isCapped: boolean } {
    let base = COIN_ECONOMY.GAMES_ZONE_EASY; // 3
    if (difficulty === 'medium') base = COIN_ECONOMY.GAMES_ZONE_MEDIUM; // 4
    if (difficulty === 'hard') base = COIN_ECONOMY.GAMES_ZONE_HARD; // 5

    const bonus = accuracy >= 90 ? COIN_ECONOMY.GAMES_ZONE_HIGH_ACC : 0; // +1
    const totalPotential = base + bonus;

    const today = new Date().toISOString().split('T')[0];
    const key = `${DAILY_GZ_COINS_PREFIX}${studentNumber}_${today}`;
    const todayEarned = parseInt(localStorage.getItem(key) || '0', 10);

    const available = Math.max(0, COIN_ECONOMY.MAX_DAILY_GAMES_ZONE_COINS - todayEarned);
    const awarded = Math.min(totalPotential, available);
    const isCapped = awarded < totalPotential;

    if (awarded > 0) {
      try {
        localStorage.setItem(key, String(todayEarned + awarded));
      } catch {}
    }

    return { coinsEarned: awarded, isCapped };
  }

  /**
   * Retrieve student coin summary.
   */
  public static getSummary(studentNumber: string): MonsterCoinsSummary {
    const balance = this.getBalance(studentNumber);
    const today = new Date().toISOString().split('T')[0];
    let todayEarned = 0;

    try {
      const txKey = `${COIN_TX_PREFIX}${studentNumber}`;
      const raw = localStorage.getItem(txKey);
      if (raw) {
        const list: CoinTransaction[] = JSON.parse(raw);
        for (const tx of list) {
          if (tx.createdAt && tx.createdAt.startsWith(today)) {
            todayEarned += tx.amount;
          }
        }
      }
    } catch {}

    return {
      balance,
      todayEarned,
      lifetimeEarned: balance, // minimum lifetime
    };
  }
}
