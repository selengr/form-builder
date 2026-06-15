import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { deleteTakePartAction } from '@actions/report/showSoloReport';

export const useDeleteTakePart = () => {
  return useMutation({
      mutationFn: (data: any) => deleteTakePartAction(data),

    onSuccess: () => {
      toast.success('ردیف با موفقیت حذف شد');
    },

    onError: (error: any) => {
      toast.error(error?.message || 'حذف ردیف با خطا مواجه شد');
    },
  });
};
