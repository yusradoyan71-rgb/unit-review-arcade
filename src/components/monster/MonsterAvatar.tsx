import React from 'react';
import type { MonsterConfig, MonsterBodyColor } from '../../types/monster';
import { DEFAULT_MONSTER_CONFIG } from '../../types/monster';

export interface MonsterAvatarProps {
  config?: MonsterConfig;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'studio' | number;
  animate?: boolean;
  className?: string;
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
}) => {
  const pixelSize = typeof size === 'number' ? size : SIZE_MAP[size] || 48;
  const palette = COLOR_PALETTES[config.bodyColor] || COLOR_PALETTES.cyan;
  const gradientId = `monster_grad_${config.bodyColor}_${Math.random().toString(36).substring(2, 6)}`;

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
          <filter id="shadow-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* 1. Base Ground Shadow */}
        <ellipse cx="100" cy="180" rx="55" ry="10" fill="#0f172a" opacity="0.18" filter="url(#shadow-blur)" />

        {/* 2. Horns / Antennae / Ears Layer (Back) */}
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

        {/* 3. Monster Body Shape Layer */}
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
            {/* Stubby little arms */}
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

        {/* 4. Pattern Overlay */}
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

        {/* 5. Cheeks Layer */}
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

        {/* 6. Eyes Layer */}
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

        {/* 7. Mouth Layer */}
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
            {/* Little white fangs */}
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
      </svg>
    </div>
  );
};
