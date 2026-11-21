import React, { useState, useEffect } from 'react';
import { useArcade } from '../../context/ArcadeContext';
import { useAuth } from '../../context/AuthContext';
import { usePersonalizedLearning } from '../../context/PersonalizedLearningContext';
import type { GradeId, Unit } from '../../types/schema';
import { motion, AnimatePresence } from 'framer-motion';
import { EmptyState } from '../common/EmptyState';
import { sounds } from '../../services/soundEffects';
import { 
  ArrowLeft, 
  PlusCircle, 
  BookOpen, 
  FolderPlus, 
  ChevronRight, 
  Trash2, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  Layers, 
  Compass, 
  Award, 
  Sparkles, 
  Brain, 
  Flame, 
  Rocket,
  Landmark,
  Globe 
} from 'lucide-react';

interface UnitLibraryScreenProps {
  gradeId: GradeId;
}

// Icon mapper for dynamic unit icons
const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  BookOpen: (props) => <BookOpen {...props} />,
  Compass: (props) => <Compass {...props} />,
  Award: (props) => <Award {...props} />,
  Sparkles: (props) => <Sparkles {...props} />,
  Brain: (props) => <Brain {...props} />,
  Flame: (props) => <Flame {...props} />,
  Rocket: (props) => <Rocket {...props} />,
  Landmark: (props) => <Landmark {...props} />,
  Globe: (props) => <Globe {...props} />,
};

// Unit island visual themes for archipelago cards
const UNIT_THEMES = [
  {
    emoji: '🏝️',
    border: 'border-emerald-200 hover:border-emerald-400',
    headerBg: 'from-emerald-100 to-sky-100 border-emerald-200',
    btnClass: 'btn-game-emerald',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    progressBg: 'bg-emerald-500',
  },
  {
    emoji: '✈️',
    border: 'border-sky-300 ring-4 ring-sky-100',
    headerBg: 'from-sky-200 to-indigo-100 border-sky-300',
    btnClass: 'btn-game-primary',
    badgeBg: 'bg-sky-100 text-sky-800 border-sky-300',
    progressBg: 'bg-sky-500',
  },
  {
    emoji: '🍳',
    border: 'border-amber-200 hover:border-amber-400',
    headerBg: 'from-amber-100 to-orange-100 border-amber-200',
    btnClass: 'btn-game-amber',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
    progressBg: 'bg-amber-500',
  },
  {
    emoji: '🏰',
    border: 'border-rose-200 hover:border-rose-400',
    headerBg: 'from-rose-100 to-amber-100 border-rose-200',
    btnClass: 'btn-game-coral',
    badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
    progressBg: 'bg-rose-500',
  },
  {
    emoji: '🧭',
    border: 'border-purple-200 hover:border-purple-400',
    headerBg: 'from-purple-100 to-indigo-100 border-purple-200',
    btnClass: 'btn-game-purple',
    badgeBg: 'bg-purple-100 text-purple-800 border-purple-300',
    progressBg: 'bg-purple-500',
  },
  {
    emoji: '🏔️',
    border: 'border-teal-200 hover:border-teal-400',
    headerBg: 'from-teal-100 to-emerald-100 border-teal-200',
    btnClass: 'btn-game-emerald',
    badgeBg: 'bg-teal-100 text-teal-800 border-teal-300',
    progressBg: 'bg-teal-500',
  },
];

