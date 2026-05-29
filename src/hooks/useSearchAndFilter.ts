import { useState, useEffect, useMemo, useCallback } from 'react';
import { Problem, BlogPost } from '../types';
import getBlogPosts from '../utils/blogs/getBlogPosts';
import type { Dispatch, SetStateAction } from 'react';

interface UseSearchAndFilterReturn {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  difficulty: string;
  setDifficulty: Dispatch<SetStateAction<string>>;
  activeCategory: string | null;
  setActiveCategory: Dispatch<SetStateAction<string | null>>;
  activeProblem: string | null;
  setActiveProblem: Dispatch<SetStateAction<string | null>>;
  drawerOpen: boolean;
  setDrawerOpen: Dispatch<SetStateAction<boolean>>;
  categoryOpen: boolean;
  setCategoryOpen: Dispatch<SetStateAction<boolean>>;
  selectedTab: string;
  setSelectedTab: Dispatch<SetStateAction<string>>;
  searchedProblems: Problem[];
  searchedBlogs: BlogPost[];
  handleSelectedCategory: (category: string) => void;
  handleSelectedProblem: (name: string) => void;
}

export default function useSearchAndFilter(problems: Problem[]): UseSearchAndFilterReturn {
  const [query, setQuery] = useState('');
  const [difficulty, setDifficulty] = useState('');

  const [activeCategory, setActiveCategory] = useState<string | null>(() => 'Level 0');
  const [activeProblem, setActiveProblem] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('');
  const [searchedBlogs, setSearchedBlogs] = useState<BlogPost[]>([]);

  let newDifficulty = difficulty;
  if (newDifficulty === 'all') newDifficulty = '';

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      return (
        problem.meta.title.toLowerCase().includes(query.toLowerCase().trim()) &&
        problem.meta.difficulty.includes(newDifficulty)
      );
    });
  }, [problems, query, newDifficulty]);

  useEffect(() => {
    (async () => {
      const posts = await getBlogPosts();
      setSearchedBlogs(posts);
    })();
  }, []);

  const handleSelectedCategory = useCallback((category: string) => {
    setActiveCategory(category);
    setActiveProblem(null);
    setCategoryOpen(false);
    if (category === 'coding') setSelectedTab('');
    if (category === 'blogs') setSelectedTab('Meta');
    else setSelectedTab('List');
  }, []);

  const handleSelectedProblem = useCallback((name: string) => {
    setActiveProblem(name);
    setDrawerOpen(false);
  }, []);

  return {
    query,
    setQuery,
    difficulty,
    setDifficulty,
    activeCategory,
    setActiveCategory,
    activeProblem,
    setActiveProblem,
    drawerOpen,
    setDrawerOpen,
    categoryOpen,
    setCategoryOpen,
    selectedTab,
    setSelectedTab,
    searchedProblems: filteredProblems,
    searchedBlogs,
    handleSelectedCategory,
    handleSelectedProblem,
  };
}
