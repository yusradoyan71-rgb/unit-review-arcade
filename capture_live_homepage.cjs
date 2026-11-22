const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const targetUrl = 'https://yusradoyan71-rgb.github.io/unit-review-arcade/';
const screenshotsDir = 'C:\\Users\\FATİH\\.gemini\\antigravity\\brain\\39ba4944-2155-4a29-ab3c-5ed0dffb7112\\screenshots';
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}
const outputPath = path.join(screenshotsDir, 'production_live_homepage.png');

console.log('Capturing live homepage screenshot from:', targetUrl);
console.log('Output target:', outputPath);

const cmd = `"${chromePath}" --headless --no-sandbox --disable-gpu --disable-crash-reporter --no-first-run --window-size=1280,800 --virtual-time-budget=8000 --screenshot="${outputPath}" "${targetUrl}"`;

try {
  execSync(cmd, { stdio: 'inherit' });
  if (fs.existsSync(outputPath)) {
    const stats = fs.statSync(outputPath);
    console.log(`✅ Success! Screenshot saved: ${stats.size} bytes`);
  } else {
    console.error('❌ File does not exist after execution.');
  }
} catch (err) {
  console.error('Execution error:', err.message);
}
