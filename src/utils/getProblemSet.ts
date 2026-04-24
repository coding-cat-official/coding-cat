/**
 * Here you define the different types of questions
 */
const questionTypeList = ["private-problems", "public-problems"];

/**
 * Depending on the REACT_APP_PROBLEM_SET, it returns am ESM module based off that ones
 * @returns ESM Module Import for the different problems
 */
async function chooseQuestionType() {
  const questionType = process.env.REACT_APP_PROBLEM_SET;

  if (questionTypeList.includes(questionType!)) {
    return (await import(`../${questionType}/problems.js`)).default;
  } else {
    throw Error("The env REACT_APP_PROBLEM_SET is incorrect or not set");
  }
}

export default chooseQuestionType;
