import { useState, useEffect, FormEvent, useMemo, Dispatch, SetStateAction } from 'react'
import { supabase } from '../supabaseClient'
import { Session } from '@supabase/supabase-js'
import { Accordion,
  AccordionDetails,
  AccordionGroup, 
  AccordionSummary, 
  accordionSummaryClasses, 
  Avatar, 
  Box, 
  Button, 
  Card, 
  CardContent, 
  FormLabel, 
  IconButton, 
  Input, 
  LinearProgress, 
  Modal, 
  ModalClose, 
  ModalDialog, 
  Option, 
  Select, 
  Stack, 
  Textarea, 
  Tooltip, 
  Typography 
} from '@mui/joy';
import { BLANK_CONTRACT, Progress, Reflection } from '../types';
import { ArrowSquareOut, NotePencil } from '@phosphor-icons/react';
import { getCompletedProblems } from '../utils/getCompletedProblems';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from 'recharts';
import { capitalizeString } from '../utils/capitalizeString';
import { Link } from 'react-router-dom';
import { getCategoryList } from '../utils/getCategoryList';
import { ContractData } from '../types';
import CustomSearch from '../components/ProblemSearch';

export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [studentId, setStudentId] = useState("");
  const [progress, setProgress] = useState<Progress[]>([]);
  const [reflections, setReflections] = useState<Reflection[]>([])
  const [activityStamps, setActivityStamps] = useState<string[]>([])
  const [view, setView] = useState<"progress" | "reflections" | "activity">("progress");
  const [error, setError] = useState("");
  const [contract, setContract] = useState<ContractData>(BLANK_CONTRACT);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    let ignore = false;
    async function getProfile() {
      setLoading(true);
      const { user } = session;

      const { data, error } = await supabase
        .from('profiles')
        .select(`username, student_id`)
        .eq('profile_id', user.id)
        .single();

      if (!ignore) {
        if (error) {
          alert(error.message);
          console.warn(error);
        } else if (data) {
          setUsername(data.username);
          setStudentId(data.student_id);
        }
      }
      setLoading(false);
    }

    getProfile();

    return () => {
      ignore = true;
    }
  }, [session])

  useEffect(() => {
    async function fetchContract() {
      const {data, error} = await supabase
      .from('contracts')
      .select('data, updated_at')
      .eq('profile_id', session.user.id)
      .order('updated_at', {ascending:false})
      .limit(1)
      .single()
      
      if(error){
        console.error(error);
      }else{
        setContract(data.data as ContractData);
        setLastUpdated(new Date(data.updated_at));
      }
    }
    fetchContract()
  }, [session])

  useEffect(() => {
    async function fetchProgress() {
      const { user } = session;
      
      const {data: submissions, error } = await supabase
      .from('submissions')
      .select('problem_title, passed_tests, total_tests, problem_category, code, reflection, submitted_at')
      .eq('profile_id', user.id)
      .order('submitted_at', { ascending: false });

      if(error) {
        setError(error.message);
      }

      const summary = getCompletedProblems(submissions || []);
      setProgress(summary);

      const reflections: Reflection[] = (submissions || [])
        .filter((r) => r.reflection != null)
        .map((r) => ({
          category: r.problem_category,
          problem_title: r.problem_title,
          reflection: r.reflection,
          submitted_at: r.submitted_at,
          code: r.code
        }));
      setReflections(reflections)

      setActivityStamps((submissions || []).map((r) => r.submitted_at))
    }

    fetchProgress();
  }, [session]);

  const activityData = useMemo(() => {
    const counts: Record<string, number> = {}
    activityStamps.forEach((iso) => {
      const date = iso.slice(0,10)
      counts[date] = (counts[date] ?? 0) + 1
    })

    const days = Object.keys(counts).sort();
    if (days.length === 0) return [];

    const start = new Date(days[0]);
  const end = new Date(days[days.length - 1]);
  const allDays: { x: string; y: number }[] = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const iso = d.toISOString().slice(0, 10);
    allDays.push({ x: iso, y: counts[iso] || 0 });
  }
  
  return allDays;
}, [activityStamps]);

