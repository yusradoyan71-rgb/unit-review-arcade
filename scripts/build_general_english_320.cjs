/**
 * BUILDER SCRIPT FOR MILESTONE 3.5: 320 GENERAL ENGLISH STARTER QUESTIONS
 * Generates all modular TypeScript files, JSON datasets, and CSV export.
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = path.resolve(__dirname, '../src/data/generalEnglish');
fs.mkdirSync(path.join(BASE_DIR, 'grade7'), { recursive: true });
fs.mkdirSync(path.join(BASE_DIR, 'grade8'), { recursive: true });

console.log('Generating General English starter content...');

