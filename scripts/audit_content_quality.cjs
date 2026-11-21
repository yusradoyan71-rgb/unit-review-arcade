/**
 * SCRIPT: audit_content_quality.cjs
 * Performs an exhaustive, granular audit of all 320 General English Starter Questions.
 */

const fs = require('fs');
const path = require('path');

const jsonPath = path.resolve(__dirname, '../src/data/generalEnglish/allQuestions.json');
const ALL_GENERAL_ENGLISH_STARTER_QUESTIONS = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log('Auditing', ALL_GENERAL_ENGLISH_STARTER_QUESTIONS.length, 'questions from allQuestions.json...\n');

// 1. Check option index distribution
const dist = { 0: 0, 1: 0, 2: 0, 3: 0 };
let mcCount = 0;
ALL_GENERAL_ENGLISH_STARTER_QUESTIONS.forEach((q) => {
  if (q.payload.options && typeof q.payload.correctOptionIndex === 'number') {
    dist[q.payload.correctOptionIndex] = (dist[q.payload.correctOptionIndex] || 0) + 1;
    mcCount++;
  }
});
console.log('1. Correct Option Index Distribution (A, B, C, D):');
console.log(`   Total with options: ${mcCount}`);
console.log(`   A (0): ${dist[0]} (${Math.round(dist[0]/mcCount*100)}%)`);
console.log(`   B (1): ${dist[1]} (${Math.round(dist[1]/mcCount*100)}%)`);
console.log(`   C (2): ${dist[2]} (${Math.round(dist[2]/mcCount*100)}%)`);
console.log(`   D (3): ${dist[3]} (${Math.round(dist[3]/mcCount*100)}%)`);

// 2. Check duplicate options within any question
const duplicateOptionsIssues = [];
ALL_GENERAL_ENGLISH_STARTER_QUESTIONS.forEach((q) => {
  if (q.payload.options) {
    const opts = q.payload.options.map(o => o.toLowerCase().trim());
    const unique = new Set(opts);
    if (unique.size !== opts.length) {
      duplicateOptionsIssues.push({ id: q.id, prompt: q.prompt, options: q.payload.options });
    }
  }
});
console.log('\n2. Duplicate options within a question:');
console.log(`   Issues found: ${duplicateOptionsIssues.length}`);
duplicateOptionsIssues.forEach(i => console.log('   -', i.id, i.options));

// 3. Check Sentence Builder token alignment
const sentenceBuilderIssues = [];
ALL_GENERAL_ENGLISH_STARTER_QUESTIONS.forEach((q) => {
  if (q.questionType === 'sentence_builder') {
    const { correctSentence, scrambledWords } = q.payload;
    if (!correctSentence || !scrambledWords) {
      sentenceBuilderIssues.push({ id: q.id, issue: 'Missing correctSentence or scrambledWords' });
      return;
    }
    // Check if joining scrambled words (sorted) matches sentence tokens (sorted)
    const normalizeTokens = (tokens) => tokens.map(t => t.toLowerCase().replace(/^[^\w]+|[^\w]+$/g, '')).filter(Boolean).sort();
    const sentTokens = normalizeTokens(correctSentence.split(/\s+/));
    const scramTokens = normalizeTokens(scrambledWords);
    if (JSON.stringify(sentTokens) !== JSON.stringify(scramTokens)) {
      sentenceBuilderIssues.push({
        id: q.id,
        issue: 'Token mismatch between correctSentence and scrambledWords',
        correctSentence,
        scrambledWords
      });
    }
  }
});
console.log('\n3. Sentence Builder Token Alignment:');
console.log(`   Issues found: ${sentenceBuilderIssues.length}`);
sentenceBuilderIssues.forEach(i => console.log('   -', i.id, i.issue, '\n     Sentence:', i.correctSentence, '\n     Scrambled:', i.scrambledWords));

