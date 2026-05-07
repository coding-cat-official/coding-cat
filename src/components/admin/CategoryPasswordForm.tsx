import { Box, Button, Input, Typography } from "@mui/joy";
import { useState } from "react";
import { supabase } from "../../supabaseClient";

export default function CategoryPasswordForm() {
  const [testPassword, setTestPassword] = useState("");
  const [status, setStatus] = useState("");

  const handleTestPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTestPassword(e.target.value);
    setStatus("")
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendPasswordtoDB(testPassword);
  };

  // Update query to update test-password to the new password
  const sendPasswordtoDB = async (password: string) => {
    const { error } = await supabase
      .from("settings")
      .update({ value: password })
      .eq("key", "test-password")
      .select();

    if (error) {
      setStatus(`An error occurred, ${error}`);
    } else {
      setStatus("Success! The password was updated");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Input
        value={testPassword}
        placeholder="Enter Category Password"
        onChange={handleTestPassword}
      />
      <Typography sx={{ color: "danger.main", mt: 1 }}>{status}</Typography>
      <Button color="success" onClick={handleSubmit}>
        Save
      </Button>
    </Box>
  );
}
