
'use client';

import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
// Import other providers here if needed, e.g., ThemeProvider, QueryClientProvider

interface AppProvidersProps {
  children: ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <AuthProvider>
      {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem> */}
        {/* <QueryClientProvider client={queryClient}> */}
          {children}
          {isMounted && <Toaster />}
        {/* </QueryClientProvider> */}
      {/* </ThemeProvider> */}
    </AuthProvider>
  );
}
