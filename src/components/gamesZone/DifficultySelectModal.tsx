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
import { sounds } from '../../services/soundEffects';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in selection:bg-cyan-500 selection:text-white">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-white border-2 border-slate-200 shadow-2xl">
        
        {/* Header Ribbon */}
        <div className={`p-6 bg-gradient-to-r ${metadata.accentGradient} text-white flex items-center justify-between`}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-inner text-white">
              {renderIcon(metadata.iconName, 'w-8 h-8 text-white')}
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-widest font-black text-white/90 block">
                {metadata.categoryLabel}
              </span>
              <h2 className="text-2xl font-black font-display tracking-tight text-white">{metadata.title}</h2>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            onClick={() => {
              sounds.playTap();
              setActiveTab('difficulty');
            }}
            className={`flex-1 py-3 text-sm font-black flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'difficulty'
                ? 'border-sky-600 text-sky-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Play className="w-4 h-4" /> Choose Difficulty
          </button>
          <button
            onClick={() => {
              sounds.playTap();
              setActiveTab('howToPlay');
            }}
            className={`flex-1 py-3 text-sm font-black flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'howToPlay'
                ? 'border-sky-600 text-sky-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" /> How to Play
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {activeTab === 'difficulty' ? (
            <>
              {/* Target Curriculum Level */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Target Curriculum Level
                </label>
                {studentNumber !== 'guest' ? (
                  <div className="py-2.5 px-4 rounded-xl bg-sky-50 border-2 border-sky-200 text-sky-900 font-bold text-sm flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-sky-600" />
                      <span>{selectedGrade === 'grade-7' ? 'Grade 7 (A1–A2 General English)' : 'Grade 8 (A2–B1 / LGS Preparation)'}</span>
                    </div>
                    <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-sky-600 text-white">
                      Verified
                    </span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playTap();
                        onSelectGrade('grade-7');
                      }}
                      className={`py-2.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border-2 transition-all ${
                        selectedGrade === 'grade-7'
                          ? 'bg-sky-50 border-sky-500 text-sky-900 ring-2 ring-sky-200 shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Grade 7 (A1–A2)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playTap();
                        onSelectGrade('grade-8');
                      }}
                      className={`py-2.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border-2 transition-all ${
                        selectedGrade === 'grade-8'
                          ? 'bg-sky-50 border-sky-500 text-sky-900 ring-2 ring-sky-200 shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Grade 8 (A2–B1 / LGS)
                    </button>
                  </div>
                )}
              </div>

              {/* Difficulty Cards */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Select Challenge Level
                </label>

                {/* Easy */}
                <button
                  type="button"
                  onClick={() => {
                    sounds.playTap();
                    setDifficulty('easy');
                  }}
                  className={`w-full p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${
                    difficulty === 'easy'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-200 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                      E
                    </div>
                    <div>
                      <div className="font-black text-slate-900 flex items-center gap-2">
                        <span>Easy</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase">
                          Relaxed Pace
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">Essential core vocabulary and fundamentals</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-500 flex items-center justify-end gap-1 font-bold">
                      <Trophy className="w-3.5 h-3.5 text-amber-500" /> Best
                    </span>
                    <span className="text-sm font-black text-slate-900">
                      {getHighScore('easy')} pts
                    </span>
                  </div>
                </button>

                {/* Medium */}
                <button
                  type="button"
                  onClick={() => {
                    sounds.playTap();
                    setDifficulty('medium');
                  }}
                  className={`w-full p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${
                    difficulty === 'medium'
                      ? 'bg-amber-50 border-amber-500 text-amber-950 ring-2 ring-amber-200 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
                      M
                    </div>
                    <div>
                      <div className="font-black text-slate-900 flex items-center gap-2">
                        <span>Medium</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold uppercase">
                          Standard
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">Intermediate questions and standard speed</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-500 flex items-center justify-end gap-1 font-bold">
                      <Trophy className="w-3.5 h-3.5 text-amber-500" /> Best
                    </span>
                    <span className="text-sm font-black text-slate-900">
                      {getHighScore('medium')} pts
                    </span>
                  </div>
                </button>

                {/* Hard */}
                <button
                  type="button"
                  onClick={() => {
                    sounds.playTap();
                    setDifficulty('hard');
                  }}
                  className={`w-full p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${
                    difficulty === 'hard'
                      ? 'bg-rose-50 border-rose-500 text-rose-950 ring-2 ring-rose-200 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-black">
                      H
                    </div>
                    <div>
                      <div className="font-black text-slate-900 flex items-center gap-2">
                        <span>Hard</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold uppercase">
                          Challenging
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">Advanced grammar, rapid speed &amp; distractors</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-500 flex items-center justify-end gap-1 font-bold">
                      <Trophy className="w-3.5 h-3.5 text-amber-500" /> Best
                    </span>
                    <span className="text-sm font-black text-slate-900">
                      {getHighScore('hard')} pts
                    </span>
                  </div>
                </button>
              </div>

              {/* Start Game Action */}
              <button
                type="button"
                onClick={() => {
                  sounds.playTap();
                  onStartGame(difficulty);
                }}
                className={`w-full py-3.5 rounded-2xl font-black text-base btn-game-primary tracking-wide shadow-lg flex items-center justify-center gap-2`}
              >
                <Play className="w-5 h-5 fill-current" />
                <span>LAUNCH EXPEDITION 🚀</span>
              </button>
            </>
          ) : (
            /* How to Play Tab */
            <div className="space-y-4 text-sm text-slate-700">
              <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200">
                <h4 className="font-black font-display text-emerald-950 mb-1 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Objective
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">{metadata.howToPlay.objective}</p>
              </div>

              <div className="p-4 rounded-2xl bg-sky-50 border-2 border-sky-200">
                <h4 className="font-black font-display text-sky-950 mb-1 flex items-center gap-2">
                  <Play className="w-4 h-4 text-sky-600" /> Controls
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">{metadata.howToPlay.controls}</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-200">
                <h4 className="font-black font-display text-amber-950 mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" /> Smartboard &amp; Touch Friendly
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">{metadata.howToPlay.smartboardTip}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200">
                <h4 className="font-black font-display text-slate-900 mb-2">Rules &amp; Scoring</h4>
                <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside font-medium">
                  {metadata.howToPlay.rules.map((rule, idx) => (
                    <li key={idx} className="leading-relaxed">{rule}</li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => {
                  sounds.playTap();
                  setActiveTab('difficulty');
                }}
                className="w-full py-3 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors border border-slate-300"
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

export default DifficultySelectModal;
