/**
 * UNIT REVIEW ARCADE — QUESTION TEMPLATE & EXPORT GENERATOR (PHASE 3)
 * Version: 3.0.0
 * 
 * Provides downloadable Excel (.xlsx) and CSV (.csv) question templates
 * for teachers, as well as full custom Question Bank export & disaster backup.
 */

import type { QuestionType, QuestionBankItem } from '../types/questionBank';
import { generateCsv, generateXlsx } from './spreadsheetParser';

export interface TemplateDefinition {
  type: QuestionType | 'universal';
  name: string;
  description: string;
  filename: string;
  headers: string[];
  sampleRows: string[][];
}

export const TEMPLATES: Record<QuestionType | 'universal', TemplateDefinition> = {
  multiple_choice: {
    type: 'multiple_choice',
    name: 'Multiple Choice Template',
    description: 'Standard 4-option questions suitable for Quiz Battle, Speed Round & Boss Battle.',
    filename: 'unit_review_arcade_template_multiple_choice',
    headers: [
      'Question Type',
      'Prompt',
      'Option A',
      'Option B',
      'Option C',
      'Option D',
      'Correct Answer',
      'Explanation',
      'Section',
      'Grade',
      'Unit ID',
      'Topic',
      'Skill',
      'Difficulty',
      'Points',
      'Tags',
    ],
    sampleRows: [
      [
        'multiple_choice',
        'Which phrasal verb means "to stop doing something"?',
        'give up',
        'look after',
        'put off',
        'take off',
        'A',
        'To give up means to stop doing or trying something.',
        'general_english',
        'all',
        '',
        'Phrasal Verbs',
        'vocabulary',
        'medium',
        '10',
        'vocabulary,phrasal-verbs',
      ],
      [
        'multiple_choice',
        'They ______ to the library yesterday afternoon.',
        'went',
        'goes',
        'have gone',
        'going',
        'A',
        'Past simple "went" is required for specific past time "yesterday afternoon".',
        'unit_review',
        'grade-7',
        'g7-u1',
        'Past Simple',
        'grammar',
        'easy',
        '10',
        'grammar,past-simple',
      ],
      [
        'multiple_choice',
        'What does the word "hazardous" mean?',
        'Dangerous and risky',
        'Extremely pleasant',
        'Very safe',
        'Brightly lit',
        'A',
        'Hazardous describes something full of hazard or danger.',
        'general_english',
        'grade-8',
        '',
        'Adjectives',
        'vocabulary',
        'hard',
        '15',
        'vocabulary,adjectives',
      ],
    ],
  },

  true_false: {
    type: 'true_false',
    name: 'True / False Template',
    description: 'Binary comprehension and grammar statements.',
    filename: 'unit_review_arcade_template_true_false',
    headers: [
      'Question Type',
      'Prompt',
      'Correct Answer',
      'Explanation',
      'Section',
      'Grade',
      'Unit ID',
      'Topic',
      'Skill',
      'Difficulty',
      'Points',
      'Tags',
    ],
    sampleRows: [
      [
        'true_false',
        '"She don\'t like apples" is grammatically correct in standard English.',
        'FALSE',
        'Third-person singular takes "doesn\'t", so "She doesn\'t like apples".',
        'general_english',
        'all',
        '',
        'Subject-Verb Agreement',
        'grammar',
        'easy',
        '10',
        'grammar,agreement',
      ],
      [
        'true_false',
        'The past tense form of "read" is spelled the same but pronounced differently.',
        'TRUE',
        'Both present and past are spelled "read", but the past is pronounced /rɛd/.',
        'unit_review',
        'grade-7',
        'g7-u2',
        'Irregular Verbs',
        'grammar',
        'medium',
        '10',
        'grammar,pronunciation',
      ],
    ],
  },

  sentence_builder: {
    type: 'sentence_builder',
    name: 'Sentence Builder Template',
    description: 'Unscramble sentences to reinforce syntactic structure and word order.',
    filename: 'unit_review_arcade_template_sentence_builder',
    headers: [
      'Question Type',
      'Prompt',
      'Correct Sentence',
      'Scrambled Words',
      'Explanation',
      'Section',
      'Grade',
      'Unit ID',
      'Topic',
      'Skill',
      'Difficulty',
      'Points',
      'Tags',
    ],
    sampleRows: [
      [
        'sentence_builder',
        'Assemble the correct sentence:',
        'She visited the science museum yesterday.',
        'She / museum / visited / yesterday / the / science',
        'Subject + verb + direct object + time expression.',
        'general_english',
        'grade-7',
        '',
        'Past Simple Word Order',
        'grammar',
        'medium',
        '15',
        'word-order,sentence-building',
      ],
      [
        'sentence_builder',
        'Put the words in order to form a question:',
        'Have you ever seen a shooting star?',
        'seen / star / Have / shooting / ever / a / you ?',
        'Present perfect question form: Have + subject + ever + past participle.',
        'general_english',
        'grade-8',
        '',
        'Present Perfect Questions',
        'grammar',
        'hard',
        '15',
        'grammar,questions',
      ],
    ],
  },

  match_it: {
    type: 'match_it',
    name: 'Match It Pairs Template',
    description: 'Vocabulary pairs, synonyms, antonyms, or word-definition associations.',
    filename: 'unit_review_arcade_template_match_it',
    headers: [
      'Question Type',
      'Prompt',
      'Pair 1 Left',
      'Pair 1 Right',
      'Pair 2 Left',
      'Pair 2 Right',
      'Pair 3 Left',
      'Pair 3 Right',
      'Pair 4 Left',
      'Pair 4 Right',
      'Explanation',
      'Section',
      'Grade',
      'Unit ID',
      'Topic',
      'Skill',
      'Difficulty',
      'Points',
      'Tags',
    ],
    sampleRows: [
      [
        'match_it',
        'Match words with their closest synonyms:',
        'huge',
        'enormous',
        'tiny',
        'miniature',
        'cautious',
        'careful',
        'swift',
        'rapid',
        'Match corresponding synonyms.',
        'general_english',
        'all',
        '',
        'Synonyms',
        'vocabulary',
        'medium',
        '20',
        'vocabulary,synonyms',
      ],
    ],
  },

  reading_passage: {
    type: 'reading_passage',
    name: 'Reading Passage Template',
    description: 'Passage text with accompanying multiple-choice comprehension questions.',
    filename: 'unit_review_arcade_template_reading_passage',
    headers: [
      'Question Type',
      'Passage Title',
      'Passage Text',
      'Comprehension Question',
      'Option A',
      'Option B',
      'Option C',
      'Option D',
      'Correct Answer',
      'Explanation',
      'Section',
      'Grade',
      'Unit ID',
      'Topic',
      'Skill',
      'Difficulty',
      'Points',
      'Tags',
    ],
    sampleRows: [
      [
        'reading_passage',
        'The Solar Powered Train',
        'In 2017, a coastal town introduced the world\'s first fully solar-powered passenger train. Solar panels mounted on the train roof generate enough energy to run a 3-kilometer round trip hourly.',
        'Where are the train\'s solar panels located?',
        'On the train roof',
        'At the train station',
        'Beside the railway tracks',
        'On the train wheels',
        'A',
        'The passage explicitly mentions "Solar panels mounted on the train roof".',
        'general_english',
        'grade-8',
        '',
        'Renewable Transport',
        'reading',
        'medium',
        '15',
        'reading,comprehension',
      ],
    ],
  },

  vocabulary_item: {
    type: 'vocabulary_item',
    name: 'Vocabulary Item Template',
    description: 'Target word with definition and distractors for arcade mini-games.',
    filename: 'unit_review_arcade_template_vocabulary_item',
    headers: [
      'Question Type',
      'Target Word',
      'Prompt / Meaning',
      'Distractor 1',
      'Distractor 2',
      'Distractor 3',
      'Explanation',
      'Section',
      'Grade',
      'Unit ID',
      'Topic',
      'Skill',
      'Difficulty',
      'Points',
      'Tags',
    ],
    sampleRows: [
      [
        'vocabulary_item',
        'ancient',
        'Belonging to the very distant past and no longer in existence',
        'modern',
        'futuristic',
        'recent',
        'Ancient refers to things from long ago.',
        'general_english',
        'all',
        '',
        'Historical Words',
        'vocabulary',
        'easy',
        '10',
        'vocabulary,history',
      ],
    ],
  },

  universal: {
    type: 'universal',
    name: 'Master / All-in-One Template',
    description: 'Comprehensive template accommodating multiple question types in a single sheet.',
    filename: 'unit_review_arcade_template_universal',
    headers: [
      'Question Type',
      'Prompt',
      'Option A / Left 1 / Target Word',
      'Option B / Right 1 / Distractor 1',
      'Option C / Left 2 / Distractor 2',
      'Option D / Right 2 / Distractor 3',
      'Pair 3 Left',
      'Pair 3 Right',
      'Pair 4 Left',
      'Pair 4 Right',
      'Correct Answer',
      'Passage Title',
      'Passage Text',
      'Explanation',
      'Section',
      'Grade',
      'Unit ID',
      'Topic',
      'Skill',
      'Difficulty',
      'Points',
      'Tags',
    ],
    sampleRows: [
      [
        'multiple_choice',
        'Choose the correct preposition: She arrived _____ the airport at 9 PM.',
        'at',
        'in',
        'on',
        'to',
        '',
        '',
        '',
        '',
        'A',
        '',
        '',
        'Use "at" for specific locations like airports and stations.',
        'general_english',
        'all',
        '',
        'Prepositions of Place',
        'grammar',
        'medium',
        '10',
        'grammar,prepositions',
      ],
      [
        'true_false',
        'The sun rises in the west.',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        'FALSE',
        '',
        '',
        'The sun rises in the east.',
        'general_english',
        'all',
        '',
        'General Knowledge',
        'reading',
        'easy',
        '10',
        'reading',
      ],
      [
        'sentence_builder',
        'Unscramble the question:',
        'Where do you live ?',
        'do / live / you / Where / ?',
        '',
        '',
        '',
        '',
        '',
        '',
        'Where do you live ?',
        '',
        '',
        'Question word + auxiliary + subject + main verb.',
        'unit_review',
        'grade-7',
        'g7-u1',
        'Wh- Questions',
        'grammar',
        'easy',
        '10',
        'grammar,questions',
      ],
    ],
  },

  train_station: {
    type: 'train_station',
    name: 'Train Station Template',
    description: 'Listening and dialogue comprehension template.',
    filename: 'unit_review_arcade_template_train_station',
    headers: [
      'Question Type',
      'Prompt',
      'Option A',
      'Option B',
      'Option C',
      'Option D',
      'Correct Answer',
      'Explanation',
      'Section',
      'Grade',
      'Unit ID',
      'Topic',
      'Skill',
      'Difficulty',
      'Points',
      'Tags',
    ],
    sampleRows: [
      [
        'train_station',
        'What train platform should the traveler go to?',
        'Platform 3',
        'Platform 1',
        'Platform 5',
        'Platform 7',
        'A',
        'The announcement says "Train to Oxford departs from Platform 3".',
        'general_english',
        'grade-8',
        '',
        'Station Announcements',
        'listening',
        'medium',
        '15',
        'listening,station',
      ],
    ],
  },
};

