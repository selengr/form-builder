import {toast} from 'sonner';
import {AxiosApi} from '@/services/axios/AxiosApi';
import {useMutation} from '@tanstack/react-query';


const checkDependency = async (id: number) => {
    console.log('id2 :>> ', id);
  const url = `/calculation/check-dependency/${id}`;
  const response = await AxiosApi.get(url);
  return response.data;
};


export const useCheckDependency = () => {

  const mutation = useMutation({
    mutationKey: ['delete-check-dependency'],
    mutationFn: ({id} : {id: number}) => checkDependency(id),

    onSuccess: () => {},
    onError: () => {
      toast.error("عملیات ناموفق بود مجددا تلاش کنید");
    },

  });

  return mutation;
};
