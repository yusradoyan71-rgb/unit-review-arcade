/**
 * UNIT REVIEW ARCADE — TEACHER DASHBOARD & REPORTING TYPES (PHASE 3B)
 * 
 * Authoritative TypeScript interfaces matching the Google Apps Script Phase 3A
 * backend responses and payloads.
 */

export type TeacherAuthErrorCode =
  | 'NOT_CONFIGURED'
  | 'LOCKED'
  | 'UNAUTHORIZED'
  | 'RATE_LIMITED'
  | 'BAD_REQUEST'
  | 'NOT_FOUND'
  | 'INTERNAL_ERROR'
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'ENDPOINT_MISMATCH';

export interface TeacherSession {
  teacherToken: string;
  teacherName: string;
  expiresAt: string;
}

export interface TeacherLoginResponse {
  success: boolean;
  teacherToken?: string;
  teacherName?: string;
  expiresAt?: string;
  error?: string;
  code?: TeacherAuthErrorCode;
  attemptsRemaining?: number;
}

export interface TeacherCheckSessionResponse {
  success: boolean;
  active?: boolean;
  teacherName?: string;
  error?: string;
  code?: TeacherAuthErrorCode;
}

export interface TeacherLogoutResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// ---------------------------------------------------------------------------
// OVERVIEW REPORTING
// ---------------------------------------------------------------------------

export interface TeacherOverviewKpis {
  totalStudents: number;
  studentsLoggedIn: number;
  studentsNeverLoggedIn: number;
  totalAttempts: number;
  completedAttempts: number;
  abandonedAttempts: number;
  inProgressAttempts: number;
  averageScore: number;
  totalTimeSpentSeconds: number;
  activeStudentsLast7Days: number;
}

export interface ClassStatSummary {
  classId: '7A' | '7B' | '8A' | '8B' | string;
  studentCount: number;
  activeCount: number;
  totalAttempts: number;
  completedAttempts: number;
  averageScore: number;
  completionRate: number;
}

export interface UnitStatSummary {
  unitId: string;
  unitTitle: string;
  totalAttempts: number;
  completedAttempts: number;
  averageScore: number;
}

export interface GameStatSummary {
  gameType: string;
  totalAttempts: number;
  completedAttempts: number;
  averageScore: number;
  avgDurationSeconds: number;
}

export interface RecentActivityRecord {
  attemptId: string;
  studentNumber: string;
  studentName: string;
  class: string;
  unitTitle: string;
  activityTitle: string;
  gameType: string;
  status: 'completed' | 'abandoned' | 'interrupted' | 'in_progress' | string;
  score: number;
  percentage: number;
  startedAt: string | null;
  durationSeconds: number;
}

export interface TeacherOverviewResponse {
  success: boolean;
  overview?: TeacherOverviewKpis;
  classStats?: ClassStatSummary[];
  unitStats?: UnitStatSummary[];
  gameStats?: GameStatSummary[];
  recentActivity?: RecentActivityRecord[];
  sectionBreakdown?: SectionBreakdownSummary;
  error?: string;
  code?: TeacherAuthErrorCode;
}

// ---------------------------------------------------------------------------
// ROSTER REPORTING
// ---------------------------------------------------------------------------

export interface RosterStudent {
  studentId: string;
  studentNumber: string;
  fullName: string;
  grade: 'grade-7' | 'grade-8' | string;
  class: '7A' | '7B' | '8A' | '8B' | string;
  lastLoginAt: string | null;
  isActive: boolean;
  totalAttempts: number;
  completedActivitiesCount: number;
  totalPublishedActivities: number;
  curriculumProgressPercentage: number;
  customActivitiesCompletedCount: number;
  averageCompletedScore: number;
  bestScore: number;
  totalTimeSpentSeconds: number;
  status: 'active' | 'never_logged_in' | 'needs_attention';
  // Section breakdown telemetry (Phase 5)
  unitReviewStarted?: boolean;
  unitReviewCompletedCount?: number;
  unitReviewAverageScore?: number;
  generalEnglishStarted?: boolean;
  generalEnglishCompletedCount?: number;
  generalEnglishAverageScore?: number;
  mixedPracticeStarted?: boolean;
  mixedPracticeCompletedCount?: number;
  mixedPracticeAverageScore?: number;
}

