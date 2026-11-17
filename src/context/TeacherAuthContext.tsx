/**
 * UNIT REVIEW ARCADE — TEACHER AUTH CONTEXT (PHASE 3B)
 * 
 * Manages isolated teacher authentication state, session restoration,
 * rate-limit cooldown timers, and modal view states.
 * 
 * STRICT SECURITY CONSTRAINTS:
 * 1. Tokens stored exclusively in sessionStorage (cleared when browser session ends).
 * 2. Passwords are never stored, logged, or serialized.
 * 3. Lockout state triggers client-side cooldown countdown.
 * 4. Invalid or expired sessions trigger immediate clean logout and re-authentication.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { TeacherApiService } from '../services/teacherApiService';
import type { TeacherSession, TeacherAuthErrorCode } from '../types/teacher';

const TEACHER_SESSION_STORAGE_KEY = 'unit_review_arcade_teacher_session_v3';

interface TeacherAuthContextType {
  // Session State
  isAuthenticated: boolean;
  teacherSession: TeacherSession | null;
  teacherName: string | null;
  isCheckingSession: boolean;
  
  // UI Modal States
  isLoginModalOpen: boolean;
  isDashboardOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openDashboard: () => void;
  closeDashboard: () => void;

  // Login / Lockout Status
  isLoggingIn: boolean;
  authError: string | null;
  authErrorCode: TeacherAuthErrorCode | null;
  attemptsRemaining: number | null;
  lockoutRemainingSeconds: number;
  
  // Actions
  login: (password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearAuthError: () => void;
}

const TeacherAuthContext = createContext<TeacherAuthContextType | undefined>(undefined);

export const TeacherAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [teacherSession, setTeacherSession] = useState<TeacherSession | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState<boolean>(true);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState<boolean>(false);

  const [authError, setAuthError] = useState<string | null>(null);
  const [authErrorCode, setAuthErrorCode] = useState<TeacherAuthErrorCode | null>(null);
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);
  const [lockoutRemainingSeconds, setLockoutRemainingSeconds] = useState<number>(0);

  // Clear authentication error
  const clearAuthError = useCallback(() => {
    setAuthError(null);
    setAuthErrorCode(null);
  }, []);

  // Modal controls
  const openLoginModal = useCallback(() => {
    clearAuthError();
    setIsLoginModalOpen(true);
  }, [clearAuthError]);

  const closeLoginModal = useCallback(() => {
    setIsLoginModalOpen(false);
  }, []);

  const openDashboard = useCallback(() => {
    if (teacherSession) {
      setIsDashboardOpen(true);
    } else {
      openLoginModal();
    }
  }, [teacherSession, openLoginModal]);

  const closeDashboard = useCallback(() => {
    setIsDashboardOpen(false);
  }, []);

  // Cooldown countdown timer for brute-force lockouts
  useEffect(() => {
    if (lockoutRemainingSeconds <= 0) return;

    const timer = setInterval(() => {
      setLockoutRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [lockoutRemainingSeconds]);

  // Session restoration from sessionStorage on initial load
  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const storedJson = sessionStorage.getItem(TEACHER_SESSION_STORAGE_KEY);
        if (!storedJson) {
          if (isMounted) setIsCheckingSession(false);
          return;
        }

        let parsed: TeacherSession;
        try {
          parsed = JSON.parse(storedJson);
        } catch {
          sessionStorage.removeItem(TEACHER_SESSION_STORAGE_KEY);
          if (isMounted) setIsCheckingSession(false);
          return;
        }

        if (!parsed.teacherToken || !parsed.teacherToken.startsWith('tch_')) {
          sessionStorage.removeItem(TEACHER_SESSION_STORAGE_KEY);
          if (isMounted) setIsCheckingSession(false);
          return;
        }

        // Verify session against server
        const result = await TeacherApiService.checkSession(parsed.teacherToken);
        if (!isMounted) return;

        if (result.success && result.active) {
          setTeacherSession({
            teacherToken: parsed.teacherToken,
            teacherName: result.teacherName || parsed.teacherName || 'Teacher',
            expiresAt: parsed.expiresAt,
          });
        } else {
          sessionStorage.removeItem(TEACHER_SESSION_STORAGE_KEY);
          setTeacherSession(null);
        }
      } catch {
        if (isMounted) {
          sessionStorage.removeItem(TEACHER_SESSION_STORAGE_KEY);
          setTeacherSession(null);
        }
      } finally {
        if (isMounted) setIsCheckingSession(false);
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  // Teacher Login
  const login = useCallback(async (password: string): Promise<boolean> => {
    setIsLoggingIn(true);
    clearAuthError();

    try {
      const response = await TeacherApiService.login(password);

      if (response.success && response.teacherToken) {
        const session: TeacherSession = {
          teacherToken: response.teacherToken,
          teacherName: response.teacherName || 'Teacher',
          expiresAt: response.expiresAt || new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        };

        // Persist to sessionStorage only
        sessionStorage.setItem(TEACHER_SESSION_STORAGE_KEY, JSON.stringify(session));
        setTeacherSession(session);
        setAttemptsRemaining(null);
        setLockoutRemainingSeconds(0);
        setIsLoginModalOpen(false);
        setIsDashboardOpen(true);
        return true;
      }

      // Handle specific error codes
      setAuthError(response.error || 'Authentication failed. Please verify your password.');
      setAuthErrorCode(response.code || 'UNAUTHORIZED');

      if (response.code === 'LOCKED') {
        // Parse minutes from error or default to 15 minutes
        const match = response.error?.match(/(\d+)\s*minute/i);
        const minutes = match ? parseInt(match[1], 10) : 15;
        setLockoutRemainingSeconds(minutes * 60);
      }

      if (typeof response.attemptsRemaining === 'number') {
        setAttemptsRemaining(response.attemptsRemaining);
      }

      return false;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Network communication error';
      setAuthError(`Unable to reach server: ${message}`);
      setAuthErrorCode('NETWORK_ERROR');
      return false;
    } finally {
      setIsLoggingIn(false);
    }
  }, [clearAuthError]);

  // Teacher Logout
  const logout = useCallback(async () => {
    if (teacherSession?.teacherToken) {
      try {
        await TeacherApiService.logout(teacherSession.teacherToken);
      } catch {
        // Continue local cleanup regardless
      }
    }

    sessionStorage.removeItem(TEACHER_SESSION_STORAGE_KEY);
    try {
      const navStored = sessionStorage.getItem('unit_review_arcade_nav_target_v1');
      if (navStored && navStored.includes('teacher-panel')) {
        sessionStorage.removeItem('unit_review_arcade_nav_target_v1');
      }
    } catch {
      // ignore
    }
    setTeacherSession(null);
    setIsDashboardOpen(false);
    clearAuthError();
  }, [teacherSession, clearAuthError]);

  const value: TeacherAuthContextType = {
    isAuthenticated: Boolean(teacherSession),
    teacherSession,
    teacherName: teacherSession?.teacherName || null,
    isCheckingSession,
    isLoginModalOpen,
    isDashboardOpen,
    openLoginModal,
    closeLoginModal,
    openDashboard,
    closeDashboard,
    isLoggingIn,
    authError,
    authErrorCode,
    attemptsRemaining,
    lockoutRemainingSeconds,
    login,
    logout,
    clearAuthError,
  };

  return <TeacherAuthContext.Provider value={value}>{children}</TeacherAuthContext.Provider>;
};

export const useTeacherAuth = (): TeacherAuthContextType => {
  const context = useContext(TeacherAuthContext);
  if (!context) {
    throw new Error('useTeacherAuth must be used within a TeacherAuthProvider');
  }
  return context;
};

