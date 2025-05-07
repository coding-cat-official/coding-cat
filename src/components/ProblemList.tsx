import { Chip, List, ListItem, ListItemButton, Stack, Tab, TabList, TabPanel, Tabs, Typography } from '@mui/joy';
import { Problem, Submission } from '../types';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';
import { CheckCircle, MinusCircle } from '@phosphor-icons/react';

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

const UNLOCK_RULES: Record<string, {dependency: string[]; count: number;}> = {
  'fundamentals': { dependency: [], count: 0 },
  'logic': { dependency: ['fundamentals'], count: 5},
  'string-1': { dependency: ['logic'], count: 5},
  'list-1': { dependency: ['logic'], count: 5},
  'string-2': { dependency: ['string-1', 'list-1'], count: 5},
  'list-2': { dependency: ['string-1', 'list-1'], count: 5},
}

export default function ProblemList({selectedTab, setSelectedTab, searchedProblems, selectedTopic, activeProblem, closeDrawer, session}: ProblemListProps) {
  const [error, setError] = useState("");
  const [progress, setProgress] = useState<Submission[]>([]);

  useEffect(() => {
    async function fetchProgress() {
      if (!session) return;
      const { user } = session;
      
      const {data: submissions, error } = await supabase
      .from('submissions')
      .select('problem_title, passed_tests, total_tests')
      .eq('profile_id', user.id);

      if(error) {
        setError(error.message);
      }

      setProgress(submissions || []);
    }

    fetchProgress();
  }, [session]);

  const problemsByTopic = searchedProblems.filter(problem => {
    return problem.meta.category === selectedTopic;
  });

  const problemsByType = problemsByTopic.reduce<Record<string, Problem[]>>((acc, problem) => {
    const problemsByType = problem.meta.question_type;
    problemsByType.forEach(type => {
      if (!acc[type]) acc[type] = [];
      acc[type].push(problem);
    } )
    return acc;
  }, {});

  const solvedProblems = progress.filter((p) => {
    return p.passed_tests === p.total_tests;
  }).map((p) => p.problem_title);

  const uncompletedProblems = progress.filter((p) => {
    return p.passed_tests !== p.total_tests && !solvedProblems.includes(p.problem_title);
  }).map((p) => p.problem_title);

  if (Object.keys(problemsByType).length === 0) {
    return (
      <Typography>No problems found</Typography>
    )
  }

  const handleTabChange = (_: any, newValue: any) => {
    if(newValue != null){
      setSelectedTab(newValue);
    }
  }

  return(
    <Stack gap={1}>
      <Typography level="h2">{selectedTopic}</Typography>
      <List component="nav">
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <TabList>
            {Object.keys(problemsByType).sort().map((type) => (
              <Tab key={type} value={type} variant="plain" color="neutral">
                {type}
              </Tab>
            ))}
          </TabList>
          
          <TabPanel value={selectedTab} sx={{overflowY: 'scroll', height:"80vh"}}>
              <List>
                { problemsByType[selectedTab].map((p) => 
                    <ListItemButton className={"problems"} key={p.meta.name} selected={p.meta.name === activeProblem}
                        component={Link} to={`/problems/${p.meta.name}`} onClick={closeDrawer}>
                        <Stack width="100%" direction="row" justifyContent="space-between">
                          <Typography>{p.meta.title}</Typography>
                          <Stack direction="row" gap={1}>
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
      {difficulty}
    </Chip>
  )
}
