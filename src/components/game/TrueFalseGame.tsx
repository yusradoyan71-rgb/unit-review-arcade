import React, { useState, useEffect } from 'react';
import type { Activity, TrueFalseQuestion } from '../../types/schema';
import { motion } from 'framer-motion';
import { sounds } from '../../services/soundEffects';
import { GameResultsModal } from './GameResultsModal';
import { ClassroomScoreboard } from './ClassroomScoreboard';
import { 
  ArrowLeft, 
  Check, 
  X, 
  ChevronRight, 
  Clock, 
  Sparkles,
  Pause,
  Play
} from 'lucide-react';

interface TrueFalseGameProps {
  activity: Activity;
  onExit: () => void;
}

export const TrueFalseGame: React.FC<TrueFalseGameProps> = ({ activity, onExit }) => {
  const statements = (activity.questions || []) as TrueFalseQuestion[];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  // Timer state
  const timeLimit = activity.settings.timeLimitSeconds || 20;
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  const currentStatement = statements[currentIndex];
  const isAnswered = selectedAnswer !== null;

  useEffect(() => {
    if (!activity.settings.showTimer || isAnswered || isTimerPaused || isGameOver) return;

    if (timeLeft <= 0) {
      setSelectedAnswer(!currentStatement.isTrue); // Auto timeout as incorrect
      sounds.playBack();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isAnswered, isTimerPaused, isGameOver, activity.settings.showTimer, currentStatement]);

  const handleSelectAnswer = (choice: boolean) => {
    if (isAnswered) return;

    setSelectedAnswer(choice);
    const isCorrect = choice === currentStatement.isTrue;

    if (isCorrect) {
      sounds.playSuccess();
      setScore((s) => s + 1);
    } else {
      sounds.playBack();
    }
  };

  const handleNext = () => {
    sounds.playTap();
    if (currentIndex + 1 < statements.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setTimeLeft(timeLimit);
    } else {
      setIsGameOver(true);
    }
  };

  const handleRestart = () => {
    sounds.playTap();
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setTimeLeft(timeLimit);
    setIsGameOver(false);
  };

  if (!currentStatement || statements.length === 0) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 text-center bg-slate-900 rounded-3xl border border-slate-800">
        <h3 className="text-xl font-bold text-white mb-2">No Statements Configured</h3>
        <button onClick={onExit} className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm">
          Return to Unit
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-4 px-4 flex flex-col min-h-[calc(100vh-5rem)]">
      {/* Classroom Scoreboard */}
      <ClassroomScoreboard />

      {/* Top Bar */}
      <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
        <button
          onClick={onExit}
          className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Unit</span>
        </button>

        {/* Progress Counter */}
        <div className="flex items-center gap-2">
          <span className="font-arcade text-sm font-bold text-slate-400 uppercase tracking-wider">
            Statement
          </span>
          <span className="font-mono text-base font-extrabold px-3 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {currentIndex + 1} / {statements.length}
          </span>
        </div>

        {/* Timer Control */}
        {activity.settings.showTimer && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTimerPaused(!isTimerPaused)}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              {isTimerPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border text-sm font-mono font-bold ${
                timeLeft <= 5
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                  : 'bg-slate-900 text-cyan-300 border-slate-800'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{timeLeft}s</span>
            </div>
          </div>
        )}
      </div>

      {/* Statement Card */}
      <motion.div
        key={currentStatement.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col justify-between"
      >
        <div className="mb-8 p-6 sm:p-10 rounded-3xl bg-slate-900/90 border-2 border-emerald-500/30 shadow-2xl backdrop-blur-xl relative overflow-hidden text-center my-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fact or Fiction Challenge</span>
          </div>

          <h2 className="font-arcade text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-relaxed max-w-3xl mx-auto">
            "{currentStatement.prompt}"
          </h2>
        </div>

        {/* Giant TRUE / FALSE Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {/* TRUE BUTTON */}
          <button
            disabled={isAnswered}
            onClick={() => handleSelectAnswer(true)}
            className={`p-8 rounded-3xl border-4 text-center font-arcade font-black text-3xl sm:text-4xl transition-all flex flex-col items-center justify-center gap-3 ${
              isAnswered
                ? currentStatement.isTrue
                  ? 'bg-emerald-500/30 border-emerald-400 text-emerald-200 ring-4 ring-emerald-400'
                  : selectedAnswer === true
                  ? 'bg-rose-500/30 border-rose-500 text-rose-200'
                  : 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-40'
                : 'bg-emerald-600/20 hover:bg-emerald-600/30 border-emerald-500/50 hover:border-emerald-400 text-emerald-300 hover:scale-105 active:scale-95 shadow-xl shadow-emerald-600/10'
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg">
              <Check className="w-10 h-10 stroke-[3]" />
            </div>
            <span>TRUE</span>
          </button>

          {/* FALSE BUTTON */}
          <button
            disabled={isAnswered}
            onClick={() => handleSelectAnswer(false)}
            className={`p-8 rounded-3xl border-4 text-center font-arcade font-black text-3xl sm:text-4xl transition-all flex flex-col items-center justify-center gap-3 ${
              isAnswered
                ? !currentStatement.isTrue
                  ? 'bg-emerald-500/30 border-emerald-400 text-emerald-200 ring-4 ring-emerald-400'
                  : selectedAnswer === false
                  ? 'bg-rose-500/30 border-rose-500 text-rose-200'
                  : 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-40'
                : 'bg-rose-600/20 hover:bg-rose-600/30 border-rose-500/50 hover:border-rose-400 text-rose-300 hover:scale-105 active:scale-95 shadow-xl shadow-rose-600/10'
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-lg">
              <X className="w-10 h-10 stroke-[3]" />
            </div>
            <span>FALSE</span>
          </button>
        </div>

        {/* Explanation & Next */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="flex-1">
            {isAnswered && (
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 text-sm">
                <span className="font-bold uppercase tracking-wider block text-emerald-400 text-xs mb-1">
                  {currentStatement.isTrue === selectedAnswer ? '✓ Correct!' : '✗ Incorrect!'}
                </span>
                {currentStatement.explanation}
              </div>
            )}
          </div>

          {isAnswered && (
            <button
              onClick={handleNext}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-lg shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all"
            >
              <span>{currentIndex + 1 < statements.length ? 'Next Statement' : 'View Results'}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </motion.div>

      {/* Game Results Modal */}
      {isGameOver && (
        <GameResultsModal
          score={score}
          totalQuestions={statements.length}
          activityTitle={activity.title}
          onRestart={handleRestart}
          onExit={onExit}
        />
      )}
    </div>
  );
};
