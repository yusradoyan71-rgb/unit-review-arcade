/**
 * UNIT REVIEW ARCADE — TEACHER MONITORING DASHBOARD (PHASE 9D)
 * Version: 9.4.0
 * 
 * Creative Campus Professional Educator Redesign.
 * Comprehensive monitoring cockpit for classes 7A, 7B, 8A, 8B.
 * Coordinates KPI aggregation, class comparisons, dynamic curriculum roster,
 * student drill-down profiles, diagnostic question analytics, and curriculum sync.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useTeacherAuth } from '../../../context/TeacherAuthContext';
import { useArcade } from '../../../context/ArcadeContext';
import { TeacherApiService } from '../../../services/teacherApiService';
import { OverviewKpiCards } from './OverviewKpiCards';
import { ClassComparisonCards } from './ClassComparisonCards';
import { StudentRosterTable } from './StudentRosterTable';
import { StudentDetailModal } from './StudentDetailModal';
import { QuestionAnalyticsView } from './QuestionAnalyticsView';
import { CurriculumSyncModal } from './CurriculumSyncModal';
import { StudentManagementView } from './StudentManagementView';
import { QuestionBankView } from './questionBank/QuestionBankView';
import { SectionAnalyticsView } from './sectionAnalytics/SectionAnalyticsView';
import type { 
  TeacherOverviewKpis, 
  ClassStatSummary, 
  RosterStudent, 
  QuestionDiagnosticItem,
  StudentAttemptRecord,
  StudentAnswerRecord,
  TeacherSectionAnalyticsResponse,
  DashboardFilterOptions 
} from '../../../types/teacher';
import { 
  ShieldCheck, 
  RefreshCw, 
  LogOut, 
  ArrowLeft, 
  UploadCloud, 
  Layers, 
  Users, 
  UserCheck,
  FileQuestion, 
  AlertCircle,
  Database,
  BarChart3
} from 'lucide-react';

export const TeacherDashboardScreen: React.FC = () => {
  const { teacherSession, closeDashboard, logout } = useTeacherAuth();
  const { openTeacherPanel } = useArcade();

  // Filters State
  const [selectedClassId, setSelectedClassId] = useState<'all' | '7A' | '7B' | '8A' | '8B'>('all');
  const [selectedGradeId, setSelectedGradeId] = useState<'all' | 'grade-7' | 'grade-8'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dashboardTab, setDashboardTab] = useState<'management' | 'overview' | 'section_analytics' | 'question_bank' | 'analytics'>('management');
  const [questionBankCount, setQuestionBankCount] = useState<number | null>(null);

  // Selected Student for Drill-down Modal
  const [selectedStudentNumber, setSelectedStudentNumber] = useState<string | null>(null);

  // Curriculum Sync Modal State
  const [isCurriculumSyncOpen, setIsCurriculumSyncOpen] = useState<boolean>(false);

  // Data States
  const [kpis, setKpis] = useState<TeacherOverviewKpis>({
    totalStudents: 0,
    studentsLoggedIn: 0,
    studentsNeverLoggedIn: 0,
    totalAttempts: 0,
    completedAttempts: 0,
    abandonedAttempts: 0,
    inProgressAttempts: 0,
    averageScore: 0,
    totalTimeSpentSeconds: 0,
    activeStudentsLast7Days: 0,
  });
  const [classStats, setClassStats] = useState<ClassStatSummary[]>([]);
  const [roster, setRoster] = useState<RosterStudent[]>([]);
  const [questionAnalytics, setQuestionAnalytics] = useState<QuestionDiagnosticItem[]>([]);
  const [sectionAttempts, setSectionAttempts] = useState<StudentAttemptRecord[]>([]);
  const [sectionAnswers, setSectionAnswers] = useState<StudentAnswerRecord[]>([]);

  // Loading & Error States
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch Dashboard Data
  const loadDashboardData = useCallback(async (isSilentRefresh = false) => {
    if (!teacherSession?.teacherToken) return;

    if (!isSilentRefresh) setIsLoading(true);
    setIsRefreshing(true);
    setError(null);

    const filters: DashboardFilterOptions = {
      classId: selectedClassId,
      gradeId: selectedGradeId,
    };

    try {
      // Parallel execution of overview, roster, question analytics, and section analytics
      const [overviewRes, rosterRes, analyticsRes, sectionRes] = await Promise.all([
        TeacherApiService.getOverview(teacherSession.teacherToken, filters),
        TeacherApiService.getRoster(teacherSession.teacherToken, filters),
        TeacherApiService.getQuestionAnalytics(teacherSession.teacherToken, filters),
        TeacherApiService.getSectionAnalytics(teacherSession.teacherToken, filters).catch(() => ({ success: false })),
      ]);

      if (overviewRes.success && overviewRes.overview) {
        setKpis(overviewRes.overview);
        setClassStats(overviewRes.classStats || []);
      } else if (overviewRes.error) {
        setError(overviewRes.error);
      }

      if (rosterRes.success && rosterRes.roster) {
        setRoster(rosterRes.roster);
      }

      if (analyticsRes.success && analyticsRes.questionAnalytics) {
        setQuestionAnalytics(analyticsRes.questionAnalytics);
      }

      if (sectionRes && 'success' in sectionRes && sectionRes.success) {
        const secData = sectionRes as TeacherSectionAnalyticsResponse;
        if (secData.attempts) setSectionAttempts(secData.attempts);
        if (secData.answers) setSectionAnswers(secData.answers);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network failure loading dashboard data.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [teacherSession, selectedClassId, selectedGradeId]);

  // Initial and reactive load on filter change
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Filtered Roster by Search Term
  const filteredRoster = roster.filter((student) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const matchNum = student.studentNumber.toLowerCase().includes(term);
    const matchName = student.fullName.toLowerCase().includes(term);
    return matchNum || matchName;
  });

  return (
    <div className="min-h-screen w-full bg-slate-50/70 text-slate-800 flex flex-col font-sans relative selection:bg-indigo-500 selection:text-white">
      {/* Daylight Atmospheric Ambient Gradient */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-sky-50/50 via-slate-50/80 to-indigo-50/30 -z-10" />

      {/* Top Smartboard Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-3.5 transition-all shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left: Brand & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={closeDashboard}
              title="Return to Student Arcade"
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-all flex items-center gap-2 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Exit to Arcade</span>
            </button>

            <div className="h-5 w-px bg-slate-200" />

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bubble font-black text-base sm:text-lg tracking-wide text-slate-900 flex items-center gap-2">
                  <span>TEACHER MONITORING COCKPIT</span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-bold hidden md:inline">
                    TEST Backend
                  </span>
                </h1>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Refresh Button */}
            <button
              type="button"
              onClick={() => loadDashboardData(true)}
              disabled={isRefreshing}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-all text-xs font-bold flex items-center gap-1.5"
              title="Refresh Analytics"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-600' : 'text-slate-600'}`} />
              <span className="hidden md:inline">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>

            {/* Curriculum Sync Action */}
            <button
              type="button"
              onClick={() => setIsCurriculumSyncOpen(true)}
              className="px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 transition-all text-xs font-bold flex items-center gap-1.5"
              title="Sync Authoritative Curriculum Catalog to Google Sheets"
            >
              <UploadCloud className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Sync Curriculum</span>
            </button>

            {/* Content Editor Switcher */}
            <button
              type="button"
              onClick={() => {
                closeDashboard();
                openTeacherPanel('units');
              }}
              className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 transition-all text-xs font-bold flex items-center gap-1.5"
              title="Open Local Unit and Activity Editor"
            >
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden lg:inline">Content Editor</span>
            </button>

            {/* Logout Button */}
            <button
              type="button"
              onClick={logout}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-600 transition-all text-xs font-bold flex items-center gap-1.5"
              title="Teacher Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Scrollable Content */}
      <main className="relative z-10 flex-1 p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
        
        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
            <div className="space-y-0.5">
              <p className="font-bold text-rose-800">Unable to load dashboard data</p>
              <p className="text-slate-600">{error}</p>
            </div>
          </div>
        )}

        {/* Filter Toolbar & Class Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          
          {/* Class Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold text-slate-500 mr-1 hidden sm:inline">Class:</span>
            {(['all', '7A', '7B', '8A', '8B'] as const).map((cId) => (
              <button
                key={cId}
                type="button"
                onClick={() => setSelectedClassId(cId)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedClassId === cId
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {cId === 'all' ? 'All Classes' : `Class ${cId}`}
              </button>
            ))}
          </div>

          {/* Grade Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500 mr-1 hidden sm:inline">Grade:</span>
            {(['all', 'grade-7', 'grade-8'] as const).map((gId) => (
              <button
                key={gId}
                type="button"
                onClick={() => setSelectedGradeId(gId)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedGradeId === gId
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-500 hover:text-slate-800'
                }`}
              >
                {gId === 'all' ? 'All Grades' : gId === 'grade-7' ? 'Grade 7' : 'Grade 8'}
              </button>
            ))}
          </div>

        </div>

        {/* Section 1: Overview KPIs */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Performance Overview {selectedClassId !== 'all' ? `(Class ${selectedClassId})` : ''}
          </h2>
          <OverviewKpiCards kpis={kpis} isLoading={isLoading} />
        </section>

        {/* Section 2: Class Comparison Grid */}
        {selectedClassId === 'all' && (
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Class Breakdown (7A, 7B, 8A, 8B)
            </h2>
            <ClassComparisonCards
              classStats={classStats}
              selectedClassId={selectedClassId}
              onSelectClass={setSelectedClassId}
              isLoading={isLoading}
            />
          </section>
        )}

        {/* Section 3: Navigation Tabs between Student Management, Roster Progress, and Question Diagnostics */}
        <div className="flex border-b border-slate-200 gap-2 sm:gap-4 overflow-x-auto">
          <button
            type="button"
            onClick={() => setDashboardTab('management')}
            className={`pb-3 px-2 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              dashboardTab === 'management'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserCheck className="w-4 h-4 text-indigo-600" />
            <span>Student Management ({roster.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setDashboardTab('overview')}
            className={`pb-3 px-2 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              dashboardTab === 'overview'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4 text-sky-600" />
            <span>Curriculum Progress &amp; Scores ({filteredRoster.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setDashboardTab('section_analytics')}
            className={`pb-3 px-2 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              dashboardTab === 'section_analytics'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-purple-600" />
            <span>General English &amp; Mixed Analytics</span>
          </button>

          <button
            type="button"
            onClick={() => setDashboardTab('question_bank')}
            className={`pb-3 px-2 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              dashboardTab === 'question_bank'
                ? 'border-teal-600 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-4 h-4 text-teal-600" />
            <span>Question Bank {typeof questionBankCount === 'number' ? `(${questionBankCount})` : ''}</span>
          </button>

          <button
            type="button"
            onClick={() => setDashboardTab('analytics')}
            className={`pb-3 px-2 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              dashboardTab === 'analytics'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileQuestion className="w-4 h-4 text-rose-500" />
            <span>Diagnostic Question Analytics ({questionAnalytics.length})</span>
          </button>
        </div>

        {/* Tab 1: Student Management & Enrollment */}
        {dashboardTab === 'management' && (
          <StudentManagementView
            roster={roster}
            isLoading={isLoading}
            onRefresh={() => loadDashboardData(true)}
            selectedClassId={selectedClassId}
            onSelectClassId={setSelectedClassId}
          />
        )}

        {/* Tab 2: Student Curriculum Progress Table */}
        {dashboardTab === 'overview' && (
          <StudentRosterTable
            roster={filteredRoster}
            isLoading={isLoading}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onSelectStudent={(num) => setSelectedStudentNumber(num)}
          />
        )}

        {/* Tab 3: General English & Mixed Practice Section Telemetry */}
        {dashboardTab === 'section_analytics' && (
          <SectionAnalyticsView
            roster={filteredRoster}
            attempts={sectionAttempts}
            answers={sectionAnswers}
            isLoading={isLoading}
            onRefresh={() => loadDashboardData(true)}
            selectedClassId={selectedClassId}
            onSelectClassId={setSelectedClassId}
            onSelectStudent={(num) => setSelectedStudentNumber(num)}
          />
        )}

        {/* Tab 4: Question Bank Manager */}
        {dashboardTab === 'question_bank' && (
          <QuestionBankView
            onQuestionCountChange={(c) => setQuestionBankCount(c)}
          />
        )}

        {/* Tab 5: Question Diagnostics Leaderboard */}
        {dashboardTab === 'analytics' && (
          <QuestionAnalyticsView
            analytics={questionAnalytics}
            isLoading={isLoading}
          />
        )}

      </main>

      {/* Student Detail Modal */}
      <StudentDetailModal
        studentNumber={selectedStudentNumber}
        onClose={() => setSelectedStudentNumber(null)}
      />

      {/* Curriculum Sync Modal */}
      <CurriculumSyncModal
        isOpen={isCurriculumSyncOpen}
        onClose={() => setIsCurriculumSyncOpen(false)}
        onSuccess={() => loadDashboardData(true)}
      />
    </div>
  );
};
