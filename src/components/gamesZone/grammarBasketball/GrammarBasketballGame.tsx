import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Pause, Flame, Trophy, CheckCircle2, XCircle, Target } from 'lucide-react';
import type { GradeId } from '../../../types/schema';
import type {
  GamesZoneDifficulty,
  GamesZoneAttemptRecord,
  GrammarBasketballItem,
} from '../../../types/gamesZone';
import { getQuestionsForGame } from '../../../data/gamesZone';
import { shuffleQuestionOptions } from '../../../utils/shuffle';
import { GamesZoneService } from '../../../services/gamesZoneService';
import { sounds } from '../../../services/soundEffects';

interface GrammarBasketballGameProps {
  gradeId: GradeId;
  difficulty: GamesZoneDifficulty;
  studentNumber: string;
  studentClass?: string;
  onComplete: (record: GamesZoneAttemptRecord) => void;
  onPause: () => void;
  isPaused: boolean;
  isMuted: boolean;
}

interface BallPhysics {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

// Fixed Court Geometry in 800x420 ViewBox
const COURT_WIDTH = 800;
const COURT_HEIGHT = 420;
const FLOOR_Y = 385;
const BALL_START_X = 170;
const BALL_START_Y = 320;
const BALL_RADIUS = 16;
const GRAVITY = 0.44;

// Hoop & Backboard geometry
const BACKBOARD_X = 680;
const BACKBOARD_TOP_Y = 95;
const BACKBOARD_BOTTOM_Y = 225;
const HOOP_RIM_Y = 190;
const FRONT_RIM_X = 604;
const BACK_RIM_X = 672;

export const GrammarBasketballGame: React.FC<GrammarBasketballGameProps> = ({
  gradeId,
  difficulty,
  studentNumber,
  studentClass,
  onComplete,
  onPause,
  isPaused,
  isMuted,
}) => {
  const [questions, setQuestions] = useState<GrammarBasketballItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

  // Court state
  const [isCourtActive, setIsCourtActive] = useState(false);
  const [isAiming, setIsAiming] = useState(false);
  const [dragCurrent, setDragCurrent] = useState<{ x: number; y: number } | null>(null);

  // Keyboard / Accessible aim controls
  const [aimAngle, setAimAngle] = useState(55); // degrees (optimal default arc)
  const [aimPower, setAimPower] = useState(70); // percentage (optimal default power)

  // 2D Ball Physics State
  const [ball, setBall] = useState<BallPhysics>({
    x: BALL_START_X,
    y: BALL_START_Y,
    vx: 0,
    vy: 0,
    radius: BALL_RADIUS,
  });
  const [isBallInFlight, setIsBallInFlight] = useState(false);
  const [netSwishAnim, setNetSwishAnim] = useState(false);
  const [shotFeedback, setShotFeedback] = useState<string | null>(null);

  // Telemetry
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(1);
  const [lives, setLives] = useState(3);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [basketsMade, setBasketsMade] = useState(0);

  const startTimeRef = useRef(Date.now());
  const animFrameRef = useRef<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Shot collision tracking flags for currently active flight
  const flightStateRef = useRef({
    hitBackboard: false,
    hitRim: false,
    basketScored: false,
    shotResolved: false,
  });

  // Load questions with recent history tracking & option shuffling
  useEffect(() => {
    const pool = getQuestionsForGame('grammar_basketball', gradeId, difficulty, 10, studentNumber) as GrammarBasketballItem[];
    const randomized = pool.map((q) => shuffleQuestionOptions(q));
    setQuestions(randomized);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setIsCourtActive(false);
    setIsAiming(false);
    setDragCurrent(null);
    setIsBallInFlight(false);
    setNetSwishAnim(false);
    setShotFeedback(null);
    setScore(0);
    setStreak(1);
    setLives(3);
    setCorrectCount(0);
    setIncorrectCount(0);
    setBasketsMade(0);
    setBall({
      x: BALL_START_X,
      y: BALL_START_Y,
      vx: 0,
      vy: 0,
      radius: BALL_RADIUS,
    });
    startTimeRef.current = Date.now();
  }, [gradeId, difficulty, studentNumber]);

  // Finish session
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
        attemptId: `gz_bb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        gameId: 'grammar_basketball',
        gameTitle: 'Grammar Basketball',
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

  // Advance to next question
  const advanceToNext = useCallback(
    (currentCorrect: number, currentIncorrect: number, currentScore: number) => {
      if (lives <= 0 || currentIndex + 1 >= questions.length) {
        finishGame(currentCorrect, currentIncorrect, currentScore);
      } else {
        setCurrentIndex((i) => i + 1);
        setSelectedOption(null);
        setIsAnswerSubmitted(false);
        setIsCourtActive(false);
        setIsAiming(false);
        setDragCurrent(null);
        setIsBallInFlight(false);
        setNetSwishAnim(false);
        setShotFeedback(null);
        setBall({
          x: BALL_START_X,
          y: BALL_START_Y,
          vx: 0,
          vy: 0,
          radius: BALL_RADIUS,
        });
        flightStateRef.current = {
          hitBackboard: false,
          hitRim: false,
          basketScored: false,
          shotResolved: false,
        };
      }
    },
    [currentIndex, questions.length, lives, finishGame]
  );

  // Calculate launch velocity vector from drag offset
  const getVelocityFromDrag = useCallback((drag: { x: number; y: number }) => {
    // Pull-back vector: from pointer to ball center
    const dx = BALL_START_X - drag.x;
    const dy = BALL_START_Y - drag.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 5) return { vx: 0, vy: 0 };

    const angle = Math.atan2(dy, dx);
    const clampedDist = Math.min(dist, 160);
    // Speed factor scale: maps 0..160 pull to calibrated court velocity
    const speed = clampedDist * 0.14;
    return {
      vx: Math.cos(angle) * speed,
      vy: -Math.abs(Math.sin(angle) * speed), // Always launch upward/forward
    };
  }, []);

  // Calculate launch velocity vector from Angle & Power sliders/keys
  const getVelocityFromSliders = useCallback((angleDeg: number, powerPct: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    // Map power 30..100% to calibrated court velocity
    const speed = 10 + (powerPct / 100) * 9.5;
    return {
      vx: Math.cos(rad) * speed,
      vy: -Math.sin(rad) * speed,
    };
  }, []);

  // Launch the physical shot
  const launchShot = useCallback(
    (vx: number, vy: number) => {
      if (isBallInFlight || !isCourtActive) return;

      if (!isMuted) sounds.playTap();
      setIsAiming(false);
      setDragCurrent(null);
      setIsBallInFlight(true);
      flightStateRef.current = {
        hitBackboard: false,
        hitRim: false,
        basketScored: false,
        shotResolved: false,
      };

      setBall({
        x: BALL_START_X,
        y: BALL_START_Y,
        vx,
        vy,
        radius: BALL_RADIUS,
      });
    },
    [isBallInFlight, isCourtActive, isMuted]
  );

  // 2D Physics Step Engine (Runs while isBallInFlight is true)
  useEffect(() => {
    if (!isBallInFlight || isPaused) return;

    const tick = () => {
      setBall((prev) => {
        let { x, y, vx, vy, radius } = prev;
        const flight = flightStateRef.current;

        // Apply Gravity
        vy += GRAVITY;

        // Update Position
        const nextX = x + vx;
        const nextY = y + vy;

        // 1. BACKBOARD COLLISION
        // Backboard is a vertical board around x=BACKBOARD_X between BACKBOARD_TOP_Y and BACKBOARD_BOTTOM_Y
        if (
          nextX + radius >= BACKBOARD_X &&
          x + radius < BACKBOARD_X + 16 &&
          nextY >= BACKBOARD_TOP_Y &&
          nextY <= BACKBOARD_BOTTOM_Y
        ) {
          vx = -Math.abs(vx) * 0.65; // Elastic bounce to the left
          flight.hitBackboard = true;
          if (!isMuted) sounds.playTap();
        }

        // 2. RIM COLLISIONS (Front Rim & Back Rim)
        // Front Rim point: (FRONT_RIM_X, HOOP_RIM_Y)
        const dFront = Math.hypot(nextX - FRONT_RIM_X, nextY - HOOP_RIM_Y);
        if (dFront < radius + 4) {
          // Bounce off front rim
          const nx = (nextX - FRONT_RIM_X) / dFront;
          const ny = (nextY - HOOP_RIM_Y) / dFront;
          const dot = vx * nx + vy * ny;
          vx = (vx - 1.6 * dot * nx) * 0.6;
          vy = (vy - 1.6 * dot * ny) * 0.6;
          flight.hitRim = true;
          if (!isMuted) sounds.playTap();
        }

        // Back Rim point: (BACK_RIM_X, HOOP_RIM_Y)
        const dBack = Math.hypot(nextX - BACK_RIM_X, nextY - HOOP_RIM_Y);
        if (dBack < radius + 4) {
          const nx = (nextX - BACK_RIM_X) / dBack;
          const ny = (nextY - HOOP_RIM_Y) / dBack;
          const dot = vx * nx + vy * ny;
          vx = (vx - 1.6 * dot * nx) * 0.6;
          vy = (vy - 1.6 * dot * ny) * 0.6;
          flight.hitRim = true;
          if (!isMuted) sounds.playTap();
        }

        // 3. HOOP SCORING CYLINDER
        // Ball passes downward through hoop between FRONT_RIM_X and BACK_RIM_X
        if (
          !flight.basketScored &&
          vy > 0 &&
          y <= HOOP_RIM_Y &&
          nextY >= HOOP_RIM_Y &&
          nextX > FRONT_RIM_X + 6 &&
          nextX < BACK_RIM_X - 6
        ) {
          flight.basketScored = true;
          setNetSwishAnim(true);

          // Dampen ball downward velocity through net
          vx *= 0.25;
          vy *= 0.55;

          let bonus = 50 * streak;
          let feedbackMsg = `SWISH! CLEAN 3-POINTER! +${bonus} PTS 🏀🔥`;

          if (flight.hitBackboard) {
            bonus = 30 * streak;
            feedbackMsg = `BANK SHOT OFF GLASS! +${bonus} PTS! 🎯`;
          } else if (flight.hitRim) {
            bonus = 25 * streak;
            feedbackMsg = `RATTLE IN! GREAT FINISH! +${bonus} PTS! 👏`;
          }

          if (!isMuted) sounds.playSuccess();
          setBasketsMade((b) => b + 1);
          setShotFeedback(feedbackMsg);
          setScore((s) => s + bonus);
        }

        // 4. FLOOR BOUNCE & SHOT RESOLUTION
        if (nextY + radius >= FLOOR_Y) {
          y = FLOOR_Y - radius;
          vy = -Math.abs(vy) * 0.45; // Floor bounce
          vx *= 0.7;

          if (!flight.shotResolved) {
            flight.shotResolved = true;

            if (!flight.basketScored) {
              // Missed shot
              const missFeedback = flight.hitRim
                ? 'RIM OUT! Nice aim — Grammar point awarded! 🏀'
                : flight.hitBackboard
                ? 'OFF THE BACKBOARD! Good attempt — Grammar point awarded! 🎯'
                : 'AIRBALL! Grammar point awarded! Try more arc next shot! 👏';

              if (!isMuted) sounds.playTap();
              setShotFeedback(missFeedback);
            }

            // Conclude flight and advance
            setTimeout(() => {
              setIsBallInFlight(false);
              advanceToNext(correctCount, incorrectCount, score);
            }, 1400);
          }
        } else {
          x = nextX;
          y = nextY;
        }

        // Out-of-bounds safety check
        if ((x > COURT_WIDTH + 80 || x < -60 || y > COURT_HEIGHT + 60) && !flight.shotResolved) {
          flight.shotResolved = true;
          if (!flight.basketScored) {
            setShotFeedback('MISSED SHOT! Grammar point awarded! 👏');
          }
          setTimeout(() => {
            setIsBallInFlight(false);
            advanceToNext(correctCount, incorrectCount, score);
          }, 1100);
        }

        return { x, y, vx, vy, radius };
      });

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [
    isBallInFlight,
    isPaused,
    isMuted,
    streak,
    score,
    correctCount,
    incorrectCount,
    advanceToNext,
  ]);

  // Answer option selection
  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted || isCourtActive) return;

    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    setSelectedOption(idx);
    setIsAnswerSubmitted(true);

    const isCorrect = idx === currentQ.correctOptionIndex;

    if (isCorrect) {
      if (!isMuted) sounds.playSuccess();
      const basePoints = 100 * streak;
      const nextScore = score + basePoints;
      setScore(nextScore);
      const nextCorrect = correctCount + 1;
      setCorrectCount(nextCorrect);
      setStreak((s) => Math.min(5, s + 1));

      // Unlock Interactive Shooting Court
      setTimeout(() => {
        setIsCourtActive(true);
      }, 700);
    } else {
      if (!isMuted) sounds.playError();
      setStreak(1);
      const nextIncorrect = incorrectCount + 1;
      setIncorrectCount(nextIncorrect);
      const nextLives = lives - 1;
      setLives(nextLives);

      // Show error feedback with pedagogical explanation
      setShotFeedback(`Incorrect Answer! Correct: "${currentQ.options[currentQ.correctOptionIndex]}"`);

      setTimeout(() => {
        advanceToNext(correctCount, nextIncorrect, score);
      }, 2200);
    }
  };

  // Keyboard navigation & shooting
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused) return;

      if (!isCourtActive && !isAnswerSubmitted) {
        if (e.key === '1') handleSelectOption(0);
        else if (e.key === '2') handleSelectOption(1);
        else if (e.key === '3') handleSelectOption(2);
        else if (e.key === '4') handleSelectOption(3);
      } else if (isCourtActive && !isBallInFlight) {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setAimAngle((a) => Math.min(80, a + 2));
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          setAimAngle((a) => Math.max(25, a - 2));
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          setAimPower((p) => Math.min(100, p + 2));
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          setAimPower((p) => Math.max(30, p - 2));
        } else if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          const { vx, vy } = getVelocityFromSliders(aimAngle, aimPower);
          launchShot(vx, vy);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isPaused,
    isCourtActive,
    isAnswerSubmitted,
    isBallInFlight,
    aimAngle,
    aimPower,
    getVelocityFromSliders,
    launchShot,
  ]);

  // Pointer Drag Handlers (Mouse & Touch for smartboards)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isCourtActive || isBallInFlight) return;

    // Get SVG coordinates
    if (!svgRef.current) return;
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svgRef.current.getScreenCTM()?.inverse());

    // Check if pointer is near the ball (within 60px radius)
    const distToBall = Math.hypot(svgP.x - BALL_START_X, svgP.y - BALL_START_Y);
    if (distToBall <= 70) {
      setIsAiming(true);
      setDragCurrent({ x: svgP.x, y: svgP.y });
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isAiming || !svgRef.current) return;
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svgRef.current.getScreenCTM()?.inverse());
    setDragCurrent({ x: svgP.x, y: svgP.y });
  };

  const handlePointerUp = () => {
    if (!isAiming) return;
    setIsAiming(false);

    if (dragCurrent) {
      const { vx, vy } = getVelocityFromDrag(dragCurrent);
      if (Math.hypot(vx, vy) > 5) {
        launchShot(vx, vy);
      }
    }
    setDragCurrent(null);
  };

  // Trajectory Preview Points Calculator (simulates 26 physics steps)
  const previewPoints = React.useMemo(() => {
    if (!isCourtActive || isBallInFlight) return [];

    let launchVx = 0;
    let launchVy = 0;

    if (isAiming && dragCurrent) {
      const v = getVelocityFromDrag(dragCurrent);
      launchVx = v.vx;
      launchVy = v.vy;
    } else {
      const v = getVelocityFromSliders(aimAngle, aimPower);
      launchVx = v.vx;
      launchVy = v.vy;
    }

    if (Math.hypot(launchVx, launchVy) < 4) return [];

    const pts: { x: number; y: number }[] = [];
    let px = BALL_START_X;
    let py = BALL_START_Y;
    let pvx = launchVx;
    let pvy = launchVy;

    for (let step = 0; step < 26; step++) {
      pvy += GRAVITY;
      px += pvx;
      py += pvy;
      if (py >= FLOOR_Y || px >= BACKBOARD_X) {
        pts.push({ x: px, y: py });
        break;
      }
      pts.push({ x: px, y: py });
    }

    return pts;
  }, [
    isCourtActive,
    isBallInFlight,
    isAiming,
    dragCurrent,
    aimAngle,
    aimPower,
    getVelocityFromDrag,
    getVelocityFromSliders,
  ]);

  const currentQ = questions[currentIndex];
  if (!currentQ) return null;

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-gradient-to-b from-amber-50 via-sky-50 to-amber-100 rounded-3xl border-3 border-amber-300 shadow-2xl overflow-hidden flex flex-col select-none">
      
      {/* Top Header & HUD */}
      <div className="bg-white/95 backdrop-blur-md px-6 py-3 border-b-2 border-amber-200 flex items-center justify-between z-20">
        
        {/* Left: Round & Lives */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-300">
            <span className="text-xl">🏀</span>
            <span className="font-mono font-black text-amber-900 text-sm">
              {currentIndex + 1} / {questions.length}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {[1, 2, 3].map((heart) => (
              <span
                key={heart}
                className={`text-lg transition-transform ${
                  heart <= lives ? 'scale-100 opacity-100' : 'scale-75 opacity-30 grayscale'
                }`}
              >
                🏀
              </span>
            ))}
          </div>
        </div>

        {/* Center: Topic Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-xs font-black text-amber-900">
          <Target className="w-3.5 h-3.5 text-orange-600" />
          <span>{currentQ.grammarTopic}</span>
        </div>

        {/* Right: Score, Baskets, Streak, Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 bg-orange-100 px-2.5 py-1 rounded-xl border border-orange-300 text-orange-900 font-mono text-xs font-bold">
            <span>Baskets:</span>
            <strong className="text-orange-950 font-black">{basketsMade}</strong>
          </div>

          <div className="flex items-center gap-1 text-amber-900 font-mono font-black text-sm bg-amber-100/80 px-2.5 py-1 rounded-xl border border-amber-300">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>{score}</span>
          </div>

          {streak > 1 && (
            <div className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xs px-2.5 py-1 rounded-full animate-bounce shadow-sm">
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

      {/* Question Card Header (Always Clear and Readable) */}
      <div className="p-4 md:px-6 bg-white border-b-2 border-amber-200 z-10 space-y-3">
        <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-amber-800">
          <span>Grammar Free-Throw • Select the correct English option</span>
          <span className="font-mono text-slate-500">Correct Answer: +100 Base Score</span>
        </div>

        <p className="text-base sm:text-lg md:text-xl font-black text-slate-900 leading-snug">
          {currentQ.prompt}
        </p>

        {/* 4 Interactive Answer Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrectOpt = idx === currentQ.correctOptionIndex;
            let btnClass = 'bg-slate-50 border-slate-200 text-slate-800 hover:border-amber-400 hover:bg-amber-50/50';

            if (isAnswerSubmitted) {
              if (isCorrectOpt) {
                btnClass = 'bg-emerald-100 border-emerald-500 text-emerald-950 shadow-md font-black scale-[1.01]';
              } else if (isSelected && !isCorrectOpt) {
                btnClass = 'bg-rose-100 border-rose-500 text-rose-950 shadow-md font-black';
              } else {
                btnClass = 'bg-slate-100 border-slate-200 text-slate-400 opacity-50';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={isAnswerSubmitted}
                onClick={() => handleSelectOption(idx)}
                className={`py-2.5 px-3.5 rounded-xl border-2 text-left font-bold text-sm transition-all flex items-center justify-between group active:scale-[0.98] ${btnClass}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-amber-200/80 flex items-center justify-center font-mono text-xs font-black text-amber-900">
                    {idx + 1}
                  </span>
                  <span>{opt}</span>
                </div>

                {isAnswerSubmitted && isCorrectOpt && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 animate-bounce" />
                )}
                {isAnswerSubmitted && isSelected && !isCorrectOpt && (
                  <XCircle className="w-4 h-4 text-rose-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* INTERACTIVE 2D BASKETBALL COURT (Real Projectile Physics) */}
      <div className="relative flex-1 min-h-[360px] bg-gradient-to-b from-sky-100 via-amber-50 to-orange-100 overflow-hidden flex flex-col justify-between">
        
        {/* SVG Physics Viewport */}
        <svg
          ref={svgRef}
          viewBox={`0 0 ${COURT_WIDTH} ${COURT_HEIGHT}`}
          className="w-full h-full cursor-crosshair touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Defs for gradients & shadow filters */}
          <defs>
            <radialGradient id="ballGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="50%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#9a3412" />
            </radialGradient>
            <linearGradient id="backboardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.7" />
            </linearGradient>
            <linearGradient id="woodFloor" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>

          {/* Hardwood Court Floor */}
          <rect x="0" y={FLOOR_Y} width={COURT_WIDTH} height={COURT_HEIGHT - FLOOR_Y} fill="url(#woodFloor)" />
          <line x1="0" y1={FLOOR_Y} x2={COURT_WIDTH} y2={FLOOR_Y} stroke="#b45309" strokeWidth="4" />
          
          {/* Court lines */}
          <ellipse cx="640" cy={FLOOR_Y} rx="90" ry="25" fill="none" stroke="#ffffff" strokeWidth="3" opacity="0.7" />
          <line x1="450" y1={FLOOR_Y} x2="450" y2={COURT_HEIGHT} stroke="#ffffff" strokeWidth="3" opacity="0.6" />

          {/* Backboard Pole & Support Structure */}
          <rect x="710" y="80" width="16" height={FLOOR_Y - 80} fill="#64748b" />
          <line x1="680" y1="160" x2="710" y2="140" stroke="#475569" strokeWidth="6" />

          {/* Glass Backboard */}
          <rect
            x={BACKBOARD_X}
            y={BACKBOARD_TOP_Y}
            width="12"
            height={BACKBOARD_BOTTOM_Y - BACKBOARD_TOP_Y}
            rx="3"
            fill="url(#backboardGrad)"
            stroke="#ea580c"
            strokeWidth="3"
          />
          {/* Backboard Target Square */}
          <rect
            x={BACKBOARD_X - 2}
            y="145"
            width="4"
            height="50"
            fill="#ea580c"
          />

          {/* Net (Ripples when basket made) */}
          <g className={netSwishAnim ? 'animate-pulse' : ''}>
            <polygon
              points={`${FRONT_RIM_X + 4},${HOOP_RIM_Y + 2} ${FRONT_RIM_X + 16},${HOOP_RIM_Y + 48} ${BACK_RIM_X - 16},${HOOP_RIM_Y + 48} ${BACK_RIM_X - 4},${HOOP_RIM_Y + 2}`}
              fill="#ffffff"
              fillOpacity="0.55"
              stroke="#ffffff"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
            <line x1={FRONT_RIM_X + 18} y1={HOOP_RIM_Y + 2} x2={BACK_RIM_X - 20} y2={HOOP_RIM_Y + 48} stroke="#cbd5e1" strokeWidth="1.5" />
            <line x1={BACK_RIM_X - 18} y1={HOOP_RIM_Y + 2} x2={FRONT_RIM_X + 20} y2={HOOP_RIM_Y + 48} stroke="#cbd5e1" strokeWidth="1.5" />
          </g>

          {/* Basketball Hoop Rim (Front & Back) */}
          <line
            x1={FRONT_RIM_X}
            y1={HOOP_RIM_Y}
            x2={BACK_RIM_X}
            y2={HOOP_RIM_Y}
            stroke="#ea580c"
            strokeWidth="7"
            strokeLinecap="round"
          />
          {/* Metal Net Hooks on Rim */}
          <circle cx={FRONT_RIM_X} cy={HOOP_RIM_Y} r="4" fill="#c2410c" />
          <circle cx={BACK_RIM_X} cy={HOOP_RIM_Y} r="4" fill="#c2410c" />

          {/* TRAJECTORY PREVIEW DOTS (Drawn while aiming) */}
          {previewPoints.map((pt, i) => (
            <circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r={i % 2 === 0 ? 3.5 : 2}
              fill="#f97316"
              opacity={Math.max(0.2, 1 - i / previewPoints.length)}
            />
          ))}

          {/* Slingshot Pull Vector Line */}
          {isAiming && dragCurrent && (
            <line
              x1={BALL_START_X}
              y1={BALL_START_Y}
              x2={dragCurrent.x}
              y2={dragCurrent.y}
              stroke="#ea580c"
              strokeWidth="3"
              strokeDasharray="4 4"
            />
          )}

          {/* THE BASKETBALL (Interactive draggable or physics-simulated) */}
          <g transform={`translate(${ball.x}, ${ball.y})`}>
            {/* Ball Shadow on Floor */}
            {isBallInFlight && (
              <ellipse
                cx="0"
                cy={FLOOR_Y - ball.y}
                rx={Math.max(4, BALL_RADIUS * (1 - (FLOOR_Y - ball.y) / 400))}
                ry={Math.max(2, (BALL_RADIUS / 2) * (1 - (FLOOR_Y - ball.y) / 400))}
                fill="#000000"
                opacity="0.25"
              />
            )}

            {/* Ball Sphere */}
            <circle cx="0" cy="0" r={ball.radius} fill="url(#ballGrad)" stroke="#7c2d12" strokeWidth="1.5" />
            {/* Ball Ribs */}
            <path d={`M ${-ball.radius} 0 Q 0 ${-ball.radius * 0.45} ${ball.radius} 0`} fill="none" stroke="#7c2d12" strokeWidth="1.2" />
            <path d={`M ${-ball.radius} 0 Q 0 ${ball.radius * 0.45} ${ball.radius} 0`} fill="none" stroke="#7c2d12" strokeWidth="1.2" />
            <line x1="0" y1={-ball.radius} x2="0" y2={ball.radius} stroke="#7c2d12" strokeWidth="1.2" />

            {/* Glowing Target Ring on Ball when ready to shoot */}
            {isCourtActive && !isBallInFlight && !isAiming && (
              <circle cx="0" cy="0" r={ball.radius + 6} fill="none" stroke="#f97316" strokeWidth="2.5" strokeDasharray="5 3" className="animate-spin" />
            )}
          </g>

          {/* Aim Prompt Over Ball */}
          {isCourtActive && !isBallInFlight && !isAiming && (
            <text x={BALL_START_X} y={BALL_START_Y - 28} textAnchor="middle" fill="#9a3412" fontSize="11" fontWeight="900">
              DRAG BALL TO AIM ➔
            </text>
          )}
        </svg>

        {/* FEEDBACK OVERLAY BANNER */}
        {shotFeedback && (
          <div className="absolute inset-x-4 top-1/4 -translate-y-1/2 z-30 flex flex-col items-center justify-center">
            <div className="px-6 py-3.5 rounded-2xl bg-white/95 border-2 border-orange-400 shadow-2xl text-center backdrop-blur-md animate-bounce max-w-md">
              <p className="text-base sm:text-lg font-black text-amber-900 font-display">
                {shotFeedback}
              </p>
              {currentQ.explanation && !isCourtActive && (
                <p className="text-xs text-slate-600 font-medium mt-1">
                  {currentQ.explanation}
                </p>
              )}
            </div>
          </div>
        )}

        {/* BOTTOM ACCESSIBLE KEYBOARD / SMARTBOARD SHOOTING CONSOLE */}
        {isCourtActive && !isBallInFlight && (
          <div className="p-3 bg-white/90 border-t-2 border-amber-200 flex flex-wrap items-center justify-between gap-3 z-10 backdrop-blur-sm">
            
            {/* Angle & Power Controls (Keyboard / Touch friendly) */}
            <div className="flex items-center gap-4 text-xs font-bold text-slate-700">
              <div className="flex items-center gap-1.5">
                <span className="text-amber-900 font-black">Angle:</span>
                <button
                  type="button"
                  onClick={() => setAimAngle((a) => Math.max(25, a - 3))}
                  className="w-6 h-6 rounded-lg bg-amber-100 hover:bg-amber-200 border border-amber-300 font-black flex items-center justify-center"
                >
                  -
                </button>
                <span className="font-mono font-black text-slate-900 w-8 text-center">{aimAngle}°</span>
                <button
                  type="button"
                  onClick={() => setAimAngle((a) => Math.min(80, a + 3))}
                  className="w-6 h-6 rounded-lg bg-amber-100 hover:bg-amber-200 border border-amber-300 font-black flex items-center justify-center"
                >
                  +
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-amber-900 font-black">Power:</span>
                <button
                  type="button"
                  onClick={() => setAimPower((p) => Math.max(30, p - 4))}
                  className="w-6 h-6 rounded-lg bg-amber-100 hover:bg-amber-200 border border-amber-300 font-black flex items-center justify-center"
                >
                  -
                </button>
                <span className="font-mono font-black text-slate-900 w-9 text-center">{aimPower}%</span>
                <button
                  type="button"
                  onClick={() => setAimPower((p) => Math.min(100, p + 4))}
                  className="w-6 h-6 rounded-lg bg-amber-100 hover:bg-amber-200 border border-amber-300 font-black flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Big Launch Button */}
            <button
              type="button"
              onClick={() => {
                const { vx, vy } = getVelocityFromSliders(aimAngle, aimPower);
                launchShot(vx, vy);
              }}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all flex items-center gap-2"
            >
              <span>🏀 SHOOT BALL (SPACE / TAP)</span>
            </button>

          </div>
        )}

      </div>

    </div>
  );
};

export default GrammarBasketballGame;
