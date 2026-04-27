import { Card, Stack, Typography } from "@mui/joy";

export default function HeatMap({ activity }: { activity: string[] }) {
  // make it total problems touched, ie unique problems submitted for
  
  return (
    <Stack gap={2}>
      <Typography level="h2">Activity Heat Map</Typography>
      <Card sx={{ p: 2, width: "90%", height: "100%" }}>
        
      </Card>
    </Stack>
  )
}
