import { useState, useEffect, useCallback } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Box, Button, Checkbox, Chip, FormLabel, Radio, RadioGroup, Stack, Textarea, Typography } from "@mui/joy";
import { Question, FormAnswers } from "../types";
import { preSessionQuestions } from "../utils/preSessionQuestions";
import { postSessionQuestions } from "../utils/postSessionQuestions";
import { supabase } from "../supabaseClient";
import type { Session } from "@supabase/supabase-js";

/**
 * 
 */
interface SessionProblem {
  problem_title: string;
  completed: boolean;
}

/**
 * This component is used in the post-session reflection of the session . It will fetch a list of questions from a json file 
 * and display them to the user. 
 */
export default function PostSessionForm() {
  const navigate = useNavigate();
  const { session } = useOutletContext<{ session: Session | null }>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<FormAnswers>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [preSessionReflection, setPreSessionReflection] = useState<FormAnswers | null>(null);
  const [sessionSuccessful, setSessionSuccessful] = useState<boolean | null>(null);
  const [sessionProblems, setSessionProblems] = useState<SessionProblem[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const fetchSessionData = useCallback(async (profileId: string) => {
    try{
      const { data, error: fetchError } = await supabase
        .from("sessions")
        .select("id, start_time, exercise_goals, pre_session_reflection")
        .eq("profile_id", profileId)
        .order("start_time", { ascending: false })
        .limit(1)
        .single();

      if (fetchError || !data) {
        console.warn("Could not fetch session data:", fetchError);
        return;
      }

      setSessionId(data.id);

      //If we successfully got data from the database and it contains pre_session_reflection 
      //then extract it and store it in state so we can use it later.
      if (data && typeof data === 'object' && "pre_session_reflection" in data) {
        const reflection = data.pre_session_reflection;
        if (reflection) {
          setPreSessionReflection(reflection as FormAnswers);
        }
      }

      //fetch all submissions made during the session, so basically completed AND attempted problems
      await fetchSessionSubmissions(profileId, data.start_time, data.exercise_goals);

    } catch (err) {
      console.warn("Error fetching session data:", err);
    }
  }, []);

  const fetchSessionSubmissions = async ( profileId: string, startTime: string, exerciseGoals: number) => {
    const { data, error: fetchError } = await supabase
      .from("submissions")
      .select("problem_title, passed_tests, total_tests")
      .eq("profile_id", profileId)
      .gte("submitted_at", startTime)
      .order("submitted_at", { ascending: true });

    if (fetchError || !data){
      console.warn("Could not fetch session submissions:", fetchError);
      return;
    }

    //group by the poblem titles and track if there's any successful submission (all tests passed) for each problem
    const problemMap = new Map<string, boolean>();
    data.forEach(submission => {
      const alreadyCompleted = problemMap.get(submission.problem_title) ?? false;
      const submissionPassed = submission.passed_tests === submission.total_tests && submission.total_tests > 0;
      problemMap.set(submission.problem_title, alreadyCompleted || submissionPassed);
    });

    const problems: SessionProblem[] = Array.from(problemMap.entries()).map(
      ([problem_title, completed]) => ({ problem_title, completed })
    );

    setSessionProblems(problems);

    //calculate or determine if the session was successful 
    const completedCount = problems.filter(p => p.completed).length;
    setSessionSuccessful(completedCount >= exerciseGoals);
  }

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);

      let questionsData: Question[] = selectQuestionsByCategory(postSessionQuestions);
      
      setQuestions(questionsData);
      
      // Initialize empty answers for all questions
      const initialAnswers: FormAnswers = {};
      questionsData.forEach(q => {
        initialAnswers[q.id] = q.type === "checkbox" ? [] : "";
      });
      setAnswers(initialAnswers);
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
    if (session?.user) {
      fetchSessionData(session.user.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, fetchSessionData, fetchQuestions]);

  function selectQuestionsByCategory(questionsData: Question[]): Question[] {
    const grouped: Record<string, Question[]> = {};

    // Group by category
    questionsData.forEach(q => {
      if (!grouped[q.category]) {
        grouped[q.category] = [];
      }
      grouped[q.category].push(q);
    });

    const result: Question[] = [];

    Object.values(grouped).forEach(group => {
      const randomizeable = group.filter(q => q.randomizeable);
      const nonRandomizeable = group.filter(q => !q.randomizeable);

      // Always include non-randomizable questions
      result.push(...nonRandomizeable);

      // If there are randomizable ones, pick ONE
      if (randomizeable.length > 0) {
        const randomIndex = Math.floor(Math.random() * randomizeable.length);
        result.push(randomizeable[randomIndex]);
      }
    });

    return result;
  }

  //choose goal question based on a successful or struggling session
  const visiblequestions = questions.filter(q => {
    if (q.condition === "success") return sessionSuccessful === true;
    if (q.condition === "struggle") return sessionSuccessful === false;
    return true;
  });

  const handleAnswerChange = (questionId: string, value: string | string[] | number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleCheckboxChange = (questionId: string, optionValue: string) => {
    setAnswers(prev => {

      //ensure currentValues is always an array
      const currentValues = Array.isArray(prev[questionId])
      ? (prev[questionId] as string[])
      : [];
      
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter(v => v !== optionValue)
        : [...currentValues, optionValue];
      return { ...prev, [questionId]: newValues };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      setError("User session not found. Please log in.");
      return;
    }

    try {
      const { error: dbError } = await supabase
        .from("sessions")
        .update({
          end_time: new Date().toISOString(),
          "post_session_reflection": answers,
        })
        .eq("profile_id", session.user.id)
        .eq("id", sessionId);
      if (dbError) {
        throw dbError;
      }
      console.log("Form answers submitted:", answers);
      setError(null);
      navigate("/", {
        state: {
          fromPostSession: true
        }
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error submitting form:", err);
    }
  };

  const getReliesOnDisplay = (question: Question) => {
    if (!question.relies_on || !preSessionReflection) return null;

    const relatedQuestions = preSessionQuestions.filter(
        q => q.category === question.relies_on
    );
    return relatedQuestions.map(q => {
      const raw = preSessionReflection[q.id];

      if (!raw) return null;

      const value = Array.isArray(raw)? raw.join(", "): String(raw);

      return {label: q.text, value};
    }).filter((item): item is { label: string; value: string } => item !== null);
  };

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case "problem_picker":
        return (
          <Stack spacing={1}>
            {sessionProblems.length === 0 && (
              <Typography level="body-sm" sx={{ color: "#888" }}>
                No problems worked on this session.
              </Typography>
            )}
            {sessionProblems.map(p => {
              const isSelected = answers[question.id] === p.problem_title;
              return (
                <Box
                  key={p.problem_title}
                  onClick={() => handleAnswerChange(question.id, p.problem_title)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    p: 1.5,
                    borderRadius: "10px",
                    border: isSelected ? "2px solid #333" : "2px solid transparent",
                    backgroundColor: p.completed ? "#d4ff99" : "#ffe57d",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    "&:hover": {backgroundColor: "#d4ff99"}
                  }}
                >
                  <Typography level="body-sm" sx={{ fontSize: "18px" }}>
                    {p.completed ? "✅" : "🔄"}
                  </Typography>
                  <Typography level="body-sm" sx={{ fontWeight: isSelected ? 700 : 400 }}>
                    {p.problem_title}
                  </Typography>
                  <Chip
                    size="sm"
                    variant="soft"
                    color={p.completed ? "success" : "warning"}
                    sx={{ ml: "auto" }}
                  >
                    {p.completed ? "Completed" : "Attempted"}
                  </Chip>
                </Box>
              );
            })}
          </Stack>
        )
      case "radio":
        const numOptions = question.options?.length || 0;
        const columns = numOptions > 5 ? "repeat(5, 1fr)" : "1fr 1fr";
        
        return (
          <RadioGroup
            value={answers[question.id] || ""}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            sx={{ display: "grid", gridTemplateColumns: columns, gap: 2 }}
          >
            {question.options?.map(option => (
              <FormLabel key={option.value} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                {option.label}
                <Radio value={option.value} />
              </FormLabel>
            ))}
          </RadioGroup>
        );

      case "checkbox":
        return (
          <Stack sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            {question.options?.map(option => (
              <FormLabel key={option.value} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Checkbox
                  checked={(answers[question.id] as string[]).includes(option.value)}
                  onChange={() => handleCheckboxChange(question.id, option.value)}
                />
                {option.label}
              </FormLabel>
            ))}
          </Stack>
        );

      case "number":
        return (
          <input
            type="number"
            value={answers[question.id] || 0}
            onChange={(e) => handleAnswerChange(question.id, parseInt(e.target.value) || 0)}
            min={question.min || 0}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "2px solid black",
              fontSize: "16px",
            }}
          />
        );

      case "textarea":
        return (
          <Textarea
            value={answers[question.id] || ""}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder={question.placeholder || "Write your answer here"}
            minRows={4}
            sx={{
              flex: 1,
              minWidth: "300px",
              backgroundColor: "#ffe57d",
              borderRadius: "8px",
              border: "2px solid black",
            }}
          />
        );

      default:
        return null;
    }
  };

  if (loading) return <Box sx={{ padding: 4 }}><Typography>Loading questions...</Typography></Box>;
  if (error) return <Box sx={{ padding: 4 }}><Typography color="danger">{error}</Typography></Box>;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingX: 4,
        paddingY: 2,
        minHeight: "100%",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          backgroundColor: "#d4ff99",
          borderRadius: "24px",
          padding: "40px",
          width: "100%",
          maxWidth: "900px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          gap: 3,
          overflowY: "auto",
        }}
      >
      <Typography level="h1" sx={{ fontWeight: "bold" }}>Post-session reflection</Typography>

      {/* Scrollable Questions Container */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          paddingRight: "12px",
          "&::-webkit-scrollbar": {
            width: "12px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "rgba(0,0,0,0.1)",
            borderRadius: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,0.3)",
            borderRadius: "6px",
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.5)",
            },
          },
        }}
      >
        <Stack spacing={4}>
          {visiblequestions.map(question => {
            const reliesOnDisplay = getReliesOnDisplay(question);
            return (
              <Box key={question.id} sx={{ display: "flex", gap: 4, alignItems: "flex-start" }}>
                <Box sx={{ backgroundColor: "#ffeb9a", padding: "12px 16px", borderRadius: "8px", flex: 0.4, minWidth: "200px" }}>
                  {reliesOnDisplay && (
                    <Box sx={{ marginBottom: 2 }}>
                      <Typography level="body-sm" sx={{ fontWeight: "bold", color: "#333" }}>
                        {reliesOnDisplay && (
                            <Box sx={{ marginBottom: 2 }}>
                                <Typography level="body-sm" sx={{ fontWeight: "bold", mb: 1 }}>
                                Earlier in this session:
                                </Typography>
                                {reliesOnDisplay.map((item, index) => (
                                <Box key={index} sx={{ mb: 1 }}>
                                    <Typography level="body-xs" sx={{ color: "#555" }}>{item.label} </Typography>
                                    <Typography level="body-sm" sx={{ fontWeight: 500 }}>{item.value}</Typography>
                                </Box>
                                ))}
                            </Box>
                            )}
                      </Typography>
                    </Box>
                  )}
                  <Typography level="body-md" sx={{ fontWeight: 500 }}>
                    {question.text}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  {renderQuestion(question)}
                </Box>
              </Box>
            );
          })}
        </Stack>
      </Box>

      {/* Submit Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          type="submit"
          sx={{
            backgroundColor: "#ffde59",
            paddingX: "32px",
            paddingY: "12px",
            borderRadius: "24px",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          Submit
        </Button>
      </Box>
    </Box>
    </Box>
  );
}