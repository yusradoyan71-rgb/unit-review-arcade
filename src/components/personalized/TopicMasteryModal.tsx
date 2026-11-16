/**
 * UNIT REVIEW ARCADE — TOPIC MASTERY MODAL (PHASE 6)
 * Version: 6.0.0
 * 
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
  const {
    mastery,
    isMasteryModalOpen,
    closeMasteryModal,
    startSmartReview,
    refreshPersonalizedData,
    isLoading
  } = usePersonalizedLearning();

  const [activeGrade, setActiveGrade] = useState<GradeId>('grade-7');

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
          <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Mastered
          </span>
        );
      case 'developing':
        return (
          <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Developing
          </span>
        );
      case 'needs_practice':
      default:
        return (
          <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] font-bold flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-rose-400" />
            Needs Practice
          </span>
        );
    }
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
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-arcade text-lg sm:text-xl font-bold text-white tracking-wide">
                  TOPIC MASTERY
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[11px] font-mono font-bold">
                  Class {mastery?.class || '—'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
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
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={closeMasteryModal}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Grade Tabs & Summary KPI Strip */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 my-4 shrink-0">
          {/* Grade Selector */}
          <div className="flex items-center bg-slate-950/90 rounded-2xl p-1 border border-slate-800 self-start">
            <button
              onClick={() => {
                sounds.playTap();
                setActiveGrade('grade-7');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeGrade === 'grade-7'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Grade 7 (Units 1–2)</span>
            </button>

            <button
              onClick={() => {
                sounds.playTap();
                setActiveGrade('grade-8');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeGrade === 'grade-8'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Grade 8 (Units 1–4)</span>
            </button>
          </div>

          {/* Overall Grade Stats */}
          <div className="flex items-center gap-3 bg-slate-950/70 px-4 py-2 rounded-2xl border border-slate-800">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Grade Accuracy</span>
              <span className="text-sm font-arcade font-bold text-cyan-400">
                {gradeData?.overallAccuracy || 0}%
              </span>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Mastered Units</span>
              <span className="text-sm font-arcade font-bold text-emerald-400">
                {gradeData?.masteredUnitsCount || 0} / {units.length}
              </span>
            </div>
          </div>
        </div>

        {/* Units Mastery Cards */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {units.map((unit) => {
            const acc = unit.accuracyPercentage;
            const barColor =
              acc >= 90 ? 'bg-emerald-400' : acc >= 70 ? 'bg-amber-400' : 'bg-rose-500';

            return (
              <div
                key={unit.unitId}
                className="p-5 sm:p-6 rounded-3xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all space-y-4"
              >
                {/* Unit Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-mono font-bold">
                        Unit {unit.unitNumber}
                      </span>
                      {getStatusBadge(unit.masteryLevel)}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      {unit.unitTitle}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-xl font-arcade font-bold text-white">
                        {acc}%
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {unit.completedActivities} / {unit.totalActivities} activities
                      </div>
                    </div>

                    <button
                      onClick={() => handleLaunchUnitPractice(unit.unitId)}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 hover:border-indigo-400 text-indigo-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 shadow-sm"
                    >
                      <Play className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Practise Unit</span>
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
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
                        className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-slate-300 font-medium">
                          <span className="truncate">{skill.skillName}</span>
                          <span className="font-mono font-bold text-indigo-400">
                            {skill.accuracyPercentage}%
                          </span>
                        </div>
                        <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
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
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-900 text-xs">
                  {/* Historical Improvement */}
                  <div className="flex items-center gap-1.5 text-slate-400 font-mono">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span>
                      Historical Improvement:
                    </span>
                    <strong className="text-emerald-400">
                      +{unit.historicalImprovementPercentage}%
                    </strong>
                  </div>

                  {/* Areas needing practice alert */}
                  {unit.areasNeedingPractice && unit.areasNeedingPractice.length > 0 ? (
                    <div className="flex items-center gap-1.5 text-amber-400 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>
                        {unit.areasNeedingPractice.length} topic {unit.areasNeedingPractice.length === 1 ? 'area' : 'areas'} flagged for review
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
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
