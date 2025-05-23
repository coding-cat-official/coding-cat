import { Navigate, Outlet, useOutletContext } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';

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
