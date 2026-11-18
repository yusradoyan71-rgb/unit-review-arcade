/**
 * UNIT REVIEW ARCADE — TEACHER LOGIN MODAL (PHASE 9D)
 * Version: 9.4.0
 * 
 * Creative Campus Professional Educator Redesign.
 * Secure modal prompt for Teacher Master Passphrase.
 * Features rate-limiting cooldown timers, locked-state indicators,
 * and zero credential exposure.
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTeacherAuth } from '../../context/TeacherAuthContext';
import { 
  ShieldCheck, 
  KeyRound, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  Clock, 
  X, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';

export const TeacherLoginModal: React.FC = () => {
  const {
    isLoginModalOpen,
    closeLoginModal,
    login,
    isLoggingIn,
    authError,
    authErrorCode,
    attemptsRemaining,
    lockoutRemainingSeconds,
    clearAuthError,
  } = useTeacherAuth();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const isSubmittingRef = useRef(false);

  if (!isLoginModalOpen) return null;

  const isLocked = lockoutRemainingSeconds > 0 || authErrorCode === 'LOCKED';

  // Format lockout seconds into MM:SS
  const formatCooldown = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked || isLoggingIn || isSubmittingRef.current) return;

    const trimmed = password.trim();
    if (!trimmed) return;

    isSubmittingRef.current = true;
    // Immediately clear plaintext from local state on submit
    setPassword('');
    try {
      await login(trimmed);
    } finally {
      isSubmittingRef.current = false;
    }
  };

  const handleClose = () => {
    setPassword('');
    clearAuthError();
    closeLoginModal();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-800 overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bubble text-lg font-bold text-slate-900 tracking-wide">
                TEACHER DASHBOARD
              </h2>
              <p className="text-slate-500 text-xs font-medium">
                Master Passphrase Authentication
              </p>
            </div>
          </div>

          {/* NOT_CONFIGURED Educational Banner */}
          {authErrorCode === 'NOT_CONFIGURED' && (
            <div className="mb-5 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2 font-medium">
              <div className="flex items-center gap-2 font-bold text-amber-800">
                <HelpCircle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>Teacher Authentication Not Initialized</span>
              </div>
              <p className="leading-relaxed">
                Teacher authentication is currently disabled in your Google Apps Script project.
              </p>
              <div className="p-2.5 rounded-xl bg-white border border-amber-200 font-mono text-[11px] text-amber-900 leading-tight">
                1. Set Script Property: <strong>TEACHER_SETUP_PASSWORD</strong> (min 12 chars)<br />
                2. Run <strong>initializeTeacherFromScriptProperties()</strong> in GAS
              </div>
            </div>
          )}

          {/* LOCKED Alert with Cooldown */}
          {isLocked && (
            <div className="mb-5 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs space-y-2 font-medium">
              <div className="flex items-center gap-2 font-bold text-rose-700">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
                <span>Account Temporarily Locked</span>
              </div>
              <p className="leading-relaxed">
                Maximum failed password attempts exceeded. Rate limiting is active for your security.
              </p>
              <div className="flex items-center gap-2 font-mono text-sm font-bold text-rose-800 bg-white border border-rose-200 p-2.5 rounded-xl">
                <Clock className="w-4 h-4 animate-spin text-rose-600" />
                <span>Cooldown Remaining: {formatCooldown(lockoutRemainingSeconds)}</span>
              </div>
            </div>
          )}

          {/* Standard Auth Error Banner */}
          {authError && authErrorCode !== 'NOT_CONFIGURED' && !isLocked && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 font-medium">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold leading-snug">{authError}</p>
                {typeof attemptsRemaining === 'number' && attemptsRemaining > 0 && (
                  <p className="text-[11px] text-rose-700 font-mono">
                    ⚠️ {attemptsRemaining} attempt{attemptsRemaining === 1 ? '' : 's'} remaining before 15-minute lockout.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Teacher Passphrase
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  disabled={isLocked || isLoggingIn}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter private teacher passphrase..."
                  autoComplete="current-password"
                  autoFocus
                  className="w-full pl-10 pr-11 py-3 rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
                />
                <button
                  type="button"
                  disabled={isLocked || isLoggingIn}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 disabled:opacity-40"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLocked || isLoggingIn || !password.trim()}
              className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold text-sm transition-all duration-150 flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 group"
            >
              {isLoggingIn ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Access Teacher Dashboard</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Security Guarantee Footer */}
          <div className="mt-6 pt-5 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-indigo-500" />
              <span>5,000-round Salted SHA-256</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Session Isolation Active</span>
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