async function handleContractSave() {
  const now = new Date()
  const {error, data } = await supabase
  .from('contracts')
  .upsert({
    profile_id: session.user.id,
    data: contract,
    updated_at: now
  })
  .select('data, updated_at')
  .single()
  if(error){
    console.error(error);
  }
  else {
    setContract(data.data as ContractData);
    setLastUpdated(new Date(data.updated_at));
  }

  setLoading(false);
}
  

  return (
    <Stack width="100%" height="100%" direction="row" className="profile-wrapper">
      <Stack flex={1} alignItems="center" justifyContent="center" gap={5} className="account-wrapper">
        <UserInfo username={username} email={session.user.email || ""} studentId={studentId} session={session} />
        <Contract contract={contract} lastUpdated={lastUpdated} onSave={handleContractSave} setContract={setContract}/>
      </Stack>
      <Stack marginTop={5} flex={2} gap={2} className="progress-wrapper">
        <Stack direction="row" gap={1}>
          <Button onClick={() => setView("progress")} color={ view === "progress" ? "primary" : "neutral" }>Progress</Button>
          <Button onClick={() => setView("reflections")} color={ view === "reflections" ? "primary" : "neutral" } >Reflections</Button>
          <Button onClick={() => setView("activity")} color={ view === "activity" ? "primary" : "neutral" } >Activity</Button>
        </Stack>

        { view === "progress" && <ProgressList progress={progress} />}
        { view === "reflections" && <Reflections reflections = {reflections}/> }
        { view === "activity" && (
          <Stack gap={2}>
          <Typography level="h2">Your Activity</Typography>
          <Card sx={{ p: 2, width: "90%", height: "100%" }}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activityData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="x"
                  tickFormatter={(date) => date.slice(5)}
                  minTickGap={20}
                />
                <YAxis allowDecimals={false} />
                <RechartsTooltip isAnimationActive={false}
                  labelFormatter={(label) => `Date: ${label}`}
                  formatter={(value: number) => [`${value}`, "Submissions"]}
                />
                <Line type="monotone" dataKey="y" stroke="#8884d8" strokeWidth={2} dot={{ r: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Stack>
      )}
    </Stack>
  </Stack>
  )
}
  
    

interface UserProps {
  username: string
  email: string
  studentId: string
  session: Session
}

function UserInfo({ username, email, studentId, session }: UserProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [name, setName] = useState(username);
  const [id, setId] = useState(studentId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function updateProfile(event: FormEvent) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);
    const { user } = session;

    const updates = {
      profile_id: user.id,
      username: name,
      student_id: id,
      updated_at: new Date(),
    };

    const { error } = await supabase.from('profiles').upsert(updates);

    if (error) {
      setError(error.message);
    } else {
      setIsUpdating(false);
    }
    
    setSuccess("Profile updated successfully!");
    setLoading(false);
  }

  return (
    <Stack alignItems="center" className="account">
      {
        isUpdating ? 
        <form onSubmit={updateProfile} className="form-widget">
          <Stack direction="column" gap={1} alignItems="center">
            <Typography level="h2">Edit Profile</Typography>
            <FormLabel>Name</FormLabel>
            <Input
              placeholder="Enter your name..."
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
            />
            <FormLabel>Email</FormLabel>
            <Input
              value={email}
              required
              disabled
            />
            <FormLabel>Student ID</FormLabel>
            <Input
              placeholder="Enter your student ID..."
              value={id}
              required
              onChange={(e) => setId(e.target.value)}
            />

            <Stack direction="row" gap={1}>
              <Button disabled={loading} type="submit">
                { loading ? 'Loading ...' : 'Update' }
              </Button>
              <Button onClick={() => setIsUpdating(false)}>Cancel</Button>
            </Stack>

            <Typography color="danger">{error}</Typography>
          </Stack>
        </form> :
        <>
          <Avatar color="primary" size="lg">{username.charAt(0)}</Avatar>
          <Stack alignItems="center">
            <Stack direction="row" justifyContent="center" gap={1}>
              <Typography level="h2">{username}</Typography>
              <IconButton onClick={() => {setIsUpdating(true); setSuccess("");}}>
                <NotePencil size={23} />
              </IconButton>
            </Stack>
            <Typography>{email}</Typography>
            <Typography>#{studentId}</Typography>
            <Typography color="success">{success}</Typography>
          </Stack>
        </>
      }
    </Stack>
  )
}

interface ContractProps{
  contract: ContractData;
  setContract: Dispatch<SetStateAction<ContractData>>;
  lastUpdated: Date | null;
  onSave: () => Promise<void>;
}

