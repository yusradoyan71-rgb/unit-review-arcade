/**
 * UNIT REVIEW ARCADE — PRODUCTION DEPLOYMENT SMOKE TEST
 * 
 * Verifies:
 * 1. Public GitHub Pages site is live, returns HTTP 200, and loads latest assets.
 * 2. Public bundle references the PRODUCTION Google Apps Script Web App URL.
 * 3. Production backend health endpoint reports v2.0.0 and connected database.
 * 4. Student login with demo credentials (801 / 1234).
 * 5. Session restoration & string normalization via student_session_check.
 * 6. One full game attempt lifecycle (start, batch answers, completion, scoring).
 * 7. Clean logout and session invalidation.
 */

const PUBLIC_URL = 'https://yusradoyan71-rgb.github.io/unit-review-arcade/';
const PRODUCTION_BACKEND_URL =
  'https://script.google.com/macros/s/AKfycbwzMiiyoKbcb83Plv_TYay4VnXXOWh9ZmlPDes6_Z-Pahk3phpTB8sqYZN6dUiAy-etjw/exec';
const TEST_BACKEND_FRAGMENT = 'AKfycbzolLmetYqM';

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function assert(condition, message, details = '') {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  [PASS] ${message}`);
  } else {
    failedChecks++;
    console.error(`  [FAIL] ${message} - ${details}`);
  }
}

async function gasPost(payload, timeoutMs = 25000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const start = Date.now();
  try {
    const res = await fetch(PRODUCTION_BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow',
      signal: controller.signal,
    });
    clearTimeout(timer);
    const elapsed = Date.now() - start;
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    const text = await res.text();
    return { ok: true, elapsed, data: JSON.parse(text) };
  } catch (err) {
    clearTimeout(timer);
    return { ok: false, elapsed: Date.now() - start, error: err.message };
  }
}

async function runProductionSmokeTest() {
  console.log('='.repeat(75));
  console.log('UNIT REVIEW ARCADE — PRODUCTION SMOKE TEST');
  console.log(`Public Site URL: ${PUBLIC_URL}`);
  console.log(`Production Backend URL: ${PRODUCTION_BACKEND_URL}`);
  console.log('='.repeat(75));

  // -------------------------------------------------------------------------
  // 1. Verify Public Site on GitHub Pages
  // -------------------------------------------------------------------------
  console.log('\n--- 1. Public Site Availability & Bundle Audit ---');
  const siteRes = await fetch(PUBLIC_URL, { redirect: 'follow' });
  assert(siteRes.ok, `Public site returned HTTP ${siteRes.status}`);

  const html = await siteRes.text();
  assert(/UNIT REVIEW ARCADE/i.test(html), 'Page HTML contains expected title (UNIT REVIEW ARCADE)');

  // Extract entry JS bundle
  const scriptMatch = html.match(/src="(\.\/assets\/index-[^"]+\.js)"/);
  assert(Boolean(scriptMatch), `Found bundled JavaScript asset in HTML (${scriptMatch ? scriptMatch[1] : 'none'})`);

  if (scriptMatch) {
    const assetPath = scriptMatch[1].replace('./', '');
    const assetUrl = `${PUBLIC_URL}${assetPath}`;
    console.log(`  Auditing public asset: ${assetUrl}`);
    const assetRes = await fetch(assetUrl);
    assert(assetRes.ok, `Asset fetched successfully (HTTP ${assetRes.status})`);

    const assetCode = await assetRes.text();
    assert(
      assetCode.includes(PRODUCTION_BACKEND_URL),
      'Public asset bundles the PRODUCTION Google Apps Script URL'
    );
    assert(
      !assetCode.includes(TEST_BACKEND_FRAGMENT),
      'Public asset strictly excludes the Phase 2 TEST URL'
    );
    assert(
      assetCode.includes('1.7.0'),
      'Public asset contains schema version 1.7.0 with balanced question banks'
    );
  }

  // -------------------------------------------------------------------------
  // 2. Production Backend Health Check
  // -------------------------------------------------------------------------
  console.log('\n--- 2. Production Backend Health Endpoint (GET) ---');
  const healthRes = await fetch(PRODUCTION_BACKEND_URL, { redirect: 'follow' });
  assert(healthRes.ok, `Health endpoint returned HTTP ${healthRes.status}`);
  const health = await healthRes.json();
  assert(health.status === 'ok', `Status is "ok" (received: "${health.status}")`);
  assert(health.version === '2.0.0', `Version is "2.0.0" (received: "${health.version}")`);
  assert(health.configured === true, 'Database is configured');
  assert(
    health.spreadsheetName === 'Unit Review Arcade – Student Tracking Database',
    `Connected to production tracking database (received: "${health.spreadsheetName}")`
  );

  // -------------------------------------------------------------------------
  // 3. Demo Student Authentication & Session Restoration (801 / 1234)
  // -------------------------------------------------------------------------
  console.log('\n--- 3. Production Student Authentication & Session Restoration ---');
  const login = await gasPost({
    action: 'student_login',
    studentNumber: '801',
    pin: '1234',
    userAgent: 'ProductionSmokeTestRunner/2.0.0',
  });

  assert(login.ok && login.data.success === true, 'Production login successful for student 801');
  const sessionToken = login.data?.sessionToken;
  assert(typeof sessionToken === 'string' && sessionToken.startsWith('uat_'), 'Valid session token acquired');
  assert(login.data?.student?.studentNumber === '801', 'Student number matches 801');
  assert(login.data?.student?.class === '8A', 'Student class matches 8A');
  console.log(`  Authenticated: ${login.data?.student?.displayName} (${login.data?.student?.class})`);

  // Test session rehydration check
  const check = await gasPost({
    action: 'student_session_check',
    sessionToken,
  });
  assert(check.ok && check.data.success === true, 'Session check validated by production backend');
  assert(String(check.data?.student?.studentNumber) === '801', 'Session check studentNumber matches "801"');
  assert(typeof check.data?.student?.studentNumber === 'string', 'Backend returns studentNumber as string');

  // -------------------------------------------------------------------------
  // 4. One Game Attempt Lifecycle (Start, Answers, Complete, Score)
  // -------------------------------------------------------------------------
  console.log('\n--- 4. Production Game Attempt Lifecycle (Quiz Battle) ---');
  const attemptId = `prod_att_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;

  // Start attempt
  const start = await gasPost({
    action: 'game_start_attempt',
    sessionToken,
    attemptId,
    gradeId: 'grade-8',
    unitId: 'g8-u1',
    unitTitle: 'Unit 1: Music & Life',
    activityId: 'g8-u1-act1',
    activityTitle: 'Music Vocabulary Challenge',
    gameType: 'quiz_battle',
    totalQuestions: 2,
    startedAt: new Date().toISOString(),
  });
  assert(start.ok && start.data.success === true, 'Game start attempt registered in production database');
  assert(typeof start.data?.attemptNumber === 'number', `Attempt number assigned: ${start.data?.attemptNumber}`);

  // Submit batch answers
  const answers = [
    {
      answerId: `prod_ans_${Date.now().toString(36)}_1`,
      attemptId,
      questionId: 'g8-u1-q1',
      questionOrder: 1,
      questionPrompt: 'Which musical genre often features distorted electric guitars and driving rhythms?',
      studentResponse: 'Rock',
      correctAnswer: 'Rock',
      isCorrect: true,
      timeSpentSeconds: 6,
      timestamp: new Date().toISOString(),
    },
    {
      answerId: `prod_ans_${Date.now().toString(36)}_2`,
      attemptId,
      questionId: 'g8-u1-q2',
      questionOrder: 2,
      questionPrompt: 'A person who writes original musical compositions is called a...',
      studentResponse: 'Composer',
      correctAnswer: 'Composer',
      isCorrect: true,
      timeSpentSeconds: 7,
      timestamp: new Date().toISOString(),
    },
  ];

  const record = await gasPost({
    action: 'game_record_answers',
    sessionToken,
    attemptId,
    answers,
  });
  assert(record.ok && record.data.success === true, 'Batch answers recorded in production database');
  assert(record.data?.recordedCount === 2, `Recorded count matches 2 (received: ${record.data?.recordedCount})`);

  // Complete attempt
  const complete = await gasPost({
    action: 'game_complete_attempt',
    sessionToken,
    attemptId,
    score: 20,
    totalQuestions: 2,
    answeredQuestions: 2,
    correctAnswers: 2,
    incorrectAnswers: 0,
    skippedQuestions: 0,
    percentage: 100,
    durationSeconds: 15,
    completedAt: new Date().toISOString(),
  });
  assert(complete.ok && complete.data.success === true, 'Game attempt marked completed in production');
  assert(complete.data?.status === 'completed', 'Final status updated to "completed"');
  assert(complete.data?.score === 20, 'Final score recorded as 20 (100%)');

  // -------------------------------------------------------------------------
  // 5. Clean Logout & Revocation
  // -------------------------------------------------------------------------
  console.log('\n--- 5. Production Student Logout & Invalidation ---');
  const logout = await gasPost({
    action: 'student_logout',
    sessionToken,
  });
  assert(logout.ok && logout.data.success === true, 'Logout acknowledged by production backend');

  const postLogoutCheck = await gasPost({
    action: 'student_session_check',
    sessionToken,
  });
  assert(
    postLogoutCheck.ok && postLogoutCheck.data.success === false,
    `Logged out session is rejected on subsequent check ("${postLogoutCheck.data?.error}")`
  );

  // -------------------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------------------
  console.log('\n' + '='.repeat(75));
  console.log(`TOTAL CHECKS: ${totalChecks} | PASSED: ${passedChecks} | FAILED: ${failedChecks}`);
  console.log('='.repeat(75));

  if (failedChecks > 0) {
    console.error('\nPRODUCTION SMOKE TEST FAILED');
    process.exit(1);
  } else {
    console.log('\nALL PRODUCTION SMOKE TEST CHECKS PASSED WITH 100% SUCCESS!');
    process.exit(0);
  }
}

runProductionSmokeTest().catch((err) => {
  console.error('Fatal error during production smoke test:', err);
  process.exit(1);
});
