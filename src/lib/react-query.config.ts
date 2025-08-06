import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: () => {},
  }),

  mutationCache: new MutationCache({
    onError: () => {},
  }),

  defaultOptions: {
    queries: {
      retry: 3,
      refetchOnWindowFocus: false,
      throwOnError: false,
      staleTime: 0,
    },
  },
});
