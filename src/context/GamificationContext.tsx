/**
 * UNIT REVIEW ARCADE — STUDENT GAMIFICATION CONTEXT (PHASE 5)
 * Version: 5.0.0
 * 
 * Manages client-side student gamification state: total XP, level progress,
 * badges shelf, and privacy-sanitized class leaderboards.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { ApiService } from '../services/apiService';
import { MonsterService } from '../services/monsterService';
import type { StudentClass } from '../types/auth';
import type { StudentGamificationProfile, ClassLeaderboard } from '../types/gamification';
import type { MonsterConfig } from '../types/monster';

interface GamificationContextType {
  profile: StudentGamificationProfile | null;
  leaderboard: ClassLeaderboard | null;
  isLoadingProfile: boolean;
  isLoadingLeaderboard: boolean;
  profileError: string | null;
  leaderboardError: string | null;

  // Modals & Navigation
  isProfileModalOpen: boolean;
  isLeaderboardModalOpen: boolean;
  activeLeaderboardClass: StudentClass;
  openProfileModal: () => void;
  openLeaderboardModal: (initialClass?: StudentClass) => void;
  closeModals: () => void;
  selectLeaderboardClass: (classId: StudentClass) => void;
  refreshProfile: () => Promise<void>;
  refreshLeaderboard: (classId?: StudentClass) => Promise<void>;
  updateProfileMonster: (monster: MonsterConfig) => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

const STORAGE_KEY_CACHED_PROFILE_PREFIX = 'ura_cached_gamification_profile_';
const LEGACY_STORAGE_KEY_CACHED_PROFILE = 'unit_review_arcade_cached_gamification_profile_v1';

const getProfileStorageKey = (studentNumber?: string): string | null => {
  return studentNumber ? `${STORAGE_KEY_CACHED_PROFILE_PREFIX}${studentNumber}` : null;
};

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authMode, student, sessionToken } = useAuth();
  const currentStudentNumber = student?.studentNumber || null;

  // Synchronously seed initial cached profile for instant, zero-flicker UI strictly scoped to current student
  const [profile, setProfile] = useState<StudentGamificationProfile | null>(() => {
    if (!currentStudentNumber) return null;
    try {
      const key = getProfileStorageKey(currentStudentNumber);
      if (key) {
        const stored = sessionStorage.getItem(key);
        if (stored) {
          return JSON.parse(stored) as StudentGamificationProfile;
        }
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [leaderboard, setLeaderboard] = useState<ClassLeaderboard | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState<boolean>(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [leaderboardError, setLeaderboardError] = useState<string | null>(null);

  // Modals
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState<boolean>(false);
  const [activeLeaderboardClass, setActiveLeaderboardClass] = useState<StudentClass>(
    student?.class || '8A'
  );

  // Update default active class when student logs in
  useEffect(() => {
    if (student?.class) {
      setActiveLeaderboardClass(student.class);
    }
  }, [student?.class]);

  // Keep a ref of active session credentials to discard stale in-flight async requests
  const activeSessionRef = useRef<{ sessionToken: string | null; studentNumber: string | null }>({
    sessionToken,
    studentNumber: currentStudentNumber,
  });

  useEffect(() => {
    activeSessionRef.current = {
      sessionToken,
      studentNumber: currentStudentNumber,
    };
  }, [sessionToken, currentStudentNumber]);

  // Account Switch & Logout Cleanup Guard:
  // Reset modals, errors, and in-memory profile immediately when account changes or logs out
  const prevStudentNumberRef = useRef<string | null>(currentStudentNumber);
  useEffect(() => {
    if (prevStudentNumberRef.current !== currentStudentNumber) {
      prevStudentNumberRef.current = currentStudentNumber;

      setIsProfileModalOpen(false);
      setIsLeaderboardModalOpen(false);
      setProfileError(null);
      setLeaderboardError(null);
      setLeaderboard(null);

      // Clean legacy global cache key if present
      try {
        sessionStorage.removeItem(LEGACY_STORAGE_KEY_CACHED_PROFILE);
      } catch {
        // ignore
      }

      if (!currentStudentNumber || authMode !== 'student' || !sessionToken) {
        setProfile(null);
      } else {
        const key = getProfileStorageKey(currentStudentNumber);
        let cached: StudentGamificationProfile | null = null;
        if (key) {
          try {
            const stored = sessionStorage.getItem(key);
            if (stored) cached = JSON.parse(stored);
          } catch {
            // ignore
          }
        }
        setProfile(cached);
      }
    }
  }, [currentStudentNumber, authMode, sessionToken]);

  // Fetch full student profile from backend
  const refreshProfile = useCallback(async () => {
    if (!sessionToken || authMode !== 'student' || !currentStudentNumber) return;

    const requestToken = sessionToken;
    const requestStudentNum = currentStudentNumber;

    setIsLoadingProfile(true);
    setProfileError(null);

    try {
      const res = await ApiService.getStudentProfile(requestToken);

      // Guard against stale asynchronous response!
      // If student logged out or switched while request was in-flight, discard!
      if (
        activeSessionRef.current.sessionToken !== requestToken ||
        activeSessionRef.current.studentNumber !== requestStudentNum
      ) {
        return;
      }

      if (res.success && res.profile) {
        const resolvedMonster = MonsterService.resolveMonster(
          res.profile.monster,
          res.profile.studentNumber
        );
        const resolvedProfile: StudentGamificationProfile = {
          ...res.profile,
          monster: resolvedMonster,
        };
        if (resolvedProfile.studentNumber && resolvedMonster) {
          MonsterService.updateCachedMonster(resolvedProfile.studentNumber, resolvedMonster);
        }
        setProfile(resolvedProfile);
        try {
          const key = getProfileStorageKey(requestStudentNum);
          if (key) {
            sessionStorage.setItem(key, JSON.stringify(resolvedProfile));
          }
        } catch {
          // ignore
        }
      } else {
        setProfileError(res.error || 'Failed to load profile.');
      }
    } catch (err) {
      if (
        activeSessionRef.current.sessionToken === requestToken &&
        activeSessionRef.current.studentNumber === requestStudentNum
      ) {
        setProfileError(err instanceof Error ? err.message : 'Server unreachable.');
      }
    } finally {
      if (
        activeSessionRef.current.sessionToken === requestToken &&
        activeSessionRef.current.studentNumber === requestStudentNum
      ) {
        setIsLoadingProfile(false);
      }
    }
  }, [sessionToken, authMode, currentStudentNumber]);

  // Fetch class leaderboard from backend
  const refreshLeaderboard = useCallback(
    async (targetClass?: StudentClass) => {
      if (!sessionToken || authMode !== 'student') return;

      const requestToken = sessionToken;
      const requestStudentNum = currentStudentNumber;
      const cls = targetClass || activeLeaderboardClass;
      setIsLoadingLeaderboard(true);
      setLeaderboardError(null);

      try {
        const res = await ApiService.getClassLeaderboard(requestToken, cls);
        if (
          activeSessionRef.current.sessionToken !== requestToken ||
          activeSessionRef.current.studentNumber !== requestStudentNum
        ) {
          return;
        }

        if (res.success && res.leaderboard) {
          setLeaderboard(res.leaderboard);
        } else {
          setLeaderboardError(res.error || 'Failed to load leaderboard.');
        }
      } catch (err) {
        if (activeSessionRef.current.sessionToken === requestToken) {
          setLeaderboardError(err instanceof Error ? err.message : 'Server unreachable.');
        }
      } finally {
        if (activeSessionRef.current.sessionToken === requestToken) {
          setIsLoadingLeaderboard(false);
        }
      }
    },
    [sessionToken, authMode, activeLeaderboardClass, currentStudentNumber]
  );

  // Auto-fetch profile on initial login
  useEffect(() => {
    if (authMode === 'student' && sessionToken && currentStudentNumber) {
      refreshProfile();
    } else {
      setProfile(null);
      setLeaderboard(null);
      setIsProfileModalOpen(false);
      setIsLeaderboardModalOpen(false);
    }
  }, [authMode, sessionToken, currentStudentNumber, refreshProfile]);

  // Keep profile in sync with updated student properties (e.g., totalCoins)
  useEffect(() => {
    if (!profile || !student) return;
    if (student.studentNumber !== profile.studentNumber) return;

    let changed = false;
    const updated = { ...profile };

    if (student.totalCoins !== undefined && updated.totalCoins !== student.totalCoins) {
      updated.totalCoins = student.totalCoins;
      changed = true;
    }

    if (changed) {
      setProfile(updated);
      const key = getProfileStorageKey(student.studentNumber);
      if (key) {
        try {
          sessionStorage.setItem(key, JSON.stringify(updated));
        } catch {
          // ignore
        }
      }
    }
  }, [student?.totalCoins, student?.studentNumber, profile]);

  const openProfileModal = useCallback(() => {
    setIsProfileModalOpen(true);
    setIsLeaderboardModalOpen(false);
    refreshProfile();
  }, [refreshProfile]);

  const openLeaderboardModal = useCallback(
    (initialClass?: StudentClass) => {
      const target = initialClass || student?.class || '8A';
      setActiveLeaderboardClass(target);
      setIsLeaderboardModalOpen(true);
      setIsProfileModalOpen(false);
      refreshLeaderboard(target);
    },
    [student?.class, refreshLeaderboard]
  );

  const closeModals = useCallback(() => {
    setIsProfileModalOpen(false);
    setIsLeaderboardModalOpen(false);
  }, []);

  const selectLeaderboardClass = useCallback(
    (classId: StudentClass) => {
      setActiveLeaderboardClass(classId);
      refreshLeaderboard(classId);
    },
    [refreshLeaderboard]
  );

  const updateProfileMonster = useCallback((monster: MonsterConfig) => {
    setProfile(prev => {
      if (!prev) return prev;
      const updated: StudentGamificationProfile = { ...prev, monster };
      if (prev.studentNumber) {
        MonsterService.updateCachedMonster(prev.studentNumber, monster);
      }
      try {
        const key = getProfileStorageKey(prev.studentNumber);
        if (key) {
          sessionStorage.setItem(key, JSON.stringify(updated));
        }
      } catch (err) {
        console.warn('Failed to cache updated profile monster:', err);
      }
      return updated;
    });
  }, []);

  return (
    <GamificationContext.Provider
      value={{
        profile,
        leaderboard,
        isLoadingProfile,
        isLoadingLeaderboard,
        profileError,
        leaderboardError,
        isProfileModalOpen,
        isLeaderboardModalOpen,
        activeLeaderboardClass,
        openProfileModal,
        openLeaderboardModal,
        closeModals,
        selectLeaderboardClass,
        refreshProfile,
        refreshLeaderboard,
        updateProfileMonster,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    // Return inert fallback if used outside provider
    return {
      profile: null,
      leaderboard: null,
      isLoadingProfile: false,
      isLoadingLeaderboard: false,
      profileError: null,
      leaderboardError: null,
      isProfileModalOpen: false,
      isLeaderboardModalOpen: false,
      activeLeaderboardClass: '8A' as StudentClass,
      openProfileModal: () => {},
      openLeaderboardModal: () => {},
      closeModals: () => {},
      selectLeaderboardClass: () => {},
      refreshProfile: async () => {},
      refreshLeaderboard: async () => {},
      updateProfileMonster: () => {},
    };
  }
  return context;
};
