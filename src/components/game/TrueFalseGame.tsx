import React, { useState, useRef, useEffect } from 'react';
import type { Activity, TrueFalseQuestion } from '../../types/schema';
import { motion } from 'framer-motion';
import { sounds } from '../../services/soundEffects';
import { useGameTracking } from '../../context/GameTrackingContext';
import { GameResultsModal } from './GameResultsModal';
import { ClassroomScoreboard } from './ClassroomScoreboard';
import { AudioPromptPlayer } from '../common/AudioPromptPlayer';
import { 
  ArrowLeft, 
  Check, 
  X, 
  ChevronRight, 
  Sparkles
} from 'lucide-react';

interface TrueFalseGameProps {
  activity: Activity;
  onExit: () => void;
}

export const TrueFalseGame: React.FC<TrueFalseGameProps> = ({ activity, onExit }) => {
  const { recordAnswer, completeGame, restartGame, resumeCheckpoint, saveCheckpoint, clearCheckpoint } = useGameTracking();
  const statements = (activity.questions || []) as TrueFalseQuestion[];

  const initialIndex = (resumeCheckpoint && resumeCheckpoint.currentIndex > 0 && resumeCheckpoint.currentIndex < statements.length)
    ? resumeCheckpoint.currentIndex
    : 0;
  const initialScore = (resumeCheckpoint && resumeCheckpoint.currentIndex > 0)
    ? resumeCheckpoint.score
    : 0;

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [score, setScore] = useState(initialScore);
  const [isGameOver, setIsGameOver] = useState(false);

  const hasInitializedFromCheckpointRef = useRef(Boolean(resumeCheckpoint));
  useEffect(() => {
    if (!hasInitializedFromCheckpointRef.current && resumeCheckpoint) {
      hasInitializedFromCheckpointRef.current = true;
      if (resumeCheckpoint.currentIndex !== undefined && resumeCheckpoint.currentIndex > 0 && resumeCheckpoint.currentIndex < statements.length) {
        setCurrentIndex(resumeCheckpoint.currentIndex);
      }
      if (resumeCheckpoint.score !== undefined) {
        setScore(resumeCheckpoint.score);
      }
    }
  }, [resumeCheckpoint, statements.length]);

  const currentStatement = statements[currentIndex];
  const isAnswered = selectedAnswer !== null;

  const handleSelectAnswer = (choice: boolean) => {
    if (isAnswered) return;

    setSelectedAnswer(choice);
    const isCorrect = choice === currentStatement.isTrue;

    recordAnswer({
      questionId: currentStatement.id,
      questionOrder: currentIndex + 1,
      questionPrompt: currentStatement.prompt,
      studentResponse: choice ? 'True' : 'False',
      correctAnswer: currentStatement.isTrue ? 'True' : 'False',
      isCorrect,
    });

    if (isCorrect) {
      sounds.playSuccess();
      setScore((s) => s + 1);
    } else {
      sounds.playBack();
    }
  };

  const handleNext = () => {
    sounds.playTap();
    if (currentIndex + 1 < statements.length) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setSelectedAnswer(null);
      saveCheckpoint({
        currentIndex: nextIdx,
        score,
      });
    } else {
      setIsGameOver(true);
      completeGame({
        score,
        totalQuestions: statements.length,
      });
    }
  };

  const handleRestart = () => {
    sounds.playTap();
    clearCheckpoint();
    restartGame();
  };

  if (!currentStatement || statements.length === 0) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 text-center bg-white rounded-3xl border-2 border-sky-100 shadow-xl">
        <h3 className="text-xl font-bold text-slate-900 mb-2 font-arcade">No Statements Configured</h3>
        <button onClick={onExit} className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-sky-500/20">
          Return to Unit
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-4 px-4 flex flex-col min-h-[calc(100vh-5rem)]">
      {/* Classroom Scoreboard */}
      <ClassroomScoreboard />

      {/* Top Bar */}
      <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-sky-100">
        <button
          onClick={onExit}
          className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Unit</span>
        </button>

        {/* Progress Counter */}
        <div className="flex items-center gap-2">
          <span className="font-arcade text-sm font-bold text-slate-500 uppercase tracking-wider">
            Statement
          </span>
          <span className="font-mono text-base font-extrabold px-3 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
            {currentIndex + 1} / {statements.length}
          </span>
        </div>
      </div>

      {/* Statement Card */}
      <motion.div
        key={currentStatement.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col justify-between"
      >
        <div className="mb-8 p-6 sm:p-10 rounded-3xl bg-white border-2 border-emerald-100 shadow-xl relative overflow-hidden text-center my-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Fact or Fiction Challenge</span>
          </div>

          <h2 className="font-arcade text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-relaxed max-w-3xl mx-auto">
            "{currentStatement.prompt}"
          </h2>

          {(currentStatement.hasAudio || Boolean((currentStatement as unknown as { speechText?: string }).speechText || (currentStatement as unknown as { audioUrl?: string }).audioUrl)) && (
            <div className="mt-4 max-w-lg mx-auto">
              <AudioPromptPlayer
                audioUrl={(currentStatement as unknown as { audioUrl?: string }).audioUrl}
                speechText={(currentStatement as unknown as { speechText?: string }).speechText}
                correctTranscript={(currentStatement as unknown as { correctTranscript?: string }).correctTranscript}
                isAnswered={isAnswered}
              />
            </div>
          )}
        </div>

        {/* Giant TRUE / FALSE Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {/* TRUE BUTTON */}
          <button
            disabled={isAnswered}
            onClick={() => handleSelectAnswer(true)}
            className={`p-8 rounded-3xl border-4 text-center font-arcade font-black text-3xl sm:text-4xl transition-all flex flex-col items-center justify-center gap-3 ${
              isAnswered
                ? currentStatement.isTrue
                  ? 'bg-emerald-500 border-emerald-400 text-white ring-4 ring-emerald-400'
                  : selectedAnswer === true
                  ? 'bg-rose-500 border-rose-400 text-white'
                  : 'bg-slate-100 border-slate-200 text-slate-400 opacity-40'
                : 'bg-emerald-500 hover:bg-emerald-600 border-emerald-400 text-white hover:scale-105 active:scale-95 shadow-xl shadow-emerald-500/20'
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-white/20 text-white flex items-center justify-center shadow-md">
              <Check className="w-10 h-10 stroke-[3]" />
            </div>
            <span>TRUE</span>
          </button>

          {/* FALSE BUTTON */}
          <button
            disabled={isAnswered}
            onClick={() => handleSelectAnswer(false)}
            className={`p-8 rounded-3xl border-4 text-center font-arcade font-black text-3xl sm:text-4xl transition-all flex flex-col items-center justify-center gap-3 ${
              isAnswered
                ? !currentStatement.isTrue
                  ? 'bg-emerald-500 border-emerald-400 text-white ring-4 ring-emerald-400'
                  : selectedAnswer === false
                  ? 'bg-rose-500 border-rose-400 text-white'
                  : 'bg-slate-100 border-slate-200 text-slate-400 opacity-40'
                : 'bg-rose-500 hover:bg-rose-600 border-rose-400 text-white hover:scale-105 active:scale-95 shadow-xl shadow-rose-500/20'
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-white/20 text-white flex items-center justify-center shadow-md">
              <X className="w-10 h-10 stroke-[3]" />
            </div>
            <span>FALSE</span>
          </button>
        </div>

        {/* Explanation & Next */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-sky-100">
          <div className="flex-1">
            {isAnswered && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-sm">
                <span className="font-bold uppercase tracking-wider block text-emerald-700 text-xs mb-1">
                  {currentStatement.isTrue === selectedAnswer ? '✓ Correct!' : '✗ Incorrect!'}
                </span>
                {currentStatement.explanation}
              </div>
            )}
          </div>

          {isAnswered && (
            <button
              onClick={handleNext}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all"
            >
              <span>{currentIndex + 1 < statements.length ? 'Next Statement' : 'View Results'}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </motion.div>

      {/* Game Results Modal */}
      {isGameOver && (
        <GameResultsModal
          score={score}
          totalQuestions={statements.length}
          activityTitle={activity.title}
          onRestart={handleRestart}
          onExit={onExit}
        />
      )}
    </div>
  );
};
