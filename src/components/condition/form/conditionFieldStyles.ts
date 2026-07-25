import type { SxProps, Theme } from '@mui/material';

export const CONDITION_FIELD_HEIGHT = 44;
export const CONDITION_FIELD_RADIUS = '10px';

export const conditionComboNarrowSx: SxProps<Theme> = {
  width: { xs: '100%', md: '108px' },
  minWidth: { xs: 'unset', md: '108px' },
  maxWidth: { xs: 'unset', md: '108px' },
  flexShrink: 0,
};

export const conditionValueFieldSx: SxProps<Theme> = {
  flex: 1,
  minWidth: 0,
  width: '100%',
};

export const conditionActionSelectSx: SxProps<Theme> = {
  flex: 1,
  minWidth: 0,
  width: '100%',
};

export function getConditionSelectSx(error?: boolean): SxProps<Theme> {
  return {
    '& .MuiSelect-select.MuiSelect-outlined': {
      fontFamily: 'inherit',
      fontSize: '14px',
      paddingRight: '12px !important',
      paddingLeft: '36px !important',
      textAlign: 'right',
      display: 'flex',
      alignItems: 'center',
      minHeight: 'unset !important',
    },
    '&.MuiInputBase-root': {
      borderRadius: CONDITION_FIELD_RADIUS,
      backgroundColor: '#FFFFFF',
      border: error ? '1px solid #FA4D56' : '1px solid #DDE1E6',
      height: `${CONDITION_FIELD_HEIGHT}px`,
      minHeight: `${CONDITION_FIELD_HEIGHT}px`,
    },
    '& .MuiSelect-icon': {
      left: '12px',
      right: 'auto',
      color: error ? '#FA4D56' : '#9EA3AC',
      fontSize: '1rem',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
  };
}

export function getConditionTextFieldSx(error?: boolean): SxProps<Theme> {
  return {
    width: '100%',
    '& .MuiOutlinedInput-root': {
      borderRadius: CONDITION_FIELD_RADIUS,
      backgroundColor: '#FFFFFF',
      height: `${CONDITION_FIELD_HEIGHT}px`,
      '& fieldset': {
        borderRadius: CONDITION_FIELD_RADIUS,
        border: error ? '1px solid #FA4D56' : '1px solid #DDE1E6',
      },
      '&:hover fieldset': {
        border: error ? '1px solid #FA4D56' : '1px solid #DDE1E6',
      },
      '&.Mui-focused fieldset': {
        border: error ? '1px solid #FA4D56' : '1px solid #C4C4C4',
        borderWidth: '1px',
      },
      '& input': {
        fontSize: '14px',
        textAlign: 'right',
        padding: '0 12px',
        height: `${CONDITION_FIELD_HEIGHT}px`,
        boxSizing: 'border-box',
      },
      '& input::placeholder': {
        color: '#9EA3AC',
        opacity: 1,
      },
    },
  };
}
