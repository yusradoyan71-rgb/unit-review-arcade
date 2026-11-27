import React, { useState, useEffect } from 'react';
import type { ArenaStudentMetrics, ArenaOpponent, ArenaStake, ArenaChallenge } from './types';
import { getGradeNumber } from './types';
import { Swords, Coins, Check, Users, X, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MonsterAvatar } from '../monster/MonsterAvatar';
import { MonsterService } from '../../services/monsterService';

interface ArenaLobbyProps {
  metrics: ArenaStudentMetrics;
  opponents: ArenaOpponent[];
  incomingChallenge: ArenaChallenge | null;
  outgoingChallenge: ArenaChallenge | null;
  presenceError?: string | null;
  onSendChallenge: (opponent: ArenaOpponent, stake: ArenaStake) => void;
  onAcceptChallenge: (challenge: ArenaChallenge) => void;
  onDeclineChallenge: (challenge: ArenaChallenge) => void;
  onCancelChallenge: (challenge: ArenaChallenge) => void;
}

const STAKE_OPTIONS: { stake: ArenaStake; label: string; badge: string; colorStyle: string }[] = [
  { stake: 0, label: 'Friendly Practice', badge: 'No Risk', colorStyle: 'border-emerald-200 bg-emerald-50/60 hover:border-emerald-400 text-emerald-900' },
  { stake: 5, label: 'Standard Match', badge: 'Safe', colorStyle: 'border-sky-200 bg-sky-50/60 hover:border-sky-400 text-sky-900' },
  { stake: 10, label: 'Ranked Duel', badge: 'Popular', colorStyle: 'border-amber-400 bg-amber-50/90 hover:border-amber-500 text-amber-950' },
  { stake: 20, label: 'Boss Match', badge: 'High Stakes', colorStyle: 'border-rose-200 bg-rose-50/60 hover:border-rose-400 text-rose-900' },
];

