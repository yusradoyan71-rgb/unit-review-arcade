/**
 * UNIT REVIEW ARCADE — MONSTER CREATOR SERVICE (PHASE 8A)
 * Version: 8.0.0
 * 
 * Manages monster configuration caching, randomized generation,
 * validation, and cloud synchronization with the Apps Script backend.
 */

import {
  DEFAULT_MONSTER_CONFIG,
  type MonsterConfig,
  type MonsterBodyShape,
  type MonsterBodyColor,
  type MonsterEyeType,
  type MonsterMouthType,
  type MonsterHornType,
  type MonsterCheekType,
  type MonsterPattern,
  type MonsterAccessories,
  FUTURE_SHOP_CATALOG,
} from '../types/monster.ts';
import { ApiService } from './apiService.ts';
import { CoinService } from './coinService.ts';

const MONSTER_STORAGE_PREFIX = 'ura_monster_config_';
const HATCHING_SEEN_PREFIX = 'ura_hatching_seen_';
const EVOLUTION_SEEN_PREFIX = 'ura_evolution_seen_';

export const MONSTER_OPTIONS = {
  shapes: ['blob', 'fuzzy', 'sprout', 'slime', 'chubby', 'star'] as MonsterBodyShape[],
  colors: ['cyan', 'purple', 'pink', 'lime', 'orange', 'amber', 'emerald', 'indigo'] as MonsterBodyColor[],
  eyes: ['anime', 'cyclops', 'sleepy', 'wink', 'three_eyes', 'googly'] as MonsterEyeType[],
  mouths: ['smile', 'fang_grin', 'laughing', 'goofy_teeth', 'cat_mouth', 'whistle'] as MonsterMouthType[],
  horns: ['antennae', 'none', 'single_horn', 'twin_horns', 'leaves', 'cat_ears'] as MonsterHornType[],
  cheeks: ['blush_dots', 'none', 'freckles', 'spiral', 'stars'] as MonsterCheekType[],
  patterns: ['belly_patch', 'none', 'spots', 'stripes', 'heart'] as MonsterPattern[],
};

export const MONSTER_NAMES = [
  'Pip', 'Gizmo', 'Bubbles', 'Ziggy', 'Mochi', 'Nori', 'Sparky', 'Pixel',
  'Toby', 'Milo', 'Boba', 'Lulu', 'Cosmo', 'Waffles', 'Peanut', 'Nova',
];

