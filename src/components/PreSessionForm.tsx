import { useState } from "react";

/**
 * This component is meant to be used in the pre-session reflection 
 * step of the session flow. It will fetch a list of questions from a json file 
 * and display them to the user. The user can then answer the questions and 
 * submit their answers. Some questions will be randomized each time the component 
 * is rendered.
 * @returns 
 */
export default function PreSessionForm() {
    const [questions, setQuestions] = useState<string[]>([]);

    async function fetchQuestions(){

    }

    function randomizeQuestions(){

    }
    return(
        <div>
            <h3>Pre-Session Reflection</h3>
        </div>
    )
}