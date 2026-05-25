import { Navigate, Outlet, useOutletContext, redirect } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';

export default function AdminWrapper() {
  const { session, isAdmin } = useOutletContext<{
    session: Session | null;
    isAdmin: boolean;
  }>();

  if (!session || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export async function adminLoader() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return redirect('/');

    const { data, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('profile_id', session.user.id)
      .single();

    if (error || !data || !data.is_admin) return redirect('/');

    return null;
  } catch (e) {
    return redirect('/');
  }
}
