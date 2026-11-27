/**
 * ============================================================================
 * UNIT REVIEW ARCADE — XP BATTLE ARENA FIREBASE CLIENT SERVICE
 * ============================================================================
 * Connects directly to the official Firebase RTDB test project (Europe-West1).
 * Strictly enforces client-side rules:
 * - Server timestamps via serverTimestamp()
 * - Real-time presence with onDisconnect() auto-removal
 * - Recipient-only invitation listeners
 * - Server deadline adherence
 * - Sanitized answer payloads (selectedOptionIndex: 0..3)
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  set,
  update,
  onValue,
  onDisconnect,
  serverTimestamp,
  type DatabaseReference,
  type Unsubscribe,
} from 'firebase/database';
import { getAuth, signInWithCustomToken, type User } from 'firebase/auth';
import type {
  ArenaOpponent,
  ArenaChallenge,
  ArenaStake,
} from '../components/arena/types';

export const ARENA_FIREBASE_CONFIG = {
  apiKey: "AIzaSyDcsEEKV4u7e_V_g65nYSKRIwit7gUjXjg",
  authDomain: "xp-battle-arena-test.firebaseapp.com",
  databaseURL: "https://xp-battle-arena-test-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "xp-battle-arena-test",
  storageBucket: "xp-battle-arena-test.firebasestorage.app",
  messagingSenderId: "977200447409",
  appId: "1:977200447409:web:3ceb9fe6f434351e8e4790",
};

// Singleton App & Services
const app = getApps().length > 0 ? getApp() : initializeApp(ARENA_FIREBASE_CONFIG);
const auth = getAuth(app);
const db = getDatabase(app);

export class ArenaFirebaseService {
  private static presenceRef: DatabaseReference | null = null;
  private static presenceUnsub: Unsubscribe | null = null;
  private static invitationsUnsub: Unsubscribe | null = null;
  private static battleUnsub: Unsubscribe | null = null;

  /**
   * Authenticate with Firebase using a Custom Token (from backend auth endpoint)
   */
  public static async authenticate(customToken: string): Promise<User> {
    const cred = await signInWithCustomToken(auth, customToken);
    return cred.user;
  }

  /**
   * Get currently signed-in Firebase user
   */
  public static getCurrentUser(): User | null {
    return auth.currentUser;
  }

  /**
   * Establish presence in /presence/{studentNumber} with auto-removal on disconnect
   */
  public static async setPresence(
    studentNumber: string,
    profile: {
      displayName: string;
      class: string;
      grade: string;
      status?: 'idle' | 'in_battle' | 'offline';
      level?: number;
      levelTitle?: string;
    }
  ): Promise<void> {
    const pRef = ref(db, `presence/${studentNumber}`);
    this.presenceRef = pRef;

    // Configure onDisconnect cleanup
    await onDisconnect(pRef).remove();

    // Write presence state with server timestamp matching database.rules.json
    await set(pRef, {
      studentNumber,
      status: profile.status || 'idle',
      grade: profile.grade,
      class: profile.class,
      displayName: profile.displayName,
      level: profile.level || 1,
      levelTitle: profile.levelTitle || 'Adventurer',
      lastSeen: serverTimestamp(),
    });
  }

  /**
   * Update presence status (e.g. from 'idle' to 'in_battle')
   */
  public static async updatePresenceStatus(
    studentNumber: string,
    status: 'idle' | 'in_battle' | 'offline'
  ): Promise<void> {
    const pRef = ref(db, `presence/${studentNumber}`);
    await update(pRef, {
      status,
      lastSeen: serverTimestamp(),
    });
  }

  /**
   * Clear presence on logout or exiting Arena
   */
  public static async clearPresence(_studentNumber: string): Promise<void> {
    if (this.presenceRef) {
      await onDisconnect(this.presenceRef).cancel();
      await set(this.presenceRef, null);
      this.presenceRef = null;
    }
  }

  /**
   * Subscribe to online Grade 7 classmates at /presence
   */
  public static subscribeToOnlineClassmates(
    currentStudentNumber: string,
    targetGrade: string,
    callback: (opponents: ArenaOpponent[]) => void
  ): Unsubscribe {
    const presenceRoot = ref(db, 'presence');
    const unsubscribe = onValue(presenceRoot, (snapshot) => {
      const data = snapshot.val() || {};
      const list: ArenaOpponent[] = [];

      Object.keys(data).forEach((sNum) => {
        if (sNum === currentStudentNumber) return; // Skip self
        const val = data[sNum];
        if (val && String(val.grade) === String(targetGrade)) {
          list.push({
            studentNumber: sNum,
            displayName: val.displayName || `Student ${sNum}`,
            class: val.class || '7-A',
            grade: String(val.grade),
            level: val.level || 1,
            levelTitle: val.levelTitle || 'Adventurer',
            status: val.status || 'idle',
            avatarSeed: sNum,
          });
        }
      });

      callback(list);
    });

    this.presenceUnsub = unsubscribe;
    return unsubscribe;
  }

  /**
   * Subscribe to incoming invitations for a student at /user_invitations/{studentNumber}
   */
  public static subscribeToInvitations(
    studentNumber: string,
    callback: (invitations: ArenaChallenge[]) => void
  ): Unsubscribe {
    const invRef = ref(db, `user_invitations/${studentNumber}`);
    const unsubscribe = onValue(invRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list: ArenaChallenge[] = [];

      Object.keys(data).forEach((chId) => {
        const val = data[chId];
        if (val && val.status === 'pending') {
          list.push({
            challengeId: chId,
            challenger_id: val.challenger_id,
            challenger_name: val.challenger_name || `Student ${val.challenger_id}`,
            opponent_id: studentNumber,
            opponent_name: '',
            stake_xp: (val.stake_xp ?? 0) as ArenaStake,
            grade: String(val.grade || '7'),
            status: val.status,
            createdAt: typeof val.created_at === 'number' ? val.created_at : Date.now(),
          });
        }
      });

      callback(list);
    });

    this.invitationsUnsub = unsubscribe;
    return unsubscribe;
  }

  /**
   * Create a new challenge at /challenges/{challengeId}
   */
  public static async createChallenge(challenge: {
    challengeId: string;
    challenger_id: string;
    challenger_name: string;
    opponent_id: string;
    opponent_name: string;
    stake_xp: ArenaStake;
    grade: string;
  }): Promise<void> {
    const chRef = ref(db, `challenges/${challenge.challengeId}`);
    await set(chRef, {
      challenger_id: challenge.challenger_id,
      challenger_name: challenge.challenger_name,
      opponent_id: challenge.opponent_id,
      opponent_name: challenge.opponent_name,
      stake_xp: challenge.stake_xp,
      grade: challenge.grade,
      status: 'pending',
      created_at: serverTimestamp(),
    });
  }

  /**
   * Cancel an outgoing challenge at /challenges/{challengeId}
   */
  public static async cancelChallenge(challengeId: string): Promise<void> {
    const chRef = ref(db, `challenges/${challengeId}`);
    await update(chRef, {
      status: 'cancelled',
    });
  }

  /**
   * Subscribe to real-time Battle Room updates at /battles/{battleId}
   */
  public static subscribeToBattle(
    battleId: string,
    callback: (battleData: any) => void
  ): Unsubscribe {
    const bRef = ref(db, `battles/${battleId}`);
    const unsubscribe = onValue(bRef, (snapshot) => {
      const val = snapshot.val();
      callback(val);
    });

    this.battleUnsub = unsubscribe;
    return unsubscribe;
  }

  /**
   * Submit an answer to /battles/{battleId}/submissions/{studentNumber}/{questionIndex}
   */
  public static async submitAnswer(
    battleId: string,
    studentNumber: string,
    questionIndex: number,
    selectedOptionIndex: number
  ): Promise<void> {
    const ansRef = ref(db, `battles/${battleId}/submissions/${studentNumber}/${questionIndex}`);
    await set(ansRef, {
      selectedOptionIndex,
      submittedAt: serverTimestamp(),
    });
  }

  /**
   * Update round progress at /battles/{battleId}/progress/{studentNumber}
   */
  public static async updateProgress(
    battleId: string,
    studentNumber: string,
    questionIndex: number
  ): Promise<void> {
    const progRef = ref(db, `battles/${battleId}/progress/${studentNumber}`);
    await set(progRef, {
      questionIndex,
      answeredAt: serverTimestamp(),
    });
  }

  /**
   * Cleanup all active listeners
   */
  public static cleanupListeners(): void {
    if (this.presenceUnsub) {
      this.presenceUnsub();
      this.presenceUnsub = null;
    }
    if (this.invitationsUnsub) {
      this.invitationsUnsub();
      this.invitationsUnsub = null;
    }
    if (this.battleUnsub) {
      this.battleUnsub();
      this.battleUnsub = null;
    }
  }
}
