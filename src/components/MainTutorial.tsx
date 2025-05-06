import { Box, Button, Card } from '@mui/joy';
import { ArrowCircleLeft, ArrowCircleRight} from '@phosphor-icons/react';
import { useState } from 'react';

const tutorialSteps = [
  {
    content: () => (
      <>
        <h1>Welcome to CODING CAT 😸</h1>
        <p>You will do all the exercises Eric will require of you this semester here</p>
        <h3>╮(╯▽╰)╭</h3>
      </>
    )
  },
  {
    content: () => (
      <>
        <h2>To navigate to exercises</h2>
        <p>Click on the bar on your left</p>
        <h3>👈(ﾟヮﾟ) </h3>
      </>
    )
  },
  {
    content: () => (
      <>
        <h2>Problem Types</h2>
        <p>Problems are categorized by type: coding, haystack, and mutation.</p>
        <p>Image of the different tabs</p>
      </>
    )
  },
  {
    content: () => (
      <>
        <h2>Coding</h2>
        <p>These are normal coding questions with a description.</p>
        <p>Image of a coding question</p>
      </>
    )
  },
  {
    content: () => (
      <>
        <h2>Coding</h2>
        <p>When you press "Run", your code will be run and compared to how the function is supposed to return.</p>
        <ul>
          <li><b>Input</b></li>
          <li>What is provided to your code</li>
          <li><b>Expected output</b></li>
          <li>What the function is supposed to return</li>
          <li><b>Output</b></li>
          <li>What your code returns when given the input</li>
        </ul>
        <p>Image Results table</p>
      </>
    )
  },
  {
    content: () => (
      <>
        <h2>Let's choose a problem! (๑•̀ㅂ•́)و✧</h2>
        <p>Explore and Have fun!</p>
      </>
    ),
  }
];

export default function MainTutorial(){

  const[step, setStep] = useState(0);

  const content = tutorialSteps[step];

  const nextStep = () => {
    if(step < tutorialSteps.length-1) setStep(step+1);
  }

  const previousStep = () => {
    if(step > 0) setStep(step-1);
  }

  return(
    <Box sx={{ height:"90%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
      <Card className="main-tutorial"> 
        {content.content()} 
        {step === tutorialSteps.length-1 ? <Button>Ok</Button> : <></>}
      </Card>
      <Box sx={{ display: "flex", justifyContent: "center"}} className="tutorial-icons">
        <Button onClick={previousStep}><ArrowCircleLeft size={50} /></Button>
        <Button onClick={nextStep}><ArrowCircleRight size={50}/></Button>
      </Box>
    </Box>
  )
}