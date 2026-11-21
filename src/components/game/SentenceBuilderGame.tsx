import React, { useState, useEffect, useRef } from 'react';
import type { Activity, SentenceBuilderQuestion } from '../../types/schema';
import { motion } from 'framer-motion';
import { sounds } from '../../services/soundEffects';
import { useGameTracking } from '../../context/GameTrackingContext';
import { GameResultsModal } from './GameResultsModal';
import { ClassroomScoreboard } from './ClassroomScoreboard';
import { AudioPromptPlayer } from '../common/AudioPromptPlayer';
import { 
  ArrowLeft, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  ChevronRight, 
  Sparkles,
  AlignLeft
} from 'lucide-react';

interface SentenceBuilderGameProps {
  activity: Activity;
  onExit: () => void;
}

interface Tile {
  id: string;
  word: string;
}

export const SentenceBuilderGame: React.FC<SentenceBuilderGameProps> = ({ activity, onExit }) => {
  const { recordAnswer, completeGame, restartGame, resumeCheckpoint, saveCheckpoint, clearCheckpoint } = useGameTracking();
  const sentences = (activity.questions || []) as SentenceBuilderQuestion[];

  const initialIndex = (resumeCheckpoint && resumeCheckpoint.currentIndex > 0 && resumeCheckpoint.currentIndex < sentences.length)
    ? resumeCheckpoint.currentIndex
    : 0;
  const initialScore = (resumeCheckpoint && resumeCheckpoint.currentIndex > 0)
    ? resumeCheckpoint.score
    : 0;

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [bankTiles, setBankTiles] = useState<Tile[]>([]);
  const [selectedTiles, setSelectedTiles] = useState<Tile[]>([]);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [score, setScore] = useState(initialScore);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isAudioAvailable, setIsAudioAvailable] = useState<boolean>(true);

  const hasInitializedFromCheckpointRef = useRef(Boolean(resumeCheckpoint));
  useEffect(() => {
    if (!hasInitializedFromCheckpointRef.current && resumeCheckpoint) {
      hasInitializedFromCheckpointRef.current = true;
      if (resumeCheckpoint.currentIndex !== undefined && resumeCheckpoint.currentIndex > 0 && resumeCheckpoint.currentIndex < sentences.length) {
        setCurrentIndex(resumeCheckpoint.currentIndex);
      }
      if (resumeCheckpoint.score !== undefined) {
        setScore(resumeCheckpoint.score);
      }
    }
  }, [resumeCheckpoint, sentences.length]);

  const currentSentence = sentences[currentIndex];

  // Initialize current sentence words
  useEffect(() => {
    if (!currentSentence) return;

    const tiles: Tile[] = currentSentence.scrambledWords.map((word, i) => ({
      id: `${word}-${i}-${Date.now()}`,
      word,
    }));

    setBankTiles(tiles);
    setSelectedTiles([]);
    setIsAnswerChecked(false);
    setIsCorrect(false);
    setIsRevealed(false);
  }, [currentIndex, currentSentence]);

  // Click word in Bank -> Move to Selected Tray
  const handleSelectWord = (tile: Tile) => {
    if (isAnswerChecked || isRevealed) return;
    const hasAudio = currentSentence.hasAudio || Boolean((currentSentence as unknown as { speechText?: string }).speechText || (currentSentence as unknown as { audioUrl?: string }).audioUrl);
    if (hasAudio && !isAudioAvailable) return;
    sounds.playTap();
    setBankTiles((prev) => prev.filter((t) => t.id !== tile.id));
    setSelectedTiles((prev) => [...prev, tile]);
  };

  // Click word in Selected Tray -> Move back to Bank
  const handleUnselectWord = (tile: Tile) => {
    if (isAnswerChecked || isRevealed) return;
    sounds.playTap();
    setSelectedTiles((prev) => prev.filter((t) => t.id !== tile.id));
    setBankTiles((prev) => [...prev, tile]);
  };

  // Reset Tray
  const handleReset = () => {
    sounds.playTap();
    if (!currentSentence) return;
    const tiles: Tile[] = currentSentence.scrambledWords.map((word, i) => ({
      id: `${word}-${i}-${Date.now()}`,
      word,
    }));
    setBankTiles(tiles);
    setSelectedTiles([]);
    setIsAnswerChecked(false);
    setIsCorrect(false);
  };

  // Normalization helper: strips punctuation, extra spaces, and handles case
  const normalizeSentence = (str: string): string => {
    return str
      .toLowerCase()
      .replace(/['’]/g, "'")
      .replace(/[.,!?;:]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Check Answer
  const handleCheckAnswer = () => {
    const constructed = selectedTiles.map((t) => t.word).join(' ');
    const constructedNorm = normalizeSentence(constructed);

    const candidates = [
      currentSentence.correctSentence,
      ...(currentSentence.acceptedAnswers || []),
      ...(currentSentence.alternativeValidSentences || []),
    ];

    const isMatch = candidates.some((cand) => normalizeSentence(cand) === constructedNorm);

    setIsAnswerChecked(true);
    setIsCorrect(isMatch);

    recordAnswer({
      questionId: currentSentence.id,
      questionOrder: currentIndex + 1,
      questionPrompt: currentSentence.prompt,
      studentResponse: constructed,
      correctAnswer: currentSentence.correctSentence,
      isCorrect: isMatch,
    });

    if (isMatch) {
      sounds.playSuccess();
      setScore((s) => s + 1);
    } else {
      sounds.playBack();
    }
  };

  const handleReveal = () => {
    if (isAnswerChecked) return;
    sounds.playTap();
    setIsRevealed(true);
    setIsAnswerChecked(true);

    recordAnswer({
      questionId: currentSentence.id,
      questionOrder: currentIndex + 1,
      questionPrompt: currentSentence.prompt,
      studentResponse: '[Revealed without answering]',
      correctAnswer: currentSentence.correctSentence,
      isCorrect: false,
    });
  };

  const handleNext = () => {
    sounds.playTap();
    if (currentIndex + 1 < sentences.length) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      saveCheckpoint({
        currentIndex: nextIdx,
        score,
      });
    } else {
      setIsGameOver(true);
      completeGame({
        score,
        totalQuestions: sentences.length,
      });
    }
  };

  const handleRestart = () => {
    sounds.playTap();
    clearCheckpoint();
    restartGame();
  };

  if (!currentSentence || sentences.length === 0) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 text-center bg-white rounded-3xl border-2 border-amber-100 shadow-xl">
        <AlignLeft className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2 font-arcade">No Sentences in This Activity</h3>
        <p className="text-slate-600 text-sm mb-6">This activity collection does not have any sentences configured.</p>
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
            Sentence
          </span>
          <span className="font-mono text-base font-extrabold px-3 py-0.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
            {currentIndex + 1} / {sentences.length}
          </span>
        </div>

        {/* Score Counter */}
        <div className="text-xs font-mono font-bold text-slate-600">
          Correct: <span className="text-emerald-600 font-extrabold">{score}</span> / {sentences.length}
        </div>
      </div>

      {/* Sentence Prompt Banner */}
      <div className="mb-6 p-5 rounded-3xl bg-white border-2 border-amber-100 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Target Concept: {currentSentence.prompt}</span>
          </span>
          <p className="text-slate-700 text-sm sm:text-base font-medium mt-1">
            Tap the word tiles below in the correct order to construct the sentence.
          </p>
        </div>

        <button
          onClick={handleReset}
          disabled={selectedTiles.length === 0 || isAnswerChecked}
          className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Tiles</span>
        </button>
      </div>

      {(currentSentence.hasAudio || Boolean((currentSentence as unknown as { speechText?: string }).speechText || (currentSentence as unknown as { audioUrl?: string }).audioUrl)) && (
        <div className="mb-6">
          <AudioPromptPlayer
            audioUrl={(currentSentence as unknown as { audioUrl?: string }).audioUrl}
            speechText={(currentSentence as unknown as { speechText?: string }).speechText}
            correctTranscript={(currentSentence as unknown as { correctTranscript?: string }).correctTranscript}
            isAnswered={isAnswerChecked || isRevealed}
            onPlaybackAvailabilityChange={(avail) => setIsAudioAvailable(avail)}
          />
        </div>
      )}

      {/* Sentence Assembly Drop Area */}
      <div className="mb-6 p-6 sm:p-8 rounded-3xl bg-white/95 border-2 border-dashed border-indigo-200 min-h-[140px] flex flex-wrap items-center gap-2.5 shadow-sm">
        {selectedTiles.length === 0 ? (
          <span className="text-slate-400 text-sm sm:text-base italic mx-auto">
            Tap words from the word bank below to place them here...
          </span>
        ) : (
          selectedTiles.map((tile) => (
            <motion.button
              key={tile.id}
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={() => handleUnselectWord(tile)}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base sm:text-lg shadow-md shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
            >
              {tile.word}
            </motion.button>
          ))
        )}
      </div>

      {/* Scrambled Word Bank */}
      <div className="mb-6 p-6 rounded-3xl bg-sky-50/70 border-2 border-sky-100 shadow-sm">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-3">
          Word Bank:
        </span>
        <div className="flex flex-wrap gap-2.5 min-h-[80px] items-center">
          {bankTiles.map((tile) => (
            <motion.button
              key={tile.id}
              layout
              onClick={() => handleSelectWord(tile)}
              className="px-4 py-2.5 rounded-2xl bg-white hover:bg-sky-50 text-slate-800 font-bold text-base sm:text-lg border-2 border-slate-200 hover:border-sky-300 shadow-xs transition-all hover:scale-105 active:scale-95"
            >
              {tile.word}
            </motion.button>
          ))}
          {bankTiles.length === 0 && (
            <span className="text-slate-400 text-xs italic">All words placed. Ready to check!</span>
          )}
        </div>
      </div>

      {/* Feedback & Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto pt-4 border-t border-sky-100">
        <div className="flex items-center gap-3">
          {!isAnswerChecked && (
            <>
              <button
                onClick={handleCheckAnswer}
                disabled={selectedTiles.length === 0}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-40 text-white font-bold text-base shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all"
              >
                Check Answer
              </button>

              <button
                onClick={handleReveal}
                className="px-4 py-3 rounded-2xl bg-white hover:bg-amber-50 text-amber-700 text-sm font-bold flex items-center gap-2 border border-amber-200 shadow-xs transition-all"
              >
                <Eye className="w-4 h-4 text-amber-600" />
                <span>Reveal</span>
              </button>
            </>
          )}

          {isAnswerChecked && (
            <div className="flex items-center gap-2 text-sm sm:text-base font-bold">
              {isCorrect ? (
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  <span>Correct! Well done!</span>
                </div>
              ) : (
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 text-rose-600">
                    <XCircle className="w-6 h-6 text-rose-500" />
                    <span>Not quite right.</span>
                  </div>
                  <span className="text-xs text-slate-700 mt-1">
                    Correct sentence: <strong className="text-emerald-700 font-mono">{currentSentence.correctSentence}</strong>
                  </span>
                  {currentSentence.explanation && (
                    <div className="mt-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                      <span className="font-bold text-amber-700 block text-[10px] uppercase tracking-wide">Explanation:</span>
                      {currentSentence.explanation}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Next Question / View Results Button */}
        {isAnswerChecked && (
          <button
            onClick={handleNext}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold text-base shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all"
          >
            <span>{currentIndex + 1 < sentences.length ? 'Next Sentence' : 'View Results'}</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Game Results Modal */}
      {isGameOver && (
        <GameResultsModal
          score={score}
          totalQuestions={sentences.length}
          activityTitle={activity.title}
          onRestart={handleRestart}
          onExit={onExit}
        />
      )}
    </div>
  );
};
