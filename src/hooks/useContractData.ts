import { useState, useEffect, useCallback } from 'react';
import { BLANK_CONTRACT, ContractData, ContractProgress, Submission } from '../types';
import { supabase } from '../supabaseClient';
import { type Session } from '@supabase/supabase-js';

interface UseContractDataReturn {
  contract: ContractData;
  progress: Submission[];
  contractProgress: ContractProgress;
  fetchProgress: () => Promise<void>;
}

export default function useContractData(session: Session | null): UseContractDataReturn {
  const [contract, setContract] = useState<ContractData>(BLANK_CONTRACT);
  const [progress, setProgress] = useState<Submission[]>([]);

  // Fetch contract data
  useEffect(() => {
    (async () => {
      if (!session) return;

      const { data } = await supabase
        .from('contracts')
        .select('data')
        .eq('profile_id', session?.user.id)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (data?.[0]?.data) setContract(data[0].data);
      else setContract(BLANK_CONTRACT);
    })();
  }, [session]);

  const fetchProgress = useCallback(async () => {
    if (!session) return;
    const { data: submissions, error } = await supabase
      .from('submissions')
      .select('problem_title, passed_tests, total_tests, question_type')
      .eq('profile_id', session.user.id);
    if (!error) setProgress(submissions || []);
  }, [session]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const contractProgress: ContractProgress = contract.Coding.problemsToSolveByCategory;
  contractProgress['mutation'] = contract.Mutation.problemsToSolve;
  contractProgress['haystack'] = contract.Haystack.problemsToSolve;

  return {
    contract,
    progress,
    contractProgress,
    fetchProgress,
  };
}
