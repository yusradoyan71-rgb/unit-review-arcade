import React from 'react';
import { useArcade } from '../../context/ArcadeContext';
import { useAuth } from '../../context/AuthContext';
import { useGamification } from '../../context/GamificationContext';
import { usePersonalizedLearning } from '../../context/PersonalizedLearningContext';
import { useTeacherAuth } from '../../context/TeacherAuthContext';
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
  ShieldCheck,
  Layers,
  Trophy,
  RotateCw,
  Award,
  Sparkles
} from 'lucide-react';

export const ClassroomHeader: React.FC = () => {
  const { 
    navigation, 
    navigateTo,
    goToHome, 
    goToGrade, 
    goToUnit,
    openTeacherPanel, 
    isFullscreen, 
    toggleFullscreen, 
    isMuted, 
    toggleMute,
    activeUnit,
    activeActivity,
    data
  } = useArcade();

  const { openDashboard, isAuthenticated: isTeacherAuthenticated } = useTeacherAuth();
  const { authMode } = useAuth();
  const { openLeaderboardModal } = useGamification();
  const { openMistakesModal, openMasteryModal, uncorrectedMistakesCount } = usePersonalizedLearning();

  const isHome = navigation.view === 'home';

  // Format Grade Label
  const getGradeTitle = (gradeId: 'grade-7' | 'grade-8') => {
    return gradeId === 'grade-7' ? 'Grade 7' : 'Grade 8';
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 md:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Brand & Smart Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={goToHome}
            title="Return to Homepage"
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 font-semibold transition-all hover:scale-105 active:scale-95 group"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/40 group-hover:rotate-6 transition-transform">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <span className="font-arcade font-bold text-lg tracking-tight hidden sm:inline text-white">
              UNIT REVIEW ARCADE
            </span>
          </button>

          {/* Breadcrumb Path */}
          {!isHome && (
            <div className="flex items-center gap-2 text-sm font-medium">
              <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />

              {/* Grade Breadcrumb */}
              {(navigation.view === 'unit-library' || navigation.view === 'unit-dashboard' || navigation.view === 'game-play') && (
                <>
                  <button
                    onClick={() => goToGrade(navigation.gradeId)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors flex items-center gap-1.5"
                  >
                    <GraduationCap className="w-4 h-4 text-cyan-400" />
                    <span>{getGradeTitle(navigation.gradeId)}</span>
                    <span className="text-xs px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400">
                      {data.units[navigation.gradeId]?.length || 0}
                    </span>
                  </button>
                </>
              )}

              {/* Unit Breadcrumb */}
              {navigation.view === 'unit-dashboard' && activeUnit && (
                <>
                  <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold truncate max-w-[180px] sm:max-w-xs">
                    Unit {activeUnit.unitNumber}: {activeUnit.title}
                  </span>
                </>
              )}

              {/* Game Play Breadcrumbs */}
              {navigation.view === 'game-play' && activeUnit && (
                <>
                  <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                  <button
                    onClick={() => goToUnit(navigation.gradeId, navigation.unitId)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors font-medium truncate max-w-[120px] sm:max-w-xs"
                  >
                    Unit {activeUnit.unitNumber}
                  </button>
                  <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-bold truncate max-w-[160px] sm:max-w-xs">
                    {activeActivity?.title || 'Game'}
                  </span>
                </>
              )}

              {/* Games Zone Breadcrumb */}
              {navigation.view === 'games-zone' && (
                <span className="px-2.5 py-1 rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Games Zone
                </span>
              )}

              {/* Teacher Panel Breadcrumb */}
              {navigation.view === 'teacher-panel' && (
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5" />
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
            className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold hover:scale-105 active:scale-95 ${
              navigation.view === 'games-zone'
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                : 'bg-indigo-500/15 hover:bg-indigo-500/25 border-indigo-500/30 text-indigo-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">Games Zone</span>
          </button>

          {/* Audio Effects Toggle */}
          <button
            onClick={toggleMute}
            title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
            aria-label={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
            className={`p-2.5 rounded-xl border transition-all ${
              isMuted
                ? 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
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
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>

          {/* Distinct Entry Point 1: Teacher Monitoring Dashboard */}
          <button
            onClick={openDashboard}
            title={isTeacherAuthenticated ? 'Open Teacher Monitoring Dashboard' : 'Teacher Dashboard Login'}
            className="px-3 py-2 rounded-xl text-xs sm:text-sm font-medium border flex items-center gap-2 bg-indigo-600/15 hover:bg-indigo-600/25 border-indigo-500/30 text-indigo-300 transition-all hover:scale-105 active:scale-95"
          >
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span className="hidden md:inline">Teacher Dashboard</span>
          </button>

          {/* Distinct Entry Point 2: Preserved Local Content Editor */}
          <button
            onClick={() => openTeacherPanel('units')}
            title="Local Content & Curriculum Editor"
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium border flex items-center gap-2 transition-all ${
              navigation.view === 'teacher-panel'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md shadow-amber-500/10'
                : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-amber-300 hover:border-amber-500/30 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="hidden lg:inline">Content Editor</span>
          </button>
        </div>

      </div>
    </header>
  );
};
