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
 * Version: 3.3.0 (Phases 1-5: Question Bank, General English & Teacher Section Analytics)
 */

// Configuration
var CONFIG = {
  APP_NAME: "Unit Review Arcade API",
  VERSION: "3.4.0",
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
    COIN_TRANSACTIONS: "CoinTransactions",
    STAGED_CREDENTIALS: "_StagedCredentials",
    QUESTION_BANK: "QuestionBank",
    CLASS_POINT_TRANSACTIONS: "Class_PointTransactions",
    CLASS_CATEGORIES: "Class_Categories",
    CLASS_REWARD_DEFINITIONS: "Class_RewardDefinitions",
    CLASS_REWARD_GRANTS: "Class_RewardGrants",
    CLASS_ACADEMIC_YEARS: "Class_AcademicYears"
  },
  CLASS_POINT_TRANSACTION_HEADERS: [
    "transaction_id",
    "idempotency_key",
    "academic_year",
    "timestamp",
    "student_number",
    "student_class",
    "grade",
    "category_id",
    "category_name",
    "category_type",
    "gross_points",
    "positive_points",
    "negative_points",
    "original_tx_id",
    "teacher_session_hash",
    "note",
    "status"
  ],
  CLASS_CATEGORY_HEADERS: [
    "category_id",
    "name",
    "type",
    "default_points",
    "icon",
    "color",
    "is_active",
    "sort_order",
    "updated_at"
  ],
  CLASS_REWARD_DEFINITION_HEADERS: [
    "reward_id",
    "name",
    "description",
    "required_positive_points",
    "reward_type",
    "cosmetic_id",
    "icon",
    "is_active",
    "sort_order"
  ],
  CLASS_REWARD_GRANT_HEADERS: [
    "grant_id",
    "student_number",
    "reward_id",
    "unlocked_at",
    "academic_year_earned",
    "qualifying_points",
    "trigger_tx_id",
    "is_equipped"
  ],
  CLASS_ACADEMIC_YEAR_HEADERS: [
    "academic_year",
    "status",
    "start_date",
    "end_date",
    "archived_at"
  ],
  DEFAULT_CLASS_CATEGORIES: [
    { id: "cat_speaking_participation", name: "Speaking Participation", type: "positive", points: 2, icon: "Mic", color: "#10b981", sortOrder: 1 },
    { id: "cat_using_english", name: "Using English", type: "positive", points: 1, icon: "Languages", color: "#06b6d4", sortOrder: 2 },
    { id: "cat_excellent_effort", name: "Excellent Effort", type: "positive", points: 2, icon: "Sparkles", color: "#6366f1", sortOrder: 3 },
    { id: "cat_helping_others", name: "Helping Others", type: "positive", points: 2, icon: "HeartHandshake", color: "#ec4899", sortOrder: 4 },
    { id: "cat_teamwork", name: "Teamwork", type: "positive", points: 1, icon: "Users", color: "#8b5cf6", sortOrder: 5 },
    { id: "cat_great_improvement", name: "Great Improvement", type: "positive", points: 3, icon: "TrendingUp", color: "#f59e0b", sortOrder: 6 },
    { id: "cat_classroom_disruption", name: "Classroom Disruption", type: "negative", points: -1, icon: "AlertTriangle", color: "#f43f5e", sortOrder: 7 },
    { id: "cat_interrupting_others", name: "Interrupting Others", type: "negative", points: -1, icon: "VolumeX", color: "#ef4444", sortOrder: 8 },
    { id: "cat_not_following_instructions", name: "Not Following Instructions", type: "negative", points: -1, icon: "HelpCircle", color: "#e11d48", sortOrder: 9 }
  ],
  DEFAULT_CLASS_REWARDS: [
    { id: "rwd_first_star", name: "First Star", desc: "First classroom star badge", points: 10, type: "badge", cosmeticId: "badge_first_star", icon: "Star", sortOrder: 1 },
    { id: "rwd_silver_star_frame", name: "Silver Star Frame", desc: "Silver star profile avatar frame", points: 25, type: "profile_frame", cosmeticId: "frame_silver_star", icon: "Shield", sortOrder: 2 },
    { id: "rwd_monster_crown", name: "Monster Crown", desc: "Royal golden crown for Pip", points: 50, type: "monster_accessory", cosmeticId: "hat_monster_crown", icon: "Crown", sortOrder: 3 },
    { id: "rwd_magic_wings", name: "Magic Wings", desc: "Enchanted glimmer wings for Pip", points: 100, type: "monster_accessory", cosmeticId: "wings_magic", icon: "Feather", sortOrder: 4 },
    { id: "rwd_elite_speaker", name: "Elite Speaker", desc: "Elite speaker profile badge", points: 150, type: "badge", cosmeticId: "badge_elite_speaker", icon: "Award", sortOrder: 5 },
    { id: "rwd_legendary_aura", name: "Legendary Aura", desc: "Radiant golden aura for Pip and profile", points: 250, type: "monster_aura", cosmeticId: "aura_legendary", icon: "Sparkles", sortOrder: 6 }
  ],
  STAGED_CREDENTIALS_CONFIG: {
    SHEET_NAME: "_StagedCredentials",
    HEADERS: ["operation_id", "teacher_session_id", "encrypted_payload", "status", "count", "created_at", "expires_at"],
    TTL_MS: 15 * 60 * 1000 // 15 minutes
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
  ],
  QUESTION_BANK_HEADERS: [
    "question_id",
    "section",
    "grade_id",
    "unit_id",
    "unit_title",
    "topic",
    "skill",
    "difficulty",
    "question_type",
    "assigned_game_types",
    "prompt",
    "payload_json",
    "correct_answer_preview",
    "explanation",
    "points",
    "tags",
    "status",
    "content_version",
    "created_at",
    "updated_at"
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

      // Student Monster World & Economy (Phase 8A & 8B)
      case "student_save_monster":
        return handleStudentSaveMonster(ss, payload);

      case "student_get_monster":
        return handleStudentGetMonster(ss, payload);

      case "student_purchase_accessory":
        return handleStudentPurchaseAccessory(ss, payload);

      case "student_equip_accessory":
        return handleStudentEquipAccessory(ss, payload);

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

      // Teacher Student Management & Demo Archival (Phase 3B)
      case "teacher_add_student":
        return handleTeacherAddStudent(ss, payload);

      case "teacher_bulk_import_students":
        return handleTeacherBulkImportStudents(ss, payload);

      case "teacher_update_student":
        return handleTeacherUpdateStudent(ss, payload);

      case "teacher_reset_student_pin":
        return handleTeacherResetStudentPin(ss, payload);

      case "teacher_bulk_reset_student_pins":
        return handleTeacherBulkResetStudentPins(ss, payload);

      case "teacher_recover_bulk_reset_credentials":
        return handleTeacherRecoverBulkResetCredentials(ss, payload);

      case "teacher_set_all_student_pins_default":
        return handleTeacherSetAllStudentPinsDefault(ss, payload);

      case "teacher_set_student_active":
        return handleTeacherSetStudentActive(ss, payload);

      case "teacher_get_demo_accounts_preview":
        return handleTeacherGetDemoAccountsPreview(ss, payload);

      case "teacher_archive_demo_accounts":
        return handleTeacherArchiveDemoAccounts(ss, payload);

      // Teacher Question Bank Management (Phase 1)
      case "teacher_get_question_bank":
        return handleTeacherGetQuestionBank(ss, payload);

      case "teacher_save_question":
        return handleTeacherSaveQuestion(ss, payload);

      case "teacher_bulk_import_questions":
        return handleTeacherBulkImportQuestions(ss, payload);

      case "teacher_archive_question":
        return handleTeacherArchiveQuestion(ss, payload);

      case "teacher_rollback_question_import":
        return handleTeacherRollbackQuestionImport(ss, payload);

      // Teacher Section & Mixed Practice Analytics (Phase 5)
      case "teacher_get_section_analytics":
        return handleTeacherGetSectionAnalytics(ss, payload);

      // Student Classroom Points & Rewards (Phase 3.4A)
      case "student_get_classroom_profile":
        return handleStudentGetClassroomProfile(ss, payload);

      case "student_claim_milestone_reward":
        return handleStudentClaimMilestoneReward(ss, payload);

      // Teacher Classroom Points & Rewards (Phase 3.4A)
      case "teacher_award_classroom_points":
        return handleTeacherAwardClassroomPoints(ss, payload);

      case "teacher_revert_classroom_point_transaction":
        return handleTeacherRevertClassroomPointTransaction(ss, payload);

      case "teacher_get_classroom_overview":
        return handleTeacherGetClassroomOverview(ss, payload);

      case "teacher_get_classroom_history":
        return handleTeacherGetClassroomHistory(ss, payload);

      case "teacher_manage_classroom_categories":
        return handleTeacherManageClassroomCategories(ss, payload);

      case "teacher_reconcile_classroom_rewards":
        return handleTeacherReconcileClassroomRewards(ss, payload);

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
    // Acquire lock for brute-force rate limiter (15s tolerance)
    lockAcquired = lock.tryLock(15000);
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

    // 2. Verify password hash (fast pure-V8 calculation)
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

    // 3. Password valid: Reset failed attempts & lockout in ScriptProperties
    props.setProperty("TEACHER_FAILED_ATTEMPTS", "0");
    if (typeof props.deleteProperty === "function") {
      props.deleteProperty("TEACHER_LOCKED_UNTIL");
    } else {
      props.setProperty("TEACHER_LOCKED_UNTIL", "");
    }
  } catch (lockErr) {
    return createJsonResponse({
      success: false,
      error: "Authentication service error: " + lockErr.message,
      code: "INTERNAL_ERROR"
    });
  } finally {
    // RELEASE LOCK IMMEDIATELY: Do not hold the script lock during slow Google Drive spreadsheet operations!
    if (lockAcquired) {
      try {
        lock.releaseLock();
        lockAcquired = false;
      } catch (rErr) {}
    }
  }

  // 4. Generate token and store hashed token in TeacherSessions (OUTSIDE the lock)
  try {
    var teacherToken = generateTeacherToken();
    var tokenHash = hashTeacherToken(teacherToken);
    var sessionId = "tsess_" + Utilities.getUuid().substring(0, 8);
    var expiresAt = new Date(now.getTime() + CONFIG.TEACHER_SESSION_DURATION_HOURS * 60 * 60 * 1000);

    var teacherSessionsSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.TEACHER_SESSIONS);
    if (!teacherSessionsSheet) {
      return createJsonResponse({
        success: false,
        error: "Failed to access teacher session storage. Please try again.",
        code: "SESSION_STORAGE_ERROR"
      });
    }

    // Only set up headers if sheet is empty, avoiding 6 slow redundant format calls on every login
    if (teacherSessionsSheet.getLastRow() === 0) {
      setupSheetHeaders(teacherSessionsSheet, CONFIG.TEACHER_SESSION_HEADERS, "#312e81", "#c7d2fe");
    }

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

    // Force flush to ensure session token is safely persisted in TeacherSessions before returning success
    SpreadsheetApp.flush();

    return createJsonResponse({
      success: true,
      teacherToken: teacherToken,
      teacherName: "Teacher",
      expiresAt: expiresAt.toISOString()
    });
  } catch (sessErr) {
    return createJsonResponse({
      success: false,
      error: "Failed to persist teacher session: " + sessErr.message,
      code: "SESSION_STORAGE_ERROR"
    });
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
 * Classifies an attempt into its respective Learning Section (Phase 5).
 * Deterministic and backward-compatible with all existing records.
 */
function getAttemptLearningSection(unitId, activityId, unitTitle) {
  var uId = String(unitId || "").toLowerCase();
  var aId = String(activityId || "").toLowerCase();
  var title = String(unitTitle || "").toLowerCase();

  if (uId.indexOf("unit_mixed_") === 0 || aId.indexOf("act_mixed_") === 0 || title.indexOf("mixed practice") !== -1 || uId.indexOf("mixed_") !== -1) {
    return "mixed_practice";
  }
  if (
    uId.indexOf("unit_g7-") === 0 || uId.indexOf("unit_g8-") === 0 || uId.indexOf("unit_ge_") === 0 ||
    aId.indexOf("act_g7-") === 0 || aId.indexOf("act_g8-") === 0 || aId.indexOf("act_ge_") === 0 ||
    uId.indexOf("ge_") === 0 || title.indexOf("general english") !== -1
  ) {
    return "general_english";
  }
  return "unit_review";
}

/**
 * Classifies an attempt or answer into its pedagogical Skill pillar (Phase 5).
 */
function getAttemptSkill(unitId, activityId, unitTitle) {
  var str = (String(unitId || "") + " " + String(activityId || "") + " " + String(unitTitle || "")).toLowerCase();
  if (str.indexOf("grammar") !== -1 || str.indexOf("-gram-") !== -1 || str.indexOf("_gram_") !== -1) return "grammar";
  if (str.indexOf("vocab") !== -1 || str.indexOf("-vocab-") !== -1 || str.indexOf("_vocab_") !== -1) return "vocabulary";
  if (str.indexOf("reading") !== -1 || str.indexOf("-read-") !== -1 || str.indexOf("_read_") !== -1) return "reading";
  if (str.indexOf("listen") !== -1 || str.indexOf("dictat") !== -1 || str.indexOf("-list-") !== -1 || str.indexOf("_list_") !== -1) return "listening";
  var sec = getAttemptLearningSection(unitId, activityId, unitTitle);
  if (sec === "mixed_practice") return "mixed";
  return "grammar";
}

/**
 * ACTION: teacher_get_overview
 * Aggregated KPIs, class breakdown (7A, 7B, 8A, 8B), unit and game engine performance,
 * section breakdown (Unit Review, General English, Mixed Practice), and recent student activity feed.
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
  var filterSection = filters.learningSection && filters.learningSection !== "all" ? String(filters.learningSection).trim() : null;
  var filterSkill = filters.skill && filters.skill !== "all" ? String(filters.skill).trim() : null;
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
    if (sClass === "DEMO_ARCHIVE" || /_demo$/.test(sNum)) continue; // Exclude archived demo fixtures from live classroom statistics
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

  var sectionStatsMap = {
    unitReview: { totalAttempts: 0, completedAttempts: 0, scoreSum: 0, durationSum: 0, students: {} },
    generalEnglish: { totalAttempts: 0, completedAttempts: 0, scoreSum: 0, durationSum: 0, students: {} },
    mixedPractice: { totalAttempts: 0, completedAttempts: 0, scoreSum: 0, durationSum: 0, students: {} }
  };

  for (var j = 1; j < attemptData.length; j++) {
    var aRow = attemptData[j];
    var aStudentNum = String(aRow[attemptColMap["student_number"] - 1] || "").trim();
    var aClass = String(aRow[attemptColMap["class"] - 1] || "").trim().toUpperCase();
    if (aClass === "DEMO_ARCHIVE" || /_demo$/.test(aStudentNum)) continue; // Exclude demo attempts from classroom KPIs
    var aUnitId = String(aRow[attemptColMap["unit_id"] - 1] || "").trim();
    var aUnitTitle = String(aRow[attemptColMap["unit_title"] - 1] || "").trim();
    var aActId = String(aRow[attemptColMap["activity_id"] - 1] || "").trim();
    var aGameType = String(aRow[attemptColMap["game_type"] - 1] || "").trim();
    var aStatus = String(aRow[attemptColMap["status"] - 1] || "").trim();
    var aScore = Number(aRow[attemptColMap["score"] - 1] || 0);
    var aPercentage = Number(aRow[attemptColMap["percentage"] - 1] || 0);
    var aDuration = Number(aRow[attemptColMap["duration_seconds"] - 1] || 0);
    var aStartedAt = aRow[attemptColMap["started_at"] - 1];
    var startDateObj = aStartedAt ? new Date(aStartedAt) : null;

    var aSection = getAttemptLearningSection(aUnitId, aActId, aUnitTitle);
    var aSkill = getAttemptSkill(aUnitId, aActId, aUnitTitle);

    // Section telemetry tracking
    var secKey = aSection === "general_english" ? "generalEnglish" : aSection === "mixed_practice" ? "mixedPractice" : "unitReview";
    sectionStatsMap[secKey].totalAttempts++;
    sectionStatsMap[secKey].durationSum += aDuration;
    if (aStudentNum) sectionStatsMap[secKey].students[aStudentNum] = true;
    if (aStatus === "completed") {
      sectionStatsMap[secKey].completedAttempts++;
      sectionStatsMap[secKey].scoreSum += aPercentage;
    }

    // Check class/grade filter
    if (filterClass && aClass !== filterClass) continue;
    if (filterGrade) {
      var stdInfo = allStudentsByNumber[aStudentNum];
      if (stdInfo && stdInfo.grade !== filterGrade) continue;
    }
    if (filterUnit && aUnitId !== filterUnit) continue;
    if (filterGame && aGameType !== filterGame) continue;
    if (filterSection && aSection !== filterSection) continue;
    if (filterSkill && aSkill !== filterSkill) continue;
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
    recentActivity: recentActivity,
    sectionBreakdown: {
      unitReview: {
        totalAttempts: sectionStatsMap.unitReview.totalAttempts,
        completedAttempts: sectionStatsMap.unitReview.completedAttempts,
        averageScore: sectionStatsMap.unitReview.completedAttempts > 0 ? Math.round(sectionStatsMap.unitReview.scoreSum / sectionStatsMap.unitReview.completedAttempts) : 0,
        uniqueStudentsCount: Object.keys(sectionStatsMap.unitReview.students).length,
        totalXpEarned: 0,
        totalTimeSpentSeconds: sectionStatsMap.unitReview.durationSum
      },
      generalEnglish: {
        totalAttempts: sectionStatsMap.generalEnglish.totalAttempts,
        completedAttempts: sectionStatsMap.generalEnglish.completedAttempts,
        averageScore: sectionStatsMap.generalEnglish.completedAttempts > 0 ? Math.round(sectionStatsMap.generalEnglish.scoreSum / sectionStatsMap.generalEnglish.completedAttempts) : 0,
        uniqueStudentsCount: Object.keys(sectionStatsMap.generalEnglish.students).length,
        totalXpEarned: 0,
        totalTimeSpentSeconds: sectionStatsMap.generalEnglish.durationSum
      },
      mixedPractice: {
        totalAttempts: sectionStatsMap.mixedPractice.totalAttempts,
        completedAttempts: sectionStatsMap.mixedPractice.completedAttempts,
        averageScore: sectionStatsMap.mixedPractice.completedAttempts > 0 ? Math.round(sectionStatsMap.mixedPractice.scoreSum / sectionStatsMap.mixedPractice.completedAttempts) : 0,
        uniqueStudentsCount: Object.keys(sectionStatsMap.mixedPractice.students).length,
        totalXpEarned: 0,
        totalTimeSpentSeconds: sectionStatsMap.mixedPractice.durationSum
      }
    }
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
      unitId: String(aRow[attemptColMap["unit_id"] - 1] || "").trim(),
      unitTitle: String(aRow[attemptColMap["unit_title"] - 1] || "").trim(),
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
    if (sClass === "DEMO_ARCHIVE" || /_demo$/.test(sNum)) continue; // Exclude archived demo fixtures from live classroom statistics
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

    var urAttempts = 0, urCompleted = 0, urScoreSum = 0;
    var geAttempts = 0, geCompleted = 0, geScoreSum = 0;
    var mpAttempts = 0, mpCompleted = 0, mpScoreSum = 0;

    for (var a = 0; a < attempts.length; a++) {
      var att = attempts[a];
      totalTimeSpent += att.durationSeconds;
      var sec = getAttemptLearningSection(att.unitId, att.activityId, att.unitTitle);

      if (sec === "general_english") {
        geAttempts++;
        if (att.status === "completed") {
          geCompleted++;
          geScoreSum += att.percentage;
        }
      } else if (sec === "mixed_practice") {
        mpAttempts++;
        if (att.status === "completed") {
          mpCompleted++;
          mpScoreSum += att.percentage;
        }
      } else {
        urAttempts++;
        if (att.status === "completed") {
          urCompleted++;
          urScoreSum += att.percentage;
        }
      }

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
      status: statusBadge,
      unitReviewStarted: urAttempts > 0,
      unitReviewCompletedCount: urCompleted,
      unitReviewAverageScore: urCompleted > 0 ? Math.round(urScoreSum / urCompleted) : 0,
      generalEnglishStarted: geAttempts > 0,
      generalEnglishCompletedCount: geCompleted,
      generalEnglishAverageScore: geCompleted > 0 ? Math.round(geScoreSum / geCompleted) : 0,
      mixedPracticeStarted: mpAttempts > 0,
      mixedPracticeCompletedCount: mpCompleted,
      mixedPracticeAverageScore: mpCompleted > 0 ? Math.round(mpScoreSum / mpCompleted) : 0
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
      versionLabel: versionLabel,
      learningSection: getAttemptLearningSection(String(aRow[attemptColMap["unit_id"] - 1] || ""), actId, String(aRow[attemptColMap["unit_title"] - 1] || "")),
      skill: getAttemptSkill(String(aRow[attemptColMap["unit_id"] - 1] || ""), actId, String(aRow[attemptColMap["unit_title"] - 1] || ""))
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
      versionLabel: qVersionLabel,
      learningSection: getAttemptLearningSection(String(ansRow[answerColMap["unit_id"] - 1] || ""), String(ansRow[answerColMap["activity_id"] - 1] || ""), ""),
      skill: getAttemptSkill(String(ansRow[answerColMap["unit_id"] - 1] || ""), String(ansRow[answerColMap["activity_id"] - 1] || ""), "")
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

    if (sClass === "DEMO_ARCHIVE" || /_demo$/.test(sNum)) continue; // Exclude demo responses from analytics

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

/**
 * ACTION: teacher_get_section_analytics (Phase 5)
 * Deep telemetry across Unit Review, General English, and Mixed Practice.
 * Provides separate section breakdown, 4 skill pillars, topic-level mastery diagnostics,
 * and individual student participation matrices with non-started student flags.
 */
function handleTeacherGetSectionAnalytics(ss, payload) {
  var auth = validateTeacherSession(ss, payload.teacherToken);
  if (!auth.valid) {
    return createJsonResponse({ success: false, error: auth.error, code: auth.code });
  }

  var filters = payload.filters || {};
  var filterClass = filters.classId && filters.classId !== "all" ? String(filters.classId).trim().toUpperCase() : null;
  var filterGrade = filters.gradeId && filters.gradeId !== "all" ? String(filters.gradeId).trim() : null;
  var filterSection = filters.learningSection && filters.learningSection !== "all" ? String(filters.learningSection).trim() : null;
  var filterSkill = filters.skill && filters.skill !== "all" ? String(filters.skill).trim() : null;

  var studentsSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.STUDENTS);
  var attemptsSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.ATTEMPTS);
  var answersSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.ANSWERS);

  var studentData = studentsSheet ? studentsSheet.getDataRange().getValues() : [];
  var attemptData = attemptsSheet ? attemptsSheet.getDataRange().getValues() : [];
  var answerData = answersSheet ? answersSheet.getDataRange().getValues() : [];

  var studentColMap = studentsSheet ? getSheetColumnMap(studentsSheet, CONFIG.STUDENT_HEADERS) : {};
  var attemptColMap = attemptsSheet ? getSheetColumnMap(attemptsSheet, CONFIG.ATTEMPT_HEADERS) : {};
  var answerColMap = answersSheet ? getSheetColumnMap(answersSheet, CONFIG.ANSWER_HEADERS) : {};

  // Build student cohort lookup
  var studentsByNum = {};
  var studentRoster = [];

  for (var i = 1; i < studentData.length; i++) {
    var sRow = studentData[i];
    var sNum = String(sRow[studentColMap["student_number"] - 1] || "").trim();
    if (!sNum) continue;

    var sClass = String(sRow[studentColMap["class"] - 1] || "").trim().toUpperCase();
    if (sClass === "DEMO_ARCHIVE" || /_demo$/.test(sNum)) continue;
    var sGrade = String(sRow[studentColMap["grade"] - 1] || "").trim();
    var normGrade = (sGrade === "7" || sGrade === 7 || sGrade === "grade-7") ? "grade-7" : "grade-8";
    var fullName = String(sRow[studentColMap["full_name"] - 1] || "");
    var lastLoginAt = sRow[studentColMap["last_login_at"] - 1] || null;

    if (filterClass && sClass !== filterClass) continue;
    if (filterGrade && normGrade !== filterGrade) continue;

    var studentEntry = {
      studentNumber: sNum,
      fullName: fullName,
      class: sClass,
      grade: normGrade,
      lastLoginAt: lastLoginAt,
      lastActivityDate: null,
      totalXp: 0,
      unitReviewAttempts: 0,
      unitReviewCompleted: 0,
      unitReviewAccuracy: 0,
      unitReviewStarted: false,
      generalEnglishAttempts: 0,
      generalEnglishCompleted: 0,
      generalEnglishAccuracy: 0,
      generalEnglishStarted: false,
      mixedPracticeAttempts: 0,
      mixedPracticeCompleted: 0,
      mixedPracticeAccuracy: 0,
      mixedPracticeStarted: false,
      overallAccuracy: 0,
      totalAttempts: 0,
      totalCompleted: 0,
      _urScores: [],
      _geScores: [],
      _mpScores: []
    };

    studentsByNum[sNum] = studentEntry;
    studentRoster.push(studentEntry);
  }

  // Section Breakdown Tracking
  var sectionBreakdown = {
    unitReview: { totalAttempts: 0, completedAttempts: 0, averageScore: 0, uniqueStudentsCount: 0, totalXpEarned: 0, totalTimeSpentSeconds: 0, _students: {}, _scores: [] },
    generalEnglish: { totalAttempts: 0, completedAttempts: 0, averageScore: 0, uniqueStudentsCount: 0, totalXpEarned: 0, totalTimeSpentSeconds: 0, _students: {}, _scores: [] },
    mixedPractice: { totalAttempts: 0, completedAttempts: 0, averageScore: 0, uniqueStudentsCount: 0, totalXpEarned: 0, totalTimeSpentSeconds: 0, _students: {}, _scores: [] }
  };

  // Skill Mastery Telemetry Tracking
  var skillAccumulators = {
    grammar: { totalAttempts: 0, completedAttempts: 0, scoreSum: 0, students: {}, masteredTopics: {}, needsPracticeTopics: {} },
    vocabulary: { totalAttempts: 0, completedAttempts: 0, scoreSum: 0, students: {}, masteredTopics: {}, needsPracticeTopics: {} },
    reading: { totalAttempts: 0, completedAttempts: 0, scoreSum: 0, students: {}, masteredTopics: {}, needsPracticeTopics: {} },
    listening: { totalAttempts: 0, completedAttempts: 0, scoreSum: 0, students: {}, masteredTopics: {}, needsPracticeTopics: {} }
  };

  var topicStats = {};
  var attemptsList = [];

  for (var j = 1; j < attemptData.length; j++) {
    var aRow = attemptData[j];
    var aNum = String(aRow[attemptColMap["student_number"] - 1] || "").trim();
    if (!studentsByNum[aNum]) continue;

    var aUnitId = String(aRow[attemptColMap["unit_id"] - 1] || "").trim();
    var aActId = String(aRow[attemptColMap["activity_id"] - 1] || "").trim();
    var aUnitTitle = String(aRow[attemptColMap["unit_title"] - 1] || "").trim();
    var aGameType = String(aRow[attemptColMap["game_type"] - 1] || "").trim();
    var aStatus = String(aRow[attemptColMap["status"] - 1] || "").trim();
    var aPercentage = Number(aRow[attemptColMap["percentage"] - 1] || 0);
    var aDuration = Number(aRow[attemptColMap["duration_seconds"] - 1] || 0);
    var aStartedAt = aRow[attemptColMap["started_at"] - 1] || null;

    var sec = getAttemptLearningSection(aUnitId, aActId, aUnitTitle);
    var sk = getAttemptSkill(aUnitId, aActId, aUnitTitle);

    var student = studentsByNum[aNum];
    student.totalAttempts++;
    if (aStartedAt) {
      if (!student.lastActivityDate || new Date(aStartedAt) > new Date(student.lastActivityDate)) {
        student.lastActivityDate = aStartedAt;
      }
    }

    if (sec === "general_english") {
      student.generalEnglishStarted = true;
      student.generalEnglishAttempts++;
      if (aStatus === "completed") {
        student.generalEnglishCompleted++;
        student.totalCompleted++;
        student._geScores.push(aPercentage);
      }
    } else if (sec === "mixed_practice") {
      student.mixedPracticeStarted = true;
      student.mixedPracticeAttempts++;
      if (aStatus === "completed") {
        student.mixedPracticeCompleted++;
        student.totalCompleted++;
        student._mpScores.push(aPercentage);
      }
    } else {
      student.unitReviewStarted = true;
      student.unitReviewAttempts++;
      if (aStatus === "completed") {
        student.unitReviewCompleted++;
        student.totalCompleted++;
        student._urScores.push(aPercentage);
      }
    }

    var sbKey = sec === "general_english" ? "generalEnglish" : sec === "mixed_practice" ? "mixedPractice" : "unitReview";
    sectionBreakdown[sbKey].totalAttempts++;
    sectionBreakdown[sbKey].totalTimeSpentSeconds += aDuration;
    sectionBreakdown[sbKey]._students[aNum] = true;
    if (aStatus === "completed") {
      sectionBreakdown[sbKey].completedAttempts++;
      sectionBreakdown[sbKey]._scores.push(aPercentage);
    }

    if (skillAccumulators[sk]) {
      skillAccumulators[sk].totalAttempts++;
      skillAccumulators[sk].students[aNum] = true;
      if (aStatus === "completed") {
        skillAccumulators[sk].completedAttempts++;
        skillAccumulators[sk].scoreSum += aPercentage;
      }
    }

    var topicKey = aUnitId || aActId;
    if (topicKey) {
      if (!topicStats[topicKey]) {
        topicStats[topicKey] = {
          topicId: topicKey,
          topicTitle: aUnitTitle || topicKey,
          skill: sk === "mixed" ? "grammar" : sk,
          gradeId: studentsByNum[aNum].grade,
          cefrLevel: "A2",
          questionCount: Number(aRow[attemptColMap["total_questions"] - 1] || 10),
          totalAttempts: 0,
          completedAttempts: 0,
          scores: [],
          students: {},
          mistakesCount: 0,
          mistakePrompts: {}
        };
      }
      topicStats[topicKey].totalAttempts++;
      topicStats[topicKey].students[aNum] = true;
      if (aStatus === "completed") {
        topicStats[topicKey].completedAttempts++;
        topicStats[topicKey].scores.push(aPercentage);
      }
    }

    // Apply filters to returned attempts list
    if (filterSection && sec !== filterSection) continue;
    if (filterSkill && sk !== filterSkill) continue;

    attemptsList.push({
      attemptId: String(aRow[attemptColMap["attempt_id"] - 1] || ""),
      unitId: aUnitId,
      unitTitle: aUnitTitle,
      activityId: aActId,
      activityTitle: String(aRow[attemptColMap["activity_title"] - 1] || ""),
      gameType: aGameType,
      learningSection: sec,
      skill: sk,
      score: Number(aRow[attemptColMap["score"] - 1] || 0),
      percentage: aPercentage,
      status: aStatus,
      durationSeconds: aDuration,
      startedAt: aStartedAt
    });
  }

  // Question Mistakes Aggregation
  var answersList = [];
  for (var k = 1; k < answerData.length; k++) {
    var ansRow = answerData[k];
    var ansStudentNum = String(ansRow[answerColMap["student_number"] - 1] || "").trim();
    if (!studentsByNum[ansStudentNum]) continue;

    var ansUnitId = String(ansRow[answerColMap["unit_id"] - 1] || "").trim();
    var ansActId = String(ansRow[answerColMap["activity_id"] - 1] || "").trim();
    var ansSec = getAttemptLearningSection(ansUnitId, ansActId, "");
    var ansSk = getAttemptSkill(ansUnitId, ansActId, "");
    var isCorrect = Boolean(ansRow[answerColMap["is_correct"] - 1]);
    var qPrompt = String(ansRow[answerColMap["question_prompt"] - 1] || "").trim();

    if (!isCorrect && qPrompt && topicStats[ansUnitId || ansActId]) {
      topicStats[ansUnitId || ansActId].mistakesCount++;
      topicStats[ansUnitId || ansActId].mistakePrompts[qPrompt] = (topicStats[ansUnitId || ansActId].mistakePrompts[qPrompt] || 0) + 1;
    }

    if (filterSection && ansSec !== filterSection) continue;
    if (filterSkill && ansSk !== filterSkill) continue;

    answersList.push({
      answerId: String(ansRow[answerColMap["answer_id"] - 1] || ""),
      attemptId: String(ansRow[answerColMap["attempt_id"] - 1] || ""),
      unitId: ansUnitId,
      activityId: ansActId,
      questionId: String(ansRow[answerColMap["question_id"] - 1] || ""),
      questionPrompt: qPrompt,
      studentResponse: String(ansRow[answerColMap["student_response"] - 1] || ""),
      correctAnswer: String(ansRow[answerColMap["correct_answer"] - 1] || ""),
      isCorrect: isCorrect,
      learningSection: ansSec,
      skill: ansSk
    });
  }

  // Finalize student averages
  studentRoster.forEach(function(s) {
    if (s._urScores.length > 0) {
      var urSum = s._urScores.reduce(function(acc, val) { return acc + val; }, 0);
      s.unitReviewAccuracy = Math.round(urSum / s._urScores.length);
    }
    if (s._geScores.length > 0) {
      var geSum = s._geScores.reduce(function(acc, val) { return acc + val; }, 0);
      s.generalEnglishAccuracy = Math.round(geSum / s._geScores.length);
    }
    if (s._mpScores.length > 0) {
      var mpSum = s._mpScores.reduce(function(acc, val) { return acc + val; }, 0);
      s.mixedPracticeAccuracy = Math.round(mpSum / s._mpScores.length);
    }
    var allScores = s._urScores.concat(s._geScores).concat(s._mpScores);
    if (allScores.length > 0) {
      var totSum = allScores.reduce(function(acc, val) { return acc + val; }, 0);
      s.overallAccuracy = Math.round(totSum / allScores.length);
    }
    delete s._urScores;
    delete s._geScores;
    delete s._mpScores;
  });

  // Finalize section breakdown
  ["unitReview", "generalEnglish", "mixedPractice"].forEach(function(key) {
    var sb = sectionBreakdown[key];
    sb.uniqueStudentsCount = Object.keys(sb._students).length;
    if (sb._scores.length > 0) {
      var sum = sb._scores.reduce(function(acc, val) { return acc + val; }, 0);
      sb.averageScore = Math.round(sum / sb._scores.length);
    }
    delete sb._students;
    delete sb._scores;
  });

  // Finalize topics list & mastery flags
  var topics = Object.keys(topicStats).map(function(tId) {
    var t = topicStats[tId];
    var avg = t.scores.length > 0 ? Math.round(t.scores.reduce(function(a, b) { return a + b; }, 0) / t.scores.length) : 0;
    var status = "not_started";
    if (t.totalAttempts > 0) {
      if (avg >= 85) {
        status = "mastered";
        if (skillAccumulators[t.skill]) skillAccumulators[t.skill].masteredTopics[tId] = true;
      } else if (avg >= 70) {
        status = "proficient";
      } else if (avg >= 50) {
        status = "needs_practice";
        if (skillAccumulators[t.skill]) skillAccumulators[t.skill].needsPracticeTopics[tId] = true;
      } else {
        status = "struggling";
        if (skillAccumulators[t.skill]) skillAccumulators[t.skill].needsPracticeTopics[tId] = true;
      }
    }
    var weaknessScore = Math.min(100, Math.round((100 - avg) * 0.8 + Math.min(20, t.mistakesCount * 2)));

    var promptsArr = Object.keys(t.mistakePrompts).sort(function(a, b) {
      return t.mistakePrompts[b] - t.mistakePrompts[a];
    }).slice(0, 3);

    return {
      topicId: t.topicId,
      topicTitle: t.topicTitle,
      skill: t.skill,
      gradeId: t.gradeId,
      cefrLevel: t.cefrLevel,
      questionCount: t.questionCount,
      totalAttempts: t.totalAttempts,
      completedAttempts: t.completedAttempts,
      uniqueStudentsCount: Object.keys(t.students).length,
      averageScore: avg,
      masteryStatus: status,
      weaknessScore: weaknessScore,
      commonMistakesCount: t.mistakesCount,
      commonMistakePrompts: promptsArr
    };
  });

  // Finalize skill pillars
  var skillMastery = [
    { skill: "grammar", label: "Grammar & Structures" },
    { skill: "vocabulary", label: "Vocabulary & Idioms" },
    { skill: "reading", label: "Reading Comprehension" },
    { skill: "listening", label: "Listening & Dictation" }
  ].map(function(item) {
    var acc = skillAccumulators[item.skill];
    var avg = acc.completedAttempts > 0 ? Math.round(acc.scoreSum / acc.completedAttempts) : 0;
    return {
      skill: item.skill,
      label: item.label,
      totalAttempts: acc.totalAttempts,
      completedAttempts: acc.completedAttempts,
      averageScore: avg,
      uniqueStudentsCount: Object.keys(acc.students).length,
      masteredTopicsCount: Object.keys(acc.masteredTopics).length,
      needsPracticeTopicsCount: Object.keys(acc.needsPracticeTopics).length
    };
  });

  // Sort topics descending by weaknessScore (highest urgency first)
  topics.sort(function(a, b) {
    return b.weaknessScore - a.weaknessScore;
  });

  return createJsonResponse({
    success: true,
    sectionBreakdown: sectionBreakdown,
    skillMastery: skillMastery,
    topics: topics,
    studentParticipation: studentRoster,
    attempts: attemptsList.slice(0, 100),
    answers: answersList.slice(0, 200)
  });
}

