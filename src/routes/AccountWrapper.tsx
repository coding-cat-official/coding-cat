import { useOutletContext, Navigate } from 'react-router-dom';
import Account from './Account';
import type { Session } from '@supabase/supabase-js';

export default function AccountWrapper() {
  const { session } = useOutletContext<{ session: Session | null }>();

  if (!session) {
    return <Navigate to="/signin" />;
  }

  return <Account session={session} />;
}
