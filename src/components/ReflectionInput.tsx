import { Button, FormLabel, IconButton, Stack, Textarea, Tooltip, Typography } from "@mui/joy";
import { Info } from "@phosphor-icons/react";
import { Session } from "@supabase/supabase-js";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { supabase } from "../supabaseClient";

interface ReflectionProps {
  hide?: boolean;
  problemName: string;
}

export default function ReflectionInput({ hide, problemName }: ReflectionProps) {
  const [text, setText] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { session } = useOutletContext<{ session: Session | null }>();

  if (hide || !session) return <></>

  async function handleSubmission() {
    setLoading(true);
    setError("");
    setSuccess("");

    const { user } = session!!;

    const { error } = await supabase
      .from("submissions")
      .update({ "reflection": text })
      .eq('profile_id', user.id)
      .eq('problem_title', problemName)
      .order('submitted_at', { ascending: false})
      .limit(1)
      .select();

    if (error) setError("Error submitting reflection.");
    else setSuccess("Successfully submitted reflection!");

    setLoading(false);
  }

  return (
    <Stack direction="column" width="100%" height="100%" gap={1}>
      <Stack direction="row" gap={1} alignItems="center">
        <Typography level="title-lg">Reflection Prompt</Typography>
        <Tooltip
          sx={{ maxWidth: "15em" }} 
          title="This reflection will be associated with the most recent successful submission. Make sure to submit a reflection before submitting code again." 
          placement="right" 
          arrow
          open={showTooltip}
          onOpen={() => setShowTooltip(true)}
          onClose={() => setShowTooltip(false)}
        >  
          <IconButton onClick={() => setShowTooltip(!showTooltip)}>
            <Info size={24} />
          </IconButton>
        </Tooltip>
      </Stack>
      {/* Placeholder question for now, will have a list of rotating questions later. */}
      <FormLabel>How did you end up solving the problem?</FormLabel>
      <Textarea
        sx={{ width: "100%", height: "100%", border: 2, borderRadius: 10 }}
        placeholder="Enter your reflection..."
        minRows={5}
        maxRows={10}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="backgroundAnimated"
        endDecorator={
          <Stack
            width="100%" 
            direction="row" 
            alignItems="center" 
            justifyContent="space-between" 
            borderTop="1px solid" 
            pt="var(--Textarea-paddingBlock)"
          >
            <Typography level="body-xs">
              {
                text.trim() === "" ? "0 word(s)" :
                `${text.trim().split(" ").length } word(s)`
              }
            </Typography>
            <Stack direction="row" alignItems="center" gap={1}>
              {
                !!success && <Typography level="body-sm" color="success">{success}</Typography>
              }
              {
                !!error && <Typography level="body-sm" color="danger">{error}</Typography>
              }
              <Button disabled={!text.trim() || loading} onClick={async () => await handleSubmission()}>Submit</Button>
            </Stack>
          </Stack>
        }
      />
    </Stack>
  )
}
