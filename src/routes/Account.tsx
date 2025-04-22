import { useState, useEffect, FormEvent } from 'react'
import { supabase } from '../supabaseClient'
import { Session } from '@supabase/supabase-js'
import { Accordion,
  AccordionDetails,
  AccordionGroup, 
  AccordionSummary, 
  accordionSummaryClasses, 
  Button, 
  FormLabel, 
  IconButton, 
  Input, 
  LinearProgress, 
  Stack, 
  Typography 
} from '@mui/joy';
import problems from '../public-problems/problems';
import { Progress } from '../types';
import { NotePencil } from '@phosphor-icons/react';

export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [studentId, setStudentId] = useState("");
  const [progress, setProgress] = useState<Progress[]>([]);
  const [view, setView] = useState<"progress" | "reflections">("progress");

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
    async function fetchProgress() {
      const { user } = session;
      
      const {data: submissions, error } = await supabase
      .from('submissions')
      .select('problem_title, passed_tests, total_tests')
      .eq('profile_id', user.id);

      if(error) {
        alert(error.message)
        return;
      }

      const totalByCategory: Record<string, number> = {};
      const completedByCategory: Record<string, number> = {};
      const completedTitles = new Set<string>();

      for(const p of problems) {
        const category = p.meta.category;
        totalByCategory[category] = (totalByCategory[category] || 0) +1;
      }

      for (const s of submissions || []) {
        if (s.passed_tests === s.total_tests) {
          completedTitles.add(s.problem_title);
        }
      }

      for (const p of problems) {
        const category = p.meta.category;
        if (completedTitles.has(p.meta.title)) {
          completedByCategory[category] = (completedByCategory[category] || 0) + 1;
        }
      }

      const summary = Object.keys(totalByCategory).map(category => ({
        category: category,
        completed: completedByCategory[category] || 0,
        total: totalByCategory[category]
      }));

      setProgress(summary);
    }

    fetchProgress();
  }, [session]);

  

  return (
    <Stack width="100%" height="100%" direction="row">
      <UserInfo username={username} email={session.user.email || ""} studentId={studentId} session={session} />
      <Stack marginTop={5} flex={2} gap={2}>
        <Stack direction="row" gap={1}>
          <Button onClick={() => setView("progress")} color={ view === "progress" ? "primary" : "neutral" }>Progress</Button>
          <Button onClick={() => setView("reflections")} color={ view === "reflections" ? "primary" : "neutral" } >Reflections</Button>
        </Stack>

        { view === "progress" ? <ProgressList progress={progress} /> : <Reflections /> }
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
    <Stack flex={1} alignItems="center" justifyContent="center">
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
          <img src="" alt="pfp"></img>
          <Stack direction="row" alignItems="center" gap={1}>
            <Typography level="h2">{username}</Typography>
            <IconButton onClick={() => {setIsUpdating(true); setSuccess("");}}>
              <NotePencil size={23} />
            </IconButton>
          </Stack>
          <Typography>{email}</Typography>
          <Typography>#{studentId}</Typography>
          <Typography color="success">{success}</Typography>
        </>
      }
    </Stack>
  )
}

function ProgressList({ progress }: { progress: Progress[] }) {
  return (
    <Stack sx={{ maxHeight: "100%" }} gap={2}>
      <Typography level="h2">Your Progress</Typography>
      {progress.map((item) => (
        <ProgressCard item={item} />
      ))}
    </Stack>
  )
}

function ProgressCard({ item }: { item: Progress }) {
  const percentageCompleted = Math.round((item.completed / item.total) * 100);
  // capitalize first letter of each category
  const categoryName = item.category.charAt(0).toUpperCase() + item.category.slice(1);

  // TODO:
  // - fix height changing when accordion is expanded
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
        <AccordionDetails>This is where all the types of problems and their completion rates will go.</AccordionDetails>
      </Accordion>
    </AccordionGroup>
  )
}

function Reflections() {
  return (
    <Stack>
      <Typography level="h2">Your Reflections</Typography>
      <Typography>Reflections haven't been implemented yet!</Typography>
    </Stack>
  )
}
