import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { checkCalculationDependencyAction } from '../../../../../../../actions/calculator/calculation';

export const useCheckDependency = () => {
  const mutation = useMutation({
    mutationKey: ['delete-check-dependency'],
    mutationFn: async ({ id }: { id: number }) => {
      const res = await checkCalculationDependencyAction(id);

      if (!res.success) {
        throw new Error(res.message || 'انجام عملیات با خطا مواجه شد');
      }

      return res.data;
    },

    onSuccess: () => {},
    onError: (error) => {
      toast.error(error?.message || 'انجام عملیات با خطا مواجه شد. لطفاً مجدداً تلاش نمایید.');
    },
  });

  return mutation;
};
