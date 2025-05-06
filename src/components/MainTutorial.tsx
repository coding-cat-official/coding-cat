import { Box, Button, Card } from '@mui/joy';
import { useEffect, useState } from 'react';

const tutorialSteps = [
  {
    selector: '',
    content: () => (
      <>
        <h1>Welcome to CODING CAT 😸</h1>
        <p>yap yap</p>
      </>
    )
  },
  {
    selector: '.desktop-bar',
    content: 'Open the navigation bar here',
  },
  {
    selector: '.MuiBox-root.problems-navbar',
    content: () => (
      <h2>Let's choose a problem!</h2>

    ),
    observe: '.problems-navbar'
  },
  {
    content: 'Profile'
  }
];

export default function MainTutorial(){

  const[step, setStep] = useState(0);
  const [isOpen, setOpen] = useState(true);

  const nextStep = () => {
    if(step < tutorialSteps.length-1) setStep(step+1);
  }

  const previousStep = () => {
    if(step > 0) setStep(step-1);
  }

  return(
    <Box>
      <Card>rrrmmimimimim</Card>
      <Button onClick={() => {setStep(step-1)}}>Back</Button>
      <Button onClick={nextStep}>Continue</Button>
    </Box>
  )
}