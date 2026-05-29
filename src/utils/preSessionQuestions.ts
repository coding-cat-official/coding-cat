import { Question } from "../types";

export const preSessionQuestions = [
    {
        id: "mood-1",
        text: "How are you feeling as you begin your session?",
        type: "checkbox",
        options: [
            { label: "Neutral", value: "neutral" },
            { label: "Happy", value: "happy" },
            { label: "Curious", value: "curious" },
            { label: "Productive", value: "productive" },
            { label: "Excited", value: "excited" },
            { label: "Calm", value: "calm" },
            { label: "Tired", value: "tired" },
            { label: "Confused", value: "confused" },
            { label: "Overwhelmed", value: "overwhelmed" },
            { label: "Frustrated", value: "frustrated" },
            { label: "Stressed out", value: "stressed" }
        ],
        category: "mood",
        randomizeable: true
    },
    {
        id: "mood-2",
        text: "How focused are you feeling today on a scale of 1-10? It’s okay to not always feel focused! Keep in mind this rating as you plan today’s study session.",
        type: "radio",
        options: Array.from({ length: 10 }, (_, i) => ({
            label: String(i + 1),
            value: String(i + 1)
        })),
        category: "mood",
        randomizeable: true
    },
    {
        id: "focus-1",
        text: "What do you currently need to support your focus and energy?",
        type: "checkbox",
        options: [
            { label: "Water break", value: "water-break" },
            { label: "Take a walk", value: "walk" },
            { label: "Rest a little", value: "rest" },
            { label: "Eat something", value: "eat" },
            { label: "Music", value: "music" },
        ],
        category: "focus",
        randomizeable: false
    },
    {
        id: "goals-1",
        text: "How much time (in minutes) are you going to spend on CodingCat this session?",
        type: "number",
        min: 10,
        max: 180,
        category: "goals",
        randomizeable: false
    },
    {
        id: "goals-2",
        text: "How many exercises do you want to work on this session?",
        type: "number",
        min: 1,
        max: 20,
        category: "goals",
        randomizeable: false
    },
    {
        id: "goals-3",
        text: "Which categories of exercises do you want to target this session?",
        type: "checkbox",
        options: [
            { label: "Fundamentals", value: "fundamentals" },
            { label: "Logic", value: "logic" },
            { label: "List-1", value: "list-1" },
            { label: "String-1", value: "string-1" },
            { label: "List-2", value: "list-2" },
            { label: "String-2", value: "string-2" },
            { label: "Level-3", value: "level-3" }
        ],
        category: "goals",
        randomizeable: false
    },
    {
        id: "debugging-1",
        text: "Name 3 things you can do when you encounter bugs today before going to the teacher for help.",
        type: "textarea",
        category: "debugging",
        randomizeable: false
    },
    {
        id: "distractions-1",
        text: "Which of the following do you think might be a distraction to you during this study session?",
        type: "checkbox",
        options: [
            { label: "Phone", value: "phone" },
            { label: "Peers", value: "peers" },
            { label: "Hunger", value: "hunger" },
            { label: "Thirst", value: "thirst" },
            { label: "Bathroom", value: "bathroom" },
            { label: "Stress", value: "stress" },
            { label: "Boredom", value: "boredom" },
            { label: "Noise", value: "noise" },
            { label: "Daydreaming", value: "daydreaming" },
            { label: "Fatigue", value: "fatigue" },
            { label: "Lack of motivation", value: "motivation" },
            { label: "Conditions in the lab room", value: "conditions" },
            { label: "Other", value: "other" }
        ],
        category: "distractions",
        randomizeable: false
    },
    {
        id: "distractions-2",
        text: "In 1-2 sentences, what kind of strategy can you use to manage those distractions?",
        type: "textarea",
        category: "distractions",
        randomizeable: false
    },
] satisfies Question[];