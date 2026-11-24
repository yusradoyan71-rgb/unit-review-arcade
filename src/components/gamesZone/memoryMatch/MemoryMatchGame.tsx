import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles,
  Trophy,
  RotateCcw,
  Flame,
  Clock,
  Layers,
  BookOpen,
  Image as ImageIcon,
  Languages,
  CheckCircle2,
  Volume2,
  VolumeX,
  Pause,
  Play,
  Star,
} from 'lucide-react';
import type { GradeId } from '../../../types/schema';
import type {
  GamesZoneDifficulty,
  GamesZoneAttemptRecord,
  MemoryMatchMode,
  MemoryMatchSet,
  MemoryMatchPair,
} from '../../../types/gamesZone';
import { getQuestionsForGame } from '../../../data/gamesZone';
import { MemoryMatchIcon } from './MemoryMatchIcons';
import { sounds } from '../../../services/soundEffects';

interface MemoryCard {
  cardId: string;
  pairId: string;
  side: 'left' | 'right';
  text: string;
  mode: MemoryMatchMode;
  imageRef?: string;
  topic: string;
  explanation?: string;
}

interface MemoryMatchGameProps {
  gradeId: GradeId;
  difficulty: GamesZoneDifficulty;
  studentNumber: string;
  studentClass?: string;
  onComplete: (record: GamesZoneAttemptRecord) => void;
  onPause: () => void;
  isPaused: boolean;
  isMuted: boolean;
}

