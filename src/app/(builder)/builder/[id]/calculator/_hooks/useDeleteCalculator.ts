import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
// action
import { deleteCalculatorAction } from '../../../../../../../actions/calculator/calculation';

export const useDeleteCalculator = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ['delete-calculation'],
    mutationFn: (id: number) => deleteCalculatorAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['Calculation_List'] as any);
      toast.success(` محاسبه گر با موفقیت حذف شد`);
    },
    onError: () => {
      toast.error('انجام عملیات با خطا مواجه شد. لطفاً مجدداً تلاش نمایید.');
    },
  });

  return mutation;
};
