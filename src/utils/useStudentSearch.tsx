import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

type StudentRecord = { username: string };

export function useStudentSearch(query: string) {
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {

    // Get profiles based on query parameters
    const searchStudentProfiles = async () => {
      const { data: studentData, error } = await supabase
        .from("profiles")
        .select("username")
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
      formatOptions(studentData);
    };

    if (query.length > 0) {
      runSearch();
    }
  }, [query]);


  // Format how to display data
  const formatOptions = (studentData: StudentRecord[] | null) => {
    if (!studentData) {
      setOptions([]);
      return;
    }

    const ids = studentData.map((val: StudentRecord) => val.username);
    setOptions(ids);
  };

  return options;
}
