'use client';

import type { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
// Import other providers here if needed, e.g., ThemeProvider, QueryClientProvider

interface AppProvidersProps {
  children: ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem> */}
        {/* <QueryClientProvider client={queryClient}> */}
          {children}
        {/* </QueryClientProvider> */}
      {/* </ThemeProvider> */}
    </AuthProvider>
  );
}
