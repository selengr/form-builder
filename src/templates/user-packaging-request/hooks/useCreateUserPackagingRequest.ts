'use client';

import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import {
  createUserPackagingRequestAction,
  CreatePackagingRequestPayload,
} from '@actions/user-packaging-request/createUserPackagingRequestAction';

export function useCreateUserPackagingRequest({
  push,
}: {
  push: (href: string) => void;
}) {
  return useMutation({
    mutationFn: async (data: CreatePackagingRequestPayload) => {
      const res = await createUserPackagingRequestAction(data);

      if (!res.success) {
        throw new Error(res.message || 'خطا در ثبت درخواست');
      }

      return res.data;
    },
    onSuccess: () => {
      toast.success('درخواست با موفقیت ثبت شد');
      push('/user-packaging-request');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'خطا در ثبت درخواست');
    },
  });
}
