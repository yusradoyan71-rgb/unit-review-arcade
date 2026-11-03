import type { ArcadeData, GradeId, Unit, Activity } from '../types/schema';
import { GRADE_7_UNIT_1 } from '../data/grade7/unit1';
import { GRADE_8_UNIT_1 } from '../data/grade8/unit1';
import { GRADE_8_UNIT_2 } from '../data/grade8/unit2';
import { GRADE_8_UNIT_3 } from '../data/grade8/unit3';
import { GRADE_8_UNIT_4 } from '../data/grade8/unit4';

const STORAGE_KEY = 'unit_review_arcade_data_v1';

export const DEFAULT_INITIAL_DATA: ArcadeData = {
  version: '1.5.0',
  units: {
    'grade-7': [GRADE_7_UNIT_1],
    'grade-8': [GRADE_8_UNIT_1, GRADE_8_UNIT_2, GRADE_8_UNIT_3, GRADE_8_UNIT_4],
  },
  lastModified: new Date().toISOString(),
};

export const EMPTY_DATA: ArcadeData = {
  version: '1.5.0',
  units: {
    'grade-7': [],
    'grade-8': [],
  },
  lastModified: new Date().toISOString(),
};

export class StorageService {
  /**
   * Load arcade data from LocalStorage.
   * If non-existent or invalid, returns a strictly empty collection with 0 units.
   */
  public static loadData(): ArcadeData {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        this.saveData(DEFAULT_INITIAL_DATA);
        return DEFAULT_INITIAL_DATA;
      }
      const parsed = JSON.parse(raw) as ArcadeData;
      // Sanitize structure
      if (!parsed.units || !Array.isArray(parsed.units['grade-7']) || !Array.isArray(parsed.units['grade-8'])) {
        this.saveData(DEFAULT_INITIAL_DATA);
        return DEFAULT_INITIAL_DATA;
      }

      let hasChanges = false;

      // Check if Grade 7 has Unit 1 seeded
      const hasG7U1 = parsed.units['grade-7'].some((u) => u.id === 'g7-u1');
      if (!hasG7U1) {
        parsed.units['grade-7'] = [GRADE_7_UNIT_1, ...parsed.units['grade-7']];
        hasChanges = true;
      } else {
        // Ensure Grade 7 Unit 1 has all 8 activities
        const g7u1Idx = parsed.units['grade-7'].findIndex((u) => u.id === 'g7-u1');
        if (g7u1Idx !== -1 && parsed.units['grade-7'][g7u1Idx].activities.length < 8) {
          parsed.units['grade-7'][g7u1Idx] = GRADE_7_UNIT_1;
          hasChanges = true;
        }
      }

      // Check if Grade 8 has Unit 1 seeded
      const hasG8U1 = parsed.units['grade-8'].some((u) => u.id === 'g8-u1');
      if (!hasG8U1) {
        parsed.units['grade-8'] = [GRADE_8_UNIT_1, ...parsed.units['grade-8']];
        hasChanges = true;
      }

      // Check if Grade 8 has Unit 2 seeded
      const hasG8U2 = parsed.units['grade-8'].some((u) => u.id === 'g8-u2');
      if (!hasG8U2) {
        parsed.units['grade-8'] = [...parsed.units['grade-8'], GRADE_8_UNIT_2];
        hasChanges = true;
      } else {
        // Ensure Unit 2 has all 8 activities
        const g8u2Idx = parsed.units['grade-8'].findIndex((u) => u.id === 'g8-u2');
        if (g8u2Idx !== -1 && parsed.units['grade-8'][g8u2Idx].activities.length < 8) {
          parsed.units['grade-8'][g8u2Idx] = GRADE_8_UNIT_2;
          hasChanges = true;
        }
      }

