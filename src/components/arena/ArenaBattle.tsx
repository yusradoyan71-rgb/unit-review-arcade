import React, { useState, useEffect } from 'react';
import type { ArenaMatchRoom } from './types';
import { getGradeNumber } from './types';
import { Clock, CheckCircle2, AlertTriangle, Lock, Zap, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MonsterAvatar } from '../monster/MonsterAvatar';
import { MonsterService } from '../../services/monsterService';

interface ArenaBattleProps {
  room: ArenaMatchRoom;
  userId: string;
  onSelectOption: (questionIndex: number, optionIndex: number) => void;
  onFinishMatch: (p1Score: number, p2Score: number, p1TimeMs: number, p2TimeMs: number) => void;
  onForfeit: () => void;
}

export const ArenaBattle: React.FC<ArenaBattleProps> = ({
  room,
  userId,
  onSelectOption,
  onFinishMatch,
  onForfeit,
}) => {
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(15);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [p1Score, setP1Score] = useState<number>(0);
  const [p2Score, setP2Score] = useState<number>(0);
  const [p1TotalTimeMs, setP1TotalTimeMs] = useState<number>(0);
  const [p2TotalTimeMs, setP2TotalTimeMs] = useState<number>(0);
  const [opponentAnswered, setOpponentAnswered] = useState<boolean>(false);
  const [roundFeedback, setRoundFeedback] = useState<'correct' | 'incorrect' | 'timeout' | null>(null);
  const [showForfeitModal, setShowForfeitModal] = useState<boolean>(false);

  const currentQuestion = room.questions[currentQIndex] || {
    id: 'q_default',
    prompt: 'Loading question...',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
  };

  const isUserP1 = room.player1.studentNumber === userId;
  const user = isUserP1 ? room.player1 : room.player2;
  const opponent = isUserP1 ? room.player2 : room.player1;
  const myScore = isUserP1 ? p1Score : p2Score;
  const oppScore = isUserP1 ? p2Score : p1Score;

  const userMonster = MonsterService.resolveMonster(undefined, user.studentNumber);
  const oppMonster = MonsterService.resolveMonster(undefined, opponent.studentNumber);

  // Simulate opponent answering after random 3-7s
  useEffect(() => {
    setOpponentAnswered(false);
    const delay = Math.floor(Math.random() * 4500) + 2500;
    const oppTimer = setTimeout(() => {
      setOpponentAnswered(true);
    }, delay);
    return () => clearTimeout(oppTimer);
  }, [currentQIndex]);

  // Synchronized countdown timer (15s per question)
  useEffect(() => {
    setSecondsRemaining(15);
    setSelectedOption(null);
    setIsLocked(false);
    setRoundFeedback(null);

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentQIndex]);

  const handleTimeExpired = () => {
    if (!isLocked) {
      setIsLocked(true);
      resolveRound(null, 15000);
    }
  };

  const handleOptionClick = (idx: number) => {
    if (isLocked) return;
    setSelectedOption(idx);
    setIsLocked(true);
    const timeUsedMs = (15 - secondsRemaining) * 1000 + 400;
    onSelectOption(currentQIndex, idx);
    resolveRound(idx, timeUsedMs);
  };

  const resolveRound = (userChoice: number | null, timeUsedMs: number) => {
    const isCorrect = userChoice === 1 || userChoice === 2; // Balanced simulation accuracy
    const oppIsCorrect = Math.random() > 0.35; // 65% opponent accuracy

    if (isUserP1) {
      if (isCorrect) setP1Score((s) => s + 1);
      if (oppIsCorrect) setP2Score((s) => s + 1);
      setP1TotalTimeMs((t) => t + timeUsedMs);
      setP2TotalTimeMs((t) => t + (Math.floor(Math.random() * 5000) + 4000));
    } else {
      if (isCorrect) setP2Score((s) => s + 1);
      if (oppIsCorrect) setP1Score((s) => s + 1);
      setP2TotalTimeMs((t) => t + timeUsedMs);
      setP1TotalTimeMs((t) => t + (Math.floor(Math.random() * 5000) + 4000));
    }

    setRoundFeedback(userChoice === null ? 'timeout' : isCorrect ? 'correct' : 'incorrect');

    // Reveal feedback for 1.8s then proceed
    setTimeout(() => {
      if (currentQIndex + 1 < room.totalQuestions) {
        setCurrentQIndex((q) => q + 1);
      } else {
        const finalP1 = isUserP1 ? (isCorrect ? p1Score + 1 : p1Score) : (oppIsCorrect ? p1Score + 1 : p1Score);
        const finalP2 = isUserP1 ? (oppIsCorrect ? p2Score + 1 : p2Score) : (isCorrect ? p2Score + 1 : p2Score);
        onFinishMatch(finalP1, finalP2, p1TotalTimeMs + timeUsedMs, p2TotalTimeMs + 5000);
      }
    }, 1800);
  };

  // Timer color states
  const getTimerStyles = () => {
    if (secondsRemaining > 7) {
      return {
        text: 'text-sky-700',
        bar: 'bg-gradient-to-r from-sky-400 to-blue-500',
      };
    }
    if (secondsRemaining > 3) {
      return {
        text: 'text-amber-700',
        bar: 'bg-gradient-to-r from-amber-400 to-orange-400',
      };
    }
    return {
      text: 'text-rose-600 animate-pulse font-black',
      bar: 'bg-gradient-to-r from-rose-500 to-red-600',
    };
  };

  const timerStyle = getTimerStyles();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      {/* 1. Head-to-Head Versus Arena Header with Real Monsters */}
      <div className="card-island p-3.5 sm:p-6 bg-gradient-to-r from-sky-50 via-white to-purple-50 border-2 border-sky-200 shadow-md overflow-hidden">
        <div className="flex items-center justify-between gap-1.5 sm:gap-4 w-full">
          
          {/* Player 1 (You & Monster) */}
          <div className="flex items-center gap-2 sm:gap-3.5 flex-1 min-w-0">
            <div className="relative w-12 h-12 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-sky-200 to-cyan-100 border-2 sm:border-3 border-sky-400 p-1 sm:p-1.5 shadow-md shrink-0">
              <MonsterAvatar config={userMonster} size={38} className="sm:hidden" animate />
              <div className="hidden sm:block">
                <MonsterAvatar config={userMonster} size={58} animate />
              </div>
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded sm:rounded-lg text-[9px] sm:text-[10px] font-black bg-sky-500 text-white font-display shadow-xs">
                You
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-xs sm:text-lg font-black text-slate-900 font-display truncate">
                {user.displayName}
              </div>
              <div className="text-[10px] sm:text-xs text-sky-700 font-bold truncate">Level {user.level} • {user.levelTitle}</div>
              <div className="mt-0.5 hidden sm:block">
                {isLocked ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-lg border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Answer Locked</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
                    <Clock className="w-3.5 h-3.5 text-sky-500" />
                    <span>Thinking...</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Center VS Scoreboard */}
          <div className="text-center px-1 sm:px-6 shrink-0">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 font-display mb-0.5 sm:mb-1">
              <Zap className="w-3 h-3 text-amber-500" />
              <span>{room.stakeXp} XP</span>
            </span>
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <span className="text-3xl sm:text-5xl font-black text-sky-600 font-display">{myScore}</span>
              <span className="text-xl sm:text-2xl font-black text-slate-300">:</span>
              <span className="text-3xl sm:text-5xl font-black text-purple-600 font-display">{oppScore}</span>
            </div>
            <div className="text-[9px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5 font-display">
              Round {currentQIndex + 1} of {room.totalQuestions}
            </div>
          </div>

          {/* Player 2 (Opponent & Monster) */}
          <div className="flex items-center justify-end gap-2 sm:gap-3.5 flex-1 min-w-0 text-right">
            <div className="min-w-0 flex-1">
              <div className="text-xs sm:text-lg font-black text-slate-900 font-display truncate">
                {opponent.displayName}
              </div>
              <div className="text-[10px] sm:text-xs text-purple-700 font-bold truncate">Level {opponent.level} • {opponent.levelTitle}</div>
              <div className="mt-0.5 hidden sm:flex justify-end">
                {opponentAnswered ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-lg border border-purple-300" title="Choice hidden until timer ends">
                    <Lock className="w-3.5 h-3.5 text-purple-600" />
                    <span>Locked In!</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
                    <Clock className="w-3.5 h-3.5 text-purple-500 animate-spin" />
                    <span>Thinking...</span>
                  </span>
                )}
              </div>
            </div>

            <div className="relative w-12 h-12 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-purple-200 to-pink-100 border-2 sm:border-3 border-purple-400 p-1 sm:p-1.5 shadow-md shrink-0">
              <MonsterAvatar config={oppMonster} size={38} className="sm:hidden" animate />
              <div className="hidden sm:block">
                <MonsterAvatar config={oppMonster} size={58} animate />
              </div>
              <span className="absolute -bottom-1 -left-1 px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded sm:rounded-lg text-[9px] sm:text-[10px] font-black bg-purple-600 text-white font-display shadow-xs">
                Rival
              </span>
            </div>
          </div>

        </div>

        {/* 10-Question Progress Bubbles */}
        <div className="mt-6 pt-4 border-t border-sky-100 flex items-center justify-between gap-1.5 sm:gap-2">
          {Array.from({ length: room.totalQuestions }).map((_, i) => {
            const isDone = i < currentQIndex;
            const isCurrent = i === currentQIndex;
            return (
              <div
                key={i}
                className={`flex-1 rounded-full transition-all duration-300 ${
                  isDone
                    ? 'h-2.5 bg-sky-500 shadow-xs'
                    : isCurrent
                    ? 'h-3 bg-amber-400 ring-4 ring-amber-300/40 shadow-sm'
                    : 'h-2.5 bg-slate-200'
                }`}
                title={`Question ${i + 1}`}
              />
            );
          })}
        </div>
      </div>

      {/* 2. Playful Synchronized 15s Timer Bar */}
      <div className="card-island p-4 flex items-center justify-between gap-4 border-2 border-amber-200 bg-amber-50/40 shadow-xs">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider font-display">
          <Clock className="w-5 h-5 text-amber-500 animate-spin" />
          <span>Time Remaining:</span>
        </div>
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="w-full h-4 bg-white rounded-full overflow-hidden p-0.5 border-2 border-amber-200 shadow-inner">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-linear shadow-xs ${timerStyle.bar}`}
              style={{ width: `${(secondsRemaining / 15) * 100}%` }}
            />
          </div>
          <span className={`text-lg font-mono font-black ${timerStyle.text} min-w-[36px] text-right`}>
            {secondsRemaining}s
          </span>
        </div>
      </div>

      {/* 3. Question Card & Tactile Chunky Options */}
      <div className="card-island p-6 sm:p-8 space-y-6 shadow-md">
        <div className="flex items-center justify-between">
          <span className="px-3.5 py-1 rounded-xl text-xs font-black bg-sky-100 text-sky-800 border border-sky-300 font-display">
            Question {currentQIndex + 1} of {room.totalQuestions} • Grade {getGradeNumber(room.player1.grade)} English
          </span>
          <button
            type="button"
            onClick={() => setShowForfeitModal(true)}
            className="text-xs text-slate-400 hover:text-rose-600 transition font-medium"
          >
            Forfeit Match
          </button>
        </div>

        <div className="py-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug font-display">
            {currentQuestion.prompt}
          </h2>
        </div>

        {/* 4 Tactile Option Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
          {currentQuestion.options.map((optionText, idx) => {
            const isSelected = selectedOption === idx;
            const letter = String.fromCharCode(65 + idx);

            return (
              <button
                key={idx}
                type="button"
                disabled={isLocked}
                onClick={() => handleOptionClick(idx)}
                className={`p-4 rounded-2xl border-2 text-left transition-all duration-150 flex items-center gap-3.5 ${
                  isSelected
                    ? 'border-3 border-sky-500 bg-sky-50 ring-4 ring-sky-300/40 shadow-md text-sky-950'
                    : isLocked
                    ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed opacity-60'
                    : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 shadow-xs'
                }`}
              >
                <span
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-base font-display shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {letter}
                </span>
                <span className="font-bold text-base leading-snug">
                  {optionText}
                </span>
                {isSelected && (
                  <div className="ml-auto flex items-center gap-1 text-xs font-black text-sky-700 font-display">
                    <Check className="w-5 h-5 text-sky-600" />
                    <span>Locked</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Round Feedback Banner */}
        <AnimatePresence>
          {roundFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`p-4 rounded-2xl border-2 text-center font-bold text-sm flex items-center justify-center gap-2 ${
                roundFeedback === 'correct'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : roundFeedback === 'incorrect'
                  ? 'bg-rose-50 border-rose-300 text-rose-900'
                  : 'bg-amber-50 border-amber-300 text-amber-900'
              }`}
            >
              {roundFeedback === 'correct' ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Great choice! Quick response locked in for tiebreaker comparison.</span>
                </>
              ) : roundFeedback === 'incorrect' ? (
                <>
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  <span>Incorrect! Keep your focus for the upcoming round.</span>
                </>
              ) : (
                <>
                  <Clock className="w-5 h-5 text-amber-600" />
                  <span>Time expired! 0 points recorded for this question.</span>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Forfeit Confirmation Modal */}
      <AnimatePresence>
        {showForfeitModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="card-island p-6 max-w-sm w-full space-y-4 text-center border-2 border-rose-300 shadow-2xl">
              <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
              <h3 className="text-xl font-black text-slate-900 font-display">Forfeit Battle?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Leaving the match counts as an immediate defeat. You will lose the{' '}
                <strong className="text-rose-600">{room.stakeXp} XP</strong> stake and it counts toward your daily match limit.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForfeitModal(false)}
                  className="py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200"
                >
                  Stay in Match
                </button>
                <button
                  type="button"
                  onClick={onForfeit}
                  className="py-2.5 rounded-xl btn-game-coral font-black text-xs font-display"
                >
                  Yes, Forfeit
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
