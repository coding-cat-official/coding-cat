import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useLoaderData, useNavigate, useOutletContext } from 'react-router-dom';
import Markdown from 'markdown-to-jsx';

import { Problem, EvalResponse, EvalResult } from '../types';
import useEval from '../hooks/useEval';
import usePersistentProblemCode from '../hooks/usePersistentProblemCode';

import { Stack, Sheet, Box, Typography, Table, Button } from '@mui/joy';

import type { Session } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';

import ReflectionInput from '../components/ReflectionInput';
import CodingQuestion from '../components/CodingQuestion';
import MutationQuestion from '../components/MutationQuestion';
import { reflectionQuestions } from '../utils/questions';
import Tutorial from '../components/MutationTutorial';
import cursedCat from '../assets/cUrSed.png';
import errorCat from '../assets/error-cat.png';
import SolutionCode from '../components/SolutionCode';
import { getColumnStatuses } from '../utils/mapMutantResults';
import getProblemSet from '../utils/getProblemSet';
import useProblemTimer from '../hooks/useProblemTimer';

// Emoji rendered in the report
const ALL_TESTS_PASSED = '🎉';

const PASS_COLOR = '#caffc5';
const FAIL_COLOR = '#f4cbca';

export async function problemLoader({params}: any): Promise<Problem> {
  const problems = await getProblemSet();
  const selected = (problems as Problem[]).filter((p) => p.meta.name === params.problemName);
  if (selected.length !== 1) throw new Error('fuck');
  return selected[0];
}

export default function ProblemView() {
  const problem = useLoaderData() as Problem;
  return (
    <>
      <ProblemIDE key={problem.meta.name} problem={problem} />
    </>
  );
}

interface ProblemIDEProps {
  problem: Problem
}

