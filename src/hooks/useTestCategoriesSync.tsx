import { useEffect } from "react";
import { Problem } from "../types";
import { TEST_CATEGORY_PATTERN } from "../utils/constants";
import { syncTestCategories } from "../utils/CategoryHide";

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
