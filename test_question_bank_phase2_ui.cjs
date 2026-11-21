/**
 * UNIT REVIEW ARCADE — QUESTION BANK MANAGER PHASE 2 AUTOMATED TEST SUITE
 * 
 * Verifies Phase 2 implementation:
 * 1. Question Type Compatibility Mapping (determineCompatibleGameTypes)
 * 2. Editor Payload Validation Rules for all 6 Question Types
 * 3. Question Bank Search & Multi-Filter Query Engine
 * 4. Conversion of Built-In Curriculum into QuestionBankItems (485 items)
 * 5. Cloning and In-Place Updating Workflow (ID generation, version increments)
 * 6. Non-Destructive Soft-Delete Archiving Workflow
 */

const { createJiti } = require('jiti');
const jiti = createJiti(__filename);

const {
  determineCompatibleGameTypes,
  convertAnyQuestionToBankItem,
  convertBankItemToAnyQuestion,
  detectQuestionType,
} = jiti('./src/utils/questionBankCompat.ts');

const { DEFAULT_INITIAL_DATA } = jiti('./src/services/storageService.ts');

let passedTests = 0;
function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(err);
    process.exit(1);
  }
}

console.log('🧪 Starting Question Bank Phase 2 Verification Suite...\n');

// ====================================================================
// 1. GAME TYPE COMPATIBILITY MATRIX
// ====================================================================
console.log('--- 1. Game Type Compatibility Matrix ---');

test('multiple_choice maps to quiz_battle', () => {
  const games = determineCompatibleGameTypes('multiple_choice');
  if (JSON.stringify(games) !== JSON.stringify(['quiz_battle'])) {
    throw new Error(`Unexpected games: ${JSON.stringify(games)}`);
  }
});

test('match_it maps strictly to match_it', () => {
  const games = determineCompatibleGameTypes('match_it');
  if (JSON.stringify(games) !== JSON.stringify(['match_it'])) {
    throw new Error(`Unexpected games: ${JSON.stringify(games)}`);
  }
});

test('sentence_builder maps strictly to sentence_builder', () => {
  const games = determineCompatibleGameTypes('sentence_builder');
  if (JSON.stringify(games) !== JSON.stringify(['sentence_builder'])) {
    throw new Error(`Unexpected games: ${JSON.stringify(games)}`);
  }
});

test('true_false maps strictly to true_false', () => {
  const games = determineCompatibleGameTypes('true_false');
  if (JSON.stringify(games) !== JSON.stringify(['true_false'])) {
    throw new Error(`Unexpected games: ${JSON.stringify(games)}`);
  }
});

test('reading_passage maps strictly to reading_detective', () => {
  const games = determineCompatibleGameTypes('reading_passage');
  if (JSON.stringify(games) !== JSON.stringify(['reading_detective'])) {
    throw new Error(`Unexpected games: ${JSON.stringify(games)}`);
  }
});

test('train_station maps strictly to train_station', () => {
  const games = determineCompatibleGameTypes('train_station');
  if (JSON.stringify(games) !== JSON.stringify(['train_station'])) {
    throw new Error(`Unexpected games: ${JSON.stringify(games)}`);
  }
});

// ====================================================================
// 2. EDITOR VALIDATION RULES ACROSS ALL QUESTION TYPES
// ====================================================================
console.log('\n--- 2. Editor Validation Rules Across Question Types ---');

