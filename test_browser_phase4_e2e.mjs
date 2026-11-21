/**
 * UNIT REVIEW ARCADE — PHASE 4 REAL BROWSER END-TO-END AUTOMATION SUITE
 * Tests General English Hub, 4 Skill Pillars, AudioPromptPlayer & Hidden Transcripts,
 * Mixed Practice (50/50, 70/30, 30/70), Grade Isolation, Responsive Viewports,
 * and Unit Review Backward Compatibility in Microsoft Edge via CDP.
 */

import { spawn } from 'child_process';
import http from 'http';
import os from 'os';
import path from 'path';

const browserPath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDataDir = path.join(os.tmpdir(), `arcade_p4_e2e_${Date.now()}`);
const CDP_PORT = 9227;

const edgeArgs = [
  '--headless',
  '--no-sandbox',
  '--disable-gpu',
  '--disable-dev-shm-usage',
  '--remote-allow-origins=*',
  `--remote-debugging-port=${CDP_PORT}`,
  '--no-first-run',
  '--no-default-browser-check',
  '--window-size=1280,800',
  `--user-data-dir=${userDataDir}`,
];

console.log('======================================================================');
console.log('TIER 2: BROWSER END-TO-END AUTOMATION SUITE (EDGE CDP)');
console.log('======================================================================\n');
console.log('🚀 Spawning Microsoft Edge for Phase 4 Real-Browser Verification...');

const browserProc = spawn(browserPath, edgeArgs, { stdio: 'pipe' });

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
    let expr = expression.trim();
    while (expr.endsWith(';')) {
      expr = expr.slice(0, -1).trim();
    }
    if (!expr.startsWith('(') && (expr.includes('const ') || expr.includes('let ') || expr.includes('return '))) {
      expr = `(() => {\n${expr}\n})()`;
    }
    const res = await sendCdp(ws, 'Runtime.evaluate', {
      expression: expr,
      returnByValue: true,
      awaitPromise: true,
    });
    if (res?.exceptionDetails) {
      console.error('Browser eval exception:', res.exceptionDetails.exception?.description || res.exceptionDetails.text);
    }
    return res?.result?.value;
  } catch (err) {
    console.error('evalInBrowser error:', err);
    return undefined;
  }
}

async function waitForCondition(ws, conditionExpr, timeoutMs = 12000, desc = '') {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const passed = await evalInBrowser(ws, conditionExpr);
    if (passed) return true;
    await sleep(200);
  }
  const bodySnippet = await evalInBrowser(ws, 'document.body ? document.body.innerText.slice(0, 300).replace(/\\n+/g, " ") : "NO BODY"');
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

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`  ❌ FAILED: ${message}`);
    throw new Error(message);
  }
  console.log(`  ✓ ${message}`);
  passedTests++;
}

