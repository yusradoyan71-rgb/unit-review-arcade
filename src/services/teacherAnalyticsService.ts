/**
 * UNIT REVIEW ARCADE — TEACHER ANALYTICS & REPORTING SERVICE (PHASE 5)
 * Version: 5.0.0
 * 
 * Provides comprehensive data transformation, multi-section KPI aggregation,
 * topic-level mastery & weakness diagnostics, student participation auditing,
 * and zero-dependency RFC-4180 CSV & XLSX spreadsheet generation.
 */

import { GeneralEnglishService } from './generalEnglishService';
import { generateCsv, generateXlsx } from '../utils/spreadsheetParser';
import type { 
  SectionBreakdownSummary, 
  SkillMasterySummary, 
  TopicMasteryItem, 
  TopicMasteryStatus, 
  StudentSectionParticipation, 
  DashboardFilterOptions, 
  RosterStudent, 
  StudentAttemptRecord, 
  StudentAnswerRecord 
} from '../types/teacher';

export class TeacherAnalyticsService {
  /**
   * Classifies an activity or attempt into its authoritative Learning Section:
   * 1. 'mixed_practice': Blended sessions (50/50, 70/30, 30/70)
   * 2. 'general_english': Skill mastery activities (Grammar, Vocabulary, Reading, Listening)
   * 3. 'unit_review': Core curriculum textbook unit activities
   */
  public static classifyLearningSection(
    unitId: string = '',
    activityId: string = '',
    unitTitle: string = ''
  ): 'unit_review' | 'general_english' | 'mixed_practice' {
    const uId = (unitId || '').toLowerCase();
    const aId = (activityId || '').toLowerCase();
    const title = (unitTitle || '').toLowerCase();

    if (uId.includes('unit_mixed') || aId.includes('act_mixed') || title.includes('mixed practice')) {
      return 'mixed_practice';
    }

    if (
      uId.startsWith('unit_g7-') ||
      uId.startsWith('unit_g8-') ||
      uId.startsWith('unit_ge_') ||
      title.includes('general english') ||
      aId.startsWith('act_g7-') ||
      aId.startsWith('act_g8-') ||
      aId.startsWith('act_ge_')
    ) {
      return 'general_english';
    }

    return 'unit_review';
  }

  /**
   * Identifies the core language skill pillar for an activity or question:
   * 'grammar' | 'vocabulary' | 'reading' | 'listening'
   */
  public static classifySkill(
    unitId: string = '',
    activityId: string = '',
    text: string = ''
  ): 'grammar' | 'vocabulary' | 'reading' | 'listening' | 'mixed' {
    const combined = `${unitId} ${activityId} ${text}`.toLowerCase();
    if (combined.includes('mix')) return 'mixed';
    if (combined.includes('gram')) return 'grammar';
    if (combined.includes('voc') || combined.includes('colloc') || combined.includes('synonym')) return 'vocabulary';
    if (combined.includes('read') || combined.includes('passage') || combined.includes('comprehen')) return 'reading';
    if (combined.includes('lis') || combined.includes('dict') || combined.includes('audio') || combined.includes('speech')) return 'listening';
    return 'grammar'; // default
  }

