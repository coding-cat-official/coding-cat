import {Box, Button} from '@mui/joy';
import { useCallback, useEffect, useState } from 'react';

export default function MutationQuestion({runCode, evalResponse, problem, code, setCode, generateQuestion}: any) {

  const [numOfTableRows, setNumRows] = useState(5);
  const [disabled, setDisabled] = useState(false);

  const maxNumberOfRows = 15;
  const numOfMutations = problem.mutations.length;
  const inputCount = problem.io[0].input.length;

  const [attemptedRun, setAttemptedRun] = useState(false);

  //The inputRows are 2D arrays since each row is a test and each test contains 
  //an array of inputs
  const [inputRows, setInputRows] = useState<string[][]>(
    Array.from({ length: 5 }, () => Array(inputCount).fill(''))
  );

  const hasEmptyInputs = inputRows
    .slice(0, numOfTableRows)
    .some(row => row.some(val => val.trim() === ""))
  
  const [expectedRows, setExpectedRows] = useState<string[]>(
    Array(5).fill('')
  );

  const hasEmptyExpected = expectedRows
    .slice(0, numOfTableRows)
    .some(row => row === "")
    
  console.log('exp', expectedRows)

  useEffect(() => {
    setAttemptedRun(false);
    setNumRows(5)
    setInputRows(Array.from({ length: 5 }, () => Array(inputCount).fill('')))
    setExpectedRows(Array(5).fill(''))
  }, [inputCount, problem.meta.name])

  useEffect(() => {
    if (!Array.isArray(code) || code.length === 0) {
      setNumRows(5);
      setInputRows(Array.from({ length: 5 }, () => Array(inputCount).fill('')));
      setExpectedRows(Array(5).fill(''));
      return;
    }
  
    const rows = code.slice(0, maxNumberOfRows);
    setNumRows(rows.length);
  
    setInputRows(
      rows.map(r => {
        if (Array.isArray((r as any).Input)) {
          return (r as any).Input as string[];
        }
  
        if (Array.isArray((r as any).input)) {
          return (r as any).input.map((x: any) =>
            typeof x === 'string' ? x : JSON.stringify(x)
          );
        }
  
        return Array(inputCount).fill('');
      })
    );
  
    setExpectedRows(
      rows.map(r => {
        if (typeof (r as any).Expected === 'string') {
          return (r as any).Expected;
        }
  
        if (Array.isArray((r as any).expected)) {
          return JSON.stringify((r as any).expected);
        }
  
        return '';
      })
    );
  }, [code, problem.meta.name]);
  
  const handleNewRowClick = () => {
    if(numOfTableRows < maxNumberOfRows){
      setNumRows(numOfTableRows+1);
      setInputRows(rows => [...rows, Array(inputCount).fill('')]);
      setExpectedRows(rows => [...rows, '']);
    }
  };


  // The progress bar for mutations
  const countPassedMutants = () => {
    const mutantResults = new Map<number, Set<boolean>>();

    if(evalResponse == null || evalResponse.report[0].mutations == null) return 0

    evalResponse?.report?.forEach((row:any, rowNum:number) => {

      if(row.solution.equal){
        row.mutations.forEach((mutation:any, index:number) => {
          if (!mutantResults.has(index)) {
            mutantResults.set(index, new Set());
          }
          mutantResults.get(index)!.add(mutation.equal);  
        });
      }
    });

    let count = 0;
    mutantResults.forEach((resultSet, index) => {
      if (resultSet.has(true) && resultSet.has(false)) {
        count++;
      }
    });
    return count;
  };

  const handleRun = () => {
    setAttemptedRun(true);
    if(hasEmptyInputs || hasEmptyExpected) return;
    const payload = inputRows
      .slice(0, numOfTableRows)
      .map((rowInputs, i) => ({
        Input:    [...rowInputs],       
        Expected: expectedRows[i],      
      }));
    setCode(payload);        
    runCode(payload);        

    generateQuestion();

    setDisabled(true);
    
    // disable the button for 2 seconds to prevent spamming it
    setTimeout(() => {
      setDisabled(false);
    }, 2000)
  };

  const handleKeyPress = useCallback((event:KeyboardEvent) => {
    if(event.altKey && event.key === "Enter"){
      handleRun();
    }
  },[handleRun]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return(
    <> 
      <table className='mutation-table'>
        <colgroup>
          <col span={1}/>
          <col span={1} className="input" />
          <col span={1} className='mutations' />
          <col span={numOfMutations-1} className="mutations-th" />
          <col span={2} className="outputs" />
        </colgroup>
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
              <td className='input-box'>
                  {inputRows[rowIndex].map((val, colIndex) => (
                    <input
                      key={colIndex}
                      style= {{
                        marginRight: '3px',
                        border: attemptedRun && val.trim() === '' ? '1px solid red' : undefined,
                      }}
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
              <td style={{ textAlign: 'center' }}>
                {row?.solution?.equal != null
                  ? row.solution.equal
                    ? '✅'
                    : '❌'
                  : ''}
              </td>
              <td>
                  <input
                    value={expectedRows[rowIndex]}
                    style={{ border: attemptedRun && expectedRows[rowIndex].trim() === '' ? '1px solid red' : undefined,}}
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
        </tbody>
      </table>
      <Button sx={{width:"100%"}} onClick={handleNewRowClick} className='add-mutation-button'>➕</Button>
      {attemptedRun && (hasEmptyInputs || hasEmptyExpected) && (
        <Box sx={{ color: 'danger.plainColor', mb: 1 }}>
          Please fill in all input and expected boxes before running.
        </Box>
      )}
      <Button disabled={disabled} onClick={handleRun}>Run</Button>

      <Box className="mutation-results">
        You have found {countPassedMutants()}/{numOfMutations} mutations.
      </Box>
    </>
  )
}
