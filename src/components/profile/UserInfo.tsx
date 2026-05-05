import { Session } from "@supabase/supabase-js";
import { FormEvent, useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { Button, FormLabel, IconButton, Input, Stack, Typography } from "@mui/joy";
import { NotePencil } from "@phosphor-icons/react";
import { useOutletContext } from "react-router-dom";
import PremadeProfileAvatar from "./avatar/PremadeProfileAvatar";

// TODO: maybe get these dynamically?
const ALL_PFPS = [
  "coding-cat-pfp.png", // this one first to default to it
  "bongo-coding-pfp.png",
  "coding-cat-mugshot-pfp.png",
  "laptop-pfp.png",
  "thumbs-up-pfp.png"
]

export default function UserInfo() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [premadePfp, setPremadePfp] = useState("");
  const [tempPremadePfpPos, setTempPremadePfpPos] = useState(0);
  const [tempPremadePfp, setTempPremadePfp] = useState(premadePfp);

  const { session } = useOutletContext<{ session: Session | null }>();

  useEffect(() => {
    let ignore = false;

    (async function getProfile() {
      setLoading(true);
      if (!session) return;
      const { user } = session;

      const { data, error } = await supabase
        .from('profiles')
        .select('username, student_id, pfp_id') 
        .eq('profile_id', user.id)
        .single();

      if (!ignore) {
        if (error) {
          alert(error.message);
          console.warn(error);
        } else if (data) {
          setName(data.username ?? "Unnamed User");
          setId(data.student_id ?? "");
          setPremadePfp(ALL_PFPS[data.pfp_id] ?? 0);
          setTempPremadePfpPos(data.pfp_id ?? 0);
        }
      }
      setLoading(false);
    })();

    return () => {
      ignore = true;
    }
  }, [session])

  useEffect(() => {
    setTempPremadePfp(ALL_PFPS[tempPremadePfpPos]);
  }, [tempPremadePfpPos]);

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
      pfp_id: tempPremadePfpPos
    };

    const { error } = await supabase.from('profiles').upsert(updates);

    if (error) {
      setError(error.message);
    } else {
      setIsUpdating(false);
      setPremadePfp(tempPremadePfp);
      setSuccess("Profile updated successfully!");
    }
    
    setLoading(false);
  }

  const iteratePfp: Function = (num: number) => {
    var newPos = tempPremadePfpPos + num;
    if(newPos > ALL_PFPS.length - 1){
      newPos = 0;
    }else if(newPos < 0){
      newPos = ALL_PFPS.length - 1;
    }
    setTempPremadePfpPos(newPos);
  }

  return (
    <Stack alignItems="center" className="account">
      {
        isUpdating ? 
        <form onSubmit={updateProfile} className="form-widget">
          <Stack direction="column" gap={1} alignItems="center">
            <Typography level="h2">Edit Profile</Typography>
            <FormLabel>Profile Picture</FormLabel>
            <PremadeProfileAvatar fileName={tempPremadePfp} />
            <Stack flexDirection="row" gap={0.5}>
              <Button onClick={() => iteratePfp(-1)}>Prev</Button>
              <Button onClick={() => iteratePfp(1)}>Next</Button>
            </Stack>
            <FormLabel>Name</FormLabel>
            <Input
              placeholder="Enter your name..."
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
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
          <PremadeProfileAvatar fileName={premadePfp} />
          <Stack alignItems="center">
            <Stack direction="row" justifyContent="center" gap={1}>
              <Typography level="h2">{name || "Unnamed User"}</Typography>
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
