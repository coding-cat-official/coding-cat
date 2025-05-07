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
        <h2>To navigate to exercises 📚</h2>
        <p>Click on the bar on your left</p>
        <h3>👈(ﾟヮﾟ) </h3>
      </>
    )
  },
  {
    content: () => (
      <>
        <h2>Problem Types 📃</h2>
        <span>Problems are categorized by type:</span>
        <p><b>Coding, haystack, and mutation</b></p>
        <p>[Image of the different tabs]</p>
      </>
    )
  },
  {
    content: () => (
      <>
        <h2>Coding 💻</h2>
        <p>Read the description, write a function, and make sure to return a value.</p>
        <p>[Image of a coding question]</p>
      </>
    )
  },
  {
    content: () => (
      <>
        <h2>Coding 💻</h2>
        <p>When you press "Run", your code will be executed and its output will be compared to the expected output.</p>
        <ul>
          <li><b>Input:</b> The data provided to your function.</li>
          <li><b>Expected output:</b> The correct result your function should return</li>
          <li><b>Output:</b> What your function really returns with the input</li>
        </ul>
        <p>[Image Results table]</p>
      </>
    )
  },
  {
    content: () => (
      <>
        <h2>Haystack 🐴</h2>
        <p>It's a coding question disguised in jargon~</p>
        <span>Find the important info 🔍</span>
        <p>[Image of a haystack question]</p>
      </>
    )
  },
  {
    content: () => (
      <>
        <h2>Mutation Testing 🧟</h2>
        <p>You will learn more about this later in the course...</p>
        <span>but essentially, it involves making small changes to catch mutations</span>
        <p>[Image of a mutation question]</p>
      </>
    )
  },
  {
    content: () => (
      <>
        <h2>Quick Tip ❕</h2>
        <h3>Press "Alt" + "Enter" to Run your code <i>fast</i> 🏃💨</h3>
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
      </Card>
      <Box sx={{ display: "flex", justifyContent: "center"}} className="tutorial-icons">
        <Button onClick={previousStep} disabled={step===0}><ArrowCircleLeft size={50} /></Button>
        <Button onClick={nextStep} disabled={step===tutorialSteps.length-1}><ArrowCircleRight size={50}/></Button>
      </Box>
    </Box>
  )
}