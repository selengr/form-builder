'use client';

import { Box, Typography } from '@mui/material';
import { RHFMultiSelectV0 } from '@/components/hook-form';

interface ReadOnlyCategoryFieldsProps {
  categories: Array<{ value: string; label: string }>;
  subCategories: Array<{ value: string; label: string }>;
  isFetchingCategory?: boolean;
  isFetchingSubCategory?: boolean;
}

export default function ReadOnlyCategoryFields({
  categories,
  subCategories,
  isFetchingCategory = false,
  isFetchingSubCategory = false,
}: ReadOnlyCategoryFieldsProps) {
  return (
    <Box display="flex" flexDirection="column" gap="6px" width="100%">
      <Typography variant="subtitle2" fontWeight={700}>
        دسته بند‌ی‌ها:
      </Typography>
      <RHFMultiSelectV0
        sx={{
          '& .MuiInputBase-root': {
            bgcolor: '#F7F7FF',
            paddingY: '8px',
            borderRadius: '10px',
          },
        }}
        chip
        checkbox
        fullWidth
        name="categoryIds"
        options={categories}
        isLoading={isFetchingCategory}
        disabled
      />

      <RHFMultiSelectV0
        sx={{
          '& .MuiInputBase-root': {
            bgcolor: '#F7F7FF',
            paddingY: '8px',
            borderRadius: '10px',
          },
        }}
        chip
        checkbox
        fullWidth
        name="subCategoryIds"
        options={subCategories}
        isLoading={isFetchingSubCategory}
        disabled
      />
    </Box>
  );
}
