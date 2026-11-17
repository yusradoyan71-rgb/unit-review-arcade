/**
 * UNIT REVIEW ARCADE — MONSTER WORLD TYPES & ECONOMY CONFIG (PHASE 8A)
 * Version: 8.0.0
 * 
 * Defines data structures for:
 * 1. Layered Monster Vector Character Customization
 * 2. Monster Coins Earning Rules & Anti-Farming Economy
 * 3. Future Wardrobe Shop Catalog (Design Only)
 */

export type MonsterBodyShape = 'blob' | 'fuzzy' | 'sprout' | 'slime' | 'chubby' | 'star';

export type MonsterBodyColor = 
  | 'cyan'       // Electric Cyan (#06b6d4)
  | 'purple'     // Mystic Purple (#8b5cf6)
  | 'pink'       // Bubblegum Pink (#ec4899)
  | 'lime'       // Neon Lime (#84cc16)
  | 'orange'     // Sunset Orange (#f97316)
  | 'amber'      // Golden Amber (#f59e0b)
  | 'emerald'    // Emerald Green (#10b981)
  | 'indigo';    // Deep Indigo (#6366f1)

export type MonsterEyeType = 
  | 'cyclops'    // Big friendly single eye with glint
  | 'anime'      // Twin sparkly anime eyes
  | 'sleepy'     // Relaxed cute sleepy eyes
  | 'wink'       // Mischievous wink
  | 'three_eyes' // Playful alien triple eyes
  | 'googly';    // Quirky offset pupils

export type MonsterMouthType = 
  | 'smile'       // Sweet curved smile
  | 'fang_grin'   // Happy grin with cute upper fangs
  | 'laughing'    // Wide open mouth with tongue
  | 'goofy_teeth' // Two cute buck teeth
  | 'cat_mouth'   // Playful 'w' cat mouth
  | 'whistle';    // Cute whistling circle

export type MonsterHornType = 
  | 'none'
  | 'single_horn' // Unicorn magic horn
  | 'twin_horns'  // Two cute curved horns
  | 'antennae'    // Two bouncy orb antennae
  | 'leaves'      // Sprout leaves on head
  | 'cat_ears';   // Soft rounded ears

export type MonsterCheekType = 
  | 'none'
  | 'blush_dots'  // Rosy pink blush circles
  | 'freckles'    // Three tiny dots per side
  | 'spiral'      // Cartoon spiral swirls
  | 'stars';      // Sparkle star blush

export type MonsterPattern = 
  | 'none'
  | 'belly_patch' // Lighter pastel belly oval
  | 'spots'       // Soft decorative dots
  | 'stripes'     // Gentle tiger stripes
  | 'heart';      // Sweet heart patch on chest

export interface MonsterAccessories {
  hat?: string | null;       // e.g. 'hat_party', 'hat_crown', 'hat_wizard'
  glasses?: string | null;   // e.g. 'glasses_round', 'glasses_star', 'glasses_pixel'
  clothing?: string | null;  // e.g. 'cloth_bowtie', 'cloth_hero_cape', 'cloth_scarf'
  wings?: string | null;     // e.g. 'wings_fairy', 'wings_cosmic_phoenix'
  owned?: string[];          // List of purchased / owned accessory IDs
}

export interface MonsterConfig {
  name: string;
  bodyShape: MonsterBodyShape;
  bodyColor: MonsterBodyColor;
  eyeType: MonsterEyeType;
  mouthType: MonsterMouthType;
  hornType: MonsterHornType;
  cheekType: MonsterCheekType;
  pattern: MonsterPattern;
  accessories?: MonsterAccessories;
  updatedAt?: string;
}

export const DEFAULT_MONSTER_CONFIG: MonsterConfig = {
  name: 'Pip',
  bodyShape: 'blob',
  bodyColor: 'cyan',
  eyeType: 'anime',
  mouthType: 'smile',
  hornType: 'antennae',
  cheekType: 'blush_dots',
  pattern: 'belly_patch',
  accessories: {},
};

// ---------------------------------------------------------------------------
// MONSTER COIN ECONOMY CONFIGURATION
// ---------------------------------------------------------------------------

