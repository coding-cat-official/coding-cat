import { Session } from "@supabase/supabase-js";
import { FormEvent, useState } from "react";
import { supabase } from "../../supabaseClient";
import { Avatar, Button, FormLabel, IconButton, Input, Stack, Typography } from "@mui/joy";
import { NotePencil } from "@phosphor-icons/react";

interface UserProps {
  username: string
  email: string
  studentId: string
  session: Session
}

export default function UserInfo({ username, email, studentId, session }: UserProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [name, setName] = useState(username);
  const [id, setId] = useState(studentId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function updateProfile(event: FormEvent) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);
    const { user } = session;

    const updates = {
      profile_id: user.id,
      username: name,
      student_id: id,
      updated_at: new Date(),
    };

    const { error } = await supabase.from('profiles').upsert(updates);

    if (error) {
      setError(error.message);
    } else {
      setIsUpdating(false);
    }
    
    setSuccess("Profile updated successfully!");
    setLoading(false);
  }

  return (
    <Stack alignItems="center" className="account">
      {
        isUpdating ? 
        <form onSubmit={updateProfile} className="form-widget">
          <Stack direction="column" gap={1} alignItems="center">
            <Typography level="h2">Edit Profile</Typography>
            <FormLabel>Name</FormLabel>
            <Input
              placeholder="Enter your name..."
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
            />
            <FormLabel>Email</FormLabel>
            <Input
              value={email}
              required
              disabled
            />
            <FormLabel>Student ID</FormLabel>
            <Input
              placeholder="Enter your student ID..."
              value={id}
              required
              onChange={(e) => setId(e.target.value)}
            />

            <Stack direction="row" gap={1}>
              <Button disabled={loading} type="submit">
                { loading ? 'Loading ...' : 'Update' }
              </Button>
              <Button onClick={() => setIsUpdating(false)}>Cancel</Button>
            </Stack>

            <Typography color="danger">{error}</Typography>
          </Stack>
        </form> :
        <>
          <Avatar color="primary" size="lg">{username.charAt(0)}</Avatar>
          <Stack alignItems="center">
            <Stack direction="row" justifyContent="center" gap={1}>
              <Typography level="h2">{username}</Typography>
              <IconButton onClick={() => {setIsUpdating(true); setSuccess("");}}>
                <NotePencil size={23} />
              </IconButton>
            </Stack>
            <Typography>{email}</Typography>
            <Typography>#{studentId}</Typography>
            <Typography color="success">{success}</Typography>
          </Stack>
        </>
      }
    </Stack>
  )
}
