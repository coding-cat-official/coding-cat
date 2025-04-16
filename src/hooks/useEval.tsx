import { useState, useEffect, useRef } from 'react';

import { Problem, EvalResponse } from '../types';

import type { Session } from '@supabase/supabase-js'
import { supabase } from '../supabaseClient';

export type Eval = [EvalResponse | null, (code: string) => void];

export default function useEval(problem: Problem, session: Session | null): Eval {
    const [evalResponse, setEvalResponse] = useState<EvalResponse | null>(null)
    const currentCodeRef = useRef<string>('');

    const onEvalFinished: EventListener = async (e) => {
        const response = (e as CustomEvent).detail;
        setEvalResponse(response);
        console.log(response);

        if(response.status === 'success' && session?.user){
            const numPassed = response.report.filter((r: any) => r.equal).length;
            const totalTests = response.report.length;

            const submission = {
                problem_title: problem.meta.title,
                problem_category: problem.meta.category,
                code: currentCodeRef.current,
                passed_tests: numPassed,
                submitted_at: new Date().toISOString(),
                profile_id: session.user.id,
                total_tests: totalTests,
            };

            const { error } = await supabase.from('submissions').insert([submission]);

            if (error) {
                console.error('Error saving submission: ' , error.message);
                alert(error.message)
            }
        }
    };

    useEffect(() => { setEvalResponse(null); }, [problem]);

    useEffect(() => {
        document.addEventListener('eval_finished', onEvalFinished);
        return () => {
            document.removeEventListener('eval_finished', onEvalFinished);
        };
    }, []);

    function runCode(code: string) {
        currentCodeRef.current = code;
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

