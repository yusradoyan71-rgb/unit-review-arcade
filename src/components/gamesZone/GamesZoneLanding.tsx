import React from 'react';
import {
  ArrowLeft,
  Trophy,
  Play,
  Sparkles,
  Lock,
  GraduationCap,
} from 'lucide-react';
import type { GradeId } from '../../types/schema';
import type { GamesZoneGameMetadata } from '../../types/gamesZone';
import { GAMES_ZONE_CATALOG } from '../../data/gamesZone';
import { GamesZoneService, MAX_DAILY_GAMES_ZONE_XP } from '../../services/gamesZoneService';
import { sounds } from '../../services/soundEffects';

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

// Visual Theme for the 4 interactive carnival games
const GAME_CARNIVAL_THEMES: Record<string, {
  emoji: string;
  cardBorder: string;
  headerBg: string;
  headerBorder: string;
  btnClass: string;
  categoryBg: string;
}> = {
  word_ninja: {
    emoji: '🍉',
    cardBorder: 'border-emerald-200 hover:border-emerald-400',
    headerBg: 'from-emerald-100 to-teal-100',
    headerBorder: 'border-emerald-200',
    btnClass: 'btn-game-emerald',
    categoryBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  grammar_runner: {
    emoji: '🏃',
    cardBorder: 'border-rose-200 hover:border-rose-400',
    headerBg: 'from-rose-100 to-amber-100',
    headerBorder: 'border-rose-200',
    btnClass: 'btn-game-coral',
    categoryBg: 'bg-rose-100 text-rose-800 border-rose-300',
  },
  word_fishing: {
    emoji: '🎣',
    cardBorder: 'border-sky-200 hover:border-sky-400',
    headerBg: 'from-sky-100 to-cyan-100',
    headerBorder: 'border-sky-200',
    btnClass: 'btn-game-primary',
    categoryBg: 'bg-sky-100 text-sky-800 border-sky-300',
  },
  sentence_tower: {
    emoji: '🏗️',
    cardBorder: 'border-purple-200 hover:border-purple-400',
    headerBg: 'from-purple-100 to-pink-100',
    headerBorder: 'border-purple-200',
    btnClass: 'btn-game-purple',
    categoryBg: 'bg-purple-100 text-purple-800 border-purple-300',
  },
  grammar_basketball: {
    emoji: '🏀',
    cardBorder: 'border-orange-200 hover:border-orange-400',
    headerBg: 'from-orange-100 to-amber-100',
    headerBorder: 'border-orange-200',
    btnClass: 'btn-game-coral',
    categoryBg: 'bg-orange-100 text-orange-800 border-orange-300',
  },
  vocabulary_invaders: {
    emoji: '👾',
    cardBorder: 'border-violet-200 hover:border-violet-400',
    headerBg: 'from-violet-100 to-indigo-100',
    headerBorder: 'border-violet-200',
    btnClass: 'btn-game-purple',
    categoryBg: 'bg-violet-100 text-violet-800 border-violet-300',
  },
  wordle_english: {
    emoji: '🟩',
    cardBorder: 'border-emerald-200 hover:border-emerald-400',
    headerBg: 'from-emerald-100 to-green-100',
    headerBorder: 'border-emerald-200',
    btnClass: 'btn-game-emerald',
    categoryBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  word_connect: {
    emoji: '🎡',
    cardBorder: 'border-pink-200 hover:border-pink-400',
    headerBg: 'from-pink-100 to-rose-100',
    headerBorder: 'border-pink-200',
    btnClass: 'btn-game-coral',
    categoryBg: 'bg-pink-100 text-pink-800 border-pink-300',
  },
};

export const GamesZoneLanding: React.FC<GamesZoneLandingProps> = ({
  selectedGrade,
  onSelectGrade,
  onOpenGame,
  onBackToHome,
  studentNumber = 'guest',
}) => {
  const todayXp = GamesZoneService.getTodayXp(studentNumber);
  const xpPercent = Math.min(100, Math.round((todayXp / MAX_DAILY_GAMES_ZONE_XP) * 100));
  const remainingXp = Math.max(0, MAX_DAILY_GAMES_ZONE_XP - todayXp);

  const getBestScore = (gameId: string) => {
    const easy = GamesZoneService.getPersonalHighScore(studentNumber, gameId as any, 'easy');
    const med = GamesZoneService.getPersonalHighScore(studentNumber, gameId as any, 'medium');
    const hard = GamesZoneService.getPersonalHighScore(studentNumber, gameId as any, 'hard');
    return Math.max(easy, med, hard);
  };

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] py-6 px-4 md:px-8 max-w-7xl mx-auto w-full flex flex-col space-y-6 selection:bg-cyan-500 selection:text-white">
      
      {/* Background Decor: Floating Clouds */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-12 right-16 opacity-70 anim-cloud">
          <svg width="220" height="110" viewBox="0 0 220 110" fill="#ffffff">
            <path d="M 30 75 A 30 30 0 0 1 85 60 A 45 45 0 0 1 160 55 A 30 30 0 0 1 200 75 A 20 20 0 0 1 180 100 L 45 100 A 20 20 0 0 1 30 75 Z" filter="drop-shadow(0 10px 20px rgba(14,165,233,0.08))" />
          </svg>
        </div>
        <div className="absolute top-52 left-10 opacity-60 anim-cloud" style={{ animationDelay: '3.5s' }}>
          <svg width="180" height="90" viewBox="0 0 180 90" fill="#ffffff">
            <path d="M 25 65 A 25 25 0 0 1 70 50 A 35 35 0 0 1 130 45 A 25 25 0 0 1 165 65 A 16 16 0 0 1 148 85 L 35 85 A 16 16 0 0 1 25 65 Z" filter="drop-shadow(0 8px 16px rgba(14,165,233,0.06))" />
          </svg>
        </div>
      </div>

      {/* Bright Carnival Bunting Header */}
      <div className="card-island p-6 bg-gradient-to-r from-rose-50 via-amber-50 to-sky-50 border-2 border-rose-200 flex flex-wrap items-center justify-between gap-4 relative z-10">
        
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={() => {
                sounds.playTap();
                onBackToHome();
              }}
              className="text-xs font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1 group transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Island Home</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-3xl anim-badge">🎪</span>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-slate-900 tracking-tight">
              GAMES ZONE WONDER PARK
            </h1>
          </div>

          <p className="text-xs text-slate-600 font-medium">
            Bright, fast-paced educational mini-games • Train grammar reflexes, challenge personal bests &amp; collect daily coins!
          </p>
        </div>

        {/* Daily Carnival Bounty Meter & Grade Badge */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Daily XP Cap Card */}
          <div className="bg-white p-3.5 rounded-2xl border-2 border-amber-200 shadow-sm min-w-[230px]">
            <div className="flex items-center justify-between text-xs font-black mb-1">
              <span className="text-amber-900 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Daily XP Bounty
              </span>
              <span className="font-mono text-amber-600 font-bold">
                {todayXp} / {MAX_DAILY_GAMES_ZONE_XP} XP
              </span>
            </div>
            
            <div className="w-full h-2.5 rounded-full bg-amber-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-rose-400 rounded-full transition-all duration-500"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
            
            <span className="text-[10px] text-slate-500 font-semibold mt-1 block">
              {remainingXp > 0 ? `${remainingXp} XP remaining today` : 'Daily cap reached!'}
            </span>
          </div>

          {/* Grade Selector or Student Badge */}
          {studentNumber !== 'guest' ? (
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white border-2 border-sky-200 text-sky-800 text-xs font-black shadow-sm">
              <GraduationCap className="w-4 h-4 text-sky-600" />
              <span>{selectedGrade === 'grade-7' ? 'Grade 7 English' : 'Grade 8 English / LGS'}</span>
            </div>
          ) : (
            <div className="flex items-center bg-white p-1 rounded-2xl border-2 border-slate-200 shadow-sm">
              <button
                type="button"
                onClick={() => {
                  sounds.playTap();
                  onSelectGrade('grade-7');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  selectedGrade === 'grade-7'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Grade 7
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playTap();
                  onSelectGrade('grade-8');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  selectedGrade === 'grade-8'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Grade 8
              </button>
            </div>
          )}

        </div>

      </div>

      {/* 4 Carnival Pavilions Grid */}
      <div className="space-y-4 relative z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black font-display text-slate-900 flex items-center gap-2">
            <Play className="w-5 h-5 text-sky-600 fill-current" />
            <span>Interactive Game Pavilions</span>
          </h2>
          <span className="text-xs font-bold text-slate-500">
            8 fast-paced game engines • 1,920 curriculum questions
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {GAMES_ZONE_CATALOG.map((game) => {
            const theme = GAME_CARNIVAL_THEMES[game.id] || {
              emoji: '🎮',
              cardBorder: 'border-sky-200 hover:border-sky-400',
              headerBg: 'from-sky-100 to-indigo-100',
              headerBorder: 'border-sky-200',
              btnClass: 'btn-game-primary',
              categoryBg: 'bg-sky-100 text-sky-800 border-sky-300',
            };

            const bestScore = getBestScore(game.id);

            return (
              <div
                key={game.id}
                className={`card-island p-5 flex flex-col justify-between bg-white relative group overflow-hidden ${theme.cardBorder}`}
              >
                <div>
                  {/* Themed Header Graphic Box */}
                  <div className={`w-full h-32 rounded-2xl bg-gradient-to-tr ${theme.headerBg} border-2 ${theme.headerBorder} flex items-center justify-center text-5xl mb-3 shadow-inner relative overflow-hidden group-hover:scale-[1.02] transition-transform`}>
                    <span className="anim-float">{theme.emoji}</span>
                    <span className={`absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${theme.categoryBg}`}>
                      {game.categoryLabel}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-lg font-black font-display text-slate-900 mb-1 group-hover:text-sky-700 transition-colors">
                    {game.title}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium mb-3 line-clamp-2">
                    {game.tagline}
                  </p>

                  {/* High Score & Coin Reward Stats */}
                  <div className="text-xs font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1 mb-4">
                    <div className="flex justify-between text-slate-800">
                      <span className="flex items-center gap-1 font-semibold">
                        <Trophy className="w-3.5 h-3.5 text-amber-500" /> Best Score:
                      </span>
                      <strong className="text-slate-900">
                        {bestScore > 0 ? `${bestScore} pts` : 'Not Played'}
                      </strong>
                    </div>
                    <div className="flex justify-between text-slate-800">
                      <span className="font-semibold">Rewards:</span>
                      <span className="text-amber-700 font-bold">
                        +3 to +6 🪙
                      </span>
                    </div>
                  </div>
                </div>

                {/* Launch Button */}
                <button
                  type="button"
                  onClick={() => {
                    sounds.playTap();
                    onOpenGame(game);
                  }}
                  className={`w-full py-2.5 rounded-xl ${theme.btnClass} text-xs font-black tracking-wide flex items-center justify-center gap-1.5 shadow-md`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>PLAY {game.title.toUpperCase()} ➔</span>
                </button>

              </div>
            );
          })}
        </div>
      </div>

      {/* Roadmap Preview: Upcoming Games in Carnival Style */}
      <div className="space-y-4 pt-4 border-t border-slate-200 relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black font-display text-slate-800 flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-400" />
              <span>Coming Soon to Games Zone</span>
            </h3>
            <p className="text-xs text-slate-500">
              10 additional interactive game engines planned for the full arcade wonder park experience.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold">
            Roadmap Preview
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {UPCOMING_GAMES.map((ug, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-white/80 border border-slate-200 shadow-sm flex flex-col justify-between space-y-2 opacity-85 hover:opacity-100 transition-opacity"
            >
              <div>
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-sky-700 block">
                  {ug.category}
                </span>
                <span className="font-display font-bold text-xs text-slate-900 block mt-0.5">
                  {ug.title}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight line-clamp-2">
                {ug.desc}
              </p>
              <div className="pt-1 flex items-center gap-1 text-[10px] font-bold text-slate-400">
                <Lock className="w-3 h-3" /> Coming Soon
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default GamesZoneLanding;
