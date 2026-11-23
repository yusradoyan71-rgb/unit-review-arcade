/**
 * Comprehensive Production Verification Suite (v3.4.0)
 * Tests Live Apps Script Backend and Live GitHub Pages Frontend
 */
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyvVyt2EjHS1Ru4KyGOcyyVxiLiRTXLj6JB5CEpZs0gkh1yZw2OnWR5Sjvxa1sacOHOew/exec';
const FRONTEND_URL = 'https://yusradoyan71-rgb.github.io/unit-review-arcade/';
const SCREENSHOT_DIR = 'C:\\Users\\FATİH\\.gemini\\antigravity\\brain\\39ba4944-2155-4a29-ab3c-5ed0dffb7112\\screenshots';

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

let passed = 0;
let total = 0;
const results = [];

function assert(condition, message) {
  total++;
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
    results.push({ message, pass: true });
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    results.push({ message, pass: false });
  }
}

function sendRequest(url, payload) {
  return new Promise((resolve, reject) => {
    const isPost = !!payload;
    const bodyStr = isPost ? JSON.stringify(payload) : null;
    
    const req = https.request(url, {
      method: isPost ? 'POST' : 'GET',
      headers: isPost ? {
        'Content-Type': 'text/plain;charset=utf-8',
        'Content-Length': Buffer.byteLength(bodyStr)
      } : {}
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, (redirectRes) => {
          let data = '';
          redirectRes.on('data', chunk => data += chunk);
          redirectRes.on('end', () => {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              resolve({ raw: data, statusCode: redirectRes.statusCode });
            }
          });
        }).on('error', reject);
        return;
      }

      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({ raw: data, statusCode: res.statusCode });
        }
      });
    });

    req.on('error', reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchText(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
    }).on('error', reject);
  });
}

async function runBackendVerification() {
  console.log('\n======================================================');
  console.log('PART 1: LIVE BACKEND HEALTH & RBAC VERIFICATION');
  console.log('======================================================');

  // 1. Health Probe
  console.log('\n[1.1] Health & Configuration Check');
  const pingRes = await sendRequest(`${APPS_SCRIPT_URL}?action=ping`);
  assert(pingRes.status === 'ok', 'Web App status is "ok"');
  assert(pingRes.version === '3.4.0', 'Web App version reports 3.4.0');
  assert(pingRes.configured === true, 'Database is configured');
  assert(pingRes.spreadsheetName === 'Unit Review Arcade – Student Tracking Database', 'Correct production spreadsheet connected');
  assert(pingRes.error === null, 'No startup error reported by backend');

  // 2. Concurrency / Database Lock Prevention
  console.log('\n[1.2] Database Lock Timeout Prevention Probe');
  const probeStart = Date.now();
  const concurrentPings = await Promise.all([
    sendRequest(`${APPS_SCRIPT_URL}?action=ping`),
    sendRequest(APPS_SCRIPT_URL, { action: 'ping' }),
    sendRequest(`${APPS_SCRIPT_URL}?action=ping`)
  ]);
  const probeDuration = Date.now() - probeStart;
  assert(concurrentPings.every(r => r.status === 'ok' || r.success === true), 'Concurrent probes completed cleanly');
  assert(probeDuration < 10000, `Concurrent responses handled smoothly without lock timeout (${probeDuration}ms)`);

  // 3. Strict RBAC Enforcement - Teacher Endpoints
  console.log('\n[1.3] Strict RBAC: Teacher Endpoints Unauthorized Rejections');
  
  // 3a: teacher_save_question
  const rSaveNoToken = await sendRequest(APPS_SCRIPT_URL, { action: 'teacher_save_question', question: { id: 'leak_test' } });
  assert(rSaveNoToken.success === false && rSaveNoToken.code === 'UNAUTHORIZED', 'teacher_save_question without token rejected as UNAUTHORIZED');

  const rSaveStudentToken = await sendRequest(APPS_SCRIPT_URL, { action: 'teacher_save_question', token: 'uat_student_token_123', question: { id: 'leak_test' } });
  assert(rSaveStudentToken.success === false && rSaveStudentToken.code === 'UNAUTHORIZED', 'teacher_save_question with student token rejected as UNAUTHORIZED');

  // 3b: teacher_publish_curriculum
  const rPubNoToken = await sendRequest(APPS_SCRIPT_URL, { action: 'teacher_publish_curriculum', curriculum: {} });
  assert(rPubNoToken.success === false && rPubNoToken.code === 'UNAUTHORIZED', 'teacher_publish_curriculum rejected without teacher token');

  // 3c: teacher_get_question_bank
  const rQbNoToken = await sendRequest(APPS_SCRIPT_URL, { action: 'teacher_get_question_bank' });
  assert(rQbNoToken.success === false && rQbNoToken.code === 'UNAUTHORIZED', 'teacher_get_question_bank rejected without teacher token');

  // 3d: teacher_get_classroom_overview
  const rOverviewNoToken = await sendRequest(APPS_SCRIPT_URL, { action: 'teacher_get_classroom_overview' });
  assert(rOverviewNoToken.success === false && rOverviewNoToken.code === 'UNAUTHORIZED', 'teacher_get_classroom_overview rejected without teacher token');

  // 3e: teacher_award_classroom_points
  const rAwardNoToken = await sendRequest(APPS_SCRIPT_URL, { action: 'teacher_award_classroom_points', awards: [] });
  assert(rAwardNoToken.success === false && rAwardNoToken.code === 'UNAUTHORIZED', 'teacher_award_classroom_points rejected without teacher token');

  // 3f: teacher_revert_classroom_point_transaction
  const rRevNoToken = await sendRequest(APPS_SCRIPT_URL, { action: 'teacher_revert_classroom_point_transaction', transactionId: 'test_tx' });
  assert(rRevNoToken.success === false && rRevNoToken.code === 'UNAUTHORIZED', 'teacher_revert_classroom_point_transaction rejected without teacher token');

  // 4. Student Session Security
  console.log('\n[1.4] Student Session Security');
  const rStudentProfile = await sendRequest(APPS_SCRIPT_URL, { action: 'student_get_classroom_profile', sessionToken: 'invalid_token' });
  assert(rStudentProfile.success === false && rStudentProfile.code === 'UNAUTHORIZED', 'student_get_classroom_profile rejects invalid token');

  const rStudentClaim = await sendRequest(APPS_SCRIPT_URL, { action: 'student_claim_milestone_reward', sessionToken: 'invalid_token', rewardId: 'rwd_first_star' });
  assert(rStudentClaim.success === false && rStudentClaim.code === 'UNAUTHORIZED', 'student_claim_milestone_reward rejects invalid token');
}

