import { Box, Typography } from "@mui/joy";
import { useState } from "react";

interface SolutionCodeProps {
  code: any;
  title?: any;
}

export default function SolutionCode({code, title}:SolutionCodeProps){
  
  const [open, setOpen] = useState(false);
  
  return(
    <>
      <Box>
        <Typography level="h3" onClick={() => setOpen(o => !o)} sx={{ cursor: "pointer"}}>
          {title} {open ? "▾" : "▸"}
        </Typography>
        {open && (
          <Box component="pre" sx={{mt: 1, p: 1, bgcolor: '#f5f5f5', borderRadius: 1, fontSize: '0.85rem', overflowX: 'scroll', width: 500,}}>
          { code }
          </Box>
        )}
      </Box>
    </>
  )
}