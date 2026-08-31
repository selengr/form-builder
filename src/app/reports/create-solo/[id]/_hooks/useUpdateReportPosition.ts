import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
// actions
import { updateReportPositionAction } from '../../../../../../actions/report/updateReportPositionAction';

interface IUpdatePositionPayload {
  formBuilderId: string | string[];
  conditionId: number;
  newPosition: string | number;
}

export const useUpdateReportPosition = () => {
  const mutation = useMutation({
    mutationKey: ['change-position'],
    mutationFn: async (data: IUpdatePositionPayload) => {
      const res = await updateReportPositionAction(data);

      if (!res.success) {
        throw new Error(res.message || 'انجام عملیات با خطا مواجه شد');
      }

      return res.data;
    },

    onSuccess: () => {},
    onError: (error) => {
      toast.error(error?.message || 'انجام عملیات با خطا مواجه شد');
    },
  });

  return mutation;
};
