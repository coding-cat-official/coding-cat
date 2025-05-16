import { Problem } from "../types";

export default async function getProblemSet(): Promise<Problem[]> {
  const problemSet = process.env.REACT_APP_PROBLEM_SET || "public-problems";
  return (await import(`../${problemSet}/problems`)).default;
}
