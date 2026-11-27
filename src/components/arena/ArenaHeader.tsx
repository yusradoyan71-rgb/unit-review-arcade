import React from 'react';
import type { ArenaStudentMetrics } from './types';
import { getGradeNumber } from './types';
import { ArrowLeft, ShieldCheck, Flame, Coins, Swords, Zap, ChevronRight, Gamepad2 } from 'lucide-react';
import { MonsterAvatar } from '../monster/MonsterAvatar';
import { MonsterService } from '../../services/monsterService';

interface ArenaHeaderProps {
  metrics: ArenaStudentMetrics;
  onExit: () => void;
}

export const ArenaHeader: React.FC<ArenaHeaderProps> = ({ metrics, onExit }) => {
  const matchQuotaPercent = Math.min(100, (metrics.todayMatchCount / 5) * 100);
  const lossCapPercent = Math.min(100, (metrics.todayGrossLossXp / 20) * 100);
  const monsterConfig = MonsterService.resolveMonster(undefined, metrics.studentNumber);

  return (
    <header className="sticky top-0 z-40 w-full max-w-full bg-white/95 backdrop-blur-md border-b-2 border-sky-100 px-3 sm:px-4 md:px-8 py-2 sm:py-2.5 transition-all text-slate-800 shadow-sm overflow-x-hidden">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Brand, Back Button & Breadcrumbs */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onExit}
            className="p-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 transition-all hover:scale-105 active:scale-95 shadow-xs"
            title="Return to Unit Review Arcade"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-sky-50 border border-sky-200 text-sky-950 font-semibold shadow-xs">
            <div className="w-7 h-7 rounded-lg bg-sky-600 flex items-center justify-center text-white shadow-xs">
              <Gamepad2 className="w-4 h-4" />
            </div>
            <span className="font-display font-bold text-base tracking-tight hidden md:inline text-sky-950">
              UNIT REVIEW ARCADE
            </span>
          </div>

          <ChevronRight className="w-4 h-4 text-slate-400 hidden sm:block shrink-0" />

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 font-bold text-xs">
            <Swords className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-display font-black">XP Battle Arena</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px]">
              Grade {getGradeNumber(metrics.grade)}
            </span>
          </div>
        </div>

        {/* Center: Dual XP System (Spendable vs Academic Level Floor) */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Spendable Arena XP Coin Pill */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 hover:bg-amber-100/80 rounded-xl border-2 border-amber-200 text-amber-900 font-bold text-xs transition shadow-xs"
            title="Spendable Arena XP for battle stakes"
          >
            <div className="w-5 h-5 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center text-xs font-black shadow-inner">
              <Coins className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-wider text-amber-700/80 font-bold leading-none">Spendable XP</div>
              <div className="text-xs font-black text-amber-900 leading-tight">{metrics.spendableXp} XP</div>
            </div>
          </div>

          {/* Academic Lifetime XP & Level Floor Safe Badge */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-xl border-2 border-emerald-200 text-emerald-900 font-bold text-xs shadow-xs"
            title="Academic Lifetime XP is permanent and protected from PVP losses"
          >
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <div>
              <div className="flex items-center gap-1">
                <span className="text-[9px] uppercase tracking-wider text-emerald-700 font-bold leading-none">Level {metrics.level} Safe</span>
              </div>
              <div className="text-xs font-black text-emerald-950 leading-tight">{metrics.academicLifetimeXp} XP</div>
            </div>
          </div>

          {/* Student Profile Passport Badge with Monster Avatar */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-2xl bg-white border-2 border-sky-100 hover:border-sky-300 shadow-sm transition text-left">
            <div className="w-8 h-8 rounded-xl bg-sky-100 border border-sky-300 flex items-center justify-center overflow-hidden p-0.5">
              <MonsterAvatar config={monsterConfig} size={30} animate />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-black text-slate-800 font-display">{metrics.displayName.split(' ')[0]}</span>
                <span className="px-1 py-0.2 rounded bg-sky-100 text-sky-800 font-mono text-[9px] font-bold">{metrics.class}</span>
              </div>
              <div className="text-[9px] text-slate-500 font-semibold">{metrics.levelTitle}</div>
            </div>
          </div>

        </div>

        {/* Right: Daily Quotas & Loss Cap Meters */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Daily 5 Matches Meter */}
          <div className="bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200 text-right">
            <div className="flex items-center justify-end gap-1 text-[10px] font-bold text-slate-600 font-display">
              <Zap className="w-3 h-3 text-sky-600" />
              <span>Matches: <strong className="text-slate-900">{metrics.todayMatchCount}/5</strong></span>
            </div>
            <div className="w-16 sm:w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-gradient-to-r from-sky-400 to-blue-600 transition-all duration-300"
                style={{ width: `${matchQuotaPercent}%` }}
              />
            </div>
          </div>

          {/* Daily 20 XP Gross Loss Cap Meter */}
          <div
            className="bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200 text-right"
            title="Strict 20 XP daily gross loss cap (Europe/Istanbul UTC+3)"
          >
            <div className="flex items-center justify-end gap-1 text-[10px] font-bold text-slate-600 font-display">
              <Flame className="w-3 h-3 text-rose-500" />
              <span>Loss: <strong className={metrics.todayGrossLossXp >= 20 ? "text-rose-600" : "text-amber-600"}>{metrics.todayGrossLossXp}/20 XP</strong></span>
            </div>
            <div className="w-16 sm:w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
              <div
                className={`h-full transition-all duration-300 ${metrics.todayGrossLossXp >= 20 ? 'bg-rose-500' : 'bg-gradient-to-r from-amber-400 to-rose-500'}`}
                style={{ width: `${lossCapPercent}%` }}
              />
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
