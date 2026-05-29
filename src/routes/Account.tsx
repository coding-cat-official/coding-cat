import { useState } from "react";
import { Session } from "@supabase/supabase-js";
import { Button, Stack, Typography } from "@mui/joy";
import UserInfo from "../components/profile/UserInfo";
import Reflections from "../components/profile/reflections/Reflections";
import Contract from "../components/profile/contract/Contract";
import ActivityGraph from "../components/profile/progress/ActivityGraph";
import CategoriesBarGraph from "../components/profile/progress/CategoriesBarGraph";
import HeatMap from "../components/profile/progress/heatmap/HeatMap";
import OtherStats from "../components/profile/progress/other-stats/OtherStats";
import { useOutletContext } from "react-router-dom";
import SessionReflections from "../components/profile/sessions/SessionReflections";
import useActivityTracker from "../hooks/useActivityTracker";

/**
 * The `Account` component handles everything related to the profile page.
 * Additional components used in the profile page are located in `components/profile`.
 */
export default function Account({ session }: { session: Session }) {
  const { refetchProfile } = useOutletContext<{ refetchProfile: () => Promise<void> }>();

  // Change "reflections" into something else
  const [view, setView] = useState<"reflections" | "activity" | "sessions">("reflections");

  // Get the current user session
  const { user } = session;

  // Retrieve all users stats via the current user session
  const {
    userStartDate,
    sessionReflections,
    activityStamps,
    categoriesData,
    passingStamps,
    reflections,
  } = useActivityTracker(user);

  return (
    <Stack 
      width="100%" 
      height="100%"
      flex={1}
      alignItems="flex-start"
      direction="row"
      className="profile-wrapper"
    >
      <Stack
        flex={1}
        flexDirection="column"
        alignItems="center"
        gap={5}
        className="account-wrapper"
      >
        <Stack direction="column" alignItems="center" gap={1}>
          <UserInfo refetchProfile={refetchProfile} />
        </Stack>
        <Stack direction="column" alignItems="center" gap={1}>
          <Typography level="h2">Contract</Typography>
          <Contract categoriesData={categoriesData} />
        </Stack>
      </Stack>
      <Stack marginTop={5} flex={2} gap={2} className="progress-wrapper">
        <Stack direction="row" gap={1}>
          <Button
            onClick={() => setView("reflections")}
            color={view === "reflections" ? "primary" : "neutral"}
          >
            Reflections
          </Button>
          <Button
            onClick={() => setView("activity")}
            color={view === "activity" ? "primary" : "neutral"}
          >
            Activity
          </Button>
          <Button
            onClick={() => setView("sessions")}
            color={view === "sessions" ? "primary" : "neutral"}
          >
            Sessions
          </Button>
        </Stack>

        {view === "activity" && (
          <ActivityGraph
            activityStamps={activityStamps}
            passingStamps={passingStamps}
            startDate={userStartDate}
          />
        )}
        {view === "activity" && <CategoriesBarGraph categoriesData={categoriesData} />}
        {view === "activity" && <HeatMap activity={activityStamps} />}
        {view === "activity" && <OtherStats activity={activityStamps} />}
        {view === "reflections" && <Reflections reflections={reflections} />}
        {view === "sessions" && <SessionReflections sessions={sessionReflections} />}
      </Stack>
    </Stack>
  );
}
