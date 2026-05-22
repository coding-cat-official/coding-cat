import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Session } from "@supabase/supabase-js";
import { Button, Stack, Typography } from "@mui/joy";
import { Reflection, SessionReflectionRecord } from "../types";
import UserInfo from "../components/profile/UserInfo";
import Reflections from "../components/profile/reflections/Reflections";
import Contract from "../components/profile/contract/Contract";
import ActivityGraph from "../components/profile/progress/ActivityGraph";
import CategoriesBarGraph from "../components/profile/progress/CategoriesBarGraph";
import { getCompletedProblems } from "../utils/getCompletedProblems";
import HeatMap from "../components/profile/progress/heatmap/HeatMap";
import OtherStats from "../components/profile/progress/other-stats/OtherStats";
import { useOutletContext } from "react-router-dom";
import SessionReflections from "../components/profile/sessions/SessionReflections";

interface CategoryData {
  category: string;
  completed: number;
  total: number;
  problems: object[];
  question_type: string;
}

/**
 * The `Account` component handles everything related to the profile page.
 * Additional components used in the profile page are located in `components/profile`.
 */
export default function Account({ session }: { session: Session }) {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [activityStamps, setActivityStamps] = useState<string[]>([]);
  const [passingStamps, setPassingStamps] = useState<string[]>([]);
  const [userStartDate, setUserStartDate] = useState<Date>(new Date());
  const [categoriesData, setCategoriesData] = useState<CategoryData[]>([]);
  const [problemCountByCategory, setProblemCountByCategory] = useState<Record<string, number>>({});
  const [sessionReflections, setSessionReflections] = useState<SessionReflectionRecord[]>([]);

  const { refetchProfile } = useOutletContext<{ refetchProfile: () => Promise<void> }>();

  // Change "reflections" into something else
  const [view, setView] = useState<"reflections" | "activity" | "sessions">("reflections");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProgress() {
      const { user } = session;

      const { data: submissions, error } = await supabase
        .from("submissions")
        .select(
          "problem_title, passed_tests, total_tests, problem_category, code, reflection, submitted_at",
        )
        .eq("profile_id", user.id)
        .order("submitted_at", { ascending: false });

      if (error) {
        setError(error.message);
      }
      //could seperate it into other functions if it gets too big, but for now it's manageable
      const { data: sessions, error: sessionError } = await supabase
        .from("sessions")
        .select("*")
        .eq("profile_id", user.id)
        .not("post_session_reflection", "is", null)
        .order("start_time", { ascending: false });

      if (sessionError) {
        setError(sessionError.message);
      } else {
        setSessionReflections((sessions ?? []) as SessionReflectionRecord[]);
      }

      const reflections: Reflection[] = (submissions || [])
        .filter((r) => r.reflection != null)
        .map((r) => ({
          category: r.problem_category,
          problem_title: r.problem_title,
          reflection: r.reflection,
          submitted_at: r.submitted_at,
          code: r.code,
        }));
      setReflections(reflections);
      const all = (submissions || []).map((r) => r.submitted_at);
      const pass = (submissions || [])
        .filter((r) => r.passed_tests === r.total_tests)
        .map((r) => r.submitted_at);

      setActivityStamps(all);
      setPassingStamps(pass);
      setCategoriesData(getCompletedProblems(submissions || []));
    }

    setUserStartDate(new Date(session.user.created_at) || new Date());

    fetchProgress();
  }, [session, setUserStartDate, setCategoriesData]);

  // if the categoriesData changes, update the problem count
  useEffect(() => {
    const probCountByCat = Object.fromEntries(
      categoriesData.map(({ category, total }) => [category, total]),
    );
    setProblemCountByCategory(probCountByCat);
  }, [categoriesData, setProblemCountByCategory]);

  return (
    <Stack width="100%" height="100%" direction="row" className="profile-wrapper">
      {!!error && <Typography color="danger">Error: {error}</Typography>}
      <Stack
        flex={1}
        alignItems="center"
        justifyContent="center"
        gap={5}
        className="account-wrapper"
      >
        <UserInfo refetchProfile={refetchProfile} />
        <Contract problemCountByCategory={problemCountByCategory} />
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
