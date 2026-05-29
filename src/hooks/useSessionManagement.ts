import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router';
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
  startSession: (sessionIdFromState: string, durationMinutes: number, exerciseCount: number, startTime?: Date, remainingSeconds?: number) => void;
  endSession: () => void;
  formatTime: (seconds: number) => string;
  setActiveSession: (param: boolean) => void;
}

export default function useSessionManagement(session: Session | null): UseSessionManagementReturn {
  const location = useLocation();
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [activeSession, setActiveSession] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionDuration, setSessionDuration] = useState<number>(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [sessionRemainingSeconds, setSessionRemainingSeconds] = useState<number>(0);
  const [plannedExerciseCount, setPlannedExerciseCount] = useState<number>(0);
  const [sessionTimerRunning, setSessionTimerRunning] = useState(false);

  const startSession = useCallback((sessionIdFromState: string, durationMinutes: number, exerciseCount: number, startTime: Date = new Date(), remainingSeconds?: number,) => {
      setSessionId(sessionIdFromState);
      setSessionDuration(durationMinutes);
      setPlannedExerciseCount(exerciseCount);
      setSessionStartTime(startTime);
      setSessionRemainingSeconds(remainingSeconds ?? durationMinutes * 60);
      setActiveSession(true);
      setSessionTimerRunning(true);
    },
    [],
  );

  const endSession = useCallback(() => {
    if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    setActiveSession(false);
    setSessionId(null);
    setSessionStartTime(null);
    setSessionDuration(0);
    setSessionRemainingSeconds(0);
    setSessionTimerRunning(false);
  }, []);

  const restoreIncompleteSession = useCallback(
    async (sessionIdToRestore?: string) => {
      if (!session?.user) return;

      let sessionQuery = supabase
        .from('sessions')
        .select('id, start_time, planned_duration_minutes, exercise_goals')
        .eq('profile_id', session.user.id)
        .not('pre_session_reflection', 'is', null)
        .is('post_session_reflection', null);

      if (sessionIdToRestore) {
        sessionQuery = sessionQuery.eq('id', sessionIdToRestore);
      } else {
        sessionQuery = sessionQuery.order('start_time', { ascending: false }).limit(1);
      }

      const { data, error } = await sessionQuery.maybeSingle();
      if (error || !data) return;
      const startTime = new Date(data.start_time);
      const elapsedSeconds = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
      const durationSeconds = data.planned_duration_minutes * 60;
      const remainingSeconds = Math.max(0, durationSeconds - elapsedSeconds);

      if (remainingSeconds <= 0) {
        // Timer already passed, but keep the session around so the user can
        // still click the button and submit the post-session reflection.
        setActiveSession(true);
        setSessionId(data.id);
        setSessionDuration(data.planned_duration_minutes);
        setPlannedExerciseCount(data.exercise_goals);
        setSessionStartTime(null);
        setSessionRemainingSeconds(0);
        setSessionTimerRunning(false);
        return;
      }

      startSession(data.id, data.planned_duration_minutes, data.exercise_goals, startTime, remainingSeconds);
    },
    [session?.user, startSession],
  );

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
    const fromPostSession = locationState?.fromPostSession;

    if (location.pathname !== '/' || !session?.user) return;

    if (fromPostSession) {
      if (activeSession) {
        endSession();
      }
      return;
    }

    if (activeSession) return;

    if (fromPreSession && sessionIdFromState) {
      void restoreIncompleteSession(sessionIdFromState);
      return;
    }

    void restoreIncompleteSession();
  }, [activeSession, endSession, location.pathname, location.state, restoreIncompleteSession, session?.user]);
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
        setSessionStartTime(null);
        setSessionRemainingSeconds(0);
        setSessionTimerRunning(false);
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
    setActiveSession
  };
}