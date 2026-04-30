import { Card, Stack, Typography } from "@mui/joy";
import MostProdDayOfWeek from "./MostProdDayOfWeek";

export default function OtherStats({ activity }: { activity: string[] }){
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const daysActivity: Record<string,number> = {};
  
  activity.forEach((iso) => {
    // YYYY-MM-DD
    const date = new Date(iso.slice(0,10));
    daysActivity[daysOfWeek[date.getDay()]] = (daysActivity[daysOfWeek[date.getDay()]] ?? 0) + 1
  });

  var mostProdDays: { day: string, contribs: number }[] = [];
  var highestContribs = 0;
  for(const [day, contribs] of Object.entries(daysActivity)){
    if(contribs > highestContribs){
      mostProdDays = [];
      highestContribs = contribs;
      mostProdDays.push({ day: day, contribs: contribs });
    }else if(contribs == highestContribs){
      mostProdDays.push({ day: day, contribs: contribs });
    }
  }

  return (
    <Stack gap={2}>
    <Typography level="h2">Other Stats</Typography>
      <Card sx={{ p: 2, width: "90%", height: "100%", marginBottom: "20px" }}>
        { highestContribs > 0 && <MostProdDayOfWeek mostProdDays={mostProdDays} /> }
      </Card>
    </Stack>
  );
}