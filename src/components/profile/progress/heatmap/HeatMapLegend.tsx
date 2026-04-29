import { Stack, Typography } from "@mui/joy";
import HeatMapLegendTile from "./HeatMapLegendTile";

export default function HeatMapLegend({ colours }: { colours: string[] }){
  return (
    <Stack direction="row-reverse" alignItems="center" gap={0.25}>
          <HeatMapLegendTile
            title="75-100% of most active day"
            heatmapColour={colours[4]}
          />
          <HeatMapLegendTile
            title="50-74% of most active day"
            heatmapColour={colours[3]}
          />
          <HeatMapLegendTile
            title="25-49% of most active day"
            heatmapColour={colours[2]}
          />
          <HeatMapLegendTile
            title="0-24% of most active day"
            heatmapColour={colours[1]}
          />
          <HeatMapLegendTile
            title="No contributions"
            heatmapColour={colours[0]}
          />
          <Typography level="body-sm" sx={{ marginRight: "5px" }}>Legend:</Typography>
    </Stack>
  )
}