'use client';

import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IPostCondition } from '@/types/condition';
import { postConditionAction } from '../../../../../../../actions/condition/postConditionAction';
import { invalidateLogicListQueries } from '@/templates/builder/logic/useLogicItems';

export const usePostCondition = (isEdit: boolean) => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const formId = String(id ?? '');

  const mutation = useMutation({
    mutationKey: ['post-condition', isEdit],
    mutationFn: async ({ data }: { data: IPostCondition[] }) => {
      const res = await postConditionAction({ data, isEdit });

      if (!res.success) {
        throw new Error(res.message || 'انجام عملیات با خطا مواجه شد');
      }

      return res.data;
    },

    onSuccess: () => {
      invalidateLogicListQueries(queryClient, formId);
      toast.success(`شرط با موفقیت ${isEdit ? 'ویرایش' : 'ایجاد'} شد`);
    },
    onError: (error) => {
      toast.error(error?.message || 'انجام عملیات با خطا مواجه شد. لطفاً مجدداً تلاش نمایید.');
    },
  });

  return mutation;
};