// 4. Check Match It pairs
const matchItIssues = [];
ALL_GENERAL_ENGLISH_STARTER_QUESTIONS.forEach((q) => {
  if (q.questionType === 'match_it') {
    const pairs = q.payload.pairs || [];
    if (pairs.length < 3) {
      matchItIssues.push({ id: q.id, issue: 'Fewer than 3 pairs' });
    }
    const lefts = new Set();
    const rights = new Set();
    pairs.forEach(p => {
      if (lefts.has(p.left.toLowerCase())) matchItIssues.push({ id: q.id, issue: `Duplicate left value: ${p.left}` });
      if (rights.has(p.right.toLowerCase())) matchItIssues.push({ id: q.id, issue: `Duplicate right value: ${p.right}` });
      lefts.add(p.left.toLowerCase());
      rights.add(p.right.toLowerCase());
    });
  }
});
console.log('\n4. Match It Pair Uniqueness:');
console.log(`   Issues found: ${matchItIssues.length}`);
matchItIssues.forEach(i => console.log('   -', i.id, i.issue));

// 5. Check Reading Passages and Questions
const readingIssues = [];
const passageMap = new Map();
ALL_GENERAL_ENGLISH_STARTER_QUESTIONS.forEach((q) => {
  if (q.questionType === 'reading_passage') {
    const pid = q.payload.passageId;
    if (!passageMap.has(pid)) {
      passageMap.set(pid, {
        id: pid,
        title: q.payload.passageTitle,
        text: q.payload.passageText,
        questions: []
      });
    }
    passageMap.get(pid).questions.push(q);
  }
});

console.log('\n5. Reading Passages Audit:');
console.log(`   Passages found: ${passageMap.size}`);
passageMap.forEach((p, pid) => {
  const wordCount = p.text ? p.text.split(/\s+/).length : 0;
  console.log(`   Passage ${pid} ("${p.title}"): ${wordCount} words, ${p.questions.length} questions`);
  if (p.questions.length !== 4) {
    readingIssues.push({ pid, issue: `Expected 4 questions, found ${p.questions.length}` });
  }
  p.questions.forEach((q, qIdx) => {
    if (!q.payload.options || q.payload.options.length < 4) {
      readingIssues.push({ pid, qId: q.id, issue: `Question ${qIdx + 1} has fewer than 4 options` });
    }
  });
});

// 6. Check Listening & Audio URLs
const audioIssues = [];
const placeholderAudioUrls = [];
ALL_GENERAL_ENGLISH_STARTER_QUESTIONS.forEach((q) => {
  if (q.skill === 'listening') {
    const { audioUrl, speechText, correctTranscript } = q.payload;
    if (!audioUrl) audioIssues.push({ id: q.id, issue: 'Missing audioUrl' });
    else {
      placeholderAudioUrls.push({ id: q.id, url: audioUrl });
    }
    if (!speechText) audioIssues.push({ id: q.id, issue: 'Missing speechText' });
    if (!correctTranscript) audioIssues.push({ id: q.id, issue: 'Missing correctTranscript' });
    if (speechText !== correctTranscript) {
      audioIssues.push({ id: q.id, issue: 'speechText differs from correctTranscript' });
    }
  }
});
console.log('\n6. Listening Questions Audio Audit:');
const listeningCount = ALL_GENERAL_ENGLISH_STARTER_QUESTIONS.filter(q => q.skill === 'listening').length;
console.log(`   Total listening items: ${listeningCount}`);
console.log(`   Placeholder URLs identified: ${placeholderAudioUrls.length}`);
console.log(`   Issues found: ${audioIssues.length}`);

// 7. Check True/False questions
const tfQuestions = ALL_GENERAL_ENGLISH_STARTER_QUESTIONS.filter(q => q.questionType === 'true_false');
const tfDist = { true: 0, false: 0 };
tfQuestions.forEach(q => {
  if (q.payload.isTrue === true) tfDist.true++;
  else if (q.payload.isTrue === false) tfDist.false++;
});
console.log('\n7. True / False Balance:');
console.log(`   Total True/False: ${tfQuestions.length}`);
console.log(`   TRUE: ${tfDist.true}`);
console.log(`   FALSE: ${tfDist.false}`);
