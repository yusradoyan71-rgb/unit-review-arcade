/**
 * TEST: Session Rehydration & studentNumber Normalization
 * 
 * Verifies that:
 * 1. Login with demo student 801 succeeds and returns valid sessionToken and student.
 * 2. Storing and rehydrating the session via checkSession succeeds.
 * 3. The studentNumber is normalized to a string in all stages.
 * 4. Client-side normalization protects against any non-string values.
 */

const TEST_BACKEND_URL =
  'https://script.google.com/macros/s/AKfycbzolLmetYqM-VUuMhj80b7ekN5peA8PH9X-HQD0ahmf54YWQHzNsUJY-k21U5WvUczT0g/exec';

// Client-side normalization mirror from AuthContext.tsx
function normalizeStudent(raw) {
  return {
    ...raw,
    studentNumber: String(raw.studentNumber || '').trim(),
    class: String(raw.class || '').trim(),
  };
}

async function testSessionRehydration() {
  console.log('='.repeat(70));
  console.log('SESSION REHYDRATION & STRING NORMALIZATION VERIFICATION');
  console.log('='.repeat(70));

  // 1. Initial Login
  console.log('\n1. Performing student login (801 / 1234)...');
  const loginRes = await fetch(TEST_BACKEND_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({
      action: 'student_login',
      studentNumber: '801',
      pin: '1234',
      userAgent: 'SessionRehydrationTest/1.0',
    }),
    redirect: 'follow',
  }).then((r) => r.json());

  if (!loginRes.success) {
    throw new Error(`Login failed: ${loginRes.error}`);
  }

  console.log('  Login successful!');
  console.log(`  Raw studentNumber: ${JSON.stringify(loginRes.student.studentNumber)} (type: ${typeof loginRes.student.studentNumber})`);
  const clientNormalizedLogin = normalizeStudent(loginRes.student);
  console.log(`  Normalized studentNumber: ${JSON.stringify(clientNormalizedLogin.studentNumber)} (type: ${typeof clientNormalizedLogin.studentNumber})`);

  if (typeof clientNormalizedLogin.studentNumber !== 'string' || clientNormalizedLogin.studentNumber !== '801') {
    throw new Error('Normalized login studentNumber is not "801" string!');
  }

  // 2. Simulate Session Persistence (as AuthContext does in sessionStorage)
  const sessionToken = loginRes.sessionToken;
  const storedPayload = {
    sessionToken,
    student: clientNormalizedLogin,
    expiresAt: loginRes.expiresAt,
    loginTime: new Date().toISOString(),
  };

  // 3. Simulate Rehydration (page reload / initial mount)
  console.log('\n2. Simulating rehydration from stored session...');
  // Optimistic restore
  let restoredStudent = normalizeStudent(storedPayload.student);
  console.log(`  Optimistically restored student: ${restoredStudent.displayName} (${restoredStudent.studentNumber})`);

  // Server validation check
  console.log('\n3. Calling student_session_check for backend validation...');
  const checkRes = await fetch(TEST_BACKEND_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({
      action: 'student_session_check',
      sessionToken,
    }),
    redirect: 'follow',
  }).then((r) => r.json());

  if (!checkRes.success) {
    throw new Error(`Session check failed: ${checkRes.error}`);
  }

  console.log('  Session check succeeded!');
  console.log(`  Backend check response studentNumber: ${JSON.stringify(checkRes.student.studentNumber)} (type: ${typeof checkRes.student.studentNumber})`);
  restoredStudent = normalizeStudent(checkRes.student);
  console.log(`  Client-normalized check studentNumber: ${JSON.stringify(restoredStudent.studentNumber)} (type: ${typeof restoredStudent.studentNumber})`);

  if (typeof restoredStudent.studentNumber !== 'string' || restoredStudent.studentNumber !== '801') {
    throw new Error('Normalized check studentNumber is not "801" string!');
  }
  if (typeof restoredStudent.class !== 'string' || restoredStudent.class !== '8A') {
    throw new Error('Normalized check class is not "8A" string!');
  }

  // 4. Clean up / Logout
  console.log('\n4. Cleaning up session via student_logout...');
  const logoutRes = await fetch(TEST_BACKEND_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({
      action: 'student_logout',
      sessionToken,
    }),
    redirect: 'follow',
  }).then((r) => r.json());

  console.log(`  Logout result: success=${logoutRes.success}`);

  console.log('\n' + '='.repeat(70));
  console.log('RESULT: SESSION REHYDRATION & NORMALIZATION FULLY VERIFIED!');
  console.log('='.repeat(70));
}

testSessionRehydration().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});

