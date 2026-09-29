import { QueryClient } from '@tanstack/react-query';

// Create a client for React Query with optimized cache settings
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false, // Disable refetch on window focus
      refetchOnReconnect: 'stale', // Only refetch if data is stale
    },
    mutations: {
      retry: 1,
    },
  },
});

export default queryClient;