export interface TeacherRosterResponse {
  success: boolean;
  roster?: RosterStudent[];
  error?: string;
  code?: TeacherAuthErrorCode;
}

// ---------------------------------------------------------------------------
// STUDENT DETAIL & REPEATED ATTEMPT GAINS
// ---------------------------------------------------------------------------

export interface StudentDetailInfo {
  studentId: string;
  studentNumber: string;
  fullName: string;
  grade: string;
  class: string;
  createdAt: string | null;
  lastLoginAt: string | null;
  isActive: boolean;
}

export interface StudentAttemptRecord {
  attemptId: string;
  unitId: string;
  unitTitle: string;
  activityId: string;
  activityTitle: string;
  gameType: string;
  learningSection?: 'unit_review' | 'general_english' | 'mixed_practice';
  skill?: 'grammar' | 'vocabulary' | 'reading' | 'listening' | 'mixed';
  topicId?: string;
  attemptNumber: number;
  score: number;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedQuestions: number;
  percentage: number;
  startedAt: string | null;
  completedAt: string | null;
  durationSeconds: number;
  status: string;
  contentVersion: string | null;
  versionLabel: string;
}

export interface RepeatedAttemptGain {
  activityId: string;
  activityTitle: string;
  totalAttempts: number;
  firstScore: number;
  latestScore: number;
  bestScore: number;
  scoreGain: number; // positive = growth, negative = drop
}

export interface StudentAnswerRecord {
  answerId: string;
  attemptId: string;
  unitId: string;
  activityId: string;
  questionId: string;
  questionOrder: number;
  questionPrompt: string;
  studentResponse: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpentSeconds: number;
  timestamp: string | null;
  questionVersion: string | null;
  versionLabel: string;
  learningSection?: 'unit_review' | 'general_english' | 'mixed_practice';
  skill?: 'grammar' | 'vocabulary' | 'reading' | 'listening' | 'mixed';
}

export interface TeacherStudentDetailResponse {
  success: boolean;
  student?: StudentDetailInfo;
  attempts?: StudentAttemptRecord[];
  repeatedAttemptGains?: RepeatedAttemptGain[];
  answers?: StudentAnswerRecord[];
  error?: string;
  code?: TeacherAuthErrorCode;
}

// ---------------------------------------------------------------------------
// QUESTION ANALYTICS & DIAGNOSTICS
// ---------------------------------------------------------------------------

export interface CommonIncorrectResponse {
  response: string;
  count: number;
  percentage: number;
  distinctStudentsCount?: number;
}

export interface QuestionDiagnosticItem {
  compositeKey: string;
  questionId: string;
  questionVersion: string | null;
  versionLabel: string;
  questionPrompt: string;
  unitId: string;
  activityId: string;
  timesAnswered: number;
  distinctStudentsCount?: number;
  correctCount: number;
  incorrectCount: number;
  accuracyRate: number; // 0-100%
  commonIncorrectResponses: CommonIncorrectResponse[];
}

export interface TeacherQuestionAnalyticsResponse {
  success: boolean;
  questionAnalytics?: QuestionDiagnosticItem[];
  error?: string;
  code?: TeacherAuthErrorCode;
}

// ---------------------------------------------------------------------------
// CURRICULUM PUBLISHING & SYNC
// ---------------------------------------------------------------------------

export interface CurriculumPublishItem {
  gradeId: string;
  unitId: string;
  unitTitle: string;
  activityId: string;
  activityTitle: string;
  gameType: string;
  totalQuestions: number;
  contentVersion: string;
  isPublished?: boolean;
}