  /**
   * Computes section-level KPI breakdown across Unit Review, General English, and Mixed Practice.
   */
  public static computeSectionBreakdown(attempts: StudentAttemptRecord[]): SectionBreakdownSummary {
    const summary: SectionBreakdownSummary = {
      unitReview: {
        totalAttempts: 0,
        completedAttempts: 0,
        averageScore: 0,
        uniqueStudentsCount: 0,
        totalXpEarned: 0,
        totalTimeSpentSeconds: 0,
      },
      generalEnglish: {
        totalAttempts: 0,
        completedAttempts: 0,
        averageScore: 0,
        uniqueStudentsCount: 0,
        totalXpEarned: 0,
        totalTimeSpentSeconds: 0,
      },
      mixedPractice: {
        totalAttempts: 0,
        completedAttempts: 0,
        averageScore: 0,
        uniqueStudentsCount: 0,
        totalXpEarned: 0,
        totalTimeSpentSeconds: 0,
      },
    };

    const studentSets = {
      unitReview: new Set<string>(),
      generalEnglish: new Set<string>(),
      mixedPractice: new Set<string>(),
    };

    const scoreSums = {
      unitReview: 0,
      generalEnglish: 0,
      mixedPractice: 0,
    };

    for (const att of attempts) {
      const section = this.classifyLearningSection(att.unitId, att.activityId, att.unitTitle);
      const studentNum = (att as unknown as { studentNumber?: string }).studentNumber || '';

      const target = summary[section === 'unit_review' ? 'unitReview' : section === 'general_english' ? 'generalEnglish' : 'mixedPractice'];
      const set = studentSets[section === 'unit_review' ? 'unitReview' : section === 'general_english' ? 'generalEnglish' : 'mixedPractice'];
      const scoreKey = section === 'unit_review' ? 'unitReview' : section === 'general_english' ? 'generalEnglish' : 'mixedPractice';

      target.totalAttempts++;
      target.totalTimeSpentSeconds += att.durationSeconds || 0;
      if (studentNum) set.add(studentNum);

      if (att.status === 'completed') {
        target.completedAttempts++;
        scoreSums[scoreKey] += att.percentage || 0;
        // Estimate XP: 20 base + (percentage * 0.8)
        target.totalXpEarned += Math.round(20 + ((att.percentage || 0) * 0.8));
      }
    }

    summary.unitReview.uniqueStudentsCount = studentSets.unitReview.size;
    summary.generalEnglish.uniqueStudentsCount = studentSets.generalEnglish.size;
    summary.mixedPractice.uniqueStudentsCount = studentSets.mixedPractice.size;

    summary.unitReview.averageScore = summary.unitReview.completedAttempts > 0
      ? Math.round(scoreSums.unitReview / summary.unitReview.completedAttempts)
      : 0;

    summary.generalEnglish.averageScore = summary.generalEnglish.completedAttempts > 0
      ? Math.round(scoreSums.generalEnglish / summary.generalEnglish.completedAttempts)
      : 0;

    summary.mixedPractice.averageScore = summary.mixedPractice.completedAttempts > 0
      ? Math.round(scoreSums.mixedPractice / summary.mixedPractice.completedAttempts)
      : 0;

    return summary;
  }

