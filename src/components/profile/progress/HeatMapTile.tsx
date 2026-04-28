import { Box } from "@mui/joy";

export default function HeatMapTile({ date, contributions }: { date: string, contributions: number }){
  var heatmapColor = "gray";
  // if there are MORE contributions than 'num', Block is 'color'
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

  return (
    <div>
      <Box id={date}
        data-tooltip-id="date-tooltip"
        data-tooltip-content={`${contributions} contributions on ${date}`}
        data-tooltip-place="left"
        sx={{ 
          backgroundColor: `${heatmapColor}`,
          padding: "5px",
          borderRadius: 3
        }}
      >
        
      </Box>
    </div>
  )
}