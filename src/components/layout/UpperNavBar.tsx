import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Stack, Box } from '@mui/joy';
import { List as ListIcon } from '@phosphor-icons/react';
import ProfileAvatar from '../profile/ProfileAvatar';
import { ALL_PFPS } from '../profile/UserInfo';
import { Session } from '@supabase/supabase-js';

interface Props {
  openDrawer: () => void;
  session: Session | null;
  isRecoverySession: boolean;
  activeSession: boolean;
  sessionTimerRunning: boolean;
  formatTime: (s: number) => string;
  sessionRemainingSeconds: number;
  endSession: () => void;
  sessionId: string | null;
  userData: { name: string; pfp_id: number } | null;
  isAdmin: boolean;
  signOut: () => void;
  setActiveSession: (param: boolean) => void;
}

export default function UpperNavBar({
  openDrawer,
  session,
  isRecoverySession,
  activeSession,
  sessionTimerRunning,
  formatTime,
  sessionRemainingSeconds,
  endSession,
  sessionId,
  userData,
  isAdmin,
  signOut,
  setActiveSession,
}: Props) {
  const navigate = useNavigate();

  return (
    <Stack sx={{ width: '100%', display: 'flex', flexDirection: 'row' }} className="upper-nav">
      <Button sx={{ margin: '10px 10px 0 10px', cursor: 'pointer' }} onClick={openDrawer} className="mobile-bar">
        <ListIcon size={20} />
      </Button>
      <Box sx={{ margin: '10px 10px 0 10px', display: 'flex', gap: 1 }} className="account-btns">
        {session && !isRecoverySession ? (
          <>
            <Button
              onClick={() => {
                if (activeSession && sessionTimerRunning) {
                  endSession();
                  navigate('/post-session', { state: { sessionId } });
                } else if (activeSession && !sessionTimerRunning) {
                  setActiveSession(false)
                  navigate('/post-session', { state: { sessionId } });
                } else {
                  navigate('/session');
                }
              }}
              sx={{
                backgroundColor: activeSession && !sessionTimerRunning ? '#ff8b78' : '#d4ff99',
                color: '#1a3e00',
                borderRadius: '999px',
                px: 2,
                py: 1,
                minWidth: '240px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                '&:hover': { backgroundColor: '#c7f68e' },
              }}
              title={activeSession ? 'Click to end session' : 'Start a new session'}
            >
              {sessionTimerRunning
                ? `Ongoing session — ${formatTime(sessionRemainingSeconds)} left`
                : activeSession
                  ? 'Complete Session Reflection'
                  : 'Start Session'}
            </Button>

            <Link to="/profile">
              <Button>
                <Stack flexDirection="row" alignItems="center" gap={1}>
                  {userData?.pfp_id != null ? (
                    <ProfileAvatar fileName={ALL_PFPS[userData.pfp_id]} height={25} width={25} />
                  ) : (
                    <></>
                  )}
                  {userData?.name ?? 'Profile'}
                </Stack>
              </Button>
            </Link>

            <Button onClick={signOut}>{'Sign Out'}</Button>

            {isAdmin && (
              <Link to="/admin">
                <Button color="warning">Admin</Button>
              </Link>
            )}
          </>
        ) : (
          <>
            <Link to="/signin">
              <Button>Login</Button>
            </Link>
            <Link to="/register">
              <Button>Register</Button>
            </Link>
          </>
        )}
      </Box>
    </Stack>
  );
}
