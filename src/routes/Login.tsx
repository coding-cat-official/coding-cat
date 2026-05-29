import { FormEvent, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { Box, Button, FormLabel, Input, Stack, Typography } from '@mui/joy';
import { Navigate, useOutletContext } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';

/**
 * Login page for the app.
 */
export default function Login() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { session } = useOutletContext<{ session: Session | null }>();

  // Clear data on unmount so it doesn't stay in memory
  useEffect(() => {
    return () => {
      setUsername("");
      setPassword("");
    };
  }, []);

  if (session) {
    return <Navigate to="/profile" />
  }

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: `${username}@coding-cat.internal`,
      password: password
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess('Success!');
    }

    setLoading(false);
  }

  return (
    <Stack sx={{ flex: 3, width: "100%", marginBottom: "150px" }} direction="column" spacing="20px" justifyContent="center" alignItems="center">
      <Typography level="h2">Login</Typography>
      <form style={{ width: "25%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "20px" }} onSubmit={handleLogin}>
        <Box sx={{ width: "100%" }}>
          <FormLabel>Email</FormLabel>
          <Input
            className="inputField"
            type="text"
            placeholder="Enter your username..."
            value={username}
            required={true}
            onChange={(e) => setUsername(e.target.value)}
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
          {loading ? <span>Loading</span> : <span>Login</span>}
        </Button>
      </form>
      { !!error && <Typography color="danger">{error}</Typography> }
      { !!success && <Typography color="success">{success}</Typography> }
    </Stack>
  )
}