export class MonsterService {
  /**
   * Get student monster configuration, reading from cache with safe default fallback.
   */
  public static getMonster(studentNumber?: string): MonsterConfig {
    if (!studentNumber) {
      return { ...DEFAULT_MONSTER_CONFIG };
    }

    try {
      const raw = localStorage.getItem(`${MONSTER_STORAGE_PREFIX}${studentNumber}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        return this.validateConfig(parsed);
      }
    } catch {
      // Fallback
    }

    return { ...DEFAULT_MONSTER_CONFIG };
  }

  /**
   * Updates the locally cached monster for a student in localStorage.
   */
  public static updateCachedMonster(studentNumber: string, config: MonsterConfig): MonsterConfig {
    const validated = this.validateConfig(config);
    if (studentNumber) {
      try {
        localStorage.setItem(`${MONSTER_STORAGE_PREFIX}${studentNumber}`, JSON.stringify(validated));
      } catch (e) {
        console.warn('[MonsterService] Failed to cache monster to localStorage:', e);
      }
    }
    return validated;
  }

  /**
   * Resolves the authoritative monster between a candidate config (e.g. from session or profile)
   * and the local persistent cache for the given student.
   * Ensures customized monsters are never overwritten by stale default Pip during page refresh.
   */
  public static resolveMonster(config?: MonsterConfig | null, studentNumber?: string): MonsterConfig {
    const cached = studentNumber ? this.getMonster(studentNumber) : null;
    if (!config) return cached || { ...DEFAULT_MONSTER_CONFIG };
    if (!cached) return this.validateConfig(config);

    // If both have timestamps, the newer one wins
    if (cached.updatedAt && config.updatedAt) {
      const cachedTime = new Date(cached.updatedAt).getTime();
      const configTime = new Date(config.updatedAt).getTime();
      if (!isNaN(cachedTime) && !isNaN(configTime)) {
        return cachedTime >= configTime ? cached : this.validateConfig(config);
      }
    }

    // Default vs Custom: A customized configuration always wins over default Pip
    const isDefaultConfig = config.name === 'Pip' && config.bodyColor === 'cyan' && config.bodyShape === 'blob';
    const isDefaultCached = cached.name === 'Pip' && cached.bodyColor === 'cyan' && cached.bodyShape === 'blob';

    if (isDefaultConfig && !isDefaultCached) return cached;
    if (!isDefaultConfig && isDefaultCached) return this.validateConfig(config);

    // If candidate has an explicit update timestamp but cached does not, candidate wins
    if (config.updatedAt && !cached.updatedAt) return this.validateConfig(config);
    if (!config.updatedAt && cached.updatedAt) return cached;

    return this.validateConfig(config);
  }

  /**
   * Fetches student monster configuration directly from backend (Phase 8A).
   * Restores customizations across devices, after cache clears, or on fresh login.
   */
  public static async fetchMonster(
    studentNumber: string,
    sessionToken: string
  ): Promise<{ success: boolean; monster: MonsterConfig; totalCoins?: number; error?: string }> {
    if (!sessionToken || !studentNumber) {
      const local = this.getMonster(studentNumber);
      return { success: true, monster: local };
    }

    try {
      const response = await ApiService.getMonster(sessionToken);
      if (response && response.success && response.monster) {
        const validated = this.updateCachedMonster(studentNumber, response.monster);
        return { success: true, monster: validated, totalCoins: response.totalCoins };
      }
      return {
        success: false,
        monster: this.getMonster(studentNumber),
        error: response?.error || 'Failed to fetch monster from cloud',
      };
    } catch (err) {
      return {
        success: false,
        monster: this.getMonster(studentNumber),
        error: err instanceof Error ? err.message : 'Network error fetching monster',
      };
    }
  }

  /**
   * Save monster configuration to local storage and sync to backend.
   * STRICT REQUIREMENT: Only returns success: true if backend confirms persistent save
   * when sessionToken is provided.
   */
  public static async saveMonster(
    studentNumber: string,
    sessionToken: string,
    config: MonsterConfig
  ): Promise<{ success: boolean; monster: MonsterConfig; totalCoins?: number; error?: string }> {
    const validated = this.validateConfig(config);
    validated.updatedAt = new Date().toISOString();

    if (!sessionToken) {
      // Unauthenticated / guest play: save to local cache only
      this.updateCachedMonster(studentNumber, validated);
      return { success: true, monster: validated };
    }

    try {
      const response = await ApiService.saveMonster(sessionToken, validated);

      if (response && response.success && response.monster) {
        const serverMonster = this.updateCachedMonster(studentNumber, response.monster);
        return { success: true, monster: serverMonster, totalCoins: response.totalCoins };
      }

      return {
        success: false,
        monster: validated,
        error: response?.error || 'Server rejected monster save. Please try again.',
      };
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Network error saving monster.';
      console.warn('[MonsterService] Cloud save failed:', errMsg);
      return {
        success: false,
        monster: validated,
        error: errMsg,
      };
    }
  }

  /**
   * Generate a playful, cute random monster configuration ("Surprise Me!").
   */
  public static generateRandomMonster(currentName?: string): MonsterConfig {
    const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    const randomName = pick(MONSTER_NAMES);

    return {
      name: currentName && currentName !== 'Pip' ? currentName : randomName,
      bodyShape: pick(MONSTER_OPTIONS.shapes),
      bodyColor: pick(MONSTER_OPTIONS.colors),
      eyeType: pick(MONSTER_OPTIONS.eyes),
      mouthType: pick(MONSTER_OPTIONS.mouths),
      hornType: pick(MONSTER_OPTIONS.horns),
      cheekType: pick(MONSTER_OPTIONS.cheeks),
      pattern: pick(MONSTER_OPTIONS.patterns),
      accessories: {},
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Strict validator ensuring all monster properties conform to approved options.
   */
  public static validateConfig(raw: Partial<MonsterConfig>): MonsterConfig {
    const shape = MONSTER_OPTIONS.shapes.includes(raw.bodyShape as MonsterBodyShape)
      ? (raw.bodyShape as MonsterBodyShape)
      : 'blob';

    const color = MONSTER_OPTIONS.colors.includes(raw.bodyColor as MonsterBodyColor)
      ? (raw.bodyColor as MonsterBodyColor)
      : 'cyan';

    const eyes = MONSTER_OPTIONS.eyes.includes(raw.eyeType as MonsterEyeType)
      ? (raw.eyeType as MonsterEyeType)
      : 'anime';

    const mouth = MONSTER_OPTIONS.mouths.includes(raw.mouthType as MonsterMouthType)
      ? (raw.mouthType as MonsterMouthType)
      : 'smile';

    const horn = MONSTER_OPTIONS.horns.includes(raw.hornType as MonsterHornType)
      ? (raw.hornType as MonsterHornType)
      : 'antennae';

    const cheeks = MONSTER_OPTIONS.cheeks.includes(raw.cheekType as MonsterCheekType)
      ? (raw.cheekType as MonsterCheekType)
      : 'blush_dots';

    const pattern = MONSTER_OPTIONS.patterns.includes(raw.pattern as MonsterPattern)
      ? (raw.pattern as MonsterPattern)
      : 'belly_patch';

    const name = String(raw.name || 'Pip').trim().substring(0, 24) || 'Pip';

    return {
      name,
      bodyShape: shape,
      bodyColor: color,
      eyeType: eyes,
      mouthType: mouth,
      hornType: horn,
      cheekType: cheeks,
      pattern,
      accessories: raw.accessories || {},
      updatedAt: raw.updatedAt,
    };
  }

  /**
   * Check whether student has seen the egg hatching celebration (Phase 8B).
   */
  public static hasSeenHatching(studentNumber?: string): boolean {
    if (!studentNumber) return false;
    try {
      return localStorage.getItem(`${HATCHING_SEEN_PREFIX}${studentNumber}`) === 'true';
    } catch {
      return false;
    }
  }

  /**
   * Marks egg hatching celebration as seen to prevent endless celebration popups (Phase 8B).
   */
  public static markHatchingSeen(studentNumber?: string): void {
    if (!studentNumber) return;
    try {
      localStorage.setItem(`${HATCHING_SEEN_PREFIX}${studentNumber}`, 'true');
    } catch {
      // Storage unavailable
    }
  }

  /**
   * Check whether student has seen a specific evolution celebration modal (Phase 8B).
   */
  public static hasSeenEvolution(studentNumber: string, tier: number): boolean {
    if (!studentNumber) return false;
    try {
      return localStorage.getItem(`${EVOLUTION_SEEN_PREFIX}${studentNumber}_tier_${tier}`) === 'true';
    } catch {
      return false;
    }
  }

  /**
   * Marks a specific evolution tier modal as seen (Phase 8B).
   */
  public static markEvolutionSeen(studentNumber: string, tier: number): void {
    if (!studentNumber) return;
    try {
      localStorage.setItem(`${EVOLUTION_SEEN_PREFIX}${studentNumber}_tier_${tier}`, 'true');
    } catch {
      // Storage unavailable
    }
  }

  /**
   * Gets list of owned accessory IDs for a student (Phase 8B).
   */
  public static getOwnedAccessories(studentNumber?: string): string[] {
    const monster = this.getMonster(studentNumber);
    return monster.accessories?.owned || [];
  }

  /**
   * Purchases an accessory with Monster Coins, updating both backend and local cache (Phase 8B).
   */
  public static async purchaseAccessory(
    studentNumber: string,
    sessionToken: string | undefined,
    studentClass: string | undefined,
    itemId: string
  ): Promise<{ success: boolean; monster: MonsterConfig; totalCoins?: number; error?: string }> {
    const item = FUTURE_SHOP_CATALOG.find((it) => it.id === itemId);
    if (!item) {
      return { success: false, monster: this.getMonster(studentNumber), error: 'Accessory not found in shop catalog.' };
    }

    const currentMonster = this.getMonster(studentNumber);
    const owned = currentMonster.accessories?.owned || [];
    if (owned.includes(itemId)) {
      return { success: false, monster: currentMonster, error: 'You already own this accessory!' };
    }

    if (sessionToken) {
      try {
        const response = await ApiService.purchaseAccessory(sessionToken, itemId);
        if (response && response.success && response.monster) {
          const updated = this.updateCachedMonster(studentNumber, response.monster);
          if (response.totalCoins !== undefined) {
            CoinService.setBalance(studentNumber, response.totalCoins);
          }
          return { success: true, monster: updated, totalCoins: response.totalCoins };
        }
        return {
          success: false,
          monster: currentMonster,
          error: response?.error || 'Shop purchase failed on server.',
        };
      } catch (err) {
        return {
          success: false,
          monster: currentMonster,
          error: err instanceof Error ? err.message : 'Network error during purchase.',
        };
      }
    }

    // Offline / guest fallback
    const balance = CoinService.getBalance(studentNumber);
    if (balance < item.price) {
      return { success: false, monster: currentMonster, error: `Not enough Monster Coins! Need ${item.price} coins.` };
    }

    CoinService.deductCoins(studentNumber, studentClass || '', item.price, itemId);
    const updatedAccessories: MonsterAccessories = {
      ...currentMonster.accessories,
      owned: [...owned, itemId],
    };
    const updatedMonster: MonsterConfig = {
      ...currentMonster,
      accessories: updatedAccessories,
      updatedAt: new Date().toISOString(),
    };
    const cached = this.updateCachedMonster(studentNumber, updatedMonster);
    return { success: true, monster: cached, totalCoins: CoinService.getBalance(studentNumber) };
  }

  /**
   * Equips or unequips an owned accessory slot (Phase 8B).
   */
  public static async equipAccessory(
    studentNumber: string,
    sessionToken: string | undefined,
    slot: 'hat' | 'glasses' | 'clothing' | 'wings' | 'aura' | 'frame',
    itemId: string | null
  ): Promise<{ success: boolean; monster: MonsterConfig; error?: string }> {
    const currentMonster = this.getMonster(studentNumber);
    const owned = currentMonster.accessories?.owned || [];

    if (itemId && !owned.includes(itemId)) {
      return { success: false, monster: currentMonster, error: 'Cannot equip an accessory you do not own!' };
    }

    if (sessionToken) {
      try {
        const response = await ApiService.equipAccessory(sessionToken, slot, itemId);
        if (response && response.success && response.monster) {
          const updated = this.updateCachedMonster(studentNumber, response.monster);
          return { success: true, monster: updated };
        }
        return {
          success: false,
          monster: currentMonster,
          error: response?.error || 'Failed to equip accessory on server.',
        };
      } catch (err) {
        return {
          success: false,
          monster: currentMonster,
          error: err instanceof Error ? err.message : 'Network error updating equipped accessory.',
        };
      }
    }

    // Offline / guest fallback
    const updatedAccessories: MonsterAccessories = {
      ...currentMonster.accessories,
      [slot]: itemId || undefined,
    };
    const updatedMonster: MonsterConfig = {
      ...currentMonster,
      accessories: updatedAccessories,
      updatedAt: new Date().toISOString(),
    };
    const cached = this.updateCachedMonster(studentNumber, updatedMonster);
    return { success: true, monster: cached };
  }

  /**
   * Synchronizes classroom behavior reward grants into Monster World inventory (Phase 8/3.4C).
   * Maps reward grants (e.g. hat_monster_crown, wings_magic, etc.) into monster accessories.owned.
   * Guarantees:
   * 1. Preserves existing owned items, XP, coins, and equipped items.
   * 2. Prevents duplicate entries.
   * 3. Safe in offline or guest environments.
   */
  public static syncClassroomRewardOwnership(
    studentNumber: string,
    unlockedRewards: Array<{ cosmeticId?: string; rewardId?: string } | string>
  ): MonsterConfig {
    const currentMonster = this.getMonster(studentNumber);
    const existingOwned = currentMonster.accessories?.owned || [];
    const ownedSet = new Set(existingOwned);

    let changed = false;
    unlockedRewards.forEach((rwd) => {
      let cosmeticId = '';
      if (typeof rwd === 'string') {
        cosmeticId = rwd;
      } else if (rwd && typeof rwd === 'object') {
        cosmeticId = rwd.cosmeticId || rwd.rewardId || '';
      }

      if (cosmeticId && !ownedSet.has(cosmeticId)) {
        ownedSet.add(cosmeticId);
        changed = true;
      }
    });

    if (!changed) {
      return currentMonster;
    }

    const updatedAccessories: MonsterAccessories = {
      ...currentMonster.accessories,
      owned: Array.from(ownedSet),
    };

    const updatedMonster: MonsterConfig = {
      ...currentMonster,
      accessories: updatedAccessories,
      updatedAt: new Date().toISOString(),
    };

    return this.updateCachedMonster(studentNumber, updatedMonster);
  }
}
