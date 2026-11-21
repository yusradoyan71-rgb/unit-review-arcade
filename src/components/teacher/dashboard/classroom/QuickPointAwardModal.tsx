/**
 * UNIT REVIEW ARCADE — QUICK POINT AWARD MODAL (PHASE 3.4B)
 * 
 * Interactive smartboard drawer/modal for awarding positive & negative classroom points.
 * 
 * KEY SECURITY & ACCURACY MANDATES:
 * 1. Strict Idempotency Key Reuse on Retries: Never generate a fresh key on retry.
 * 2. Disabled Repeat Submission: Button disabled and spinner shown while request in-flight.
 * 3. Privacy Shield: Negative feedback displayed with privacy reminder when on smartboard.
 * 4. Post-confirmation Refresh: Only updates points upon successful backend confirmation.
 */

import React, { useState, useRef, useEffect } from 'react';
import type { 
  ClassroomCategory, 
  ClassroomStudentSummary, 
  TeacherAwardPointsResponse 
} from '../../../../types/classroomPoints';
import { TeacherApiService } from '../../../../services/teacherApiService';
import { sounds } from '../../../../services/soundEffects';
import { 
  X, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  MessageSquare, 
  Star,
  ShieldAlert
} from 'lucide-react';

interface QuickPointAwardModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherToken: string;
  selectedStudents: ClassroomStudentSummary[];
  categories: ClassroomCategory[];
  isProjectorPrivacyMode: boolean;
  onAwardSuccess: (response: TeacherAwardPointsResponse) => void;
}

export const QuickPointAwardModal: React.FC<QuickPointAwardModalProps> = ({
  isOpen,
  onClose,
  teacherToken,
  selectedStudents,
  categories,
  isProjectorPrivacyMode,
  onAwardSuccess,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<TeacherAwardPointsResponse | null>(null);

  // STABLE IDEMPOTENCY KEY REF:
  // Preserved across retries so any retry will NOT duplicate successfully recorded transactions.
  const idempotencyKeyRef = useRef<string>('');

  // Helper to generate a new unique batch key
  const generateNewBatchKey = () => {
    return `batch_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  };

  // Reset or generate new key whenever the modal opens with new selection
  useEffect(() => {
    if (isOpen) {
      setSelectedCategoryId('');
      setNote('');
      setIsSubmitting(false);
      setErrorMessage(null);
      setSuccessInfo(null);
      // Generate a fresh idempotency key for this award session
      idempotencyKeyRef.current = generateNewBatchKey();
    }
  }, [isOpen]);

  if (!isOpen || selectedStudents.length === 0) return null;

  // Split categories into active positive and negative
  const activeCategories = categories.filter((c) => c.isActive);
  const positiveCategories = activeCategories.filter((c) => c.type === 'positive');
  const negativeCategories = activeCategories.filter((c) => c.type === 'negative');

  const selectedCategory = activeCategories.find((c) => c.id === selectedCategoryId);

  // Submission handler with idempotency key preservation
  const handleAward = async () => {
    if (!selectedCategoryId) {
      setErrorMessage('Please select a behavior category.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const studentNumbers = selectedStudents.map((s) => s.studentNumber);

    try {
      // Re-use the existing idempotencyKeyRef.current (crucial for retries!)
      const currentKey = idempotencyKeyRef.current || generateNewBatchKey();
      idempotencyKeyRef.current = currentKey;

      const response = await TeacherApiService.awardClassroomPoints({
        teacherToken,
        studentNumbers,
        categoryId: selectedCategoryId,
        idempotencyKey: currentKey,
        note: note.trim() || undefined,
      });

      if (response.success) {
        setSuccessInfo(response);
        // Play positive sound chime if positive category
        if (selectedCategory?.type === 'positive') {
          sounds.playSuccess();
        } else {
          sounds.playTap();
        }

        // Notify parent to refresh balances after confirmation
        setTimeout(() => {
          onAwardSuccess(response);
          onClose();
        }, 800);
      } else {
        setErrorMessage(response.error || 'Failed to award points. Click Retry to try again.');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Network error.';
      setErrorMessage(`Award failed: ${message}. Click Retry to resume without duplication.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 font-black flex items-center justify-center text-base shadow-sm">
              <Sparkles className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Award Classroom Points
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-[11px] font-bold text-amber-300">
                  {selectedStudents.length} {selectedStudents.length === 1 ? 'student' : 'students'}
                </span>
              </h2>
              <p className="text-xs text-indigo-200 truncate max-w-md">
                {selectedStudents.map((s) => s.fullName).join(', ')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all disabled:opacity-50"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Success Banner */}
          {successInfo && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 animate-fade-in">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-sm">
                  Points awarded successfully!
                </p>
                <p className="text-xs text-emerald-700">
                  {successInfo.awardedCount} student(s) updated. Refreshing balances...
                </p>
              </div>
            </div>
          )}

          {/* Error Banner with Retry Guidance */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 animate-shake">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-xs">{errorMessage}</p>
                <p className="text-[11px] text-rose-700">
                  Retry uses the same idempotency key ({idempotencyKeyRef.current}) to safely prevent duplicate points.
                </p>
              </div>
            </div>
          )}

          {/* Section 1: Positive Categories (+1 to +3) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-emerald-500 text-emerald-600" />
                <span>Positive Reinforcement (+1 to +3)</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Select one</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {positiveCategories.map((cat) => {
                const isSelected = selectedCategoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`min-h-[52px] p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400 shadow-sm'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="text-lg shrink-0">{cat.icon || '🌟'}</span>
                      <span className="text-xs font-bold text-slate-800 truncate leading-tight">
                        {cat.name}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs shrink-0">
                      +{cat.defaultPoints}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Negative Categories (-1) */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>Behavior Corrections (-1)</span>
              </h3>
              {isProjectorPrivacyMode && (
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3 text-amber-600" />
                  <span>Privacy Mode Active</span>
                </span>
              )}
            </div>

            {isProjectorPrivacyMode && (
              <p className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                🔒 Negative points reduce net balance but will not be shown on the projector screen or play loud alerts.
              </p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {negativeCategories.map((cat) => {
                const isSelected = selectedCategoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`min-h-[52px] p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-400 shadow-sm'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="text-lg shrink-0">{cat.icon || '⚠️'}</span>
                      <span className="text-xs font-bold text-slate-800 truncate leading-tight">
                        {cat.name}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-black text-xs shrink-0">
                      {cat.defaultPoints}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Optional Teacher Note */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
              <span>Private Teacher Note (Optional)</span>
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g., Great contribution during Unit 4 speaking practice..."
              disabled={isSubmitting}
              className="w-full min-h-[44px] px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="min-h-[48px] px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-all disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleAward}
            disabled={isSubmitting || !selectedCategoryId || !!successInfo}
            className={`min-h-[48px] px-6 py-2 rounded-2xl font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 ${
              selectedCategory?.type === 'negative'
                ? 'bg-rose-600 hover:bg-rose-700 text-white ring-rose-300'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white ring-indigo-300'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Recording Points...</span>
              </>
            ) : errorMessage ? (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Retry Awarding</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>
                  Award {selectedCategory ? (selectedCategory.defaultPoints > 0 ? `+${selectedCategory.defaultPoints}` : selectedCategory.defaultPoints) : ''} to {selectedStudents.length} {selectedStudents.length === 1 ? 'Student' : 'Students'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
