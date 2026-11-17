import React from 'react';
import { motion } from 'framer-motion';
import { Tv, Lock } from 'lucide-react';
import { sounds } from '../../services/soundEffects';

interface PublicWelcomeScreenProps {
  onSelectStudent: () => void;
  onSelectTeacher: () => void;
}

export const PublicWelcomeScreen: React.FC<PublicWelcomeScreenProps> = ({
  onSelectStudent,
  onSelectTeacher,
}) => {
  return (
    <div className="relative min-h-screen bg-game-sky text-slate-900 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 overflow-x-hidden selection:bg-cyan-500 selection:text-white">
      
      {/* Decorative Atmosphere: Sun & Floating Clouds */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Sun Orb */}
        <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-gradient-to-tr from-amber-300 via-yellow-200 to-amber-100 opacity-60 blur-2xl" />
        <div className="absolute top-8 right-12 w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-yellow-300 shadow-xl shadow-amber-300/50 anim-pulse opacity-90 flex items-center justify-center text-3xl">
          ☀️
        </div>

        {/* Floating Cloud 1 */}
        <div className="absolute top-16 left-8 opacity-80 anim-cloud">
          <svg width="180" height="90" viewBox="0 0 180 90" fill="#ffffff">
            <path d="M 20 60 A 25 25 0 0 1 65 50 A 35 35 0 0 1 125 45 A 25 25 0 0 1 160 60 A 15 15 0 0 1 145 80 L 35 80 A 15 15 0 0 1 20 60 Z" filter="drop-shadow(0 8px 16px rgba(14,165,233,0.08))" />
          </svg>
        </div>

        {/* Floating Cloud 2 */}
        <div className="absolute top-44 right-1/4 opacity-75 anim-cloud" style={{ animationDelay: '-6s' }}>
          <svg width="220" height="110" viewBox="0 0 220 110" fill="#ffffff">
            <path d="M 30 75 A 30 30 0 0 1 85 60 A 45 45 0 0 1 160 55 A 30 30 0 0 1 200 75 A 20 20 0 0 1 180 100 L 45 100 A 20 20 0 0 1 30 75 Z" filter="drop-shadow(0 10px 20px rgba(14,165,233,0.08))" />
          </svg>
        </div>
      </div>

      {/* Main Welcome Hero Container */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card-island w-full max-w-5xl mx-auto p-6 sm:p-10 md:p-12 text-center relative z-10 overflow-hidden bg-gradient-to-b from-white via-sky-50/40 to-white shadow-2xl"
      >
        <div className="absolute -top-16 -left-16 w-52 h-52 rounded-full bg-sky-200/40 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-52 h-52 rounded-full bg-amber-200/40 blur-2xl pointer-events-none" />

        {/* Illustrated Crests */}
        <div className="inline-flex items-center justify-center gap-3 mb-4 relative z-10">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-sky-400 via-cyan-400 to-emerald-400 p-1 shadow-lg shadow-sky-400/30 flex items-center justify-center text-3xl anim-float">
            🏰
          </div>
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-purple-400 to-amber-300 p-1 shadow-md flex items-center justify-center text-2xl anim-float-delayed">
            🐣
          </div>
        </div>

        {/* Heading & Subtitle */}
        <div className="max-w-2xl mx-auto space-y-3 relative z-10">
          <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-sky-100 text-sky-800 border border-sky-300 inline-block shadow-sm">
            English Learning Arcade • Grades 7 &amp; 8
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-display text-slate-900 tracking-tight leading-tight">
            Welcome to Campus Gate
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium max-w-xl mx-auto leading-relaxed">
            Please choose your portal below. Students and teachers access completely isolated learning and reporting experiences.
          </p>
        </div>

        {/* Two Large Interactive Portal Choices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-4xl mx-auto text-left relative z-10">
          
          {/* CHOICE A: STUDENT ADVENTURE LOGIN */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-sky-50/80 to-white border-2 border-sky-300 shadow-xl shadow-sky-200/40 hover:border-sky-500 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-sky-500 text-white flex items-center justify-center text-3xl shadow-md shadow-sky-500/30 group-hover:scale-105 transition-transform">
                  🎮
                </div>
                <span className="px-3 py-1 rounded-xl text-xs font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Students
                </span>
              </div>

              <h2 className="text-2xl font-black font-display text-slate-900 mb-2 group-hover:text-sky-600 transition-colors">
                Student Adventure
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mb-6 leading-relaxed">
                Log in with your Class, Student Number, and PIN to conquer unit worlds, level up your monster, and collect Monster Coins.
              </p>

              {/* Student Features Bullets */}
              <ul className="space-y-2.5 text-xs text-slate-700 font-semibold mb-8">
                <li className="flex items-center gap-2">
                  <span className="text-base text-sky-600">🗺️</span>
                  <span>Curriculum Quests &amp; Milestone Challenges</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-base text-purple-600">🐣</span>
                  <span>Hatch, Name &amp; Evolve Companion Monster</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-base text-amber-600">🪙</span>
                  <span>Games Zone Carnival Coins &amp; Boutique Accessories</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-base text-emerald-600">🛡️</span>
                  <span>Strict Grade 7 &amp; Grade 8 Isolation</span>
                </li>
              </ul>
            </div>

            <div>
              <button
                onClick={() => {
                  sounds.playTap();
                  onSelectStudent();
                }}
                className="w-full py-4 rounded-2xl btn-game-primary font-black text-sm tracking-wide shadow-md flex items-center justify-center gap-2"
              >
                <span>ENTER STUDENT PORTAL</span>
                <span>➔</span>
              </button>
              <p className="text-center text-[11px] text-slate-400 font-medium mt-3">
                Quick PIN Login • Touchscreen &amp; Smartboard Ready
              </p>
            </div>
          </div>

          {/* CHOICE B: TEACHER & FACULTY LOGIN */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-indigo-50/80 to-white border-2 border-indigo-200 shadow-xl shadow-indigo-200/40 hover:border-indigo-400 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-3xl shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
                  👩‍🏫
                </div>
                <span className="px-3 py-1 rounded-xl text-xs font-black uppercase bg-indigo-100 text-indigo-800 border border-indigo-300">
                  Faculty Only
                </span>
              </div>

              <h2 className="text-2xl font-black font-display text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                Teacher Portal
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mb-6 leading-relaxed">
                Authorized educator workspace for classroom accuracy telemetry, student diagnostic review, and gradebook exports.
              </p>

              {/* Teacher Features Bullets */}
              <ul className="space-y-2.5 text-xs text-slate-700 font-semibold mb-8">
                <li className="flex items-center gap-2">
                  <span className="text-base text-indigo-600">📊</span>
                  <span>Live Cohort Accuracy &amp; Telemetry Analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-base text-blue-600">📋</span>
                  <span>Class 8A, 8B, 7A, 7B Student Progress Directory</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-base text-rose-600">🎯</span>
                  <span>Diagnostic Review of Common Student Mistakes</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-base text-emerald-600">📁</span>
                  <span>Instant CSV Gradebook &amp; Mastery Export</span>
                </li>
              </ul>
            </div>

            <div>
              <button
                onClick={() => {
                  sounds.playTap();
                  onSelectTeacher();
                }}
                className="w-full py-4 rounded-2xl btn-game-purple font-black text-sm tracking-wide shadow-md flex items-center justify-center gap-2"
              >
                <span>ENTER TEACHER PORTAL</span>
                <span>➔</span>
              </button>
              <p className="text-center text-[11px] text-slate-400 font-medium mt-3">
                Staff credentials required • Fully separated system
              </p>
            </div>
          </div>

        </div>

        {/* Classroom Smartboard Banner */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <Tv className="w-4 h-4 text-sky-600" />
            <span><strong>Classroom Smartboard Ready:</strong> Large 48px+ touch targets for interactive classroom displays.</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span><strong>Role Separation:</strong> Zero student access to teacher controls or data.</span>
          </div>
        </div>

      </motion.div>
    </div>
  );
};
