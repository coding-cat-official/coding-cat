import React, { useEffect, useState, useRef } from 'react';
import { useLoaderData, useOutletContext } from 'react-router-dom';
import Markdown from 'markdown-to-jsx';

import { Problem, EvalResponse } from '../types';
import problems from '../public-problems/problems';
import useEval from '../hooks/useEval';
import usePersistentProblemCode from '../hooks/usePersistentProblemCode';

import {Button, Stack, Sheet, Box, Typography, Table} from '@mui/joy';
import ResizableEditor from '../components/ResizableEditor';

import type { Session } from '@supabase/supabase-js'
import { supabase } from '../supabaseClient';

// Emoji rendered in the report
const TEST_CASE_PASSED = '✅';
const TEST_CASE_FAILED = '❌';
const ALL_TESTS_PASSED = '🎉';

const PASS_COLOR = '#caffc5';
const FAIL_COLOR = '#f4cbca';

export async function problemLoader({params}: any): Promise<Problem> {
    const selected = (problems as Problem[]).filter((p) => p.meta.name === params.problemName);
    if (selected.length !== 1) throw new Error('fuck');
    return selected[0];
}

export default function ProblemView() {
    const problem = useLoaderData() as Problem;
    return <>
        <ProblemIDE problem={problem} />
    </>;
}

interface ProblemIDEProps {
    problem: Problem
}

interface ProblemIDEOutletContext {
    setActiveProblem: (name: string | null) => void;
}

function ProblemIDE({ problem }: ProblemIDEProps) {
    const [code, setCode] = usePersistentProblemCode(problem);
    const [fontSize, setFontSize] = useState(14);

    const { session } = useOutletContext<{ session: Session | null }>();
    const { setActiveProblem } = useOutletContext<ProblemIDEOutletContext>();

    useEffect(() => {
      setActiveProblem(problem.meta.name);
    }, [setActiveProblem, problem.meta.name]);

    const [evalResponse, runCode] = useEval(problem, session);
    
    const hasFetchedProblems = useRef<Set<string>>(new Set());

    useEffect(() => {
      async function fetchLatestSubmission() {
        if (!session?.user) return;
        if (hasFetchedProblems.current.has(problem.meta.name)) return;

        const { data, error } = await supabase
        .from('submissions')
        .select('code')
        .eq('profile_id', session.user.id)
        .eq('problem_title', problem.meta.title)
        .order('submitted_at', { ascending: false})
        .limit(1);

        const json = data?.[0] || null;

        if (error) {
          console.warn('Could not load latest submission: ', error.message);
          return;
        }
        
        if (json){
          setCode(json.code);
        } else {
          setCode(problem.starter);
        }
        hasFetchedProblems.current.add(problem.meta.name);
      }

      fetchLatestSubmission();

    }, [problem.meta.name, problem.meta.title, problem.starter, session, setCode]);

    function changeCode(e: string | undefined) {
      setCode(e ?? '')
    }

    function increaseFontSize() {
      if (fontSize < 30) setFontSize(fontSize + 4);
    }

    function decreaseFontSize() {
      if (fontSize > 10) setFontSize(fontSize - 4);
    }

    return (
      <Stack sx={{ width: "100%", height: "100%", p: 3 }} className="problem-container" direction="row" spacing={2} alignItems="flex-start" justifyContent="center">
        <Stack sx={{ flex: 4, width: "100%", height: "100%", display: "flex"}} direction="column" spacing={2} alignItems="center">
          <Sheet sx={{ border: 2, borderRadius: 10, p: 2, display: "flex", flexDirection: "column", gap: 2, width: "99%", height:"100%", overflowY: "auto" }} className="hello">
            <Box sx={{ width: "100%",  flexDirection: "column", gap: 1 }}>
              <Typography level="title-lg">{problem.meta.title}</Typography>
              <Markdown>
                {problem.description}
              </Markdown>
            </Box>
      
            <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end", gap: 1 }}>
              <Button onClick={decreaseFontSize}>A-</Button>
              <Button onClick={increaseFontSize}>A+</Button>
            </Box>
      
            <ResizableEditor code={code} fontSize={fontSize} changeCode={changeCode}/>
      
            <Box sx={{ display: "flex", width: "100%", gap: 1 }}>
              <Button sx={{ flex: 4 }} onClick={() => runCode(code)}>Run</Button>
              <Button
                sx={{ flex: 1 }}
                variant="outlined"
                onClick={() => changeCode(problem.starter)}
                disabled={code === problem.starter}
              >
                Reset
              </Button>
            </Box>
          </Sheet>
        </Stack>
      
        <Box sx={{ flex: 2, display: "flex", alignItems: "flex-start" }} className="results-container">
          {evalResponse ? <Report evalResponse={evalResponse} /> : <Box></Box>}
        </Box>
      </Stack>
    
    );
}

interface ReportProps {
  evalResponse: EvalResponse | null;
}

const Report: React.FC<ReportProps> = ({ evalResponse }: ReportProps) => {
  if (null === evalResponse) return null;
  if ('failure' === evalResponse.status)
    return <Stack direction="column">
      <Typography> Uh-oh... There was a problem with your submission. </Typography>
      <Typography sx={{ whiteSpace: 'pre-wrap'}}> {evalResponse.message} </Typography>
    </Stack>;
  if ('success' === evalResponse.status)
    return <Box sx={{ border: 1, borderRadius: 3}} >
      <Stack direction="column">
        <Typography sx={{ p: 2, borderBottom: 1 }} level="h4"> Results </Typography>
        <Table>
          <thead>
          <tr>
            <th> Input </th>
            <th> Expected output </th>
            <th> Your output </th>
          </tr>
          </thead>
          <tbody>
          { evalResponse.report.map((r, i) =>
              <tr key={i} style={{ backgroundColor: r.equal ? PASS_COLOR : FAIL_COLOR }}>
                <td className="mono"> {r.input} </td>
                <td className="mono"> {r.expected} </td>
                <td className="mono"> {r.actual} </td>
              </tr>)
          }
          </tbody>
        </Table>
        { evalResponse.report.reduce((acc, r) => r.equal && acc, true)
          ? <Box style={{ textAlign: "center" }} sx={{ borderTop: 1 }} >
              <Typography sx={{ p: 2 }} level='body-lg'>
                Bravo {ALL_TESTS_PASSED} You completed this problem!
              </Typography>
            </Box>
          : null }
      </Stack>
    </Box>;

  return <p> If this text appears, it&apos;s a bug :^) </p>;
};
