import type { Unit, Activity } from '../../../types/schema';
import { GAME_1_QUESTIONS } from './game1Vocab';
import { GAME_2_ROUNDS } from './game2Match';
import { GAME_3_QUESTIONS } from './game3Grammar';
import { GAME_4_SENTENCES } from './game4Sentence';
import { GAME_5_QUESTIONS } from './game5Troubles';
import { GAME_6_STATEMENTS } from './game6TrueFalse';
import { GAME_7_READING_QUESTIONS } from './game7Reading';
import { GAME_8_QUESTIONS } from './game8Ultimate';

export const GAME_1_ACTIVITY: Activity = {
  id: 'g8-u4-act1',
  unitId: 'g8-u4',
  title: 'Travel Vocabulary Quest',
  gameType: 'quiz_battle',
  difficulty: 'mixed',
  instructions: 'Identify travel nouns, transportation modes, prepositions, phrasal verbs, and descriptive adjectives in realistic contexts.',
  settings: {
    showTimer: false,
    allowRevealAnswer: true,
    pointsPerQuestion: 10,
    shuffleQuestions: false,
  },
  questions: GAME_1_QUESTIONS,
  order: 0,
  createdAt: '2026-11-02T16:00:00.000Z',
  updatedAt: '2026-11-02T16:00:00.000Z',
};

export const GAME_2_ACTIVITY: Activity = {
  id: 'g8-u4-act2',
  unitId: 'g8-u4',
  title: 'Match the Journey',
  gameType: 'match_it',
  difficulty: 'mixed',
  instructions: 'Pair travel terms, transportation methods, verbs, problems, adjectives, and collocations across 6 interactive rounds.',
  settings: {
    showTimer: false,
    allowRevealAnswer: true,
    pointsPerQuestion: 5,
  },
  questions: [
    {
      id: 'g8-u4-act2-rounds',
      prompt: 'Match all 6 rounds of travel and adventure pairs',
      rounds: GAME_2_ROUNDS,
    },
  ],
  order: 1,
  createdAt: '2026-11-02T16:00:00.000Z',
  updatedAt: '2026-11-02T16:00:00.000Z',
};

export const GAME_3_ACTIVITY: Activity = {
  id: 'g8-u4-act3',
  unitId: 'g8-u4',
  title: 'Travel Grammar Challenge',
  gameType: 'quiz_battle',
  difficulty: 'mixed',
  instructions: 'Master Past Simple regular and irregular verbs, negatives, question formation, sequencing words, and narrative structures.',
  settings: {
    showTimer: false,
    allowRevealAnswer: true,
    pointsPerQuestion: 10,
    shuffleQuestions: false,
  },
  questions: GAME_3_QUESTIONS,
  order: 2,
  createdAt: '2026-11-02T16:00:00.000Z',
  updatedAt: '2026-11-02T16:00:00.000Z',
};

export const GAME_4_ACTIVITY: Activity = {
  id: 'g8-u4-act4',
  unitId: 'g8-u4',
  title: 'Build the Travel Story',
  gameType: 'sentence_builder',
  difficulty: 'mixed',
  instructions: 'Arrange scrambled word tiles to construct grammatically accurate travel experiences, questions, and narrative sequences.',
  settings: {
    showTimer: false,
    allowRevealAnswer: true,
    pointsPerQuestion: 10,
  },
  questions: GAME_4_SENTENCES,
  order: 3,
  createdAt: '2026-11-02T16:00:00.000Z',
  updatedAt: '2026-11-02T16:00:00.000Z',
};

export const GAME_5_ACTIVITY: Activity = {
  id: 'g8-u4-act5',
  unitId: 'g8-u4',
  title: 'Travel Troubles',
  gameType: 'quiz_battle',
  difficulty: 'mixed',
  instructions: 'Analyse realistic travel dilemmas, unexpected emergencies, and travel challenges. Choose the best response or explanation.',
  settings: {
    showTimer: false,
    allowRevealAnswer: true,
    pointsPerQuestion: 10,
    shuffleQuestions: false,
  },
  questions: GAME_5_QUESTIONS,
  order: 4,
  createdAt: '2026-11-02T16:00:00.000Z',
  updatedAt: '2026-11-02T16:00:00.000Z',
};

export const GAME_6_ACTIVITY: Activity = {
  id: 'g8-u4-act6',
  unitId: 'g8-u4',
  title: 'Fact or Fiction',
  gameType: 'true_false',
  difficulty: 'mixed',
  instructions: 'Decide whether statements about travel vocabulary, transportation rules, grammar, Mongolia, and sustainable tourism are True or False.',
  settings: {
    showTimer: false,
    allowRevealAnswer: true,
    pointsPerQuestion: 10,
  },
  questions: GAME_6_STATEMENTS,
  order: 5,
  createdAt: '2026-11-02T16:00:00.000Z',
  updatedAt: '2026-11-02T16:00:00.000Z',
};

export const GAME_7_ACTIVITY: Activity = {
  id: 'g8-u4-act7',
  unitId: 'g8-u4',
  title: 'Reading Detective',
  gameType: 'reading_detective',
  difficulty: 'mixed',
  instructions: 'Read 5 original adventure passages and answer comprehension, vocabulary, sequencing, and inference questions with unlimited time.',
  settings: {
    showTimer: false,
    allowRevealAnswer: true,
    pointsPerQuestion: 15,
  },
  questions: GAME_7_READING_QUESTIONS,
  order: 6,
  createdAt: '2026-11-02T16:00:00.000Z',
  updatedAt: '2026-11-02T16:00:00.000Z',
};

export const GAME_8_ACTIVITY: Activity = {
  id: 'g8-u4-act8',
  unitId: 'g8-u4',
  title: 'Ultimate Adventure Challenge',
  gameType: 'quiz_battle',
  difficulty: 'mixed',
  instructions: 'The ultimate classroom team challenge! Test travel vocabulary, past grammar, travel troubles, Mongolia, and sustainable tourism.',
  settings: {
    showTimer: false,
    allowRevealAnswer: true,
    pointsPerQuestion: 10,
    shuffleQuestions: false,
  },
  questions: GAME_8_QUESTIONS,
  order: 7,
  createdAt: '2026-11-02T16:00:00.000Z',
  updatedAt: '2026-11-02T16:00:00.000Z',
};

export const GRADE_8_UNIT_4: Unit = {
  id: 'g8-u4',
  gradeId: 'grade-8',
  unitNumber: 4,
  title: 'What an Adventure!',
  description: 'Interactive revision: travel experiences, travel verbs, unexpected journey problems, storytelling, Mongolia, and sustainable travel.',
  icon: 'Globe',
  colorTheme: 'emerald',
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
  order: 3,
  createdAt: '2026-11-02T16:00:00.000Z',
  updatedAt: '2026-11-02T16:00:00.000Z',
};