export interface TeacherPublishCurriculumResponse {
  success: boolean;
  publishedCount?: number;
  message?: string;
  error?: string;
  code?: TeacherAuthErrorCode;
}

// ---------------------------------------------------------------------------
// FILTERS
// ---------------------------------------------------------------------------

export type LearningSection = 'all' | 'unit_review' | 'general_english' | 'mixed_practice';
export type SkillCategory = 'all' | 'grammar' | 'vocabulary' | 'reading' | 'listening';

export interface DashboardFilterOptions {
  classId?: 'all' | '7A' | '7B' | '8A' | '8B';
  gradeId?: 'all' | 'grade-7' | 'grade-8';
  unitId?: string;
  gameType?: string;
  learningSection?: LearningSection;
  skill?: SkillCategory;
  topicId?: string;
  studentNumber?: string;
  participationFilter?: 'all' | 'not_started_general' | 'not_started_mixed' | 'active_all';
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  includeArchived?: boolean;
}

// ---------------------------------------------------------------------------
// PHASE 5: GENERAL ENGLISH & MIXED PRACTICE ANALYTICS & REPORTING
// ---------------------------------------------------------------------------

export interface SectionMetricsSummary {
  totalAttempts: number;
  completedAttempts: number;
  averageScore: number;
  uniqueStudentsCount: number;
  totalXpEarned: number;
  totalTimeSpentSeconds: number;
}

export interface SectionBreakdownSummary {
  unitReview: SectionMetricsSummary;
  generalEnglish: SectionMetricsSummary;
  mixedPractice: SectionMetricsSummary;
}

export interface SkillMasterySummary {
  skill: 'grammar' | 'vocabulary' | 'reading' | 'listening';
  label: string;
  totalAttempts: number;
  completedAttempts: number;
  averageScore: number;
  uniqueStudentsCount: number;
  masteredTopicsCount: number;
  needsPracticeTopicsCount: number;
}

export type TopicMasteryStatus = 'mastered' | 'proficient' | 'needs_practice' | 'struggling' | 'not_started';

export interface TopicMasteryItem {
  topicId: string;
  topicTitle: string;
  skill: 'grammar' | 'vocabulary' | 'reading' | 'listening';
  gradeId: 'grade-7' | 'grade-8';
  cefrLevel: string;
  questionCount: number;
  totalAttempts: number;
  completedAttempts: number;
  uniqueStudentsCount: number;
  averageScore: number; // 0-100%
  masteryStatus: TopicMasteryStatus;
  weaknessScore: number; // 0-100 (higher means greater urgency for teacher intervention)
  commonMistakesCount: number;
  commonMistakePrompts: string[];
}

export interface StudentSectionParticipation {
  studentNumber: string;
  fullName: string;
  class: string;
  grade: string;
  lastLoginAt: string | null;
  lastActivityDate: string | null;
  totalXp: number;
  // Unit Review
  unitReviewAttempts: number;
  unitReviewCompleted: number;
  unitReviewAccuracy: number;
  unitReviewStarted: boolean;
  // General English
  generalEnglishAttempts: number;
  generalEnglishCompleted: number;
  generalEnglishAccuracy: number;
  generalEnglishStarted: boolean;
  // Mixed Practice
  mixedPracticeAttempts: number;
  mixedPracticeCompleted: number;
  mixedPracticeAccuracy: number;
  mixedPracticeStarted: boolean;
  // Aggregate
  overallAccuracy: number;
  totalAttempts: number;
  totalCompleted: number;
}

export interface TeacherSectionAnalyticsResponse {
  success: boolean;
  sectionBreakdown?: SectionBreakdownSummary;
  skillMastery?: SkillMasterySummary[];
  topics?: TopicMasteryItem[];
  studentParticipation?: StudentSectionParticipation[];
  attempts?: StudentAttemptRecord[];
  answers?: StudentAnswerRecord[];
  error?: string;
  code?: TeacherAuthErrorCode;
}

