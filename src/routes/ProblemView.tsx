import React, { useEffect, useState, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { useLoaderData, useOutletContext } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import Markdown from 'markdown-to-jsx';

import { Problem, EvalResponse } from '../types';
import problems from '../problems/problems';
import useEval from '../hooks/useEval';

import Button from '@mui/joy/Button';
import Stack from '@mui/joy/Stack';
import Sheet from '@mui/joy/Sheet';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Table from '@mui/joy/Table';

// Emoji rendered in the report
const TEST_CASE_PASSED = '✅';
const TEST_CASE_FAILED = '❌';

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
    const [code, setCode] = useState(problem.starter);

    const { setActiveProblem } = useOutletContext<ProblemIDEOutletContext>();
    setActiveProblem(problem.meta.name);

    const [evalResponse, runCode] = useEval(problem);

    useEffect(() => { setCode(problem.starter); }, [problem]);

    function changeCode(e: string | undefined) {
      setCode(e ?? '')
    }

    return (
        <Sheet sx={{ m: 3, p: 2, height: "100%" }}>
            <Typography level="title-lg"> { problem.meta.title } </Typography>
            <Typography level="body-md">
                <Markdown children={problem.description} />
            </Typography>
            <Editor
                height="10em"
                className="problem-ide-editor"
                defaultLanguage="python"
                value={code}
                options={{ minimap: { enabled: false }}}
                onChange={changeCode} />
            <Button onClick={() => runCode(code)}>Run</Button>
            <Report evalResponse={evalResponse} />
        </Sheet>
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
      <Typography> {evalResponse.message} </Typography>
    </Stack>;
  if ('success' === evalResponse.status)
    return <Stack direction="column">
      <Typography> The results are in: </Typography>
      <Table>
        <thead>
        <tr>
          <th> Input </th>
          <th> Expected output </th>
          <th> Your output </th>
          <th> Passed? </th>
        </tr>
        </thead>
        <tbody>
        { evalResponse.report.map((r, i) => <tr key={i}>
                     <td> {r.input} </td>
                     <td> {r.expected} </td>
                     <td> {r.actual} </td>
                     <td> {r.equal ? TEST_CASE_PASSED : TEST_CASE_FAILED} </td>
                   </tr>)
        }
        </tbody>
      </Table>
    </Stack>;

  return <p> If this text appears, it's a bug :^) </p>;
};
