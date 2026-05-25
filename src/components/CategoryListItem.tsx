import { useEffect, useState, useRef } from 'react';
import { ListItemButton, Typography } from "@mui/joy";
import { LockSimple } from "@phosphor-icons/react";
import { capitalizeString } from "../utils/capitalizeString";
import { fetchCategories } from "../utils/TestCategoriesFetch";

function CategoryListItem({
  category,
  type,
  progress,
  mapCategoryToLock,
  activeCategory,
  onSelectCategory,
  session,
  contractProgress,
  kbSelectedCategory
}: any) {
  const itemRef = useRef<HTMLDivElement>(null);
  const summary = progress.find((p: any) => p[type] === category);
  const lock = mapCategoryToLock(category);
  const unlocked = lock.isUnlocked();

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
      onClick={() => {
        if (unlocked) {
          onSelectCategory(category);
        } else {
          lock.hint();
        }
      }}
      className={
        unlocked
          ? category === activeCategory
            ? "category-active"
            : "category-inactive"
          : "category-locked"
      }
      sx={{
        borderRadius: "md",
        my: 1,
        py: 2,
        px: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 1,
        cursor: unlocked ? "pointer" : "not-allowed",
        margin: "10px 10px 10px 15px",
        boxShadow: "5px 5px black",
        border: "1px solid black",
        ...(category === kbSelectedCategory && {
          backgroundColor: '#82d078 !important',
        })
      }}
    >
      {/* Change to use hidden as well */}
      {!unlocked && <LockSimple size={16} />}
      <Typography sx={{ fontFamily: "Doto", fontWeight: "900" }}>
        {!!session ? (
          <>
            {capitalizeString(category)} -{" "}
            <strong>
              {summary?.completed ?? 0}/{contractProgress[category] || (summary?.total ?? 0)}
            </strong>
          </>
        ) : (
          capitalizeString(category)
        )}
      </Typography>
    </ListItemButton>
  );
}

export default function CategoryListItems({
  categories,
  type,
  progress,
  mapCategoryToLock,
  activeCategory,
  onSelectCategory,
  session,
  contractProgress,
  kbSelectedCategory
}: any) {
  const [controlledCategories, setControlledCategories] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const fetchedCategories = await fetchCategories();

      if (!fetchedCategories) return;

      // Find the test categories that are toggled false
      const toRemove = [...fetchedCategories.entries()]
        .filter(([, values]) => values === false)
        .map(([key]) => key);

      const filteredCategories = categories.filter((val: string) => !toRemove.includes(val));

      setControlledCategories(filteredCategories);
    })();
  }, [categories]);

  return (
    <>
      {controlledCategories.map((category: string) => (
        <CategoryListItem
          key={category}
          category={category}
          type={type}
          progress={progress}
          mapCategoryToLock={mapCategoryToLock}
          activeCategory={activeCategory}
          onSelectCategory={onSelectCategory}
          session={session}
          contractProgress={contractProgress}
          kbSelectedCategory={kbSelectedCategory}
        />
      ))}
    </>
  );
}

