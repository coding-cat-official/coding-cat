import { Typography } from "@mui/joy";

export default function MostProdDay({ mostProdDays }: { mostProdDays: { day: string, contribs: number }[] }){
  return(
    <>
    { mostProdDays.length === 1 &&
      <Typography level="body-md">
        Most productive day of the week: {mostProdDays[0]["day"]} ({mostProdDays[0]["contribs"]} contributions)
      </Typography>
    }
    { mostProdDays.length > 1 &&
      <Typography level="body-md">
        Most productive days of the week:
        { 
          mostProdDays.map(({day, contribs}, i) => {
            const atEnd = i == mostProdDays.length - 1;
            var text = `${day} (${contribs} contributions)`;
            if(!atEnd){
              text += ", ";
            }else{
              text = "and " + text;
            }
            return (text);
          })
        }
      </Typography>
    }
    </>
  );
}