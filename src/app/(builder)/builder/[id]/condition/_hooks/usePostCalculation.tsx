import AxiosApi from '@/services/axios/AxiosApi';
import { useMutation } from '@tanstack/react-query';
import { IPostCondition } from '@/types/condition';


const postCalculation = async (data : IPostCondition[]) => {
    const url = `/condition`;
    const response = await AxiosApi.post(url,data);
    return response.data;
  };


export const usePostCalculation = () => {

  const mutation = useMutation({
    mutationKey: ['post-condition'],
    mutationFn: ({ data }: { data: IPostCondition[] }) =>
        postCalculation(data),

    onSuccess: (data) => {},
    onError: () => {},
    
  });

  return mutation;
};