export const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({
  gradeId,
  difficulty,
  studentNumber,
  studentClass,
  onComplete,
  onPause,
  isPaused,
  isMuted,
}) => {
  // Game state
  const [currentSet, setCurrentSet] = useState<MemoryMatchSet | null>(null);
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCardIds, setFlippedCardIds] = useState<string[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<Set<string>>(new Set());
  const [moves, setMoves] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(isMuted);

  // Safeguards and refs
  const isLockingRef = useRef<boolean>(false);
  const flipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gameTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const hasReportedRef = useRef<boolean>(false);
  const sessionStartTimeRef = useRef<number>(Date.now());

  // Setup mounted guard
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (flipTimerRef.current) clearTimeout(flipTimerRef.current);
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    };
  }, []);

  // Initialize or reset a puzzle set
  const initSet = useCallback(() => {
    if (flipTimerRef.current) clearTimeout(flipTimerRef.current);
    isLockingRef.current = false;
    hasReportedRef.current = false;
    sessionStartTimeRef.current = Date.now();

    // Fetch a set for this grade and difficulty with recent history tracking
    const sets = getQuestionsForGame('memory_match', gradeId, difficulty, 1, studentNumber) as MemoryMatchSet[];
    const chosenSet = sets && sets.length > 0 ? sets[0] : null;

    if (!chosenSet || !chosenSet.pairs || chosenSet.pairs.length === 0) {
      setCurrentSet(null);
      setCards([]);
      return;
    }

    setCurrentSet(chosenSet);

    // Build pair cards: 2 cards per pair
    const cardList: MemoryCard[] = [];
    chosenSet.pairs.forEach((pair: MemoryMatchPair, idx: number) => {
      // Left card (English word)
      cardList.push({
        cardId: `c_${idx}_left`,
        pairId: pair.pairId,
        side: 'left',
        text: pair.leftText,
        mode: pair.mode,
        topic: pair.topic,
        explanation: pair.explanation,
      });

      // Right card (Meaning / Definition / Picture)
      cardList.push({
        cardId: `c_${idx}_right`,
        pairId: pair.pairId,
        side: 'right',
        text: pair.rightText,
        mode: pair.mode,
        imageRef: pair.imageRef,
        topic: pair.topic,
        explanation: pair.explanation,
      });
    });

    // Fisher-Yates shuffle
    for (let i = cardList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardList[i], cardList[j]] = [cardList[j], cardList[i]];
    }

    setCards(cardList);
    setFlippedCardIds([]);
    setMatchedPairIds(new Set());
    setMoves(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setSecondsElapsed(0);
    setIsCompleted(false);
  }, [gradeId, difficulty, studentNumber]);

  // Initial load
  useEffect(() => {
    initSet();
  }, [initSet]);

  // Game timer
  useEffect(() => {
    if (isPaused || isCompleted) {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
      return;
    }

    gameTimerRef.current = setInterval(() => {
      if (isMountedRef.current) {
        setSecondsElapsed((prev) => prev + 1);
      }
    }, 1000);

    return () => {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    };
  }, [isPaused, isCompleted]);

  // Handle Card Click
  const handleCardClick = (card: MemoryCard) => {
    // Rule 1: Ignore clicks if interaction is locked (waiting for flip-back)
    if (isLockingRef.current) return;

    // Rule 2: Ignore clicks if game is paused or already completed
    if (isPaused || isCompleted) return;

    // Rule 3: Ignore clicks on already matched cards
    if (matchedPairIds.has(card.pairId)) return;

    // Rule 4: Ignore clicking the exact same card twice
    if (flippedCardIds.includes(card.cardId)) return;

    // Play tap sound
    if (!isSoundMuted) {
      try { sounds.playTap(); } catch {}
    }

    // Step A: First card clicked
    if (flippedCardIds.length === 0) {
      setFlippedCardIds([card.cardId]);
      return;
    }

    // Step B: Second card clicked
    if (flippedCardIds.length === 1) {
      const firstCardId = flippedCardIds[0];
      const firstCard = cards.find((c) => c.cardId === firstCardId);

      if (!firstCard) return;

      const newFlipped = [firstCardId, card.cardId];
      setFlippedCardIds(newFlipped);
      setMoves((m) => m + 1);

      // Check for Match
      if (firstCard.pairId === card.pairId) {
        // --- MATCH SUCCESS ---
        if (!isSoundMuted) {
          try { sounds.playSuccess(); } catch {}
        }

        const nextStreak = streak + 1;
        setStreak(nextStreak);
        setMaxStreak((prev) => Math.max(prev, nextStreak));
        setScore((prev) => prev + 100 + (nextStreak * 25));

        const nextMatched = new Set(matchedPairIds);
        nextMatched.add(card.pairId);
        setMatchedPairIds(nextMatched);

        // Clear flipped cards so board is ready
        setFlippedCardIds([]);

        // Check completion condition
        if (currentSet && nextMatched.size === currentSet.pairs.length) {
          handleVictory(nextMatched.size);
        }
      } else {
        // --- MISMATCH ---
        if (!isSoundMuted) {
          try { sounds.playError(); } catch {}
        }

        setStreak(0);
        isLockingRef.current = true;

        if (flipTimerRef.current) clearTimeout(flipTimerRef.current);
        flipTimerRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            setFlippedCardIds([]);
            isLockingRef.current = false;
          }
        }, 900);
      }
    }
  };

  // Victory celebration & reward calculation
  const handleVictory = (totalPairsCount: number) => {
    setIsCompleted(true);
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);

    if (hasReportedRef.current) return;
    hasReportedRef.current = true;

    // Calculate accuracy percentage
    // Minimum theoretical moves = totalPairs
    const actualMoves = moves + 1; // including the final winning move
    const accuracy = Math.min(100, Math.max(20, Math.round((totalPairsCount / actualMoves) * 100)));

    // Calculate XP based on difficulty and efficiency
    let baseXP = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20;
    if (accuracy >= 80) baseXP += 5;
    if (accuracy === 100) baseXP += 5;

    // Monster coins
    const baseCoins = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 5;

    const record: GamesZoneAttemptRecord = {
      attemptId: `att_mm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      gameId: 'memory_match',
      gameTitle: 'Memory Match',
      studentNumber,
      class: studentClass,
      gradeId,
      difficulty,
      score: score + 200,
      totalQuestions: totalPairsCount,
      correctAnswers: totalPairsCount,
      incorrectAnswers: Math.max(0, actualMoves - totalPairsCount),
      accuracyPercentage: accuracy,
      xpEarned: baseXP,
      coinsEarned: baseCoins,
      durationSeconds: secondsElapsed,
      completedAt: new Date().toISOString(),
    };

    onComplete(record);
  };

  // Helper for mode title and icon
  const getModeBadge = (mode?: MemoryMatchMode) => {
    switch (mode) {
      case 'word_meaning':
        return { label: 'Word & Meaning', icon: Languages, color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'word_definition':
        return { label: 'Word & Definition', icon: BookOpen, color: 'bg-indigo-100 text-indigo-800 border-indigo-300' };
      case 'word_picture':
        return { label: 'Word & Picture', icon: ImageIcon, color: 'bg-purple-100 text-purple-800 border-purple-300' };
      default:
        return { label: 'Memory Match', icon: Layers, color: 'bg-slate-100 text-slate-800 border-slate-300' };
    }
  };

  // Rating stars for victory modal
  const getStarRating = () => {
    if (!currentSet) return 3;
    const totalPairs = currentSet.pairs.length;
    if (moves <= totalPairs * 1.5) return 3;
    if (moves <= totalPairs * 2.2) return 2;
    return 1;
  };

  const modeBadge = getModeBadge(currentSet?.mode);
  const ModeIcon = modeBadge.icon;
  const totalPairs = currentSet?.pairs.length || 0;
  const matchedPairsCount = matchedPairIds.size;

  // Grid column class based on difficulty
  const gridClasses = {
    easy: 'grid-cols-2 sm:grid-cols-4 max-w-2xl',
    medium: 'grid-cols-3 sm:grid-cols-4 max-w-3xl',
    hard: 'grid-cols-4 sm:grid-cols-4 max-w-4xl',
  }[difficulty];

  return (
    <div className="w-full flex flex-col items-center select-none font-sans pb-10">
      {/* Top Navigation & Status Bar */}
      <div className="w-full max-w-4xl bg-white/95 backdrop-blur-md rounded-2xl border-2 border-purple-200 shadow-md p-3 sm:p-4 mb-4 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Mode & Topic Badges */}
        <div className="flex items-center gap-2">
          <div className={`px-2.5 py-1 rounded-xl border text-xs font-black flex items-center gap-1.5 shadow-sm ${modeBadge.color}`}>
            <ModeIcon className="w-3.5 h-3.5" />
            <span>{modeBadge.label}</span>
          </div>

          <span className="hidden sm:inline-block px-2.5 py-1 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold">
            {currentSet?.topic || 'Curriculum Pairs'}
          </span>
        </div>

        {/* Center: Live Stats (Moves, Pairs, Streak) */}
        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm font-black">
          <div className="flex items-center gap-1 text-slate-700 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200">
            <span className="text-slate-500 font-semibold">Moves:</span>
            <span className="font-mono text-purple-700 font-black">{moves}</span>
          </div>

          <div className="flex items-center gap-1 text-slate-700 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200">
            <span className="text-slate-500 font-semibold">Pairs:</span>
            <span className="font-mono text-emerald-600 font-black">{matchedPairsCount} / {totalPairs}</span>
          </div>

          {streak > 1 && (
            <div className="flex items-center gap-1 bg-gradient-to-r from-amber-100 to-orange-100 text-orange-700 px-2.5 py-1 rounded-xl border border-amber-300 anim-badge shadow-sm">
              <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
              <span className="font-mono font-black">{streak}x</span>
            </div>
          )}
        </div>

        {/* Right: Controls & Timer */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs font-mono font-bold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {Math.floor(secondsElapsed / 60)}:{(secondsElapsed % 60).toString().padStart(2, '0')}
            </span>
          </div>

          <button
            onClick={() => setIsSoundMuted(!isSoundMuted)}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title={isSoundMuted ? 'Unmute sounds' : 'Mute sounds'}
          >
            {isSoundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={initSet}
            className="p-1.5 rounded-xl text-slate-500 hover:text-purple-700 hover:bg-purple-50 transition-colors"
            title="Restart Puzzle"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onPause}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Pause Game"
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-600" /> : <Pause className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Card Grid */}
      <div className={`w-full grid gap-3 sm:gap-4 p-2 mx-auto justify-center ${gridClasses}`}>
        {cards.map((card) => {
          const isFlipped = flippedCardIds.includes(card.cardId);
          const isMatched = matchedPairIds.has(card.pairId);
          const isFaceUp = isFlipped || isMatched;

          return (
            <div
              key={card.cardId}
              onClick={() => handleCardClick(card)}
              style={{ perspective: '1000px' }}
              className={`relative h-28 sm:h-36 md:h-40 rounded-2xl cursor-pointer select-none transition-transform duration-200 ${
                isMatched
                  ? 'cursor-default opacity-90 scale-[0.98]'
                  : 'hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              <div
                className="w-full h-full relative rounded-2xl transition-transform duration-500"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isFaceUp ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* --- CARD BACK (Face Down) --- */}
                <div
                  className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 border-2 border-indigo-300 shadow-md flex flex-col items-center justify-center p-3 text-white overflow-hidden group"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  {/* Decorative background grid pattern */}
                  <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />

                  {/* Center Mystery Icon */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-black tracking-wider uppercase mt-1.5 opacity-80">
                    FLIP
                  </span>
                </div>

                {/* --- CARD FRONT (Face Up) --- */}
                <div
                  className={`absolute inset-0 w-full h-full rounded-2xl bg-white border-2 flex flex-col items-center justify-center p-2.5 sm:p-3 text-center shadow-lg overflow-hidden ${
                    isMatched
                      ? 'border-emerald-400 bg-emerald-50/60 ring-2 ring-emerald-300'
                      : isFlipped
                      ? 'border-purple-400 ring-2 ring-purple-300'
                      : 'border-slate-200'
                  }`}
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  {/* Matched Checkmark Badge */}
                  {isMatched && (
                    <div className="absolute top-1.5 right-1.5 text-emerald-500 anim-badge">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 fill-emerald-100" />
                    </div>
                  )}

                  {/* Left Card: English Word */}
                  {card.side === 'left' && (
                    <div className="flex flex-col items-center justify-center h-full">
                      <span className="text-[10px] font-black uppercase text-indigo-500 tracking-wider mb-1">
                        English Word
                      </span>
                      <h3 className="text-sm sm:text-base md:text-lg font-black text-slate-900 leading-tight">
                        {card.text}
                      </h3>
                    </div>
                  )}

                  {/* Right Card: Mode Dependent (Meaning / Definition / Picture) */}
                  {card.side === 'right' && (
                    <div className="flex flex-col items-center justify-center h-full w-full">
                      {card.mode === 'word_meaning' && (
                        <div className="flex flex-col items-center justify-center">
                          <span className="text-[10px] font-black uppercase text-rose-500 tracking-wider mb-1">
                            Meaning (TR)
                          </span>
                          <h3 className="text-xs sm:text-sm md:text-base font-black text-rose-700 leading-snug">
                            {card.text}
                          </h3>
                        </div>
                      )}

                      {card.mode === 'word_definition' && (
                        <div className="flex flex-col items-center justify-center px-1">
                          <span className="text-[9px] sm:text-[10px] font-black uppercase text-indigo-500 tracking-wider mb-0.5">
                            Definition
                          </span>
                          <p className="text-[11px] sm:text-xs md:text-sm font-semibold text-slate-700 leading-tight">
                            {card.text}
                          </p>
                        </div>
                      )}

                      {card.mode === 'word_picture' && (
                        <div className="flex flex-col items-center justify-center">
                          <MemoryMatchIcon imageRef={card.imageRef} size="md" />
                          <span className="text-[10px] sm:text-xs font-bold text-slate-600 mt-1 truncate max-w-[110px]">
                            {card.text}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Modal */}
      {isCompleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border-4 border-purple-300 shadow-2xl p-6 sm:p-8 max-w-md w-full text-center relative overflow-hidden">
            {/* Background Confetti Glow */}
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-purple-200 rounded-full blur-2xl opacity-60" />
            <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-amber-200 rounded-full blur-2xl opacity-60" />

            {/* Trophy & Stars */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 border-2 border-amber-200 flex items-center justify-center mx-auto shadow-lg mb-3 anim-badge">
              <Trophy className="w-9 h-9 sm:w-11 sm:h-11 text-amber-900" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 tracking-tight mb-1">
              PAIR MASTER!
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 mb-4">
              All {totalPairs} curriculum pairs matched with excellence!
            </p>

            {/* Star Rating */}
            <div className="flex justify-center gap-1.5 mb-5">
              {[1, 2, 3].map((starIndex) => (
                <Star
                  key={starIndex}
                  className={`w-7 h-7 sm:w-8 sm:h-8 ${
                    starIndex <= getStarRating()
                      ? 'text-amber-400 fill-amber-400 drop-shadow'
                      : 'text-slate-200 fill-slate-100'
                  }`}
                />
              ))}
            </div>

            {/* Performance Stats Breakdown */}
            <div className="grid grid-cols-3 gap-2 bg-purple-50/70 border border-purple-100 rounded-2xl p-3 mb-6">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Moves</span>
                <span className="text-base sm:text-lg font-black text-purple-700 font-mono">{moves}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Time</span>
                <span className="text-base sm:text-lg font-black text-slate-700 font-mono">
                  {Math.floor(secondsElapsed / 60)}:{(secondsElapsed % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Best Streak</span>
                <span className="text-base sm:text-lg font-black text-orange-600 font-mono">{maxStreak}x</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={initSet}
                className="flex-1 py-3 px-4 rounded-xl font-black text-sm text-purple-700 bg-purple-100 hover:bg-purple-200 border border-purple-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Next Puzzle</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
