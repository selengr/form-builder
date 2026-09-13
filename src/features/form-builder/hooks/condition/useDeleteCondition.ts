import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { deleteConditionAction } from '@actions/condition/deleteConditionAction';

export const useDeleteCondition = () => {
  const router = useRouter();

  const mutation = useMutation({
    mutationKey: ['delete-condition'],
    mutationFn: async (id: number) => {
      const res = await deleteConditionAction(id);

      if (!res.success) {
        throw new Error(res.message || 'انجام عملیات با خطا مواجه شد');
      }

      return res.data;
    },
    onSuccess: () => {
      router.refresh();
      toast.success(`شرط با موفقیت حذف شد`);
    },
    onError: (error) => {
      toast.error(error?.message || 'انجام عملیات با خطا مواجه شد. لطفاً مجدداً تلاش نمایید.');
    },
  });

  return mutation;
};
