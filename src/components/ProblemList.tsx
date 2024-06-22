import React from 'react';
import { Link } from 'react-router-dom';

import { Problem } from '../types';

export interface ProblemListProps {
    problems: Problem[]
}

export default function ProblemList({ problems }: ProblemListProps) {
    return <ul>
        { (problems as Problem[]).map(
            (p) => <li key={p.meta.name}>
                <Link to={`/problems/${p.meta.name}`}> {p.meta.title} </Link>
            </li>,
        )
        }
    </ul>;
}

