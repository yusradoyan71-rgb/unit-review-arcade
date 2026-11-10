/**
 * UNIT REVIEW ARCADE — OVERVIEW KPI CARDS (PHASE 3B)
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
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20',
    },
    {
      label: 'Students Active (7d)',
      value: kpis.activeStudentsLast7Days,
      subValue: `${kpis.studentsNeverLoggedIn} never logged in`,
      icon: CalendarCheck,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
    },
    {
      label: 'Total Game Attempts',
      value: kpis.totalAttempts,
      subValue: `${kpis.completedAttempts} completed`,
      icon: Gamepad2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      label: 'Average Score',
      value: `${kpis.averageScore}%`,
      subValue: kpis.completedAttempts > 0 ? `${kpis.completedAttempts} graded attempts` : 'No attempts yet',
      icon: Trophy,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      label: 'Total Time Spent',
      value: formatTimeSpent(kpis.totalTimeSpentSeconds),
      subValue: kpis.totalAttempts > 0 ? `Avg ~${Math.round(kpis.totalTimeSpentSeconds / kpis.totalAttempts)}s / game` : '0s',
      icon: Clock,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
    },
    {
      label: 'Completion Rate',
      value: kpis.totalAttempts > 0 ? `${Math.round((kpis.completedAttempts / kpis.totalAttempts) * 100)}%` : '0%',
      subValue: `${kpis.abandonedAttempts} abandoned`,
      icon: TrendingUp,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-2xl border transition-all ${card.bg} ${
              isLoading ? 'opacity-50 animate-pulse' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 truncate">
                {card.label}
              </span>
              <Icon className={`w-4 h-4 shrink-0 ${card.color}`} />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-arcade tracking-tight text-white mb-1">
              {card.value}
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              {card.subValue}
            </div>
          </div>
        );
      })}
    </div>
  );
};
