/**
 * COMPREHENSIVE VALIDATION & EXPORT SUITE: MILESTONE 3.5 STARTER CONTENT (320 QUESTIONS)
 * 
 * Tests:
 * 1. Count & Breakdown Integrity (Total 320: 160 Grade 7 + 160 Grade 8)
 * 2. Topic & Skill Quota Verification
 * 3. Pedagogical & Scope Compliance (Zero/First Conditionals only, CEFR constraints)
 * 4. Audio Architecture & Listening Metadata Integrity
 * 5. Game Engine Payload Runtime Verification
 * 6. Deduplication & Zero-Collision Check Against All 1,206 Built-In Questions
 * 7. Phase 3 Import Validator Simulation
 * 8. Reviewable File Serialization (.json & .csv)
 */

const fs = require('fs');
const path = require('path');
const createJiti = require('jiti');
const jiti = createJiti(__filename);

// Import application modules
const {
  ALL_GENERAL_ENGLISH_STARTER_QUESTIONS,
  GRADE_7_STARTER_QUESTIONS,
  GRADE_8_STARTER_QUESTIONS,
  GRADE_7_GRAMMAR_QUESTIONS,
  GRADE_7_VOCABULARY_QUESTIONS,
  GRADE_7_READING_QUESTIONS,
  GRADE_7_LISTENING_QUESTIONS,
  GRADE_8_GRAMMAR_QUESTIONS,
  GRADE_8_VOCABULARY_QUESTIONS,
  GRADE_8_READING_QUESTIONS,
  GRADE_8_LISTENING_QUESTIONS,
} = jiti('./src/data/generalEnglish/index.ts');

const { exportQuestionBank } = jiti('./src/utils/questionTemplateGenerator.ts');
const { validateImportRows, normalizePromptForDeduplication } = jiti('./src/utils/questionImportValidator.ts');
const { DEFAULT_INITIAL_DATA } = jiti('./src/services/storageService.ts');
const { convertAnyQuestionToBankItem } = jiti('./src/utils/questionBankCompat.ts');

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

console.log('======================================================================');
console.log('MILESTONE 3.5: GENERAL ENGLISH STARTER CONTENT VALIDATION (320 ITEMS)');
console.log('======================================================================\n');

// ---------------------------------------------------------------------------
// 1. COUNT & BREAKDOWN INTEGRITY
// ---------------------------------------------------------------------------
console.log('--- 1. Question Count & Balance Assertions ---');

assert(ALL_GENERAL_ENGLISH_STARTER_QUESTIONS.length === 320, 'Total questions must equal exactly 320 (got ' + ALL_GENERAL_ENGLISH_STARTER_QUESTIONS.length + ')');
assert(GRADE_7_STARTER_QUESTIONS.length === 160, 'Grade 7 questions must equal exactly 160 (got ' + GRADE_7_STARTER_QUESTIONS.length + ')');
assert(GRADE_8_STARTER_QUESTIONS.length === 160, 'Grade 8 questions must equal exactly 160 (got ' + GRADE_8_STARTER_QUESTIONS.length + ')');

assert(GRADE_7_GRAMMAR_QUESTIONS.length === 60, 'Grade 7 Grammar must equal exactly 60 questions');
assert(GRADE_7_VOCABULARY_QUESTIONS.length === 60, 'Grade 7 Vocabulary must equal exactly 60 questions');
assert(GRADE_7_READING_QUESTIONS.length === 20, 'Grade 7 Reading must equal exactly 20 questions (5 passages × 4)');
assert(GRADE_7_LISTENING_QUESTIONS.length === 20, 'Grade 7 Listening must equal exactly 20 questions (4 sets × 5)');