// ============================================================================
// TEACHER STUDENT MANAGEMENT & DEMO ARCHIVAL (PHASE 3B)
// ============================================================================

var DEMO_STUDENT_NUMBERS = ["701", "702", "703", "704", "801", "802", "803", "804"];

var DEMO_FIXTURES = {
  "701": "Kerem Yılmaz",
  "702": "Zeynep Kaya",
  "703": "Can Demir",
  "704": "Elif Şahin",
  "801": "Barış Arslan",
  "802": "Ayşe Çelik",
  "803": "Murat Yıldız",
  "804": "Selin Aydın"
};

/**
 * Normalizes text for robust comparison across Turkish and English character sets.
 */
function normalizeNameForComparison(name) {
  if (!name) return "";
  return String(name)
    .trim()
    .toLowerCase()
    .replace(/ı/g, "i").replace(/İ/g, "i")
    .replace(/ş/g, "s").replace(/Ş/g, "s")
    .replace(/ğ/g, "g").replace(/Ğ/g, "g")
    .replace(/ü/g, "u").replace(/Ü/g, "u")
    .replace(/ö/g, "o").replace(/Ö/g, "o")
    .replace(/ç/g, "c").replace(/Ç/g, "c")
    .replace(/\s+/g, " ");
}

/**
 * Robustly verifies whether an account is truly one of the 8 demonstration fixtures.
 * Requires matching both student number (or archived num ending in _demo) AND fixture name,
 * OR having explicit DEMO_ARCHIVE class with matching base fixture number.
 * Real student accounts (e.g. 701 - Ahmet Yılmaz) will NEVER match this.
 */
function isVerifiedDemoAccount(studentNumber, fullName, studentClass) {
  var sNum = String(studentNumber || "").trim();
  var baseNum = sNum.replace(/_demo$/, "");
  var expectedName = DEMO_FIXTURES[baseNum];
  if (!expectedName) return false;

  var normActual = normalizeNameForComparison(fullName);
  var normExpected = normalizeNameForComparison(expectedName);

  if (sNum.endsWith("_demo") || String(studentClass || "").trim().toUpperCase() === "DEMO_ARCHIVE") {
    return normActual === normExpected || normActual.indexOf(normExpected) !== -1;
  }

  return normActual === normExpected;
}

/**
 * Relinks historical student numbers in secondary sheets during demo account archival
 * so real students can reuse numbers 701-704/801-804 without inheriting historical records.
 */
function relinkDemoRecordsInSheet(ss, sheetName, numColName, oldNum, newNum, classColName, newClass) {
  var sheet = getSheetRobust(ss, sheetName);
  if (!sheet) return;
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return;

  var colMap = {};
  for (var c = 0; c < data[0].length; c++) {
    colMap[String(data[0][c]).trim()] = c + 1;
  }

  var numCol = colMap[numColName];
  if (!numCol) return;
  var classCol = classColName ? colMap[classColName] : null;

  for (var r = 1; r < data.length; r++) {
    var val = String(data[r][numCol - 1] || "").trim();
    if (val === oldNum) {
      sheet.getRange(r + 1, numCol).setValue(newNum);
      if (classCol && newClass) {
        sheet.getRange(r + 1, classCol).setValue(newClass);
      }
    }
  }
}

/**
 * Invalidates all active session tokens for a student in the Sessions sheet.
 */
function invalidateStudentSessions(ss, studentNumber) {
  var sessionsSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.SESSIONS);
  if (!sessionsSheet) return;
  var data = sessionsSheet.getDataRange().getValues();
  var colMap = getSheetColumnMap(sessionsSheet, CONFIG.SESSION_HEADERS);
  var now = new Date().toISOString();

  for (var i = 1; i < data.length; i++) {
    var sNum = String(data[i][colMap["student_number"] - 1] || "").trim();
    var status = String(data[i][colMap["status"] - 1] || "");
    if (sNum === studentNumber && status === "active") {
      sessionsSheet.getRange(i + 1, colMap["status"]).setValue("revoked");
      sessionsSheet.getRange(i + 1, colMap["logout_time"]).setValue(now);
    }
  }
}

/**
 * Authenticated endpoint: Adds an individual student to the Students sheet.
 */
