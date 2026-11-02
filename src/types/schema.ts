/**
 * UNIT REVIEW ARCADE - CONTENT & GAME DATA SCHEMAS
 * Version: 1.1.0
 * 
 * Hierarchy: Grade -> Unit -> Activity -> Questions
 */

export type GradeId = 'grade-7' | 'grade-8';

export type GameType = 
  | 'quiz_battle' 
  | 'match_it' 
  | 'sentence_builder' 
  | 'true_false'
  | 'reading_detective';

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
  reading_detective: {
    id: 'reading_detective',
    title: 'Reading Detective',
    shortDesc: 'Passage comprehension challenge with side-by-side text analysis.',
    iconName: 'BookMarked',
    accentColor: '#06b6d4', // cyan-500
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
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
  difficulty?: 'easy' | 'medium' | 'challenging';
}

// Extensible questions for game engines
export interface MultipleChoiceQuestion extends BaseQuestion {
  options: string[];
  correctOptionIndex: number;
}

export interface MatchPair {
  id: string;
  left: string;
  right: string;
}

export interface MatchRound {
  roundNumber: number;
  title: string;
  pairs: MatchPair[];
}

export interface MatchItQuestion extends BaseQuestion {
  rounds?: MatchRound[];
  pairs?: MatchPair[];
}

export interface SentenceBuilderQuestion extends BaseQuestion {
  correctSentence: string;
  scrambledWords: string[];
  acceptedAnswers?: string[];
  alternativeValidSentences?: string[];
}

export interface TrueFalseQuestion extends BaseQuestion {
  isTrue: boolean;
}

export interface ReadingPassageQuestion extends BaseQuestion {
  passageId: string;
  passageTitle: string;
  passageText: string;
  options: string[];
  correctOptionIndex: number;
}

export type AnyQuestion = 
  | MultipleChoiceQuestion 
  | MatchItQuestion 
  | SentenceBuilderQuestion 
  | TrueFalseQuestion 
  | ReadingPassageQuestion
  | BaseQuestion;

export interface Activity {
  id: string;
  unitId: string;
  title: string;
  gameType: GameType;
  instructions?: string;
  difficulty?: 'easy' | 'medium' | 'challenging' | 'mixed';
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
  version: string;
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
  | { view: 'game-play'; gradeId: GradeId; unitId: string; activityId: string }
  | { view: 'teacher-panel'; initialTab?: 'units' | 'activities' | 'backup'; targetGradeId?: GradeId };
