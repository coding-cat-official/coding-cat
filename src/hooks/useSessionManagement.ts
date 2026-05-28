import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { supabase } from '../supabaseClient';
import { type Session } from '@supabase/supabase-js';

interface UseSessionManagementReturn {
  activeSession: boolean;
  sessionId: string | null;
  sessionDuration: number;
  sessionStartTime: Date | null;
  sessionRemainingSeconds: number;
  plannedExerciseCount: number;
  sessionTimerRunning: boolean;
  startSession: (sessionIdFromState: string, durationMinutes: number, exerciseCount: number) => void;
  endSession: () => void;
  formatTime: (seconds: number) => string;
}

export default function useSessionManagement(session: Session | null): UseSessionManagementReturn {
  const navigate = useNavigate();
  const location = useLocation();
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [activeSession, setActiveSession] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionDuration, setSessionDuration] = useState<number>(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [sessionRemainingSeconds, setSessionRemainingSeconds] = useState<number>(0);
  const [plannedExerciseCount, setPlannedExerciseCount] = useState<number>(0);
  const [sessionTimerRunning, setSessionTimerRunning] = useState(false);

  const startSession = (sessionIdFromState: string, durationMinutes: number, exerciseCount: number) => {
    setSessionId(sessionIdFromState);
    setSessionDuration(durationMinutes);
    setPlannedExerciseCount(exerciseCount);
    setSessionStartTime(new Date());
    setSessionRemainingSeconds(durationMinutes * 60);
    setActiveSession(true);
    setSessionTimerRunning(true);
  };

  const endSession = useCallback(() => {
    if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    setActiveSession(false);
    setSessionId(null);
    setSessionStartTime(null);
    setSessionDuration(0);
    setSessionRemainingSeconds(0);
    setSessionTimerRunning(false);
  }, []);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    //Below is the antiquated return statement, kept just in case
    //const remainingSeconds = seconds % 60;
    //return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    return `${minutes} min`
  };
  // Handle session start when coming back from PreSessionForm
  useEffect(() => {
    const locationState = location.state as any;
    const sessionIdFromState = locationState?.sessionId;
    const fromPreSession = locationState?.fromPreSession;

    if (location.pathname !== '/' || !fromPreSession || !session?.user) return;

    const fetchSessionData = async () => {
      const { data, error } = await supabase
        .from('sessions')
        .select('planned_duration_minutes, exercise_goals')
        .eq('id', sessionIdFromState)
        .eq('profile_id', session.user.id)
        .single();

      if (!error && data) {
        startSession(sessionIdFromState, data.planned_duration_minutes, data.exercise_goals);
      }
    };
    fetchSessionData();
  }, [location.pathname, location.state, session?.user, navigate]);
  // Handle session reset when coming back from PostSessionForm
  useEffect(() => {
    if (location.pathname === '/' && activeSession && (location.state as any)?.fromPostSession) {
      endSession();
    }
  }, [location.pathname, location.state, activeSession, endSession]);
  // Session countdown timer
  useEffect(() => {
    if (!activeSession || !sessionStartTime) return;

    sessionTimerRef.current = setInterval(() => {
      const elapsed = Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 1000);
      const remaining = Math.max(0, sessionDuration * 60 - elapsed);
      setSessionRemainingSeconds(remaining);

      if (remaining <= 0) {
        clearInterval(sessionTimerRef.current!);
        setActiveSession(false);
        setSessionStartTime(null);
        setSessionRemainingSeconds(0);
        setSessionTimerRunning(false);
        navigate('/post-session', {
          state: {
            sessionId,
            timerExpired: true,
          },
        });
      }
    }, 1000);

    return () => {
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSession, sessionStartTime, sessionDuration]);

  return {
    activeSession,
    sessionId,
    sessionDuration,
    sessionStartTime,
    sessionRemainingSeconds,
    plannedExerciseCount,
    sessionTimerRunning,
    startSession,
    endSession,
    formatTime,
  };
}
