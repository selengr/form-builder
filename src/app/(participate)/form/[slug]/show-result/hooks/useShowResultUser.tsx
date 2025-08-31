import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { AxiosApi } from '@/services/axios/AxiosApi';

const showResultUser = async (data: { formId: number; takePartId: number }) => {
  const url = '/report/user/solo/show-solo-report';
  const response = await AxiosApi.post(url, data);
  return response.data;
};

export const useShowResultUser = () => {
  const { push } = useRouter();

  const mutation = useMutation({
    mutationKey: ['Show_Solo_Result'],
    mutationFn: ({ data }: { data: { formId: number; takePartId: number }; name: string }) => showResultUser(data),

    onSuccess: (result, { name }) => {
      localStorage.setItem('Show_Solo_Result', JSON.stringify(result));
      push(`/form/${result?.formId}/show-result?name=${name}`);
    },
    onError: () => {
      toast.error('عملیات ناموفق بود مجددا تلاش کنید');
    },
  });

  return mutation;
};