function Contract({
  contract,
  setContract, 
  lastUpdated,
  onSave
}: ContractProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Stack alignItems="center">
        <Stack direction="row" alignItems="center" gap={1}>
          <Typography level="h2">Contract</Typography>
          <IconButton onClick={() => setOpen(true)}>
            <ArrowSquareOut size={23} />
          </IconButton>
        </Stack>
        <Typography>Last Modified:{' '} 
        {lastUpdated
          ? `${lastUpdated.toLocaleDateString()} ${lastUpdated.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}`
          : '—'}
        </Typography>
      </Stack>

      <ContractModal open={open} setOpen={setOpen} contract={contract} lastUpdated={lastUpdated} onSave={onSave} setContract={setContract}/>
    </>
  )
}



interface ContractModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  contract: ContractData;
  setContract: Dispatch<SetStateAction<ContractData>>;
  lastUpdated: Date | null;
  onSave: () => Promise<void>;
}
function ContractModal({ open, setOpen, contract, setContract, lastUpdated, onSave }: ContractModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);
    
  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog sx={{ width: "90vw", height: "90vh" }} variant="outlined">
        <ModalClose />
        <Typography level="h2">Your Contract</Typography>
        {
          isUpdating ? <ContractEdit contract={contract} setIsUpdating={setIsUpdating} setContract={setContract} onSave={onSave} /> : <ContractText setIsUpdating={setIsUpdating} contract={contract} lastUpdated={lastUpdated} />
        }
      </ModalDialog>
    </Modal>
  )
}

interface ContractTextProps {
  setIsUpdating: Dispatch<SetStateAction<boolean>>;
  contract: ContractData;
  lastUpdated: Date | null;
}

function ContractText({setIsUpdating, contract, lastUpdated}: ContractTextProps) {

  return (
    <>
      <Stack sx={{ overflowY: "scroll" }} gap={2}>
        <Typography level="h3">Coding</Typography>
        <Typography>What grade do you want to get? <strong>{contract.Coding.gradeWanted}</strong></Typography>
        <Typography sx={{ whiteSpace: "pre-line" }}>How many problems of each category will you solve?</Typography>
        <Stack direction="row" flexWrap="wrap" columnGap={4} rowGap={2} justifyContent="center">
          {Object.entries(contract.Coding.problemsToSolveByCategory).map(
            ([cat, count]) => (
              <Typography key={cat}>
                {cat}: <strong>{count}</strong>
              </Typography>
            )
          )}
          </Stack>
        <Typography>
          Give a qualitative description of what your code will look like in order to achieve your desired grade.<br />
          <strong>{contract.Coding.codeDescription}</strong>
        </Typography>
        <Typography>
          How many reflections will you do in order to reach your desired grade and how in depth will you go with them?<br />
          <strong>{contract.Coding.reflectionPlan}</strong>
        </Typography>

        <Typography level="h3">Haystack</Typography>
        <Typography>What grade do you want to get? <strong>{contract.Haystack.gradeWanted}</strong></Typography>
        <Typography>How many haystack problems will you solve? <strong>{contract.Haystack.problemsToSolve}</strong></Typography>
        <Typography>
          Give a qualitative description of what your code will look like in order to achieve your desired grade.<br />
          <strong>{contract.Haystack.codeDescription} </strong>
        </Typography>
        <Typography>
          How many reflections will you do in order to reach your desired grade and how in depth will you go with them?<br />
          <strong>{contract.Haystack.reflectionPlan}</strong>
        </Typography>

        <Typography level="h3">Mutation Testing</Typography>
        <Typography>What grade do you want to get? <strong>{contract.Mutation.gradeWanted}</strong></Typography>
        <Typography>How many mutation testing problems will you solve? <strong>{contract.Mutation.problemsToSolve}</strong></Typography>
        <Typography>
          Give a qualitative description of what your code will look like in order to achieve your desired grade.<br />
          <strong>{contract.Mutation.codeDescription}</strong>
        </Typography>
        <Typography>
          How many reflections will you do in order to reach your desired grade and how in depth will you go with them?<br />
          <strong>{contract.Mutation.reflectionPlan}</strong>
        </Typography>
      </Stack>

      <Stack direction="row" justifyContent="flex-end" alignItems="center" gap={2}>
        <Typography level="body-xs">Last Modified:{' '} 
        {lastUpdated
          ? `${lastUpdated.toLocaleDateString()} ${lastUpdated.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}`
          : '—'}
        </Typography>
        <Button sx={{ width: "15%" }} onClick={() => setIsUpdating(true)}>Edit</Button>
      </Stack>
    </>
  )
}

