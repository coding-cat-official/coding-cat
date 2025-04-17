import { useState, useEffect, FormEvent } from 'react'
import { supabase } from '../supabaseClient'
import { Session } from '@supabase/supabase-js'
import { Stack, Typography } from '@mui/joy';

export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [studentId, setStudentId] = useState("");

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
    <form onSubmit={updateProfile} className="form-widget">
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
    </form>
  )
}

interface UserProps {
  username: string
  email: string
  studentId: string
}

function UserInfo({username, email, studentId}: UserProps) {
  const [update, setUpdate] = useState(false);

  return (
    <Stack alignItems="center">
      <img src="" alt="pfp"></img>
      <Typography level="h2">{username}</Typography>
      <Typography>{email}</Typography>
      <Typography>#{studentId}</Typography>
    </Stack>
  )
}
