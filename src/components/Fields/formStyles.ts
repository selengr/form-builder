import { SxProps, Theme } from '@mui/material';

export const commonTextFieldSx: SxProps<Theme> = {
  '& .MuiInputBase-root': {
    padding: 1.5,
    borderRadius: '12px',
    backgroundColor: '#fff',
    transition: 'border-color 160ms ease, box-shadow 160ms ease',
  },
  '& input': {
    padding: 0,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(22, 22, 22, 0.14)',
  },
  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(22, 22, 22, 0.26)',
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#1758BA',
  },
  '& .MuiOutlinedInput-root.Mui-focused': {
    boxShadow: '0 0 0 3px rgba(23, 88, 186, 0.12)',
  },
//    sx: {
//       '& .MuiInputBase-root': {
//         padding: 1.5,
//       },
//       '& input': {
//         padding: 0,
//       },
//     },
};
