import React, { useState } from 'react';
import { useTeacherAuth } from '../../context/TeacherAuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  Clock, 
  Loader2 
} from 'lucide-react';
import { sounds } from '../../services/soundEffects';

interface TeacherLoginScreenProps {
  onBackToWelcome: () => void;
}

export const TeacherLoginScreen: React.FC<TeacherLoginScreenProps> = ({ onBackToWelcome }) => {
  const {
    login,
    isLoggingIn,
    authError,
    authErrorCode,
    attemptsRemaining,
    lockoutRemainingSeconds,
    clearAuthError,
    openDashboard,
  } = useTeacherAuth();

  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const isLocked = lockoutRemainingSeconds > 0 || authErrorCode === 'LOCKED';

  // Format lockout seconds into MM:SS
  const formatCooldown = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked || isLoggingIn) return;

    const trimmed = password.trim();
    if (!trimmed) return;

    sounds.playTap();
    setPassword('');
    const success = await login(trimmed);
    if (success) {
      openDashboard();
    }
  };

  return (
    <div className="relative min-h-screen bg-game-sky text-slate-900 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 overflow-x-hidden selection:bg-cyan-500 selection:text-white">
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-12 right-16 opacity-70 anim-cloud">
          <svg width="220" height="110" viewBox="0 0 220 110" fill="#ffffff">
            <path d="M 30 75 A 30 30 0 0 1 85 60 A 45 45 0 0 1 160 55 A 30 30 0 0 1 200 75 A 20 20 0 0 1 180 100 L 45 100 A 20 20 0 0 1 30 75 Z" filter="drop-shadow(0 10px 20px rgba(14,165,233,0.08))" />
          </svg>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="card-island w-full max-w-xl mx-auto p-6 sm:p-10 shadow-2xl relative z-10 overflow-hidden bg-white border-indigo-200"
      >
        {/* Top Bar with Back Button */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
          <button
            onClick={() => {
              sounds.playTap();
              clearAuthError();
              onBackToWelcome();
            }}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 border border-slate-300 shadow-sm transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Public Welcome</span>
          </button>

          <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-indigo-100 text-indigo-800 border border-indigo-300 shadow-sm">
            Staff Portal
          </span>
        </div>

        {/* Mascot / Title */}
        <div className="text-center max-w-md mx-auto space-y-2 mb-6">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-indigo-100 text-indigo-700 border-2 border-indigo-200 flex items-center justify-center text-3xl shadow-sm">
            👩‍🏫
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-slate-900">
            Educator Verification
          </h1>
          <p className="text-xs text-slate-600 font-medium">
            Enter your faculty master passphrase to access Middle School English telemetry.
          </p>
        </div>

        {/* Lockout Warning Banner */}
        <AnimatePresence>
          {isLocked && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-5 p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-800 text-xs flex items-start gap-3 shadow-sm"
            >
              <Clock className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-black text-rose-900 block text-sm">
                  Authentication Temporarily Locked
                </span>
                <p className="mt-0.5 leading-relaxed">
                  Too many incorrect passphrase attempts. Security cooldown active for:{' '}
                  <strong className="font-mono font-bold text-rose-950">
                    {formatCooldown(lockoutRemainingSeconds)}
                  </strong>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Auth Error Banner */}
        <AnimatePresence>
          {authError && !isLocked && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mb-5 p-3 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 text-xs flex items-start gap-2.5 font-medium shadow-sm"
            >
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span>{authError}</span>
                {attemptsRemaining !== null && attemptsRemaining < 5 && (
                  <span className="block mt-1 font-bold text-amber-950">
                    {attemptsRemaining} attempt{attemptsRemaining === 1 ? '' : 's'} remaining before security lockout.
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Passphrase Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
          
          <div>
            <label className="block text-xs font-black uppercase text-slate-600 tracking-wider mb-1.5">
              Teacher Master Passphrase
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  if (authError) clearAuthError();
                }}
                disabled={isLocked || isLoggingIn}
                placeholder="Enter master passphrase..."
                autoFocus
                className="w-full py-3.5 pl-4 pr-11 rounded-2xl bg-slate-50 border-2 border-slate-300 font-mono text-slate-900 text-sm focus:outline-none focus:border-indigo-500 transition-colors shadow-inner disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                title={showPassword ? 'Hide passphrase' : 'Show passphrase'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-indigo-50/80 border border-indigo-200 text-xs font-bold text-indigo-950 flex items-center justify-between">
            <span>Department: Middle School English (7A, 7B, 8A, 8B)</span>
            <span className="text-emerald-700 font-black">Authorized</span>
          </div>

          <button
            type="submit"
            disabled={isLocked || isLoggingIn || !password.trim()}
            className={`w-full py-3.5 rounded-2xl font-black text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 ${
              isLocked || isLoggingIn || !password.trim()
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed border-b-2 border-slate-300'
                : 'btn-game-purple'
            }`}
          >
            {isLoggingIn ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span>ENTER EDUCATOR DASHBOARD ➔</span>
            )}
          </button>

          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-medium flex items-start gap-2.5 mt-4">
            <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Restricted Faculty Access:</strong> This portal is protected. Student activity and gameplay interfaces are completely detached from teacher reporting.
            </span>
          </div>

        </form>

      </motion.div>
    </div>
  );
};
