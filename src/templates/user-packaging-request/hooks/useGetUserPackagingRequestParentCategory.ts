'use client';

import { useQuery } from '@tanstack/react-query';
import { getUserPackagingRequestParentCategoryAction } from '@actions/user-packaging-request/getUserPackagingRequestParentCategoryAction';

export interface UserPackagingRequestCategoryOption {
  value: string;
  caption: string;
}

export const USER_PACKAGING_REQUEST_PARENT_CATEGORY_QUERY_KEY = [
  'user-packaging-request-parent-category',
] as const;

export function useGetUserPackagingRequestParentCategory() {
  const { data, isFetching, error } = useQuery({
    queryKey: USER_PACKAGING_REQUEST_PARENT_CATEGORY_QUERY_KEY,
    queryFn: async () => {
      const res = await getUserPackagingRequestParentCategoryAction();

      if (!res.success) {
        throw new Error(res.message || 'خطا در دریافت دسته‌بندی‌ها');
      }

      return res.data;
    },
    gcTime: 600000,
    staleTime: 0,
    retry: 3,
  });

  const categories = data?.dataList?.map((item: UserPackagingRequestCategoryOption) => ({
    value: item.value,
    label: item.caption,
  }));

  return {
    isFetchingCategory: isFetching,
    categories,
    error,
  };
}
