/**
 * UNIT REVIEW ARCADE — QUESTION BANK COMPATIBILITY & CONVERTER LAYER (PHASE 1)
 * Version: 1.0.0
 * 
 * Provides bi-directional conversion and compatibility verification between:
 * - Legacy / Hardcoded `AnyQuestion` schemas (src/types/schema.ts)
 * - Authoritative `QuestionBankItem` schema (src/types/questionBank.ts)
 * 
 * Ensures 100% additive design: Existing question banks are never replaced,
 * and game engines receive the exact object structure they expect.
 */

import type {
  AnyQuestion,
  MultipleChoiceQuestion,
  MatchItQuestion,
  SentenceBuilderQuestion,
  TrueFalseQuestion,
  ReadingPassageQuestion,
  TrainStationQuestion,
  GameType,
  GradeId,
} from '../types/schema';
import type {
  QuestionBankItem,
  QuestionType,
  LearningSection,
  EnglishSkill,
  QuestionDifficulty,
} from '../types/questionBank';

export interface QuestionConversionContext {
  section?: LearningSection;
  gradeId?: GradeId | 'all';
  unitId?: string;
  unitTitle?: string;
  topic?: string;
  skill?: EnglishSkill;
  difficulty?: QuestionDifficulty;
  assignedGameTypes?: GameType[];
  tags?: string[];
}

/**
 * Returns default compatible game engines for a given question type.
 */
export function determineCompatibleGameTypes(qType: QuestionType): GameType[] {
  switch (qType) {
    case 'multiple_choice':
      return ['quiz_battle'];
    case 'match_it':
      return ['match_it'];
    case 'sentence_builder':
      return ['sentence_builder'];
    case 'true_false':
      return ['true_false'];
    case 'reading_passage':
      return ['reading_detective'];
    case 'train_station':
      return ['train_station'];
    case 'vocabulary_item':
      return ['quiz_battle'];
    default:
      return ['quiz_battle'];
  }
}

/**
 * Detects question type from AnyQuestion runtime properties.
 */
export function detectQuestionType(q: AnyQuestion): QuestionType {
  const obj = q as unknown as Record<string, unknown>;
  if ('rounds' in obj || 'pairs' in obj) return 'match_it';
  if ('correctSentence' in obj && 'scrambledWords' in obj) return 'sentence_builder';
  if ('isTrue' in obj) return 'true_false';
  if ('passageText' in obj || 'passageId' in obj) return 'reading_passage';
  if ('roundTitle' in obj || 'highlightTrainId' in obj) return 'train_station';
  if ('targetWord' in obj && 'distractorWords' in obj) return 'vocabulary_item';
  if ('options' in obj && 'correctOptionIndex' in obj) return 'multiple_choice';
  return 'multiple_choice';
}

/**
 * Generates human-readable preview of correct answer for auditing.
 */
export function generateCorrectAnswerPreview(qType: QuestionType, payload: Record<string, unknown>): string {
  switch (qType) {
    case 'multiple_choice':
    case 'reading_passage':
    case 'train_station': {
      const opts = (payload.options as string[]) || [];
      const idx = typeof payload.correctOptionIndex === 'number' ? payload.correctOptionIndex : 0;
      return opts[idx] !== undefined ? `${String.fromCharCode(65 + idx)}) ${opts[idx]}` : 'N/A';
    }
    case 'sentence_builder':
      return String(payload.correctSentence || '');
    case 'true_false':
      return payload.isTrue === true ? 'TRUE' : 'FALSE';
    case 'match_it': {
      const pairs = (payload.pairs as Array<{ left: string; right: string }>) || [];
      if (pairs.length > 0) {
        return pairs.slice(0, 3).map((p) => `${p.left} = ${p.right}`).join('; ');
      }
      return 'Multi-round matching';
    }
    case 'vocabulary_item':
      return String(payload.targetWord || '');
    default:
      return 'N/A';
  }
}

/**
 * Converts an existing hardcoded question into a unified QuestionBankItem.
 */
