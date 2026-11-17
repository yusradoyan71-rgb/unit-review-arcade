/**
 * UNIT REVIEW ARCADE — GAME RESULTS MODAL (PHASE 9E)
 * Version: 9.5.0
 * 
 * Colorful Game World + Bright Creative Campus redesign.
 * Celebratory victory screen showing real verified score, accuracy,
 * XP rewards, Monster Coins, level-ups, and badges.
 */

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg rounded-3xl bg-white border-4 border-amber-300 p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden text-slate-800"
      >
        {/* Soft Golden Ambient Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-200/50 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center mb-5 shadow-xl shadow-amber-400/30 relative z-10">
          <Trophy className="w-12 h-12" />
        </div>

        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 inline-block relative z-10">
          Activity Completed
        </span>

        <h2 className="font-bubble text-2xl sm:text-3xl font-black text-slate-900 mt-2.5 mb-1.5 relative z-10">
          {activityTitle}
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm mb-5 font-medium relative z-10">
          Great effort! Review your verified performance rewards below.
        </p>

        {/* Score & Accuracy Cards */}
        <div className="grid grid-cols-2 gap-3.5 mb-4 relative z-10">
          <div className="p-4 rounded-2xl bg-sky-50 border-2 border-sky-100 flex flex-col items-center shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {scoreLabel || 'Correct Answers'}
            </span>
            <span className="font-mono text-3xl font-black text-sky-700 mt-1">
              {score} / {totalQuestions}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50 border-2 border-purple-100 flex flex-col items-center shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Accuracy
            </span>
            <span className="font-mono text-3xl font-black text-purple-700 mt-1">
              {formattedAccuracy}
            </span>
          </div>
        </div>

        {/* Gamification Rewards Banner (XP, Coins, Level Up, Badges) */}
        {lastGamification && (
          <div className="mb-6 space-y-3 relative z-10">
            {/* XP Earned Card */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border-2 border-amber-200 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">XP REWARD</span>
                  <span className="text-xs text-slate-800 font-semibold">
                    {lastGamification.replayNotice || 'Curriculum Performance Award'}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-xl font-black text-amber-700">
                  +{lastGamification.xpEarned} <span className="text-xs font-bold">XP</span>
                </span>
              </div>
            </div>

            {/* Monster Coins Earned Card */}
            {lastCoins && lastCoins.coinsEarned > 0 && (
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border-2 border-amber-300 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center shadow-xs">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">MONSTER COINS</span>
                    <span className="text-xs text-slate-800 font-semibold">
                      {lastCoins.message || 'Reward for Activity Completion'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xl font-black text-amber-800">
                    +{lastCoins.coinsEarned} <span className="text-xs font-bold">Coins</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono font-medium block">
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
                className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-100 via-yellow-100 to-indigo-100 border-2 border-amber-300 flex items-center justify-center gap-2 text-amber-950 font-bubble text-sm font-bold shadow-md"
              >
                <Award className="w-5 h-5 text-amber-600 animate-bounce" />
                <span>LEVEL UP! YOU ARE NOW LEVEL {lastGamification.newLevel} ({lastGamification.levelTitle})!</span>
              </motion.div>
            )}

            {/* Unlocked Badges */}
            {lastGamification.unlockedAchievements && lastGamification.unlockedAchievements.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-left shadow-xs">
                <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                  New Badges Unlocked!
                </span>
                <div className="flex flex-wrap gap-2">
                  {lastGamification.unlockedAchievements.map((b) => (
                    <span
                      key={b.id}
                      className="px-2.5 py-1 rounded-xl bg-white border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-1 shadow-xs"
                    >
                      <Trophy className="w-3.5 h-3.5 text-amber-500" />
                      {b.title}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
          <button
            onClick={() => {
              sounds.playTap();
              onRestart();
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl btn-game-primary text-slate-900 font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>

          <button
            onClick={() => {
              sounds.playBack();
              onExit();
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm border border-slate-300 hover:border-slate-400 transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Unit</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
