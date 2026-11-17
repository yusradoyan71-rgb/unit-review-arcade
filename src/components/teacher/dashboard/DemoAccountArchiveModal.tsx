/**
 * UNIT REVIEW ARCADE — DEMO ACCOUNT ARCHIVE MODAL (PHASE 3B)
 * 
 * Previews the 8 demonstration test accounts (701–704, 801–804) and their activity records.
 * Provides a non-destructive archival operation that sets accounts to inactive and tags them
 * as DEMO_ARCHIVE, isolating them from classroom statistics while preserving database relationships.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTeacherAuth } from '../../../context/TeacherAuthContext';
import { TeacherApiService } from '../../../services/teacherApiService';
import type { TeacherDemoAccountPreview } from '../../../types/teacher';
import { 
  X, 
  Archive, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2, 
  ShieldCheck, 
  Info 
} from 'lucide-react';

interface DemoAccountArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const DemoAccountArchiveModal: React.FC<DemoAccountArchiveModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { teacherSession } = useTeacherAuth();

  const [demoAccounts, setDemoAccounts] = useState<TeacherDemoAccountPreview[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !teacherSession?.teacherToken) return;

    let isMounted = true;
    setIsLoading(true);
    setError(null);
    setConfirmed(false);
    setSuccessMessage(null);

    TeacherApiService.getDemoAccountsPreview(teacherSession.teacherToken)
      .then((res) => {
        if (!isMounted) return;
        if (res.success && res.demoAccounts) {
          setDemoAccounts(res.demoAccounts);
        } else {
          setError(res.error || 'Failed to load demo accounts preview.');
        }
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Network error');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, teacherSession]);

  if (!isOpen) return null;

  const handleArchive = async () => {
    if (!teacherSession?.teacherToken || !confirmed) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await TeacherApiService.archiveDemoAccounts(teacherSession.teacherToken);
      if (res.success) {
        setSuccessMessage(res.message || 'Demo accounts safely archived.');
        onSuccess();
      } else {
        setError(res.error || 'Failed to archive demo accounts.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeDemoCount = demoAccounts.filter((a) => a.isActive && !a.isArchived).length;
  const alreadyArchivedCount = demoAccounts.filter((a) => a.isArchived || !a.isActive).length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-800"
        >
          {/* Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-600 flex items-center justify-center text-white shadow-md shadow-amber-600/20">
                <Archive className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Demo Account Archival</h3>
                <p className="text-xs text-slate-500">Safely isolate test fixtures from classroom reports</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMessage ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Demo Accounts Safely Archived</h4>
                <p className="text-xs text-slate-600">
                  {successMessage}
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Information Card */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <Info className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>How Demo Account Archival Protects Your Platform:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px] pl-1">
                    <li>
                      <strong>Zero Data Deletion:</strong> Historical attempts and answer records are preserved in Google Sheets.
                    </li>
                    <li>
                      <strong>Clean Classroom Averages:</strong> Archived accounts are tagged as <code>DEMO_ARCHIVE</code> and omitted from 7A, 7B, 8A, and 8B KPI cards and leaderboards.
                    </li>
                    <li>
                      <strong>Session Invalidation:</strong> Prevents any future logins using default credentials (<code>1234</code>).
                    </li>
                  </ul>
                </div>

                {/* Accounts Table Preview */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">Identified Demo Test Fixtures:</span>
                    <span className="text-slate-400">
                      {isLoading ? 'Checking...' : `${activeDemoCount} active • ${alreadyArchivedCount} archived`}
                    </span>
                  </div>

                  <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
                        <tr>
                          <th className="py-2.5 px-3">Student No</th>
                          <th className="py-2.5 px-3">Name</th>
                          <th className="py-2.5 px-3">Class</th>
                          <th className="py-2.5 px-3">Attempts</th>
                          <th className="py-2.5 px-3">Current Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                        {isLoading ? (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-slate-400 font-sans">
                              <Loader2 className="w-5 h-5 animate-spin mx-auto mb-1 text-indigo-600" />
                              <span>Inspecting database demo records...</span>
                            </td>
                          </tr>
                        ) : demoAccounts.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-6 text-center text-slate-400 font-sans">
                              No demo account records found in this environment.
                            </td>
                          </tr>
                        ) : (
                          demoAccounts.map((a) => (
                            <tr key={a.studentNumber} className="hover:bg-slate-50 font-sans">
                              <td className="py-2 px-3 font-mono font-bold text-indigo-900">#{a.studentNumber}</td>
                              <td className="py-2 px-3 text-slate-800">{a.fullName}</td>
                              <td className="py-2 px-3">
                                <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[10px]">
                                  {a.class}
                                </span>
                              </td>
                              <td className="py-2 px-3 font-mono text-slate-600">{a.attemptsCount} attempt(s)</td>
                              <td className="py-2 px-3">
                                {a.isArchived ? (
                                  <span className="inline-flex items-center gap-1 text-slate-500 font-bold text-[10px]">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" /> Archived
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-amber-700 font-bold text-[10px]">
                                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Active Demo
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Explicit Confirmation Checkbox */}
                {activeDemoCount > 0 && (
                  <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={confirmed}
                      onChange={(e) => setConfirmed(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                    />
                    <span>
                      <strong>I confirm this action:</strong> Safely archive these demo accounts and isolate all test data from classroom reports.
                    </span>
                  </label>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          {!successMessage && (
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleArchive}
                disabled={isSubmitting || !confirmed || activeDemoCount === 0}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Archive className="w-4 h-4" />}
                <span>{isSubmitting ? 'Archiving...' : `Archive ${activeDemoCount} Demo Accounts`}</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
