import { FormEvent, useState } from 'react'
import { supabase } from '../supabaseClient'
import { Box, Button, FormLabel, Input, Stack, Typography } from '@mui/joy';
import { Navigate } from 'react-router-dom';

/**
 * Change Password page for the app.
 */
export default function ChangePassword() {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setError(error.message);
    } else {
      await supabase.auth.signOut();
      setDone(true);
    }
    setLoading(false);
  }

  if (done) return <Navigate to='/signin' />;

  return (
    <Stack sx={{ flex: 3, width: "100%", marginBottom: "150px" }} direction="column" spacing="20px" justifyContent="center" alignItems="center">
      <Typography level="h2">Change Password</Typography>
      <form style={{ width: "25%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "20px" }} onSubmit={handleSubmit}>
        <Box sx={{ width: "100%" }}>
          <FormLabel>New Password</FormLabel>
          <Input
            className="inputField"
            type="password"
            placeholder="Enter your new password..."
            value={newPassword}
            required={true}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </Box>
        <Button disabled={loading} type="submit">
          {loading ? <span>Loading</span> : <span>Change Password</span>}
        </Button>
      </form>
      {!!error && <Typography color="danger">{error}</Typography>}
    </Stack>
  )
}
