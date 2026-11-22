/**
 * UNIT REVIEW ARCADE — STUDENT PROFILE MODAL (PHASE 9C)
 * Version: 9.3.0
 * 
 * Colorful Game World + Bright Creative Campus redesign.
 * Redesigned as an Explorer Passport with stats, companion stamp,
 * mastery links, achievement shelf, and recent adventure history.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useArcade } from '../../context/ArcadeContext';
import { useGamification } from '../../context/GamificationContext';
import { usePersonalizedLearning } from '../../context/PersonalizedLearningContext';
import { MonsterAvatar } from '../monster/MonsterAvatar';
import { MonsterService } from '../../services/monsterService';
import { CoinService } from '../../services/coinService';
import { sounds } from '../../services/soundEffects';
import { getMonsterMilestoneInfo } from '../../types/monster';
import type { AchievementCategory, Achievement } from '../../types/gamification';
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
  Coins,
  Star,
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
  Star,
};

export const StudentProfileModal: React.FC = () => {
  const { navigateTo } = useArcade();
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

  const studentNumber = profile?.studentNumber || '';
  const monsterConfig = MonsterService.resolveMonster(profile?.monster, studentNumber);
  const coinBalance = profile?.totalCoins ?? CoinService.getBalance(studentNumber);
  const milestoneInfo = getMonsterMilestoneInfo(profile?.totalXp || 0);

  if (!isProfileModalOpen) return null;

  const ownedAccessories = monsterConfig.accessories?.owned || MonsterService.getOwnedAccessories(studentNumber);

  // Classroom milestone badges
  const classroomBadges: Achievement[] = [
    {
      id: 'badge_first_star',
      title: 'First Star',
      description: 'Earned 10 positive behavior points in English class.',
      icon: 'Star',
      category: 'milestone',
      target: 10,
      progress: ownedAccessories.includes('badge_first_star') ? 10 : 0,
      unlockedAt: ownedAccessories.includes('badge_first_star')
        ? (profile?.recentActivity?.[0]?.completedAt || '2026-10-15T09:30:00.000Z')
        : null,
    },
    {
      id: 'badge_elite_speaker',
      title: 'Elite Speaker',
      description: 'Earned 150 positive behavior points in English class.',
      icon: 'Award',
      category: 'milestone',
      target: 150,
      progress: ownedAccessories.includes('badge_elite_speaker') ? 150 : 0,
      unlockedAt: ownedAccessories.includes('badge_elite_speaker')
        ? (profile?.recentActivity?.[0]?.completedAt || '2026-10-15T09:30:00.000Z')
        : null,
    },
  ];

  const baseAchievements = profile?.achievements || [];
  const mergedAchievements: Achievement[] = [...baseAchievements];
  classroomBadges.forEach((cb) => {
    if (!mergedAchievements.some((a) => a.id === cb.id)) {
      mergedAchievements.push(cb);
    }
  });

  const filteredAchievements = activeTab === 'all'
    ? mergedAchievements
    : mergedAchievements.filter((a) => a.category === activeTab);

  const unlockedCount = mergedAchievements.filter((a) => Boolean(a.unlockedAt)).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-3xl rounded-3xl bg-white border-4 border-sky-300 p-5 sm:p-8 text-slate-800 shadow-2xl relative flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Soft Sunny Ambient Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-sky-200/50 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header — Explorer Passport Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-sky-100 shrink-0 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-sky-400/30">
              {profile?.firstName?.charAt(0) || 'S'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bubble text-xl sm:text-2xl text-slate-900 tracking-wide">
                  {profile?.displayName || 'Explorer Passport'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-mono font-bold">
                  Class {profile?.class || '—'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Grade {profile?.grade === 'grade-8' ? '8' : '7'} English Explorer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sounds.playTap();
                refreshProfile();
              }}
              title="Refresh Passport"
              disabled={isLoadingProfile}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-all disabled:opacity-50"
            >
              <RotateCw className={`w-4 h-4 ${isLoadingProfile ? 'animate-spin' : ''}`} />
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

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto space-y-6 pt-4 pr-1 relative z-10">
          {profileError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <span>{profileError}</span>
            </div>
          )}

          {/* Level & XP Hero Passport Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-sky-50 via-indigo-50/60 to-purple-50 border-2 border-sky-200 shadow-sm relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-18 h-18 rounded-2xl bg-white border-2 border-indigo-200 flex items-center justify-center p-1.5 shrink-0 overflow-hidden shadow-sm">
                  <MonsterAvatar
                    config={monsterConfig}
                    size={64}
                    animate
                    frame={monsterConfig.accessories?.frame}
                    stage={milestoneInfo.stage}
                    evolutionTier={milestoneInfo.evolutionTier}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-900 font-black text-xs shadow-sm uppercase tracking-wider">
                      LEVEL {profile?.level || 1}
                    </span>
                    <span className="text-base sm:text-lg font-bold text-slate-900 tracking-wide">
                      {profile?.levelTitle || 'Novice Explorer'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5 mt-2 text-xs text-slate-600">
                    <span className="font-semibold">
                      XP: <strong className="font-mono text-sky-700 font-black text-sm">{profile?.totalXp || 0}</strong>
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-bold">
                      <Coins className="w-3.5 h-3.5 text-amber-600" />
                      <span>{coinBalance} Coins</span>
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-purple-100 border border-purple-200 text-purple-800 font-bold">
                      {milestoneInfo.isEgg
                        ? milestoneInfo.stageName
                        : `Companion: ${monsterConfig.name} (${milestoneInfo.stageName})`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                <button
                  onClick={() => {
                    sounds.playNavigate();
                    closeModals();
                    navigateTo({ view: 'monster-world' });
                  }}
                  className="btn-game-purple text-xs font-bold px-3.5 py-2.5 rounded-2xl flex items-center justify-center gap-1.5 shadow-sm hover:scale-105 active:scale-95 transition-transform"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Monster World</span>
                </button>

                <button
                  onClick={() => {
                    sounds.playNavigate();
                    openLeaderboardModal(profile?.class);
                  }}
                  className="btn-game-amber text-xs font-bold px-3.5 py-2.5 rounded-2xl flex items-center justify-center gap-1.5 shadow-sm hover:scale-105 active:scale-95 transition-transform"
                >
                  <Trophy className="w-4 h-4" />
                  <span>Leaderboard</span>
                </button>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-600 mb-1.5">
                <span>Next Milestone Progress</span>
                <span className="text-sky-700 font-black">{profile?.progressPercent || 0}%</span>
              </div>
              <div className="w-full h-3.5 rounded-full bg-white/90 border border-sky-200 overflow-hidden p-0.5 shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${profile?.progressPercent || 0}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 shadow-sm"
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5 font-mono font-medium">
                <span>{profile?.minXp || 0} XP</span>
                <span className="text-indigo-600 font-bold">{profile?.nextLevelXp ? `${profile.nextLevelXp} XP to Level ${(profile?.level || 1) + 1}` : 'Max Level Reached!'}</span>
                <span>{profile?.maxXp || 100} XP</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-sky-50 border-2 border-sky-100 text-center shadow-sm">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Completed
              </span>
              <span className="font-mono text-2xl font-black text-sky-700 mt-1 block">
                {profile?.stats?.activitiesCompleted || 0}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Activities</span>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50 border-2 border-indigo-100 text-center shadow-sm">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Total Plays
              </span>
              <span className="font-mono text-2xl font-black text-indigo-700 mt-1 block">
                {profile?.stats?.totalAttempts || 0}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Attempts</span>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50 border-2 border-purple-100 text-center shadow-sm">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Average
              </span>
              <span className="font-mono text-2xl font-black text-purple-700 mt-1 block">
                {profile?.stats?.averageScore || 0}%
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Accuracy</span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-100 text-center shadow-sm">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Flawless
              </span>
              <span className="font-mono text-2xl font-black text-amber-700 mt-1 block">
                {profile?.stats?.perfectScores || 0}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">100% Scores</span>
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
              className="p-4 rounded-2xl bg-rose-50 hover:bg-rose-100/70 border-2 border-rose-200 text-left transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-between group shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-200 text-rose-700 flex items-center justify-center">
                  <RotateCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                </div>
                <div>
                  <div className="font-bubble text-sm text-slate-900 tracking-wide">
                    MY MISTAKES
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    Review and retry missed questions
                  </div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-rose-200 text-rose-800 font-mono font-bold text-xs">
                {uncorrectedMistakesCount}
              </span>
            </button>

            <button
              onClick={() => {
                sounds.playNavigate();
                closeModals();
                openMasteryModal();
              }}
              className="p-4 rounded-2xl bg-teal-50 hover:bg-teal-100/70 border-2 border-teal-200 text-left transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-between group shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-200 text-teal-700 flex items-center justify-center">
                  <Award className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <div className="font-bubble text-sm text-slate-900 tracking-wide">
                    TOPIC MASTERY
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    Progress & skill breakdown by unit
                  </div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-teal-200 text-teal-800 font-mono font-bold text-xs">
                View
              </span>
            </button>
          </div>

          {/* Achievements Badges Shelf */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="font-bubble text-base text-slate-900 tracking-wide">
                  BADGES & ACHIEVEMENTS
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-bold">
                  {unlockedCount} / {mergedAchievements.length}
                </span>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
                {(['all', 'starter', 'mastery', 'explorer', 'milestone'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      sounds.playTap();
                      setActiveTab(cat);
                    }}
                    className={`px-3 py-1 rounded-xl font-bold capitalize transition-all ${
                      activeTab === cat
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
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
                    className={`p-3.5 rounded-2xl border-2 transition-all flex items-start gap-3 ${
                      isUnlocked
                        ? 'bg-amber-50/70 border-amber-200 shadow-sm'
                        : 'bg-slate-50 border-slate-200/80 opacity-70'
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-2xl shrink-0 flex items-center justify-center ${
                        isUnlocked
                          ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-900 shadow-md shadow-amber-400/20'
                          : 'bg-slate-200 text-slate-400'
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
                        <span className="font-bold text-xs text-slate-900 truncate block">
                          {badge.title}
                        </span>
                        {isUnlocked ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold flex items-center gap-1">
                            <CheckCircle className="w-2.5 h-2.5" />
                            Unlocked
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-mono font-medium">
                            {badge.progress !== undefined ? `${badge.progress}/${badge.target}` : 'Locked'}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">
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
                <Clock className="w-4 h-4 text-sky-600" />
                <h3 className="font-bubble text-base text-slate-900 tracking-wide">
                  RECENT ACTIVITY
                </h3>
              </div>

              <div className="space-y-2">
                {profile.recentActivity.map((item, idx) => (
                  <div
                    key={`${item.attemptId}-${idx}`}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5 truncate max-w-[65%]">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-100 text-sky-700 uppercase">
                        {item.gameType?.replace('_', ' ')}
                      </span>
                      <span className="font-medium text-slate-800 truncate">
                        {item.activityTitle}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 font-mono">
                      <span className="text-purple-700 font-bold">{item.percentage}%</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
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
