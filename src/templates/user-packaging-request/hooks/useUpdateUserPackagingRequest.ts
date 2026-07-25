'use client';

import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import {
  updateUserPackagingRequestAction,
  UpdatePackagingRequestPayload,
} from '@actions/user-packaging-request/updateUserPackagingRequestAction';

export function useUpdateUserPackagingRequest({
  push,
}: {
  push: (href: string) => void;
}) {
  return useMutation({
    mutationFn: async (data: UpdatePackagingRequestPayload) => {
      const res = await updateUserPackagingRequestAction(data);

      if (!res.success) {
        throw new Error(res.message || 'خطا در ویرایش درخواست');
      }

      return res.data;
    },
    onSuccess: () => {
      toast.success('درخواست با موفقیت ویرایش شد');
      push('/user-packaging-request');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'خطا در ویرایش درخواست');
    },
  });
}
