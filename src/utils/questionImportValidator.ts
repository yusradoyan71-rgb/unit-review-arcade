/**
 * UNIT REVIEW ARCADE — QUESTION IMPORT VALIDATION ENGINE (PHASE 3)
 * Version: 3.0.0
 * 
 * Provides robust validation, automatic column mapping, and duplicate detection
 * for bulk Excel (.xlsx) and CSV (.csv) question imports.
 * 
 * Guarantees:
 * - Detects missing answers, malformed options, missing prompts, and invalid types.
 * - Enforces zero-overwrite: flags duplicates against existing custom & 1,206 built-in questions.
 * - Allows teachers to review, fix, or skip invalid/duplicate rows before saving.
 */

import type {
  QuestionBankItem,
  QuestionType,
  LearningSection,
  EnglishSkill,
  QuestionDifficulty,
  QuestionPayload,
} from '../types/questionBank';
import type { GameType, GradeId } from '../types/schema';
import { determineCompatibleGameTypes } from './questionBankCompat';

export interface ImportRowValidationResult {
  rowIndex: number;              // 1-based row number in the spreadsheet
  originalRow: string[];         // raw cell strings
  parsedItem: Partial<QuestionBankItem> & {
    prompt: string;
    questionType: QuestionType;
    skill: EnglishSkill;
    topic: string;
    section: LearningSection;
    assignedGameTypes: GameType[];
    payload: QuestionPayload;
    points: number;
    tags: string[];
    difficulty: QuestionDifficulty;
    gradeId: GradeId | 'all';
    unitId?: string;
    unitTitle?: string;
    correctAnswerPreview: string;
    explanation?: string;
  };
  status: 'valid' | 'invalid' | 'duplicate';
  errors: string[];
  warnings: string[];
  isDuplicate: boolean;
  duplicateReason?: string;
  included: boolean;             // whether this row will be imported
}

export interface ImportValidationSummary {
  totalRows: number;
  validCount: number;
  invalidCount: number;
  duplicateCount: number;
  readyToImportCount: number;
  results: ImportRowValidationResult[];
}

interface ColumnIndexMap {
  prompt: number;
  type: number;
  optA: number;
  optB: number;
  optC: number;
  optD: number;
  answer: number;
  explanation: number;
  section: number;
  grade: number;
  unit: number;
  topic: number;
  skill: number;
  difficulty: number;
  points: number;
  tags: number;
  sentence: number;
  scrambled: number;
  passageTitle: number;
  passageText: number;
  pair1Left: number;
  pair1Right: number;
  pair2Left: number;
  pair2Right: number;
  pair3Left: number;
  pair3Right: number;
  pair4Left: number;
  pair4Right: number;
  targetWord: number;
  distractor1: number;
  distractor2: number;
  distractor3: number;
}

/**
 * Normalizes text for reliable duplicate comparison.
 */
