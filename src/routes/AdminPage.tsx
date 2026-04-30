import { Box, Typography, Link, Card } from "@mui/joy";
import { useState } from "react";
import ToggleContract from "../components/admin/ToggleContract";

export default function AdminPage() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  

  return (
    <Box
      sx={{
        height: "90%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          border: "10px, solid ,#d4ff99",
          padding: "100px",
        }}
      >
        <Typography level="h2" sx={{ marginBottom: 2, color: "black" }}>
          Admin Dashboard
        </Typography>
        <Link href="/admin/users" sx={{ color: "black", fontSize: "lg" }}>
          View Student Information
        </Link>
        <Link href="/admin/problems" sx={{ color: "black", fontSize: "lg" }}>
          Toggle Public/Test Questions
        </Link>
        <Link component="button" sx={{ color: "black", fontSize: "lg" }} onClick={handleOpen}>
          Modify Global Contract Permissions
        </Link>
        {open && <ToggleContract open={open} handleClose={handleClose} />}
      </Card>
    </Box>
  );
}
