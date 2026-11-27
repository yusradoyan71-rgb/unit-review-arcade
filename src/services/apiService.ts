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

import type { AuthApiResponse, LoginCredentials, StudentClass } from '../types/auth';
import type { GamificationApiResponse } from '../types/gamification';
import type { PersonalizedLearningApiResponse } from '../types/personalizedLearning';
import type { MonsterConfig } from '../types/monster';

export interface MonsterApiResponse {
  success: boolean;
  monster?: MonsterConfig;
  totalCoins?: number;
  error?: string;
  code?: string;
}

const STORAGE_API_KEY = 'unit_review_arcade_api_url';

// Deployed Google Apps Script Web App URL (Production)
export const DEFAULT_APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbyvVyt2EjHS1Ru4KyGOcyyVxiLiRTXLj6JB5CEpZs0gkh1yZw2OnWR5Sjvxa1sacOHOew/exec';

// Known production URL signatures for validation and migration
export const KNOWN_PROD_URL_FRAGMENTS = [
  'AKfycbyvVyt2EjHS1Ru4KyGOcyyVxiLiRTXLj6JB5CEpZs0gkh1yZw2OnWR5Sjvxa1sacOHOew',
  'AKfycbwzMiiyoKbcb83Plv_TYay4VnXXOWh9ZmlPDes6_Z-Pahk3phpTB8sqYZN6dUiAy-etjw',
  'AKfycbwPvdc7oI-1N738r_n_P_v-2T9N829bH9s27K2_JdE8R7Nf8N5yA0h0O7F_8s0V-f4'
];

export interface EndpointSecurityInfo {
  url: string;
  isDev: boolean;
  isProductionEndpoint: boolean;
  source: 'localStorage' | 'env' | 'default';
}

export interface ArenaStatusResponse {
  success: boolean;
  arenaEnabled?: boolean;
  studentNumber?: string;
  displayName?: string;
  grade?: string;
  class?: string;
  metrics?: {
    studentNumber: string;
    academicLifetimeXp: number;
    spendableXp: number;
    arenaXpDelta: number;
    level: number;
    levelTitle: string;
    todayMatchCount: number;
    remainingMatches: number;
    todayGrossLossXp: number;
    remainingLossAllowance: number;
    activeMatch: any;
    availableStakes: number[];
    dateKey: string;
  };
  error?: string;
  code?: string;
}

export interface ArenaTokenResponse {
  success: boolean;
  customToken?: string;
  studentNumber?: string;
  grade?: string;
  class?: string;
  error?: string;
  code?: string;
}

export interface ArenaChallengeResponse {
  success: boolean;
  matchId?: string;
  challenger?: string;
  opponent?: string;
  stakeXp?: number;
  grade?: string;
  status?: string;
  createdAt?: string;
  error?: string;
  code?: string;
}

export interface ArenaAcceptResponse {
  success: boolean;
  matchId?: string;
  player1?: string;
  player2?: string;
  stakeXp?: number;
  status?: string;
  error?: string;
  code?: string;
}

export interface ArenaSettleResponse {
  success: boolean;
  alreadySettled?: boolean;
  matchId?: string;
  winner?: string;
  isTie?: boolean;
  status?: string;
  p1Score?: number;
  p2Score?: number;
  p1XpChange?: number;
  p2XpChange?: number;
  settledAt?: string;
  error?: string;
  code?: string;
}

export class ApiService {
  /**
   * Determines if a URL matches any known production endpoint.
   */
  public static isProductionUrl(url: string): boolean {
    if (!url) return false;
    const clean = url.trim();
    if (clean === DEFAULT_APPS_SCRIPT_URL) return true;
    return KNOWN_PROD_URL_FRAGMENTS.some((frag) => clean.includes(frag));
  }

