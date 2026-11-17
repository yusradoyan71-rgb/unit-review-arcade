import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  HelpCircle, 
  Tv, 
  AlertCircle, 
  Loader2 
} from 'lucide-react';
import { sounds } from '../../services/soundEffects';

interface StudentLoginScreenProps {
  onBackToWelcome: () => void;
  onEnterGuestMode?: () => void;
}

export const StudentLoginScreen: React.FC<StudentLoginScreenProps> = ({ onBackToWelcome, onEnterGuestMode }) => {
  const { 
    login, 
    isLoading, 
    loginError, 
    clearError,
    enterClassroomMode,
    isLiveBackend 
  } = useAuth();

  const [studentClass, setStudentClass] = useState<'8A' | '8B' | '7A' | '7B'>('8A');
  const [studentNumber, setStudentNumber] = useState<string>('801');
  const [pin, setPin] = useState<string>('');
  const [showDemoHelp, setShowDemoHelp] = useState<boolean>(false);

  // Number pad tap handler
  const handleNumClick = (digit: string) => {
    sounds.playTap();
    clearError();
    if (pin.length < 4) {
      setPin(prev => prev + digit);
    }
  };

  const handleClearPin = () => {
    sounds.playTap();
    clearError();
    setPin('');
  };

  // Submit handler
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!studentNumber.trim() || !pin.trim() || isLoading) return;

    sounds.playTap();
    await login({
      studentNumber: studentNumber.trim(),
      pin: pin.trim(),
    });
  };

  // Quick select test accounts
  const handleSelectDemo = (num: string, cls: '8A' | '8B' | '7A' | '7B', demoPin: string) => {
    sounds.playTap();
    clearError();
    setStudentNumber(num);
    setStudentClass(cls);
    setPin(demoPin);
  };

  return (
    <div className="relative min-h-screen bg-game-sky text-slate-900 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 overflow-x-hidden selection:bg-cyan-500 selection:text-white">
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-12 left-10 opacity-70 anim-cloud">
          <svg width="180" height="90" viewBox="0 0 180 90" fill="#ffffff">
            <path d="M 20 60 A 25 25 0 0 1 65 50 A 35 35 0 0 1 125 45 A 25 25 0 0 1 160 60 A 15 15 0 0 1 145 80 L 35 80 A 15 15 0 0 1 20 60 Z" filter="drop-shadow(0 8px 16px rgba(14,165,233,0.08))" />
          </svg>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="card-island w-full max-w-2xl mx-auto p-6 sm:p-10 shadow-2xl relative z-10 overflow-hidden bg-white"
      >
        {/* Top Bar with Back Button */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
          <button
            onClick={() => {
              sounds.playTap();
              clearError();
              onBackToWelcome();
            }}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 border border-slate-300 shadow-sm transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Public Welcome</span>
          </button>

          <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-sky-100 text-sky-800 border border-sky-300 shadow-sm">
            Student Adventure Gate
          </span>
        </div>

        {/* Mascot / Title */}
        <div className="text-center max-w-md mx-auto space-y-2 mb-6">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-sky-400 to-cyan-300 text-white flex items-center justify-center text-3xl shadow-md shadow-sky-400/30 anim-float">
            🎮
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-slate-900">
            Student Sign In
          </h1>
          <p className="text-xs text-slate-600 font-medium">
            Select your class and enter your student number &amp; PIN to launch your quests.
          </p>
        </div>

        {/* Server Status Indicator */}
        <div className="max-w-md mx-auto mb-4 flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <span className="text-slate-600 flex items-center gap-1.5 font-medium">
            <span className={`w-2 h-2 rounded-full ${isLiveBackend ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            {isLiveBackend ? 'Cloud Server Connected' : 'Local Demo Mode Active'}
          </span>
          <button
            type="button"
            onClick={() => setShowDemoHelp(prev => !prev)}
            className="text-sky-700 hover:text-sky-900 font-bold flex items-center gap-1 text-[11px]"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Test Accounts</span>
          </button>
        </div>

        {/* Demo Accounts Helper Drawer */}
        <AnimatePresence>
          {showDemoHelp && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-md mx-auto mb-5 p-3 rounded-2xl bg-sky-50 border border-sky-200 text-xs space-y-2 overflow-hidden"
            >
              <div className="flex items-center justify-between font-bold text-sky-900">
                <span>Select a sample student account:</span>
                <span className="text-[10px] text-sky-600">Default PIN: 1234</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectDemo('801', '8A', '1234')}
                  className="p-2 rounded-xl bg-white hover:bg-sky-100/70 border border-sky-300 text-left transition-colors"
                >
                  <span className="font-bold text-slate-900 block">Student 801 (Alex)</span>
                  <span className="text-[10px] text-sky-700">Class 8A • Grade 8</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectDemo('701', '7A', '1234')}
                  className="p-2 rounded-xl bg-white hover:bg-sky-100/70 border border-sky-300 text-left transition-colors"
                >
                  <span className="font-bold text-slate-900 block">Student 701 (Liam)</span>
                  <span className="text-[10px] text-emerald-700">Class 7A • Grade 7</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Alert */}
        <AnimatePresence>
          {loginError && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="max-w-md mx-auto mb-4 p-3 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 font-medium shadow-sm"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{loginError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
          
          {/* 1. Class Selection */}
          <div>
            <label className="block text-xs font-black uppercase text-slate-500 tracking-wider mb-1.5 text-center">
              1. Select Your Class
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['8A', '8B', '7A', '7B'] as const).map(cls => {
                const isSelected = studentClass === cls;
                return (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => {
                      sounds.playTap();
                      setStudentClass(cls);
                      if (cls.startsWith('7') && studentNumber.startsWith('8')) {
                        setStudentNumber('701');
                      } else if (cls.startsWith('8') && studentNumber.startsWith('7')) {
                        setStudentNumber('801');
                      }
                    }}
                    className={`py-2 rounded-xl font-black text-sm transition-all ${
                      isSelected
                        ? 'bg-sky-600 text-white shadow-sm border-b-2 border-sky-800'
                        : 'bg-slate-50 hover:bg-sky-50 text-slate-700 border-2 border-slate-200'
                    }`}
                  >
                    {cls}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Student Number Input */}
          <div>
            <label className="block text-xs font-black uppercase text-slate-500 tracking-wider mb-1.5 text-center">
              2. Student Number
            </label>
            <input
              type="text"
              value={studentNumber}
              onChange={e => setStudentNumber(e.target.value)}
              placeholder="e.g. 801"
              className="w-full py-3 px-4 rounded-2xl bg-slate-50 border-2 border-sky-200 font-mono text-center text-xl font-black text-slate-900 focus:outline-none focus:border-sky-500 transition-colors shadow-inner"
            />
          </div>

          {/* 3. Security PIN Display & Numeric Keypad */}
          <div>
            <label className="block text-xs font-black uppercase text-slate-500 tracking-wider mb-1.5 text-center">
              3. Security PIN (4 Digits)
            </label>

            {/* 4-Dot Secret Display */}
            <div className="flex items-center justify-center gap-4 py-3 bg-slate-50 rounded-2xl border-2 border-slate-200 mb-3 shadow-inner">
              {[0, 1, 2, 3].map(idx => (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full transition-all duration-200 ${
                    pin.length > idx
                      ? 'bg-sky-600 scale-110 shadow-sm'
                      : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>

            {/* Friendly Number Pad */}
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => handleNumClick(d)}
                  className="py-3 rounded-2xl bg-white hover:bg-sky-50 border-2 border-slate-200 font-mono text-xl font-black text-slate-800 shadow-sm active:translate-y-1 transition-all"
                >
                  {d}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClearPin}
                className="py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 border-2 border-rose-200 font-bold text-rose-700 text-xs shadow-sm active:translate-y-1 transition-all"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => handleNumClick('0')}
                className="py-3 rounded-2xl bg-white hover:bg-sky-50 border-2 border-slate-200 font-mono text-xl font-black text-slate-800 shadow-sm active:translate-y-1 transition-all"
              >
                0
              </button>
              <button
                type="submit"
                disabled={isLoading || pin.length === 0}
                className={`py-3 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-1 ${
                  isLoading || pin.length === 0
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed border-b-2 border-slate-300'
                    : 'btn-game-primary'
                }`}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span>GO ➔</span>
                )}
              </button>
            </div>
          </div>

          {/* Smartboard Mode / Classroom Bypass */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <button
              type="button"
              onClick={() => {
                enterClassroomMode();
                onEnterGuestMode?.();
              }}
              className="font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1.5 transition-colors"
            >
              <Tv className="w-3.5 h-3.5 text-amber-500" />
              <span>Smartboard Guest Mode (No Account)</span>
            </button>
            <span className="text-slate-400 font-medium">
              Classroom Smartboard Terminal Ready
            </span>
          </div>

        </form>

      </motion.div>
    </div>
  );
};
