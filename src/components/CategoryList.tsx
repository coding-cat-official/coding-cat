import {List, ListItemButton} from '@mui/joy'

export interface CategoryListProps {
    problems: import('../types').Problem[]
    activeCategory: string | null
    onSelectCategory: (cat: string) => void;
}

export default function CategoryList({
    problems,
    activeCategory,
    onSelectCategory,
  }: CategoryListProps) {
    const categories = Array.from(
      new Set(problems.map((p) => p.meta.category)),
    ).sort()

    // TODO: hide categories that don't have any search results

    return (
        <List component="nav" sx={{ py: 2}}>
            {categories.map((cat) => (
            <ListItemButton
                key={cat}
                selected={cat === activeCategory}
                onClick={()=> {
                    onSelectCategory(cat)
                }}
                sx = {{
                    borderRadius: 'md', my: 1, py: 2, px: 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: cat === activeCategory ? 'primary.softBg' : 'background.surface',
                    '&:hover': { bgcolor: 'primary.softBgHover' },
                }} >
                {cat}
            </ListItemButton>
            ))}
        </List>
    )
}
