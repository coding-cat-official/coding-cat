export const preSessionQuestions = [
    {
        question: "How do you feel after today's session?",
        type: "checkbox",
        options: [
            "Neutral",
            "Happy",
            "Curious",
            "Excited",
            "Calm",
            "Tired",
            "Confused",
            "Overwhelmed",
            "Frustrated",
            "Stressed out"
        ],
        category: "mood",
        randomizeable: false,
        relies_on: "mood"
    },
    {
        question: "You were able to complete your goals. What helped you be so successful today?",
        type: "text",
        category: "goals",
        randomizeable: false,
        relies_on: "goals"
    },
    {
        question: "Even if you didn't complete all you set out to do, you worked hard. What slowed you down most and how can you better prepare for the next session?",
        type: "text",
        category: "goals",
        randomizeable: false,
        relies_on: "goals"
    },
    {
        question: "Do you think you planned your session according to your level of focus and your mental state?",
        type: "radio",
        options: [
            "Yes",
            "No"
        ],
        category: "goals",
        randomizeable: false,
        relies_on: "focus"
    },
    {
        question: "Choose one of the exercises you completed today.",
        type: "text",
        category: "debugging",
        randomizeable: false
    },
    {
        question: "Which tools have you used to solve this problem? Did you use any of the tools/steps you've mentioned before the session? (Answer this in 2-3 sentences)",
        type: "text",
        category: "debugging",
        randomizeable: false,
        relies_on: "debugging"
    },
    {
        question: "Among the distractions you named at the start of the session, did any of them happen?",
        type: "radio",
        options: [
            "Yes",
            "No"
        ],
        category: "distractions",
        randomizeable: false,
        relies_on: "distractions"
    },
    {
        question: "What would you change to manage them better next time? (Answer this question in 1-2 sentences)",
        type: "text",
        category: "distractions",
        randomizeable: false
    },
    {
        question: "What strategy helped you stay focused and make progress the most? If nothing really worked, write down one strategy you can try next time.",
        type: "text",
        category: "summary",
        randomizeable: false
    },
]