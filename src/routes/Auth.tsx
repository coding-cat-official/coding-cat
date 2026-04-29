import { Box, Button, Stack, Typography } from "@mui/joy";
import { Link, Outlet } from "react-router-dom";
import logo from '../assets/coding-cat.png';

export default function Auth(){
  return(
    <Stack
      className= 'main'
      direction="column"
      sx={{
        width: '100%',
        minHeight: "100%",
        height: "100%",
        justifyContent: "start",
        alignItems: "center",
        overflowY: "scroll"
      }} >
        <Stack sx={{ width: '100%', display: 'flex', flexDirection: 'row'}} className="upper-nav">
          <Box sx={{ margin: '10px 10px 0 10px', display: 'flex', gap: 1 }} className="account-btns"></Box>
        </Stack>
      
      <Stack sx={{ width: '100%' }} direction="row" alignItems="center" justifyContent="center"  className="logo">
        <Link to="/">
          <Box component="img" src={logo} sx={{ maxHeight: "80px", marginTop: "5px", marginRight:"15px" }}/>
        </Link>
          <Typography sx={{ fontFamily: '"Silkscreen", monospace', fontSize: "35pt"}} level="h1">
            Coding Cat!
          </Typography>
      </Stack>

      <Box width="100%" height="100%">
        <Outlet />
      </Box>
    </Stack>
  );
}