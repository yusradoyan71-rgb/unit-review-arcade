/**
 * UNIT REVIEW ARCADE — ARCHIVE QUESTION MODAL (PHASE 2)
 * Version: 2.0.0
 * 
 * Safe, non-destructive confirmation dialog for archiving question bank items.
 * Explains that historical student telemetry and logs remain 100% intact.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Archive, AlertTriangle, X, Loader2, ShieldCheck } from 'lucide-react';
import type { QuestionBankItem } from '../../../../types/questionBank';

interface ArchiveQuestionModalProps {
  isOpen: boolean;
  question: QuestionBankItem | null;
  onClose: () => void;
  onConfirmArchive: (questionId: string) => Promise<void>;
}

export const ArchiveQuestionModal: React.FC<ArchiveQuestionModalProps> = ({
  isOpen,
  question,
  onClose,
  onConfirmArchive,
}) => {
  const [isArchiving, setIsArchiving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !question) return null;

  const handleConfirm = async () => {
    setIsArchiving(true);
    setError(null);

    try {
      await onConfirmArchive(question.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to archive question');
    } finally {
      setIsArchiving(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-4 bg-amber-50 border-b border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Archive className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-950">Archive Question</h3>
                <p className="text-[11px] text-amber-700">Non-destructive soft delete</p>
              </div>
            </div>
            {!isArchiving && (
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg text-amber-800/60 hover:text-amber-900 hover:bg-amber-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Body */}
          <div className="p-6 space-y-4 text-xs">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Question to Archive:
              </span>
              <p className="font-semibold text-slate-900 line-clamp-2">
                {question.prompt}
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500 font-mono">
                <span>ID: {question.id}</span>
                <span>•</span>
                <span className="capitalize">{question.questionType.replace('_', ' ')}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-900 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="block text-[11px] text-emerald-950">Data Safety Assurance:</strong>
                <p className="text-[11px] leading-relaxed text-emerald-800">
                  Archiving removes this question from active student game pools, but strictly preserves all historical student answer logs, diagnostic scores, and achievements in the database.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isArchiving}
              className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isArchiving}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold flex items-center gap-1.5 shadow-sm transition-colors disabled:opacity-50"
            >
              {isArchiving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Archiving...</span>
                </>
              ) : (
                <>
                  <Archive className="w-4 h-4" />
                  <span>Confirm Archive</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

