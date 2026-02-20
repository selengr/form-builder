import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
// actions
import { deleteConditionAction } from '../../../../../../../actions/condition/deleteConditionAction';

export const useDeleteCondition = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['delete-condition'],
    mutationFn: (id: number) => deleteConditionAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['Condition_List'] as any);
      toast.success(`شرط با موفقیت حذف شد`);
    },
    onError: () => {
      toast.error('انجام عملیات با خطا مواجه شد. لطفاً مجدداً تلاش نمایید.');
    },
  });

  return mutation;
};
