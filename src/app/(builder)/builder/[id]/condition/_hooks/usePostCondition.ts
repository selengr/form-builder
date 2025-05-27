import {toast} from 'sonner';
import {useParams} from 'next/navigation';
import AxiosApi from '@/services/axios/AxiosApi';
import {useMutation} from '@tanstack/react-query';
import {IPostCondition} from '@/types/condition';
import {queryClient} from '@/lib/react-query.config';
import {useMutation, useQueryClient} from '@tanstack/react-query';


enum HttpMethod {
  POST = 'post',
  PUT = 'put',
}

const postCalculation = async (data: IPostCondition[], method: HttpMethod, isEdit: boolean) => {
  const url = isEdit ? `/condition/${data[0].id}` : `/condition`;
  const response = await AxiosApi[method](url, data);
  return response.data;
};


export const usePostCondition = (isEdit: boolean) => {
  const queryClient = useQueryClient();
  const method = isEdit ? HttpMethod.PUT : HttpMethod.POST;

  const mutation = useMutation({
    mutationKey: ['post-condition'],
    mutationFn: ({data}: { data: IPostCondition[] }) =>
      postCalculation(data, method, isEdit),

    onSuccess: (data) => {
      queryClient.invalidateQueries(['Condition_List'] as any);
      toast.success(`شرط با موفقیت ${isEdit ? "ویرایش" : "ایجاد"} شد`);
    },
    onError: () => {
      toast.error("عملیات ناموفق بود مجددا تلاش کنید");
    },

  });

  return mutation;
};
