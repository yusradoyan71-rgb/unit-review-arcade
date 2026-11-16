import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, Flame, Pause, ArrowLeft, ArrowRight, CheckCircle2, XCircle, Clock, Play } from 'lucide-react';
import type { GradeId } from '../../../types/schema';
import type {
  GamesZoneDifficulty,
  GamesZoneAttemptRecord,
  GrammarRunnerItem,
} from '../../../types/gamesZone';
import { getQuestionsForGame } from '../../../data/gamesZone';
import { GamesZoneService } from '../../../services/gamesZoneService';
import { sounds } from '../../../services/soundEffects';

interface GrammarRunnerGameProps {
  gradeId: GradeId;
  difficulty: GamesZoneDifficulty;
  studentNumber: string;
  studentClass?: string;
  onComplete: (record: GamesZoneAttemptRecord) => void;
  onPause: () => void;
  isPaused: boolean;
  isMuted: boolean;
}

export const GrammarRunnerGame: React.FC<GrammarRunnerGameProps> = ({
  gradeId,
  difficulty,
  studentNumber,
  studentClass,
  onComplete,
  onPause,
  isPaused,
  isMuted,
}) => {
  const [questions, setQuestions] = useState<GrammarRunnerItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentLane, setCurrentLane] = useState<0 | 1 | 2>(1); // 0=Left, 1=Center, 2=Right
  const [gateProgress, setGateProgress] = useState(0); // 0 (horizon) to 100 (collision point)
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(1);
  const [lives, setLives] = useState(3);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  // Reading phase state
  const defaultReadingSeconds = difficulty === 'hard' ? 14 : difficulty === 'medium' ? 12 : 10;
  const [isReadingPhase, setIsReadingPhase] = useState(true);
  const [readingSecondsLeft, setReadingSecondsLeft] = useState(defaultReadingSeconds);

  const [collisionFeedback, setCollisionFeedback] = useState<{
    isSuccess: boolean;
    text: string;
    explanation?: string;
  } | null>(null);

  const startTimeRef = useRef(Date.now());
  // Relaxed, highly readable approach speeds
  const approachSpeed = difficulty === 'hard' ? 0.34 : difficulty === 'medium' ? 0.26 : 0.18;
  const animFrameRef = useRef<number | null>(null);

  // Load questions
  useEffect(() => {
    const pool = getQuestionsForGame('grammar_runner', gradeId, difficulty, 10) as GrammarRunnerItem[];
    setQuestions(pool);
    setCurrentIndex(0);
    setCurrentLane(1);
    setGateProgress(0);
    setScore(0);
    setStreak(1);
    setLives(3);
    setCorrectCount(0);
    setIncorrectCount(0);
    setIsReadingPhase(true);
    setReadingSecondsLeft(defaultReadingSeconds);
    startTimeRef.current = Date.now();
  }, [gradeId, difficulty, defaultReadingSeconds]);

  // Reset phase when question changes
  useEffect(() => {
    setIsReadingPhase(true);
    setReadingSecondsLeft(defaultReadingSeconds);
    setGateProgress(0);
  }, [currentIndex, defaultReadingSeconds]);

  // Reading countdown timer
  useEffect(() => {
    if (isPaused || !isReadingPhase || collisionFeedback) return;

    const timer = setInterval(() => {
      setReadingSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsReadingPhase(false); // start running approach!
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, isReadingPhase, collisionFeedback]);

  // Finish game helper
  const finishGame = useCallback(
    (finalCorrect: number, finalIncorrect: number, finalScore: number) => {
      const totalQ = questions.length || 10;
      const evaluated = finalCorrect + finalIncorrect;
      const accuracy = evaluated > 0 ? Math.round((finalCorrect / evaluated) * 100) : 0;
      const duration = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));

      const { xpEarned } = GamesZoneService.calculateXpEarned(
        studentNumber,
        difficulty,
        finalCorrect,
        totalQ,
        accuracy
      );

      const record: GamesZoneAttemptRecord = {
        attemptId: `gz_gr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        gameId: 'grammar_runner',
        gameTitle: 'Grammar Runner',
        studentNumber,
        class: studentClass,
        gradeId,
        difficulty,
        score: finalScore,
        totalQuestions: totalQ,
        correctAnswers: finalCorrect,
        incorrectAnswers: finalIncorrect,
        accuracyPercentage: accuracy,
        xpEarned,
        durationSeconds: duration,
        completedAt: new Date().toISOString(),
      };

      GamesZoneService.saveAttempt(record);
      onComplete(record);
    },
    [questions.length, studentNumber, difficulty, studentClass, gradeId, onComplete]
  );

  // Keyboard steering & Quick Start
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setCurrentLane((l) => (l > 0 ? ((l - 1) as 0 | 1 | 2) : 0));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setCurrentLane((l) => (l < 2 ? ((l + 1) as 0 | 1 | 2) : 2));
      } else if (e.key === ' ' || e.key === 'Enter') {
        if (isReadingPhase) {
          setIsReadingPhase(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused, isReadingPhase]);

  // Gate collision evaluator
  const handleCollision = useCallback(() => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    const isMatch = currentLane === currentQ.correctLaneIndex;

    if (isMatch) {
      if (!isMuted) sounds.playSuccess();
      const points = 100 * streak;
      setScore((s) => s + points);
      setStreak((st) => Math.min(5, st + 1));
      const newCorrect = correctCount + 1;
      setCorrectCount(newCorrect);
      setCollisionFeedback({
        isSuccess: true,
        text: `+${points} Perfect Lane!`,
      });

      setTimeout(() => {
        setCollisionFeedback(null);
        setGateProgress(0);
        if (currentIndex + 1 >= questions.length) {
          finishGame(newCorrect, incorrectCount, score + points);
        } else {
          setCurrentIndex((i) => i + 1);
        }
      }, 750);
    } else {
      if (!isMuted) sounds.playError();
      setStreak(1);
      const newIncorrect = incorrectCount + 1;
      setIncorrectCount(newIncorrect);
      const newLives = lives - 1;
      setLives(newLives);
      setCollisionFeedback({
        isSuccess: false,
        text: `Wrong Lane! Correct: "${currentQ.laneOptions[currentQ.correctLaneIndex]}"`,
        explanation: currentQ.explanation,
      });

      setTimeout(() => {
        setCollisionFeedback(null);
        setGateProgress(0);
        if (newLives <= 0 || currentIndex + 1 >= questions.length) {
          finishGame(correctCount, newIncorrect, score);
        } else {
          setCurrentIndex((i) => i + 1);
        }
      }, 1400);
    }
  }, [
    questions,
    currentIndex,
    currentLane,
    isMuted,
    streak,
    correctCount,
    incorrectCount,
    lives,
    score,
    finishGame,
  ]);

  // Approach animation loop (runs only when reading phase is done)
  useEffect(() => {
    if (isPaused || isReadingPhase || collisionFeedback) return;

    const step = () => {
      setGateProgress((prev) => {
        const next = prev + approachSpeed;
        if (next >= 100) {
          handleCollision();
          return 100;
        }
        return next;
      });
      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPaused, isReadingPhase, collisionFeedback, approachSpeed, handleCollision]);

  const currentQ = questions[currentIndex];
  if (!currentQ) return null;

  return (
    <div className="relative w-full h-[650px] max-h-[85vh] bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 rounded-3xl border border-slate-700/80 overflow-hidden flex flex-col select-none shadow-2xl">
      {/* HUD Header */}
      <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between z-20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-black tracking-widest text-blue-400 block">
              Checkpoint {currentIndex + 1} / {questions.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-amber-400">{score}</span>
              <span className="text-xs text-slate-400">pts</span>
            </div>
          </div>
        </div>

        {/* Streak Badge */}
        {streak > 1 && (
          <div className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-blue-500 text-white font-black text-xs flex items-center gap-1 shadow-md animate-pulse">
            <Flame className="w-3.5 h-3.5" /> {streak}x SPRINT
          </div>
        )}

        {/* Lives & Pause */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((heart) => (
              <Heart
                key={heart}
                className={`w-6 h-6 transition-all ${
                  heart <= lives
                    ? 'text-red-500 fill-red-500 animate-pulse'
                    : 'text-slate-700 fill-slate-800'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={onPause}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            aria-label="Pause"
          >
            <Pause className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Top Grammar Prompt */}
      <div className="py-3 px-6 bg-slate-950/80 border-b border-slate-800/80 text-center z-10">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-black uppercase tracking-wider">
            {currentQ.grammarTopic}
          </span>
          {isReadingPhase && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black uppercase tracking-wider">
              <Clock className="w-3 h-3" /> Reading Phase ({readingSecondsLeft}s)
            </span>
          )}
        </div>
        <h3 className="text-xl md:text-2xl font-black text-white tracking-wide">
          {currentQ.sentencePrompt}
        </h3>
      </div>

      {/* Reading Phase Overlay & Preview */}
      {isReadingPhase && (
        <div className="absolute inset-x-4 top-36 z-30 p-5 rounded-3xl bg-slate-900/95 border-2 border-indigo-500/50 shadow-2xl backdrop-blur-xl animate-fade-in flex flex-col items-center space-y-4">
          <div className="text-center">
            <span className="text-xs uppercase font-black tracking-widest text-indigo-400 block mb-1">
              Read the Sentence & Choose Your Lane
            </span>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden max-w-xs mx-auto mt-2">
              <div
                className="bg-gradient-to-r from-amber-400 to-indigo-500 h-full transition-all duration-1000 ease-linear"
                style={{ width: `${(readingSecondsLeft / defaultReadingSeconds) * 100}%` }}
              />
            </div>
          </div>

          {/* 3 Clear Choice Cards */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-xl">
            {currentQ.laneOptions.map((opt, laneIdx) => (
              <button
                key={laneIdx}
                type="button"
                onClick={() => setCurrentLane(laneIdx as 0 | 1 | 2)}
                className={`p-4 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                  currentLane === laneIdx
                    ? 'bg-blue-600/30 border-cyan-400 text-white ring-2 ring-cyan-400/40 shadow-lg'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  {laneIdx === 0 ? 'Lane 1 (Left)' : laneIdx === 1 ? 'Lane 2 (Center)' : 'Lane 3 (Right)'}
                </span>
                <span className="text-base md:text-lg font-black">{opt}</span>
              </button>
            ))}
          </div>

          {/* Action to Start Running Immediately */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsReadingPhase(false)}
              className="py-3 px-8 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 active:scale-95 shadow-xl shadow-blue-600/30 flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" /> Ready to Run! (Start Approach)
            </button>
            <button
              type="button"
              onClick={() => setReadingSecondsLeft((s) => s + 10)}
              className="py-3 px-4 rounded-2xl font-bold text-xs bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
            >
              +10s More Time
            </button>
          </div>
        </div>
      )}

      {/* 3-Lane Track Simulation */}
      <div className="relative flex-1 w-full overflow-hidden flex flex-col justify-end">
        {/* Background Perspective Lines */}
        <div className="absolute inset-0 grid grid-cols-3 pointer-events-none opacity-40">
          <div className="border-r border-dashed border-indigo-500/30" />
          <div className="border-r border-dashed border-indigo-500/30" />
          <div />
        </div>

        {/* Approaching Gates in the 3 Lanes */}
        {!isReadingPhase && (
          <div
            className="absolute inset-x-0 z-10 transition-all duration-75 flex justify-around px-4"
            style={{
              top: `${15 + gateProgress * 0.65}%`,
              opacity: Math.min(1, gateProgress / 15),
              transform: `scale(${0.6 + (gateProgress / 100) * 0.5})`,
            }}
          >
            {currentQ.laneOptions.map((opt, laneIdx) => (
              <div
                key={laneIdx}
                className={`w-1/3 mx-2 p-3.5 rounded-2xl border-2 text-center shadow-xl backdrop-blur-md transition-all ${
                  gateProgress >= 90 && laneIdx === currentQ.correctLaneIndex
                    ? 'bg-emerald-600/60 border-emerald-400 text-white shadow-emerald-500/50'
                    : currentLane === laneIdx
                    ? 'bg-blue-600/40 border-blue-400 text-blue-100 ring-2 ring-blue-400/40'
                    : 'bg-slate-900/80 border-slate-700 text-slate-300'
                }`}
              >
                <span className="text-[10px] font-black uppercase text-slate-400 block mb-0.5">
                  {laneIdx === 0 ? 'Lane 1 (Left)' : laneIdx === 1 ? 'Lane 2 (Center)' : 'Lane 3 (Right)'}
                </span>
                <span className="text-base md:text-lg font-black">{opt}</span>
              </div>
            ))}
          </div>
        )}

        {/* Feedback Alert Overlay */}
        {collisionFeedback && (
          <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-scale-in">
            <div
              className={`max-w-md p-5 rounded-3xl font-bold text-center shadow-2xl border ${
                collisionFeedback.isSuccess
                  ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200'
                  : 'bg-rose-950/90 border-rose-500 text-rose-200'
              }`}
            >
              <div className="flex items-center justify-center gap-2 text-xl font-black mb-1">
                {collisionFeedback.isSuccess ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-400" />
                )}
                {collisionFeedback.text}
              </div>
              {collisionFeedback.explanation && (
                <p className="text-xs text-rose-300/90 mt-2 leading-relaxed">
                  {collisionFeedback.explanation}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Player Runner in Track Lanes */}
        <div className="relative z-20 pb-4 flex justify-around items-center px-4">
          {[0, 1, 2].map((laneIdx) => (
            <button
              key={laneIdx}
              type="button"
              onClick={() => setCurrentLane(laneIdx as 0 | 1 | 2)}
              className="w-1/3 flex flex-col items-center justify-center py-2 group cursor-pointer focus:outline-none"
            >
              {currentLane === laneIdx ? (
                <div className="relative flex flex-col items-center animate-bounce">
                  {/* Runner Avatar */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 border-2 border-cyan-400 shadow-xl shadow-cyan-500/40 flex items-center justify-center text-white font-black text-xl">
                    🏃
                  </div>
                  <span className="mt-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-cyan-400 text-slate-950">
                    YOUR RUNNER
                  </span>
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl border border-slate-800 bg-slate-900/40 flex items-center justify-center text-slate-600 group-hover:border-slate-600 group-hover:text-slate-400 transition-colors">
                  <span className="text-xs font-bold">{laneIdx + 1}</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* On-Screen Steering Controls (Touch & Smartboard) */}
        <div className="p-3 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between gap-2 z-20">
          <button
            type="button"
            onClick={() => setCurrentLane((l) => (l > 0 ? ((l - 1) as 0 | 1 | 2) : 0))}
            className="flex-1 py-3 px-4 rounded-xl font-black text-sm bg-slate-800 text-slate-200 hover:bg-slate-700 active:scale-95 transition-all flex items-center justify-center gap-2 border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" /> Steer Left (A)
          </button>

          <button
            type="button"
            onClick={() => setCurrentLane(1)}
            className={`py-3 px-5 rounded-xl font-black text-sm transition-all border ${
              currentLane === 1
                ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-600/30'
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
            }`}
          >
            Center
          </button>

          <button
            type="button"
            onClick={() => setCurrentLane((l) => (l < 2 ? ((l + 1) as 0 | 1 | 2) : 2))}
            className="flex-1 py-3 px-4 rounded-xl font-black text-sm bg-slate-800 text-slate-200 hover:bg-slate-700 active:scale-95 transition-all flex items-center justify-center gap-2 border border-slate-700"
          >
            Steer Right (D) <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
