import React from 'react';
import { Box, Stack } from '@mui/joy';
import whitePaw from '../../assets/white_paw.webp';
import whitePawHover from '../../assets/white_paw_hover.webp';

interface Props {
  openDrawer: () => void;
  children?: React.ReactNode;
}

export default function MainLayout({ openDrawer, children }: Props) {
  return (
    <Box sx={{ display: 'flex', height: '100%', flex: 1 }}>
      <Stack
        sx={{
          width: '6em',
          cursor: 'pointer',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            width: '70px',
            height: '70px',
            backgroundImage: `url(${whitePaw})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            transform: 'rotate(-90deg)'
          },
          '&:hover::after': {
            backgroundImage: `url(${whitePawHover})`
          }
        }}
        className="desktop-bar"
        onClick={() => openDrawer()}
      >
        (Ctrl + D)
      </Stack>

      <Stack className="main" direction="column" sx={{ width: '100%', minHeight: '100%', height: '100%', justifyContent: 'start', alignItems: 'center', overflowY: 'scroll', position: 'relative' }}>
        {children}
      </Stack>
    </Box>
  );
}
