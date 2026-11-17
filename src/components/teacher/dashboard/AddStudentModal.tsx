/**
 * UNIT REVIEW ARCADE — ADD STUDENT MODAL (PHASE 3B)
 * 
 * Secure modal allowing teachers to enroll individual students into Classes 7A, 7B, 8A, or 8B.
 * Supports auto-generating or assigning a custom 4-digit security PIN.
 * Shows the generated PIN once with one-click copy and print capabilities.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTeacherAuth } from '../../../context/TeacherAuthContext';
import { TeacherApiService } from '../../../services/teacherApiService';
import type { StudentManagementRecord } from '../../../types/teacher';
import { 
  X, 
  UserPlus, 
  Check, 
  Copy, 
  Printer, 
  AlertCircle, 
  Loader2, 
  Sparkles,
  KeyRound,
  ShieldCheck
} from 'lucide-react';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newStudent: StudentManagementRecord, generatedPin: string) => void;
  onPrintCard?: (student: StudentManagementRecord, pin: string) => void;
  existingStudentNumbers: string[];
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onPrintCard,
  existingStudentNumbers,
}) => {
  const { teacherSession } = useTeacherAuth();

  const [studentNumber, setStudentNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [studentClass, setStudentClass] = useState<'7A' | '7B' | '8A' | '8B'>('7A');
  const [customPin, setCustomPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Success state (reveals the generated PIN once)
  const [createdResult, setCreatedResult] = useState<{
    student: StudentManagementRecord;
    pin: string;
  } | null>(null);
  const [copiedPin, setCopiedPin] = useState(false);

  if (!isOpen) return null;

  const handleResetForm = () => {
    setStudentNumber('');
    setFullName('');
    setStudentClass('7A');
    setCustomPin('');
    setError(null);
    setCreatedResult(null);
    setCopiedPin(false);
  };

  const handleClose = () => {
    handleResetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherSession?.teacherToken) {
      setError('Teacher authentication required.');
      return;
    }

    const cleanNumber = studentNumber.trim();
    const cleanName = fullName.trim();
    const cleanPin = customPin.trim();

    if (!cleanNumber) {
      setError('Student number is required.');
      return;
    }
    if (!cleanName) {
      setError('Student full name is required.');
      return;
    }
    if (existingStudentNumbers.some((n) => n.toLowerCase() === cleanNumber.toLowerCase())) {
      setError(`Student number #${cleanNumber} is already registered in the roster.`);
      return;
    }
    if (cleanPin && !/^\d{4}$/.test(cleanPin)) {
      setError('Custom PIN must be exactly 4 digits (0000-9999).');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await TeacherApiService.addStudent(teacherSession.teacherToken, {
        studentNumber: cleanNumber,
        fullName: cleanName,
        class: studentClass,
        pin: cleanPin || undefined,
      });

      if (res.success && res.student && res.generatedPin) {
        setCreatedResult({
          student: res.student,
          pin: res.generatedPin,
        });
        onSuccess(res.student, res.generatedPin);
      } else {
        setError(res.error || 'Failed to create student account.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCredentials = () => {
    if (!createdResult) return;
    const text = `Unit Review Arcade Login\nStudent: ${createdResult.student.fullName}\nClass: ${createdResult.student.class}\nStudent No: ${createdResult.student.studentNumber}\nPIN: ${createdResult.pin}`;
    navigator.clipboard.writeText(text);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-800"
        >
          {/* Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-sky-50 to-indigo-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Add Individual Student</h3>
                <p className="text-xs text-slate-500">Create a secure school student account</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {createdResult ? (
              // Success Screen with Reveal Card
              <div className="space-y-5 text-center">
                <div className="w-14 h-14 mx-auto rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Account Enrolled Successfully!</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Student credentials have been hashed and written securely.
                  </p>
                </div>

                {/* Printable Slip Card Preview */}
                <div className="p-4 rounded-2xl bg-slate-50 border-2 border-indigo-200 text-left space-y-3 font-mono shadow-inner">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 font-sans">
                      Official Login Card
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                      Class {createdResult.student.class}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase font-sans">Student Name:</span>
                      <strong className="text-slate-800 text-sm">{createdResult.student.fullName}</strong>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase font-sans">Student Number:</span>
                      <strong className="text-indigo-900 text-sm">#{createdResult.student.studentNumber}</strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase font-sans">Security PIN:</span>
                      <span className="text-xl font-black text-emerald-700 tracking-widest">
                        {createdResult.pin}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyCredentials}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-sans text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      {copiedPin ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedPin ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 text-left flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Security Reminder:</strong> The plaintext PIN is shown once here and is not stored in plaintext on the server. Please copy or print it now.
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 justify-end pt-2">
                  {onPrintCard && (
                    <button
                      type="button"
                      onClick={() => onPrintCard(createdResult.student, createdResult.pin)}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors border border-slate-300"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Print Slip</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      handleResetForm();
                    }}
                    className="px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors border border-indigo-200"
                  >
                    + Add Another
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-sm"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              // Registration Form
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

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

                {/* Student Number */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Official Student Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={studentNumber}
                    onChange={(e) => setStudentNumber(e.target.value)}
                    placeholder="e.g. 142 or 508"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-mono text-sm focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Used by the student as their login identifier. Must be unique.
                  </p>
                </div>

                {/* Student Full Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Deniz Yılmaz"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>

                {/* Optional Custom PIN */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center justify-between">
                    <span>Security PIN (Optional)</span>
                    <span className="text-[10px] text-slate-400 font-normal lowercase">leave blank to auto-generate</span>
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      maxLength={4}
                      value={customPin}
                      onChange={(e) => setCustomPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 4821 (or leave blank)"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-mono text-sm focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    If left blank, a secure random 4-digit PIN will be generated automatically.
                  </p>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !studentNumber.trim() || !fullName.trim()}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                    <span>{isLoading ? 'Creating Account...' : 'Enroll Student'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
