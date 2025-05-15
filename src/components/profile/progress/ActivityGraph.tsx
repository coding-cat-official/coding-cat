import { Card, Stack, Typography } from "@mui/joy";
import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function ActivityGraph({ activityStamps, passingStamps }: { activityStamps: string[], passingStamps: string[] }) {
  const activityData = useMemo(() => {
    
    const counts: Record<string, number> = {}
    const passCounts: Record<string, number> = {}

    activityStamps.forEach((iso) => {
      const date = iso.slice(0,10)
      counts[date] = (counts[date] ?? 0) + 1
    })

    passingStamps.forEach((iso) => {
      const date = iso.slice(0,10)
      passCounts[date] = (passCounts[date] ?? 0) + 1
    })

    const end = new Date();
    const start = new Date(end);
    start.setDate(end.getDate() -29);

    const allDays: { x: string; y: number; cumulative: number }[] = [];
    let runningPassTotal = 0;
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const iso = d.toISOString().slice(0, 10);
      const daily = counts[iso] || 0;
      const dailyPass = passCounts[iso] || 0;
      runningPassTotal += dailyPass
      allDays.push({ x: iso, y: daily, cumulative: runningPassTotal });
    }
    
    return allDays;
  }, [activityStamps, passingStamps]);

  return (
    <Stack gap={2}>
      <Typography level="h2">Your Activity</Typography>
      <Card sx={{ p: 2, width: "90%", height: "100%" }}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={activityData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="x"
              tickFormatter={(date) => date.slice(5)}
              minTickGap={20}
            />
            <YAxis allowDecimals={false} />
            <Tooltip isAnimationActive={false}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Line type="monotone" dataKey="y" name="Submissions" stroke="#8884d8" strokeWidth={2} dot={{ r: 0 }} />
            <Line type="monotone" dataKey="cumulative" name="Cumulative Passes" stroke="#82ca9d" strokeWidth={2} dot={{ r: 0 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </Stack>
  )
}
