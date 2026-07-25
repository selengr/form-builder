import { useQuery } from '@tanstack/react-query';
import { getAuthToken } from '@/utils/getAuthToken';


async function fetchFormData(id: string) {
    const token = await getAuthToken();
      const url = `/api/builder/${id}`
    const res = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        }
    });

    const result = await res.json();

    if (!res.ok) {
        let errorMessage = 'خطا در ثبت گروه.';

        if (Array.isArray(result?.error) && result.error[0]?.title) {
            errorMessage = result.error[0].title;
        } else if (typeof result?.error === 'string') {
            errorMessage = result.error;
        }

        throw new Error(errorMessage);
    }

    return result;
}


export function useGetForm(id: string | any) {
  return useQuery({
    queryKey: ["form-builder", id],
    queryFn: () => fetchFormData(id as string),
    enabled: !!id,
    staleTime: 0,
    gcTime: 0,   
    refetchOnWindowFocus: false,
  })
}