  /**
   * Retrieves the current Google Apps Script deployment URL with strict endpoint isolation.
   * 
   * Security & Isolation Rules:
   * 1. In development mode (import.meta.env.DEV), VITE_APPS_SCRIPT_URL (TEST backend)
   *    takes absolute priority. A legacy localStorage override is NEVER permitted to
   *    silently route development/test traffic to a production URL.
   * 2. If localStorage holds a production URL while in development mode, it is purged.
   * 3. In production mode, DEFAULT_APPS_SCRIPT_URL is used unless an explicit override is set.
   */
  public static getApiUrl(): string {
    const isDev = Boolean((import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV);
    const env = (import.meta as unknown as { env?: { VITE_APPS_SCRIPT_URL?: string; VITE_GOOGLE_SCRIPT_URL?: string } }).env;
    const envUrl = env?.VITE_APPS_SCRIPT_URL || env?.VITE_GOOGLE_SCRIPT_URL;
    const cleanEnvUrl = envUrl && envUrl.trim().startsWith('http') ? envUrl.trim() : null;

    let storedUrl: string | null = null;
    try {
      const stored = localStorage.getItem(STORAGE_API_KEY);
      if (stored && stored.trim().startsWith('http')) {
        storedUrl = stored.trim();
      }
    } catch {
      // Ignore localStorage access errors
    }

    // In development mode: enforce TEST endpoint priority and block accidental PROD routing
    if (isDev) {
      if (storedUrl && this.isProductionUrl(storedUrl)) {
        console.warn(
          '⚠️ [Security] Purged legacy localStorage API URL pointing to PRODUCTION while running in development mode.'
        );
        try {
          localStorage.removeItem(STORAGE_API_KEY);
        } catch {
          // ignore
        }
        storedUrl = null;
      }

      // In dev mode, prefer the verified test endpoint in .env.development.local
      if (cleanEnvUrl) {
        return cleanEnvUrl;
      }

      if (storedUrl && !this.isProductionUrl(storedUrl)) {
        return storedUrl;
      }

      return DEFAULT_APPS_SCRIPT_URL;
    }

    // Production mode: localStorage override (e.g. for self-hosted instances) -> envUrl -> DEFAULT_APPS_SCRIPT_URL
    if (storedUrl) {
      // If the stored URL matches an outdated production URL fragment, purge it so client switches to the updated DEFAULT_APPS_SCRIPT_URL
      if (this.isProductionUrl(storedUrl) && storedUrl !== DEFAULT_APPS_SCRIPT_URL) {
        console.warn('⚠️ [Config] Purged outdated production API URL from localStorage.');
        try {
          localStorage.removeItem(STORAGE_API_KEY);
        } catch {
          // ignore
        }
      } else {
        return storedUrl;
      }
    }

    if (cleanEnvUrl) {
      return cleanEnvUrl;
    }

    return DEFAULT_APPS_SCRIPT_URL;
  }

  /**
   * Retrieves the API URL specifically for teacher operations, with fail-closed security.
   * In development/test mode, rejects any configuration that would route teacher operations to PROD.
   */
  public static getTeacherApiUrl(): string {
    const isDev = Boolean((import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV);
    const url = this.getApiUrl();

    if (!url || !url.startsWith('http')) {
      throw new Error('Teacher backend endpoint is not configured. Please set VITE_APPS_SCRIPT_URL (or VITE_GOOGLE_SCRIPT_URL).');
    }

    if (isDev && this.isProductionUrl(url)) {
      throw new Error(
        'SECURITY VIOLATION: Cannot execute teacher test operations against the PRODUCTION backend URL. ' +
        'Please verify that VITE_APPS_SCRIPT_URL in .env.development.local points to the TEST deployment.'
      );
    }

    return url;
  }

  /**
   * Returns diagnostic security details about the active endpoint.
   */
  public static getEndpointSecurityInfo(): EndpointSecurityInfo {
    const isDev = Boolean((import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV);
    const env = (import.meta as unknown as { env?: { VITE_APPS_SCRIPT_URL?: string; VITE_GOOGLE_SCRIPT_URL?: string } }).env;
    const envUrl = (env?.VITE_APPS_SCRIPT_URL || env?.VITE_GOOGLE_SCRIPT_URL)?.trim();
    let storedUrl: string | null = null;
    try {
      storedUrl = localStorage.getItem(STORAGE_API_KEY)?.trim() || null;
    } catch {
      // ignore
    }

    const resolved = this.getApiUrl();
    let source: 'localStorage' | 'env' | 'default' = 'default';

    if (isDev) {
      if (envUrl && resolved === envUrl) {
        source = 'env';
      } else if (storedUrl && resolved === storedUrl) {
        source = 'localStorage';
      }
    } else {
      if (storedUrl && resolved === storedUrl) {
        source = 'localStorage';
      } else if (envUrl && resolved === envUrl) {
        source = 'env';
      }
    }

    return {
      url: resolved,
      isDev,
      isProductionEndpoint: this.isProductionUrl(resolved),
      source,
    };
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
   * Fetches the authenticated student's full gamification profile (XP, level, badges).
   */
  public static async getStudentProfile(sessionToken: string): Promise<GamificationApiResponse> {
    const apiUrl = this.getApiUrl();
    if (!apiUrl || !sessionToken) {
      return { success: false, error: 'Session token or server URL missing.', code: 'UNAUTHORIZED' };
    }

    try {
      return await this.postRequest<GamificationApiResponse>(apiUrl, {
        action: 'student_get_profile',
        sessionToken,
      });
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to fetch student profile.',
      };
    }
  }

  /**
   * Fetches privacy-sanitized class leaderboard for Grade 7 or Grade 8 classes.
   */
  public static async getClassLeaderboard(
    sessionToken: string,
    classId?: StudentClass
  ): Promise<GamificationApiResponse> {
    const apiUrl = this.getApiUrl();
    if (!apiUrl || !sessionToken) {
      return { success: false, error: 'Session token or server URL missing.', code: 'UNAUTHORIZED' };
    }

    try {
      return await this.postRequest<GamificationApiResponse>(apiUrl, {
        action: 'student_get_leaderboard',
        sessionToken,
        classId,
      });
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to fetch class leaderboard.',
      };
    }
  }

  /**
   * Fetches the student's historical mistakes with real-time correction tracking (Phase 6).
   */
  public static async getStudentMistakes(sessionToken: string): Promise<PersonalizedLearningApiResponse> {
    const apiUrl = this.getApiUrl();
    if (!apiUrl || !sessionToken) {
      return { success: false, error: 'Session token or server URL missing.', code: 'UNAUTHORIZED' };
    }

    try {
      return await this.postRequest<PersonalizedLearningApiResponse>(apiUrl, {
        action: 'student_get_mistakes',
        sessionToken,
      });
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to fetch student mistakes.',
      };
    }
  }

  /**
   * Fetches unit and skill topic mastery analytics separated by Grade 7 and Grade 8 (Phase 6).
   */
  public static async getStudentMastery(sessionToken: string): Promise<PersonalizedLearningApiResponse> {
    const apiUrl = this.getApiUrl();
    if (!apiUrl || !sessionToken) {
      return { success: false, error: 'Session token or server URL missing.', code: 'UNAUTHORIZED' };
    }

    try {
      return await this.postRequest<PersonalizedLearningApiResponse>(apiUrl, {
        action: 'student_get_mastery',
        sessionToken,
      });
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to fetch student mastery.',
      };
    }
  }

