import { toast } from 'sonner';
import AxiosApi from '@/services/axios/AxiosApi';
import { useMutation } from '@tanstack/react-query';

interface IUpdatePositionPayload {
     formBuilderId: string | string[];
     conditionId:  number;
     newPosition: string | number
}

const postCalculation = async (data : IUpdatePositionPayload) => {
    const url = 'report/solo/change-position';
    const response = await AxiosApi.post(url,data);
    return response.data;
  };

export const useUpdateReportPosition = () => {

  const mutation = useMutation({
    mutationKey: ['change-position'],
    mutationFn: postCalculation,

    onSuccess: (data) => {},
    onError: () => {
      toast.error("عملیات ناموفق بود مجددا تلاش کنید");
    },
    
  });

  return mutation;
};
