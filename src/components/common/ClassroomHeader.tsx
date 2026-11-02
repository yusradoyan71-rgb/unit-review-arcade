import React from 'react';
import { useArcade } from '../../context/ArcadeContext';
import { 
  Gamepad2, 
  ChevronRight, 
  Maximize, 
  Minimize, 
  Volume2, 
  VolumeX, 
  Settings, 
  GraduationCap
} from 'lucide-react';

export const ClassroomHeader: React.FC = () => {
  const { 
    navigation, 
    goToHome, 
    goToGrade, 
    openTeacherPanel, 
    isFullscreen, 
    toggleFullscreen, 
    isMuted, 
    toggleMute,
    activeUnit,
    data
  } = useArcade();

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
              {(navigation.view === 'unit-library' || navigation.view === 'unit-dashboard') && (
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

        {/* Right: Smartboard Quick Classroom Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
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

          {/* Discreet Teacher Panel Quick Button */}
          <button
            onClick={() => openTeacherPanel('units')}
            title="Teacher Management Panel"
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium border flex items-center gap-2 transition-all ${
              navigation.view === 'teacher-panel'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md shadow-amber-500/10'
                : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-amber-300 hover:border-amber-500/30 hover:bg-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span className="hidden md:inline">Teacher Panel</span>
          </button>
        </div>

      </div>
    </header>
  );
};