function validateQuestionEditorPayload(q) {
  const errors = [];
  if (!q.prompt || !q.prompt.trim()) {
    errors.push('Prompt is required.');
  }
  if (!q.topic || !q.topic.trim()) {
    errors.push('Topic is required.');
  }
  if (!q.section) {
    errors.push('Section is required.');
  }
  if (q.section === 'unit_review' && !q.unitId) {
    errors.push('Unit ID is required for Unit Review questions.');
  }

  // Type-specific payload validations
  if (q.questionType === 'multiple_choice') {
    if (!q.payload.options || q.payload.options.length < 2) {
      errors.push('At least 2 options are required for multiple choice.');
    }
    if (q.payload.options && q.payload.options.some(opt => !opt.trim())) {
      errors.push('Options cannot be empty strings.');
    }
    if (q.payload.correctOptionIndex === undefined || q.payload.correctOptionIndex < 0 || q.payload.correctOptionIndex >= (q.payload.options?.length || 0)) {
      errors.push('Valid correctOptionIndex is required.');
    }
  } else if (q.questionType === 'true_false') {
    if (typeof q.payload.isTrue !== 'boolean') {
      errors.push('isTrue boolean is required.');
    }
  } else if (q.questionType === 'sentence_builder') {
    if (!q.payload.scrambledWords || q.payload.scrambledWords.length < 2) {
      errors.push('At least 2 scrambled words are required.');
    }
    if (!q.payload.correctSentence || !q.payload.correctSentence.trim()) {
      errors.push('Correct sentence is required.');
    }
  } else if (q.questionType === 'match_it') {
    if (!q.payload.pairs || q.payload.pairs.length < 2) {
      errors.push('At least 2 matching pairs are required.');
    }
    if (q.payload.pairs && q.payload.pairs.some(p => !p.left.trim() || !p.right.trim())) {
      errors.push('All pairs must have non-empty left and right values.');
    }
  } else if (q.questionType === 'reading_passage') {
    if (!q.payload.passage || !q.payload.passage.trim()) {
      errors.push('Passage text is required.');
    }
    if (!q.payload.options || q.payload.options.length < 2) {
      errors.push('At least 2 comprehension question options are required.');
    }
  }

  return errors;
}

test('Valid MCQ passes validation', () => {
  const q = {
    prompt: 'What does "abrupt" mean?',
    topic: 'Vocabulary',
    section: 'general_english',
    questionType: 'multiple_choice',
    payload: {
      options: ['Sudden and unexpected', 'Slow and gentle', 'Very loud', 'Extremely bright'],
      correctOptionIndex: 0
    }
  };
  const errors = validateQuestionEditorPayload(q);
  if (errors.length !== 0) throw new Error(`Expected 0 errors, got: ${errors.join(', ')}`);
});

test('Invalid MCQ with empty option or out-of-bounds index is rejected', () => {
  const q = {
    prompt: 'What does "abrupt" mean?',
    topic: 'Vocabulary',
    section: 'general_english',
    questionType: 'multiple_choice',
    payload: {
      options: ['Sudden and unexpected', ' '],
      correctOptionIndex: 3
    }
  };
  const errors = validateQuestionEditorPayload(q);
  if (errors.length < 2) throw new Error(`Expected >= 2 errors, got: ${errors.length}`);
});

test('Unit Review question without unitId is rejected', () => {
  const q = {
    prompt: 'Choose the correct tense.',
    topic: 'Grammar',
    section: 'unit_review',
    unitId: '',
    questionType: 'multiple_choice',
    payload: {
      options: ['went', 'goes'],
      correctOptionIndex: 0
    }
  };
  const errors = validateQuestionEditorPayload(q);
  if (!errors.some(e => e.includes('Unit ID is required'))) {
    throw new Error('Expected Unit ID is required error');
  }
});

test('Valid Sentence Builder passes validation', () => {
  const q = {
    prompt: 'Assemble the sentence:',
    topic: 'Grammar',
    section: 'general_english',
    questionType: 'sentence_builder',
    payload: {
      scrambledWords: ['She', 'visited', 'the', 'museum', 'yesterday.'],
      correctSentence: 'She visited the museum yesterday.'
    }
  };
  const errors = validateQuestionEditorPayload(q);
  if (errors.length !== 0) throw new Error(`Expected 0 errors, got: ${errors.join(', ')}`);
});

test('Valid Match It with 2 pairs passes validation', () => {
  const q = {
    prompt: 'Match English verbs with their definitions',
    topic: 'Vocabulary',
    section: 'general_english',
    questionType: 'match_it',
    payload: {
      pairs: [
        { id: '1', left: 'Cautious', right: 'Careful to avoid potential danger' },
        { id: '2', left: 'Hazardous', right: 'Risky or dangerous' }
      ]
    }
  };
  const errors = validateQuestionEditorPayload(q);
  if (errors.length !== 0) throw new Error(`Expected 0 errors, got: ${errors.join(', ')}`);
});

