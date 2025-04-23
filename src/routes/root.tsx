import React, { useEffect, useState, ChangeEvent } from 'react' ;
import { Outlet, useLoaderData } from 'react-router';
import { Link } from 'react-router-dom';

import problems from '../public-problems/problems';
import { Problem } from '../types';

import { supabase } from '../supabaseClient'
import Auth from './Auth'
import Account from './Account'
import type { Session } from '@supabase/supabase-js'

import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListSubheader from '@mui/joy/ListSubheader';
import ListItemButton from '@mui/joy/ListItemButton';
import Typography from '@mui/joy/Typography';
import Box from '@mui/joy/Box';
import Stack from '@mui/joy/Stack';
import Drawer from '@mui/joy/Drawer';
import ModalClose from '@mui/joy/ModalClose';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';

import logo from './coding-cat.png';
import { Button } from '@mui/joy';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [open, setOpen] = useState(false);
  const [activeProblem, setActiveProblem] = useState<null | string>(null);
  const problems = useLoaderData() as Problem[];


  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return <Box sx={{ height: '100%'}}>
    

    <Box style={{ minHeight: "100%", flex: 1 }}>
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
      <Stack
        direction="column"
        sx={{
          width: '100%',
          minHeight: "100%",
          height: "100%",
          justifyContent: "start",
          alignItems: "center",
        }} >
          <Stack sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: "space-between"}}>
            <Button sx={{ margin: '10px', cursor: 'pointer'}} onClick={() => setOpen(true)}>
              Menu
            </Button>
            <Box sx={{ margin: '10px', display: 'flex', gap: 1 }} className="account-btns">
              {session ? (
                <>
                  <Link to="/profile">
                    <Button>Profile</Button>
                  </Link>
                  <Button onClick={() => supabase.auth.signOut()}>Sign Out</Button>
                </>
              ) : (
                <Link to="/signin">
                  <Button>Login</Button>
                </Link>
              )}
            </Box>
          </Stack>
        
        <Stack sx={{ width: '100%' }} direction="row" alignItems="center" justifyContent="center"  className="logo">
          <Box component="img" src={logo} sx={{ maxHeight: "15vh" }} onClick={() => setOpen(true)}/>
          <Typography  sx={{ fontFamily: 'Permanent Marker, sans-serif'}} level="h1">
            Coding Cat!
          </Typography>
        </Stack>
        <Outlet context={{ setActiveProblem, session }} />
        
      </Stack>
    </Box>
  </Box>
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
      {Object.keys(groupedProblems).sort().map((category) => (
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
