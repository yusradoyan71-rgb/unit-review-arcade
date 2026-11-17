import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { ArcadeData, GradeId, Unit, Activity, NavigationTarget } from '../types/schema';
import { StorageService } from '../services/storageService';
import { sounds } from '../services/soundEffects';
import { useAuth } from './AuthContext';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  text: string;
}

interface ArcadeContextType {
  // Navigation
  navigation: NavigationTarget;
  navigateTo: (target: NavigationTarget) => void;
  goToHome: () => void;
  resetNavigation: () => void;
  goToGrade: (gradeId: GradeId) => void;
  goToUnit: (gradeId: GradeId, unitId: string) => void;
  goToGame: (gradeId: GradeId, unitId: string, activityId: string) => void;
  openTeacherPanel: (initialTab?: 'units' | 'activities' | 'backup' | 'tracking', targetGradeId?: GradeId) => void;

  // Data
  data: ArcadeData;
  activeGradeId: GradeId | null;
  activeUnit: Unit | null;
  activeActivity: Activity | null;

  // Unit Operations
  createUnit: (gradeId: GradeId, unitData: Omit<Unit, 'id' | 'gradeId' | 'activities' | 'order' | 'createdAt' | 'updatedAt'>) => Unit;
  updateUnit: (unitId: string, updates: Partial<Omit<Unit, 'id' | 'gradeId' | 'activities'>>) => void;
  deleteUnit: (unitId: string) => void;
  reorderUnits: (gradeId: GradeId, unitIds: string[]) => void;

  // Activity Operations
  createActivity: (unitId: string, activityData: Omit<Activity, 'id' | 'unitId' | 'order' | 'createdAt' | 'updatedAt'>) => Activity | null;
  deleteActivity: (unitId: string, activityId: string) => void;

  // Backup & Import
  exportBackupJSON: () => string;
  importBackupJSON: (jsonStr: string) => boolean;
  resetAllData: () => void;

  // Classroom & Audio Controls
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  isMuted: boolean;
  toggleMute: () => void;

