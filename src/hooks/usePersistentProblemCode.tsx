import { useState, useEffect } from 'react';
import { Problem } from '../types';

type PersistentProblemCode = [ any, (code: any) => void ];

export default function usePersistentProblemCode(problem: Problem): PersistentProblemCode {
  const isMutation = problem.meta.question_type[0] === 'mutation';
  const key = problem.meta.name;

  function loadStored() {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return isMutation ? [] : problem.starter;
    }

    try {
      const parsed = JSON.parse(raw);

      if (isMutation) {
        if (Array.isArray(parsed)) return parsed;
      } else {
        if (typeof parsed === 'object' && parsed !== null && 'code' in parsed) {
          return (parsed as any).code;
        }
        if (typeof parsed === 'string') {
          return parsed;
        }
      }
    } 
    catch {
        if (isMutation) {
          return [];
        } else {
          return raw;
        }
      }
    }

  const [code, setCode] = useState<any>(loadStored);

  useEffect(() => {
    setCode(loadStored());
  }, [problem.meta.name]);

  function setCodeInDB(newCode: any) {
    localStorage.setItem(key, JSON.stringify(newCode));
    setCode(newCode);
  }

  return [code, setCodeInDB];
}
