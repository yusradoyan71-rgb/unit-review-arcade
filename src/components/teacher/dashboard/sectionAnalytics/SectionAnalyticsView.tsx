import React, { useState, useMemo } from 'react';
import { TeacherAnalyticsService } from '../../../../services/teacherAnalyticsService';
import { SectionBreakdownCards } from './SectionBreakdownCards';
import { SkillMasteryPillars } from './SkillMasteryPillars';
import { TopicMasteryTable } from './TopicMasteryTable';
import { StudentSectionParticipationTable } from './StudentSectionParticipationTable';
import { AnalyticsExportModal } from './AnalyticsExportModal';
import type { 
  RosterStudent, 
  StudentAttemptRecord, 
  StudentAnswerRecord, 
  LearningSection,
  SkillCategory 
} from '../../../../types/teacher';
import { 
  Download, 
  Layers, 
  Users, 
  RefreshCw 
} from 'lucide-react';

interface SectionAnalyticsViewProps {
  roster: RosterStudent[];
  attempts?: StudentAttemptRecord[];
  answers?: StudentAnswerRecord[];
  isLoading: boolean;
  onRefresh?: () => void;
  selectedClassId: string;
  onSelectClassId: (classId: 'all' | '7A' | '7B' | '8A' | '8B') => void;
  onSelectStudent: (studentNumber: string) => void;
}

export const SectionAnalyticsView: React.FC<SectionAnalyticsViewProps> = ({
  roster,
  attempts = [],
  answers = [],
  isLoading,
  onRefresh,
  selectedClassId,
  onSelectClassId,
  onSelectStudent,
}) => {
  // Local Filter States
  const [selectedGradeId, setSelectedGradeId] = useState<'all' | 'grade-7' | 'grade-8'>('all');
  const [selectedSection, setSelectedSection] = useState<LearningSection>('all');
  const [selectedSkill, setSelectedSkill] = useState<SkillCategory>('all');
  const [activeSubTab, setActiveSubTab] = useState<'topics' | 'students'>('topics');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Filter cohort students by selected class & grade
  const cohortStudents = useMemo(() => {
    return roster.filter((s) => {
      if (selectedClassId !== 'all' && s.class !== selectedClassId) return false;
      if (selectedGradeId !== 'all' && s.grade !== selectedGradeId) return false;
      return true;
    });
  }, [roster, selectedClassId, selectedGradeId]);

  // Compute Section Breakdown
  const sectionSummary = useMemo(() => {
    return TeacherAnalyticsService.computeSectionBreakdown(attempts);
  }, [attempts]);

  // Compute Skill Mastery & Topics Diagnostic
  const { skills, topics } = useMemo(() => {
    return TeacherAnalyticsService.computeTopicMastery(selectedGradeId, attempts, answers);
  }, [selectedGradeId, attempts, answers]);

  // Compute Student Section Participation Matrix
  const participants = useMemo(() => {
    return TeacherAnalyticsService.computeStudentParticipation(cohortStudents, attempts);
  }, [cohortStudents, attempts]);

  return (
    <div className="space-y-6">
      {/* View Header with Export Action */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-sky-900 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-sky-200 border border-white/20 inline-block mb-1">
            Two-Section Architecture • Phase 5
          </span>
          <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight flex items-center gap-2">
            <span>📊</span> General English &amp; Mixed Practice Analytics
          </h2>
          <p className="text-xs sm:text-sm text-indigo-200 font-medium max-w-2xl mt-0.5 leading-relaxed">
            Independent skill telemetry for Grammar, Vocabulary, Reading, and Listening. Separate reporting for Unit Review, General English, and Mixed Practice sessions.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all text-xs font-bold flex items-center gap-1.5"
              title="Refresh Analytics"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-white text-indigo-900 hover:bg-indigo-50 font-black text-xs shadow-md flex items-center gap-2 transition-all active:scale-95"
          >
            <Download className="w-4 h-4 text-indigo-700" />
            <span>Export Analytics</span>
          </button>
        </div>
      </div>

      {/* 1. Three Section Breakdown Cards */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Learning Section Performance Comparison
          </h3>
          <span className="text-xs text-slate-400">
            Click any section card to filter telemetry
          </span>
        </div>
        <SectionBreakdownCards
          summary={sectionSummary}
          totalStudentsInCohort={cohortStudents.length}
          onFilterSection={(sec) => setSelectedSection(sec)}
          selectedSection={selectedSection}
        />
      </section>

      {/* 2. Four Skill Mastery Pillars */}
      <section>
        <SkillMasteryPillars
          skills={skills}
          onSelectSkill={(sk) => setSelectedSkill(sk)}
          selectedSkill={selectedSkill}
        />
      </section>

      {/* 3. Sub-Navigation Tabs: Topics Mastery vs Student Participation */}
      <div className="flex border-b border-slate-200 gap-2 sm:gap-4 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSubTab('topics')}
          className={`pb-3 px-2 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeSubTab === 'topics'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4 text-indigo-600" />
          <span>Topic Mastery &amp; Diagnostic Weaknesses ({topics.length} Sets)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('students')}
          className={`pb-3 px-2 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeSubTab === 'students'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4 text-sky-600" />
          <span>Student Section Participation Matrix ({participants.length})</span>
        </button>
      </div>

      {/* 4. Active Sub-View */}
      {activeSubTab === 'topics' && (
        <TopicMasteryTable
          topics={topics}
          selectedGradeId={selectedGradeId}
          selectedSkill={selectedSkill}
          onGradeChange={setSelectedGradeId}
          onSkillChange={setSelectedSkill}
        />
      )}

      {activeSubTab === 'students' && (
        <StudentSectionParticipationTable
          students={participants}
          onSelectStudent={onSelectStudent}
          selectedClassId={selectedClassId}
          onClassChange={onSelectClassId}
        />
      )}

      {/* Export Modal */}
      <AnalyticsExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        sectionSummary={sectionSummary}
        topics={topics}
        participants={participants}
        answers={answers}
      />
    </div>
  );
};
