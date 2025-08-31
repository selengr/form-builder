import { toast } from 'sonner';
import { AxiosApi } from '@/services/axios/AxiosApi';
import { useMutation } from '@tanstack/react-query';

interface IProps { formBuilderId: string | string[], questionId :number }
const checkDependency = async (data : IProps) => {
  const url = `/question/check-question-formulas`;
  const response = await AxiosApi.post(url,data);
  return response.data;
};

export const useCheckQuestionDependency = () => {
  const mutation = useMutation({
    mutationKey: ['check-question-dependency'],
    mutationFn: (data : IProps) => checkDependency(data),

    onSuccess: () => {},
    onError: () => {
      toast.error('انجام عملیات با خطا مواجه شد. لطفاً مجدداً تلاش نمایید.');
    },
  });

  return mutation;
};
