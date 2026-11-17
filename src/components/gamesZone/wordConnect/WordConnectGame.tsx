import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Pause, Shuffle, Lightbulb, Check, X, Trophy, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { GradeId } from '../../../types/schema';
import type {
  GamesZoneDifficulty,
  GamesZoneAttemptRecord,
  WordConnectPuzzle,
} from '../../../types/gamesZone';
import { getQuestionsForGame } from '../../../data/gamesZone';
import { GamesZoneService } from '../../../services/gamesZoneService';
import { sounds } from '../../../services/soundEffects';
import { WordConnectSelectionEngine } from './wordConnectEngine.ts';

interface WordConnectGameProps {
  gradeId: GradeId;
  difficulty: GamesZoneDifficulty;
  studentNumber: string;
  studentClass?: string;
  onComplete: (record: GamesZoneAttemptRecord) => void;
  onPause: () => void;
  isPaused: boolean;
  isMuted: boolean;
}

interface LetterCoord {
  index: number;
  letter: string;
  x: number;
  y: number;
}

const PUZZLES_PER_SESSION = 5;
const WHEEL_SIZE = 280;
const CENTER = WHEEL_SIZE / 2;
const WHEEL_RADIUS = 95;

export const WordConnectGame: React.FC<WordConnectGameProps> = ({
  gradeId,
  difficulty,
  studentNumber,
  studentClass,
  onComplete,
  onPause,
  isPaused,
  isMuted,
}) => {
  // Session items (5 puzzles)
  const [puzzles, setPuzzles] = useState<WordConnectPuzzle[]>([]);
  const [puzzleIndex, setPuzzleIndex] = useState(0);

  // Active puzzle state
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [solvedWordSet, setSolvedWordSet] = useState<Set<string>>(new Set());
  const [revealedHints, setRevealedHints] = useState<Record<string, Set<number>>>({});
  const [hintsRemaining, setHintsRemaining] = useState(3);

  // Synchronous selection engine reference to prevent stale closure duplicates
  const engineRef = useRef<WordConnectSelectionEngine>(new WordConnectSelectionEngine([]));

  // Drag interaction state
  const [isDragging, setIsDragging] = useState(false);
  const [dragPointer, setDragPointer] = useState<{ x: number; y: number } | null>(null);
  const isPointerDownRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const pointerStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const justFinishedDragRef = useRef(false);
  const wheelRef = useRef<HTMLDivElement>(null);

  // Feedback & score
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [shakePreview, setShakePreview] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalWordsFound, setTotalWordsFound] = useState(0);
  const [startTime] = useState(Date.now());

  // Load puzzles for this session
  useEffect(() => {
    const raw = getQuestionsForGame('word_connect', gradeId, difficulty, PUZZLES_PER_SESSION);
    setPuzzles(raw as WordConnectPuzzle[]);
  }, [gradeId, difficulty]);

  const currentPuzzle = puzzles[puzzleIndex] || null;

  // Initialize/reset active puzzle letters and solved state
  useEffect(() => {
    if (currentPuzzle) {
      const letters = [...currentPuzzle.availableLetters];
      setShuffledLetters(letters);
      engineRef.current.setLetters(letters);
      setSelectedIndices([]);
      setSolvedWordSet(new Set());
      setRevealedHints({});
      setHintsRemaining(3);
    }
  }, [currentPuzzle]);

  // Compute circular coordinates for current letters
  const letterCoords: LetterCoord[] = useMemo(() => {
    const n = shuffledLetters.length;
    if (n === 0) return [];
    return shuffledLetters.map((letter, idx) => {
      const angle = (2 * Math.PI * idx) / n - Math.PI / 2;
      return {
        index: idx,
        letter,
        x: CENTER + WHEEL_RADIUS * Math.cos(angle),
        y: CENTER + WHEEL_RADIUS * Math.sin(angle),
      };
    });
  }, [shuffledLetters]);

  // Currently formed word string
  const currentFormedWord = selectedIndices.map((i) => shuffledLetters[i] || '').join('');

  // Finish whole game session
  const finishSession = useCallback(
    (finalScore: number, finalWordsFound: number) => {
      const totalPuzzles = puzzles.length || PUZZLES_PER_SESSION;
      const totalTargetWords = puzzles.reduce((acc, p) => acc + p.targetWords.length, 0) || 15;
      const accuracy = Math.min(100, Math.round((finalWordsFound / totalTargetWords) * 100));
      const durationSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));

      const { xpEarned } = GamesZoneService.calculateXpEarned(
        studentNumber,
        difficulty,
        finalWordsFound,
        totalTargetWords,
        accuracy
      );

      const record: GamesZoneAttemptRecord = {
        attemptId: `gz_wc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        gameId: 'word_connect',
        gameTitle: 'Word Connect',
        studentNumber,
        class: studentClass,
        gradeId,
        difficulty,
        score: finalScore,
        totalQuestions: totalPuzzles,
        correctAnswers: finalWordsFound,
        incorrectAnswers: Math.max(0, totalTargetWords - finalWordsFound),
        accuracyPercentage: accuracy,
        xpEarned,
        durationSeconds,
        completedAt: new Date().toISOString(),
      };

      GamesZoneService.saveAttempt(record);
      onComplete(record);
    },
    [puzzles, startTime, studentNumber, difficulty, studentClass, gradeId, onComplete]
  );

  // Submit currently selected letters
  const handleSubmitWord = useCallback(() => {
    const candidate = engineRef.current.getFormedWord().toUpperCase();
    if (!candidate || !currentPuzzle) return;

    const isTarget = currentPuzzle.targetWords.some((tw) => tw.word.toUpperCase() === candidate);

    if (isTarget) {
      if (solvedWordSet.has(candidate)) {
        // Already found
        setToastMessage(`"${candidate}" is already found!`);
        if (!isMuted) sounds.playTap();
        setTimeout(() => setToastMessage(null), 1500);
      } else {
        // New target word found!
        const nextSet = new Set(solvedWordSet);
        nextSet.add(candidate);
        setSolvedWordSet(nextSet);

        const wordPoints = candidate.length * 25 + streak * 10;
        setScore((s) => s + wordPoints);
        setStreak((st) => st + 1);
        setTotalWordsFound((tw) => tw + 1);

        const targetObj = currentPuzzle.targetWords.find((tw) => tw.word.toUpperCase() === candidate);
        const trText = targetObj ? ` (${targetObj.turkishMeaning})` : '';
        setToastMessage(`✓ Solved: ${candidate}${trText}!`);
        if (!isMuted) sounds.playSuccess();
        setTimeout(() => setToastMessage(null), 2000);
      }
    } else {
      // Invalid guess
      setShakePreview(true);
      setStreak(0);
      if (!isMuted) sounds.playError();
      setTimeout(() => setShakePreview(false), 500);
    }

    engineRef.current.clear();
    setSelectedIndices([]);
    setDragPointer(null);
  }, [currentPuzzle, isMuted, solvedWordSet, streak]);

  // Pointer & Drag Handlers on Wheel
  const handleWheelPointerDown = (e: React.PointerEvent) => {
    if (isPaused) return;

    // Capture pointer on wheel container to keep continuous drag tracking reliable
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore if pointer capture unsupported
    }

    isPointerDownRef.current = true;
    hasDraggedRef.current = false;
    pointerStartPosRef.current = { x: e.clientX, y: e.clientY };

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Hit-test if pointer went down directly over a letter tile
    for (const coord of letterCoords) {
      if (Math.hypot(coord.x - x, coord.y - y) <= 32) {
        // If starting fresh or not in tap mode:
        if (engineRef.current.getSelectedIndices().length === 0) {
          engineRef.current.clear();
          engineRef.current.selectTile(coord.index);
          setSelectedIndices(engineRef.current.getSelectedIndices());
          if (!isMuted) sounds.playTap();
        }
        break;
      }
    }
  };

  const handleWheelPointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current || isPaused || !wheelRef.current) return;

    const rect = wheelRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Threshold detection to distinguish drag gesture from stationary tap
    if (pointerStartPosRef.current && !hasDraggedRef.current) {
      const dist = Math.hypot(e.clientX - pointerStartPosRef.current.x, e.clientY - pointerStartPosRef.current.y);
      if (dist > 8) {
        hasDraggedRef.current = true;
        setIsDragging(true);
      }
    }

    if (hasDraggedRef.current) {
      setDragPointer({ x, y });

      // Hit-test letter nodes
      for (const coord of letterCoords) {
        const dist = Math.hypot(coord.x - x, coord.y - y);
        if (dist <= 32) {
          const changed = engineRef.current.selectTile(coord.index);
          if (changed) {
            setSelectedIndices(engineRef.current.getSelectedIndices());
            if (!isMuted) sounds.playTap();
          }
          break;
        }
      }
    }
  };

  const handleWheelPointerUp = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    setDragPointer(null);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    if (hasDraggedRef.current) {
      // The user finished a drag gesture -> auto-submit the formed word
      setIsDragging(false);
      justFinishedDragRef.current = true;
      setTimeout(() => {
        justFinishedDragRef.current = false;
      }, 200);

      handleSubmitWord();
    } else {
      // Stationary tap (Smartboard Mode) -> do not auto-submit
      setIsDragging(false);
    }
  };

  // Click-to-select alternative for Smartboards
  const handleLetterClick = (index: number) => {
    if (isPaused || justFinishedDragRef.current) return;

    const changed = engineRef.current.handleTapTile(index);
    if (changed) {
      setSelectedIndices(engineRef.current.getSelectedIndices());
      if (!isMuted) sounds.playTap();
    }
  };

  const handleClearSelection = () => {
    engineRef.current.clear();
    setSelectedIndices([]);
    setDragPointer(null);
  };

  // Shuffle button (rearrange letters on wheel)
  const handleShuffle = () => {
    if (isPaused) return;
    if (!isMuted) sounds.playTap();
    setShuffledLetters((prev) => {
      const copy = [...prev];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      engineRef.current.setLetters(copy);
      return copy;
    });
    engineRef.current.clear();
    setSelectedIndices([]);
  };

  // Hint button (reveal a random hidden letter)
  const handleUseHint = () => {
    if (hintsRemaining <= 0 || !currentPuzzle || isPaused) return;

    // Find unsolved words
    const unsolvedWords = currentPuzzle.targetWords.filter(
      (tw) => !solvedWordSet.has(tw.word.toUpperCase())
    );

    if (unsolvedWords.length === 0) return;

    // Pick a word and an unrevealed letter slot
    const randomWordObj = unsolvedWords[Math.floor(Math.random() * unsolvedWords.length)];
    const wordStr = randomWordObj.word.toUpperCase();
    const alreadyRevealed = revealedHints[wordStr] || new Set<number>();

    const unrevealedSlots: number[] = [];
    for (let i = 0; i < wordStr.length; i++) {
      if (!alreadyRevealed.has(i)) unrevealedSlots.push(i);
    }

    if (unrevealedSlots.length > 0) {
      const chosenSlot = unrevealedSlots[Math.floor(Math.random() * unrevealedSlots.length)];
      const nextHints = { ...revealedHints };
      nextHints[wordStr] = new Set(alreadyRevealed).add(chosenSlot);
      setRevealedHints(nextHints);
      setHintsRemaining((h) => h - 1);
      if (!isMuted) sounds.playTap();
    }
  };

  const isCurrentPuzzleCleared = currentPuzzle
    ? currentPuzzle.targetWords.every((tw) => solvedWordSet.has(tw.word.toUpperCase()))
    : false;

  const handleNextPuzzle = () => {
    if (puzzleIndex + 1 < puzzles.length) {
      setPuzzleIndex((p) => p + 1);
    } else {
      finishSession(score, totalWordsFound);
    }
  };

  if (!currentPuzzle) {
    return (
      <div className="card-island p-8 text-center text-slate-600 bg-white shadow-xl rounded-3xl">
        <Sparkles className="w-8 h-8 text-pink-500 animate-spin mx-auto mb-3" />
        <p className="font-bold">Loading Word Connect puzzles...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center space-y-4 select-none">
      {/* Top Header / HUD Bar */}
      <div className="w-full card-island p-4 bg-white/95 backdrop-blur-md border-2 border-pink-200 shadow-md rounded-2xl flex items-center justify-between">
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
              <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-pink-100 text-pink-800 border border-pink-300">
                Word Connect
              </span>
              <span className="text-xs font-bold text-slate-500">
                Puzzle {puzzleIndex + 1} of {puzzles.length}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-400 mt-0.5">
              Theme: <span className="text-pink-600">{currentPuzzle.theme}</span> ({currentPuzzle.category})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs font-bold text-slate-400">Score</span>
            <div className="text-lg font-black text-amber-500 flex items-center justify-end gap-1">
              <Trophy className="w-4 h-4 fill-current" />
              <span>{score}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleUseHint}
            disabled={hintsRemaining <= 0 || isCurrentPuzzleCleared}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 border ${
              hintsRemaining > 0
                ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200 active:scale-95'
                : 'bg-slate-100 text-slate-400 border-slate-200 opacity-50'
            }`}
          >
            <Lightbulb className="w-4 h-4 text-amber-600 fill-current" />
            <span>Hint ({hintsRemaining})</span>
          </button>
        </div>
      </div>

      {/* Target Word Slots Grid */}
      <div className="w-full card-island p-5 bg-white border-2 border-slate-200 rounded-3xl shadow-lg flex flex-col items-center">
        <div className="w-full flex flex-wrap gap-3 justify-center items-center">
          {currentPuzzle.targetWords.map((tw) => {
            const wUpper = tw.word.toUpperCase();
            const isSolved = solvedWordSet.has(wUpper);
            const revealedSet = revealedHints[wUpper] || new Set<number>();

            return (
              <div
                key={wUpper}
                className={`p-2 rounded-2xl border-2 transition-all flex flex-col items-center ${
                  isSolved
                    ? 'bg-emerald-50 border-emerald-300 shadow-sm'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex gap-1">
                  {wUpper.split('').map((char, charIdx) => {
                    const isCharRevealed = isSolved || revealedSet.has(charIdx);

                    return (
                      <div
                        key={charIdx}
                        className={`w-8 h-9 sm:w-9 sm:h-10 rounded-xl flex items-center justify-center font-black text-sm sm:text-base border transition-all ${
                          isSolved
                            ? 'bg-emerald-500 border-emerald-600 text-white shadow-sm'
                            : isCharRevealed
                            ? 'bg-amber-100 border-amber-300 text-amber-900'
                            : 'bg-white border-slate-300 text-transparent'
                        }`}
                      >
                        {isCharRevealed ? char : ''}
                      </div>
                    );
                  })}
                </div>
                {isSolved && (
                  <span className="text-[10px] font-bold text-emerald-800 mt-1 truncate max-w-[120px]">
                    {tw.turkishMeaning}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Formed Word Live Preview & Feedback Toast */}
      <div className="h-10 flex items-center justify-center">
        {toastMessage ? (
          <div className="px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-black shadow-md animate-fade-in flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{toastMessage}</span>
          </div>
        ) : (
          <div
            className={`px-5 py-1.5 rounded-2xl bg-white border-2 border-pink-200 text-pink-700 text-lg font-black tracking-widest shadow-sm min-w-[120px] text-center transition-all ${
              shakePreview ? 'animate-shake border-rose-400 text-rose-600' : ''
            }`}
          >
            {currentFormedWord || <span className="text-slate-300 text-xs font-bold tracking-normal">Drag or tap letters</span>}
          </div>
        )}
      </div>

      {/* Letter Wheel Area */}
      <div className="relative flex items-center justify-center">
        {/* Circular Wheel Canvas / Container */}
        <div
          ref={wheelRef}
          onPointerDown={handleWheelPointerDown}
          onPointerMove={handleWheelPointerMove}
          onPointerUp={handleWheelPointerUp}
          onPointerCancel={handleWheelPointerUp}
          className="relative rounded-full bg-white border-4 border-pink-200 shadow-xl touch-none select-none"
          style={{ width: WHEEL_SIZE, height: WHEEL_SIZE }}
        >
          {/* Connecting SVG Lines */}
          <svg
            className="absolute inset-0 pointer-events-none"
            width={WHEEL_SIZE}
            height={WHEEL_SIZE}
          >
            {/* Lines between selected letters */}
            {selectedIndices.length > 1 &&
              selectedIndices.map((letterIdx, i) => {
                if (i === 0) return null;
                const prev = letterCoords[selectedIndices[i - 1]];
                const curr = letterCoords[letterIdx];
                if (!prev || !curr) return null;

                return (
                  <line
                    key={`line_${i}`}
                    x1={prev.x}
                    y1={prev.y}
                    x2={curr.x}
                    y2={curr.y}
                    stroke="#EC4899"
                    strokeWidth={8}
                    strokeLinecap="round"
                    className="drop-shadow-sm opacity-90"
                  />
                );
              })}

            {/* Live Drag Pointer Line */}
            {isDragging && selectedIndices.length > 0 && dragPointer && (
              <line
                x1={letterCoords[selectedIndices[selectedIndices.length - 1]]?.x || CENTER}
                y1={letterCoords[selectedIndices[selectedIndices.length - 1]]?.y || CENTER}
                x2={dragPointer.x}
                y2={dragPointer.y}
                stroke="#F472B6"
                strokeWidth={5}
                strokeDasharray="4 4"
                strokeLinecap="round"
              />
            )}
          </svg>

          {/* Letter Nodes */}
          {letterCoords.map((coord) => {
            const isSelected = selectedIndices.includes(coord.index);
            const selectionOrder = selectedIndices.indexOf(coord.index) + 1;

            return (
              <div
                key={coord.index}
                onClick={(e) => {
                  e.stopPropagation();
                  handleLetterClick(coord.index);
                }}
                className={`absolute w-14 h-14 -ml-7 -mt-7 rounded-full flex items-center justify-center font-black text-xl cursor-pointer select-none transition-all duration-150 pointer-events-auto ${
                  isSelected
                    ? 'bg-pink-500 border-4 border-white text-white shadow-lg scale-110'
                    : 'bg-white hover:bg-pink-50 border-3 border-pink-300 text-slate-800 shadow-md'
                }`}
                style={{
                  left: coord.x,
                  top: coord.y,
                }}
              >
                <span>{coord.letter}</span>
                {isSelected && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white text-pink-600 font-black text-[10px] flex items-center justify-center border border-pink-300 shadow-sm">
                    {selectionOrder}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Controls Beside Wheel (Accessible Smartboard Buttons) */}
        <div className="absolute -right-16 sm:-right-20 flex flex-col gap-3">
          <button
            type="button"
            onClick={handleSubmitWord}
            disabled={selectedIndices.length === 0}
            className="w-12 h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white font-black shadow-md flex items-center justify-center active:scale-95 transition border-2 border-emerald-600"
            title="Submit Word (✓)"
          >
            <Check className="w-6 h-6 stroke-[3]" />
          </button>
          <button
            type="button"
            onClick={handleClearSelection}
            disabled={selectedIndices.length === 0}
            className="w-12 h-12 rounded-2xl bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white font-black shadow-md flex items-center justify-center active:scale-95 transition border-2 border-rose-600"
            title="Clear Word (✕)"
          >
            <X className="w-6 h-6 stroke-[3]" />
          </button>
          <button
            type="button"
            onClick={handleShuffle}
            className="w-12 h-12 rounded-2xl bg-sky-100 hover:bg-sky-200 text-sky-800 font-black shadow-sm flex items-center justify-center active:scale-95 transition border-2 border-sky-300"
            title="Shuffle Wheel"
          >
            <Shuffle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Cleared Puzzle Overlay / Next Button */}
      {isCurrentPuzzleCleared && (
        <div className="w-full card-island p-5 bg-white border-2 border-pink-300 rounded-3xl shadow-xl animate-fade-in flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-pink-100 border-2 border-pink-300 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7 text-pink-600" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-lg">
                Puzzle Cleared! 🎉
              </h3>
              <p className="text-xs text-slate-600">
                You discovered all {currentPuzzle.targetWords.length} words in this set!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleNextPuzzle}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-sm btn-game-coral flex items-center justify-center gap-2 shadow-lg active:scale-95 transition"
          >
            <span>{puzzleIndex + 1 < puzzles.length ? 'Next Puzzle' : 'Complete Run'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
