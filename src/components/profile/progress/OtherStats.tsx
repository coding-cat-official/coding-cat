import { Card, Stack, Typography } from "@mui/joy";

export default function OtherStats({ activity }: { activity: string[] }){
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const daysActivity: Record<string,number> = {};
  
  activity.forEach((iso) => {
    // YYYY-MM-DD
    const date = new Date(iso.slice(0,10));
    daysActivity[daysOfWeek[date.getDay()]] = (daysActivity[daysOfWeek[date.getDay()]] ?? 0) + 1
  });

  console.log(daysActivity);

  var [mostProdDay, highestContribs] = ["", 0];
  for(const [day, contribs] of Object.entries(daysActivity)){
    if(contribs > highestContribs){
      highestContribs = contribs;
      mostProdDay = day;
    }
  }

  return (
    <Stack gap={2}>
    <Typography level="h2">Other Stats</Typography>
      <Card sx={{ p: 2, width: "90%", height: "100%" }}>
        { highestContribs > 0 && 
          <Typography level="body-md">
            Most productive day of the week: {mostProdDay} ({highestContribs} total contributions!)
          </Typography>
        }
      </Card>
    </Stack>
  );
}