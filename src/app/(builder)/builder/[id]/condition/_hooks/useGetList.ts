import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
// actions
import { getConditionListAction } from '../../../../../../../actions/condition/getConditionListAction';


export const useGetList = () => {
  const { id } = useParams();
  return useQuery({
    queryKey: ['Condition_List', id],
    queryFn: () => getConditionListAction(id),

    staleTime: 0,
    gcTime: 600000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 3,
  });
};
