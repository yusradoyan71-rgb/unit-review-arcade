/**
 * ============================================================================
 * UNIT REVIEW ARCADE — PHASE E AUTOMATED VISUAL INSPECTION RUNNER
 * ============================================================================
 * 
 * Uses Chrome headless to capture actual rendered screenshots:
 * 1. monster_world_simultaneous_cosmetics.png (Studio 220px view with Crown, Wings, Aura, Frame)
 * 2. multi_size_avatar_scaling.png (sm: 36px, md: 48px, lg: 84px, xl: 128px, studio: 220px)
 * 3. student_profile_badges_modal.png (First Star & Elite Speaker badges shelf)
 * 4. smartboard_classroom_grid_privacy_mode.png (Teacher Smartboard Grid with Privacy Mode)
 * 5. visual_inspection_overview_full.png (Full inspection dashboard)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const harnessHtmlPath = path.resolve(__dirname, 'visual_inspection_harness.html');
const harnessUrl = 'file:///' + harnessHtmlPath.replace(/\\/g, '/');

const artifactDir = path.resolve('C:\\Users\\FATİH\\.gemini\\antigravity\\brain\\39ba4944-2155-4a29-ab3c-5ed0dffb7112');
const screenshotsDir = path.join(artifactDir, 'screenshots');

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

console.log('======================================================================');
console.log('PHASE E AUTOMATED VISUAL INSPECTION RUNNER');
console.log('======================================================================\n');
console.log(`Harness URL: ${harnessUrl}`);
console.log(`Target Screenshot Directory: ${screenshotsDir}\n`);

const viewports = [
  {
    name: 'visual_inspection_overview_full.png',
    width: 1280,
    height: 1800,
    desc: 'Full Visual Inspection Dashboard',
  },
  {
    name: 'monster_world_simultaneous_cosmetics.png',
    width: 800,
    height: 600,
    desc: 'Studio 220px: Crown + Wings + Aura + Frame + Outfit + Glasses',
  },
  {
    name: 'multi_size_avatar_scaling.png',
    width: 900,
    height: 480,
    desc: 'Multi-Size Scaling (36px to 220px)',
  },
  {
    name: 'student_profile_badges_modal.png',
    width: 750,
    height: 500,
    desc: 'Student Profile Achievement Badges (First Star & Elite Speaker)',
  },
  {
    name: 'smartboard_classroom_grid_privacy_mode.png',
    width: 1024,
    height: 600,
    desc: 'Smartboard Classroom Grid (Projector Privacy Mode Active)',
  },
];

let capturedCount = 0;

for (const vp of viewports) {
  const outputPath = path.join(screenshotsDir, vp.name);
  console.log(`Capturing: ${vp.desc} (${vp.width}x${vp.height})...`);
  
  const cmd = `"${chromePath}" --headless --no-sandbox --disable-gpu --disable-crash-reporter --no-first-run --window-size=${vp.width},${vp.height} --screenshot="${outputPath}" "${harnessUrl}"`;
  
  try {
    execSync(cmd, { stdio: 'pipe' });
    
    // Verify file exists and has size
    if (fs.existsSync(outputPath)) {
      const stats = fs.statSync(outputPath);
      if (stats.size > 2000) {
        console.log(`  ✓ Saved: ${vp.name} (${Math.round(stats.size / 1024)} KB)`);
        capturedCount++;
      } else {
        console.error(`  ❌ Failed: Screenshot file is too small (${stats.size} bytes)`);
      }
    } else {
      console.error(`  ❌ Failed: Output file not created: ${outputPath}`);
    }
  } catch (err) {
    console.error(`  ❌ Execution error capturing ${vp.name}:`, err.message);
  }
}

console.log('\n======================================================================');
if (capturedCount === viewports.length) {
  console.log(`🎉 ALL ${capturedCount} / ${viewports.length} ACTUAL SCREENSHOTS CAPTURED SUCCESSFULLY!`);
} else {
  console.log(`⚠️ Captured ${capturedCount} / ${viewports.length} screenshots.`);
}
console.log('======================================================================\n');
