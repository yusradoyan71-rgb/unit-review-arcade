/**
 * GENERAL ENGLISH STARTER CONTENT — MASTER REPOSITORY & INDEX
 * Milestone 3.5: 320 Teacher-Auditable Starter Questions
 * 
 * Distribution:
 * - Grade 7: 160 Questions (60 Grammar + 60 Vocabulary + 20 Reading + 20 Listening)
 * - Grade 8: 160 Questions (60 Grammar + 60 Vocabulary + 20 Reading + 20 Listening)
 * - Total: 320 Questions
 * - Status: draft (Pending Teacher Review & Approval)
 */

import type { QuestionBankItem } from '../../types/questionBank';

import { GRADE_7_GRAMMAR_QUESTIONS } from './grade7/grammar';
import { GRADE_7_VOCABULARY_QUESTIONS } from './grade7/vocabulary';
import { GRADE_7_READING_QUESTIONS } from './grade7/reading';
import { GRADE_7_LISTENING_QUESTIONS } from './grade7/listening';

import { GRADE_8_GRAMMAR_QUESTIONS } from './grade8/grammar';
import { GRADE_8_VOCABULARY_QUESTIONS } from './grade8/vocabulary';
import { GRADE_8_READING_QUESTIONS } from './grade8/reading';
import { GRADE_8_LISTENING_QUESTIONS } from './grade8/listening';

export {
  GRADE_7_GRAMMAR_QUESTIONS,
  GRADE_7_VOCABULARY_QUESTIONS,
  GRADE_7_READING_QUESTIONS,
  GRADE_7_LISTENING_QUESTIONS,
  GRADE_8_GRAMMAR_QUESTIONS,
  GRADE_8_VOCABULARY_QUESTIONS,
  GRADE_8_READING_QUESTIONS,
  GRADE_8_LISTENING_QUESTIONS,
};

export const GRADE_7_STARTER_QUESTIONS: QuestionBankItem[] = [
  ...GRADE_7_GRAMMAR_QUESTIONS,
  ...GRADE_7_VOCABULARY_QUESTIONS,
  ...GRADE_7_READING_QUESTIONS,
  ...GRADE_7_LISTENING_QUESTIONS,
];

export const GRADE_8_STARTER_QUESTIONS: QuestionBankItem[] = [
  ...GRADE_8_GRAMMAR_QUESTIONS,
  ...GRADE_8_VOCABULARY_QUESTIONS,
  ...GRADE_8_READING_QUESTIONS,
  ...GRADE_8_LISTENING_QUESTIONS,
];

export const ALL_GENERAL_ENGLISH_STARTER_QUESTIONS: QuestionBankItem[] = [
  ...GRADE_7_STARTER_QUESTIONS,
  ...GRADE_8_STARTER_QUESTIONS,
];

export default ALL_GENERAL_ENGLISH_STARTER_QUESTIONS;

