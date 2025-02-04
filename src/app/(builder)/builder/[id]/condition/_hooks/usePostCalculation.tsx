import AxiosApi from '@/services/axios/AxiosApi';
import { useMutation } from '@tanstack/react-query';
import { IPostConditionModelList } from '@/types/condition';


const postCalculation = async (data : IPostConditionModelList) => {
    const url = `/condition`;
    const response = await AxiosApi.post(url,data);
    return response.data;
  };


export const usePostCalculation = () => {

  const mutation = useMutation({
    mutationKey: ['post-condition'],
    mutationFn: ({ data }: { data: IPostConditionModelList }) =>
        postCalculation(data),

    onSuccess: (data) => {},
    onError: () => {},
    
  });

  return mutation;
};
