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
  Info,
  AlertCircle,
} from 'lucide-react';
import { useArcade } from '../../context/ArcadeContext';
import { useAuth } from '../../context/AuthContext';
import { useGamification } from '../../context/GamificationContext';
import { MonsterAvatar } from './MonsterAvatar';
import { MonsterService, MONSTER_OPTIONS } from '../../services/monsterService';
import { CoinService } from '../../services/coinService';
import {
  FUTURE_SHOP_CATALOG,
  COIN_ECONOMY,
  type MonsterConfig,
  type MonsterBodyShape,
  type MonsterBodyColor,
  type MonsterEyeType,
  type MonsterMouthType,
  type MonsterHornType,
  type MonsterCheekType,
  type MonsterPattern,
  type ShopItemPreview,
} from '../../types/monster';

type StudioTab = 'color' | 'shape' | 'eyes' | 'mouth' | 'features' | 'patterns' | 'wardrobe';

export const MonsterWorldScreen: React.FC = () => {
  const { navigateTo } = useArcade();
  const { student, sessionToken, updateStudentMonster } = useAuth();
  const { updateProfileMonster } = useGamification();
  const studentNumber = student?.studentNumber || '';

  const [monster, setMonster] = useState<MonsterConfig>(() => {
    return MonsterService.resolveMonster(student?.monster, studentNumber);
  });
  const [activeTab, setActiveTab] = useState<StudioTab>('color');
  const [isSaving, setIsSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [selectedShopItem, setSelectedShopItem] = useState<ShopItemPreview | null>(null);

  // Coins balance
  const coinSummary = CoinService.getSummary(studentNumber);
  const balance = student?.totalCoins ?? coinSummary.balance;

  // On mount or when session is verified, sync latest cloud monster from backend
  useEffect(() => {
    let isCancelled = false;

    if (studentNumber && sessionToken) {
      MonsterService.fetchMonster(studentNumber, sessionToken).then(res => {
        if (!isCancelled && res.success && res.monster) {
          setMonster(res.monster);
          updateStudentMonster?.(res.monster);
          updateProfileMonster?.(res.monster);
        }
      }).catch(err => {
        console.warn('[MonsterWorldScreen] Background monster fetch deferred:', err);
      });
    } else if (studentNumber) {
      const resolved = MonsterService.resolveMonster(student?.monster, studentNumber);
      setMonster(resolved);
    }

    return () => {
      isCancelled = true;
    };
  }, [studentNumber, sessionToken, updateStudentMonster, updateProfileMonster]);

  const handleUpdate = <K extends keyof MonsterConfig>(key: K, value: MonsterConfig[K]) => {
    setMonster(prev => ({
      ...prev,
      [key]: value,
    }));
    setSavedNotice(false);
    setSaveError(null);
  };

  const handleSurpriseMe = () => {
    const randomMonster = MonsterService.generateRandomMonster(monster.name);
    setMonster(randomMonster);
    setSavedNotice(false);
    setSaveError(null);
  };

  const handleSave = async () => {
    if (!studentNumber) return;
    setIsSaving(true);
    setSaveError(null);

    const token = sessionToken || '';
    const result = await MonsterService.saveMonster(studentNumber, token, monster);

    if (result.success && result.monster) {
      setMonster(result.monster);
      updateStudentMonster?.(result.monster);
      updateProfileMonster?.(result.monster);
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 3000);
    } else {
      setSavedNotice(false);
      setSaveError(result.error || 'Could not save monster to server. Please try again.');
    }
    setIsSaving(false);
  };

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
      {/* Top Header */}
      <div className="max-w-6xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => navigateTo({ view: 'home' })}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Arcade</span>
        </button>

        <div className="flex items-center gap-3">
          {/* Monster Coins Bank Pill */}
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 shadow-sm shadow-amber-500/5">
            <Coins className="w-5 h-5 text-amber-400 animate-pulse" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400/80">Monster Coins</span>
              <span className="text-lg font-black leading-none">{balance}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Monster Studio Preview & Actions */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/70 rounded-3xl p-6 flex flex-col items-center text-center shadow-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Monster Companion Studio</span>
            </div>

            {/* Live SVG Stage */}
            <div className="relative w-64 h-64 flex items-center justify-center my-2 rounded-2xl bg-gradient-to-b from-slate-900/60 to-indigo-950/40 border border-slate-700/40 p-4">
              <MonsterAvatar config={monster} size={210} animate className="transform transition duration-300" />
            </div>

            {/* Monster Name */}
            <div className="w-full mt-4">
              <label htmlFor="monster-name-input" className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-1">
                Monster Name
              </label>
              <input
                id="monster-name-input"
                type="text"
                value={monster.name}
                maxLength={20}
                onChange={e => handleUpdate('name', e.target.value)}
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
                onClick={handleSave}
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

          {/* Monster Coins Earning Guide Card */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 text-left text-xs text-slate-300 space-y-2.5">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <Info className="w-4 h-4 text-amber-400 shrink-0" />
              <span>How to Earn Monster Coins</span>
            </div>
            <ul className="space-y-1.5 pl-5 list-disc text-slate-300">
              <li>
                <strong className="text-slate-100">First Play Completion:</strong> +{COIN_ECONOMY.FIRST_COMPLETION} coins
              </li>
              <li>
                <strong className="text-slate-100">Accuracy &ge; 90%:</strong> +{COIN_ECONOMY.HIGH_ACCURACY_BONUS} bonus coins
              </li>
              <li>
                <strong className="text-slate-100">100% Perfect Score:</strong> +{COIN_ECONOMY.PERFECT_SCORE_BONUS} bonus coins (Stacks to <span className="text-amber-300 font-bold">13 coins</span> on first play!)
              </li>
              <li>
                <strong className="text-slate-100">First Daily Activity:</strong> +{COIN_ECONOMY.DAILY_FIRST_ACTIVITY} coins
              </li>
              <li>
                <strong className="text-slate-100">Level-Up Reward:</strong> +{COIN_ECONOMY.LEVEL_UP_REWARD} coins per new level reached!
              </li>
              <li>
                <strong className="text-slate-100">Games Zone:</strong> 3–6 coins per game (daily cap 25 coins)
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Studio Customization Tabs */}
        <div className="lg:col-span-7 bg-slate-800/60 backdrop-blur-md border border-slate-700/70 rounded-3xl p-6 shadow-xl flex flex-col">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-2xl border border-slate-800 overflow-x-auto mb-6">
            <button
              onClick={() => setActiveTab('color')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'color'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Color</span>
            </button>

            <button
              onClick={() => setActiveTab('shape')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'shape'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Shape</span>
            </button>

            <button
              onClick={() => setActiveTab('eyes')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'eyes'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Eyes</span>
            </button>

            <button
              onClick={() => setActiveTab('mouth')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'mouth'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Smile className="w-3.5 h-3.5" />
              <span>Mouth</span>
            </button>

            <button
              onClick={() => setActiveTab('features')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'features'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Features</span>
            </button>

            <button
              onClick={() => setActiveTab('patterns')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'patterns'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Shirt className="w-3.5 h-3.5" />
              <span>Patterns</span>
            </button>

            <button
              onClick={() => setActiveTab('wardrobe')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'wardrobe'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-amber-400/90 hover:text-amber-300 hover:bg-slate-800/50'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Wardrobe (Shop)</span>
            </button>
          </div>

          {/* TAB 1: COLORS */}
          {activeTab === 'color' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Choose Body Color</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {MONSTER_OPTIONS.colors.map(color => {
                  const isSelected = monster.bodyColor === color;
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleUpdate('bodyColor', color)}
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

          {/* TAB 2: SHAPES */}
          {activeTab === 'shape' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Choose Body Shape</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {MONSTER_OPTIONS.shapes.map(shape => {
                  const isSelected = monster.bodyShape === shape;
                  return (
                    <button
                      key={shape}
                      type="button"
                      onClick={() => handleUpdate('bodyShape', shape)}
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

          {/* TAB 3: EYES */}
          {activeTab === 'eyes' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Choose Eyes Expression</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {MONSTER_OPTIONS.eyes.map(eyeType => {
                  const isSelected = monster.eyeType === eyeType;
                  return (
                    <button
                      key={eyeType}
                      type="button"
                      onClick={() => handleUpdate('eyeType', eyeType)}
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

          {/* TAB 4: MOUTH */}
          {activeTab === 'mouth' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Choose Mouth & Mood</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {MONSTER_OPTIONS.mouths.map(mouthType => {
                  const isSelected = monster.mouthType === mouthType;
                  return (
                    <button
                      key={mouthType}
                      type="button"
                      onClick={() => handleUpdate('mouthType', mouthType)}
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

          {/* TAB 5: FEATURES (Horns & Cheeks) */}
          {activeTab === 'features' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Horns & Ears</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {MONSTER_OPTIONS.horns.map(hornType => {
                    const isSelected = monster.hornType === hornType;
                    return (
                      <button
                        key={hornType}
                        type="button"
                        onClick={() => handleUpdate('hornType', hornType)}
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
                  {MONSTER_OPTIONS.cheeks.map(cheekType => {
                    const isSelected = monster.cheekType === cheekType;
                    return (
                      <button
                        key={cheekType}
                        type="button"
                        onClick={() => handleUpdate('cheekType', cheekType)}
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

          {/* TAB 6: PATTERNS */}
          {activeTab === 'patterns' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Choose Body Pattern</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {MONSTER_OPTIONS.patterns.map(pattern => {
                  const isSelected = monster.pattern === pattern;
                  return (
                    <button
                      key={pattern}
                      type="button"
                      onClick={() => handleUpdate('pattern', pattern)}
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

          {/* TAB 7: FUTURE WARDROBE SHOP PREVIEW */}
          {activeTab === 'wardrobe' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex items-center gap-3">
                <Lock className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <strong className="block text-amber-300 font-bold mb-0.5">Upcoming Monster Wardrobe</strong>
                  Costumes and accessories are coming soon! Keep practicing and earning Monster Coins now so you can unlock your favorites first!
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                {FUTURE_SHOP_CATALOG.map(item => {
                  const rarityBadge = {
                    common: 'bg-slate-700 text-slate-300',
                    rare: 'bg-sky-500/20 text-sky-300 border border-sky-500/30',
                    epic: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
                    legendary: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
                  }[item.rarity];

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedShopItem(item)}
                      className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-700/60 hover:border-slate-600 transition flex items-center justify-between gap-3 cursor-pointer"
                    >
                      <div className="flex flex-col text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${rarityBadge}`}>
                            {item.rarity}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-slate-400">{item.category}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-100">{item.name}</h4>
                        <p className="text-xs text-slate-400 line-clamp-1">{item.description}</p>
                      </div>

                      <div className="flex flex-col items-end shrink-0">
                        <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                          <Coins className="w-3.5 h-3.5" />
                          <span>{item.price}</span>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-500 uppercase flex items-center gap-1 mt-0.5">
                          <Lock className="w-2.5 h-2.5" /> Locked
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected Shop Item Preview Modal */}
      {selectedShopItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-amber-500/30 p-6 text-center shadow-2xl relative">
            <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {selectedShopItem.rarity} • {selectedShopItem.category}
            </span>
            <h3 className="text-xl font-bold text-white mt-3">{selectedShopItem.name}</h3>
            <p className="text-xs text-slate-400 mt-2">{selectedShopItem.description}</p>

            <div className="flex items-center justify-center gap-1.5 text-amber-400 font-extrabold text-lg my-4">
              <Coins className="w-5 h-5" />
              <span>{selectedShopItem.price} Monster Coins</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300 mb-5 flex items-center justify-center gap-1.5">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Wardrobe dressing unlocks in Phase 8B!</span>
            </div>

            <button
              type="button"
              onClick={() => setSelectedShopItem(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
