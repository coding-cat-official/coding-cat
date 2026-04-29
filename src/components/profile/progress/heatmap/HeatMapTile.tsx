import { Box, Tooltip, TooltipProps } from "@mui/joy";

export default function HeatMapTile({ title, heatmapColour, tooltipPlacement }: { title: string, heatmapColour: string, tooltipPlacement: TooltipProps["placement"] }){
  return (
    <Tooltip 
      title={title}
      variant="soft"
      placement={tooltipPlacement}
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