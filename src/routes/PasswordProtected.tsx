import { Box, Button, Card, Input, Typography } from "@mui/joy";
import { useState } from "react";
import ProblemList, { ProblemListProps } from "../components/ProblemList";

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

/**
 * Wrapper component for the category problem list that password protects it
 * @returns Either the "Enter Password" component or the actual Problem List
 */
export default function PasswordProtected({
  selectedTab,
  setSelectedTab,
  searchedProblems,
  selectedCategory,
  activeProblem,
  closeDrawer,
  session,
  contractProgress,
  progress,
  onSelectProblem,
}: ProblemListProps) {
  const [passwordValue, setPasswordValue] = useState("");
  const [error, setError] = useState("");
  const [locked, setLocked] = useState(true);

  const handleClick = () => {
    //Change to actual db check
    if (passwordValue === "abc123") {
      handleUnlock();
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  const handleUnlock = () => setLocked(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordValue(e.target.value);
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleClick();
  };

  return (
    <>
      {locked ? (
        <Box sx={containerStyles}>
          <Card sx={cardStyles}>
            <Typography level="h4" sx={headingStyles}>
              Enter the Password that your teacher has given you
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <Input
                value={passwordValue}
                type="password"
                placeholder="Enter Password"
                onChange={handlePasswordChange}
                error={!!error}
              />

              {/* Error handling on bad password attempt */}
              {error && (
                <Typography level="body-sm" sx={{ color: "danger.main", mt: 1 }}>
                  {error}
                </Typography>
              )}

              <Button type="submit" sx={{ mt: 2 }}>
                Enter
              </Button>
            </Box>
          </Card>
        </Box>
      ) : (
        <ProblemList
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          searchedProblems={searchedProblems}
          selectedCategory={selectedCategory}
          activeProblem={activeProblem}
          closeDrawer={closeDrawer}
          session={session}
          contractProgress={contractProgress}
          progress={progress}
          onSelectProblem={onSelectProblem}
        />
      )}
    </>
  );
}
