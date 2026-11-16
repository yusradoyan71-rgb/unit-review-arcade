/**
 * UNIT REVIEW ARCADE — GAME TRACKING CONTEXT (PHASE 4)
 * Version: 4.0.0
 * 
 * Reusable context and hook providing automatic game attempt lifecycle,
 * persistent checkpointing, mid-game resume across all six engines,
 * in-place session recovery, and resilient offline telemetry queuing.
 */

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { TrackingService } from '../services/trackingService';
import type { Activity, Unit, GradeId } from '../types/schema';
import type { QuestionAnswerRecord, CompleteAttemptSummary, GameResumeCheckpoint } from '../types/tracking';
import type { AttemptGamificationResult } from '../types/gamification';
import { SessionRecoveryModal } from '../components/auth/SessionRecoveryModal';

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
  isOnline: boolean;

  // Checkpointing & Resume (Phase 4)
  resumeCheckpoint: GameResumeCheckpoint | null;
  saveCheckpoint: (updates: Partial<GameResumeCheckpoint>) => void;
  clearCheckpoint: () => void;

  // Gamification (Phase 5)
  lastGamification: AttemptGamificationResult | null;

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
  restartGame: () => void;
}

const GameTrackingContext = createContext<GameTrackingContextType | undefined>(undefined);

interface GameTrackingProviderProps {
  activity: Activity;
  unit: Unit;
  gradeId: GradeId;
  children: React.ReactNode;
  onRestartAttempt?: () => void;
}

