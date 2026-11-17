import https from 'https';

console.log('Testing live production assets from https://yusradoyan71-rgb.github.io/unit-review-arcade/ ...\n');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function verifyLive() {
  // 1. Fetch index.html
  const htmlRes = await fetchUrl('https://yusradoyan71-rgb.github.io/unit-review-arcade/');
  console.log(`index.html HTTP Status: ${htmlRes.status}`);
  if (htmlRes.status !== 200) throw new Error('Failed to fetch index.html');

  const jsMatch = htmlRes.data.match(/src=["']\.\/assets\/(index-[^"']+\.js)["']/);
  const cssMatch = htmlRes.data.match(/href=["']\.\/assets\/(index-[^"']+\.css)["']/);

  if (!jsMatch || !cssMatch) {
    throw new Error('Could not find JS or CSS asset in production index.html');
  }

  const jsAsset = jsMatch[1];
  const cssAsset = cssMatch[1];
  console.log(`Live JS Bundle: ${jsAsset}`);
  console.log(`Live CSS Bundle: ${cssAsset}`);

  // 2. Fetch live JS bundle
  const jsUrl = `https://yusradoyan71-rgb.github.io/unit-review-arcade/assets/${jsAsset}`;
  const jsRes = await fetchUrl(jsUrl);
  console.log(`Live JS Bundle HTTP Status: ${jsRes.status} (Size: ${jsRes.data.length.toLocaleString()} bytes)`);
  if (jsRes.status !== 200) throw new Error('Failed to fetch live JS bundle');

  const bundle = jsRes.data;

  // 3. Verifications
  const checks = [
    { name: 'Contains Memory Match Game ID', pass: bundle.includes('memory_match') },
    { name: 'Contains Memory Match Title', pass: bundle.includes('Memory Match') },
    { name: 'Contains Wordle English', pass: bundle.includes('wordle_english') },
    { name: 'Contains Word Connect', pass: bundle.includes('word_connect') },
    { name: 'Contains Grammar Basketball', pass: bundle.includes('grammar_basketball') },
    { name: 'Contains Vocabulary Invaders', pass: bundle.includes('vocabulary_invaders') },
    { name: 'Contains Word Ninja', pass: bundle.includes('word_ninja') },
    { name: 'Contains Word Fishing', pass: bundle.includes('word_fishing') },
    { name: 'Contains Grammar Runner', pass: bundle.includes('grammar_runner') },
    { name: 'Contains Sentence Tower', pass: bundle.includes('sentence_tower') },
    { name: 'Contains Simplified Supernova Prompt', pass: bundle.includes('bright explosion of a dying giant star') },
    { name: 'Contains Simplified Poachers Prompt', pass: bundle.includes('Blast illegal hunters who catch protected wild animals') },
    { name: 'Contains Redesigned Word Connect BEACHES', pass: bundle.includes('BEACHES') },
    { name: 'Contains Redesigned Word Connect DAMAGES', pass: bundle.includes('DAMAGES') },
    { name: 'Zero Occurrences of Inappropriate Word "RUM"', pass: !bundle.includes('"RUM"') },
    { name: 'Zero Occurrences of Inappropriate Word "FOOL"', pass: !bundle.includes('"FOOL"') },
    { name: 'Contains Fisher-Yates Shuffle Algorithm', pass: bundle.includes('fisherYatesShuffle') || bundle.includes('shuffleQuestionOptions') || bundle.includes('Math.floor(Math.random()') },
    { name: 'Contains Teacher Dashboard', pass: bundle.includes('Teacher Dashboard') || bundle.includes('TeacherPanelModal') },
    { name: 'Contains Grade 7 & Grade 8 Catalog', pass: bundle.includes('grade-7') && bundle.includes('grade-8') },
  ];

  console.log('\n--- VERIFICATION CHECKS ---');
  let passed = 0;
  for (const c of checks) {
    if (c.pass) {
      console.log(`  ✓ ${c.name}`);
      passed++;
    } else {
      console.error(`  ✗ FAILED: ${c.name}`);
    }
  }

  console.log(`\nResult: ${passed} / ${checks.length} checks passed.`);
  if (passed === checks.length) {
    console.log('🎉 LIVE PRODUCTION VERIFICATION SUCCESSFUL!');
  } else {
    throw new Error('Production verification failed some checks');
  }
}

verifyLive().catch(err => {
  console.error('Error during verification:', err);
  process.exit(1);
});

