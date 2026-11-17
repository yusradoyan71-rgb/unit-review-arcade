import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Pause, Flame, Trophy, Shield, Zap, ArrowLeft, ArrowRight } from 'lucide-react';
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

interface AlienShip {
  id: string;
  word: string;
  isCorrect: boolean;
  laneIndex: number;
  x: number; // center X (105, 300, 495, 690)
  width: number;
  height: number;
}

interface Projectile {
  id: string;
  x: number;
  y: number;
  vy: number;
}

// Playfield coordinate space (800 x 500)
const PLAYFIELD_WIDTH = 800;
const PLAYFIELD_HEIGHT = 500;
const CANNON_Y = 445;
const LANE_CENTERS = [105, 300, 495, 690];
const DEFENSE_PERIMETER_Y = 415;

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
  const [alienShips, setAlienShips] = useState<AlienShip[]>([]);

  // Cannon & Projectiles State
  const [cannonX, setCannonX] = useState(400);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const lastFireTimeRef = useRef(0);
  const keysDownRef = useRef<Record<string, boolean>>({});

  // Descent progress: 0 (top) to 100 (ground defense barrier)
  const [descentProgress, setDescentProgress] = useState(0);

  // Hit & Feedback State
  const [hitFeedback, setHitFeedback] = useState<{
    isSuccess: boolean;
    text: string;
    explanation?: string;
  } | null>(null);
  const [explodingShipId, setExplodingShipId] = useState<string | null>(null);

  // Performance telemetry
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(1);
  const [shields, setShields] = useState(3);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  const startTimeRef = useRef(Date.now());
  const animFrameRef = useRef<number | null>(null);
  const playfieldSvgRef = useRef<SVGSVGElement | null>(null);

  // EXACT TEACHER-APPROVED DESCENT SPEED (Preserved as requested)
  const descentSpeed = difficulty === 'hard' ? 0.22 : difficulty === 'medium' ? 0.16 : 0.11;

  // Initialize questions
  useEffect(() => {
    const pool = getQuestionsForGame('vocabulary_invaders', gradeId, difficulty, 10) as VocabularyInvadersItem[];
    setQuestions(pool);
    setCurrentIndex(0);
    setCannonX(400);
    setProjectiles([]);
    setDescentProgress(0);
    setHitFeedback(null);
    setExplodingShipId(null);
    setScore(0);
    setStreak(1);
    setShields(3);
    setCorrectCount(0);
    setIncorrectCount(0);
    startTimeRef.current = Date.now();
  }, [gradeId, difficulty]);

  // Spawn alien ships for current wave
  useEffect(() => {
    if (!questions[currentIndex]) return;
    const q = questions[currentIndex];

    // Combine targetWord + distractorWords into 4 distinct invaders
    const rawCandidates = [
      { id: `${q.id}_tgt`, word: q.targetWord, isCorrect: true },
      ...q.distractorWords.slice(0, 3).map((w, idx) => ({
        id: `${q.id}_dist_${idx}`,
        word: w,
        isCorrect: false,
      })),
    ];

    // Shuffle lane assignments (Fisher-Yates)
    for (let i = rawCandidates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rawCandidates[i], rawCandidates[j]] = [rawCandidates[j], rawCandidates[i]];
    }

    const ships: AlienShip[] = rawCandidates.map((c, idx) => ({
      ...c,
      laneIndex: idx,
      x: LANE_CENTERS[idx],
      width: 160,
      height: 56,
    }));

    setAlienShips(ships);
    setProjectiles([]);
    setDescentProgress(0);
    setHitFeedback(null);
    setExplodingShipId(null);
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

  // Fire a projectile from the cannon
  const handleFireCannon = useCallback(() => {
    if (hitFeedback || isPaused) return;

    const now = performance.now();
    if (now - lastFireTimeRef.current < 320) return; // Cooldown gate
    lastFireTimeRef.current = now;

    if (!isMuted) sounds.playTap();

    setProjectiles((prev) => [
      ...prev,
      {
        id: `p_${now}_${Math.random()}`,
        x: cannonX,
        y: CANNON_Y - 20,
        vy: -13, // Fast upward speed
      },
    ]);
  }, [hitFeedback, isPaused, isMuted, cannonX]);

  // Ground breach handler (alien ships hit planetary defense line)
  const handleGroundBreach = useCallback(() => {
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
      text: `SHIELD BREACH! Target word was "${currentQ.targetWord}"`,
      explanation: currentQ.explanation,
    });

    setTimeout(() => {
      if (nextShields <= 0 || currentIndex + 1 >= questions.length) {
        finishGame(correctCount, nextIncorrect, score);
      } else {
        setCurrentIndex((i) => i + 1);
      }
    }, 1800);
  }, [questions, currentIndex, hitFeedback, isMuted, incorrectCount, shields, score, correctCount, finishGame]);

  // Main 60 FPS Game Loop: Cannon movement, Projectile flight, Descent, and 2D Collisions
  useEffect(() => {
    if (isPaused || hitFeedback) return;

    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    const loop = () => {
      // 1. Cannon continuous keyboard movement
      const keys = keysDownRef.current;
      if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
        setCannonX((x) => Math.max(70, x - 7.5));
      }
      if (keys['ArrowRight'] || keys['d'] || keys['D']) {
        setCannonX((x) => Math.min(PLAYFIELD_WIDTH - 70, x + 7.5));
      }

      // 2. Advance alien ship descent progress
      setDescentProgress((prev) => {
        const next = prev + descentSpeed;
        if (next >= 100) {
          handleGroundBreach();
          return 100;
        }
        return next;
      });

      // 3. Move projectiles and evaluate 2D collisions
      setProjectiles((prev) => {
        if (prev.length === 0) return prev;

        const updated: Projectile[] = [];
        const currentShipY = 55 + (descentProgress / 100) * (DEFENSE_PERIMETER_Y - 110);

        for (const p of prev) {
          const nextY = p.y + p.vy;

          // Out of screen at top
          if (nextY < 10) continue;

          // Check collision against each descending alien ship
          let hitShip: AlienShip | null = null;

          for (const ship of alienShips) {
            const shipLeft = ship.x - ship.width / 2;
            const shipRight = ship.x + ship.width / 2;
            const shipTop = currentShipY;
            const shipBottom = currentShipY + ship.height;

            if (p.x >= shipLeft && p.x <= shipRight && nextY >= shipTop && nextY <= shipBottom) {
              hitShip = ship;
              break;
            }
          }

          if (hitShip) {
            // Collision occurred! Consume projectile and process hit
            if (hitShip.isCorrect) {
              // Direct correct target hit!
              if (!isMuted) sounds.playSuccess();
              setExplodingShipId(hitShip.id);
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
              }, 950);
            } else {
              // Wrong target hit!
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
              }, 1800);
            }

            // Do not keep this projectile
            continue;
          }

          // Keep projectile moving upward
          updated.push({ ...p, y: nextY });
        }

        return updated;
      });

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [
    isPaused,
    hitFeedback,
    questions,
    currentIndex,
    descentSpeed,
    descentProgress,
    alienShips,
    streak,
    score,
    correctCount,
    incorrectCount,
    shields,
    isMuted,
    handleGroundBreach,
    finishGame,
  ]);

  // Keyboard Event Listeners (Arrow keys, A/D, Space)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused) return;

      keysDownRef.current[e.key] = true;

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleFireCannon();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysDownRef.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPaused, handleFireCannon]);

  // Pointer drag & tap on playfield to move cannon and fire
  const handlePlayfieldPointer = (e: React.PointerEvent) => {
    if (isPaused || hitFeedback || !playfieldSvgRef.current) return;
    const pt = playfieldSvgRef.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(playfieldSvgRef.current.getScreenCTM()?.inverse());

    // Update cannon X position directly towards pointer location
    setCannonX(Math.max(70, Math.min(PLAYFIELD_WIDTH - 70, svgP.x)));
  };

  const currentQ = questions[currentIndex];
  if (!currentQ) return null;

  // Ship visual themes
  const shipThemes = [
    { bg: '#f43f5e', border: '#fda4af', ufoFill: '#fb7185', emoji: '🛸' },
    { bg: '#0284c7', border: '#7dd3fc', ufoFill: '#38bdf8', emoji: '👾' },
    { bg: '#ea580c', border: '#fdba74', ufoFill: '#fb923c', emoji: '👽' },
    { bg: '#059669', border: '#6ee7b7', ufoFill: '#34d399', emoji: '🛸' },
  ];

  const currentShipY = 55 + (descentProgress / 100) * (DEFENSE_PERIMETER_Y - 110);

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-gradient-to-b from-indigo-50 via-sky-50 to-purple-100 rounded-3xl border-3 border-indigo-300 shadow-2xl overflow-hidden flex flex-col select-none">
      
      {/* Top Header & HUD */}
      <div className="bg-white/95 backdrop-blur-md px-6 py-3 border-b-2 border-indigo-200 flex items-center justify-between z-20">
        
        {/* Left: Wave & Energy Shields */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-indigo-100 px-3 py-1.5 rounded-xl border border-indigo-300">
            <span className="text-xl">👾</span>
            <span className="font-mono font-black text-indigo-900 text-sm">
              WAVE {currentIndex + 1} / {questions.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-sky-100 px-3 py-1 rounded-xl border border-sky-300">
            <Shield className="w-4 h-4 text-sky-700" />
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`w-3.5 h-3.5 rounded-md transition-all ${
                    s <= shields
                      ? 'bg-sky-500 shadow-sm border border-sky-600'
                      : 'bg-slate-300 opacity-40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Center: Vocabulary Category */}
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-100 border border-indigo-300 text-xs font-black text-indigo-900">
          <span>{currentQ.wordCategory}</span>
        </div>

        {/* Right: Score, Streak, Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-indigo-950 font-mono font-black text-sm bg-indigo-100/80 px-2.5 py-1 rounded-xl border border-indigo-300">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>{score}</span>
          </div>

          {streak > 1 && (
            <div className="flex items-center gap-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black text-xs px-2.5 py-1 rounded-full animate-bounce shadow-sm">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>x{streak}</span>
            </div>
          )}

          <button
            type="button"
            onClick={onPause}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-300"
            title="Pause Game"
          >
            <Pause className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Mission Clue Banner (High contrast, clean typography) */}
      <div className="p-4 md:px-6 bg-white border-b-2 border-indigo-200 z-10 space-y-1.5">
        <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-indigo-800">
          <span className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" /> TARGET CLUE • AIM & BLAST THE MATCHING SHIP
          </span>
          <span className="font-mono text-slate-500">Arrow Keys / A-D to Move • Space to Fire</span>
        </div>
        <p className="text-base sm:text-lg md:text-xl font-black text-slate-900 leading-snug">
          {currentQ.prompt}
        </p>
      </div>

      {/* INTERACTIVE 2D SHOOTER PLAYFIELD */}
      <div className="relative flex-1 min-h-[440px] bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 overflow-hidden flex flex-col justify-between">
        
        {/* SVG Game Canvas */}
        <svg
          ref={playfieldSvgRef}
          viewBox={`0 0 ${PLAYFIELD_WIDTH} ${PLAYFIELD_HEIGHT}`}
          className="w-full h-full cursor-crosshair touch-none"
          onPointerDown={handlePlayfieldPointer}
          onPointerMove={(e) => {
            if (e.buttons > 0) handlePlayfieldPointer(e);
          }}
        >
          {/* Starfield Backdrop */}
          <defs>
            <linearGradient id="laserGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
            <linearGradient id="cannonMetal" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="50%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>
          </defs>

          {/* Lane dividers */}
          {LANE_CENTERS.map((lx, idx) => (
            <line
              key={idx}
              x1={lx}
              y1="30"
              x2={lx}
              y2={DEFENSE_PERIMETER_Y}
              stroke="#6366f1"
              strokeWidth="1.5"
              strokeDasharray="4 6"
              opacity="0.25"
            />
          ))}

          {/* Planetary Defense Barrier Line */}
          <line
            x1="20"
            y1={DEFENSE_PERIMETER_Y}
            x2={PLAYFIELD_WIDTH - 20}
            y2={DEFENSE_PERIMETER_Y}
            stroke="#38bdf8"
            strokeWidth="3"
            opacity="0.8"
          />
          <text x="30" y={DEFENSE_PERIMETER_Y - 8} fill="#38bdf8" fontSize="10" fontWeight="900" letterSpacing="2">
            SHIELD PERIMETER
          </text>

          {/* PROJECTILES (Moving upward with laser glow) */}
          {projectiles.map((p) => (
            <g key={p.id}>
              {/* Outer Glow */}
              <ellipse cx={p.x} cy={p.y} rx="5" ry="12" fill="#38bdf8" opacity="0.6" />
              {/* Core Laser Bolt */}
              <line
                x1={p.x}
                y1={p.y - 10}
                x2={p.x}
                y2={p.y + 10}
                stroke="url(#laserGrad)"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </g>
          ))}

          {/* DESCENDING ALIEN SHIPS (With clear English vocabulary labels) */}
          {alienShips.map((ship) => {
            const theme = shipThemes[ship.laneIndex] || shipThemes[0];
            const isExploding = explodingShipId === ship.id;

            if (isExploding) {
              return (
                <g key={ship.id} transform={`translate(${ship.x}, ${currentShipY + 28})`}>
                  <circle cx="0" cy="0" r="45" fill="#facc15" opacity="0.9" className="animate-ping" />
                  <circle cx="0" cy="0" r="30" fill="#f97316" />
                  <text x="0" y="8" textAnchor="middle" fontSize="24">💥</text>
                </g>
              );
            }

            return (
              <g
                key={ship.id}
                transform={`translate(${ship.x - ship.width / 2}, ${currentShipY})`}
                className="transition-transform duration-75"
              >
                {/* UFO Dome / Canopy */}
                <ellipse
                  cx={ship.width / 2}
                  cy="12"
                  rx="30"
                  ry="14"
                  fill={theme.ufoFill}
                  stroke="#ffffff"
                  strokeWidth="2"
                  opacity="0.95"
                />

                {/* Main Vessel Saucer Chassis */}
                <rect
                  x="0"
                  y="12"
                  width={ship.width}
                  height="42"
                  rx="14"
                  fill="#ffffff"
                  stroke={theme.bg}
                  strokeWidth="3.5"
                  filter="drop-shadow(0 4px 10px rgba(0,0,0,0.4))"
                />

                {/* Left/Right UFO Thruster Lights */}
                <circle cx="16" cy="33" r="5" fill={theme.bg} />
                <circle cx={ship.width - 16} cy="33" r="5" fill={theme.bg} />

                {/* English Word Card Badge inside Saucer */}
                <text
                  x={ship.width / 2}
                  y="38"
                  textAnchor="middle"
                  fill="#0f172a"
                  fontSize="15"
                  fontWeight="900"
                  letterSpacing="0.5"
                >
                  {ship.word}
                </text>
              </g>
            );
          })}

          {/* PLAYER-CONTROLLED CANNON (At bottom of screen) */}
          <g transform={`translate(${cannonX}, ${CANNON_Y})`}>
            {/* Target Reticle Beam Guideline */}
            <line
              x1="0"
              y1="-22"
              x2="0"
              y2={-CANNON_Y + 50}
              stroke="#38bdf8"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              opacity="0.3"
            />

            {/* Cannon Base Wheel Chassis */}
            <rect x="-30" y="0" width="60" height="24" rx="8" fill="#334155" stroke="#64748b" strokeWidth="2" />
            <circle cx="-18" cy="18" r="6" fill="#0f172a" />
            <circle cx="18" cy="18" r="6" fill="#0f172a" />

            {/* Cannon Turret Body */}
            <polygon points="-22,4 22,4 16,-12 -16,-12" fill="url(#cannonMetal)" stroke="#94a3b8" strokeWidth="2" />

            {/* Laser Barrel */}
            <rect x="-6" y="-30" width="12" height="22" rx="3" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
            <ellipse cx="0" cy="-30" rx="6" ry="2.5" fill="#f0abfc" />

            {/* Cannon Indicator Light */}
            <circle cx="0" cy="-4" r="4" fill="#a855f7" className="animate-pulse" />
          </g>
        </svg>

        {/* FEEDBACK OVERLAY BANNER */}
        {hitFeedback && (
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center justify-center">
            <div
              className={`px-6 py-4 rounded-3xl border-3 shadow-2xl text-center backdrop-blur-md animate-bounce max-w-lg ${
                hitFeedback.isSuccess
                  ? 'bg-emerald-950/95 border-emerald-400 text-emerald-100'
                  : 'bg-rose-950/95 border-rose-400 text-rose-100'
              }`}
            >
              <p className="text-lg md:text-xl font-black font-display tracking-wide">
                {hitFeedback.text}
              </p>
              {hitFeedback.explanation && (
                <p className="text-xs font-semibold mt-1.5 text-white/95">
                  {hitFeedback.explanation}
                </p>
              )}
            </div>
          </div>
        )}

        {/* BOTTOM SMARTBOARD & TOUCH SHOOTING CONSOLE */}
        <div className="p-3 bg-slate-900/90 border-t-2 border-indigo-400/40 flex items-center justify-between gap-4 z-20 backdrop-blur-md">
          
          {/* Movement Arrow Buttons (Touch/Click) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onPointerDown={() => {
                setCannonX((x) => Math.max(70, x - 55));
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-600 text-white font-black text-xs flex items-center gap-1 shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>LEFT [A]</span>
            </button>

            <button
              type="button"
              onPointerDown={() => {
                setCannonX((x) => Math.min(PLAYFIELD_WIDTH - 70, x + 55));
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-600 text-white font-black text-xs flex items-center gap-1 shadow-md"
            >
              <span>RIGHT [D]</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Cannon Track Tap Info */}
          <div className="hidden md:flex items-center text-xs font-bold text-slate-400">
            <span>Drag cannon or use Arrow keys to aim</span>
          </div>

          {/* Big Fire Cannon Button */}
          <button
            type="button"
            onClick={handleFireCannon}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-black text-sm uppercase tracking-wider shadow-lg active:scale-95 transition-all flex items-center gap-2"
          >
            <Zap className="w-4 h-4 text-amber-300 fill-current" />
            <span>FIRE LASER! (SPACE)</span>
          </button>

        </div>

      </div>

    </div>
  );
};

export default VocabularyInvadersGame;
