import React, { useEffect, useState, useRef } from 'react';
import { useLoaderData, useNavigate, useOutletContext } from 'react-router-dom';
import Markdown from 'markdown-to-jsx';

import { Problem, EvalResponse } from '../types';
import problems from '../public-problems/problems';
import useEval from '../hooks/useEval';
import usePersistentProblemCode from '../hooks/usePersistentProblemCode';

import { Stack, Sheet, Box, Typography, Table, Button } from '@mui/joy';

import type { Session } from '@supabase/supabase-js'
import { supabase } from '../supabaseClient';

import ReflectionInput from '../components/ReflectionInput';
import CodingQuestion from '../components/CodingQuestion';
import MutationQuestion from '../components/MutationQuestion';
import { reflectionQuestions } from '../utils/questions';
import Tutorial from '../components/MutationTutorial';

// Emoji rendered in the report
const TEST_CASE_PASSED = '✅';
const TEST_CASE_FAILED = '❌';
const ALL_TESTS_PASSED = '🎉';

const PASS_COLOR = '#caffc5';
const FAIL_COLOR = '#f4cbca';

export async function problemLoader({params}: any): Promise<Problem> {
    const selected = (problems as Problem[]).filter((p) => p.meta.name === params.problemName);
    if (selected.length !== 1) throw new Error('fuck');
    return selected[0];
}

export default function ProblemView() {
    const problem = useLoaderData() as Problem;
    return <>
        <ProblemIDE problem={problem} />
    </>;
}

interface ProblemIDEProps {
    problem: Problem
}

interface ProblemIDEOutletContext {
    setActiveProblem: (name: string | null) => void;
}