export const COIN_ECONOMY = {
  // Activity Completion Rewards
  FIRST_COMPLETION: 5,        // First time completing an activity
  HIGH_ACCURACY_BONUS: 3,     // Accuracy >= 90%
  PERFECT_SCORE_BONUS: 5,     // Accuracy === 100% (Stacks with high accuracy bonus: 5 + 3 + 5 = 13)
  DAILY_FIRST_ACTIVITY: 5,    // First successful learning activity of the day
  LEVEL_UP_REWARD: 10,        // Coins per newly reached level

  // Anti-Farming & Replay Decay
  REPLAY_IMPROVED: 2,         // Replaying activity and improving score
  REPLAY_PRACTICE: 1,         // Replaying without improvement (decay practice coin)
  MAX_DAILY_REPLAY_COINS: 5,  // Daily cap on non-improving replay practice coins

  // Games Zone Rewards
  GAMES_ZONE_EASY: 3,         // Games Zone Easy completion (accuracy >= 50%)
  GAMES_ZONE_MEDIUM: 4,       // Games Zone Medium completion
  GAMES_ZONE_HARD: 5,         // Games Zone Hard completion
  GAMES_ZONE_HIGH_ACC: 1,     // Games Zone accuracy >= 90% bonus
  MAX_DAILY_GAMES_ZONE_COINS: 25, // Daily cap on Games Zone coins
};

export type CoinTransactionReason = 
  | 'activity_completion'
  | 'high_accuracy_bonus'
  | 'perfect_score_bonus'
  | 'daily_first_activity'
  | 'level_up_bonus'
  | 'replay_improvement'
  | 'replay_practice'
  | 'games_zone_completion'
  | 'shop_purchase'
  | 'admin_adjustment';

export interface CoinTransaction {
  id: string;
  studentNumber: string;
  class: string;
  amount: number;
  balanceAfter: number;
  reason: CoinTransactionReason;
  sourceId: string; // e.g. attemptId or level number
  createdAt: string;
}

export interface MonsterCoinsSummary {
  balance: number;
  todayEarned: number;
  lifetimeEarned: number;
}

// ---------------------------------------------------------------------------
// MONSTER LIFECYCLE, HATCHING & EVOLUTION MILESTONES (PHASE 8B)
// ---------------------------------------------------------------------------

export type MonsterLifecycleStage = 
  | 'egg'          // 0 - 249 XP: Mysterious incubating egg
  | 'cracking'     // 250 - 499 XP: Cracked egg with glowing light fissures
  | 'hatchling'    // 500 - 1,499 XP: Stage 1 Baby companion (Creator unlocked!)
  | 'adventurer'   // 1,500 - 2,999 XP: Stage 2 Evolution (Athletic runner form)
  | 'titan'        // 3,000 - 5,999 XP: Stage 3 Evolution (Champion Titan with wings)
  | 'apex_legend'; // 6,000+ XP: Stage 4 Legendary Evolution (Cosmic Apex Legend)

export const MONSTER_MILESTONES = {
  EGG_CRACKING_XP: 250,
  HATCHING_XP: 500,
  SHOP_UNLOCK_XP: 750,
  EVOLUTION_1_XP: 1500, // Stage 2: Adventurer Form
  EVOLUTION_2_XP: 3000, // Stage 3: Champion Titan
  EVOLUTION_3_XP: 6000, // Stage 4: Cosmic Apex Legend
};

export interface MonsterMilestoneInfo {
  stage: MonsterLifecycleStage;
  stageName: string;
  minXp: number;
  nextMilestoneXp: number | null;
  progressPercent: number;
  isEgg: boolean;
  isCracked: boolean;
  isHatched: boolean;
  isShopUnlocked: boolean;
  evolutionTier: number; // 0 for egg/cracked, 1 for Hatchling, 2 for Adventurer, 3 for Titan, 4 for Apex Legend
}

/**
 * Resolves the student's exact monster lifecycle stage and milestones from accumulated XP.
 */
