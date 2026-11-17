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
      <div className="max-w-xl mx-auto my-16 p-8 rounded-3xl bg-white border-2 border-rose-200 text-center shadow-xl shadow-rose-500/5">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 border border-rose-200 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h3 className="font-arcade text-2xl font-bold text-slate-900 mb-2">Access Restricted</h3>
        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          This unit activity belongs to <span className="font-bold text-rose-600">{contentGradeLabel}</span>. 
          You are authenticated as a <span className="font-bold text-sky-600">{studentGradeLabel}</span> student 
          (Class {student.class}) and only have access to {studentGradeLabel} curriculum.
        </p>
        <button
          onClick={() => goToGrade(student.grade)}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-sky-500/20 transition-all hover:scale-105 active:scale-95"
        >
          Return to My {studentGradeLabel} Activities
        </button>
      </div>
    );
  }

  if (!activeActivity || !activeUnit || !activeGradeId) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 rounded-3xl bg-white border-2 border-sky-100 text-center shadow-xl shadow-sky-500/5">
        <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-500 border border-sky-200 flex items-center justify-center mx-auto mb-4">
          <Gamepad2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2 font-arcade">Activity Not Found</h3>
        <p className="text-slate-600 text-sm mb-6">
          The requested game activity could not be loaded or was removed.
        </p>
        {activeGradeId && activeUnit && (
          <button
            onClick={() => goToUnit(activeGradeId, activeUnit.id)}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-sky-500/20"
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
