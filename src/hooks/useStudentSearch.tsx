import { useEffect, useState } from "react";
import { StudentRecord } from "../types";
import { getProfiles } from "../utils/getProfiles";

export function useStudentSearch(query: string) {
  const [profileData, setProfileData] = useState<StudentRecord[]>([]);

  useEffect(() => {

    // Wrapper function to search and filter
    const runSearch = async () => {
      const studentData = await getProfiles('username', query, 'ilike');
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
