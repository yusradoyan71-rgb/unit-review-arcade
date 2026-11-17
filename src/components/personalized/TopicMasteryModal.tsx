/**
 * UNIT REVIEW ARCADE — TOPIC MASTERY MODAL (PHASE 9E)
 * Version: 9.5.0
 * 
 * Colorful Game World + Bright Creative Campus redesign.
 * Comprehensive student topic mastery visualization:
 * - Accuracy and completed activities by unit and learning objective
 * - Distinct separation between Grade 7 and Grade 8 content
 * - Explicit identification of areas needing practice
 * - Historical improvement tracking over time
 * - Quick launch of targeted practice sessions
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePersonalizedLearning } from '../../context/PersonalizedLearningContext';
import { useAuth } from '../../context/AuthContext';
import { sounds } from '../../services/soundEffects';
import type { GradeId } from '../../types/schema';
import type { UnitTopicMastery, MasteryStatus } from '../../types/personalizedLearning';
import {
  X,
  Award,
  GraduationCap,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Play,
  Sparkles,
  RotateCw
} from 'lucide-react';

export const TopicMasteryModal: React.FC = () => {
  const { student } = useAuth();
  const {
    mastery,
    isMasteryModalOpen,
    closeMasteryModal,
    startSmartReview,
    refreshPersonalizedData,
    isLoading
  } = usePersonalizedLearning();

  const [stateActiveGrade, setStateActiveGrade] = useState<GradeId>('grade-7');
  const activeGrade: GradeId = student ? student.grade : stateActiveGrade;

  if (!isMasteryModalOpen) return null;

  const gradeData = activeGrade === 'grade-7' ? mastery?.grade7 : mastery?.grade8;
  const units: UnitTopicMastery[] = gradeData?.units || [];

  const handleLaunchUnitPractice = (unitId: string) => {
    sounds.playNavigate();
    closeMasteryModal();
    startSmartReview(activeGrade, unitId, 10);
  };

  const getStatusBadge = (status: MasteryStatus) => {
    switch (status) {
      case 'mastered':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold flex items-center gap-1 shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Mastered
          </span>
        );
      case 'developing':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold flex items-center gap-1 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Developing
          </span>
        );
      case 'needs_practice':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold flex items-center gap-1 shadow-xs">
            <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
            Needs Practice
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-4xl rounded-3xl bg-white border-4 border-cyan-300 p-5 sm:p-8 text-slate-800 shadow-2xl relative flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Soft Ambient Cyan Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-200/50 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-cyan-100 shrink-0 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-cyan-400/30">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bubble text-xl sm:text-2xl font-black text-slate-900 tracking-wide">
                  TOPIC MASTERY
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200 text-xs font-mono font-bold">
                  Class {mastery?.class || '—'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Track your progress, skill breakdown, and historical improvement by unit.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sounds.playTap();
                refreshPersonalizedData();
              }}
              title="Refresh Mastery"
              className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
            >
              <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={closeMasteryModal}
              className="p-2.5 rounded-xl bg-slate-100 text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Grade Tabs & Summary KPI Strip */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 my-4 shrink-0 relative z-10">
          {/* Grade Selector (Classroom) or Verified Badge (Student) */}
          {student ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-xs sm:text-sm shadow-xs self-start">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <span>{student.grade === 'grade-7' ? 'Grade 7 Progress (Units 1–2)' : 'Grade 8 Progress (Units 1–4)'}</span>
            </div>
          ) : (
            <div className="flex items-center bg-slate-100 rounded-2xl p-1 border border-slate-200 self-start">
              <button
                onClick={() => {
                  sounds.playTap();
                  setStateActiveGrade('grade-7');
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                  activeGrade === 'grade-7'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Grade 7 (Units 1–2)</span>
              </button>

              <button
                onClick={() => {
                  sounds.playTap();
                  setStateActiveGrade('grade-8');
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                  activeGrade === 'grade-8'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Grade 8 (Units 1–4)</span>
              </button>
            </div>
          )}

          {/* Overall Grade Stats */}
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-right">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Grade Accuracy</span>
              <span className="text-sm font-mono font-black text-cyan-700">
                {gradeData?.overallAccuracy || 0}%
              </span>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div className="text-right">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Mastered Units</span>
              <span className="text-sm font-mono font-black text-emerald-700">
                {gradeData?.masteredUnitsCount || 0} / {units.length}
              </span>
            </div>
          </div>
        </div>

        {/* Units Mastery Cards */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 relative z-10">
          {units.map((unit) => {
            const acc = unit.accuracyPercentage;
            const barColor =
              acc >= 90 ? 'bg-emerald-500' : acc >= 70 ? 'bg-amber-500' : 'bg-rose-500';

            return (
              <div
                key={unit.unitId}
                className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-slate-200 hover:border-slate-300 transition-all space-y-4 shadow-xs"
              >
                {/* Unit Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-mono font-bold">
                        Unit {unit.unitNumber}
                      </span>
                      {getStatusBadge(unit.masteryLevel)}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      {unit.unitTitle}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-xl font-mono font-black text-slate-800">
                        {acc}%
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono font-medium">
                        {unit.completedActivities} / {unit.totalActivities} activities
                      </div>
                    </div>

                    <button
                      onClick={() => handleLaunchUnitPractice(unit.unitId)}
                      className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-xs flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 shadow-xs"
                    >
                      <Play className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Practise Unit</span>
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full ${barColor} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(100, Math.max(5, acc))}%` }}
                  />
                </div>

                {/* Skills Breakdown */}
                {unit.skills && unit.skills.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                    {unit.skills.map((skill) => (
                      <div
                        key={skill.skillId}
                        className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-slate-700 font-bold">
                          <span className="truncate">{skill.skillName}</span>
                          <span className="font-mono text-indigo-700 font-black">
                            {skill.accuracyPercentage}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${skill.accuracyPercentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Areas Needing Practice & Historical Gain */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2.5 border-t border-slate-100 text-xs">
                  {/* Historical Improvement */}
                  <div className="flex items-center gap-1.5 text-slate-500 font-mono font-medium">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      Historical Improvement:
                    </span>
                    <strong className="text-emerald-700 font-black">
                      +{unit.historicalImprovementPercentage}%
                    </strong>
                  </div>

                  {/* Areas needing practice alert */}
                  {unit.areasNeedingPractice && unit.areasNeedingPractice.length > 0 ? (
                    <div className="flex items-center gap-1.5 text-amber-700 font-semibold">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                      <span>
                        {unit.areasNeedingPractice.length} topic {unit.areasNeedingPractice.length === 1 ? 'area' : 'areas'} flagged for review
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>All activities in this unit mastered!</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
