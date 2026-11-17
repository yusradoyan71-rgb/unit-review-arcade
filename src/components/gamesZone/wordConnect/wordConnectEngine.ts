/**
 * UNIT REVIEW ARCADE — WORD CONNECT SELECTION ENGINE
 * Version: 10.3.0
 * 
 * Strict state invariants for letter-wheel tile selections:
 * 1. Each physical tile is represented by its unique index [0..N-1].
 * 2. A tile can be selected at most ONCE during a word attempt.
 * 3. Moving slowly, lingering, or receiving duplicate pointer events over
 *    a tile MUST NEVER duplicate the letter in the formed word.
 * 4. Repeated letters are permitted ONLY when the puzzle provides
 *    distinct physical tiles with that letter (e.g., T-E-E-T-H).
 * 5. Drag and click gestures are isolated to prevent double-firing.
 */

export class WordConnectSelectionEngine {
  private selectedIndices: number[] = [];
  private letters: string[] = [];

  constructor(letters: string[]) {
    this.setLetters(letters);
  }

  public setLetters(letters: string[]): void {
    this.letters = letters.map((l) => l.toUpperCase());
    this.clear();
  }

  public getSelectedIndices(): number[] {
    return [...this.selectedIndices];
  }

  public getFormedWord(): string {
    return this.selectedIndices.map((i) => this.letters[i] || '').join('');
  }

  /**
   * Attempt to select a letter tile by its unique index.
   * Returns true if selected, false if already selected or out of bounds.
   */
  public selectTile(index: number): boolean {
    if (index < 0 || index >= this.letters.length) {
      return false;
    }
    // Strict Invariant: Tile can be selected only ONCE per attempt
    if (this.selectedIndices.includes(index)) {
      return false;
    }
    this.selectedIndices.push(index);
    return true;
  }

  /**
   * Backtrack or deselect when clicking an already selected tile
   */
  public handleTapTile(index: number): boolean {
    if (index < 0 || index >= this.letters.length) {
      return false;
    }
    if (this.selectedIndices.includes(index)) {
      const pos = this.selectedIndices.indexOf(index);
      if (pos === this.selectedIndices.length - 1) {
        // Tapped the last selected tile -> remove it
        this.selectedIndices.pop();
      } else {
        // Tapped an earlier tile -> backtrack up to that tile
        this.selectedIndices = this.selectedIndices.slice(0, pos + 1);
      }
      return true;
    } else {
      return this.selectTile(index);
    }
  }

  /**
   * Reset the current selection attempt
   */
  public clear(): void {
    this.selectedIndices = [];
  }
}
