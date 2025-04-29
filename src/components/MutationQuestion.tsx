import {Box, Button} from '@mui/joy';
import { useState } from 'react';

export default function MutationQuestion({json}: any){

  const [numOfTableRows, setNumRows] = useState(1);
  const maxNumberOfRows = 15;
  const numOfMutationFiles = [1, 2, 3, 4, 5];

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
            {numOfMutationFiles.map((mutant:any, index:any) => {
              return(
                <td key={index}>👻</td>
              )
            })}
            <td>hallooo</td>
            <td>hiii</td>
          </tr>
        )}
        </tbody>
      </table>
      <Button onClick={handleNewRowClick} className='add-mutation-button'>➕</Button>

      <Box className="mutation-results">
        You have found 1/{numOfMutationFiles.length} mutations.
      </Box>
    </>
  )
}