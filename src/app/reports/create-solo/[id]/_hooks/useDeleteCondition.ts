import { toast } from 'sonner';
import { useRouter } from "next/navigation";
import { useParams } from 'next/navigation';
import AxiosApi from '@/services/axios/AxiosApi';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query.config';


const deleteCalculation = async (id : number) => {
    const url = `/report/solo/${id}`;
    const response = await AxiosApi.delete(url);
    return response.data;
  };


export const useDeleteCondition = () => {
  const { id } = useParams();
  const {refresh} = useRouter()

  const mutation = useMutation({
    mutationKey: ['delete-condition'],
    mutationFn: (id:number) => deleteCalculation(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/builder/${id}/condition`],
      });
      toast.success(`خرده‌گزارش با موفقیت حذف شد`);
      setTimeout(() => {
         refresh()
      }, 500);
    },
    onError: () => {
      toast.error("عملیات ناموفق بود مجددا تلاش کنید");
    },
    
  });

  return mutation;
};