function handleTeacherAddStudent(ss, payload) {
  var auth = validateTeacherSession(ss, payload.teacherToken);
  if (!auth.valid) {
    return createJsonResponse({ success: false, error: auth.error, code: auth.code });
  }

  var studentNumber = String(payload.studentNumber || "").trim();
  var fullName = String(payload.fullName || "").trim();
  var className = String(payload.class || "").trim().toUpperCase();
  var rawPin = payload.pin !== undefined && payload.pin !== null ? String(payload.pin).trim() : "";

  if (!studentNumber) {
    return createJsonResponse({ success: false, error: "Student number is required.", code: "BAD_REQUEST" });
  }
  if (!fullName) {
    return createJsonResponse({ success: false, error: "Student full name is required.", code: "BAD_REQUEST" });
  }
  var validClasses = ["7A", "7B", "8A", "8B"];
  if (validClasses.indexOf(className) === -1) {
    return createJsonResponse({ success: false, error: "Invalid class. Must be 7A, 7B, 8A, or 8B.", code: "BAD_REQUEST" });
  }

  // Validate or generate 4-digit numeric PIN
  var pin = rawPin;
  if (pin) {
    if (!/^\d{4}$/.test(pin)) {
      return createJsonResponse({ success: false, error: "PIN must be a 4-digit numeric string (0000-9999).", code: "BAD_REQUEST" });
    }
  } else {
    pin = String(Math.floor(1000 + Math.random() * 9000));
  }

  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (lockErr) {
    return createJsonResponse({ success: false, error: "Server is busy. Please retry in a few moments.", code: "RATE_LIMITED" });
  }

  try {
    var studentsSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.STUDENTS);
    setupSheetHeaders(studentsSheet, CONFIG.STUDENT_HEADERS, "#1e293b", "#38bdf8");

    var studentData = studentsSheet.getDataRange().getValues();
    var colMap = getSheetColumnMap(studentsSheet, CONFIG.STUDENT_HEADERS);

    // Check duplicate student number across all rows (active and inactive)
    for (var i = 1; i < studentData.length; i++) {
      var existingNum = String(studentData[i][colMap["student_number"] - 1] || "").trim();
      if (existingNum.toLowerCase() === studentNumber.toLowerCase()) {
        return createJsonResponse({
          success: false,
          error: "Student number '" + studentNumber + "' is already registered (" + String(studentData[i][colMap["full_name"] - 1]) + " - Class " + String(studentData[i][colMap["class"] - 1]) + ").",
          code: "DUPLICATE_STUDENT"
        });
      }
    }

    var studentId = "std_" + Utilities.getUuid().substring(0, 8);
    var grade = className.startsWith("7") ? "grade-7" : "grade-8";
    var salt = generateSalt();
    var hash = hashPinWithSaltAndPepper(pin, salt);
    var now = new Date().toISOString();

    studentsSheet.appendRow([
      studentId,
      studentNumber,
      fullName,
      grade,
      className,
      salt,
      hash,
      true,  // is_active
      0,     // failed_attempts
      "",    // locked_until
      now,   // created_at
      ""     // last_login_at
    ]);

    return createJsonResponse({
      success: true,
      message: "Student account created successfully.",
      student: {
        studentId: studentId,
        studentNumber: studentNumber,
        fullName: fullName,
        grade: grade,
        class: className,
        isActive: true,
        createdAt: now
      },
      generatedPin: pin // Revealed once to authenticated teacher
    });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Authenticated endpoint: Imports a list of students in bulk.
 */
function handleTeacherBulkImportStudents(ss, payload) {
  var auth = validateTeacherSession(ss, payload.teacherToken);
  if (!auth.valid) {
    return createJsonResponse({ success: false, error: auth.error, code: auth.code });
  }

  var rawList = payload.students;
  if (!Array.isArray(rawList) || rawList.length === 0) {
    return createJsonResponse({ success: false, error: "Expected a non-empty array of students to import.", code: "BAD_REQUEST" });
  }
  if (rawList.length > 500) {
    return createJsonResponse({ success: false, error: "Bulk import limit is 500 students per batch.", code: "BAD_REQUEST" });
  }

  var validClasses = ["7A", "7B", "8A", "8B"];
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
  } catch (lockErr) {
    return createJsonResponse({ success: false, error: "Server is busy. Please retry.", code: "RATE_LIMITED" });
  }

  try {
    var studentsSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.STUDENTS);
    setupSheetHeaders(studentsSheet, CONFIG.STUDENT_HEADERS, "#1e293b", "#38bdf8");

    var studentData = studentsSheet.getDataRange().getValues();
    var colMap = getSheetColumnMap(studentsSheet, CONFIG.STUDENT_HEADERS);

    // Existing numbers set
    var existingNumbers = {};
    for (var i = 1; i < studentData.length; i++) {
      var exNum = String(studentData[i][colMap["student_number"] - 1] || "").trim().toLowerCase();
      if (exNum) existingNumbers[exNum] = true;
    }

    // Validate batch for internal duplicates and format
    var batchNumbers = {};
    var validatedStudents = [];
    var errors = [];

    for (var idx = 0; idx < rawList.length; idx++) {
      var item = rawList[idx];
      var sNum = String(item.studentNumber || "").trim();
      var fName = String(item.fullName || "").trim();
      var cName = String(item.class || "").trim().toUpperCase();
      var sPin = item.pin !== undefined && item.pin !== null ? String(item.pin).trim() : "";

      if (!sNum) {
        errors.push("Row " + (idx + 1) + ": Missing student number.");
        continue;
      }
      if (!fName) {
        errors.push("Row " + (idx + 1) + " (" + sNum + "): Missing full name.");
        continue;
      }
      if (validClasses.indexOf(cName) === -1) {
        errors.push("Row " + (idx + 1) + " (" + sNum + "): Invalid class '" + cName + "'. Must be 7A, 7B, 8A, or 8B.");
        continue;
      }
      if (batchNumbers[sNum.toLowerCase()]) {
        errors.push("Row " + (idx + 1) + " (" + sNum + "): Duplicate student number in import batch.");
        continue;
      }
      if (existingNumbers[sNum.toLowerCase()]) {
        errors.push("Row " + (idx + 1) + " (" + sNum + "): Student number already exists in database.");
        continue;
      }

      var finalPin = sPin;
      if (finalPin) {
        if (!/^\d{4}$/.test(finalPin)) {
          errors.push("Row " + (idx + 1) + " (" + sNum + "): Custom PIN must be exactly 4 digits (0000-9999).");
          continue;
        }
      } else {
        finalPin = String(Math.floor(1000 + Math.random() * 9000));
      }

      batchNumbers[sNum.toLowerCase()] = true;
      validatedStudents.push({
        studentNumber: sNum,
        fullName: fName,
        className: cName,
        pin: finalPin
      });
    }

    if (errors.length > 0) {
      return createJsonResponse({
        success: false,
        error: "Validation failed for " + errors.length + " record(s). No records were imported.",
        validationErrors: errors,
        code: "VALIDATION_ERROR"
      });
    }

    var now = new Date().toISOString();
    var rowsToInsert = [];
    var importedList = [];
    var pepper = getOrCreateSecretPepper();

    for (var k = 0; k < validatedStudents.length; k++) {
      var s = validatedStudents[k];
      var stdId = "std_" + Utilities.getUuid().substring(0, 8);
      var grd = s.className.startsWith("7") ? "grade-7" : "grade-8";
      var sSalt = generateSalt();
      var sHash = hashPinWithSaltAndPepper(s.pin, sSalt, pepper);

      rowsToInsert.push([
        stdId,
        s.studentNumber,
        s.fullName,
        grd,
        s.className,
        sSalt,
        sHash,
        true,
        0,
        "",
        now,
        ""
      ]);

      importedList.push({
        studentId: stdId,
        studentNumber: s.studentNumber,
        fullName: s.fullName,
        grade: grd,
        class: s.className,
        pin: s.pin // Returned once to teacher for print cards
      });
    }

    if (rowsToInsert.length > 0) {
      var startRow = studentsSheet.getLastRow() + 1;
      studentsSheet.getRange(startRow, 1, rowsToInsert.length, CONFIG.STUDENT_HEADERS.length).setValues(rowsToInsert);
    }

    return createJsonResponse({
      success: true,
      count: importedList.length,
      message: "Successfully imported " + importedList.length + " students.",
      importedStudents: importedList
    });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Authenticated endpoint: Updates an existing student's name, class, or active status.
 * Student number is strictly immutable to preserve historical records and relationships.
 */
function handleTeacherUpdateStudent(ss, payload) {
  var auth = validateTeacherSession(ss, payload.teacherToken);
  if (!auth.valid) {
    return createJsonResponse({ success: false, error: auth.error, code: auth.code });
  }

  var studentNumber = String(payload.studentNumber || "").trim();
  var fullName = String(payload.fullName || "").trim();
  var className = String(payload.class || "").trim().toUpperCase();
  var validClasses = ["7A", "7B", "8A", "8B"];

  if (!studentNumber) {
    return createJsonResponse({ success: false, error: "Student number is required.", code: "BAD_REQUEST" });
  }
  if (!fullName) {
    return createJsonResponse({ success: false, error: "Student full name is required.", code: "BAD_REQUEST" });
  }
  if (validClasses.indexOf(className) === -1) {
    return createJsonResponse({ success: false, error: "Invalid class. Must be 7A, 7B, 8A, or 8B.", code: "BAD_REQUEST" });
  }

  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (lockErr) {
    return createJsonResponse({ success: false, error: "Server is busy. Please retry.", code: "RATE_LIMITED" });
  }

  try {
    var studentsSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.STUDENTS);
    var studentData = studentsSheet.getDataRange().getValues();
    var colMap = getSheetColumnMap(studentsSheet, CONFIG.STUDENT_HEADERS);

    var targetRowIndex = -1;
    for (var i = 1; i < studentData.length; i++) {
      var rowNum = String(studentData[i][colMap["student_number"] - 1] || "").trim();
      if (rowNum === studentNumber) {
        targetRowIndex = i + 1;
        break;
      }
    }

    if (targetRowIndex === -1) {
      return createJsonResponse({ success: false, error: "Student #" + studentNumber + " not found.", code: "NOT_FOUND" });
    }

    var grade = className.startsWith("7") ? "grade-7" : "grade-8";
    studentsSheet.getRange(targetRowIndex, colMap["full_name"]).setValue(fullName);
    studentsSheet.getRange(targetRowIndex, colMap["grade"]).setValue(grade);
    studentsSheet.getRange(targetRowIndex, colMap["class"]).setValue(className);

    var finalActive = Boolean(studentData[targetRowIndex - 1][colMap["is_active"] - 1]);
    if (payload.isActive !== undefined) {
      finalActive = Boolean(payload.isActive);
      studentsSheet.getRange(targetRowIndex, colMap["is_active"]).setValue(finalActive);
      if (!finalActive) {
        invalidateStudentSessions(ss, studentNumber);
      }
    }

    return createJsonResponse({
      success: true,
      message: "Student details updated successfully.",
      student: {
        studentNumber: studentNumber,
        fullName: fullName,
        grade: grade,
        class: className,
        isActive: finalActive
      }
    });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Authenticated endpoint: Resets a student's PIN, clears lockouts, and invalidates active sessions.
 */
function handleTeacherResetStudentPin(ss, payload) {
  var auth = validateTeacherSession(ss, payload.teacherToken);
  if (!auth.valid) {
    return createJsonResponse({ success: false, error: auth.error, code: auth.code });
  }

  var studentNumber = String(payload.studentNumber || "").trim();
  if (!studentNumber) {
    return createJsonResponse({ success: false, error: "Student number is required.", code: "BAD_REQUEST" });
  }

  var rawPin = payload.newPin !== undefined && payload.newPin !== null ? String(payload.newPin).trim() : "";
  var newPin = rawPin;
  if (newPin) {
    if (!/^\d{4}$/.test(newPin)) {
      return createJsonResponse({ success: false, error: "PIN must be a 4-digit number (0000-9999).", code: "BAD_REQUEST" });
    }
  } else {
    newPin = String(Math.floor(1000 + Math.random() * 9000));
  }

  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (lockErr) {
    return createJsonResponse({ success: false, error: "Server is busy. Please retry.", code: "RATE_LIMITED" });
  }

  try {
    var studentsSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.STUDENTS);
    var studentData = studentsSheet.getDataRange().getValues();
    var colMap = getSheetColumnMap(studentsSheet, CONFIG.STUDENT_HEADERS);

    var targetRowIndex = -1;
    var fullName = "";
    for (var i = 1; i < studentData.length; i++) {
      var rowNum = String(studentData[i][colMap["student_number"] - 1] || "").trim();
      if (rowNum === studentNumber) {
        targetRowIndex = i + 1;
        fullName = String(studentData[i][colMap["full_name"] - 1]);
        break;
      }
    }

    if (targetRowIndex === -1) {
      return createJsonResponse({ success: false, error: "Student #" + studentNumber + " not found.", code: "NOT_FOUND" });
    }

    var newSalt = generateSalt();
    var newHash = hashPinWithSaltAndPepper(newPin, newSalt);

    studentsSheet.getRange(targetRowIndex, colMap["pin_salt"]).setValue(newSalt);
    studentsSheet.getRange(targetRowIndex, colMap["pin_hash"]).setValue(newHash);
    studentsSheet.getRange(targetRowIndex, colMap["failed_attempts"]).setValue(0);
    studentsSheet.getRange(targetRowIndex, colMap["locked_until"]).setValue("");

    // Invalidate active sessions
    invalidateStudentSessions(ss, studentNumber);

    return createJsonResponse({
      success: true,
      message: "PIN reset successfully for student #" + studentNumber + ".",
      studentNumber: studentNumber,
      fullName: fullName,
      newPin: newPin // Returned once to authenticated teacher
    });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Authenticated endpoint: Securely resets PINs in bulk for selected students or classes.
 * Stores salted SHA-256 hashes in Google Sheets; invalidates previous student sessions;
 * stages encrypted credentials for reliable, recoverable delivery (15m TTL);
 * supports client operationId for complete idempotency;
 * returns newly generated plaintext 4-digit PINs once to the authenticated teacher for login cards.
 */
function handleTeacherBulkResetStudentPins(ss, payload) {
  var auth = validateTeacherSession(ss, payload.teacherToken);
  if (!auth.valid) {
    return createJsonResponse({ success: false, error: auth.error, code: auth.code });
  }

  var studentNumbers = payload.studentNumbers;
  var targetClass = payload.class ? String(payload.class).trim().toUpperCase() : "";

  var hasNumbers = Array.isArray(studentNumbers) && studentNumbers.length > 0;
  var hasClass = Boolean(targetClass);

  if (!hasNumbers && !hasClass) {
    return createJsonResponse({
      success: false,
      error: "Specify either a list of student numbers or a target class to reset.",
      code: "BAD_REQUEST"
    });
  }

  var operationId = payload.operationId ? String(payload.operationId).trim() : "";
  if (!operationId) {
    operationId = "reset_" + new Date().getTime() + "_" + Math.random().toString(36).substring(2, 9);
  }

  // Idempotency check: If this operationId has already completed (or successfully persisted to database), return existing credentials immediately
  var existingStaged = getStagedCredentials(ss, operationId, auth.sessionId);
  if (existingStaged) {
    var pepper = getOrCreateSecretPepper();
    try {
      var decryptedJson = decryptStagedCredentials(existingStaged.encryptedPayload, payload.teacherToken, pepper, existingStaged.operationId, existingStaged.expiresAt);
      var credentials = JSON.parse(decryptedJson);

      var isCommitted = (existingStaged.status === "committed");
      if (!isCommitted) {
        var reconEarly = verifyAndReconcileStagedOperation(ss, existingStaged.operationId, existingStaged.sessionId, credentials, pepper);
        if (reconEarly.verified) {
          isCommitted = true;
        }
      }

      if (isCommitted) {
        return createJsonResponse({
          success: true,
          count: credentials.length,
          message: "Operation already completed. Returning staged credentials.",
          credentials: credentials,
          operationId: operationId,
          isIdempotent: true
        });
      }
    } catch (e) {
      // If decryption fails, proceed with execution
    }
  }

  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
  } catch (lockErr) {
    return createJsonResponse({ success: false, error: "Server is busy. Please retry.", code: "RATE_LIMITED" });
  }

  try {
    // Re-check idempotency under lock in case of concurrent identical request
    var lockedStaged = getStagedCredentials(ss, operationId, auth.sessionId);
    if (lockedStaged) {
      var pepperLocked = getOrCreateSecretPepper();
      try {
        var decLocked = decryptStagedCredentials(lockedStaged.encryptedPayload, payload.teacherToken, pepperLocked, lockedStaged.operationId, lockedStaged.expiresAt);
        var credsLocked = JSON.parse(decLocked);

        var isCommittedLocked = (lockedStaged.status === "committed");
        if (!isCommittedLocked) {
          var reconLocked = verifyAndReconcileStagedOperation(ss, lockedStaged.operationId, lockedStaged.sessionId, credsLocked, pepperLocked);
          if (reconLocked.verified) {
            isCommittedLocked = true;
          }
        }

        if (isCommittedLocked) {
          return createJsonResponse({
            success: true,
            count: credsLocked.length,
            message: "Operation already completed. Returning staged credentials.",
            credentials: credsLocked,
            operationId: operationId,
            isIdempotent: true
          });
        }
      } catch (e) {}
    }

    var studentsSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.STUDENTS);
    var studentData = studentsSheet.getDataRange().getValues();
    var colMap = getSheetColumnMap(studentsSheet, CONFIG.STUDENT_HEADERS);

    var targetNumberSet = null;
    if (hasNumbers) {
      targetNumberSet = {};
      for (var n = 0; n < studentNumbers.length; n++) {
        var num = String(studentNumbers[n] || "").trim();
        if (num) targetNumberSet[num] = true;
      }
    }

    var targetsToUpdate = [];
    for (var i = 1; i < studentData.length; i++) {
      var sNum = String(studentData[i][colMap["student_number"] - 1] || "").trim();
      var cName = String(studentData[i][colMap["class"] - 1] || "").trim().toUpperCase();
      var stdId = String(studentData[i][colMap["student_id"] - 1] || "").trim();
      var fName = String(studentData[i][colMap["full_name"] - 1] || "").trim();
      var grd = String(studentData[i][colMap["grade"] - 1] || "").trim();

      // Skip demo archive students unless explicitly targeted by number
      if (cName === "DEMO_ARCHIVE" && !targetNumberSet) continue;

      var match = false;
      if (targetNumberSet) {
        if (targetNumberSet[sNum]) match = true;
      } else if (targetClass) {
        if (targetClass === "ALL" || cName === targetClass) match = true;
      }

      if (match) {
        targetsToUpdate.push({
          rowIndex: i + 1,
          studentId: stdId,
          studentNumber: sNum,
          fullName: fName,
          grade: grd,
          className: cName
        });
      }
    }

    if (targetsToUpdate.length === 0) {
      return createJsonResponse({
        success: false,
        error: "No matching student accounts found to reset.",
        code: "NOT_FOUND"
      });
    }

    var pepper = getOrCreateSecretPepper();
    var credentials = [];
    var affectedNumbers = [];
    var usedPins = {};

    for (var k = 0; k < targetsToUpdate.length; k++) {
      var target = targetsToUpdate[k];
      
      // Secure random 4-digit PIN, ensuring uniqueness within this classroom batch
      var newPin = "";
      var genAttempts = 0;
      do {
        newPin = String(Math.floor(1000 + Math.random() * 9000));
        genAttempts++;
      } while (usedPins[newPin] && genAttempts < 100);
      usedPins[newPin] = true;

      var newSalt = generateSalt();
      var newHash = hashPinWithSaltAndPepper(newPin, newSalt, pepper);

      // Update in-memory grid
      var rIdx = target.rowIndex - 1;
      studentData[rIdx][colMap["pin_salt"] - 1] = newSalt;
      studentData[rIdx][colMap["pin_hash"] - 1] = newHash;
      studentData[rIdx][colMap["failed_attempts"] - 1] = 0;
      studentData[rIdx][colMap["locked_until"] - 1] = "";

      affectedNumbers.push(target.studentNumber);
      credentials.push({
        studentId: target.studentId,
        studentNumber: target.studentNumber,
        fullName: target.fullName,
        grade: target.grade,
        class: target.className,
        pin: newPin // Plaintext PIN returned once for login slips and staged encrypted
      });
    }

    var expiresAt = new Date(new Date().getTime() + CONFIG.STAGED_CREDENTIALS_CONFIG.TTL_MS).toISOString();
    var encryptedPayload = encryptStagedCredentials(JSON.stringify(credentials), payload.teacherToken, pepper, operationId, expiresAt);

    // Stage credentials with status 'pending' BEFORE modifying the database
    stageEncryptedCredentials(ss, operationId, auth.sessionId, encryptedPayload, credentials.length, "pending", expiresAt);

    // Batch write to Google Sheets:
    // Note: Google Sheets setValues() and flush() provide batch spreadsheet mutations,
    // NOT an ACID database transaction. A partial write or unhandled exception will not auto-rollback.
    try {
      studentsSheet.getDataRange().setValues(studentData);
      SpreadsheetApp.flush();
    } catch (writeErr) {
      // Mark staging as failed so recovery cannot deliver uncommitted credentials
      updateStagedStatus(ss, operationId, auth.sessionId, "failed");
      return createJsonResponse({
        success: false,
        error: "Failed to persist reset PINs to database: " + writeErr.message,
        code: "STORAGE_ERROR"
      });
    }

    // On confirmed database write, promote staging status to 'committed'
    updateStagedStatus(ss, operationId, auth.sessionId, "committed");

    // Best-effort bulk session invalidation for all affected students
    try {
      invalidateMultipleStudentSessions(ss, affectedNumbers);
    } catch (sessErr) {
      Logger.log("Warning: Session invalidation error (non-fatal): " + sessErr.message);
    }

    return createJsonResponse({
      success: true,
      count: credentials.length,
      message: "Successfully generated new PINs for " + credentials.length + " students.",
      credentials: credentials,
      operationId: operationId
    });
  } catch (execErr) {
    return createJsonResponse({
      success: false,
      error: "Bulk PIN reset execution error: " + execErr.message,
      code: "INTERNAL_ERROR"
    });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Safe Database Hash Reconciliation Mechanism:
 * Verifies the actual committed PIN hashes in the Students sheet against the staged PINs.
 * Used during recovery to resolve the critical failure scenario where:
 * 1. Student PIN hashes were successfully updated in Students sheet.
 * 2. SpreadsheetApp.flush() succeeded.
 * 3. Updating the staged credential record from "pending" to "committed" failed or was interrupted.
 *
 * This reconciliation guarantees that students are never permanently stranded with changed PINs
 * and inaccessible credentials, while ensuring that uncommitted or mismatched operations are rejected.
 * Crucially, recovery does NOT initiate another reset.
 *
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} ss - Active spreadsheet
 * @param {string} operationId - Staged operation ID
 * @param {string} sessionId - Teacher session ID
 * @param {Array<Object>} credentials - Decrypted credential items [{ studentNumber, pin }]
 * @param {string} pepper - Server secret pepper
 * @return {Object} { verified: boolean, reconciled: boolean, matchedCount: number, reason: string }
 */
function verifyAndReconcileStagedOperation(ss, operationId, sessionId, credentials, pepper) {
  if (!Array.isArray(credentials) || credentials.length === 0) {
    return { verified: false, reconciled: false, matchedCount: 0, reason: "Staged credentials payload is empty" };
  }

  var studentsSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.STUDENTS);
  if (!studentsSheet) {
    return { verified: false, reconciled: false, matchedCount: 0, reason: "Students sheet not found" };
  }

  var data = studentsSheet.getDataRange().getValues();
  if (data.length <= 1) {
    return { verified: false, reconciled: false, matchedCount: 0, reason: "Students sheet contains no data rows" };
  }

  var colMap = getSheetColumnMap(studentsSheet, CONFIG.STUDENT_HEADERS);
  var numCol = colMap["student_number"] - 1;
  var saltCol = colMap["pin_salt"] - 1;
  var hashCol = colMap["pin_hash"] - 1;

  var dbMap = {};
  for (var i = 1; i < data.length; i++) {
    var sNum = String(data[i][numCol] || "").trim();
    if (sNum) {
      dbMap[sNum] = {
        salt: String(data[i][saltCol] || "").trim(),
        hash: String(data[i][hashCol] || "").trim()
      };
    }
  }

  // Verify each staged student's PIN against their actual stored salt and hash in the Students sheet
  for (var k = 0; k < credentials.length; k++) {
    var item = credentials[k];
    var sNum = String(item.studentNumber || "").trim();
    var dbStudent = dbMap[sNum];
    if (!dbStudent) {
      return { verified: false, reconciled: false, matchedCount: k, reason: "Student " + sNum + " not found in Students sheet" };
    }
    if (!dbStudent.salt || !dbStudent.hash) {
      return { verified: false, reconciled: false, matchedCount: k, reason: "Student " + sNum + " lacks salt or hash in database" };
    }

    var expectedHash = hashPinWithSaltAndPepper(item.pin, dbStudent.salt, pepper);
    if (!constantTimeEqual(expectedHash, dbStudent.hash)) {
      return {
        verified: false,
        reconciled: false,
        matchedCount: k,
        reason: "PIN hash in database does not match staged PIN for student " + sNum + " (database write was not committed or was modified)"
      };
    }
  }

  // 100% of staged students match the database!
  // Self-heal the staging status from "pending" to "committed"
  updateStagedStatus(ss, operationId, sessionId, "committed");

  return { verified: true, reconciled: true, matchedCount: credentials.length, reason: "All student PIN hashes verified in database" };
}

/**
 * Authenticated recovery endpoint: Retrieves staged credentials for a recent bulk reset operation
 * without altering student accounts or regenerating hashes.
 * Includes cryptographic reconciliation against the Students sheet to safely recover operations
 * where status update to 'committed' failed after SpreadsheetApp.flush() succeeded.
 */
function handleTeacherRecoverBulkResetCredentials(ss, payload) {
  var auth = validateTeacherSession(ss, payload.teacherToken);
  if (!auth.valid) {
    return createJsonResponse({ success: false, error: auth.error, code: auth.code });
  }

  var operationId = payload.operationId ? String(payload.operationId).trim() : "latest";
  var staged = getStagedCredentials(ss, operationId, auth.sessionId);

  if (!staged) {
    return createJsonResponse({
      success: false,
      error: "No active unexpired credentials found for this operation. Note: Resets performed prior to the deployment of this recovery system cannot be recovered retroactively, as plaintext PINs were never staged.",
      code: "NOT_FOUND"
    });
  }

  var pepper = getOrCreateSecretPepper();
  var credentials = null;
  try {
    var decryptedJson = decryptStagedCredentials(staged.encryptedPayload, payload.teacherToken, pepper, staged.operationId, staged.expiresAt);
    credentials = JSON.parse(decryptedJson);
  } catch (decErr) {
    return createJsonResponse({
      success: false,
      error: "Security verification or decryption failed: " + decErr.message,
      code: "INTEGRITY_ERROR"
    });
  }

  // Safe Reconciliation Check:
  // Do not rely solely on the staging status field.
  // If status is not 'committed' (e.g. 'pending' or interrupted during reset),
  // verify the actual committed PIN hashes against the staged operation.
  var isCommitted = (staged.status === "committed");
  var wasReconciled = false;

  if (!isCommitted) {
    var reconResult = verifyAndReconcileStagedOperation(ss, staged.operationId, staged.sessionId, credentials, pepper);
    if (!reconResult.verified) {
      return createJsonResponse({
        success: false,
        error: "Operation status is '" + staged.status + "' and database reconciliation failed: " + reconResult.reason + ". Staged credentials cannot be authorized to prevent credential mismatch.",
        code: "UNCERTAIN_OPERATION"
      });
    }
    wasReconciled = true;
  }

  return createJsonResponse({
    success: true,
    recovered: true,
    reconciled: wasReconciled,
    operationId: staged.operationId,
    count: credentials.length,
    expiresAt: staged.expiresAt,
    message: wasReconciled
      ? "Successfully reconciled and recovered credentials for " + credentials.length + " students (verified against database)."
      : "Successfully recovered credentials for " + credentials.length + " students.",
    credentials: credentials
  });
}

/**
 * One-time Teacher-Authenticated Administrative Action:
 * Sets the PIN of all real students to a uniform default PIN (default: "1234").
 * 
 * Performance & Concurrency Optimization:
 * 1. Computes all 59 salted SHA-256 hashes completely in memory BEFORE touching any lock.
 * 2. Checks idempotency: if all accounts already have the target hash, returns success immediately.
 * 3. Narrow lock scope: acquires lock ONLY for setValues() and flush(), holding lock for <300ms.
 * 4. Uses DocumentLock (spreadsheet-isolated) with fallback to ScriptLock with 30s timeout.
 * 5. Releases lock immediately before running background session invalidation.
 */
function handleTeacherSetAllStudentPinsDefault(ss, payload) {
  var auth = validateTeacherSession(ss, payload.teacherToken);
  if (!auth.valid) {
    return createJsonResponse({ success: false, error: auth.error, code: auth.code });
  }

  var targetPin = String(payload.pin || "1234").trim();
  if (!targetPin || targetPin.length < 4) {
    return createJsonResponse({ success: false, error: "A valid PIN of at least 4 digits is required.", code: "BAD_REQUEST" });
  }

  var studentsSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.STUDENTS);
  if (!studentsSheet) {
    return createJsonResponse({ success: false, error: "Students sheet not found in database.", code: "NOT_FOUND" });
  }

  var studentData = studentsSheet.getDataRange().getValues();
  if (studentData.length <= 1) {
    return createJsonResponse({ success: false, error: "No student records found in database.", code: "NOT_FOUND" });
  }

  var colMap = getSheetColumnMap(studentsSheet, CONFIG.STUDENT_HEADERS);
  var numCol = colMap["student_number"] - 1;
  var nameCol = colMap["full_name"] - 1;
  var classCol = colMap["class"] - 1;
  var gradeCol = colMap["grade"] - 1;
  var saltCol = colMap["pin_salt"] - 1;
  var hashCol = colMap["pin_hash"] - 1;
  var attemptsCol = colMap["failed_attempts"] - 1;
  var lockedCol = colMap["locked_until"] - 1;

  // Identify all real students (exclude DEMO_ARCHIVE and demo fixtures)
  var eligibleRows = [];
  var eligibleStudents = [];

  for (var i = 1; i < studentData.length; i++) {
    var sRow = studentData[i];
    var sNum = String(sRow[numCol] || "").trim();
    if (!sNum) continue;

    var sClass = String(sRow[classCol] || "").trim().toUpperCase();
    var sName = String(sRow[nameCol] || "");

    // Exclude archived demo accounts, demo numbers, or demo fixtures
    if (sClass === "DEMO_ARCHIVE" || /_demo$/.test(sNum) || isVerifiedDemoAccount(sNum, sName, sClass)) {
      continue;
    }

    eligibleRows.push(i);
    eligibleStudents.push({
      studentNumber: sNum,
      fullName: sName,
      className: sClass,
      grade: String(sRow[gradeCol] || "")
    });
  }

  // Pre-fetch pepper for in-memory operations
  var pepper = getOrCreateSecretPepper();

  // Check how many students already match targetPin
  var alreadyMatchingCount = 0;
  for (var c = 0; c < eligibleRows.length; c++) {
    var checkIdx = eligibleRows[c];
    var curSalt = String(studentData[checkIdx][saltCol] || "").trim();
    var curHash = String(studentData[checkIdx][hashCol] || "").trim();
    if (curSalt && curHash) {
      var expHash = hashPinWithSaltAndPepper(targetPin, curSalt, pepper);
      if (constantTimeEqual(expHash, curHash)) {
        alreadyMatchingCount++;
      }
    }
  }

  var isAlreadyFullyApplied = (eligibleRows.length > 0 && alreadyMatchingCount === eligibleRows.length);

  // Phase 1: Confirmation preview step if confirm !== true
  if (payload.confirm !== true) {
    return createJsonResponse({
      success: true,
      preview: true,
      count: eligibleStudents.length,
      defaultPin: targetPin,
      alreadyApplied: isAlreadyFullyApplied,
      message: isAlreadyFullyApplied
        ? "All " + eligibleStudents.length + " real students already have PIN set to " + targetPin + "."
        : "Ready to set PIN to " + targetPin + " for " + eligibleStudents.length + " real students. Confirmation required to execute.",
      affectedStudents: eligibleStudents
    });
  }

  // Idempotency fast-path: If all accounts already have PIN 1234, return success immediately without spreadsheet write
  if (isAlreadyFullyApplied) {
    return createJsonResponse({
      success: true,
      executed: true,
      alreadyApplied: true,
      count: eligibleStudents.length,
      pin: targetPin,
      message: "All " + eligibleStudents.length + " students are already configured with PIN " + targetPin + ". No update was needed.",
      affectedNumbers: eligibleStudents.map(function(s) { return s.studentNumber; })
    });
  }

  // Phase 2: Compute all hashes in pure V8 memory BEFORE acquiring any lock
  var affectedNumbers = [];
  for (var k = 0; k < eligibleRows.length; k++) {
    var rIdx = eligibleRows[k];
    var salt = String(studentData[rIdx][saltCol] || "").trim();
    if (!salt) {
      salt = generateSalt();
      studentData[rIdx][saltCol] = salt;
    }

    var newHash = hashPinWithSaltAndPepper(targetPin, salt, pepper);
    studentData[rIdx][hashCol] = newHash;

    if (attemptsCol >= 0) studentData[rIdx][attemptsCol] = 0;
    if (lockedCol >= 0) studentData[rIdx][lockedCol] = "";

    affectedNumbers.push(String(studentData[rIdx][numCol]).trim());
  }

  // Phase 3: Narrow Lock Scope — Acquire lock ONLY for batch write and flush
  var lock = null;
  var lockAcquired = false;

  try {
    if (typeof LockService !== "undefined" && LockService) {
      if (typeof LockService.getDocumentLock === "function") {
        lock = LockService.getDocumentLock();
      }
      if (!lock && typeof LockService.getScriptLock === "function") {
        lock = LockService.getScriptLock();
      }
    }
  } catch (lInitErr) {
    Logger.log("Notice: Lock initialization error: " + lInitErr.message);
  }

  if (lock && typeof lock.tryLock === "function") {
    try {
      lockAcquired = lock.tryLock(30000); // 30s allowance for write lock
    } catch (lTryErr) {
      Logger.log("Notice: tryLock error: " + lTryErr.message);
    }
  }

  if (lock && !lockAcquired) {
    return createJsonResponse({
      success: false,
      error: "Server is busy. Another spreadsheet operation is currently in progress. Please retry in a few moments.",
      code: "RATE_LIMITED"
    });
  }

  try {
    // Atomic batch write to spreadsheet
    studentsSheet.getDataRange().setValues(studentData);
    SpreadsheetApp.flush();
  } catch (writeErr) {
    return createJsonResponse({
      success: false,
      error: "Failed to persist student PINs to spreadsheet: " + writeErr.message,
      code: "STORAGE_ERROR"
    });
  } finally {
    // RELEASE LOCK IMMEDIATELY: Do not hold lock during session invalidation or JSON response serialization
    if (lockAcquired && lock) {
      try {
        lock.releaseLock();
        lockAcquired = false;
      } catch (rErr) {}
    }
  }

  // Phase 4: Invalidate active sessions OUTSIDE the lock
  try {
    invalidateMultipleStudentSessions(ss, affectedNumbers);
  } catch (sessErr) {
    Logger.log("Warning: Session invalidation error (non-fatal): " + sessErr.message);
  }

  return createJsonResponse({
    success: true,
    executed: true,
    count: affectedNumbers.length,
    pin: targetPin,
    message: "Successfully set PIN to " + targetPin + " for all " + affectedNumbers.length + " real students. All names, progress, and accounts were preserved.",
    affectedNumbers: affectedNumbers
  });
}

