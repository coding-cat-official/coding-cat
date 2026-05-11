import { useEffect, useRef, useState } from 'react';
import { ProblemSessionStats, ProblemArgs } from '../types';

/**
 * This component is responsible for tracking the time spent on a problem during an active session. 
 * It starts a timer when the component mounts and stops it when the user completes the problem or navigates away. 
 * The elapsed time is stored in the parent component's state to be included in the session summary.
 */
export default function useProblemTimer({ problemName, activeSession, problemSessionStats, setProblemSessionStats, progress } : ProblemArgs) {
    const alreadySolved = progress?.some(
        s => s.problem_title === problemName && s.passed_tests === s.total_tests
    ) ?? false;
    const stats = problemSessionStats[problemName];
    const completed = stats?.completed ?? alreadySolved;
    const [elapsed, setElapsed] = useState(problemSessionStats[problemName]?.elapsedTimeSeconds ?? 0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const startRef = useRef<number | null>(null);
    const hasStoppedRef = useRef(false);

    const completedRef = useRef(completed);
    completedRef.current = completed;

    //Reset all the variables states
    useEffect(() => {
        hasStoppedRef.current = false;
        startRef.current = null;
        setElapsed(problemSessionStats[problemName]?.elapsedTimeSeconds ?? 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [problemName]);

    //from the stored state
    useEffect(() => {
        if (!activeSession) return;
        const currentProblemCompleted = problemSessionStats[problemName]?.completed ?? alreadySolved;

        if (currentProblemCompleted) return;

        //we don't want duplicate intervals
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        const base = problemSessionStats[problemName]?.elapsedTimeSeconds ?? 0;
        startRef.current = Date.now();

        intervalRef.current = setInterval(() => {
            const delta = Math.floor((Date.now() - (startRef.current ?? Date.now())) / 1000);
            setElapsed(base + delta);
        }, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }

            if (!activeSession) return; 
            if (hasStoppedRef.current) return;

            const delta = Math.floor((Date.now() - (startRef.current ?? Date.now())) / 1000);

            setProblemSessionStats(prev => ({
                ...prev,
                [problemName]: {
                    elapsedTimeSeconds: (prev[problemName]?.elapsedTimeSeconds ?? 0) + delta,
                    completed: prev[problemName]?.completed ?? false,
                    passedTests: prev[problemName]?.passedTests ?? 0,
                    totalTests: prev[problemName]?.totalTests ?? 0,
                },
            }));
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [problemName, activeSession]);

    const stop = (data?: Partial<ProblemSessionStats>) => {
        hasStoppedRef.current = true;

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        const delta = Math.floor(
            (Date.now() - (startRef.current ?? Date.now())) / 1000
        );

        setProblemSessionStats(prev => ({
            ...prev,
            [problemName]: {
                elapsedTimeSeconds: (prev[problemName]?.elapsedTimeSeconds ?? 0) + delta,
                completed: true,
                passedTests: data?.passedTests ?? prev[problemName]?.passedTests ?? 0,
                totalTests: data?.totalTests ?? prev[problemName]?.totalTests ?? 0,
            }
        }));

        setElapsed(prev => prev + delta);
    };

    return { elapsed, stop, completed };
}

