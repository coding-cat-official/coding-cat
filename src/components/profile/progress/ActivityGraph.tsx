import { Card, Stack, Typography } from "@mui/joy";
import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function ActivityGraph({ activityStamps }: { activityStamps: string[] }) {
  const activityData = useMemo(() => {
    const counts: Record<string, number> = {}

    activityStamps.forEach((iso) => {
      const date = iso.slice(0,10)
      counts[date] = (counts[date] ?? 0) + 1
    })

    const days = Object.keys(counts).sort();
    if (days.length === 0) return [];

    const start = new Date(days[0]);
    const end = new Date(days[days.length - 1]);
    const allDays: { x: string; y: number }[] = [];
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const iso = d.toISOString().slice(0, 10);
      allDays.push({ x: iso, y: counts[iso] || 0 });
    }
    
    return allDays;
  }, [activityStamps]);

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
              formatter={(value: number) => [`${value}`, "Submissions"]}
            />
            <Line type="monotone" dataKey="y" stroke="#8884d8" strokeWidth={2} dot={{ r: 0 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </Stack>
  )
}
