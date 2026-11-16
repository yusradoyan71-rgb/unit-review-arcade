/**
 * UNIT REVIEW ARCADE — PERSONALIZED LEARNING CONTEXT (PHASE 6)
 * Version: 6.0.0
 * 
 * Manages state and workflows for:
 * - My Mistakes list & real-time correction
 * - Topic Mastery progress across Grade 7 and Grade 8
 * - Smart Review session launch and evaluation
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
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

  // Synchronize or load personalized learning data
  const refreshPersonalizedData = useCallback(async () => {
    if (!studentNumber) {
      setMistakes([]);
      setMastery(null);
      return;
    }

    // 1. Immediately load fast cached data
    const cachedMistakes = PersonalizedLearningService.getCachedMistakes(studentNumber);
    if (cachedMistakes.length > 0) {
      setMistakes(PersonalizedLearningService.enrichMistakes(cachedMistakes, data));
    }

    const cachedMastery = PersonalizedLearningService.getCachedMastery(studentNumber);
    if (cachedMastery) {
      setMastery(cachedMastery);
    } else {
      setMastery(
        PersonalizedLearningService.generateOfflineBaselineMastery(
          data,
          studentNumber,
          student?.displayName || student?.firstName || `Student ${studentNumber}`,
          student?.class || '8A'
        )
      );
    }

    // If no session token (or in classroom mode), client cache suffices
    if (!sessionToken || authMode !== 'student') {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 2. Fetch fresh mistakes and mastery in parallel
      const [mistakesRes, masteryRes] = await Promise.all([
        ApiService.getStudentMistakes(sessionToken),
        ApiService.getStudentMastery(sessionToken),
      ]);

      if (mistakesRes.success && mistakesRes.mistakes) {
        const enriched = PersonalizedLearningService.enrichMistakes(mistakesRes.mistakes, data);
        setMistakes(enriched);
        PersonalizedLearningService.saveCachedMistakes(studentNumber, enriched);
      }

      if (masteryRes.success && masteryRes.mastery) {
        setMastery(masteryRes.mastery);
        PersonalizedLearningService.saveCachedMastery(studentNumber, masteryRes.mastery);
      }
    } catch (err) {
      console.warn('Personalized learning fetch fallback to offline cache:', err);
    } finally {
      setIsLoading(false);
    }
  }, [studentNumber, sessionToken, authMode, data, student]);

  useEffect(() => {
    refreshPersonalizedData();
  }, [refreshPersonalizedData]);

  // Count uncorrected mistakes
  const uncorrectedMistakesCount = useMemo(() => {
    return mistakes.filter((m) => !m.isCorrected).length;
  }, [mistakes]);

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
      const session = PersonalizedLearningService.generateSmartReviewSession(
        data,
        studentNumber,
        gradeId,
        unitId,
        maxQuestions
      );
      setActiveReviewSession(session);
      setIsSmartReviewModalOpen(true);
      return session;
    },
    [data, studentNumber]
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
    mistakes,
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
