/**
 * UNIT REVIEW ARCADE — CLASSROOM STUDENT GRID (PHASE 3.4B)
 * 
 * Smartboard-friendly, touch-optimized grid for student behavior tracking.
 * Minimum 44-48px touch targets for interactive classroom whiteboards.
 * 
 * PRIVACY MANDATE:
 * When isProjectorPrivacyMode is TRUE, strictly hides negative points, net points,
 * and disciplinary badges from DOM to guarantee zero leak on projector screens.
 */

import React from 'react';
import type { ClassroomStudentSummary } from '../../../../types/classroomPoints';
import { MonsterAvatar } from '../../../monster/MonsterAvatar';
import { 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Star, 
  Award, 
  User, 
  Search,
  CheckSquare,
  Square
} from 'lucide-react';

interface ClassroomStudentGridProps {
  students: ClassroomStudentSummary[];
  selectedStudentNumbers: Set<string>;
  onToggleSelect: (studentNumber: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onQuickAward: (studentNumber: string) => void;
  onBulkAward: () => void;
  isProjectorPrivacyMode: boolean;
  isLoading: boolean;
  selectedClassId: 'all' | '7A' | '7B' | '8A' | '8B';
  onSelectClassId: (classId: 'all' | '7A' | '7B' | '8A' | '8B') => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
}

export const ClassroomStudentGrid: React.FC<ClassroomStudentGridProps> = ({
  students,
  selectedStudentNumbers,
  onToggleSelect,
  onSelectAll,
  onClearSelection,
  onQuickAward,
  onBulkAward,
  isProjectorPrivacyMode,
  isLoading,
  selectedClassId,
  onSelectClassId,
  searchTerm,
  onSearchTermChange,
}) => {
  // Filter students by class and search query
  const filteredStudents = students.filter((s) => {
    const matchesClass = selectedClassId === 'all' || s.class === selectedClassId;
    if (!matchesClass) return false;
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return s.fullName.toLowerCase().includes(term) || s.studentNumber.toLowerCase().includes(term);
  });

  const selectedCount = selectedStudentNumbers.size;
  const isAllFilteredSelected = filteredStudents.length > 0 && 
    filteredStudents.every((s) => selectedStudentNumbers.has(s.studentNumber));

  return (
    <div className="space-y-4">
      {/* Smartboard Filter & Selection Action Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Class Selection Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(['all', '7A', '7B', '8A', '8B'] as const).map((cId) => {
            const count = cId === 'all' 
              ? students.length 
              : students.filter((s) => s.class === cId).length;
            const isSelected = selectedClassId === cId;
            return (
              <button
                key={cId}
                type="button"
                onClick={() => onSelectClassId(cId)}
                className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-300'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span>{cId === 'all' ? 'All Classes' : `Class ${cId}`}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  isSelected ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-200 text-slate-700'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Bulk Selection Actions */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Student Search Input */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              placeholder="Search student or #..."
              className="w-full min-h-[44px] pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          {/* Select All / Clear Button */}
          <button
            type="button"
            onClick={isAllFilteredSelected ? onClearSelection : onSelectAll}
            className="min-h-[44px] px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
            title={isAllFilteredSelected ? 'Deselect all' : 'Select all shown'}
          >
            {isAllFilteredSelected ? (
              <>
                <Square className="w-4 h-4 text-indigo-600" />
                <span className="hidden sm:inline">Deselect All</span>
              </>
            ) : (
              <>
                <CheckSquare className="w-4 h-4 text-indigo-600" />
                <span className="hidden sm:inline">Select All</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Floating / Sticky Award Bar when 1+ Students Selected */}
      {selectedCount > 0 && (
        <div className="sticky top-20 z-30 p-3 sm:p-4 rounded-2xl bg-indigo-900 text-white shadow-xl flex items-center justify-between gap-3 animate-fade-in border border-indigo-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-indigo-950 font-black flex items-center justify-center text-xs shadow-xs">
              {selectedCount}
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold">
                {selectedCount} {selectedCount === 1 ? 'student' : 'students'} selected
              </p>
              <p className="text-[11px] text-indigo-200 hidden sm:block">
                Choose a behavior category to award classroom points
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClearSelection}
              className="min-h-[44px] px-3 py-2 rounded-xl bg-indigo-800 hover:bg-indigo-700 text-indigo-200 text-xs font-bold transition-all"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={onBulkAward}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-indigo-950 font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 fill-amber-950" />
              <span>Award Points ({selectedCount})</span>
            </button>
          </div>
        </div>
      )}

      {/* Students Card Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200/80 animate-pulse space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-200 mx-auto" />
              <div className="h-4 bg-slate-200 rounded-md w-3/4 mx-auto" />
              <div className="h-3 bg-slate-100 rounded-md w-1/2 mx-auto" />
              <div className="h-8 bg-slate-100 rounded-xl w-full" />
            </div>
          ))}
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-slate-200">
          <User className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="font-bold text-slate-700 text-sm">No students found matching your criteria</p>
          <p className="text-xs text-slate-400 mt-1">Try selecting another class or clearing your search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {filteredStudents.map((student) => {
            const isSelected = selectedStudentNumbers.has(student.studentNumber);

            return (
              <div
                key={student.studentNumber}
                onClick={() => onToggleSelect(student.studentNumber)}
                className={`relative p-3.5 sm:p-4 rounded-2xl transition-all cursor-pointer select-none flex flex-col justify-between group border text-left ${
                  isSelected
                    ? 'bg-indigo-50/70 border-indigo-500 shadow-md ring-2 ring-indigo-400/80'
                    : 'bg-white hover:bg-slate-50 border-slate-200 shadow-xs hover:shadow-md'
                }`}
              >
                {/* Checkbox indicator */}
                <div className="absolute top-3 right-3">
                  {isSelected ? (
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 fill-indigo-100" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 group-hover:text-slate-400" />
                  )}
                </div>

                {/* Top Section: Avatar & Info */}
                <div className="flex flex-col items-center text-center space-y-1.5 pt-1">
                  {/* Monster World Companion / Egg Avatar */}
                  <div className="relative flex items-center justify-center shrink-0">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-b from-indigo-50/60 via-white to-slate-100/80 border border-slate-200/70 flex items-center justify-center shadow-xs overflow-visible group-hover:scale-105 transition-transform duration-200">
                      <MonsterAvatar
                        config={student.monster || undefined}
                        stage={student.monsterStage || (student.isHatched ? 'hatchling' : 'egg')}
                        evolutionTier={student.evolutionTier !== undefined ? student.evolutionTier : (student.isHatched ? 1 : 0)}
                        equippedAccessories={student.monster?.accessories}
                        frame={student.monster?.accessories?.frame}
                        size={52}
                        className="shrink-0"
                      />
                    </div>
                    {/* Companion / Egg Status Label */}
                    <span className="absolute -bottom-1.5 px-2 py-0.5 rounded-full bg-slate-900/85 backdrop-blur-xs text-[9px] font-bold text-white shadow-xs border border-white/30 tracking-wider truncate max-w-[80px]">
                      {student.isHatched ? (student.monster?.name || 'Hatched') : (student.monsterStage === 'cracking' ? 'Cracking' : 'Egg')}
                    </span>
                  </div>

                  {/* Name and Number */}
                  <div className="w-full px-1 pt-0.5">
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 truncate leading-tight group-hover:text-indigo-600 transition-colors">
                      {student.fullName}
                    </h3>
                    <div className="flex items-center justify-center gap-1.5 mt-0.5">
                      <span className="font-mono text-[10px] text-slate-400">
                        #{student.studentNumber}
                      </span>
                      <span className="px-1.5 py-0.2 rounded-md bg-slate-100 text-[10px] font-bold text-slate-600">
                        {student.class}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Middle Section: Point Badges (Strict Privacy Separation) */}
                <div className="my-3 py-2 px-2.5 rounded-xl bg-slate-50/90 border border-slate-100 text-center space-y-1">
                  {isProjectorPrivacyMode ? (
                    // PROJECTOR PRIVACY MODE ACTIVE: STRICTLY POSITIVE POINTS ONLY
                    <div className="flex items-center justify-center gap-1.5 text-amber-700">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-500 shrink-0" />
                      <span className="font-black text-sm sm:text-base text-amber-900">
                        {student.positivePoints}
                      </span>
                      <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                        pts
                      </span>
                    </div>
                  ) : (
                    // TEACHER PRIVATE MODE: SHOW NET AND BREAKDOWN
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Net:</span>
                        <span
                          className={`font-black text-sm sm:text-base ${
                            student.netPoints >= 0 ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {student.netPoints >= 0 ? `+${student.netPoints}` : student.netPoints}
                        </span>
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 flex items-center justify-center gap-1">
                        <span className="text-emerald-600">+{student.positivePoints}</span>
                        <span>/</span>
                        <span className="text-rose-500">-{student.negativePoints}</span>
                      </div>
                    </div>
                  )}

                  {/* Milestone mini-badge */}
                  {student.nextMilestone && (
                    <div className="pt-1 border-t border-slate-200/60">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold mb-0.5">
                        <span className="truncate max-w-[80px]" title={student.nextMilestone.name}>
                          {student.nextMilestone.name}
                        </span>
                        <span>{student.nextMilestone.progressPercent}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-indigo-500 rounded-full transition-all"
                          style={{ width: `${Math.min(student.nextMilestone.progressPercent, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Section: Single Student Quick Award Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickAward(student.studentNumber);
                  }}
                  className="w-full min-h-[44px] py-2 px-3 rounded-xl bg-slate-100 hover:bg-indigo-600 text-slate-700 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-xs"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>+ Award</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
