import { Card, Stack, Typography } from "@mui/joy";
import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function ActivityGraph({ activityStamps, passingStamps, startDate }: { activityStamps: string[], passingStamps: string[], startDate: Date }) {
  const activityData = useMemo(() => {
    
    const submissions: Record<string, number> = {}
    const passes: Record<string, number> = {}

    activityStamps.forEach((iso) => {
      // YYYY-MM-DD
      const date = iso.slice(0,10)
      submissions[date] = (submissions[date] ?? 0) + 1
    })

    passingStamps.forEach((iso) => {
      // YYYY-MM-DD
      const date = iso.slice(0,10)
      passes[date] = (passes[date] ?? 0) + 1
    })
    
    const end = new Date();
    const start = new Date(startDate);
    start.setDate(start.getDate() - 1)

    const allDays: { x: string; y: number; cumulative: number }[] = [];
    let runningPassTotal = 0;
    
    // for every day since 'start', add the activity to allDays
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      // YYYY-MM-DD
      const iso = d.toISOString().slice(0, 10);
      const daily = submissions[iso] || 0;
      const dailyPass = passes[iso] || 0;
      runningPassTotal += dailyPass
      allDays.push({ x: iso, y: daily, cumulative: runningPassTotal });
    }
    
    return allDays;
  }, [activityStamps, passingStamps, startDate]);

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
