/**
 * UNIT REVIEW ARCADE — STUDENT ROSTER TABLE (PHASE 9D)
 * Version: 9.4.0
 * 
 * Creative Campus Professional Educator Redesign.
 * Responsive, filterable student roster displaying authoritative curriculum progress,
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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Active</span>
          </span>
        );
      case 'needs_attention':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Needs Support (&lt;50%)</span>
          </span>
        );
      case 'never_logged_in':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
            <HelpCircle className="w-3.5 h-3.5" />
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
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-xs shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
          />
        </div>

        <div className="text-xs text-slate-500 self-center font-medium">
          Showing <span className="text-slate-900 font-bold">{roster.length}</span> student{roster.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* Roster Table Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/90 text-slate-500 border-b border-slate-200 uppercase tracking-wider font-bold text-[10px]">
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-3">Class</th>
                <th className="py-3.5 px-3">Last Active</th>
                <th className="py-3.5 px-3">Curriculum Progress</th>
                <th className="py-3.5 px-3 text-center">Attempts</th>
                <th className="py-3.5 px-3 text-center">Avg Score</th>
                <th className="py-3.5 px-3 text-center">Best</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                // Skeletons
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="py-4 px-4">
                      <div className="h-4 bg-slate-200 rounded w-28 mb-1.5" />
                      <div className="h-3 bg-slate-100 rounded w-16" />
                    </td>
                    <td className="py-4 px-3"><div className="h-5 bg-slate-200 rounded w-10" /></td>
                    <td className="py-4 px-3"><div className="h-4 bg-slate-200 rounded w-20" /></td>
                    <td className="py-4 px-3"><div className="h-4 bg-slate-200 rounded w-32" /></td>
                    <td className="py-4 px-3 text-center"><div className="h-4 bg-slate-200 rounded w-6 mx-auto" /></td>
                    <td className="py-4 px-3 text-center"><div className="h-4 bg-slate-200 rounded w-10 mx-auto" /></td>
                    <td className="py-4 px-3 text-center"><div className="h-4 bg-slate-200 rounded w-10 mx-auto" /></td>
                    <td className="py-4 px-3"><div className="h-5 bg-slate-200 rounded w-16" /></td>
                    <td className="py-4 px-4 text-right"><div className="h-7 bg-slate-200 rounded w-8 ml-auto" /></td>
                  </tr>
                ))
              ) : roster.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-slate-400">
                    <AlertCircle className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="font-bold text-slate-700 text-sm">No students found matching your filters.</p>
                    <p className="text-xs text-slate-400 mt-1">Try selecting "All Classes" or clearing the search query.</p>
                  </td>
                </tr>
              ) : (
                roster.map((student) => (
                  <tr
                    key={student.studentNumber}
                    onClick={() => onSelectStudent(student.studentNumber)}
                    className="hover:bg-slate-50/90 cursor-pointer transition-colors group"
                  >
                    {/* Student Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                          {student.fullName ? student.fullName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {student.fullName}
                          </div>
                          <div className="font-mono text-[11px] text-slate-400">
                            No. {student.studentNumber}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Class */}
                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 font-bold text-slate-700 font-mono text-xs">
                        {student.class}
                      </span>
                    </td>

                    {/* Last Active */}
                    <td className="py-3.5 px-3 text-slate-500 text-[11px] font-medium">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{formatLastLogin(student.lastLoginAt)}</span>
                      </div>
                    </td>

                    {/* Dynamic Curriculum Progress */}
                    <td className="py-3.5 px-3 min-w-[150px]">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-600 font-semibold">
                            {student.completedActivitiesCount} / {student.totalPublishedActivities || '—'}
                          </span>
                          <span className="font-black font-mono text-indigo-600">
                            {student.curriculumProgressPercentage}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden p-0.5">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-300"
                            style={{ width: `${student.curriculumProgressPercentage}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Attempts */}
                    <td className="py-3.5 px-3 text-center font-bold font-mono text-slate-700">
                      {student.totalAttempts}
                    </td>

                    {/* Average Score */}
                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`inline-block font-mono font-bold px-2 py-0.5 rounded-md text-xs ${
                          student.completedActivitiesCount === 0
                            ? 'text-slate-400 bg-slate-100'
                            : student.averageCompletedScore >= 80
                            ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                            : student.averageCompletedScore >= 50
                            ? 'text-amber-700 bg-amber-50 border border-amber-200'
                            : 'text-rose-700 bg-rose-50 border border-rose-200'
                        }`}
                      >
                        {student.completedActivitiesCount > 0 ? `${student.averageCompletedScore}%` : '—'}
                      </span>
                    </td>

                    {/* Best Score */}
                    <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-700">
                      {student.bestScore > 0 ? `${student.bestScore}%` : '—'}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-3">
                      {renderStatusBadge(student.status)}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectStudent(student.studentNumber);
                        }}
                        className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white text-slate-400 transition-colors"
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
