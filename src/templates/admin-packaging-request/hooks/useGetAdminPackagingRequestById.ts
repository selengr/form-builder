'use client';

import { useQuery } from '@tanstack/react-query';
import { getAdminPackagingRequestByIdAction } from '@actions/admin-packaging-request/getAdminPackagingRequestByIdAction';

export function useGetAdminPackagingRequestById(id: number) {
  return useQuery({
    queryKey: ['admin-packaging-request-detail', id],
    queryFn: async () => {
      const res = await getAdminPackagingRequestByIdAction(id);

      if (!res.success) {
        throw new Error(res.message || 'خطا در دریافت اطلاعات درخواست');
      }

      return res.data;
    },
    enabled: Number.isFinite(id) && id > 0,
  });
}
