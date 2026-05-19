import { Problem } from "../types.js";

/**
 * Here you define the different types of questions
 */
const questionTypeList = ["private-problems", "public-problems"];

/**
 * Depending on the REACT_APP_PROBLEM_SET, it returns an ESM module import for the
 * selected problems. If `REACT_APP_PROBLEM_SET` is set to "both", it imports
 * both `private-problems` and `public-problems` concurrently and returns a
 * merged array
 */
async function getProblemSet(): Promise<Problem[]> {
  const questionType = process.env.REACT_APP_PROBLEM_SET;

  //If env is set to both then it renders the both submodule problems
  if (questionType === "both") {
    const [privateSet, publicSet] = await Promise.all([
      loadProblems("../private-problems/problems.js"),
      loadProblems("../public-problems/problems.js"),
    ]);

    return [...privateSet, ...publicSet];
  }

  if (questionTypeList.includes(questionType!)) {
    return (await import(`../${questionType}/problems.js`)).default;
  } else {
    throw new Error("The env REACT_APP_PROBLEM_SET is incorrect or not set");
  }
}

// Wrapper to handle when one or all of the imports fail when loading both imports
async function loadProblems(path: string): Promise<Problem[]> {
  try {
    return (await import(path)).default;
  } catch {
    return [];
  }
}

export default getProblemSet;
