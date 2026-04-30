import { Box, Card, Stack, Typography } from "@mui/joy";
import HeatMapTile from "./HeatMapTile";
import HeatMapLegend from "./HeatMapLegend";

export default function HeatMap({ activity }: { activity: string[] }) {
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
  const firstCont = activity[0];
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

  function getMonth(week: { date: string, contributions: number }[]): string{
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    for(const day of week){
      if(day.date.slice(8) == "01"){
        const month = parseInt(day.date.slice(5,7), 10) - 1;
        return months[month];
      }
    }
    return "";
  }

  // get month label positions
  const monthLabels: { label: string, weekIndex: number }[] = [];
  weeks.forEach((week, i) => {
    const label = getMonth(week);
    if (label) monthLabels.push({ label, weekIndex: i });
  });

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const shownDays = [1, 3, 5];

  const TILE_SIZE = 10;
  // gap={0.5} = 4px
  const GAP = 4; 
  const CELL = TILE_SIZE + GAP;
  // space for day labels
  const LEFT_OFFSET = 30;

  return (
    <Stack gap={2}>
      <Typography level="h2">Activity Heat Map</Typography>
      <Card sx={{ p: 2, width: "90%", height: "100%" }}>
        <Typography level="title-md">{activity.length} total submissions</Typography>
        {/* Container for all labels and grid */}
        <Box sx={{ display: "flex", flexDirection: "row", minWidth: 0 }}>
          { /* Day labels */}
          <Box sx={{ position: "relative", width: `${LEFT_OFFSET}px`, flexShrink: 0, mt: "20px" }}>
            {shownDays.map((dayIndex) => (
              <Typography
                key={dayIndex}
                level="body-xs"
                sx={{
                  position: "absolute",
                  top: dayIndex * CELL,
                  right: 4,
                  lineHeight: `${TILE_SIZE}px`,
                }}
              >
                {dayLabels[dayIndex]}
              </Typography>
            ))}
          </Box>
          {/* Scrolling box */}
          <Box sx={{ overflowX: "auto", paddingBottom: "15px", position: "relative", ml: "2px", flex: 1, minWidth: 0 }}>
            {/* Month labels */}
            <Box sx={{ position: "relative", height: "16px", mb: 0.5 }}>
              {
                monthLabels.map(({ label, weekIndex }) => (
                  <Typography
                    key={label}
                    level="body-xs"
                    sx={{ position: "absolute", left: weekIndex * CELL }}
                  >
                    {label}
                  </Typography>
                ))
              }
            </Box>

            { /* Grid */ }
            <Stack direction="row" gap={GAP / 8} alignItems="flex-start">
              {weeks.map((week, i) => (
                <Stack key={i} direction="column" gap={GAP / 8} alignItems="flex-start" sx={{ lineHeight: 0, fontSize: 0 }}>
                  {
                    week.map(({ date, contributions }) => (
                      <HeatMapTile
                        tileSize={TILE_SIZE}
                        gapSize={GAP}
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
          </Box>
        </Box>
        <HeatMapLegend colours={colours}/>
      </Card>
    </Stack>
  )
}
