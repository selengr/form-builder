'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchMenuServer } from '../../actions/menu';
import { IMenuResponseData } from '@/components/MiddleSidebar/type';

export default function useMenu(userInfo: any) {
  const query = useQuery<IMenuResponseData>({
    queryKey: ['menu', userInfo?.id],
    queryFn: async () => {
      const data = await fetchMenuServer();
      return data
    },
    enabled: !!userInfo,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  return {
    menu: query.data ?? null,
    loading: query.isPending,
    error: query.error,
  };
}