export const UnitLibraryScreen: React.FC<UnitLibraryScreenProps> = ({ gradeId }) => {
  const { student, authMode } = useAuth();
  const { 
    data, 
    goToHome, 
    goToGrade,
    goToUnit, 
    openTeacherPanel, 
    deleteUnit, 
    reorderUnits,
    createUnit,
    navigateTo 
  } = useArcade();
  const { mastery } = usePersonalizedLearning();

  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [quickTitle, setQuickTitle] = useState('');
  const [quickDesc, setQuickDesc] = useState('');
  const [quickNumber, setQuickNumber] = useState<number | ''>('');
  const [quickIcon, setQuickIcon] = useState('BookOpen');

  // Strict Grade Guard: redirect student if attempting to view another grade
  useEffect(() => {
    if (student && gradeId !== student.grade) {
      goToGrade(student.grade);
    }
  }, [student, gradeId, goToGrade]);

  if (student && gradeId !== student.grade) {
    return null;
  }

  const gradeUnits: Unit[] = data.units[gradeId] || [];
  const gradeLabel = gradeId === 'grade-7' ? 'Grade 7' : 'Grade 8';
  const gradeKey = gradeId === 'grade-7' ? 'grade7' : 'grade8';

  // Move unit up or down in order
  const handleMoveUnit = (index: number, direction: 'up' | 'down') => {
    sounds.playTap();
    const newUnits = [...gradeUnits];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newUnits.length) return;

    const temp = newUnits[index];
    newUnits[index] = newUnits[targetIndex];
    newUnits[targetIndex] = temp;

    reorderUnits(gradeId, newUnits.map((u) => u.id));
  };

  const handleQuickCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    createUnit(gradeId, {
      unitNumber: typeof quickNumber === 'number' ? quickNumber : gradeUnits.length + 1,
      title: quickTitle.trim(),
      description: quickDesc.trim() || undefined,
      icon: quickIcon,
      colorTheme: gradeId === 'grade-7' ? 'cyan' : 'purple',
    });

    setQuickTitle('');
    setQuickDesc('');
    setQuickNumber('');
    setIsQuickCreateOpen(false);
  };

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] py-6 px-4 md:px-8 max-w-7xl mx-auto w-full flex flex-col space-y-6 selection:bg-cyan-500 selection:text-white">
      
      {/* Background Decor: Floating Clouds */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 right-12 opacity-70 anim-cloud">
          <svg width="200" height="100" viewBox="0 0 200 100" fill="#ffffff">
            <path d="M 25 70 A 28 28 0 0 1 75 55 A 40 40 0 0 1 145 50 A 28 28 0 0 1 185 70 A 18 18 0 0 1 165 92 L 40 92 A 18 18 0 0 1 25 70 Z" filter="drop-shadow(0 10px 20px rgba(14,165,233,0.08))" />
          </svg>
        </div>
        <div className="absolute top-44 left-8 opacity-60 anim-cloud" style={{ animationDelay: '4s' }}>
          <svg width="160" height="80" viewBox="0 0 160 80" fill="#ffffff">
            <path d="M 20 55 A 22 22 0 0 1 60 45 A 32 32 0 0 1 115 40 A 22 22 0 0 1 145 55 A 15 15 0 0 1 130 72 L 30 72 A 15 15 0 0 1 20 55 Z" filter="drop-shadow(0 8px 16px rgba(14,165,233,0.06))" />
          </svg>
        </div>
      </div>

      {/* Top Breadcrumb & Realm Header Banner */}
      <div className="card-island p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4 relative z-10 bg-white">
        
        {/* Left: Back Button & Realm Title */}
        <div className="flex items-center gap-3.5">
          <button
            onClick={() => {
              sounds.playTap();
              goToHome();
            }}
            title="Return to Island Home"
            className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 hover:text-slate-900 transition-all flex items-center justify-center hover:scale-105 active:scale-95 group shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
                gradeId === 'grade-7' 
                  ? 'bg-cyan-100 border border-cyan-300 text-cyan-800' 
                  : 'bg-purple-100 border border-purple-300 text-purple-800'
              }`}>
                {gradeLabel} REALM ENFORCED
              </span>
              <span className="text-xs text-slate-500 font-bold">
                {gradeUnits.length} Island Realms
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-slate-900 tracking-tight">
              Unit Worlds Archipelago
            </h1>
            <p className="text-xs text-slate-500 font-semibold hidden sm:block">
              Choose an island to explore interactive curriculum quests, practice English, and earn Monster Coins!
            </p>
          </div>
        </div>

        {/* Right: Section Switcher & Teacher Actions */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              sounds.playNavigate();
              navigateTo({ view: 'general-english', gradeId });
            }}
            className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs sm:text-sm font-black border border-indigo-200 shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <span>📚</span>
            <span>Switch to General English</span>
          </button>

          {authMode !== 'student' && (
            <>
              <button
                onClick={() => {
                  sounds.playTap();
                  setIsQuickCreateOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl btn-game-primary text-xs sm:text-sm font-black flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Unit</span>
              </button>

              <button
                onClick={() => {
                  sounds.playTap();
                  openTeacherPanel('units', gradeId);
                }}
                className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 hover:text-slate-900 text-xs sm:text-sm font-bold transition-all"
              >
                Manage Library
              </button>
            </>
          )}
        </div>

      </div>

      {/* QUICK UNIT CREATION INLINE MODAL (Teacher / Classroom Mode Only) */}
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
                <FolderPlus className="w-5 h-5 text-sky-600" />
                <h3 className="font-display text-lg font-black text-slate-900">
                  Create New Unit ({gradeLabel})
                </h3>
              </div>
              <button
                onClick={() => setIsQuickCreateOpen(false)}
                className="text-slate-500 hover:text-slate-800 text-xs font-bold px-2.5 py-1 rounded-lg hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleQuickCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Unit Number
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder={`${gradeUnits.length + 1}`}
                  value={quickNumber}
                  onChange={(e) => setQuickNumber(e.target.value ? parseInt(e.target.value) : '')}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Unit Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Friendship, Teen Life, Food..."
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Optional Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Vocabulary & grammar quests"
                  value={quickDesc}
                  onChange={(e) => setQuickDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 text-sm"
                />
              </div>

              <div className="md:col-span-3 flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold">
                  <span className="uppercase tracking-wider mr-1">Icon:</span>
                  {Object.keys(ICON_MAP).map((iconKey) => {
                    const Comp = ICON_MAP[iconKey];
                    return (
                      <button
                        key={iconKey}
                        type="button"
                        onClick={() => setQuickIcon(iconKey)}
                        className={`p-2 rounded-xl border transition-all ${
                          quickIcon === iconKey
                            ? 'bg-sky-600 border-sky-600 text-white shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Comp className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl btn-game-primary text-xs font-black flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Save Unit</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Archipelago Content Area */}
      {gradeUnits.length === 0 ? (
        <div className="card-island p-10 bg-white text-center my-auto relative z-10">
          <EmptyState
            icon={BookOpen}
            badge={`${gradeLabel} Archipelago`}
            title="Unit Archipelago Is Currently Empty"
            description={`No units have been configured for ${gradeLabel} yet. Create your first unit to begin assembling interactive review quests.`}
            actionLabel="Create First Unit"
            onAction={() => setIsQuickCreateOpen(true)}
            secondaryActionLabel="Open Teacher Panel"
            onSecondaryAction={() => openTeacherPanel('units', gradeId)}
          />
        </div>
      ) : (
        /* The Island Map Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {gradeUnits.map((unit, index) => {
            const theme = UNIT_THEMES[index % UNIT_THEMES.length];
            const IconComponent = ICON_MAP[unit.icon || 'BookOpen'] || BookOpen;

            // Fetch real progress from mastery overview if available
            const unitMastery = gradeKey === 'grade7'
              ? mastery?.grade7?.units?.find((u) => u.unitId === unit.id)
              : mastery?.grade8?.units?.find((u) => u.unitId === unit.id);

            const totalActivities = unit.activities.length;
            const completedActivities = unitMastery?.completedActivities ?? 0;
            const progressPercent = totalActivities > 0
              ? Math.min(100, Math.round((completedActivities / totalActivities) * 100))
              : 0;
            const isMastered = completedActivities > 0 && completedActivities >= totalActivities;
            const isStarted = completedActivities > 0 && completedActivities < totalActivities;

            // Status label & Star rating
            let statusBadge = `UNIT ${unit.unitNumber}`;
            let starText = 'READY';
            let badgeStyle = theme.badgeBg;

            if (isMastered) {
              statusBadge = `UNIT ${unit.unitNumber} • MASTERED`;
              starText = '⭐⭐⭐ 100%';
              badgeStyle = 'bg-emerald-100 text-emerald-800 border-emerald-300';
            } else if (isStarted) {
              statusBadge = `UNIT ${unit.unitNumber} • IN PROGRESS`;
              starText = `⭐⭐ ${progressPercent}%`;
              badgeStyle = 'bg-sky-600 text-white shadow-sm';
            }

            return (
              <motion.div
                key={unit.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
                className={`card-island p-6 flex flex-col justify-between bg-white relative group overflow-hidden ${theme.border}`}
              >
                <div>
                  {/* Top Bar: Unit Tag & Stars */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase border ${badgeStyle}`}>
                      {statusBadge}
                    </span>
                    <span className="text-amber-500 font-black text-xs sm:text-sm">
                      {starText}
                    </span>
                  </div>

                  {/* Island Header Graphic */}
                  <div className={`w-full h-32 rounded-2xl bg-gradient-to-tr ${theme.headerBg} border flex items-center justify-center text-5xl mb-4 shadow-inner relative overflow-hidden group-hover:scale-[1.02] transition-transform`}>
                    <span className="anim-float">{theme.emoji}</span>
                    <div className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-white/70 backdrop-blur-sm text-slate-700 shadow-sm">
                      <IconComponent className="w-4 h-4 text-sky-700" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-black font-display text-slate-900 mb-1 group-hover:text-sky-700 transition-colors">
                    {unit.title}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium mb-4 line-clamp-2">
                    {unit.description || 'Engaging grammar, vocabulary, and interactive reading quests.'}
                  </p>

                  {/* Progress Bar Container */}
                  <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 mb-5">
                    <div className="flex justify-between text-xs font-black">
                      <span className="text-slate-800">
                        {completedActivities} of {totalActivities} Completed
                      </span>
                      <span className="text-sky-600 font-mono">
                        {progressPercent}%
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className={`h-full ${theme.progressBg} rounded-full transition-all duration-500`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Action Area */}
                <div>
                  <button
                    onClick={() => {
                      sounds.playTap();
                      goToUnit(gradeId, unit.id);
                    }}
                    className={`w-full py-3 rounded-xl ${theme.btnClass} text-xs font-black tracking-wide flex items-center justify-center gap-1.5 shadow-md`}
                  >
                    <span>
                      {isMastered
                        ? 'REVIEW ISLAND ➔'
                        : isStarted
                        ? 'CONTINUE QUESTS ➔'
                        : `EXPLORE UNIT ${unit.unitNumber} ➔`}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Teacher Inline Management Tools (Classroom Mode Only) */}
                  {authMode !== 'student' && (
                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-200 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-sky-600" />
                        <span>{totalActivities} Quests</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMoveUnit(index, 'up')}
                          disabled={index === 0}
                          title="Move Up"
                          className="p-1 rounded-lg hover:bg-slate-200 text-slate-600 disabled:opacity-30 transition-colors"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveUnit(index, 'down')}
                          disabled={index === gradeUnits.length - 1}
                          title="Move Down"
                          className="p-1 rounded-lg hover:bg-slate-200 text-slate-600 disabled:opacity-30 transition-colors"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openTeacherPanel('units', gradeId)}
                          title="Edit Unit"
                          className="p-1 rounded-lg hover:bg-slate-200 text-sky-700 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete unit "${unit.title}"?`)) {
                              deleteUnit(unit.id);
                            }
                          }}
                          title="Delete Unit"
                          className="p-1 rounded-lg hover:bg-rose-100 text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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

export default UnitLibraryScreen;
