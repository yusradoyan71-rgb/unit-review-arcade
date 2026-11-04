/**
 * ============================================================================
 * UNIT REVIEW ARCADE — GOOGLE APPS SCRIPT BACKEND (PHASE 1)
 * ============================================================================
 * 
 * Secure backend API for student authentication and tracking data storage.
 * Designed for standalone Google Apps Script projects (script.google.com)
 * as well as container-bound scripts.
 * 
 * Supports 7th & 8th grade English curriculum (Classes: 7A, 7B, 8A, 8B).
 * 
 * KEY ARCHITECTURAL FEATURES:
 * 1. STANDALONE SPREADSHEET SUPPORT:
 *    Connects securely via SpreadsheetApp.openById() using a SPREADSHEET_ID
 *    stored in Script Properties (fallback to getActiveSpreadsheet()).
 * 2. SERVER-SIDE SECRET PEPPER:
 *    Combines a unique per-student salt with a secret pepper stored in Script
 *    Properties. Even with read access to the Sheet, PINs cannot be cracked offline.
 * 3. MULTI-ROUND KEY DERIVATION:
 *    1,000 iterative SHA-256 rounds resist dictionary attacks.
 * 4. BRUTE-FORCE DEFENSE:
 *    5 failed attempts locks an account for 15 minutes.
 * 5. UNGUESSABLE SESSION TOKENS:
 *    64-character tokens with server-side 12-hour expiration enforcement.
 * 6. ZERO PLAINTEXT PIN STORAGE:
 *    Plaintext PINs are never stored in sheets or returned in responses.
 * 
 * Version: 1.1.0 (Phase 1 - Standalone & Pepper Hardened)
 */

// Configuration
var CONFIG = {
  APP_NAME: "Unit Review Arcade API",
  VERSION: "1.1.0",
  SESSION_DURATION_HOURS: 12,
  MAX_FAILED_ATTEMPTS: 5,
  LOCKOUT_MINUTES: 15,
  SALT_ROUNDS: 1000,
  SHEET_NAMES: {
    STUDENTS: "Students",
    SESSIONS: "Sessions",
    ATTEMPTS: "Attempts",
    ANSWERS: "Answers",
    DASHBOARD: "Dashboard"
  }
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
 * Run this function in the Apps Script editor with your spreadsheet ID:
 * 
 *   setSpreadsheetId("1A2B3C4D5E6F7G8H9I0J...");
 */
function setSpreadsheetId(sheetId) {
  if (!sheetId || typeof sheetId !== "string" || sheetId.trim().length === 0) {
    throw new Error("Please provide a valid Google Spreadsheet ID string to setSpreadsheetId(sheetId).");
  }

  var cleanId = sheetId.trim();
  // Validate that the script can open the spreadsheet
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
      return createJsonResponse({ success: false, error: "Empty request body" }, 400);
    }

    var payload;
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return createJsonResponse({ success: false, error: "Malformed JSON payload: " + parseErr.message }, 400);
    }

    var action = payload.action;
    if (!action) {
      return createJsonResponse({ success: false, error: "Missing 'action' parameter" }, 400);
    }

    var ss;
    try {
      ss = getArcadeSpreadsheet();
    } catch (ssErr) {
      return createJsonResponse({ success: false, error: "Database configuration error: " + ssErr.message }, 500);
    }

    // Route Actions
    switch (action) {
      case "student_login":
        return handleStudentLogin(ss, payload);

      case "student_session_check":
        return handleSessionCheck(ss, payload);

      case "student_logout":
        return handleStudentLogout(ss, payload);

      case "ping":
        return createJsonResponse({ success: true, timestamp: new Date().toISOString(), version: CONFIG.VERSION });

      default:
        return createJsonResponse({ success: false, error: "Unknown action: " + action }, 404);
    }
  } catch (err) {
    return createJsonResponse({ success: false, error: "Internal server error: " + err.message }, 500);
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
      var studentSheet = ss.getSheetByName(CONFIG.SHEET_NAMES.STUDENTS);
      if (studentSheet) isConfigured = true;
    }
  } catch (err) {
    errorDetail = err.message;
  }

  return createJsonResponse({
    status: isConfigured ? "ok" : "needs_setup",
    app: CONFIG.APP_NAME,
    version: CONFIG.VERSION,
    configured: isConfigured,
    spreadsheetName: ssName || null,
    message: isConfigured
      ? "Backend is operational. Database connected to '" + ssName + "'."
      : errorDetail
      ? "Database setup required: " + errorDetail
      : "Spreadsheet connected, but sheets are not initialized. Run setupArcadeDatabase() in Apps Script editor."
  });
}

