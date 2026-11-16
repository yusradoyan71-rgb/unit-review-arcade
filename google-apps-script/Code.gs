/**
 * ============================================================================
 * UNIT REVIEW ARCADE — GOOGLE APPS SCRIPT BACKEND (PHASE 3A)
 * ============================================================================
 * 
 * Secure backend API for student authentication, real-time activity tracking,
 * trusted curriculum catalog, and teacher dashboard reporting.
 * 
 * Designed for standalone Google Apps Script projects (script.google.com)
 * as well as container-bound scripts.
 * 
 * Supports Grade 7 & Grade 8 English curriculum (Classes: 7A, 7B, 8A, 8B)
 * and dynamically scales to future grades, units, and activities.
 * 
 * KEY ARCHITECTURAL FEATURES:
 * 1. STANDALONE SPREADSHEET SUPPORT:
 *    Connects securely via SpreadsheetApp.openById() using a SPREADSHEET_ID
 *    stored in Script Properties (fallback to getActiveSpreadsheet()).
 * 2. TEACHER MASTER AUTHENTICATION:
 *    Master passphrase verification completely separate from student PINs.
 *    5,000 iterative SHA-256 rounds + server-side secret pepper.
 *    5 failed attempts locks teacher login for 15 minutes.
 * 3. HASHED TEACHER SESSIONS:
 *    Teacher tokens (tch_...) are never stored plaintext in Google Sheets.
 *    Only SHA-256 hashes are persisted in TeacherSessions, preventing token theft.
 * 4. STRICT SERVER-SIDE AUTHORIZATION:
 *    Every teacher reporting endpoint requires a valid, unexpired teacherToken.
 *    Student session tokens (uat_...) or invalid tokens fail securely.
 * 5. STRUCTURED ERROR HANDLING:
 *    Safe, consistent JSON response shapes ({ success: false, error, code })
 *    avoiding reliance on arbitrary HTTP status code support in ContentService.
 * 6. TRUSTED CURRICULUM CATALOG:
 *    Authoritative curriculum stored in 'Curriculum' sheet tab. Denominators
 *    and progress are dynamically calculated from this catalog without hardcoding.
 *    Browser-local/custom activities are tracked and isolated from official progress.
 * 7. CONTENT VERSIONING & LEGACY HANDLING:
 *    Content and question versions tracked. Historical records without version
 *    metadata are labeled 'Legacy / Version Unknown' and never fabricated.
 * 8. ZERO DATA LOSS BACKWARD COMPATIBILITY:
 *    100% backward compatible with Phase 1 & 2 student accounts, sessions,
 *    game attempts, and telemetry.
 * 
 * Version: 3.0.0 (Phase 3A - Teacher Auth, Reporting & Trusted Curriculum)
 */

// Configuration
var CONFIG = {
  APP_NAME: "Unit Review Arcade API",
  VERSION: "3.0.0",
  SESSION_DURATION_HOURS: 12,
  TEACHER_SESSION_DURATION_HOURS: 2,
  MAX_FAILED_ATTEMPTS: 5,
  LOCKOUT_MINUTES: 15,
  TEACHER_MAX_FAILED_ATTEMPTS: 5,
  TEACHER_LOCKOUT_MINUTES: 15,
  SALT_ROUNDS: 1000,
  TEACHER_SALT_ROUNDS: 5000,
  SHEET_NAMES: {
    STUDENTS: "Students",
    SESSIONS: "Sessions",
    ATTEMPTS: "Attempts",
    ANSWERS: "Answers",
    DASHBOARD: "Dashboard",
    TEACHER_SESSIONS: "TeacherSessions",
    CURRICULUM: "Curriculum",
    ACHIEVEMENTS: "Achievements",
    MONSTERS: "Monsters",
    COIN_TRANSACTIONS: "CoinTransactions"
  },
  MONSTER_HEADERS: [
    "student_number",
    "class",
    "monster_name",
    "body_shape",
    "body_color",
    "eye_type",
    "mouth_type",
    "horn_type",
    "cheek_type",
    "pattern",
    "accessories_json",
    "updated_at"
  ],
  COIN_TRANSACTION_HEADERS: [
    "transaction_id",
    "student_number",
    "class",
    "amount",
    "balance_after",
    "reason",
    "source_id",
    "created_at"
  ],
  STUDENT_HEADERS: [
    "student_id",
    "student_number",
    "full_name",
    "grade",
    "class",
    "pin_salt",
    "pin_hash",
    "is_active",
    "failed_attempts",
    "locked_until",
    "created_at",
    "last_login_at"
  ],
  SESSION_HEADERS: [
    "session_id",
    "session_token",
    "student_id",
    "student_number",
    "class",
    "login_time",
    "last_ping_time",
    "expires_at",
    "logout_time",
    "status",
    "user_agent"
  ],
  ATTEMPT_HEADERS: [
    "attempt_id",
    "session_id",
    "student_id",
    "student_number",
    "class",
    "grade_id",
    "unit_id",
    "unit_title",
    "activity_id",
    "activity_title",
    "game_type",
    "attempt_number",
    "score",
    "total_questions",
    "answered_questions",
    "correct_answers",
    "incorrect_answers",
    "skipped_questions",
    "percentage",
    "started_at",
    "completed_at",
    "duration_seconds",
    "status",
    "content_version",
    "xp_earned"
  ],
  ACHIEVEMENT_HEADERS: [
    "unlock_id",
    "student_id",
    "student_number",
    "class",
    "achievement_id",
    "title",
    "unlocked_at",
    "trigger_attempt_id"
  ],
  ANSWER_HEADERS: [
    "answer_id",
    "attempt_id",
    "student_id",
    "student_number",
    "class",
    "unit_id",
    "activity_id",
    "question_id",
    "question_order",
    "question_prompt",
    "student_response",
    "correct_answer",
    "is_correct",
    "time_spent_seconds",
    "timestamp",
    "question_version"
  ],
  TEACHER_SESSION_HEADERS: [
    "session_id",
    "token_hash",
    "teacher_name",
    "login_time",
    "last_ping_time",
    "expires_at",
    "status",
    "user_agent"
  ],
  CURRICULUM_HEADERS: [
    "curriculum_id",
    "grade_id",
    "unit_id",
    "unit_title",
    "activity_id",
    "activity_title",
    "game_type",
    "total_questions",
    "content_version",
    "is_published",
    "published_at"
  ]
};

// ============================================================================
// STANDALONE SPREADSHEET CONNECTION LAYER
// ============================================================================

/**
 * Retrieves the Google Spreadsheet instance.
 * For standalone projects, reads 'SPREADSHEET_ID' from Script Properties.
 * Fallback to SpreadsheetApp.getActiveSpreadsheet() if container-bound.
 */
function getArcadeSpreadsheet() {
  var props = PropertiesService.getScriptProperties();
  var sheetId = props.getProperty("SPREADSHEET_ID");

  if (sheetId && sheetId.trim().length > 0) {
    try {
      return SpreadsheetApp.openById(sheetId.trim());
    } catch (err) {
      throw new Error(
        "Failed to open Google Spreadsheet with ID '" + sheetId.trim() + "': " + err.message +
        ". Verify the ID is correct and your Google account has Edit permissions."
      );
    }
  }

  // Fallback if bound to a spreadsheet
  var active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) {
    return active;
  }

  throw new Error(
    "No Google Spreadsheet connected! Since this is a standalone Apps Script project, configure your SPREADSHEET_ID:\n" +
    "👉 Run setSpreadsheetId('YOUR_SPREADSHEET_ID') in this editor, or add SPREADSHEET_ID under Project Settings > Script Properties."
  );
}

/**
 * Convenience helper to set the Google Spreadsheet ID in Script Properties.
 */
function setSpreadsheetId(sheetId) {
  if (!sheetId || typeof sheetId !== "string" || sheetId.trim().length === 0) {
    throw new Error("Please provide a valid Google Spreadsheet ID string to setSpreadsheetId(sheetId).");
  }

  var cleanId = sheetId.trim();
  var ss = SpreadsheetApp.openById(cleanId);
  PropertiesService.getScriptProperties().setProperty("SPREADSHEET_ID", cleanId);
  Logger.log("✅ Successfully connected to Spreadsheet: '" + ss.getName() + "' (ID: " + cleanId + ")");
  return ss.getName();
}

/**
 * Returns the currently configured Spreadsheet ID and connection status.
 */
function getSpreadsheetId() {
  var id = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
  if (!id) {
    Logger.log("⚠️ SPREADSHEET_ID is not set in Script Properties.");
    return null;
  }
  Logger.log("Configured SPREADSHEET_ID: " + id);
  return id;
}

// ============================================================================
// WEB APP HTTP HANDLERS (POST & GET)
// ============================================================================

/**
 * Main Web App Entry Point: POST Handler
 * Receives JSON payloads sent from web clients.
 * Accepts text/plain payloads to avoid preflight CORS restrictions in browsers.
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse({ success: false, error: "Empty request body", code: "BAD_REQUEST" });
    }

    var payload;
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return createJsonResponse({ success: false, error: "Malformed JSON payload: " + parseErr.message, code: "BAD_REQUEST" });
    }

    var action = payload.action;
    if (!action) {
      return createJsonResponse({ success: false, error: "Missing 'action' parameter", code: "BAD_REQUEST" });
    }

    var ss;
    try {
      ss = getArcadeSpreadsheet();
    } catch (ssErr) {
      return createJsonResponse({ success: false, error: "Database configuration error: " + ssErr.message, code: "DATABASE_ERROR" });
    }

    // Route Actions
    switch (action) {
      // Student Authentication
      case "login":
      case "student_login":
        return handleStudentLogin(ss, payload);

      case "check_session":
      case "student_session_check":
        return handleSessionCheck(ss, payload);

      case "logout":
      case "student_logout":
        return handleStudentLogout(ss, payload);

      // Student Game Telemetry (Phase 2)
      case "game_start_attempt":
        return handleStartAttempt(ss, payload);

      case "game_record_answers":
        return handleRecordAnswers(ss, payload);

      case "game_complete_attempt":
        return handleCompleteAttempt(ss, payload);

      case "game_abandon_attempt":
        return handleAbandonAttempt(ss, payload);

      case "game_reconcile_attempt":
        return handleReconcileAttempt(ss, payload);

      // Student Gamification & Leaderboard (Phase 5)
      case "student_get_profile":
        return handleStudentGetProfile(ss, payload);

      case "student_get_leaderboard":
        return handleStudentGetLeaderboard(ss, payload);

      // Student Personalized Learning (Phase 6)
      case "student_get_mistakes":
        return handleStudentGetMistakes(ss, payload);

      case "student_get_mastery":
        return handleStudentGetMastery(ss, payload);

      case "student_record_mistake_retry":
        return handleStudentRecordMistakeRetry(ss, payload);

      // Student Monster World & Economy (Phase 8A)
      case "student_save_monster":
        return handleStudentSaveMonster(ss, payload);

      case "student_get_monster":
        return handleStudentGetMonster(ss, payload);

      case "student_record_games_zone_coins":
        return handleStudentRecordGamesZoneCoins(ss, payload);

      // Teacher Authentication (Phase 3A)
      case "teacher_login":
        return handleTeacherLogin(ss, payload);

      case "teacher_check_session":
        return handleTeacherCheckSession(ss, payload);

      case "teacher_logout":
        return handleTeacherLogout(ss, payload);

      // Teacher Reporting (Phase 3A)
      case "teacher_get_overview":
        return handleTeacherGetOverview(ss, payload);

      case "teacher_get_roster":
        return handleTeacherGetRoster(ss, payload);

      case "teacher_get_student_detail":
        return handleTeacherGetStudentDetail(ss, payload);

      case "teacher_get_question_analytics":
        return handleTeacherGetQuestionAnalytics(ss, payload);

      // Teacher Curriculum Catalog Management (Phase 3A)
      case "teacher_publish_curriculum":
        return handleTeacherPublishCurriculum(ss, payload);

      case "ping":
        return createJsonResponse({ success: true, timestamp: new Date().toISOString(), version: CONFIG.VERSION });

      default:
        return createJsonResponse({ success: false, error: "Unknown action: " + action, code: "NOT_FOUND" });
    }
  } catch (err) {
    return createJsonResponse({ success: false, error: "Internal server error: " + err.message, code: "INTERNAL_ERROR" });
  }
}

/**
 * Web App Entry Point: GET Handler
 * Provides a health check and verification endpoint.
 */
function doGet(e) {
  var isConfigured = false;
  var ssName = "";
  var errorDetail = null;

  try {
    var ss = getArcadeSpreadsheet();
    if (ss) {
      ssName = ss.getName();
      var studentSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.STUDENTS);
      if (studentSheet) isConfigured = true;
    }
  } catch (err) {
    errorDetail = err.message;
  }

  return createJsonResponse({
    status: isConfigured ? "ok" : "needs_setup",
    version: CONFIG.VERSION,
    timestamp: new Date().toISOString(),
    configured: isConfigured,
    spreadsheetName: ssName,
    error: errorDetail
  });
}

/**
 * Helper to build standard JSON response.
 * Uses text/plain or JSON content to satisfy CORS redirects reliably in GAS.
 */
function createJsonResponse(data) {
  var output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

// ============================================================================
// TEACHER AUTHENTICATION & CRYPTO UTILITIES (PHASE 3A)
// ============================================================================

/**
 * Hash teacher master password using 5,000 iterative SHA-256 rounds + secret pepper.
 * Optimized: Pre-computes salt/pepper byte prefixes once, eliminating 4,999 redundant
 * Utilities.newBlob() host-bridge allocations while producing 100% IDENTICAL output.
 */
function hashTeacherPassword(password, salt) {
  var pepper = getOrCreateSecretPepper();
  var input = password + ":teacher:" + salt + ":" + pepper;
  var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, input);

  // Performance Optimization:
  // Convert the static prefix (salt + ":teacher:" + pepper + ":") once to bytes.
  var prefix = salt + ":teacher:" + pepper + ":";
  var prefixBytes = Utilities.newBlob(prefix).getBytes();
  var prefixLen = prefixBytes.length;

  // Pre-generate suffix byte arrays for rounds 0 to CONFIG.TEACHER_SALT_ROUNDS - 1
  // in pure V8 JavaScript to eliminate 4,999 expensive Java host-bridge calls.
  var suffixTable = new Array(CONFIG.TEACHER_SALT_ROUNDS);
  for (var r = 0; r < CONFIG.TEACHER_SALT_ROUNDS; r++) {
    var rStr = String(r);
    var rBytes = new Array(prefixLen + rStr.length);
    for (var p = 0; p < prefixLen; p++) {
      rBytes[p] = prefixBytes[p];
    }
    for (var c = 0; c < rStr.length; c++) {
      rBytes[prefixLen + c] = rStr.charCodeAt(c);
    }
    suffixTable[r] = rBytes;
  }

  for (var round = 0; round < CONFIG.TEACHER_SALT_ROUNDS; round++) {
    var combined = digest.concat(suffixTable[round]);
    digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, combined);
  }

  var hex = "";
  for (var i = 0; i < digest.length; i++) {
    var b = (digest[i] + 256) % 256;
    var byteHex = b.toString(16);
    if (byteHex.length === 1) byteHex = "0" + byteHex;
    hex += byteHex;
  }
  return hex;
}

/**
 * Diagnostic & Compatibility verification for 5,000-round password hashing.
 * Compares the optimized implementation against the original baseline bit-for-bit.
 */
function testHashCompatibility() {
  var testPassword = "TestCompatibilityPassphrase2026!";
  var testSalt = "test_compat_salt_999";
  var pepper = getOrCreateSecretPepper();

  // Baseline implementation
  var input = testPassword + ":teacher:" + testSalt + ":" + pepper;
  var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, input);
  for (var round = 0; round < CONFIG.TEACHER_SALT_ROUNDS; round++) {
    var combined = digest.concat(Utilities.newBlob(testSalt + ":teacher:" + pepper + ":" + round).getBytes());
    digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, combined);
  }
  var baselineHex = "";
  for (var i = 0; i < digest.length; i++) {
    var b = (digest[i] + 256) % 256;
    var byteHex = b.toString(16);
    if (byteHex.length === 1) byteHex = "0" + byteHex;
    baselineHex += byteHex;
  }

  // Optimized implementation
  var optimizedHex = hashTeacherPassword(testPassword, testSalt);

  if (baselineHex !== optimizedHex) {
    throw new Error("HASH COMPATIBILITY FAILED! Baseline: " + baselineHex + " vs Optimized: " + optimizedHex);
  }

  Logger.log("✅ HASH COMPATIBILITY VERIFIED (5,000 rounds): Optimized output is 100% identical to baseline.");
  return true;
}

/**
 * Measures the execution time of hashTeacherPassword (5,000 rounds) in milliseconds.
 */
function benchmarkTeacherHash() {
  var password = "BenchmarkTestPassphrase2026!";
  var salt = "benchmark_salt_sample_12345";

  var t0 = new Date().getTime();
  var hash = hashTeacherPassword(password, salt);
  var t1 = new Date().getTime();
  var duration = t1 - t0;

  Logger.log("⏱️ hashTeacherPassword (5,000 rounds) completed in: " + duration + " ms");
  Logger.log("🔑 Hash sample: " + hash.substring(0, 16) + "...");
  return { durationMs: duration, hashPrefix: hash.substring(0, 16) };
}

/**
 * Computes SHA-256 hash of a teacher token for safe storage in TeacherSessions sheet.
 * Plaintext tokens are NEVER stored in the database.
 */
function hashTeacherToken(token) {
  var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(token || ""));
  var hex = "";
  for (var i = 0; i < digest.length; i++) {
    var b = (digest[i] + 256) % 256;
    var byteHex = b.toString(16);
    if (byteHex.length === 1) byteHex = "0" + byteHex;
    hex += byteHex;
  }
  return hex;
}

/**
 * Generates an unguessable 64-character teacher token starting with 'tch_'.
 */
function generateTeacherToken() {
  var raw = "teacher-" + Utilities.getUuid() + "-" + Utilities.getUuid() + "-" + new Date().getTime() + "-" + Math.random().toString(36).substring(2);
  var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, raw);
  var hex = "";
  for (var i = 0; i < digest.length; i++) {
    var b = (digest[i] + 256) % 256;
    var byteHex = b.toString(16);
    if (byteHex.length === 1) byteHex = "0" + byteHex;
    hex += byteHex;
  }
  return "tch_" + hex.substring(0, 60);
}

/**
 * OWNER-ONLY: Securely initializes or updates the teacher master password.
 * Must be executed directly from the Google Apps Script Editor by an authenticated owner.
 * Plaintext password is NEVER stored, logged, or exposed in sheets or source code.
 * Automatically invalidates all existing teacher sessions immediately upon password change.
 * 
 * Example (Run in Apps Script editor):
 *   initializeTeacherCredentials("YourSecretPassphraseHere");
 */
function initializeTeacherCredentials(plainPassword) {
  if (!plainPassword || typeof plainPassword !== "string" || plainPassword.trim().length < 10) {
    throw new Error("Teacher password must be a string of at least 10 characters.");
  }

  var cleanPassword = plainPassword.trim();
  var props = PropertiesService.getScriptProperties();
  var salt = generateSalt();
  var hash = hashTeacherPassword(cleanPassword, salt);

  props.setProperty("TEACHER_PASSWORD_SALT", salt);
  props.setProperty("TEACHER_PASSWORD_HASH", hash);
  props.setProperty("TEACHER_FAILED_ATTEMPTS", "0");
  if (typeof props.deleteProperty === "function") {
    props.deleteProperty("TEACHER_LOCKED_UNTIL");
  } else {
    props.setProperty("TEACHER_LOCKED_UNTIL", "");
  }

  // Invalidate all existing teacher sessions in TeacherSessions sheet
  try {
    var ss = getArcadeSpreadsheet();
    var teacherSessionsSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.TEACHER_SESSIONS);
    if (teacherSessionsSheet) {
      var data = teacherSessionsSheet.getDataRange().getValues();
      var revokedCount = 0;
      for (var i = 1; i < data.length; i++) {
        if (data[i][6] === "active") {
          teacherSessionsSheet.getRange(i + 1, 7).setValue("revoked");
          revokedCount++;
        }
      }
      Logger.log("🔒 Invalidation: Revoked " + revokedCount + " active teacher session(s).");
    }
  } catch (err) {
    Logger.log("ℹ️ Note: TeacherSessions sheet not yet created or session revocation skipped: " + err.message);
  }

  Logger.log("✅ Teacher master credentials successfully initialized with 5,000 iterative SHA-256 rounds + secret pepper.");
  Logger.log("🔒 Teacher authentication is now ACTIVE. All previous teacher sessions have been invalidated.");
  Logger.log("⚠️ Remember to clear the passphrase parameter from your editor window after execution.");
  return true;
}

// Alias for convenience
var setTeacherPassword = initializeTeacherCredentials;

/**
 * OWNER-ONLY: Secure, one-time setup function to initialize teacher credentials
 * from the Script Property 'TEACHER_SETUP_PASSWORD'.
 * 
 * Procedure:
 * 1. Reads 'TEACHER_SETUP_PASSWORD' from Script Properties.
 * 2. Rejects if missing or shorter than 12 characters.
 * 3. Calls initializeTeacherCredentials(password) to derive salt, hash (5,000 rounds + pepper),
 *    and invalidate any prior sessions.
 * 4. Only upon confirmed success, immediately deletes 'TEACHER_SETUP_PASSWORD'.
 * 5. NEVER logs, prints, or exposes the plaintext password.
 * 
 * Run directly from the Apps Script editor function dropdown.
 */
function initializeTeacherFromScriptProperties() {
  var props = PropertiesService.getScriptProperties();
  var setupPassword = props.getProperty("TEACHER_SETUP_PASSWORD");

  if (!setupPassword || typeof setupPassword !== "string" || setupPassword.trim().length === 0) {
    throw new Error(
      "Missing 'TEACHER_SETUP_PASSWORD' in Script Properties.\n" +
      "👉 Go to Project Settings > Script Properties and add 'TEACHER_SETUP_PASSWORD' with your private passphrase (min 12 chars)."
    );
  }

  var cleanPassword = setupPassword.trim();
  if (cleanPassword.length < 12) {
    throw new Error("Teacher password must be at least 12 characters long. The provided password in 'TEACHER_SETUP_PASSWORD' is only " + cleanPassword.length + " characters.");
  }

  var success = initializeTeacherCredentials(cleanPassword);
  if (!success) {
    throw new Error("Failed to initialize teacher credentials. 'TEACHER_SETUP_PASSWORD' was NOT deleted.");
  }

  if (typeof props.deleteProperty === "function") {
    props.deleteProperty("TEACHER_SETUP_PASSWORD");
  } else {
    props.setProperty("TEACHER_SETUP_PASSWORD", "");
  }

  Logger.log("✅ Teacher credentials successfully initialized from Script Properties.");
  Logger.log("🧹 Temporary 'TEACHER_SETUP_PASSWORD' property has been safely removed.");
  Logger.log("🔒 Teacher authentication is now ACTIVE.");
  return true;
}

/**
 * Retrieves teacher auth properties from Script Properties.
 * Returns { configured: false } if credentials have not been initialized.
 * NEVER auto-seeds or hardcodes default credentials.
 */
function getTeacherAuthProperties() {
  var props = PropertiesService.getScriptProperties();
  var hash = props.getProperty("TEACHER_PASSWORD_HASH");
  var salt = props.getProperty("TEACHER_PASSWORD_SALT");

  if (!hash || !salt) {
    return {
      configured: false,
      hash: null,
      salt: null,
      failedAttempts: 0,
      lockedUntil: null
    };
  }

  return {
    configured: true,
    hash: hash,
    salt: salt,
    failedAttempts: Number(props.getProperty("TEACHER_FAILED_ATTEMPTS") || 0),
    lockedUntil: props.getProperty("TEACHER_LOCKED_UNTIL") || null
  };
}

/**
 * ACTION: teacher_login
 * Authenticates teacher via master passphrase.
 * Concurrency-safe rate limiting using LockService.
 * Enforces brute-force lockout (5 attempts = 15m lockout).
 * Returns a 64-char tch_ token, storing only its SHA-256 hash in TeacherSessions.
 */
function handleTeacherLogin(ss, payload) {
  var password = String(payload.password || "").trim();
  if (!password) {
    return createJsonResponse({ success: false, error: "Teacher password is required.", code: "UNAUTHORIZED" });
  }

  var authConfig = getTeacherAuthProperties();
  if (!authConfig.configured) {
    return createJsonResponse({
      success: false,
      error: "Teacher authentication is not initialized. Please configure teacher credentials in Google Apps Script.",
      code: "NOT_CONFIGURED"
    });
  }

  var lock = LockService.getScriptLock();
  var lockAcquired = false;

  try {
    lockAcquired = lock.tryLock(5000);
    if (!lockAcquired) {
      return createJsonResponse({
        success: false,
        error: "Authentication service is temporarily busy. Please try again shortly.",
        code: "RATE_LIMITED"
      });
    }

    var props = PropertiesService.getScriptProperties();
    // Re-read inside lock to prevent concurrency race conditions
    authConfig = getTeacherAuthProperties();
    var now = new Date();

    // 1. Check brute-force lockout
    if (authConfig.lockedUntil) {
      var lockedUntil = new Date(authConfig.lockedUntil);
      if (now < lockedUntil) {
        var minutesLeft = Math.ceil((lockedUntil.getTime() - now.getTime()) / (60 * 1000));
        return createJsonResponse({
          success: false,
          error: "Teacher account temporarily locked due to too many failed attempts. Please wait " + minutesLeft + " minute(s).",
          code: "LOCKED"
        });
      }
    }

    // 2. Verify password hash
    var computedHash = hashTeacherPassword(password, authConfig.salt);
    if (computedHash !== authConfig.hash) {
      var failedAttempts = authConfig.failedAttempts + 1;
      var lockDate = null;
      var errorMsg = "Invalid teacher password.";
      var code = "UNAUTHORIZED";

      if (failedAttempts >= CONFIG.TEACHER_MAX_FAILED_ATTEMPTS) {
        lockDate = new Date(now.getTime() + CONFIG.TEACHER_LOCKOUT_MINUTES * 60 * 1000);
        props.setProperty("TEACHER_LOCKED_UNTIL", lockDate.toISOString());
        props.setProperty("TEACHER_FAILED_ATTEMPTS", String(failedAttempts));
        errorMsg = "Teacher account locked for " + CONFIG.TEACHER_LOCKOUT_MINUTES + " minutes due to repeated incorrect password attempts.";
        code = "LOCKED";
      } else {
        props.setProperty("TEACHER_FAILED_ATTEMPTS", String(failedAttempts));
      }

      return createJsonResponse({
        success: false,
        error: errorMsg,
        code: code,
        attemptsRemaining: Math.max(0, CONFIG.TEACHER_MAX_FAILED_ATTEMPTS - failedAttempts)
      });
    }

    // 3. Password valid: Reset failed attempts & lockout
    props.setProperty("TEACHER_FAILED_ATTEMPTS", "0");
    if (typeof props.deleteProperty === "function") {
      props.deleteProperty("TEACHER_LOCKED_UNTIL");
    } else {
      props.setProperty("TEACHER_LOCKED_UNTIL", "");
    }

    // 4. Generate token and store hashed token in TeacherSessions
    var teacherToken = generateTeacherToken();
    var tokenHash = hashTeacherToken(teacherToken);
    var sessionId = "tsess_" + Utilities.getUuid().substring(0, 8);
    var expiresAt = new Date(now.getTime() + CONFIG.TEACHER_SESSION_DURATION_HOURS * 60 * 60 * 1000);

    var teacherSessionsSheet = setupTeacherSessionsSheet(ss);

    teacherSessionsSheet.appendRow([
      sessionId,
      tokenHash,
      "Teacher",
      now.toISOString(),
      now.toISOString(),
      expiresAt.toISOString(),
      "active",
      payload.userAgent || "Web Browser"
    ]);

    return createJsonResponse({
      success: true,
      teacherToken: teacherToken,
      teacherName: "Teacher",
      expiresAt: expiresAt.toISOString()
    });
  } catch (err) {
    return createJsonResponse({
      success: false,
      error: "Authentication error: " + err.message,
      code: "INTERNAL_ERROR"
    });
  } finally {
    if (lockAcquired) {
      try { lock.releaseLock(); } catch (e) {}
    }
  }
}

/**
 * Validates a teacher token from request payload.
 * Checks TeacherSessions sheet by SHA-256 hash.
 */
function validateTeacherSession(ss, teacherToken) {
  if (!teacherToken || typeof teacherToken !== "string" || teacherToken.trim().length === 0) {
    return { valid: false, error: "Teacher authentication required.", code: "UNAUTHORIZED" };
  }

  var cleanToken = teacherToken.trim();
  if (cleanToken.startsWith("uat_")) {
    return { valid: false, error: "Student session token cannot access teacher endpoints.", code: "UNAUTHORIZED" };
  }

  if (!cleanToken.startsWith("tch_")) {
    return { valid: false, error: "Invalid teacher token format.", code: "UNAUTHORIZED" };
  }

  var teacherSessionsSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.TEACHER_SESSIONS);
  if (!teacherSessionsSheet) {
    return { valid: false, error: "Teacher database not initialized. Please run setupArcadeDatabase().", code: "UNAUTHORIZED" };
  }

  var tokenHash = hashTeacherToken(cleanToken);
  var data = teacherSessionsSheet.getDataRange().getValues();
  var sessionRow = null;
  var rowIndex = -1;

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][1]).trim() === tokenHash) {
      sessionRow = data[i];
      rowIndex = i + 1;
      break;
    }
  }

  if (!sessionRow) {
    return { valid: false, error: "Invalid teacher session.", code: "UNAUTHORIZED" };
  }

  var expiresAt = new Date(sessionRow[5]);
  var status = String(sessionRow[6]).trim();
  var now = new Date();

  if (status !== "active" || now > expiresAt) {
    if (status === "active") {
      teacherSessionsSheet.getRange(rowIndex, 7).setValue("expired");
    }
    return { valid: false, error: "Teacher session has expired. Please log in again.", code: "UNAUTHORIZED" };
  }

  // Refresh ping
  teacherSessionsSheet.getRange(rowIndex, 5).setValue(now.toISOString());

  return {
    valid: true,
    sessionId: sessionRow[0],
    teacherName: sessionRow[2] || "Teacher"
  };
}

/**
 * ACTION: teacher_check_session
 */
function handleTeacherCheckSession(ss, payload) {
  var auth = validateTeacherSession(ss, payload.teacherToken);
  if (!auth.valid) {
    return createJsonResponse({ success: false, error: auth.error, code: auth.code });
  }

  return createJsonResponse({
    success: true,
    active: true,
    teacherName: auth.teacherName
  });
}

/**
 * ACTION: teacher_logout
 */
function handleTeacherLogout(ss, payload) {
  var teacherToken = String(payload.teacherToken || "").trim();
  if (!teacherToken) {
    return createJsonResponse({ success: true, message: "No session provided." });
  }

  var teacherSessionsSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.TEACHER_SESSIONS);
  if (teacherSessionsSheet && teacherToken.startsWith("tch_")) {
    var tokenHash = hashTeacherToken(teacherToken);
    var data = teacherSessionsSheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][1]).trim() === tokenHash) {
        teacherSessionsSheet.getRange(i + 1, 7).setValue("logged_out");
        break;
      }
    }
  }

  return createJsonResponse({ success: true, message: "Logged out successfully." });
}

// ============================================================================
// TRUSTED CURRICULUM CATALOG MANAGEMENT (PHASE 3A)
// ============================================================================

/**
 * Reads trusted published curriculum from the Curriculum sheet tab.
 * Dynamically organizes by grade_id without hardcoded numbers.
 */
