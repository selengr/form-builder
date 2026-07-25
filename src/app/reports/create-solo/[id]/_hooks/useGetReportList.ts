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
    queryFn: () => getReportListAction({ formId: String(id), admin }),
    staleTime: 0,
    gcTime: 600000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 3,
  });
};