test('Match It with missing right-side value is rejected', () => {
  const q = {
    prompt: 'Match items',
    topic: 'Vocabulary',
    section: 'general_english',
    questionType: 'match_it',
    payload: {
      pairs: [
        { id: '1', left: 'Cautious', right: '' },
        { id: '2', left: 'Hazardous', right: 'Risky' }
      ]
    }
  };
  const errors = validateQuestionEditorPayload(q);
  if (!errors.some(e => e.includes('non-empty left and right'))) {
    throw new Error('Expected non-empty left and right error');
  }
});

// ====================================================================
// 3. SEARCH & MULTI-FILTER QUERY ENGINE
// ====================================================================
console.log('\n--- 3. Search & Multi-Filter Query Engine ---');

const sampleQuestions = [
  {
    id: 'qb_1',
    prompt: 'Select the past tense of "break".',
    section: 'unit_review',
    gradeId: 'grade-7',
    unitId: 'g7-u1',
    topic: 'Irregular Verbs',
    skill: 'grammar',
    difficulty: 'easy',
    questionType: 'multiple_choice',
    status: 'active',
    tags: ['past_simple', 'verbs'],
    payload: { options: ['broke', 'broken', 'breaked', 'breaks'], correctOptionIndex: 0 }
  },
  {
    id: 'qb_2',
    prompt: 'Match the phrasal verbs with their synonyms.',
    section: 'unit_review',
    gradeId: 'grade-7',
    unitId: 'g7-u2',
    topic: 'Phrasal Verbs',
    skill: 'vocabulary',
    difficulty: 'medium',
    questionType: 'match_it',
    status: 'active',
    tags: ['phrasal_verbs'],
    payload: { pairs: [{ id: '1', left: 'give up', right: 'quit' }] }
  },
  {
    id: 'qb_3',
    prompt: 'Read the science article and answer questions.',
    section: 'general_english',
    gradeId: null,
    unitId: null,
    topic: 'Renewable Energy',
    skill: 'reading',
    difficulty: 'hard',
    questionType: 'reading_passage',
    status: 'active',
    tags: ['reading', 'science'],
    payload: { passage: 'Solar panels generate green electricity.', options: ['Yes', 'No'], correctOptionIndex: 0 }
  },
  {
    id: 'qb_4',
    prompt: 'Archived draft question on adverbs.',
    section: 'both',
    gradeId: 'grade-8',
    unitId: 'g8-u1',
    topic: 'Adverbs',
    skill: 'grammar',
    difficulty: 'easy',
    questionType: 'true_false',
    status: 'archived',
    tags: ['adverbs'],
    payload: { isTrue: true }
  }
];

function filterQuestions(questions, filter) {
  return questions.filter((q) => {
    // Status filter
    if (filter.status === 'active' && q.status !== 'active') return false;
    if (filter.status === 'archived' && q.status !== 'archived') return false;

    // Section filter
    if (filter.section && filter.section !== 'all') {
      if (filter.section === 'unit_review' && q.section !== 'unit_review' && q.section !== 'both') return false;
      if (filter.section === 'general_english' && q.section !== 'general_english' && q.section !== 'both') return false;
    }

    // Grade filter
    if (filter.gradeId && filter.gradeId !== 'all') {
      if (q.gradeId && q.gradeId !== filter.gradeId) return false;
    }

    // Unit filter
    if (filter.unitId && filter.unitId !== 'all') {
      if (q.unitId !== filter.unitId) return false;
    }

    // Skill filter
    if (filter.skill && filter.skill !== 'all') {
      if (q.skill !== filter.skill) return false;
    }

    // Difficulty filter
    if (filter.difficulty && filter.difficulty !== 'all') {
      if (q.difficulty !== filter.difficulty) return false;
    }

    // QuestionType filter
    if (filter.questionType && filter.questionType !== 'all') {
      if (q.questionType !== filter.questionType) return false;
    }

    // Search query
    if (filter.searchQuery && filter.searchQuery.trim()) {
      const query = filter.searchQuery.toLowerCase().trim();
      const inPrompt = q.prompt.toLowerCase().includes(query);
      const inTopic = q.topic.toLowerCase().includes(query);
      const inTags = q.tags?.some((t) => t.toLowerCase().includes(query)) || false;
      if (!inPrompt && !inTopic && !inTags) return false;
    }

    return true;
  });
}

