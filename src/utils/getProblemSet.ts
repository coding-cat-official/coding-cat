import { Problem } from "../types";

/**
 * Returns the current problem set as defined by the `REACT_APP_PROBLEM_SET` environment variable.
 * If no variable is defined, it uses public-problems by default.
 */
export default async function getProblemSet(): Promise<Problem[]> {
  const problemSet = process.env.REACT_APP_PROBLEM_SET || "problems";
  return (await import(`../${problemSet}/problems`)).default;
}
