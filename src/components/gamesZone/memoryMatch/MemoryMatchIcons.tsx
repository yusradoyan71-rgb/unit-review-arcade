import React from 'react';
import {
  Apple,
  Bed,
  Bike,
  Bird,
  Book,
  Bus,
  Camera,
  Car,
  Cat,
  Cloud,
  Coffee,
  Compass,
  Computer,
  Dog,
  Download,
  Fish,
  Flag,
  Flame,
  Flower,
  Gift,
  Globe,
  Heart,
  Home,
  Key,
  Mail,
  Map,
  Microscope,
  Moon,
  Music,
  Phone,
  Pizza,
  Plane,
  Rocket,
  Scissors,
  Shield,
  Smile,
  Sparkles,
  Sun,
  Telescope,
  Train,
  Trophy,
  Umbrella,
  Utensils,
  Wifi,
} from 'lucide-react';
import { MEMORY_MATCH_ICON_DATA, hasMemoryMatchIcon } from './memoryMatchIconData';

export { MEMORY_MATCH_ICON_DATA, hasMemoryMatchIcon };

const ICON_COMPONENTS: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  dog: Dog,
  cat: Cat,
  bird: Bird,
  fish: Fish,
  sun: Sun,
  moon: Moon,
  star: Sparkles,
  cloud: Cloud,
  flower: Flower,
  tree: Flower,
  book: Book,
  computer: Computer,
  camera: Camera,
  phone: Phone,
  car: Car,
  bus: Bus,
  bicycle: Bike,
  plane: Plane,
  train: Train,
  rocket: Rocket,
  apple: Apple,
  pizza: Pizza,
  coffee: Coffee,
  utensils: Utensils,
  home: Home,
  bed: Bed,
  key: Key,
  trophy: Trophy,
  music: Music,
  gift: Gift,
  umbrella: Umbrella,
  heart: Heart,
  microscope: Microscope,
  telescope: Telescope,
  compass: Compass,
  globe: Globe,
  map: Map,
  flame: Flame,
  flag: Flag,
  shield: Shield,
  scissors: Scissors,
  wifi: Wifi,
  download: Download,
  mail: Mail,
  smile: Smile,
};

interface MemoryMatchIconProps {
  imageRef?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const MemoryMatchIcon: React.FC<MemoryMatchIconProps> = ({
  imageRef,
  size = 'md',
  className = '',
}) => {
  const key = imageRef?.toLowerCase().trim() || '';
  const meta = MEMORY_MATCH_ICON_DATA[key];
  const Component = ICON_COMPONENTS[key];

  if (!meta || !Component) {
    return (
      <div className={`flex items-center justify-center rounded-2xl bg-slate-100 border border-slate-200 text-slate-400 ${className}`}>
        <Sparkles className="w-6 h-6" />
      </div>
    );
  }

  const sizeClasses = {
    sm: 'w-10 h-10 p-2',
    md: 'w-14 h-14 p-3',
    lg: 'w-20 h-20 p-4',
  }[size];

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }[size];

  return (
    <div
      className={`rounded-2xl bg-gradient-to-br ${meta.bgGradient} border-2 ${meta.borderColor} flex items-center justify-center shadow-inner ${sizeClasses} ${className}`}
    >
      <Component className={`${iconSizes} ${meta.iconColor}`} strokeWidth={2.2} />
    </div>
  );
};
