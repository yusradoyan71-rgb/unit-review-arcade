import React from 'react';
import type { SkillMasterySummary } from '../../../../types/teacher';
import { BookMarked, Layers, FileText, Headphones, CheckCircle2, AlertTriangle } from 'lucide-react';

interface SkillMasteryPillarsProps {
  skills: SkillMasterySummary[];
  onSelectSkill?: (skill: 'all' | 'grammar' | 'vocabulary' | 'reading' | 'listening') => void;
  selectedSkill?: string;
}

export const SkillMasteryPillars: React.FC<SkillMasteryPillarsProps> = ({
  skills,
  onSelectSkill,
  selectedSkill = 'all',
}) => {
  const skillIcons = {
    grammar: BookMarked,
    vocabulary: Layers,
    reading: FileText,
    listening: Headphones,
  };

  const skillColors = {
    grammar: {
      accent: 'text-sky-700',
      bg: 'bg-sky-50/80 hover:bg-sky-50',
      border: 'border-sky-200 hover:border-sky-400',
      active: 'border-sky-500 ring-2 ring-sky-300',
      bar: 'from-sky-500 to-cyan-400',
    },
    vocabulary: {
      accent: 'text-amber-700',
      bg: 'bg-amber-50/80 hover:bg-amber-50',
      border: 'border-amber-200 hover:border-amber-400',
      active: 'border-amber-500 ring-2 ring-amber-300',
      bar: 'from-amber-500 to-yellow-400',
    },
    reading: {
      accent: 'text-emerald-700',
      bg: 'bg-emerald-50/80 hover:bg-emerald-50',
      border: 'border-emerald-200 hover:border-emerald-400',
      active: 'border-emerald-500 ring-2 ring-emerald-300',
      bar: 'from-emerald-500 to-teal-400',
    },
    listening: {
      accent: 'text-purple-700',
      bg: 'bg-purple-50/80 hover:bg-purple-50',
      border: 'border-purple-200 hover:border-purple-400',
      active: 'border-purple-500 ring-2 ring-purple-300',
      bar: 'from-purple-500 to-indigo-400',
    },
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Core Language Skill Pillars (Mastery Diagnostics)
        </h3>
        <span className="text-xs text-slate-400 font-medium">
          Click any skill pillar to filter topic diagnostics below
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {skills.map((s) => {
          const Icon = skillIcons[s.skill];
          const colors = skillColors[s.skill];
          const isSelected = selectedSkill === s.skill;

          return (
            <div
              key={s.skill}
              onClick={() => onSelectSkill?.(isSelected ? 'all' : s.skill)}
              className={`p-4 rounded-3xl bg-white border-2 transition-all cursor-pointer shadow-xs flex flex-col justify-between ${
                isSelected ? colors.active : colors.border
              } ${colors.bg}`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center border border-slate-200 shadow-2xs">
                      <Icon className={`w-4 h-4 ${colors.accent}`} />
                    </div>
                    <strong className="text-xs font-black text-slate-900 leading-snug">
                      {s.label}
                    </strong>
                  </div>
                  {isSelected && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-slate-900 text-white">
                      Selected
                    </span>
                  )}
                </div>

                {/* Score Big Display */}
                <div className="flex items-baseline justify-between mt-3 mb-1">
                  <span className="text-[11px] font-bold text-slate-500">Average Accuracy:</span>
                  <span className={`text-lg font-black font-mono ${
                    s.averageScore >= 80 ? 'text-emerald-600' : s.averageScore >= 60 ? 'text-amber-600' : 'text-slate-700'
                  }`}>
                    {s.averageScore}%
                  </span>
                </div>

                {/* Accuracy Progress Bar */}
                <div className="w-full h-2 rounded-full bg-slate-200/80 overflow-hidden mb-3">
                  <div
                    className={`h-full bg-gradient-to-r ${colors.bar} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(100, s.averageScore)}%` }}
                  />
                </div>
              </div>

              {/* Status Badges */}
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-bold">
                <span className="text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{s.masteredTopicsCount} Mastered</span>
                </span>
                <span className="text-amber-700 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <span>{s.needsPracticeTopicsCount} Need Practice</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

