import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Minus, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { sounds } from '../../services/soundEffects';

interface Team {
  id: string;
  name: string;
  color: string;
  score: number;
}

export const ClassroomScoreboard: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [teams, setTeams] = useState<Team[]>([
    { id: 't1', name: 'Team Alpha', color: 'border-cyan-500 bg-cyan-500/10 text-cyan-300', score: 0 },
    { id: 't2', name: 'Team Beta', color: 'border-purple-500 bg-purple-500/10 text-purple-300', score: 0 },
    { id: 't3', name: 'Team Gamma', color: 'border-amber-500 bg-amber-500/10 text-amber-300', score: 0 },
    { id: 't4', name: 'Team Delta', color: 'border-emerald-500 bg-emerald-500/10 text-emerald-300', score: 0 },
  ]);

  const updateScore = (id: string, delta: number) => {
    sounds.playTap();
    setTeams((prev) =>
      prev.map((t) => (t.id === id ? { ...t, score: Math.max(0, t.score + delta) } : t))
    );
  };

  const resetScores = () => {
    sounds.playTap();
    setTeams((prev) => prev.map((t) => ({ ...t, score: 0 })));
  };

  return (
    <div className="w-full max-w-5xl mx-auto mb-4">
      {/* Toggle Pill */}
      <div className="flex justify-center">
        <button
          onClick={() => {
            sounds.playTap();
            setIsOpen(!isOpen);
          }}
          className="px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700 hover:border-indigo-400 text-slate-300 text-xs font-semibold flex items-center gap-2 shadow-lg transition-all"
        >
          <Users className="w-3.5 h-3.5 text-indigo-400" />
          <span>Classroom Team Scoreboard</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 p-4 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl backdrop-blur-xl overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Smartboard Team Tracker
              </span>
              <button
                onClick={resetScores}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className={`p-3 rounded-xl border flex flex-col justify-between items-center ${team.color}`}
                >
                  <span className="font-arcade font-bold text-xs uppercase tracking-wide">
                    {team.name}
                  </span>
                  <span className="font-mono text-2xl font-black my-1 text-white">
                    {team.score}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateScore(team.id, -1)}
                      className="w-7 h-7 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-slate-300 flex items-center justify-center font-bold"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => updateScore(team.id, 1)}
                      className="w-7 h-7 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-white flex items-center justify-center font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
