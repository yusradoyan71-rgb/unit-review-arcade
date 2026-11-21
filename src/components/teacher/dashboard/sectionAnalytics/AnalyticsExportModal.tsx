import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TeacherAnalyticsService } from '../../../../services/teacherAnalyticsService';
import type { 
  SectionBreakdownSummary, 
  TopicMasteryItem, 
  StudentSectionParticipation, 
  StudentAnswerRecord 
} from '../../../../types/teacher';
import { 
  X, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Check, 
  Loader2 
} from 'lucide-react';

interface AnalyticsExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionSummary: SectionBreakdownSummary;
  topics: TopicMasteryItem[];
  participants: StudentSectionParticipation[];
  answers: StudentAnswerRecord[];
}

export const AnalyticsExportModal: React.FC<AnalyticsExportModalProps> = ({
  isOpen,
  onClose,
  sectionSummary,
  topics,
  participants,
  answers,
}) => {
  const [selectedReport, setSelectedReport] = useState<'participation' | 'topic_mastery' | 'section_summary' | 'mistakes'>('participation');
  const [format, setFormat] = useState<'csv' | 'xlsx'>('csv');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportedSuccess, setExportedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    setExportedSuccess(false);

    try {
      const dateStr = new Date().toISOString().slice(0, 10);

      if (format === 'csv') {
        let csvContent = '';
        let filename = '';

        if (selectedReport === 'participation') {
          csvContent = TeacherAnalyticsService.exportStudentParticipationCsv(participants);
          filename = `student_participation_matrix_${dateStr}.csv`;
        } else if (selectedReport === 'topic_mastery') {
          csvContent = TeacherAnalyticsService.exportTopicMasteryCsv(topics);
          filename = `topic_mastery_diagnostics_${dateStr}.csv`;
        } else if (selectedReport === 'section_summary') {
          csvContent = TeacherAnalyticsService.exportSectionSummaryCsv(sectionSummary);
          filename = `learning_sections_summary_${dateStr}.csv`;
        } else if (selectedReport === 'mistakes') {
          csvContent = TeacherAnalyticsService.exportQuestionMistakesCsv(answers);
          filename = `question_mistakes_telemetry_${dateStr}.csv`;
        }

        TeacherAnalyticsService.triggerDownload(csvContent, filename, 'text/csv');
      } else {
        // Excel XLSX export
        let xlsxData: Uint8Array;
        let filename = '';

        if (selectedReport === 'participation') {
          xlsxData = await TeacherAnalyticsService.exportStudentParticipationXlsx(participants);
          filename = `student_participation_matrix_${dateStr}.xlsx`;
        } else {
          // Fallback to CSV for simpler reports
          const csvContent = selectedReport === 'topic_mastery'
            ? TeacherAnalyticsService.exportTopicMasteryCsv(topics)
            : TeacherAnalyticsService.exportSectionSummaryCsv(sectionSummary);
          TeacherAnalyticsService.triggerDownload(csvContent, `${selectedReport}_${dateStr}.csv`, 'text/csv');
          setIsExporting(false);
          setExportedSuccess(true);
          return;
        }

        TeacherAnalyticsService.triggerDownload(
          xlsxData,
          filename,
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
      }

      setExportedSuccess(true);
      setTimeout(() => {
        setExportedSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 text-slate-800 space-y-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black font-display text-slate-900">
                  Export Teacher Analytics
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Download structured Excel or CSV reports for offline reporting.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Select Report Type */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              1. Choose Report Type
            </label>
            <div className="space-y-2">
              {[
                {
                  id: 'participation' as const,
                  title: 'Student Participation & Multi-Section Matrix',
                  desc: `All ${participants.length} students: Unit Review, General English, and Mixed Practice status.`,
                },
                {
                  id: 'topic_mastery' as const,
                  title: 'Topic Mastery & Diagnostic Weakness Index',
                  desc: `All ${topics.length} topics: Accuracy, weakness urgency score, and misconception prompts.`,
                },
                {
                  id: 'section_summary' as const,
                  title: 'Learning Sections Performance Summary',
                  desc: 'High-level KPI comparison across Unit Review, General English, and Mixed Practice.',
                },
                {
                  id: 'mistakes' as const,
                  title: 'Question-Level Diagnostic Mistakes Log',
                  desc: 'Comprehensive answer logs with student responses, correct answers, and time spent.',
                },
              ].map((r) => (
                <div
                  key={r.id}
                  onClick={() => setSelectedReport(r.id)}
                  className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                    selectedReport === r.id
                      ? 'bg-indigo-50/70 border-indigo-500 ring-1 ring-indigo-300'
                      : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="reportType"
                    checked={selectedReport === r.id}
                    onChange={() => setSelectedReport(r.id)}
                    className="mt-1 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <strong className="block text-xs font-bold text-slate-900">
                      {r.title}
                    </strong>
                    <span className="text-[11px] text-slate-500 font-medium leading-relaxed block">
                      {r.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Format Selection (CSV vs XLSX) */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              2. Select File Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormat('csv')}
                className={`p-3 rounded-2xl border-2 font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  format === 'csv'
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>CSV (UTF-8 BOM)</span>
              </button>

              <button
                type="button"
                onClick={() => setFormat('xlsx')}
                className={`p-3 rounded-2xl border-2 font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  format === 'xlsx'
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Microsoft Excel (.xlsx)</span>
              </button>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting}
              className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md flex items-center gap-2 transition-all active:scale-95"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating File...</span>
                </>
              ) : exportedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Report</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

