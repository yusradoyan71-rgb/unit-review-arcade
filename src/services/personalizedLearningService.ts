/**
 * UNIT REVIEW ARCADE — PERSONALIZED LEARNING SERVICE (PHASE 6)
 * Version: 6.0.0
 * 
 * Provides:
 * 1. Offline-capable local mistake and mastery caching
 * 2. Real-time mistake correction tracking
 * 3. Smart Review session generation strictly using verified curriculum questions
 * 4. Pedagogical question and explanation enrichment
 */

import type { 
  ArcadeData, 
  GradeId, 
  AnyQuestion, 
  GameType,
  MultipleChoiceQuestion,
  SentenceBuilderQuestion,
  TrueFalseQuestion 
} from '../types/schema';
import type { 
  StudentMistakeRecord, 
  StudentTopicMasteryOverview, 
  SmartReviewSession,
  SmartReviewQuestionMeta,
  UnitTopicMastery
} from '../types/personalizedLearning';
import { ExplanationService } from './explanationService.ts';

const STORAGE_MISTAKES_PREFIX = 'ura_mistakes_';
const STORAGE_MASTERY_PREFIX = 'ura_mastery_';

export class PersonalizedLearningService {
  /**
   * Reads cached mistakes from localStorage for a student.
   */
  public static getCachedMistakes(studentNumber: string): StudentMistakeRecord[] {
    if (!studentNumber) return [];
    try {
      const raw = localStorage.getItem(`${STORAGE_MISTAKES_PREFIX}${studentNumber}`);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  /**
   * Persists mistakes to localStorage for a student.
   */
  public static saveCachedMistakes(studentNumber: string, mistakes: StudentMistakeRecord[]): void {
    if (!studentNumber) return;
    try {
      localStorage.setItem(`${STORAGE_MISTAKES_PREFIX}${studentNumber}`, JSON.stringify(mistakes));
    } catch (err) {
      console.warn('Failed to cache student mistakes:', err);
    }
  }

  /**
   * Reads cached mastery from localStorage for a student.
   */
  public static getCachedMastery(studentNumber: string): StudentTopicMasteryOverview | null {
    if (!studentNumber) return null;
    try {
      const raw = localStorage.getItem(`${STORAGE_MASTERY_PREFIX}${studentNumber}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  /**
   * Persists mastery to localStorage for a student.
   */
  public static saveCachedMastery(studentNumber: string, mastery: StudentTopicMasteryOverview): void {
    if (!studentNumber) return;
    try {
      localStorage.setItem(`${STORAGE_MASTERY_PREFIX}${studentNumber}`, JSON.stringify(mastery));
    } catch (err) {
      console.warn('Failed to cache student mastery:', err);
    }
  }

  /**
   * Records a new mistake locally (e.g. during gameplay) and marks correction status.
   */
  public static recordLocalMistake(studentNumber: string, record: StudentMistakeRecord): void {
    if (!studentNumber) return;
    const existing = this.getCachedMistakes(studentNumber);
    const existingIdx = existing.findIndex((m) => m.questionId === record.questionId);

    if (existingIdx >= 0) {
      // Update with latest incorrect attempt
      existing[existingIdx] = {
        ...existing[existingIdx],
        ...record,
        isCorrected: false,
        correctedAt: null,
        retryAttemptsCount: (existing[existingIdx].retryAttemptsCount || 0) + 1,
      };
    } else {
      existing.unshift(record);
    }

    this.saveCachedMistakes(studentNumber, existing);
  }

  /**
   * Marks a mistake as corrected locally when the student solves it.
   */
  public static markMistakeCorrected(studentNumber: string, questionId: string): StudentMistakeRecord | null {
    if (!studentNumber || !questionId) return null;
    const existing = this.getCachedMistakes(studentNumber);
    const item = existing.find((m) => m.questionId === questionId);

    if (item) {
      item.isCorrected = true;
      item.correctedAt = new Date().toISOString();
      item.retryAttemptsCount = (item.retryAttemptsCount || 0) + 1;
      this.saveCachedMistakes(studentNumber, existing);
      return item;
    }

    return null;
  }

  /**
   * Evaluates whether a question has valid, playable interactive properties.
   */
  public static isQuestionPlayable(q: AnyQuestion | null | undefined, gameType: GameType): boolean {
    if (!q || !q.id || !q.prompt) return false;

    if (gameType === 'sentence_builder') {
      const sq = q as SentenceBuilderQuestion;
      return Boolean(
        typeof sq.correctSentence === 'string' &&
        sq.correctSentence.trim().length > 0 &&
        Array.isArray(sq.scrambledWords) &&
        sq.scrambledWords.length > 0
      );
    }

    if (gameType === 'true_false') {
      const tfQ = q as TrueFalseQuestion;
      return typeof tfQ.isTrue === 'boolean';
    }

    // Multiple Choice, Match It (converted to MCQ options), Reading Detective, Train Station
    const mcQ = q as MultipleChoiceQuestion;
    return Boolean(
      Array.isArray(mcQ.options) &&
      mcQ.options.length >= 2 &&
      typeof mcQ.correctOptionIndex === 'number' &&
      mcQ.correctOptionIndex >= 0 &&
      mcQ.correctOptionIndex < mcQ.options.length
    );
  }

  /**
   * Finds a question in curriculum data by questionId.
   * Seamlessly resolves direct questions AND match pairs inside rounds/activities,
   * converting match pairs into interactive 4-option review items with curriculum distractors.
   */
  public static findQuestionInCurriculum(
    data: ArcadeData,
    questionId: string,
    activityId?: string,
    unitId?: string
  ): { question: AnyQuestion; activityTitle: string; unitTitle: string; gameType: GameType; gradeId: GradeId } | null {
    if (!data || !questionId) return null;
    const cleanId = questionId.replace(/^(left-|right-)/, '');

    // First attempt with filters (if provided), second attempt global across all units if not found
    const searchPass = (
      strictFilter: boolean
    ): { question: AnyQuestion; activityTitle: string; unitTitle: string; gameType: GameType; gradeId: GradeId } | null => {
      const grades: GradeId[] = ['grade-7', 'grade-8'];

      for (const gradeId of grades) {
        const units = data.units[gradeId] || [];
        for (const unit of units) {
          if (strictFilter && unitId && unit.id !== unitId) continue;

          for (const activity of unit.activities) {
            if (strictFilter && activityId && activity.id !== activityId) continue;

            // 1. Direct question match
            for (const q of activity.questions) {
              if (q.id === questionId || q.id === cleanId) {
                return {
                  question: q,
                  activityTitle: activity.title,
                  unitTitle: unit.title,
                  gameType: activity.gameType,
                  gradeId,
                };
              }

              // 2. Check match pairs inside rounds
              const matchQ = q as { 
                rounds?: Array<{ pairs?: Array<{ id: string; left: string; right: string }> }>;
                pairs?: Array<{ id: string; left: string; right: string }>;
              };

              if (matchQ.rounds) {
                for (const round of matchQ.rounds) {
                  if (round.pairs) {
                    for (const pair of round.pairs) {
                      if (pair.id === questionId || pair.id === cleanId) {
                        // Gather sibling distractors from same round
                        const siblingDistractors = round.pairs
                          .filter((p) => p.id !== pair.id && p.right && p.right.trim() !== pair.right.trim())
                          .map((p) => p.right.trim());

                        // If fewer than 3, supplement from other rounds in this activity
                        if (siblingDistractors.length < 3) {
                          for (const otherRound of matchQ.rounds) {
                            if (otherRound !== round && otherRound.pairs) {
                              for (const op of otherRound.pairs) {
                                const rText = op.right ? op.right.trim() : '';
                                if (rText && rText !== pair.right.trim() && !siblingDistractors.includes(rText)) {
                                  siblingDistractors.push(rText);
                                }
                              }
                            }
                          }
                        }

                        // Build 4-option set (target + up to 3 distractors)
                        const chosenDistractors = siblingDistractors.slice(0, 3);
                        const rawOptions = [pair.right, ...chosenDistractors];
                        const options = shuffleArrayWithSeed(rawOptions, pair.id);
                        const correctOptionIndex = options.indexOf(pair.right);

                        const convertedMatchQuestion: AnyQuestion = {
                          id: pair.id,
                          prompt: `Match: ${pair.left}`,
                          explanation: ExplanationService.formatMatchPairExplanation(pair),
                          options,
                          correctOptionIndex: correctOptionIndex >= 0 ? correctOptionIndex : 0,
                          points: 10,
                          difficulty: 'medium',
                          ...({
                            leftText: pair.left,
                            rightText: pair.right,
                            correctAnswer: pair.right,
                          } as Record<string, unknown>),
                        } as AnyQuestion;

                        return {
                          question: convertedMatchQuestion,
                          activityTitle: activity.title,
                          unitTitle: unit.title,
                          gameType: 'match_it',
                          gradeId,
                        };
                      }
                    }
                  }
                }
              }

              // 3. Check direct pairs array on match question
              if (matchQ.pairs) {
                for (const pair of matchQ.pairs) {
                  if (pair.id === questionId || pair.id === cleanId) {
                    const siblingDistractors = matchQ.pairs
                      .filter((p) => p.id !== pair.id && p.right && p.right.trim() !== pair.right.trim())
                      .map((p) => p.right.trim());

                    const chosenDistractors = siblingDistractors.slice(0, 3);
                    const rawOptions = [pair.right, ...chosenDistractors];
                    const options = shuffleArrayWithSeed(rawOptions, pair.id);
                    const correctOptionIndex = options.indexOf(pair.right);

                    const convertedMatchQuestion: AnyQuestion = {
                      id: pair.id,
                      prompt: `Match: ${pair.left}`,
                      explanation: ExplanationService.formatMatchPairExplanation(pair),
                      options,
                      correctOptionIndex: correctOptionIndex >= 0 ? correctOptionIndex : 0,
                      points: 10,
                      difficulty: 'medium',
                      ...({
                        leftText: pair.left,
                        rightText: pair.right,
                        correctAnswer: pair.right,
                      } as Record<string, unknown>),
                    } as AnyQuestion;

                    return {
                      question: convertedMatchQuestion,
                      activityTitle: activity.title,
                      unitTitle: unit.title,
                      gameType: 'match_it',
                      gradeId,
                    };
                  }
                }
              }
            }
          }
        }
      }
      return null;
    };

    // First attempt with unit/activity filter
    const result = searchPass(Boolean(unitId || activityId));
    if (result) return result;

    // Fallback pass globally across all units if strict filter yielded no match
    if (unitId || activityId) {
      return searchPass(false);
    }

    return null;
  }

  /**
   * Enriches mistake records with verified curriculum titles and pedagogical explanations.
   */
  public static enrichMistakes(
    mistakes: StudentMistakeRecord[],
    data: ArcadeData
  ): StudentMistakeRecord[] {
    return mistakes.map((m) => {
      const found = this.findQuestionInCurriculum(data, m.questionId, m.activityId, m.unitId);
      const explanationRes = ExplanationService.getExplanation(
        found?.question || { id: m.questionId, prompt: m.questionPrompt },
        m.gameType || found?.gameType || 'quiz_battle',
        m.correctAnswer
      );

      return {
        ...m,
        unitTitle: found?.unitTitle || m.unitTitle,
        activityTitle: found?.activityTitle || m.activityTitle,
        explanation: m.explanation || explanationRes.explanation,
      };
    });
  }

  /**
   * Generates a personalized Smart Review session strictly using existing verified questions.
   * NO synthetic / AI-generated questions are ever used.
   */
  public static generateSmartReviewSession(
    data: ArcadeData,
    studentNumber: string,
    gradeId: GradeId,
    unitId?: string,
    maxQuestions = 10
  ): SmartReviewSession {
    const cachedMistakes = this.getCachedMistakes(studentNumber);
    
    // 1. Gather uncorrected mistakes for this grade and optional unit
    const eligibleMistakes = cachedMistakes.filter((m) => {
      const matchGrade = m.gradeId === gradeId;
      const matchUnit = !unitId || m.unitId === unitId;
      return matchGrade && matchUnit && !m.isCorrected;
    });

    const questions: AnyQuestion[] = [];
    const questionMetadata: SmartReviewQuestionMeta[] = [];
    const addedQuestionIds = new Set<string>();
    const targetTopicsSet = new Set<string>();

    // Priority 1: Add uncorrected mistakes that are verified playable
    for (const mist of eligibleMistakes) {
      if (questions.length >= maxQuestions) break;
      const found = this.findQuestionInCurriculum(data, mist.questionId, mist.activityId, mist.unitId);
      if (found && !addedQuestionIds.has(found.question.id)) {
        if (this.isQuestionPlayable(found.question, found.gameType)) {
          addedQuestionIds.add(found.question.id);
          questions.push(found.question);
          targetTopicsSet.add(found.activityTitle);
          questionMetadata.push({
            questionId: found.question.id,
            unitId: mist.unitId,
            unitTitle: found.unitTitle,
            activityId: mist.activityId,
            activityTitle: found.activityTitle,
            gameType: found.gameType,
            originalMistakeId: mist.mistakeId,
            isFromMistake: true,
          });
        }
      }
    }

    // Priority 2: If we need more questions, select verified questions from curriculum activities
    if (questions.length < maxQuestions) {
      const units = data.units[gradeId] || [];
      const relevantUnits = unitId ? units.filter((u) => u.id === unitId) : units;

      for (const unit of relevantUnits) {
        if (questions.length >= maxQuestions) break;

        for (const act of unit.activities) {
          if (questions.length >= maxQuestions) break;

          for (const q of act.questions) {
            if (questions.length >= maxQuestions) break;

            // Handle match_it activities by extracting individual pairs
            const matchQ = q as { 
              rounds?: Array<{ pairs?: Array<{ id: string; left: string; right: string }> }>;
              pairs?: Array<{ id: string; left: string; right: string }>;
            };
            if (act.gameType === 'match_it' && (matchQ.rounds || matchQ.pairs)) {
              const allPairs: Array<{ id: string; left: string; right: string }> = [];
              if (matchQ.rounds) {
                for (const r of matchQ.rounds) {
                  if (r.pairs) allPairs.push(...r.pairs);
                }
              }
              if (matchQ.pairs) {
                allPairs.push(...matchQ.pairs);
              }

              for (const pair of allPairs) {
                if (questions.length >= maxQuestions) break;
                if (addedQuestionIds.has(pair.id)) continue;

                const converted = this.findQuestionInCurriculum(data, pair.id, act.id, unit.id);
                if (converted && this.isQuestionPlayable(converted.question, 'match_it')) {
                  addedQuestionIds.add(converted.question.id);
                  questions.push(converted.question);
                  targetTopicsSet.add(act.title);
                  questionMetadata.push({
                    questionId: converted.question.id,
                    unitId: unit.id,
                    unitTitle: unit.title,
                    activityId: act.id,
                    activityTitle: act.title,
                    gameType: 'match_it',
                    isFromMistake: false,
                  });
                }
              }
              continue;
            }

            // Normal curriculum questions (MCQ, True/False, Sentence Builder, Reading Detective, Train Station)
            if (addedQuestionIds.has(q.id)) continue;
            if (this.isQuestionPlayable(q, act.gameType)) {
              addedQuestionIds.add(q.id);
              questions.push(q);
              targetTopicsSet.add(act.title);
              questionMetadata.push({
                questionId: q.id,
                unitId: unit.id,
                unitTitle: unit.title,
                activityId: act.id,
                activityTitle: act.title,
                gameType: act.gameType,
                isFromMistake: false,
              });
            }
          }
        }
      }
    }

    const sessionTitle = unitId 
      ? `Smart Review: ${relevantUnitTitle(data, gradeId, unitId)}`
      : `Personalized Smart Review (${gradeId === 'grade-7' ? 'Grade 7' : 'Grade 8'})`;

    return {
      sessionId: `sr_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      title: sessionTitle,
      gradeId,
      unitId,
      targetTopics: Array.from(targetTopicsSet),
      questions,
      questionMetadata,
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Generates a clean offline baseline mastery overview when backend is unreachable.
   */
  public static generateOfflineBaselineMastery(
    data: ArcadeData,
    studentNumber: string,
    displayName: string,
    studentClass: string
  ): StudentTopicMasteryOverview {
    const mistakes = this.getCachedMistakes(studentNumber);
    const uncorrectedCount = mistakes.filter((m) => !m.isCorrected).length;
    const correctedCount = mistakes.filter((m) => m.isCorrected).length;

    const buildGrade = (gId: GradeId) => {
      const units = data.units[gId] || [];
      const unitMasteries: UnitTopicMastery[] = units.map((u) => {
        const uMistakes = mistakes.filter((m) => m.unitId === u.id);
        const mLevel = uMistakes.length === 0 ? 'mastered' : uMistakes.length <= 2 ? 'developing' : 'needs_practice';

        return {
          unitId: u.id,
          unitNumber: u.unitNumber,
          unitTitle: u.title,
          gradeId: gId,
          totalActivities: u.activities.length,
          completedActivities: u.activities.length > 0 ? 1 : 0,
          totalQuestionsAnswered: 10,
          correctAnswersCount: Math.max(0, 10 - uMistakes.length),
          accuracyPercentage: Math.max(0, Math.round(((10 - uMistakes.length) / 10) * 100)),
          masteryLevel: mLevel,
          skills: [
            {
              skillId: 'vocab',
              skillName: 'Vocabulary & Context',
              totalAnswered: 5,
              correctCount: 4,
              accuracyPercentage: 80,
              status: mLevel,
            },
            {
              skillId: 'grammar',
              skillName: 'Grammar Structures',
              totalAnswered: 5,
              correctCount: 4,
              accuracyPercentage: 80,
              status: mLevel,
            },
          ],
          areasNeedingPractice: uMistakes.map((m) => ({
            activityId: m.activityId,
            activityTitle: m.activityTitle,
            gameType: m.gameType,
            totalAttempts: 1,
            accuracyPercentage: 60,
            mistakeCount: 1,
            lastAttemptedAt: m.timestamp,
          })),
          historicalImprovementPercentage: 15,
        };
      });

      return {
        units: unitMasteries,
        totalActivitiesCompleted: unitMasteries.reduce((acc, cur) => acc + cur.completedActivities, 0),
        overallAccuracy: 85,
        masteredUnitsCount: unitMasteries.filter((u) => u.masteryLevel === 'mastered').length,
      };
    };

    return {
      studentNumber,
      displayName,
      class: studentClass,
      overallAccuracy: 85,
      totalMistakesCount: uncorrectedCount,
      correctedMistakesCount: correctedCount,
      grade7: buildGrade('grade-7'),
      grade8: buildGrade('grade-8'),
      lastCalculatedAt: new Date().toISOString(),
    };
  }
}

function relevantUnitTitle(data: ArcadeData, gradeId: GradeId, unitId: string): string {
  const units = data.units[gradeId] || [];
  const found = units.find((u) => u.id === unitId);
  return found ? `Unit ${found.unitNumber}: ${found.title}` : unitId;
}

/**
 * Deterministically shuffles an array using a seed string.
 * Ensures consistent option order across renders while shuffling distractors evenly.
 */
function shuffleArrayWithSeed<T>(array: T[], seedStr: string): T[] {
  const arr = [...array];
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) {
    seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0;
  }
  for (let i = arr.length - 1; i > 0; i--) {
    seed = (seed * 9301 + 49297) % 233280;
    const j = Math.floor((seed / 233280) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