/**
 * Standardized JSON response builder with CORS headers.
 */
function createJsonResponse(data) {
  var output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

// ============================================================================
// AUTHENTICATION LOGIC (SERVER-SIDE)
// ============================================================================

/**
 * Authenticates a student via studentNumber and PIN.
 * Implements salted hash verification, lockout checks, and session generation.
 */
function handleStudentLogin(ss, payload) {
  var studentNumber = String(payload.studentNumber || "").trim();
  var pin = String(payload.pin || "").trim();

  if (!studentNumber || !pin) {
    return createJsonResponse({ success: false, error: "Student number and PIN are required." });
  }

  var studentsSheet = ss.getSheetByName(CONFIG.SHEET_NAMES.STUDENTS);
  if (!studentsSheet) {
    return createJsonResponse({ success: false, error: "Database not initialized. Please run setupArcadeDatabase()." });
  }

  var data = studentsSheet.getDataRange().getValues();
  if (data.length <= 1) {
    return createJsonResponse({ success: false, error: "No student records found in database." });
  }

  // Header mapping (0-indexed columns):
  // 0: student_id, 1: student_number, 2: full_name, 3: grade, 4: class,
  // 5: pin_salt, 6: pin_hash, 7: is_active, 8: failed_attempts, 9: locked_until,
  // 10: created_at, 11: last_login_at
  var rowIndex = -1;
  var studentRow = null;

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][1]).trim() === studentNumber) {
      rowIndex = i + 1; // 1-indexed for Sheets API
      studentRow = data[i];
      break;
    }
  }

  if (!studentRow) {
    return createJsonResponse({ success: false, error: "Invalid student number or PIN." });
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
    return createJsonResponse({ success: false, error: "This student account is currently disabled. Please contact your teacher." });
  }

  // 2. Check brute-force lockout
  var now = new Date();
  if (lockedUntilStr) {
    var lockedUntil = new Date(lockedUntilStr);
    if (now < lockedUntil) {
      var minutesLeft = Math.ceil((lockedUntil.getTime() - now.getTime()) / (60 * 1000));
      return createJsonResponse({
        success: false,
        error: "Too many failed attempts. Account locked. Please wait " + minutesLeft + " minute(s)."
      });
    }
  }

  // 3. Verify PIN against salted + peppered hash
  var computedHash = hashPinWithSaltAndPepper(pin, salt);
  if (computedHash !== storedHash) {
    failedAttempts++;
    var lockDate = null;
    var errorMsg = "Invalid student number or PIN.";

    if (failedAttempts >= CONFIG.MAX_FAILED_ATTEMPTS) {
      lockDate = new Date(now.getTime() + CONFIG.LOCKOUT_MINUTES * 60 * 1000);
      errorMsg = "Account locked for " + CONFIG.LOCKOUT_MINUTES + " minutes due to repeated incorrect PIN attempts.";
    }

    // Update failed attempts and lockout in sheet
    studentsSheet.getRange(rowIndex, 9).setValue(failedAttempts); // failed_attempts
    if (lockDate) {
      studentsSheet.getRange(rowIndex, 10).setValue(lockDate.toISOString()); // locked_until
    }

    return createJsonResponse({ success: false, error: errorMsg });
  }

  // 4. PIN is valid: Reset failed attempts & update last login
  studentsSheet.getRange(rowIndex, 9).setValue(0);
  studentsSheet.getRange(rowIndex, 10).setValue("");
  studentsSheet.getRange(rowIndex, 12).setValue(now.toISOString());

  // 5. Generate secure session token and record session
  var sessionToken = generateSecureToken();
  var sessionId = "sess_" + Utilities.getUuid().substring(0, 8);
  var expiresAt = new Date(now.getTime() + CONFIG.SESSION_DURATION_HOURS * 60 * 60 * 1000);

  var sessionsSheet = ss.getSheetByName(CONFIG.SHEET_NAMES.SESSIONS);
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

  // 6. Return minimal, sanitized student profile (first name + class)
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
    return createJsonResponse({ success: false, error: "Missing session token." });
  }

  var sessionsSheet = ss.getSheetByName(CONFIG.SHEET_NAMES.SESSIONS);
  if (!sessionsSheet) {
    return createJsonResponse({ success: false, error: "Database not initialized." });
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
    return createJsonResponse({ success: false, error: "Invalid session." });
  }

  // Check expiration & status
  var expiresAt = new Date(sessionRow[7]);
  var status = sessionRow[9];
  var now = new Date();

  if (status !== "active" || now > expiresAt) {
    if (status === "active") {
      sessionsSheet.getRange(rowIndex, 10).setValue("expired");
    }
    return createJsonResponse({ success: false, error: "Session has expired. Please log in again." });
  }

  // Update last ping time
  sessionsSheet.getRange(rowIndex, 7).setValue(now.toISOString());

  // Fetch student info
  var studentNumber = sessionRow[3];
  var studentClass = sessionRow[4];

  var studentsSheet = ss.getSheetByName(CONFIG.SHEET_NAMES.STUDENTS);
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
      studentNumber: studentNumber,
      displayName: displayInitials,
      firstName: firstName,
      class: studentClass,
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

  var sessionsSheet = ss.getSheetByName(CONFIG.SHEET_NAMES.SESSIONS);
  if (sessionsSheet) {
    var data = sessionsSheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][1]).trim() === sessionToken) {
        sessionsSheet.getRange(i + 1, 9).setValue(new Date().toISOString()); // logout_time
        sessionsSheet.getRange(i + 1, 10).setValue("logged_out"); // status
        break;
      }
    }
  }

  return createJsonResponse({ success: true, message: "Logged out successfully." });
}

