import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
// action
import { showSoloReport } from '@actions/report/showSoloReport';

export const usePostCondition = () => {
  const { push } = useRouter();

  const mutation = useMutation({
    mutationKey: ['post-condition'],
    mutationFn: async ({
      data,
    }: {
      data: { formId: number; takePartId: number }[];
      name: string;
    }) => {
      const res = await showSoloReport(data);

      if (res.success === false) {
        throw new Error(res.message || 'انجام عملیات با خطا مواجه شد');
      }

      return res.data;
    },
    onSuccess: (result, { name }) => {
      localStorage.setItem('testResult', JSON.stringify(result));
      push(`/stats/${result[0].formId}/show-result?name=${name}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'انجام عملیات با خطا مواجه شد');
    },
  });

  return mutation;
};
