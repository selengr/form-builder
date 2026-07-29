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
import { Controller, useFormContext } from 'react-hook-form';
import { CreatePackagingRequestFormValues } from './schema';
import OwnershipSampleDownload from './OwnershipSampleDownload';

export const OWNERSHIP_SINGLE = 'OWNERSHIP_SINGLE';
export const OWNERSHIP_MULTI = 'OWNERSHIP_MULTI';

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

export default function OwnershipTypeField() {
  const { control, watch } = useFormContext<CreatePackagingRequestFormValues>();
  const ownershipTypeEnum = watch('ownershipTypeEnum');
  const isMultiOwnership = ownershipTypeEnum === OWNERSHIP_MULTI;

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
        }}>
        <Controller
          name="ownershipTypeEnum"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormControl error={Boolean(error)} fullWidth >
              <RadioGroup
                {...field}
                value={field.value ?? ''}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.25,
                  width: '100%',
                }}>
                <FormControlLabel
                  value={OWNERSHIP_SINGLE}
                  control={<Radio size="small" />}
                  label="بله، فقط خودم"
                  sx={radioLabelSx}
                />
                <FormControlLabel
                  value={OWNERSHIP_MULTI}
                  control={<Radio size="small" />}
                  label="خیر"
                  sx={radioLabelSx}
                />
              </RadioGroup>
              {error?.message && (
                <FormHelperText sx={{ textAlign: 'right', mx: 0, mt: 0.5 }}>
                  {error.message}
                </FormHelperText>
              )}
            </FormControl>
          )}
        />

        {isMultiOwnership && (
          <Box mt={1.5}>
            <OwnershipSampleDownload />
          </Box>
        )}
      </Box>
    </Box>
  );
}
