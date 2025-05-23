import problems from "../public-problems/problems";
import { Progress, Submission } from "../types";

interface CompletedByCategory {
  problems: {
    title: string;
    difficulty: string;
  }[];
}

/**
 * Returns an array of objects containing each category and what problems were completed in it.
 */
export function getCompletedProblems(submissions: Submission[]): Progress[] {
  const totalByCategory: Record<string, number> = {};
  const questionTypeByCategory: Record<string, string> = {};
  const completedByCategory: Record<string, CompletedByCategory> = {};
  const completedTitles = new Set<string>();

  for(const p of problems) {
    const question_type = p.meta.question_type[0];
    const category = question_type === "coding" ? p.meta.category : question_type;

    totalByCategory[category] = (totalByCategory[category] || 0) +1;
    questionTypeByCategory[category] = question_type
  }

  for (const s of submissions || []) {
    if (s.passed_tests === s.total_tests) {
      completedTitles.add(s.problem_title);
    }
  }

  for (const p of problems) {
    const question_type = p.meta.question_type[0];
    const category = question_type === "coding" ? p.meta.category : question_type;
    
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
    problems: (completedByCategory[category] || {problems: []}).problems,
    question_type: questionTypeByCategory[category]
  }));

  return summary
}
