import { useState } from "react";
import { Autocomplete } from "@mui/joy";
import { useStudentSearch } from "../../utils/useStudentSearch";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const options = useStudentSearch(query);
  const loading = options.length === 0;

  return (
    <Autocomplete
      options={options}
      inputValue={query}
      onInputChange={(_, value) => setQuery(value)}
      loading={loading}
      placeholder="Search for a student..."
    />
  );
}

// A function that takes the search data that is being fetched and formats it in a way to be readable
