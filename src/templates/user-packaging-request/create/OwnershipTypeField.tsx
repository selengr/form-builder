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
import { CreatePackagingRequestFormInput } from './schema';
import OwnershipSampleDownload from './OwnershipSampleDownload';

export const OWNERSHIP_SINGLE = 'OWNERSHIP_SINGLE';
export const OWNERSHIP_MULTI = 'OWNERSHIP_MULTI';

export default function OwnershipTypeField() {
  const { control, watch } = useFormContext<CreatePackagingRequestFormInput>();
  const ownershipTypeEnum = watch('ownershipTypeEnum');
  const isMultiOwnership = ownershipTypeEnum === OWNERSHIP_MULTI;

  return (
    <Box display="flex" flexDirection="column" gap={1.5} width="100%">
      <Typography variant="subtitle2" fontWeight={700} fontSize="15px" lineHeight={1.7}>
        آیا کلیه حقوق مادی و معنوی این اثر متعلق به شخص شما است یا افراد دیگری نیز در آن دخیل
        بوده‌اند؟
      </Typography>

      <Controller
        name="ownershipTypeEnum"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <FormControl error={Boolean(error)} fullWidth>
            <RadioGroup {...field} value={field.value ?? ''}>
              <FormControlLabel
                value={OWNERSHIP_SINGLE}
                control={<Radio size="small" />}
                label="بله، فقط خودم"
                sx={{
                  '& .MuiFormControlLabel-label': { fontSize: '14px', fontWeight: 500 },
                }}
              />
              <FormControlLabel
                value={OWNERSHIP_MULTI}
                control={<Radio size="small" />}
                label="خیر"
                sx={{
                  '& .MuiFormControlLabel-label': { fontSize: '14px', fontWeight: 500 },
                }}
              />
            </RadioGroup>
            {error?.message && <FormHelperText>{error.message}</FormHelperText>}
          </FormControl>
        )}
      />

      {isMultiOwnership && <OwnershipSampleDownload />}
    </Box>
  );
}