// ============================================================================
// CRYPTOGRAPHY, PEPPER & TOKEN UTILITIES
// ============================================================================

/**
 * Retrieves or auto-initializes the server-side secret Pepper.
 * The pepper is stored in Script Properties and NEVER exists inside the Google Sheet.
 * This guarantees that even if someone gains read access to the Sheet, they cannot
 * brute-force PIN hashes offline.
 */
function getOrCreateSecretPepper() {
  var props = PropertiesService.getScriptProperties();
  var pepper = props.getProperty("PEPPER_SECRET");
  if (!pepper) {
    // Generate a secure 64-character random pepper once
    var seed = Utilities.getUuid() + "-" + Utilities.getUuid() + "-" + new Date().getTime() + "-" + Math.random();
    var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, seed);
    var hex = "";
    for (var i = 0; i < digest.length; i++) {
      var b = (digest[i] + 256) % 256;
      var byteHex = b.toString(16);
      if (byteHex.length === 1) byteHex = "0" + byteHex;
      hex += byteHex;
    }
    pepper = hex;
    props.setProperty("PEPPER_SECRET", pepper);
  }
  return pepper;
}

/**
 * Multi-iteration salted + peppered SHA-256 key derivation.
 * Iteratively feeds the previous digest combined with the salt and secret pepper.
 */
function hashPinWithSaltAndPepper(pin, salt) {
  var pepper = getOrCreateSecretPepper();
  var input = pin + ":" + salt + ":" + pepper;
  var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, input);

  // Iterative rounds
  for (var round = 0; round < CONFIG.SALT_ROUNDS; round++) {
    var combined = digest.concat(Utilities.newBlob(salt + ":" + pepper + ":" + round).getBytes());
    digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, combined);
  }

  // Convert byte array to hexadecimal string
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
 * Generates an unpredictable 64-character session token.
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
 * RUN THIS ONCE in the Apps Script editor to create and style all required sheets
 * in your connected Google Spreadsheet.
 */
function setupArcadeDatabase() {
  var ss = getArcadeSpreadsheet();

  // 1. STUDENTS SHEET
  var studentsSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.STUDENTS);
  var studentHeaders = [
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
  ];
  setupSheetHeaders(studentsSheet, studentHeaders, "#1e293b", "#38bdf8");

  // 2. SESSIONS SHEET
  var sessionsSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.SESSIONS);
  var sessionHeaders = [
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
  ];
  setupSheetHeaders(sessionsSheet, sessionHeaders, "#1e293b", "#a855f7");

  // 3. ATTEMPTS SHEET (Prepared for Phase 2 telemetry)
  var attemptsSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.ATTEMPTS);
  var attemptHeaders = [
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
    "score",
    "total_questions",
    "percentage",
    "started_at",
    "completed_at",
    "duration_seconds",
    "status"
  ];
  setupSheetHeaders(attemptsSheet, attemptHeaders, "#1e293b", "#10b981");

  // 4. ANSWERS SHEET (Prepared for Phase 2 telemetry)
  var answersSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.ANSWERS);
  var answerHeaders = [
    "answer_id",
    "attempt_id",
    "student_id",
    "student_number",
    "class",
    "unit_id",
    "activity_id",
    "question_id",
    "question_prompt",
    "student_response",
    "correct_answer",
    "is_correct",
    "time_spent_seconds",
    "timestamp"
  ];
  setupSheetHeaders(answersSheet, answerHeaders, "#1e293b", "#f59e0b");

  // 5. DASHBOARD SHEET (Summary cards and guide)
  var dashboardSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAMES.DASHBOARD);
  setupDashboardSheet(dashboardSheet);

  Logger.log("✅ Unit Review Arcade Database setup complete on '" + ss.getName() + "'!");
}

