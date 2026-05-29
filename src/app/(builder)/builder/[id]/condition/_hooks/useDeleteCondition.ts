import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
// actions
import { deleteConditionAction } from '../../../../../../../actions/condition/deleteConditionAction';

export const useDeleteCondition = () => {
  const router = useRouter();

  const mutation = useMutation({
    mutationKey: ['delete-condition'],
    mutationFn: (id: number) => deleteConditionAction(id),
    onSuccess: () => {
    router.refresh()
      toast.success(`شرط با موفقیت حذف شد`);
    },
    onError: () => {
      toast.error('انجام عملیات با خطا مواجه شد. لطفاً مجدداً تلاش نمایید.');
    },
  });

  return mutation;
};
