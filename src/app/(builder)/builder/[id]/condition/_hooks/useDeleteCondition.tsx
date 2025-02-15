import { toast } from 'sonner';
import AxiosApi from '@/services/axios/AxiosApi';
import { useMutation } from '@tanstack/react-query';


const deleteCalculation = async (id : number) => {
    const url = `/condition/${id}`;
    const response = await AxiosApi.delete(url);
    return response.data;
  };


export const useDeleteCondition = () => {

  const mutation = useMutation({
    mutationKey: ['delete-condition'],
    mutationFn: (id:number) => deleteCalculation(id),

    onSuccess: (data) => {},
    onError: () => {
      toast.error("عملیات ناموفق بود مجددا تلاش کنید");
    },
    
  });

  return mutation;
};
