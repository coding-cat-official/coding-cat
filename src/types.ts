import { getCategoryList } from "./utils/getCategoryList";

export interface IOPair {
    input: any[];
    output: any;
}

export interface Report {
  input: string;
  expected: string;
  actual: string;
  equal: boolean;
}

export type EvalResponse
    = { status: 'success'; report: Report[] }
    | { status: 'failure'; message: string }

export interface Problem {
    description: string;
    starter?: string;
    meta: {
        name: string;
        title: string;
        difficulty: string;
        author: string;
        category: string;
        question_type: Array<string>;
    };
    io: Array<IOPair>;
    mutations?: Array<string>;
    solution?: string;
}

export type Progress = {
    category: string;
    completed: number;
    total: number;
    problems: {
        title: string;
        difficulty: string;
    }[];
}

export type Reflection = {
    category: string;
    problem_title: string;
    code: string;
    reflection: string | {
        question: string;
        answer: string;
    };
    submitted_at: Date;
}

export type Submission = {
    problem_title: string;
    passed_tests: number;
    total_tests: number;
}

export interface GenericContract {
    gradeWanted: string;
    problemsToSolve: number;
    codeDescription: string;
    reflectionPlan: string;
}

export interface CodingContract {
    gradeWanted: string;
    problemsToSolveByCategory: Record<string, number>;
    codeDescription: string;
    reflectionPlan: string;
}

export type ContractData ={
    Coding: CodingContract;
    Haystack: GenericContract;
    Mutation: GenericContract;
}

const codingCategories = getCategoryList();

export const BLANK_CONTRACT: ContractData = {
    "Coding":{
        gradeWanted: "",
        problemsToSolveByCategory: codingCategories.reduce(
          (acc, cat) => ({ ...acc, [cat]: 0 }),
          {}
        ),
        codeDescription: "",
        reflectionPlan: "",
      },
    "Mutation":  { gradeWanted: "", problemsToSolve: 0, codeDescription: '', reflectionPlan: '' },
    "Haystack":  { gradeWanted: "", problemsToSolve: 0, codeDescription: '', reflectionPlan: '' }
}