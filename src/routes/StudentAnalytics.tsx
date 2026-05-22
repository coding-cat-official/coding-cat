import { Box, Button, Typography } from "@mui/joy";
import CategoriesBarGraph from "../components/profile/progress/CategoriesBarGraph";
import HeatMap from "../components/profile/progress/heatmap/HeatMap";
import ActivityGraph from "../components/profile/progress/ActivityGraph";
import OtherStats from "../components/profile/progress/other-stats/OtherStats";
import { StudentRecord } from "../types";
import { getProfiles } from "../utils/getProfiles";
import { useLoaderData } from "react-router-dom";

const containerStyles = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "center",
  pt: 8,
  p: 2,
};

const titleStyles = {
  fontSize: "2rem",
  textAlign: "center",
};

export async function profileLoader({ params }: any): Promise<StudentRecord> {
  const profiles = await getProfiles();
  const selected = (profiles as StudentRecord[]).filter(
    (profile) => profile.profile_id === params.profile_id,
  );
  return selected[0]
}

export function StudentAnalytics() {
  const profileData = useLoaderData()
  return (
    <Box sx={containerStyles}>
      <Typography level="h1" component="h1" sx={titleStyles}>
        Student Analytics
      </Typography>
      <Button> View Contract </Button>
      {/* <ActivityGraph />
    <CategoriesBarGraph>
    <HeatMap />
    <OtherStats /> */}
    </Box>
  );
}
