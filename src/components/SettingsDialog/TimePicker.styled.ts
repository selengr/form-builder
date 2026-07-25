import { Box, styled } from '@mui/material';

const TimePickerStyled = styled(Box)(({ theme }) => ({
  '& .rmdp-analog-clock': {
    display: 'none',
  },
  '& .rmdp-time-picker': {
    padding: '15px 0 10px 0',
  },
  '& .rmdp-wrapper.rmdp-shadow': {
    borderRadius: '16px',
  },
  '& .bottom': {
    minWidth: '150px !important',
  },
  '& .rmdp-time-picker div input': {
    fontSize: '16px',
    width: '30px',
  },
  '& .dvdr': {
    fontSize: '20px',
  },
  '& .rmdp-container:focus-visible, & .rmdp-container input:focus-visible': {
    border: 'none',
    outline: 'none',
  },
  '& .rmdp-container input:disabled': {
    backgroundColor: 'transparent',
  },
  '& .rmdp-container input': {
    textAlign: 'center !important',
  },
  '& .rmdp-arrow': {
    height: '8px',
    width: '8px',
  },
}));

export const DatePickerWrapper = styled(Box)<{ isError?: boolean }>(({ isError }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  height: '52px',
  borderRadius: '12px',
  backgroundColor: '#fff',
  padding: '0 14px',
  border: isError ? '1px solid #d32f2f' : '1px solid rgba(22, 22, 22, 0.14)',
  transition: 'border-color 160ms ease, box-shadow 160ms ease',

  '&:hover': {
    borderColor: isError ? '#d32f2f' : 'rgba(22, 22, 22, 0.26)',
  },

  '&:focus-within': {
    borderColor: isError ? '#d32f2f' : '#1758BA',
    boxShadow: isError
      ? '0 0 0 3px rgba(211, 47, 47, 0.12)'
      : '0 0 0 3px rgba(23, 88, 186, 0.12)',
  },

  '& .picker-input': {
    width: '100%',
    height: '100%',
    border: 'none !important',
    outline: 'none !important',
    background: 'transparent !important',
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: '600',
    color: '#161616',
  },

  '& .calendar-icon': {
    marginLeft: '8px',
    opacity: 0.7,
  }
}));


export default TimePickerStyled;
