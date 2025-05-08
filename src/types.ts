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

export interface CategoryContract {
    gradeWanted: number;
    problemsToSolve: number;
    codeDescription: string;
    reflectionPlan: string;
}

export type ContractData = Record<string, CategoryContract>