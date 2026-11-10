/**
 * UNIT REVIEW ARCADE — STUDENT ROSTER TABLE (PHASE 3B)
 * 
 * Filterable student roster displaying authoritative curriculum progress,
 * activity completion counts, average/best scores, and status flags.
 */

import React from 'react';
import type { RosterStudent } from '../../../types/teacher';
import { 
  Search, 
  ChevronRight, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  HelpCircle,
  TrendingDown,
  User
} from 'lucide-react';

interface StudentRosterTableProps {
  roster: RosterStudent[];
  isLoading: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSelectStudent: (studentNumber: string) => void;
}

export const StudentRosterTable: React.FC<StudentRosterTableProps> = ({
  roster,
  isLoading,
  searchTerm,
  onSearchChange,
  onSelectStudent,
}) => {
  // Format last login timestamp
  const formatLastLogin = (isoString: string | null) => {
    if (!isoString) return 'Never';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'Never';
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Status Badge Component
  const renderStatusBadge = (status: RosterStudent['status']) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            <span>Active</span>
          </span>
        );
      case 'needs_attention':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <TrendingDown className="w-3 h-3" />
            <span>Needs Support (&lt;50%)</span>
          </span>
        );
      case 'never_logged_in':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
            <HelpCircle className="w-3 h-3" />
            <span>Never Logged In</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search student by name or number..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="text-xs text-slate-400 self-center">
          Showing <span className="text-white font-semibold">{roster.length}</span> student{roster.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* Roster Table Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold text-[10px]">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-3">Class</th>
                <th className="py-3 px-3">Last Active</th>
                <th className="py-3 px-3">Curriculum Progress</th>
                <th className="py-3 px-3 text-center">Attempts</th>
                <th className="py-3 px-3 text-center">Avg Score</th>
                <th className="py-3 px-3 text-center">Best</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading ? (
                // Skeletons
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="py-3.5 px-4">
                      <div className="h-4 bg-slate-800 rounded w-28 mb-1" />
                      <div className="h-3 bg-slate-800/60 rounded w-16" />
                    </td>
                    <td className="py-3.5 px-3"><div className="h-4 bg-slate-800 rounded w-8" /></td>
                    <td className="py-3.5 px-3"><div className="h-4 bg-slate-800 rounded w-20" /></td>
                    <td className="py-3.5 px-3"><div className="h-4 bg-slate-800 rounded w-32" /></td>
                    <td className="py-3.5 px-3 text-center"><div className="h-4 bg-slate-800 rounded w-6 mx-auto" /></td>
                    <td className="py-3.5 px-3 text-center"><div className="h-4 bg-slate-800 rounded w-10 mx-auto" /></td>
                    <td className="py-3.5 px-3 text-center"><div className="h-4 bg-slate-800 rounded w-10 mx-auto" /></td>
                    <td className="py-3.5 px-3"><div className="h-4 bg-slate-800 rounded w-16" /></td>
                    <td className="py-3.5 px-4 text-right"><div className="h-6 bg-slate-800 rounded w-16 ml-auto" /></td>
                  </tr>
                ))
              ) : roster.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="font-semibold text-slate-400">No students found matching your filters.</p>
                    <p className="text-[11px] text-slate-500 mt-1">Try selecting "All Classes" or clearing the search query.</p>
                  </td>
                </tr>
              ) : (
                roster.map((student) => (
                  <tr
                    key={student.studentNumber}
                    onClick={() => onSelectStudent(student.studentNumber)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                  >
                    {/* Student Info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/20 flex items-center justify-center font-bold text-xs shrink-0">
                          {student.fullName ? student.fullName.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">
                            {student.fullName}
                          </div>
                          <div className="font-mono text-[11px] text-slate-500">
                            No. {student.studentNumber}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Class */}
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 font-bold text-slate-300 font-arcade">
                        {student.class}
                      </span>
                    </td>

                    {/* Last Active */}
                    <td className="py-3 px-3 text-slate-400 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-slate-500 shrink-0" />
                        <span>{formatLastLogin(student.lastLoginAt)}</span>
                      </div>
                    </td>

                    {/* Dynamic Curriculum Progress */}
                    <td className="py-3 px-3 min-w-[140px]">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-300 font-medium">
                            {student.completedActivitiesCount} / {student.totalPublishedActivities || '—'}
                          </span>
                          <span className="font-bold text-indigo-400">
                            {student.curriculumProgressPercentage}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-300"
                            style={{ width: `${student.curriculumProgressPercentage}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Attempts */}
                    <td className="py-3 px-3 text-center font-semibold text-slate-300">
                      {student.totalAttempts}
                    </td>

                    {/* Average Score */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`font-bold px-2 py-0.5 rounded-lg text-xs ${
                          student.completedActivitiesCount === 0
                            ? 'text-slate-500 bg-slate-900'
                            : student.averageCompletedScore >= 80
                            ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                            : student.averageCompletedScore >= 50
                            ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                            : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                        }`}
                      >
                        {student.completedActivitiesCount > 0 ? `${student.averageCompletedScore}%` : '—'}
                      </span>
                    </td>

                    {/* Best Score */}
                    <td className="py-3 px-3 text-center text-slate-300 font-semibold">
                      {student.bestScore > 0 ? `${student.bestScore}%` : '—'}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3">
                      {renderStatusBadge(student.status)}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectStudent(student.studentNumber);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-400 transition-colors"
                        title="View Student Profile"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
