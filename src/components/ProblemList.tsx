import { Button, Chip, LinearProgress, List, ListItemButton, Stack, Tab, TabList, TabPanel, Tabs, Typography } from '@mui/joy';
import { Problem, Submission } from '../types';
import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';
import { CaretDown, CheckCircle, MinusCircle } from '@phosphor-icons/react';
import { categorizeCategories } from '../utils/categorizeCategories';
import { getCompletedProblems } from '../utils/getCompletedProblems';
import { capitalizeString } from '../utils/capitalizeString';

interface ProblemListProps {
  searchedProblems: Problem[];
  selectedTab: string;
  setSelectedTab: (peep: string) => void;
  selectedTopic: string | null;
  activeProblem: string | null;
  onSelectProblem: (name: string) => void
  closeDrawer: () => void;
  session: Session | null;
}

type Order = "asc" | "desc";

export default function ProblemList({selectedTab, setSelectedTab, searchedProblems, selectedTopic, activeProblem, closeDrawer, session}: ProblemListProps) {
  const [error, setError] = useState("");
  const [progress, setProgress] = useState<Submission[]>([]);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState("name");

  const sortCategories = ["name", "completed", "difficulty"];
  
  const completedProblems = useMemo(() => {
    return getCompletedProblems(progress).filter((p) => p.category === selectedTopic)[0];
  }, [selectedTopic, progress]);
    
  const percentageCompleted = Math.round((completedProblems?.completed / completedProblems?.total) * 100);

  useEffect(() => {
    async function fetchProgress() {
      if (!session) return;
      const { user } = session;
      
      const {data: submissions, error } = await supabase
      .from('submissions')
      .select('problem_title, passed_tests, total_tests, question_type')
      .eq('profile_id', user.id);

      if(error) {
        setError(error.message);
      }

      setProgress(submissions || []);
    }

    fetchProgress();
  }, [session]);

  const problemsByTopic = searchedProblems.filter(problem => {
    const question_type = problem.meta.question_type[0];
    const category = question_type === "coding" ? problem.meta.category : question_type;
    return category === selectedTopic;
  });

  const problemsByCategory = problemsByTopic.reduce<Record<string, Problem[]>>((acc, problem) => {
    const problemCategories = problem.meta.question_type.includes("coding") ? "" : categorizeCategories(problem);
    if (!acc[problemCategories]) acc[problemCategories] = [];
    acc[problemCategories].push(problem);
    return acc;
  }, {});

  const solvedProblems = progress.filter((p) => {
    return p.passed_tests === p.total_tests;
  }).map((p) => p.problem_title);

  const uncompletedProblems = progress.filter((p) => {
    return p.passed_tests !== p.total_tests && !solvedProblems.includes(p.problem_title);
  }).map((p) => p.problem_title);

  sortProblems(problemsByCategory[selectedTab] || problemsByCategory[""], solvedProblems, order, orderBy);

  const handleTabChange = (_: any, newValue: any) => {
    if(newValue != null){
      setSelectedTab(newValue);
    }
  }

  const handleSort = (sortCategory: string) => {
    const isAsc = orderBy === sortCategory && order === "asc";

    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(sortCategory);
  }

  if (Object.keys(problemsByCategory).length === 0) {
    return (
      <Typography>No problems found</Typography>
    )
  }

  if (error) {
    return (
      <Typography color="danger">Error fetching problems: {error}</Typography>
    )
  }

  return(
    <Stack gap={1}>
      <Stack pr={4} gap={1}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" >
          <Typography level="h2">{selectedTopic ? selectedTopic.charAt(0).toUpperCase() + selectedTopic.slice(1): ""} - {completedProblems?.completed}/{completedProblems?.total}</Typography>
          <Typography level="h4">{percentageCompleted}%</Typography>
        </Stack>
        <LinearProgress sx={{ backgroundColor: "#D5D5D5" }} color="success" determinate value={percentageCompleted} size="lg" />
      </Stack>
      <List component="nav">
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <TabList>
            {Object.keys(problemsByCategory).sort().map((type) => (
               type ?
                <Tab key={type} value={type} variant="plain" color="neutral">
                {type}
              </Tab> : <></>
            ))}
          </TabList>

          <Stack pl={2} pt={2} pb={2} width="100%" direction="row" gap={1}>
            {
              sortCategories.map((sc) => {
                const active = orderBy === sc;

                return <Button
                  variant="plain"
                  onClick={() => handleSort(sc)}
                  color={active ? "primary" : "neutral"}
                  endDecorator={
                    <CaretDown size={20} opacity={ active ? 1 : 0 } />
                  }
                  sx={{
                    width: "10em",

                    "& svg": {
                      transition: "0.2s",
                      transform: active && order === "desc" ? "rotate(0deg)" : "rotate(180deg)"
                    },

                    "&:hover": { "& svg": { opacity: 1 } }
                  }}
                >{capitalizeString(sc)}</Button>
              })
            }
          </Stack>
          
          <TabPanel value={selectedTab} sx={{overflowY: 'auto', height:"80vh", pt: 0}}>
              <List sx={{ pt: 0 }}>
                { (problemsByCategory[selectedTab] || problemsByCategory[""]).map((p) => 
                    <ListItemButton className={"problems"} key={p.meta.name} selected={p.meta.name === activeProblem}
                        component={Link} to={`/problems/${p.meta.name}`} onClick={closeDrawer}>
                        <Stack width="100%" direction="row" justifyContent="space-between">
                          <Typography>{p.meta.title}</Typography>
                          <Stack direction="row" gap={1} justifyContent="center">
                            {
                              solvedProblems.includes(p.meta.name) && <CheckCircle size={24} color="#47f22f" />
                            }
                            {
                              uncompletedProblems.includes(p.meta.name) && <MinusCircle size={24} color="#939393" />
                            }
                            <DifficultyChip difficulty={p.meta.difficulty} />
                          </Stack>
                        </Stack>
                    </ListItemButton>,
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
      <Typography sx={{ color: "black" }} textAlign="center" width="4em" level="body-sm">{difficulty}</Typography>
    </Chip>
  )
}

function sortProblems(problemList: Problem[], solvedProblems: string[], order: Order, orderBy: string) {
  if (orderBy === "name") {
    problemList?.sort((a, b) => {
      if (order === "asc") return sortByName(a, b);
      else return -sortByName(a, b);
    });
  }

  if (orderBy === "completed") {
    problemList?.sort((a, b) => {
      if (order === "asc") return sortByCompleted(a, b, solvedProblems);
      else return -sortByCompleted(a, b, solvedProblems);
    });
  }

  if (orderBy === "difficulty") {
    problemList?.sort((a, b) => {
      if (order === "asc") return sortByDifficulty(a, b);
      else return -sortByDifficulty(a, b);
    });
  }
}

function sortByCompleted(a: Problem, b: Problem, solvedProblems: string[]) {
  const aIsSolved = solvedProblems.includes(a.meta.name);
  const bIsSolved = solvedProblems.includes(b.meta.name);

  if (aIsSolved && !bIsSolved) return -1;
  if (!aIsSolved && bIsSolved) return 1;

  return 0;
}

function sortByName(a: Problem, b: Problem) {
  const nameA = a.meta.title.toLowerCase();
  const nameB = b.meta.title.toLowerCase();

  if (nameA < nameB) return -1;
  if (nameA > nameB) return 1;

  return 0;
}

function sortByDifficulty(a: Problem, b: Problem) {
  const difficultyA = mapDifficulty(a.meta.difficulty);
  const difficultyB = mapDifficulty(b.meta.difficulty);

  return difficultyA - difficultyB;
}

function mapDifficulty(diff: string) {
  let num = -1;

  if (diff === "easy") num = 0; 
  if (diff === "medium") num = 1; 
  if (diff === "hard") num = 2;
  
  return num;
}
