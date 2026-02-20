import { toast } from 'sonner';
import { IPostCondition } from '@/types/conditionReportSolo';
import { useMutation, useQueryClient } from '@tanstack/react-query';
// actions
import { postReportSoloAction } from '../../../../../../actions/report/postReportSoloAction';

export const usePostCondition = (isEdit: boolean) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['post-condition'],
    mutationFn: ({ data }: { data: IPostCondition[] }) => postReportSoloAction({ data, isEdit }),
    onSuccess: () => {
      queryClient.invalidateQueries(['Report_List'] as any);
      queryClient.refetchQueries(['Report_List'] as any);
      toast.success(`خرده‌گزارش با موفقیت ${isEdit ? 'ویرایش' : 'ایجاد'} شد`);
    },
    onError: () => {
      toast.error('انجام عملیات با خطا مواجه شد. لطفاً مجدداً تلاش نمایید.');
    },
  });

  return mutation;
};