export const ArenaLobby: React.FC<ArenaLobbyProps> = ({
  metrics,
  opponents,
  incomingChallenge,
  outgoingChallenge,
  presenceError,
  onSendChallenge,
  onAcceptChallenge,
  onDeclineChallenge,
  onCancelChallenge,
}) => {
  // Helper to test if stake is allowed
  const isStakeAllowed = (stake: ArenaStake) => {
    if (metrics.todayMatchCount >= 5) return false;
    if (stake > metrics.spendableXp) return false;
    if (metrics.todayGrossLossXp + stake > 20) return false;
    return true;
  };

  // Safe initial stake: choose 10 if allowed, else 5, else 0 (fallback practice)
  const [selectedStake, setSelectedStake] = useState<ArenaStake>(() => {
    if (isStakeAllowed(10)) return 10;
    if (isStakeAllowed(5)) return 5;
    return 0;
  });

  const [incomingTimer, setIncomingTimer] = useState<number>(15);
  const [outgoingTimer, setOutgoingTimer] = useState<number>(15);

  // Filter out self just in case current student appears in the roster
  const filteredOpponents = opponents.filter(
    (o) => String(o.studentNumber).trim() !== String(metrics.studentNumber).trim()
  );

  // Auto-clamp selected stake when spendableXp or daily quotas update
  useEffect(() => {
    if (!isStakeAllowed(selectedStake)) {
      if (isStakeAllowed(10)) setSelectedStake(10);
      else if (isStakeAllowed(5)) setSelectedStake(5);
      else setSelectedStake(0);
    }
  }, [metrics.spendableXp, metrics.todayMatchCount, metrics.todayGrossLossXp, selectedStake]);

  // Incoming challenge timer countdown
  useEffect(() => {
    if (!incomingChallenge) {
      setIncomingTimer(15);
      return;
    }
    const interval = setInterval(() => {
      setIncomingTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onDeclineChallenge(incomingChallenge);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [incomingChallenge, onDeclineChallenge]);

  // Outgoing challenge timer countdown
  useEffect(() => {
    if (!outgoingChallenge) {
      setOutgoingTimer(15);
      return;
    }
    const interval = setInterval(() => {
      setOutgoingTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onCancelChallenge(outgoingChallenge);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [outgoingChallenge, onCancelChallenge]);

  const getStakeDisableReason = (stake: ArenaStake) => {
    if (metrics.todayMatchCount >= 5) return 'Daily 5-match limit reached';
    if (stake > metrics.spendableXp) return `Insufficient spendable XP (${metrics.spendableXp} XP available)`;
    if (metrics.todayGrossLossXp + stake > 20) {
      return `Exceeds 20 XP daily loss cap (${20 - metrics.todayGrossLossXp} XP allowance remaining)`;
    }
    return '';
  };

  const challengerMonster = incomingChallenge
    ? MonsterService.resolveMonster(undefined, incomingChallenge.challenger_id)
    : null;

  const targetOpponentMonster = outgoingChallenge
    ? MonsterService.resolveMonster(undefined, outgoingChallenge.opponent_id)
    : null;

  const gradeNumber = getGradeNumber(metrics.grade);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">

      {/* Connection / Roster Status Banner */}
      {presenceError && (
        <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 text-xs flex items-start gap-3 shadow-xs animate-fade-in">
          <div className="w-6 h-6 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-sm shrink-0">
            <AlertTriangle className="w-4 h-4 text-amber-800" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-amber-950 text-sm font-display">Lobby Presence Notice</div>
            <div className="mt-0.5 text-amber-800 leading-relaxed font-sans">{presenceError}</div>
          </div>
        </div>
      )}
      
      {/* 1. Campus Arena Welcome Banner */}
      <div className="card-island p-6 bg-gradient-to-r from-amber-50 via-white to-sky-50 border-2 border-amber-200 flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-400 flex items-center justify-center text-white shadow-lg shadow-amber-400/30 shrink-0">
            <Swords className="w-8 h-8 text-amber-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
                Grade {gradeNumber} Battle Arena
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                ● {filteredOpponents.filter((o) => o.status === 'idle').length} Online
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Challenge classmates to quick 10-question English duels. Fast answers win tiebreakers!
            </p>
          </div>
        </div>

        {/* Quota meters pill */}
        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-sky-100 shadow-xs text-xs">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 font-bold uppercase font-display">Daily Battles</div>
            <div className="text-sm font-black text-sky-900 font-display">{metrics.todayMatchCount} / 5 played</div>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="text-right">
            <div className="text-[10px] text-slate-400 font-bold uppercase font-display">Loss Cap Allowance</div>
            <div className="text-sm font-black text-emerald-600 font-display">{20 - metrics.todayGrossLossXp} XP safe</div>
          </div>
        </div>
      </div>

      {/* 2. Playful Stake Selector Chips */}
      <div className="card-island p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-black text-slate-900 font-display">Choose Challenge Stake</h2>
          </div>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Winner takes stake from opponent • Academic Lifetime XP is never lost
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {STAKE_OPTIONS.map(({ stake, label, badge, colorStyle }) => {
            const allowed = isStakeAllowed(stake);
            const isSelected = allowed && selectedStake === stake;
            const disableReason = getStakeDisableReason(stake);

            return (
              <button
                key={stake}
                type="button"
                disabled={!allowed}
                onClick={() => {
                  if (allowed) setSelectedStake(stake);
                }}
                className={`relative rounded-2xl p-4 text-left border-2 transition-all flex flex-col justify-between h-24 ${
                  !allowed
                    ? 'bg-slate-50 border-slate-200 opacity-40 cursor-not-allowed text-slate-400'
                    : isSelected
                    ? 'border-3 border-amber-400 bg-amber-50/90 ring-4 ring-amber-400/20 shadow-md'
                    : `bg-white ${colorStyle} shadow-xs`
                }`}
                title={disableReason || `${stake} XP Stake`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-[11px] font-black px-2 py-0.5 rounded-md font-display ${
                    isSelected ? 'bg-amber-400 text-amber-950' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {badge}
                  </span>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-black">
                      ✓
                    </div>
                  )}
                </div>

                <div>
                  <div className={`text-xl font-black font-display ${allowed ? 'text-slate-900' : 'text-slate-400'}`}>
                    {stake} XP
                  </div>
                  <div className="text-xs text-slate-600 truncate font-semibold">
                    {allowed ? label : disableReason}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Classmate Roster with ACTUAL MONSTER AVATARS */}
      <div className="card-island p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-sky-600" />
            <h2 className="text-lg font-black text-slate-900 font-display">
              Available Classmates (Grade {gradeNumber})
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">Europe/Istanbul UTC+3</span>
        </div>

        {filteredOpponents.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-30 text-sky-400" />
            <p className="font-semibold text-slate-600 font-display">No classmates online right now</p>
            <p className="text-xs mt-1 text-slate-400">
              Classmates in Grade {gradeNumber} will appear here when they connect to the arena.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOpponents.map((opponent) => {
              const isIdle = opponent.status === 'idle';
              const isInBattle = opponent.status === 'in_battle';
              const canChallenge = isIdle && isStakeAllowed(selectedStake) && !outgoingChallenge;
              const oppMonster = MonsterService.resolveMonster(undefined, opponent.studentNumber);

              return (
                <div
                  key={opponent.studentNumber}
                  className={`p-4 rounded-2xl border-2 transition shadow-sm flex items-center justify-between gap-3 ${
                    isIdle
                      ? 'border-sky-100 hover:border-sky-300 bg-white hover:bg-sky-50/30'
                      : 'border-slate-100 bg-slate-50/70 opacity-75'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Real Student Monster Avatar */}
                    <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-100 to-indigo-100 border-2 border-sky-200 p-1 shrink-0">
                      <MonsterAvatar config={oppMonster} size={48} animate={isIdle} />
                      <span
                        className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                          isIdle ? 'bg-emerald-500 animate-pulse' : isInBattle ? 'bg-amber-500' : 'bg-slate-400'
                        }`}
                        title={isIdle ? 'Online & Available' : isInBattle ? 'In Battle' : 'Offline'}
                      />
                    </div>

                    <div>
                      <div className="font-black text-slate-900 text-sm flex items-center gap-1.5 font-display">
                        {opponent.displayName}
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-100 text-sky-800 font-mono font-bold">
                          {opponent.class}
                        </span>
                      </div>
                      <div className="text-xs text-sky-800 font-bold">
                        Level {opponent.level} • {opponent.levelTitle}
                      </div>
                      <div className="text-[11px] font-semibold mt-0.5">
                        {isIdle ? (
                          <span className="text-emerald-600 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Ready for duel
                          </span>
                        ) : isInBattle ? (
                          <span className="text-amber-600">Currently in a battle</span>
                        ) : (
                          <span className="text-slate-400">Offline</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Challenge Action Button */}
                  <button
                    type="button"
                    disabled={!canChallenge}
                    onClick={() => onSendChallenge(opponent, selectedStake)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black font-display flex items-center gap-1.5 shadow-sm transition ${
                      canChallenge
                        ? 'btn-game-amber'
                        : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                    }`}
                  >
                    <Swords className="w-3.5 h-3.5" />
                    <span>Challenge</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Outgoing Challenge Radar Modal */}
      <AnimatePresence>
        {outgoingChallenge && targetOpponentMonster && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card-island p-6 max-w-sm w-full text-center space-y-5 border-3 border-amber-300 shadow-2xl"
            >
              <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                <span className="absolute inset-0 rounded-full bg-amber-400/20 animate-ping" />
                <div className="w-20 h-20 rounded-3xl bg-amber-100 border-2 border-amber-300 p-1.5 shadow-md z-10 flex items-center justify-center">
                  <MonsterAvatar config={targetOpponentMonster} size={64} animate />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 font-display">
                  Challenging {outgoingChallenge.opponent_name}...
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-semibold">
                  Stake: <strong className="text-amber-600 font-display">{outgoingChallenge.stake_xp} XP</strong> • Waiting for acceptance
                </p>
              </div>

              {/* Countdown bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-500 font-mono">
                  <span>Auto-expires in:</span>
                  <span className="text-amber-600 font-bold">{outgoingTimer}s</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200 shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `${(outgoingTimer / 15) * 100}%` }}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => onCancelChallenge(outgoingChallenge)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition font-display"
              >
                Cancel Challenge
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Incoming Challenge Modal */}
      <AnimatePresence>
        {incomingChallenge && challengerMonster && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card-island p-6 max-w-md w-full space-y-5 border-3 border-emerald-300 shadow-2xl"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-16 h-16 rounded-3xl bg-emerald-100 border-2 border-emerald-300 p-1 shadow-md shrink-0">
                  <MonsterAvatar config={challengerMonster} size={54} animate />
                </div>
                <div>
                  <span className="text-xs uppercase font-black text-emerald-700 tracking-wider font-display">
                    ⚔️ Incoming Challenge!
                  </span>
                  <h3 className="text-xl font-black text-slate-900 font-display">
                    {incomingChallenge.challenger_name}
                  </h3>
                  <span className="text-xs text-slate-500 font-semibold">
                    Grade {getGradeNumber(incomingChallenge.grade)} English Duel
                  </span>
                </div>
              </div>

              {/* Stake & Rule Details */}
              <div className="bg-sky-50/60 rounded-2xl p-4 border border-sky-100 space-y-2 text-xs">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 font-medium">Match Stake:</span>
                  <span className="font-black text-amber-700 text-base font-display">{incomingChallenge.stake_xp} XP</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Questions:</span>
                  <span className="text-slate-900 font-bold">10 Questions (Grade {getGradeNumber(incomingChallenge.grade)})</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Time per question:</span>
                  <span className="text-slate-900 font-bold">15 seconds max</span>
                </div>
              </div>

              {/* Countdown Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-500 font-mono">
                  <span>Accept before timer expires:</span>
                  <span className="text-emerald-600 font-bold">{incomingTimer}s</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200 shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `${(incomingTimer / 15) * 100}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onDeclineChallenge(incomingChallenge)}
                  className="py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs border border-slate-200 transition font-display flex items-center justify-center gap-1.5"
                >
                  <X className="w-4 h-4 text-rose-500" />
                  <span>Decline</span>
                </button>
                <button
                  type="button"
                  onClick={() => onAcceptChallenge(incomingChallenge)}
                  className="py-3 rounded-2xl btn-game-emerald font-black text-xs font-display flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Check className="w-4 h-4" />
                  <span>Accept Battle</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
