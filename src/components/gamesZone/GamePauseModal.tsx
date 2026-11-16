import React from 'react';
import { Play, RotateCcw, ArrowLeft, Volume2, VolumeX } from 'lucide-react';

interface GamePauseModalProps {
  isOpen: boolean;
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const GamePauseModal: React.FC<GamePauseModalProps> = ({
  isOpen,
  onResume,
  onRestart,
  onQuit,
  isMuted,
  onToggleMute,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700/80 p-6 shadow-2xl text-center space-y-5">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
          <Play className="w-8 h-8 fill-current" />
        </div>

        <div>
          <h3 className="text-2xl font-black text-white">Game Paused</h3>
          <p className="text-xs text-slate-400 mt-1">Take a breath or adjust settings</p>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={onResume}
            className="w-full py-3.5 px-4 rounded-xl font-black text-white bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
          >
            <Play className="w-5 h-5 fill-current" /> Resume Game
          </button>

          <button
            type="button"
            onClick={onToggleMute}
            className="w-full py-3 px-4 rounded-xl font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-slate-700"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-5 h-5 text-rose-400" /> Sound: Muted
              </>
            ) : (
              <>
                <Volume2 className="w-5 h-5 text-emerald-400" /> Sound: Enabled
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="w-full py-3 px-4 rounded-xl font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-slate-700"
          >
            <RotateCcw className="w-5 h-5 text-amber-400" /> Restart Session
          </button>

          <button
            type="button"
            onClick={onQuit}
            className="w-full py-3 px-4 rounded-xl font-bold text-rose-400 bg-rose-950/30 hover:bg-rose-900/50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-rose-900/40"
          >
            <ArrowLeft className="w-5 h-5" /> Quit to Games Zone
          </button>
        </div>
      </div>
    </div>
  );
};