  /**
   * Computes topic-level mastery and diagnostic weakness items across all starter content.
   */
  public static computeTopicMastery(
    gradeId: 'all' | 'grade-7' | 'grade-8' = 'all',
    attempts: StudentAttemptRecord[] = [],
    answers: StudentAnswerRecord[] = []
  ): { skills: SkillMasterySummary[]; topics: TopicMasteryItem[] } {
    // Collect starter topics from GeneralEnglishService
    const g7Topics = GeneralEnglishService.getTopics('grade-7');
    const g8Topics = GeneralEnglishService.getTopics('grade-8');
    const allTopics = [
      ...g7Topics.map((t) => ({ ...t, gradeId: 'grade-7' as const })),
      ...g8Topics.map((t) => ({ ...t, gradeId: 'grade-8' as const })),
    ];

    const targetTopics = gradeId === 'all'
      ? allTopics
      : allTopics.filter((t) => t.gradeId === gradeId);

    // Group attempts and answers by topicId or related activityId
    const topicStats = new Map<string, {
      totalAttempts: number;
      completedAttempts: number;
      scoreSum: number;
      uniqueStudents: Set<string>;
      mistakesCount: number;
      mistakePrompts: string[];
    }>();

    for (const top of targetTopics) {
      topicStats.set(top.id, {
        totalAttempts: 0,
        completedAttempts: 0,
        scoreSum: 0,
        uniqueStudents: new Set<string>(),
        mistakesCount: 0,
        mistakePrompts: [],
      });
    }

    // Correlate student attempts
    for (const att of attempts) {
      // Find matching topic
      const matchingTopic = targetTopics.find(
        (t) => att.activityId.includes(t.id) || att.unitId.includes(t.id) || att.activityTitle.toLowerCase().includes(t.title.toLowerCase())
      );
      if (!matchingTopic) continue;

      const stat = topicStats.get(matchingTopic.id)!;
      stat.totalAttempts++;
      const sNum = (att as unknown as { studentNumber?: string }).studentNumber || '';
      if (sNum) stat.uniqueStudents.add(sNum);

      if (att.status === 'completed') {
        stat.completedAttempts++;
        stat.scoreSum += att.percentage || 0;
      }
    }

    // Correlate student mistake answers
    for (const ans of answers) {
      if (ans.isCorrect) continue;
      const matchingTopic = targetTopics.find(
        (t) => ans.activityId.includes(t.id) || ans.unitId.includes(t.id)
      );
      if (!matchingTopic) continue;

      const stat = topicStats.get(matchingTopic.id)!;
      stat.mistakesCount++;
      if (ans.questionPrompt && !stat.mistakePrompts.includes(ans.questionPrompt)) {
        if (stat.mistakePrompts.length < 3) {
          stat.mistakePrompts.push(ans.questionPrompt);
        }
      }
    }

    // Build TopicMasteryItem array
    const topicItems: TopicMasteryItem[] = targetTopics.map((t) => {
      const stat = topicStats.get(t.id)!;
      const avgScore = stat.completedAttempts > 0 ? Math.round(stat.scoreSum / stat.completedAttempts) : 0;

      let masteryStatus: TopicMasteryStatus = 'not_started';
      if (stat.completedAttempts > 0) {
        if (avgScore >= 85) masteryStatus = 'mastered';
        else if (avgScore >= 70) masteryStatus = 'proficient';
        else if (avgScore >= 50) masteryStatus = 'needs_practice';
        else masteryStatus = 'struggling';
      }

      // Weakness Score: 0 (no struggle) to 100 (highest urgency for intervention)
      // Calculated from low accuracy + volume of student mistakes
      let weaknessScore = 0;
      if (stat.completedAttempts > 0) {
        const errorWeight = (100 - avgScore);
        const mistakeFactor = Math.min(20, stat.mistakesCount * 2);
        weaknessScore = Math.min(100, Math.round(errorWeight * 0.8 + mistakeFactor));
      }

      return {
        topicId: t.id,
        topicTitle: t.title,
        skill: t.skill,
        gradeId: t.gradeId,
        cefrLevel: t.cefrLevel,
        questionCount: t.questionCount,
        totalAttempts: stat.totalAttempts,
        completedAttempts: stat.completedAttempts,
        uniqueStudentsCount: stat.uniqueStudents.size,
        averageScore: avgScore,
        masteryStatus,
        weaknessScore,
        commonMistakesCount: stat.mistakesCount,
        commonMistakePrompts: stat.mistakePrompts,
      };
    });

    // Sort topics by weaknessScore descending (struggling topics first)
    topicItems.sort((a, b) => b.weaknessScore - a.weaknessScore || b.totalAttempts - a.totalAttempts);

    // Compute Skill Pillars Aggregate
    const skillsSummary: SkillMasterySummary[] = (['grammar', 'vocabulary', 'reading', 'listening'] as const).map((skill) => {
      const skillTopics = topicItems.filter((t) => t.skill === skill);
      const totalAttempts = skillTopics.reduce((acc, t) => acc + t.totalAttempts, 0);
      const completedAttempts = skillTopics.reduce((acc, t) => acc + t.completedAttempts, 0);
      const scoreSum = skillTopics.reduce((acc, t) => acc + (t.averageScore * t.completedAttempts), 0);
      const avg = completedAttempts > 0 ? Math.round(scoreSum / completedAttempts) : 0;
      const masteredCount = skillTopics.filter((t) => t.masteryStatus === 'mastered').length;
      const needsPracticeCount = skillTopics.filter((t) => t.masteryStatus === 'needs_practice' || t.masteryStatus === 'struggling').length;

      const labels = {
        grammar: 'Grammar Structures',
        vocabulary: 'Thematic Vocabulary',
        reading: 'Reading Comprehension',
        listening: 'Listening & Dictation',
      };

      return {
        skill,
        label: labels[skill],
        totalAttempts,
        completedAttempts,
        averageScore: avg,
        uniqueStudentsCount: Math.max(...skillTopics.map((t) => t.uniqueStudentsCount), 0),
        masteredTopicsCount: masteredCount,
        needsPracticeTopicsCount: needsPracticeCount,
      };
    });

    return { skills: skillsSummary, topics: topicItems };
  }

