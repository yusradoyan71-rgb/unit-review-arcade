import fs from 'fs';
import path from 'path';

const jargon = [
  'subjunctive', 'correlative', 'stative', 'pluperfect', 'auxiliary carries',
  'infinitive of purpose', 'conjunction of', 'bare infinitive', 'gerund of',
  'habitual aspect', 'epistemic', 'modal of deduction', 'participle clause',
  'catastrophic', 'preoccupation', 'luminous', 'tedious', 'monotonous'
];

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const j of jargon) {
      if (line.toLowerCase().includes(j)) {
        let id = 'unknown';
        for (let k = Math.max(0, i - 15); k <= i; k++) {
          const m = lines[k].match(/["']id["']:\s*["']([^"']+)["']/);
          if (m) id = m[1];
        }
        console.log(`File: ${filePath} | ID: ${id} | Jargon: '${j}'`);
        console.log(`  Line ${i + 1}: ${line.trim()}`);
      }
    }
  }
}

function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (!full.includes('gamesZone')) {
        walk(full);
      }
    } else if (full.endsWith('.ts')) {
      scanFile(full);
    }
  }
}

walk('./src/data');

