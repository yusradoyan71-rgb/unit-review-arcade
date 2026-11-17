import React, { useState, useRef, useEffect } from 'react';
import type { Activity, TrainStationQuestion, TrainScheduleItem } from '../../types/schema';
import { TRAIN_SCHEDULES } from '../../data/grade8/unit3/game4Station';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '../../services/soundEffects';
import { useGameTracking } from '../../context/GameTrackingContext';
import { shuffleQuestionsOptions } from '../../utils/shuffle';
import { GameResultsModal } from './GameResultsModal';
import { ClassroomScoreboard } from './ClassroomScoreboard';
import {
  ArrowLeft,
  Eye,
  ChevronRight,
  Train,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Ticket,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';

interface TrainStationGameProps {
  activity: Activity;
  onExit: () => void;
}

export const TrainStationGame: React.FC<TrainStationGameProps> = ({ activity, onExit }) => {
  const { recordAnswer, completeGame, restartGame, resumeCheckpoint, saveCheckpoint, clearCheckpoint } = useGameTracking();

  const [questions] = useState<TrainStationQuestion[]>(() => {
    const rawQuestions = (activity.questions || []) as TrainStationQuestion[];
    if (resumeCheckpoint?.shuffledQuestionIds && resumeCheckpoint.shuffledQuestionIds.length > 0) {
      const qMap = new Map(rawQuestions.map((q) => [q.id, q]));
      const restored = resumeCheckpoint.shuffledQuestionIds
        .map((id) => qMap.get(id))
        .filter((q): q is TrainStationQuestion => Boolean(q));
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
  const [manualHighlightedTrain, setManualHighlightedTrain] = useState<string | null>(null);

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

  // Round info
  const questionsPerRound = 5;
  const currentRound = currentQ?.round || Math.floor(currentIndex / questionsPerRound) + 1;
  const currentRoundTitle = currentQ?.roundTitle || `Round ${currentRound}`;
  const questionNumberInRound = (currentIndex % questionsPerRound) + 1;

  // Active highlighted service (question preferred, or user click)
  const activeTrainId = currentQ?.highlightTrainId || manualHighlightedTrain;

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;

    setSelectedOption(idx);
    const isCorrect = idx === currentQ.correctOptionIndex;

    recordAnswer({
      questionId: currentQ.id,
      questionOrder: currentIndex + 1,
      questionPrompt: `${currentRoundTitle}: ${currentQ.prompt}`,
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
      questionPrompt: `${currentRoundTitle}: ${currentQ.prompt}`,
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
      setManualHighlightedTrain(null);
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
      <div className="max-w-2xl mx-auto my-12 p-8 text-center bg-white rounded-3xl border-2 border-amber-100 shadow-xl">
        <Train className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2 font-arcade">No Train Station Questions Available</h3>
        <p className="text-slate-600 text-sm mb-6">The activity schedule could not be loaded.</p>
        <button onClick={onExit} className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-sky-500/20">
          Return to Unit
        </button>
      </div>
    );
  }

  const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

  const getStatusBadge = (status: TrainScheduleItem['status'], detail?: string) => {
    switch (status) {
      case 'ON TIME':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            ON TIME
          </span>
        );
      case 'BOARDING':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse">
            BOARDING
          </span>
        );
      case 'DELAYED':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <span>DELAYED {detail ? `(${detail})` : ''}</span>
          </span>
        );
      case 'PLATFORM CHANGED':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
            PLATFORM CHANGED
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
            CANCELLED
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-2 px-3 sm:px-4 flex flex-col min-h-[calc(100vh-4.5rem)]">
      {/* Classroom Scoreboard Header */}
      <ClassroomScoreboard />

      {/* Navigation & Status Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-2 border-b border-sky-100">
        <button
          onClick={onExit}
          className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Unit</span>
        </button>

        {/* Round Pill & Question Progress */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold px-3 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5">
            <Train className="w-3.5 h-3.5 text-amber-600" />
            <span>{currentRoundTitle}</span>
          </span>
          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 border border-sky-200">
            Question {questionNumberInRound} of {questionsPerRound} ({currentIndex + 1}/25)
          </span>
          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
            Score: {score}
          </span>
        </div>
      </div>

      {/* Main Smartboard 16:9 Side-by-Side Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 items-stretch my-auto">
        {/* LEFT COLUMN: Interactive Digital Train Departure Board (6 cols) */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-3">
          <div className="rounded-3xl bg-slate-950 border-2 border-amber-500/40 shadow-2xl overflow-hidden flex flex-col h-full">
            {/* Station Board Top Bar */}
            <div className="bg-gradient-to-r from-amber-600/30 via-slate-900 to-amber-600/30 px-4 py-2.5 border-b border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-400 font-bold text-xs">
                  <Train className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-mono font-bold text-sm tracking-wider text-amber-300 uppercase flex items-center gap-2">
                    <span>LONDON PADDINGTON</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  </h3>
                  <p className="text-[10px] font-mono text-amber-400/70 tracking-widest uppercase">
                    National Rail • Mainline Departures
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-amber-500/30">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono font-bold text-xs text-amber-400">10:50:00</span>
              </div>
            </div>

            {/* Timetable Scroll/Table Area */}
            <div className="p-2 sm:p-3 overflow-x-auto flex-1">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                    <th className="py-1.5 px-2 text-amber-400">Time</th>
                    <th className="py-1.5 px-2 text-amber-400">Destination</th>
                    <th className="py-1.5 px-1 text-center text-amber-400">Plat</th>
                    <th className="py-1.5 px-2 text-amber-400 hidden sm:table-cell">Single / Return</th>
                    <th className="py-1.5 px-2 text-right text-amber-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {TRAIN_SCHEDULES.map((train) => {
                    const isRowHighlighted = activeTrainId === train.id;

                    return (
                      <tr
                        key={train.id}
                        onClick={() => setManualHighlightedTrain(train.id)}
                        className={`transition-colors cursor-pointer group ${
                          isRowHighlighted
                            ? 'bg-amber-500/20 text-white font-bold ring-2 ring-inset ring-amber-400'
                            : 'hover:bg-slate-900/80 text-slate-200'
                        }`}
                      >
                        {/* Time */}
                        <td className="py-2 px-2 whitespace-nowrap text-amber-300 font-bold">
                          {train.time}
                        </td>

                        {/* Destination & Operator */}
                        <td className="py-2 px-2">
                          <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                            <span>{train.destination}</span>
                            {isRowHighlighted && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-sans font-bold">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          {train.callingAt && (
                            <div className="text-[10px] text-slate-400 truncate max-w-[190px] sm:max-w-[220px]">
                              Via: {train.callingAt.slice(0, 2).join(', ')}
                            </div>
                          )}
                        </td>

                        {/* Platform */}
                        <td className="py-2 px-1 text-center">
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-bold ${
                              train.status === 'PLATFORM CHANGED'
                                ? 'bg-purple-500 text-white font-black'
                                : 'bg-slate-800 text-amber-300 border border-slate-700'
                            }`}
                          >
                            {train.platform}
                          </span>
                        </td>

                        {/* Fares (single / return) */}
                        <td className="py-2 px-2 hidden sm:table-cell text-slate-300 text-[11px]">
                          <span>{train.singleFare}</span>
                          <span className="text-slate-500 mx-1">/</span>
                          <span className="text-amber-400">{train.returnFare}</span>
                        </td>

                        {/* Status */}
                        <td className="py-2 px-2 text-right whitespace-nowrap">
                          {getStatusBadge(train.status, train.statusDetail)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Quick Fares & Railcard Info Footer */}
            <div className="p-2.5 bg-slate-900/90 border-t border-slate-800 text-[11px] text-slate-300 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Ticket className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-semibold text-amber-300">Ticket Guide:</span>
                <span className="text-slate-400">Single = One-way • Return = Both ways</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 font-mono">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>16-25 Railcard: 1/3 Off Fares</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Question, Dialogue, Options & Feedback (6 cols) */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="flex-1 flex flex-col justify-between space-y-3"
            >
              {/* Dialogue Box (when question features conversation) */}
              {currentQ.dialogue && currentQ.dialogue.length > 0 && (
                <div className="p-3.5 sm:p-4 rounded-2xl bg-white border-2 border-amber-100 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700">
                    <MessageSquare className="w-4 h-4 text-amber-500" />
                    <span>Station Conversation:</span>
                  </div>
                  <div className="space-y-2 text-xs sm:text-sm">
                    {currentQ.dialogue.map((line, dIdx) => (
                      <div
                        key={dIdx}
                        className={`p-2.5 rounded-xl border flex items-start gap-2.5 ${
                          line.speaker === 'Passenger'
                            ? 'bg-slate-50 border-slate-200 text-slate-800'
                            : line.speaker === 'Station Announcement'
                            ? 'bg-amber-50 border-amber-200 text-amber-900'
                            : 'bg-sky-50 border-sky-200 text-sky-900'
                        }`}
                      >
                        <span className="font-bold shrink-0 text-amber-800 font-mono">
                          {line.speaker}:
                        </span>
                        <span className="italic leading-relaxed">{line.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Question Prompt Card */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white border-2 border-indigo-100 shadow-xl">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4" />
                    <span>Station Challenge • {currentRoundTitle}</span>
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    Difficulty: <span className="capitalize font-bold text-indigo-600">{currentQ.difficulty || 'medium'}</span>
                  </span>
                </div>
                <h2 className="font-arcade text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {currentQ.prompt}
                </h2>
              </div>

              {/* 4 Answer Options */}
              <div className="space-y-2 sm:space-y-2.5">
                {currentQ.options.map((opt, idx) => {
                  const isCorrect = idx === currentQ.correctOptionIndex;
                  const isSelected = selectedOption === idx;

                  let btnStyle =
                    'bg-white border-2 border-slate-200 text-slate-800 hover:border-amber-400 hover:bg-amber-50/50 shadow-xs';

                  if (isAnswered) {
                    if (isCorrect) {
                      btnStyle =
                        'bg-emerald-50 border-2 border-emerald-500 text-emerald-950 ring-2 ring-emerald-400 shadow-md';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-50 border-2 border-rose-400 text-rose-950 ring-2 ring-rose-400';
                    } else {
                      btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-40';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-3 sm:p-3.5 rounded-2xl border-2 text-left text-xs sm:text-sm font-semibold transition-all flex items-center gap-3 active:scale-[0.99] ${btnStyle}`}
                    >
                      <div
                        className={`w-7 h-7 rounded-xl font-arcade font-bold text-xs flex items-center justify-center shrink-0 border ${
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
                      {isAnswered && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      )}
                      {isAnswered && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Manual Next Question Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-1">
                <div className="flex-1 w-full">
                  {!isAnswered && activity.settings.allowRevealAnswer && (
                    <button
                      onClick={handleRevealAnswer}
                      className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-600" />
                      <span>Reveal Answer</span>
                    </button>
                  )}

                  {isAnswered && currentQ.explanation && (
                    <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                      <span className="font-bold uppercase text-amber-700 block text-[11px] mb-0.5">
                        Station Explanation:
                      </span>
                      {currentQ.explanation}
                    </div>
                  )}
                </div>

                {isAnswered && (
                  <button
                    onClick={handleNextQuestion}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shrink-0"
                  >
                    <span>{currentIndex + 1 < questions.length ? 'Next Question' : 'View Results'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

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
