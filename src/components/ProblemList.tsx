import {
  Button,
  Chip,
  LinearProgress,
  List,
  ListItemButton,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Typography,
} from "@mui/joy";
import { ContractProgress, Problem, Progress, Submission } from '../types';
import { Link } from 'react-router-dom';
import { useEffect, useMemo, useRef } from 'react';
import { Session } from '@supabase/supabase-js';
import { CaretDown, CheckCircle, MinusCircle } from '@phosphor-icons/react';
import { categorizeCategories } from '../utils/categorizeCategories';
import { getCompletedProblems } from '../utils/getCompletedProblems';
import { capitalizeString } from '../utils/capitalizeString';
import sortProblems from '../utils/sortProblems';

export interface ProblemListItemProps {
  problem: Problem;
  activeProblem: string | null;
  closeDrawer: () => void;
  kbSelectedProblem: string | null;
  attempted: boolean;
  solved: boolean;
}

function ProblemListItem({ problem, activeProblem, closeDrawer, kbSelectedProblem, attempted, solved }: ProblemListItemProps){
  const itemRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (problem.meta.name === kbSelectedProblem) {
      itemRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [kbSelectedProblem, problem.meta.name]);
  
  return (
    <ListItemButton
      ref={itemRef}
      className="problems" 
      key={problem.meta.name} 
      selected={problem.meta.name === activeProblem}
      component={Link} 
      to={`/problems/${problem.meta.name}`} 
      onClick={closeDrawer}
      sx={
        problem.meta.name === kbSelectedProblem
          ? { backgroundColor: '#FFE293 !important' }
          : {}
      }
    >
      <Stack width="100%" direction="row" justifyContent="space-between">
        <Typography sx={{fontFamily: "Victor Mono"}}>{problem.meta.title}</Typography>
        <Stack direction="row" gap={1} justifyContent="center">
          {
            solved && <CheckCircle size={24} color="#47f22f" />
          }
          {
            attempted && !solved && <MinusCircle size={24} color="#939393" />
          }
          <DifficultyChip difficulty={problem.meta.difficulty} />
        </Stack>
      </Stack>
    </ListItemButton>
  )
}

interface ProblemListProgressProps {
  selectedCategory: string | null;
  completedProblems: Progress;
  contractProgress: ContractProgress;
  percentageCompleted: number;
}

function ProblemListProgress({
  selectedCategory,
  completedProblems,
  contractProgress,
  percentageCompleted
}: ProblemListProgressProps){
  return (
    <Stack pr={4} gap={1}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography
          level="h1"
          sx={{ fontFamily: '"Press Start 2P"', fontWeight: "100", fontSize: "20pt" }}
        >
          {selectedCategory ? capitalizeString(selectedCategory) : ""} -{" "}
          {completedProblems?.completed}/
          {contractProgress[selectedCategory!!] || (completedProblems?.total ?? 0)}
        </Typography>
        <Typography level="h4">{percentageCompleted}%</Typography>
      </Stack>
      <LinearProgress
        className="problemList-progressBar"
        determinate
        value={percentageCompleted}
        size="lg"
        thickness={15}
      />
    </Stack>
  );
}

interface ProblemListSortButtonsProps {
  sortCategories: string[];
  order: string;
  orderBy: string;
  problemsFound: number;
  handleSort: (sortCategory: string) => void;
}

function ProblemListSortButtons({
  sortCategories,
  order,
  orderBy,
  problemsFound,
  handleSort
}: ProblemListSortButtonsProps){
  return (
    <Stack
      pl={1}
      pt={1}
      pb={1}
      width="100%"
      direction="row"
      gap={2}
      alignItems="center"
      className="sort-parent"
    >
      {sortCategories.map((sc, index) => {
        const active = orderBy === sc;

        return (
          <Button
            key={index}
            className="problemList-sortButton"
            variant="plain"
            onClick={() => handleSort(sc)}
            color={active ? "primary" : "neutral"}
            endDecorator={<CaretDown size={20} opacity={active ? 1 : 0} />}
            sx={{
              width: "10em",

              "& svg": {
                transition: "0.2s",
                transform: active && order === "desc" ? "rotate(0deg)" : "rotate(180deg)",
              },

              "&:hover": { "& svg": { opacity: 1 } },
            }}
          >
            {capitalizeString(sc)}
          </Button>
        );
      })}
      <Typography fontFamily="Victor Mono">
        {problemsFound} problem{problemsFound !== 1 ? "s" : ""} found
      </Typography>
    </Stack>
  );
}

export interface ProblemListProps {
  sortedProblems: Problem[];
  selectedTab: string;
  setSelectedTab: (peep: string) => void;
  onTabsChange: (tabs: string[]) => void;
  selectedCategory: string | null;
  activeProblem: string | null;
  closeDrawer: () => void;
  session: Session | null;
  contractProgress: ContractProgress;
  progress: Submission[];
  kbSelectedProblem: string | null;
  order: string;
  setOrder: (order: string) => void;
  orderBy: string;
  setOrderBy: (orderBy: string) => void;
}

