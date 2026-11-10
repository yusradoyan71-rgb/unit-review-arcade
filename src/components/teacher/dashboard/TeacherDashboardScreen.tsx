/**
 * UNIT REVIEW ARCADE — TEACHER MONITORING DASHBOARD (PHASE 3B)
 * 
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
import type { 
  TeacherOverviewKpis, 
  ClassStatSummary, 
  RosterStudent, 
  QuestionDiagnosticItem,
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
  FileQuestion, 
  AlertCircle
} from 'lucide-react';

export const TeacherDashboardScreen: React.FC = () => {
  const { teacherSession, closeDashboard, logout } = useTeacherAuth();
  const { openTeacherPanel } = useArcade();

  // Filters State
  const [selectedClassId, setSelectedClassId] = useState<'all' | '7A' | '7B' | '8A' | '8B'>('all');
  const [selectedGradeId, setSelectedGradeId] = useState<'all' | 'grade-7' | 'grade-8'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dashboardTab, setDashboardTab] = useState<'overview' | 'roster' | 'analytics'>('overview');

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
      // Parallel execution of overview, roster, and question analytics
      const [overviewRes, rosterRes, analyticsRes] = await Promise.all([
        TeacherApiService.getOverview(teacherSession.teacherToken, filters),
        TeacherApiService.getRoster(teacherSession.teacherToken, filters),
        TeacherApiService.getQuestionAnalytics(teacherSession.teacherToken, filters),
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
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col font-sans relative selection:bg-indigo-500 selection:text-white">
      {/* 100% Opaque solid slate-950 background + subtle atmospheric arcade grid overlay */}
      <div className="fixed inset-0 bg-slate-950 pointer-events-none -z-10" />
      <div className="fixed inset-0 bg-arcade-grid opacity-20 pointer-events-none z-0" />
      <div className="fixed inset-0 bg-radial-vignette opacity-35 pointer-events-none z-0" />

      {/* Top Smartboard Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 px-4 md:px-8 py-3.5 transition-all shadow-lg shadow-black/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left: Brand & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={closeDashboard}
              title="Return to Student Arcade"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all flex items-center gap-2 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Exit to Arcade</span>
            </button>

            <div className="h-5 w-px bg-slate-800" />

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/40">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-arcade font-bold text-base sm:text-lg tracking-tight text-white flex items-center gap-2">
                  <span>TEACHER MONITORING COCKPIT</span>
                  <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hidden md:inline">
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
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5"
              title="Refresh Analytics"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
              <span className="hidden md:inline">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>

            {/* Curriculum Sync Action */}
            <button
              type="button"
              onClick={() => setIsCurriculumSyncOpen(true)}
              className="px-3 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 transition-all text-xs font-semibold flex items-center gap-1.5"
              title="Sync Authoritative Curriculum Catalog to Google Sheets"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sync Curriculum</span>
            </button>

            {/* Content Editor Switcher */}
            <button
              type="button"
              onClick={() => {
                closeDashboard();
                openTeacherPanel('units');
              }}
              className="px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 transition-all text-xs font-semibold flex items-center gap-1.5"
              title="Open Local Unit and Activity Editor"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Content Editor</span>
            </button>

            {/* Logout Button */}
            <button
              type="button"
              onClick={logout}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-800/40 text-slate-400 hover:text-rose-300 transition-all text-xs font-semibold flex items-center gap-1.5"
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
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <div className="space-y-0.5">
              <p className="font-semibold text-rose-200">Unable to load dashboard data</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Filter Toolbar & Class Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          
          {/* Class Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-semibold text-slate-400 mr-1 hidden sm:inline">Class:</span>
            {(['all', '7A', '7B', '8A', '8B'] as const).map((cId) => (
              <button
                key={cId}
                type="button"
                onClick={() => setSelectedClassId(cId)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedClassId === cId
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cId === 'all' ? 'All Classes' : `Class ${cId}`}
              </button>
            ))}
          </div>

          {/* Grade Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-400 mr-1 hidden sm:inline">Grade:</span>
            {(['all', 'grade-7', 'grade-8'] as const).map((gId) => (
              <button
                key={gId}
                type="button"
                onClick={() => setSelectedGradeId(gId)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedGradeId === gId
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'bg-slate-950/40 text-slate-500 hover:text-slate-300'
                }`}
              >
                {gId === 'all' ? 'All Grades' : gId === 'grade-7' ? 'Grade 7' : 'Grade 8'}
              </button>
            ))}
          </div>

        </div>

        {/* Section 1: Overview KPIs */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Performance Overview {selectedClassId !== 'all' ? `(Class ${selectedClassId})` : ''}
          </h2>
          <OverviewKpiCards kpis={kpis} isLoading={isLoading} />
        </section>

        {/* Section 2: Class Comparison Grid */}
        {selectedClassId === 'all' && (
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
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

        {/* Section 3: Navigation Tabs between Roster and Question Diagnostics */}
        <div className="flex border-b border-slate-800 gap-4">
          <button
            type="button"
            onClick={() => setDashboardTab('overview')}
            className={`pb-3 px-1 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
              dashboardTab === 'overview'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4 text-indigo-400" />
            <span>Student Roster & Progress ({filteredRoster.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setDashboardTab('analytics')}
            className={`pb-3 px-1 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
              dashboardTab === 'analytics'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileQuestion className="w-4 h-4 text-rose-400" />
            <span>Diagnostic Question Analytics ({questionAnalytics.length})</span>
          </button>
        </div>

        {/* Tab 1: Student Roster Table */}
        {dashboardTab === 'overview' && (
          <StudentRosterTable
            roster={filteredRoster}
            isLoading={isLoading}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onSelectStudent={(num) => setSelectedStudentNumber(num)}
          />
        )}

        {/* Tab 2: Question Diagnostics Leaderboard */}
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
