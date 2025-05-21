import { Box, Typography } from "@mui/joy";

export default function SolutionCode({problem}:any){

  return(
    <>
      <Box sx={{width: "100%"}}>
        <Typography level="h3">
          Solution Code
        </Typography>
        <Box component="pre" sx={{mt: 1, p: 1, bgcolor: '#f5f5f5', borderRadius: "10px", fontSize: '0.85rem', overflowX: 'auto', border:"1px solid black"}}>
          { problem.solution }
        </Box>
      </Box>
    </>
  )
}