  /**
   * Computes student participation matrix displaying completion, accuracy, and section engagement.
   * Explicitly detects students who have NOT started General English or Mixed Practice.
   */
  public static computeStudentParticipation(
    roster: RosterStudent[] = [],
    attempts: StudentAttemptRecord[] = []
  ): StudentSectionParticipation[] {
    // Group attempts by studentNumber
    const attemptsByStudent = new Map<string, StudentAttemptRecord[]>();
    for (const att of attempts) {
      const sNum = (att as unknown as { studentNumber?: string }).studentNumber || '';
      if (!sNum) continue;
      if (!attemptsByStudent.has(sNum)) {
        attemptsByStudent.set(sNum, []);
      }
      attemptsByStudent.get(sNum)!.push(att);
    }

    return roster.map((student) => {
      const sAttempts = attemptsByStudent.get(student.studentNumber) || [];

      let uAttempts = 0;
      let uCompleted = 0;
      let uScoreSum = 0;

      let gAttempts = 0;
      let gCompleted = 0;
      let gScoreSum = 0;

      let mAttempts = 0;
      let mCompleted = 0;
      let mScoreSum = 0;

      let totalXp = 0;
      let latestDate: Date | null = null;

      for (const att of sAttempts) {
        const section = this.classifyLearningSection(att.unitId, att.activityId, att.unitTitle);
        const startedDate = att.startedAt ? new Date(att.startedAt) : null;
        if (startedDate && (!latestDate || startedDate > latestDate)) {
          latestDate = startedDate;
        }

        if (section === 'unit_review') {
          uAttempts++;
          if (att.status === 'completed') {
            uCompleted++;
            uScoreSum += att.percentage || 0;
            totalXp += Math.round(20 + ((att.percentage || 0) * 0.8));
          }
        } else if (section === 'general_english') {
          gAttempts++;
          if (att.status === 'completed') {
            gCompleted++;
            gScoreSum += att.percentage || 0;
            totalXp += Math.round(20 + ((att.percentage || 0) * 0.8));
          }
        } else if (section === 'mixed_practice') {
          mAttempts++;
          if (att.status === 'completed') {
            mCompleted++;
            mScoreSum += att.percentage || 0;
            totalXp += Math.round(20 + ((att.percentage || 0) * 0.8));
          }
        }
      }

      // If student has cached gamification data, prefer authoritative XP
      const overallCompleted = uCompleted + gCompleted + mCompleted;
      const overallScoresSum = uScoreSum + gScoreSum + mScoreSum;
      const overallAccuracy = overallCompleted > 0 ? Math.round(overallScoresSum / overallCompleted) : (student.averageCompletedScore || 0);

      return {
        studentNumber: student.studentNumber,
        fullName: student.fullName,
        class: student.class,
        grade: student.grade,
        lastLoginAt: student.lastLoginAt,
        lastActivityDate: latestDate ? latestDate.toISOString() : (student.lastLoginAt || null),
        totalXp: totalXp > 0 ? totalXp : (student.totalAttempts * 25),
        // Unit Review
        unitReviewAttempts: uAttempts,
        unitReviewCompleted: uCompleted,
        unitReviewAccuracy: uCompleted > 0 ? Math.round(uScoreSum / uCompleted) : 0,
        unitReviewStarted: uAttempts > 0 || student.completedActivitiesCount > 0,
        // General English
        generalEnglishAttempts: gAttempts,
        generalEnglishCompleted: gCompleted,
        generalEnglishAccuracy: gCompleted > 0 ? Math.round(gScoreSum / gCompleted) : 0,
        generalEnglishStarted: gAttempts > 0,
        // Mixed Practice
        mixedPracticeAttempts: mAttempts,
        mixedPracticeCompleted: mCompleted,
        mixedPracticeAccuracy: mCompleted > 0 ? Math.round(mScoreSum / mCompleted) : 0,
        mixedPracticeStarted: mAttempts > 0,
        // Aggregate
        overallAccuracy,
        totalAttempts: sAttempts.length || student.totalAttempts,
        totalCompleted: overallCompleted,
      };
    });
  }

  /**
   * Filters the student participation list by class, grade, participation status, and search term.
   */
  public static filterStudentParticipation(
    students: StudentSectionParticipation[],
    filters: DashboardFilterOptions
  ): StudentSectionParticipation[] {
    return students.filter((s) => {
      // Class filter
      if (filters.classId && filters.classId !== 'all' && s.class !== filters.classId) {
        return false;
      }

      // Grade filter
      if (filters.gradeId && filters.gradeId !== 'all' && s.grade !== filters.gradeId) {
        return false;
      }

      // Participation Status Filter
      if (filters.participationFilter === 'not_started_general' && s.generalEnglishStarted) {
        return false;
      }
      if (filters.participationFilter === 'not_started_mixed' && s.mixedPracticeStarted) {
        return false;
      }
      if (filters.participationFilter === 'active_all') {
        if (!s.unitReviewStarted || !s.generalEnglishStarted || !s.mixedPracticeStarted) {
          return false;
        }
      }

      // Search term
      if (filters.searchTerm && filters.searchTerm.trim()) {
        const term = filters.searchTerm.trim().toLowerCase();
        const matchNum = s.studentNumber.toLowerCase().includes(term);
        const matchName = s.fullName.toLowerCase().includes(term);
        if (!matchNum && !matchName) return false;
      }

      return true;
    });
  }

