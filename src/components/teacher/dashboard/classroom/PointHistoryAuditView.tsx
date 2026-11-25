/**
 * UNIT REVIEW ARCADE — POINT HISTORY & AUDIT VIEW (PHASE 3.4B)
 * 
 * Reversible append-only transaction ledger for classroom points.
 * 
 * KEY FEATURES:
 * 1. Filter by class, student, and transaction type.
 * 2. Privacy Mode Shield: Masks negative reasons & private notes on projector screen.
 * 3. Append-Only Reversals: Teachers can reverse transactions with clear audit feedback.
 * 4. Double-Reversal Prevention: Blocks duplicate reversals and displays audit status.
 */

import React, { useState, useEffect, useCallback } from 'react';
import type { 
  ClassroomPointTransaction, 
  ClassroomStudentSummary,
  TeacherClassroomHistoryFilter 
} from '../../../../types/classroomPoints';
import { TeacherApiService } from '../../../../services/teacherApiService';
import { 
  Search, 
  RotateCcw, 
  AlertTriangle, 
  Clock, 
  EyeOff, 
  RefreshCw,
  FileText
} from 'lucide-react';

interface PointHistoryAuditViewProps {
  teacherToken: string;
  isProjectorPrivacyMode: boolean;
  students: ClassroomStudentSummary[];
  onReversalSuccess: () => void;
  selectedClassId: 'all' | '7A' | '7B' | '8A' | '8B';
  onSelectClassId: (classId: 'all' | '7A' | '7B' | '8A' | '8B') => void;
  initialSearchTerm?: string;
  onClearInitialSearchTerm?: () => void;
}

