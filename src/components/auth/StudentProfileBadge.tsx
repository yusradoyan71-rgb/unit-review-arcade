import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, LogOut, Sparkles, GraduationCap } from 'lucide-react';

export const StudentProfileBadge: React.FC = () => {
  const { authMode, student, logout, openLoginModal } = useAuth();

  // Classroom Mode: Show Student Login Trigger
  if (authMode === 'classroom' || !student) {
    return (
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={openLoginModal}
          title="Student Login for Tracking"
          className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 hover:border-indigo-400 text-indigo-300 hover:text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all shadow-sm group hover:scale-105 active:scale-95"
        >
          <User className="w-4 h-4 text-indigo-400 group-hover:text-cyan-300 transition-colors" />
          <span>Student Login</span>
        </button>

        <span className="hidden xl:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-medium text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
          Classroom Mode
        </span>
      </div>
    );
  }

  // Student Mode: Show Student Identity
  return (
    <div className="flex items-center gap-2">
      {/* Student Profile Card */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-cyan-500/40 shadow-md shadow-cyan-500/10">
        {/* Class Badge */}
        <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-mono font-extrabold uppercase tracking-wide">
          {student.class}
        </span>

        {/* First Name & Icon */}
        <div className="flex items-center gap-1.5">
          <GraduationCap className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-xs sm:text-sm text-slate-100 truncate max-w-[120px] sm:max-w-[160px]">
            {student.firstName}
          </span>
        </div>

        <span className="hidden sm:inline-flex text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold items-center gap-1">
          <Sparkles className="w-2.5 h-2.5" />
          Active
        </span>
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        title="Log Out of Student Account"
        aria-label="Log Out of Student Account"
        className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-500/50 text-slate-400 hover:text-rose-300 transition-all hover:scale-105 active:scale-95"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );
};
