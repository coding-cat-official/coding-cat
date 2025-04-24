import { Chip, List, ListItem, ListItemButton, Stack, Typography } from '@mui/joy';
import { Problem } from '../types';
import { Link } from 'react-router-dom';

interface ProblemListProps {
  problems: Problem[];
  selectedTopic: string | null;
  activeProblem: string | null;
  onSelectProblem: (name: string) => void
  closeDrawer: () => void;
  searchQuery: string;
  difficulty: string;
}

export default function ProblemList({problems, selectedTopic, activeProblem, closeDrawer, searchQuery, difficulty}: ProblemListProps) {
  let newDifficulty = difficulty;
  if (newDifficulty === "all") newDifficulty = "";

  const problemsByTopic = problems.filter(problem => {
    return problem.meta.category === selectedTopic && 
      problem.meta.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) &&
      problem.meta.difficulty.includes(newDifficulty);
  });

  const problemsByType = problemsByTopic.reduce<Record<string, Problem[]>>((acc, problem) => {
    const problemsByType = problem.meta.question_type;
    problemsByType.forEach(type => {
      if (!acc[type]) acc[type] = [];
      acc[type].push(problem);
    } )
    return acc;
  }, {});

  if (Object.keys(problemsByType).length === 0) {
    return (
      <Typography>No problems found</Typography>
    )
  }

  return(
    <>
    <List component="nav">
    {Object.keys(problemsByType).sort().map((question_type) => (
          <ListItem nested key={question_type}>
          <Typography sx={{ fontSize: "20pt"}}>{question_type}</Typography>
            <List>
            { problemsByType[question_type].map((p) =>
                <ListItemButton sx={{ width: "30%" }} key={p.meta.name} selected={p.meta.name === activeProblem}
                    component={Link} to={`/problems/${p.meta.name}`} onClick={closeDrawer}>
                    <Stack width="100%" direction="row" justifyContent="space-between">
                      <Typography>{p.meta.title}</Typography>
                      <DifficultyChip difficulty={p.meta.difficulty} />
                    </Stack>
                </ListItemButton>,
            )}
          </List>
          </ListItem>
      ))}
    </List>
    </>
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
