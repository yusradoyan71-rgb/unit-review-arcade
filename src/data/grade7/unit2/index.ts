import type { Unit, Activity } from '../../../types/schema';
import { GAME_1_QUESTIONS } from './game1Vocab';
import { GAME_2_ROUNDS } from './game2Match';
import { GAME_3_QUESTIONS } from './game3PastTense';
import { GAME_4_SENTENCES } from './game4Sentence';
import { GAME_5_QUESTIONS } from './game5Wildlife';
import { GAME_6_DIALOGUES } from './game6Emergency';
import { GAME_7_STATEMENTS } from './game7TrueFalse';
import { GAME_8_READING_QUESTIONS } from './game8Reading';
import { GAME_9_QUESTIONS } from './game9UsedTo';
import { GAME_10_QUESTIONS } from './game10Ultimate';

export const GAME_1_ACTIVITY: Activity = {
  id: 'g7-u2-act1',
  unitId: 'g7-u2',
  title: 'Disaster Vocabulary Quest',
  gameType: 'quiz_battle',
  difficulty: 'mixed',
  instructions: 'Identify natural disasters, extreme weather, disaster verbs, and irregular past forms in realistic emergency contexts.',
  settings: {
    showTimer: false,
    allowRevealAnswer: true,
    pointsPerQuestion: 10,
    shuffleQuestions: false,
  },
  questions: GAME_1_QUESTIONS,
  order: 0,
  createdAt: '2026-11-03T11:00:00.000Z',
  updatedAt: '2026-11-03T11:00:00.000Z',
};

export const GAME_2_ACTIVITY: Activity = {
  id: 'g7-u2-act2',
  unitId: 'g7-u2',
  title: 'Match the Danger',
  gameType: 'match_it',
  difficulty: 'mixed',
  instructions: 'Pair disasters, disaster verbs, wildlife terms, conservation vocabulary, irregular verbs, and synonyms across 6 interactive rounds.',
  settings: {
    showTimer: false,
    allowRevealAnswer: true,
    pointsPerQuestion: 5,
  },
  questions: [
    {
      id: 'g7-u2-act2-rounds',
      prompt: 'Match all 6 rounds of disaster and wildlife pairs',
      rounds: GAME_2_ROUNDS,
    },
  ],
  order: 1,
  createdAt: '2026-11-03T11:00:00.000Z',
  updatedAt: '2026-11-03T11:00:00.000Z',
};

export const GAME_3_ACTIVITY: Activity = {
  id: 'g7-u2-act3',
  unitId: 'g7-u2',
  title: 'Past Tense Challenge',
  gameType: 'quiz_battle',
  difficulty: 'mixed',
  instructions: 'Master Past Simple, Past Continuous interrupted actions, and Past Perfect sequence of events.',
  settings: {
    showTimer: false,
    allowRevealAnswer: true,
    pointsPerQuestion: 10,
    shuffleQuestions: false,
  },
  questions: GAME_3_QUESTIONS,
  order: 2,
  createdAt: '2026-11-03T11:00:00.000Z',
  updatedAt: '2026-11-03T11:00:00.000Z',
};

export const GAME_4_ACTIVITY: Activity = {
  id: 'g7-u2-act4',
  unitId: 'g7-u2',
  title: 'Build the Rescue Sentence',
  gameType: 'sentence_builder',
  difficulty: 'mixed',
  instructions: 'Arrange scrambled word tiles to construct grammatically accurate sentences about emergency rescues, past routines, and conservation.',
  settings: {
    showTimer: false,
    allowRevealAnswer: true,
    pointsPerQuestion: 10,
  },
  questions: GAME_4_SENTENCES,
  order: 3,
  createdAt: '2026-11-03T11:00:00.000Z',
  updatedAt: '2026-11-03T11:00:00.000Z',
};

export const GAME_5_ACTIVITY: Activity = {
  id: 'g7-u2-act5',
  unitId: 'g7-u2',
  title: 'Wildlife Rescue Mission',
  gameType: 'quiz_battle',
  difficulty: 'mixed',
  instructions: 'Protect sun bears, pangolins, tigers, and rhinos. Learn about habitats, deforestation, poachers, and conservation centres.',
  settings: {
    showTimer: false,
    allowRevealAnswer: true,
    pointsPerQuestion: 10,
  },
  questions: GAME_5_QUESTIONS,
  order: 4,
  createdAt: '2026-11-03T11:00:00.000Z',
  updatedAt: '2026-11-03T11:00:00.000Z',
};

