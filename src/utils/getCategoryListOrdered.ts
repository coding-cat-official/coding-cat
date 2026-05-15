/**
 * Gets the categories in logical completion order
 * Will put any categories unaccounted for at the end
 * This function also does not include haystack or mutation
 */
export function getCategoryListOrdered(categories: string[]): string[] {
  const knownCategories: string[] = [
    "Level 0",
    "Fundamentals",
    "Logic",
    "String-1",
    "String-2",
    "String-3",
    "List-1: Indexing",
    "List-2: Iterating",
    "List-3: Complex Loop"
  ]
  
  var otherCategories: string[] = [];
  categories.map((c) => {
    if(!knownCategories.includes(c)){
      otherCategories.push(c);
    }
  });
  
  return [
    "Level 0",
    "Fundamentals",
    "Logic",
    "String-1",
    "List-1: Indexing",
    "String-2",
    "List-2: Iterating",
    "String-3",
    "List-3: Complex Loop",
    ...otherCategories
  ]
}