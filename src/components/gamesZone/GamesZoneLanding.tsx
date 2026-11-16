import React from 'react';
import {
  ArrowLeft,
  Zap,
  Flame,
  Compass,
  Layers,
  Trophy,
  Play,
  Sparkles,
  Lock,
} from 'lucide-react';
import type { GradeId } from '../../types/schema';
import type { GamesZoneGameMetadata } from '../../types/gamesZone';
import { GAMES_ZONE_CATALOG } from '../../data/gamesZone';
import { GamesZoneService, MAX_DAILY_GAMES_ZONE_XP } from '../../services/gamesZoneService';

interface GamesZoneLandingProps {
  selectedGrade: GradeId;
  onSelectGrade: (grade: GradeId) => void;
  onOpenGame: (metadata: GamesZoneGameMetadata) => void;
  onBackToHome: () => void;
  studentNumber?: string;
}

const UPCOMING_GAMES = [
  { title: 'Vocab Vault', category: 'Vocabulary', desc: 'Crack bank vaults by decoding definitions' },
  { title: 'Idiom Island', category: 'Idioms', desc: 'Navigate island mysteries using English expressions' },
  { title: 'Spelling Bee', category: 'Orthography', desc: 'Compete in fast-paced spelling shootouts' },
  { title: 'Tense Machine', category: 'Grammar', desc: 'Travel across timelines with perfect verb tenses' },
  { title: 'Preposition Pop', category: 'Syntax', desc: 'Pop balloons with accurate in/on/at prepositions' },
  { title: 'Irregular Quest', category: 'Verbs', desc: 'Dungeon crawler with irregular verb spells' },
  { title: 'Synonym Safari', category: 'Vocabulary', desc: 'Spot exotic wildlife by matching synonyms' },
  { title: 'Phrasal Whirl', category: 'Phrasal Verbs', desc: 'Match particles and verbs under time pressure' },
  { title: 'Antonym Abyss', category: 'Vocabulary', desc: 'Dive into ocean trenches avoiding antonym hazards' },
  { title: 'Story Crafter', category: 'Writing', desc: 'Construct dynamic narrative paragraphs' },
];

export const GamesZoneLanding: React.FC<GamesZoneLandingProps> = ({
  selectedGrade,
  onSelectGrade,
  onOpenGame,
  onBackToHome,
  studentNumber = 'guest',
}) => {
  const todayXp = GamesZoneService.getTodayXp(studentNumber);

  const renderIcon = (name: string, className: string = 'w-6 h-6') => {
    switch (name) {
      case 'Zap':
        return <Zap className={className} />;
      case 'Flame':
        return <Flame className={className} />;
      case 'Compass':
        return <Compass className={className} />;
      case 'Layers':
        return <Layers className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  const getBestScore = (gameId: string) => {
    const easy = GamesZoneService.getPersonalHighScore(studentNumber, gameId as any, 'easy');
    const med = GamesZoneService.getPersonalHighScore(studentNumber, gameId as any, 'medium');
    const hard = GamesZoneService.getPersonalHighScore(studentNumber, gameId as any, 'hard');
    return Math.max(easy, med, hard);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToHome}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-bold text-sm">Exit Games Zone</span>
          </button>

          {/* Title & Brand */}
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 text-white shadow-lg shadow-indigo-600/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">Games Zone</h1>
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 block -mt-1">
                Unit Review Arcade Standalone
              </span>
            </div>
          </div>

          {/* Grade Selector Toggle */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => onSelectGrade('grade-7')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedGrade === 'grade-7'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Grade 7
            </button>
            <button
              type="button"
              onClick={() => onSelectGrade('grade-8')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedGrade === 'grade-8'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Grade 8
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Hero Section */}
        <div className="relative rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-800/40 p-6 md:p-8 overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Middle School English Arcade
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Play, Train & Master English
            </h2>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Dive into fast-paced educational games crafted for {selectedGrade === 'grade-7' ? 'Grade 7 (A1–A2)' : 'Grade 8 (A2–B1 / LGS Preparation)'}. Test your speed, grammar agility, and vocabulary mastery outside standard unit progression.
            </p>
          </div>

          {/* Daily XP Stat Card */}
          <div className="mt-6 md:mt-0 md:absolute md:top-8 md:right-8 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 md:w-60 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-1">
              <span>Today's Games Zone XP</span>
              <span className="text-indigo-400">{todayXp} / {MAX_DAILY_GAMES_ZONE_XP}</span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${Math.min(100, (todayXp / MAX_DAILY_GAMES_ZONE_XP) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 mt-1.5 block">
              Daily anti-farming cap ensures balanced learning.
            </span>
          </div>
        </div>

        {/* 4 Interactive Games Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Play className="w-5 h-5 text-indigo-400 fill-current" /> Available Games (Phase 7A)
            </h3>
            <span className="text-xs font-bold text-slate-400">
              4 interactive engines • 960 total questions
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {GAMES_ZONE_CATALOG.map((game) => {
              const bestScore = getBestScore(game.id);
              return (
                <div
                  key={game.id}
                  className="group relative rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Top Gradient Banner */}
                  <div className={`p-6 bg-gradient-to-r ${game.accentGradient} text-white relative overflow-hidden`}>
                    <div className="flex items-center justify-between relative z-10">
                      <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-inner">
                        {renderIcon(game.iconName, 'w-7 h-7 text-white')}
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-black/20 text-white font-black text-[10px] uppercase tracking-wider backdrop-blur-sm">
                        {game.categoryLabel}
                      </span>
                    </div>

                    <h4 className="text-2xl font-black tracking-tight mt-4 relative z-10">
                      {game.title}
                    </h4>
                  </div>

                  {/* Body & Tagline */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {game.tagline}
                    </p>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Trophy className="w-3.5 h-3.5 text-amber-400" /> Best Score
                      </span>
                      <span className="font-black text-amber-400">
                        {bestScore > 0 ? `${bestScore} pts` : 'Not Played'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpenGame(game)}
                      className={`w-full py-3 rounded-xl font-black text-sm text-white shadow-md bg-gradient-to-r ${game.accentGradient} hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2`}
                    >
                      <Play className="w-4 h-4 fill-current" /> Play Game
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Roadmap: Upcoming 10 Games Preview */}
        <div className="space-y-4 pt-6 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-300 flex items-center gap-2">
                <Lock className="w-5 h-5 text-slate-500" /> Coming Soon to Games Zone
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                10 additional interactive game engines planned for the full arcade experience.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-bold">
              Roadmap Preview
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {UPCOMING_GAMES.map((ug, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 opacity-60 flex flex-col justify-between space-y-2"
              >
                <div>
                  <span className="text-[9px] uppercase tracking-wider font-bold text-slate-500 block">
                    {ug.category}
                  </span>
                  <span className="font-bold text-sm text-slate-300 block">{ug.title}</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">{ug.desc}</p>
                <div className="pt-2 flex items-center gap-1 text-[10px] font-bold text-slate-500">
                  <Lock className="w-3 h-3" /> Coming Soon
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
