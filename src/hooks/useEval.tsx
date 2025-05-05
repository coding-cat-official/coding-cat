import { useState, useEffect, useRef } from 'react';

import { Problem, EvalResponse } from '../types';

import type { Session } from '@supabase/supabase-js'
import { supabase } from '../supabaseClient';

export type Eval = [EvalResponse | null, (code: string) => void];

export default function useEval(problem: Problem, session: Session | null): Eval {
    const [evalResponse, setEvalResponse] = useState<EvalResponse | null>(null)
    const currentCodeRef = useRef<string>('');

    useEffect(() => { setEvalResponse(null); }, [problem]);

    useEffect(() => {
        const onEvalFinished: EventListener = async (e) => {
            const response = (e as CustomEvent).detail;
            setEvalResponse(response);
            console.log(response);
    
            if(response.status === 'success' && session?.user){
                let numPassed: number
                let totalTests: number
                if (problem.meta.question_type[0] === "mutation"){
                    totalTests = problem.mutations?.length ?? 0;
                    const mutationResults = new Map<number, Set<boolean>>()
                    for (const row of response.report as any[]){
                        if(!row.solution?.equal) continue;
                        row.mutations.forEach((mutation: any, index: number) => {
                            if(!mutationResults.has(index)) mutationResults.set(index, new Set())
                                mutationResults.get(index)!.add(mutation.equal)
                        })
                    }
                    numPassed = 0
                    mutationResults.forEach(outcomeSet => {
                        if (outcomeSet.has(true) && outcomeSet.has(false)){
                            numPassed ++;
                        }
                    })
                }
                else{
                    numPassed = response.report.filter((r: any) => r.equal).length;
                    totalTests = response.report.length;
                }
    
                const submission = {
                    problem_title: problem.meta.name,
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

        document.addEventListener('eval_finished', onEvalFinished);
        return () => {
            document.removeEventListener('eval_finished', onEvalFinished);
        };
    }, [problem, session]);

    function runCode(code: string) {
        currentCodeRef.current = code;
        const detail: any = {
            code,
            tests: problem.io,
            name: problem.meta.name,
            question_type: problem.meta.question_type[0],
        };
        if (problem.meta.question_type[0] === 'mutation') {
            if (problem.solution)  detail.solution  = problem.solution;
            if (problem.mutations) detail.mutations = problem.mutations;
        }

    document.dispatchEvent(new CustomEvent('eval', { detail }));
  }

  return [evalResponse, runCode];
}

