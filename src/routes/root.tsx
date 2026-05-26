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
import sortProblems from '../utils/sortProblems';
import { categorizeCategories } from '../utils/categorizeCategories';
import { getCategoryListOrdered } from '../utils/getCategoryListOrdered';
import { getLevel0ProblemsOrdered } from '../utils/getLevel0ProblemOrdered';

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
    categoryOpen,
    setCategoryOpen,
    selectedTab,
    setSelectedTab,
    searchedProblems,
    searchedBlogs,
    handleSelectedCategory,
    handleSelectedProblem,
  } = search;

  const [order, setOrder] = useState<string>("asc");
  const [orderBy, setOrderBy] = useState<string>("name");

  const sortedProblems = useMemo(() => {
    // level 0 has some sorting issues, so run the custom sort
    if(activeCategory === "Level 0"){
      const sortLevel0 = getLevel0ProblemsOrdered(searchedProblems ?? [])
      return sortLevel0;
    }

    const solvedProblems = progress.filter(
      (p) => p.passed_tests === p.total_tests
    ).map((p) => p.problem_title);

    return sortProblems(searchedProblems ?? [], solvedProblems, order, orderBy);
  }, [activeCategory, searchedProblems, progress, order, orderBy]);

  const [kbSelectedProblem, setKbSelectedProblem] = useState(activeProblem);
  const [kbSelectedCategory, setKbSelectedCategory] = useState(activeCategory);
  const [kbSelectedBlog, setKbSelectedBlog] = useState("");

  const [availableTabs, setAvailableTabs] = useState<string[]>([]);

  const problemListProps = {
    selectedTab,
    setSelectedTab,
    onTabsChange: setAvailableTabs,
    sortedProblems,
    selectedCategory: activeCategory,
    activeProblem,
    onSelectProblem: handleSelectedProblem,
    closeDrawer: () => setDrawerOpen(false),
    session,
    contractProgress,
    progress,
    kbSelectedProblem,
    order,
    setOrder,
    orderBy,
    setOrderBy
  };

  const blogListProps = {
    searchedBlogs: searchedBlogs,
    selectedTab,
    setSelectedTab,
    onTabsChange: setAvailableTabs,
    selectedCategory: activeCategory,
    activeBlog: activeProblem,
    closeDrawer: () => setDrawerOpen(false),
    kbSelectedBlog
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
    return ['blogs', ...getCategoryListOrdered(categories), ...specialCategories];
  }, [problems]);

  // keybinds navigation
  // TODO: single source of truth for this?
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    // Ctrl + D opens Drawer
    if(event.ctrlKey && event.key === "d"){
      event.preventDefault();
      setDrawerOpen(o => !o);
    }

    if(drawerOpen){
      // left / right opens category list
      // unless the category has tabs, in which case left / right navigates through them
      // if on the leftmost tab, left opens the category list
      if(event.key === "ArrowLeft"){
        if(availableTabs.length > 0){
          const currTabIndex = availableTabs.indexOf(selectedTab);
          if(currTabIndex <= 0){
            // on leftmost tab - open category list
            setKbSelectedCategory(activeCategory);
            setCategoryOpen(true);
          } else {
            // go to prev tab
            setSelectedTab(availableTabs[currTabIndex - 1]);
          }
        } else {
          // no tabs - open category list directly
          setKbSelectedCategory(activeCategory);
          setCategoryOpen(true);
        }
      }
      if(event.key === "ArrowRight"){
        if(categoryOpen) {
          setCategoryOpen(false);
        } else if(availableTabs.length > 0) {
          const currTabIndex = availableTabs.indexOf(selectedTab);
          if(currTabIndex < availableTabs.length - 1) {
            setSelectedTab(availableTabs[currTabIndex + 1]);
          }
          // on rightmost tab — do nothing
        }
      }

      if(categoryOpen){
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
        if(activeCategory === 'blogs'){
          // navigating through blog posts
          const blogSlugs = searchedBlogs
            .filter(b => {
              // filters by selectedTab if there are any
              return availableTabs.length > 0 
                && b.meta.category === selectedTab.toLowerCase();
            })
            .map(b => b.meta.blog_slug);
          // up / down selects blog post
          if(event.key === "ArrowUp"){
            event.preventDefault();
            const currentIndex = blogSlugs.indexOf(kbSelectedBlog ?? "");
            const prevIndex = currentIndex <= 0
              ? blogSlugs.length - 1
              : currentIndex - 1;
            setKbSelectedBlog(blogSlugs[prevIndex]);
          }
          if(event.key === "ArrowDown"){
            event.preventDefault();
            const currentIndex = blogSlugs.indexOf(kbSelectedBlog ?? "");
            const nextIndex = currentIndex >= blogSlugs.length - 1
              ? 0
              : currentIndex + 1;
            setKbSelectedBlog(blogSlugs[nextIndex]);
          }

          // select blog post
          if(event.key === "Enter"){
            event.preventDefault();
            if(kbSelectedBlog){
              navigate(`/blogs/${kbSelectedBlog}`);
              setDrawerOpen(false);
            }
          }
        } else {
          // navigating through problems in activeCategory

          // filters problems in active category
          const categoryProblems = sortedProblems
            .filter(p => {
              const questionType = p.meta.question_type[0];
              const cat = questionType === "coding"
                ? p.meta.category
                : questionType;
              return cat === activeCategory;
            })
            .filter(p => {
              // filters by selectedTab if there are any
              if(availableTabs.length > 0){
                return categorizeCategories(p) === selectedTab;
              }
              return p;
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
      }
    }
  }, [navigate, kbSelectedProblem, kbSelectedBlog, drawerOpen, categoryOpen, allCategories, sortedProblems, searchedBlogs, activeCategory, kbSelectedCategory, handleSelectedCategory, handleSelectedProblem, setDrawerOpen, setCategoryOpen, selectedTab, setSelectedTab, availableTabs]);

  // on selecting new category or tab, select first problem / blog available
  useEffect(() => {
    if(activeCategory === 'blogs'){
      const tabBlogs = searchedBlogs
        .filter(b => {
          return b.meta.category === selectedTab.toLowerCase();
        })
        .map(b => b.meta.blog_slug);
      
      const first = tabBlogs[0] ?? null;
      setKbSelectedBlog(first);
    } else {
      const tabProblems = sortedProblems
        .filter(p => {
          const questionType = p.meta.question_type[0];
          const cat = questionType === "coding" 
            ? p.meta.category 
            : questionType;
          return cat === activeCategory;
        })
        .filter(p => {
          if(availableTabs.length > 0) return categorizeCategories(p) === selectedTab;
          return p;
        })
        .map(p => p.meta.name);

      const first = tabProblems[0] ?? null;
      setKbSelectedProblem(first);
    }
  }, [selectedTab, activeCategory, availableTabs, sortedProblems, searchedBlogs]);

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
        categoryOpen={categoryOpen}
        setCategoryOpen={setCategoryOpen}
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
