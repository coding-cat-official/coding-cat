import { Box, Tooltip } from "@mui/joy";

export default function HeatMapTile({ date, contributions }: { date: string, contributions: number }){
  var heatmapColor = "gray";
  // if there are MORE contributions than 'num', Block is 'color'
  // TODO: GitHub-style gradient
  const thresholds = [
    { num: 0, color: "red" },
    { num: 3, color: "yellow" },
    { num: 5, color: "lightgreen" },
    { num: 10, color: "green" },
  ]

  for(const threshold of thresholds){
    if(contributions > threshold.num){
      heatmapColor = threshold.color;
    }
  }

  // TODO: Maybe use mui/joy tooltip for consistency? one less dependency

  return (
    <Tooltip 
      title={`${contributions} contributions on ${date}`}
      variant="soft"
      placement="right"
      disableInteractive
    >
      <Box id={date}
        sx={{ 
          backgroundColor: `${heatmapColor}`,
          padding: "5px",
          borderRadius: 3
        }}
      >
        
      </Box>
    </Tooltip>
  )
}