export function normalizePromptForDeduplication(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Auto-maps raw headers to standard column indices using fuzzy regex matching.
 */
export function mapSpreadsheetHeaders(headers: string[]): ColumnIndexMap {
  const map: ColumnIndexMap = {
    prompt: -1,
    type: -1,
    optA: -1,
    optB: -1,
    optC: -1,
    optD: -1,
    answer: -1,
    explanation: -1,
    section: -1,
    grade: -1,
    unit: -1,
    topic: -1,
    skill: -1,
    difficulty: -1,
    points: -1,
    tags: -1,
    sentence: -1,
    scrambled: -1,
    passageTitle: -1,
    passageText: -1,
    pair1Left: -1,
    pair1Right: -1,
    pair2Left: -1,
    pair2Right: -1,
    pair3Left: -1,
    pair3Right: -1,
    pair4Left: -1,
    pair4Right: -1,
    targetWord: -1,
    distractor1: -1,
    distractor2: -1,
    distractor3: -1,
  };

  headers.forEach((h, idx) => {
    const clean = h.toLowerCase().trim();

    // Options (handles standard and universal multi-purpose columns)
    if (/option[\s_]?a|opt[\s_]?a|choice[\s_]?a|opt[\s_]?1|option[\s_]?1|^a$/i.test(clean)) {
      map.optA = idx;
      if (clean.includes('left') || clean.includes('target')) {
        map.pair1Left = idx;
        map.targetWord = idx;
      }
    } else if (/option[\s_]?b|opt[\s_]?b|choice[\s_]?b|opt[\s_]?2|option[\s_]?2|^b$/i.test(clean)) {
      map.optB = idx;
      if (clean.includes('right') || clean.includes('distractor')) {
        map.pair1Right = idx;
        map.distractor1 = idx;
      }
    } else if (/option[\s_]?c|opt[\s_]?c|choice[\s_]?c|opt[\s_]?3|option[\s_]?3|^c$/i.test(clean)) {
      map.optC = idx;
      if (clean.includes('left') || clean.includes('distractor')) {
        map.pair2Left = idx;
        map.distractor2 = idx;
      }
    } else if (/option[\s_]?d|opt[\s_]?d|choice[\s_]?d|opt[\s_]?4|option[\s_]?4|^d$/i.test(clean)) {
      map.optD = idx;
      if (clean.includes('right') || clean.includes('distractor')) {
        map.pair2Right = idx;
        map.distractor3 = idx;
      }
    }

    // Specific pair matching
    else if (/pair[\s_]?1[\s_]?left|^left[\s_]?1$/i.test(clean)) map.pair1Left = idx;
    else if (/pair[\s_]?1[\s_]?right|^right[\s_]?1$/i.test(clean)) map.pair1Right = idx;
    else if (/pair[\s_]?2[\s_]?left|^left[\s_]?2$/i.test(clean)) map.pair2Left = idx;
    else if (/pair[\s_]?2[\s_]?right|^right[\s_]?2$/i.test(clean)) map.pair2Right = idx;
    else if (/pair[\s_]?3[\s_]?left|left[\s_]?3/i.test(clean)) map.pair3Left = idx;
    else if (/pair[\s_]?3[\s_]?right|right[\s_]?3/i.test(clean)) map.pair3Right = idx;
    else if (/pair[\s_]?4[\s_]?left|left[\s_]?4/i.test(clean)) map.pair4Left = idx;
    else if (/pair[\s_]?4[\s_]?right|right[\s_]?4/i.test(clean)) map.pair4Right = idx;

    // Distractor matching
    else if (/distractor[\s_]?1/i.test(clean)) map.distractor1 = idx;
    else if (/distractor[\s_]?2/i.test(clean)) map.distractor2 = idx;
    else if (/distractor[\s_]?3/i.test(clean)) map.distractor3 = idx;

    // Target Word
    else if (/target[\s_]?word|hedef/i.test(clean)) map.targetWord = idx;

    // Passage Title and Text
    else if (/passage[\s_]?title|başlık/i.test(clean)) map.passageTitle = idx;
    else if (/passage[\s_]?text|passage|metin/i.test(clean)) map.passageText = idx;

    // Sentence Builder specifics
    else if (/correct[\s_]?sentence|sentence|cümle/i.test(clean)) map.sentence = idx;
    else if (/scrambled[\s_]?words|scrambled|karışık/i.test(clean)) map.scrambled = idx;

    // General fields
    else if (/correct[\s_]?answer|correct[\s_]?option|correct|answer|doğru|cevap/i.test(clean)) map.answer = idx;
    else if (/type|tür|tip/i.test(clean)) map.type = idx;
    else if (/prompt|question|soru|item/i.test(clean)) map.prompt = idx;
    else if (/explanation|açıklama|reason/i.test(clean)) map.explanation = idx;
    else if (/section|bölüm/i.test(clean)) map.section = idx;
    else if (/grade|sınıf/i.test(clean)) map.grade = idx;
    else if (/unit|ünite/i.test(clean)) map.unit = idx;
    else if (/topic|konu/i.test(clean)) map.topic = idx;
    else if (/skill|beceri/i.test(clean)) map.skill = idx;
    else if (/difficulty|zorluk|level/i.test(clean)) map.difficulty = idx;
    else if (/point|puan|score/i.test(clean)) map.points = idx;
    else if (/tag|etiket/i.test(clean)) map.tags = idx;
  });

  return map;
}

/**
 * Validates a single question row and returns structured validation results.
 */
export function validateSingleRow(
  rawRow: string[],
  rowIndex: number,
  colMap: ColumnIndexMap,
  seenNormalizedPrompts: Map<string, number>,
  existingQuestions: QuestionBankItem[],
  builtInQuestions: QuestionBankItem[]
): ImportRowValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const getVal = (colIdx: number): string => (colIdx >= 0 && colIdx < rawRow.length ? rawRow[colIdx].trim() : '');

  // 1. Raw field extraction
  let rawPrompt = getVal(colMap.prompt);
  let rawType = getVal(colMap.type).toLowerCase();
  const rawOptA = getVal(colMap.optA);
  const rawOptB = getVal(colMap.optB);
  const rawOptC = getVal(colMap.optC);
  const rawOptD = getVal(colMap.optD);
  const rawAnswer = getVal(colMap.answer);
  const rawExplanation = getVal(colMap.explanation);
  const rawSection = getVal(colMap.section).toLowerCase();
  const rawGrade = getVal(colMap.grade).toLowerCase();
  const rawUnit = getVal(colMap.unit);
  const rawTopic = getVal(colMap.topic);
  const rawSkill = getVal(colMap.skill).toLowerCase();
  const rawDifficulty = getVal(colMap.difficulty).toLowerCase();
  const rawPoints = getVal(colMap.points);
  const rawTags = getVal(colMap.tags);
  const rawSentence = getVal(colMap.sentence);
  const rawScrambled = getVal(colMap.scrambled);
  const rawPassageTitle = getVal(colMap.passageTitle);
  const rawPassageText = getVal(colMap.passageText);
  const rawTargetWord = getVal(colMap.targetWord);

  // 2. Determine Question Type
  let questionType: QuestionType = 'multiple_choice';

  if (rawType) {
    if (rawType.includes('mcq') || rawType.includes('multiple') || rawType.includes('choice') || rawType.includes('çoktan')) {
      questionType = 'multiple_choice';
    } else if (rawType.includes('true') || rawType.includes('false') || rawType.includes('doğru') || rawType.includes('yanlış')) {
      questionType = 'true_false';
    } else if (rawType.includes('sentence') || rawType.includes('scramble') || rawType.includes('cümle')) {
      questionType = 'sentence_builder';
    } else if (rawType.includes('match') || rawType.includes('pair') || rawType.includes('eşleştir')) {
      questionType = 'match_it';
    } else if (rawType.includes('reading') || rawType.includes('passage') || rawType.includes('okuma')) {
      questionType = 'reading_passage';
    } else if (rawType.includes('vocab') || rawType.includes('word') || rawType.includes('kelime')) {
      questionType = 'vocabulary_item';
    } else if (rawType.includes('train') || rawType.includes('listening')) {
      questionType = 'train_station';
    } else {
      warnings.push(`Unrecognized question type "${rawType}"; defaulting to Multiple Choice.`);
      questionType = 'multiple_choice';
    }
  } else {
    // Auto-infer type from filled fields
    if (rawPassageText) {
      questionType = 'reading_passage';
    } else if (rawSentence || rawScrambled) {
      questionType = 'sentence_builder';
    } else if (getVal(colMap.pair1Left) && getVal(colMap.pair1Right)) {
      questionType = 'match_it';
    } else if (rawTargetWord) {
      questionType = 'vocabulary_item';
    } else if (/^(true|false|t|f|doğru|yanlış)$/i.test(rawAnswer) && !rawOptC && !rawOptD) {
      questionType = 'true_false';
    } else {
      questionType = 'multiple_choice';
    }
  }

  // 3. Fallback prompt from sentence or passage if blank
  if (!rawPrompt) {
    if (questionType === 'sentence_builder') {
      rawPrompt = 'Unscramble the sentence:';
    } else if (questionType === 'match_it') {
      rawPrompt = 'Match the corresponding pairs:';
    } else if (questionType === 'vocabulary_item' && rawTargetWord) {
      rawPrompt = `What is the meaning of "${rawTargetWord}"?`;
    }
  }

  if (!rawPrompt) {
    errors.push('Question prompt is missing.');
  }

  // 4. Construct payload and validate type-specific rules
  const payload: QuestionPayload = {};
  let correctAnswerPreview = '';

  if (questionType === 'multiple_choice') {
    const options = [rawOptA, rawOptB, rawOptC, rawOptD].filter((opt) => opt.length > 0);
    if (options.length < 2) {
      errors.push('Multiple Choice requires at least 2 non-empty options.');
    }
    payload.options = options;

    if (!rawAnswer) {
      errors.push('Correct answer is missing.');
    } else {
      let correctIdx = -1;
      const cleanAns = rawAnswer.toUpperCase().trim();
      const letterPrefixMatch = cleanAns.match(/^([A-D])(?:\)|\.|\s|$)/);

      if (letterPrefixMatch) {
        correctIdx = letterPrefixMatch[1].charCodeAt(0) - 65;
      } else if (cleanAns === '1') correctIdx = 0;
      else if (cleanAns === '2') correctIdx = 1;
      else if (cleanAns === '3') correctIdx = 2;
      else if (cleanAns === '4') correctIdx = 3;
      else {
        // Try verbatim option text match
        const found = options.findIndex((opt) => opt.toLowerCase().trim() === rawAnswer.toLowerCase().trim());
        if (found >= 0) correctIdx = found;
      }

      if (correctIdx < 0 || correctIdx >= options.length) {
        errors.push(`Correct answer "${rawAnswer}" does not match any valid option (A, B, C, D).`);
      } else {
        payload.correctOptionIndex = correctIdx;
        correctAnswerPreview = `${String.fromCharCode(65 + correctIdx)}) ${options[correctIdx]}`;
      }
    }
  } else if (questionType === 'true_false') {
    if (!rawAnswer) {
      errors.push('True/False answer is missing.');
    } else {
      const cleanAns = rawAnswer.toUpperCase().trim();
      if (cleanAns === 'TRUE' || cleanAns === 'T' || cleanAns === 'YES' || cleanAns === 'DOĞRU') {
        payload.isTrue = true;
        correctAnswerPreview = 'TRUE';
      } else if (cleanAns === 'FALSE' || cleanAns === 'F' || cleanAns === 'NO' || cleanAns === 'YANLIŞ') {
        payload.isTrue = false;
        correctAnswerPreview = 'FALSE';
      } else {
        errors.push(`True/False answer "${rawAnswer}" must be TRUE or FALSE.`);
      }
    }
  } else if (questionType === 'sentence_builder') {
    const correctSentence = rawSentence || rawAnswer;
    if (!correctSentence) {
      errors.push('Correct sentence is required for Sentence Builder.');
    }
    payload.correctSentence = correctSentence;

    let scrambled: string[] = [];
    if (rawScrambled) {
      scrambled = rawScrambled.split(/[/,;]+/).map((w) => w.trim()).filter((w) => w.length > 0);
    }
    if (scrambled.length < 2 && correctSentence) {
      // Auto-tokenize from correct sentence
      scrambled = correctSentence.split(/\s+/).filter((w) => w.length > 0);
      warnings.push('Scrambled words were automatically generated from the correct sentence.');
    }
    payload.scrambledWords = scrambled;
    correctAnswerPreview = correctSentence;
  } else if (questionType === 'match_it') {
    const pairs: Array<{ id: string; left: string; right: string }> = [];

    const addPair = (left: string, right: string, num: number) => {
      if (!left && !right) return;
      if (!left || !right) {
        errors.push(`Matching Pair ${num} is incomplete (both left and right values required).`);
        return;
      }
      pairs.push({ id: String(num), left, right });
    };

    addPair(getVal(colMap.pair1Left), getVal(colMap.pair1Right), 1);
    addPair(getVal(colMap.pair2Left), getVal(colMap.pair2Right), 2);
    addPair(getVal(colMap.pair3Left), getVal(colMap.pair3Right), 3);
    addPair(getVal(colMap.pair4Left), getVal(colMap.pair4Right), 4);

    if (pairs.length < 2) {
      errors.push('Match It requires at least 2 complete pairs.');
    }
    payload.pairs = pairs;
    correctAnswerPreview = pairs.map((p) => `${p.left} ↔ ${p.right}`).join('; ');
  } else if (questionType === 'reading_passage') {
    if (!rawPassageText) {
      errors.push('Passage text is required for Reading Passage.');
    }
    payload.passageTitle = rawPassageTitle || 'Reading Comprehension';
    payload.passageText = rawPassageText;

    const options = [rawOptA, rawOptB, rawOptC, rawOptD].filter((opt) => opt.length > 0);
    if (options.length < 2) {
      errors.push('Reading Passage requires at least 2 comprehension options.');
    }
    payload.options = options;

    if (!rawAnswer) {
      errors.push('Correct answer is missing.');
    } else {
      let correctIdx = -1;
      const cleanAns = rawAnswer.toUpperCase().trim();
      const letterPrefixMatch = cleanAns.match(/^([A-D])(?:\)|\.|\s|$)/);
      if (letterPrefixMatch) {
        correctIdx = letterPrefixMatch[1].charCodeAt(0) - 65;
      } else if (cleanAns === '1') correctIdx = 0;
      else if (cleanAns === '2') correctIdx = 1;
      else if (cleanAns === '3') correctIdx = 2;
      else if (cleanAns === '4') correctIdx = 3;
      else {
        const found = options.findIndex((opt) => opt.toLowerCase().trim() === rawAnswer.toLowerCase().trim());
        if (found >= 0) correctIdx = found;
      }

      if (correctIdx < 0 || correctIdx >= options.length) {
        errors.push(`Correct answer "${rawAnswer}" does not match any valid comprehension option.`);
      } else {
        payload.correctOptionIndex = correctIdx;
        correctAnswerPreview = `${String.fromCharCode(65 + correctIdx)}) ${options[correctIdx]}`;
      }
    }
  } else if (questionType === 'vocabulary_item') {
    const target = rawTargetWord || rawOptA;
    if (!target) {
      errors.push('Target word is required for Vocabulary Item.');
    }
    payload.targetWord = target;

    const distractors = [
      getVal(colMap.distractor1) || rawOptB,
      getVal(colMap.distractor2) || rawOptC,
      getVal(colMap.distractor3) || rawOptD,
    ].filter((d) => d.length > 0);

    payload.distractorWords = distractors;
    correctAnswerPreview = target;
  }

  // 5. Classification Normalization
  let section: LearningSection = 'general_english';
  if (rawSection.includes('unit') || rawSection.includes('ünite')) section = 'unit_review';
  else if (rawSection.includes('both') || rawSection.includes('her') || rawSection.includes('ortak')) section = 'both';

  let gradeId: GradeId | 'all' = 'all';
  if (rawGrade.includes('7') || rawGrade.includes('yedinci')) gradeId = 'grade-7';
  else if (rawGrade.includes('8') || rawGrade.includes('sekizinci')) gradeId = 'grade-8';

  let unitId = rawUnit || undefined;
  if (section === 'unit_review' && !unitId) {
    warnings.push('Unit ID is missing for Unit Review question; defaulted to general_english.');
    section = 'general_english';
  }

  let skill: EnglishSkill = 'grammar';
  if (rawSkill.includes('vocab') || rawSkill.includes('kelime')) skill = 'vocabulary';
  else if (rawSkill.includes('read') || rawSkill.includes('okuma')) skill = 'reading';
  else if (rawSkill.includes('listen') || rawSkill.includes('dinleme')) skill = 'listening';

  let difficulty: QuestionDifficulty = 'medium';
  if (rawDifficulty.includes('easy') || rawDifficulty.includes('kolay')) difficulty = 'easy';
  else if (rawDifficulty.includes('hard') || rawDifficulty.includes('zor') || rawDifficulty.includes('challeng'))
    difficulty = 'challenging';

  const points = Math.max(1, parseInt(rawPoints, 10) || 10);
  const tags = rawTags
    ? rawTags.split(/[,;]+/).map((t) => t.trim().toLowerCase()).filter((t) => t.length > 0)
    : [];

  const assignedGameTypes = determineCompatibleGameTypes(questionType);

  // 6. Duplicate Detection
  let isDuplicate = false;
  let duplicateReason: string | undefined;

  const normalized = normalizePromptForDeduplication(rawPrompt);

  if (normalized.length > 4) {
    // Check A: Duplicate within uploaded file
    if (seenNormalizedPrompts.has(normalized)) {
      isDuplicate = true;
      duplicateReason = `Duplicate of Row ${seenNormalizedPrompts.get(normalized)} in this file.`;
    } else {
      seenNormalizedPrompts.set(normalized, rowIndex);
    }

    // Check B: Duplicate of existing custom Question Bank question
    if (!isDuplicate) {
      const existingMatch = existingQuestions.find(
        (eq) => normalizePromptForDeduplication(eq.prompt) === normalized
      );
      if (existingMatch) {
        isDuplicate = true;
        duplicateReason = `Matches existing custom question (ID: ${existingMatch.id}).`;
      }
    }

    // Check C: Duplicate of built-in curriculum question
    if (!isDuplicate) {
      const builtInMatch = builtInQuestions.find(
        (bq) => normalizePromptForDeduplication(bq.prompt) === normalized
      );
      if (builtInMatch) {
        isDuplicate = true;
        duplicateReason = `Matches built-in curriculum question (${builtInMatch.unitTitle || builtInMatch.topic}).`;
      }
    }
  }

  // 7. Status Resolution
  let status: 'valid' | 'invalid' | 'duplicate' = 'valid';
  if (errors.length > 0) {
    status = 'invalid';
  } else if (isDuplicate) {
    status = 'duplicate';
  }

  const parsedItem: Partial<QuestionBankItem> & {
    prompt: string;
    questionType: QuestionType;
    skill: EnglishSkill;
    topic: string;
    section: LearningSection;
    assignedGameTypes: GameType[];
    payload: QuestionPayload;
    points: number;
    tags: string[];
    difficulty: QuestionDifficulty;
    gradeId: GradeId | 'all';
    unitId?: string;
    unitTitle?: string;
    correctAnswerPreview: string;
    explanation?: string;
  } = {
    id: `qb_imp_${Date.now()}_${rowIndex}`,
    prompt: rawPrompt,
    questionType,
    section,
    gradeId,
    unitId,
    topic: rawTopic || 'General Practice',
    skill,
    difficulty,
    assignedGameTypes,
    payload,
    correctAnswerPreview,
    explanation: rawExplanation,
    points,
    tags,
    status: 'active',
    contentVersion: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return {
    rowIndex,
    originalRow: rawRow,
    parsedItem,
    status,
    errors,
    warnings,
    isDuplicate,
    duplicateReason,
    included: status === 'valid', // by default, only valid rows are included
  };
}

