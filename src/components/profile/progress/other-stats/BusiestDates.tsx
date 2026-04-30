import { Typography } from "@mui/joy";

export default function BusiestDates({ busiestDates }: { busiestDates: { day: string, subs: number }[] }){
  return(
    <>
    { busiestDates.length === 1 &&
      <Typography level="body-md">
        Busiest day overall: {busiestDates[0]["day"]} ({busiestDates[0]["subs"]} submissions)
      </Typography>
    }
    { busiestDates.length > 1 &&
      <Typography level="body-md">
        Busiest days overall:
        { 
          busiestDates.map(({day, subs}, i) => {
            const atEnd = i == busiestDates.length - 1;
            var text = ` ${day}`;
            if(!atEnd){
              text += ", ";
            }else{
              text = "and " + text + ` (tied at ${subs} submissions)`;
            }
            return (text);
          })
        }
      </Typography>
    }
    </>
  );
}