export const GAME_6_ACTIVITY: Activity = {
  id: 'g7-u2-act6',
  unitId: 'g7-u2',
  title: 'Emergency Call Challenge',
  gameType: 'quiz_battle',
  difficulty: 'mixed',
  instructions: 'Complete emergency call dialogues (112), request the right service, state your location, and follow life-saving instructions.',
  settings: {
    showTimer: false,
    allowRevealAnswer: true,
    pointsPerQuestion: 10,
  },
  questions: GAME_6_DIALOGUES,
  order: 5,
  createdAt: '2026-11-03T11:00:00.000Z',
  updatedAt: '2026-11-03T11:00:00.000Z',
};

export const GAME_7_ACTIVITY: Activity = {
  id: 'g7-u2-act7',
  unitId: 'g7-u2',
  title: 'Danger: True or False',
  gameType: 'true_false',
  difficulty: 'mixed',
  instructions: 'Decide whether statements about natural disasters, wildlife protection, grammar rules, and safety drills are True or False.',
  settings: {
    showTimer: false,
    allowRevealAnswer: true,
    pointsPerQuestion: 10,
  },
  questions: GAME_7_STATEMENTS,
  order: 6,
  createdAt: '2026-11-03T11:00:00.000Z',
  updatedAt: '2026-11-03T11:00:00.000Z',
};

export const GAME_8_ACTIVITY: Activity = {
  id: 'g7-u2-act8',
  unitId: 'g7-u2',
  title: 'Reading Detective',
  gameType: 'reading_detective',
  difficulty: 'mixed',
  instructions: 'Read original passages about animals before tsunamis, mountain thunderstorm rescues, sun bear sanctuaries, and rainforest survival.',
  settings: {
    showTimer: false,
    allowRevealAnswer: true,
    pointsPerQuestion: 15,
  },
  questions: GAME_8_READING_QUESTIONS,
  order: 7,
  createdAt: '2026-11-03T11:00:00.000Z',
  updatedAt: '2026-11-03T11:00:00.000Z',
};

export const GAME_9_ACTIVITY: Activity = {
  id: 'g7-u2-act9',
  unitId: 'g7-u2',
  title: 'Used To or Not?',
  gameType: 'quiz_battle',
  difficulty: 'mixed',
  instructions: 'Master the differences between "used to" (habits/states), "would" (repeated past actions), and "be used to" (accustomed to).',
  settings: {
    showTimer: false,
    allowRevealAnswer: true,
    pointsPerQuestion: 10,
  },
  questions: GAME_9_QUESTIONS,
  order: 8,
  createdAt: '2026-11-03T11:00:00.000Z',
  updatedAt: '2026-11-03T11:00:00.000Z',
};

export const GAME_10_ACTIVITY: Activity = {
  id: 'g7-u2-act10',
  unitId: 'g7-u2',
  title: 'Ultimate Danger Challenge',
  gameType: 'quiz_battle',
  difficulty: 'mixed',
  instructions: 'The ultimate classroom team competition! Test disasters, wildlife conservation, past tenses, emergency procedures, and vocabulary.',
  settings: {
    showTimer: false,
    allowRevealAnswer: true,
    pointsPerQuestion: 10,
  },
  questions: GAME_10_QUESTIONS,
  order: 9,
  createdAt: '2026-11-03T11:00:00.000Z',
  updatedAt: '2026-11-03T11:00:00.000Z',
};

export const GRADE_7_UNIT_2: Unit = {
  id: 'g7-u2',
  gradeId: 'grade-7',
  unitNumber: 2,
  title: 'In and Out of Danger',
  description: 'Interactive revision: natural disasters, extreme weather, wildlife conservation & endangered species, Past Simple, Past Continuous, Past Perfect, Used to / Would / Be used to, and emergency calls.',
  icon: 'Flame',
  colorTheme: 'amber',
  activities: [
    GAME_1_ACTIVITY,
    GAME_2_ACTIVITY,
    GAME_3_ACTIVITY,
    GAME_4_ACTIVITY,
    GAME_5_ACTIVITY,
    GAME_6_ACTIVITY,
    GAME_7_ACTIVITY,
    GAME_8_ACTIVITY,
    GAME_9_ACTIVITY,
    GAME_10_ACTIVITY,
  ],
  order: 1,
  createdAt: '2026-11-03T11:00:00.000Z',
  updatedAt: '2026-11-03T11:00:00.000Z',
};
