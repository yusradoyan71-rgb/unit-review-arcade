import React from 'react';
import { useArcade } from '../../context/ArcadeContext';
import { useAuth } from '../../context/AuthContext';
import { useGamification } from '../../context/GamificationContext';
import { MonsterAvatar } from '../monster/MonsterAvatar';
import { MonsterService } from '../../services/monsterService';
import { CoinService } from '../../services/coinService';
import { calculateLevelFromXp } from '../../utils/gamification';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ChevronRight, 
  ShieldAlert, 
  Gamepad2, 
  Layers, 
  Zap, 
  Tv, 
  HardDrive,
  Coins
} from 'lucide-react';
import { sounds } from '../../services/soundEffects';

export const HomeScreen: React.FC = () => {
  const { goToGrade, openTeacherPanel, navigateTo, data } = useArcade();
  const { student } = useAuth();
  const { profile: gamificationProfile } = useGamification();

  const grade7Count = data.units['grade-7']?.length || 0;
  const grade8Count = data.units['grade-8']?.length || 0;

  // Student Monster & Economy state
  const studentNumber = student?.studentNumber || '';
  const monsterConfig = student?.monster || MonsterService.getMonster(studentNumber);
  const coinBalance = student?.totalCoins ?? CoinService.getBalance(studentNumber);

  // Level & XP calculations (supporting unlimited levels)
  const totalXp = gamificationProfile?.totalXp || 0;
  const levelInfo = gamificationProfile?.level
    ? {
        level: gamificationProfile.level,
        title: gamificationProfile.levelTitle,
        progressPercent: gamificationProfile.progressPercent,
        currentLevelXp: gamificationProfile.currentLevelXp,
        nextLevelXp: gamificationProfile.nextLevelXp,
      }
    : calculateLevelFromXp(totalXp);

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

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-slate-400 text-base sm:text-lg md:text-xl font-medium max-w-2xl mx-auto"
        >
          {student
            ? `Welcome, ${student.firstName}! Review your ${student.grade === 'grade-7' ? 'Grade 7' : 'Grade 8'} curriculum units and launch interactive games.`
            : 'Select a grade level to open the unit library and launch interactive classroom games.'}
        </motion.p>
      </div>

      {/* Featured Sections Grid: Games Zone & Monster World */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto w-full mb-6">
        {/* CARD 1: GAMES ZONE */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.99 }}
          onMouseEnter={() => sounds.playHover()}
          onClick={() => {
            sounds.playNavigate();
            navigateTo({ view: 'games-zone' });
          }}
          className="relative cursor-pointer w-full p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-indigo-950/90 via-slate-900/95 to-purple-950/90 border-2 border-indigo-500/40 hover:border-indigo-400 shadow-xl shadow-indigo-950/40 flex flex-col justify-between overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-500" />
          
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-black uppercase tracking-wider">
                Interactive Arcade
              </span>
              <span className="text-xs font-bold text-slate-400">4 Games</span>
            </div>

            <div className="flex items-center gap-4 mb-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/40 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shrink-0">
                <Sparkles className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-indigo-200 transition-colors tracking-tight">
                  GAMES ZONE
                </h2>
                <span className="text-xs text-indigo-300 font-semibold">Word Ninja, Runner & more</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Speed, vocabulary, and grammar challenges independent of unit curriculum. Earn bonus XP and Monster Coins!
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Play Games Zone
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </motion.div>

        {/* CARD 2: MONSTER WORLD */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.99 }}
          onMouseEnter={() => sounds.playHover()}
          onClick={() => {
            sounds.playNavigate();
            navigateTo({ view: 'monster-world' });
          }}
          className="relative cursor-pointer w-full p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-purple-950/90 via-slate-900/95 to-amber-950/70 border-2 border-amber-500/40 hover:border-amber-400 shadow-xl shadow-amber-950/30 flex flex-col justify-between overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/20 transition-all duration-500" />
          
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <Coins className="w-3 h-3 text-amber-400" />
                {coinBalance} Coins
              </span>
              <span className="text-xs font-bold text-purple-300">
                Lvl {levelInfo.level} • {levelInfo.title}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-900/80 to-slate-950 flex items-center justify-center border border-purple-500/30 shadow-lg group-hover:scale-110 transition-transform duration-300 shrink-0 overflow-hidden">
                <MonsterAvatar config={monsterConfig} size={52} animate />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-amber-200 transition-colors tracking-tight flex items-center gap-2">
                  <span>MONSTER WORLD</span>
                </h2>
                <span className="text-xs text-amber-300/90 font-semibold truncate block">
                  Companion: {monsterConfig.name}
                </span>
              </div>
            </div>

            {/* Level XP Progress Bar */}
            <div className="mt-2 mb-2">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-1">
                <span>XP Progress</span>
                <span className="text-indigo-300">{levelInfo.progressPercent}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 border border-slate-700/60 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${levelInfo.progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Customize Companion & View Shop
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Interactive Grade Cards Grid (Strict Content Isolation) */}
      <div className={`gap-6 md:gap-8 mx-auto w-full my-auto py-4 ${
        student ? 'flex justify-center max-w-xl' : 'grid grid-cols-1 md:grid-cols-2 max-w-5xl'
      }`}>
        
        {/* CARD 1: GRADE 7 (Strictly hidden for Grade 8 students) */}
        {(!student || student.grade === 'grade-7') && (
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={() => sounds.playHover()}
            onClick={() => goToGrade('grade-7')}
            className="group relative cursor-pointer w-full rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/95 border-2 border-cyan-500/30 hover:border-cyan-400 p-6 sm:p-8 md:p-10 shadow-2xl hover:glow-cyan transition-all duration-300 flex flex-col justify-between overflow-hidden"
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
        )}

        {/* CARD 2: GRADE 8 (Strictly hidden for Grade 7 students) */}
        {(!student || student.grade === 'grade-8') && (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={() => sounds.playHover()}
            onClick={() => goToGrade('grade-8')}
            className="group relative cursor-pointer w-full rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/95 border-2 border-purple-500/30 hover:border-purple-400 p-6 sm:p-8 md:p-10 shadow-2xl hover:glow-purple transition-all duration-300 flex flex-col justify-between overflow-hidden"
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
        )}

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
