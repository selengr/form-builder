import { toast } from 'sonner';
import { AxiosApi } from '@/services/axios/AxiosApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const deleteCalculation = async (id: number) => {
  const url = `/report/solo/${id}`;
  const response = await AxiosApi.delete(url);
  return response.data;
};

export const useDeleteReport = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['delete-condition'],
    mutationFn: (id: number) => deleteCalculation(id),

    onSuccess: () => {
      queryClient.invalidateQueries(['Report_List'] as any);
      toast.success(`خرده‌گزارش با موفقیت حذف شد`);
    },
    onError: () => {
      toast.error('انجام عملیات با خطا مواجه شد. لطفاً مجدداً تلاش نمایید.');
    },
  });

  return mutation;
};
