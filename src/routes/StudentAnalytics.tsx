import { Box, Stack, Typography } from "@mui/joy";
import CategoriesBarGraph from "../components/profile/progress/CategoriesBarGraph";
import HeatMap from "../components/profile/progress/heatmap/HeatMap";
import ActivityGraph from "../components/profile/progress/ActivityGraph";
import OtherStats from "../components/profile/progress/other-stats/OtherStats";
import { StudentRecord } from "../types";
import { getProfiles } from "../utils/getProfiles";
import { useLoaderData } from "react-router-dom";
import useActivityTracker from "../hooks/useActivityTracker";
import Contract from "../components/profile/contract/Contract";

const containerStyles = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  pt: 3,
  pb: 4,
  px: 2,
  gap: 4,
};

const titleStyles = {
  fontSize: "2rem",
  textAlign: "center",
};

const contentStyles = {
  flex: 1,
  display: "flex",
  gap: 4,
  alignItems: "flex-start",
  justifyContent: "space-between",
};

const leftPanelStyles = {
  flex: "0 0 220px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
  p: 3,
  pb: 2,
  minHeight: 160,
  backgroundColor: "#f7f0dc",
  borderRadius: "lg",
  border: "1px solid",
  borderColor: "rgba(0, 0, 0, 0.08)",
};

const studentInfoStyles = {
  width: "100%",
  textAlign: "center",
};

const rightPanelStyles = {
  flex: 1,
  display: "flex",
  justifyContent: "flex-end",
};

const graphStackStyles = {
  width: "100%",
  maxWidth: 960,
};

export async function profileLoader({ params }: any): Promise<StudentRecord> {
  const profiles = await getProfiles();
  const selected = (profiles as StudentRecord[]).filter(
    (profile) => profile.profile_id === params.profile_id,
  );
  return selected[0];
}

export function StudentAnalytics() {
  const profileData = useLoaderData() as StudentRecord;

  const { userStartDate, activityStamps, categoriesData, passingStamps } =
    useActivityTracker(profileData);

  return (
    <Box sx={containerStyles}>
      <Typography level="h1" component="h1" sx={titleStyles}>
        Student Analytics: ({profileData.username})
      </Typography>
      <Box sx={contentStyles}>
        <Box sx={leftPanelStyles}>
            <Box sx={studentInfoStyles}>
              <Typography sx={{ fontSize: "1.05rem", fontWeight: 700, color: "#1f2937" }}>
                Student ID: {profileData.student_id ?? "No Student ID Found"}
              </Typography>
              <Typography sx={{ fontSize: "1rem", fontWeight: 600, color: "#1f2937" }}>
                Student Name: {profileData.username ?? "No Username Found"}
              </Typography>
            </Box>
        <Contract categoriesData={categoriesData} profileData={profileData} />
          </Box>
        <Box sx={rightPanelStyles}>
          <Stack sx={graphStackStyles}>
            <ActivityGraph
              activityStamps={activityStamps}
              passingStamps={passingStamps}
              startDate={userStartDate}
            />
            <CategoriesBarGraph categoriesData={categoriesData} />
            <HeatMap activity={activityStamps} />
            <OtherStats activity={activityStamps} />
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
