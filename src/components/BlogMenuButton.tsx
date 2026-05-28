import { ListItemButton, Typography } from "@mui/joy";
import { useEffect, useRef } from "react";

export interface BlogMenuProps {
  activeCategory: string | null;
  onSelectCategory: (cat: string) => void;
  category: string;
  kbFocus: string;
  kbSelectedCategory: string | null;
}

export default function BlogMenuButton({ 
  onSelectCategory,
  activeCategory,
  category,
  kbFocus,
  kbSelectedCategory
}: BlogMenuProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (category === kbSelectedCategory) {
      itemRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [kbSelectedCategory, category]);
  
  return (
    <ListItemButton
      ref={itemRef}
      key={category}
      selected={category === activeCategory}
      onClick={() => onSelectCategory(category)}
      className={
        category === activeCategory
          ? 'category-active' 
          : 'category-inactive'
      }
      sx={{
        borderRadius: 'md', my: 1, py: 2, px: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 1,
        cursor: 'pointer',
        margin: "10px 10px 10px 15px",
        boxShadow: "5px 5px black",
        border: "1px solid black",
        ...(category === kbSelectedCategory && kbFocus === "category" && 
          {
            backgroundColor: '#82d078 !important',
        })
      }}
    >
      <Typography sx={{ fontFamily: "Doto", fontWeight: "900" }}>
        Blog Posts
      </Typography>
    </ListItemButton>
  );
}