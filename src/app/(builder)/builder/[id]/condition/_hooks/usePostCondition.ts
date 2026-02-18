'use client';

import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IPostCondition } from '@/types/condition';
import { postConditionAction } from '../../../../../../../actions/condition/postConditionAction';

export const usePostCondition = (isEdit: boolean) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['post-condition', isEdit],
    mutationFn: ({ data }: { data: IPostCondition[] }) =>
      postConditionAction({ data, isEdit }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Condition_List'] });
      toast.success(`شرط با موفقیت ${isEdit ? 'ویرایش' : 'ایجاد'} شد`);
    },
    onError: () => {
      toast.error('انجام عملیات با خطا مواجه شد. لطفاً مجدداً تلاش نمایید.');
    },
  });

  return mutation;
};