import React, { useState, useEffect, useMemo } from 'react';
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
  const { recordAnswer, completeGame } = useGameTracking();
  const matchQuestion = (activity.questions[0] || {}) as MatchItQuestion;
  const rounds: MatchRound[] = matchQuestion.rounds || [];

  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [selectedLeft, setSelectedLeft] = useState<ShuffledCard | null>(null);
  const [selectedRight, setSelectedRight] = useState<ShuffledCard | null>(null);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [mismatchedIds, setMismatchedIds] = useState<string[]>([]);
  const [totalMatchesMade, setTotalMatchesMade] = useState(0);
  const [mismatchCount, setMismatchCount] = useState(0);
  const [interactionCount, setInteractionCount] = useState(0);
  const [isRoundComplete, setIsRoundComplete] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

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
    setMatchedPairIds([]);
    setSelectedLeft(null);
    setSelectedRight(null);
    setIsRoundComplete(false);
  }, [currentRoundIndex, currentRound]);

  // Check match whenever both sides are selected
  useEffect(() => {
    if (selectedLeft && selectedRight) {
      const isMatch = selectedLeft.id === selectedRight.id;
      const order = interactionCount + 1;
      setInteractionCount(order);

      recordAnswer({
        questionId: selectedLeft.id,
        questionOrder: order,
        questionPrompt: `Round ${currentRoundIndex + 1}: ${currentRound?.title || 'Matching'}`,
        studentResponse: `${selectedLeft.text} ➔ ${selectedRight.text}`,
        correctAnswer: `${selectedLeft.text} ➔ (paired)`,
        isCorrect: isMatch,
      });

      if (isMatch) {
        // MATCH!
        sounds.playSuccess();
        const pairId = selectedLeft.id;
        setMatchedPairIds((prev) => {
          const next = [...prev, pairId];
          if (currentRound && next.length === currentRound.pairs.length) {
            setIsRoundComplete(true);
          }
          return next;
        });
        setTotalMatchesMade((t) => t + 1);
        setSelectedLeft(null);
        setSelectedRight(null);
      } else {
        // MISMATCH!
        sounds.playBack();
        setMismatchCount((m) => m + 1);
        const cardIds = [selectedLeft.cardId, selectedRight.cardId];
        setMismatchedIds(cardIds);
        const timer = setTimeout(() => {
          setMismatchedIds([]);
          setSelectedLeft(null);
          setSelectedRight(null);
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [selectedLeft, selectedRight, currentRound, currentRoundIndex, interactionCount, recordAnswer]);

  const handleCardClick = (card: ShuffledCard) => {
    if (matchedPairIds.includes(card.id) || mismatchedIds.length > 0) return;

    sounds.playTap();
    if (card.side === 'left') {
      setSelectedLeft((prev) => (prev?.cardId === card.cardId ? null : card));
    } else {
      setSelectedRight((prev) => (prev?.cardId === card.cardId ? null : card));
    }
  };

  const handleNextRound = () => {
    sounds.playTap();
    if (currentRoundIndex + 1 < totalRounds) {
      setCurrentRoundIndex((prev) => prev + 1);
    } else {
      setIsGameOver(true);
      completeGame({
        score: totalMatchesMade,
        totalQuestions: totalPairsAcrossGame,
        answeredQuestions: totalPairsAcrossGame,
        correctAnswers: totalMatchesMade,
        incorrectAnswers: mismatchCount,
        skippedQuestions: 0,
        percentage: (totalMatchesMade + mismatchCount) > 0 ? Math.round((totalMatchesMade / (totalMatchesMade + mismatchCount)) * 100) : 100,
      });
    }
  };

  const handleRestart = () => {
    sounds.playTap();
    setCurrentRoundIndex(0);
    setTotalMatchesMade(0);
    setMismatchCount(0);
    setInteractionCount(0);
    setIsGameOver(false);
  };

  if (!currentRound || totalRounds === 0) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 text-center bg-slate-900 rounded-3xl border border-slate-800">
        <Layers className="w-12 h-12 text-slate-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">No Matching Rounds Configured</h3>
        <p className="text-slate-400 text-sm mb-6">This matching activity does not have any pairs.</p>
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

      {/* Header bar */}
      <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
        <button
          onClick={onExit}
          className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Unit</span>
        </button>

        {/* Round Counter */}
        <div className="flex items-center gap-2">
          <span className="font-arcade text-sm font-bold text-slate-400 uppercase tracking-wider">
            Match It!
          </span>
          <span className="font-mono text-base font-extrabold px-3 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Round {currentRoundIndex + 1} of {totalRounds}
          </span>
        </div>

        {/* Matches Completed Counter */}
        <div className="text-xs font-mono font-bold text-slate-400">
          Matched: <span className="text-emerald-400">{matchedPairIds.length}</span> / {currentRound.pairs.length}
        </div>
      </div>

      {/* Round Title Banner */}
      <div className="mb-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{currentRound.title}</span>
          </span>
          <p className="text-slate-400 text-xs mt-0.5">
            Tap a card on the left, then tap its matching pair on the right.
          </p>
        </div>

        {isRoundComplete && (
          <motion.button
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={handleNextRound}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all"
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
          <span className="text-xs font-bold uppercase text-slate-400 tracking-wider block px-1">
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
                className={`w-full p-4 rounded-2xl border-2 text-left font-semibold text-base sm:text-lg transition-all flex items-center justify-between ${
                  isMatched
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 opacity-60'
                    : isMismatched
                    ? 'bg-rose-500/25 border-rose-500 text-rose-200'
                    : isSelected
                    ? 'bg-purple-600/30 border-purple-400 text-purple-200 shadow-lg shadow-purple-500/20 ring-2 ring-purple-400'
                    : 'bg-slate-900/90 border-slate-800 text-slate-100 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <span>{card.text}</span>
                {isMatched && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
              </motion.button>
            );
          })}
        </div>

        {/* Column 2: Right Cards */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase text-slate-400 tracking-wider block px-1">
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
                className={`w-full p-4 rounded-2xl border-2 text-left font-normal text-sm sm:text-base leading-snug transition-all flex items-center justify-between ${
                  isMatched
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 opacity-60'
                    : isMismatched
                    ? 'bg-rose-500/25 border-rose-500 text-rose-200'
                    : isSelected
                    ? 'bg-purple-600/30 border-purple-400 text-purple-200 shadow-lg shadow-purple-500/20 ring-2 ring-purple-400'
                    : 'bg-slate-900/90 border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <span>{card.text}</span>
                {isMatched && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
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
          activityTitle={activity.title}
          onRestart={handleRestart}
          onExit={onExit}
        />
      )}
    </div>
  );
};
