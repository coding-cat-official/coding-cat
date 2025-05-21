import {Box, Button, LinearProgress, Stack, Typography} from '@mui/joy';
import { useCallback, useEffect, useState } from 'react';
import {  getColumnStatuses, countPassedMutants } from '../utils/mapMutantResults';

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
  
  const [expectedOutputRows, setExpectedOutputRows] = useState<string[]>(
    Array(5).fill('')
  );

  const hasEmptyExpected = expectedOutputRows
    .slice(0, numOfTableRows)
    .some(row => row === "")
    

  useEffect(() => {
    setAttemptedRun(false);
    setNumRows(5)
    setInputRows(Array.from({ length: 5 }, () => Array(inputCount).fill('')))
    setExpectedOutputRows(Array(5).fill(''))
  }, [inputCount, problem.meta.name])

  useEffect(() => {
    if (!Array.isArray(code) || code.length === 0) {
      setNumRows(5);
      setInputRows(Array.from({ length: 5 }, () => Array(inputCount).fill('')));
      setExpectedOutputRows(Array(5).fill(''));
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
  
    setExpectedOutputRows(
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
  
  function handleNewRow(){
    if(numOfTableRows < maxNumberOfRows){
      setNumRows(numOfTableRows+1);
      setInputRows(rows => [...rows, Array(inputCount).fill('')]);
      setExpectedOutputRows(rows => [...rows, '']);
    }
  };

  function handleRemoveRow(){
    if(numOfTableRows > 1 && (expectedOutputRows[expectedOutputRows.length-1] === "" || inputRows[inputRows.length - 1]?.every(cell => cell === ''))){
      setNumRows(numOfTableRows-1);
      setInputRows(rows => rows.slice(0, -1));
      setExpectedOutputRows(rows => rows.slice(0, -1));
    }
  }

  const columnStatuses = getColumnStatuses(evalResponse ?? numOfMutations);

  const handleRun = () => {
    setAttemptedRun(true);
    if(hasEmptyInputs || hasEmptyExpected) return;
    const payload = inputRows
      .slice(0, numOfTableRows)
      .map((rowInputs, i) => ({
        Input:    [...rowInputs],       
        Expected: expectedOutputRows[i],      
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
      <LinearProgress className="mutation-progressBar" determinate value={countPassedMutants(evalResponse)/numOfMutations*100} size="lg" thickness={30}>
        <Typography level="title-sm" sx={{ fontWeight: 'xl', color:"black", zIndex: "5" }}>
          You have found {countPassedMutants(evalResponse)}/{numOfMutations} mutations.
        </Typography>
      </LinearProgress>
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
                    <textarea
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
              {mutations.map((passOrFail:any, index:number) => {
                const status = columnStatuses?.get(index);
                const statusClass =
                  status === "pass" ? "col-pass" :
                  status === "fail" ? "col-fail" :
                  "";

                return (
                  <td key={index} className={statusClass}>
                    {passOrFail
                      ? passOrFail.equal
                        ? '✅'
                        : '❌'
                      : ''}
                  </td>
                );
              })}
              <td style={{ textAlign: 'center' }}>
                {row?.solution?.equal != null
                  ? row.solution.equal
                    ? '✅'
                    : (typeof(row.solution.actual) == "string" ? row.solution.actual : '❌')
                  : ''}
              </td>
              <td>
                  <textarea
                    value={expectedOutputRows[rowIndex]}
                    style={{ border: attemptedRun && expectedOutputRows[rowIndex].trim() === '' ? '1px solid red' : undefined,}}
                    onChange={e => {
                      const copy = [...expectedOutputRows];
                      copy[rowIndex] = e.target.value;
                      setExpectedOutputRows(copy);
                    }}
                  />
                </td>
            </tr>
            )
          }
        )}
        </tbody>
      </table>
      <Box sx={{display: "flex", flexDirection: "row", gap: "10px"}} className="add-rm-mutation-button">
        <Button sx={{width:"100%"}} onClick={handleNewRow} className='add-mutation-button'>+</Button>
        <Button sx={{width:"100%"}} onClick={handleRemoveRow} className='add-mutation-button'>-</Button>
      </Box>
      {attemptedRun && (hasEmptyInputs || hasEmptyExpected) && (
        <Box sx={{ color: 'danger.plainColor', mb: 1 }}>
          Please fill in all input and expected boxes before running.
        </Box>
      )}
      
      <Button disabled={disabled} onClick={handleRun}>
        <Stack direction="column" spacing={0} alignItems="center">
          <Typography level="body-md" fontFamily="inherit">Run</Typography>
          <Typography level="body-sm" fontStyle="italic" fontFamily="inherit">
            Alt + Enter
          </Typography>
        </Stack>
      </Button>

      

    </>
  )
}
