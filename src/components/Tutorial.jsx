
import { Button } from '@mui/joy';
import Tour from 'reactour'

export default function Tutorial({tourState, setTourState}){
  
  const steps = [
    {
      selector: 'table',
      content: 'Your goal is to find the inputs that correspond to t',
      position: "top",
      stepInteraction: false
    },
    {
      selector: '.input',
      content: 'Following the description above, you need to visualize your function',
      position: "top",
    },
    {
      selector: '.mutations',
      content: () => (
        <>
          <h3>WOAH MUTATIONS!</h3>
          <p>These will either show ✅ or ❌ if you found a mutant or not.</p>
        </>
      ),
      position:"top"
    },
    {
      selector: '.mutations-th',
      content: () => (
        <>
          <h3>To score points...</h3>
          <p>One mutation needs to have a ✅ <b>AND</b> ❌.</p>
        </>
      ),
      position:"top"
    },
    {
      selector: '.solution-output',
      content: () => (
        <h3>Make sure that the solution's ouput is the same</h3>
      ),
      position:"top"
    },
    {
      selector: '.xp-output',
      content: () => (
        <>
          <h3>as the expected output</h3>
          <p>to gain points 📈🗿</p>
        </>
      ),
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