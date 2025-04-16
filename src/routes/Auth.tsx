import { FormEvent, useState } from 'react'
import { supabase } from '../supabaseClient'
import { Box, Button, FormLabel, Input, Stack, Typography } from '@mui/joy';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      setError(error.message);
    } else {
      setSuccess('Check your email for the login link!');
    }

    setLoading(false);
  }

  return (
    <Stack sx={{ width: "100%" }} direction="column" spacing="20px" justifyContent="center" alignItems="center">
      <Typography level="h2">Login</Typography>
      <form style={{ width: "25%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "20px" }} onSubmit={handleLogin}>
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
        </Box>
        <Button disabled={loading} type="submit">
          {loading ? <span>Loading</span> : <span>Send confirmation link</span>}
        </Button>
      </form>
      { !!error && <Typography color="danger">{error}</Typography> }
      { !!success && <Typography color="success">{success}</Typography> }
    </Stack>
  )
}
