import { List, ListItem, Switch } from "@mui/joy";
import Box from "@mui/joy/Box";
import { Problem } from "../../types";
import useTestCategoriesSync from "../../hooks/useTestCategoriesSync";
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

interface ListProtectedCategoriesProps {
  problems: Problem[];
}

const boxStyles = {
  bgcolor: "#b2f2bb",
  border: "2px solid",
  borderColor: "#006400",
  borderRadius: 2,
  p: 2,
};

/**
 * A component that display and controls what test categories to display
 * @param testCategories List of strings representing the test categories
 * @returns <ListProtectedCategories {...props} />
 */
export function ListProtectedCategories({ problems }: ListProtectedCategoriesProps) {
  const [testCategoriesList, setTestCategoriesList] = useState<Map<string, boolean>>(new Map());

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from("testcategories").select("category, is_active");

      if (error) {
        console.error("Error fetching protected categories:", error);
        return;
      }

      const fetchedCategories = new Map<string, boolean>(
        (data ?? []).map((row) => [row.category as string, row.is_active as boolean]),
      );

      setTestCategoriesList(fetchedCategories);
    };

    fetchCategories();
  }, []);

  // Update db state on toggle switch
  const toggleCategories = async (category: string, isActive: boolean) => {
    setTestCategoriesList((prev) => {
      const next = new Map(prev);
      next.set(category, isActive);
      return next;
    });

    const { error } = await supabase
      .from("testcategories")
      .update({ is_active: isActive })
      .eq("category", category);

    if (error) {
      console.error("Error updating protected category:", error);
    }
  };

  // Retrieve test categories and store in db
  useTestCategoriesSync(problems);

  return (
    <Box sx={boxStyles}>
      <List>
        {Array.from(testCategoriesList.entries()).map(([category, isActive]) => (
          <ListItem key={category}>
            {category}
            <Switch checked={isActive} onChange={() => toggleCategories(category, !isActive)} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
