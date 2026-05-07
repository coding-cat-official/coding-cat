import { Box, Button, Input, Typography } from "@mui/joy";
import { useState } from "react";
import { supabase } from "../../supabaseClient";

export default function CategoryPasswordForm() {
  const [testPassword, setTestPassword] = useState("");

  const statusDefault = { value: "", statusSx: {} as Record<string, any> };
  const [status, setStatus] = useState(statusDefault);

  const handleTestPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTestPassword(e.target.value);
    setStatus(statusDefault);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendPasswordtoDB(testPassword);
  };

  // Update query to update test-password to the new password
  const sendPasswordtoDB = async (password: string) => {
    let { error } = await supabase
      .from("settings")
      .update({ value: password })
      .eq("key", "test-password")
      .select();

    if (error) {
      setStatus({
        value: `An error occurred, ${error.message}`,
        statusSx: { color: "red", mt: 1 },
      });
    } else {
      setStatus({
        value: "Success! The password was updated",
        statusSx: { color: "green", mt: 1 },
      });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Input
        value={testPassword}
        placeholder="Enter Category Password"
        onChange={handleTestPassword}
      />
      <Typography sx={status.statusSx}>{status.value}</Typography>
      <Button color="success" onClick={handleSubmit}>
        Save
      </Button>
    </Box>
  );
}
