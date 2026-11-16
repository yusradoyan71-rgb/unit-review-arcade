/**
 * UNIT REVIEW ARCADE — STUDENT PROFILE MODAL (PHASE 5)
 * Version: 5.0.0
 * 
 * Comprehensive, responsive view of the student's gamification journey:
 * Level, Total XP, Progress Bar, Stats, Achievements Shelf, and Recent Plays.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGamification } from '../../context/GamificationContext';
import { usePersonalizedLearning } from '../../context/PersonalizedLearningContext';
import { sounds } from '../../services/soundEffects';
import type { AchievementCategory } from '../../types/gamification';
import {
  X,
  Trophy,
  Zap,
  Sparkles,
  Flame,
  Swords,
  Layers,
  AlignLeft,
  BookOpen,
  Train,
  CheckCircle2,
  Compass,
  Medal,
  Award,
  Crown,
  Lock,
  Calendar,
  CheckCircle,
  Clock,
  RotateCw,
} from 'lucide-react';

const BADGE_ICONS: Record<string, React.ElementType> = {
  Sparkles,
  Trophy,
  Zap,
  Flame,
  Swords,
  Layers,
  AlignLeft,
  BookOpen,
  Train,
  CheckCircle2,
  Compass,
  Medal,
  Award,
  Crown,
};

export const StudentProfileModal: React.FC = () => {
  const {
    profile,
    isLoadingProfile,
    profileError,
    isProfileModalOpen,
    closeModals,
    openLeaderboardModal,
    refreshProfile,
  } = useGamification();

  const { openMistakesModal, openMasteryModal, uncorrectedMistakesCount } = usePersonalizedLearning();

  const [activeTab, setActiveTab] = useState<'all' | AchievementCategory>('all');

  if (!isProfileModalOpen) return null;

  const achievements = profile?.achievements || [];
  const filteredAchievements = activeTab === 'all'
    ? achievements
    : achievements.filter((a) => a.category === activeTab);

  const unlockedCount = achievements.filter((a) => Boolean(a.unlockedAt)).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-3xl rounded-3xl bg-slate-900 border border-indigo-500/30 p-5 sm:p-8 text-slate-100 shadow-2xl relative flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black text-lg shadow-lg shadow-cyan-500/25">
              {profile?.firstName?.charAt(0) || 'S'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-arcade text-lg sm:text-xl font-bold text-white tracking-wide">
                  {profile?.displayName || 'Student Profile'}
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[11px] font-mono font-bold">
                  Class {profile?.class || '—'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Grade {profile?.grade === 'grade-8' ? '8' : '7'} English Review Cadet
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sounds.playTap();
                refreshProfile();
              }}
              title="Refresh Profile"
              disabled={isLoadingProfile}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all disabled:opacity-50"
            >
              <RotateCw className={`w-4 h-4 ${isLoadingProfile ? 'animate-spin' : ''}`} />
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

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto space-y-6 pt-4 pr-1">
          {profileError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <span>{profileError}</span>
            </div>
          )}

          {/* Level & XP Hero Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 to-indigo-950/40 border border-indigo-500/30 shadow-lg relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-arcade text-sm font-black shadow-md shadow-amber-400/20">
                    LEVEL {profile?.level || 1}
                  </span>
                  <span className="text-base sm:text-lg font-bold text-white tracking-wide">
                    {profile?.levelTitle || 'Novice Explorer'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Total XP Earned: <span className="font-mono text-cyan-300 font-extrabold">{profile?.totalXp || 0} XP</span>
                </p>
              </div>

              <button
                onClick={() => {
                  sounds.playNavigate();
                  openLeaderboardModal(profile?.class);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 hover:text-amber-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all self-start sm:self-auto hover:scale-105 active:scale-95"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Class Leaderboard</span>
              </button>
            </div>

            {/* XP Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs font-mono font-medium text-slate-400 mb-1.5">
                <span>Next Tier Progress</span>
                <span className="text-cyan-400 font-bold">{profile?.progressPercent || 0}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-800 overflow-hidden p-0.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${profile?.progressPercent || 0}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 shadow-md shadow-cyan-500/50"
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1 font-mono">
                <span>{profile?.minXp || 0} XP</span>
                <span>{profile?.nextLevelXp ? `${profile.nextLevelXp} XP to Level ${(profile?.level || 1) + 1}` : 'Max Level Reached!'}</span>
                <span>{profile?.maxXp || 100} XP</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Completed
              </span>
              <span className="font-mono text-2xl font-black text-cyan-400 mt-1 block">
                {profile?.stats?.activitiesCompleted || 0}
              </span>
              <span className="text-[10px] text-slate-500">Activities</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Total Plays
              </span>
              <span className="font-mono text-2xl font-black text-indigo-400 mt-1 block">
                {profile?.stats?.totalAttempts || 0}
              </span>
              <span className="text-[10px] text-slate-500">Attempts</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Average
              </span>
              <span className="font-mono text-2xl font-black text-purple-400 mt-1 block">
                {profile?.stats?.averageScore || 0}%
              </span>
              <span className="text-[10px] text-slate-500">Accuracy</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Flawless
              </span>
              <span className="font-mono text-2xl font-black text-amber-400 mt-1 block">
                {profile?.stats?.perfectScores || 0}
              </span>
              <span className="text-[10px] text-slate-500">100% Scores</span>
            </div>
          </div>

          {/* Phase 6: Personalized Learning Quick Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => {
                sounds.playNavigate();
                closeModals();
                openMistakesModal();
              }}
              className="p-3.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-left transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                  <RotateCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                </div>
                <div>
                  <div className="font-arcade text-xs sm:text-sm font-bold text-white tracking-wide">
                    MY MISTAKES
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Review and retry missed questions
                  </div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] font-mono font-bold">
                {uncorrectedMistakesCount}
              </span>
            </button>

            <button
              onClick={() => {
                sounds.playNavigate();
                closeModals();
                openMasteryModal();
              }}
              className="p-3.5 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-left transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Award className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <div className="font-arcade text-xs sm:text-sm font-bold text-white tracking-wide">
                    TOPIC MASTERY
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Progress & skill breakdown by unit
                  </div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[11px] font-mono font-bold">
                View
              </span>
            </button>
          </div>

          {/* Achievements Badges Shelf */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <h3 className="font-arcade text-sm font-bold text-white tracking-wide">
                  BADGES & ACHIEVEMENTS
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-mono font-bold">
                  {unlockedCount} / {achievements.length}
                </span>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1 overflow-x-auto text-xs">
                {(['all', 'starter', 'mastery', 'explorer', 'milestone'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      sounds.playTap();
                      setActiveTab(cat);
                    }}
                    className={`px-2.5 py-1 rounded-lg font-semibold capitalize transition-all ${
                      activeTab === cat
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredAchievements.map((badge) => {
                const isUnlocked = Boolean(badge.unlockedAt);
                const IconComponent = BADGE_ICONS[badge.icon] || Trophy;

                return (
                  <div
                    key={badge.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                      isUnlocked
                        ? 'bg-slate-950/90 border-amber-500/40 shadow-sm shadow-amber-500/10'
                        : 'bg-slate-950/40 border-slate-800/80 opacity-70'
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-2xl shrink-0 flex items-center justify-center ${
                        isUnlocked
                          ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 shadow-md shadow-amber-500/30'
                          : 'bg-slate-900 border border-slate-800 text-slate-600'
                      }`}
                    >
                      {isUnlocked ? (
                        <IconComponent className="w-5 h-5" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-xs text-white truncate block">
                          {badge.title}
                        </span>
                        {isUnlocked ? (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-0.5">
                            <CheckCircle className="w-2.5 h-2.5" />
                            Unlocked
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-mono">
                            {badge.progress !== undefined ? `${badge.progress}/${badge.target}` : 'Locked'}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                        {badge.description}
                      </p>
                      {badge.unlockedAt && (
                        <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-1 font-mono">
                          <Calendar className="w-2.5 h-2.5" />
                          {new Date(badge.unlockedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity Log */}
          {profile?.recentActivity && profile.recentActivity.length > 0 && (
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-cyan-400" />
                <h3 className="font-arcade text-sm font-bold text-white tracking-wide">
                  RECENT ACTIVITY
                </h3>
              </div>

              <div className="space-y-2">
                {profile.recentActivity.map((item, idx) => (
                  <div
                    key={`${item.attemptId}-${idx}`}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5 truncate max-w-[65%]">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 border border-slate-800 text-slate-400 uppercase">
                        {item.gameType?.replace('_', ' ')}
                      </span>
                      <span className="font-medium text-slate-200 truncate">
                        {item.activityTitle}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 font-mono">
                      <span className="text-purple-400 font-bold">{item.percentage}%</span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                        +{item.xpEarned} XP
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
