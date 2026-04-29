import { Box, Tooltip } from "@mui/joy";

export default function HeatMapTile({ title, heatmapColour }: { title: string, heatmapColour: string }){
  return (
    <Tooltip 
      title={title}
      variant="soft"
      placement="top"
      disableInteractive
    >
      <Box id={title}
        sx={{ 
          maxHeight: "5px",
          backgroundColor: `${heatmapColour || "grey"}`,
          padding: "5px",
          borderRadius: 3
        }}
      />
    </Tooltip>
  )
}