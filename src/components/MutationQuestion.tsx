import {Box, Button} from '@mui/joy';
import { useState } from 'react';

export default function MutationQuestion(){

  const [numOfTableRows, setNumRows] = useState(1);
  const [tableValues, setTableValues] = useState([]);
  const teehee = [1, 2, 3, 4, 5];

  const handleNewRowClick = () => {
    if(numOfTableRows < 15){
      setNumRows(numOfTableRows+1);

    }
  };


  return(
    <> 
      <InitialTable mutations={teehee}/>
      <Button onClick={handleNewRowClick} className='add-mutation-button'>➕</Button>

      <Box className="mutation-results">
        You have found 1/4 mutations.
      </Box>
    </>
  )
}

function InitialTable({mutations, inputs}: any){
  return(
    <table className='mutation-table'>
        <thead>
          <tr>
            <th>Input</th>
            {mutations.map((mutant:any, index:any) => {
              return(
                <th key={mutant}>M{index+1}</th>
              )
            })
            }
            <th>Output</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
            <input type="text" id="p1" name="p1"/>
            ,
            <input type="text" id="p2" name="p2"/>
            </td>
            {mutations.map((mutant:any, index:any) => {
              return(
                <td>👻</td>
              )
            })}
            <td>
              hallooo
            </td>
          </tr>
        </tbody>
      </table>
  );
}