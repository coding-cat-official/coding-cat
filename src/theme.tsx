import { extendTheme } from '@mui/joy/styles';

export const theme = extendTheme({
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
            '&:nth-of-type(odd)': {
              backgroundColor: '#fff0b8'
            }
          },
          '&.problems.Mui-selected': {
              backgroundColor: '#dde7ee',
              border: '1px solid black',
              fontWeight: '700',
              '&:nth-of-type(odd)': {
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
          },
          '&.desktop-bar': {
            backgroundColor: "#d4ff99"
          },
          '&.logo': {
            backgroundColor: '#feffed'
          },
          '&.problem-container': {
            backgroundColor: '#feffed'
          },
          '&.profile-wrapper': {
            backgroundColor: '#feffed'
          },
          '&.main': {
            backgroundColor: '#feffed'
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
    },
    JoyButton: {
      styleOverrides: {
        root: {
          fontFamily: 'Doto',
          fontWeight: 'bolder',
          backgroundColor: '#ffb5a9',
          color: 'black',
          '&:hover': {
            backgroundColor: '#ff8b78',
            color: 'white',
          },
          '&.Mui-disabled': {
            backgroundColor: 'white'
          },
        }
      }
    },
    JoyLinearProgress: {
      styleOverrides: {
        root: {
          '&.problemList-progressBar': {
            color: '#8ae514',
            backgroundColor: '#d4ff99',
            border: '1px solid black',
            boxShadow: '2px 2px black',
            '&::before': {
              border: '1px solid black',
            },
          },
          '&.mutation-progressBar': {
            backgroundColor: "white",
            color: '#d4ff99',
            border: '1px solid black',
            '&::before': {
              border: '1px solid black',
            },
          }
        }
      }
    }
  }
});