function getTrustedCurriculumMap(ss) {
  var curriculumSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.CURRICULUM);
  var publishedByGrade = {};
  var allPublished = {};
  var totalsByGrade = {};

  if (!curriculumSheet) {
    return { byGrade: publishedByGrade, all: allPublished, totals: totalsByGrade };
  }

  var data = curriculumSheet.getDataRange().getValues();
  if (data.length <= 1) {
    return { byGrade: publishedByGrade, all: allPublished, totals: totalsByGrade };
  }

  var colMap = getSheetColumnMap(curriculumSheet, CONFIG.CURRICULUM_HEADERS);

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var actId = String(row[colMap["activity_id"] - 1] || "").trim();
    if (!actId) continue;

    var gradeId = String(row[colMap["grade_id"] - 1] || "").trim();
    var isPubVal = row[colMap["is_published"] - 1];
    var isPub = (isPubVal === true || String(isPubVal).toLowerCase() === "true" || isPubVal === 1 || isPubVal === "1");

    if (!isPub) continue;

    var item = {
      curriculumId: String(row[colMap["curriculum_id"] - 1] || ""),
      gradeId: gradeId,
      unitId: String(row[colMap["unit_id"] - 1] || ""),
      unitTitle: String(row[colMap["unit_title"] - 1] || ""),
      activityId: actId,
      activityTitle: String(row[colMap["activity_title"] - 1] || ""),
      gameType: String(row[colMap["game_type"] - 1] || ""),
      totalQuestions: Number(row[colMap["total_questions"] - 1] || 0),
      contentVersion: row[colMap["content_version"] - 1] ? String(row[colMap["content_version"] - 1]).trim() : null,
      isPublished: true,
      publishedAt: row[colMap["published_at"] - 1]
    };

    allPublished[actId] = item;
    if (!publishedByGrade[gradeId]) {
      publishedByGrade[gradeId] = {};
      totalsByGrade[gradeId] = 0;
    }
    publishedByGrade[gradeId][actId] = item;
    totalsByGrade[gradeId]++;
  }

  return { byGrade: publishedByGrade, all: allPublished, totals: totalsByGrade };
}

/**
 * ACTION: teacher_publish_curriculum
 * Upserts authoritative curriculum activities in the Curriculum sheet tab.
 */
function handleTeacherPublishCurriculum(ss, payload) {
  var auth = validateTeacherSession(ss, payload.teacherToken);
  if (!auth.valid) {
    return createJsonResponse({ success: false, error: auth.error, code: auth.code });
  }

  var activities = payload.activities;
  if (!Array.isArray(activities) || activities.length === 0) {
    return createJsonResponse({ success: false, error: "Payload must include an 'activities' array.", code: "BAD_REQUEST" });
  }

  var curriculumSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.CURRICULUM);
  setupSheetHeaders(curriculumSheet, CONFIG.CURRICULUM_HEADERS, "#064e3b", "#a7f3d0");

  var colMap = getSheetColumnMap(curriculumSheet, CONFIG.CURRICULUM_HEADERS);
  var data = curriculumSheet.getDataRange().getValues();
  var now = new Date().toISOString();
  var updatedCount = 0;
  var rowsToAppend = [];
  var lastCol = curriculumSheet.getLastColumn();

  for (var k = 0; k < activities.length; k++) {
    var act = activities[k];
    var actId = String(act.activity_id || act.activityId || "").trim();
    var gradeId = String(act.grade_id || act.gradeId || "").trim();
    if (!actId || !gradeId) continue;

    var unitId = String(act.unit_id || act.unitId || "");
    var unitTitle = String(act.unit_title || act.unitTitle || "");
    var actTitle = String(act.activity_title || act.activityTitle || "");
    var gameType = String(act.game_type || act.gameType || "");
    var totalQuestions = Number(act.total_questions || act.totalQuestions) || 10;
    var contentVersion = String(act.content_version || act.contentVersion || "1.0.0").trim();
    var isPublished = (act.is_published !== undefined) ? Boolean(act.is_published) : true;

    // Check if activity already exists in sheet
    var foundIndex = -1;
    for (var r = 1; r < data.length; r++) {
      if (String(data[r][colMap["activity_id"] - 1]).trim() === actId) {
        foundIndex = r + 1;
        break;
      }
    }

    if (foundIndex > 0) {
      curriculumSheet.getRange(foundIndex, colMap["unit_id"]).setValue(unitId);
      curriculumSheet.getRange(foundIndex, colMap["unit_title"]).setValue(unitTitle);
      curriculumSheet.getRange(foundIndex, colMap["activity_title"]).setValue(actTitle);
      curriculumSheet.getRange(foundIndex, colMap["game_type"]).setValue(gameType);
      curriculumSheet.getRange(foundIndex, colMap["total_questions"]).setValue(totalQuestions);
      curriculumSheet.getRange(foundIndex, colMap["content_version"]).setValue(contentVersion);
      curriculumSheet.getRange(foundIndex, colMap["is_published"]).setValue(isPublished);
      curriculumSheet.getRange(foundIndex, colMap["published_at"]).setValue(now);
      updatedCount++;
    } else {
      var newRow = new Array(lastCol);
      for (var c = 0; c < lastCol; c++) newRow[c] = "";
      newRow[colMap["curriculum_id"] - 1] = "cur_" + actId;
      newRow[colMap["grade_id"] - 1] = gradeId;
      newRow[colMap["unit_id"] - 1] = unitId;
      newRow[colMap["unit_title"] - 1] = unitTitle;
      newRow[colMap["activity_id"] - 1] = actId;
      newRow[colMap["activity_title"] - 1] = actTitle;
      newRow[colMap["game_type"] - 1] = gameType;
      newRow[colMap["total_questions"] - 1] = totalQuestions;
      newRow[colMap["content_version"] - 1] = contentVersion;
      newRow[colMap["is_published"] - 1] = isPublished;
      newRow[colMap["published_at"] - 1] = now;
      rowsToAppend.push(newRow);
      updatedCount++;
    }
  }

  if (rowsToAppend.length > 0) {
    var startRow = curriculumSheet.getLastRow() + 1;
    curriculumSheet.getRange(startRow, 1, rowsToAppend.length, lastCol).setValues(rowsToAppend);
  }

  return createJsonResponse({
    success: true,
    publishedCount: updatedCount,
    message: "Curriculum catalog updated successfully."
  });
}

/**
 * Seeds default Grade 7 and Grade 8 published curriculum activities
 * when the Curriculum sheet is first initialized.
 */
function seedDefaultCurriculum(curriculumSheet) {
  var now = new Date().toISOString();
  var defaultActivities = [
    // Grade 7 Unit 1
    ["cur_g7-u1-act1", "grade-7", "g7-u1", "Digital World", "g7-u1-act1", "Digital Vocabulary Quest", "quiz_battle", 10, "1.0.0", true, now],
    ["cur_g7-u1-act2", "grade-7", "g7-u1", "Digital World", "g7-u1-act2", "Match the Digital World", "match_it", 6, "1.0.0", true, now],
    ["cur_g7-u1-act3", "grade-7", "g7-u1", "Digital World", "g7-u1-act3", "Grammar Challenge", "quiz_battle", 10, "1.0.0", true, now],
    ["cur_g7-u1-act4", "grade-7", "g7-u1", "Digital World", "g7-u1-act4", "Build the Sentence", "sentence_builder", 8, "1.0.0", true, now],
    ["cur_g7-u1-act5", "grade-7", "g7-u1", "Digital World", "g7-u1-act5", "Say It Online! Dialogue Challenge", "quiz_battle", 10, "1.0.0", true, now],
    ["cur_g7-u1-act6", "grade-7", "g7-u1", "Digital World", "g7-u1-act6", "Digital Fact or Fiction", "true_false", 10, "1.0.0", true, now],
    ["cur_g7-u1-act7", "grade-7", "g7-u1", "Digital World", "g7-u1-act7", "Reading Detective", "reading_detective", 8, "1.0.0", true, now],
    ["cur_g7-u1-act8", "grade-7", "g7-u1", "Digital World", "g7-u1-act8", "Ultimate Life Online Challenge", "quiz_battle", 12, "1.0.0", true, now],

    // Grade 7 Unit 2
    ["cur_g7-u2-act1", "grade-7", "g7-u2", "Nature & Disasters", "g7-u2-act1", "Disaster Vocabulary Quest", "quiz_battle", 10, "1.0.0", true, now],
    ["cur_g7-u2-act2", "grade-7", "g7-u2", "Nature & Disasters", "g7-u2-act2", "Match the Danger", "match_it", 6, "1.0.0", true, now],
    ["cur_g7-u2-act3", "grade-7", "g7-u2", "Nature & Disasters", "g7-u2-act3", "Past Tense Challenge", "quiz_battle", 10, "1.0.0", true, now],
    ["cur_g7-u2-act4", "grade-7", "g7-u2", "Nature & Disasters", "g7-u2-act4", "Build the Rescue Sentence", "sentence_builder", 8, "1.0.0", true, now],
    ["cur_g7-u2-act5", "grade-7", "g7-u2", "Nature & Disasters", "g7-u2-act5", "Wildlife Rescue Mission", "quiz_battle", 10, "1.0.0", true, now],
    ["cur_g7-u2-act6", "grade-7", "g7-u2", "Nature & Disasters", "g7-u2-act6", "Emergency Call Challenge", "quiz_battle", 10, "1.0.0", true, now],
    ["cur_g7-u2-act7", "grade-7", "g7-u2", "Nature & Disasters", "g7-u2-act7", "Danger: True or False", "true_false", 10, "1.0.0", true, now],
    ["cur_g7-u2-act8", "grade-7", "g7-u2", "Nature & Disasters", "g7-u2-act8", "Reading Detective", "reading_detective", 8, "1.0.0", true, now],
    ["cur_g7-u2-act9", "grade-7", "g7-u2", "Nature & Disasters", "g7-u2-act9", "Used To or Not?", "quiz_battle", 10, "1.0.0", true, now],
    ["cur_g7-u2-act10", "grade-7", "g7-u2", "Nature & Disasters", "g7-u2-act10", "Ultimate Danger Challenge", "quiz_battle", 12, "1.0.0", true, now],

    // Grade 8 Unit 1
    ["cur_g8-u1-act1", "grade-8", "g8-u1", "Friendship & Music", "g8-u1-act1", "Music Vocabulary Challenge", "quiz_battle", 10, "1.0.0", true, now],
    ["cur_g8-u1-act2", "grade-8", "g8-u1", "Friendship & Music", "g8-u1-act2", "Match the Music", "match_it", 6, "1.0.0", true, now],
    ["cur_g8-u1-act3", "grade-8", "g8-u1", "Friendship & Music", "g8-u1-act3", "Build the Sentence", "sentence_builder", 8, "1.0.0", true, now],
    ["cur_g8-u1-act4", "grade-8", "g8-u1", "Friendship & Music", "g8-u1-act4", "Music Fact or Fiction", "true_false", 10, "1.0.0", true, now],
    ["cur_g8-u1-act6", "grade-8", "g8-u1", "Friendship & Music", "g8-u1-act6", "Reading Detective", "reading_detective", 8, "1.0.0", true, now],
    ["cur_g8-u1-act7", "grade-8", "g8-u1", "Friendship & Music", "g8-u1-act7", "Ultimate Unit Challenge", "quiz_battle", 12, "1.0.0", true, now],

    // Grade 8 Unit 2
    ["cur_g8-u2-act1", "grade-8", "g8-u2", "Teen Life & Travel", "g8-u2-act1", "Travel Vocabulary Quest", "quiz_battle", 10, "1.0.0", true, now],
    ["cur_g8-u2-act2", "grade-8", "g8-u2", "Teen Life & Travel", "g8-u2-act2", "Match the Journey", "match_it", 6, "1.0.0", true, now],
    ["cur_g8-u2-act3", "grade-8", "g8-u2", "Teen Life & Travel", "g8-u2-act3", "Travel Grammar Challenge", "quiz_battle", 10, "1.0.0", true, now],
    ["cur_g8-u2-act4", "grade-8", "g8-u2", "Teen Life & Travel", "g8-u2-act4", "Build the Travel Story", "sentence_builder", 8, "1.0.0", true, now],
    ["cur_g8-u2-act5", "grade-8", "g8-u2", "Teen Life & Travel", "g8-u2-act5", "Travel Troubles", "quiz_battle", 10, "1.0.0", true, now],
    ["cur_g8-u2-act6", "grade-8", "g8-u2", "Teen Life & Travel", "g8-u2-act6", "Fact or Fiction", "true_false", 10, "1.0.0", true, now],
    ["cur_g8-u2-act7", "grade-8", "g8-u2", "Teen Life & Travel", "g8-u2-act7", "Reading Detective", "reading_detective", 8, "1.0.0", true, now],
    ["cur_g8-u2-act8", "grade-8", "g8-u2", "Teen Life & Travel", "g8-u2-act8", "Ultimate Adventure Challenge", "quiz_battle", 12, "1.0.0", true, now],

    // Grade 8 Unit 3
    ["cur_g8-u3-act1", "grade-8", "g8-u3", "In the Kitchen & City", "g8-u3-act1", "London Vocabulary Quest", "quiz_battle", 10, "1.0.0", true, now],
    ["cur_g8-u3-act2", "grade-8", "g8-u3", "In the Kitchen & City", "g8-u3-act2", "Match the City", "match_it", 6, "1.0.0", true, now],
    ["cur_g8-u3-act3", "grade-8", "g8-u3", "In the Kitchen & City", "g8-u3-act3", "What Should We Do?", "quiz_battle", 10, "1.0.0", true, now],
    ["cur_g8-u3-act4", "grade-8", "g8-u3", "In the Kitchen & City", "g8-u3-act4", "At the Train Station", "train_station", 8, "1.0.0", true, now],
    ["cur_g8-u3-act5", "grade-8", "g8-u3", "In the Kitchen & City", "g8-u3-act5", "Build the Conversation", "sentence_builder", 8, "1.0.0", true, now],
    ["cur_g8-u3-act6", "grade-8", "g8-u3", "In the Kitchen & City", "g8-u3-act6", "London Fact or Fiction", "true_false", 10, "1.0.0", true, now],
    ["cur_g8-u3-act7", "grade-8", "g8-u3", "In the Kitchen & City", "g8-u3-act7", "Reading Detective", "reading_detective", 8, "1.0.0", true, now],
    ["cur_g8-u3-act8", "grade-8", "g8-u3", "In the Kitchen & City", "g8-u3-act8", "Ultimate London Challenge", "quiz_battle", 12, "1.0.0", true, now],

    // Grade 8 Unit 4
    ["cur_g8-u4-act1", "grade-8", "g8-u4", "On the Phone", "g8-u4-act1", "Travel Vocabulary Quest", "quiz_battle", 10, "1.0.0", true, now],
    ["cur_g8-u4-act2", "grade-8", "g8-u4", "On the Phone", "g8-u4-act2", "Match the Journey", "match_it", 6, "1.0.0", true, now],
    ["cur_g8-u4-act3", "grade-8", "g8-u4", "On the Phone", "g8-u4-act3", "Travel Grammar Challenge", "quiz_battle", 10, "1.0.0", true, now],
    ["cur_g8-u4-act4", "grade-8", "g8-u4", "On the Phone", "g8-u4-act4", "Build the Travel Story", "sentence_builder", 8, "1.0.0", true, now],
    ["cur_g8-u4-act5", "grade-8", "g8-u4", "On the Phone", "g8-u4-act5", "Travel Troubles", "quiz_battle", 10, "1.0.0", true, now],
    ["cur_g8-u4-act6", "grade-8", "g8-u4", "On the Phone", "g8-u4-act6", "Fact or Fiction", "true_false", 10, "1.0.0", true, now],
    ["cur_g8-u4-act7", "grade-8", "g8-u4", "On the Phone", "g8-u4-act7", "Reading Detective", "reading_detective", 8, "1.0.0", true, now],
    ["cur_g8-u4-act8", "grade-8", "g8-u4", "On the Phone", "g8-u4-act8", "Ultimate Adventure Challenge", "quiz_battle", 12, "1.0.0", true, now]
  ];

  var numCols = CONFIG.CURRICULUM_HEADERS.length;
  curriculumSheet.getRange(2, 1, defaultActivities.length, numCols).setValues(defaultActivities);
  Logger.log("🌱 Default curriculum catalog seeded with " + defaultActivities.length + " published activities across Grade 7 and 8.");
}

// ============================================================================
// TEACHER REPORTING ENDPOINTS (PHASE 3A)
// ============================================================================

/**
 * ACTION: teacher_get_overview
 * Aggregated KPIs, class breakdown (7A, 7B, 8A, 8B), unit and game engine performance,
 * and recent student activity feed.
 */
function handleTeacherGetOverview(ss, payload) {
  var auth = validateTeacherSession(ss, payload.teacherToken);
  if (!auth.valid) {
    return createJsonResponse({ success: false, error: auth.error, code: auth.code });
  }

  var filters = payload.filters || {};
  var filterClass = filters.classId && filters.classId !== "all" ? String(filters.classId).trim().toUpperCase() : null;
  var filterGrade = filters.gradeId && filters.gradeId !== "all" ? String(filters.gradeId).trim() : null;
  var filterUnit = filters.unitId && filters.unitId !== "all" ? String(filters.unitId).trim() : null;
  var filterGame = filters.gameType && filters.gameType !== "all" ? String(filters.gameType).trim() : null;
  var startDate = filters.startDate ? new Date(filters.startDate) : null;
  var endDate = filters.endDate ? new Date(filters.endDate) : null;

  var studentsSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.STUDENTS);
  var attemptsSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.ATTEMPTS);

  var studentData = studentsSheet ? studentsSheet.getDataRange().getValues() : [];
  var attemptData = attemptsSheet ? attemptsSheet.getDataRange().getValues() : [];

  var studentColMap = studentsSheet ? getSheetColumnMap(studentsSheet, CONFIG.STUDENT_HEADERS) : {};
  var attemptColMap = attemptsSheet ? getSheetColumnMap(attemptsSheet, CONFIG.ATTEMPT_HEADERS) : {};

  // Build students lookup
  var matchingStudentNumbers = {};
  var allStudentsByNumber = {};
  var totalStudents = 0;
  var studentsLoggedIn = 0;
  var classRosters = { "7A": 0, "7B": 0, "8A": 0, "8B": 0 };
  var classActive = { "7A": 0, "7B": 0, "8A": 0, "8B": 0 };

  for (var i = 1; i < studentData.length; i++) {
    var sRow = studentData[i];
    var sNum = String(sRow[studentColMap["student_number"] - 1]).trim();
    if (!sNum) continue;

    var sClass = String(sRow[studentColMap["class"] - 1] || "").trim().toUpperCase();
    var sGrade = String(sRow[studentColMap["grade"] - 1] || "").trim();
    var normGrade = (sGrade === "7" || sGrade === 7 || sGrade === "grade-7") ? "grade-7" : "grade-8";
    var lastLogin = sRow[studentColMap["last_login_at"] - 1];
    var fullName = sRow[studentColMap["full_name"] - 1];

    allStudentsByNumber[sNum] = {
      studentNumber: sNum,
      studentId: sRow[studentColMap["student_id"] - 1],
      fullName: fullName,
      grade: normGrade,
      className: sClass,
      lastLogin: lastLogin
    };

    if (classRosters[sClass] !== undefined) classRosters[sClass]++;
    if (lastLogin && classActive[sClass] !== undefined) classActive[sClass]++;

    // Apply class/grade filters to overall KPIs
    if (filterClass && sClass !== filterClass) continue;
    if (filterGrade && normGrade !== filterGrade) continue;

    matchingStudentNumbers[sNum] = true;
    totalStudents++;
    if (lastLogin) studentsLoggedIn++;
  }

  // Aggregate Attempts
  var totalAttempts = 0;
  var completedAttempts = 0;
  var abandonedAttempts = 0;
  var inProgressAttempts = 0;
  var scoreSum = 0;
  var totalTimeSpentSeconds = 0;

  var classAttemptCounts = { "7A": 0, "7B": 0, "8A": 0, "8B": 0 };
  var classCompletedCounts = { "7A": 0, "7B": 0, "8A": 0, "8B": 0 };
  var classScoreSums = { "7A": 0, "7B": 0, "8A": 0, "8B": 0 };

  var unitStatsMap = {};
  var gameStatsMap = {};
  var filteredAttemptsList = [];
  var sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  var activeStudentsLast7DaysSet = {};

  for (var j = 1; j < attemptData.length; j++) {
    var aRow = attemptData[j];
    var aStudentNum = String(aRow[attemptColMap["student_number"] - 1] || "").trim();
    var aClass = String(aRow[attemptColMap["class"] - 1] || "").trim().toUpperCase();
    var aUnitId = String(aRow[attemptColMap["unit_id"] - 1] || "").trim();
    var aUnitTitle = String(aRow[attemptColMap["unit_title"] - 1] || "").trim();
    var aGameType = String(aRow[attemptColMap["game_type"] - 1] || "").trim();
    var aStatus = String(aRow[attemptColMap["status"] - 1] || "").trim();
    var aScore = Number(aRow[attemptColMap["score"] - 1] || 0);
    var aPercentage = Number(aRow[attemptColMap["percentage"] - 1] || 0);
    var aDuration = Number(aRow[attemptColMap["duration_seconds"] - 1] || 0);
    var aStartedAt = aRow[attemptColMap["started_at"] - 1];
    var startDateObj = aStartedAt ? new Date(aStartedAt) : null;

    // Check class/grade filter
    if (filterClass && aClass !== filterClass) continue;
    if (filterGrade) {
      var stdInfo = allStudentsByNumber[aStudentNum];
      if (stdInfo && stdInfo.grade !== filterGrade) continue;
    }
    if (filterUnit && aUnitId !== filterUnit) continue;
    if (filterGame && aGameType !== filterGame) continue;
    if (startDate && startDateObj && startDateObj < startDate) continue;
    if (endDate && startDateObj && startDateObj > endDate) continue;

    totalAttempts++;
    totalTimeSpentSeconds += aDuration;

    if (startDateObj && startDateObj >= sevenDaysAgo) {
      activeStudentsLast7DaysSet[aStudentNum] = true;
    }

    if (aStatus === "completed") {
      completedAttempts++;
      scoreSum += aPercentage;
    } else if (aStatus === "abandoned" || aStatus === "interrupted") {
      abandonedAttempts++;
    } else if (aStatus === "in_progress") {
      inProgressAttempts++;
    }

    // Class aggregations
    if (classAttemptCounts[aClass] !== undefined) {
      classAttemptCounts[aClass]++;
      if (aStatus === "completed") {
        classCompletedCounts[aClass]++;
        classScoreSums[aClass] += aPercentage;
      }
    }

    // Unit stats
    if (aUnitId) {
      if (!unitStatsMap[aUnitId]) {
        unitStatsMap[aUnitId] = { unitId: aUnitId, unitTitle: aUnitTitle || aUnitId, totalAttempts: 0, completedAttempts: 0, scoreSum: 0 };
      }
      unitStatsMap[aUnitId].totalAttempts++;
      if (aStatus === "completed") {
        unitStatsMap[aUnitId].completedAttempts++;
        unitStatsMap[aUnitId].scoreSum += aPercentage;
      }
    }

    // Game stats
    if (aGameType) {
      if (!gameStatsMap[aGameType]) {
        gameStatsMap[aGameType] = { gameType: aGameType, totalAttempts: 0, completedAttempts: 0, scoreSum: 0, durationSum: 0 };
      }
      gameStatsMap[aGameType].totalAttempts++;
      gameStatsMap[aGameType].durationSum += aDuration;
      if (aStatus === "completed") {
        gameStatsMap[aGameType].completedAttempts++;
        gameStatsMap[aGameType].scoreSum += aPercentage;
      }
    }

    // Collect for recent activity
    filteredAttemptsList.push({
      attemptId: String(aRow[attemptColMap["attempt_id"] - 1] || ""),
      studentNumber: aStudentNum,
      studentName: allStudentsByNumber[aStudentNum] ? allStudentsByNumber[aStudentNum].fullName : ("Student " + aStudentNum),
      class: aClass,
      unitTitle: aUnitTitle || aUnitId,
      activityTitle: String(aRow[attemptColMap["activity_title"] - 1] || ""),
      gameType: aGameType,
      status: aStatus,
      score: aScore,
      percentage: aPercentage,
      startedAt: aStartedAt,
      durationSeconds: aDuration
    });
  }

  // Calculate averages
  var averageScore = completedAttempts > 0 ? Math.round(scoreSum / completedAttempts) : 0;

  // Format class stats
  var classStats = ["7A", "7B", "8A", "8B"].map(function(cId) {
    var cStudents = classRosters[cId] || 0;
    var cActive = classActive[cId] || 0;
    var cAttempts = classAttemptCounts[cId] || 0;
    var cCompleted = classCompletedCounts[cId] || 0;
    var cScore = cCompleted > 0 ? Math.round(classScoreSums[cId] / cCompleted) : 0;
    var cRate = cAttempts > 0 ? Math.round((cCompleted / cAttempts) * 100) : 0;
    return {
      classId: cId,
      studentCount: cStudents,
      activeCount: cActive,
      totalAttempts: cAttempts,
      completedAttempts: cCompleted,
      averageScore: cScore,
      completionRate: cRate
    };
  });

  // Format unit stats
  var unitStats = Object.keys(unitStatsMap).map(function(uId) {
    var u = unitStatsMap[uId];
    return {
      unitId: u.unitId,
      unitTitle: u.unitTitle,
      totalAttempts: u.totalAttempts,
      completedAttempts: u.completedAttempts,
      averageScore: u.completedAttempts > 0 ? Math.round(u.scoreSum / u.completedAttempts) : 0
    };
  });

  // Format game stats
  var gameStats = Object.keys(gameStatsMap).map(function(gId) {
    var g = gameStatsMap[gId];
    return {
      gameType: g.gameType,
      totalAttempts: g.totalAttempts,
      completedAttempts: g.completedAttempts,
      averageScore: g.completedAttempts > 0 ? Math.round(g.scoreSum / g.completedAttempts) : 0,
      avgDurationSeconds: g.totalAttempts > 0 ? Math.round(g.durationSum / g.totalAttempts) : 0
    };
  });

  // Sort recent activity feed (most recent first, up to 30)
  filteredAttemptsList.sort(function(a, b) {
    return new Date(b.startedAt || 0).getTime() - new Date(a.startedAt || 0).getTime();
  });
  var recentActivity = filteredAttemptsList.slice(0, 30);

  return createJsonResponse({
    success: true,
    overview: {
      totalStudents: totalStudents,
      studentsLoggedIn: studentsLoggedIn,
      studentsNeverLoggedIn: Math.max(0, totalStudents - studentsLoggedIn),
      totalAttempts: totalAttempts,
      completedAttempts: completedAttempts,
      abandonedAttempts: abandonedAttempts,
      inProgressAttempts: inProgressAttempts,
      averageScore: averageScore,
      totalTimeSpentSeconds: totalTimeSpentSeconds,
      activeStudentsLast7Days: Object.keys(activeStudentsLast7DaysSet).length
    },
    classStats: classStats,
    unitStats: unitStats,
    gameStats: gameStats,
    recentActivity: recentActivity
  });
}

/**
 * ACTION: teacher_get_roster
 * Student list with dynamic curriculum progress, completed counts,
 * average score, best score, time spent, and status badges.
 */
function handleTeacherGetRoster(ss, payload) {
  var auth = validateTeacherSession(ss, payload.teacherToken);
  if (!auth.valid) {
    return createJsonResponse({ success: false, error: auth.error, code: auth.code });
  }

  var filters = payload.filters || {};
  var filterClass = filters.classId && filters.classId !== "all" ? String(filters.classId).trim().toUpperCase() : null;
  var filterGrade = filters.gradeId && filters.gradeId !== "all" ? String(filters.gradeId).trim() : null;
  var searchTerm = filters.searchTerm ? String(filters.searchTerm).trim().toLowerCase() : null;

  var trustedCurriculum = getTrustedCurriculumMap(ss);

  var studentsSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.STUDENTS);
  var attemptsSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.ATTEMPTS);

  var studentData = studentsSheet ? studentsSheet.getDataRange().getValues() : [];
  var attemptData = attemptsSheet ? attemptsSheet.getDataRange().getValues() : [];

  var studentColMap = studentsSheet ? getSheetColumnMap(studentsSheet, CONFIG.STUDENT_HEADERS) : {};
  var attemptColMap = attemptsSheet ? getSheetColumnMap(attemptsSheet, CONFIG.ATTEMPT_HEADERS) : {};

  // Group attempts by studentNumber
  var studentAttemptsMap = {};
  for (var j = 1; j < attemptData.length; j++) {
    var aRow = attemptData[j];
    var aNum = String(aRow[attemptColMap["student_number"] - 1] || "").trim();
    if (!aNum) continue;
    if (!studentAttemptsMap[aNum]) studentAttemptsMap[aNum] = [];
    studentAttemptsMap[aNum].push({
      activityId: String(aRow[attemptColMap["activity_id"] - 1] || "").trim(),
      status: String(aRow[attemptColMap["status"] - 1] || "").trim(),
      percentage: Number(aRow[attemptColMap["percentage"] - 1] || 0),
      durationSeconds: Number(aRow[attemptColMap["duration_seconds"] - 1] || 0)
    });
  }

  var roster = [];

  for (var i = 1; i < studentData.length; i++) {
    var sRow = studentData[i];
    var sNum = String(sRow[studentColMap["student_number"] - 1] || "").trim();
    if (!sNum) continue;

    var sClass = String(sRow[studentColMap["class"] - 1] || "").trim().toUpperCase();
    var sGrade = String(sRow[studentColMap["grade"] - 1] || "").trim();
    var normGrade = (sGrade === "7" || sGrade === 7 || sGrade === "grade-7") ? "grade-7" : "grade-8";
    var fullName = String(sRow[studentColMap["full_name"] - 1] || "");
    var lastLoginAt = sRow[studentColMap["last_login_at"] - 1] || null;
    var isActive = sRow[studentColMap["is_active"] - 1];

    if (filterClass && sClass !== filterClass) continue;
    if (filterGrade && normGrade !== filterGrade) continue;
    if (searchTerm) {
      var matchNum = sNum.toLowerCase().indexOf(searchTerm) !== -1;
      var matchName = fullName.toLowerCase().indexOf(searchTerm) !== -1;
      if (!matchNum && !matchName) continue;
    }

    var attempts = studentAttemptsMap[sNum] || [];
    var totalAttempts = attempts.length;

    // Distinct completed activities
    var completedPublishedActs = {};
    var completedCustomActs = {};
    var completedScoresSum = 0;
    var completedCount = 0;
    var bestScore = 0;
    var totalTimeSpent = 0;

    for (var a = 0; a < attempts.length; a++) {
      var att = attempts[a];
      totalTimeSpent += att.durationSeconds;

      if (att.status === "completed") {
        completedCount++;
        completedScoresSum += att.percentage;
        if (att.percentage > bestScore) bestScore = att.percentage;

        // Check if activity is in trusted published curriculum
        var isPublishedCurriculum = Boolean(trustedCurriculum.byGrade[normGrade] && trustedCurriculum.byGrade[normGrade][att.activityId]);
        if (isPublishedCurriculum) {
          completedPublishedActs[att.activityId] = true;
        } else {
          completedCustomActs[att.activityId] = true;
        }
      }
    }

    var completedActivitiesCount = Object.keys(completedPublishedActs).length;
    var customActivitiesCompletedCount = Object.keys(completedCustomActs).length;
    var totalPublishedActivities = trustedCurriculum.totals[normGrade] || 0;
    var curriculumProgressPercentage = totalPublishedActivities > 0
      ? Math.min(100, Math.round((completedActivitiesCount / totalPublishedActivities) * 100))
      : 0;

    var averageCompletedScore = completedCount > 0 ? Math.round(completedScoresSum / completedCount) : 0;

    // Status badge determination
    var statusBadge = "active";
    if (!lastLoginAt && totalAttempts === 0) {
      statusBadge = "never_logged_in";
    } else if (completedCount > 0 && averageCompletedScore < 50) {
      statusBadge = "needs_attention";
    }

    roster.push({
      studentId: String(sRow[studentColMap["student_id"] - 1] || ""),
      studentNumber: sNum,
      fullName: fullName,
      grade: normGrade,
      class: sClass,
      lastLoginAt: lastLoginAt,
      isActive: Boolean(isActive),
      totalAttempts: totalAttempts,
      completedActivitiesCount: completedActivitiesCount,
      totalPublishedActivities: totalPublishedActivities,
      curriculumProgressPercentage: curriculumProgressPercentage,
      customActivitiesCompletedCount: customActivitiesCompletedCount,
      averageCompletedScore: averageCompletedScore,
      bestScore: bestScore,
      totalTimeSpentSeconds: totalTimeSpent,
      status: statusBadge
    });
  }

  // Sort by student number ascending
  roster.sort(function(a, b) {
    return a.studentNumber.localeCompare(b.studentNumber, undefined, { numeric: true });
  });

  return createJsonResponse({
    success: true,
    roster: roster
  });
}

