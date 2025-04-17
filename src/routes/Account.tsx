import { useState, useEffect, FormEvent } from 'react'
import { supabase } from '../supabaseClient'
import { Session } from '@supabase/supabase-js'
import problems from '../public-problems/problems';

export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [studentId, setStudentId] = useState("");
  const [progress, setProgress] = useState<{ category:string, completed:number, total:number }[]>([]);

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
    <div>
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

        <div>
          <button className="button block" type="button" onClick={() => supabase.auth.signOut()}>
            Sign Out
          </button>
        </div>
      </form>

      <div>
        <h1>Your Progress</h1>
        <ul>
          {progress.map((item) => (
            <li key={item.category}>
              {item.completed} / {item.total} problems completed in <strong>{item.category}</strong>
            </li>
          ))}
        </ul>
      </div>   
    </div> 
  )
}
