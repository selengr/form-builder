import { useQuery } from '@tanstack/react-query';
// actions
import { getTicketListAction } from '../../../../../actions/userReports/getTicketListAction';

export const TICKET_LIST_QUERY_KEY = ['Ticket_List'] as const;
// test git
export const useGetTicketList = (id: string | string[]) => {
  return useQuery({
    queryKey: [...TICKET_LIST_QUERY_KEY, id],
    queryFn: () => getTicketListAction(id),
    initialData: [],  
    staleTime: 0,
    gcTime: 600000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 3,
    enabled: Boolean(id),
  });
};
