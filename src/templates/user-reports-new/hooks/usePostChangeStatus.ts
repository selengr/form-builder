import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import {
  postChangeStatusAction,
  type TTicketFormData,
} from '@actions/user-reports-new/postChangeStatusAction';

export const CHANGE_STATUS_MUTATION_KEY = ['user-reports-new-change-status'] as const;

export const usePostChangeStatus = () => {
  const mutation = useMutation({
    mutationKey: CHANGE_STATUS_MUTATION_KEY,
    mutationFn: ({ data }: { data: TTicketFormData }) => postChangeStatusAction(data),

    onSuccess: () => {
      toast.success(`با موفقیت انجام شد`);
    },
    onError: (error) => {
      toast.error(error?.message || 'انجام عملیات با خطا مواجه شد');
    },
  });

  return mutation;
};
