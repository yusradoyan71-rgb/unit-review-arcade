/**
 * UNIT REVIEW ARCADE — BULK PIN RESET & CREDENTIAL GENERATOR (PHASE 3B)
 * 
 * Secure educator workflow to generate, hash, and deliver fresh 4-digit student login PINs
 * for classes (7A, 7B, 8A, 8B) or individual student selections.
 * 
 * SECURITY MANDATES:
 * 1. Plaintext PINs are returned ONLY ONCE upon generation and never stored in plaintext in Google Sheets.
 * 2. Revokes active student sessions on reset.
 * 3. Never alters student progress, scores, coins, achievements, or activity history.
 * 4. Provides immediate CSV download and printable slip generation.
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTeacherAuth } from '../../../context/TeacherAuthContext';
import { TeacherApiService } from '../../../services/teacherApiService';
import type { 
  RosterStudent, 
  TeacherBulkResetPinsItem 
} from '../../../types/teacher';
import type { CredentialCardItem } from './StudentCredentialCardsModal';
import { 
  X, 
  KeyRound, 
  ShieldAlert, 
  Printer, 
  Download, 
  Copy, 
  Check, 
  AlertTriangle, 
  Loader2, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface BulkResetPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  roster: RosterStudent[];
  initialClassId?: 'all' | '7A' | '7B' | '8A' | '8B';
  initialSelectedNumbers?: string[];
  onSuccess: (credentials: TeacherBulkResetPinsItem[]) => void;
  onPrintCards: (cards: CredentialCardItem[]) => void;
}

const ARCADE_LOGIN_URL = 'https://yusradoyan71-rgb.github.io/unit-review-arcade/';

export const BulkResetPinModal: React.FC<BulkResetPinModalProps> = ({
  isOpen,
  onClose,
  roster,
  initialClassId = 'all',
  initialSelectedNumbers,
  onSuccess,
  onPrintCards,
}) => {
  const { teacherSession } = useTeacherAuth();

  const [step, setStep] = useState<'select' | 'confirm' | 'credentials'>('select');
  const [selectedClass, setSelectedClass] = useState<'all' | '7A' | '7B' | '8A' | '8B'>(initialClassId);
  const [selectedStudentNumbers, setSelectedStudentNumbers] = useState<Set<string>>(() => {
    if (initialSelectedNumbers && initialSelectedNumbers.length > 0) {
      return new Set(initialSelectedNumbers);
    }
    // Default to active students
    return new Set(
      roster
        .filter((s) => s.isActive && s.class !== 'DEMO_ARCHIVE')
        .map((s) => s.studentNumber)
    );
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedCredentials, setGeneratedCredentials] = useState<TeacherBulkResetPinsItem[]>([]);
  const [copied, setCopied] = useState(false);

  // Eligible students (excluding archived demo accounts unless selected)
  const eligibleStudents = useMemo(() => {
    return roster.filter((s) => s.class !== 'DEMO_ARCHIVE');
  }, [roster]);

  // Students in currently selected class tab
  const classFilteredStudents = useMemo(() => {
    if (selectedClass === 'all') return eligibleStudents;
    return eligibleStudents.filter((s) => s.class === selectedClass);
  }, [eligibleStudents, selectedClass]);

  // The actual targeted students based on checkbox set
  const targetedStudents = useMemo(() => {
    return eligibleStudents.filter((s) => selectedStudentNumbers.has(s.studentNumber));
  }, [eligibleStudents, selectedStudentNumbers]);

  // Group targeted breakdown
  const targetedBreakdown = useMemo(() => {
    const counts: Record<string, number> = { '7A': 0, '7B': 0, '8A': 0, '8B': 0 };
    targetedStudents.forEach((s) => {
      if (counts[s.class] !== undefined) counts[s.class]++;
    });
    return counts;
  }, [targetedStudents]);

  if (!isOpen) return null;

  const handleSelectAllInClass = () => {
    const next = new Set(selectedStudentNumbers);
    classFilteredStudents.forEach((s) => next.add(s.studentNumber));
    setSelectedStudentNumbers(next);
  };

  const handleDeselectAllInClass = () => {
    const next = new Set(selectedStudentNumbers);
    classFilteredStudents.forEach((s) => next.delete(s.studentNumber));
    setSelectedStudentNumbers(next);
  };

  const handleToggleStudent = (studentNumber: string) => {
    const next = new Set(selectedStudentNumbers);
    if (next.has(studentNumber)) {
      next.delete(studentNumber);
    } else {
      next.add(studentNumber);
    }
    setSelectedStudentNumbers(next);
  };

  const handleExecuteReset = async () => {
    if (!teacherSession?.teacherToken || targetedStudents.length === 0) return;

    setIsLoading(true);
    setError(null);

    const studentNumbersToReset = targetedStudents.map((s) => s.studentNumber);

    try {
      const res = await TeacherApiService.bulkResetStudentPins(
        teacherSession.teacherToken,
        { studentNumbers: studentNumbersToReset }
      );

      if (res.success && res.credentials) {
        setGeneratedCredentials(res.credentials);
        setStep('credentials');
        onSuccess(res.credentials);
      } else {
        setError(res.error || 'Bulk PIN reset failed on the server.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error occurred during reset.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadCsv = () => {
    if (generatedCredentials.length === 0) return;
    const headers = ['Student Number', 'Full Name', 'Class', 'Grade', 'Security PIN', 'Arcade Login URL'];
    const rows = generatedCredentials.map((s) => [
      s.studentNumber,
      `"${s.fullName.replace(/"/g, '""')}"`,
      s.class,
      s.grade,
      s.pin,
      ARCADE_LOGIN_URL,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Arcade_Generated_PINs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyText = () => {
    if (generatedCredentials.length === 0) return;
    const lines = generatedCredentials.map(
      (s) => `${s.studentNumber}\t${s.fullName}\t${s.class}\t${s.pin}\t${ARCADE_LOGIN_URL}`
    );
    const text = `Student No\tFull Name\tClass\tPIN\tLogin URL\n` + lines.join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrintAllSlips = () => {
    if (generatedCredentials.length === 0) return;
    const cardItems: CredentialCardItem[] = generatedCredentials.map((c) => ({
      student: {
        studentId: c.studentId,
        studentNumber: c.studentNumber,
        fullName: c.fullName,
        grade: c.grade,
        class: c.class,
        isActive: true,
      },
      pin: c.pin,
    }));
    onPrintCards(cardItems);
    onClose();
  };

  const handleClose = () => {
    if (step === 'credentials') {
      const confirmClose = window.confirm(
        'Warning: Plaintext PINs will not be shown again once you close this window. Have you downloaded the CSV or printed the cards?'
      );
      if (!confirmClose) return;
    }
    setStep('select');
    setError(null);
    setGeneratedCredentials([]);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-4xl max-h-[92vh] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-800"
        >
          {/* Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-amber-50 via-indigo-50 to-sky-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  {step === 'credentials' ? 'Generated Student Login Credentials' : 'Bulk PIN Generator & Reset'}
                </h3>
                <p className="text-xs text-slate-500">
                  {step === 'select' && 'Select class roster or individual students to generate fresh 4-digit PINs'}
                  {step === 'confirm' && 'Review accounts before generating and hashing new PINs'}
                  {step === 'credentials' && 'One-time credential delivery — download CSV or print slips immediately'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* STEP 1: Student Selection */}
            {step === 'select' && (
              <div className="space-y-4">
                {/* Information Box */}
                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="block font-bold">Classroom Credential Generation:</strong>
                    <span>
                      Because student passwords are encrypted for privacy, the teacher dashboard does not store plaintext PINs.
                      Use this tool to generate fresh 4-digit security PINs and produce printable login cards for your classes.
                    </span>
                  </div>
                </div>

                {/* Class Tabs & Selection Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-slate-400 mr-1">View Class:</span>
                    {(['all', '7A', '7B', '8A', '8B'] as const).map((cls) => (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => setSelectedClass(cls)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                          selectedClass === cls
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {cls === 'all' ? `All (${eligibleStudents.length})` : cls}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={handleSelectAllInClass}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition-colors"
                    >
                      Select All in {selectedClass === 'all' ? 'Roster' : selectedClass}
                    </button>
                    <button
                      type="button"
                      onClick={handleDeselectAllInClass}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition-colors"
                    >
                      Deselect
                    </button>
                  </div>
                </div>

                {/* Student Selection Table */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-72 overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="sticky top-0 bg-slate-100 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
                      <tr>
                        <th className="py-2.5 px-3 w-10 text-center">
                          <input
                            type="checkbox"
                            checked={
                              classFilteredStudents.length > 0 &&
                              classFilteredStudents.every((s) => selectedStudentNumbers.has(s.studentNumber))
                            }
                            onChange={(e) => {
                              if (e.target.checked) handleSelectAllInClass();
                              else handleDeselectAllInClass();
                            }}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </th>
                        <th className="py-2.5 px-3">Student No</th>
                        <th className="py-2.5 px-3">Full Name</th>
                        <th className="py-2.5 px-3">Class</th>
                        <th className="py-2.5 px-3">Account Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                      {classFilteredStudents.map((s) => {
                        const isSelected = selectedStudentNumbers.has(s.studentNumber);
                        return (
                          <tr
                            key={s.studentNumber}
                            onClick={() => handleToggleStudent(s.studentNumber)}
                            className={`cursor-pointer transition-colors ${
                              isSelected ? 'bg-indigo-50/60 hover:bg-indigo-50' : 'hover:bg-slate-50'
                            }`}
                          >
                            <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleStudent(s.studentNumber)}
                                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                              />
                            </td>
                            <td className="py-2.5 px-3 font-bold text-slate-900">#{s.studentNumber}</td>
                            <td className="py-2.5 px-3 font-sans text-slate-800">{s.fullName}</td>
                            <td className="py-2.5 px-3 font-sans">
                              <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold text-[10px]">
                                {s.class}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-sans">
                              {s.isActive ? (
                                <span className="text-emerald-700 font-bold text-[10px] inline-flex items-center gap-1">
                                  <Check className="w-3 h-3" /> Active
                                </span>
                              ) : (
                                <span className="text-slate-400 font-bold text-[10px]">Disabled</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Selection Summary Footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700">
                      {targetedStudents.length} student{targetedStudents.length === 1 ? '' : 's'} selected:
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono text-[11px]">
                      7A: {targetedBreakdown['7A']} | 7B: {targetedBreakdown['7B']} | 8A: {targetedBreakdown['8A']} | 8B: {targetedBreakdown['8B']}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep('confirm')}
                    disabled={targetedStudents.length === 0}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-sm"
                  >
                    <span>Proceed to Review</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Confirmation Screen */}
            {step === 'confirm' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                    <span>Confirm Credential Generation for {targetedStudents.length} Students</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-amber-800 text-xs pl-1">
                    <li>A random, secure 4-digit PIN will be generated for each selected student.</li>
                    <li>PINs are immediately salted and hashed with SHA-256 in the database.</li>
                    <li>Any active student web sessions will be invalidated.</li>
                    <li><strong>Protected:</strong> Student XP, coins, monster evolutions, and activity history are strictly preserved.</li>
                    <li><strong>Important:</strong> Plaintext PINs will be returned <strong>only once</strong> on the next screen for you to download or print.</li>
                  </ul>
                </div>

                {/* Target Account Breakdown Preview */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h5 className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                    Target Accounts Preview ({targetedStudents.length}):
                  </h5>
                  <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-1">
                    {targetedStudents.map((s) => (
                      <span
                        key={s.studentNumber}
                        className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-slate-800 text-[11px] font-sans flex items-center gap-1.5 shadow-2xs"
                      >
                        <span className="font-mono font-bold text-indigo-700">#{s.studentNumber}</span>
                        <span>{s.fullName}</span>
                        <span className="text-[10px] text-slate-400">({s.class})</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('select')}
                    disabled={isLoading}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                  >
                    Back to Selection
                  </button>

                  <button
                    type="button"
                    onClick={handleExecuteReset}
                    disabled={isLoading}
                    className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-md shadow-amber-600/20 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Generating &amp; Hashing PINs...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>Generate New PINs for {targetedStudents.length} Students</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Credential Delivery & Export */}
            {step === 'credentials' && (
              <div className="space-y-4">
                {/* Success Banner */}
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-center space-y-1">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 pt-2">
                    New PINs Generated for {generatedCredentials.length} Students!
                  </h4>
                  <p className="text-xs text-slate-600">
                    Hashes have been saved to Google Sheets. Download or print credentials below.
                  </p>
                </div>

                {/* Critical One-Time Warning */}
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <strong className="block font-bold">CRITICAL WARNING — ONE-TIME DISPLAY:</strong>
                    <span>
                      These plaintext PINs are shown <strong>only once</strong> right now. They are not saved in plaintext in the database or anywhere on your computer.
                      Please <strong>Download CSV</strong> or <strong>Print Login Slips</strong> immediately before leaving this screen.
                    </span>
                  </div>
                </div>

                {/* Action Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-slate-700">
                    {generatedCredentials.length} Ready for Classroom Distribution
                  </span>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyText}
                      className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                      <span>{copied ? 'Copied!' : 'Copy Table'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadCsv}
                      className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <Download className="w-4 h-4 text-indigo-600" />
                      <span>Download CSV</span>
                    </button>

                    <button
                      type="button"
                      onClick={handlePrintAllSlips}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Print Login Cards ({generatedCredentials.length})</span>
                    </button>
                  </div>
                </div>

                {/* Generated Credentials Table */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-72 overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="sticky top-0 bg-slate-100 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
                      <tr>
                        <th className="py-2.5 px-3">Student Number</th>
                        <th className="py-2.5 px-3">Full Name</th>
                        <th className="py-2.5 px-3">Class</th>
                        <th className="py-2.5 px-3">Generated PIN</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                      {generatedCredentials.map((c) => (
                        <tr key={c.studentNumber} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-bold text-indigo-900">#{c.studentNumber}</td>
                          <td className="py-2.5 px-3 font-sans text-slate-800">{c.fullName}</td>
                          <td className="py-2.5 px-3 font-sans">
                            <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold text-[10px]">
                              {c.class}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-300 font-black text-emerald-800 text-xs tracking-widest font-mono">
                              {c.pin}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footer Exit Confirmation */}
                <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                  <span>Login URL: {ARCADE_LOGIN_URL}</span>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors"
                  >
                    Done &amp; Close
                  </button>
                </div>
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
