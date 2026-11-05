/**
 * UNIT REVIEW ARCADE — GAME TRACKING CONTEXT (PHASE 2)
 * Version: 2.0.0
 * 
 * Reusable context and hook providing automatic game attempt lifecycle
 * and telemetry tracking across all six game engines.
 * 
 * Automatically bypasses tracking in Guest Classroom Mode (zero network calls).
 * Automatically reconciles and recovers attempts across page reloads.
 */

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { TrackingService } from '../services/trackingService';
import type { Activity, Unit, GradeId } from '../types/schema';
import type { QuestionAnswerRecord, CompleteAttemptSummary } from '../types/tracking';

export interface RecordAnswerParams {
  questionId: string;
  questionOrder?: number;
  questionPrompt: string;
  studentResponse: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpentSeconds?: number;
}

interface GameTrackingContextType {
  isTrackingActive: boolean;
  attemptId: string | null;
  attemptNumber: number | null;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  syncError: string | null;

  // Tracking handlers
  recordAnswer: (params: RecordAnswerParams) => void;
  completeGame: (summary: {
    score: number;
    totalQuestions: number;
    answeredQuestions?: number;
    correctAnswers?: number;
    incorrectAnswers?: number;
    skippedQuestions?: number;
    percentage?: number;
  }) => Promise<void>;
  abandonGame: () => Promise<void>;
  retrySync: () => Promise<void>;
}

const GameTrackingContext = createContext<GameTrackingContextType | undefined>(undefined);

interface GameTrackingProviderProps {
  activity: Activity;
  unit: Unit;
  gradeId: GradeId;
  children: React.ReactNode;
}

