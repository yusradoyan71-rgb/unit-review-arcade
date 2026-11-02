import React, { useState } from 'react';
import { useArcade } from '../../context/ArcadeContext';
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

export const UnitLibraryScreen: React.FC<UnitLibraryScreenProps> = ({ gradeId }) => {
  const { 
    data, 
    goToHome, 
    goToUnit, 
    openTeacherPanel, 
    deleteUnit, 
    reorderUnits,
    createUnit 
  } = useArcade();

  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [quickTitle, setQuickTitle] = useState('');
  const [quickDesc, setQuickDesc] = useState('');
  const [quickNumber, setQuickNumber] = useState<number | ''>('');
  const [quickIcon, setQuickIcon] = useState('BookOpen');

  const gradeUnits: Unit[] = data.units[gradeId] || [];
  const gradeLabel = gradeId === 'grade-7' ? 'Grade 7' : 'Grade 8';
  const accentTheme = gradeId === 'grade-7' ? 'cyan' : 'purple';

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
      colorTheme: accentTheme,
    });

    setQuickTitle('');
    setQuickDesc('');
    setQuickNumber('');
    setIsQuickCreateOpen(false);
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] py-6 px-4 md:px-8 max-w-7xl mx-auto w-full flex flex-col">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800/80">
        
        {/* Left: Back & Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={goToHome}
            title="Return to Grade Selection"
            className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all flex items-center justify-center hover:scale-105 active:scale-95 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          <div>
            <div className="flex items-center gap-2.5">
              <span className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                gradeId === 'grade-7' 
                  ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-300' 
                  : 'bg-purple-500/15 border border-purple-500/30 text-purple-300'
              }`}>
                {gradeLabel}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {gradeUnits.length} Unit{gradeUnits.length === 1 ? '' : 's'} Total
              </span>
            </div>
            <h1 className="font-arcade text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
              {gradeLabel} Unit Vault
            </h1>
          </div>
        </div>

        {/* Right: Quick Unit Creator / Teacher Link */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.playTap();
              setIsQuickCreateOpen(true);
            }}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm sm:text-base shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Create Unit</span>
          </button>

          <button
            onClick={() => openTeacherPanel('units', gradeId)}
            className="px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-amber-300 text-sm font-semibold transition-all"
          >
            Manage Library
          </button>
        </div>

      </div>

      {/* QUICK UNIT CREATION INLINE MODAL / DRAWER */}
      <AnimatePresence>
        {isQuickCreateOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 p-6 rounded-3xl bg-slate-900/90 border border-indigo-500/40 backdrop-blur-xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-indigo-400" />
                <h3 className="font-arcade text-xl font-bold text-white">Create New Unit ({gradeLabel})</h3>
              </div>
              <button
                onClick={() => setIsQuickCreateOpen(false)}
                className="text-slate-400 hover:text-white text-sm px-2.5 py-1 rounded-lg hover:bg-slate-800"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleQuickCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Unit Number
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder={`${gradeUnits.length + 1}`}
                  value={quickNumber}
                  onChange={(e) => setQuickNumber(e.target.value ? parseInt(e.target.value) : '')}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Unit Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Friendship, Appearance..."
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Optional Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Vocabulary & grammar review"
                  value={quickDesc}
                  onChange={(e) => setQuickDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>

              <div className="md:col-span-3 flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-semibold uppercase tracking-wider">Icon:</span>
                  {Object.keys(ICON_MAP).map((iconKey) => {
                    const Comp = ICON_MAP[iconKey];
                    return (
                      <button
                        key={iconKey}
                        type="button"
                        onClick={() => setQuickIcon(iconKey)}
                        className={`p-2 rounded-lg border transition-all ${
                          quickIcon === iconKey
                            ? 'bg-indigo-600 border-indigo-400 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Comp className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md transition-all flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Save Unit</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      {gradeUnits.length === 0 ? (
        // POLISHED EMPTY STATE WHEN NO UNITS EXIST
        <div className="my-auto">
          <EmptyState
            icon={BookOpen}
            badge={`${gradeLabel} Library Status`}
            title="Unit Library is Currently Empty"
            description={`No units have been configured for ${gradeLabel} yet. Create your first unit to begin assembling interactive review games for the smartboard.`}
            actionLabel="Create First Unit"
            onAction={() => setIsQuickCreateOpen(true)}
            secondaryActionLabel="Open Teacher Panel"
            onSecondaryAction={() => openTeacherPanel('units', gradeId)}
          />
        </div>
      ) : (
        // UNITS GRID
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-4">
          {gradeUnits.map((unit, index) => {
            const IconComponent = ICON_MAP[unit.icon || 'BookOpen'] || BookOpen;

            return (
              <motion.div
                key={unit.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 p-6 backdrop-blur-xl shadow-xl transition-all duration-300 flex flex-col justify-between hover:shadow-indigo-500/10"
              >
                <div>
                  {/* Top Bar: Unit Number & Quick Reorder Controls */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-mono text-xs font-bold">
                      UNIT {String(unit.unitNumber).padStart(2, '0')}
                    </span>

                    {/* Teacher Quick Reorder & Delete */}
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleMoveUnit(index, 'up')}
                        disabled={index === 0}
                        title="Move Up"
                        className="p-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveUnit(index, 'down')}
                        disabled={index === gradeUnits.length - 1}
                        title="Move Down"
                        className="p-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => openTeacherPanel('units', gradeId)}
                        title="Edit in Teacher Panel"
                        className="p-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
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
                        className="p-1.5 rounded-lg bg-slate-950/80 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0 group-hover:scale-105 transition-transform">
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-arcade text-xl sm:text-2xl font-bold text-white group-hover:text-indigo-200 transition-colors line-clamp-2">
                        {unit.title}
                      </h3>
                      {unit.description && (
                        <p className="text-slate-400 text-xs sm:text-sm line-clamp-2 mt-1">
                          {unit.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer: Activity Count & Launch Button */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3 mt-4">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{unit.activities.length} Activities</span>
                  </div>

                  <button
                    onClick={() => goToUnit(gradeId, unit.id)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all flex items-center gap-1.5 group-hover:shadow-md group-hover:shadow-indigo-600/30"
                  >
                    <span>Enter Unit</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