  // ============================================================================
  // EXPORT GENERATION: RFC-4180 CSV & XLSX
  // ============================================================================

  /**
   * Exports Section Breakdown Summary to RFC-4180 CSV with UTF-8 BOM.
   */
  public static exportSectionSummaryCsv(summary: SectionBreakdownSummary): string {
    const rows: Array<Array<string | number>> = [
      ['Learning Section', 'Total Attempts', 'Completed Activities', 'Average Accuracy (%)', 'Active Students', 'Total XP Earned', 'Total Time (Minutes)'],
      [
        'Unit Review (Curriculum)',
        summary.unitReview.totalAttempts,
        summary.unitReview.completedAttempts,
        `${summary.unitReview.averageScore}%`,
        summary.unitReview.uniqueStudentsCount,
        summary.unitReview.totalXpEarned,
        Math.round(summary.unitReview.totalTimeSpentSeconds / 60),
      ],
      [
        'General English (Skills)',
        summary.generalEnglish.totalAttempts,
        summary.generalEnglish.completedAttempts,
        `${summary.generalEnglish.averageScore}%`,
        summary.generalEnglish.uniqueStudentsCount,
        summary.generalEnglish.totalXpEarned,
        Math.round(summary.generalEnglish.totalTimeSpentSeconds / 60),
      ],
      [
        'Mixed Practice Lab',
        summary.mixedPractice.totalAttempts,
        summary.mixedPractice.completedAttempts,
        `${summary.mixedPractice.averageScore}%`,
        summary.mixedPractice.uniqueStudentsCount,
        summary.mixedPractice.totalXpEarned,
        Math.round(summary.mixedPractice.totalTimeSpentSeconds / 60),
      ],
    ];

    return '\uFEFF' + generateCsv(rows);
  }

  /**
   * Exports Student Participation & Section Matrix to RFC-4180 CSV with UTF-8 BOM.
   */
  public static exportStudentParticipationCsv(participants: StudentSectionParticipation[]): string {
    const rows: Array<Array<string | number>> = [
      [
        'Student Number',
        'Student Name',
        'Class',
        'Grade',
        'Last Activity Date',
        'Total XP',
        'Overall Accuracy (%)',
        'Unit Review Started',
        'Unit Review Completed',
        'Unit Review Accuracy (%)',
        'General English Started',
        'General English Completed',
        'General English Accuracy (%)',
        'Mixed Practice Started',
        'Mixed Practice Completed',
        'Mixed Practice Accuracy (%)',
      ],
      ...participants.map((p) => [
        p.studentNumber,
        p.fullName,
        p.class,
        p.grade === 'grade-7' ? 'Grade 7' : 'Grade 8',
        p.lastActivityDate ? p.lastActivityDate.slice(0, 10) : 'Never',
        p.totalXp,
        `${p.overallAccuracy}%`,
        p.unitReviewStarted ? 'YES' : 'NO',
        p.unitReviewCompleted,
        `${p.unitReviewAccuracy}%`,
        p.generalEnglishStarted ? 'YES' : 'NO',
        p.generalEnglishCompleted,
        `${p.generalEnglishAccuracy}%`,
        p.mixedPracticeStarted ? 'YES' : 'NO',
        p.mixedPracticeCompleted,
        `${p.mixedPracticeAccuracy}%`,
      ]),
    ];

    return '\uFEFF' + generateCsv(rows);
  }

  /**
   * Exports Topic-Level Mastery & Weakness Diagnostics to RFC-4180 CSV with UTF-8 BOM.
   */
  public static exportTopicMasteryCsv(topics: TopicMasteryItem[]): string {
    const rows: Array<Array<string | number>> = [
      [
        'Topic ID',
        'Topic Title',
        'Skill Pillar',
        'Grade',
        'CEFR Level',
        'Mastery Status',
        'Weakness Urgency Score (0-100)',
        'Total Attempts',
        'Completed',
        'Students Practiced',
        'Average Accuracy (%)',
        'Common Mistakes Recorded',
      ],
      ...topics.map((t) => [
        t.topicId,
        t.topicTitle,
        t.skill.toUpperCase(),
        t.gradeId === 'grade-7' ? 'Grade 7' : 'Grade 8',
        t.cefrLevel,
        t.masteryStatus.replace('_', ' ').toUpperCase(),
        t.weaknessScore,
        t.totalAttempts,
        t.completedAttempts,
        t.uniqueStudentsCount,
        `${t.averageScore}%`,
        t.commonMistakesCount,
      ]),
    ];

    return '\uFEFF' + generateCsv(rows);
  }

