'use client';

import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { pickUpPackagingRequestAction } from '@actions/packaging/pickUpPackagingRequestAction';

export function usePickUpPackagingRequest({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await pickUpPackagingRequestAction(id);

      if (!res.success) {
        throw new Error(res.message || 'خطا در شروع فرایند ساخت');
      }

      if (!res.data?.response) {
        throw new Error('خطا در شروع فرایند ساخت');
      }

      return res.data;
    },
    onSuccess: () => {
      toast.success('فرایند ساخت با موفقیت آغاز شد');
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'خطا در شروع فرایند ساخت');
    },
  });
}
