import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
// action
import { getCalculationListAction } from '../../../../../../../actions/calculator/calculation';

export const useGetList = () => {
  const { id } = useParams();
  return useQuery({
    queryKey: ['Calculation_List', String(id)],
    queryFn: () => getCalculationListAction(String(id)),
    staleTime: 0,
    gcTime: 600000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 3,
  });
};