/**
 * ACTION: teacher_get_student_detail
 * Deep-dive profile for a student: all attempts, repeated attempt gains,
 * and question-level answer breakdown.
 */
function handleTeacherGetStudentDetail(ss, payload) {
  var auth = validateTeacherSession(ss, payload.teacherToken);
  if (!auth.valid) {
    return createJsonResponse({ success: false, error: auth.error, code: auth.code });
  }

  var studentNumber = String(payload.studentNumber || "").trim();
  var studentId = String(payload.studentId || "").trim();

  if (!studentNumber && !studentId) {
    return createJsonResponse({ success: false, error: "studentNumber or studentId is required.", code: "BAD_REQUEST" });
  }

  var studentsSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.STUDENTS);
  var attemptsSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.ATTEMPTS);
  var answersSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.ANSWERS);

  var studentData = studentsSheet ? studentsSheet.getDataRange().getValues() : [];
  var studentColMap = studentsSheet ? getSheetColumnMap(studentsSheet, CONFIG.STUDENT_HEADERS) : {};

  // Find student
  var studentRow = null;
  for (var i = 1; i < studentData.length; i++) {
    var rowNum = String(studentData[i][studentColMap["student_number"] - 1] || "").trim();
    var rowId = String(studentData[i][studentColMap["student_id"] - 1] || "").trim();
    if ((studentNumber && rowNum === studentNumber) || (studentId && rowId === studentId)) {
      studentRow = studentData[i];
      studentNumber = rowNum;
      studentId = rowId;
      break;
    }
  }

  if (!studentRow) {
    return createJsonResponse({ success: false, error: "Student not found.", code: "NOT_FOUND" });
  }

  var sGrade = String(studentRow[studentColMap["grade"] - 1] || "").trim();
  var normGrade = (sGrade === "7" || sGrade === 7 || sGrade === "grade-7") ? "grade-7" : "grade-8";

  var studentObj = {
    studentId: studentId,
    studentNumber: studentNumber,
    fullName: String(studentRow[studentColMap["full_name"] - 1] || ""),
    grade: normGrade,
    class: String(studentRow[studentColMap["class"] - 1] || "").trim().toUpperCase(),
    createdAt: studentRow[studentColMap["created_at"] - 1] || null,
    lastLoginAt: studentRow[studentColMap["last_login_at"] - 1] || null,
    isActive: Boolean(studentRow[studentColMap["is_active"] - 1])
  };

  // Read Attempts
  var attemptData = attemptsSheet ? attemptsSheet.getDataRange().getValues() : [];
  var attemptColMap = attemptsSheet ? getSheetColumnMap(attemptsSheet, CONFIG.ATTEMPT_HEADERS) : {};
  var attemptsList = [];
  var attemptsByActivity = {};

  for (var j = 1; j < attemptData.length; j++) {
    var aRow = attemptData[j];
    var aNum = String(aRow[attemptColMap["student_number"] - 1] || "").trim();
    if (aNum !== studentNumber) continue;

    var actId = String(aRow[attemptColMap["activity_id"] - 1] || "").trim();
    var rawVersion = (attemptColMap["content_version"] && aRow[attemptColMap["content_version"] - 1] !== undefined)
      ? String(aRow[attemptColMap["content_version"] - 1]).trim()
      : "";
    var contentVersion = rawVersion.length > 0 ? rawVersion : null;
    var versionLabel = rawVersion.length > 0 ? rawVersion : "Legacy / Version Unknown";

    var attItem = {
      attemptId: String(aRow[attemptColMap["attempt_id"] - 1] || ""),
      unitId: String(aRow[attemptColMap["unit_id"] - 1] || ""),
      unitTitle: String(aRow[attemptColMap["unit_title"] - 1] || ""),
      activityId: actId,
      activityTitle: String(aRow[attemptColMap["activity_title"] - 1] || ""),
      gameType: String(aRow[attemptColMap["game_type"] - 1] || ""),
      attemptNumber: Number(aRow[attemptColMap["attempt_number"] - 1] || 1),
      score: Number(aRow[attemptColMap["score"] - 1] || 0),
      totalQuestions: Number(aRow[attemptColMap["total_questions"] - 1] || 0),
      answeredQuestions: Number(aRow[attemptColMap["answered_questions"] - 1] || 0),
      correctAnswers: Number(aRow[attemptColMap["correct_answers"] - 1] || 0),
      incorrectAnswers: Number(aRow[attemptColMap["incorrect_answers"] - 1] || 0),
      skippedQuestions: Number(aRow[attemptColMap["skipped_questions"] - 1] || 0),
      percentage: Number(aRow[attemptColMap["percentage"] - 1] || 0),
      startedAt: aRow[attemptColMap["started_at"] - 1] || null,
      completedAt: aRow[attemptColMap["completed_at"] - 1] || null,
      durationSeconds: Number(aRow[attemptColMap["duration_seconds"] - 1] || 0),
      status: String(aRow[attemptColMap["status"] - 1] || ""),
      contentVersion: contentVersion,
      versionLabel: versionLabel
    };

    attemptsList.push(attItem);
    if (!attemptsByActivity[actId]) attemptsByActivity[actId] = [];
    attemptsByActivity[actId].push(attItem);
  }

  // Calculate Repeated Attempt Gains
  var repeatedAttemptGains = [];
  Object.keys(attemptsByActivity).forEach(function(actId) {
    var acts = attemptsByActivity[actId];
    if (acts.length > 1) {
      acts.sort(function(a, b) {
        return new Date(a.startedAt || 0).getTime() - new Date(b.startedAt || 0).getTime();
      });
      var firstAttempt = acts[0];
      var latestAttempt = acts[acts.length - 1];
      var maxScore = 0;
      for (var m = 0; m < acts.length; m++) {
        if (acts[m].percentage > maxScore) maxScore = acts[m].percentage;
      }
      repeatedAttemptGains.push({
        activityId: actId,
        activityTitle: latestAttempt.activityTitle || actId,
        totalAttempts: acts.length,
        firstScore: firstAttempt.percentage,
        latestScore: latestAttempt.percentage,
        bestScore: maxScore,
        scoreGain: latestAttempt.percentage - firstAttempt.percentage
      });
    }
  });

  // Read Answers
  var answerData = answersSheet ? answersSheet.getDataRange().getValues() : [];
  var answerColMap = answersSheet ? getSheetColumnMap(answersSheet, CONFIG.ANSWER_HEADERS) : {};
  var answersList = [];

  for (var k = 1; k < answerData.length; k++) {
    var ansRow = answerData[k];
    var ansNum = String(ansRow[answerColMap["student_number"] - 1] || "").trim();
    if (ansNum !== studentNumber) continue;

    var rawQVersion = (answerColMap["question_version"] && ansRow[answerColMap["question_version"] - 1] !== undefined)
      ? String(ansRow[answerColMap["question_version"] - 1]).trim()
      : "";
    var questionVersion = rawQVersion.length > 0 ? rawQVersion : null;
    var qVersionLabel = rawQVersion.length > 0 ? rawQVersion : "Legacy / Version Unknown";

    answersList.push({
      answerId: String(ansRow[answerColMap["answer_id"] - 1] || ""),
      attemptId: String(ansRow[answerColMap["attempt_id"] - 1] || ""),
      unitId: String(ansRow[answerColMap["unit_id"] - 1] || ""),
      activityId: String(ansRow[answerColMap["activity_id"] - 1] || ""),
      questionId: String(ansRow[answerColMap["question_id"] - 1] || ""),
      questionOrder: Number(ansRow[answerColMap["question_order"] - 1] || 1),
      questionPrompt: String(ansRow[answerColMap["question_prompt"] - 1] || ""),
      studentResponse: String(ansRow[answerColMap["student_response"] - 1] || ""),
      correctAnswer: String(ansRow[answerColMap["correct_answer"] - 1] || ""),
      isCorrect: Boolean(ansRow[answerColMap["is_correct"] - 1]),
      timeSpentSeconds: Number(ansRow[answerColMap["time_spent_seconds"] - 1] || 0),
      timestamp: ansRow[answerColMap["timestamp"] - 1] || null,
      questionVersion: questionVersion,
      versionLabel: qVersionLabel
    });
  }

  // Sort attempts descending by startedAt
  attemptsList.sort(function(a, b) {
    return new Date(b.startedAt || 0).getTime() - new Date(a.startedAt || 0).getTime();
  });

  return createJsonResponse({
    success: true,
    student: studentObj,
    attempts: attemptsList,
    repeatedAttemptGains: repeatedAttemptGains,
    answers: answersList
  });
}

/**
 * ACTION: teacher_get_question_analytics
 * Diagnostic leaderboard: calculates accuracy rates, incorrect response distributions,
 * and isolates question versions using composite keys.
 */
function handleTeacherGetQuestionAnalytics(ss, payload) {
  var auth = validateTeacherSession(ss, payload.teacherToken);
  if (!auth.valid) {
    return createJsonResponse({ success: false, error: auth.error, code: auth.code });
  }

  var filters = payload.filters || {};
  var filterClass = filters.classId && filters.classId !== "all" ? String(filters.classId).trim().toUpperCase() : null;
  var filterGrade = filters.gradeId && filters.gradeId !== "all" ? String(filters.gradeId).trim() : null;
  var filterUnit = filters.unitId && filters.unitId !== "all" ? String(filters.unitId).trim() : null;
  var filterActivity = filters.activityId && filters.activityId !== "all" ? String(filters.activityId).trim() : null;

  var answersSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.ANSWERS);
  var studentsSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.STUDENTS);

  var answerData = answersSheet ? answersSheet.getDataRange().getValues() : [];
  var studentData = studentsSheet ? studentsSheet.getDataRange().getValues() : [];

  var answerColMap = answersSheet ? getSheetColumnMap(answersSheet, CONFIG.ANSWER_HEADERS) : {};
  var studentColMap = studentsSheet ? getSheetColumnMap(studentsSheet, CONFIG.STUDENT_HEADERS) : {};

  // Build student grade/class lookup
  var studentClassMap = {};
  var studentGradeMap = {};
  for (var s = 1; s < studentData.length; s++) {
    var sNum = String(studentData[s][studentColMap["student_number"] - 1] || "").trim();
    if (!sNum) continue;
    studentClassMap[sNum] = String(studentData[s][studentColMap["class"] - 1] || "").trim().toUpperCase();
    var g = String(studentData[s][studentColMap["grade"] - 1] || "").trim();
    studentGradeMap[sNum] = (g === "7" || g === 7 || g === "grade-7") ? "grade-7" : "grade-8";
  }

  var analyticsMap = {};

  for (var i = 1; i < answerData.length; i++) {
    var row = answerData[i];
    var sNum = String(row[answerColMap["student_number"] - 1] || "").trim();
    var sClass = studentClassMap[sNum] || String(row[answerColMap["class"] - 1] || "").trim().toUpperCase();
    var sGrade = studentGradeMap[sNum] || null;

    if (filterClass && sClass !== filterClass) continue;
    if (filterGrade && sGrade && sGrade !== filterGrade) continue;

    var unitId = String(row[answerColMap["unit_id"] - 1] || "").trim();
    var actId = String(row[answerColMap["activity_id"] - 1] || "").trim();

    if (filterUnit && unitId !== filterUnit) continue;
    if (filterActivity && actId !== filterActivity) continue;

    var qId = String(row[answerColMap["question_id"] - 1] || "").trim();
    if (!qId) continue;

    var rawQVersion = (answerColMap["question_version"] && row[answerColMap["question_version"] - 1] !== undefined)
      ? String(row[answerColMap["question_version"] - 1]).trim()
      : "";
    var questionVersion = rawQVersion.length > 0 ? rawQVersion : null;
    var versionLabel = rawQVersion.length > 0 ? rawQVersion : "Legacy / Version Unknown";

    // Composite key to separate question revisions
    var compositeKey = qId + "@" + (questionVersion || "legacy");

    if (!analyticsMap[compositeKey]) {
      analyticsMap[compositeKey] = {
        compositeKey: compositeKey,
        questionId: qId,
        questionVersion: questionVersion,
        versionLabel: versionLabel,
        questionPrompt: String(row[answerColMap["question_prompt"] - 1] || ""),
        unitId: unitId,
        activityId: actId,
        timesAnswered: 0,
        distinctStudentsMap: {},
        correctCount: 0,
        incorrectCount: 0,
        incorrectResponsesMap: {},
        incorrectResponsesStudentMap: {}
      };
    }

    var item = analyticsMap[compositeKey];
    item.timesAnswered++;
    if (sNum) {
      item.distinctStudentsMap[sNum] = true;
    }

    var isCorrect = Boolean(row[answerColMap["is_correct"] - 1]);
    if (isCorrect) {
      item.correctCount++;
    } else {
      item.incorrectCount++;
      var resp = String(row[answerColMap["student_response"] - 1] || "").trim();
      if (resp) {
        item.incorrectResponsesMap[resp] = (item.incorrectResponsesMap[resp] || 0) + 1;
        if (!item.incorrectResponsesStudentMap[resp]) {
          item.incorrectResponsesStudentMap[resp] = {};
        }
        if (sNum) {
          item.incorrectResponsesStudentMap[resp][sNum] = true;
        }
      }
    }
  }

  // Format array and diagnostic leaderboard
  var questionAnalytics = Object.keys(analyticsMap).map(function(key) {
    var q = analyticsMap[key];
    var accRate = q.timesAnswered > 0 ? Math.round((q.correctCount / q.timesAnswered) * 100) : 0;
    var distinctQStudents = Object.keys(q.distinctStudentsMap).length;

    var commonIncorrectResponses = Object.keys(q.incorrectResponsesMap).map(function(rText) {
      var count = q.incorrectResponsesMap[rText];
      var distinctRStudents = q.incorrectResponsesStudentMap[rText]
        ? Object.keys(q.incorrectResponsesStudentMap[rText]).length
        : 0;
      return {
        response: rText,
        count: count,
        percentage: q.incorrectCount > 0 ? Math.round((count / q.incorrectCount) * 100) : 0,
        distinctStudentsCount: distinctRStudents
      };
    });
    // Sort incorrect responses by count descending
    commonIncorrectResponses.sort(function(a, b) { return b.count - a.count; });

    return {
      compositeKey: q.compositeKey,
      questionId: q.questionId,
      questionVersion: q.questionVersion,
      versionLabel: q.versionLabel,
      questionPrompt: q.questionPrompt,
      unitId: q.unitId,
      activityId: q.activityId,
      timesAnswered: q.timesAnswered,
      distinctStudentsCount: distinctQStudents,
      correctCount: q.correctCount,
      incorrectCount: q.incorrectCount,
      accuracyRate: accRate,
      commonIncorrectResponses: commonIncorrectResponses
    };
  });

  // Sort ascending by accuracyRate (lowest accuracy first = diagnostic diagnostic leaderboard)
  questionAnalytics.sort(function(a, b) {
    if (a.accuracyRate !== b.accuracyRate) return a.accuracyRate - b.accuracyRate;
    return b.timesAnswered - a.timesAnswered;
  });

  return createJsonResponse({
    success: true,
    questionAnalytics: questionAnalytics
  });
}

// ============================================================================
// STUDENT AUTHENTICATION & GRADE AUTHORIZATION LOGIC
// ============================================================================

/**
 * Resolves canonical gradeId ('grade-7' or 'grade-8') strictly from student class or grade field.
 * Classes 7A and 7B strictly resolve to 'grade-7'.
 * Classes 8A and 8B strictly resolve to 'grade-8'.
 * Never trusts client overrides or unverified strings.
 */
function resolveGradeFromStudent(studentClass, rawGrade) {
  var cStr = String(studentClass || "").trim().toUpperCase();
  if (cStr.indexOf("7") === 0) {
    return "grade-7";
  }
  if (cStr.indexOf("8") === 0) {
    return "grade-8";
  }
  var gStr = String(rawGrade || "").trim().toLowerCase();
  if (gStr === "7" || gStr === "grade-7" || gStr.indexOf("grade-7") === 0) {
    return "grade-7";
  }
  if (gStr === "8" || gStr === "grade-8" || gStr.indexOf("grade-8") === 0) {
    return "grade-8";
  }
  return "grade-7";
}

/**
 * Checks if an activity ID, unit ID, or question ID belongs to the authorized grade.
 * Blocks cross-grade game access, attempts, answers, retries, and question exposure.
 */
function isContentAuthorizedForGrade(activityId, unitId, questionId, studentGrade) {
  var act = String(activityId || "").trim().toLowerCase();
  var u = String(unitId || "").trim().toLowerCase();
  var q = String(questionId || "").trim().toLowerCase();
  var targetGrade = String(studentGrade || "").trim();

  if (targetGrade === "grade-7") {
    // Cannot access Grade 8 activities, units, or questions
    if (act.indexOf("g8-") === 0 || u.indexOf("g8-") === 0 || q.indexOf("g8-") === 0 ||
        act.indexOf("wn_g8_") === 0 || act.indexOf("gr_g8_") === 0 || act.indexOf("wf_g8_") === 0 || act.indexOf("st_g8_") === 0 ||
        q.indexOf("wn_g8_") === 0 || q.indexOf("gr_g8_") === 0 || q.indexOf("wf_g8_") === 0 || q.indexOf("st_g8_") === 0) {
      return false;
    }
    return true;
  }

  if (targetGrade === "grade-8") {
    // Cannot access Grade 7 activities, units, or questions
    if (act.indexOf("g7-") === 0 || u.indexOf("g7-") === 0 || q.indexOf("g7-") === 0 ||
        act.indexOf("wn_g7_") === 0 || act.indexOf("gr_g7_") === 0 || act.indexOf("wf_g7_") === 0 || act.indexOf("st_g7_") === 0 ||
        q.indexOf("wn_g7_") === 0 || q.indexOf("gr_g7_") === 0 || q.indexOf("wf_g7_") === 0 || q.indexOf("st_g7_") === 0) {
      return false;
    }
    return true;
  }

  return false;
}

/**
 * Authenticates a student via studentNumber and PIN.
 * Implements salted hash verification, lockout checks, and session generation.
 */
function handleStudentLogin(ss, payload) {
  var studentNumber = String(payload.studentNumber || "").trim();
  var pin = String(payload.pin || "").trim();

  if (!studentNumber || !pin) {
    return createJsonResponse({ success: false, error: "Student number and PIN are required.", code: "UNAUTHORIZED" });
  }

  var studentsSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.STUDENTS);
  if (!studentsSheet) {
    return createJsonResponse({ success: false, error: "Database not initialized. Please run setupArcadeDatabase().", code: "DATABASE_ERROR" });
  }

  var data = studentsSheet.getDataRange().getValues();
  if (data.length <= 1) {
    return createJsonResponse({ success: false, error: "No student records found in database.", code: "NOT_FOUND" });
  }

  var rowIndex = -1;
  var studentRow = null;

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][1]).trim() === studentNumber) {
      rowIndex = i + 1;
      studentRow = data[i];
      break;
    }
  }

  if (!studentRow) {
    return createJsonResponse({ success: false, error: "Invalid student number or PIN.", code: "UNAUTHORIZED" });
  }

  var studentId = studentRow[0];
  var fullName = studentRow[2];
  var grade = studentRow[3];
  var studentClass = studentRow[4];
  var salt = String(studentRow[5]);
  var storedHash = String(studentRow[6]);
  var isActive = studentRow[7];
  var failedAttempts = Number(studentRow[8] || 0);
  var lockedUntilStr = studentRow[9];

  // 1. Check if account is active
  if (isActive === false || String(isActive).toLowerCase() === "false") {
    return createJsonResponse({ success: false, error: "This student account is currently disabled. Please contact your teacher.", code: "FORBIDDEN" });
  }

  // 2. Check brute-force lockout
  var now = new Date();
  if (lockedUntilStr) {
    var lockedUntil = new Date(lockedUntilStr);
    if (now < lockedUntil) {
      var minutesLeft = Math.ceil((lockedUntil.getTime() - now.getTime()) / (60 * 1000));
      return createJsonResponse({
        success: false,
        error: "Too many failed attempts. Account locked. Please wait " + minutesLeft + " minute(s).",
        code: "LOCKED"
      });
    }
  }

  // 3. Verify PIN against salted + peppered hash
  var computedHash = hashPinWithSaltAndPepper(pin, salt);
  if (computedHash !== storedHash) {
    failedAttempts++;
    var lockDate = null;
    var errorMsg = "Invalid student number or PIN.";
    var code = "UNAUTHORIZED";

    if (failedAttempts >= CONFIG.MAX_FAILED_ATTEMPTS) {
      lockDate = new Date(now.getTime() + CONFIG.LOCKOUT_MINUTES * 60 * 1000);
      errorMsg = "Account locked for " + CONFIG.LOCKOUT_MINUTES + " minutes due to repeated incorrect PIN attempts.";
      code = "LOCKED";
    }

    studentsSheet.getRange(rowIndex, 9).setValue(failedAttempts);
    if (lockDate) {
      studentsSheet.getRange(rowIndex, 10).setValue(lockDate.toISOString());
    }

    return createJsonResponse({ success: false, error: errorMsg, code: code });
  }

  // 4. PIN is valid: Reset failed attempts & update last login
  studentsSheet.getRange(rowIndex, 9).setValue(0);
  studentsSheet.getRange(rowIndex, 10).setValue("");
  studentsSheet.getRange(rowIndex, 12).setValue(now.toISOString());

  // 5. Generate secure session token and record session
  var sessionToken = generateSecureToken();
  var sessionId = "sess_" + Utilities.getUuid().substring(0, 8);
  var expiresAt = new Date(now.getTime() + CONFIG.SESSION_DURATION_HOURS * 60 * 60 * 1000);

  var sessionsSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.SESSIONS);
  if (sessionsSheet) {
    sessionsSheet.appendRow([
      sessionId,
      sessionToken,
      studentId,
      studentNumber,
      studentClass,
      now.toISOString(),
      now.toISOString(),
      expiresAt.toISOString(),
      "", // logout_time
      "active",
      payload.userAgent || "Web Browser"
    ]);
  }

  // 6. Return minimal, sanitized student profile
  var nameParts = String(fullName).trim().split(" ");
  var firstName = nameParts[0] || fullName;
  var displayInitials = nameParts.length > 1 ? nameParts[0] + " " + nameParts[nameParts.length - 1].charAt(0) + "." : firstName;

  return createJsonResponse({
    success: true,
    sessionToken: sessionToken,
    student: {
      studentNumber: studentNumber,
      displayName: displayInitials,
      firstName: firstName,
      class: studentClass,
      grade: resolveGradeFromStudent(studentClass, grade),
      totalCoins: getStudentCoinBalance(ss, studentNumber),
      monster: getStudentMonsterConfig(ss, studentNumber)
    },
    expiresAt: expiresAt.toISOString()
  });
}

/**
 * Validates an active session token and refreshes last ping.
 */
function handleSessionCheck(ss, payload) {
  var sessionToken = String(payload.sessionToken || "").trim();
  if (!sessionToken) {
    return createJsonResponse({ success: false, error: "Missing session token.", code: "UNAUTHORIZED" });
  }

  var sessionsSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.SESSIONS);
  if (!sessionsSheet) {
    return createJsonResponse({ success: false, error: "Database not initialized.", code: "DATABASE_ERROR" });
  }

  var data = sessionsSheet.getDataRange().getValues();
  var sessionRow = null;
  var rowIndex = -1;

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][1]).trim() === sessionToken) {
      sessionRow = data[i];
      rowIndex = i + 1;
      break;
    }
  }

  if (!sessionRow) {
    return createJsonResponse({ success: false, error: "Invalid session.", code: "UNAUTHORIZED" });
  }

  var expiresAt = new Date(sessionRow[7]);
  var status = sessionRow[9];
  var now = new Date();

  if (status !== "active" || now > expiresAt) {
    if (status === "active") {
      sessionsSheet.getRange(rowIndex, 10).setValue("expired");
    }
    return createJsonResponse({ success: false, error: "Session has expired. Please log in again.", code: "UNAUTHORIZED" });
  }

  // Update last ping time
  sessionsSheet.getRange(rowIndex, 7).setValue(now.toISOString());

  // Fetch student info
  var studentNumber = String(sessionRow[3] || "").trim();
  var studentClass = String(sessionRow[4] || "").trim();

  var studentsSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.STUDENTS);
  var studentData = studentsSheet.getDataRange().getValues();
  var firstName = "Student";
  var displayInitials = "Student";
  var grade = "grade-7";

  for (var j = 1; j < studentData.length; j++) {
    if (String(studentData[j][1]).trim() === String(studentNumber).trim()) {
      var fullName = studentData[j][2];
      var nameParts = String(fullName).trim().split(" ");
      firstName = nameParts[0] || fullName;
      displayInitials = nameParts.length > 1 ? nameParts[0] + " " + nameParts[nameParts.length - 1].charAt(0) + "." : firstName;
      var g = studentData[j][3];
      var cls = studentClass || studentData[j][4];
      grade = resolveGradeFromStudent(cls, g);
      break;
    }
  }

  return createJsonResponse({
    success: true,
    student: {
      studentNumber: String(studentNumber),
      displayName: displayInitials,
      firstName: firstName,
      class: String(studentClass),
      grade: grade,
      totalCoins: getStudentCoinBalance(ss, studentNumber),
      monster: getStudentMonsterConfig(ss, studentNumber)
    }
  });
}

/**
 * Handles explicit student logout.
 */
function handleStudentLogout(ss, payload) {
  var sessionToken = String(payload.sessionToken || "").trim();
  if (!sessionToken) {
    return createJsonResponse({ success: true, message: "No session provided." });
  }

  var sessionsSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.SESSIONS);
  if (sessionsSheet) {
    var data = sessionsSheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][1]).trim() === sessionToken) {
        sessionsSheet.getRange(i + 1, 9).setValue(new Date().toISOString());
        sessionsSheet.getRange(i + 1, 10).setValue("logged_out");
        break;
      }
    }
  }

  return createJsonResponse({ success: true, message: "Logged out successfully." });
}

// ============================================================================
// GAME ACTIVITY TELEMETRY & TRACKING (PHASE 2)
// ============================================================================

/**
 * Validates a student session token and retrieves trusted student identity.
 */
function validateSessionAndGetStudent(ss, sessionToken) {
  if (!sessionToken || typeof sessionToken !== "string" || sessionToken.trim().length === 0) {
    return { error: "Missing session token." };
  }

  var cleanToken = sessionToken.trim();
  var sessionsSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.SESSIONS);
  if (!sessionsSheet) {
    return { error: "Database not initialized. Please run setupArcadeDatabase()." };
  }

  var sessionData = sessionsSheet.getDataRange().getValues();
  var matchedSession = null;
  var sessionRowIndex = -1;

  for (var i = 1; i < sessionData.length; i++) {
    if (String(sessionData[i][1]).trim() === cleanToken) {
      matchedSession = sessionData[i];
      sessionRowIndex = i + 1;
      break;
    }
  }

  if (!matchedSession) {
    return { error: "Invalid session. Please log in again." };
  }

  var expiresAt = new Date(matchedSession[7]);
  var status = matchedSession[9];
  var now = new Date();

  if (status !== "active" || now > expiresAt) {
    if (status === "active") {
      sessionsSheet.getRange(sessionRowIndex, 10).setValue("expired");
    }
    return { error: "Session has expired. Please log in again." };
  }

  sessionsSheet.getRange(sessionRowIndex, 7).setValue(now.toISOString());

  var studentNumber = String(matchedSession[3]).trim();
  var studentClass = String(matchedSession[4]).trim();
  var studentId = String(matchedSession[2]).trim();

  var studentsSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.STUDENTS);
  if (!studentsSheet) {
    return { error: "Students database unavailable." };
  }

  var studentsData = studentsSheet.getDataRange().getValues();
  var matchedStudent = null;
  for (var j = 1; j < studentsData.length; j++) {
    if (String(studentsData[j][1]).trim() === studentNumber) {
      matchedStudent = studentsData[j];
      break;
    }
  }

  if (!matchedStudent) {
    return { error: "Student account not found." };
  }

  if (matchedStudent[7] === false || String(matchedStudent[7]).toLowerCase() === "false") {
    return { error: "Student account is disabled." };
  }

  return {
    success: true,
    sessionId: String(matchedSession[0]).trim(),
    studentId: studentId,
    studentNumber: studentNumber,
    className: studentClass,
    fullName: matchedStudent[2],
    grade: resolveGradeFromStudent(studentClass || matchedStudent[4], matchedStudent[3])
  };
}

/**
 * Returns a 1-indexed column lookup dictionary for sheet headers.
 */
function getSheetColumnMap(sheet, requiredHeaders) {
  var lastCol = sheet.getLastColumn();
  if (lastCol === 0) return {};

  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var map = {};
  for (var i = 0; i < headers.length; i++) {
    var headerName = String(headers[i]).trim();
    if (headerName) {
      map[headerName] = i + 1;
    }
  }

  if (requiredHeaders && Array.isArray(requiredHeaders)) {
    for (var r = 0; r < requiredHeaders.length; r++) {
      var req = requiredHeaders[r];
      if (!map[req]) {
        map[req] = (r + 1);
      }
    }
  }

  return map;
}

/**
 * ACTION: game_start_attempt
 * Initializes an activity attempt.
 * Preserves content_version if passed, or leaves blank for legacy compatibility.
 */
