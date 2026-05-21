import { useState } from "react";
import { Autocomplete } from "@mui/joy";
import { useStudentSearch } from "../../utils/useStudentSearch";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const profileData = useStudentSearch(query);
  const loading = profileData.length === 0;
  
  // Format how to display options
  const formattedOptions = profileData.map(p => p.username)

  return (
    <Autocomplete
      options={formattedOptions}
      inputValue={query}
      onInputChange={(_, value) => setQuery(value)}
      loading={loading}
      placeholder="Search for a student..."
    />
  );
}

// A function that takes the search data that is being fetched and formats it in a way to be readable
