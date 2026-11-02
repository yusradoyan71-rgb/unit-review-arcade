import type { Unit, Activity } from '../../../types/schema';
import { GAME_1_QUESTIONS } from './game1Vocab';
import { GAME_2_ROUNDS } from './game2Match';
import { GAME_3_SENTENCES } from './game3Sentence';
import { GAME_4_STATEMENTS } from './game4TrueFalse';
import { GAME_5_DIALOGUES } from './game5SayItRight';
import { GAME_6_READING_QUESTIONS } from './game6Reading';
import { GAME_7_ULTIMATE_QUESTIONS } from './game7Ultimate';

export const GAME_1_ACTIVITY: Activity = {
  id: 'g8-u1-act1',
  unitId: 'g8-u1',
  title: 'Music Vocabulary Challenge',
  gameType: 'quiz_battle',
  difficulty: 'mixed',
  instructions: 'Identify musical genres, instruments, performers, and descriptive adjectives in realistic contexts.',
  settings: {
    timeLimitSeconds: 25,
    showTimer: true,
    allowRevealAnswer: true,
    pointsPerQuestion: 10,
    shuffleQuestions: false,
  },
  questions: GAME_1_QUESTIONS,
  order: 0,
  createdAt: '2026-11-02T12:00:00.000Z',
  updatedAt: '2026-11-02T12:00:00.000Z',
};

export const GAME_2_ACTIVITY: Activity = {
  id: 'g8-u1-act2',
  unitId: 'g8-u1',
  title: 'Match the Music',
  gameType: 'match_it',
  difficulty: 'mixed',
  instructions: 'Tap or drag cards to pair genres, instruments, adjectives, expressions, and collocations across 6 rounds.',
  settings: {
    timeLimitSeconds: 45,
    showTimer: true,
    allowRevealAnswer: true,
    pointsPerQuestion: 5,
  },
  questions: [
    {
      id: 'g8-u1-act2-rounds',
      prompt: 'Match all 6 rounds of musical pairs',
      rounds: GAME_2_ROUNDS,
    },
  ],
  order: 1,
  createdAt: '2026-11-02T12:00:00.000Z',
  updatedAt: '2026-11-02T12:00:00.000Z',
};

export const GAME_3_ACTIVITY: Activity = {
  id: 'g8-u1-act3',
  unitId: 'g8-u1',
  title: 'Build the Sentence',
  gameType: 'sentence_builder',
  difficulty: 'mixed',
  instructions: 'Arrange the scrambled word tiles to construct grammatically accurate preference, opinion, and comparative statements.',
  settings: {
    timeLimitSeconds: 40,
    showTimer: true,
    allowRevealAnswer: true,
    pointsPerQuestion: 10,
  },
  questions: GAME_3_SENTENCES,
  order: 2,
  createdAt: '2026-11-02T12:00:00.000Z',
  updatedAt: '2026-11-02T12:00:00.000Z',
};

export const GAME_4_ACTIVITY: Activity = {
  id: 'g8-u1-act4',
  unitId: 'g8-u1',
  title: 'Music Fact or Fiction',
  gameType: 'true_false',
  difficulty: 'mixed',
  instructions: 'Read statements about instruments, genres, musical theatre, and grammar rules. Decide if they are True or False.',
  settings: {
    timeLimitSeconds: 20,
    showTimer: true,
    allowRevealAnswer: true,
    pointsPerQuestion: 10,
  },
  questions: GAME_4_STATEMENTS,
  order: 3,
  createdAt: '2026-11-02T12:00:00.000Z',
  updatedAt: '2026-11-02T12:00:00.000Z',
};

export const GAME_5_ACTIVITY: Activity = {
  id: 'g8-u1-act5',
  title: 'Say It Right! Dialogue Challenge',
  gameType: 'quiz_battle',
  unitId: 'g8-u1',
  difficulty: 'mixed',
  instructions: 'Select the most natural and grammatically accurate expression to complete everyday dialogues about music and opinions.',
  settings: {
    timeLimitSeconds: 30,
    showTimer: true,
    allowRevealAnswer: true,
    pointsPerQuestion: 10,
  },
  questions: GAME_5_DIALOGUES,
  order: 4,
  createdAt: '2026-11-02T12:00:00.000Z',
  updatedAt: '2026-11-02T12:00:00.000Z',
};

export const GAME_6_ACTIVITY: Activity = {
  id: 'g8-u1-act6',
  unitId: 'g8-u1',
  title: 'Reading Detective',
  gameType: 'reading_detective',
  difficulty: 'mixed',
  instructions: 'Read the original musical passages and answer the comprehension, vocabulary, and inference questions on the smartboard.',
  settings: {
    timeLimitSeconds: 60,
    showTimer: true,
    allowRevealAnswer: true,
    pointsPerQuestion: 15,
  },
  questions: GAME_6_READING_QUESTIONS,
  order: 5,
  createdAt: '2026-11-02T12:00:00.000Z',
  updatedAt: '2026-11-02T12:00:00.000Z',
};

export const GAME_7_ACTIVITY: Activity = {
  id: 'g8-u1-act7',
  unitId: 'g8-u1',
  title: 'Ultimate Unit Challenge',
  gameType: 'quiz_battle',
  difficulty: 'mixed',
  instructions: 'The ultimate classroom team competition! Test vocabulary, grammar, reading comprehension, and musical knowledge.',
  settings: {
    timeLimitSeconds: 30,
    showTimer: true,
    allowRevealAnswer: true,
    pointsPerQuestion: 10,
  },
  questions: GAME_7_ULTIMATE_QUESTIONS,
  order: 6,
  createdAt: '2026-11-02T12:00:00.000Z',
  updatedAt: '2026-11-02T12:00:00.000Z',
};

export const GRADE_8_UNIT_1: Unit = {
  id: 'g8-u1',
  gradeId: 'grade-8',
  unitNumber: 1,
  title: 'Music Makes the World Go Round',
  description: 'Interactive revision: musical vocabulary, describing music, expressing preferences & opinions, agreeing/disagreeing, grammar structures, and reading comprehension.',
  icon: 'Sparkles',
  colorTheme: 'purple',
  activities: [
    GAME_1_ACTIVITY,
    GAME_2_ACTIVITY,
    GAME_3_ACTIVITY,
    GAME_4_ACTIVITY,
    GAME_5_ACTIVITY,
    GAME_6_ACTIVITY,
    GAME_7_ACTIVITY,
  ],
  order: 0,
  createdAt: '2026-11-02T12:00:00.000Z',
  updatedAt: '2026-11-02T12:00:00.000Z',
};
