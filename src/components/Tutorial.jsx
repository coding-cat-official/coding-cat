
import { Button } from '@mui/joy';
import Tour from 'reactour'

export default function Tutorial({tourState, setTourState}){
  
  const steps = [
    {
      selector: '.input',
      content: 'First step',
      position:"top"
    },
    {
      selector: '.mutations',
      content: 'woah your mutations',
      position:"top"
    },
    {
      selector: '.solution-output',
      content: 'the REAL output is here',
      position:"top"
    },
    {
      selector: '.xp-output',
      content: 'expected output here',
      position:"top"
    }

  ];

  return(
    <>
      <Button onClick={()=>{setTourState(true)}}>?</Button>
      <Tour
        steps={steps}
        isOpen={tourState}
        onRequestClose={()=>{setTourState(false)}} 
        rounded={10}
      />
    </>
  )
}