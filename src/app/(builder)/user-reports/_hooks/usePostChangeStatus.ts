import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
// actions
import { postChangeStatusAction,  type TTicketFormData } from '../../../../../actions/userReports/postChangeStatusAction';

export const CHANGE_STATUS_MUTATION_KEY = ['change-status'] as const;

export const usePostChangeStatus = () => {

  const mutation = useMutation({
  mutationKey: CHANGE_STATUS_MUTATION_KEY,
    mutationFn: ({ data }: { data: TTicketFormData }) => postChangeStatusAction(data),

    onSuccess: () => {
      toast.success(`با موفقیت انجام شد`);
    },
    onError: () => {
      toast.error('انجام عملیات با خطا مواجه شد. لطفاً مجدداً تلاش نمایید.');
    },
  });

  return mutation;
};
