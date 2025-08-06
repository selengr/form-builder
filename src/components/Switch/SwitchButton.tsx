import { styled, Switch } from '@mui/material';

export const SwitchButton = styled(Switch)(({ theme }) => ({
  width: 43,
  height: 23,
  padding: 0,
  transform: 'rotate(180deg)',
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(23px)',
      color: 'white',
      '& + .MuiSwitch-track': {
        backgroundColor: 'white',
        border: '1px solid #006FFF',
        opacity: 1,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
        border: `1px solid ${theme.palette.grey[300]} !important`,
      },
      '& .MuiSwitch-thumb': {
        border: `1px solid white !important`,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: 'white',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.grey[300],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.3,
    },
  },
  '& .Mui-checked .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 15,
    height: 15,
    boxShadow: 'none',
    color: '#006FFF',
    marginTop: '2px',
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 15,
    height: 15,
    boxShadow: 'none',
    color: theme.palette.grey[500],
    border: `1px solid white !important`,
    marginTop: '2px',
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: 'white',
    border: `1px solid ${theme.palette.grey[400]}`,
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));