// ---------------------------------------------------------------------------
// STUDENT ROSTER MANAGEMENT & CREDENTIALS (PHASE 3B)
// ---------------------------------------------------------------------------

export interface StudentManagementRecord {
  studentId: string;
  studentNumber: string;
  fullName: string;
  grade: string;
  class: string;
  isActive: boolean;
  createdAt?: string;
  lastLoginAt?: string | null;
}

export interface TeacherAddStudentPayload {
  studentNumber: string;
  fullName: string;
  class: '7A' | '7B' | '8A' | '8B';
  pin?: string;
}

export interface TeacherAddStudentResponse {
  success: boolean;
  message?: string;
  student?: StudentManagementRecord;
  generatedPin?: string;
  error?: string;
  code?: TeacherAuthErrorCode;
}

export interface TeacherBulkImportItem {
  studentNumber: string;
  fullName: string;
  class: '7A' | '7B' | '8A' | '8B';
  pin?: string;
}

export interface TeacherBulkImportResponse {
  success: boolean;
  count?: number;
  message?: string;
  importedStudents?: Array<StudentManagementRecord & { pin: string }>;
  validationErrors?: string[];
  error?: string;
  code?: TeacherAuthErrorCode;
}

export interface TeacherUpdateStudentPayload {
  studentNumber: string;
  fullName: string;
  class: '7A' | '7B' | '8A' | '8B';
  isActive?: boolean;
}

export interface TeacherUpdateStudentResponse {
  success: boolean;
  message?: string;
  student?: {
    studentNumber: string;
    fullName: string;
    grade: string;
    class: string;
    isActive: boolean;
  };
  error?: string;
  code?: TeacherAuthErrorCode;
}

export interface TeacherResetPinResponse {
  success: boolean;
  message?: string;
  studentNumber?: string;
  fullName?: string;
  newPin?: string;
  error?: string;
  code?: TeacherAuthErrorCode;
}

export interface TeacherBulkResetPinsPayload {
  studentNumbers?: string[];
  class?: '7A' | '7B' | '8A' | '8B' | 'all';
  operationId?: string;
}

export interface TeacherBulkResetPinsItem {
  studentId: string;
  studentNumber: string;
  fullName: string;
  grade: string;
  class: string;
  pin: string;
}

export interface TeacherBulkResetPinsResponse {
  success: boolean;
  count?: number;
  message?: string;
  credentials?: TeacherBulkResetPinsItem[];
  operationId?: string;
  isIdempotent?: boolean;
  recovered?: boolean;
  expiresAt?: string;
  error?: string;
  code?: TeacherAuthErrorCode;
}

export interface TeacherSetStudentActiveResponse {
  success: boolean;
  message?: string;
  studentNumber?: string;
  isActive?: boolean;
  error?: string;
  code?: TeacherAuthErrorCode;
}

export interface TeacherDemoAccountPreview {
  studentNumber: string;
  fullName: string;
  class: string;
  grade: string;
  isActive: boolean;
  isArchived: boolean;
  attemptsCount: number;
  sessionsCount: number;
}

export interface TeacherDemoAccountsResponse {
  success: boolean;
  demoAccounts?: TeacherDemoAccountPreview[];
  error?: string;
  code?: TeacherAuthErrorCode;
}

export interface TeacherArchiveDemoResponse {
  success: boolean;
  archivedCount?: number;
  message?: string;
  error?: string;
  code?: TeacherAuthErrorCode;
}

export interface TeacherSetAllPinsDefaultPayload {
  confirm?: boolean;
  pin?: string;
}

export interface TeacherSetAllPinsDefaultResponse {
  success: boolean;
  preview?: boolean;
  executed?: boolean;
  alreadyApplied?: boolean;
  count?: number;
  pin?: string;
  defaultPin?: string;
  message?: string;
  affectedStudents?: Array<{
    studentNumber: string;
    fullName: string;
    className: string;
    grade: string;
  }>;
  affectedNumbers?: string[];
  error?: string;
  code?: TeacherAuthErrorCode;
}

