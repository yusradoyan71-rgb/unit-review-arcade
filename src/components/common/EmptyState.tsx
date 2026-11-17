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
      className="w-full max-w-2xl mx-auto my-8 p-8 md:p-12 rounded-3xl bg-white/95 border-2 border-sky-100 shadow-xl text-center relative overflow-hidden"
    >
      {/* Subtle background glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Campus Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold uppercase tracking-wider mb-6">
        <Sparkles className="w-3.5 h-3.5 text-sky-500" />
        <span>{badge}</span>
      </div>

      {/* Central Icon */}
      <div className="mx-auto w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br from-sky-50 to-indigo-50 border-2 border-sky-100 flex items-center justify-center text-sky-600 shadow-sm mb-6 relative group">
        <Icon className="w-10 h-10 md:w-12 md:h-12 text-sky-600 group-hover:scale-110 transition-transform duration-300" />
      </div>

      {/* Headline & Description */}
      <h3 className="font-arcade text-2xl md:text-3xl font-bold text-slate-900 mb-3 tracking-tight">
        {title}
      </h3>
      <p className="text-slate-600 text-base md:text-lg max-w-lg mx-auto leading-relaxed mb-8">
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
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold text-base shadow-lg shadow-sky-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5"
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
            className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-bold text-base border border-slate-200 shadow-sm transition-all"
          >
            <span>{secondaryActionLabel}</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};
