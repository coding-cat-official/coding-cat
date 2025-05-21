import { Box, Typography } from "@mui/joy";

export default function SolutionCode({problem}:any){

  return(
    <>
      <Box>
        <Typography level="h3">
          Solution Code
        </Typography>
        <Box component="pre" sx={{mt: 1, p: 1, bgcolor: '#f5f5f5', borderRadius: 1, fontSize: '0.85rem', overflowX: 'auto', }}>
          { problem.solution }
        </Box>
      </Box>
    </>
  )
}