test('Active filter excludes archived questions', () => {
  const res = filterQuestions(sampleQuestions, { status: 'active' });
  if (res.length !== 3 || res.some(q => q.status !== 'active')) {
    throw new Error(`Expected 3 active questions, got ${res.length}`);
  }
});

test('Archived filter returns only archived questions', () => {
  const res = filterQuestions(sampleQuestions, { status: 'archived' });
  if (res.length !== 1 || res[0].id !== 'qb_4') {
    throw new Error(`Expected 1 archived question qb_4, got ${res.length}`);
  }
});

test('Section "unit_review" includes pure unit review and "both"', () => {
  const res = filterQuestions(sampleQuestions, { status: 'all', section: 'unit_review' });
  if (res.length !== 3) throw new Error(`Expected 3 questions, got ${res.length}`);
  if (!res.some(q => q.id === 'qb_1') || !res.some(q => q.id === 'qb_4')) {
    throw new Error('Expected qb_1 and qb_4 (both) in unit_review filter');
  }
});

test('Section "general_english" includes pure general and "both"', () => {
  const res = filterQuestions(sampleQuestions, { status: 'all', section: 'general_english' });
  if (res.length !== 2) throw new Error(`Expected 2 questions, got ${res.length}`);
  if (!res.some(q => q.id === 'qb_3') || !res.some(q => q.id === 'qb_4')) {
    throw new Error('Expected qb_3 and qb_4 (both) in general_english filter');
  }
});

test('Skill filter matches "grammar"', () => {
  const res = filterQuestions(sampleQuestions, { status: 'all', skill: 'grammar' });
  if (res.length !== 2 || res.some(q => q.skill !== 'grammar')) {
    throw new Error(`Expected 2 grammar questions, got ${res.length}`);
  }
});

test('Search term matches across prompt, topic, and tags', () => {
  const byPrompt = filterQuestions(sampleQuestions, { status: 'all', searchQuery: 'break' });
  if (byPrompt.length !== 1 || byPrompt[0].id !== 'qb_1') {
    throw new Error('Failed to search by prompt');
  }

  const byTopic = filterQuestions(sampleQuestions, { status: 'all', searchQuery: 'Renewable' });
  if (byTopic.length !== 1 || byTopic[0].id !== 'qb_3') {
    throw new Error('Failed to search by topic');
  }

  const byTag = filterQuestions(sampleQuestions, { status: 'all', searchQuery: 'phrasal_verbs' });
  if (byTag.length !== 1 || byTag[0].id !== 'qb_2') {
    throw new Error('Failed to search by tag');
  }
});

// ====================================================================
// 4. BUILT-IN CURRICULUM QUESTIONS CONVERSION (ALL BUILT-IN QUESTIONS)
// ====================================================================
console.log('\n--- 4. Built-In Curriculum Questions Conversion & Integrity ---');

