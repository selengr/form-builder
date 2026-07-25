import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
// action
import { checkCalculationDependencyAction } from '../../../../../../../actions/calculator/calculation';

export const useCheckDependency = () => {
  const mutation = useMutation({
    mutationKey: ['delete-check-dependency'],
    mutationFn: ({ id }: { id: number }) => checkCalculationDependencyAction(id),

    onSuccess: () => {},
    onError: () => {
      toast.error('انجام عملیات با خطا مواجه شد. لطفاً مجدداً تلاش نمایید.');
    },
  });

  return mutation;
};