/**
 * Downloads a generated template directly to the user's browser.
 */
export async function downloadTemplate(
  templateType: QuestionType | 'universal',
  format: 'xlsx' | 'csv'
): Promise<void> {
  const tpl = TEMPLATES[templateType] || TEMPLATES.universal;
  const rows = [tpl.headers, ...tpl.sampleRows];

  if (format === 'csv') {
    const csvContent = generateCsv(rows);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    triggerBrowserDownload(blob, `${tpl.filename}.csv`);
  } else {
    const xlsxBytes = await generateXlsx(rows);
    const blob = new Blob([xlsxBytes as unknown as BlobPart], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    triggerBrowserDownload(blob, `${tpl.filename}.xlsx`);
  }
}

/**
 * Exports the Question Bank items to a file (.xlsx, .csv, or .json).
 */
export async function exportQuestionBank(
  questions: QuestionBankItem[],
  format: 'xlsx' | 'csv' | 'json',
  filenamePrefix: string = 'unit_review_arcade_question_bank_backup'
): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const filename = `${filenamePrefix}_${timestamp}`;

  if (format === 'json') {
    const jsonStr = JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        version: '3.0.0',
        count: questions.length,
        questions,
      },
      null,
      2
    );
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
    triggerBrowserDownload(blob, `${filename}.json`);
    return;
  }

  // Flatten questions into tabular rows
  const headers = [
    'ID',
    'Question Type',
    'Prompt',
    'Correct Answer Preview',
    'Option A / Left 1 / Target Word',
    'Option B / Right 1 / Distractor 1',
    'Option C / Left 2 / Distractor 2',
    'Option D / Right 2 / Distractor 3',
    'Explanation',
    'Section',
    'Grade',
    'Unit ID',
    'Unit Title',
    'Topic',
    'Skill',
    'Difficulty',
    'Points',
    'Tags',
    'Status',
    'Content Version',
    'Created At',
    'Updated At',
  ];

  const rows: string[][] = [headers];

  for (const q of questions) {
    let optA = '';
    let optB = '';
    let optC = '';
    let optD = '';

    if (q.payload.options) {
      optA = q.payload.options[0] || '';
      optB = q.payload.options[1] || '';
      optC = q.payload.options[2] || '';
      optD = q.payload.options[3] || '';
    } else if (q.payload.pairs && q.payload.pairs.length > 0) {
      optA = q.payload.pairs[0]?.left || '';
      optB = q.payload.pairs[0]?.right || '';
      optC = q.payload.pairs[1]?.left || '';
      optD = q.payload.pairs[1]?.right || '';
    } else if (q.payload.targetWord) {
      optA = q.payload.targetWord;
      optB = q.payload.distractorWords?.[0] || '';
      optC = q.payload.distractorWords?.[1] || '';
      optD = q.payload.distractorWords?.[2] || '';
    }

    rows.push([
      q.id,
      q.questionType,
      q.prompt,
      q.correctAnswerPreview,
      optA,
      optB,
      optC,
      optD,
      q.explanation || '',
      q.section,
      q.gradeId,
      q.unitId || '',
      q.unitTitle || '',
      q.topic,
      q.skill,
      q.difficulty,
      String(q.points),
      (q.tags || []).join('; '),
      q.status,
      String(q.contentVersion),
      q.createdAt,
      q.updatedAt,
    ]);
  }

  if (format === 'csv') {
    const csvContent = generateCsv(rows);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    triggerBrowserDownload(blob, `${filename}.csv`);
  } else {
    const xlsxBytes = await generateXlsx(rows);
    const blob = new Blob([xlsxBytes as unknown as BlobPart], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    triggerBrowserDownload(blob, `${filename}.xlsx`);
  }
}

function triggerBrowserDownload(blob: Blob, filename: string): void {
  if (typeof window === 'undefined') return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