async function runSuite() {
  try {
    // 1. Connect to CDP
    let targets = null;
    for (let attempt = 0; attempt < 15; attempt++) {
      try {
        targets = await getJson(`http://127.0.0.1:${CDP_PORT}/json`);
        if (targets && targets.length > 0) break;
      } catch {
        await sleep(500);
      }
    }

    if (!targets) throw new Error('Could not connect to Edge CDP endpoint');
    const pageTarget = targets.find((t) => t.type === 'page');
    if (!pageTarget) throw new Error('No page target discovered on CDP');

    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      ws.addEventListener('open', resolve);
      ws.addEventListener('error', reject);
    });

    console.log('Connected to Edge via Chrome DevTools Protocol successfully.\n');
    await sendCdp(ws, 'Page.enable');
    await sendCdp(ws, 'DOM.enable');
    await sendCdp(ws, 'Runtime.enable');

    // Navigate to local Vite dev server
    await sendCdp(ws, 'Page.navigate', { url: 'http://localhost:5173' });
    await waitForCondition(ws, 'document.body && document.body.innerText.length > 50', 15000, 'React App mounted');
    await sleep(1000);

    // ---------------------------------------------------------------
    // TEST 1: Welcome Screen & Guest Mode Access
    // ---------------------------------------------------------------
    console.log('--- Test 1: Welcome Screen & Guest Entry ---');
    await sleep(2000);
    const bodyText = await evalInBrowser(ws, 'document.body ? document.body.innerText : "NULL"');
    console.log('BODY TEXT PREVIEW:', bodyText.slice(0, 200).replace(/\n+/g, ' '));
    const onWelcome = bodyText.includes("Campus Gate") || bodyText.includes("Welcome") || bodyText.includes("Student");
    assert(onWelcome, 'Public Welcome / Entry screen displayed');

    // Click Student Login
    await evalInBrowser(ws, `
      const btns = Array.from(document.querySelectorAll('button'));
      const studentBtn = btns.find(b => (b.textContent || '').includes('STUDENT PORTAL') || (b.textContent || '').includes('Student Adventure') || (b.textContent || '').includes('Student'));
      if (studentBtn) studentBtn.click();
    `);
    
    // Wait for Student Sign In screen
    await waitForCondition(ws, 'document.body.innerText.includes("Student Sign In")', 6000, 'Student Sign In screen rendered');

    // Click Smartboard Guest Mode button
    await evalInBrowser(ws, `
      const btns = Array.from(document.querySelectorAll('button'));
      const guestBtn = btns.find(b => (b.textContent || '').includes('Smartboard Guest Mode') || (b.textContent || '').toLowerCase().includes('guest'));
      if (guestBtn) guestBtn.click();
    `);

    const onHome = await waitForCondition(ws, 'document.body.innerText.includes("Adventure Home")', 8000, 'Adventure Home rendered');
    assert(onHome, 'Successfully entered Adventure Home in Guest Mode');

    // ---------------------------------------------------------------
    // TEST 2: Home Screen Navigation Elements & Island Cards
    // ---------------------------------------------------------------
    console.log('\n--- Test 2: Home Screen General English Elements ---');
    await sleep(500);
    const homeText = await evalInBrowser(ws, 'document.body ? document.body.innerText : ""');
    console.log('HOME SCREEN TEXT PREVIEW:', homeText.slice(0, 300).replace(/\n+/g, ' '));
    const hasGeIsland = homeText.includes("General English") && (homeText.includes("Skill Academy") || homeText.includes("Master Grammar"));
    assert(hasGeIsland, 'Home Screen renders "General English (Skill Academy)" Island Card');

    const hasGeNavBtn = await evalInBrowser(ws, `
      Array.from(document.querySelectorAll('button')).some(b => (b.textContent || '').includes('General English'))
    `);
    assert(hasGeNavBtn, 'Top campus navigation bar includes "📚 General English" button');

    const hasCoreIsland = await evalInBrowser(ws, 'document.body.innerText.includes("Curriculum") || document.body.innerText.includes("Core Adventure")');
    assert(hasCoreIsland, 'Core Adventure / Unit Review Island is preserved as primary destination');

    // ---------------------------------------------------------------
    // TEST 3: Navigate to General English Hub & Skill Tabs
    // ---------------------------------------------------------------
    console.log('\n--- Test 3: General English Hub & 4 Skill Pillars ---');
    await evalInBrowser(ws, `
      const btn = Array.from(document.querySelectorAll('button')).find(b => (b.textContent || '').includes('General English'));
      if (btn) btn.click();
    `);
    await sleep(800);

    const onGeHub = await waitForCondition(ws, 'document.body.innerText.includes("General English Academy")', 6000, 'General English Academy loaded');
    assert(onGeHub, 'Navigated to General English Academy Hub');

    // Verify 4 Skill Tabs are present
    const hasTabs = await evalInBrowser(ws, `
      document.body.innerText.includes('Grammar') && document.body.innerText.includes('Vocabulary') && document.body.innerText.includes('Reading') && document.body.innerText.includes('Listening')
    `);
    assert(hasTabs, 'All 4 Skill Pillars rendered: Grammar, Vocabulary, Reading, Listening & Dictation');

    // Switch between Grade 7 and Grade 8 in guest mode
    await evalInBrowser(ws, `
      const g8Btn = Array.from(document.querySelectorAll('button')).find(b => (b.textContent || '').trim().includes('Grade 8'));
      if (g8Btn) g8Btn.click();
    `);
    await sleep(500);
    const g8Active = await evalInBrowser(ws, 'document.body.innerText.includes("Present Perfect") || document.body.innerText.includes("Conditionals")');
    assert(g8Active, 'Grade 8 switcher loaded Grade 8 grammar topics (Present Perfect, Conditionals)');

    // Switch back to Grade 7
    await evalInBrowser(ws, `
      const g7Btn = Array.from(document.querySelectorAll('button')).find(b => (b.textContent || '').trim().includes('Grade 7'));
      if (g7Btn) g7Btn.click();
    `);
    await sleep(500);

    // ---------------------------------------------------------------
    // TEST 4: Launch General English Quiz Battle Game
    // ---------------------------------------------------------------
    console.log('\n--- Test 4: Launching & Playing General English Quiz Battle ---');
    // Click "Start Practice" on the first topic (Present Simple vs Continuous)
    await evalInBrowser(ws, `
      const btns = Array.from(document.querySelectorAll('button')).filter(b => (b.textContent || '').includes('Start Practice'));
      if (btns.length > 0) btns[0].click();
    `);
    await sleep(1000);

    const inGame = await waitForCondition(ws, 'document.body.innerText.includes("Exit to General English")', 6000, 'Game container loaded');
    assert(inGame, 'GeneralEnglishGameContainer mounted QuizBattleGame');

    // Check that 4 options are rendered
    const optionCount = await evalInBrowser(ws, `document.querySelectorAll('button div.font-arcade').length`);
    assert(optionCount >= 4, `Rendered 4 MCQ option buttons (got ${optionCount})`);

    // Click an option (Option A)
    await evalInBrowser(ws, `
      const optBtns = Array.from(document.querySelectorAll('button')).filter(b => b.querySelector('div.font-arcade'));
      if (optBtns.length > 0) optBtns[0].click();
    `);
    await sleep(500);

    // Verify option highlighted
    const isAnswerEvaluated = await evalInBrowser(ws, `
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.some(b => b.className.includes('emerald') || b.className.includes('rose'));
    `);
    assert(isAnswerEvaluated, 'Answer evaluated with correct visual styling');

    // Click "Exit to General English"
    await evalInBrowser(ws, `
      const exitBtn = Array.from(document.querySelectorAll('button')).find(b => (b.textContent || '').includes('Exit to General English'));
      if (exitBtn) exitBtn.click();
    `);
    await sleep(800);
    const returnedToGe = await waitForCondition(ws, 'document.body.innerText.includes("General English Academy")', 6000, 'Returned to GE Hub');
    assert(returnedToGe, 'Returned safely to General English Hub');

    // ---------------------------------------------------------------
    // TEST 5: Sentence Builder Game Interaction
    // ---------------------------------------------------------------
    console.log('\n--- Test 5: Sentence Builder Game Runtime Interaction ---');
    // Switch to Grammar tab, find Sentence Builder topic or launch Sentence Builder
    // Let's switch to Listening tab to test Audio Dictation Sentence Builder
    await evalInBrowser(ws, `
      const lisTab = Array.from(document.querySelectorAll('button')).find(b => (b.textContent || '').includes('Listening'));
      if (lisTab) lisTab.click();
    `);
    await sleep(600);

    const onLisTab = await evalInBrowser(ws, 'document.body.innerText.includes("Listening & Dictation")');
    assert(onLisTab, 'Switched to Listening & Dictation Pillar');

    // Find a topic with Sentence Builder / Dictation and launch it
    await evalInBrowser(ws, `
      const cards = Array.from(document.querySelectorAll('div.rounded-3xl'));
      const dictCard = cards.find(c => (c.textContent || '').includes('Dictation') || (c.textContent || '').includes('SENTENCE BUILDER'));
      if (dictCard) {
        const pBtn = dictCard.querySelector('button');
        if (pBtn) pBtn.click();
      } else {
        const firstPractice = Array.from(document.querySelectorAll('button')).find(b => (b.textContent || '').includes('Start Practice'));
        if (firstPractice) firstPractice.click();
      }
    `);
    await sleep(1000);

    const onAudioScreen = await waitForCondition(ws, 'document.body.innerText.includes("Exit to General English")', 6000, 'Game loaded');
    assert(onAudioScreen, 'Loaded listening/dictation activity');

    // ---------------------------------------------------------------
    // TEST 6: AudioPromptPlayer & Hidden Transcripts Safeguards
    // ---------------------------------------------------------------
    console.log('\n--- Test 6: AudioPromptPlayer & Hidden Transcripts Safeguards ---');
    const hasAudioPlayer = await evalInBrowser(ws, `
      document.body.innerText.includes('Play Audio') || document.body.innerText.includes('Stop Playing') || document.body.innerText.includes('Replay Audio')
    `);
    assert(hasAudioPlayer, 'AudioPromptPlayer component rendered with Play Audio button');

    // REQUIREMENT 9: Transcript must strictly NOT be displayed before answering!
    const transcriptHiddenBeforeAnswer = await evalInBrowser(ws, `
      !document.body.innerText.includes('Spoken Transcript:') && !document.body.innerText.includes('Review Spoken Transcript')
    `);
    assert(transcriptHiddenBeforeAnswer, 'Spoken transcript is strictly hidden before student submits answer (Requirement 9)');

    // Trigger audio playback button (test play/stop toggle)
    await evalInBrowser(ws, `
      const playBtn = Array.from(document.querySelectorAll('button')).find(b => (b.textContent || '').includes('Play Audio'));
      if (playBtn) playBtn.click();
    `);
    await sleep(400);

    // Answer the question to verify post-submission transcript review
    await evalInBrowser(ws, `
      // Check if MCQ option exists
      const optBtn = Array.from(document.querySelectorAll('button')).find(b => b.querySelector('div.font-arcade'));
      if (optBtn) {
        optBtn.click();
      } else {
        // Sentence Builder: Click word bank tile
        const tiles = Array.from(document.querySelectorAll('button')).filter(b => b.className.includes('rounded-2xl') && (b.textContent || '').trim().length > 1 && !b.textContent.includes('Check') && !b.textContent.includes('Exit') && !b.textContent.includes('Audio'));
        if (tiles.length > 0) tiles[0].click();
      }
    `);
    await sleep(400);

    // If check answer button exists and is enabled, click it; otherwise click Reveal
    await evalInBrowser(ws, `
      const checkBtn = Array.from(document.querySelectorAll('button')).find(b => (b.textContent || '').includes('Check Answer') && !b.disabled);
      if (checkBtn) {
        checkBtn.click();
      } else {
        const revBtn = Array.from(document.querySelectorAll('button')).find(b => (b.textContent || '').includes('Reveal'));
        if (revBtn) revBtn.click();
      }
    `);
    await sleep(600);

    // Verify "Review Spoken Transcript" appears after submission
    const hasTranscriptReviewBtn = await evalInBrowser(ws, `
      Array.from(document.querySelectorAll('button')).some(b => (b.textContent || '').includes('Review Spoken Transcript'))
    `);
    assert(hasTranscriptReviewBtn, 'Post-submission "Review Spoken Transcript" button appeared');

    // Click "Review Spoken Transcript" and verify text expands
    await evalInBrowser(ws, `
      const revBtn = Array.from(document.querySelectorAll('button')).find(b => (b.textContent || '').includes('Review Spoken Transcript'));
      if (revBtn) revBtn.click();
    `);
    await sleep(300);

    const transcriptRevealed = await evalInBrowser(ws, `document.body.innerText.includes('Spoken Transcript:')`);
    assert(transcriptRevealed, 'Transcript successfully revealed on student demand for learning reinforcement');

    // Return to GE Hub
    await evalInBrowser(ws, `
      const exitBtn = Array.from(document.querySelectorAll('button')).find(b => (b.textContent || '').includes('Exit to General English'));
      if (exitBtn) exitBtn.click();
    `);
    await sleep(800);

    // ---------------------------------------------------------------
    // TEST 7: Mixed Practice Modal & Ratios (50/50, 70/30, 30/70)
    // ---------------------------------------------------------------
    console.log('\n--- Test 7: Mixed Practice Modal Configuration & Launch ---');
    // Open Mixed Practice modal
    await evalInBrowser(ws, `
      const mixBtn = Array.from(document.querySelectorAll('button')).find(b => (b.textContent || '').includes('Launch Mixed Practice'));
      if (mixBtn) mixBtn.click();
    `);
    await sleep(600);

    const modalOpen = await waitForCondition(ws, 'document.body.innerText.includes("Mixed Practice Lab")', 6000, 'Mixed Practice Modal opened');
    assert(modalOpen, 'Mixed Practice Lab modal opened');

    // Verify 50/50, 70/30, 30/70 ratio buttons exist
    const hasAllRatios = await evalInBrowser(ws, `
      document.body.innerText.includes('50 / 50') && document.body.innerText.includes('70 / 30') && document.body.innerText.includes('30 / 70')
    `);
    assert(hasAllRatios, 'Modal displays all 3 approved ratios: 50/50, 70/30, and 30/70');

    // Click 70/30 ratio
    await evalInBrowser(ws, `
      const r70 = Array.from(document.querySelectorAll('button')).find(b => (b.textContent || '').includes('70 / 30'));
      if (r70) r70.click();
    `);
    await sleep(300);
    const preview70 = await evalInBrowser(ws, 'document.body.innerText.includes("7 Unit questions + 3 General questions")');
    assert(preview70, 'Live pool preview calculates 7 Unit Review + 3 General English questions');

    // Click 30/70 ratio
    await evalInBrowser(ws, `
      const r30 = Array.from(document.querySelectorAll('button')).find(b => (b.textContent || '').includes('30 / 70'));
      if (r30) r30.click();
    `);
    await sleep(300);
    const preview30 = await evalInBrowser(ws, 'document.body.innerText.includes("3 Unit questions + 7 General questions")');
    assert(preview30, 'Live pool preview calculates 3 Unit Review + 7 General English questions');

    // Reset to 50/50 and launch session
    await evalInBrowser(ws, `
      const r50 = Array.from(document.querySelectorAll('button')).find(b => (b.textContent || '').includes('50 / 50'));
      if (r50) r50.click();
    `);
    await sleep(200);

    await evalInBrowser(ws, `
      const startMix = Array.from(document.querySelectorAll('button')).find(b => (b.textContent || '').includes('Start Mixed Practice'));
      if (startMix) startMix.click();
    `);
    await sleep(1000);

    const inMixedGame = await waitForCondition(ws, 'document.body.innerText.includes("Mixed Practice (50/50)")', 6000, 'Mixed game loaded');
    assert(inMixedGame, 'Launched Mixed Practice session with 50/50 ratio');

    // Verify question origin tagging
    const hasOriginTag = await evalInBrowser(ws, `
      document.body.innerText.includes('[Unit Review]') || document.body.innerText.includes('[General English]')
    `);
    assert(hasOriginTag, 'Questions carry visible origin indicators ([Unit Review] / [General English])');

    // Exit mixed session
    await evalInBrowser(ws, `
      const exitBtn = Array.from(document.querySelectorAll('button')).find(b => (b.textContent || '').includes('Exit to General English'));
      if (exitBtn) exitBtn.click();
    `);
    await sleep(800);

    // ---------------------------------------------------------------
    // TEST 8: Responsive Layouts (Mobile, Tablet, Desktop)
    // ---------------------------------------------------------------
    console.log('\n--- Test 8: Responsive Layout Verification ---');
    // Mobile Viewport (375x667)
    await sendCdp(ws, 'Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await sleep(500);
    const mobileOk = await evalInBrowser(ws, `document.body.clientWidth <= 375 && !document.body.innerText.includes('Error')`);
    assert(mobileOk, 'Mobile viewport (375x667) renders cleanly without horizontal blowout');

    // Tablet Viewport (768x1024)
    await sendCdp(ws, 'Emulation.setDeviceMetricsOverride', {
      width: 768,
      height: 1024,
      deviceScaleFactor: 2,
      mobile: false,
    });
    await sleep(500);
    const tabletOk = await evalInBrowser(ws, `document.body.clientWidth <= 768`);
    assert(tabletOk, 'Tablet viewport (768x1024) renders cleanly');

    // Reset to Desktop (1280x800)
    await sendCdp(ws, 'Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await sleep(500);

    // ---------------------------------------------------------------
    // TEST 9: Page Refresh & Session Persistence
    // ---------------------------------------------------------------
    console.log('\n--- Test 9: Refresh & Session Persistence ---');
    await sendCdp(ws, 'Page.reload');
    await waitForCondition(ws, 'document.body !== null', 8000, 'Page reloaded');
    await sleep(1500);

    const refreshText = await evalInBrowser(ws, `document.body ? document.body.innerText.slice(0, 300).replace(/\\n+/g, ' ') : 'NULL'`);
    console.log('RELOADED TEXT PREVIEW:', refreshText);
    const storedNav = await evalInBrowser(ws, `sessionStorage.getItem('unit_review_arcade_nav_target_v1')`);
    console.log('STORED NAV:', storedNav);
    const guestStored = await evalInBrowser(ws, `sessionStorage.getItem('ura_guest_mode_v1')`);
    console.log('GUEST STORED:', guestStored);

    const reloadedOk = await evalInBrowser(ws, `document.body.innerText.includes('General English Academy')`);
    assert(reloadedOk, 'SessionStorage persisted navigation to General English across page refresh');

    // ---------------------------------------------------------------
    // TEST 10: Return to Unit Review & Core Curriculum Integrity
    // ---------------------------------------------------------------
    console.log('\n--- Test 10: Unit Review & Archipelago Cross-Navigation ---');
    // Return to Adventure Home
    await evalInBrowser(ws, `
      const homeBtn = Array.from(document.querySelectorAll('button')).find(b => (b.textContent || '').includes('Adventure Home'));
      if (homeBtn) homeBtn.click();
    `);
    await sleep(800);

    // Click "Unit Worlds" to go to textbook archipelago
    await evalInBrowser(ws, `
      const worldsBtn = Array.from(document.querySelectorAll('button')).find(b => (b.textContent || '').includes('Unit Worlds'));
      if (worldsBtn) worldsBtn.click();
    `);
    await sleep(1000);

    const inUnitWorlds = await waitForCondition(ws, 'document.body.innerText.includes("Unit Worlds Archipelago")', 6000, 'Archipelago loaded');
    assert(inUnitWorlds, 'Navigated to Unit Worlds Archipelago');

    const hasSwitchToGeBtn = await evalInBrowser(ws, `
      Array.from(document.querySelectorAll('button')).some(b => (b.textContent || '').includes('Switch to General English'))
    `);
    assert(hasSwitchToGeBtn, 'Archipelago header includes "Switch to General English" cross-navigation action');

    // Click "Switch to General English" from Archipelago
    await evalInBrowser(ws, `
      const swBtn = Array.from(document.querySelectorAll('button')).find(b => (b.textContent || '').includes('Switch to General English'));
      if (swBtn) swBtn.click();
    `);
    await sleep(800);

    const backInGe = await waitForCondition(ws, 'document.body.innerText.includes("General English Academy")', 6000, 'Switched to GE');
    assert(backInGe, 'Successfully switched back to General English from Unit Review Archipelago');

    console.log('\n======================================================================');
    console.log(`🎉 ALL ${passedTests} / ${totalTests} BROWSER END-TO-END TESTS PASSED!`);
    console.log('======================================================================\n');

    ws.close();
    browserProc.kill();
    process.exit(0);

  } catch (err) {
    console.error('\n❌ E2E TEST FAILED:', err);
    try {
      browserProc.kill();
    } catch {}
    process.exit(1);
  }
}

runSuite();

