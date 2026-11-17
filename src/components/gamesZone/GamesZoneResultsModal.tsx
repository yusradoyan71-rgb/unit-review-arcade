import React from 'react';
import {
  Trophy,
  Sparkles,
  RotateCcw,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Zap,
  Coins,
} from 'lucide-react';
import type { GamesZoneAttemptRecord } from '../../types/gamesZone';
import { sounds } from '../../services/soundEffects';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in selection:bg-cyan-500 selection:text-white">
      <div className="relative w-full max-w-md rounded-3xl bg-white border-2 border-slate-200 p-6 sm:p-8 shadow-2xl text-center space-y-5">
        
        {/* Crown / Icon */}
        <div className="relative mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 p-0.5 shadow-xl shadow-amber-300/40">
          <div className="w-full h-full rounded-[22px] bg-amber-50 flex items-center justify-center">
            {isHighScore ? (
              <Trophy className="w-10 h-10 text-amber-500 animate-bounce" />
            ) : isPassed ? (
              <Sparkles className="w-10 h-10 text-amber-500" />
            ) : (
              <RotateCcw className="w-10 h-10 text-sky-500" />
            )}
          </div>
          {isHighScore && (
            <span className="absolute -top-2 -right-2 px-2.5 py-0.5 rounded-full bg-amber-500 text-white font-black text-[10px] uppercase tracking-wider shadow">
              NEW RECORD!
            </span>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-black font-display text-slate-900">
            {isPerfect
              ? 'Flawless Victory! 🎉'
              : isPassed
              ? 'Great Performance! ⭐'
              : 'Good Effort! Keep Practicing! 💪'}
          </h2>
          <p className="text-xs text-slate-500 font-bold mt-1">
            {attempt.gameTitle} • {attempt.difficulty.toUpperCase()}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200">
            <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider block">
              Final Score
            </span>
            <span className="text-xl font-black font-mono text-amber-900">{attempt.score} pts</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider block">
              Accuracy
            </span>
            <span
              className={`text-xl font-black font-mono ${
                attempt.accuracyPercentage >= 80
                  ? 'text-emerald-600'
                  : attempt.accuracyPercentage >= 60
                  ? 'text-amber-600'
                  : 'text-rose-600'
              }`}
            >
              {attempt.accuracyPercentage}%
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-700">
            <span className="flex items-center gap-1.5 font-bold text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Correct
            </span>
            <span className="font-mono font-black text-slate-900">
              {attempt.correctAnswers} / {attempt.totalQuestions}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-700">
            <span className="flex items-center gap-1.5 font-bold text-slate-600">
              <Clock className="w-4 h-4 text-sky-500" /> Time
            </span>
            <span className="font-mono font-black text-slate-900">{attempt.durationSeconds}s</span>
          </div>
        </div>

        {/* XP Award Pill */}
        <div className="p-3 rounded-2xl bg-sky-50 border-2 border-sky-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-sky-100 text-sky-700">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div className="text-left">
              <span className="text-xs font-black text-sky-900 block">Games Zone XP</span>
              <span className="text-[10px] text-slate-500 font-medium">Daily Anti-Farming Protected</span>
            </div>
          </div>
          <span className="text-base font-black font-mono text-sky-700">
            +{attempt.xpEarned} XP
          </span>
        </div>

        {/* Monster Coins Award Pill */}
        {attempt.coinsEarned !== undefined && (
          <div className="p-3 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-amber-100 text-amber-700">
                <Coins className="w-4 h-4 fill-current" />
              </div>
              <div className="text-left">
                <span className="text-xs font-black text-amber-900 block">Monster Coins</span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {attempt.coinsEarned > 0 ? 'Added to wallet' : 'Daily cap (25) reached'}
                </span>
              </div>
            </div>
            <span className="text-base font-black font-mono text-amber-700">
              +{attempt.coinsEarned} Coins
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2.5 pt-2">
          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              onPlayAgain();
            }}
            className="w-full py-3.5 px-4 rounded-xl font-black text-sm btn-game-primary flex items-center justify-center gap-2 shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
            <span>PLAY AGAIN ➔</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              onReturnToLanding();
            }}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-300 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Games Zone Lobby</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default GamesZoneResultsModal;
