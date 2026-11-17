/**
 * UNIT REVIEW ARCADE — EDIT STUDENT MODAL (PHASE 3B)
 * 
 * Allows teachers to update a student's full name, class assignment, or active status.
 * Student number is strictly immutable to protect historical attempts, XP, and coins.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTeacherAuth } from '../../../context/TeacherAuthContext';
import { TeacherApiService } from '../../../services/teacherApiService';
import type { StudentManagementRecord } from '../../../types/teacher';
import { 
  X, 
  UserCheck, 
  AlertCircle, 
  Loader2, 
  KeyRound, 
  Lock, 
  Power 
} from 'lucide-react';

interface EditStudentModalProps {
  student: StudentManagementRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updated: StudentManagementRecord) => void;
  onResetPin: (student: StudentManagementRecord) => void;
}

export const EditStudentModal: React.FC<EditStudentModalProps> = ({
  student,
  isOpen,
  onClose,
  onSuccess,
  onResetPin,
}) => {
  const { teacherSession } = useTeacherAuth();

  const [fullName, setFullName] = useState('');
  const [studentClass, setStudentClass] = useState<'7A' | '7B' | '8A' | '8B'>('7A');
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (student) {
      setFullName(student.fullName);
      setStudentClass((student.class as '7A' | '7B' | '8A' | '8B') || '7A');
      setIsActive(Boolean(student.isActive));
      setError(null);
    }
  }, [student]);

  if (!isOpen || !student) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherSession?.teacherToken) {
      setError('Teacher authentication required.');
      return;
    }

    const cleanName = fullName.trim();
    if (!cleanName) {
      setError('Student full name is required.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await TeacherApiService.updateStudent(teacherSession.teacherToken, {
        studentNumber: student.studentNumber,
        fullName: cleanName,
        class: studentClass,
        isActive: isActive,
      });

      if (res.success && res.student) {
        onSuccess({
          ...student,
          fullName: res.student.fullName,
          class: res.student.class,
          grade: res.student.grade,
          isActive: res.student.isActive,
        });
        onClose();
      } else {
        setError(res.error || 'Failed to update student.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-800"
        >
          {/* Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-sky-50 to-indigo-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Edit Student Details</h3>
                <p className="text-xs text-slate-500 font-mono">Student #{student.studentNumber}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Immutable Student Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Student Number (Immutable)</span>
              </label>
              <input
                type="text"
                disabled
                value={student.studentNumber}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 font-mono text-sm cursor-not-allowed"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Student numbers cannot be changed to protect existing attempt history, XP, and coins.
              </p>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>

            {/* Class Assignment */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Class Assignment *
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['7A', '7B', '8A', '8B'] as const).map((cls) => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => setStudentClass(cls)}
                    className={`py-2 rounded-xl text-xs font-black transition-all border ${
                      studentClass === cls
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            </div>

            {/* Account Status Toggle */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="block text-xs font-bold text-slate-800">Account Status</span>
                <span className="text-[11px] text-slate-400">
                  {isActive ? 'Active — can log in and play' : 'Disabled — login blocked'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-slate-100 text-slate-500 border-slate-300'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>{isActive ? 'Active' : 'Disabled'}</span>
              </button>
            </div>

            {/* PIN Reset Shortcut */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-indigo-600" />
                <span className="text-xs text-slate-700 font-medium">Lost student PIN?</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onResetPin(student);
                }}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold transition-colors shadow-xs"
              >
                Reset PIN
              </button>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !fullName.trim()}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
                <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

