import { useState, useEffect } from 'react';

import { Problem, EvalResponse } from '../types';

export type Eval = [EvalResponse | null, (code: string) => void];

export default function useEval(problem: Problem): Eval {
    const [evalResponse, setEvalResponse] = useState<EvalResponse | null>(null)

    const onEvalFinished: EventListener = (e) => {
        const response = (e as CustomEvent).detail;
        setEvalResponse(response);
        console.log(response);
    };

    useEffect(() => { setEvalResponse(null); }, [problem]);

    useEffect(() => {
        document.addEventListener('eval_finished', onEvalFinished);
        return () => {
            document.removeEventListener('eval_finished', onEvalFinished);
        };
    }, []);

    function runCode(code: string) {
      document.dispatchEvent(
          new CustomEvent(
              'eval', {
                  detail: {
                      code: code,
                      tests: problem.io,
                      name: problem.meta.name,
                  }
              },
          ),
      );
    }

    return [evalResponse, runCode];
}

