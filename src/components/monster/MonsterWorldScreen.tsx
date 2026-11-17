import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowLeft,
  Shuffle,
  Save,
  Coins,
  CheckCircle2,
  Lock,
  Palette,
  Eye,
  Smile,
  Crown,
  Shirt,
  AlertCircle,
  Check,
  ChevronRight,
} from 'lucide-react';
import { useArcade } from '../../context/ArcadeContext';
import { useAuth } from '../../context/AuthContext';
import { useGamification } from '../../context/GamificationContext';
import { MonsterAvatar } from './MonsterAvatar';
import { MonsterService, MONSTER_OPTIONS } from '../../services/monsterService';
import { CoinService } from '../../services/coinService';
import { sounds } from '../../services/soundEffects';
import {
  FUTURE_SHOP_CATALOG,
  MONSTER_MILESTONES,
  getMonsterMilestoneInfo,
  type MonsterConfig,
  type MonsterBodyShape,
  type MonsterBodyColor,
  type MonsterEyeType,
  type MonsterMouthType,
  type MonsterHornType,
  type MonsterCheekType,
  type MonsterPattern,
  type ShopAccessoryItem,
  type MonsterAccessories,
} from '../../types/monster';

type MonsterWorldView = 'hub' | 'studio' | 'shop' | 'evolution';
type StudioTab = 'color' | 'shape' | 'eyes' | 'mouth' | 'features' | 'patterns';
type ShopCategoryFilter = 'all' | 'hat' | 'glasses' | 'clothing' | 'wings';

