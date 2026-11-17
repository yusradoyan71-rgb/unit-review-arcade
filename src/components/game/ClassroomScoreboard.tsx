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
    { id: 't1', name: 'Team Alpha', color: 'border-2 border-sky-200 bg-sky-50/80 text-sky-950', score: 0 },
    { id: 't2', name: 'Team Beta', color: 'border-2 border-purple-200 bg-purple-50/80 text-purple-950', score: 0 },
    { id: 't3', name: 'Team Gamma', color: 'border-2 border-amber-200 bg-amber-50/80 text-amber-950', score: 0 },
    { id: 't4', name: 'Team Delta', color: 'border-2 border-emerald-200 bg-emerald-50/80 text-emerald-950', score: 0 },
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
          className="px-4 py-1.5 rounded-full bg-white hover:bg-sky-50 border-2 border-sky-100 text-sky-900 text-xs font-bold flex items-center gap-2 shadow-sm transition-all hover:scale-105 active:scale-95"
        >
          <Users className="w-3.5 h-3.5 text-sky-600" />
          <span>Classroom Team Scoreboard</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-sky-600" /> : <ChevronDown className="w-3.5 h-3.5 text-sky-600" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 p-4 rounded-3xl bg-white/95 border-2 border-sky-100 shadow-xl backdrop-blur-xl overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Smartboard Team Tracker
              </span>
              <button
                onClick={resetScores}
                className="text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className={`p-3 rounded-2xl border flex flex-col justify-between items-center shadow-xs ${team.color}`}
                >
                  <span className="font-arcade font-bold text-xs uppercase tracking-wide">
                    {team.name}
                  </span>
                  <span className="font-mono text-2xl font-black my-1 text-slate-900">
                    {team.score}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateScore(team.id, -1)}
                      className="w-7 h-7 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center font-bold shadow-xs active:scale-95"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => updateScore(team.id, 1)}
                      className="w-7 h-7 rounded-lg bg-white hover:bg-slate-100 text-slate-900 border border-slate-200 flex items-center justify-center font-bold shadow-xs active:scale-95"
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
