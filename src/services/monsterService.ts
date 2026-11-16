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
} from '../types/monster.ts';
import { ApiService } from './apiService.ts';

const MONSTER_STORAGE_PREFIX = 'ura_monster_config_';

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
   * Save monster configuration to local storage and sync to backend.
   */
  public static async saveMonster(
    studentNumber: string,
    sessionToken: string,
    config: MonsterConfig
  ): Promise<{ success: boolean; monster: MonsterConfig; error?: string }> {
    const validated = this.validateConfig(config);
    validated.updatedAt = new Date().toISOString();

    // 1. Instant local persistence
    try {
      localStorage.setItem(`${MONSTER_STORAGE_PREFIX}${studentNumber}`, JSON.stringify(validated));
    } catch {}

    // 2. Cloud synchronization
    if (sessionToken) {
      try {
        const response = await ApiService.post<{
          success: boolean;
          monster?: MonsterConfig;
          totalCoins?: number;
          error?: string;
        }>({
          action: 'student_save_monster',
          sessionToken,
          monster: validated,
        });

        if (response && response.success && response.monster) {
          const serverMonster = this.validateConfig(response.monster);
          try {
            localStorage.setItem(`${MONSTER_STORAGE_PREFIX}${studentNumber}`, JSON.stringify(serverMonster));
          } catch {}
          return { success: true, monster: serverMonster };
        }
      } catch (err) {
        console.warn('[MonsterService] Cloud sync deferred (network/offline):', err);
      }
    }

    return { success: true, monster: validated };
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
}
