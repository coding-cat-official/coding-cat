import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../supabaseClient';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) console.error('Auth callback error:', error);
        navigate('/', { replace: true });
      });
    } else {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  return <p>Signing you in...</p>;
}