import { Card, Stack, Typography } from "@mui/joy";
import HeatMapTile from "./HeatMapTile";
import HeatMapLegend from "./HeatMapLegend";

export default function HeatMap({ activity }: { activity: string[] }) {
  // make it total problems touched, ie unique problems submitted for

  const submissions: Record<string, number> = {}

  activity.forEach((iso) => {
    // YYYY-MM-DD
    const date = iso.slice(0,10)
    submissions[date] = (submissions[date] ?? 0) + 1
  });

  function toDateStr(date: Date): string {
    return date.toISOString().slice(0,10);
  }

  function getSundayOfWeek(date: Date): Date {
    const d = new Date(date);
    // 0 = Sunday -> 6 = Saturday
    const day = d.getDay(); 
    // subtract days to go back to Sunday
    d.setDate(d.getDate() - day);
    // set to midnight to be safe
    d.setHours(0, 0, 0, 0);
    return d;
  }
  
  // activity is in reverse-chronological order
  const firstCont = activity[activity.length - 1];
  const firstWeek = getSundayOfWeek(new Date(firstCont));

  const now = new Date();
  const msSinceFirstWeek = now.getTime() - firstWeek.getTime();
  const totalWeeks = Math.floor(msSinceFirstWeek / (1000 * 60 * 60 * 24 * 7)) + 1;

  const weeks = Array.from({ length: totalWeeks }, (_, i) => {
    const weekStart = new Date(firstWeek);

    // get first day of every week
    weekStart.setDate(firstWeek.getDate() + i * 7);

    return Array.from({ length: 7 }, (_, j) => {
      const day = new Date(weekStart);
      // iterate every day based on weekStart
      day.setDate(weekStart.getDate() + j);
      const dateStr = toDateStr(day);
      return {
        date: dateStr,
        contributions: submissions[dateStr] ?? 0
      }
    });
  });

  var max = 0;
  // get max to determine quartiles for colour thresholds
  for(const [_, contribs] of Object.entries(submissions)){
    if(contribs > max) max = contribs;
  }

  // colours colour-picked from GitHub
  // ordered from least to most
  const colours = ["#151B23", "#033A16", "#196C2E", "#2EA043", "#56D364"];
  function getTileColour(contribs: number): string{
    if(contribs === 0){
      return colours[0];
    }
    if(contribs < (max * 0.25)){ // 1-25%
      return colours[1];
    }
    if(contribs < (max * 0.5)){ // 25-50%
      return colours[2];
    }
    if(contribs < (max * 0.75)){ // 50-75%
      return colours[3];
    }
    // top 25%
    return colours[4];
  }

  return (
    <Stack gap={2}>
      <Typography level="h2">Activity Heat Map</Typography>
      <Card sx={{ p: 2, width: "90%", height: "100%", marginBottom: "20px" }}>
        <Typography level="title-md">{activity.length} total submissions</Typography>
        <Stack direction="row" gap={0.5} alignItems="flex-start">
          {weeks.map((week, i) => (
            <Stack key={i} direction="column" gap={0.5} alignItems="flex-start" sx={{ lineHeight: 0, fontSize: 0 }}>
              {
                week.map(({ date, contributions }) => (
                  <HeatMapTile
                    title={`${contributions} contributions on ${date}`}
                    heatmapColour={getTileColour(contributions)}
                    tooltipPlacement="right"
                    key={date}
                  />
                ))
              }
            </Stack>
          ))}
        </Stack>
        <HeatMapLegend colours={colours}/>
      </Card>
    </Stack>
  )
}
