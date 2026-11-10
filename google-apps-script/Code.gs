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
    CURRICULUM: "Curriculum"
  },
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
    "content_version"
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
// STUDENT AUTHENTICATION LOGIC (PHASE 1)
// ============================================================================

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
      grade: grade === "7" || grade === 7 ? "grade-7" : "grade-8"
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
      grade = (g === "7" || g === 7) ? "grade-7" : "grade-8";
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
      grade: grade
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
    grade: matchedStudent[3] === "7" || matchedStudent[3] === 7 ? "grade-7" : "grade-8"
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
  newRow[colMap["grade_id"] - 1] = String(payload.gradeId || auth.grade || "");
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

  // Idempotency check: if attempt is already completed, return existing score safely
  var currentStatus = String(attemptRow[colMap["status"] - 1] || "").trim();
  if (currentStatus === "completed") {
    var existingScore = Number(attemptRow[colMap["score"] - 1] || 0);
    var existingPercentage = Number(attemptRow[colMap["percentage"] - 1] || 0);
    return createJsonResponse({
      success: true,
      attemptId: attemptId,
      status: "completed",
      score: existingScore,
      percentage: existingPercentage,
      message: "Attempt already completed."
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
  if (payload.percentage !== undefined) {
    percentage = Number(payload.percentage);
  } else if (totalQuestions > 0) {
    percentage = Math.round((correctAnswers / totalQuestions) * 100);
  } else {
    percentage = 0;
  }

  var duration = Number(payload.durationSeconds !== undefined ? payload.durationSeconds : attemptRow[colMap["duration_seconds"] - 1]);

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

  return createJsonResponse({
    success: true,
    attemptId: attemptId,
    status: "completed",
    score: score,
    percentage: percentage
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
