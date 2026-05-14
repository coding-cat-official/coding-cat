import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { type Session } from '@supabase/supabase-js';

interface UserData {
  name: string;
  pfp_id: number;
}

interface UseAuthReturn {
  session: Session | null;
  userData: UserData | null;
  isAdmin: boolean;
  isRecoverySession: boolean;
  fetchProfile: () => Promise<void>;
}

export default function useAuth(): UseAuthReturn {
  const [session, setSession] = useState<Session | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isRecoverySession, setIsRecoverySession] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!session) return;
    const { user } = session;

    const { data } = await supabase
      .from('profiles')
      .select('username, pfp_id')
      .eq('profile_id', user.id)
      .single();

    if (data) {
      setUserData({
        name: data.username,
        pfp_id: data.pfp_id,
      });
    }
  }, [session]);

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, newSession) => {
      if (_event === 'PASSWORD_RECOVERY') {
        setIsRecoverySession(true);
        return;
      }
      setIsRecoverySession(false);
      setSession(newSession);

      if (newSession?.user) {
        supabase
          .from('profiles')
          .select('is_admin')
          .eq('profile_id', newSession.user.id)
          .single()
          .then(({ data, error }) => {
            if (!error && data) {
              setIsAdmin(data.is_admin);
            }
          });
      } else {
        setIsAdmin(false);
      }
    });

    if (!isRecoverySession) {
      supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
        setSession(currentSession);
        if (currentSession?.user) {
          supabase
            .from('profiles')
            .select('is_admin')
            .eq('profile_id', currentSession.user.id)
            .single()
            .then(({ data, error }) => {
              if (!error && data) {
                setIsAdmin(data.is_admin);
              }
            });
        }
      });
    }
  }, [isRecoverySession]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    session,
    userData,
    isAdmin,
    isRecoverySession,
    fetchProfile,
  };
}
