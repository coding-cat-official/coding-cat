import React, { useEffect, useState, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { useLoaderData } from 'react-router-dom';
import Editor from '@monaco-editor/react';

import { Problem, EvalResponse } from '../types';
import problems from '../problems/problems';
import useEval from '../hooks/useEval';

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

function ProblemIDE({ problem }: ProblemIDEProps) {
    const [name, setName] = useState(problem.meta.name);
    const [code, setCode] = useState(problem.starter);

    const [evalResponse, runCode] = useEval(problem);

    useEffect(() => { setCode(problem.starter); }, [problem]);

    function changeCode(e: string | undefined) {
      setCode(e ?? '')
    }

    return (
        <div className="problem-ide">
            <h3 className="problem-ide-title"> { problem.meta.title } </h3>
            <p className="problem-ide-description"> { problem.description } </p>
            <Editor
                height="30%"
                className="problem-ide-editor"
                defaultLanguage="python"
                value={code}
                options={{ minimap: { enabled: false }}}
                onChange={changeCode} />
            <button className="problem-ide-run" onClick={() => runCode(code)}>Run</button>
            <Report evalResponse={evalResponse} />
        </div>
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
