import {Box, Button} from '@mui/joy';
import { useState } from 'react';

export default function MutationQuestion(){

  const [numOfTableRows, setNumRows] = useState(1);
  const maxNumberOfRows = 15;
  const teehee = [1, 2, 3, 4, 5];

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
            <th>Input</th>
            {teehee.map((mutant:any, index:any) => {
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
            <td>
            <input type="text" id="p1" name="p1"/>
            ,
            <input type="text" id="p2" name="p2"/>
            </td>
            {teehee.map((mutant:any, index:any) => {
              return(
                <td>👻</td>
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
        You have found 1/4 mutations.
      </Box>
    </>
  )
}