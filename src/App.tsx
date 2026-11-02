import React from 'react';
import { ArcadeProvider, useArcade } from './context/ArcadeContext';
import { ClassroomHeader } from './components/common/ClassroomHeader';
import { ToastContainer } from './components/common/ToastContainer';
import { HomeScreen } from './components/home/HomeScreen';
import { UnitLibraryScreen } from './components/library/UnitLibraryScreen';
import { UnitDashboardScreen } from './components/dashboard/UnitDashboardScreen';
import { TeacherPanelModal } from './components/teacher/TeacherPanelModal';
import { AnimatePresence, motion } from 'framer-motion';

const MainView: React.FC = () => {
  const { navigation, navigateTo } = useArcade();

  const isTeacherPanelOpen = navigation.view === 'teacher-panel';

  return (
    <div className="relative min-h-screen bg-[#080c18] bg-arcade-grid bg-radial-vignette text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Smartboard Sticky Header */}
      <ClassroomHeader />

      {/* Main Classroom View with Smooth Motion Transitions */}
      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {navigation.view === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="flex-1 flex flex-col"
            >
              <HomeScreen />
            </motion.div>
          )}

          {navigation.view === 'unit-library' && (
            <motion.div
              key={`library-${navigation.gradeId}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="flex-1 flex flex-col"
            >
              <UnitLibraryScreen gradeId={navigation.gradeId} />
            </motion.div>
          )}

          {navigation.view === 'unit-dashboard' && (
            <motion.div
              key={`dashboard-${navigation.gradeId}-${navigation.unitId}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="flex-1 flex flex-col"
            >
              <UnitDashboardScreen gradeId={navigation.gradeId} unitId={navigation.unitId} />
            </motion.div>
          )}

          {/* When teacher panel is the primary view, show the home screen in background */}
          {navigation.view === 'teacher-panel' && (
            <div className="flex-1 flex flex-col">
              <HomeScreen />
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Teacher Panel Modal Overlay */}
      <AnimatePresence>
        {isTeacherPanelOpen && (
          <TeacherPanelModal
            initialTab={navigation.initialTab || 'units'}
            targetGradeId={navigation.targetGradeId || 'grade-7'}
            onClose={() => navigateTo({ view: 'home' })}
          />
        )}
      </AnimatePresence>

      {/* Feedback Toast System */}
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <ArcadeProvider>
      <MainView />
    </ArcadeProvider>
  );
}

export default App;
