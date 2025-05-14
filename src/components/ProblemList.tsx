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
import sortProblems from '../utils/sortProblems';

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

export default function ProblemList({selectedTab, setSelectedTab, searchedProblems, selectedTopic, activeProblem, closeDrawer, session}: ProblemListProps) {
  const [error, setError] = useState("");
  const [progress, setProgress] = useState<Submission[]>([]);
  const [order, setOrder] = useState("asc");
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
    <Stack gap={1} className="stack-problemList">
      <Stack pr={4} gap={1}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" >
          <Typography level="h1" sx={{fontFamily: '"Press Start 2P"', fontWeight: "100", fontSize: "20pt"}}>{selectedTopic ? selectedTopic.charAt(0).toUpperCase() + selectedTopic.slice(1): ""} - {completedProblems?.completed}/{completedProblems?.total}</Typography>
          <Typography level="h4">{percentageCompleted}%</Typography>
        </Stack>
        <LinearProgress className="problemList-progressBar" color="success" determinate value={percentageCompleted} size="lg" />
      </Stack>
      <List component="nav">
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <TabList>
            {Object.keys(problemsByCategory).sort().map((type) => (
               type ?
                <Tab key={type} value={type} variant="plain" color="neutral" sx={{ fontFamily: "Silkscreen"}}>
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
                    <ListItemButton className="problems" key={p.meta.name} selected={p.meta.name === activeProblem}
                        component={Link} to={`/problems/${p.meta.name}`} onClick={closeDrawer}>
                        <Stack width="100%" direction="row" justifyContent="space-between">
                          <Typography sx={{fontFamily: "Victor Mono"}}>{p.meta.title}</Typography>
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
