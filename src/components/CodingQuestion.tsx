import {Button, Box, Stack, Typography} from '@mui/joy';
import ResizableEditor from './ResizableEditor';
import { useState } from 'react';
import { Problem } from '../types';

interface CodingProps {
  code: string;
  changeCode: (e: string | undefined) => void;
  problem: Problem;
  runCode: (code: string) => void;
}

export default function CodingQuestion({ code, changeCode, problem, runCode }: CodingProps){
  const [fontSize, setFontSize] = useState(14);
  const [disabled, setDisabled] = useState(false);

  function increaseFontSize() {
    if (fontSize < 30) setFontSize(fontSize + 4);
  }
  
  function decreaseFontSize() {
    if (fontSize > 10) setFontSize(fontSize - 4); 
  }

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
          setDisabled(true);

          // disable the button for 2 seconds to prevent spamming it
          setTimeout(() => {
            setDisabled(false);
          }, 2000)
        }}>
          <Stack direction="column" spacing={0} alignItems="center">
            <Typography level="body-md" fontFamily="inherit">Run</Typography>
            <Typography level="body-sm" fontStyle="italic" fontFamily="inherit">
              Alt + Enter
            </Typography>
          </Stack>
        </Button>
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
