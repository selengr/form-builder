import { toast } from 'sonner';
import { AxiosApi } from '@/services/axios/AxiosApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const deleteCalculator = async (id: number) => {
  const url = `/calculation/delete/${id}`;
  const response = await AxiosApi.delete(url);
  return response.data;
};

export const useDeleteCalculator = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ['delete-calculation'],
    mutationFn: (id: number) => deleteCalculator(id),
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
