import { Card, Stack, Typography } from "@mui/joy";
import BusiestDayOfWeek from "./BusiestDayOfWeek";
import BusiestDates from "./BusiestDates";

export default function OtherStats({ activity }: { activity: string[] }){
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  // group all submissions by day of week
  const daysActivity: Record<string,number> = {};
  
  // group all submissions together by date
  const submissions: Record<string, number> = {}
  
  activity.forEach((iso) => {
    // YYYY-MM-DD
    const date = new Date(iso.slice(0,10));

    daysActivity[daysOfWeek[date.getDay()]] = (daysActivity[daysOfWeek[date.getDay()]] ?? 0) + 1
    submissions[iso.slice(0,10)] = (submissions[iso.slice(0,10)] ?? 0) + 1
  });

  var busiestDaysOfWeek: { day: string, contribs: number }[] = [];
  var highestWeekdayContribs = 0;
  for(const [day, contribs] of Object.entries(daysActivity)){
    if(contribs > highestWeekdayContribs){
      busiestDaysOfWeek = [];
      highestWeekdayContribs = contribs;
      busiestDaysOfWeek.push({ day: day, contribs: contribs });
    }else if(contribs === highestWeekdayContribs){
      busiestDaysOfWeek.push({ day: day, contribs: contribs });
    }
  }

  var busiestDates: { day: string, subs: number }[] = [];
  var busiestDateSubs = 0;
  for(const [day, subs] of Object.entries(submissions)){
    if(subs > busiestDateSubs){
      busiestDates = [{ day: day, subs: subs }];
      busiestDateSubs = subs;
    }else if(subs === busiestDateSubs){
      busiestDates.push({ day: day, subs: subs });
    }
  }

  return (
    <Stack gap={2}>
    <Typography level="h2">Other Stats</Typography>
      <Card sx={{ p: 2, width: "90%", height: "100%", marginBottom: "20px" }}>
        { highestWeekdayContribs > 0 && 
          <BusiestDayOfWeek busiestDaysOfWeek={busiestDaysOfWeek} />
        }
        { Object.entries(submissions).length > 0 && 
          <BusiestDates busiestDates={busiestDates} />
        }
      </Card>
    </Stack>
  );
}