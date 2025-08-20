import { ListItemButton, Typography } from '@mui/joy'
import { LockSimple } from '@phosphor-icons/react';
import { capitalizeString } from '../utils/capitalizeString';

export default function CategoryListItems({categories, type, progress, mapCategoryToLock, activeCategory, onSelectCategory, session, contractProgress}:any) {
  return(
    <>
     {categories.map((category:string) => {
        const summary = progress.find((p: any) => p[type] === category)
        const lock = mapCategoryToLock(category);
        const unlocked = lock.isUnlocked();
        return (
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
                        {
                            !!session ? 
                            <>{capitalizeString(category)} - <strong>{summary?.completed ?? 0}/{contractProgress[category] || (summary?.total ?? 0)}</strong></> 
                            : capitalizeString(category)
                        }
                    </Typography>
                </ListItemButton>
            )
      })}
    </>
  )
}
