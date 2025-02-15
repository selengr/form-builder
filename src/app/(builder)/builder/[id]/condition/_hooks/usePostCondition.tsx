import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import AxiosApi from '@/services/axios/AxiosApi';
import { useMutation } from '@tanstack/react-query';
import { IPostCondition } from '@/types/condition';
import { queryClient } from '@/lib/react-query.config';


enum HttpMethod {
  POST = 'post',
  PUT = 'put',
}

const postCalculation = async (data : IPostCondition[], method: HttpMethod) => {
    const url = `/condition`;
    const response = await AxiosApi[method](url,data);
    return response.data;
  };


export const usePostCondition = (isEdit:boolean) => {
  const { id } = useParams();
  const method = isEdit ? HttpMethod.PUT : HttpMethod.POST;

  const mutation = useMutation({
    mutationKey: ['post-condition'],
    mutationFn: ({ data }: { data: IPostCondition[] }) =>
        postCalculation(data, method  ),

    onSuccess: (data) => {
      toast.success(`شرط با موفقیت ${isEdit ? "ویرایش" : "ایجاد"} شد`);
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