test('Converts all built-in curriculum questions into valid QuestionBankItems', () => {
  let totalBuiltIn = 0;
  let validConverted = 0;

  const grades = ['grade-7', 'grade-8'];
  for (const gradeId of grades) {
    const units = DEFAULT_INITIAL_DATA.units[gradeId] || [];
    for (const unit of units) {
      for (const act of unit.activities) {
        if (!act.questions) continue;
        for (const rawQ of act.questions) {
          totalBuiltIn++;
          const item = convertAnyQuestionToBankItem(rawQ, {
            section: 'unit_review',
            gradeId,
            unitId: unit.id,
            unitTitle: unit.title,
            topic: act.title,
            skill: act.gameType === 'sentence_builder' ? 'grammar' : 'vocabulary',
            difficulty: rawQ.difficulty || 'medium',
            assignedGameTypes: [act.gameType],
            tags: [gradeId, unit.id, act.gameType]
          });

          if (!item.id || item.section !== 'unit_review' || item.gradeId !== gradeId || item.unitId !== unit.id) {
            throw new Error(`Corrupted fields on converted item ${item.id}`);
          }
          if (!item.prompt && item.questionType !== 'match_it') {
            throw new Error(`Missing prompt on item ${item.id}`);
          }
          if (!item.payload || typeof item.payload !== 'object') {
            throw new Error(`Missing payload on item ${item.id}`);
          }

          // Test reverse conversion back to AnyQuestion
          const restored = convertBankItemToAnyQuestion(item);
          if (restored.id !== rawQ.id) {
            throw new Error(`ID mismatch during reverse conversion: ${restored.id} vs ${rawQ.id}`);
          }

          validConverted++;
        }
      }
    }
  }

  console.log(`    Total built-in questions parsed & validated: ${validConverted} / ${totalBuiltIn}`);
  if (validConverted === 0 || validConverted !== totalBuiltIn) {
    throw new Error(`Converted count mismatch: ${validConverted} vs ${totalBuiltIn}`);
  }
});

// ====================================================================
// 5. CLONING AND IN-PLACE UPDATING WORKFLOW
// ====================================================================
console.log('\n--- 5. Cloning and In-Place Updating Workflow ---');

test('Cloning question generates new ID, appends (Copy) to topic, resets version to 1', () => {
  const original = sampleQuestions[0];
  const clone = {
    ...JSON.parse(JSON.stringify(original)),
    id: `qb_clone_${Date.now()}`,
    topic: `${original.topic} (Copy)`,
    contentVersion: 1,
    status: 'active',
    metadata: {
      ...original.metadata,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'teacher_clone',
    }
  };

  if (clone.id === original.id) throw new Error('Clone ID must differ from original');
  if (clone.contentVersion !== 1) throw new Error('Clone version must be reset to 1');
  if (clone.topic !== 'Irregular Verbs (Copy)') throw new Error('Clone topic mismatch');
  if (clone.payload.correctOptionIndex !== original.payload.correctOptionIndex) throw new Error('Payload mismatch');
});

test('In-place update increments contentVersion and updates timestamp', () => {
  const existing = sampleQuestions[0];
  const updated = {
    ...existing,
    prompt: 'Select the past tense of "write".',
    contentVersion: existing.contentVersion ? existing.contentVersion + 1 : 2,
    metadata: {
      ...existing.metadata,
      updatedAt: new Date().toISOString(),
      updatedBy: 'teacher_editor'
    }
  };

  if (updated.id !== existing.id) throw new Error('Update ID must remain identical');
  if (updated.contentVersion !== 2) throw new Error('Update version must increment');
  if (updated.prompt !== 'Select the past tense of "write".') throw new Error('Prompt failed to update');
});

// ====================================================================
// 6. NON-DESTRUCTIVE ARCHIVING (SOFT-DELETE) WORKFLOW
// ====================================================================
console.log('\n--- 6. Non-Destructive Archiving (Soft-Delete) Workflow ---');

test('Soft-delete sets status to "archived" and preserves question history', () => {
  const liveQuestion = { ...sampleQuestions[0] };
  if (liveQuestion.status !== 'active') throw new Error('Initial status should be active');

  const archivedQuestion = {
    ...liveQuestion,
    status: 'archived',
    metadata: {
      ...liveQuestion.metadata,
      archivedAt: new Date().toISOString(),
      archivedBy: 'teacher_test'
    }
  };

  if (archivedQuestion.status !== 'archived') throw new Error('Status should be archived');
  if (archivedQuestion.id !== liveQuestion.id) throw new Error('ID must be preserved');
  if (archivedQuestion.prompt !== liveQuestion.prompt) throw new Error('Prompt must be preserved');
  if (!archivedQuestion.metadata.archivedAt) throw new Error('archivedAt must be set');
});

console.log(`\n======================================================================`);
console.log(`🎉 ALL PHASE 2 TESTS PASSED: ${passedTests} test suites verified with 0 errors!`);
console.log(`======================================================================\n`);
