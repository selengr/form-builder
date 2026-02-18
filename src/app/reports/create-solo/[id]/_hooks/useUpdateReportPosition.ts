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
    mutationFn: (data: IUpdatePositionPayload) => updateReportPositionAction(data),

    onSuccess: () => {},
    onError: () => {
      toast.error('انجام عملیات با خطا مواجه شد. لطفاً مجدداً تلاش نمایید.');
    },
  });

  return mutation;
};
