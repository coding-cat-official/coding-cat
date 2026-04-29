import { useEffect, useState, ChangeEvent, FormEvent } from "react";

type Question = {
  id: number;
  question: string;
  type: "radio" | "textarea" | "dropdown" | "checkbox";
  options?: string[];
};

type Answers = {
  [key: number]: string | string[];
};

export default function PostSession() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answers>({});

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch("/postSessionQuestions.json");
        const data: Question[] = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error("Failed to load questions:", error);
      }
    };

    loadQuestions();
  }, []);

  const handleChange = (id: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleCheckboxChange = (id: number, option: string) => {
    const current = (answers[id] as string[]) || [];

    const updated = current.includes(option)
      ? current.filter((item) => item !== option)
      : [...current, option];

    setAnswers((prev) => ({
      ...prev,
      [id]: updated,
    }));
  };

  const renderInput = (question: Question) => {
    switch (question.type) {
      case "radio":
        return question.options?.map((option) => (
          <label key={option} style={{ display: "block" }}>
            <input
              type="radio"
              name={String(question.id)}
              value={option}
              checked={answers[question.id] === option}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange(question.id, e.target.value)
              }
            />
            {option}
          </label>
        ));

      case "textarea":
        return (
          <textarea
            rows={4}
            cols={40}
            value={(answers[question.id] as string) || ""}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              handleChange(question.id, e.target.value)
            }
          />
        );

      case "dropdown":
        return (
          <select
            value={(answers[question.id] as string) || ""}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              handleChange(question.id, e.target.value)
            }
          >
            <option value="">Select</option>
            {question.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "checkbox":
        return question.options?.map((option) => (
          <label key={option} style={{ display: "block" }}>
            <input
              type="checkbox"
              checked={
                ((answers[question.id] as string[]) || []).includes(option)
              }
              onChange={() => handleCheckboxChange(question.id, option)}
            />
            {option}
          </label>
        ));

      default:
        return null;
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(answers);
  };

  return (
    <div>
      <h2>Post Session Reflection</h2>

      <form onSubmit={handleSubmit}>
        {questions.map((question) => (
          <div key={question.id} style={{ marginBottom: "20px" }}>
            <label>
              <strong>{question.question}</strong>
            </label>

            <div style={{ marginTop: "8px" }}>{renderInput(question)}</div>
          </div>
        ))}

        <button type="submit">Submit Reflection</button>
      </form>
    </div>
  );
}