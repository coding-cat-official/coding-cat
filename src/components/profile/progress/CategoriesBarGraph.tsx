import { Card, Stack, Typography } from "@mui/joy";
import { BarChart, CartesianGrid, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";

interface CategoryData {
  category: string;
  completed: number;
  total: number;
  problems: object[];
  question_type: string;
}

export default function CategoriesBarGraph({ categoriesData }: { categoriesData: CategoryData[] }) {
  // TODO: Pie chart of total questions remaining from contract
  
  const graphData = categoriesData
    .map(category => {
      return {
        name: category.category,
        Completed: category.completed,
        total: category.total,
        "Incomplete / Not Started": category.total - category.completed
      }
    })
    // sort alphabetically
    .sort((a, b) => a.name.localeCompare(b.name));
    

  return (
  <Stack gap={2}>
    <Typography level="h2">Completed Problems Per Category</Typography>
    <Card sx={{ p: 2, width: "90%", height: "100%" }}>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={graphData}
        margin={{ top: 10, right: 20, left: 0, bottom: 50 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name"
          angle={-35}
          textAnchor="end"
          interval={0}
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          width={40} 
          allowDecimals={false}
          tickCount={10}
          domain={[0, 'dataMax']}
        />
        <Tooltip isAnimationActive={false}
          labelFormatter={(label) => `Category: ${label}`}
        />
        <Bar
          dataKey="Completed"
          stackId="a"
          shape={(props: any) => {
            const { x, y, width, height, name } = props;
            const category = graphData.find(d => d.name === name);
            const isFull = category && category.Completed === category.total;
            const radius = isFull ? 10 : 0;
            return (
              // draws a rectangle with the top edges rounded if the green bar is full (category full-clear)
              // imagine a pen that you're giving the instructions to:
              // M - Move pen to
              // L - Line to
              // Q - Quadratic Bezier (curve)
              // Z - Close path
              <path
                d={
                  `M${x},${y + height}
                   L${x},${y + radius}
                   Q${x},${y} ${x + radius},${y}
                   L${x + width - radius},${y}
                   Q${x + width},${y} ${x + width},${y + radius}
                   L${x + width},${y + height}
                   Z`
                }
                fill="green"
              />
            );
          }}
        />
        <Bar 
          dataKey="Incomplete / Not Started" 
          stackId="a" 
          fill="#e0e0e0" 
          radius={[10, 10, 0, 0]} 
        />
      </BarChart>
    </ResponsiveContainer>
    </Card>
  </Stack>
  )
}
