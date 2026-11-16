/**
 * UNIT REVIEW ARCADE — MY MISTAKES MODAL (PHASE 6)
 * Version: 6.0.0
 * 
 * Comprehensive student mistake review and retry interface:
 * - Review questions answered incorrectly
 * - Original question, student answer, correct answer, and pedagogical explanation
 * - Interactive retry solver marking mistakes as corrected upon success
 * - Real-time filtering by grade, unit, and correction status
 * - Quick launch of personalized Smart Review session
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePersonalizedLearning } from '../../context/PersonalizedLearningContext';
import { useAuth } from '../../context/AuthContext';
import { QuestionRetryModal } from './QuestionRetryModal';
import { sounds } from '../../services/soundEffects';
import type { StudentMistakeRecord } from '../../types/personalizedLearning';
import type { GradeId } from '../../types/schema';
import {
  X,
  RotateCw,
  CheckCircle2,
  XCircle,
  Search,
  Zap,
  Play,
  Clock
} from 'lucide-react';

export const MyMistakesModal: React.FC = () => {
  const { student } = useAuth();
  const {
    mistakes,
    isMistakesModalOpen,
    closeMistakesModal,
    startSmartReview,
    refreshPersonalizedData,
    isLoading
  } = usePersonalizedLearning();

  const [gradeFilter, setGradeFilter] = useState<'all' | GradeId>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'uncorrected' | 'corrected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRetryMistake, setActiveRetryMistake] = useState<StudentMistakeRecord | null>(null);

  // Statistics
  const totalCount = mistakes.length;
  const uncorrectedCount = useMemo(() => mistakes.filter((m) => !m.isCorrected).length, [mistakes]);
  const correctedCount = useMemo(() => mistakes.filter((m) => m.isCorrected).length, [mistakes]);
  const recoveryRate = totalCount > 0 ? Math.round((correctedCount / totalCount) * 100) : 100;

  // Filtered mistakes
  const filteredMistakes = useMemo(() => {
    return mistakes.filter((m) => {
      if (!student && gradeFilter !== 'all' && m.gradeId !== gradeFilter) return false;
      if (statusFilter === 'uncorrected' && m.isCorrected) return false;
      if (statusFilter === 'corrected' && !m.isCorrected) return false;

      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase();
        const inPrompt = m.questionPrompt?.toLowerCase().includes(query);
        const inUnit = m.unitTitle?.toLowerCase().includes(query);
        const inAct = m.activityTitle?.toLowerCase().includes(query);
        return inPrompt || inUnit || inAct;
      }

      return true;
    });
  }, [mistakes, student, gradeFilter, statusFilter, searchQuery]);

  if (!isMistakesModalOpen) return null;

  const handleLaunchSmartReview = () => {
    sounds.playNavigate();
    closeMistakesModal();
    const targetGrade = student ? student.grade : (gradeFilter === 'all' ? 'grade-7' : gradeFilter);
    startSmartReview(targetGrade, undefined, 10);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-4xl rounded-3xl bg-slate-900 border border-indigo-500/30 p-5 sm:p-8 text-slate-100 shadow-2xl relative flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Top ambient glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-600 flex items-center justify-center text-white font-bold shadow-lg shadow-rose-500/20">
              <RotateCw className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-arcade text-lg sm:text-xl font-bold text-white tracking-wide">
                  MY MISTAKES
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] font-mono font-bold">
                  {uncorrectedCount} To Review
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Review your incorrect questions, study the explanations, and retry to earn mastery.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sounds.playTap();
                refreshPersonalizedData();
              }}
              title="Refresh Mistakes"
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={closeMistakesModal}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Statistics Bar & Quick Action */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4 shrink-0">
          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-semibold uppercase block">Total Mistakes</span>
            <span className="text-xl font-arcade font-bold text-white">{totalCount}</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/70 border border-rose-500/20">
            <span className="text-[11px] text-rose-400 font-semibold uppercase block">Needs Practice</span>
            <span className="text-xl font-arcade font-bold text-rose-400">{uncorrectedCount}</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/70 border border-emerald-500/20">
            <span className="text-[11px] text-emerald-400 font-semibold uppercase block">Corrected</span>
            <span className="text-xl font-arcade font-bold text-emerald-400">{correctedCount}</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/70 border border-indigo-500/20 flex flex-col justify-between">
            <span className="text-[11px] text-indigo-400 font-semibold uppercase block">Recovery Rate</span>
            <span className="text-xl font-arcade font-bold text-indigo-300">{recoveryRate}%</span>
          </div>
        </div>

        {/* Smart Review Callout Banner */}
        {uncorrectedCount > 0 && (
          <div className="mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/80 to-purple-950/80 border border-indigo-500/40 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-white block">Ready for a Smart Review Session?</span>
                <span className="text-slate-300">
                  Target your {uncorrectedCount} uncorrected questions with guided step-by-step review.
                </span>
              </div>
            </div>

            <button
              onClick={handleLaunchSmartReview}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30 shrink-0 transition-all hover:scale-105 active:scale-95"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Start Review</span>
            </button>
          </div>
        )}

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 shrink-0">
          {/* Grade & Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {/* Grade Selector (Classroom / Unauthenticated Only) */}
            {!student && (
              <div className="flex items-center bg-slate-950/90 rounded-xl p-0.5 border border-slate-800">
                <button
                  onClick={() => setGradeFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    gradeFilter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setGradeFilter('grade-7')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    gradeFilter === 'grade-7' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Grade 7
                </button>
                <button
                  onClick={() => setGradeFilter('grade-8')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    gradeFilter === 'grade-8' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Grade 8
                </button>
              </div>
            )}

            {/* Status Filter */}
            <div className="flex items-center bg-slate-950/90 rounded-xl p-0.5 border border-slate-800">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('uncorrected')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === 'uncorrected' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Needs Practice
              </button>
              <button
                onClick={() => setStatusFilter('corrected')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === 'corrected' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Corrected
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search mistakes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Mistakes List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filteredMistakes.length === 0 ? (
            <div className="py-12 text-center bg-slate-950/40 rounded-2xl border border-slate-800/80">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="font-arcade text-base font-bold text-white mb-1">
                {totalCount === 0 ? 'NO MISTAKES RECORDED' : 'NO MATCHING MISTAKES'}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {totalCount === 0
                  ? 'All questions you have answered were correct! Keep up the brilliant streak.'
                  : 'Try adjusting your grade or status filters to view other questions.'}
              </p>
            </div>
          ) : (
            filteredMistakes.map((m) => (
              <div
                key={m.mistakeId}
                className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col gap-3"
              >
                {/* Card Top: Badges & Status */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-mono font-bold">
                      {m.gradeId === 'grade-7' ? 'Grade 7' : 'Grade 8'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-bold">
                      {m.unitTitle || m.unitId}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400 text-[10px]">
                      {m.activityTitle || m.activityId}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {m.isCorrected ? (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Corrected
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] font-semibold flex items-center gap-1">
                        <XCircle className="w-3 h-3 text-rose-400" />
                        Needs Practice
                      </span>
                    )}

                    <button
                      onClick={() => {
                        sounds.playTap();
                        setActiveRetryMistake(m);
                      }}
                      className="px-3 py-1 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 hover:border-indigo-400 text-indigo-300 hover:text-white text-xs font-bold flex items-center gap-1 transition-all hover:scale-105 active:scale-95"
                    >
                      <RotateCw className="w-3 h-3" />
                      <span>Retry</span>
                    </button>
                  </div>
                </div>

                {/* Prompt */}
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white leading-relaxed">
                    {m.questionPrompt}
                  </h4>
                </div>

                {/* Comparison Row: Your Answer vs Correct Answer */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                    <span className="font-semibold text-rose-400 block mb-0.5 uppercase tracking-wide text-[10px]">
                      Your Answer:
                    </span>
                    <span className="text-rose-200 line-through font-mono font-medium">
                      {m.studentResponse || '(No response)'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <span className="font-semibold text-emerald-400 block mb-0.5 uppercase tracking-wide text-[10px]">
                      Correct Answer:
                    </span>
                    <span className="text-emerald-200 font-mono font-bold">
                      {m.correctAnswer}
                    </span>
                  </div>
                </div>

                {/* Pedagogical Explanation Box */}
                {m.explanation && (
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-indigo-300 leading-relaxed">
                    <span className="font-bold text-indigo-400 block text-[10px] uppercase tracking-wide mb-0.5">
                      Pedagogical Explanation:
                    </span>
                    {m.explanation}
                  </div>
                )}

                {/* Footer Timestamp */}
                <div className="text-[10px] text-slate-500 flex items-center gap-3 pt-1 border-t border-slate-900 font-mono">
                  <span className="flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    Missed on {new Date(m.timestamp).toLocaleDateString()}
                  </span>
                  {m.correctedAt && (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      Corrected on {new Date(m.correctedAt).toLocaleDateString()}
                    </span>
                  )}
                  {m.retryAttemptsCount > 0 && (
                    <span>• {m.retryAttemptsCount} retry attempts</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Retry Modal Overlay */}
        <AnimatePresence>
          {activeRetryMistake && (
            <QuestionRetryModal
              mistake={activeRetryMistake}
              onClose={() => setActiveRetryMistake(null)}
              onCorrected={() => {
                setActiveRetryMistake(null);
                refreshPersonalizedData();
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
