
import { Button } from '@mui/joy';
import Tour from 'reactour'

export default function Tutorial({tourState, setTourState}){
  
  const steps = [
    {
      selector: 'table',
      content: () => (
        <>
          <h2>Mutations? 🤔</h2>
          <p>Your goal is to find out how a function could go wrong by visualizing the function and trying out different inputs.</p>
        </>
      ),
      position: "top",
      stepInteraction: false
    },
    {
      selector: '.input',
      content: 'How can you',
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
    },
    {
      selector: '.input-box',
      content: () => (
        <>
          <h3>❕Note</h3>
          <p>Make sure to add <b>""</b> when it's a string and <b>[]</b> when it's an array</p>
          <h4>["calico", "void"]</h4>
        </>
      ),
      position: 'top'
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