import React, { useState, useEffect } from 'react';
import type {
  ArenaStudentMetrics,
  ArenaOpponent,
  ArenaStake,
  ArenaChallenge,
  ArenaMatchRoom,
  ArenaMatchOutcome,
  ArenaQuestion,
} from './types';
import { ArenaHeader } from './ArenaHeader';
import { ArenaLobby } from './ArenaLobby';
import { ArenaBattle } from './ArenaBattle';
import { ArenaResults } from './ArenaResults';
import { Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGamification } from '../../context/GamificationContext';
import { CoinService } from '../../services/coinService';
import { ApiService } from '../../services/apiService';
import { ArenaFirebaseService } from '../../services/arenaFirebaseService';

interface ArenaContainerProps {
  onExit?: () => void;
}

const SAMPLE_QUESTIONS: ArenaQuestion[] = [
  {
    id: 'q1',
    prompt: 'She is very _______; she always shares her books and pencils with her friends.',
    options: ['stubborn', 'generous', 'selfish', 'clumsy'],
  },
  {
    id: 'q2',
    prompt: 'Which sentence is in the Simple Past Tense?',
    options: [
      'They are playing football.',
      'We visited our grandparents yesterday.',
      'He always drinks milk in the morning.',
      'I will call you tomorrow.',
    ],
  },
  {
    id: 'q3',
    prompt: 'A person who never changes his or her mind easily is described as:',
    options: ['outgoing', 'punctual', 'stubborn', 'honest'],
  },
  {
    id: 'q4',
    prompt: 'Mount Everest is _______ than Mount Ararat.',
    options: ['higher', 'highest', 'more high', 'as high'],
  },
  {
    id: 'q5',
    prompt: 'How often do you train for the basketball tournament?',
    options: [
      'Yes, I do.',
      'Twice a week.',
      'In the school gymnasium.',
      'With my best friend.',
    ],
  },
  {
    id: 'q6',
    prompt: 'Which animal is a carnivore and lives in the African savanna?',
    options: ['Elephant', 'Lion', 'Giraffe', 'Zebra'],
  },
  {
    id: 'q7',
    prompt: 'We should protect wild animals and preserve their natural _______ .',
    options: ['habitats', 'cages', 'zoos', 'circuses'],
  },
  {
    id: 'q8',
    prompt: 'Last summer, my family and I _______ camping in the national forest.',
    options: ['go', 'went', 'have gone', 'are going'],
  },
  {
    id: 'q9',
    prompt: 'Which of the following is an individual indoor sport?',
    options: ['Archery', 'Football', 'Basketball', 'Rowing'],
  },
  {
    id: 'q10',
    prompt: 'He scored three goals in the final match, so his team won the _______ .',
    options: ['penalty', 'championship', 'equipment', 'spectator'],
  },
];

