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

export interface ProblemMeta {
    name: string;
    title: string;
    difficulty: string;
    author: string;
    category: string;
    question_type: Array<'coding' | 'mutation'>;
}

interface BaseProblem{
    description: string;
    meta: ProblemMeta;
    io: IOPair[];
}

export interface CodingProblem extends BaseProblem{
    meta: { question_type: ['coding']; } & Omit<ProblemMeta, 'question_type'>;
    starter: string; 
}

export interface MutationProblem extends BaseProblem{
    meta: {question_type: ['mutation']; } & Omit<ProblemMeta, 'question_type'>;
    solution: string;
    mutation: string[];
}

export type Progress = {
    category: string;
    completed: number;
    total: number;
}