export function getMonsterMilestoneInfo(xp: number): MonsterMilestoneInfo {
  const currentXp = Math.max(0, Math.floor(xp || 0));

  if (currentXp < MONSTER_MILESTONES.EGG_CRACKING_XP) {
    const progress = Math.min(100, Math.round((currentXp / MONSTER_MILESTONES.HATCHING_XP) * 100));
    return {
      stage: 'egg',
      stageName: 'Mysterious Egg',
      minXp: 0,
      nextMilestoneXp: MONSTER_MILESTONES.HATCHING_XP,
      progressPercent: progress,
      isEgg: true,
      isCracked: false,
      isHatched: false,
      isShopUnlocked: false,
      evolutionTier: 0,
    };
  }

  if (currentXp < MONSTER_MILESTONES.HATCHING_XP) {
    const progress = Math.min(100, Math.round((currentXp / MONSTER_MILESTONES.HATCHING_XP) * 100));
    return {
      stage: 'cracking',
      stageName: 'Cracking Egg',
      minXp: MONSTER_MILESTONES.EGG_CRACKING_XP,
      nextMilestoneXp: MONSTER_MILESTONES.HATCHING_XP,
      progressPercent: progress,
      isEgg: true,
      isCracked: true,
      isHatched: false,
      isShopUnlocked: false,
      evolutionTier: 0,
    };
  }

  if (currentXp < MONSTER_MILESTONES.EVOLUTION_1_XP) {
    const nextTarget = currentXp < MONSTER_MILESTONES.SHOP_UNLOCK_XP
      ? MONSTER_MILESTONES.SHOP_UNLOCK_XP
      : MONSTER_MILESTONES.EVOLUTION_1_XP;
    const rangeSpan = nextTarget - MONSTER_MILESTONES.HATCHING_XP;
    const progress = Math.min(100, Math.max(0, Math.round(((currentXp - MONSTER_MILESTONES.HATCHING_XP) / rangeSpan) * 100)));
    return {
      stage: 'hatchling',
      stageName: 'Hatchling Pal',
      minXp: MONSTER_MILESTONES.HATCHING_XP,
      nextMilestoneXp: nextTarget,
      progressPercent: progress,
      isEgg: false,
      isCracked: false,
      isHatched: true,
      isShopUnlocked: currentXp >= MONSTER_MILESTONES.SHOP_UNLOCK_XP,
      evolutionTier: 1,
    };
  }

  if (currentXp < MONSTER_MILESTONES.EVOLUTION_2_XP) {
    const rangeSpan = MONSTER_MILESTONES.EVOLUTION_2_XP - MONSTER_MILESTONES.EVOLUTION_1_XP;
    const progress = Math.min(100, Math.max(0, Math.round(((currentXp - MONSTER_MILESTONES.EVOLUTION_1_XP) / rangeSpan) * 100)));
    return {
      stage: 'adventurer',
      stageName: 'Adventurer Form',
      minXp: MONSTER_MILESTONES.EVOLUTION_1_XP,
      nextMilestoneXp: MONSTER_MILESTONES.EVOLUTION_2_XP,
      progressPercent: progress,
      isEgg: false,
      isCracked: false,
      isHatched: true,
      isShopUnlocked: true,
      evolutionTier: 2,
    };
  }

  if (currentXp < MONSTER_MILESTONES.EVOLUTION_3_XP) {
    const rangeSpan = MONSTER_MILESTONES.EVOLUTION_3_XP - MONSTER_MILESTONES.EVOLUTION_2_XP;
    const progress = Math.min(100, Math.max(0, Math.round(((currentXp - MONSTER_MILESTONES.EVOLUTION_2_XP) / rangeSpan) * 100)));
    return {
      stage: 'titan',
      stageName: 'Champion Titan',
      minXp: MONSTER_MILESTONES.EVOLUTION_2_XP,
      nextMilestoneXp: MONSTER_MILESTONES.EVOLUTION_3_XP,
      progressPercent: progress,
      isEgg: false,
      isCracked: false,
      isHatched: true,
      isShopUnlocked: true,
      evolutionTier: 3,
    };
  }

  // 6,000+ XP: Cosmic Apex Legend
  return {
    stage: 'apex_legend',
    stageName: 'Cosmic Apex Legend',
    minXp: MONSTER_MILESTONES.EVOLUTION_3_XP,
    nextMilestoneXp: null,
    progressPercent: 100,
    isEgg: false,
    isCracked: false,
    isHatched: true,
    isShopUnlocked: true,
    evolutionTier: 4,
  };
}

