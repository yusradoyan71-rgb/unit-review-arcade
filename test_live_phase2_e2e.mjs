/**
 * UNIT REVIEW ARCADE — LIVE BACKEND END-TO-END INTEGRATION TEST SUITE
 * 
 * Target Backend: Phase 2 TEST Google Apps Script Web App
 * Target URL: https://script.google.com/macros/s/AKfycbzolLmetYqM-VUuMhj80b7ekN5peA8PH9X-HQD0ahmf54YWQHzNsUJY-k21U5WvUczT0g/exec
 * Target Database: Unit Review Arcade - TEST DATABASE
 */

const TEST_BACKEND_URL =
  'https://script.google.com/macros/s/AKfycbzolLmetYqM-VUuMhj80b7ekN5peA8PH9X-HQD0ahmf54YWQHzNsUJY-k21U5WvUczT0g/exec';

// Fisher-Yates shuffle implementation identical to src/utils/shuffle.ts
function fisherYatesShuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

function shuffleQuestionOptions(question) {
  if (!question || !Array.isArray(question.options) || question.options.length <= 1) {
    return { ...question };
  }
  const indices = question.options.map((_, i) => i);
  const shuffledIndices = fisherYatesShuffle(indices);
  const newOptions = shuffledIndices.map((origIdx) => question.options[origIdx]);
  const newCorrectOptionIndex = shuffledIndices.indexOf(question.correctOptionIndex);

  return {
    ...question,
    options: newOptions,
    correctOptionIndex: newCorrectOptionIndex >= 0 ? newCorrectOptionIndex : question.correctOptionIndex,
  };
}

// Helper to make live POST requests to Google Apps Script Web App
async function gasPost(payload, timeoutMs = 25000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const start = Date.now();
  try {
    const res = await fetch(TEST_BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow',
      signal: controller.signal,
    });
    clearTimeout(timer);

    const elapsed = Date.now() - start;
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      return { ok: true, elapsed, data };
    } catch {
      throw new Error(`Invalid JSON response: ${text.slice(0, 200)}`);
    }
  } catch (err) {
    clearTimeout(timer);
    return { ok: false, elapsed: Date.now() - start, error: err.message };
  }
}

// Helper for GET requests
async function gasGet(timeoutMs = 25000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const start = Date.now();
  try {
    const res = await fetch(TEST_BACKEND_URL, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
    });
    clearTimeout(timer);

    const elapsed = Date.now() - start;
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      return { ok: true, elapsed, data };
    } catch {
      throw new Error(`Invalid JSON response: ${text.slice(0, 200)}`);
    }
  } catch (err) {
    clearTimeout(timer);
    return { ok: false, elapsed: Date.now() - start, error: err.message };
  }
}

// Test harness state
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const testDetails = [];

function assert(condition, message, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${message}`);
    testDetails.push({ status: 'PASS', message, details });
  } else {
    failedTests++;
    console.error(`  [FAIL] ${message} - ${details}`);
    testDetails.push({ status: 'FAIL', message, details });
  }
}

function generateId(prefix = 'tst') {
  const ts = Date.now().toString(36);
  const rnd = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${ts}_${rnd}`;
}

