import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTeacherAuth } from '../../../context/TeacherAuthContext';
import { TeacherApiService } from '../../../services/teacherApiService';
import {
  KeyRound,
  ShieldCheck,
  AlertTriangle,
  X,
  Loader2,
  CheckCircle2,
  Users,
  Sparkles,
} from 'lucide-react';

interface SetDefaultPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  rosterCount: number;
  onSuccess: () => void;
}

export const SetDefaultPinModal: React.FC<SetDefaultPinModalProps> = ({
  isOpen,
  onClose,
  rosterCount,
  onSuccess,
}) => {
  const { teacherSession } = useTeacherAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'preview' | 'success'>('preview');
  const [previewCount, setPreviewCount] = useState<number>(rosterCount);
  const [confirmedCount, setConfirmedCount] = useState<number | null>(null);

  // When modal opens, query the backend for preview count of eligible real students
  useEffect(() => {
    if (!isOpen) {
      setStep('preview');
      setError(null);
      setIsLoading(false);
      return;
    }

    setPreviewCount(rosterCount);
    if (!teacherSession?.teacherToken) return;

    let isMounted = true;
    TeacherApiService.setAllStudentPinsDefault(teacherSession.teacherToken, false, '1234')
      .then((res) => {
        if (isMounted && res.success && typeof res.count === 'number') {
          setPreviewCount(res.count);
        }
      })
      .catch(() => {
        // Fall back to rosterCount
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, rosterCount, teacherSession?.teacherToken]);

  if (!isOpen) return null;

  const handleExecute = async () => {
    if (!teacherSession?.teacherToken) {
      setError('Teacher authentication required.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await TeacherApiService.setAllStudentPinsDefault(
        teacherSession.teacherToken,
        true,
        '1234'
      );

      if (res.success && res.executed) {
        setConfirmedCount(res.count || previewCount);
        setStep('success');
        onSuccess();
      } else {
        setError(res.error || 'Failed to update student PINs on the server.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-purple-700 to-indigo-700 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-xs">
                <KeyRound className="w-5 h-5 text-purple-100" />
              </div>
              <div>
                <h3 className="text-base font-bold">Set All Student PINs to 1234</h3>
                <p className="text-xs text-purple-200">
                  One-time administrative credential reset
                </p>
              </div>
            </div>
            {!isLoading && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            {error && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold block">Error</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {step === 'preview' && (
              <>
                {/* Confirmation Box */}
                <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                      Target Login PIN
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-purple-600 text-white font-mono font-bold text-sm tracking-widest shadow-2xs">
                      1234
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-purple-200/60">
                    <span className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-purple-600" />
                      Affected Real Students
                    </span>
                    <span className="text-sm font-extrabold text-purple-950">
                      {previewCount} Students
                    </span>
                  </div>
                </div>

                {/* Safety Assurances */}
                <div className="space-y-2.5 text-xs text-slate-600">
                  <p className="font-semibold text-slate-800">
                    Safety & Data Preservation Guarantees:
                  </p>
                  <ul className="space-y-1.5 list-disc list-inside text-slate-600">
                    <li>
                      <strong className="text-slate-700">All student records preserved:</strong> Student numbers, names, classes, XP, coins, achievements, monsters, and tracking data remain 100% intact.
                    </li>
                    <li>
                      <strong className="text-slate-700">Cryptographically hashed:</strong> Salted SHA-256 hashes are recalculated using the secure server pepper. No plaintext PINs are stored in Google Sheets.
                    </li>
                    <li>
                      <strong className="text-slate-700">Active sessions revoked:</strong> Previous student sessions are cleared so students can log in freshly with PIN <code className="px-1 py-0.5 bg-slate-100 rounded text-purple-700 font-bold">1234</code>.
                    </li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleExecute}
                    disabled={isLoading || previewCount === 0}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-md shadow-purple-600/20 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Updating {previewCount} Accounts...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Confirm & Set All to 1234</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}

            {step === 'success' && (
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-base font-bold text-slate-900">
                    All {confirmedCount || previewCount} Student PINs Updated!
                  </h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Every real student account can now log in using their existing Student Number and PIN{' '}
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-mono font-bold rounded">
                      1234
                    </span>
                    .
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs text-slate-600 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>How students log in:</span>
                  </div>
                  <p className="text-slate-600 pl-5">
                    1. Go to the student login screen.<br />
                    2. Enter student number (e.g. 101, 102...).<br />
                    3. Enter PIN: <strong className="text-purple-700 font-mono">1234</strong>.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors shadow-sm"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