/**
 * Creates or retrieves a sheet by name.
 */
function getOrCreateSheet(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

/**
 * Sets up styled headers on a sheet.
 */
function setupSheetHeaders(sheet, headers, bgHex, textHex) {
  var currentHeaders = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0];
  var matches = false;
  if (currentHeaders.length >= headers.length) {
    matches = headers.every(function(h, idx) { return currentHeaders[idx] === h; });
  }

  if (!matches) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }

  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight("bold");
  headerRange.setBackground(bgHex || "#0f172a");
  headerRange.setFontColor(textHex || "#ffffff");
  headerRange.setHorizontalAlignment("center");
  sheet.setFrozenRows(1);
}

/**
 * Sets up Dashboard overview sheet.
 */
function setupDashboardSheet(sheet) {
  sheet.clear();
  sheet.setTabColor("#6366f1");

  var header = [["UNIT REVIEW ARCADE — TEACHER TRACKING DASHBOARD"]];
  sheet.getRange("A1:G1").merge().setValues(header)
    .setFontWeight("bold")
    .setFontSize(14)
    .setBackground("#4338ca")
    .setFontColor("#ffffff")
    .setHorizontalAlignment("center");

  var instructions = [
    ["Class", "Total Students", "Active Sessions Today", "Total Attempts", "Average Score %", "Last Activity"],
    ['="7A"', '=COUNTIF(Students!E:E, "7A")', '=COUNTIFS(Sessions!E:E, "7A", Sessions!J:J, "active")', '=COUNTIF(Attempts!E:E, "7A")', '=IFERROR(AVERAGEIF(Attempts!E:E, "7A", Attempts!N:N), "N/A")', '=MAXIFS(Sessions!F:F, Sessions!E:E, "7A")'],
    ['="7B"', '=COUNTIF(Students!E:E, "7B")', '=COUNTIFS(Sessions!E:E, "7B", Sessions!J:J, "active")', '=COUNTIF(Attempts!E:E, "7B")', '=IFERROR(AVERAGEIF(Attempts!E:E, "7B", Attempts!N:N), "N/A")', '=MAXIFS(Sessions!F:F, Sessions!E:E, "7B")'],
    ['="8A"', '=COUNTIF(Students!E:E, "8A")', '=COUNTIFS(Sessions!E:E, "8A", Sessions!J:J, "active")', '=COUNTIF(Attempts!E:E, "8A")', '=IFERROR(AVERAGEIF(Attempts!E:E, "8A", Attempts!N:N), "N/A")', '=MAXIFS(Sessions!F:F, Sessions!E:E, "8A")'],
    ['="8B"', '=COUNTIF(Students!E:E, "8B")', '=COUNTIFS(Sessions!E:E, "8B", Sessions!J:J, "active")', '=COUNTIF(Attempts!E:E, "8B")', '=IFERROR(AVERAGEIF(Attempts!E:E, "8B", Attempts!N:N), "N/A")', '=MAXIFS(Sessions!F:F, Sessions!E:E, "8B")']
  ];

  sheet.getRange(3, 1, instructions.length, instructions[0].length).setValues(instructions);
  sheet.getRange("A3:F3").setFontWeight("bold").setBackground("#1e293b").setFontColor("#93c5fd");
  sheet.getRange("A4:F7").setHorizontalAlignment("center");
}

// ============================================================================
// STUDENT ENROLLMENT & MANAGEMENT (FOR TEACHER USE)
// ============================================================================

