import { Box, Tooltip } from "@mui/joy";

export default function HeatMapTile({ date, contributions, heatmapColour }: { date: string, contributions: number, heatmapColour: string }){
  return (
    <Tooltip 
      title={`${contributions} contributions on ${date}`}
      variant="soft"
      placement="right"
      disableInteractive
    >
      <Box id={date}
        sx={{ 
          backgroundColor: `${heatmapColour || "grey"}`,
          padding: "5px",
          borderRadius: 3
        }}
      />
    </Tooltip>
  )
}