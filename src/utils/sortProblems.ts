import { Problem } from "../types";
import { getLevel0ProblemsOrdered } from "./getLevel0ProblemOrdered";

/**
 * Sorts the current list of problems by name, completed status, or difficulty.
 */
export default function sortProblems(problemList: Problem[], solvedProblems: string[], order: string, orderBy: string) {
  if(!problemList) return [];

  const problems = [...problemList];

  if(problems.some(p => p.meta.category === "Level 0")){
    return getLevel0ProblemsOrdered(problems);
  }
  
  if (orderBy === "name") {
    problems.sort((a, b) => {
      if (order === "asc") return sortByName(a, b);
      else return -sortByName(a, b);
    });
  }

  if (orderBy === "completed") {
    problems.sort((a, b) => {
      if (order === "asc") return sortByCompleted(a, b, solvedProblems);
      else return -sortByCompleted(a, b, solvedProblems);
    });
  }

  if (orderBy === "difficulty") {
    problems.sort((a, b) => {
      if (order === "asc") return sortByDifficulty(a, b);
      else return -sortByDifficulty(a, b);
    });
  }

  return problems;
}

function sortByCompleted(a: Problem, b: Problem, solvedProblems: string[]) {
  const aIsSolved = solvedProblems.includes(a.meta.name);
  const bIsSolved = solvedProblems.includes(b.meta.name);

  if (aIsSolved && !bIsSolved) return -1;
  if (!aIsSolved && bIsSolved) return 1;

  return 0;
}

function sortByName(a: Problem, b: Problem) {
  const nameA = a.meta.title.toLowerCase();
  const nameB = b.meta.title.toLowerCase();

  if (nameA < nameB) return -1;
  if (nameA > nameB) return 1;

  return 0;
}

function sortByDifficulty(a: Problem, b: Problem) {
  const difficultyA = mapDifficulty(a.meta.difficulty);
  const difficultyB = mapDifficulty(b.meta.difficulty);

  return difficultyA - difficultyB;
}

function mapDifficulty(diff: string) {
  let num = -1;

  if (diff === "easy") num = 0; 
  if (diff === "medium") num = 1; 
  if (diff === "hard") num = 2;
  
  return num;
}
