/**
 * UNIT REVIEW ARCADE — BULK QUESTION IMPORT MODAL (PHASE 3)
 * Version: 3.0.0
 * 
 * Interactive bulk Excel (.xlsx) and CSV (.csv) question import modal.
 * Features:
 * 1. Downloadable templates for all question types.
 * 2. Drag & drop file reader for .xlsx and .csv.
 * 3. Validation preview cockpit: filter by Valid, Invalid, and Duplicate rows.
 * 4. Inline row editor to correct errors without re-uploading.
 * 5. Chunked batch import with live progress bar.
 * 6. Audit receipt stamped with importBatchId for safe rollback.
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Upload,
  FileSpreadsheet,
  Download,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Copy,
  Loader2,
  Edit,
  Sparkles,
  Info,
  ArrowRight,
} from 'lucide-react';
import type { QuestionBankItem, QuestionType } from '../../../../types/questionBank';
import { parseCsv, parseXlsx } from '../../../../utils/spreadsheetParser';
import {
  validateImportRows,
  validateSingleRow,
  mapSpreadsheetHeaders,
  type ImportRowValidationResult,
  type ImportValidationSummary,
} from '../../../../utils/questionImportValidator';
import { downloadTemplate, TEMPLATES } from '../../../../utils/questionTemplateGenerator';
import { TeacherApiService } from '../../../../services/teacherApiService';
import { useTeacherAuth } from '../../../../context/TeacherAuthContext';

export interface LastImportReceipt {
  batchId: string;
  timestamp: string;
  filename: string;
  count: number;
  questionIds: string[];
}

export const LAST_IMPORT_STORAGE_KEY = 'arcade_qb_last_import';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (receipt: LastImportReceipt) => void;
  existingQuestions: QuestionBankItem[];
  builtInQuestions: QuestionBankItem[];
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
  existingQuestions,
  builtInQuestions,
}) => {
  const { teacherSession } = useTeacherAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Modal Step: 'upload' | 'preview' | 'importing' | 'complete'
  const [step, setStep] = useState<'upload' | 'preview' | 'importing' | 'complete'>('upload');

  // File loading state
  const [isReadingFile, setIsReadingFile] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');
  const [fileError, setFileError] = useState<string | null>(null);

  // Validation state
  const [validationSummary, setValidationSummary] = useState<ImportValidationSummary | null>(null);
  const [previewFilter, setPreviewFilter] = useState<'all' | 'valid' | 'invalid' | 'duplicate'>('all');

  // Inline Row Editor state
  const [editingRow, setEditingRow] = useState<ImportRowValidationResult | null>(null);
  const [editPrompt, setEditPrompt] = useState<string>('');
  const [editAnswer, setEditAnswer] = useState<string>('');
  const [editOptA, setEditOptA] = useState<string>('');
  const [editOptB, setEditOptB] = useState<string>('');
  const [editOptC, setEditOptC] = useState<string>('');
  const [editOptD, setEditOptD] = useState<string>('');
  const [editTopic, setEditTopic] = useState<string>('');

  // Import execution state
  const [importProgress, setImportProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  const [importResultReceipt, setImportResultReceipt] = useState<LastImportReceipt | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  // Template dropdown selector
  const [selectedTemplate, setSelectedTemplate] = useState<QuestionType | 'universal'>('universal');
  const [templateFormat, setTemplateFormat] = useState<'xlsx' | 'csv'>('xlsx');

  if (!isOpen) return null;

  // Reset all state when closed
  const handleModalClose = () => {
    if (step === 'importing') return; // Do not cancel mid-batch write
    setStep('upload');
    setFileName('');
    setFileError(null);
    setValidationSummary(null);
    setEditingRow(null);
    setImportError(null);
    onClose();
  };

  // --------------------------------------------------------------------------
  // FILE READING & PARSING
  // --------------------------------------------------------------------------
  const handleFileProcess = async (file: File) => {
    setIsReadingFile(true);
    setFileName(file.name);
    setFileError(null);

    try {
      let rawRows: string[][] = [];
      const lowerName = file.name.toLowerCase();

      if (lowerName.endsWith('.csv') || lowerName.endsWith('.txt')) {
        const text = await file.text();
        rawRows = parseCsv(text);
      } else if (lowerName.endsWith('.xlsx')) {
        const arrayBuffer = await file.arrayBuffer();
        rawRows = await parseXlsx(arrayBuffer);
      } else {
        throw new Error('Unsupported file format. Please upload an Excel (.xlsx) or CSV (.csv) file.');
      }

      if (rawRows.length < 2) {
        throw new Error('The uploaded file is empty or missing data rows (requires a header row and at least 1 question row).');
      }

      const summary = validateImportRows(rawRows, existingQuestions, builtInQuestions);
      setValidationSummary(summary);
      setStep('preview');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to parse file';
      setFileError(msg);
    } finally {
      setIsReadingFile(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  // --------------------------------------------------------------------------
  // ROW TOGGLE & BATCH SELECTION HELPERS
  // --------------------------------------------------------------------------
  const toggleRowInclusion = (rowIndex: number) => {
    if (!validationSummary) return;
    const updated = validationSummary.results.map((r) =>
      r.rowIndex === rowIndex ? { ...r, included: !r.included } : r
    );
    const ready = updated.filter((r) => r.included && r.status === 'valid').length;
    setValidationSummary({
      ...validationSummary,
      readyToImportCount: ready,
      results: updated,
    });
  };

  const handleSelectAllValid = () => {
    if (!validationSummary) return;
    const updated = validationSummary.results.map((r) => ({
      ...r,
      included: r.status === 'valid',
    }));
    setValidationSummary({
      ...validationSummary,
      readyToImportCount: updated.filter((r) => r.included && r.status === 'valid').length,
      results: updated,
    });
  };

  const handleDeselectDuplicates = () => {
    if (!validationSummary) return;
    const updated = validationSummary.results.map((r) =>
      r.isDuplicate ? { ...r, included: false } : r
    );
    setValidationSummary({
      ...validationSummary,
      readyToImportCount: updated.filter((r) => r.included && r.status === 'valid').length,
      results: updated,
    });
  };

  const handleSkipAllInvalid = () => {
    if (!validationSummary) return;
    const updated = validationSummary.results.map((r) =>
      r.status === 'invalid' ? { ...r, included: false } : r
    );
    setValidationSummary({
      ...validationSummary,
      readyToImportCount: updated.filter((r) => r.included && r.status === 'valid').length,
      results: updated,
    });
  };

  // --------------------------------------------------------------------------
  // INLINE ROW EDITING
  // --------------------------------------------------------------------------
  const openRowEditor = (row: ImportRowValidationResult) => {
    setEditingRow(row);
    setEditPrompt(row.parsedItem.prompt || '');
    setEditAnswer(row.parsedItem.correctAnswerPreview || '');
    setEditTopic(row.parsedItem.topic || '');

    const opts = row.parsedItem.payload.options || [];
    setEditOptA(opts[0] || '');
    setEditOptB(opts[1] || '');
    setEditOptC(opts[2] || '');
    setEditOptD(opts[3] || '');
  };

  const handleSaveRowEdit = () => {
    if (!editingRow || !validationSummary) return;

    // Build synthesized row array
    const headers = [
      'Prompt',
      'Option A',
      'Option B',
      'Option C',
      'Option D',
      'Correct Answer',
      'Topic',
    ];
    const colMap = mapSpreadsheetHeaders(headers);

    const synthRow = [
      editPrompt,
      editOptA,
      editOptB,
      editOptC,
      editOptD,
      editAnswer,
      editTopic,
    ];

    const revalidated = validateSingleRow(
      synthRow,
      editingRow.rowIndex,
      colMap,
      new Map(),
      existingQuestions,
      builtInQuestions
    );

    const updatedResults = validationSummary.results.map((r) =>
      r.rowIndex === editingRow.rowIndex ? { ...revalidated, included: revalidated.status === 'valid' } : r
    );

    const validCount = updatedResults.filter((r) => r.status === 'valid').length;
    const invalidCount = updatedResults.filter((r) => r.status === 'invalid').length;
    const duplicateCount = updatedResults.filter((r) => r.status === 'duplicate').length;
    const readyToImportCount = updatedResults.filter((r) => r.included && r.status === 'valid').length;

    setValidationSummary({
      totalRows: updatedResults.length,
      validCount,
      invalidCount,
      duplicateCount,
      readyToImportCount,
      results: updatedResults,
    });

    setEditingRow(null);
  };

  // --------------------------------------------------------------------------
  // BATCH IMPORT EXECUTION
  // --------------------------------------------------------------------------
  const handleExecuteImport = async () => {
    if (!validationSummary || !teacherSession?.teacherToken) return;

    const rowsToImport = validationSummary.results.filter((r) => r.included && r.status === 'valid');
    if (rowsToImport.length === 0) return;

    setStep('importing');
    setImportError(null);
    setImportProgress({ current: 0, total: rowsToImport.length });

    // Generate unique batch ID for this operation
    const batchId = `batch_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const questionsToSave = rowsToImport.map((r) => ({
      ...r.parsedItem,
      importBatchId: batchId,
      tags: [...(r.parsedItem.tags || []), `batch:${batchId}`],
    }));

    const BATCH_SIZE = 50;
    const totalBatches = Math.ceil(questionsToSave.length / BATCH_SIZE);
    let successfullyImportedCount = 0;
    const accumulatedIds: string[] = [];

    try {
      for (let b = 0; b < totalBatches; b++) {
        const slice = questionsToSave.slice(b * BATCH_SIZE, (b + 1) * BATCH_SIZE);

        const res = await TeacherApiService.bulkImportQuestions(
          teacherSession.teacherToken,
          slice,
          false, // strictly never overwrite existing questions
          batchId
        );

        if (!res.success) {
          throw new Error(res.error || `Failed during batch ${b + 1} of ${totalBatches}.`);
        }

        successfullyImportedCount += res.importedCount || slice.length;
        if (res.importedIds) {
          accumulatedIds.push(...res.importedIds);
        } else {
          accumulatedIds.push(...slice.map((q) => q.id || ''));
        }

        setImportProgress({
          current: Math.min((b + 1) * BATCH_SIZE, questionsToSave.length),
          total: questionsToSave.length,
        });
      }

      const receipt: LastImportReceipt = {
        batchId,
        timestamp: new Date().toISOString(),
        filename: fileName,
        count: successfullyImportedCount,
        questionIds: accumulatedIds,
      };

      // Persist receipt in localStorage for safe rollback
      if (typeof window !== 'undefined') {
        localStorage.setItem(LAST_IMPORT_STORAGE_KEY, JSON.stringify(receipt));
      }

      setImportResultReceipt(receipt);
      setStep('complete');
      onImportSuccess(receipt);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Import failed';
      setImportError(msg);
      setStep('preview');
    }
  };

  // --------------------------------------------------------------------------
  // FILTERED RESULTS FOR PREVIEW TABLE
  // --------------------------------------------------------------------------
  const displayedResults = (validationSummary?.results || []).filter((r) => {
    if (previewFilter === 'valid') return r.status === 'valid';
    if (previewFilter === 'invalid') return r.status === 'invalid';
    if (previewFilter === 'duplicate') return r.status === 'duplicate';
    return true;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden text-slate-800"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/50 via-teal-50/30 to-indigo-50/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <span>Bulk Question Import</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                    Excel &amp; CSV
                  </span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Upload .xlsx or .csv files with automatic column mapping, error checks, and safe zero-overwrite.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleModalClose}
              disabled={step === 'importing'}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-30"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            {/* =============================================================== */}
            {/* STEP 1: UPLOAD & TEMPLATE DOWNLOAD                              */}
            {/* =============================================================== */}
            {step === 'upload' && (
              <div className="space-y-6">
                {/* Template Downloads Section */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                        Download Starter Templates
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={selectedTemplate}
                        onChange={(e) => setSelectedTemplate(e.target.value as QuestionType | 'universal')}
                        className="text-xs bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 font-bold text-slate-700 shadow-2xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="universal">Master Template (All Question Types)</option>
                        <option value="multiple_choice">Multiple Choice (MCQ)</option>
                        <option value="true_false">True / False</option>
                        <option value="sentence_builder">Sentence Builder</option>
                        <option value="match_it">Match It Pairs</option>
                        <option value="reading_passage">Reading Passage</option>
                        <option value="vocabulary_item">Vocabulary Item</option>
                      </select>

                      <select
                        value={templateFormat}
                        onChange={(e) => setTemplateFormat(e.target.value as 'xlsx' | 'csv')}
                        className="text-xs bg-white border border-slate-300 rounded-xl px-2 py-1.5 font-bold text-slate-700 shadow-2xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="xlsx">.XLSX (Excel)</option>
                        <option value="csv">.CSV</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => downloadTemplate(selectedTemplate, templateFormat)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    {TEMPLATES[selectedTemplate]?.description || 'Includes pre-formatted headers and sample questions.'}
                  </p>
                </div>

                {/* Drag and Drop Upload Area */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-3xl p-8 sm:p-12 text-center bg-slate-50/50 hover:bg-emerald-50/20 transition-all cursor-pointer group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.csv,.txt"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />

                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 group-hover:border-emerald-300 flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-105 transition-transform text-emerald-600">
                    {isReadingFile ? (
                      <Loader2 className="w-7 h-7 animate-spin text-emerald-600" />
                    ) : (
                      <Upload className="w-7 h-7" />
                    )}
                  </div>

                  <h4 className="text-sm sm:text-base font-extrabold text-slate-800">
                    {isReadingFile ? 'Analyzing spreadsheet...' : 'Click or drag & drop your spreadsheet here'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Supports Microsoft Excel <strong>.xlsx</strong> and comma/semicolon delimited <strong>.csv</strong> files
                  </p>
                </div>

                {/* Error Banner */}
                {fileError && (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3 text-xs">
                    <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
                    <span className="font-semibold">{fileError}</span>
                  </div>
                )}

                {/* Educational Notice */}
                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3 text-xs text-indigo-900">
                  <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-indigo-950">Zero-Overwrite Protection Active:</p>
                    <p className="text-indigo-800 leading-relaxed">
                      Questions matching existing custom questions or built-in curriculum items are automatically flagged as duplicates and deselected by default. All 1,206 built-in curriculum questions are strictly preserved.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* =============================================================== */}
            {/* STEP 2: VALIDATION & REVIEW COCKPIT                             */}
            {/* =============================================================== */}
            {step === 'preview' && validationSummary && (
              <div className="space-y-5">
                {/* File info and Stats Header */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-[11px] font-bold text-slate-400 block uppercase">Total Questions</span>
                    <span className="text-xl font-black text-slate-800">{validationSummary.totalRows}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                    <span className="text-[11px] font-bold text-emerald-600 block uppercase">Valid &amp; Ready</span>
                    <span className="text-xl font-black text-emerald-700">{validationSummary.validCount}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-center">
                    <span className="text-[11px] font-bold text-rose-600 block uppercase">Has Errors</span>
                    <span className="text-xl font-black text-rose-700">{validationSummary.invalidCount}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                    <span className="text-[11px] font-bold text-amber-600 block uppercase">Duplicates</span>
                    <span className="text-xl font-black text-amber-700">{validationSummary.duplicateCount}</span>
                  </div>
                </div>

                {/* Import Error Banner */}
                {importError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{importError}</span>
                  </div>
                )}

                {/* Filter Tabs & Quick Action Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setPreviewFilter('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        previewFilter === 'all' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      All ({validationSummary.totalRows})
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewFilter('valid')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        previewFilter === 'valid' ? 'bg-white shadow-2xs text-emerald-700' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Valid ({validationSummary.validCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewFilter('invalid')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        previewFilter === 'invalid' ? 'bg-white shadow-2xs text-rose-700' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Errors ({validationSummary.invalidCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewFilter('duplicate')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        previewFilter === 'duplicate' ? 'bg-white shadow-2xs text-amber-700' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Duplicates ({validationSummary.duplicateCount})
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={handleSelectAllValid}
                      className="text-emerald-700 hover:underline font-bold"
                    >
                      Select All Valid
                    </button>
                    <span className="text-slate-300">•</span>
                    <button
                      type="button"
                      onClick={handleDeselectDuplicates}
                      className="text-amber-700 hover:underline font-bold"
                    >
                      Deselect Duplicates
                    </button>
                    <span className="text-slate-300">•</span>
                    <button
                      type="button"
                      onClick={handleSkipAllInvalid}
                      className="text-rose-700 hover:underline font-bold"
                    >
                      Skip All Invalid
                    </button>
                  </div>
                </div>

                {/* Preview Table */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs max-h-96 overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-100/90 text-slate-600 font-extrabold uppercase text-[10px] tracking-wider sticky top-0 z-10 backdrop-blur-xs">
                      <tr>
                        <th className="py-2.5 px-3 w-12 text-center">Inc</th>
                        <th className="py-2.5 px-3 w-16">Row</th>
                        <th className="py-2.5 px-3 w-24">Status</th>
                        <th className="py-2.5 px-3 w-28">Type</th>
                        <th className="py-2.5 px-3">Question Prompt</th>
                        <th className="py-2.5 px-3 w-36">Answer Preview</th>
                        <th className="py-2.5 px-3 w-28 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {displayedResults.map((row) => (
                        <tr
                          key={row.rowIndex}
                          className={`hover:bg-slate-50/80 transition-colors ${
                            !row.included ? 'opacity-40 bg-slate-50/40' : ''
                          }`}
                        >
                          <td className="py-2 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={row.included}
                              onChange={() => toggleRowInclusion(row.rowIndex)}
                              disabled={row.status === 'invalid'}
                              className="w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500 cursor-pointer disabled:cursor-not-allowed"
                            />
                          </td>
                          <td className="py-2 px-3 font-mono font-bold text-slate-500">
                            #{row.rowIndex}
                          </td>
                          <td className="py-2 px-3">
                            {row.status === 'valid' && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Valid</span>
                              </span>
                            )}
                            {row.status === 'invalid' && (
                              <span
                                title={row.errors.join(' | ')}
                                className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 cursor-help"
                              >
                                <XCircle className="w-3 h-3 text-rose-600" />
                                <span>Error ({row.errors.length})</span>
                              </span>
                            )}
                            {row.status === 'duplicate' && (
                              <span
                                title={row.duplicateReason || 'Duplicate question'}
                                className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 cursor-help"
                              >
                                <Copy className="w-3 h-3 text-amber-600" />
                                <span>Duplicate</span>
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-3">
                            <span className="font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                              {row.parsedItem.questionType}
                            </span>
                          </td>
                          <td className="py-2 px-3 font-medium text-slate-800 max-w-xs truncate">
                            <span title={row.parsedItem.prompt}>{row.parsedItem.prompt || '(Empty)'}</span>
                            {row.errors.length > 0 && (
                              <span className="block text-[11px] text-rose-600 font-semibold truncate mt-0.5">
                                {row.errors[0]}
                              </span>
                            )}
                            {row.isDuplicate && (
                              <span className="block text-[11px] text-amber-700 font-semibold truncate mt-0.5">
                                {row.duplicateReason}
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-3 text-slate-600 text-[11px] truncate max-w-xs">
                            {row.parsedItem.correctAnswerPreview || '—'}
                          </td>
                          <td className="py-2 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => openRowEditor(row)}
                              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] inline-flex items-center gap-1 transition-colors"
                            >
                              <Edit className="w-3 h-3" />
                              <span>Fix</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* =============================================================== */}
            {/* STEP 3: LIVE IMPORT PROGRESS BAR                                */}
            {/* =============================================================== */}
            {step === 'importing' && (
              <div className="py-12 px-6 text-center space-y-4">
                <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto" />
                <h4 className="text-base font-black text-slate-900">
                  Importing Questions into Question Bank...
                </h4>
                <p className="text-xs text-slate-500">
                  Processed {importProgress.current} of {importProgress.total} questions safely in batches.
                </p>

                <div className="max-w-md mx-auto w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-300"
                    style={{
                      width: `${
                        importProgress.total > 0
                          ? Math.round((importProgress.current / importProgress.total) * 100)
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* =============================================================== */}
            {/* STEP 4: SUCCESS RECEIPT                                         */}
            {/* =============================================================== */}
            {step === 'complete' && importResultReceipt && (
              <div className="py-10 px-6 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-black text-slate-900">
                  Import Completed Successfully!
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Added <strong>{importResultReceipt.count} questions</strong> to the central Question Bank from{' '}
                  <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                    {importResultReceipt.filename}
                  </span>
                  .
                </p>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 inline-block text-left text-xs text-slate-600 space-y-1">
                  <div>
                    <span className="text-slate-400 font-bold">Batch ID:</span>{' '}
                    <span className="font-mono text-slate-800">{importResultReceipt.batchId}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold">Import Time:</span>{' '}
                    <span>{new Date(importResultReceipt.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold">Rollback Status:</span>{' '}
                    <span className="text-emerald-700 font-bold">Available (1-Click Undo Enabled)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            {step === 'preview' ? (
              <>
                <button
                  type="button"
                  onClick={() => setStep('upload')}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs transition-colors"
                >
                  Choose Different File
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">
                    Ready to import:{' '}
                    <strong className="text-emerald-700 font-black">
                      {validationSummary?.readyToImportCount || 0}
                    </strong>
                  </span>
                  <button
                    type="button"
                    onClick={handleExecuteImport}
                    disabled={(validationSummary?.readyToImportCount || 0) === 0}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md disabled:opacity-40 flex items-center gap-2 transition-all active:scale-95"
                  >
                    <span>Import {validationSummary?.readyToImportCount || 0} Questions</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : step === 'complete' ? (
              <div className="w-full flex justify-end">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all active:scale-95"
                >
                  View in Question Bank
                </button>
              </div>
            ) : (
              <div className="w-full flex justify-end">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-800 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* =================================================================== */}
      {/* INLINE ROW FIX MODAL                                                */}
      {/* =================================================================== */}
      {editingRow && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-5 space-y-4 text-slate-800"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Edit className="w-4 h-4 text-emerald-600" />
                <span>Fix Row #{editingRow.rowIndex}</span>
              </h4>
              <button
                type="button"
                onClick={() => setEditingRow(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Question Prompt</label>
                <input
                  type="text"
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Option A</label>
                  <input
                    type="text"
                    value={editOptA}
                    onChange={(e) => setEditOptA(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Option B</label>
                  <input
                    type="text"
                    value={editOptB}
                    onChange={(e) => setEditOptB(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Option C</label>
                  <input
                    type="text"
                    value={editOptC}
                    onChange={(e) => setEditOptC(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Option D</label>
                  <input
                    type="text"
                    value={editOptD}
                    onChange={(e) => setEditOptD(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Correct Answer (A/B/C/D or text)</label>
                  <input
                    type="text"
                    value={editAnswer}
                    onChange={(e) => setEditAnswer(e.target.value)}
                    placeholder="e.g. A"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Topic</label>
                  <input
                    type="text"
                    value={editTopic}
                    onChange={(e) => setEditTopic(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingRow(null)}
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveRowEdit}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
              >
                Apply Fix
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
