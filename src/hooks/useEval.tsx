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
            const isMutation = problem.meta.question_type[0] === "mutation";
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

                const submissionPayload = isMutation
                    ? currentCodeRef.current
                    : { code: currentCodeRef.current }
    
                const submission = {
                    problem_title: problem.meta.name,
                    problem_category: problem.meta.category,
                    code: submissionPayload,
                    passed_tests: numPassed,
                    submitted_at: new Date().toISOString(),
                    profile_id: session.user.id,
                    total_tests: totalTests,
                    question_type: problem.meta.question_type[0]
                };
    
                const { data, error } = await supabase
                    .from('submissions')
                    .select("submission_id, code")
                    .eq('profile_id', session.user.id)
                    .eq('problem_title', problem.meta.name)
                    .order('submitted_at', { ascending: false})
                    .limit(1);

                console.error(error);

                const json = data?.[0] || null;

                // if the most recent submission is the exact same as the new one, don't insert a new one into the db
                if (json && JSON.stringify(json.code) === JSON.stringify(submissionPayload)) {
                    const { error } = await supabase
                        .from('submissions')
                        .update({ 'submitted_at': new Date().toISOString() })
                        .eq('submission_id', json.submission_id)
                    console.error(error);
                } else {
                    const { error } = await supabase.from('submissions').insert([submission]);
                    console.error(error);
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

