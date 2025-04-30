import {Box, Button} from '@mui/joy';
import { useState } from 'react';

export default function MutationQuestion({runCode, inputs, setInput, evalResponse, problem}: any){

  const [numOfTableRows, setNumRows] = useState(1);
  const maxNumberOfRows = 15;
  const numOfMutations = problem.mutations.length;
  const inputCount = problem.io[0].input.length;
  const outputCount = 1;
  

  const handleNewRowClick = () => {
    if(numOfTableRows < maxNumberOfRows){
      setNumRows(numOfTableRows+1);
    }
  };

  const countPassedMutants = () => {
    const mutantResults = new Map<number, Set<boolean>>();

    if(evalResponse == null) return 0

    evalResponse?.report?.forEach((row:any) => {
      row.mutations.forEach((mutation:any, index:number) => {
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
            {Array.from({length:numOfMutations}).map((_, index:any) => {
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
          const row = evalResponse?.report[rowIndex] ?? null;
          const mutations = row?.mutations ?? Array(numOfMutations).fill(null);

          return(
            <tr key={rowIndex}>
              <td>{rowIndex+1}</td>
              <td>
              {
                (() => {
                  return Array.from({length:inputCount}).map((_, index) => (
                    <>
                      <input key={index}/>
                      ,
                    </>
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
            <td colSpan={4+numOfMutations}>
              <Button sx={{width:"100%"}} onClick={handleNewRowClick} className='add-mutation-button'>➕</Button>
            </td>
          </tr>
        </tbody>
      </table>
      <Button onClick={() => runCode(inputs)}>Run</Button>

      <Box className="mutation-results">
        You have found {countPassedMutants()}/{numOfMutations} mutations.
      </Box>
    </>
  )
}
