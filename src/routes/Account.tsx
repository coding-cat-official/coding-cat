import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { Session } from '@supabase/supabase-js'
import { Button, Stack, Typography } from '@mui/joy';
import { Progress, Reflection } from '../types';
import { getCompletedProblems } from '../utils/getCompletedProblems';
import UserInfo from '../components/profile/UserInfo';
import ProgressList from '../components/profile/progress/Progress';
import Reflections from '../components/profile/reflections/Reflections';
import Contract from '../components/profile/contract/Contract';
import ActivityGraph from '../components/profile/progress/ActivityGraph';

export default function Account({ session }: { session: Session }) {
  const [progress, setProgress] = useState<Progress[]>([]);
  const [reflections, setReflections] = useState<Reflection[]>([])
  const [activityStamps, setActivityStamps] = useState<string[]>([])
  const [view, setView] = useState<"progress" | "reflections" | "activity">("progress");
  const [error, setError] = useState("");

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

  if (error) {
    return (
      <Stack width="100%" height="100%" direction="row" className="profile-wrapper">
        <Typography color="danger">Error fetching profile: {error}</Typography>
      </Stack>
    )
  }

  return (
    <Stack width="100%" height="100%" direction="row" className="profile-wrapper">
      <Stack flex={1} alignItems="center" justifyContent="center" gap={5} className="account-wrapper">
        <UserInfo />
        <Contract />
      </Stack>
      <Stack marginTop={5} flex={2} gap={2} className="progress-wrapper">
        <Stack direction="row" gap={1}>
          <Button onClick={() => setView("progress")} color={ view === "progress" ? "primary" : "neutral" }>Progress</Button>
          <Button onClick={() => setView("reflections")} color={ view === "reflections" ? "primary" : "neutral" } >Reflections</Button>
          <Button onClick={() => setView("activity")} color={ view === "activity" ? "primary" : "neutral" } >Activity</Button>
        </Stack>

        { view === "progress" && <ProgressList progress={progress} /> }
        { view === "reflections" && <Reflections reflections = {reflections} /> }
        { view === "activity" && <ActivityGraph activityStamps={activityStamps} /> }
    </Stack>
  </Stack>
  )
}
