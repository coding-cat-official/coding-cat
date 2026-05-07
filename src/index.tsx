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
import { theme } from './theme';

import Login from './routes/Login';
import Register from './routes/Register';
import AccountWrapper from './routes/AccountWrapper';
import MainTutorial from './components/MainTutorial';
import PreSessionForm from './components/PreSessionForm';
import PostSessionForm from './components/PostSessionForm';
import AdminWrapper from './routes/AdminWrapper';
import AdminPage from './routes/AdminPage';
import ChangePassword from './routes/ChangePassword';
import ReqPasswordChange from './routes/ReqPasswordChange';
import AuthCallback from './routes/AuthCallback';
import Auth from './routes/Auth';
import BlogPostView, { blogPostLoader } from './routes/BlogPostView';


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
        element: <MainTutorial />,
      },
      {
        path: "session",
        element: <PreSessionForm />,
      },
      {
        path: "post-session",
        element: <PostSessionForm />,
      },
      {
        path: "/blogs/:blogId",
        element: <BlogPostView />,
        loader: blogPostLoader
      },
      {
        path: "/problems/:problemName",
        element: <ProblemView />,
        loader: problemLoader,
      },
      {
        path: "signin",
        element: <Login />
      },
      {
        path: "change-password-req",
        element: <ReqPasswordChange />
      },
      {
        path: "register",
        element: <Register />
      },
      {
        path: "profile",
        element: <AccountWrapper />
      },
      {
        path: "admin",
        element: <AdminWrapper />,
        children: [
          { index: true, element: <AdminPage /> }
        ],
      },
    ],
  },
  {
    path: "/auth",
    element: <Auth />,
    loader: problemListLoader,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "callback",
        element: <AuthCallback />
      },
      {
        path: "change-password",
        element: <ChangePassword />
      }
    ]
  }
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
