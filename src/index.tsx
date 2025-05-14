import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createHashRouter, RouterProvider } from "react-router-dom";

import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';

import App, { problemListLoader } from './routes/root';
import ProblemView, { problemLoader } from './routes/ProblemView';
import ErrorPage from './error';
import {theme} from './theme';

import Auth from './routes/Auth'
import AccountWrapper from './routes/AccountWrapper';
import MainTutorial from './components/MainTutorial';



declare module "@mui/joy/Drawer" {
  interface DrawerPropsSizeOverrides {
    xl: true
  }
} 


const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    loader: problemListLoader,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <MainTutorial/>,
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
  basename: '/',
}
);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </CssVarsProvider>
  </React.StrictMode>
);

reportWebVitals();
