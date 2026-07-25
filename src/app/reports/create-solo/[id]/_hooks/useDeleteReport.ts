import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
// actions
import { deleteReportAction } from '../../../../../../actions/report/deleteReportAction';


export const useDeleteReport = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['delete-condition'],
    mutationFn: (id: number) => deleteReportAction(id),

    onSuccess: () => {
      queryClient.invalidateQueries(['Report_List'] as any);
      toast.success(`خرده‌گزارش با موفقیت حذف شد`);
    },
    onError: (error) => {
      toast.error(error?.message || 'انجام عملیات با خطا مواجه شد');
    },
  });

  return mutation;
};
