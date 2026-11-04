/**
 * UNIT REVIEW ARCADE — AUTHENTICATION & STUDENT TRACKING TYPES
 * Version: 1.0.0
 */

export type StudentClass = '7A' | '7B' | '8A' | '8B';
export type StudentGrade = 'grade-7' | 'grade-8';

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
