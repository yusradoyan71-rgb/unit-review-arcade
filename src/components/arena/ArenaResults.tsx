import React from 'react';
import type { ArenaMatchOutcome, ArenaOpponent, ArenaStake } from './types';
import { ShieldCheck, ArrowRight, RotateCcw, Zap, Receipt, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { MonsterAvatar } from '../monster/MonsterAvatar';
import { MonsterService } from '../../services/monsterService';

interface ArenaResultsProps {
  outcome: ArenaMatchOutcome;
  user: ArenaOpponent;
  opponent: ArenaOpponent;
  stakeXp: ArenaStake;
  onRematch: () => void;
  onReturnToLobby: () => void;
}

export const ArenaResults: React.FC<ArenaResultsProps> = ({
  outcome,
  user,
  opponent,
  stakeXp,
  onRematch,
  onReturnToLobby,
}) => {
  const isWinner = outcome.winnerId === user.studentNumber;
  const isTie = outcome.isTie;

  const userScore = outcome.p1Score;
  const oppScore = outcome.p2Score;
  const userTimeSec = (outcome.p1TotalTimeMs / 1000).toFixed(1);
  const oppTimeSec = (outcome.p2TotalTimeMs / 1000).toFixed(1);
  const timeDifferenceSec = Math.abs(parseFloat(userTimeSec) - parseFloat(oppTimeSec)).toFixed(1);

  const userMonster = MonsterService.resolveMonster(undefined, user.studentNumber);
  const oppMonster = MonsterService.resolveMonster(undefined, opponent.studentNumber);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      
      {/* 1. Main Outcome Hero Banner */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`card-island p-8 text-center border-3 shadow-xl relative overflow-hidden ${
          isWinner
            ? 'bg-gradient-to-b from-amber-50 via-white to-sky-50 border-amber-300'
            : isTie
            ? 'bg-gradient-to-b from-sky-50 via-white to-purple-50 border-sky-300'
            : 'bg-gradient-to-b from-sky-50 via-white to-rose-50 border-sky-200'
        }`}
      >
        <div className="relative z-10 space-y-3">
          
          {/* Monster Avatar with Celebratory Frame */}
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-sky-100 to-amber-100 p-2 mx-auto shadow-md border-3 border-white flex items-center justify-center">
            {isWinner ? (
              <MonsterAvatar config={userMonster} size={76} animate frame="frame_gold" />
            ) : isTie ? (
              <MonsterAvatar config={userMonster} size={76} animate />
            ) : (
              <MonsterAvatar config={userMonster} size={76} animate frame="frame_silver" />
            )}
          </div>

          <div>
            <span className={`px-3.5 py-1 rounded-full text-xs font-black font-display uppercase tracking-wider ${
              isWinner ? 'bg-amber-400 text-amber-950' : isTie ? 'bg-sky-200 text-sky-900' : 'bg-sky-200 text-sky-900'
            }`}>
              {isWinner ? '🏆 ARENA CHAMPION' : isTie ? '🤝 FAIR PLAY' : '🛡️ GOOD EFFORT'}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight font-display">
            {isWinner ? 'VICTORY!' : isTie ? "IT'S A DRAW!" : `NICE TRY, ${user.displayName.split(' ')[0].toUpperCase()}!`}
          </h1>

          <p className="text-sm sm:text-base font-semibold text-slate-600 max-w-md mx-auto">
            {isWinner
              ? `Superb job! You won the battle and earned +${stakeXp} XP!`
              : isTie
              ? 'Both competitors matched scores evenly. Stakes returned safely!'
              : `${opponent.displayName.split(' ')[0]} won this round, but your Academic Level & Title remain completely safe!`}
          </p>
        </div>
      </motion.div>

      {/* 2. Head-to-Head Comparison Card */}
      <div className="card-island p-6 space-y-4 shadow-sm">
        <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider text-center font-display">
          Head-to-Head Battle Stats
        </h2>

        <div className="grid grid-cols-3 items-center gap-2 text-center">
          
          {/* User Side */}
          <div className="space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 border border-sky-300 flex items-center justify-center p-0.5 mx-auto shadow-xs">
              <MonsterAvatar config={userMonster} size={42} />
            </div>
            <div className="font-black text-slate-900 text-sm truncate font-display">{user.displayName}</div>
            <div className="text-xs text-sky-600 font-bold">You</div>
          </div>

          {/* VS Center */}
          <div className="space-y-3">
            <div>
              <div className="text-xs text-slate-400 font-semibold mb-1">Correct Answers</div>
              <div className="text-3xl font-black text-slate-900 font-display flex items-center justify-center gap-2">
                <span className={userScore >= oppScore ? 'text-emerald-600' : 'text-slate-600'}>{userScore}</span>
                <span className="text-slate-300">:</span>
                <span className={oppScore >= userScore ? 'text-emerald-600' : 'text-slate-600'}>{oppScore}</span>
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-400 font-semibold mb-1">Total Response Time</div>
              <div className="text-xs sm:text-sm font-mono font-bold text-slate-600 flex items-center justify-center gap-1.5">
                <span>{userTimeSec}s</span>
                <span className="text-slate-400">vs</span>
                <span>{oppTimeSec}s</span>
              </div>
              {parseFloat(userTimeSec) < parseFloat(oppTimeSec) ? (
                <div className="text-xs font-bold text-emerald-600 mt-0.5 font-display">
                  ⚡ {timeDifferenceSec}s faster response
                </div>
              ) : (
                <div className="text-xs font-bold text-slate-400 mt-0.5 font-display">
                  Opponent was {timeDifferenceSec}s faster
                </div>
              )}
            </div>
          </div>

          {/* Opponent Side */}
          <div className="space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 border border-purple-300 flex items-center justify-center p-0.5 mx-auto shadow-xs">
              <MonsterAvatar config={oppMonster} size={42} />
            </div>
            <div className="font-black text-slate-900 text-sm truncate font-display">{opponent.displayName}</div>
            <div className="text-xs text-purple-600 font-bold">Opponent</div>
          </div>

        </div>
      </div>

      {/* 3. Authoritative XP Settlement Receipt Card (Passport Style) */}
      <div className="card-island p-6 border-2 border-sky-200 bg-white space-y-4 shadow-md">
        <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
              <Receipt className="w-4 h-4" />
            </div>
            <h3 className="font-black text-slate-900 text-base font-display">
              Authoritative XP Receipt
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            ID: {outcome.matchId.substring(0, 16)}...
          </span>
        </div>

        {/* Ledger Rows */}
        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between items-center text-slate-600">
            <span>Match Stake:</span>
            <span className="font-black text-slate-900 font-display">{stakeXp} XP</span>
          </div>

          <div className="flex justify-between items-center text-slate-600">
            <span>Result Delta:</span>
            <span
              className={`font-black text-base font-display ${
                outcome.p1XpChange > 0
                  ? 'text-emerald-600'
                  : outcome.p1XpChange < 0
                  ? 'text-rose-600'
                  : 'text-slate-600'
              }`}
            >
              {outcome.p1XpChange > 0 ? `+${outcome.p1XpChange}` : outcome.p1XpChange} XP
            </span>
          </div>

          <div className="flex justify-between items-center text-slate-600">
            <span>New Spendable Arena XP:</span>
            <span className="font-black text-amber-600 text-base font-display">{outcome.newSpendableXp} XP</span>
          </div>

          {/* Level Floor Safe Guarantee Banner */}
          <div className="pt-2 border-t border-slate-100">
            <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-200 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
              <div className="text-xs">
                <div className="font-black text-emerald-950 font-display">Permanent Level Floor Protection</div>
                <div className="text-emerald-800 mt-0.5">
                  Academic Lifetime XP preserved at <strong className="text-emerald-950">{outcome.academicLifetimeXp} XP</strong>. Level {user.level} cannot be demoted.
                </div>
              </div>
            </div>
          </div>

          {/* Daily 20 XP Gross Loss Cap & 5-Match Limit Update */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
              <div>
                <div className="text-slate-400 font-bold">Daily Loss Cap:</div>
                <div className="font-bold text-slate-800">Strict 20 XP limit enforced</div>
              </div>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center gap-2">
              <Zap className="w-4 h-4 text-sky-600 shrink-0" />
              <div>
                <div className="text-slate-400 font-bold">Daily Match Quota:</div>
                <div className="font-bold text-slate-800">5 matches maximum per day</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <button
          type="button"
          onClick={onReturnToLobby}
          className="py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-black text-sm border-2 border-slate-200 transition flex items-center justify-center gap-2 shadow-xs font-display"
        >
          <RotateCcw className="w-4 h-4 text-slate-400" />
          <span>Return to Lobby</span>
        </button>

        <button
          type="button"
          onClick={onRematch}
          className="py-3.5 rounded-2xl btn-game-primary font-black text-sm font-display transition flex items-center justify-center gap-2 shadow-md"
        >
          <span>Challenge Again</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
