import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Pause, Flame, Trophy, Shield, Zap } from 'lucide-react';
import type { GradeId } from '../../../types/schema';
import type {
  GamesZoneDifficulty,
  GamesZoneAttemptRecord,
  VocabularyInvadersItem,
} from '../../../types/gamesZone';
import { getQuestionsForGame } from '../../../data/gamesZone';
import { GamesZoneService } from '../../../services/gamesZoneService';
import { sounds } from '../../../services/soundEffects';

interface VocabularyInvadersGameProps {
  gradeId: GradeId;
  difficulty: GamesZoneDifficulty;
  studentNumber: string;
  studentClass?: string;
  onComplete: (record: GamesZoneAttemptRecord) => void;
  onPause: () => void;
  isPaused: boolean;
  isMuted: boolean;
}

interface InvaderCandidate {
  id: string;
  word: string;
  isCorrect: boolean;
  laneIndex: number; // 0, 1, 2, or 3
}

export const VocabularyInvadersGame: React.FC<VocabularyInvadersGameProps> = ({
  gradeId,
  difficulty,
  studentNumber,
  studentClass,
  onComplete,
  onPause,
  isPaused,
  isMuted,
}) => {
  const [questions, setQuestions] = useState<VocabularyInvadersItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [invaders, setInvaders] = useState<InvaderCandidate[]>([]);
  
  // Game loop descent progress: 0 (top) to 100 (ground defense barrier)
  const [descentProgress, setDescentProgress] = useState(0);
  
  // Laser firing & hit visual state
  const [laserTargetLane, setLaserTargetLane] = useState<number | null>(null);
  const [hitFeedback, setHitFeedback] = useState<{
    isSuccess: boolean;
    text: string;
    explanation?: string;
  } | null>(null);

  // Performance telemetry
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(1);
  const [shields, setShields] = useState(3);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  const startTimeRef = useRef(Date.now());
  const animFrameRef = useRef<number | null>(null);

  // Descent speed based on difficulty (very comfortable for reading EFL middle-school students)
  const descentSpeed = difficulty === 'hard' ? 0.22 : difficulty === 'medium' ? 0.16 : 0.11;

  // Initialize questions
  useEffect(() => {
    const pool = getQuestionsForGame('vocabulary_invaders', gradeId, difficulty, 10) as VocabularyInvadersItem[];
    setQuestions(pool);
    setCurrentIndex(0);
    setDescentProgress(0);
    setLaserTargetLane(null);
    setHitFeedback(null);
    setScore(0);
    setStreak(1);
    setShields(3);
    setCorrectCount(0);
    setIncorrectCount(0);
    startTimeRef.current = Date.now();
  }, [gradeId, difficulty]);

  // Spawn invaders for current question
  useEffect(() => {
    if (!questions[currentIndex]) return;
    const q = questions[currentIndex];

    // Combine targetWord + distractorWords into 4 distinct invaders
    const candidates: InvaderCandidate[] = [
      { id: `${q.id}_tgt`, word: q.targetWord, isCorrect: true, laneIndex: 0 },
      ...q.distractorWords.slice(0, 3).map((w, idx) => ({
        id: `${q.id}_dist_${idx}`,
        word: w,
        isCorrect: false,
        laneIndex: idx + 1,
      })),
    ];

    // Shuffle lane positions (Fisher-Yates)
    for (let i = candidates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }

    // Re-assign lane indices 0..3
    candidates.forEach((c, idx) => {
      c.laneIndex = idx;
    });

    setInvaders(candidates);
    setDescentProgress(0);
    setLaserTargetLane(null);
    setHitFeedback(null);
  }, [currentIndex, questions]);

  // Finish session helper
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
        attemptId: `gz_vi_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        gameId: 'vocabulary_invaders',
        gameTitle: 'Vocabulary Invaders',
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

  // Target & Fire Laser at an Invader
  const handleFireAtInvader = useCallback(
    (invader: InvaderCandidate) => {
      if (hitFeedback || isPaused) return;

      const currentQ = questions[currentIndex];
      if (!currentQ) return;

      if (!isMuted) sounds.playTap();
      setLaserTargetLane(invader.laneIndex);

      if (invader.isCorrect) {
        if (!isMuted) sounds.playSuccess();
        const points = 100 * streak;
        const nextScore = score + points;
        setScore(nextScore);
        const nextCorrect = correctCount + 1;
        setCorrectCount(nextCorrect);
        setStreak((s) => Math.min(5, s + 1));

        setHitFeedback({
          isSuccess: true,
          text: `DIRECT HIT! +${points} PTS! 💥`,
        });

        setTimeout(() => {
          if (currentIndex + 1 >= questions.length) {
            finishGame(nextCorrect, incorrectCount, nextScore);
          } else {
            setCurrentIndex((i) => i + 1);
          }
        }, 900);
      } else {
        if (!isMuted) sounds.playError();
        setStreak(1);
        const nextIncorrect = incorrectCount + 1;
        setIncorrectCount(nextIncorrect);
        const nextShields = shields - 1;
        setShields(nextShields);

        setHitFeedback({
          isSuccess: false,
          text: `WRONG TARGET! Target was "${currentQ.targetWord}"`,
          explanation: currentQ.explanation,
        });

        setTimeout(() => {
          if (nextShields <= 0 || currentIndex + 1 >= questions.length) {
            finishGame(correctCount, nextIncorrect, score);
          } else {
            setCurrentIndex((i) => i + 1);
          }
        }, 1600);
      }
    },
    [
      hitFeedback,
      isPaused,
      questions,
      currentIndex,
      isMuted,
      streak,
      score,
      correctCount,
      incorrectCount,
      shields,
      finishGame,
    ]
  );

  // Ground breach handler (if invaders touch bottom barrier)
  const handleBreach = useCallback(() => {
    const currentQ = questions[currentIndex];
    if (!currentQ || hitFeedback) return;

    if (!isMuted) sounds.playError();
    setStreak(1);
    const nextIncorrect = incorrectCount + 1;
    setIncorrectCount(nextIncorrect);
    const nextShields = shields - 1;
    setShields(nextShields);

    setHitFeedback({
      isSuccess: false,
      text: `SHIELD BREACH! Correct word was "${currentQ.targetWord}"`,
      explanation: currentQ.explanation,
    });

    setTimeout(() => {
      if (nextShields <= 0 || currentIndex + 1 >= questions.length) {
        finishGame(correctCount, nextIncorrect, score);
      } else {
        setCurrentIndex((i) => i + 1);
      }
    }, 1600);
  }, [questions, currentIndex, hitFeedback, isMuted, incorrectCount, shields, score, correctCount, finishGame]);

  // Descent Animation Loop
  useEffect(() => {
    if (isPaused || hitFeedback) return;

    const step = () => {
      setDescentProgress((prev) => {
        const next = prev + descentSpeed;
        if (next >= 100) {
          handleBreach();
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
  }, [isPaused, hitFeedback, descentSpeed, handleBreach]);

  // Keyboard shortcut handlers: keys 1, 2, 3, 4 fire at lane 0, 1, 2, 3
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused || hitFeedback) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= invaders.length) {
        const chosen = invaders.find((inv) => inv.laneIndex === num - 1);
        if (chosen) {
          handleFireAtInvader(chosen);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused, hitFeedback, invaders, handleFireAtInvader]);

  const currentQ = questions[currentIndex];
  if (!currentQ) return null;

  // UFO visuals per lane
  const ufoColors = [
    { bg: 'from-fuchsia-500 to-pink-600', border: 'border-pink-300', glow: 'shadow-pink-500/50', emoji: '🛸' },
    { bg: 'from-cyan-500 to-blue-600', border: 'border-cyan-300', glow: 'shadow-cyan-500/50', emoji: '👾' },
    { bg: 'from-amber-500 to-orange-600', border: 'border-amber-300', glow: 'shadow-amber-500/50', emoji: '👽' },
    { bg: 'from-emerald-500 to-teal-600', border: 'border-emerald-300', glow: 'shadow-emerald-500/50', emoji: '🛸' },
  ];

  return (
    <div className="relative w-full min-h-[640px] max-w-4xl mx-auto bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 rounded-3xl border-2 border-violet-500/40 overflow-hidden flex flex-col select-none shadow-2xl">
      
      {/* Top HUD Bar */}
      <div className="bg-slate-900/90 backdrop-blur-md px-6 py-3.5 border-b border-violet-500/30 flex items-center justify-between text-white z-20">
        
        {/* Left: Wave Counter & Energy Shields */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-violet-950/80 px-3 py-1.5 rounded-xl border border-violet-500/40">
            <span className="text-xl">👾</span>
            <span className="font-mono font-black text-violet-300 text-sm">
              WAVE {currentIndex + 1} / {questions.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1 rounded-xl border border-slate-700">
            <Shield className="w-4 h-4 text-cyan-400" />
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`w-3.5 h-3.5 rounded-sm transition-all ${
                    s <= shields
                      ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]'
                      : 'bg-slate-700 opacity-40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Center: Vocabulary Category */}
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-bold text-violet-300">
          <span>{currentQ.wordCategory}</span>
        </div>

        {/* Right: Score, Streak, Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-amber-400 font-mono font-black text-sm">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>{score}</span>
          </div>

          {streak > 1 && (
            <div className="flex items-center gap-1 bg-gradient-to-r from-violet-500 to-pink-500 text-white font-black text-xs px-2.5 py-1 rounded-full animate-pulse shadow-sm">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>x{streak}</span>
            </div>
          )}

          <button
            type="button"
            onClick={onPause}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Pause Game"
          >
            <Pause className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Target Mission Brief Prompt */}
      <div className="relative z-10 px-6 py-4 bg-slate-900/80 border-b border-violet-500/20 backdrop-blur-sm">
        <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-violet-400 mb-1">
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> MISSION TARGET CLUE
          </span>
          <span className="font-mono text-slate-400">Tap the matching alien vessel</span>
        </div>
        <p className="text-base sm:text-lg md:text-xl font-black text-white leading-snug">
          {currentQ.prompt}
        </p>
      </div>

      {/* Cosmic Playfield with 4 Descent Lanes */}
      <div className="relative flex-1 p-4 flex flex-col justify-between overflow-hidden">
        
        {/* Starfield Background Decor */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="w-full h-full bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:32px_32px]" />
        </div>

        {/* 4 Vertical Lane Guides */}
        <div className="absolute inset-x-4 top-2 bottom-20 grid grid-cols-4 gap-3 pointer-events-none">
          {[0, 1, 2, 3].map((lane) => (
            <div
              key={lane}
              className={`h-full border-x border-dashed transition-colors ${
                laserTargetLane === lane
                  ? 'border-pink-500/60 bg-pink-500/5'
                  : 'border-violet-500/15'
              }`}
            />
          ))}
        </div>

        {/* Laser Blast Beam Animation */}
        {laserTargetLane !== null && (
          <div
            className="absolute bottom-16 z-30 w-3 bg-gradient-to-t from-pink-400 via-cyan-300 to-white shadow-[0_0_15px_#f472b6] animate-pulse pointer-events-none transition-all"
            style={{
              left: `calc(1rem + ${laserTargetLane * 25}% + 12.5% - 6px)`,
              top: '40px',
            }}
          />
        )}

        {/* Descending Invader Vessels */}
        <div
          className="relative z-10 grid grid-cols-4 gap-3 transition-transform duration-75"
          style={{
            transform: `translateY(${descentProgress * 2.2}px)`,
          }}
        >
          {invaders.map((inv) => {
            const style = ufoColors[inv.laneIndex] || ufoColors[0];
            return (
              <div key={inv.id} className="flex flex-col items-center">
                {/* Invader Click / Tap Card */}
                <button
                  type="button"
                  onClick={() => handleFireAtInvader(inv)}
                  className={`w-full max-w-[190px] p-3 rounded-2xl bg-gradient-to-b ${style.bg} border-2 ${style.border} shadow-lg ${style.glow} active:scale-95 hover:scale-105 transition-all text-center flex flex-col items-center group cursor-pointer`}
                >
                  {/* UFO Icon */}
                  <span className="text-3xl mb-1 filter drop-shadow-md group-hover:animate-bounce">
                    {style.emoji}
                  </span>

                  {/* Candidate Word Capsule */}
                  <div className="w-full bg-slate-950/80 px-2 py-1.5 rounded-xl border border-white/30 backdrop-blur-sm">
                    <span className="text-xs sm:text-sm font-black text-white tracking-wide block truncate">
                      {inv.word}
                    </span>
                  </div>

                  {/* Keyboard shortcut hint */}
                  <span className="text-[10px] font-mono font-bold text-white/80 mt-1">
                    KEY [{inv.laneIndex + 1}]
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Hit / Error Feedback Modal Overlay */}
        {hitFeedback && (
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center justify-center">
            <div
              className={`px-6 py-4 rounded-3xl border-2 shadow-2xl text-center backdrop-blur-md animate-bounce max-w-lg ${
                hitFeedback.isSuccess
                  ? 'bg-emerald-950/95 border-emerald-400 text-emerald-200'
                  : 'bg-rose-950/95 border-rose-400 text-rose-200'
              }`}
            >
              <p className="text-lg md:text-xl font-black font-display tracking-wide">
                {hitFeedback.text}
              </p>
              {hitFeedback.explanation && (
                <p className="text-xs font-medium mt-1.5 text-white/90">
                  {hitFeedback.explanation}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Planetary Defense Barrier Line */}
        <div className="relative z-10 mt-auto pt-4">
          <div className="w-full h-2 rounded-full bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 shadow-[0_0_12px_#8b5cf6]" />
          <div className="flex items-center justify-between text-[11px] font-black text-violet-300 pt-1.5 px-2">
            <span>PLANETARY SHIELD PERIMETER</span>
            <span className="font-mono">DESCENT: {Math.round(descentProgress)}%</span>
          </div>

          {/* Defense Cannons */}
          <div className="grid grid-cols-4 gap-3 pt-2">
            {[0, 1, 2, 3].map((lane) => (
              <div key={lane} className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => {
                    const inv = invaders.find((i) => i.laneIndex === lane);
                    if (inv) handleFireAtInvader(inv);
                  }}
                  className={`w-full py-2 rounded-xl text-xs font-black transition-all border ${
                    laserTargetLane === lane
                      ? 'bg-pink-600 border-pink-400 text-white shadow-lg'
                      : 'bg-slate-900 border-violet-500/40 text-violet-300 hover:bg-violet-900/50'
                  }`}
                >
                  ⚡ FIRE [{lane + 1}]
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default VocabularyInvadersGame;
