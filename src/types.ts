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
    starter: string;
    meta: {
        name: string;
        title: string;
        difficulty: string;
        author: string;
        category: string;
    };
    io: Array<IOPair>;
}

export type Progress = {
    category:string;
    completed:number;
    total:number ;
}
