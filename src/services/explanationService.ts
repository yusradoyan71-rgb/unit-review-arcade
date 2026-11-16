/**
 * UNIT REVIEW ARCADE — PEDAGOGICAL ANSWER EXPLANATIONS SERVICE (PHASE 6)
 * Version: 6.0.0
 * 
 * Generates and formats age-appropriate English learning explanations
 * across all six game engines:
 * 1. Quiz Battle (Vocabulary & Grammar Multiple Choice)
 * 2. Match It! (Pair Definitions & Collocations)
 * 3. Sentence Builder (Syntactic Word Order & Time Phrases)
 * 4. True or False (Fact Checking & Reading Statements)
 * 5. Reading Detective (Passage Comprehension & Context Clues)
 * 6. At the Train Station (British Schedules, Fares & Problem Solving)
 */

import type { 
  AnyQuestion, 
  GameType, 
  MultipleChoiceQuestion, 
  MatchPair, 
  SentenceBuilderQuestion, 
  TrueFalseQuestion, 
  ReadingPassageQuestion, 
  TrainStationQuestion 
} from '../types/schema';

export interface ExplanationResult {
  explanation: string;
  ruleCategory?: string;
  keyVocabulary?: string[];
}

export class ExplanationService {
  /**
   * Resolves the most appropriate pedagogical explanation for any question.
   * Prioritizes question-level curated explanations, then falls back to structured
   * pedagogical grammar and vocabulary rules.
   */
  public static getExplanation(
    question: AnyQuestion | null | undefined,
    gameType: GameType,
    correctAnswerText?: string
  ): ExplanationResult {
    if (!question) {
      return {
        explanation: 'Review the correct answer and practice this concept again.',
      };
    }

    // 1. Curated explanation in question definition
    if (question.explanation && question.explanation.trim().length > 0) {
      return {
        explanation: question.explanation.trim(),
        ruleCategory: this.inferRuleCategory(question.prompt, gameType),
      };
    }

    // 2. Engine-specific rule-based fallback
    switch (gameType) {
      case 'quiz_battle':
        return this.generateQuizBattleExplanation(question as MultipleChoiceQuestion, correctAnswerText);

      case 'match_it':
        return this.generateMatchItExplanation(question, correctAnswerText);

      case 'sentence_builder':
        return this.generateSentenceBuilderExplanation(question as SentenceBuilderQuestion, correctAnswerText);

      case 'true_false':
        return this.generateTrueFalseExplanation(question as TrueFalseQuestion, correctAnswerText);

      case 'reading_detective':
        return this.generateReadingExplanation(question as ReadingPassageQuestion, correctAnswerText);

      case 'train_station':
        return this.generateTrainStationExplanation(question as TrainStationQuestion, correctAnswerText);

      default:
        return {
          explanation: correctAnswerText 
            ? `The correct answer is "${correctAnswerText}". Review this topic to master the rule.`
            : 'Check the correct answer and review related vocabulary in this unit.',
        };
    }
  }

  /**
   * Formats a match pair into an educational explanation.
   */
  public static formatMatchPairExplanation(pair: MatchPair): string {
    return `"${pair.left}" correctly pairs with "${pair.right}". Remember this relationship for your vocabulary review.`;
  }

  /**
   * Generates clear explanation for Multiple Choice / Quiz Battle
   */
  private static generateQuizBattleExplanation(
    q: MultipleChoiceQuestion,
    correctText?: string
  ): ExplanationResult {
    const target = correctText || (q.options && q.correctOptionIndex !== undefined ? q.options[q.correctOptionIndex] : '');
    const promptLower = (q.prompt || '').toLowerCase();

    if (promptLower.includes('past') || promptLower.includes('yesterday') || promptLower.includes('ago') || promptLower.includes('last')) {
      return {
        explanation: `We use Past Simple for completed actions in the past. "${target}" is the correct past form for this context.`,
        ruleCategory: 'Past Simple Tense',
      };
    }

    if (promptLower.includes('now') || promptLower.includes('at the moment') || promptLower.includes('right now') || promptLower.includes('look!')) {
      return {
        explanation: `Words like "now" or "at the moment" signal the Present Continuous tense (am/is/are + verb-ing). "${target}" fits this ongoing action.`,
        ruleCategory: 'Present Continuous Tense',
      };
    }

    if (promptLower.includes('always') || promptLower.includes('usually') || promptLower.includes('often') || promptLower.includes('never') || promptLower.includes('every')) {
      return {
        explanation: `Adverbs of frequency and routines use the Present Simple. "${target}" correctly agrees with the subject.`,
        ruleCategory: 'Present Simple & Routines',
      };
    }

    if (promptLower.includes('should') || promptLower.includes('advice') || promptLower.includes('ought to') || promptLower.includes('must')) {
      return {
        explanation: `Modal verbs like "should" and "must" are followed by the base form of the verb. "${target}" expresses the correct degree of obligation or advice.`,
        ruleCategory: 'Modal Verbs for Advice',
      };
    }

    return {
      explanation: target 
        ? `"${target}" is the correct choice that logically completes the sentence.`
        : 'Carefully compare the options and review key unit vocabulary.',
      ruleCategory: 'Vocabulary & Context',
    };
  }