export default function ProblemList({
  selectedTab,
  setSelectedTab,
  onTabsChange,
  sortedProblems,
  selectedCategory,
  activeProblem,
  closeDrawer,
  session,
  contractProgress,
  progress,
  kbSelectedProblem,
  order,
  setOrder,
  orderBy,
  setOrderBy
}: ProblemListProps) {
  const sortCategories = ["name", "completed", "difficulty"];

  // force Level 0 to be sorted ascending and by name
  useEffect(() => {
    if(selectedCategory === "Level 0"){
      setOrder("asc");
      setOrderBy("name");
    }
  }, [selectedCategory, setOrder, setOrderBy]);

  const completedProblems = useMemo(() => {
    return getCompletedProblems(progress).filter((p) => p.category === selectedCategory)[0];
  }, [selectedCategory, progress]);

  let percentageCompleted = Math.round(
    (completedProblems?.completed /
      (contractProgress[selectedCategory!!] || (completedProblems?.total ?? 0))) *
      100,
  );
  if (percentageCompleted > 100) percentageCompleted = 100;
  if (isNaN(percentageCompleted)) percentageCompleted = 0;

  const problemsByTopic = sortedProblems.filter((problem) => {
    const question_type = problem.meta.question_type[0];
    const category =
      question_type === "coding" || question_type === "test"
        ? problem.meta.category
        : question_type;
    return category === selectedCategory;
  });

  const problemsByCategory = problemsByTopic.reduce<Record<string, Problem[]>>((acc, problem) => {
    const problemCategories =
      problem.meta.question_type.includes("coding") || problem.meta.question_type.includes("test")
        ? ""
        : categorizeCategories(problem);
    if (!acc[problemCategories]) acc[problemCategories] = [];
    acc[problemCategories].push(problem);
    return acc;
  }, {});

  useEffect(() => {
    const tabs = Object.keys(problemsByCategory).sort().filter(Boolean);
    onTabsChange(tabs);
  }, [problemsByCategory, onTabsChange]);

  const solvedProblems = useMemo(
    () => progress.filter((p) => p.passed_tests === p.total_tests).map((p) => p.problem_title),
    [progress],
  );

  const unsolvedProblems = useMemo(
    () =>
      progress
        .filter(
          (p) => p.passed_tests !== p.total_tests && !solvedProblems.includes(p.problem_title),
        )
        .map((p) => p.problem_title),
    [progress, solvedProblems],
  );

  const displayedProblems = sortProblems(
    problemsByCategory[selectedTab] || problemsByCategory[""],
    solvedProblems,
    order,
    orderBy,
  );

  const handleTabChange = (_: any, newValue: any) => {
    if (newValue != null) {
      setSelectedTab(newValue);
    }
  };

  const handleSort = (sortCategory: string) => {
    const isAsc = orderBy === sortCategory && order === "asc";

    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(sortCategory);
  };

  const problemsFound = problemsByTopic.length;

  return (
    <Stack gap={1} className="stack-problemList">
      {!!session ? (
        <ProblemListProgress
          selectedCategory={selectedCategory}
          completedProblems={completedProblems}
          contractProgress={contractProgress}
          percentageCompleted={percentageCompleted}
        />
      ) : (
        <Typography
          level="h1"
          sx={{ fontFamily: '"Press Start 2P"', fontWeight: "100", fontSize: "20pt" }}
        >
          {selectedCategory ? capitalizeString(selectedCategory) : ""}
        </Typography>
      )}

      <List component="nav">
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <TabList>
            {Object.keys(problemsByCategory)
              .sort()
              .filter(Boolean)
              .map((type) => (
                <Tab
                  key={type}
                  value={type}
                  variant="plain"
                  color="neutral"
                  sx={{ fontFamily: "Silkscreen" }}
                >
                  {type}
                </Tab>
              ))}
          </TabList>

          {
            // hide sort buttons on Level 0 category
            selectedCategory !== "Level 0"
              ? <ProblemListSortButtons 
                  sortCategories={sortCategories}
                  order={order}
                  orderBy={orderBy}
                  problemsFound={problemsFound}
                  handleSort={handleSort}
                />
              : <></>
          }
          
          <TabPanel className="problemList-list" value={selectedTab} sx={{overflowY: 'auto', height:"60vh", pt: 0}}>
            <List sx={{ pt: 0 }}>
              { displayedProblems?.map((p) => 
                <ProblemListItem
                  key={p.meta.name}
                  problem={p}
                  activeProblem={activeProblem}
                  closeDrawer={closeDrawer}
                  kbSelectedProblem={kbSelectedProblem}
                  attempted={unsolvedProblems.includes(p.meta.name)}
                  solved={solvedProblems.includes(p.meta.name)}
                />
              )}
            </List>
          </TabPanel>
        </Tabs>
      </List>
    </Stack>
  );
}

function DifficultyChip({ difficulty }: { difficulty: string }) {
  let color: "neutral" | "success" | "warning" | "danger" = "neutral";

  if (difficulty === "easy") color = "success";
  if (difficulty === "medium") color = "warning";
  if (difficulty === "hard") color = "danger";

  return (
    <Chip variant="soft" color={color}>
      <Typography sx={{ color: "black" }} textAlign="center" width="4em" level="body-sm">
        {difficulty}
      </Typography>
    </Chip>
  );
}
