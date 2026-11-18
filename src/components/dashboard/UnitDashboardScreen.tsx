import React, { useState, useEffect } from 'react';
import { useArcade } from '../../context/ArcadeContext';
import { useAuth } from '../../context/AuthContext';
import { useGamification } from '../../context/GamificationContext';
import type { GradeId, GameType } from '../../types/schema';
import { GAME_TYPE_METADATA } from '../../types/schema';
import { motion, AnimatePresence } from 'framer-motion';
import { EmptyState } from '../common/EmptyState';
import { sounds } from '../../services/soundEffects';
import { 
  ArrowLeft, 
  PlusCircle, 
  Gamepad2, 
  Layers, 
  Play, 
  Trash2, 
  Settings, 
  HelpCircle, 
  AlignLeft, 
  CheckCircle2, 
  BookMarked,
  SlidersHorizontal,
  Train,
  Sparkles,
  Trophy
} from 'lucide-react';

interface UnitDashboardScreenProps {
  gradeId: GradeId;
  unitId: string;
}

// Icon mapper for game types
const GAME_ICONS: Record<GameType, React.FC<{ className?: string }>> = {
  quiz_battle: (props) => <HelpCircle {...props} />,
  match_it: (props) => <Layers {...props} />,
  sentence_builder: (props) => <AlignLeft {...props} />,
  true_false: (props) => <CheckCircle2 {...props} />,
  reading_detective: (props) => <BookMarked {...props} />,
  train_station: (props) => <Train {...props} />,
};

