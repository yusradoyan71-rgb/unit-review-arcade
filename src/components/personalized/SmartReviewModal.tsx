/**
 * UNIT REVIEW ARCADE — SMART REVIEW MODAL (PHASE 6)
 * Version: 6.0.0
 * 
 * Adaptive personalized review runner:
 * - Assembles real curriculum questions prioritizing uncorrected mistakes & weak topics
 * - Purely verified curriculum questions (NO AI-generated questions)
 * - Immediate post-answer pedagogical explanation
 * - Automatically tracks mistake correction and awards practice XP
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePersonalizedLearning } from '../../context/PersonalizedLearningContext';
import { sounds } from '../../services/soundEffects';
import { ExplanationService } from '../../services/explanationService';
import type { 
  MultipleChoiceQuestion, 
  SentenceBuilderQuestion, 
  TrueFalseQuestion 
} from '../../types/schema';
import {
  X,
  Zap,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Award,
  RotateCw,
  Trophy,
  BookOpen
} from 'lucide-react';

export const SmartReviewModal: React.FC = () => {
  const {
    activeReviewSession,
    isSmartReviewModalOpen,
    closeSmartReviewModal,
    retryMistakeQuestion,
    completeSmartReviewSession,
    openMistakesModal
  } = usePersonalizedLearning();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctedMistakeIds, setCorrectedMistakeIds] = useState<string[]>([]);

  // Current question states
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [selectedBool, setSelectedBool] = useState<boolean | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Sentence Builder state
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  if (!isSmartReviewModalOpen || !activeReviewSession) return null;

  const questions = activeReviewSession.questions || [];
  const questionMetadata = activeReviewSession.questionMetadata || [];
  const isGameOver = currentIndex >= questions.length;

  const currentQ = questions[currentIndex];
  const currentMeta = questionMetadata[currentIndex] || {};
  const gameType = currentMeta.gameType || 'quiz_battle';

  const explanation = ExplanationService.getExplanation(currentQ, gameType).explanation;

  // Handle Multiple Choice
  const handleSelectOption = async (idx: number) => {
    if (isAnswered) return;
    sounds.playTap();
    setSelectedIdx(idx);

    const mcQ = currentQ as MultipleChoiceQuestion;
    const answeredCorrectly = idx === mcQ.correctOptionIndex;
    setIsCorrect(answeredCorrectly);
    setIsAnswered(true);

    if (answeredCorrectly) {
      sounds.playSuccess();
      setScore((s) => s + 1);
      if (currentMeta.isFromMistake) {
        setCorrectedMistakeIds((prev) => [...prev, currentQ.id]);
        await retryMistakeQuestion(
          currentQ.id,
          currentMeta.activityId,
          currentMeta.unitId,
          true,
          mcQ.options[idx],
          mcQ.options[mcQ.correctOptionIndex],
          mcQ.prompt
        );
      }
    } else {
      sounds.playBack();
    }
  };

  // Handle True / False
  const handleSelectTrueFalse = async (boolVal: boolean) => {
    if (isAnswered) return;
    sounds.playTap();
    setSelectedBool(boolVal);

    const tfQ = currentQ as TrueFalseQuestion;
    const answeredCorrectly = boolVal === tfQ.isTrue;
    setIsCorrect(answeredCorrectly);
    setIsAnswered(true);

    if (answeredCorrectly) {
      sounds.playSuccess();
      setScore((s) => s + 1);
      if (currentMeta.isFromMistake) {
        setCorrectedMistakeIds((prev) => [...prev, currentQ.id]);
        await retryMistakeQuestion(
          currentQ.id,
          currentMeta.activityId,
          currentMeta.unitId,
          true,
          boolVal ? 'True' : 'False',
          tfQ.isTrue ? 'True' : 'False',
          tfQ.prompt
        );
      }
    } else {
      sounds.playBack();
    }
  };

  // Sentence Builder handlers
  const sentenceQ = currentQ as SentenceBuilderQuestion | undefined;
  const handlePickWord = (w: string) => {
    if (isAnswered) return;
    sounds.playTap();
    setSelectedWords((prev) => [...prev, w]);
  };

  const handleCheckSentence = async () => {
    if (isAnswered || !sentenceQ) return;
    sounds.playTap();

    const constructed = selectedWords.join(' ').trim().toLowerCase().replace(/[^a-z0-9 ]/g, '');
    const target = sentenceQ.correctSentence.trim().toLowerCase().replace(/[^a-z0-9 ]/g, '');
    const answeredCorrectly = constructed === target;

    setIsCorrect(answeredCorrectly);
    setIsAnswered(true);

    if (answeredCorrectly) {
      sounds.playSuccess();
      setScore((s) => s + 1);
      if (currentMeta.isFromMistake) {
        setCorrectedMistakeIds((prev) => [...prev, currentQ.id]);
        await retryMistakeQuestion(
          currentQ.id,
          currentMeta.activityId,
          currentMeta.unitId,
          true,
          selectedWords.join(' '),
          sentenceQ.correctSentence,
          sentenceQ.prompt
        );
      }
    } else {
      sounds.playBack();
    }
  };

  // Advance to next question
  const handleNext = () => {
    sounds.playTap();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((idx) => idx + 1);
      setIsAnswered(false);
      setIsCorrect(false);
      setSelectedIdx(null);
      setSelectedBool(null);
      setSelectedWords([]);
    } else {
      // Completed!
      sounds.playSuccess();
      completeSmartReviewSession(
        activeReviewSession.sessionId,
        score,
        questions.length,
        correctedMistakeIds
      );
      setCurrentIndex(questions.length); // trigger results view
    }
  };

  const restartReview = () => {
    sounds.playTap();
    setCurrentIndex(0);
    setScore(0);
    setCorrectedMistakeIds([]);
    setIsAnswered(false);
    setIsCorrect(false);
    setSelectedIdx(null);
    setSelectedBool(null);
    setSelectedWords([]);
  };

  // Completion Screen
  if (isGameOver) {
    const accuracy = questions.length > 0 ? Math.round((score / questions.length) * 100) : 100;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-xl rounded-3xl bg-slate-900 border border-indigo-500/30 p-6 sm:p-8 text-center text-slate-100 shadow-2xl relative overflow-hidden"
        >
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white mx-auto mb-4 shadow-xl shadow-indigo-500/25">
            <Trophy className="w-8 h-8" />
          </div>

          <h2 className="font-arcade text-2xl font-bold text-white mb-1">
            SMART REVIEW COMPLETE!
          </h2>
          <p className="text-sm text-slate-400 mb-6">
            {activeReviewSession.title}
          </p>

          {/* Results Summary Box */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Score</span>
              <span className="text-xl font-arcade font-bold text-white">
                {score} / {questions.length}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-indigo-500/20">
              <span className="text-[10px] text-indigo-400 font-semibold uppercase block">Accuracy</span>
              <span className="text-xl font-arcade font-bold text-indigo-300">
                {accuracy}%
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-emerald-500/20">
              <span className="text-[10px] text-emerald-400 font-semibold uppercase block">Corrected</span>
              <span className="text-xl font-arcade font-bold text-emerald-400">
                +{correctedMistakeIds.length}
              </span>
            </div>
          </div>

          {/* XP Reward Banner */}
          <div className="mb-6 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Practice Session XP Awarded! Review logged successfully.</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={restartReview}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCw className="w-4 h-4" />
              <span>Practise Again</span>
            </button>

            <button
              onClick={() => {
                closeSmartReviewModal();
                openMistakesModal();
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-md shadow-indigo-600/20"
            >
              <BookOpen className="w-4 h-4" />
              <span>View My Mistakes</span>
            </button>

            <button
              onClick={closeSmartReviewModal}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-bold transition-colors"
            >
              Return to Arcade
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Active Question Runner
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-indigo-500/30 p-5 sm:p-8 text-slate-100 shadow-2xl relative flex flex-col max-h-[92vh] overflow-y-auto"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-arcade text-base sm:text-lg font-bold text-white tracking-wide">
                SMART REVIEW
              </h3>
              <p className="text-xs text-slate-400">
                {currentMeta.unitTitle} • {currentMeta.activityTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-slate-400">
              Q <strong className="text-cyan-400">{currentIndex + 1}</strong> / {questions.length}
            </span>
            <button
              onClick={closeSmartReviewModal}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden my-3 shrink-0">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-300"
            style={{ width: `${Math.round(((currentIndex + 1) / questions.length) * 100)}%` }}
          />
        </div>

        {/* Question Prompt */}
        <div className="my-4 p-5 sm:p-6 rounded-2xl bg-slate-950/70 border border-slate-800">
          {currentMeta.isFromMistake && (
            <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-mono font-bold mb-2 inline-block">
              Targeting Previously Missed Question
            </span>
          )}
          <h2 className="text-base sm:text-lg font-bold text-white leading-relaxed">
            {currentQ.prompt}
          </h2>
        </div>

        {/* Interactive Engine Input */}
        <div className="mb-6 flex-1">
          {gameType === 'sentence_builder' && sentenceQ ? (
            <div className="space-y-4">
              <div className="min-h-[50px] p-3 rounded-2xl bg-slate-950/80 border border-dashed border-indigo-500/30 flex flex-wrap gap-2">
                {selectedWords.length === 0 ? (
                  <span className="text-xs text-slate-500 italic">Tap words below to form sentence...</span>
                ) : (
                  selectedWords.map((w, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-xl bg-indigo-600 text-white text-xs font-bold">
                      {w}
                    </span>
                  ))
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {(sentenceQ.scrambledWords || []).map((w, idx) => (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handlePickWord(w)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200"
                  >
                    {w}
                  </button>
                ))}
              </div>

              {!isAnswered && (
                <button
                  disabled={selectedWords.length === 0}
                  onClick={handleCheckSentence}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                >
                  Check Sentence
                </button>
              )}
            </div>
          ) : gameType === 'true_false' ? (
            <div className="grid grid-cols-2 gap-4">
              <button
                disabled={isAnswered}
                onClick={() => handleSelectTrueFalse(true)}
                className={`p-4 rounded-2xl border-2 font-bold flex flex-col items-center gap-1 text-sm ${
                  isAnswered && selectedBool === true
                    ? isCorrect
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-600'
                }`}
              >
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <span>TRUE</span>
              </button>

              <button
                disabled={isAnswered}
                onClick={() => handleSelectTrueFalse(false)}
                className={`p-4 rounded-2xl border-2 font-bold flex flex-col items-center gap-1 text-sm ${
                  isAnswered && selectedBool === false
                    ? isCorrect
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-600'
                }`}
              >
                <XCircle className="w-6 h-6 text-rose-400" />
                <span>FALSE</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {((currentQ as MultipleChoiceQuestion).options || []).map((opt, idx) => {
                const mcQ = currentQ as MultipleChoiceQuestion;
                const isSelected = selectedIdx === idx;
                const isCorrectOption = idx === mcQ.correctOptionIndex;

                let btnStyle = 'bg-slate-900/80 border-slate-800 text-slate-200 hover:border-slate-600';
                if (isAnswered) {
                  if (isCorrectOption) {
                    btnStyle = 'bg-emerald-500/20 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-200 ring-2 ring-rose-500';
                  } else {
                    btnStyle = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-50';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`p-3.5 rounded-2xl border-2 text-left font-medium text-xs sm:text-sm transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && isCorrectOption && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                    {isAnswered && isSelected && !isCorrectOption && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Pedagogical Explanation & Next Button */}
        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3 pt-3 border-t border-slate-800 shrink-0"
            >
              <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 leading-relaxed">
                <span className="font-bold text-indigo-400 block text-[10px] uppercase tracking-wide mb-0.5">
                  Explanation:
                </span>
                {explanation}
              </div>

              <button
                onClick={handleNext}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <span>{currentIndex + 1 < questions.length ? 'Next Question' : 'View Results'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