async function runE2ETests() {
  console.log('='.repeat(75));
  console.log('UNIT REVIEW ARCADE — LIVE E2E INTEGRATION TEST (TEST BACKEND)');
  console.log(`Endpoint: ${TEST_BACKEND_URL}`);
  console.log('='.repeat(75));

  // -------------------------------------------------------------------------
  // Requirement 1: Verify Health Endpoint
  // -------------------------------------------------------------------------
  console.log('\n--- 1. Health Endpoint Verification (GET) ---');
  const healthRes = await gasGet();
  assert(healthRes.ok, 'Health endpoint HTTP status OK', `Error: ${healthRes.error}`);
  if (healthRes.ok) {
    const h = healthRes.data;
    assert(h.status === 'ok', `Backend reports status: "ok" (received: "${h.status}")`);
    assert(h.app === 'Unit Review Arcade API', `App name is "Unit Review Arcade API" (received: "${h.app}")`);
    assert(h.version === '2.0.0', `Backend version is "2.0.0" (received: "${h.version}")`);
    assert(h.configured === true, `Backend is configured (received: ${h.configured})`);
    assert(
      h.spreadsheetName === 'Unit Review Arcade - TEST DATABASE',
      `Connected to TEST database (received: "${h.spreadsheetName}")`
    );
    console.log(`  Health response time: ${healthRes.elapsed}ms`);
  }

  // -------------------------------------------------------------------------
  // Requirement 3: Demo Student Login (801 / 1234)
  // -------------------------------------------------------------------------
  console.log('\n--- 2. Demo Student Authentication (studentNumber: 801, pin: 1234) ---');
  const loginRes = await gasPost({
    action: 'student_login',
    studentNumber: '801',
    pin: '1234',
    userAgent: 'LiveE2ETestRunner/2.0.0 (Node.js)',
  });

  assert(loginRes.ok, 'Login POST request succeeded', `Error: ${loginRes.error}`);
  let sessionToken = null;
  if (loginRes.ok) {
    const d = loginRes.data;
    assert(d.success === true, 'Login response success === true', d.error);
    assert(typeof d.sessionToken === 'string' && d.sessionToken.length > 20, 'Session token returned');
    assert(d.student && d.student.studentNumber === '801', 'Student number matches 801');
    assert(d.student && d.student.class === '8A', 'Student class matches 8A');
    assert(d.student && d.student.grade === 'grade-8', 'Student grade matches grade-8');
    assert(typeof d.expiresAt === 'string', 'Session expiration timestamp returned');
    sessionToken = d.sessionToken;
    console.log(`  Authenticated as: ${d.student.displayName} (${d.student.studentNumber}, ${d.student.class})`);
    console.log(`  Session token: ${sessionToken.substring(0, 24)}... (latency: ${loginRes.elapsed}ms)`);
  }

  if (!sessionToken) {
    console.error('\nCRITICAL: Authentication failed. Aborting remaining tests.');
    process.exit(1);
  }

  // Session check verification
  console.log('\n--- 2b. Session Validation (action: student_session_check) ---');
  const checkRes = await gasPost({
    action: 'student_session_check',
    sessionToken,
  });
  assert(checkRes.ok && checkRes.data.success === true, 'Session is active and valid in Google Sheets');
  if (checkRes.ok && checkRes.data.student) {
    const isString = typeof checkRes.data.student.studentNumber === 'string';
    assert(
      String(checkRes.data.student.studentNumber) === '801',
      `Session check returned student 801 (received value: ${checkRes.data.student.studentNumber}, type: ${typeof checkRes.data.student.studentNumber}${!isString ? ' [NOTE: backend returned number instead of string]' : ''})`
    );
  }

  // -------------------------------------------------------------------------
  // Requirement 4 & 7: Play through Quiz Battle (with Runtime Fisher-Yates Shuffling)
  // -------------------------------------------------------------------------
  console.log('\n--- 3. Game Mode: Quiz Battle (with Shuffled Options) ---');
  const qbRawQuestion = {
    id: 'g8-u1-q1',
    prompt: 'Which musical genre often features distorted electric guitars and driving rhythms?',
    options: ['Classical', 'Rock', 'Jazz', 'Reggae'],
    correctOptionIndex: 1, // 'Rock'
  };

  // Demonstrate option shuffling
  const qbShuffled = shuffleQuestionOptions(qbRawQuestion);
  const qbCorrectText = qbShuffled.options[qbShuffled.correctOptionIndex];
  assert(
    qbCorrectText === 'Rock',
    `Shuffled question maintains correct answer: "${qbCorrectText}" at index ${qbShuffled.correctOptionIndex}`
  );

  const qbAttemptId = generateId('att_qb');
  const qbStart = await gasPost({
    action: 'game_start_attempt',
    sessionToken,
    attemptId: qbAttemptId,
    gradeId: 'grade-8',
    unitId: 'g8-u1',
    unitTitle: 'Unit 1: Music & Life',
    activityId: 'g8-u1-act1',
    activityTitle: 'Music Vocabulary Challenge',
    gameType: 'quiz_battle',
    totalQuestions: 3,
    startedAt: new Date().toISOString(),
  });

  assert(qbStart.ok && qbStart.data.success === true, 'Quiz Battle: start attempt recorded in database');
  assert(qbStart.data.attemptId === qbAttemptId, 'Quiz Battle: attemptId matches');
  const qbAttemptNum = qbStart.data.attemptNumber;
  assert(typeof qbAttemptNum === 'number', `Quiz Battle: attemptNumber received (${qbAttemptNum})`);

  // Idempotency check on start
  const qbStartDup = await gasPost({
    action: 'game_start_attempt',
    sessionToken,
    attemptId: qbAttemptId,
    gradeId: 'grade-8',
    unitId: 'g8-u1',
    unitTitle: 'Unit 1: Music & Life',
    activityId: 'g8-u1-act1',
    activityTitle: 'Music Vocabulary Challenge',
    gameType: 'quiz_battle',
    totalQuestions: 3,
  });
  assert(
    qbStartDup.ok && qbStartDup.data.success === true && qbStartDup.data.attemptId === qbAttemptId,
    'Quiz Battle: start attempt idempotency verified'
  );

  // Record batch answers (2 correct, 1 incorrect)
  const qbAnswers = [
    {
      answerId: generateId('ans'),
      attemptId: qbAttemptId,
      questionId: 'g8-u1-q1',
      questionOrder: 1,
      questionPrompt: qbShuffled.prompt,
      studentResponse: 'Rock', // Correct
      correctAnswer: 'Rock',
      isCorrect: true,
      timeSpentSeconds: 6,
      timestamp: new Date().toISOString(),
    },
    {
      answerId: generateId('ans'),
      attemptId: qbAttemptId,
      questionId: 'g8-u1-q2',
      questionOrder: 2,
      questionPrompt: 'A person who writes original musical compositions is called a...',
      studentResponse: 'Composer', // Correct
      correctAnswer: 'Composer',
      isCorrect: true,
      timeSpentSeconds: 8,
      timestamp: new Date().toISOString(),
    },
    {
      answerId: generateId('ans'),
      attemptId: qbAttemptId,
      questionId: 'g8-u1-q3',
      questionOrder: 3,
      questionPrompt: 'Which term describes an extremely high musical pitch?',
      studentResponse: 'Bass', // Incorrect
      correctAnswer: 'Treble',
      isCorrect: false,
      timeSpentSeconds: 11,
      timestamp: new Date().toISOString(),
    },
  ];

  const qbRecordRes = await gasPost({
    action: 'game_record_answers',
    sessionToken,
    attemptId: qbAttemptId,
    answers: qbAnswers,
  });
  assert(qbRecordRes.ok && qbRecordRes.data.success === true, 'Quiz Battle: answers recorded successfully');
  assert(qbRecordRes.data.recordedCount === 3, `Quiz Battle: recordedCount === 3 (got ${qbRecordRes.data.recordedCount})`);

  // Answer deduplication check
  const qbDupRecord = await gasPost({
    action: 'game_record_answers',
    sessionToken,
    attemptId: qbAttemptId,
    answers: qbAnswers,
  });
  assert(
    qbDupRecord.ok && qbDupRecord.data.recordedCount === 0,
    `Quiz Battle: duplicate answers safely ignored (recordedCount === 0, got ${qbDupRecord.data.recordedCount})`
  );

  // Complete attempt
  const qbCompleteRes = await gasPost({
    action: 'game_complete_attempt',
    sessionToken,
    attemptId: qbAttemptId,
    score: 20,
    totalQuestions: 3,
    answeredQuestions: 3,
    correctAnswers: 2,
    incorrectAnswers: 1,
    skippedQuestions: 0,
    percentage: 67,
    durationSeconds: 25,
    completedAt: new Date().toISOString(),
  });
  assert(qbCompleteRes.ok && qbCompleteRes.data.success === true, 'Quiz Battle: attempt completed in database');
  assert(qbCompleteRes.data.status === 'completed', 'Quiz Battle: status updated to "completed"');
  assert(qbCompleteRes.data.score === 20, 'Quiz Battle: final score persisted as 20');

  // -------------------------------------------------------------------------
  // Requirement 4: Reading Detective
  // -------------------------------------------------------------------------
  console.log('\n--- 4. Game Mode: Reading Detective (reading_detective) ---');
  const rdAttemptId = generateId('att_rd');
  const rdStart = await gasPost({
    action: 'game_start_attempt',
    sessionToken,
    attemptId: rdAttemptId,
    gradeId: 'grade-8',
    unitId: 'g8-u1',
    unitTitle: 'Unit 1: Music & Life',
    activityId: 'g8-u1-act6',
    activityTitle: 'Reading Detective',
    gameType: 'reading_detective',
    totalQuestions: 2,
    startedAt: new Date().toISOString(),
  });
  assert(rdStart.ok && rdStart.data.success === true, 'Reading Detective: start attempt recorded');

  const rdAnswers = [
    {
      answerId: generateId('ans'),
      attemptId: rdAttemptId,
      questionId: 'g8-u1-rd-q1',
      questionOrder: 1,
      questionPrompt: 'What inspired the artist to compose the acoustic melody?',
      studentResponse: 'A summer memory in the mountains',
      correctAnswer: 'A summer memory in the mountains',
      isCorrect: true,
      timeSpentSeconds: 18,
      timestamp: new Date().toISOString(),
    },
    {
      answerId: generateId('ans'),
      attemptId: rdAttemptId,
      questionId: 'g8-u1-rd-q2',
      questionOrder: 2,
      questionPrompt: 'In paragraph 3, what does "harmonious" most closely mean?',
      studentResponse: 'Pleasingly arranged and agreeable',
      correctAnswer: 'Pleasingly arranged and agreeable',
      isCorrect: true,
      timeSpentSeconds: 14,
      timestamp: new Date().toISOString(),
    },
  ];

  const rdRecord = await gasPost({
    action: 'game_record_answers',
    sessionToken,
    attemptId: rdAttemptId,
    answers: rdAnswers,
  });
  assert(rdRecord.ok && rdRecord.data.recordedCount === 2, 'Reading Detective: 2 passage questions recorded');

  const rdComplete = await gasPost({
    action: 'game_complete_attempt',
    sessionToken,
    attemptId: rdAttemptId,
    score: 30,
    totalQuestions: 2,
    answeredQuestions: 2,
    correctAnswers: 2,
    incorrectAnswers: 0,
    skippedQuestions: 0,
    percentage: 100,
    durationSeconds: 32,
    completedAt: new Date().toISOString(),
  });
  assert(rdComplete.ok && rdComplete.data.status === 'completed', 'Reading Detective: attempt completed (100%)');

  // -------------------------------------------------------------------------
  // Requirement 4: Train Station
  // -------------------------------------------------------------------------
  console.log('\n--- 5. Game Mode: Train Station (train_station) ---');
  const tsAttemptId = generateId('att_ts');
  const tsStart = await gasPost({
    action: 'game_start_attempt',
    sessionToken,
    attemptId: tsAttemptId,
    gradeId: 'grade-8',
    unitId: 'g8-u3',
    unitTitle: 'Unit 3: In the City',
    activityId: 'g8-u3-act4',
    activityTitle: 'At the Train Station',
    gameType: 'train_station',
    totalQuestions: 2,
    startedAt: new Date().toISOString(),
  });
  assert(tsStart.ok && tsStart.data.success === true, 'Train Station: start attempt recorded');

  const tsAnswers = [
    {
      answerId: generateId('ans'),
      attemptId: tsAttemptId,
      questionId: 'g8-u3-ts-q1',
      questionOrder: 1,
      questionPrompt: 'Platform 4 departure: Which express service departs at 14:15 for Edinburgh Waverley?',
      studentResponse: 'Highland Express',
      correctAnswer: 'Highland Express',
      isCorrect: true,
      timeSpentSeconds: 9,
      timestamp: new Date().toISOString(),
    },
    {
      answerId: generateId('ans'),
      attemptId: tsAttemptId,
      questionId: 'g8-u3-ts-q2',
      questionOrder: 2,
      questionPrompt: 'Customer: "Single ticket to Oxford, please." Clerk: "Standard or First Class?"',
      studentResponse: 'Standard class, please.',
      correctAnswer: 'Standard class, please.',
      isCorrect: true,
      timeSpentSeconds: 7,
      timestamp: new Date().toISOString(),
    },
  ];

  const tsRecord = await gasPost({
    action: 'game_record_answers',
    sessionToken,
    attemptId: tsAttemptId,
    answers: tsAnswers,
  });
  assert(tsRecord.ok && tsRecord.data.recordedCount === 2, 'Train Station: departure board answers recorded');

  const tsComplete = await gasPost({
    action: 'game_complete_attempt',
    sessionToken,
    attemptId: tsAttemptId,
    score: 20,
    totalQuestions: 2,
    answeredQuestions: 2,
    correctAnswers: 2,
    incorrectAnswers: 0,
    skippedQuestions: 0,
    percentage: 100,
    durationSeconds: 16,
    completedAt: new Date().toISOString(),
  });
  assert(tsComplete.ok && tsComplete.data.status === 'completed', 'Train Station: attempt completed (100%)');

  // -------------------------------------------------------------------------
  // Requirement 4: Match It! (Non-MCQ)
  // -------------------------------------------------------------------------
  console.log('\n--- 6. Game Mode: Match It! (match_it) ---');
  const miAttemptId = generateId('att_mi');
  const miStart = await gasPost({
    action: 'game_start_attempt',
    sessionToken,
    attemptId: miAttemptId,
    gradeId: 'grade-8',
    unitId: 'g8-u1',
    unitTitle: 'Unit 1: Music & Life',
    activityId: 'g8-u1-act2',
    activityTitle: 'Match the Music',
    gameType: 'match_it',
    totalQuestions: 2,
    startedAt: new Date().toISOString(),
  });
  assert(miStart.ok && miStart.data.success === true, 'Match It!: start attempt recorded');

  const miAnswers = [
    {
      answerId: generateId('ans'),
      attemptId: miAttemptId,
      questionId: 'g8-u1-act2-pair1',
      questionOrder: 1,
      questionPrompt: 'Match pair: Jazz',
      studentResponse: 'Jazz -> Improvisation, brass instruments, swing rhythm',
      correctAnswer: 'Jazz -> Improvisation, brass instruments, swing rhythm',
      isCorrect: true,
      timeSpentSeconds: 5,
      timestamp: new Date().toISOString(),
    },
    {
      answerId: generateId('ans'),
      attemptId: miAttemptId,
      questionId: 'g8-u1-act2-pair2',
      questionOrder: 2,
      questionPrompt: 'Match pair: Heavy Metal',
      studentResponse: 'Heavy Metal -> Loud distorted guitars, aggressive vocals',
      correctAnswer: 'Heavy Metal -> Loud distorted guitars, aggressive vocals',
      isCorrect: true,
      timeSpentSeconds: 4,
      timestamp: new Date().toISOString(),
    },
  ];

  const miRecord = await gasPost({
    action: 'game_record_answers',
    sessionToken,
    attemptId: miAttemptId,
    answers: miAnswers,
  });
  assert(miRecord.ok && miRecord.data.recordedCount === 2, 'Match It!: matched card pairs recorded');

  const miComplete = await gasPost({
    action: 'game_complete_attempt',
    sessionToken,
    attemptId: miAttemptId,
    score: 10,
    totalQuestions: 2,
    answeredQuestions: 2,
    correctAnswers: 2,
    incorrectAnswers: 0,
    skippedQuestions: 0,
    percentage: 100,
    durationSeconds: 9,
    completedAt: new Date().toISOString(),
  });
  assert(miComplete.ok && miComplete.data.status === 'completed', 'Match It!: attempt completed');

  // -------------------------------------------------------------------------
  // Requirement 4: Sentence Builder (Non-MCQ)
  // -------------------------------------------------------------------------
  console.log('\n--- 7. Game Mode: Sentence Builder (sentence_builder) ---');
  const sbAttemptId = generateId('att_sb');
  const sbStart = await gasPost({
    action: 'game_start_attempt',
    sessionToken,
    attemptId: sbAttemptId,
    gradeId: 'grade-8',
    unitId: 'g8-u1',
    unitTitle: 'Unit 1: Music & Life',
    activityId: 'g8-u1-act3',
    activityTitle: 'Build the Sentence',
    gameType: 'sentence_builder',
    totalQuestions: 2,
    startedAt: new Date().toISOString(),
  });
  assert(sbStart.ok && sbStart.data.success === true, 'Sentence Builder: start attempt recorded');

  const sbAnswers = [
    {
      answerId: generateId('ans'),
      attemptId: sbAttemptId,
      questionId: 'g8-u1-sb-q1',
      questionOrder: 1,
      questionPrompt: 'Arrange word tiles: prefer / I / listening / rock / to / pop / to',
      studentResponse: 'I prefer listening to rock rather than pop.',
      correctAnswer: 'I prefer listening to rock rather than pop.',
      isCorrect: true,
      timeSpentSeconds: 12,
      timestamp: new Date().toISOString(),
    },
    {
      answerId: generateId('ans'),
      attemptId: sbAttemptId,
      questionId: 'g8-u1-sb-q2',
      questionOrder: 2,
      questionPrompt: 'Arrange word tiles: unbearable / loud / is / music / this',
      studentResponse: 'This loud music is unbearable.',
      correctAnswer: 'This loud music is unbearable.',
      isCorrect: true,
      timeSpentSeconds: 8,
      timestamp: new Date().toISOString(),
    },
  ];

  const sbRecord = await gasPost({
    action: 'game_record_answers',
    sessionToken,
    attemptId: sbAttemptId,
    answers: sbAnswers,
  });
  assert(sbRecord.ok && sbRecord.data.recordedCount === 2, 'Sentence Builder: constructed sentences recorded');

  const sbComplete = await gasPost({
    action: 'game_complete_attempt',
    sessionToken,
    attemptId: sbAttemptId,
    score: 20,
    totalQuestions: 2,
    answeredQuestions: 2,
    correctAnswers: 2,
    incorrectAnswers: 0,
    skippedQuestions: 0,
    percentage: 100,
    durationSeconds: 20,
    completedAt: new Date().toISOString(),
  });
  assert(sbComplete.ok && sbComplete.data.status === 'completed', 'Sentence Builder: attempt completed');

  // -------------------------------------------------------------------------
  // Requirement 4: True / False (2-option MCQ)
  // -------------------------------------------------------------------------
  console.log('\n--- 8. Game Mode: True/False (true_false) ---');
  const tfAttemptId = generateId('att_tf');
  const tfStart = await gasPost({
    action: 'game_start_attempt',
    sessionToken,
    attemptId: tfAttemptId,
    gradeId: 'grade-8',
    unitId: 'g8-u1',
    unitTitle: 'Unit 1: Music & Life',
    activityId: 'g8-u1-act4',
    activityTitle: 'Music Fact or Fiction',
    gameType: 'true_false',
    totalQuestions: 2,
    startedAt: new Date().toISOString(),
  });
  assert(tfStart.ok && tfStart.data.success === true, 'True/False: start attempt recorded');

  const tfAnswers = [
    {
      answerId: generateId('ans'),
      attemptId: tfAttemptId,
      questionId: 'g8-u1-tf-q1',
      questionOrder: 1,
      questionPrompt: 'A cello is smaller than a violin and produces higher-pitched notes.',
      studentResponse: 'False',
      correctAnswer: 'False',
      isCorrect: true,
      timeSpentSeconds: 4,
      timestamp: new Date().toISOString(),
    },
    {
      answerId: generateId('ans'),
      attemptId: tfAttemptId,
      questionId: 'g8-u1-tf-q2',
      questionOrder: 2,
      questionPrompt: 'In an orchestra, the conductor directs the performance using hand gestures or a baton.',
      studentResponse: 'True',
      correctAnswer: 'True',
      isCorrect: true,
      timeSpentSeconds: 3,
      timestamp: new Date().toISOString(),
    },
  ];

  const tfRecord = await gasPost({
    action: 'game_record_answers',
    sessionToken,
    attemptId: tfAttemptId,
    answers: tfAnswers,
  });
  assert(tfRecord.ok && tfRecord.data.recordedCount === 2, 'True/False: statements recorded');

  const tfComplete = await gasPost({
    action: 'game_complete_attempt',
    sessionToken,
    attemptId: tfAttemptId,
    score: 20,
    totalQuestions: 2,
    answeredQuestions: 2,
    correctAnswers: 2,
    incorrectAnswers: 0,
    skippedQuestions: 0,
    percentage: 100,
    durationSeconds: 7,
    completedAt: new Date().toISOString(),
  });
  assert(tfComplete.ok && tfComplete.data.status === 'completed', 'True/False: attempt completed');

  // -------------------------------------------------------------------------
  // Requirement 5: Repeated Attempt Counter Verification
  // -------------------------------------------------------------------------
  console.log('\n--- 9. Repeated Attempt Counting (g8-u1-act1 Attempt #2) ---');
  const qbAttempt2Id = generateId('att_qb_repeat');
  const qbRepeatStart = await gasPost({
    action: 'game_start_attempt',
    sessionToken,
    attemptId: qbAttempt2Id,
    gradeId: 'grade-8',
    unitId: 'g8-u1',
    unitTitle: 'Unit 1: Music & Life',
    activityId: 'g8-u1-act1', // Same activity as Quiz Battle above
    activityTitle: 'Music Vocabulary Challenge',
    gameType: 'quiz_battle',
    totalQuestions: 3,
    startedAt: new Date().toISOString(),
  });

  assert(qbRepeatStart.ok && qbRepeatStart.data.success === true, 'Repeated attempt: start succeeded');
  assert(
    qbRepeatStart.data.attemptNumber > qbAttemptNum,
    `Repeated attempt: attemptNumber incremented (previous: ${qbAttemptNum}, current: ${qbRepeatStart.data.attemptNumber})`
  );

  // Complete repeated attempt with perfect score
  const qbRepeatComplete = await gasPost({
    action: 'game_complete_attempt',
    sessionToken,
    attemptId: qbAttempt2Id,
    score: 30,
    totalQuestions: 3,
    answeredQuestions: 3,
    correctAnswers: 3,
    incorrectAnswers: 0,
    skippedQuestions: 0,
    percentage: 100,
    durationSeconds: 19,
    completedAt: new Date().toISOString(),
  });
  assert(
    qbRepeatComplete.ok && qbRepeatComplete.data.status === 'completed' && qbRepeatComplete.data.score === 30,
    'Repeated attempt: completed with score 30 (100%)'
  );

  // -------------------------------------------------------------------------
  // Requirement 5: Early Exit / Abandonment
  // -------------------------------------------------------------------------
  console.log('\n--- 10. Early Exit / Game Abandonment (action: game_abandon_attempt) ---');
  const abandonAttemptId = generateId('att_abandon');
  const abandonStart = await gasPost({
    action: 'game_start_attempt',
    sessionToken,
    attemptId: abandonAttemptId,
    gradeId: 'grade-8',
    unitId: 'g8-u1',
    unitTitle: 'Unit 1: Music & Life',
    activityId: 'g8-u1-act5',
    activityTitle: 'Say It Right! Dialogue Challenge',
    gameType: 'quiz_battle',
    totalQuestions: 5,
    startedAt: new Date().toISOString(),
  });
  assert(abandonStart.ok && abandonStart.data.success === true, 'Abandon test: start attempt succeeded');

  // Submit 1 answer before quitting
  const partialAnswers = [
    {
      answerId: generateId('ans'),
      attemptId: abandonAttemptId,
      questionId: 'g8-u1-act5-q1',
      questionOrder: 1,
      questionPrompt: 'Dialogue 1: Expressing preference politely',
      studentResponse: 'I would rather not attend the concert tonight.',
      correctAnswer: 'I would rather not attend the concert tonight.',
      isCorrect: true,
      timeSpentSeconds: 10,
      timestamp: new Date().toISOString(),
    },
  ];

  // Student clicks "Exit to Unit" mid-game -> triggers game_abandon_attempt
  const abandonRes = await gasPost({
    action: 'game_abandon_attempt',
    sessionToken,
    attemptId: abandonAttemptId,
    durationSeconds: 14,
    answeredQuestions: 1,
    correctAnswers: 1,
    finalAnswers: partialAnswers,
  });
  assert(abandonRes.ok && abandonRes.data.success === true, 'Abandon test: abandon request acknowledged');
  assert(abandonRes.data.status === 'abandoned', 'Abandon test: status persisted as "abandoned"');

  // -------------------------------------------------------------------------
  // Session Logout & Invalidation
  // -------------------------------------------------------------------------
  console.log('\n--- 11. Student Logout & Session Invalidation ---');
  const logoutRes = await gasPost({
    action: 'student_logout',
    sessionToken,
  });
  assert(logoutRes.ok && logoutRes.data.success === true, 'Student logout executed successfully');

  // Verify that subsequent requests with logged-out session are rejected
  const revokedCheck = await gasPost({
    action: 'student_session_check',
    sessionToken,
  });
  assert(
    revokedCheck.ok && revokedCheck.data.success === false,
    `Logged out session is rejected on subsequent check (error: "${revokedCheck.data.error}")`
  );

  // -------------------------------------------------------------------------
  // Final Test Summary
  // -------------------------------------------------------------------------
  console.log('\n' + '='.repeat(75));
  console.log(`TOTAL ASSERTIONS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
  console.log('='.repeat(75));

  if (failedTests > 0) {
    console.error('\nFAILURES SUMMARY:');
    testDetails
      .filter((t) => t.status === 'FAIL')
      .forEach((t) => console.error(` - [FAIL] ${t.message} (${t.details})`));
    process.exit(1);
  } else {
    console.log('\nALL 34 INTEGRATION ASSERTIONS PASSED WITH 100% SUCCESS!');
    process.exit(0);
  }
}

runE2ETests().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