  /**
   * Exports Question-Level Mistake Logs to RFC-4180 CSV with UTF-8 BOM.
   */
  public static exportQuestionMistakesCsv(answers: StudentAnswerRecord[]): string {
    const wrongAnswers = answers.filter((a) => !a.isCorrect);
    const rows: Array<Array<string | number>> = [
      [
        'Answer ID',
        'Attempt ID',
        'Learning Section',
        'Skill',
        'Question ID',
        'Question Prompt',
        'Student Response',
        'Correct Answer',
        'Time Spent (Sec)',
        'Recorded At',
      ],
      ...wrongAnswers.map((a) => [
        a.answerId,
        a.attemptId,
        (a.learningSection || 'unit_review').replace('_', ' ').toUpperCase(),
        (a.skill || 'general').toUpperCase(),
        a.questionId,
        a.questionPrompt,
        a.studentResponse,
        a.correctAnswer,
        a.timeSpentSeconds,
        a.timestamp || '',
      ]),
    ];

    return '\uFEFF' + generateCsv(rows);
  }

  /**
   * Generates a native Excel .xlsx file for Student Participation.
   */
  public static async exportStudentParticipationXlsx(participants: StudentSectionParticipation[]): Promise<Uint8Array> {
    const rows: Array<Array<string | number>> = [
      [
        'Student Number',
        'Student Name',
        'Class',
        'Grade',
        'Last Activity Date',
        'Total XP',
        'Overall Accuracy (%)',
        'Unit Review Started',
        'Unit Review Completed',
        'Unit Review Accuracy (%)',
        'General English Started',
        'General English Completed',
        'General English Accuracy (%)',
        'Mixed Practice Started',
        'Mixed Practice Completed',
        'Mixed Practice Accuracy (%)',
      ],
      ...participants.map((p) => [
        p.studentNumber,
        p.fullName,
        p.class,
        p.grade === 'grade-7' ? 'Grade 7' : 'Grade 8',
        p.lastActivityDate ? p.lastActivityDate.slice(0, 10) : 'Never',
        p.totalXp,
        p.overallAccuracy,
        p.unitReviewStarted ? 'YES' : 'NO',
        p.unitReviewCompleted,
        p.unitReviewAccuracy,
        p.generalEnglishStarted ? 'YES' : 'NO',
        p.generalEnglishCompleted,
        p.generalEnglishAccuracy,
        p.mixedPracticeStarted ? 'YES' : 'NO',
        p.mixedPracticeCompleted,
        p.mixedPracticeAccuracy,
      ]),
    ];

    return await generateXlsx(rows);
  }

  // ============================================================================
  // EXPORT CONVENIENCE ALIASES
  // ============================================================================

  public static generateSectionBreakdownCsv(summary: SectionBreakdownSummary, _cohortSize?: number): string {
    return this.exportSectionSummaryCsv(summary);
  }

  public static generateStudentParticipationCsv(participants: StudentSectionParticipation[]): string {
    return this.exportStudentParticipationCsv(participants);
  }

  public static generateTopicMasteryCsv(topics: TopicMasteryItem[]): string {
    return this.exportTopicMasteryCsv(topics);
  }

  public static generateQuestionMistakesCsv(answers: StudentAnswerRecord[]): string {
    return this.exportQuestionMistakesCsv(answers);
  }

  public static async generateSectionAnalyticsXlsx(
    _summary: SectionBreakdownSummary,
    _topics: TopicMasteryItem[],
    participants: StudentSectionParticipation[],
    _answers: StudentAnswerRecord[] = []
  ): Promise<Uint8Array> {
    return await this.exportStudentParticipationXlsx(participants);
  }

  /**
   * Triggers native browser download for CSV or XLSX binary.
   */
  public static triggerDownload(data: string | Uint8Array, filename: string, mimeType: string): void {
    const blob = typeof data === 'string'
      ? new Blob([data], { type: `${mimeType};charset=utf-8;` })
      : new Blob([data as BlobPart], { type: mimeType });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
