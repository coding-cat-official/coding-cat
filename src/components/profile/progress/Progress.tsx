import { Accordion, AccordionDetails, AccordionGroup, AccordionSummary, Button, LinearProgress, Stack, Typography, accordionSummaryClasses } from "@mui/joy";
import { Progress } from "../../../types";
import { Link } from "react-router-dom";
import { capitalizeString } from "../../../utils/capitalizeString";

export default function ProgressList({ progress }: { progress: Progress[] }) {
  return (
    <>
      <Typography level="h2">Your Progress</Typography>
      <Stack sx={{ height: "100%", overflowY: "scroll" }} direction="column" gap={2} mb={2}>
        {progress.map((item) => (
          <ProgressCard item={item} key={item.category} />
        ))}
      </Stack>
    </>
  )
}

function ProgressCard({ item }: { item: Progress }) {
  // capitalize first letter of each category
  const categoryName = item.category.charAt(0).toUpperCase() + item.category.slice(1);
  const percentageCompleted = Math.round((item.completed / item.total) * 100);
  const completedProblems: Record<string, string[]> = {};

  item.problems.forEach((p) => {
    if (!completedProblems[p.difficulty]) completedProblems[p.difficulty] = [];
    completedProblems[p.difficulty].push(p.title);
  });

  // TODO:
  // - fix border radius on hover

  return (
    <AccordionGroup sx={{
      borderRadius: "lg",
      maxWidth: "90%",
      [`& .${accordionSummaryClasses.button}`]: {
        paddingBlock: '1rem',
      }
      }} size="lg" variant="soft">
      <Accordion>
        <AccordionSummary>
          <Stack sx={{ width: "100%" }} direction="column" gap={1}>
            <Stack direction="row" justifyContent="space-between">
              <Stack direction="row" alignItems="center" gap={2}>
                <Typography level="h3">{categoryName}</Typography>
                <Typography>{item.completed} / {item.total}</Typography>
              </Stack>
              <Typography level="h4">{percentageCompleted}%</Typography>
            </Stack>
            <LinearProgress sx={{ backgroundColor: "#D5D5D5" }} color="success" determinate value={percentageCompleted} size="lg" />
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          {
            item.completed === 0 ? <Typography>You haven't completed any problems from this category.</Typography> :
            <Stack gap={2}>
              {
                Object.keys(completedProblems).map((o) => (
                    <Stack direction="column" gap={1}>
                      <Typography level="title-lg">{o.charAt(0).toUpperCase() + o.slice(1)}</Typography>
                      <Stack direction="row" gap={3} flexWrap="wrap">
                        {
                          completedProblems[o].map((p) => (
                            <Link style={{ textDecoration: "none" }} to={`/problems/${p}`}>
                              <Button sx={{ fontWeight: "normal" }} variant="plain">
                                <Typography>{capitalizeString(p)}</Typography>
                              </Button>
                            </Link>
                          ))
                        }
                      </Stack>
                    </Stack>
                  )
                )
              }
            </Stack>
          }
        </AccordionDetails>
      </Accordion>
    </AccordionGroup>
  )
}
