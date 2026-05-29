/**
 * Gets the categories in logical completion order
 * Will put any categories unaccounted for at the end
 * This function also does not include haystack or mutation
 */
export function getCategoryListOrdered(categories: string[]): string[] {
  const orderedCategories: string[] = [
    "Level 0",
    "Fundamentals",
    "Logic",
    "String-1",
    "List-1: Indexing",
    "String-2",
    "List-2: Iterating",
    "Level-3: Complex Problems"
  ];

  const knownSet = new Set(orderedCategories);
  const otherCategories = categories.filter((c) => !knownSet.has(c));

  return [...orderedCategories, ...otherCategories];
}