/**
 * UNIT REVIEW ARCADE — SAFE IMPORT ROLLBACK MODAL (PHASE 3)
 * Version: 3.0.0
 * 
 * Provides safe, 1-click rollback of the last bulk question import without
 * affecting previously existing questions or built-in curriculum items.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RotateCcw,
  X,
  AlertTriangle,
  Loader2,
  FileSpreadsheet,
  ShieldCheck,
} from 'lucide-react';
import type { LastImportReceipt } from './BulkImportModal';
import { LAST_IMPORT_STORAGE_KEY } from './BulkImportModal';
import { TeacherApiService } from '../../../../services/teacherApiService';
import { useTeacherAuth } from '../../../../context/TeacherAuthContext';

interface RollbackImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRollbackSuccess: (rolledBackCount: number) => void;
  lastImport: LastImportReceipt | null;
}

export const RollbackImportModal: React.FC<RollbackImportModalProps> = ({
  isOpen,
  onClose,
  onRollbackSuccess,
  lastImport,
}) => {
  const { teacherSession } = useTeacherAuth();
  const [isRollingBack, setIsRollingBack] = useState<boolean>(false);
  const [rollbackError, setRollbackError] = useState<string | null>(null);

  if (!isOpen || !lastImport) return null;

  const handleConfirmRollback = async () => {
    if (!teacherSession?.teacherToken) return;

    setIsRollingBack(true);
    setRollbackError(null);

    try {
      const res = await TeacherApiService.rollbackQuestionImport(
        teacherSession.teacherToken,
        lastImport.batchId,
        lastImport.questionIds
      );

      if (!res.success) {
        throw new Error(res.error || 'Failed to rollback import batch.');
      }

      // Clear the receipt from local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem(LAST_IMPORT_STORAGE_KEY);
      }

      onRollbackSuccess(res.rolledBackCount ?? lastImport.count);
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Rollback failed';
      setRollbackError(msg);
    } finally {
      setIsRollingBack(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-5 text-slate-800"
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-xs">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Rollback Last Question Import
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Undo the recent question batch safely.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isRollingBack}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Import Details Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-700 font-medium">
              <span className="flex items-center gap-1.5 text-slate-500">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Imported File:</span>
              </span>
              <span className="font-bold text-slate-900">{lastImport.filename}</span>
            </div>

            <div className="flex items-center justify-between text-slate-700 font-medium">
              <span className="text-slate-500">Import Date:</span>
              <span className="font-semibold">{new Date(lastImport.timestamp).toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between text-slate-700 font-medium">
              <span className="text-slate-500">Questions Added:</span>
              <span className="font-black text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full">
                {lastImport.count} questions
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-700 font-medium pt-1 border-t border-slate-200/60">
              <span className="text-slate-400 font-mono text-[10px]">Batch ID:</span>
              <span className="font-mono text-[10px] text-slate-500">{lastImport.batchId}</span>
            </div>
          </div>

          {/* Safety Guarantee Notice */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 space-y-1.5">
            <div className="flex items-center gap-2 font-black text-emerald-950">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Strict Data Isolation Guarantee:</span>
            </div>
            <p className="text-emerald-800 leading-relaxed text-[11px]">
              Only the <strong>{lastImport.count} questions</strong> added in this specific batch will be removed. All previously existing custom questions, student attempt logs, PINs, XP, and the 1,206 built-in curriculum questions remain 100% untouched.
            </p>
          </div>

          {/* Error Banner if any */}
          {rollbackError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{rollbackError}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isRollingBack}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirmRollback}
              disabled={isRollingBack}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-md disabled:opacity-40 flex items-center gap-2 transition-all active:scale-95"
            >
              {isRollingBack ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Rolling back...</span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>Confirm Rollback ({lastImport.count} questions)</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
