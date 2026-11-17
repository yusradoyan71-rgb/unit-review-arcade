import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Pause, Sparkles, Lightbulb, CheckCircle2, ArrowRight, HelpCircle, Trophy } from 'lucide-react';
import type { GradeId } from '../../../types/schema';
import type {
  GamesZoneDifficulty,
  GamesZoneAttemptRecord,
  WordleEnglishItem,
} from '../../../types/gamesZone';
import { getQuestionsForGame } from '../../../data/gamesZone';
import { GamesZoneService } from '../../../services/gamesZoneService';
import { sounds } from '../../../services/soundEffects';
import { evaluateWordleGuess, type TileStatus } from './wordleEvaluator.ts';

interface WordleEnglishGameProps {
  gradeId: GradeId;
  difficulty: GamesZoneDifficulty;
  studentNumber: string;
  studentClass?: string;
  onComplete: (record: GamesZoneAttemptRecord) => void;
  onPause: () => void;
  isPaused: boolean;
  isMuted: boolean;
}

interface GuessEvaluation {
  guess: string;
  statuses: TileStatus[];
}

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
];

const MAX_ATTEMPTS = 6;
const ROUNDS_PER_SESSION = 5;

export const WordleEnglishGame: React.FC<WordleEnglishGameProps> = ({
  gradeId,
  difficulty,
  studentNumber,
  studentClass,
  onComplete,
  onPause,
  isPaused,
  isMuted,
}) => {
  // Session items: 5 words per session
  const [items, setItems] = useState<WordleEnglishItem[]>([]);
  const [roundIndex, setRoundIndex] = useState(0);

  // Active word state
  const [currentGuess, setCurrentGuess] = useState('');
  const [evaluations, setEvaluations] = useState<GuessEvaluation[]>([]);
  const [isRoundFinished, setIsRoundFinished] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [shakeRow, setShakeRow] = useState(false);
  const [showClue, setShowClue] = useState(false);

  // Stats across the session
  const [solvedCount, setSolvedCount] = useState(0);
  const [totalAttemptsMade, setTotalAttemptsMade] = useState(0);
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());

  // Load 5 items for this session
  useEffect(() => {
    const raw = getQuestionsForGame('wordle_english', gradeId, difficulty, ROUNDS_PER_SESSION);
    setItems(raw as WordleEnglishItem[]);
  }, [gradeId, difficulty]);

  const currentItem = items[roundIndex] || null;
  const wordLength = currentItem ? currentItem.word.length : (difficulty === 'easy' ? 4 : difficulty === 'medium' ? 5 : 6);

  // Best status map for on-screen keyboard keys
  const keyStatuses = useMemo(() => {
    const map: Record<string, 'correct' | 'present' | 'absent'> = {};
    for (const ev of evaluations) {
      for (let i = 0; i < ev.guess.length; i++) {
        const char = ev.guess[i];
        const status = ev.statuses[i];
        if (status === 'correct') {
          map[char] = 'correct';
        } else if (status === 'present' && map[char] !== 'correct') {
          map[char] = 'present';
        } else if (status === 'absent' && !map[char]) {
          map[char] = 'absent';
        }
      }
    }
    return map;
  }, [evaluations]);

  // Finish whole game session
  const finishSession = useCallback(
    (finalSolved: number, finalScore: number) => {
      const totalRounds = items.length || ROUNDS_PER_SESSION;
      const accuracy = Math.round((finalSolved / totalRounds) * 100);
      const durationSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));

      const { xpEarned } = GamesZoneService.calculateXpEarned(
        studentNumber,
        difficulty,
        finalSolved,
        totalRounds,
        accuracy
      );

      const record: GamesZoneAttemptRecord = {
        attemptId: `gz_we_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        gameId: 'wordle_english',
        gameTitle: 'Wordle English',
        studentNumber,
        class: studentClass,
        gradeId,
        difficulty,
        score: finalScore,
        totalQuestions: totalRounds,
        correctAnswers: finalSolved,
        incorrectAnswers: totalRounds - finalSolved,
        accuracyPercentage: accuracy,
        xpEarned,
        durationSeconds,
        completedAt: new Date().toISOString(),
      };

      GamesZoneService.saveAttempt(record);
      onComplete(record);
    },
    [items.length, startTime, studentNumber, difficulty, studentClass, gradeId, onComplete]
  );

  // Submit current guess
  const handleSubmitGuess = useCallback(() => {
    if (isRoundFinished || isPaused || !currentItem) return;

    if (currentGuess.length < wordLength) {
      // Shake row warning
      setShakeRow(true);
      if (!isMuted) sounds.playError();
      setTimeout(() => setShakeRow(false), 500);
      return;
    }

    const statuses = evaluateWordleGuess(currentItem.word, currentGuess);
    const newEvaluations = [...evaluations, { guess: currentGuess, statuses }];
    setEvaluations(newEvaluations);
    setCurrentGuess('');
    setTotalAttemptsMade((a) => a + 1);

    const hasWon = statuses.every((s) => s === 'correct');

    if (hasWon) {
      // Correctly guessed!
      setIsRoundFinished(true);
      setIsSolved(true);
      const attemptsUsed = newEvaluations.length;
      const attemptBonus = (MAX_ATTEMPTS - attemptsUsed + 1) * 20;
      const roundScore = 100 + attemptBonus;
      setScore((s) => s + roundScore);
      setSolvedCount((c) => c + 1);
      if (!isMuted) sounds.playSuccess();
    } else if (newEvaluations.length >= MAX_ATTEMPTS) {
      // Ran out of attempts
      setIsRoundFinished(true);
      setIsSolved(false);
      if (!isMuted) sounds.playError();
    } else {
      // Regular guess submitted
      if (!isMuted) sounds.playTap();
    }
  }, [currentGuess, evaluations, isMuted, isPaused, isRoundFinished, currentItem, wordLength]);

  // Handle typing letter
  const handleInputLetter = useCallback(
    (letter: string) => {
      if (isRoundFinished || isPaused || !currentItem) return;
      if (currentGuess.length < wordLength) {
        if (!isMuted) sounds.playTap();
        setCurrentGuess((prev) => prev + letter.toUpperCase());
      }
    },
    [currentGuess.length, currentItem, isMuted, isPaused, isRoundFinished, wordLength]
  );

  // Handle backspace
  const handleBackspace = useCallback(() => {
    if (isRoundFinished || isPaused) return;
    if (currentGuess.length > 0) {
      if (!isMuted) sounds.playTap();
      setCurrentGuess((prev) => prev.slice(0, -1));
    }
  }, [currentGuess.length, isMuted, isPaused, isRoundFinished]);

  // Physical keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused) return;
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmitGuess();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault();
        handleInputLetter(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleBackspace, handleInputLetter, handleSubmitGuess, isPaused]);

  // Advance to next word or finish session
  const handleNextWord = () => {
    if (roundIndex + 1 < items.length) {
      setRoundIndex((i) => i + 1);
      setCurrentGuess('');
      setEvaluations([]);
      setIsRoundFinished(false);
      setIsSolved(false);
      setShowClue(false);
    } else {
      finishSession(solvedCount, score);
    }
  };

  if (!currentItem) {
    return (
      <div className="card-island p-8 text-center text-slate-600 bg-white shadow-xl rounded-3xl">
        <Sparkles className="w-8 h-8 text-emerald-500 animate-spin mx-auto mb-3" />
        <p className="font-bold">Loading Wordle English words...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center space-y-4 select-none">
      {/* Top Header / HUD Bar */}
      <div className="w-full card-island p-4 bg-white/95 backdrop-blur-md border-2 border-emerald-200 shadow-md rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onPause}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition active:scale-95 border border-slate-200"
            title="Pause Game"
          >
            <Pause className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                Wordle English
              </span>
              <span className="text-xs font-bold text-slate-500">
                Word {roundIndex + 1} of {items.length}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-400 mt-0.5">
              Difficulty: <span className="text-emerald-600 capitalize">{difficulty}</span> ({wordLength} letters)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Guesses</span>
            <span className="text-sm font-black text-slate-700">{totalAttemptsMade}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Score</span>
            <div className="text-lg font-black text-amber-500 flex items-center justify-end gap-1">
              <Trophy className="w-4 h-4 fill-current" />
              <span>{score}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowClue((prev) => !prev)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 border ${
              showClue
                ? 'bg-amber-100 text-amber-800 border-amber-300 shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-amber-50 hover:text-amber-700 border-slate-200'
            }`}
          >
            <Lightbulb className={`w-4 h-4 ${showClue ? 'text-amber-500 fill-current' : ''}`} />
            <span>Clue</span>
          </button>
        </div>
      </div>

      {/* Clue Banner */}
      {showClue && (
        <div className="w-full bg-amber-50 border-2 border-amber-200 rounded-2xl p-3.5 shadow-sm flex items-start gap-3 animate-fade-in">
          <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 fill-current" />
          <div className="text-xs leading-relaxed text-amber-900">
            <p className="font-black text-amber-950 mb-0.5">
              Category: <span className="font-semibold text-amber-800">{currentItem.category}</span>
            </p>
            <p>
              <strong className="font-bold">Prompt:</strong> {currentItem.clue}
            </p>
            <p className="mt-1 text-amber-800 font-medium">
              <strong className="font-bold">Turkish Clue:</strong> {currentItem.turkishMeaning}
            </p>
          </div>
        </div>
      )}

      {/* 6-Row Wordle Letter Grid */}
      <div
        className={`w-full card-island p-5 bg-white border-2 border-slate-200 rounded-3xl shadow-lg flex flex-col items-center space-y-2.5 transition-transform ${
          shakeRow ? 'animate-shake' : ''
        }`}
      >
        {Array.from({ length: MAX_ATTEMPTS }).map((_, rowIdx) => {
          const isEvaluatedRow = rowIdx < evaluations.length;
          const isCurrentRow = rowIdx === evaluations.length;
          const evaluation = evaluations[rowIdx];

          return (
            <div key={rowIdx} className="flex gap-2 justify-center">
              {Array.from({ length: wordLength }).map((_, colIdx) => {
                let letter = '';
                let status: TileStatus = 'empty';

                if (isEvaluatedRow && evaluation) {
                  letter = evaluation.guess[colIdx] || '';
                  status = evaluation.statuses[colIdx] || 'absent';
                } else if (isCurrentRow) {
                  letter = currentGuess[colIdx] || '';
                  status = letter ? 'typing' : 'empty';
                }

                // Tile Style Map
                let tileClass = 'bg-slate-50 border-2 border-slate-200 text-slate-800';
                if (status === 'typing') {
                  tileClass = 'bg-white border-2 border-sky-400 text-sky-900 shadow-sm scale-105';
                } else if (status === 'correct') {
                  tileClass = 'bg-emerald-500 border-2 border-emerald-600 text-white font-black shadow-md';
                } else if (status === 'present') {
                  tileClass = 'bg-amber-400 border-2 border-amber-500 text-white font-black shadow-md';
                } else if (status === 'absent') {
                  tileClass = 'bg-slate-400 border-2 border-slate-500 text-white font-bold opacity-80';
                }

                return (
                  <div
                    key={colIdx}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-black transition-all duration-300 ${tileClass}`}
                  >
                    {letter}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Round Reveal Card (When Round is Finished) */}
      {isRoundFinished && (
        <div className="w-full card-island p-5 bg-white border-2 border-emerald-300 rounded-3xl shadow-xl animate-fade-in flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            {isSolved ? (
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-rose-100 border-2 border-rose-300 flex items-center justify-center shrink-0">
                <HelpCircle className="w-7 h-7 text-rose-600" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-slate-900 tracking-wider">
                  {currentItem.word}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold border border-sky-200">
                  {currentItem.category}
                </span>
              </div>
              <p className="text-sm font-bold text-emerald-700 mt-0.5">
                Turkish: {currentItem.turkishMeaning}
              </p>
              <p className="text-xs text-slate-600 italic mt-1 leading-relaxed">
                "{currentItem.exampleSentence}"
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleNextWord}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-sm btn-game-emerald flex items-center justify-center gap-2 shadow-lg active:scale-95 transition"
          >
            <span>{roundIndex + 1 < items.length ? 'Next Word' : 'Complete Run'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Virtual On-Screen Keyboard */}
      <div className="w-full card-island p-3 bg-white/95 backdrop-blur-md border-2 border-slate-200 shadow-md rounded-3xl flex flex-col items-center space-y-1.5">
        {KEYBOARD_ROWS.map((row, rIdx) => (
          <div key={rIdx} className="flex gap-1 sm:gap-1.5 justify-center w-full">
            {row.map((key) => {
              const isSpecial = key === 'ENTER' || key === 'BACKSPACE';
              const status = keyStatuses[key];

              let keyClass = 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200';
              if (status === 'correct') {
                keyClass = 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600 shadow-sm';
              } else if (status === 'present') {
                keyClass = 'bg-amber-400 hover:bg-amber-500 text-white border-amber-500 shadow-sm';
              } else if (status === 'absent') {
                keyClass = 'bg-slate-400 hover:bg-slate-500 text-white/90 border-slate-500 opacity-60';
              }

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    if (key === 'ENTER') handleSubmitGuess();
                    else if (key === 'BACKSPACE') handleBackspace();
                    else handleInputLetter(key);
                  }}
                  disabled={isRoundFinished}
                  className={`h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-black border transition active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center ${
                    isSpecial ? 'px-2.5 sm:px-3 text-xs bg-slate-200 hover:bg-slate-300 text-slate-900' : 'flex-1 min-w-[28px] sm:min-w-[36px]'
                  } ${keyClass}`}
                >
                  {key === 'BACKSPACE' ? '⌫' : key}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
