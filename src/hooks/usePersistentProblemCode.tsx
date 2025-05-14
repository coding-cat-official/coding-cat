import { useState, useEffect } from 'react';
import { Problem } from '../types';

type PersistentProblemCode = [any, (code: any) => void];

export default function usePersistentProblemCode(problem: Problem): PersistentProblemCode {
  const key = problem.meta.name;
  const isMutation = problem.meta.question_type[0] === "mutation"
  
  const [code, setCode] = useState<any>(() => {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw)
    return isMutation ? [] : problem.starter
  })

  useEffect(() => {
    const raw = localStorage.getItem(key)
    if (raw) setCode(JSON.parse(raw))
    else       setCode(isMutation ? [] : problem.starter)
  }, [problem.meta.name])

  function setCodeInDB(newCode: any) {
    localStorage.setItem(key, JSON.stringify(newCode))
    setCode(newCode)
  }

  return [code, setCodeInDB]
}
