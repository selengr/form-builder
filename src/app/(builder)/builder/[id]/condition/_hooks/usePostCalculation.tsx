import AxiosApi from '@/services/axios/AxiosApi';
import { useMutation } from '@tanstack/react-query';
import { IPostCondition } from '@/types/condition';


enum HttpMethod {
  POST = 'post',
  PUT = 'put',
}

const postCalculation = async (data : IPostCondition[], method: HttpMethod) => {
    const url = `/condition`;
    const response = await AxiosApi[method](url,data);
    return response.data;
  };


export const usePostCalculation = (isEdit:boolean) => {
  const method = isEdit ? HttpMethod.PUT : HttpMethod.POST;

  const mutation = useMutation({
    mutationKey: ['post-condition'],
    mutationFn: ({ data }: { data: IPostCondition[] }) =>
        postCalculation(data, method),

    onSuccess: (data) => {},
    onError: () => {},
    
  });

  return mutation;
};