interface ContractEditProps {
  setIsUpdating: Dispatch<SetStateAction<boolean>>;
  contract: ContractData;
  setContract: Dispatch<SetStateAction<ContractData>>;
  onSave: () => Promise<void>;
}

function ContractEdit({ setIsUpdating, contract, setContract, onSave }: ContractEditProps) {
  const categories = getCategoryList();

  // TODO: replace placeholder values with actual values from database and implement updating

  return (
    <>
      <Stack sx={{ overflowY: "scroll" }} gap={2}>
        <Typography level="h3">Coding</Typography>
        <Stack direction="row" alignItems="center" gap={2}>
          <Typography>What grade do you want to get?</Typography>
          <Select placeholder="Grade" value={contract.Coding.gradeWanted}
            onChange={(_, v) =>                          // ← v is the new string
              setContract(c => ({
                ...c,
                Coding: { ...c.Coding, gradeWanted: v as string },
              }))
            }>
            <Option value="proficient">Proficient</Option>
            <Option value="approaching_mastery">Approaching Mastery</Option>
            <Option value="mastery">Mastery</Option>
          </Select>
        </Stack>
        <Typography sx={{ whiteSpace: "pre-line" }}>How many problems of each category will you solve?</Typography>
        <Stack justifyContent="center" direction="row" columnGap={20} rowGap={2} flexWrap="wrap">
          {
            categories.map((c) => {
              return (
                <Stack direction="row" alignItems="center" gap={2}>
                  <Typography>{c}: </Typography>
                  <Input
                    variant="plain"
                    size="sm"
                    sx={{ width: "50px", typography: 'body1' }}
                    slotProps={{ input: { type: "number", min: 0 } }}
                    placeholder="0"
                    value={contract.Coding.problemsToSolveByCategory[c]}
                    onChange={(e) =>
                      setContract((cat) => ({
                        ...cat,
                        Coding: {
                          ...cat.Coding,
                          problemsToSolveByCategory: {
                            ...cat.Coding.problemsToSolveByCategory,
                            [c]: +e.target.value,
                          },
                        },
                      }))
                    }
                  />
                </Stack>
              )
            })
          }
        </Stack>
        <Typography>Give a qualitative description of what your code will look like in order to achieve your desired grade.</Typography>
        <Textarea value={contract.Coding.codeDescription} 
          onChange={(e) =>
            setContract((c) => ({
              ...c,
              Coding: { ...c.Coding, codeDescription: e.target.value },
            }))
          } placeholder="Enter your answer..." minRows={2} maxRows={2} />
        <Typography>How many reflections will you do in order to reach your desired grade and how in depth will you go with them?</Typography>
        <Textarea value={contract.Coding.reflectionPlan} onChange={(e) =>
          setContract((c) => ({
            ...c,
            Coding: { ...c.Coding, reflectionPlan: e.target.value },
          }))
        } placeholder="Enter your answer..." minRows={2} maxRows={2} />
        <Typography level="h3">Haystack</Typography>
        <Stack direction="row" alignItems="center" gap={2}>
          <Typography>What grade do you want to get?</Typography>
          <Select placeholder="Grade" value={contract.Haystack.gradeWanted} 
            onChange={(_, v) =>
              setContract(c => ({
                ...c,
                Haystack: { ...c.Haystack, gradeWanted: v as string },
              }))
            }>
            <Option value="proficient">Proficient</Option>
            <Option value="approaching_mastery">Approaching Mastery</Option>
            <Option value="mastery">Mastery</Option>
          </Select>
        </Stack>
        <Stack direction="row" alignItems="center" gap={2}>
          <Typography>How many haystack problems will you solve?</Typography>
          <Input slotProps={{input:{type:"number", min: 0}}} value={contract.Haystack.problemsToSolve} 
            onChange={(e) =>
              setContract((c) => ({
                ...c,
                Haystack: { ...c.Haystack, problemsToSolve: +e.target.value },
              }))
            } sx={{ width: "3em" }} placeholder="0" />
        </Stack>
        <Typography>Give a qualitative description of what your code will look like in order to achieve your desired grade.</Typography>
        <Textarea placeholder="Enter your answer..." minRows={2} maxRows={2} value={contract.Haystack.codeDescription} 
          onChange={(e) =>
            setContract((c) => ({
              ...c,
              Haystack: { ...c.Haystack, codeDescription: e.target.value },
            }))
          }/>
        <Typography>How many reflections will you do in order to reach your desired grade and how in depth will you go with them?</Typography>
        <Textarea placeholder="Enter your answer..." minRows={2} maxRows={2} value={contract.Haystack.reflectionPlan} 
          onChange={(e) =>
            setContract((c) => ({
              ...c,
              Haystack: { ...c.Haystack, reflectionPlan: e.target.value },
            }))
          }/>

        <Typography level="h3">Mutation Testing</Typography>
        <Stack direction="row" alignItems="center" gap={2}>
          <Typography>What grade do you want to get?</Typography>
          <Select placeholder="Grade" value={contract.Mutation.gradeWanted}
            onChange={(_, v) =>
              setContract(c => ({
                ...c,
                Mutation: { ...c.Mutation, gradeWanted: v as string },
              }))
            }>
            <Option value="proficient">Proficient</Option>
            <Option value="approaching_mastery">Approaching Mastery</Option>
            <Option value="mastery">Mastery</Option>
          </Select>
        </Stack>
        <Stack direction="row" alignItems="center" gap={2}>
          <Typography>How many mutation testing problems will you solve?</Typography>
          <Input sx={{ width: "3em" }} placeholder="0" slotProps={{input:{type:"number", min: 0}}} value={contract.Mutation.problemsToSolve} 
            onChange={(e) =>
              setContract((c) => ({
                ...c,
                Mutation: { ...c.Mutation, problemsToSolve: +e.target.value },
              }))
            }/>
        </Stack>
        <Typography>Give a qualitative description of what your code will look like in order to achieve your desired grade.</Typography>
        <Textarea placeholder="Enter your answer..." minRows={2} maxRows={2} value={contract.Mutation.codeDescription} 
          onChange={(e) =>
            setContract((c) => ({
              ...c,
              Mutation: { ...c.Mutation, codeDescription: e.target.value },
            }))
          }/>
        <Typography>How many reflections will you do in order to reach your desired grade and how in depth will you go with them?</Typography>
        <Textarea placeholder="Enter your answer..." minRows={2} maxRows={2} value={contract.Mutation.reflectionPlan} 
          onChange={(e) =>
            setContract((c) => ({
              ...c,
              Mutation: { ...c.Mutation, reflectionPlan: e.target.value },
            }))
          }/>
      </Stack>

      <Stack direction="row" justifyContent="flex-end" alignItems="center" gap={2}>
        <Typography level="body-xs">Last Modified: { new Date().toDateString() }</Typography>
        <Button sx={{ width: "15%" }} variant="outlined" onClick={() => setIsUpdating(false)}>Cancel</Button>
        <Button sx={{ width: "15%" }} onClick={async() => { await onSave(); setIsUpdating(false);}}>Save Changes</Button>
      </Stack>
    </>
  )
}

