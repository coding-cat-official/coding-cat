import React, { useEffect, useState, ChangeEvent } from 'react' ;
import './root.css';
import problems from '../problems/problems';
import { Problem } from '../types';
import ProblemList from '../components/ProblemList';

export async function problemListLoader(): Promise<Problem[]> {
    return problems as Problem[];
}

function App() {
  return <ProblemList problems={problems}/>;
};

export default App;
