import React, { useEffect, useState, ChangeEvent, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLoaderData, useOutletContext } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import Markdown from 'markdown-to-jsx';

import { Problem, EvalResponse } from '../types';
import problems from '../public-problems/problems';
import useEval from '../hooks/useEval';
import usePersistentProblemCode from '../hooks/usePersistentProblemCode';

import Button from '@mui/joy/Button';
import Stack from '@mui/joy/Stack';
import Sheet from '@mui/joy/Sheet';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Table from '@mui/joy/Table';

import type { Session } from '@supabase/supabase-js'
import { supabase } from '../supabaseClient';
import ResizableEditor from '../components/ResizableEditor';

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
    setActiveProblem(problem.meta.name);

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
        .limit(1)
        .single();

        if (error) {
          console.warn('Could not load latest submission: ', error.message);
          return;
        }
        
        if (data?.code){
          setCode(data.code);
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
      if (fontSize !== 30) setFontSize(fontSize + 4);
    }

    function decreaseFontSize() {
      if (fontSize !== 10) setFontSize(fontSize - 4);
    }

    return (
      <Stack sx={{ width: "80%",p: 1, display:"flex"}} className="problem-container" direction="row" spacing={2} alignItems="flex-start">
        <Stack sx={{ flex: 4, width: "100%", display: "flex"}} direction="column" spacing={2} alignItems="center">
          <Sheet sx={{ border: 1, borderRadius: 3, m: 3, p: 2, display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
            <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography level="title-lg">{problem.meta.title}</Typography>
              <Typography level="body-md">
                <Markdown>
                  {problem.description}
                </Markdown>
              </Typography>
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
    return <Box sx={{ border: 1, borderRadius: 3 }} >
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
