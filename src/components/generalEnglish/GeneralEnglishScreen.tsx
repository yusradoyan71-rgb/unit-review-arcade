/**
 * UNIT REVIEW ARCADE — GENERAL ENGLISH SCREEN (PHASE 4)
 * Version: 4.0.0
 * 
 * Standalone General English Hub organized by four core language skills:
 * 1. Grammar (Tenses, Modals, Conditionals, Passives, Questions)
 * 2. Vocabulary (Thematic clusters, collocations, phrasal expressions)
 * 3. Reading (Short passages with comprehension questions)
 * 4. Listening & Dictation (Audio announcements, dialogues, dictations)
 * 
 * Includes Mixed Practice Lab with configurable question ratios (50/50, 70/30, 30/70).
 */

import React, { useState, useMemo } from 'react';
import type { GradeId, GameType } from '../../types/schema';
import type { EnglishSkill } from '../../types/questionBank';
import { useArcade } from '../../context/ArcadeContext';
import { useAuth } from '../../context/AuthContext';
import { GeneralEnglishService, type GeneralEnglishTopic, type MixedPracticeRatio } from '../../services/generalEnglishService';
import { sounds } from '../../services/soundEffects';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shuffle,
  Play,
  ArrowLeft,
  Sparkles,
  X,
} from 'lucide-react';

