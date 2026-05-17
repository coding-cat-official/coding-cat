import { supabase } from "../supabaseClient";

/**
 * Fetches the test categories from the testcategories table in the db 
 * @returns A Map object containing the category name and its active state
 */
export async function fetchCategories() {
  const { data, error } = await supabase.from("testcategories").select("category, is_active");

  if (error) {
    console.error("Error fetching protected categories:", error);
    return;
  }

  return new Map<string, boolean>(
    (data ?? []).map((row: any) => [row.category as string, row.is_active as boolean]),
  );
}
