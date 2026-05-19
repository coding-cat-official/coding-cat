import { Problem } from "../types.js";

/**
 * Here you define the different types of questions
 */
const questionTypeList = ["private-problems", "public-problems"];

/**
 * Depending on the REACT_APP_PROBLEM_SET, it returns an ESM module import for the
 * selected problems. If `REACT_APP_PROBLEM_SET` is set to "both", it imports
 * both `private-problems` and `public-problems` concurrently and returns a
 * merged array when both exports are arrays, otherwise returns an object with
 * both sets keyed by their folder names.
 */
async function getProblemSet(): Promise<Problem[]> {
  const questionType = process.env.REACT_APP_PROBLEM_SET;

  //If env is set to both then it renders the both submodule problems
  if (questionType === "both") {
    const [privateSet, publicSet] = await Promise.all([
      await import("../private-problems/problems.js").then((m) => m.default),
      await import("../public-problems/problems.js").then((m) => m.default),
    ]);
      
    return [...privateSet, ...publicSet];
  }

  if (questionTypeList.includes(questionType!)) {
    return (await import(`../${questionType}/problems.js`)).default;
  } else {
    throw new Error("The env REACT_APP_PROBLEM_SET is incorrect or not set");
  }
}

export default getProblemSet;
