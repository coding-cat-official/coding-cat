import { Box, Button, Card } from '@mui/joy';
import { ArrowCircleLeft, ArrowCircleRight} from '@phosphor-icons/react';
import { useCallback, useEffect, useState } from 'react';
import { welcomePageTutorial } from '../utils/tutorials';


export default function MainTutorial(){
  const[step, setStep] = useState(0);

  const nextStep = useCallback(() => {
    if(step < welcomePageTutorial.length - 1) setStep(step + 1);
  }, [step]);

  const previousStep = useCallback(() => {
    if(step > 0) setStep(step - 1);
  }, [step]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if(event.key === "ArrowLeft"){
      event.preventDefault();
      previousStep();
    }

    if(event.key === "ArrowRight"){
      event.preventDefault();
      nextStep();
    }
  }, [previousStep, nextStep]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  const content = welcomePageTutorial[step];

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