export const ArenaContainer: React.FC<ArenaContainerProps> = ({ onExit = () => {} }) => {
  const { student, sessionToken, openLoginModal } = useAuth();
  const { profile } = useGamification();

  // Resolve current student metrics from authentication context or fallback to TEST_701
  const studentNumber = student?.studentNumber || 'TEST_701';
  const displayName = student ? student.firstName : 'Zeynep Kaya';
  const studentClass = student?.class || '7-A';
  const lifetimeXp = profile?.totalXp || 1240;
  const initialSpendable = student?.totalCoins ?? CoinService.getBalance(studentNumber) ?? 95;

  const [metrics, setMetrics] = useState<ArenaStudentMetrics>({
    studentNumber,
    displayName,
    class: studentClass,
    grade: '7',
    academicLifetimeXp: lifetimeXp,
    spendableXp: initialSpendable > 0 ? initialSpendable : 95,
    arenaXpDelta: 0,
    level: profile?.level || 4,
    levelTitle: profile?.levelTitle || 'Arcade Veteran',
    todayMatchCount: 2,
    remainingMatches: 3,
    todayGrossLossXp: 5,
    remainingLossAllowance: 15,
    availableStakes: [0, 5, 10, 20],
  });

  // Current view
  const [view, setView] = useState<'lobby' | 'battle' | 'results'>('lobby');

  // Opponents roster
  const [opponents, setOpponents] = useState<ArenaOpponent[]>([
    {
      studentNumber: 'TEST_702',
      displayName: 'Ali Demir',
      class: '7-A',
      grade: '7',
      level: 3,
      levelTitle: 'Grammar Knight',
      status: 'idle',
      avatarSeed: 'TEST_702',
    },
    {
      studentNumber: '703',
      displayName: 'Can Yılmaz',
      class: '7-B',
      grade: '7',
      level: 4,
      levelTitle: 'Word Master',
      status: 'idle',
      avatarSeed: '703',
    },
    {
      studentNumber: '704',
      displayName: 'Elif Çelik',
      class: '7-A',
      grade: '7',
      level: 5,
      levelTitle: 'Legend',
      status: 'in_battle',
      avatarSeed: '704',
    },
    {
      studentNumber: '705',
      displayName: 'Mehmet Öztürk',
      class: '7-C',
      grade: '7',
      level: 3,
      levelTitle: 'Quiz Explorer',
      status: 'idle',
      avatarSeed: '705',
    },
  ]);

  // Challenge states
  const [incomingChallenge, setIncomingChallenge] = useState<ArenaChallenge | null>(null);
  const [outgoingChallenge, setOutgoingChallenge] = useState<ArenaChallenge | null>(null);

  // Active Battle Room
  const [activeRoom, setActiveRoom] = useState<ArenaMatchRoom | null>(null);

  // Match Outcome
  const [outcome, setOutcome] = useState<ArenaMatchOutcome | null>(null);

  // Establish presence & backend synchronization in Firebase
  useEffect(() => {
    let isCancelled = false;

    const initBackendAndFirebase = async () => {
      // 1. Authoritative Backend Status Synchronization
      if (sessionToken) {
        try {
          const statusRes = await ApiService.getArenaStatus(sessionToken);
          if (!isCancelled && statusRes.success && statusRes.metrics) {
            const m = statusRes.metrics;
            setMetrics((prev) => ({
              ...prev,
              academicLifetimeXp: m.academicLifetimeXp,
              spendableXp: m.spendableXp,
              arenaXpDelta: m.arenaXpDelta,
              level: m.level,
              levelTitle: m.levelTitle,
              todayMatchCount: m.todayMatchCount,
              remainingMatches: m.remainingMatches,
              todayGrossLossXp: m.todayGrossLossXp,
              remainingLossAllowance: m.remainingLossAllowance,
              availableStakes: m.availableStakes as ArenaStake[],
            }));
          }
        } catch (e) {
          console.warn('[Arena] Authoritative status sync failed, using local profile fallback:', e);
        }

        // 2. Mint & Authenticate Firebase Custom Token
        try {
          const tokenRes = await ApiService.getArenaCustomToken(sessionToken);
          if (tokenRes.success && tokenRes.customToken) {
            await ArenaFirebaseService.authenticate(tokenRes.customToken);
          }
        } catch (e) {
          console.warn('[Arena] Firebase Custom Token auth failed, using simulated session:', e);
        }
      }

      // 3. Establish Presence in Firebase
      try {
        await ArenaFirebaseService.setPresence(metrics.studentNumber, {
          displayName: metrics.displayName,
          class: metrics.class,
          grade: metrics.grade,
          level: metrics.level,
          levelTitle: metrics.levelTitle,
          status: 'idle',
        });
      } catch (e) {
        // Fallback for test / offline mode
      }
    };

    initBackendAndFirebase();

    // Subscribe to online Grade 7 classmates
    const unsubPresence = ArenaFirebaseService.subscribeToOnlineClassmates(
      metrics.studentNumber,
      metrics.grade,
      (liveOpponents) => {
        if (!isCancelled && liveOpponents.length > 0) {
          setOpponents(liveOpponents);
        }
      }
    );

    // Subscribe to incoming invitations
    const unsubInv = ArenaFirebaseService.subscribeToInvitations(
      metrics.studentNumber,
      (invitations) => {
        if (!isCancelled && invitations.length > 0) {
          setIncomingChallenge(invitations[0]);
        }
      }
    );

    return () => {
      isCancelled = true;
      if (unsubPresence) unsubPresence();
      if (unsubInv) unsubInv();
      ArenaFirebaseService.clearPresence(metrics.studentNumber).catch(() => {});
    };
  }, [sessionToken, metrics.studentNumber, metrics.displayName, metrics.class, metrics.grade, metrics.level, metrics.levelTitle]);

  // Challenge actions
  const handleSendChallenge = async (opponent: ArenaOpponent, stake: ArenaStake) => {
    let matchId = `ch_${Date.now()}`;

    // Backend authoritative quota and loss cap verification
    if (sessionToken) {
      try {
        const createRes = await ApiService.createArenaChallenge({
          sessionToken,
          opponentNumber: opponent.studentNumber,
          stakeXp: stake,
        });
        if (createRes.success && createRes.matchId) {
          matchId = createRes.matchId;
        } else if (createRes.error) {
          alert(`Challenge Rejected: ${createRes.error}`);
          return;
        }
      } catch (e) {
        console.warn('[Arena] Backend challenge creation fallback:', e);
      }
    }

    const challenge: ArenaChallenge = {
      challengeId: matchId,
      challenger_id: metrics.studentNumber,
      challenger_name: metrics.displayName,
      opponent_id: opponent.studentNumber,
      opponent_name: opponent.displayName,
      stake_xp: stake,
      grade: metrics.grade,
      status: 'pending',
      createdAt: Date.now(),
    };
    setOutgoingChallenge(challenge);

    // Write challenge to Firebase
    ArenaFirebaseService.createChallenge(challenge).catch(() => {});

    // For test simulation: opponent accepts after 3.2s if no live peer answers
    setTimeout(() => {
      setOutgoingChallenge((curr) => {
        if (curr && curr.challengeId === challenge.challengeId) {
          startBattle(opponent, stake, matchId);
          return null;
        }
        return curr;
      });
    }, 3200);
  };

  const handleAcceptChallenge = async (challenge: ArenaChallenge) => {
    // Backend authoritative acceptance
    if (sessionToken) {
      try {
        const acceptRes = await ApiService.acceptArenaChallenge({
          sessionToken,
          matchId: challenge.challengeId,
        });
        if (!acceptRes.success && acceptRes.error) {
          alert(`Cannot Accept Challenge: ${acceptRes.error}`);
          setIncomingChallenge(null);
          return;
        }
      } catch (e) {
        console.warn('[Arena] Backend challenge accept fallback:', e);
      }
    }

    const opponent = opponents.find((o) => o.studentNumber === challenge.challenger_id) || {
      studentNumber: challenge.challenger_id,
      displayName: challenge.challenger_name,
      class: '7-A',
      grade: '7',
      level: 3,
      levelTitle: 'Grammar Knight',
      status: 'idle',
      avatarSeed: challenge.challenger_id,
    };
    setIncomingChallenge(null);
    startBattle(opponent, challenge.stake_xp, challenge.challengeId);
  };

  const handleDeclineChallenge = (_challenge: ArenaChallenge) => {
    setIncomingChallenge(null);
  };

  const handleCancelChallenge = (_challenge: ArenaChallenge) => {
    if (outgoingChallenge) {
      ArenaFirebaseService.cancelChallenge(outgoingChallenge.challengeId).catch(() => {});
    }
    setOutgoingChallenge(null);
  };

  const startBattle = (opponent: ArenaOpponent, stake: ArenaStake, customMatchId?: string) => {
    ArenaFirebaseService.updatePresenceStatus(metrics.studentNumber, 'in_battle').catch(() => {});

    const room: ArenaMatchRoom = {
      battleId: customMatchId || `battle_${Date.now()}`,
      player1: {
        studentNumber: metrics.studentNumber,
        displayName: metrics.displayName,
        class: metrics.class,
        grade: metrics.grade,
        level: metrics.level,
        levelTitle: metrics.levelTitle,
        status: 'in_battle',
        avatarSeed: metrics.studentNumber,
      },
      player2: opponent,
      stakeXp: stake,
      currentQuestionIndex: 0,
      totalQuestions: 10,
      startedAt: Date.now(),
      questionDeadlines: {},
      questions: SAMPLE_QUESTIONS,
      status: 'in_progress',
    };

    setActiveRoom(room);
    setView('battle');
  };

  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    if (activeRoom) {
      ArenaFirebaseService.submitAnswer(
        activeRoom.battleId,
        metrics.studentNumber,
        questionIndex,
        optionIndex
      ).catch(() => {});
    }
  };

  const handleFinishMatch = async (p1Score: number, p2Score: number, p1TimeMs: number, p2TimeMs: number) => {
    if (!activeRoom) return;

    ArenaFirebaseService.updatePresenceStatus(metrics.studentNumber, 'idle').catch(() => {});

    let serverWinner = '';
    let serverIsTie = false;
    let p1Delta = 0;
    let p2Delta = 0;
    let serverP1Score = p1Score;
    let serverP2Score = p2Score;
    let serverSettledAt = new Date().toISOString();

    // Call Authoritative Server Settlement via Google Apps Script Backend
    if (sessionToken) {
      try {
        const settleRes = await ApiService.settleArenaMatch({
          sessionToken,
          matchId: activeRoom.battleId,
          idempotencyKey: `settle_${activeRoom.battleId}`,
          p1Score,
          p2Score,
          p1TotalTimeMs: p1TimeMs,
          p2TotalTimeMs: p2TimeMs,
        });

        if (settleRes.success) {
          serverWinner = settleRes.winner || '';
          serverIsTie = Boolean(settleRes.isTie);
          p1Delta = settleRes.p1XpChange ?? 0;
          p2Delta = settleRes.p2XpChange ?? 0;
          if (settleRes.p1Score !== undefined) serverP1Score = settleRes.p1Score;
          if (settleRes.p2Score !== undefined) serverP2Score = settleRes.p2Score;
          if (settleRes.settledAt) serverSettledAt = settleRes.settledAt;
        }
      } catch (e) {
        console.warn('[Arena] Authoritative settlement request failed, calculating local fallback:', e);
      }
    }

    // Local outcome derivation if offline or unauthenticated fallback
    if (!serverWinner && !serverIsTie) {
      serverIsTie = p1Score === p2Score && Math.abs(p1TimeMs - p2TimeMs) < 100;
      const p1Wins = p1Score > p2Score || (p1Score === p2Score && p1TimeMs < p2TimeMs);
      serverWinner = serverIsTie ? '' : p1Wins ? activeRoom.player1.studentNumber : activeRoom.player2.studentNumber;

      const stake = activeRoom.stakeXp;
      p1Delta = serverIsTie ? 0 : p1Wins ? stake : -stake;
      p2Delta = serverIsTie ? 0 : p1Wins ? -stake : stake;
    }

    const matchOutcome: ArenaMatchOutcome = {
      matchId: activeRoom.battleId,
      winnerId: serverWinner,
      isTie: serverIsTie,
      p1Score: serverP1Score,
      p2Score: serverP2Score,
      p1TotalTimeMs: p1TimeMs,
      p2TotalTimeMs: p2TimeMs,
      p1XpChange: p1Delta,
      p2XpChange: p2Delta,
      academicLifetimeXp: metrics.academicLifetimeXp,
      newSpendableXp: Math.max(0, metrics.spendableXp + p1Delta),
      levelFloorProtected: true,
      settledAt: serverSettledAt,
    };

    setMetrics((prev) => ({
      ...prev,
      spendableXp: Math.max(0, prev.spendableXp + p1Delta),
      todayMatchCount: prev.todayMatchCount + 1,
      todayGrossLossXp: prev.todayGrossLossXp + (p1Delta < 0 ? Math.abs(p1Delta) : 0),
      remainingMatches: Math.max(0, prev.remainingMatches - 1),
      remainingLossAllowance: Math.max(0, prev.remainingLossAllowance - (p1Delta < 0 ? Math.abs(p1Delta) : 0)),
    }));

    setOutcome(matchOutcome);
    setView('results');
  };

  const handleForfeit = async () => {
    if (!activeRoom) return;
    ArenaFirebaseService.updatePresenceStatus(metrics.studentNumber, 'idle').catch(() => {});

    const stake = activeRoom.stakeXp;
    let p1Delta: number = -stake;
    let p2Delta: number = stake;
    let serverSettledAt = new Date().toISOString();

    if (sessionToken) {
      try {
        const forfeitRes = await ApiService.settleArenaMatch({
          sessionToken,
          matchId: activeRoom.battleId,
          isForfeit: true,
          forfeitLoser: metrics.studentNumber,
        });
        if (forfeitRes.success) {
          p1Delta = forfeitRes.p1XpChange ?? -stake;
          p2Delta = forfeitRes.p2XpChange ?? stake;
          if (forfeitRes.settledAt) serverSettledAt = forfeitRes.settledAt;
        }
      } catch (e) {
        console.warn('[Arena] Authoritative forfeit call failed:', e);
      }
    }

    const matchOutcome: ArenaMatchOutcome = {
      matchId: activeRoom.battleId,
      winnerId: activeRoom.player2.studentNumber,
      isTie: false,
      isForfeit: true,
      p1Score: 0,
      p2Score: 10,
      p1TotalTimeMs: 150000,
      p2TotalTimeMs: 12000,
      p1XpChange: p1Delta,
      p2XpChange: p2Delta,
      academicLifetimeXp: metrics.academicLifetimeXp,
      newSpendableXp: Math.max(0, metrics.spendableXp + p1Delta),
      levelFloorProtected: true,
      settledAt: serverSettledAt,
    };

    setMetrics((prev) => ({
      ...prev,
      spendableXp: Math.max(0, prev.spendableXp + p1Delta),
      todayMatchCount: prev.todayMatchCount + 1,
      todayGrossLossXp: prev.todayGrossLossXp + Math.abs(p1Delta),
      remainingMatches: Math.max(0, prev.remainingMatches - 1),
      remainingLossAllowance: Math.max(0, prev.remainingLossAllowance - Math.abs(p1Delta)),
    }));

    setOutcome(matchOutcome);
    setView('results');
  };

  // Preview Mode quick-switchers for testing
  const triggerIncomingModalPreview = () => {
    setView('lobby');
    setIncomingChallenge({
      challengeId: 'ch_preview_99',
      challenger_id: 'TEST_702',
      challenger_name: 'Ali Demir',
      opponent_id: metrics.studentNumber,
      opponent_name: metrics.displayName,
      stake_xp: 10,
      grade: '7',
      status: 'pending',
      createdAt: Date.now(),
    });
  };

  const triggerBattlePreview = () => {
    const opp = opponents[0];
    startBattle(opp, 10);
  };

  const triggerVictoryPreview = () => {
    const opp = opponents[0];
    setActiveRoom({
      battleId: 'battle_demo_win_88',
      player1: {
        studentNumber: metrics.studentNumber,
        displayName: metrics.displayName,
        class: metrics.class,
        grade: metrics.grade,
        level: metrics.level,
        levelTitle: metrics.levelTitle,
        status: 'in_battle',
        avatarSeed: metrics.studentNumber,
      },
      player2: opp,
      stakeXp: 10,
      currentQuestionIndex: 9,
      totalQuestions: 10,
      startedAt: Date.now() - 120000,
      questionDeadlines: {},
      questions: SAMPLE_QUESTIONS,
      status: 'completed',
    });
    setOutcome({
      matchId: 'battle_demo_win_88',
      winnerId: metrics.studentNumber,
      isTie: false,
      p1Score: 9,
      p2Score: 8,
      p1TotalTimeMs: 14200,
      p2TotalTimeMs: 16800,
      p1XpChange: 10,
      p2XpChange: -10,
      academicLifetimeXp: metrics.academicLifetimeXp,
      newSpendableXp: metrics.spendableXp + 10,
      levelFloorProtected: true,
      settledAt: new Date().toISOString(),
    });
    setView('results');
  };

  const triggerDefeatPreview = () => {
    const opp = opponents[0];
    setActiveRoom({
      battleId: 'battle_demo_loss_99',
      player1: {
        studentNumber: metrics.studentNumber,
        displayName: metrics.displayName,
        class: metrics.class,
        grade: metrics.grade,
        level: metrics.level,
        levelTitle: metrics.levelTitle,
        status: 'in_battle',
        avatarSeed: metrics.studentNumber,
      },
      player2: opp,
      stakeXp: 10,
      currentQuestionIndex: 9,
      totalQuestions: 10,
      startedAt: Date.now() - 120000,
      questionDeadlines: {},
      questions: SAMPLE_QUESTIONS,
      status: 'completed',
    });
    setOutcome({
      matchId: 'battle_demo_loss_99',
      winnerId: opp.studentNumber,
      isTie: false,
      p1Score: 7,
      p2Score: 9,
      p1TotalTimeMs: 18400,
      p2TotalTimeMs: 15200,
      p1XpChange: -10,
      p2XpChange: 10,
      academicLifetimeXp: metrics.academicLifetimeXp,
      newSpendableXp: metrics.spendableXp - 10,
      levelFloorProtected: true,
      settledAt: new Date().toISOString(),
    });
    setView('results');
  };

  // Enforce student authentication guard
  if (!student || !sessionToken) {
    return (
      <div className="min-h-screen bg-game-sky text-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-gradient-to-tr from-amber-300 via-yellow-200 to-amber-100 opacity-60 blur-2xl" />
          <div className="absolute top-8 right-12 w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-yellow-300 shadow-xl shadow-amber-300/50 anim-pulse opacity-85 flex items-center justify-center text-3xl">
            ⚔️
          </div>
        </div>

        <div className="max-w-md w-full bg-white/95 backdrop-blur-md rounded-3xl p-8 border-4 border-sky-400 shadow-2xl text-center z-10 animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-4xl shadow-lg border-2 border-white">
            ⚔️
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Student Login Required</h2>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            XP Battle Arena is an exclusive live 1v1 arena where students duel with spendable XP. Please log in with your student number to enter the arena.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => openLoginModal()}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-black text-base shadow-lg shadow-sky-500/25 hover:brightness-110 active:scale-95 transition-all"
            >
              Log In as Student
            </button>
            <button
              onClick={onExit}
              className="w-full py-3 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-game-sky text-slate-900 flex flex-col font-sans selection:bg-sky-500 selection:text-white relative overflow-x-hidden w-full max-w-full">
      
      {/* Background Decor: Sun & Floating Clouds matching Phase 9 Homepage */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 max-w-full">
        <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-gradient-to-tr from-amber-300 via-yellow-200 to-amber-100 opacity-60 blur-2xl max-w-full" />
        <div className="absolute top-8 right-12 w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-yellow-300 shadow-xl shadow-amber-300/50 anim-pulse opacity-85 flex items-center justify-center text-3xl">
          ☀️
        </div>
      </div>

      {/* Top Header */}
      <ArenaHeader metrics={metrics} onExit={onExit} />

      {/* Main Screen Body */}
      <main className="flex-1 pb-16 relative z-10">
        {view === 'lobby' && (
          <ArenaLobby
            metrics={metrics}
            opponents={opponents}
            incomingChallenge={incomingChallenge}
            outgoingChallenge={outgoingChallenge}
            onSendChallenge={handleSendChallenge}
            onAcceptChallenge={handleAcceptChallenge}
            onDeclineChallenge={handleDeclineChallenge}
            onCancelChallenge={handleCancelChallenge}
          />
        )}

        {view === 'battle' && activeRoom && (
          <ArenaBattle
            room={activeRoom}
            userId={metrics.studentNumber}
            onSelectOption={handleSelectOption}
            onFinishMatch={handleFinishMatch}
            onForfeit={handleForfeit}
          />
        )}

        {view === 'results' && outcome && activeRoom && (
          <ArenaResults
            outcome={outcome}
            user={activeRoom.player1}
            opponent={activeRoom.player2}
            stakeXp={activeRoom.stakeXp}
            onRematch={() => {
              const opp = activeRoom.player2;
              startBattle(opp, activeRoom.stakeXp);
            }}
            onReturnToLobby={() => {
              setView('lobby');
              setOutgoingChallenge(null);
              setIncomingChallenge(null);
            }}
          />
        )}
      </main>

      {/* Developer / Design Review Toolbar */}
      <div className="bg-white/90 border-t border-sky-100 px-4 py-2 sticky bottom-0 z-50 backdrop-blur-md shadow-lg">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-sky-800 font-bold font-display">
            <Eye className="w-4 h-4 text-sky-600" />
            <span>Arena Modes:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => {
                setView('lobby');
                setIncomingChallenge(null);
                setOutgoingChallenge(null);
              }}
              className={`px-2.5 py-1 rounded-lg border font-bold transition font-display ${
                view === 'lobby' && !incomingChallenge
                  ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              1. Lobby
            </button>
            <button
              onClick={triggerIncomingModalPreview}
              className={`px-2.5 py-1 rounded-lg border font-bold transition font-display ${
                view === 'lobby' && incomingChallenge
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              2. Incoming Modal
            </button>
            <button
              onClick={triggerBattlePreview}
              className={`px-2.5 py-1 rounded-lg border font-bold transition font-display ${
                view === 'battle'
                  ? 'bg-amber-500 text-amber-950 border-amber-500 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              3. 10Q Battle
            </button>
            <button
              onClick={triggerVictoryPreview}
              className={`px-2.5 py-1 rounded-lg border font-bold transition font-display ${
                view === 'results' && outcome?.winnerId === metrics.studentNumber
                  ? 'bg-amber-400 text-amber-950 border-amber-400 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              4. Results: Victory
            </button>
            <button
              onClick={triggerDefeatPreview}
              className={`px-2.5 py-1 rounded-lg border font-bold transition font-display ${
                view === 'results' && outcome?.winnerId !== metrics.studentNumber
                  ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              5. Results: Defeat (Loss Cap)
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