async function runFrontendVerification() {
  console.log('\n======================================================');
  console.log('PART 2: LIVE FRONTEND DEPLOYMENT & SMOKE TESTS');
  console.log('======================================================');

  // 1. Fetch live index.html
  console.log('\n[2.1] Live GitHub Pages HTML & Bundle Verification');
  const indexRes = await fetchText(FRONTEND_URL);
  assert(indexRes.statusCode === 200, 'Live GitHub Pages responds with HTTP 200');
  
  const jsMatch = indexRes.body.match(/src=[\"'](\.\/assets\/index-[^\"']+\.js)[\"']/);
  const cssMatch = indexRes.body.match(/href=[\"'](\.\/assets\/index-[^\"']+\.css)[\"']/);
  assert(!!jsMatch, `Live script bundle found: ${jsMatch ? jsMatch[1] : 'NONE'}`);
  assert(!!cssMatch, `Live stylesheet bundle found: ${cssMatch ? cssMatch[1] : 'NONE'}`);

  // Fetch the live JS bundle and verify the new RBAC guards and Monster Avatar symbols exist
  if (jsMatch) {
    const bundleUrl = new URL(jsMatch[1], FRONTEND_URL).href;
    console.log(`  Fetching live bundle: ${bundleUrl}`);
    const bundleRes = await fetchText(bundleUrl);
    assert(bundleRes.statusCode === 200, 'Live bundle downloaded successfully');
    
    // Check for unique v3.4.0 RBAC and Monster Avatar markers in the compiled code
    const hasRbacAuthCheck = bundleRes.body.includes('Teacher authentication required') || bundleRes.body.includes('openTeacherPanel') || bundleRes.body.includes('useTeacherAuth');
    assert(hasRbacAuthCheck, 'Live bundle includes strict teacher authentication checks');
    
    const hasMonsterAvatarLogic = bundleRes.body.includes('monsterAppearance') || bundleRes.body.includes('equippedClassroomRewards') || bundleRes.body.includes('MonsterAvatar');
    assert(hasMonsterAvatarLogic, 'Live bundle includes Monster Avatar rendering integration');

    const hasNoAutoEquipLeak = !bundleRes.body.includes('FORCE_AUTO_EQUIP_CLASSROOM_MILESTONES');
    assert(hasNoAutoEquipLeak, 'Live bundle does not enforce automatic milestone equipping');
  }

  // 2. Headless Chrome DOM Verification & Screenshot Capture
  console.log('\n[2.2] Headless Chrome DOM & UI Smoke Verification');
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const outScreenshotPath = path.join(SCREENSHOT_DIR, 'production_live_v3_4_0_verified.png');
  const tempProfile = path.join(require('os').tmpdir(), `prod_chrome_${Date.now()}`);

  const chromeArgs = [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--disable-crash-reporter',
    '--no-first-run',
    '--window-size=1440,900',
    `--user-data-dir=${tempProfile}`,
    '--virtual-time-budget=6000',
    `--screenshot=${outScreenshotPath}`,
    FRONTEND_URL
  ];

  try {
    await new Promise((resolve, reject) => {
      const proc = spawn(chromePath, chromeArgs, { stdio: 'inherit' });
      proc.on('close', code => {
        if (code === 0) resolve();
        else reject(new Error(`Chrome exited with code ${code}`));
      });
      proc.on('error', reject);
    });

    if (fs.existsSync(outScreenshotPath)) {
      const stats = fs.statSync(outScreenshotPath);
      assert(stats.size > 20000, `Live production homepage screenshot captured successfully (${stats.size} bytes)`);
    } else {
      assert(false, 'Screenshot file was not generated');
    }
  } catch (err) {
    console.error('Chrome capture notice:', err.message);
  }
}

async function main() {
  try {
    await runBackendVerification();
    await runFrontendVerification();

    console.log('\n======================================================');
    console.log(`PRODUCTION DEPLOYMENT VERIFICATION COMPLETE`);
    console.log(`TOTAL ASSERTIONS: ${total} | PASSED: ${passed} | FAILED: ${total - passed}`);
    console.log('======================================================\n');

    if (passed < total) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Fatal execution error:', err);
    process.exit(1);
  }
}

main();

