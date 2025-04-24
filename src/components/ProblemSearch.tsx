import { Input } from "@mui/joy";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { Dispatch, SetStateAction } from "react";

interface SearchProps {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>
}

export default function ProblemSearch({ query, setQuery }: SearchProps) {
  return (
    <Input
      sx={{
        '&::before': {
          border: '1.5px solid var(--Input-focusedHighlight)',
          transform: 'scaleX(0)',
          left: '2.5px',
          right: '2.5px',
          bottom: 0,
          top: 'unset',
          transition: 'transform .15s cubic-bezier(0.1,0.9,0.2,1)',
          borderRadius: 0,
          borderBottomLeftRadius: '64px 20px',
          borderBottomRightRadius: '64px 20px',
        },
        '&:focus-within::before': {
          transform: 'scaleX(1)',
        },
        fontWeight: "normal"
      }}
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search for exercises..."
      endDecorator={<MagnifyingGlass size={23}/>}
      size="lg"
    />
  )
}
