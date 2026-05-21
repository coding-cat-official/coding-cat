import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { StudentRecord } from "../types";

export function useStudentSearch(query: string) {
  const [profileData, setProfileData] = useState<StudentRecord[]>([]);

  useEffect(() => {
    // Get profiles based on query parameters
    const searchStudentProfiles = async () => {
      const { data: studentData, error } = await supabase
        .from("profiles")
        .select()
        .ilike("username", `%${query}%`);

      if (error) {
        console.error("Failed to fetch student profiles:", error);
        throw error;
      }

      return studentData as StudentRecord[] | null;
    };

    // Wrapper function to search and filter
    const runSearch = async () => {
      const studentData = await searchStudentProfiles();
      if (!studentData) {
        setProfileData([]);
        return;
      } else {
        setProfileData(studentData);
      }
    };

    if (query.length > 0) {
      runSearch();
    }

    // Set options on cleanup to empty to avoid stale results
    return () => setProfileData([]);
  }, [query]);

  return profileData;
}