export function convertAnyQuestionToBankItem(
  q: AnyQuestion,
  ctx?: QuestionConversionContext
): QuestionBankItem {
  const qType = detectQuestionType(q);
  const raw = q as unknown as Record<string, unknown>;

  const payload: Record<string, unknown> = {};

  if (raw.options) payload.options = [...(raw.options as string[])];
  if (raw.correctOptionIndex !== undefined) payload.correctOptionIndex = raw.correctOptionIndex;
  if (raw.pairs) payload.pairs = JSON.parse(JSON.stringify(raw.pairs));
  if (raw.rounds) payload.rounds = JSON.parse(JSON.stringify(raw.rounds));
  if (raw.correctSentence) payload.correctSentence = raw.correctSentence;
  if (raw.scrambledWords) payload.scrambledWords = [...(raw.scrambledWords as string[])];
  if (raw.acceptedAnswers) payload.acceptedAnswers = [...(raw.acceptedAnswers as string[])];
  if (raw.alternativeValidSentences) payload.alternativeValidSentences = [...(raw.alternativeValidSentences as string[])];
  if (raw.isTrue !== undefined) payload.isTrue = raw.isTrue;
  if (raw.passageId) payload.passageId = raw.passageId;
  if (raw.passageTitle) payload.passageTitle = raw.passageTitle;
  if (raw.passageText) payload.passageText = raw.passageText;
  if (raw.targetWord) payload.targetWord = raw.targetWord;
  if (raw.distractorWords) payload.distractorWords = [...(raw.distractorWords as string[])];
  if (raw.round !== undefined) payload.round = raw.round;
  if (raw.roundTitle) payload.roundTitle = raw.roundTitle;
  if (raw.highlightTrainId) payload.highlightTrainId = raw.highlightTrainId;
  if (raw.dialogue) payload.dialogue = JSON.parse(JSON.stringify(raw.dialogue));

  const diff = (raw.difficulty as QuestionDifficulty) || ctx?.difficulty || 'medium';
  const assignedGames = ctx?.assignedGameTypes || determineCompatibleGameTypes(qType);
  const preview = generateCorrectAnswerPreview(qType, payload);

  return {
    id: q.id,
    section: ctx?.section || (ctx?.unitId ? 'unit_review' : 'general_english'),
    gradeId: ctx?.gradeId || 'all',
    unitId: ctx?.unitId,
    unitTitle: ctx?.unitTitle,
    topic: ctx?.topic || 'General Practice',
    skill: ctx?.skill || 'grammar',
    difficulty: diff,
    questionType: qType,
    assignedGameTypes: assignedGames,
    prompt: q.prompt || '',
    payload,
    correctAnswerPreview: preview,
    explanation: q.explanation || '',
    points: q.points || 10,
    tags: ctx?.tags || [],
    status: 'active',
    contentVersion: q.contentVersion || 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Converts a QuestionBankItem back to typed AnyQuestion required by game engines.
 */
export function convertBankItemToAnyQuestion(item: QuestionBankItem): AnyQuestion {
  const base = {
    id: item.id,
    prompt: item.prompt,
    explanation: item.explanation,
    points: item.points,
    difficulty: item.difficulty,
    contentVersion: item.contentVersion,
    audioUrl: item.payload.audioUrl,
    speechText: item.payload.speechText,
    correctTranscript: item.payload.correctTranscript,
    hasAudio: Boolean(item.payload.audioUrl || item.payload.speechText),
  };

  switch (item.questionType) {
    case 'multiple_choice':
      return {
        ...base,
        options: item.payload.options || [],
        correctOptionIndex: item.payload.correctOptionIndex ?? 0,
      } as MultipleChoiceQuestion;

    case 'match_it':
      return {
        ...base,
        pairs: item.payload.pairs,
        rounds: (item.payload as Record<string, unknown>).rounds as MatchItQuestion['rounds'],
      } as MatchItQuestion;

    case 'sentence_builder':
      return {
        ...base,
        correctSentence: item.payload.correctSentence || '',
        scrambledWords: item.payload.scrambledWords || [],
        acceptedAnswers: item.payload.acceptedAnswers,
        alternativeValidSentences: item.payload.alternativeValidSentences,
      } as SentenceBuilderQuestion;

    case 'true_false':
      return {
        ...base,
        isTrue: item.payload.isTrue ?? true,
      } as TrueFalseQuestion;

    case 'reading_passage':
      return {
        ...base,
        passageId: item.payload.passageId || 'passage-1',
        passageTitle: item.payload.passageTitle || 'Reading Passage',
        passageText: item.payload.passageText || '',
        options: item.payload.options || [],
        correctOptionIndex: item.payload.correctOptionIndex ?? 0,
      } as ReadingPassageQuestion;

    case 'train_station':
      return {
        ...base,
        round: item.payload.round ?? 1,
        roundTitle: item.payload.roundTitle || 'Train Station Challenge',
        options: item.payload.options || [],
        correctOptionIndex: item.payload.correctOptionIndex ?? 0,
        highlightTrainId: item.payload.highlightTrainId,
        dialogue: item.payload.dialogue,
      } as TrainStationQuestion;

    default:
      return {
        ...base,
        options: item.payload.options || [],
        correctOptionIndex: item.payload.correctOptionIndex ?? 0,
      } as MultipleChoiceQuestion;
  }
}
