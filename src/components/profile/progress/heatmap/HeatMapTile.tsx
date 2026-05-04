import { Box, Tooltip, TooltipProps } from "@mui/joy";

export default function HeatMapTile({ tileSize, title, heatmapColour, tooltipPlacement }: { tileSize: number, title: string, heatmapColour: string, tooltipPlacement: TooltipProps["placement"] }){
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
          height: `${tileSize}px`,
          width: `${tileSize}px`,
          flexShrink: 0,
          backgroundColor: `${heatmapColour || "grey"}`,
          borderRadius: "3px"
        }}
      />
    </Tooltip>
  )
}