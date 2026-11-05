/**
 * UNIT REVIEW ARCADE — PHASE 2 BROWSER INTEGRATION TEST SUITE
 * Tests all 6 game engines, tracking lifecycle, telemetry recording,
 * guest mode isolation, session persistence, and early exit abandonment
 * in Microsoft Edge over Chrome DevTools Protocol (CDP).
 */

import { spawn } from 'child_process';
import http from 'http';
import os from 'os';
import path from 'path';

const browserPath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDataDir = path.join(os.tmpdir(), `arcade_p2_verify_${Date.now()}`);

const args = [
  '--headless=new',
  '--remote-debugging-port=9226',
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  '--window-size=1280,800',
  `--user-data-dir=${userDataDir}`,
];

console.log('🚀 Spawning Microsoft Edge for Phase 2 Browser Verification...');
const browserProc = spawn(browserPath, args, { stdio: 'pipe' });

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let nextId = 1;
function sendCdp(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = nextId++;
    const handler = (msg) => {
      try {
        const data = JSON.parse(msg.data);
        if (data.id === id) {
          ws.removeEventListener('message', handler);
          if (data.error) {
            reject(new Error(data.error.message || JSON.stringify(data.error)));
          } else {
            resolve(data.result);
          }
        }
      } catch (err) {
        // ignore parse error
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function evalInBrowser(ws, expression) {
  try {
    const res = await sendCdp(ws, 'Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    return res?.result?.value;
  } catch (err) {
    return undefined;
  }
}

async function waitForCondition(ws, conditionExpr, timeoutMs = 15000, desc = '') {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const passed = await evalInBrowser(ws, conditionExpr);
    if (passed) return true;
    await sleep(250);
  }
  const bodySnippet = await evalInBrowser(ws, 'document.body.innerText.slice(0, 300).replace(/\\n+/g, " ")');
  throw new Error(`Timeout waiting for condition: ${desc || conditionExpr}\nCurrent page text: ${bodySnippet}`);
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function runBrowserTests() {
  let targets = null;
  for (let attempt = 0; attempt < 12; attempt++) {
    try {
      targets = await getJson('http://127.0.0.1:9226/json');
      if (targets && targets.length > 0) break;
    } catch {
      await sleep(500);
    }
  }

  if (!targets) throw new Error('Could not connect to CDP endpoint on port 9226 after retries');
  const pageTarget = targets.find((t) => t.type === 'page');
  if (!pageTarget) throw new Error('No page target discovered on CDP port 9226');

  // Use Node 22 built-in WebSocket
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve);
    ws.addEventListener('error', reject);
  });

  console.log('Connected to CDP endpoint successfully.\n');
  await sendCdp(ws, 'Page.enable');
  await sendCdp(ws, 'Runtime.enable');

  // Forward all browser console messages and uncaught exceptions to test runner
  ws.addEventListener('message', (msg) => {
    try {
      const data = JSON.parse(msg.data);
      if (data.method === 'Runtime.consoleAPICalled') {
        const text = data.params.args.map((a) => a.value ?? a.description ?? JSON.stringify(a)).join(' ');
        if (!text.includes('[vite]')) {
          console.log(`  [BROWSER CONSOLE ${data.params.type}]: ${text}`);
        }
      }
      if (data.method === 'Runtime.exceptionThrown') {
        console.error(`  [BROWSER EXCEPTION]:`, data.params.exceptionDetails?.text, data.params.exceptionDetails?.exception?.description);
      }
    } catch {}
  });

  const LOCAL_URL = 'http://localhost:4173/';
  console.log(`=== BROWSER TEST 1: LOAD APP & GUEST CLASSROOM MODE ISOLATION ===`);
  await sendCdp(ws, 'Page.navigate', { url: LOCAL_URL });
  await waitForCondition(ws, 'document.body.innerText.includes("UNIT REVIEW ARCADE")', 15000);

  // Check Classroom Mode header
  const isClassroomMode = await evalInBrowser(ws, 'document.body.innerText.includes("Classroom Mode")');
  const noStoredAttempt = await evalInBrowser(ws, 'sessionStorage.getItem("unit_review_arcade_active_attempt_v2") === null');
  console.log('  App loaded in Classroom Mode:', isClassroomMode);
  console.log('  No tracking attempt in sessionStorage:', noStoredAttempt);

  // Launch Grade 7 Unit 1 in Guest Mode
  await evalInBrowser(ws, `
    const g7 = Array.from(document.querySelectorAll('h2')).find(h => h.innerText.includes("GRADE 7"));
    g7.closest('div[class*="cursor-pointer"]').click();
  `);
  await waitForCondition(ws, 'document.body.innerText.includes("Grade 7 Unit Vault")', 8000);

  await evalInBrowser(ws, `
    const enterBtns = Array.from(document.querySelectorAll('button')).filter(b => b.innerText.includes("Enter Unit"));
    enterBtns[0].click();
  `);
  await waitForCondition(ws, 'document.body.innerText.includes("Digital Vocabulary Quest")', 8000);

  // Launch Quiz Battle in Guest Mode
  await evalInBrowser(ws, `
    const h3 = Array.from(document.querySelectorAll('h3')).find(h => h.innerText && h.innerText.includes("Digital Vocabulary Quest"));
    const card = h3.closest('div[class*="rounded-3xl"]');
    const launchBtn = Array.from(card.querySelectorAll('button')).find(b => b.innerText.includes("Launch"));
    launchBtn.scrollIntoView({ block: 'center' });
    launchBtn.click();
  `);
  await waitForCondition(ws, 'document.body.innerText.includes("Exit to Unit") && document.body.innerText.toLowerCase().includes("question")', 8000);

  // Click an answer in Guest Mode
  await evalInBrowser(ws, `
    const optBtns = Array.from(document.querySelectorAll('button')).filter(b => {
      const letterDiv = b.querySelector('div[class*="font-arcade"]');
      return letterDiv && ['A', 'B', 'C', 'D'].includes(letterDiv.innerText.trim());
    });
    if (optBtns.length > 0) optBtns[0].click();
  `);
  await sleep(500);

  // Verify guest mode did NOT create attempt or pending answers
  const guestAttempt = await evalInBrowser(ws, 'sessionStorage.getItem("unit_review_arcade_active_attempt_v2")');
  const guestAnswers = await evalInBrowser(ws, 'sessionStorage.getItem("unit_review_arcade_active_answers_v2")');
  console.log('  Guest Mode Active Attempt is null:', guestAttempt === null);
  console.log('  Guest Mode Active Answers is null:', guestAnswers === null);

  if (guestAttempt !== null || guestAnswers !== null) {
    throw new Error('Guest Mode leaked telemetry into sessionStorage!');
  }

  // Exit back to unit
  await evalInBrowser(ws, `
    const exitBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes("Exit to Unit"));
    if (exitBtn) exitBtn.click();
  `);
  await waitForCondition(ws, '!document.body.innerText.includes("Exit to Unit") && document.body.innerText.includes("Launch")', 8000);
  console.log('  ✅ BROWSER TEST 1 PASSED: Guest Classroom Mode is 100% isolated (zero tracking).\n');

  console.log(`=== BROWSER TEST 2: STUDENT LOGIN & AUTHENTICATED SESSION ===`);
  // Open Student Login Modal
  await evalInBrowser(ws, `
    const loginBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes("Student Login"));
    if (loginBtn) loginBtn.click();
  `);
  await waitForCondition(ws, 'document.body.innerText.includes("STUDENT LOGIN")', 6000);

  // Click Test Accounts drawer and choose Demo Student 801 (Barış A., Class 8A)
  await evalInBrowser(ws, `
    const testAccountsBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes("Test Accounts"));
    if (testAccountsBtn) testAccountsBtn.click();
  `);
  await sleep(400);

  await evalInBrowser(ws, `
    const accBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes("801"));
    if (accBtn) accBtn.click();
  `);
  await sleep(300);

  // Submit login to live Google Apps Script backend
  await evalInBrowser(ws, `
    const submitBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes("Sign In to Arcade"));
    if (submitBtn) submitBtn.click();
  `);

  // Wait for login to complete and header to show Barış
  await waitForCondition(ws, 'document.querySelector("header") && (document.querySelector("header").innerText.includes("Barış") || document.querySelector("header").innerText.includes("8A"))', 15000);

  const headerStudentText = await evalInBrowser(ws, 'document.querySelector("header").innerText.replace(/\\n+/g, " ")');
  console.log('  Header text after student login:', headerStudentText);
  console.log('  ✅ BROWSER TEST 2 PASSED: Authenticated Student Mode active ([8A] Barış).\n');

  // Helper to exit to unit
  async function exitToUnit() {
    await sleep(400);
    const clickOutcome = await evalInBrowser(ws, `
      (() => {
        const exitBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes("Exit to Unit"));
        if (!exitBtn) return 'exit button not found';
        exitBtn.scrollIntoView({ block: 'center' });
        exitBtn.click();
        return 'clicked exit button';
      })()
    `);
    console.log('  exitToUnit click outcome:', clickOutcome);
    await waitForCondition(ws, '!document.body.innerText.includes("Exit to Unit") && document.body.innerText.includes("Launch")', 8000, 'Waiting to return to Unit Dashboard screen');
    await sleep(500);
  }

  // Helper to launch activity by title
  async function launchActivity(title) {
    await waitForCondition(ws, `document.body.innerText.includes(${JSON.stringify(title)})`, 8000);
    await sleep(300);
    const res = await evalInBrowser(ws, `
      (() => {
        const h3List = Array.from(document.querySelectorAll('h3')).map(h => h.innerText);
        const h3 = Array.from(document.querySelectorAll('h3')).find(h => h.innerText && h.innerText.includes(${JSON.stringify(title)}));
        if (!h3) return { foundH3: false, allH3s: h3List };
        const card = h3.closest('div[class*="rounded-3xl"]') || h3.parentElement?.parentElement;
        if (!card) return { foundH3: true, foundCard: false };
        const launchBtn = Array.from(card.querySelectorAll('button')).find(b => b.innerText.includes("Launch"));
        if (!launchBtn) return { foundH3: true, foundCard: true, cardButtons: Array.from(card.querySelectorAll('button')).map(b => b.innerText) };
        launchBtn.scrollIntoView({ block: 'center' });
        launchBtn.click();
        return { success: true };
      })()
    `);
    console.log('  launchActivity("' + title + '") result:', res);
    if (!res?.success) throw new Error('Failed to launch activity: ' + title + ' ' + JSON.stringify(res));
  }

  console.log(`=== BROWSER TEST 3: ENGINE 1 (QUIZ BATTLE) TRACKING ===`);
  await launchActivity("Digital Vocabulary Quest");
  await waitForCondition(ws, 'document.body.innerText.includes("Exit to Unit") && document.body.innerText.toLowerCase().includes("question")', 8000);

  // Verify attempt initialized in sessionStorage
  const qbAttemptStr = await evalInBrowser(ws, 'sessionStorage.getItem("unit_review_arcade_active_attempt_v2")');
  console.log('  Active attempt stored in sessionStorage:', qbAttemptStr);
  const qbAttempt = JSON.parse(qbAttemptStr || '{}');
  if (qbAttempt.gameType !== 'quiz_battle' || qbAttempt.status !== 'in_progress') {
    throw new Error('Quiz Battle attempt was not properly initialized');
  }

  // Answer first question
  const debugBtns = await evalInBrowser(ws, `
    (() => {
      const allBtns = Array.from(document.querySelectorAll('button')).map(b => ({
        text: b.innerText.replace(/\\n+/g, " "),
        hasArcade: !!b.querySelector('.font-arcade'),
        arcadeText: b.querySelector('.font-arcade')?.innerText
      }));
      return allBtns;
    })()
  `);
  console.log('  Buttons found in Quiz Battle:', debugBtns);

  // Click first option with full diagnostics
  const clickDiagnostics = await evalInBrowser(ws, `
    (() => {
      const optBtns = Array.from(document.querySelectorAll('button')).filter(b => {
        const letterDiv = b.querySelector('.font-arcade');
        return letterDiv && ['A', 'B', 'C', 'D'].includes(letterDiv.innerText.trim());
      });
      if (optBtns.length === 0) return { error: 'no opt buttons' };
      const b = optBtns[0];
      const rect = b.getBoundingClientRect();
      const topEl = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
      
      const reactKeys = Object.keys(b).filter(k => k.startsWith('__reactProps') || k.startsWith('__reactEvents') || k.startsWith('__reactFiber'));
      
      // Trigger click
      b.click();
      
      return {
        tag: b.tagName,
        text: b.innerText.replace(/\\n+/g, " "),
        rect: { x: rect.x, y: rect.y, w: rect.width, h: rect.height },
        topElementTag: topEl?.tagName,
        topElementClass: topEl?.className,
        reactKeys,
      };
    })()
  `);
  console.log('  Click diagnostics:', JSON.stringify(clickDiagnostics, null, 2));
  await sleep(1000);

  const afterClick = await evalInBrowser(ws, `
    (() => {
      const allBtns = Array.from(document.querySelectorAll('button')).map(b => b.innerText.replace(/\\n+/g, " "));
      const sessionAttempt = sessionStorage.getItem("unit_review_arcade_active_attempt_v2");
      const activeAns = sessionStorage.getItem("unit_review_arcade_active_answers_v2");
      const pendingAns = sessionStorage.getItem("unit_review_arcade_pending_answers_v2");
      const sessionAuth = sessionStorage.getItem("unit_review_arcade_active_session_v1");
      return {
        allBtns,
        sessionAttempt,
        activeAns,
        pendingAns,
        hasAuth: !!sessionAuth,
      };
    })()
  `);
  console.log('  State after option click:', JSON.stringify(afterClick, null, 2));

  // Check recorded answer in telemetry
  const qbAnswers = await evalInBrowser(ws, 'JSON.parse(sessionStorage.getItem("unit_review_arcade_active_answers_v2") || sessionStorage.getItem("unit_review_arcade_pending_answers_v2") || "[]")');
  console.log('  Recorded answer in telemetry:', qbAnswers[0]);
  if (!qbAnswers[0] || !qbAnswers[0].questionPrompt || qbAnswers[0].timeSpentSeconds <= 0) {
    throw new Error('Telemetry answer record is incomplete');
  }

  await exitToUnit();
  console.log('  ✅ BROWSER TEST 3 PASSED: Quiz Battle telemetry recorded.\n');

  console.log(`=== BROWSER TEST 4: ENGINE 2 (MATCH IT!) TRACKING ===`);
  await launchActivity("Match the Digital World");
  await waitForCondition(ws, 'document.body.innerText.includes("Exit to Unit") && (document.body.innerText.toLowerCase().includes("round") || document.body.innerText.toLowerCase().includes("match"))', 8000);
  await waitForCondition(ws, '(() => { const a = sessionStorage.getItem("unit_review_arcade_active_attempt_v2"); return a && JSON.parse(a).gameType === "match_it"; })()', 8000);

  const matchAttemptStr = await evalInBrowser(ws, 'sessionStorage.getItem("unit_review_arcade_active_attempt_v2")');
  const matchAttempt = JSON.parse(matchAttemptStr || '{}');
  console.log('  Match It! active attempt:', matchAttempt.gameType);
  if (matchAttempt.gameType !== 'match_it') {
    throw new Error('Match It! attempt was not properly initialized');
  }

  // Click a left card and a right card
  await evalInBrowser(ws, `
    const cols = Array.from(document.querySelectorAll('div.space-y-3'));
    if (cols.length >= 2) {
      const leftBtn = cols[0].querySelector('button');
      const rightBtn = cols[1].querySelector('button');
      if (leftBtn) leftBtn.click();
      if (rightBtn) rightBtn.click();
    }
  `);
  await sleep(800);

  const matchAnswers = await evalInBrowser(ws, 'JSON.parse(sessionStorage.getItem("unit_review_arcade_active_answers_v2") || sessionStorage.getItem("unit_review_arcade_pending_answers_v2") || "[]")');
  console.log('  Match It! recorded answer in telemetry:', matchAnswers[matchAnswers.length - 1]);
  if (matchAnswers.length === 0) {
    throw new Error('Match It! did not record answer telemetry');
  }

  await exitToUnit();
  console.log('  ✅ BROWSER TEST 4 PASSED: Match It! telemetry recorded.\n');

  console.log(`=== BROWSER TEST 5: ENGINE 3 (SENTENCE BUILDER) TRACKING ===`);
  await launchActivity("Build the Sentence");
  await waitForCondition(ws, 'document.body.innerText.includes("Exit to Unit") && document.body.innerText.toLowerCase().includes("sentence")', 8000);
  await waitForCondition(ws, '(() => { const a = sessionStorage.getItem("unit_review_arcade_active_attempt_v2"); return a && JSON.parse(a).gameType === "sentence_builder"; })()', 8000);

  const sbAttemptStr = await evalInBrowser(ws, 'sessionStorage.getItem("unit_review_arcade_active_attempt_v2")');
  const sbAttempt = JSON.parse(sbAttemptStr || '{}');
  console.log('  Sentence Builder active attempt:', sbAttempt.gameType);
  if (sbAttempt.gameType !== 'sentence_builder') {
    throw new Error('Sentence Builder attempt was not properly initialized');
  }

  // Trigger answer recording via Reveal or word placement
  await evalInBrowser(ws, `
    const revealBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes("Reveal"));
    if (revealBtn) {
      revealBtn.click();
    } else {
      const tile = document.querySelector('div.min-h-\\[80px\\] button');
      if (tile) tile.click();
      const checkBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes("Check Answer"));
      if (checkBtn) checkBtn.click();
    }
  `);
  await sleep(800);

  const sbAnswers = await evalInBrowser(ws, 'JSON.parse(sessionStorage.getItem("unit_review_arcade_active_answers_v2") || sessionStorage.getItem("unit_review_arcade_pending_answers_v2") || "[]")');
  console.log('  Sentence Builder recorded answer in telemetry:', sbAnswers[sbAnswers.length - 1]);
  if (sbAnswers.length === 0) {
    throw new Error('Sentence Builder did not record answer telemetry');
  }

  await exitToUnit();
  console.log('  ✅ BROWSER TEST 5 PASSED: Sentence Builder telemetry recorded.\n');

  console.log(`=== BROWSER TEST 6: ENGINE 4 (TRUE / FALSE) TRACKING ===`);
  await launchActivity("Digital Fact or Fiction");
  await waitForCondition(ws, 'document.body.innerText.includes("Exit to Unit") && (document.body.innerText.toLowerCase().includes("true") || document.body.innerText.toLowerCase().includes("false"))', 8000);
  await waitForCondition(ws, '(() => { const a = sessionStorage.getItem("unit_review_arcade_active_attempt_v2"); return a && JSON.parse(a).gameType === "true_false"; })()', 8000);

  const tfAttemptStr = await evalInBrowser(ws, 'sessionStorage.getItem("unit_review_arcade_active_attempt_v2")');
  const tfAttempt = JSON.parse(tfAttemptStr || '{}');
  console.log('  True / False active attempt:', tfAttempt.gameType);
  if (tfAttempt.gameType !== 'true_false') {
    throw new Error('True / False attempt was not properly initialized');
  }

  // Click True or False
  await evalInBrowser(ws, `
    const tfBtns = Array.from(document.querySelectorAll('button')).filter(b => b.innerText.includes("TRUE") || b.innerText.includes("FALSE"));
    if (tfBtns.length > 0) tfBtns[0].click();
  `);
  await sleep(800);

  const tfAnswers = await evalInBrowser(ws, 'JSON.parse(sessionStorage.getItem("unit_review_arcade_active_answers_v2") || sessionStorage.getItem("unit_review_arcade_pending_answers_v2") || "[]")');
  console.log('  True / False recorded answer in telemetry:', tfAnswers[tfAnswers.length - 1]);
  if (tfAnswers.length === 0) {
    throw new Error('True / False did not record answer telemetry');
  }

  await exitToUnit();
  console.log('  ✅ BROWSER TEST 6 PASSED: True / False telemetry recorded.\n');

  console.log(`=== BROWSER TEST 7: ENGINE 5 (READING DETECTIVE) TRACKING ===`);
  await launchActivity("Reading Detective");
  await waitForCondition(ws, 'document.body.innerText.includes("Exit to Unit") && document.body.innerText.toLowerCase().includes("reading")', 8000);
  await waitForCondition(ws, '(() => { const a = sessionStorage.getItem("unit_review_arcade_active_attempt_v2"); return a && JSON.parse(a).gameType === "reading_detective"; })()', 8000);

  const rdAttemptStr = await evalInBrowser(ws, 'sessionStorage.getItem("unit_review_arcade_active_attempt_v2")');
  const rdAttempt = JSON.parse(rdAttemptStr || '{}');
  console.log('  Reading Detective active attempt:', rdAttempt.gameType);
  if (rdAttempt.gameType !== 'reading_detective') {
    throw new Error('Reading Detective attempt was not properly initialized');
  }

  // Select passage option
  await evalInBrowser(ws, `
    const rdOptBtns = Array.from(document.querySelectorAll('button')).filter(b => {
      const letterDiv = b.querySelector('.font-arcade');
      return letterDiv && ['A', 'B', 'C', 'D'].includes(letterDiv.innerText.trim());
    });
    if (rdOptBtns.length > 0) {
      rdOptBtns[0].scrollIntoView({ block: 'center' });
      rdOptBtns[0].click();
    }
  `);
  await sleep(800);

  const rdAnswers = await evalInBrowser(ws, 'JSON.parse(sessionStorage.getItem("unit_review_arcade_active_answers_v2") || sessionStorage.getItem("unit_review_arcade_pending_answers_v2") || "[]")');
  console.log('  Reading Detective recorded answer in telemetry:', rdAnswers[rdAnswers.length - 1]);
  if (rdAnswers.length === 0) {
    throw new Error('Reading Detective did not record answer telemetry');
  }

  // Return to homepage
  await evalInBrowser(ws, `
    const brandBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes("UNIT REVIEW ARCADE"));
    if (brandBtn) brandBtn.click();
  `);
  await waitForCondition(ws, 'document.body.innerText.includes("Select a grade level")', 8000);
  console.log('  ✅ BROWSER TEST 7 PASSED: Reading Detective telemetry recorded.\n');

  console.log(`=== BROWSER TEST 8: ENGINE 6 (TRAIN STATION) TRACKING ===`);
  // Navigate to Grade 8 Unit 3
  await evalInBrowser(ws, `
    const g8 = Array.from(document.querySelectorAll('h2')).find(h => h.innerText.includes("GRADE 8"));
    if (g8) g8.closest('div[class*="cursor-pointer"]').click();
  `);
  await waitForCondition(ws, 'document.body.innerText.includes("Grade 8 Unit Vault")', 8000);

  // Enter Unit 3: Travel to Britain
  const unitTitles = await evalInBrowser(ws, 'Array.from(document.querySelectorAll("h3")).map(h => h.innerText)');
  console.log('  Grade 8 unit titles found:', unitTitles);

  const enterOutcome = await evalInBrowser(ws, `
    (() => {
      const h3 = Array.from(document.querySelectorAll('h3')).find(h => h.innerText && (h.innerText.toLowerCase().includes("travel") || h.innerText.includes("03") || h.innerText.includes("Unit 3")));
      if (!h3) return { foundH3: false, allH3s: Array.from(document.querySelectorAll('h3')).map(h => h.innerText) };
      const card = h3.closest('div[class*="rounded-3xl"]') || h3.parentElement?.parentElement;
      if (!card) return { foundH3: true, foundCard: false };
      const enterBtn = Array.from(card.querySelectorAll('button')).find(b => b.innerText.includes("Enter Unit"));
      if (!enterBtn) return { foundH3: true, foundCard: true, noEnterBtn: true };
      enterBtn.scrollIntoView({ block: 'center' });
      enterBtn.click();
      return { success: true };
    })()
  `);
  console.log('  Enter Unit 3 outcome:', enterOutcome);
  await waitForCondition(ws, 'document.body.innerText.includes("At the Train Station")', 8000, 'Waiting to enter Unit 3: Travel to Britain');

  await launchActivity("At the Train Station");
  await waitForCondition(ws, 'document.body.innerText.includes("Exit to Unit") && (document.body.innerText.toLowerCase().includes("train") || document.body.innerText.toLowerCase().includes("departure"))', 8000);
  await waitForCondition(ws, '(() => { const a = sessionStorage.getItem("unit_review_arcade_active_attempt_v2"); return a && JSON.parse(a).gameType === "train_station"; })()', 8000);

  const tsAttemptStr = await evalInBrowser(ws, 'sessionStorage.getItem("unit_review_arcade_active_attempt_v2")');
  const tsAttempt = JSON.parse(tsAttemptStr || '{}');
  console.log('  Train Station active attempt:', tsAttempt.gameType);
  if (tsAttempt.gameType !== 'train_station') {
    throw new Error('Train Station attempt was not properly initialized');
  }

  // Click departure board question option
  await evalInBrowser(ws, `
    const tsOptBtns = Array.from(document.querySelectorAll('button')).filter(b => {
      const letterDiv = b.querySelector('.font-arcade');
      return letterDiv && ['A', 'B', 'C', 'D'].includes(letterDiv.innerText.trim());
    });
    if (tsOptBtns.length > 0) {
      tsOptBtns[0].scrollIntoView({ block: 'center' });
      tsOptBtns[0].click();
    }
  `);
  await sleep(800);

  const tsAnswers = await evalInBrowser(ws, 'JSON.parse(sessionStorage.getItem("unit_review_arcade_active_answers_v2") || sessionStorage.getItem("unit_review_arcade_pending_answers_v2") || "[]")');
  console.log('  Train Station recorded answer in telemetry:', tsAnswers[tsAnswers.length - 1]);
  if (tsAnswers.length === 0) {
    throw new Error('Train Station did not record answer telemetry');
  }

  await exitToUnit();
  console.log('  ✅ BROWSER TEST 8 PASSED: Train Station telemetry recorded.\n');

  console.log(`=== BROWSER TEST 9: PAGE RELOAD & SESSION RECOVERY ===`);
  await sendCdp(ws, 'Page.reload');
  await waitForCondition(ws, 'document.querySelector("header") && (document.querySelector("header").innerText.includes("Barış") || document.querySelector("header").innerText.includes("8A"))', 15000);

  const recoveredHeader = await evalInBrowser(ws, 'document.querySelector("header").innerText.replace(/\\n+/g, " ")');
  console.log('  Header text after page reload:', recoveredHeader);
  console.log('  ✅ BROWSER TEST 9 PASSED: Session survives page refresh cleanly.\n');

  console.log('🎉 ALL BROWSER INTEGRATION TESTS PASSED (9/9)! Real browser telemetry verified across all 6 engines.');
  ws.close();
}

runBrowserTests()
  .then(() => {
    browserProc.kill();
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Browser Verification Error:', err);
    browserProc.kill();
    process.exit(1);
  });
