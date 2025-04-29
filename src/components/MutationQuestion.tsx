import {Box, Button} from '@mui/joy';
import { useState } from 'react';

export default function MutationQuestion({runCode, inputs, setInput, evalResponse}: any){

  const hardCodedPassFail = {
    status: "success",
    report: [
      {
        expected: "2,4",
        input: "1,2,4",
        mutations: [
          { index: 0, actual: "<error: TypeError>", equal: false },
          { index: 1, actual: "<error: TypeError>", equal: true },
          { index: 2, actual: "<error: TypeError>", equal: false },
          { index: 3, actual: "<error: TypeError>", equal: false }
        ],
        solution: {
          actual: "<error: TypeError>",
          equal: false
        }
      },
      {
        expected: "2,6",
        input: "2,6",
        mutations: [
          { index: 0, actual: "<error: TypeError>", equal: false },
          { index: 1, actual: "<error: TypeError>", equal: false },
          { index: 2, actual: "<error: TypeError>", equal: true },
          { index: 3, actual: "<error: TypeError>", equal: false }
        ],
        solution: {
          actual: "<error: TypeError>",
          equal: false
        }
      }
    ]
  };

  const [numOfTableRows, setNumRows] = useState(hardCodedPassFail.report.length);
  const maxNumberOfRows = 15;
  const numOfMutationFiles = [1, 2, 3, 4];
  

  const handleNewRowClick = () => {
    if(numOfTableRows < maxNumberOfRows){
      setNumRows(numOfTableRows+1);
    }
  };


  return(
    <> 
      <table className='mutation-table'>
        <thead>
          <tr>
            <th>N°</th>
            <th>Input</th>
            {numOfMutationFiles.map((mutant:any, index:any) => {
              return(
                <th key={mutant}>M{index+1}</th>
              )
            })
            }
            <th>Solution's Output</th>
            <th>Expected Output</th>
          </tr>
        </thead>
        <tbody>
        { Array.from({length:numOfTableRows}).map((_, rowIndex) =>
          <tr key={rowIndex}>
            <td>{rowIndex+1}</td>
            <td>
              <input type="text" id="p1" name="p1"/>
              ,
              <input type="text" id="p2" name="p2"/>
            </td>
            {(hardCodedPassFail.report[rowIndex].mutations !== null
              ? hardCodedPassFail.report[rowIndex].mutations
              : Array(5).fill(null)
            ).map((passOrFail:any, index:number) => {
              return(
                <td key={index}>
                  {passOrFail
                    ? passOrFail.equal
                      ? '✅'
                      : '❌'
                    : ''}
                </td>
              )
            })}
            <td>{hardCodedPassFail.report[rowIndex].solution.actual} </td>
            <td>
              <input></input>
              <input></input>
            </td>
          </tr>
        )}
        </tbody>
      </table>
      <Button onClick={() => runCode(inputs)}>Run</Button>
      <Button onClick={handleNewRowClick} className='add-mutation-button'>➕</Button>

      <Box className="mutation-results">
        You have found 1/{numOfMutationFiles.length} mutations.
      </Box>
    </>
  )
}
