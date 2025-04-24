import { List, ListItem, ListItemButton, ListSubheader, Typography } from '@mui/joy';
import { Problem } from '../types';
import { Link } from 'react-router-dom';

export default function ProblemList() {

}


interface ProblemListProps {
  problems: Problem[];
  activeProblem: string | null;
  closeDrawer: () => void;
}

export default function ProblemCategory({ problems, activeProblem, closeDrawer }: ProblemListProps){

  const categorized = problems.reduce<Record<string, Problem[]>>((acc, problem) => {
    const categories = problem.meta.question_type;
    categories.forEach(c => {
      if (!acc[c]) acc[c] = [];
      acc[c].push(problem);
    } )
    return acc;
  }, {});

  return(
    <>
    <List component="nav">
    {Object.keys(categorized).sort().map((question_type) => (
          <ListItem nested key={question_type}>
          <Typography sx={{ fontSize: "20pt"}}>{question_type}</Typography>
            <List>
            { categorized[question_type].map(
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