function ProgressList({ progress }: { progress: Progress[] }) {
  return (
    <>
      <Typography level="h2">Your Progress</Typography>
      <Stack sx={{ height: "100%", overflowY: "scroll" }} direction="column" gap={2} mb={2}>
        {progress.map((item) => (
          <ProgressCard item={item} key={item.category} />
        ))}
      </Stack>
    </>
  )
}

function ProgressCard({ item }: { item: Progress }) {
  // capitalize first letter of each category
  const categoryName = item.category.charAt(0).toUpperCase() + item.category.slice(1);
  const percentageCompleted = Math.round((item.completed / item.total) * 100);
  const completedProblems: Record<string, string[]> = {};

  item.problems.forEach((p) => {
    if (!completedProblems[p.difficulty]) completedProblems[p.difficulty] = [];
    completedProblems[p.difficulty].push(p.title);
  });

  // TODO:
  // - fix border radius on hover

  return (
    <AccordionGroup sx={{
      borderRadius: "lg",
      maxWidth: "90%",
      [`& .${accordionSummaryClasses.button}`]: {
        paddingBlock: '1rem',
      }
      }} size="lg" variant="soft">
      <Accordion>
        <AccordionSummary>
          <Stack sx={{ width: "100%" }} direction="column" gap={1}>
            <Stack direction="row" justifyContent="space-between">
              <Stack direction="row" alignItems="center" gap={2}>
                <Typography level="h3">{categoryName}</Typography>
                <Typography>{item.completed} / {item.total}</Typography>
              </Stack>
              <Typography level="h4">{percentageCompleted}%</Typography>
            </Stack>
            <LinearProgress sx={{ backgroundColor: "#D5D5D5" }} color="success" determinate value={percentageCompleted} size="lg" />
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          {
            item.completed === 0 ? <Typography>You haven't completed any problems from this category.</Typography> :
            <Stack gap={2}>
              {
                Object.keys(completedProblems).map((o) => (
                    <Stack direction="column" gap={1}>
                      <Typography level="title-lg">{o.charAt(0).toUpperCase() + o.slice(1)}</Typography>
                      <Stack direction="row" gap={3} flexWrap="wrap">
                        {
                          completedProblems[o].map((p) => (
                            <Link style={{ textDecoration: "none" }} to={`/problems/${p}`}>
                              <Button sx={{ fontWeight: "normal" }} variant="plain">
                                <Typography>{capitalizeString(p)}</Typography>
                              </Button>
                            </Link>
                          ))
                        }
                      </Stack>
                    </Stack>
                  )
                )
              }
            </Stack>
          }
        </AccordionDetails>
      </Accordion>
    </AccordionGroup>
  )
}

