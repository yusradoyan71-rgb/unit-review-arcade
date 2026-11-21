/**
 * UNIT REVIEW ARCADE — QUESTION PREVIEW MODAL (PHASE 2)
 * Version: 2.0.0
 * 
 * Interactive game-skin simulator allowing teachers to test and verify questions
 * exactly as students experience them in live games.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Sparkles,
  BookOpen,
  Edit,
  Gamepad2,
} from 'lucide-react';
import type { QuestionBankItem } from '../../../../types/questionBank';

interface QuestionPreviewModalProps {
  isOpen: boolean;
  question: QuestionBankItem | null;
  onClose: () => void;
  onEdit?: (question: QuestionBankItem) => void;
}

export const QuestionPreviewModal: React.FC<QuestionPreviewModalProps> = ({
  isOpen,
  question,
  onClose,
  onEdit,
}) => {
  // Multiple Choice / Reading Simulation State
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);

  // Sentence Builder Simulation State
  const [placedWords, setPlacedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<Array<{ id: number; word: string }>>([]);
  const [sentenceResult, setSentenceResult] = useState<'correct' | 'incorrect' | null>(null);

  // True / False State
  const [selectedTf, setSelectedTf] = useState<boolean | null>(null);

  // Reset simulation when question changes or modal opens
  useEffect(() => {
    if (!question) return;

    setSelectedOption(null);
    setIsAnswerRevealed(false);
    setSelectedTf(null);
    setSentenceResult(null);

    if (question.questionType === 'sentence_builder') {
      const words = question.payload.scrambledWords || question.prompt.split(' ');
      setAvailableWords(words.map((w, idx) => ({ id: idx, word: w })));
      setPlacedWords([]);
    }
  }, [question, isOpen]);

  if (!isOpen || !question) return null;

  const handleReset = () => {
    setSelectedOption(null);
    setIsAnswerRevealed(false);
    setSelectedTf(null);
    setSentenceResult(null);

    if (question.questionType === 'sentence_builder') {
      const words = question.payload.scrambledWords || question.prompt.split(' ');
      setAvailableWords(words.map((w, idx) => ({ id: idx, word: w })));
      setPlacedWords([]);
    }
  };

  const handleSentenceWordClick = (wordObj: { id: number; word: string }) => {
    setAvailableWords((prev) => prev.filter((item) => item.id !== wordObj.id));
    setPlacedWords((prev) => [...prev, wordObj.word]);
    setSentenceResult(null);
  };

  const handlePlacedWordRemove = (index: number) => {
    const word = placedWords[index];
    setPlacedWords((prev) => prev.filter((_, i) => i !== index));
    setAvailableWords((prev) => [...prev, { id: Date.now() + index, word }]);
    setSentenceResult(null);
  };

  const handleCheckSentence = () => {
    const assembled = placedWords.join(' ').trim();
    const target = (question.payload.correctSentence || '').trim();
    const accepted = question.payload.acceptedAnswers || [];

    const isMatch = assembled.toLowerCase() === target.toLowerCase() ||
      accepted.some((ans) => ans.trim().toLowerCase() === assembled.toLowerCase());

    setSentenceResult(isMatch ? 'correct' : 'incorrect');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/65 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="relative w-full max-w-2xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-xs border border-white/15">
                <Play className="w-5 h-5 text-indigo-200" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold tracking-tight">Interactive Game Preview</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                    {question.questionType.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-indigo-200 font-medium">
                  {question.topic} • {question.skill.toUpperCase()} • {question.difficulty.toUpperCase()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleReset}
                className="p-2 rounded-xl text-indigo-200 hover:text-white hover:bg-white/10 transition-colors"
                title="Reset simulation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              {onEdit && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onEdit(question);
                  }}
                  className="p-2 rounded-xl text-indigo-200 hover:text-white hover:bg-white/10 transition-colors"
                  title="Edit question"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-indigo-200 hover:text-white hover:bg-white/10 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Interactive Game Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* Reading Passage if applicable */}
            {question.questionType === 'reading_passage' && question.payload.passageText && (
              <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200 space-y-2">
                <div className="flex items-center gap-2 text-cyan-900 font-bold text-xs uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 text-cyan-600" />
                  <span>{question.payload.passageTitle || 'Comprehension Passage'}</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic bg-white/80 p-3 rounded-xl border border-cyan-100">
                  {question.payload.passageText}
                </p>
              </div>
            )}

            {/* Question Prompt Card */}
            <div className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <span>Prompt</span>
                <span className="text-indigo-600 font-bold">{question.points} Points</span>
              </div>
              <h4 className="text-base font-bold text-slate-900 leading-snug">
                {question.prompt}
              </h4>
            </div>

            {/* Simulation Type A: Multiple Choice / Reading Passage */}
            {(question.questionType === 'multiple_choice' || question.questionType === 'reading_passage') && (
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Select an option to test answer response:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(question.payload.options || []).map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === question.payload.correctOptionIndex;

                    let btnStyle = 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800';
                    if (isAnswerRevealed) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold shadow-xs';
                      } else if (isSelected) {
                        btnStyle = 'bg-rose-50 border-rose-400 text-rose-900';
                      } else {
                        btnStyle = 'bg-slate-50 opacity-50 border-slate-200 text-slate-500';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedOption(idx);
                          setIsAnswerRevealed(true);
                        }}
                        className={`p-3.5 rounded-xl border-2 text-left text-xs font-medium flex items-center justify-between transition-all ${btnStyle}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-lg bg-slate-100 font-bold text-[11px] text-slate-700 flex items-center justify-center shrink-0">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {isAnswerRevealed && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        )}
                        {isAnswerRevealed && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Simulation Type B: True / False */}
            {question.questionType === 'true_false' && (
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Click TRUE or FALSE to test response:
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTf(true);
                      setIsAnswerRevealed(true);
                    }}
                    className={`py-4 px-6 rounded-2xl border-2 text-sm font-extrabold flex items-center justify-center gap-2 transition-all ${
                      isAnswerRevealed
                        ? question.payload.isTrue === true
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm'
                          : selectedTf === true
                          ? 'bg-rose-50 border-rose-400 text-rose-900'
                          : 'bg-slate-50 opacity-40 border-slate-200'
                        : 'bg-white hover:bg-emerald-50/60 border-slate-200 text-emerald-700'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>TRUE</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTf(false);
                      setIsAnswerRevealed(true);
                    }}
                    className={`py-4 px-6 rounded-2xl border-2 text-sm font-extrabold flex items-center justify-center gap-2 transition-all ${
                      isAnswerRevealed
                        ? question.payload.isTrue === false
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm'
                          : selectedTf === false
                          ? 'bg-rose-50 border-rose-400 text-rose-900'
                          : 'bg-slate-50 opacity-40 border-slate-200'
                        : 'bg-white hover:bg-rose-50/60 border-slate-200 text-rose-700'
                    }`}
                  >
                    <XCircle className="w-5 h-5 text-rose-600" />
                    <span>FALSE</span>
                  </button>
                </div>
              </div>
            )}

            {/* Simulation Type C: Sentence Builder */}
            {question.questionType === 'sentence_builder' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Assembled Sentence:
                  </span>
                  <div className="min-h-16 p-3 rounded-2xl bg-purple-50/60 border-2 border-dashed border-purple-300 flex flex-wrap gap-2 items-center">
                    {placedWords.length === 0 ? (
                      <span className="text-xs text-purple-400 font-medium italic">
                        Tap word chips below to build the sentence...
                      </span>
                    ) : (
                      placedWords.map((word, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handlePlacedWordRemove(idx)}
                          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-transform active:scale-95"
                          title="Click to remove"
                        >
                          {word}
                        </button>
                      ))
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Available Word Bank:
                  </span>
                  <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    {availableWords.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSentenceWordClick(item)}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50 border border-slate-300 text-slate-800 font-medium text-xs shadow-2xs transition-all active:scale-95"
                      >
                        {item.word}
                      </button>
                    ))}
                    {availableWords.length === 0 && (
                      <span className="text-xs text-slate-400 italic">All words used.</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={handleCheckSentence}
                    disabled={placedWords.length === 0}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs disabled:opacity-40 transition-colors"
                  >
                    Check Assembled Sentence
                  </button>

                  {sentenceResult === 'correct' && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Perfect Match!</span>
                    </span>
                  )}
                  {sentenceResult === 'incorrect' && (
                    <span className="text-xs font-bold text-rose-600 flex items-center gap-1.5">
                      <XCircle className="w-4 h-4" />
                      <span>Not quite right. Try reordering.</span>
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Simulation Type D: Match It */}
            {question.questionType === 'match_it' && (
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Interactive Matching Pairs Preview:
                </span>
                <div className="grid grid-cols-2 gap-3">
                  {(question.payload.pairs || []).map((pair) => (
                    <div
                      key={pair.id}
                      className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-between text-xs"
                    >
                      <span className="font-bold text-indigo-950">{pair.left}</span>
                      <span className="text-indigo-400 font-bold">↔</span>
                      <span className="font-semibold text-indigo-800">{pair.right}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pedagogical Explanation Banner */}
            {question.explanation && (
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-950">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Pedagogical Explanation:</span>
                </div>
                <p className="leading-relaxed pl-5 text-amber-800">
                  {question.explanation}
                </p>
              </div>
            )}

            {/* Metadata Footer */}
            <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  ID: {question.id}
                </span>
                <span className="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  v{question.contentVersion}
                </span>
                <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  {question.section === 'both' ? 'Unit Review & General' : question.section.replace('_', ' ')}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[11px]">
                <Gamepad2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Plays in: <strong>{question.assignedGameTypes.join(', ')}</strong></span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
