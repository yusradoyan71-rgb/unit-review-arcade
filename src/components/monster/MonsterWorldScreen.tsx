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
      setShopActionError(result.error || 'Equip failed.');
      setTimeout(() => setShopActionError(null), 4000);
    }
  };

  // Celebration confirm handlers
  const handleConfirmHatching = () => {
    sounds.playTap();
    if (studentNumber) {
      MonsterService.markHatchingSeen(studentNumber);
    }
    setShowHatchingModal(false);
    setCurrentView('studio');
  };

  const handleConfirmEvolution = () => {
    sounds.playTap();
    if (studentNumber) {
      MonsterService.markEvolutionSeen(studentNumber, milestone.evolutionTier);
    }
    setShowEvolutionModal(false);
  };

  // Accessory Owned Check
  const isAccessoryOwned = (itemId: string) => {
    return (monster.accessories?.owned || []).includes(itemId);
  };

  // Accessory Equipped Check
  const isAccessoryEquipped = (item: ShopAccessoryItem) => {
    return monster.accessories?.[item.category as keyof MonsterAccessories] === item.id;
  };

  // Filter Catalog
  const filteredShopItems = FUTURE_SHOP_CATALOG.filter((item) => {
    if (shopCategory === 'all') return true;
    return item.category === shopCategory;
  });

  // Label dictionaries for Studio
  const colorLabels: Record<MonsterBodyColor, string> = {
    cyan: 'Sky Cyan',
    purple: 'Mystic Purple',
    pink: 'Bubblegum Pink',
    lime: 'Lime Sprout',
    orange: 'Sunset Orange',
    amber: 'Amber Gold',
    emerald: 'Mint Emerald',
    indigo: 'Deep Indigo',
  };

  const shapeLabels: Record<MonsterBodyShape, string> = {
    blob: 'Happy Blob',
    fuzzy: 'Fuzzy Pal',
    sprout: 'Tall Sprout',
    slime: 'Bouncy Slime',
    chubby: 'Gentle Chubby',
    star: 'Starlight Star',
  };

  const eyeLabels: Record<MonsterEyeType, string> = {
    anime: 'Anime Sparkle',
    cyclops: 'Cosmic Cyclops',
    sleepy: 'Relaxed Peepers',
    wink: 'Playful Wink',
    three_eyes: 'Triple Alien',
    googly: 'Googly Fun',
  };

  const mouthLabels: Record<MonsterMouthType, string> = {
    smile: 'Warm Smile',
    fang_grin: 'Cute Fangs',
    laughing: 'Joyful Laugh',
    goofy_teeth: 'Buck Teeth',
    cat_mouth: 'Cat Mouth',
    whistle: 'Sweet Whistle',
  };

  const hornLabels: Record<MonsterHornType, string> = {
    none: 'Smooth Head',
    single_horn: 'Unicorn Horn',
    twin_horns: 'Twin Horns',
    antennae: 'Bouncy Antennae',
    leaves: 'Sprout Leaves',
    cat_ears: 'Cat Ears',
  };

  const cheekLabels: Record<MonsterCheekType, string> = {
    none: 'Clear Cheeks',
    blush_dots: 'Rosy Blush',
    freckles: 'Cute Freckles',
    spiral: 'Spiral Swirls',
    stars: 'Star Freckles',
  };

  const patternLabels: Record<MonsterPattern, string> = {
    none: 'Solid Body',
    belly_patch: 'Pastel Belly',
    spots: 'Confetti Spots',
    stripes: 'Tiger Stripes',
    heart: 'Heart Patch',
  };

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] py-6 px-4 md:px-8 max-w-7xl mx-auto w-full flex flex-col space-y-6 selection:bg-cyan-500 selection:text-white">
      
      {/* Background Decor: Floating Clouds */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 right-14 opacity-70 anim-cloud">
          <svg width="220" height="110" viewBox="0 0 220 110" fill="#ffffff">
            <path d="M 30 75 A 30 30 0 0 1 85 60 A 45 45 0 0 1 160 55 A 30 30 0 0 1 200 75 A 20 20 0 0 1 180 100 L 45 100 A 20 20 0 0 1 30 75 Z" filter="drop-shadow(0 10px 20px rgba(14,165,233,0.08))" />
          </svg>
        </div>
        <div className="absolute top-48 left-10 opacity-60 anim-cloud" style={{ animationDelay: '4.5s' }}>
          <svg width="170" height="85" viewBox="0 0 170 85" fill="#ffffff">
            <path d="M 22 60 A 24 24 0 0 1 65 50 A 35 35 0 0 1 125 45 A 24 24 0 0 1 158 60 A 16 16 0 0 1 142 80 L 32 80 A 16 16 0 0 1 22 60 Z" filter="drop-shadow(0 8px 16px rgba(14,165,233,0.06))" />
          </svg>
        </div>
      </div>

      {/* ================================================================= */}
      {/* TOP HEADER & BAR                                                  */}
      {/* ================================================================= */}
      <div className="card-island p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4 relative z-10 bg-white">
        
        {/* Left: Back & Mode Indicator */}
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
            className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 hover:text-slate-900 transition-all flex items-center gap-1.5 shadow-sm font-bold text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{currentView === 'hub' ? 'Back to Island Home' : 'Back to Sanctuary'}</span>
          </button>

          {currentView !== 'hub' && (
            <span className="text-xs uppercase font-mono font-black px-3 py-1.5 rounded-xl bg-purple-100 text-purple-800 border border-purple-300 shadow-sm">
              {currentView === 'studio' && '🎨 Monster Studio'}
              {currentView === 'shop' && '🛍️ Monster Wardrobe'}
              {currentView === 'evolution' && '🌟 Evolution Chamber'}
            </span>
          )}
        </div>

        {/* Right: Coins Balance Pill */}
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 shadow-sm">
          <Coins className="w-5 h-5 text-amber-500 animate-pulse" />
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase font-black tracking-wider text-amber-800">Monster Coins</span>
            <span className="text-lg font-black font-mono leading-none">{coinBalance}</span>
          </div>
        </div>

      </div>

      {/* ================================================================= */}
      {/* VIEW 1: HUB OVERVIEW                                              */}
      {/* ================================================================= */}
      {currentView === 'hub' && (
        <div className="space-y-6 relative z-10">
          
          {/* STAGE A: EGG & CRACKING EGG STAGES (0 - 499 XP) */}
          {milestone.isEgg ? (
            <div className="card-island p-8 sm:p-12 flex flex-col items-center text-center bg-white border-2 border-purple-200 shadow-xl relative overflow-hidden">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100 border border-purple-300 text-purple-800 text-xs font-black mb-4">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>
                  {milestone.stage === 'egg' ? 'Stage 1: Incubating Mystery Egg' : 'Stage 2: Magical Fissures Forming!'}
                </span>
              </div>

              {/* Egg Avatar with tap wiggle on sunny grassy pedestal */}
              <div
                onClick={handleEggTap}
                className={`w-64 h-64 rounded-full bg-gradient-to-tr from-emerald-100 via-sky-100 to-amber-100 border-4 border-white shadow-inner flex items-center justify-center my-4 cursor-pointer select-none transition-transform duration-300 ${
                  eggWiggle ? 'scale-110 rotate-3' : 'hover:scale-105'
                }`}
                title="Tap to check on your growing companion!"
              >
                <MonsterAvatar config={monster} size={220} stage={milestone.stage} animate />
              </div>

              <span className="text-xs text-purple-700 font-black mb-6 anim-pulse">
                👆 Tap your egg to send encouragement!
              </span>

              {/* Status Message Box */}
              <div className="w-full max-w-xl bg-amber-50/90 border-2 border-amber-200 rounded-3xl p-5 mb-6 text-center">
                <h3 className="text-lg font-black font-display text-amber-950 mb-1">
                  {milestone.stage === 'egg'
                    ? 'Your monster companion is growing inside!'
                    : 'Something is moving! Cracks are spreading!'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 font-medium">
                  {milestone.stage === 'egg'
                    ? 'Complete English activities and unit reviews to keep your egg warm and help it hatch.'
                    : `Only ${Math.max(0, MONSTER_MILESTONES.HATCHING_XP - studentXp)} XP needed until your unique companion breaks free!`}
                </p>
              </div>

              {/* Incubation Progress Bar */}
              <div className="w-full max-w-xl mb-6">
                <div className="flex justify-between items-center text-xs font-black text-slate-800 mb-1.5">
                  <span>Hatching Progress</span>
                  <span className="text-purple-700 font-mono">
                    {studentXp} / {MONSTER_MILESTONES.HATCHING_XP} XP ({milestone.progressPercent}%)
                  </span>
                </div>
                <div className="h-4 w-full rounded-full bg-slate-100 border-2 border-slate-200 overflow-hidden p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 via-pink-400 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${milestone.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Feature Locks Notice */}
              <div className="w-full max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 flex items-center gap-3">
                  <Lock className="w-5 h-5 text-slate-400 shrink-0" />
                  <div className="text-xs">
                    <strong className="block text-slate-900 font-black">Monster Studio</strong>
                    <span className="text-slate-500">Unlocks at 500 XP on Hatching Day!</span>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 flex items-center gap-3">
                  <Lock className="w-5 h-5 text-slate-400 shrink-0" />
                  <div className="text-xs">
                    <strong className="block text-slate-900 font-black">Monster Wardrobe</strong>
                    <span className="text-slate-500">Boutique shop unlocks at 750 XP!</span>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* STAGE B: HATCHED MONSTER HOME (500+ XP) */
            <div className="space-y-6">
              
              {/* Monster Hero Showcase */}
              <div className="card-island p-6 sm:p-8 bg-white border-2 border-purple-200 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                  
                  {/* Companion Grassy Mound */}
                  <div className="w-48 h-48 rounded-3xl bg-gradient-to-tr from-emerald-100 to-sky-100 border-2 border-emerald-200 flex items-center justify-center p-3 shrink-0 shadow-inner">
                    <MonsterAvatar
                      config={monster}
                      size={170}
                      animate
                      stage={milestone.stage}
                      evolutionTier={milestone.evolutionTier}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 border border-purple-300 text-purple-800 text-xs font-black">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{milestone.stageName}</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900">{monster.name}</h2>
                    <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md">
                      Your loyal learning companion. Practice daily to level up your monster and discover rare evolutions!
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                      <span className="px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 font-mono font-bold">
                        Total XP: <strong className="text-sky-700">{studentXp}</strong>
                      </span>
                      <span className="px-3 py-1 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 font-black flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5 text-amber-500" />
                        <span>{coinBalance} Coins</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Evolution Milestone Progress */}
                {milestone.nextMilestoneXp && (
                  <div className="w-full md:w-64 bg-purple-50/80 border-2 border-purple-200 rounded-3xl p-4 text-left space-y-2">
                    <div className="flex justify-between items-center text-xs font-black text-purple-950">
                      <span>Next Evolution</span>
                      <span className="text-purple-700 font-mono">{milestone.progressPercent}%</span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-purple-200/60 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                        style={{ width: `${milestone.progressPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-500">
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
                  className="card-island p-6 bg-white border-2 border-sky-300 hover:border-sky-500 cursor-pointer flex flex-col justify-between shadow-md group transition-all"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
                      🎨
                    </div>
                    <h3 className="text-lg font-black font-display text-slate-900 group-hover:text-sky-700">
                      Monster Studio
                    </h3>
                    <p className="text-xs text-slate-600 font-medium mt-1">
                      Customize body shape, colors, eyes, smiles, horns, and companion name.
                    </p>
                  </div>
                  <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-black text-sky-700">
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
                    className="card-island p-6 bg-white border-2 border-amber-300 hover:border-amber-500 cursor-pointer flex flex-col justify-between shadow-md group transition-all"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
                        🛍️
                      </div>
                      <h3 className="text-lg font-black font-display text-slate-900 group-hover:text-amber-700">
                        Monster Wardrobe
                      </h3>
                      <p className="text-xs text-slate-600 font-medium mt-1">
                        Dress up in crowns, glasses, scarves, capes, and wings using Monster Coins.
                      </p>
                    </div>
                    <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-black text-amber-700">
                      <span>Enter Wardrobe</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                    </div>
                  </div>
                ) : (
                  <div className="card-island p-6 bg-slate-50 border-2 border-slate-200 flex flex-col justify-between opacity-80">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-slate-200 text-slate-500 flex items-center justify-center text-2xl mb-4">
                        🔒
                      </div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-black font-display text-slate-700">Monster Wardrobe</h3>
                        <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-600">
                          Locked
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        Unlocks at <strong className="text-amber-700">750 XP</strong>. Earn{' '}
                        {Math.max(0, MONSTER_MILESTONES.SHOP_UNLOCK_XP - studentXp)} more XP to start shopping!
                      </p>
                    </div>
                    <div className="mt-6 pt-3 border-t border-slate-200 text-xs font-bold text-slate-400">
                      Practice curriculum quests to unlock
                    </div>
                  </div>
                )}

                {/* 3. Evolution Chamber Portal */}
                <div
                  onClick={() => {
                    sounds.playNavigate();
                    setCurrentView('evolution');
                  }}
                  className="card-island p-6 bg-white border-2 border-purple-300 hover:border-purple-500 cursor-pointer flex flex-col justify-between shadow-md group transition-all"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
                      🌟
                    </div>
                    <h3 className="text-lg font-black font-display text-slate-900 group-hover:text-purple-700">
                      Evolution Chamber
                    </h3>
                    <p className="text-xs text-slate-600 font-medium mt-1">
                      Preview all 4 evolutionary forms and unlock powerful companion traits.
                    </p>
                  </div>
                  <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-black text-purple-700">
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
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
          
          {/* Left Column: Live Monster Preview & Actions */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="card-island p-6 bg-white border-2 border-purple-200 shadow-xl flex flex-col items-center text-center">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 border border-purple-300 text-purple-800 text-xs font-black mb-4">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Customization Stage</span>
              </div>

              {/* Live Stage */}
              <div className="relative w-64 h-64 flex items-center justify-center my-2 rounded-3xl bg-gradient-to-tr from-purple-50 via-sky-50 to-emerald-50 border-2 border-purple-200 shadow-inner p-4">
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
                  className="block text-xs uppercase tracking-wider font-black text-slate-700 mb-1"
                >
                  Monster Companion Name
                </label>
                <input
                  id="monster-name-input"
                  type="text"
                  value={monster.name}
                  maxLength={20}
                  onChange={(e) => handleStudioUpdate('name', e.target.value)}
                  placeholder="Name your monster..."
                  className="w-full text-center text-xl font-black px-4 py-2 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-purple-500 focus:outline-none text-slate-900 shadow-sm"
                />
              </div>

              {/* Quick Actions */}
              <div className="w-full grid grid-cols-2 gap-3 mt-5">
                <button
                  onClick={handleSurpriseMe}
                  type="button"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-300 transition active:scale-95 text-xs shadow-sm"
                >
                  <Shuffle className="w-4 h-4 text-purple-600" />
                  <span>Surprise Me!</span>
                </button>

                <button
                  onClick={handleSaveMonster}
                  disabled={isSaving}
                  type="button"
                  className="btn-game-primary flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-black text-xs transition active:scale-95 disabled:opacity-50"
                >
                  {savedNotice ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-200" />
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
                <div className="w-full mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center flex items-center justify-center gap-2 font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{saveError}</span>
                </div>
              )}

            </div>
          </div>

          {/* Right Column: Customization Tabs */}
          <div className="lg:col-span-7 card-island p-6 bg-white border-2 border-slate-200 shadow-xl flex flex-col">
            
            {/* Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 overflow-x-auto mb-6">
              <button
                onClick={() => setActiveStudioTab('color')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition whitespace-nowrap ${
                  activeStudioTab === 'color'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Color</span>
              </button>

              <button
                onClick={() => setActiveStudioTab('shape')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition whitespace-nowrap ${
                  activeStudioTab === 'shape'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Shape</span>
              </button>

              <button
                onClick={() => setActiveStudioTab('eyes')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition whitespace-nowrap ${
                  activeStudioTab === 'eyes'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Eyes</span>
              </button>

              <button
                onClick={() => setActiveStudioTab('mouth')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition whitespace-nowrap ${
                  activeStudioTab === 'mouth'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smile className="w-3.5 h-3.5" />
                <span>Mouth</span>
              </button>

              <button
                onClick={() => setActiveStudioTab('features')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition whitespace-nowrap ${
                  activeStudioTab === 'features'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Features</span>
              </button>

              <button
                onClick={() => setActiveStudioTab('patterns')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition whitespace-nowrap ${
                  activeStudioTab === 'patterns'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Shirt className="w-3.5 h-3.5" />
                <span>Patterns</span>
              </button>
            </div>

            {/* TAB: COLORS */}
            {activeStudioTab === 'color' && (
              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider">Choose Body Color</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {MONSTER_OPTIONS.colors.map((color) => {
                    const isSelected = monster.bodyColor === color;
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleStudioUpdate('bodyColor', color)}
                        className={`flex flex-col items-center gap-2 p-3.5 rounded-2xl border-2 transition text-center ${
                          isSelected
                            ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-200 shadow-sm'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                          <MonsterAvatar config={{ ...monster, bodyColor: color }} size={38} />
                        </div>
                        <span className={`text-xs font-bold ${isSelected ? 'text-purple-900' : 'text-slate-700'}`}>
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
                <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider">Choose Body Shape</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {MONSTER_OPTIONS.shapes.map((shape) => {
                    const isSelected = monster.bodyShape === shape;
                    return (
                      <button
                        key={shape}
                        type="button"
                        onClick={() => handleStudioUpdate('bodyShape', shape)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition text-center ${
                          isSelected
                            ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-200 shadow-sm'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <MonsterAvatar config={{ ...monster, bodyShape: shape }} size={56} />
                        <span className={`text-xs font-bold ${isSelected ? 'text-purple-900' : 'text-slate-700'}`}>
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
                <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider">Choose Eye Style</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {MONSTER_OPTIONS.eyes.map((eyeType) => {
                    const isSelected = monster.eyeType === eyeType;
                    return (
                      <button
                        key={eyeType}
                        type="button"
                        onClick={() => handleStudioUpdate('eyeType', eyeType)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition text-center ${
                          isSelected
                            ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-200 shadow-sm'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <MonsterAvatar config={{ ...monster, eyeType }} size={56} />
                        <span className={`text-xs font-bold ${isSelected ? 'text-purple-900' : 'text-slate-700'}`}>
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
                <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider">Choose Mouth Style</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {MONSTER_OPTIONS.mouths.map((mouthType) => {
                    const isSelected = monster.mouthType === mouthType;
                    return (
                      <button
                        key={mouthType}
                        type="button"
                        onClick={() => handleStudioUpdate('mouthType', mouthType)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition text-center ${
                          isSelected
                            ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-200 shadow-sm'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <MonsterAvatar config={{ ...monster, mouthType }} size={56} />
                        <span className={`text-xs font-bold ${isSelected ? 'text-purple-900' : 'text-slate-700'}`}>
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
                  <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-3">Head Features</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {MONSTER_OPTIONS.horns.map((hornType) => {
                      const isSelected = monster.hornType === hornType;
                      return (
                        <button
                          key={hornType}
                          type="button"
                          onClick={() => handleStudioUpdate('hornType', hornType)}
                          className={`flex flex-col items-center gap-2 p-3.5 rounded-2xl border-2 transition text-center ${
                            isSelected
                              ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-200 shadow-sm'
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <MonsterAvatar config={{ ...monster, hornType }} size={50} />
                          <span className={`text-xs font-bold ${isSelected ? 'text-purple-900' : 'text-slate-700'}`}>
                            {hornLabels[hornType]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-3">Cheek Details</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {MONSTER_OPTIONS.cheeks.map((cheekType) => {
                      const isSelected = monster.cheekType === cheekType;
                      return (
                        <button
                          key={cheekType}
                          type="button"
                          onClick={() => handleStudioUpdate('cheekType', cheekType)}
                          className={`flex flex-col items-center gap-2 p-3.5 rounded-2xl border-2 transition text-center ${
                            isSelected
                              ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-200 shadow-sm'
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <MonsterAvatar config={{ ...monster, cheekType }} size={50} />
                          <span className={`text-xs font-bold ${isSelected ? 'text-purple-900' : 'text-slate-700'}`}>
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
                <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider">Choose Body Pattern</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {MONSTER_OPTIONS.patterns.map((pattern) => {
                    const isSelected = monster.pattern === pattern;
                    return (
                      <button
                        key={pattern}
                        type="button"
                        onClick={() => handleStudioUpdate('pattern', pattern)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition text-center ${
                          isSelected
                            ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-200 shadow-sm'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <MonsterAvatar config={{ ...monster, pattern }} size={56} />
                        <span className={`text-xs font-bold ${isSelected ? 'text-purple-900' : 'text-slate-700'}`}>
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
        <div className="space-y-6 relative z-10">
          
          {/* Shop Header Notice & Feedback */}
          {shopActionSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 text-xs text-center flex items-center justify-center gap-2 font-bold shadow-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{shopActionSuccess}</span>
            </div>
          )}
          {shopActionError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-900 text-xs text-center flex items-center justify-center gap-2 font-bold shadow-sm">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{shopActionError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Fitting Room Mirror */}
            <div className="lg:col-span-4 card-island p-6 bg-white border-2 border-amber-300 shadow-xl flex flex-col items-center text-center">
              <span className="text-xs font-black uppercase tracking-wider text-amber-900 mb-3">
                🪞 Fitting Room Mirror
              </span>

              <div className="relative w-52 h-52 flex items-center justify-center my-2 rounded-3xl bg-gradient-to-tr from-amber-50 via-rose-50 to-sky-50 border-2 border-amber-200 p-2 shadow-inner">
                <MonsterAvatar
                  config={monster}
                  size={170}
                  animate
                  equippedAccessories={previewAccessories}
                  stage={milestone.stage}
                  evolutionTier={milestone.evolutionTier}
                />
              </div>

              <h4 className="text-base font-black font-display text-slate-900 mt-3">{monster.name}</h4>
              <div className="text-[11px] text-amber-800 font-bold mt-1 space-y-0.5">
                <div>Hat: {previewAccessories.hat || 'None'}</div>
                <div>Glasses: {previewAccessories.glasses || 'None'}</div>
                <div>Clothing: {previewAccessories.clothing || 'None'}</div>
                <div>Wings: {previewAccessories.wings || 'None'}</div>
              </div>

              <p className="mt-4 text-[11px] text-slate-600 font-medium p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                Click any accessory on the right to try it on in the mirror or equip it!
              </p>
            </div>

            {/* Right: Accessory Catalog */}
            <div className="lg:col-span-8 card-island p-6 bg-white border-2 border-slate-200 shadow-xl space-y-4">
              
              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
                <button
                  onClick={() => setShopCategory('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition ${
                    shopCategory === 'all'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  All Items
                </button>
                <button
                  onClick={() => setShopCategory('hat')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition ${
                    shopCategory === 'hat'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  👑 Hats
                </button>
                <button
                  onClick={() => setShopCategory('glasses')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition ${
                    shopCategory === 'glasses'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  👓 Glasses
                </button>
                <button
                  onClick={() => setShopCategory('clothing')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition ${
                    shopCategory === 'clothing'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  👔 Outfits
                </button>
                <button
                  onClick={() => setShopCategory('wings')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition ${
                    shopCategory === 'wings'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  🪽 Wings
                </button>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredShopItems.map((item) => {
                  const owned = isAccessoryOwned(item.id);
                  const equipped = isAccessoryEquipped(item);
                  const canAfford = coinBalance >= item.price;

                  // Rarity styling
                  const rarityBadge =
                    item.rarity === 'legendary'
                      ? 'bg-rose-100 text-rose-800 border-rose-300'
                      : item.rarity === 'epic'
                      ? 'bg-purple-100 text-purple-800 border-purple-300'
                      : item.rarity === 'rare'
                      ? 'bg-sky-100 text-sky-800 border-sky-300'
                      : 'bg-slate-100 text-slate-700 border-slate-300';

                  return (
                    <div
                      key={item.id}
                      className="card-island p-4 bg-white border-2 border-slate-200 hover:border-amber-300 flex flex-col justify-between shadow-sm transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase border ${rarityBadge}`}>
                            {item.rarity}
                          </span>
                          <span className="text-xs font-mono font-black text-amber-900 flex items-center gap-1">
                            <Coins className="w-3.5 h-3.5 text-amber-500" />
                            {item.price}
                          </span>
                        </div>

                        {/* Item Icon Placeholder Graphic */}
                        <div className="w-full h-24 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-center justify-center text-4xl mb-2.5">
                          {item.category === 'hat' && '🎩'}
                          {item.category === 'glasses' && '👓'}
                          {item.category === 'clothing' && '🧣'}
                          {item.category === 'wings' && '🪽'}
                        </div>

                        <h4 className="font-black text-sm text-slate-900">{item.name}</h4>
                        <p className="text-[11px] text-slate-500 font-medium line-clamp-2 mt-0.5 mb-3">
                          {item.description}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => handleTryOnAccessory(item)}
                          className="w-full py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                        >
                          Try On 🪞
                        </button>

                        {owned ? (
                          <button
                            type="button"
                            onClick={() => handleEquipToggle(item)}
                            className={`w-full py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
                              equipped
                                ? 'btn-game-emerald'
                                : 'btn-game-primary'
                            }`}
                          >
                            {equipped ? (
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
                            onClick={() => handleBuyAccessory(item)}
                            disabled={!canAfford}
                            className={`w-full py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1 ${
                              canAfford
                                ? 'btn-game-amber'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                          >
                            <Coins className="w-3.5 h-3.5" />
                            <span>Buy for {item.price}</span>
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
      {/* VIEW 4: EVOLUTION CHAMBER (ALL TIERS ROADMAP)                      */}
      {/* ================================================================= */}
      {currentView === 'evolution' && (
        <div className="space-y-6 relative z-10">
          
          <div className="card-island p-6 bg-white border-2 border-purple-200 shadow-xl text-center max-w-xl mx-auto space-y-1">
            <h2 className="text-2xl font-black font-display text-slate-900">Evolution Roadmap</h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Your monster grows alongside your English skills! Reach cumulative XP milestones to unlock each form.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* TIER 1: Hatchling Pal (500 XP) */}
            <div
              className={`card-island p-5 bg-white flex flex-col justify-between shadow-xl relative overflow-hidden ${
                milestone.evolutionTier === 1
                  ? 'border-2 border-sky-400 ring-4 ring-sky-100'
                  : 'border-2 border-slate-200'
              }`}
            >
              <div>
                <span className="text-[10px] font-black text-sky-700 uppercase tracking-wider block">
                  500–1,499 XP
                </span>
                <h3 className="text-lg font-black font-display text-slate-900 mt-0.5">Hatchling Pal</h3>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Cute, compact, curious, and eager to learn English vocabulary.
                </p>

                <div className="my-5 flex items-center justify-center h-40 rounded-2xl bg-sky-50/60 border border-sky-200">
                  <MonsterAvatar config={monster} size={135} evolutionTier={1} animate />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 text-[11px] font-medium text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span>Body Form:</span>
                  <span className="text-slate-900 font-bold">Small (Starter)</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={studentXp >= 500 ? 'text-emerald-600 font-black' : 'text-slate-400'}>
                    {studentXp >= 500 ? 'Unlocked ✓' : 'Locked (500 XP)'}
                  </span>
                </div>
              </div>
            </div>

            {/* TIER 2: Adventurer Form (1,500 XP) */}
            <div
              className={`card-island p-5 bg-white flex flex-col justify-between shadow-xl relative overflow-hidden ${
                milestone.evolutionTier === 2
                  ? 'border-2 border-purple-400 ring-4 ring-purple-100'
                  : 'border-2 border-slate-200'
              }`}
            >
              <div>
                <span className="text-[10px] font-black text-purple-700 uppercase tracking-wider block">
                  1,500 XP Milestone
                </span>
                <h3 className="text-lg font-black font-display text-slate-900 mt-0.5">Adventurer Form</h3>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Athletic runner stance, longer horns, and energized speed flank markings.
                </p>

                <div className="my-5 flex items-center justify-center h-40 rounded-2xl bg-purple-50/60 border border-purple-200">
                  <MonsterAvatar config={monster} size={145} evolutionTier={2} animate />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 text-[11px] font-medium text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span>Bonus:</span>
                  <span className="text-amber-700 font-black">+10% Coin Bonus</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={studentXp >= 1500 ? 'text-emerald-600 font-black' : 'text-slate-400'}>
                    {studentXp >= 1500 ? 'Unlocked ✓' : 'Locked (1,500 XP)'}
                  </span>
                </div>
              </div>
            </div>

            {/* TIER 3: Champion Titan (3,000 XP) */}
            <div
              className={`card-island p-5 bg-white flex flex-col justify-between shadow-xl relative overflow-hidden ${
                milestone.evolutionTier === 3
                  ? 'border-2 border-pink-400 ring-4 ring-pink-100'
                  : 'border-2 border-slate-200'
              }`}
            >
              <div>
                <span className="text-[10px] font-black text-pink-700 uppercase tracking-wider block">
                  3,000 XP Milestone
                </span>
                <h3 className="text-lg font-black font-display text-slate-900 mt-0.5">Champion Titan</h3>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Broad armored shoulder crests, majestic crown horns, and victory sash.
                </p>

                <div className="my-5 flex items-center justify-center h-40 rounded-2xl bg-pink-50/60 border border-pink-200">
                  <MonsterAvatar config={monster} size={155} evolutionTier={3} animate />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 text-[11px] font-medium text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span>Perk:</span>
                  <span className="text-pink-700 font-black">Titan Crest</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={studentXp >= 3000 ? 'text-emerald-600 font-black' : 'text-slate-400'}>
                    {studentXp >= 3000 ? 'Unlocked ✓' : 'Locked (3,000 XP)'}
                  </span>
                </div>
              </div>
            </div>

            {/* TIER 4: Cosmic Apex Legend (6,000 XP) */}
            <div
              className={`card-island p-5 bg-white flex flex-col justify-between shadow-xl relative overflow-hidden ${
                milestone.evolutionTier === 4
                  ? 'border-2 border-amber-400 ring-4 ring-amber-100'
                  : 'border-2 border-slate-200'
              }`}
            >
              <div>
                <span className="text-[10px] font-black text-amber-700 uppercase tracking-wider block">
                  6,000 XP Milestone
                </span>
                <h3 className="text-lg font-black font-display text-slate-900 mt-0.5">Cosmic Apex Legend</h3>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Orbiting star rings, crystalline halo, cosmic star core chest, and mythic majesty.
                </p>

                <div className="my-5 flex items-center justify-center h-40 rounded-2xl bg-amber-50/60 border border-amber-200">
                  <MonsterAvatar config={monster} size={165} evolutionTier={4} animate />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 text-[11px] font-medium text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span>Aura:</span>
                  <span className="text-amber-700 font-black">Stardust Orbit</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={studentXp >= 6000 ? 'text-emerald-600 font-black' : 'text-slate-400'}>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in selection:bg-cyan-500 selection:text-white">
          <div className="card-island p-8 bg-white border-2 border-amber-300 shadow-2xl max-w-md w-full text-center space-y-4">
            <span className="text-4xl anim-badge block">🎉</span>
            <span className="text-xs font-mono font-black uppercase px-3.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
              500 XP Milestone Achieved!
            </span>
            <h3 className="text-2xl font-black font-display text-slate-900">It's Hatching Day!</h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Your mysterious egg has cracked completely open! Say hello to your brand new English companion.
            </p>

            <div className="w-48 h-48 mx-auto flex items-center justify-center my-3 rounded-3xl bg-gradient-to-tr from-amber-50 via-purple-50 to-sky-50 border-2 border-amber-200 p-2 shadow-inner">
              <MonsterAvatar config={monster} size={165} animate evolutionTier={1} />
            </div>

            <button
              type="button"
              onClick={handleConfirmHatching}
              className="w-full py-3.5 rounded-2xl btn-game-coral font-black text-sm shadow-md"
            >
              🎨 Customize &amp; Name My Monster!
            </button>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* CELEBRATION MODAL 2: EVOLUTION UNLOCKED                           */}
      {/* ================================================================= */}
      {showEvolutionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in selection:bg-cyan-500 selection:text-white">
          <div className="card-island p-8 bg-white border-2 border-purple-300 shadow-2xl max-w-md w-full text-center space-y-4">
            <span className="text-4xl anim-badge block">🌟</span>
            <span className="text-xs font-mono font-black uppercase px-3.5 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-300">
              New Evolution Unlocked!
            </span>
            <h3 className="text-2xl font-black font-display text-slate-900">{milestone.stageName}</h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Your monster has evolved to a new form! Keep completing unit reviews to discover even more power.
            </p>

            <div className="w-48 h-48 mx-auto flex items-center justify-center my-3 rounded-3xl bg-gradient-to-tr from-purple-50 via-pink-50 to-sky-50 border-2 border-purple-200 p-2 shadow-inner">
              <MonsterAvatar
                config={monster}
                size={165}
                animate
                stage={milestone.stage}
                evolutionTier={milestone.evolutionTier}
              />
            </div>

            <button
              type="button"
              onClick={handleConfirmEvolution}
              className="w-full py-3.5 rounded-2xl btn-game-purple font-black text-sm shadow-md"
            >
              Awesome! 🌟
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default MonsterWorldScreen;
