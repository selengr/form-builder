import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { deleteCalculatorAction } from '@actions/calculator/calculation';

export const useDeleteCalculator = () => {
  const router = useRouter();

  const mutation = useMutation({
    mutationKey: ['delete-calculation'],
    mutationFn: async (id: number) => {
      const res = await deleteCalculatorAction(id);

      if (!res.success) {
        throw new Error(res.message || 'انجام عملیات با خطا مواجه شد');
      }

      return res.data;
    },
    onSuccess: () => {
      router.refresh();
      toast.success(` محاسبه گر با موفقیت حذف شد`);
    },
    onError: (error) => {
      toast.error(error?.message || 'انجام عملیات با خطا مواجه شد. لطفاً مجدداً تلاش نمایید.');
    },
  });

  return mutation;
};
