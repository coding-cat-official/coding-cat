import { Box, Button, Card, Divider, Stack, Switch, Typography } from "@mui/joy";
import CategoriesBarGraph from "../components/profile/progress/CategoriesBarGraph";
import HeatMap from "../components/profile/progress/heatmap/HeatMap";
import ActivityGraph from "../components/profile/progress/ActivityGraph";
import OtherStats from "../components/profile/progress/other-stats/OtherStats";
import { StudentRecord } from "../types";
import { getProfiles } from "../utils/getProfiles";
import { useLoaderData } from "react-router-dom";
import useActivityTracker from "../hooks/useActivityTracker";
import Contract from "../components/profile/contract/Contract";
import { useState } from "react";
import { supabase } from "../supabaseClient";

const containerStyles = {
  minHeight: "100vh",
  px: { xs: 2, md: 4 },
  py: { xs: 2, md: 3 },
  background: "linear-gradient(180deg, #feffed 0%, #fff7d9 100%)",
};

const pageStyles = {
  width: "100%",
  maxWidth: 1500,
  mx: "auto",
  display: "flex",
  flexDirection: "column",
  gap: 3,
};

const heroStyles = {
  display: "flex",
  alignItems: { xs: "flex-start", md: "center" },
  justifyContent: "space-between",
  gap: 2,
  flexWrap: "wrap",
  p: { xs: 2, md: 3 },
  borderRadius: "xl",
  backgroundColor: "rgba(255, 255, 255, 0.72)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow: "0 20px 60px rgba(31, 41, 55, 0.08)",
};

const titleStyles = {
  fontSize: { xs: "1.7rem", md: "2.2rem" },
  textAlign: { xs: "left", md: "center" },
  lineHeight: 1.05,
  fontWeight: 800,
};

const contentStyles = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", lg: "300px minmax(0, 1fr)" },
  gap: { xs: 2, lg: 3 },
  alignItems: "start",
};

const leftPanelStyles = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
  p: 2.5,
  borderRadius: "xl",
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow: "0 18px 40px rgba(31, 41, 55, 0.08)",
};

const studentInfoStyles = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: 0.75,
};

const rightPanelStyles = {
  display: "flex",
  minWidth: 0,
};

const graphStackStyles = {
  width: "100%",
  gap: 2.25,
};

const graphCardStyles = {
  p: { xs: 1.5, md: 2 },
  borderRadius: "xl",
  backgroundColor: "rgba(255, 255, 255, 0.82)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow: "0 18px 40px rgba(31, 41, 55, 0.06)",
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
      <Box sx={pageStyles}>
        <Box sx={heroStyles}>
          <Box>
            <Typography level="h1" component="h1" sx={titleStyles}>
              Student Analytics
            </Typography>
            <Typography sx={{ mt: 0.75, color: "#4b5563", fontWeight: 500 }}>
              Performance, progress, and contract controls for {profileData.username}
            </Typography>
          </Box>
          <Button variant="soft" sx={{ alignSelf: { xs: "stretch", md: "center" } }}>
            Profile: {profileData.student_id ?? "Unknown"}
          </Button>
        </Box>
        <Box sx={contentStyles}>
          <Card sx={leftPanelStyles}>
            <Box sx={studentInfoStyles}>
              <Typography level="title-md" sx={{ color: "#111827" }}>
                {profileData.username ?? "No Username Found"}
              </Typography>
              <Typography sx={{ color: "#4b5563" }}>
                Student ID: {profileData.student_id ?? "No Student ID Found"}
              </Typography>
              <Typography level="body-sm" sx={{ color: "#6b7280" }}>
                Last updated: {new Date(profileData.updated_at).toLocaleDateString()}
              </Typography>
            </Box>

            <Divider />

            <Contract categoriesData={categoriesData} profileData={profileData} />

            <Divider />

            <ContractOverrideSwitch profileData={profileData} />
          </Card>

          <Box sx={rightPanelStyles}>
            <Stack sx={graphStackStyles}>
              <Card sx={graphCardStyles}>
                <ActivityGraph
                  activityStamps={activityStamps}
                  passingStamps={passingStamps}
                  startDate={userStartDate}
                />
              </Card>
              <Card sx={graphCardStyles}>
                <CategoriesBarGraph categoriesData={categoriesData} />
              </Card>
              <Card sx={graphCardStyles}>
                <HeatMap activity={activityStamps} />
              </Card>
              <Card sx={graphCardStyles}>
                <OtherStats activity={activityStamps} />
              </Card>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function ContractOverrideSwitch({ profileData }: { profileData: StudentRecord }) {
  const [isChecked, setIsChecked] = useState<boolean>(!!profileData.contract_override);

  const handleToggle = async () => {
    const nextChecked = !isChecked;

    setIsChecked(nextChecked);
    const { error } = await supabase
      .from("profiles")
      .update({ contract_override: nextChecked })
      .eq("profile_id", profileData.profile_id);

    if (error) {
      setIsChecked(!nextChecked);
      throw Error(error.message);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Box>
        <Typography level="title-sm" sx={{ color: "#111827" }}>
          Contract Override
        </Typography>
        <Typography level="body-sm" sx={{ color: "#6b7280" }}>
          Temporarily bypass the read-only contract lock for this student.
        </Typography>
      </Box>
      <Typography
        component="label"
        sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}
        endDecorator={<Switch checked={isChecked} onChange={handleToggle} />}
      >
        <span>Readonly override</span>
      </Typography>
    </Box>
  );
}
