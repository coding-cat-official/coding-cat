import { FormEvent, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { Box, Button, FormLabel, Input, Stack, Typography } from '@mui/joy';
import { Navigate, useOutletContext } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';

/**
 * Register page for the app.
 */
export default function Register() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { session } = useOutletContext<{ session: Session | null }>();

  // Clear data on unmount so it doesn't stay in memory
  useEffect(() => {
    return () => {
      setEmail("");
      setPassword("");
    };
  }, []);

  if (session) {
    return <Navigate to="/profile" />
  }

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        // !! if this is edited, it needs to match with the Supabase redirect URLs !!
        // check 'Authentication/URL Configuration'
        // ${window.location.origin} sets it dynamically to localhost or coding-cat.club
        emailRedirectTo: `${window.location.origin}/#/auth/callback`,
      },
    });

    if(error){
      setError(error.message);
    }else{
      setSuccess('User Registered!');
    }

    setLoading(false);
  }

  return (
    <Stack sx={{ flex: 3, width: "100%", marginBottom: "150px" }} direction="column" spacing="20px" justifyContent="center" alignItems="center">
      <Typography level="h2">Register</Typography>
      <form style={{ width: "25%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "20px" }} onSubmit={handleRegister}>
        <Box sx={{ width: "100%" }}>
          <FormLabel>Email</FormLabel>
          <Input
            className="inputField"
            type="email"
            placeholder="Enter your email..."
            value={email}
            required={true}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormLabel>Password</FormLabel>
          <Input
            className="inputField"
            type="password"
            placeholder="Enter your password..."
            value={password}
            required={true}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Box>
        <Button disabled={loading} type="submit">
          {loading ? <span>Loading</span> : <span>Register</span>}
        </Button>
      </form>
      { !!error && <Typography color="danger">{error}</Typography> }
      { !!success && <Typography color="success">{success}</Typography> }
    </Stack>
  )
}
