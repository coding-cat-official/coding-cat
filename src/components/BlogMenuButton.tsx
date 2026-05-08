import { ListItemButton, Typography } from "@mui/joy";

export interface BlogMenuProps {
    activeCategory: string | null;
    onSelectCategory: (cat: string) => void;
    category: string;
}

export default function BlogMenuButton({ onSelectCategory, activeCategory, category }: BlogMenuProps) {
    return (<ListItemButton
        key={category}
        selected={category === activeCategory}
        onClick={() => {
            onSelectCategory(category)
        }}
        className={
            category === activeCategory ? 'category-active' : 'category-inactive'
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
        }}>
        <Typography sx={{ fontFamily: "Doto", fontWeight: "900" }}>
            Blog Posts
        </Typography>
    </ListItemButton>);
}