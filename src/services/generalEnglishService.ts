/**
 * UNIT REVIEW ARCADE — GENERAL ENGLISH SERVICE (PHASE 4)
 * Version: 4.0.0
 * 
 * Provides topic indexing, question retrieval, and runtime Activity generation
 * for General English (Grade 7 & Grade 8), as well as configurable Mixed Practice
 * blending with existing Unit Review curriculum.
 * 
 * Operates strictly with locally stored starter content (320 items);
 * zero network requests, zero modifications to production Google Sheets.
 */

import type { GradeId, GameType, Activity, Unit, AnyQuestion } from '../types/schema';
import type { QuestionBankItem, EnglishSkill } from '../types/questionBank';
import {
  GRADE_7_STARTER_QUESTIONS,
  GRADE_8_STARTER_QUESTIONS,
} from '../data/generalEnglish';
import { convertBankItemToAnyQuestion } from '../utils/questionBankCompat';

export interface GeneralEnglishTopic {
  id: string;
  gradeId: GradeId;
  skill: EnglishSkill;
  title: string;
  description: string;
  cefrLevel: string;
  questionCount: number;
  compatibleGameTypes: GameType[];
  passageId?: string;
  audioTheme?: string;
  questions: QuestionBankItem[];
}

export type MixedPracticeRatio = '50/50' | '70/30' | '30/70';

export interface MixedPracticeConfig {
  gradeId: GradeId;
  gameType: GameType;
  ratio: MixedPracticeRatio;
  totalQuestions: number;
}

// Helper to determine CEFR level for a topic
function determineCefrLevel(gradeId: GradeId, skill: EnglishSkill, _topicName: string): string {
  if (gradeId === 'grade-7') {
    if (skill === 'reading') return 'A1+ to A2';
    if (skill === 'listening') return 'A1+';
    return 'A1 to A2';
  } else {
    if (skill === 'reading') return 'A2+ to B1-';
    if (skill === 'listening') return 'A2 to B1-';
    return 'A2+ to B1-';
  }
}

