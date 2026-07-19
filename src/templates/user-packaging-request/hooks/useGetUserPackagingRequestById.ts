'use client';

import { useQuery } from '@tanstack/react-query';
import { getUserPackagingRequestByIdAction } from '@actions/user-packaging-request/getUserPackagingRequestByIdAction';

export function useGetUserPackagingRequestById(id: number) {
  return useQuery({
    queryKey: ['user-packaging-request-detail', id],
    queryFn: async () => {
      const res = await getUserPackagingRequestByIdAction(id);

      if (!res.success) {
        throw new Error(res.message || 'خطا در دریافت اطلاعات درخواست');
      }

      return res.data;
    },
    enabled: Number.isFinite(id) && id > 0,
  });
}
