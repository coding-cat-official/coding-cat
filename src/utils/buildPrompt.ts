import type { MessageCreateParamsNonStreaming } from "@anthropic-ai/sdk/resources/messages";

type ProblemMeta = {
  name: string;
  title: string;
  category: string;
  question_type: string;
  difficulty: string;
  author: string;
};

// Expanded Report type to safely access the test data for formatting
type Report = { 
  equal: boolean; 
  input?: any; 
  expected?: any; 
  actual?: any; 
  [key: string]: any 
};

export type BuildPromptInput = {
  meta: ProblemMeta;
  description: string;
  io: any[];
  starter: string;
  code: string;
  testReport: Report[];
};

export function buildPrompt(
  input: BuildPromptInput
): Pick<MessageCreateParamsNonStreaming, "system" | "messages" | "max_tokens"> {
  const allTestsPassed = input.testReport.every((r) => r.equal);

  // 1. Format the Test Results dynamically
  // Transforms the array of test objects into a clean, readable text block
  const formattedTestResults = input.testReport
    .map((test, index) => {
      const status = test.equal ? "✅ PASS" : "❌ FAIL";
      // Fallback to JSON.stringify in case the backend sends complex objects
      return `Test ${index + 1} [${status}] | Input: ${JSON.stringify(test.input ?? "")} | Expected: ${JSON.stringify(test.expected ?? "")} | Actual: ${JSON.stringify(test.actual ?? "")}`;
    })
    .join("\n");

  // 2. System Prompt (Role & Ground Rules)
  // Check if it's a haystack problem and append the specific rule if it is.
  const haystackInstruction = input.meta.question_type === "haystack"
    ? "\n\nCRITICAL: This is a 'haystack' problem where a CS concept is hidden inside a story. Your hints MUST help the student recognize the underlying algorithm or data structure without explicitly naming it or solving it for them."
    : "";

  const systemPrompt = [
    {
      type: "text" as const,
      text: `You are an expert Python tutor helping a student.
Explain what the student should inspect next by asking probing questions, no more than 4 questions. Prefer Socratic hints over direct fixes. Do not provide the final solution or corrected code blocks. Return your answer in clean Markdown.${haystackInstruction}`,
      cache_control: { type: "ephemeral" as const },
    },
  ];

  // 3. Static Problem Context Block
  // Applying the cache marker here saves tokens for the static instructions
  const problemContextBlock = {
    type: "text" as const,
    text: `Analyze this specific function: ${input.meta.name}.

=== EXERCISE INSTRUCTIONS ===
${input.description}`,
    cache_control: { type: "ephemeral" as const },
  };

  // 4. Branching Instructions
  // Adapts your instructions depending on if they are failing tests or if they just need code review
  let specificInstructions = "";
  if (allTestsPassed) {
    specificInstructions = "The student passed all tests! Ask a probing question about how they might optimize their time/space complexity or improve code style.";
  } else {
    specificInstructions = "Use the provided test results to guide your hints, focusing the student's attention on specific inputs that caused their code to fail.";
  }

  // 5. Dynamic Student Data Block
  const studentContextBlock = {
    type: "text" as const,
    text: `=== TEST RESULTS (INPUT, EXPECTED OUTPUT, ACTUAL OUTPUT) ===
${formattedTestResults}

=== STUDENT ATTEMPT ===
${input.code}

${specificInstructions}`,
  };

  return {
    system: systemPrompt,
    messages: [
      {
        role: "user",
        // Anthropic processes these array items sequentially
        content: [problemContextBlock, studentContextBlock],
      },
    ],
    max_tokens: 400,
  };
}