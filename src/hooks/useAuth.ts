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

  const fetchAdminStatus = useCallback((userId: string) => {
    supabase
      .from('profiles')
      .select('is_admin')
      .eq('profile_id', userId)
      .single()
      .then(({ data, error }) => {
        if (!error && data) setIsAdmin(data.is_admin);
      });
  }, []);

  useEffect(() => {
    // PKCE code exchange 
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
        if (!error && data.session) {
          setSession(data.session);
          fetchAdminStatus(data.session.user.id);
          window.history.replaceState({}, '', window.location.pathname + window.location.hash);
        }
      });
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (_event === 'PASSWORD_RECOVERY') {
        setIsRecoverySession(true);
        setSession(newSession);
        return;
      }
      setIsRecoverySession(false);
      setSession(newSession);
      if (newSession?.user) {
        fetchAdminStatus(newSession.user.id);
      } else {
        setIsAdmin(false);
      }
    });

    // only fetch existing session if no code to exchange
    if (!code) {
      supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
        setSession(currentSession);
        if (currentSession?.user) fetchAdminStatus(currentSession.user.id);
      });
    }

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = useCallback(async () => {
    if (!session) return;
    const { data } = await supabase
      .from('profiles')
      .select('username, pfp_id')
      .eq('profile_id', session.user.id)
      .single();
    if (data) {
      setUserData({ name: data.username, pfp_id: data.pfp_id });
    }
  }, [session]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { session, userData, isAdmin, isRecoverySession, fetchProfile };
}