function ProblemIDE({ problem }: ProblemIDEProps) {
    const [code, setCode] = usePersistentProblemCode(problem);
    const [hidePrompt, setHidePrompt] = useState(true);
    const [question, setQuestion] = useState("");
    const reflectionInput = useRef<HTMLElement>(null);
    const [isTourOpen, setTourOpen] = useState(false);

    const { session } = useOutletContext<{ session: Session | null }>();
    const { setActiveProblem } = useOutletContext<ProblemIDEOutletContext>();
    
    const navigate = useNavigate();

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

    const [evalResponse, runCode] = useEval(problem, session);

    useEffect(() => {
      if (!evalResponse) setHidePrompt(true);

      if (evalResponse?.status === "success") {
        setHidePrompt(false);
      }
    }, [evalResponse]);

    const hasFetchedProblems = useRef<Set<string>>(new Set());

    useEffect(() => {
      async function fetchLatestSubmission() {
        if (!session?.user) return;
        if (hasFetchedProblems.current.has(problem.meta.name)) return;

        const { data, error } = await supabase
        .from('submissions')
        .select('code')
        .eq('profile_id', session.user.id)
        .eq('problem_title', problem.meta.name)
        .order('submitted_at', { ascending: false})
        .limit(1);

        const json = data?.[0] || null;

        if (error) {
          console.warn('Could not load latest submission: ', error.message);
          return;
        }
        
        if (json){
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
          if(problem.meta.question_type[0] === 'coding'){
            setCode(problem.starter || '');
          }
          else{
            setCode('');
          }
        }
        hasFetchedProblems.current.add(problem.meta.name);
      }

      fetchLatestSubmission();

    }, [problem.meta.name, problem.meta.title, problem.starter, session, setCode]);

    function changeCode(e: string | undefined) {
      setCode(e ?? '')
    }


    function handlePreviousProblem(){
      if(currIndex > 0){
        const prevProblem = currCategoryProblems()[currIndex-1].meta.name;
        setCurrIndex(currIndex-1);
        navigate(`/problems/${prevProblem}`)
      }
    }

    function handleNextProblem(){ 
      if(currIndex < currCategoryProblems().length - 1){
        const nextProblem = currCategoryProblems()[currIndex+1].meta.name;
        setCurrIndex(currIndex+1);
        navigate(`/problems/${nextProblem}`)
      }
    }

    function generateQuestion() {
      let questionList = reflectionQuestions.success;

      if (evalResponse?.status === "success") {
        const result = evalResponse.report.reduce((acc, r) => r.equal && acc, true);
  
        if (!result) questionList = reflectionQuestions.fail;
      }

      const rand = Math.floor(Math.random() * questionList.length);
      const question = questionList[rand];

      setQuestion(question);

      setTimeout(() => {
        reflectionInput.current?.scrollIntoView({ behavior: "smooth" });
      }, 100)
    }

    let author = problem.meta.author;
    if (author.toLowerCase() === "chatgpt") author = "";

    return (
      <Stack sx={{ width: "100%", p: 3 }} className="problem-container" direction="row" spacing={2}  justifyContent="center">
        <Stack sx={{ flex: 4, width: "100%", height: "100%", display: "flex"}} direction="column" spacing={2} alignItems="center">
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
                {problem.meta.question_type[0] === 'coding' ? <></> : <Tutorial tourState={isTourOpen} setTourState={setTourOpen}/>}
              </Box>
            </Box>
            { problem.meta.question_type[0] === 'coding' ?
              (
                <CodingQuestion code={code} changeCode={changeCode} problem={problem} runCode={runCode} generateQuestion={generateQuestion} />
              ) : ( 
                <MutationQuestion code={code} setCode={changeCode} runCode={runCode} evalResponse={evalResponse} problem={problem} generateQuestion={generateQuestion}/>
              )
            }
          </Sheet>
          <Box className="navigate-problem-btn">
            <Button disabled={currIndex === 0} onClick={handlePreviousProblem}>Prev</Button>
            <Button disabled={currIndex >= currProblems.length-1 } onClick={handleNextProblem}>Next</Button>
          </Box>
        </Stack>
      
          <Stack height="100%" width="100%" flex={2} alignItems="flex-start" className="results-container" gap={3}>
            { 
              problem.meta.question_type[0] === 'coding' ? (
                <Box flex={1} width="100%">
                  {evalResponse ? <Report evalResponse={evalResponse} /> : <Box></Box>}
                </Box>
              ) : <></>
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
}

function Report({ evalResponse }: ReportProps) {
  if (null === evalResponse) return null;

  if ('failure' === evalResponse.status) {
    return (
      <Stack direction="column">
        <Typography> Uh-oh... There was a problem with your submission. </Typography>
        <Typography sx={{ whiteSpace: 'pre-wrap'}}> {evalResponse.message} </Typography>
      </Stack>
    )
  }

  if ('success' === evalResponse.status) {
    return (
      <Box sx={{ border: 2, borderRadius: 10}} >
        <Stack direction="column">
          <Typography sx={{ p: 2, borderBottom: 2 }} level="h4"> Results </Typography>
          <Table sx={{ borderRadius: 10, border: 2, borderColor: "white" }}>
            <thead>
            <tr>
              <th> Input </th>
              <th> Expected output </th>
              <th> Your output </th>
            </tr>
            </thead>
            <tbody>
            { evalResponse.report.map((r, i) =>
                <tr key={i} style={{ backgroundColor: r.equal ? PASS_COLOR : FAIL_COLOR }}>
                  <td className="mono"> {r.input} </td>
                  <td className="mono"> {r.expected} </td>
                  <td className="mono"> {r.actual} </td>
                </tr>)
            }
            </tbody>
          </Table>
          { evalResponse.report.reduce((acc, r) => r.equal && acc, true)
            ? <Box style={{ textAlign: "center" }} sx={{ borderTop: 1 }} >
                <Typography sx={{ p: 2 }} level='body-lg'>
                  Bravo {ALL_TESTS_PASSED} You completed this problem!
                </Typography>
              </Box>
            : null }
        </Stack>
      </Box>
    ) 
  }

  return <p> If this text appears, it&apos;s a bug :^) </p>;
};
