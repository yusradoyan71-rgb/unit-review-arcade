import React, { useState } from 'react';
import { useArcade } from '../../context/ArcadeContext';
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
  SlidersHorizontal 
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
};

export const UnitDashboardScreen: React.FC<UnitDashboardScreenProps> = ({ gradeId, unitId }) => {
  const { 
    data, 
    goToGrade, 
    openTeacherPanel, 
    createActivity, 
    deleteActivity,
    addToast 
  } = useArcade();

  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [actTitle, setActTitle] = useState('');
  const [actGameType, setActGameType] = useState<GameType>('quiz_battle');
  const [actInstructions, setActInstructions] = useState('');

  const gradeUnits = data.units[gradeId] || [];
  const unit = gradeUnits.find((u) => u.id === unitId);

  const gradeLabel = gradeId === 'grade-7' ? 'Grade 7' : 'Grade 8';

  if (!unit) {
    return (
      <div className="min-h-[calc(100vh-4.5rem)] py-12 px-4 max-w-4xl mx-auto text-center">
        <EmptyState
          icon={Gamepad2}
          badge="Unit Not Found"
          title="Requested Unit Does Not Exist"
          description="The unit you were looking for was removed or could not be loaded."
          actionLabel={`Return to ${gradeLabel}`}
          onAction={() => goToGrade(gradeId)}
        />
      </div>
    );
  }

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

  const handleLaunchGamePreview = (activityTitle: string, gameType: GameType) => {
    sounds.playTap();
    const meta = GAME_TYPE_METADATA[gameType];
    addToast(
      `"${activityTitle}" is configured for ${meta.title}. Game engines will launch in Phase 2!`,
      'info'
    );
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] py-6 px-4 md:px-8 max-w-7xl mx-auto w-full flex flex-col">
      {/* Unit Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800/80">
        
        {/* Left: Back to Unit Library & Unit Title */}
        <div className="flex items-start sm:items-center gap-4">
          <button
            onClick={() => goToGrade(gradeId)}
            title={`Back to ${gradeLabel} Units`}
            className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all flex items-center justify-center hover:scale-105 active:scale-95 group shrink-0"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
                {gradeLabel}
              </span>
              <span className="px-3 py-0.5 rounded-full text-xs font-mono font-bold uppercase bg-slate-800 border border-slate-700 text-slate-300">
                Unit {String(unit.unitNumber).padStart(2, '0')}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {unit.activities.length} Activit{unit.activities.length === 1 ? 'y' : 'ies'}
              </span>
            </div>

            <h1 className="font-arcade text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {unit.title}
            </h1>

            {unit.description && (
              <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                {unit.description}
              </p>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.playTap();
              setIsQuickCreateOpen(true);
            }}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm sm:text-base shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Add Activity</span>
          </button>

          <button
            onClick={() => openTeacherPanel('units', gradeId)}
            className="px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-amber-300 text-sm font-semibold transition-all flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            <span>Unit Settings</span>
          </button>
        </div>

      </div>

      {/* QUICK ACTIVITY CREATION FORM */}
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
                <SlidersHorizontal className="w-5 h-5 text-indigo-400" />
                <h3 className="font-arcade text-xl font-bold text-white">Add Activity to Unit {unit.unitNumber}</h3>
              </div>
              <button
                onClick={() => setIsQuickCreateOpen(false)}
                className="text-slate-400 hover:text-white text-sm px-2.5 py-1 rounded-lg hover:bg-slate-800"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleQuickCreateActivity} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                    Activity Title <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vocabulary Round 1, Grammar Challenge..."
                    value={actTitle}
                    onChange={(e) => setActTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                    Optional Instructions for Classroom
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Choose the correct synonym on the smartboard."
                    value={actInstructions}
                    onChange={(e) => setActInstructions(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>
              </div>

              {/* Game Type Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                  Select Game Engine
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
                        className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-indigo-600/20 border-indigo-400 shadow-md shadow-indigo-600/20 ring-1 ring-indigo-400'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`p-1.5 rounded-lg ${meta.badgeColor}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="font-arcade font-bold text-sm text-white">{meta.title}</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-snug">{meta.shortDesc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md transition-all flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Save Activity</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      {unit.activities.length === 0 ? (
        // POLISHED EMPTY STATE WHEN UNIT HAS NO ACTIVITIES
        <div className="my-auto">
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
        // ACTIVITIES GRID
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-4">
          {unit.activities.map((act) => {
            const meta = GAME_TYPE_METADATA[act.gameType] || GAME_TYPE_METADATA.quiz_battle;
            const Icon = GAME_ICONS[act.gameType] || HelpCircle;

            return (
              <motion.div
                key={act.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 p-6 backdrop-blur-xl shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Game Engine Badge & Delete Action */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${meta.badgeColor}`}>
                      <Icon className="w-3.5 h-3.5" />
                      <span>{meta.title}</span>
                    </span>

                    <button
                      onClick={() => {
                        if (window.confirm(`Delete activity "${act.title}"?`)) {
                          deleteActivity(unit.id, act.id);
                        }
                      }}
                      title="Delete Activity"
                      className="p-1.5 rounded-lg bg-slate-950/80 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Title & Instructions */}
                  <h3 className="font-arcade text-xl sm:text-2xl font-bold text-white mb-2 line-clamp-2">
                    {act.title}
                  </h3>
                  {act.instructions ? (
                    <p className="text-slate-400 text-xs sm:text-sm line-clamp-3 mb-4">
                      {act.instructions}
                    </p>
                  ) : (
                    <p className="text-slate-500 italic text-xs mb-4">
                      No custom instructions specified.
                    </p>
                  )}
                </div>

                {/* Footer Bar: Questions Count & Smartboard Launch */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3 mt-4">
                  <span className="text-xs font-mono font-medium text-slate-400">
                    {act.questions?.length || 0} Questions
                  </span>

                  <button
                    onClick={() => handleLaunchGamePreview(act.title, act.gameType)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all flex items-center gap-1.5 group-hover:shadow-md group-hover:shadow-indigo-600/30"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Launch</span>
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