// ---------------------------------------------------------------------------
// MONSTER WARDROBE SHOP CATALOG (PHASE 8B)
// ---------------------------------------------------------------------------

export type ShopItemRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type ShopItemCategory = 'hat' | 'glasses' | 'clothing' | 'wings';

export interface ShopItemPreview {
  id: string;
  name: string;
  category: ShopItemCategory;
  rarity: ShopItemRarity;
  price: number;
  description: string;
  icon: string;
}

export type ShopAccessoryItem = ShopItemPreview;

export const FUTURE_SHOP_CATALOG: ShopItemPreview[] = [
  // Common (50 - 90 Coins) — Accessible to every student within regular learning
  {
    id: 'hat_party',
    name: 'Party Cone Hat',
    category: 'hat',
    rarity: 'common',
    price: 60,
    description: 'A colorful polka dot cone for festive learning celebrations.',
    icon: 'PartyPopper',
  },
  {
    id: 'glasses_round',
    name: 'Study Spectacles',
    category: 'glasses',
    rarity: 'common',
    price: 50,
    description: 'Round wireframe frames for studious English vocabulary cadets.',
    icon: 'Glasses',
  },
  {
    id: 'cloth_bowtie',
    name: 'Dapper Bowtie',
    category: 'clothing',
    rarity: 'common',
    price: 65,
    description: 'A polite crimson bowtie for crisp classroom presentations.',
    icon: 'Sparkles',
  },
  {
    id: 'cloth_scarf',
    name: 'Cozy Winter Scarf',
    category: 'clothing',
    rarity: 'common',
    price: 75,
    description: 'Warm knitted scarf striped with comforting pastel colors.',
    icon: 'Shirt',
  },

  // Rare (150 - 250 Coins)
  {
    id: 'hat_crown_bronze',
    name: 'Starlight Tiara',
    category: 'hat',
    rarity: 'rare',
    price: 150,
    description: 'Gleaming golden tiara adorned with tiny glowing star gems.',
    icon: 'Crown',
  },
  {
    id: 'glasses_star',
    name: 'Star Shades',
    category: 'glasses',
    rarity: 'rare',
    price: 180,
    description: 'Bright neon star sunglasses that shine during streak streaks.',
    icon: 'Sun',
  },
  {
    id: 'cloth_hero_cape',
    name: 'Arcade Champion Cape',
    category: 'clothing',
    rarity: 'rare',
    price: 220,
    description: 'Flowing purple cape fluttering with grammatical confidence.',
    icon: 'Flame',
  },

  // Epic (350 - 500 Coins)
  {
    id: 'hat_wizard',
    name: 'Sorcerer Hat',
    category: 'hat',
    rarity: 'epic',
    price: 350,
    description: 'Pointed midnight hat embroidered with golden English runes.',
    icon: 'Wand2',
  },
  {
    id: 'wings_fairy',
    name: 'Glimmer Wings',
    category: 'wings',
    rarity: 'epic',
    price: 450,
    description: 'Translucent fairy wings that flutter when you answer correctly.',
    icon: 'Feather',
  },

  // Legendary (650 - 900 Coins)
  {
    id: 'hat_celestial_crown',
    name: 'Celestial Archon Diadem',
    category: 'hat',
    rarity: 'legendary',
    price: 750,
    description: 'Floating halo of radiant starlight reserved for apex linguists.',
    icon: 'Sparkles',
  },
  {
    id: 'wings_cosmic_phoenix',
    name: 'Cosmic Phoenix Wings',
    category: 'wings',
    rarity: 'legendary',
    price: 900,
    description: 'Majestic blazing wings forged from boundless curiosity.',
    icon: 'Zap',
  },
];

