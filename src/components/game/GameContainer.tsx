import React, { useState, useCallback } from 'react';
import { useArcade } from '../../context/ArcadeContext';
import { useAuth } from '../../context/AuthContext';
import { GameTrackingProvider } from '../../context/GameTrackingContext';
import { QuizBattleGame } from './QuizBattleGame';
import { MatchItGame } from './MatchItGame';
import { SentenceBuilderGame } from './SentenceBuilderGame';
import { TrueFalseGame } from './TrueFalseGame';
import { ReadingDetectiveGame } from './ReadingDetectiveGame';
import { TrainStationGame } from './TrainStationGame';
import { Gamepad2, ShieldAlert } from 'lucide-react';

export const GameContainer: React.FC = () => {
  const { activeGradeId, activeUnit, activeActivity, goToUnit, goToGrade } = useArcade();
  const { student } = useAuth();
  const [attemptIteration, setAttemptIteration] = useState(0);

  // Strict Grade Check: authenticated students can only access activities of their assigned grade
  const isUnauthorized = Boolean(
    student && (
      (activeGradeId && activeGradeId !== student.grade) ||
      (activeActivity && !activeActivity.id.startsWith(student.grade === 'grade-7' ? 'g7-' : 'g8-'))
    )
  );

  const handleRestartAttempt = useCallback(() => {
    setAttemptIteration((prev) => prev + 1);
  }, []);

  if (isUnauthorized && student) {
    const studentGradeLabel = student.grade === 'grade-7' ? 'Grade 7' : 'Grade 8';
    const contentGradeLabel = student.grade === 'grade-7' ? 'Grade 8' : 'Grade 7';
    return (
      <div className="max-w-xl mx-auto my-16 p-8 rounded-3xl bg-slate-900 border border-rose-500/40 text-center shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h3 className="font-arcade text-2xl font-bold text-white mb-2">Access Restricted</h3>
        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
          This unit activity belongs to <span className="font-semibold text-rose-300">{contentGradeLabel}</span>. 
          You are authenticated as a <span className="font-semibold text-indigo-300">{studentGradeLabel}</span> student 
          (Class {student.class}) and only have access to {studentGradeLabel} curriculum.
        </p>
        <button
          onClick={() => goToGrade(student.grade)}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
        >
          Return to My {studentGradeLabel} Activities
        </button>
      </div>
    );
  }

  if (!activeActivity || !activeUnit || !activeGradeId) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center">
        <Gamepad2 className="w-12 h-12 text-slate-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Activity Not Found</h3>
        <p className="text-slate-400 text-sm mb-6">
          The requested game activity could not be loaded or was removed.
        </p>
        {activeGradeId && activeUnit && (
          <button
            onClick={() => goToUnit(activeGradeId, activeUnit.id)}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm"
          >
            Return to Unit
          </button>
        )}
      </div>
    );
  }

  const handleExit = () => {
    goToUnit(activeGradeId, activeUnit.id);
  };

  const renderGame = () => {
    const gameKey = `${activeActivity.id}-iter-${attemptIteration}`;
    switch (activeActivity.gameType) {
      case 'quiz_battle':
        return <QuizBattleGame key={gameKey} activity={activeActivity} onExit={handleExit} />;
      case 'match_it':
        return <MatchItGame key={gameKey} activity={activeActivity} onExit={handleExit} />;
      case 'sentence_builder':
        return <SentenceBuilderGame key={gameKey} activity={activeActivity} onExit={handleExit} />;
      case 'true_false':
        return <TrueFalseGame key={gameKey} activity={activeActivity} onExit={handleExit} />;
      case 'reading_detective':
        return <ReadingDetectiveGame key={gameKey} activity={activeActivity} onExit={handleExit} />;
      case 'train_station':
        return <TrainStationGame key={gameKey} activity={activeActivity} onExit={handleExit} />;
      default:
        return <QuizBattleGame key={gameKey} activity={activeActivity} onExit={handleExit} />;
    }
  };

  return (
    <GameTrackingProvider
      key={`tracking-${activeGradeId}-${activeUnit.id}-${activeActivity.id}-iter-${attemptIteration}`}
      activity={activeActivity}
      unit={activeUnit}
      gradeId={activeGradeId}
      onRestartAttempt={handleRestartAttempt}
    >
      {renderGame()}
    </GameTrackingProvider>
  );
};