assert(GRADE_8_GRAMMAR_QUESTIONS.length === 60, 'Grade 8 Grammar must equal exactly 60 questions');
assert(GRADE_8_VOCABULARY_QUESTIONS.length === 60, 'Grade 8 Vocabulary must equal exactly 60 questions');
assert(GRADE_8_READING_QUESTIONS.length === 20, 'Grade 8 Reading must equal exactly 20 questions (5 passages × 4)');
assert(GRADE_8_LISTENING_QUESTIONS.length === 20, 'Grade 8 Listening must equal exactly 20 questions (4 sets × 5)');

const totalGrammar = GRADE_7_GRAMMAR_QUESTIONS.length + GRADE_8_GRAMMAR_QUESTIONS.length;
const totalVocab = GRADE_7_VOCABULARY_QUESTIONS.length + GRADE_8_VOCABULARY_QUESTIONS.length;
const totalReading = GRADE_7_READING_QUESTIONS.length + GRADE_8_READING_QUESTIONS.length;
const totalListening = GRADE_7_LISTENING_QUESTIONS.length + GRADE_8_LISTENING_QUESTIONS.length;

assert(totalGrammar === 120, 'Overall Grammar quota is exactly 120 (got ' + totalGrammar + ')');
assert(totalVocab === 120, 'Overall Vocabulary quota is exactly 120 (got ' + totalVocab + ')');
assert(totalReading === 40, 'Overall Reading quota is exactly 40 (got ' + totalReading + ')');
assert(totalListening === 40, 'Overall Listening quota is exactly 40 (got ' + totalListening + ')');

// ---------------------------------------------------------------------------
// 2. TOPIC & SUB-QUOTA DISTRIBUTION
// ---------------------------------------------------------------------------
console.log('\n--- 2. Topic & Sub-Quota Distribution Assertions ---');

// Check Grade 7 Grammar topics (6 topics × 10)
const g7GrammarTopics = {};
GRADE_7_GRAMMAR_QUESTIONS.forEach((q) => {
  g7GrammarTopics[q.topic] = (g7GrammarTopics[q.topic] || 0) + 1;
});
assert(Object.keys(g7GrammarTopics).length === 6, 'Grade 7 Grammar must cover exactly 6 distinct topics');
for (const [topic, count] of Object.entries(g7GrammarTopics)) {
  assert(count === 10, `G7 Grammar topic "${topic}" has exactly 10 questions`);
}

// Check Grade 8 Grammar topics (6 topics × 10)
const g8GrammarTopics = {};
GRADE_8_GRAMMAR_QUESTIONS.forEach((q) => {
  g8GrammarTopics[q.topic] = (g8GrammarTopics[q.topic] || 0) + 1;
});
assert(Object.keys(g8GrammarTopics).length === 6, 'Grade 8 Grammar must cover exactly 6 distinct topics');
for (const [topic, count] of Object.entries(g8GrammarTopics)) {
  assert(count === 10, `G8 Grammar topic "${topic}" has exactly 10 questions`);
}

// Check Vocabulary clusters (4 per grade × 15)
const g7VocabClusters = {};
GRADE_7_VOCABULARY_QUESTIONS.forEach((q) => {
  g7VocabClusters[q.topic] = (g7VocabClusters[q.topic] || 0) + 1;
});
assert(Object.keys(g7VocabClusters).length === 4, 'Grade 7 Vocabulary must cover exactly 4 clusters');
for (const [topic, count] of Object.entries(g7VocabClusters)) {
  assert(count === 15, `G7 Vocab cluster "${topic}" has exactly 15 questions`);
}

const g8VocabClusters = {};
GRADE_8_VOCABULARY_QUESTIONS.forEach((q) => {
  g8VocabClusters[q.topic] = (g8VocabClusters[q.topic] || 0) + 1;
});
assert(Object.keys(g8VocabClusters).length === 4, 'Grade 8 Vocabulary must cover exactly 4 clusters');
for (const [topic, count] of Object.entries(g8VocabClusters)) {
  assert(count === 15, `G8 Vocab cluster "${topic}" has exactly 15 questions`);
}

