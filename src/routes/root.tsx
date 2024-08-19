import React, { useEffect, useState, ChangeEvent } from 'react' ;
import { Outlet, useLoaderData } from 'react-router';
import './root.css';
import problems from '../problems/problems';
import { Problem } from '../types';
import ProblemList from '../components/ProblemList';

export async function problemListLoader(): Promise<Problem[]> {
    return problems as Problem[];
}

function App() {
  const problems = useLoaderData() as Problem[];
  return <div id='app'>
  <ProblemList problems={problems} />
  <Outlet />
  </div>;
};

export default App;
