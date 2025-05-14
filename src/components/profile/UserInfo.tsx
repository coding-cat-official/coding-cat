import { Session } from "@supabase/supabase-js";
import { FormEvent, useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { Avatar, Button, FormLabel, IconButton, Input, Stack, Typography } from "@mui/joy";
import { NotePencil } from "@phosphor-icons/react";
import { useOutletContext } from "react-router-dom";

export default function UserInfo() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { session } = useOutletContext<{ session: Session | null }>();

  useEffect(() => {
    let ignore = false;

    (async function getProfile() {
      setLoading(true);
      if (!session) return;
      const { user } = session;

      const { data, error } = await supabase
        .from('profiles')
        .select(`username, student_id`)
        .eq('profile_id', user.id)
        .single();

      if (!ignore) {
        if (error) {
          alert(error.message);
          console.warn(error);
        } else if (data) {
          setName(data.username);
          setId(data.student_id);
        }
      }
      setLoading(false);
    })();

    return () => {
      ignore = true;
    }
  }, [session])

  async function updateProfile(event: FormEvent) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);
    if (!session) return;
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
              value={session?.user.email}
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
          <Avatar color="primary" size="lg">{name.charAt(0)}</Avatar>
          <Stack alignItems="center">
            <Stack direction="row" justifyContent="center" gap={1}>
              <Typography level="h2">{name}</Typography>
              <IconButton onClick={() => { setIsUpdating(true); setSuccess(""); setError(""); }}>
                <NotePencil size={23} />
              </IconButton>
            </Stack>
            <Typography>{session?.user.email}</Typography>
            <Typography>#{id}</Typography>
            <Typography color="success">{success}</Typography>
          </Stack>
        </>
      }
    </Stack>
  )
}
