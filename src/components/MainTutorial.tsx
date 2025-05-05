import {Tour} from '@reactour/tour';
import { Box } from '@mui/joy';
import { SetStateAction, useState } from 'react';

export default function MainTutorial(){

  const [isOpen, setOpen] = useState(true);

  const steps = [
    {
      selector: '',
      content: 'WELCOME TO CODING CAT'
    }
  ];

  return(
    <Box>
      <Tour
        steps={steps} 
        setIsOpen={setOpen} 
        setCurrentStep={function (value: SetStateAction<number>): void {
          throw new Error('Function not implemented.');
        } } 
        currentStep={0} 
        isOpen={false} 
        disabledActions={false} 
        setDisabledActions={function (value: SetStateAction<boolean>): void {
          throw new Error('Function not implemented.');
        } }/>
      <h1>WELCOME TO CODING CAT</h1>
    </Box>
  )
}