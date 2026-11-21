/**
 * UNIT REVIEW ARCADE — GENERAL ENGLISH GAME CONTAINER (PHASE 4)
 * Version: 4.0.0
 * 
 * Dynamically mounts and executes the 6 existing game engines for General English
 * topic practice and Mixed Practice sessions.
 * 
 * Reuses:
 * - QuizBattleGame
 * - MatchItGame
 * - SentenceBuilderGame
 * - TrueFalseGame
 * - ReadingDetectiveGame
 * - TrainStationGame
 * 
 * Wraps sessions with GameTrackingProvider to award XP, Monster Coins,
 * milestone evolutions, and mistake tracking.
 */

import React, { useState, useMemo, useCallback } from 'react';
import type { GradeId, GameType, Activity } from '../../types/schema';
import { useArcade } from '../../context/ArcadeContext';
import { useAuth } from '../../context/AuthContext';
import { GameTrackingProvider } from '../../context/GameTrackingContext';
import { GeneralEnglishService, type MixedPracticeRatio } from '../../services/generalEnglishService';
import { QuizBattleGame } from '../game/QuizBattleGame';
import { MatchItGame } from '../game/MatchItGame';
import { SentenceBuilderGame } from '../game/SentenceBuilderGame';
import { TrueFalseGame } from '../game/TrueFalseGame';
import { ReadingDetectiveGame } from '../game/ReadingDetectiveGame';
import { TrainStationGame } from '../game/TrainStationGame';
import { ArrowLeft, Gamepad2, ShieldAlert } from 'lucide-react';
import { sounds } from '../../services/soundEffects';

export interface GeneralEnglishGameContainerProps {
  gradeId: GradeId;
  topicId: string;
  gameType: GameType;
  mode?: 'topic' | 'mixed';
  mixedRatio?: MixedPracticeRatio;
  onExit: () => void;
}

export const GeneralEnglishGameContainer: React.FC<GeneralEnglishGameContainerProps> = ({
  gradeId,
  topicId,
  gameType,
  mode = 'topic',
  mixedRatio = '50/50',
  onExit,
}) => {
  const { data } = useArcade();
  const { student } = useAuth();
  const [attemptIteration, setAttemptIteration] = useState(0);

  // Strict Grade Check: authenticated students can only access their assigned grade
  const isUnauthorized = Boolean(student && gradeId !== student.grade);

  const handleRestartAttempt = useCallback(() => {
    setAttemptIteration((prev) => prev + 1);
  }, []);

  // Collect all Unit Review activities for this grade (for Mixed Practice pooling)
  const allUnitReviewActivities = useMemo<Activity[]>(() => {
    const units = data.units[gradeId] || [];
    return units.flatMap((u) => u.activities || []);
  }, [data, gradeId]);

  // Construct activity & unit runtime models
  const sessionData = useMemo(() => {
    if (isUnauthorized) return null;

    if (mode === 'mixed') {
      return GeneralEnglishService.createMixedPracticeActivity(
        {
          gradeId,
          gameType,
          ratio: mixedRatio,
          totalQuestions: 10,
        },
        allUnitReviewActivities
      );
    }

    const topic = GeneralEnglishService.getTopicById(topicId);
    if (!topic) return null;

    return GeneralEnglishService.createActivityForTopic(topic, gameType);
  }, [gradeId, topicId, gameType, mode, mixedRatio, allUnitReviewActivities, isUnauthorized]);

  if (isUnauthorized && student) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 rounded-3xl bg-white border-2 border-rose-200 text-center shadow-xl shadow-rose-500/10">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 border border-rose-200 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2 font-display">Grade Access Restricted</h3>
        <p className="text-slate-600 text-sm mb-6">
          You are signed in as a <strong className="text-slate-800">{student.grade === 'grade-7' ? 'Grade 7' : 'Grade 8'}</strong> student. General English content for other grades is restricted.
        </p>
        <button
          onClick={onExit}
          className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold text-sm shadow-md"
        >
          Return to General English
        </button>
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 rounded-3xl bg-white border-2 border-sky-100 text-center shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-500 border border-sky-200 flex items-center justify-center mx-auto mb-4">
          <Gamepad2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2 font-display">Practice Session Not Found</h3>
        <p className="text-slate-600 text-sm mb-6">
          The requested practice topic could not be initialized or contains no compatible questions for {gameType}.
        </p>
        <button
          onClick={onExit}
          className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold text-sm shadow-md"
        >
          Return to General English
        </button>
      </div>
    );
  }

  const { activity, unit } = sessionData;

  const renderGame = () => {
    const gameKey = `${activity.id}-iter-${attemptIteration}`;
    switch (activity.gameType) {
      case 'quiz_battle':
        return <QuizBattleGame key={gameKey} activity={activity} onExit={onExit} />;
      case 'match_it':
        return <MatchItGame key={gameKey} activity={activity} onExit={onExit} />;
      case 'sentence_builder':
        return <SentenceBuilderGame key={gameKey} activity={activity} onExit={onExit} />;
      case 'true_false':
        return <TrueFalseGame key={gameKey} activity={activity} onExit={onExit} />;
      case 'reading_detective':
        return <ReadingDetectiveGame key={gameKey} activity={activity} onExit={onExit} />;
      case 'train_station':
        return <TrainStationGame key={gameKey} activity={activity} onExit={onExit} />;
      default:
        return <QuizBattleGame key={gameKey} activity={activity} onExit={onExit} />;
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-game-sky text-slate-900 flex flex-col py-4 px-3 sm:px-6 max-w-6xl mx-auto w-full">
      {/* Top Session Breadcrumb Bar */}
      <div className="mb-4 flex items-center justify-between gap-3 bg-white/90 backdrop-blur-sm p-3.5 rounded-2xl border border-sky-200 shadow-xs">
        <button
          onClick={() => {
            sounds.playTap();
            onExit();
          }}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to General English</span>
        </button>

        <div className="flex items-center gap-2">
          {mode === 'mixed' ? (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-300">
              Mixed Practice ({mixedRatio})
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-cyan-100 text-cyan-800 border border-cyan-300">
              General English Topic
            </span>
          )}
          <span className="text-xs font-bold text-slate-600 hidden sm:inline">
            Grade {gradeId === 'grade-7' ? '7' : '8'}
          </span>
        </div>
      </div>

      <GameTrackingProvider
        key={`ge-tracking-${gradeId}-${unit.id}-${activity.id}-iter-${attemptIteration}`}
        activity={activity}
        unit={unit}
        gradeId={gradeId}
        onRestartAttempt={handleRestartAttempt}
      >
        {renderGame()}
      </GameTrackingProvider>
    </div>
  );
};

