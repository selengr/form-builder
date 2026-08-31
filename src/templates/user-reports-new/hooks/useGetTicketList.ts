import { useQuery } from '@tanstack/react-query';
import { getTicketListAction } from '@actions/user-reports-new/getTicketListAction';

export const TICKET_LIST_QUERY_KEY = ['user-reports-new-Ticket_List'] as const;

export const useGetTicketList = (id: string | string[]) => {
  return useQuery({
    queryKey: [...TICKET_LIST_QUERY_KEY, id],
    queryFn: async () => {
      const res = await getTicketListAction(id);

      if (!res.success) {
        throw new Error(res.message || 'انجام عملیات با خطا مواجه شد');
      }

      return res.data.content;
    },
    initialData: [],
    staleTime: 0,
    gcTime: 600000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 3,
    enabled: Boolean(id),
  });
};