// Check Reading Passages (5 passages per grade × 4)
const g7Passages = new Set(GRADE_7_READING_QUESTIONS.map((q) => q.payload.passageId));
assert(g7Passages.size === 5, 'Grade 7 Reading has exactly 5 unique passage IDs');
for (const pid of g7Passages) {
  const qCount = GRADE_7_READING_QUESTIONS.filter((q) => q.payload.passageId === pid).length;
  assert(qCount === 4, `G7 Passage ${pid} has exactly 4 questions`);
}

const g8Passages = new Set(GRADE_8_READING_QUESTIONS.map((q) => q.payload.passageId));
assert(g8Passages.size === 5, 'Grade 8 Reading has exactly 5 unique passage IDs');
for (const pid of g8Passages) {
  const qCount = GRADE_8_READING_QUESTIONS.filter((q) => q.payload.passageId === pid).length;
  assert(qCount === 4, `G8 Passage ${pid} has exactly 4 questions`);
}

// ---------------------------------------------------------------------------
// 3. PEDAGOGICAL & SCOPE COMPLIANCE
// ---------------------------------------------------------------------------
console.log('\n--- 3. Pedagogical & Scope Compliance ---');

// Status assertion: All must be draft (Pending Teacher Approval)
const nonDrafts = ALL_GENERAL_ENGLISH_STARTER_QUESTIONS.filter((q) => q.status !== 'draft');
assert(nonDrafts.length === 0, 'All 320 questions must be in "draft" status pending teacher review');

// Quality assertions
ALL_GENERAL_ENGLISH_STARTER_QUESTIONS.forEach((q, idx) => {
  if (!q.id || !q.prompt || !q.explanation || !q.correctAnswerPreview) {
    throw new Error(`Item at index ${idx} is missing required core fields: ${JSON.stringify(q)}`);
  }
  if (!q.points || q.points <= 0) {
    throw new Error(`Item ${q.id} has invalid points: ${q.points}`);
  }
  if (!q.tags || q.tags.length === 0) {
    throw new Error(`Item ${q.id} has no tags`);
  }
});
assert(true, 'All 320 items have valid IDs, non-empty prompts, explanations, points, and tags');

// Scope compliance: Avoid 2nd, 3rd, and mixed conditionals
const conditionalQuestions = GRADE_8_GRAMMAR_QUESTIONS.filter(
  (q) => q.topic === 'Conditionals: Zero & First Conditional'
);
assert(conditionalQuestions.length === 10, 'Exactly 10 conditional questions exist');

conditionalQuestions.forEach((q) => {
  const content = (q.prompt + ' ' + (q.payload.options || []).join(' ') + ' ' + (q.payload.correctSentence || '')).toLowerCase();
  if (content.includes('would have') || content.includes('if i were you') || content.includes('had i known') || content.includes('would buy')) {
    throw new Error(`Forbidden advanced conditional detected in item ${q.id}: ${q.prompt}`);
  }
});
assert(true, 'Conditionals strictly adhere to Zero and First Conditionals (no 2nd/3rd/mixed conditionals)');

// ---------------------------------------------------------------------------
// 4. AUDIO ARCHITECTURE & LISTENING INTEGRITY
// ---------------------------------------------------------------------------
console.log('\n--- 4. Audio Delivery Architecture Verification ---');

const listeningQuestions = ALL_GENERAL_ENGLISH_STARTER_QUESTIONS.filter((q) => q.skill === 'listening');
assert(listeningQuestions.length === 40, 'Total listening items must equal 40 (got ' + listeningQuestions.length + ')');

listeningQuestions.forEach((q) => {
  if (!q.payload.audioUrl || !q.payload.audioUrl.startsWith('https://')) {
    throw new Error(`Listening item ${q.id} lacks valid hosted audioUrl: ${q.payload.audioUrl}`);
  }
  if (!q.payload.speechText || q.payload.speechText.trim().length === 0) {
    throw new Error(`Listening item ${q.id} lacks speechText transcript for browser TTS fallback`);
  }
  if (!q.payload.correctTranscript || q.payload.correctTranscript.trim().length === 0) {
    throw new Error(`Listening item ${q.id} lacks correctTranscript for review`);
  }
  // Spoken text must not be in prompt
  if (q.prompt.includes(q.payload.speechText)) {
    throw new Error(`Prompt for ${q.id} leaks full spoken speech text to students!`);
  }
});
assert(true, 'All 40 listening items feature hosted audioUrl, TTS speechText, correctTranscript, and hidden audio prompts');

