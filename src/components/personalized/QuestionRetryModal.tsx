/**
 * UNIT REVIEW ARCADE — QUESTION RETRY MODAL (PHASE 9E)
 * Version: 9.5.0
 * 
 * Colorful Game World + Bright Creative Campus redesign.
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
  const isCompatible = question ? PersonalizedLearningService.isMistakeCompatible(mistake, question) : true;
  const isSuperseded = mistake.isSuperseded || !isCompatible;

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
    const rightText = (question as any)?.rightText;
    const currentCorrectAnswer = (question as any)?.correctAnswer || (mcQ?.options && correctIdx >= 0 ? mcQ.options[correctIdx] : null);
    const answeredCorrectly =
      idx === correctIdx ||
      (currentCorrectAnswer && optText.trim().toLowerCase() === currentCorrectAnswer.trim().toLowerCase()) ||
      optText.trim().toLowerCase() === mistake.correctAnswer.trim().toLowerCase() ||
      mistake.correctAnswer.toLowerCase().endsWith(optText.trim().toLowerCase()) ||
      (rightText && optText.trim().toLowerCase() === rightText.trim().toLowerCase());

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-2xl rounded-3xl bg-white border-4 border-indigo-300 p-6 sm:p-8 text-slate-800 shadow-2xl relative flex flex-col max-h-[90vh] overflow-y-auto"
      >
        {/* Soft Ambient Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-indigo-100 shrink-0 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bubble text-base sm:text-lg font-bold text-slate-900 tracking-wide">
                RETRY QUESTION
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {mistake.unitTitle} • {mistake.activityTitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-slate-100 text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Question Prompt */}
        <div className="my-5 p-5 sm:p-6 rounded-2xl bg-slate-50 border-2 border-slate-200 relative z-10 shadow-xs">
          {isSuperseded && (
            <div className="mb-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-bold text-[10px] uppercase">Curriculum Updated</span>
              <span>This question was refined for clarity. You are practicing the updated version!</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>{gameType === 'match_it' ? 'Match It! Vocabulary Pair' : 'Question Prompt'}</span>
          </div>
          {gameType === 'match_it' ? (
            <div>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1.5">
                Match the term with its correct definition:
              </span>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-50 border-2 border-purple-200 text-purple-900 font-bubble text-lg sm:text-xl font-bold tracking-wide shadow-xs">
                <span>{(question as any)?.leftText || mistake.questionPrompt.replace(/^Match:\s*/i, '')}</span>
              </div>
            </div>
          ) : (
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 leading-relaxed">
              {question?.prompt || mistake.questionPrompt}
            </h2>
          )}
        </div>

        {/* Interactive Engine Input */}
        <div className="mb-6 flex-1 relative z-10">
          {/* 1. Sentence Builder Scramble */}
          {gameType === 'sentence_builder' ? (
            <div className="space-y-4">
              {/* Construction Area */}
              <div className="min-h-[60px] p-4 rounded-2xl bg-slate-50 border-2 border-dashed border-indigo-300 flex flex-wrap items-center gap-2">
                {selectedWords.length === 0 ? (
                  <span className="text-xs text-slate-400 font-medium italic">
                    Tap word tiles below to build the correct sentence...
                  </span>
                ) : (
                  selectedWords.map((w, idx) => (
                    <button
                      key={`selected-${idx}`}
                      disabled={isAnswered}
                      onClick={() => handleRemoveWord(w, idx)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-rose-600 text-white font-bold text-xs sm:text-sm transition-all shadow-xs"
                    >
                      {w}
                    </button>
                  ))
                )}
              </div>

              {/* Scrambled Word Pool */}
              <div className="flex flex-wrap gap-2 pt-1">
                {availableWords.map((w, idx) => (
                  <button
                    key={`pool-${idx}`}
                    disabled={isAnswered}
                    onClick={() => handlePickWord(w, idx)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-all shadow-xs hover:scale-105"
                  >
                    {w}
                  </button>
                ))}
              </div>

              {!isAnswered && (
                <button
                  disabled={selectedWords.length === 0}
                  onClick={handleCheckSentence}
                  className="w-full mt-3 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all"
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
                className={`p-5 rounded-2xl border-2 font-bold text-base sm:text-lg flex flex-col items-center gap-2 transition-all shadow-xs ${
                  isAnswered && selectedBool === true
                    ? isCorrect
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-2 ring-emerald-200'
                      : 'bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-200'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                <span>TRUE</span>
              </button>

              <button
                disabled={isAnswered}
                onClick={() => handleSelectTrueFalse(false)}
                className={`p-5 rounded-2xl border-2 font-bold text-base sm:text-lg flex flex-col items-center gap-2 transition-all shadow-xs ${
                  isAnswered && selectedBool === false
                    ? isCorrect
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-2 ring-emerald-200'
                      : 'bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-200'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <XCircle className="w-8 h-8 text-rose-600" />
                <span>FALSE</span>
              </button>
            </div>
          ) : (
            /* 3. Multiple Choice & Vocabulary Matching */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {mcOptions.map((opt, idx) => {
                const isSelected = selectedIdx === idx;
                const mcQ = question as MultipleChoiceQuestion | undefined;
                const correctIdx = mcQ?.correctOptionIndex !== undefined ? mcQ.correctOptionIndex : -1;
                const rightText = (question as any)?.rightText;
                const isThisCorrect =
                  idx === correctIdx ||
                  opt.trim().toLowerCase() === mistake.correctAnswer.trim().toLowerCase() ||
                  mistake.correctAnswer.toLowerCase().endsWith(opt.trim().toLowerCase()) ||
                  (rightText && opt.trim().toLowerCase() === rightText.trim().toLowerCase());

                let btnStyle = 'bg-white border-slate-200 text-slate-800 hover:border-indigo-300 hover:bg-indigo-50/20';

                if (isAnswered) {
                  if (isThisCorrect) {
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
                    onClick={() => handleSelectOption(idx, opt)}
                    className={`p-4 rounded-2xl border-2 text-left font-bold text-xs sm:text-sm transition-all flex items-center justify-between gap-3 shadow-xs ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && isThisCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {isAnswered && isSelected && !isThisCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
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
              className="space-y-4 pt-4 border-t border-slate-200 shrink-0 relative z-10"
            >
              {/* Status Banner */}
              {isCorrect ? (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-200 flex items-center justify-between text-emerald-900 shadow-xs">
                  <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Mistake Corrected! Outstanding job!</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-xs font-mono font-bold flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-emerald-600" />
                    +10 XP
                  </span>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-200 flex items-center justify-between text-rose-900 shadow-xs">
                  <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
                    <XCircle className="w-5 h-5 text-rose-600" />
                    <span>Not quite right. Review the explanation below.</span>
                  </div>
                  <button
                    onClick={handleResetTryAgain}
                    className="px-3 py-1 rounded-xl bg-rose-100 hover:bg-rose-200 border border-rose-300 text-rose-800 text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    Try Again
                  </button>
                </div>
              )}

              {/* Pedagogical Explanation Card */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs sm:text-sm text-indigo-950 leading-relaxed shadow-xs">
                <span className="font-bold text-indigo-700 block text-xs uppercase tracking-wide mb-1">
                  Why This Answer?
                </span>
                {explanation}
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
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
