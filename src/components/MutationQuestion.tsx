import {Box, Button} from '@mui/joy';
import { useEffect, useState } from 'react';

export default function MutationQuestion({runCode, evalResponse, problem, code, setCode}: any){

  const [numOfTableRows, setNumRows] = useState(1);
  const maxNumberOfRows = 15;
  const numOfMutations = problem.mutations.length;
  const inputCount = problem.io[0].input.length;
  const outputCount = 1;

  //The inputRows are 2D arrays since each row is a test and each test contains 
  //an array of inputs
  const [inputRows, setInputRows] = useState<string[][]>(
    [ Array(inputCount).fill('') ]
  );
  
  const [expectedRows, setExpectedRows] = useState<string[]>(
    [ '' ]
  );

  useEffect(() => {
    setNumRows(1)
    setInputRows([ Array(inputCount).fill('') ])
    setExpectedRows([''])
  }, [inputCount, problem.meta.name])

  useEffect(() => {
    if (!code){
      setNumRows(1)
      setInputRows([ Array(inputCount).fill('') ])
      setExpectedRows([''])
      return;
    };
    
    const lines = code.split('\n').filter((line: string) => line.trim());
    const newInputs: string[][] = [];
    const newExpected: string[] = []

    for (let line of lines) {
      const [left = '', right= ''] = line.split(';');
      newInputs.push(left.split('|'));
      newExpected.push(right);
    }

    const finalInputs = newInputs.slice(0, maxNumberOfRows);
    const finalExpected = newExpected.slice(0, maxNumberOfRows);

    setInputRows(finalInputs);
    setExpectedRows(finalExpected);
    setNumRows(finalInputs.length || 1);
  }, [code, problem.meta.name])

  const handleNewRowClick = () => {
    if(numOfTableRows < maxNumberOfRows){
      setNumRows(numOfTableRows+1);
      setInputRows(rows => [...rows, Array(inputCount).fill('')]);
      setExpectedRows(rows => [...rows, '']);
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

  //Formatting the inputs and output so that the runCode is able to use them
  const handleRun = () => {
    const payload = inputRows
    .slice(0, numOfTableRows)
    .map((rowInputs, i) =>
      `${rowInputs.join('|')};${expectedRows[i]}`)
    .join('\n');
    setCode(payload);
    runCode(payload);
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
                  {inputRows[rowIndex].map((val, colIndex) => (
                    <input
                      key={colIndex}
                      style= {{marginRight: '3px'}}
                      value={val}
                      onChange={e => {
                        const copy = inputRows.map(r => [...r]);
                        copy[rowIndex][colIndex] = e.target.value;
                        setInputRows(copy);
                      }}
                    />
                  ))}
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
              <td>{row?.solution?.actual.toString() || ''} </td>
              <td>
                  <input
                    value={expectedRows[rowIndex]}
                    onChange={e => {
                      const copy = [...expectedRows];
                      copy[rowIndex] = e.target.value;
                      setExpectedRows(copy);
                    }}
                  />
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
      <Button onClick={handleRun}>Run</Button>

      <Box className="mutation-results">
        You have found {countPassedMutants()}/{numOfMutations} mutations.
      </Box>
    </>
  )
}
