
import Tour from 'reactour'
import { Question } from '@phosphor-icons/react'
import { Button } from '@mui/joy';

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
      content: 'Write your inputs here',
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
          <table style={{border: "1px solid black", borderCollapse: "collapse"}}>
            <tr><td style={{border: "1px solid black", padding: "10px"}}><b>M1</b></td></tr>
            <tr><td style={{border: "1px solid black", padding: "10px"}}><b>✅</b></td></tr>
            <tr><td style={{border: "1px solid black", padding: "10px"}}><b>❌</b></td></tr>
          </table>
        </>
      ),
      position:"top"
    },
    {
      selector: '.outputs',
      content: () => (
        <>
          <h3>Make sure that the <u>solution's ouput</u> is the same as the <u>expected output</u></h3>
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
    },
    {
      selector: '.add-mutation-button',
      content: () => (
        <>
          <h3>Click here if you ever run out of rows 🙀</h3>
        </>
      )
    },
    {
      selector: '.mutation-results',
      content: () => (
        <h4>This is your progress!👈(ﾟヮﾟ👈)</h4>
      )
    },
    {
      selector: "table",
      content: () => (
        <>
          <h2>Quick Tip ❕</h2>
          <h3>Press "Alt" + "Enter" to run your code <i>fast</i> 🏃💨</h3>
        </>
      )
    }

  ];

  return(
    <>
      <Question size={40} weight="fill" style={{cursor:'pointer', color:'#ffb564', minWidth:'50px'}} onClick={()=>{setTourState(true)}}>?</Question>
      <Tour
        steps={steps}
        isOpen={tourState}
        onRequestClose={()=>{setTourState(false)}} 
        rounded={10}
      />
    </>
  )
}