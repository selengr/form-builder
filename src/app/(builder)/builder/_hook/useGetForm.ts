import { useQuery } from '@tanstack/react-query';
import { getForm } from '@/lib/builderFieldActions';

export function useGetForm(id: string | any) {
  return useQuery({
    queryKey: ['form-builder', id],
    queryFn: async () => {
      const res = await getForm(String(id));

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