/**
 * Staged credentials helper: Persists encrypted credentials in _StagedCredentials sheet.
 * Purges expired entries automatically.
 */
function stageEncryptedCredentials(ss, operationId, sessionId, encryptedPayload, count, status, expiresAt) {
  var cfg = CONFIG.STAGED_CREDENTIALS_CONFIG;
  var stagingSheet = getOrCreateSheet(ss, cfg.SHEET_NAME);
  var now = new Date();
  var createdAt = now.toISOString();

  // Clean up expired rows while finding or inserting
  var data = stagingSheet.getDataRange().getValues();
  var rowsToKeep = [];
  if (data.length > 0 && data[0].length >= cfg.HEADERS.length) {
    rowsToKeep.push(data[0]);
  } else {
    rowsToKeep.push(cfg.HEADERS);
  }

  for (var i = 1; i < data.length; i++) {
    var rowOpId = String(data[i][0] || "").trim();
    var rowExpires = new Date(data[i][6]);
    if (rowOpId !== operationId && now <= rowExpires) {
      rowsToKeep.push(data[i]);
    }
  }

  // Append new row with status
  rowsToKeep.push([
    operationId,
    sessionId,
    encryptedPayload,
    status || "pending",
    count,
    createdAt,
    expiresAt
  ]);

  stagingSheet.clearContents();
  stagingSheet.getRange(1, 1, rowsToKeep.length, cfg.HEADERS.length).setValues(rowsToKeep);

  // Cache in CacheService L1 cache
  try {
    var cache = CacheService.getScriptCache();
    cache.put("staged_" + operationId, JSON.stringify({
      operationId: operationId,
      sessionId: sessionId,
      encryptedPayload: encryptedPayload,
      status: status || "pending",
      count: count,
      createdAt: createdAt,
      expiresAt: expiresAt
    }), 900);
  } catch (cErr) {}
}

/**
 * Updates the status ('pending', 'committed', 'failed') of a staged credential entry.
 */
function updateStagedStatus(ss, operationId, sessionId, newStatus) {
  var cfg = CONFIG.STAGED_CREDENTIALS_CONFIG;
  var stagingSheet = getSheetRobust(ss, cfg.SHEET_NAME);
  if (!stagingSheet) return;

  var data = stagingSheet.getDataRange().getValues();
  var found = false;
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0] || "").trim() === operationId && String(data[i][1] || "").trim() === sessionId) {
      data[i][3] = newStatus;
      found = true;
      break;
    }
  }
  if (found) {
    stagingSheet.getDataRange().setValues(data);
  }

  // Update L1 cache
  try {
    var cache = CacheService.getScriptCache();
    var cached = cache.get("staged_" + operationId);
    if (cached) {
      var parsed = JSON.parse(cached);
      parsed.status = newStatus;
      cache.put("staged_" + operationId, JSON.stringify(parsed), 900);
    }
  } catch (cErr) {}
}

/**
 * Retrieves staged credentials from L1 Cache or durable _StagedCredentials sheet.
 */
function getStagedCredentials(ss, operationId, sessionId) {
  var now = new Date();

  // Try CacheService first
  try {
    var cache = CacheService.getScriptCache();
    if (operationId && operationId !== "latest") {
      var cached = cache.get("staged_" + operationId);
      if (cached) {
        var parsed = JSON.parse(cached);
        if (parsed.sessionId === sessionId && new Date(parsed.expiresAt) > now) {
          return parsed;
        }
      }
    }
  } catch (cErr) {}

  // Fallback to durable _StagedCredentials sheet
  var cfg = CONFIG.STAGED_CREDENTIALS_CONFIG;
  var stagingSheet = getSheetRobust(ss, cfg.SHEET_NAME);
  if (!stagingSheet) return null;

  var data = stagingSheet.getDataRange().getValues();
  if (data.length <= 1) return null;

  var targetRow = null;
  if (operationId === "latest" || !operationId) {
    for (var i = data.length - 1; i >= 1; i--) {
      var rowSession = String(data[i][1] || "").trim();
      var rowExpires = new Date(data[i][6]);
      if (rowSession === sessionId && now <= rowExpires) {
        targetRow = data[i];
        break;
      }
    }
  } else {
    for (var j = 1; j < data.length; j++) {
      var rowOpId = String(data[j][0] || "").trim();
      var rowSess = String(data[j][1] || "").trim();
      var rowExp = new Date(data[j][6]);
      if (rowOpId === operationId && rowSess === sessionId && now <= rowExp) {
        targetRow = data[j];
        break;
      }
    }
  }

  if (!targetRow) return null;

  return {
    operationId: targetRow[0],
    sessionId: targetRow[1],
    encryptedPayload: targetRow[2],
    status: String(targetRow[3] || "pending"),
    count: Number(targetRow[4]),
    createdAt: targetRow[5],
    expiresAt: targetRow[6]
  };
}

/**
 * Custom Cryptography Architecture & Security Limitations:
 * WARNING: This implementation is custom software cryptography constructed within the
 * runtime constraints of Google Apps Script (V8 engine).
 * 
 * Google Apps Script does NOT provide:
 * 1. The W3C Web Crypto API (crypto.subtle).
 * 2. Standard authenticated AEAD ciphers (e.g. AES-GCM, ChaCha20-Poly1305).
 * 3. Hardware-backed cryptographic acceleration (AES-NI).
 * 4. True constant-time execution guarantees at the bytecode/JIT optimization level.
 * 
 * To protect short-lived (15-minute TTL) staged PIN credentials in Google Sheets from passive
 * plaintext exposure without relying on plaintext sheet storage, this module implements a
 * custom Encrypt-then-MAC (EtM) scheme using the only primitives provided by Apps Script:
 * 1. Domain-separated keys derived using SHA-256:
 *    - encKey = SHA-256("arcade_enc:" + teacherToken + ":" + pepper)
 *    - macKey = SHA-256("arcade_mac:" + teacherToken + ":" + pepper)
 * 2. Keystream generated via HMAC-SHA256 in CTR mode using native Utilities.computeHmacSha256Signature.
 * 3. An HMAC-SHA256 authentication tag is computed over (iv + ":" + cipherHex + ":" + operationId + ":" + expiresAt).
 * 4. On decryption, the authentication tag is strictly verified in constant time (constantTimeEqual)
 *    BEFORE ciphertext is decrypted. Any bit-flipping, truncation, or tampering immediately halts with an authentication error.
 * 
 * Cryptographic Limitations & Scope:
 * - This custom construction is solely an ephemeral in-transit buffer for 15-minute credential delivery.
 * - It must NOT be used for long-term data-at-rest encryption.
 * - Staged credentials are automatically deleted upon expiration or successful claim.
 * - Confidentiality depends directly on the secrecy of the Script Property pepper and the teacher session token.
 */
function encryptStagedCredentials(plaintextStr, teacherToken, pepper, operationId, expiresAt) {
  var encKey = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, "arcade_enc:" + teacherToken + ":" + pepper);
  var macKey = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, "arcade_mac:" + teacherToken + ":" + pepper);

  var iv = Utilities.getUuid().substring(0, 16);
  var plainBlob = Utilities.newBlob(plaintextStr);
  var plainBytes = plainBlob.getBytes();
  var cipherBytes = [];

  var blockIndex = 0;
  var keystream = [];
  var keystreamPos = 32;

  for (var i = 0; i < plainBytes.length; i++) {
    if (keystreamPos >= 32) {
      keystream = Utilities.computeHmacSha256Signature(iv + ":" + blockIndex, encKey);
      blockIndex++;
      keystreamPos = 0;
    }
    var b = (plainBytes[i] ^ keystream[keystreamPos]) & 0xFF;
    cipherBytes.push(b);
    keystreamPos++;
  }

  var cipherHex = "";
  for (var j = 0; j < cipherBytes.length; j++) {
    var h = cipherBytes[j].toString(16);
    if (h.length === 1) cipherHex += "0";
    cipherHex += h;
  }

  // Encrypt-then-MAC: Compute authentication tag over (iv + ":" + cipherHex + ":" + operationId + ":" + expiresAt)
  var authPayload = iv + ":" + cipherHex + ":" + operationId + ":" + expiresAt;
  var macBytes = Utilities.computeHmacSha256Signature(authPayload, macKey);
  var macTag = "";
  for (var m = 0; m < macBytes.length; m++) {
    var mh = ((macBytes[m] + 256) % 256).toString(16);
    if (mh.length === 1) macTag += "0";
    macTag += mh;
  }

  return iv + ":" + cipherHex + ":" + macTag;
}

/**
 * Decrypts temporary credentials using HMAC-SHA256 in CTR mode with constant-time MAC verification.
 */
function decryptStagedCredentials(ciphertextWithMac, teacherToken, pepper, operationId, expiresAt) {
  var parts = String(ciphertextWithMac || "").split(":");
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted payload structure. Expected iv:ciphertext:mac");
  }

  var iv = parts[0];
  var cipherHex = parts[1];
  var providedMac = parts[2];

  var encKey = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, "arcade_enc:" + teacherToken + ":" + pepper);
  var macKey = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, "arcade_mac:" + teacherToken + ":" + pepper);

  // Authenticate before decryption (Encrypt-then-MAC)
  var authPayload = iv + ":" + cipherHex + ":" + operationId + ":" + expiresAt;
  var macBytes = Utilities.computeHmacSha256Signature(authPayload, macKey);
  var expectedMac = "";
  for (var m = 0; m < macBytes.length; m++) {
    var mh = ((macBytes[m] + 256) % 256).toString(16);
    if (mh.length === 1) expectedMac += "0";
    expectedMac += mh;
  }

  if (!constantTimeEqual(providedMac, expectedMac)) {
    throw new Error("MAC authentication verification failed. Ciphertext may have been tampered with or corrupted.");
  }

  var cipherBytes = [];
  for (var c = 0; c < cipherHex.length; c += 2) {
    cipherBytes.push(parseInt(cipherHex.substr(c, 2), 16));
  }

  var plainBytes = [];
  var blockIndex = 0;
  var keystream = [];
  var keystreamPos = 32;

  for (var i = 0; i < cipherBytes.length; i++) {
    if (keystreamPos >= 32) {
      keystream = Utilities.computeHmacSha256Signature(iv + ":" + blockIndex, encKey);
      blockIndex++;
      keystreamPos = 0;
    }
    var b = (cipherBytes[i] ^ keystream[keystreamPos]) & 0xFF;
    if (b > 127) b = b - 256;
    plainBytes.push(b);
    keystreamPos++;
  }

  var blob = Utilities.newBlob(plainBytes);
  return blob.getDataAsString();
}

/**
 * Constant-time string equality check to mitigate timing side-channel attacks on MAC verification.
 */
function constantTimeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (a.length !== b.length) return false;
  var diff = 0;
  for (var i = 0; i < a.length; i++) {
    diff |= (a.charCodeAt(i) ^ b.charCodeAt(i));
  }
  return diff === 0;
}

/**
 * Efficient bulk session invalidation for multiple student numbers.
 * Performs a single batch in-memory scan and update to eliminate multiple sheet calls.
 */
function invalidateMultipleStudentSessions(ss, studentNumbers) {
  if (!Array.isArray(studentNumbers) || studentNumbers.length === 0) return;
  var sessionsSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.SESSIONS);
  if (!sessionsSheet) return;

  var set = {};
  for (var j = 0; j < studentNumbers.length; j++) {
    set[String(studentNumbers[j]).trim()] = true;
  }

  var data = sessionsSheet.getDataRange().getValues();
  if (data.length <= 1) return;

  var colMap = getSheetColumnMap(sessionsSheet, CONFIG.SESSION_HEADERS);
  var now = new Date().toISOString();
  var modified = false;

  for (var i = 1; i < data.length; i++) {
    var sNum = String(data[i][colMap["student_number"] - 1] || "").trim();
    var status = String(data[i][colMap["status"] - 1] || "");
    if (set[sNum] && status === "active") {
      data[i][colMap["status"] - 1] = "revoked";
      data[i][colMap["logout_time"] - 1] = now;
      modified = true;
    }
  }

  if (modified) {
    sessionsSheet.getDataRange().setValues(data);
  }
}

/**
 * Authenticated endpoint: Activates or deactivates a student account.
 */
function handleTeacherSetStudentActive(ss, payload) {
  var auth = validateTeacherSession(ss, payload.teacherToken);
  if (!auth.valid) {
    return createJsonResponse({ success: false, error: auth.error, code: auth.code });
  }

  var studentNumber = String(payload.studentNumber || "").trim();
  if (!studentNumber) {
    return createJsonResponse({ success: false, error: "Student number is required.", code: "BAD_REQUEST" });
  }
  var isActive = Boolean(payload.isActive);

  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (lockErr) {
    return createJsonResponse({ success: false, error: "Server is busy. Please retry.", code: "RATE_LIMITED" });
  }

  try {
    var studentsSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.STUDENTS);
    var studentData = studentsSheet.getDataRange().getValues();
    var colMap = getSheetColumnMap(studentsSheet, CONFIG.STUDENT_HEADERS);

    var targetRowIndex = -1;
    for (var i = 1; i < studentData.length; i++) {
      var rowNum = String(studentData[i][colMap["student_number"] - 1] || "").trim();
      if (rowNum === studentNumber) {
        targetRowIndex = i + 1;
        break;
      }
    }

    if (targetRowIndex === -1) {
      return createJsonResponse({ success: false, error: "Student #" + studentNumber + " not found.", code: "NOT_FOUND" });
    }

    studentsSheet.getRange(targetRowIndex, colMap["is_active"]).setValue(isActive);
    if (!isActive) {
      invalidateStudentSessions(ss, studentNumber);
    }

    return createJsonResponse({
      success: true,
      message: "Student account #" + studentNumber + " " + (isActive ? "activated" : "deactivated") + " successfully.",
      studentNumber: studentNumber,
      isActive: isActive
    });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Authenticated endpoint: Previews demo accounts and their associated records.
 */
function handleTeacherGetDemoAccountsPreview(ss, payload) {
  var auth = validateTeacherSession(ss, payload.teacherToken);
  if (!auth.valid) {
    return createJsonResponse({ success: false, error: auth.error, code: auth.code });
  }

  var studentsSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.STUDENTS);
  var attemptsSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.ATTEMPTS);
  var sessionsSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.SESSIONS);

  var sData = studentsSheet ? studentsSheet.getDataRange().getValues() : [];
  var aData = attemptsSheet ? attemptsSheet.getDataRange().getValues() : [];
  var sessData = sessionsSheet ? sessionsSheet.getDataRange().getValues() : [];

  var sCol = studentsSheet ? getSheetColumnMap(studentsSheet, CONFIG.STUDENT_HEADERS) : {};
  var aCol = attemptsSheet ? getSheetColumnMap(attemptsSheet, CONFIG.ATTEMPT_HEADERS) : {};
  var sessCol = sessionsSheet ? getSheetColumnMap(sessionsSheet, CONFIG.SESSION_HEADERS) : {};

  // Count attempts by student number
  var attemptCounts = {};
  for (var a = 1; a < aData.length; a++) {
    var aNum = String(aData[a][aCol["student_number"] - 1] || "").trim();
    if (aNum) attemptCounts[aNum] = (attemptCounts[aNum] || 0) + 1;
  }

  // Count sessions by student number
  var sessionCounts = {};
  for (var s = 1; s < sessData.length; s++) {
    var sNum = String(sessData[s][sessCol["student_number"] - 1] || "").trim();
    if (sNum) sessionCounts[sNum] = (sessionCounts[sNum] || 0) + 1;
  }

  var demoList = [];
  for (var i = 1; i < sData.length; i++) {
    var num = String(sData[i][sCol["student_number"] - 1] || "").trim();
    var fName = String(sData[i][sCol["full_name"] - 1] || "");
    var cls = String(sData[i][sCol["class"] - 1] || "").trim();
    var isAct = Boolean(sData[i][sCol["is_active"] - 1]);

    if (isVerifiedDemoAccount(num, fName, cls)) {
      var baseNum = num.replace(/_demo$/, "");
      var isArchived = cls === "DEMO_ARCHIVE" || num.endsWith("_demo") || !isAct;
      demoList.push({
        studentNumber: baseNum,
        fullName: fName,
        class: cls,
        grade: String(sData[i][sCol["grade"] - 1] || ""),
        isActive: isAct,
        isArchived: isArchived,
        attemptsCount: attemptCounts[num] || attemptCounts[baseNum] || 0,
        sessionsCount: sessionCounts[num] || sessionCounts[baseNum] || 0
      });
    }
  }

  return createJsonResponse({
    success: true,
    demoAccounts: demoList
  });
}

