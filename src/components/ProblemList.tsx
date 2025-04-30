import { Chip, List, ListItem, ListItemButton, Stack, Tab, TabList, TabPanel, Tabs, Typography } from '@mui/joy';
import { Problem, Submission } from '../types';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';
import { CheckCircle, MinusCircle } from '@phosphor-icons/react';

interface ProblemListProps {
  searchedProblems: Problem[];
  selectedTopic: string | null;
  activeProblem: string | null;
  onSelectProblem: (name: string) => void
  closeDrawer: () => void;
  session: Session | null;
}

export default function ProblemList({searchedProblems, selectedTopic, activeProblem, closeDrawer, session}: ProblemListProps) {
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

  return(
    <Stack gap={1}>
      <Typography level="h2">{selectedTopic}</Typography>
      <List component="nav">
        <Tabs>
          <TabList>
            {Object.keys(problemsByType).sort().map((question_type) => (
                  <Tab
                    variant="plain"
                    color="neutral">{question_type}</Tab>
            ))}
          </TabList>
          
      {Object.keys(problemsByType).sort().map((question_type) => (
        <TabPanel>
            <ListItem nested key={question_type}>
                <List>
                { problemsByType[question_type].map((p) =>
                    <ListItemButton sx={{ width: "40%" }} key={p.meta.name} selected={p.meta.name === activeProblem}
                        component={Link} to={`/problems/${p.meta.name}`} onClick={closeDrawer}>
                        <Stack width="100%" direction="row" justifyContent="space-between">
                          <Typography>{p.meta.title}</Typography>
                          <Stack direction="row" gap={1}>
                            {
                              solvedProblems.includes(p.meta.title) && <CheckCircle size={24} color="#47f22f" />
                            }
                            {
                              uncompletedProblems.includes(p.meta.title) && <MinusCircle size={24} color="#939393" />
                            }
                            <DifficultyChip difficulty={p.meta.difficulty} />
                          </Stack>
                        </Stack>
                    </ListItemButton>,
                )}
              </List>
            </ListItem>
        </TabPanel>
        ))}
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
