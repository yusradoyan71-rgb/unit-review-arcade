import React, { useState } from 'react';
import type { GradeId } from '../../types/schema';
import type {
  GamesZoneGameMetadata,
  GamesZoneDifficulty,
  GamesZoneAttemptRecord,
} from '../../types/gamesZone';
import { GamesZoneLanding } from './GamesZoneLanding';
import { DifficultySelectModal } from './DifficultySelectModal';
import { GamePauseModal } from './GamePauseModal';
import { GamesZoneResultsModal } from './GamesZoneResultsModal';
import { WordNinjaGame } from './wordNinja/WordNinjaGame';
import { GrammarRunnerGame } from './grammarRunner/GrammarRunnerGame';
import { WordFishingGame } from './wordFishing/WordFishingGame';
import { SentenceTowerGame } from './sentenceTower/SentenceTowerGame';
import { GamesZoneService } from '../../services/gamesZoneService';

interface GamesZoneContainerProps {
  selectedGrade: GradeId;
  onSelectGrade: (grade: GradeId) => void;
  onBackToHome: () => void;
  studentNumber?: string;
  studentClass?: string;
}

export const GamesZoneContainer: React.FC<GamesZoneContainerProps> = ({
  selectedGrade,
  onSelectGrade,
  onBackToHome,
  studentNumber = 'guest',
  studentClass,
}) => {
  const [selectedGame, setSelectedGame] = useState<GamesZoneGameMetadata | null>(null);
  const [isDiffModalOpen, setIsDiffModalOpen] = useState(false);
  const [currentDifficulty, setCurrentDifficulty] = useState<GamesZoneDifficulty>('easy');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Results state
  const [lastAttempt, setLastAttempt] = useState<GamesZoneAttemptRecord | null>(null);
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const [isHighScore, setIsHighScore] = useState(false);

  // Restart key to force fresh game remount
  const [gameSessionKey, setGameSessionKey] = useState(0);

  const handleOpenGame = (metadata: GamesZoneGameMetadata) => {
    setSelectedGame(metadata);
    setIsDiffModalOpen(true);
  };

  const handleStartGame = (difficulty: GamesZoneDifficulty) => {
    setCurrentDifficulty(difficulty);
    setIsDiffModalOpen(false);
    setIsPlaying(true);
    setIsPaused(false);
    setGameSessionKey((k) => k + 1);
  };

  const handleGameComplete = (record: GamesZoneAttemptRecord) => {
    const previousBest = selectedGame
      ? GamesZoneService.getPersonalHighScore(studentNumber, selectedGame.id, record.difficulty)
      : 0;
    const isNewHigh = record.score > previousBest;

    setLastAttempt(record);
    setIsHighScore(isNewHigh);
    setIsResultsOpen(true);
    setIsPlaying(false);
    setIsPaused(false);
  };

  const handleRestart = () => {
    setIsPaused(false);
    setIsResultsOpen(false);
    setIsPlaying(true);
    setGameSessionKey((k) => k + 1);
  };

  const handleQuitToLanding = () => {
    setIsPlaying(false);
    setIsPaused(false);
    setIsResultsOpen(false);
    setSelectedGame(null);
  };

  return (
    <div className="w-full min-h-screen bg-slate-950">
      {!isPlaying ? (
        <GamesZoneLanding
          selectedGrade={selectedGrade}
          onSelectGrade={onSelectGrade}
          onOpenGame={handleOpenGame}
          onBackToHome={onBackToHome}
          studentNumber={studentNumber}
        />
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-4xl mx-auto">
            {selectedGame?.id === 'word_ninja' && (
              <WordNinjaGame
                key={`wn_${gameSessionKey}`}
                gradeId={selectedGrade}
                difficulty={currentDifficulty}
                studentNumber={studentNumber}
                studentClass={studentClass}
                onComplete={handleGameComplete}
                onPause={() => setIsPaused(true)}
                isPaused={isPaused}
                isMuted={isMuted}
              />
            )}

            {selectedGame?.id === 'grammar_runner' && (
              <GrammarRunnerGame
                key={`gr_${gameSessionKey}`}
                gradeId={selectedGrade}
                difficulty={currentDifficulty}
                studentNumber={studentNumber}
                studentClass={studentClass}
                onComplete={handleGameComplete}
                onPause={() => setIsPaused(true)}
                isPaused={isPaused}
                isMuted={isMuted}
              />
            )}

            {selectedGame?.id === 'word_fishing' && (
              <WordFishingGame
                key={`wf_${gameSessionKey}`}
                gradeId={selectedGrade}
                difficulty={currentDifficulty}
                studentNumber={studentNumber}
                studentClass={studentClass}
                onComplete={handleGameComplete}
                onPause={() => setIsPaused(true)}
                isPaused={isPaused}
                isMuted={isMuted}
              />
            )}

            {selectedGame?.id === 'sentence_tower' && (
              <SentenceTowerGame
                key={`st_${gameSessionKey}`}
                gradeId={selectedGrade}
                difficulty={currentDifficulty}
                studentNumber={studentNumber}
                studentClass={studentClass}
                onComplete={handleGameComplete}
                onPause={() => setIsPaused(true)}
                isPaused={isPaused}
                isMuted={isMuted}
              />
            )}
          </div>
        </div>
      )}

      {/* Difficulty Selection Modal */}
      <DifficultySelectModal
        isOpen={isDiffModalOpen}
        metadata={selectedGame}
        selectedGrade={selectedGrade}
        onSelectGrade={onSelectGrade}
        onStartGame={handleStartGame}
        onClose={() => setIsDiffModalOpen(false)}
        studentNumber={studentNumber}
      />

      {/* Pause Modal */}
      <GamePauseModal
        isOpen={isPaused}
        onResume={() => setIsPaused(false)}
        onRestart={handleRestart}
        onQuit={handleQuitToLanding}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted((m) => !m)}
      />

      {/* Results Modal */}
      <GamesZoneResultsModal
        isOpen={isResultsOpen}
        attempt={lastAttempt}
        isHighScore={isHighScore}
        onPlayAgain={handleRestart}
        onReturnToLanding={handleQuitToLanding}
      />
    </div>
  );
};