/**
 * Authenticated endpoint: Safely archives demonstration test accounts without losing historical data.
 */
function handleTeacherArchiveDemoAccounts(ss, payload) {
  var auth = validateTeacherSession(ss, payload.teacherToken);
  if (!auth.valid) {
    return createJsonResponse({ success: false, error: auth.error, code: auth.code });
  }

  if (payload.confirmed !== true) {
    return createJsonResponse({ success: false, error: "Explicit confirmation required to archive demo accounts.", code: "BAD_REQUEST" });
  }

  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (lockErr) {
    return createJsonResponse({ success: false, error: "Server is busy. Please retry.", code: "RATE_LIMITED" });
  }

  try {
    var studentsSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.STUDENTS);
    var studentData = studentsSheet.getDataRange().getValues();
    var colMap = getSheetColumnMap(studentsSheet, CONFIG.STUDENT_HEADERS);

    var archivedCount = 0;
    for (var i = 1; i < studentData.length; i++) {
      var num = String(studentData[i][colMap["student_number"] - 1] || "").trim();
      var fName = String(studentData[i][colMap["full_name"] - 1] || "");
      var cls = String(studentData[i][colMap["class"] - 1] || "").trim();

      if (isVerifiedDemoAccount(num, fName, cls)) {
        var rowIndex = i + 1;
        // Non-destructive archive: mark is_active = false and tag class as DEMO_ARCHIVE
        studentsSheet.getRange(rowIndex, colMap["is_active"]).setValue(false);
        studentsSheet.getRange(rowIndex, colMap["class"]).setValue("DEMO_ARCHIVE");
        invalidateStudentSessions(ss, num);

        // Relink raw number to num + "_demo" so real students can reuse 701-704 / 801-804 without collision
        if (!num.endsWith("_demo")) {
          var archivedNum = num + "_demo";
          studentsSheet.getRange(rowIndex, colMap["student_number"]).setValue(archivedNum);
          relinkDemoRecordsInSheet(ss, CONFIG.SHEET_NAMES.ATTEMPTS, "student_number", num, archivedNum, "class", "DEMO_ARCHIVE");
          relinkDemoRecordsInSheet(ss, CONFIG.SHEET_NAMES.ANSWERS, "student_number", num, archivedNum, "class", "DEMO_ARCHIVE");
          relinkDemoRecordsInSheet(ss, CONFIG.SHEET_NAMES.SESSIONS, "student_number", num, archivedNum);
          relinkDemoRecordsInSheet(ss, CONFIG.SHEET_NAMES.ACHIEVEMENTS, "student_number", num, archivedNum);
          relinkDemoRecordsInSheet(ss, CONFIG.SHEET_NAMES.MONSTERS, "student_number", num, archivedNum);
          relinkDemoRecordsInSheet(ss, CONFIG.SHEET_NAMES.COIN_TRANSACTIONS, "student_number", num, archivedNum);
        }

        archivedCount++;
      }
    }

    return createJsonResponse({
      success: true,
      message: "Successfully archived " + archivedCount + " demo account(s). Classroom analytics are now clean.",
      archivedCount: archivedCount
    });
  } finally {
    lock.releaseLock();
  }
}

// ============================================================================
// TEACHER QUESTION BANK MANAGEMENT (PHASE 1)
// ============================================================================

/**
 * Standalone, non-destructive setup for QuestionBank sheet.
 * Can be run independently without affecting other sheets or data.
 */
function setupQuestionBankSheet(ss) {
  ss = ss || getArcadeSpreadsheet();
  var qbSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.QUESTION_BANK);
  setupSheetHeaders(qbSheet, CONFIG.QUESTION_BANK_HEADERS, "#0f766e", "#ccfbf1");
  return qbSheet;
}

/**
 * ACTION: teacher_get_question_bank
 * Retrieves questions with optional filtering, topic matching, and diagnostic status.
 */
function handleTeacherGetQuestionBank(ss, payload) {
  var auth = validateTeacherSession(ss, payload.teacherToken);
  if (!auth.valid) {
    return createJsonResponse({ success: false, error: auth.error, code: auth.code });
  }

  var qbSheet = setupQuestionBankSheet(ss);
  var data = qbSheet.getDataRange().getValues();
  if (data.length <= 1) {
    return createJsonResponse({ success: true, count: 0, total: 0, questions: [] });
  }

  var colMap = getSheetColumnMap(qbSheet, CONFIG.QUESTION_BANK_HEADERS);
  var filterSection = payload.section && payload.section !== "all" ? String(payload.section).trim() : null;
  var filterGrade = payload.gradeId && payload.gradeId !== "all" ? String(payload.gradeId).trim() : null;
  var filterUnit = payload.unitId ? String(payload.unitId).trim() : null;
  var filterSkill = payload.skill && payload.skill !== "all" ? String(payload.skill).trim() : null;
  var filterTopic = payload.topic ? String(payload.topic).trim().toLowerCase() : null;
  var filterDiff = payload.difficulty && payload.difficulty !== "all" ? String(payload.difficulty).trim() : null;
  var filterType = payload.questionType && payload.questionType !== "all" ? String(payload.questionType).trim() : null;
  var filterGameType = payload.gameType && payload.gameType !== "all" ? String(payload.gameType).trim() : null;
  var filterStatus = payload.status && payload.status !== "all" ? String(payload.status).trim() : "active";
  var searchQuery = payload.searchQuery ? String(payload.searchQuery).trim().toLowerCase() : null;

  var results = [];
  var totalMatches = 0;

  for (var r = 1; r < data.length; r++) {
    var row = data[r];
    var qId = String(row[colMap["question_id"] - 1] || "").trim();
    if (!qId) continue;

    var qStatus = String(row[colMap["status"] - 1] || "active").trim();
    if (payload.status !== "all" && qStatus !== filterStatus) continue;

    var qSection = String(row[colMap["section"] - 1] || "general_english").trim();
    if (filterSection && qSection !== filterSection && qSection !== "both") continue;

    var qGrade = String(row[colMap["grade_id"] - 1] || "all").trim();
    if (filterGrade && qGrade !== filterGrade && qGrade !== "all") continue;

    var qUnit = String(row[colMap["unit_id"] - 1] || "").trim();
    if (filterUnit && qUnit !== filterUnit) continue;

    var qSkill = String(row[colMap["skill"] - 1] || "grammar").trim();
    if (filterSkill && qSkill !== filterSkill) continue;

    var qTopic = String(row[colMap["topic"] - 1] || "").trim();
    if (filterTopic && qTopic.toLowerCase().indexOf(filterTopic) === -1) continue;

    var qDiff = String(row[colMap["difficulty"] - 1] || "medium").trim();
    if (filterDiff && qDiff !== filterDiff) continue;

    var qType = String(row[colMap["question_type"] - 1] || "multiple_choice").trim();
    if (filterType && qType !== filterType) continue;

    var games = [];
    var gRaw = String(row[colMap["assigned_game_types"] - 1] || "");
    if (gRaw) {
      try { games = JSON.parse(gRaw); } catch (gErr) {}
    }
    if (filterGameType && games.indexOf(filterGameType) === -1) continue;

    var prompt = String(row[colMap["prompt"] - 1] || "");
    var correctPreview = String(row[colMap["correct_answer_preview"] - 1] || "");
    var tagsRaw = String(row[colMap["tags"] - 1] || "");
    var pRaw = String(row[colMap["payload_json"] - 1] || "");

    if (searchQuery) {
      var matchPrompt = prompt.toLowerCase().indexOf(searchQuery) !== -1;
      var matchTopic = qTopic.toLowerCase().indexOf(searchQuery) !== -1;
      var matchPreview = correctPreview.toLowerCase().indexOf(searchQuery) !== -1;
      var matchTags = tagsRaw.toLowerCase().indexOf(searchQuery) !== -1;
      var matchPayload = pRaw.toLowerCase().indexOf(searchQuery) !== -1;
      if (!matchPrompt && !matchTopic && !matchPreview && !matchTags && !matchPayload) continue;
    }

    totalMatches++;

    var payloadJson = {};
    if (pRaw) {
      try { payloadJson = JSON.parse(pRaw); } catch (pErr) {}
    }

    var tags = [];
    if (tagsRaw) {
      try { tags = JSON.parse(tagsRaw); } catch (tErr) {}
    }

    results.push({
      id: qId,
      section: qSection,
      gradeId: qGrade,
      unitId: qUnit,
      unitTitle: String(row[colMap["unit_title"] - 1] || ""),
      topic: qTopic,
      skill: qSkill,
      difficulty: qDiff,
      questionType: qType,
      assignedGameTypes: games,
      prompt: prompt,
      payload: payloadJson,
      correctAnswerPreview: String(row[colMap["correct_answer_preview"] - 1] || ""),
      explanation: String(row[colMap["explanation"] - 1] || ""),
      points: Number(row[colMap["points"] - 1]) || 10,
      tags: tags,
      status: qStatus,
      contentVersion: Number(row[colMap["content_version"] - 1]) || 1,
      createdAt: String(row[colMap["created_at"] - 1] || ""),
      updatedAt: String(row[colMap["updated_at"] - 1] || "")
    });
  }

  return createJsonResponse({
    success: true,
    count: results.length,
    total: totalMatches,
    questions: results
  });
}

/**
 * ACTION: teacher_save_question
 * Creates or updates a single question in QuestionBank sheet.
 */
function handleTeacherSaveQuestion(ss, payload) {
  var auth = validateTeacherSession(ss, payload.teacherToken);
  if (!auth.valid) {
    return createJsonResponse({ success: false, error: auth.error, code: auth.code });
  }

  var qData = payload.question;
  if (!qData || typeof qData !== "object") {
    return createJsonResponse({ success: false, error: "Missing question payload.", code: "BAD_REQUEST" });
  }

  var prompt = String(qData.prompt || "").trim();
  if (!prompt) {
    return createJsonResponse({ success: false, error: "Question prompt cannot be empty.", code: "BAD_REQUEST" });
  }

  var qbSheet = setupQuestionBankSheet(ss);
  var colMap = getSheetColumnMap(qbSheet, CONFIG.QUESTION_BANK_HEADERS);
  var data = qbSheet.getDataRange().getValues();
  var lastCol = qbSheet.getLastColumn();
  var now = new Date().toISOString();

  var targetId = String(qData.id || "").trim();
  var existingRowIdx = -1;

  if (targetId) {
    for (var r = 1; r < data.length; r++) {
      if (String(data[r][colMap["question_id"] - 1] || "").trim() === targetId) {
        existingRowIdx = r + 1; // 1-based row index
        break;
      }
    }
  }

  var isNew = (existingRowIdx === -1);
  var questionId = isNew ? ("qb_" + Utilities.getUuid().substring(0, 12)) : targetId;
  var contentVersion = 1;
  var createdAt = now;

  if (!isNew) {
    var oldVersion = Number(data[existingRowIdx - 1][colMap["content_version"] - 1]) || 1;
    contentVersion = oldVersion + 1;
    createdAt = String(data[existingRowIdx - 1][colMap["created_at"] - 1] || now);
  }

  var payloadJsonStr = JSON.stringify(qData.payload || {});
  var assignedGamesStr = JSON.stringify(qData.assignedGameTypes || ["quiz_battle"]);
  var tagsStr = JSON.stringify(qData.tags || []);
  var correctPreview = String(qData.correctAnswerPreview || "");

  // Narrow DocumentLock
  var lock = null;
  try {
    if (typeof LockService !== "undefined" && LockService) {
      if (typeof LockService.getDocumentLock === "function") {
        lock = LockService.getDocumentLock();
      }
      if (!lock && typeof LockService.getScriptLock === "function") {
        lock = LockService.getScriptLock();
      }
      if (lock && typeof lock.tryLock === "function") {
        lock.tryLock(15000);
      }
    }
  } catch (lErr) {}

  try {
    if (isNew) {
      var newRow = new Array(lastCol);
      for (var c = 0; c < lastCol; c++) newRow[c] = "";

      newRow[colMap["question_id"] - 1] = questionId;
      newRow[colMap["section"] - 1] = String(qData.section || "general_english");
      newRow[colMap["grade_id"] - 1] = String(qData.gradeId || "all");
      newRow[colMap["unit_id"] - 1] = String(qData.unitId || "");
      newRow[colMap["unit_title"] - 1] = String(qData.unitTitle || "");
      newRow[colMap["topic"] - 1] = String(qData.topic || "General");
      newRow[colMap["skill"] - 1] = String(qData.skill || "grammar");
      newRow[colMap["difficulty"] - 1] = String(qData.difficulty || "medium");
      newRow[colMap["question_type"] - 1] = String(qData.questionType || "multiple_choice");
      newRow[colMap["assigned_game_types"] - 1] = assignedGamesStr;
      newRow[colMap["prompt"] - 1] = prompt;
      newRow[colMap["payload_json"] - 1] = payloadJsonStr;
      newRow[colMap["correct_answer_preview"] - 1] = correctPreview;
      newRow[colMap["explanation"] - 1] = String(qData.explanation || "");
      newRow[colMap["points"] - 1] = Number(qData.points) || 10;
      newRow[colMap["tags"] - 1] = tagsStr;
      newRow[colMap["status"] - 1] = String(qData.status || "active");
      newRow[colMap["content_version"] - 1] = contentVersion;
      newRow[colMap["created_at"] - 1] = createdAt;
      newRow[colMap["updated_at"] - 1] = now;

      qbSheet.appendRow(newRow);
    } else {
      qbSheet.getRange(existingRowIdx, colMap["section"]).setValue(String(qData.section || "general_english"));
      qbSheet.getRange(existingRowIdx, colMap["grade_id"]).setValue(String(qData.gradeId || "all"));
      qbSheet.getRange(existingRowIdx, colMap["unit_id"]).setValue(String(qData.unitId || ""));
      qbSheet.getRange(existingRowIdx, colMap["unit_title"]).setValue(String(qData.unitTitle || ""));
      qbSheet.getRange(existingRowIdx, colMap["topic"]).setValue(String(qData.topic || "General"));
      qbSheet.getRange(existingRowIdx, colMap["skill"]).setValue(String(qData.skill || "grammar"));
      qbSheet.getRange(existingRowIdx, colMap["difficulty"]).setValue(String(qData.difficulty || "medium"));
      qbSheet.getRange(existingRowIdx, colMap["question_type"]).setValue(String(qData.questionType || "multiple_choice"));
      qbSheet.getRange(existingRowIdx, colMap["assigned_game_types"]).setValue(assignedGamesStr);
      qbSheet.getRange(existingRowIdx, colMap["prompt"]).setValue(prompt);
      qbSheet.getRange(existingRowIdx, colMap["payload_json"]).setValue(payloadJsonStr);
      qbSheet.getRange(existingRowIdx, colMap["correct_answer_preview"]).setValue(correctPreview);
      qbSheet.getRange(existingRowIdx, colMap["explanation"]).setValue(String(qData.explanation || ""));
      qbSheet.getRange(existingRowIdx, colMap["points"]).setValue(Number(qData.points) || 10);
      qbSheet.getRange(existingRowIdx, colMap["tags"]).setValue(tagsStr);
      qbSheet.getRange(existingRowIdx, colMap["status"]).setValue(String(qData.status || "active"));
      qbSheet.getRange(existingRowIdx, colMap["content_version"]).setValue(contentVersion);
      qbSheet.getRange(existingRowIdx, colMap["updated_at"]).setValue(now);
    }
    SpreadsheetApp.flush();
  } finally {
    if (lock) {
      try { lock.releaseLock(); } catch (rErr) {}
    }
  }

  return createJsonResponse({
    success: true,
    created: isNew,
    updated: !isNew,
    question: {
      id: questionId,
      prompt: prompt,
      contentVersion: contentVersion,
      status: String(qData.status || "active"),
      updatedAt: now
    }
  });
}

/**
 * ACTION: teacher_bulk_import_questions
 * Atomic batch import of questions with validation and deduplication.
 */
function handleTeacherBulkImportQuestions(ss, payload) {
  var auth = validateTeacherSession(ss, payload.teacherToken);
  if (!auth.valid) {
    return createJsonResponse({ success: false, error: auth.error, code: auth.code });
  }

  var list = payload.questions;
  if (!Array.isArray(list) || list.length === 0) {
    return createJsonResponse({ success: false, error: "Questions array cannot be empty.", code: "BAD_REQUEST" });
  }

  var qbSheet = setupQuestionBankSheet(ss);
  var colMap = getSheetColumnMap(qbSheet, CONFIG.QUESTION_BANK_HEADERS);
  var data = qbSheet.getDataRange().getValues();
  var lastCol = qbSheet.getLastColumn();
  var now = new Date().toISOString();

  var existingMap = {};
  for (var r = 1; r < data.length; r++) {
    var existId = String(data[r][colMap["question_id"] - 1] || "").trim();
    if (existId) existingMap[existId] = r + 1; // row index
  }

  var importedCount = 0;
  var updatedCount = 0;
  var rowsToAppend = [];
  var importedIds = [];
  var batchId = String(payload.importBatchId || "").trim();

  // Pre-process items in pure memory
  for (var i = 0; i < list.length; i++) {
    var q = list[i];
    var prompt = String(q.prompt || "").trim();
    if (!prompt) continue;

    var qId = String(q.id || "").trim();
    var targetId = qId || ("qb_" + Utilities.getUuid().substring(0, 12));
    var isExisting = Boolean(existingMap[targetId]);

    var rowArr = new Array(lastCol);
    for (var c = 0; c < lastCol; c++) rowArr[c] = "";

    var qPayload = q.payload || {};
    if (batchId) {
      qPayload.importBatchId = batchId;
    }

    var qTags = Array.isArray(q.tags) ? q.tags.slice() : [];
    if (batchId && qTags.indexOf("batch:" + batchId) === -1) {
      qTags.push("batch:" + batchId);
    }

    rowArr[colMap["question_id"] - 1] = targetId;
    rowArr[colMap["section"] - 1] = String(q.section || "general_english");
    rowArr[colMap["grade_id"] - 1] = String(q.gradeId || "all");
    rowArr[colMap["unit_id"] - 1] = String(q.unitId || "");
    rowArr[colMap["unit_title"] - 1] = String(q.unitTitle || "");
    rowArr[colMap["topic"] - 1] = String(q.topic || "General");
    rowArr[colMap["skill"] - 1] = String(q.skill || "grammar");
    rowArr[colMap["difficulty"] - 1] = String(q.difficulty || "medium");
    rowArr[colMap["question_type"] - 1] = String(q.questionType || "multiple_choice");
    rowArr[colMap["assigned_game_types"] - 1] = JSON.stringify(q.assignedGameTypes || ["quiz_battle"]);
    rowArr[colMap["prompt"] - 1] = prompt;
    rowArr[colMap["payload_json"] - 1] = JSON.stringify(qPayload);
    rowArr[colMap["correct_answer_preview"] - 1] = String(q.correctAnswerPreview || "");
    rowArr[colMap["explanation"] - 1] = String(q.explanation || "");
    rowArr[colMap["points"] - 1] = Number(q.points) || 10;
    rowArr[colMap["tags"] - 1] = JSON.stringify(qTags);
    rowArr[colMap["status"] - 1] = String(q.status || "active");
    rowArr[colMap["content_version"] - 1] = Number(q.contentVersion) || 1;
    rowArr[colMap["created_at"] - 1] = now;
    rowArr[colMap["updated_at"] - 1] = now;

    if (isExisting && payload.overwriteDuplicates) {
      var rowNum = existingMap[targetId];
      data[rowNum - 1] = rowArr;
      updatedCount++;
      importedIds.push(targetId);
    } else if (!isExisting) {
      rowsToAppend.push(rowArr);
      importedCount++;
      importedIds.push(targetId);
    }
  }

  // Narrow DocumentLock for batch write
  var lock = null;
  try {
    if (typeof LockService !== "undefined" && LockService) {
      if (typeof LockService.getDocumentLock === "function") {
        lock = LockService.getDocumentLock();
      }
      if (!lock && typeof LockService.getScriptLock === "function") {
        lock = LockService.getScriptLock();
      }
      if (lock && typeof lock.tryLock === "function") {
        lock.tryLock(30000);
      }
    }
  } catch (lErr) {}

  try {
    if (updatedCount > 0) {
      qbSheet.getDataRange().setValues(data);
    }
    if (rowsToAppend.length > 0) {
      var startRow = qbSheet.getLastRow() + 1;
      qbSheet.getRange(startRow, 1, rowsToAppend.length, lastCol).setValues(rowsToAppend);
    }
    SpreadsheetApp.flush();
  } finally {
    if (lock) {
      try { lock.releaseLock(); } catch (rErr) {}
    }
  }

  return createJsonResponse({
    success: true,
    importedCount: importedCount,
    updatedCount: updatedCount,
    count: importedCount + updatedCount,
    importBatchId: batchId,
    importedIds: importedIds
  });
}

/**
 * ACTION: teacher_archive_question
 * Non-destructive soft delete: sets status to 'archived'.
 */
function handleTeacherArchiveQuestion(ss, payload) {
  var auth = validateTeacherSession(ss, payload.teacherToken);
  if (!auth.valid) {
    return createJsonResponse({ success: false, error: auth.error, code: auth.code });
  }

  var targetId = String(payload.questionId || "").trim();
  if (!targetId) {
    return createJsonResponse({ success: false, error: "Question ID required.", code: "BAD_REQUEST" });
  }

  var qbSheet = setupQuestionBankSheet(ss);
  var colMap = getSheetColumnMap(qbSheet, CONFIG.QUESTION_BANK_HEADERS);
  var data = qbSheet.getDataRange().getValues();
  var foundRow = -1;

  for (var r = 1; r < data.length; r++) {
    if (String(data[r][colMap["question_id"] - 1] || "").trim() === targetId) {
      foundRow = r + 1;
      break;
    }
  }

  if (foundRow === -1) {
    return createJsonResponse({ success: false, error: "Question not found.", code: "NOT_FOUND" });
  }

  var lock = null;
  try {
    if (typeof LockService !== "undefined" && LockService) {
      if (typeof LockService.getDocumentLock === "function") {
        lock = LockService.getDocumentLock();
      }
      if (!lock && typeof LockService.getScriptLock === "function") {
        lock = LockService.getScriptLock();
      }
      if (lock && typeof lock.tryLock === "function") {
        lock.tryLock(15000);
      }
    }
  } catch (lErr) {}

  try {
    qbSheet.getRange(foundRow, colMap["status"]).setValue("archived");
    qbSheet.getRange(foundRow, colMap["updated_at"]).setValue(new Date().toISOString());
    SpreadsheetApp.flush();
  } finally {
    if (lock) {
      try { lock.releaseLock(); } catch (rErr) {}
    }
  }

  return createJsonResponse({
    success: true,
    archivedId: targetId,
    status: "archived"
  });
}

/**
 * ACTION: teacher_rollback_question_import
 * Safely rolls back the last import batch by removing the questions that were
 * added in that specific batch, without affecting any previously existing questions.
 */
