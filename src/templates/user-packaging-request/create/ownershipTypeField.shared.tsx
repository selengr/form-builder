'use client';

import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import OwnershipSampleDownload from './OwnershipSampleDownload';

export const OWNERSHIP_SINGLE = 'OWNERSHIP_SINGLE';
export const OWNERSHIP_MULTI = 'OWNERSHIP_MULTI';

export type OwnershipTypeEnum = typeof OWNERSHIP_SINGLE | typeof OWNERSHIP_MULTI;

const radioLabelSx = {
  mr: 0,
  ml: 0,
  py: 0.25,
  alignItems: 'center',
  '& .MuiFormControlLabel-label': {
    fontSize: '14px',
    fontWeight: 600,
    color: '#393939',
  },
  '& .MuiRadio-root': {
    color: '#1758BA',
    '&.Mui-checked': { color: '#1758BA' },
  },
};

const disabledRadioLabelSx = {
  ...radioLabelSx,
  '& .MuiFormControlLabel-label': {
    ...radioLabelSx['& .MuiFormControlLabel-label'],
    color: '#666',
  },
  '& .Mui-disabled': {
    color: '#1758BA !important',
  },
};

function OwnershipTypeRadios({
  value,
  readOnly,
  error,
  onChange,
}: {
  value?: string;
  readOnly?: boolean;
  error?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <FormControl error={Boolean(error)} fullWidth disabled={readOnly}>
      <RadioGroup
        value={value ?? ''}
        onChange={readOnly ? undefined : (event) => onChange?.(event.target.value)}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          width: '100%',
        }}>
        <FormControlLabel
          value={OWNERSHIP_SINGLE}
          control={<Radio size="small" />}
          label="بله، فقط خودم"
          disabled={readOnly}
          sx={readOnly ? disabledRadioLabelSx : radioLabelSx}
        />
        <FormControlLabel
          value={OWNERSHIP_MULTI}
          control={<Radio size="small" />}
          label="خیر، من و همکارانم"
          disabled={readOnly}
          sx={readOnly ? disabledRadioLabelSx : radioLabelSx}
        />
      </RadioGroup>
      {error && (
        <FormHelperText sx={{ textAlign: 'left', mx: 0, mt: 0.25 }}>{error}</FormHelperText>
      )}
    </FormControl>
  );
}

export function OwnershipTypeFieldLayout({
  value,
  readOnly = false,
  error,
  onChange,
  showSampleDownload = false,
}: {
  value?: string;
  readOnly?: boolean;
  error?: string;
  onChange?: (value: string) => void;
  showSampleDownload?: boolean;
}) {
  const isMultiOwnership = value === OWNERSHIP_MULTI;

  return (
    <Box display="flex" flexDirection="column" gap="6px" width="100%" mt={3} mb={1}>
      <Typography
        variant="subtitle2"
        fontWeight={600}
        fontSize="15px"
        lineHeight={1.75}
        sx={{ width: '100%', textAlign: 'left' }}>
        آیا کلیه حقوق مادی و معنوی این اثر متعلق به شخص شما است یا افراد دیگری نیز در آن دخیل
        بوده‌اند؟
      </Typography>

      <Box
        sx={{
          width: '100%',
          bgcolor: '#F7F7FF',
          borderRadius: '10px',
          px: { xs: 1.5, sm: 2 },
          py: { xs: 1.25, sm: 1.5 },
          ...(readOnly && { opacity: 0.95 }),
        }}>
        <OwnershipTypeRadios
          value={value}
          readOnly={readOnly}
          error={error}
          onChange={onChange}
        />

        {showSampleDownload && isMultiOwnership && (
          <Box mt={1.5}>
            <OwnershipSampleDownload />
          </Box>
        )}
      </Box>
    </Box>
  );
}
