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
}

export type Submission = {
    problem_title: string;
    passed_tests: number;
    total_tests: number;
}
