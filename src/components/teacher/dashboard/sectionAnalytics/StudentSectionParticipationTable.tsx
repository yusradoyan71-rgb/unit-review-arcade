import React, { useState } from 'react';
import type { StudentSectionParticipation } from '../../../../types/teacher';
import { 
  Search, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Award, 
  HelpCircle,
  User
} from 'lucide-react';

interface StudentSectionParticipationTableProps {
  students: StudentSectionParticipation[];
  onSelectStudent: (studentNumber: string) => void;
  selectedClassId: string;
  onClassChange?: (classId: 'all' | '7A' | '7B' | '8A' | '8B') => void;
}

export const StudentSectionParticipationTable: React.FC<StudentSectionParticipationTableProps> = ({
  students,
  onSelectStudent,
  selectedClassId,
  onClassChange: _onClassChange,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [participationTab, setParticipationTab] = useState<'all' | 'not_started_general' | 'not_started_mixed' | 'active_all'>('all');

  // Filter students
  const filteredStudents = students.filter((s) => {
    // Class filter
    if (selectedClassId !== 'all' && s.class !== selectedClassId) return false;

    // Participation status filter
    if (participationTab === 'not_started_general' && s.generalEnglishStarted) return false;
    if (participationTab === 'not_started_mixed' && s.mixedPracticeStarted) return false;
    if (participationTab === 'active_all') {
      if (!s.unitReviewStarted || !s.generalEnglishStarted || !s.mixedPracticeStarted) return false;
    }

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchNum = s.studentNumber.toLowerCase().includes(term);
      const matchName = s.fullName.toLowerCase().includes(term);
      if (!matchNum && !matchName) return false;
    }

    return true;
  });

  const notStartedGeneralCount = students.filter((s) => (selectedClassId === 'all' || s.class === selectedClassId) && !s.generalEnglishStarted).length;
  const notStartedMixedCount = students.filter((s) => (selectedClassId === 'all' || s.class === selectedClassId) && !s.mixedPracticeStarted).length;

  return (
    <div className="space-y-4">
      {/* Participation Header & Quick Filter Pills */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
        
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search student by name or number..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Quick Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setParticipationTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              participationTab === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            All Students ({students.length})
          </button>

          <button
            type="button"
            onClick={() => setParticipationTab('not_started_general')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              participationTab === 'not_started_general'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Not Started General ({notStartedGeneralCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setParticipationTab('not_started_mixed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              participationTab === 'not_started_mixed'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Not Started Mixed ({notStartedMixedCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setParticipationTab('active_all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              participationTab === 'active_all'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Active in All</span>
          </button>
        </div>

      </div>

      {/* Student Participation Matrix Table */}
      <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-black">
                <th className="py-3.5 px-4">Student &amp; Class</th>
                <th className="py-3.5 px-4 text-center">Unit Review</th>
                <th className="py-3.5 px-4 text-center">General English</th>
                <th className="py-3.5 px-4 text-center">Mixed Practice</th>
                <th className="py-3.5 px-4 text-center">Overall Accuracy</th>
                <th className="py-3.5 px-4 text-center">Total XP</th>
                <th className="py-3.5 px-4 text-center">Last Active</th>
                <th className="py-3.5 px-4 text-right">Mistake Drill-Down</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <HelpCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-bold text-slate-600">No students match this participation filter.</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr 
                    key={s.studentNumber} 
                    onClick={() => onSelectStudent(s.studentNumber)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    {/* Student Identity */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                          <User className="w-4 h-4 text-slate-500" />
                        </div>
                        <div>
                          <strong className="block text-slate-900 font-bold group-hover:text-indigo-600 transition-colors">
                            {s.fullName}
                          </strong>
                          <span className="text-[11px] font-mono text-slate-400">
                            #{s.studentNumber} • Class {s.class} ({s.grade === 'grade-7' ? 'Grade 7' : 'Grade 8'})
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Unit Review */}
                    <td className="py-3.5 px-4 text-center">
                      {s.unitReviewStarted ? (
                        <div className="inline-flex flex-col items-center">
                          <span className="text-xs font-black font-mono text-slate-800">
                            {s.unitReviewCompleted} completed
                          </span>
                          <span className="text-[10px] font-bold text-emerald-600 font-mono">
                            {s.unitReviewAccuracy}% acc
                          </span>
                        </div>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-400">
                          Not Started
                        </span>
                      )}
                    </td>

                    {/* General English */}
                    <td className="py-3.5 px-4 text-center">
                      {s.generalEnglishStarted ? (
                        <div className="inline-flex flex-col items-center">
                          <span className="text-xs font-black font-mono text-indigo-900">
                            {s.generalEnglishCompleted} sets
                          </span>
                          <span className="text-[10px] font-bold text-indigo-600 font-mono">
                            {s.generalEnglishAccuracy}% acc
                          </span>
                        </div>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-50 text-amber-700 border border-amber-200">
                          ⚠️ Not Started
                        </span>
                      )}
                    </td>

                    {/* Mixed Practice */}
                    <td className="py-3.5 px-4 text-center">
                      {s.mixedPracticeStarted ? (
                        <div className="inline-flex flex-col items-center">
                          <span className="text-xs font-black font-mono text-purple-900">
                            {s.mixedPracticeCompleted} labs
                          </span>
                          <span className="text-[10px] font-bold text-purple-600 font-mono">
                            {s.mixedPracticeAccuracy}% acc
                          </span>
                        </div>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-purple-50 text-purple-700 border border-purple-200">
                          ⚠️ Not Started
                        </span>
                      )}
                    </td>

                    {/* Overall Accuracy */}
                    <td className="py-3.5 px-4 text-center font-mono">
                      <span className={`text-sm font-black ${
                        s.overallAccuracy >= 80 ? 'text-emerald-600' : s.overallAccuracy >= 60 ? 'text-amber-600' : s.totalCompleted > 0 ? 'text-rose-600' : 'text-slate-400'
                      }`}>
                        {s.totalCompleted > 0 ? `${s.overallAccuracy}%` : '—'}
                      </span>
                    </td>

                    {/* Total XP */}
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-amber-800">
                      <div className="inline-flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        <span>{s.totalXp.toLocaleString()}</span>
                      </div>
                    </td>

                    {/* Last Active */}
                    <td className="py-3.5 px-4 text-center text-slate-500 text-[11px]">
                      {s.lastActivityDate ? s.lastActivityDate.slice(0, 10) : 'Never'}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectStudent(s.studentNumber);
                        }}
                        className="px-2.5 py-1 rounded-xl bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white text-slate-700 font-bold text-xs inline-flex items-center gap-1 transition-colors"
                      >
                        <span>Drill Down</span>
                        <ChevronRight className="w-3.5 h-3.5" />
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
