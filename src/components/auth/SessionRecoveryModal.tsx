/**
 * UNIT REVIEW ARCADE — IN-PLACE SESSION RECOVERY MODAL (PHASE 4)
 * 
 * Prompts the student for their PIN if their session expires mid-game,
 * seamlessly restoring their session token without losing question progress,
 * score, or queued answers.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ApiService } from '../../services/apiService';
import { sounds } from '../../services/soundEffects';
import { KeyRound, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';

interface SessionRecoveryModalProps {
  isOpen: boolean;
  studentNumber: string;
  studentName?: string;
  onSuccess: (newSessionToken: string) => void;
  onCancel: () => void;
}

export const SessionRecoveryModal: React.FC<SessionRecoveryModalProps> = ({
  isOpen,
  studentNumber,
  studentName,
  onSuccess,
  onCancel,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4) {
      setError('Please enter your 4-digit PIN.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await ApiService.login({
        studentNumber,
        pin,
      });

      if (res.success && res.sessionToken) {
        sounds.playSuccess();
        onSuccess(res.sessionToken);
      } else {
        sounds.playBack();
        setError(res.error || 'Incorrect PIN. Please try again.');
      }
    } catch (err) {
      sounds.playBack();
      setError(err instanceof Error ? err.message : 'Network error during PIN verification.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinDigit = (digit: string) => {
    if (pin.length < 4) {
      sounds.playTap();
      setPin((prev) => prev + digit);
      setError(null);
    }
  };

  const handleBackspace = () => {
    sounds.playTap();
    setPin((prev) => prev.slice(0, -1));
    setError(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-sm rounded-3xl bg-white border-2 border-amber-200 p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden"
        >
          <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-50 border-2 border-amber-200 text-amber-600 flex items-center justify-center mb-4 shadow-sm">
            <KeyRound className="w-8 h-8" />
          </div>

          <h3 className="font-arcade text-xl font-bold text-slate-900 mb-1">
            Session Expired
          </h3>
          <p className="text-slate-600 text-xs mb-4">
            Enter your 4-digit PIN for student <strong className="text-amber-600 font-bold">#{studentNumber}</strong> {studentName ? `(${studentName})` : ''} to save your progress.
          </p>

          {error && (
            <div className="mb-4 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* PIN Dots Display */}
            <div className="flex justify-center gap-3 my-2">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono text-2xl font-bold border-2 transition-all ${
                    idx < pin.length
                      ? 'bg-amber-100 border-amber-400 text-amber-800 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-300'
                  }`}
                >
                  {idx < pin.length ? '●' : '—'}
                </div>
              ))}
            </div>

            {/* Smartboard / Touch Keypad */}
            <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto pt-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handlePinDigit(digit)}
                  className="py-3 rounded-xl bg-slate-50 hover:bg-amber-50 active:bg-amber-100 text-slate-800 font-mono font-bold text-lg border border-slate-200 transition-all hover:scale-105 active:scale-95 shadow-xs"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={handleBackspace}
                className="py-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 font-mono font-semibold text-xs border border-slate-200 shadow-xs"
              >
                ⌫
              </button>
              <button
                type="button"
                onClick={() => handlePinDigit('0')}
                className="py-3 rounded-xl bg-slate-50 hover:bg-amber-50 active:bg-amber-100 text-slate-800 font-mono font-bold text-lg border border-slate-200 shadow-xs"
              >
                0
              </button>
              <button
                type="submit"
                disabled={pin.length !== 4 || isLoading}
                className="py-3 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 disabled:opacity-40 disabled:pointer-events-none text-white font-mono font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'OK'}
              </button>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onCancel}
                className="text-xs text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center gap-1.5 mx-auto font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Exit without saving</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