      // Check if Grade 8 has Unit 3 seeded
      const hasG8U3 = parsed.units['grade-8'].some((u) => u.id === 'g8-u3');
      if (!hasG8U3) {
        parsed.units['grade-8'] = [...parsed.units['grade-8'], GRADE_8_UNIT_3];
        hasChanges = true;
      } else {
        // Ensure Unit 3 has all 8 activities and upgraded train_station game
        const g8u3Idx = parsed.units['grade-8'].findIndex((u) => u.id === 'g8-u3');
        if (g8u3Idx !== -1) {
          const u3 = parsed.units['grade-8'][g8u3Idx];
          const hasTrainStation = u3.activities.some((a) => a.id === 'g8-u3-act4' && a.gameType === 'train_station');
          if (u3.activities.length < 8 || !hasTrainStation) {
            parsed.units['grade-8'][g8u3Idx] = GRADE_8_UNIT_3;
            hasChanges = true;
          }
        }
      }

      // Check if Grade 8 has Unit 4 seeded
      const hasG8U4 = parsed.units['grade-8'].some((u) => u.id === 'g8-u4');
      if (!hasG8U4) {
        parsed.units['grade-8'] = [...parsed.units['grade-8'], GRADE_8_UNIT_4];
        hasChanges = true;
      } else {
        // Ensure Unit 4 has all 8 activities
        const g8u4Idx = parsed.units['grade-8'].findIndex((u) => u.id === 'g8-u4');
        if (g8u4Idx !== -1 && parsed.units['grade-8'][g8u4Idx].activities.length < 8) {
          parsed.units['grade-8'][g8u4Idx] = GRADE_8_UNIT_4;
          hasChanges = true;
        }
      }

      if (hasChanges) {
        parsed.version = '1.5.0';
        this.saveData(parsed);
      }

