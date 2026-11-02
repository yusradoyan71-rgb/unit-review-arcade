import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { PlusCircle, Sparkles } from 'lucide-react';
import { sounds } from '../../services/soundEffects';

interface EmptyStateProps {
  icon: LucideIcon;
  badge: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  badge,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto my-8 p-8 md:p-12 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-2xl text-center relative overflow-hidden"
    >
      {/* Subtle background glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Arcade Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-6">
        <Sparkles className="w-3.5 h-3.5" />
        <span>{badge}</span>
      </div>

      {/* Central Holographic Icon */}
      <div className="mx-auto w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-indigo-400 shadow-inner mb-6 relative group">
        <div className="absolute inset-0 rounded-3xl bg-indigo-500/10 animate-arcade-pulse pointer-events-none" />
        <Icon className="w-10 h-10 md:w-12 md:h-12 text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
      </div>

      {/* Headline & Description */}
      <h3 className="font-arcade text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">
        {title}
      </h3>
      <p className="text-slate-400 text-base md:text-lg max-w-lg mx-auto leading-relaxed mb-8">
        {description}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        {actionLabel && onAction && (
          <button
            onClick={() => {
              sounds.playTap();
              onAction();
            }}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-base shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5"
          >
            <PlusCircle className="w-5 h-5" />
            <span>{actionLabel}</span>
          </button>
        )}

        {secondaryActionLabel && onSecondaryAction && (
          <button
            onClick={() => {
              sounds.playTap();
              onSecondaryAction();
            }}
            className="px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-base border border-slate-700 hover:border-slate-600 transition-all"
          >
            <span>{secondaryActionLabel}</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};
