import { useEffect, useRef, useState } from 'react';
import { ProblemSessionStats, ProblemArgs } from '../types';

/**
 * This component is responsible for tracking the time spent on a problem during an active session. 
 * It starts a timer when the component mounts and stops it when the user completes the problem or navigates away. 
 * The elapsed time is stored in the parent component's state to be included in the session summary.
 */
export default function useProblemTimer({ problemName, activeSession, problemSessionStats, setProblemSessionStats } : ProblemArgs) {
    const [elapsed, setElapsed] = useState(problemSessionStats[problemName]?.elapsedTimeSeconds ?? 0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const startRef = useRef<number | null>(null);
    const hasStoppedRef = useRef(false);
    const stats = problemSessionStats[problemName];
    const completed = stats?.completed ?? false;

    //from the stored state
    useEffect(() => {
        if (!activeSession) return;
        if (completed) return;

        //we don't want duplicate intervals
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        startRef.current = Date.now();
        setElapsed(stats?.elapsedTimeSeconds ?? 0);
        intervalRef.current = setInterval(() => {
            const base = stats?.elapsedTimeSeconds ?? 0;
            const delta = Math.floor((Date.now() - (startRef.current ?? Date.now())) / 1000);
            setElapsed(base + delta);
        }, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }

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
    }, [problemName, activeSession, completed]);

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

