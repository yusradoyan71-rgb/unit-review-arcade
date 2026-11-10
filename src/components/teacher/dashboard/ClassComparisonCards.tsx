/**
 * UNIT REVIEW ARCADE — CLASS COMPARISON CARDS (PHASE 3B)
 */

import React from 'react';
import type { ClassStatSummary } from '../../../types/teacher';
import { Users, Gamepad2, Award } from 'lucide-react';

interface ClassComparisonCardsProps {
  classStats: ClassStatSummary[];
  selectedClassId: string;
  onSelectClass: (classId: 'all' | '7A' | '7B' | '8A' | '8B') => void;
  isLoading: boolean;
}

export const ClassComparisonCards: React.FC<ClassComparisonCardsProps> = ({
  classStats,
  selectedClassId,
  onSelectClass,
  isLoading,
}) => {
  const classes: Array<'7A' | '7B' | '8A' | '8B'> = ['7A', '7B', '8A', '8B'];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {classes.map((cId) => {
        const stat = classStats.find((s) => s.classId === cId) || {
          classId: cId,
          studentCount: 0,
          activeCount: 0,
          totalAttempts: 0,
          completedAttempts: 0,
          averageScore: 0,
          completionRate: 0,
        };

        const isSelected = selectedClassId === cId;

        return (
          <button
            key={cId}
            type="button"
            onClick={() => onSelectClass(isSelected ? 'all' : cId)}
            className={`p-4 rounded-2xl border text-left transition-all ${
              isSelected
                ? 'bg-indigo-600/20 border-indigo-500 ring-2 ring-indigo-500/30'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
            } ${isLoading ? 'opacity-50' : ''}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-base font-bold font-arcade tracking-wide text-white">
                Class {cId}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  isSelected
                    ? 'bg-indigo-500 text-white'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {isSelected ? 'Filtered' : 'Filter'}
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  <span>Students:</span>
                </span>
                <span className="font-semibold text-slate-200">
                  {stat.studentCount}{' '}
                  <span className="text-slate-500 font-normal">
                    ({stat.activeCount} active)
                  </span>
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Gamepad2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Attempts:</span>
                </span>
                <span className="font-semibold text-slate-200">
                  {stat.totalAttempts}{' '}
                  <span className="text-slate-500 font-normal">
                    ({stat.completedAttempts} done)
                  </span>
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-slate-500" />
                  <span>Avg Score:</span>
                </span>
                <span
                  className={`font-bold ${
                    stat.averageScore >= 80
                      ? 'text-emerald-400'
                      : stat.averageScore >= 50
                      ? 'text-amber-400'
                      : stat.totalAttempts > 0
                      ? 'text-rose-400'
                      : 'text-slate-500'
                  }`}
                >
                  {stat.completedAttempts > 0 ? `${stat.averageScore}%` : '—'}
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
