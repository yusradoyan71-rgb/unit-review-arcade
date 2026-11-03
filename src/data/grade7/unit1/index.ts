import type { Unit, Activity } from '../../../types/schema';
import { GAME_1_QUESTIONS } from './game1Vocab';
import { GAME_2_ROUNDS } from './game2Match';
import { GAME_3_QUESTIONS } from './game3Grammar';
import { GAME_4_SENTENCES } from './game4Sentence';
import { GAME_5_DIALOGUES } from './game5SayItOnline';
import { GAME_6_STATEMENTS } from './game6TrueFalse';
import { GAME_7_READING_QUESTIONS } from './game7Reading';
import { GAME_8_QUESTIONS } from './game8Ultimate';

export const GAME_1_ACTIVITY: Activity = {
  id: 'g7-u1-act1',
  unitId: 'g7-u1',
  title: 'Digital Vocabulary Quest',
  gameType: 'quiz_battle',
  difficulty: 'mixed',
  instructions: 'Identify social media verbs, application types, digital habits, and word formation in practical everyday contexts.',
  settings: {
    showTimer: false,
    allowRevealAnswer: true,
    pointsPerQuestion: 10,
    shuffleQuestions: false,
  },
  questions: GAME_1_QUESTIONS,
  order: 0,
  createdAt: '2026-11-03T09:00:00.000Z',
  updatedAt: '2026-11-03T09:00:00.000Z',
};

export const GAME_2_ACTIVITY: Activity = {
  id: 'g7-u1-act2',
  unitId: 'g7-u1',
  title: 'Match the Digital World',
  gameType: 'match_it',
  difficulty: 'mixed',
  instructions: 'Tap or drag cards to pair social media verbs, apps, digital habits, word formation, online collocations, and expressions across 6 rounds.',
  settings: {
    showTimer: false,
    allowRevealAnswer: true,
    pointsPerQuestion: 5,
  },
  questions: [
    {
      id: 'g7-u1-act2-rounds',
      prompt: 'Match all 6 rounds of digital pairs',
      rounds: GAME_2_ROUNDS,
    },
  ],
  order: 1,
  createdAt: '2026-11-03T09:00:00.000Z',
  updatedAt: '2026-11-03T09:00:00.000Z',
};

export const GAME_3_ACTIVITY: Activity = {
  id: 'g7-u1-act3',
  unitId: 'g7-u1',
  title: 'Grammar Challenge',
  gameType: 'quiz_battle',
  difficulty: 'mixed',
  instructions: 'Master Present Simple, Present Continuous, stative verbs, gerunds, infinitives, and adverbs of frequency.',
  settings: {
    showTimer: false,
    allowRevealAnswer: true,
    pointsPerQuestion: 10,
    shuffleQuestions: false,
  },
  questions: GAME_3_QUESTIONS,
  order: 2,
  createdAt: '2026-11-03T09:00:00.000Z',
  updatedAt: '2026-11-03T09:00:00.000Z',
};

export const GAME_4_ACTIVITY: Activity = {
  id: 'g7-u1-act4',
  unitId: 'g7-u1',
  title: 'Build the Sentence',
  gameType: 'sentence_builder',
  difficulty: 'mixed',
  instructions: 'Arrange scrambled word tiles to construct grammatically accurate sentences about digital routines, technology, and opinions.',
  settings: {
    showTimer: false,
    allowRevealAnswer: true,
    pointsPerQuestion: 10,
  },
  questions: GAME_4_SENTENCES,
  order: 3,
  createdAt: '2026-11-03T09:00:00.000Z',
  updatedAt: '2026-11-03T09:00:00.000Z',
};

export const GAME_5_ACTIVITY: Activity = {
  id: 'g7-u1-act5',
  unitId: 'g7-u1',
  title: 'Say It Online! Dialogue Challenge',
  gameType: 'quiz_battle',
  difficulty: 'mixed',
  instructions: 'Select the most natural and polite responses in realistic teenage dialogues about opinions, digital habits, and online communication.',
  settings: {
    showTimer: false,
    allowRevealAnswer: true,
    pointsPerQuestion: 10,
  },
  questions: GAME_5_DIALOGUES,
  order: 4,
  createdAt: '2026-11-03T09:00:00.000Z',
  updatedAt: '2026-11-03T09:00:00.000Z',
};

export const GAME_6_ACTIVITY: Activity = {
  id: 'g7-u1-act6',
  unitId: 'g7-u1',
  title: 'Digital Fact or Fiction',
  gameType: 'true_false',
  difficulty: 'mixed',
  instructions: 'Read statements about digital vocabulary, online safety, grammar accuracy, and technology. Decide if they are True or False.',
  settings: {
    showTimer: false,
    allowRevealAnswer: true,
    pointsPerQuestion: 10,
  },
  questions: GAME_6_STATEMENTS,
  order: 5,
  createdAt: '2026-11-03T09:00:00.000Z',
  updatedAt: '2026-11-03T09:00:00.000Z',
};

export const GAME_7_ACTIVITY: Activity = {
  id: 'g7-u1-act7',
  unitId: 'g7-u1',
  title: 'Reading Detective',
  gameType: 'reading_detective',
  difficulty: 'mixed',
  instructions: 'Read original passages about teenage digital routines, algorithms, detox challenges, and online connections. Answer the comprehension questions.',
  settings: {
    showTimer: false,
    allowRevealAnswer: true,
    pointsPerQuestion: 15,
  },
  questions: GAME_7_READING_QUESTIONS,
  order: 6,
  createdAt: '2026-11-03T09:00:00.000Z',
  updatedAt: '2026-11-03T09:00:00.000Z',
};

export const GAME_8_ACTIVITY: Activity = {
  id: 'g7-u1-act8',
  unitId: 'g7-u1',
  title: 'Ultimate Life Online Challenge',
  gameType: 'quiz_battle',
  difficulty: 'mixed',
  instructions: 'The ultimate classroom team competition! Test vocabulary, grammar, digital citizenship, reading comprehension, and opinions.',
  settings: {
    showTimer: false,
    allowRevealAnswer: true,
    pointsPerQuestion: 10,
  },
  questions: GAME_8_QUESTIONS,
  order: 7,
  createdAt: '2026-11-03T09:00:00.000Z',
  updatedAt: '2026-11-03T09:00:00.000Z',
};

export const GRADE_7_UNIT_1: Unit = {
  id: 'g7-u1',
  gradeId: 'grade-7',
  unitNumber: 1,
  title: 'Life Online',
  description: 'Interactive revision: social media vocabulary, technology & apps, digital habits, word formation, Present Simple vs Continuous, stative verbs, gerunds & infinitives, opinions, and reading comprehension.',
  icon: 'Globe',
  colorTheme: 'blue',
  activities: [
    GAME_1_ACTIVITY,
    GAME_2_ACTIVITY,
    GAME_3_ACTIVITY,
    GAME_4_ACTIVITY,
    GAME_5_ACTIVITY,
    GAME_6_ACTIVITY,
    GAME_7_ACTIVITY,
    GAME_8_ACTIVITY,
  ],
  order: 0,
  createdAt: '2026-11-03T09:00:00.000Z',
  updatedAt: '2026-11-03T09:00:00.000Z',
};
