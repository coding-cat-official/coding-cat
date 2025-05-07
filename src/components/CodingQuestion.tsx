import {Button, Box} from '@mui/joy';
import ResizableEditor from './ResizableEditor';
import { useCallback, useEffect, useState } from 'react';
import { Problem } from '../types';

interface CodingProps {
  code: string;
  changeCode: (e: string | undefined) => void;
  problem: Problem;
  runCode: (code: string) => void;
  generateQuestion: () => void;
}

export default function CodingQuestion({code, changeCode, problem, runCode, generateQuestion}: CodingProps){
  const [fontSize, setFontSize] = useState(14);
  const [disabled, setDisabled] = useState(false);

  function increaseFontSize() {
    if (fontSize < 30) setFontSize(fontSize + 4);
  }
  
  function decreaseFontSize() {
    if (fontSize > 10) setFontSize(fontSize - 4); 
  }
  
    const handleKeyPress = useCallback((event:KeyboardEvent) => {
        if(event.altKey && event.key === "Enter"){
          runCode(code);
        }
      },[code, runCode]);
  
      useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
        return () => {
          document.removeEventListener('keydown', handleKeyPress);
        };
      }, [handleKeyPress]);

  return(
    <>
      <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end", gap: 1 }}>
        <Button onClick={decreaseFontSize}>A-</Button>
        <Button onClick={increaseFontSize}>A+</Button>
      </Box>

      <ResizableEditor code={code} fontSize={fontSize} changeCode={changeCode}/>

      <Box sx={{ display: "flex", width: "100%", gap: 1 }}>
        <Button sx={{ flex: 4 }} disabled={disabled} onClick={() => {
          runCode(code);
          generateQuestion();
          setDisabled(true);

          // disable the button for 2 seconds to prevent spamming it
          setTimeout(() => {
            setDisabled(false);
          }, 2000)
        }}>Run</Button>
        <Button
          sx={{ flex: 1 }}
          variant="outlined"
          onClick={() => changeCode(problem.starter)}
          disabled={code === problem.starter}
        >
          Reset
        </Button>
      </Box>
    </>
  );
}
