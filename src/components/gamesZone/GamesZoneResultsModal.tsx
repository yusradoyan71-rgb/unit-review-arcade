import React from 'react';
import {
  Trophy,
  Sparkles,
  RotateCcw,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Zap,
} from 'lucide-react';
import type { GamesZoneAttemptRecord } from '../../types/gamesZone';

interface GamesZoneResultsModalProps {
  isOpen: boolean;
  attempt: GamesZoneAttemptRecord | null;
  isHighScore: boolean;
  onPlayAgain: () => void;
  onReturnToLanding: () => void;
}

export const GamesZoneResultsModal: React.FC<GamesZoneResultsModalProps> = ({
  isOpen,
  attempt,
  isHighScore,
  onPlayAgain,
  onReturnToLanding,
}) => {
  if (!isOpen || !attempt) return null;

  const isPerfect = attempt.accuracyPercentage === 100;
  const isPassed = attempt.accuracyPercentage >= 70;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700/80 p-6 shadow-2xl text-center space-y-6">
        {/* Crown / Icon */}
        <div className="relative mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-xl shadow-amber-500/20">
          <div className="w-full h-full rounded-[22px] bg-slate-950 flex items-center justify-center">
            {isHighScore ? (
              <Trophy className="w-10 h-10 text-amber-400 animate-bounce" />
            ) : isPassed ? (
              <Sparkles className="w-10 h-10 text-amber-400" />
            ) : (
              <RotateCcw className="w-10 h-10 text-blue-400" />
            )}
          </div>
          {isHighScore && (
            <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow">
              NEW RECORD!
            </span>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-black text-white">
            {isPerfect
              ? 'Flawless Victory!'
              : isPassed
              ? 'Great Performance!'
              : 'Keep Practicing!'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {attempt.gameTitle} • {attempt.difficulty.toUpperCase()}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Final Score
            </span>
            <span className="text-2xl font-black text-amber-400">{attempt.score} pts</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Accuracy
            </span>
            <span
              className={`text-2xl font-black ${
                attempt.accuracyPercentage >= 80
                  ? 'text-emerald-400'
                  : attempt.accuracyPercentage >= 60
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {attempt.accuracyPercentage}%
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1.5 text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Correct
            </span>
            <span className="font-bold">
              {attempt.correctAnswers} / {attempt.totalQuestions}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Clock className="w-4 h-4 text-blue-400" /> Time
            </span>
            <span className="font-bold">{attempt.durationSeconds}s</span>
          </div>
        </div>

        {/* XP Award Pill */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-700/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-indigo-200 block">Games Zone XP</span>
              <span className="text-[10px] text-slate-400">Daily Anti-Farming Protected</span>
            </div>
          </div>
          <span className="text-lg font-black text-indigo-300">
            +{attempt.xpEarned} XP
          </span>
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={onPlayAgain}
            className="w-full py-3.5 px-4 rounded-xl font-black text-white bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
          >
            <RotateCcw className="w-5 h-5" /> Play Again
          </button>

          <button
            type="button"
            onClick={onReturnToLanding}
            className="w-full py-3 px-4 rounded-xl font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-slate-700"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Games Zone
          </button>
        </div>
      </div>
    </div>
  );
};
