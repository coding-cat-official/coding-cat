import React, { useEffect, useState, ChangeEvent } from 'react';
import { useLoaderData } from 'react-router-dom';
import Editor from '@monaco-editor/react';

import { EvalResponse, Problem } from '../types';

import './ProblemIDE.css';

export interface ProblemIDEProps {
    problem: Problem
}

export default function ProblemIDE({ problem }: ProblemIDEProps) {
    const [name, setName] = useState(problem.meta.name);
    const [code, setCode] = useState(problem.starter);

    const [evalResponse, setEvalResponse] = useState<EvalResponse | null>(null);

    // TODO think about how to store the user's edits to problems
    useEffect(() => {
      setCode(problem.starter);
      setEvalResponse(null);
    }, [problem]);

    useEffect(() => {
        document.addEventListener(
            "eval_finished",
            (e) => {
                const response = (e as CustomEvent).detail;
                setEvalResponse(response);
                console.log(response);
            },
        );
    }, []);

    function runCode() {
      document.dispatchEvent(
          new CustomEvent(
              "eval", {
                  detail: {
                      code: code,
                      tests: problem.io,
                      name: problem.meta.name,
                  }
              },
          ),
      );
    }

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
            <button className="problem-ide-run" onClick={runCode}>Run</button>
            {
                evalResponse === null ? '' :
                evalResponse.status === 'failure' ? <p>
                  Uh-oh... There was a problem with your submission: {evalResponse.message}
                </p> :
                evalResponse.status === 'success' ?
                <table>
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
                               <td> {String(r.input)} </td>
                               <td> {String(r.expected)} </td>
                               <td> {String(r.actual)} </td>
                               <td> {r.equal ? '😊' : '😞'} </td>
                             </tr>)
                  }
                  </tbody>
                </table> : "if this text appears, it's a bug :^)"
            }
        </div>
    );
}
