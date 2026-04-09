import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
// action
import { showResultParticipate } from '../../../../../../../actions/participate/showResultParticipate';

export const useShowResultUser = () => {
  const { push } = useRouter();

  const mutation = useMutation({
    mutationKey: ['Show_Solo_Result'],
    mutationFn: ({ data }: { data: { formId: number; takePartId: number }; name: string }) => showResultParticipate(data),

    onSuccess: (result, { name }) => {
      localStorage.setItem('Show_Solo_Result', JSON.stringify(result));
      push(`/form/${result?.formId}/show-result?name=${name}`);
    },
    onError: (error) => {
      toast.error( error?.message || 'انجام عملیات با خطا مواجه شد');
    },
  });

  return mutation;
};
