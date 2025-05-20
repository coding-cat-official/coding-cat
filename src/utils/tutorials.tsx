
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
        <h3>👈(ﾟヮﾟ) </h3>
      </>
    )
  },
  {
    content: () => (
      <>
        <h2>Problem Types 📃</h2>
        <span>Problems are categorized by type:</span>
        <p><b>Coding, haystack, and mutation</b></p>
        <p>[Image of the different tabs]</p>
      </>
    )
  },
  {
    content: () => (
      <>
        <h2>Coding 💻</h2>
        <p>Read the description, write a function, and make sure to return a value.</p>
        <p>[Image of a coding question]</p>
      </>
    )
  },
  {
    content: () => (
      <>
        <h2>Coding 💻</h2>
        <p>When you press "Run", your code will be executed and its output will be compared to the expected output.</p>
        <ul>
          <li><b>Input:</b> The data provided to your function.</li>
          <li><b>Expected output:</b> The correct result your function should return</li>
          <li><b>Output:</b> What your function really returns with the input</li>
        </ul>
        <p>[Image Results table]</p>
      </>
    )
  },
  {
    content: () => (
      <>
        <h2>Haystack 🐴</h2>
        <p>It's a coding question disguised in jargon~</p>
        <span>Find the important info 🔍</span>
        <p>[Image of a haystack question]</p>
      </>
    )
  },
  {
    content: () => (
      <>
        <h2>Mutation Testing 🧟</h2>
        <p>You will learn more about this later in the course...</p>
        <span>but essentially, it involves making small changes to catch mutations</span>
        <p>[Image of a mutation question]</p>
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
        <h2>Let's choose a problem! (๑•̀ㅂ•́)و✧</h2>
        <p>Explore and Have fun!</p>
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