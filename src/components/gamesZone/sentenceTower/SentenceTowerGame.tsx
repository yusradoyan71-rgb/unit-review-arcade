import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, Layers, Pause, Sparkles, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import type { GradeId } from '../../../types/schema';
import type {
  GamesZoneDifficulty,
  GamesZoneAttemptRecord,
  SentenceTowerItem,
} from '../../../types/gamesZone';
import { getQuestionsForGame } from '../../../data/gamesZone';
import { GamesZoneService } from '../../../services/gamesZoneService';
import { sounds } from '../../../services/soundEffects';

interface SentenceTowerGameProps {
  gradeId: GradeId;
  difficulty: GamesZoneDifficulty;
  studentNumber: string;
  studentClass?: string;
  onComplete: (record: GamesZoneAttemptRecord) => void;
  onPause: () => void;
  isPaused: boolean;
  isMuted: boolean;
}

// Normalizer to compare sentence words regardless of case & punctuation
function normalizeSentence(s: string): string {
  return s
    .toLowerCase()
    .replace(/[.,?!'’"]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export const SentenceTowerGame: React.FC<SentenceTowerGameProps> = ({
  gradeId,
  difficulty,
  studentNumber,
  studentClass,
  onComplete,
  onPause,
  isPaused,
  isMuted,
}) => {
  const [questions, setQuestions] = useState<SentenceTowerItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(1);
  const [lives, setLives] = useState(3);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  // Block management
  const [availableWords, setAvailableWords] = useState<{ id: string; text: string }[]>([]);
  const [placedWords, setPlacedWords] = useState<{ id: string; text: string }[]>([]);
  const [towerFloors, setTowerFloors] = useState<number[]>([]); // completed floor indices

  const [feedback, setFeedback] = useState<{
    isSuccess: boolean;
    text: string;
    explanation?: string;
  } | null>(null);

  const startTimeRef = useRef(Date.now());

  // Load questions
  useEffect(() => {
    const pool = getQuestionsForGame('sentence_tower', gradeId, difficulty, 10) as SentenceTowerItem[];
    setQuestions(pool);
    setCurrentIndex(0);
    setScore(0);
    setStreak(1);
    setLives(3);
    setCorrectCount(0);
    setIncorrectCount(0);
    setTowerFloors([]);
    startTimeRef.current = Date.now();
  }, [gradeId, difficulty]);

  // Set up word blocks for current question
  const loadQuestionBlocks = useCallback((q: SentenceTowerItem) => {
    if (!q) return;
    const blocks = q.scrambledWords.map((word, idx) => ({
      id: `word_${idx}_${word}_${Date.now()}`,
      text: word,
    }));
    setAvailableWords(blocks);
    setPlacedWords([]);
  }, []);

  useEffect(() => {
    if (questions.length > 0 && currentIndex < questions.length) {
      loadQuestionBlocks(questions[currentIndex]);
    }
  }, [currentIndex, questions, loadQuestionBlocks]);

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
        attemptId: `gz_st_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        gameId: 'sentence_tower',
        gameTitle: 'Sentence Tower',
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

  // Move word from available to placed
  const handlePlaceWord = (wordObj: { id: string; text: string }) => {
    if (isPaused || feedback) return;
    setAvailableWords((prev) => prev.filter((w) => w.id !== wordObj.id));
    setPlacedWords((prev) => [...prev, wordObj]);
  };

  // Move word back from placed to available
  const handleRemoveWord = (wordObj: { id: string; text: string }) => {
    if (isPaused || feedback) return;
    setPlacedWords((prev) => prev.filter((w) => w.id !== wordObj.id));
    setAvailableWords((prev) => [...prev, wordObj]);
  };

  // Reset all words for current question
  const handleResetBlocks = () => {
    if (isPaused || feedback) return;
    const currentQ = questions[currentIndex];
    if (currentQ) {
      loadQuestionBlocks(currentQ);
    }
  };

  // Check sentence submission
  const handleSubmitSentence = () => {
    if (placedWords.length === 0 || isPaused || feedback) return;

    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    const assembled = placedWords.map((w) => w.text).join(' ');
    const normAssembled = normalizeSentence(assembled);
    const normCanonical = normalizeSentence(currentQ.correctSentence);
    const normAlts = (currentQ.alternativeSentences || []).map((alt) => normalizeSentence(alt));

    const isValid = normAssembled === normCanonical || normAlts.includes(normAssembled);

    if (isValid) {
      // Correct!
      if (!isMuted) sounds.playSuccess();
      const points = 100 * streak;
      setScore((s) => s + points);
      setStreak((st) => Math.min(5, st + 1));
      const newCorrect = correctCount + 1;
      setCorrectCount(newCorrect);
      setTowerFloors((floors) => [...floors, currentIndex]);
      setFeedback({
        isSuccess: true,
        text: `+${points} Floor Built!`,
        explanation: currentQ.explanation,
      });

      setTimeout(() => {
        setFeedback(null);
        if (currentIndex + 1 >= questions.length) {
          finishGame(newCorrect, incorrectCount, score + points);
        } else {
          setCurrentIndex((i) => i + 1);
        }
      }, 1000);
    } else {
      // Incorrect order!
      if (!isMuted) sounds.playError();
      setStreak(1);
      const newIncorrect = incorrectCount + 1;
      setIncorrectCount(newIncorrect);
      const newLives = lives - 1;
      setLives(newLives);
      setFeedback({
        isSuccess: false,
        text: `Sentence Unbalanced! Try arranging again.`,
      });

      setTimeout(() => {
        setFeedback(null);
        if (newLives <= 0 || currentIndex + 1 >= questions.length) {
          finishGame(correctCount, newIncorrect, score);
        }
      }, 1100);
    }
  };

  const currentQ = questions[currentIndex];
  if (!currentQ) return null;

  return (
    <div className="relative w-full h-[650px] max-h-[85vh] bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-950 rounded-3xl border border-emerald-800/60 overflow-hidden flex flex-col select-none shadow-2xl">
      {/* Top HUD */}
      <div className="p-4 bg-slate-900/90 border-b border-emerald-900 flex items-center justify-between z-20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
            <Layers className="w-5 h-5 fill-current" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400 block">
              Floor {currentIndex + 1} / {questions.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-amber-400">{score}</span>
              <span className="text-xs text-slate-400">pts</span>
            </div>
          </div>
        </div>

        {/* Streak */}
        {streak > 1 && (
          <div className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-emerald-500 text-white font-black text-xs flex items-center gap-1 shadow-md animate-pulse">
            <Sparkles className="w-3.5 h-3.5" /> {streak}x BUILD STREAK
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

      {/* Main Workspace (Tower Visual + Construction Yard) */}
      <div className="flex-1 w-full flex flex-col md:flex-row overflow-hidden">
        {/* Left: Animated Skyscraper Visual */}
        <div className="w-full md:w-48 bg-slate-950/70 border-b md:border-b-0 md:border-r border-slate-800 p-4 flex flex-row md:flex-col justify-end items-center gap-1.5 overflow-hidden">
          {/* Antenna / Crane */}
          <div className="hidden md:flex flex-col items-center mb-1">
            <div className="w-1 h-6 bg-amber-400 rounded-full animate-pulse" />
            <div className="w-8 h-1.5 bg-amber-500 rounded-sm" />
          </div>

          {/* Tower Floors */}
          <div className="flex flex-row md:flex-col-reverse gap-1.5 items-center w-full justify-center">
            {Array.from({ length: 10 }).map((_, floorIdx) => {
              const isBuilt = towerFloors.includes(floorIdx);
              const isCurrent = floorIdx === currentIndex;
              return (
                <div
                  key={floorIdx}
                  className={`h-4 md:h-6 w-7 md:w-32 rounded-lg border transition-all flex items-center justify-center text-[10px] font-black ${
                    isBuilt
                      ? 'bg-gradient-to-r from-emerald-600 to-green-500 border-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                      : isCurrent
                      ? 'bg-amber-500/30 border-amber-400 text-amber-200 border-dashed animate-pulse'
                      : 'bg-slate-900 border-slate-800 text-slate-600'
                  }`}
                >
                  <span className="hidden md:inline">Floor {floorIdx + 1}</span>
                  <span className="md:hidden">{floorIdx + 1}</span>
                </div>
              );
            })}
          </div>

          <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mt-2 hidden md:block">
            Height: {towerFloors.length * 10}m
          </div>
        </div>

        {/* Right: Sentence Construction Yard */}
        <div className="flex-1 flex flex-col p-4 md:p-6 justify-between overflow-y-auto space-y-4">
          {/* Theme Banner */}
          <div className="text-center">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider mb-1">
              {currentQ.themeOrTopic}
            </span>
            <p className="text-xs text-slate-400">
              Arrange the word blocks to build a grammatically correct sentence.
            </p>
          </div>

          {/* Feedback Overlay */}
          {feedback && (
            <div className="p-4 rounded-2xl border text-center animate-scale-in">
              <div className="flex items-center justify-center gap-2 text-lg font-black mb-1">
                {feedback.isSuccess ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400" />
                )}
                <span className={feedback.isSuccess ? 'text-emerald-300' : 'text-rose-300'}>
                  {feedback.text}
                </span>
              </div>
              {feedback.explanation && (
                <p className="text-xs text-emerald-200/90 mt-1">{feedback.explanation}</p>
              )}
            </div>
          )}

          {/* Placed Words Slots Area */}
          <div className="min-h-[100px] p-4 rounded-2xl bg-slate-900/80 border-2 border-dashed border-emerald-500/40 flex flex-wrap items-center justify-center gap-2">
            {placedWords.length === 0 ? (
              <span className="text-xs text-slate-500 font-semibold italic">
                Tap words below to place them here in order
              </span>
            ) : (
              placedWords.map((wordObj) => (
                <button
                  key={wordObj.id}
                  type="button"
                  onClick={() => handleRemoveWord(wordObj)}
                  className="px-4 py-2.5 rounded-xl font-black text-sm md:text-base bg-gradient-to-r from-emerald-600 to-green-600 text-white border border-emerald-400 shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                  title="Click to remove"
                >
                  {wordObj.text}
                </button>
              ))
            )}
          </div>

          {/* Available Word Bricks */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block text-center">
              Available Word Bricks
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2 min-h-[70px]">
              {availableWords.map((wordObj) => (
                <button
                  key={wordObj.id}
                  type="button"
                  onClick={() => handlePlaceWord(wordObj)}
                  className="px-4 py-2.5 rounded-xl font-black text-sm md:text-base bg-slate-800 text-slate-200 border border-slate-700 hover:border-emerald-400 hover:text-white shadow hover:bg-slate-700 active:scale-95 transition-all cursor-pointer"
                >
                  {wordObj.text}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleResetBlocks}
              disabled={placedWords.length === 0}
              className="py-3 px-4 rounded-xl font-bold text-sm bg-slate-800 text-slate-300 hover:bg-slate-700 active:scale-95 transition-all border border-slate-700 flex items-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" /> Reset
            </button>

            <button
              type="button"
              onClick={handleSubmitSentence}
              disabled={placedWords.length === 0}
              className="flex-1 py-3 px-6 rounded-xl font-black text-base text-white bg-gradient-to-r from-emerald-600 to-green-500 hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none"
            >
              <CheckCircle2 className="w-5 h-5" /> Build Floor ({placedWords.length}/
              {currentQ.scrambledWords.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
