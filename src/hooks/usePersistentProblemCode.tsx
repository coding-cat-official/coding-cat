import { useState, useEffect } from 'react';
import { CodingProblem } from '../types';

type PersistentProblemCode = [string, (code: string) => void];

export default function usePersistentProblemCode(problem: CodingProblem): PersistentProblemCode {
  const [code, setCode] = useState(localStorage.getItem(problem.meta.name) ?? problem.starter);

  useEffect(() => {
    const storedCode = localStorage.getItem(problem.meta.name);
    setCode(storedCode ?? problem.starter);
    console.log('loaded stored code:', storedCode);
  }, [problem.meta.name]);

  function setCodeInDB(code: string) {
    localStorage.setItem(problem.meta.name, code);
    setCode(code);
    console.log('saved code');
  }

  return [code, setCodeInDB];
}