export const GeneralEnglishScreen: React.FC<{ initialGradeId?: GradeId }> = ({ initialGradeId }) => {
  const { navigateTo, data } = useArcade();
  const { student } = useAuth();

  // Active Grade: Authenticated student is locked to their grade; guest can toggle
  const [selectedGrade, setSelectedGrade] = useState<GradeId>(
    student ? student.grade : (initialGradeId || 'grade-7')
  );

  const activeGrade: GradeId = student ? student.grade : selectedGrade;

  // Active Skill Tab
  const [activeSkill, setActiveSkill] = useState<EnglishSkill>('grammar');

  // Mixed Practice Configuration Modal State
  const [isMixedModalOpen, setIsMixedModalOpen] = useState(false);
  const [mixedGameType, setMixedGameType] = useState<GameType>('quiz_battle');
  const [mixedRatio, setMixedRatio] = useState<MixedPracticeRatio>('50/50');

  // Load topics for current grade and active skill
  const topics = useMemo<GeneralEnglishTopic[]>(() => {
    return GeneralEnglishService.getTopics(activeGrade, activeSkill);
  }, [activeGrade, activeSkill]);

  // Total question counts across all 4 skills for active grade
  const skillCounts = useMemo(() => {
    const all = GeneralEnglishService.getQuestionsForGrade(activeGrade);
    return {
      grammar: all.filter((q) => q.skill === 'grammar').length,
      vocabulary: all.filter((q) => q.skill === 'vocabulary').length,
      reading: all.filter((q) => q.skill === 'reading').length,
      listening: all.filter((q) => q.skill === 'listening').length,
      total: all.length,
    };
  }, [activeGrade]);

  // Mixed Practice Pool Statistics
  const mixedPoolStats = useMemo(() => {
    const units = data.units[activeGrade] || [];
    const unitActs = units.flatMap((u) => u.activities || []).filter((a) => a.gameType === mixedGameType);
    const unitQCount = unitActs.reduce((sum, a) => sum + (a.questions?.length || 0), 0);

    const generalQuestions = GeneralEnglishService.getQuestionsForGrade(activeGrade);
    const generalQCount = generalQuestions.filter((q) => (q.assignedGameTypes || []).includes(mixedGameType)).length;

    let targetUnit = 5;
    let targetGeneral = 5;
    if (mixedRatio === '70/30') {
      targetUnit = 7;
      targetGeneral = 3;
    } else if (mixedRatio === '30/70') {
      targetUnit = 3;
      targetGeneral = 7;
    }

    return {
      unitPoolSize: unitQCount,
      generalPoolSize: generalQCount,
      targetUnit,
      targetGeneral,
      canLaunch: unitQCount > 0 && generalQCount > 0,
    };
  }, [data, activeGrade, mixedGameType, mixedRatio]);

  // Launch a standard topic session
  const handleLaunchTopic = (topic: GeneralEnglishTopic, gameType?: GameType) => {
    sounds.playNavigate();
    const selectedGame = gameType || topic.compatibleGameTypes[0] || 'quiz_battle';
    navigateTo({
      view: 'general-english-play',
      gradeId: activeGrade,
      topicId: topic.id,
      gameType: selectedGame,
      mode: 'topic',
    });
  };

  // Launch a Mixed Practice session
  const handleLaunchMixed = () => {
    sounds.playSuccess();
    setIsMixedModalOpen(false);
    navigateTo({
      view: 'general-english-play',
      gradeId: activeGrade,
      topicId: 'mixed',
      gameType: mixedGameType,
      mode: 'mixed',
      mixedRatio,
    });
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-game-sky text-slate-900 flex flex-col py-6 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto w-full space-y-6">
      
      {/* =================================================================== */}
      {/* 1. TOP BREADCRUMB & GRADE SWITCHER                                  */}
      {/* =================================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/95 backdrop-blur-sm p-4 rounded-3xl border-2 border-sky-200 shadow-sm">
        <button
          onClick={() => {
            sounds.playTap();
            navigateTo({ view: 'home' });
          }}
          className="px-4 py-2 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-black flex items-center gap-2 border border-sky-200 transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Adventure Home</span>
        </button>

        {/* Grade Selector */}
        <div className="flex items-center gap-2">
          {student ? (
            <span className="px-4 py-1.5 rounded-2xl bg-sky-600 text-white font-black text-xs shadow-sm uppercase tracking-wider">
              {student.grade === 'grade-7' ? 'Grade 7' : 'Grade 8'} General English
            </span>
          ) : (
            <div className="flex items-center p-1 bg-sky-100 rounded-2xl border border-sky-200">
              <button
                onClick={() => {
                  sounds.playTap();
                  setSelectedGrade('grade-7');
                }}
                className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all ${
                  selectedGrade === 'grade-7' ? 'bg-white text-sky-900 shadow-sm' : 'text-sky-700 hover:text-sky-900'
                }`}
              >
                Grade 7
              </button>
              <button
                onClick={() => {
                  sounds.playTap();
                  setSelectedGrade('grade-8');
                }}
                className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all ${
                  selectedGrade === 'grade-8' ? 'bg-white text-sky-900 shadow-sm' : 'text-sky-700 hover:text-sky-900'
                }`}
              >
                Grade 8
              </button>
            </div>
          )}
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. GENERAL ENGLISH HERO & MIXED PRACTICE PROMO                      */}
      {/* =================================================================== */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />

        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-black uppercase tracking-wider text-sky-100 border border-white/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Independent Skill Mastery • {skillCounts.total} Questions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
            General English Academy
          </h1>
          <p className="text-xs sm:text-sm text-sky-100 leading-relaxed">
            Practice grammar structures, thematic vocabulary, reading comprehension, and listening without textbook unit constraints.
          </p>
        </div>

        {/* Quick Launch Mixed Practice Button */}
        <button
          onClick={() => {
            sounds.playTap();
            setIsMixedModalOpen(true);
          }}
          className="px-5 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs uppercase tracking-wide flex items-center gap-2.5 shadow-lg shadow-amber-400/30 transition-transform active:scale-95 flex-shrink-0 relative z-10"
        >
          <Shuffle className="w-4 h-4 text-amber-900" />
          <span>Launch Mixed Practice 🔀</span>
        </button>
      </div>

      {/* =================================================================== */}
      {/* 3. FOUR SKILL PILLARS TABS                                          */}
      {/* =================================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
        
        {/* Grammar Tab */}
        <button
          onClick={() => {
            sounds.playTap();
            setActiveSkill('grammar');
          }}
          className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-center justify-center text-center gap-2 ${
            activeSkill === 'grammar'
              ? 'bg-white border-sky-500 shadow-md shadow-sky-500/10 ring-2 ring-sky-300'
              : 'bg-white/70 hover:bg-white border-sky-100 text-slate-600'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center text-2xl">
            📘
          </div>
          <div>
            <strong className="block text-sm font-black text-slate-900">Grammar</strong>
            <span className="text-[11px] font-bold text-sky-600">{skillCounts.grammar} Questions</span>
          </div>
        </button>

        {/* Vocabulary Tab */}
        <button
          onClick={() => {
            sounds.playTap();
            setActiveSkill('vocabulary');
          }}
          className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-center justify-center text-center gap-2 ${
            activeSkill === 'vocabulary'
              ? 'bg-white border-amber-500 shadow-md shadow-amber-500/10 ring-2 ring-amber-300'
              : 'bg-white/70 hover:bg-white border-amber-100 text-slate-600'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl">
            📙
          </div>
          <div>
            <strong className="block text-sm font-black text-slate-900">Vocabulary</strong>
            <span className="text-[11px] font-bold text-amber-600">{skillCounts.vocabulary} Questions</span>
          </div>
        </button>

        {/* Reading Tab */}
        <button
          onClick={() => {
            sounds.playTap();
            setActiveSkill('reading');
          }}
          className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-center justify-center text-center gap-2 ${
            activeSkill === 'reading'
              ? 'bg-white border-emerald-500 shadow-md shadow-emerald-500/10 ring-2 ring-emerald-300'
              : 'bg-white/70 hover:bg-white border-emerald-100 text-slate-600'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl">
            📗
          </div>
          <div>
            <strong className="block text-sm font-black text-slate-900">Reading</strong>
            <span className="text-[11px] font-bold text-emerald-600">{skillCounts.reading} Questions</span>
          </div>
        </button>

        {/* Listening Tab */}
        <button
          onClick={() => {
            sounds.playTap();
            setActiveSkill('listening');
          }}
          className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-center justify-center text-center gap-2 ${
            activeSkill === 'listening'
              ? 'bg-white border-purple-500 shadow-md shadow-purple-500/10 ring-2 ring-purple-300'
              : 'bg-white/70 hover:bg-white border-purple-100 text-slate-600'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-2xl">
            🎧
          </div>
          <div>
            <strong className="block text-sm font-black text-slate-900">Listening & Dictation</strong>
            <span className="text-[11px] font-bold text-purple-600">{skillCounts.listening} Questions</span>
          </div>
        </button>

      </div>

      {/* =================================================================== */}
      {/* 4. TOPIC CARDS GRID                                                 */}
      {/* =================================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black font-display text-slate-900 capitalize">
            {activeSkill} Topics ({topics.length} Sets Available)
          </h2>
          <span className="text-xs font-bold text-slate-500">
            Click any topic to practice with compatible games
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((topic) => (
            <motion.div
              key={topic.id}
              whileHover={{ y: -3, transition: { duration: 0.15 } }}
              className="p-5 rounded-3xl bg-white border-2 border-sky-100 hover:border-sky-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                {/* Badges */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-200">
                    CEFR {topic.cefrLevel}
                  </span>
                  <span className="text-xs font-bold text-slate-500 font-mono">
                    {topic.questionCount} Qs
                  </span>
                </div>

                <h3 className="text-base font-black font-display text-slate-900 leading-snug">
                  {topic.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {topic.description}
                </p>

                {/* Compatible Games Badges */}
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {topic.compatibleGameTypes.map((gt) => (
                    <span
                      key={gt}
                      className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {gt.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-sky-50 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleLaunchTopic(topic)}
                  className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Practice</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* =================================================================== */}
      {/* 5. MIXED PRACTICE CONFIGURATION MODAL                               */}
      {/* =================================================================== */}
      <AnimatePresence>
        {isMixedModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border-2 border-indigo-200 relative overflow-hidden space-y-5"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Shuffle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black font-display text-slate-900">
                      Mixed Practice Lab
                    </h3>
                    <p className="text-xs text-slate-500">
                      Blend textbook Unit Review with General English skills
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMixedModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Game Engine Selector */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                  Select Game Engine:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { type: 'quiz_battle' as GameType, label: 'Quiz Battle (MCQ)' },
                    { type: 'sentence_builder' as GameType, label: 'Sentence Builder' },
                    { type: 'match_it' as GameType, label: 'Match It' },
                    { type: 'true_false' as GameType, label: 'True / False' },
                    { type: 'reading_detective' as GameType, label: 'Reading Detective' },
                  ].map((g) => (
                    <button
                      key={g.type}
                      type="button"
                      onClick={() => setMixedGameType(g.type)}
                      className={`p-2.5 rounded-2xl border text-xs font-bold text-center transition-all ${
                        mixedGameType === g.type
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-900 ring-2 ring-indigo-200'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Ratio Selector (Requirement 6) */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                  Question Ratio:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { ratio: '50/50' as MixedPracticeRatio, label: '50 / 50', desc: 'Balanced (5 + 5)' },
                    { ratio: '70/30' as MixedPracticeRatio, label: '70 / 30', desc: 'Unit Focus (7 + 3)' },
                    { ratio: '30/70' as MixedPracticeRatio, label: '30 / 70', desc: 'Skill Focus (3 + 7)' },
                  ].map((r) => (
                    <button
                      key={r.ratio}
                      type="button"
                      onClick={() => setMixedRatio(r.ratio)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        mixedRatio === r.ratio
                          ? 'bg-amber-50 border-amber-500 text-amber-950 ring-2 ring-amber-200'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <strong className="block text-sm font-black">{r.label}</strong>
                      <span className="text-[10px] text-slate-500 block mt-0.5">{r.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pool Status Preview */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between font-bold text-slate-700">
                  <span>Unit Review Pool ({activeGrade === 'grade-7' ? 'Grade 7' : 'Grade 8'}):</span>
                  <span className="font-mono text-sky-700">{mixedPoolStats.unitPoolSize} Qs available</span>
                </div>
                <div className="flex justify-between font-bold text-slate-700">
                  <span>General English Pool ({activeGrade === 'grade-7' ? 'Grade 7' : 'Grade 8'}):</span>
                  <span className="font-mono text-indigo-700">{mixedPoolStats.generalPoolSize} Qs available</span>
                </div>
                <div className="pt-1.5 border-t border-slate-200 text-[11px] text-slate-500">
                  Session will combine {mixedPoolStats.targetUnit} Unit questions + {mixedPoolStats.targetGeneral} General questions.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsMixedModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleLaunchMixed}
                  disabled={!mixedPoolStats.canLaunch}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:pointer-events-none text-white font-black text-xs shadow-md shadow-amber-500/20 flex items-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Mixed Practice</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
