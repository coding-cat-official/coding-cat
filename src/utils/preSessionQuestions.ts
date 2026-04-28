export const preSessionQuestions = [
    {
        question: "How are you feeling as you begin your session?",
        type: "checkbox",
        options: [
            "Neutral",
            "Happy",
            "Curious",
            "Productive",
            "Excited",
            "Calm",
            "Tired",
            "Confused",
            "Overwhelmed",
            "Frustrated",
            "Stressed out"
        ],
        category: "mood",
        randomizeable: true
    },
    {
        question: "How focused are you feeling today on a scale of 1-10? It’s okay to not always feel focused! Keep in mind this rating as you plan today’s study session.",
        type: "radio",
        options: [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
        ],
        category: "mood",
        randomizeable: true
    },
    {
        question: "What do you currently need to support your focus and energy?",
        type: "checkbox",
        options: [
            "Water break",
            "Take a walk",
            "Rest a little",
            "Eat something",
            "Music",
        ],
        category: "focus",
        randomizeable: false
    },
    {
        question: "How much time (in minutes) are you going to spend on CodingCat this session?",
        type: "number",
        min: 10,
        max: 180,
        category: "goals",
        randomizeable: false
    },
    {
        question: "How many exercises do you want to work on this session?",
        type: "number",
        min: 1,
        max: 20,
        category: "goals",
        randomizeable: false
    },
    {
        question: "Which categories of exercises do you want to target this session?",
        type: "checkbox",
        options: [
            "Fundamentals",
            "Logic",
            "List-1",
            "String-1",
            "List-2",
            "String-2",
            "List-3",
            "String-3"
        ],
        category: "goals",
        randomizeable: false
    },
    {
        question: "Name 3 things you can do when you encounter bugs today before going to the teacher for help.",
        type: "text",
        category: "debugging",
        randomizeable: false
    },
    {
        question: "Which of the following do you think might be a distraction to you during this study session?",
        type: "checkbox",
        options: [
            "Phone",
            "Peers",
            "Hunger",
            "Thirst",
            "Bathroom",
            "Stress",
            "Boredom",
            "Noise",
            "Daydreaming",
            "Fatigue",
            "Lack of motivation",
            "Conditions in the lab room",
            "Other",
        ],
        category: "distractions",
        randomizeable: false
    },
    {
        question: "In 1-2 sentences, what kind of strategy can you use to manage those distractions?",
        type: "text",
        category: "distractions",
        randomizeable: false
    },
]