import React, { useState } from 'react';
import {
  X,
  Zap,
  Flame,
  Compass,
  Layers,
  HelpCircle,
  Trophy,
  Play,
  Sparkles,
  CheckCircle2,
  GraduationCap,
} from 'lucide-react';
import type { GradeId } from '../../types/schema';
import type {
  GamesZoneGameMetadata,
  GamesZoneDifficulty,
} from '../../types/gamesZone';
import { GamesZoneService } from '../../services/gamesZoneService';

interface DifficultySelectModalProps {
  isOpen: boolean;
  metadata: GamesZoneGameMetadata | null;
  selectedGrade: GradeId;
  onSelectGrade: (grade: GradeId) => void;
  onStartGame: (difficulty: GamesZoneDifficulty) => void;
  onClose: () => void;
  studentNumber?: string;
}

export const DifficultySelectModal: React.FC<DifficultySelectModalProps> = ({
  isOpen,
  metadata,
  selectedGrade,
  onSelectGrade,
  onStartGame,
  onClose,
  studentNumber = 'guest',
}) => {
  const [difficulty, setDifficulty] = useState<GamesZoneDifficulty>('easy');
  const [activeTab, setActiveTab] = useState<'difficulty' | 'howToPlay'>('difficulty');

  if (!isOpen || !metadata) return null;

  const renderIcon = (name: string, className: string = 'w-6 h-6') => {
    switch (name) {
      case 'Zap':
        return <Zap className={className} />;
      case 'Flame':
        return <Flame className={className} />;
      case 'Compass':
        return <Compass className={className} />;
      case 'Layers':
        return <Layers className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  const getHighScore = (diff: GamesZoneDifficulty) => {
    return GamesZoneService.getPersonalHighScore(studentNumber, metadata.id, diff);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700/60 shadow-2xl shadow-indigo-950/50">
        {/* Header Ribbon */}
        <div className={`p-6 bg-gradient-to-r ${metadata.accentGradient} text-white flex items-center justify-between`}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-inner">
              {renderIcon(metadata.iconName, 'w-8 h-8 text-white')}
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest font-black text-white/80">
                {metadata.categoryLabel}
              </span>
              <h2 className="text-2xl font-black tracking-tight">{metadata.title}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-900/50">
          <button
            onClick={() => setActiveTab('difficulty')}
            className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'difficulty'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Play className="w-4 h-4" /> Choose Difficulty
          </button>
          <button
            onClick={() => setActiveTab('howToPlay')}
            className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'howToPlay'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" /> How to Play
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {activeTab === 'difficulty' ? (
            <>
              {/* Grade Selector / Verified Student Indicator */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Target Curriculum Level
                </label>
                {studentNumber !== 'guest' ? (
                  <div className="py-2.5 px-4 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-bold text-sm flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-indigo-400" />
                      <span>{selectedGrade === 'grade-7' ? 'Grade 7 (A1–A2 General English)' : 'Grade 8 (A2–B1 / LGS Preparation)'}</span>
                    </div>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-indigo-600/30 text-indigo-200 border border-indigo-400/30">Verified</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => onSelectGrade('grade-7')}
                      className={`py-2.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border transition-all ${
                        selectedGrade === 'grade-7'
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 ring-2 ring-indigo-500/30'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      Grade 7 (A1–A2)
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectGrade('grade-8')}
                      className={`py-2.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border transition-all ${
                        selectedGrade === 'grade-8'
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 ring-2 ring-indigo-500/30'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      Grade 8 (A2–B1 / LGS)
                    </button>
                  </div>
                )}
              </div>

              {/* Difficulty Cards */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Select Challenge Level
                </label>

                {/* Easy */}
                <button
                  type="button"
                  onClick={() => setDifficulty('easy')}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    difficulty === 'easy'
                      ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/30'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800/80 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                      E
                    </div>
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        Easy
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold">
                          Relaxed Pace
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">Essential core vocabulary and fundamentals</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 flex items-center justify-end gap-1">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" /> Best
                    </span>
                    <span className="text-sm font-black text-amber-300">
                      {getHighScore('easy')} pts
                    </span>
                  </div>
                </button>

                {/* Medium */}
                <button
                  type="button"
                  onClick={() => setDifficulty('medium')}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    difficulty === 'medium'
                      ? 'bg-amber-950/40 border-amber-500 text-amber-200 ring-2 ring-amber-500/30'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800/80 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
                      M
                    </div>
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        Medium
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-semibold">
                          Standard
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">Intermediate questions and standard speed</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 flex items-center justify-end gap-1">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" /> Best
                    </span>
                    <span className="text-sm font-black text-amber-300">
                      {getHighScore('medium')} pts
                    </span>
                  </div>
                </button>

                {/* Hard */}
                <button
                  type="button"
                  onClick={() => setDifficulty('hard')}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    difficulty === 'hard'
                      ? 'bg-rose-950/40 border-rose-500 text-rose-200 ring-2 ring-rose-500/30'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800/80 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-black">
                      H
                    </div>
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        Hard
                        <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-semibold">
                          Challenging
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">Advanced grammar, rapid speed & distractors</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 flex items-center justify-end gap-1">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" /> Best
                    </span>
                    <span className="text-sm font-black text-amber-300">
                      {getHighScore('hard')} pts
                    </span>
                  </div>
                </button>
              </div>

              {/* Start Game Action */}
              <button
                type="button"
                onClick={() => onStartGame(difficulty)}
                className={`w-full py-4 rounded-2xl font-black text-lg text-white shadow-lg bg-gradient-to-r ${metadata.accentGradient} hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3`}
              >
                <Play className="w-6 h-6 fill-current" /> Launch Game
              </button>
            </>
          ) : (
            /* How to Play Tab */
            <div className="space-y-4 text-sm text-slate-300">
              <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                <h4 className="font-bold text-white mb-1 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Objective
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">{metadata.howToPlay.objective}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                <h4 className="font-bold text-white mb-1 flex items-center gap-2">
                  <Play className="w-4 h-4 text-blue-400" /> Controls
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">{metadata.howToPlay.controls}</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-600/30">
                <h4 className="font-bold text-amber-300 mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Smartboard & Touch Friendly
                </h4>
                <p className="text-xs text-amber-200/90 leading-relaxed">{metadata.howToPlay.smartboardTip}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                <h4 className="font-bold text-white mb-2">Rules & Scoring</h4>
                <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                  {metadata.howToPlay.rules.map((rule, idx) => (
                    <li key={idx} className="leading-relaxed">{rule}</li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('difficulty')}
                className="w-full py-3 rounded-xl font-bold text-sm bg-slate-800 text-white hover:bg-slate-700 transition-colors"
              >
                Back to Difficulty Selection
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

