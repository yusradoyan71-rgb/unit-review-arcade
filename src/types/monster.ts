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
  hat?: string | null;       // e.g. 'party_hat', 'crown', 'wizard_hat'
  glasses?: string | null;   // e.g. 'sunglasses', 'star_shades'
  clothing?: string | null;  // e.g. 'bow_tie', 'cape', 'scarf'
  wings?: string | null;     // e.g. 'angel_wings', 'bat_wings'
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
// FUTURE SHOP CATALOG (DESIGN ONLY — PURCHASES NOT IMPLEMENTED IN PHASE 8A)
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

export const FUTURE_SHOP_CATALOG: ShopItemPreview[] = [
  // Common (100 - 200 Coins) — Approx 2 weeks of regular learning
  {
    id: 'hat_party',
    name: 'Party Cone Hat',
    category: 'hat',
    rarity: 'common',
    price: 150,
    description: 'A colorful polka dot cone for festive learning moments.',
    icon: 'PartyPopper',
  },
  {
    id: 'glasses_round',
    name: 'Study Spectacles',
    category: 'glasses',
    rarity: 'common',
    price: 180,
    description: 'Round wireframe glasses for scholarly monsters.',
    icon: 'Glasses',
  },
  {
    id: 'cloth_bowtie',
    name: 'Dapper Bowtie',
    category: 'clothing',
    rarity: 'common',
    price: 120,
    description: 'A polite crimson bowtie for proper vocabulary recitations.',
    icon: 'Sparkles',
  },

  // Rare (300 - 600 Coins)
  {
    id: 'hat_crown_bronze',
    name: 'Explorer Crown',
    category: 'hat',
    rarity: 'rare',
    price: 400,
    description: 'Crafted from arcade bronze to honor dedicated learners.',
    icon: 'Crown',
  },
  {
    id: 'glasses_star',
    name: 'Star Shades',
    category: 'glasses',
    rarity: 'rare',
    price: 450,
    description: 'Bright yellow star sunglasses that shine in the arcade.',
    icon: 'Sun',
  },
  {
    id: 'cloth_hero_cape',
    name: 'Arcade Cape',
    category: 'clothing',
    rarity: 'rare',
    price: 550,
    description: 'Flowing purple cape fluttering with grammatical confidence.',
    icon: 'Flame',
  },

  // Epic (800 - 1,500 Coins)
  {
    id: 'hat_wizard',
    name: 'Sorcerer Hat',
    category: 'hat',
    rarity: 'epic',
    price: 950,
    description: 'Pointed midnight hat embroidered with golden English verbs.',
    icon: 'Wand2',
  },
  {
    id: 'wings_fairy',
    name: 'Glimmer Wings',
    category: 'wings',
    rarity: 'epic',
    price: 1200,
    description: 'Translucent wings that flutter whenever you answer correctly.',
    icon: 'Feather',
  },

  // Legendary (2,000 - 4,000 Coins)
  {
    id: 'hat_celestial_crown',
    name: 'Celestial Archon Diadem',
    category: 'hat',
    rarity: 'legendary',
    price: 2800,
    description: 'Floating halo of radiant stars reserved for apex linguists.',
    icon: 'Sparkles',
  },
  {
    id: 'wings_cosmic_phoenix',
    name: 'Cosmic Phoenix Wings',
    category: 'wings',
    rarity: 'legendary',
    price: 3500,
    description: 'Majestic blazing wings forged from boundless curiosity.',
    icon: 'Zap',
  },
];