export const GameTrackingProvider: React.FC<GameTrackingProviderProps> = ({
  activity,
  unit,
  gradeId,
  children,
}) => {
  const { authMode, sessionToken } = useAuth();
  const isTrackingActive = authMode === 'student' && Boolean(sessionToken);

  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [attemptNumber, setAttemptNumber] = useState<number | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const [syncError, setSyncError] = useState<string | null>(null);

  // In-memory telemetry cache
  const answersRef = useRef<QuestionAnswerRecord[]>([]);
  const startTimeRef = useRef<number>(Date.now());
  const questionStartTimeRef = useRef<number>(Date.now());
  const isCompletedRef = useRef<boolean>(false);
  const attemptIdRef = useRef<string | null>(null);

  // 1. Initialize or recover attempt on mount
  useEffect(() => {
    if (!isTrackingActive || !sessionToken) {
      return;
    }

    let isMounted = true;
    const now = Date.now();
    startTimeRef.current = now;
    questionStartTimeRef.current = now;
    isCompletedRef.current = false;

    // Check for an existing attempt in sessionStorage for this activity
    const stored = TrackingService.getStoredAttempt();
    if (stored && stored.activityId === activity.id && stored.status === 'in_progress') {
      // Re-hydrate existing attempt
      attemptIdRef.current = stored.attemptId;
      setAttemptId(stored.attemptId);
      if (stored.attemptNumber) {
        setAttemptNumber(stored.attemptNumber);
      }
      answersRef.current = TrackingService.getPendingAnswers(stored.attemptId);
    } else {
      // If there was an unfinished attempt from another activity, reconcile it
      if (stored && stored.status === 'in_progress' && stored.activityId !== activity.id) {
        TrackingService.reconcileInterruptedAttempt(sessionToken, stored.attemptId);
      }

      // Start new attempt
      const newAttemptId = TrackingService.generateAttemptId();
      attemptIdRef.current = newAttemptId;
      setAttemptId(newAttemptId);
      answersRef.current = [];

      TrackingService.startAttempt(sessionToken, {
        attemptId: newAttemptId,
        gradeId,
        unitId: unit.id,
        unitTitle: unit.title,
        activityId: activity.id,
        activityTitle: activity.title,
        gameType: activity.gameType,
        totalQuestions: activity.questions?.length || 1,
        startedAt: new Date(now).toISOString(),
      }).then((res) => {
        if (!isMounted) return;
        if (res.success && res.attemptNumber) {
          setAttemptNumber(res.attemptNumber);
        }
      });
    }

    // On unmount: If game was not marked completed, mark as abandoned
    return () => {
      isMounted = false;
      const currentAttemptId = attemptIdRef.current;
      if (!isCompletedRef.current && currentAttemptId && sessionToken) {
        const durationSeconds = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
        TrackingService.abandonAttempt(
          sessionToken,
          currentAttemptId,
          durationSeconds,
          answersRef.current
        );
      }
    };
  }, [activity.id, activity.title, activity.gameType, activity.questions, unit.id, unit.title, gradeId, isTrackingActive, sessionToken]);

  // 2. Record individual question answer
  const recordAnswer = useCallback(
    (params: RecordAnswerParams) => {
      if (!isTrackingActive || !sessionToken || !attemptIdRef.current) {
        return;
      }

      const now = Date.now();
      const measuredTime = params.timeSpentSeconds ?? Math.max(1, Math.round((now - questionStartTimeRef.current) / 1000));
      questionStartTimeRef.current = now; // Reset timer for next question

      const answerRecord: QuestionAnswerRecord = {
        answerId: TrackingService.generateAnswerId(),
        attemptId: attemptIdRef.current,
        questionId: params.questionId,
        questionOrder: params.questionOrder ?? (answersRef.current.length + 1),
        questionPrompt: params.questionPrompt,
        studentResponse: params.studentResponse,
        correctAnswer: params.correctAnswer,
        isCorrect: params.isCorrect,
        timeSpentSeconds: measuredTime,
        timestamp: new Date(now).toISOString(),
      };

      answersRef.current.push(answerRecord);

      // Background batch sync
      setSyncStatus('syncing');
      TrackingService.recordAnswer(sessionToken, attemptIdRef.current, answerRecord)
        .then(() => {
          setSyncStatus('synced');
          setSyncError(null);
        })
        .catch((err) => {
          console.warn('Answer sync deferred (stored in queue):', err);
          setSyncStatus('error');
          setSyncError('Saved locally');
        });
    },
    [isTrackingActive, sessionToken]
  );

  // 3. Complete game
  const completeGame = useCallback(
    async (summary: {
      score: number;
      totalQuestions: number;
      answeredQuestions?: number;
      correctAnswers?: number;
      incorrectAnswers?: number;
      skippedQuestions?: number;
      percentage?: number;
    }) => {
      isCompletedRef.current = true;
      if (!isTrackingActive || !sessionToken || !attemptIdRef.current) {
        return;
      }

      const durationSeconds = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
      const completeSummary: CompleteAttemptSummary = {
        score: summary.score,
        totalQuestions: summary.totalQuestions,
        answeredQuestions: summary.answeredQuestions ?? answersRef.current.length,
        correctAnswers: summary.correctAnswers ?? answersRef.current.filter((a) => a.isCorrect).length,
        incorrectAnswers: summary.incorrectAnswers ?? (answersRef.current.length - answersRef.current.filter((a) => a.isCorrect).length),
        skippedQuestions: summary.skippedQuestions ?? Math.max(0, summary.totalQuestions - answersRef.current.length),
        percentage: summary.percentage,
        durationSeconds,
        completedAt: new Date().toISOString(),
      };

      setSyncStatus('syncing');
      const res = await TrackingService.completeAttempt(
        sessionToken,
        attemptIdRef.current,
        completeSummary,
        answersRef.current
      );

      if (res.success) {
        setSyncStatus('synced');
        setSyncError(null);
      } else {
        setSyncStatus('error');
        setSyncError(res.error || 'Sync issue during game completion');
      }
    },
    [isTrackingActive, sessionToken]
  );

  // 4. Explicit abandonment
  const abandonGame = useCallback(async () => {
    isCompletedRef.current = true;
    if (!isTrackingActive || !sessionToken || !attemptIdRef.current) {
      return;
    }

    const durationSeconds = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
    await TrackingService.abandonAttempt(
      sessionToken,
      attemptIdRef.current,
      durationSeconds,
      answersRef.current
    );
  }, [isTrackingActive, sessionToken]);

  // 5. Retry manual sync if an error occurred
  const retrySync = useCallback(async () => {
    if (!isTrackingActive || !sessionToken || !attemptIdRef.current) {
      return;
    }
    setSyncStatus('syncing');
    const ok = await TrackingService.flushPendingAnswers(sessionToken, attemptIdRef.current);
    if (ok) {
      setSyncStatus('synced');
      setSyncError(null);
    } else {
      setSyncStatus('error');
    }
  }, [isTrackingActive, sessionToken]);

  return (
    <GameTrackingContext.Provider
      value={{
        isTrackingActive,
        attemptId,
        attemptNumber,
        syncStatus,
        syncError,
        recordAnswer,
        completeGame,
        abandonGame,
        retrySync,
      }}
    >
      {children}
    </GameTrackingContext.Provider>
  );
};

/**
 * Reusable hook for game components to report student progress.
 */
export const useGameTracking = () => {
  const context = useContext(GameTrackingContext);
  if (!context) {
    // Return inert fallback if used outside provider (e.g. standalone test)
    return {
      isTrackingActive: false,
      attemptId: null,
      attemptNumber: null,
      syncStatus: 'idle' as const,
      syncError: null,
      recordAnswer: () => {},
      completeGame: async () => {},
      abandonGame: async () => {},
      retrySync: async () => {},
    };
  }
  return context;
};