export const UnitDashboardScreen: React.FC<UnitDashboardScreenProps> = ({ gradeId, unitId }) => {
  const { student, authMode } = useAuth();
  const { 
    data, 
    goToGrade, 
    goToGame,
    openTeacherPanel, 
    createActivity, 
    deleteActivity,
  } = useArcade();
  const { profile } = useGamification();

  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [actTitle, setActTitle] = useState('');
  const [actGameType, setActGameType] = useState<GameType>('quiz_battle');
  const [actInstructions, setActInstructions] = useState('');

  // Strict Grade Guard: redirect student if accessing a unit outside their grade
  useEffect(() => {
    if (student && gradeId !== student.grade) {
      goToGrade(student.grade);
    }
  }, [student, gradeId, goToGrade]);

  if (student && gradeId !== student.grade) {
    return null;
  }

  const gradeUnits = data.units[gradeId] || [];
  const unit = gradeUnits.find((u) => u.id === unitId);
  const gradeLabel = gradeId === 'grade-7' ? 'Grade 7' : 'Grade 8';

  if (!unit) {
    return (
      <div className="relative min-h-[calc(100vh-4.5rem)] py-12 px-4 max-w-4xl mx-auto text-center selection:bg-cyan-500 selection:text-white">
        <div className="card-island p-8 bg-white">
          <EmptyState
            icon={Gamepad2}
            badge="Unit Not Found"
            title="Requested Unit Does Not Exist"
            description="The curriculum island you were looking for was removed or could not be loaded."
            actionLabel={`Return to ${gradeLabel}`}
            onAction={() => goToGrade(gradeId)}
          />
        </div>
      </div>
    );
  }

  // Calculate completed count and identify the next recommended quest
  const recentActivities = profile?.recentActivity || [];
  const completedActivityIds = new Set(recentActivities.map((r) => r.activityId));
  const completedCount = unit.activities.filter((a) => completedActivityIds.has(a.id)).length;
  const nextRecommendedIndex = unit.activities.findIndex((a) => !completedActivityIds.has(a.id));

  const handleQuickCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actTitle.trim()) return;

    createActivity(unit.id, {
      title: actTitle.trim(),
      gameType: actGameType,
      instructions: actInstructions.trim() || undefined,
      settings: {
        timeLimitSeconds: 30,
        showTimer: true,
        allowRevealAnswer: true,
      },
      questions: [],
    });

    setActTitle('');
    setActInstructions('');
    setIsQuickCreateOpen(false);
  };

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] py-6 px-4 md:px-8 max-w-7xl mx-auto w-full flex flex-col space-y-6 selection:bg-cyan-500 selection:text-white">
      
      {/* Background Decor: Floating Clouds */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 right-14 opacity-70 anim-cloud">
          <svg width="210" height="105" viewBox="0 0 210 105" fill="#ffffff">
            <path d="M 30 75 A 30 30 0 0 1 85 60 A 45 45 0 0 1 160 55 A 30 30 0 0 1 200 75 A 20 20 0 0 1 180 100 L 45 100 A 20 20 0 0 1 30 75 Z" filter="drop-shadow(0 10px 20px rgba(14,165,233,0.08))" />
          </svg>
        </div>
        <div className="absolute top-48 left-10 opacity-60 anim-cloud" style={{ animationDelay: '5s' }}>
          <svg width="170" height="85" viewBox="0 0 170 85" fill="#ffffff">
            <path d="M 22 60 A 24 24 0 0 1 65 50 A 35 35 0 0 1 125 45 A 24 24 0 0 1 158 60 A 16 16 0 0 1 142 80 L 32 80 A 16 16 0 0 1 22 60 Z" filter="drop-shadow(0 8px 16px rgba(14,165,233,0.06))" />
          </svg>
        </div>
      </div>

      {/* Unit Breadcrumb & Progress Banner */}
      <div className="card-island p-6 flex flex-wrap items-center justify-between gap-4 relative z-10 bg-white">
        
        <div>
          {/* Breadcrumb Path */}
          <div className="flex items-center gap-2 mb-1.5">
            <button
              onClick={() => {
                sounds.playTap();
                goToGrade(gradeId);
              }}
              className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 group transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Islands Map</span>
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-slate-500">
              {gradeLabel} • Unit {unit.unitNumber}: {unit.title}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black font-display text-slate-900 tracking-tight">
            The Trail of Quests: {unit.title}
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            {unit.description || 'Complete each game station to master vocabulary, grammar, and earn Monster Coins!'}
          </p>
        </div>

        {/* Right: Unit Mastery Badge & Teacher Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-sky-50 px-4 py-2.5 rounded-2xl border-2 border-sky-200 text-xs font-black text-sky-900 flex items-center gap-2 shadow-sm">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Unit Mastery:</span>
            <span className="text-sky-600 font-mono text-sm">
              {completedCount} / {unit.activities.length} Completed
            </span>
          </div>

          {authMode !== 'student' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sounds.playTap();
                  setIsQuickCreateOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl btn-game-primary text-xs font-black flex items-center gap-1.5 shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Activity</span>
              </button>

              <button
                onClick={() => {
                  sounds.playTap();
                  openTeacherPanel('units', gradeId);
                }}
                className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-bold transition-all"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>

      {/* QUICK ACTIVITY CREATION INLINE MODAL (Teacher / Classroom Mode Only) */}
      <AnimatePresence>
        {isQuickCreateOpen && authMode !== 'student' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card-island p-6 relative z-10 bg-white border-2 border-sky-300 shadow-xl overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-sky-600" />
                <h3 className="font-display text-lg font-black text-slate-900">
                  Add Activity to Unit {unit.unitNumber} ({gradeLabel})
                </h3>
              </div>
              <button
                onClick={() => setIsQuickCreateOpen(false)}
                className="text-slate-500 hover:text-slate-800 text-xs font-bold px-2.5 py-1 rounded-lg hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleQuickCreateActivity} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Activity Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vocabulary Quest, Grammar Sprint..."
                    value={actTitle}
                    onChange={(e) => setActTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Instructions for Students
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Choose the correct answers on the screen."
                    value={actInstructions}
                    onChange={(e) => setActInstructions(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                  Select Game Engine
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(Object.keys(GAME_TYPE_METADATA) as GameType[]).map((gt) => {
                    const meta = GAME_TYPE_METADATA[gt];
                    const Icon = GAME_ICONS[gt];
                    const isSelected = actGameType === gt;

                    return (
                      <button
                        key={gt}
                        type="button"
                        onClick={() => {
                          sounds.playTap();
                          setActGameType(gt);
                        }}
                        className={`p-3 rounded-2xl border-2 text-left transition-all ${
                          isSelected
                            ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-200'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="w-4 h-4 text-sky-600" />
                          <span className="font-display font-bold text-xs text-slate-900">{meta.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-snug line-clamp-1">{meta.shortDesc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl btn-game-primary text-xs font-black flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Save Activity</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Quests Grid / Trail */}
      {unit.activities.length === 0 ? (
        <div className="card-island p-10 bg-white text-center my-auto relative z-10">
          <EmptyState
            icon={Gamepad2}
            badge="Activity Vault Empty"
            title="No Activities Configured in This Unit"
            description={`Unit ${unit.unitNumber} is ready for game activities. You can add Quiz Battle, Match It!, Sentence Builder, or True/False challenges using the Teacher Panel.`}
            actionLabel="+ Add First Activity"
            onAction={() => setIsQuickCreateOpen(true)}
            secondaryActionLabel="Open Teacher Panel"
            onSecondaryAction={() => openTeacherPanel('activities', gradeId)}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
          {unit.activities.map((act, index) => {
            const meta = GAME_TYPE_METADATA[act.gameType] || GAME_TYPE_METADATA.quiz_battle;
            const Icon = GAME_ICONS[act.gameType] || HelpCircle;

            // Student Attempt analytics
            const attempts = recentActivities.filter((r) => r.activityId === act.id);
            const bestAttempt = attempts.length > 0
              ? attempts.reduce((max, cur) => (cur.percentage > max.percentage ? cur : max), attempts[0])
              : null;
            const isCompleted = Boolean(bestAttempt);
            const bestScore = bestAttempt?.percentage ?? 0;
            const isNextRecommended = index === (nextRecommendedIndex >= 0 ? nextRecommendedIndex : 0);

            // Badge styling
            let statusText = 'UNPLAYED';
            let statusBadgeClass = 'bg-slate-100 text-slate-700 border-slate-200';
            let cardBorder = 'border-slate-200';
            let btnClass = 'btn-game-primary';
            let btnText = 'Start Quest ➔';

            if (bestScore === 100) {
              statusText = '⭐⭐⭐ 100%';
              statusBadgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
              cardBorder = 'border-emerald-200';
              btnClass = 'btn-game-emerald';
              btnText = 'Practice Replay ➔';
            } else if (bestScore >= 80) {
              statusText = `⭐⭐ ${bestScore}%`;
              statusBadgeClass = 'bg-sky-100 text-sky-800 border-sky-300';
              cardBorder = 'border-sky-200';
              btnClass = 'btn-game-primary';
              btnText = 'Aim for 100% ➔';
            } else if (bestScore > 0) {
              statusText = `⭐ ${bestScore}%`;
              statusBadgeClass = 'bg-amber-100 text-amber-800 border-amber-300';
              cardBorder = 'border-amber-200';
              btnClass = 'btn-game-amber';
              btnText = 'Improve Score ➔';
            } else if (isNextRecommended) {
              statusText = 'RECOMMENDED';
              statusBadgeClass = 'bg-rose-500 text-white shadow-sm';
              cardBorder = 'border-2 border-rose-300 ring-4 ring-rose-100 shadow-xl';
              btnClass = 'btn-game-coral';
              btnText = 'START QUEST NOW 🚀';
            }

            return (
              <motion.div
                key={act.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                className={`card-island p-5 flex flex-col justify-between bg-white relative group overflow-hidden ${cardBorder}`}
              >
                <div>
                  {/* Top Bar: Quest Number & Engine Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                      <Icon className="w-3 h-3 text-sky-600" />
                      <span>Quest {index + 1} • {meta.title}</span>
                    </span>

                    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase border ${statusBadgeClass}`}>
                      {statusText}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-black font-display text-slate-900 mb-1 group-hover:text-sky-700 transition-colors">
                    {act.title}
                  </h3>

                  {/* Instructions / Description */}
                  <p className="text-xs text-slate-600 font-medium mb-4 line-clamp-2">
                    {act.instructions || meta.shortDesc}
                  </p>

                  {/* Questions & Rewards Pill */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-bold mb-4">
                    <span className="text-slate-700">
                      {act.questions?.length || 0} Questions
                    </span>
                    <span className="text-amber-700 font-extrabold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      {isCompleted ? 'Coins & XP Earned' : 'Earn Coins & XP'}
                    </span>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div>
                  <button
                    onClick={() => {
                      sounds.playTap();
                      goToGame(gradeId, unit.id, act.id);
                    }}
                    className={`w-full py-2.5 rounded-xl ${btnClass} font-black text-xs tracking-wide flex items-center justify-center gap-1.5 shadow-md`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{btnText}</span>
                  </button>

                  {/* Teacher Inline Delete Action (Classroom Mode Only) */}
                  {authMode !== 'student' && (
                    <div className="flex items-center justify-end pt-2 mt-2 border-t border-slate-100">
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete activity "${act.title}"?`)) {
                            deleteActivity(unit.id, act.id);
                          }
                        }}
                        title="Delete Activity"
                        className="text-[11px] font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>

              </motion.div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default UnitDashboardScreen;
