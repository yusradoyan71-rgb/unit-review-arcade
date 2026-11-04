/**
 * UNIT REVIEW ARCADE — AUTHENTICATION CONTEXT
 * Version: 1.0.0
 * 
 * Manages student authentication state, session validation, and seamless switching
 * between Student Mode (tracking ready) and Classroom Mode (guest smartboard play).
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { AuthMode, StudentProfile, LoginCredentials, ActiveSession } from '../types/auth';
import { ApiService } from '../services/apiService';
import { sounds } from '../services/soundEffects';

interface AuthContextType {
  authMode: AuthMode;
  student: StudentProfile | null;
  sessionToken: string | null;
  isLoading: boolean;
  isCheckingSession: boolean;
  loginError: string | null;
  isLoginModalOpen: boolean;
  isLiveBackend: boolean;

  // Actions
  openLoginModal: () => void;
  closeLoginModal: () => void;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  enterClassroomMode: () => void;
  clearError: () => void;
}

const SESSION_STORAGE_KEY = 'unit_review_arcade_active_session_v1';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authMode, setAuthMode] = useState<AuthMode>('classroom');
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCheckingSession, setIsCheckingSession] = useState<boolean>(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  const isLiveBackend = ApiService.hasLiveEndpoint();

  // 1. Recover and validate session on initial mount
  useEffect(() => {
    const recoverSession = async () => {
      try {
        const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as ActiveSession;
          if (parsed && parsed.sessionToken && parsed.student) {
            // Optimistically restore session
            setSessionToken(parsed.sessionToken);
            setStudent(parsed.student);
            setAuthMode('student');

            // Verify with backend
            const check = await ApiService.checkSession(parsed.sessionToken);
            if (check.success && check.student) {
              setStudent(check.student);
            } else {
              // Session expired or invalidated server-side
              sessionStorage.removeItem(SESSION_STORAGE_KEY);
              setSessionToken(null);
              setStudent(null);
              setAuthMode('classroom');
            }
          }
        }
      } catch (err) {
        console.warn('Failed to recover stored student session:', err);
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      } finally {
        setIsCheckingSession(false);
      }
    };

    recoverSession();
  }, []);

  const openLoginModal = useCallback(() => {
    sounds.playTap();
    setLoginError(null);
    setIsLoginModalOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    sounds.playTap();
    setIsLoginModalOpen(false);
    setLoginError(null);
  }, []);

  const clearError = useCallback(() => {
    setLoginError(null);
  }, []);

  // 2. Student Login
  const login = useCallback(
    async (credentials: LoginCredentials): Promise<boolean> => {
      setIsLoading(true);
      setLoginError(null);

      try {
        const res = await ApiService.login(credentials);

        if (res.success && res.student && res.sessionToken) {
          sounds.playSuccess();
          setStudent(res.student);
          setSessionToken(res.sessionToken);
          setAuthMode('student');
          setIsLoginModalOpen(false);

          // Persist to sessionStorage
          const sessionPayload: ActiveSession = {
            sessionToken: res.sessionToken,
            student: res.student,
            expiresAt: res.expiresAt || new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
            loginTime: new Date().toISOString(),
          };
          sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionPayload));

          return true;
        } else {
          sounds.playBack();
          setLoginError(res.error || 'Authentication failed. Please verify student number and PIN.');
          return false;
        }
      } catch (err) {
        sounds.playBack();
        const msg = err instanceof Error ? err.message : 'Login failed due to network error';
        setLoginError(msg);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // 3. Student Logout
  const logout = useCallback(async () => {
    sounds.playBack();
    const token = sessionToken;

    // Immediately clean up client state
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    setStudent(null);
    setSessionToken(null);
    setAuthMode('classroom');

    // Notify backend asynchronously
    if (token) {
      try {
        await ApiService.logout(token);
      } catch (err) {
        console.warn('Backend logout notification failed:', err);
      }
    }
  }, [sessionToken]);

  // 4. Return to / enforce Classroom Mode
  const enterClassroomMode = useCallback(() => {
    sounds.playTap();
    setAuthMode('classroom');
    setIsLoginModalOpen(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authMode,
        student,
        sessionToken,
        isLoading,
        isCheckingSession,
        loginError,
        isLoginModalOpen,
        isLiveBackend,
        openLoginModal,
        closeLoginModal,
        login,
        logout,
        enterClassroomMode,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
