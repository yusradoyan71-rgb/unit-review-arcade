/**
 * UNIT REVIEW ARCADE — STUDENT MANAGEMENT VIEW (PHASE 3B)
 * 
 * Comprehensive educator control cockpit for managing official student accounts
 * across Grades 7A, 7B, 8A, and 8B.
 * Supports adding individual students, bulk importing, editing demographic details,
 * resetting 4-digit PINs, deactivating accounts, and generating printable login slips.
 */

import React, { useState } from 'react';
import type { 
  StudentManagementRecord, 
  RosterStudent 
} from '../../../types/teacher';
import { 
  Search, 
  UserPlus, 
  UploadCloud, 
  Printer, 
  Archive, 
  Edit3, 
  KeyRound, 
  Power, 
  CheckCircle2, 
  Users, 
  Clock
} from 'lucide-react';
import { AddStudentModal } from './AddStudentModal';
import { BulkImportModal } from './BulkImportModal';
import { EditStudentModal } from './EditStudentModal';
import { ResetPinModal } from './ResetPinModal';
import { DemoAccountArchiveModal } from './DemoAccountArchiveModal';
import { StudentCredentialCardsModal } from './StudentCredentialCardsModal';
import type { CredentialCardItem } from './StudentCredentialCardsModal';

// Verification helper for initial demo fixture accounts
const DEMO_FIXTURE_NAMES: Record<string, string> = {
  '701': 'Kerem Yılmaz',
  '702': 'Zeynep Kaya',
  '703': 'Can Demir',
  '704': 'Elif Şahin',
  '801': 'Barış Arslan',
  '802': 'Ayşe Çelik',
  '803': 'Murat Yıldız',
  '804': 'Selin Aydın',
};

function isDemoFixture(studentNumber: string, fullName: string): boolean {
  const expected = DEMO_FIXTURE_NAMES[studentNumber];
  if (!expected) return false;
  const norm = (str: string) => str.toLowerCase().replace(/ı/g, 'i').replace(/İ/g, 'i').trim();
  return norm(fullName) === norm(expected);
}

interface StudentManagementViewProps {
  roster: RosterStudent[];
  isLoading: boolean;
  onRefresh: () => void;
  selectedClassId: 'all' | '7A' | '7B' | '8A' | '8B';
  onSelectClassId: (cId: 'all' | '7A' | '7B' | '8A' | '8B') => void;
}

