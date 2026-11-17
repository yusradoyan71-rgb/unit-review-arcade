/**
 * UNIT REVIEW ARCADE — CURRICULUM SYNC MODAL (PHASE 9D)
 * Version: 9.4.0
 * 
 * Creative Campus Professional Educator Redesign.
 * Provides preview and explicit confirmation before synchronizing local arcade units
 * and activities to the authoritative backend Google Sheets Curriculum catalog.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useArcade } from '../../../context/ArcadeContext';
import { useTeacherAuth } from '../../../context/TeacherAuthContext';
import { TeacherApiService } from '../../../services/teacherApiService';
import type { CurriculumPublishItem } from '../../../types/teacher';
import { 
  X, 
  UploadCloud, 
  AlertTriangle, 
  ShieldCheck
} from 'lucide-react';

interface CurriculumSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (publishedCount: number) => void;
}

export const CurriculumSyncModal: React.FC<CurriculumSyncModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { data, addToast } = useArcade();
  const { teacherSession } = useTeacherAuth();

  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Compile authoritative activities from client data
  const compileCurriculumItems = (): CurriculumPublishItem[] => {
    const items: CurriculumPublishItem[] = [];
    const grades: Array<'grade-7' | 'grade-8'> = ['grade-7', 'grade-8'];

    grades.forEach((gId) => {
      const units = data.units[gId] || [];
      units.forEach((unit) => {
        const activities = unit.activities || [];
        activities.forEach((act) => {
          items.push({
            gradeId: gId,
            unitId: unit.id,
            unitTitle: unit.title,
            activityId: act.id,
            activityTitle: act.title,
            gameType: act.gameType,
            totalQuestions: Array.isArray(act.questions) ? act.questions.length : 10,
            contentVersion: '1.0.0',
            isPublished: true,
          });
        });
      });
    });

    return items;
  };

  const previewItems = compileCurriculumItems();

  const handlePublish = async () => {
    if (!teacherSession?.teacherToken) {
      setError('Active teacher authentication is required.');
      return;
    }

    if (previewItems.length === 0) {
      setError('No curriculum activities detected to publish.');
      return;
    }

    setIsPublishing(true);
    setError(null);

    try {
      const res = await TeacherApiService.publishCurriculum(
        teacherSession.teacherToken,
        previewItems
      );

      if (res.success) {
        const count = res.publishedCount || previewItems.length;
        addToast(`Successfully published ${count} activities to Curriculum catalog!`, 'success');
        onSuccess(count);
        onClose();
      } else {
        setError(res.error || 'Failed to publish curriculum to backend.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network failure during publish');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl max-h-[88vh] bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col text-slate-800 overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-xs">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bubble text-lg font-bold text-slate-900">
                  PUBLISH CURRICULUM CATALOG
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Authoritative Dynamic Content Synchronization
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={isPublishing}
              className="p-2.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Info Banner */}
          <div className="p-4 bg-indigo-50/60 border-b border-indigo-100 text-xs text-indigo-950 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 shrink-0 text-indigo-600 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-indigo-900">
                Trusted Curriculum Verification
              </p>
              <p className="text-slate-600 leading-relaxed text-[11px] font-medium">
                This action publishes the current active units and activities to the <code className="bg-white border border-indigo-200 px-1.5 py-0.5 rounded text-indigo-700 font-mono font-bold">Curriculum</code> sheet in your Google Spreadsheet. The backend uses this catalog to dynamically calculate authoritative student progress percentages without hardcoded numbers.
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="m-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Preview Table */}
          <div className="p-5 overflow-y-auto flex-1 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Catalog Preview ({previewItems.length} Activities Found):</span>
              <span className="text-[11px] font-mono text-emerald-700 font-bold">All Grade 7 & Grade 8 Units</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase text-[10px] font-bold">
                    <th className="py-2.5 px-3.5">Grade</th>
                    <th className="py-2.5 px-3">Unit</th>
                    <th className="py-2.5 px-3">Activity Title</th>
                    <th className="py-2.5 px-2">Type</th>
                    <th className="py-2.5 px-2 text-center">Questions</th>
                    <th className="py-2.5 px-3.5">Version</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {previewItems.slice(0, 50).map((act) => (
                    <tr key={act.activityId} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-3.5 font-bold text-slate-700">
                        {act.gradeId === 'grade-7' ? 'Grade 7' : 'Grade 8'}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 font-medium truncate max-w-[120px]">
                        {act.unitTitle}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-800 truncate max-w-[200px]">
                        {act.activityTitle}
                      </td>
                      <td className="py-2.5 px-2 font-mono text-[11px] text-indigo-600 font-semibold">
                        {act.gameType}
                      </td>
                      <td className="py-2.5 px-2 text-center text-slate-700 font-bold font-mono">
                        {act.totalQuestions}
                      </td>
                      <td className="py-2.5 px-3.5 font-mono text-[10px] text-slate-400">
                        {act.contentVersion}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="p-4 sm:p-5 bg-slate-50/90 border-t border-slate-200 flex items-center justify-between gap-3">
            <span className="text-[11px] text-slate-400 font-medium">
              Non-destructive: Student attempts, answers, and sessions are fully preserved.
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isPublishing}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 disabled:opacity-40 transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handlePublish}
                disabled={isPublishing || previewItems.length === 0}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all"
              >
                {isPublishing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Publishing Catalog...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4" />
                    <span>Confirm & Publish {previewItems.length} Activities</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
