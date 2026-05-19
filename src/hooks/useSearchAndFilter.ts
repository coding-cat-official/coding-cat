import { useState, useEffect, useMemo, useCallback } from 'react';
import { Problem, BlogPost } from '../types';
import getBlogPosts from '../utils/getBlogPosts';
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
  openCategory: boolean;
  setOpenCategory: Dispatch<SetStateAction<boolean>>;
  selectedTab: string;
  setSelectedTab: Dispatch<SetStateAction<string>>;
  searchedProblems: Problem[];
  searchedBlogs: BlogPost[];
  handleSelectedCategory: (category: string) => void;
  handleSelectedProblem: (name: string) => void;
  keyboardSelectedProblem: string | null;
  keyboardSelectedCategory: string | null;
}

export default function useSearchAndFilter(problems: Problem[]): UseSearchAndFilterReturn {
  const [query, setQuery] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(() => 'Fundamentals');
  const [activeProblem, setActiveProblem] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [selectedTab, setSelectedTab] = useState('');
  const [searchedProblems, setSearchedProblems] = useState<Problem[]>([]);
  const [searchedBlogs, setSearchedBlogs] = useState<BlogPost[]>([]);

  const [keyboardSelectedProblem, setKeyboardSelectedProblem] = useState(activeProblem);
  const [keyboardSelectedCategory, setKeyboardSelectedCategory] = useState(activeCategory);

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
    openCategory,
    setOpenCategory,
    selectedTab,
    setSelectedTab,
    searchedProblems,
    searchedBlogs,
    handleSelectedCategory,
    handleSelectedProblem,
    keyboardSelectedProblem,
    keyboardSelectedCategory
  };
}