  // Feedback Notifications
  toasts: ToastMessage[];
  addToast: (text: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

const NAVIGATION_STORAGE_KEY = 'unit_review_arcade_nav_target_v1';

const getInitialNavigation = (): NavigationTarget => {
  try {
    const stored = sessionStorage.getItem(NAVIGATION_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as NavigationTarget;
      if (parsed && typeof parsed.view === 'string') {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return { view: 'home' };
};

const ArcadeContext = createContext<ArcadeContextType | undefined>(undefined);

export const ArcadeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { student } = useAuth();
  const [data, setData] = useState<ArcadeData>(() => StorageService.loadData());
  const [navigation, setNavigationState] = useState<NavigationTarget>(() => getInitialNavigation());
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => sounds.isMuted());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const setNavigation = useCallback((target: NavigationTarget) => {
    setNavigationState(target);
    try {
      sessionStorage.setItem(NAVIGATION_STORAGE_KEY, JSON.stringify(target));
    } catch {
      // ignore
    }
  }, []);

  const resetNavigation = useCallback(() => {
    try {
      sessionStorage.removeItem(NAVIGATION_STORAGE_KEY);
    } catch {
      // ignore
    }
    setNavigationState({ view: 'home' });
    setToasts([]);
  }, []);

  // Strict Account & Session Isolation:
  // When student switches or logs out, immediately reset navigation to 'home',
  // clear lingering toasts, and purge session navigation storage.
  const prevStudentNumberRef = useRef<string | null>(student?.studentNumber || null);
  useEffect(() => {
    const currentNumber = student?.studentNumber || null;
    if (prevStudentNumberRef.current !== currentNumber) {
      prevStudentNumberRef.current = currentNumber;
      resetNavigation();
    }
  }, [student?.studentNumber, resetNavigation]);

  // Strict Grade & Role Navigation Guard:
  // When an authenticated student is logged in, clamp any cross-grade navigation
  // and disallow access to teacher panel.
  useEffect(() => {
    if (student) {
      if (navigation.view === 'teacher-panel') {
        setNavigation({ view: 'home' });
        return;
      }
      if (
        (navigation.view === 'unit-library' || navigation.view === 'unit-dashboard' || navigation.view === 'game-play') &&
        navigation.gradeId !== student.grade
      ) {
        setNavigation({ view: 'unit-library', gradeId: student.grade });
      } else if (navigation.view === 'games-zone' && navigation.gradeId !== student.grade) {
        setNavigation({ view: 'games-zone', gradeId: student.grade });
      }
    }
  }, [student, navigation, setNavigation]);

  // Toast notification helper
  const addToast = useCallback((text: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Listen to fullscreenchange
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Fullscreen toggle handler
  const toggleFullscreen = useCallback(() => {
    sounds.playTap();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn('Fullscreen request failed:', err);
        addToast('Fullscreen not supported or blocked by browser permissions', 'warning');
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, [addToast]);

  // Audio mute toggle
  const toggleMute = useCallback(() => {
    const nextMuted = sounds.toggleMute();
    setIsMuted(nextMuted);
    addToast(nextMuted ? 'Arcade sound effects muted' : 'Arcade sound effects enabled', 'info');
  }, [addToast]);

  // Navigation helpers with Strict Grade Protection
  const navigateTo = useCallback((target: NavigationTarget) => {
    sounds.playNavigate();
    let sanitized = { ...target };
    if (student) {
      if (sanitized.view === 'teacher-panel') {
        sanitized = { view: 'home' };
      } else if (sanitized.view === 'unit-library' && sanitized.gradeId !== student.grade) {
        sanitized.gradeId = student.grade;
      } else if (
        (sanitized.view === 'unit-dashboard' || sanitized.view === 'game-play') &&
        sanitized.gradeId !== student.grade
      ) {
        sanitized = { view: 'unit-library', gradeId: student.grade };
      } else if (sanitized.view === 'games-zone') {
        sanitized.gradeId = student.grade;
      }
    }
    setNavigation(sanitized);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [student, setNavigation]);

  const goToHome = useCallback(() => {
    sounds.playBack();
    setNavigation({ view: 'home' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setNavigation]);

  const goToGrade = useCallback((gradeId: GradeId) => {
    sounds.playTap();
    if (student && gradeId !== student.grade) {
      addToast(`Access restricted: You are registered in ${student.grade === 'grade-7' ? 'Grade 7' : 'Grade 8'}`, 'warning');
      setNavigation({ view: 'unit-library', gradeId: student.grade });
    } else {
      setNavigation({ view: 'unit-library', gradeId });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [student, addToast, setNavigation]);

  const goToUnit = useCallback((gradeId: GradeId, unitId: string) => {
    sounds.playTap();
    if (student && gradeId !== student.grade) {
      addToast(`Access restricted: You are registered in ${student.grade === 'grade-7' ? 'Grade 7' : 'Grade 8'}`, 'warning');
      setNavigation({ view: 'unit-library', gradeId: student.grade });
    } else {
      setNavigation({ view: 'unit-dashboard', gradeId, unitId });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [student, addToast, setNavigation]);

  const goToGame = useCallback((gradeId: GradeId, unitId: string, activityId: string) => {
    sounds.playNavigate();
    if (student && gradeId !== student.grade) {
      addToast(`Unauthorized: You can only play activities for ${student.grade === 'grade-7' ? 'Grade 7' : 'Grade 8'}`, 'error');
      setNavigation({ view: 'unit-library', gradeId: student.grade });
    } else {
      setNavigation({ view: 'game-play', gradeId, unitId, activityId });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [student, addToast, setNavigation]);

  const openTeacherPanel = useCallback((initialTab?: 'units' | 'activities' | 'backup' | 'tracking', targetGradeId?: GradeId) => {
    sounds.playTap();
    setNavigation({ view: 'teacher-panel', initialTab, targetGradeId });
  }, [setNavigation]);

  // Active Grade / Active Unit derived
  const activeGradeId = useMemo<GradeId | null>(() => {
    if (navigation.view === 'unit-library') return student ? student.grade : navigation.gradeId;
    if (navigation.view === 'unit-dashboard' || navigation.view === 'game-play') return student ? student.grade : navigation.gradeId;
    if (navigation.view === 'games-zone') return student ? student.grade : (navigation.gradeId || 'grade-7');
    if (navigation.view === 'teacher-panel') return navigation.targetGradeId || 'grade-7';
    return null;
  }, [navigation, student]);

  const activeUnit = useMemo<Unit | null>(() => {
    if (navigation.view === 'unit-dashboard' || navigation.view === 'game-play') {
      const units = data.units[navigation.gradeId] || [];
      return units.find((u) => u.id === navigation.unitId) || null;
    }
    return null;
  }, [navigation, data]);

  const activeActivity = useMemo<Activity | null>(() => {
    if (navigation.view === 'game-play' && activeUnit) {
      return activeUnit.activities.find((a) => a.id === navigation.activityId) || null;
    }
    return null;
  }, [navigation, activeUnit]);

  // Data operations
  const createUnit = useCallback(
    (gradeId: GradeId, unitData: Omit<Unit, 'id' | 'gradeId' | 'activities' | 'order' | 'createdAt' | 'updatedAt'>) => {
      const created = StorageService.createUnit(gradeId, unitData);
      setData(StorageService.loadData());
      sounds.playSuccess();
      addToast(`Unit "${created.title}" successfully created!`, 'success');
      return created;
    },
    [addToast]
  );

  const updateUnit = useCallback(
    (unitId: string, updates: Partial<Omit<Unit, 'id' | 'gradeId' | 'activities'>>) => {
      const updated = StorageService.updateUnit(unitId, updates);
      if (updated) {
        setData(StorageService.loadData());
        sounds.playSuccess();
        addToast('Unit details updated successfully!', 'success');
      }
    },
    [addToast]
  );

  const deleteUnit = useCallback(
    (unitId: string) => {
      const deleted = StorageService.deleteUnit(unitId);
      if (deleted) {
        setData(StorageService.loadData());
        sounds.playTap();
        addToast('Unit deleted.', 'info');
      }
    },
    [addToast]
  );

  const reorderUnits = useCallback((gradeId: GradeId, unitIds: string[]) => {
    StorageService.reorderUnits(gradeId, unitIds);
    setData(StorageService.loadData());
  }, []);

  const createActivity = useCallback(
    (unitId: string, activityData: Omit<Activity, 'id' | 'unitId' | 'order' | 'createdAt' | 'updatedAt'>) => {
      const created = StorageService.createActivity(unitId, activityData);
      if (created) {
        setData(StorageService.loadData());
        sounds.playSuccess();
        addToast(`Activity "${created.title}" created!`, 'success');
      }
      return created;
    },
    [addToast]
  );

  const deleteActivity = useCallback(
    (unitId: string, activityId: string) => {
      const deleted = StorageService.deleteActivity(unitId, activityId);
      if (deleted) {
        setData(StorageService.loadData());
        sounds.playTap();
        addToast('Activity removed.', 'info');
      }
    },
    [addToast]
  );

  const exportBackupJSON = useCallback(() => {
    sounds.playTap();
    return StorageService.exportJSON();
  }, []);

  const importBackupJSON = useCallback(
    (jsonStr: string) => {
      const result = StorageService.importJSON(jsonStr);
      if (result.success && result.data) {
        setData(result.data);
        sounds.playSuccess();
        addToast(result.message, 'success');
        return true;
      } else {
        sounds.playBack();
        addToast(result.message, 'error');
        return false;
      }
    },
    [addToast]
  );

  const resetAllData = useCallback(() => {
    const empty = StorageService.clearAllData();
    setData(empty);
    sounds.playTap();
    addToast('All unit and activity content cleared to empty state.', 'warning');
  }, [addToast]);

  return (
    <ArcadeContext.Provider
      value={{
        navigation,
        navigateTo,
        goToHome,
        resetNavigation,
        goToGrade,
        goToUnit,
        goToGame,
        openTeacherPanel,
        data,
        activeGradeId,
        activeUnit,
        activeActivity,
        createUnit,
        updateUnit,
        deleteUnit,
        reorderUnits,
        createActivity,
        deleteActivity,
        exportBackupJSON,
        importBackupJSON,
        resetAllData,
        isFullscreen,
        toggleFullscreen,
        isMuted,
        toggleMute,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </ArcadeContext.Provider>
  );
};

export const useArcade = () => {
  const context = useContext(ArcadeContext);
  if (!context) {
    throw new Error('useArcade must be used within an ArcadeProvider');
  }
  return context;
};
