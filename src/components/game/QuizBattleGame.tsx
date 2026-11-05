import React, { useState } from 'react';
import type { Activity, MultipleChoiceQuestion } from '../../types/schema';
import { motion } from 'framer-motion';
import { sounds } from '../../services/soundEffects';
import { useGameTracking } from '../../context/GameTrackingContext';
import { GameResultsModal } from './GameResultsModal';
import { ClassroomScoreboard } from './ClassroomScoreboard';
import { 
  ArrowLeft, 
  Eye, 
  ChevronRight, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Sparkles
} from 'lucide-react';

interface QuizBattleGameProps {
  activity: Activity;
  onExit: () => void;
}

export const QuizBattleGame: React.FC<QuizBattleGameProps> = ({ activity, onExit }) => {
  const questions = (activity.questions || []) as MultipleChoiceQuestion[];
  const { recordAnswer, completeGame } = useGameTracking();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const currentQ = questions[currentIndex];
  const isAnswered = selectedOption !== null || isAnswerRevealed;

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;

    setSelectedOption(idx);
    const isCorrect = idx === currentQ.correctOptionIndex;

    recordAnswer({
      questionId: currentQ.id,
      questionOrder: currentIndex + 1,
      questionPrompt: currentQ.prompt,
      studentResponse: currentQ.options[idx] || `Option ${idx}`,
      correctAnswer: currentQ.options[currentQ.correctOptionIndex] || `Option ${currentQ.correctOptionIndex}`,
      isCorrect,
    });

    if (isCorrect) {
      sounds.playSuccess();
      setScore((s) => s + 1);
    } else {
      sounds.playBack();
    }
  };

  const handleRevealAnswer = () => {
    if (isAnswered) return;
    sounds.playTap();
    setIsAnswerRevealed(true);

    recordAnswer({
      questionId: currentQ.id,
      questionOrder: currentIndex + 1,
      questionPrompt: currentQ.prompt,
      studentResponse: '[Revealed without answering]',
      correctAnswer: currentQ.options[currentQ.correctOptionIndex] || `Option ${currentQ.correctOptionIndex}`,
      isCorrect: false,
    });
  };

  const handleNextQuestion = () => {
    sounds.playTap();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
    } else {
      setIsGameOver(true);
      completeGame({
        score,
        totalQuestions: questions.length,
      });
    }
  };

  const handleRestart = () => {
    sounds.playTap();
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerRevealed(false);
    setScore(0);
    setIsGameOver(false);
  };

  if (!currentQ || questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 text-center bg-slate-900 rounded-3xl border border-slate-800">
        <HelpCircle className="w-12 h-12 text-slate-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">No Questions in This Activity</h3>
        <p className="text-slate-400 text-sm mb-6">This activity collection does not have any questions configured.</p>
        <button
          onClick={onExit}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm"
        >
          Return to Unit
        </button>
      </div>
    );
  }

  const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

  return (
    <div className="w-full max-w-5xl mx-auto py-4 px-4 flex flex-col min-h-[calc(100vh-5rem)]">
      {/* Team Scoreboard Component */}
      <ClassroomScoreboard />

      {/* Top Bar: Navigation, Progress & Score (Unlimited Time) */}
      <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
        <button
          onClick={onExit}
          className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Unit</span>
        </button>

        {/* Question Counter */}
        <div className="flex items-center gap-2">
          <span className="font-arcade text-sm font-bold text-slate-400 uppercase tracking-wider">
            Question
          </span>
          <span className="font-mono text-base font-extrabold px-3 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>

        {/* Score Counter */}
        <div className="text-xs font-mono font-bold text-slate-400">
          Score: <span className="text-emerald-400 font-extrabold">{score}</span> / {questions.length}
        </div>
      </div>

      {/* Question Card */}
      <motion.div
        key={currentQ.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col justify-between"
      >
        <div className="mb-6 p-6 sm:p-8 rounded-3xl bg-slate-900/90 border-2 border-indigo-500/30 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-2 text-xs font-bold uppercase text-indigo-400 tracking-wider mb-3">
            <Sparkles className="w-4 h-4" />
            <span>{activity.title}</span>
          </div>

          <h2 className="font-arcade text-xl sm:text-2xl md:text-3xl font-bold text-white leading-relaxed whitespace-pre-line">
            {currentQ.prompt}
          </h2>
        </div>

        {/* Options Grid (2x2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
          {currentQ.options.map((opt, idx) => {
            const isCorrect = idx === currentQ.correctOptionIndex;
            const isSelected = selectedOption === idx;

            let btnStyle = 'bg-slate-900/80 border-slate-800 text-slate-200 hover:border-slate-600 hover:bg-slate-850';

            if (isAnswered) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400';
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
                className={`p-4 sm:p-5 rounded-2xl border-2 text-left font-medium text-base sm:text-lg transition-all flex items-center gap-4 ${btnStyle}`}
              >
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl font-arcade font-bold text-base flex items-center justify-center shrink-0 border ${
                    isAnswered && isCorrect
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                      : isAnswered && isSelected
                      ? 'bg-rose-500 text-white border-rose-400'
                      : 'bg-slate-800 border-slate-700 text-indigo-300'
                  }`}
                >
                  {OPTION_LETTERS[idx]}
                </div>
                <span className="flex-1 leading-snug">{opt}</span>
                {isAnswered && isCorrect && <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />}
                {isAnswered && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-rose-400 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Explanation & Action Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto pt-4 border-t border-slate-800/80">
          <div className="w-full sm:w-auto flex items-center gap-2">
            {!isAnswered && activity.settings.allowRevealAnswer && (
              <button
                onClick={handleRevealAnswer}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-amber-300 text-sm font-semibold flex items-center gap-2 transition-all"
              >
                <Eye className="w-4 h-4" />
                <span>Reveal Answer</span>
              </button>
            )}

            {isAnswered && currentQ.explanation && (
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs sm:text-sm text-indigo-300 max-w-xl">
                <span className="font-bold uppercase tracking-wider block text-indigo-400 text-xs mb-0.5">Explanation:</span>
                {currentQ.explanation}
              </div>
            )}
          </div>

          {/* Next Button */}
          {isAnswered && (
            <button
              onClick={handleNextQuestion}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-base shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all"
            >
              <span>{currentIndex + 1 < questions.length ? 'Next Question' : 'View Results'}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </motion.div>

      {/* Game Results Modal */}
      {isGameOver && (
        <GameResultsModal
          score={score}
          totalQuestions={questions.length}
          activityTitle={activity.title}
          onRestart={handleRestart}
          onExit={onExit}
        />
      )}
    </div>
  );
};
