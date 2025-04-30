import { Button, Stack, Textarea, Typography } from "@mui/joy";
import { useState } from "react";

export default function ReflectionInput() {
  const [text, setText] = useState("");

  return (
    <Stack direction="column" width="100%" height="100%" gap={1}>
      <Typography level="title-lg">Reflection Prompt</Typography>
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
            <Button disabled={!text.trim()} onClick={() => console.log(text)}>Submit</Button>
          </Stack>
        }
      />
    </Stack>
  )
}