export const GameTrackingProvider: React.FC<GameTrackingProviderProps> = ({
  activity,
  unit,
  gradeId,
  children,
  onRestartAttempt,
}) => {
  const { authMode, sessionToken, student, updateSessionToken } = useAuth();
  
  // Strict Grade Check: authenticated student must match the grade of the activity
  const isGradeMismatch = Boolean(
    student && (
      student.grade !== gradeId ||
      !activity.id.startsWith(student.grade === 'grade-7' ? 'g7-' : 'g8-')
    )
  );

  const isTrackingActive = authMode === 'student' && Boolean(sessionToken) && !isGradeMismatch;

  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [attemptNumber, setAttemptNumber] = useState<number | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const [syncError, setSyncError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isSessionRecoveryOpen, setIsSessionRecoveryOpen] = useState<boolean>(false);
  const [lastGamification, setLastGamification] = useState<AttemptGamificationResult | null>(null);

  // In-memory telemetry cache
  const answersRef = useRef<QuestionAnswerRecord[]>([]);
  const startTimeRef = useRef<number>(Date.now());
  const questionStartTimeRef = useRef<number>(Date.now());
  const isCompletedRef = useRef<boolean>(false);
  const attemptIdRef = useRef<string | null>(null);
  const sessionTokenRef = useRef<string | null>(sessionToken);

  // Keep sessionTokenRef synchronized
  useEffect(() => {
    sessionTokenRef.current = sessionToken;
  }, [sessionToken]);

  // Load any existing checkpoint for this student and activity
  const [resumeCheckpoint, setResumeCheckpoint] = useState<GameResumeCheckpoint | null>(() => {
    if (isGradeMismatch) return null;
    return TrackingService.getCheckpoint(student?.studentNumber, activity.id, student?.grade);
  });

  // 1. Online / Offline network monitor & auto-flush
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      const token = sessionTokenRef.current;
      if (token && attemptIdRef.current) {
        TrackingService.flushPendingAnswers(token, attemptIdRef.current);
        TrackingService.flushPendingCompletions(token);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 2. Initialize or recover attempt on mount
  useEffect(() => {
    if (!isTrackingActive || !sessionToken) {
      return;
    }

    let isMounted = true;
    const now = Date.now();
    startTimeRef.current = now;
    questionStartTimeRef.current = now;
    isCompletedRef.current = false;

    // Check for an existing attempt in sessionStorage or checkpoint
    const stored = TrackingService.getStoredAttempt();
    const checkpoint = TrackingService.getCheckpoint(student?.studentNumber, activity.id);

    if (stored && stored.activityId === activity.id && stored.status === 'in_progress') {
      // Re-hydrate existing attempt
      attemptIdRef.current = stored.attemptId;
      setAttemptId(stored.attemptId);
      if (stored.attemptNumber) {
        setAttemptNumber(stored.attemptNumber);
      }
      answersRef.current = TrackingService.getPendingAnswers(stored.attemptId);
      if (checkpoint) {
        setResumeCheckpoint(checkpoint);
      }
    } else {
      // If there was an unfinished attempt from another activity, reconcile it
      if (stored && stored.status === 'in_progress' && stored.activityId !== activity.id) {
        TrackingService.reconcileInterruptedAttempt(sessionToken, stored.attemptId);
      }

      // Check if checkpoint exists with a previous attemptId for this activity
      const targetAttemptId = checkpoint?.attemptId || TrackingService.generateAttemptId();
      attemptIdRef.current = targetAttemptId;
      setAttemptId(targetAttemptId);
      answersRef.current = [];

      TrackingService.startAttempt(sessionToken, {
        attemptId: targetAttemptId,
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

      if (checkpoint) {
        setResumeCheckpoint(checkpoint);
      }
    }

    // On unmount: preserve checkpoint, do not delete active attempt
    return () => {
      isMounted = false;
    };
  }, [activity.id, activity.title, activity.gameType, activity.questions, unit.id, unit.title, gradeId, isTrackingActive, sessionToken, student?.studentNumber]);

  // 3. Save mid-game checkpoint
  const saveCheckpoint = useCallback(
    (updates: Partial<GameResumeCheckpoint>) => {
      const curAttemptId = attemptIdRef.current;
      if (!curAttemptId) return;

      const durationSeconds = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
      const checkpoint: GameResumeCheckpoint = {
        attemptId: curAttemptId,
        activityId: activity.id,
        gradeId,
        unitId: unit.id,
        gameType: activity.gameType,
        currentIndex: updates.currentIndex ?? 0,
        score: updates.score ?? 0,
        totalQuestions: updates.totalQuestions ?? (activity.questions?.length || 1),
        answeredQuestionIds: updates.answeredQuestionIds ?? answersRef.current.map((a) => a.questionId),
        shuffledQuestionIds: updates.shuffledQuestionIds,
        currentRoundIndex: updates.currentRoundIndex,
        matchedPairIds: updates.matchedPairIds,
        mismatchCount: updates.mismatchCount,
        completedSentenceIndices: updates.completedSentenceIndices,
        timestamp: Date.now(),
        durationSeconds,
      };

      setResumeCheckpoint(checkpoint);
      TrackingService.saveCheckpoint(student?.studentNumber, checkpoint);
    },
    [activity.id, activity.gameType, activity.questions, gradeId, unit.id, student?.studentNumber]
  );

  // 4. Clear checkpoint
  const clearCheckpoint = useCallback(() => {
    setResumeCheckpoint(null);
    TrackingService.clearCheckpoint(student?.studentNumber, activity.id);
  }, [student?.studentNumber, activity.id]);

  // 5. Record individual question answer
  const recordAnswer = useCallback(
    (params: RecordAnswerParams) => {
      const currentToken = sessionTokenRef.current;
      if (!isTrackingActive || !currentToken || !attemptIdRef.current) {
        return;
      }

      const now = Date.now();
      const measuredTime = params.timeSpentSeconds ?? Math.max(1, Math.round((now - questionStartTimeRef.current) / 1000));
      questionStartTimeRef.current = now;

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
      TrackingService.recordAnswer(currentToken, attemptIdRef.current, answerRecord)
        .then(() => {
          setSyncStatus('synced');
          setSyncError(null);
        })
        .catch((err: unknown) => {
          const errMsg = err instanceof Error ? err.message : String(err);
          if (errMsg.includes('UNAUTHORIZED') || errMsg.includes('Session has expired')) {
            setIsSessionRecoveryOpen(true);
          }
          setSyncStatus('error');
          setSyncError('Saved locally');
        });
    },
    [isTrackingActive]
  );

  // 6. Complete game
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
      clearCheckpoint();

      const currentToken = sessionTokenRef.current;
      if (!isTrackingActive || !currentToken || !attemptIdRef.current) {
        return;
      }

      const durationSeconds = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
      const answeredCount = summary.answeredQuestions ?? answersRef.current.length;
      const correctCount = summary.correctAnswers ?? answersRef.current.filter((a) => a.isCorrect).length;
      const incorrectCount = summary.incorrectAnswers ?? (answersRef.current.length - answersRef.current.filter((a) => a.isCorrect).length);
      const totalEvaluated = correctCount + incorrectCount;
      const defaultPercentage = totalEvaluated > 0
        ? (incorrectCount > 0
            ? Math.round((correctCount / totalEvaluated) * 1000) / 10
            : (summary.totalQuestions > 0 ? Math.round((summary.score / summary.totalQuestions) * 100) : 100))
        : (summary.totalQuestions > 0 ? Math.round((summary.score / summary.totalQuestions) * 100) : 0);

      const completeSummary: CompleteAttemptSummary = {
        score: summary.score,
        totalQuestions: summary.totalQuestions,
        answeredQuestions: answeredCount,
        correctAnswers: correctCount,
        incorrectAnswers: incorrectCount,
        skippedQuestions: summary.skippedQuestions ?? Math.max(0, summary.totalQuestions - answeredCount),
        percentage: summary.percentage !== undefined ? summary.percentage : defaultPercentage,
        durationSeconds,
        completedAt: new Date().toISOString(),
      };

      setSyncStatus('syncing');
      const res = await TrackingService.completeAttempt(
        currentToken,
        attemptIdRef.current,
        completeSummary,
        answersRef.current,
        student?.studentNumber,
        activity.id
      );

      if (res.gamification) {
        setLastGamification(res.gamification);
      }

      if (res.success) {
        setSyncStatus('synced');
        setSyncError(null);
      } else {
        if (res.code === 'UNAUTHORIZED' || res.error?.includes('Session has expired')) {
          setIsSessionRecoveryOpen(true);
        }
        setSyncStatus('error');
        setSyncError(res.error || 'Saved locally; will synchronize when connection restores.');
      }
    },
    [isTrackingActive, clearCheckpoint, student?.studentNumber, activity.id]
  );

  // 7. Explicit abandonment (student clicks Return to Unit)
  const abandonGame = useCallback(async () => {
    isCompletedRef.current = true;
    clearCheckpoint();

    const currentToken = sessionTokenRef.current;
    if (!isTrackingActive || !currentToken || !attemptIdRef.current) {
      return;
    }

    const durationSeconds = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
    await TrackingService.abandonAttempt(
      currentToken,
      attemptIdRef.current,
      durationSeconds,
      answersRef.current
    );
  }, [isTrackingActive, clearCheckpoint]);

  // 8. Restart game (Play Again)
  const restartGame = useCallback(() => {
    clearCheckpoint();
    if (onRestartAttempt) {
      onRestartAttempt();
    }
  }, [clearCheckpoint, onRestartAttempt]);

  // 9. Retry manual sync if an error occurred
  const retrySync = useCallback(async () => {
    const currentToken = sessionTokenRef.current;
    if (!isTrackingActive || !currentToken || !attemptIdRef.current) {
      return;
    }
    setSyncStatus('syncing');
    const ok = await TrackingService.flushPendingAnswers(currentToken, attemptIdRef.current);
    await TrackingService.flushPendingCompletions(currentToken);
    if (ok) {
      setSyncStatus('synced');
      setSyncError(null);
    } else {
      setSyncStatus('error');
    }
  }, [isTrackingActive]);

  // 10. Handle in-place session recovery
  const handleSessionRecovered = useCallback(
    async (newToken: string) => {
      updateSessionToken(newToken);
      sessionTokenRef.current = newToken;
      setIsSessionRecoveryOpen(false);

      if (attemptIdRef.current) {
        setSyncStatus('syncing');
        await TrackingService.flushPendingAnswers(newToken, attemptIdRef.current);
        await TrackingService.flushPendingCompletions(newToken);
        setSyncStatus('synced');
        setSyncError(null);
      }
    },
    [updateSessionToken]
  );

  return (
    <GameTrackingContext.Provider
      value={{
        isTrackingActive,
        attemptId,
        attemptNumber,
        syncStatus,
        syncError,
        isOnline,
        resumeCheckpoint,
        saveCheckpoint,
        clearCheckpoint,
        lastGamification,
        recordAnswer,
        completeGame,
        abandonGame,
        retrySync,
        restartGame,
      }}
    >
      {children}

      {/* In-Place Session Recovery Dialog */}
      {isSessionRecoveryOpen && student && (
        <SessionRecoveryModal
          isOpen={isSessionRecoveryOpen}
          studentNumber={student.studentNumber}
          studentName={student.displayName}
          onSuccess={handleSessionRecovered}
          onCancel={() => {
            setIsSessionRecoveryOpen(false);
            abandonGame();
          }}
        />
      )}
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
      isOnline: true,
      resumeCheckpoint: null,
      saveCheckpoint: () => {},
      clearCheckpoint: () => {},
      lastGamification: null,
      recordAnswer: () => {},
      completeGame: async () => {},
      abandonGame: async () => {},
      retrySync: async () => {},
      restartGame: () => {},
    };
  }
  return context;
};
