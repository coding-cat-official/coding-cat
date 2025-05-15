import { ListItemButton, Typography } from '@mui/joy'
import { LockSimple } from '@phosphor-icons/react';

export default function CategoryListItem({category, lock, unlocked, summary, activeCategory, onSelectCategory}:any) {
  
  return(
    <ListItemButton 
      key = {category}
      selected = { category === activeCategory}
      onClick={() => {
          if(unlocked){
              onSelectCategory(category)
          } else {
              lock.hint();
          }
      }}
      className={
          unlocked
          ? category === activeCategory ? 'category-active' : 'category-inactive'
          : 'category-locked'
        }
      sx = {{
          borderRadius: 'md', my: 1, py: 2, px: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 1,
          cursor: unlocked ? 'pointer' : 'not-allowed',
          margin: "10px 10px 10px 15px",
          boxShadow: "5px 5px black",
          border: "1px solid black",
      }}
      >
          {!unlocked && <LockSimple size={16}/>}
          <Typography sx={{fontFamily: "Doto", fontWeight: "900"}}>
              {category.charAt(0).toUpperCase() + category.slice(1)} - <strong>{summary?.completed ?? 0}/{summary?.total ?? 0}</strong>
          </Typography>
      </ListItemButton>
  )
}