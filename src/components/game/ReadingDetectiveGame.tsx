import React, { useState } from 'react';
import type { Activity, ReadingPassageQuestion } from '../../types/schema';
import { motion } from 'framer-motion';
import { sounds } from '../../services/soundEffects';
import { useGameTracking } from '../../context/GameTrackingContext';
import { shuffleQuestionsOptions } from '../../utils/shuffle';
import { GameResultsModal } from './GameResultsModal';
import { ClassroomScoreboard } from './ClassroomScoreboard';
import { 
  ArrowLeft, 
  Eye, 
  ChevronRight, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  FileText
} from 'lucide-react';

interface ReadingDetectiveGameProps {
  activity: Activity;
  onExit: () => void;
}

export const ReadingDetectiveGame: React.FC<ReadingDetectiveGameProps> = ({ activity, onExit }) => {
  const { recordAnswer, completeGame } = useGameTracking();
  const [questions, setQuestions] = useState<ReadingPassageQuestion[]>(() =>
    shuffleQuestionsOptions((activity.questions || []) as ReadingPassageQuestion[])
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const currentQ = questions[currentIndex];
  const isAnswered = selectedOption !== null || isAnswerRevealed;

  // Derive passage progress
  const questionsPerPassage = 5;
  const passageNumber = Math.floor(currentIndex / questionsPerPassage) + 1;
  const questionNumberInPassage = (currentIndex % questionsPerPassage) + 1;

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;

    setSelectedOption(idx);
    const isCorrect = idx === currentQ.correctOptionIndex;

    recordAnswer({
      questionId: currentQ.id,
      questionOrder: currentIndex + 1,
      questionPrompt: `Passage ${passageNumber} - Q${questionNumberInPassage}: ${currentQ.prompt}`,
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
      questionPrompt: `Passage ${passageNumber} - Q${questionNumberInPassage}: ${currentQ.prompt}`,
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
    setQuestions(shuffleQuestionsOptions((activity.questions || []) as ReadingPassageQuestion[]));
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerRevealed(false);
    setScore(0);
    setIsGameOver(false);
  };

  if (!currentQ || questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 text-center bg-slate-900 rounded-3xl border border-slate-800">
        <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">No Reading Passages Configured</h3>
        <button onClick={onExit} className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm">
          Return to Unit
        </button>
      </div>
    );
  }

  const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

  return (
    <div className="w-full max-w-7xl mx-auto py-3 px-4 flex flex-col min-h-[calc(100vh-5rem)]">
      {/* Classroom Scoreboard */}
      <ClassroomScoreboard />

      {/* Top Bar */}
      <div className="flex items-center justify-between gap-4 mb-3 pb-2 border-b border-slate-800">
        <button
          onClick={onExit}
          className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Unit</span>
        </button>

        {/* Passage & Question Counter */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
            Passage {passageNumber} of 5
          </span>
          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Question {questionNumberInPassage} of {questionsPerPassage} ({currentIndex + 1}/25)
          </span>
        </div>
      </div>

      {/* Side-by-Side Smartboard 16:9 Optimized Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 items-stretch my-auto">
        
        {/* Left Column: Passage Display (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-xl flex flex-col justify-between overflow-hidden">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                <span>Reading Passage {passageNumber}</span>
              </span>
              <span className="text-xs font-mono text-slate-500">
                Word Count: ~125
              </span>
            </div>

            <h3 className="font-arcade text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight">
              {currentQ.passageTitle}
            </h3>

            <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-3 font-normal max-h-[460px] overflow-y-auto pr-2">
              <p>{currentQ.passageText}</p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-500 flex items-center justify-between">
            <span>Text analysis in English</span>
            <span>CEFR A2-B1 Level</span>
          </div>
        </div>

        {/* Right Column: Comprehension Question & Options (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <motion.div
            key={currentQ.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 flex flex-col justify-between space-y-4"
          >
            {/* Prompt Card */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-indigo-500/30 shadow-xl backdrop-blur-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block mb-2">
                Comprehension Question:
              </span>
              <h2 className="font-arcade text-xl sm:text-2xl font-bold text-white leading-snug">
                {currentQ.prompt}
              </h2>
            </div>

            {/* Multiple Choice Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, idx) => {
                const isCorrect = idx === currentQ.correctOptionIndex;
                const isSelected = selectedOption === idx;

                let btnStyle = 'bg-slate-900/80 border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-850';

                if (isAnswered) {
                  if (isCorrect) {
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
                    className={`w-full p-3.5 sm:p-4 rounded-2xl border-2 text-left text-sm sm:text-base font-medium transition-all flex items-center gap-3.5 ${btnStyle}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl font-arcade font-bold text-sm flex items-center justify-center shrink-0 border ${
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
                    {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                    {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation & Next */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="flex-1">
                {!isAnswered && activity.settings.allowRevealAnswer && (
                  <button
                    onClick={handleRevealAnswer}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Reveal Answer</span>
                  </button>
                )}

                {isAnswered && currentQ.explanation && (
                  <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300">
                    <span className="font-bold uppercase text-indigo-400 block text-xs mb-0.5">Explanation:</span>
                    {currentQ.explanation}
                  </div>
                )}
              </div>

              {isAnswered && (
                <button
                  onClick={handleNextQuestion}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all"
                >
                  <span>{currentIndex + 1 < questions.length ? 'Next Question' : 'View Results'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

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
