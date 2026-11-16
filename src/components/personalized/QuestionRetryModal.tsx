/**
 * UNIT REVIEW ARCADE — QUESTION RETRY MODAL (PHASE 6)
 * Version: 6.0.0
 * 
 * Interactive question retry runner: allows students to re-attempt any
 * missed question with instant pedagogical feedback and correction tracking.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useArcade } from '../../context/ArcadeContext';
import { usePersonalizedLearning } from '../../context/PersonalizedLearningContext';
import { sounds } from '../../services/soundEffects';
import { ExplanationService } from '../../services/explanationService';
import { PersonalizedLearningService } from '../../services/personalizedLearningService';
import type { StudentMistakeRecord } from '../../types/personalizedLearning';
import type { 
  MultipleChoiceQuestion, 
  SentenceBuilderQuestion, 
  TrueFalseQuestion 
} from '../../types/schema';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  RotateCw, 
  Award,
  ChevronRight,
  BookOpen
} from 'lucide-react';

interface QuestionRetryModalProps {
  mistake: StudentMistakeRecord;
  onClose: () => void;
  onCorrected?: () => void;
}

export const QuestionRetryModal: React.FC<QuestionRetryModalProps> = ({
  mistake,
  onClose,
  onCorrected,
}) => {
  const { data } = useArcade();
  const { retryMistakeQuestion } = usePersonalizedLearning();

  // Find original question object in curriculum
  const found = PersonalizedLearningService.findQuestionInCurriculum(
    data,
    mistake.questionId,
    mistake.activityId,
    mistake.unitId
  );

  const question = found?.question;
  const gameType = found?.gameType || mistake.gameType || 'quiz_battle';

  // Multiple Choice / True-False state
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [selectedBool, setSelectedBool] = useState<boolean | null>(null);

  // Sentence Builder state
  const sentenceQ = question as SentenceBuilderQuestion | undefined;
  const scrambled = sentenceQ?.scrambledWords || [];
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>(scrambled);

  // Resolution state
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pedagogical explanation
  const explanation = ExplanationService.getExplanation(question, gameType, mistake.correctAnswer).explanation;

  // Handle Multiple Choice Selection
  const handleSelectOption = async (idx: number, optText: string) => {
    if (isAnswered || isSubmitting) return;
    sounds.playTap();
    setSelectedIdx(idx);
    setIsSubmitting(true);

    const mcQ = question as MultipleChoiceQuestion | undefined;
    const correctIdx = mcQ?.correctOptionIndex !== undefined ? mcQ.correctOptionIndex : -1;
    const answeredCorrectly = idx === correctIdx || optText.trim().toLowerCase() === mistake.correctAnswer.trim().toLowerCase();

    setIsCorrect(answeredCorrectly);
    setIsAnswered(true);

    if (answeredCorrectly) {
      sounds.playSuccess();
    } else {
      sounds.playBack();
    }

    await retryMistakeQuestion(
      mistake.questionId,
      mistake.activityId,
      mistake.unitId,
      answeredCorrectly,
      optText,
      mistake.correctAnswer,
      mistake.questionPrompt
    );

    setIsSubmitting(false);
    if (answeredCorrectly && onCorrected) {
      onCorrected();
    }
  };

  // Handle True / False Selection
  const handleSelectTrueFalse = async (boolVal: boolean) => {
    if (isAnswered || isSubmitting) return;
    sounds.playTap();
    setSelectedBool(boolVal);
    setIsSubmitting(true);

    const tfQ = question as TrueFalseQuestion | undefined;
    const correctBool = tfQ?.isTrue !== undefined ? tfQ.isTrue : mistake.correctAnswer.toLowerCase().includes('true');
    const answeredCorrectly = boolVal === correctBool;

    setIsCorrect(answeredCorrectly);
    setIsAnswered(true);

    if (answeredCorrectly) {
      sounds.playSuccess();
    } else {
      sounds.playBack();
    }

    await retryMistakeQuestion(
      mistake.questionId,
      mistake.activityId,
      mistake.unitId,
      answeredCorrectly,
      boolVal ? 'True' : 'False',
      correctBool ? 'True' : 'False',
      mistake.questionPrompt
    );

    setIsSubmitting(false);
    if (answeredCorrectly && onCorrected) {
      onCorrected();
    }
  };

  // Sentence Builder helpers
  const handlePickWord = (word: string, index: number) => {
    if (isAnswered) return;
    sounds.playTap();
    setSelectedWords((prev) => [...prev, word]);
    setAvailableWords((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleRemoveWord = (word: string, index: number) => {
    if (isAnswered) return;
    sounds.playTap();
    setSelectedWords((prev) => prev.filter((_, idx) => idx !== index));
    setAvailableWords((prev) => [...prev, word]);
  };

  const handleCheckSentence = async () => {
    if (isAnswered || isSubmitting) return;
    sounds.playTap();
    setIsSubmitting(true);

    const constructed = selectedWords.join(' ').trim();
    const cleanConstructed = constructed.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
    const cleanTarget = (sentenceQ?.correctSentence || mistake.correctAnswer).toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();

    const answeredCorrectly = cleanConstructed === cleanTarget;
    setIsCorrect(answeredCorrectly);
    setIsAnswered(true);

    if (answeredCorrectly) {
      sounds.playSuccess();
    } else {
      sounds.playBack();
    }

    await retryMistakeQuestion(
      mistake.questionId,
      mistake.activityId,
      mistake.unitId,
      answeredCorrectly,
      constructed,
      sentenceQ?.correctSentence || mistake.correctAnswer,
      mistake.questionPrompt
    );

    setIsSubmitting(false);
    if (answeredCorrectly && onCorrected) {
      onCorrected();
    }
  };

  const handleResetTryAgain = () => {
    sounds.playTap();
    setIsAnswered(false);
    setIsCorrect(false);
    setSelectedIdx(null);
    setSelectedBool(null);
    if (sentenceQ?.scrambledWords) {
      setAvailableWords(sentenceQ.scrambledWords);
      setSelectedWords([]);
    }
  };

  // Render options for multiple choice
  const mcOptions = (question as MultipleChoiceQuestion)?.options || [
    mistake.correctAnswer,
    mistake.studentResponse,
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-indigo-500/30 p-6 sm:p-8 text-slate-100 shadow-2xl relative flex flex-col max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-arcade text-base sm:text-lg font-bold text-white tracking-wide">
                RETRY QUESTION
              </h3>
              <p className="text-xs text-slate-400">
                {mistake.unitTitle} • {mistake.activityTitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Question Prompt */}
        <div className="my-6 p-5 sm:p-6 rounded-2xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">
            <BookOpen className="w-4 h-4" />
            <span>Question Prompt</span>
          </div>
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-white leading-relaxed">
            {mistake.questionPrompt}
          </h2>
        </div>

        {/* Interactive Engine Input */}
        <div className="mb-6 flex-1">
          {/* 1. Sentence Builder Scramble */}
          {gameType === 'sentence_builder' ? (
            <div className="space-y-4">
              {/* Construction Area */}
              <div className="min-h-[60px] p-4 rounded-2xl bg-slate-950/80 border-2 border-dashed border-indigo-500/30 flex flex-wrap items-center gap-2">
                {selectedWords.length === 0 ? (
                  <span className="text-xs text-slate-500 font-medium italic">
                    Tap word tiles below to build the correct sentence...
                  </span>
                ) : (
                  selectedWords.map((w, idx) => (
                    <button
                      key={`selected-${idx}`}
                      disabled={isAnswered}
                      onClick={() => handleRemoveWord(w, idx)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-rose-600 text-white font-medium text-sm transition-all"
                    >
                      {w}
                    </button>
                  ))
                )}
              </div>

              {/* Scrambled Word Pool */}
              <div className="flex flex-wrap gap-2 pt-2">
                {availableWords.map((w, idx) => (
                  <button
                    key={`pool-${idx}`}
                    disabled={isAnswered}
                    onClick={() => handlePickWord(w, idx)}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-indigo-600/30 border border-slate-700 text-slate-200 font-medium text-sm transition-all hover:scale-105"
                  >
                    {w}
                  </button>
                ))}
              </div>

              {!isAnswered && (
                <button
                  disabled={selectedWords.length === 0}
                  onClick={handleCheckSentence}
                  className="w-full mt-3 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm transition-all"
                >
                  Check Sentence
                </button>
              )}
            </div>
          ) : gameType === 'true_false' ? (
            /* 2. True / False Binary Selection */
            <div className="grid grid-cols-2 gap-4">
              <button
                disabled={isAnswered}
                onClick={() => handleSelectTrueFalse(true)}
                className={`p-5 rounded-2xl border-2 font-bold text-base sm:text-lg flex flex-col items-center gap-2 transition-all ${
                  isAnswered && selectedBool === true
                    ? isCorrect
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-600'
                }`}
              >
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                <span>TRUE</span>
              </button>

              <button
                disabled={isAnswered}
                onClick={() => handleSelectTrueFalse(false)}
                className={`p-5 rounded-2xl border-2 font-bold text-base sm:text-lg flex flex-col items-center gap-2 transition-all ${
                  isAnswered && selectedBool === false
                    ? isCorrect
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-600'
                }`}
              >
                <XCircle className="w-8 h-8 text-rose-400" />
                <span>FALSE</span>
              </button>
            </div>
          ) : (
            /* 3. Multiple Choice (Quiz Battle, Reading Detective, Train Station, Default) */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {mcOptions.map((opt, idx) => {
                const isSelected = selectedIdx === idx;
                let btnStyle = 'bg-slate-900/80 border-slate-800 text-slate-200 hover:border-slate-600 hover:bg-slate-850';

                if (isAnswered) {
                  if (opt.trim().toLowerCase() === mistake.correctAnswer.trim().toLowerCase()) {
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
                    onClick={() => handleSelectOption(idx, opt)}
                    className={`p-4 rounded-2xl border-2 text-left font-medium text-sm sm:text-base transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && opt.trim().toLowerCase() === mistake.correctAnswer.trim().toLowerCase() && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Post-Answer Feedback & Pedagogical Explanation */}
        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-4 pt-4 border-t border-slate-800 shrink-0"
            >
              {/* Status Banner */}
              {isCorrect ? (
                <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between text-emerald-300">
                  <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Mistake Corrected! Outstanding job!</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    +10 XP
                  </span>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-between text-rose-300">
                  <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
                    <XCircle className="w-5 h-5 text-rose-400" />
                    <span>Not quite right. Review the explanation below.</span>
                  </div>
                  <button
                    onClick={handleResetTryAgain}
                    className="px-2.5 py-1 rounded-lg bg-rose-500/20 border border-rose-500/40 text-xs font-bold flex items-center gap-1 hover:bg-rose-500/30 transition-colors"
                  >
                    <RotateCw className="w-3 h-3" />
                    Try Again
                  </button>
                </div>
              )}

              {/* Pedagogical Explanation Card */}
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs sm:text-sm text-indigo-300 leading-relaxed">
                <span className="font-bold text-indigo-400 block text-xs uppercase tracking-wide mb-1">
                  Why This Answer?
                </span>
                {explanation}
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <span>Continue Review</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
