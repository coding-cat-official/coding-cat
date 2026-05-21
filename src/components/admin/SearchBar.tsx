import { useState } from "react";
import { Autocomplete } from "@mui/joy";
import { useStudentSearch } from "../../utils/useStudentSearch";
import { useNavigate } from "react-router-dom";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const profileData = useStudentSearch(query);
  const navigate = useNavigate();
  const loading = profileData.length === 0;

  return (
    <Autocomplete
      options={profileData}
      getOptionLabel={(profile) => profile.username}
      onChange={(_, selectedOption) => {
        if (selectedOption) navigate(`/admin/student-analytics/${selectedOption.profile_id}`);
      }}
      inputValue={query}
      onInputChange={(_, value) => setQuery(value)}
      loading={loading}
      placeholder="Search for a student..."
    />
  );
}

// A function that takes the search data that is being fetched and formats it in a way to be readable
