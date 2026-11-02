import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, ArrowLeft } from 'lucide-react';
import { sounds } from '../../services/soundEffects';

interface GameResultsModalProps {
  score: number;
  totalQuestions: number;
  activityTitle: string;
  onRestart: () => void;
  onExit: () => void;
}

export const GameResultsModal: React.FC<GameResultsModalProps> = ({
  score,
  totalQuestions,
  activityTitle,
  onRestart,
  onExit,
}) => {
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  useEffect(() => {
    sounds.playSuccess();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Ignore if canvas-confetti unavailable
    }
  }, []);

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
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center">
            <span className="text-xs font-semibold text-slate-400 uppercase">Correct Answers</span>
            <span className="font-mono text-3xl font-extrabold text-cyan-400 mt-1">
              {score} / {totalQuestions}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center">
            <span className="text-xs font-semibold text-slate-400 uppercase">Accuracy</span>
            <span className="font-mono text-3xl font-extrabold text-purple-400 mt-1">
              {percentage}%
            </span>
          </div>
        </div>

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
