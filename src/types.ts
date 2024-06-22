export interface IOPair {
    input: any[];
    output: any;
}

export interface Report {
  input: any[];
  expected: any;
  actual: any;
}

export interface Problem {
    description: string;
    starter: string;
    meta: {
        name: string;
        title: string;
        difficulty: number;
        author: string;
        category: string;
    };
    io: Array<IOPair>;
}
