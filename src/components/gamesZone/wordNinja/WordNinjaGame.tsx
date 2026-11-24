import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, Zap, Sparkles, Pause } from 'lucide-react';
import type { GradeId } from '../../../types/schema';
import type {
  GamesZoneDifficulty,
  GamesZoneAttemptRecord,
  WordNinjaItem,
} from '../../../types/gamesZone';
import { getQuestionsForGame } from '../../../data/gamesZone';
import { GamesZoneService } from '../../../services/gamesZoneService';
import { sounds } from '../../../services/soundEffects';
import { lineIntersectsBox } from './slicingPhysics';
import { fisherYatesShuffle } from '../../../utils/shuffle';

interface WordNinjaGameProps {
  gradeId: GradeId;
  difficulty: GamesZoneDifficulty;
  studentNumber: string;
  studentClass?: string;
  onComplete: (record: GamesZoneAttemptRecord) => void;
  onPause: () => void;
  isPaused: boolean;
  isMuted: boolean;
}

interface FloatingTarget {
  id: string;
  word: string;
  isCorrect: boolean;
  x: number; // percentage 10 to 80
  y: number; // percentage 15 to 75
  vx: number;
  vy: number;
  isSliced: boolean;
}

export const WordNinjaGame: React.FC<WordNinjaGameProps> = ({
  gradeId,
  difficulty,
  studentNumber,
  studentClass,
  onComplete,
  onPause,
  isPaused,
  isMuted,
}) => {
  const [questions, setQuestions] = useState<WordNinjaItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [lives, setLives] = useState(3);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [activeTargets, setActiveTargets] = useState<FloatingTarget[]>([]);
  const [sliceTrail, setSliceTrail] = useState<{ x: number; y: number }[]>([]);
  const [feedback, setFeedback] = useState<{ text: string; isSuccess: boolean } | null>(null);

  const startTimeRef = useRef(Date.now());
  const arenaRef = useRef<HTMLDivElement>(null);
  const targetRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const animationFrameRef = useRef<number | null>(null);
  const isPointerDownRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const slicedInCurrentStrokeRef = useRef<Set<string>>(new Set());

  // Load questions with recent history tracking
  useEffect(() => {
    const pool = getQuestionsForGame('word_ninja', gradeId, difficulty, 10, studentNumber) as WordNinjaItem[];
    setQuestions(pool);
    setCurrentIndex(0);
    setScore(0);
    setCombo(1);
    setLives(3);
    setCorrectCount(0);
    setIncorrectCount(0);
    startTimeRef.current = Date.now();
  }, [gradeId, difficulty, studentNumber]);

  // Spawn targets for current question
  const spawnTargetsForQuestion = useCallback((q: WordNinjaItem) => {
    if (!q) return;
    const allWords = [
      { word: q.correctWord, isCorrect: true },
      ...q.distractorWords.map((w) => ({ word: w, isCorrect: false })),
    ];

    // Shuffle targets randomly using unbiased Fisher-Yates algorithm
    const shuffledWords = fisherYatesShuffle(allWords);

    const speedMultiplier = difficulty === 'hard' ? 0.35 : difficulty === 'medium' ? 0.25 : 0.15;

    const targets: FloatingTarget[] = shuffledWords.map((item, idx) => {
      const angle = (idx / allWords.length) * Math.PI * 2;
      return {
        id: `target_${idx}_${Date.now()}`,
        word: item.word,
        isCorrect: item.isCorrect,
        x: 20 + Math.random() * 60,
        y: 20 + Math.random() * 55,
        vx: (Math.cos(angle) + (Math.random() - 0.5) * 0.5) * speedMultiplier,
        vy: (Math.sin(angle) + (Math.random() - 0.5) * 0.5) * speedMultiplier,
        isSliced: false,
      };
    });

    setActiveTargets(targets);
    targetRefs.current = {};
    slicedInCurrentStrokeRef.current.clear();
  }, [difficulty]);

  useEffect(() => {
    if (questions.length > 0 && currentIndex < questions.length) {
      spawnTargetsForQuestion(questions[currentIndex]);
    }
  }, [currentIndex, questions, spawnTargetsForQuestion]);

  // Motion physics loop
  useEffect(() => {
    if (isPaused) return;

    const updatePhysics = () => {
      setActiveTargets((prev) =>
        prev.map((target) => {
          if (target.isSliced) return target;
          let nx = target.x + target.vx;
          let ny = target.y + target.vy;
          let nvx = target.vx;
          let nvy = target.vy;

          // Bounce off boundaries
          if (nx < 10 || nx > 85) {
            nvx = -nvx;
            nx = Math.max(10, Math.min(85, nx));
          }
          if (ny < 12 || ny > 80) {
            nvy = -nvy;
            ny = Math.max(12, Math.min(80, ny));
          }

          return { ...target, x: nx, y: ny, vx: nvx, vy: nvy };
        })
      );
      animationFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animationFrameRef.current = requestAnimationFrame(updatePhysics);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPaused]);

  // Finish game helper
  const finishGame = useCallback(
    (finalCorrect: number, finalIncorrect: number, finalScore: number) => {
      const totalQ = questions.length || 10;
      const accuracy = totalQ > 0 ? Math.round((finalCorrect / totalQ) * 100) : 0;
      const effectiveIncorrect = Math.max(finalIncorrect, totalQ - finalCorrect);
      const duration = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));

      const { xpEarned } = GamesZoneService.calculateXpEarned(
        studentNumber,
        difficulty,
        finalCorrect,
        totalQ,
        accuracy
      );

      const record: GamesZoneAttemptRecord = {
        attemptId: `gz_wn_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        gameId: 'word_ninja',
        gameTitle: 'Word Ninja',
        studentNumber,
        class: studentClass,
        gradeId,
        difficulty,
        score: finalScore,
        totalQuestions: totalQ,
        correctAnswers: finalCorrect,
        incorrectAnswers: effectiveIncorrect,
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

  // Handle Target Slicing
  const handleSliceTarget = useCallback(
    (target: FloatingTarget) => {
      if (target.isSliced || isPaused) return;

      // Mark sliced
      setActiveTargets((prev) =>
        prev.map((t) => (t.id === target.id ? { ...t, isSliced: true } : t))
      );

      if (target.isCorrect) {
        // Correct slice!
        if (!isMuted) sounds.playSuccess();
        const earned = 100 * combo;
        setScore((s) => s + earned);
        setCombo((c) => Math.min(5, c + 1));
        const newCorrect = correctCount + 1;
        setCorrectCount(newCorrect);
        setFeedback({ text: `+${earned} Slice Cut!`, isSuccess: true });

        setTimeout(() => {
          setFeedback(null);
          if (currentIndex + 1 >= questions.length) {
            finishGame(newCorrect, incorrectCount, score + earned);
          } else {
            setCurrentIndex((i) => i + 1);
          }
        }, 650);
      } else {
        // Sliced wrong distractor!
        if (!isMuted) sounds.playError();
        setCombo(1);
        const newIncorrect = incorrectCount + 1;
        setIncorrectCount(newIncorrect);
        const newLives = lives - 1;
        setLives(newLives);
        setFeedback({ text: `Oops! That's not the target!`, isSuccess: false });

        setTimeout(() => {
          setFeedback(null);
          if (newLives <= 0) {
            finishGame(correctCount, newIncorrect, score);
          }
        }, 750);
      }
    },
    [
      isPaused,
      isMuted,
      combo,
      correctCount,
      incorrectCount,
      lives,
      currentIndex,
      questions.length,
      score,
      finishGame,
    ]
  );

  // Check swipe intersection against all unsliced targets
  const checkSwipeIntersection = useCallback(
    (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
      if (!arenaRef.current || isPaused) return;
      const arenaRect = arenaRef.current.getBoundingClientRect();

      for (const target of activeTargets) {
        if (target.isSliced || slicedInCurrentStrokeRef.current.has(target.id)) continue;
        const el = targetRefs.current[target.id];
        if (!el) continue;

        const elRect = el.getBoundingClientRect();
        const bx = elRect.left - arenaRect.left;
        const by = elRect.top - arenaRect.top;
        const bw = elRect.width;
        const bh = elRect.height;

        if (lineIntersectsBox(p1.x, p1.y, p2.x, p2.y, bx, by, bw, bh)) {
          slicedInCurrentStrokeRef.current.add(target.id);
          handleSliceTarget(target);
          break; // slice one per segment
        }
      }
    },
    [activeTargets, isPaused, handleSliceTarget]
  );

  // Slicing gesture handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!arenaRef.current || isPaused) return;
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // ignore pointer capture errors if unsupported
    }

    isPointerDownRef.current = true;
    slicedInCurrentStrokeRef.current.clear();

    const rect = arenaRef.current.getBoundingClientRect();
    const point = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    lastPointRef.current = point;
    setSliceTrail([point]);

    // Check direct touch / point collision on start
    checkSwipeIntersection(point, point);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current || !arenaRef.current || isPaused) return;
    const rect = arenaRef.current.getBoundingClientRect();
    const currentPoint = { x: e.clientX - rect.left, y: e.clientY - rect.top };

    if (lastPointRef.current) {
      checkSwipeIntersection(lastPointRef.current, currentPoint);
    }

    lastPointRef.current = currentPoint;
    setSliceTrail((prev) => [...prev.slice(-8), currentPoint]);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isPointerDownRef.current = false;
    lastPointRef.current = null;
    slicedInCurrentStrokeRef.current.clear();
    try {
      if ((e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      }
    } catch {
      // ignore
    }
    setTimeout(() => setSliceTrail([]), 150);
  };

  const currentQ = questions[currentIndex];
  if (!currentQ) return null;

  return (
    <div className="relative w-full h-[650px] max-h-[85vh] bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 rounded-3xl border border-slate-700/80 overflow-hidden flex flex-col select-none shadow-2xl">
      {/* Top HUD */}
      <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between z-20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-red-500/20 text-red-400">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-black tracking-widest text-red-400 block">
              Round {currentIndex + 1} / {questions.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-amber-400">{score}</span>
              <span className="text-xs text-slate-400">pts</span>
            </div>
          </div>
        </div>

        {/* Combo Multiplier */}
        <div className="flex items-center gap-2">
          {combo > 1 && (
            <div className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-red-500 text-white font-black text-xs flex items-center gap-1 shadow-md animate-pulse">
              <Sparkles className="w-3.5 h-3.5" /> {combo}x STREAK
            </div>
          )}
        </div>

        {/* Hearts & Pause */}
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

      {/* Target Mission Banner */}
      <div className="py-3 px-6 bg-slate-950/80 border-b border-slate-800/80 text-center z-10">
        <span className="inline-block px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-black uppercase tracking-wider mb-1">
          {currentQ.promptType}
        </span>
        <h3 className="text-xl md:text-2xl font-black text-white tracking-wide">
          {currentQ.prompt}
        </h3>
      </div>

      {/* Interactive Slicing Arena */}
      <div
        ref={arenaRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative flex-1 w-full h-full cursor-crosshair overflow-hidden touch-none"
      >
        {/* Glowing Katana Slice Trail */}
        {sliceTrail.length > 1 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-30">
            <defs>
              <linearGradient id="bladeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="50%" stopColor="#F43F5E" />
                <stop offset="100%" stopColor="#FFFFFF" />
              </linearGradient>
            </defs>
            <polyline
              points={sliceTrail.map((p) => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="url(#bladeGlow)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="filter drop-shadow-[0_0_10px_#38BDF8]"
            />
          </svg>
        )}

        {/* Feedback Alert Overlay */}
        {feedback && (
          <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none animate-scale-in">
            <div
              className={`px-6 py-3 rounded-2xl font-black text-lg md:text-xl shadow-2xl backdrop-blur-md border ${
                feedback.isSuccess
                  ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200'
                  : 'bg-rose-950/90 border-rose-500 text-rose-200'
              }`}
            >
              {feedback.text}
            </div>
          </div>
        )}

        {/* Floating Flying Targets — 100% NEUTRAL STYLING BEFORE SLICE (NO ANSWER LEAK) */}
        {activeTargets.map((target) => (
          <div
            key={target.id}
            ref={(el) => {
              targetRefs.current[target.id] = el;
            }}
            style={{
              left: `${target.x}%`,
              top: `${target.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className={`absolute z-20 pointer-events-none transition-transform duration-200 ${
              target.isSliced ? 'scale-110' : ''
            }`}
          >
            {target.isSliced ? (
              /* Sliced State with satisfying split animation and revealing green/red feedback */
              <div className="relative flex flex-col items-center">
                {/* Upper slice half sliding up-left */}
                <div
                  className={`px-5 py-1.5 rounded-t-2xl font-black text-base md:text-lg border-x-2 border-t-2 shadow-2xl transition-all duration-500 -translate-y-3 -translate-x-3 -rotate-12 opacity-80 ${
                    target.isCorrect
                      ? 'bg-emerald-600 text-white border-emerald-300 shadow-emerald-500/50'
                      : 'bg-rose-600 text-white border-rose-300 shadow-rose-500/50'
                  }`}
                >
                  {target.word}
                </div>
                {/* Slicing laser divider */}
                <div
                  className={`w-full h-1 ${
                    target.isCorrect ? 'bg-emerald-300 shadow-[0_0_8px_#10B981]' : 'bg-rose-300 shadow-[0_0_8px_#EF4444]'
                  }`}
                />
                {/* Lower slice half sliding down-right */}
                <div
                  className={`px-5 py-1.5 rounded-b-2xl font-black text-base md:text-lg border-x-2 border-b-2 shadow-2xl transition-all duration-500 translate-y-3 translate-x-3 rotate-12 opacity-80 ${
                    target.isCorrect
                      ? 'bg-emerald-600 text-white border-emerald-300 shadow-emerald-500/50'
                      : 'bg-rose-600 text-white border-rose-300 shadow-rose-500/50'
                  }`}
                >
                  {target.word}
                </div>
              </div>
            ) : (
              /* Unsliced Neutral State: Identical styling for all options, ZERO answer cues */
              <div className="px-5 py-3 rounded-2xl font-black text-base md:text-lg bg-gradient-to-r from-slate-800/95 via-slate-850/95 to-slate-900/95 text-slate-100 border-2 border-slate-700/80 shadow-xl shadow-black/50">
                {target.word}
              </div>
            )}
          </div>
        ))}

        {/* Smartboard Hint at bottom */}
        <div className="absolute bottom-3 inset-x-0 text-center pointer-events-none">
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-950/70 px-4 py-1.5 rounded-full border border-slate-800">
            Swipe or drag through the target word to slice it like a ninja!
          </span>
        </div>
      </div>
    </div>
  );
};