  /**
   * Records a practice retry for a mistake, updating correction status and XP (Phase 6).
   */
  public static async recordMistakeRetry(
    sessionToken: string,
    payload: {
      questionId: string;
      activityId: string;
      unitId: string;
      isCorrect: boolean;
      studentResponse?: string;
      correctAnswer?: string;
      questionPrompt?: string;
      timeSpentSeconds?: number;
    }
  ): Promise<PersonalizedLearningApiResponse> {
    const apiUrl = this.getApiUrl();
    if (!apiUrl || !sessionToken) {
      return { success: false, error: 'Session token or server URL missing.', code: 'UNAUTHORIZED' };
    }

    try {
      return await this.postRequest<PersonalizedLearningApiResponse>(apiUrl, {
        action: 'student_record_mistake_retry',
        sessionToken,
        ...payload,
      });
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to record mistake retry.',
      };
    }
  }

  /**
   * Saves student monster configuration to backend (Phase 8A).
   */
  public static async saveMonster(sessionToken: string, monster: MonsterConfig): Promise<MonsterApiResponse> {
    const apiUrl = this.getApiUrl();
    if (!apiUrl || !sessionToken) {
      return { success: false, error: 'Session token or server URL missing.', code: 'UNAUTHORIZED' };
    }

    try {
      return await this.postRequest<MonsterApiResponse>(apiUrl, {
        action: 'student_save_monster',
        sessionToken,
        monster,
      });
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to save monster to cloud.',
      };
    }
  }

  /**
   * Fetches student monster configuration and coin balance from backend (Phase 8A).
   */
  public static async getMonster(sessionToken: string): Promise<MonsterApiResponse> {
    const apiUrl = this.getApiUrl();
    if (!apiUrl || !sessionToken) {
      return { success: false, error: 'Session token or server URL missing.', code: 'UNAUTHORIZED' };
    }

    try {
      return await this.postRequest<MonsterApiResponse>(apiUrl, {
        action: 'student_get_monster',
        sessionToken,
      });
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to fetch monster from cloud.',
      };
    }
  }

  /**
   * Purchases an accessory from the monster shop (Phase 8B).
   */
  public static async purchaseAccessory(sessionToken: string, itemId: string): Promise<MonsterApiResponse> {
    const apiUrl = this.getApiUrl();
    if (!apiUrl || !sessionToken) {
      return { success: false, error: 'Session token or server URL missing.', code: 'UNAUTHORIZED' };
    }

    try {
      return await this.postRequest<MonsterApiResponse>(apiUrl, {
        action: 'student_purchase_accessory',
        sessionToken,
        itemId,
      });
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to complete accessory purchase.',
      };
    }
  }

  /**
   * Equips or unequips an owned accessory slot (Phase 8B).
   */
  public static async equipAccessory(
    sessionToken: string,
    slot: 'hat' | 'glasses' | 'clothing' | 'wings' | 'aura' | 'frame',
    itemId: string | null
  ): Promise<MonsterApiResponse> {
    const apiUrl = this.getApiUrl();
    if (!apiUrl || !sessionToken) {
      return { success: false, error: 'Session token or server URL missing.', code: 'UNAUTHORIZED' };
    }

    try {
      return await this.postRequest<MonsterApiResponse>(apiUrl, {
        action: 'student_equip_accessory',
        sessionToken,
        slot,
        itemId,
      });
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to update equipped accessories.',
      };
    }
  }

  /**
   * Records Games Zone coins earned directly with the backend.
   */
  public static async recordGamesZoneCoins(params: {
    sessionToken: string;
    gameId: string;
    difficulty: string;
    accuracyPercentage: number;
    correctAnswers: number;
    attemptId?: string;
  }): Promise<{
    success: boolean;
    coinsEarned: number;
    totalCoins: number;
    isCapped: boolean;
    error?: string;
  }> {
    const apiUrl = this.getApiUrl();
    if (!apiUrl || !params.sessionToken) {
      return { success: false, coinsEarned: 0, totalCoins: 0, isCapped: false, error: 'Offline' };
    }
    try {
      return await this.postRequest(apiUrl, {
        action: 'student_record_games_zone_coins',
        ...params,
      });
    } catch (err) {
      console.warn('[ApiService] Failed to record Games Zone coins:', err);
      return {
        success: false,
        coinsEarned: 0,
        totalCoins: 0,
        isCapped: false,
        error: err instanceof Error ? err.message : 'Network error',
      };
    }
  }

  // ==========================================================================
  // XP BATTLE ARENA (PHASE 4 & 5 AUTHORITATIVE BACKEND)
  // ==========================================================================
  public static async getArenaStatus(sessionToken: string): Promise<ArenaStatusResponse> {
    return this.post<ArenaStatusResponse>({ action: 'arena_get_status', sessionToken });
  }

  public static async getArenaCustomToken(sessionToken: string): Promise<ArenaTokenResponse> {
    return this.post<ArenaTokenResponse>({ action: 'arena_get_custom_token', sessionToken });
  }

  public static async createArenaChallenge(params: {
    sessionToken: string;
    opponentNumber: string;
    stakeXp: number;
  }): Promise<ArenaChallengeResponse> {
    return this.post<ArenaChallengeResponse>({
      action: 'arena_create_challenge',
      sessionToken: params.sessionToken,
      opponentNumber: params.opponentNumber,
      stakeXp: params.stakeXp,
    });
  }

  public static async acceptArenaChallenge(params: {
    sessionToken: string;
    matchId: string;
  }): Promise<ArenaAcceptResponse> {
    return this.post<ArenaAcceptResponse>({
      action: 'arena_accept_challenge',
      sessionToken: params.sessionToken,
      matchId: params.matchId,
    });
  }

  public static async settleArenaMatch(params: {
    sessionToken: string;
    matchId: string;
    idempotencyKey?: string;
    isForfeit?: boolean;
    forfeitLoser?: string;
    p1Score?: number;
    p2Score?: number;
    p1TotalTimeMs?: number;
    p2TotalTimeMs?: number;
  }): Promise<ArenaSettleResponse> {
    return this.post<ArenaSettleResponse>({
      action: 'arena_settle_match',
      sessionToken: params.sessionToken,
      matchId: params.matchId,
      idempotencyKey: params.idempotencyKey,
      isForfeit: params.isForfeit,
      forfeitLoser: params.forfeitLoser,
      p1Score: params.p1Score,
      p2Score: params.p2Score,
      p1TotalTimeMs: params.p1TotalTimeMs,
      p2TotalTimeMs: params.p2TotalTimeMs,
    });
  }

  /**
   * Generic POST method for custom actions.
   */
  public static async post<T>(payload: unknown): Promise<T> {
    const apiUrl = this.getApiUrl();
    return await this.postRequest<T>(apiUrl, payload);
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
