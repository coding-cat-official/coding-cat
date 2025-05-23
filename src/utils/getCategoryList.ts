import problems from "../public-problems/problems";

// TODO: since mutation and haystack aren't considered categories,
// the array this function returns doesn't contain them. if the issue
// of the problem type/category nesting is resolved, this may not be a problem anymore.
export function getCategoryList() {
  const categories = new Set<string>();

  problems.forEach((p) => {
    categories.add(p.meta.category);
  });

  return Array.from(categories).sort();
}
