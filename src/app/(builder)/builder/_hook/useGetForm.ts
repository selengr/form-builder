import { useQuery } from '@tanstack/react-query';
import { getFormAction } from '@actions/builder/getFormAction';

export function useGetForm(id: string | any) {
  return useQuery({
    queryKey: ['form-builder', id],
    queryFn: async () => {
      const res = await getFormAction(String(id));

      if (!res.success) {
        throw new Error(res.message || 'خطا در دریافت فرم');
      }

      return res.data;
    },
    enabled: !!id,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });
}
