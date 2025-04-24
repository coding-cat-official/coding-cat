import React from 'react'
import { Link } from 'react-router-dom'
import List from '@mui/joy/List'
import ListItemButton from '@mui/joy/ListItemButton'

export interface CategoryListProps {
    problems: import('../types').Problem[]
    activeCategory: string | null
    closeDrawer: () => void
}

export default function CategoryList({
    problems,
    activeCategory,
    closeDrawer,
  }: CategoryListProps) {
    const categories = Array.from(
      new Set(problems.map((p) => p.meta.category)),
    ).sort()

    return (
        <List component="nav">
            {categories.map((cat) => (
            <ListItemButton
                key={cat}
                component={Link}
                to={`/category/${encodeURIComponent(cat)}`}
                selected={cat === activeCategory}
                onClick={closeDrawer}
            >
                {cat}
            </ListItemButton>
            ))}
        </List>
    )
}