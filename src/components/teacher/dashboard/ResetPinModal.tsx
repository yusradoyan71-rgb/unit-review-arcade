/**
 * UNIT REVIEW ARCADE — RESET PIN MODAL (PHASE 3B)
 * 
 * Allows teachers to securely generate or assign a new 4-digit PIN for a student.
 * Immediately clears brute-force lockouts and revokes active web sessions.
 * Displays the new PIN once with copy and print capabilities.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTeacherAuth } from '../../../context/TeacherAuthContext';
import { TeacherApiService } from '../../../services/teacherApiService';
import type { StudentManagementRecord } from '../../../types/teacher';
import { 
  X, 
  KeyRound, 
  Check, 
  Copy, 
  AlertCircle, 
  Loader2, 
  ShieldAlert, 
  Sparkles 
} from 'lucide-react';

interface ResetPinModalProps {
  student: StudentManagementRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (studentNumber: string, newPin: string) => void;
}

export const ResetPinModal: React.FC<ResetPinModalProps> = ({
  student,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { teacherSession } = useTeacherAuth();

  const [useCustomPin, setUseCustomPin] = useState(false);
  const [customPin, setCustomPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Success result
  const [newPinResult, setNewPinResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !student) return null;

  const handleReset = () => {
    setUseCustomPin(false);
    setCustomPin('');
    setError(null);
    setNewPinResult(null);
    setCopied(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherSession?.teacherToken) {
      setError('Teacher authentication required.');
      return;
    }

    const cleanPin = customPin.trim();
    if (useCustomPin) {
      if (!/^\d{4}$/.test(cleanPin)) {
        setError('PIN must be exactly 4 numeric digits (0000-9999).');
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await TeacherApiService.resetStudentPin(
        teacherSession.teacherToken,
        student.studentNumber,
        useCustomPin ? cleanPin : undefined
      );

      if (res.success && res.newPin) {
        setNewPinResult(res.newPin);
        onSuccess(student.studentNumber, res.newPin);
      } else {
        setError(res.error || 'Failed to reset PIN.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!newPinResult) return;
    const text = `Unit Review Arcade — Student Login\nStudent: ${student.fullName} (Class ${student.class})\nStudent No: ${student.studentNumber}\nNew PIN: ${newPinResult}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Reset Student PIN</h3>
                <p className="text-xs text-slate-500 font-mono">
                  #{student.studentNumber} • {student.fullName}
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

          {/* Body */}
          <div className="p-6">
            {newPinResult ? (
              // Success Screen
              <div className="space-y-5 text-center">
                <div className="w-14 h-14 mx-auto rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
                  <Check className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">PIN Reset Successfully!</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Student #{student.studentNumber} can now sign in using this new PIN.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border-2 border-indigo-200 text-center space-y-2 shadow-inner">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-sans">
                    New Security PIN
                  </span>
                  <div className="text-3xl font-black font-mono text-emerald-700 tracking-widest">
                    {newPinResult}
                  </div>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? 'Copied to Clipboard!' : 'Copy Credentials'}</span>
                    </button>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              // Reset Form
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Session Invalidation Warning */}
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    Resetting will immediately clear any brute-force lockouts and revoke all active web sessions for this student.
                  </span>
                </div>

                {/* PIN Mode Selection */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    PIN Assignment Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setUseCustomPin(false)}
                      className={`p-3 rounded-2xl text-left border transition-all ${
                        !useCustomPin
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-900 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 mb-1 text-indigo-600" />
                      <strong className="block text-xs font-bold">Auto-Generate</strong>
                      <span className="text-[10px] text-slate-500">Random 4-digit PIN</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setUseCustomPin(true)}
                      className={`p-3 rounded-2xl text-left border transition-all ${
                        useCustomPin
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-900 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <KeyRound className="w-4 h-4 mb-1 text-indigo-600" />
                      <strong className="block text-xs font-bold">Custom PIN</strong>
                      <span className="text-[10px] text-slate-500">Teacher assigned</span>
                    </button>
                  </div>
                </div>

                {/* Custom PIN Input */}
                {useCustomPin && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Enter 4-Digit PIN *
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={customPin}
                      onChange={(e) => setCustomPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 5291"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-center text-lg font-black tracking-widest text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all"
                    />
                  </div>
                )}

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
                    disabled={isLoading || (useCustomPin && customPin.length !== 4)}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                    <span>{isLoading ? 'Resetting PIN...' : 'Confirm Reset'}</span>
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
