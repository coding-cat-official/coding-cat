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
import { Progress } from '../types';
import { NotePencil } from '@phosphor-icons/react';
import { getCompletedProblems } from '../utils/getCompletedProblems';

export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [studentId, setStudentId] = useState("");
  const [progress, setProgress] = useState<Progress[]>([]);
  const [view, setView] = useState<"progress" | "reflections">("progress");
  const [error, setError] = useState("");

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
        setError(error.message);
      }

      const summary = getCompletedProblems(submissions || []);

      setProgress(summary);
    }

    fetchProgress();
  }, [session]);

  

  return (
    <Stack width="100%" height="100%" direction="row" className="profile-wrapper">
      <Stack flex={1} alignItems="center" justifyContent="center" gap={5} className="account-wrapper">
        <UserInfo username={username} email={session.user.email || ""} studentId={studentId} session={session} />
        <Contract />
      </Stack>
      <Stack marginTop={5} flex={2} gap={2} className="progress-wrapper">
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
          <img src="" alt="pfp"></img>
          <Stack>
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

function Contract() {
  return (
    <Stack alignItems="center">
      <Stack direction="row" alignItems="center" gap={1}>
        <Typography level="h2">Contract</Typography>
        <IconButton onClick={() => {}}>
          <NotePencil size={23} />
        </IconButton>
      </Stack>
      <Typography>contract here</Typography>
    </Stack>
  )
}

function ProgressList({ progress }: { progress: Progress[] }) {
  return (
    <Stack gap={2}>
      <Typography level="h2">Your Progress</Typography>
      {/* looking for a better solution for the height */}
      <Stack sx={{ height: "59vh", overflowY: "scroll" }} direction="column" gap={2}>
        {progress.map((item) => (
          <ProgressCard item={item} key={item.category} />
        ))}
      </Stack>
    </Stack>
  )
}

function ProgressCard({ item }: { item: Progress }) {
  const percentageCompleted = Math.round((item.completed / item.total) * 100);
  // capitalize first letter of each category
  const categoryName = item.category.charAt(0).toUpperCase() + item.category.slice(1);

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
