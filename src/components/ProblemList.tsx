import React from 'react';
import { Link } from 'react-router-dom';

import { Problem } from '../types';

export interface ProblemListProps {
    problems: Problem[]
}

export default function ProblemList({ problems }: ProblemListProps) {
    const groupedProblems = problems.reduce<Record<string, Problem[]>>((acc, problem) => {
        const category = problem.meta.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(problem);
        return acc;
    }, {});

    return (
    <nav>
      <h1> Coding Cat Problems </h1>

      {Object.keys(groupedProblems).map((category) => (
          <div key={category}>
          <h3>{category}</h3>
            <ul>
        { (groupedProblems[category] as Problem[]).map(
            (p) => <li key={p.meta.name}>
                <Link to={`/problems/${p.meta.name}`}> {p.meta.title} </Link>
            </li>,
        )}
      </ul>
      </div>
      ))}
    </nav>);
}

