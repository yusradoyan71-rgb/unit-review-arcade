import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useGamification } from '../../context/GamificationContext';
import { sounds } from '../../services/soundEffects';
import { User, LogOut, GraduationCap, Award } from 'lucide-react';

export const StudentProfileBadge: React.FC = () => {
  const { authMode, student, logout, openLoginModal } = useAuth();
  const { profile, openProfileModal } = useGamification();

  // Classroom Mode: Show Student Login Trigger
  if (authMode === 'classroom' || !student) {
    return (
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={openLoginModal}
          title="Student Login for Tracking"
          className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-sm hover:scale-105 active:scale-95"
        >
          <User className="w-4 h-4" />
          <span>Student Login</span>
        </button>

        <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-600">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          Classroom Mode
        </span>
      </div>
    );
  }

  // Student Mode: Show Student Identity & Interactive Gamification Pill
  return (
    <div className="flex items-center gap-2">
      {/* Student Profile Card (Clickable to open Profile & Badges) */}
      <button
        onClick={() => {
          sounds.playTap();
          openProfileModal();
        }}
        title="View Student Profile & Badges"
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-sky-50/80 border-2 border-sky-100 hover:border-sky-300 shadow-sm transition-all hover:scale-105 active:scale-95 text-left group"
      >
        {/* Class Badge */}
        <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-xs font-mono font-extrabold uppercase tracking-wide shadow-xs">
          {student.class}
        </span>

        {/* Level Badge (if loaded) */}
        {profile?.level ? (
          <span className="px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-mono font-extrabold flex items-center gap-0.5">
            <Award className="w-2.5 h-2.5 text-amber-600" />
            Lv.{profile.level}
          </span>
        ) : null}

        {/* First Name */}
        <div className="flex items-center gap-1.5">
          <GraduationCap className="w-4 h-4 text-sky-600 group-hover:text-indigo-600 transition-colors" />
          <span className="font-bold text-xs sm:text-sm text-slate-800 truncate max-w-[100px] sm:max-w-[140px]">
            {student.firstName}
          </span>
        </div>

        {/* XP Tag */}
        {profile?.totalXp !== undefined && (
          <span className="hidden md:inline-flex text-[11px] font-mono font-extrabold text-amber-600">
            {profile.totalXp} XP
          </span>
        )}
      </button>

      {/* Logout Button */}
      <button
        onClick={logout}
        title="Log Out of Student Account"
        aria-label="Log Out of Student Account"
        className="p-2 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-slate-400 hover:text-rose-600 transition-all hover:scale-105 active:scale-95 shadow-xs"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );
};
