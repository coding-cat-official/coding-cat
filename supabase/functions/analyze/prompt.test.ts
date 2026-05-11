// supabase/functions/analyze/prompt.test.ts

import { assertEquals, assertStringIncludes, assertFalse } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { FIXTURES, generateAttempt } from "./fixtures.ts";
// Importing from the real implementation
import { buildPrompt } from "./prompt.ts"; 
import { callLLM, makeAnthropic } from "./llm.ts";

/**
 * HELPER: Extracts text from Anthropic content blocks.
 * The real buildPrompt uses arrays of objects for caching and formatting.
 */
function getText(content: any): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    // Join all text blocks together
    return content.map((block) => (typeof block === "string" ? block : block.text || "")).join("\n");
  }
  return "";
}

// ==========================================
// 1. UNIT TESTS (Fast, Deterministic)
// ==========================================

Deno.test("Unit - buildPrompt formats a failing attempt correctly", () => {
  const attempt = generateAttempt(FIXTURES.coding_first_two, false);
  const prompt = buildPrompt(attempt);

  const systemText = getText(prompt.system);
  assertStringIncludes(systemText, "Do not provide the final solution");
  
  const userMessage = getText(prompt.messages[0].content);
  
  // Match the real implementation's identifiers:
  // It uses "Analyze this specific function: [name]" instead of "Problem: [title]"
  assertStringIncludes(userMessage, "Analyze this specific function: first_two");
  assertStringIncludes(userMessage, "=== TEST RESULTS");
});

Deno.test("Unit - buildPrompt formats a passing attempt correctly", () => {
  const attempt = generateAttempt(FIXTURES.haystack_birthday, true);
  const prompt = buildPrompt(attempt);

  const userMessage = getText(prompt.messages[0].content);
  // Match the real implementation: "The student passed all tests!"
  assertStringIncludes(userMessage, "The student passed all tests!");
});

Deno.test("Unit - buildPrompt applies cache markers", () => {
  const attempt = generateAttempt(FIXTURES.coding_first_two, false);
  const prompt = buildPrompt(attempt);

  // Check system prompt cache marker
  const systemPrompt = prompt.system as any[];
  assertEquals(systemPrompt[0].cache_control?.type, "ephemeral", "Cache marker missing from system prompt");

  // Check user message context block cache marker
  const userContent = prompt.messages[0].content as any[];
  assertEquals(userContent[0].cache_control?.type, "ephemeral", "Cache marker missing from problem context block");
});

Deno.test("Unit - buildPrompt handles haystack problems correctly", () => {
  const haystackAttempt = generateAttempt(FIXTURES.haystack_birthday, false);
  const prompt = buildPrompt(haystackAttempt);
  
  const systemText = getText(prompt.system);
  assertStringIncludes(systemText, "CRITICAL: This is a 'haystack' problem");
});

Deno.test("Unit - buildPrompt returns correct max_tokens", () => {
  const attempt = generateAttempt(FIXTURES.coding_first_two, true);
  const prompt = buildPrompt(attempt);
  assertEquals(prompt.max_tokens, 400);
});

// ==========================================
// 2. HARNESS VERIFICATION TESTS
// ==========================================

function assertValidResponse(responseText: string, fixture: any, isPassing: boolean) {
  assertEquals(responseText.length < 1500, true, "Response exceeded length cap.");
  assertEquals(responseText.length > 20, true, "Response is too short.");
  
  assertFalse(
    responseText.includes(fixture.solutionCode), 
    `FAILURE: LLM leaked solution ('${fixture.solutionCode}')`
  );

  if (!isPassing) {
    const codeBlockMatch = responseText.match(/```python[\s\S]*?```/g);
    if (codeBlockMatch) {
      for (const block of codeBlockMatch) {
        assertFalse(block.includes(fixture.solutionCode), "FAILURE: LLM provided code correction.");
      }
    }
  }
}

Deno.test("Unit - Eval assertions catch solution leakage", () => {
  const mockLeakingResponse = "Here is the answer: str[:2] !!";
  let didThrow = false;
  try {
    assertValidResponse(mockLeakingResponse, FIXTURES.coding_first_two, false);
  } catch {
    didThrow = true;
  }
  assertEquals(didThrow, true);
});

// ==========================================
// 3. EVAL TESTS (Slow, Real LLM Calls)
// ==========================================

const isEval = Deno.env.get("DENO_ENV") === "eval";

if (isEval) {
  const anthropic = makeAnthropic();
  const MODEL = "claude-haiku-4-5-20251001"; 

  for (const [key, fixture] of Object.entries(FIXTURES)) {
    for (const isPassing of [true, false]) {
      Deno.test(`Eval [${isPassing ? 'PASS' : 'FAIL'}] - ${key}`, async () => {
        const attempt = generateAttempt(fixture, isPassing);
        const promptParams = buildPrompt(attempt);
        
        // Use 'as any' because callLLM expects strict PromptParams
        const { text: responseText } = await callLLM(anthropic, MODEL, promptParams as any);
        
        assertValidResponse(responseText, fixture, isPassing);
      });
    }
  }
}