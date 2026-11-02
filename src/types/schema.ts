/**
 * UNIT REVIEW ARCADE - CONTENT & GAME DATA SCHEMAS
 * Version: 1.0.0
 * 
 * Hierarchy: Grade -> Unit -> Activity -> Questions
 * Pure architectural schema with zero hardcoded educational content.
 */

export type GradeId = 'grade-7' | 'grade-8';

export type GameType = 
  | 'quiz_battle' 
  | 'match_it' 
  | 'sentence_builder' 
  | 'true_false';

export interface GameTypeMetadata {
  id: GameType;
  title: string;
  shortDesc: string;
  iconName: string;
  accentColor: string;
  badgeColor: string;
}

export const GAME_TYPE_METADATA: Record<GameType, GameTypeMetadata> = {
  quiz_battle: {
    id: 'quiz_battle',
    title: 'Quiz Battle',
    shortDesc: 'Fast-paced multiple choice challenge with timer and instant answer reveal.',
    iconName: 'HelpCircle',
    accentColor: '#38bdf8', // sky-400
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
  },
  match_it: {
    id: 'match_it',
    title: 'Match It!',
    shortDesc: 'Interactive card matching pairs with tap & drag visual feedback.',
    iconName: 'Layers',
    accentColor: '#a855f7', // purple-500
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  },
  sentence_builder: {
    id: 'sentence_builder',
    title: 'Sentence Builder',
    shortDesc: 'Unscramble and snap interactive word tiles into grammatical sentences.',
    iconName: 'AlignLeft',
    accentColor: '#f59e0b', // amber-500
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  },
  true_false: {
    id: 'true_false',
    title: 'True or False',
    shortDesc: 'Rapid-fire binary decision rounds with animated classroom feedback.',
    iconName: 'CheckCircle2',
    accentColor: '#10b981', // emerald-500
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  },
};

export interface ActivitySettings {
  timeLimitSeconds?: number;
  showTimer?: boolean;
  shuffleQuestions?: boolean;
  allowRevealAnswer?: boolean;
  pointsPerQuestion?: number;
}

export interface BaseQuestion {
  id: string;
  prompt: string;
  explanation?: string;
  points?: number;
}

// Extensible questions for Phase 2 game engines
export interface MultipleChoiceQuestion extends BaseQuestion {
  options: string[];
  correctOptionIndex: number;
}

export interface MatchPairQuestion extends BaseQuestion {
  pairs: Array<{
    id: string;
    left: string;
    right: string;
  }>;
}

export interface SentenceBuilderQuestion extends BaseQuestion {
  correctSentence: string;
  scrambledWords: string[];
}

export interface TrueFalseQuestion extends BaseQuestion {
  isTrue: boolean;
}

export type AnyQuestion = 
  | MultipleChoiceQuestion 
  | MatchPairQuestion 
  | SentenceBuilderQuestion 
  | TrueFalseQuestion 
  | BaseQuestion;

export interface Activity {
  id: string;
  unitId: string;
  title: string;
  gameType: GameType;
  instructions?: string;
  settings: ActivitySettings;
  questions: AnyQuestion[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Unit {
  id: string;
  gradeId: GradeId;
  unitNumber: number;
  title: string;
  description?: string;
  icon?: string;
  colorTheme?: string;
  activities: Activity[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ArcadeData {
  version: string; // e.g. "1.0.0"
  units: {
    'grade-7': Unit[];
    'grade-8': Unit[];
  };
  lastModified: string;
}

export type NavigationTarget =
  | { view: 'home' }
  | { view: 'unit-library'; gradeId: GradeId }
  | { view: 'unit-dashboard'; gradeId: GradeId; unitId: string }
  | { view: 'teacher-panel'; initialTab?: 'units' | 'activities' | 'backup'; targetGradeId?: GradeId };
