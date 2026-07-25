import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useMutation} from '@tanstack/react-query';
// action
import { deleteCalculatorAction } from '../../../../../../../actions/calculator/calculation';

export const useDeleteCalculator = () => {
  const router = useRouter();
  
  const mutation = useMutation({
    mutationKey: ['delete-calculation'],
    mutationFn: (id: number) => deleteCalculatorAction(id),
    onSuccess: () => {
      router.refresh()
      toast.success(` محاسبه گر با موفقیت حذف شد`);
    },
    onError: () => {
      toast.error('انجام عملیات با خطا مواجه شد. لطفاً مجدداً تلاش نمایید.');
    },
  });

  return mutation;
};
