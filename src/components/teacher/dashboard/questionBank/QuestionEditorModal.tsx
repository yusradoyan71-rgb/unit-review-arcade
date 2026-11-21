/**
 * UNIT REVIEW ARCADE — QUESTION EDITOR MODAL (PHASE 2)
 * Version: 2.0.0
 * 
 * Comprehensive question creator, editor, and cloner supporting all compatible
 * question types (Multiple Choice, Match Pairs, Sentence Builder, True/False,
 * Reading Passage, Vocabulary Clue).
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  Trash2,
  AlertTriangle,
  Loader2,
  Sparkles,
  Shuffle,
  BookOpen,
  HelpCircle,
  Layers,
  AlignLeft,
  CheckCircle2,
  Save,
} from 'lucide-react';
import { TeacherApiService } from '../../../../services/teacherApiService';
import { useTeacherAuth } from '../../../../context/TeacherAuthContext';
import type {
  QuestionBankItem,
  QuestionType,
  LearningSection,
  EnglishSkill,
  QuestionDifficulty,
  QuestionPayload,
} from '../../../../types/questionBank';
import type { GameType, GradeId } from '../../../../types/schema';
import { determineCompatibleGameTypes } from '../../../../utils/questionBankCompat';

interface QuestionEditorModalProps {
  isOpen: boolean;
  editingQuestion: QuestionBankItem | null;
  isClone?: boolean;
  onClose: () => void;
  onSuccess: (savedQuestion: QuestionBankItem, isNew: boolean) => void;
}

const PRESET_UNITS = [
  { id: 'g7-u1', gradeId: 'grade-7', title: 'Unit 1: Life Online' },
  { id: 'g7-u2', gradeId: 'grade-7', title: 'Unit 2: In and Out of Danger' },
  { id: 'g8-u1', gradeId: 'grade-8', title: 'Unit 1: Music Makes the World Go Round' },
  { id: 'g8-u2', gradeId: 'grade-8', title: 'Unit 2: What an Adventure!' },
  { id: 'g8-u3', gradeId: 'grade-8', title: 'Unit 3: Travel to Britain' },
  { id: 'g8-u4', gradeId: 'grade-8', title: 'Unit 4: What an Adventure!' },
];

export const QuestionEditorModal: React.FC<QuestionEditorModalProps> = ({
  isOpen,
  editingQuestion,
  isClone = false,
  onClose,
  onSuccess,
}) => {
  const { teacherSession } = useTeacherAuth();

  // Basic Metadata
  const [section, setSection] = useState<LearningSection>('general_english');
  const [gradeId, setGradeId] = useState<GradeId | 'all'>('all');
  const [unitId, setUnitId] = useState<string>('');
  const [unitTitle, setUnitTitle] = useState<string>('');
  const [topic, setTopic] = useState<string>('');
  const [skill, setSkill] = useState<EnglishSkill>('grammar');
  const [difficulty, setDifficulty] = useState<QuestionDifficulty>('medium');
  const [questionType, setQuestionType] = useState<QuestionType>('multiple_choice');
  const [prompt, setPrompt] = useState<string>('');
  const [explanation, setExplanation] = useState<string>('');
  const [points, setPoints] = useState<number>(10);
  const [tagsStr, setTagsStr] = useState<string>('');
  const [assignedGames, setAssignedGames] = useState<GameType[]>(['quiz_battle']);

  // MCQ State
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctOptionIndex, setCorrectOptionIndex] = useState<number>(0);

  // Match It State
  const [pairs, setPairs] = useState<Array<{ id: string; left: string; right: string }>>([
    { id: 'p1', left: '', right: '' },
    { id: 'p2', left: '', right: '' },
    { id: 'p3', left: '', right: '' },
  ]);

  // Sentence Builder State
  const [correctSentence, setCorrectSentence] = useState<string>('');
  const [scrambledWords, setScrambledWords] = useState<string[]>([]);
  const [alternativeAnswersStr, setAlternativeAnswersStr] = useState<string>('');

  // True / False State
  const [isTrue, setIsTrue] = useState<boolean>(true);

  // Reading Passage State
  const [passageTitle, setPassageTitle] = useState<string>('');
  const [passageText, setPassageText] = useState<string>('');

  // Vocabulary Item State
  const [targetWord, setTargetWord] = useState<string>('');
  const [distractorWordsStr, setDistractorWordsStr] = useState<string>('');

  // Form Status
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Load question data when modal opens
  useEffect(() => {
    if (!isOpen) return;

    if (editingQuestion) {
      setSection(editingQuestion.section);
      setGradeId(editingQuestion.gradeId);
      setUnitId(editingQuestion.unitId || '');
      setUnitTitle(editingQuestion.unitTitle || '');
      setTopic(editingQuestion.topic || '');
      setSkill(editingQuestion.skill || 'grammar');
      setDifficulty(editingQuestion.difficulty || 'medium');
      setQuestionType(editingQuestion.questionType || 'multiple_choice');
      setPrompt(isClone ? `${editingQuestion.prompt} (Copy)` : editingQuestion.prompt);
      setExplanation(editingQuestion.explanation || '');
      setPoints(editingQuestion.points || 10);
      setTagsStr((editingQuestion.tags || []).join(', '));
      setAssignedGames(editingQuestion.assignedGameTypes || determineCompatibleGameTypes(editingQuestion.questionType));

      // Payload
      const p = editingQuestion.payload || {};
      setOptions(p.options && p.options.length > 0 ? [...p.options] : ['', '', '', '']);
      setCorrectOptionIndex(p.correctOptionIndex ?? 0);
      setPairs(p.pairs && p.pairs.length > 0 ? JSON.parse(JSON.stringify(p.pairs)) : [
        { id: 'p1', left: '', right: '' },
        { id: 'p2', left: '', right: '' },
      ]);
      setCorrectSentence(p.correctSentence || '');
      setScrambledWords(p.scrambledWords ? [...p.scrambledWords] : []);
      setAlternativeAnswersStr((p.acceptedAnswers || []).join('\n'));
      setIsTrue(p.isTrue ?? true);
      setPassageTitle(p.passageTitle || '');
      setPassageText(p.passageText || '');
      setTargetWord(p.targetWord || '');
      setDistractorWordsStr((p.distractorWords || []).join(', '));
    } else {
      // Defaults for brand new question
      setSection('general_english');
      setGradeId('all');
      setUnitId('');
      setUnitTitle('');
      setTopic('');
      setSkill('grammar');
      setDifficulty('medium');
      setQuestionType('multiple_choice');
      setPrompt('');
      setExplanation('');
      setPoints(10);
      setTagsStr('');
      setAssignedGames(['quiz_battle']);
      setOptions(['', '', '', '']);
      setCorrectOptionIndex(0);
      setPairs([
        { id: 'p1', left: '', right: '' },
        { id: 'p2', left: '', right: '' },
        { id: 'p3', left: '', right: '' },
      ]);
      setCorrectSentence('');
      setScrambledWords([]);
      setAlternativeAnswersStr('');
      setIsTrue(true);
      setPassageTitle('');
      setPassageText('');
      setTargetWord('');
      setDistractorWordsStr('');
    }

    setValidationError(null);
    setIsSaving(false);
  }, [isOpen, editingQuestion, isClone]);

  // Automatically update assigned games when question type changes
  const handleTypeChange = (newType: QuestionType) => {
    setQuestionType(newType);
    setAssignedGames(determineCompatibleGameTypes(newType));
  };

  // Helper for sentence builder auto-split
  const handleAutoScramble = () => {
    if (!correctSentence.trim()) return;
    const words = correctSentence.trim().split(/\s+/).map((w) => w.trim()).filter(Boolean);
    // Shuffle words
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setScrambledWords(shuffled);
  };

  // MCQ option handlers
  const handleOptionChange = (index: number, val: string) => {
    setOptions((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions((prev) => [...prev, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions((prev) => prev.filter((_, i) => i !== index));
      if (correctOptionIndex >= options.length - 1) {
        setCorrectOptionIndex(0);
      }
    }
  };

  // Pair handlers
  const handlePairChange = (index: number, side: 'left' | 'right', val: string) => {
    setPairs((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [side]: val };
      return next;
    });
  };

  const handleAddPair = () => {
    setPairs((prev) => [...prev, { id: `p${prev.length + 1}`, left: '', right: '' }]);
  };

  const handleRemovePair = (index: number) => {
    if (pairs.length > 2) {
      setPairs((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validation
    if (!prompt.trim()) {
      setValidationError('Please enter a question prompt.');
      return;
    }
    if (!topic.trim()) {
      setValidationError('Please enter a topic name (e.g. "Present Simple", "Emergency Vocabulary").');
      return;
    }

    const payload: QuestionPayload = {};
    let answerPreview = '';

    if (questionType === 'multiple_choice' || questionType === 'reading_passage') {
      const cleanedOptions = options.map((o) => o.trim());
      if (cleanedOptions.some((o) => !o)) {
        setValidationError('All multiple choice options must be non-empty.');
        return;
      }
      if (cleanedOptions.length < 2) {
        setValidationError('Please provide at least 2 options.');
        return;
      }
      payload.options = cleanedOptions;
      payload.correctOptionIndex = correctOptionIndex;
      answerPreview = `${String.fromCharCode(65 + correctOptionIndex)}) ${cleanedOptions[correctOptionIndex]}`;

      if (questionType === 'reading_passage') {
        if (!passageText.trim()) {
          setValidationError('Please provide the reading passage text.');
          return;
        }
        payload.passageTitle = passageTitle.trim() || 'Reading Passage';
        payload.passageText = passageText.trim();
        payload.passageId = `passage_${Date.now()}`;
      }
    } else if (questionType === 'sentence_builder') {
      if (!correctSentence.trim()) {
        setValidationError('Please provide the complete correct sentence.');
        return;
      }
      const words = (scrambledWords.length > 0 ? scrambledWords : correctSentence.trim().split(/\s+/))
        .map((w) => w.trim())
        .filter(Boolean);
      payload.correctSentence = correctSentence.trim();
      payload.scrambledWords = words;
      payload.acceptedAnswers = alternativeAnswersStr
        .split('\n')
        .map((a) => a.trim())
        .filter(Boolean);
      answerPreview = correctSentence.trim();
    } else if (questionType === 'true_false') {
      payload.isTrue = isTrue;
      answerPreview = isTrue ? 'TRUE' : 'FALSE';
    } else if (questionType === 'match_it') {
      const validPairs = pairs.filter((p) => p.left.trim() && p.right.trim());
      if (validPairs.length < 2) {
        setValidationError('Please provide at least 2 valid matching pairs.');
        return;
      }
      payload.pairs = validPairs.map((p, i) => ({ id: `p${i + 1}`, left: p.left.trim(), right: p.right.trim() }));
      answerPreview = validPairs.slice(0, 3).map((p) => `${p.left} = ${p.right}`).join('; ');
    } else if (questionType === 'vocabulary_item') {
      if (!targetWord.trim()) {
        setValidationError('Target word is required for vocabulary item.');
        return;
      }
      payload.targetWord = targetWord.trim();
      payload.distractorWords = distractorWordsStr.split(',').map((w) => w.trim()).filter(Boolean);
      answerPreview = targetWord.trim();
    }

    const tags = tagsStr
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const questionToSave: Partial<QuestionBankItem> & {
      prompt: string;
      questionType: QuestionType;
      skill: EnglishSkill;
      topic: string;
      section: LearningSection;
      assignedGameTypes: GameType[];
      payload: QuestionPayload;
    } = {
      ...(editingQuestion && !isClone ? { id: editingQuestion.id } : {}),
      prompt: prompt.trim(),
      section,
      gradeId,
      unitId: unitId || undefined,
      unitTitle: unitTitle || undefined,
      topic: topic.trim(),
      skill,
      difficulty,
      questionType,
      assignedGameTypes: assignedGames.length > 0 ? assignedGames : ['quiz_battle'],
      payload,
      correctAnswerPreview: answerPreview,
      explanation: explanation.trim() || undefined,
      points: Number(points) || 10,
      tags,
      status: 'active',
    };

    if (!teacherSession?.teacherToken) {
      setValidationError('Active teacher authentication is required.');
      return;
    }

    setIsSaving(true);

    try {
      const res = await TeacherApiService.saveQuestion(teacherSession.teacherToken, questionToSave);
      if (res.success && res.question) {
        const fullSavedItem: QuestionBankItem = {
          ...questionToSave,
          id: res.question.id,
          contentVersion: res.question.contentVersion || 1,
          status: 'active',
          correctAnswerPreview: answerPreview,
          points: Number(points) || 10,
          tags,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as QuestionBankItem;

        onSuccess(fullSavedItem, Boolean(res.created));
        onClose();
      } else {
        setValidationError(res.error || 'Failed to save question to server.');
      }
    } catch (err) {
      setValidationError(err instanceof Error ? err.message : 'Network error while saving question.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/65 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="relative w-full max-w-3xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-teal-800 to-indigo-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-xs border border-white/15">
                <Sparkles className="w-5 h-5 text-teal-200" />
              </div>
              <div>
                <h3 className="text-base font-bold">
                  {isClone ? 'Clone Question' : editingQuestion ? 'Edit Question' : 'Create New Question'}
                </h3>
                <p className="text-xs text-teal-200 font-medium">
                  {section === 'both' ? 'Unit Review & General English' : section.replace('_', ' ')}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
            {validationError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-semibold">{validationError}</span>
              </div>
            )}

            {/* Classification & Metadata Grid */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3.5">
              <span className="font-bold uppercase tracking-wider text-slate-500 text-[10px] block">
                1. Classification & Scope
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Section */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Learning Section</label>
                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value as LearningSection)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-xs focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="general_english">General English (Skill Hub)</option>
                    <option value="unit_review">Unit Review (Curriculum)</option>
                    <option value="both">Both (Shared Pool)</option>
                  </select>
                </div>

                {/* Grade */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Grade</label>
                  <select
                    value={gradeId}
                    onChange={(e) => setGradeId(e.target.value as GradeId | 'all')}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-xs focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="all">All Grades (Universal)</option>
                    <option value="grade-7">Grade 7</option>
                    <option value="grade-8">Grade 8</option>
                  </select>
                </div>

                {/* Skill */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">English Skill</label>
                  <select
                    value={skill}
                    onChange={(e) => setSkill(e.target.value as EnglishSkill)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-xs focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="grammar">Grammar</option>
                    <option value="vocabulary">Vocabulary</option>
                    <option value="reading">Reading</option>
                    <option value="listening">Listening / Dictation</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {/* Topic */}
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Topic / Grammar Target</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Present Continuous, Daily Routines, Synonyms"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-xs focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Difficulty */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as QuestionDifficulty)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-xs focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="easy">Easy (Foundational)</option>
                    <option value="medium">Medium (Standard)</option>
                    <option value="challenging">Challenging (Advanced)</option>
                  </select>
                </div>
              </div>

              {/* Optional Unit selector if unit_review or both */}
              {(section === 'unit_review' || section === 'both') && (
                <div className="pt-1">
                  <label className="font-bold text-slate-700 block mb-1">Associated Curriculum Unit</label>
                  <select
                    value={unitId}
                    onChange={(e) => {
                      const uid = e.target.value;
                      setUnitId(uid);
                      const found = PRESET_UNITS.find((u) => u.id === uid);
                      if (found) setUnitTitle(found.title);
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-xs focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">None / Unassigned</option>
                    {PRESET_UNITS.map((u) => (
                      <option key={u.id} value={u.id}>
                        [{u.gradeId.toUpperCase()}] {u.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Question Type Selection */}
            <div className="space-y-2">
              <label className="font-bold uppercase tracking-wider text-slate-500 text-[10px] block">
                2. Question Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'multiple_choice', label: 'Multiple Choice', icon: HelpCircle },
                  { id: 'match_it', label: 'Match It (Pairs)', icon: Layers },
                  { id: 'sentence_builder', label: 'Sentence Builder', icon: AlignLeft },
                  { id: 'true_false', label: 'True or False', icon: CheckCircle2 },
                  { id: 'reading_passage', label: 'Reading Passage', icon: BookOpen },
                  { id: 'vocabulary_item', label: 'Vocabulary Clue', icon: Sparkles },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = questionType === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleTypeChange(item.id as QuestionType)}
                      className={`p-3 rounded-xl border-2 text-left font-bold flex items-center gap-2 transition-all ${
                        isSelected
                          ? 'border-teal-600 bg-teal-50/70 text-teal-900 shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-teal-600' : 'text-slate-400'}`} />
                      <span className="text-xs">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reading Passage Fields (if reading_passage) */}
            {questionType === 'reading_passage' && (
              <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200 space-y-3">
                <span className="font-bold text-cyan-950 block">Passage Content</span>
                <input
                  type="text"
                  value={passageTitle}
                  onChange={(e) => setPassageTitle(e.target.value)}
                  placeholder="Passage Title (e.g. 'A Day at the Animal Shelter')"
                  className="w-full p-2.5 rounded-xl border border-cyan-300 bg-white font-medium text-xs focus:ring-2 focus:ring-cyan-500"
                />
                <textarea
                  rows={4}
                  value={passageText}
                  onChange={(e) => setPassageText(e.target.value)}
                  placeholder="Paste or write the reading passage here..."
                  className="w-full p-2.5 rounded-xl border border-cyan-300 bg-white font-medium text-xs focus:ring-2 focus:ring-cyan-500 leading-relaxed"
                />
              </div>
            )}

            {/* Prompt Field */}
            <div className="space-y-1.5">
              <label className="font-bold uppercase tracking-wider text-slate-500 text-[10px] block">
                3. Question Prompt / Task Instruction
              </label>
              <textarea
                rows={2}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  questionType === 'sentence_builder'
                    ? 'e.g. Unscramble the sentence describing daily digital habits:'
                    : questionType === 'true_false'
                    ? 'e.g. Downloading means copying files from the internet onto your device.'
                    : 'e.g. She _____ to the library every Friday afternoon.'
                }
                className="w-full p-3 rounded-xl border border-slate-300 bg-white font-medium text-xs focus:ring-2 focus:ring-teal-500 leading-relaxed"
              />
            </div>

            {/* Dynamic Content Fields by Type */}

            {/* TYPE 1: Multiple Choice / Reading Passage */}
            {(questionType === 'multiple_choice' || questionType === 'reading_passage') && (
              <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase tracking-wider text-slate-500 text-[10px]">
                    Answer Choices (Select the radio of the correct choice)
                  </span>
                  {options.length < 5 && (
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Option</span>
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <label className="flex items-center gap-2 cursor-pointer shrink-0">
                        <input
                          type="radio"
                          name="correctOption"
                          checked={correctOptionIndex === idx}
                          onChange={() => setCorrectOptionIndex(idx)}
                          className="w-4 h-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                        />
                        <span className="w-6 h-6 rounded-lg bg-slate-200 font-bold text-[11px] text-slate-800 flex items-center justify-center">
                          {String.fromCharCode(65 + idx)}
                        </span>
                      </label>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                        placeholder={`Option ${String.fromCharCode(65 + idx)} text`}
                        className={`flex-1 p-2.5 rounded-xl border font-medium text-xs bg-white ${
                          correctOptionIndex === idx
                            ? 'border-teal-500 ring-1 ring-teal-500/20'
                            : 'border-slate-300'
                        }`}
                      />
                      {options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(idx)}
                          className="p-2 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                          title="Remove option"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TYPE 2: Sentence Builder */}
            {questionType === 'sentence_builder' && (
              <div className="space-y-3 p-4 rounded-2xl bg-purple-50/60 border border-purple-200">
                <span className="font-bold text-purple-950 text-xs block">
                  Sentence Unscramble Configuration
                </span>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Correct Sentence</label>
                  <input
                    type="text"
                    value={correctSentence}
                    onChange={(e) => setCorrectSentence(e.target.value)}
                    placeholder="e.g. She checks her messages every morning before breakfast."
                    className="w-full p-2.5 rounded-xl border border-purple-300 bg-white font-medium text-xs focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-bold text-purple-900">Word Chips:</span>
                  <button
                    type="button"
                    onClick={handleAutoScramble}
                    className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-2xs"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>Auto-Generate from Sentence</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-white border border-purple-200 min-h-12 items-center">
                  {scrambledWords.length === 0 ? (
                    <span className="text-slate-400 italic">Click "Auto-Generate" to split words.</span>
                  ) : (
                    scrambledWords.map((word, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-900 font-bold font-mono text-[11px] border border-purple-200"
                      >
                        {word}
                      </span>
                    ))
                  )}
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Alternative Accepted Sentences (Optional, one per line)
                  </label>
                  <textarea
                    rows={2}
                    value={alternativeAnswersStr}
                    onChange={(e) => setAlternativeAnswersStr(e.target.value)}
                    placeholder="Every morning before breakfast she checks her messages."
                    className="w-full p-2.5 rounded-xl border border-purple-300 bg-white font-medium text-xs"
                  />
                </div>
              </div>
            )}

            {/* TYPE 3: True / False */}
            {questionType === 'true_false' && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <span className="font-bold text-slate-700 text-xs block">
                  Correct Truth Value:
                </span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-emerald-700">
                    <input
                      type="radio"
                      name="tfRadio"
                      checked={isTrue === true}
                      onChange={() => setIsTrue(true)}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>TRUE</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-rose-700">
                    <input
                      type="radio"
                      name="tfRadio"
                      checked={isTrue === false}
                      onChange={() => setIsTrue(false)}
                      className="w-4 h-4 text-rose-600 focus:ring-rose-500"
                    />
                    <span>FALSE</span>
                  </label>
                </div>
              </div>
            )}

            {/* TYPE 4: Match It Pairs */}
            {questionType === 'match_it' && (
              <div className="space-y-3 p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-950 text-xs">Matching Pairs (Left ↔ Right)</span>
                  <button
                    type="button"
                    onClick={handleAddPair}
                    className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Pair</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {pairs.map((pair, idx) => (
                    <div key={pair.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={pair.left}
                        onChange={(e) => handlePairChange(idx, 'left', e.target.value)}
                        placeholder={`Left card ${idx + 1} (e.g. Huge)`}
                        className="flex-1 p-2.5 rounded-xl border border-indigo-300 bg-white font-medium text-xs"
                      />
                      <span className="font-bold text-indigo-400">↔</span>
                      <input
                        type="text"
                        value={pair.right}
                        onChange={(e) => handlePairChange(idx, 'right', e.target.value)}
                        placeholder={`Right card ${idx + 1} (e.g. Enormous)`}
                        className="flex-1 p-2.5 rounded-xl border border-indigo-300 bg-white font-medium text-xs"
                      />
                      {pairs.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePair(idx)}
                          className="p-2 text-slate-400 hover:text-rose-600 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TYPE 5: Vocabulary Clue */}
            {questionType === 'vocabulary_item' && (
              <div className="space-y-3 p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
                <span className="font-bold text-amber-950 text-xs block">Vocabulary Target & Distractors</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Target Correct Word</label>
                    <input
                      type="text"
                      value={targetWord}
                      onChange={(e) => setTargetWord(e.target.value)}
                      placeholder="e.g. Enormous"
                      className="w-full p-2.5 rounded-xl border border-amber-300 bg-white font-medium text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Distractors (Comma-separated)</label>
                    <input
                      type="text"
                      value={distractorWordsStr}
                      onChange={(e) => setDistractorWordsStr(e.target.value)}
                      placeholder="e.g. Tiny, Small, Microscopic"
                      className="w-full p-2.5 rounded-xl border border-amber-300 bg-white font-medium text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Explanation & Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="font-bold uppercase tracking-wider text-slate-500 text-[10px] block">
                  Pedagogical Feedback / Explanation (Shown after answering)
                </label>
                <textarea
                  rows={2}
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Explain why this answer is correct or clarify common misconceptions..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-xs focus:ring-2 focus:ring-teal-500 leading-relaxed"
                />
              </div>

              <div className="space-y-2">
                <div>
                  <label className="font-bold uppercase tracking-wider text-slate-500 text-[10px] block mb-1">
                    Points
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={points}
                    onChange={(e) => setPoints(Number(e.target.value) || 10)}
                    className="w-full p-2 rounded-xl border border-slate-300 bg-white font-medium text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold uppercase tracking-wider text-slate-500 text-[10px] block mb-1">
                    Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={tagsStr}
                    onChange={(e) => setTagsStr(e.target.value)}
                    placeholder="lgs-exam, irregular-verbs"
                    className="w-full p-2 rounded-xl border border-slate-300 bg-white font-medium text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Submit Actions */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Question...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{isClone ? 'Create Cloned Question' : editingQuestion ? 'Update Question' : 'Save Question'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