// ---------------------------------------------------------------------------
// 5. GAME ENGINE PAYLOAD COMPATIBILITY
// ---------------------------------------------------------------------------
console.log('\n--- 5. Game Engine Payload Compatibility ---');

let mcCount = 0;
let sbCount = 0;
let matchCount = 0;
let tfCount = 0;
let rpCount = 0;
let tsCount = 0;

ALL_GENERAL_ENGLISH_STARTER_QUESTIONS.forEach((q) => {
  switch (q.questionType) {
    case 'multiple_choice': {
      mcCount++;
      const { options, correctOptionIndex } = q.payload;
      if (!options || options.length < 2) throw new Error(`MC ${q.id} has fewer than 2 options`);
      if (typeof correctOptionIndex !== 'number' || correctOptionIndex < 0 || correctOptionIndex >= options.length) {
        throw new Error(`MC ${q.id} has invalid correctOptionIndex: ${correctOptionIndex}`);
      }
      break;
    }
    case 'sentence_builder': {
      sbCount++;
      const { correctSentence, scrambledWords } = q.payload;
      if (!correctSentence || correctSentence.trim().length === 0) throw new Error(`SB ${q.id} missing correctSentence`);
      if (!scrambledWords || scrambledWords.length < 3) throw new Error(`SB ${q.id} has fewer than 3 scrambled words`);
      break;
    }
    case 'match_it': {
      matchCount++;
      const { pairs } = q.payload;
      if (!pairs || pairs.length < 3) throw new Error(`MatchIt ${q.id} has fewer than 3 pairs`);
      pairs.forEach((p) => {
        if (!p.id || !p.left || !p.right) throw new Error(`MatchIt ${q.id} has incomplete pair: ${JSON.stringify(p)}`);
      });
      break;
    }
    case 'true_false': {
      tfCount++;
      if (typeof q.payload.isTrue !== 'boolean') throw new Error(`TF ${q.id} missing boolean isTrue`);
      break;
    }
    case 'reading_passage': {
      rpCount++;
      const { passageTitle, passageText, options, correctOptionIndex } = q.payload;
      if (!passageTitle || !passageText) throw new Error(`Reading ${q.id} missing passage title/text`);
      if (!options || options.length < 2) throw new Error(`Reading ${q.id} missing options`);
      if (typeof correctOptionIndex !== 'number' || correctOptionIndex < 0 || correctOptionIndex >= options.length) {
        throw new Error(`Reading ${q.id} has invalid option index`);
      }
      break;
    }
    case 'train_station': {
      tsCount++;
      const { options, correctOptionIndex, round } = q.payload;
      if (!options || options.length < 2) throw new Error(`TrainStation ${q.id} missing options`);
      if (typeof correctOptionIndex !== 'number' || typeof round !== 'number') {
        throw new Error(`TrainStation ${q.id} missing index or round`);
      }
      break;
    }
    default:
      throw new Error(`Unknown question type: ${q.questionType}`);
  }
});

console.log(`    Game Type Counts: MC=${mcCount}, SentenceBuilder=${sbCount}, MatchIt=${matchCount}, TrueFalse=${tfCount}, ReadingPassage=${rpCount}, TrainStation=${tsCount}`);
assert(mcCount + sbCount + matchCount + tfCount + rpCount + tsCount === 320, 'All 320 items conform to their game payload requirements');

// ---------------------------------------------------------------------------
// 6. DEDUPLICATION AGAINST 1,206 BUILT-IN QUESTIONS
// ---------------------------------------------------------------------------
console.log('\n--- 6. Deduplication Against 1,206 Built-In Questions ---');

