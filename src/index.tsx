import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';

import App, { problemListLoader } from './routes/root';
import ProblemView, { problemLoader } from './routes/ProblemView';
import ErrorPage from './error';

import Auth from './routes/Auth'
import AccountWrapper from './routes/AccountWrapper';

function EmptyChild() {
  return <div>
    <p> Select a problem on the left to begin! </p>
  </div>;
}

const userId = window.location.pathname.split('/')[1];
const basename = userId ? `/${userId}` : '/';
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    loader: problemListLoader,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <EmptyChild />,
      },
      {
        path: "/problems/:problemName",
        element: <ProblemView />,
        loader: problemLoader,
      },
      {
        path: "signin",
        element: <Auth />
      },
      {
        path: "profile",
        element: <AccountWrapper />
      }
    ],
  },
],
{
  basename: basename,
}
);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <CssVarsProvider>
      <CssBaseline />
      <RouterProvider router={router} />
    </CssVarsProvider>
  </React.StrictMode>
);

reportWebVitals();
