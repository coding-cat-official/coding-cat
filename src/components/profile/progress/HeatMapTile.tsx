import { Box, Tooltip } from "@mui/joy";

export default function HeatMapTile({ title, heatmapColour }: { title: string, heatmapColour: string }){
  return (
    <Tooltip 
      title={title}
      variant="soft"
      placement="right"
      disableInteractive
    >
      <Box id={title}
        sx={{ 
          backgroundColor: `${heatmapColour || "grey"}`,
          padding: "5px",
          borderRadius: 3
        }}
      />
    </Tooltip>
  )
}