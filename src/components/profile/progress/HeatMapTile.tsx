export default function HeatMapTile({ date, contributions }: { date: string, contributions: number }){
  return (
    <div>
      <button id={date}
        data-tooltip-id="date-tooltip"
        data-tooltip-content={`${contributions} contributions on ${date}`}
        data-tooltip-place="left"
      >
            
      </button>
    </div>
  )
}