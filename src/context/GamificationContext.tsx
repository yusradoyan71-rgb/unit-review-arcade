/**
 * UNIT REVIEW ARCADE — STUDENT GAMIFICATION CONTEXT (PHASE 5)
 * Version: 5.0.0
 * 
 * Manages client-side student gamification state: total XP, level progress,
 * badges shelf, and privacy-sanitized class leaderboards.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { ApiService } from '../services/apiService';
import type { StudentClass } from '../types/auth';
import type { StudentGamificationProfile, ClassLeaderboard } from '../types/gamification';

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
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

const STORAGE_KEY_CACHED_PROFILE = 'unit_review_arcade_cached_gamification_profile_v1';

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authMode, student, sessionToken } = useAuth();

  // Synchronously seed initial cached profile for instant, zero-flicker UI
  const [profile, setProfile] = useState<StudentGamificationProfile | null>(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY_CACHED_PROFILE);
      if (stored) {
        return JSON.parse(stored) as StudentGamificationProfile;
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

  // Fetch full student profile from backend
  const refreshProfile = useCallback(async () => {
    if (!sessionToken || authMode !== 'student') return;

    setIsLoadingProfile(true);
    setProfileError(null);

    try {
      const res = await ApiService.getStudentProfile(sessionToken);
      if (res.success && res.profile) {
        setProfile(res.profile);
        try {
          sessionStorage.setItem(STORAGE_KEY_CACHED_PROFILE, JSON.stringify(res.profile));
        } catch {
          // ignore
        }
      } else {
        setProfileError(res.error || 'Failed to load profile.');
      }
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : 'Server unreachable.');
    } finally {
      setIsLoadingProfile(false);
    }
  }, [sessionToken, authMode]);

  // Fetch class leaderboard from backend
  const refreshLeaderboard = useCallback(
    async (targetClass?: StudentClass) => {
      if (!sessionToken || authMode !== 'student') return;

      const cls = targetClass || activeLeaderboardClass;
      setIsLoadingLeaderboard(true);
      setLeaderboardError(null);

      try {
        const res = await ApiService.getClassLeaderboard(sessionToken, cls);
        if (res.success && res.leaderboard) {
          setLeaderboard(res.leaderboard);
        } else {
          setLeaderboardError(res.error || 'Failed to load leaderboard.');
        }
      } catch (err) {
        setLeaderboardError(err instanceof Error ? err.message : 'Server unreachable.');
      } finally {
        setIsLoadingLeaderboard(false);
      }
    },
    [sessionToken, authMode, activeLeaderboardClass]
  );

  // Auto-fetch profile on initial login
  useEffect(() => {
    if (authMode === 'student' && sessionToken) {
      refreshProfile();
    } else {
      setProfile(null);
      setLeaderboard(null);
      try {
        sessionStorage.removeItem(STORAGE_KEY_CACHED_PROFILE);
      } catch {
        // ignore
      }
    }
  }, [authMode, sessionToken, refreshProfile]);

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
    };
  }
  return context;
};
