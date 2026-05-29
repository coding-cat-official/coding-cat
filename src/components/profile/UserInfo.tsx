import { Session } from "@supabase/supabase-js";
import { FormEvent, useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { Button, Stack, Typography } from "@mui/joy";
import { useOutletContext } from "react-router-dom";
import ProfileAvatar from "./ProfileAvatar";
import { StudentRecord, UserData } from "../../types";

// TODO: maybe get these dynamically?
export const ALL_PFPS = [
  "coding-cat-pfp.png", // this one first to default to it
  "bongo-coding-pfp.png",
  "coding-cat-mugshot-pfp.png",
  "laptop-pfp.png",
  "thumbs-up-pfp.png"
]

export default function UserInfo({ userData, refetchProfile }: { userData: StudentRecord | null, refetchProfile: Function }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [pfpFileName, setPfpFileName] = useState("");
  const [pfpArrPos, setPfpArrPos] = useState(0);
  const [tempPfp, setTempPfp] = useState(pfpFileName);

  const { session } = useOutletContext<{ session: Session | null }>();

  const pfpHeight = 100;
  const pfpWidth = 100;

  useEffect(() => {
    let ignore = false;

    (async function getProfile() {
      setLoading(true);
      if (!session) return;
      const { user } = session;

      const { data, error } = await supabase
        .from('profiles')
        .select('username, pfp_id') 
        .eq('profile_id', user.id)
        .single();

      if (!ignore) {
        if (error) {
          setError(error.message);
          console.warn(error);
        } else if (data) {
          setPfpFileName(ALL_PFPS[data.pfp_id] ?? 0);
          setPfpArrPos(data.pfp_id ?? 0);
        }
      }
      setLoading(false);
    })();

    return () => {
      ignore = true;
    }
  }, [session])

  useEffect(() => {
    setTempPfp(ALL_PFPS[pfpArrPos]);
  }, [pfpArrPos]);

  async function updateProfile(event: FormEvent) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);
    if (!session) return;
    const { user } = session;

    const updates = {
      profile_id: user.id,
      updated_at: new Date(),
      pfp_id: pfpArrPos
    };

    const { error } = await supabase.from('profiles').upsert(updates);
    await refetchProfile();

    if (error) {
      setError(error.message);
    } else {
      setIsUpdating(false);
      setPfpFileName(tempPfp);
      setSuccess("Profile updated successfully!");
    }
    
    setLoading(false);
  }

  const iteratePfp: Function = (num: number) => {
    var newPos = pfpArrPos + num;
    if(newPos > ALL_PFPS.length - 1){
      newPos = 0;
    }else if(newPos < 0){
      newPos = ALL_PFPS.length - 1;
    }
    setPfpArrPos(newPos);
  }

  return (
    <Stack alignItems="center" className="account">
      {
        isUpdating ? 
        <form onSubmit={updateProfile} className="form-widget">
          <Stack direction="column" gap={1} alignItems="center">
            <Stack flexDirection="row" alignItems="center" gap={0.5}>
              <Button 
                onClick={() => iteratePfp(-1)}
                sx={{
                  height: "50%"
                }}
              >←</Button>
              <ProfileAvatar 
                fileName={tempPfp}
                height={pfpHeight}
                width={pfpWidth}
              />
              <Button 
                onClick={() => iteratePfp(1)}
                sx={{
                  height: "50%"
                }}
              >→</Button>
            </Stack>
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
          <Stack alignItems="center">
            <ProfileAvatar 
              fileName={pfpFileName}
              height={pfpHeight}
              width={pfpWidth}
            />
            { userData?.username && <Typography level="h2">{userData.username}</Typography> }
            <Button onClick={() => { setIsUpdating(true); setSuccess(""); setError(""); }}>
              Edit
            </Button>
            <Typography color="success">{success}</Typography>
          </Stack>
        </>
      }
    </Stack>
  )
}