function ProblemIDE({ problem }: ProblemIDEProps) {
  const [code, setCode] = usePersistentProblemCode(problem);
  const [hidePrompt, setHidePrompt] = useState(true);
  const [question, setQuestion] = useState("");
  const reflectionInput = useRef<HTMLElement>(null);
  const [isTourOpen, setTourOpen] = useState(false);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [problemAlertStage, setProblemAlertStage] = useState<null | 'twoThirds'>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [hideExerciseTimer, setHideExerciseTimer] = useState(false);
  const latestProblemNameRef = useRef(problem.meta.name);

  const { 
    session, 
    setActiveProblem, 
    refetchProgress,
    sessionDuration,
    plannedExerciseCount,
    problemSessionStats,
    setProblemSessionStats,
    progress,
    sessionTimerRunning
    } = useOutletContext<{
    session: Session | null,
    setActiveProblem: (name: string | null) => void,
    refetchProgress: () => void,
    activeSession: boolean,
    sessionTimerRunning: boolean,
    sessionId: string | null,
    sessionRemainingSeconds: number,
    sessionDuration: number,
    plannedExerciseCount: number,
    problemSessionStats: Record<string, {
      elapsedTimeSeconds: number;
      completed: boolean;
      passedTests: number;
      totalTests: number;
    }>,
    setProblemSessionStats: React.Dispatch<React.SetStateAction<Record<string, {
      elapsedTimeSeconds: number;
      completed: boolean;
      passedTests: number;
      totalTests: number;
    }>>>,
    progress: { problem_title: string; passed_tests: number; total_tests: number }[]
  }>();

  const {
    elapsed: problemElapsedSeconds,
    completed: isCompleted,
    stop: stopTimer,
  } = useProblemTimer({
    problemName: problem.meta.name,
    activeSession: sessionTimerRunning,
    problemSessionStats,
    setProblemSessionStats,
    progress,
  });
    
  const navigate = useNavigate();

  latestProblemNameRef.current = problem.meta.name;

  useEffect(() => {
    (async () => {
      setProblems(await getProblemSet());
    })();
  }, []);

  const currCategoryProblems = () => {
    const questionType = problem.meta.question_type[0];
    if(questionType.includes("mutation") || questionType.includes("haystack")){
      return problems.filter(p => p.meta.question_type.includes(questionType))
    }
    else{
      return problems.filter(p => {
        const questionType = p.meta.question_type[0];
        const exclude = questionType.includes("mutation") || questionType.includes("haystack");
        return p.meta.category === problem.meta.category && !exclude;
      })
    }
  };

  const currProblems = currCategoryProblems();
  const [currIndex, setCurrIndex] = useState(currProblems.findIndex(p => p.meta.name === problem.meta.name));


  useEffect(() => {
    setActiveProblem(problem.meta.name);
    setCurrIndex(currProblems.findIndex(p => p.meta.name === problem.meta.name))
  }, [setActiveProblem, problem.meta.name, currProblems]);

  const [evalResponse, runCode] = useEval(problem, session, refetchProgress);

  useEffect(() => {
    if (!evalResponse || evalResponse?.status !== "success") return;
    if (latestProblemNameRef.current !== problem.meta.name) return; 

    const passedTests = evalResponse.report.filter((r) => r.equal).length;
    const totalTests = evalResponse.report.length;
    const allPassed = passedTests === totalTests;

    if (allPassed && !isCompleted) {
      stopTimer({ passedTests, totalTests });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evalResponse, isCompleted, problem.meta.name]);


  // Function for defining what reflection questions to show to user depending on success status of user code
  useEffect(() => {
    if(!evalResponse || evalResponse?.status === "failure") {
      setHidePrompt(true);
      return;
    }
    if (evalResponse.status === "success") {
      if(onlyPrintTestFail(evalResponse.report)){
        setHidePrompt(true);
        return;
      }
      setHidePrompt(false);

      const allPassed = evalResponse.report.every((r) => r.equal);
      // if allPassed, give success questions
      // if not, give fail questions
      const questionList = allPassed
        ? reflectionQuestions.success
        : reflectionQuestions.fail;

      const rand = Math.floor(Math.random() * questionList.length);
      const question = questionList[rand];

      setQuestion(question);

      setTimeout(() => {
        reflectionInput.current?.scrollIntoView({ behavior: "smooth" });
      }, 100)
    }
  }, [evalResponse]);

  const hasFetchedProblems = useRef<Set<string>>(new Set());

  useEffect(() => {
    async function fetchLatestSubmission() {
      if (!session?.user) return;
      if (hasFetchedProblems.current.has(problem.meta.name)) return;

      // If localStorage already has code for the problem we don't overwrite it
      const localCode = localStorage.getItem(problem.meta.name);
      if (localCode) {
        hasFetchedProblems.current.add(problem.meta.name);
        return;
      }

      const { data, error } = await supabase
        .from('submissions')
        .select('code')
        .eq('profile_id', session.user.id)
        .eq('problem_title', problem.meta.name)
        .order('submitted_at', { ascending: false })
        .limit(1);

      const json = data?.[0] || null;

      if (error) {
        console.warn('Could not load latest submission: ', error.message);
        return;
      }

      if (json) {
        if (problem.meta.question_type[0] === 'mutation') {
          setCode(json.code);
        } else {
          const stored = json.code;
          setCode(
            typeof stored === 'object' && stored !== null && 'code' in stored
              ? (stored as any).code
              : (stored as string)
          );
        }
      } else {
        if (['coding', 'haystack'].includes(problem.meta.question_type[0])) {
          setCode(problem.starter || '');
        }
        else {
          setCode('');
        }
      }
      hasFetchedProblems.current.add(problem.meta.name);
    }
    fetchLatestSubmission();

  }, [problem.meta.name, problem.meta.question_type, problem.starter, session, setCode]);

 
  // Alert user if taking too long on a problem
  useEffect(() => {
    if (!sessionTimerRunning || plannedExerciseCount <= 0 || sessionDuration <= 0) return;

    const sessionSeconds = sessionDuration * 60;
    const perProblemTarget = Math.max(1, Math.floor(sessionSeconds / Math.max(1, plannedExerciseCount)));

    if (problemElapsedSeconds >= perProblemTarget * (2/3) && problemAlertStage !== 'twoThirds') {
      setProblemAlertStage('twoThirds');
      setHideExerciseTimer(false);
      setAlertMessage(`You've been on this problem for a while 🐱 Consider using your tools, asking for hints or moving on!`);
    }
  }, [problemElapsedSeconds, plannedExerciseCount, sessionDuration, sessionTimerRunning, problemAlertStage]);

  useEffect(() => {
    setAlertMessage(null);
    setProblemAlertStage(null);
  }, [problem.meta.name]);

  function changeCode(e: string | undefined) {
    setCode(e ?? '');
  }

  const handlePreviousProblem = useCallback(() => {
    if(currIndex > 0){
      const prevProblem = currProblems[currIndex - 1].meta.name;
      setCurrIndex(currIndex - 1);
      navigate(`/problems/${prevProblem}`);
    }
  }, [currIndex, currProblems, navigate]);

  const handleNextProblem = useCallback(() => { 
    if(currIndex < currProblems.length - 1){
      const nextProblem = currProblems[currIndex + 1].meta.name;
      setCurrIndex(currIndex + 1);
      navigate(`/problems/${nextProblem}`);
    }
  }, [currIndex, currProblems, navigate]);

  const handleKeyPress = useCallback((event:KeyboardEvent) => {
    if(event.altKey && event.key === "Enter"){
      runCode(code);
    }

    if(event.altKey && event.key === "ArrowLeft"){
      event.preventDefault();
      handlePreviousProblem();
    }

    if(event.altKey && event.key === "ArrowRight"){
      event.preventDefault();
      handleNextProblem();
    }
  }, [code, runCode, handlePreviousProblem, handleNextProblem]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  let author = problem.meta.author;
  if (author.toLowerCase() === "chatgpt") author = "";

  const statuses = evalResponse?.status === 'success'
    ? getColumnStatuses(evalResponse)
    : undefined;

  return (
    <Stack sx={{ width: "100%", p: 3 }} className="problem-container" direction="row" spacing={2}  justifyContent="center">
      <Stack sx={{ flex: 4, width: "100%", height: "100%", display: "flex"}} direction="column" spacing={2} alignItems="center">
        <Box className="navigate-problem-box">
          <Button disabled={currIndex === 0} onClick={handlePreviousProblem}>
            <Stack direction="column" spacing={0} alignItems="center">
              <Typography level="body-md" fontFamily="inherit">Prev</Typography>
              <Typography level="body-sm" fontStyle="italic" fontFamily="inherit">
                (Alt + ←)
              </Typography>
              <Typography level="body-sm" fontStyle="italic" fontFamily="inherit">
                {currProblems[currIndex - 1]?.meta?.title}
              </Typography>
            </Stack>
          </Button>
          <Button disabled={currIndex >= currProblems.length-1 } onClick={handleNextProblem}>
            <Stack direction="column" spacing={0} alignItems="center">
              <Typography level="body-md" fontFamily="inherit">Next</Typography>
              <Typography level="body-sm" fontStyle="italic" fontFamily="inherit">
                (Alt + →)
              </Typography>
              <Typography level="body-sm" fontStyle="italic" fontFamily="inherit">
                {currProblems[currIndex + 1]?.meta?.title}
              </Typography>
            </Stack>
          </Button>
        </Box>

        <Sheet sx={{ border: 2, borderRadius: 10, p: 2, display: "flex", flexDirection: "column", gap: 1, width: "99%"}}>
          <Box sx={{ width: "100%",  flexDirection: "column", gap: 1 }}>
            <Box>
              <Typography level="title-lg">{problem.meta.title}</Typography>
              { !!author && <Typography level="body-sm">Authored by {problem.meta.author}</Typography> }
            </Box>

            <Box sx={{display:"flex", alignItems: "flex-end"}}>
              <Markdown>
                {problem.description}
              </Markdown>
              {['coding','haystack'].includes(problem.meta.question_type[0]) ? <></> : <Tutorial tourState={isTourOpen} setTourState={setTourOpen}/>}
            </Box>

            {alertMessage && (
              <Box sx={{
                width: '100%',
                mt: 1,
                p: 1.5,
                borderRadius: '12px',
                backgroundColor: '#ffe0b2',
                border: '#ffb74d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
              }}>
                <Typography level="body-sm" sx={{ color: '#3f2d2d' }}>
                  {alertMessage}
                </Typography>
                <Button
                  size="sm"
                  variant="plain"
                  color="neutral"
                  onClick={() => setAlertMessage(null)}
                  sx={{ minWidth: '24px', px: 0, color: '#3f2d2d' }}
                >
                  ×
                </Button>
              </Box>
            )}

            {sessionTimerRunning && !isCompleted && (
              hideExerciseTimer ? (
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    size="sm"
                    variant="soft"
                    color="neutral"
                    onClick={() => setHideExerciseTimer(false)}
                    sx={{ borderRadius: '999px', textTransform: 'none' }}
                  >
                    Show exercise timer
                  </Button>
                </Box>
              ) : (
                <Box sx={{
                  width: '100%',
                  mt: 2,
                  p: 1,
                  borderRadius: '999px',
                  background: 'linear-gradient(90deg, #ff9a9e 0%, #fad0c4 50%, #f9d976 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 2,
                }}>
                  <Typography level="body-md" sx={{ fontWeight: 700, color: '#3f2d2d' }}>
                    Exercise timer: {Math.floor(problemElapsedSeconds / 60)}:{(problemElapsedSeconds % 60).toString().padStart(2, '0')} elapsed
                  </Typography>
                  <Button
                    size="sm"
                    variant="plain"
                    color="neutral"
                    onClick={() => setHideExerciseTimer(true)}
                    sx={{ minWidth: '24px', px: 0, color: '#3f2d2d' }}
                  >
                    ×
                  </Button>
                </Box>
              )
            )}
          </Box>

          { ['coding','haystack'].includes(problem.meta.question_type[0]) ?
            (
              <CodingQuestion code={code} changeCode={changeCode} problem={problem} runCode={runCode} />
            ) : ( 
              <MutationQuestion code={code} setCode={changeCode} runCode={runCode} evalResponse={evalResponse} problem={problem} />
            )
          }
        </Sheet>
      </Stack>
      
      <Stack height="100%" width="100%" flex={2} alignItems="flex-start" className="results-container" gap={3}>
        { 
          ['coding','haystack'].includes(problem.meta.question_type[0]) ? (
            <Box flex={1} width="100%">
              {evalResponse ? <Report evalResponse={evalResponse} questionType={problem.meta.question_type[0]} /> : <Box></Box>}
            </Box>
          ) : 
          (
            <>
              <SolutionCode code={problem.solution} title="Problem Solution"/>
              
              {statuses &&
                problem.mutations?.map((mutCode, idx) =>
                  statuses.get(idx) === 'pass' ? (
                    <SolutionCode key={idx} code={mutCode} title={`Mutation M${idx + 1} Code`}/>
                  ) : null
                )
              }
            </>
            
          )
        }
        <Box ref={reflectionInput} flex={1} width="100%">
          {evalResponse ? <ReflectionInput hide={hidePrompt} problemName={problem.meta.name} question={question} /> : <Box></Box>}
        </Box>
      </Stack>
    </Stack>
  );
}

interface ReportProps {
  evalResponse: EvalResponse | null;
  questionType: string;
}

/**
 * A function that checks whether the only failing test case is the print statement check.
 * This determines whether to show the test case at all.
 * @param report evalResponse.report to parse
 * @returns boolean 
 */
function onlyPrintTestFail(report: EvalResult[]){
  for(var i = 0; i < report.length; i++){
    if(!report[i].equal){
      if(i === report.length - 1){
        return true;
      }
      return false;
    }
  }
  return false;
}

function Report({ evalResponse, questionType }: ReportProps) {
  if (null === evalResponse) return null;

  if ('failure' === evalResponse.status) {
    return (
      <Box 
        sx={{ 
          display: "flex",
          flexDirection: "column",
          backgroundColor: FAIL_COLOR,
          padding: "10px",
          border: "2px solid black",
          borderRadius: "10px",
        }}
      >
        <Typography>
          Uh-oh! There was a problem with your submission.
        </Typography>
        <Box sx={{ alignSelf: "center", marginY: "10px" }}>
          <img 
            src={errorCat}
            alt='error cat'
            height="100px"
            width="100px"
          />
          </Box>
        <Typography sx={{ whiteSpace: 'pre-wrap'}}>
          {evalResponse.message}
        </Typography>
      </Box>
    )
  }

  if ('success' === evalResponse.status) {

    const tableSx = { borderRadius: 10, border: 2, borderColor: "white" };
    // changes the font size to small in haystack questions
    const tableProps = questionType === "haystack"
      ? { size: "sm" as const, sx: {...tableSx} }
      : { sx: {...tableSx} };

    return (
      <Box sx={{ border: 2, borderRadius: 10}} >
        <Stack direction="column">
          <Typography sx={{ p: 2, borderBottom: 2 }} level="h4"> Results </Typography>
          <Table {...tableProps}>
            <thead>
            <tr>
              <th> Input </th>
              <th> Expected output </th>
              <th> Your output </th>
            </tr>
            </thead>
            <tbody>
            { evalResponse.report.map((r, i) =>
              <React.Fragment key={i}>
                <tr key={`result-${i}`} style={{ backgroundColor: r.equal ? PASS_COLOR : FAIL_COLOR }}>
                  { r.input === "N/A" && onlyPrintTestFail(evalResponse.report)
                    ? <td colSpan={3}> 
                        Looks like you still have left over debugging print statements in your code! Remove them to complete this problem.
                      </td>
                    : <></>
                  }
                  { r.input !== "N/A"
                    ? <>
                        <td className="mono"> {r.input} </td>
                        <td className="mono"> {r.expected} </td>
                        <td className="mono"> {r.actual} </td>
                      </>
                    : <></>
                  }
                </tr>
                { r.printed !== "" // check for any printed lines
                  ? <tr key={`printed-${i}`} style={{ backgroundColor: r.equal ? PASS_COLOR : FAIL_COLOR }}>
                      <td className="mono" colSpan={3}>
                        Printed output:
                        { /* pre allows the printed `\n`s to work as newlines */ }
                        <pre style={{ margin: '4px 0 0 0', padding: '4px', whiteSpace: 'pre-wrap', backgroundColor: 'white', borderRadius: 5 }}>
                          {r.printed}
                        </pre>
                      </td>
                    </tr>
                  : <></>
                }
              </React.Fragment>)
            }
            </tbody>
          </Table>
          { evalResponse.report.reduce((acc, r) => r.equal && acc, true)
            ? <Box style={{ textAlign: "center"}} sx={{ borderTop: 1 }} >
                <Typography sx={{ p: 1 }} level='body-lg'>
                  Bravo {ALL_TESTS_PASSED} You completed this problem!
                </Typography>
                <img src={cursedCat} alt='cursed coding cat' height="100px"/>
              </Box>
            : null }
        </Stack>
      </Box>
    ) 
  }

  return <p> If this text appears, it&apos;s a bug :^) </p>;
};
