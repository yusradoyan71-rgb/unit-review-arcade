import React from 'react';
import type { SectionBreakdownSummary } from '../../../../types/teacher';
import { BookOpen, Compass, Shuffle, Award, Users, Clock } from 'lucide-react';

interface SectionBreakdownCardsProps {
  summary: SectionBreakdownSummary;
  totalStudentsInCohort: number;
  onFilterSection?: (section: 'all' | 'unit_review' | 'general_english' | 'mixed_practice') => void;
  selectedSection?: string;
}

export const SectionBreakdownCards: React.FC<SectionBreakdownCardsProps> = ({
  summary,
  totalStudentsInCohort,
  onFilterSection,
  selectedSection = 'all',
}) => {
  const sections = [
    {
      id: 'unit_review' as const,
      title: 'Unit Review',
      subtitle: 'Textbook Curriculum Quests',
      icon: BookOpen,
      iconBg: 'bg-sky-100 text-sky-700 border-sky-300',
      cardBg: 'from-sky-50/70 to-white hover:border-sky-400',
      activeBorder: 'border-sky-500 ring-2 ring-sky-300',
      stats: summary.unitReview,
    },
    {
      id: 'general_english' as const,
      title: 'General English',
      subtitle: 'Grammar, Vocab, Reading, Listening',
      icon: Compass,
      iconBg: 'bg-indigo-100 text-indigo-700 border-indigo-300',
      cardBg: 'from-indigo-50/70 to-white hover:border-indigo-400',
      activeBorder: 'border-indigo-500 ring-2 ring-indigo-300',
      stats: summary.generalEnglish,
    },
    {
      id: 'mixed_practice' as const,
      title: 'Mixed Practice Lab',
      subtitle: 'Adaptive Synthesis (50/50, 70/30, 30/70)',
      icon: Shuffle,
      iconBg: 'bg-amber-100 text-amber-700 border-amber-300',
      cardBg: 'from-amber-50/70 to-white hover:border-amber-400',
      activeBorder: 'border-amber-500 ring-2 ring-amber-300',
      stats: summary.mixedPractice,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {sections.map((sec) => {
        const Icon = sec.icon;
        const isSelected = selectedSection === sec.id;
        const participationRate = totalStudentsInCohort > 0
          ? Math.round((sec.stats.uniqueStudentsCount / totalStudentsInCohort) * 100)
          : 0;

        return (
          <div
            key={sec.id}
            onClick={() => onFilterSection?.(isSelected ? 'all' : sec.id)}
            className={`p-5 rounded-3xl bg-gradient-to-b ${sec.cardBg} border-2 transition-all cursor-pointer shadow-xs flex flex-col justify-between ${
              isSelected ? sec.activeBorder : 'border-slate-200'
            }`}
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${sec.iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black font-display text-slate-900 leading-tight">
                      {sec.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {sec.subtitle}
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-600 text-white">
                    Active Filter
                  </span>
                )}
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2.5 my-3">
                <div className="p-2.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Average Accuracy
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className={`text-xl font-black font-mono ${
                      sec.stats.averageScore >= 80 ? 'text-emerald-600' : sec.stats.averageScore >= 60 ? 'text-amber-600' : 'text-slate-700'
                    }`}>
                      {sec.stats.averageScore}%
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">accuracy</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Completions
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-black font-mono text-slate-800">
                      {sec.stats.completedAttempts}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">/ {sec.stats.totalAttempts} att.</span>
                  </div>
                </div>
              </div>

              {/* Participation Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-600 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    Participation:
                  </span>
                  <span className="text-slate-900 font-mono">
                    {sec.stats.uniqueStudentsCount} / {totalStudentsInCohort} ({participationRate}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-sky-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, participationRate)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Footer XP and Time */}
            <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span className="flex items-center gap-1 text-amber-700 font-bold">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>{sec.stats.totalXpEarned.toLocaleString()} XP Earned</span>
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{Math.round(sec.stats.totalTimeSpentSeconds / 60)} mins</span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
