/**
 * UNIT REVIEW ARCADE — CLASS LEADERBOARD MODAL (PHASE 9C)
 * Version: 9.3.0
 * 
 * Colorful Game World + Bright Creative Campus redesign.
 * Privacy-preserving, competitive class rankings across 7A, 7B, 8A, and 8B.
 * Highlights current student with cheerful cyan accents and celebrates top performers with podium badges.
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-2xl rounded-3xl bg-white border-4 border-amber-300 p-5 sm:p-8 text-slate-800 shadow-2xl relative flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Soft Golden Ambient Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-200/50 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-amber-100 shrink-0 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-slate-900 shadow-md shadow-amber-400/30">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bubble text-xl sm:text-2xl text-slate-900 tracking-wide">
                  CLASS LEADERBOARDS
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-medium">
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
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-all disabled:opacity-50"
            >
              <RotateCw className={`w-4 h-4 ${isLoadingLeaderboard ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => {
                sounds.playTap();
                closeModals();
              }}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Class Selection Tabs */}
        <div className="flex items-center gap-2 pt-4 pb-2 border-b-2 border-amber-100 overflow-x-auto shrink-0 relative z-10">
          {availableClasses.map((cls) => {
            const isSelected = activeLeaderboardClass === cls;
            return (
              <button
                key={cls}
                onClick={() => {
                  sounds.playTap();
                  selectLeaderboardClass(cls);
                }}
                className={`flex-1 min-w-[70px] py-2.5 rounded-xl text-xs sm:text-sm font-bold font-mono transition-all flex items-center justify-center gap-1.5 ${
                  isSelected
                    ? 'btn-game-amber text-slate-900 font-black shadow-md'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold border border-slate-200'
                }`}
              >
                <span>Class {cls}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Leaderboard Table */}
        <div className="flex-1 overflow-y-auto pt-3 pr-1 space-y-2 relative z-10">
          {leaderboardError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-700 text-xs font-medium">
              {leaderboardError}
            </div>
          )}

          {isLoadingLeaderboard && entries.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm flex flex-col items-center gap-3">
              <RotateCw className="w-6 h-6 animate-spin text-amber-500" />
              <span>Fetching class rankings...</span>
            </div>
          ) : entries.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm font-medium">
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
                  className={`p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ${
                    isCurrent
                      ? 'bg-cyan-50/80 border-cyan-400 shadow-sm ring-2 ring-cyan-200'
                      : isFirst
                      ? 'bg-amber-50/80 border-amber-300 shadow-sm'
                      : isSecond
                      ? 'bg-slate-50 border-slate-200 shadow-sm'
                      : isThird
                      ? 'bg-orange-50/60 border-orange-200 shadow-sm'
                      : 'bg-white border-slate-200 hover:bg-slate-50/80'
                  }`}
                >
                  {/* Rank & Identity */}
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Rank Badge */}
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-mono font-black text-sm shrink-0 ${
                        isFirst
                          ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-900 shadow-md shadow-amber-400/30'
                          : isSecond
                          ? 'bg-gradient-to-tr from-slate-200 to-slate-100 text-slate-700 border border-slate-300 shadow-sm'
                          : isThird
                          ? 'bg-gradient-to-tr from-amber-700 to-amber-600 text-amber-100 shadow-sm'
                          : 'bg-slate-100 border border-slate-200 text-slate-500'
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
                            isCurrent ? 'text-cyan-950 font-black' : 'text-slate-900'
                          }`}
                        >
                          {entry.displayName}
                        </span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black bg-cyan-200 text-cyan-800 border border-cyan-300 uppercase tracking-wide">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-mono text-[10px] font-bold">
                          Lv. {entry.level}
                        </span>
                        <span className="text-[11px] font-medium truncate">{entry.levelTitle}</span>
                        <span className="text-[10px] text-slate-400 hidden sm:inline">
                          • {entry.activitiesCompleted} completed
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* XP Total */}
                  <div className="text-right shrink-0">
                    <span className="font-mono text-base sm:text-lg font-black text-amber-600 block">
                      {entry.totalXp} <span className="text-xs font-bold text-amber-500">XP</span>
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Note */}
        <div className="pt-3 border-t-2 border-slate-100 flex items-center justify-between text-xs text-slate-400 font-mono font-medium shrink-0 relative z-10">
          <span>Ranked by verified curriculum XP</span>
          <span>Deterministic tie-breaking</span>
        </div>
      </motion.div>
    </div>
  );
};
