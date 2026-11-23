/**
 * Production Live Endpoint Smoke Test (v3.4.0)
 * Non-destructive verification against live Google Apps Script endpoint.
 */
const https = require('https');

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyvVyt2EjHS1Ru4KyGOcyyVxiLiRTXLj6JB5CEpZs0gkh1yZw2OnWR5Sjvxa1sacOHOew/exec';

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
      // Handle Google Apps Script 302 redirect
      if (res.statusCode === 302 && res.headers.location) {
        // Follow redirect via GET
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

async function runLiveSmokeTests() {
  console.log('======================================================================');
  console.log('UNIT REVIEW ARCADE v3.4.0 — LIVE PRODUCTION SMOKE TESTS');
  console.log('======================================================================\n');

  let passed = 0;
  let total = 0;

  function assert(cond, msg) {
    total++;
    if (cond) {
      console.log(`  ✓ ${msg}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${msg}`);
      process.exitCode = 1;
    }
  }

  // 1. Health & Ping
  console.log('--- 1. Live Web App Health & Version Probe ---');
  const pingRes = await sendRequest(`${APPS_SCRIPT_URL}?action=ping`);
  assert(pingRes.status === 'ok', 'Web App status is "ok"');
  assert(pingRes.version === '3.4.0', 'Web App version is "3.4.0"');
  assert(pingRes.configured === true, 'Spreadsheet is configured');
  assert(pingRes.spreadsheetName === 'Unit Review Arcade – Student Tracking Database', 'Target spreadsheet is correctly connected');

  // 2. Student Security & Session Isolation
  console.log('\n--- 2. Student Security & Token Validation ---');
  const studentProfileRes = await sendRequest(APPS_SCRIPT_URL, {
    action: 'student_get_classroom_profile',
    sessionToken: 'invalid_smoke_token'
  });
  assert(studentProfileRes.success === false, 'Rejects invalid student session token');
  assert(studentProfileRes.code === 'UNAUTHORIZED', 'Returns code UNAUTHORIZED');

  const studentClaimRes = await sendRequest(APPS_SCRIPT_URL, {
    action: 'student_claim_milestone_reward',
    sessionToken: 'invalid_smoke_token',
    rewardId: 'rwd_first_star'
  });
  assert(studentClaimRes.success === false, 'Rejects unauthorized reward claim');
  assert(studentClaimRes.code === 'UNAUTHORIZED', 'Returns code UNAUTHORIZED');

  // 3. Teacher Security & Master Token Protection
  console.log('\n--- 3. Teacher Security & Master Authorization ---');
  const teacherOverviewRes = await sendRequest(APPS_SCRIPT_URL, {
    action: 'teacher_get_classroom_overview',
    teacherToken: 'invalid_smoke_token',
    className: '7A'
  });
  assert(teacherOverviewRes.success === false, 'Rejects unauthorized classroom overview query');
  assert(teacherOverviewRes.code === 'UNAUTHORIZED', 'Returns code UNAUTHORIZED');

  const teacherAwardRes = await sendRequest(APPS_SCRIPT_URL, {
    action: 'teacher_award_classroom_points',
    teacherToken: 'invalid_smoke_token',
    awards: [{ studentNumber: '701', categoryId: 'cat_speaking', grossPoints: 2 }]
  });
  assert(teacherAwardRes.success === false, 'Rejects unauthorized point award');
  assert(teacherAwardRes.code === 'UNAUTHORIZED', 'Returns code UNAUTHORIZED');

  const teacherRevertRes = await sendRequest(APPS_SCRIPT_URL, {
    action: 'teacher_revert_classroom_point_transaction',
    teacherToken: 'invalid_smoke_token',
    transactionId: 'tx_smoke_test'
  });
  assert(teacherRevertRes.success === false, 'Rejects unauthorized transaction reversal');
  assert(teacherRevertRes.code === 'UNAUTHORIZED', 'Returns code UNAUTHORIZED');

  // 4. Backward Compatibility on Legacy Endpoints
  console.log('\n--- 4. Backward Compatibility with Existing Endpoints ---');
  const studentCheckRes = await sendRequest(APPS_SCRIPT_URL, {
    action: 'student_session_check',
    sessionToken: 'invalid_smoke_token'
  });
  assert(studentCheckRes.success === false, 'Legacy session check responds cleanly');
  assert(studentCheckRes.code === 'UNAUTHORIZED', 'Returns expected code UNAUTHORIZED');

  const teacherOverviewLegacyRes = await sendRequest(APPS_SCRIPT_URL, {
    action: 'teacher_get_overview',
    teacherToken: 'invalid_smoke_token'
  });
  assert(teacherOverviewLegacyRes.success === false, 'Legacy teacher analytics endpoint protected');
  assert(teacherOverviewLegacyRes.code === 'UNAUTHORIZED', 'Returns expected code UNAUTHORIZED');

  console.log('\n======================================================================');
  console.log(`SMOKE TEST RESULTS: ${passed} / ${total} ASSERTIONS PASSED`);
  console.log('======================================================================\n');
}

runLiveSmokeTests().catch(err => {
  console.error('Fatal smoke test error:', err);
  process.exit(1);
});

