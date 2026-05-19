import { useCallback, useEffect, useMemo, useState } from 'react';
import { Outlet, useLoaderData, useNavigate } from 'react-router';
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

export default function App() {
  const problems = useLoaderData() as Problem[];
  const navigate = useNavigate();

  const { session, userData, isAdmin, isRecoverySession, fetchProfile } = useAuth();
  const { progress, contractProgress, fetchProgress } = useContractData(session);
  const {
    activeSession, sessionId, sessionDuration,sessionRemainingSeconds,plannedExerciseCount,
    sessionTimerRunning, endSession,formatTime, } = useSessionManagement(session);

  const [problemSessionStats, setProblemSessionStats] = useState<Record<string, ProblemSessionStats>>({});

  const search = useSearchAndFilter(problems);

  const {
    query,
    setQuery,
    difficulty,
    setDifficulty,
    activeCategory,
    activeProblem,
    setActiveProblem,
    drawerOpen,
    setDrawerOpen,
    openCategory,
    setOpenCategory,
    selectedTab,
    setSelectedTab,
    searchedProblems,
    searchedBlogs,
    handleSelectedCategory,
    handleSelectedProblem,
  } = search;

  const [kbSelectedProblem, setKbSelectedProblem] = useState(activeProblem);
  const [kbSelectedCategory, setKbSelectedCategory] = useState(activeCategory);


  const problemListProps = {
    selectedTab,
    setSelectedTab,
    searchedProblems,
    selectedCategory: activeCategory,
    activeProblem,
    onSelectProblem: handleSelectedProblem,
    closeDrawer: () => setDrawerOpen(false),
    session,
    contractProgress,
    progress,
    kbSelectedProblem
  };

  const blogListProps = {
    searchedBlogs: searchedBlogs,
    selectedTab,
    setSelectedTab,
    selectedCategory: activeCategory,
    activeBlog: activeProblem,
    closeDrawer: () => setDrawerOpen(false),
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const allCategories = useMemo(() => {
    const categories = problems
      .map((c) => c.meta.category)
      .filter((c, index, array) => array.indexOf(c) === index)
      .sort((a, b) => a.localeCompare(b));

    const specialCategories: string[] = [];
    if(problems.some(p => p.meta.question_type[0] === "haystack")) specialCategories.push("haystack");
    if(problems.some(p => p.meta.question_type[0] === "mutation")) specialCategories.push("mutation");
  
    return [...categories, ...specialCategories];
  }, [problems]);

  // keybinds navigation
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    // Ctrl + D opens Drawer
    if(event.ctrlKey && event.key === "d"){
      event.preventDefault();
      setDrawerOpen(o => !o);
    }

    if(drawerOpen){
      if(openCategory){
        // up / down selects category
        if(event.key === "ArrowUp"){
          event.preventDefault();
          const currentIndex = allCategories.indexOf(kbSelectedCategory ?? "");
          const prevIndex = currentIndex <= 0 
            ? allCategories.length - 1
            : currentIndex - 1;
          setKbSelectedCategory(allCategories[prevIndex]);
        }
        if(event.key === "ArrowDown"){
          event.preventDefault();
          const currentIndex = allCategories.indexOf(kbSelectedCategory ?? "");
          const nextIndex = currentIndex >= allCategories.length - 1
            ? 0
            : currentIndex + 1;
          setKbSelectedCategory(allCategories[nextIndex]);
        }

        // select category
        if (event.key === "Enter") {
          event.preventDefault();
          if (kbSelectedCategory) handleSelectedCategory(kbSelectedCategory);
        }
      }
      else{
        // filters problems in active category
        const categoryProblems = searchedProblems
          .filter(p => {
            const questionType = p.meta.question_type[0];
            const cat = questionType === "coding"
              ? p.meta.category
              : questionType;
            return cat === activeCategory;
          })
          .map(p => p.meta.name);
        
        // up / down selects problem
        if(event.key === "ArrowUp"){
          event.preventDefault();
          const currentIndex = categoryProblems.indexOf(kbSelectedProblem ?? "");
          const prevIndex = currentIndex <= 0 
            ? categoryProblems.length - 1 
            : currentIndex - 1;
          setKbSelectedProblem(categoryProblems[prevIndex]);
        }
        if(event.key === "ArrowDown"){
          event.preventDefault();
          const currentIndex = categoryProblems.indexOf(kbSelectedProblem ?? "");
          const nextIndex = currentIndex >= categoryProblems.length - 1 
            ? 0
            : currentIndex + 1;
          setKbSelectedProblem(categoryProblems[nextIndex]);
        }

        // select new problem
        if(event.key === "Enter"){
          event.preventDefault();
          if(kbSelectedProblem){
            handleSelectedProblem(kbSelectedProblem);
            navigate(`/problems/${kbSelectedProblem}`);
          }
        }
      }

      // left / right opens category list
      if(event.key === "ArrowLeft"){
        setKbSelectedCategory(activeCategory);
        setOpenCategory(true);
      }
      if(event.key === "ArrowRight"){
        setKbSelectedCategory(activeCategory);
        setOpenCategory(false);
      }
    }
  }, [navigate, kbSelectedProblem, drawerOpen, openCategory, allCategories, searchedProblems, activeCategory, kbSelectedCategory]);

  // on new category selected, set selectedProblem to first problem
  useEffect(() => {
    const first = searchedProblems
      .filter(p => p.meta.category === activeCategory)
      .map(p => p.meta.name)[0] ?? null;
    setKbSelectedProblem(activeProblem ?? first);
  }, [activeCategory, searchedProblems]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <MainLayout openDrawer={() => setDrawerOpen(true)}>
      <SidebarDrawer
        drawerOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        openCategory={openCategory}
        setOpenCategory={setOpenCategory}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        query={query}
        setQuery={setQuery}
        searchedProblems={searchedProblems}
        searchedBlogs={searchedBlogs}
        activeCategory={activeCategory}
        handleSelectedCategory={handleSelectedCategory}
        problemListProps={problemListProps}
        blogListProps={blogListProps}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        kbSelectedCategory={kbSelectedCategory}
      />

      <Stack sx={{ width: '100%' }}>
        <UpperNavBar
          openDrawer={() => setDrawerOpen(true)}
          session={session}
          isRecoverySession={isRecoverySession}
          activeSession={activeSession}
          sessionTimerRunning={sessionTimerRunning}
          formatTime={formatTime}
          sessionRemainingSeconds={sessionRemainingSeconds}
          endSession={endSession}
          sessionId={sessionId}
          userData={userData}
          isAdmin={isAdmin}
          signOut={signOut}
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
