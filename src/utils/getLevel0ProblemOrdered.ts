import { Problem } from "../types";

/**
 * Gets a list of assumed Level 0 problems in numerical order
 * Will put any unnumbered categories at the end
 */
export function getLevel0ProblemsOrdered(problems: Problem[]): Problem[] {
  const numberedProbs = problems
    .filter(p => /^\d/.test(p.meta.title))
    .sort((a, b) => {
      const numA = parseInt(a.meta.title.match(/^(\d+)/)?.[1] ?? '0', 10);
      const numB = parseInt(b.meta.title.match(/^(\d+)/)?.[1] ?? '0', 10);
      return numA - numB;
    });

  const unnumberedProbs = problems.filter(p => !/^\d/.test(p.meta.title));

  return [...numberedProbs, ...unnumberedProbs];
}