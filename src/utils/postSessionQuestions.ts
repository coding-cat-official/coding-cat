import { Question } from "../types";

export const postSessionQuestions = [
    {
        id: "mood-1",
        text: "How do you feel after today's session?",
        type: "checkbox",
        options: [
            { label: "Neutral", value: "neutral" },
            { label: "Happy", value: "happy" },
            { label: "Curious", value: "curious" },
            { label: "Excited", value: "excited" },
            { label: "Calm", value: "calm" },
            { label: "Tired", value: "tired" },
            { label: "Confused", value: "confused" },
            { label: "Overwhelmed", value: "overwhelmed" },
            { label: "Frustrated", value: "frustrated" },
            { label: "Stressed out", value: "stressed" }
        ],
        category: "mood",
        randomizeable: false,
        relies_on: "mood"
    },
    {
        id: "goals-1",
        text: "You were able to complete your goals. What helped you be so successful today?",
        type: "textarea",
        category: "goals",
        randomizeable: false,
        relies_on: "goals"
    },
    {
        id: "goals-2",
        text: "Even if you didn't complete all you set out to do, you worked hard. What slowed you down most and how can you better prepare for the next session?",
        type: "textarea",
        category: "goals",
        randomizeable: false,
        relies_on: "goals"
    },
    {
        id: "goals-3",
        text: "Do you think you planned your session according to your level of focus and your mental state?",
        type: "radio",
        options: [
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" }
        ],
        category: "goals",
        randomizeable: false,
        relies_on: "focus"
    },
    {
        id: "debugging-1",
        text: "Choose one of the exercises you completed today.",
        type: "textarea",
        category: "debugging",
        randomizeable: false
    },
    {
        id: "debugging-2",
        text: "Which tools have you used to solve this problem? Did you use any of the tools/steps you've mentioned before the session? (Answer this in 2-3 sentences)",
        type: "textarea",
        category: "debugging",
        randomizeable: false,
        relies_on: "debugging"
    },
    {
        id: "distractions-1",
        text: "Among the distractions you named at the start of the session, did any of them happen?",
        type: "radio",
        options: [
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" }
        ],
        category: "distractions",
        randomizeable: false,
        relies_on: "distractions"
    },
    {
        id: "distractions-2",
        text: "What would you change to manage them better next time? (Answer this question in 1-2 sentences)",
        type: "textarea",
        category: "distractions",
        randomizeable: false
    },
    {
        id: "summary-1",
        text: "What strategy helped you stay focused and make progress the most? If nothing really worked, write down one strategy you can try next time.",
        type: "textarea",
        category: "summary",
        randomizeable: false
    },
] satisfies Question[];