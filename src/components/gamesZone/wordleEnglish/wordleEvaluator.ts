export type TileStatus = 'correct' | 'present' | 'absent' | 'empty' | 'typing';

/**
 * 2-pass duplicate letter evaluation algorithm for Wordle:
 * Pass 1: Mark all exact matches ('correct') and decrement letter budget.
 * Pass 2: Mark present matches ('present') for remaining budget; else 'absent'.
 */
export function evaluateWordleGuess(targetWord: string, guessWord: string): TileStatus[] {
  const target = targetWord.toUpperCase().split('');
  const guess = guessWord.toUpperCase().split('');
  const result: TileStatus[] = new Array(target.length).fill('absent');
  const letterCounts: Record<string, number> = {};

  for (const char of target) {
    letterCounts[char] = (letterCounts[char] || 0) + 1;
  }

  // Pass 1: exact matches
  for (let i = 0; i < target.length; i++) {
    if (guess[i] === target[i]) {
      result[i] = 'correct';
      letterCounts[guess[i]]--;
    }
  }

  // Pass 2: present or absent
  for (let i = 0; i < target.length; i++) {
    if (result[i] !== 'correct') {
      const char = guess[i];
      if (letterCounts[char] && letterCounts[char] > 0) {
        result[i] = 'present';
        letterCounts[char]--;
      } else {
        result[i] = 'absent';
      }
    }
  }

  return result;
}
