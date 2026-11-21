import React, { useState, useRef, useEffect } from 'react';
import type { Activity, MultipleChoiceQuestion } from '../../types/schema';
import { motion } from 'framer-motion';
import { sounds } from '../../services/soundEffects';
import { useGameTracking } from '../../context/GameTrackingContext';
import { shuffleQuestionsOptions } from '../../utils/shuffle';
import { GameResultsModal } from './GameResultsModal';
import { ClassroomScoreboard } from './ClassroomScoreboard';
import { AudioPromptPlayer } from '../common/AudioPromptPlayer';
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
  const { recordAnswer, completeGame, restartGame, resumeCheckpoint, saveCheckpoint, clearCheckpoint } = useGameTracking();

  // Restore shuffled questions order from checkpoint if available, or shuffle fresh
  const [questions] = useState<MultipleChoiceQuestion[]>(() => {
    const rawQuestions = (activity.questions || []) as MultipleChoiceQuestion[];
    if (resumeCheckpoint?.shuffledQuestionIds && resumeCheckpoint.shuffledQuestionIds.length > 0) {
      const qMap = new Map(rawQuestions.map((q) => [q.id, q]));
      const restored = resumeCheckpoint.shuffledQuestionIds
        .map((id) => qMap.get(id))
        .filter((q): q is MultipleChoiceQuestion => Boolean(q));
      if (restored.length === rawQuestions.length) {
        return restored;
      }
    }
    return shuffleQuestionsOptions(rawQuestions);
  });

  const initialIndex = (resumeCheckpoint && resumeCheckpoint.currentIndex > 0 && resumeCheckpoint.currentIndex < questions.length)
    ? resumeCheckpoint.currentIndex
    : 0;
  const initialScore = (resumeCheckpoint && resumeCheckpoint.currentIndex > 0)
    ? resumeCheckpoint.score
    : 0;

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [score, setScore] = useState(initialScore);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isAudioAvailable, setIsAudioAvailable] = useState<boolean>(true);

  const hasInitializedFromCheckpointRef = useRef(Boolean(resumeCheckpoint));
  useEffect(() => {
    if (!hasInitializedFromCheckpointRef.current && resumeCheckpoint) {
      hasInitializedFromCheckpointRef.current = true;
      if (resumeCheckpoint.currentIndex !== undefined && resumeCheckpoint.currentIndex > 0 && resumeCheckpoint.currentIndex < questions.length) {
        setCurrentIndex(resumeCheckpoint.currentIndex);
      }
      if (resumeCheckpoint.score !== undefined) {
        setScore(resumeCheckpoint.score);
      }
    }
  }, [resumeCheckpoint, questions.length]);

  const currentQ = questions[currentIndex];
  const isAnswered = selectedOption !== null || isAnswerRevealed;

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    const hasAudio = currentQ.hasAudio || Boolean((currentQ as unknown as { speechText?: string }).speechText || (currentQ as unknown as { audioUrl?: string }).audioUrl);
    if (hasAudio && !isAudioAvailable) return;

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
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
      saveCheckpoint({
        currentIndex: nextIdx,
        score,
        shuffledQuestionIds: questions.map((q) => q.id),
      });
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
    clearCheckpoint();
    restartGame();
  };

  if (!currentQ || questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 text-center bg-white rounded-3xl border-2 border-sky-100 shadow-xl">
        <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2 font-arcade">No Questions in This Activity</h3>
        <p className="text-slate-600 text-sm mb-6">This activity collection does not have any questions configured.</p>
        <button
          onClick={onExit}
          className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-sky-500/20"
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
      <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-sky-100">
        <button
          onClick={onExit}
          className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Unit</span>
        </button>

        {/* Question Counter */}
        <div className="flex items-center gap-2">
          <span className="font-arcade text-sm font-bold text-slate-500 uppercase tracking-wider">
            Question
          </span>
          <span className="font-mono text-base font-extrabold px-3 py-0.5 rounded-lg bg-sky-50 text-sky-800 border border-sky-200">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>

        {/* Score Counter */}
        <div className="text-xs font-mono font-bold text-slate-600">
          Score: <span className="text-emerald-600 font-extrabold">{score}</span> / {questions.length}
        </div>
      </div>

      {/* Question Card */}
      <motion.div
        key={currentQ.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col justify-between"
      >
        <div className="mb-6 p-6 sm:p-8 rounded-3xl bg-white border-2 border-indigo-100 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-50/50 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-2 text-xs font-bold uppercase text-indigo-600 tracking-wider mb-3">
            <Sparkles className="w-4 h-4" />
            <span>{activity.title}</span>
          </div>

          <h2 className="font-arcade text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 leading-relaxed whitespace-pre-line">
            {currentQ.prompt}
          </h2>

          {(currentQ.hasAudio || Boolean((currentQ as unknown as { speechText?: string }).speechText || (currentQ as unknown as { audioUrl?: string }).audioUrl)) && (
            <div className="mt-4">
              <AudioPromptPlayer
                audioUrl={(currentQ as unknown as { audioUrl?: string }).audioUrl}
                speechText={(currentQ as unknown as { speechText?: string }).speechText}
                correctTranscript={(currentQ as unknown as { correctTranscript?: string }).correctTranscript}
                isAnswered={isAnswered}
                onPlaybackAvailabilityChange={(avail) => setIsAudioAvailable(avail)}
              />
            </div>
          )}
        </div>

        {/* Options Grid (2x2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
          {currentQ.options.map((opt, idx) => {
            const isCorrect = idx === currentQ.correctOptionIndex;
            const isSelected = selectedOption === idx;

            let btnStyle = 'bg-white border-2 border-slate-200 text-slate-800 hover:border-indigo-300 hover:bg-indigo-50/50 shadow-xs';

            if (isAnswered) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-50 border-2 border-emerald-500 text-emerald-950 shadow-md ring-2 ring-emerald-400';
              } else if (isSelected) {
                btnStyle = 'bg-rose-50 border-2 border-rose-400 text-rose-950 ring-2 ring-rose-400';
              } else {
                btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-50';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`p-4 sm:p-5 rounded-2xl border-2 text-left font-semibold text-base sm:text-lg transition-all flex items-center gap-4 ${btnStyle}`}
              >
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl font-arcade font-bold text-base flex items-center justify-center shrink-0 border ${
                    isAnswered && isCorrect
                      ? 'bg-emerald-500 text-white border-emerald-400'
                      : isAnswered && isSelected
                      ? 'bg-rose-500 text-white border-rose-400'
                      : 'bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  {OPTION_LETTERS[idx]}
                </div>
                <span className="flex-1 leading-snug">{opt}</span>
                {isAnswered && isCorrect && <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />}
                {isAnswered && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-rose-500 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Explanation & Action Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto pt-4 border-t border-sky-100">
          <div className="w-full sm:w-auto flex items-center gap-2">
            {!isAnswered && activity.settings.allowRevealAnswer && (
              <button
                onClick={handleRevealAnswer}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-amber-50 border border-amber-200 text-amber-700 text-sm font-bold flex items-center gap-2 transition-all shadow-xs"
              >
                <Eye className="w-4 h-4 text-amber-600" />
                <span>Reveal Answer</span>
              </button>
            )}

            {isAnswered && currentQ.explanation && (
              <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs sm:text-sm text-indigo-900 max-w-xl">
                <span className="font-bold uppercase tracking-wider block text-indigo-700 text-xs mb-0.5">Explanation:</span>
                {currentQ.explanation}
              </div>
            )}
          </div>

          {/* Next Button */}
          {isAnswered && (
            <button
              onClick={handleNextQuestion}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold text-base shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all"
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
