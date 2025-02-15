import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import AxiosApi from '@/services/axios/AxiosApi';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query.config';


const deleteCalculation = async (id : number) => {
    const url = `/condition/${id}`;
    const response = await AxiosApi.delete(url);
    return response.data;
  };


export const useDeleteCondition = () => {
  const { id } = useParams();

  const mutation = useMutation({
    mutationKey: ['delete-condition'],
    mutationFn: (id:number) => deleteCalculation(id),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [`/builder/${id}/condition`],
      });
    },
    onError: () => {
      toast.error("عملیات ناموفق بود مجددا تلاش کنید");
    },
    
  });

  return mutation;
};