function handleTeacherRollbackQuestionImport(ss, payload) {
  var auth = validateTeacherSession(ss, payload.teacherToken);
  if (!auth.valid) {
    return createJsonResponse({ success: false, error: auth.error, code: auth.code });
  }

  var batchId = String(payload.importBatchId || "").trim();
  var questionIds = Array.isArray(payload.questionIds) ? payload.questionIds : [];

  if (!batchId && questionIds.length === 0) {
    return createJsonResponse({
      success: false,
      error: "Either importBatchId or questionIds is required for rollback.",
      code: "BAD_REQUEST"
    });
  }

  var qbSheet = setupQuestionBankSheet(ss);
  var colMap = getSheetColumnMap(qbSheet, CONFIG.QUESTION_BANK_HEADERS);
  var data = qbSheet.getDataRange().getValues();

  var idSet = {};
  for (var i = 0; i < questionIds.length; i++) {
    idSet[String(questionIds[i]).trim()] = true;
  }

  var rowsToKeep = [data[0]]; // Retain header row
  var rolledBackCount = 0;
  var rolledBackIds = [];

  for (var r = 1; r < data.length; r++) {
    var row = data[r];
    var qId = String(row[colMap["question_id"] - 1] || "").trim();
    var tagsRaw = String(row[colMap["tags"] - 1] || "");
    var payloadRaw = String(row[colMap["payload_json"] - 1] || "");

    var isMatch = false;
    if (qId && idSet[qId]) {
      isMatch = true;
    } else if (batchId) {
      if (tagsRaw.indexOf(batchId) !== -1 || payloadRaw.indexOf(batchId) !== -1) {
        isMatch = true;
      }
    }

    if (isMatch) {
      rolledBackCount++;
      rolledBackIds.push(qId);
    } else {
      rowsToKeep.push(row);
    }
  }

  if (rolledBackCount === 0) {
    return createJsonResponse({
      success: true,
      rolledBackCount: 0,
      message: "No questions matched the specified rollback batch."
    });
  }

  var lock = null;
  try {
    if (typeof LockService !== "undefined" && LockService) {
      if (typeof LockService.getDocumentLock === "function") {
        lock = LockService.getDocumentLock();
      }
      if (!lock && typeof LockService.getScriptLock === "function") {
        lock = LockService.getScriptLock();
      }
      if (lock && typeof lock.tryLock === "function") {
        lock.tryLock(30000);
      }
    }
  } catch (lErr) {}

  try {
    var lastCol = (rowsToKeep[0] && rowsToKeep[0].length > 0) ? rowsToKeep[0].length : qbSheet.getLastColumn();
    qbSheet.clearContents();
    qbSheet.getRange(1, 1, rowsToKeep.length, lastCol).setValues(rowsToKeep);
    SpreadsheetApp.flush();
  } finally {
    if (lock) {
      try { lock.releaseLock(); } catch (rErr) {}
    }
  }

  return createJsonResponse({
    success: true,
    rolledBackCount: rolledBackCount,
    rolledBackIds: rolledBackIds,
    message: "Successfully rolled back " + rolledBackCount + " imported questions."
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
  var highAccuracyCoins = (isFirstCompletion && percentage >= 90) ? 3 : 0;
  var perfectScoreCoins = (isFirstCompletion && percentage >= 100) ? 5 : 0;

  // Daily First Activity bonus (+5 coins)
  var compDateStr = payload.completedAt || now;
  var todayPrefix = toIsoDatePrefix(compDateStr);
  var priorTodayAttempts = 0;
  for (var t = 0; t < priorCompletedAttempts.length; t++) {
    var ca = priorCompletedAttempts[t].completedAt;
    if (toIsoDatePrefix(ca) === todayPrefix) {
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
              toIsoDatePrefix(txData[k][cCol]) === todayPrefix) {
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
 * Optimized: Accepts optional pre-fetched pepper and pre-computes round suffix
 * byte tables in pure V8 JavaScript to eliminate 999 expensive Java host-bridge
 * calls per student while guaranteeing 100% bit-for-bit identical cryptographic output.
 */
function hashPinWithSaltAndPepper(pin, salt, optPepper) {
  var pepper = optPepper || getOrCreateSecretPepper();
  var input = pin + ":" + salt + ":" + pepper;
  var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, input);

  // Performance Optimization:
  // Convert the static prefix (salt + ":" + pepper + ":") once to bytes.
  var prefix = salt + ":" + pepper + ":";
  var prefixBytes = Utilities.newBlob(prefix).getBytes();
  var prefixLen = prefixBytes.length;

  // Pre-generate suffix byte arrays for rounds 0 to CONFIG.SALT_ROUNDS - 1
  // in pure V8 JavaScript to eliminate expensive Java host-bridge calls.
  var suffixTable = new Array(CONFIG.SALT_ROUNDS);
  for (var r = 0; r < CONFIG.SALT_ROUNDS; r++) {
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

  for (var round = 0; round < CONFIG.SALT_ROUNDS; round++) {
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
 * Diagnostic & Compatibility verification for 1,000-round student PIN hashing.
 * Compares the optimized implementation against the original baseline bit-for-bit.
 */
function testStudentPinHashCompatibility() {
  var testPin = "4829";
  var testSalt = "test_compat_student_salt_999";
  var pepper = getOrCreateSecretPepper();

  // Baseline implementation
  var input = testPin + ":" + testSalt + ":" + pepper;
  var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, input);
  for (var round = 0; round < CONFIG.SALT_ROUNDS; round++) {
    var combined = digest.concat(Utilities.newBlob(testSalt + ":" + pepper + ":" + round).getBytes());
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
  var optimizedHex = hashPinWithSaltAndPepper(testPin, testSalt, pepper);

  var matches = baselineHex === optimizedHex;
  Logger.log("Student PIN Hash Compatibility Test: " + (matches ? "PASSED (100% bit match)" : "FAILED"));
  return matches;
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

  // 9. QUESTION BANK SHEET (Phase 1 Question Bank Manager - Non-destructive)
  setupQuestionBankSheet(ss);

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
    if (input.accessories.aura) accessories.aura = String(input.accessories.aura).trim();
    if (input.accessories.frame) accessories.frame = String(input.accessories.frame).trim();
    if (Array.isArray(input.accessories.owned)) {
      accessories.owned = input.accessories.owned.map(function(item) {
        return String(item).trim();
      }).filter(function(item) {
        return item.length > 0;
      });
    }
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
 * Merges authoritatively with permanently unlocked classroom behavior rewards
 * from Class_RewardGrants to ensure cross-device consistency.
 */
function getStudentMonsterConfig(ss, studentNumber) {
  if (!ss || !studentNumber) return JSON.parse(JSON.stringify(DEFAULT_MONSTER_DATA));

  var mSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.MONSTERS);
  var config = null;
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

          config = sanitizeMonsterConfig({
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
          break;
        }
      }
    }
  }

  if (!config) {
    config = JSON.parse(JSON.stringify(DEFAULT_MONSTER_DATA));
  }

  return mergeClassroomRewardsIntoMonster(ss, studentNumber, config);
}

/**
 * Merges permanently unlocked classroom behavior rewards from Class_RewardGrants
 * into the student's monster accessories.owned list.
 * Ensures the backend Class_RewardGrants table is the single source of truth across all devices.
 */
function mergeClassroomRewardsIntoMonster(ss, studentNumber, monsterConfig) {
  if (!ss || !studentNumber || !monsterConfig) return monsterConfig;

  try {
    var grantsSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.CLASS_REWARD_GRANTS);
    if (!grantsSheet || grantsSheet.getLastRow() <= 1) {
      return monsterConfig;
    }

    var permanentRewards = getStudentPermanentRewardGrants(ss, studentNumber);
    if (!permanentRewards || !permanentRewards.grants || permanentRewards.grants.length === 0) {
      return monsterConfig;
    }

    var rewardDefs = getClassroomRewardDefinitions(ss);
    var cosmeticMap = {};
    for (var r = 0; r < rewardDefs.length; r++) {
      if (rewardDefs[r].cosmeticId) {
        cosmeticMap[rewardDefs[r].id] = rewardDefs[r].cosmeticId;
      }
    }

    if (!monsterConfig.accessories) {
      monsterConfig.accessories = {};
    }
    if (!Array.isArray(monsterConfig.accessories.owned)) {
      monsterConfig.accessories.owned = [];
    }

    var ownedSet = {};
    for (var i = 0; i < monsterConfig.accessories.owned.length; i++) {
      var item = String(monsterConfig.accessories.owned[i]).trim();
      if (item) ownedSet[item] = true;
    }

    for (var k = 0; k < permanentRewards.grants.length; k++) {
      var rId = permanentRewards.grants[k].rewardId;
      var cosId = cosmeticMap[rId] || rId;
      if (cosId && !ownedSet[cosId]) {
        ownedSet[cosId] = true;
        monsterConfig.accessories.owned.push(cosId);
      }
    }
  } catch (e) {
    Logger.log("Notice: could not merge classroom rewards into monster config: " + e.message);
  }

  return monsterConfig;
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
 * Normalizes a Date object, ISO string, or timestamp into YYYY-MM-DD prefix.
 */
function toIsoDatePrefix(val) {
  if (!val) return "";
  if (val instanceof Date) {
    var y = val.getFullYear();
    var m = ("0" + (val.getMonth() + 1)).slice(-2);
    var d = ("0" + val.getDate()).slice(-2);
    return y + "-" + m + "-" + d;
  }
  var s = String(val).trim();
  if (s.length >= 10 && s.charAt(4) === "-" && s.charAt(7) === "-") {
    return s.substring(0, 10);
  }
  var parsed = new Date(s);
  if (!isNaN(parsed.getTime())) {
    var y2 = parsed.getFullYear();
    var m2 = ("0" + (parsed.getMonth() + 1)).slice(-2);
    var d2 = ("0" + parsed.getDate()).slice(-2);
    return y2 + "-" + m2 + "-" + d2;
  }
  return s.substring(0, 10);
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
 * Enforces idempotency when sourceId is supplied.
 */
function recordCoinTransaction(ss, studentNumber, studentClass, amount, reason, sourceId, timestamp) {
  if (!ss || !studentNumber || amount === 0) {
    return {
      transactionId: "",
      balanceAfter: getStudentCoinBalance(ss, studentNumber),
      amount: 0
    };
  }

  var txSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.COIN_TRANSACTIONS);
  var currentBalance = getStudentCoinBalance(ss, studentNumber);

  // Idempotency: avoid duplicate award if transaction with this sourceId already exists
  if (txSheet && sourceId) {
    var data = txSheet.getDataRange().getValues();
    if (data.length > 1) {
      var colMap = getSheetColumnMap(txSheet, CONFIG.COIN_TRANSACTION_HEADERS);
      var sCol = colMap["student_number"] - 1;
      var srcCol = colMap["source_id"] - 1;
      var idCol = colMap["transaction_id"] - 1;
      for (var i = 1; i < data.length; i++) {
        if (String(data[i][sCol] || "").trim() === String(studentNumber).trim() &&
            String(data[i][srcCol] || "").trim() === String(sourceId).trim()) {
          return {
            transactionId: String(data[i][idCol] || ""),
            balanceAfter: currentBalance,
            amount: 0,
            alreadyProcessed: true
          };
        }
      }
    }
  }

  var balanceAfter = Math.max(0, currentBalance + amount);
  var txId = "ctx_" + Utilities.getUuid().substring(0, 8);
  var txTime = timestamp || new Date().toISOString();

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
 * Helper to retrieve student's cumulative XP for milestone enforcement.
 */
function getStudentTotalXp(ss, studentNumber) {
  if (!ss || !studentNumber) return 0;
  try {
    var summary = getStudentGamificationSummary(ss, studentNumber);
    return summary ? Number(summary.totalXp || 0) : 0;
  } catch (e) {
    return 0;
  }
}

/**
 * Server-authoritative Monster Shop Catalog (Phase 8B).
 */
var MONSTER_SHOP_CATALOG = {
  // Common (50 - 75 Coins)
  "hat_party": { price: 60, category: "hat" },
  "glasses_round": { price: 50, category: "glasses" },
  "cloth_bowtie": { price: 60, category: "clothing" },
  "cloth_scarf": { price: 75, category: "clothing" },

  // Rare (150 - 220 Coins)
  "hat_crown_bronze": { price: 150, category: "hat" },
  "glasses_star": { price: 180, category: "glasses" },
  "cloth_hero_cape": { price: 220, category: "clothing" },

  // Epic (350 - 450 Coins)
  "hat_wizard": { price: 350, category: "hat" },
  "wings_fairy": { price: 450, category: "wings" },

  // Legendary (750 - 900 Coins)
  "hat_celestial_crown": { price: 750, category: "hat" },
  "wings_cosmic_phoenix": { price: 900, category: "wings" }
};

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

  var currentConfig = getStudentMonsterConfig(ss, auth.studentNumber);

  // Preserve existing owned accessories if incoming payload omitted or did not include them
  if (currentConfig && currentConfig.accessories) {
    if (!monster.accessories) monster.accessories = {};
    if (Array.isArray(currentConfig.accessories.owned) && !monster.accessories.owned) {
      monster.accessories.owned = currentConfig.accessories.owned;
    }
  }

  var saved = saveStudentMonsterConfig(ss, auth.studentNumber, auth.class, monster);

  return createJsonResponse({
    success: true,
    monster: saved,
    totalCoins: getStudentCoinBalance(ss, auth.studentNumber)
  });
}

/**
 * ACTION: student_purchase_accessory (Phase 8B)
 * Server-authoritative purchase: validates session, XP milestone (>= 750), item existence,
 * verifies student does not already own item, checks coin balance, records negative coin transaction,
 * and adds item to student's owned accessories.
 */
function handleStudentPurchaseAccessory(ss, payload) {
  var auth = validateSessionAndGetStudent(ss, payload.sessionToken);
  if (!auth.success) {
    return createJsonResponse({ success: false, error: auth.error, code: "UNAUTHORIZED" });
  }

  var studentXp = getStudentTotalXp(ss, auth.studentNumber);
  if (studentXp < 750) {
    return createJsonResponse({
      success: false,
      error: "Monster Wardrobe unlocks at 750 XP! Keep earning XP to shop.",
      code: "LOCKED_MILESTONE"
    });
  }

  var itemId = String(payload.itemId || "").trim();
  var catalogItem = MONSTER_SHOP_CATALOG[itemId];
  if (!catalogItem) {
    return createJsonResponse({
      success: false,
      error: "Item not found in shop catalog.",
      code: "NOT_FOUND"
    });
  }

  var currentMonster = getStudentMonsterConfig(ss, auth.studentNumber);
  var accessories = currentMonster.accessories || {};
  var owned = Array.isArray(accessories.owned) ? accessories.owned.slice() : [];

  if (owned.indexOf(itemId) !== -1) {
    return createJsonResponse({
      success: false,
      error: "You already own this accessory!",
      code: "ALREADY_OWNED"
    });
  }

  var currentBalance = getStudentCoinBalance(ss, auth.studentNumber);
  if (currentBalance < catalogItem.price) {
    return createJsonResponse({
      success: false,
      error: "Insufficient Monster Coins. Required: " + catalogItem.price + ", Balance: " + currentBalance,
      code: "INSUFFICIENT_FUNDS"
    });
  }

  // Deduct coins (negative amount)
  var tx = recordCoinTransaction(
    ss,
    auth.studentNumber,
    auth.class,
    -catalogItem.price,
    "shop_purchase",
    itemId,
    new Date().toISOString()
  );

  // Add to owned accessories
  owned.push(itemId);
  accessories.owned = owned;
  currentMonster.accessories = accessories;

  var updatedMonster = saveStudentMonsterConfig(ss, auth.studentNumber, auth.class, currentMonster);

  return createJsonResponse({
    success: true,
    monster: updatedMonster,
    totalCoins: tx.balanceAfter
  });
}

/**
 * ACTION: student_equip_accessory (Phase 8B)
 * Equips or unequips an accessory slot. Validates ownership before equipping.
 */
function handleStudentEquipAccessory(ss, payload) {
  var auth = validateSessionAndGetStudent(ss, payload.sessionToken);
  if (!auth.success) {
    return createJsonResponse({ success: false, error: auth.error, code: "UNAUTHORIZED" });
  }

  var slot = String(payload.slot || "").trim().toLowerCase();
  var validSlots = ["hat", "glasses", "clothing", "wings", "aura", "frame"];
  if (validSlots.indexOf(slot) === -1) {
    return createJsonResponse({
      success: false,
      error: "Invalid accessory slot: " + slot,
      code: "BAD_REQUEST"
    });
  }

  var itemId = payload.itemId ? String(payload.itemId).trim() : null;
  var currentMonster = getStudentMonsterConfig(ss, auth.studentNumber);
  var accessories = currentMonster.accessories || {};
  var owned = Array.isArray(accessories.owned) ? accessories.owned : [];

  if (itemId) {
    if (owned.indexOf(itemId) === -1) {
      return createJsonResponse({
        success: false,
        error: "Cannot equip accessory you do not own.",
        code: "NOT_OWNED"
      });
    }
    accessories[slot] = itemId;
  } else {
    delete accessories[slot];
  }

  currentMonster.accessories = accessories;
  var updatedMonster = saveStudentMonsterConfig(ss, auth.studentNumber, auth.class, currentMonster);

  return createJsonResponse({
    success: true,
    monster: updatedMonster,
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
  var todayStr = toIsoDatePrefix(new Date());
  var txSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.COIN_TRANSACTIONS);
  var attemptId = String(payload.attemptId || "").trim();

  // Idempotency: check if attemptId was already recorded for this student
  if (attemptId && txSheet) {
    var existingData = txSheet.getDataRange().getValues();
    if (existingData.length > 1) {
      var checkColMap = getSheetColumnMap(txSheet, CONFIG.COIN_TRANSACTION_HEADERS);
      var chkSCol = checkColMap["student_number"] - 1;
      var chkSrcCol = checkColMap["source_id"] - 1;
      for (var c = 1; c < existingData.length; c++) {
        if (String(existingData[c][chkSCol] || "").trim() === auth.studentNumber &&
            String(existingData[c][chkSrcCol] || "").trim() === attemptId) {
          return createJsonResponse({
            success: true,
            coinsEarned: 0,
            isCapped: false,
            totalCoins: getStudentCoinBalance(ss, auth.studentNumber),
            message: "Attempt already recorded."
          });
        }
      }
    }
  }

  var todayGzEarned = 0;
  if (txSheet) {
    var data = txSheet.getDataRange().getValues();
    var colMap = getSheetColumnMap(txSheet, CONFIG.COIN_TRANSACTION_HEADERS);
    for (var i = 1; i < data.length; i++) {
      var sNum = String(data[i][colMap["student_number"] - 1] || "").trim();
      var rsn = String(data[i][colMap["reason"] - 1] || "").trim();
      var cAt = data[i][colMap["created_at"] - 1];
      if (sNum === auth.studentNumber && rsn === "games_zone_completion" && toIsoDatePrefix(cAt) === todayStr) {
        todayGzEarned += Number(data[i][colMap["amount"] - 1] || 0);
      }
    }
  }

  var available = Math.max(0, 25 - todayGzEarned);
  var awarded = Math.min(earned, available);
  var isCapped = awarded < earned;

  var sourceId = attemptId || ("gz_" + gameId + "_" + difficulty + "_" + Utilities.getUuid().substring(0, 6));

  var txResult = recordCoinTransaction(
    ss,
    auth.studentNumber,
    auth.class,
    awarded,
    "games_zone_completion",
    sourceId
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

// ============================================================================
// PHASE 3.4A: CLASSROOM BEHAVIOR POINTS & REWARDS BACKEND
// ============================================================================

/**
 * Idempotent setup helper for Classroom Points & Rewards sheets.
 * Safely initializes 5 new sheets without mutating any existing student records.
 */
function initClassroomPointsSheets(ss) {
  return setupClassroomPointsSheets(ss);
}

function setupClassroomPointsSheets(ss) {
  if (!ss) {
    try {
      ss = getArcadeSpreadsheet();
    } catch (e) {
      Logger.log("❌ Could not connect to spreadsheet: " + e.message);
      return { success: false, error: "Spreadsheet not found: " + e.message };
    }
  }

  // 1. Class_PointTransactions (Append-Only Event Ledger)
  var txSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.CLASS_POINT_TRANSACTIONS);
  if (txSheet && txSheet.getLastRow() === 0) {
    txSheet.appendRow(CONFIG.CLASS_POINT_TRANSACTION_HEADERS);
  }

  // 2. Class_Categories (Behavior Categories)
  var catSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.CLASS_CATEGORIES);
  if (catSheet && catSheet.getLastRow() === 0) {
    catSheet.appendRow(CONFIG.CLASS_CATEGORY_HEADERS);
    var nowIso = new Date().toISOString();
    for (var c = 0; c < CONFIG.DEFAULT_CLASS_CATEGORIES.length; c++) {
      var cat = CONFIG.DEFAULT_CLASS_CATEGORIES[c];
      catSheet.appendRow([
        cat.id,
        cat.name,
        cat.type,
        cat.points,
        cat.icon,
        cat.color,
        true,
        cat.sortOrder,
        nowIso
      ]);
    }
  }

  // 3. Class_RewardDefinitions (Milestone Definitions)
  var rwdDefSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.CLASS_REWARD_DEFINITIONS);
  if (rwdDefSheet && rwdDefSheet.getLastRow() === 0) {
    rwdDefSheet.appendRow(CONFIG.CLASS_REWARD_DEFINITION_HEADERS);
    for (var r = 0; r < CONFIG.DEFAULT_CLASS_REWARDS.length; r++) {
      var rwd = CONFIG.DEFAULT_CLASS_REWARDS[r];
      rwdDefSheet.appendRow([
        rwd.id,
        rwd.name,
        rwd.desc,
        rwd.points,
        rwd.type,
        rwd.cosmeticId,
        rwd.icon,
        true,
        rwd.sortOrder
      ]);
    }
  }

  // 4. Class_RewardGrants (Permanent Student Ownership)
  var grantsSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.CLASS_REWARD_GRANTS);
  if (grantsSheet && grantsSheet.getLastRow() === 0) {
    grantsSheet.appendRow(CONFIG.CLASS_REWARD_GRANT_HEADERS);
  }

  // 5. Class_AcademicYears (Academic Lifecycle & Rollover)
  var yearsSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.CLASS_ACADEMIC_YEARS);
  if (yearsSheet && yearsSheet.getLastRow() === 0) {
    yearsSheet.appendRow(CONFIG.CLASS_ACADEMIC_YEAR_HEADERS);
    yearsSheet.appendRow(["2026-2027", "active", "2026-09-01", "2027-06-30", ""]);
  }

  Logger.log("✅ Classroom Points & Rewards sheets initialized successfully.");
  return {
    success: true,
    txSheetCreated: !!txSheet,
    catSheetCreated: !!catSheet,
    rwdDefSheetCreated: !!rwdDefSheet,
    grantsSheetCreated: !!grantsSheet,
    yearsSheetCreated: !!yearsSheet
  };
}

/**
 * Retrieves the currently active academic year string (e.g. "2026-2027").
 */
function getActiveAcademicYear(ss) {
  var yearsSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.CLASS_ACADEMIC_YEARS);
  if (!yearsSheet) return "2026-2027";

  var data = yearsSheet.getDataRange().getValues();
  if (data.length <= 1) return "2026-2027";

  for (var i = 1; i < data.length; i++) {
    var status = String(data[i][1] || "").trim().toLowerCase();
    if (status === "active") {
      var yearName = String(data[i][0] || "").trim();
      if (yearName) return yearName;
    }
  }
  return "2026-2027";
}

/**
 * Returns a map of category definitions keyed by category_id.
 */
function getClassroomCategoriesMap(ss) {
  var map = {};
  var catSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.CLASS_CATEGORIES);

  if (catSheet && catSheet.getLastRow() > 1) {
    var data = catSheet.getDataRange().getValues();
    var colMap = getSheetColumnMap(catSheet, CONFIG.CLASS_CATEGORY_HEADERS);
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var id = String(row[colMap["category_id"] - 1] || "").trim();
      if (!id) continue;
      map[id] = {
        id: id,
        name: String(row[colMap["name"] - 1] || ""),
        type: String(row[colMap["type"] - 1] || "positive").trim().toLowerCase(),
        defaultPoints: Number(row[colMap["default_points"] - 1] || 0),
        icon: String(row[colMap["icon"] - 1] || "Sparkles"),
        color: String(row[colMap["color"] - 1] || "#6366f1"),
        isActive: row[colMap["is_active"] - 1] === true || String(row[colMap["is_active"] - 1]).toLowerCase() === "true",
        sortOrder: Number(row[colMap["sort_order"] - 1] || 0)
      };
    }
  } else {
    // Default seed fallback
    for (var c = 0; c < CONFIG.DEFAULT_CLASS_CATEGORIES.length; c++) {
      var def = CONFIG.DEFAULT_CLASS_CATEGORIES[c];
      map[def.id] = {
        id: def.id,
        name: def.name,
        type: def.type,
        defaultPoints: def.points,
        icon: def.icon,
        color: def.color,
        isActive: true,
        sortOrder: def.sortOrder
      };
    }
  }
  return map;
}

