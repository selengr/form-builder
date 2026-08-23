'use client';

import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTakePartAction } from '@actions/report/showSoloReport';

export const useDeleteTakePart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { formId: any; takePartId: any }) => {
      const res = await deleteTakePartAction(params);

      if (!res.success) {
        throw new Error(res.message || 'حذف ردیف با خطا مواجه شد');
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