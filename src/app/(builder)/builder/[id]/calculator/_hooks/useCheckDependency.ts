import { toast } from 'sonner';
import { AxiosApi } from '@/services/axios/AxiosApi';
import { useMutation } from '@tanstack/react-query';

const checkDependency = async (id: number) => {
  const url = `/calculation/check-dependency/${id}`;
  const response = await AxiosApi.get(url);
  return response.data;
};

export const useCheckDependency = () => {
  const mutation = useMutation({
    mutationKey: ['delete-check-dependency'],
    mutationFn: ({ id }: { id: number }) => checkDependency(id),

    onSuccess: () => {},
    onError: () => {
      toast.error('انجام عملیات با خطا مواجه شد. لطفاً مجدداً تلاش نمایید.');
    },
  });

  return mutation;
};
