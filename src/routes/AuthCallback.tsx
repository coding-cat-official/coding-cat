import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Navigate } from 'react-router-dom';

export default function AuthCallback() {
  const [redirectTo, setRedirectTo] = useState<string | null>(null)

  useEffect(() => {
    // hash should give something like ex:
    // #/auth/callback#access_token=...&type=recovery
    const hash = window.location.hash;
    
    // split gives ['', '/auth/callback', 'access_token=...&type=recovery']
    // slice to remove first 2 indexes
    // join reassembles in case of another #
    const tokenPart = hash.split('#').slice(2).join('#');
    
    if (tokenPart) {
      const params = new URLSearchParams(tokenPart);
      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');
      const type = params.get('type');

      if (access_token && refresh_token) {
        supabase.auth.setSession({ access_token, refresh_token }).then(() => {
          if (type === 'recovery') {
            setRedirectTo('/change-password');
          } else {
            setRedirectTo('/');
          }
        });
      }
    }
  }, []);

  if (redirectTo) return <Navigate to={redirectTo} replace />;

  return <p>Confirming your account...</p>;
}