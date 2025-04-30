import {Box, Button} from '@mui/joy';
import { useState } from 'react';

export default function MutationQuestion({runCode, inputs, setInput, evalResponse, problem}: any){

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
          actual: "2, 2",
          equal: false
        }
      },
      {
        expected: "2,6",
        input: "2,6",
        mutations: [
          { index: 0, actual: "<error: TypeError>", equal: false },
          { index: 1, actual: "<error: TypeError>", equal: false },
          { index: 2, actual: "<error: TypeError>", equal: false },
          { index: 3, actual: "<error: TypeError>", equal: false }
        ],
        solution: {
          actual: "3, 3",
          equal: false
        }
      }
    ]
  };

  const [numOfTableRows, setNumRows] = useState(hardCodedPassFail.report.length);
  const maxNumberOfRows = 15;
  const numOfMutationFiles = [1, 2, 3, 4];
  const inputCount = (problem.io[0].input).toString().includes("[[") ? 1: problem.io[0].input.length;
  const outputCount = 1;
  console.log('AWAWWAWAW', (problem.io[0].input).includes("[["));
  console.log('RRRRMIMIJIMI', problem.io[0].output);
  

  const handleNewRowClick = () => {
    if(numOfTableRows < maxNumberOfRows){
      setNumRows(numOfTableRows+1);
    }
  };

  const countPassedMutants = () => {
    const mutantResults = new Map<number, Set<boolean>>();

    hardCodedPassFail.report.forEach(row => {
      row.mutations.forEach((mutation, index) => {
        if (!mutantResults.has(index)) {
          mutantResults.set(index, new Set());
        }
        mutantResults.get(index)!.add(mutation.equal);
      });
    });

    let count = 0;
    mutantResults.forEach(resultSet => {
      if (resultSet.has(true) && resultSet.has(false)) {
        count++;
      }
    });

    return count;
  };

  return(
    <> 
      <table className='mutation-table'>
        <thead>
          <tr>
            <th>N°</th>
            <th>Input</th>
            {numOfMutationFiles.map((_, index:any) => {
              return(
                <th key={index}>M{index+1}</th>
              )
            })
            }
            <th>Solution's Output</th>
            <th>Expected Output</th>
          </tr>
        </thead>
        <tbody>
        { Array.from({length:numOfTableRows}).map((_, rowIndex) => {
          const row = hardCodedPassFail.report[rowIndex];
          const mutations = row?.mutations ?? Array(numOfMutationFiles.length).fill(null);

          return(
            <tr key={rowIndex}>
              <td>{rowIndex+1}</td>
              <td>
              {
                (() => {
                  return Array.from({length:inputCount}).map((_, index) => (
                    <input key={index}/>
                  ));
                })()
              }
              </td>
              {mutations.map((passOrFail:any, index:number) => (
                <td key={index}>
                  {passOrFail
                    ? passOrFail.equal
                      ? '✅'
                      : '❌'
                    : ''}
                </td>
              ))}
              <td>{row?.solution?.actual || ''} </td>
              <td>
                {
                  (() => {
                    return Array.from({length:outputCount}).map((_, index) => (
                      <input key={index}/>
                    ));
                  })()
                }
              </td>
            </tr>
            )
          }
        )}
          <tr>
            <td colSpan={4+numOfMutationFiles.length}>
              <Button sx={{width:"100%"}} onClick={handleNewRowClick} className='add-mutation-button'>➕</Button>
            </td>
          </tr>
        </tbody>
      </table>
      <Button onClick={() => runCode(inputs)}>Run</Button>

      <Box className="mutation-results">
        You have found {countPassedMutants()}/{numOfMutationFiles.length} mutations.
      </Box>
    </>
  )
}
