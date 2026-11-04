/**
 * UNIT REVIEW ARCADE — API SERVICE
 * Version: 1.0.0
 * 
 * Secure communication layer for Google Apps Script Web App backend.
 * Uses text/plain payloads with redirect: 'follow' to guarantee robust CORS
 * compatibility across GitHub Pages and classroom devices.
 */

import type { AuthApiResponse, LoginCredentials, StudentProfile } from '../types/auth';

const STORAGE_API_KEY = 'unit_review_arcade_api_url';

// Built-in Demo Accounts (Matches the Apps Script createDemoStudentAccounts routine)
// Used when no Apps Script URL is configured or when offline
const DEMO_STUDENTS: Array<{
  num: string;
  pin: string;
  profile: StudentProfile;
}> = [
  { num: '701', pin: '1234', profile: { studentNumber: '701', displayName: 'Kerem Y.', firstName: 'Kerem', class: '7A', grade: 'grade-7' } },
  { num: '702', pin: '4321', profile: { studentNumber: '702', displayName: 'Zeynep K.', firstName: 'Zeynep', class: '7A', grade: 'grade-7' } },
  { num: '703', pin: '1111', profile: { studentNumber: '703', displayName: 'Can D.', firstName: 'Can', class: '7B', grade: 'grade-7' } },
  { num: '704', pin: '2222', profile: { studentNumber: '704', displayName: 'Elif Ş.', firstName: 'Elif', class: '7B', grade: 'grade-7' } },
  { num: '801', pin: '1234', profile: { studentNumber: '801', displayName: 'Barış A.', firstName: 'Barış', class: '8A', grade: 'grade-8' } },
  { num: '802', pin: '4321', profile: { studentNumber: '802', displayName: 'Ayşe Ç.', firstName: 'Ayşe', class: '8A', grade: 'grade-8' } },
  { num: '803', pin: '1111', profile: { studentNumber: '803', displayName: 'Murat Y.', firstName: 'Murat', class: '8B', grade: 'grade-8' } },
  { num: '804', pin: '2222', profile: { studentNumber: '804', displayName: 'Selin A.', firstName: 'Selin', class: '8B', grade: 'grade-8' } },
];

export class ApiService {
  /**
   * Retrieves the current Google Apps Script deployment URL.
   * Priority: localStorage override -> Vite environment variable -> null
   */
  public static getApiUrl(): string | null {
    try {
      const stored = localStorage.getItem(STORAGE_API_KEY);
      if (stored && stored.trim().startsWith('http')) {
        return stored.trim();
      }
    } catch {
      // Ignore localStorage access errors
    }

    const envUrl = (import.meta as unknown as { env?: { VITE_APPS_SCRIPT_URL?: string } }).env?.VITE_APPS_SCRIPT_URL;
    if (envUrl && envUrl.trim().startsWith('http')) {
      return envUrl.trim();
    }

    return null;
  }

  /**
   * Saves or clears the API URL in localStorage.
   */
  public static setApiUrl(url: string | null): void {
    try {
      if (url && url.trim().length > 0) {
        localStorage.setItem(STORAGE_API_KEY, url.trim());
      } else {
        localStorage.removeItem(STORAGE_API_KEY);
      }
    } catch (err) {
      console.warn('Failed to persist API URL to localStorage:', err);
    }
  }

  /**
   * Checks whether a live Google Apps Script endpoint is configured.
   */
  public static hasLiveEndpoint(): boolean {
    return this.getApiUrl() !== null;
  }

  /**
   * Authenticates a student using student number and PIN.
   */
  public static async login(credentials: LoginCredentials): Promise<AuthApiResponse> {
    const apiUrl = this.getApiUrl();

    // If no live URL is configured, run against local demo accounts
    if (!apiUrl) {
      return this.mockLogin(credentials);
    }

    try {
      const response = await this.postRequest<AuthApiResponse>(apiUrl, {
        action: 'student_login',
        studentNumber: credentials.studentNumber,
        pin: credentials.pin,
        userAgent: navigator.userAgent || 'Web Browser',
      });

      return response;
    } catch (err) {
      console.error('API login request failed:', err);
      const message = err instanceof Error ? err.message : 'Network communication error';
      return {
        success: false,
        error: `Unable to reach school server (${message}). Check internet connection or contact teacher.`,
      };
    }
  }

  /**
   * Validates an existing session token.
   */
  public static async checkSession(sessionToken: string): Promise<AuthApiResponse> {
    const apiUrl = this.getApiUrl();

    if (!apiUrl) {
      // Check if session token belongs to demo student
      const match = DEMO_STUDENTS.find((s) => `mock_token_${s.num}` === sessionToken);
      if (match) {
        return {
          success: true,
          student: match.profile,
        };
      }
      return { success: false, error: 'Session expired or not found in demo mode.' };
    }

    try {
      const response = await this.postRequest<AuthApiResponse>(apiUrl, {
        action: 'student_session_check',
        sessionToken,
      });

      return response;
    } catch (err) {
      console.warn('Session check network error:', err);
      return { success: false, error: 'Session check failed' };
    }
  }

  /**
   * Notifies backend of student logout.
   */
  public static async logout(sessionToken: string): Promise<AuthApiResponse> {
    const apiUrl = this.getApiUrl();

    if (!apiUrl) {
      return { success: true, message: 'Logged out from demo mode.' };
    }

    try {
      return await this.postRequest<AuthApiResponse>(apiUrl, {
        action: 'student_logout',
        sessionToken,
      });
    } catch (err) {
      console.warn('Logout API notification failed:', err);
      return { success: true }; // Logout should proceed client-side regardless
    }
  }

  /**
   * Internal HTTP POST wrapper designed specifically for Google Apps Script Web Apps.
   * Sends JSON wrapped in text/plain to avoid browser CORS preflight restrictions.
   */
  private static async postRequest<T>(url: string, payload: unknown, timeoutMs = 12000): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          // text/plain;charset=utf-8 bypasses OPTIONS preflight in Google Apps Script
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
        redirect: 'follow',
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!response.ok) {
        throw new Error(`Server returned status HTTP ${response.status}`);
      }

      const rawText = await response.text();
      try {
        return JSON.parse(rawText) as T;
      } catch {
        throw new Error('Server returned invalid response format.');
      }
    } catch (err: unknown) {
      clearTimeout(timer);
      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error('Connection timed out. Server took too long to respond.');
      }
      throw err;
    }
  }

  /**
   * Fallback mock login for offline testing and demo classroom scenarios.
   */
  private static mockLogin(credentials: LoginCredentials): Promise<AuthApiResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const studentNumber = credentials.studentNumber.trim();
        const pin = credentials.pin.trim();

        const match = DEMO_STUDENTS.find((s) => s.num === studentNumber);

        if (!match) {
          resolve({
            success: false,
            error: 'Student number not found. Check your number or contact your teacher.',
          });
          return;
        }

        if (match.pin !== pin) {
          resolve({
            success: false,
            error: 'Incorrect PIN. Please try again.',
          });
          return;
        }

        resolve({
          success: true,
          sessionToken: `mock_token_${match.num}`,
          student: match.profile,
          expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
        });
      }, 400);
    });
  }
}
