import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../supabaseClient'
import { Session } from '@supabase/supabase-js'
import { Button, Card, Stack, Typography } from '@mui/joy';
import { BLANK_CONTRACT, Progress, Reflection, ContractData } from '../types';
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
import UserInfo from '../components/profile/UserInfo';
import ProgressList from '../components/profile/progress/Progress';
import Reflections from '../components/profile/reflections/Reflections';
import Contract from '../components/profile/contract/Contract';

export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [studentId, setStudentId] = useState("");
  const [progress, setProgress] = useState<Progress[]>([]);
  const [reflections, setReflections] = useState<Reflection[]>([])
  const [activityStamps, setActivityStamps] = useState<string[]>([])
  const [view, setView] = useState<"progress" | "reflections" | "activity">("progress");
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
