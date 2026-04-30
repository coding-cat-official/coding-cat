import { Typography } from "@mui/joy";

export default function BusiestDayOfWeek({ busiestDaysOfWeek }: { busiestDaysOfWeek: { day: string, contribs: number }[] }){
  return(
    <>
    { busiestDaysOfWeek.length === 1 &&
      <Typography level="body-md">
        Busiest day of the week, on average: {busiestDaysOfWeek[0]["day"]} ({busiestDaysOfWeek[0]["contribs"]} total submissions)
      </Typography>
    }
    { busiestDaysOfWeek.length > 1 &&
      <Typography level="body-md">
        Busiest days of the week, on average:
        { 
          busiestDaysOfWeek.map(({day, contribs}, i) => {
            const atEnd = i == busiestDaysOfWeek.length - 1;
            var text = ` ${day}`;
            if(!atEnd){
              text += ", ";
            }else{
              text = "and " + text + ` (tied at ${contribs} submissions)`;
            }
            return (text);
          })
        }
      </Typography>
    }
    </>
  );
}