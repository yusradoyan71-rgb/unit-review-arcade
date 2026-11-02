import React, { useState, useEffect } from 'react';
import type { Activity, SentenceBuilderQuestion } from '../../types/schema';
import { motion } from 'framer-motion';
import { sounds } from '../../services/soundEffects';
import { GameResultsModal } from './GameResultsModal';
import { ClassroomScoreboard } from './ClassroomScoreboard';
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
  const sentences = (activity.questions || []) as SentenceBuilderQuestion[];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [bankTiles, setBankTiles] = useState<Tile[]>([]);
  const [selectedTiles, setSelectedTiles] = useState<Tile[]>([]);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

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

  // Check Answer
  const handleCheckAnswer = () => {
    const constructed = selectedTiles.map((t) => t.word).join(' ').trim();
    const target = currentSentence.correctSentence.trim();
    const alternatives = (currentSentence.alternativeValidSentences || []).map((s) => s.trim());

    const isMatch = constructed === target || alternatives.includes(constructed);

    setIsAnswerChecked(true);
    setIsCorrect(isMatch);

    if (isMatch) {
      sounds.playSuccess();
      setScore((s) => s + 1);
    } else {
      sounds.playBack();
    }
  };

  const handleReveal = () => {
    sounds.playTap();
    setIsRevealed(true);
    setIsAnswerChecked(true);
  };

  const handleNext = () => {
    sounds.playTap();
    if (currentIndex + 1 < sentences.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsGameOver(true);
    }
  };

  const handleRestart = () => {
    sounds.playTap();
    setCurrentIndex(0);
    setScore(0);
    setIsGameOver(false);
  };

  if (!currentSentence || sentences.length === 0) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 text-center bg-slate-900 rounded-3xl border border-slate-800">
        <AlignLeft className="w-12 h-12 text-slate-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">No Sentences in This Activity</h3>
        <p className="text-slate-400 text-sm mb-6">This activity collection does not have any sentences configured.</p>
        <button onClick={onExit} className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm">
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
      <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
        <button
          onClick={onExit}
          className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Unit</span>
        </button>

        {/* Progress Counter */}
        <div className="flex items-center gap-2">
          <span className="font-arcade text-sm font-bold text-slate-400 uppercase tracking-wider">
            Sentence
          </span>
          <span className="font-mono text-base font-extrabold px-3 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {currentIndex + 1} / {sentences.length}
          </span>
        </div>

        {/* Score Counter */}
        <div className="text-xs font-mono font-bold text-slate-400">
          Correct: <span className="text-emerald-400">{score}</span> / {sentences.length}
        </div>
      </div>

      {/* Sentence Prompt Banner */}
      <div className="mb-6 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Target Concept: {currentSentence.prompt}</span>
          </span>
          <p className="text-slate-300 text-sm sm:text-base font-medium mt-1">
            Tap the word tiles below in the correct order to construct the sentence.
          </p>
        </div>

        <button
          onClick={handleReset}
          disabled={selectedTiles.length === 0 || isAnswerChecked}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Tiles</span>
        </button>
      </div>

      {/* Sentence Assembly Drop Area */}
      <div className="mb-6 p-6 sm:p-8 rounded-3xl bg-slate-900/95 border-2 border-dashed border-indigo-500/40 min-h-[140px] flex flex-wrap items-center gap-2.5 shadow-inner">
        {selectedTiles.length === 0 ? (
          <span className="text-slate-500 text-sm sm:text-base italic mx-auto">
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
      <div className="mb-6 p-6 rounded-3xl bg-slate-950/60 border border-slate-800/80">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
          Word Bank:
        </span>
        <div className="flex flex-wrap gap-2.5 min-h-[80px] items-center">
          {bankTiles.map((tile) => (
            <motion.button
              key={tile.id}
              layout
              onClick={() => handleSelectWord(tile)}
              className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-100 hover:text-white font-bold text-base sm:text-lg border border-slate-700 hover:border-indigo-400 shadow transition-all hover:scale-105 active:scale-95"
            >
              {tile.word}
            </motion.button>
          ))}
          {bankTiles.length === 0 && (
            <span className="text-slate-500 text-xs italic">All words placed. Ready to check!</span>
          )}
        </div>
      </div>

      {/* Feedback & Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto pt-4 border-t border-slate-800">
        <div className="flex items-center gap-3">
          {!isAnswerChecked && (
            <>
              <button
                onClick={handleCheckAnswer}
                disabled={selectedTiles.length === 0}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-40 text-slate-950 font-bold text-base shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all"
              >
                Check Answer
              </button>

              <button
                onClick={handleReveal}
                className="px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-300 text-sm font-semibold flex items-center gap-2 border border-slate-800 transition-all"
              >
                <Eye className="w-4 h-4" />
                <span>Reveal</span>
              </button>
            </>
          )}

          {isAnswerChecked && (
            <div className="flex items-center gap-2 text-sm sm:text-base font-bold">
              {isCorrect ? (
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                  <span>Correct! Well done!</span>
                </div>
              ) : (
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 text-rose-400">
                    <XCircle className="w-6 h-6" />
                    <span>Not quite right.</span>
                  </div>
                  <span className="text-xs text-slate-300 mt-1">
                    Correct sentence: <strong className="text-emerald-300 font-mono">{currentSentence.correctSentence}</strong>
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {isAnswerChecked && (
          <button
            onClick={handleNext}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-base shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all"
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