export const StudentManagementView: React.FC<StudentManagementViewProps> = ({
  roster,
  isLoading,
  onRefresh,
  selectedClassId,
  onSelectClassId,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentManagementRecord | null>(null);
  const [resettingPinStudent, setResettingPinStudent] = useState<StudentManagementRecord | null>(null);

  // Print Cards Modal State
  const [printCards, setPrintCards] = useState<CredentialCardItem[] | null>(null);

  // Check if any verified demo fixtures (701-704, 801-804 with demo names) are active
  const hasActiveDemoAccounts = roster.some(
    (s) => isDemoFixture(s.studentNumber, s.fullName) && s.isActive && s.class !== 'DEMO_ARCHIVE'
  );

  // Filter roster
  const filteredStudents = roster.filter((student) => {
    // Class filter
    if (selectedClassId !== 'all' && student.class !== selectedClassId) return false;

    // Status filter
    if (statusFilter === 'active' && !student.isActive) return false;
    if (statusFilter === 'inactive' && student.isActive) return false;

    // Search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchNum = student.studentNumber.toLowerCase().includes(term);
      const matchName = student.fullName.toLowerCase().includes(term);
      if (!matchNum && !matchName) return false;
    }

    return true;
  });

  const existingNumbers = roster.map((s) => s.studentNumber);

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

  // Convert RosterStudent to StudentManagementRecord
  const toRecord = (s: RosterStudent): StudentManagementRecord => ({
    studentId: s.studentId,
    studentNumber: s.studentNumber,
    fullName: s.fullName,
    grade: s.grade,
    class: s.class,
    isActive: s.isActive,
    lastLoginAt: s.lastLoginAt,
  });

  return (
    <div className="space-y-4">
      {/* Action Banner & Tools */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name or student number..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all"
          />
        </div>

        {/* Buttons Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Add Student Button */}
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Student</span>
          </button>

          {/* Bulk Import Button */}
          <button
            type="button"
            onClick={() => setIsBulkModalOpen(true)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <UploadCloud className="w-4 h-4 text-slate-500" />
            <span>Bulk Import (CSV / Excel)</span>
          </button>

          {/* Print Class Cards Button */}
          <button
            type="button"
            onClick={() =>
              setPrintCards(
                filteredStudents.map((s) => ({
                  student: toRecord(s),
                }))
              )
            }
            disabled={filteredStudents.length === 0}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
            title="Print login cards for current view"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Login Cards</span>
          </button>

          {/* Demo Archival Button */}
          <button
            type="button"
            onClick={() => setIsArchiveModalOpen(true)}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
              hasActiveDemoAccounts
                ? 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-800'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
            }`}
            title="Inspect or archive 8 initial demonstration accounts"
          >
            <Archive className="w-4 h-4 text-amber-600" />
            <span>Demo Cleanup</span>
            {hasActiveDemoAccounts && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </button>
        </div>

      </div>

      {/* Sub-Filters: Class and Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-slate-400 mr-1">Class:</span>
          {(['all', '7A', '7B', '8A', '8B'] as const).map((cId) => (
            <button
              key={cId}
              type="button"
              onClick={() => onSelectClassId(cId)}
              className={`px-3 py-1 rounded-xl font-bold transition-all ${
                selectedClassId === cId
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {cId === 'all' ? 'All Classes' : cId}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="font-bold text-slate-400 mr-1">Status:</span>
          {(['all', 'active', 'inactive'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-xl font-bold capitalize transition-all ${
                statusFilter === st
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {st === 'all' ? 'All' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/90 text-slate-500 border-b border-slate-200 uppercase tracking-wider font-bold text-[10px]">
                <th className="py-3.5 px-4">Student No</th>
                <th className="py-3.5 px-4">Full Name</th>
                <th className="py-3.5 px-3">Class</th>
                <th className="py-3.5 px-3">Grade</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Last Active</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-16" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-32" /></td>
                    <td className="py-4 px-3"><div className="h-5 bg-slate-200 rounded w-10" /></td>
                    <td className="py-4 px-3"><div className="h-4 bg-slate-200 rounded w-14" /></td>
                    <td className="py-4 px-3"><div className="h-5 bg-slate-200 rounded w-16" /></td>
                    <td className="py-4 px-3"><div className="h-4 bg-slate-200 rounded w-20" /></td>
                    <td className="py-4 px-4 text-right"><div className="h-6 bg-slate-200 rounded w-20 ml-auto" /></td>
                  </tr>
                ))
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    <Users className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="font-bold text-slate-700 text-sm">No students match your criteria.</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Click "+ Add Student" or "Bulk Import" to enroll your class roster.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const isDemoAccount = isDemoFixture(student.studentNumber, student.fullName);
                  return (
                    <tr key={student.studentNumber} className="hover:bg-slate-50/80 transition-colors">
                      {/* Student Number */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        <span className="flex items-center gap-1.5">
                          <span>#{student.studentNumber}</span>
                          {isDemoAccount && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-sans font-bold">
                              Demo
                            </span>
                          )}
                        </span>
                      </td>

                      {/* Full Name */}
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {student.fullName}
                      </td>

                      {/* Class */}
                      <td className="py-3.5 px-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold text-[11px] font-mono">
                          {student.class}
                        </span>
                      </td>

                      {/* Grade */}
                      <td className="py-3.5 px-3 text-slate-500 font-medium capitalize">
                        {student.grade.replace('grade-', 'Grade ')}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        {student.isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Active</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            <Power className="w-3.5 h-3.5 text-slate-400" />
                            <span>Disabled</span>
                          </span>
                        )}
                      </td>

                      {/* Last Active */}
                      <td className="py-3.5 px-3 text-slate-500 font-mono text-[11px]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{formatLastLogin(student.lastLoginAt)}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Print Card Button */}
                          <button
                            type="button"
                            onClick={() =>
                              setPrintCards([
                                {
                                  student: toRecord(student),
                                },
                              ])
                            }
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="Print Login Slip"
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          {/* Reset PIN Button */}
                          <button
                            type="button"
                            onClick={() => setResettingPinStudent(toRecord(student))}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                            title="Reset 4-Digit PIN"
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>

                          {/* Edit Details Button */}
                          <button
                            type="button"
                            onClick={() => setEditingStudent(toRecord(student))}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                            title="Edit Student Information"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALS */}

      {/* Add Individual Student Modal */}
      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => onRefresh()}
        onPrintCard={(st, pin) => {
          setIsAddModalOpen(false);
          setPrintCards([{ student: st, pin }]);
        }}
        existingStudentNumbers={existingNumbers}
      />

      {/* Bulk Import Modal */}
      <BulkImportModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onSuccess={() => onRefresh()}
        onPrintAllCards={(cards) => {
          setIsBulkModalOpen(false);
          setPrintCards(cards);
        }}
        existingStudentNumbers={existingNumbers}
      />

      {/* Edit Student Modal */}
      <EditStudentModal
        student={editingStudent}
        isOpen={Boolean(editingStudent)}
        onClose={() => setEditingStudent(null)}
        onSuccess={() => onRefresh()}
        onResetPin={(st) => setResettingPinStudent(st)}
      />

      {/* Reset PIN Modal */}
      <ResetPinModal
        student={resettingPinStudent}
        isOpen={Boolean(resettingPinStudent)}
        onClose={() => setResettingPinStudent(null)}
        onSuccess={() => onRefresh()}
      />

      {/* Demo Account Archive Modal */}
      <DemoAccountArchiveModal
        isOpen={isArchiveModalOpen}
        onClose={() => setIsArchiveModalOpen(false)}
        onSuccess={() => onRefresh()}
      />

      {/* Print Login Cards Modal */}
      <StudentCredentialCardsModal
        cards={printCards || []}
        isOpen={Boolean(printCards)}
        onClose={() => setPrintCards(null)}
      />
    </div>
  );
};
