import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, Compass, Pause, Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import type { GradeId } from '../../../types/schema';
import type {
  GamesZoneDifficulty,
  GamesZoneAttemptRecord,
  WordFishingItem,
} from '../../../types/gamesZone';
import { getQuestionsForGame } from '../../../data/gamesZone';
import { GamesZoneService } from '../../../services/gamesZoneService';
import { sounds } from '../../../services/soundEffects';

interface WordFishingGameProps {
  gradeId: GradeId;
  difficulty: GamesZoneDifficulty;
  studentNumber: string;
  studentClass?: string;
  onComplete: (record: GamesZoneAttemptRecord) => void;
  onPause: () => void;
  isPaused: boolean;
  isMuted: boolean;
}

interface SwimmingFish {
  id: string;
  word: string;
  isTarget: boolean;
  x: number; // percentage 0 to 100
  y: number; // percentage 20 to 75
  speed: number;
  direction: 1 | -1; // 1 = right, -1 = left
  colorGradient: string;
  isHooked: boolean;
}

const FISH_COLORS = [
  'from-cyan-500 to-blue-600',
  'from-emerald-500 to-teal-600',
  'from-amber-400 to-orange-500',
  'from-fuchsia-500 to-pink-600',
  'from-violet-500 to-purple-600',
];

export const WordFishingGame: React.FC<WordFishingGameProps> = ({
  gradeId,
  difficulty,
  studentNumber,
  studentClass,
  onComplete,
  onPause,
  isPaused,
  isMuted,
}) => {
  const [questions, setQuestions] = useState<WordFishingItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(1);
  const [lives, setLives] = useState(3);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [activeFishes, setActiveFishes] = useState<SwimmingFish[]>([]);
  const [hookTarget, setHookTarget] = useState<{ x: number; y: number } | null>(null);
  const [feedback, setFeedback] = useState<{
    isSuccess: boolean;
    text: string;
    explanation?: string;
  } | null>(null);

  const startTimeRef = useRef(Date.now());
  const pondRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Load questions
  useEffect(() => {
    const pool = getQuestionsForGame('word_fishing', gradeId, difficulty, 10) as WordFishingItem[];
    setQuestions(pool);
    setCurrentIndex(0);
    setScore(0);
    setStreak(1);
    setLives(3);
    setCorrectCount(0);
    setIncorrectCount(0);
    startTimeRef.current = Date.now();
  }, [gradeId, difficulty]);

  // Spawn swimming fishes for question
  const spawnFishes = useCallback((q: WordFishingItem) => {
    if (!q) return;

    const allFishData = [
      { word: q.targetWord, isTarget: true },
      ...q.distractorWords.map((w) => ({ word: w, isTarget: false })),
    ];

    allFishData.sort(() => Math.random() - 0.5);

    const baseSpeed = difficulty === 'hard' ? 0.35 : difficulty === 'medium' ? 0.25 : 0.16;

    const fishes: SwimmingFish[] = allFishData.map((item, idx) => {
      const direction: 1 | -1 = idx % 2 === 0 ? 1 : -1;
      const initialX = direction === 1 ? -10 - idx * 15 : 110 + idx * 15;
      const layerY = 25 + (idx % 4) * 16 + (Math.random() - 0.5) * 6;

      return {
        id: `fish_${idx}_${Date.now()}`,
        word: item.word,
        isTarget: item.isTarget,
        x: initialX,
        y: layerY,
        speed: baseSpeed + (Math.random() - 0.5) * 0.08,
        direction,
        colorGradient: FISH_COLORS[idx % FISH_COLORS.length],
        isHooked: false,
      };
    });

    setActiveFishes(fishes);
    setHookTarget(null);
  }, [difficulty]);

  useEffect(() => {
    if (questions.length > 0 && currentIndex < questions.length) {
      spawnFishes(questions[currentIndex]);
    }
  }, [currentIndex, questions, spawnFishes]);

  // Swimming motion loop
  useEffect(() => {
    if (isPaused) return;

    const updateFishes = () => {
      setActiveFishes((prev) =>
        prev.map((fish) => {
          if (fish.isHooked) return fish;
          let nx = fish.x + fish.speed * fish.direction;

          // Wrap around pond smoothly
          if (fish.direction === 1 && nx > 115) {
            nx = -15;
          } else if (fish.direction === -1 && nx < -15) {
            nx = 115;
          }

          return { ...fish, x: nx };
        })
      );
      animFrameRef.current = requestAnimationFrame(updateFishes);
    };

    animFrameRef.current = requestAnimationFrame(updateFishes);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPaused]);

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
        attemptId: `gz_wf_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        gameId: 'word_fishing',
        gameTitle: 'Word Fishing',
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

  // Handle Hooking a Fish
  const handleCatchFish = (fish: SwimmingFish) => {
    if (fish.isHooked || isPaused || feedback) return;

    setHookTarget({ x: fish.x, y: fish.y });

    setActiveFishes((prev) =>
      prev.map((f) => (f.id === fish.id ? { ...f, isHooked: true } : f))
    );

    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    if (fish.isTarget) {
      // Caught the right fish!
      if (!isMuted) sounds.playSuccess();
      const points = 100 * streak;
      setScore((s) => s + points);
      setStreak((st) => Math.min(5, st + 1));
      const newCorrect = correctCount + 1;
      setCorrectCount(newCorrect);
      setFeedback({
        isSuccess: true,
        text: `+${points} Fish Hooked!`,
        explanation: currentQ.explanation,
      });

      setTimeout(() => {
        setFeedback(null);
        if (currentIndex + 1 >= questions.length) {
          finishGame(newCorrect, incorrectCount, score + points);
        } else {
          setCurrentIndex((i) => i + 1);
        }
      }, 900);
    } else {
      // Caught a wrong distractor!
      if (!isMuted) sounds.playError();
      setStreak(1);
      const newIncorrect = incorrectCount + 1;
      setIncorrectCount(newIncorrect);
      const newLives = lives - 1;
      setLives(newLives);
      setFeedback({
        isSuccess: false,
        text: `Wrong Catch! Target: "${currentQ.targetWord}"`,
      });

      setTimeout(() => {
        setFeedback(null);
        setHookTarget(null);
        setActiveFishes((prev) =>
          prev.map((f) => (f.id === fish.id ? { ...f, isHooked: false } : f))
        );
        if (newLives <= 0 || currentIndex + 1 >= questions.length) {
          finishGame(correctCount, newIncorrect, score);
        }
      }, 1000);
    }
  };

  const currentQ = questions[currentIndex];
  if (!currentQ) return null;

  return (
    <div className="relative w-full h-[650px] max-h-[85vh] bg-gradient-to-b from-sky-950 via-cyan-950 to-teal-950 rounded-3xl border border-cyan-800/60 overflow-hidden flex flex-col select-none shadow-2xl">
      {/* Top HUD */}
      <div className="p-4 bg-slate-900/90 border-b border-cyan-900 flex items-center justify-between z-20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
            <Compass className="w-5 h-5 fill-current" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-black tracking-widest text-cyan-400 block">
              Catch {currentIndex + 1} / {questions.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-amber-400">{score}</span>
              <span className="text-xs text-slate-400">pts</span>
            </div>
          </div>
        </div>

        {/* Streak */}
        {streak > 1 && (
          <div className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-cyan-500 text-white font-black text-xs flex items-center gap-1 shadow-md animate-pulse">
            <Sparkles className="w-3.5 h-3.5" /> {streak}x CATCH STREAK
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

      {/* Target Clue Banner */}
      <div className="py-3 px-6 bg-slate-950/80 border-b border-cyan-900/60 text-center z-10">
        <span className="inline-block px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-black uppercase tracking-wider mb-1">
          {currentQ.clueCategory}
        </span>
        <h3 className="text-xl md:text-2xl font-black text-white tracking-wide">
          {currentQ.cluePrompt}
        </h3>
      </div>

      {/* Pond Area */}
      <div ref={pondRef} className="relative flex-1 w-full overflow-hidden">
        {/* Water Surface Wave Accent */}
        <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-cyan-400/20 to-transparent pointer-events-none" />

        {/* Fishing Line Drop */}
        {hookTarget && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-30">
            <line
              x1={`${hookTarget.x}%`}
              y1="0"
              x2={`${hookTarget.x}%`}
              y2={`${hookTarget.y}%`}
              stroke="#E2E8F0"
              strokeWidth="2.5"
              strokeDasharray="4 2"
            />
            <circle
              cx={`${hookTarget.x}%`}
              cy={`${hookTarget.y}%`}
              r="6"
              fill="#F59E0B"
              stroke="#FFF"
              strokeWidth="2"
            />
          </svg>
        )}

        {/* Feedback Alert Overlay */}
        {feedback && (
          <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-scale-in">
            <div
              className={`max-w-md p-5 rounded-3xl font-bold text-center shadow-2xl border ${
                feedback.isSuccess
                  ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200'
                  : 'bg-rose-950/90 border-rose-500 text-rose-200'
              }`}
            >
              <div className="flex items-center justify-center gap-2 text-xl font-black mb-1">
                {feedback.isSuccess ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-400" />
                )}
                {feedback.text}
              </div>
              {feedback.explanation && (
                <p className="text-xs text-emerald-300/90 mt-2 leading-relaxed">
                  {feedback.explanation}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Swimming Fishes */}
        {activeFishes.map((fish) => (
          <button
            key={fish.id}
            type="button"
            onClick={() => handleCatchFish(fish)}
            style={{
              left: `${fish.x}%`,
              top: `${fish.y}%`,
              transform: `translate(-50%, -50%) ${
                fish.direction === -1 ? 'scaleX(-1)' : 'scaleX(1)'
              }`,
            }}
            disabled={fish.isHooked}
            className={`absolute z-20 group flex items-center gap-2 p-2 rounded-2xl cursor-pointer transition-transform hover:scale-110 active:scale-95 ${
              fish.isHooked ? 'animate-bounce opacity-80' : ''
            }`}
          >
            {/* Fish Body Icon */}
            <div
              className={`w-12 h-10 rounded-full bg-gradient-to-r ${fish.colorGradient} flex items-center justify-center text-white text-xl shadow-lg border border-white/30`}
            >
              🐟
            </div>
            {/* Word Banner Attached to Fish */}
            <span
              className={`px-3 py-1.5 rounded-xl font-black text-sm md:text-base bg-slate-900/90 text-white border border-cyan-400/60 shadow-xl backdrop-blur-md group-hover:border-cyan-300 ${
                fish.direction === -1 ? 'scale-x-[-1]' : ''
              }`}
            >
              {fish.word}
            </span>
          </button>
        ))}

        {/* Smartboard & Touch Hint */}
        <div className="absolute bottom-3 inset-x-0 text-center pointer-events-none">
          <span className="text-[11px] font-semibold text-cyan-300/70 bg-slate-950/60 px-3 py-1 rounded-full border border-cyan-900">
            Touch or click any swimming fish to cast your hook and reel it in!
          </span>
        </div>
      </div>
    </div>
  );
};
