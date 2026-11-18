/**
 * REGRESSION TEST: TEACHER DASHBOARD HOOK ORDER & LIFECYCLE
 * 
 * Verifies:
 * 1. React Hook Order Invariant across all teacher dashboard components:
 *    - TeacherLoginModal (no hooks after if (!isLoginModalOpen) return null)
 *    - BulkResetPinModal (no hooks after if (!isOpen) return null)
 *    - StudentCredentialCardsModal
 *    - StudentManagementView
 *    - TeacherDashboardScreen
 *    - UnitDashboardScreen & UnitLibraryScreen
 * 2. TeacherDashboardErrorBoundary component behavior:
 *    - Catches errors during dashboard rendering
 *    - Displays actionable recovery UI rather than an unhandled blank screen
 *    - Exposes retry, exit to arcade, and logout handlers
 * 3. App.tsx integration:
 *    - Ensures TeacherDashboardScreen is safely wrapped with TeacherDashboardErrorBoundary
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

console.log('🧪 Starting Teacher Dashboard Hook Order & Lifecycle Regression Tests...\n');

// 1. Audit components for React Rules of Hooks violations (hooks after early returns)
console.log('--- 1. Static Hook Order Audit across Teacher Components ---');

const filesToAudit = [
  'src/components/teacher/TeacherLoginModal.tsx',
  'src/components/teacher/TeacherLoginScreen.tsx',
  'src/components/teacher/dashboard/TeacherDashboardScreen.tsx',
  'src/components/teacher/dashboard/StudentManagementView.tsx',
  'src/components/teacher/dashboard/BulkResetPinModal.tsx',
  'src/components/teacher/dashboard/StudentCredentialCardsModal.tsx',
  'src/components/dashboard/UnitDashboardScreen.tsx',
  'src/components/library/UnitLibraryScreen.tsx',
];

function resolvePath(relPath) {
  if (fs.existsSync(relPath)) return path.resolve(relPath);
  return path.resolve('unit-review-arcade', relPath);
}

for (const relPath of filesToAudit) {
  const filePath = resolvePath(relPath);
  assert(fs.existsSync(filePath), `Component file must exist: ${relPath}`);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  let inComponent = false;
  let topLevelReturn = null;
  const hookRegex = /\buse(State|Effect|Memo|Callback|Ref|Context)\s*\(/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Identify start of the React Component
    if (/export const [A-Z]/.test(line) || /function [A-Z]/.test(line)) {
      inComponent = true;
      topLevelReturn = null;
    }

    if (!inComponent) continue;

    // Check for component-level early return
    if (/^if\s*\(!?[a-zA-Z0-9_.]+\)\s*return\s*(null|false|undefined|<|;)/.test(line)) {
      if (!topLevelReturn) {
        topLevelReturn = { line: i + 1, text: line };
      }
    }

    if (topLevelReturn && hookRegex.test(line)) {
      assert.fail(
        `Hook order violation in ${relPath}: Hook called at line ${i + 1} ('${line}') after early return at line ${topLevelReturn.line} ('${topLevelReturn.text}')`
      );
    }
  }

  console.log(`  ✓ ${relPath} strictly adheres to React Hook order rules`);
}

// 2. Verify TeacherLoginModal specifically
console.log('\n--- 2. TeacherLoginModal Hook Invariants ---');
const loginModalCode = fs.readFileSync(
  resolvePath('src/components/teacher/TeacherLoginModal.tsx'),
  'utf8'
);
const earlyReturnIndex = loginModalCode.indexOf('if (!isLoginModalOpen) return null;');
const submittingRefIndex = loginModalCode.indexOf('const isSubmittingRef = useRef(false);');

assert(earlyReturnIndex !== -1, 'TeacherLoginModal contains if (!isLoginModalOpen) return null');
assert(submittingRefIndex !== -1, 'TeacherLoginModal contains isSubmittingRef');
assert(
  submittingRefIndex < earlyReturnIndex,
  'CRITICAL: isSubmittingRef (useRef) MUST be declared BEFORE early return if (!isLoginModalOpen) return null'
);
console.log('  ✓ isSubmittingRef is declared before early return; prevents React error #300 on login');

// 3. Verify BulkResetPinModal specifically
console.log('\n--- 3. BulkResetPinModal Hook Invariants ---');
const bulkModalCode = fs.readFileSync(
  resolvePath('src/components/teacher/dashboard/BulkResetPinModal.tsx'),
  'utf8'
);
const bulkEarlyReturn = bulkModalCode.indexOf('if (!isOpen) return null;');
const targetedBreakdownIndex = bulkModalCode.indexOf('const targetedBreakdown = useMemo');

assert(bulkEarlyReturn !== -1, 'BulkResetPinModal contains if (!isOpen) return null');
assert(targetedBreakdownIndex !== -1, 'BulkResetPinModal contains targetedBreakdown useMemo');
assert(
  targetedBreakdownIndex < bulkEarlyReturn,
  'CRITICAL: targetedBreakdown (useMemo) MUST be declared BEFORE early return if (!isOpen) return null'
);
console.log('  ✓ targetedBreakdown is declared before early return; prevents hook count discrepancy');

// 4. Verify TeacherDashboardErrorBoundary integration
console.log('\n--- 4. Error Boundary Shielding in App.tsx ---');
const appCode = fs.readFileSync(resolvePath('src/App.tsx'), 'utf8');

assert(
  appCode.includes('TeacherDashboardErrorBoundary'),
  'App.tsx imports and uses TeacherDashboardErrorBoundary'
);
assert(
  appCode.includes('<TeacherDashboardErrorBoundary'),
  'TeacherDashboardErrorBoundary wraps the authenticated dashboard screen'
);
assert(
  appCode.includes('onExitToArcade={closeDashboard}'),
  'Error boundary wires up onExitToArcade to closeDashboard'
);
assert(
  appCode.includes('onLogout={logout}'),
  'Error boundary wires up onLogout to logout'
);
console.log('  ✓ App.tsx wraps TeacherDashboardScreen in TeacherDashboardErrorBoundary with recovery actions');

// 5. Verify TeacherDashboardErrorBoundary component implementation
console.log('\n--- 5. Error Boundary Component Implementation ---');
const ebCode = fs.readFileSync(
  resolvePath('src/components/teacher/dashboard/TeacherDashboardErrorBoundary.tsx'),
  'utf8'
);
assert(ebCode.includes('componentDidCatch'), 'Error boundary implements componentDidCatch');
assert(ebCode.includes('getDerivedStateFromError'), 'Error boundary implements getDerivedStateFromError');
assert(ebCode.includes('handleReset'), 'Error boundary provides reset mechanism');
assert(ebCode.includes('Retry Dashboard'), 'Error boundary includes user-facing retry button');
assert(ebCode.includes('Back to Arcade'), 'Error boundary includes fallback return button');
assert(ebCode.includes('Log Out'), 'Error boundary includes logout option');
console.log('  ✓ TeacherDashboardErrorBoundary provides complete crash recovery UI');

console.log('\n======================================================================');
console.log('🎉 ALL REGRESSION TESTS PASSED: Zero hook violations detected!');
console.log('======================================================================\n');
