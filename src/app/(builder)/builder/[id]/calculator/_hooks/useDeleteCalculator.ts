import {toast} from 'sonner';
import {useParams, useRouter} from "next/navigation";
import AxiosApi from '@/services/axios/AxiosApi';
import {useMutation} from '@tanstack/react-query';
import {queryClient} from '@/lib/react-query.config';


const deleteCalculator = async (id: number) => {
  const url = `/calculation/${id}`;
  const response = await AxiosApi.delete(url);
  return response.data;
};


export const useDeleteCalculator = () => {
  const {id} = useParams();
  const {refresh} = useRouter()

  const mutation = useMutation({
    mutationKey: ['delete-calculation'],
    mutationFn: (id: number) => deleteCalculator(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/builder/${id}/calculation`],
      });
      toast.success(` محاسبه گر با موفقیت حذف شد`);
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
