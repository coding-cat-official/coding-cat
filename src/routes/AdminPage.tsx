import { Box, Typography, Link, Card } from "@mui/joy";

export default function AdminPage() {
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
        <Link href="/admin/categories" sx={{ color: "black", fontSize: "lg" }}>
          Modify Global Contract Permissions
        </Link>
      </Card>
    </Box>
  );
}
