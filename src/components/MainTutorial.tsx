import { Box, Button, Card } from '@mui/joy';
import { useState } from 'react';

const tutorialSteps = [
  {
    content: () => (
      <>
        <h1>Welcome to CODING CAT 😸</h1>
        <p>yap yap</p>
      </>
    )
  },
  {
    content: () => (
      <p>Open the navigation bar here</p>
    )
  },
  {
    content: () => (
      <h2>Let's choose a problem!</h2>

    ),
  },
  {
    content: () => (
      <p>Profile</p>
    )
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
    <Box>
      <Card> {content.content()} </Card>
      <Button onClick={previousStep}>Back</Button>
      <Button onClick={nextStep}>Continue</Button>
    </Box>
  )
}