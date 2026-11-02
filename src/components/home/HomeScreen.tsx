import React from 'react';
import { useArcade } from '../../context/ArcadeContext';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ChevronRight, 
  ShieldAlert, 
  Gamepad2, 
  Layers, 
  Zap, 
  Tv, 
  HardDrive
} from 'lucide-react';
import { sounds } from '../../services/soundEffects';

export const HomeScreen: React.FC = () => {
  const { goToGrade, openTeacherPanel, data } = useArcade();

  const grade7Count = data.units['grade-7']?.length || 0;
  const grade8Count = data.units['grade-8']?.length || 0;

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] flex flex-col justify-between py-6 px-4 md:px-8 max-w-7xl mx-auto w-full">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Title Section */}
      <div className="text-center pt-2 pb-6 md:pt-4 md:pb-8">
        {/* Arcade Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-semibold uppercase tracking-widest shadow-lg shadow-indigo-500/5 mb-4"
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Smartboard Classroom Platform</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-arcade text-4xl sm:text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-indigo-300 to-fuchsia-300 tracking-tight drop-shadow-sm mb-3"
        >
          UNIT REVIEW ARCADE
        </motion.h1>

        {/* Subtitle - Zero Educational Content */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-slate-400 text-base sm:text-lg md:text-xl font-medium max-w-2xl mx-auto"
        >
          Select a grade level to open the unit library and launch interactive classroom games.
        </motion.p>
      </div>

      {/* Main Interactive Grade Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto w-full my-auto py-4">
        
        {/* CARD 1: GRADE 7 */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ y: -6, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.98 }}
          onMouseEnter={() => sounds.playHover()}
          onClick={() => goToGrade('grade-7')}
          className="group relative cursor-pointer rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/95 border-2 border-cyan-500/30 hover:border-cyan-400 p-6 sm:p-8 md:p-10 shadow-2xl hover:glow-cyan transition-all duration-300 flex flex-col justify-between overflow-hidden"
        >
          {/* Card Ambient Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/20 transition-all duration-500" />
          
          <div>
            {/* Top Row: Badge & Status */}
            <div className="flex items-center justify-between gap-2 mb-6">
              <span className="px-3.5 py-1 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
                Level 07
              </span>
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                {grade7Count === 0 ? 'Empty Library' : `${grade7Count} Unit${grade7Count > 1 ? 's' : ''}`}
              </span>
            </div>

            {/* Icon & Heading */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 mb-6 group-hover:scale-110 transition-transform duration-300">
              <Gamepad2 className="w-9 h-9 sm:w-11 sm:h-11" />
            </div>

            <h2 className="font-arcade text-3xl sm:text-4xl md:text-5xl font-black text-white group-hover:text-cyan-200 transition-colors tracking-tight mb-2">
              GRADE 7
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Open the Grade 7 unit library to review curriculum units through interactive smartboard challenges.
            </p>
          </div>

          {/* Action Trigger Button */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between">
            <span className="font-semibold text-cyan-300 text-base sm:text-lg flex items-center gap-2 group-hover:translate-x-1 transition-transform">
              Open Unit Library
            </span>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all">
              <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </motion.div>

        {/* CARD 2: GRADE 8 */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ y: -6, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.98 }}
          onMouseEnter={() => sounds.playHover()}
          onClick={() => goToGrade('grade-8')}
          className="group relative cursor-pointer rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/95 border-2 border-purple-500/30 hover:border-purple-400 p-6 sm:p-8 md:p-10 shadow-2xl hover:glow-purple transition-all duration-300 flex flex-col justify-between overflow-hidden"
        >
          {/* Card Ambient Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-purple-500/20 transition-all duration-500" />
          
          <div>
            {/* Top Row: Badge & Status */}
            <div className="flex items-center justify-between gap-2 mb-6">
              <span className="px-3.5 py-1 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
                Level 08
              </span>
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                {grade8Count === 0 ? 'Empty Library' : `${grade8Count} Unit${grade8Count > 1 ? 's' : ''}`}
              </span>
            </div>

            {/* Icon & Heading */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/30 mb-6 group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-9 h-9 sm:w-11 sm:h-11" />
            </div>

            <h2 className="font-arcade text-3xl sm:text-4xl md:text-5xl font-black text-white group-hover:text-purple-200 transition-colors tracking-tight mb-2">
              GRADE 8
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Open the Grade 8 unit library to review curriculum units through interactive smartboard challenges.
            </p>
          </div>

          {/* Action Trigger Button */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between">
            <span className="font-semibold text-purple-300 text-base sm:text-lg flex items-center gap-2 group-hover:translate-x-1 transition-transform">
              Open Unit Library
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-slate-950 transition-all">
              <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </motion.div>

      </div>

      {/* Classroom Smartboard Footer Strip & Discreet Teacher Panel */}
      <div className="pt-6 pb-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        
        {/* Status Indicators */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5">
            <Tv className="w-4 h-4 text-slate-400" />
            <span>16:9 Smartboard Optimized</span>
          </div>
          <div className="flex items-center gap-1.5">
            <HardDrive className="w-4 h-4 text-emerald-400" />
            <span>Local Storage Active</span>
          </div>
        </div>

        {/* Discreet Teacher Panel Access */}
        <button
          onClick={() => openTeacherPanel('units')}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-amber-300 border border-slate-800 hover:border-amber-500/30 transition-all"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span>Teacher Control Panel</span>
        </button>

      </div>
    </div>
  );
};
