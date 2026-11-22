import React from 'react';
import type { MonsterConfig, MonsterBodyColor, MonsterLifecycleStage, MonsterAccessories } from '../../types/monster';
import { DEFAULT_MONSTER_CONFIG } from '../../types/monster';

export interface MonsterAvatarProps {
  config?: MonsterConfig;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'studio' | number;
  animate?: boolean;
  className?: string;
  stage?: MonsterLifecycleStage;
  evolutionTier?: number;
  equippedAccessories?: MonsterAccessories;
  frame?: string | null;
}

const SIZE_MAP = {
  sm: 36,
  md: 48,
  lg: 84,
  xl: 128,
  studio: 220,
};

const COLOR_PALETTES: Record<MonsterBodyColor, { light: string; dark: string; shadow: string; belly: string }> = {
  cyan: { light: '#38bdf8', dark: '#0284c7', shadow: '#0369a1', belly: '#e0f2fe' },
  purple: { light: '#c084fc', dark: '#7e22ce', shadow: '#581c87', belly: '#f3e8ff' },
  pink: { light: '#f472b6', dark: '#db2777', shadow: '#9d174d', belly: '#fce7f3' },
  lime: { light: '#a3e635', dark: '#65a30d', shadow: '#3f6212', belly: '#ecfccb' },
  orange: { light: '#fb923c', dark: '#ea580c', shadow: '#9a3412', belly: '#ffedd5' },
  amber: { light: '#fbbf24', dark: '#d97706', shadow: '#78350f', belly: '#fef3c7' },
  emerald: { light: '#34d399', dark: '#059669', shadow: '#064e3b', belly: '#d1fae5' },
  indigo: { light: '#818cf8', dark: '#4338ca', shadow: '#312e81', belly: '#e0e7ff' },
};

