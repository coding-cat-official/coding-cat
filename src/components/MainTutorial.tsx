import { Box, Button, Card } from '@mui/joy';
import { ArrowCircleLeft, ArrowCircleRight} from '@phosphor-icons/react';
import { useState } from 'react';
import { welcomePageTutorial } from '../utils/tutorials';


export default function MainTutorial(){

  const[step, setStep] = useState(0);

  const content = welcomePageTutorial[step];

  const nextStep = () => {
    if(step < welcomePageTutorial.length-1) setStep(step+1);
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
        <Button onClick={nextStep} disabled={step===welcomePageTutorial.length-1}><ArrowCircleRight size={50}/></Button>
      </Box>
    </Box>
  )
}