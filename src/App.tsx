import React from 'react';
import { ArcadeProvider, useArcade } from './context/ArcadeContext';
import { AuthProvider } from './context/AuthContext';
import { TeacherAuthProvider, useTeacherAuth } from './context/TeacherAuthContext';
import { GamificationProvider } from './context/GamificationContext';
import { PersonalizedLearningProvider } from './context/PersonalizedLearningContext';
import { ClassroomHeader } from './components/common/ClassroomHeader';
import { ToastContainer } from './components/common/ToastContainer';
import { StudentLoginModal } from './components/auth/StudentLoginModal';
import { StudentProfileModal } from './components/gamification/StudentProfileModal';
import { ClassLeaderboardModal } from './components/gamification/ClassLeaderboardModal';
import { MyMistakesModal } from './components/personalized/MyMistakesModal';
import { TopicMasteryModal } from './components/personalized/TopicMasteryModal';
import { SmartReviewModal } from './components/personalized/SmartReviewModal';
import { HomeScreen } from './components/home/HomeScreen';
import { UnitLibraryScreen } from './components/library/UnitLibraryScreen';
import { UnitDashboardScreen } from './components/dashboard/UnitDashboardScreen';
import { TeacherPanelModal } from './components/teacher/TeacherPanelModal';
import { TeacherLoginModal } from './components/teacher/TeacherLoginModal';
import { TeacherDashboardScreen } from './components/teacher/dashboard/TeacherDashboardScreen';
import { GameContainer } from './components/game/GameContainer';
import { GamesZoneContainer } from './components/gamesZone/GamesZoneContainer';
import { useAuth } from './context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';

const MainView: React.FC = () => {
  const { navigation, navigateTo } = useArcade();
  const { isDashboardOpen } = useTeacherAuth();
  const { student } = useAuth();

  const isTeacherPanelOpen = navigation.view === 'teacher-panel';

  // Dedicated, standalone Teacher Monitoring Cockpit view
  // Isolates dashboard rendering completely; unmounts the arcade home screen and classroom header
  if (isDashboardOpen) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
        <TeacherDashboardScreen />
        <TeacherLoginModal />
        <ToastContainer />
      </div>
    );
  }

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

          {navigation.view === 'game-play' && (
            <motion.div
              key={`game-${navigation.gradeId}-${navigation.unitId}-${navigation.activityId}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="flex-1 flex flex-col"
            >
              <GameContainer />
            </motion.div>
          )}

          {navigation.view === 'games-zone' && (
            <motion.div
              key="games-zone"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="flex-1 flex flex-col"
            >
              <GamesZoneContainer
                selectedGrade={student ? student.grade : (navigation.gradeId || 'grade-7')}
                onSelectGrade={(g) => {
                  if (student && g !== student.grade) return;
                  navigateTo({ view: 'games-zone', gradeId: g });
                }}
                onBackToHome={() => navigateTo({ view: 'home' })}
                studentNumber={student?.studentNumber || 'guest'}
                studentClass={student?.class}
              />
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

      {/* Teacher Panel Modal Overlay (Local Content Editor) */}
      <AnimatePresence>
        {isTeacherPanelOpen && (
          <TeacherPanelModal
            initialTab={navigation.initialTab || 'units'}
            targetGradeId={navigation.targetGradeId || 'grade-7'}
            onClose={() => navigateTo({ view: 'home' })}
          />
        )}
      </AnimatePresence>

      {/* Teacher Master Passphrase Authentication Modal */}
      <TeacherLoginModal />

      {/* Student Authentication Modal */}
      <StudentLoginModal />

      {/* Student Gamification Profile Modal */}
      <StudentProfileModal />

      {/* Class Leaderboard Modal */}
      <ClassLeaderboardModal />

      {/* Phase 6: Personalized Learning Modals */}
      <MyMistakesModal />
      <TopicMasteryModal />
      <SmartReviewModal />

      {/* Feedback Toast System */}
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <TeacherAuthProvider>
        <ArcadeProvider>
          <GamificationProvider>
            <PersonalizedLearningProvider>
              <MainView />
            </PersonalizedLearningProvider>
          </GamificationProvider>
        </ArcadeProvider>
      </TeacherAuthProvider>
    </AuthProvider>
  );
}

export default App;

