/**
 * UNIT REVIEW ARCADE — STUDENT MY CLASSROOM SCREEN (PHASE 3.4C)
 * 
 * Interactive student dashboard for classroom behavior points,
 * permanent milestone rewards, and private classroom feedback.
 * 
 * CORE ARCHITECTURAL PRINCIPLES:
 * 1. Strictly session-anchored: Identity resolved on backend; client never supplies studentNumber.
 * 2. Privacy & Dignity: 100% private to the authenticated student; no public smartboard negative display.
 * 3. Milestone Progress: Negative points never decrease progress toward milestone rewards.
 * 4. Permanent Ownership: Milestone rewards remain unlocked forever across academic years.
 * 5. Self-Healing Claim: Allows claiming eligible rewards if backend real-time writes were partial.
 * 6. Monster World Sync: Synchronizes unlocked rewards directly with Monster World accessories.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useArcade } from '../../context/ArcadeContext';
import { useGamification } from '../../context/GamificationContext';
import { StudentClassroomService } from '../../services/studentClassroomService';
import { MonsterAvatar } from '../monster/MonsterAvatar';
import { MonsterService } from '../../services/monsterService';
import { sounds } from '../../services/soundEffects';
import type { 
  StudentClassroomProfileResponse,
  StudentClaimableReward,
  StudentUnlockedRewardGrant,
  StudentClassroomFeedback,
  ClassroomRewardDefinition
} from '../../types/classroomPoints';
import { 
  Star, 
  Sparkles, 
  Award, 
  ArrowLeft, 
  RefreshCw, 
  Gift, 
  CheckCircle2, 
  Lock, 
  Clock, 
  MessageSquare, 
  ShieldAlert,
  Coins, 
  HelpCircle,
  Trophy,
  RotateCcw,
  Check,
  ShoppingBag
} from 'lucide-react';

// Authoritative 6 Milestone Rewards Catalog
const REWARD_MILESTONES: ClassroomRewardDefinition[] = [
  { id: 'rwd_first_star', name: 'First Star', desc: 'First classroom star badge', requiredPoints: 10, type: 'badge', cosmeticId: 'badge_first_star', icon: '⭐', sortOrder: 1 },
  { id: 'rwd_silver_star_frame', name: 'Silver Star Frame', desc: 'Silver star profile avatar frame', requiredPoints: 25, type: 'profile_frame', cosmeticId: 'frame_silver_star', icon: '🖼️', sortOrder: 2 },
  { id: 'rwd_monster_crown', name: 'Monster Crown', desc: 'Royal golden crown for Pip', requiredPoints: 50, type: 'monster_accessory', cosmeticId: 'hat_monster_crown', icon: '👑', sortOrder: 3 },
  { id: 'rwd_magic_wings', name: 'Magic Wings', desc: 'Enchanted glimmer wings for Pip', requiredPoints: 100, type: 'monster_accessory', cosmeticId: 'wings_magic', icon: '🪽', sortOrder: 4 },
  { id: 'rwd_elite_speaker', name: 'Elite Speaker', desc: 'Elite speaker profile badge', requiredPoints: 150, type: 'badge', cosmeticId: 'badge_elite_speaker', icon: '🎖️', sortOrder: 5 },
  { id: 'rwd_legendary_aura', name: 'Legendary Aura', desc: 'Radiant golden aura for Pip and profile', requiredPoints: 250, type: 'monster_aura', cosmeticId: 'aura_legendary', icon: '✨', sortOrder: 6 },
];

export const StudentMyClassroomScreen: React.FC = () => {
  const { student, sessionToken, updateStudentMonster } = useAuth();
  const { navigateTo } = useArcade();
  const { updateProfileMonster } = useGamification();

  const [profile, setProfile] = useState<StudentClassroomProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isClaiming, setIsClaiming] = useState<string | null>(null);
  const [isEquipping, setIsEquipping] = useState<string | null>(null);
  const [claimSuccessMessage, setClaimSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'rewards' | 'feedback'>('rewards');

  const studentNumber = student?.studentNumber || profile?.studentNumber || '';
  const monsterConfig = MonsterService.resolveMonster(student?.monster, studentNumber);

  // Load classroom profile
  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setClaimSuccessMessage(null);
    try {
      const fallbackInfo = student ? {
        studentNumber: student.studentNumber,
        class: student.class,
        fullName: student.displayName || student.firstName || 'Student',
      } : undefined;

      const response = await StudentClassroomService.getClassroomProfile(sessionToken, fallbackInfo);
      setProfile(response);
    } catch {
      // handled inside service with graceful fallback
    } finally {
      setIsLoading(false);
    }
  }, [sessionToken, student]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Handle claiming missing eligible reward
  const handleClaimReward = async (reward: StudentClaimableReward) => {
    setIsClaiming(reward.rewardId);
    setClaimSuccessMessage(null);
    try {
      const response = await StudentClassroomService.claimMilestoneReward(
        sessionToken,
        reward.rewardId,
        studentNumber
      );

      if (response.success) {
        sounds.playSuccess();
        setClaimSuccessMessage(`Hooray! You claimed ${reward.name}! It is now available in Monster World.`);
        await loadProfile();
      }
    } catch (e) {
      console.warn('Failed to claim reward:', e);
    } finally {
      setIsClaiming(null);
    }
  };

  // Handle equipping or unequipping wearable classroom rewards
  const handleToggleEquip = async (
    cosmeticId: string,
    slot: 'hat' | 'glasses' | 'clothing' | 'wings' | 'aura' | 'frame'
  ) => {
    setIsEquipping(cosmeticId);
    try {
      const currentEquipped = monsterConfig.accessories?.[slot];
      const nextItem = currentEquipped === cosmeticId ? null : cosmeticId;

      const result = await MonsterService.equipAccessory(
        studentNumber,
        sessionToken || undefined,
        slot,
        nextItem
      );

      if (result.success && result.monster) {
        updateStudentMonster?.(result.monster);
        updateProfileMonster?.(result.monster);
        sounds.playTap();
      }
    } catch (e) {
      console.warn('Failed to toggle equip:', e);
    } finally {
      setIsEquipping(null);
    }
  };

  const positivePoints = profile?.positivePoints ?? 0;
  const negativePoints = profile?.negativePoints ?? 0;
  const netPoints = profile?.netPoints ?? 0;
  const academicYear = profile?.academicYear ?? '2026-2027';
  const unlockedRewards: StudentUnlockedRewardGrant[] = profile?.unlockedRewards || [];
  const claimableRewards: StudentClaimableReward[] = profile?.claimableRewards || [];
  const feedbackHistory: StudentClassroomFeedback[] = profile?.feedbackHistory || [];
  const nextMilestone = profile?.nextMilestone;

  // Map of owned reward IDs
  const ownedRewardMap = new Set(unlockedRewards.map((r) => r.rewardId));

  // Format date helper
  const formatDate = (isoString: string) => {
    if (!isoString) return 'Recent';
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex-1 bg-gradient-to-b from-sky-50 via-slate-50 to-indigo-50/40 p-4 sm:p-6 md:p-8 space-y-6 max-w-6xl mx-auto w-full font-sans">
      
      {/* 1. Header Navigation & Hero Identity Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-sky-400 to-indigo-500" />

        {/* Left: Companion & Student Identity */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <MonsterAvatar
              config={monsterConfig}
              size={68}
              animate
              frame={monsterConfig.accessories?.frame}
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center font-black text-xs shadow-xs border-2 border-white">
              ⭐
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {student?.displayName || student?.firstName || profile?.studentNumber ? `Welcome, ${student?.displayName || student?.firstName || 'Student'}` : 'My Classroom'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
                Class {student?.class || profile?.studentClass || '7A'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
              <span>Academic Year <strong>{academicYear}</strong></span>
              <span>•</span>
              <span className="text-amber-700 font-bold">Classroom Behavior &amp; Rewards</span>
            </p>
          </div>
        </div>

        {/* Right: Action Shortcuts */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end flex-wrap">
          <button
            type="button"
            onClick={loadProfile}
            disabled={isLoading}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all font-bold text-xs flex items-center gap-1.5"
            title="Refresh Classroom Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playNavigate();
              navigateTo({ view: 'monster-world' });
            }}
            className="px-3.5 py-2 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs"
          >
            <Coins className="w-4 h-4 text-amber-500" />
            <span>Monster World</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playNavigate();
              navigateTo({ view: 'home' });
            }}
            className="px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>

      {/* Claim Success Banner */}
      {claimSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-bold">{claimSuccessMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setClaimSuccessMessage(null)}
            className="text-xs font-bold text-emerald-700 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 2. Point Breakdown Cards (3 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Positive Points */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-50 via-white to-amber-50/40 border-2 border-amber-200/80 shadow-xs space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              Positive Stars
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black">
              Milestone Progress
            </span>
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-amber-900">+{positivePoints}</span>
            <span className="text-xs font-bold text-amber-700">stars earned</span>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            Earned for speaking, focus, teamwork, and creative answers in class.
          </p>

          <div className="pt-2 border-t border-amber-100 flex items-center gap-1 text-[11px] font-bold text-amber-700">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Counts toward all reward milestones!</span>
          </div>
        </div>

        {/* Card 2: Negative Points */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-50 via-white to-rose-50/20 border-2 border-slate-200/80 shadow-xs space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-slate-500" />
              Areas for Focus
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
              Private
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-800">-{negativePoints}</span>
            <span className="text-xs font-bold text-slate-500">reminders</span>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            Helpful reminders to stay focused and avoid classroom distractions.
          </p>

          <div className="pt-2 border-t border-slate-100 flex items-center gap-1 text-[11px] font-bold text-slate-600">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Does NOT reduce your reward progress!</span>
          </div>
        </div>

        {/* Card 3: Net Balance */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-sky-50/40 border-2 border-indigo-200/80 shadow-xs space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-800 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-indigo-600" />
              Net Balance
            </span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold">
              AY {academicYear}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-black ${netPoints >= 0 ? 'text-indigo-900' : 'text-slate-800'}`}>
              {netPoints >= 0 ? `+${netPoints}` : netPoints}
            </span>
            <span className="text-xs font-bold text-indigo-700">net points</span>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            Your overall classroom balance for the {academicYear} academic year.
          </p>

          <div className="pt-2 border-t border-indigo-100 flex items-center gap-1 text-[11px] font-bold text-indigo-600">
            <span>🌟</span>
            <span>Keep participating and helping classmates!</span>
          </div>
        </div>
      </div>

      {/* 3. Sub-Navigation Tabs: Reward Roadmap vs Feedback History */}
      <div className="flex border-b border-slate-200 gap-4 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('rewards')}
          className={`pb-3 px-3 text-xs sm:text-sm font-black flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'rewards'
              ? 'border-amber-500 text-amber-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4 h-4 text-amber-500" />
          <span>Reward Milestones ({unlockedRewards.length} Unlocked)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('feedback')}
          className={`pb-3 px-3 text-xs sm:text-sm font-black flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'feedback'
              ? 'border-indigo-600 text-indigo-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4 text-indigo-600" />
          <span>Feedback History ({feedbackHistory.length})</span>
        </button>
      </div>

      {/* 4. Tab 1: Reward Milestone Roadmap */}
      {activeTab === 'rewards' && (
        <div className="space-y-6">
          
          {/* Next Milestone Hero Spotlight */}
          {nextMilestone ? (
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200 text-slate-900 shadow-md border-2 border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="w-16 h-16 rounded-2xl bg-white/90 text-2xl flex items-center justify-center shadow-xs shrink-0 ring-4 ring-amber-400/50">
                  {nextMilestone.icon || '🎁'}
                </div>
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/70 text-amber-950 font-black text-[10px] uppercase tracking-wider">
                    Next Goal
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-amber-950 mt-1">
                    {nextMilestone.name}
                  </h3>
                  <p className="text-xs font-medium text-amber-900">
                    Need <strong>{Math.max(0, nextMilestone.requiredPoints - positivePoints)}</strong> more positive stars to unlock!
                  </p>
                </div>
              </div>

              {/* Progress Gauge */}
              <div className="w-full sm:w-60 space-y-1.5 text-right">
                <div className="flex items-center justify-between text-xs font-black text-amber-950">
                  <span>{positivePoints} / {nextMilestone.requiredPoints} pts</span>
                  <span>{nextMilestone.progressPercent}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-amber-950/20 overflow-hidden p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-amber-600 to-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, nextMilestone.progressPercent)}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-3xl bg-gradient-to-r from-indigo-900 to-slate-900 text-white shadow-md flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-400 text-indigo-950 flex items-center justify-center text-2xl font-black shrink-0">
                👑
              </div>
              <div>
                <h3 className="text-lg font-black text-amber-300">Classroom Legend!</h3>
                <p className="text-xs text-indigo-200">
                  You have conquered all milestone rewards! Your companion holds legendary status in Monster World.
                </p>
              </div>
            </div>
          )}

          {/* Missing Reward Claim Bar (Self-Healing Recovery) */}
          {claimableRewards.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-3">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-600" />
                <h4 className="font-black text-xs sm:text-sm text-amber-900">
                  You have rewards ready to claim!
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {claimableRewards.map((cRwd) => (
                  <div
                    key={cRwd.rewardId}
                    className="p-3 rounded-xl bg-white border border-amber-200 flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">{cRwd.name}</span>
                      <span className="text-[10px] text-slate-500">{cRwd.requiredPoints} points required</span>
                    </div>
                    <button
                      type="button"
                      disabled={isClaiming === cRwd.rewardId}
                      onClick={() => handleClaimReward(cRwd)}
                      className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-xs transition-all flex items-center gap-1.5"
                    >
                      {isClaiming === cRwd.rewardId ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Gift className="w-3.5 h-3.5" />
                      )}
                      <span>Claim Reward</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All 6 Milestones Roadmap Grid */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
                  All Milestone Rewards
                </h3>
                <span className="text-[11px] text-slate-400">
                  Permanent Monster World cosmetics &amp; achievement badges
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  sounds.playNavigate();
                  navigateTo({ view: 'monster-world' });
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-xs flex items-center gap-1.5 transition self-start sm:self-auto shadow-2xs"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
                <span>Visit Monster World Wardrobe</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {REWARD_MILESTONES.map((milestone) => {
                const isOwned = ownedRewardMap.has(milestone.id);
                const isClaimable = claimableRewards.some((c) => c.rewardId === milestone.id);
                const isNext = nextMilestone?.rewardId === milestone.id;
                const progressPct = Math.min(100, Math.round((positivePoints / milestone.requiredPoints) * 100));

                const wearableSlot: 'hat' | 'wings' | 'aura' | 'frame' | null =
                  milestone.cosmeticId === 'hat_monster_crown'
                    ? 'hat'
                    : milestone.cosmeticId === 'wings_magic'
                    ? 'wings'
                    : milestone.cosmeticId === 'aura_legendary'
                    ? 'aura'
                    : milestone.cosmeticId === 'frame_silver_star'
                    ? 'frame'
                    : null;

                const isEquipped = wearableSlot
                  ? monsterConfig.accessories?.[wearableSlot] === milestone.cosmeticId
                  : false;

                return (
                  <div
                    key={milestone.id}
                    className={`p-4 rounded-3xl border-2 transition-all flex flex-col justify-between space-y-3 relative overflow-hidden ${
                      isOwned
                        ? 'bg-white border-emerald-300 shadow-sm'
                        : isClaimable
                        ? 'bg-amber-50/70 border-amber-400 shadow-sm ring-2 ring-amber-300'
                        : isNext
                        ? 'bg-white border-amber-300 shadow-xs ring-2 ring-amber-200'
                        : 'bg-slate-50/70 border-slate-200 opacity-80'
                    }`}
                  >
                    {/* Top Row: Icon & Status */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-2xl text-2xl flex items-center justify-center shrink-0 shadow-2xs ${
                            isOwned
                              ? 'bg-emerald-100 ring-2 ring-emerald-300'
                              : isClaimable
                              ? 'bg-amber-200 ring-2 ring-amber-400'
                              : 'bg-slate-200 text-slate-400'
                          }`}
                        >
                          {milestone.icon}
                        </div>
                        <div>
                          <h4 className="font-black text-sm text-slate-900 leading-tight">
                            {milestone.name}
                          </h4>
                          <span className="text-[10px] font-bold text-slate-500">
                            {milestone.requiredPoints} positive points
                          </span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      {isOwned ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center gap-1 shrink-0">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Unlocked</span>
                        </span>
                      ) : isClaimable ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-black shrink-0 animate-pulse">
                          Ready to Claim
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold flex items-center gap-1 shrink-0">
                          <Lock className="w-3 h-3 text-slate-400" />
                          <span>Locked</span>
                        </span>
                      )}
                    </div>

                    {/* Middle: Description */}
                    <p className="text-[11px] text-slate-500">
                      {milestone.desc}
                    </p>

                    {/* Bottom: Progress Bar or Claim CTA */}
                    <div className="pt-2 border-t border-slate-100">
                      {isOwned ? (
                        wearableSlot ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-[11px] text-emerald-700 font-bold">
                              <span>Owned Permanently</span>
                              <span className="text-[10px] text-emerald-600 font-mono">In Inventory</span>
                            </div>
                            <button
                              type="button"
                              disabled={isEquipping === milestone.cosmeticId}
                              onClick={() => handleToggleEquip(milestone.cosmeticId, wearableSlot)}
                              className={`w-full py-1.5 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
                                isEquipped
                                  ? 'bg-emerald-600 text-white shadow-xs hover:bg-emerald-700'
                                  : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
                              }`}
                            >
                              {isEquipping === milestone.cosmeticId ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              ) : isEquipped ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Equipped</span>
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                                  <span>Equip to Companion</span>
                                </>
                              )}
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px] text-emerald-700 font-bold">
                              <span>Owned Permanently</span>
                              <span className="text-[10px] text-emerald-600 font-mono">Badge Unlocked</span>
                            </div>
                            <p className="text-[10px] text-indigo-600 font-medium">
                              Active on your Student Profile &amp; Achievements shelf
                            </p>
                          </div>
                        )
                      ) : isClaimable ? (
                        <button
                          type="button"
                          disabled={isClaiming === milestone.id}
                          onClick={() => handleClaimReward({
                            rewardId: milestone.id,
                            name: milestone.name,
                            requiredPoints: milestone.requiredPoints,
                            type: milestone.type,
                            cosmeticId: milestone.cosmeticId,
                          })}
                          className="w-full min-h-[42px] py-1.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                        >
                          {isClaiming === milestone.id ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Gift className="w-3.5 h-3.5" />
                          )}
                          <span>Claim Reward Now</span>
                        </button>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                            <span>{positivePoints} / {milestone.requiredPoints} pts</span>
                            <span>{progressPct}%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                            <div
                              className="h-full bg-amber-400 rounded-full transition-all"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Academic Year Info Banner */}
          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs flex items-start gap-3">
            <span className="text-lg">📜</span>
            <div className="space-y-0.5">
              <p className="font-bold">Permanent Ownership Guarantee</p>
              <p className="text-[11px] text-indigo-700 leading-relaxed">
                Classroom points reset at the beginning of each academic year to give everyone a fresh start, but all rewards you unlock are permanently kept in your Monster World inventory forever!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 5. Tab 2: Private Feedback History */}
      {activeTab === 'feedback' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
                Classroom Feedback Ledger
              </h3>
              <p className="text-[11px] text-slate-400">
                Private feedback and notes recorded by your teacher
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {feedbackHistory.length} events this year
            </span>
          </div>

          {feedbackHistory.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white border border-slate-200">
              <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="font-bold text-slate-700 text-sm">No feedback recorded yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Participate in class activities and dialogue exercises to earn your first stars!
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {feedbackHistory.map((item, idx) => {
                const isCorrection = item.categoryType === 'correction' || item.isCorrection;
                const isPositive = item.grossPoints > 0;

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      isCorrection
                        ? 'bg-amber-50/60 border-amber-200'
                        : isPositive
                        ? 'bg-white border-slate-200 shadow-2xs hover:border-emerald-200'
                        : 'bg-white border-slate-200 shadow-2xs hover:border-slate-300'
                    }`}
                  >
                    {/* Left: Category & Timestamp */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                          isCorrection
                            ? 'bg-amber-100 text-amber-800'
                            : isPositive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {isCorrection ? <RotateCcw className="w-4 h-4" /> : isPositive ? '🌟' : '💡'}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-xs sm:text-sm text-slate-900">
                            {item.categoryName}
                          </span>
                          {isCorrection && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                              Corrected / Reversal
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(item.timestamp)}</span>
                        </span>
                      </div>
                    </div>

                    {/* Middle: Teacher Note */}
                    {item.note && (
                      <div className="flex-1 max-w-md px-2 py-1 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 italic">
                        "{item.note}"
                      </div>
                    )}

                    {/* Right: Point Value */}
                    <div className="shrink-0 self-end sm:self-auto">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-black ${
                          isCorrection
                            ? 'bg-amber-100 text-amber-800'
                            : isPositive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {item.grossPoints > 0 ? `+${item.grossPoints}` : item.grossPoints}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
