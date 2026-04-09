import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
// actions
import { showResultUser } from '../../../../../../actions/myAssessments/showResultUser';


export const useShowResultUser = () => {
  const { push } = useRouter();

  const mutation = useMutation({
    mutationKey: ['Show_User_Solo_Result'],
    mutationFn: ({ data }: { data: { formId: number; takePartId: number }; name: string }) => showResultUser(data),

    onSuccess: (result, { name }) => {
      localStorage.setItem('Show_User_Solo_Result', JSON.stringify(result));
      push(`/my-assessments/${result?.formId}/show-result?name=${name}`);
    },
    onError: (error) => {
      toast.error( error?.message || 'انجام عملیات با خطا مواجه شد');
    },
  });

  return mutation;
};
