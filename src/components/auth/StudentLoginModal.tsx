import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  KeyRound, 
  User, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  GraduationCap, 
  Tv, 
  HelpCircle
} from 'lucide-react';
import { sounds } from '../../services/soundEffects';

export const StudentLoginModal: React.FC = () => {
  const { 
    isLoginModalOpen, 
    closeLoginModal, 
    login, 
    isLoading, 
    loginError, 
    clearError,
    enterClassroomMode,
    isLiveBackend
  } = useAuth();

  const [studentNumber, setStudentNumber] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [showDemoHelp, setShowDemoHelp] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentNumber.trim() || !pin.trim() || isLoading) return;

    sounds.playTap();
    const success = await login({
      studentNumber: studentNumber.trim(),
      pin: pin.trim(),
    });

    if (success) {
      setStudentNumber('');
      setPin('');
    }
  };

  const handleSelectDemoAccount = (num: string, demoPin: string) => {
    sounds.playTap();
    setStudentNumber(num);
    setPin(demoPin);
    clearError();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        className="w-full max-w-md rounded-3xl bg-slate-900 border-2 border-indigo-500/40 p-6 sm:p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Glow ambient background */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-arcade text-lg sm:text-xl font-bold text-white tracking-tight">
                STUDENT LOGIN
              </h3>
              <p className="text-slate-400 text-xs">
                Enter your details to track your unit review progress.
              </p>
            </div>
          </div>

          <button
            onClick={closeLoginModal}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live / Demo Mode Status Indicator */}
        <div className="mb-5 flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
          <span className="text-slate-400 flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isLiveBackend ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            {isLiveBackend ? 'Google Sheets Server Connected' : 'Local Demo Mode Active'}
          </span>
          <button
            type="button"
            onClick={() => setShowDemoHelp((prev) => !prev)}
            className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 text-[11px]"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Test Accounts</span>
          </button>
        </div>

        {/* Demo Accounts Quick-Select Drawer */}
        <AnimatePresence>
          {showDemoHelp && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-5 p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 overflow-hidden text-xs"
            >
              <div className="flex items-center justify-between font-bold text-indigo-300 mb-2">
                <span>Quick Test Accounts (Classes 7A, 7B, 8A, 8B):</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleSelectDemoAccount('701', '1234')}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left text-slate-300 hover:text-white transition-colors"
                >
                  <strong className="text-cyan-400">[7A]</strong> No: <strong>701</strong> (PIN: 1234)
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectDemoAccount('703', '1111')}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left text-slate-300 hover:text-white transition-colors"
                >
                  <strong className="text-cyan-400">[7B]</strong> No: <strong>703</strong> (PIN: 1111)
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectDemoAccount('801', '1234')}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left text-slate-300 hover:text-white transition-colors"
                >
                  <strong className="text-purple-400">[8A]</strong> No: <strong>801</strong> (PIN: 1234)
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectDemoAccount('803', '1111')}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left text-slate-300 hover:text-white transition-colors"
                >
                  <strong className="text-purple-400">[8B]</strong> No: <strong>803</strong> (PIN: 1111)
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Alert Box */}
        {loginError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300"
          >
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="flex-1 leading-snug">{loginError}</span>
          </motion.div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Student Number Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Student Number:
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                autoComplete="username"
                value={studentNumber}
                onChange={(e) => {
                  setStudentNumber(e.target.value);
                  clearError();
                }}
                placeholder="e.g. 701 or 142"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-950 border-2 border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white placeholder-slate-500 text-base font-semibold transition-all outline-none"
                required
              />
            </div>
          </div>

          {/* Student PIN Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Personal PIN:
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <input
                type={showPin ? 'text' : 'password'}
                inputMode="numeric"
                autoComplete="current-password"
                maxLength={8}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  clearError();
                }}
                placeholder="Enter PIN (e.g. 1234)"
                className="w-full pl-11 pr-11 py-3.5 rounded-2xl bg-slate-950 border-2 border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white placeholder-slate-500 text-base font-mono tracking-wider transition-all outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !studentNumber.trim() || !pin.trim()}
            className="w-full mt-2 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-base shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to Arcade</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-900 px-3 text-slate-500 font-semibold">Or</span>
          </div>
        </div>

        {/* Classroom Mode (Guest) Bypass Button */}
        <button
          type="button"
          onClick={enterClassroomMode}
          className="w-full py-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all"
        >
          <Tv className="w-4 h-4 text-amber-400" />
          <span>Continue in Classroom Mode (No Login)</span>
        </button>
      </motion.div>
    </div>
  );
};
