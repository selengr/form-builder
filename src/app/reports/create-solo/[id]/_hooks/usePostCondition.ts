import { toast } from 'sonner';
import { IPostCondition } from '@/types/conditionReportSolo';
import { useMutation, useQueryClient } from '@tanstack/react-query';
// actions
import { postReportSoloAction } from '../../../../../../actions/report/postReportSoloAction';

export const usePostCondition = (isEdit: boolean) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['post-condition'],
    mutationFn: async ({ data }: { data: IPostCondition[] }) => {
      const res = await postReportSoloAction({ data, isEdit });

      if (!res.success) {
        throw new Error(res.message || 'انجام عملیات با خطا مواجه شد');
      }

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['Report_List'] as any);
      queryClient.refetchQueries(['Report_List'] as any);
      toast.success(`خرده‌گزارش با موفقیت ${isEdit ? 'ویرایش' : 'ایجاد'} شد`);
    },
    onError: (error) => {
      toast.error(error?.message || 'انجام عملیات با خطا مواجه شد');
    },
  });

  return mutation;
};
