import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, ArrowLeft, Sparkles, Award, Zap, Coins } from 'lucide-react';
import { sounds } from '../../services/soundEffects';
import { useGameTracking } from '../../context/GameTrackingContext';

interface GameResultsModalProps {
  score: number;
  totalQuestions: number;
  activityTitle: string;
  onRestart: () => void;
  onExit: () => void;
  accuracyPercentage?: number;
  scoreLabel?: string;
}

export const GameResultsModal: React.FC<GameResultsModalProps> = ({
  score,
  totalQuestions,
  activityTitle,
  onRestart,
  onExit,
  accuracyPercentage,
  scoreLabel,
}) => {
  const { lastGamification, lastCoins } = useGameTracking();
  const rawPercentage = accuracyPercentage !== undefined
    ? accuracyPercentage
    : (totalQuestions > 0 ? (score / totalQuestions) * 100 : 0);
  const formattedAccuracy = Number.isInteger(rawPercentage)
    ? `${rawPercentage}%`
    : `${rawPercentage.toFixed(1)}%`;

  useEffect(() => {
    sounds.playSuccess();
    try {
      confetti({
        particleCount: lastGamification?.isLevelUp ? 140 : 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Ignore if canvas-confetti unavailable
    }
  }, [lastGamification?.isLevelUp]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg rounded-3xl bg-slate-900 border-2 border-indigo-500/50 p-8 text-center shadow-2xl relative overflow-hidden"
      >
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center mb-6 shadow-xl shadow-amber-500/30">
          <Trophy className="w-12 h-12" />
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          Activity Completed
        </span>

        <h2 className="font-arcade text-3xl font-black text-white mt-3 mb-2">
          {activityTitle}
        </h2>
        <p className="text-slate-400 text-sm mb-6">
          Great effort! Review your final score below.
        </p>

        {/* Score Card */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center">
            <span className="text-xs font-semibold text-slate-400 uppercase">
              {scoreLabel || 'Correct Answers'}
            </span>
            <span className="font-mono text-3xl font-extrabold text-cyan-400 mt-1">
              {score} / {totalQuestions}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center">
            <span className="text-xs font-semibold text-slate-400 uppercase">Accuracy</span>
            <span className="font-mono text-3xl font-extrabold text-purple-400 mt-1">
              {formattedAccuracy}
            </span>
          </div>
        </div>

        {/* Gamification Rewards Banner (XP, Level Up, Badges) */}
        {lastGamification && (
          <div className="mb-6 space-y-3">
            {/* XP Earned Card */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-[11px] font-semibold text-slate-400 block">XP REWARD</span>
                  <span className="text-xs text-slate-300 font-medium">
                    {lastGamification.replayNotice || 'Curriculum Performance Award'}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-xl font-black text-amber-400">
                  +{lastGamification.xpEarned} <span className="text-xs font-bold">XP</span>
                </span>
              </div>
            </div>

            {/* Monster Coins Earned Card */}
            {lastCoins && lastCoins.coinsEarned > 0 && (
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-[11px] font-semibold text-amber-400 block">MONSTER COINS</span>
                    <span className="text-xs text-slate-300 font-medium">
                      {lastCoins.message || 'Reward for Activity Completion'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xl font-black text-amber-400">
                    +{lastCoins.coinsEarned} <span className="text-xs font-bold">Coins</span>
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    Total: {lastCoins.totalCoins}
                  </span>
                </div>
              </div>
            )}

            {/* Level Up Celebratory Announcement */}
            {lastGamification.isLevelUp && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-indigo-500/20 border border-amber-400/50 flex items-center justify-center gap-2 text-amber-300 font-arcade text-sm font-bold shadow-lg shadow-amber-500/20"
              >
                <Award className="w-5 h-5 text-amber-400 animate-bounce" />
                <span>LEVEL UP! YOU ARE NOW LEVEL {lastGamification.newLevel} ({lastGamification.levelTitle})!</span>
              </motion.div>
            )}

            {/* Unlocked Badges */}
            {lastGamification.unlockedAchievements && lastGamification.unlockedAchievements.length > 0 && (
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-emerald-500/40 text-left">
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  New Badges Unlocked!
                </span>
                <div className="flex flex-wrap gap-2">
                  {lastGamification.unlockedAchievements.map((b) => (
                    <span
                      key={b.id}
                      className="px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1"
                    >
                      <Trophy className="w-3 h-3 text-emerald-400" />
                      {b.title}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              sounds.playTap();
              onRestart();
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>

          <button
            onClick={() => {
              sounds.playBack();
              onExit();
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 hover:border-slate-600 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Unit</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
