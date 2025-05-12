import { Chip, List, ListItem, ListItemButton, Stack, Tab, TabList, TabPanel, Tabs, Typography } from '@mui/joy';
import { Problem, Submission } from '../types';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';
import { CheckCircle, MinusCircle } from '@phosphor-icons/react';
import { categorizeCategories } from '../utils/categorizeCategories';

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

  console.log(problemsByCategory)

  const solvedProblems = progress.filter((p) => {
    return p.passed_tests === p.total_tests;
  }).map((p) => p.problem_title);

  const uncompletedProblems = progress.filter((p) => {
    return p.passed_tests !== p.total_tests && !solvedProblems.includes(p.problem_title);
  }).map((p) => p.problem_title);

  if (Object.keys(problemsByCategory).length === 0) {
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
    <Stack gap={1} className="stack-problemList">
      <Typography level="h1" sx={{fontFamily: "Monomaniac One"}}>{selectedTopic ? selectedTopic.charAt(0).toUpperCase() + selectedTopic.slice(1): ""}</Typography>
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
          
          <TabPanel value={selectedTab} sx={{overflowY: 'scroll', height:"80vh"}} className="tabPanel-problemList">
              <List>
                { (problemsByCategory[selectedTab] || problemsByCategory[""]).map((p) => 
                    <ListItemButton className="problems" key={p.meta.name} selected={p.meta.name === activeProblem}
                        component={Link} to={`/problems/${p.meta.name}`} onClick={closeDrawer}>
                        <Stack width="100%" direction="row" justifyContent="space-between">
                          <Typography sx={{fontFamily: "Victor Mono"}}>{p.meta.title}</Typography>
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
