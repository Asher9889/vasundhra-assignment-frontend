import { QueryClient } from '@tanstack/react-query';

// ONE global cache manager
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false, // Retry failed requests once
            refetchOnWindowFocus: false, // Disable refetching on window focus
            refetchOnReconnect: true, // Disable refetching on reconnect
            staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
            gcTime: 30 * 60 * 1000, // Unused data will be garbage collected after 30 minutes
        },
    },
});

export default queryClient; // inject it to react tree using provider.