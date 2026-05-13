import { useState, useEffect, useMemo, useCallback } from 'react';
import { Problem, BlogPost } from '../types';
import getBlogPosts from '../utils/getBlogPosts';

interface UseSearchAndFilterReturn {
  query: string;
  setQuery: (query: string) => void;
  difficulty: string;
  setDifficulty: (difficulty: string) => void;
  activeCategory: string | null;
  setActiveCategory: (category: string | null) => void;
  activeProblem: string | null;
  setActiveProblem: (problem: string | null) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  openCategory: boolean;
  setOpenCategory: (open: boolean) => void;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  searchedProblems: Problem[];
  searchedBlogs: BlogPost[];
  handleSelectedCategory: (category: string) => void;
  handleSelectedProblem: (name: string) => void;
}

export default function useSearchAndFilter(problems: Problem[]): UseSearchAndFilterReturn {
  const [query, setQuery] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(() => 'Fundamentals');
  const [activeProblem, setActiveProblem] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [selectedTab, setSelectedTab] = useState('');
  const [searchedProblems, setSearchedProblems] = useState<Problem[]>([]);
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
    setSearchedProblems(filteredProblems);
  }, [filteredProblems]);

  useEffect(() => {
    (async () => {
      const posts = await getBlogPosts();
      setSearchedBlogs(posts);
    })();
  }, []);

  const handleSelectedCategory = useCallback((category: string) => {
    setActiveCategory(category);
    setActiveProblem(null);
    setOpenCategory(false);
    if (category === 'coding') setSelectedTab('');
    else setSelectedTab('List');
  }, []);

  const handleSelectedProblem = useCallback((name: string) => {
    setActiveProblem(name);
    setOpen(false);
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
    open,
    setOpen,
    openCategory,
    setOpenCategory,
    selectedTab,
    setSelectedTab,
    searchedProblems,
    searchedBlogs,
    handleSelectedCategory,
    handleSelectedProblem,
  };
}
