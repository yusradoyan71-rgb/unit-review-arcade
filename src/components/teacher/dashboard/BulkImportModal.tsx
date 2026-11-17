/**
 * UNIT REVIEW ARCADE — BULK STUDENT IMPORT MODAL (PHASE 3B)
 * 
 * Secure, multi-step bulk student roster ingestion.
 * Supports pasting rows directly from Excel, e-Okul, Google Sheets, or CSV files.
 * Provides interactive validation, duplicate detection, and pre-import preview.
 * Displays generated 4-digit credentials with export and printable slip capabilities.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTeacherAuth } from '../../../context/TeacherAuthContext';
import { TeacherApiService } from '../../../services/teacherApiService';
import type { 
  StudentManagementRecord, 
  TeacherBulkImportItem 
} from '../../../types/teacher';
import { 
  X, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Printer, 
  Download, 
  FileSpreadsheet, 
  Check, 
  ArrowRight,
  RotateCcw
} from 'lucide-react';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (imported: Array<StudentManagementRecord & { pin: string }>) => void;
  onPrintAllCards?: (cards: Array<{ student: StudentManagementRecord; pin: string }>) => void;
  existingStudentNumbers: string[];
}

interface ParsedImportRow {
  index: number;
  raw: string;
  studentNumber: string;
  fullName: string;
  className: string;
  pin: string;
  isValid: boolean;
  error?: string;
}

const SAMPLE_ROSTER_TEXT = `101\tZeynep Aksoy\t7A
102\tEmir Karaca\t7A
103\tDefne Yücel\t7B
104\tBurak Şen\t7B
201\tMert Yalçın\t8A
202\tSeda Koç\t8A
203\tOnur Çetin\t8B
204\tGizem Aslan\t8B`;

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onPrintAllCards,
  existingStudentNumbers,
}) => {
  const { teacherSession } = useTeacherAuth();

  const [step, setStep] = useState<'input' | 'preview' | 'success'>('input');
  const [pastedText, setPastedText] = useState('');
  const [parsedRows, setParsedRows] = useState<ParsedImportRow[]>([]);
  const [filterErrorsOnly, setFilterErrorsOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Success state with imported credentials
  const [importedResults, setImportedResults] = useState<Array<StudentManagementRecord & { pin: string }>>([]);

  if (!isOpen) return null;

  const handleReset = () => {
    setStep('input');
    setPastedText('');
    setParsedRows([]);
    setFilterErrorsOnly(false);
    setIsLoading(false);
    setApiError(null);
    setImportedResults([]);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  // Parser: handles Tabs, Commas, and Semicolons
  const parsePastedData = (text: string): ParsedImportRow[] => {
    const lines = text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const validClasses = ['7A', '7B', '8A', '8B'];
    const seenBatchNumbers = new Set<string>();
    const existingSet = new Set(existingStudentNumbers.map((n) => n.trim().toLowerCase()));

    return lines.map((line, idx) => {
      // Split by tab, semicolon, or comma
      let parts = line.split('\t');
      if (parts.length < 3) {
        parts = line.split(';');
      }
      if (parts.length < 3) {
        parts = line.split(',');
      }

      const sNum = (parts[0] || '').trim();
      const fName = (parts[1] || '').trim();
      const cName = (parts[2] || '').trim().toUpperCase();
      const sPin = (parts[3] || '').trim();

      // Check header row skip
      if (
        idx === 0 &&
        (sNum.toLowerCase().includes('no') ||
          sNum.toLowerCase().includes('number') ||
          sNum.toLowerCase().includes('numara'))
      ) {
        return {
          index: idx + 1,
          raw: line,
          studentNumber: sNum,
          fullName: fName,
          className: cName,
          pin: sPin,
          isValid: false,
          error: 'Header row (ignored)',
        };
      }

      let errorMsg: string | undefined;

      if (!sNum) {
        errorMsg = 'Missing student number.';
      } else if (!fName) {
        errorMsg = 'Missing full name.';
      } else if (!validClasses.includes(cName)) {
        errorMsg = `Invalid class '${cName}'. Must be 7A, 7B, 8A, or 8B.`;
      } else if (seenBatchNumbers.has(sNum.toLowerCase())) {
        errorMsg = `Duplicate number #${sNum} in import batch.`;
      } else if (existingSet.has(sNum.toLowerCase())) {
        errorMsg = `Number #${sNum} already registered in database.`;
      } else if (sPin && !/^\d{4}$/.test(sPin)) {
        errorMsg = 'Custom PIN must be exactly 4 digits.';
      }

      if (!errorMsg) {
        seenBatchNumbers.add(sNum.toLowerCase());
      }

      return {
        index: idx + 1,
        raw: line,
        studentNumber: sNum,
        fullName: fName,
        className: cName,
        pin: sPin,
        isValid: !errorMsg,
        error: errorMsg,
      };
    });
  };

  const handleProceedToPreview = () => {
    if (!pastedText.trim()) return;
    const parsed = parsePastedData(pastedText);
    setParsedRows(parsed);
    setStep('preview');
  };

  const validRowsToImport = parsedRows.filter((r) => r.isValid);
  const errorRows = parsedRows.filter((r) => !r.isValid);

  const handleExecuteImport = async () => {
    if (!teacherSession?.teacherToken || validRowsToImport.length === 0) return;

    setIsLoading(true);
    setApiError(null);

    const payloadList: TeacherBulkImportItem[] = validRowsToImport.map((r) => ({
      studentNumber: r.studentNumber,
      fullName: r.fullName,
      class: r.className as '7A' | '7B' | '8A' | '8B',
      pin: r.pin || undefined,
    }));

    try {
      const res = await TeacherApiService.bulkImportStudents(
        teacherSession.teacherToken,
        payloadList
      );

      if (res.success && res.importedStudents) {
        setImportedResults(res.importedStudents);
        setStep('success');
        onSuccess(res.importedStudents);
      } else {
        setApiError(res.error || 'Bulk import failed on the server.');
      }
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Network error during import.');
    } finally {
      setIsLoading(false);
    }
  };

  // Download CSV helper
  const handleDownloadCsv = () => {
    if (importedResults.length === 0) return;
    const headers = ['Student Number', 'Full Name', 'Class', 'Grade', 'Security PIN'];
    const rows = importedResults.map((s) => [
      s.studentNumber,
      `"${s.fullName.replace(/"/g, '""')}"`,
      s.class,
      s.grade,
      s.pin,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Arcade_Roster_Credentials_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const displayedRows = filterErrorsOnly ? errorRows : parsedRows;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-800"
        >
          {/* Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-sky-50 to-indigo-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Bulk Import Student Roster</h3>
                <p className="text-xs text-slate-500">
                  {step === 'input' && 'Paste columns from Excel, Google Sheets, or CSV'}
                  {step === 'preview' && 'Review and validate records before importing'}
                  {step === 'success' && 'Enrollment complete — print or export student credentials'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            
            {/* STEP 1: Text Input */}
            {step === 'input' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <strong className="block font-bold mb-0.5">Recommended Format:</strong>
                    <span>Copy columns: <code>Student Number</code>, <code>Full Name</code>, <code>Class (7A/7B/8A/8B)</code>, and optional <code>PIN</code>.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPastedText(SAMPLE_ROSTER_TEXT)}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-xs shrink-0 transition-colors shadow-xs"
                  >
                    Load Sample Roster
                  </button>
                </div>

                <div>
                  <textarea
                    rows={12}
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder={`Paste rows here directly from your spreadsheet...\nExample:\n101\tZeynep Aksoy\t7A\n102\tEmir Karaca\t7A\n201\tMert Yalçın\t8A`}
                    className="w-full p-4 rounded-2xl border border-slate-300 font-mono text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all resize-none shadow-inner"
                  />
                  <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                    <span>Supports Tab-separated (Excel/Sheets), Semicolon, or Comma-separated lines.</span>
                    <span>{pastedText.split('\n').filter((l) => l.trim()).length} line(s) entered</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Preview & Validation Grid */}
            {step === 'preview' && (
              <div className="space-y-4">
                {apiError && (
                  <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{apiError}</span>
                  </div>
                )}

                {/* Validation Stats Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 font-bold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{validRowsToImport.length} Valid Ready to Import</span>
                    </span>
                    {errorRows.length > 0 && (
                      <span className="flex items-center gap-1.5 font-bold text-rose-700">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errorRows.length} Issue(s) Detected</span>
                      </span>
                    )}
                  </div>

                  {errorRows.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setFilterErrorsOnly(!filterErrorsOnly)}
                      className="px-3 py-1 rounded-xl bg-white border border-slate-300 text-slate-700 text-[11px] font-bold hover:bg-slate-100 transition-colors"
                    >
                      {filterErrorsOnly ? 'Show All Rows' : 'Show Issues Only'}
                    </button>
                  )}
                </div>

                {/* Preview Table */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-80 overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="sticky top-0 bg-slate-100 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
                      <tr>
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Student No</th>
                        <th className="py-2.5 px-3">Full Name</th>
                        <th className="py-2.5 px-3">Class</th>
                        <th className="py-2.5 px-3">PIN</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                      {displayedRows.map((row) => (
                        <tr
                          key={row.index}
                          className={row.isValid ? 'hover:bg-slate-50' : 'bg-rose-50/50 hover:bg-rose-50'}
                        >
                          <td className="py-2.5 px-3 text-slate-400 font-sans">{row.index}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-900">{row.studentNumber || '—'}</td>
                          <td className="py-2.5 px-3 font-sans text-slate-800">{row.fullName || '—'}</td>
                          <td className="py-2.5 px-3 font-sans">
                            <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold text-[10px]">
                              {row.className || '—'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-500">
                            {row.pin ? row.pin : <span className="text-slate-400 font-sans italic text-[10px]">auto-generate</span>}
                          </td>
                          <td className="py-2.5 px-3 font-sans">
                            {row.isValid ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[10px]">
                                <Check className="w-3.5 h-3.5" /> Valid
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-rose-700 font-bold text-[10px]">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                <span>{row.error}</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* STEP 3: Success Roster Result */}
            {step === 'success' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-center space-y-1">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 pt-2">
                    {importedResults.length} Student Accounts Enrolled Successfully!
                  </h4>
                  <p className="text-xs text-slate-600">
                    4-digit security PINs have been generated and hashed. Print or export student slips below.
                  </p>
                </div>

                {/* Export & Print Toolbar */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <span className="text-xs text-slate-500 font-bold">
                    Classroom Credentials Generated ({importedResults.length})
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDownloadCsv}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download CSV</span>
                    </button>
                    {onPrintAllCards && (
                      <button
                        type="button"
                        onClick={() =>
                          onPrintAllCards(
                            importedResults.map((s) => ({
                              student: s,
                              pin: s.pin,
                            }))
                          )
                        }
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <Printer className="w-4 h-4" />
                        <span>Print Login Slips</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Table of Generated Credentials */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-72 overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="sticky top-0 bg-slate-100 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
                      <tr>
                        <th className="py-2.5 px-3">Student Number</th>
                        <th className="py-2.5 px-3">Full Name</th>
                        <th className="py-2.5 px-3">Class</th>
                        <th className="py-2.5 px-3">Security PIN</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                      {importedResults.map((s) => (
                        <tr key={s.studentNumber} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-bold text-indigo-900">#{s.studentNumber}</td>
                          <td className="py-2.5 px-3 font-sans text-slate-800">{s.fullName}</td>
                          <td className="py-2.5 px-3 font-sans">
                            <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold text-[10px]">
                              {s.class}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-bold text-emerald-700 tracking-wider text-xs">
                            {s.pin}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>

          {/* Footer Controls */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            {step === 'input' && (
              <>
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!pastedText.trim()}
                  onClick={handleProceedToPreview}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
                >
                  <span>Preview &amp; Validate</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}

            {step === 'preview' && (
              <>
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  disabled={isLoading}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Back to Edit</span>
                </button>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleExecuteImport}
                    disabled={isLoading || validRowsToImport.length === 0}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                    <span>{isLoading ? 'Importing Roster...' : `Import ${validRowsToImport.length} Students`}</span>
                  </button>
                </div>
              </>
            )}

            {step === 'success' && (
              <div className="w-full flex justify-end">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-colors"
                >
                  Finished
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