  /**
   * Generates explanation for Match It
   */
  private static generateMatchItExplanation(
    _q: AnyQuestion,
    correctText?: string
  ): ExplanationResult {
    return {
      explanation: correctText
        ? `Correct pair: ${correctText}. Keep practicing to build strong memory connections.`
        : 'Match each term with its exact definition or corresponding counterpart.',
      ruleCategory: 'Vocabulary Collocations',
    };
  }

  /**
   * Generates explanation for Sentence Builder unscramble
   */
  private static generateSentenceBuilderExplanation(
    q: SentenceBuilderQuestion,
    correctText?: string
  ): ExplanationResult {
    const sentence = correctText || q.correctSentence || '';

    // Check sentence features
    if (sentence.includes('?')) {
      return {
        explanation: `In English questions, the auxiliary or question word comes first (e.g. Wh-word + Auxiliary + Subject + Main Verb). Correct sentence: "${sentence}".`,
        ruleCategory: 'Question Word Order',
      };
    }

    if (sentence.toLowerCase().includes('if ') || sentence.toLowerCase().includes('when ')) {
      return {
        explanation: `In conditional and time clauses, connect the condition to the result with a comma when starting with "If" or "When". Correct sentence: "${sentence}".`,
        ruleCategory: 'Complex Sentences',
      };
    }

    return {
      explanation: `Standard English sentence structure follows Subject + Verb + Object + Place + Time. Correct sentence: "${sentence}".`,
      ruleCategory: 'Sentence Architecture',
    };
  }

  /**
   * Generates explanation for True / False questions
   */
  private static generateTrueFalseExplanation(
    q: TrueFalseQuestion,
    _correctText?: string
  ): ExplanationResult {
    const isTrue = q.isTrue;
    return {
      explanation: isTrue
        ? 'This statement is TRUE based on standard English usage and the facts presented in this unit.'
        : 'This statement is FALSE. Pay close attention to negative words, exceptions, or inaccurate details.',
      ruleCategory: 'Statement Verification',
    };
  }

  /**
   * Generates explanation for Reading Detective comprehension
   */
  private static generateReadingExplanation(
    q: ReadingPassageQuestion,
    correctText?: string
  ): ExplanationResult {
    const target = correctText || (q.options && q.correctOptionIndex !== undefined ? q.options[q.correctOptionIndex] : '');
    return {
      explanation: target
        ? `Based on the passage details and context clues, "${target}" is directly supported by the text.`
        : 'Scan the passage specifically for keywords related to the question prompt.',
      ruleCategory: 'Reading Comprehension',
    };
  }

  /**
   * Generates explanation for At the Train Station problem solving
   */
  private static generateTrainStationExplanation(
    q: TrainStationQuestion,
    correctText?: string
  ): ExplanationResult {
    const target = correctText || (q.options && q.correctOptionIndex !== undefined ? q.options[q.correctOptionIndex] : '');
    return {
      explanation: target
        ? `According to the British railway departure board and dialogue notes, "${target}" is the accurate information.`
        : 'Check the timetable departure times, platforms, and calling points carefully.',
      ruleCategory: 'Real-World Timetable Reading',
    };
  }

  /**
   * Infers educational rule category from prompt keywords
   */
  private static inferRuleCategory(prompt: string, gameType: GameType): string {
    const p = (prompt || '').toLowerCase();
    if (p.includes('verb') || p.includes('tense')) return 'Grammar Rules';
    if (p.includes('mean') || p.includes('definition') || p.includes('word')) return 'Vocabulary Meaning';
    if (p.includes('passage') || p.includes('paragraph') || p.includes('author')) return 'Reading Skill';
    if (p.includes('platform') || p.includes('train') || p.includes('fare')) return 'Practical English';
    if (gameType === 'sentence_builder') return 'Word Order';
    if (gameType === 'match_it') return 'Collocations';
    return 'English Language Arts';
  }
}
