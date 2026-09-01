import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import {
  postChangeStatusAction,
  type TTicketFormData,
} from '@actions/user-reports/postChangeStatusAction';

export const CHANGE_STATUS_MUTATION_KEY = ['user-reports-change-status'] as const;

export const usePostChangeStatus = () => {
  const mutation = useMutation({
    mutationKey: CHANGE_STATUS_MUTATION_KEY,
    mutationFn: async ({ data }: { data: TTicketFormData }) => {
      const res = await postChangeStatusAction(data);

      if (!res.success) {
        throw new Error(res.message || 'انجام عملیات با خطا مواجه شد');
      }

      return res.data;
    },

    onSuccess: () => {
      toast.success(`با موفقیت انجام شد`);
    },
    onError: (error) => {
      toast.error(error?.message || 'انجام عملیات با خطا مواجه شد');
    },
  });

  return mutation;
};