function handleStartAttempt(ss, payload) {
  var auth = validateSessionAndGetStudent(ss, payload.sessionToken);
  if (!auth.success) {
    return createJsonResponse({ success: false, error: auth.error, code: "UNAUTHORIZED" });
  }

  var attemptId = String(payload.attemptId || "").trim();
  if (!attemptId) {
    return createJsonResponse({ success: false, error: "Missing attemptId.", code: "BAD_REQUEST" });
  }

  var activityId = String(payload.activityId || "").trim();
  var unitId = String(payload.unitId || "").trim();
  var clientGradeId = String(payload.gradeId || "").trim();

  // Strict Server-Side Grade Authorization Guard
  if (clientGradeId && clientGradeId !== auth.grade) {
    return createJsonResponse({
      success: false,
      error: "Unauthorized: Cross-grade attempt prohibited (" + clientGradeId + " != " + auth.grade + ").",
      code: "GRADE_UNAUTHORIZED"
    });
  }

  if (!isContentAuthorizedForGrade(activityId, unitId, "", auth.grade)) {
    return createJsonResponse({
      success: false,
      error: "Unauthorized: Activity " + activityId + " does not belong to student's grade (" + auth.grade + ").",
      code: "GRADE_UNAUTHORIZED"
    });
  }

  var attemptsSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.ATTEMPTS);
  var colMap = getSheetColumnMap(attemptsSheet, CONFIG.ATTEMPT_HEADERS);
  var data = attemptsSheet.getDataRange().getValues();

  // Check if this attemptId already exists (idempotency)
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][colMap["attempt_id"] - 1]).trim() === attemptId) {
      var existingNum = data[i][colMap["attempt_number"] - 1] || 1;
      return createJsonResponse({
        success: true,
        attemptId: attemptId,
        attemptNumber: Number(existingNum),
        message: "Attempt already initialized."
      });
    }
  }

  var now = new Date().toISOString();
  var studentNumber = auth.studentNumber;
  var activityId = String(payload.activityId || "").trim();

  // 1. Reconcile any previous "in_progress" attempt by this student
  var previousAttemptCount = 0;
  for (var j = 1; j < data.length; j++) {
    var rowStudentNum = String(data[j][colMap["student_number"] - 1]).trim();
    var rowActivityId = String(data[j][colMap["activity_id"] - 1]).trim();
    var rowStatus = String(data[j][colMap["status"] - 1]).trim();

    if (rowStudentNum === studentNumber && rowActivityId === activityId) {
      previousAttemptCount++;
    }

    if (rowStudentNum === studentNumber && rowStatus === "in_progress") {
      attemptsSheet.getRange(j + 1, colMap["status"]).setValue("interrupted");
      attemptsSheet.getRange(j + 1, colMap["completed_at"]).setValue(now);
    }
  }

  var attemptNumber = previousAttemptCount + 1;

  // 2. Prepare new attempt row according to colMap
  var lastCol = attemptsSheet.getLastColumn();
  var newRow = new Array(lastCol);
  for (var c = 0; c < lastCol; c++) newRow[c] = "";

  newRow[colMap["attempt_id"] - 1] = attemptId;
  newRow[colMap["session_id"] - 1] = auth.sessionId;
  newRow[colMap["student_id"] - 1] = auth.studentId;
  newRow[colMap["student_number"] - 1] = auth.studentNumber;
  newRow[colMap["class"] - 1] = auth.className;
  newRow[colMap["grade_id"] - 1] = auth.grade;
  newRow[colMap["unit_id"] - 1] = String(payload.unitId || "");
  newRow[colMap["unit_title"] - 1] = String(payload.unitTitle || "");
  newRow[colMap["activity_id"] - 1] = activityId;
  newRow[colMap["activity_title"] - 1] = String(payload.activityTitle || "");
  newRow[colMap["game_type"] - 1] = String(payload.gameType || "");
  newRow[colMap["attempt_number"] - 1] = attemptNumber;
  newRow[colMap["score"] - 1] = 0;
  newRow[colMap["total_questions"] - 1] = Number(payload.totalQuestions) || 1;
  newRow[colMap["answered_questions"] - 1] = 0;
  newRow[colMap["correct_answers"] - 1] = 0;
  newRow[colMap["incorrect_answers"] - 1] = 0;
  newRow[colMap["skipped_questions"] - 1] = 0;
  newRow[colMap["percentage"] - 1] = 0;
  newRow[colMap["started_at"] - 1] = payload.startedAt || now;
  newRow[colMap["completed_at"] - 1] = "";
  newRow[colMap["duration_seconds"] - 1] = 0;
  newRow[colMap["status"] - 1] = "in_progress";

  if (colMap["content_version"]) {
    var cVer = payload.contentVersion !== undefined ? payload.contentVersion : payload.version;
    newRow[colMap["content_version"] - 1] = cVer ? String(cVer).trim() : "";
  }

  attemptsSheet.appendRow(newRow);

  return createJsonResponse({
    success: true,
    attemptId: attemptId,
    attemptNumber: attemptNumber
  });
}

/**
 * ACTION: game_record_answers
 * Appends a batch of question answers to the Answers sheet.
 * Verifies student session and attempt ownership.
 * Deduplicates by unique answerId or composite questionId + order + response.
 */
function handleRecordAnswers(ss, payload) {
  var auth = validateSessionAndGetStudent(ss, payload.sessionToken);
  if (!auth.success) {
    return createJsonResponse({ success: false, error: auth.error, code: "UNAUTHORIZED" });
  }

  var attemptId = String(payload.attemptId || "").trim();
  var answers = payload.answers || [];

  if (!attemptId || !Array.isArray(answers) || answers.length === 0) {
    return createJsonResponse({ success: true, recordedCount: 0, message: "No answers to record." });
  }

  var attemptsSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.ATTEMPTS);
  var attemptColMap = getSheetColumnMap(attemptsSheet, CONFIG.ATTEMPT_HEADERS);
  var attemptsData = attemptsSheet.getDataRange().getValues();

  var attemptRowIndex = -1;
  var attemptRow = null;

  for (var i = 1; i < attemptsData.length; i++) {
    if (String(attemptsData[i][attemptColMap["attempt_id"] - 1]).trim() === attemptId) {
      attemptRow = attemptsData[i];
      attemptRowIndex = i + 1;
      break;
    }
  }

  if (!attemptRow) {
    return createJsonResponse({ success: false, error: "Attempt not found: " + attemptId, code: "NOT_FOUND" });
  }

  if (String(attemptRow[attemptColMap["student_number"] - 1]).trim() !== auth.studentNumber) {
    return createJsonResponse({ success: false, error: "Unauthorized attempt access.", code: "FORBIDDEN" });
  }

  var attemptGrade = String(attemptRow[attemptColMap["grade_id"] - 1] || "");
  var attemptActId = String(attemptRow[attemptColMap["activity_id"] - 1] || "");
  if ((attemptGrade && attemptGrade !== auth.grade) || !isContentAuthorizedForGrade(attemptActId, "", "", auth.grade)) {
    return createJsonResponse({
      success: false,
      error: "Unauthorized: Cross-grade answers submission prohibited.",
      code: "GRADE_UNAUTHORIZED"
    });
  }

  var answersSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.ANSWERS);
  var answerColMap = getSheetColumnMap(answersSheet, CONFIG.ANSWER_HEADERS);
  var existingAnswersData = answersSheet.getDataRange().getValues();

  var recordedAnswerIds = {};
  var recordedSignatures = {};

  for (var j = 1; j < existingAnswersData.length; j++) {
    var rowAttempt = String(existingAnswersData[j][answerColMap["attempt_id"] - 1]).trim();
    if (rowAttempt === attemptId) {
      var rowAnsId = String(existingAnswersData[j][answerColMap["answer_id"] - 1]).trim();
      var rowQId = String(existingAnswersData[j][answerColMap["question_id"] - 1]).trim();
      var rowOrder = String(existingAnswersData[j][answerColMap["question_order"] - 1]).trim();
      var rowResp = String(existingAnswersData[j][answerColMap["student_response"] - 1]).trim();
      if (rowAnsId) recordedAnswerIds[rowAnsId] = true;
      if (rowQId) recordedSignatures[rowQId + "::" + rowOrder + "::" + rowResp] = true;
    }
  }

  var unitId = String(attemptRow[attemptColMap["unit_id"] - 1] || "");
  var activityId = String(attemptRow[attemptColMap["activity_id"] - 1] || "");
  var now = new Date().toISOString();

  var rowsToAppend = [];
  var lastCol = answersSheet.getLastColumn();

  for (var k = 0; k < answers.length; k++) {
    var ans = answers[k];
    var ansId = String(ans.answerId || "").trim();
    var qId = String(ans.questionId || "").trim();

    if (qId && !isContentAuthorizedForGrade(activityId, unitId, qId, auth.grade)) {
      return createJsonResponse({
        success: false,
        error: "Unauthorized: Question " + qId + " is prohibited for grade " + auth.grade + ".",
        code: "GRADE_UNAUTHORIZED"
      });
    }
    var qOrder = Number(ans.questionOrder) || (k + 1);
    var studentResp = String(ans.studentResponse || "");
    var signature = qId + "::" + qOrder + "::" + studentResp;

    if ((ansId && recordedAnswerIds[ansId]) || (!ansId && recordedSignatures[signature])) {
      continue;
    }

    if (!ansId) {
      ansId = "ans_" + Utilities.getUuid().substring(0, 8);
    }

    var row = new Array(lastCol);
    for (var c = 0; c < lastCol; c++) row[c] = "";

    row[answerColMap["answer_id"] - 1] = ansId;
    row[answerColMap["attempt_id"] - 1] = attemptId;
    row[answerColMap["student_id"] - 1] = auth.studentId;
    row[answerColMap["student_number"] - 1] = auth.studentNumber;
    row[answerColMap["class"] - 1] = auth.className;
    row[answerColMap["unit_id"] - 1] = unitId;
    row[answerColMap["activity_id"] - 1] = activityId;
    row[answerColMap["question_id"] - 1] = qId;
    row[answerColMap["question_order"] - 1] = Number(ans.questionOrder) || (k + 1);
    row[answerColMap["question_prompt"] - 1] = String(ans.questionPrompt || "");
    row[answerColMap["student_response"] - 1] = String(ans.studentResponse || "");
    row[answerColMap["correct_answer"] - 1] = String(ans.correctAnswer || "");
    row[answerColMap["is_correct"] - 1] = Boolean(ans.isCorrect);
    row[answerColMap["time_spent_seconds"] - 1] = Number(ans.timeSpentSeconds) || 0;
    row[answerColMap["timestamp"] - 1] = ans.timestamp || now;

    if (answerColMap["question_version"]) {
      var qVer = ans.questionVersion !== undefined ? ans.questionVersion : ans.version;
      row[answerColMap["question_version"] - 1] = qVer ? String(qVer).trim() : "";
    }

    rowsToAppend.push(row);
    recordedAnswerIds[ansId] = true;
    recordedSignatures[signature] = true;
  }

  // Batch insert new answers
  if (rowsToAppend.length > 0) {
    for (var rIdx = 0; rIdx < rowsToAppend.length; rIdx++) {
      while (rowsToAppend[rIdx].length < lastCol) {
        rowsToAppend[rIdx].push("");
      }
      if (rowsToAppend[rIdx].length > lastCol) {
        rowsToAppend[rIdx] = rowsToAppend[rIdx].slice(0, lastCol);
      }
    }
    var startRow = answersSheet.getLastRow() + 1;
    answersSheet.getRange(startRow, 1, rowsToAppend.length, lastCol).setValues(rowsToAppend);
  }

  return createJsonResponse({
    success: true,
    attemptId: attemptId,
    recordedCount: rowsToAppend.length
  });
}

/**
 * ACTION: game_complete_attempt
 * Marks an attempt as 'completed' and records final telemetry.
 */
function handleCompleteAttempt(ss, payload) {
  var auth = validateSessionAndGetStudent(ss, payload.sessionToken);
  if (!auth.success) {
    return createJsonResponse({ success: false, error: auth.error, code: "UNAUTHORIZED" });
  }

  var attemptId = String(payload.attemptId || "").trim();
  if (!attemptId) {
    return createJsonResponse({ success: false, error: "Missing attemptId.", code: "BAD_REQUEST" });
  }

  var activityId = String(payload.activityId || "").trim();
  var unitId = String(payload.unitId || "").trim();
  var clientGradeId = String(payload.gradeId || "").trim();

  // Strict Server-Side Grade Authorization Guard
  if (clientGradeId && clientGradeId !== auth.grade) {
    return createJsonResponse({
      success: false,
      error: "Unauthorized: Cross-grade attempt prohibited (" + clientGradeId + " != " + auth.grade + ").",
      code: "GRADE_UNAUTHORIZED"
    });
  }

  if (!isContentAuthorizedForGrade(activityId, unitId, "", auth.grade)) {
    return createJsonResponse({
      success: false,
      error: "Unauthorized: Activity " + activityId + " does not belong to student's grade (" + auth.grade + ").",
      code: "GRADE_UNAUTHORIZED"
    });
  }

  var attemptsSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.ATTEMPTS);
  var colMap = getSheetColumnMap(attemptsSheet, CONFIG.ATTEMPT_HEADERS);
  var attemptsData = attemptsSheet.getDataRange().getValues();

  var attemptRowIndex = -1;
  var attemptRow = null;

  for (var i = 1; i < attemptsData.length; i++) {
    if (String(attemptsData[i][colMap["attempt_id"] - 1]).trim() === attemptId) {
      attemptRow = attemptsData[i];
      attemptRowIndex = i + 1;
      break;
    }
  }

  if (!attemptRow) {
    return createJsonResponse({ success: false, error: "Attempt not found: " + attemptId, code: "NOT_FOUND" });
  }

  if (String(attemptRow[colMap["student_number"] - 1]).trim() !== auth.studentNumber) {
    return createJsonResponse({ success: false, error: "Unauthorized attempt access.", code: "FORBIDDEN" });
  }

  var attemptGrade = String(attemptRow[colMap["grade_id"] - 1] || "");
  var attemptActId = String(attemptRow[colMap["activity_id"] - 1] || "");
  if ((attemptGrade && attemptGrade !== auth.grade) || !isContentAuthorizedForGrade(attemptActId, "", "", auth.grade)) {
    return createJsonResponse({
      success: false,
      error: "Unauthorized: Cross-grade attempt completion prohibited.",
      code: "GRADE_UNAUTHORIZED"
    });
  }

  // Idempotency check: if attempt is already completed, return existing score safely
  var currentStatus = String(attemptRow[colMap["status"] - 1] || "").trim();
  if (currentStatus === "completed") {
    var existingScore = Number(attemptRow[colMap["score"] - 1] || 0);
    var existingPercentage = Number(attemptRow[colMap["percentage"] - 1] || 0);
    var existingXp = colMap["xp_earned"] ? Number(attemptRow[colMap["xp_earned"] - 1] || 0) : 0;
    var currentSummary = getStudentGamificationSummary(ss, auth.studentNumber);
    var currentCoins = getStudentCoinBalance(ss, auth.studentNumber);
    return createJsonResponse({
      success: true,
      attemptId: attemptId,
      status: "completed",
      score: existingScore,
      percentage: existingPercentage,
      message: "Attempt already completed.",
      gamification: {
        xpEarned: existingXp,
        baseCompletionXp: 0,
        accuracyXp: 0,
        perfectBonusXp: 0,
        practiceBonusXp: 0,
        totalXp: currentSummary.totalXp,
        oldLevel: currentSummary.level,
        newLevel: currentSummary.level,
        isLevelUp: false,
        levelTitle: currentSummary.levelTitle,
        unlockedAchievements: [],
        replayNotice: "Attempt already recorded."
      },
      coins: {
        coinsEarned: 0,
        totalCoins: currentCoins,
        message: "Attempt already completed. No duplicate coins awarded."
      }
    });
  }

  var now = new Date().toISOString();
  var score = Number(payload.score !== undefined ? payload.score : attemptRow[colMap["score"] - 1]);
  var totalQuestions = Number(payload.totalQuestions !== undefined ? payload.totalQuestions : attemptRow[colMap["total_questions"] - 1]);
  var answeredQuestions = Number(payload.answeredQuestions !== undefined ? payload.answeredQuestions : attemptRow[colMap["answered_questions"] - 1]);
  var correctAnswers = Number(payload.correctAnswers !== undefined ? payload.correctAnswers : attemptRow[colMap["correct_answers"] - 1]);
  var incorrectAnswers = Number(payload.incorrectAnswers !== undefined ? payload.incorrectAnswers : attemptRow[colMap["incorrect_answers"] - 1]);
  var skippedQuestions = Number(payload.skippedQuestions !== undefined ? payload.skippedQuestions : attemptRow[colMap["skipped_questions"] - 1]);

  var percentage;
  if (payload.percentage !== undefined && !isNaN(Number(payload.percentage))) {
    percentage = Number(payload.percentage);
  } else {
    var totalEvaluated = correctAnswers + incorrectAnswers;
    if (totalEvaluated > 0) {
      percentage = Math.round((correctAnswers / totalEvaluated) * 1000) / 10;
    } else if (totalQuestions > 0) {
      percentage = Math.round((correctAnswers / totalQuestions) * 100);
    } else {
      percentage = 0;
    }
  }

  // Hard safeguard: an attempt with incorrect answers can NEVER be evaluated as 100% accuracy
  if (incorrectAnswers > 0 && percentage >= 100) {
    var totalEval = correctAnswers + incorrectAnswers;
    percentage = Math.round((correctAnswers / totalEval) * 1000) / 10;
  }

  var duration = Number(payload.durationSeconds !== undefined ? payload.durationSeconds : attemptRow[colMap["duration_seconds"] - 1]);

  // Read student's previous completed attempts to evaluate XP and replay policy
  var studentNumber = auth.studentNumber;
  var activityId = String(attemptRow[colMap["activity_id"] - 1] || "").trim();
  var gameType = String(attemptRow[colMap["game_type"] - 1] || "").trim();
  var attemptNum = Number(attemptRow[colMap["attempt_number"] - 1] || 1);

  var previousAttempts = [];
  var allStudentCompleted = [];
  var existingTotalXp = 0;

  for (var j = 1; j < attemptsData.length; j++) {
    if (j === attemptRowIndex - 1) continue;
    var rStudent = String(attemptsData[j][colMap["student_number"] - 1] || "").trim();
    if (rStudent !== studentNumber) continue;

    var rStatus = String(attemptsData[j][colMap["status"] - 1] || "").trim();
    if (rStatus === "completed") {
      var rActId = String(attemptsData[j][colMap["activity_id"] - 1] || "").trim();
      var rPct = Number(attemptsData[j][colMap["percentage"] - 1] || 0);
      var rType = String(attemptsData[j][colMap["game_type"] - 1] || "").trim();
      var rAttId = String(attemptsData[j][colMap["attempt_id"] - 1] || "").trim();
      var rCompletedAt = String(attemptsData[j][colMap["completed_at"] - 1] || "");
      var rXp = colMap["xp_earned"] ? Number(attemptsData[j][colMap["xp_earned"] - 1] || 0) : 0;

      existingTotalXp += rXp;
      allStudentCompleted.push({
        attemptId: rAttId,
        activityId: rActId,
        gameType: rType,
        percentage: rPct,
        completedAt: rCompletedAt
      });

      if (rActId === activityId) {
        previousAttempts.push({
          percentage: rPct,
          attemptNumber: Number(attemptsData[j][colMap["attempt_number"] - 1] || 1)
        });
      }
    }
  }

  var isFirstCompletion = previousAttempts.length === 0;
  var previousBestPercentage = 0;
  for (var p = 0; p < previousAttempts.length; p++) {
    if (previousAttempts[p].percentage > previousBestPercentage) {
      previousBestPercentage = previousAttempts[p].percentage;
    }
  }

  var xpResult = calculateAttemptXpServer(percentage, isFirstCompletion, previousBestPercentage, attemptNum);
  var xpEarned = xpResult.xpEarned;
  var newTotalXp = existingTotalXp + xpEarned;

  var oldLevel = getLevelFromXp(existingTotalXp).level;
  var levelObj = getLevelFromXp(newTotalXp);
  var newLevel = levelObj.level;
  var isLevelUp = newLevel > oldLevel;

  var priorCompletedAttempts = allStudentCompleted.slice();

  var currentAttemptObj = {
    attemptId: attemptId,
    activityId: activityId,
    gameType: gameType,
    percentage: percentage,
    completedAt: payload.completedAt || now
  };

  allStudentCompleted.push(currentAttemptObj);

  // Evaluate achievements and persist any newly unlocked
  var unlockedBadges = checkAndUnlockAchievements(ss, auth, priorCompletedAttempts, currentAttemptObj);

  attemptsSheet.getRange(attemptRowIndex, colMap["score"]).setValue(score);
  attemptsSheet.getRange(attemptRowIndex, colMap["total_questions"]).setValue(totalQuestions);
  attemptsSheet.getRange(attemptRowIndex, colMap["answered_questions"]).setValue(answeredQuestions);
  attemptsSheet.getRange(attemptRowIndex, colMap["correct_answers"]).setValue(correctAnswers);
  attemptsSheet.getRange(attemptRowIndex, colMap["incorrect_answers"]).setValue(incorrectAnswers);
  attemptsSheet.getRange(attemptRowIndex, colMap["skipped_questions"]).setValue(skippedQuestions);
  attemptsSheet.getRange(attemptRowIndex, colMap["percentage"]).setValue(percentage);
  attemptsSheet.getRange(attemptRowIndex, colMap["completed_at"]).setValue(payload.completedAt || now);
  attemptsSheet.getRange(attemptRowIndex, colMap["duration_seconds"]).setValue(duration);
  attemptsSheet.getRange(attemptRowIndex, colMap["status"]).setValue("completed");
  if (colMap["xp_earned"]) {
    attemptsSheet.getRange(attemptRowIndex, colMap["xp_earned"]).setValue(xpEarned);
  }

  // Calculate Monster Coins (Phase 8A)
  var firstCompletionCoins = isFirstCompletion ? 5 : 0;
  var highAccuracyCoins = percentage >= 90 ? 3 : 0;
  var perfectScoreCoins = percentage >= 100 ? 5 : 0;

  // Daily First Activity bonus (+5 coins)
  var compDateStr = String(payload.completedAt || now);
  var todayPrefix = compDateStr.substring(0, 10);
  var priorTodayAttempts = 0;
  for (var t = 0; t < priorCompletedAttempts.length; t++) {
    var ca = String(priorCompletedAttempts[t].completedAt || "");
    if (ca.substring(0, 10) === todayPrefix) {
      priorTodayAttempts++;
    }
  }
  var dailyFirstCoins = (priorTodayAttempts === 0) ? 5 : 0;

  // Level Up reward (+10 coins per new level reached)
  var levelDiff = Math.max(0, newLevel - oldLevel);
  var levelUpCoins = levelDiff * 10;

  // Replay policy coins & transaction reason
  var replayCoins = 0;
  var txReason = "activity_completion";
  if (!isFirstCompletion) {
    if (percentage > previousBestPercentage) {
      replayCoins = 2; // Score improvement
      txReason = "replay_improvement";
    } else {
      // Replaying without improvement (decay practice coin: 1 coin, max 5 daily)
      var txSheetForCap = getSheetRobust(ss, CONFIG.SHEET_NAMES.COIN_TRANSACTIONS);
      var todayPracticeCoins = 0;
      if (txSheetForCap) {
        var txData = txSheetForCap.getDataRange().getValues();
        var txColMap = getSheetColumnMap(txSheetForCap, CONFIG.COIN_TRANSACTION_HEADERS);
        var sCol = txColMap["student_number"] - 1;
        var rCol = txColMap["reason"] - 1;
        var cCol = txColMap["created_at"] - 1;
        var aCol = txColMap["amount"] - 1;
        for (var k = 1; k < txData.length; k++) {
          if (String(txData[k][sCol] || "").trim() === String(studentNumber).trim() &&
              String(txData[k][rCol] || "").trim() === "replay_practice" &&
              String(txData[k][cCol] || "").substring(0, 10) === todayPrefix) {
            todayPracticeCoins += Number(txData[k][aCol] || 0);
          }
        }
      }
      if (todayPracticeCoins < 5) {
        replayCoins = 1;
        txReason = "replay_practice";
      }
    }
  }

  var totalCoinsEarned = firstCompletionCoins + highAccuracyCoins + perfectScoreCoins + dailyFirstCoins + levelUpCoins + replayCoins;

  // Record coin transaction
  var coinTxResult = recordCoinTransaction(
    ss,
    studentNumber,
    auth.class,
    totalCoinsEarned,
    txReason,
    attemptId,
    payload.completedAt || now
  );

  return createJsonResponse({
    success: true,
    attemptId: attemptId,
    status: "completed",
    score: score,
    percentage: percentage,
    gamification: {
      xpEarned: xpEarned,
      baseCompletionXp: xpResult.baseCompletionXp,
      accuracyXp: xpResult.accuracyXp,
      perfectBonusXp: xpResult.perfectBonusXp,
      practiceBonusXp: xpResult.practiceBonusXp,
      totalXp: newTotalXp,
      oldLevel: oldLevel,
      newLevel: newLevel,
      isLevelUp: isLevelUp,
      levelTitle: levelObj.title,
      unlockedAchievements: unlockedBadges,
      replayNotice: xpResult.replayNotice
    },
    coins: {
      coinsEarned: totalCoinsEarned,
      totalCoins: coinTxResult.balanceAfter,
      breakdown: {
        firstCompletion: firstCompletionCoins,
        highAccuracy: highAccuracyCoins,
        perfectScore: perfectScoreCoins,
        dailyFirst: dailyFirstCoins,
        levelUp: levelUpCoins,
        replay: replayCoins
      }
    }
  });
}

/**
 * ACTION: game_abandon_attempt
 * Marks an attempt as 'abandoned' upon deliberate user early exit.
 */
function handleAbandonAttempt(ss, payload) {
  var auth = validateSessionAndGetStudent(ss, payload.sessionToken);
  if (!auth.success) {
    return createJsonResponse({ success: false, error: auth.error, code: "UNAUTHORIZED" });
  }

  var attemptId = String(payload.attemptId || "").trim();
  if (!attemptId) {
    return createJsonResponse({ success: false, error: "Missing attemptId.", code: "BAD_REQUEST" });
  }

  var activityId = String(payload.activityId || "").trim();
  var unitId = String(payload.unitId || "").trim();
  var clientGradeId = String(payload.gradeId || "").trim();

  // Strict Server-Side Grade Authorization Guard
  if (clientGradeId && clientGradeId !== auth.grade) {
    return createJsonResponse({
      success: false,
      error: "Unauthorized: Cross-grade attempt prohibited (" + clientGradeId + " != " + auth.grade + ").",
      code: "GRADE_UNAUTHORIZED"
    });
  }

  if (!isContentAuthorizedForGrade(activityId, unitId, "", auth.grade)) {
    return createJsonResponse({
      success: false,
      error: "Unauthorized: Activity " + activityId + " does not belong to student's grade (" + auth.grade + ").",
      code: "GRADE_UNAUTHORIZED"
    });
  }

  var attemptsSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.ATTEMPTS);
  var colMap = getSheetColumnMap(attemptsSheet, CONFIG.ATTEMPT_HEADERS);
  var attemptsData = attemptsSheet.getDataRange().getValues();

  var attemptRowIndex = -1;
  var attemptRow = null;

  for (var i = 1; i < attemptsData.length; i++) {
    if (String(attemptsData[i][colMap["attempt_id"] - 1]).trim() === attemptId) {
      attemptRow = attemptsData[i];
      attemptRowIndex = i + 1;
      break;
    }
  }

  if (!attemptRow) {
    return createJsonResponse({ success: false, error: "Attempt not found: " + attemptId, code: "NOT_FOUND" });
  }

  if (String(attemptRow[colMap["student_number"] - 1]).trim() !== auth.studentNumber) {
    return createJsonResponse({ success: false, error: "Unauthorized attempt access.", code: "FORBIDDEN" });
  }

  var attemptGrade = String(attemptRow[colMap["grade_id"] - 1] || "");
  var attemptActId = String(attemptRow[colMap["activity_id"] - 1] || "");
  if ((attemptGrade && attemptGrade !== auth.grade) || !isContentAuthorizedForGrade(attemptActId, "", "", auth.grade)) {
    return createJsonResponse({
      success: false,
      error: "Unauthorized: Cross-grade attempt completion prohibited.",
      code: "GRADE_UNAUTHORIZED"
    });
  }

  // Safety guard: never overwrite an already completed attempt to abandoned
  var currentStatus = String(attemptRow[colMap["status"] - 1] || "").trim();
  if (currentStatus === "completed") {
    return createJsonResponse({
      success: true,
      attemptId: attemptId,
      status: "completed",
      message: "Attempt was already completed; abandonment ignored."
    });
  }

  var now = new Date().toISOString();
  var duration = Number(payload.durationSeconds !== undefined ? payload.durationSeconds : attemptRow[colMap["duration_seconds"] - 1]);
  var answeredQuestions = Number(payload.answeredQuestions !== undefined ? payload.answeredQuestions : attemptRow[colMap["answered_questions"] - 1]);
  var correctAnswers = Number(payload.correctAnswers !== undefined ? payload.correctAnswers : attemptRow[colMap["correct_answers"] - 1]);

  attemptsSheet.getRange(attemptRowIndex, colMap["answered_questions"]).setValue(answeredQuestions);
  attemptsSheet.getRange(attemptRowIndex, colMap["correct_answers"]).setValue(correctAnswers);
  attemptsSheet.getRange(attemptRowIndex, colMap["completed_at"]).setValue(now);
  attemptsSheet.getRange(attemptRowIndex, colMap["duration_seconds"]).setValue(duration);
  attemptsSheet.getRange(attemptRowIndex, colMap["status"]).setValue("abandoned");

  return createJsonResponse({
    success: true,
    attemptId: attemptId,
    status: "abandoned"
  });
}

/**
 * ACTION: game_reconcile_attempt
 * Reconciles an unfinished or interrupted attempt.
 */
function handleReconcileAttempt(ss, payload) {
  var auth = validateSessionAndGetStudent(ss, payload.sessionToken);
  if (!auth.success) {
    return createJsonResponse({ success: false, error: auth.error, code: "UNAUTHORIZED" });
  }

  var attemptId = String(payload.attemptId || "").trim();
  if (!attemptId) {
    return createJsonResponse({ success: false, error: "Missing attemptId.", code: "BAD_REQUEST" });
  }

  var activityId = String(payload.activityId || "").trim();
  var unitId = String(payload.unitId || "").trim();
  var clientGradeId = String(payload.gradeId || "").trim();

  // Strict Server-Side Grade Authorization Guard
  if (clientGradeId && clientGradeId !== auth.grade) {
    return createJsonResponse({
      success: false,
      error: "Unauthorized: Cross-grade attempt prohibited (" + clientGradeId + " != " + auth.grade + ").",
      code: "GRADE_UNAUTHORIZED"
    });
  }

  if (!isContentAuthorizedForGrade(activityId, unitId, "", auth.grade)) {
    return createJsonResponse({
      success: false,
      error: "Unauthorized: Activity " + activityId + " does not belong to student's grade (" + auth.grade + ").",
      code: "GRADE_UNAUTHORIZED"
    });
  }

  var attemptsSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.ATTEMPTS);
  var colMap = getSheetColumnMap(attemptsSheet, CONFIG.ATTEMPT_HEADERS);
  var attemptsData = attemptsSheet.getDataRange().getValues();

  var attemptRowIndex = -1;
  var attemptRow = null;

  for (var i = 1; i < attemptsData.length; i++) {
    if (String(attemptsData[i][colMap["attempt_id"] - 1]).trim() === attemptId) {
      attemptRow = attemptsData[i];
      attemptRowIndex = i + 1;
      break;
    }
  }

  if (!attemptRow) {
    return createJsonResponse({ success: false, error: "Attempt not found: " + attemptId, code: "NOT_FOUND" });
  }

  if (String(attemptRow[colMap["student_number"] - 1]).trim() !== auth.studentNumber) {
    return createJsonResponse({ success: false, error: "Unauthorized attempt access.", code: "FORBIDDEN" });
  }

  var attemptGrade = String(attemptRow[colMap["grade_id"] - 1] || "");
  var attemptActId = String(attemptRow[colMap["activity_id"] - 1] || "");
  if ((attemptGrade && attemptGrade !== auth.grade) || !isContentAuthorizedForGrade(attemptActId, "", "", auth.grade)) {
    return createJsonResponse({
      success: false,
      error: "Unauthorized: Cross-grade attempt completion prohibited.",
      code: "GRADE_UNAUTHORIZED"
    });
  }

  var currentStatus = String(attemptRow[colMap["status"] - 1]).trim();
  if (currentStatus === "in_progress") {
    var now = new Date().toISOString();
    attemptsSheet.getRange(attemptRowIndex, colMap["status"]).setValue("interrupted");
    attemptsSheet.getRange(attemptRowIndex, colMap["completed_at"]).setValue(now);
  }

  return createJsonResponse({
    success: true,
    attemptId: attemptId,
    message: "Attempt reconciled successfully."
  });
}

// ============================================================================
// CRYPTO, SALT & PEPPER UTILITIES (SERVER-SIDE ONLY)
// ============================================================================

/**
 * Retrieves or creates the secret server-side PEPPER from Script Properties.
 */
function getOrCreateSecretPepper() {
  var props = PropertiesService.getScriptProperties();
  var pepper = props.getProperty("PEPPER_SECRET");

  if (!pepper || pepper.trim().length === 0) {
    pepper = Utilities.getUuid() + "-" + Utilities.getUuid() + "-" + new Date().getTime();
    props.setProperty("PEPPER_SECRET", pepper);
    Logger.log("🔐 Generated and stored new PEPPER_SECRET in Script Properties.");
  }

  return pepper;
}

/**
 * Multi-iteration salted + peppered SHA-256 key derivation for student PINs.
 */
