'use client';

import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { IPostCondition } from '@/types/condition';
import { postConditionAction } from '../../../../../../../actions/condition/postConditionAction';

export const usePostCondition = (isEdit: boolean) => {

  const mutation = useMutation({
    mutationKey: ['post-condition', isEdit],
    mutationFn: ({ data }: { data: IPostCondition[] }) =>
      postConditionAction({ data, isEdit }),

    onSuccess: () => {
      toast.success(`شرط با موفقیت ${isEdit ? 'ویرایش' : 'ایجاد'} شد`);
    },
    onError: () => {
      toast.error('انجام عملیات با خطا مواجه شد. لطفاً مجدداً تلاش نمایید.');
    },
  });

  return mutation;
};