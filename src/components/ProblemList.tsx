import { Problem } from '../types';

export default function ProblemList() {

}
interface ProblemListProps {
    problems: Problem[];
    activeProblem: string | null;
    closeDrawer: () => void;
}
function ProblemCategory({ problems, activeProblem, closeDrawer }: ProblemListProps){

  const categorized = problems.reduce<Record<string, Problem[]>>((acc, problem) => {
            const category = problem.meta.category;
            if (!acc[category]) acc[category] = [];
            acc[category].push(problem);
            return acc;
        }, {});

  return(
    <>
    </>
  );
}