      return parsed;
    } catch (err) {
      console.warn('Failed to parse arcade data from localStorage, resetting to default state:', err);
      this.saveData(DEFAULT_INITIAL_DATA);
      return DEFAULT_INITIAL_DATA;
    }
  }

  /**
   * Persist arcade data to LocalStorage
   */
  public static saveData(data: ArcadeData): void {
    try {
      const updatedData: ArcadeData = {
        ...data,
        lastModified: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    } catch (err) {
      console.error('Failed to save arcade data to localStorage:', err);
    }
  }

  /**
   * Reset platform to completely empty state
   */
  public static clearAllData(): ArcadeData {
    this.saveData(DEFAULT_INITIAL_DATA);
    return DEFAULT_INITIAL_DATA;
  }

  /**
   * Create a new unit for a specific grade
   */
  public static createUnit(
    gradeId: GradeId,
    unitData: Omit<Unit, 'id' | 'gradeId' | 'activities' | 'order' | 'createdAt' | 'updatedAt'>
  ): Unit {
    const current = this.loadData();
    const gradeUnits = current.units[gradeId] || [];

    const newUnit: Unit = {
      id: `unit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      gradeId,
      unitNumber: unitData.unitNumber || gradeUnits.length + 1,
      title: unitData.title.trim(),
      description: unitData.description?.trim(),
      icon: unitData.icon || 'BookOpen',
      colorTheme: unitData.colorTheme || 'indigo',
      activities: [],
      order: gradeUnits.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    current.units[gradeId] = [...gradeUnits, newUnit];
    this.saveData(current);
    return newUnit;
  }

  /**
   * Update an existing unit
   */
  public static updateUnit(unitId: string, updates: Partial<Omit<Unit, 'id' | 'gradeId' | 'activities'>>): Unit | null {
    const current = this.loadData();
    let updatedUnit: Unit | null = null;

    for (const gradeKey of ['grade-7', 'grade-8'] as GradeId[]) {
      const index = current.units[gradeKey].findIndex((u) => u.id === unitId);
      if (index !== -1) {
        current.units[gradeKey][index] = {
          ...current.units[gradeKey][index],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        updatedUnit = current.units[gradeKey][index];
        break;
      }
    }

    if (updatedUnit) {
      this.saveData(current);
    }
    return updatedUnit;
  }

  /**
   * Delete a unit by ID
   */
  public static deleteUnit(unitId: string): boolean {
    const current = this.loadData();
    let deleted = false;

    for (const gradeKey of ['grade-7', 'grade-8'] as GradeId[]) {
      const initialLength = current.units[gradeKey].length;
      current.units[gradeKey] = current.units[gradeKey].filter((u) => u.id !== unitId);
      if (current.units[gradeKey].length !== initialLength) {
        // Re-index orders
        current.units[gradeKey].forEach((u, i) => {
          u.order = i;
        });
        deleted = true;
        break;
      }
    }

    if (deleted) {
      this.saveData(current);
    }
    return deleted;
  }

  /**
   * Reorder units within a grade
   */
  public static reorderUnits(gradeId: GradeId, reorderedUnitIds: string[]): Unit[] {
    const current = this.loadData();
    const existing = current.units[gradeId] || [];

    const unitMap = new Map(existing.map((u) => [u.id, u]));
    const reordered: Unit[] = [];

    reorderedUnitIds.forEach((id, index) => {
      const unit = unitMap.get(id);
      if (unit) {
        unit.order = index;
        reordered.push(unit);
      }
    });

    current.units[gradeId] = reordered;
    this.saveData(current);
    return reordered;
  }

  /**
   * Create an activity inside a unit
   */
  public static createActivity(
    unitId: string,
    activityData: Omit<Activity, 'id' | 'unitId' | 'order' | 'createdAt' | 'updatedAt'>
  ): Activity | null {
    const current = this.loadData();
    let createdActivity: Activity | null = null;

    for (const gradeKey of ['grade-7', 'grade-8'] as GradeId[]) {
      const unit = current.units[gradeKey].find((u) => u.id === unitId);
      if (unit) {
        const newAct: Activity = {
          ...activityData,
          id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          unitId,
          order: unit.activities.length,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        unit.activities.push(newAct);
        unit.updatedAt = new Date().toISOString();
        createdActivity = newAct;
        break;
      }
    }

    if (createdActivity) {
      this.saveData(current);
    }
    return createdActivity;
  }

  /**
   * Delete an activity by ID
   */
  public static deleteActivity(unitId: string, activityId: string): boolean {
    const current = this.loadData();
    let deleted = false;

    for (const gradeKey of ['grade-7', 'grade-8'] as GradeId[]) {
      const unit = current.units[gradeKey].find((u) => u.id === unitId);
      if (unit) {
        const initialCount = unit.activities.length;
        unit.activities = unit.activities.filter((a) => a.id !== activityId);
        if (unit.activities.length !== initialCount) {
          unit.activities.forEach((a, idx) => {
            a.order = idx;
          });
          unit.updatedAt = new Date().toISOString();
          deleted = true;
          break;
        }
      }
    }

    if (deleted) {
      this.saveData(current);
    }
    return deleted;
  }

  /**
   * Export all platform content as formatted JSON
   */
  public static exportJSON(): string {
    const data = this.loadData();
    return JSON.stringify(data, null, 2);
  }

  /**
   * Import data from JSON string with schema validation
   */
  public static importJSON(jsonStr: string): { success: boolean; message: string; data?: ArcadeData } {
    try {
      const parsed = JSON.parse(jsonStr) as ArcadeData;

      if (!parsed || typeof parsed !== 'object') {
        return { success: false, message: 'Invalid JSON: root must be an object.' };
      }

      if (!parsed.units || typeof parsed.units !== 'object') {
        return { success: false, message: 'Invalid schema: missing "units" collection.' };
      }

      if (!Array.isArray(parsed.units['grade-7']) || !Array.isArray(parsed.units['grade-8'])) {
        return { success: false, message: 'Invalid schema: units must contain grade-7 and grade-8 arrays.' };
      }

      const validData: ArcadeData = {
        version: parsed.version || '1.0.0',
        units: {
          'grade-7': parsed.units['grade-7'],
          'grade-8': parsed.units['grade-8'],
        },
        lastModified: new Date().toISOString(),
      };

      this.saveData(validData);
      return { success: true, message: 'Content successfully restored from backup!', data: validData };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown parsing error';
      return { success: false, message: `Failed to import JSON: ${errorMsg}` };
    }
  }
}
