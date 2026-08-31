import { useQuery } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'next/navigation';
// action
import { getReportListAction } from '../../../../../../actions/report/getReportListAction';

export const useGetReportList = () => {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const search = searchParams.get('rep');
  const admin = search === 'list';

  return useQuery({
    queryKey: ['Report_List'],
    queryFn: async () => {
      const res = await getReportListAction({ formId: String(id), admin });

      if (!res.success) {
        throw new Error(res.message || 'انجام عملیات با خطا مواجه شد');
      }

      return res.data.content;
    },
    staleTime: 0,
    gcTime: 600000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 3,
  });
};