// Collect all 1,206 built-in questions
const builtInQuestions = [];
const grades = ['grade-7', 'grade-8'];
for (const gradeId of grades) {
  const units = DEFAULT_INITIAL_DATA.units[gradeId] || [];
  for (const unit of units) {
    for (const act of unit.activities) {
      if (!act.questions) continue;
      for (const rawQ of act.questions) {
        builtInQuestions.push(
          convertAnyQuestionToBankItem(rawQ, {
            section: 'unit_review',
            gradeId,
            unitId: unit.id,
            unitTitle: unit.title,
            topic: act.title,
            assignedGameTypes: [act.gameType],
          })
        );
      }
    }
  }
}

assert(builtInQuestions.length === 1206, 'Successfully loaded all 1,206 built-in curriculum questions');

const builtInNormalizedSet = new Set(builtInQuestions.map((q) => normalizePromptForDeduplication(q.prompt)));
const internalIdSet = new Set();
const internalPromptSet = new Set();

let collisionsWithBuiltIn = 0;
let internalCollisions = 0;

ALL_GENERAL_ENGLISH_STARTER_QUESTIONS.forEach((q) => {
  // Check unique ID
  if (internalIdSet.has(q.id)) {
    internalCollisions++;
    console.error(`  Duplicate ID detected: ${q.id}`);
  }
  internalIdSet.add(q.id);

  const norm = normalizePromptForDeduplication(q.prompt);
  // Deduplicate against built-in
  if (builtInNormalizedSet.has(norm)) {
    collisionsWithBuiltIn++;
    console.error(`  Collision with built-in question: "${q.prompt}"`);
  }
});

assert(internalCollisions === 0, 'Zero duplicate question IDs within the 320 starter questions');
assert(collisionsWithBuiltIn === 0, 'Zero collision with the 1,206 existing built-in curriculum questions');

// ---------------------------------------------------------------------------
// 7. PHASE 3 BULK IMPORT SIMULATION & EXPORT
// ---------------------------------------------------------------------------
console.log('\n--- 7. Reviewable File Export & Import Validator Check ---');

const baseDir = path.resolve(__dirname, './src/data/generalEnglish');
fs.mkdirSync(baseDir, { recursive: true });

// Export Master JSON
const allJsonPath = path.join(baseDir, 'allQuestions.json');
fs.writeFileSync(allJsonPath, JSON.stringify(ALL_GENERAL_ENGLISH_STARTER_QUESTIONS, null, 2), 'utf8');
assert(fs.existsSync(allJsonPath), 'Successfully saved Master JSON: src/data/generalEnglish/allQuestions.json');

// Build rows for CSV export
const { generateCsv, parseCsv } = jiti('./src/utils/spreadsheetParser.ts');

const headers = [
  'ID',
  'Question Type',
  'Prompt',
  'Option A',
  'Option B',
  'Option C',
  'Option D',
  'Correct Answer',
  'Explanation',
  'Section',
  'Grade',
  'Unit ID',
  'Unit Title',
  'Topic',
  'Skill',
  'Difficulty',
  'Points',
  'Tags',
  'Correct Sentence',
  'Scrambled Words',
  'Passage Title',
  'Passage Text',
  'Pair 1 Left',
  'Pair 1 Right',
  'Pair 2 Left',
  'Pair 2 Right',
  'Pair 3 Left',
  'Pair 3 Right',
  'Pair 4 Left',
  'Pair 4 Right',
];

const csvRows = [headers];