/**
 * Teacher Helper: Securely creates or updates a single student.
 * Plaintext PIN is hashed immediately with salt and server-side secret pepper.
 * Plaintext PIN is NEVER saved in the spreadsheet.
 * 
 * Example:
 *   createStudentAccount("142", "Mehmet Demir", "7", "7A", "5892");
 */
function createStudentAccount(studentNumber, fullName, grade, className, pin) {
  var ss = getArcadeSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAMES.STUDENTS);
  if (!sheet) {
    throw new Error("Please run setupArcadeDatabase() first.");
  }

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

  // Check if student number exists
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][1]).trim() === studentNumber) {
      // Update existing record
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

  // Create new record
  var studentId = "std_" + Utilities.getUuid().substring(0, 8);
  sheet.appendRow([
    studentId,
    studentNumber,
    fullName,
    grade,
    className,
    salt,
    hash,
    true, // is_active
    0,    // failed_attempts
    "",   // locked_until
    now,  // created_at
    ""    // last_login_at
  ]);

  Logger.log("✅ Created student: " + studentNumber + " (" + fullName + " - " + className + ")");
}

/**
 * Teacher Helper: Batch import student roster.
 * Pass an array of objects: [{ num, name, grade, class, pin }, ...]
 */
function importStudentsRoster(studentsArray) {
  if (!Array.isArray(studentsArray) || studentsArray.length === 0) {
    throw new Error("Please pass a non-empty array of student objects.");
  }

  studentsArray.forEach(function(s) {
    createStudentAccount(s.num, s.name, s.grade, s.class, s.pin);
  });

  Logger.log("🎉 Successfully imported " + studentsArray.length + " students!");
}

/**
 * Teacher Helper: Populates 8 sample demo accounts across 7A, 7B, 8A, 8B for testing.
 */
function createDemoStudentAccounts() {
  var demoStudents = [
    // Class 7A (Grade 7)
    { num: "701", name: "Kerem Yılmaz", grade: "7", class: "7A", pin: "1234" },
    { num: "702", name: "Zeynep Kaya", grade: "7", class: "7A", pin: "4321" },

    // Class 7B (Grade 7)
    { num: "703", name: "Can Demir", grade: "7", class: "7B", pin: "1111" },
    { num: "704", name: "Elif Şahin", grade: "7", class: "7B", pin: "2222" },

    // Class 8A (Grade 8)
    { num: "801", name: "Barış Arslan", grade: "8", class: "8A", pin: "1234" },
    { num: "802", name: "Ayşe Çelik", grade: "8", class: "8A", pin: "4321" },

    // Class 8B (Grade 8)
    { num: "803", name: "Murat Yıldız", grade: "8", class: "8B", pin: "1111" },
    { num: "804", name: "Selin Aydın", grade: "8", class: "8B", pin: "2222" }
  ];

  importStudentsRoster(demoStudents);
  Logger.log("🎉 8 Demo students successfully created across 7A, 7B, 8A, 8B.");
}

/**
 * Production Preparation: Disables or removes demo test accounts.
 * Run this before starting live school production.
 */
function removeDemoAccounts() {
  var demoNumbers = ["701", "702", "703", "704", "801", "802", "803", "804"];
  var ss = getArcadeSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAMES.STUDENTS);
  if (!sheet) return;

  var data = sheet.getDataRange().getValues();
  var removed = 0;

  for (var i = data.length - 1; i >= 1; i--) {
    var num = String(data[i][1]).trim();
    if (demoNumbers.indexOf(num) !== -1) {
      sheet.deleteRow(i + 1);
      removed++;
    }
  }

  Logger.log("🧹 Removed " + removed + " demo student accounts from database.");
}

/**
 * Maintenance Helper: Marks expired sessions as 'expired' to keep database tidy.
 */
function cleanupExpiredSessions() {
  var ss = getArcadeSpreadsheet();
  var sessionsSheet = ss.getSheetByName(CONFIG.SHEET_NAMES.SESSIONS);
  if (!sessionsSheet) return;

  var data = sessionsSheet.getDataRange().getValues();
  var now = new Date();
  var count = 0;

  for (var i = 1; i < data.length; i++) {
    if (data[i][9] === "active") {
      var expiresAt = new Date(data[i][7]);
      if (now > expiresAt) {
        sessionsSheet.getRange(i + 1, 10).setValue("expired");
        count++;
      }
    }
  }

  Logger.log("🧹 Marked " + count + " expired sessions.");
}
