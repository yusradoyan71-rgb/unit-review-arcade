import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { Activity, MatchItQuestion, MatchRound } from '../../types/schema';
import { motion } from 'framer-motion';
import { sounds } from '../../services/soundEffects';
import { useGameTracking } from '../../context/GameTrackingContext';
import { GameResultsModal } from './GameResultsModal';
import { ClassroomScoreboard } from './ClassroomScoreboard';
import { ArrowLeft, CheckCircle2, ChevronRight, Layers, Sparkles } from 'lucide-react';

interface MatchItGameProps {
  activity: Activity;
  onExit: () => void;
}

interface ShuffledCard {
  id: string; // pair id
  cardId: string; // unique card id
  text: string;
  side: 'left' | 'right';
}

export const MatchItGame: React.FC<MatchItGameProps> = ({ activity, onExit }) => {
  const { recordAnswer, completeGame, restartGame, resumeCheckpoint, saveCheckpoint, clearCheckpoint } = useGameTracking();
  const matchQuestion = (activity.questions[0] || {}) as MatchItQuestion;
  const rounds: MatchRound[] = matchQuestion.rounds || [];

  const initialRoundIndex = (resumeCheckpoint && resumeCheckpoint.currentRoundIndex !== undefined && resumeCheckpoint.currentRoundIndex < rounds.length)
    ? resumeCheckpoint.currentRoundIndex
    : 0;
  const initialMatches = resumeCheckpoint?.score || 0;
  const initialMatchedPairIds = resumeCheckpoint?.matchedPairIds || [];
  const initialMismatches = resumeCheckpoint?.mismatchCount || 0;

  const [currentRoundIndex, setCurrentRoundIndex] = useState(initialRoundIndex);
  const [selectedLeft, setSelectedLeft] = useState<ShuffledCard | null>(null);
  const [selectedRight, setSelectedRight] = useState<ShuffledCard | null>(null);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>(initialMatchedPairIds);
  const [mismatchedIds, setMismatchedIds] = useState<string[]>([]);
  const [totalMatchesMade, setTotalMatchesMade] = useState(initialMatches);
  const [mismatchCount, setMismatchCount] = useState(initialMismatches);
  const [isRoundComplete, setIsRoundComplete] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  // Synchronous refs to prevent race conditions, stale closures, and rapid click issues
  const isInitialRoundMountRef = useRef(true);
  const interactionCountRef = useRef(0);
  const matchedPairIdsRef = useRef<string[]>(initialMatchedPairIds);
  const totalMatchesMadeRef = useRef<number>(initialMatches);
  const mismatchCountRef = useRef<number>(initialMismatches);
  const mismatchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isResolvingMismatchRef = useRef<boolean>(false);

  // Cleanup pending timer on unmount
  useEffect(() => {
    return () => {
      if (mismatchTimerRef.current) {
        clearTimeout(mismatchTimerRef.current);
      }
    };
  }, []);

  // Sync state if resumeCheckpoint arrives or updates after initial mount
  const hasInitializedFromCheckpointRef = useRef(Boolean(resumeCheckpoint));
  useEffect(() => {
    if (!hasInitializedFromCheckpointRef.current && resumeCheckpoint) {
      hasInitializedFromCheckpointRef.current = true;
      if (resumeCheckpoint.currentRoundIndex !== undefined && resumeCheckpoint.currentRoundIndex < rounds.length) {
        setCurrentRoundIndex(resumeCheckpoint.currentRoundIndex);
      }
      if (resumeCheckpoint.score !== undefined) {
        setTotalMatchesMade(resumeCheckpoint.score);
        totalMatchesMadeRef.current = resumeCheckpoint.score;
      }
      if (resumeCheckpoint.matchedPairIds && resumeCheckpoint.matchedPairIds.length > 0) {
        setMatchedPairIds(resumeCheckpoint.matchedPairIds);
        matchedPairIdsRef.current = resumeCheckpoint.matchedPairIds;
      }
      if (resumeCheckpoint.mismatchCount !== undefined) {
        setMismatchCount(resumeCheckpoint.mismatchCount);
        mismatchCountRef.current = resumeCheckpoint.mismatchCount;
      }
    }
  }, [resumeCheckpoint, rounds.length]);

  const currentRound = rounds[currentRoundIndex];
  const totalRounds = rounds.length;
  const totalPairsAcrossGame = useMemo(
    () => rounds.reduce((acc, r) => acc + (r.pairs?.length || 0), 0),
    [rounds]
  );

  // Shuffled left and right columns for the active round
  const [leftCards, setLeftCards] = useState<ShuffledCard[]>([]);
  const [rightCards, setRightCards] = useState<ShuffledCard[]>([]);

  // Initialize or change round
  useEffect(() => {
    if (!currentRound || !currentRound.pairs) return;

    if (mismatchTimerRef.current) {
      clearTimeout(mismatchTimerRef.current);
      mismatchTimerRef.current = null;
    }
    isResolvingMismatchRef.current = false;
    setMismatchedIds([]);

    const pairs = currentRound.pairs;
    const left: ShuffledCard[] = pairs.map((p) => ({
      id: p.id,
      cardId: `left-${p.id}`,
      text: p.left,
      side: 'left',
    }));

    const right: ShuffledCard[] = pairs.map((p) => ({
      id: p.id,
      cardId: `right-${p.id}`,
      text: p.right,
      side: 'right',
    }));

    // Randomize order
    setLeftCards([...left].sort(() => Math.random() - 0.5));
    setRightCards([...right].sort(() => Math.random() - 0.5));
    if (isInitialRoundMountRef.current) {
      isInitialRoundMountRef.current = false;
    } else {
      setMatchedPairIds([]);
      matchedPairIdsRef.current = [];
    }
    setSelectedLeft(null);
    setSelectedRight(null);
    setIsRoundComplete(false);
  }, [currentRoundIndex, currentRound]);

  const evaluateSelection = (leftCard: ShuffledCard, rightCard: ShuffledCard) => {
    const isMatch = leftCard.id === rightCard.id;
    const nextOrder = interactionCountRef.current + 1;
    interactionCountRef.current = nextOrder;

    recordAnswer({
      questionId: leftCard.id,
      questionOrder: nextOrder,
      questionPrompt: `Round ${currentRoundIndex + 1}: ${currentRound?.title || 'Matching'}`,
      studentResponse: `${leftCard.text} ➔ ${rightCard.text}`,
      correctAnswer: `${leftCard.text} ➔ (paired)`,
      isCorrect: isMatch,
    });

    if (isMatch) {
      // MATCH!
      sounds.playSuccess();
      const pairId = leftCard.id;
      const nextMatched = [...matchedPairIdsRef.current, pairId];
      const nextMatchesTotal = totalMatchesMadeRef.current + 1;
      matchedPairIdsRef.current = nextMatched;
      totalMatchesMadeRef.current = nextMatchesTotal;
      setMatchedPairIds(nextMatched);
      setTotalMatchesMade(nextMatchesTotal);
      setSelectedLeft(null);
      setSelectedRight(null);

      const isRoundFinished = Boolean(currentRound && nextMatched.length === currentRound.pairs.length);
      if (isRoundFinished) {
        setIsRoundComplete(true);
        const nextRound = currentRoundIndex + 1;
        const isFinalRound = nextRound >= totalRounds;
        saveCheckpoint({
          currentRoundIndex: isFinalRound ? currentRoundIndex : nextRound,
          currentIndex: isFinalRound ? currentRoundIndex : nextRound,
          score: nextMatchesTotal,
          matchedPairIds: [],
          mismatchCount: mismatchCountRef.current,
        });
      } else {
        saveCheckpoint({
          currentRoundIndex,
          currentIndex: currentRoundIndex,
          score: nextMatchesTotal,
          matchedPairIds: nextMatched,
          mismatchCount: mismatchCountRef.current,
        });
      }
    } else {
      // MISMATCH!
      // Play mismatch sound once
      sounds.playBack();
      mismatchCountRef.current += 1;
      setMismatchCount(mismatchCountRef.current);
      const cardIds = [leftCard.cardId, rightCard.cardId];
      setMismatchedIds(cardIds);
      isResolvingMismatchRef.current = true;

      if (mismatchTimerRef.current) {
        clearTimeout(mismatchTimerRef.current);
      }

      mismatchTimerRef.current = setTimeout(() => {
        setMismatchedIds([]);
        setSelectedLeft(null);
        setSelectedRight(null);
        isResolvingMismatchRef.current = false;
        mismatchTimerRef.current = null;
      }, 800);
    }
  };

  const handleCardClick = (card: ShuffledCard) => {
    if (
      isResolvingMismatchRef.current ||
      mismatchedIds.length > 0 ||
      matchedPairIdsRef.current.includes(card.id) ||
      isRoundComplete ||
      isGameOver
    ) {
      return;
    }

    sounds.playTap();

    if (card.side === 'left') {
      if (selectedLeft?.cardId === card.cardId) {
        setSelectedLeft(null);
        return;
      }

      setSelectedLeft(card);

      if (selectedRight) {
        evaluateSelection(card, selectedRight);
      }
    } else {
      if (selectedRight?.cardId === card.cardId) {
        setSelectedRight(null);
        return;
      }

      setSelectedRight(card);

      if (selectedLeft) {
        evaluateSelection(selectedLeft, card);
      }
    }
  };

  const handleNextRound = () => {
    sounds.playTap();
    if (mismatchTimerRef.current) {
      clearTimeout(mismatchTimerRef.current);
      mismatchTimerRef.current = null;
    }
    isResolvingMismatchRef.current = false;
    setMismatchedIds([]);

    if (currentRoundIndex + 1 < totalRounds) {
      const nextRound = currentRoundIndex + 1;
      setCurrentRoundIndex(nextRound);
      setMatchedPairIds([]);
      matchedPairIdsRef.current = [];
      saveCheckpoint({
        currentRoundIndex: nextRound,
        currentIndex: nextRound,
        score: totalMatchesMadeRef.current,
        matchedPairIds: [],
        mismatchCount: mismatchCountRef.current,
      });
    } else {
      setIsGameOver(true);
      const totalCorrect = totalMatchesMadeRef.current;
      const totalIncorrect = mismatchCountRef.current;
      const totalEvaluated = totalCorrect + totalIncorrect;
      const accuracyPct = totalEvaluated > 0
        ? Math.round((totalCorrect / totalEvaluated) * 1000) / 10
        : 100;

      completeGame({
        score: totalCorrect,
        totalQuestions: totalPairsAcrossGame,
        answeredQuestions: totalEvaluated,
        correctAnswers: totalCorrect,
        incorrectAnswers: totalIncorrect,
        skippedQuestions: 0,
        percentage: accuracyPct,
      });
    }
  };

  const handleRestart = () => {
    sounds.playTap();
    if (mismatchTimerRef.current) {
      clearTimeout(mismatchTimerRef.current);
      mismatchTimerRef.current = null;
    }
    isResolvingMismatchRef.current = false;
    setMismatchedIds([]);
    matchedPairIdsRef.current = [];
    mismatchCountRef.current = 0;
    setMismatchCount(0);
    totalMatchesMadeRef.current = 0;
    interactionCountRef.current = 0;
    clearCheckpoint();
    restartGame();
  };

  if (!currentRound || totalRounds === 0) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 text-center bg-white rounded-3xl border-2 border-purple-100 shadow-xl">
        <Layers className="w-12 h-12 text-purple-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2 font-arcade">No Matching Rounds Configured</h3>
        <p className="text-slate-600 text-sm mb-6">This matching activity does not have any pairs.</p>
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

      {/* Header bar */}
      <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-sky-100">
        <button
          onClick={onExit}
          className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Unit</span>
        </button>

        {/* Round Counter */}
        <div className="flex items-center gap-2">
          <span className="font-arcade text-sm font-bold text-slate-500 uppercase tracking-wider">
            Match It!
          </span>
          <span className="font-mono text-base font-extrabold px-3 py-0.5 rounded-lg bg-purple-50 text-purple-800 border border-purple-200">
            Round {currentRoundIndex + 1} of {totalRounds}
          </span>
        </div>

        {/* Matches Completed Counter */}
        <div className="text-xs font-mono font-bold text-slate-600">
          Matched: <span className="text-emerald-600 font-extrabold">{matchedPairIds.length}</span> / {currentRound.pairs.length}
        </div>
      </div>

      {/* Round Title Banner */}
      <div className="mb-4 p-4 rounded-3xl bg-white border-2 border-purple-100 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{currentRound.title}</span>
          </span>
          <p className="text-slate-600 text-xs mt-0.5">
            Tap a card on the left, then tap its matching pair on the right.
          </p>
        </div>

        {isRoundComplete && (
          <motion.button
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={handleNextRound}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-purple-500/30 hover:scale-105 active:scale-95 transition-all"
          >
            <span>{currentRoundIndex + 1 < totalRounds ? 'Next Round' : 'View Results'}</span>
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        )}
      </div>

      {/* Matching Columns Grid (Left: Terms/Genres, Right: Meanings/Descriptions) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-auto py-2">
        {/* Column 1: Left Cards */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block px-1">
            Column A (Terms & Styles)
          </span>
          {leftCards.map((card) => {
            const isMatched = matchedPairIds.includes(card.id);
            const isSelected = selectedLeft?.cardId === card.cardId;
            const isMismatched = mismatchedIds.includes(card.cardId);

            return (
              <motion.button
                key={card.cardId}
                layout
                disabled={isMatched}
                onClick={() => handleCardClick(card)}
                className={`w-full p-4 rounded-2xl border-2 text-left font-semibold text-base sm:text-lg transition-all flex items-center justify-between shadow-xs ${
                  isMatched
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 opacity-60'
                    : isMismatched
                    ? 'bg-rose-50 border-rose-400 text-rose-950'
                    : isSelected
                    ? 'bg-purple-50 border-purple-500 text-purple-950 shadow-md ring-2 ring-purple-400'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-purple-300 hover:bg-purple-50/50'
                }`}
              >
                <span>{card.text}</span>
                {isMatched && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
              </motion.button>
            );
          })}
        </div>

        {/* Column 2: Right Cards */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block px-1">
            Column B (Descriptions & Meanings)
          </span>
          {rightCards.map((card) => {
            const isMatched = matchedPairIds.includes(card.id);
            const isSelected = selectedRight?.cardId === card.cardId;
            const isMismatched = mismatchedIds.includes(card.cardId);

            return (
              <motion.button
                key={card.cardId}
                layout
                disabled={isMatched}
                onClick={() => handleCardClick(card)}
                className={`w-full p-4 rounded-2xl border-2 text-left font-normal text-sm sm:text-base leading-snug transition-all flex items-center justify-between shadow-xs ${
                  isMatched
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 opacity-60'
                    : isMismatched
                    ? 'bg-rose-50 border-rose-400 text-rose-950'
                    : isSelected
                    ? 'bg-purple-50 border-purple-500 text-purple-950 shadow-md ring-2 ring-purple-400'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-purple-300 hover:bg-purple-50/50'
                }`}
              >
                <span>{card.text}</span>
                {isMatched && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Game Results Modal */}
      {isGameOver && (
        <GameResultsModal
          score={totalMatchesMade}
          totalQuestions={totalPairsAcrossGame}
          accuracyPercentage={
            (totalMatchesMade + mismatchCount) > 0
              ? Math.round((totalMatchesMade / (totalMatchesMade + mismatchCount)) * 1000) / 10
              : 100
          }
          scoreLabel="Matched Pairs"
          activityTitle={activity.title}
          onRestart={handleRestart}
          onExit={onExit}
        />
      )}
    </div>
  );
};
