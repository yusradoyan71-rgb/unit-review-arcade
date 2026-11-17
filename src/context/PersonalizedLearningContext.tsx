/**
 * UNIT REVIEW ARCADE — PERSONALIZED LEARNING CONTEXT (PHASE 6)
 * Version: 6.0.0
 * 
 * Manages state and workflows for:
 * - My Mistakes list & real-time correction
 * - Topic Mastery progress across Grade 7 and Grade 8
 * - Smart Review session launch and evaluation
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from './AuthContext';
import { useArcade } from './ArcadeContext';
import { ApiService } from '../services/apiService';
import { PersonalizedLearningService } from '../services/personalizedLearningService';
import type { 
  StudentMistakeRecord, 
  StudentTopicMasteryOverview, 
  SmartReviewSession 
} from '../types/personalizedLearning';
import type { GradeId } from '../types/schema';

interface PersonalizedLearningContextValue {
  mistakes: StudentMistakeRecord[];
  mastery: StudentTopicMasteryOverview | null;
  isLoading: boolean;
  error: string | null;
  uncorrectedMistakesCount: number;
  
  // Modals
  isMistakesModalOpen: boolean;
  openMistakesModal: () => void;
  closeMistakesModal: () => void;

  isMasteryModalOpen: boolean;
  openMasteryModal: () => void;
  closeMasteryModal: () => void;

  isSmartReviewModalOpen: boolean;
  activeReviewSession: SmartReviewSession | null;
  openSmartReviewModal: (session?: SmartReviewSession) => void;
  closeSmartReviewModal: () => void;
  startSmartReview: (gradeId: GradeId, unitId?: string, maxQuestions?: number) => SmartReviewSession;
  
  // Actions
  retryMistakeQuestion: (
    questionId: string,
    activityId: string,
    unitId: string,
    isCorrect: boolean,
    studentResponse?: string,
    correctAnswer?: string,
    questionPrompt?: string
  ) => Promise<{ success: boolean; isCorrect: boolean; xpAwarded?: number }>;
  completeSmartReviewSession: (
    sessionId: string,
    score: number,
    totalQuestions: number,
    correctedMistakeIds: string[]
  ) => void;
  refreshPersonalizedData: () => Promise<void>;
}

const PersonalizedLearningContext = createContext<PersonalizedLearningContextValue | undefined>(undefined);

export const PersonalizedLearningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { student, sessionToken, authMode } = useAuth();
  const { data } = useArcade();

  const [mistakes, setMistakes] = useState<StudentMistakeRecord[]>([]);
  const [mastery, setMastery] = useState<StudentTopicMasteryOverview | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Modal visibility states
  const [isMistakesModalOpen, setIsMistakesModalOpen] = useState(false);
  const [isMasteryModalOpen, setIsMasteryModalOpen] = useState(false);
  const [isSmartReviewModalOpen, setIsSmartReviewModalOpen] = useState(false);
  const [activeReviewSession, setActiveReviewSession] = useState<SmartReviewSession | null>(null);

  const studentNumber = student?.studentNumber || '';

  // Track active session credentials to discard stale in-flight requests from prior accounts
  const activeSessionRef = useRef<{ sessionToken: string | null; studentNumber: string }>({
    sessionToken,
    studentNumber,
  });

  useEffect(() => {
    activeSessionRef.current = { sessionToken, studentNumber };
  }, [sessionToken, studentNumber]);

  // Account Switch & Logout Cleanup Guard:
  // Immediately close all modals and clear in-memory personalized data
  const prevStudentNumberRef = useRef<string>(studentNumber);
  useEffect(() => {
    if (prevStudentNumberRef.current !== studentNumber) {
      prevStudentNumberRef.current = studentNumber;

      setIsMistakesModalOpen(false);
      setIsMasteryModalOpen(false);
      setIsSmartReviewModalOpen(false);
      setActiveReviewSession(null);
      setError(null);
      setMistakes([]);
      setMastery(null);
    }
  }, [studentNumber]);

  // Synchronize or load personalized learning data
  const refreshPersonalizedData = useCallback(async () => {
    if (!studentNumber) {
      setMistakes([]);
      setMastery(null);
      return;
    }

    const requestToken = sessionToken;
    const requestStudentNum = studentNumber;

    // 1. Immediately load fast cached data
    const cachedMistakes = PersonalizedLearningService.getCachedMistakes(requestStudentNum);
    if (cachedMistakes.length > 0) {
      setMistakes(PersonalizedLearningService.enrichMistakes(cachedMistakes, data));
    }

    const cachedMastery = PersonalizedLearningService.getCachedMastery(requestStudentNum);
    if (cachedMastery) {
      setMastery(cachedMastery);
    } else {
      setMastery(
        PersonalizedLearningService.generateOfflineBaselineMastery(
          data,
          requestStudentNum,
          student?.displayName || student?.firstName || `Student ${requestStudentNum}`,
          student?.class || '8A'
        )
      );
    }

    // If no session token (or in classroom mode), client cache suffices
    if (!requestToken || authMode !== 'student') {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 2. Fetch fresh mistakes and mastery in parallel
      const [mistakesRes, masteryRes] = await Promise.all([
        ApiService.getStudentMistakes(requestToken),
        ApiService.getStudentMastery(requestToken),
      ]);

      // Guard against stale response from previous session
      if (
        activeSessionRef.current.sessionToken !== requestToken ||
        activeSessionRef.current.studentNumber !== requestStudentNum
      ) {
        return;
      }

      if (mistakesRes.success && mistakesRes.mistakes) {
        const enriched = PersonalizedLearningService.enrichMistakes(mistakesRes.mistakes, data);
        setMistakes(enriched);
        PersonalizedLearningService.saveCachedMistakes(requestStudentNum, enriched);
      }

      if (masteryRes.success && masteryRes.mastery) {
        setMastery(masteryRes.mastery);
        PersonalizedLearningService.saveCachedMastery(requestStudentNum, masteryRes.mastery);
      }
    } catch (err) {
      console.warn('Personalized learning fetch fallback to offline cache:', err);
    } finally {
      if (
        activeSessionRef.current.sessionToken === requestToken &&
        activeSessionRef.current.studentNumber === requestStudentNum
      ) {
        setIsLoading(false);
      }
    }
  }, [studentNumber, sessionToken, authMode, data, student]);

  useEffect(() => {
    refreshPersonalizedData();
  }, [refreshPersonalizedData]);

  // Strict Grade Guard: authenticated students only see their grade's mistakes
  const visibleMistakes = useMemo(() => {
    if (!student) return mistakes;
    return mistakes.filter((m) => {
      if (m.gradeId) return m.gradeId === student.grade;
      const isG7 = m.questionId.startsWith('g7-') || m.activityId?.startsWith('g7-') || m.unitId?.startsWith('g7-');
      const isG8 = m.questionId.startsWith('g8-') || m.activityId?.startsWith('g8-') || m.unitId?.startsWith('g8-');
      if (student.grade === 'grade-7') return !isG8;
      if (student.grade === 'grade-8') return !isG7;
      return true;
    });
  }, [mistakes, student]);

  // Count uncorrected mistakes
  const uncorrectedMistakesCount = useMemo(() => {
    return visibleMistakes.filter((m) => !m.isCorrected).length;
  }, [visibleMistakes]);

  // Retries an incorrect question directly
  const retryMistakeQuestion = useCallback(
    async (
      questionId: string,
      activityId: string,
      unitId: string,
      isCorrect: boolean,
      studentResponse?: string,
      correctAnswer?: string,
      questionPrompt?: string
    ) => {
      // Guard against cross-grade question retries
      if (student) {
        const isG7 = questionId.startsWith('g7-') || activityId.startsWith('g7-') || unitId.startsWith('g7-');
        const isG8 = questionId.startsWith('g8-') || activityId.startsWith('g8-') || unitId.startsWith('g8-');
        if (student.grade === 'grade-7' && isG8) {
          console.warn('[PersonalizedLearning] Rejected cross-grade mistake retry');
          return { success: false, isCorrect: false };
        }
        if (student.grade === 'grade-8' && isG7) {
          console.warn('[PersonalizedLearning] Rejected cross-grade mistake retry');
          return { success: false, isCorrect: false };
        }
      }

      if (isCorrect) {
        // Mark corrected in local cache immediately for instantaneous UI feedback
        PersonalizedLearningService.markMistakeCorrected(studentNumber, questionId);
        setMistakes((prev) =>
          prev.map((m) =>
            m.questionId === questionId
              ? { ...m, isCorrected: true, correctedAt: new Date().toISOString(), retryAttemptsCount: (m.retryAttemptsCount || 0) + 1 }
              : m
          )
        );
      }

      // Sync with server if session active
      if (sessionToken && authMode === 'student') {
        try {
          const res = await ApiService.recordMistakeRetry(sessionToken, {
            questionId,
            activityId,
            unitId,
            isCorrect,
            studentResponse,
            correctAnswer,
            questionPrompt,
          });

          return {
            success: true,
            isCorrect,
            xpAwarded: res.data ? (res.data as { xpAwarded?: number }).xpAwarded : isCorrect ? 10 : 0,
          };
        } catch (err) {
          console.warn('Server sync for retry failed, local correction preserved:', err);
        }
      }

      return {
        success: true,
        isCorrect,
        xpAwarded: isCorrect ? 10 : 0,
      };
    },
    [studentNumber, sessionToken, authMode]
  );

  // Launches a personalized smart review session
  const startSmartReview = useCallback(
    (gradeId: GradeId, unitId?: string, maxQuestions = 10): SmartReviewSession => {
      // Force session to student's verified grade if logged in
      const effectiveGrade = student ? student.grade : gradeId;
      const session = PersonalizedLearningService.generateSmartReviewSession(
        data,
        studentNumber,
        effectiveGrade,
        unitId,
        maxQuestions
      );
      setActiveReviewSession(session);
      setIsSmartReviewModalOpen(true);
      return session;
    },
    [data, studentNumber, student]
  );

  // Completes a smart review session
  const completeSmartReviewSession = useCallback(
    (sessionId: string, score: number, totalQuestions: number, correctedMistakeIds: string[]) => {
      for (const qId of correctedMistakeIds) {
        PersonalizedLearningService.markMistakeCorrected(studentNumber, qId);
      }

      setMistakes((prev) =>
        prev.map((m) =>
          correctedMistakeIds.includes(m.questionId)
            ? { ...m, isCorrected: true, correctedAt: new Date().toISOString() }
            : m
        )
      );

      if (activeReviewSession && activeReviewSession.sessionId === sessionId) {
        setActiveReviewSession({
          ...activeReviewSession,
          completedAt: new Date().toISOString(),
          score,
          accuracyPercentage: totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 100,
          correctedMistakeIds,
        });
      }
    },
    [studentNumber, activeReviewSession]
  );

  const value: PersonalizedLearningContextValue = {
    mistakes: visibleMistakes,
    mastery,
    isLoading,
    error,
    uncorrectedMistakesCount,
    isMistakesModalOpen,
    openMistakesModal: () => setIsMistakesModalOpen(true),
    closeMistakesModal: () => setIsMistakesModalOpen(false),
    isMasteryModalOpen,
    openMasteryModal: () => setIsMasteryModalOpen(true),
    closeMasteryModal: () => setIsMasteryModalOpen(false),
    isSmartReviewModalOpen,
    activeReviewSession,
    openSmartReviewModal: (sess) => {
      if (sess) setActiveReviewSession(sess);
      setIsSmartReviewModalOpen(true);
    },
    closeSmartReviewModal: () => {
      setIsSmartReviewModalOpen(false);
      setActiveReviewSession(null);
    },
    startSmartReview,
    retryMistakeQuestion,
    completeSmartReviewSession,
    refreshPersonalizedData,
  };

  return (
    <PersonalizedLearningContext.Provider value={value}>
      {children}
    </PersonalizedLearningContext.Provider>
  );
};

export const usePersonalizedLearning = (): PersonalizedLearningContextValue => {
  const context = useContext(PersonalizedLearningContext);
  if (!context) {
    throw new Error('usePersonalizedLearning must be used within a PersonalizedLearningProvider');
  }
  return context;
};
