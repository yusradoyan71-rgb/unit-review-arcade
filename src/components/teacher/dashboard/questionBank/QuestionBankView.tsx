/**
 * UNIT REVIEW ARCADE — QUESTION BANK VIEW (PHASE 2)
 * Version: 2.0.0
 * 
 * Interactive Question Bank management cockpit for the Teacher Dashboard.
 * Supports multi-dimensional filtering, searching, interactive previews,
 * editing, cloning, and safe non-destructive archiving.
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Search,
  PlusCircle,
  Eye,
  Edit,
  Copy,
  Archive,
  RefreshCw,
  BookOpen,
  HelpCircle,
  Layers,
  AlignLeft,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  X,
  Database,
  Upload,
  Download,
  RotateCcw,
  FileSpreadsheet,
  ChevronDown,
} from 'lucide-react';
import { TeacherApiService } from '../../../../services/teacherApiService';
import { useTeacherAuth } from '../../../../context/TeacherAuthContext';
import { useArcade } from '../../../../context/ArcadeContext';
import type {
  QuestionBankItem,
  LearningSection,
  EnglishSkill,
  QuestionDifficulty,
  QuestionType,
} from '../../../../types/questionBank';
import type { GradeId } from '../../../../types/schema';
import { QuestionEditorModal } from './QuestionEditorModal';
import { QuestionPreviewModal } from './QuestionPreviewModal';
import { ArchiveQuestionModal } from './ArchiveQuestionModal';
import {
  BulkImportModal,
  type LastImportReceipt,
  LAST_IMPORT_STORAGE_KEY,
} from './BulkImportModal';
import { RollbackImportModal } from './RollbackImportModal';
import { exportQuestionBank } from '../../../../utils/questionTemplateGenerator';
import { convertAnyQuestionToBankItem } from '../../../../utils/questionBankCompat';

interface QuestionBankViewProps {
  onQuestionCountChange?: (count: number) => void;
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({
  onQuestionCountChange,
}) => {
  const { teacherSession } = useTeacherAuth();
  const { data: arcadeData, addToast } = useArcade();

  // State: Questions Data
  const [questions, setQuestions] = useState<QuestionBankItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // State: Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterSection, setFilterSection] = useState<LearningSection | 'all'>('all');
  const [filterGrade, setFilterGrade] = useState<GradeId | 'all'>('all');
  const [filterSkill, setFilterSkill] = useState<EnglishSkill | 'all'>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<QuestionDifficulty | 'all'>('all');
  const [filterQuestionType, setFilterQuestionType] = useState<QuestionType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'active' | 'archived' | 'all'>('active');

  // State: Built-in Catalog Seed Browser
  const [showBuiltInSeed, setShowBuiltInSeed] = useState<boolean>(false);

  // State: Active Modals
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionBankItem | null>(null);
  const [isCloneMode, setIsCloneMode] = useState<boolean>(false);

  const [previewQuestion, setPreviewQuestion] = useState<QuestionBankItem | null>(null);
  const [archiveTargetQuestion, setArchiveTargetQuestion] = useState<QuestionBankItem | null>(null);

  // Phase 3 State: Import, Export & Safe Rollback
  const [isBulkImportOpen, setIsBulkImportOpen] = useState<boolean>(false);
  const [isRollbackOpen, setIsRollbackOpen] = useState<boolean>(false);
  const [lastImportReceipt, setLastImportReceipt] = useState<LastImportReceipt | null>(null);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState<boolean>(false);

  // Load last import receipt from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(LAST_IMPORT_STORAGE_KEY);
        if (stored) {
          setLastImportReceipt(JSON.parse(stored));
        }
      } catch {}
    }
  }, []);

  // Fetch Questions from Google Apps Script Backend
  const loadQuestionBank = useCallback(async (isSilent = false) => {
    if (!teacherSession?.teacherToken) return;

    if (!isSilent) setIsLoading(true);
    setIsRefreshing(true);
    setError(null);

    try {
      const res = await TeacherApiService.getQuestionBank(teacherSession.teacherToken, {
        status: 'all', // Fetch all and filter client-side for rapid switching
      });

      if (res.success && res.questions) {
        setQuestions(res.questions);
        if (onQuestionCountChange) {
          onQuestionCountChange(res.questions.filter((q) => q.status === 'active').length);
        }
      } else {
        setError(res.error || 'Failed to load question bank.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error loading Question Bank.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [teacherSession?.teacherToken, onQuestionCountChange]);

  useEffect(() => {
    loadQuestionBank();
  }, [loadQuestionBank]);

  // Extract all built-in curriculum questions as fallback/seed items
  const builtInQuestions: QuestionBankItem[] = useMemo(() => {
    if (!arcadeData || !arcadeData.units) return [];
    const items: QuestionBankItem[] = [];

    const grades: GradeId[] = ['grade-7', 'grade-8'];
    grades.forEach((gId) => {
      const units = arcadeData.units[gId] || [];
      units.forEach((unit) => {
        const activities = unit.activities || [];
        activities.forEach((act) => {
          (act.questions || []).forEach((q) => {
            items.push(
              convertAnyQuestionToBankItem(q, {
                section: 'unit_review',
                gradeId: gId,
                unitId: unit.id,
                unitTitle: unit.title,
                topic: act.title,
                skill: act.gameType === 'sentence_builder' ? 'grammar' : 'vocabulary',
                difficulty: q.difficulty || 'medium',
                assignedGameTypes: [act.gameType],
                tags: [gId, unit.id, act.gameType],
              })
            );
          });
        });
      });
    });

    return items;
  }, [arcadeData]);

  // Combine or select active question pool
  const activePool = useMemo(() => {
    if (questions.length === 0 && showBuiltInSeed) {
      return builtInQuestions;
    }
    return questions;
  }, [questions, showBuiltInSeed, builtInQuestions]);

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    return activePool.filter((q) => {
      // Status filter
      if (filterStatus !== 'all' && q.status !== filterStatus) return false;

      // Section filter
      if (filterSection !== 'all') {
        if (q.section !== filterSection && q.section !== 'both') return false;
      }

      // Grade filter
      if (filterGrade !== 'all') {
        if (q.gradeId !== filterGrade && q.gradeId !== 'all') return false;
      }

      // Skill filter
      if (filterSkill !== 'all' && q.skill !== filterSkill) return false;

      // Difficulty filter
      if (filterDifficulty !== 'all' && q.difficulty !== filterDifficulty) return false;

      // Question type filter
      if (filterQuestionType !== 'all' && q.questionType !== filterQuestionType) return false;

      // Search query (prompt, topic, preview, tags)
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchPrompt = q.prompt.toLowerCase().includes(query);
        const matchTopic = q.topic.toLowerCase().includes(query);
        const matchPreview = (q.correctAnswerPreview || '').toLowerCase().includes(query);
        const matchTags = (q.tags || []).some((t) => t.toLowerCase().includes(query));
        const matchId = q.id.toLowerCase().includes(query);

        if (!matchPrompt && !matchTopic && !matchPreview && !matchTags && !matchId) {
          return false;
        }
      }

      return true;
    });
  }, [
    activePool,
    filterStatus,
    filterSection,
    filterGrade,
    filterSkill,
    filterDifficulty,
    filterQuestionType,
    searchQuery,
  ]);

  // Stats Breakdown
  const stats = useMemo(() => {
    const active = activePool.filter((q) => q.status === 'active');
    const grammar = active.filter((q) => q.skill === 'grammar').length;
    const vocabulary = active.filter((q) => q.skill === 'vocabulary').length;
    const reading = active.filter((q) => q.skill === 'reading').length;
    const listening = active.filter((q) => q.skill === 'listening').length;

    const unitReview = active.filter((q) => q.section === 'unit_review' || q.section === 'both').length;
    const general = active.filter((q) => q.section === 'general_english' || q.section === 'both').length;

    return {
      total: activePool.length,
      active: active.length,
      archived: activePool.length - active.length,
      grammar,
      vocabulary,
      reading,
      listening,
      unitReview,
      general,
    };
  }, [activePool]);

  // Handlers for CRUD
  const handleOpenCreate = () => {
    setEditingQuestion(null);
    setIsCloneMode(false);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (q: QuestionBankItem) => {
    setEditingQuestion(q);
    setIsCloneMode(false);
    setIsEditorOpen(true);
  };

  const handleOpenClone = (q: QuestionBankItem) => {
    setEditingQuestion(q);
    setIsCloneMode(true);
    setIsEditorOpen(true);
  };

  const handleArchiveConfirm = async (questionId: string) => {
    if (!teacherSession?.teacherToken) return;

    const res = await TeacherApiService.archiveQuestion(teacherSession.teacherToken, questionId);
    if (res.success) {
      setQuestions((prev) =>
        prev.map((q) => (q.id === questionId ? { ...q, status: 'archived' } : q))
      );
      addToast('Question archived successfully.', 'info');
    } else {
      throw new Error(res.error || 'Failed to archive question');
    }
  };

  const handleSaveSuccess = (savedQuestion: QuestionBankItem, isNew: boolean) => {
    if (isNew) {
      setQuestions((prev) => [savedQuestion, ...prev]);
      addToast('Question created successfully in Question Bank!', 'success');
    } else {
      setQuestions((prev) =>
        prev.map((q) => (q.id === savedQuestion.id ? savedQuestion : q))
      );
      addToast('Question updated successfully!', 'success');
    }
  };

  const handleImportSuccess = (receipt: LastImportReceipt) => {
    setLastImportReceipt(receipt);
    loadQuestionBank(true);
    addToast(`Successfully imported ${receipt.count} questions into Question Bank!`, 'success');
  };

  const handleRollbackSuccess = (rolledBackCount: number) => {
    setLastImportReceipt(null);
    loadQuestionBank(true);
    addToast(`Import rolled back: ${rolledBackCount} questions safely removed.`, 'info');
  };

  const handleExport = async (format: 'xlsx' | 'csv' | 'json') => {
    setIsExportMenuOpen(false);
    try {
      await exportQuestionBank(filteredQuestions, format);
      addToast(`Exported ${filteredQuestions.length} questions as .${format.toUpperCase()}!`, 'success');
    } catch (err) {
      addToast(`Export failed: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
    }
  };

  const getQuestionTypeIcon = (type: QuestionType) => {
    switch (type) {
      case 'multiple_choice':
        return HelpCircle;
      case 'match_it':
        return Layers;
      case 'sentence_builder':
        return AlignLeft;
      case 'true_false':
        return CheckCircle2;
      case 'reading_passage':
        return BookOpen;
      case 'vocabulary_item':
        return Sparkles;
      default:
        return HelpCircle;
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Header Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-teal-900 via-teal-800 to-indigo-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5 border border-teal-700/50">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xs border border-white/20">
              <Database className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Question Bank Manager</h2>
              <p className="text-xs text-teal-200 font-medium">
                Unified content repository for Unit Review and General English practice
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
            <div className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
              <span className="text-teal-200">Active: </span>
              <strong className="text-white font-bold">{stats.active}</strong>
            </div>
            <div className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
              <span className="text-teal-200">Unit Review: </span>
              <strong className="text-white font-bold">{stats.unitReview}</strong>
            </div>
            <div className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
              <span className="text-teal-200">General English: </span>
              <strong className="text-white font-bold">{stats.general}</strong>
            </div>
            <div className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 hidden sm:inline-block">
              <span className="text-teal-200">Grammar: </span>
              <strong className="text-white font-bold">{stats.grammar}</strong>
              <span className="text-teal-300 mx-1">•</span>
              <span className="text-teal-200">Vocab: </span>
              <strong className="text-white font-bold">{stats.vocabulary}</strong>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start md:self-center flex-wrap">
          <button
            type="button"
            onClick={() => loadQuestionBank(false)}
            disabled={isRefreshing}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-teal-100 hover:text-white border border-white/15 transition-colors disabled:opacity-50"
            title="Refresh Question Bank"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsExportMenuOpen((prev) => !prev)}
              className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-teal-100 hover:text-white border border-white/15 transition-colors text-xs font-bold flex items-center gap-1.5"
              title="Export Question Bank"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {isExportMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white text-slate-800 shadow-xl border border-slate-200 py-1.5 z-20 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => handleExport('xlsx')}
                  className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Export as Excel (.xlsx)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleExport('csv')}
                  className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-teal-600" />
                  <span>Export as CSV (.csv)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleExport('json')}
                  className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-indigo-700"
                >
                  <Database className="w-4 h-4" />
                  <span>Full JSON Backup</span>
                </button>
              </div>
            )}
          </div>

          {/* Rollback Last Import (visible if last import receipt exists) */}
          {lastImportReceipt && (
            <button
              type="button"
              onClick={() => setIsRollbackOpen(true)}
              className="px-3 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 hover:text-amber-100 border border-amber-400/30 transition-all text-xs font-bold flex items-center gap-1.5"
              title="Rollback last question import batch"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">Rollback Import</span>
              <span className="px-1.5 py-0.2 bg-amber-400 text-amber-950 font-black rounded text-[10px]">
                {lastImportReceipt.count}
              </span>
            </button>
          )}

          {/* Bulk Import Button */}
          <button
            type="button"
            onClick={() => setIsBulkImportOpen(true)}
            className="px-3.5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            title="Import questions from Excel or CSV"
          >
            <Upload className="w-4 h-4" />
            <span>Bulk Import</span>
          </button>

          {/* Create Question Button */}
          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-teal-950 font-extrabold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create</span>
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <div className="flex-1">
            <span className="font-bold block">Could not load Question Bank</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by question text, topic, answer, tags, or ID..."
              className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Section Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(['all', 'general_english', 'unit_review', 'both'] as const).map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => setFilterSection(sec)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  filterSection === sec
                    ? 'bg-teal-700 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sec === 'all'
                  ? 'All Sections'
                  : sec === 'general_english'
                  ? 'General English'
                  : sec === 'unit_review'
                  ? 'Unit Review'
                  : 'Shared (Both)'}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Detailed Filter Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 border-t border-slate-100 text-xs">
          {/* Skill Filter */}
          <div>
            <select
              value={filterSkill}
              onChange={(e) => setFilterSkill(e.target.value as EnglishSkill | 'all')}
              className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 text-[11px] font-medium"
            >
              <option value="all">All Skills</option>
              <option value="grammar">Grammar</option>
              <option value="vocabulary">Vocabulary</option>
              <option value="reading">Reading</option>
              <option value="listening">Listening</option>
            </select>
          </div>

          {/* Grade Filter */}
          <div>
            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value as GradeId | 'all')}
              className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 text-[11px] font-medium"
            >
              <option value="all">All Grades</option>
              <option value="grade-7">Grade 7</option>
              <option value="grade-8">Grade 8</option>
            </select>
          </div>

          {/* Question Type Filter */}
          <div>
            <select
              value={filterQuestionType}
              onChange={(e) => setFilterQuestionType(e.target.value as QuestionType | 'all')}
              className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 text-[11px] font-medium"
            >
              <option value="all">All Question Types</option>
              <option value="multiple_choice">Multiple Choice</option>
              <option value="match_it">Match Pairs</option>
              <option value="sentence_builder">Sentence Builder</option>
              <option value="true_false">True or False</option>
              <option value="reading_passage">Reading Passage</option>
              <option value="vocabulary_item">Vocabulary Clue</option>
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value as QuestionDifficulty | 'all')}
              className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 text-[11px] font-medium"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="challenging">Challenging</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'active' | 'archived' | 'all')}
              className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 text-[11px] font-medium"
            >
              <option value="active">Active Only</option>
              <option value="archived">Archived Questions</option>
              <option value="all">Active &amp; Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Seed Guidance Banner when database is fresh */}
      {questions.length === 0 && !isLoading && (
        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-teal-900">
          <div className="space-y-0.5">
            <span className="font-bold flex items-center gap-1.5 text-teal-950">
              <Sparkles className="w-4 h-4 text-teal-600" />
              Authoritative Question Bank is Ready!
            </span>
            <p className="text-teal-800 text-[11px]">
              No custom questions created yet. You can create your first question above, or toggle on the built-in curriculum questions catalog ({builtInQuestions.length} questions) to preview and clone them.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowBuiltInSeed((prev) => !prev)}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
              showBuiltInSeed
                ? 'bg-teal-700 text-white'
                : 'bg-white border border-teal-300 text-teal-800 hover:bg-teal-100'
            }`}
          >
            {showBuiltInSeed ? 'Hide Built-in Catalog' : `Explore Built-in Catalog (${builtInQuestions.length})`}
          </button>
        </div>
      )}

      {/* Results Count Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
        <span>
          Showing <strong className="text-slate-800 font-bold">{filteredQuestions.length}</strong> question{filteredQuestions.length === 1 ? '' : 's'}
        </span>
        {searchQuery && (
          <span className="text-[11px] text-teal-700">
            Matching "{searchQuery}"
          </span>
        )}
      </div>

      {/* Questions List */}
      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white border border-slate-200 h-28" />
          ))}
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="py-16 text-center text-slate-400 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Database className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-700">No questions match your filter criteria</h4>
            <p className="text-xs text-slate-400">Try adjusting your filters or search terms, or create a new question.</p>
          </div>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Question</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredQuestions.map((q) => {
            const TypeIcon = getQuestionTypeIcon(q.questionType);
            const isArchived = q.status === 'archived';

            return (
              <div
                key={q.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isArchived
                    ? 'bg-slate-50/60 border-slate-200 opacity-60'
                    : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-sm'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  {/* Left Column: Badges & Prompt */}
                  <div className="space-y-2 flex-1">
                    {/* Metadata Badges Bar */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Section Badge */}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          q.section === 'general_english'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : q.section === 'both'
                            ? 'bg-teal-50 text-teal-700 border border-teal-200'
                            : 'bg-sky-50 text-sky-700 border border-sky-200'
                        }`}
                      >
                        {q.section === 'both' ? 'Shared' : q.section.replace('_', ' ')}
                      </span>

                      {/* Skill Badge */}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-slate-100 text-slate-700">
                        {q.skill}
                      </span>

                      {/* Topic Badge */}
                      <span className="text-[10px] font-semibold text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                        {q.topic}
                      </span>

                      {/* Difficulty Badge */}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          q.difficulty === 'easy'
                            ? 'text-emerald-700 bg-emerald-50'
                            : q.difficulty === 'challenging'
                            ? 'text-rose-700 bg-rose-50'
                            : 'text-amber-700 bg-amber-50'
                        }`}
                      >
                        {q.difficulty}
                      </span>

                      {/* Type Icon Badge */}
                      <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                        <TypeIcon className="w-3 h-3 text-slate-400" />
                        <span>{q.questionType.replace('_', ' ')}</span>
                      </span>

                      {isArchived && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                          Archived
                        </span>
                      )}
                    </div>

                    {/* Question Prompt */}
                    <div className="text-sm font-bold text-slate-900 leading-snug">
                      {q.prompt}
                    </div>

                    {/* Answer Preview Box */}
                    {q.correctAnswerPreview && (
                      <div className="text-xs text-slate-600 flex items-center gap-1.5 pt-0.5">
                        <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200/80">
                          Answer:
                        </span>
                        <span className="font-medium text-slate-800">{q.correctAnswerPreview}</span>
                      </div>
                    )}

                    {/* Tags / Games footer */}
                    <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400 font-mono">
                      <span>ID: {q.id}</span>
                      <span>•</span>
                      <span>v{q.contentVersion}</span>
                      {q.assignedGameTypes && q.assignedGameTypes.length > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-slate-500 font-sans">
                            Games: <strong>{q.assignedGameTypes.join(', ')}</strong>
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                    {/* Preview Button */}
                    <button
                      type="button"
                      onClick={() => setPreviewQuestion(q)}
                      className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 font-bold text-xs flex items-center gap-1 transition-colors"
                      title="Interactive game preview"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Preview</span>
                    </button>

                    {/* Clone Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenClone(q)}
                      className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-teal-600 hover:border-teal-300 transition-colors"
                      title="Clone question"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {/* Edit Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(q)}
                      className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 transition-colors"
                      title="Edit question"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>

                    {/* Archive Button */}
                    {!isArchived && (
                      <button
                        type="button"
                        onClick={() => setArchiveTargetQuestion(q)}
                        className="p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-300 transition-colors"
                        title="Archive question"
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Editor Modal */}
      <QuestionEditorModal
        isOpen={isEditorOpen}
        editingQuestion={editingQuestion}
        isClone={isCloneMode}
        onClose={() => setIsEditorOpen(false)}
        onSuccess={handleSaveSuccess}
      />

      {/* Preview Modal */}
      <QuestionPreviewModal
        isOpen={Boolean(previewQuestion)}
        question={previewQuestion}
        onClose={() => setPreviewQuestion(null)}
        onEdit={(q) => handleOpenEdit(q)}
      />

      {/* Archive Confirmation Modal */}
      <ArchiveQuestionModal
        isOpen={Boolean(archiveTargetQuestion)}
        question={archiveTargetQuestion}
        onClose={() => setArchiveTargetQuestion(null)}
        onConfirmArchive={handleArchiveConfirm}
      />

      {/* Bulk Excel/CSV Import Modal (Phase 3) */}
      <BulkImportModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        onImportSuccess={handleImportSuccess}
        existingQuestions={questions}
        builtInQuestions={builtInQuestions}
      />

      {/* Safe Rollback Modal (Phase 3) */}
      <RollbackImportModal
        isOpen={isRollbackOpen}
        onClose={() => setIsRollbackOpen(false)}
        onRollbackSuccess={handleRollbackSuccess}
        lastImport={lastImportReceipt}
      />
    </div>
  );
};
