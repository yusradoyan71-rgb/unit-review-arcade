/**
 * UNIT REVIEW ARCADE — CLASS COMPARISON CARDS (PHASE 9D)
 * Version: 9.4.0
 * 
 * Creative Campus Professional Educator Redesign.
 * Class breakdown cards for 7A, 7B, 8A, and 8B.
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
            className={`p-4 rounded-2xl border-2 text-left transition-all ${
              isSelected
                ? 'bg-indigo-50/60 border-indigo-500 ring-2 ring-indigo-200 shadow-md'
                : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-md'
            } ${isLoading ? 'opacity-50 animate-pulse' : ''}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-base font-bubble font-black tracking-wide text-slate-900">
                Class {cId}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {isSelected ? 'Filtered' : 'Filter'}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5 font-medium">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Students:</span>
                </span>
                <span className="font-bold text-slate-800">
                  {stat.studentCount}{' '}
                  <span className="text-slate-500 font-normal">
                    ({stat.activeCount} active)
                  </span>
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5 font-medium">
                  <Gamepad2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Attempts:</span>
                </span>
                <span className="font-bold text-slate-800">
                  {stat.totalAttempts}{' '}
                  <span className="text-slate-500 font-normal">
                    ({stat.completedAttempts} done)
                  </span>
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600 pt-1 border-t border-slate-100">
                <span className="flex items-center gap-1.5 font-medium">
                  <Award className="w-3.5 h-3.5 text-slate-400" />
                  <span>Avg Score:</span>
                </span>
                <span
                  className={`font-black font-mono text-sm ${
                    stat.completedAttempts === 0
                      ? 'text-slate-400'
                      : stat.averageScore >= 80
                      ? 'text-emerald-600'
                      : stat.averageScore >= 50
                      ? 'text-amber-600'
                      : 'text-rose-600'
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