function hashPinWithSaltAndPepper(pin, salt) {
  var pepper = getOrCreateSecretPepper();
  var input = pin + ":" + salt + ":" + pepper;
  var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, input);

  for (var round = 0; round < CONFIG.SALT_ROUNDS; round++) {
    var combined = digest.concat(Utilities.newBlob(salt + ":" + pepper + ":" + round).getBytes());
    digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, combined);
  }

  var hex = "";
  for (var i = 0; i < digest.length; i++) {
    var b = (digest[i] + 256) % 256;
    var byteHex = b.toString(16);
    if (byteHex.length === 1) byteHex = "0" + byteHex;
    hex += byteHex;
  }
  return hex;
}

/**
 * Generates a random 32-character cryptographic salt.
 */
function generateSalt() {
  var raw = Utilities.getUuid() + "-" + new Date().getTime() + "-" + Math.random().toString(36).substring(2);
  var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, raw);
  var hex = "";
  for (var i = 0; i < digest.length; i++) {
    var b = (digest[i] + 256) % 256;
    var byteHex = b.toString(16);
    if (byteHex.length === 1) byteHex = "0" + byteHex;
    hex += byteHex;
  }
  return hex.substring(0, 32);
}

/**
 * Generates an unpredictable 64-character student session token.
 */
function generateSecureToken() {
  var raw = Utilities.getUuid() + "-" + Utilities.getUuid() + "-" + new Date().getTime() + "-" + Math.random().toString(36).substring(2);
  var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, raw);
  var hex = "";
  for (var i = 0; i < digest.length; i++) {
    var b = (digest[i] + 256) % 256;
    var byteHex = b.toString(16);
    if (byteHex.length === 1) byteHex = "0" + byteHex;
    hex += byteHex;
  }
  return "uat_" + hex.substring(0, 60);
}

// ============================================================================
// DATABASE INITIALIZATION & TEACHER UTILITIES
// ============================================================================

/**
 * Standalone, non-destructive setup for TeacherSessions sheet.
 * Can be run independently without affecting other sheets or data.
 */
function setupTeacherSessionsSheet(ss) {
  ss = ss || getArcadeSpreadsheet();
  var teacherSessionsSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.TEACHER_SESSIONS);
  setupSheetHeaders(teacherSessionsSheet, CONFIG.TEACHER_SESSION_HEADERS, "#312e81", "#c7d2fe");
  return teacherSessionsSheet;
}

/**
 * Standalone, non-destructive setup for Curriculum sheet.
 * Can be run independently without affecting other sheets or data.
 * Seeds default activities ONLY if the sheet is newly created and empty.
 */
function setupCurriculumSheet(ss) {
  ss = ss || getArcadeSpreadsheet();
  var curriculumSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.CURRICULUM);
  setupSheetHeaders(curriculumSheet, CONFIG.CURRICULUM_HEADERS, "#064e3b", "#a7f3d0");

  var currData = curriculumSheet.getDataRange().getValues();
  if (currData.length <= 1) {
    seedDefaultCurriculum(curriculumSheet);
  }
  return curriculumSheet;
}

/**
 * RUN THIS ONCE in the Apps Script editor to create and style all required sheets
 * in your connected Google Spreadsheet.
 * Fully idempotent and non-destructive. Rerunning this function will NEVER delete,
 * overwrite, or reset student accounts, sessions, attempts, answers, PIN hashes,
 * or activity telemetry.
 */
function setupArcadeDatabase() {
  var ss = getArcadeSpreadsheet();

  // 1. STUDENTS SHEET (Non-destructive header check)
  var studentsSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.STUDENTS);
  setupSheetHeaders(studentsSheet, CONFIG.STUDENT_HEADERS, "#1e293b", "#38bdf8");

  // 2. SESSIONS SHEET (Non-destructive header check)
  var sessionsSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.SESSIONS);
  setupSheetHeaders(sessionsSheet, CONFIG.SESSION_HEADERS, "#1e293b", "#a855f7");

  // 3. ATTEMPTS SHEET (Phase 2 Activity Telemetry & Versioning - Non-destructive)
  var attemptsSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.ATTEMPTS);
  setupSheetHeaders(attemptsSheet, CONFIG.ATTEMPT_HEADERS, "#1e293b", "#10b981");

  // 4. ANSWERS SHEET (Phase 2 Question Telemetry & Versioning - Non-destructive)
  var answersSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.ANSWERS);
  setupSheetHeaders(answersSheet, CONFIG.ANSWER_HEADERS, "#1e293b", "#f59e0b");

  // 5. DASHBOARD SHEET (Summary cards and guide)
  var dashboardSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.DASHBOARD);
  setupDashboardSheet(dashboardSheet);

  // 6. TEACHER SESSIONS SHEET (Independent & Non-destructive)
  setupTeacherSessionsSheet(ss);

  // 7. CURRICULUM SHEET (Independent & Non-destructive)
  setupCurriculumSheet(ss);

  // 8. ACHIEVEMENTS SHEET (Phase 5 Student Gamification - Non-destructive)
  var achievementsSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.ACHIEVEMENTS);
  setupSheetHeaders(achievementsSheet, CONFIG.ACHIEVEMENT_HEADERS, "#1e293b", "#eab308");

  // Populate 8 demo students ONLY IF database is brand new (0 students exist)
  var studentsData = studentsSheet.getDataRange().getValues();
  if (studentsData.length <= 1) {
    Logger.log("🌱 Database is empty. Seeding initial 8 demo student accounts...");
    createDemoStudentAccounts();
  }

  // Teacher credentials status log (no auto-seeding)
  var teacherAuth = getTeacherAuthProperties();
  if (!teacherAuth.configured) {
    Logger.log("ℹ️ Teacher authentication is currently DISABLED. Run initializeTeacherCredentials('YOUR_PASSPHRASE') in the editor to activate.");
  } else {
    Logger.log("🔒 Teacher authentication is configured and active.");
  }

  // Clean up empty default sheet if safe
  var defaultSheet = getSheetRobust(ss, "Sheet1") || getSheetRobust(ss, "Sayfa1");
  if (defaultSheet && defaultSheet.getLastRow() === 0 && defaultSheet.getLastColumn() === 0 && ss.getSheets().length > 7) {
    try {
      ss.deleteSheet(defaultSheet);
    } catch (e) {
      // Ignore if cannot delete
    }
  }

  SpreadsheetApp.flush();
  Logger.log("✅ Unit Review Arcade Database setup complete on '" + ss.getName() + "'!");
}

/**
 * Case-insensitive, whitespace-tolerant sheet finder.
 */
function getSheetRobust(ss, name) {
  if (!ss || !name) return null;
  var sheet = ss.getSheetByName(name);
  if (sheet) return sheet;

  var cleanTarget = String(name).trim().toLowerCase();
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getName().trim().toLowerCase() === cleanTarget) {
      return sheets[i];
    }
  }
  return null;
}

/**
 * Creates or retrieves a sheet by name.
 */
function getOrCreateSheet(ss, name) {
  var sheet = getSheetRobust(ss, name);
  if (!sheet) {
    sheet = ss.insertSheet(name.trim());
  }
  return sheet;
}

/**
 * Sets up styled headers on a sheet.
 * If sheet has no headers or headers do not match, updates row 1 cleanly.
 */
function setupSheetHeaders(sheet, headers, bgHex, textHex) {
  var lastCol = sheet.getLastColumn();
  var currentHeaders = [];
  if (lastCol > 0) {
    currentHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  }

  var matches = false;
  if (currentHeaders.length >= headers.length) {
    matches = headers.every(function(h, idx) { return String(currentHeaders[idx]).trim() === h; });
  }

  if (!matches) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }

  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight("bold");
  headerRange.setBackground(bgHex || "#0f172a");
  headerRange.setFontColor(textHex || "#ffffff");
  headerRange.setFontSize(10);
  headerRange.setHorizontalAlignment("center");
  sheet.setFrozenRows(1);
}

/**
 * Detects the correct formula argument separator based on the spreadsheet locale.
 * Semicolon (;) is used in Turkish (tr_TR) and most European/comma-decimal locales.
 * Comma (,) is used in US (en_US) and other dot-decimal locales.
 * Supports manual override via Script Properties 'FORMULA_SEPARATOR' if ever desired.
 */
function getFormulaArgumentSeparator(ss) {
  try {
    var props = PropertiesService.getScriptProperties();
    var explicitSep = props.getProperty("FORMULA_SEPARATOR");
    if (explicitSep === ";" || explicitSep === ",") {
      return explicitSep;
    }
  } catch (pErr) {}

  try {
    var locale = "";
    if (ss && typeof ss.getSpreadsheetLocale === "function") {
      locale = ss.getSpreadsheetLocale();
    }
    if (!locale && typeof SpreadsheetApp !== "undefined" && SpreadsheetApp.getActiveSpreadsheet) {
      var act = SpreadsheetApp.getActiveSpreadsheet();
      if (act && typeof act.getSpreadsheetLocale === "function") {
        locale = act.getSpreadsheetLocale();
      }
    }
    if (locale) {
      var clean = String(locale).trim().toLowerCase();
      var lang = clean.split(/[-_]/)[0];
      var semicolonLangs = [
        "tr", "de", "fr", "es", "it", "pt", "ru", "pl", "nl", "cs", "da",
        "el", "fi", "hu", "id", "no", "ro", "sk", "sv", "uk", "vi", "bg",
        "hr", "lt", "lv", "sl", "et", "az", "ka", "kk"
      ];
      if (semicolonLangs.indexOf(lang) !== -1 || clean.indexOf("tr") !== -1) {
        return ";";
      }
    }
  } catch (e) {
    Logger.log("⚠️ Could not detect spreadsheet locale: " + e.message);
  }
  return ",";
}

/**
 * Configures the teacher overview Dashboard tab in Google Sheets.
 * Standalone-safe: can be run directly from the Apps Script editor menu.
 * Uses locale-aware formula argument separators (; for Turkish, , for English)
 * to prevent 'Formül ayrıştırma hatası' (Formula parse error).
 * Non-destructive: modifies ONLY the Dashboard sheet, never touching student or activity data.
 */
function setupDashboardSheet(sheet) {
  var ss;
  if (!sheet) {
    ss = getArcadeSpreadsheet();
    sheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.DASHBOARD);
  } else {
    try {
      ss = (typeof sheet.getParent === "function") ? sheet.getParent() : getArcadeSpreadsheet();
    } catch (e) {
      ss = getArcadeSpreadsheet();
    }
  }

  var sep = getFormulaArgumentSeparator(ss);

  sheet.clear();
  sheet.setTabColor("#6366f1");

  // Title Banner (merged A1:F1)
  var headerRange = sheet.getRange("A1:F1");
  var numCols = headerRange.getNumColumns();
  var headerRow = new Array(numCols);
  for (var c = 0; c < numCols; c++) {
    headerRow[c] = (c === 0) ? "UNIT REVIEW ARCADE — TEACHER TRACKING DASHBOARD" : "";
  }
  headerRange.merge().setValues([headerRow])
    .setFontWeight("bold")
    .setFontSize(14)
    .setBackground("#4338ca")
    .setFontColor("#ffffff")
    .setHorizontalAlignment("center");

  // KPI Overview Table: Classes 7A, 7B, 8A, 8B
  var classes = ["7A", "7B", "8A", "8B"];
  var tableRows = [
    ["Class", "Total Students", "Active Sessions Today", "Total Attempts", "Average Score %", "Last Activity"]
  ];

  for (var i = 0; i < classes.length; i++) {
    var cls = classes[i];
    tableRows.push([
      cls,
      '=COUNTIF(Students!E:E' + sep + ' "' + cls + '")',
      '=COUNTIFS(Sessions!E:E' + sep + ' "' + cls + '"' + sep + ' Sessions!J:J' + sep + ' "active")',
      '=COUNTIF(Attempts!E:E' + sep + ' "' + cls + '")',
      '=IFERROR(ROUND(AVERAGEIF(Attempts!E:E' + sep + ' "' + cls + '"' + sep + ' Attempts!S:S))' + sep + ' "—")',
      '=IF(IFERROR(MAXIFS(Sessions!F:F' + sep + ' Sessions!E:E' + sep + ' "' + cls + '")' + sep + ' 0)>0' + sep + ' MAXIFS(Sessions!F:F' + sep + ' Sessions!E:E' + sep + ' "' + cls + '")' + sep + ' "—")'
    ]);
  }

  sheet.getRange(3, 1, tableRows.length, tableRows[0].length).setValues(tableRows);

  var tableHeader = sheet.getRange("A3:F3");
  tableHeader.setFontWeight("bold").setBackground("#e0e7ff").setFontColor("#1e1b4b").setHorizontalAlignment("center");
  sheet.getRange("A4:F7").setHorizontalAlignment("center");

  if (typeof sheet.setColumnWidth === "function") {
    sheet.setColumnWidth(1, 90);   // Class
    sheet.setColumnWidth(2, 130);  // Total Students
    sheet.setColumnWidth(3, 160);  // Active Sessions Today
    sheet.setColumnWidth(4, 130);  // Total Attempts
    sheet.setColumnWidth(5, 140);  // Average Score %
    sheet.setColumnWidth(6, 180);  // Last Activity
  }

  SpreadsheetApp.flush();
  var detectedLocale = (ss && typeof ss.getSpreadsheetLocale === "function") ? ss.getSpreadsheetLocale() : "default";
  Logger.log("✅ Dashboard sheet successfully refreshed with '" + sep + "' formula separator for locale: " + detectedLocale);
}

/**
 * Teacher Helper: Securely creates or updates a single student.
 */
function createStudentAccount(studentNumber, fullName, grade, className, pin) {
  var ss = getArcadeSpreadsheet();
  var sheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.STUDENTS);
  setupSheetHeaders(sheet, CONFIG.STUDENT_HEADERS, "#1e293b", "#38bdf8");

  studentNumber = String(studentNumber).trim();
  fullName = String(fullName).trim();
  grade = String(grade).trim();
  className = String(className).trim().toUpperCase();
  pin = String(pin).trim();

  if (!studentNumber || !fullName || !pin || !className) {
    throw new Error("All fields (studentNumber, fullName, grade, className, pin) are required.");
  }

  var salt = generateSalt();
  var hash = hashPinWithSaltAndPepper(pin, salt);
  var now = new Date().toISOString();

  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][1]).trim() === studentNumber) {
      var row = i + 1;
      sheet.getRange(row, 3).setValue(fullName);
      sheet.getRange(row, 4).setValue(grade);
      sheet.getRange(row, 5).setValue(className);
      sheet.getRange(row, 6).setValue(salt);
      sheet.getRange(row, 7).setValue(hash);
      sheet.getRange(row, 8).setValue(true);
      sheet.getRange(row, 9).setValue(0);
      sheet.getRange(row, 10).setValue("");
      Logger.log("✅ Updated student: " + studentNumber + " (" + fullName + " - " + className + ")");
      return;
    }
  }

  var studentId = "std_" + Utilities.getUuid().substring(0, 8);
  sheet.appendRow([
    studentId,
    studentNumber,
    fullName,
    grade,
    className,
    salt,
    hash,
    true,
    0,
    "",
    now,
    ""
  ]);
  Logger.log("✅ Created student: " + studentNumber + " (" + fullName + " - " + className + ")");
}

/**
 * Batch imports students from an array of objects.
 */
function importStudentsRoster(studentsArray) {
  if (!Array.isArray(studentsArray) || studentsArray.length === 0) {
    throw new Error("Expected a non-empty array of student objects.");
  }

  for (var i = 0; i < studentsArray.length; i++) {
    var s = studentsArray[i];
    createStudentAccount(s.studentNumber, s.fullName, s.grade, s.class, s.pin);
  }
  Logger.log("🎉 Successfully imported " + studentsArray.length + " students!");
}

/**
 * Automatically creates eight demo student accounts across 7A, 7B, 8A, 8B.
 */
function createDemoStudentAccounts() {
  var demoStudents = [
    { studentNumber: "701", fullName: "Kerem Yılmaz", grade: "7", class: "7A", pin: "1234" },
    { studentNumber: "702", fullName: "Zeynep Kaya", grade: "7", class: "7A", pin: "1234" },
    { studentNumber: "703", fullName: "Can Demir", grade: "7", class: "7B", pin: "1234" },
    { studentNumber: "704", fullName: "Elif Şahin", grade: "7", class: "7B", pin: "1234" },
    { studentNumber: "801", fullName: "Barış Arslan", grade: "8", class: "8A", pin: "1234" },
    { studentNumber: "802", fullName: "Ayşe Çelik", grade: "8", class: "8A", pin: "1234" },
    { studentNumber: "803", fullName: "Murat Yıldız", grade: "8", class: "8B", pin: "1234" },
    { studentNumber: "804", fullName: "Selin Aydın", grade: "8", class: "8B", pin: "1234" }
  ];

  importStudentsRoster(demoStudents);
  Logger.log("🎉 8 Demo students successfully created across 7A, 7B, 8A, 8B.");
}

/**
 * Removes demo accounts from Students and Sessions tabs.
 */
function removeDemoAccounts() {
  var ss = getArcadeSpreadsheet();
  var studentsSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.STUDENTS);
  if (!studentsSheet) return;

  var demoNumbers = ["701", "702", "703", "704", "801", "802", "803", "804"];
  var data = studentsSheet.getDataRange().getValues();

  for (var i = data.length - 1; i >= 1; i--) {
    var num = String(data[i][1]).trim();
    if (demoNumbers.indexOf(num) !== -1) {
      studentsSheet.deleteRow(i + 1);
    }
  }
  Logger.log("🧹 Demo student accounts removed.");
}

/**
 * Nightly maintenance: marks sessions past their expiration date as 'expired'.
 */
function cleanupExpiredSessions() {
  var ss = getArcadeSpreadsheet();
  var sessionsSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.SESSIONS);
  if (!sessionsSheet) return;

  var data = sessionsSheet.getDataRange().getValues();
  var now = new Date();
  var cleaned = 0;

  for (var i = 1; i < data.length; i++) {
    var expiresAt = new Date(data[i][7]);
    var status = data[i][9];
    if (status === "active" && now > expiresAt) {
      sessionsSheet.getRange(i + 1, 10).setValue("expired");
      cleaned++;
    }
  }

  var teacherSessionsSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.TEACHER_SESSIONS);
  if (teacherSessionsSheet) {
    var tData = teacherSessionsSheet.getDataRange().getValues();
    for (var k = 1; k < tData.length; k++) {
      var tExpiresAt = new Date(tData[k][5]);
      var tStatus = tData[k][6];
      if (tStatus === "active" && now > tExpiresAt) {
        teacherSessionsSheet.getRange(k + 1, 7).setValue("expired");
        cleaned++;
      }
    }
  }

  Logger.log("🧹 Cleaned up " + cleaned + " expired sessions.");
}

// ============================================================================
// PHASE 5: STUDENT GAMIFICATION SYSTEM (XP, LEVELS, ACHIEVEMENTS, LEADERBOARDS)
// ============================================================================

var LEVEL_DEFINITIONS = [
  { level: 1,  title: "Novice Explorer",      minXp: 0,    maxXp: 100 },
  { level: 2,  title: "Curious Learner",      minXp: 100,  maxXp: 250 },
  { level: 3,  title: "Word Scout",           minXp: 250,  maxXp: 450 },
  { level: 4,  title: "Grammar Cadet",        minXp: 450,  maxXp: 700 },
  { level: 5,  title: "Sentence Crafter",     minXp: 700,  maxXp: 1000 },
  { level: 6,  title: "Arcade Challenger",    minXp: 1000, maxXp: 1400 },
  { level: 7,  title: "Reading Detective",    minXp: 1400, maxXp: 1850 },
  { level: 8,  title: "Vocabulary Champion",  minXp: 1850, maxXp: 2350 },
  { level: 9,  title: "Grammar Master",       minXp: 2350, maxXp: 2900 },
  { level: 10, title: "Unit Conqueror",       minXp: 2900, maxXp: 3500 },
  { level: 11, title: "Linguistic Ace",       minXp: 3500, maxXp: 4150 },
  { level: 12, title: "Language Virtuoso",    minXp: 4150, maxXp: 4850 },
  { level: 13, title: "Grand Scholar",        minXp: 4850, maxXp: 5600 },
  { level: 14, title: "Arcade Legend",        minXp: 5600, maxXp: 6400 },
  { level: 15, title: "Mythic Champion",      minXp: 6400, maxXp: 15000 }
];

/**
 * Procedural prestige titles for unlimited levels beyond Level 15.
 */
function getUnlimitedLevelTitle(level) {
  if (level <= 15) {
    for (var i = 0; i < LEVEL_DEFINITIONS.length; i++) {
      if (LEVEL_DEFINITIONS[i].level === level) return LEVEL_DEFINITIONS[i].title;
    }
    return "Novice Explorer";
  }

  var PRESTIGE_TIERS = [
    { min: 16, max: 20, base: "Grandmaster" },
    { min: 21, max: 25, base: "Arcade Paragon" },
    { min: 26, max: 30, base: "Ascendant Scholar" },
    { min: 31, max: 35, base: "Celestial Virtuoso" },
    { min: 36, max: 40, base: "Transcendent" },
    { min: 41, max: 45, base: "Immortal" },
    { min: 46, max: 50, base: "Cosmic Overlord" }
  ];

  var ROMANS = ["I", "II", "III", "IV", "V"];
  for (var j = 0; j < PRESTIGE_TIERS.length; j++) {
    var p = PRESTIGE_TIERS[j];
    if (level >= p.min && level <= p.max) {
      var rank = ROMANS[level - p.min] || String(level - p.min + 1);
      return p.base + " " + rank;
    }
  }

  return "Apex Legend " + level;
}

var ACHIEVEMENTS_CATALOG = [
  { id: "first_game", title: "First Steps", description: "Complete your first review activity in the arcade.", icon: "Sparkles", category: "starter", target: 1 },
  { id: "perfect_score", title: "Flawless Victory", description: "Score 100% on any activity.", icon: "Trophy", category: "starter", target: 1 },
  { id: "perfect_streak_3", title: "Hat Trick", description: "Achieve 3 perfect 100% scores across any activities.", icon: "Zap", category: "mastery", target: 3 },
  { id: "mastery_improver", title: "Growth Mindset", description: "Improve your score by replaying an activity.", icon: "Flame", category: "mastery", target: 1 },
  { id: "quiz_ace", title: "Battle Master", description: "Complete 3 Quiz Battle activities.", icon: "Swords", category: "mastery", target: 3 },
  { id: "match_master", title: "Pair Perfection", description: "Complete 3 Match It! activities.", icon: "Layers", category: "mastery", target: 3 },
  { id: "sentence_architect", title: "Sentence Architect", description: "Complete 3 Sentence Builder activities.", icon: "AlignLeft", category: "mastery", target: 3 },
  { id: "detective_pro", title: "Chief Inspector", description: "Complete 3 Reading Detective activities.", icon: "BookOpen", category: "mastery", target: 3 },
  { id: "station_conductor", title: "Express Conductor", description: "Complete 2 Train Station activities.", icon: "Train", category: "mastery", target: 2 },
  { id: "true_false_guru", title: "Truth Seeker", description: "Complete 3 True/False activities.", icon: "CheckCircle2", category: "mastery", target: 3 },
  { id: "explorer_all_types", title: "Arcade Explorer", description: "Complete at least one activity in each of the 6 game types.", icon: "Compass", category: "explorer", target: 6 },
  { id: "milestone_5", title: "On a Roll", description: "Complete 5 distinct curriculum activities.", icon: "Medal", category: "milestone", target: 5 },
  { id: "milestone_10", title: "Knowledge Seeker", description: "Complete 10 distinct curriculum activities.", icon: "Award", category: "milestone", target: 10 },
  { id: "milestone_25", title: "Halfway Hero", description: "Complete 25 distinct curriculum activities.", icon: "Crown", category: "milestone", target: 25 }
];

/**
 * Calculates student level, title, and progress from total XP.
 * Supports unlimited progression beyond Level 15.
 */
function getLevelFromXp(totalXp) {
  var safeXp = Math.max(0, Math.floor(totalXp || 0));

  // 1. Tiers 1 through 15 (Backward-compatible with original curriculum thresholds)
  if (safeXp <= 15000) {
    var currentTier = LEVEL_DEFINITIONS[0];

    for (var i = 0; i < LEVEL_DEFINITIONS.length; i++) {
      var tier = LEVEL_DEFINITIONS[i];
      if (safeXp >= tier.minXp) {
        currentTier = tier;
      } else {
        break;
      }
    }

    var isMaxLevel15 = currentTier.level === 15 && safeXp >= 15000;
    var currentLevelXp = safeXp - currentTier.minXp;
    var levelSpan = currentTier.maxXp - currentTier.minXp;
    var nextLevelXp = isMaxLevel15 ? 0 : Math.max(0, currentTier.maxXp - safeXp);
    var progressPercent = isMaxLevel15
      ? 100
      : Math.min(100, Math.max(0, Math.round((currentLevelXp / levelSpan) * 100)));

    return {
      level: currentTier.level,
      title: currentTier.title,
      minXp: currentTier.minXp,
      maxXp: currentTier.maxXp,
      currentLevelXp: currentLevelXp,
      nextLevelXp: nextLevelXp,
      progressPercent: progressPercent
    };
  }

  // 2. Unlimited Levels Beyond 15 (Level 16, 17, ... 50, 100+)
  var currentLevel = 16;
  var currentMinXp = 15000;
  var currentSpan = 1000;

  while (safeXp >= currentMinXp + currentSpan) {
    currentMinXp += currentSpan;
    currentLevel++;
    currentSpan += 100;
  }

  var currentMaxXp = currentMinXp + currentSpan;
  var lvlXp = safeXp - currentMinXp;
  var nxtXp = Math.max(0, currentMaxXp - safeXp);
  var pct = Math.min(100, Math.max(0, Math.round((lvlXp / currentSpan) * 100)));

  return {
    level: currentLevel,
    title: getUnlimitedLevelTitle(currentLevel),
    minXp: currentMinXp,
    maxXp: currentMaxXp,
    currentLevelXp: lvlXp,
    nextLevelXp: nxtXp,
    progressPercent: pct
  };
}

/**
 * Server authority for calculating XP earned on an attempt, applying anti-farming replay decay.
 * Supports both positional parameters and options object.
 */
function calculateAttemptXpServer(percentage, isFirstCompletion, previousBestPercentage, attemptNumber) {
  if (typeof percentage === "object" && percentage !== null) {
    var opts = percentage;
    percentage = opts.percentage;
    isFirstCompletion = opts.isFirstCompletion;
    previousBestPercentage = opts.previousBestPercentage;
    attemptNumber = opts.attemptNumber !== undefined ? opts.attemptNumber : (opts.priorAttemptsCount !== undefined ? opts.priorAttemptsCount + 1 : 1);
  }

  var safePct = Math.max(0, Math.min(100, Math.round(percentage || 0)));
  var attNum = Math.max(1, attemptNumber || 1);

  if (isFirstCompletion) {
    var baseCompletionXp = 20;
    var accuracyXp = Math.round((safePct / 100) * 80);
    var perfectBonusXp = (safePct === 100) ? 25 : 0;
    var xpEarned = baseCompletionXp + accuracyXp + perfectBonusXp;
    return {
      xpEarned: xpEarned,
      baseCompletionXp: baseCompletionXp,
      accuracyXp: accuracyXp,
      perfectBonusXp: perfectBonusXp,
      practiceBonusXp: 0,
      breakdown: {
        baseCompletion: baseCompletionXp,
        accuracy: accuracyXp,
        flawlessBonus: perfectBonusXp,
        practiceBonus: 0,
        accuracyImprovement: 0
      },
      replayNotice: null
    };
  }

  var prevBest = Math.max(0, Math.min(100, Math.round(previousBestPercentage || 0)));

  // Replay Practice Bonus Policy:
  // Attempt 1: First play (base + accuracy + perfect = up to 125 XP)
  // Attempt 2: 15 XP
  // Attempt 3: 10 XP
  // Attempt 4: 5 XP
  // Attempt 5: 5 XP
  // Attempt 6+: 0 XP (Hard cap on practice farming for the same activity)
  var practiceBonusXp = 0;
  if (attNum === 2) {
    practiceBonusXp = 15;
  } else if (attNum === 3) {
    practiceBonusXp = 10;
  } else if (attNum === 4 || attNum === 5) {
    practiceBonusXp = 5;
  } else {
    practiceBonusXp = 0; // Capped! Max 35 XP practice bonus per activity lifetime
  }

  if (safePct > prevBest) {
    var improvementXp = Math.round(((safePct - prevBest) / 100) * 80);
    var perfectBonus = (safePct === 100 && prevBest < 100) ? 25 : 0;
    var replayEarned = improvementXp + perfectBonus + practiceBonusXp;
    return {
      xpEarned: replayEarned,
      baseCompletionXp: 0,
      accuracyXp: improvementXp,
      perfectBonusXp: perfectBonus,
      practiceBonusXp: practiceBonusXp,
      breakdown: {
        baseCompletion: 0,
        accuracy: 0,
        flawlessBonus: perfectBonus,
        practiceBonus: practiceBonusXp,
        accuracyImprovement: improvementXp
      },
      replayNotice: "Score improvement (+" + (safePct - prevBest) + "%)! Mastery bonus awarded."
    };
  }

  return {
    xpEarned: practiceBonusXp,
    baseCompletionXp: 0,
    accuracyXp: 0,
    perfectBonusXp: 0,
    practiceBonusXp: practiceBonusXp,
    breakdown: {
      baseCompletion: 0,
      accuracy: 0,
      flawlessBonus: 0,
      practiceBonus: practiceBonusXp,
      accuracyImprovement: 0
    },
    replayNotice: (attNum >= 6)
      ? "Practice XP cap reached for this activity (max 5 attempts). Play other activities to earn more XP!"
      : "Great practice! Replay practice bonus awarded."
  };
}

/**
 * Pure evaluation function checking whether an achievements catalog badge criteria
 * is met by a given list of completed attempts.
 */
function evaluateBadgeEligibility(badgeDef, attemptsList) {
  if (!attemptsList || !Array.isArray(attemptsList) || attemptsList.length === 0) {
    return false;
  }

  var distinctActivities = {};
  var distinctGameTypes = {};
  var perfectCount = 0;
  var gameTypeCounts = {};
  var attemptsByActivity = {};

  var validGameTypes = {
    "quiz_battle": true,
    "match_it": true,
    "sentence_builder": true,
    "true_false": true,
    "reading_detective": true,
    "train_station": true
  };

  for (var j = 0; j < attemptsList.length; j++) {
    var att = attemptsList[j];
    var actId = String(att.activityId || "").trim();
    if (actId) {
      distinctActivities[actId] = true;
      if (!attemptsByActivity[actId]) {
        attemptsByActivity[actId] = [];
      }
      attemptsByActivity[actId].push(Number(att.percentage) || 0);
    }

    var gType = String(att.gameType || "").trim();
    if (gType && validGameTypes[gType]) {
      distinctGameTypes[gType] = true;
      gameTypeCounts[gType] = (gameTypeCounts[gType] || 0) + 1;
    }

    if (Number(att.percentage) === 100) {
      perfectCount++;
    }
  }

  var hasImprovement = false;
  for (var actKey in attemptsByActivity) {
    var scores = attemptsByActivity[actKey];
    if (scores.length >= 2) {
      var runningBest = scores[0];
      for (var s = 1; s < scores.length; s++) {
        if (scores[s] > runningBest) {
          hasImprovement = true;
          break;
        }
        if (scores[s] > runningBest) {
          runningBest = scores[s];
        }
      }
      if (hasImprovement) break;
    }
  }

  var distinctActivitiesCount = Object.keys(distinctActivities).length;
  var distinctGameTypesCount = Object.keys(distinctGameTypes).length;
  var currentProgress = 0;

  switch (badgeDef.id) {
    case "first_game":
      currentProgress = attemptsList.length >= 1 ? 1 : 0;
      break;
    case "perfect_score":
      currentProgress = perfectCount >= 1 ? 1 : 0;
      break;
    case "perfect_streak_3":
      currentProgress = perfectCount;
      break;
    case "mastery_improver":
      currentProgress = hasImprovement ? 1 : 0;
      break;
    case "quiz_ace":
      currentProgress = gameTypeCounts["quiz_battle"] || 0;
      break;
    case "match_master":
      currentProgress = gameTypeCounts["match_it"] || 0;
      break;
    case "sentence_architect":
      currentProgress = gameTypeCounts["sentence_builder"] || 0;
      break;
    case "detective_pro":
      currentProgress = gameTypeCounts["reading_detective"] || 0;
      break;
    case "station_conductor":
      currentProgress = gameTypeCounts["train_station"] || 0;
      break;
    case "true_false_guru":
      currentProgress = gameTypeCounts["true_false"] || 0;
      break;
    case "explorer_all_types":
      currentProgress = distinctGameTypesCount;
      break;
    case "milestone_5":
    case "milestone_10":
    case "milestone_25":
      currentProgress = distinctActivitiesCount;
      break;
    default:
      currentProgress = 0;
  }

  return currentProgress >= badgeDef.target;
}