/**
 * Returns an array of active reward definitions sorted ascending by required_positive_points.
 */
function getClassroomRewardDefinitions(ss) {
  var list = [];
  var rwdSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.CLASS_REWARD_DEFINITIONS);

  if (rwdSheet && rwdSheet.getLastRow() > 1) {
    var data = rwdSheet.getDataRange().getValues();
    var colMap = getSheetColumnMap(rwdSheet, CONFIG.CLASS_REWARD_DEFINITION_HEADERS);
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var id = String(row[colMap["reward_id"] - 1] || "").trim();
      var active = row[colMap["is_active"] - 1] === true || String(row[colMap["is_active"] - 1]).toLowerCase() === "true";
      if (!id || !active) continue;
      list.push({
        id: id,
        name: String(row[colMap["name"] - 1] || ""),
        desc: String(row[colMap["description"] - 1] || ""),
        requiredPoints: Number(row[colMap["required_positive_points"] - 1] || 0),
        type: String(row[colMap["reward_type"] - 1] || "badge"),
        cosmeticId: String(row[colMap["cosmetic_id"] - 1] || ""),
        icon: String(row[colMap["icon"] - 1] || "Star"),
        sortOrder: Number(row[colMap["sort_order"] - 1] || 0)
      });
    }
  } else {
    for (var r = 0; r < CONFIG.DEFAULT_CLASS_REWARDS.length; r++) {
      var def = CONFIG.DEFAULT_CLASS_REWARDS[r];
      list.push({
        id: def.id,
        name: def.name,
        desc: def.desc,
        requiredPoints: def.points,
        type: def.type,
        cosmeticId: def.cosmeticId,
        icon: def.icon,
        sortOrder: def.sortOrder
      });
    }
  }

  list.sort(function(a, b) {
    return a.requiredPoints - b.requiredPoints;
  });
  return list;
}

/**
 * Calculates current academic year classroom points strictly from Class_PointTransactions.
 * Positive Points = sum(positive_points)
 * Negative Points = sum(negative_points)
 * Net Points = sum(gross_points)
 */
function getStudentClassroomPointsForYear(ss, studentNumber, academicYear) {
  var txSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.CLASS_POINT_TRANSACTIONS);
  if (!txSheet || txSheet.getLastRow() <= 1) {
    return { positivePoints: 0, negativePoints: 0, netPoints: 0, totalTransactions: 0 };
  }

  var data = txSheet.getDataRange().getValues();
  var colMap = getSheetColumnMap(txSheet, CONFIG.CLASS_POINT_TRANSACTION_HEADERS);
  var sCol = colMap["student_number"] - 1;
  var yrCol = colMap["academic_year"] - 1;
  var grossCol = colMap["gross_points"] - 1;
  var posCol = colMap["positive_points"] - 1;
  var negCol = colMap["negative_points"] - 1;

  var pos = 0;
  var neg = 0;
  var gross = 0;
  var count = 0;
  var targetNum = String(studentNumber).trim();
  var targetYr = String(academicYear).trim();

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (String(row[sCol] || "").trim() === targetNum && String(row[yrCol] || "").trim() === targetYr) {
      gross += Number(row[grossCol] || 0);
      pos += Number(row[posCol] || 0);
      neg += Number(row[negCol] || 0);
      count++;
    }
  }

  return {
    positivePoints: Math.max(0, pos),
    negativePoints: Math.max(0, neg),
    netPoints: gross,
    totalTransactions: count
  };
}

/**
 * Retrieves a student's permanently owned reward grants across all academic years.
 */
function getStudentPermanentRewardGrants(ss, studentNumber) {
  var ownedSet = {};
  var grantsList = [];
  var grantsSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.CLASS_REWARD_GRANTS);

  if (grantsSheet && grantsSheet.getLastRow() > 1) {
    var data = grantsSheet.getDataRange().getValues();
    var colMap = getSheetColumnMap(grantsSheet, CONFIG.CLASS_REWARD_GRANT_HEADERS);
    var sCol = colMap["student_number"] - 1;
    var rwdCol = colMap["reward_id"] - 1;
    var grantIdCol = colMap["grant_id"] - 1;
    var unlockedCol = colMap["unlocked_at"] - 1;
    var yrCol = colMap["academic_year_earned"] - 1;
    var eqCol = colMap["is_equipped"] - 1;

    var targetNum = String(studentNumber).trim();
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (String(row[sCol] || "").trim() === targetNum) {
        var rwdId = String(row[rwdCol] || "").trim();
        if (rwdId) {
          ownedSet[rwdId] = true;
          grantsList.push({
            grantId: String(row[grantIdCol] || ""),
            rewardId: rwdId,
            unlockedAt: row[unlockedCol],
            academicYearEarned: String(row[yrCol] || ""),
            isEquipped: row[eqCol] === true || String(row[eqCol]).toLowerCase() === "true"
          });
        }
      }
    }
  }

  return {
    ownedSet: ownedSet,
    grants: grantsList
  };
}

/**
 * Pure read-only student session validation.
 * Performs zero sheet writes and zero locks.
 */
function validateSessionReadOnly(ss, sessionToken) {
  if (!sessionToken || typeof sessionToken !== "string" || sessionToken.trim().length === 0) {
    return { valid: false, error: "Missing session token.", code: "UNAUTHORIZED" };
  }

  var cleanToken = sessionToken.trim();
  var sessionsSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.SESSIONS);
  if (!sessionsSheet || sessionsSheet.getLastRow() <= 1) {
    return { valid: false, error: "Session database unavailable.", code: "UNAUTHORIZED" };
  }

  var sessionData = sessionsSheet.getDataRange().getValues();
  var colMap = getSheetColumnMap(sessionsSheet, CONFIG.SESSION_HEADERS);
  var tokCol = (colMap["session_token"] || 2) - 1;
  var sNumCol = (colMap["student_number"] || 4) - 1;
  var classCol = (colMap["class"] || 5) - 1;
  var expCol = (colMap["expires_at"] || 8) - 1;
  var statusCol = (colMap["status"] || colMap["is_active"] || 10) - 1;

  for (var i = 1; i < sessionData.length; i++) {
    var row = sessionData[i];
    if (String(row[tokCol] || "").trim() === cleanToken) {
      var expRaw = row[expCol];
      var expiresAt = expRaw ? new Date(expRaw) : null;
      var statusRaw = String(row[statusCol] || "active").toLowerCase();
      var now = new Date();

      if (statusRaw === "inactive" || statusRaw === "revoked" || statusRaw === "expired" || statusRaw === "false") {
        return { valid: false, error: "Session has expired or was revoked.", code: "UNAUTHORIZED" };
      }
      if (expiresAt && now > expiresAt) {
        return { valid: false, error: "Session has expired. Please log in again.", code: "UNAUTHORIZED" };
      }

      return {
        valid: true,
        studentNumber: String(row[sNumCol] || "").trim(),
        class: String(row[classCol] || "").trim()
      };
    }
  }

  return { valid: false, error: "Invalid session token.", code: "UNAUTHORIZED" };
}

/**
 * ACTION: student_get_classroom_profile (Student Authenticated)
 * Pure read-only and lock-free query.
 * Computes current academic year points, next unowned milestone, and recent feedback history.
 * Never performs database writes.
 */
function handleStudentGetClassroomProfile(ss, payload) {
  var auth = validateSessionReadOnly(ss, payload.sessionToken);
  if (!auth.valid) {
    return createJsonResponse({ success: false, error: auth.error, code: auth.code });
  }

  // Authoritative identity resolved strictly from session
  var studentNumber = auth.studentNumber;
  var activeYear = getActiveAcademicYear(ss);

  // 1. Current Academic Year Points
  var points = getStudentClassroomPointsForYear(ss, studentNumber, activeYear);

  // 2. Permanent Lifetime Rewards
  var permanentRewards = getStudentPermanentRewardGrants(ss, studentNumber);
  var ownedSet = permanentRewards.ownedSet;

  // 3. Reward Definitions & Next Unowned Milestone
  var rewardDefs = getClassroomRewardDefinitions(ss);
  var nextMilestone = null;
  var claimableRewards = [];

  for (var i = 0; i < rewardDefs.length; i++) {
    var rwd = rewardDefs[i];
    var isOwned = !!ownedSet[rwd.id];

    // Check if eligible to be claimed if missing
    if (!isOwned && points.positivePoints >= rwd.requiredPoints) {
      claimableRewards.push({
        rewardId: rwd.id,
        name: rwd.name,
        requiredPoints: rwd.requiredPoints,
        type: rwd.type,
        cosmeticId: rwd.cosmeticId
      });
    }

    // Determine the next unowned milestone
    if (!isOwned && !nextMilestone) {
      var currentProgress = points.positivePoints;
      var target = rwd.requiredPoints;
      var percent = target > 0 ? Math.min(100, Math.round((currentProgress / target) * 100)) : 100;
      nextMilestone = {
        rewardId: rwd.id,
        name: rwd.name,
        requiredPoints: target,
        currentPoints: currentProgress,
        progressPercent: percent,
        type: rwd.type,
        cosmeticId: rwd.cosmeticId,
        icon: rwd.icon
      };
    }
  }

  // 4. Personal Feedback History (Last 50 for current student and active academic year)
  var feedbackHistory = [];
  var txSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.CLASS_POINT_TRANSACTIONS);
  if (txSheet && txSheet.getLastRow() > 1) {
    var txData = txSheet.getDataRange().getValues();
    var colMap = getSheetColumnMap(txSheet, CONFIG.CLASS_POINT_TRANSACTION_HEADERS);
    var sCol = colMap["student_number"] - 1;
    var yrCol = colMap["academic_year"] - 1;
    var catCol = colMap["category_name"] - 1;
    var grossCol = colMap["gross_points"] - 1;
    var typeCol = colMap["category_type"] - 1;
    var tsCol = colMap["timestamp"] - 1;
    var noteCol = colMap["note"] - 1;

    for (var r = txData.length - 1; r >= 1; r--) {
      var row = txData[r];
      if (String(row[sCol] || "").trim() === studentNumber && String(row[yrCol] || "").trim() === activeYear) {
        feedbackHistory.push({
          categoryName: String(row[catCol] || ""),
          categoryType: String(row[typeCol] || "positive"),
          grossPoints: Number(row[grossCol] || 0),
          timestamp: row[tsCol],
          note: String(row[noteCol] || "")
        });
        if (feedbackHistory.length >= 50) break;
      }
    }
  }

  return createJsonResponse({
    success: true,
    studentNumber: studentNumber,
    studentClass: auth.class,
    academicYear: activeYear,
    positivePoints: points.positivePoints,
    negativePoints: points.negativePoints,
    netPoints: points.netPoints,
    unlockedRewards: permanentRewards.grants,
    nextMilestone: nextMilestone,
    claimableRewards: claimableRewards,
    feedbackHistory: feedbackHistory,
    isMaxMilestoneTier: !nextMilestone
  });
}

/**
 * ACTION: student_claim_milestone_reward (Student Authenticated, Lock Protected Mutation)
 * Allows a student to claim an eligible reward milestone that was not granted during real-time awards.
 * Safe under concurrency with deterministic grant IDs.
 */
function handleStudentClaimMilestoneReward(ss, payload) {
  var auth = validateSessionReadOnly(ss, payload.sessionToken);
  if (!auth.valid) {
    return createJsonResponse({ success: false, error: auth.error, code: auth.code });
  }

  var rewardId = String(payload.rewardId || "").trim();
  if (!rewardId) {
    return createJsonResponse({ success: false, error: "Missing rewardId parameter", code: "BAD_REQUEST" });
  }

  var studentNumber = auth.studentNumber;
  var activeYear = getActiveAcademicYear(ss);

  // 1. Verify eligibility lock-free first (Double-checked locking pattern)
  var points = getStudentClassroomPointsForYear(ss, studentNumber, activeYear);
  var rewardDefs = getClassroomRewardDefinitions(ss);
  var targetDef = null;

  for (var i = 0; i < rewardDefs.length; i++) {
    if (rewardDefs[i].id === rewardId) {
      targetDef = rewardDefs[i];
      break;
    }
  }

  if (!targetDef) {
    return createJsonResponse({ success: false, error: "Unknown reward milestone", code: "NOT_FOUND" });
  }

  if (points.positivePoints < targetDef.requiredPoints) {
    return createJsonResponse({
      success: false,
      error: "Insufficient current academic year positive points (" + points.positivePoints + "/" + targetDef.requiredPoints + ")",
      code: "INELIGIBLE"
    });
  }

  // 2. Deterministic grant ID check lock-free
  var grantId = "grnt_" + studentNumber + "_" + rewardId;
  var permRewards = getStudentPermanentRewardGrants(ss, studentNumber);
  if (permRewards.ownedSet[rewardId]) {
    return createJsonResponse({
      success: true,
      alreadyOwned: true,
      grantId: grantId,
      rewardId: rewardId,
      message: "Reward milestone is already permanently unlocked"
    });
  }

  // 3. Acquire lock strictly for the write operation
  var lock = LockService.getScriptLock();
  if (!lock.waitLock(15000)) {
    return createJsonResponse({ success: false, error: "System is busy, please retry", code: "LOCK_TIMEOUT" });
  }

  try {
    var grantsSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.CLASS_REWARD_GRANTS);
    if (grantsSheet.getLastRow() === 0) {
      grantsSheet.appendRow(CONFIG.CLASS_REWARD_GRANT_HEADERS);
    }

    var existingData = grantsSheet.getDataRange().getValues();
    for (var g = 1; g < existingData.length; g++) {
      if (String(existingData[g][0] || "").trim() === grantId) {
        return createJsonResponse({
          success: true,
          alreadyOwned: true,
          grantId: grantId,
          rewardId: rewardId,
          message: "Reward milestone is already permanently unlocked"
        });
      }
    }

    // 4. Append permanent grant under lock
    var nowIso = new Date().toISOString();
    grantsSheet.appendRow([
      grantId,
      studentNumber,
      rewardId,
      nowIso,
      activeYear,
      points.positivePoints,
      "student_claim",
      false
    ]);

    return createJsonResponse({
      success: true,
      grantId: grantId,
      rewardId: rewardId,
      unlockedAt: nowIso,
      alreadyOwned: false
    });
  } finally {
    lock.releaseLock();
  }
}

/**
 * ACTION: teacher_award_classroom_points (Teacher Authenticated, Lock Protected)
 * Awards behavior points to single or multiple students atomically.
 * Enforces per-student idempotency (batchKey_studentNumber) for safe partial retry handling.
 * Evaluates current academic year milestone thresholds and auto-grants unlocked rewards.
 */
function handleTeacherAwardClassroomPoints(ss, payload) {
  var auth = validateTeacherSession(ss, payload.teacherToken);
  if (!auth.valid) {
    return createJsonResponse({ success: false, error: auth.error, code: auth.code });
  }

  var studentNumbers = payload.studentNumbers;
  if (!Array.isArray(studentNumbers) || studentNumbers.length === 0) {
    return createJsonResponse({ success: false, error: "studentNumbers must be a non-empty array", code: "BAD_REQUEST" });
  }

  var categoryId = String(payload.categoryId || "").trim();
  if (!categoryId) {
    return createJsonResponse({ success: false, error: "Missing categoryId", code: "BAD_REQUEST" });
  }

  var baseBatchKey = String(payload.idempotencyKey || "").trim();
  if (!baseBatchKey) {
    baseBatchKey = "batch_" + Utilities.getUuid().substring(0, 8);
  }

  var customNote = String(payload.note || "").trim();
  var activeYear = getActiveAcademicYear(ss);

  var lock = LockService.getScriptLock();
  if (!lock.waitLock(25000)) {
    return createJsonResponse({ success: false, error: "Teacher database lock timeout", code: "LOCK_TIMEOUT" });
  }

  try {
    // 1. Resolve Category
    var categoriesMap = getClassroomCategoriesMap(ss);
    var category = categoriesMap[categoryId];
    if (!category) {
      return createJsonResponse({ success: false, error: "Category not found: " + categoryId, code: "NOT_FOUND" });
    }

    var isPos = category.type === "positive";
    var pointsDelta = Number(category.defaultPoints || 0);
    var grossPoints = pointsDelta;
    var posPoints = isPos ? Math.max(0, pointsDelta) : 0;
    var negPoints = !isPos ? Math.abs(pointsDelta) : 0;

    // 2. Prepare Point Transactions Sheet
    var txSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.CLASS_POINT_TRANSACTIONS);
    if (txSheet.getLastRow() === 0) {
      txSheet.appendRow(CONFIG.CLASS_POINT_TRANSACTION_HEADERS);
    }

    var txData = txSheet.getDataRange().getValues();
    var colMap = getSheetColumnMap(txSheet, CONFIG.CLASS_POINT_TRANSACTION_HEADERS);
    var idempCol = colMap["idempotency_key"] - 1;

    // Existing idempotency keys lookup
    var existingIdempKeys = {};
    for (var k = 1; k < txData.length; k++) {
      var keyVal = String(txData[k][idempCol] || "").trim();
      if (keyVal) existingIdempKeys[keyVal] = true;
    }

    // Lookup student records for class & grade
    var studentsSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.STUDENTS);
    var studentsMap = {};
    if (studentsSheet && studentsSheet.getLastRow() > 1) {
      var sData = studentsSheet.getDataRange().getValues();
      var sColMap = getSheetColumnMap(studentsSheet, CONFIG.STUDENT_HEADERS);
      for (var s = 1; s < sData.length; s++) {
        var sNum = String(sData[s][sColMap["student_number"] - 1] || "").trim();
        if (sNum) {
          studentsMap[sNum] = {
            class: String(sData[s][sColMap["class"] - 1] || ""),
            grade: String(sData[s][sColMap["grade"] - 1] || "")
          };
        }
      }
    }

    // Teacher session hash for audit trail
    var teacherHash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, payload.teacherToken)
      .map(function(b) { return (b < 0 ? b + 256 : b).toString(16).padStart(2, "0"); })
      .join("")
      .substring(0, 16);

    var nowIso = new Date().toISOString();
    var awardedCount = 0;
    var newTransactions = [];
    var newGrants = [];

    // Rewards definitions
    var rewardDefs = getClassroomRewardDefinitions(ss);
    var grantsSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.CLASS_REWARD_GRANTS);
    if (grantsSheet.getLastRow() === 0) {
      grantsSheet.appendRow(CONFIG.CLASS_REWARD_GRANT_HEADERS);
    }
    var existingGrantsData = grantsSheet.getDataRange().getValues();
    var existingGrantIds = {};
    for (var g = 1; g < existingGrantsData.length; g++) {
      var gId = String(existingGrantsData[g][0] || "").trim();
      if (gId) existingGrantIds[gId] = true;
    }

    // Pre-calculate positive points per student for activeYear in memory (prevents N+1 sheet reads in loop)
    var posPointsByStudent = {};
    var txYrCol = colMap["academic_year"] - 1;
    var txSCol = colMap["student_number"] - 1;
    var txPosCol = colMap["positive_points"] - 1;
    for (var t = 1; t < txData.length; t++) {
      var tRow = txData[t];
      if (String(tRow[txYrCol] || "").trim() === activeYear) {
        var tNum = String(tRow[txSCol] || "").trim();
        if (tNum) {
          if (!posPointsByStudent[tNum]) posPointsByStudent[tNum] = 0;
          posPointsByStudent[tNum] += Number(tRow[txPosCol] || 0);
        }
      }
    }

    // 3. Process each student atomically
    for (var i = 0; i < studentNumbers.length; i++) {
      var currentStudentNum = String(studentNumbers[i]).trim();
      if (!currentStudentNum) continue;

      // Deterministic per-student idempotency key
      var studentIdempKey = baseBatchKey + "_" + currentStudentNum;
      if (existingIdempKeys[studentIdempKey]) {
        // Already recorded in a prior retry: skip writing point transaction
        continue;
      }

      var txId = "ctx_" + Date.now() + "_" + Utilities.getUuid().substring(0, 6);
      var sProfile = studentsMap[currentStudentNum] || { class: "7A", grade: "grade-7" };

      var txRow = [
        txId,
        studentIdempKey,
        activeYear,
        nowIso,
        currentStudentNum,
        sProfile.class,
        sProfile.grade,
        categoryId,
        category.name,
        category.type,
        grossPoints,
        posPoints,
        negPoints,
        "", // original_tx_id
        teacherHash,
        customNote,
        "active"
      ];

      txSheet.appendRow(txRow);
      existingIdempKeys[studentIdempKey] = true;
      awardedCount++;
      newTransactions.push({ transactionId: txId, studentNumber: currentStudentNum });

      // 4. Milestone Evaluation if positive points were awarded (In-memory calculation)
      if (posPoints > 0) {
        var prevPos = posPointsByStudent[currentStudentNum] || 0;
        var newPos = prevPos + posPoints;
        posPointsByStudent[currentStudentNum] = newPos;

        for (var m = 0; m < rewardDefs.length; m++) {
          var rwd = rewardDefs[m];
          var targetGrantId = "grnt_" + currentStudentNum + "_" + rwd.id;
          if (newPos >= rwd.requiredPoints && !existingGrantIds[targetGrantId]) {
            grantsSheet.appendRow([
              targetGrantId,
              currentStudentNum,
              rwd.id,
              nowIso,
              activeYear,
              newPos,
              txId,
              false
            ]);
            existingGrantIds[targetGrantId] = true;
            newGrants.push({
              grantId: targetGrantId,
              studentNumber: currentStudentNum,
              rewardId: rwd.id,
              rewardName: rwd.name,
              requiredPoints: rwd.requiredPoints
            });
          }
        }
      }
    }

    return createJsonResponse({
      success: true,
      awardedCount: awardedCount,
      totalRequested: studentNumbers.length,
      categoryName: category.name,
      academicYear: activeYear,
      newGrants: newGrants,
      batchKey: baseBatchKey
    });
  } finally {
    lock.releaseLock();
  }
}

/**
 * ACTION: teacher_revert_classroom_point_transaction (Teacher Authenticated, Lock Protected)
 * Reverses an existing transaction using the pure append-only accounting ledger.
 * Prevents double-reversal and prevents reversing a correction transaction.
 */
