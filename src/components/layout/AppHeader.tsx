import React from 'react';
import { Link } from 'react-router-dom';
import { Stack, Box, Typography } from '@mui/joy';
import logo from '../../assets/coding-cat.png';

export default function AppHeader() {
  return (
    <Stack sx={{ width: '100%' }} direction="row" alignItems="center" justifyContent="center" className="logo">
      <Link to="/">
        <Box component="img" src={logo} sx={{ maxHeight: '80px', marginTop: '5px', marginRight: '15px' }} />
      </Link>
      <Typography sx={{ fontFamily: '"Silkscreen", monospace', fontSize: '35pt' }} level="h1">
        Coding Cat!
      </Typography>
    </Stack>
  );
}
