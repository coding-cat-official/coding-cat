import { useState } from "react";
import { Autocomplete } from "@mui/joy";
import { useStudentSearch } from "../../hooks/useStudentSearch";
import { useNavigate } from "react-router-dom";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const profileData = useStudentSearch(query);
  const navigate = useNavigate();

  return (
    <Autocomplete
      options={profileData}
      getOptionLabel={(profile) => profile.username}
      onChange={(_, selectedOption) => {
        if (selectedOption) navigate(`/admin/student-analytics/${selectedOption.profile_id}`);
      }}
      inputValue={query}
      onInputChange={(_, value) => setQuery(value)}
      noOptionsText={"No Students Found"}
      placeholder="Search for a student..."
    />
  );
}

// A function that takes the search data that is being fetched and formats it in a way to be readable
