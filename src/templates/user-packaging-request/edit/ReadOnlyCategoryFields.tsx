'use client';

import { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { RHFMultiSelectV0 } from '@/components/hook-form';

interface SelectOption {
  value: string;
  label: string;
}

interface ReadOnlyCategoryFieldsProps {
  categoryIds: string[];
  subCategoryIds: string[];
  categories: SelectOption[];
  subCategories: SelectOption[];
  isFetchingCategory?: boolean;
  isFetchingSubCategory?: boolean;
}

function mergeSelectedOptions(options: SelectOption[], selectedIds: string[]) {
  const merged = [...options];

  selectedIds.forEach((id) => {
    if (!merged.some((option) => option.value === id)) {
      merged.push({ value: id, label: id });
    }
  });

  return merged;
}

export default function ReadOnlyCategoryFields({
  categoryIds,
  subCategoryIds,
  categories,
  subCategories,
  isFetchingCategory = false,
  isFetchingSubCategory = false,
}: ReadOnlyCategoryFieldsProps) {
  const categoryOptions = useMemo(
    () => mergeSelectedOptions(categories, categoryIds),
    [categories, categoryIds],
  );

  const subCategoryOptions = useMemo(
    () => mergeSelectedOptions(subCategories, subCategoryIds),
    [subCategories, subCategoryIds],
  );

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
        options={categoryOptions}
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
        options={subCategoryOptions}
        isLoading={isFetchingSubCategory}
        disabled
      />
    </Box>
  );
}
