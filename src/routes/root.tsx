import { useState } from 'react';
import { Outlet, useLoaderData } from 'react-router';
import { Problem, ProblemSessionStats } from '../types';
import { supabase } from '../supabaseClient';
import { Box, Stack } from '@mui/joy';

import getProblemSet from '../utils/getProblemSet';

import useAuth from '../hooks/useAuth';
import useSessionManagement from '../hooks/useSessionManagement';
import useSearchAndFilter from '../hooks/useSearchAndFilter';
import useContractData from '../hooks/useContractData';

import MainLayout from '../components/layout/MainLayout';
import SidebarDrawer from '../components/layout/SidebarDrawer';
import UpperNavBar from '../components/layout/UpperNavBar';
import AppHeader from '../components/layout/AppHeader';
import useTestCategoriesSync from '../hooks/useTestCategoriesSync';

export default function App() {
  const problems = useLoaderData() as Problem[];

  // Retrieve test categories and store in db
  useTestCategoriesSync(problems);

  const { session, userData, isAdmin, isRecoverySession, fetchProfile } = useAuth();
  const { progress, contractProgress, fetchProgress } = useContractData(session);
  const {
    activeSession, sessionId, sessionDuration,sessionRemainingSeconds,plannedExerciseCount,
    sessionTimerRunning, endSession,formatTime, } = useSessionManagement(session);

  const [problemSessionStats, setProblemSessionStats] = useState<Record<string, ProblemSessionStats>>({});

  const search = useSearchAndFilter(problems);

  const {
    query, setQuery, difficulty, setDifficulty, activeCategory, activeProblem,
    setActiveProblem, open, setOpen, openCategory, setOpenCategory, selectedTab,
    setSelectedTab, searchedProblems, searchedBlogs, handleSelectedCategory,
    handleSelectedProblem, 
  } = search;

  const problemListProps = {
    selectedTab, setSelectedTab, searchedProblems, selectedCategory: activeCategory,
    activeProblem, onSelectProblem: handleSelectedProblem, closeDrawer: () => setOpen(false),
    session, contractProgress, progress,
  };

  const blogListProps = {
    searchedBlogs: searchedBlogs, selectedTab, setSelectedTab, selectedCategory: activeCategory,
    activeBlog: activeProblem, closeDrawer: () => setOpen(false),
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <MainLayout openDrawer={() => setOpen(true)}>
      <SidebarDrawer
        open={open} onClose={() => setOpen(false)} openCategory={openCategory}
        setOpenCategory={setOpenCategory} difficulty={difficulty} setDifficulty={setDifficulty}
        query={query} setQuery={setQuery} searchedProblems={searchedProblems} searchedBlogs={searchedBlogs}
        activeCategory={activeCategory} handleSelectedCategory={handleSelectedCategory}
        problemListProps={problemListProps} blogListProps={blogListProps} selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />

      <Stack sx={{ width: '100%' }}>
        <UpperNavBar
          openDrawer={() => setOpen(true)} session={session} isRecoverySession={isRecoverySession}
          activeSession={activeSession} sessionTimerRunning={sessionTimerRunning} formatTime={formatTime}
          sessionRemainingSeconds={sessionRemainingSeconds} endSession={endSession} sessionId={sessionId}
          userData={userData} isAdmin={isAdmin} signOut={signOut}
        />

        <AppHeader />

        <Box width="100%" height="100%">
          <Outlet
            context={{
              setActiveProblem, session, isAdmin, refetchProgress: fetchProgress,
              refetchProfile: fetchProfile, activeSession, sessionId, sessionRemainingSeconds,
              sessionDuration, plannedExerciseCount, problemSessionStats, setProblemSessionStats,
              progress, sessionTimerRunning,
            }}
          />
        </Box>
      </Stack>
    </MainLayout>
  );
}

export async function problemListLoader(): Promise<Problem[]> {
  return await getProblemSet() as Problem[];
}
