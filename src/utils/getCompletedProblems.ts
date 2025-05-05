import problems from "../public-problems/problems";
import { Submission } from "../types";

export function getCompletedProblems(submissions: Submission[]) {
  const totalByCategory: Record<string, number> = {};
  const completedByCategory: Record<string, number> = {};
  const completedTitles = new Set<string>();

  for(const p of problems) {
    const category = p.meta.category;
    totalByCategory[category] = (totalByCategory[category] || 0) +1;
  }

  for (const s of submissions || []) {
    if (s.passed_tests === s.total_tests) {
      completedTitles.add(s.problem_title);
    }
  }

  for (const p of problems) {
    const category = p.meta.category;
    if (completedTitles.has(p.meta.name)) {
      completedByCategory[category] = (completedByCategory[category] || 0) + 1;
    }
  }

  const summary = Object.keys(totalByCategory).map(category => ({
    category: category,
    completed: completedByCategory[category] || 0,
    total: totalByCategory[category]
  }));

  return summary
}
