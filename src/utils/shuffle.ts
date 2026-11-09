/**
 * UNIT REVIEW ARCADE — QUESTION & OPTION SHUFFLE UTILITIES
 * 
 * Provides unbiased Fisher-Yates (Knuth) randomization for multiple-choice
 * questions while strictly preserving:
 * - The original correct answer text and semantic meaning
 * - Updated correctOptionIndex matching the new position of the correct answer
 * - All other metadata (prompts, explanations, points, difficulty, etc.)
 */

/**
 * Modern unbiased Fisher-Yates (Knuth) shuffle algorithm.
 * Returns a new array with randomly permuted elements without mutating the input.
 */
export function fisherYatesShuffle<T>(array: readonly T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

export interface HasOptionsAndCorrectIndex {
  options: string[];
  correctOptionIndex: number;
}

/**
 * Randomizes answer-option order for a single multiple-choice question
 * using the Fisher-Yates algorithm.
 * 
 * Accurately updates correctOptionIndex to reflect the new position
 * of the correct answer, preserving scoring, feedback, explanations, and tracking.
 * Does not mutate the original question object.
 */
export function shuffleQuestionOptions<T extends HasOptionsAndCorrectIndex>(question: T): T {
  if (!question || !Array.isArray(question.options) || question.options.length <= 1) {
    return { ...question };
  }

  // Generate an array of original indices: [0, 1, ..., n-1]
  const indices = question.options.map((_, i) => i);
  const shuffledIndices = fisherYatesShuffle(indices);

  // Map options to their new shuffled positions
  const newOptions = shuffledIndices.map((origIdx) => question.options[origIdx]);

  // Find where the original correct answer moved
  const newCorrectOptionIndex = shuffledIndices.indexOf(question.correctOptionIndex);

  return {
    ...question,
    options: newOptions,
    correctOptionIndex: newCorrectOptionIndex >= 0 ? newCorrectOptionIndex : question.correctOptionIndex,
  };
}

/**
 * Shuffles the answer options of an array of questions.
 * Returns a new array of questions with shuffled options.
 */
export function shuffleQuestionsOptions<T extends HasOptionsAndCorrectIndex>(
  questions: readonly T[]
): T[] {
  if (!questions || !Array.isArray(questions)) return [];
  return questions.map((q) => shuffleQuestionOptions(q));
}

