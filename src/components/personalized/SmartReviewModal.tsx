/**
 * UNIT REVIEW ARCADE — SMART REVIEW MODAL (PHASE 9E)
 * Version: 9.5.0
 * 
 * Colorful Game World + Bright Creative Campus redesign.
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
  BookOpen,
  AlertCircle,
  Layers
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

  // Question Engine & Option Validation
  const isMCQ =
    gameType === 'quiz_battle' ||
    gameType === 'match_it' ||
    gameType === 'reading_detective' ||
    gameType === 'train_station' ||
    Boolean((currentQ as MultipleChoiceQuestion)?.options);

  const mcOptions = (currentQ as MultipleChoiceQuestion)?.options || [];
  const isTF = gameType === 'true_false';
  const isSentence = gameType === 'sentence_builder';
  const sentenceQ = currentQ as SentenceBuilderQuestion | undefined;

  const isUnrenderable =
    !currentQ ||
    (isMCQ && mcOptions.length === 0) ||
    (isSentence && (!sentenceQ?.scrambledWords || sentenceQ.scrambledWords.length === 0)) ||
    (isTF && typeof (currentQ as TrueFalseQuestion)?.isTrue !== 'boolean');

  // Handle Multiple Choice & Match Options
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
      if (currentMeta.isFromMistake) {
        await retryMistakeQuestion(
          currentQ.id,
          currentMeta.activityId,
          currentMeta.unitId,
          false,
          mcQ.options[idx],
          mcQ.options[mcQ.correctOptionIndex],
          mcQ.prompt
        );
      }
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
      if (currentMeta.isFromMistake) {
        await retryMistakeQuestion(
          currentQ.id,
          currentMeta.activityId,
          currentMeta.unitId,
          false,
          boolVal ? 'True' : 'False',
          tfQ.isTrue ? 'True' : 'False',
          tfQ.prompt
        );
      }
    }
  };

  // Sentence Builder handlers
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
      if (currentMeta.isFromMistake) {
        await retryMistakeQuestion(
          currentQ.id,
          currentMeta.activityId,
          currentMeta.unitId,
          false,
          selectedWords.join(' '),
          sentenceQ.correctSentence,
          sentenceQ.prompt
        );
      }
    }
  };

  // Fallback Skip & Recovery actions to ensure session NEVER freezes
  const handleSkipQuestion = () => {
    sounds.playTap();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((idx) => idx + 1);
      setIsAnswered(false);
      setIsCorrect(false);
      setSelectedIdx(null);
      setSelectedBool(null);
      setSelectedWords([]);
    } else {
      sounds.playSuccess();
      completeSmartReviewSession(
        activeReviewSession.sessionId,
        score,
        questions.length,
        correctedMistakeIds
      );
      setCurrentIndex(questions.length);
    }
  };

  const handleMarkAsReviewed = async () => {
    sounds.playSuccess();
    setIsAnswered(true);
    setIsCorrect(true);
    setScore((s) => s + 1);

    if (currentMeta.isFromMistake) {
      setCorrectedMistakeIds((prev) => [...prev, currentQ.id]);
      await retryMistakeQuestion(
        currentQ.id,
        currentMeta.activityId,
        currentMeta.unitId,
        true,
        'Reviewed',
        (currentQ as any)?.correctAnswer || 'Reviewed',
        currentQ?.prompt || 'Question Review'
      );
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-xl rounded-3xl bg-white border-4 border-indigo-300 p-6 sm:p-8 text-center text-slate-800 shadow-2xl relative overflow-hidden"
        >
          <div className="w-18 h-18 rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white mx-auto mb-4 shadow-xl shadow-indigo-500/25">
            <Trophy className="w-9 h-9" />
          </div>

          <h2 className="font-bubble text-2xl font-bold text-slate-900 mb-1">
            SMART REVIEW COMPLETE!
          </h2>
          <p className="text-sm text-slate-500 font-medium mb-6">
            {activeReviewSession.title}
          </p>

          {/* Results Summary Box */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Score</span>
              <span className="text-xl font-mono font-black text-slate-800">
                {score} / {questions.length}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-50 border-2 border-indigo-200">
              <span className="text-[10px] text-indigo-700 font-bold uppercase tracking-wider block">Accuracy</span>
              <span className="text-xl font-mono font-black text-indigo-700">
                {accuracy}%
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-200">
              <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">Corrected</span>
              <span className="text-xl font-mono font-black text-emerald-700">
                +{correctedMistakeIds.length}
              </span>
            </div>
          </div>

          {/* XP Reward Banner */}
          <div className="mb-6 p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-2">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Practice Session XP Awarded! Review logged successfully.</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={restartReview}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-slate-200"
            >
              <RotateCw className="w-4 h-4" />
              <span>Practise Again</span>
            </button>

            <button
              onClick={() => {
                closeSmartReviewModal();
                openMistakesModal();
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-md shadow-indigo-600/20"
            >
              <BookOpen className="w-4 h-4" />
              <span>View My Mistakes</span>
            </button>

            <button
              onClick={closeSmartReviewModal}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-bold transition-colors"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-2xl rounded-3xl bg-white border-4 border-indigo-300 p-5 sm:p-8 text-slate-800 shadow-2xl relative flex flex-col max-h-[92vh] overflow-y-auto"
      >
        {/* Soft Ambient Indigo Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-indigo-100 shrink-0 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-xs">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bubble text-base sm:text-lg font-bold text-slate-900 tracking-wide">
                SMART REVIEW
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {currentMeta.unitTitle} • {currentMeta.activityTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xs font-mono font-bold text-slate-500">
              Q <strong className="text-indigo-600 font-black">{currentIndex + 1}</strong> / {questions.length}
            </span>
            <button
              onClick={handleSkipQuestion}
              title="Skip this question"
              className="text-[11px] font-bold text-slate-400 hover:text-slate-600 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Skip
            </button>
            <button
              onClick={closeSmartReviewModal}
              className="p-2.5 rounded-xl bg-slate-100 text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden my-3 shrink-0 p-0.5 relative z-10">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${Math.round(((currentIndex + 1) / questions.length) * 100)}%` }}
          />
        </div>

        {/* Question Prompt */}
        <div className="my-4 p-5 sm:p-6 rounded-2xl bg-slate-50 border-2 border-slate-200 relative z-10 shadow-xs">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {currentMeta.isFromMistake && (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-mono font-bold">
                Targeting Previously Missed Question
              </span>
            )}
            {gameType === 'match_it' && (
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 text-[10px] font-mono font-bold flex items-center gap-1">
                <Layers className="w-3 h-3 text-purple-600" />
                Vocabulary Match
              </span>
            )}
          </div>

          {gameType === 'match_it' ? (
            <div>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1.5">
                Match the term with its correct definition:
              </span>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-50 border-2 border-purple-200 text-purple-900 font-bubble text-lg sm:text-xl font-bold tracking-wide shadow-xs">
                <span>{(currentQ as any)?.leftText || currentQ.prompt.replace(/^Match:\s*/i, '')}</span>
              </div>
            </div>
          ) : (
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              {currentQ.prompt}
            </h2>
          )}
        </div>

        {/* Interactive Engine Input */}
        <div className="mb-6 flex-1 relative z-10">
          {isUnrenderable ? (
            /* Fallback Recovery Card — Student is NEVER blocked */
            <div className="p-5 sm:p-6 rounded-2xl bg-amber-50 border-2 border-amber-200 text-slate-800 space-y-3.5 shadow-xs">
              <div className="flex items-center gap-2.5 text-amber-800 font-bold text-sm">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <span>Review Item Details</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {(currentQ as any)?.explanation || 'This review question does not require multiple choice interaction. Review the prompt and continue.'}
              </p>
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <button
                  onClick={handleSkipQuestion}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>Skip Question</span>
                </button>
                <button
                  onClick={handleMarkAsReviewed}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark as Reviewed & Continue</span>
                </button>
              </div>
            </div>
          ) : gameType === 'sentence_builder' && sentenceQ ? (
            <div className="space-y-4">
              <div className="min-h-[50px] p-3 rounded-2xl bg-slate-50 border-2 border-dashed border-indigo-300 flex flex-wrap gap-2">
                {selectedWords.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">Tap words below to form sentence...</span>
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
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-800 transition-colors shadow-xs"
                  >
                    {w}
                  </button>
                ))}
              </div>

              {!isAnswered && (
                <button
                  disabled={selectedWords.length === 0}
                  onClick={handleCheckSentence}
                  className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold shadow-md transition-all"
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
                className={`p-4 rounded-2xl border-2 font-bold flex flex-col items-center gap-1.5 text-sm transition-all shadow-xs ${
                  isAnswered && selectedBool === true
                    ? isCorrect
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-200'
                      : 'bg-rose-50 border-rose-400 text-rose-900 ring-2 ring-rose-200'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <span>TRUE</span>
              </button>

              <button
                disabled={isAnswered}
                onClick={() => handleSelectTrueFalse(false)}
                className={`p-4 rounded-2xl border-2 font-bold flex flex-col items-center gap-1.5 text-sm transition-all shadow-xs ${
                  isAnswered && selectedBool === false
                    ? isCorrect
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-200'
                      : 'bg-rose-50 border-rose-400 text-rose-900 ring-2 ring-rose-200'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <XCircle className="w-6 h-6 text-rose-600" />
                <span>FALSE</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {mcOptions.map((opt, idx) => {
                const mcQ = currentQ as MultipleChoiceQuestion;
                const isSelected = selectedIdx === idx;
                const isCorrectOption = idx === mcQ.correctOptionIndex;
                const optionLetter = String.fromCharCode(65 + idx);

                let btnStyle = 'bg-white border-slate-200 text-slate-800 hover:border-indigo-300 hover:bg-indigo-50/20';
                if (isAnswered) {
                  if (isCorrectOption) {
                    btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-2 ring-emerald-200';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-200';
                  } else {
                    btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`p-4 rounded-2xl border-2 text-left font-bold text-xs sm:text-sm transition-all flex items-start justify-between gap-3 shadow-xs ${btnStyle}`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-mono font-black shrink-0 mt-0.5 ${
                        isAnswered && isCorrectOption
                          ? 'bg-emerald-600 text-white'
                          : isAnswered && isSelected
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {optionLetter}
                      </span>
                      <span className="leading-snug">{opt}</span>
                    </div>
                    {isAnswered && isCorrectOption && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
                    {isAnswered && isSelected && !isCorrectOption && <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
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
              className="space-y-3 pt-3 border-t border-slate-200 shrink-0 relative z-10"
            >
              <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950 leading-relaxed shadow-xs">
                <span className="font-bold text-indigo-700 block text-[10px] uppercase tracking-wide mb-0.5">
                  Explanation:
                </span>
                {explanation}
              </div>

              <button
                onClick={handleNext}
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
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
