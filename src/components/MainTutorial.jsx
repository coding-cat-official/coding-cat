import {Tour} from 'reactour';
import { Box } from '@mui/joy';

export default function MainTutorial(){

  const steps = [
    {
      selector: '',
      content: 'WELCOME TO CODING CAT'
    }
  ];

  return(
    <Box>
      <Tour
        steps={steps} 
        isOpen={false} 
      />
      <h1>WELCOME TO CODING CAT</h1>
    </Box>
  )
}