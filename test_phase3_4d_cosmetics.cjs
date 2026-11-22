/**
 * ============================================================================
 * UNIT REVIEW ARCADE — PHASE 3.4D MONSTER WORLD COSMETICS & REWARDS TEST SUITE
 * ============================================================================
 * 
 * Comprehensive verification for Phase 3.4D:
 * 1. Six approved classroom rewards & thresholds (Strictly 250 for Legendary Aura).
 * 2. Visual catalog definitions in types/monster.ts (price 0, isClassroomReward: true).
 * 3. Strict SVG layering order in MonsterAvatar.tsx (Aura -> Wings -> Body -> Crown -> Frame).
 * 4. Simultaneous equipping of Crown, Wings, Aura, and Frame.
 * 5. Backend & Frontend Equipment Security (locked item rejection, 0-coin buying blocked).
 * 6. Authoritative backend Class_RewardGrants recovery without losing purchased items.
 * 7. Student My Classroom equip/unequip toggles and live avatar preview.
 * 8. Student Profile Modal avatar frame & achievement badges shelf.
 * 9. Monster World Wardrobe boutique mirror, categories, and locked card states.
 * 10. Multi-size avatar scaling (36px to 220px) and prefers-reduced-motion accessibility.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

let totalChecks = 0;
let passedChecks = 0;

function assert(condition, message) {
  totalChecks++;
  if (!condition) {
    console.error(`  ❌ FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✓ ${message}`);
  passedChecks++;
}

console.log('======================================================================');
console.log('PHASE 3.4D VERIFICATION SUITE: MONSTER WORLD COSMETICS & REWARDS');
console.log('======================================================================\n');

// ---------------------------------------------------------------------------
// 1. Authoritative 6 Rewards & Point Thresholds (Strictly 250 for Aura)
// ---------------------------------------------------------------------------
console.log('--- 1. Six Approved Rewards & Exact Point Thresholds ---');

const codeGsPath = path.join(__dirname, 'google-apps-script', 'Code.gs');
const codeGsContent = fs.readFileSync(codeGsPath, 'utf8');

// Verify Code.gs milestone definitions
assert(
  codeGsContent.includes('rwd_first_star') &&
  codeGsContent.includes('badge_first_star') &&
  codeGsContent.includes('points: 10'),
  'First Star defined at 10 positive points with cosmeticId badge_first_star'
);

assert(
  codeGsContent.includes('rwd_silver_star_frame') &&
  codeGsContent.includes('frame_silver_star') &&
  codeGsContent.includes('points: 25'),
  'Silver Star Frame defined at 25 positive points with cosmeticId frame_silver_star'
);

assert(
  codeGsContent.includes('rwd_monster_crown') &&
  codeGsContent.includes('hat_monster_crown') &&
  codeGsContent.includes('points: 50'),
  'Monster Crown defined at 50 positive points with cosmeticId hat_monster_crown'
);

assert(
  codeGsContent.includes('rwd_magic_wings') &&
  codeGsContent.includes('wings_magic') &&
  codeGsContent.includes('points: 100'),
  'Magic Wings defined at 100 positive points with cosmeticId wings_magic'
);

assert(
  codeGsContent.includes('rwd_elite_speaker') &&
  codeGsContent.includes('badge_elite_speaker') &&
  codeGsContent.includes('points: 150'),
  'Elite Speaker defined at 150 positive points with cosmeticId badge_elite_speaker'
);

assert(
  codeGsContent.includes('rwd_legendary_aura') &&
  codeGsContent.includes('aura_legendary') &&
  codeGsContent.includes('points: 250'),
  'Legendary Aura strictly defined at 250 positive points (NOT 200) with cosmeticId aura_legendary'
);

assert(
  !codeGsContent.includes('points: 200, type: "monster_aura"'),
  'Code.gs contains ZERO occurrences of incorrect 200-point threshold for aura'
);

// Verify types/monster.ts catalog
const monsterTypesPath = path.join(__dirname, 'src', 'types', 'monster.ts');
const monsterTypesContent = fs.readFileSync(monsterTypesPath, 'utf8');

assert(
  monsterTypesContent.includes("id: 'frame_silver_star'") &&
  monsterTypesContent.includes('requiredPoints: 25'),
  'CLASSROOM_REWARD_CATALOG defines frame_silver_star at 25 points'
);

assert(
  monsterTypesContent.includes("id: 'hat_monster_crown'") &&
  monsterTypesContent.includes('requiredPoints: 50'),
  'CLASSROOM_REWARD_CATALOG defines hat_monster_crown at 50 points'
);

assert(
  monsterTypesContent.includes("id: 'wings_magic'") &&
  monsterTypesContent.includes('requiredPoints: 100'),
  'CLASSROOM_REWARD_CATALOG defines wings_magic at 100 points'
);

assert(
  monsterTypesContent.includes("id: 'aura_legendary'") &&
  monsterTypesContent.includes('requiredPoints: 250'),
  'CLASSROOM_REWARD_CATALOG defines aura_legendary at strictly 250 points'
);

assert(
  !monsterTypesContent.includes('requiredPoints: 200'),
  'types/monster.ts contains ZERO occurrences of incorrect 200-point threshold'
);

// Verify StudentMyClassroomScreen.tsx catalog
const myClassroomPath = path.join(__dirname, 'src', 'components', 'classroom', 'StudentMyClassroomScreen.tsx');
const myClassroomContent = fs.readFileSync(myClassroomPath, 'utf8');

assert(
  myClassroomContent.includes("id: 'rwd_legendary_aura'") &&
  myClassroomContent.includes('requiredPoints: 250'),
  'StudentMyClassroomScreen REWARD_MILESTONES defines Legendary Aura at strictly 250 points'
);

// ---------------------------------------------------------------------------
// 2. Visual Catalog & Type Definitions in types/monster.ts
// ---------------------------------------------------------------------------
console.log('\n--- 2. Visual Catalog & Cosmetic Slot Types ---');

assert(
  monsterTypesContent.includes("aura?: string | null;") &&
  monsterTypesContent.includes("frame?: string | null;"),
  'MonsterAccessories interface includes aura and frame slots'
);

assert(
  monsterTypesContent.includes("'hat' | 'glasses' | 'clothing' | 'wings' | 'aura' | 'frame'"),
  'ShopItemCategory includes aura and frame'
);

assert(
  monsterTypesContent.includes("isClassroomReward?: boolean;") &&
  monsterTypesContent.includes("requiredPoints?: number;"),
  'ShopItemPreview supports isClassroomReward and requiredPoints metadata'
);

assert(
  monsterTypesContent.includes("export const CLASSROOM_REWARD_CATALOG"),
  'CLASSROOM_REWARD_CATALOG is exported as official accessory collection'
);

// ---------------------------------------------------------------------------
// 3. Strict SVG Layering Architecture in MonsterAvatar.tsx
// ---------------------------------------------------------------------------
console.log('\n--- 3. Strict SVG Layering Order in MonsterAvatar.tsx ---');

const avatarPath = path.join(__dirname, 'src', 'components', 'monster', 'MonsterAvatar.tsx');
const avatarContent = fs.readFileSync(avatarPath, 'utf8');

const auraIdx = avatarContent.indexOf("accessories.aura === 'aura_legendary'");
const shadowIdx = avatarContent.indexOf("Base Ground Shadow");
const wingsIdx = avatarContent.indexOf("accessories.wings === 'wings_magic'");
const crownIdx = avatarContent.indexOf("accessories.hat === 'hat_monster_crown'");
const frameIdx = avatarContent.indexOf("accessories.frame === 'frame_silver_star'");

assert(auraIdx > -1, 'MonsterAvatar renders Layer 1: aura_legendary');
assert(shadowIdx > -1, 'MonsterAvatar renders Base Ground Shadow');
assert(wingsIdx > -1, 'MonsterAvatar renders Layer 2: wings_magic');
assert(crownIdx > -1, 'MonsterAvatar renders Layer 5: hat_monster_crown');
assert(frameIdx > -1, 'MonsterAvatar renders Layer 6: frame_silver_star');

assert(
  auraIdx < shadowIdx &&
  shadowIdx < wingsIdx &&
  wingsIdx < crownIdx &&
  crownIdx < frameIdx,
  'Strict Layering Order confirmed: Aura (behind all) -> Shadow -> Wings -> Crown -> Frame (outermost)'
);

// ---------------------------------------------------------------------------
// 4. Simultaneous Equipping of Crown, Wings, Aura, and Frame
// ---------------------------------------------------------------------------
console.log('\n--- 4. Simultaneous Equipping of Crown, Wings, Aura, Frame ---');

// Mock backend environment
function createBackendSandbox() {
  const code = fs.readFileSync(codeGsPath, 'utf8');
  const mockCache = {};
  const mockStorage = {};

  const sandbox = {
    Logger: { log: () => {} },
    Utilities: {
      computeDigest: (algo, str) => [1, 2, 3],
      base64Encode: (bytes) => 'mockhash',
      DigestAlgorithm: { SHA_256: 'SHA_256' },
      formatDate: (d) => d.toISOString(),
    },
    CacheService: {
      getScriptCache: () => ({
        get: (k) => mockCache[k] || null,
        put: (k, v) => { mockCache[k] = v; },
        remove: (k) => { delete mockCache[k]; },
      }),
    },
    ContentService: {
      MimeType: { JSON: 'JSON' },
      createTextOutput: (text) => ({
        mimeType: null,
        setMimeType: function(mt) { this.mimeType = mt; return this; },
        getContent: () => text,
      }),
    },
    LockService: {
      getScriptLock: () => ({
        waitLock: () => {},
        releaseLock: () => {},
      }),
    },
    Session: {
      getScriptTimeZone: () => 'Europe/Istanbul',
    },
  };

  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  return sandbox;
}

const backend = createBackendSandbox();

const fullConfig = {
  name: 'Pip The Great',
  bodyShape: 'blob',
  bodyColor: 'cyan',
  eyeType: 'anime',
  mouthType: 'smile',
  hornType: 'cat_ears',
  cheekType: 'blush_dots',
  pattern: 'belly_patch',
  accessories: {
    hat: 'hat_monster_crown',
    glasses: 'glasses_star',
    clothing: 'scarf_winter',
    wings: 'wings_magic',
    aura: 'aura_legendary',
    frame: 'frame_silver_star',
    owned: [
      'hat_monster_crown',
      'glasses_star',
      'scarf_winter',
      'wings_magic',
      'aura_legendary',
      'frame_silver_star',
    ],
  },
};

const sanitized = backend.sanitizeMonsterConfig(fullConfig);
assert(sanitized.accessories.hat === 'hat_monster_crown', 'Sanitizer preserves equipped hat_monster_crown');
assert(sanitized.accessories.wings === 'wings_magic', 'Sanitizer preserves equipped wings_magic');
assert(sanitized.accessories.aura === 'aura_legendary', 'Sanitizer preserves equipped aura_legendary');
assert(sanitized.accessories.frame === 'frame_silver_star', 'Sanitizer preserves equipped frame_silver_star');
assert(sanitized.accessories.clothing === 'scarf_winter', 'Sanitizer preserves standard clothing alongside rewards');
assert(sanitized.accessories.glasses === 'glasses_star', 'Sanitizer preserves standard glasses alongside rewards');

// ---------------------------------------------------------------------------
// 5. Backend & Frontend Equipment Security
// ---------------------------------------------------------------------------
console.log('\n--- 5. Equipment Security & Locked Item Rejection ---');

class MockRange {
  constructor(sheet, row, col, numRows = 1, numCols = 1) {
    this.sheet = sheet;
    this.row = row;
    this.col = col;
    this.numRows = numRows;
    this.numCols = numCols;
  }
  getValue() {
    const vals = this.getValues();
    return vals[0] ? vals[0][0] : '';
  }
  setValue(val) {
    while (this.sheet.rows.length < this.row - 1) {
      this.sheet.rows.push(new Array(this.sheet.headers.length).fill(''));
    }
    if (this.row === 1) {
      this.sheet.headers[this.col - 1] = val;
    } else {
      this.sheet.rows[this.row - 2][this.col - 1] = val;
    }
  }
  setValues(matrix) {
    for (let r = 0; r < matrix.length; r++) {
      const targetRow = this.row + r;
      while (this.sheet.rows.length < targetRow - 1) {
        this.sheet.rows.push(new Array(this.sheet.headers.length).fill(''));
      }
      for (let c = 0; c < matrix[r].length; c++) {
        const targetCol = this.col + c;
        if (targetRow === 1) {
          this.sheet.headers[targetCol - 1] = matrix[r][c];
        } else {
          this.sheet.rows[targetRow - 2][targetCol - 1] = matrix[r][c];
        }
      }
    }
  }
  getValues() {
    const full = [this.sheet.headers, ...this.sheet.rows];
    const slice = full.slice(this.row - 1, this.row - 1 + this.numRows);
    return slice.map((r) => r.slice(this.col - 1, this.col - 1 + this.numCols));
  }
}

class MockSheet {
  constructor(name, headers = [], rows = []) {
    this.name = name;
    this.headers = headers;
    this.rows = rows.map((r) => [...r]);
  }
  getName() { return this.name; }
  getLastRow() { return this.headers.length === 0 ? 0 : this.rows.length + 1; }
  getLastColumn() { return this.headers.length; }
  appendRow(row) {
    if (this.headers.length === 0) {
      this.headers = [...row];
    } else {
      this.rows.push([...row]);
    }
  }
  getDataRange() {
    const full = [this.headers, ...this.rows];
    return {
      getValues: () => full.map((r) => [...r]),
      getNumRows: () => full.length,
      getNumColumns: () => this.headers.length,
    };
  }
  getRange(row, col, numRows = 1, numCols = 1) {
    return new MockRange(this, row, col, numRows, numCols);
  }
}

class MockSpreadsheet {
  constructor(name = 'Unit Review Arcade – Student Tracking Database') {
    this.name = name;
    this.sheets = {};
  }
  getName() { return this.name; }
  getSheetByName(name) { return this.sheets[name] || null; }
  insertSheet(name) {
    const s = new MockSheet(name);
    this.sheets[name] = s;
    return s;
  }
  getSheets() { return Object.values(this.sheets); }
  addSheet(name, headers, rows = []) {
    const s = new MockSheet(name, headers, rows);
    this.sheets[name] = s;
    return s;
  }
}

const invokeGas = (fn, ...args) => {
  const res = fn(...args);
  if (res && typeof res.getContent === 'function') {
    return JSON.parse(res.getContent());
  }
  return res;
};

const mockSS = new MockSpreadsheet();
backend.setupClassroomPointsSheets(mockSS);

mockSS.addSheet('Students', [
  'student_id', 'student_number', 'full_name', 'class', 'grade', 'pin_hash', 'status', 'is_active', 'total_xp', 'created_at', 'monster_config'
], [
  ['std_701', '701', 'Ali Yilmaz', '7A', 'grade-7', 'pin', 'active', true, 150, '2026-09-01', JSON.stringify({
    name: 'Pip',
    accessories: {
      hat: null,
      owned: ['hat_party'], // Student does NOT own hat_monster_crown or aura_legendary!
    },
  })],
]);

const MOCK_STUDENT_TOKEN_701 = 'token_student_701_valid';
mockSS.addSheet('Sessions', [
  'session_id', 'session_token', 'student_id', 'student_number', 'class', 'login_time', 'last_ping_time', 'expires_at', 'logout_time', 'status', 'user_agent'
], [
  ['sess_701', MOCK_STUDENT_TOKEN_701, 'std_701', '701', '7A', new Date().toISOString(), new Date().toISOString(), new Date(Date.now() + 86400000).toISOString(), '', 'active', 'TestAgent'],
]);

mockSS.addSheet('Monsters', [
  'student_number', 'class', 'monster_name', 'body_shape', 'body_color',
  'eye_type', 'mouth_type', 'horn_type', 'cheek_type', 'pattern',
  'accessories_json', 'updated_at'
]);

backend.saveStudentMonsterConfig(mockSS, '701', '7A', {
  name: 'Pip',
  bodyShape: 'blob',
  bodyColor: 'cyan',
  eyeType: 'anime',
  mouthType: 'smile',
  hornType: 'antennae',
  cheekType: 'blush_dots',
  pattern: 'belly_patch',
  accessories: {
    hat: null,
    owned: ['hat_party'],
  },
});

// Attempt to equip an unowned reward
const lockedEquipRes = invokeGas(backend.handleStudentEquipAccessory, mockSS, {
  sessionToken: MOCK_STUDENT_TOKEN_701,
  slot: 'aura',
  itemId: 'aura_legendary',
});

assert(
  lockedEquipRes.success === false,
  'Backend rejects equipping locked/unowned reward aura_legendary'
);
assert(
  lockedEquipRes.code === 'NOT_OWNED',
  'Backend returns code NOT_OWNED for locked equipment attempt'
);

// Grant reward to student in Class_RewardGrants
const grantsSheet = mockSS.getSheetByName('Class_RewardGrants');
grantsSheet.appendRow([
  'grnt_701_rwd_legendary_aura', '701', 'rwd_legendary_aura', 'aura_legendary', '2026-2027', 250, new Date().toISOString()
]);

// Fetch monster with mergeClassroomRewardsIntoMonster
const fetchRes = invokeGas(backend.handleStudentGetMonster, mockSS, { sessionToken: MOCK_STUDENT_TOKEN_701 });
assert(fetchRes.success === true, 'student_get_monster succeeds');
assert(
  fetchRes.monster.accessories.owned.includes('aura_legendary'),
  'backend mergeClassroomRewardsIntoMonster automatically adds granted aura_legendary to owned'
);
assert(
  fetchRes.monster.accessories.owned.includes('hat_party'),
  'backend mergeClassroomRewardsIntoMonster preserves previously purchased hat_party'
);

// Now equip the owned reward
const ownedEquipRes = invokeGas(backend.handleStudentEquipAccessory, mockSS, {
  sessionToken: MOCK_STUDENT_TOKEN_701,
  slot: 'aura',
  itemId: 'aura_legendary',
});

assert(ownedEquipRes.success === true, 'Backend successfully equips owned aura_legendary');
assert(
  ownedEquipRes.monster.accessories.aura === 'aura_legendary',
  'Equipped accessories reflects aura_legendary in aura slot'
);

// Unequip slot
const unequipRes = invokeGas(backend.handleStudentEquipAccessory, mockSS, {
  sessionToken: MOCK_STUDENT_TOKEN_701,
  slot: 'aura',
  itemId: null,
});

assert(unequipRes.success === true, 'Backend successfully unequips aura slot');
assert(
  unequipRes.monster.accessories.aura === null || unequipRes.monster.accessories.aura === undefined,
  'Aura slot is now cleared'
);

// ---------------------------------------------------------------------------
// 6. 0-Coin Classroom Reward Purchase Protection
// ---------------------------------------------------------------------------
console.log('\n--- 6. Zero-Coin Purchase Block ---');

const monsterWorldPath = path.join(__dirname, 'src', 'components', 'monster', 'MonsterWorldScreen.tsx');
const monsterWorldContent = fs.readFileSync(monsterWorldPath, 'utf8');

assert(
  monsterWorldContent.includes('item.isClassroomReward') &&
  monsterWorldContent.includes('Locked •') &&
  monsterWorldContent.includes('pts in My Classroom'),
  'MonsterWorldScreen displays locked state notice for unearned classroom rewards'
);

assert(
  monsterWorldContent.includes("if (item.isClassroomReward) {") &&
  monsterWorldContent.includes("cannot be bought with coins"),
  'handleBuyAccessory explicitly blocks purchasing classroom rewards with coins'
);

// ---------------------------------------------------------------------------
// 7. Student My Classroom Equip/Unequip Toggles & Navigation
// ---------------------------------------------------------------------------
console.log('\n--- 7. Student My Classroom Screen Integration ---');

assert(
  myClassroomContent.includes('handleToggleEquip') &&
  myClassroomContent.includes('MonsterService.equipAccessory'),
  'StudentMyClassroomScreen provides inline handleToggleEquip handler'
);

assert(
  myClassroomContent.includes('Equip to Companion') &&
  myClassroomContent.includes('Equipped'),
  'StudentMyClassroomScreen renders Equip to Companion / Equipped toggle buttons on milestone cards'
);

assert(
  myClassroomContent.includes('Visit Monster World Wardrobe') &&
  myClassroomContent.includes("navigateTo({ view: 'monster-world' })"),
  'StudentMyClassroomScreen provides one-click direct shortcut to Monster World Wardrobe'
);

// ---------------------------------------------------------------------------
// 8. Student Profile Modal Frame & Badges Shelf
// ---------------------------------------------------------------------------
console.log('\n--- 8. Student Profile Modal Integration ---');

const profileModalPath = path.join(__dirname, 'src', 'components', 'gamification', 'StudentProfileModal.tsx');
const profileModalContent = fs.readFileSync(profileModalPath, 'utf8');

assert(
  profileModalContent.includes('frame={monsterConfig.accessories?.frame}'),
  'StudentProfileModal passes equipped frame to MonsterAvatar'
);

assert(
  profileModalContent.includes("id: 'badge_first_star'") &&
  profileModalContent.includes("id: 'badge_elite_speaker'"),
  'StudentProfileModal includes First Star and Elite Speaker badges in achievements shelf'
);

assert(
  profileModalContent.includes('ownedAccessories.includes'),
  'StudentProfileModal dynamically resolves unlocked status from owned accessories'
);

// ---------------------------------------------------------------------------
// 9. Monster World Wardrobe Boutique Mirror & Categories
// ---------------------------------------------------------------------------
console.log('\n--- 9. Monster World Wardrobe Boutique Integration ---');

assert(
  monsterWorldContent.includes('<div>Aura: {previewAccessories.aura || \'None\'}</div>') &&
  monsterWorldContent.includes('<div>Frame: {previewAccessories.frame || \'None\'}</div>'),
  'Fitting Room Mirror displays live equipped Aura and Frame status'
);

assert(
  monsterWorldContent.includes("setShopCategory('rewards')") &&
  monsterWorldContent.includes("setShopCategory('aura')") &&
  monsterWorldContent.includes("setShopCategory('frame')"),
  'Accessory catalog category bar contains Classroom Rewards, Auras, and Frames pills'
);

// ---------------------------------------------------------------------------
// 10. Multi-Size Avatar Scaling & Accessibility
// ---------------------------------------------------------------------------
console.log('\n--- 10. Multi-Size Avatar Scaling & Accessibility ---');

assert(
  avatarContent.includes("sm: 36") &&
  avatarContent.includes("md: 48") &&
  avatarContent.includes("lg: 84") &&
  avatarContent.includes("xl: 128") &&
  avatarContent.includes("studio: 220"),
  'SIZE_MAP covers all 5 standard avatar viewport sizes (36px to 220px)'
);

const appCssPath = path.join(__dirname, 'src', 'App.css');
const appCssContent = fs.readFileSync(appCssPath, 'utf8');

assert(
  appCssContent.includes('.aura-legendary-glow') &&
  appCssContent.includes('@keyframes auraGentlePulse'),
  'App.css contains .aura-legendary-glow keyframes animation'
);

assert(
  appCssContent.includes('@media (prefers-reduced-motion: reduce)') &&
  appCssContent.includes('.aura-legendary-glow {') &&
  appCssContent.includes('animation: none'),
  'App.css respects prefers-reduced-motion: reduce by disabling aura animations'
);

console.log('\n======================================================================');
console.log(`🎉 ALL PHASE 3.4D TESTS PASSED: ${passedChecks} / ${totalChecks} ASSERTIONS!`);
console.log('======================================================================\n');
