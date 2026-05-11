// supabase/functions/analyze/fixtures.ts

export const FIXTURES = {
  coding_first_two: {
    meta: { name: "first_two", title: "First Two", category: "string_1", question_type: ["coding"], difficulty: "easy", author: "eric" },
    description: "Given a string, return the string made of its first two chars, so the String 'Hello' yields 'He'.",
    io: [],
    starter: "def first_two(str):\n  pass",
    solutionCode: "str[:2]", 
  },
  coding_makes_ten: {
    meta: { name: "makes_ten", title: "Makes Ten", category: "fundamentals", question_type: ["coding"], difficulty: "easy", author: "eric" },
    description: "Given 2 ints, a and b, return True if one if them is 10 or if their sum is 10.",
    io: [],
    starter: "def makes_ten(a, b):\n  pass",
    solutionCode: "a == 10 or b == 10 or a + b == 10",
  },
  coding_is_even: {
    meta: { name: "is_even", title: "Is Even", category: "fundamentals", question_type: ["coding"], difficulty: "easy", author: "eric" },
    description: "Return True if the given non-negative number is even.",
    io: [],
    starter: "def is_even(n):\n  pass",
    solutionCode: "n % 2 == 0",
  },
  coding_double_char: {
    meta: { name: "double_char", title: "Double Char", category: "string_2", question_type: ["coding"], difficulty: "medium", author: "eric" },
    description: "Given a string, return a string where for every char in the original, there are two chars.",
    io: [],
    starter: "def double_char(str):\n  pass",
    solutionCode: "for char in str", 
  },
  haystack_birthday: {
    meta: { name: "birthday_card_mix_up", title: "Birthday Card Mix Up", category: "haystack", question_type: ["haystack"], difficulty: "medium", author: "anon" },
    description: "You have a stack of birthday cards sorted alphabetically by name. Write an algorithm to find Grandma's card efficiently.",
    io: [],
    starter: "def find_card(cards):\n  pass",
    solutionCode: "binary search", 
  },
  haystack_sensor: {
    meta: { name: "sensor-anomalies", title: "Sensor Anomalies", category: "haystack", question_type: ["haystack"], difficulty: "hard", author: "anon" },
    description: "A weather station is sending temperature data. One sensor is broken and sending massive outlier spikes. Filter out the noise.",
    io: [],
    starter: "def filter_noise(readings):\n  pass",
    solutionCode: "median", 
  }
};

// Helper stays the same
export const generateAttempt = (fixture: any, isPassing: boolean) => ({
  meta: fixture.meta,
  description: fixture.description,
  io: fixture.io,
  starter: fixture.starter,
  code: isPassing ? "def solution():\n  # Perfect code" : "def solution():\n  return 'wrong'",
  testReport: isPassing 
    ? [{ equal: true, input: ["test"], expected: "test", actual: "test" }]
    : [{ equal: false, input: ["test"], expected: "test", actual: "wrong" }]
});