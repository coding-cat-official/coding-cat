import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createHashRouter, RouterProvider } from "react-router-dom";

import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';

import App, { problemListLoader } from './routes/root';
import ProblemView, { problemLoader } from './routes/ProblemView';
import ErrorPage from './error';

import Auth from './routes/Auth'
import AccountWrapper from './routes/AccountWrapper';
import MainTutorial from './components/MainTutorial';

const theme = extendTheme({
  components: {
    JoyDrawer: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          ...(ownerState.size === "xl" && {
            "--ModalClose-inset": "1rem",
            "--Drawer-verticalSize": "clamp(500px, 60%, 100%)",
            "--Drawer-horizontalSize": "100vw",
            "--Drawer-titleMargin": "1rem 1rem calc(1rem / 2)",
          })
        })
      }
    },
    JoyListItemButton: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          '&.category-active': {
            backgroundColor: '#8ae514',
            color: 'black',
            '&:hover': {
              backgroundColor: '#8ae514'
            }
          },
          '&.category-inactive': {
            backgroundColor: '#d4ff99',
            color: 'black',
            '&:hover': {
              backgroundColor: '#82d078'
            }
          },
          '&.category-locked': {
            backgroundColor: '#d2d2d2',
            color: theme.vars.palette.neutral?.[400],
            '&:hover': {
              backgroundColor: '#d2d2d2',
            }
          },
          '&.problems': {
            backgroundColor: 'white',
            margin: '2px',
            '&:nth-child(odd)': {
              backgroundColor: '#fff0b8'
            }
          },
          '&.problems.Mui-selected': {
              backgroundColor: '#dde7ee',
              border: '1px solid black',
              fontWeight: '700',
              '&:nth-child(odd)': {
                backgroundColor: '#ffe293'
            }
          }
        })
      }
    },
    JoyDialogContent: {
      styleOverrides: {
        root: {
          backgroundColor: '#feffed',
        }
      }
    },
    JoyDialogTitle: {
      styleOverrides: {
        root: {
          '&.big-navbar': {
            backgroundColor: '#feffed',
          }
        }
      }
    },
    JoyStack: {
      styleOverrides: {
        root: {
          '&.big-navbar': {
            backgroundColor: '#feffed'
          },
          '&.stack-problemList': {
            margin: '20px'
          }
        }
      }
    },
    JoyTabPanel: {
      styleOverrides: {
        root: {
          '&.tabPanel-problemList': {
            padding: "0",
            backgroundColor: '#feffed'
          }
        }
      }
    },
    JoyInput: {
      styleOverrides: {
        root: {
          '&.problemList-search': {
            '&::before': {
              border: '1.5px solid rgb(255, 217, 80)'}
          }
        }
      }
    }
  }
});

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
