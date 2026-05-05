import { Box, Button, Card, Input, Typography } from "@mui/joy";
import { Butterfly } from "@phosphor-icons/react/dist/ssr";

const containerStyles = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  px: 2,
};

const cardStyles = {
  width: "100%",
  maxWidth: 420,
  p: 3,
  textAlign: "center",
};

const headingStyles = {
  mb: 2,
};

export default function PasswordProtected() {
  return (
    <Box sx={containerStyles}>
      <Card sx={cardStyles}>
        <Typography level="h4" sx={headingStyles}>
          Enter the Password that your teacher has given you
        </Typography>
        <Input type="password" placeholder="Enter Password" />
        <Button> Enter </Button>
      </Card>
    </Box>
  );
}
