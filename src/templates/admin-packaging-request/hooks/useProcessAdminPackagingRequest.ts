'use client';

import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import {
  processAdminPackagingRequestAction,
  ProcessAdminPackagingRequestPayload,
} from '@actions/admin-packaging-request/processAdminPackagingRequestAction';
import { ADMIN_LIST_PAGE_PATH } from '../layout';

export function useProcessAdminPackagingRequest({
  push,
}: {
  push: (href: string) => void;
}) {
  return useMutation({
    mutationFn: async (data: ProcessAdminPackagingRequestPayload) => {
      const res = await processAdminPackagingRequestAction(data);

      if (!res.success) {
        throw new Error(res.message || 'خطا در رسیدگی به درخواست');
      }

      return res.data;
    },
    onSuccess: () => {
      toast.success('درخواست با موفقیت رسیدگی شد');
      push(ADMIN_LIST_PAGE_PATH);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'خطا در رسیدگی به درخواست');
    },
  });
}