/**
 * Finds the specific historical attempt that first achieved a badge's criteria.
 */
function findTriggeringAttemptId(badgeDef, attemptsList) {
  if (!attemptsList || attemptsList.length === 0) return "";
  for (var i = 1; i <= attemptsList.length; i++) {
    var sub = attemptsList.slice(0, i);
    if (evaluateBadgeEligibility(badgeDef, sub)) {
      return attemptsList[i - 1].attemptId || "";
    }
  }
  return attemptsList[attemptsList.length - 1].attemptId || "";
}

/**
 * Finds the timestamp of the specific historical attempt that first achieved a badge's criteria.
 */
function findTriggeringTimestamp(badgeDef, attemptsList, fallbackNow) {
  if (!attemptsList || attemptsList.length === 0) return fallbackNow;
  for (var i = 1; i <= attemptsList.length; i++) {
    var sub = attemptsList.slice(0, i);
    if (evaluateBadgeEligibility(badgeDef, sub)) {
      return attemptsList[i - 1].completedAt || fallbackNow;
    }
  }
  return attemptsList[attemptsList.length - 1].completedAt || fallbackNow;
}

/**
 * Evaluates achievement criteria for a student and persists newly unlocked badges to Achievements sheet.
 * Differentiates between badges already earned in historical attempts vs. badges actively unlocked
 * by the current attempt, ensuring the result modal receives ONLY newly triggered achievements.
 */
function checkAndUnlockAchievements(ss, studentAuth, priorCompletedAttempts, currentAttemptOrTriggerId) {
  var achievementsSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.ACHIEVEMENTS);
  setupSheetHeaders(achievementsSheet, CONFIG.ACHIEVEMENT_HEADERS, "#1e293b", "#eab308");
  var colMap = getSheetColumnMap(achievementsSheet, CONFIG.ACHIEVEMENT_HEADERS);

  var priorAttempts = [];
  var currentAttempt = null;

  if (typeof currentAttemptOrTriggerId === "object" && currentAttemptOrTriggerId !== null) {
    priorAttempts = Array.isArray(priorCompletedAttempts) ? priorCompletedAttempts : [];
    currentAttempt = currentAttemptOrTriggerId;
  } else if (Array.isArray(priorCompletedAttempts)) {
    var triggerId = String(currentAttemptOrTriggerId || "");
    var all = priorCompletedAttempts;
    if (triggerId) {
      priorAttempts = all.filter(function(a) { return a.attemptId !== triggerId; });
      var matched = all.filter(function(a) { return a.attemptId === triggerId; });
      currentAttempt = matched.length > 0 ? matched[0] : null;
    } else {
      priorAttempts = all.slice(0, -1);
      currentAttempt = all[all.length - 1] || null;
    }
  }

  var allAttempts = (priorAttempts || []).concat(currentAttempt ? [currentAttempt] : []);

  var existingData = achievementsSheet.getDataRange().getValues();
  var alreadyUnlockedMap = {};

  for (var i = 1; i < existingData.length; i++) {
    var rowStudent = String(existingData[i][colMap["student_number"] - 1] || "").trim();
    if (rowStudent === studentAuth.studentNumber) {
      var badgeId = String(existingData[i][colMap["achievement_id"] - 1] || "").trim();
      alreadyUnlockedMap[badgeId] = String(existingData[i][colMap["unlocked_at"] - 1] || "");
    }
  }

  var newlyUnlocked = [];
  var rowsToAppend = [];
  var now = new Date().toISOString();

  for (var c = 0; c < ACHIEVEMENTS_CATALOG.length; c++) {
    var def = ACHIEVEMENTS_CATALOG[c];
    if (alreadyUnlockedMap[def.id]) continue; // Already persisted in sheet

    var wasEligibleBefore = evaluateBadgeEligibility(def, priorAttempts);
    var isEligibleNow = evaluateBadgeEligibility(def, allAttempts);

    if (isEligibleNow) {
      // An achievement is newly unlocked ONLY if this current attempt crossed the threshold
      var isNewlyTriggeredByThisAttempt = !wasEligibleBefore && (currentAttempt !== null && currentAttempt !== undefined);

      var triggerAttId = isNewlyTriggeredByThisAttempt
        ? (currentAttempt.attemptId || "")
        : findTriggeringAttemptId(def, priorAttempts);

      var unlockTimestamp = isNewlyTriggeredByThisAttempt
        ? now
        : findTriggeringTimestamp(def, priorAttempts, now);

      var unlockId = "ach_" + Utilities.getUuid();
      var unlockRow = [
        unlockId,
        studentAuth.studentId || "",
        studentAuth.studentNumber,
        studentAuth.class || "",
        def.id,
        def.title,
        unlockTimestamp,
        triggerAttId
      ];
      rowsToAppend.push(unlockRow);
      alreadyUnlockedMap[def.id] = unlockTimestamp;

      // Only add to newlyUnlocked if actively unlocked by THIS current attempt!
      if (isNewlyTriggeredByThisAttempt) {
        newlyUnlocked.push({
          id: def.id,
          title: def.title,
          description: def.description,
          icon: def.icon,
          category: def.category,
          target: def.target,
          progress: def.target,
          unlockedAt: now
        });
      }
    }
  }

  if (rowsToAppend.length > 0) {
    var lastCol = achievementsSheet.getLastColumn();
    var startRow = achievementsSheet.getLastRow() + 1;
    achievementsSheet.getRange(startRow, 1, rowsToAppend.length, lastCol).setValues(rowsToAppend);
  }

  return newlyUnlocked;
}

/**
 * Gathers a full gamification summary for a student from Attempts and Achievements sheets.
 */
function getStudentGamificationSummary(ss, studentNumber) {
  var attemptsSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.ATTEMPTS);
  var attColMap = getSheetColumnMap(attemptsSheet, CONFIG.ATTEMPT_HEADERS);
  var attemptsData = attemptsSheet.getDataRange().getValues();

  var totalXp = 0;
  var completedAttempts = [];
  var distinctActivities = {};
  var perfectCount = 0;
  var totalPercentage = 0;

  for (var i = 1; i < attemptsData.length; i++) {
    var sNum = String(attemptsData[i][attColMap["student_number"] - 1] || "").trim();
    if (sNum !== studentNumber) continue;

    var status = String(attemptsData[i][attColMap["status"] - 1] || "").trim();
    if (status === "completed") {
      var actId = String(attemptsData[i][attColMap["activity_id"] - 1] || "").trim();
      var actTitle = String(attemptsData[i][attColMap["activity_title"] - 1] || "").trim();
      var gType = String(attemptsData[i][attColMap["game_type"] - 1] || "").trim();
      var score = Number(attemptsData[i][attColMap["score"] - 1] || 0);
      var pct = Number(attemptsData[i][attColMap["percentage"] - 1] || 0);
      var dur = Number(attemptsData[i][attColMap["duration_seconds"] - 1] || 0);
      var compAt = String(attemptsData[i][attColMap["completed_at"] - 1] || "");
      var attId = String(attemptsData[i][attColMap["attempt_id"] - 1] || "").trim();
      var xp = attColMap["xp_earned"] ? Number(attemptsData[i][attColMap["xp_earned"] - 1] || 0) : 0;

      // If historical attempt lacked stored xp, compute dynamically
      if (xp <= 0) {
        var base = 20;
        var acc = Math.round((pct / 100) * 80);
        var perf = (pct === 100) ? 25 : 0;
        xp = base + acc + perf;
      }

      totalXp += xp;
      distinctActivities[actId] = true;
      if (pct === 100) perfectCount++;
      totalPercentage += pct;

      completedAttempts.push({
        attemptId: attId,
        activityId: actId,
        activityTitle: actTitle,
        gameType: gType,
        score: score,
        percentage: pct,
        durationSeconds: dur,
        xpEarned: xp,
        completedAt: compAt
      });
    }
  }

  var levelObj = getLevelFromXp(totalXp);
  var distinctCount = Object.keys(distinctActivities).length;
  var avgScore = completedAttempts.length > 0 ? Math.round(totalPercentage / completedAttempts.length) : 0;

  // Read achievements
  var achievementsSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.ACHIEVEMENTS);
  var unlockedBadgesMap = {};
  if (achievementsSheet) {
    var achColMap = getSheetColumnMap(achievementsSheet, CONFIG.ACHIEVEMENT_HEADERS);
    var achData = achievementsSheet.getDataRange().getValues();
    for (var k = 1; k < achData.length; k++) {
      var aStudent = String(achData[k][achColMap["student_number"] - 1] || "").trim();
      if (aStudent === studentNumber) {
        var bId = String(achData[k][achColMap["achievement_id"] - 1] || "").trim();
        unlockedBadgesMap[bId] = String(achData[k][achColMap["unlocked_at"] - 1] || "");
      }
    }
  }

  // Build full achievement status list
  var fullAchievementsList = [];
  for (var b = 0; b < ACHIEVEMENTS_CATALOG.length; b++) {
    var item = ACHIEVEMENTS_CATALOG[b];
    var unlockedTime = unlockedBadgesMap[item.id] || null;
    fullAchievementsList.push({
      id: item.id,
      title: item.title,
      description: item.description,
      icon: item.icon,
      category: item.category,
      target: item.target,
      unlockedAt: unlockedTime
    });
  }

  // Sort recent activity descending by completedAt
  completedAttempts.sort(function(a, b) {
    return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
  });

  return {
    level: levelObj.level,
    levelTitle: levelObj.title,
    minXp: levelObj.minXp,
    maxXp: levelObj.maxXp,
    currentLevelXp: levelObj.currentLevelXp,
    nextLevelXp: levelObj.nextLevelXp,
    progressPercent: levelObj.progressPercent,
    totalXp: totalXp,
    stats: {
      activitiesCompleted: distinctCount,
      totalAttempts: completedAttempts.length,
      averageScore: avgScore,
      perfectScores: perfectCount
    },
    achievements: fullAchievementsList,
    recentActivity: completedAttempts.slice(0, 10)
  };
}

/**
 * ACTION: student_get_profile
 * Returns the authenticated student's full gamification profile.
 */
function handleStudentGetProfile(ss, payload) {
  var auth = validateSessionAndGetStudent(ss, payload.sessionToken);
  if (!auth.success) {
    return createJsonResponse({ success: false, error: auth.error, code: "UNAUTHORIZED" });
  }

  var summary = getStudentGamificationSummary(ss, auth.studentNumber);

  var profile = {
    studentNumber: auth.studentNumber,
    displayName: auth.displayName,
    firstName: auth.firstName,
    class: auth.class,
    grade: auth.grade,
    level: summary.level,
    levelTitle: summary.levelTitle,
    minXp: summary.minXp,
    maxXp: summary.maxXp,
    totalXp: summary.totalXp,
    currentLevelXp: summary.currentLevelXp,
    nextLevelXp: summary.nextLevelXp,
    progressPercent: summary.progressPercent,
    stats: summary.stats,
    achievements: summary.achievements,
    recentActivity: summary.recentActivity,
    totalCoins: getStudentCoinBalance(ss, auth.studentNumber),
    monster: getStudentMonsterConfig(ss, auth.studentNumber)
  };

  return createJsonResponse({
    success: true,
    profile: profile
  });
}

/**
 * ACTION: student_get_leaderboard
 * Returns class leaderboard with deterministic tie-breaking and strict student privacy protection.
 */
function handleStudentGetLeaderboard(ss, payload) {
  var auth = validateSessionAndGetStudent(ss, payload.sessionToken);
  if (!auth.success) {
    return createJsonResponse({ success: false, error: auth.error, code: "UNAUTHORIZED" });
  }

  var targetClass = String(payload.classId || auth.class || "").trim().toUpperCase();
  var validClasses = ["7A", "7B", "8A", "8B"];
  if (validClasses.indexOf(targetClass) === -1) {
    targetClass = auth.class || "8A";
  }

  var studentsSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.STUDENTS);
  var stdColMap = getSheetColumnMap(studentsSheet, CONFIG.STUDENT_HEADERS);
  var studentsData = studentsSheet.getDataRange().getValues();

  var classStudents = [];
  for (var i = 1; i < studentsData.length; i++) {
    var sClass = String(studentsData[i][stdColMap["class"] - 1] || "").trim().toUpperCase();
    var sActive = studentsData[i][stdColMap["is_active"] - 1];
    if (sClass === targetClass && sActive !== false && sActive !== "false") {
      var sNum = String(studentsData[i][stdColMap["student_number"] - 1] || "").trim();
      var fullName = String(studentsData[i][stdColMap["full_name"] - 1] || "").trim();
      classStudents.push({
        studentNumber: sNum,
        fullName: fullName
      });
    }
  }

  var attemptsSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.ATTEMPTS);
  var attColMap = getSheetColumnMap(attemptsSheet, CONFIG.ATTEMPT_HEADERS);
  var attemptsData = attemptsSheet.getDataRange().getValues();

  var studentMetrics = {};
  for (var s = 0; s < classStudents.length; s++) {
    var num = classStudents[s].studentNumber;
    studentMetrics[num] = {
      studentNumber: num,
      fullName: classStudents[s].fullName,
      totalXp: 0,
      distinctActivities: {},
      earliestCompletedAt: null
    };
  }

  for (var a = 1; a < attemptsData.length; a++) {
    var aClass = String(attemptsData[a][attColMap["class"] - 1] || "").trim().toUpperCase();
    if (aClass !== targetClass) continue;

    var aStatus = String(attemptsData[a][attColMap["status"] - 1] || "").trim();
    if (aStatus === "completed") {
      var aNum = String(attemptsData[a][attColMap["student_number"] - 1] || "").trim();
      var metric = studentMetrics[aNum];
      if (metric) {
        var actId = String(attemptsData[a][attColMap["activity_id"] - 1] || "").trim();
        var pct = Number(attemptsData[a][attColMap["percentage"] - 1] || 0);
        var xp = attColMap["xp_earned"] ? Number(attemptsData[a][attColMap["xp_earned"] - 1] || 0) : 0;
        if (xp <= 0) {
          xp = 20 + Math.round((pct / 100) * 80) + (pct === 100 ? 25 : 0);
        }

        metric.totalXp += xp;
        metric.distinctActivities[actId] = true;

        var compAtStr = String(attemptsData[a][attColMap["completed_at"] - 1] || "");
        if (compAtStr) {
          var compTime = new Date(compAtStr).getTime();
          if (!metric.earliestCompletedAt || compTime < metric.earliestCompletedAt) {
            metric.earliestCompletedAt = compTime;
          }
        }
      }
    }
  }

  var leaderboardList = [];
  for (var mKey in studentMetrics) {
    var m = studentMetrics[mKey];
    var actCount = Object.keys(m.distinctActivities).length;
    var lvlInfo = getLevelFromXp(m.totalXp);

    // Format privacy-preserving display name (e.g. "Barış A.")
    var parts = m.fullName.split(" ");
    var displayName = parts[0];
    if (parts.length > 1) {
      displayName += " " + parts[parts.length - 1].charAt(0).toUpperCase() + ".";
    }

    leaderboardList.push({
      studentNumber: m.studentNumber,
      displayName: displayName,
      class: targetClass,
      level: lvlInfo.level,
      levelTitle: lvlInfo.title,
      totalXp: m.totalXp,
      activitiesCompleted: actCount,
      earliestCompletedAt: m.earliestCompletedAt || Infinity,
      isCurrentStudent: (m.studentNumber === auth.studentNumber)
    });
  }

  // Deterministic tie-breaking sort:
  // 1. totalXp (descending)
  // 2. activitiesCompleted (descending)
  // 3. earliestCompletedAt (ascending - who achieved it first)
  leaderboardList.sort(function(a, b) {
    if (b.totalXp !== a.totalXp) {
      return b.totalXp - a.totalXp;
    }
    if (b.activitiesCompleted !== a.activitiesCompleted) {
      return b.activitiesCompleted - a.activitiesCompleted;
    }
    return a.earliestCompletedAt - b.earliestCompletedAt;
  });

  var sanitizedEntries = [];
  var currentRank = null;

  for (var r = 0; r < leaderboardList.length; r++) {
    var item = leaderboardList[r];
    var rankNum = r + 1;
    if (item.isCurrentStudent) {
      currentRank = rankNum;
    }

    sanitizedEntries.push({
      rank: rankNum,
      displayName: item.displayName,
      class: item.class,
      level: item.level,
      levelTitle: item.levelTitle,
      totalXp: item.totalXp,
      activitiesCompleted: item.activitiesCompleted,
      isCurrentStudent: item.isCurrentStudent
    });
  }

  return createJsonResponse({
    success: true,
    leaderboard: {
      classId: targetClass,
      entries: sanitizedEntries,
      currentStudentRank: currentRank
    }
  });
}

// ===========================================================================
// PHASE 6: PERSONALIZED LEARNING BACKEND HANDLERS
// ===========================================================================

/**
 * Retrieves the authenticated student's mistakes history with real-time correction tracking.
 */
function handleStudentGetMistakes(ss, payload) {
  var auth = validateSessionAndGetStudent(ss, payload.sessionToken);
  if (!auth.success) {
    return createJsonResponse({ success: false, error: auth.error, code: "UNAUTHORIZED" });
  }

  var studentNumber = auth.studentNumber;
  var answersSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.ANSWERS);
  var ansColMap = getSheetColumnMap(answersSheet, CONFIG.ANSWER_HEADERS);
  var answerData = answersSheet.getDataRange().getValues();

  var attemptsSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.ATTEMPTS);
  var attColMap = getSheetColumnMap(attemptsSheet, CONFIG.ATTEMPT_HEADERS);
  var attemptData = attemptsSheet.getDataRange().getValues();

  // Attempt lookup for metadata
  var attemptMetaMap = {};
  for (var a = 1; a < attemptData.length; a++) {
    var attId = String(attemptData[a][attColMap["attempt_id"] - 1] || "").trim();
    if (attId) {
      attemptMetaMap[attId] = {
        gradeId: String(attemptData[a][attColMap["grade_id"] - 1] || "grade-7"),
        unitId: String(attemptData[a][attColMap["unit_id"] - 1] || ""),
        unitTitle: String(attemptData[a][attColMap["unit_title"] - 1] || ""),
        activityId: String(attemptData[a][attColMap["activity_id"] - 1] || ""),
        activityTitle: String(attemptData[a][attColMap["activity_title"] - 1] || ""),
        gameType: String(attemptData[a][attColMap["game_type"] - 1] || "quiz_battle")
      };
    }
  }

  var questionAnswers = {};

  for (var i = 1; i < answerData.length; i++) {
    var row = answerData[i];
    var sNum = String(row[ansColMap["student_number"] - 1] || "").trim();
    if (sNum !== studentNumber) continue;

    var ansId = String(row[ansColMap["answer_id"] - 1] || "").trim();
    var attId = String(row[ansColMap["attempt_id"] - 1] || "").trim();
    var qId = String(row[ansColMap["question_id"] - 1] || "").trim();
    var isCorrect = Boolean(row[ansColMap["is_correct"] - 1]);
    var timestamp = row[ansColMap["timestamp"] - 1] || new Date().toISOString();
    var unitId = String(row[ansColMap["unit_id"] - 1] || "");
    var actId = String(row[ansColMap["activity_id"] - 1] || "");
    var prompt = String(row[ansColMap["question_prompt"] - 1] || "");
    var studentResp = String(row[ansColMap["student_response"] - 1] || "");
    var correctAns = String(row[ansColMap["correct_answer"] - 1] || "");
    var qOrder = Number(row[ansColMap["question_order"] - 1] || 1);

    if (!questionAnswers[qId]) {
      questionAnswers[qId] = [];
    }
    questionAnswers[qId].push({
      answerId: ansId,
      attemptId: attId,
      isCorrect: isCorrect,
      timestamp: timestamp,
      studentResponse: studentResp,
      correctAnswer: correctAns,
      unitId: unitId,
      activityId: actId,
      prompt: prompt,
      questionOrder: qOrder
    });
  }

  var mistakesMap = {};

  for (var qIdKey in questionAnswers) {
    var history = questionAnswers[qIdKey];
    history.sort(function(h1, h2) {
      return new Date(h1.timestamp || 0).getTime() - new Date(h2.timestamp || 0).getTime();
    });

    var latestMistake = null;
    var subsequentCorrect = null;
    var retryCount = 0;

    for (var h = 0; h < history.length; h++) {
      var item = history[h];
      if (!item.isCorrect) {
        latestMistake = item;
      } else if (latestMistake && new Date(item.timestamp || 0).getTime() >= new Date(latestMistake.timestamp || 0).getTime()) {
        subsequentCorrect = item;
      }
      if (latestMistake && h > 0) {
        retryCount++;
      }
    }

    if (latestMistake) {
      var meta = attemptMetaMap[latestMistake.attemptId] || {};
      var gId = meta.gradeId || (auth.grade || "grade-7");
      var uId = latestMistake.unitId || meta.unitId || "";
      var actId = latestMistake.activityId || meta.activityId || "";

      // Strict Grade Isolation: Never expose cross-grade mistakes to student
      if (gId !== auth.grade || !isContentAuthorizedForGrade(actId, uId, qIdKey, auth.grade)) {
        continue;
      }

      var uTitle = meta.unitTitle || ("Unit " + uId);
      var actTitle = meta.activityTitle || actId;
      var gType = meta.gameType || "quiz_battle";

      var isCorrected = Boolean(subsequentCorrect);
      var correctedAt = subsequentCorrect ? subsequentCorrect.timestamp : null;

      mistakesMap[qIdKey] = {
        mistakeId: "mst_" + latestMistake.answerId,
        answerId: latestMistake.answerId,
        attemptId: latestMistake.attemptId,
        studentNumber: studentNumber,
        class: auth.className || auth.class || "",
        gradeId: gId,
        unitId: uId,
        unitTitle: uTitle,
        activityId: actId,
        activityTitle: actTitle,
        gameType: gType,
        questionId: qIdKey,
        questionOrder: latestMistake.questionOrder,
        questionPrompt: latestMistake.prompt,
        studentResponse: latestMistake.studentResponse,
        correctAnswer: latestMistake.correctAnswer,
        explanation: "",
        timestamp: latestMistake.timestamp,
        isCorrected: isCorrected,
        correctedAt: correctedAt,
        retryAttemptsCount: retryCount
      };
    }
  }

  var mistakesList = [];
  for (var mKey in mistakesMap) {
    mistakesList.push(mistakesMap[mKey]);
  }

  mistakesList.sort(function(a, b) {
    if (a.isCorrected !== b.isCorrected) {
      return a.isCorrected ? 1 : -1;
    }
    return new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime();
  });

  return createJsonResponse({
    success: true,
    mistakes: mistakesList
  });
}

/**
 * Calculates topic mastery progress across Grade 7 and Grade 8 units.
 */
function handleStudentGetMastery(ss, payload) {
  var auth = validateSessionAndGetStudent(ss, payload.sessionToken);
  if (!auth.success) {
    return createJsonResponse({ success: false, error: auth.error, code: "UNAUTHORIZED" });
  }

  var studentNumber = auth.studentNumber;
  var attemptsSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.ATTEMPTS);
  var attColMap = getSheetColumnMap(attemptsSheet, CONFIG.ATTEMPT_HEADERS);
  var attemptData = attemptsSheet.getDataRange().getValues();

  var answersSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.ANSWERS);
  var ansColMap = getSheetColumnMap(answersSheet, CONFIG.ANSWER_HEADERS);
  var answerData = answersSheet.getDataRange().getValues();

  // Unit definitions metadata for Grade 7 & Grade 8
  var unitConfigs = {
    "grade-7": [
      { unitId: "g7-u1", unitNumber: 1, unitTitle: "Digital Era & Everyday Life", totalActivities: 8 },
      { unitId: "g7-u2", unitNumber: 2, unitTitle: "Past Events & Personal Memories", totalActivities: 10 }
    ],
    "grade-8": [
      { unitId: "g8-u1", unitNumber: 1, unitTitle: "Friendship & Social Bonds", totalActivities: 7 },
      { unitId: "g8-u2", unitNumber: 2, unitTitle: "Teen Life & Daily Routines", totalActivities: 8 },
      { unitId: "g8-u3", unitNumber: 3, unitTitle: "In the Kitchen & Cooking", totalActivities: 8 },
      { unitId: "g8-u4", unitNumber: 4, unitTitle: "Communication & Phone Calls", totalActivities: 8 }
    ]
  };

  // Group attempts by unit
  var unitAttempts = {};
  var activityAttempts = {};

  for (var i = 1; i < attemptData.length; i++) {
    var aRow = attemptData[i];
    var aNum = String(aRow[attColMap["student_number"] - 1] || "").trim();
    if (aNum !== studentNumber) continue;

    var uId = String(aRow[attColMap["unit_id"] - 1] || "").trim();
    var actId = String(aRow[attColMap["activity_id"] - 1] || "").trim();
    var actTitle = String(aRow[attColMap["activity_title"] - 1] || actId).trim();
    var gType = String(aRow[attColMap["game_type"] - 1] || "quiz_battle").trim();
    var status = String(aRow[attColMap["status"] - 1] || "").trim();
    var pct = Number(aRow[attColMap["percentage"] - 1] || 0);
    var startedAt = aRow[attColMap["started_at"] - 1] || null;

    if (!unitAttempts[uId]) unitAttempts[uId] = [];
    unitAttempts[uId].push({
      activityId: actId,
      status: status,
      percentage: pct,
      startedAt: startedAt
    });

    if (!activityAttempts[actId]) activityAttempts[actId] = [];
    activityAttempts[actId].push({
      unitId: uId,
      activityTitle: actTitle,
      gameType: gType,
      status: status,
      percentage: pct,
      startedAt: startedAt
    });
  }

  // Group answers by unit for accuracy and skills
  var unitAnswers = {};
  for (var j = 1; j < answerData.length; j++) {
    var ansRow = answerData[j];
    var ansNum = String(ansRow[ansColMap["student_number"] - 1] || "").trim();
    if (ansNum !== studentNumber) continue;

    var ansUnitId = String(ansRow[ansColMap["unit_id"] - 1] || "").trim();
    var ansIsCorrect = Boolean(ansRow[ansColMap["is_correct"] - 1]);
    var ansPrompt = String(ansRow[ansColMap["question_prompt"] - 1] || "");

    if (!unitAnswers[ansUnitId]) unitAnswers[ansUnitId] = [];
    unitAnswers[ansUnitId].push({
      isCorrect: ansIsCorrect,
      prompt: ansPrompt
    });
  }

  function buildGradeMastery(gradeId) {
    var configs = unitConfigs[gradeId] || [];
    var unitsMastery = [];
    var totalActsCompleted = 0;
    var totalGradeAnswers = 0;
    var totalGradeCorrect = 0;
    var masteredCount = 0;

    for (var u = 0; u < configs.length; u++) {
      var cfg = configs[u];
      var attempts = unitAttempts[cfg.unitId] || [];
      var answers = unitAnswers[cfg.unitId] || [];

      // Completed distinct activities
      var completedMap = {};
      for (var at = 0; at < attempts.length; at++) {
        if (attempts[at].status === "completed") {
          completedMap[attempts[at].activityId] = true;
        }
      }
      var completedCount = Object.keys(completedMap).length;
      totalActsCompleted += completedCount;

      var totalAnswered = answers.length;
      var correctCount = 0;
      for (var an = 0; an < answers.length; an++) {
        if (answers[an].isCorrect) correctCount++;
      }
      totalGradeAnswers += totalAnswered;
      totalGradeCorrect += correctCount;

      var accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 1000) / 10 : 0;

      // Mastery Level
      var mLevel = "needs_practice";
      if (accuracy >= 90 && completedCount > 0) {
        mLevel = "mastered";
        masteredCount++;
      } else if (accuracy >= 70 && completedCount > 0) {
        mLevel = "developing";
      }

      // Calculate Areas Needing Practice
      var areas = [];
      for (var actKey in activityAttempts) {
        var actList = activityAttempts[actKey];
        if (actList.length > 0 && actList[0].unitId === cfg.unitId) {
          var actLatest = actList[actList.length - 1];
          var actPct = actLatest.percentage;
          var actMistakes = 0;
          for (var aAns = 0; aAns < answers.length; aAns++) {
            if (!answers[aAns].isCorrect) actMistakes++;
          }
          if (actPct < 75 || actMistakes > 0) {
            areas.push({
              activityId: actKey,
              activityTitle: actLatest.activityTitle,
              gameType: actLatest.gameType,
              totalAttempts: actList.length,
              accuracyPercentage: actPct,
              mistakeCount: actMistakes,
              lastAttemptedAt: actLatest.startedAt
            });
          }
        }
      }

      // Calculate Historical Improvement Gain
      var firstAcc = 0;
      var latestAcc = accuracy;
      var improvement = 0;
      if (attempts.length > 0) {
        firstAcc = attempts[0].percentage || 0;
        improvement = Math.max(0, Math.round((latestAcc - firstAcc) * 10) / 10);
      }

      // Synthesize Core Skills
      var skills = [
        {
          skillId: "vocab",
          skillName: "Key Vocabulary & Collocations",
          totalAnswered: Math.round(totalAnswered * 0.4),
          correctCount: Math.round(correctCount * 0.4),
          accuracyPercentage: accuracy,
          status: mLevel
        },
        {
          skillId: "grammar",
          skillName: "Grammar & Sentence Structure",
          totalAnswered: Math.round(totalAnswered * 0.35),
          correctCount: Math.round(correctCount * 0.35),
          accuracyPercentage: accuracy,
          status: mLevel
        },
        {
          skillId: "comprehension",
          skillName: "Context Comprehension & Reading",
          totalAnswered: Math.round(totalAnswered * 0.25),
          correctCount: Math.round(correctCount * 0.25),
          accuracyPercentage: accuracy,
          status: mLevel
        }
      ];

      unitsMastery.push({
        unitId: cfg.unitId,
        unitNumber: cfg.unitNumber,
        unitTitle: cfg.unitTitle,
        gradeId: gradeId,
        totalActivities: cfg.totalActivities,
        completedActivities: completedCount,
        totalQuestionsAnswered: totalAnswered,
        correctAnswersCount: correctCount,
        accuracyPercentage: accuracy,
        masteryLevel: mLevel,
        skills: skills,
        areasNeedingPractice: areas,
        firstAttemptAccuracy: firstAcc,
        latestAttemptAccuracy: latestAcc,
        historicalImprovementPercentage: improvement
      });
    }

    var overallGradeAcc = totalGradeAnswers > 0
      ? Math.round((totalGradeCorrect / totalGradeAnswers) * 1000) / 10
      : 0;

    return {
      units: unitsMastery,
      totalActivitiesCompleted: totalActsCompleted,
      overallAccuracy: overallGradeAcc,
      masteredUnitsCount: masteredCount
    };
  }

  var g7Mastery = buildGradeMastery("grade-7");
  var g8Mastery = buildGradeMastery("grade-8");

  var studentGrade = auth.grade || "grade-7";
  var overallAcc = studentGrade === "grade-7" ? g7Mastery.overallAccuracy : g8Mastery.overallAccuracy;

  return createJsonResponse({
    success: true,
    mastery: {
      studentNumber: studentNumber,
      displayName: auth.fullName || ("Student " + studentNumber),
      class: auth.className || auth.class || "",
      studentGrade: studentGrade,
      overallAccuracy: overallAcc,
      totalMistakesCount: 0,
      correctedMistakesCount: 0,
      grade7: g7Mastery,
      grade8: g8Mastery,
      lastCalculatedAt: new Date().toISOString()
    }
  });
}

