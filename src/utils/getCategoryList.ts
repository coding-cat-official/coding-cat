import problems from "../public-problems/problems";

export function getCategoryList() {
  const categories = new Set<string>();

  problems.forEach((p) => {
    categories.add(p.meta.category);
  });

  return Array.from(categories);
}
