/**
 * UNIT REVIEW ARCADE — STUDENT DETAIL MODAL (PHASE 9D)
 * Version: 9.4.0
 * 
 * Creative Campus Professional Educator Redesign.
 * In-depth student profile displaying repeated attempt gains, full attempt history,
 * and per-question diagnostic answer logs with legacy version awareness.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TeacherApiService } from '../../../services/teacherApiService';
import { useTeacherAuth } from '../../../context/TeacherAuthContext';
import type { 
  TeacherStudentDetailResponse, 
  RepeatedAttemptGain, 
  StudentAttemptRecord, 
  StudentAnswerRecord 
} from '../../../types/teacher';
import { 
  X, 
  User, 
  Gamepad2, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  History,
  FileQuestion
} from 'lucide-react';

interface StudentDetailModalProps {
  studentNumber: string | null;
  onClose: () => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  studentNumber,
  onClose,
}) => {
  const { teacherSession } = useTeacherAuth();
  const [data, setData] = useState<TeacherStudentDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'repeated' | 'attempts' | 'answers'>('repeated');

  useEffect(() => {
    if (!studentNumber || !teacherSession?.teacherToken) {
      setData(null);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    TeacherApiService.getStudentDetail(teacherSession.teacherToken, studentNumber)
      .then((res: TeacherStudentDetailResponse) => {
        if (!isMounted) return;
        if (res.success) {
          setData(res);
        } else {
          setError(res.error || 'Failed to load student details.');
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
  }, [studentNumber, teacherSession]);

  if (!studentNumber) return null;

  const student = data?.student;
  const attempts = data?.attempts || [];
  const repeatedGains = data?.repeatedAttemptGains || [];
  const answers = data?.answers || [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col text-slate-800 overflow-hidden"
        >
          {/* Modal Header */}
          <div className="p-5 sm:p-6 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-black text-xl font-bubble shrink-0 shadow-xs">
                {student?.fullName ? student.fullName.charAt(0).toUpperCase() : <User className="w-6 h-6" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bubble text-lg sm:text-xl font-bold text-slate-900">
                    {student ? student.fullName : `Student #${studentNumber}`}
                  </h3>
                  {student?.class && (
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold text-xs font-mono">
                      Class {student.class}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="font-mono">Student No: {studentNumber}</span>
                  {student?.lastLoginAt && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Last active {new Date(student.lastLoginAt).toLocaleDateString()}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Close Profile"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sub-tab Navigation */}
          <div className="px-6 border-b border-slate-200 bg-white flex gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('repeated')}
              className={`py-3.5 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeTab === 'repeated'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Repeated Attempt Gains ({repeatedGains.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('attempts')}
              className={`py-3.5 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeTab === 'attempts'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <History className="w-4 h-4" />
              <span>All Attempts ({attempts.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('answers')}
              className={`py-3.5 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeTab === 'answers'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <FileQuestion className="w-4 h-4" />
              <span>Question Answers ({answers.length})</span>
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            {isLoading ? (
              <div className="py-16 text-center text-slate-400 space-y-3 animate-pulse">
                <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-medium">Loading detailed student analytics...</p>
              </div>
            ) : error ? (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-3 font-medium">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            ) : (
              <>
                {/* TAB 1: REPEATED ATTEMPT GAINS */}
                {activeTab === 'repeated' && (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-500 font-medium">
                      Measures student mastery growth when replaying activities. Positive gain indicates improvement from first to latest attempt.
                    </p>

                    {repeatedGains.length === 0 ? (
                      <div className="py-12 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
                        <History className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p className="text-xs font-bold text-slate-700">No repeated attempts recorded yet.</p>
                        <p className="text-[11px] text-slate-400 mt-1">This student has not replayed any activity multiple times.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {repeatedGains.map((gain: RepeatedAttemptGain) => {
                          const isGrowth = gain.scoreGain > 0;
                          const isDrop = gain.scoreGain < 0;

                          return (
                            <div
                              key={gain.activityId}
                              className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 flex flex-col justify-between shadow-xs"
                            >
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div>
                                  <h4 className="font-bold text-slate-900 text-xs line-clamp-1">
                                    {gain.activityTitle}
                                  </h4>
                                  <span className="text-[10px] font-mono text-slate-400">
                                    {gain.totalAttempts} attempts
                                  </span>
                                </div>

                                <span
                                  className={`px-2.5 py-0.5 rounded-full font-bold font-mono text-xs flex items-center gap-1 ${
                                    isGrowth
                                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                      : isDrop
                                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                      : 'bg-slate-200 text-slate-700'
                                  }`}
                                >
                                  {isGrowth ? <TrendingUp className="w-3.5 h-3.5" /> : isDrop ? <TrendingDown className="w-3.5 h-3.5" /> : null}
                                  <span>{isGrowth ? `+${gain.scoreGain}%` : `${gain.scoreGain}%`}</span>
                                </span>
                              </div>

                              <div className="grid grid-cols-3 gap-2 text-center pt-2.5 border-t border-slate-200 text-[11px]">
                                <div>
                                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">First</span>
                                  <span className="font-bold font-mono text-slate-700">{gain.firstScore}%</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">Latest</span>
                                  <span className="font-bold font-mono text-slate-700">{gain.latestScore}%</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">Best</span>
                                  <span className="font-black font-mono text-emerald-600">{gain.bestScore}%</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: ALL ATTEMPTS */}
                {activeTab === 'attempts' && (
                  <div className="space-y-3">
                    {attempts.length === 0 ? (
                      <div className="py-12 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
                        <Gamepad2 className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p className="text-xs font-bold text-slate-700">No attempts found for this student.</p>
                      </div>
                    ) : (
                      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 text-[10px] uppercase font-bold">
                              <th className="py-3 px-3.5">Activity</th>
                              <th className="py-3 px-2">Type</th>
                              <th className="py-3 px-2 text-center">Try #</th>
                              <th className="py-3 px-2 text-center">Score</th>
                              <th className="py-3 px-2 text-center">Duration</th>
                              <th className="py-3 px-2">Status</th>
                              <th className="py-3 px-3.5">Version</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {attempts.map((att: StudentAttemptRecord) => (
                              <tr key={att.attemptId} className="hover:bg-slate-50/70">
                                <td className="py-3 px-3.5">
                                  <div className="font-bold text-slate-800">{att.activityTitle || att.activityId}</div>
                                  <div className="text-[10px] text-slate-400">{att.unitTitle}</div>
                                </td>
                                <td className="py-3 px-2 font-mono text-[11px] text-slate-500">
                                  {att.gameType}
                                </td>
                                <td className="py-3 px-2 text-center font-bold text-slate-700 font-mono">
                                  #{att.attemptNumber}
                                </td>
                                <td className="py-3 px-2 text-center font-black font-mono">
                                  <span
                                    className={
                                      att.percentage >= 80
                                        ? 'text-emerald-600'
                                        : att.percentage >= 50
                                        ? 'text-amber-600'
                                        : 'text-rose-600'
                                    }
                                  >
                                    {att.percentage}%
                                  </span>
                                </td>
                                <td className="py-3 px-2 text-center text-slate-500 text-[11px] font-mono">
                                  {att.durationSeconds}s
                                </td>
                                <td className="py-3 px-2">
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                      att.status === 'completed'
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                                    }`}
                                  >
                                    {att.status}
                                  </span>
                                </td>
                                <td className="py-3 px-3.5 text-[10px] font-mono text-slate-400">
                                  {att.versionLabel}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: QUESTION ANSWERS */}
                {activeTab === 'answers' && (
                  <div className="space-y-3">
                    {answers.length === 0 ? (
                      <div className="py-12 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
                        <FileQuestion className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p className="text-xs font-bold text-slate-700">No question-level answer records found.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {answers.map((ans: StudentAnswerRecord, idx: number) => (
                          <div
                            key={ans.answerId || idx}
                            className={`p-3.5 rounded-2xl border text-xs flex items-start justify-between gap-3 ${
                              ans.isCorrect
                                ? 'bg-emerald-50/50 border-emerald-200'
                                : 'bg-rose-50/50 border-rose-200'
                            }`}
                          >
                            <div className="space-y-1.5 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                                  Q#{ans.questionOrder}
                                </span>
                                <span className="font-bold text-slate-900">
                                  {ans.questionPrompt}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                                <div>
                                  <span className="text-slate-500 font-medium">Student Response: </span>
                                  <span
                                    className={`font-bold ${
                                      ans.isCorrect ? 'text-emerald-700' : 'text-rose-700'
                                    }`}
                                  >
                                    {ans.studentResponse || '—'}
                                  </span>
                                </div>
                                {!ans.isCorrect && (
                                  <div>
                                    <span className="text-slate-500 font-medium">Correct Answer: </span>
                                    <span className="font-bold text-emerald-700">
                                      {ans.correctAnswer}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-1 shrink-0">
                              {ans.isCorrect ? (
                                <span className="flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                  <span>Correct</span>
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-rose-700 font-bold text-[11px]">
                                  <XCircle className="w-4 h-4 text-rose-600" />
                                  <span>Incorrect</span>
                                </span>
                              )}
                              <span className="text-[10px] font-mono text-slate-400">
                                {ans.versionLabel} • {ans.timeSpentSeconds}s
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
