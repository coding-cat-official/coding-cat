import { useState } from "react";
import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/joy";
import { FormAnswers, SessionReflectionRecord } from "../../../types";
import { postSessionQuestions } from "../../../utils/postSessionQuestions";
import { preSessionQuestions } from "../../../utils/preSessionQuestions";

export default function SessionReflections({ sessions }: { sessions: SessionReflectionRecord[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (sessions.length === 0) {
    return <Typography>No session reflections yet!</Typography>;
  }

  return (
    <Stack gap={2} mb={2} sx={{ maxHeight: '100%', overflowY: 'auto', scrollbarWidth: "thin" }}>
      {sessions.map(s => {
        const isOpen = expandedId === s.id;
        const date = new Date(s.start_time).toLocaleDateString();
        const startTime = new Date(s.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const endTime = s.end_time
          ? new Date(s.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : null;

        return (
          <Card
            key={s.id}
            onClick={() => setExpandedId(isOpen ? null : s.id)}
            sx={{ cursor: 'pointer', width: '90%' }}
          >
            <CardContent>
              <Stack spacing={1}>
                {/* Header */}
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography level="h3">Session — {date}</Typography>
                  <Chip size="sm" variant="soft" color="neutral">
                    {startTime}{endTime ? ` → ${endTime}` : ''}
                  </Chip>
                </Stack>

                <Typography level="body-sm" sx={{ color: "#555" }}>
                  Goal: {s.exercise_goals} exercise{s.exercise_goals !== 1 ? 's' : ''}
                </Typography>

                {/* Expanded content */}
                {isOpen && (
                  <Stack spacing={3} mt={1}>
                    {/* Pre-session answers */}
                    {s.pre_session_reflection && (
                      <Box>
                        <Typography level="title-md" sx={{ mb: 1 }}>Before the session</Typography>
                        <Stack spacing={1}>
                          {preSessionQuestions.map(q => {
                            const answer = (s.pre_session_reflection as FormAnswers)[q.id];
                            if (!answer || (Array.isArray(answer) && answer.length === 0) || answer === "") return null;
                            return (
                              <Box key={q.id}>
                                <Typography level="body-xs" sx={{ color: "#777" }}>{q.text}</Typography>
                                <Typography level="body-sm">
                                  {Array.isArray(answer) ? answer.join(", ") : String(answer)}
                                </Typography>
                              </Box>
                            );
                          })}
                        </Stack>
                      </Box>
                    )}

                    {/* Post-session answers */}
                    {s.post_session_reflection && (
                      <Box>
                        <Typography level="title-md" sx={{ mb: 1 }}>After the session</Typography>
                        <Stack spacing={1}>
                          {postSessionQuestions.map(q => {
                            const answer = (s.post_session_reflection as FormAnswers)[q.id];
                            if (!answer || (Array.isArray(answer) && answer.length === 0) || answer === "") return null;
                            return (
                              <Box key={q.id}>
                                <Typography level="body-xs" sx={{ color: "#777" }}>{q.text}</Typography>
                                <Typography level="body-sm">
                                  {Array.isArray(answer) ? answer.join(", ") : String(answer)}
                                </Typography>
                              </Box>
                            );
                          })}
                        </Stack>
                      </Box>
                    )}
                  </Stack>
                )}
              </Stack>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
}