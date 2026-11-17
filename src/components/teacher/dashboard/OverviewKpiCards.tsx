/**
 * UNIT REVIEW ARCADE — OVERVIEW KPI CARDS (PHASE 9D)
 * Version: 9.4.0
 * 
 * Creative Campus Professional Educator Redesign.
 * Crisp white cards with vibrant accent pills for real verified metrics.
 */

import React from 'react';
import type { TeacherOverviewKpis } from '../../../types/teacher';
import { 
  Users, 
  Gamepad2, 
  Trophy, 
  Clock, 
  CalendarCheck,
  TrendingUp
} from 'lucide-react';

interface OverviewKpiCardsProps {
  kpis: TeacherOverviewKpis;
  isLoading: boolean;
}

export const OverviewKpiCards: React.FC<OverviewKpiCardsProps> = ({ kpis, isLoading }) => {
  // Format total seconds into human-readable hours & minutes
  const formatTimeSpent = (totalSeconds: number) => {
    if (!totalSeconds || totalSeconds <= 0) return '0m';
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const cards = [
    {
      label: 'Total Students',
      value: kpis.totalStudents,
      subValue: `${kpis.studentsLoggedIn} logged in`,
      icon: Users,
      badgeColor: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      valueColor: 'text-indigo-900',
    },
    {
      label: 'Active (7 Days)',
      value: kpis.activeStudentsLast7Days,
      subValue: `${kpis.studentsNeverLoggedIn} never logged in`,
      icon: CalendarCheck,
      badgeColor: 'bg-cyan-50 text-cyan-600 border-cyan-200',
      valueColor: 'text-cyan-900',
    },
    {
      label: 'Game Attempts',
      value: kpis.totalAttempts,
      subValue: `${kpis.completedAttempts} completed`,
      icon: Gamepad2,
      badgeColor: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      valueColor: 'text-emerald-900',
    },
    {
      label: 'Average Score',
      value: `${kpis.averageScore}%`,
      subValue: kpis.completedAttempts > 0 ? `${kpis.completedAttempts} graded attempts` : 'No attempts yet',
      icon: Trophy,
      badgeColor: 'bg-amber-50 text-amber-600 border-amber-200',
      valueColor: 'text-amber-900',
    },
    {
      label: 'Total Time Spent',
      value: formatTimeSpent(kpis.totalTimeSpentSeconds),
      subValue: kpis.totalAttempts > 0 ? `Avg ~${Math.round(kpis.totalTimeSpentSeconds / kpis.totalAttempts)}s / game` : '0s',
      icon: Clock,
      badgeColor: 'bg-purple-50 text-purple-600 border-purple-200',
      valueColor: 'text-purple-900',
    },
    {
      label: 'Completion Rate',
      value: kpis.totalAttempts > 0 ? `${Math.round((kpis.completedAttempts / kpis.totalAttempts) * 100)}%` : '0%',
      subValue: `${kpis.abandonedAttempts} abandoned`,
      icon: TrendingUp,
      badgeColor: 'bg-rose-50 text-rose-600 border-rose-200',
      valueColor: 'text-rose-900',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm transition-all hover:shadow-md hover:border-slate-300 flex flex-col justify-between ${
              isLoading ? 'opacity-50 animate-pulse' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider truncate">
                {card.label}
              </span>
              <div className={`p-1.5 rounded-xl border ${card.badgeColor} shrink-0`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className={`text-2xl sm:text-3xl font-black font-mono tracking-tight my-1 ${card.valueColor}`}>
              {card.value}
            </div>

            <div className="text-[11px] font-medium text-slate-500 truncate">
              {card.subValue}
            </div>
          </div>
        );
      })}
    </div>
  );
};
