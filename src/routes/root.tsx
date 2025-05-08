import { useEffect, useMemo, useState } from 'react' ;
import { Outlet, useLoaderData } from 'react-router';
import { Link } from 'react-router-dom';

import problems from '../public-problems/problems';
import { Problem } from '../types';

import { supabase } from '../supabaseClient'
import type { Session } from '@supabase/supabase-js'

import {List as ListIcon} from '@phosphor-icons/react';
import {Typography, Box, Stack, Drawer, ModalClose, DialogTitle, DialogContent, Button, Option, Select } from '@mui/joy';
import CategoryList from '../components/CategoryList';

import logo from './coding-cat.png';
import ProblemList from '../components/ProblemList';
import ProblemSearch from '../components/ProblemSearch';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [open, setOpen] = useState(false);
  const [activeProblem, setActiveProblem] = useState<null | string>(null);
  const problems = useLoaderData() as Problem[];
  const [activeCategory, setActiveCategory] = useState<string | null>(() => {return 'Fundamentals';});
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [searchedProblems, setSearchedProblems] = useState<Problem[]>([]);
    const [selectedTab, setSelectedTab] = useState("");

  let newDifficulty = difficulty;
  if (newDifficulty === "all") newDifficulty = "";

  const filteredProblems = useMemo(() => {
    return problems.filter(problem => {
      return problem.meta.title.toLowerCase().includes(query.toLowerCase().trim()) &&
        problem.meta.difficulty.includes(newDifficulty);
    });
  }, [problems, query, newDifficulty])

  useEffect(() => {
    setSearchedProblems(filteredProblems);
  }, [filteredProblems])

  function handleSelectedCategory(category: string){
    setActiveCategory(category)
    setActiveProblem(null)
    if(category === "mutation") setSelectedTab("List-2: Iterating")
    if(category === "coding") setSelectedTab("")
  }

  function handleSelectedProblem(name: string){
    setActiveProblem(name)
    setOpen(false)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <Box sx={{ display:'flex', height: "100%", flex: 1}}>
      <Box
        sx={{
          className: 'desktop-bar',
          width: '6em',
          flex: 1,
          backgroundColor: '#c8cada',
          cursor: 'pointer',
          left: 0,
          top: 0,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',  // Center the arrow vertically
          '&::after': {
            content: '""',
            display: 'block',
            width: 0,
            height: 0,
            borderTop: '30px solid transparent',
            borderBottom: '30px solid transparent',
            borderLeft: '50px solid white', // Arrow color
            marginLeft: '30px', // Position the arrow
            paddingRight: '1em',
          },
        }}
        className="desktop-bar"
        onClick={() => setOpen(true)}
      />
      <Drawer open={open} onClose={() => setOpen(false)} size="xl">
        <ModalClose />
          <Stack width="100%" direction="row" justifyContent="space-between" padding={'10px'}>
            <DialogTitle level='h2'>
              Problem List
            </DialogTitle>
            <Stack marginRight="5em" direction="row" gap={3}>
              <Select sx={{ width: "150px" }} placeholder="Difficulty" value={difficulty} onChange={(e, newValue) => setDifficulty(newValue || "")}>
                <Option value="all">All</Option>
                <Option value="easy">Easy</Option>
                <Option value="medium">Medium</Option>
                <Option value="hard">Hard</Option>
              </Select>
              <ProblemSearch query={query} setQuery={setQuery} />
            </Stack>
          </Stack>
        <DialogContent>
          <Box sx={{ display: 'flex', overflow: 'hidden', gap: "16px" }}>
              <Box sx={{ flex: 1, width: 300, overflowY: 'auto',}}>
                <CategoryList
                  searchedProblems={searchedProblems}
                  activeCategory={activeCategory}
                  onSelectCategory={handleSelectedCategory}
                  session={session}
                />
              </Box>
              <Box sx={{ flex: 3}}>
                <ProblemList
                  selectedTab={selectedTab}
                  setSelectedTab={setSelectedTab}
                  searchedProblems={searchedProblems}
                  selectedTopic={activeCategory}
                  activeProblem={activeProblem}
                  onSelectProblem={handleSelectedProblem}
                  closeDrawer={() => setOpen(false)}
                  session={session}
                />
              </Box>
            </Box>
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
          <Stack sx={{ width: '100%', display: 'flex', flexDirection: 'row'}} className="upper-nav">
            <Button sx={{ margin: '10px 10px 0 10px', cursor: 'pointer'}} onClick={() => setOpen(true)} className="mobile-bar">
              <ListIcon size={20} />
            </Button>
            <Box sx={{ margin: '10px 10px 0 10px', display: 'flex', gap: 1 }} className="account-btns">
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
          <Link to="/">
            <Box component="img" src={logo} sx={{ maxHeight: "80px" }}/>
          </Link>
            <Typography  sx={{ fontFamily: 'Permanent Marker, sans-serif'}} level="h1">
              Coding Cat!
            </Typography>
        </Stack>
        
        <Box sx={{ overflowY: "auto" }} width="100%" height="100%">
          <Outlet context={{ setActiveProblem, session }} />
        </Box>
        
      </Stack>
    </Box>
)};

export async function problemListLoader(): Promise<Problem[]> {
    return problems as Problem[];
}
