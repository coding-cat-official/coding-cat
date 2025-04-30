import { Button, IconButton, Stack, Textarea, Tooltip, Typography } from "@mui/joy";
import { Info } from "@phosphor-icons/react";
import { useState } from "react";

interface ReflectionProps {
  hide?: boolean;
}

export default function ReflectionInput({ hide }: ReflectionProps) {
  const [text, setText] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (hide) return <></>

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
      <Textarea
        sx={{ width: "100%", height: "100%", border: 2, borderRadius: 10 }}
        placeholder="Enter your reflection..."
        minRows={5}
        maxRows={10}
        value={text}
        onChange={(e) => setText(e.target.value)}
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
                !!success && <Typography level="body-sm" color="success">Successfully submitted reflection!</Typography>
              }
              {
                !!error && <Typography level="body-sm" color="danger">Error submitting reflection.</Typography>
              }
              <Button disabled={!text.trim()} onClick={() => console.log(text)}>Submit</Button>
            </Stack>
          </Stack>
        }
      />
    </Stack>
  )
}
