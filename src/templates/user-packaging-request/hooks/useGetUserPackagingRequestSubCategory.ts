'use client';

import { useMutation } from '@tanstack/react-query';
import { getUserPackagingRequestSubCategoryAction } from '@actions/user-packaging-request/getUserPackagingRequestSubCategoryAction';
import { UserPackagingRequestCategoryOption } from './useGetUserPackagingRequestParentCategory';

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

  const mapSubCategories = (data: { dataList?: UserPackagingRequestCategoryOption[] } | undefined) =>
    data?.dataList?.map((item) => ({
      value: item.value,
      label: item.caption,
    }));

  return {
    mutation,
    subCategories: mapSubCategories(mutation.data),
  };
}
