import { useEffect } from "react";
import { Problem } from "../types";
import { TEST_CATEGORY_PATTERN } from "../utils/constants";
import { supabase } from "../supabaseClient";

/**
 * A hook that syncs the test categories to the db
 * @param problems the full problem set
 */
export default function useTestCategoriesSync(problems: Problem[]) {
  // Get all test categories in a list
  const testCategories = problems
    .map((c) => c.meta.category)
    .filter((c) => c.match(TEST_CATEGORY_PATTERN))
    .filter((c, index, arr) => arr.indexOf(c) === index);

  // On startup it syncs the test questions to the db
  // DRAWBACK: Page needs to be refreshed once
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

  // Delete old test categories that are not in the problem submodules
  const {error : deleteError } = await supabase
    .from("testcategories")
    .delete()
    .not("category", "in", `(${categories.map((category) => `"${category}"`).join(",")})`);

  if (deleteError) {
    throw new Error(deleteError.message);
  }
}
