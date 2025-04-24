import { List, ListItem, ListItemButton, Typography } from '@mui/joy';
import { Problem } from '../types';
import { Link } from 'react-router-dom';

interface ProblemListProps {
  problems: Problem[];
  selectedTopic: string | null;
  activeProblem: string | null;
  closeDrawer: () => void;
}

export default function ProblemList({problems, selectedTopic, activeProblem, closeDrawer}: ProblemListProps) {

  const problemsByTopic = problems.filter(problem => problem.meta.category === selectedTopic);

  const problemsByType = problemsByTopic.reduce<Record<string, Problem[]>>((acc, problem) => {
    const problemsByType = problem.meta.question_type;
    problemsByType.forEach(type => {
      if (!acc[type]) acc[type] = [];
      acc[type].push(problem);
    } )
    return acc;
  }, {});

  return(
    <>
    <List component="nav">
    {Object.keys(problemsByType).sort().map((question_type) => (
          <ListItem nested key={question_type}>
          <Typography sx={{ fontSize: "20pt"}}>{question_type}</Typography>
            <List>
            { problemsByType[question_type].map(
                (p) =>
                <ListItemButton key={p.meta.name} selected={p.meta.name === activeProblem}
                    component={Link} to={`/problems/${p.meta.name}`} onClick={closeDrawer}>
                    {p.meta.title}
                </ListItemButton>,
            )}
          </List>
          </ListItem>
      ))}
    </List>
    </>
  );
}
