import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { CategoryData, Reflection, SessionReflectionRecord, StudentRecord } from "../types";
import { getCompletedProblems } from "../utils/getCompletedProblems";
import { User } from "@supabase/auth-js";

// Function that always gets the proper id depending on if that data is a Session or a StudentRecord
function getStudentProfileID(studentData: any) {
  if (studentData.id) {
    return studentData.id;
  } else {
    return studentData.profile_id;
  }
}

/**
 * A react hook that retrieves activity and reflection information based on the user's profile id
 * @param studentData Either a StudentRecord or a Supabase User Session
 */
export default function useActivityTracker(studentData: User | StudentRecord) {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [activityStamps, setActivityStamps] = useState<string[]>([]);
  const [passingStamps, setPassingStamps] = useState<string[]>([]);
  const [categoriesData, setCategoriesData] = useState<CategoryData[]>([]);
  const [sessionReflections, setSessionReflections] = useState<SessionReflectionRecord[]>([]);
  const [userStartDate, setUserStartDate] = useState<Date>(new Date());

  const profileId = getStudentProfileID(studentData);
  const createdAt = studentData.created_at;

  useEffect(() => {
    async function fetchProgress() {
      // Fetch submission data for a specific user
      const { data: submissions, error } = await supabase
        .from("submissions")
        .select(
          "problem_title, passed_tests, total_tests, problem_category, code, reflection, submitted_at",
        )
        .eq("profile_id", profileId)
        .order("submitted_at", { ascending: false });

      if (error) {
        throw Error(error.message);
      }

      // Fetch sessions data for a specific user
      const { data: sessions, error: sessionError } = await supabase
        .from("sessions")
        .select("*")
        .eq("profile_id", profileId)
        .not("post_session_reflection", "is", null)
        .order("start_time", { ascending: false });

      if (sessionError) {
        throw Error(sessionError.message);
      }

      // Fetch reflections
      const fetchReflections: Reflection[] = (submissions || [])
        .filter((r) => r.reflection != null)
        .map((r) => ({
          category: r.problem_category,
          problem_title: r.problem_title,
          reflection: r.reflection,
          submitted_at: r.submitted_at,
          code: r.code,
        }));
      setReflections(fetchReflections);
      const all = (submissions || []).map((r) => r.submitted_at);
      const pass = (submissions || [])
        .filter((r) => r.passed_tests === r.total_tests)
        .map((r) => r.submitted_at);

      setSessionReflections((sessions ?? []) as SessionReflectionRecord[]);
      setUserStartDate(new Date(createdAt) || new Date());
      setActivityStamps(all);
      setPassingStamps(pass);
      setCategoriesData(getCompletedProblems(submissions || []));
    }
    fetchProgress();
  }, [profileId, createdAt]);

  return {
    userStartDate,
    sessionReflections,
    activityStamps,
    passingStamps,
    categoriesData,
    reflections,
  };
}
