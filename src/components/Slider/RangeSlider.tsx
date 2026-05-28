import { Slider, SliderProps, styled } from '@mui/material';

interface MyRangeSliderProps extends SliderProps {
  isempty?: boolean;
}

export const MyRangeSlider = styled(Slider, {
  shouldForwardProp: (prop) => prop !== 'isempty',
})<MyRangeSliderProps>(({ theme, isempty }) => ({
  color: '#2CDFC9',
  height: 30,
  '& .MuiSlider-mark': {
    display: 'none !important',
  },
  '& .MuiSlider-markLabel': {
    top: '55px !important',
    color: 'gray',


      whiteSpace: 'normal',
      wordBreak: 'break-word',
      overflowWrap: 'anywhere',
      textAlign: 'center',
      lineHeight: 1.2,
      maxWidth: '100px',
      width: 'max-content',
      transform: 'translateX(-50%)',

  },
  '& .MuiSlider-markLabelActive': {
    color: '#1758BA !important',
    fontWeight: '600',
  },
  '& .MuiSlider-track': {
    marginLeft: '3px !important',
    borderRadius: '10px',
    border: isempty ? '2px solid #D1D5DB' : '2px solid #2CDFC9',
    backgroundColor: isempty ? '#D1D5DB' : '',
  },
  '& .MuiSlider-rail': {
    padding: '3px',
    backgroundColor: 'white',
    outline: isempty ? '1px solid #D1D5DB' : '1px solid #2CDFC9',
    borderRadius: '10px',
  },
  '& .MuiSlider-thumb': {
    height: 40,
    width: 40,
    // border: '2px solid #2CDFC9',
    border: isempty ? '2px solid #D1D5DB' : '2px solid #2CDFC9',
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

  [theme.breakpoints.down('sm')]: {
    height: 32,
    padding: '12px 0',

    '& .MuiSlider-markLabel': {
      top: '55px !important',
      color: 'gray',
      fontSize: '12px',
      whiteSpace: 'normal',
      wordBreak: 'break-word',
      overflowWrap: 'anywhere',
      textAlign: 'center',
      lineHeight: 1.2,
      maxWidth: '64px',
      width: 'max-content',
      transform: 'translateX(-50%)',
    },

    '& .MuiSlider-valueLabel': {
      fontSize: 12,
      '& span': {
        fontSize: '13px',
      },
    },

    '& .MuiSlider-valueLabelOpen': {
      transform: 'translateY(10px)',
    },
  },

}));