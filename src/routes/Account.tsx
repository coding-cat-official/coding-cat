import { useState, useEffect, FormEvent } from 'react'
import { supabase } from '../supabaseClient'
import { Session } from '@supabase/supabase-js'
import { Stack, Typography } from '@mui/joy';
import problems from '../public-problems/problems';
import { Progress } from '../types';
import { NotePencil } from '@phosphor-icons/react';

export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [studentId, setStudentId] = useState("");
  const [progress, setProgress] = useState<Progress[]>([]);

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

  async function updateProfile(event: FormEvent) {
    event.preventDefault();

    setLoading(true);
    const { user } = session;

    const updates = {
      profile_id: user.id,
      username,
      student_id: studentId,
      updated_at: new Date(),
    };

    const { error } = await supabase.from('profiles').upsert(updates);

    if (error) {
      alert(error.message);
    } 
    
    setLoading(false);
  }

  return (
    <Stack width="100%" height="100%" direction="row">
      <UserInfo username={username} email={session.user.email || ""} studentId={studentId} />
      <ProgressList progress={progress} />
      {/* <form onSubmit={updateProfile} className="form-widget">
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="text" value={session.user.email} disabled />
        </div>
        <div>
          <label htmlFor="username">Name</label>
          <input
            id="username"
            type="text"
            required
            value={username || ''}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="studentId">Student Id</label>
          <input
            id="studentId"
            type="Number"
            required
            value={studentId || ''}
            onChange={(e) => setStudentId(e.target.value)}
          />
        </div>

        <div>
          <button className="button block primary" type="submit" disabled={loading}>
            {loading ? 'Loading ...' : 'Update'}
          </button>
        </div>
      </form> */}

        
    </Stack> 
  )
}

interface UserProps {
  username: string
  email: string
  studentId: string
}

function UserInfo({ username, email, studentId }: UserProps) {
  const [update, setUpdate] = useState(false);

  return (
    <Stack flex={1} alignItems="center" justifyContent="center">
      <img src="" alt="pfp"></img>
      <Stack direction="row" alignItems="center" gap={1}>
        <Typography level="h2">{username}</Typography>
        <NotePencil size={23} />
      </Stack>
      <Typography>{email}</Typography>
      <Typography>#{studentId}</Typography>
    </Stack>
  )
}

function ProgressList({ progress }: { progress: Progress[] }) {
  return (
    <Stack flex={2} alignItems="center">
      <Typography level="h2">Your Progress</Typography>
      <ul>
        {progress.map((item) => (
          <li key={item.category}>
            {item.completed} / {item.total} problems completed in <strong>{item.category} </strong>
            ({Math.round((item.completed / item.total) * 100)}%)
          </li>
        ))}
      </ul>
    </Stack>
  )
}
