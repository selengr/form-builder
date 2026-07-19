'use client';

import { useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';
import { getUserPackagingRequestSubCategoryAction } from '@actions/user-packaging-request/getUserPackagingRequestSubCategoryAction';
import {
  UserPackagingRequestCategoryOption,
  UserPackagingRequestCategorySelectOption,
} from './useGetUserPackagingRequestParentCategory';

export function useGetUserPackagingRequestSubCategory() {
  const mutation = useMutation({
    mutationFn: async (parentId: string[]) => {
      const res = await getUserPackagingRequestSubCategoryAction(parentId);

      if (!res.success) {
        throw new Error(res.message || 'خطا در دریافت زیردسته‌ها');
      }

      return res.data;
    },
  });

  const subCategories = useMemo<UserPackagingRequestCategorySelectOption[] | undefined>(
    () =>
      mutation.data?.dataList?.map((item: UserPackagingRequestCategoryOption) => ({
        value: item.value,
        label: item.caption,
      })),
    [mutation.data?.dataList],
  );

  return {
    mutation,
    subCategories,
  };
}
