import React from 'react';
import { useArcade } from '../../context/ArcadeContext';
import { useAuth } from '../../context/AuthContext';
import { useGamification } from '../../context/GamificationContext';
import { usePersonalizedLearning } from '../../context/PersonalizedLearningContext';
import { sounds } from '../../services/soundEffects';
import { StudentProfileBadge } from '../auth/StudentProfileBadge';
import { 
  Gamepad2, 
  ChevronRight, 
  Maximize, 
  Minimize, 
  Volume2, 
  VolumeX, 
  Settings, 
  GraduationCap,
  Trophy,
  RotateCw,
  Award,
  Sparkles,
  Coins
} from 'lucide-react';
import { CoinService } from '../../services/coinService';

export const ClassroomHeader: React.FC = () => {
  const { 
    navigation, 
    navigateTo,
    goToHome, 
    goToGrade, 
    goToUnit,
    isFullscreen, 
    toggleFullscreen, 
    isMuted, 
    toggleMute,
    activeUnit,
    activeActivity,
    data
  } = useArcade();

  const { authMode, student } = useAuth();
  const { openLeaderboardModal } = useGamification();
  const { openMistakesModal, openMasteryModal, uncorrectedMistakesCount } = usePersonalizedLearning();

  const isHome = navigation.view === 'home';

  // Format Grade Label
  const getGradeTitle = (gradeId: 'grade-7' | 'grade-8') => {
    return gradeId === 'grade-7' ? 'Grade 7' : 'Grade 8';
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b-2 border-sky-100 px-4 md:px-8 py-2.5 transition-all text-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Brand & Smart Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={goToHome}
            title="Return to Homepage"
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-950 font-semibold transition-all hover:scale-105 active:scale-95 group"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white shadow-md shadow-sky-600/30 group-hover:rotate-6 transition-transform">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <span className="font-arcade font-bold text-lg tracking-tight hidden sm:inline text-sky-950">
              UNIT REVIEW ARCADE
            </span>
          </button>

          {/* Breadcrumb Path */}
          {!isHome && (
            <div className="flex items-center gap-2 text-sm font-medium">
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />

              {/* Grade Breadcrumb */}
              {(navigation.view === 'unit-library' || navigation.view === 'unit-dashboard' || navigation.view === 'game-play') && (
                <>
                  <button
                    onClick={() => goToGrade(student ? student.grade : navigation.gradeId)}
                    className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 transition-colors flex items-center gap-1.5 font-semibold text-xs"
                  >
                    <GraduationCap className="w-4 h-4 text-sky-600" />
                    <span>{getGradeTitle(student ? student.grade : navigation.gradeId)}</span>
                    <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-sky-100 text-sky-700 font-bold">
                      {data.units[student ? student.grade : navigation.gradeId]?.length || 0}
                    </span>
                  </button>
                </>
              )}

              {/* Unit Breadcrumb */}
              {navigation.view === 'unit-dashboard' && activeUnit && (
                <>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold text-xs truncate max-w-[180px] sm:max-w-xs">
                    Unit {activeUnit.unitNumber}: {activeUnit.title}
                  </span>
                </>
              )}

              {/* Game Play Breadcrumbs */}
              {navigation.view === 'game-play' && activeUnit && (
                <>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  <button
                    onClick={() => goToUnit(navigation.gradeId, navigation.unitId)}
                    className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 transition-colors font-medium text-xs truncate max-w-[120px] sm:max-w-xs"
                  >
                    Unit {activeUnit.unitNumber}
                  </button>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold text-xs truncate max-w-[160px] sm:max-w-xs">
                    {activeActivity?.title || 'Game'}
                  </span>
                </>
              )}

              {/* Games Zone Breadcrumb */}
              {navigation.view === 'games-zone' && (
                <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-semibold text-xs flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                  Games Zone
                </span>
              )}

              {/* Monster World Breadcrumb */}
              {navigation.view === 'monster-world' && (
                <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-semibold text-xs flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-amber-500" />
                  Monster World
                </span>
              )}

              {/* Teacher Panel Breadcrumb */}
              {navigation.view === 'teacher-panel' && (
                <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 font-semibold text-xs flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5 text-teal-600" />
                  Teacher Panel
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right: Smartboard Quick Classroom Controls & Student Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Student Profile / Mode Status Badge */}
          <StudentProfileBadge />

          {/* Personalized Learning & Gamification Shortcuts for Logged-In Students */}
          {authMode === 'student' && (
            <>
              {/* My Mistakes Shortcut */}
              <button
                onClick={() => {
                  sounds.playNavigate();
                  openMistakesModal();
                }}
                title="My Mistakes & Retry"
                aria-label="My Mistakes & Retry"
                className="relative p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 hover:border-rose-400 text-rose-400 hover:text-rose-300 transition-all hover:scale-105 active:scale-95 flex items-center justify-center shadow-sm"
              >
                <RotateCw className="w-5 h-5" />
                {uncorrectedMistakesCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-600 border border-slate-900 text-[10px] font-mono font-extrabold text-white flex items-center justify-center animate-pulse">
                    {uncorrectedMistakesCount}
                  </span>
                )}
              </button>

              {/* Topic Mastery Shortcut */}
              <button
                onClick={() => {
                  sounds.playNavigate();
                  openMasteryModal();
                }}
                title="Topic Mastery Progress"
                aria-label="Topic Mastery Progress"
                className="p-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400 text-cyan-400 hover:text-cyan-300 transition-all hover:scale-105 active:scale-95 flex items-center justify-center shadow-sm"
              >
                <Award className="w-5 h-5" />
              </button>

              {/* Class Leaderboard Shortcut */}
              <button
                onClick={() => {
                  sounds.playNavigate();
                  openLeaderboardModal();
                }}
                title="View Class Leaderboards"
                aria-label="View Class Leaderboards"
                className="p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-400 text-amber-400 hover:text-amber-300 transition-all hover:scale-105 active:scale-95 flex items-center justify-center shadow-sm"
              >
                <Trophy className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Standalone Games Zone Quick Entry */}
          <button
            onClick={() => {
              sounds.playNavigate();
              navigateTo({ view: 'games-zone' });
            }}
            title="Open Games Zone"
            aria-label="Open Games Zone"
            className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
              navigation.view === 'games-zone'
                ? 'bg-rose-600 text-white border-rose-700 shadow-sm'
                : 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-700'
            }`}
          >
            <Sparkles className="w-4 h-4 text-rose-500" />
            <span className="hidden sm:inline">Games Zone</span>
          </button>

          {/* Monster World & Coins Shortcut */}
          <button
            onClick={() => {
              sounds.playNavigate();
              navigateTo({ view: 'monster-world' });
            }}
            title="Monster World & Customizer"
            aria-label="Monster World"
            className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
              navigation.view === 'monster-world'
                ? 'bg-amber-600 text-white border-amber-700 shadow-sm'
                : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900'
            }`}
          >
            <Coins className="w-4 h-4 text-amber-500" />
            <span className="font-extrabold">{student?.totalCoins ?? CoinService.getBalance(student?.studentNumber || '')}</span>
          </button>

          {/* Audio Effects Toggle */}
          <button
            onClick={toggleMute}
            title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
            aria-label={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
            className={`p-2.5 rounded-xl border transition-all ${
              isMuted
                ? 'bg-slate-100 border-slate-200 text-slate-400 hover:text-slate-600'
                : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* Fullscreen Smartboard Toggle */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Smartboard Fullscreen'}
            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Smartboard Fullscreen'}
            className={`p-2.5 rounded-xl border transition-all ${
              isFullscreen
                ? 'bg-sky-500/20 border-sky-400 text-sky-700'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
        </div>

      </div>
    </header>
  );
};
