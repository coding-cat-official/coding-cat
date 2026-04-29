import { Box, Tooltip, TooltipProps } from "@mui/joy";

export default function HeatMapTile({ title, heatmapColour, tooltipPlacement }: { title: string, heatmapColour: string, tooltipPlacement: TooltipProps["placement"] }){
  return (
    <Tooltip 
      title={title}
      variant="soft"
      placement={tooltipPlacement}
      disableInteractive
    >
      <Box
        id={title}
        sx={{ 
          height: "10px",
          width: "10px",
          flexShrink: 0,
          backgroundColor: `${heatmapColour || "grey"}`,
          borderRadius: "3px"
        }}
      />
    </Tooltip>
  )
}