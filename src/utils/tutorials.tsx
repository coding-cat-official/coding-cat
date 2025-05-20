import categories from '../assets/categories.png';
import tabPaw from '../assets/tab-paw.png';
import codingQuestion from '../assets/coding-question.png';
import resultTable from '../assets/result-table.png';
import haystackQuestiom from '../assets/haystack-question.png';
import mutationQuestion from '../assets/mutation-question.png';
import bongoCoding from '../assets/bongo-coding.png';

export const welcomePageTutorial = [
  {
    content: () => (
      <>
        <h1>Welcome to CODING CAT 😸</h1>
        <p>Here, you will choose the number of problems that Eric will require you to solve this semester</p>
        <h3>╮(╯▽╰)╭</h3>
      </>
    )
  },
  {
    content: () => (
      <>
        <h2>To navigate to exercises 📚</h2>
        <p>Click on the bar on your left</p>
        <section style={{ display:'flex', gap: '10px'}}>
          <img src={tabPaw} alt="tab white cat paw navbar" height="50px" width="50px" style={{ borderRadius:"10px"}}/>
          <h3>👈(ﾟヮﾟ) </h3>
        </section>
      </>
    )
  },
  {
    content: () => (
      <>
        <h2>Categories 📃</h2>
        <p>All problems are separated by category but you don't need to worrry about their meaning for now!</p>
        <img src={categories} alt="Different categories" height="170px" width="200px"/>
      </>
    )
  },
  {
    content: () => (
      <>
        <h2>Coding 💻</h2>
        <p>Read the description, write a function, and make sure to return a value.</p>
        <img src={codingQuestion} alt="coding question" height="200px"/>
      </>
    )
  },
  {
    content: () => (
      <>
        <h2>Coding 💻</h2>
        <p>When you press Run, your code will be executed and its output will be compared to the expected output.</p>
        <section style={{ display:"flex", gap:"30px", alignItems: "center" }}>
          <p style={{ textAlign: "left"}}>
            <b>Input:</b> The data provided to your function.<br/>
            <b>Expected output:</b> The correct result your function should return<br/>
            <b>Output:</b> What your function really returns with the input
          </p>
          <img src={resultTable} alt="Coding Question Result Table" height="200px"/>
        </section>
      </>
    )
  },
  {
    content: () => (
      <>
        <h2>Haystack 🐴</h2>
        <p>It's a coding question disguised in jargon~</p>
        <span>Find the important info 🔍</span>
        <img src={haystackQuestiom} alt="Haystack Question" height="180px"/>
      </>
    )
  },
  {
    content: () => (
      <>
        <h2>Mutation Testing 🧟</h2>
        <p>You will learn more about this later in the course...</p>
        <span>but essentially, it involves making small changes to catch mutations</span>
        <img src={mutationQuestion} alt="Mutation Question" height="200px"/>
      </>
    )
  },
  {
    content: () => (
      <>
        <h2>Quick Tip ❕</h2>
        <h3>Press "Alt" + "Enter" to Run your code <i>fast</i> 🏃💨</h3>
      </>
    )
  },
  {
    content: () => (
      <>
        <h2>Let's choose a problem!</h2>
        <img src={bongoCoding} alt="Bongo Coding" height="200px"/>
        
      </>
    ),
  }
];


export const mutationPageTutorial = [
    {
      selector: 'table',
      content: () => (
        <>
          <h2>Mutations? 🤔</h2>
          <p>Your goal is to find out how a function could go wrong by visualizing the function and trying out different inputs.</p>
        </>
      ),
      position: "top",
      stepInteraction: false
    },
    {
      selector: '.input',
      content: 'Write your inputs here',
      position: "top",
    },
    {
      selector: '.mutations',
      content: () => (
        <>
          <h3>WOAH MUTATIONS!</h3>
          <p>These will either show ✅ or ❌ if you found a mutant or not.</p>
        </>
      ),
      position:"top"
    },
    {
      selector: '.mutations-th',
      content: () => (
        <>
          <h3>To score points...</h3>
          <p>One mutation needs to have a ✅ <b>AND</b> ❌.</p>
          <table style={{border: "1px solid black", borderCollapse: "collapse"}}>
            <tr><td style={{border: "1px solid black", padding: "10px"}}><b>M1</b></td></tr>
            <tr><td style={{border: "1px solid black", padding: "10px"}}><b>✅</b></td></tr>
            <tr><td style={{border: "1px solid black", padding: "10px"}}><b>❌</b></td></tr>
          </table>
        </>
      ),
      position:"top"
    },
    {
      selector: '.outputs',
      content: () => (
        <>
          <h3>Make sure that the <u>solution's ouput</u> is the same as the <u>expected output</u></h3>
          <p>to gain points 📈🗿</p>
        </>
      ),
      position:"top"
    },
    {
      selector: '.input-box',
      content: () => (
        <>
          <h3>❕Note</h3>
          <p>Make sure to add <b>""</b> when it's a string and <b>[]</b> when it's an array</p>
          <h4>["calico", "void"]</h4>
        </>
      ),
      position: 'top'
    },
    {
      selector: '.add-mutation-button',
      content: () => (
        <>
          <h3>Click here if you ever run out of rows 🙀</h3>
        </>
      )
    },
    {
      selector: '.mutation-results',
      content: () => (
        <h4>This is your progress!👈(ﾟヮﾟ👈)</h4>
      )
    },
    {
      selector: "table",
      content: () => (
        <>
          <h2>Quick Tip ❕</h2>
          <h3>Press "Alt" + "Enter" to run your code <i>fast</i> 🏃💨</h3>
        </>
      )
    }

  ];