export const PointHistoryAuditView: React.FC<PointHistoryAuditViewProps> = ({
  teacherToken,
  isProjectorPrivacyMode,
  students,
  onReversalSuccess,
  selectedClassId,
  onSelectClassId,
  initialSearchTerm,
  onClearInitialSearchTerm,
}) => {
  const [transactions, setTransactions] = useState<ClassroomPointTransaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm || '');

  // Synchronize when initialSearchTerm changes from outside
  useEffect(() => {
    if (initialSearchTerm !== undefined) {
      setSearchTerm(initialSearchTerm);
    }
  }, [initialSearchTerm]);

  // Reversal Modal State
  const [reversingTx, setReversingTx] = useState<ClassroomPointTransaction | null>(null);
  const [reversalReason, setReversalReason] = useState<string>('');
  const [isReversing, setIsReversing] = useState<boolean>(false);
  const [reversalError, setReversalError] = useState<string | null>(null);

  // Student Map for quick lookup
  const studentMap = new Map<string, ClassroomStudentSummary>();
  students.forEach((s) => studentMap.set(s.studentNumber, s));

  // Load History
  const loadHistory = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const filter: TeacherClassroomHistoryFilter = {
        classId: selectedClassId === 'all' ? undefined : selectedClassId,
        limit: 100,
      };
      const response = await TeacherApiService.getClassroomHistory(teacherToken, filter);
      if (response.success && response.transactions) {
        setTransactions(response.transactions);
      } else {
        setErrorMessage(response.error || 'Failed to load transaction history.');
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Network error.');
    } finally {
      setIsLoading(false);
    }
  }, [teacherToken, selectedClassId]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Handle Reversal Action
  const handleConfirmReversal = async () => {
    if (!reversingTx) return;

    setIsReversing(true);
    setReversalError(null);

    try {
      const response = await TeacherApiService.revertClassroomPointTransaction({
        teacherToken,
        transactionId: reversingTx.transactionId,
        reason: reversalReason.trim() || undefined,
      });

      if (response.success) {
        setReversingTx(null);
        setReversalReason('');
        await loadHistory();
        onReversalSuccess();
      } else {
        setReversalError(response.error || 'Reversal failed.');
      }
    } catch (err) {
      setReversalError(err instanceof Error ? err.message : 'Network error.');
    } finally {
      setIsReversing(false);
    }
  };

  // Filtered transactions
  const filteredTransactions = transactions.filter((tx) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const student = studentMap.get(tx.studentNumber);
    const nameMatch = student?.fullName.toLowerCase().includes(term);
    const numMatch = tx.studentNumber.toLowerCase().includes(term);
    const catMatch = tx.categoryName.toLowerCase().includes(term);
    return nameMatch || numMatch || catMatch;
  });

  // Format date helper
  const formatDate = (isoString: string) => {
    if (!isoString) return 'Just now';
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4">
      {/* Top Filter & Class Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Class Selection Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['all', '7A', '7B', '8A', '8B'] as const).map((cId) => (
            <button
              key={cId}
              type="button"
              onClick={() => onSelectClassId(cId)}
              className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedClassId === cId
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {cId === 'all' ? 'All Classes' : `Class ${cId}`}
            </button>
          ))}
        </div>

        {/* Search & Refresh */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Active Filter Pill if filtered by student */}
          {searchTerm && studentMap.has(searchTerm.trim()) && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold shrink-0 animate-fade-in">
              <span>{studentMap.get(searchTerm.trim())?.fullName} (#{searchTerm.trim()})</span>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  if (onClearInitialSearchTerm) onClearInitialSearchTerm();
                }}
                className="w-4 h-4 rounded-full bg-indigo-200 hover:bg-indigo-300 text-indigo-900 flex items-center justify-center text-[10px] ml-0.5"
                title="Clear student filter"
              >
                &times;
              </button>
            </div>
          )}

          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search student or category..."
              className="w-full min-h-[44px] pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  if (onClearInitialSearchTerm) onClearInitialSearchTerm();
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold p-1"
                title="Clear search"
              >
                &times;
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={loadHistory}
            disabled={isLoading}
            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
            title="Refresh history"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Privacy Mode Info Banner */}
      {isProjectorPrivacyMode && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2.5">
          <EyeOff className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Projector Privacy Shield Active:</strong> Sensitive behavioral notes and negative deductions are shielded on smartboard screens.
          </span>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Ledger Table */}
      <div className="rounded-2xl bg-white border border-slate-200/90 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-600" />
            <p className="font-bold text-xs">Loading classroom transaction ledger...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="font-bold text-slate-700 text-sm">No transactions found</p>
            <p className="text-xs text-slate-400 mt-1">
              Classroom points awarded to students will appear here as an append-only audit trail.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-3">Class</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-3 text-center">Points</th>
                  <th className="py-3 px-4">Note / Audit</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredTransactions.map((tx) => {
                  const student = studentMap.get(tx.studentNumber);
                  const isCorrection = tx.categoryType === 'correction';
                  const isNegative = tx.categoryType === 'negative';
                  const isReversed = !isCorrection && filteredTransactions.some(
                    (other) => other.categoryType === 'correction' && other.originalTxId === tx.transactionId
                  );

                  return (
                    <tr
                      key={tx.transactionId}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isReversed ? 'opacity-60 bg-slate-50/40 line-through' : ''
                      }`}
                    >
                      {/* Timestamp */}
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatDate(tx.timestamp)}</span>
                        </div>
                      </td>

                      {/* Student Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0">
                            {student?.fullName ? student.fullName.charAt(0).toUpperCase() : '#'}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">
                              {student?.fullName || `Student #${tx.studentNumber}`}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              #{tx.studentNumber}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Class */}
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-bold text-slate-700">
                          {tx.studentClass}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className={`font-bold ${
                          isCorrection ? 'text-amber-700' : isNegative ? 'text-rose-700' : 'text-slate-800'
                        }`}>
                          {tx.categoryName}
                        </span>
                      </td>

                      {/* Gross Points */}
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-black ${
                            isCorrection
                              ? 'bg-amber-100 text-amber-800'
                              : tx.grossPoints > 0
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {tx.grossPoints > 0 ? `+${tx.grossPoints}` : tx.grossPoints}
                        </span>
                      </td>

                      {/* Note / Audit Trail (Shielded in Privacy Mode) */}
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                        {isProjectorPrivacyMode && (isNegative || isCorrection) ? (
                          <span className="text-slate-400 italic text-[11px]">
                            [Protected in Privacy Mode]
                          </span>
                        ) : (
                          tx.note || <span className="text-slate-300 italic">—</span>
                        )}
                      </td>

                      {/* Action: Reversal */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        {isCorrection ? (
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold">
                            Reversal Entry
                          </span>
                        ) : isReversed ? (
                          <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                            Reversed
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setReversingTx(tx);
                              setReversalReason('');
                              setReversalError(null);
                            }}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition-all font-bold text-xs flex items-center gap-1 ml-auto"
                            title="Reverse transaction"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Reverse</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transaction Reversal Confirmation Modal */}
      {reversingTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div 
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm">Reverse Classroom Transaction</h3>
              </div>
              <button
                type="button"
                onClick={() => setReversingTx(null)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs">
              {reversalError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{reversalError}</span>
                </div>
              )}

              <p className="text-slate-600">
                You are about to reverse the following transaction. A transparent correction row will be appended to the ledger to restore the student's balance safely.
              </p>

              {/* Transaction details card */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">Student:</span>
                  <span className="font-bold text-slate-800">
                    {studentMap.get(reversingTx.studentNumber)?.fullName} (#{reversingTx.studentNumber})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">Category:</span>
                  <span className="font-bold text-slate-800">{reversingTx.categoryName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">Points Awarded:</span>
                  <span className={`font-black ${reversingTx.grossPoints > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {reversingTx.grossPoints > 0 ? `+${reversingTx.grossPoints}` : reversingTx.grossPoints}
                  </span>
                </div>
              </div>

              {/* Optional Reason */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Reason for Reversal (Optional)</label>
                <input
                  type="text"
                  value={reversalReason}
                  onChange={(e) => setReversalReason(e.target.value)}
                  placeholder="e.g., Misclick during classroom discussion..."
                  className="w-full min-h-[44px] px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setReversingTx(null)}
                disabled={isReversing}
                className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReversal}
                disabled={isReversing}
                className="min-h-[44px] px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm"
              >
                {isReversing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing Reversal...</span>
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Confirm Reversal</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
