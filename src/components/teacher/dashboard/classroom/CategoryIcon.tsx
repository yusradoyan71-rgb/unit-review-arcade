import React from 'react';
import type { ClassroomCategory } from '../../../../types/classroomPoints';
import {
  Mic,
  Languages,
  Sparkles,
  HeartHandshake,
  Users,
  TrendingUp,
  AlertTriangle,
  VolumeX,
  HelpCircle,
  Star,
  Award,
  BookOpen,
  ThumbsUp,
  Flame,
  Zap,
  Target,
  Smile,
  type LucideIcon,
} from 'lucide-react';

export const LUCIDE_ICON_MAP: Record<string, LucideIcon> = {
  Mic,
  Languages,
  Sparkles,
  HeartHandshake,
  Users,
  TrendingUp,
  AlertTriangle,
  VolumeX,
  HelpCircle,
  Star,
  Award,
  BookOpen,
  ThumbsUp,
  Flame,
  Zap,
  Target,
  Smile,
};

export const CATEGORY_DEFAULT_ICONS: Record<string, LucideIcon> = {
  cat_speaking_participation: Mic,
  cat_using_english: Languages,
  cat_excellent_effort: Sparkles,
  cat_helping_others: HeartHandshake,
  cat_teamwork: Users,
  cat_great_improvement: TrendingUp,
  cat_classroom_disruption: AlertTriangle,
  cat_interrupting_others: VolumeX,
  cat_not_following_instructions: HelpCircle,
};

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  cat_speaking_participation: 'Volunteering answers, speaking up in class, or presenting clearly.',
  cat_using_english: 'Actively choosing and speaking English during lessons and activities.',
  cat_excellent_effort: 'Showing persistence, hard work, and doing their personal best on tasks.',
  cat_helping_others: 'Assisting a peer, demonstrating kindness, and supporting classmates.',
  cat_teamwork: 'Collaborating respectfully, sharing tasks, and engaging in group work.',
  cat_great_improvement: 'Notable growth in confidence, vocabulary accuracy, or pronunciation.',
  cat_classroom_disruption: 'Off-task behavior, talking out of turn, or disturbing learning.',
  cat_interrupting_others: 'Interrupting the teacher or peers while someone else is speaking.',
  cat_not_following_instructions: 'Ignoring activity guidelines, rules, or classroom directions.',
};

export function getCategoryDescription(cat: ClassroomCategory): string {
  if (CATEGORY_DESCRIPTIONS[cat.id]) {
    return CATEGORY_DESCRIPTIONS[cat.id];
  }
  return cat.type === 'positive'
    ? 'Recognize positive engagement, effort, or classroom contribution.'
    : 'Behavior correction or reminder to refocus on classroom expectations.';
}

interface CategoryIconProps {
  cat: ClassroomCategory;
  className?: string;
  iconClassName?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  cat,
  className = 'w-10 h-10',
  iconClassName = 'w-5 h-5',
}) => {
  const iconStr = (cat.icon || '').trim();
  const IconComponent = LUCIDE_ICON_MAP[iconStr] || CATEGORY_DEFAULT_ICONS[cat.id];

  if (IconComponent) {
    return (
      <div className={`rounded-xl flex items-center justify-center shrink-0 ${className}`}>
        <IconComponent className={iconClassName} />
      </div>
    );
  }

  // If icon is an emoji
  if (iconStr && /\p{Emoji}/u.test(iconStr)) {
    return (
      <div className={`rounded-xl flex items-center justify-center shrink-0 ${className} text-lg`}>
        <span>{iconStr}</span>
      </div>
    );
  }

  // Fallback icon based on category type
  const Fallback = cat.type === 'positive' ? Star : AlertTriangle;
  return (
    <div className={`rounded-xl flex items-center justify-center shrink-0 ${className}`}>
      <Fallback className={iconClassName} />
    </div>
  );
};
