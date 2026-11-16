/**
 * UNIT REVIEW ARCADE — AUTHENTICATION & STUDENT TRACKING TYPES
 * Version: 1.0.0
 */

export type StudentClass = '7A' | '7B' | '8A' | '8B';
export type StudentGrade = 'grade-7' | 'grade-8';

/**
 * Resolves student grade exclusively from trusted class assignment.
 * Classes 7A and 7B -> grade-7
 * Classes 8A and 8B -> grade-8
 */
export function getGradeForClass(cls?: string): StudentGrade {
  const c = String(cls || '').trim().toUpperCase();
  if (c.startsWith('7') || c === '7A' || c === '7B') return 'grade-7';
  if (c.startsWith('8') || c === '8A' || c === '8B') return 'grade-8';
  return 'grade-7';
}

export interface StudentProfile {
  studentNumber: string;
  displayName: string;
  firstName: string;
  class: StudentClass;
  grade: StudentGrade;
}

export type AuthMode = 'classroom' | 'student';

export interface ActiveSession {
  sessionToken: string;
  student: StudentProfile;
  expiresAt: string;
  loginTime: string;
}

export interface LoginCredentials {
  studentNumber: string;
  pin: string;
}

export interface AuthApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  error?: string;
  sessionToken?: string;
  student?: StudentProfile;
  expiresAt?: string;
  data?: T;
}

export interface SessionCheckResponse {
  success: boolean;
  student?: StudentProfile;
  error?: string;
}
