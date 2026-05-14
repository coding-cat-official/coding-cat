import { supabase } from "../supabaseClient";

// Sync test categories on startup
export async function syncTestCategories(category: string | string[], isActive: boolean) {
  const categories = Array.isArray(category) ? category : [category];

  const { error } = await supabase.from("testcategories").upsert(
    categories.map((cat) => ({ category: cat, is_active: isActive })),
    { onConflict: "category", ignoreDuplicates: true },
  );

  if (error) {
    throw new Error(error.message);
  }
}