/**
 * Validates all rows of an imported spreadsheet matrix.
 */
export function validateImportRows(
  rows: string[][],
  existingQuestions: QuestionBankItem[],
  builtInQuestions: QuestionBankItem[]
): ImportValidationSummary {
  if (rows.length === 0) {
    return {
      totalRows: 0,
      validCount: 0,
      invalidCount: 0,
      duplicateCount: 0,
      readyToImportCount: 0,
      results: [],
    };
  }

  // 1. Detect header row (check first 3 rows for keyword matches)
  let headerRowIndex = 0;
  for (let r = 0; r < Math.min(3, rows.length); r++) {
    const line = rows[r].join(' ').toLowerCase();
    if (line.includes('prompt') || line.includes('question') || line.includes('soru') || line.includes('type') || line.includes('option')) {
      headerRowIndex = r;
      break;
    }
  }

  const headers = rows[headerRowIndex] || [];
  const colMap = mapSpreadsheetHeaders(headers);

  const seenNormalizedPrompts = new Map<string, number>();
  const results: ImportRowValidationResult[] = [];

  for (let r = headerRowIndex + 1; r < rows.length; r++) {
    const rawRow = rows[r];
    // Skip completely empty rows
    if (!rawRow || !rawRow.some((cell) => cell && cell.trim().length > 0)) {
      continue;
    }

    const res = validateSingleRow(
      rawRow,
      r + 1, // 1-based row number
      colMap,
      seenNormalizedPrompts,
      existingQuestions,
      builtInQuestions
    );
    results.push(res);
  }

  const validCount = results.filter((r) => r.status === 'valid').length;
  const invalidCount = results.filter((r) => r.status === 'invalid').length;
  const duplicateCount = results.filter((r) => r.status === 'duplicate').length;
  const readyToImportCount = results.filter((r) => r.included && r.status === 'valid').length;

  return {
    totalRows: results.length,
    validCount,
    invalidCount,
    duplicateCount,
    readyToImportCount,
    results,
  };
}
