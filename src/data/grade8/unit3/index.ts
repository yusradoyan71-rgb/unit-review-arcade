import type { Unit, Activity } from '../../../types/schema';
import { GAME_1_QUESTIONS } from './game1Vocab';
import { GAME_2_ROUNDS } from './game2Match';
import { GAME_3_QUESTIONS } from './game3Suggestions';
import { GAME_4_QUESTIONS } from './game4Station';
import { GAME_5_SENTENCES } from './game5Sentence';
import { GAME_6_STATEMENTS } from './game6TrueFalse';
import { GAME_7_READING_QUESTIONS } from './game7Reading';
import { GAME_8_QUESTIONS } from './game8Ultimate';

export const GAME_1_ACTIVITY: Activity = {
  id: 'g8-u3-act1',
  unitId: 'g8-u3',
  title: 'London Vocabulary Quest',
  gameType: 'quiz_battle',
  difficulty: 'mixed',
  instructions: 'Explore places in a town, London landmarks, city adjectives, and urban activities in realistic contexts.',
  settings: {
    showTimer: false,
    allowRevealAnswer: true,
    pointsPerQuestion: 10,
    shuffleQuestions: false,
  },
  questions: GAME_1_QUESTIONS,
  order: 0,
  createdAt: '2026-11-02T15:00:00.000Z',
  updatedAt: '2026-11-02T15:00:00.000Z',
};

export const GAME_2_ACTIVITY: Activity = {
  id: 'g8-u3-act2',
  unitId: 'g8-u3',
  title: 'Match the City',
  gameType: 'match_it',
  difficulty: 'mixed',
  instructions: 'Match town places, famous London landmarks, city adjectives, activities, train station terms, and suggestions across 6 rounds.',
  settings: {
    showTimer: false,
    allowRevealAnswer: true,
    pointsPerQuestion: 5,
  },
  questions: [
    {
      id: 'g8-u3-act2-rounds',
      prompt: 'Match all 6 rounds of city, London, and travel pairs',
      rounds: GAME_2_ROUNDS,
    },
  ],
  order: 1,
  createdAt: '2026-11-02T15:00:00.000Z',
  updatedAt: '2026-11-02T15:00:00.000Z',
};

export const GAME_3_ACTIVITY: Activity = {
  id: 'g8-u3-act3',
  unitId: 'g8-u3',
  title: 'What Should We Do?',
  gameType: 'quiz_battle',
  difficulty: 'mixed',
  instructions: 'Practice making suggestions, agreeing enthusiastically, disagreeing politely, and choosing the correct verb patterns in dialogues.',
  settings: {
    showTimer: false,
    allowRevealAnswer: true,
    pointsPerQuestion: 10,
    shuffleQuestions: false,
  },
  questions: GAME_3_QUESTIONS,
  order: 2,
  createdAt: '2026-11-02T15:00:00.000Z',
  updatedAt: '2026-11-02T15:00:00.000Z',
};

export const GAME_4_ACTIVITY: Activity = {
  id: 'g8-u3-act4',
  unitId: 'g8-u3',
  title: 'At the Train Station',
  gameType: 'quiz_battle',
  difficulty: 'mixed',
  instructions: 'Master train station dialogues, ticket types, platform announcements, fares, and reading simple timetables.',
  settings: {
    showTimer: false,
    allowRevealAnswer: true,
    pointsPerQuestion: 10,
    shuffleQuestions: false,
  },
  questions: GAME_4_QUESTIONS,
  order: 3,
  createdAt: '2026-11-02T15:00:00.000Z',
  updatedAt: '2026-11-02T15:00:00.000Z',
};

export const GAME_5_ACTIVITY: Activity = {
  id: 'g8-u3-act5',
  unitId: 'g8-u3',
  title: 'Build the Conversation',
  gameType: 'sentence_builder',
  difficulty: 'mixed',
  instructions: 'Assemble scrambled words into natural suggestions, polite agreements, station inquiries, and city recommendations.',
  settings: {
    showTimer: false,
    allowRevealAnswer: true,
    pointsPerQuestion: 10,
  },
  questions: GAME_5_SENTENCES,
  order: 4,
  createdAt: '2026-11-02T15:00:00.000Z',
  updatedAt: '2026-11-02T15:00:00.000Z',
};

export const GAME_6_ACTIVITY: Activity = {
  id: 'g8-u3-act6',
  unitId: 'g8-u3',
  title: 'London Fact or Fiction',
  gameType: 'true_false',
  difficulty: 'mixed',
  instructions: 'Evaluate statements about London landmarks, city vocabulary, suggestion rules, train travel, and sustainable urban tourism.',
  settings: {
    showTimer: false,
    allowRevealAnswer: true,
    pointsPerQuestion: 10,
  },
  questions: GAME_6_STATEMENTS,
  order: 5,
  createdAt: '2026-11-02T15:00:00.000Z',
  updatedAt: '2026-11-02T15:00:00.000Z',
};

export const GAME_7_ACTIVITY: Activity = {
  id: 'g8-u3-act7',
  unitId: 'g8-u3',
  title: 'Reading Detective',
  gameType: 'reading_detective',
  difficulty: 'mixed',
  instructions: 'Read 5 original passages about London life, Camden Market, train journeys, and sustainable days out, then answer comprehension questions.',
  settings: {
    showTimer: false,
    allowRevealAnswer: true,
    pointsPerQuestion: 15,
  },
  questions: GAME_7_READING_QUESTIONS,
  order: 6,
  createdAt: '2026-11-02T15:00:00.000Z',
  updatedAt: '2026-11-02T15:00:00.000Z',
};

export const GAME_8_ACTIVITY: Activity = {
  id: 'g8-u3-act8',
  unitId: 'g8-u3',
  title: 'Ultimate London Challenge',
  gameType: 'quiz_battle',
  difficulty: 'mixed',
  instructions: 'The ultimate classroom team battle! Test vocabulary, grammar, suggestions, train travel, and sustainable city tourism.',
  settings: {
    showTimer: false,
    allowRevealAnswer: true,
    pointsPerQuestion: 10,
    shuffleQuestions: false,
  },
  questions: GAME_8_QUESTIONS,
  order: 7,
  createdAt: '2026-11-02T15:00:00.000Z',
  updatedAt: '2026-11-02T15:00:00.000Z',
};

export const GRADE_8_UNIT_3: Unit = {
  id: 'g8-u3',
  gradeId: 'grade-8',
  unitNumber: 3,
  title: 'Travel to Britain',
  description: 'Interactive revision: London landmarks, places in town, describing city life, making suggestions, agreeing and disagreeing politely, train station communication, and sustainable city tourism.',
  icon: 'Landmark',
  colorTheme: 'indigo',
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
  order: 2,
  createdAt: '2026-11-02T15:00:00.000Z',
  updatedAt: '2026-11-02T15:00:00.000Z',
};