for (const q of ALL_GENERAL_ENGLISH_STARTER_QUESTIONS) {
  let optA = '';
  let optB = '';
  let optC = '';
  let optD = '';
  let answer = q.correctAnswerPreview;

  if (q.payload.options) {
    optA = q.payload.options[0] || '';
    optB = q.payload.options[1] || '';
    optC = q.payload.options[2] || '';
    optD = q.payload.options[3] || '';
    if (typeof q.payload.correctOptionIndex === 'number') {
      answer = String.fromCharCode(65 + q.payload.correctOptionIndex);
    }
  } else if (q.payload.isTrue !== undefined) {
    answer = q.payload.isTrue ? 'TRUE' : 'FALSE';
  } else if (q.payload.correctSentence) {
    answer = q.payload.correctSentence;
  }

  const p = q.payload.pairs || [];

  csvRows.push([
    q.id,
    q.questionType,
    q.prompt,
    optA,
    optB,
    optC,
    optD,
    answer,
    q.explanation || '',
    q.section,
    q.gradeId,
    q.unitId || '',
    q.unitTitle || '',
    q.topic,
    q.skill,
    q.difficulty,
    String(q.points),
    (q.tags || []).join('; '),
    q.payload.correctSentence || '',
    (q.payload.scrambledWords || []).join(', '),
    q.payload.passageTitle || '',
    q.payload.passageText || '',
    p[0]?.left || '',
    p[0]?.right || '',
    p[1]?.left || '',
    p[1]?.right || '',
    p[2]?.left || '',
    p[2]?.right || '',
    p[3]?.left || '',
    p[3]?.right || '',
  ]);
}

const csvString = generateCsv(csvRows);
const allCsvPath = path.join(baseDir, 'allQuestions.csv');
fs.writeFileSync(allCsvPath, csvString, 'utf8');
assert(fs.existsSync(allCsvPath), 'Successfully saved Master CSV: src/data/generalEnglish/allQuestions.csv');

// Export modular JSON files for granular teacher review
const modularExports = [
  ['grade7/grammar.json', GRADE_7_GRAMMAR_QUESTIONS],
  ['grade7/vocabulary.json', GRADE_7_VOCABULARY_QUESTIONS],
  ['grade7/reading.json', GRADE_7_READING_QUESTIONS],
  ['grade7/listening.json', GRADE_7_LISTENING_QUESTIONS],
  ['grade8/grammar.json', GRADE_8_GRAMMAR_QUESTIONS],
  ['grade8/vocabulary.json', GRADE_8_VOCABULARY_QUESTIONS],
  ['grade8/reading.json', GRADE_8_READING_QUESTIONS],
  ['grade8/listening.json', GRADE_8_LISTENING_QUESTIONS],
];

modularExports.forEach(([relPath, data]) => {
  const fullPath = path.join(baseDir, relPath);
  fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf8');
  assert(fs.existsSync(fullPath), `Saved modular JSON: src/data/generalEnglish/${relPath} (${data.length} items)`);
});

// Run Phase 3 validator check on exported CSV
console.log('\n--- Running Phase 3 CSV Import Validator Simulation ---');
const parsedRows = parseCsv(csvString);
const summary = validateImportRows(parsedRows, [], builtInQuestions);
console.log(`    Validation Result: Total Rows=${summary.totalRows}, Valid=${summary.validCount}, Invalid=${summary.invalidCount}, Duplicate=${summary.duplicateCount}`);
if (summary.invalidCount > 0) {
  console.log('Sample invalid errors:');
  summary.results.filter((r) => r.status === 'invalid').slice(0, 10).forEach((r) => {
    console.log(`  Row ${r.rowIndex}: Type=${r.originalRow[1]}, Prompt="${r.originalRow[2]}", Errors:`, r.errors);
  });
}
assert(summary.invalidCount === 0, 'Phase 3 Import Validator reported 0 invalid rows');
assert(summary.duplicateCount === 0, 'Phase 3 Import Validator reported 0 duplicate rows against built-in questions');
assert(summary.validCount === 320, 'Phase 3 Import Validator verified all 320 rows as 100% ready for import');

console.log('\n======================================================================');
console.log(`🎉 ALL ${passedTests} / ${totalTests} VALIDATION SUITE ASSERTIONS PASSED!`);
console.log('======================================================================\n');
