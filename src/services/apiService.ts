/**
 * UNIT REVIEW ARCADE — API SERVICE
 * Version: 1.1.0
 * 
 * Secure communication layer for Google Apps Script Web App backend.
 * Uses text/plain payloads with redirect: 'follow' to guarantee robust CORS
 * compatibility across GitHub Pages and classroom devices.
 * 
 * NO SILENT MOCK FALLBACK: All requests are strictly processed against the
 * configured Google Apps Script Web App.
 */

import type { AuthApiResponse, LoginCredentials } from '../types/auth';

const STORAGE_API_KEY = 'unit_review_arcade_api_url';

// Deployed Google Apps Script Web App URL
export const DEFAULT_APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbwzMiiyoKbcb83Plv_TYay4VnXXOWh9ZmlPDes6_Z-Pahk3phpTB8sqYZN6dUiAy-etjw/exec';

export class ApiService {
  /**
   * Retrieves the current Google Apps Script deployment URL.
   * Priority: localStorage override -> Vite environment variable -> DEFAULT_APPS_SCRIPT_URL
   */
  public static getApiUrl(): string {
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

    return DEFAULT_APPS_SCRIPT_URL;
  }

  /**
   * Saves or resets the API URL in localStorage.
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
    const url = this.getApiUrl();
    return typeof url === 'string' && url.startsWith('http');
  }

  /**
   * Authenticates a student using student number and PIN against the Google Apps Script backend.
   * Does NOT silently fall back to local mock authentication.
   */
  public static async login(credentials: LoginCredentials): Promise<AuthApiResponse> {
    const apiUrl = this.getApiUrl();

    if (!apiUrl) {
      return {
        success: false,
        error: 'School tracking server is not configured. Please contact your teacher.',
      };
    }

    try {
      const response = await this.postRequest<AuthApiResponse>(apiUrl, {
        action: 'student_login',
        studentNumber: credentials.studentNumber.trim(),
        pin: credentials.pin.trim(),
        userAgent: navigator.userAgent || 'Web Browser',
      });

      return response;
    } catch (err) {
      console.error('API login request failed:', err);
      const message = err instanceof Error ? err.message : 'Network communication error';
      return {
        success: false,
        error: `Unable to connect to school server (${message}). Please check your connection or contact your teacher.`,
      };
    }
  }

  /**
   * Validates an existing session token against the Google Apps Script backend.
   */
  public static async checkSession(sessionToken: string): Promise<AuthApiResponse> {
    const apiUrl = this.getApiUrl();

    if (!apiUrl) {
      return { success: false, error: 'Server URL not configured.' };
    }

    try {
      const response = await this.postRequest<AuthApiResponse>(apiUrl, {
        action: 'student_session_check',
        sessionToken,
      });

      return response;
    } catch (err) {
      console.warn('Session check network error:', err);
      return { success: false, error: 'Session check failed: server unreachable.' };
    }
  }

  /**
   * Notifies backend of student logout.
   */
  public static async logout(sessionToken: string): Promise<AuthApiResponse> {
    const apiUrl = this.getApiUrl();

    if (!apiUrl) {
      return { success: true };
    }

    try {
      return await this.postRequest<AuthApiResponse>(apiUrl, {
        action: 'student_logout',
        sessionToken,
      });
    } catch (err) {
      console.warn('Logout API notification failed:', err);
      return { success: true }; // Client-side logout should proceed regardless
    }
  }

  /**
   * HTTP POST wrapper designed specifically for Google Apps Script Web Apps.
   * Sends JSON wrapped in text/plain;charset=utf-8 to bypass browser CORS preflight.
   */
  public static async postRequest<T>(url: string, payload: unknown, timeoutMs = 15000): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
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
}