export const MonsterAvatar: React.FC<MonsterAvatarProps> = ({
  config = DEFAULT_MONSTER_CONFIG,
  size = 'md',
  animate = false,
  className = '',
  stage,
  evolutionTier: explicitTier,
  equippedAccessories,
  frame,
}) => {
  const pixelSize = typeof size === 'number' ? size : SIZE_MAP[size] || 48;
  const palette = COLOR_PALETTES[config.bodyColor] || COLOR_PALETTES.cyan;
  const gradientId = `monster_grad_${config.bodyColor}_${Math.random().toString(36).substring(2, 6)}`;
  const eggGradId = `egg_grad_${Math.random().toString(36).substring(2, 6)}`;
  const auraGradId = `aura_glow_${Math.random().toString(36).substring(2, 6)}`;
  const auraInnerGradId = `aura_inner_${Math.random().toString(36).substring(2, 6)}`;
  const crownGradId = `crown_gold_${Math.random().toString(36).substring(2, 6)}`;
  const wingGradLId = `wing_magic_l_${Math.random().toString(36).substring(2, 6)}`;
  const wingGradRId = `wing_magic_r_${Math.random().toString(36).substring(2, 6)}`;
  const silverFrameMainId = `silver_frame_main_${Math.random().toString(36).substring(2, 6)}`;
  const silverFrameInnerId = `silver_frame_inner_${Math.random().toString(36).substring(2, 6)}`;

  // Determine stage and evolution tier
  // If neither stage nor evolutionTier is provided, we default to hatched Stage 1 (e.g. in Monster Studio)
  const isEggStage = stage === 'egg' || (explicitTier === 0 && !stage);
  const isCrackingStage = stage === 'cracking';
  const isEgg = isEggStage || isCrackingStage;

  let tier = explicitTier !== undefined ? explicitTier : 1;
  if (stage === 'egg' || stage === 'cracking') tier = 0;
  else if (stage === 'hatchling') tier = 1;
  else if (stage === 'adventurer') tier = 2;
  else if (stage === 'titan') tier = 3;
  else if (stage === 'apex_legend') tier = 4;

  const accessories: MonsterAccessories = equippedAccessories || config.accessories || {};
  const activeFrame = frame || accessories.frame;

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 ${
        animate ? 'animate-bounce-gentle' : ''
      } ${className}`}
      style={{ width: pixelSize, height: pixelSize }}
    >
      <svg
        viewBox="0 0 200 200"
        width={pixelSize}
        height={pixelSize}
        className="w-full h-full overflow-visible select-none drop-shadow-sm"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={palette.light} />
            <stop offset="100%" stopColor={palette.dark} />
          </linearGradient>
          <linearGradient id={eggGradId} x1="20%" y1="10%" x2="90%" y2="90%">
            <stop offset="0%" stopColor="#fdf4ff" />
            <stop offset="35%" stopColor={palette.light} />
            <stop offset="70%" stopColor={palette.dark} />
            <stop offset="100%" stopColor={palette.shadow} />
          </linearGradient>
          <filter id="shadow-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" />
          </filter>

          {/* Classroom Behavior Reward Gradients (Phase 3.4D) */}
          <radialGradient id={auraGradId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={auraInnerGradId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#fde047" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#ca8a04" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={crownGradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id={wingGradLId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id={wingGradRId} x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id={silverFrameMainId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="30%" stopColor="#94a3b8" />
            <stop offset="60%" stopColor="#f1f5f9" />
            <stop offset="85%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          <linearGradient id={silverFrameInnerId} x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
        </defs>

        {/* ================================================================= */}
        {/* CASE 1 & 2: EGG / CRACKING EGG STAGES                             */}
        {/* ================================================================= */}
        {isEgg ? (
          <g>
            {/* Ground / Nest Shadow */}
            <ellipse cx="100" cy="182" rx="60" ry="10" fill="#0f172a" opacity="0.25" filter="url(#shadow-blur)" />

            {/* Cozy Woven Crystal Nest (Back) */}
            <path d="M 35 165 C 45 140 155 140 165 165 C 170 185 30 185 35 165 Z" fill="#312e81" opacity="0.5" />
            <ellipse cx="100" cy="172" rx="68" ry="18" fill="#1e1b4b" stroke="#4338ca" strokeWidth="2.5" />

            {/* The Egg Body */}
            <path
              d="M 100 35 C 145 35 168 85 168 135 C 168 175 140 180 100 180 C 60 180 32 175 32 135 C 32 85 55 35 100 35 Z"
              fill={`url(#${eggGradId})`}
              stroke={palette.shadow}
              strokeWidth="3.5"
            />

            {/* Egg Magic Spots & Swirls */}
            <circle cx="75" cy="85" r="10" fill="#fdf4ff" opacity="0.45" />
            <circle cx="125" cy="115" r="14" fill="#fdf4ff" opacity="0.4" />
            <circle cx="75" cy="140" r="9" fill="#fdf4ff" opacity="0.35" />
            <circle cx="130" cy="75" r="7" fill="#fdf4ff" opacity="0.4" />

            {/* Gentle Golden Heart Crest */}
            <path
              d="M 100 102 C 100 102 94 94 88 96 C 82 98 82 106 87 110 L 100 122 L 113 110 C 118 106 118 98 112 96 C 106 94 100 102 100 102 Z"
              fill="#fde047"
              stroke="#ca8a04"
              strokeWidth="1.5"
            />

            {/* Glossy Egg Highlight */}
            <ellipse cx="75" cy="70" rx="16" ry="28" transform="rotate(-25 75 70)" fill="#ffffff" opacity="0.3" />

            {/* IF CRACKING: Radiant Glowing Fissures & Sparks */}
            {isCrackingStage && (
              <g>
                {/* Main Fissure */}
                <path
                  d="M 100 45 L 110 70 L 96 88 L 115 110 L 94 130 L 108 150 L 100 170"
                  stroke="#fef08a"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 100 45 L 110 70 L 96 88 L 115 110 L 94 130 L 108 150 L 100 170"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Left Branch */}
                <path d="M 96 88 L 74 100 L 64 120" stroke="#fef08a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 96 88 L 74 100 L 64 120" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />

                {/* Right Branch */}
                <path d="M 115 110 L 138 120 L 148 138" stroke="#fef08a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 115 110 L 138 120 L 148 138" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />

                {/* Sparkling escaped energy particles */}
                <circle cx="96" cy="88" r="4.5" fill="#ffffff" />
                <circle cx="115" cy="110" r="5" fill="#fde047" />
                <circle cx="94" cy="130" r="4" fill="#38bdf8" />
                <circle cx="74" cy="100" r="3.5" fill="#fde047" />
                <circle cx="138" cy="120" r="3.5" fill="#38bdf8" />
              </g>
            )}

            {/* Front Nest Twigs & Decorative Crystals */}
            <path d="M 35 168 Q 100 188 165 168" stroke="#a855f7" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <polygon points="50,166 58,150 66,168" fill="#38bdf8" opacity="0.85" />
            <polygon points="135,168 143,148 151,165" fill="#f472b6" opacity="0.85" />
            <polygon points="94,175 100,158 106,175" fill="#fde047" opacity="0.95" />
          </g>
        ) : (
          /* ================================================================= */
          /* CASE 3: HATCHED MONSTER (TIERS 1 - 4 + ACCESSORIES)               */
          /* ================================================================= */
          <g>
            {/* LAYER 1: CLASSROOM REWARD — LEGENDARY AURA (Behind Monster, Wings, and Shadow) */}
            {accessories.aura === 'aura_legendary' && (
              <g className="aura-legendary-glow select-none pointer-events-none">
                {/* Outer shimmering energy field */}
                <ellipse cx="100" cy="115" rx="88" ry="78" fill={`url(#${auraGradId})`} opacity="0.6" filter="url(#shadow-blur)" />
                {/* Secondary warm gold pulsing halo */}
                <ellipse cx="100" cy="115" rx="76" ry="68" fill={`url(#${auraInnerGradId})`} opacity="0.75" />
                {/* Radiant energy rings */}
                <ellipse cx="100" cy="115" rx="82" ry="72" stroke="#fde047" strokeWidth="2.5" strokeDasharray="6 8" fill="none" opacity="0.85" />
                <ellipse cx="100" cy="115" rx="68" ry="60" stroke="#fef08a" strokeWidth="1.5" strokeDasharray="3 5" fill="none" opacity="0.9" />
                {/* Mystical Starlight Motes */}
                <g fill="#ffffff">
                  {/* Top star sparkle */}
                  <polygon points="100,16 102.5,25 111,27.5 102.5,30 100,39 97.5,30 89,27.5 97.5,25" />
                  {/* Left star sparkle */}
                  <polygon points="26,75 28.5,81 35,83.5 28.5,86 26,92 23.5,86 17,83.5 23.5,81" />
                  {/* Right star sparkle */}
                  <polygon points="174,75 176.5,81 183,83.5 176.5,86 174,92 171.5,86 165,83.5 171.5,81" />
                  {/* Lower floating energy motes */}
                  <circle cx="36" cy="150" r="3.5" fill="#fde047" />
                  <circle cx="164" cy="150" r="3.5" fill="#fde047" />
                  <circle cx="50" cy="45" r="2.5" fill="#fef08a" />
                  <circle cx="150" cy="45" r="2.5" fill="#fef08a" />
                </g>
              </g>
            )}

            {/* 1. Base Ground Shadow */}
            <ellipse cx="100" cy="180" rx="55" ry="10" fill="#0f172a" opacity="0.18" filter="url(#shadow-blur)" />

            {/* 2. ACCESSORY WINGS OR EVOLUTION WINGS (Behind body) */}
            {/* LAYER 2: CLASSROOM REWARD — MAGIC WINGS */}
            {accessories.wings === 'wings_magic' && (
              <g stroke="#7e22ce" strokeWidth="2.5">
                {/* Left Magic Wing Outer */}
                <path
                  d="M 45 105 C 10 55 -10 32 8 20 C 26 8 46 48 50 100 Z"
                  fill={`url(#${wingGradLId})`}
                  opacity="0.92"
                />
                {/* Left Inner Feathers */}
                <path
                  d="M 47 112 C 18 80 5 62 18 52 C 32 42 48 75 50 115 Z"
                  fill="#c084fc"
                  opacity="0.85"
                />
                <path
                  d="M 49 118 C 28 102 20 92 28 85 C 38 78 50 100 50 122 Z"
                  fill="#f472b6"
                  opacity="0.85"
                />
                {/* Left Wing Starlight Vein */}
                <path d="M 46 100 Q 18 50 12 28" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.9" />
                <circle cx="10" cy="22" r="3" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />

                {/* Right Magic Wing Outer */}
                <path
                  d="M 155 105 C 190 55 210 32 192 20 C 174 8 154 48 150 100 Z"
                  fill={`url(#${wingGradRId})`}
                  opacity="0.92"
                />
                {/* Right Inner Feathers */}
                <path
                  d="M 153 112 C 182 80 195 62 182 52 C 168 42 152 75 150 115 Z"
                  fill="#c084fc"
                  opacity="0.85"
                />
                <path
                  d="M 151 118 C 172 102 180 92 172 85 C 162 78 150 100 150 122 Z"
                  fill="#f472b6"
                  opacity="0.85"
                />
                {/* Right Wing Starlight Vein */}
                <path d="M 154 100 Q 182 50 188 28" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.9" />
                <circle cx="190" cy="22" r="3" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
              </g>
            )}
            {accessories.wings === 'wings_fairy' && (
              <g opacity="0.85">
                <path d="M 45 105 C 15 70 5 45 25 35 C 45 25 55 60 50 100 Z" fill="#67e8f9" stroke="#0891b2" strokeWidth="2" opacity="0.85" />
                <path d="M 48 115 C 20 120 10 145 25 155 C 40 165 52 140 50 120 Z" fill="#f472b6" stroke="#db2777" strokeWidth="2" opacity="0.75" />
                <path d="M 155 105 C 185 70 195 45 175 35 C 155 25 145 60 150 100 Z" fill="#67e8f9" stroke="#0891b2" strokeWidth="2" opacity="0.85" />
                <path d="M 152 115 C 180 120 190 145 175 155 C 160 165 148 140 150 120 Z" fill="#f472b6" stroke="#db2777" strokeWidth="2" opacity="0.75" />
              </g>
            )}

            {accessories.wings === 'wings_cosmic_phoenix' && (
              <g stroke="#ca8a04" strokeWidth="2.5">
                <path d="M 45 105 C 10 65 -5 40 0 55 C 5 85 25 115 48 128 Z" fill="#f97316" />
                <path d="M 48 110 C 25 80 15 65 20 75 C 25 95 38 118 50 125 Z" fill="#facc15" />
                <path d="M 155 105 C 190 65 205 40 200 55 C 195 85 175 115 152 128 Z" fill="#f97316" />
                <path d="M 152 110 C 175 80 185 65 180 75 C 175 95 162 118 150 125 Z" fill="#facc15" />
              </g>
            )}

            {/* If no custom wing equipped, but Evolution Tier >= 3: show native Titan/Apex wings */}
            {!accessories.wings && tier >= 3 && (
              <g fill="#ec4899" stroke="#9d174d" strokeWidth="2.5" opacity="0.9">
                <path d="M 50 110 C 20 80 5 60 0 75 C 5 95 25 120 48 130 Z" />
                <path d="M 150 110 C 180 80 195 60 200 75 C 195 95 175 120 152 130 Z" />
              </g>
            )}

            {/* 3. ACCESSORY CLOTHING BACK LAYER (e.g. Hero Cape) */}
            {accessories.clothing === 'cloth_hero_cape' && (
              <g>
                <path
                  d="M 60 115 Q 45 150 35 178 Q 70 172 100 174 Q 130 172 165 178 Q 155 150 140 115"
                  fill="#6366f1"
                  stroke="#3730a3"
                  strokeWidth="2.5"
                  opacity="0.88"
                />
              </g>
            )}

            {/* 4. Horns / Antennae / Ears Layer (Back) */}
            {config.hornType === 'antennae' && (
              <g stroke={palette.shadow} strokeWidth="4" strokeLinecap="round">
                <path d="M 70 70 Q 55 35 45 40" fill="none" />
                <circle cx="43" cy="40" r="9" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
                <path d="M 130 70 Q 145 35 155 40" fill="none" />
                <circle cx="157" cy="40" r="9" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
              </g>
            )}

            {config.hornType === 'single_horn' && (
              <g>
                <path
                  d="M 92 68 L 100 20 L 108 68 Z"
                  fill="#fbbf24"
                  stroke="#b45309"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                <path d="M 94 56 Q 100 52 106 56" stroke="#f59e0b" strokeWidth="2" fill="none" />
                <path d="M 96 42 Q 100 38 104 42" stroke="#f59e0b" strokeWidth="2" fill="none" />
              </g>
            )}

            {config.hornType === 'twin_horns' && (
              <g>
                <path
                  d="M 65 75 C 50 45 40 35 30 42 C 40 55 52 65 62 82 Z"
                  fill="#f87171"
                  stroke="#b91c1c"
                  strokeWidth="2.5"
                />
                <path
                  d="M 135 75 C 150 45 160 35 170 42 C 160 55 148 65 138 82 Z"
                  fill="#f87171"
                  stroke="#b91c1c"
                  strokeWidth="2.5"
                />
                {tier >= 2 && (
                  <g stroke="#fde047" strokeWidth="2" fill="none">
                    <path d="M 38 48 Q 42 44 48 50" />
                    <path d="M 162 48 Q 158 44 152 50" />
                  </g>
                )}
              </g>
            )}

            {config.hornType === 'leaves' && (
              <g>
                <path d="M 100 68 Q 98 42 100 38" stroke="#15803d" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                <path
                  d="M 100 40 Q 75 30 78 48 Q 90 52 100 42 Z"
                  fill="#4ade80"
                  stroke="#15803d"
                  strokeWidth="2"
                />
                <path
                  d="M 100 40 Q 125 30 122 48 Q 110 52 100 42 Z"
                  fill="#22c55e"
                  stroke="#15803d"
                  strokeWidth="2"
                />
              </g>
            )}

            {config.hornType === 'cat_ears' && (
              <g>
                <path
                  d="M 58 75 L 48 42 L 80 58 Z"
                  fill={palette.dark}
                  stroke={palette.shadow}
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                <path d="M 60 70 L 54 48 L 74 60 Z" fill="#fda4af" />
                <path
                  d="M 142 75 L 152 42 L 120 58 Z"
                  fill={palette.dark}
                  stroke={palette.shadow}
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                <path d="M 140 70 L 146 48 L 126 60 Z" fill="#fda4af" />
              </g>
            )}

            {/* 5. Monster Body Shape Layer */}
            {config.bodyShape === 'blob' && (
              <path
                d="M 100 50 C 145 50 165 85 165 130 C 165 165 140 178 100 178 C 60 178 35 165 35 130 C 35 85 55 50 100 50 Z"
                fill={`url(#${gradientId})`}
                stroke={palette.shadow}
                strokeWidth="4"
              />
            )}

            {config.bodyShape === 'fuzzy' && (
              <path
                d="M 100 50 C 120 50 135 55 148 68 C 158 64 168 76 162 88 C 172 96 172 110 164 120 C 174 132 165 148 152 152 C 148 165 132 176 100 176 C 68 176 52 165 48 152 C 35 148 26 132 36 120 C 28 110 28 96 38 88 C 32 76 42 64 52 68 C 65 55 80 50 100 50 Z"
                fill={`url(#${gradientId})`}
                stroke={palette.shadow}
                strokeWidth="4"
              />
            )}

            {config.bodyShape === 'sprout' && (
              <path
                d="M 100 45 C 135 45 150 70 145 110 C 142 145 148 165 140 176 C 130 180 70 180 60 176 C 52 165 58 145 55 110 C 50 70 65 45 100 45 Z"
                fill={`url(#${gradientId})`}
                stroke={palette.shadow}
                strokeWidth="4"
              />
            )}

            {config.bodyShape === 'slime' && (
              <path
                d="M 100 62 C 125 62 170 105 170 145 C 170 172 145 178 100 178 C 55 178 30 172 30 145 C 30 105 75 62 100 62 Z"
                fill={`url(#${gradientId})`}
                stroke={palette.shadow}
                strokeWidth="4"
              />
            )}

            {config.bodyShape === 'chubby' && (
              <g>
                <ellipse cx="32" cy="125" rx="10" ry="14" fill={palette.dark} stroke={palette.shadow} strokeWidth="3" />
                <ellipse cx="168" cy="125" rx="10" ry="14" fill={palette.dark} stroke={palette.shadow} strokeWidth="3" />
                <path
                  d="M 100 52 C 150 52 166 85 166 128 C 166 168 142 178 100 178 C 58 178 34 168 34 128 C 34 85 50 52 100 52 Z"
                  fill={`url(#${gradientId})`}
                  stroke={palette.shadow}
                  strokeWidth="4"
                />
              </g>
            )}

            {config.bodyShape === 'star' && (
              <path
                d="M 100 45 C 115 58 128 62 144 58 C 150 75 160 84 175 92 C 165 108 165 122 172 138 C 155 144 148 155 142 172 C 125 168 112 175 100 178 C 88 175 75 168 58 172 C 52 155 45 144 28 138 C 35 122 35 108 25 92 C 40 84 50 75 56 58 C 72 62 85 58 100 45 Z"
                fill={`url(#${gradientId})`}
                stroke={palette.shadow}
                strokeWidth="4"
              />
            )}

            {/* 6. Pattern Overlay */}
            {config.pattern === 'belly_patch' && (
              <ellipse cx="100" cy="138" rx="42" ry="32" fill={palette.belly} opacity="0.9" />
            )}

            {config.pattern === 'spots' && (
              <g fill={palette.belly} opacity="0.8">
                <circle cx="72" cy="98" r="8" />
                <circle cx="128" cy="104" r="10" />
                <circle cx="100" cy="152" r="12" />
              </g>
            )}

            {config.pattern === 'stripes' && (
              <g stroke={palette.belly} strokeWidth="6" strokeLinecap="round" opacity="0.75">
                <path d="M 80 82 Q 100 88 120 82" fill="none" />
                <path d="M 75 100 Q 100 106 125 100" fill="none" />
                <path d="M 78 118 Q 100 124 122 118" fill="none" />
              </g>
            )}

            {config.pattern === 'heart' && (
              <path
                d="M 100 135 C 100 130 90 120 78 126 C 65 133 72 148 100 162 C 128 148 135 133 122 126 C 110 120 100 130 100 135 Z"
                fill="#fda4af"
                opacity="0.9"
              />
            )}

            {/* 7. EVOLUTION BODY TRAITS */}
            {/* Tier 2: Adventurer side speed flares */}
            {tier === 2 && (
              <g fill="#fde047" stroke="#ca8a04" strokeWidth="1.5">
                <polygon points="32,130 44,120 44,140" />
                <polygon points="168,130 156,120 156,140" />
              </g>
            )}

            {/* Tier 3: Titan Armored Chest Emblem */}
            {tier === 3 && (
              <polygon points="100,105 118,125 100,145 82,125" fill="#fde047" stroke="#ca8a04" strokeWidth="2.5" />
            )}

            {/* Tier 4: Cosmic Apex Legend Star Core Chest & Halo */}
            {tier === 4 && (
              <g>
                <circle cx="100" cy="130" r="18" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" opacity="0.9" />
                <circle cx="100" cy="130" r="8" fill="#fde047" />
                <ellipse cx="100" cy="28" rx="35" ry="9" stroke="#fde047" strokeWidth="3" fill="none" opacity="0.85" />
                <circle cx="100" cy="20" r="4" fill="#ffffff" stroke="#f59e0b" strokeWidth="1.5" />
              </g>
            )}

            {/* 8. Cheeks Layer */}
            {config.cheekType === 'blush_dots' && (
              <g fill="#fb7185" opacity="0.75">
                <ellipse cx="64" cy="120" rx="9" ry="6" />
                <ellipse cx="136" cy="120" rx="9" ry="6" />
              </g>
            )}

            {config.cheekType === 'freckles' && (
              <g fill="#9f1239" opacity="0.7">
                <circle cx="60" cy="118" r="2" />
                <circle cx="65" cy="116" r="2.2" />
                <circle cx="63" cy="122" r="2" />
                <circle cx="140" cy="118" r="2" />
                <circle cx="135" cy="116" r="2.2" />
                <circle cx="137" cy="122" r="2" />
              </g>
            )}

            {config.cheekType === 'spiral' && (
              <g stroke="#f43f5e" strokeWidth="2" fill="none" opacity="0.8">
                <path d="M 64 120 C 60 116 66 114 67 118 C 68 123 60 124 59 119" />
                <path d="M 136 120 C 132 116 138 114 139 118 C 140 123 132 124 131 119" />
              </g>
            )}

            {config.cheekType === 'stars' && (
              <g fill="#f59e0b" opacity="0.9">
                <path d="M 64 114 L 66 119 L 71 119 L 67 122 L 69 127 L 64 124 L 59 127 L 61 122 L 57 119 L 62 119 Z" />
                <path d="M 136 114 L 138 119 L 143 119 L 139 122 L 141 127 L 136 124 L 131 127 L 133 122 L 129 119 L 134 119 Z" />
              </g>
            )}

            {/* 9. Eyes Layer */}
            {config.eyeType === 'anime' && (
              <g>
                <ellipse cx="76" cy="100" rx="14" ry="18" fill="#0f172a" />
                <circle cx="72" cy="94" r="5.5" fill="#ffffff" />
                <circle cx="80" cy="106" r="2.5" fill="#ffffff" />
                <ellipse cx="124" cy="100" rx="14" ry="18" fill="#0f172a" />
                <circle cx="120" cy="94" r="5.5" fill="#ffffff" />
                <circle cx="128" cy="106" r="2.5" fill="#ffffff" />
              </g>
            )}

            {config.eyeType === 'cyclops' && (
              <g>
                <ellipse cx="100" cy="95" rx="22" ry="24" fill="#ffffff" stroke="#0f172a" strokeWidth="3" />
                <circle cx="100" cy="96" r="13" fill="#0284c7" />
                <circle cx="100" cy="96" r="8" fill="#0f172a" />
                <circle cx="95" cy="90" r="4.5" fill="#ffffff" />
                <circle cx="104" cy="101" r="2" fill="#ffffff" />
              </g>
            )}

            {config.eyeType === 'sleepy' && (
              <g stroke="#0f172a" strokeWidth="4.5" strokeLinecap="round" fill="none">
                <path d="M 64 100 Q 76 112 88 100" />
                <path d="M 112 100 Q 124 112 136 100" />
              </g>
            )}

            {config.eyeType === 'wink' && (
              <g>
                <path d="M 64 102 Q 76 114 88 102" stroke="#0f172a" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                <ellipse cx="124" cy="100" rx="14" ry="18" fill="#0f172a" />
                <circle cx="120" cy="94" r="5.5" fill="#ffffff" />
                <circle cx="128" cy="106" r="2.5" fill="#ffffff" />
              </g>
            )}

            {config.eyeType === 'three_eyes' && (
              <g>
                <ellipse cx="70" cy="104" rx="10" ry="13" fill="#0f172a" />
                <circle cx="67" cy="100" r="3.5" fill="#ffffff" />
                <ellipse cx="100" cy="84" rx="12" ry="15" fill="#0f172a" />
                <circle cx="97" cy="80" r="4" fill="#ffffff" />
                <ellipse cx="130" cy="104" rx="10" ry="13" fill="#0f172a" />
                <circle cx="127" cy="100" r="3.5" fill="#ffffff" />
              </g>
            )}

            {config.eyeType === 'googly' && (
              <g>
                <circle cx="75" cy="98" r="15" fill="#ffffff" stroke="#0f172a" strokeWidth="3" />
                <circle cx="73" cy="96" r="7" fill="#0f172a" />
                <circle cx="71" cy="94" r="2.5" fill="#ffffff" />
                <circle cx="125" cy="98" r="15" fill="#ffffff" stroke="#0f172a" strokeWidth="3" />
                <circle cx="128" cy="102" r="7" fill="#0f172a" />
                <circle cx="126" cy="100" r="2.5" fill="#ffffff" />
              </g>
            )}

            {/* Apex Diamond Glints in eyes for Tier 4 */}
            {tier === 4 && (
              <g fill="#fde047">
                <polygon points="76,96 78,99 83,99 79,102 81,106 76,103 72,106 74,102 70,99 75,99" />
                <polygon points="124,96 126,99 131,99 127,102 129,106 124,103 120,106 122,102 118,99 123,99" />
              </g>
            )}

            {/* 10. Mouth Layer */}
            {config.mouthType === 'smile' && (
              <path d="M 88 126 Q 100 138 112 126" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            )}

            {config.mouthType === 'fang_grin' && (
              <g>
                <path
                  d="M 84 125 Q 100 144 116 125 Z"
                  fill="#0f172a"
                  stroke="#0f172a"
                  strokeWidth="2"
                />
                <polygon points="88,125 93,125 90.5,131" fill="#ffffff" />
                <polygon points="107,125 112,125 109.5,131" fill="#ffffff" />
              </g>
            )}

            {config.mouthType === 'laughing' && (
              <g>
                <path
                  d="M 82 124 Q 100 152 118 124 Z"
                  fill="#881337"
                  stroke="#0f172a"
                  strokeWidth="3"
                />
                <path d="M 90 142 Q 100 134 110 142 Q 100 150 90 142" fill="#fb7185" />
              </g>
            )}

            {config.mouthType === 'goofy_teeth' && (
              <g>
                <path d="M 86 126 Q 100 140 114 126" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                <rect x="94" y="127" width="5" height="6" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" rx="1" />
                <rect x="101" y="127" width="5" height="6" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" rx="1" />
              </g>
            )}

            {config.mouthType === 'cat_mouth' && (
              <path
                d="M 86 126 Q 93 134 100 128 Q 107 134 114 126"
                stroke="#0f172a"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
            )}

            {config.mouthType === 'whistle' && (
              <circle cx="100" cy="128" r="5" fill="#0f172a" />
            )}

            {/* 11. ACCESSORY CLOTHING FRONT LAYER */}
            {accessories.clothing === 'cloth_bowtie' && (
              <g>
                <polygon points="86,132 100,137 86,142" fill="#e11d48" stroke="#881337" strokeWidth="1.5" />
                <polygon points="114,132 100,137 114,142" fill="#e11d48" stroke="#881337" strokeWidth="1.5" />
                <circle cx="100" cy="137" r="3.5" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
              </g>
            )}

            {accessories.clothing === 'cloth_scarf' && (
              <g>
                <path d="M 68 126 Q 100 136 132 126 Q 134 138 128 143 Q 100 150 72 143 Z" fill="#0ea5e9" stroke="#0369a1" strokeWidth="2" />
                <path d="M 78 138 L 74 162 L 90 162 L 92 140 Z" fill="#38bdf8" stroke="#0369a1" strokeWidth="1.5" />
                <line x1="76" y1="162" x2="76" y2="167" stroke="#0284c7" strokeWidth="2" />
                <line x1="82" y1="162" x2="82" y2="167" stroke="#0284c7" strokeWidth="2" />
                <line x1="88" y1="162" x2="88" y2="167" stroke="#0284c7" strokeWidth="2" />
              </g>
            )}

            {accessories.clothing === 'cloth_hero_cape' && (
              <g>
                <path d="M 72 124 Q 100 132 128 124" stroke="#fbbf24" strokeWidth="3" fill="none" />
                <circle cx="100" cy="128" r="4" fill="#fbbf24" stroke="#b45309" strokeWidth="1.5" />
              </g>
            )}

            {/* 12. ACCESSORY GLASSES LAYER */}
            {accessories.glasses === 'glasses_round' && (
              <g stroke="#0284c7" strokeWidth="3" fill="rgba(224, 242, 254, 0.4)">
                <circle cx="76" cy="100" r="17" />
                <circle cx="124" cy="100" r="17" />
                <line x1="93" y1="100" x2="107" y2="100" strokeWidth="3" />
                <line x1="59" y1="98" x2="50" y2="92" strokeWidth="2.5" />
                <line x1="141" y1="98" x2="150" y2="92" strokeWidth="2.5" />
              </g>
            )}

            {accessories.glasses === 'glasses_star' && (
              <g fill="#fde047" stroke="#ca8a04" strokeWidth="2" opacity="0.95">
                <polygon points="76,85 81,95 91,95 83,101 86,111 76,105 66,111 69,101 61,95 71,95" />
                <polygon points="124,85 129,95 139,95 131,101 134,111 124,105 114,111 117,101 109,95 119,95" />
                <line x1="91" y1="98" x2="109" y2="98" stroke="#ca8a04" strokeWidth="3" />
              </g>
            )}

            {/* 13. ACCESSORY HAT LAYER */}
            {/* LAYER 5: CLASSROOM REWARD — MONSTER CROWN (Positioned Above Head) */}
            {accessories.hat === 'hat_monster_crown' && (
              <g>
                {/* Crown Arch Base / Velvet Rim */}
                <ellipse cx="100" cy="58" rx="36" ry="8" fill="#e11d48" stroke="#881337" strokeWidth="2" />
                <ellipse cx="100" cy="56" rx="34" ry="7" fill={`url(#${crownGradId})`} stroke="#b45309" strokeWidth="2.5" />
                
                {/* Golden Imperial Spikes */}
                <polygon
                  points="66,56 70,22 84,42 100,14 116,42 130,22 134,56"
                  fill={`url(#${crownGradId})`}
                  stroke="#b45309"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />

                {/* Royal Center Ruby Gem */}
                <polygon points="100,28 106,37 100,46 94,37" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />
                <polygon points="100,31 103,37 100,43 97,37" fill="#fca5a5" />

                {/* Flanking Sapphire Jewels */}
                <circle cx="84" cy="42" r="3.5" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1.5" />
                <circle cx="83" cy="41" r="1.2" fill="#ffffff" />
                <circle cx="116" cy="42" r="3.5" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1.5" />
                <circle cx="115" cy="41" r="1.2" fill="#ffffff" />

                {/* Golden Pearls on Spike Tips */}
                <circle cx="70" cy="22" r="4" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
                <circle cx="100" cy="14" r="5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.8" />
                <circle cx="130" cy="22" r="4" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
              </g>
            )}

            {accessories.hat === 'hat_party' && (
              <g>
                <polygon points="82,62 100,16 118,62" fill="#f43f5e" stroke="#9f1239" strokeWidth="2" strokeLinejoin="round" />
                <path d="M 87 50 Q 100 54 113 50" stroke="#facc15" strokeWidth="3" fill="none" />
                <path d="M 91 38 Q 100 41 109 38" stroke="#38bdf8" strokeWidth="2.5" fill="none" />
                <circle cx="100" cy="15" r="5" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
              </g>
            )}

            {accessories.hat === 'hat_crown_bronze' && (
              <g>
                <polygon points="68,58 78,32 100,48 122,32 132,58" fill="#fde047" stroke="#ca8a04" strokeWidth="2.5" strokeLinejoin="round" />
                <circle cx="78" cy="32" r="3" fill="#38bdf8" />
                <circle cx="100" cy="48" r="3.5" fill="#ec4899" />
                <circle cx="122" cy="32" r="3" fill="#38bdf8" />
              </g>
            )}

            {accessories.hat === 'hat_wizard' && (
              <g>
                <ellipse cx="100" cy="62" rx="38" ry="10" fill="#4338ca" stroke="#312e81" strokeWidth="2.5" />
                <path d="M 72 60 Q 95 10 115 12 Q 105 38 128 60 Z" fill="#4f46e5" stroke="#312e81" strokeWidth="2.5" strokeLinejoin="round" />
                <path d="M 98 42 C 94 38 94 32 98 28 C 96 30 96 36 98 42 Z" fill="#fde047" />
              </g>
            )}

            {accessories.hat === 'hat_celestial_crown' && (
              <g>
                <ellipse cx="100" cy="38" rx="34" ry="8" stroke="#fde047" strokeWidth="3" fill="none" opacity="0.9" />
                <polygon points="100,22 105,32 115,34 107,41 110,50 100,44 90,50 93,41 85,34 95,32" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
                <circle cx="68" cy="38" r="3" fill="#fde047" />
                <circle cx="132" cy="38" r="3" fill="#fde047" />
              </g>
            )}

            {/* LAYER 6: CLASSROOM REWARD — SILVER STAR FRAME (Surrounding Profile / Avatar) */}
            {(accessories.frame === 'frame_silver_star' || activeFrame === 'frame_silver_star') && (
              <g className="silver-star-frame-layer select-none pointer-events-none">
                {/* Outer Silver Shadow Bezel */}
                <circle
                  cx="100"
                  cy="100"
                  r="95"
                  fill="none"
                  stroke={`url(#${silverFrameMainId})`}
                  strokeWidth="5"
                  filter="url(#shadow-blur)"
                  opacity="0.35"
                />
                {/* Main Polished Silver Ring */}
                <circle
                  cx="100"
                  cy="100"
                  r="95"
                  fill="none"
                  stroke={`url(#${silverFrameMainId})`}
                  strokeWidth="4"
                />
                {/* Bright Specular Highlight Rim */}
                <circle
                  cx="100"
                  cy="100"
                  r="91.5"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  opacity="0.85"
                />
                {/* Decorative Inner Star-Dotted Ring */}
                <circle
                  cx="100"
                  cy="100"
                  r="88"
                  fill="none"
                  stroke={`url(#${silverFrameInnerId})`}
                  strokeWidth="2"
                  strokeDasharray="4 6"
                  opacity="0.75"
                />

                {/* 4 Cardinal Diamond Star Jewels */}
                {/* Top Star */}
                <polygon points="100,0 103,7 110,10 103,13 100,20 97,13 90,10 97,7" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
                <circle cx="100" cy="10" r="2.2" fill="#38bdf8" />
                {/* Bottom Star */}
                <polygon points="100,180 103,187 110,190 103,193 100,200 97,193 90,190 97,187" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
                <circle cx="100" cy="190" r="2.2" fill="#38bdf8" />
                {/* Left Star */}
                <polygon points="0,100 7,103 10,110 13,103 20,100 13,97 10,90 7,97" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
                <circle cx="10" cy="100" r="2.2" fill="#38bdf8" />
                {/* Right Star */}
                <polygon points="180,100 187,103 190,110 193,103 200,100 193,97 190,90 187,97" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
                <circle cx="190" cy="100" r="2.2" fill="#38bdf8" />
              </g>
            )}
          </g>
        )}
      </svg>
    </div>
  );
};
