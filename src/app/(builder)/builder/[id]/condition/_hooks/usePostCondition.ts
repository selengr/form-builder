import { toast } from 'sonner';
import { IPostCondition } from '@/types/condition';
import { useMutation, useQueryClient } from '@tanstack/react-query';
// action
import { postConditionAction } from '../../../../../../../actions/condition/postConditionAction';

export const usePostCondition = (isEdit: boolean) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['post-condition'],
    mutationFn: ({ data }: { data: IPostCondition[] }) => postConditionAction({ data, isEdit }),

    onSuccess: () => {
      queryClient.invalidateQueries(['Condition_List'] as any);
      toast.success(`شرط با موفقیت ${isEdit ? 'ویرایش' : 'ایجاد'} شد`);
    },
    onError: () => {
      toast.error('انجام عملیات با خطا مواجه شد. لطفاً مجدداً تلاش نمایید.');
    },
  });

  return mutation;
};