function Reflections({ reflections }: { reflections: Reflection[] }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  let cat = category;
  if (cat === "all") cat = "";

  const filteredReflections = reflections.filter((r) => {
    const name = capitalizeString(r.problem_title).toLowerCase();
    return name.includes(query.toLowerCase()) && r.category.includes(cat);
  });

  if (!filteredReflections.length) {
    return (
      <>
        <ReflectionTitle query={query} setQuery={setQuery} category={cat} setCategory={setCategory} />
        <Typography>You have no reflections!</Typography>
      </>
    )
  }

  return (
    <>
      <ReflectionTitle query={query} setQuery={setQuery} category={cat} setCategory={setCategory} />
      <Stack gap={2} mb={2} sx={{ maxHeight: '100%', overflowY: 'auto', scrollbarWidth: "thin"}}>
        {filteredReflections.map((reflection, index) => {
          const isOpen = expandedIndex === index
          return (
            <Card
              key={`${reflection.problem_title}-${reflection.submitted_at}`}
              onClick={() => setExpandedIndex(isOpen ? null : index)}
              sx={{cursor: 'pointer', width: '90%'}}>
              <CardContent>
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography level="h3">{capitalizeString(reflection.problem_title)}</Typography>
                    <Typography color="neutral" fontSize="sm">
                      {reflection.category}
                    </Typography>
                  </Stack>

                  <Typography fontSize="sm" color="neutral">
                    Written on{' '}
                    {new Date(reflection.submitted_at).toLocaleString()}
                  </Typography>

                  {typeof reflection.reflection === 'string' ? (
                    <Typography>{reflection.reflection}</Typography>
                  ) : (
                    <Stack spacing={1}>
                      <Typography>
                        <strong>Question:</strong> {reflection.reflection.question}
                      </Typography>
                      <Typography>
                        <strong>Reflection:</strong> {reflection.reflection.answer}
                      </Typography>
                    </Stack>
                  )}

                  {isOpen && reflection.code && (
                    <Box component="pre" sx={{mt: 1, p: 1, bgcolor: '#f5f5f5', borderRadius: 1, fontSize: '0.85rem', overflowX: 'auto', }}>
                      {reflection.code}
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          )
        })}
      </Stack>
    </>
  )
}

interface SearchProps {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  category: string;
  setCategory: Dispatch<SetStateAction<string>>;
}

function ReflectionTitle({ query, setQuery, category, setCategory }: SearchProps) {
  const categories = useMemo(() => getCategoryList(), []);

  return (
    <Stack width="90%" direction="row" justifyContent="space-between">
      <Typography level="h2">Your Reflections</Typography>
      <Stack direction="row" gap={2}>
        <Select sx={{ width: "150px" }} placeholder="Category" value={category} onChange={(e, newValue) => setCategory(newValue || "")}>
          <Option value="all">All</Option>
          { categories.map((c) => <Option value={c}>{c}</Option>) }
        </Select>
        <CustomSearch query={query} setQuery={setQuery} placeholder="Search for reflections..." />
      </Stack>
    </Stack>
  )
}