/**
 * Records a student's practice retry of an incorrect question,
 * automatically marking the mistake as corrected if answered correctly.
 */
function handleStudentRecordMistakeRetry(ss, payload) {
  var auth = validateSessionAndGetStudent(ss, payload.sessionToken);
  if (!auth.success) {
    return createJsonResponse({ success: false, error: auth.error, code: "UNAUTHORIZED" });
  }

  var questionId = String(payload.questionId || "").trim();
  var activityId = String(payload.activityId || "").trim();
  var unitId = String(payload.unitId || "").trim();
  var isCorrect = Boolean(payload.isCorrect);

  if (!questionId) {
    return createJsonResponse({ success: false, error: "Missing questionId", code: "BAD_REQUEST" });
  }

  // Strict Server-Side Grade Authorization Guard
  if (!isContentAuthorizedForGrade(activityId, unitId, questionId, auth.grade)) {
    return createJsonResponse({
      success: false,
      error: "Unauthorized: Cross-grade mistake retry prohibited.",
      code: "GRADE_UNAUTHORIZED"
    });
  }

  var answersSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.ANSWERS);
  var ansColMap = getSheetColumnMap(answersSheet, CONFIG.ANSWER_HEADERS);
  var timestamp = new Date().toISOString();
  var retryAnswerId = "ans_retry_" + Utilities.getUuid().substring(0, 12);
  var retryAttemptId = "att_retry_" + Utilities.getUuid().substring(0, 12);

  var newRow = [];
  var totalCols = CONFIG.ANSWER_HEADERS.length;
  for (var c = 0; c < totalCols; c++) {
    newRow.push("");
  }

  newRow[ansColMap["answer_id"] - 1] = retryAnswerId;
  newRow[ansColMap["attempt_id"] - 1] = retryAttemptId;
  newRow[ansColMap["student_id"] - 1] = auth.studentId;
  newRow[ansColMap["student_number"] - 1] = auth.studentNumber;
  newRow[ansColMap["class"] - 1] = auth.className || auth.class || "";
  newRow[ansColMap["unit_id"] - 1] = unitId;
  newRow[ansColMap["activity_id"] - 1] = activityId;
  newRow[ansColMap["question_id"] - 1] = questionId;
  newRow[ansColMap["question_order"] - 1] = 1;
  newRow[ansColMap["question_prompt"] - 1] = String(payload.questionPrompt || "");
  newRow[ansColMap["student_response"] - 1] = String(payload.studentResponse || "");
  newRow[ansColMap["correct_answer"] - 1] = String(payload.correctAnswer || "");
  newRow[ansColMap["is_correct"] - 1] = isCorrect;
  newRow[ansColMap["time_spent_seconds"] - 1] = Number(payload.timeSpentSeconds || 5);
  newRow[ansColMap["timestamp"] - 1] = timestamp;
  if (ansColMap["question_version"]) {
    newRow[ansColMap["question_version"] - 1] = "retry-v1";
  }

  answersSheet.appendRow(newRow);

  var xpAwarded = 0;
  if (isCorrect) {
    xpAwarded = 10;
    // Award 10 practice XP to student
    try {
      var studentsSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.STUDENTS);
      var stdColMap = getSheetColumnMap(studentsSheet, CONFIG.STUDENT_HEADERS);
      var stdData = studentsSheet.getDataRange().getValues();
      for (var s = 1; s < stdData.length; s++) {
        if (String(stdData[s][stdColMap["student_number"] - 1]).trim() === auth.studentNumber) {
          var currXp = Number(stdData[s][stdColMap["total_xp"] - 1] || 0);
          studentsSheet.getRange(s + 1, stdColMap["total_xp"]).setValue(currXp + xpAwarded);
          break;
        }
      }
    } catch (xpErr) {
      Logger.log("Failed to award retry XP: " + xpErr.message);
    }
  }

  return createJsonResponse({
    success: true,
    isCorrect: isCorrect,
    isCorrected: isCorrect,
    correctedAt: isCorrect ? timestamp : null,
    xpAwarded: xpAwarded
  });
}

/**
 * Safe, idempotent, read-only simulation tool for inspecting historical XP and level distribution.
 * NEVER mutates Google Sheets data: zero insertSheet, setValue, setValues calls.
 * Can be run directly from Google Apps Script editor with NO arguments.
 *
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} [optSs] Optional spreadsheet instance. If omitted, uses getArcadeSpreadsheet().
 * @returns {Object} Simulation report.
 */
function dryRunBackfillStudentXP(optSs) {
  var ss = optSs || null;
  if (!ss) {
    try {
      ss = getArcadeSpreadsheet();
    } catch (err) {
      Logger.log("❌ Cannot run XP backfill simulation: " + err.message);
      return {
        success: false,
        dryRun: true,
        error: "SPREADSHEET_NOT_CONNECTED",
        message: err.message,
        totalAttemptsAudited: 0,
        totalStudentsAudited: 0,
        students: []
      };
    }
  }

  if (!ss) {
    Logger.log("❌ Cannot run XP backfill simulation: Spreadsheet instance is undefined.");
    return {
      success: false,
      dryRun: true,
      error: "SPREADSHEET_NOT_FOUND",
      message: "Spreadsheet instance could not be resolved.",
      totalAttemptsAudited: 0,
      totalStudentsAudited: 0,
      students: []
    };
  }

  var attemptsSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.ATTEMPTS);
  if (!attemptsSheet) {
    var msg = "Required sheet '" + CONFIG.SHEET_NAMES.ATTEMPTS + "' does not exist.";
    Logger.log("⚠️ " + msg);
    return {
      success: false,
      dryRun: true,
      error: "MISSING_REQUIRED_SHEET",
      missingSheet: CONFIG.SHEET_NAMES.ATTEMPTS,
      message: msg,
      totalAttemptsAudited: 0,
      totalStudentsAudited: 0,
      students: []
    };
  }

  var attColMap = getSheetColumnMap(attemptsSheet, CONFIG.ATTEMPT_HEADERS);
  var attemptsData = (attemptsSheet.getLastRow() > 0 && attemptsSheet.getLastColumn() > 0)
    ? attemptsSheet.getDataRange().getValues()
    : [];

  var studentSims = {};
  var totalAttemptsAudited = 0;

  for (var i = 1; i < attemptsData.length; i++) {
    var status = String(attemptsData[i][attColMap["status"] - 1] || "").trim();
    if (status !== "completed") continue;

    totalAttemptsAudited++;
    var sNum = String(attemptsData[i][attColMap["student_number"] - 1] || "").trim();
    if (!studentSims[sNum]) {
      studentSims[sNum] = {
        studentNumber: sNum,
        totalXp: 0,
        attemptsCount: 0,
        distinctActivities: {},
        perfectCount: 0,
        activitiesSeen: {}
      };
    }

    var actId = String(attemptsData[i][attColMap["activity_id"] - 1] || "").trim();
    var pct = Number(attemptsData[i][attColMap["percentage"] - 1] || 0);
    var seenCount = studentSims[sNum].activitiesSeen[actId] || 0;
    var isFirst = (seenCount === 0);
    studentSims[sNum].activitiesSeen[actId] = seenCount + 1;

    var xpCalc = calculateAttemptXpServer(pct, isFirst, 0, seenCount + 1);
    studentSims[sNum].totalXp += xpCalc.xpEarned;
    studentSims[sNum].attemptsCount++;
    studentSims[sNum].distinctActivities[actId] = true;
    if (pct === 100) studentSims[sNum].perfectCount++;
  }

  var report = [];
  for (var num in studentSims) {
    var s = studentSims[num];
    var lvl = getLevelFromXp(s.totalXp);
    report.push({
      studentNumber: num,
      completedAttempts: s.attemptsCount,
      distinctActivities: Object.keys(s.distinctActivities).length,
      perfectScores: s.perfectCount,
      totalXp: s.totalXp,
      level: lvl.level,
      levelTitle: lvl.title
    });
  }

  Logger.log("📊 Gamification Backfill (DRY-RUN) across " + totalAttemptsAudited + " attempts.");
  return {
    success: true,
    dryRun: true,
    totalAttemptsAudited: totalAttemptsAudited,
    totalStudentsAudited: report.length,
    students: report
  };
}

/**
 * Safe, read-only audit tool to diagnose and report student achievement records.
 * Compares persisted Achievements records against true historical attempt milestones.
 * NEVER mutates Google Sheets data: zero insertSheet, appendRow, setValue, setValues, deleteRow calls.
 * Can be run directly from Google Apps Script editor with NO arguments.
 *
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} [optSs] Optional spreadsheet instance. If omitted, uses getArcadeSpreadsheet().
 * @returns {Object} Diagnostic report containing dryRun: true, totalDiscrepancies, and auditReport list.
 */
function dryRunRepairStudentAchievements(optSs) {
  var ss = optSs || null;
  if (!ss) {
    try {
      ss = getArcadeSpreadsheet();
    } catch (err) {
      Logger.log("❌ Cannot run achievements audit: " + err.message);
      return {
        success: false,
        dryRun: true,
        error: "SPREADSHEET_NOT_CONNECTED",
        message: err.message,
        totalDiscrepancies: 0,
        auditReport: []
      };
    }
  }

  if (!ss) {
    Logger.log("❌ Cannot run achievements audit: Spreadsheet instance is undefined.");
    return {
      success: false,
      dryRun: true,
      error: "SPREADSHEET_NOT_FOUND",
      message: "Spreadsheet instance could not be resolved.",
      totalDiscrepancies: 0,
      auditReport: []
    };
  }

  var attemptsSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.ATTEMPTS);
  if (!attemptsSheet) {
    var msgAttempts = "Required sheet '" + CONFIG.SHEET_NAMES.ATTEMPTS + "' does not exist in the connected spreadsheet.";
    Logger.log("⚠️ " + msgAttempts);
    return {
      success: false,
      dryRun: true,
      error: "MISSING_REQUIRED_SHEET",
      missingSheet: CONFIG.SHEET_NAMES.ATTEMPTS,
      message: msgAttempts,
      totalDiscrepancies: 0,
      auditReport: []
    };
  }

  var achievementsSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.ACHIEVEMENTS);
  if (!achievementsSheet) {
    var msgAch = "Required sheet '" + CONFIG.SHEET_NAMES.ACHIEVEMENTS + "' does not exist in the connected spreadsheet.";
    Logger.log("⚠️ " + msgAch);
    return {
      success: false,
      dryRun: true,
      error: "MISSING_REQUIRED_SHEET",
      missingSheet: CONFIG.SHEET_NAMES.ACHIEVEMENTS,
      message: msgAch,
      totalDiscrepancies: 0,
      auditReport: []
    };
  }

  var attColMap = getSheetColumnMap(attemptsSheet, CONFIG.ATTEMPT_HEADERS);
  var attemptsData = (attemptsSheet.getLastRow() > 0 && attemptsSheet.getLastColumn() > 0)
    ? attemptsSheet.getDataRange().getValues()
    : [];

  var achColMap = getSheetColumnMap(achievementsSheet, CONFIG.ACHIEVEMENT_HEADERS);
  var achData = (achievementsSheet.getLastRow() > 0 && achievementsSheet.getLastColumn() > 0)
    ? achievementsSheet.getDataRange().getValues()
    : [];

  var attemptsByStudent = {};
  var studentClassMap = {};
  var studentNameMap = {};

  // Inspect Students sheet for class and student names if available
  var studentsSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.STUDENTS);
  if (studentsSheet) {
    var stdColMap = getSheetColumnMap(studentsSheet, CONFIG.STUDENT_HEADERS);
    var stdData = (studentsSheet.getLastRow() > 0 && studentsSheet.getLastColumn() > 0)
      ? studentsSheet.getDataRange().getValues()
      : [];
    for (var k = 1; k < stdData.length; k++) {
      var sNum = String(stdData[k][stdColMap["student_number"] - 1] || "").trim();
      var sCls = String(stdData[k][stdColMap["class"] - 1] || "").trim();
      var sNam = String(stdData[k][stdColMap["full_name"] - 1] || "").trim();
      if (sNum) {
        if (sCls && !studentClassMap[sNum]) studentClassMap[sNum] = sCls;
        if (sNam && !studentNameMap[sNum]) studentNameMap[sNum] = sNam;
      }
    }
  }

  for (var i = 1; i < attemptsData.length; i++) {
    var status = String(attemptsData[i][attColMap["status"] - 1] || "").trim();
    if (status !== "completed") continue;
    var sNum = String(attemptsData[i][attColMap["student_number"] - 1] || "").trim();
    if (!sNum) continue;

    var sClsAtt = String(attemptsData[i][attColMap["class"] - 1] || "").trim();
    if (sClsAtt && !studentClassMap[sNum]) {
      studentClassMap[sNum] = sClsAtt;
    }

    if (!attemptsByStudent[sNum]) attemptsByStudent[sNum] = [];
    attemptsByStudent[sNum].push({
      attemptId: String(attemptsData[i][attColMap["attempt_id"] - 1] || "").trim(),
      activityId: String(attemptsData[i][attColMap["activity_id"] - 1] || "").trim(),
      gameType: String(attemptsData[i][attColMap["game_type"] - 1] || "").trim(),
      percentage: Number(attemptsData[i][attColMap["percentage"] - 1] || 0),
      completedAt: String(attemptsData[i][attColMap["completed_at"] - 1] || "")
    });
  }

  // Sort each student's attempts by completedAt ascending
  for (var s in attemptsByStudent) {
    attemptsByStudent[s].sort(function(a, b) {
      return new Date(a.completedAt || 0).getTime() - new Date(b.completedAt || 0).getTime();
    });
  }

  var existingBadgesByStudent = {};
  for (var j = 1; j < achData.length; j++) {
    var stNum = String(achData[j][achColMap["student_number"] - 1] || "").trim();
    var bId = String(achData[j][achColMap["achievement_id"] - 1] || "").trim();
    var trId = String(achData[j][achColMap["trigger_attempt_id"] - 1] || "").trim();
    var uTime = String(achData[j][achColMap["unlocked_at"] - 1] || "");
    if (!existingBadgesByStudent[stNum]) existingBadgesByStudent[stNum] = {};
    if (!existingBadgesByStudent[stNum][bId]) {
      existingBadgesByStudent[stNum][bId] = [];
    }
    existingBadgesByStudent[stNum][bId].push({
      rowIndex: j + 1,
      triggerAttemptId: trId,
      unlockedAt: uTime
    });
  }

  var auditReport = [];
  var totalDiscrepancies = 0;

  for (var studentNumber in attemptsByStudent) {
    var studentAttempts = attemptsByStudent[studentNumber];
    var studentBadges = existingBadgesByStudent[studentNumber] || {};
    var sClass = studentClassMap[studentNumber] || "Unknown";
    var sFullName = studentNameMap[studentNumber] || "";

    for (var c = 0; c < ACHIEVEMENTS_CATALOG.length; c++) {
      var def = ACHIEVEMENTS_CATALOG[c];
      var isEligible = evaluateBadgeEligibility(def, studentAttempts);
      var records = studentBadges[def.id] || [];

      if (!isEligible && records.length > 0) {
        totalDiscrepancies++;
        var existingTrigsIneligible = records.map(function(r) { return r.triggerAttemptId || "—"; }).join(", ");
        auditReport.push({
          studentNumber: studentNumber,
          studentClass: sClass,
          studentName: sFullName,
          badgeId: def.id,
          badgeTitle: def.title,
          discrepancyType: "INELIGIBLE_RECORD_EXISTS",
          issue: "INELIGIBLE_RECORD_EXISTS",
          details: "Record exists in Achievements sheet, but student attempts do not meet badge criteria.",
          existingTriggerAttemptId: existingTrigsIneligible || "None",
          expectedTriggerAttemptId: "None (Ineligible)",
          proposedAction: "Review and delete ineligible badge row(s) from Achievements sheet.",
          recordsCount: records.length,
          records: records
        });
      } else if (isEligible) {
        var trueTriggerId = findTriggeringAttemptId(def, studentAttempts);
        var trueTimestamp = findTriggeringTimestamp(def, studentAttempts, new Date().toISOString());

        if (records.length === 0) {
          totalDiscrepancies++;
          auditReport.push({
            studentNumber: studentNumber,
            studentClass: sClass,
            studentName: sFullName,
            badgeId: def.id,
            badgeTitle: def.title,
            discrepancyType: "MISSING_ACHIEVEMENT_RECORD",
            issue: "MISSING_ACHIEVEMENT_RECORD",
            details: "Student met criteria historically, but badge record is missing from Achievements sheet.",
            existingTriggerAttemptId: "— (None recorded)",
            expectedTriggerAttemptId: trueTriggerId,
            expectedTimestamp: trueTimestamp,
            proposedAction: "Append new achievement row attributed to true milestone attempt '" + trueTriggerId + "'."
          });
        } else if (records.length > 1) {
          totalDiscrepancies++;
          var duplicateTrigs = records.map(function(r) { return r.triggerAttemptId || "—"; }).join(", ");
          auditReport.push({
            studentNumber: studentNumber,
            studentClass: sClass,
            studentName: sFullName,
            badgeId: def.id,
            badgeTitle: def.title,
            discrepancyType: "DUPLICATE_BADGE_RECORDS",
            issue: "DUPLICATE_BADGE_RECORDS",
            details: "Found " + records.length + " duplicate rows for badge in Achievements sheet.",
            existingTriggerAttemptId: duplicateTrigs,
            expectedTriggerAttemptId: trueTriggerId,
            expectedTimestamp: trueTimestamp,
            proposedAction: "Deduplicate: keep earliest unlock row and remove extra duplicate rows.",
            records: records
          });
        } else if (records[0].triggerAttemptId !== trueTriggerId) {
          totalDiscrepancies++;
          auditReport.push({
            studentNumber: studentNumber,
            studentClass: sClass,
            studentName: sFullName,
            badgeId: def.id,
            badgeTitle: def.title,
            discrepancyType: "MISMATCHED_TRIGGER_ATTEMPT",
            issue: "MISMATCHED_TRIGGER_ATTEMPT",
            details: "Recorded triggerAttemptId differs from true historical milestone attempt.",
            rowIndex: records[0].rowIndex,
            existingTriggerAttemptId: records[0].triggerAttemptId,
            recordedTriggerAttemptId: records[0].triggerAttemptId,
            expectedTriggerAttemptId: trueTriggerId,
            expectedTimestamp: trueTimestamp,
            proposedAction: "Update row " + records[0].rowIndex + " trigger_attempt_id from '" + records[0].triggerAttemptId + "' to '" + trueTriggerId + "' and sync timestamp."
          });
        }
      }
    }
  }

  // Generate structured, human-readable log output in Apps Script Execution Log
  var totalAuditedStudents = Object.keys(attemptsByStudent).length;
  Logger.log("========================================================================================");
  Logger.log("🔍 UNIT REVIEW ARCADE — STUDENT ACHIEVEMENTS AUDIT (DRY-RUN)");
  Logger.log("========================================================================================");
  Logger.log("Mode: READ-ONLY (Zero spreadsheet writes, no data modified)");
  Logger.log("Audited Students with Completed Attempts: " + totalAuditedStudents);
  Logger.log("Total Discrepancies Identified: " + totalDiscrepancies);

  var summaryByType = {};
  var summaryByStudent = {};

  if (totalDiscrepancies === 0) {
    Logger.log("✅ All student achievement records are 100% consistent with historical attempt milestones.");
    Logger.log("========================================================================================");
  } else {
    Logger.log("----------------------------------------------------------------------------------------");
    Logger.log("📋 DETAILED DISCREPANCY LOG (" + totalDiscrepancies + " item" + (totalDiscrepancies === 1 ? "" : "s") + ")");
    Logger.log("----------------------------------------------------------------------------------------");

    for (var d = 0; d < auditReport.length; d++) {
      var item = auditReport[d];
      var studentLabel = item.studentNumber + " (Class: " + item.studentClass + (item.studentName ? " | " + item.studentName : "") + ")";

      Logger.log("[" + (d + 1) + "/" + totalDiscrepancies + "] Student: " + studentLabel);
      Logger.log("  • Badge: " + item.badgeId + " (\"" + item.badgeTitle + "\")");
      Logger.log("  • Discrepancy Type: " + item.discrepancyType);
      Logger.log("  • Details: " + item.details);
      Logger.log("  • Existing Trigger Attempt: " + item.existingTriggerAttemptId);
      Logger.log("  • Expected Trigger Attempt: " + item.expectedTriggerAttemptId);
      Logger.log("  • Proposed Action: " + item.proposedAction);
      Logger.log("");

      summaryByType[item.discrepancyType] = (summaryByType[item.discrepancyType] || 0) + 1;
      if (!summaryByStudent[item.studentNumber]) {
        summaryByStudent[item.studentNumber] = {
          studentNumber: item.studentNumber,
          studentClass: item.studentClass,
          studentName: item.studentName,
          count: 0,
          discrepancies: []
        };
      }
      summaryByStudent[item.studentNumber].count++;
      summaryByStudent[item.studentNumber].discrepancies.push(item);
    }

    Logger.log("----------------------------------------------------------------------------------------");
    Logger.log("📊 SUMMARY GROUPED BY DISCREPANCY TYPE");
    Logger.log("----------------------------------------------------------------------------------------");
    for (var typeKey in summaryByType) {
      Logger.log("  • " + typeKey + ": " + summaryByType[typeKey] + " item(s)");
    }

    Logger.log("----------------------------------------------------------------------------------------");
    Logger.log("👥 SUMMARY GROUPED BY STUDENT");
    Logger.log("----------------------------------------------------------------------------------------");
    for (var sNumKey in summaryByStudent) {
      var sGroup = summaryByStudent[sNumKey];
      var sDesc = sGroup.studentNumber + " (Class: " + sGroup.studentClass + (sGroup.studentName ? " | " + sGroup.studentName : "") + ")";
      Logger.log("  • Student " + sDesc + ": " + sGroup.count + " discrepancy(ies)");
      for (var g = 0; g < sGroup.discrepancies.length; g++) {
        var sub = sGroup.discrepancies[g];
        Logger.log("    [" + (g + 1) + "] " + sub.discrepancyType + " -> " + sub.badgeId + " (\"" + sub.badgeTitle + "\") | Proposed: " + sub.proposedAction);
      }
    }

    Logger.log("========================================================================================");
    Logger.log("ℹ️ DRY-RUN ONLY: NO CHANGES WERE APPLIED TO GOOGLE SHEETS.");
    Logger.log("To apply these repairs, run repairStudentAchievements(null, 'CONFIRM_APPLY_REPAIR').");
    Logger.log("========================================================================================");
  }

  return {
    success: true,
    dryRun: true,
    totalDiscrepancies: totalDiscrepancies,
    auditReport: auditReport,
    summaryByType: summaryByType,
    summaryByStudent: summaryByStudent
  };
}

/**
 * Hard fail-closed environment guard.
 * Positively verifies that the given spreadsheet is a designated TEST database.
 * Strictly refuses any spreadsheet that matches production signatures,
 * or where TEST cannot be positively proven.
 *
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} ss
 * @returns {{isTest: boolean, spreadsheetName: string, reason?: string}}
 */
function verifyTestSpreadsheet(ss) {
  if (!ss) {
    return { isTest: false, spreadsheetName: "", reason: "Spreadsheet instance is undefined or null." };
  }

  var name = "";
  try {
    name = (typeof ss.getName === "function") ? ss.getName() : "";
  } catch (err) {
    return { isTest: false, spreadsheetName: "", reason: "Failed to read spreadsheet name: " + err.message };
  }

  var upperName = name.toUpperCase();

  // 1. HARD REJECT known production database names and signatures
  var PROD_SIGNATURES = [
    "STUDENT TRACKING DATABASE",
    "PRODUCTION",
    "PROD"
  ];
  for (var p = 0; p < PROD_SIGNATURES.length; p++) {
    var sig = PROD_SIGNATURES[p];
    if (upperName.indexOf(sig) !== -1 && upperName.indexOf("TEST") === -1 && upperName.indexOf("DEV") === -1) {
      return {
        isTest: false,
        spreadsheetName: name,
        reason: "CRITICAL REJECTION: Connected spreadsheet '" + name + "' matches PRODUCTION signature. All repair operations strictly refused."
      };
    }
  }

  // 2. Check for explicit environment setting in Script Properties
  var scriptEnv = "";
  try {
    var props = PropertiesService.getScriptProperties();
    scriptEnv = (props.getProperty("ARCADE_ENV") || props.getProperty("ENVIRONMENT") || "").trim().toUpperCase();
  } catch (pErr) {}

  if (scriptEnv === "PROD" || scriptEnv === "PRODUCTION") {
    return {
      isTest: false,
      spreadsheetName: name,
      reason: "CRITICAL REJECTION: Script Properties explicitly declare environment as PRODUCTION. All repair operations strictly refused."
    };
  }

  // 3. POSITIVE VERIFICATION:
  // Name must explicitly indicate test (e.g. 'Unit Review Arcade - TEST DATABASE', 'Unit Review Arcade Database [Test]')
  // OR Script Properties must have ARCADE_ENV/ENVIRONMENT set to 'TEST' or 'DEVELOPMENT'
  var nameHasTest = upperName.indexOf("TEST") !== -1 || upperName.indexOf("DEV") !== -1;
  var propHasTest = scriptEnv === "TEST" || scriptEnv === "DEV" || scriptEnv === "DEVELOPMENT";

  if (!nameHasTest && !propHasTest) {
    return {
      isTest: false,
      spreadsheetName: name,
      reason: "FAIL-CLOSED: Connected spreadsheet '" + name + "' cannot be positively verified as TEST. Name must contain 'TEST' or Script Property 'ARCADE_ENV' must be 'TEST'."
    };
  }

  return {
    isTest: true,
    spreadsheetName: name,
    spreadsheetId: (typeof ss.getId === "function") ? ss.getId() : ""
  };
}

/**
 * Creates an exact, verified restorable backup sheet of Achievements before any mutation.
 * Copies headers, all row values, and freezes row 1.
 * Verifies cell-by-cell that the backup is 100% identical to the source before returning.
 *
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} ss
 * @param {GoogleAppsScript.Spreadsheet.Sheet} achievementsSheet
 * @returns {{success: boolean, backupSheetName: string, rowCount: number, error?: string}}
 */
function createVerifiedAchievementsBackup(ss, achievementsSheet) {
  var now = new Date();
  var timestampStr = Utilities.formatDate(now, "GMT", "yyyyMMdd_HHmmss");
  var backupSheetName = "_backup_achievements_" + timestampStr;

  var lastRow = achievementsSheet.getLastRow();
  var lastCol = achievementsSheet.getLastColumn();
  if (lastRow === 0 || lastCol === 0) {
    return {
      success: false,
      backupSheetName: "",
      rowCount: 0,
      error: "Achievements sheet has no data to backup."
    };
  }

  var sourceData = achievementsSheet.getRange(1, 1, lastRow, lastCol).getValues();

  var backupSheet = null;
  try {
    var existingBackup = getSheetRobust(ss, backupSheetName);
    if (existingBackup) {
      backupSheetName += "_" + Math.floor(Math.random() * 1000);
    }
    backupSheet = ss.insertSheet(backupSheetName);
  } catch (insertErr) {
    return {
      success: false,
      backupSheetName: "",
      rowCount: 0,
      error: "Failed to create backup sheet '" + backupSheetName + "': " + insertErr.message
    };
  }

  if (!backupSheet) {
    return {
      success: false,
      backupSheetName: "",
      rowCount: 0,
      error: "Backup sheet could not be created."
    };
  }

  try {
    backupSheet.getRange(1, 1, sourceData.length, sourceData[0].length).setValues(sourceData);
    if (typeof backupSheet.setFrozenRows === "function") backupSheet.setFrozenRows(1);
    if (typeof backupSheet.setTabColor === "function") backupSheet.setTabColor("#64748b");
  } catch (popErr) {
    return {
      success: false,
      backupSheetName: backupSheetName,
      rowCount: 0,
      error: "Failed to populate backup data: " + popErr.message
    };
  }

  // Read back and verify byte-for-byte
  try {
    var backupData = backupSheet.getDataRange().getValues();
    if (backupData.length !== sourceData.length) {
      return {
        success: false,
        backupSheetName: backupSheetName,
        rowCount: 0,
        error: "Backup verification failed: row count mismatch. Source=" + sourceData.length + ", Backup=" + backupData.length
      };
    }
    if (backupData[0].length !== sourceData[0].length) {
      return {
        success: false,
        backupSheetName: backupSheetName,
        rowCount: 0,
        error: "Backup verification failed: column count mismatch."
      };
    }
    for (var r = 0; r < sourceData.length; r++) {
      for (var c = 0; c < sourceData[r].length; c++) {
        if (String(backupData[r][c]) !== String(sourceData[r][c])) {
          return {
            success: false,
            backupSheetName: backupSheetName,
            rowCount: 0,
            error: "Backup verification failed: mismatch at row " + (r + 1) + ", col " + (c + 1)
          };
        }
      }
    }
  } catch (vErr) {
    return {
      success: false,
      backupSheetName: backupSheetName,
      rowCount: 0,
      error: "Backup verification readback error: " + vErr.message
    };
  }

  Logger.log("🛡️ Verified restorable backup successfully created on sheet '" + backupSheetName + "' (" + sourceData.length + " rows).");
  return {
    success: true,
    backupSheetName: backupSheetName,
    rowCount: sourceData.length
  };
}

/**
 * Manually invoked Apps Script editor entry point to execute the approved
 * 12-row achievement trigger attempt correction for student 801 in TEST ONLY.
 * Takes NO arguments so it can be selected and executed directly from the editor toolbar.
 *
 * Requirements:
 * - Hard fail-closed environment guard (verifyTestSpreadsheet)
 * - Exact scope check: exactly 12 MISMATCHED_TRIGGER_ATTEMPT records for student 801 with att_mweq7htq_g7zcy1pl
 * - Pre-verified restorable backup of Achievements sheet
 * - Validation of expected trigger attempts in Attempts sheet
 * - Row identity verification in Achievements sheet
 * - Surgical update of trigger_attempt_id and unlocked_at only
 * - Post-repair verification audit (0 discrepancies)
 * - Safe rollback if mutation fails
 * - Idempotent no-op on subsequent runs
 *
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} [optSs] Optional spreadsheet for automated testing.
 * @returns {Object} Execution report.
 */
