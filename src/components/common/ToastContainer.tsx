import React from 'react';
import { useArcade } from '../../context/ArcadeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Info, AlertTriangle, AlertCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useArcade();

  const getIcon = (type: 'success' | 'info' | 'warning' | 'error') => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-sky-400 shrink-0" />;
    }
  };

  const getBorderColor = (type: 'success' | 'info' | 'warning' | 'error') => {
    switch (type) {
      case 'success':
        return 'border-2 border-emerald-200 bg-white/95 text-emerald-950 shadow-emerald-500/10';
      case 'warning':
        return 'border-2 border-amber-200 bg-white/95 text-amber-950 shadow-amber-500/10';
      case 'error':
        return 'border-2 border-rose-200 bg-white/95 text-rose-950 shadow-rose-500/10';
      case 'info':
      default:
        return 'border-2 border-sky-200 bg-white/95 text-sky-950 shadow-sky-500/10';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-xl backdrop-blur-md ${getBorderColor(
              toast.type
            )}`}
          >
            <div className="flex items-center gap-3">
              {getIcon(toast.type)}
              <p className="text-sm font-bold text-slate-800">{toast.text}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
