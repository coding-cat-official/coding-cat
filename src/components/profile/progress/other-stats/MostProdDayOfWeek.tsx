import { Typography } from "@mui/joy";

export default function MostProdDay({ mostProdDays }: { mostProdDays: { day: string, contribs: number }[] }){
  return(
    <>
    { mostProdDays.length === 1 &&
      <Typography level="body-md">
        Busiest day of the week, on average: {mostProdDays[0]["day"]} ({mostProdDays[0]["contribs"]} submissions)
      </Typography>
    }
    { mostProdDays.length > 1 &&
      <Typography level="body-md">
        Busiest days of the week, on average:
        { 
          mostProdDays.map(({day, contribs}, i) => {
            const atEnd = i == mostProdDays.length - 1;
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