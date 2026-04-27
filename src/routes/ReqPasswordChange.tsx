import { FormEvent, useState } from 'react'
import { supabase } from '../supabaseClient'
import { Box, Button, FormLabel, Input, Stack, Typography } from '@mui/joy';

/**
 * Request Password Change page for the app.
 */
export default function ReqPasswordChange() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      // !! if this is edited, it needs to match with the Supabase redirect URLs !!
      // check 'Authentication/URL Configuration
      redirectTo: 'https://coding-cat.club/#/change-password'
    });
    
    if(error){
      setError(error.message)
    }else {
      setSuccess("Check your email for a password reset link!")
    }

    setLoading(false);
  }

  return (
    <Stack sx={{ flex: 3, width: "100%", marginBottom: "150px" }} direction="column" spacing="20px" justifyContent="center" alignItems="center">
      <Typography level="h2">Reset Password</Typography>
      <form style={{ width: "25%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "20px" }} onSubmit={handleSubmit}>
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
          {loading ? <span>Loading</span> : <span>Register User</span>}
        </Button>
      </form>
      { !!error && <Typography color="danger">{error}</Typography> }
      { !!success && <Typography color="success">{success}</Typography> }
    </Stack>
  )
}
