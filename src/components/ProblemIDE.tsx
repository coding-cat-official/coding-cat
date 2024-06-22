import React, { useEffect, useState, ChangeEvent } from 'react';
import { useLoaderData } from 'react-router-dom';

import { Report, Problem } from '../types';
import problems from '../problems/problems';

export interface ProblemIDEProps {
    problem: Problem
}

export default function ProblemIDE({ problem }: ProblemIDEProps) {
  const [code, setCode] = useState(problem.starter);
  const [report, setReport] = useState<Report[] | null>(null);

  useEffect(() => {
      document.addEventListener(
        "report_ready",
        (e) => {
          const report = (e as CustomEvent).detail;
          console.log(report);
          setReport(report)
        },
      );
  }, []);

  function runCode() {
    console.log(problem.io)
    const e = new CustomEvent(
        "eval", {
            detail: {
                code: code,
                tests: problem.io,
                name: problem.meta.name,
            }
        },
    );
    document.dispatchEvent(e);
  }

  function changeCode(e: ChangeEvent<HTMLTextAreaElement>) {
    setCode(e.target.value ?? '')
  }

  return (
    <>
      <textarea value={code} onChange={changeCode}></textarea>
      <button onClick={runCode}>Run</button>
      {
        report != null
          ? <>
          <p> report is back! here it is </p>
          <table>
            <thead>
            <tr>
              <th> Input </th>
              <th> Expected output </th>
              <th> Your output </th>
            </tr>
            </thead>
            <tbody>
            { report.map((r, i) => <tr key={i}>
                         <td> {String(r.input)} </td>
                         <td> {String(r.expected)} </td>
                         <td> {String(r.actual)} </td>
                       </tr>)
            }
            </tbody>
          </table>
          </>
          : ""
      }
    </>
  );
}
