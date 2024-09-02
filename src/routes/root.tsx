import React, { useEffect, useState, ChangeEvent } from 'react' ;
import { Outlet, useLoaderData } from 'react-router';
import { Link } from 'react-router-dom';

import problems from '../problems/problems';
import { Problem } from '../types';

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
  const problems = useLoaderData() as Problem[];
  return <Box>
    <Drawer open={open} onClose={() => setOpen(false)}>
      <ModalClose />
      <DialogTitle>
        <Typography level="h2">
          Problem List
        </Typography>
      </DialogTitle>
      <DialogContent>
        <ProblemList problems={problems} />
      </DialogContent>
    </Drawer>
    <Stack direction="column">
      <Stack direction="row" alignItems="center">
        <Box component="img" src={logo} sx={{ maxHeight: "15vh" }} onClick={() => setOpen(true)} />
        <Typography level="h1">
          Coding Cat
        </Typography>
      </Stack>
      <Outlet />
    </Stack>
  </Box>;
};

export async function problemListLoader(): Promise<Problem[]> {
    return problems as Problem[];
}

interface ProblemListProps {
    problems: Problem[]
}

function ProblemList({ problems }: ProblemListProps) {
    const groupedProblems = problems.reduce<Record<string, Problem[]>>((acc, problem) => {
        const category = problem.meta.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(problem);
        return acc;
    }, {});

    return (
    <nav>
      {Object.keys(groupedProblems).map((category) => (
          <div key={category}>
          <Typography level="h3">{category}</Typography>
            <ul>
        { (groupedProblems[category] as Problem[]).map(
            (p) => <li key={p.meta.name}>
                <Link to={`/problems/${p.meta.name}`}> {p.meta.title} </Link>
            </li>,
        )}
      </ul>
      </div>
      ))}
    </nav>);
}
