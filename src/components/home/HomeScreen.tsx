import React from 'react';
import { useArcade } from '../../context/ArcadeContext';
import { useAuth } from '../../context/AuthContext';
import { useGamification } from '../../context/GamificationContext';
import { usePersonalizedLearning } from '../../context/PersonalizedLearningContext';
import { MonsterAvatar } from '../monster/MonsterAvatar';
import { MonsterService } from '../../services/monsterService';
import { CoinService } from '../../services/coinService';
import { calculateLevelFromXp } from '../../utils/gamification';
import { getMonsterMilestoneInfo } from '../../types/monster';
import { sounds } from '../../services/soundEffects';
import { motion } from 'framer-motion';
import { 
  Target, 
  Trophy, 
  LogOut 
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const { goToGrade, navigateTo, data } = useArcade();
  const { student, logout } = useAuth();
  const { profile: gamificationProfile, openProfileModal, openLeaderboardModal } = useGamification();
  const { openMistakesModal, uncorrectedMistakesCount } = usePersonalizedLearning();

  const activeGrade = student?.grade || 'grade-8';
  const gradeUnits = data.units[activeGrade] || [];
  const unitCount = gradeUnits.length;

  // Student Monster & Economy state
  const studentNumber = student?.studentNumber || '';
  const monsterConfig = MonsterService.resolveMonster(student?.monster, studentNumber);
  const coinBalance = student?.totalCoins ?? CoinService.getBalance(studentNumber);
  const currentTotalXp = gamificationProfile?.totalXp || 0;
  const milestoneInfo = getMonsterMilestoneInfo(currentTotalXp);

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

  // Calculate daily streak
  const streakDays = (gamificationProfile as unknown as { streakDays?: number })?.streakDays || 1;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-game-sky text-slate-900 flex flex-col py-6 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto w-full space-y-6 selection:bg-cyan-500 selection:text-white">
      
      {/* Background Decor: Sun & Floating Clouds */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-gradient-to-tr from-amber-300 via-yellow-200 to-amber-100 opacity-60 blur-2xl" />
        <div className="absolute top-8 right-12 w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-yellow-300 shadow-xl shadow-amber-300/50 anim-pulse opacity-85 flex items-center justify-center text-3xl">
          ☀️
        </div>
        <div className="absolute top-20 left-10 opacity-75 anim-cloud">
          <svg width="180" height="90" viewBox="0 0 180 90" fill="#ffffff">
            <path d="M 20 60 A 25 25 0 0 1 65 50 A 35 35 0 0 1 125 45 A 25 25 0 0 1 160 60 A 15 15 0 0 1 145 80 L 35 80 A 15 15 0 0 1 20 60 Z" filter="drop-shadow(0 8px 16px rgba(14,165,233,0.08))" />
          </svg>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 1. FLOATING CAMPUS SKY HEADER (STUDENT PROFILE, STATS & NAV)        */}
      {/* =================================================================== */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="card-island p-4 sm:p-5 relative z-10 overflow-hidden space-y-4"
      >
        <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-sky-100/50 pointer-events-none" />

        {/* Top Row: Student Profile & Gamification Stats */}
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          
          {/* Student Profile Avatar & Name */}
          <div className="flex items-center gap-3.5">
            <div 
              onClick={() => {
                sounds.playTap();
                openProfileModal();
              }}
              title="View Student Passport"
              className="relative w-16 h-16 rounded-3xl bg-gradient-to-tr from-sky-300 via-turquoise-200 to-amber-200 p-1 shadow-md shadow-sky-400/20 cursor-pointer flex-shrink-0 hover:scale-105 transition-transform"
            >
              <div className="w-full h-full bg-white rounded-[20px] flex items-center justify-center overflow-hidden border-2 border-white">
                <MonsterAvatar
                  config={monsterConfig}
                  size={52}
                  animate
                  stage={milestoneInfo.stage}
                  evolutionTier={milestoneInfo.evolutionTier}
                />
              </div>
              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 bg-amber-400 text-amber-950 text-[10px] font-black rounded-lg shadow-sm border border-white">
                Lv.{levelInfo.level}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black font-display text-slate-900">
                  {student ? (student.firstName || student.displayName || `Student ${student.studentNumber}`) : 'Guest Explorer'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-sky-100 text-sky-800 border border-sky-300 shadow-sm">
                  {student ? `Grade ${student.grade === 'grade-7' ? '7' : '8'} • Class ${student.class}` : 'Guest Mode'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mt-0.5">
                <span>
                  Companion: <strong className="text-purple-600">{milestoneInfo.isEgg ? milestoneInfo.stageName : monsterConfig.name}</strong>
                </span>
                <span>•</span>
                <span className="text-amber-600 font-bold">
                  {milestoneInfo.stageName}
                </span>
              </div>
            </div>
          </div>

          {/* Gamification Stats Bar */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* XP & Unlimited Level Progress */}
            <div className="bg-sky-50/90 px-4 py-2 rounded-2xl border-2 border-sky-200 flex flex-col justify-center min-w-[170px] shadow-sm">
              <div className="flex items-center justify-between text-xs font-black mb-1">
                <span className="text-sky-900">Level {levelInfo.level} {levelInfo.title}</span>
                <span className="font-mono text-sky-600 font-bold">{totalXp.toLocaleString()} XP</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-sky-200 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-500" 
                  style={{ width: `${levelInfo.progressPercent}%` }}
                />
              </div>
            </div>

            {/* Monster Coins Wallet */}
            <div className="bg-amber-50 px-4 py-2 rounded-2xl border-2 border-amber-200 flex items-center gap-2.5 shadow-sm">
              <span className="text-2xl anim-badge">🪙</span>
              <div>
                <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider block">Monster Coins</span>
                <span className="font-mono text-base font-black text-amber-900 leading-none">{coinBalance} Coins</span>
              </div>
            </div>

            {/* Streak Counter */}
            <div className="bg-rose-50 px-3.5 py-2 rounded-2xl border-2 border-rose-200 flex items-center gap-2 shadow-sm">
              <span className="text-xl">🔥</span>
              <div>
                <span className="text-[10px] font-extrabold text-rose-700 uppercase tracking-wider block">Streak</span>
                <span className="font-mono text-sm font-black text-rose-900 leading-none">{streakDays} Days</span>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Row: In-App Student Navigation & Secure Logout (Zero Teacher Links) */}
        <div className="pt-3 border-t border-sky-100 flex flex-wrap items-center justify-between gap-2.5 relative z-10">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button 
              onClick={() => navigateTo({ view: 'home' })} 
              className="px-3.5 py-1.5 rounded-xl bg-sky-600 text-white font-black text-xs shadow-sm flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>🏰</span> Adventure Home
            </button>
            <button 
              onClick={() => {
                sounds.playNavigate();
                goToGrade(activeGrade);
              }} 
              className="px-3.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 font-bold text-xs border border-sky-200 flex items-center gap-1.5 whitespace-nowrap transition-colors"
            >
              <span>🗺️</span> Unit Worlds
            </button>
            <button 
              onClick={() => {
                sounds.playNavigate();
                navigateTo({ view: 'games-zone' });
              }} 
              className="px-3.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 font-bold text-xs border border-sky-200 flex items-center gap-1.5 whitespace-nowrap transition-colors"
            >
              <span>🎪</span> Games Zone
            </button>
            <button 
              onClick={() => {
                sounds.playNavigate();
                navigateTo({ view: 'monster-world' });
              }} 
              className="px-3.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 font-bold text-xs border border-sky-200 flex items-center gap-1.5 whitespace-nowrap transition-colors"
            >
              <span>🐣</span> Monster World
            </button>
            <button 
              onClick={() => {
                sounds.playTap();
                openProfileModal();
              }} 
              className="px-3.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 font-bold text-xs border border-sky-200 flex items-center gap-1.5 whitespace-nowrap transition-colors"
            >
              <span>🎖️</span> Explorer Passport
            </button>
          </div>

          {/* Student Logout Button */}
          <button 
            onClick={() => {
              sounds.playTap();
              logout();
            }} 
            className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-black text-xs flex items-center gap-1.5 border border-rose-200 transition-colors shadow-sm whitespace-nowrap" 
            title="Sign out of student account"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>

      </motion.div>

      {/* =================================================================== */}
      {/* 2. SUNNY DAILY QUEST INCENTIVE BANNER                               */}
      {/* =================================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-100 via-yellow-100 to-sky-100 border-2 border-amber-200 shadow-md flex flex-wrap items-center justify-between gap-3 relative z-10"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/30 flex items-center justify-center text-3xl flex-shrink-0">
            🎁
          </div>
          <div>
            <h3 className="text-base font-black font-display text-amber-950">Daily First Activity Bonus Waiting!</h3>
            <p className="text-xs text-amber-900 font-medium">
              Complete any curriculum activity today to claim <strong className="text-amber-700">+5 Monster Coins</strong> and <strong className="text-sky-700">+20 Bonus XP</strong>.
            </p>
          </div>
        </div>
        <button 
          onClick={() => {
            sounds.playNavigate();
            goToGrade(activeGrade);
          }} 
          className="px-5 py-2.5 rounded-2xl btn-game-amber text-xs font-black tracking-wide"
        >
          CLAIM IN QUEST ➔
        </button>
      </motion.div>

      {/* =================================================================== */}
      {/* 3. THREE CORE ADVENTURE ISLANDS (CURRICULUM, GAMES ZONE, MONSTER)   */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        
        {/* DESTINATION 1: CURRICULUM ADVENTURE ISLAND (STRICT GRADE ISOLATION) */}
        <motion.div
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.99 }}
          onClick={() => {
            sounds.playNavigate();
            goToGrade(activeGrade);
          }}
          className="card-island p-6 cursor-pointer relative overflow-hidden group flex flex-col justify-between"
        >
          <div>
            {/* Themed Floating Island Illustration */}
            <div className="w-full h-36 rounded-2xl bg-gradient-to-b from-sky-100 to-emerald-100 border-2 border-sky-200 flex items-center justify-center relative overflow-hidden mb-4 shadow-inner">
              <svg viewBox="0 0 200 120" className="w-full h-full">
                <path d="M 30 75 Q 100 115 170 75 Q 140 105 100 108 Q 60 105 30 75 Z" fill="#92400e" />
                <path d="M 25 70 Q 100 105 175 70 Q 180 55 160 55 Q 100 45 40 55 Q 20 55 25 70 Z" fill="#22c55e" />
                <rect x="85" y="25" width="30" height="38" rx="4" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
                <polygon points="100,8 78,28 122,28" fill="#f43f5e" />
                <rect x="95" y="44" width="10" height="18" rx="5" fill="#475569" />
                <circle cx="55" cy="52" r="12" fill="#16a34a" />
                <rect x="53" y="60" width="4" height="12" fill="#78350f" />
                <circle cx="145" cy="54" r="10" fill="#15803d" />
                <rect x="143" y="62" width="4" height="10" fill="#78350f" />
              </svg>
              <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase bg-white/90 text-sky-800 border border-sky-200 shadow-sm">
                Core Adventure
              </span>
            </div>

            <h3 className="text-xl font-black font-display text-slate-900 group-hover:text-sky-600 transition-colors">
              {activeGrade === 'grade-7' ? 'Grade 7 Curriculum' : 'Grade 8 Curriculum'}
            </h3>
            <p className="text-xs text-slate-600 font-medium mb-4 leading-relaxed">
              Explore {activeGrade === 'grade-7' ? 'Grade 7' : 'Grade 8'} unit worlds, solve interactive quests, and collect unit stars.
            </p>

            <div className="space-y-1.5 p-3 rounded-2xl bg-sky-50 border border-sky-100 mb-4">
              <div className="flex justify-between text-xs font-black">
                <span className="text-sky-900">Units Available</span>
                <span className="text-sky-600 font-mono">{unitCount} Units</span>
              </div>
              <div className="w-full h-2 rounded-full bg-sky-200 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-sky-500 to-emerald-400 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
          </div>

          <button className="w-full py-3 rounded-2xl btn-game-primary font-black text-xs">
            OPEN CURRICULUM MAP ➔
          </button>
        </motion.div>

        {/* DESTINATION 2: GAMES ZONE CARNIVAL WONDER PARK */}
        <motion.div
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.99 }}
          onClick={() => {
            sounds.playNavigate();
            navigateTo({ view: 'games-zone' });
          }}
          className="card-island p-6 cursor-pointer relative overflow-hidden group flex flex-col justify-between"
        >
          <div>
            {/* Carnival Pavilion Illustration */}
            <div className="w-full h-36 rounded-2xl bg-gradient-to-b from-rose-100 to-amber-100 border-2 border-rose-200 flex items-center justify-center relative overflow-hidden mb-4 shadow-inner">
              <svg viewBox="0 0 200 120" className="w-full h-full">
                <ellipse cx="100" cy="100" rx="80" ry="20" fill="#fde047" />
                <polygon points="100,20 60,70 140,70" fill="#f43f5e" />
                <polygon points="100,20 80,70 120,70" fill="#ffffff" />
                <rect x="62" y="70" width="76" height="25" fill="#f43f5e" />
                <polygon points="100,12 100,20 112,16" fill="#f59e0b" />
                <circle cx="45" cy="40" r="12" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
                <circle cx="155" cy="35" r="10" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
              </svg>
              <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase bg-white/90 text-rose-800 border border-rose-200 shadow-sm">
                Arcade Carnival
              </span>
            </div>

            <h3 className="text-xl font-black font-display text-slate-900 group-hover:text-rose-600 transition-colors">
              Games Zone
            </h3>
            <p className="text-xs text-slate-600 font-medium mb-4 leading-relaxed">
              Fast-paced mini-games: Word Ninja, Grammar Runner, and Sentence Tower arcade cabinets!
            </p>

            <div className="space-y-1.5 p-3 rounded-2xl bg-rose-50 border border-rose-100 mb-4">
              <div className="flex justify-between text-xs font-black">
                <span className="text-rose-900">Arcade Games</span>
                <span className="text-rose-600 font-mono">4 Mini-Games</span>
              </div>
              <div className="w-full h-2 rounded-full bg-rose-200 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-rose-500 to-amber-400 rounded-full" style={{ width: '75%' }} />
              </div>
            </div>
          </div>

          <button className="w-full py-3 rounded-2xl btn-game-coral font-black text-xs">
            ENTER GAMES ZONE ➔
          </button>
        </motion.div>

        {/* DESTINATION 3: MONSTER WORLD SANCTUARY (PRESERVES PHASE 8B EVOLUTION & REGRESSION CHECKS) */}
        <motion.div
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.99 }}
          onClick={() => {
            sounds.playNavigate();
            navigateTo({ view: 'monster-world' });
          }}
          className="card-island p-6 cursor-pointer relative overflow-hidden group flex flex-col justify-between"
        >
          <div>
            {/* Monster / Egg Sanctuary Vector Graphic */}
            <div className="w-full h-36 rounded-2xl bg-gradient-to-b from-purple-100 to-pink-100 border-2 border-purple-200 flex items-center justify-center relative overflow-hidden mb-4 shadow-inner">
              <div className="w-24 h-24 flex items-center justify-center anim-float">
                <MonsterAvatar
                  config={monsterConfig}
                  size={76}
                  animate
                  stage={milestoneInfo.stage}
                  evolutionTier={milestoneInfo.evolutionTier}
                />
              </div>
              <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase bg-white/90 text-purple-800 border border-purple-200 shadow-sm">
                Sanctuary &amp; Boutique
              </span>
            </div>

            <h3 className="text-xl font-black font-display text-slate-900 group-hover:text-purple-600 transition-colors">
              Monster World
            </h3>
            <p className="text-xs text-slate-600 font-medium mb-3 leading-relaxed">
              {milestoneInfo.isEgg
                ? `${milestoneInfo.stageName} • Hatching at 500 XP!`
                : `Companion: ${monsterConfig.name} • Wardrobe boutique unlocked!`}
            </p>

            {/* Level Progress Bar (CRITICAL: Preserves regression test assertion: "Level Progress") */}
            <div className="space-y-1.5 p-3 rounded-2xl bg-purple-50 border border-purple-100 mb-4">
              <div className="flex justify-between text-xs font-black">
                <span className="text-purple-900"><span>Level Progress</span></span>
                <span className="text-purple-600 font-mono">{levelInfo.progressPercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-purple-200 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 via-pink-400 to-amber-400 rounded-full transition-all duration-500" 
                  style={{ width: `${levelInfo.progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Dynamic CTA Text (CRITICAL: Preserves regression test assertion: "Visit Your Egg" vs "Customize Companion & View Shop") */}
          <button className="w-full py-3 rounded-2xl btn-game-purple font-black text-xs">
            {milestoneInfo.isEgg ? 'Visit Your Egg' : 'Customize Companion & View Shop'} ➔
          </button>
        </motion.div>

      </div>

      {/* =================================================================== */}
      {/* 4. LOWER CAMPUS BOARDWALK: SMART REVIEW & CLASS HONOR ROLL          */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        
        {/* Smart Review Station */}
        <div className="card-island p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
              <Target className="w-6 h-6 text-rose-500" />
            </div>
            <div>
              <h4 className="text-sm font-black font-display text-slate-900">Smart Review Station</h4>
              <p className="text-xs text-slate-600 font-medium">
                {uncorrectedMistakesCount > 0
                  ? `${uncorrectedMistakesCount} question mistakes ready to review for bonus XP.`
                  : 'All review mistakes corrected! Great job.'}
              </p>
            </div>
          </div>
          <button 
            onClick={() => {
              sounds.playTap();
              openMistakesModal();
            }}
            className="px-4 py-2 rounded-xl btn-game-coral text-xs font-black shrink-0"
          >
            Review (+15 XP)
          </button>
        </div>

        {/* Class Honor Roll (Leaderboard) */}
        <div className="card-island p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
              <Trophy className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h4 className="text-sm font-black font-display text-slate-900">Class Honor Roll</h4>
              <p className="text-xs text-slate-600 font-medium">
                Class {student?.class || '8A'} weekly leaderboard &amp; achievements.
              </p>
            </div>
          </div>
          <button 
            onClick={() => {
              sounds.playTap();
              openLeaderboardModal();
            }}
            className="px-4 py-2 rounded-xl btn-game-amber text-xs font-black shrink-0"
          >
            Standings ➔
          </button>
        </div>

      </div>

      {/* Classroom Smartboard Footer (STRICTLY NO TEACHER BUTTON) */}
      <div className="pt-4 pb-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 relative z-10">
        <div className="flex items-center gap-4">
          <span>📺 16:9 Smartboard Optimized</span>
          <span>•</span>
          <span>🎮 Grades 7 &amp; 8 English Arcade</span>
        </div>
        <div className="text-slate-400 font-medium">
          Role-Separated Student Terminal
        </div>
      </div>

    </div>
  );
};