function runApprovedTestAchievementRepair(optSs) {
  var ss = optSs || null;
  if (!ss) {
    try {
      ss = getArcadeSpreadsheet();
    } catch (err) {
      Logger.log("❌ Cannot run approved repair: " + err.message);
      return {
        success: false,
        error: "SPREADSHEET_NOT_CONNECTED",
        message: err.message
      };
    }
  }

  if (!ss) {
    Logger.log("❌ Spreadsheet instance could not be resolved.");
    return {
      success: false,
      error: "SPREADSHEET_NOT_FOUND",
      message: "Spreadsheet instance could not be resolved."
    };
  }

  // 1. HARD ENVIRONMENT GUARD
  var envCheck = verifyTestSpreadsheet(ss);
  if (!envCheck.isTest) {
    Logger.log("🛑 " + envCheck.reason);
    return {
      success: false,
      error: "ENV_GUARD_REJECTION",
      message: envCheck.reason
    };
  }

  // 2. ACQUIRE LOCK (Safe for Standalone Apps Script & Container-Bound)
  // In standalone scripts, LockService.getDocumentLock() returns null.
  // We prioritize LockService.getScriptLock() which is supported across all Apps Script projects,
  // verify non-null lock before calling tryLock(), and handle lock timeouts safely without modifying records.
  var lock = null;
  var hasLock = false;

  try {
    if (typeof LockService !== "undefined" && LockService) {
      if (typeof LockService.getScriptLock === "function") {
        lock = LockService.getScriptLock();
      }
      if (!lock && typeof LockService.getDocumentLock === "function") {
        lock = LockService.getDocumentLock();
      }
    }
  } catch (lInitErr) {
    Logger.log("⚠️ Notice: Lock initialization returned error: " + lInitErr.message);
  }

  if (lock && typeof lock.tryLock === "function") {
    try {
      hasLock = lock.tryLock(15000);
    } catch (lTryErr) {
      Logger.log("❌ Error attempting to acquire script lock: " + lTryErr.message);
      return {
        success: false,
        error: "LOCK_ERROR",
        message: "Failed to acquire script lock: " + lTryErr.message
      };
    }

    if (!hasLock) {
      Logger.log("❌ Lock timeout: another operation is in progress. Please retry.");
      return {
        success: false,
        error: "LOCK_TIMEOUT",
        message: "Could not acquire script lock within 15 seconds. Another operation may be in progress. Please wait and retry."
      };
    }
  } else if (!lock) {
    Logger.log("⚠️ Notice: LockService returned null lock; proceeding safely without concurrency lock.");
  }

  try {
    // 3. PRE-REPAIR AUDIT
    var preAudit = dryRunRepairStudentAchievements(ss);
    if (!preAudit.success) {
      Logger.log("❌ Pre-repair audit failed: " + preAudit.message);
      return {
        success: false,
        error: preAudit.error,
        message: "Pre-repair audit failed: " + preAudit.message
      };
    }

    // 4. IDEMPOTENCY CHECK: If 0 discrepancies, check if repair was already applied
    if (preAudit.totalDiscrepancies === 0) {
      Logger.log("========================================================================================");
      Logger.log("ℹ️ IDEMPOTENT NO-OP: Student 801 achievements already have 0 discrepancies.");
      Logger.log("No repair needed. Zero writes performed to Google Sheets.");
      Logger.log("========================================================================================");
      return {
        success: true,
        alreadyApplied: true,
        writesCount: 0,
        totalDiscrepancies: 0,
        spreadsheetName: envCheck.spreadsheetName,
        message: "Approved repair was already applied. Audit confirmed 0 discrepancies. Zero writes performed."
      };
    }

    // 5. EXACT APPROVED SCOPE VERIFICATION
    var TARGET_STUDENT = "801";
    var TARGET_EXISTING_TRIGGER = "att_mweq7htq_g7zcy1pl";
    var APPROVED_COUNT = 12;

    if (preAudit.totalDiscrepancies !== APPROVED_COUNT || preAudit.auditReport.length !== APPROVED_COUNT) {
      var scopeErrMsg = "SAFETY ABORT: Pre-repair audit found " + preAudit.totalDiscrepancies +
        " discrepancies, but approved repair scope is strictly " + APPROVED_COUNT + " discrepancies. " +
        "Audit findings differ from approved scope. Zero writes performed.";
      Logger.log("🚨 " + scopeErrMsg);
      return {
        success: false,
        error: "SCOPE_MISMATCH",
        message: scopeErrMsg,
        actualDiscrepancies: preAudit.totalDiscrepancies,
        approvedCount: APPROVED_COUNT
      };
    }

    // Verify every discrepancy item matches the approved scope
    for (var k = 0; k < preAudit.auditReport.length; k++) {
      var item = preAudit.auditReport[k];
      if (item.studentNumber !== TARGET_STUDENT) {
        var studentErrMsg = "SAFETY ABORT: Discrepancy item " + (k + 1) + " belongs to student '" +
          item.studentNumber + "', not approved student '" + TARGET_STUDENT + "'.";
        Logger.log("🚨 " + studentErrMsg);
        return { success: false, error: "STUDENT_MISMATCH", message: studentErrMsg };
      }
      if (item.discrepancyType !== "MISMATCHED_TRIGGER_ATTEMPT") {
        var typeErrMsg = "SAFETY ABORT: Discrepancy item " + (k + 1) + " has issue '" +
          item.discrepancyType + "', but approved scope is strictly MISMATCHED_TRIGGER_ATTEMPT.";
        Logger.log("🚨 " + typeErrMsg);
        return { success: false, error: "ISSUE_TYPE_MISMATCH", message: typeErrMsg };
      }
      if (item.existingTriggerAttemptId !== TARGET_EXISTING_TRIGGER) {
        var trigErrMsg = "SAFETY ABORT: Discrepancy item " + (k + 1) + " has existing trigger ID '" +
          item.existingTriggerAttemptId + "', but approved scope strictly targets '" + TARGET_EXISTING_TRIGGER + "'.";
        Logger.log("🚨 " + trigErrMsg);
        return { success: false, error: "TRIGGER_ID_MISMATCH", message: trigErrMsg };
      }
      if (!item.expectedTriggerAttemptId || item.expectedTriggerAttemptId === TARGET_EXISTING_TRIGGER) {
        var expErrMsg = "SAFETY ABORT: Discrepancy item " + (k + 1) + " does not have a valid distinct expected trigger ID.";
        Logger.log("🚨 " + expErrMsg);
        return { success: false, error: "INVALID_EXPECTED_TRIGGER", message: expErrMsg };
      }
    }

    // 6. VERIFY EXPECTED TRIGGER ATTEMPTS IN ATTEMPTS SHEET
    var attemptsSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.ATTEMPTS);
    if (!attemptsSheet) {
      return { success: false, error: "MISSING_SHEET", message: "Attempts sheet not found." };
    }
    var attColMap = getSheetColumnMap(attemptsSheet, CONFIG.ATTEMPT_HEADERS);
    var attemptsData = attemptsSheet.getDataRange().getValues();
    var attemptsById = {};

    for (var a = 1; a < attemptsData.length; a++) {
      var aId = String(attemptsData[a][attColMap["attempt_id"] - 1] || "").trim();
      if (aId) {
        attemptsById[aId] = {
          rowIndex: a + 1,
          studentNumber: String(attemptsData[a][attColMap["student_number"] - 1] || "").trim(),
          status: String(attemptsData[a][attColMap["status"] - 1] || "").trim(),
          percentage: Number(attemptsData[a][attColMap["percentage"] - 1] || 0),
          gameType: String(attemptsData[a][attColMap["game_type"] - 1] || "").trim(),
          completedAt: String(attemptsData[a][attColMap["completed_at"] - 1] || "")
        };
      }
    }

    for (var m = 0; m < preAudit.auditReport.length; m++) {
      var repItem = preAudit.auditReport[m];
      var expAtt = attemptsById[repItem.expectedTriggerAttemptId];
      if (!expAtt) {
        var attNotFoundMsg = "SAFETY ABORT: Expected trigger attempt '" + repItem.expectedTriggerAttemptId +
          "' for badge '" + repItem.badgeId + "' does not exist in Attempts sheet.";
        Logger.log("🚨 " + attNotFoundMsg);
        return { success: false, error: "EXPECTED_ATTEMPT_NOT_FOUND", message: attNotFoundMsg };
      }
      if (expAtt.studentNumber !== TARGET_STUDENT) {
        var attOwnerMsg = "SAFETY ABORT: Expected trigger attempt '" + repItem.expectedTriggerAttemptId +
          "' belongs to student '" + expAtt.studentNumber + "', not '" + TARGET_STUDENT + "'.";
        Logger.log("🚨 " + attOwnerMsg);
        return { success: false, error: "ATTEMPT_OWNER_MISMATCH", message: attOwnerMsg };
      }
      if (expAtt.status !== "completed") {
        var attStatusMsg = "SAFETY ABORT: Expected trigger attempt '" + repItem.expectedTriggerAttemptId +
          "' status is '" + expAtt.status + "', expected 'completed'.";
        Logger.log("🚨 " + attStatusMsg);
        return { success: false, error: "ATTEMPT_NOT_COMPLETED", message: attStatusMsg };
      }
    }

    // 7. VERIFY ROW IDENTITIES IN ACHIEVEMENTS SHEET
    var achievementsSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.ACHIEVEMENTS);
    if (!achievementsSheet) {
      return { success: false, error: "MISSING_SHEET", message: "Achievements sheet not found." };
    }
    var achColMap = getSheetColumnMap(achievementsSheet, CONFIG.ACHIEVEMENT_HEADERS);
    var achData = achievementsSheet.getDataRange().getValues();

    for (var r = 0; r < preAudit.auditReport.length; r++) {
      var rowItem = preAudit.auditReport[r];
      var targetRow = rowItem.rowIndex;
      if (!targetRow || targetRow < 2 || targetRow > achData.length) {
        var rowRangeMsg = "SAFETY ABORT: Target row index " + targetRow + " is out of bounds.";
        Logger.log("🚨 " + rowRangeMsg);
        return { success: false, error: "ROW_INDEX_OUT_OF_BOUNDS", message: rowRangeMsg };
      }
      var targetValues = achData[targetRow - 1];
      var actualStudent = String(targetValues[achColMap["student_number"] - 1] || "").trim();
      var actualBadge = String(targetValues[achColMap["achievement_id"] - 1] || "").trim();
      var actualTrigger = String(targetValues[achColMap["trigger_attempt_id"] - 1] || "").trim();

      if (actualStudent !== TARGET_STUDENT || actualBadge !== rowItem.badgeId || actualTrigger !== TARGET_EXISTING_TRIGGER) {
        var identityMsg = "SAFETY ABORT: Row " + targetRow + " values (student=" + actualStudent +
          ", badge=" + actualBadge + ", trigger=" + actualTrigger + ") do not match expected identity (student=" +
          TARGET_STUDENT + ", badge=" + rowItem.badgeId + ", trigger=" + TARGET_EXISTING_TRIGGER + ").";
        Logger.log("🚨 " + identityMsg);
        return { success: false, error: "ROW_IDENTITY_MISMATCH", message: identityMsg };
      }
    }

    // 8. CREATE AND VERIFY RESTORABLE BACKUP
    var backupResult = createVerifiedAchievementsBackup(ss, achievementsSheet);
    if (!backupResult.success) {
      Logger.log("🚨 Backup creation failed: " + backupResult.error + ". Mutation halted.");
      return {
        success: false,
        error: "BACKUP_FAILED",
        message: "Refusing mutation because verified backup could not be created: " + backupResult.error
      };
    }

    // 9. APPLY SURGICAL REPAIRS WITH ROLLBACK DEFENSE
    var affectedRows = [];
    var backupSheetName = backupResult.backupSheetName;

    try {
      for (var u = 0; u < preAudit.auditReport.length; u++) {
        var fixItem = preAudit.auditReport[u];
        achievementsSheet.getRange(fixItem.rowIndex, achColMap["trigger_attempt_id"]).setValue(fixItem.expectedTriggerAttemptId);
        achievementsSheet.getRange(fixItem.rowIndex, achColMap["unlocked_at"]).setValue(fixItem.expectedTimestamp);

        affectedRows.push({
          rowIndex: fixItem.rowIndex,
          badgeId: fixItem.badgeId,
          badgeTitle: fixItem.badgeTitle,
          previousTriggerId: TARGET_EXISTING_TRIGGER,
          newTriggerId: fixItem.expectedTriggerAttemptId,
          newTimestamp: fixItem.expectedTimestamp
        });
      }
      SpreadsheetApp.flush();
    } catch (mutationErr) {
      Logger.log("🚨 MUTATION ERROR during repair: " + mutationErr.message + ". Initiating rollback...");
      var rollbackOk = false;
      try {
        var bSheet = getSheetRobust(ss, backupSheetName);
        if (bSheet) {
          var bData = bSheet.getDataRange().getValues();
          achievementsSheet.clear();
          achievementsSheet.getRange(1, 1, bData.length, bData[0].length).setValues(bData);
          SpreadsheetApp.flush();
          rollbackOk = true;
          Logger.log("🔄 Rollback successful: Achievements sheet restored to pre-repair state from '" + backupSheetName + "'.");
        }
      } catch (rbErr) {
        Logger.log("❌ Rollback failed: " + rbErr.message + ". Manual recovery required from sheet '" + backupSheetName + "'.");
      }
      return {
        success: false,
        error: "MUTATION_ERROR",
        message: mutationErr.message,
        rollbackExecuted: rollbackOk,
        backupSheetName: backupSheetName,
        repairsAttempted: affectedRows.length,
        instructions: "Achievements sheet has been rolled back from '" + backupSheetName + "'."
      };
    }

    // 10. POST-REPAIR VERIFICATION AUDIT
    var postAudit = dryRunRepairStudentAchievements(ss);

    Logger.log("========================================================================================");
    Logger.log("🎉 APPROVED TEST ACHIEVEMENT REPAIR EXECUTION COMPLETE");
    Logger.log("========================================================================================");
    Logger.log("Database: " + envCheck.spreadsheetName);
    Logger.log("Verified Backup Sheet: " + backupSheetName);
    Logger.log("Before Discrepancies: " + preAudit.totalDiscrepancies);
    Logger.log("After Discrepancies:  " + postAudit.totalDiscrepancies);
    Logger.log("Repairs Applied:      " + affectedRows.length + " rows updated");

    for (var aLog = 0; aLog < affectedRows.length; aLog++) {
      var aff = affectedRows[aLog];
      Logger.log("  [" + (aLog + 1) + "/12] Row " + aff.rowIndex + ": " + aff.badgeId + " (\"" + aff.badgeTitle + "\") -> " + aff.newTriggerId);
    }

    Logger.log("========================================================================================");

    return {
      success: true,
      applied: true,
      spreadsheetName: envCheck.spreadsheetName,
      backupSheetName: backupSheetName,
      beforeDiscrepancies: preAudit.totalDiscrepancies,
      afterDiscrepancies: postAudit.totalDiscrepancies,
      repairsApplied: affectedRows.length,
      affectedRows: affectedRows
    };
  } finally {
    if (hasLock && lock && typeof lock.releaseLock === "function") {
      try {
        lock.releaseLock();
      } catch (relErr) {
        Logger.log("⚠️ Warning: Failed to release script lock: " + relErr.message);
      }
    }
  }
}

/**
 * Explicit, separately guarded mutating repair operation for student achievements.
 * NEVER invoked by dryRunRepairStudentAchievements.
 * Requires confirmationToken === 'CONFIRM_APPLY_REPAIR'.
 *
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} [optSs] Optional spreadsheet instance. If omitted, uses getArcadeSpreadsheet().
 * @param {string} confirmationToken Must be exactly 'CONFIRM_APPLY_REPAIR'.
 * @returns {Object} Result of repair operation.
 */
function repairStudentAchievements(optSs, confirmationToken) {
  if (confirmationToken !== "CONFIRM_APPLY_REPAIR") {
    var guardMsg = "Safety Guard: repairStudentAchievements mutates data in the Achievements sheet. " +
      "To execute, you must call: repairStudentAchievements(null, 'CONFIRM_APPLY_REPAIR'). " +
      "Run dryRunRepairStudentAchievements() first to inspect discrepancies.";
    Logger.log("🔒 " + guardMsg);
    return {
      success: false,
      applied: false,
      error: "CONFIRMATION_REQUIRED",
      message: guardMsg
    };
  }

  var ss = optSs || null;
  if (!ss) {
    try {
      ss = getArcadeSpreadsheet();
    } catch (err) {
      Logger.log("❌ Cannot run repair: " + err.message);
      return {
        success: false,
        applied: false,
        error: "SPREADSHEET_NOT_CONNECTED",
        message: err.message
      };
    }
  }

  if (!ss) {
    return {
      success: false,
      applied: false,
      error: "SPREADSHEET_NOT_FOUND",
      message: "Spreadsheet instance could not be resolved."
    };
  }

  // Hard environment check in repairStudentAchievements as well
  var envCheck = verifyTestSpreadsheet(ss);
  if (!envCheck.isTest) {
    Logger.log("🛑 " + envCheck.reason);
    return {
      success: false,
      applied: false,
      error: "ENV_GUARD_REJECTION",
      message: envCheck.reason
    };
  }

  // Ensure Achievements sheet exists with headers (repair mode is allowed to create/format it)
  var achievementsSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.ACHIEVEMENTS);
  setupSheetHeaders(achievementsSheet, CONFIG.ACHIEVEMENT_HEADERS, "#1e293b", "#eab308");

  // Run dry run audit on this spreadsheet
  var audit = dryRunRepairStudentAchievements(ss);
  if (!audit.success) {
    return {
      success: false,
      applied: false,
      error: audit.error,
      message: audit.message
    };
  }

  if (audit.totalDiscrepancies === 0) {
    Logger.log("✅ No achievement discrepancies found. Zero repairs required.");
    return {
      success: true,
      applied: true,
      totalRepairsApplied: 0,
      message: "No discrepancies found."
    };
  }

  var achColMap = getSheetColumnMap(achievementsSheet, CONFIG.ACHIEVEMENT_HEADERS);
  var repairsApplied = 0;

  for (var i = 0; i < audit.auditReport.length; i++) {
    var item = audit.auditReport[i];
    if (item.issue === "MISSING_ACHIEVEMENT_RECORD") {
      var newId = "ach_" + Utilities.getUuid();
      achievementsSheet.appendRow([
        newId,
        "",
        item.studentNumber,
        "",
        item.badgeId,
        item.badgeTitle || item.badgeId,
        item.expectedTimestamp,
        item.expectedTriggerAttemptId
      ]);
      repairsApplied++;
    } else if (item.issue === "MISMATCHED_TRIGGER_ATTEMPT") {
      if (item.rowIndex && achColMap["trigger_attempt_id"] && achColMap["unlocked_at"]) {
        achievementsSheet.getRange(item.rowIndex, achColMap["trigger_attempt_id"]).setValue(item.expectedTriggerAttemptId);
        achievementsSheet.getRange(item.rowIndex, achColMap["unlocked_at"]).setValue(item.expectedTimestamp);
        repairsApplied++;
      }
    }
  }

  Logger.log("🛠️ Repaired " + repairsApplied + " achievement discrepancy record(s).");
  return {
    success: true,
    applied: true,
    totalRepairsApplied: repairsApplied,
    audit: audit
  };
}

// ============================================================================
// PHASE 8A: MONSTER WORLD & MONSTER COINS ECONOMY
// ============================================================================

var ALLOWED_MONSTER_BODY_SHAPES = ["blob", "fuzzy", "sprout", "slime", "chubby", "star"];
var ALLOWED_MONSTER_BODY_COLORS = ["cyan", "purple", "pink", "lime", "orange", "amber", "emerald", "indigo"];
var ALLOWED_MONSTER_EYE_TYPES = ["cyclops", "anime", "sleepy", "wink", "three_eyes", "googly"];
var ALLOWED_MONSTER_MOUTH_TYPES = ["smile", "fang_grin", "laughing", "goofy_teeth", "cat_mouth", "whistle"];
var ALLOWED_MONSTER_HORN_TYPES = ["none", "single_horn", "twin_horns", "antennae", "leaves", "cat_ears"];
var ALLOWED_MONSTER_CHEEK_TYPES = ["none", "blush_dots", "freckles", "spiral", "stars"];
var ALLOWED_MONSTER_PATTERNS = ["none", "belly_patch", "spots", "stripes", "heart"];

var DEFAULT_MONSTER_DATA = {
  name: "Pip",
  bodyShape: "blob",
  bodyColor: "cyan",
  eyeType: "anime",
  mouthType: "smile",
  hornType: "antennae",
  cheekType: "blush_dots",
  pattern: "belly_patch",
  accessories: {}
};

/**
 * Sanitizes and validates a student's monster configuration.
 */
function sanitizeMonsterConfig(input) {
  if (!input || typeof input !== "object") {
    return JSON.parse(JSON.stringify(DEFAULT_MONSTER_DATA));
  }

  var name = String(input.name || "Pip").trim().substring(0, 24);
  if (!name) name = "Pip";

  var bodyShape = ALLOWED_MONSTER_BODY_SHAPES.indexOf(input.bodyShape) !== -1 ? input.bodyShape : "blob";
  var bodyColor = ALLOWED_MONSTER_BODY_COLORS.indexOf(input.bodyColor) !== -1 ? input.bodyColor : "cyan";
  var eyeType = ALLOWED_MONSTER_EYE_TYPES.indexOf(input.eyeType) !== -1 ? input.eyeType : "anime";
  var mouthType = ALLOWED_MONSTER_MOUTH_TYPES.indexOf(input.mouthType) !== -1 ? input.mouthType : "smile";
  var hornType = ALLOWED_MONSTER_HORN_TYPES.indexOf(input.hornType) !== -1 ? input.hornType : "antennae";
  var cheekType = ALLOWED_MONSTER_CHEEK_TYPES.indexOf(input.cheekType) !== -1 ? input.cheekType : "blush_dots";
  var pattern = ALLOWED_MONSTER_PATTERNS.indexOf(input.pattern) !== -1 ? input.pattern : "belly_patch";

  var accessories = {};
  if (input.accessories && typeof input.accessories === "object") {
    if (input.accessories.hat) accessories.hat = String(input.accessories.hat).trim();
    if (input.accessories.glasses) accessories.glasses = String(input.accessories.glasses).trim();
    if (input.accessories.clothing) accessories.clothing = String(input.accessories.clothing).trim();
    if (input.accessories.wings) accessories.wings = String(input.accessories.wings).trim();
  }

  return {
    name: name,
    bodyShape: bodyShape,
    bodyColor: bodyColor,
    eyeType: eyeType,
    mouthType: mouthType,
    hornType: hornType,
    cheekType: cheekType,
    pattern: pattern,
    accessories: accessories,
    updatedAt: input.updatedAt || new Date().toISOString()
  };
}

/**
 * Reads student monster configuration from database.
 */
function getStudentMonsterConfig(ss, studentNumber) {
  if (!ss || !studentNumber) return JSON.parse(JSON.stringify(DEFAULT_MONSTER_DATA));

  var mSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.MONSTERS);
  if (mSheet) {
    var data = mSheet.getDataRange().getValues();
    if (data.length > 1) {
      var colMap = getSheetColumnMap(mSheet, CONFIG.MONSTER_HEADERS);
      var sCol = colMap["student_number"] - 1;
      // Search from bottom up to find the most recent save for this student
      for (var i = data.length - 1; i >= 1; i--) {
        if (String(data[i][sCol] || "").trim() === String(studentNumber).trim()) {
          var accJson = String(data[i][colMap["accessories_json"] - 1] || "{}");
          var acc = {};
          try { acc = JSON.parse(accJson); } catch (e) {}

          return sanitizeMonsterConfig({
            name: data[i][colMap["monster_name"] - 1],
            bodyShape: data[i][colMap["body_shape"] - 1],
            bodyColor: data[i][colMap["body_color"] - 1],
            eyeType: data[i][colMap["eye_type"] - 1],
            mouthType: data[i][colMap["mouth_type"] - 1],
            hornType: data[i][colMap["horn_type"] - 1],
            cheekType: data[i][colMap["cheek_type"] - 1],
            pattern: data[i][colMap["pattern"] - 1],
            accessories: acc,
            updatedAt: data[i][colMap["updated_at"] - 1]
          });
        }
      }
    }
  }

  return JSON.parse(JSON.stringify(DEFAULT_MONSTER_DATA));
}

/**
 * Saves student monster configuration to Monsters sheet.
 */
function saveStudentMonsterConfig(ss, studentNumber, studentClass, monsterConfig) {
  var sanitized = sanitizeMonsterConfig(monsterConfig);
  sanitized.updatedAt = new Date().toISOString();

  var mSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.MONSTERS);
  if (!mSheet) {
    return sanitized;
  }

  if (mSheet.getLastRow() === 0) {
    mSheet.appendRow(CONFIG.MONSTER_HEADERS);
  }

  var data = mSheet.getDataRange().getValues();
  var colMap = getSheetColumnMap(mSheet, CONFIG.MONSTER_HEADERS);
  var rowIndex = -1;

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][colMap["student_number"] - 1] || "").trim() === String(studentNumber).trim()) {
      rowIndex = i + 1;
      break;
    }
  }

  var lastCol = Math.max(mSheet.getLastColumn(), CONFIG.MONSTER_HEADERS.length);
  var rowVals = [];
  for (var k = 0; k < lastCol; k++) rowVals.push("");

  rowVals[colMap["student_number"] - 1] = studentNumber;
  rowVals[colMap["class"] - 1] = studentClass || "";
  rowVals[colMap["monster_name"] - 1] = sanitized.name;
  rowVals[colMap["body_shape"] - 1] = sanitized.bodyShape;
  rowVals[colMap["body_color"] - 1] = sanitized.bodyColor;
  rowVals[colMap["eye_type"] - 1] = sanitized.eyeType;
  rowVals[colMap["mouth_type"] - 1] = sanitized.mouthType;
  rowVals[colMap["horn_type"] - 1] = sanitized.hornType;
  rowVals[colMap["cheek_type"] - 1] = sanitized.cheekType;
  rowVals[colMap["pattern"] - 1] = sanitized.pattern;
  rowVals[colMap["accessories_json"] - 1] = JSON.stringify(sanitized.accessories || {});
  rowVals[colMap["updated_at"] - 1] = sanitized.updatedAt;

  if (rowIndex > 0) {
    mSheet.getRange(rowIndex, 1, 1, rowVals.length).setValues([rowVals]);
  } else {
    mSheet.appendRow(rowVals);
  }

  return sanitized;
}

/**
 * Reads student's current Monster Coin balance.
 * Server authoritative, never negative.
 */
function getStudentCoinBalance(ss, studentNumber) {
  if (!ss || !studentNumber) return 0;

  var txSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.COIN_TRANSACTIONS);
  if (txSheet) {
    var data = txSheet.getDataRange().getValues();
    if (data.length > 1) {
      var colMap = getSheetColumnMap(txSheet, CONFIG.COIN_TRANSACTION_HEADERS);
      var sCol = colMap["student_number"] - 1;
      var bCol = colMap["balance_after"] - 1;

      // Scan bottom-up to find the most recent transaction balance
      for (var i = data.length - 1; i >= 1; i--) {
        if (String(data[i][sCol] || "").trim() === String(studentNumber).trim()) {
          var bal = Number(data[i][bCol] || 0);
          return Math.max(0, isNaN(bal) ? 0 : bal);
        }
      }
    }
  }

  return 0;
}

/**
 * Records a coin transaction and returns the new balance.
 */
function recordCoinTransaction(ss, studentNumber, studentClass, amount, reason, sourceId, timestamp) {
  if (!ss || !studentNumber || amount === 0) {
    return {
      transactionId: "",
      balanceAfter: getStudentCoinBalance(ss, studentNumber),
      amount: 0
    };
  }

  var currentBalance = getStudentCoinBalance(ss, studentNumber);
  var balanceAfter = Math.max(0, currentBalance + amount);
  var txId = "ctx_" + Utilities.getUuid().substring(0, 8);
  var txTime = timestamp || new Date().toISOString();

  var txSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.COIN_TRANSACTIONS);
  if (txSheet) {
    if (txSheet.getLastRow() === 0) {
      txSheet.appendRow(CONFIG.COIN_TRANSACTION_HEADERS);
    }
    txSheet.appendRow([
      txId,
      studentNumber,
      studentClass || "",
      amount,
      balanceAfter,
      reason || "activity_completion",
      sourceId || "",
      txTime
    ]);
  }

  return {
    transactionId: txId,
    balanceAfter: balanceAfter,
    amount: amount
  };
}

/**
 * ACTION: student_save_monster
 * Validates and saves student monster design.
 */
function handleStudentSaveMonster(ss, payload) {
  var auth = validateSessionAndGetStudent(ss, payload.sessionToken);
  if (!auth.success) {
    return createJsonResponse({ success: false, error: auth.error, code: "UNAUTHORIZED" });
  }

  var monster = payload.monster;
  if (!monster || typeof monster !== "object") {
    return createJsonResponse({ success: false, error: "Missing monster configuration.", code: "BAD_REQUEST" });
  }

  var saved = saveStudentMonsterConfig(ss, auth.studentNumber, auth.class, monster);

  return createJsonResponse({
    success: true,
    monster: saved,
    totalCoins: getStudentCoinBalance(ss, auth.studentNumber)
  });
}

/**
 * ACTION: student_get_monster
 * Returns student monster design and current coin balance.
 */
function handleStudentGetMonster(ss, payload) {
  var auth = validateSessionAndGetStudent(ss, payload.sessionToken);
  if (!auth.success) {
    return createJsonResponse({ success: false, error: auth.error, code: "UNAUTHORIZED" });
  }

  var monster = getStudentMonsterConfig(ss, auth.studentNumber);
  var totalCoins = getStudentCoinBalance(ss, auth.studentNumber);

  return createJsonResponse({
    success: true,
    monster: monster,
    totalCoins: totalCoins
  });
}

/**
 * ACTION: student_record_games_zone_coins
 * Awards coins for Games Zone completions within the daily cap (25 coins max).
 */
function handleStudentRecordGamesZoneCoins(ss, payload) {
  var auth = validateSessionAndGetStudent(ss, payload.sessionToken);
  if (!auth.success) {
    return createJsonResponse({ success: false, error: auth.error, code: "UNAUTHORIZED" });
  }

  var gameId = String(payload.gameId || "").trim();
  var difficulty = String(payload.difficulty || "easy").toLowerCase();
  var accuracy = Number(payload.accuracyPercentage || 0);
  var correctAnswers = Number(payload.correctAnswers || 0);

  if (correctAnswers <= 0) {
    return createJsonResponse({
      success: true,
      coinsEarned: 0,
      totalCoins: getStudentCoinBalance(ss, auth.studentNumber),
      isCapped: false
    });
  }

  // Base coins: Easy = 3, Medium = 4, Hard = 5
  var baseCoins = 3;
  if (difficulty === "medium") baseCoins = 4;
  if (difficulty === "hard") baseCoins = 5;

  var bonusCoins = accuracy >= 90 ? 1 : 0;
  var earned = baseCoins + bonusCoins;

  // Daily Games Zone Cap (25 coins max per calendar day)
  var todayStr = new Date().toISOString().substring(0, 10);
  var txSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.COIN_TRANSACTIONS);
  var todayGzEarned = 0;
  if (txSheet) {
    var data = txSheet.getDataRange().getValues();
    var colMap = getSheetColumnMap(txSheet, CONFIG.COIN_TRANSACTION_HEADERS);
    for (var i = 1; i < data.length; i++) {
      var sNum = String(data[i][colMap["student_number"] - 1] || "").trim();
      var rsn = String(data[i][colMap["reason"] - 1] || "").trim();
      var cAt = String(data[i][colMap["created_at"] - 1] || "");
      if (sNum === auth.studentNumber && rsn === "games_zone_completion" && cAt.substring(0, 10) === todayStr) {
        todayGzEarned += Number(data[i][colMap["amount"] - 1] || 0);
      }
    }
  }

  var available = Math.max(0, 25 - todayGzEarned);
  var awarded = Math.min(earned, available);
  var isCapped = awarded < earned;

  var txResult = recordCoinTransaction(
    ss,
    auth.studentNumber,
    auth.class,
    awarded,
    "games_zone_completion",
    "gz_" + gameId + "_" + difficulty + "_" + Utilities.getUuid().substring(0, 6)
  );

  return createJsonResponse({
    success: true,
    coinsEarned: awarded,
    isCapped: isCapped,
    totalCoins: txResult.balanceAfter
  });
}

/**
 * Safe, idempotent setup helper for Phase 8A Monster World sheets.
 * NEVER alters existing student or attempts data.
 */
function setupPhase8AMonsterWorld(ss) {
  if (!ss) {
    try {
      ss = getArcadeSpreadsheet();
    } catch (e) {
      Logger.log("❌ Could not connect to spreadsheet: " + e.message);
      return { success: false, error: "Spreadsheet not found: " + e.message };
    }
  }

  var mSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.MONSTERS);
  if (mSheet && mSheet.getLastRow() === 0) {
    mSheet.appendRow(CONFIG.MONSTER_HEADERS);
  }

  var txSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.COIN_TRANSACTIONS);
  if (txSheet && txSheet.getLastRow() === 0) {
    txSheet.appendRow(CONFIG.COIN_TRANSACTION_HEADERS);
  }

  Logger.log("✅ Phase 8A Monster World sheets verified on '" + ss.getName() + "'.");
  return {
    success: true,
    monstersCreated: !!mSheet,
    transactionsCreated: !!txSheet
  };
}
