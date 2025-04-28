import {Box, Table} from '@mui/joy';

export default function MutationQuestion(){



  return(
    <> 
      <table className='mutation-table'>
        <thead>
          <tr>
            <th>Input</th>
            <th>M1</th>
            <th>M2</th>
            <th>M3</th>
            <th>M4</th>
            <th>Output</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
            <input type="text" width="20px" id="p1" name="p1"/>
            ,
            <input type="text" width="20px" id="p2" name="p2"/>
            </td>
            <td>✅</td>
            <td>❌</td>
            <td>✅</td>
            <td>✅</td>
            <td>
              hallooo
            </td>
          </tr>
        </tbody>
      </table>

      <Box className="mutation-results">
        You have found 1/4 mutations.
      </Box>
    </>
  )
}