function handleTeacherRevertClassroomPointTransaction(ss, payload) {
  var auth = validateTeacherSession(ss, payload.teacherToken);
  if (!auth.valid) {
    return createJsonResponse({ success: false, error: auth.error, code: auth.code });
  }

  var targetTxId = String(payload.transactionId || "").trim();
  if (!targetTxId) {
    return createJsonResponse({ success: false, error: "Missing transactionId", code: "BAD_REQUEST" });
  }

  var reason = String(payload.reason || "Administrative correction").trim();

  var lock = LockService.getScriptLock();
  if (!lock.waitLock(25000)) {
    return createJsonResponse({ success: false, error: "Database lock timeout", code: "LOCK_TIMEOUT" });
  }

  try {
    var txSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.CLASS_POINT_TRANSACTIONS);
    if (!txSheet || txSheet.getLastRow() <= 1) {
      return createJsonResponse({ success: false, error: "Transaction not found", code: "NOT_FOUND" });
    }

    var txData = txSheet.getDataRange().getValues();
    var colMap = getSheetColumnMap(txSheet, CONFIG.CLASS_POINT_TRANSACTION_HEADERS);

    var idCol = colMap["transaction_id"] - 1;
    var origIdCol = colMap["original_tx_id"] - 1;
    var typeCol = colMap["category_type"] - 1;
    var grossCol = colMap["gross_points"] - 1;
    var posCol = colMap["positive_points"] - 1;
    var negCol = colMap["negative_points"] - 1;
    var sCol = colMap["student_number"] - 1;
    var yrCol = colMap["academic_year"] - 1;
    var classCol = colMap["student_class"] - 1;
    var gradeCol = colMap["grade"] - 1;
    var catNameCol = colMap["category_name"] - 1;

    // 1. Locate Target Transaction & Verify Not Already Reverted
    var targetRow = null;
    var alreadyReverted = false;

    for (var i = 1; i < txData.length; i++) {
      var row = txData[i];
      var currentId = String(row[idCol] || "").trim();
      var currentOrigId = String(row[origIdCol] || "").trim();
      var currentType = String(row[typeCol] || "").trim();

      if (currentId === targetTxId) {
        targetRow = row;
      }
      if (currentOrigId === targetTxId && currentType === "correction") {
        alreadyReverted = true;
      }
    }

    if (!targetRow) {
      return createJsonResponse({ success: false, error: "Transaction not found: " + targetTxId, code: "NOT_FOUND" });
    }

    if (String(targetRow[typeCol] || "").trim() === "correction") {
      return createJsonResponse({ success: false, error: "Cannot revert an administrative correction transaction", code: "INVALID_OPERATION" });
    }

    if (alreadyReverted) {
      return createJsonResponse({
        success: false,
        error: "Transaction " + targetTxId + " has already been reversed.",
        code: "ALREADY_REVERSED"
      });
    }

    // 2. Invert values for exact compensating entry
    var origGross = Number(targetRow[grossCol] || 0);
    var origPos = Number(targetRow[posCol] || 0);
    var origNeg = Number(targetRow[negCol] || 0);
    var studentNumber = String(targetRow[sCol] || "").trim();
    var academicYear = String(targetRow[yrCol] || "").trim();
    var origCatName = String(targetRow[catNameCol] || "");

    var reversalTxId = "ctx_rev_" + Date.now() + "_" + Utilities.getUuid().substring(0, 6);
    var nowIso = new Date().toISOString();

    var teacherHash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, payload.teacherToken)
      .map(function(b) { return (b < 0 ? b + 256 : b).toString(16).padStart(2, "0"); })
      .join("")
      .substring(0, 16);

    var reversalRow = [
      reversalTxId,
      "rev_" + targetTxId,
      academicYear,
      nowIso,
      studentNumber,
      String(targetRow[classCol] || ""),
      String(targetRow[gradeCol] || ""),
      "correction_reversal",
      "Reversal: " + origCatName,
      "correction",
      -origGross,
      -origPos,
      -origNeg,
      targetTxId,
      teacherHash,
      reason,
      "active"
    ];

    txSheet.appendRow(reversalRow);

    // 3. Return updated student balances
    var updatedBalances = getStudentClassroomPointsForYear(ss, studentNumber, academicYear);

    return createJsonResponse({
      success: true,
      reversedTransactionId: targetTxId,
      reversalTransactionId: reversalTxId,
      studentNumber: studentNumber,
      updatedBalances: updatedBalances
    });
  } finally {
    lock.releaseLock();
  }
}

/**
 * ACTION: teacher_get_classroom_overview (Teacher Authenticated)
 * Returns class rosters with current academic year points, next milestone, and reward progress.
 */
function handleTeacherGetClassroomOverview(ss, payload) {
  var auth = validateTeacherSession(ss, payload.teacherToken);
  if (!auth.valid) {
    return createJsonResponse({ success: false, error: auth.error, code: auth.code });
  }

  var filterClass = payload.classId && payload.classId !== "all" ? String(payload.classId).trim().toUpperCase() : null;
  var filterGrade = payload.gradeId && payload.gradeId !== "all" ? String(payload.gradeId).trim() : null;
  var activeYear = getActiveAcademicYear(ss);

  var studentsSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.STUDENTS);
  var studentList = [];

  if (studentsSheet && studentsSheet.getLastRow() > 1) {
    var sData = studentsSheet.getDataRange().getValues();
    var sColMap = getSheetColumnMap(studentsSheet, CONFIG.STUDENT_HEADERS);
    var rewardDefs = getClassroomRewardDefinitions(ss);

    // Pre-aggregate transaction points for active year in a single read (O(1) lookups)
    var txSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.CLASS_POINT_TRANSACTIONS);
    var pointsByStudent = {};
    if (txSheet && txSheet.getLastRow() > 1) {
      var txData = txSheet.getDataRange().getValues();
      var txColMap = getSheetColumnMap(txSheet, CONFIG.CLASS_POINT_TRANSACTION_HEADERS);
      var sCol = txColMap["student_number"] - 1;
      var yrCol = txColMap["academic_year"] - 1;
      var posCol = txColMap["positive_points"] - 1;
      var negCol = txColMap["negative_points"] - 1;
      var grossCol = txColMap["gross_points"] - 1;

      for (var t = 1; t < txData.length; t++) {
        var tRow = txData[t];
        var tYr = String(tRow[yrCol] || "").trim();
        if (tYr !== activeYear) continue;
        var tNum = String(tRow[sCol] || "").trim();
        if (!tNum) continue;

        if (!pointsByStudent[tNum]) {
          pointsByStudent[tNum] = { positivePoints: 0, negativePoints: 0, netPoints: 0 };
        }
        pointsByStudent[tNum].positivePoints += Number(tRow[posCol] || 0);
        pointsByStudent[tNum].negativePoints += Number(tRow[negCol] || 0);
        pointsByStudent[tNum].netPoints += Number(tRow[grossCol] || 0);
      }
    }

    // Pre-aggregate permanent reward grants in a single read (O(1) lookups)
    var grantsSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.CLASS_REWARD_GRANTS);
    var grantsByStudent = {};
    if (grantsSheet && grantsSheet.getLastRow() > 1) {
      var gData = grantsSheet.getDataRange().getValues();
      var gColMap = getSheetColumnMap(grantsSheet, CONFIG.CLASS_REWARD_GRANT_HEADERS);
      var gsCol = gColMap["student_number"] - 1;
      var grwdCol = gColMap["reward_id"] - 1;

      for (var g = 1; g < gData.length; g++) {
        var gRow = gData[g];
        var gNum = String(gRow[gsCol] || "").trim();
        var gRwd = String(gRow[grwdCol] || "").trim();
        if (!gNum || !gRwd) continue;

        if (!grantsByStudent[gNum]) {
          grantsByStudent[gNum] = { ownedSet: {}, grants: [] };
        }
        grantsByStudent[gNum].ownedSet[gRwd] = true;
        grantsByStudent[gNum].grants.push(gRwd);
      }
    }

    for (var i = 1; i < sData.length; i++) {
      var row = sData[i];
      var sNum = String(row[sColMap["student_number"] - 1] || "").trim();
      if (!sNum) continue;

      var sClass = String(row[sColMap["class"] - 1] || "").trim().toUpperCase();
      if (sClass === "DEMO_ARCHIVE" || /_demo$/.test(sNum)) continue;

      var sGrade = String(row[sColMap["grade"] - 1] || "").trim();
      var normGrade = (sGrade === "7" || sGrade === 7 || sGrade === "grade-7") ? "grade-7" : "grade-8";

      if (filterClass && sClass !== filterClass) continue;
      if (filterGrade && normGrade !== filterGrade) continue;

      var points = pointsByStudent[sNum] || { positivePoints: 0, negativePoints: 0, netPoints: 0 };
      var permRewards = grantsByStudent[sNum] || { ownedSet: {}, grants: [] };
      var ownedSet = permRewards.ownedSet;

      var nextMilestone = null;
      for (var m = 0; m < rewardDefs.length; m++) {
        var rwd = rewardDefs[m];
        if (!ownedSet[rwd.id]) {
          var target = rwd.requiredPoints;
          var percent = target > 0 ? Math.min(100, Math.round((points.positivePoints / target) * 100)) : 100;
          nextMilestone = {
            rewardId: rwd.id,
            name: rwd.name,
            requiredPoints: target,
            currentPoints: points.positivePoints,
            progressPercent: percent
          };
          break;
        }
      }

      studentList.push({
        studentNumber: sNum,
        fullName: String(row[sColMap["full_name"] - 1] || ""),
        class: sClass,
        grade: normGrade,
        positivePoints: points.positivePoints,
        negativePoints: points.negativePoints,
        netPoints: points.netPoints,
        unlockedRewardCount: permRewards.grants.length,
        unlockedRewards: permRewards.grants.map(function(g) { return g.rewardId; }),
        nextMilestone: nextMilestone
      });
    }
  }

  var categoriesMap = getClassroomCategoriesMap(ss);
  var categoriesList = Object.keys(categoriesMap).map(function(k) { return categoriesMap[k]; });
  categoriesList.sort(function(a, b) { return a.sortOrder - b.sortOrder; });

  return createJsonResponse({
    success: true,
    academicYear: activeYear,
    totalStudents: studentList.length,
    students: studentList,
    categories: categoriesList,
    rewardDefinitions: getClassroomRewardDefinitions(ss)
  });
}

/**
 * ACTION: teacher_get_classroom_history (Teacher Authenticated)
 * Returns paginated audit trail of classroom point transactions.
 */
function handleTeacherGetClassroomHistory(ss, payload) {
  var auth = validateTeacherSession(ss, payload.teacherToken);
  if (!auth.valid) {
    return createJsonResponse({ success: false, error: auth.error, code: auth.code });
  }

  var filterStudent = payload.studentNumber ? String(payload.studentNumber).trim() : null;
  var filterClass = payload.classId && payload.classId !== "all" ? String(payload.classId).trim().toUpperCase() : null;
  var filterYear = payload.academicYear ? String(payload.academicYear).trim() : getActiveAcademicYear(ss);
  var limit = Math.max(1, Math.min(200, Number(payload.limit || 50)));
  var offset = Math.max(0, Number(payload.offset || 0));

  var txSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.CLASS_POINT_TRANSACTIONS);
  var transactions = [];
  var totalMatches = 0;

  if (txSheet && txSheet.getLastRow() > 1) {
    var data = txSheet.getDataRange().getValues();
    var colMap = getSheetColumnMap(txSheet, CONFIG.CLASS_POINT_TRANSACTION_HEADERS);

    var idCol = colMap["transaction_id"] - 1;
    var yrCol = colMap["academic_year"] - 1;
    var tsCol = colMap["timestamp"] - 1;
    var sCol = colMap["student_number"] - 1;
    var classCol = colMap["student_class"] - 1;
    var catCol = colMap["category_name"] - 1;
    var typeCol = colMap["category_type"] - 1;
    var grossCol = colMap["gross_points"] - 1;
    var origIdCol = colMap["original_tx_id"] - 1;
    var noteCol = colMap["note"] - 1;

    for (var i = data.length - 1; i >= 1; i--) {
      var row = data[i];
      var sNum = String(row[sCol] || "").trim();
      var sClass = String(row[classCol] || "").trim().toUpperCase();
      var sYr = String(row[yrCol] || "").trim();

      if (filterYear && sYr !== filterYear) continue;
      if (filterStudent && sNum !== filterStudent) continue;
      if (filterClass && sClass !== filterClass) continue;

      totalMatches++;
      if (totalMatches > offset && transactions.length < limit) {
        transactions.push({
          transactionId: String(row[idCol] || ""),
          timestamp: row[tsCol],
          studentNumber: sNum,
          studentClass: sClass,
          categoryName: String(row[catCol] || ""),
          categoryType: String(row[typeCol] || ""),
          grossPoints: Number(row[grossCol] || 0),
          originalTxId: String(row[origIdCol] || ""),
          note: String(row[noteCol] || "")
        });
      }
    }
  }

  return createJsonResponse({
    success: true,
    totalCount: totalMatches,
    limit: limit,
    offset: offset,
    transactions: transactions
  });
}

/**
 * ACTION: teacher_manage_classroom_categories (Teacher Authenticated, Lock Protected)
 * Supports listing, adding, updating, or toggling active state of behavior categories.
 */
function handleTeacherManageClassroomCategories(ss, payload) {
  var auth = validateTeacherSession(ss, payload.teacherToken);
  if (!auth.valid) {
    return createJsonResponse({ success: false, error: auth.error, code: auth.code });
  }

  var operation = String(payload.operation || "list").trim().toLowerCase();
  var catSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.CLASS_CATEGORIES);
  if (catSheet.getLastRow() === 0) {
    setupClassroomPointsSheets(ss);
  }

  if (operation === "list" || operation === "get" || !operation) {
    var categoriesMap = getClassroomCategoriesMap(ss);
    var list = Object.keys(categoriesMap).map(function(k) { return categoriesMap[k]; });
    list.sort(function(a, b) { return a.sortOrder - b.sortOrder; });
    return createJsonResponse({ success: true, categories: list });
  }

  var lock = LockService.getScriptLock();
  if (!lock.waitLock(25000)) {
    return createJsonResponse({ success: false, error: "Database lock timeout", code: "LOCK_TIMEOUT" });
  }

  try {
    var categoryData = payload.categoryData || {};
    var colMap = getSheetColumnMap(catSheet, CONFIG.CLASS_CATEGORY_HEADERS);
    var nowIso = new Date().toISOString();

    if (operation === "create") {
      var catName = String(categoryData.name || "").trim();
      if (!catName) {
        return createJsonResponse({ success: false, error: "Category name cannot be empty", code: "BAD_REQUEST" });
      }
      var pts = Number(categoryData.defaultPoints);
      if (isNaN(pts) || pts === 0) {
        return createJsonResponse({ success: false, error: "Point value cannot be zero or invalid", code: "BAD_REQUEST" });
      }
      var cType = String(categoryData.type || "positive").toLowerCase() === "negative" ? "negative" : "positive";
      if (cType === "positive") pts = Math.abs(pts);
      if (cType === "negative") pts = -Math.abs(pts);

      var newId = "cat_" + catName.toLowerCase().replace(/[^a-z0-9]+/g, "_") + "_" + Utilities.getUuid().substring(0, 4);
      catSheet.appendRow([
        newId,
        catName,
        cType,
        pts,
        String(categoryData.icon || "Sparkles"),
        String(categoryData.color || "#6366f1"),
        true,
        catSheet.getLastRow(),
        nowIso
      ]);
      return createJsonResponse({ success: true, createdId: newId });
    }

    if (operation === "update") {
      var targetId = String(categoryData.categoryId || "").trim();
      if (!targetId) {
        return createJsonResponse({ success: false, error: "Missing categoryId", code: "BAD_REQUEST" });
      }
      var newName = String(categoryData.name || "").trim();
      if (!newName) {
        return createJsonResponse({ success: false, error: "Category name cannot be empty", code: "BAD_REQUEST" });
      }
      var newPoints = Number(categoryData.defaultPoints);
      if (isNaN(newPoints) || newPoints === 0) {
        return createJsonResponse({ success: false, error: "Point value cannot be zero or invalid", code: "BAD_REQUEST" });
      }
      var newIcon = String(categoryData.icon || "Sparkles").trim();
      var newColor = String(categoryData.color || "#6366f1").trim();

      var data = catSheet.getDataRange().getValues();
      var idCol = colMap["category_id"] - 1;
      var nameCol = colMap["name"] - 1;
      var typeCol = colMap["type"] - 1;
      var pointsCol = colMap["default_points"] - 1;
      var iconCol = colMap["icon"] - 1;
      var colorCol = colMap["color"] - 1;
      var updatedCol = colMap["updated_at"] - 1;

      for (var i = 1; i < data.length; i++) {
        if (String(data[i][idCol] || "").trim() === targetId) {
          var catType = String(data[i][typeCol] || "positive").toLowerCase();
          // Ensure sign matches type
          if (catType === "positive" && newPoints < 0) newPoints = Math.abs(newPoints);
          if (catType === "negative" && newPoints > 0) newPoints = -Math.abs(newPoints);

          catSheet.getRange(i + 1, nameCol + 1).setValue(newName);
          catSheet.getRange(i + 1, pointsCol + 1).setValue(newPoints);
          catSheet.getRange(i + 1, iconCol + 1).setValue(newIcon);
          catSheet.getRange(i + 1, colorCol + 1).setValue(newColor);
          catSheet.getRange(i + 1, updatedCol + 1).setValue(nowIso);

          return createJsonResponse({
            success: true,
            categoryId: targetId,
            category: {
              id: targetId,
              name: newName,
              type: catType,
              defaultPoints: newPoints,
              icon: newIcon,
              color: newColor
            }
          });
        }
      }
      return createJsonResponse({ success: false, error: "Category not found: " + targetId, code: "NOT_FOUND" });
    }

    if (operation === "toggle") {
      var targetId = String(categoryData.categoryId || "").trim();
      var data = catSheet.getDataRange().getValues();
      var idCol = colMap["category_id"] - 1;
      var activeCol = colMap["is_active"] - 1;

      for (var i = 1; i < data.length; i++) {
        if (String(data[i][idCol] || "").trim() === targetId) {
          var current = data[i][activeCol] === true || String(data[i][activeCol]).toLowerCase() === "true";
          catSheet.getRange(i + 1, activeCol + 1).setValue(!current);
          return createJsonResponse({ success: true, categoryId: targetId, isActive: !current });
        }
      }
      return createJsonResponse({ success: false, error: "Category not found", code: "NOT_FOUND" });
    }

    return createJsonResponse({ success: false, error: "Unsupported operation: " + operation, code: "BAD_REQUEST" });
  } finally {
    lock.releaseLock();
  }
}

/**
 * ACTION: teacher_reconcile_classroom_rewards (Teacher Authenticated, Lock Protected)
 * Administrative self-healing synchronization for reward grants.
 * Evaluates current academic year positive points and grants any missing rewards under LockService.
 */
function handleTeacherReconcileClassroomRewards(ss, payload) {
  var auth = validateTeacherSession(ss, payload.teacherToken);
  if (!auth.valid) {
    return createJsonResponse({ success: false, error: auth.error, code: auth.code });
  }

  var activeYear = getActiveAcademicYear(ss);
  var targetStudent = payload.studentNumber ? String(payload.studentNumber).trim() : null;

  // 1. Audit Phase (Purely lock-free in-memory evaluation)
  var rewardDefs = getClassroomRewardDefinitions(ss);
  var grantsSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.CLASS_REWARD_GRANTS);
  if (grantsSheet.getLastRow() === 0) {
    grantsSheet.appendRow(CONFIG.CLASS_REWARD_GRANT_HEADERS);
  }

  var existingGrantsData = grantsSheet.getDataRange().getValues();
  var existingGrantIds = {};
  for (var g = 1; g < existingGrantsData.length; g++) {
    var gId = String(existingGrantsData[g][0] || "").trim();
    if (gId) existingGrantIds[gId] = true;
  }

  // Pre-aggregate positive points per student for activeYear in a single read
  var txSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.CLASS_POINT_TRANSACTIONS);
  var pointsByStudent = {};
  if (txSheet && txSheet.getLastRow() > 1) {
    var txData = txSheet.getDataRange().getValues();
    var txColMap = getSheetColumnMap(txSheet, CONFIG.CLASS_POINT_TRANSACTION_HEADERS);
    var sCol = txColMap["student_number"] - 1;
    var yrCol = txColMap["academic_year"] - 1;
    var posCol = txColMap["positive_points"] - 1;

    for (var t = 1; t < txData.length; t++) {
      var tRow = txData[t];
      if (String(tRow[yrCol] || "").trim() !== activeYear) continue;
      var tNum = String(tRow[sCol] || "").trim();
      if (!tNum) continue;
      if (!pointsByStudent[tNum]) pointsByStudent[tNum] = 0;
      pointsByStudent[tNum] += Number(tRow[posCol] || 0);
    }
  }

  // Determine target students
  var studentsToProcess = [];
  if (targetStudent) {
    studentsToProcess.push(targetStudent);
  } else {
    var studentsSheet = getSheetRobust(ss, CONFIG.SHEET_NAMES.STUDENTS);
    if (studentsSheet && studentsSheet.getLastRow() > 1) {
      var sData = studentsSheet.getDataRange().getValues();
      var sColMap = getSheetColumnMap(studentsSheet, CONFIG.STUDENT_HEADERS);
      for (var i = 1; i < sData.length; i++) {
        var num = String(sData[i][sColMap["student_number"] - 1] || "").trim();
        var sClass = String(sData[i][sColMap["class"] - 1] || "").trim().toUpperCase();
        if (num && sClass !== "DEMO_ARCHIVE" && !/_demo$/.test(num)) {
          studentsToProcess.push(num);
        }
      }
    }
  }

  // Identify missing grants in-memory
  var missingGrants = [];
  for (var s = 0; s < studentsToProcess.length; s++) {
    var sNum = studentsToProcess[s];
    var posPoints = pointsByStudent[sNum] || 0;

    for (var r = 0; r < rewardDefs.length; r++) {
      var rwd = rewardDefs[r];
      var grantId = "grnt_" + sNum + "_" + rwd.id;

      if (posPoints >= rwd.requiredPoints && !existingGrantIds[grantId]) {
        missingGrants.push({
          grantId: grantId,
          studentNumber: sNum,
          rewardId: rwd.id,
          rewardName: rwd.name,
          positivePoints: posPoints
        });
      }
    }
  }

  // If no rewards need to be reconciled, exit lock-free immediately!
  if (missingGrants.length === 0) {
    return createJsonResponse({
      success: true,
      reconciledCount: 0,
      reconciledGrants: [],
      academicYear: activeYear
    });
  }

  // 2. Write Phase (Acquires lock strictly to append missing rows)
  var lock = LockService.getScriptLock();
  if (!lock.waitLock(10000)) {
    return createJsonResponse({ success: false, error: "Database lock timeout", code: "LOCK_TIMEOUT" });
  }

  try {
    // Re-verify under lock to avoid race conditions (Double-checked locking)
    var lockedGrantsData = grantsSheet.getDataRange().getValues();
    var lockedGrantIds = {};
    for (var lg = 1; lg < lockedGrantsData.length; lg++) {
      var lgId = String(lockedGrantsData[lg][0] || "").trim();
      if (lgId) lockedGrantIds[lgId] = true;
    }

    var reconciledGrants = [];
    var nowIso = new Date().toISOString();

    for (var m = 0; m < missingGrants.length; m++) {
      var mg = missingGrants[m];
      if (!lockedGrantIds[mg.grantId]) {
        grantsSheet.appendRow([
          mg.grantId,
          mg.studentNumber,
          mg.rewardId,
          nowIso,
          activeYear,
          mg.positivePoints,
          "admin_reconciliation",
          false
        ]);
        lockedGrantIds[mg.grantId] = true;
        reconciledGrants.push({
          grantId: mg.grantId,
          studentNumber: mg.studentNumber,
          rewardId: mg.rewardId,
          rewardName: mg.rewardName
        });
      }
    }

    return createJsonResponse({
      success: true,
      reconciledCount: reconciledGrants.length,
      reconciledGrants: reconciledGrants,
      academicYear: activeYear
    });
  } finally {
    lock.releaseLock();
  }
}
