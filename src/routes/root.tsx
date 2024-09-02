import React, { useEffect, useState, ChangeEvent } from 'react' ;
import { Outlet, useLoaderData } from 'react-router';
import { Link } from 'react-router-dom';

import problems from '../problems/problems';
import { Problem } from '../types';

import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListSubheader from '@mui/joy/ListSubheader';
import ListItemButton from '@mui/joy/ListItemButton';
import Typography from '@mui/joy/Typography';
import Box from '@mui/joy/Box';
import Stack from '@mui/joy/Stack';
import Sheet from '@mui/joy/Sheet';
import Drawer from '@mui/joy/Drawer';
import ModalClose from '@mui/joy/ModalClose';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';

import logo from './coding-cat.png';

export default function App() {
  const [open, setOpen] = useState(false);
  const [activeProblem, setActiveProblem] = useState<null | string>(null);
  const problems = useLoaderData() as Problem[];

  return <Box height={{ height: "100%" }}>
    <Drawer open={open} onClose={() => setOpen(false)}>
      <ModalClose />
      <DialogTitle>
        <Typography level="h2">
          Problem List
        </Typography>
      </DialogTitle>
      <DialogContent>
        <ProblemList
            problems={problems} activeProblem={activeProblem} closeDrawer={() => setOpen(false)}/>
      </DialogContent>
    </Drawer>
    <Stack direction="column" sx={{ height: "100%" }} >
      <Stack direction="row" alignItems="center">
        <Box component="img" src={logo} sx={{ maxHeight: "15vh" }} onClick={() => setOpen(true)} />
        <Typography level="h1">
          Coding Cat
        </Typography>
      </Stack>
      <Outlet context={{ setActiveProblem }} />
    </Stack>
  </Box>;
};

export async function problemListLoader(): Promise<Problem[]> {
    return problems as Problem[];
}

interface ProblemListProps {
    problems: Problem[];
    activeProblem: string | null;
    closeDrawer: () => void;
}

function ProblemList({ problems, activeProblem, closeDrawer }: ProblemListProps) {
    const groupedProblems = problems.reduce<Record<string, Problem[]>>((acc, problem) => {
        const category = problem.meta.category;
        if (!acc[category]) acc[category] = [];
        acc[category].push(problem);
        return acc;
    }, {});

    return (
    <List component="nav">
      {Object.keys(groupedProblems).map((category) => (
          <ListItem nested key={category}>
          <ListSubheader>{category}</ListSubheader>
            <List>
            { groupedProblems[category].map(
                (p) =>
                <ListItemButton key={p.meta.name} selected={p.meta.name === activeProblem}
                    component={Link} to={`/problems/${p.meta.name}`} onClick={closeDrawer}>
                    {p.meta.title}
                </ListItemButton>,
            )}
          </List>
          </ListItem>
      ))}
    </List>);
}
