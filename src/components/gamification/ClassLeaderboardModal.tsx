/**
 * UNIT REVIEW ARCADE — CLASS LEADERBOARD MODAL (PHASE 5)
 * Version: 5.0.0
 * 
 * Privacy-preserving, competitive class rankings across 7A, 7B, 8A, and 8B.
 * Highlights current student, celebrates top performers with podium accents,
 * and deterministic tie-breaking.
 */

import React, { useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGamification } from '../../context/GamificationContext';
import { useAuth } from '../../context/AuthContext';
import { sounds } from '../../services/soundEffects';
import type { StudentClass } from '../../types/auth';
import {
  X,
  Trophy,
  Crown,
  RotateCw,
} from 'lucide-react';

const CLASSES: StudentClass[] = ['7A', '7B', '8A', '8B'];

export const ClassLeaderboardModal: React.FC = () => {
  const { student } = useAuth();
  const {
    leaderboard,
    isLoadingLeaderboard,
    leaderboardError,
    isLeaderboardModalOpen,
    activeLeaderboardClass,
    closeModals,
    selectLeaderboardClass,
    refreshLeaderboard,
  } = useGamification();

  // Strict Grade Guard: authenticated students only view leaderboards for their grade's classes
  const availableClasses: StudentClass[] = useMemo(() => {
    if (!student) return CLASSES;
    return student.grade === 'grade-7' ? ['7A', '7B'] : ['8A', '8B'];
  }, [student]);

  useEffect(() => {
    if (isLeaderboardModalOpen && !availableClasses.includes(activeLeaderboardClass)) {
      selectLeaderboardClass(availableClasses[0]);
    }
  }, [isLeaderboardModalOpen, availableClasses, activeLeaderboardClass, selectLeaderboardClass]);

  if (!isLeaderboardModalOpen) return null;

  const entries = leaderboard?.entries || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-amber-500/30 p-5 sm:p-8 text-slate-100 shadow-2xl relative flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/30">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-arcade text-lg sm:text-xl font-bold text-white tracking-wide">
                  CLASS LEADERBOARDS
                </h2>
              </div>
              <p className="text-xs text-slate-400">
                Official English Arcade XP Rankings for Class {activeLeaderboardClass}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sounds.playTap();
                refreshLeaderboard(activeLeaderboardClass);
              }}
              title="Refresh Leaderboard"
              disabled={isLoadingLeaderboard}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all disabled:opacity-50"
            >
              <RotateCw className={`w-4 h-4 ${isLoadingLeaderboard ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => {
                sounds.playTap();
                closeModals();
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Class Selection Tabs */}
        <div className="flex items-center gap-2 pt-4 pb-2 border-b border-slate-800/60 overflow-x-auto shrink-0">
          {availableClasses.map((cls) => {
            const isSelected = activeLeaderboardClass === cls;
            return (
              <button
                key={cls}
                onClick={() => {
                  sounds.playTap();
                  selectLeaderboardClass(cls);
                }}
                className={`flex-1 min-w-[70px] py-2 rounded-xl text-xs sm:text-sm font-bold font-mono transition-all flex items-center justify-center gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-950/70 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <span>Class {cls}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Leaderboard Table */}
        <div className="flex-1 overflow-y-auto pt-3 pr-1 space-y-2">
          {leaderboardError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {leaderboardError}
            </div>
          )}

          {isLoadingLeaderboard && entries.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-sm flex flex-col items-center gap-3">
              <RotateCw className="w-6 h-6 animate-spin text-amber-400" />
              <span>Fetching class rankings...</span>
            </div>
          ) : entries.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-sm">
              No students recorded in this class yet.
            </div>
          ) : (
            entries.map((entry) => {
              const isFirst = entry.rank === 1;
              const isSecond = entry.rank === 2;
              const isThird = entry.rank === 3;
              const isCurrent = entry.isCurrentStudent;

              return (
                <div
                  key={`${entry.rank}-${entry.displayName}`}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isCurrent
                      ? 'bg-cyan-950/40 border-cyan-500/60 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500/40'
                      : isFirst
                      ? 'bg-amber-950/20 border-amber-500/40 shadow-sm'
                      : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  {/* Rank & Identity */}
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Rank Badge */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-black text-sm shrink-0 ${
                        isFirst
                          ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 shadow-md shadow-amber-400/30'
                          : isSecond
                          ? 'bg-gradient-to-tr from-slate-300 to-slate-100 text-slate-900 shadow-sm'
                          : isThird
                          ? 'bg-gradient-to-tr from-amber-700 to-amber-600 text-amber-100 shadow-sm'
                          : 'bg-slate-900 border border-slate-800 text-slate-400'
                      }`}
                    >
                      {isFirst ? (
                        <Crown className="w-5 h-5" />
                      ) : (
                        `#${entry.rank}`
                      )}
                    </div>

                    {/* Name & Level */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold text-sm truncate ${
                            isCurrent ? 'text-cyan-300' : 'text-slate-100'
                          }`}
                        >
                          {entry.displayName}
                        </span>
                        {isCurrent && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase tracking-wide">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px] font-bold">
                          Lv. {entry.level}
                        </span>
                        <span className="text-[11px] truncate">{entry.levelTitle}</span>
                        <span className="text-[10px] text-slate-500 hidden sm:inline">
                          • {entry.activitiesCompleted} completed
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* XP Total */}
                  <div className="text-right shrink-0">
                    <span className="font-mono text-base sm:text-lg font-black text-amber-400 block">
                      {entry.totalXp} <span className="text-xs font-semibold text-amber-300/80">XP</span>
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Note */}
        <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 font-mono shrink-0">
          <span>Ranked by verified curriculum XP</span>
          <span>Deterministic tie-breaking</span>
        </div>
      </motion.div>
    </div>
  );
};
