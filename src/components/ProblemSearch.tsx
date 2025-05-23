import { Input } from "@mui/joy";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { Dispatch, SetStateAction } from "react";

interface SearchProps {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  placeholder: string;
}

export default function CustomSearch({ query, setQuery, placeholder }: SearchProps) {
  return (
    <Input
      sx={{
        '&::before': {
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
        fontWeight: "normal",
        fontFamily: "Silkscreen"
      }}
      className="problemList-search"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder={placeholder}
      endDecorator={<MagnifyingGlass size={23}/>}
      size="lg"
    />
  )
}
