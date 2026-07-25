import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTakePartAction } from '@actions/report/showSoloReport';
import { useRouter } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export const useDeleteTakePart = () => {
  const queryClient = useQueryClient();
  const router = useRouter()

  return useMutation({
    mutationFn: async (params: { formId: any; takePartId: any }) => {
      const res = await deleteTakePartAction(params);

      if (!res.success) {
        throw new Error(res.message || 'حذف ردیف با خطا مواجه شد');
      }
      if (!res.success) {
            revalidatePath(`/stats/${params.formId}`);
      }

      return res.data;
    },

    onSuccess: () => {
      toast.success('ردیف با موفقیت حذف شد');
      // queryClient.invalidateQueries({ queryKey: ['reports'] });
    },

    onError: (error: any) => {
      toast.error(error?.message || 'حذف ردیف با خطا مواجه شد');
    },
  });
};