// Generate a clean slug ID from title
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export const GeneralEnglishService = {
  /**
   * Returns all starter questions for a specific grade.
   */
  getQuestionsForGrade(gradeId: GradeId): QuestionBankItem[] {
    return gradeId === 'grade-7' ? GRADE_7_STARTER_QUESTIONS : GRADE_8_STARTER_QUESTIONS;
  },

  /**
   * Returns all topics for a grade and optional skill.
   */
  getTopics(gradeId: GradeId, skillFilter?: EnglishSkill): GeneralEnglishTopic[] {
    const questions = this.getQuestionsForGrade(gradeId);
    const filtered = skillFilter ? questions.filter((q) => q.skill === skillFilter) : questions;

    // Group questions by skill and topic
    const topicMap = new Map<string, QuestionBankItem[]>();

    filtered.forEach((q) => {
      // For reading, group by passageId if available
      const key = q.skill === 'reading' && q.payload?.passageId
        ? `${q.skill}__${q.payload.passageId}__${q.payload.passageTitle || q.topic}`
        : `${q.skill}__${q.topic}`;

      if (!topicMap.has(key)) {
        topicMap.set(key, []);
      }
      topicMap.get(key)!.push(q);
    });

    const topics: GeneralEnglishTopic[] = [];

    topicMap.forEach((qList) => {
      const first = qList[0];
      const skill = first.skill;
      let title = first.topic;
      let passageId: string | undefined;

      if (skill === 'reading' && first.payload?.passageId) {
        passageId = first.payload.passageId;
        title = first.payload.passageTitle || first.topic;
      }

      // Collect all compatible games across the question group
      const gameTypesSet = new Set<GameType>();
      qList.forEach((q) => {
        (q.assignedGameTypes || []).forEach((gt) => gameTypesSet.add(gt));
      });

      const compatibleGameTypes = Array.from(gameTypesSet);
      if (compatibleGameTypes.length === 0) {
        compatibleGameTypes.push('quiz_battle');
      }

      const id = `ge_${gradeId}_${skill}_${slugify(passageId || title)}`;
      const cefrLevel = determineCefrLevel(gradeId, skill, title);

      let description = `${qList.length} interactive practice questions`;
      if (skill === 'reading') description = `Short passage comprehension (${qList.length} questions)`;
      else if (skill === 'listening') description = `Audio listening & dictation exercises (${qList.length} questions)`;
      else if (skill === 'grammar') description = `Core grammar rules & usage (${qList.length} questions)`;
      else if (skill === 'vocabulary') description = `Thematic vocabulary & collocations (${qList.length} questions)`;

      topics.push({
        id,
        gradeId,
        skill,
        title,
        description,
        cefrLevel,
        questionCount: qList.length,
        compatibleGameTypes,
        passageId,
        questions: qList,
      });
    });

    return topics;
  },

  /**
   * Find a topic by its unique ID.
   */
  getTopicById(topicId: string): GeneralEnglishTopic | null {
    // Search both grades
    const allTopics = [...this.getTopics('grade-7'), ...this.getTopics('grade-8')];
    return allTopics.find((t) => t.id === topicId) || null;
  },

  /**
   * Converts a GeneralEnglishTopic into an ephemeral Activity and Unit for the game engine.
   */
  createActivityForTopic(topic: GeneralEnglishTopic, requestedGameType?: GameType): { activity: Activity; unit: Unit } {
    const gameType: GameType = requestedGameType || topic.compatibleGameTypes[0] || 'quiz_battle';

    // Filter questions compatible with the requested game type
    let matchingQuestions = topic.questions.filter((q) => (q.assignedGameTypes || []).includes(gameType));
    if (matchingQuestions.length === 0) {
      // Fallback: take all questions in topic
      matchingQuestions = topic.questions;
    }

    const convertedQuestions: AnyQuestion[] = matchingQuestions.map((q) => convertBankItemToAnyQuestion(q));

    const activityId = `act_${topic.id}_${gameType}`;
    const unitId = `unit_${topic.id}`;

    const activity: Activity = {
      id: activityId,
      unitId,
      title: `${topic.title} (${topic.skill.toUpperCase()})`,
      gameType,
      instructions: topic.description,
      difficulty: 'medium',
      settings: {
        timeLimitSeconds: 0,
        showTimer: false,
        shuffleQuestions: false,
        allowRevealAnswer: true,
        pointsPerQuestion: 10,
      },
      questions: convertedQuestions,
      order: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const unit: Unit = {
      id: unitId,
      gradeId: topic.gradeId,
      unitNumber: 0,
      title: `General English: ${topic.title}`,
      description: topic.description,
      icon: topic.skill === 'grammar' ? '📘' : topic.skill === 'vocabulary' ? '📙' : topic.skill === 'reading' ? '📗' : '🎧',
      colorTheme: 'cyan',
      activities: [activity],
      order: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return { activity, unit };
  },

  /**
   * Builds an ephemeral Mixed Practice Activity blending Unit Review and General English.
   */
  createMixedPracticeActivity(
    config: MixedPracticeConfig,
    unitReviewActivities: Activity[]
  ): { activity: Activity; unit: Unit; summary: { unitCount: number; generalCount: number; ratio: string } } {
    const { gradeId, gameType, ratio, totalQuestions } = config;

    // Calculate quotas based on ratio
    let unitTarget = Math.round(totalQuestions * 0.5);
    let generalTarget = totalQuestions - unitTarget;

    if (ratio === '70/30') {
      unitTarget = Math.round(totalQuestions * 0.7);
      generalTarget = totalQuestions - unitTarget;
    } else if (ratio === '30/70') {
      unitTarget = Math.round(totalQuestions * 0.3);
      generalTarget = totalQuestions - unitTarget;
    }

    // 1. Gather Unit Review candidate questions
    const matchingUnitActivities = unitReviewActivities.filter((a) => a.gameType === gameType);
    const unitQuestionsPool: AnyQuestion[] = [];
    matchingUnitActivities.forEach((a) => {
      (a.questions || []).forEach((q) => {
        unitQuestionsPool.push({
          ...q,
          prompt: `${q.prompt} [Unit Review]`,
        });
      });
    });

    // 2. Gather General English candidate questions
    const generalQuestions = this.getQuestionsForGrade(gradeId);
    const matchingGeneralBankItems = generalQuestions.filter((q) => (q.assignedGameTypes || []).includes(gameType));
    const generalQuestionsPool: AnyQuestion[] = matchingGeneralBankItems.map((q) => {
      const converted = convertBankItemToAnyQuestion(q);
      return {
        ...converted,
        prompt: `${converted.prompt} [General English]`,
      };
    });

    // Helper: shuffle array
    const shuffle = <T>(arr: T[]): T[] => {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    };

    const shuffledUnit = shuffle(unitQuestionsPool);
    const shuffledGeneral = shuffle(generalQuestionsPool);

    // Clamp quotas to pool sizes
    let finalUnitCount = Math.min(unitTarget, shuffledUnit.length);
    let finalGeneralCount = Math.min(generalTarget, shuffledGeneral.length);

    // If one pool is deficient, attempt to backfill from the other
    if (finalUnitCount < unitTarget && shuffledGeneral.length > finalGeneralCount) {
      finalGeneralCount = Math.min(shuffledGeneral.length, finalGeneralCount + (unitTarget - finalUnitCount));
    } else if (finalGeneralCount < generalTarget && shuffledUnit.length > finalUnitCount) {
      finalUnitCount = Math.min(shuffledUnit.length, finalUnitCount + (generalTarget - finalGeneralCount));
    }

    const selectedUnit = shuffledUnit.slice(0, finalUnitCount);
    const selectedGeneral = shuffledGeneral.slice(0, finalGeneralCount);

    // Interleave questions for balanced experience
    const combinedQuestions: AnyQuestion[] = [];
    const maxLen = Math.max(selectedUnit.length, selectedGeneral.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < selectedUnit.length) combinedQuestions.push(selectedUnit[i]);
      if (i < selectedGeneral.length) combinedQuestions.push(selectedGeneral[i]);
    }

    const activityId = `act_mixed_${gradeId}_${gameType}_${ratio.replace('/', '-')}`;
    const unitId = `unit_mixed_${gradeId}`;

    const activity: Activity = {
      id: activityId,
      unitId,
      title: `Mixed Practice: ${ratio} (${gameType.replace('_', ' ').toUpperCase()})`,
      gameType,
      instructions: `Blended session: ${selectedUnit.length} Unit Review + ${selectedGeneral.length} General English questions.`,
      difficulty: 'mixed',
      settings: {
        timeLimitSeconds: 0,
        showTimer: false,
        shuffleQuestions: false,
        allowRevealAnswer: true,
        pointsPerQuestion: 10,
      },
      questions: combinedQuestions,
      order: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const unit: Unit = {
      id: unitId,
      gradeId,
      unitNumber: 0,
      title: `Mixed Practice (${ratio})`,
      description: 'Integrated practice blending textbook curriculum with skill mastery.',
      icon: '🔀',
      colorTheme: 'amber',
      activities: [activity],
      order: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      activity,
      unit,
      summary: {
        unitCount: selectedUnit.length,
        generalCount: selectedGeneral.length,
        ratio,
      },
    };
  },
};