export const MonsterWorldScreen: React.FC = () => {
  const { navigateTo } = useArcade();
  const { student, sessionToken, updateStudentMonster } = useAuth();
  const { profile: gamificationProfile, updateProfileMonster } = useGamification();
  const studentNumber = student?.studentNumber || '';

  // Calculate current XP & Lifecycle milestone
  const studentXp = gamificationProfile?.totalXp ?? 0;
  const milestone = getMonsterMilestoneInfo(studentXp);

  // Screen View State
  const [currentView, setCurrentView] = useState<MonsterWorldView>('hub');
  const [activeStudioTab, setActiveStudioTab] = useState<StudioTab>('color');
  const [shopCategory, setShopCategory] = useState<ShopCategoryFilter>('all');

  // Egg interaction wiggle state
  const [eggWiggle, setEggWiggle] = useState(false);

  // Monster state
  const [monster, setMonster] = useState<MonsterConfig>(() => {
    return MonsterService.resolveMonster(student?.monster, studentNumber);
  });

  // Shop Mirror Preview accessories
  const [previewAccessories, setPreviewAccessories] = useState<MonsterAccessories>(() => {
    return monster.accessories || {};
  });

  // Save / Action feedback states
  const [isSaving, setIsSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [shopActionError, setShopActionError] = useState<string | null>(null);
  const [shopActionSuccess, setShopActionSuccess] = useState<string | null>(null);

  // Celebration modals
  const [showHatchingModal, setShowHatchingModal] = useState<boolean>(false);
  const [showEvolutionModal, setShowEvolutionModal] = useState<boolean>(false);

  // Coins balance
  const coinSummary = CoinService.getSummary(studentNumber);
  const coinBalance = student?.totalCoins ?? coinSummary.balance;

  // On mount / session verify, fetch cloud monster and check celebrations
  useEffect(() => {
    let isCancelled = false;

    if (studentNumber && sessionToken) {
      MonsterService.fetchMonster(studentNumber, sessionToken)
        .then((res) => {
          if (!isCancelled && res.success && res.monster) {
            setMonster(res.monster);
            setPreviewAccessories(res.monster.accessories || {});
            updateStudentMonster?.(res.monster);
            updateProfileMonster?.(res.monster);
          }
        })
        .catch((err) => {
          console.warn('[MonsterWorldScreen] Background monster fetch deferred:', err);
        });
    } else if (studentNumber) {
      const resolved = MonsterService.resolveMonster(student?.monster, studentNumber);
      setMonster(resolved);
      setPreviewAccessories(resolved.accessories || {});
    }

    // Check Hatching celebration (if student is 500+ XP but hasn't seen celebration yet)
    if (studentNumber && milestone.isHatched && !MonsterService.hasSeenHatching(studentNumber)) {
      setShowHatchingModal(true);
      sounds.playSuccess();
    } else if (
      studentNumber &&
      milestone.evolutionTier >= 2 &&
      !MonsterService.hasSeenEvolution(studentNumber, milestone.evolutionTier)
    ) {
      setShowEvolutionModal(true);
      sounds.playSuccess();
    }

    return () => {
      isCancelled = true;
    };
  }, [studentNumber, sessionToken, milestone.isHatched, milestone.evolutionTier, updateStudentMonster, updateProfileMonster]);

  // Keep preview accessories synced when monster updates
  useEffect(() => {
    setPreviewAccessories(monster.accessories || {});
  }, [monster]);

  // Handle Egg Tap
  const handleEggTap = () => {
    sounds.playTap();
    setEggWiggle(true);
    setTimeout(() => setEggWiggle(false), 800);
  };

  // Studio handlers
  const handleStudioUpdate = <K extends keyof MonsterConfig>(key: K, value: MonsterConfig[K]) => {
    setMonster((prev) => ({
      ...prev,
      [key]: value,
    }));
    setSavedNotice(false);
    setSaveError(null);
  };

  const handleSurpriseMe = () => {
    sounds.playTap();
    const randomMonster = MonsterService.generateRandomMonster(monster.name);
    // Preserve accessories if already owned
    randomMonster.accessories = monster.accessories;
    setMonster(randomMonster);
    setSavedNotice(false);
    setSaveError(null);
  };

  const handleSaveMonster = async () => {
    if (!studentNumber) return;
    sounds.playTap();
    setIsSaving(true);
    setSaveError(null);

    const token = sessionToken || '';
    const result = await MonsterService.saveMonster(studentNumber, token, monster);

    if (result.success && result.monster) {
      sounds.playSuccess();
      setMonster(result.monster);
      setPreviewAccessories(result.monster.accessories || {});
      updateStudentMonster?.(result.monster);
      updateProfileMonster?.(result.monster);
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 3000);
    } else {
      sounds.playError();
      setSavedNotice(false);
      setSaveError(result.error || 'Could not save monster to server. Please try again.');
    }
    setIsSaving(false);
  };

  // Shop handlers
  const handleTryOnAccessory = (item: ShopAccessoryItem) => {
    sounds.playTap();
    setShopActionError(null);
    setShopActionSuccess(null);
    setPreviewAccessories((prev) => ({
      ...prev,
      [item.category]: item.id,
    }));
  };

  const handleBuyAccessory = async (item: ShopAccessoryItem) => {
    if (!studentNumber) return;
    sounds.playTap();
    setShopActionError(null);
    setShopActionSuccess(null);

    const studentClass = student?.class || '';
    const result = await MonsterService.purchaseAccessory(
      studentNumber,
      sessionToken || undefined,
      studentClass,
      item.id
    );

    if (result.success && result.monster) {
      sounds.playSuccess();
      setMonster(result.monster);
      setPreviewAccessories(result.monster.accessories || {});
      updateStudentMonster?.(result.monster);
      updateProfileMonster?.(result.monster);
      setShopActionSuccess(`Purchased ${item.name}! Check your fitting mirror.`);
      setTimeout(() => setShopActionSuccess(null), 3500);
    } else {
      sounds.playError();
      setShopActionError(result.error || 'Purchase failed.');
      setTimeout(() => setShopActionError(null), 4000);
    }
  };

  const handleEquipToggle = async (item: ShopAccessoryItem) => {
    if (!studentNumber) return;
    sounds.playTap();
    setShopActionError(null);
    setShopActionSuccess(null);

    const currentSlot = monster.accessories?.[item.category as keyof MonsterAccessories] as string | undefined;
    const newId = currentSlot === item.id ? null : item.id;

    const result = await MonsterService.equipAccessory(
      studentNumber,
      sessionToken || undefined,
      item.category as 'hat' | 'glasses' | 'clothing' | 'wings',
      newId
    );

    if (result.success && result.monster) {
      sounds.playSuccess();
      setMonster(result.monster);
      setPreviewAccessories(result.monster.accessories || {});
      updateStudentMonster?.(result.monster);
      updateProfileMonster?.(result.monster);
      setShopActionSuccess(newId ? `Equipped ${item.name}!` : `Unequipped ${item.name}.`);
      setTimeout(() => setShopActionSuccess(null), 2500);
    } else {
      sounds.playError();
      setShopActionError(result.error || 'Failed to update equipment.');
      setTimeout(() => setShopActionError(null), 3500);
    }
  };

  // Celebration action dismissals
  const handleConfirmHatching = () => {
    sounds.playTap();
    MonsterService.markHatchingSeen(studentNumber);
    setShowHatchingModal(false);
    setCurrentView('studio');
  };

  const handleConfirmEvolution = () => {
    sounds.playTap();
    MonsterService.markEvolutionSeen(studentNumber, milestone.evolutionTier);
    setShowEvolutionModal(false);
  };

  // Accessory Filtered list
  const filteredShopItems = FUTURE_SHOP_CATALOG.filter((item) => {
    if (shopCategory === 'all') return true;
    return item.category === shopCategory;
  });

  const ownedAccessories = monster.accessories?.owned || [];

  const colorLabels: Record<MonsterBodyColor, string> = {
    cyan: 'Electric Cyan',
    purple: 'Mystic Purple',
    pink: 'Bubblegum Pink',
    lime: 'Neon Lime',
    orange: 'Sunset Orange',
    amber: 'Golden Amber',
    emerald: 'Emerald Green',
    indigo: 'Deep Indigo',
  };

  const shapeLabels: Record<MonsterBodyShape, string> = {
    blob: 'Jelly Blob',
    fuzzy: 'Fuzzy Ball',
    sprout: 'Bean Sprout',
    slime: 'Bouncy Slime',
    chubby: 'Chubby Pal',
    star: 'Starlight',
  };

  const eyeLabels: Record<MonsterEyeType, string> = {
    anime: 'Glossy Anime',
    cyclops: 'Friendly Cyclops',
    sleepy: 'Dreamy Chill',
    wink: 'Playful Wink',
    three_eyes: 'Triple Sight',
    googly: 'Googly Quirky',
  };

  const mouthLabels: Record<MonsterMouthType, string> = {
    smile: 'Gentle Smile',
    fang_grin: 'Happy Fangs',
    laughing: 'Joyful Laugh',
    goofy_teeth: 'Buck Teeth',
    cat_mouth: 'Cheeky Kitty',
    whistle: 'Tiny Whistle',
  };

  const hornLabels: Record<MonsterHornType, string> = {
    antennae: 'Orb Antennae',
    single_horn: 'Magic Horn',
    twin_horns: 'Little Horns',
    leaves: 'Sprout Leaves',
    cat_ears: 'Cozy Ears',
    none: 'Smooth Head',
  };

  const cheekLabels: Record<MonsterCheekType, string> = {
    blush_dots: 'Rosy Blush',
    freckles: 'Cute Freckles',
    spiral: 'Cartoon Swirls',
    stars: 'Twinkle Stars',
    none: 'Clean Cheeks',
  };

  const patternLabels: Record<MonsterPattern, string> = {
    belly_patch: 'Pastel Belly',
    spots: 'Confetti Spots',
    stripes: 'Tiger Stripes',
    heart: 'Sweet Heart',
    none: 'Solid Body',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-slate-100 p-4 sm:p-6 lg:p-8">
      {/* ================================================================= */}
      {/* TOP HEADER & BAR                                                  */}
      {/* ================================================================= */}
      <div className="max-w-6xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.playBack();
              if (currentView !== 'hub') {
                setCurrentView('hub');
              } else {
                navigateTo({ view: 'home' });
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{currentView === 'hub' ? 'Back to Arcade' : 'Back to Monster World'}</span>
          </button>

          {currentView !== 'hub' && (
            <span className="text-xs uppercase font-mono font-bold px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {currentView === 'studio' && '🎨 Monster Studio'}
              {currentView === 'shop' && '🛍️ Monster Wardrobe'}
              {currentView === 'evolution' && '🌟 Evolution Chamber'}
            </span>
          )}
        </div>

        {/* Monster Coins Bank Pill */}
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 shadow-sm shadow-amber-500/5">
          <Coins className="w-5 h-5 text-amber-400 animate-pulse" />
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400/80">Monster Coins</span>
            <span className="text-lg font-black leading-none">{coinBalance}</span>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* VIEW 1: HUB OVERVIEW                                              */}
      {/* ================================================================= */}
      {currentView === 'hub' && (
        <div className="max-w-6xl mx-auto space-y-6">
          {/* STAGE A: EGG & CRACKING EGG STAGES (0 - 499 XP) */}
          {milestone.isEgg ? (
            <div className="bg-slate-800/70 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {milestone.stage === 'egg' ? 'Stage 1: Incubating Egg' : 'Stage 2: Fissures Forming!'}
                </span>
              </div>

              {/* Egg Avatar with tap wiggle */}
              <div
                onClick={handleEggTap}
                className={`cursor-pointer transition-transform duration-300 my-4 select-none ${
                  eggWiggle ? 'scale-110 rotate-3' : 'hover:scale-105'
                }`}
                title="Tap to check on your growing monster!"
              >
                <MonsterAvatar config={monster} size={230} stage={milestone.stage} animate />
              </div>

              <span className="text-xs text-indigo-300 font-semibold mb-6 animate-pulse">
                👆 Tap your egg to send warmth!
              </span>

              {/* Status Message */}
              <div className="w-full max-w-xl bg-slate-900/80 border border-slate-700/80 rounded-2xl p-4 mb-6">
                <h3 className="text-base sm:text-lg font-black text-amber-300 mb-1">
                  {milestone.stage === 'egg'
                    ? 'Your monster is growing inside!'
                    : 'Something is moving! Cracks are spreading!'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  {milestone.stage === 'egg'
                    ? 'Complete English activities and unit reviews to keep your egg warm and help it hatch.'
                    : `Only ${Math.max(0, MONSTER_MILESTONES.HATCHING_XP - studentXp)} XP needed until your unique companion breaks free!`}
                </p>
              </div>

              {/* Incubation Progress Bar */}
              <div className="w-full max-w-xl mb-6">
                <div className="flex justify-between items-center text-xs font-bold text-slate-300 mb-1.5">
                  <span>Hatching Progress</span>
                  <span className="text-cyan-300 font-mono">
                    {studentXp} / {MONSTER_MILESTONES.HATCHING_XP} XP ({milestone.progressPercent}%)
                  </span>
                </div>
                <div className="h-3.5 w-full rounded-full bg-slate-900 border border-slate-700 overflow-hidden p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 via-purple-500 to-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${milestone.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Feature Locks Notice */}
              <div className="w-full max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
                  <Lock className="w-5 h-5 text-slate-500 shrink-0" />
                  <div className="text-xs">
                    <strong className="block text-slate-300 font-bold">Monster Studio</strong>
                    <span className="text-slate-400">Unlocks at 500 XP on Hatching Day!</span>
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
                  <Lock className="w-5 h-5 text-slate-500 shrink-0" />
                  <div className="text-xs">
                    <strong className="block text-slate-300 font-bold">Monster Wardrobe</strong>
                    <span className="text-slate-400">Shop unlocks at 750 XP!</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* STAGE B: HATCHED MONSTER HOME (500+ XP) */
            <div className="space-y-6">
              {/* Monster Hero Showcase */}
              <div className="bg-slate-800/70 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                  <div className="w-48 h-48 rounded-3xl bg-slate-900/80 border border-indigo-500/40 flex items-center justify-center p-3 shrink-0 shadow-inner">
                    <MonsterAvatar
                      config={monster}
                      size={180}
                      animate
                      stage={milestone.stage}
                      evolutionTier={milestone.evolutionTier}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{milestone.stageName}</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white">{monster.name}</h2>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-md">
                      Your loyal learning companion. Practice daily to level up your monster and discover rare evolutions!
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
                      <span className="px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-300 font-mono">
                        Total XP: <strong className="text-cyan-300">{studentXp}</strong>
                      </span>
                      <span className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5" />
                        <span>{coinBalance} Coins</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Evolution Milestone Progress */}
                {milestone.nextMilestoneXp && (
                  <div className="w-full md:w-64 bg-slate-900/80 border border-slate-700/80 rounded-2xl p-4 text-left space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                      <span>Next Evolution</span>
                      <span className="text-purple-300 font-mono">{milestone.progressPercent}%</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                        style={{ width: `${milestone.progressPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>{studentXp} XP</span>
                      <span>Target: {milestone.nextMilestoneXp} XP</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 3 Main Action Portals */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* 1. Monster Studio Portal */}
                <div
                  onClick={() => {
                    sounds.playNavigate();
                    setCurrentView('studio');
                  }}
                  className="group p-6 rounded-3xl bg-slate-800/60 hover:bg-slate-800/90 border border-slate-700/70 hover:border-indigo-400/50 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-xl"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
                      🎨
                    </div>
                    <h3 className="text-lg font-black text-white group-hover:text-indigo-200">
                      Monster Studio
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Customize body shape, colors, eyes, smiles, horns, and name.
                    </p>
                  </div>
                  <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-indigo-400">
                    <span>Open Studio</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                </div>

                {/* 2. Wardrobe & Shop Portal */}
                {milestone.isShopUnlocked ? (
                  <div
                    onClick={() => {
                      sounds.playNavigate();
                      setCurrentView('shop');
                    }}
                    className="group p-6 rounded-3xl bg-slate-800/60 hover:bg-slate-800/90 border border-amber-500/30 hover:border-amber-400/60 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-xl"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
                        🛍️
                      </div>
                      <h3 className="text-lg font-black text-white group-hover:text-amber-200">
                        Monster Wardrobe
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Dress up in crowns, glasses, scarves, capes, and wings using Monster Coins.
                      </p>
                    </div>
                    <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-amber-400">
                      <span>Enter Wardrobe</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between opacity-80">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-500 flex items-center justify-center text-2xl mb-4">
                        🔒
                      </div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-black text-slate-300">Monster Wardrobe</h3>
                        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                          Locked
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Unlocks at <strong className="text-amber-300">750 XP</strong>. Earn{' '}
                        {Math.max(0, MONSTER_MILESTONES.SHOP_UNLOCK_XP - studentXp)} more XP to start shopping!
                      </p>
                    </div>
                    <div className="mt-6 pt-3 border-t border-slate-800/60 text-xs font-bold text-slate-500">
                      Practice more to unlock
                    </div>
                  </div>
                )}

                {/* 3. Evolution Chamber Portal */}
                <div
                  onClick={() => {
                    sounds.playNavigate();
                    setCurrentView('evolution');
                  }}
                  className="group p-6 rounded-3xl bg-slate-800/60 hover:bg-slate-800/90 border border-purple-500/30 hover:border-purple-400/60 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-xl"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
                      🌟
                    </div>
                    <h3 className="text-lg font-black text-white group-hover:text-purple-200">
                      Evolution Chamber
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Preview all 4 evolutionary tiers and unlock powerful companion traits.
                    </p>
                  </div>
                  <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-purple-400">
                    <span>View Roadmap</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================================================================= */}
      {/* VIEW 2: MONSTER STUDIO (XP >= 500)                                */}
      {/* ================================================================= */}
      {currentView === 'studio' && (
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Live Monster Preview & Actions */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/70 rounded-3xl p-6 flex flex-col items-center text-center shadow-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Customization Stage</span>
              </div>

              {/* Live SVG Stage */}
              <div className="relative w-64 h-64 flex items-center justify-center my-2 rounded-2xl bg-gradient-to-b from-slate-900/60 to-indigo-950/40 border border-slate-700/40 p-4">
                <MonsterAvatar
                  config={monster}
                  size={210}
                  animate
                  stage={milestone.stage}
                  evolutionTier={milestone.evolutionTier}
                  className="transform transition duration-300"
                />
              </div>

              {/* Monster Name */}
              <div className="w-full mt-4">
                <label
                  htmlFor="monster-name-input"
                  className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-1"
                >
                  Monster Name
                </label>
                <input
                  id="monster-name-input"
                  type="text"
                  value={monster.name}
                  maxLength={20}
                  onChange={(e) => handleStudioUpdate('name', e.target.value)}
                  placeholder="Name your monster..."
                  className="w-full text-center text-xl font-bold px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-100"
                />
              </div>

              {/* Quick Actions */}
              <div className="w-full grid grid-cols-2 gap-3 mt-5">
                <button
                  onClick={handleSurpriseMe}
                  type="button"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-700/70 hover:bg-slate-600/70 text-slate-200 font-semibold border border-slate-600/50 transition active:scale-95"
                >
                  <Shuffle className="w-4 h-4 text-purple-400" />
                  <span>Surprise Me!</span>
                </button>

                <button
                  onClick={handleSaveMonster}
                  disabled={isSaving}
                  type="button"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold shadow-lg shadow-indigo-500/20 transition active:scale-95 disabled:opacity-50"
                >
                  {savedNotice ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{isSaving ? 'Saving...' : 'Save Monster'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Error Notice */}
              {saveError && (
                <div className="w-full mt-3 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs text-center flex items-center justify-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{saveError}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Customization Tabs */}
          <div className="lg:col-span-7 bg-slate-800/60 backdrop-blur-md border border-slate-700/70 rounded-3xl p-6 shadow-xl flex flex-col">
            {/* Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-2xl border border-slate-800 overflow-x-auto mb-6">
              <button
                onClick={() => setActiveStudioTab('color')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeStudioTab === 'color'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Color</span>
              </button>

              <button
                onClick={() => setActiveStudioTab('shape')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeStudioTab === 'shape'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Shape</span>
              </button>

              <button
                onClick={() => setActiveStudioTab('eyes')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeStudioTab === 'eyes'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Eyes</span>
              </button>

              <button
                onClick={() => setActiveStudioTab('mouth')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeStudioTab === 'mouth'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Smile className="w-3.5 h-3.5" />
                <span>Mouth</span>
              </button>

              <button
                onClick={() => setActiveStudioTab('features')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeStudioTab === 'features'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Features</span>
              </button>

              <button
                onClick={() => setActiveStudioTab('patterns')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeStudioTab === 'patterns'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Shirt className="w-3.5 h-3.5" />
                <span>Patterns</span>
              </button>
            </div>

            {/* TAB: COLORS */}
            {activeStudioTab === 'color' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Choose Body Color</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {MONSTER_OPTIONS.colors.map((color) => {
                    const isSelected = monster.bodyColor === color;
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleStudioUpdate('bodyColor', color)}
                        className={`flex flex-col items-center gap-2 p-3.5 rounded-2xl border transition text-center ${
                          isSelected
                            ? 'bg-indigo-950/60 border-indigo-400 ring-2 ring-indigo-400/30'
                            : 'bg-slate-900/60 border-slate-700/60 hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-white/20 shadow-md">
                          <MonsterAvatar config={{ ...monster, bodyColor: color }} size={38} />
                        </div>
                        <span className={`text-xs font-bold ${isSelected ? 'text-indigo-300' : 'text-slate-300'}`}>
                          {colorLabels[color]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB: SHAPES */}
            {activeStudioTab === 'shape' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Choose Body Shape</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {MONSTER_OPTIONS.shapes.map((shape) => {
                    const isSelected = monster.bodyShape === shape;
                    return (
                      <button
                        key={shape}
                        type="button"
                        onClick={() => handleStudioUpdate('bodyShape', shape)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition text-center ${
                          isSelected
                            ? 'bg-indigo-950/60 border-indigo-400 ring-2 ring-indigo-400/30'
                            : 'bg-slate-900/60 border-slate-700/60 hover:bg-slate-800/60'
                        }`}
                      >
                        <MonsterAvatar config={{ ...monster, bodyShape: shape }} size={56} />
                        <span className={`text-xs font-bold ${isSelected ? 'text-indigo-300' : 'text-slate-300'}`}>
                          {shapeLabels[shape]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB: EYES */}
            {activeStudioTab === 'eyes' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Choose Eye Style</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {MONSTER_OPTIONS.eyes.map((eyeType) => {
                    const isSelected = monster.eyeType === eyeType;
                    return (
                      <button
                        key={eyeType}
                        type="button"
                        onClick={() => handleStudioUpdate('eyeType', eyeType)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition text-center ${
                          isSelected
                            ? 'bg-indigo-950/60 border-indigo-400 ring-2 ring-indigo-400/30'
                            : 'bg-slate-900/60 border-slate-700/60 hover:bg-slate-800/60'
                        }`}
                      >
                        <MonsterAvatar config={{ ...monster, eyeType }} size={56} />
                        <span className={`text-xs font-bold ${isSelected ? 'text-indigo-300' : 'text-slate-300'}`}>
                          {eyeLabels[eyeType]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB: MOUTH */}
            {activeStudioTab === 'mouth' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Choose Mouth Style</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {MONSTER_OPTIONS.mouths.map((mouthType) => {
                    const isSelected = monster.mouthType === mouthType;
                    return (
                      <button
                        key={mouthType}
                        type="button"
                        onClick={() => handleStudioUpdate('mouthType', mouthType)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition text-center ${
                          isSelected
                            ? 'bg-indigo-950/60 border-indigo-400 ring-2 ring-indigo-400/30'
                            : 'bg-slate-900/60 border-slate-700/60 hover:bg-slate-800/60'
                        }`}
                      >
                        <MonsterAvatar config={{ ...monster, mouthType }} size={56} />
                        <span className={`text-xs font-bold ${isSelected ? 'text-indigo-300' : 'text-slate-300'}`}>
                          {mouthLabels[mouthType]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB: FEATURES (HORNS & CHEEKS) */}
            {activeStudioTab === 'features' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Head Features</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {MONSTER_OPTIONS.horns.map((hornType) => {
                      const isSelected = monster.hornType === hornType;
                      return (
                        <button
                          key={hornType}
                          type="button"
                          onClick={() => handleStudioUpdate('hornType', hornType)}
                          className={`flex flex-col items-center gap-2 p-3.5 rounded-2xl border transition text-center ${
                            isSelected
                              ? 'bg-indigo-950/60 border-indigo-400 ring-2 ring-indigo-400/30'
                              : 'bg-slate-900/60 border-slate-700/60 hover:bg-slate-800/60'
                          }`}
                        >
                          <MonsterAvatar config={{ ...monster, hornType }} size={50} />
                          <span className={`text-xs font-bold ${isSelected ? 'text-indigo-300' : 'text-slate-300'}`}>
                            {hornLabels[hornType]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Cheek Details</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {MONSTER_OPTIONS.cheeks.map((cheekType) => {
                      const isSelected = monster.cheekType === cheekType;
                      return (
                        <button
                          key={cheekType}
                          type="button"
                          onClick={() => handleStudioUpdate('cheekType', cheekType)}
                          className={`flex flex-col items-center gap-2 p-3.5 rounded-2xl border transition text-center ${
                            isSelected
                              ? 'bg-indigo-950/60 border-indigo-400 ring-2 ring-indigo-400/30'
                              : 'bg-slate-900/60 border-slate-700/60 hover:bg-slate-800/60'
                          }`}
                        >
                          <MonsterAvatar config={{ ...monster, cheekType }} size={50} />
                          <span className={`text-xs font-bold ${isSelected ? 'text-indigo-300' : 'text-slate-300'}`}>
                            {cheekLabels[cheekType]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: PATTERNS */}
            {activeStudioTab === 'patterns' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Choose Body Pattern</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {MONSTER_OPTIONS.patterns.map((pattern) => {
                    const isSelected = monster.pattern === pattern;
                    return (
                      <button
                        key={pattern}
                        type="button"
                        onClick={() => handleStudioUpdate('pattern', pattern)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition text-center ${
                          isSelected
                            ? 'bg-indigo-950/60 border-indigo-400 ring-2 ring-indigo-400/30'
                            : 'bg-slate-900/60 border-slate-700/60 hover:bg-slate-800/60'
                        }`}
                      >
                        <MonsterAvatar config={{ ...monster, pattern }} size={56} />
                        <span className={`text-xs font-bold ${isSelected ? 'text-indigo-300' : 'text-slate-300'}`}>
                          {patternLabels[pattern]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* VIEW 3: WARDROBE SHOP & FITTING MIRROR (XP >= 750)                 */}
      {/* ================================================================= */}
      {currentView === 'shop' && (
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Shop Header Notice & Feedback */}
          {shopActionSuccess && (
            <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{shopActionSuccess}</span>
            </div>
          )}
          {shopActionError && (
            <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs text-center flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{shopActionError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Fitting Room Mirror */}
            <div className="lg:col-span-4 rounded-3xl bg-slate-800/70 border border-slate-700/80 p-6 flex flex-col items-center text-center shadow-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                🪞 Fitting Room Mirror
              </span>

              <div className="relative w-52 h-52 flex items-center justify-center my-2 rounded-2xl bg-gradient-to-b from-indigo-950/40 to-slate-900 border border-slate-700/50 p-2">
                <MonsterAvatar
                  config={monster}
                  size={170}
                  animate
                  equippedAccessories={previewAccessories}
                  stage={milestone.stage}
                  evolutionTier={milestone.evolutionTier}
                />
              </div>

              <h4 className="text-base font-bold text-white mt-3">{monster.name}</h4>
              <div className="text-[11px] text-amber-300 mt-1 space-y-0.5">
                <div>Hat: {previewAccessories.hat || 'None'}</div>
                <div>Glasses: {previewAccessories.glasses || 'None'}</div>
                <div>Clothing: {previewAccessories.clothing || 'None'}</div>
                <div>Wings: {previewAccessories.wings || 'None'}</div>
              </div>

              <p className="mt-4 text-[11px] text-slate-400 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                Click any accessory on the right to try it on in the mirror or equip it!
              </p>
            </div>

            {/* Right: Accessory Catalog */}
            <div className="lg:col-span-8 rounded-3xl bg-slate-800/70 border border-slate-700/80 p-6 shadow-xl space-y-4">
              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800">
                <button
                  onClick={() => setShopCategory('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition ${
                    shopCategory === 'all'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  All Items
                </button>
                <button
                  onClick={() => setShopCategory('hat')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                    shopCategory === 'hat'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  👑 Hats
                </button>
                <button
                  onClick={() => setShopCategory('glasses')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                    shopCategory === 'glasses'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  👓 Glasses
                </button>
                <button
                  onClick={() => setShopCategory('clothing')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                    shopCategory === 'clothing'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  👔 Outfits
                </button>
                <button
                  onClick={() => setShopCategory('wings')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                    shopCategory === 'wings'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  🪽 Wings
                </button>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredShopItems.map((item) => {
                  const isOwned = ownedAccessories.includes(item.id);
                  const isEquipped = (monster.accessories?.[item.category as keyof MonsterAccessories] as string | undefined) === item.id;
                  const canAfford = coinBalance >= item.price;

                  const rarityBadge = {
                    common: 'bg-slate-700 text-slate-300',
                    rare: 'bg-sky-500/20 text-sky-300 border border-sky-500/30',
                    epic: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
                    legendary: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
                  }[item.rarity];

                  return (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <span
                            className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${rarityBadge}`}
                          >
                            {item.rarity}
                          </span>
                          <span className="text-[10px] text-slate-400 capitalize">{item.category}</span>
                        </div>
                        <h5 className="text-xs font-bold text-white mt-1">{item.name}</h5>
                        <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">{item.description}</p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-800/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-amber-300 flex items-center gap-1">
                            🪙 {item.price}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleTryOnAccessory(item)}
                            className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 underline"
                          >
                            Try On
                          </button>
                        </div>

                        {/* Action: Buy or Equip */}
                        {isOwned ? (
                          <button
                            type="button"
                            onClick={() => handleEquipToggle(item)}
                            className={`w-full py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                              isEquipped
                                ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                                : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                            }`}
                          >
                            {isEquipped ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Equipped</span>
                              </>
                            ) : (
                              <span>Equip</span>
                            )}
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={!canAfford}
                            onClick={() => handleBuyAccessory(item)}
                            className="w-full py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 transition flex items-center justify-center gap-1"
                          >
                            <span>Buy for {item.price} Coins</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* VIEW 4: EVOLUTION CHAMBER & ROADMAP                               */}
      {/* ================================================================= */}
      {currentView === 'evolution' && (
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1 mb-4">
            <h2 className="text-2xl font-black text-white">Evolution Roadmap</h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Your monster grows alongside your English skills! Reach cumulative XP milestones to unlock each form.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* TIER 1: Hatchling Pal (500 XP) */}
            <div
              className={`rounded-3xl bg-slate-900/80 border-2 p-5 flex flex-col justify-between shadow-xl relative overflow-hidden ${
                milestone.evolutionTier === 1
                  ? 'border-indigo-400 ring-2 ring-indigo-400/30'
                  : 'border-slate-800'
              }`}
            >
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                  500–1,499 XP
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">Hatchling Pal</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Cute, compact, curious, and eager to learn English vocabulary.
                </p>

                <div className="my-5 flex items-center justify-center h-40">
                  <MonsterAvatar config={monster} size={135} evolutionTier={1} animate />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Body Form:</span>
                  <span className="text-slate-200 font-bold">Small (Starter)</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={studentXp >= 500 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                    {studentXp >= 500 ? 'Unlocked ✓' : 'Locked (500 XP)'}
                  </span>
                </div>
              </div>
            </div>

            {/* TIER 2: Adventurer Form (1,500 XP) */}
            <div
              className={`rounded-3xl bg-slate-900/80 border-2 p-5 flex flex-col justify-between shadow-xl relative overflow-hidden ${
                milestone.evolutionTier === 2
                  ? 'border-purple-400 ring-2 ring-purple-400/30'
                  : 'border-slate-800'
              }`}
            >
              <div>
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
                  1,500 XP Milestone
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">Adventurer Form</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Athletic runner stance, longer horns, and energized speed flank markings.
                </p>

                <div className="my-5 flex items-center justify-center h-40">
                  <MonsterAvatar config={monster} size={145} evolutionTier={2} animate />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Bonus:</span>
                  <span className="text-amber-300 font-bold">+10% Coin Bonus</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={studentXp >= 1500 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                    {studentXp >= 1500 ? 'Unlocked ✓' : 'Locked (1,500 XP)'}
                  </span>
                </div>
              </div>
            </div>

            {/* TIER 3: Champion Titan (3,000 XP) */}
            <div
              className={`rounded-3xl bg-slate-900/80 border-2 p-5 flex flex-col justify-between shadow-xl relative overflow-hidden ${
                milestone.evolutionTier === 3
                  ? 'border-pink-400 ring-2 ring-pink-400/30'
                  : 'border-slate-800'
              }`}
            >
              <div>
                <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wider block">
                  3,000 XP Milestone
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">Champion Titan</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Majestic dragon wings, armored shoulder guards, and radiant confidence.
                </p>

                <div className="my-5 flex items-center justify-center h-40">
                  <MonsterAvatar config={monster} size={155} evolutionTier={3} animate />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Trait:</span>
                  <span className="text-pink-300 font-bold">Titan Wings</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={studentXp >= 3000 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                    {studentXp >= 3000 ? 'Unlocked ✓' : 'Locked (3,000 XP)'}
                  </span>
                </div>
              </div>
            </div>

            {/* TIER 4: Cosmic Apex Legend (6,000 XP) */}
            <div
              className={`rounded-3xl bg-slate-900/80 border-2 p-5 flex flex-col justify-between shadow-xl relative overflow-hidden bg-gradient-to-b from-slate-900 via-amber-950/20 to-slate-900 ${
                milestone.evolutionTier === 4
                  ? 'border-amber-400 ring-2 ring-amber-400/30'
                  : 'border-slate-800'
              }`}
            >
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                  6,000 XP Milestone
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">Cosmic Apex Legend</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Orbiting star rings, crystalline halo, cosmic star core chest, and mythic majesty.
                </p>

                <div className="my-5 flex items-center justify-center h-40">
                  <MonsterAvatar config={monster} size={165} evolutionTier={4} animate />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Aura:</span>
                  <span className="text-cyan-300 font-bold">Stardust Orbit</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={studentXp >= 6000 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                    {studentXp >= 6000 ? 'Unlocked ✓' : 'Locked (6,000 XP)'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* CELEBRATION MODAL 1: EGG HATCHING DAY (500 XP)                    */}
      {/* ================================================================= */}
      {showHatchingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border-2 border-amber-500/50 p-6 text-center shadow-2xl space-y-4">
            <span className="text-3xl animate-bounce block">🎉</span>
            <span className="text-xs font-mono font-bold uppercase px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
              500 XP Milestone Achieved!
            </span>
            <h3 className="text-2xl font-black text-white">It's Hatching Day!</h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Your mysterious egg has cracked completely open! Say hello to your brand new English companion.
            </p>

            <div className="w-44 h-44 mx-auto flex items-center justify-center my-3 rounded-2xl bg-gradient-to-b from-indigo-950/60 to-slate-900 border border-indigo-500/30 p-2">
              <MonsterAvatar config={monster} size={160} animate evolutionTier={1} />
            </div>

            <button
              type="button"
              onClick={handleConfirmHatching}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-purple-500 to-cyan-400 hover:opacity-95 text-slate-950 font-black text-sm shadow-lg transition active:scale-95"
            >
              🎨 Customize & Name My Monster!
            </button>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* CELEBRATION MODAL 2: EVOLUTION UNLOCKED                           */}
      {/* ================================================================= */}
      {showEvolutionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border-2 border-purple-500/50 p-6 text-center shadow-2xl space-y-4">
            <span className="text-3xl animate-pulse block">🌟</span>
            <span className="text-xs font-mono font-bold uppercase px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
              New Evolution Unlocked!
            </span>
            <h3 className="text-2xl font-black text-white">{milestone.stageName}</h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Your monster has evolved to a new form! Keep completing unit reviews to discover even more power.
            </p>

            <div className="w-44 h-44 mx-auto flex items-center justify-center my-3 rounded-2xl bg-gradient-to-b from-purple-950/60 to-slate-900 border border-purple-500/30 p-2">
              <MonsterAvatar
                config={monster}
                size={160}
                animate
                stage={milestone.stage}
                evolutionTier={milestone.evolutionTier}
              />
            </div>

            <button
              type="button"
              onClick={handleConfirmEvolution}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-95 text-white font-black text-sm shadow-lg transition active:scale-95"
            >
              Awesome!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
