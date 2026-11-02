import React from 'react';
import { useArcade } from '../../context/ArcadeContext';
import { QuizBattleGame } from './QuizBattleGame';
import { MatchItGame } from './MatchItGame';
import { SentenceBuilderGame } from './SentenceBuilderGame';
import { TrueFalseGame } from './TrueFalseGame';
import { ReadingDetectiveGame } from './ReadingDetectiveGame';
import { Gamepad2 } from 'lucide-react';

export const GameContainer: React.FC = () => {
  const { activeGradeId, activeUnit, activeActivity, goToUnit } = useArcade();

  if (!activeActivity || !activeUnit || !activeGradeId) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center">
        <Gamepad2 className="w-12 h-12 text-slate-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Activity Not Found</h3>
        <p className="text-slate-400 text-sm mb-6">
          The requested game activity could not be loaded or was removed.
        </p>
        {activeGradeId && activeUnit && (
          <button
            onClick={() => goToUnit(activeGradeId, activeUnit.id)}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm"
          >
            Return to Unit
          </button>
        )}
      </div>
    );
  }

  const handleExit = () => {
    goToUnit(activeGradeId, activeUnit.id);
  };

  switch (activeActivity.gameType) {
    case 'quiz_battle':
      return <QuizBattleGame activity={activeActivity} onExit={handleExit} />;
    case 'match_it':
      return <MatchItGame activity={activeActivity} onExit={handleExit} />;
    case 'sentence_builder':
      return <SentenceBuilderGame activity={activeActivity} onExit={handleExit} />;
    case 'true_false':
      return <TrueFalseGame activity={activeActivity} onExit={handleExit} />;
    case 'reading_detective':
      return <ReadingDetectiveGame activity={activeActivity} onExit={handleExit} />;
    default:
      return <QuizBattleGame activity={activeActivity} onExit={handleExit} />;
  }
};
