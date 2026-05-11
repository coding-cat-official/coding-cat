import { Box, Button, Input, Typography } from "@mui/joy";
import { useState } from "react";
import { supabase } from "../../supabaseClient";

interface CategoryPasswordFormProps {
  visibility: boolean;
}

// Create test-password hash via web crypto and sha-256
async function hashPassword(password: string) {
  const encodedPassword = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest("sha-256", encodedPassword);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

export default function CategoryPasswordForm({ visibility }: CategoryPasswordFormProps) {
  const [testPassword, setTestPassword] = useState("");

  const statusDefault = { value: "", statusSx: {} as Record<string, any> };
  const [status, setStatus] = useState(statusDefault);

  const handleTestPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTestPassword(e.target.value);
    setStatus(statusDefault);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    // If eric wants to add rules to his own password this is where to do it
    const passwordRules = {
      minLength: {
        fn: (password: string) => password.length >= 8,
        msg: "Password length not greater than 8",
      },
    };

    // Catch failed rule
    const failedRule = Object.values(passwordRules).find((rule) => !rule.fn(testPassword));

    if (!failedRule) {
      e.preventDefault();
      const hashedPassword = await hashPassword(testPassword);
      sendPasswordtoDB(hashedPassword);
    } else {
      setStatus({ value: failedRule.msg, statusSx: { color: "red", mt: 1 } });
    }
  };

  // Update query to update test-password to the new password
  const sendPasswordtoDB = async (hashedPassword: string) => {
    let { error } = await supabase
      .from("settings")
      .update({ value: hashedPassword })
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

  return visibility ? (
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
  ) : null;
}
