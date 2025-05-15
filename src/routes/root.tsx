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

import whitePaw from '../assets/white_paw.webp';
import whitePawHover from '../assets/white_paw_hover.webp';
import logo from '../assets/coding-cat.png';
import ProblemList from '../components/ProblemList';
import CustomSearch from '../components/ProblemSearch';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
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
    if(category === "mutation") setSelectedTab("List")
    if(category === "coding") setSelectedTab("")
  }

  function handleSelectedProblem(name: string){
    setActiveProblem(name)
    setOpen(false)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user){
        if (session?.user) {
          supabase
            .from('profiles')
            .select('is_admin')
            .eq('profile_id', session.user.id)
            .single()
            .then(({ data, error }) => {
              if (!error && data) {
                setIsAdmin(data.is_admin);
              }
            });
        }
      }
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        supabase
          .from('profiles')
          .select('is_admin')
          .eq('profile_id', session.user.id)
          .single()
          .then(({ data, error }) => {
            if (!error && data) {
              setIsAdmin(data.is_admin);
            }
          });
      } else {
        setIsAdmin(false);
      }
    });
  }, []);

  return (
    <Box sx={{ display:'flex', height: "100%", flex: 1}}>
      <Stack
       sx={{
          width: '6em',
          cursor: 'pointer',
          alignItems: 'center',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            width: '70px',
            height: '70px',
            backgroundImage: `url(${whitePaw})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            transform: 'rotate(-90deg)'
          },
          '&:hover::after': {
            backgroundImage: `url(${whitePawHover})`
          }
        }}
        className="desktop-bar"
        onClick={() => setOpen(true)}
      />
      <Drawer open={open} onClose={() => setOpen(false)} size="xl">
        <ModalClose />
          <Stack width="100%" direction="row" justifyContent="space-between" padding={'10px'} className="big-navbar" sx={{alignItems: "center"}}>
            <DialogTitle level='h1'  sx={{ fontFamily: '"Silkscreen", monospace', padding: "5px", fontSize: "30pt"}}>
              Coding Cat
            </DialogTitle>
            <Stack marginRight="5em" direction="row" gap={3} className="problemList-search-filter">
              <Select sx={{ width: "150px", fontWeight: "normal", fontFamily: "Silkscreen" }} placeholder="Difficulty" value={difficulty} onChange={(e, newValue) => setDifficulty(newValue || "")}>
                <Option sx={{fontFamily: "Silkscreen"}} value="all">All</Option>
                <Option sx={{fontFamily: "Silkscreen"}} value="easy">Easy</Option>
                <Option sx={{fontFamily: "Silkscreen"}} value="medium">Medium</Option>
                <Option sx={{fontFamily: "Silkscreen"}} value="hard">Hard</Option>
              </Select>
              <CustomSearch query={query} setQuery={setQuery} placeholder="Search for exercises..." />
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
              <Box sx={{ flex: 3}} className="parent-problemList">
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
        className= 'main'
        direction="column"
        sx={{
          width: '100%',
          minHeight: "100%",
          height: "100%",
          justifyContent: "start",
          alignItems: "center",
          overflowY: "scroll"
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
                  {isAdmin && (
                    <Link to="/admin">
                      <Button color="warning">Admin</Button>
                    </Link>
                  )}
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
            <Typography  sx={{ fontFamily: '"Silkscreen", monospace', fontSize: "35pt"}} level="h1">
              Coding Cat!
            </Typography>
        </Stack>
        
        <Box width="100%" height="100%">
          <Outlet context={{ setActiveProblem, session, isAdmin }} />
        </Box>
        
      </Stack>
    </Box>
)};

export async function problemListLoader(): Promise<Problem[]> {
    return problems as Problem[];
}
