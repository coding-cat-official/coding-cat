import problems from "../public-problems/problems";
import { Progress, Submission } from "../types";

interface CompletedByCategory {
  problems: {
    title: string;
    difficulty: string;
  }[];
}

export function getCompletedProblems(submissions: Submission[]): Progress[] {
  const totalByCategory: Record<string, number> = {};
  const completedByCategory: Record<string, CompletedByCategory> = {};
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
    
    completedTitles.forEach((ct) => {
      if (ct === p.meta.name) {
        if (!completedByCategory[category]) {
          completedByCategory[category] = {
            problems: []
          }
        }

        completedByCategory[category].problems.push({
          title: p.meta.name,
          difficulty: p.meta.difficulty
        })
      }
    });
  }

  const summary = Object.keys(totalByCategory).map(category => ({
    category: category,
    completed: (completedByCategory[category] || {problems: []}).problems.length,
    total: totalByCategory[category],
    problems: (completedByCategory[category] || {problems: []}).problems
  }));

  return summary
}
