import { Card, Stack, Typography } from "@mui/joy";
import { Tooltip } from "react-tooltip";
import HeatMapTile from "./HeatMapTile";

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
    d.setHours(0, 0, 0, 0);
    return d;
  }
  
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

  return (
    <Stack gap={2}>
      <Typography level="h2">Activity Heat Map</Typography>
      <Card sx={{ p: 2, width: "90%", height: "100%" }}>
        <Stack direction="row" gap={0.5}>
          {weeks.map((week, i) => (
            <Stack key={i} direction="column" gap={0.5}>
              {week.map(({ date, contributions }) => (
                <HeatMapTile
                  date={date}
                  contributions={contributions}
                  key={date}
                />
              ))}
            </Stack>
          ))}
        </Stack>
        <Tooltip id="date-tooltip" />
      </Card>
    </Stack>
  )
}
