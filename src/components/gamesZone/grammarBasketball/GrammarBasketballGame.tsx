import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Pause, Flame, Trophy, CheckCircle2, XCircle } from 'lucide-react';
import type { GradeId } from '../../../types/schema';
import type {
  GamesZoneDifficulty,
  GamesZoneAttemptRecord,
  GrammarBasketballItem,
} from '../../../types/gamesZone';
import { getQuestionsForGame } from '../../../data/gamesZone';
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

type ShotQuality = 'swish' | 'bank' | 'rim_bounce' | 'airball';

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

  // Court & Shooting State
  const [isCourtActive, setIsCourtActive] = useState(false);
  const [meterValue, setMeterValue] = useState(50); // 0 to 100
  const [meterDirection, setMeterDirection] = useState<1 | -1>(1);
  const [isBallInFlight, setIsBallInFlight] = useState(false);
  const [ballProgress, setBallProgress] = useState(0); // 0 to 1
  const [shotQuality, setShotQuality] = useState<ShotQuality | null>(null);
  const [shotFeedback, setShotFeedback] = useState<string | null>(null);

  // Performance telemetry
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(1);
  const [lives, setLives] = useState(3);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [basketsMade, setBasketsMade] = useState(0);

  const startTimeRef = useRef(Date.now());
  const animFrameRef = useRef<number | null>(null);
  const meterSpeed = difficulty === 'hard' ? 1.6 : difficulty === 'medium' ? 1.2 : 0.9;

  // Initialize questions
  useEffect(() => {
    const pool = getQuestionsForGame('grammar_basketball', gradeId, difficulty, 10) as GrammarBasketballItem[];
    setQuestions(pool);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setIsCourtActive(false);
    setIsBallInFlight(false);
    setBallProgress(0);
    setShotQuality(null);
    setShotFeedback(null);
    setScore(0);
    setStreak(1);
    setLives(3);
    setCorrectCount(0);
    setIncorrectCount(0);
    setBasketsMade(0);
    startTimeRef.current = Date.now();
  }, [gradeId, difficulty]);

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

  // Meter oscillation when Court is active & ball not yet released
  useEffect(() => {
    if (!isCourtActive || isBallInFlight || isPaused || shotQuality !== null) return;

    let localVal = meterValue;
    let localDir = meterDirection;

    const loop = () => {
      localVal += localDir * meterSpeed;
      if (localVal >= 100) {
        localVal = 100;
        localDir = -1;
      } else if (localVal <= 0) {
        localVal = 0;
        localDir = 1;
      }
      setMeterValue(localVal);
      setMeterDirection(localDir);
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isCourtActive, isBallInFlight, isPaused, shotQuality, meterSpeed, meterDirection, meterValue]);

  // Advance to next question or end
  const advanceToNext = useCallback(
    (currentCorrect: number, currentIncorrect: number, currentScore: number) => {
      if (lives <= 0 || currentIndex + 1 >= questions.length) {
        finishGame(currentCorrect, currentIncorrect, currentScore);
      } else {
        setCurrentIndex((i) => i + 1);
        setSelectedOption(null);
        setIsAnswerSubmitted(false);
        setIsCourtActive(false);
        setIsBallInFlight(false);
        setBallProgress(0);
        setShotQuality(null);
        setShotFeedback(null);
        setMeterValue(50);
      }
    },
    [currentIndex, questions.length, lives, finishGame]
  );

  // Basketball shooting release handler
  const handleReleaseShot = useCallback(() => {
    if (!isCourtActive || isBallInFlight || shotQuality !== null) return;

    if (!isMuted) sounds.playTap();
    setIsBallInFlight(true);

    // Evaluate timing release (Sweet zone is 65% - 85%)
    let quality: ShotQuality = 'rim_bounce';
    let bonus = 0;
    let feedback = '';

    if (meterValue >= 68 && meterValue <= 84) {
      quality = 'swish';
      bonus = 50 * streak;
      feedback = `SWISH! CLEAN 3-POINTER! +${bonus} PTS 🏀🔥`;
    } else if ((meterValue >= 50 && meterValue < 68) || (meterValue > 84 && meterValue <= 94)) {
      quality = 'bank';
      bonus = 25 * streak;
      feedback = `BANK SHOT OFF GLASS! +${bonus} PTS! 🎯`;
    } else {
      quality = 'rim_bounce';
      bonus = 0;
      feedback = 'RIM BOUNCE! Good try — Grammar point awarded! 👏';
    }

    setShotQuality(quality);

    // Animate ball arc
    const startTime = performance.now();
    const flightDuration = 750; // ms

    const animateFlight = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / flightDuration);
      setBallProgress(progress);

      if (progress < 1) {
        requestAnimationFrame(animateFlight);
      } else {
        // Ball reached hoop
        setIsBallInFlight(false);
        if (quality === 'swish' || quality === 'bank') {
          if (!isMuted) sounds.playSuccess();
          setBasketsMade((b) => b + 1);
        } else {
          if (!isMuted) sounds.playTap();
        }
        setShotFeedback(feedback);
        const newScore = score + bonus;
        setScore(newScore);

        setTimeout(() => {
          advanceToNext(correctCount, incorrectCount, newScore);
        }, 1300);
      }
    };

    requestAnimationFrame(animateFlight);
  }, [
    isCourtActive,
    isBallInFlight,
    shotQuality,
    isMuted,
    meterValue,
    streak,
    score,
    correctCount,
    incorrectCount,
    advanceToNext,
  ]);

  // Option selection
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

      // Unlock Shooting Court
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

      // Show airball / blocked feedback then advance
      setShotQuality('airball');
      setShotFeedback(`Missed Shot! Correct: "${currentQ.options[currentQ.correctOptionIndex]}"`);

      setTimeout(() => {
        advanceToNext(correctCount, nextIncorrect, score);
      }, 2000);
    }
  };

  // Keyboard shortcut controls: 1-4 for options, Space for shoot
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused) return;

      if (!isCourtActive && !isAnswerSubmitted) {
        if (e.key === '1') handleSelectOption(0);
        else if (e.key === '2') handleSelectOption(1);
        else if (e.key === '3') handleSelectOption(2);
        else if (e.key === '4') handleSelectOption(3);
      } else if (isCourtActive && !isBallInFlight && shotQuality === null) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleReleaseShot();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused, isCourtActive, isAnswerSubmitted, isBallInFlight, shotQuality, handleReleaseShot]);

  const currentQ = questions[currentIndex];
  if (!currentQ) return null;

  // Ball trajectory coordinates (from shooter hand [bottom center] to hoop [top right])
  // Start: x=250, y=360. Apex: x=340, y=100. Target (Hoop): x=450, y=180
  const t = ballProgress;
  const startX = 260;
  const startY = 360;
  const apexX = 350;
  const apexY = 110;
  const targetX = 455;
  const targetY = 195;

  // Quadratic Bézier curve formula: B(t) = (1-t)^2 P0 + 2(1-t)t P1 + t^2 P2
  const ballX = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * apexX + t * t * targetX;
  const ballY = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * apexY + t * t * targetY;
  const ballScale = 1 - t * 0.35; // Slight perspective shrinking as ball approaches hoop

  return (
    <div className="relative w-full min-h-[620px] max-w-4xl mx-auto bg-gradient-to-b from-amber-950 via-slate-900 to-slate-950 rounded-3xl border-2 border-orange-500/40 overflow-hidden flex flex-col select-none shadow-2xl">
      
      {/* Top HUD Bar */}
      <div className="bg-slate-900/90 backdrop-blur-md px-6 py-3.5 border-b border-orange-500/30 flex items-center justify-between text-white z-20">
        
        {/* Left: Question Counter & Lives */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-orange-950/80 px-3 py-1.5 rounded-xl border border-orange-500/40">
            <span className="text-xl">🏀</span>
            <span className="font-mono font-black text-amber-300 text-sm">
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
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-bold text-amber-400">
          <span>{currentQ.grammarTopic}</span>
        </div>

        {/* Right: Score, Baskets, Streak, Controls */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1 text-orange-300 font-mono text-xs font-bold bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
            <span>Swishes:</span>
            <strong className="text-white">{basketsMade}</strong>
          </div>

          <div className="flex items-center gap-1 text-amber-400 font-mono font-black text-sm">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>{score}</span>
          </div>

          {streak > 1 && (
            <div className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black text-xs px-2.5 py-1 rounded-full animate-pulse shadow-sm">
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

      {/* Main Play Area */}
      <div className="relative flex-1 p-4 md:p-6 flex flex-col justify-between overflow-hidden">
        
        {/* Court Backdrop Vector Graphics (Hardwood court & glowing stadium lights) */}
        <div className="absolute inset-0 pointer-events-none opacity-25">
          {/* Hardwood lines */}
          <div className="w-full h-full bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:24px_24px]" />
          {/* Key / Free throw circle */}
          <div className="absolute right-[-40px] top-[140px] w-72 h-72 border-4 border-orange-400/40 rounded-full" />
          <div className="absolute right-0 top-[180px] w-48 h-52 border-4 border-orange-400/30" />
        </div>

        {/* PHASE 1: Grammar Question Card */}
        <div className="relative z-10 space-y-4">
          
          <div className="bg-slate-900/90 border-2 border-orange-400/40 rounded-2xl p-5 shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs font-extrabold text-orange-400 uppercase tracking-wider mb-2">
              <span>Grammar Challenge • Choose the right answer</span>
              <span className="font-mono text-slate-400">Score value: +100 XP</span>
            </div>

            <p className="text-lg sm:text-xl md:text-2xl font-black text-white leading-relaxed tracking-wide">
              {currentQ.prompt}
            </p>
          </div>

          {/* Answer Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectOpt = idx === currentQ.correctOptionIndex;
              let btnClass = 'bg-slate-800/90 border-slate-700 text-slate-200 hover:border-orange-400 hover:bg-slate-800';

              if (isAnswerSubmitted) {
                if (isCorrectOpt) {
                  btnClass = 'bg-emerald-600/90 border-emerald-400 text-white shadow-lg shadow-emerald-900/50 scale-[1.01]';
                } else if (isSelected && !isCorrectOpt) {
                  btnClass = 'bg-rose-600/90 border-rose-400 text-white shadow-lg shadow-rose-900/50';
                } else {
                  btnClass = 'bg-slate-900/50 border-slate-800 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isAnswerSubmitted}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 rounded-2xl border-2 text-left font-bold text-base transition-all flex items-center justify-between group active:scale-[0.98] ${btnClass}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-black/30 flex items-center justify-center font-mono text-xs font-black text-amber-300">
                      {idx + 1}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {isAnswerSubmitted && isCorrectOpt && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-300 animate-bounce" />
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrectOpt && (
                    <XCircle className="w-5 h-5 text-rose-300" />
                  )}
                </button>
              );
            })}
          </div>

        </div>

        {/* PHASE 2: Interactive Basketball Court View */}
        <div className="relative z-10 flex-1 min-h-[260px] mt-4 rounded-2xl bg-gradient-to-t from-amber-950/80 via-slate-900/60 to-transparent border border-orange-500/20 p-4 flex flex-col justify-end overflow-hidden">
          
          {/* Backboard & Hoop Graphics (Top Right) */}
          <div className="absolute right-8 top-6 z-10 flex flex-col items-center">
            {/* Glass Backboard */}
            <div className="w-28 h-20 bg-white/10 backdrop-blur-md border-4 border-orange-400 rounded-lg shadow-2xl relative flex items-center justify-center">
              {/* Target Square on Backboard */}
              <div className="w-12 h-9 border-2 border-orange-500 rounded-sm" />
              {/* Backboard Mount */}
              <div className="absolute right-[-14px] top-1/2 -translate-y-1/2 w-4 h-3 bg-slate-700" />
            </div>

            {/* Hoop Rim & Net */}
            <div className="relative -mt-1 flex flex-col items-center">
              {/* Orange Rim */}
              <div className="w-16 h-3 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 rounded-full border border-orange-300 shadow-md" />
              {/* White Mesh Net */}
              <svg width="44" height="32" viewBox="0 0 44 32" className="opacity-90">
                <path
                  d="M 6 0 L 14 30 L 30 30 L 38 0 Z"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
                <line x1="12" y1="0" x2="22" y2="30" stroke="#ffffff" strokeWidth="1" />
                <line x1="32" y1="0" x2="22" y2="30" stroke="#ffffff" strokeWidth="1" />
                <line x1="10" y1="14" x2="34" y2="14" stroke="#ffffff" strokeWidth="1" />
              </svg>
            </div>
          </div>

          {/* Animated Basketball */}
          {isCourtActive && (
            <div
              className="absolute z-20 transition-all pointer-events-none"
              style={{
                left: `${ballX}px`,
                top: `${ballY}px`,
                transform: `scale(${ballScale})`,
              }}
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 via-orange-600 to-amber-800 border-2 border-orange-300 shadow-2xl flex items-center justify-center relative overflow-hidden animate-spin">
                {/* Basketball Ribs */}
                <div className="absolute inset-0 border-t-2 border-b-2 border-black/40 rounded-full" />
                <div className="absolute inset-0 border-l-2 border-r-2 border-black/40 rounded-full" />
                <div className="w-full h-[2px] bg-black/40" />
              </div>
            </div>
          )}

          {/* Shot Feedback Banner */}
          {shotFeedback && (
            <div className="absolute inset-x-4 top-1/3 -translate-y-1/2 z-30 flex flex-col items-center justify-center">
              <div className="px-6 py-3.5 rounded-2xl bg-slate-900/95 border-2 border-amber-400 shadow-2xl text-center backdrop-blur-md animate-bounce">
                <p className="text-lg md:text-xl font-black text-amber-300 font-display">
                  {shotFeedback}
                </p>
                {currentQ.explanation && (
                  <p className="text-xs text-slate-300 font-medium mt-1 max-w-md mx-auto">
                    {currentQ.explanation}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* SHOT METER & RELEASE TRIGGER (Visible when Court is active and ball not in flight) */}
          {isCourtActive && !isBallInFlight && shotQuality === null && (
            <div className="relative z-20 bg-slate-900/90 p-4 rounded-2xl border-2 border-orange-400 shadow-xl flex flex-col items-center space-y-3">
              
              <div className="flex items-center justify-between w-full text-xs font-black text-amber-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  SHOT METER • RELEASE IN GREEN ZONE!
                </span>
                <span className="font-mono text-slate-400">Sweet Spot: 70-80%</span>
              </div>

              {/* Oscillating Bar */}
              <div className="w-full h-7 bg-slate-800 rounded-full border-2 border-slate-700 relative overflow-hidden flex items-center">
                {/* Green Sweet Spot Zone */}
                <div className="absolute left-[68%] w-[16%] h-full bg-emerald-500/80 border-x-2 border-emerald-300 flex items-center justify-center text-[10px] font-black text-white">
                  SWISH
                </div>
                {/* Yellow Bank Zone Left */}
                <div className="absolute left-[50%] w-[18%] h-full bg-amber-500/40" />
                {/* Yellow Bank Zone Right */}
                <div className="absolute left-[84%] w-[10%] h-full bg-amber-500/40" />

                {/* Moving Indicator Arrow */}
                <div
                  className="absolute top-0 bottom-0 w-2.5 bg-white border-x border-orange-600 rounded-full shadow-lg transition-transform duration-75"
                  style={{ left: `${meterValue}%` }}
                />
              </div>

              {/* Big Tap / Click Trigger Button */}
              <button
                type="button"
                onClick={handleReleaseShot}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-base uppercase tracking-wider shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>🏀 RELEASE SHOT NOW! (SPACE / TAP)</span>
              </button>

            </div>
          )}

          {/* Idle Prompt before answer */}
          {!isCourtActive && !isAnswerSubmitted && (
            <div className="flex items-center justify-center text-xs font-bold text-slate-400 py-3">
              <span>Select the correct grammar option above to step onto the court!</span>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default GrammarBasketballGame;
