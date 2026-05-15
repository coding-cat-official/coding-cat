import { useEffect } from "react";
import { Problem } from "../types";
import { TEST_CATEGORY_PATTERN } from "../utils/constants";
import { supabase } from "../supabaseClient";

export default function useTestCategoriesSync(problems: Problem[]) {
  // Get all test categories in a list
  const testCategories = problems
    .map((c) => c.meta.category)
    .filter((c) => c.match(TEST_CATEGORY_PATTERN))
    .filter((c, index, arr) => arr.indexOf(c) === index);

  // On startup it syncs the test questions to the db
  // DRAWBACK: Every user instance on a browser is a db query
  useEffect(() => {
    (async () => {
      await syncTestCategories(testCategories, false);
    })();
  }, [testCategories]);
}

// Sync test categories on startup
async function syncTestCategories(category: string | string[], isActive: boolean) {
  const categories = Array.isArray(category) ? category : [category];
  
  // Update or insert the existing categories to the db
  const { error } = await supabase.from("testcategories").upsert(
    categories.map((cat) => ({ category: cat, is_active: isActive })),
    { onConflict: "category", ignoreDuplicates: true },
  );

  if (error) {
    throw new Error(error.message);
  }
}
