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
    /* Expected categoriesData example:
    {
        category: "Logic",
        completed: 8,
        total: 12,
        problems: [{...}, {...}, ...],
        question_type: "coding",
    }
    */
    const graphData = categoriesData.map(category => {
        return {
            name: category.category,
            completed: category.completed,
            total: category.total
        }
    });

    const barGraphColors = [
        "red",
        "orange",
        "yellow",
        "green",
        "lightblue",
        "blue",
        "violet",
        "magenta"
    ]

    return (
    <Stack gap={2}>
        <Typography level="h2">Completed Problems Per Category</Typography>
        <Card sx={{ p: 2, width: "90%", height: "100%" }}>
        <ResponsiveContainer width="100%" height={300}>
            <BarChart
                data={graphData}
                margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
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
                    // 10% margin above the tallest bar
                    domain={[0, (dataMax: number) => Math.ceil(dataMax)]}
                />
                <Tooltip isAnimationActive={false}
                    labelFormatter={(label) => `Category: ${label}`}
                />
                <Bar dataKey="completed" radius={[10, 10, 0, 0]}>
                    {graphData.map((entry, index) => (
                        <Cell
                            key={entry.name}
                            fill={barGraphColors[index % barGraphColors.length]}
                        />
                    ))}
                </Bar>
                <Bar dataKey="total" radius={[10, 10, 0, 0]}>
                    {graphData.map((entry, index) => (
                        <Cell
                            key={entry.name}
                            fill={"green"}
                        />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
        </Card>
    </Stack>
    )
}
