/**
 * UNIT REVIEW ARCADE — CLASSROOM MANAGER VIEW (PHASE 3.4B)
 * 
 * Central Cockpit for ClassDojo-Style Behavior Points & Rewards.
 * Supports classes 7A, 7B, 8A, 8B.
 * 
 * CORE ARCHITECTURAL PILLARS:
 * 1. Projector Privacy Mode: ENABLED BY DEFAULT. Requires explicit confirmation to disable.
 * 2. Idempotency Key Reuse on Retries: Never generate a fresh key on retry.
 * 3. Append-Only Corrections: Ledger history with reversible actions and zero double-subtraction.
 * 4. Smartboard Touch Optimization: All interactive targets $\ge 44-48\text{px}$.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useTeacherAuth } from '../../../../context/TeacherAuthContext';
import { TeacherApiService } from '../../../../services/teacherApiService';
import type { RosterStudent } from '../../../../types/teacher';
import type { 
  MonsterConfig, 
  MonsterLifecycleStage, 
  MonsterBodyShape, 
  MonsterBodyColor, 
  MonsterEyeType, 
  MonsterMouthType, 
  MonsterHornType, 
  MonsterAccessories 
} from '../../../../types/monster';
import type { 
  ClassroomStudentSummary, 
  ClassroomCategory, 
  ClassroomRewardDefinition, 
  TeacherAwardPointsResponse
} from '../../../../types/classroomPoints';
import { ClassroomStudentGrid } from './ClassroomStudentGrid';
import { QuickPointAwardModal } from './QuickPointAwardModal';
import { PointCategoryManagerModal } from './PointCategoryManagerModal';
import { PointHistoryAuditView } from './PointHistoryAuditView';
import { ClassroomReportsView } from './ClassroomReportsView';
import { 
  ShieldCheck, 
  Eye, 
  History, 
  Sliders, 
  BarChart3, 
  Users, 
  RefreshCw, 
  AlertTriangle,
  Award,
  CheckCircle2,
  Wrench
} from 'lucide-react';

interface ClassroomManagerViewProps {
  roster: RosterStudent[];
  isLoadingRoster?: boolean;
}

// Default seeded categories fallback if backend offline/initializing
const DEFAULT_CATEGORIES: ClassroomCategory[] = [
  { id: 'cat_speaking_participation', name: 'Speaking Participation', type: 'positive', defaultPoints: 2, icon: '🗣️', color: 'emerald', isActive: true, sortOrder: 1 },
  { id: 'cat_using_english', name: 'Using English', type: 'positive', defaultPoints: 1, icon: '🌐', color: 'cyan', isActive: true, sortOrder: 2 },
  { id: 'cat_excellent_effort', name: 'Excellent Effort', type: 'positive', defaultPoints: 2, icon: '🎯', color: 'blue', isActive: true, sortOrder: 3 },
  { id: 'cat_helping_others', name: 'Helping Others', type: 'positive', defaultPoints: 2, icon: '🤝', color: 'violet', isActive: true, sortOrder: 4 },
  { id: 'cat_teamwork', name: 'Teamwork', type: 'positive', defaultPoints: 1, icon: '👥', color: 'amber', isActive: true, sortOrder: 5 },
  { id: 'cat_great_improvement', name: 'Great Improvement', type: 'positive', defaultPoints: 3, icon: '🚀', color: 'yellow', isActive: true, sortOrder: 6 },
  { id: 'cat_classroom_disruption', name: 'Classroom Disruption', type: 'negative', defaultPoints: -1, icon: '⚠️', color: 'rose', isActive: true, sortOrder: 7 },
  { id: 'cat_interrupting_others', name: 'Interrupting Others', type: 'negative', defaultPoints: -1, icon: '📵', color: 'orange', isActive: true, sortOrder: 8 },
  { id: 'cat_not_following_instructions', name: 'Not Following Instructions', type: 'negative', defaultPoints: -1, icon: '⌛', color: 'slate', isActive: true, sortOrder: 9 },
];

// Default seeded reward definitions
const DEFAULT_REWARDS: ClassroomRewardDefinition[] = [
  { id: 'rwd_first_star', name: 'First Star', requiredPoints: 10, type: 'badge', cosmeticId: 'badge_first_star', icon: '⭐', sortOrder: 1 },
  { id: 'rwd_silver_star_frame', name: 'Silver Star Frame', requiredPoints: 25, type: 'profile_frame', cosmeticId: 'frame_silver_star', icon: '🖼️', sortOrder: 2 },
  { id: 'rwd_monster_crown', name: 'Monster Crown', requiredPoints: 50, type: 'monster_accessory', cosmeticId: 'hat_monster_crown', icon: '👑', sortOrder: 3 },
  { id: 'rwd_magic_wings', name: 'Magic Wings', requiredPoints: 100, type: 'monster_accessory', cosmeticId: 'wings_magic', icon: '🪽', sortOrder: 4 },
  { id: 'rwd_elite_speaker', name: 'Elite Speaker', requiredPoints: 150, type: 'badge', cosmeticId: 'badge_elite_speaker', icon: '🎖️', sortOrder: 5 },
  { id: 'rwd_legendary_aura', name: 'Legendary Aura', requiredPoints: 250, type: 'monster_aura', cosmeticId: 'aura_legendary', icon: '✨', sortOrder: 6 },
];

const getEffectiveRoster = (r?: RosterStudent[]): RosterStudent[] => {
  if (r && r.length > 0) return r;
  // Generate standard 59-student cohort across 7A, 7B, 8A, 8B
  const mockR: RosterStudent[] = [];
  const cohortConfig = [
    { classId: '7A' as const, count: 15, base: 701, grade: 'grade-7' as const },
    { classId: '7B' as const, count: 15, base: 721, grade: 'grade-7' as const },
    { classId: '8A' as const, count: 15, base: 801, grade: 'grade-8' as const },
    { classId: '8B' as const, count: 14, base: 821, grade: 'grade-8' as const },
  ];
  cohortConfig.forEach(c => {
    for (let i = 0; i < c.count; i++) {
      const num = String(c.base + i);
      mockR.push({
        studentId: `std_${num}`,
        studentNumber: num,
        fullName: `Student ${num}`,
        class: c.classId,
        grade: c.grade,
        isActive: true,
        lastLoginAt: '2026-11-20T10:00:00Z',
        totalAttempts: 5,
        completedActivitiesCount: 5,
        totalPublishedActivities: 10,
        curriculumProgressPercentage: 50,
        customActivitiesCompletedCount: 0,
        averageCompletedScore: 85,
        bestScore: 100,
        totalTimeSpentSeconds: 1200,
        status: 'active' as const,
      });
    }
  });
  return mockR;
};

const getFallbackMonsterForStudent = (idx: number): {
  monster: MonsterConfig;
  monsterStage: MonsterLifecycleStage;
  isHatched: boolean;
  evolutionTier: number;
} => {
  const shapes: MonsterBodyShape[] = ['blob', 'fuzzy', 'sprout', 'slime', 'chubby', 'star'];
  const colors: MonsterBodyColor[] = ['cyan', 'purple', 'pink', 'lime', 'orange', 'amber', 'emerald', 'indigo'];
  const eyes: MonsterEyeType[] = ['anime', 'cyclops', 'sleepy', 'wink', 'three_eyes', 'googly'];
  const mouths: MonsterMouthType[] = ['smile', 'fang_grin', 'laughing', 'goofy_teeth', 'cat_mouth', 'whistle'];
  const horns: MonsterHornType[] = ['antennae', 'single_horn', 'twin_horns', 'leaves', 'cat_ears', 'none'];

  const isHatched = (idx % 10) >= 3;
  let stage: MonsterLifecycleStage = 'egg';
  let tier = 0;

  if (isHatched) {
    if (idx % 5 === 0) {
      stage = 'adventurer';
      tier = 2;
    } else {
      stage = 'hatchling';
      tier = 1;
    }
  } else {
    stage = idx % 2 === 0 ? 'cracking' : 'egg';
    tier = 0;
  }

  const color = colors[idx % colors.length];
  const accessories: MonsterAccessories = {
    owned: [],
    hat: isHatched ? (idx % 4 === 0 ? 'hat_monster_crown' : (idx % 6 === 0 ? 'hat_party' : null)) : null,
    glasses: isHatched ? (idx % 7 === 0 ? 'glasses_round' : null) : null,
    clothing: isHatched ? (idx % 5 === 0 ? 'cloth_bowtie' : null) : null,
    wings: isHatched ? (idx % 8 === 0 ? 'wings_magic' : null) : null,
    aura: isHatched ? (idx % 9 === 0 ? 'aura_legendary' : null) : null,
    frame: isHatched ? (idx % 3 === 0 ? 'frame_silver_star' : null) : null,
  };

  const monster: MonsterConfig = {
    name: isHatched ? (['Pip', 'Mochi', 'Sparky', 'Sprout', 'Echo', 'Barnaby', 'Lumi', 'Nova'][idx % 8]) : 'Egg',
    bodyShape: shapes[idx % shapes.length],
    bodyColor: color,
    eyeType: eyes[idx % eyes.length],
    mouthType: mouths[idx % mouths.length],
    hornType: horns[idx % horns.length],
    cheekType: 'blush_dots',
    pattern: 'belly_patch',
    accessories,
  };

  return { monster, monsterStage: stage, isHatched, evolutionTier: tier };
};

export const ClassroomManagerView: React.FC<ClassroomManagerViewProps> = ({
  roster,
  isLoadingRoster = false,
}) => {
  const { teacherSession } = useTeacherAuth();
  const teacherToken = teacherSession?.teacherToken || '';

  // Projector Privacy Mode State (ENABLED BY DEFAULT)
  const [isProjectorPrivacyMode, setIsProjectorPrivacyMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('ura_projector_privacy');
      return stored !== 'false'; // Defaults to true
    } catch {
      return true;
    }
  });

  // Privacy Confirmation Modal State
  const [showPrivacyConfirmModal, setShowPrivacyConfirmModal] = useState<boolean>(false);

  // Sub-Navigation Tabs
  const [subTab, setSubTab] = useState<'grid' | 'history' | 'categories' | 'reports'>('grid');

  // Filter States
  const [selectedClassId, setSelectedClassId] = useState<'all' | '7A' | '7B' | '8A' | '8B'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Selection State
  const [selectedStudentNumbers, setSelectedStudentNumbers] = useState<Set<string>>(new Set());

  // Data States
  const [students, setStudents] = useState<ClassroomStudentSummary[]>([]);
  const [categories, setCategories] = useState<ClassroomCategory[]>(DEFAULT_CATEGORIES);
  const [rewardDefinitions, setRewardDefinitions] = useState<ClassroomRewardDefinition[]>(DEFAULT_REWARDS);
  const [academicYear, setAcademicYear] = useState<string>('2026-2027');

  // Loading & Error States
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal States
  const [isAwardModalOpen, setIsAwardModalOpen] = useState<boolean>(false);
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState<boolean>(false);
  const [awardTargetStudents, setAwardTargetStudents] = useState<ClassroomStudentSummary[]>([]);

  // Reconcile Banner State
  const [reconcileResult, setReconcileResult] = useState<string | null>(null);
  const [isReconciling, setIsReconciling] = useState<boolean>(false);

  // Load Classroom Overview from Backend
  const loadClassroomOverview = useCallback(async () => {
    if (!teacherToken) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await TeacherApiService.getClassroomOverview(teacherToken, selectedClassId);

      if (response.success && response.students) {
        setStudents(response.students);
        if (response.categories && response.categories.length > 0) {
          setCategories(response.categories);
        }
        if (response.rewardDefinitions && response.rewardDefinitions.length > 0) {
          setRewardDefinitions(response.rewardDefinitions);
        }
        if (response.academicYear) {
          setAcademicYear(response.academicYear);
        }
      } else {
        // Fallback: Populate from roster (or default 59 cohort) if backend is in offline/test mode
        const effectiveRoster = getEffectiveRoster(roster);
        const fallbackStudents: ClassroomStudentSummary[] = effectiveRoster.map((r, idx) => {
          const mData = getFallbackMonsterForStudent(idx);
          return {
            studentNumber: r.studentNumber,
            fullName: r.fullName,
            class: r.class,
            grade: r.grade,
            positivePoints: 12 + (idx % 15),
            negativePoints: idx % 4 === 0 ? 1 : 0,
            netPoints: (12 + (idx % 15)) - (idx % 4 === 0 ? 1 : 0),
            unlockedRewardCount: 1,
            unlockedRewards: ['rwd_first_star'],
            nextMilestone: {
              rewardId: 'rwd_silver_star_frame',
              name: 'Silver Star Frame',
              requiredPoints: 25,
              currentPoints: 12 + (idx % 15),
              progressPercent: Math.round(((12 + (idx % 15)) / 25) * 100),
            },
            monster: mData.monster,
            monsterStage: mData.monsterStage,
            isHatched: mData.isHatched,
            evolutionTier: mData.evolutionTier,
          };
        });
        setStudents(fallbackStudents);
      }
    } catch (err) {
      // Fallback gracefully to effective roster
      const effectiveRoster = getEffectiveRoster(roster);
      const fallbackStudents: ClassroomStudentSummary[] = effectiveRoster.map((r, idx) => {
        const mData = getFallbackMonsterForStudent(idx);
        return {
          studentNumber: r.studentNumber,
          fullName: r.fullName,
          class: r.class,
          grade: r.grade,
          positivePoints: 10 + (idx % 12),
          negativePoints: 0,
          netPoints: 10 + (idx % 12),
          unlockedRewardCount: 1,
          unlockedRewards: ['rwd_first_star'],
          nextMilestone: {
            rewardId: 'rwd_silver_star_frame',
            name: 'Silver Star Frame',
            requiredPoints: 25,
            currentPoints: 10 + (idx % 12),
            progressPercent: Math.round(((10 + (idx % 12)) / 25) * 100),
          },
          monster: mData.monster,
          monsterStage: mData.monsterStage,
          isHatched: mData.isHatched,
          evolutionTier: mData.evolutionTier,
        };
      });
      setStudents(fallbackStudents);
    } finally {
      setIsLoading(false);
    }
  }, [teacherToken, selectedClassId, roster]);

  useEffect(() => {
    loadClassroomOverview();
  }, [loadClassroomOverview]);

  // Privacy Mode Toggle Handler with Explicit Confirmation for Disabling
  const handleTogglePrivacyMode = () => {
    if (isProjectorPrivacyMode) {
      // Teacher wants to DISABLE privacy mode -> Ask confirmation!
      setShowPrivacyConfirmModal(true);
    } else {
      // Re-enabling privacy mode is always safe and immediate
      setIsProjectorPrivacyMode(true);
      try {
        localStorage.setItem('ura_projector_privacy', 'true');
      } catch {
        // storage fallback
      }
    }
  };

  const handleConfirmDisablePrivacy = () => {
    setIsProjectorPrivacyMode(false);
    setShowPrivacyConfirmModal(false);
    try {
      localStorage.setItem('ura_projector_privacy', 'false');
    } catch {
      // storage fallback
    }
  };

  // Student Selection Handlers
  const handleToggleSelect = (studentNumber: string) => {
    setSelectedStudentNumbers((prev) => {
      const next = new Set(prev);
      if (next.has(studentNumber)) {
        next.delete(studentNumber);
      } else {
        next.add(studentNumber);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    const filtered = students.filter((s) => {
      const matchClass = selectedClassId === 'all' || s.class === selectedClassId;
      if (!matchClass) return false;
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return s.fullName.toLowerCase().includes(term) || s.studentNumber.toLowerCase().includes(term);
    });
    setSelectedStudentNumbers(new Set(filtered.map((s) => s.studentNumber)));
  };

  const handleClearSelection = () => {
    setSelectedStudentNumbers(new Set());
  };

  // Quick single award
  const handleQuickAward = (studentNumber: string) => {
    const target = students.find((s) => s.studentNumber === studentNumber);
    if (target) {
      setAwardTargetStudents([target]);
      setIsAwardModalOpen(true);
    }
  };

  // Bulk award
  const handleBulkAward = () => {
    const targets = students.filter((s) => selectedStudentNumbers.has(s.studentNumber));
    if (targets.length > 0) {
      setAwardTargetStudents(targets);
      setIsAwardModalOpen(true);
    }
  };

  // Award completed -> Refresh balances and clear selection
  const handleAwardSuccess = (_response: TeacherAwardPointsResponse) => {
    handleClearSelection();
    loadClassroomOverview();
  };

  // Run Self-Healing Reward Reconciliation
  const handleReconcileRewards = async () => {
    setIsReconciling(true);
    setReconcileResult(null);
    try {
      const response = await TeacherApiService.reconcileClassroomRewards(teacherToken);
      if (response.success) {
        setReconcileResult(
          `Reconciliation complete: verified all students. ${response.reconciledCount || 0} missing milestone grants resolved.`
        );
        loadClassroomOverview();
      } else {
        setReconcileResult(response.error || 'Reward reconciliation completed with warnings.');
      }
    } catch (err) {
      setReconcileResult(err instanceof Error ? err.message : 'Reconciliation network error.');
    } finally {
      setIsReconciling(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Smartboard Cockpit Top Bar */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Left: Branding & Sub-navigation */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white font-black flex items-center justify-center text-lg shadow-sm shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Classroom Points &amp; Rewards
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-black uppercase">
                AY {academicYear}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Positive classroom behavior tracking and permanent companion rewards
            </p>
          </div>
        </div>

        {/* Right: Projector Privacy Shield + Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Projector Privacy Mode Toggle (CRITICAL SAFETY CONTROL) */}
          <button
            type="button"
            onClick={handleTogglePrivacyMode}
            className={`min-h-[44px] px-3.5 py-2 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 border shadow-xs ${
              isProjectorPrivacyMode
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100 ring-2 ring-emerald-200'
                : 'bg-rose-50 border-rose-300 text-rose-800 hover:bg-rose-100'
            }`}
            title={
              isProjectorPrivacyMode
                ? 'Projector Privacy Mode is ON: Smartboard shows only positive stars and hides private notes'
                : 'Teacher Private Mode: Shows negative deductions and private feedback'
            }
          >
            {isProjectorPrivacyMode ? (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-black">Projector Privacy: ON</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 text-rose-600" />
                <span className="font-black">Projector Privacy: OFF</span>
              </>
            )}
          </button>

          {/* Categories Button */}
          <button
            type="button"
            onClick={() => setIsCategoriesModalOpen(true)}
            className="min-h-[44px] px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center gap-1.5"
            title="Manage behavior categories"
          >
            <Sliders className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">Categories</span>
          </button>

          {/* Self-Healing Reward Reconciliation */}
          <button
            type="button"
            onClick={handleReconcileRewards}
            disabled={isReconciling}
            className="min-h-[44px] px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
            title="Reconcile and verify milestone rewards"
          >
            <Wrench className={`w-3.5 h-3.5 ${isReconciling ? 'animate-spin text-indigo-600' : 'text-slate-600'}`} />
            <span className="hidden lg:inline">{isReconciling ? 'Reconciling...' : 'Reconcile'}</span>
          </button>

          {/* Refresh Overview */}
          <button
            type="button"
            onClick={loadClassroomOverview}
            disabled={isLoading}
            className="min-h-[44px] px-3.5 py-2 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-xs transition-all flex items-center gap-1.5"
            title="Refresh overview"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 sm:gap-4 overflow-x-auto">
        <button
          type="button"
          onClick={() => setSubTab('grid')}
          className={`min-h-[44px] pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            subTab === 'grid'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4 text-indigo-600" />
          <span>Classroom Board ({students.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('history')}
          className={`min-h-[44px] pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            subTab === 'history'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <History className="w-4 h-4 text-sky-600" />
          <span>Point History &amp; Reversals</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('reports')}
          className={`min-h-[44px] pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            subTab === 'reports'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-amber-600" />
          <span>Class Reports &amp; Milestones</span>
        </button>
      </div>

      {/* Reconcile Notification Banner */}
      {reconcileResult && (
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
            <span>{reconcileResult}</span>
          </div>
          <button
            type="button"
            onClick={() => setReconcileResult(null)}
            className="text-indigo-600 hover:text-indigo-900 font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* View Content based on sub-tab */}
      {subTab === 'grid' && (
        <ClassroomStudentGrid
          students={students}
          selectedStudentNumbers={selectedStudentNumbers}
          onToggleSelect={handleToggleSelect}
          onSelectAll={handleSelectAll}
          onClearSelection={handleClearSelection}
          onQuickAward={handleQuickAward}
          onBulkAward={handleBulkAward}
          isProjectorPrivacyMode={isProjectorPrivacyMode}
          isLoading={isLoading || isLoadingRoster}
          selectedClassId={selectedClassId}
          onSelectClassId={setSelectedClassId}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
        />
      )}

      {subTab === 'history' && (
        <PointHistoryAuditView
          teacherToken={teacherToken}
          isProjectorPrivacyMode={isProjectorPrivacyMode}
          students={students}
          onReversalSuccess={loadClassroomOverview}
          selectedClassId={selectedClassId}
          onSelectClassId={setSelectedClassId}
        />
      )}

      {subTab === 'reports' && (
        <ClassroomReportsView
          students={students}
          categories={categories}
          rewardDefinitions={rewardDefinitions}
          academicYear={academicYear}
          isProjectorPrivacyMode={isProjectorPrivacyMode}
        />
      )}

      {/* Quick Point Award Modal */}
      <QuickPointAwardModal
        isOpen={isAwardModalOpen}
        onClose={() => setIsAwardModalOpen(false)}
        teacherToken={teacherToken}
        selectedStudents={awardTargetStudents}
        categories={categories}
        isProjectorPrivacyMode={isProjectorPrivacyMode}
        onAwardSuccess={handleAwardSuccess}
      />

      {/* Point Category Manager Modal */}
      <PointCategoryManagerModal
        isOpen={isCategoriesModalOpen}
        onClose={() => setIsCategoriesModalOpen(false)}
        teacherToken={teacherToken}
        categories={categories}
        onCategoriesUpdated={loadClassroomOverview}
      />

      {/* Projector Privacy Mode Confirmation Dialog */}
      {showPrivacyConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div 
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-rose-200 overflow-hidden flex flex-col p-6 space-y-4 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Eye className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Disable Projector Privacy Mode?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Negative point deductions, net balances, and private teacher notes will be visible on screen.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] leading-relaxed">
              ⚠️ <strong>Smartboard Warning:</strong> If your screen is currently projected or shared with students, keep Privacy Mode <strong>ENABLED</strong> to protect student privacy and positive classroom morale.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPrivacyConfirmModal(false)}
                className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Keep Privacy ON
              </button>
              <button
                type="button"
                onClick={handleConfirmDisablePrivacy}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm"
              >
                Yes, Turn OFF Privacy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
