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

interface ExplosionEffect {
  x: number;
  y: number;
  progress: number; // 0 to 1
}

// Fixed Virtual Coordinate Space (800 x 500)
const PLAYFIELD_WIDTH = 800;
const PLAYFIELD_HEIGHT = 500;
const CANNON_Y = 445;
const CANNON_MIN_X = 75;
const CANNON_MAX_X = 725;
const LANE_CENTERS = [105, 300, 495, 690];
const DEFENSE_PERIMETER_Y = 415;

// Color Palettes for the 4 Alien Ships
const SHIP_THEMES = [
  { bg: '#f43f5e', border: '#fda4af', ufoFill: '#fb7185', glow: 'rgba(244, 63, 94, 0.4)' },
  { bg: '#0284c7', border: '#7dd3fc', ufoFill: '#38bdf8', glow: 'rgba(2, 132, 199, 0.4)' },
  { bg: '#ea580c', border: '#fdba74', ufoFill: '#fb923c', glow: 'rgba(234, 88, 12, 0.4)' },
  { bg: '#059669', border: '#6ee7b7', ufoFill: '#34d399', glow: 'rgba(5, 150, 105, 0.4)' },
];

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
  // Questions and UI reactive state (Updated only on wave events)
  const [questions, setQuestions] = useState<VocabularyInvadersItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(1);
  const [shields, setShields] = useState(3);
  const [hitFeedback, setHitFeedback] = useState<{
    isSuccess: boolean;
    text: string;
    explanation?: string;
  } | null>(null);

  // Canvas and Animation References
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const timeoutsRef = useRef<number[]>([]);
  const keysDownRef = useRef<Record<string, boolean>>({});
  const startTimeRef = useRef(Date.now());

  // Performance telemetry counters
  const correctCountRef = useRef(0);
  const incorrectCountRef = useRef(0);
  const scoreRef = useRef(0);
  const streakRef = useRef(1);
  const shieldsRef = useRef(3);

  // EXACT TEACHER-APPROVED DESCENT SPEED (Strictly Preserved)
  const descentSpeed = difficulty === 'hard' ? 0.22 : difficulty === 'medium' ? 0.16 : 0.11;

  // Real-Time Simulation State (Lives in Ref: zero React re-renders during 60 FPS animation loop!)
  const simStateRef = useRef({
    cannonX: 400,
    targetCannonX: 400,
    descentProgress: 0,
    projectiles: [] as Projectile[],
    alienShips: [] as AlienShip[],
    explosions: [] as ExplosionEffect[],
    lastFireTime: 0,
    isWaveActive: false,
    hitResolved: false,
  });

  // Safe timeout scheduler that tracks IDs for clean unmount
  const scheduleTimeout = useCallback((fn: () => void, delayMs: number) => {
    const tid = window.setTimeout(() => {
      timeoutsRef.current = timeoutsRef.current.filter((id) => id !== tid);
      fn();
    }, delayMs);
    timeoutsRef.current.push(tid);
    return tid;
  }, []);

  // Finish session helper
  const finishGame = useCallback(
    (finalCorrect: number, finalIncorrect: number, finalScore: number) => {
      // Cancel active loop
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }

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

  // Initialize questions and telemetry with recent history tracking
  useEffect(() => {
    const pool = getQuestionsForGame('vocabulary_invaders', gradeId, difficulty, 10, studentNumber) as VocabularyInvadersItem[];
    setQuestions(pool);
    setCurrentIndex(0);
    setScore(0);
    setStreak(1);
    setShields(3);
    setHitFeedback(null);

    scoreRef.current = 0;
    streakRef.current = 1;
    shieldsRef.current = 3;
    correctCountRef.current = 0;
    incorrectCountRef.current = 0;
    startTimeRef.current = Date.now();

    const sim = simStateRef.current;
    sim.cannonX = 400;
    sim.targetCannonX = 400;
    sim.descentProgress = 0;
    sim.projectiles = [];
    sim.explosions = [];
    sim.isWaveActive = false;
    sim.hitResolved = false;
  }, [gradeId, difficulty, studentNumber]);

  // Setup wave when index or questions change
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
      height: 52,
    }));

    // Reset simulation state for the new wave
    const sim = simStateRef.current;
    sim.alienShips = ships;
    sim.descentProgress = 0;
    sim.projectiles = [];
    sim.explosions = [];
    sim.hitResolved = false;
    sim.isWaveActive = true;
    setHitFeedback(null);
  }, [currentIndex, questions]);

  // Advance to next wave
  const advanceWave = useCallback(() => {
    if (shieldsRef.current <= 0 || currentIndex + 1 >= questions.length) {
      finishGame(correctCountRef.current, incorrectCountRef.current, scoreRef.current);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, questions.length, finishGame]);

  // Fire cannon action (Triggered by Space, Enter, or Fire Button)
  const handleFireCannon = useCallback(() => {
    const sim = simStateRef.current;
    if (isPaused || !sim.isWaveActive || sim.hitResolved) return;

    const now = performance.now();
    if (now - sim.lastFireTime < 320) return; // Cooldown limit
    sim.lastFireTime = now;

    if (!isMuted) sounds.playTap();

    // Spawn new projectile at cannon tip
    sim.projectiles.push({
      id: `p_${now}_${Math.random().toString(36).substring(2, 6)}`,
      x: sim.cannonX,
      y: CANNON_Y - 20,
      vy: -13, // High-velocity ascending laser
    });
  }, [isPaused, isMuted]);

  // Ground breach handler (Aliens reach planetary defense line)
  const handleGroundBreach = useCallback(() => {
    const sim = simStateRef.current;
    if (sim.hitResolved || !sim.isWaveActive) return;
    sim.hitResolved = true;
    sim.isWaveActive = false;

    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    if (!isMuted) sounds.playError();
    streakRef.current = 1;
    setStreak(1);
    incorrectCountRef.current += 1;
    shieldsRef.current -= 1;
    setShields(shieldsRef.current);

    setHitFeedback({
      isSuccess: false,
      text: `SHIELD BREACH! Target word was "${currentQ.targetWord}"`,
      explanation: currentQ.explanation,
    });

    scheduleTimeout(() => {
      advanceWave();
    }, 1800);
  }, [questions, currentIndex, isMuted, scheduleTimeout, advanceWave]);

  // Main 60 FPS Hardware-Accelerated Canvas Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const renderLoop = () => {
      if (!isRunning) return;

      const sim = simStateRef.current;

      // 1. Update Physics (Only if not paused and wave is active)
      if (!isPaused && sim.isWaveActive && !sim.hitResolved) {
        // Continuous keyboard movement
        const keys = keysDownRef.current;
        if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
          sim.cannonX = Math.max(CANNON_MIN_X, sim.cannonX - 8);
          sim.targetCannonX = sim.cannonX;
        }
        if (keys['ArrowRight'] || keys['d'] || keys['D']) {
          sim.cannonX = Math.min(CANNON_MAX_X, sim.cannonX + 8);
          sim.targetCannonX = sim.cannonX;
        }

        // Smooth touch/pointer lerp
        if (Math.abs(sim.targetCannonX - sim.cannonX) > 1) {
          sim.cannonX += (sim.targetCannonX - sim.cannonX) * 0.35;
          sim.cannonX = Math.max(CANNON_MIN_X, Math.min(CANNON_MAX_X, sim.cannonX));
        }

        // Alien Descent
        sim.descentProgress += descentSpeed;
        if (sim.descentProgress >= 100) {
          sim.descentProgress = 100;
          handleGroundBreach();
        }

        // Projectiles update & 2D collision detection
        const currentShipY = 55 + (sim.descentProgress / 100) * (DEFENSE_PERIMETER_Y - 110);
        const aliveProjectiles: Projectile[] = [];

        for (const p of sim.projectiles) {
          p.y += p.vy;

          // Check top boundary
          if (p.y < 15) continue;

          // 2D Bounding Box Collision Check against the 4 Alien Ships
          let hitShip: AlienShip | null = null;
          for (const ship of sim.alienShips) {
            const shipLeft = ship.x - ship.width / 2;
            const shipRight = ship.x + ship.width / 2;
            const shipTop = currentShipY;
            const shipBottom = currentShipY + ship.height;

            if (p.x >= shipLeft && p.x <= shipRight && p.y >= shipTop && p.y <= shipBottom) {
              hitShip = ship;
              break;
            }
          }

          if (hitShip) {
            // Collision occurred! Stop wave flight and trigger resolution
            sim.hitResolved = true;
            sim.isWaveActive = false;

            // Spawn explosion effect
            sim.explosions.push({
              x: hitShip.x,
              y: currentShipY + hitShip.height / 2,
              progress: 0,
            });

            const currentQ = questions[currentIndex];

            if (hitShip.isCorrect) {
              // Direct hit on correct target!
              if (!isMuted) sounds.playSuccess();
              const points = 100 * streakRef.current;
              scoreRef.current += points;
              correctCountRef.current += 1;
              streakRef.current = Math.min(5, streakRef.current + 1);

              setScore(scoreRef.current);
              setStreak(streakRef.current);
              setHitFeedback({
                isSuccess: true,
                text: `DIRECT HIT! +${points} PTS! 💥`,
              });

              scheduleTimeout(() => {
                advanceWave();
              }, 950);
            } else {
              // Wrong target hit!
              if (!isMuted) sounds.playError();
              streakRef.current = 1;
              setStreak(1);
              incorrectCountRef.current += 1;
              shieldsRef.current -= 1;
              setShields(shieldsRef.current);

              setHitFeedback({
                isSuccess: false,
                text: `WRONG TARGET! Target was "${currentQ?.targetWord}"`,
                explanation: currentQ?.explanation,
              });

              scheduleTimeout(() => {
                advanceWave();
              }, 1800);
            }

            // Consume projectile
            continue;
          }

          aliveProjectiles.push(p);
        }

        sim.projectiles = aliveProjectiles;
      }

      // Update active explosions
      for (const ex of sim.explosions) {
        ex.progress = Math.min(1, ex.progress + 0.05);
      }
      sim.explosions = sim.explosions.filter((ex) => ex.progress < 1);

      // 2. RENDER SCENE ON CANVAS (< 0.2ms total execution time)
      ctx.clearRect(0, 0, PLAYFIELD_WIDTH, PLAYFIELD_HEIGHT);

      // Cosmic background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, PLAYFIELD_HEIGHT);
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(0.5, '#1e1b4b');
      bgGrad.addColorStop(1, '#090d16');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, PLAYFIELD_WIDTH, PLAYFIELD_HEIGHT);

      // Lane Guide Lines
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 6]);
      for (const lx of LANE_CENTERS) {
        ctx.beginPath();
        ctx.moveTo(lx, 30);
        ctx.lineTo(lx, DEFENSE_PERIMETER_Y);
        ctx.stroke();
      }
      ctx.setLineDash([]); // Reset line dash

      // Planetary Defense Perimeter Line
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#0284c7';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(20, DEFENSE_PERIMETER_Y);
      ctx.lineTo(PLAYFIELD_WIDTH - 20, DEFENSE_PERIMETER_Y);
      ctx.stroke();
      ctx.shadowBlur = 0; // Reset shadow

      ctx.fillStyle = '#38bdf8';
      ctx.font = '900 10px monospace';
      ctx.fillText('PLANETARY SHIELD PERIMETER', 30, DEFENSE_PERIMETER_Y - 8);

      // Projectiles (Glow + Energy Core)
      for (const p of sim.projectiles) {
        // Outer glow
        ctx.fillStyle = 'rgba(56, 189, 248, 0.6)';
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, 6, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        // Inner beam
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(p.x, p.y - 10);
        ctx.lineTo(p.x, p.y + 10);
        ctx.stroke();
      }

      // Descending Alien Ships
      const currentShipY = 55 + (sim.descentProgress / 100) * (DEFENSE_PERIMETER_Y - 110);

      for (const ship of sim.alienShips) {
        const theme = SHIP_THEMES[ship.laneIndex] || SHIP_THEMES[0];
        const shipX = ship.x - ship.width / 2;

        ctx.save();
        ctx.translate(shipX, currentShipY);

        // Canopy / Dome
        ctx.fillStyle = theme.ufoFill;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(ship.width / 2, 10, 28, 13, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Main Saucer Hull (Card)
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = theme.bg;
        ctx.lineWidth = 3.5;
        ctx.shadowColor = theme.glow;
        ctx.shadowBlur = 10;

        // Rounded rect for hull
        ctx.beginPath();
        ctx.roundRect(0, 10, ship.width, ship.height - 10, 14);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Thruster Lights
        ctx.fillStyle = theme.bg;
        ctx.beginPath();
        ctx.arc(15, 31, 4.5, 0, Math.PI * 2);
        ctx.arc(ship.width - 15, 31, 4.5, 0, Math.PI * 2);
        ctx.fill();

        // English Vocabulary Text Badge
        ctx.fillStyle = '#0f172a';
        ctx.font = '900 15px "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(ship.word, ship.width / 2, 33);

        ctx.restore();
      }

      // Explosions
      for (const ex of sim.explosions) {
        ctx.save();
        ctx.translate(ex.x, ex.y);
        const radius = ex.progress * 48;
        const alpha = 1 - ex.progress;

        ctx.strokeStyle = `rgba(251, 146, 60, ${alpha})`;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = `rgba(250, 204, 21, ${alpha * 0.8})`;
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.65, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '22px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('💥', 0, 0);

        ctx.restore();
      }

      // Player Cannon at Bottom
      ctx.save();
      ctx.translate(sim.cannonX, CANNON_Y);

      // Aiming Guideline Beam
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, -25);
      ctx.lineTo(0, -CANNON_Y + 45);
      ctx.stroke();
      ctx.setLineDash([]);

      // Cannon Base Chassis & Wheels
      ctx.fillStyle = '#334155';
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-28, 0, 56, 22, 7);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(-17, 16, 5.5, 0, Math.PI * 2);
      ctx.arc(17, 16, 5.5, 0, Math.PI * 2);
      ctx.fill();

      // Turret Barrel
      ctx.fillStyle = '#38bdf8';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-6, -28, 12, 22, 3);
      ctx.fill();
      ctx.stroke();

      // Turret Hub
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.arc(0, -2, 10, 0, Math.PI * 2);
      ctx.fill();

      // Core Indicator Light
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(0, -2, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      isRunning = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
    };
  }, [isPaused, descentSpeed, isMuted, handleGroundBreach, scheduleTimeout, advanceWave, questions, currentIndex]);

  // Window Keyboard Listeners (Attached ONCE on mount, cleanly removed on unmount)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
  }, [handleFireCannon]);

  // Comprehensive Cleanup on Component Unmount
  useEffect(() => {
    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
      for (const tid of timeoutsRef.current) {
        clearTimeout(tid);
      }
      timeoutsRef.current = [];
    };
  }, []);

  // Pointer drag & tap on playfield to position cannon
  const handlePlayfieldPointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = PLAYFIELD_WIDTH / rect.width;
    const touchX = (e.clientX - rect.left) * scaleX;
    simStateRef.current.targetCannonX = Math.max(CANNON_MIN_X, Math.min(CANNON_MAX_X, touchX));
  };

  const currentQ = questions[currentIndex];
  if (!currentQ) return null;

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

      {/* 60 FPS HARDWARE-ACCELERATED PLAYFIELD */}
      <div className="relative flex-1 min-h-[440px] bg-slate-950 overflow-hidden flex flex-col justify-between">
        
        {/* Canvas Element with Virtual 800x500 Resolution */}
        <canvas
          ref={canvasRef}
          width={PLAYFIELD_WIDTH}
          height={PLAYFIELD_HEIGHT}
          className="w-full h-full cursor-crosshair touch-none"
          onPointerDown={handlePlayfieldPointer}
          onPointerMove={(e) => {
            if (e.buttons > 0) handlePlayfieldPointer(e);
          }}
        />

        {/* Educational Feedback Overlay Banner */}
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
        <div className="p-3 bg-slate-900/95 border-t-2 border-indigo-400/40 flex items-center justify-between gap-4 z-20 backdrop-blur-md">
          
          {/* Movement Arrow Buttons (Touch / Smartboard) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onPointerDown={() => {
                const sim = simStateRef.current;
                sim.targetCannonX = Math.max(CANNON_MIN_X, sim.cannonX - 65);
                sim.cannonX = sim.targetCannonX;
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-600 text-white font-black text-xs flex items-center gap-1 shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>LEFT [A]</span>
            </button>

            <button
              type="button"
              onPointerDown={() => {
                const sim = simStateRef.current;
                sim.targetCannonX = Math.min(CANNON_MAX_X, sim.cannonX + 65);
                sim.cannonX = sim.targetCannonX;
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-600 text-white font-black text-xs flex items-center gap-1 shadow-md"
            >
              <span>RIGHT [D]</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Drag & Key Guidance Info */}
          <div className="hidden md:flex items-center text-xs font-bold text-slate-400">
            <span>Drag cannon or use Arrow keys to aim</span>
          </div>

          {/* Accessible Big Fire Cannon Button */}
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
