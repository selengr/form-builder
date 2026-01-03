import { Slider, styled } from '@mui/material';

export const MyRangeSlider = styled(Slider)({
  color: '#2CDFC9',
  height: 30,
  '& .MuiSlider-mark': {
    display: 'none !important',
  },
  '& .MuiSlider-markLabel': {
    top: '55px !important',
    color: 'gray',
  },
  '& .MuiSlider-markLabelActive': {
    color: '#1758BA !important',
    fontWeight: '600',
  },
  '& .MuiSlider-track': {
    marginLeft: '3px !important',
    borderRadius: '10px',
  },
  '& .MuiSlider-rail': {
    padding: '3px',
    backgroundColor: 'white',
    outline: '1px solid #2CDFC9 !important',
    borderRadius: '10px',
  },
  '& .MuiSlider-thumb': {
    height: 40,
    width: 40,
    border: '2px solid #2CDFC9',
    backgroundColor: '#fff',
    outline: '2px solid #fff',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&::before': {
      display: 'none',
    },
  },
  '& .MuiSlider-valueLabel': {
    pointerEvents: 'none',
    lineHeight: 1,
    fontSize: 12,
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: '#fff !important',
    color: 'gray',
    transform: 'translate(0px, 13px)',
    '&::before': {
      display: 'none',
    },
    '& span': {
      fontSize: '15px',
      color: '#1758BA',
    },
  },
  '& .MuiSlider-valueLabelOpen': {
    transform: 'translate(0px, 13px) !important',
  },
});

// import { Slider, styled, SliderProps, keyframes } from '@mui/material';

// interface MyRangeSliderProps extends SliderProps {
//   isempty?: boolean;
// }

// // Color switching animation
// const colorSwitch = keyframes`
//   0%, 100% {
//     border-color: #2CDFC9;
//     background-color: #2CDFC9;
//     color: #2CDFC9;
//   }
//   12.5%, 37.5%, 62.5%, 87.5% {
//     border-color: #D1D5DB;
//     background-color: #D1D5DB;
//     color: #D1D5DB;
//   }
//   25%, 50%, 75% {
//     border-color: #2CDFC9;
//     background-color: #2CDFC9;
//     color: #2CDFC9;
//   }
// `;
// const oulineSwitch = keyframes`
//   0%, 100% {
//         outline: #2CDFC9
//   }
//   12.5%, 37.5%, 62.5%, 87.5% {
//         outline: #D1D5DB
//   }
//   25%, 50%, 75% {
//     outline: #2CDFC9
//   }
// `;

// export const MyRangeSlider = styled(Slider, {
//   shouldForwardProp: (prop) => prop !== 'isempty',
// })<MyRangeSliderProps>(({ isempty }) => ({
//   color: '#2CDFC9',
//   height: 30,
  
//   '& .MuiSlider-mark': {
//     display: 'none !important',
//   },
  
//   '& .MuiSlider-markLabel': {
//     top: '55px !important',
//     color: 'gray',
//   },
  
//   '& .MuiSlider-markLabelActive': {
//     color: '#1758BA !important',
//     fontWeight: '600',
//   },
  
//   '& .MuiSlider-track': {
//     marginLeft: '3px !important',
//     borderRadius: '10px',
//     backgroundColor: '#2CDFC9',
//     animation: isempty ? `${colorSwitch} 2s infinite` : 'none',
//   },
  
//   '& .MuiSlider-rail': {
//     padding: '3px',
//     backgroundColor: 'white',
//     outline: '1px solid #2CDFC9 !important',

//     borderRadius: '10px',
//   },
  
//   '& .MuiSlider-thumb': {
//     height: 40,
//     width: 40,
//     border: '2px solid #2CDFC9',
//     backgroundColor: '#fff',
//     outline: '2px solid #fff',
//     animation: isempty ? `${colorSwitch} 2s infinite` : 'none',
    
//     '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
//       boxShadow: 'inherit',
//     },
//     '&::before': {
//       display: 'none',
//     },
//   },
  
//   '& .MuiSlider-valueLabel': {
//     pointerEvents: 'none',
//     lineHeight: 1,
//     fontSize: 12,
//     padding: 0,
//     width: 32,
//     height: 32,
//     borderRadius: '50%',
//     background: '#fff !important',
//     color: 'gray',
//     transform: 'translate(0px, 13px)',
//     '&::before': {
//       display: 'none',
//     },
//     '& span': {
//       fontSize: '15px',
//       color: '#1758BA',
//     },
//   },
  
//   '& .MuiSlider-valueLabelOpen': {
//     transform: 'translate(0px, 13px) !important',
//   },
  
//   // Apply animation to the main slider track color
//   '& .MuiSlider-track, & .MuiSlider-thumb': {
//     animation: isempty ? `${colorSwitch} 2s infinite` : 'none',
//   },
// }));
